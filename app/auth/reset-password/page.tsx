'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isValidSession, setIsValidSession] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setIsValidSession(true)
            }
            setCheckingSession(false)
        }

        // Listen for auth state changes (when user clicks email link)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsValidSession(true)
                setCheckingSession(false)
            }
        })

        checkSession()

        return () => subscription.unsubscribe()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            return
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caracteres')
            return
        }

        setLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            })

            if (error) throw error

            setSuccess(true)
            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    if (checkingSession) {
        return (
            <div className="auth-page">
                <div className="shimmer auth-card" style={{ height: '300px' }}></div>
            </div>
        )
    }

    if (!isValidSession) {
        return (
            <div className="auth-page">
                <div className="auth-card fade-in text-center">
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>⚠️</div>
                    <h2>Lien invalide ou expire</h2>
                    <p className="mt-sm mb-lg">Ce lien de reinitialisation n&apos;est plus valide. Veuillez en demander un nouveau.</p>
                    <Link href="/auth/forgot-password" className="glass-button-primary" style={{ display: 'block', width: '100%', textAlign: 'center', padding: 'var(--spacing-md)' }}>
                        Demander un nouveau lien
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="text-center mb-xl">
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>🔐</div>
                    <h2>Nouveau mot de passe</h2>
                    <p className="mt-sm">Choisissez votre nouveau mot de passe</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(109, 212, 168, 0.1)',
                            border: '1px solid var(--color-success)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-success)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            Mot de passe modifie avec succes ! Redirection...
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                        <div>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                Nouveau mot de passe
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
                                minLength={6}
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
                                minLength={6}
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
                            {loading ? 'Modification...' : 'Modifier le mot de passe'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
