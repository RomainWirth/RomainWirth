# Le Cycle de vie d'un composant React

## Table des matières

- [Introduction](#introduction)
  - [Les 3 phases principales](#les-3-phases-principales)
  - [Méthodes par phase](#méthodes-par-phase)
  - [Note sur React moderne](#note-sur-react-moderne)
  - [Ressources](#ressources)
- [Table des matières du cours](#table-des-matières-du-cours)
- [Résumé](#résumé)
  - [Les 3 phases du cycle de vie](#les-3-phases-du-cycle-de-vie)
  - [Phase de montage](#phase-de-montage)
  - [Phase de mise à jour](#phase-de-mise-à-jour)
  - [Phase de démontage](#phase-de-démontage)
  - [Méthodes supplémentaires](#méthodes-supplémentaires)
  - [Alternative : PureComponent](#alternative--purecomponent)
  - [Équivalent avec les Hooks](#équivalent-avec-les-hooks-react-moderne)
  - [Bonnes pratiques](#bonnes-pratiques)

---

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

### Ressources

- [Documentation officielle React (legacy)](https://fr.legacy.reactjs.org/docs/react-component.html)
- [Diagramme interactif du cycle de vie](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

---

## Table des matières du cours

| # | Section | Fichier | Contenu |
|---|---------|---------|---------|
| 1 | [Phase de Montage](./01_MONTAGE.md) | `01_MONTAGE.md` | `constructor()`, `render()`, `componentDidMount()` |
| 2 | [Phase de Mise à jour](./02_MISE_A_JOUR.md) | `02_MISE_A_JOUR.md` | `render()`, `componentDidUpdate()`, ordre d'exécution |
| 3 | [Phase de Démontage](./03_DEMONTAGE.md) | `03_DEMONTAGE.md` | `componentWillUnmount()`, nettoyage |
| 4 | [Autres méthodes](./04_AUTRES_METHODES.md) | `04_AUTRES_METHODES.md` | `getDerivedStateFromProps()`, `shouldComponentUpdate()`, `getSnapshotBeforeUpdate()`, `forceUpdate()` |

---

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

> ⚠️ Le `constructor` n'est **jamais** rappelé lors d'une mise à jour.

### Phase de démontage

| Méthode | Rôle | `setState()` autorisé ? |
|---------|------|-------------------------|
| `componentWillUnmount()` | Nettoyage (timers, abonnements, requêtes) | **Non** |

**Nettoyages obligatoires :**
- `clearInterval()` / `clearTimeout()` pour les timers
- `removeEventListener()` pour les écouteurs d'événements
- `abort()` pour les requêtes réseau
- `close()` pour les WebSockets

### Méthodes supplémentaires

| Méthode | Phase | Utilité | Accès à `this` |
|---------|-------|---------|----------------|
| `getDerivedStateFromProps()` | Montage + Mise à jour | Synchroniser le state avec les props | Non (statique) |
| `shouldComponentUpdate()` | Mise à jour | Optimisation des performances | Oui |
| `getSnapshotBeforeUpdate()` | Mise à jour | Capturer info DOM (scroll, etc.) | Oui |
| `forceUpdate()` | Mise à jour | Forcer le re-render | Oui |

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

### Schéma complet

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

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Initialiser le state dans `constructor` | Copier les props dans le state |
| Nettoyer dans `componentWillUnmount` | Appeler `setState()` dans `componentWillUnmount` |
| Conditionner `setState()` dans `componentDidUpdate` | `setState()` sans condition dans `componentDidUpdate` |
| Utiliser les arrow functions pour les méthodes | Oublier de bind `this` |
| Créer de nouvelles références pour objets/tableaux | Muter directement les objets du state |
| Préférer les composants fonction + Hooks (React moderne) | Créer de nouvelles classes sans raison |