'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (error) throw error

            setSuccess(true)
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
                            <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🔑</h1>
                            <h2>Mot de passe oublie</h2>
                            <p className="mt-sm">Entrez votre email pour recevoir un lien de reinitialisation</p>
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
                                    Un email de reinitialisation a ete envoye a {email}
                                </div>
                                <Link href="/auth/login" className="glass-button" style={{ display: 'inline-block' }}>
                                    Retour a la connexion
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
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
                                    {loading ? 'Envoi...' : 'Envoyer le lien'}
                                </button>

                                <div className="text-center mt-md">
                                    <Link href="/auth/login" style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        Retour a la connexion
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
