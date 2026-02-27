# Cours React - Table des matières

## Structure du cours

```
COURS/
├── README.md                          ← Vous êtes ici
│
├── INTRODUCTION/
│   ├── 01_ENVIRONNEMENT.md
│   ├── 02_COMPOSANTS.md
│   ├── 03_CLASSES.md
│   ├── 04_CDN.md
│   └── 05_CONFIGURATION.md
│
└── CYCLE_DE_VIE/
    ├── 00_INTRODUCTION.md
    ├── 01_MONTAGE.md
    ├── 02_MISE_A_JOUR.md
    ├── 03_DEMONTAGE.md
    └── 04_AUTRES_METHODES.md
```

---

## I. Introduction

| # | Fichier | Contenu |
|---|---------|---------|
| 01 | [L'environnement React](./INTRODUCTION/01_ENVIRONNEMENT.md) | JSX, Virtual DOM, différences avec le DOM réel, outils de développement |
| 02 | [Les composants](./INTRODUCTION/02_COMPOSANTS.md) | Principe de composition, types de composants, props, state |
| 03 | [Les classes](./INTRODUCTION/03_CLASSES.md) | Structure d'une classe, binding, setState(), comparaison classe vs fonction |
| 04 | [React via CDN](./INTRODUCTION/04_CDN.md) | Scripts CDN, structure de base, règles JSX, hooks via CDN |
| 05 | [Configuration d'un projet](./INTRODUCTION/05_CONFIGURATION.md) | Configuration manuelle, CRA, Vite, différences CRA vs Vite |

### Résumé

```
INTRODUCTION
│
├── 01 - Environnement
│         → JSX, Virtual DOM, outils de développement
│
├── 02 - Composants
│         → Types, props, state, flux unidirectionnel
│
├── 03 - Classes
│         → Structure, binding, setState(), cycle de vie
│
├── 04 - CDN
│         → Scripts, JSX, hooks, fichiers externes
│
└── 05 - Configuration
          → Webpack/Babel, CRA (déprécié), Vite (recommandé)
```

---

## III. Le cycle de vie d'un composant

| # | Fichier | Contenu |
|---|---------|---------|
| 00 | [Introduction](./CYCLE_DE_VIE/00_INTRODUCTION.md) | Les 3 phases, tableau des méthodes, équivalents Hooks, schéma complet |
| 01 | [Phase de Montage](./CYCLE_DE_VIE/01_MONTAGE.md) | `constructor()`, `render()`, `componentDidMount()` |
| 02 | [Phase de Mise à jour](./CYCLE_DE_VIE/02_MISE_A_JOUR.md) | `render()`, `componentDidUpdate()`, boucles infinies |
| 03 | [Phase de Démontage](./CYCLE_DE_VIE/03_DEMONTAGE.md) | `componentWillUnmount()`, nettoyage des effets de bord |
| 04 | [Autres méthodes](./CYCLE_DE_VIE/04_AUTRES_METHODES.md) | `getDerivedStateFromProps()`, `shouldComponentUpdate()`, `getSnapshotBeforeUpdate()`, `forceUpdate()` |

### Résumé

```
CYCLE DE VIE
│
├── 00 - Introduction
│         → Vue d'ensemble des 3 phases et des méthodes
│
├── 01 - Montage
│         → constructor → render → componentDidMount
│
├── 02 - Mise à jour
│         → render → componentDidUpdate
│
├── 03 - Démontage
│         → componentWillUnmount → nettoyage
│
└── 04 - Autres méthodes
          → getDerivedStateFromProps, shouldComponentUpdate
            getSnapshotBeforeUpdate, forceUpdate
```

---

## Schéma global du cycle de vie

```
┌───────────────────────────────────────────────────────────────────────┐
│              CYCLE DE VIE D'UN COMPOSANT                              │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   MONTAGE                MISE À JOUR             DÉMONTAGE            │
│   ───────                ──────────              ─────────            │
│                                                                       │
│   constructor()          setState()                                   │
│        │                 nouvelles props                              │
│        ▼                 forceUpdate()                                │
│   getDerivedState...()        │                                       │
│        │                      ▼                                       │
│        ▼                 getDerivedState...()                         │
│   render()                    │                                       │
│        │                      ▼                                       │
│        ▼                 shouldComponentUpdate()                      │
│   [DOM mis à jour]            │                                       │
│        │                      ▼                                       │
│        ▼                 render()                                     │
│   componentDidMount()         │                                       │
│                               ▼                                       │
│                          getSnapshotBefore...()                       │
│                               │                                       │
│                               ▼                                       │
│                          [DOM mis à jour]    componentWillUnmount()   │
│                               │                     │                 │
│                               ▼                     │                 │
│                          componentDidUpdate()       ▼                 │
│                                                [DOM supprimé]         │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Équivalents Hooks

| Méthode classe | Hook équivalent |
|----------------|-----------------|
| `constructor` | `useState()` |
| `componentDidMount` | `useEffect(() => {}, [])` |
| `componentDidUpdate` | `useEffect(() => {}, [deps])` |
| `componentWillUnmount` | `useEffect(() => { return () => {} }, [])` |
| `shouldComponentUpdate` | `React.memo()` |
| `getDerivedStateFromProps` | `useState` + `useEffect` |