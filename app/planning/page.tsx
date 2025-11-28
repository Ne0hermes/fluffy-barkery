'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import type { ProductionPlan, Recipe } from '@/types/database'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProductionPlanWithRecipe extends ProductionPlan {
    recipes: Recipe
}

function PlanningContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [plans, setPlans] = useState<ProductionPlanWithRecipe[]>([])
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)

    // Form state
    const [selectedRecipe, setSelectedRecipe] = useState('')
    const [plannedDate, setPlannedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [startTime, setStartTime] = useState('06:00')
    const [quantityMultiplier, setQuantityMultiplier] = useState(1)
    const [notes, setNotes] = useState('')

    useEffect(() => {
        const checkAuthAndLoad = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            await Promise.all([loadPlans(), loadRecipes()])

            // Pre-select recipe from URL if provided
            const recipeId = searchParams.get('recipe')
            if (recipeId) {
                setSelectedRecipe(recipeId)
                setShowAddForm(true)
            }
        }

        checkAuthAndLoad()
    }, [router, searchParams])

    const loadPlans = async () => {
        try {
            const { data, error } = await supabase
                .from('production_plans')
                .select(`
          *,
          recipes (*)
        `)
                .order('planned_date', { ascending: true })
                .order('start_time', { ascending: true })

            if (error) throw error
            setPlans(data || [])
        } catch (error) {
            console.error('Error loading plans:', error)
        } finally {
            setLoading(false)
        }
    }

    const loadRecipes = async () => {
        try {
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('name')

            if (error) throw error
            setRecipes(data || [])
        } catch (error) {
            console.error('Error loading recipes:', error)
        }
    }

    const handleAddPlan = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return

            const { error } = await supabase
                .from('production_plans')
                .insert({
                    user_id: session.user.id,
                    recipe_id: selectedRecipe,
                    planned_date: plannedDate,
                    start_time: startTime,
                    quantity_multiplier: quantityMultiplier,
                    status: 'planned',
                    notes: notes || null,
                })

            if (error) throw error

            await loadPlans()
            setShowAddForm(false)
            setNotes('')
            setQuantityMultiplier(1)
        } catch (error) {
            console.error('Error adding plan:', error)
            alert('Erreur lors de l\'ajout de la planification')
        }
    }

    const handleDeletePlan = async (id: string) => {
        if (!confirm('Supprimer cette planification ?')) return

        try {
            const { error } = await supabase
                .from('production_plans')
                .delete()
                .eq('id', id)

            if (error) throw error
            await loadPlans()
        } catch (error) {
            console.error('Error deleting plan:', error)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('production_plans')
                .update({ status })
                .eq('id', id)

            if (error) throw error
            await loadPlans()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const formatTime = (minutes: number) => {
        if (minutes < 60) return `${minutes}min`
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        return mins > 0 ? `${hours}h${mins}` : `${hours}h`
    }

    const calculateEndTime = (startTime: string, totalMinutes: number) => {
        const [hours, minutes] = startTime.split(':').map(Number)
        const totalMins = hours * 60 + minutes + totalMinutes
        const endHours = Math.floor(totalMins / 60) % 24
        const endMins = totalMins % 60
        return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
    }

    const groupPlansByDate = () => {
        const grouped: { [key: string]: ProductionPlanWithRecipe[] } = {}
        plans.forEach(plan => {
            if (!grouped[plan.planned_date]) {
                grouped[plan.planned_date] = []
            }
            grouped[plan.planned_date].push(plan)
        })
        return grouped
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

    const groupedPlans = groupPlansByDate()

    return (
        <div className="page-content">
            <div className="container">
                <div className="flex justify-between items-center mb-xl fade-in">
                    <div>
                        <Link href="/dashboard" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-sm)', display: 'block' }}>
                            ← Retour au tableau de bord
                        </Link>
                        <h1>Planning de production</h1>
                    </div>
                    <button onClick={() => setShowAddForm(!showAddForm)} className="glass-button-primary">
                        {showAddForm ? '✕ Annuler' : '➕ Planifier'}
                    </button>
                </div>

                {/* Add form */}
                {showAddForm && (
                    <form onSubmit={handleAddPlan} className="glass-card fade-in mb-xl" style={{ padding: 'var(--spacing-xl)' }}>
                        <h3 className="mb-md">Nouvelle planification</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Recette *
                                </label>
                                <select
                                    className="glass-input"
                                    value={selectedRecipe}
                                    onChange={(e) => setSelectedRecipe(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner...</option>
                                    {recipes.map(recipe => (
                                        <option key={recipe.id} value={recipe.id}>
                                            {recipe.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    className="glass-input"
                                    value={plannedDate}
                                    onChange={(e) => setPlannedDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Heure de début *
                                </label>
                                <input
                                    type="time"
                                    className="glass-input"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Multiplicateur
                                </label>
                                <input
                                    type="number"
                                    className="glass-input"
                                    value={quantityMultiplier}
                                    onChange={(e) => setQuantityMultiplier(parseFloat(e.target.value) || 1)}
                                    min="0.1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="mt-md">
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Notes
                            </label>
                            <textarea
                                className="glass-input"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                                placeholder="Notes optionnelles..."
                            />
                        </div>

                        <div className="flex gap-md mt-lg">
                            <button type="submit" className="glass-button-primary">
                                Ajouter
                            </button>
                            <button type="button" onClick={() => setShowAddForm(false)} className="glass-button">
                                Annuler
                            </button>
                        </div>
                    </form>
                )}

                {/* Plans list */}
                {Object.keys(groupedPlans).length === 0 ? (
                    <div className="glass-card fade-in text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
                        <h2>Aucune production planifiée</h2>
                        <p className="mb-lg">Commencez par planifier votre première production</p>
                        <button onClick={() => setShowAddForm(true)} className="glass-button-primary">
                            Planifier maintenant
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-lg">
                        {Object.entries(groupedPlans).map(([date, datePlans], index) => (
                            <div key={date} className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', animationDelay: `${index * 0.05}s` }}>
                                <h3 className="mb-lg" style={{ color: 'var(--color-accent-primary)' }}>
                                    {format(new Date(date + 'T00:00:00'), 'EEEE d MMMM yyyy', { locale: fr })}
                                </h3>

                                <div className="flex flex-col gap-md">
                                    {datePlans.map(plan => {
                                        const totalTime = plan.recipes.prep_time_minutes + plan.recipes.rest_time_minutes + plan.recipes.baking_time_minutes
                                        const endTime = calculateEndTime(plan.start_time, totalTime)

                                        return (
                                            <div
                                                key={plan.id}
                                                className="glass-card"
                                                style={{ padding: 'var(--spacing-lg)', background: 'var(--color-bg-tertiary)' }}
                                            >
                                                <div className="flex justify-between items-start mb-md">
                                                    <div>
                                                        <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{plan.recipes.name}</h4>
                                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                                            {plan.start_time} → {endTime} ({formatTime(totalTime)})
                                                        </div>
                                                        {plan.quantity_multiplier !== 1 && (
                                                            <div style={{ fontSize: '0.85rem', color: 'var(--color-accent-primary)', marginTop: 'var(--spacing-xs)' }}>
                                                                ×{plan.quantity_multiplier} ({plan.recipes.yield_quantity * plan.quantity_multiplier} {plan.recipes.yield_unit})
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-sm">
                                                        <select
                                                            className="glass-input"
                                                            value={plan.status}
                                                            onChange={(e) => handleUpdateStatus(plan.id, e.target.value)}
                                                            style={{ width: 'auto', fontSize: '0.85rem' }}
                                                        >
                                                            <option value="planned">Planifié</option>
                                                            <option value="in_progress">En cours</option>
                                                            <option value="completed">Terminé</option>
                                                        </select>
                                                        <button
                                                            onClick={() => handleDeletePlan(plan.id)}
                                                            className="glass-button"
                                                            style={{ background: 'rgba(244, 117, 96, 0.1)', borderColor: 'var(--color-error)' }}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                {plan.notes && (
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                                                        📝 {plan.notes}
                                                    </div>
                                                )}

                                                {/* Timeline */}
                                                <div className="mt-md" style={{ paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-glass-border)' }}>
                                                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', fontSize: '0.85rem' }}>
                                                        {plan.recipes.prep_time_minutes > 0 && (
                                                            <div style={{
                                                                background: 'rgba(126, 179, 255, 0.1)',
                                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-sm)',
                                                                border: '1px solid rgba(126, 179, 255, 0.3)'
                                                            }}>
                                                                ⏱️ {formatTime(plan.recipes.prep_time_minutes)}
                                                            </div>
                                                        )}
                                                        {plan.recipes.rest_time_minutes > 0 && (
                                                            <div style={{
                                                                background: 'rgba(109, 212, 168, 0.1)',
                                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-sm)',
                                                                border: '1px solid rgba(109, 212, 168, 0.3)'
                                                            }}>
                                                                💤 {formatTime(plan.recipes.rest_time_minutes)}
                                                            </div>
                                                        )}
                                                        {plan.recipes.baking_time_minutes > 0 && (
                                                            <div style={{
                                                                background: 'rgba(244, 184, 96, 0.1)',
                                                                padding: 'var(--spacing-xs) var(--spacing-sm)',
                                                                borderRadius: 'var(--radius-sm)',
                                                                border: '1px solid rgba(244, 184, 96, 0.3)'
                                                            }}>
                                                                🔥 {formatTime(plan.recipes.baking_time_minutes)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function PlanningPage() {
    return (
        <Suspense fallback={
            <div className="page-content">
                <div className="container">
                    <div className="shimmer glass-card" style={{ padding: 'var(--spacing-2xl)', height: '300px' }}></div>
                </div>
            </div>
        }>
            <PlanningContent />
        </Suspense>
    )
}
