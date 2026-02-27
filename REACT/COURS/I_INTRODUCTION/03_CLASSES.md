# Notions de Class

## Table des matières

- [Introduction](#introduction)
- [Structure d'une classe React](#structure-dune-classe-react)
- [Éléments clés d'une classe](#éléments-clés-dune-classe)
- [Exemple pratique : Combat Riri vs Fifi](#exemple-pratique--combat-riri-vs-fifi)
  - [Composant parent App.jsx](#composant-parent-appjsx)
  - [Composant enfant Riri.jsx](#composant-enfant-ririjsx)
  - [Analyse du code](#analyse-du-code)
- [Binding des méthodes](#binding-des-méthodes)
- [setState() en détail](#setstate-en-détail)
- [Comparaison Classe vs Fonction](#comparaison-classe-vs-fonction)
- [Quand utiliser les classes ?](#quand-utiliser-les-classes-)
- [Récapitulatif](#récapitulatif)
- [Points à retenir](#points-à-retenir)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

Avant l'arrivée des Hooks (React 16.8), les composants de type `class` étaient la seule façon de gérer un state local et d'accéder aux méthodes du cycle de vie.

Bien que les composants fonction soient aujourd'hui recommandés, il est important de comprendre les classes pour :

| Raison | Description |
|--------|-------------|
| **Code legacy** | Maintenir des projets existants écrits avec des classes |
| **Concepts fondamentaux** | Comprendre le fonctionnement interne de React |
| **Error Boundaries** | Seul cas d'usage exclusif aux classes encore aujourd'hui |

> 💡 Sur les nouveaux projets, on utilisera plutôt des composants **fonction**.  
> Les classes peuvent encore être employées en React, mais pourraient ne plus être maintenues dans le futur.

---

## Structure d'une classe React

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

  // 3. Méthodes du cycle de vie
  componentDidMount() {
    console.log('Composant monté');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Composant mis à jour');
  }

  componentWillUnmount() {
    console.log('Composant démonté');
  }

  // 4. Méthode render() : obligatoire, retourne le JSX
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

```
┌─────────────────────────────────────────────────────────┐
│               STRUCTURE D'UNE CLASSE REACT              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   class MonComposant extends Component {                │
│     │                                                   │
│     ├── constructor(props)    → State + binding         │
│     │     super(props)                                  │
│     │     this.state = {}                               │
│     │                                                   │
│     ├── maMethode = () => {}  → Logique métier          │
│     │                                                   │
│     ├── componentDidMount()   → Cycle de vie            │
│     ├── componentDidUpdate()                            │
│     ├── componentWillUnmount()                          │
│     │                                                   │
│     └── render()              → JSX (obligatoire)       │
│   }                                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Éléments clés d'une classe

| Élément | Description | Obligatoire |
|---------|-------------|-------------|
| `extends Component` | Hérite des fonctionnalités de React | ✅ Oui |
| `constructor(props)` | Initialise le state et lie les méthodes | Non (si pas de state) |
| `super(props)` | Appelle le constructeur parent | ✅ Oui (dans le constructor) |
| `this.state` | Objet contenant les données locales | Non |
| `this.setState()` | Met à jour le state | - |
| `this.props` | Accède aux props passées par le parent | - |
| `render()` | Retourne le JSX à afficher | ✅ Oui |

**Accès aux données :**

| Donnée | Syntaxe Classe | Syntaxe Fonction |
|--------|----------------|------------------|
| State | `this.state.maValeur` | `maValeur` |
| Modifier le state | `this.setState({ ... })` | `setMaValeur(...)` |
| Props | `this.props.maProp` | `maProp` (destructurée) |
| Méthode | `this.maMethode()` | `maMethode()` |

---

## Exemple pratique : Combat Riri vs Fifi

Une application mettant en scène deux personnages qui se lancent des dégâts aléatoires.

### Composant parent (`App.jsx`)

```jsx
import { Component } from 'react'
import Riri from './components/Riri'
import Fifi from './components/Fifi'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      riri: 100,
      fifi: 100
    }
  }

  // Méthode partagée entre les deux personnages
  reduceLife = (name, damage) => {
    // Si c'est Riri qui attaque, on réduit la vie de Fifi (et vice versa)
    const characterToUpdate = name === 'riri' ? 'fifi' : 'riri';

    this.setState(prevState => ({
      [characterToUpdate]: prevState[characterToUpdate] - damage
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

### Composant enfant (`Riri.jsx`)

```jsx
import { Component } from 'react';

class Riri extends Component {
  handleAttack = () => {
    // Génère des dégâts aléatoires entre 1 et 10
    const damage = Math.floor(Math.random() * 10) + 1;
    // Appelle la méthode du parent avec le nom du personnage et les dégâts
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

**Flux de données :**

```
┌─────────────────────────────────────────────────────────┐
│                  FLUX DE DONNÉES                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   App (parent)                                          │
│   ─────────────────────────────────────────────         │
│   state = { riri: 100, fifi: 100 }                      │
│   reduceLife = (name, damage) => {...}                   │
│         │                        │                      │
│         ▼                        ▼                      │
│   <Riri                    <Fifi                        │
│     name="riri"              name="fifi"                │
│     life={100}               life={100}                 │
│     reduceHandler={fn} />    reduceHandler={fn} />      │
│         │                        │                      │
│         ▼                        ▼                      │
│   Riri attaque             Fifi attaque                  │
│   → reduceHandler('riri')  → reduceHandler('fifi')      │
│   → fifi.life - damage     → riri.life - damage         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Composant `App` (parent) :**

| Élément | Rôle |
|---------|------|
| `this.state = { riri: 100, fifi: 100 }` | Initialise les points de vie des deux personnages |
| `reduceLife = (name, damage) => {...}` | Méthode partagée pour réduire les points de vie |
| `[characterToUpdate]` | Propriété calculée dynamiquement (ES6) |
| `this.setState(prevState => ...)` | Met à jour le state de manière sûre via la forme fonction |

**Composant enfant :**

| Élément | Rôle |
|---------|------|
| `this.props.name` | Identifie quel personnage attaque |
| `this.props.reduceHandler` | Référence à la méthode du parent |
| `Math.floor(Math.random() * 10) + 1` | Génère des dégâts aléatoires entre 1 et 10 |
| `disabled={life <= 0}` | Désactive le bouton si le personnage est K.O. |

---

## Binding des méthodes

Dans les classes, les méthodes **ne sont pas automatiquement liées** à `this`.  
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
        {/* Méthode 1 : Via binding dans constructor */}
        <button onClick={this.handleClick}>Click 1</button>

        {/* Méthode 2 : Arrow function (propriété de classe) */}
        <button onClick={this.handleClickArrow}>Click 2</button>

        {/* Méthode 3 : Arrow function inline (moins performant) */}
        <button onClick={() => this.handleClick()}>Click 3</button>
      </div>
    );
  }
}
```

| Méthode | Avantage | Inconvénient | Recommandation |
|---------|----------|--------------|----------------|
| Binding dans `constructor` | Explicite, une seule instance | Verbeux | ⚠️ Acceptable |
| Arrow function (propriété de classe) | Simple, auto-binding | Syntaxe ES7 | ✅ Recommandée |
| Arrow function inline | Flexible | Nouvelle fonction créée à chaque render | ❌ À éviter |

---

## setState() en détail

La méthode `setState()` est **asynchrone** : le state n'est pas mis à jour immédiatement.

```jsx
// ❌ Forme objet (problématique pour les calculs basés sur l'état précédent)
this.setState({ count: this.state.count + 1 });

// ✅ Forme fonction (sûre pour les calculs basés sur l'état précédent)
this.setState(prevState => ({
  count: prevState.count + 1
}));

// Avec callback (exécuté après la mise à jour effective)
this.setState(
  { count: 5 },
  () => console.log('State mis à jour :', this.state.count)
);

// Mise à jour d'une propriété imbriquée
this.setState(prevState => ({
  user: {
    ...prevState.user,   // Conservation des autres propriétés
    name: 'Alice'        // Mise à jour de name uniquement
  }
}));
```

**Pourquoi la forme fonction est recommandée :**

```jsx
// ❌ Problème avec la forme objet (résultat imprévisible)
handleTripleClick = () => {
  this.setState({ count: this.state.count + 1 });
  this.setState({ count: this.state.count + 1 });
  this.setState({ count: this.state.count + 1 });
  // Résultat : count + 1 (pas count + 3 !)
};

// ✅ Correct avec la forme fonction
handleTripleClick = () => {
  this.setState(prev => ({ count: prev.count + 1 }));
  this.setState(prev => ({ count: prev.count + 1 }));
  this.setState(prev => ({ count: prev.count + 1 }));
  // Résultat : count + 3 ✅
};
```

**Règles importantes :**

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser la forme fonction pour les calculs | Modifier directement `this.state.value = 5` |
| Utiliser `prevState` pour les dépendances au state précédent | `this.setState({ count: this.state.count + 1 })` en boucle |
| Fusionner avec spread pour les objets imbriqués | Remplacer tout le state |
| Utiliser le callback si besoin d'agir après la mise à jour | Lire `this.state` juste après `setState()` |

---

## Comparaison Classe vs Fonction

```
┌─────────────────────────────────────────────────────────┐
│              CLASSE vs FONCTION                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   CLASSE                    FONCTION                    │
│   ──────                    ────────                    │
│                                                         │
│   class App                 const App = () => {}        │
│     extends Component                                   │
│                                                         │
│   this.state = {}           useState()                  │
│   this.setState()           setMaValeur()               │
│                                                         │
│   this.props.name           const { name } = props      │
│                                                         │
│   componentDidMount()       useEffect(() => {}, [])     │
│   componentDidUpdate()      useEffect(() => {})         │
│   componentWillUnmount()    useEffect(() => {           │
│                               return () => {}           │
│                             }, [])                      │
│                                                         │
│   render() { return ... }   return ...                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Équivalence complète :**

```jsx
// ─── CLASSE ───────────────────────────────────────────
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    document.title = `Compteur : ${this.state.count}`;
  }

  componentDidUpdate() {
    document.title = `Compteur : ${this.state.count}`;
  }

  increment = () => {
    this.setState(prev => ({ count: prev.count + 1 }));
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

// ─── FONCTION (équivalent) ────────────────────────────
const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Compteur : ${count}`;
  });

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
};
```

| Aspect | Classe | Fonction (Hooks) |
|--------|--------|------------------|
| **Syntaxe** | Verbeux | Concis |
| **State** | `this.state` / `this.setState()` | `useState()` |
| **Cycle de vie** | Méthodes dédiées | `useEffect()` |
| **`this`** | Nécessite binding | Pas de `this` |
| **Lisibilité** | Plus complexe | Plus simple |
| **Réutilisabilité** | HOC / Render Props | Custom Hooks |
| **Performance** | Légèrement plus lourd | Optimisé |

---

## Quand utiliser les classes ?

| Situation | Recommandation |
|-----------|----------------|
| Nouveau projet | ✅ Composants fonction + Hooks |
| Maintenance de code legacy | ⚠️ Classes (si déjà en place) |
| **Error Boundaries** | ✅ Classes (seul cas obligatoire) |
| Apprentissage | Comprendre les deux |

**Error Boundary (cas d'usage exclusif aux classes) :**

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Appelée lors d'une erreur dans un enfant
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Pour logger l'erreur
  componentDidCatch(error, errorInfo) {
    console.error('Erreur capturée :', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Une erreur est survenue.</h1>;
    }

    return this.props.children;
  }
}

// Utilisation
<ErrorBoundary>
  <MonComposant />
</ErrorBoundary>
```

> ⚠️ Il n'existe pas d'équivalent Hook natif pour les Error Boundaries.  
> C'est le seul cas où les classes restent **obligatoires** en React.

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│               LES CLASSES REACT                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Structure                                              │
│  ─────────                                              │
│  class MonComp extends Component {                      │
│    constructor(props) {                                 │
│      super(props)                                       │
│      this.state = {}                                    │
│    }                                                    │
│    maMethode = () => { this.setState({...}) }           │
│    render() { return <JSX /> }                          │
│  }                                                      │
│                                                         │
│  Accès aux données                                      │
│  ──────────────────                                     │
│  → this.state.maValeur    : lire le state               │
│  → this.setState({...})   : modifier le state           │
│  → this.props.maProp      : lire les props              │
│                                                         │
│  setState()                                             │
│  ──────────                                             │
│  → Asynchrone                                           │
│  → Forme objet   : this.setState({ x: 5 })              │
│  → Forme fonction : this.setState(prev => ({...})) ✅   │
│                                                         │
│  Binding                                                │
│  ───────                                                │
│  → Arrow function = auto-binding ✅                     │
│  → Méthode classique = binding manuel nécessaire        │
│                                                         │
│  ⚠️  Error Boundaries : seul cas obligatoire            │
│  ✅  Nouveaux projets : préférer les fonctions + Hooks  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Concept | Classe | Fonction |
|---------|--------|----------|
| **State** | `this.state` / `this.setState()` | `useState()` |
| **Props** | `this.props.name` | `({ name })` |
| **Méthodes** | Arrow functions (auto-binding) | Fonctions classiques |
| **Cycle de vie** | `componentDidMount()` etc. | `useEffect()` |
| **Obligatoire** | Error Boundaries | Tout le reste |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser les arrow functions pour les méthodes | Utiliser des méthodes classiques sans binding |
| Utiliser la forme fonction de `setState()` pour les calculs | Modifier `this.state` directement |
| Destructurer les props dans `render()` | Accéder aux props via `this.props.x` partout |
| Préférer les composants fonction pour les nouveaux projets | Créer de nouvelles classes sans raison |
| Utiliser les classes uniquement pour les Error Boundaries | Dupliquer la logique entre plusieurs classes |