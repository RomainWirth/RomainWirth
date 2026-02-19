# Les Composants React

## Table des matières

- [Introduction](#introduction)
- [Principe de composition](#principe-de-composition)
- [Types de composants](#types-de-composants)
- [Structure d'un composant](#structure-dun-composant)
- [Les Props](#les-props)
  - [Passage de props](#passage-de-props)
  - [Types de props](#types-de-props)
  - [Props par défaut](#props-par-défaut)
  - [Spread operator pour les props](#spread-operator-pour-les-props)
- [Le State](#le-state)
  - [Avec les classes](#avec-les-classes)
  - [Avec les Hooks (moderne)](#avec-les-hooks-moderne)
  - [Différences Props vs State](#différences-props-vs-state)
- [Bonnes pratiques](#bonnes-pratiques)
- [Organisation des fichiers](#organisation-des-fichiers)
- [Récapitulatif](#récapitulatif)
- [Points à retenir](#points-à-retenir)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

Les composants sont des blocs de code qui permettent de découper l'interface utilisateur en éléments `indépendants` et `réutilisables`.  
Cela permet de considérer chaque élément de manière isolée.

Un composant est comme une fonction JavaScript. Il accepte des entrées quelconques (`props`) et renvoie des éléments React décrivant ce qui doit apparaître à l'écran.

---

## Principe de composition

Une page HTML pourra être composée d'un `header`, d'un `footer`, de `sections`, d'un `aside`, de `boutons`, etc.  
Chaque composant peut également contenir d'autres sous-composants.

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

---

## Types de composants

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

---

## Structure d'un composant

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

| Étape | Description |
|-------|-------------|
| **Imports** | Dépendances, hooks, styles, composants enfants |
| **Définition** | Nom du composant en PascalCase |
| **State** | Données locales du composant |
| **Effets** | Code exécuté au montage / mise à jour / démontage |
| **Handlers** | Fonctions répondant aux événements |
| **Rendu JSX** | Retourne l'interface visuelle |
| **Export** | Rend le composant utilisable ailleurs |

---

## Les Props

### Passage de props

Les props (propriétés) permettent de passer des données d'un composant **parent** vers un composant **enfant**.

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

```
┌─────────────────────────────────────────────────────────┐
│                   FLUX DES PROPS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Parent                        Enfant                  │
│   ──────                        ──────                  │
│   <Welcome                      ({ name, age }) =>      │
│     name="Alice"   ──────────►  <h1>{name}</h1>         │
│     age={25}                    <p>{age}</p>             │
│   />                                                    │
│                                                         │
│   ⚠️ Sens unique : Parent → Enfant                      │
│   ⚠️ Les props sont en lecture seule                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Types de props

| Type | Exemple | Description |
|------|---------|-------------|
| String | `name="Alice"` | Chaîne de caractères |
| Number | `age={25}` | Nombre (entre accolades) |
| Boolean | `isAdmin={true}` | Booléen (entre accolades) |
| Array | `items={[1, 2, 3]}` | Tableau |
| Object | `user={{ name: 'Alice' }}` | Objet |
| Function | `onClick={handleClick}` | Fonction callback |
| Component | `icon={<Icon />}` | Autre composant |

### Props par défaut

```jsx
// Méthode 1 : Destructuration avec valeur par défaut (recommandée)
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

### Spread operator pour les props

```jsx
const userProps = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
};

// ❌ Verbeux
<UserCard name={userProps.name} age={userProps.age} email={userProps.email} />

// ✅ Avec spread operator
<UserCard {...userProps} />
```

---

## Le State

### Avec les classes

Le state représente les **données locales** d'un composant qui peuvent changer au fil du temps.

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

### Avec les Hooks (moderne)

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

### Différences Props vs State

| Caractéristique | Props | State |
|-----------------|-------|-------|
| **Origine** | Passées par le parent | Définies dans le composant |
| **Modification** | Immuables (lecture seule) | Modifiables via `setState` / `setX` |
| **Flux de données** | Parent → Enfant | Interne au composant |
| **Re-render** | Oui, si les props changent | Oui, si le state change |

```
┌─────────────────────────────────────────────────────────┐
│                  PROPS VS STATE                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   PROPS                         STATE                   │
│   ─────                         ─────                   │
│   Viennent du parent            Internes au composant   │
│   Lecture seule                 Modifiables             │
│   parent → enfant               Locales                 │
│                                                         │
│   <Comp name="Alice" />         const [count, setCount] │
│   this.props.name               = useState(0)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Un composant = une responsabilité | Créer des composants trop complexes |
| Nommer les composants en PascalCase | Utiliser camelCase ou snake_case |
| Utiliser des composants fonctionnels | Utiliser des classes (sauf cas spécifiques) |
| Destructurer les props | Accéder via `props.name` sans destructurer |
| Garder les composants petits et réutilisables | Dupliquer du code entre composants |
| Séparer la logique de l'affichage | Mélanger logique métier et JSX |
| Donner des noms explicites aux handlers | `onClick`, `onChange` sans précision |

---

## Organisation des fichiers

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

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│               LES COMPOSANTS REACT                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Blocs réutilisables et indépendants qui acceptent      │
│  des props et retournent du JSX.                        │
│                                                         │
│  Types                                                  │
│  ──────                                                 │
│  Classe    → class App extends Component { render() }   │
│  Fonction  → const App = () => { return ... }  ✅       │
│                                                         │
│  Props                                                  │
│  ──────                                                 │
│  → Données passées du parent vers l'enfant              │
│  → Immuables (lecture seule)                            │
│  → Destructurées : const { name, age } = props          │
│  → Valeurs par défaut : { name = 'Visiteur' }           │
│  → Spread : <Comp {...monObjet} />                      │
│                                                         │
│  State                                                  │
│  ──────                                                 │
│  → Données locales modifiables                          │
│  → Classe   : this.state / this.setState()              │
│  → Fonction : const [x, setX] = useState(val)  ✅       │
│                                                         │
│  Structure d'un composant                               │
│  ─────────────────────────                              │
│  1. Imports                                             │
│  2. Définition (PascalCase)                             │
│  3. State                                               │
│  4. Effets (useEffect)                                  │
│  5. Handlers                                            │
│  6. Rendu JSX                                           │
│  7. Export                                              │
│                                                         │
│  ⚠️  Flux unidirectionnel : Parent → Enfant             │
│  ✅  Préférer les composants fonction + Hooks           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Concept | Classe | Fonction (moderne) |
|---------|--------|-------------------|
| **Définition** | `class App extends Component` | `const App = () => {}` |
| **Props** | `this.props.name` | `({ name })` |
| **State** | `this.state` / `this.setState()` | `useState()` |
| **Cycle de vie** | `componentDidMount()` etc. | `useEffect()` |
| **Recommandé** | ⚠️ Legacy | ✅ Oui |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Un composant = une responsabilité | Créer des composants trop complexes |
| Nommer les composants en PascalCase | Utiliser camelCase ou snake_case |
| Utiliser des composants fonctionnels | Utiliser des classes (sauf cas spécifiques) |
| Destructurer les props | Accéder via `props.name` sans destructurer |
| Garder les composants petits et réutilisables | Dupliquer du code entre composants |
| Séparer la logique de l'affichage | Mélanger logique métier et JSX |
| Nommer les handlers explicitement (`handleClick`) | Utiliser des noms génériques (`onClick`) |