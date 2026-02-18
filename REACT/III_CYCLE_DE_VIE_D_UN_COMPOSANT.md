# LE CYCLE DE VIE D'UN COMPOSANT REACT AVEC LES CLASSES

## Introduction

Le cycle de vie d'un composant React (lifecycle methods) représente les différentes étapes par lesquelles passe un composant, de sa création à sa destruction.  
Ces méthodes ne sont accessibles que depuis un composant de type `class`.

### Les 3 phases principales

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    MONTAGE      │ ──► │  MISE À JOUR    │ ──► │   DÉMONTAGE     │
│                 │     │                 │     │                 │
│ constructor()   │     │ render()        │     │ componentWill   │
│ render()        │     │ componentDid    │     │ Unmount()       │
│ componentDid    │     │ Update()        │     │                 │
│ Mount()         │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Méthodes par phase

**Phase de Montage (création du composant) :**

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `constructor()` | Première méthode appelée, initialise le state | Oui |
| `getDerivedStateFromProps()` | Synchronise le state avec les props | Non |
| `render()` | Retourne le JSX à afficher | Oui |
| `componentDidMount()` | Appelée après insertion dans le DOM | Non |

**Phase de Mise à jour (modification du composant) :**

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `getDerivedStateFromProps()` | Synchronise le state avec les props | Non |
| `shouldComponentUpdate()` | Détermine si le composant doit se mettre à jour | Non |
| `render()` | Re-génère le JSX | Oui |
| `getSnapshotBeforeUpdate()` | Capture des infos du DOM avant modification | Non |
| `componentDidUpdate()` | Appelée après la mise à jour du DOM | Non |

**Phase de Démontage (destruction du composant) :**

| Méthode | Description | Obligatoire |
|---------|-------------|-------------|
| `componentWillUnmount()` | Nettoyage avant suppression du DOM | Non |

### Ressources

- [Documentation officielle React (legacy)](https://fr.legacy.reactjs.org/docs/react-component.html)
- [Diagramme interactif du cycle de vie](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

### Note sur React moderne

Depuis React 16.8, les **Hooks** permettent de gérer le cycle de vie dans les composants fonction :

| Méthode classe | Hook équivalent |
|----------------|-----------------|
| `constructor` | `useState()` |
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => {} }, [])` |

Les classes restent valides et importantes à connaître pour :
- Comprendre le code legacy
- Certains cas d'usage avancés (Error Boundaries)
- Maîtriser les concepts fondamentaux de React

## Phase de Montage

La phase de montage correspond au moment où le composant est créé et inséré dans le DOM.  
C'est la première phase du cycle de vie d'un composant React.

### La méthode constructor()

Pour instancier une classe pour en faire un objet, on est obligé de passer par la méthode `constructor()`.  
Le constructor est construit de cette manière : 
```JS
// appel de la méthode constructor qui prends un paramètre props
constructor(props) {
  // appel de la méthode super qui contient le props
  super(props);

  this.state = {
    // l'état initial peut être setté ici
    name: 'toto'
  };

  // possibilité de modifier le state directement dans le constructeur
  this.state.name = 'titi'
}
```
à noter qu'on ne pourra pas utiliser `this.state.[...]` ailleurs pour modifier le state.  
la méthode `setState()` ne pourra pas être appelée dans le constructor.

**Rôle du constructor :**

| Utilisation | Description |
|-------------|-------------|
| Initialiser le state local | Définir `this.state` avec les valeurs initiales |
| Lier les méthodes | Associer `this` aux gestionnaires d'événements |
| Recevoir les props | Accéder aux props passées par le composant parent |

```JS
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
**Liaison des méthodes :**

Dans les composants class, les méthodes ne sont pas liées automatiquement à `this`.  
Il existe deux façons de les lier :

```JS
// Méthode 1 : Liaison dans le constructor
constructor(props) {
  super(props);
  this.handleClick = this.handleClick.bind(this);
}

handleClick() {
  console.log(this.state);
}

// Méthode 2 : Utilisation des arrow functions (recommandée)
handleClick = () => {
  console.log(this.state);
}
```

### La méthode render()

La méthode `render()` va permettre de retourner du JSX.  
Cette méthode ne permet pas de changer le state.  
Si on fait appel à un autre composant enfant dans la méthode `render()`,  
la suite de l'exécution du code de notre composant va devoir attendre la fin de l'exécution du code du composant enfant qui contient lui même :  
constructor, render et componentDidMount. 
```JS
render() {
  return (
    <div>
      <h2>Parent component</h2>
      <ChildComponent />
    </div>
  )
}
```

**Règles importantes pour render() :**

| Règle | Explication |
|-------|-------------|
| Méthode **pure** | Ne doit pas modifier le state du composant |
| Retour obligatoire | Doit retourner un élément React, un tableau, un fragment, un portail, une chaîne, un nombre, un booléen ou `null` |
| Pas d'effets de bord | Ne pas effectuer de requêtes HTTP ou d'interactions avec le navigateur |
| Appelée à chaque mise à jour | Se déclenche à chaque changement de props ou de state |

**Types de retour possibles :**

```JS
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

### La méthode componentDidMount()

La méthode `componentDidMount()` ne sera invoquée qu'une seule fois après que ses enfants auront été montés (chargés dans le DOM).  
Il est possible d'appeler la méthode `setState()` directement dans componentDidMount.  
Cela déclenchera un rendu supplémentaire qui aura lieu avant que le navigateur ne mette à jour l'écran. 

```JS
componentDidMount() {
  console.log('Composant monté !');
}
```

**Cas d'utilisation courants :**

| Utilisation | Exemple |
|-------------|---------|
| Requêtes API | Charger des données depuis un serveur |
| Abonnements | S'abonner à un WebSocket ou un event listener |
| Manipulation du DOM | Accéder à un élément DOM avec des refs |
| Intégration de librairies tierces | Initialiser une librairie comme Chart.js |

**Exemples pratiques :**

```JS
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

// Timer avec nettoyage nécessaire
componentDidMount() {
  this.timerID = setInterval(() => {
    this.setState({ time: new Date() });
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerID); // Nettoyage obligatoire !
}

// Event listener
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
}

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

**Attention avec setState dans componentDidMount :**

```JS
componentDidMount() {
  // ⚠️ Déclenche un re-render immédiat
  this.setState({ loaded: true });
  
  // L'utilisateur ne verra pas l'état intermédiaire
  // mais cela peut impacter les performances
}
```

Dans un fichier complet, voici ce que cela donne :  
`LifeCycle.jsx`
```JS
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
`ChildComponent.jsx`
```JS
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

L'affichage dans la console du navigateur sera le suivant :  
* step [1] - dans le constructor
* step [1] - dans le render
* step [1] - mise à jour du DOM
* ChildComponent - constructor
* ChildComponent - render
* ChildComponent - mise à jour du DOM
* ChildComponent - componentDidMount
* step [1] - dans le componentDidMount

L'ordre d'enchaînement lors de la phase de montage est donc la suivante :
1. constructor parent
2. render parent
    * constructor enfant
    * render enfant
    * componentDidMount enfant
3. componentDidMount parent

## Phase de Mise à jour

La phase de mise à jour se déclenche lorsque le composant reçoit de nouvelles props ou lorsque son state change via `setState()`.  
Durant cette phase, le `constructor` n'est **jamais** rappelé.

### Déclencheurs de mise à jour

| Déclencheur | Description |
|-------------|-------------|
| `setState()` | Modification du state local du composant |
| Nouvelles props | Le composant parent passe de nouvelles valeurs |
| `forceUpdate()` | Force un re-render (bypass `shouldComponentUpdate`) |

### La méthode render() (mise à jour)

Lors de la mise à jour, `render()` est appelé à nouveau pour générer le nouveau JSX.  
Les mêmes règles que lors du montage s'appliquent :
- Méthode pure (pas de modification du state)
- Pas d'effets de bord

```JS
render() {
  console.log(`step [${this.state.step}] - dans le render`);
  return (
    <div>
      <p>Step actuel : {this.state.step}</p>
    </div>
  );
}
```

### La méthode componentDidUpdate()

La méthode `componentDidUpdate()` est appelée immédiatement après que la mise à jour a eu lieu.  
Elle n'est **pas appelée** lors du montage initial.

```JS
componentDidUpdate(prevProps, prevState) {
  console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
  console.log('Previous state: ', prevState);
  console.log('Current state: ', this.state);
}
```

**Paramètres disponibles :**

| Paramètre | Description |
|-----------|-------------|
| `prevProps` | Les props avant la mise à jour |
| `prevState` | Le state avant la mise à jour |
| `snapshot` | Valeur retournée par `getSnapshotBeforeUpdate()` (optionnel) |

**Cas d'utilisation courants :**

| Utilisation | Exemple |
|-------------|---------|
| Requêtes conditionnelles | Charger des données quand une prop change |
| Comparaison d'état | Réagir à un changement spécifique |
| Manipulation du DOM | Mettre à jour le scroll, focus, etc. |
| Intégrations tierces | Synchroniser avec des librairies externes |

**Exemples pratiques :**

```JS
// Requête API conditionnelle
componentDidUpdate(prevProps) {
  // Recharger les données si l'ID utilisateur change
  if (prevProps.userId !== this.props.userId) {
    this.fetchUserData(this.props.userId);
  }
}

// Comparaison d'état pour actions conditionnelles
componentDidUpdate(prevProps, prevState) {
  // Afficher un message quand le score dépasse 100
  if (prevState.score <= 100 && this.state.score > 100) {
    this.showCongratulations();
  }
}

// Scroll automatique vers le bas
componentDidUpdate(prevProps) {
  if (prevProps.messages.length !== this.props.messages.length) {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }
}

// Synchronisation avec localStorage
componentDidUpdate(prevProps, prevState) {
  if (prevState.preferences !== this.state.preferences) {
    localStorage.setItem('preferences', JSON.stringify(this.state.preferences));
  }
}
```

**⚠️ Attention : Éviter les boucles infinies**

Appeler `setState()` dans `componentDidUpdate()` sans condition provoque une boucle infinie :

```JS
// ❌ DANGER : Boucle infinie !
componentDidUpdate() {
  this.setState({ updated: true });
}

// ✅ Bonne pratique : Toujours conditionner setState
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    this.setState({ lastUpdated: new Date() });
  }
}
```

### Ordre d'exécution lors d'une mise à jour

Avec le composant `LifeCycle.jsx` qui contient un `setState()` dans `componentDidMount()` :
```JS
componentDidMount() {
  console.log(`step [${this.state.step}] - dans le componentDidMount`);

  this.setState({ step: 2 }, () => {
    console.log(`step [${this.state.step}] - après le setState du componentDidMount`);
  });
}

componentDidUpdate(prevProps, prevState) {
  console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
  console.log('Previous state: ', prevState);
  console.log('Current state: ', this.state);
}
```

L'affichage dans la console du navigateur sera le suivant :  

**Phase de montage :**
* step [1] - dans le constructor
* step [1] - dans le render
* step [1] - mise à jour du DOM
* ChildComponent - constructor
* ChildComponent - render
* ChildComponent - mise à jour du DOM
* ChildComponent - componentDidMount
* step [1] - dans le componentDidMount

**Phase de mise à jour :**
* step [2] - dans le render
* step [2] - mise à jour du DOM
* ChildComponent - render
* ChildComponent - mise à jour du DOM
* step [2] - dans le componentDidUpdate
* Previous state:  {name: 'LifeCycle', step: 1}
* Current state:  {name: 'LifeCycle', step: 2}
* step [2] - après le setState du componentDidMount

Une fois que les étapes 1 sont passées, on va passer aux étapes 2.  
On peut noter qu'on ne repasser pas par le constructor qui n'est appelé qu'une seule fois lors de la création du composant à sont appel.

### Schéma de la phase de mise à jour

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
    │    shouldComponentUpdate()    │  (optionnel, pas avec forceUpdate)
    │      return true / false      │
    └───────────────────────────────┘
                    │
            true    │    false
                    ▼      ──► (arrêt)
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
    └───────────────────────────────┘
```

### Points clés à retenir

| Point | Explication |
|-------|-------------|
| `constructor` jamais rappelé | Seul le montage initial l'appelle |
| `componentDidUpdate` après le DOM | Le DOM est déjà mis à jour quand cette méthode s'exécute |
| Conditions obligatoires | Toujours conditionner `setState()` dans `componentDidUpdate()` |
| Composants enfants | Ils suivent leur propre cycle (render → update) |
| Callback de setState | Exécuté **après** `componentDidUpdate()` |

## Phase de démontage

La phase de démontage correspond au moment où le composant est retiré du DOM.  
C'est la dernière phase du cycle de vie d'un composant React.

Dans la documentation, il est spécifié que `componentWillUnmount()` est appelée immédiatement avant qu'un composant soit démonté ou détruit.  

### La méthode componentWillUnmount()

Cette méthode permet d'effectuer des nettoyages tels que : 
* invalidation des minuteurs (timers)
* annulation des requêtes réseau
* résiliation d'abonnements (subscriptions)
* suppression des event listeners
* nettoyage des refs

```JS
componentWillUnmount() {
  console.log(`step [${this.state.step}] - dans le componentWillUnmount`);
}
``` 
**⚠️ Règle importante :**

Attention, il ne faut **EN AUCUN CAS** appeler la méthode `setState()` dans `componentWillUnmount()`, car le composant ne sera jamais ré-affiché.  
Une fois l'instance du composant démontée, elle ne sera plus jamais re-montée.  

```JS
// ❌ INTERDIT : Ne jamais faire ceci !
componentWillUnmount() {
  this.setState({ unmounted: true }); // Provoque un warning React
}

// ✅ Correct : Nettoyage uniquement
componentWillUnmount() {
  console.log('Composant démonté');
}
```
**Cas d'utilisation courants :**

| Utilisation | Description |
|-------------|-------------|
| Timers | Annuler `setInterval()` ou `setTimeout()` |
| Event listeners | Retirer les écouteurs ajoutés au DOM |
| Requêtes réseau | Annuler les requêtes en cours (AbortController) |
| Abonnements | Se désabonner de WebSockets, Redux, etc. |
| Librairies tierces | Détruire les instances (charts, maps, etc.) |

**Exemples pratiques :**

```JS
// Nettoyage d'un timer
componentDidMount() {
  this.timerID = setInterval(() => {
    this.setState({ time: new Date() });
  }, 1000);
}

componentWillUnmount() {
  clearInterval(this.timerID);
  console.log('Timer nettoyé');
}

// Nettoyage d'un event listener
componentDidMount() {
  window.addEventListener('resize', this.handleResize);
  window.addEventListener('scroll', this.handleScroll);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.handleResize);
  window.removeEventListener('scroll', this.handleScroll);
  console.log('Event listeners supprimés');
}

// Annulation d'une requête réseau avec AbortController
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

// Nettoyage d'un abonnement WebSocket
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

// Nettoyage d'une librairie tierce (ex: Chart.js)
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

### Exemple complet avec démontage

Composant parent `App.jsx` :
```JS
import { Component } from 'react'
import './App.css'

import LifeCycle from './components/LifeCycle.jsx'

class App extends Component {

  state = {
    display: true,
  }

  toggleDisplay = () => {    
    console.log('bouton cliqué')
    this.setState({ display: !this.state.display })
  }

  render() {
    const showComponent = this.state.display ? (<LifeCycle />) : null;

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

export default App
```


Composant enfant `LifeCycle.jsx` :
```JS
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
    
    // Exemple : démarrer un timer
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

Le fait de cliquer pour ne pas afficher le composant va automatiquement appeler la méthode `componentWillUnmount` et mettre fin au cycle de vie du composant. 

### Ordre d'exécution lors du démontage

L'affichage dans la console du navigateur lors du clic sur le bouton :

**Affichage du composant (montage) :**
* step [1] - dans le constructor
* step [1] - dans le render
* step [1] - dans le componentDidMount

**Masquage du composant (démontage) :**
* bouton cliqué
* step [1] - dans le componentWillUnmount

### Schéma de la phase de démontage

```
    Suppression du composant par le parent
    (ex: rendu conditionnel, changement de route)
                    │
                    ▼
    ┌───────────────────────────────┐
    │    componentWillUnmount()     │
    │                               │
    │  - Nettoyage des timers       │
    │  - Suppression des listeners  │
    │  - Annulation des requêtes    │
    │  - Fermeture des connexions   │
    └───────────────────────────────┘
                    │
                    ▼
          [ Suppression du DOM ]
                    │
                    ▼
         Composant détruit (garbage collected)
```

### Erreurs courantes à éviter

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Oublier de nettoyer les timers | Fuite mémoire, erreurs "Can't perform state update on unmounted component" | Toujours `clearInterval()` / `clearTimeout()` |
| Oublier de retirer les event listeners | Fuite mémoire, comportements inattendus | `removeEventListener()` avec la même référence de fonction |
| Appeler `setState()` après démontage | Warning React, comportement imprévisible | Vérifier si le composant est monté ou annuler les requêtes |
| Ne pas fermer les connexions | Connexions orphelines, fuite de ressources | `socket.close()`, `abort()`, etc. |

**Pattern pour éviter setState sur un composant démonté :**

```JS
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

### Points clés à retenir

| Point | Explication |
|-------|-------------|
| Appelée une seule fois | Juste avant la suppression du DOM |
| Nettoyage obligatoire | Timers, listeners, abonnements, requêtes |
| `setState()` interdit | Le composant ne sera plus jamais affiché |
| Pas de re-montage | Une fois démonté, l'instance est définitivement détruite |
| Ordre avec les enfants | Les enfants sont démontés **avant** le parent |

## Les autres méthodes couramment utilisées du cycle de vie de React :

### La méthode getDerivedStateFromProps

Cette méthode peut-être appelée lors des phases de **montage** et de **mise à jour** du composant.
Elle se lance **avant** la méthode `render()`.

C'est une méthode **statique** qui ne peut pas accéder à `this`.

```JS
static getDerivedStateFromProps(props, state) {
  console.log('getDerivedStateFromProps lancé');
  console.log('Props reçues:', props);
  console.log('State actuel:', state);

  // Doit retourner un objet pour mettre à jour le state
  // ou null pour ne rien mettre à jour
  return null;
}
```
**Paramètres disponibles :**

| Paramètre | Description |
|-----------|-------------|
| `props` | Les props actuelles (ou nouvelles lors d'une mise à jour) |
| `state` | Le state actuel du composant |

**Retour obligatoire :**

| Retour | Effet |
|--------|-------|
| `{ key: value }` | Met à jour le state avec les nouvelles valeurs |
| `null` | Aucune mise à jour du state |

**Exemple complet :**

```JS
class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'Toto',
      previousUserId: null
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps lancé');

    // Synchroniser le state avec les props si l'userId change
    if (props.userId !== state.previousUserId) {
      return {
        previousUserId: props.userId,
        name: props.userName // Mettre à jour le nom depuis les props
      };
    }

    return null; // Pas de changement
  }

  render() {
    return (
      <div>
        <p>Nom: {this.state.name}</p>
        <p>User ID: {this.props.userId}</p>
      </div>
    );
  }
}
```

**⚠️ Cas d'utilisation rares :**

Cette méthode est rarement nécessaire. Elle existe pour les cas où le state dépend des changements de props au fil du temps.

| Situation | Recommandation |
|-----------|----------------|
| State initial basé sur props | Utiliser le `constructor` |
| Recalculer des données quand les props changent | Utiliser `componentDidUpdate` ou `useMemo` |
| State dérivé des props | Utiliser `getDerivedStateFromProps` |

**Déclencheurs de getDerivedStateFromProps :**

La méthode se relance à chaque fois qu'une modification est effectuée :
- Via `componentDidUpdate()`
- Modification d'une prop par le parent
- Modification du state via `setState()`

### La méthode shouldComponentUpdate

Cette méthode est présente lors de la phase de mise à jour mais est rarement utilisée.  
Elle n'existe qu'en tant qu'**optimisation de performance**.  
Elle n'est pas faite pour "empêcher" un refraîchissement qui pourrait causer des bugs et effets de bord.

Cette méthode est appelée **avant** `render()` lors de la réception de nouvelles props ou d'un nouveau state.  
Elle retourne `true` par défaut (le composant se met à jour).  
Si elle retourne `false`, le composant ne sera pas mis à jour et `render()` ne sera pas appelé.

```JS
shouldComponentUpdate(nextProps, nextState) {
  console.log('shouldComponentUpdate lancé');
  console.log('Next props: ', nextProps);
  console.log('Next state: ', nextState);
  console.log('Current state: ', this.state);

  // Exemple : ne met à jour que si le step change
  if (nextState.step !== this.state.step) {
    return true;
  }
  return false;
}
```

**Paramètres disponibles :**

| Paramètre | Description |
|-----------|-------------|
| `nextProps` | Les nouvelles props qui vont être appliquées |
| `nextState` | Le nouveau state qui va être appliqué |

**Valeurs de retour :**

| Retour | Effet |
|--------|-------|
| `true` | Le composant se met à jour (comportement par défaut) |
| `false` | Le composant ne se met pas à jour, `render()` n'est pas appelé |

**Exemple d'utilisation :**

```JS
class OptimizedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      name: 'Test'
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Ne re-render que si count change
    // Ignore les changements de name
    return nextState.count !== this.state.count;
  }

  incrementCount = () => {
    this.setState({ count: this.state.count + 1 });
  }

  changeName = () => {
    this.setState({ name: 'Nouveau nom' }); // Ne déclenchera PAS de re-render
  }

  render() {
    console.log('Render appelé');
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <p>Name: {this.state.name}</p>
        <button onClick={this.incrementCount}>Increment</button>
        <button onClick={this.changeName}>Change Name</button>
      </div>
    );
  }
}
```

**Alternative recommandée : PureComponent**

Plutôt que d'implémenter manuellement `shouldComponentUpdate`, React propose la classe `PureComponent` qui effectue automatiquement une comparaison superficielle (shallow comparison) des props et du state :

```JS
import { PureComponent } from 'react';

class OptimizedComponent extends PureComponent {
  // Pas besoin de shouldComponentUpdate
  // PureComponent compare automatiquement les props et state

  render() {
    return (
      <div>
        <p>Count: {this.props.count}</p>
      </div>
    );
  }
}
```

**Différence entre Component et PureComponent :**

| Classe | Comportement |
|--------|--------------|
| `Component` | Re-render à chaque appel de `setState()`, même si les valeurs sont identiques |
| `PureComponent` | Re-render uniquement si les props ou le state ont changé (comparaison shallow) |

**⚠️ Attention avec les objets et tableaux :**

`PureComponent` effectue une comparaison **superficielle**. Pour les objets ou tableaux imbriqués, il faut s'assurer de créer de nouvelles références lors des modifications :

```JS
// ❌ Mauvaise pratique (même référence, PureComponent ne détecte pas le changement)
this.state.items.push(newItem);
this.setState({ items: this.state.items });

// ✅ Bonne pratique (nouvelle référence)
this.setState({ items: [...this.state.items, newItem] });

// ❌ Mauvaise pratique pour les objets
this.state.user.name = 'Nouveau nom';
this.setState({ user: this.state.user });

// ✅ Bonne pratique pour les objets
this.setState({ user: { ...this.state.user, name: 'Nouveau nom' } });
```
### La méthode getSnapshotBeforeUpdate()

Cette méthode est appelée juste **avant** que les modifications du DOM ne soient appliquées.  
Elle permet de capturer des informations du DOM (comme la position de scroll) avant qu'elles ne changent.

La valeur retournée est passée en paramètre à `componentDidUpdate()`.

```JS
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log('getSnapshotBeforeUpdate lancé');
  console.log('Previous props:', prevProps);
  console.log('Previous state:', prevState);

  // Retourne une valeur qui sera passée à componentDidUpdate
  return null;
}
```

**Paramètres disponibles :**

| Paramètre | Description |
|-----------|-------------|
| `prevProps` | Les props avant la mise à jour |
| `prevState` | Le state avant la mise à jour |

**Exemple pratique : Conserver la position de scroll**

```JS
class ChatMessages extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Si de nouveaux messages sont ajoutés
    if (prevProps.messages.length < this.props.messages.length) {
      const container = this.messagesRef.current;
      // Capturer la position de scroll avant la mise à jour
      return container.scrollHeight - container.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // snapshot contient la valeur retournée par getSnapshotBeforeUpdate
    if (snapshot !== null) {
      const container = this.messagesRef.current;
      // Restaurer la position de scroll
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.messagesRef} style={{ height: '300px', overflow: 'auto' }}>
        {this.props.messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    );
  }
}
```

**⚠️ Règle importante :**

`getSnapshotBeforeUpdate` doit **toujours** être accompagné de `componentDidUpdate`.  
Si vous définissez `getSnapshotBeforeUpdate` sans `componentDidUpdate`, React affichera un warning.

### La méthode forceUpdate()

Cette méthode permet de forcer un re-render du composant, en **bypassant** `shouldComponentUpdate`.

```JS
forceChange = () => {
  this.forceUpdate(() => {
    console.log('Je force le changement');
  });
}
```

**Comportement :**

| Étape | Méthode appelée |
|-------|-----------------|
| 1 | `getDerivedStateFromProps()` (si définie) |
| 2 | `render()` (shouldComponentUpdate est **ignoré**) |
| 3 | `getSnapshotBeforeUpdate()` (si définie) |
| 4 | Mise à jour du DOM |
| 5 | `componentDidUpdate()` |
| 6 | Callback de `forceUpdate()` |

**Exemple d'utilisation :**

```JS
class ForceUpdateExample extends Component {
  externalData = { value: 0 }; // Donnée externe, pas dans le state

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate - NE SERA PAS APPELÉ avec forceUpdate');
    return true;
  }

  updateExternalData = () => {
    this.externalData.value += 1;
    
    // Force le re-render car externalData n'est pas dans le state
    this.forceUpdate(() => {
      console.log('Re-render forcé terminé');
    });
  }

  render() {
    console.log('Render appelé');
    return (
      <div>
        <p>Valeur externe: {this.externalData.value}</p>
        <button onClick={this.updateExternalData}>
          Mettre à jour
        </button>
      </div>
    );
  }
}
```

**⚠️ Utilisation déconseillée :**

| Situation | Recommandation |
|-----------|----------------|
| Données dans le state | Utiliser `setState()` |
| Données calculées | Utiliser `componentDidUpdate` ou `useMemo` |
| Intégration de librairie tierce | `forceUpdate()` peut être acceptable |
| Debug temporaire | Acceptable, mais à supprimer ensuite |

### Schéma complet avec toutes les méthodes

```
                         MONTAGE
                            │
                            ▼
            ┌───────────────────────────────┐
            │        constructor()          │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  getDerivedStateFromProps()   │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │          render()             │
            └───────────────────────────────┘
                            │
                            ▼
                  [ Mise à jour du DOM ]
                            │
                            ▼
            ┌───────────────────────────────┐
            │     componentDidMount()       │
            └───────────────────────────────┘


                       MISE À JOUR
        (setState, nouvelles props, forceUpdate)
                            │
                            ▼
            ┌───────────────────────────────┐
            │  getDerivedStateFromProps()   │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   shouldComponentUpdate()     │ ◄── Ignoré si forceUpdate()
            │      return true / false      │
            └───────────────────────────────┘
                            │
                    true    │    false
                            ▼      ──► (arrêt)
            ┌───────────────────────────────┐
            │          render()             │
            └───────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  getSnapshotBeforeUpdate()    │
            └───────────────────────────────┘
                            │
                            ▼
                  [ Mise à jour du DOM ]
                            │
                            ▼
            ┌───────────────────────────────┐
            │    componentDidUpdate()       │
            │   (reçoit snapshot en param)  │
            └───────────────────────────────┘


                        DÉMONTAGE
                            │
                            ▼
            ┌───────────────────────────────┐
            │   componentWillUnmount()      │
            └───────────────────────────────┘
                            │
                            ▼
                  [ Suppression du DOM ]
```

### Tableau récapitulatif de toutes les méthodes

| Méthode | Phase | Accès à `this` | `setState()` autorisé | Utilisation |
|---------|-------|----------------|----------------------|-------------|
| `constructor()` | Montage | Oui | Non (modification directe) | Initialisation du state |
| `getDerivedStateFromProps()` | Montage + Mise à jour | Non (statique) | Via retour | Synchroniser state avec props |
| `shouldComponentUpdate()` | Mise à jour | Oui | Non | Optimisation performance |
| `render()` | Montage + Mise à jour | Oui | Non | Générer le JSX |
| `getSnapshotBeforeUpdate()` | Mise à jour | Oui | Non | Capturer info DOM |
| `componentDidMount()` | Montage | Oui | Oui | Effets de bord, requêtes API |
| `componentDidUpdate()` | Mise à jour | Oui | Oui (conditionné) | Réagir aux changements |
| `componentWillUnmount()` | Démontage | Oui | Non | Nettoyage |
| `forceUpdate()` | Mise à jour | Oui | - | Forcer re-render |

## Résumé

### Les 3 phases du cycle de vie

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    MONTAGE      │ ──► │  MISE À JOUR    │ ──► │   DÉMONTAGE     │
│   (création)    │     │ (modification)  │     │  (destruction)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Phase de montage

| Méthode | Rôle | `setState()` autorisé ? | 
|---------|------|-------------------------|
| `constructor()` | Initialise le state | Non (modification directe seulement) |
| `getDerivedStateFromProps()` | Synchronise state avec props | Via retour uniquement |
| `render()` | Retourne le JSX | Non |
| `componentDidMount()` | Exécuté après insertion dans le DOM | Oui |

**Ordre d'exécution avec un composant enfant :**  
1. `constructor` parent
2. `render` parent
    * `constructor` enfant
    * `render` enfant
    * `componentDidMount` enfant
3. `componentDidMount` parent

### Phase de mise à jour

| Méthode | Rôle | `setState()` autorisé ? |
|---------|------|-------------------------|
| `getDerivedStateFromProps()` | Synchronise state avec props | Via retour uniquement |
| `shouldComponentUpdate()` | Détermine si mise à jour nécessaire | Non |
| `render()` | Re-génère le JSX | Non |
| `getSnapshotBeforeUpdate()` | Capture info DOM avant modification | Non |
| `componentDidUpdate(prevProps, prevState, snapshot)` | Réagit aux changements | Oui (conditionné) |

**Déclencheurs de mise à jour :**
- `setState()` : modification du state local
- Nouvelles props : le parent passe de nouvelles valeurs
- `forceUpdate()` : force un re-render (bypass `shouldComponentUpdate`)

Le `constructor` n'est **jamais** rappelé lors d'une mise à jour.

### Phase de démontage

| Méthode | Rôle | `setState()` autorisé ? | 
|---------|------|-------------------------|
| `componentWillUnmount()` | Nettoyage (timers, abonnements, requêtes) | **Non** |

**Nettoyages obligatoires :**
- `clearInterval()` / `clearTimeout()` pour les timers
- `removeEventListener()` pour les écouteurs
- `abort()` pour les requêtes réseau
- `close()` pour les WebSockets

### Méthodes supplémentaires

| Méthode | Phase | Utilité | Accès à `this` |
|---------|-------|---------|----------------|
| `getDerivedStateFromProps()` | Montage + Mise à jour | Synchroniser le state avec les props | Non (statique) |
| `shouldComponentUpdate()` | Mise à jour | Optimisation des performances | Oui |
| `getSnapshotBeforeUpdate()` | Mise à jour | Capturer info DOM (scroll, etc.) | Oui |
| `forceUpdate()` | Mise à jour | Force le re-render | Oui |

### Alternative : PureComponent

| Classe | Comportement |
|--------|--------------|
| `Component` | Re-render à chaque `setState()` |
| `PureComponent` | Re-render seulement si props/state changent (comparaison shallow) |

### Équivalent avec les Hooks (React moderne)

| Méthode classe | Hook équivalent |
|----------------|-----------------|
| `constructor` | `useState()` |
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [dependencies])` | 
| `componentWillUnmount` | `useEffect(() => { return () => {} }, [])` |
| `shouldComponentUpdate` | `React.memo()` |
| `getDerivedStateFromProps` | `useState` + `useEffect` |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Initialiser le state dans `constructor` | Copier les props dans le state |
| Nettoyer dans `componentWillUnmount` | Appeler `setState()` dans `componentWillUnmount` |
| Conditionner `setState()` dans `componentDidUpdate` | `setState()` sans condition dans `componentDidUpdate` |
| Utiliser les arrow functions pour les méthodes | Oublier de bind `this` |
| Créer de nouvelles références pour objets/tableaux | Muter directement les objets du state |