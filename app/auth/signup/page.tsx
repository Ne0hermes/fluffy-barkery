'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères')
            return
        }

        setLoading(true)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            // Redirect to login or dashboard
            router.push('/auth/login?message=Compte créé avec succès')
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
                            <h2>Créer un compte</h2>
                            <p className="mt-sm">Commencez à planifier votre production</p>
                        </div>

                        <form onSubmit={handleSignup} className="flex flex-col gap-md">
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

                            <div>
                                <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="glass-input"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
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
                                {loading ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </form>

                        <div className="text-center mt-lg">
                            <p style={{ fontSize: '0.9rem' }}>
                                Déjà un compte ?{' '}
                                <Link href="/auth/login" style={{ color: 'var(--color-accent-primary)', fontWeight: '600' }}>
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
