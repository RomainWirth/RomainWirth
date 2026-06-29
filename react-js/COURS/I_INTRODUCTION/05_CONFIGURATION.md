# Configurer un projet React

## Table des matières

- [Introduction](#introduction)
- [Configuration manuelle (culture générale)](#configuration-manuelle-culture-générale)
  - [Outils nécessaires](#outils-nécessaires)
  - [Installation des dépendances](#installation-des-dépendances)
  - [Structure du projet](#structure-du-projet)
  - [Création des fichiers](#création-des-fichiers)
  - [Configuration des scripts](#configuration-des-scripts)
  - [Lancement du projet](#lancement-du-projet)
- [Créer une application via CRA](#créer-une-application-via-cra-create-react-app)
- [Initialiser un projet via Vite (recommandé)](#initialiser-un-projet-via-vite-recommandé)
- [Différences entre CRA et Vite](#différences-entre-cra-et-vite)
- [Récapitulatif des commandes](#récapitulatif-des-commandes)
- [Points à retenir](#points-à-retenir)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

Il existe plusieurs façons de créer une application React :

| Méthode | Complexité | Recommandation |
|---------|------------|----------------|
| **Vite** | Simple | ✅ Recommandé |
| **Create React App (CRA)** | Simple | ⚠️ Déprécié |
| **Configuration manuelle** | Avancée | Pour comprendre le fonctionnement |

```
┌─────────────────────────────────────────────────────────┐
│           MÉTHODES DE CONFIGURATION REACT               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Configuration manuelle                                │
│   ──────────────────────                                │
│   Webpack + Babel → Configuration complète              │
│   Culture générale, comprendre le fonctionnement        │
│         │                                               │
│         ▼                                               │
│   Create React App (CRA)                                │
│   ──────────────────────                                │
│   npx create-react-app mon-app                          │
│   ⚠️ Déprécié, plus maintenu activement                │
│         │                                               │
│         ▼                                               │
│   Vite ✅                                               │
│   ──────                                                │
│   npm create vite@latest mon-app                        │
│   Rapide, moderne, recommandé                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

> Historiquement, pour créer simplement une application React, on utilisait :  
> `npx create-react-app app-name`  
> Sur la nouvelle [documentation](https://fr.react.dev/learn/start-a-new-react-project), on crée une application React via **Vite**.

---

## Configuration manuelle (culture générale)

Cette section explique comment configurer manuellement un projet React avec **Webpack** et **Babel**.  
C'est utile pour comprendre le fonctionnement interne, mais **Vite automatise tout cela**.

### Outils nécessaires

| Outil | Rôle |
|-------|------|
| **Babel** | Compilateur qui transforme le JSX en JavaScript compréhensible par les navigateurs |
| **Webpack** | Bundler qui regroupe tous les fichiers, modules et dépendances en assets statiques |

```
┌─────────────────────────────────────────────────────────┐
│               RÔLE DE BABEL ET WEBPACK                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Fichiers source          Babel          Navigateur    │
│   ──────────────           ─────          ──────────    │
│   App.jsx (JSX)   ──────►  Compile  ────► App.js        │
│   index.js                 JSX → JS       (ES5/ES6)     │
│                                │                        │
│                                ▼                        │
│                            Webpack                      │
│                            ───────                      │
│                            Regroupe ───► bundle.js      │
│                            les fichiers  (optimisé)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Installation des dépendances

**Avec npm :**

```bash
# Initialiser le projet
npm init -y

# Dépendances de production
npm install react@latest react-dom@latest

# Dépendances de développement
npm install -D webpack webpack-cli webpack-dev-server
npm install -D @babel/core babel-loader @babel/preset-react @babel/preset-env
npm install -D html-webpack-plugin
```

**Avec Yarn :**

```bash
# Initialiser le projet
yarn init -y

# Dépendances de production
yarn add react@latest react-dom@latest

# Dépendances de développement
yarn add -D webpack webpack-cli webpack-dev-server
yarn add -D @babel/core babel-loader @babel/preset-react @babel/preset-env
yarn add -D html-webpack-plugin
```

**Rôle de chaque dépendance :**

| Package | Type | Rôle |
|---------|------|------|
| `react` | Production | Bibliothèque React |
| `react-dom` | Production | Rendu dans le DOM |
| `webpack` | Dev | Bundler principal |
| `webpack-cli` | Dev | Interface en ligne de commande |
| `webpack-dev-server` | Dev | Serveur de développement avec HMR |
| `@babel/core` | Dev | Compilateur Babel |
| `babel-loader` | Dev | Plugin Webpack pour Babel |
| `@babel/preset-react` | Dev | Compilation du JSX |
| `@babel/preset-env` | Dev | Compilation ES6+ → ES5 |
| `html-webpack-plugin` | Dev | Génération du fichier HTML |

### Structure du projet

```
mon-projet/
├── node_modules/
├── src/
│   ├── components/
│   │   └── App.js        ← Composant principal
│   ├── index.html        ← Template HTML
│   └── index.js          ← Point d'entrée
├── package.json
├── package-lock.json     ← (ou yarn.lock)
└── webpack.config.js     ← Configuration Webpack
```

### Création des fichiers

#### `src/components/App.js`

```jsx
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World !</h1>
      </div>
    );
  }
}

export default App;
```

#### `src/index.html`

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma première app React</title>
</head>

<body>
  <!-- Point de montage React -->
  <div id="root"></div>
</body>

</html>
```

#### `src/index.js`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

#### `webpack.config.js` (à la racine)

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Mode de compilation
  mode: 'development',

  // Point d'entrée
  entry: './src/index.js',

  // Point de sortie
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },

  // Plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],

  // Règles de compilation
  module: {
    rules: [
      {
        test: /\.js$/,             // Fichiers .js
        exclude: /node_modules/,   // Exclure node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      }
    ]
  }
};
```

**Explication de la configuration Webpack :**

| Propriété | Description |
|-----------|-------------|
| `mode` | `development` (lisible) ou `production` (minifié) |
| `entry` | Point d'entrée de l'application |
| `output.path` | Dossier de destination du bundle |
| `output.filename` | Nom du fichier bundle généré |
| `plugins` | Liste des plugins Webpack |
| `module.rules` | Règles de transformation des fichiers |
| `test` | Expression régulière pour cibler les fichiers |
| `exclude` | Fichiers/dossiers à ignorer |
| `loader` | Outil de transformation à utiliser |
| `presets` | Configurations Babel à appliquer |

### Configuration des scripts

#### `package.json`

```json
{
  "name": "mon-projet-react",
  "version": "1.0.0",
  "scripts": {
    "start": "webpack-dev-server --mode development --open --hot",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.28.4",
    "@babel/preset-env": "^7.28.3",
    "@babel/preset-react": "^7.27.1",
    "babel-loader": "^10.0.0",
    "html-webpack-plugin": "^5.6.4",
    "webpack": "^5.102.0",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.2"
  }
}
```

**Explication des scripts :**

| Script | Commande | Description |
|--------|----------|-------------|
| `start` | `npm start` / `yarn start` | Lance le serveur de développement |
| `build` | `npm run build` / `yarn build` | Génère le bundle de production |

**Options du script `start` :**

| Option | Description |
|--------|-------------|
| `webpack-dev-server` | Lance le serveur de développement |
| `--mode development` | Mode développement (code lisible) |
| `--open` | Ouvre automatiquement le navigateur |
| `--hot` | Active le Hot Module Replacement (HMR) |

### Lancement du projet

**Avec npm :**

```bash
# Lancer le serveur de développement
npm start

# Générer le build de production
npm run build
```

**Avec Yarn :**

```bash
# Lancer le serveur de développement
yarn start

# Générer le build de production
yarn build
```

**Résultat du build (`/dist`) :**

```
dist/
├── bundle.js               ← Code JavaScript minifié
├── bundle.js.LICENSE.txt   ← Licences des dépendances
└── index.html              ← Page HTML avec bundle injecté
```

---

## Créer une application via CRA (Create React App)

> ⚠️ **CRA n'est plus maintenu activement. Privilégiez Vite pour les nouveaux projets.**

**Avec npm :**

```bash
npx create-react-app mon-app
cd mon-app
npm start
```

**Avec Yarn :**

```bash
yarn create react-app mon-app
cd mon-app
yarn start
```

**Structure générée par CRA :**

```
mon-app/
├── node_modules/
├── public/
│   ├── index.html       ← Template HTML (dans /public)
│   └── favicon.ico
├── src/
│   ├── App.js           ← Composant principal
│   ├── App.css
│   ├── App.test.js      ← Tests préconfigurés (Jest)
│   ├── index.js         ← Point d'entrée
│   └── index.css
├── package.json
└── README.md
```

**Scripts disponibles :**

| Commande | Description |
|----------|-------------|
| `npm start` | Lance le serveur sur le port **3000** |
| `npm run build` | Build de production dans `/build` |
| `npm test` | Lance les tests avec Jest |
| `npm run eject` | ⚠️ Expose la configuration (irréversible) |

**Inconvénients de CRA :**

| Problème | Description |
|----------|-------------|
| **Maintenance** | Plus activement maintenu |
| **Performance** | Webpack plus lent que Vite |
| **Configuration** | Difficile à personnaliser (`eject` nécessaire) |
| **Taille** | Bundle plus volumineux |
| **Démarrage** | Plus lent que Vite |

---

## Initialiser un projet via Vite (recommandé)

[Documentation Vite](https://vite.dev/guide/)

**Avec npm :**

```bash
npm create vite@latest mon-app
cd mon-app
npm install
npm run dev
```

**Avec Yarn :**

```bash
yarn create vite mon-app
cd mon-app
yarn
yarn dev
```

**Lors de l'initialisation, sélectionner :**

```
✔ Project name: mon-app
✔ Select a framework: React
✔ Select a variant: JavaScript
```

**Structure générée par Vite :**

```
mon-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx           ← Composant principal
│   ├── App.css
│   ├── main.jsx          ← Point d'entrée
│   └── index.css
├── index.html            ← À la racine (différence avec CRA)
├── package.json
├── vite.config.js        ← Configuration Vite
└── eslint.config.js      ← Configuration ESLint
```

**Scripts disponibles :**

| Commande npm | Commande Yarn | Description |
|--------------|---------------|-------------|
| `npm run dev` | `yarn dev` | Serveur de développement (port **5173**) |
| `npm run build` | `yarn build` | Build de production dans `/dist` |
| `npm run preview` | `yarn preview` | Prévisualise le build de production |
| `npm run lint` | `yarn lint` | Vérifie le code avec ESLint |

**Changer le port par défaut :**

```js
// filepath: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Remplace le port 5173 par défaut
  }
})
```

**Désactiver les warnings prop-types dans ESLint :**

```js
// filepath: eslint.config.js
export default [
  // ...existing config...
  {
    rules: {
      'react/prop-types': 'off',
    }
  }
]
```

---

## Différences entre CRA et Vite

```
┌─────────────────────────────────────────────────────────┐
│              CRA vs VITE                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   CRA                          Vite                     │
│   ───                          ────                     │
│   Webpack (lent)               Rollup + ESBuild         │
│   Port 3000                    Port 5173                │
│   /public/index.html           /index.html (racine)     │
│   src/index.js                 src/main.jsx             │
│   Tests préconfigurés          Config manuelle          │
│   ⚠️ Déprécié                  ✅ Recommandé            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Aspect | Create React App | Vite |
|--------|-----------------|------|
| **Bundler** | Webpack | Rollup + ESBuild |
| **Vitesse de démarrage** | Lent | Instantané |
| **Hot Reload** | Lent | Très rapide |
| **`index.html`** | Dans `/public` | À la racine |
| **Point d'entrée** | `src/index.js` | `src/main.jsx` |
| **Port par défaut** | 3000 | 5173 |
| **Tests préconfigurés** | ✅ Jest + RTL | ❌ (configuration manuelle) |
| **ESLint** | Intégré | `eslint.config.js` fourni |
| **Build output** | `/build` | `/dist` |
| **Maintenance** | ⚠️ Ralentie | ✅ Active |
| **Recommandation** | ⚠️ Déprécié | ✅ Recommandé |

---

## Récapitulatif des commandes

```
┌─────────────────────────────────────────────────────────┐
│           COMMANDES DE CONFIGURATION REACT              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Vite (recommandé)                                      │
│  ──────────────────                                     │
│  npm create vite@latest mon-app                         │
│  cd mon-app && npm install && npm run dev               │
│                                                         │
│  CRA (déprécié)                                         │
│  ──────────────                                         │
│  npx create-react-app mon-app                           │
│  cd mon-app && npm start                                │
│                                                         │
│  Scripts Vite                                           │
│  ─────────────                                          │
│  npm run dev     → Serveur de développement             │
│  npm run build   → Build de production (/dist)          │
│  npm run preview → Prévisualisation du build            │
│  npm run lint    → Vérification ESLint                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Action | npm | Yarn |
|--------|-----|------|
| Initialiser `package.json` | `npm init -y` | `yarn init -y` |
| Créer projet Vite | `npm create vite@latest` | `yarn create vite` |
| Créer projet CRA | `npx create-react-app app` | `yarn create react-app app` |
| Installer les dépendances | `npm install` | `yarn` |
| Ajouter un package | `npm install package` | `yarn add package` |
| Ajouter en dev | `npm install -D package` | `yarn add -D package` |
| Lancer dev server | `npm run dev` | `yarn dev` |
| Build production | `npm run build` | `yarn build` |

### Points à retenir

| Concept | Description |
|---------|-------------|
| **Vite** | Outil de build moderne, rapide, recommandé pour les nouveaux projets |
| **CRA** | Déprécié, à éviter pour les nouveaux projets |
| **Configuration manuelle** | Utile pour comprendre Webpack et Babel |
| **`index.html`** | À la racine avec Vite, dans `/public` avec CRA |
| **Point d'entrée** | `src/main.jsx` avec Vite, `src/index.js` avec CRA |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser Vite pour les nouveaux projets | Utiliser CRA (déprécié) |
| Configurer le port dans `vite.config.js` | Modifier les fichiers générés à la main |
| Désactiver les règles ESLint inutiles | Ignorer les erreurs ESLint |
| Vérifier la compatibilité des packages avec React 18+ | Installer des packages obsolètes |
| Commiter `package-lock.json` ou `yarn.lock` | Ignorer le fichier de lock |
| Utiliser un seul gestionnaire de paquets | Mélanger npm et Yarn |