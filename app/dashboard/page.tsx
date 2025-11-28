'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            setUser(session.user)
            setLoading(false)
        }

        checkUser()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="page-content">
                <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
                    <div className="shimmer glass-card" style={{ padding: 'var(--spacing-2xl)', width: '300px', height: '200px' }}></div>
                </div>
            </div>
        )
    }

    return (
        <div className="page-content">
            <div className="container">
                {/* Header */}
                <div className="flex justify-between items-center mb-xl fade-in">
                    <div>
                        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>🥖 FluffyBarkery</h1>
                        <p>Bienvenue, {user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="glass-button">
                        Déconnexion
                    </button>
                </div>

                {/* Quick actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
                    <Link href="/recipes/new">
                        <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', cursor: 'pointer', height: '100%' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>➕</div>
                            <h3>Nouvelle recette</h3>
                            <p>Créer une nouvelle recette de boulangerie</p>
                        </div>
                    </Link>

                    <Link href="/planning">
                        <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', cursor: 'pointer', height: '100%', animationDelay: '0.1s' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
                            <h3>Planning</h3>
                            <p>Planifier votre production</p>
                        </div>
                    </Link>

                    <Link href="/shopping">
                        <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', cursor: 'pointer', height: '100%', animationDelay: '0.2s' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>🛒</div>
                            <h3>Liste de courses</h3>
                            <p>Gérer vos achats d&apos;ingrédients</p>
                        </div>
                    </Link>

                    <Link href="/inventory">
                        <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', cursor: 'pointer', height: '100%', animationDelay: '0.3s' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>📦</div>
                            <h3>Inventaire</h3>
                            <p>Suivre votre stock d&apos;ingrédients</p>
                        </div>
                    </Link>
                </div>

                {/* Main sections */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', animationDelay: '0.4s' }}>
                        <div className="flex justify-between items-center mb-lg">
                            <h2 style={{ marginBottom: 0 }}>Mes recettes</h2>
                            <Link href="/recipes" className="glass-button">
                                Voir tout
                            </Link>
                        </div>
                        <p style={{ color: 'var(--color-text-tertiary)' }}>Aucune recette pour le moment</p>
                    </div>

                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-xl)', animationDelay: '0.5s' }}>
                        <div className="flex justify-between items-center mb-lg">
                            <h2 style={{ marginBottom: 0 }}>Production à venir</h2>
                            <Link href="/planning" className="glass-button">
                                Voir tout
                            </Link>
                        </div>
                        <p style={{ color: 'var(--color-text-tertiary)' }}>Aucune production planifiée</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
