# Déploiement sur Vercel - Guide rapide

## Prérequis
- Compte GitHub
- Compte Vercel (gratuit)
- Projet Supabase configuré

## Étapes de déploiement

### 1. Préparer le repository Git

```bash
# Initialiser le repository
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - FluffyBarkery PWA"

# Créer un repository sur GitHub et le lier
git remote add origin https://github.com/votre-username/fluffy-barkery.git
git branch -M main
git push -u origin main
```

### 2. Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New Project"
4. Importez votre repository `fluffy-barkery`
5. Vercel détectera automatiquement Next.js

### 3. Configurer les variables d'environnement

Dans les settings du projet Vercel :

1. Allez dans "Settings" → "Environment Variables"
2. Ajoutez les variables suivantes :

```
NEXT_PUBLIC_SUPABASE_URL=https://hcoghhuqohlkiffsmhj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjb2doaHVxb2hsa2lmZnNybWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc5NTQsImV4cCI6MjA3OTg5Mzk1NH0.OTxNxMqS8uRAwVGJ9n1D5Py6OxWly-qcmoAc7EfVrS0
SUPABASE_SERVICE_ROLE_KEY=sb_secret_JyeIneBLan7Rg7GAN_B2JA_dJF_bF6O
```

3. Sélectionnez "Production", "Preview", et "Development"
4. Cliquez sur "Save"

### 4. Déployer

1. Cliquez sur "Deploy"
2. Vercel va :
   - Installer les dépendances
   - Builder l'application
   - Déployer sur un CDN global

### 5. Accéder à votre application

Votre application sera disponible sur :
- `https://votre-projet.vercel.app`
- Vous pouvez configurer un domaine personnalisé dans les settings

## Mises à jour automatiques

Chaque push sur la branche `main` déclenchera automatiquement un nouveau déploiement.

```bash
# Faire des modifications
git add .
git commit -m "Ajout de nouvelles fonctionnalités"
git push

# Vercel déploie automatiquement !
```

## Configuration Supabase

N'oubliez pas d'exécuter le script SQL dans votre projet Supabase :

1. Allez dans votre projet Supabase
2. Ouvrez le "SQL Editor"
3. Copiez le contenu de `supabase-schema.sql`
4. Exécutez le script

## Vérification

Après le déploiement, testez :
- ✅ Inscription d'un nouveau compte
- ✅ Connexion
- ✅ Création d'une recette
- ✅ Planification de production
- ✅ Génération de liste de courses

## Support

En cas de problème :
- Vérifiez les logs dans Vercel Dashboard
- Vérifiez que les variables d'environnement sont correctes
- Vérifiez que le schéma SQL a été exécuté dans Supabase
