# Phase de Démontage

## Table des matières

- [Introduction](#introduction)
- [La méthode componentWillUnmount()](#la-méthode-componentwillunmount)
  - [Cas d'utilisation courants](#cas-dutilisation-courants)
  - [Exemples pratiques](#exemples-pratiques)
  - [Erreurs courantes à éviter](#erreurs-courantes-à-éviter)
- [Exemple complet](#exemple-complet)
  - [Composant parent App.jsx](#composant-parent-appjsx)
  - [Composant enfant LifeCycle.jsx](#composant-enfant-lifecyclejsx)
  - [Ordre d'exécution](#ordre-dexécution)
- [Schéma de la phase de démontage](#schéma-de-la-phase-de-démontage)
- [Récapitulatif](#récapitulatif)
  - [Points à retenir](#points-à-retenir)
  - [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

La phase de démontage correspond au moment où le composant est **retiré du DOM**.  
C'est la **dernière phase** du cycle de vie d'un composant React.

Dans la documentation, il est spécifié que `componentWillUnmount()` est appelée immédiatement **avant** qu'un composant soit démonté ou détruit.

```
┌─────────────────────────────────────────────────────────┐
│                  PHASE DE DÉMONTAGE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Suppression du composant par le parent                │
│   (rendu conditionnel, changement de route...)          │
│          │                                              │
│          ▼                                              │
│   1. componentWillUnmount()   → Nettoyage               │
│          │                                              │
│          ▼                                              │
│      [ Suppression du DOM ]                             │
│          │                                              │
│          ▼                                              │
│      Composant détruit (garbage collected)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `componentWillUnmount()` | Nettoyage avant suppression du DOM | Non |

---

## La méthode componentWillUnmount()

Cette méthode permet d'effectuer des nettoyages tels que :
- Invalidation des minuteurs (timers)
- Annulation des requêtes réseau
- Résiliation d'abonnements (subscriptions)
- Suppression des event listeners
- Nettoyage des refs

```jsx
componentWillUnmount() {
  console.log(`step [${this.state.step}] - dans le componentWillUnmount`);
}
```

> ⚠️ **Règle importante :**  
> Il ne faut **EN AUCUN CAS** appeler `setState()` dans `componentWillUnmount()`, car le composant ne sera jamais ré-affiché.  
> Une fois l'instance du composant démontée, elle ne sera **plus jamais re-montée**.

```jsx
// ❌ INTERDIT : Ne jamais faire ceci !
componentWillUnmount() {
  this.setState({ unmounted: true }); // Provoque un warning React
}

// ✅ Correct : Nettoyage uniquement
componentWillUnmount() {
  console.log('Composant démonté');
}
```

### Cas d'utilisation courants

| Utilisation | Description |
|-------------|-------------|
| **Timers** | Annuler `setInterval()` ou `setTimeout()` |
| **Event listeners** | Retirer les écouteurs ajoutés au DOM |
| **Requêtes réseau** | Annuler les requêtes en cours (AbortController) |
| **Abonnements** | Se désabonner de WebSockets, Redux, etc. |
| **Librairies tierces** | Détruire les instances (charts, maps, etc.) |

### Exemples pratiques

**Nettoyage d'un timer :**

```jsx
componentDidMount() {
  this.timerID = setInterval(() => {
    this.setState({ time: new Date() });
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerID);
  console.log('Timer nettoyé');
}
```

**Nettoyage d'event listeners :**

```jsx
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
  window.addEventListener('scroll', this.handleScroll);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
  window.removeEventListener('scroll', this.handleScroll);
  console.log('Event listeners supprimés');
}
```

**Annulation d'une requête réseau avec AbortController :**

```jsx
componentDidMount() {
  this.abortController = new AbortController();

  fetch('https://api.example.com/data', {
    signal: this.abortController.signal
  })
    .then(response => response.json())
    .then(data => this.setState({ data }))
    .catch(error => {
      if (error.name !== 'AbortError') {
        console.error('Erreur:', error);
      }
    });
}

componentWillUnmount() {
  this.abortController.abort();
  console.log('Requête annulée');
}
```

**Nettoyage d'un abonnement WebSocket :**

```jsx
componentDidMount() {
  this.socket = new WebSocket('wss://example.com/socket');
  this.socket.onmessage = (event) => {
    this.setState({ message: event.data });
  };
}

componentWillUnmount() {
  this.socket.close();
  console.log('WebSocket fermé');
}
```

**Nettoyage d'une librairie tierce (ex: Chart.js) :**

```jsx
componentDidMount() {
  this.chart = new Chart(this.canvasRef.current, {
    type: 'bar',
    data: this.props.data
  });
}

componentWillUnmount() {
  this.chart.destroy();
  console.log('Chart détruit');
}
```

**Pattern pour éviter setState sur un composant démonté :**

```jsx
class SafeComponent extends Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        // Vérifier si le composant est toujours monté
        if (this._isMounted) {
          this.setState({ data });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return <div>{this.state.data}</div>;
  }
}
```

### Erreurs courantes à éviter

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Oublier de nettoyer les timers | Fuite mémoire, erreurs *"Can't perform state update on unmounted component"* | Toujours `clearInterval()` / `clearTimeout()` |
| Oublier de retirer les event listeners | Fuite mémoire, comportements inattendus | `removeEventListener()` avec la même référence de fonction |
| Appeler `setState()` après démontage | Warning React, comportement imprévisible | Vérifier si le composant est monté ou annuler les requêtes |
| Ne pas fermer les connexions | Connexions orphelines, fuite de ressources | `socket.close()`, `abort()`, etc. |

---

## Exemple complet

### Composant parent (`App.jsx`)

```jsx
import { Component } from 'react';
import LifeCycle from './components/LifeCycle.jsx';

class App extends Component {
  state = {
    display: true,
  };

  toggleDisplay = () => {
    console.log('bouton cliqué');
    this.setState({ display: !this.state.display });
  };

  render() {
    const showComponent = this.state.display ? <LifeCycle /> : null;

    return (
      <>
        <div>Hello world !</div>
        {showComponent}
        <button onClick={this.toggleDisplay}>
          click here
        </button>
      </>
    );
  }
}

export default App;
```

### Composant enfant (`LifeCycle.jsx`)

```jsx
import { Component } from 'react';

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

    // Démarrage d'un timer
    this.timerID = setInterval(() => {
      this.setState({ step: this.state.step + 1 });
    }, 5000);
  }

  componentWillUnmount() {
    console.log(`step [${this.state.step}] - dans le componentWillUnmount`);

    // Nettoyage obligatoire du timer
    clearInterval(this.timerID);
  }

  render() {
    console.log(`step [${this.state.step}] - dans le render`);
    return (
      <div>
        <p>Life cycle component</p>
        <p>Step: {this.state.step}</p>
      </div>
    );
  }
}

export default LifeCycle;
```

La fonction `toggleDisplay()` qui gère l'état du composant `<LifeCycle />` permet de l'afficher ou non.

Le fait de cliquer pour **ne plus afficher** le composant va automatiquement appeler `componentWillUnmount()` et mettre fin au cycle de vie du composant.

### Ordre d'exécution

**Affichage du composant (montage) :**

```
step [1] - dans le constructor
step [1] - dans le render
step [1] - dans le componentDidMount
```

**Masquage du composant (démontage) :**

```
bouton cliqué
step [1] - dans le componentWillUnmount
```

```
┌─────────────────────────────────────────────────────────┐
│          ORDRE D'EXÉCUTION - PHASE DE DÉMONTAGE         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Clic sur le bouton (toggleDisplay)                     │
│          │                                              │
│          ▼                                              │
│  setState({ display: false }) dans App                  │
│          │                                              │
│          ▼                                              │
│  render() de App → <LifeCycle /> n'est plus rendu       │
│          │                                              │
│          ▼                                              │
│  componentWillUnmount() de LifeCycle                    │
│  → clearInterval(this.timerID)                          │
│          │                                              │
│          ▼                                              │
│  [ Suppression du DOM ]                                 │
│          │                                              │
│          ▼                                              │
│  Composant détruit                                      │
│                                                         │
│  ⚠️  Une fois démonté, le composant ne sera             │
│      JAMAIS re-monté (nouvelle instance à la place)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

> 💡 **Points importants :**
> - Les composants **enfants** sont démontés **avant** le parent.
> - Une fois démonté, l'instance est **définitivement détruite**.
> - Si le composant est ré-affiché, une **nouvelle instance** est créée depuis le début (`constructor` rappelé).

---

## Schéma de la phase de démontage

```
    Suppression du composant par le parent
    (rendu conditionnel, changement de route...)
                    │
                    ▼
       ┌─────────────────────────────┐
       │   componentWillUnmount()    │
       │                             │
       │  - clearInterval/Timeout()  │
       │  - removeEventListener()    │
       │  - abortController.abort()  │
       │  - socket.close()           │
       │  - chart.destroy()          │
       └─────────────────────────────┘
                    │
                    ▼
          [ Suppression du DOM ]
                    │
                    ▼
       Composant détruit (garbage collected)
```

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                  PHASE DE DÉMONTAGE                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  componentWillUnmount()                                 │
│  ──────────────────────                                 │
│  → Appelée une seule fois avant la suppression du DOM   │
│  → setState() INTERDIT                                  │
│  → Nettoyage de tous les effets de bord                 │
│                                                         │
│  Nettoyages obligatoires                                │
│  ────────────────────────                               │
│  → clearInterval() / clearTimeout()  : timers           │
│  → removeEventListener()             : listeners        │
│  → abortController.abort()           : requêtes         │
│  → socket.close()                    : WebSockets       │
│  → chart.destroy()                   : libs tierces     │
│                                                         │
│  Déclencheurs du démontage                              │
│  ─────────────────────────                              │
│  → Rendu conditionnel (null)                            │
│  → Changement de route                                  │
│  → Suppression par le parent                            │
│                                                         │
│  ⚠️  setState() interdit                                │
│  ⚠️  Instance définitivement détruite                   │
│  ⚠️  Enfants démontés AVANT le parent                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Point | Explication |
|-------|-------------|
| Appelée une seule fois | Juste avant la suppression définitive du DOM |
| Nettoyage obligatoire | Timers, listeners, abonnements, requêtes |
| `setState()` interdit | Le composant ne sera plus jamais affiché |
| Pas de re-montage | Une fois démonté, l'instance est définitivement détruite |
| Nouvelle instance | Si ré-affiché, un nouveau `constructor` est appelé |
| Ordre avec les enfants | Les enfants sont démontés **avant** le parent |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Nettoyer **tous** les effets de bord démarrés dans `componentDidMount` | Oublier de nettoyer timers ou listeners |
| Utiliser `AbortController` pour annuler les requêtes | Laisser des requêtes en cours après démontage |
| Vérifier `_isMounted` avant `setState()` dans les callbacks async | Appeler `setState()` sur un composant démonté |
| Fermer les connexions WebSocket | Laisser des connexions orphelines ouvertes |
| Détruire les instances de librairies tierces | Créer des fuites mémoire avec Chart.js, maps, etc. |
| Utiliser la même référence de fonction pour `removeEventListener` | Passer une arrow function inline à `addEventListener` |