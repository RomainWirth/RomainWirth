# INTRODUCTION À REACT

## Table des matières

- [Présentation](#présentation)
  - [Caractéristiques principales](#caractéristiques-principales)
  - [Évolution de React](#évolution-de-react)
  - [Types de composants](#types-de-composants)
  - [Ressources officielles](#ressources-officielles)
- [Table des matières du cours](#table-des-matières-du-cours)
- [Résumé](#résumé)
  - [Concepts clés](#concepts-clés)
  - [Types de composants](#types-de-composants-1)
  - [Environnement de travail](#environnement-de-travail)
  - [Commandes essentielles](#commandes-essentielles)
  - [Props vs State](#props-vs-state)
  - [Points à retenir](#points-à-retenir)
  - [Ressources](#ressources)

---

## Présentation

ReactJS est une `bibliothèque` JavaScript `open source` développée par Facebook en 2013.  
Cette bibliothèque est maintenue et enrichie par une grande communauté de développeurs partout dans le monde.

React est utilisée pour la création d'interfaces web monopages (Single Page Application). On peut également l'utiliser pour créer des applications mobiles Cross-platform, via React Native.

### Caractéristiques principales

| Caractéristique | Description |
|-----------------|-------------|
| **Composants** | Architecture basée sur des blocs réutilisables et indépendants |
| **Virtual DOM** | Optimisation des performances via une représentation virtuelle du DOM |
| **JSX** | Syntaxe permettant d'écrire du HTML dans du JavaScript |
| **Unidirectionnel** | Flux de données à sens unique (parent → enfant) |
| **Écosystème riche** | Grande quantité de packages et outils disponibles |

### Évolution de React

| Version | Année | Nouveautés majeures |
|---------|-------|---------------------|
| React 16.8 | 2019 | Introduction des Hooks |
| React 17 | 2020 | Pas de nouvelles fonctionnalités, préparation pour React 18 |
| React 18 | 2022 | Concurrent Mode, Automatic Batching, Suspense |
| React 19 | 2024 | Server Components, Actions, useFormStatus |

### Types de composants

| Type | Syntaxe | Utilisation |
|------|---------|-------------|
| **Composant Classe** | `class App extends Component` | Ancienne méthode, encore valide |
| **Composant Fonction** | `const App = () => {}` | Méthode moderne recommandée |

```jsx
// Composant Classe (ancienne méthode)
class App extends React.Component {
  render() {
    return <h1>Hello World !</h1>;
  }
}

// Composant Fonction (méthode moderne)
const App = () => {
  return <h1>Hello World !</h1>;
};
```

### Ressources officielles

- [Documentation React (moderne)](https://fr.react.dev/)
- [Documentation React (legacy)](https://fr.legacy.reactjs.org/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

---

## Table des matières

| # | Section | Fichier |
|---|---------|---------|
| 1 | [Environnement de travail](./01_ENVIRONNEMENT.md) | Prérequis, Vite, Yarn, npm, Extensions VS Code |
| 2 | [Les Composants](./02_COMPOSANTS.md) | Props, State, Structure, Organisation des fichiers |
| 3 | [Notions de Class](./03_CLASSES.md) | Syntaxe, Binding, setState, Classe vs Fonction |
| 4 | [Utiliser React via les liens CDN](./04_CDN.md) | Scripts CDN, JSX, Hooks via CDN |
| 5 | [Configurer un projet React](./05_CONFIGURATION.md) | Vite, CRA, Configuration manuelle |

---

## Résumé

### Concepts clés

```
┌─────────────────────────────────────────────────────────┐
│                    REACT                                │
├─────────────────────────────────────────────────────────┤
│  🧩 Composants    → Blocs réutilisables et indépendants │
│  🔄 Virtual DOM   → Optimisation des performances       │
│  📝 JSX           → HTML dans JavaScript                │
│  ➡️  Unidirectionnel → Flux parent → enfant             │
└─────────────────────────────────────────────────────────┘
```

### Types de composants

| Type | Syntaxe | Recommandation |
|------|---------|----------------|
| **Classe** | `class App extends Component` | Ancienne méthode |
| **Fonction** | `const App = () => {}` | ✅ Moderne |

### Environnement de travail

| Outil | Rôle |
|-------|------|
| **Node.js + npm** | Environnement d'exécution et gestionnaire de paquets |
| **Vite** | ✅ Outil de build recommandé |
| **Yarn** | Alternative à npm |
| **VS Code** | Éditeur de code |
| **React DevTools** | Extension de débogage |

### Commandes essentielles

| Action | npm | Yarn |
|--------|-----|------|
| Créer un projet | `npm create vite@latest` | `yarn create vite` |
| Installer les dépendances | `npm install` | `yarn` |
| Ajouter un package | `npm install package` | `yarn add package` |
| Lancer le serveur | `npm run dev` | `yarn dev` |
| Build production | `npm run build` | `yarn build` |

### Props vs State

| Caractéristique | Props | State |
|-----------------|-------|-------|
| **Origine** | Passées par le parent | Définies dans le composant |
| **Modification** | Immuables | Modifiables via `setState` / `setX` |
| **Flux de données** | Parent → Enfant | Interne au composant |

### Points à retenir

| ✅ À privilégier | ⚠️ À éviter |
|------------------|-------------|
| Composants fonction + Hooks | Composants classe (sauf legacy) |
| Vite pour les nouveaux projets | Create React App (déprécié) |
| Un seul gestionnaire de paquets | Mélanger npm et Yarn |
| Petits composants réutilisables | Composants monolithiques |
| Nommage en PascalCase | camelCase ou snake_case pour les composants |

### Ressources

| Ressource | Lien |
|-----------|------|
| Documentation moderne | [fr.react.dev](https://fr.react.dev/) |
| Documentation legacy | [fr.legacy.reactjs.org](https://fr.legacy.reactjs.org/) |
| Vite | [vite.dev](https://vite.dev/) |
| React DevTools | [Extension navigateur](https://react.dev/learn/react-developer-tools) |