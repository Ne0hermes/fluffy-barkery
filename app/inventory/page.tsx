'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Ingredient } from '@/types/database'

export default function InventoryPage() {
    const router = useRouter()
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editQuantity, setEditQuantity] = useState(0)

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            await loadIngredients()
        }

        checkAuthAndLoad()
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
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStock = async (id: string, newQuantity: number) => {
        try {
            const { error } = await supabase
                .from('ingredients')
                .update({ stock_quantity: newQuantity })
                .eq('id', id)

            if (error) throw error
            await loadIngredients()
            setEditingId(null)
        } catch (error) {
            console.error('Error updating stock:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer cet ingrédient ?')) return

        try {
            const { error } = await supabase
                .from('ingredients')
                .delete()
                .eq('id', id)

            if (error) throw error
            await loadIngredients()
        } catch (error) {
            console.error('Error deleting ingredient:', error)
        }
    }

    if (loading) {
        return (
            <div className="page-content">
                <div className="container">
                    <div className="shimmer glass-card" style={{ padding: 'var(--spacing-2xl)', height: '300px' }}></div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-content">
            <div className="container">
                <div className="flex justify-between items-center mb-xl fade-in">
                    <div>
                        <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
                            ← Retour au tableau de bord
                        </Link>
                        <h1>Inventaire</h1>
                    </div>
                    <Link href="/recipes/new">
                        <button className="glass-button">
                            ➕ Gérer dans les recettes
                        </button>
                    </Link>
                </div>

                {ingredients.length === 0 ? (
                    <div className="glass-card fade-in text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
                        <h2>Aucun ingrédient</h2>
                        <p className="mb-lg">Créez vos premiers ingrédients lors de la création d&apos;une recette</p>
                        <Link href="/recipes/new">
                            <button className="glass-button-primary">
                                Créer une recette
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)' }}>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-glass-border)' }}>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Ingrédient
                                        </th>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Unité
                                        </th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Stock
                                        </th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ingredients.map((ingredient, index) => (
                                        <tr
                                            key={ingredient.id}
                                            className="fade-in"
                                            style={{
                                                borderBottom: '1px solid var(--color-glass-border)',
                                                animationDelay: `${index * 0.03}s`
                                            }}
                                        >
                                            <td style={{ padding: 'var(--spacing-md)' }}>
                                                <span style={{ fontWeight: '500' }}>{ingredient.name}</span>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                                                {ingredient.unit}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                                {editingId === ingredient.id ? (
                                                    <div className="flex gap-sm justify-end">
                                                        <input
                                                            type="number"
                                                            className="glass-input"
                                                            value={editQuantity}
                                                            onChange={(e) => setEditQuantity(parseFloat(e.target.value) || 0)}
                                                            style={{ width: '100px' }}
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateStock(ingredient.id, editQuantity)}
                                                            className="glass-button"
                                                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                                        >
                                                            ✓
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="glass-button"
                                                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        onClick={() => {
                                                            setEditingId(ingredient.id)
                                                            setEditQuantity(ingredient.stock_quantity)
                                                        }}
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight: '600',
                                                            color: ingredient.stock_quantity < 100 ? 'var(--color-warning)' : 'var(--color-success)',
                                                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                            borderRadius: 'var(--radius-sm)',
                                                            background: ingredient.stock_quantity < 100 ? 'rgba(244, 184, 96, 0.1)' : 'rgba(109, 212, 168, 0.1)',
                                                        }}
                                                    >
                                                        {ingredient.stock_quantity} {ingredient.unit}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => handleDelete(ingredient.id)}
                                                    className="glass-button"
                                                    style={{
                                                        background: 'rgba(244, 117, 96, 0.1)',
                                                        borderColor: 'var(--color-error)',
                                                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                        fontSize: '0.85rem'
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-lg" style={{ padding: 'var(--spacing-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                                💡 Astuce : Cliquez sur la quantité en stock pour la modifier rapidement
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
