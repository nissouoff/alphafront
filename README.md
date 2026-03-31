# ShopLaunch Frontend

Frontend pour ShopLaunch - une plateforme de création de landing pages pour le marché algérien.

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Vercel (Hébergement)

## Déploiement sur Vercel

### Méthode 1: Via Vercel Dashboard

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur **"Add New..."** > **"Project"**
3. Importez votre repository GitHub
4. Configurez le projet:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (laisser par défaut)
   - **Build Command:** `npm run build` (par défaut)
   - **Output Directory:** `.next` (par défaut)

5. Ajoutez les **Environment Variables**:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
   NEXT_PUBLIC_API_URL=https://votre_backend.onrender.com/api
   NEXT_PUBLIC_BASE_URL=https://votre_backend.onrender.com
   ```

6. Cliquez sur **Deploy**

### Méthode 2: Via Vercel CLI

```bash
# Installez Vercel CLI
npm i -g vercel

# Connectez-vous
vercel login

# Déployez
vercel

# Pour un déploiement en production
vercel --prod
```

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Clé API Firebase | `AIza...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domaine Auth Firebase | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID du projet Firebase | `my-project` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket de stockage | `my-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | `1:123:web:abc` |
| `NEXT_PUBLIC_API_URL` | URL de l'API backend | `https://api.example.com/api` |
| `NEXT_PUBLIC_BASE_URL` | URL de base du backend | `https://api.example.com` |

## Installation locale

```bash
# Cloner le projet
git clone https://github.com/votre-username/shoplaunch-frontend.git
cd shoplaunch-frontend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp .env.example .env.local
# Modifier .env.local avec vos credentials

# Démarrer le serveur de développement
npm run dev
```

## Structure du projet

```
front/
├── app/                    # Pages Next.js (App Router)
│   ├── template/          # Templates de landing pages
│   ├── shop/              # Pages boutique
│   ├── editor/            # Éditeurs
│   ├── dashboard/         # Tableau de bord utilisateur
│   └── ...
├── lib/                   # Bibliothèques et utilitaires
├── context/               # React Context
├── components/            # Composants réutilisables
└── public/               # Fichiers statiques
```

## Obtenir les credentials Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Cliquez sur l'icône **</>** (Configuration Web)
4. Copiez la configuration et ajoutez-la aux variables d'environnement

## Licence

ISC
