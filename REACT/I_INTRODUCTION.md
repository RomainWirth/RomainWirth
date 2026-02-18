# INTRODUCTION A REACT

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

## Environnement de travail

### Prérequis

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

### Vite

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

### React Developer Tools

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
2. Ouvrir les DevTools (F12 ou clic droit → Inspecter)
3. Naviguer vers les onglets "Components" ou "Profiler"

```
💡 Astuce : L'icône de l'extension devient colorée quand vous êtes sur un site utilisant React.
- Bleu : Version de production
- Rouge : Version de développement
```

### Yarn : Alternative à npm

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
# Avec Vite
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

**Inconvénients de Yarn :**

| Inconvénient | Description |
|--------------|-------------|
| **Installation supplémentaire** | npm est inclus avec Node.js, pas Yarn |
| **Deux fichiers de lock** | Confusion possible si les deux sont présents |
| **Compatibilité** | Certains tutoriels utilisent uniquement npm |

**Yarn 2+ (Berry) :**

Yarn a évolué vers la version 2 (appelée "Berry") avec des changements majeurs :

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
|----------|-----------------|
| Choisir un seul gestionnaire par projet | Mélanger npm et Yarn dans le même projet |
| Commiter le fichier de lock | Ignorer `yarn.lock` dans `.gitignore` |
| Utiliser la même version de Yarn en équipe | Avoir des versions différentes de Yarn |
| Documenter le gestionnaire utilisé dans le README | Laisser l'équipe deviner |

**Vérifier quel gestionnaire est utilisé :**

```bash
# Si le projet contient :
# - package-lock.json → npm
# - yarn.lock → Yarn

# Supprimer le mauvais fichier si les deux existent
rm package-lock.json  # Si vous utilisez Yarn
rm yarn.lock          # Si vous utilisez npm
```

### Les pachages NPM

Les packages NPM sont des modules JavaScript qui permettent d'étendre les fonctionnalités d'une application React.

**Installation d'un package :**

```bash
# Dépendance de production
npm install nom-du-package

# Dépendance de développement
npm install nom-du-package --save-dev
# ou
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

**Avantages des packages :**

| Avantage | Description |
|----------|-------------|
| **Gain de temps** | Solutions prêtes à l'emploi |
| **Fiabilité** | Code testé par la communauté |
| **Maintenance** | Mises à jour régulières |
| **Documentation** | Guides et exemples disponibles |

**⚠️ Bonnes pratiques :**

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Vérifier la date de dernière mise à jour | Installer des packages abandonnés |
| Consulter le nombre de téléchargements | Ignorer les vulnérabilités de sécurité |
| Lire la documentation officielle | Installer trop de dépendances |
| Vérifier la compatibilité avec votre version de React | Utiliser des versions obsolètes |

**Vérifier les vulnérabilités :**

```bash
npm audit              # Liste les vulnérabilités
npm audit fix          # Corrige automatiquement si possible
npm outdated           # Liste les packages obsolètes
npm update             # Met à jour les packages
```

### Extensions VS Code recommandées

| Extension | Description |
|-----------|-------------|
| **ES7+ React/Redux/React-Native snippets** | Raccourcis pour générer du code React |
| **Prettier** | Formatage automatique du code |
| **ESLint** | Détection des erreurs et mauvaises pratiques |
| **Auto Rename Tag** | Renomme automatiquement les balises HTML/JSX |
| **Bracket Pair Colorizer** | Colore les paires de parenthèses |
| **Path Intellisense** | Autocomplétion des chemins de fichiers |

**Raccourcis utiles (avec l'extension ES7+) :**

| Raccourci | Résultat |
|-----------|----------|
| `rafce` | Composant fonction avec export |
| `rce` | Composant classe avec export |
| `useState` | Hook useState |
| `useEffect` | Hook useEffect |


## Les Composants 

### Introduction

Les composants sont des blocs de code qui permettent de découper l'interface utilisateur en éléments `indépendants` et `réutilisables`.  
Cela permet de considérer chaque élément de manière isolée.

Un composant est comme une fonction JavaScript. Il accepte des entrées quelconques (`props`) et renvoie des éléments React décrivant ce qui doit apparaître à l'écran.

### Principe de composition

Une page HTML pourra être composée d'un `header`, d'un `footer`, de `sections`, d'un `aside`, de `boutons`, etc.  
Chaque composant peut également contenir d'autres sous-composants.

Par exemple, une page HTML pourra être composée d'un `header`, d'un `footer`, de `sections`, d'un `aside`, de `boutons`, etc.  
Chaque composant peut également contenir d'autre sous-composants.  

```
┌─────────────────────────────────────────────────────────┐
│                         App                             │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Header                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │  │
│  │  │    Logo     │  │   NavBar    │  │  Button   │  │  │
│  │  └─────────────┘  └─────────────┘  └───────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                     Main                          │  │
│  │  ┌─────────────────────┐  ┌────────────────────┐  │  │
│  │  │      Section        │  │       Aside        │  │  │
│  │  │  ┌──────┐ ┌──────┐  │  │  ┌──────────────┐  │  │  │
│  │  │  │ Card │ │ Card │  │  │  │   Widget     │  │  │  │
│  │  │  └──────┘ └──────┘  │  │  └──────────────┘  │  │  │
│  │  └─────────────────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │                    Footer                         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```


### Types de composants

| Type | Syntaxe | State | Utilisation |
|------|---------|-------|-------------|
| **Composant Classe** | `class App extends Component` | Via `this.state` | Ancienne méthode, encore valide |
| **Composant Fonction** | `const App = () => {}` | Via `useState()` | Méthode moderne recommandée |

**Composant Classe :**

```jsx
import { Component } from 'react';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Bonjour'
    };
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}, {this.props.name} !</h1>
      </div>
    );
  }
}

export default Welcome;
```

**Composant Fonction (moderne) :**

```jsx
import { useState } from 'react';

const Welcome = ({ name }) => {
  const [message, setMessage] = useState('Bonjour');

  return (
    <div>
      <h1>{message}, {name} !</h1>
    </div>
  );
};

export default Welcome;
```

### Structure d'un composant

Un composant React suit généralement cette structure :

```jsx
// 1. Imports
import { useState, useEffect } from 'react';
import './MonComposant.css';
import SousComposant from './SousComposant';

// 2. Définition du composant
const MonComposant = ({ prop1, prop2 }) => {
  // 3. State (état local)
  const [data, setData] = useState(null);

  // 4. Effets de bord
  useEffect(() => {
    // Code exécuté au montage
  }, []);

  // 5. Fonctions / handlers
  const handleClick = () => {
    setData('Nouvelle valeur');
  };

  // 6. Rendu JSX
  return (
    <div className="mon-composant">
      <h1>{prop1}</h1>
      <p>{prop2}</p>
      <button onClick={handleClick}>Cliquez</button>
      <SousComposant data={data} />
    </div>
  );
};

// 7. Export
export default MonComposant;
```

### Les Props

Les props (propriétés) permettent de passer des données d'un composant parent vers un composant enfant.

**Passage de props :**

```jsx
// Composant Parent
const App = () => {
  return (
    <div>
      <Welcome name="Alice" age={25} isAdmin={true} />
      <Welcome name="Bob" age={30} isAdmin={false} />
    </div>
  );
};

// Composant Enfant
const Welcome = ({ name, age, isAdmin }) => {
  return (
    <div>
      <h1>Bonjour {name} !</h1>
      <p>Âge : {age} ans</p>
      {isAdmin && <span>Administrateur</span>}
    </div>
  );
};
```

**Types de props :**

| Type | Exemple | Description |
|------|---------|-------------|
| String | `name="Alice"` | Chaîne de caractères |
| Number | `age={25}` | Nombre (entre accolades) |
| Boolean | `isAdmin={true}` | Booléen (entre accolades) |
| Array | `items={[1, 2, 3]}` | Tableau |
| Object | `user={{ name: 'Alice' }}` | Objet |
| Function | `onClick={handleClick}` | Fonction callback |
| Component | `icon={<Icon />}` | Autre composant |

**Props par défaut :**

```jsx
// Méthode 1 : Destructuration avec valeur par défaut
const Welcome = ({ name = 'Visiteur', age = 0 }) => {
  return <p>Bonjour {name}, {age} ans</p>;
};

// Méthode 2 : defaultProps (composant classe)
class Welcome extends Component {
  static defaultProps = {
    name: 'Visiteur',
    age: 0
  };

  render() {
    return <p>Bonjour {this.props.name}, {this.props.age} ans</p>;
  }
}
```

**Spread operator pour les props :**

```jsx
const userProps = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
};

// Au lieu de :
<UserCard name={userProps.name} age={userProps.age} email={userProps.email} />

// On peut écrire :
<UserCard {...userProps} />
```

### Le State

Le state représente les données locales d'un composant qui peuvent changer au fil du temps.

**Avec les classes :**

```jsx
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Compteur : {this.state.count}</p>
        <button onClick={this.increment}>+1</button>
      </div>
    );
  }
}
```

**Avec les Hooks (moderne) :**

```jsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
};
```

**Différences Props vs State :**

| Caractéristique | Props | State |
|-----------------|-------|-------|
| **Origine** | Passées par le parent | Définies dans le composant |
| **Modification** | Immuables (lecture seule) | Modifiables via `setState` / `setX` |
| **Flux de données** | Parent → Enfant | Interne au composant |
| **Re-render** | Oui, si les props changent | Oui, si le state change |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Un composant = une responsabilité | Créer des composants trop complexes |
| Nommer les composants en PascalCase | Utiliser camelCase ou snake_case |
| Utiliser des composants fonctionnels | Utiliser des classes (sauf cas spécifiques) |
| Destructurer les props | Accéder via `props.name` |
| Garder les composants petits et réutilisables | Dupliquer du code entre composants |
| Séparer la logique de l'affichage | Mélanger logique métier et JSX |

### Organisation des fichiers

**Structure recommandée :**

```
src/
├── components/
│   ├── common/              # Composants réutilisables
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   └── Card/
│   │       ├── Card.jsx
│   │       └── Card.css
│   ├── layout/              # Composants de structure
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   └── features/            # Composants par fonctionnalité
│       ├── Auth/
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── Dashboard/
│           └── Dashboard.jsx
├── hooks/                   # Custom Hooks
├── utils/                   # Fonctions utilitaires
├── assets/                  # Images, fonts, etc.
├── App.jsx
└── main.jsx
```

**Convention de nommage :**

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composant | PascalCase | `UserProfile.jsx` |
| Hook | camelCase avec `use` | `useAuth.js` |
| Utilitaire | camelCase | `formatDate.js` |
| Constantes | SCREAMING_SNAKE_CASE | `API_URL` |
| CSS Module | `[Composant].module.css` | `Button.module.css` |

## Notions de `Class`

### Introduction

Avant l'arrivée des Hooks (React 16.8), les composants de type `class` étaient la seule façon de gérer un state local et d'accéder aux méthodes du cycle de vie.  
Bien que les composants fonction soient aujourd'hui recommandés, il est important de comprendre les classes pour :
- Maintenir du code legacy
- Comprendre les concepts fondamentaux de React
- Utiliser certaines fonctionnalités avancées (Error Boundaries)

### Structure d'une classe React

```jsx
import { Component } from 'react';

class MonComposant extends Component {
  // 1. Constructor : initialisation du state et binding des méthodes
  constructor(props) {
    super(props);
    this.state = {
      data: 'valeur initiale'
    };
  }

  // 2. Méthodes personnalisées (arrow function = auto-binding)
  maMethode = () => {
    this.setState({ data: 'nouvelle valeur' });
  };

  // 3. Méthode render() : retourne le JSX
  render() {
    return (
      <div>
        <p>{this.state.data}</p>
        <button onClick={this.maMethode}>Cliquer</button>
      </div>
    );
  }
}

export default MonComposant;
```

### Éléments clés d'une classe

| Élément | Description | Obligatoire |
|---------|-------------|-------------|
| `extends Component` | Hérite des fonctionnalités de React | Oui |
| `constructor(props)` | Initialise le state et lie les méthodes | Non (si pas de state) |
| `super(props)` | Appelle le constructeur parent | Oui (dans le constructor) |
| `this.state` | Objet contenant les données locales | Non |
| `this.setState()` | Met à jour le state | - |
| `this.props` | Accède aux props passées par le parent | - |
| `render()` | Retourne le JSX à afficher | Oui |

### Exemple pratique : Combat Riri vs Fifi

Prenons en exemple une petite application qui met en avant deux personnages : Riri et Fifi qui doivent se lancer des dégâts.

**Fichier `App.jsx` (composant parent) :**
```JavaScript
import { Component } from 'react'
import Riri from './components/Riri'
import Fifi from './components/Riri'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      riri: 100,
      fifi: 100
    }
  }

  reduceLife = (param, param2) => {
    const characterToUpdate = param === 'Riri' ? 'fifi' : 'riri';
    this.setState(prevState => ({
      [characterToUpdate]: prevState[characterToUpdate] - param2
    }))
  }

  render() {
    return (
      <div className='container text-center'>
        <h1>Riri vs Fifi</h1>
        <hr />
        <div className='row'>
          <Riri 
            name="riri" 
            life={this.state.riri} 
            reduceHandler={this.reduceLife} 
          />
          <Fifi 
            name="fifi" 
            life={this.state.fifi} 
            reduceHandler={this.reduceLife} 
          />
        </div>
      </div>
    )
  }
}

export default App;
```

**Fichier `Riri.jsx` (composant enfant) :**

```jsx
import { Component } from 'react';

class Riri extends Component {
  handleAttack = () => {
    const damage = Math.floor(Math.random() * 10) + 1;
    this.props.reduceHandler(this.props.name, damage);
  };

  render() {
    const { name, life } = this.props;

    return (
      <div className="col">
        <h2>{name}</h2>
        <p>Points de vie : {life}</p>
        <button 
          className="btn btn-danger"
          onClick={this.handleAttack}
          disabled={life <= 0}
        >
          Attaquer
        </button>
        {life <= 0 && <p className="text-danger">K.O. !</p>}
      </div>
    );
  }
}

export default Riri;
```

### Analyse du code

**Composant `App` (parent) :**

| Élément | Rôle |
|---------|------|
| `this.state = { riri: 100, fifi: 100 }` | Initialise les points de vie |
| `reduceLife = (name, damage) => {...}` | Méthode pour réduire les points de vie |
| `this.setState(prevState => ...)` | Met à jour le state de manière immutable |
| `[characterToUpdate]` | Propriété calculée dynamiquement |

**Composant enfant :**

| Élément | Rôle |
|---------|------|
| `this.props.name` | Accède à la prop `name` passée par le parent |
| `this.props.reduceHandler` | Appelle la méthode du parent |
| `const { name, life } = this.props` | Destructuration des props |

### Binding des méthodes

Dans les classes, les méthodes ne sont pas automatiquement liées à `this`.  
Il existe plusieurs façons de résoudre ce problème :

```jsx
class Exemple extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };

    // Méthode 1 : Binding dans le constructor
    this.handleClick = this.handleClick.bind(this);
  }

  // Méthode classique (nécessite binding)
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }

  // Méthode 2 : Arrow function (auto-binding) ✅ Recommandée
  handleClickArrow = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        {/* Méthode 3 : Arrow function inline (moins performant) */}
        <button onClick={() => this.handleClick()}>
          Click 1
        </button>
        
        <button onClick={this.handleClickArrow}>
          Click 2
        </button>
      </div>
    );
  }
}
```

| Méthode | Avantage | Inconvénient |
|---------|----------|--------------|
| Binding dans constructor | Explicite | Verbeux |
| Arrow function (propriété de classe) | Simple, auto-binding | Syntaxe ES7 |
| Arrow function inline | Flexible | Nouvelle fonction créée à chaque render |

### setState() en détail

La méthode `setState()` est **asynchrone** et peut prendre deux formes :

```jsx
// Forme 1 : Objet (pour les changements simples)
this.setState({ count: 5 });

// Forme 2 : Fonction (pour les changements basés sur l'état précédent) ✅
this.setState(prevState => ({
  count: prevState.count + 1
}));

// Avec callback (exécuté après la mise à jour)
this.setState(
  { count: 5 },
  () => console.log('State mis à jour:', this.state.count)
);
```

**⚠️ Règles importantes :**

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser `setState()` pour modifier le state | Modifier directement `this.state.value = 5` |
| Utiliser la forme fonction pour les calculs | `this.setState({ count: this.state.count + 1 })` en boucle |
| Fusionner les objets avec spread | Remplacer tout le state |

### Comparaison Classe vs Fonction

| Aspect | Classe | Fonction (Hooks) |
|--------|--------|------------------|
| **Syntaxe** | Plus verbeux | Concis |
| **State** | `this.state` / `this.setState()` | `useState()` |
| **Cycle de vie** | Méthodes dédiées | `useEffect()` |
| **this** | Nécessite binding | Pas de `this` |
| **Lisibilité** | Complexe | Simple |
| **Performance** | Légèrement plus lourd | Optimisé |

**Équivalence :**

```jsx
// CLASSE
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <button onClick={this.increment}>
        Count: {this.state.count}
      </button>
    );
  }
}

// FONCTION (équivalent)
const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
};
```

### Quand utiliser les classes ?

| Situation | Recommandation |
|-----------|----------------|
| Nouveau projet | Composants fonction + Hooks |
| Maintenance de code legacy | Classes (si déjà en place) |
| Error Boundaries | Classes (obligatoire) |
| Apprentissage | Comprendre les deux |

**Error Boundary (cas d'usage exclusif aux classes) :**

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Erreur capturée:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Une erreur est survenue.</h1>;
    }

    return this.props.children;
  }
}
```

La class était le composant dans lequel on pouvait avoir le `state` (data locale).  
Il existe plusieurs méthodes qui appartiennent à une class.  
La class contient une méthode (fonction de class) `render()` qui permet de retourner du jsx.  
Il est possible de créer des méthodes qui seront propre au composant 'class' : dans l'exmple, la méthode reduceLife est une fonction qui permet de modifier les états des éléments de la class.  

Sur les nouveaux projets, on utilisera plutôt des composants 'fonctions'.  
Les class peuvent encore être employées pour développer en React. Il est possible que dans le futur ce ne soit plus maintenu.

## Utiliser React via les liens CDN

### Introduction

Il est possible d'utiliser React sans outils de build (Vite, Webpack) en intégrant directement les scripts via des liens CDN.  
Cette méthode est utile pour :
- Apprendre React rapidement
- Créer des prototypes
- Intégrer React dans une page HTML existante

**⚠️ Limitations :**

| Limitation | Description |
|------------|-------------|
| Pas de JSX natif | Nécessite Babel pour compiler le JSX |
| Pas de modules | Impossible d'utiliser `import`/`export` |
| Performance | Compilation côté client (plus lent) |
| Pas recommandé en production | Utiliser Vite ou un bundler pour les vrais projets |

### Scripts CDN nécessaires

Les scripts sont disponibles sur [legacy.reactjs.org](https://fr.legacy.reactjs.org/docs/cdn-links.html).

| Script | Rôle |
|--------|------|
| `react.production.min.js` | Bibliothèque React (création de composants) |
| `react-dom.production.min.js` | ReactDOM (manipulation du DOM) |
| `babel.min.js` | Compilateur JSX → JavaScript |

### Structure de base

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- React et ReactDOM -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- Babel pour compiler le JSX -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <title>React CDN</title>
</head>

<body>
  <!-- Point de montage React -->
  <div id="root"></div>

  <!-- Code React (type="text/babel" obligatoire pour le JSX) -->
  <script type="text/babel">
    // Votre code React ici
  </script>
</body>

</html>
```

### Exemple avec un composant Classe

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <title>Composant Classe</title>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = { count: 0 };
      }

      increment = () => {
        this.setState({ count: this.state.count + 1 });
      };

      render() {
        return (
          <div>
            <h1>Compteur : {this.state.count}</h1>
            <button onClick={this.increment}>+1</button>
          </div>
        );
      }
    }

    // Montage du composant dans le DOM
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  </script>
</body>

</html>
```

### Exemple avec un composant Fonction

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <title>Composant Fonction</title>
</head>

<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState } = React;

    const App = () => {
      const [count, setCount] = useState(0);

      return (
        <div>
          <h1>Compteur : {count}</h1>
          <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
      );
    };

    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  </script>
</body>

</html>
```

### Règles importantes du JSX

**1. Un seul élément parent :**

```jsx
// ❌ Impossible : plusieurs éléments racines
return (
  <h1>Titre</h1>
  <p>Paragraphe</p>
);

// ✅ Correct : un seul élément parent (div)
return (
  <div>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </div>
);

// ✅ Correct : utiliser un Fragment
return (
  <>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </>
);
```

**2. Attributs spécifiques :**

| HTML | JSX | Raison |
|------|-----|--------|
| `class` | `className` | `class` est un mot réservé en JavaScript |
| `for` | `htmlFor` | `for` est un mot réservé en JavaScript |
| `tabindex` | `tabIndex` | camelCase pour tous les attributs |
| `onclick` | `onClick` | camelCase pour les événements |

```jsx
// ❌ HTML classique
<label for="email" class="label">Email</label>

// ✅ JSX
<label htmlFor="email" className="label">Email</label>
```

**3. Expressions JavaScript entre accolades :**

```jsx
const name = "Alice";
const items = ["A", "B", "C"];

return (
  <div>
    {/* Variable */}
    <h1>Bonjour {name}</h1>
    
    {/* Expression */}
    <p>2 + 2 = {2 + 2}</p>
    
    {/* Condition ternaire */}
    <p>{name ? `Bienvenue ${name}` : "Visiteur"}</p>
    
    {/* Boucle avec map */}
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);
```

### Externaliser le code JavaScript

Pour une meilleure organisation, on peut séparer le code dans un fichier externe :

**index.html :**

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <title>React CDN</title>
</head>

<body>
  <div id="root"></div>

  <!-- Fichier externe avec type="text/babel" -->
  <script src="./app.js" type="text/babel"></script>
</body>

</html>
```

**app.js :**

```jsx
const { useState, useEffect } = React;

// Composant enfant
const Counter = ({ initialValue }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(initialValue)}>Reset</button>
    </div>
  );
};

// Composant principal
const App = () => {
  return (
    <div>
      <h1>Mon Application React</h1>
      <Counter initialValue={0} />
      <Counter initialValue={10} />
    </div>
  );
};

// Montage
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

### Différences avec les versions de React

**React 18+ (méthode actuelle) :**

```jsx
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

**React 17 et antérieur (ancienne méthode) :**

```jsx
const container = document.getElementById('root');
ReactDOM.render(<App />, container);
```

### Accès aux Hooks via CDN

Avec les CDN, les Hooks ne sont pas importables directement.  
Il faut les extraire de l'objet `React` :

```jsx
// ❌ Impossible via CDN
import { useState, useEffect } from 'react';

// ✅ Correct via CDN
const { useState, useEffect, useRef, useContext } = React;

const App = () => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    console.log('Composant monté');
  }, []);

  return (
    <input 
      ref={inputRef} 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
    />
  );
};
```

### Récapitulatif

| Élément | Obligatoire | Rôle |
|---------|-------------|------|
| `react.production.min.js` | Oui | Création des composants |
| `react-dom.production.min.js` | Oui | Manipulation du DOM |
| `babel.min.js` | Oui (pour JSX) | Compilation du JSX |
| `type="text/babel"` | Oui | Indique à Babel de compiler le script |
| `<div id="root">` | Oui | Point de montage React |

**Quand utiliser cette méthode :**

| ✅ Cas d'usage | ❌ À éviter |
|----------------|-------------|
| Apprentissage et tutoriels | Applications en production |
| Prototypage rapide | Projets avec beaucoup de composants |
| Démonstrations / CodePen | Projets nécessitant des imports/modules |
| Intégration dans une page existante | Projets avec routing complexe |

## Configurer un projet React

### Introduction

[Créer une nouvelle appli React](https://fr.legacy.reactjs.org/docs/create-a-new-react-app.html)

Il existe plusieurs façons de créer une application React :

| Méthode | Complexité | Recommandation |
|---------|------------|----------------|
| **Vite** | Simple | ✅ Recommandé |
| **Create React App (CRA)** | Simple | ⚠️ Déprécié |
| **Configuration manuelle** | Avancée | Pour comprendre le fonctionnement |

Historiquement, pour créer simplement une application React, on utilisera le terminal et la ligne de commande :  
`npx create-react-app app-name`

Sur la nouvelle [documentation](https://fr.react.dev/learn/start-a-new-react-project), on va pouvoir créer une application React via `Vite`.  
Vite permet de créer de A à Z sans avoir à tout paramétrer.

### Configuration manuelle (culture générale)

Cette section explique comment configurer manuellement un projet React avec Webpack et Babel.  
C'est utile pour comprendre le fonctionnement interne, mais **Vite automatise tout cela**.


#### Outils nécessaires

| Outil | Rôle |
|-------|------|
| **Babel** | Compilateur qui transforme le JSX en JavaScript compréhensible par les navigateurs |
| **Webpack** | Bundler qui regroupe tous les fichiers, modules et dépendances en assets statiques |

#### Installation des dépendances

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

#### Structure du projet

```
mon-projet/
├── node_modules/
├── src/
│   ├── components/
│   │   └── App.js
│   ├── index.html
│   └── index.js
├── package.json
├── package-lock.json (ou yarn.lock)
└── webpack.config.js
```

#### Création des fichiers

**src/components/App.js :**

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

**src/index.html :**

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma première app React</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
```

**src/index.js :**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

**webpack.config.js (à la racine) :**

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
        test: /\.js$/,              // Fichiers .js
        exclude: /node_modules/,    // Exclure node_modules
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

**Explication de la configuration :**

| Propriété | Description |
|-----------|-------------|
| `mode` | `development` ou `production` |
| `entry` | Point d'entrée de l'application |
| `output.path` | Dossier de destination du bundle |
| `output.filename` | Nom du fichier bundle généré |
| `plugins` | Liste des plugins Webpack |
| `module.rules` | Règles de transformation des fichiers |


#### Configuration des scripts

**package.json :**

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

**Options du script start :**

| Option | Description |
|--------|-------------|
| `webpack-dev-server` | Lance le serveur de développement |
| `--mode development` | Mode développement |
| `--open` | Ouvre automatiquement le navigateur |
| `--hot` | Active le Hot Module Replacement |

#### Lancement du projet

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

Le dossier `dist` généré contiendra :
- `bundle.js` : Code minifié
- `index.html` : Page HTML avec le bundle injecté
- `bundle.js.LICENSE.txt` : Licences des dépendances

### Créer une application via CRA (Create React App)

**⚠️ Attention : CRA n'est plus maintenu activement. Privilégiez Vite.**

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

**Inconvénients de CRA :**

| Problème | Description |
|----------|-------------|
| Maintenance | Plus activement maintenu |
| Performance | Utilise Webpack (plus lent que Vite) |
| Configuration | Difficile à personnaliser (eject nécessaire) |
| Taille | Bundle plus volumineux |

### Initialiser un projet via Vite (recommandé)

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

Lors de l'initialisation, sélectionner :
1. **Framework** : React
2. **Variant** : JavaScript (ou TypeScript)

**Scripts disponibles :**

| Action | npm | Yarn |
|--------|-----|------|
| Développement | `npm run dev` | `yarn dev` |
| Build production | `npm run build` | `yarn build` |
| Prévisualisation | `npm run preview` | `yarn preview` |
| Linting | `npm run lint` | `yarn lint` |

### Différences entre CRA et Vite

| Aspect | Create React App | Vite |
|--------|------------------|------|
| **Bundler** | Webpack | Rollup + ESBuild |
| **Vitesse de démarrage** | Lent (rebuild complet) | Instantané (modules ES natifs) |
| **Hot Reload** | Lent | Très rapide |
| **Emplacement index.html** | `/public` | Racine du projet |
| **Point d'entrée** | `src/index.js` | `src/main.jsx` |
| **Dossier assets** | `/src` | `/src/assets` |
| **Tests préconfigurés** | Oui (Jest + RTL) | Non (configuration manuelle) |
| **ESLint** | Intégré | Fichier `.eslintrc.cjs` fourni |
| **Port par défaut** | 3000 | 5173 |
| **Maintenance** | ⚠️ Ralentie | ✅ Active |

**Changer le port dans Vite :**

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

**Désactiver les warnings prop-types dans ESLint :**

```js
// filepath: eslint.config.js (ou .eslintrc.cjs)
module.exports = {
  // ...existing config...
  rules: {
    'react/prop-types': 'off',
  }
}
```

### Récapitulatif des commandes

| Action | npm | Yarn |
|--------|-----|------|
| Initialiser package.json | `npm init -y` | `yarn init -y` |
| Créer projet Vite | `npm create vite@latest` | `yarn create vite` |
| Créer projet CRA | `npx create-react-app app` | `yarn create react-app app` |
| Installer les dépendances | `npm install` | `yarn` |
| Ajouter un package | `npm install package` | `yarn add package` |
| Ajouter en dev | `npm install -D package` | `yarn add -D package` |
| Lancer dev server | `npm run dev` | `yarn dev` |
| Build production | `npm run build` | `yarn build` |


## Résumé - Introduction à React

### Qu'est-ce que React ?

| Caractéristique | Description |
|-----------------|-------------|
| **Type** | Bibliothèque JavaScript open source |
| **Créateur** | Facebook (2013) |
| **Usage** | Applications web monopages (SPA) et mobiles (React Native) |

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

```jsx
// Composant Classe
class App extends Component {
  render() {
    return <h1>Hello World !</h1>;
  }
}

// Composant Fonction (recommandé)
const App = () => {
  return <h1>Hello World !</h1>;
};
```

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

### Structure d'un projet Vite

```
mon-app/
├── node_modules/
├── public/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Composants React
│   ├── App.jsx           # Composant principal
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── index.html            # Page HTML principale
├── package.json          # Dépendances et scripts
└── vite.config.js        # Configuration Vite
```

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