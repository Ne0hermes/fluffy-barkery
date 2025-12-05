import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FluffyBarkery - Planification de Boulangerie',
    description: 'Application de planification de production pour boulangerie artisanale',
    manifest: '/manifest.json',
    themeColor: '#e8a87c',
    viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' },
            { url: '/icons/icon.svg', sizes: 'any' },
        ],
        apple: [
            { url: '/icons/icon.svg' },
        ],
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'FluffyBarkery',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={inter.className}>
                <div className="page-wrapper">
                    {children}
                </div>
            </body>
        </html>
    )
}
