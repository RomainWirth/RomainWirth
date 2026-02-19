# Utiliser React via les liens CDN

## Table des matières

- [Introduction](#introduction)
- [Scripts CDN nécessaires](#scripts-cdn-nécessaires)
- [Structure de base](#structure-de-base)
- [Exemple avec un composant Classe](#exemple-avec-un-composant-classe)
- [Exemple avec un composant Fonction](#exemple-avec-un-composant-fonction)
- [Règles importantes du JSX](#règles-importantes-du-jsx)
- [Externaliser le code JavaScript](#externaliser-le-code-javascript)
- [Différences avec les versions de React](#différences-avec-les-versions-de-react)
- [Accès aux Hooks via CDN](#accès-aux-hooks-via-cdn)
- [Récapitulatif](#récapitulatif)
- [Points à retenir](#points-à-retenir)
- [Bonnes pratiques](#bonnes-pratiques)

---

## Introduction

Il est possible d'utiliser React sans outils de build (Vite, Webpack) en intégrant directement les scripts via des liens CDN.

**Cas d'usage :**

| ✅ Recommandé | ❌ À éviter |
|--------------|------------|
| Apprentissage et tutoriels | Applications en production |
| Prototypage rapide | Projets avec beaucoup de composants |
| Démonstrations / CodePen | Projets nécessitant des imports/modules |
| Intégration dans une page HTML existante | Projets avec routing complexe |

**⚠️ Limitations :**

| Limitation | Description |
|------------|-------------|
| **Pas de JSX natif** | Nécessite Babel pour compiler le JSX |
| **Pas de modules** | Impossible d'utiliser `import`/`export` |
| **Performance** | Compilation côté client (plus lent) |
| **Pas recommandé en production** | Utiliser Vite ou un bundler pour les vrais projets |

---

## Scripts CDN nécessaires

Les scripts sont disponibles sur [legacy.reactjs.org](https://fr.legacy.reactjs.org/docs/cdn-links.html).

| Script | Rôle |
|--------|------|
| `react.production.min.js` | Bibliothèque React (création de composants) |
| `react-dom.production.min.js` | ReactDOM (manipulation du DOM) |
| `babel.min.js` | Compilateur JSX → JavaScript |

```
┌─────────────────────────────────────────────────────────┐
│                  SCRIPTS CDN                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   react.js          → Création des composants           │
│        +                                                │
│   react-dom.js      → Rendu dans le DOM                 │
│        +                                                │
│   babel.js          → Compilation JSX → JS              │
│        │                                                │
│        ▼                                                │
│   <script type="text/babel">                            │
│     // Votre code React ici                             │
│   </script>                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Structure de base

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 1. React -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <!-- 2. ReactDOM -->
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- 3. Babel pour compiler le JSX -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <title>React CDN</title>
</head>

<body>
  <!-- Point de montage React -->
  <div id="root"></div>

  <!-- type="text/babel" obligatoire pour que Babel compile le JSX -->
  <script type="text/babel">
    // Votre code React ici
  </script>
</body>

</html>
```

> **À noter :**  
> - Les scripts doivent être chargés **dans l'ordre** : React → ReactDOM → Babel.  
> - L'attribut `type="text/babel"` est **obligatoire** sur la balise script contenant du JSX.  
> - L'attribut `crossorigin` permet la gestion des erreurs entre origines différentes.

---

## Exemple avec un composant Classe

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

      decrement = () => {
        this.setState({ count: this.state.count - 1 });
      };

      render() {
        return (
          <div>
            <h1>Compteur : {this.state.count}</h1>
            <button onClick={this.increment}>+1</button>
            <button onClick={this.decrement}>-1</button>
          </div>
        );
      }
    }

    // Montage du composant dans le DOM (React 18)
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  </script>
</body>

</html>
```

> **Différence avec un projet Vite :**  
> - On utilise `React.Component` au lieu de `Component` (pas d'import possible).  
> - Le montage se fait directement dans le script.

---

## Exemple avec un composant Fonction

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
    // Extraction des Hooks depuis l'objet React
    const { useState } = React;

    const App = () => {
      const [count, setCount] = useState(0);

      return (
        <div>
          <h1>Compteur : {count}</h1>
          <button onClick={() => setCount(count + 1)}>+1</button>
          <button onClick={() => setCount(count - 1)}>-1</button>
          <button onClick={() => setCount(0)}>Reset</button>
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

---

## Règles importantes du JSX

### 1. Un seul élément parent

```jsx
// ❌ Plusieurs éléments racines → Erreur
return (
  <h1>Titre</h1>
  <p>Paragraphe</p>
);

// ✅ Un seul élément parent (div)
return (
  <div>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </div>
);

// ✅ Fragment (sans div inutile dans le DOM)
return (
  <>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </>
);
```

### 2. Attributs spécifiques au JSX

| HTML | JSX | Raison |
|------|-----|--------|
| `class` | `className` | `class` est un mot réservé en JavaScript |
| `for` | `htmlFor` | `for` est un mot réservé en JavaScript |
| `tabindex` | `tabIndex` | camelCase pour tous les attributs |
| `onclick` | `onClick` | camelCase pour les événements |
| `style="color: red"` | `style={{ color: 'red' }}` | Objet JavaScript pour les styles inline |

```jsx
// ❌ HTML classique
<label for="email" class="label" tabindex="0">Email</label>

// ✅ JSX
<label htmlFor="email" className="label" tabIndex={0}>Email</label>
```

### 3. Expressions JavaScript entre accolades

```jsx
const name = "Alice";
const isAdmin = true;
const items = ["Pomme", "Banane", "Cerise"];

return (
  <div>
    {/* Variable */}
    <h1>Bonjour {name}</h1>

    {/* Expression */}
    <p>2 + 2 = {2 + 2}</p>

    {/* Condition ternaire */}
    <p>{isAdmin ? "Administrateur" : "Utilisateur"}</p>

    {/* Affichage conditionnel avec && */}
    {isAdmin && <span>Accès admin activé</span>}

    {/* Boucle avec map */}
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);
```

### 4. Balises auto-fermantes

```jsx
// ❌ HTML classique
<img src="image.jpg">
<input type="text">
<br>

// ✅ JSX : toutes les balises doivent être fermées
<img src="image.jpg" />
<input type="text" />
<br />
```

---

## Externaliser le code JavaScript

Pour une meilleure organisation, on peut séparer le code React dans un fichier externe.

**`index.html` :**

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

  <!-- Fichier externe : type="text/babel" obligatoire -->
  <script src="./app.js" type="text/babel"></script>
</body>

</html>
```

**`app.js` :**

```jsx
const { useState, useEffect } = React;

// Composant enfant
const Counter = ({ initialValue = 0, label = "Compteur" }) => {
  const [count, setCount] = useState(initialValue);

  useEffect(() => {
    document.title = `${label} : ${count}`;
  }, [count]);

  return (
    <div>
      <h2>{label} : {count}</h2>
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
      <Counter initialValue={0} label="Premier compteur" />
      <Counter initialValue={10} label="Second compteur" />
    </div>
  );
};

// Montage
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

> **À noter :**  
> - `type="text/babel"` est obligatoire même sur les fichiers externes.  
> - Il n'est **pas possible** d'utiliser `import`/`export` entre fichiers via CDN.  
> - Pour plusieurs fichiers, charger chaque script séparément dans l'ordre.

**Plusieurs fichiers :**

```html
<!-- Composants chargés dans l'ordre -->
<script src="./components/Counter.js" type="text/babel"></script>
<script src="./components/Header.js" type="text/babel"></script>
<script src="./app.js" type="text/babel"></script>
```

---

## Différences avec les versions de React

### Montage du composant

| Version | Méthode | Syntaxe |
|---------|---------|---------|
| **React 18+** | `ReactDOM.createRoot()` | ✅ Actuelle |
| **React 17 et -** | `ReactDOM.render()` | ⚠️ Dépréciée |

```jsx
// ✅ React 18+ (méthode actuelle)
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

// ⚠️ React 17 et antérieur (dépréciée)
ReactDOM.render(<App />, document.getElementById('root'));
```

### Accès à React et ReactDOM

```jsx
// React est accessible via l'objet global React
class App extends React.Component { ... }      // Classe
const App = () => { ... }                      // Fonction

// ReactDOM est accessible via l'objet global ReactDOM
ReactDOM.createRoot(container).render(<App />)
```

---

## Accès aux Hooks via CDN

Avec les CDN, les Hooks ne peuvent pas être importés directement.  
Il faut les **extraire de l'objet `React`** :

```jsx
// ❌ Impossible via CDN (pas de modules ES)
import { useState, useEffect, useRef } from 'react';

// ✅ Correct via CDN
const { useState, useEffect, useRef, useContext, useCallback, useMemo } = React;
```

**Exemple avec plusieurs Hooks :**

```jsx
const { useState, useEffect, useRef } = React;

const App = () => {
  const [value, setValue] = useState('');
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);

  // Focus automatique au montage
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Mise à jour du titre à chaque changement
  useEffect(() => {
    document.title = `Compteur : ${count}`;
  }, [count]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tapez quelque chose..."
      />
      <p>Valeur : {value}</p>
      <button onClick={() => setCount(count + 1)}>
        Compteur : {count}
      </button>
    </div>
  );
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

**Hooks disponibles via CDN :**

| Hook | Extraction |
|------|-----------|
| `useState` | `const { useState } = React` |
| `useEffect` | `const { useEffect } = React` |
| `useRef` | `const { useRef } = React` |
| `useContext` | `const { useContext } = React` |
| `useCallback` | `const { useCallback } = React` |
| `useMemo` | `const { useMemo } = React` |
| `useReducer` | `const { useReducer } = React` |

---

## Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│              REACT VIA CDN                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Scripts nécessaires (dans l'ordre)                     │
│  ──────────────────────────────────                     │
│  1. react.production.min.js      → Composants           │
│  2. react-dom.production.min.js  → DOM                  │
│  3. babel.min.js                 → Compilation JSX      │
│                                                         │
│  Script React                                           │
│  ─────────────                                          │
│  <script type="text/babel">                             │
│    // Code React ici                                    │
│  </script>                                              │
│                                                         │
│  Montage (React 18+)                                    │
│  ───────────────────                                    │
│  const root = ReactDOM.createRoot(                      │
│    document.getElementById('root')                      │
│  );                                                     │
│  root.render(<App />);                                  │
│                                                         │
│  Hooks                                                  │
│  ──────                                                 │
│  const { useState, useEffect } = React;                 │
│                                                         │
│  Fichier externe                                        │
│  ───────────────                                        │
│  <script src="app.js" type="text/babel"></script>       │
│                                                         │
│  ✅ Usage          ❌ À éviter                          │
│  Apprentissage     Production                           │
│  Prototypage       Projets complexes                    │
│  Démos             Imports/modules                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Points à retenir

| Élément | Obligatoire | Description |
|---------|-------------|-------------|
| `react.js` | ✅ | Création des composants |
| `react-dom.js` | ✅ | Rendu dans le DOM |
| `babel.js` | ✅ (pour JSX) | Compilation du JSX |
| `type="text/babel"` | ✅ | Indique à Babel de compiler le script |
| `<div id="root">` | ✅ | Point de montage React |
| `React.Component` | Pour les classes | Pas d'import possible via CDN |
| `const { useState } = React` | Pour les Hooks | Extraction depuis l'objet global |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Charger les scripts dans le bon ordre | Inverser React et ReactDOM |
| Utiliser `type="text/babel"` sur chaque script | Oublier l'attribut sur les fichiers externes |
| Extraire les Hooks depuis `React` | Essayer d'utiliser `import` |
| Utiliser `ReactDOM.createRoot()` (React 18+) | Utiliser `ReactDOM.render()` (déprécié) |
| Réserver cette méthode au prototypage | Utiliser CDN en production |