import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="auth-page">
            <div className="auth-card fade-in">
                <div className="text-center mb-xl">
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>🥖</div>
                    <h2>FluffyBarkery</h2>
                    <p className="mt-sm">Votre assistant de planification de production pour boulangerie artisanale</p>
                </div>

                <div className="flex flex-col gap-md">
                    <Link href="/auth/login" className="glass-button-primary" style={{ width: '100%', display: 'block', textAlign: 'center', padding: 'var(--spacing-md)' }}>
                        Se connecter
                    </Link>
                    <Link href="/auth/signup" className="glass-button" style={{ width: '100%', display: 'block', textAlign: 'center', padding: 'var(--spacing-md)' }}>
                        Creer un compte
                    </Link>
                </div>
            </div>
        </div>
    )
}
