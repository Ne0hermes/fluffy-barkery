'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { ProductionPlan, Recipe, RecipeIngredient, Ingredient } from '@/types/database'

interface IngredientNeed {
    ingredient: Ingredient
    totalNeeded: number
    inStock: number
    toBuy: number
}

export default function ShoppingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [shoppingList, setShoppingList] = useState<IngredientNeed[]>([])
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            // Set default dates (today to 7 days from now)
            const today = new Date()
            const nextWeek = new Date(today)
            nextWeek.setDate(nextWeek.getDate() + 7)

            setStartDate(today.toISOString().split('T')[0])
            setEndDate(nextWeek.toISOString().split('T')[0])

            setLoading(false)
        }

        checkAuth()
    }, [router])

    const generateShoppingList = useCallback(async () => {
        try {
            // Get production plans in date range
            const { data: plans, error: plansError } = await supabase
                .from('production_plans')
                .select(`
          *,
          recipes (
            *,
            recipe_ingredients (
              *,
              ingredients (*)
            )
          )
        `)
                .gte('planned_date', startDate)
                .lte('planned_date', endDate)
                .eq('status', 'planned')

            if (plansError) throw plansError

            // Get current stock
            const { data: ingredients, error: ingredientsError } = await supabase
                .from('ingredients')
                .select('*')

            if (ingredientsError) throw ingredientsError

            // Calculate needs
            const needs: { [key: string]: IngredientNeed } = {}

            plans?.forEach((plan: any) => {
                plan.recipes.recipe_ingredients?.forEach((ri: any) => {
                    const ingredient = ri.ingredients
                    const neededQty = ri.quantity * plan.quantity_multiplier

                    if (!needs[ingredient.id]) {
                        needs[ingredient.id] = {
                            ingredient,
                            totalNeeded: 0,
                            inStock: ingredient.stock_quantity,
                            toBuy: 0,
                        }
                    }

                    needs[ingredient.id].totalNeeded += neededQty
                })
            })

            // Calculate what to buy
            Object.values(needs).forEach(need => {
                need.toBuy = Math.max(0, need.totalNeeded - need.inStock)
            })

            setShoppingList(Object.values(needs).filter(n => n.toBuy > 0))
        } catch (error) {
            console.error('Error generating shopping list:', error)
        }
    }, [startDate, endDate])

    useEffect(() => {
        if (startDate && endDate) {
            generateShoppingList()
        }
    }, [startDate, endDate, generateShoppingList])

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
                <div className="mb-xl fade-in">
                    <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
                        ← Retour au tableau de bord
                    </Link>
                    <h1>Liste de courses</h1>
                    <p>Génération automatique basée sur vos productions planifiées</p>
                </div>

                {/* Date range selector */}
                <div className="glass-card fade-in mb-lg" style={{ padding: 'var(--spacing-xl)' }}>
                    <h3 className="mb-md">Période de production</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', maxWidth: '500px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Du
                            </label>
                            <input
                                type="date"
                                className="glass-input"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Au
                            </label>
                            <input
                                type="date"
                                className="glass-input"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Shopping list */}
                {shoppingList.length === 0 ? (
                    <div className="glass-card fade-in text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🛒</div>
                        <h2>Aucun achat nécessaire</h2>
                        <p className="mb-lg">
                            Vous avez suffisamment de stock pour la période sélectionnée,<br />
                            ou aucune production n&apos;est planifiée.
                        </p>
                        <Link href="/planning">
                            <button className="glass-button-primary">
                                Voir le planning
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)' }}>
                        <div className="flex justify-between items-center mb-lg">
                            <h2 style={{ marginBottom: 0 }}>Ingrédients à acheter</h2>
                            <button
                                onClick={() => {
                                    const text = shoppingList
                                        .map(item => `${Math.ceil(item.toBuy)} ${item.ingredient.unit} - ${item.ingredient.name}`)
                                        .join('\n')
                                    navigator.clipboard.writeText(text)
                                    alert('Liste copiée dans le presse-papier !')
                                }}
                                className="glass-button"
                            >
                                📋 Copier la liste
                            </button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-glass-border)' }}>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Ingrédient
                                        </th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            Besoin total
                                        </th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            En stock
                                        </th>
                                        <th style={{ textAlign: 'right', padding: 'var(--spacing-md)', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                            À acheter
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shoppingList.map((item, index) => (
                                        <tr
                                            key={item.ingredient.id}
                                            className="fade-in"
                                            style={{
                                                borderBottom: '1px solid var(--color-glass-border)',
                                                animationDelay: `${index * 0.03}s`
                                            }}
                                        >
                                            <td style={{ padding: 'var(--spacing-md)' }}>
                                                <span style={{ fontWeight: '500' }}>{item.ingredient.name}</span>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                                                {item.totalNeeded.toFixed(1)} {item.ingredient.unit}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>
                                                {item.inStock.toFixed(1)} {item.ingredient.unit}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: 'var(--color-accent-primary)',
                                                    background: 'rgba(232, 168, 124, 0.1)',
                                                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                    borderRadius: 'var(--radius-sm)',
                                                }}>
                                                    {Math.ceil(item.toBuy)} {item.ingredient.unit}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
