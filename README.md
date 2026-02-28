# 🚀 Cardano Nyiragongo Hub

**Par Masu Data Business - Jacques MASURUKU**

Le Cardano Nyiragongo Hub est une plateforme communautaire dédiée à l'apprentissage, l'innovation et la collaboration autour de la blockchain Cardano à Nyiragongo, RDC.

## 🎯 Mission

Connecter Nyiragongo au futur du Web3 avec Cardano en offrant :
- Formation et éducation blockchain
- Événements communautaires
- Incubation de projets locaux
- Collaboration internationale

## 🛠 Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Styling** : Tailwind CSS + shadcn/ui
- **State Management** : React Query
- **Routing** : React Router v7

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/jacquesmasuruku2/nyiragongo-cardano-hub.git
cd nyiragongo-cardano-hub

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

## 🔧 Configuration Supabase

Exécutez les scripts SQL dans l'ordre :
1. `supabase/migrations/20260226065258_6e9f38f0-6606-4a74-82d5-a6638b6536b8.sql`
2. `supabase/migrations/20260227195124_5498e779-4e69-4186-86bb-b66cdd168b16.sql`

## 🌐 Déploiement

### Vercel
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement
```
VITE_SUPABASE_PROJECT_ID=aqsmxilxhvdasoxirgae
VITE_SUPABASE_PUBLISHABLE_KEY=[votre_clé]
VITE_SUPABASE_URL=https://aqsmxilxhvdasoxirgae.supabase.co
```

## 👤 Auteur

**Jacques MASURUKU**  
Fondateur - Masu Data Business  
📧 masudatabusiness@gmail.com  
🔗 [LinkedIn](https://cd.linkedin.com/in/jacques-mapenzi-masuruku-73266b245)

## 📄 Licence

© 2026 Masu Data Business. Tous droits réservés.
