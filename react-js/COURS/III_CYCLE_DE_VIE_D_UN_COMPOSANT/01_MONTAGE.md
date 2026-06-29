# Phase de Montage

## Table des matières

- [Introduction](#introduction)
- [La méthode constructor()](#la-méthode-constructor)
  - [Rôle du constructor](#rôle-du-constructor)
  - [Liaison des méthodes](#liaison-des-méthodes)
- [La méthode render()](#la-méthode-render)
  - [Règles importantes](#règles-importantes)
  - [Types de retour possibles](#types-de-retour-possibles)
- [La méthode componentDidMount()](#la-méthode-componentdidmount)
  - [Cas d'utilisation courants](#cas-dutilisation-courants)
  - [Exemples pratiques](#exemples-pratiques)
- [Exemple complet](#exemple-complet)
  - [LifeCycle.jsx](#lifecyclejsx)
  - [ChildComponent.jsx](#childcomponentjsx)
  - [Ordre d'exécution](#ordre-dexécution)
- [Récapitulatif](#récapitulatif)
  - [Points à retenir](#points-à-retenir)
  - [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

La phase de montage correspond au moment où le composant est **créé et inséré dans le DOM**.  
C'est la **première phase** du cycle de vie d'un composant React.

```
┌─────────────────────────────────────────────────────────┐
│                  PHASE DE MONTAGE                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. constructor()            → Initialisation          │
│          │                                              │
│          ▼                                              │
│   2. getDerivedStateFromProps()  → (optionnel)          │
│          │                                              │
│          ▼                                              │
│   3. render()                 → Génération du JSX       │
│          │                                              │
│          ▼                                              │
│      [ Mise à jour du DOM ]                             │
│          │                                              │
│          ▼                                              │
│   4. componentDidMount()      → Après insertion DOM     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `constructor()` | Première méthode appelée, initialise le state | Oui |
| `getDerivedStateFromProps()` | Synchronise le state avec les props | Non |
| `render()` | Retourne le JSX à afficher | Oui |
| `componentDidMount()` | Appelée après insertion dans le DOM | Non |

---

## La méthode constructor()

Pour instancier une classe pour en faire un objet, on est obligé de passer par la méthode `constructor()`.  
Le constructor est construit de cette manière :

```jsx
// Appel de la méthode constructor qui prend un paramètre props
constructor(props) {
  // Appel de la méthode super qui contient le props
  super(props);

  this.state = {
    // L'état initial peut être setté ici
    name: 'toto'
  };

  // Possibilité de modifier le state directement dans le constructeur
  this.state.name = 'titi';
}
```

> ⚠️ À noter :
> - On ne pourra pas utiliser `this.state.[...]` ailleurs pour modifier le state directement.
> - La méthode `setState()` ne pourra **pas** être appelée dans le constructor.

### Rôle du constructor

| Utilisation | Description |
|-------------|-------------|
| **Initialiser le state local** | Définir `this.state` avec les valeurs initiales |
| **Lier les méthodes** | Associer `this` aux gestionnaires d'événements |
| **Recevoir les props** | Accéder aux props passées par le composant parent |

```jsx
// ❌ Anti-pattern : copier les props dans le state
constructor(props) {
  super(props);
  this.state = {
    name: props.name // Mauvaise pratique !
  };
}

// ✅ Bonne pratique : utiliser directement les props
render() {
  return <p>{this.props.name}</p>;
}
```

### Liaison des méthodes

Dans les composants classe, les méthodes ne sont **pas liées automatiquement** à `this`.  
Il existe deux façons de les lier :

```jsx
// Méthode 1 : Liaison dans le constructor
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}

handleClick() {
  console.log(this.state);
}

// Méthode 2 : Utilisation des arrow functions ✅ Recommandée
handleClick = () => {
  console.log(this.state);
}
```

| Méthode | Avantage | Inconvénient | Recommandation |
|---------|----------|--------------|----------------|
| Binding dans `constructor` | Explicite | Verbeux | ⚠️ Acceptable |
| Arrow function (propriété de classe) | Simple, auto-binding | Syntaxe ES7+ | ✅ Recommandée |
| Arrow function inline | Flexible | Nouvelle fonction à chaque render | ❌ À éviter |

---

## La méthode render()

La méthode `render()` va permettre de **retourner du JSX**.  
Cette méthode ne permet pas de changer le state.

Si on fait appel à un composant enfant dans `render()`, la suite de l'exécution va attendre la fin de l'exécution du composant enfant, qui contient lui-même : `constructor`, `render` et `componentDidMount`.

```jsx
render() {
  return (
    <div>
      <h2>Parent component</h2>
      <ChildComponent />
    </div>
  )
}
```

### Règles importantes

| Règle | Explication |
|-------|-------------|
| Méthode **pure** | Ne doit pas modifier le state du composant |
| Retour obligatoire | Doit retourner un élément React, un tableau, un fragment, une chaîne, un nombre, un booléen ou `null` |
| Pas d'effets de bord | Ne pas effectuer de requêtes HTTP ou d'interactions avec le navigateur |
| Appelée à chaque mise à jour | Se déclenche à chaque changement de props ou de state |

### Types de retour possibles

```jsx
// Élément React (le plus courant)
render() {
  return <div>Hello</div>;
}

// Fragment (pour retourner plusieurs éléments sans wrapper)
render() {
  return (
    <>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </>
  );
}

// Tableau d'éléments (nécessite des keys)
render() {
  return [
    <li key="1">Item 1</li>,
    <li key="2">Item 2</li>
  ];
}

// Chaîne de caractères ou nombre
render() {
  return 'Hello World';
}

// null (ne rend rien)
render() {
  return null;
}

// Rendu conditionnel
render() {
  return this.state.isLoading ? <Spinner /> : <Content />;
}
```

---

## La méthode componentDidMount()

La méthode `componentDidMount()` n'est invoquée qu'**une seule fois** après que ses enfants auront été montés (chargés dans le DOM).

Il est possible d'appeler `setState()` directement dans `componentDidMount()`.  
Cela déclenchera un **rendu supplémentaire** qui aura lieu avant que le navigateur ne mette à jour l'écran.

```jsx
componentDidMount() {
  console.log('Composant monté !');
}
```

> ⚠️ Appeler `setState()` dans `componentDidMount()` est possible mais peut impacter les performances car cela déclenche un re-render immédiat. L'utilisateur ne verra pas l'état intermédiaire.

### Cas d'utilisation courants

| Utilisation | Exemple |
|-------------|---------|
| **Requêtes API** | Charger des données depuis un serveur |
| **Abonnements** | S'abonner à un WebSocket ou un event listener |
| **Manipulation du DOM** | Accéder à un élément DOM avec des refs |
| **Librairies tierces** | Initialiser une librairie comme Chart.js |

### Exemples pratiques

```jsx
// Requête API
componentDidMount() {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
      this.setState({ data: data });
    })
    .catch(error => {
      this.setState({ error: error.message });
    });
}
```

```jsx
// Timer avec nettoyage nécessaire dans componentWillUnmount
componentDidMount() {
  this.timerID = setInterval(() => {
    this.setState({ time: new Date() });
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerID); // Nettoyage obligatoire !
}
```

```jsx
// Event listener avec nettoyage nécessaire dans componentWillUnmount
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}
```

```jsx
// Manipulation du DOM avec ref
constructor(props) {
  super(props);
  this.inputRef = React.createRef();
}

componentDidMount() {
  this.inputRef.current.focus(); // Focus automatique sur l'input
}

render() {
  return <input ref={this.inputRef} />;
}
```

---

## Exemple complet

### `LifeCycle.jsx`

```jsx
import { Component } from 'react';
import ChildComponent from './ChildComponent.jsx';

class LifeCycle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'LifeCycle',
      step: 1,
    };

    console.log(`step [${this.state.step}] - dans le constructor`);
  }

  componentDidMount() {
    console.log(`step [${this.state.step}] - dans le componentDidMount`);
  }

  render() {
    console.log(`step [${this.state.step}] - dans le render`);
    return (
      <div>
        {console.log(`step [${this.state.step}] - mise à jour du DOM`)}
        <p>Life cycle component</p>
        <p>Name: {this.state.name}</p>
        <p>chargement : {this.state.step}</p>
        <ChildComponent />
      </div>
    );
  }
}

export default LifeCycle;
```

### `ChildComponent.jsx`

```jsx
import { Component } from 'react';

class ChildComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    console.log('ChildComponent - constructor');
  }

  componentDidMount() {
    console.log('ChildComponent - componentDidMount');
  }

  render() {
    console.log('ChildComponent - render');
    return (
      <div>
        {console.log('ChildComponent - mise à jour du DOM')}
        Child Component
      </div>
    );
  }
}

export default ChildComponent;
```

### Ordre d'exécution

L'affichage dans la console du navigateur sera le suivant :

```
step [1] - dans le constructor
step [1] - dans le render
step [1] - mise à jour du DOM
ChildComponent - constructor
ChildComponent - render
ChildComponent - mise à jour du DOM
ChildComponent - componentDidMount
step [1] - dans le componentDidMount
```

```
┌─────────────────────────────────────────────────────────┐
│           ORDRE D'EXÉCUTION - PHASE DE MONTAGE          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. constructor (parent)                                │
│  2. render (parent)                                     │
│       │                                                 │
│       ├── 2a. constructor (enfant)                      │
│       ├── 2b. render (enfant)                           │
│       ├── 2c. [ Mise à jour du DOM enfant ]             │
│       └── 2d. componentDidMount (enfant)                │
│                                                         │
│  3. [ Mise à jour du DOM parent ]                       │
│  4. componentDidMount (parent)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

L'ordre d'enchaînement lors de la phase de montage est donc le suivant :

1. `constructor` parent
2. `render` parent
   - `constructor` enfant
   - `render` enfant
   - `componentDidMount` enfant
3. `componentDidMount` parent

> 💡 Le `componentDidMount` du parent est **toujours** exécuté **après** celui de ses enfants.

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                  PHASE DE MONTAGE                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  constructor()                                          │
│  ──────────────                                         │
│  → Initialise this.state = {}                           │
│  → Binding des méthodes                                 │
│  → super(props) obligatoire                             │
│  → setState() interdit                                  │
│                                                         │
│  render()                                               │
│  ────────                                               │
│  → Retourne le JSX                                      │
│  → Méthode pure (pas d'effets de bord)                  │
│  → setState() interdit                                  │
│  → Attend la fin des composants enfants                 │
│                                                         │
│  componentDidMount()                                    │
│  ───────────────────                                    │
│  → Appelée une seule fois après insertion dans le DOM   │
│  → setState() autorisé (⚠️ déclenche un re-render)     │
│  → Requêtes API, timers, event listeners                │
│  → Toujours nettoyer dans componentWillUnmount()        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Méthode | `setState()` | Appelée | Usage principal |
|---------|-------------|---------|-----------------|
| `constructor()` | ❌ Non | Une seule fois | Initialisation du state |
| `render()` | ❌ Non | À chaque mise à jour | Génération du JSX |
| `componentDidMount()` | ✅ Oui | Une seule fois | Requêtes API, abonnements |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Initialiser le state dans `constructor` | Copier les props dans le state |
| Utiliser les arrow functions pour les méthodes | Oublier le binding de `this` |
| Charger les données dans `componentDidMount` | Faire des requêtes dans `render()` |
| Toujours nettoyer dans `componentWillUnmount` | Laisser des timers ou listeners actifs |
| Conditionner `setState()` si nécessaire | Appeler `setState()` sans condition dans `componentDidMount` |