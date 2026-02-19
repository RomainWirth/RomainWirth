# Phase de Mise à jour

## Table des matières

- [Introduction](#introduction)
- [Déclencheurs de mise à jour](#déclencheurs-de-mise-à-jour)
- [La méthode render()](#la-méthode-render)
- [La méthode componentDidUpdate()](#la-méthode-componentdidupdate)
  - [Paramètres disponibles](#paramètres-disponibles)
  - [Cas d'utilisation courants](#cas-dutilisation-courants)
  - [Exemples pratiques](#exemples-pratiques)
  - [Éviter les boucles infinies](#éviter-les-boucles-infinies)
- [Exemple complet](#exemple-complet)
  - [Ordre d'exécution](#ordre-dexécution)
- [Schéma de la phase de mise à jour](#schéma-de-la-phase-de-mise-à-jour)
- [Récapitulatif](#récapitulatif)
  - [Points à retenir](#points-à-retenir)
  - [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

La phase de mise à jour se déclenche lorsque le composant reçoit de **nouvelles props** ou lorsque son **state change** via `setState()`.  
Durant cette phase, le `constructor` n'est **jamais** rappelé.

```
┌─────────────────────────────────────────────────────────┐
│                 PHASE DE MISE À JOUR                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   setState() / nouvelles props / forceUpdate()          │
│          │                                              │
│          ▼                                              │
│   1. getDerivedStateFromProps()   → (optionnel)         │
│          │                                              │
│          ▼                                              │
│   2. shouldComponentUpdate()      → (optionnel)         │
│          │                                              │
│          ▼  (si true)                                   │
│   3. render()                     → Re-génération JSX   │
│          │                                              │
│          ▼                                              │
│   4. getSnapshotBeforeUpdate()    → (optionnel)         │
│          │                                              │
│          ▼                                              │
│      [ Mise à jour du DOM ]                             │
│          │                                              │
│          ▼                                              │
│   5. componentDidUpdate()         → Après mise à jour   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `getDerivedStateFromProps()` | Synchronise le state avec les props | Non |
| `shouldComponentUpdate()` | Détermine si le composant doit se mettre à jour | Non |
| `render()` | Re-génère le JSX | Oui |
| `getSnapshotBeforeUpdate()` | Capture des infos du DOM avant modification | Non |
| `componentDidUpdate()` | Appelée après la mise à jour du DOM | Non |

---

## Déclencheurs de mise à jour

| Déclencheur | Description |
|-------------|-------------|
| `setState()` | Modification du state local du composant |
| Nouvelles props | Le composant parent passe de nouvelles valeurs |
| `forceUpdate()` | Force un re-render (bypass `shouldComponentUpdate`) |

> ⚠️ Le `constructor` n'est **jamais** rappelé lors d'une mise à jour.  
> Il n'est appelé qu'une seule fois, lors de la création du composant.

---

## La méthode render()

Lors de la mise à jour, `render()` est appelé à nouveau pour générer le nouveau JSX.  
Les mêmes règles que lors du montage s'appliquent :

```jsx
render() {
  console.log(`step [${this.state.step}] - dans le render`);
  return (
    <div>
      <p>Step actuel : {this.state.step}</p>
    </div>
  );
}
```

| Règle | Explication |
|-------|-------------|
| Méthode **pure** | Ne doit pas modifier le state du composant |
| Pas d'effets de bord | Ne pas effectuer de requêtes HTTP ou d'interactions avec le navigateur |
| `setState()` interdit | Provoquerait une boucle infinie |
| Appelée à chaque mise à jour | Se déclenche à chaque changement de props ou de state |

---

## La méthode componentDidUpdate()

La méthode `componentDidUpdate()` est appelée immédiatement **après** que la mise à jour a eu lieu.  
Elle n'est **pas appelée** lors du montage initial.

```jsx
componentDidUpdate(prevProps, prevState) {
  console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
  console.log('Previous state: ', prevState);
  console.log('Current state: ', this.state);
}
```

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| `prevProps` | Les props avant la mise à jour |
| `prevState` | Le state avant la mise à jour |
| `snapshot` | Valeur retournée par `getSnapshotBeforeUpdate()` (optionnel) |

### Cas d'utilisation courants

| Utilisation | Exemple |
|-------------|---------|
| **Requêtes conditionnelles** | Charger des données quand une prop change |
| **Comparaison d'état** | Réagir à un changement spécifique |
| **Manipulation du DOM** | Mettre à jour le scroll, focus, etc. |
| **Intégrations tierces** | Synchroniser avec des librairies externes |

### Exemples pratiques

```jsx
// Requête API conditionnelle
componentDidUpdate(prevProps) {
  // Recharger les données si l'ID utilisateur change
  if (prevProps.userId !== this.props.userId) {
    this.fetchUserData(this.props.userId);
  }
}
```

```jsx
// Comparaison d'état pour actions conditionnelles
componentDidUpdate(prevProps, prevState) {
  // Afficher un message quand le score dépasse 100
  if (prevState.score <= 100 && this.state.score > 100) {
    this.showCongratulations();
  }
}
```

```jsx
// Scroll automatique vers le bas
componentDidUpdate(prevProps) {
  if (prevProps.messages.length !== this.props.messages.length) {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }
}
```

```jsx
// Synchronisation avec localStorage
componentDidUpdate(prevProps, prevState) {
  if (prevState.preferences !== this.state.preferences) {
    localStorage.setItem(
      'preferences',
      JSON.stringify(this.state.preferences)
    );
  }
}
```

### Éviter les boucles infinies

Appeler `setState()` dans `componentDidUpdate()` **sans condition** provoque une boucle infinie :

```jsx
// ❌ DANGER : Boucle infinie !
componentDidUpdate() {
  this.setState({ updated: true });
  // setState → componentDidUpdate → setState → ...
}

// ✅ Bonne pratique : toujours conditionner setState
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    this.setState({ lastUpdated: new Date() });
  }
}
```

```
┌─────────────────────────────────────────────────────────┐
│              BOUCLE INFINIE À ÉVITER                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   setState()                                            │
│       │                                                 │
│       ▼                                                 │
│   componentDidUpdate()                                  │
│       │                                                 │
│       ▼                                                 │
│   setState() ← sans condition ← ❌ DANGER               │
│       │                                                 │
│       ▼                                                 │
│   componentDidUpdate() → boucle infinie !               │
│                                                         │
│   ✅ Solution : conditionner avec prevState / prevProps  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Exemple complet

Composant `LifeCycle.jsx` avec `setState()` dans `componentDidMount()` :

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

    this.setState({ step: 2 }, () => {
      console.log(
        `step [${this.state.step}] - après le setState du componentDidMount`
      );
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
    console.log('Previous state: ', prevState);
    console.log('Current state: ', this.state);
  }

  render() {
    console.log(`step [${this.state.step}] - dans le render`);
    return (
      <div>
        {console.log(`step [${this.state.step}] - mise à jour du DOM`)}
        <p>Life cycle component</p>
        <p>Name: {this.state.name}</p>
        <p>Step: {this.state.step}</p>
        <ChildComponent />
      </div>
    );
  }
}

export default LifeCycle;
```

### Ordre d'exécution

L'affichage dans la console du navigateur sera le suivant :

**Phase de montage :**
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

**Phase de mise à jour (déclenchée par setState dans componentDidMount) :**
```
step [2] - dans le render
step [2] - mise à jour du DOM
ChildComponent - render
ChildComponent - mise à jour du DOM
step [2] - dans le componentDidUpdate
Previous state:  {name: 'LifeCycle', step: 1}
Current state:   {name: 'LifeCycle', step: 2}
step [2] - après le setState du componentDidMount
```

```
┌─────────────────────────────────────────────────────────┐
│           ORDRE D'EXÉCUTION - PHASE DE MISE À JOUR      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  setState() déclenché dans componentDidMount            │
│          │                                              │
│          ▼                                              │
│  1. render() parent                                     │
│       │                                                 │
│       ├── 1a. render() enfant                           │
│       └── 1b. [ Mise à jour du DOM enfant ]             │
│                                                         │
│  2. [ Mise à jour du DOM parent ]                       │
│  3. componentDidUpdate() parent                         │
│  4. Callback du setState()                              │
│                                                         │
│  ⚠️  Le constructor n'est JAMAIS rappelé                │
│  ⚠️  Le callback setState s'exécute APRÈS               │
│      componentDidUpdate                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

> 💡 **Points importants :**
> - On ne repasse **jamais** par le `constructor` lors d'une mise à jour.
> - Le callback de `setState()` s'exécute **après** `componentDidUpdate()`.
> - Les composants enfants suivent leur propre cycle (`render` → mise à jour du DOM).

---

## Schéma de la phase de mise à jour

```
setState() / nouvelles props / forceUpdate()
                    │
                    ▼
    ┌───────────────────────────────┐
    │  getDerivedStateFromProps()   │  (optionnel)
    └───────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │   shouldComponentUpdate()     │  (optionnel)
    │      return true / false      │  (ignoré si forceUpdate)
    └───────────────────────────────┘
                    │
            true    │    false
                    ▼      ──► (arrêt, pas de re-render)
    ┌───────────────────────────────┐
    │           render()            │
    └───────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │   getSnapshotBeforeUpdate()   │  (optionnel)
    └───────────────────────────────┘
                    │
                    ▼
          [ Mise à jour du DOM ]
                    │
                    ▼
    ┌───────────────────────────────┐
    │     componentDidUpdate()      │
    │  (prevProps, prevState,       │
    │   snapshot)                   │
    └───────────────────────────────┘
                    │
                    ▼
          Callback de setState()
          (si fourni)
```

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                 PHASE DE MISE À JOUR                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Déclencheurs                                           │
│  ─────────────                                          │
│  → setState()      : modification du state local        │
│  → Nouvelles props : passées par le parent              │
│  → forceUpdate()   : bypass shouldComponentUpdate       │
│                                                         │
│  render()                                               │
│  ────────                                               │
│  → Re-génère le JSX                                     │
│  → Méthode pure (pas d'effets de bord)                  │
│  → setState() interdit (boucle infinie)                 │
│                                                         │
│  componentDidUpdate(prevProps, prevState, snapshot)     │
│  ─────────────────────────────────────────────────      │
│  → Appelée après chaque mise à jour du DOM              │
│  → Non appelée au montage initial                       │
│  → setState() autorisé (⚠️ toujours conditionner)      │
│  → Callback setState s'exécute après                    │
│                                                         │
│  ⚠️  constructor jamais rappelé                         │
│  ⚠️  Conditionner TOUJOURS setState dans                │
│      componentDidUpdate                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Point | Explication |
|-------|-------------|
| `constructor` jamais rappelé | Seul le montage initial l'appelle |
| `componentDidUpdate` après le DOM | Le DOM est déjà mis à jour quand cette méthode s'exécute |
| Conditions obligatoires | Toujours conditionner `setState()` dans `componentDidUpdate()` |
| Composants enfants | Ils suivent leur propre cycle (render → mise à jour du DOM) |
| Callback de `setState()` | Exécuté **après** `componentDidUpdate()` |
| `forceUpdate()` | Bypass `shouldComponentUpdate`, à utiliser avec précaution |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Conditionner `setState()` avec `prevProps` / `prevState` | Appeler `setState()` sans condition dans `componentDidUpdate` |
| Comparer les valeurs avant de déclencher une action | Ignorer `prevProps` et `prevState` |
| Utiliser le callback de `setState()` pour agir après la mise à jour | Lire `this.state` juste après `setState()` |
| Nettoyer les effets de bord démarrés dans `componentDidMount` | Laisser des timers ou listeners actifs lors du démontage |
| Utiliser `PureComponent` pour optimiser les re-renders | Implémenter `shouldComponentUpdate` manuellement sans raison |
| Créer de nouvelles références pour les objets/tableaux dans le state | Muter directement les objets du state |