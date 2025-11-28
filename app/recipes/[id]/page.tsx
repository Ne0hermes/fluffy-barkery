'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Recipe, RecipeIngredient, Ingredient } from '@/types/database'

interface RecipeWithIngredientsData extends Recipe {
    recipe_ingredients: (RecipeIngredient & {
        ingredients: Ingredient
    })[]
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [recipe, setRecipe] = useState<RecipeWithIngredientsData | null>(null)
    const [loading, setLoading] = useState(true)

    const loadRecipe = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('recipes')
                .select(`
          *,
          recipe_ingredients (
            *,
            ingredients (*)
          )
        `)
                .eq('id', params.id)
                .single()

            if (error) throw error
            setRecipe(data)
        } catch (error) {
            console.error('Error loading recipe:', error)
        } finally {
            setLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        const checkAuthAndLoadRecipe = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            await loadRecipe()
        }

        checkAuthAndLoadRecipe()
    }, [router, loadRecipe])

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) return

        try {
            const { error } = await supabase
                .from('recipes')
                .delete()
                .eq('id', params.id)

            if (error) throw error
            router.push('/recipes')
        } catch (error) {
            console.error('Error deleting recipe:', error)
            alert('Erreur lors de la suppression')
        }
    }

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h${mins}` : `${hours}h`
    }

    const getTotalTime = () => {
        if (!recipe) return 0
        return recipe.prep_time_minutes + recipe.rest_time_minutes + recipe.baking_time_minutes
    }

    if (loading) {
        return (
            <div className="page-content">
                <div className="container">
                    <div className="shimmer glass-card" style={{ padding: 'var(--spacing-2xl)', height: '400px' }}></div>
                </div>
            </div>
        )
    }

    if (!recipe) {
        return (
            <div className="page-content">
                <div className="container">
                    <div className="glass-card text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <h2>Recette non trouvée</h2>
                        <Link href="/recipes" className="glass-button mt-lg">
                            Retour aux recettes
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-content">
            <div className="container" style={{ maxWidth: '900px' }}>
                <div className="mb-lg fade-in">
                    <Link href="/recipes" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
                        ← Retour aux recettes
                    </Link>
                </div>

                <div className="glass-card fade-in" style={{ padding: 'var(--spacing-2xl)' }}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-xl">
                        <div>
                            <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>{recipe.name}</h1>
                            {recipe.description && <p>{recipe.description}</p>}
                        </div>
                        <button onClick={handleDelete} className="glass-button" style={{ background: 'rgba(244, 117, 96, 0.1)', borderColor: 'var(--color-error)' }}>
                            🗑️ Supprimer
                        </button>
                    </div>

                    {/* Times overview */}
                    <div className="glass-card mb-xl" style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-tertiary)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-lg)' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
                                    ⏱️ Préparation
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-accent-primary)' }}>
                                    {formatTime(recipe.prep_time_minutes)}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
                                    💤 Repos
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-accent-primary)' }}>
                                    {formatTime(recipe.rest_time_minutes)}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
                                    🔥 Cuisson
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-accent-primary)' }}>
                                    {formatTime(recipe.baking_time_minutes)}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-xs)' }}>
                                    ⏰ Temps total
                                </div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--color-accent-primary)' }}>
                                    {formatTime(getTotalTime())}
                                </div>
                            </div>
                        </div>

                        {recipe.baking_temperature && (
                            <div className="mt-md" style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-glass-border)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>🌡️ Température de cuisson: </span>
                                <span style={{ fontSize: '1rem', fontWeight: '600' }}>{recipe.baking_temperature}°C</span>
                            </div>
                        )}
                    </div>

                    {/* Yield */}
                    <div className="mb-xl">
                        <h3 className="mb-md">Rendement</h3>
                        <div className="glass-card" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-tertiary)', display: 'inline-block' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                                {recipe.yield_quantity} {recipe.yield_unit}
                            </span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
                        <div>
                            <h3 className="mb-md">Ingrédients</h3>
                            <div className="glass-card" style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-tertiary)' }}>
                                {recipe.recipe_ingredients
                                    .sort((a, b) => a.order - b.order)
                                    .map((ri) => (
                                        <div
                                            key={ri.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: 'var(--spacing-sm) 0',
                                                borderBottom: '1px solid var(--color-glass-border)',
                                            }}
                                        >
                                            <span>{ri.ingredients.name}</span>
                                            <span style={{ fontWeight: '600', color: 'var(--color-accent-primary)' }}>
                                                {ri.quantity} {ri.ingredients.unit}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-md mt-xl">
                        <Link href={`/planning?recipe=${recipe.id}`} className="glass-button-primary">
                            📅 Planifier cette recette
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
