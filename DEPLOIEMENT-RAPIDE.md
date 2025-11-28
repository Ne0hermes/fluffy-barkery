# 🚀 Guide de déploiement rapide

## Étape 1 : Créer un repository GitHub

1. Allez sur https://github.com/new
2. Nom du repository : `fluffy-barkery`
3. Laissez-le **Public** ou **Private** (selon votre préférence)
4. **NE COCHEZ PAS** "Initialize with README" (déjà fait)
5. Cliquez sur **"Create repository"**

## Étape 2 : Pousser le code sur GitHub

GitHub vous donnera des commandes. Utilisez celles-ci dans le terminal :

```bash
# Remplacez VOTRE-USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE-USERNAME/fluffy-barkery.git
git branch -M main
git push -u origin main
```

**OU** copiez les commandes exactes que GitHub vous donne après la création du repository.

## Étape 3 : Déployer sur Vercel

### A. Créer un compte Vercel (si nécessaire)

1. Allez sur https://vercel.com/signup
2. Connectez-vous avec votre compte GitHub

### B. Importer le projet

1. Sur Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez votre repository `fluffy-barkery`
3. Cliquez sur **"Import"**

### C. Configurer les variables d'environnement

**IMPORTANT** : Avant de déployer, ajoutez les variables d'environnement :

1. Dans la section **"Environment Variables"**, ajoutez :

```
NEXT_PUBLIC_SUPABASE_URL
https://hcoghhuqohlkiffsrmhj.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjb2doaHVxb2hsa2lmZnNybWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTc5NTQsImV4cCI6MjA3OTg5Mzk1NH0.OTxNxMqS8uRAwVGJ9n1D5Py6OxWly-qcmoAc7EfVrS0

SUPABASE_SERVICE_ROLE_KEY
sb_secret_JyeIneBLan7Rg7GAN_B2JA_dJF_bF6O
```

2. Cliquez sur **"Deploy"**

## Étape 4 : Attendre le déploiement

Vercel va :
- ✅ Installer les dépendances
- ✅ Builder l'application
- ✅ Déployer sur un CDN global

Cela prend environ **2-3 minutes**.

## Étape 5 : Accéder à votre application

Une fois le déploiement terminé :

1. Vercel vous donnera une URL : `https://fluffy-barkery-xxx.vercel.app`
2. **Partagez cette URL** avec votre femme
3. Elle pourra l'ouvrir sur son téléphone et même **l'installer comme une app** !

## 📱 Installation sur téléphone

### Sur iPhone (Safari) :
1. Ouvrir l'URL dans Safari
2. Appuyer sur le bouton "Partager" (carré avec flèche)
3. Faire défiler et appuyer sur "Sur l'écran d'accueil"
4. Appuyer sur "Ajouter"

### Sur Android (Chrome) :
1. Ouvrir l'URL dans Chrome
2. Appuyer sur les 3 points (menu)
3. Appuyer sur "Ajouter à l'écran d'accueil"
4. Appuyer sur "Ajouter"

## 🎉 C'est tout !

Votre application est maintenant en ligne et accessible partout dans le monde !

---

## 🔄 Pour les mises à jour futures

Chaque fois que vous modifiez le code :

```bash
git add .
git commit -m "Description des modifications"
git push
```

Vercel redéploiera automatiquement ! 🚀
