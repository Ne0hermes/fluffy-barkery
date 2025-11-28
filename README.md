# FluffyBarkery 🥖

Application web progressive (PWA) de planification de production pour boulangerie artisanale.

## Fonctionnalités

- 📝 **Gestion des recettes** : Créez et organisez vos recettes avec ingrédients, temps de préparation, repos et cuisson
- 📅 **Planning multi-jours** : Planifiez votre production sur plusieurs jours avec calcul automatique des horaires
- 🛒 **Liste de courses** : Générez automatiquement vos listes de courses et gérez votre inventaire
- 📱 **PWA** : Installable sur mobile et fonctionne hors ligne

## Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd FluffyBarkery
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

   a. Créez un projet sur [Supabase](https://supabase.com)
   
   b. Dans le SQL Editor de Supabase, exécutez le script `supabase-schema.sql`
   
   c. Copiez `.env.local.example` vers `.env.local` et remplissez vos clés :
   ```bash
   cp .env.local.example .env.local
   ```
   
   d. Récupérez vos clés dans Settings > API de votre projet Supabase

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## Déploiement sur Vercel

1. Pushez votre code sur GitHub

2. Importez le projet sur [Vercel](https://vercel.com)

3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Déployez !

## Technologies

- **Next.js 15** avec App Router
- **React 19**
- **TypeScript**
- **Supabase** (authentification et base de données)
- **CSS Glassmorphism** design moderne

## Structure du projet

```
FluffyBarkery/
├── app/
│   ├── auth/          # Pages d'authentification
│   ├── dashboard/     # Tableau de bord
│   ├── recipes/       # Gestion des recettes
│   ├── planning/      # Planification de production
│   ├── inventory/     # Gestion de l'inventaire
│   └── shopping/      # Listes de courses
├── components/        # Composants réutilisables
├── lib/              # Utilitaires et configuration
├── types/            # Types TypeScript
└── public/           # Assets statiques
```

## License

MIT
