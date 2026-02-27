# Les autres méthodes du cycle de vie

## Table des matières

- [Introduction](#introduction)
- [La méthode getDerivedStateFromProps()](#la-méthode-getderivedstatefromprops)
  - [Paramètres disponibles](#paramètres-disponibles)
  - [Retour obligatoire](#retour-obligatoire)
  - [Exemple complet](#exemple-complet)
  - [Cas d'utilisation](#cas-dutilisation)
  - [Déclencheurs](#déclencheurs)
- [La méthode shouldComponentUpdate()](#la-méthode-shouldcomponentupdate)
  - [Paramètres disponibles](#paramètres-disponibles-1)
  - [Valeurs de retour](#valeurs-de-retour)
  - [Exemple d'utilisation](#exemple-dutilisation)
  - [Alternative recommandée : PureComponent](#alternative-recommandée--purecomponent)
- [La méthode getSnapshotBeforeUpdate()](#la-méthode-getsnapshotbeforeupdate)
  - [Paramètres disponibles](#paramètres-disponibles-2)
  - [Exemple pratique](#exemple-pratique)
- [La méthode forceUpdate()](#la-méthode-forceupdate)
  - [Comportement](#comportement)
  - [Exemple d'utilisation](#exemple-dutilisation-1)
- [Schéma complet avec toutes les méthodes](#schéma-complet-avec-toutes-les-méthodes)
- [Tableau récapitulatif](#tableau-récapitulatif)
- [Récapitulatif](#récapitulatif)
  - [Points à retenir](#points-à-retenir)
  - [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

En dehors des méthodes principales vues dans les fichiers précédents (`constructor`, `render`, `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`), React propose des méthodes supplémentaires pour des cas d'usage plus spécifiques.

```
┌─────────────────────────────────────────────────────────┐
│            AUTRES MÉTHODES DU CYCLE DE VIE              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  getDerivedStateFromProps()                             │
│  → Phase : Montage + Mise à jour                        │
│  → Avant render()                                       │
│  → Synchroniser le state avec les props                 │
│                                                         │
│  shouldComponentUpdate()                                │
│  → Phase : Mise à jour uniquement                       │
│  → Avant render()                                       │
│  → Optimisation des performances                        │
│                                                         │
│  getSnapshotBeforeUpdate()                              │
│  → Phase : Mise à jour uniquement                       │
│  → Avant la mise à jour du DOM                          │
│  → Capturer des infos du DOM                            │
│                                                         │
│  forceUpdate()                                          │
│  → Phase : Mise à jour uniquement                       │
│  → Force un re-render                                   │
│  → Bypass shouldComponentUpdate                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Méthode | Phase | Fréquence d'utilisation |
|---------|-------|------------------------|
| `getDerivedStateFromProps()` | Montage + Mise à jour | Rare |
| `shouldComponentUpdate()` | Mise à jour | Peu fréquente |
| `getSnapshotBeforeUpdate()` | Mise à jour | Très rare |
| `forceUpdate()` | Mise à jour | Déconseillée |

---

## La méthode getDerivedStateFromProps()

Cette méthode peut être appelée lors des phases de **montage** et de **mise à jour** du composant.  
Elle se lance **avant** la méthode `render()`.

C'est une méthode **statique** qui ne peut pas accéder à `this`.

```jsx
static getDerivedStateFromProps(props, state) {
  console.log('getDerivedStateFromProps lancé');
  console.log('Props reçues:', props);
  console.log('State actuel:', state);

  // Doit retourner un objet pour mettre à jour le state
  // ou null pour ne rien mettre à jour
  return null;
}
```

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| `props` | Les props actuelles (ou nouvelles lors d'une mise à jour) |
| `state` | Le state actuel du composant |

### Retour obligatoire

| Retour | Effet |
|--------|-------|
| `{ key: value }` | Met à jour le state avec les nouvelles valeurs |
| `null` | Aucune mise à jour du state |

### Exemple complet

```jsx
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

### Cas d'utilisation

Cette méthode est **rarement nécessaire**. Elle existe pour les cas où le state dépend des changements de props au fil du temps.

| Situation | Recommandation |
|-----------|----------------|
| State initial basé sur props | Utiliser le `constructor` |
| Recalculer des données quand les props changent | Utiliser `componentDidUpdate` ou `useMemo` |
| State réellement dérivé des props | Utiliser `getDerivedStateFromProps` |

### Déclencheurs

La méthode se relance à chaque fois qu'une modification est effectuée :

| Déclencheur | Description |
|-------------|-------------|
| `setState()` | Modification du state via `componentDidUpdate()` |
| Nouvelles props | Modification d'une prop par le parent |
| Re-render du parent | Le parent se re-rend, même si les props n'ont pas changé |

> ⚠️ **Attention :**  
> `getDerivedStateFromProps` est appelée **à chaque render**, qu'il y ait eu un changement de props ou non.  
> C'est pourquoi il faut toujours comparer avec une valeur du state (comme `previousUserId`) avant de retourner une mise à jour.

---

## La méthode shouldComponentUpdate()

Cette méthode est présente lors de la phase de mise à jour mais est **rarement utilisée**.  
Elle n'existe qu'en tant qu'**optimisation de performance**.  
Elle n'est pas faite pour "empêcher" un rafraîchissement qui pourrait causer des bugs et effets de bord.

Cette méthode est appelée **avant** `render()` lors de la réception de nouvelles props ou d'un nouveau state.  
Elle retourne `true` par défaut (le composant se met à jour).  
Si elle retourne `false`, le composant ne sera pas mis à jour et `render()` ne sera pas appelé.

```jsx
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

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| `nextProps` | Les nouvelles props qui vont être appliquées |
| `nextState` | Le nouveau state qui va être appliqué |

### Valeurs de retour

| Retour | Effet |
|--------|-------|
| `true` | Le composant se met à jour (comportement par défaut) |
| `false` | Le composant ne se met pas à jour, `render()` n'est pas appelé |

### Exemple d'utilisation

```jsx
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
  };

  changeName = () => {
    // Ne déclenchera PAS de re-render
    this.setState({ name: 'Nouveau nom' });
  };

  render() {
    console.log('Render appelé');
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <p>Name: {this.state.name}</p>
        <button onClick={this.incrementCount}>Incrémenter</button>
        <button onClick={this.changeName}>Changer le nom</button>
      </div>
    );
  }
}
```

### Alternative recommandée : PureComponent

Plutôt que d'implémenter manuellement `shouldComponentUpdate`, React propose la classe `PureComponent` qui effectue automatiquement une **comparaison superficielle** (shallow comparison) des props et du state :

```jsx
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

`PureComponent` effectue une comparaison **superficielle**. Pour les objets ou tableaux imbriqués, il faut créer de nouvelles références lors des modifications :

```jsx
// ❌ Même référence → PureComponent ne détecte pas le changement
this.state.items.push(newItem);
this.setState({ items: this.state.items });

// ✅ Nouvelle référence → PureComponent détecte le changement
this.setState({ items: [...this.state.items, newItem] });

// ❌ Même référence pour les objets
this.state.user.name = 'Nouveau nom';
this.setState({ user: this.state.user });

// ✅ Nouvelle référence pour les objets
this.setState({ user: { ...this.state.user, name: 'Nouveau nom' } });
```

---

## La méthode getSnapshotBeforeUpdate()

Cette méthode est appelée juste **avant** que les modifications du DOM ne soient appliquées.  
Elle permet de **capturer des informations du DOM** (comme la position de scroll) avant qu'elles ne changent.

La valeur retournée est passée en troisième paramètre à `componentDidUpdate()`.

```jsx
getSnapshotBeforeUpdate(prevProps, prevState) {
  console.log('getSnapshotBeforeUpdate lancé');
  console.log('Previous props:', prevProps);
  console.log('Previous state:', prevState);

  // Retourne une valeur qui sera passée à componentDidUpdate
  return null;
}
```

### Paramètres disponibles

| Paramètre | Description |
|-----------|-------------|
| `prevProps` | Les props avant la mise à jour |
| `prevState` | Le state avant la mise à jour |

### Exemple pratique

**Conserver la position de scroll lors d'un ajout de messages :**

```jsx
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
      // Restaurer la position de scroll après la mise à jour
      container.scrollTop = container.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div
        ref={this.messagesRef}
        style={{ height: '300px', overflow: 'auto' }}
      >
        {this.props.messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    );
  }
}
```

> ⚠️ **Règle importante :**  
> `getSnapshotBeforeUpdate` doit **toujours** être accompagné de `componentDidUpdate`.  
> Si vous définissez `getSnapshotBeforeUpdate` sans `componentDidUpdate`, React affichera un warning.

---

## La méthode forceUpdate()

Cette méthode permet de forcer un re-render du composant, en **bypassant** `shouldComponentUpdate`.

```jsx
forceChange = () => {
  this.forceUpdate(() => {
    console.log('Re-render forcé terminé');
  });
};
```

### Comportement

| Étape | Méthode appelée |
|-------|-----------------|
| 1 | `getDerivedStateFromProps()` (si définie) |
| 2 | `render()` (`shouldComponentUpdate` est **ignoré**) |
| 3 | `getSnapshotBeforeUpdate()` (si définie) |
| 4 | Mise à jour du DOM |
| 5 | `componentDidUpdate()` |
| 6 | Callback de `forceUpdate()` |

### Exemple d'utilisation

```jsx
class ForceUpdateExample extends Component {
  // Donnée externe, pas dans le state
  externalData = { value: 0 };

  shouldComponentUpdate() {
    // NE SERA PAS APPELÉ avec forceUpdate
    console.log('shouldComponentUpdate ignoré');
    return true;
  }

  updateExternalData = () => {
    this.externalData.value += 1;

    // Force le re-render car externalData n'est pas dans le state
    this.forceUpdate(() => {
      console.log('Re-render forcé terminé');
    });
  };

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

---

## Schéma complet avec toutes les méthodes

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
            │  (prevProps, prevState,       │
            │   snapshot)                   │
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

---

## Tableau récapitulatif

| Méthode | Phase | Accès à `this` | `setState()` autorisé | Utilisation |
|---------|-------|----------------|----------------------|-------------|
| `constructor()` | Montage | Oui | Non (modification directe) | Initialisation du state |
| `getDerivedStateFromProps()` | Montage + Mise à jour | Non (statique) | Via retour uniquement | Synchroniser state avec props |
| `shouldComponentUpdate()` | Mise à jour | Oui | Non | Optimisation performance |
| `render()` | Montage + Mise à jour | Oui | Non | Générer le JSX |
| `getSnapshotBeforeUpdate()` | Mise à jour | Oui | Non | Capturer info DOM |
| `componentDidMount()` | Montage | Oui | Oui | Effets de bord, requêtes API |
| `componentDidUpdate()` | Mise à jour | Oui | Oui (conditionné) | Réagir aux changements |
| `componentWillUnmount()` | Démontage | Oui | Non | Nettoyage |
| `forceUpdate()` | Mise à jour | Oui | - | Forcer re-render (déconseillé) |

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│           AUTRES MÉTHODES DU CYCLE DE VIE               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  getDerivedStateFromProps()                             │
│  ──────────────────────────                             │
│  → Statique (pas d'accès à this)                        │
│  → Avant chaque render()                                │
│  → Retourne un objet ou null                            │
│  → Rarement nécessaire                                  │
│                                                         │
│  shouldComponentUpdate()                                │
│  ────────────────────────                               │
│  → Avant render() (mise à jour uniquement)              │
│  → Retourne true (défaut) ou false                      │
│  → Optimisation uniquement                              │
│  → Préférer PureComponent                               │
│                                                         │
│  getSnapshotBeforeUpdate()                              │
│  ─────────────────────────                              │
│  → Avant la mise à jour du DOM                          │
│  → Toujours avec componentDidUpdate                     │
│  → Cas d'usage : position de scroll                     │
│                                                         │
│  forceUpdate()                                          │
│  ─────────────                                          │
│  → Bypass shouldComponentUpdate                         │
│  → Déconseillé (préférer setState)                      │
│  → Acceptable pour les libs tierces                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Point | Explication |
|-------|-------------|
| `getDerivedStateFromProps` est statique | Pas d'accès à `this`, appelée avant chaque `render()` |
| `shouldComponentUpdate` = optimisation | Ne pas l'utiliser pour bloquer des mises à jour logiques |
| `PureComponent` > `shouldComponentUpdate` | Comparaison shallow automatique, moins de code |
| `getSnapshotBeforeUpdate` + `componentDidUpdate` | Toujours utilisées ensemble |
| `forceUpdate` déconseillé | Signe que les données devraient être dans le state |
| Nouvelles références obligatoires | Pour `PureComponent`, toujours créer de nouveaux objets/tableaux |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser `PureComponent` plutôt que `shouldComponentUpdate` manuel | Implémenter `shouldComponentUpdate` sans raison de performance |
| Retourner `null` dans `getDerivedStateFromProps` si aucun changement | Retourner un objet systématiquement (force une mise à jour) |
| Toujours associer `getSnapshotBeforeUpdate` avec `componentDidUpdate` | Définir `getSnapshotBeforeUpdate` sans `componentDidUpdate` |
| Utiliser `setState()` plutôt que `forceUpdate()` | Stocker des données hors du state et utiliser `forceUpdate()` |
| Créer de nouvelles références pour objets/tableaux | Muter directement les objets du state avec `PureComponent` |
| Comparer avec `previousId` dans `getDerivedStateFromProps` | Mettre à jour le state sans vérifier si les props ont changé |