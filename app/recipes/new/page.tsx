'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Ingredient } from '@/types/database'

interface RecipeIngredientInput {
    ingredient_id: string
    quantity: number
    order: number
}

export default function NewRecipePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [ingredients, setIngredients] = useState<Ingredient[]>([])

    // Form state
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [prepTime, setPrepTime] = useState(0)
    const [restTime, setRestTime] = useState(0)
    const [bakingTime, setBakingTime] = useState(0)
    const [bakingTemp, setBakingTemp] = useState<number | ''>('')
    const [yieldQuantity, setYieldQuantity] = useState(1)
    const [yieldUnit, setYieldUnit] = useState('pièces')

    const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredientInput[]>([])
    const [newIngredientName, setNewIngredientName] = useState('')
    const [newIngredientUnit, setNewIngredientUnit] = useState('g')

    useEffect(() => {
        const checkAuthAndLoadIngredients = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            await loadIngredients()
        }

        checkAuthAndLoadIngredients()
    }, [router])

    const loadIngredients = async () => {
        try {
            const { data, error } = await supabase
                .from('ingredients')
                .select('*')
                .order('name')

            if (error) throw error
            setIngredients(data || [])
        } catch (error) {
            console.error('Error loading ingredients:', error)
        }
    }

    const handleAddIngredient = async () => {
        if (!newIngredientName.trim()) return

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { data, error } = await supabase
                .from('ingredients')
                .insert({
                    user_id: session.user.id,
                    name: newIngredientName,
                    unit: newIngredientUnit,
                    stock_quantity: 0,
                })
                .select()
                .single()

            if (error) throw error

            setIngredients([...ingredients, data])
            setNewIngredientName('')
            setNewIngredientUnit('g')
        } catch (error) {
            console.error('Error adding ingredient:', error)
        }
    }

    const handleAddRecipeIngredient = () => {
        if (ingredients.length === 0) return

        setRecipeIngredients([
            ...recipeIngredients,
            {
                ingredient_id: ingredients[0].id,
                quantity: 0,
                order: recipeIngredients.length,
            },
        ])
    }

    const handleRemoveRecipeIngredient = (index: number) => {
        setRecipeIngredients(recipeIngredients.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            // Create recipe
            const { data: recipe, error: recipeError } = await supabase
                .from('recipes')
                .insert({
                    user_id: session.user.id,
                    name,
                    description: description || null,
                    prep_time_minutes: prepTime,
                    rest_time_minutes: restTime,
                    baking_time_minutes: bakingTime,
                    baking_temperature: bakingTemp || null,
                    yield_quantity: yieldQuantity,
                    yield_unit: yieldUnit,
                })
                .select()
                .single()

            if (recipeError) throw recipeError

            // Add recipe ingredients
            if (recipeIngredients.length > 0) {
                const ingredientsToInsert = recipeIngredients.map(ri => ({
                    recipe_id: recipe.id,
                    ingredient_id: ri.ingredient_id,
                    quantity: ri.quantity,
                    order: ri.order,
                }))

                const { error: ingredientsError } = await supabase
                    .from('recipe_ingredients')
                    .insert(ingredientsToInsert)

                if (ingredientsError) throw ingredientsError
            }

            router.push(`/recipes/${recipe.id}`)
        } catch (error) {
            console.error('Error creating recipe:', error)
            alert('Erreur lors de la création de la recette')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-content">
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="mb-xl fade-in">
                    <Link href="/recipes" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
                        ← Retour aux recettes
                    </Link>
                    <h1>Nouvelle recette</h1>
                </div>

                <form onSubmit={handleSubmit} className="glass-card fade-in" style={{ padding: 'var(--spacing-2xl)' }}>
                    {/* Basic info */}
                    <div className="mb-lg">
                        <h3 className="mb-md">Informations générales</h3>

                        <div className="mb-md">
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Nom de la recette *
                            </label>
                            <input
                                type="text"
                                className="glass-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Pain de campagne"
                            />
                        </div>

                        <div className="mb-md">
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Description
                            </label>
                            <textarea
                                className="glass-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Description de la recette..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                    </div>

                    {/* Times */}
                    <div className="mb-lg">
                        <h3 className="mb-md">Temps de préparation</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    ⏱️ Préparation (min)
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={prepTime}
                                    onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    💤 Repos (min)
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={restTime}
                                    onChange={(e) => setRestTime(parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    🔥 Cuisson (min)
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={bakingTime}
                                    onChange={(e) => setBakingTime(parseInt(e.target.value) || 0)}
                                    min="0"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    🌡️ Température (°C)
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={bakingTemp}
                                    onChange={(e) => setBakingTemp(e.target.value ? parseInt(e.target.value) : '')}
                                    min="0"
                                    placeholder="180"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Yield */}
                    <div className="mb-lg">
                        <h3 className="mb-md">Rendement</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Quantité
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={yieldQuantity}
                                    onChange={(e) => setYieldQuantity(parseInt(e.target.value) || 1)}
                                    min="1"
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Unité
                                </label>
                                <select
                                    className="glass-input"
                                    value={yieldUnit}
                                    onChange={(e) => setYieldUnit(e.target.value)}
                                >
                                    <option value="pièces">pièces</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="portions">portions</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-lg">
                        <div className="flex justify-between items-center mb-md">
                            <h3 style={{ marginBottom: 0 }}>Ingrédients</h3>
                            <button
                                type="button"
                                onClick={handleAddRecipeIngredient}
                                className="glass-button"
                                disabled={ingredients.length === 0}
                            >
                                ➕ Ajouter
                            </button>
                        </div>

                        {/* Quick add ingredient */}
                        <div className="glass-card mb-md" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-tertiary)' }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-tertiary)' }}>
                                Créer un nouvel ingrédient
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 'var(--spacing-sm)' }}>
                                <input
                                    type="text"
                                    className="glass-input"
                                    placeholder="Nom de l'ingrédient"
                                    value={newIngredientName}
                                    onChange={(e) => setNewIngredientName(e.target.value)}
                                />
                                <select
                                    className="glass-input"
                                    value={newIngredientUnit}
                                    onChange={(e) => setNewIngredientUnit(e.target.value)}
                                >
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="unité">unité</option>
                                </select>
                                <button type="button" onClick={handleAddIngredient} className="glass-button">
                                    Créer
                                </button>
                            </div>
                        </div>

                        {/* Recipe ingredients list */}
                        {recipeIngredients.map((ri, index) => (
                            <div key={index} className="mb-sm" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 'var(--spacing-sm)', alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                                        Ingrédient
                                    </label>
                                    <select
                                        className="glass-input"
                                        value={ri.ingredient_id}
                                        onChange={(e) => {
                                            const newIngredients = [...recipeIngredients]
                                            newIngredients[index].ingredient_id = e.target.value
                                            setRecipeIngredients(newIngredients)
                                        }}
                                    >
                                        {ingredients.map(ing => (
                                            <option key={ing.id} value={ing.id}>
                                                {ing.name} ({ing.unit})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: 'var(--spacing-xs)', fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                                        Quantité
                                    </label>
                                    <input
                                        type="number"
                                        className="glass-input"
                                        value={ri.quantity}
                                        onChange={(e) => {
                                            const newIngredients = [...recipeIngredients]
                                            newIngredients[index].quantity = parseFloat(e.target.value) || 0
                                            setRecipeIngredients(newIngredients)
                                        }}
                                        min="0"
                                        step="0.1"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveRecipeIngredient(index)}
                                    className="glass-button"
                                    style={{ background: 'rgba(244, 117, 96, 0.1)', borderColor: 'var(--color-error)' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex gap-md justify-end">
                        <Link href="/recipes">
                            <button type="button" className="glass-button">
                                Annuler
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="glass-button-primary"
                            disabled={loading || !name}
                        >
                            {loading ? 'Création...' : 'Créer la recette'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
