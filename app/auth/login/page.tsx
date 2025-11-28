'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page-content">
            <div className="container">
                <div className="flex items-center justify-center" style={{ minHeight: '80vh' }}>
                    <div className="glass-card fade-in" style={{ padding: 'var(--spacing-2xl)', maxWidth: '450px', width: '100%' }}>
                        <div className="text-center mb-xl">
                            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🥖</h1>
                            <h2>Connexion</h2>
                            <p className="mt-sm">Accédez à votre espace de planification</p>
                        </div>

                        <form onSubmit={handleLogin} className="flex flex-col gap-md">
                            <div>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="glass-input"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="glass-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <Link href="/auth/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    Mot de passe oublie ?
                                </Link>
                            </div>

                            {error && (
                                <div style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    background: 'rgba(244, 117, 96, 0.1)',
                                    border: '1px solid var(--color-error)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-error)',
                                    fontSize: '0.9rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="glass-button-primary"
                                disabled={loading}
                                style={{ width: '100%', padding: 'var(--spacing-md)' }}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="text-center mt-lg">
                            <p style={{ fontSize: '0.9rem' }}>
                                Pas encore de compte ?{' '}
                                <Link href="/auth/signup" style={{ color: 'var(--color-accent-primary)', fontWeight: '600' }}>
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
