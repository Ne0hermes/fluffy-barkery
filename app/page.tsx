import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="page-content">
            <div className="container">
                <div className="flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
                    <div className="text-center fade-in">
                        <h1 className="mb-lg">🥖 FluffyBarkery</h1>
                        <p className="mb-xl" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
                            Votre assistant de planification de production pour boulangerie artisanale
                        </p>

                        <div className="flex gap-md justify-center" style={{ flexWrap: 'wrap' }}>
                            <Link href="/auth/login">
                                <button className="glass-button-primary">
                                    Se connecter
                                </button>
                            </Link>
                            <Link href="/auth/signup">
                                <button className="glass-button">
                                    Créer un compte
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-2xl" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', width: '100%', maxWidth: '900px' }}>
                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📝</div>
                            <h3>Gestion des recettes</h3>
                            <p>Créez et organisez vos recettes avec ingrédients, temps de préparation, repos et cuisson</p>
                        </div>

                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📅</div>
                            <h3>Planning multi-jours</h3>
                            <p>Planifiez votre production sur plusieurs jours avec calcul automatique des horaires</p>
                        </div>

                        <div className="glass-card" style={{ padding: 'var(--spacing-xl)' }}>
                            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🛒</div>
                            <h3>Liste de courses</h3>
                            <p>Générez automatiquement vos listes de courses et gérez votre inventaire</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
