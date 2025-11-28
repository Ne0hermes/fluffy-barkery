'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Recipe } from '@/types/database'

export default function RecipesPage() {
    const router = useRouter()
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuthAndLoadRecipes = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            await loadRecipes()
        }

        checkAuthAndLoadRecipes()
    }, [router])

    const loadRecipes = async () => {
        try {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setRecipes(data || [])
        } catch (error) {
            console.error('Error loading recipes:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h${mins}` : `${hours}h`
    }

    if (loading) {
        return (
            <div className="page-content">
                <div className="container">
                    <div className="shimmer glass-card" style={{ padding: 'var(--spacing-2xl)', height: '200px' }}></div>
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
                        <h1>Mes recettes</h1>
                    </div>
                    <Link href="/recipes/new">
                        <button className="glass-button-primary">
                            ➕ Nouvelle recette
                        </button>
                    </Link>
                </div>

                {recipes.length === 0 ? (
                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
                        <h2>Aucune recette</h2>
                        <p className="mb-lg">Commencez par créer votre première recette</p>
                        <Link href="/recipes/new">
                            <button className="glass-button-primary">
                                Créer une recette
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
                        {recipes.map((recipe, index) => (
                            <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
                                <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', cursor: 'pointer', height: '100%', animationDelay: `${index * 0.05}s` }}>
                                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>{recipe.name}</h3>
                                    {recipe.description && (
                                        <p style={{ marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>{recipe.description}</p>
                                    )}

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginTop: 'var(--spacing-lg)' }}>
                                        {recipe.prep_time_minutes > 0 && (
                                            <div style={{
                                                background: 'var(--color-glass-bg)',
                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.85rem',
                                                border: '1px solid var(--color-glass-border)'
                                            }}>
                                                ⏱️ Prépa: {formatTime(recipe.prep_time_minutes)}
                                            </div>
                                        )}
                                        {recipe.rest_time_minutes > 0 && (
                                            <div style={{
                                                background: 'var(--color-glass-bg)',
                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.85rem',
                                                border: '1px solid var(--color-glass-border)'
                                            }}>
                                                💤 Repos: {formatTime(recipe.rest_time_minutes)}
                                            </div>
                                        )}
                                        {recipe.baking_time_minutes > 0 && (
                                            <div style={{
                                                background: 'var(--color-glass-bg)',
                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.85rem',
                                                border: '1px solid var(--color-glass-border)'
                                            }}>
                                                🔥 Cuisson: {formatTime(recipe.baking_time_minutes)}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--color-text-tertiary)' }}>
                                        Rendement: {recipe.yield_quantity} {recipe.yield_unit}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
