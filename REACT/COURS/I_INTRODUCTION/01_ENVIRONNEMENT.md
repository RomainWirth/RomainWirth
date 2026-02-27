# Environnement de travail

## Table des matières

- [Prérequis](#prérequis)
- [Vite](#vite)
- [React Developer Tools](#react-developer-tools)
- [Yarn : Alternative à npm](#yarn--alternative-à-npm)
- [Les packages NPM](#les-packages-npm)
- [Extensions VS Code recommandées](#extensions-vs-code-recommandées)
- [Récapitulatif](#récapitulatif)
- [Points à retenir](#points-à-retenir)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Prérequis

Avant de commencer à développer avec React, il faut s'assurer d'avoir les outils suivants installés :

| Outil | Description | Lien |
|-------|-------------|------|
| **Node.js** | Environnement d'exécution JavaScript | [nodejs.org](https://nodejs.org/fr) |
| **npm** | Gestionnaire de paquets (inclus avec Node.js) | - |
| **VS Code** | Éditeur de code recommandé | [code.visualstudio.com](https://code.visualstudio.com/) |

**Vérifier les versions installées :**

```bash
node -v    # Affiche la version de Node.js
npm -v     # Affiche la version de npm
```

---

## Vite

[Vite](https://vite.dev/) est l'outil de développement recommandé pour créer des applications React modernes.

**Avantages de Vite :**

| Avantage | Description |
|----------|-------------|
| **Rapidité** | Démarrage instantané grâce aux modules ES natifs |
| **Hot Module Replacement** | Mise à jour instantanée sans rechargement complet |
| **Configuration minimale** | Fonctionne directement sans configuration complexe |
| **Build optimisé** | Utilise Rollup pour un bundle de production performant |

**Initialisation d'un projet React avec Vite :**

```bash
npm create vite@latest mon-app
cd mon-app
npm install
npm run dev
```

Lors de l'initialisation, sélectionner :
1. **Framework** : React
2. **Variant** : JavaScript (ou TypeScript selon préférence)

**Structure d'un projet Vite :**

```
mon-app/
├── node_modules/
├── public/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Composants React
│   ├── App.jsx           # Composant principal
│   ├── App.css           # Styles du composant App
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── index.html            # Page HTML principale
├── package.json          # Dépendances et scripts
├── vite.config.js        # Configuration Vite
└── eslint.config.js      # Configuration ESLint
```

**Scripts disponibles :**

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Génère le bundle de production |
| `npm run preview` | Prévisualise le build de production |
| `npm run lint` | Vérifie le code avec ESLint |

**Configuration du port (optionnel) :**

Pour changer le port par défaut (5173), modifier `vite.config.js` :

```js
// filepath: vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

---

## React Developer Tools

L'extension [React Developer Tools](https://react.dev/learn/react-developer-tools) permet d'inspecter et déboguer les applications React directement dans le navigateur.

**Installation :**

| Navigateur | Lien |
|------------|------|
| Chrome | [Chrome Web Store](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/fr/firefox/addon/react-devtools/) |
| Edge | [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpifdpnbn) |

**Fonctionnalités :**

| Onglet | Description |
|--------|-------------|
| **Components** | Inspecter l'arbre des composants, éditer les props et le state en temps réel |
| **Profiler** | Analyser les performances, identifier les re-renders inutiles |

**Utilisation :**

1. Installer l'extension dans votre navigateur
2. Ouvrir les DevTools (`F12` ou clic droit → Inspecter)
3. Naviguer vers les onglets **"Components"** ou **"Profiler"**

```
💡 Astuce : L'icône de l'extension devient colorée quand vous êtes sur un site utilisant React.
- Bleu  : Version de production
- Rouge : Version de développement
```

---

## Yarn : Alternative à npm

[Yarn](https://yarnpkg.com/) est un gestionnaire de paquets JavaScript développé par Facebook en 2016.  
Il constitue une alternative à npm avec des fonctionnalités améliorées.

**Installation de Yarn :**

```bash
# Via npm (méthode recommandée)
npm install -g yarn

# Vérifier l'installation
yarn -v
```

**Comparaison npm vs Yarn :**

| Fonctionnalité | npm | Yarn |
|----------------|-----|------|
| **Fichier de verrouillage** | `package-lock.json` | `yarn.lock` |
| **Installation parallèle** | Séquentielle (npm < 7) | Parallèle (plus rapide) |
| **Cache** | Basique | Optimisé et persistant |
| **Workspaces** | Supporté (npm 7+) | Supporté nativement |
| **Commande d'exécution** | `npx` | `yarn dlx` |

**Équivalence des commandes :**

| Action | npm | Yarn |
|--------|-----|------|
| Initialiser un projet | `npm init` | `yarn init` |
| Installer les dépendances | `npm install` | `yarn` ou `yarn install` |
| Ajouter un package | `npm install package` | `yarn add package` |
| Ajouter en dev | `npm install package -D` | `yarn add package -D` |
| Supprimer un package | `npm uninstall package` | `yarn remove package` |
| Mettre à jour | `npm update` | `yarn upgrade` |
| Exécuter un script | `npm run script` | `yarn script` |
| Lancer le dev server | `npm run dev` | `yarn dev` |
| Créer un projet Vite | `npm create vite@latest` | `yarn create vite` |

**Créer un projet React avec Yarn :**

```bash
yarn create vite mon-app
cd mon-app
yarn
yarn dev
```

**Avantages de Yarn :**

| Avantage | Description |
|----------|-------------|
| **Vitesse** | Installation plus rapide grâce au cache et au parallélisme |
| **Fiabilité** | Fichier `yarn.lock` garantit des installations identiques |
| **Sécurité** | Vérification des checksums des packages |
| **Mode hors-ligne** | Peut installer des packages déjà en cache sans connexion |
| **Workspaces** | Gestion native des monorepos |

**Yarn 2+ (Berry) :**

```bash
# Activer Yarn Berry dans un projet
yarn set version berry
```

| Fonctionnalité | Yarn Classic (1.x) | Yarn Berry (2+) |
|----------------|-------------------|-----------------|
| **node_modules** | Oui | Optionnel (Plug'n'Play) |
| **Plug'n'Play (PnP)** | Non | Oui (par défaut) |
| **Zero-installs** | Non | Oui |
| **Taille du cache** | Importante | Optimisée |

**⚠️ Bonnes pratiques :**

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Choisir un seul gestionnaire par projet | Mélanger npm et Yarn dans le même projet |
| Commiter le fichier de lock | Ignorer `yarn.lock` dans `.gitignore` |
| Utiliser la même version de Yarn en équipe | Avoir des versions différentes de Yarn |
| Documenter le gestionnaire utilisé dans le README | Laisser l'équipe deviner |

```bash
# Si le projet contient :
# - package-lock.json → npm
# - yarn.lock         → Yarn

# Supprimer le mauvais fichier si les deux existent
rm package-lock.json  # Si vous utilisez Yarn
rm yarn.lock          # Si vous utilisez npm
```

---

## Les packages NPM

Les packages NPM sont des modules JavaScript qui permettent d'étendre les fonctionnalités d'une application React.

**Installation d'un package :**

```bash
# Dépendance de production
npm install nom-du-package

# Dépendance de développement
npm install nom-du-package -D
```

**Packages populaires pour React :**

| Catégorie | Package | Description |
|-----------|---------|-------------|
| **Routing** | `react-router-dom` | Navigation entre pages |
| **State Management** | `redux` / `zustand` | Gestion d'état globale |
| **Requêtes HTTP** | `axios` / `@tanstack/react-query` | Communication avec les APIs |
| **Formulaires** | `react-hook-form` / `formik` | Gestion des formulaires |
| **UI Components** | `react-bootstrap` / `@mui/material` | Composants préconçus |
| **Styling** | `styled-components` / `tailwindcss` | CSS-in-JS et utilitaires CSS |
| **Animations** | `framer-motion` | Animations fluides |
| **Tests** | `vitest` / `@testing-library/react` | Tests unitaires et d'intégration |

**⚠️ Bonnes pratiques :**

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Vérifier la date de dernière mise à jour | Installer des packages abandonnés |
| Consulter le nombre de téléchargements | Ignorer les vulnérabilités de sécurité |
| Lire la documentation officielle | Installer trop de dépendances |
| Vérifier la compatibilité avec votre version de React | Utiliser des versions obsolètes |

**Vérifier les vulnérabilités :**

```bash
npm audit           # Liste les vulnérabilités
npm audit fix       # Corrige automatiquement si possible
npm outdated        # Liste les packages obsolètes
npm update          # Met à jour les packages
```

---

## Extensions VS Code recommandées

| Extension | Description |
|-----------|-------------|
| **ES7+ React/Redux/React-Native snippets** | Raccourcis pour générer du code React |
| **Prettier** | Formatage automatique du code |
| **ESLint** | Détection des erreurs et mauvaises pratiques |
| **Auto Rename Tag** | Renomme automatiquement les balises HTML/JSX |
| **Bracket Pair Colorizer** | Colore les paires de parenthèses |
| **Path Intellisense** | Autocomplétion des chemins de fichiers |
| **Tailwind CSS IntelliSense** | Autocomplétion des classes Tailwind |
| **vscode-styled-components** | Coloration syntaxique pour Styled Components |

**Raccourcis utiles (avec l'extension ES7+) :**

| Raccourci | Résultat |
|-----------|----------|
| `rafce` | Composant fonction avec export |
| `rce` | Composant classe avec export |
| `useState` | Hook useState |
| `useEffect` | Hook useEffect |

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│           ENVIRONNEMENT DE TRAVAIL REACT                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Prérequis                                              │
│  ─────────                                              │
│  → Node.js  : node -v                                   │
│  → npm      : npm -v                                    │
│  → VS Code  : éditeur recommandé                        │
│                                                         │
│  Vite (outil de build recommandé)                       │
│  ─────────────────────────────────                      │
│  → npm create vite@latest mon-app                       │
│  → cd mon-app                                           │
│  → npm install                                          │
│  → npm run dev                                          │
│                                                         │
│  Scripts Vite                                           │
│  ─────────────                                          │
│  → npm run dev      : serveur de développement          │
│  → npm run build    : bundle de production              │
│  → npm run preview  : prévisualisation du build         │
│  → npm run lint     : vérification ESLint               │
│                                                         │
│  Gestionnaires de paquets                               │
│  ─────────────────────────                              │
│  npm   → package-lock.json                              │
│  Yarn  → yarn.lock                                      │
│  ⚠️  Ne pas mélanger les deux dans un même projet       │
│                                                         │
│  Commandes essentielles                                 │
│  ──────────────────────                                 │
│  npm install package    /  yarn add package             │
│  npm install package -D /  yarn add package -D          │
│  npm uninstall package  /  yarn remove package          │
│  npm update             /  yarn upgrade                 │
│                                                         │
│  React Developer Tools                                  │
│  ──────────────────────                                 │
│  → Extension navigateur (Chrome, Firefox, Edge)         │
│  → Onglet Components : inspecter props et state         │
│  → Onglet Profiler   : analyser les performances        │
│                                                         │
│  Extensions VS Code indispensables                      │
│  ──────────────────────────────────                     │
│  → ES7+ React snippets  : rafce, rce                    │
│  → Prettier             : formatage automatique         │
│  → ESLint               : détection d'erreurs           │
│  → Auto Rename Tag      : renommage des balises         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Outil | Rôle | Commande clé |
|-------|------|--------------|
| **Node.js + npm** | Environnement d'exécution et gestionnaire de paquets | `node -v` / `npm -v` |
| **Vite** | Outil de build et serveur de développement | `npm create vite@latest` |
| **Yarn** | Alternative à npm | `npm install -g yarn` |
| **React DevTools** | Débogage dans le navigateur | Extension navigateur |
| **ES7+ Snippets** | Raccourcis de code React | `rafce`, `rce` |
| **Prettier + ESLint** | Qualité et formatage du code | Configuration dans VS Code |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Vérifier les versions de Node.js et npm avant de commencer | Ignorer les mises à jour de Node.js |
| Utiliser Vite pour les nouveaux projets | Utiliser Create React App (déprécié) |
| Choisir un seul gestionnaire de paquets par projet | Mélanger npm et Yarn |
| Commiter le fichier de lock (`package-lock.json` ou `yarn.lock`) | Ignorer le fichier de lock dans `.gitignore` |
| Installer React DevTools dès le début | Déboguer sans outils dédiés |
| Utiliser Prettier et ESLint | Ignorer la qualité du code |
| Vérifier régulièrement les vulnérabilités (`npm audit`) | Laisser les dépendances obsolètes |