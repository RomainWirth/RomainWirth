# II. LES CONCEPTS DE REACT 

## Les Composants React
### Introduction

Il existe 2 types de composants dans React : `State Component` vs `UI Component`.

| Type | Description | Gestion du state |
|------|-------------|------------------|
| **State Component** | Composant qui gère des données locales | Via `this.state` (class) ou `useState` (fonction) |
| **UI Component** | Composant de présentation (affichage uniquement) | Aucun state, reçoit des props |

**Évolution historique :**

| Version | State Component | UI Component |
|---------|-----------------|--------------|
| Avant React 16.8 | Composant Class uniquement | Composant Fonction |
| Depuis React 16.8 | Class ou Fonction (avec Hooks) | Class ou Fonction |

Avec l'arrivée des Hooks, la distinction entre State Component et UI Component s'estompe.  
On tend désormais à unifier les deux types via les composants fonction.

### Structure d'un composant Class

```
┌─────────────────────────────────────────────────────────┐
│                    COMPOSANT CLASS                      │
├─────────────────────────────────────────────────────────┤
│  import { Component } from 'react'                      │
│                                                         │
│  class MonComposant extends Component {                 │
│    state = { ... }           ← État local               │
│                                                         │
│    maMethode = () => { ... } ← Méthodes personnalisées  │
│                                                         │
│    render() {                ← Méthode obligatoire      │
│      return (                                           │
│        <div>JSX</div>        ← Retourne du JSX          │
│      )                                                  │
│    }                                                    │
│  }                                                      │
│                                                         │
│  export default MonComposant                            │
└─────────────────────────────────────────────────────────┘
```

### Création d'un composant Class

**Fichier `App.jsx` (composant principal) :**

```jsx
import { Component } from 'react'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
      </div>
    )
  }
}

export default App
```

**Fichier `MyCars.jsx` (composant enfant) :**

```jsx
import React from 'react';

class MyCars extends React.Component {
  render() {
    return (
      <div>
        <h2>My Cars Component</h2>
        <p>Ceci est un paragraphe</p>
      </div>
    );
  }
}

export default MyCars;
```

### Utilisation d'un composant

Pour afficher un composant enfant, il faut :
1. **Importer** le composant
2. **Utiliser** le composant dans le JSX

```jsx
import { Component } from 'react'
import './App.css'

import MyCars from './components/MyCars' // 1. Import du composant

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello World!</h1>
        <MyCars /> {/* 2. Utilisation du composant */}
      </div>
    )
  }
}

export default App
```

### Combinaison State Component et UI Component

On peut combiner un composant Class (avec state) et un composant Fonction (sans state) :

**Structure du projet :**

```
src/
├── components/
│   ├── MyCars.jsx    ← State Component (Class)
│   └── Car.jsx       ← UI Component (Fonction)
└── App.jsx
```

**App.jsx :**

```jsx
import { Component } from 'react'
import './App.css'

import MyCars from './components/MyCars'

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyCars />
      </div>
    )
  }
}

export default App
```

**MyCars.jsx (State Component) :**

```jsx
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', color: 'black' },
      { brand: 'BMW', color: 'dark blue' },
      { brand: 'Mercedes', color: 'grey' },
    ],
  }

  render() {
    return (
      <div>
        <h1>My Cars</h1>
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>
              {car.brand}
            </Car>
          ))}
        </div>
      </div>
    );
  }
}

export default MyCars;
```

**Car.jsx (UI Component) :**

```jsx
const Car = ({ children, color }) => {
  return (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </div>
  );
}

export default Car;
```

### Différences entre les deux syntaxes d'import

| Syntaxe | Utilisation |
|---------|-------------|
| `import { Component } from 'react'` | Import nommé, permet d'utiliser `Component` directement |
| `import React from 'react'` | Import par défaut, nécessite `React.Component` |

```jsx
// Syntaxe 1 : Import nommé
import { Component } from 'react';
class App extends Component { ... }

// Syntaxe 2 : Import par défaut
import React from 'react';
class App extends React.Component { ... }
```

Les deux syntaxes sont équivalentes.

### Récapitulatif

| Aspect | State Component (Class) | UI Component (Fonction) |
|--------|-------------------------|-------------------------|
| **Syntaxe** | `class X extends Component` | `const X = () => {}` |
| **State** | `this.state` + `this.setState()` | `useState()` (Hook) |
| **Props** | `this.props` | Paramètre de la fonction |
| **Méthode render** | Obligatoire | Pas de méthode render |
| **Cycle de vie** | Méthodes dédiées | `useEffect()` (Hook) |
| **Utilisation** | Code legacy, Error Boundaries | ✅ Recommandé |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Un composant = un fichier | Plusieurs composants dans un fichier (sauf cas spécifiques) |
| Nommer en PascalCase | Nommer en camelCase ou snake_case |
| Séparer logique et présentation | Tout mettre dans un seul composant |
| Utiliser les composants fonction | Créer des classes pour tout |
| Décomposer en petits composants | Créer des composants monolithiques |

```
💡 Note : Sur les nouveaux projets, on privilégie les composants fonction avec les Hooks.
Les classes restent valides mais pourraient ne plus être maintenues dans le futur.
```

## Props et State

### Introduction

Dans React, les données circulent de deux manières principales :
- **Props** : données transmises d'un composant parent vers un composant enfant
- **State** : données locales gérées à l'intérieur d'un composant

```
┌─────────────────────────────────────────────────────────┐
│                    FLUX DE DONNÉES                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐                                       │
│   │   PARENT    │                                       │
│   │   (state)   │                                       │
│   └──────┬──────┘                                       │
│          │                                              │
│          │ props (lecture seule)                        │
│          ▼                                              │
│   ┌─────────────┐                                       │
│   │   ENFANT    │                                       │
│   │  (props)    │                                       │
│   └─────────────┘                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Caractéristique | Props | State |
|-----------------|-------|-------|
| **Origine** | Passées par le parent | Définies dans le composant |
| **Modification** | Immuables (lecture seule) | Modifiables via `setState()` |
| **Flux** | Parent → Enfant | Interne au composant |
| **Re-render** | Oui, si les props changent | Oui, si le state change |

---

### Props

#### Définition

Une `prop` (propriété) est une donnée que l'on souhaite pouvoir passer lors de l'appel d'un composant.  
Les props permettent de rendre les composants dynamiques et réutilisables.

#### Types de props

| Type | Description | Exemple |
|------|-------------|---------|
| **children** | Contenu JSX placé entre les balises du composant | `<Car>Audi</Car>` |
| **prop standard** | Attribut défini explicitement | `<Car color="red" />` |

#### Exemple basique

**Car.jsx (composant enfant) :**

```jsx
const Car = ({ children, color }) => {
  const colorInfo = color ? `Couleur : ${color}` : 'Couleur : inconnue';

  return (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px', width: '150px' }}>
      <p>Marque : {children}</p>
      <p>{colorInfo}</p>
    </div>
  );
}

export default Car;
```

**MyCars.jsx (composant parent) :**

```jsx
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  render() {
    return (
      <div>
        <h1>My Cars</h1>
        <div style={{ display: 'flex' }}>
          <Car color="noir">
            <span>Audi</span>
          </Car>
          <Car color="bleu foncé">
            <span>BMW</span>
          </Car>
          <Car>
            <span>Mercedes</span>
          </Car>
        </div>
      </div>
    );
  }
}

export default MyCars;
```

#### Passage de props avec le state

```jsx
// App.jsx (parent)
import { Component } from 'react'
import MyCars from './components/MyCars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
    colorTitle: 'green'
  }

  render() {
    return (
      <div className="App">
        <MyCars title={this.state.title} colorTitle={this.state.colorTitle} />
      </div>
    )
  }
}

export default App
```

```jsx
// MyCars.jsx (enfant)
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', color: 'black' },
      { brand: 'BMW', color: 'dark blue' },
      { brand: 'Mercedes', color: 'grey' },
    ],
  }

  render() {
    const { title, colorTitle } = this.props; // Destructuration des props

    return (
      <div>
        <h1 style={{ color: colorTitle }}>{title}</h1>
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>{car.brand}</Car>
          ))}
        </div>
      </div>
    );
  }
}

export default MyCars;
```

#### ⚠️ Règle fondamentale : l'immutabilité des props

**Les props sont immuables. Il ne faut JAMAIS les modifier à l'intérieur du composant.**

La prop est un élément "maléable" côté parent : c'est le parent qui envoie la data au composant via la prop.  
Le composant enfant ne doit faire qu'**afficher** la data ou **déclencher une action**.  
Il ne doit en aucun cas modifier la valeur passée.

```jsx
// ❌ INTERDIT : Ne jamais faire ceci !
const Car = ({ children, color }) => {
  children = 'toto'; // MODIFICATION INTERDITE !

  return (
    <div>
      <p>Marque : {children}</p>
    </div>
  );
}

// ✅ CORRECT : Utiliser les props en lecture seule
const Car = ({ children, color }) => {
  return (
    <div>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </div>
  );
}
```

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Lire les props | Modifier les props directement |
| Utiliser les props pour l'affichage | Réassigner une valeur à une prop |
| Appeler une fonction passée en prop | Muter un objet ou tableau reçu en prop |

---

### State

#### Définition

Le `state` est un objet qui contient les données locales d'un composant.  
Ces données peuvent changer au fil du temps et déclenchent un re-render du composant.

#### Déclaration du state

**Méthode 1 : Dans le constructor**

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Mon catalogue voitures',
    };
  }
}
```

**Méthode 2 : Propriété de classe (syntaxe moderne)**

```jsx
class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
  }
}
```

Les deux syntaxes sont équivalentes. La seconde est plus concise.

#### Accès au state

Dans un composant classe, on accède au state via `this.state` :

```jsx
render() {
  return (
    <div>
      <h1>{this.state.title}</h1>
    </div>
  );
}
```

#### Modification du state avec setState()

**⚠️ Règle fondamentale : Ne JAMAIS modifier le state directement !**

```jsx
// ❌ INTERDIT : Modification directe
this.state.title = "Nouveau titre";

// ✅ CORRECT : Utiliser setState()
this.setState({ title: "Nouveau titre" });
```

**Pourquoi utiliser setState() ?**

| Raison | Explication |
|--------|-------------|
| **Détection des changements** | React compare le DOM virtuel avec le DOM actuel |
| **Cycle de vie** | React surveille les mutations pour gérer le cycle de vie |
| **Performance** | Seuls les éléments modifiés sont re-rendus |

**Formes de setState() :**

```jsx
// Forme 1 : Objet (changements simples)
this.setState({ title: "Nouveau titre" });

// Forme 2 : Fonction (changements basés sur l'état précédent) ✅ Recommandée
this.setState(prevState => ({
  count: prevState.count + 1
}));

// Avec callback (exécuté après la mise à jour)
this.setState(
  { title: "Nouveau titre" },
  () => console.log('State mis à jour:', this.state.title)
);
```

#### Exemple complet : Modification du state avec événements

```jsx
import { Component } from 'react'
import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
    colorTitle: 'green'
  }

  // Modification en dur
  changeTitle = () => {
    this.setState({ title: "Mon nouveau titre" });
  }

  // Modification avec paramètre
  changeWithParam = (title) => {
    this.setState({ title });
  }

  // Modification avec bind
  changeWithBind = (param) => {
    this.setState({ title: param });
  }

  // Modification dynamique avec input
  changeWithInput = (e) => {
    this.setState({ title: e.target.value });
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
        
        {/* Bouton simple */}
        <button onClick={this.changeTitle}>
          Changer en dur
        </button>
        
        {/* Avec paramètre (fonction anonyme) */}
        <button onClick={() => this.changeWithParam('Titre via paramètre')}>
          Changer avec paramètre
        </button>
        
        {/* Avec bind */}
        <button onClick={this.changeWithBind.bind(this, 'Titre via bind')}>
          Changer avec Bind
        </button>
        
        {/* Input dynamique */}
        <input 
          type="text" 
          onChange={this.changeWithInput} 
          value={this.state.title}
        />
      </div>
    )
  }
}

export default App
```

#### Méthodes de passage de données

| Méthode | Syntaxe | Utilisation |
|---------|---------|-------------|
| **Fonction anonyme** | `onClick={() => this.func(param)}` | Passer des paramètres |
| **Bind** | `onClick={this.func.bind(this, param)}` | Alternative avec bind |
| **Référence directe** | `onClick={this.func}` | Sans paramètre |

---

### Communication Parent ↔ Enfant

#### Parent → Enfant (via props)

Le parent transmet des données à l'enfant via les props :

```jsx
// Parent
<Enfant data={this.state.data} />

// Enfant
const Enfant = ({ data }) => <p>{data}</p>;
```

#### Enfant → Parent (via callback)

L'enfant communique avec le parent en appelant une fonction passée en prop :

```jsx
// Parent
class Parent extends Component {
  state = { message: '' }

  handleMessage = (msg) => {
    this.setState({ message: msg });
  }

  render() {
    return (
      <div>
        <p>Message reçu : {this.state.message}</p>
        <Enfant onSendMessage={this.handleMessage} />
      </div>
    );
  }
}

// Enfant
const Enfant = ({ onSendMessage }) => {
  return (
    <button onClick={() => onSendMessage('Bonjour du composant enfant !')}>
      Envoyer un message
    </button>
  );
};
```

```
┌─────────────────────────────────────────────────────────┐
│              COMMUNICATION BIDIRECTIONNELLE             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────┐                                       │
│   │   PARENT    │                                       │
│   │   (state)   │                                       │
│   └──────┬──────┘                                       │
│          │                                              │
│   props  │  ▲  callback                                 │
│   (data) │  │  (fonction)                               │
│          ▼  │                                           │
│   ┌─────────────┐                                       │
│   │   ENFANT    │                                       │
│   │  (props)    │                                       │
│   └─────────────┘                                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Note sur le constructor et les mauvaises pratiques

#### Quand implémenter le constructor ?

Le constructor n'est nécessaire que si vous devez :
- Initialiser l'état local avec `this.state`
- Lier des méthodes à l'instance avec `bind`

```jsx
constructor(props) {
  super(props);
  
  // Initialisation du state (seul endroit où on peut affecter directement)
  this.state = { counter: 0 };
  
  // Liaison des méthodes
  this.handleClick = this.handleClick.bind(this);
}
```

#### ⚠️ Erreurs courantes à éviter

| ❌ Ne pas faire | Explication |
|-----------------|-------------|
| `this.setState()` dans le constructor | Provoque une erreur |
| Copier les props dans le state | Anti-pattern |
| Modifier `this.state` directement (hors constructor) | React ne détecte pas le changement |

```jsx
// ❌ INTERDIT : Copier les props dans le state
constructor(props) {
  super(props);
  this.state = { color: props.color }; // NE JAMAIS FAIRE ÇA !
}

// ✅ CORRECT : Utiliser directement les props
render() {
  return <p style={{ color: this.props.color }}>Texte</p>;
}
```

---

### Récapitulatif

| Aspect | Props | State |
|--------|-------|-------|
| **Définition** | Données reçues du parent | Données locales du composant |
| **Accès (classe)** | `this.props.nom` | `this.state.nom` |
| **Modification** | Impossible (immuable) | `this.setState({ ... })` |
| **Destructuration** | `const { nom } = this.props` | `const { nom } = this.state` |
| **Re-render** | Si les props changent | Si le state change |

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser `setState()` pour modifier le state | Modifier `this.state` directement |
| Destructurer les props et le state | Accéder via `this.props.x` partout |
| Passer des callbacks pour la communication enfant → parent | Modifier les props dans l'enfant |
| Utiliser la forme fonction de `setState()` pour les calculs | Dépendre de `this.state` dans `setState()` |
| Garder le state minimal | Dupliquer les props dans le state |

## Export default vs Named Export

### Introduction

En JavaScript (et donc en React), il existe deux façons d'exporter des éléments depuis un module :
- **Export default** : export par défaut (un seul par fichier)
- **Named export** : export nommé (plusieurs possibles par fichier)

```
┌─────────────────────────────────────────────────────────┐
│                    TYPES D'EXPORT                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Export Default          │  Named Export               │
│  ─────────────────       │  ─────────────              │
│  • Un seul par fichier   │  • Plusieurs par fichier    │
│  • Import libre          │  • Import exact             │
│  • Sans accolades        │  • Avec accolades           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Export default

L'export default permet d'exporter **un seul élément principal** par fichier.  
Lors de l'import, on peut choisir **n'importe quel nom** pour l'élément importé.

**Déclaration :**

```jsx
// Méthode 1 : Export à la fin du fichier
class MyCars extends Component {
  // ...
}

export default MyCars;

// Méthode 2 : Export direct
export default class MyCars extends Component {
  // ...
}

// Méthode 3 : Composant fonction
const MyCars = () => {
  return <div>My Cars</div>;
};

export default MyCars;
```

**Import :**

```jsx
// Le nom peut être différent du nom original
import MyCars from './components/MyCars';
import Container from './components/MyCars';      // ✅ Fonctionne aussi
import MonComposant from './components/MyCars';   // ✅ Fonctionne aussi
```

| Avantage | Inconvénient |
|----------|--------------|
| Flexibilité du nom à l'import | Un seul export par fichier |
| Syntaxe simple | Moins explicite sur ce qui est importé |

---

### Named Export

Le named export permet d'exporter **plusieurs éléments** depuis un même fichier.  
Lors de l'import, on **doit utiliser le nom exact** de l'élément exporté.

**Déclaration :**

```jsx
// Méthode 1 : Export direct devant la déclaration
export class MyCars extends Component {
  // ...
}

export const Car = ({ brand }) => {
  return <p>{brand}</p>;
};

export const BRANDS = ['Audi', 'BMW', 'Mercedes'];

// Méthode 2 : Export groupé à la fin
class MyCars extends Component {
  // ...
}

const Car = ({ brand }) => {
  return <p>{brand}</p>;
};

const BRANDS = ['Audi', 'BMW', 'Mercedes'];

export { MyCars, Car, BRANDS };
```

**Import :**

```jsx
// Import avec accolades - nom exact obligatoire
import { MyCars } from './components/MyCars';
import { Car } from './components/MyCars';
import { MyCars, Car, BRANDS } from './components/MyCars';

// ❌ Ne fonctionne PAS
import { Container } from './components/MyCars'; // Erreur : Container n'existe pas
```

**Renommer à l'import avec `as` :**

```jsx
// Renommer un named export
import { MyCars as Container } from './components/MyCars';
import { Car as VehicleCard } from './components/MyCars';
```

| Avantage | Inconvénient |
|----------|--------------|
| Plusieurs exports par fichier | Nom exact requis |
| Plus explicite | Syntaxe avec accolades |
| Meilleur tree-shaking | - |

---

### Combiner les deux types d'export

Il est possible de combiner export default et named exports dans un même fichier :

```jsx
// MyCars.jsx
import React from 'react';

// Named export : composant utilitaire
export const Car = ({ brand, color }) => {
  return (
    <div>
      <p>Marque : {brand}</p>
      <p>Couleur : {color}</p>
    </div>
  );
};

// Named export : constante
export const DEFAULT_COLOR = 'black';

// Export default : composant principal
class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', color: 'black' },
      { brand: 'BMW', color: 'dark blue' },
      { brand: 'Mercedes', color: 'grey' },
    ],
  }

  render() {
    return (
      <div>
        <h1>My Cars</h1>
        {this.state.cars.map((car, index) => (
          <Car key={index} brand={car.brand} color={car.color} />
        ))}
      </div>
    );
  }
}

export default MyCars;
```

**Import combiné :**

```jsx
// Import du default + named exports
import MyCars, { Car, DEFAULT_COLOR } from './components/MyCars';

// Ou séparément
import MyCars from './components/MyCars';
import { Car, DEFAULT_COLOR } from './components/MyCars';
```

---

### Tableau comparatif

| Aspect | Export Default | Named Export |
|--------|----------------|--------------|
| **Syntaxe d'export** | `export default Component` | `export const Component` |
| **Syntaxe d'import** | `import X from './file'` | `import { X } from './file'` |
| **Nombre par fichier** | 1 seul | Illimité |
| **Nom à l'import** | Libre | Exact (ou avec `as`) |
| **Accolades** | Non | Oui |
| **Tree-shaking** | Moins efficace | Plus efficace |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Un composant principal = export default | Plusieurs composants principaux dans un fichier |
| Un composant = un fichier | Mélanger trop de logiques dans un fichier |
| Named exports pour les utilitaires/constantes | Exporter des éléments non utilisés ailleurs |
| Nommer les exports de manière explicite | Utiliser des noms génériques (Component1, Util, etc.) |

**Structure recommandée :**

```
src/
├── components/
│   ├── MyCars/
│   │   ├── MyCars.jsx       ← export default MyCars
│   │   ├── Car.jsx          ← export default Car (ou named si petit)
│   │   └── index.js         ← ré-export centralisé
│   └── utils/
│       └── carUtils.js      ← named exports (fonctions utilitaires)
```

**Fichier index.js pour simplifier les imports :**

```jsx
// components/MyCars/index.js
export { default } from './MyCars';
export { default as Car } from './Car';

// Utilisation
import MyCars, { Car } from './components/MyCars';
```

---

### Cas particulier : composant interne

Lorsqu'un composant est utilisé **uniquement** à l'intérieur d'un autre composant, il n'est pas nécessaire de l'exporter :

```jsx
// MyCars.jsx
import React from 'react';

// Composant interne - PAS exporté
const Car = ({ brand, color }) => {
  return (
    <div>
      <p>Marque : {brand}</p>
      <p>Couleur : {color}</p>
    </div>
  );
};

// Composant principal - exporté
class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', color: 'black' },
      { brand: 'BMW', color: 'dark blue' },
    ],
  }

  render() {
    return (
      <div>
        <h1>My Cars</h1>
        {this.state.cars.map((car, index) => (
          <Car key={index} brand={car.brand} color={car.color} />
        ))}
      </div>
    );
  }
}

export default MyCars;
```

Dans ce cas, le composant `Car` est uniquement accessible à l'intérieur du fichier `MyCars.jsx`.  
C'est une bonne pratique lorsque le composant n'a pas vocation à être réutilisé ailleurs.

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                   QUAND UTILISER ?                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Export Default                                         │
│  ───────────────                                        │
│  → Composant principal du fichier                       │
│  → Un seul composant par fichier                        │
│  → Convention : nom du fichier = nom du composant       │
│                                                         │
│  Named Export                                           │
│  ─────────────                                          │
│  → Fonctions utilitaires                                │
│  → Constantes partagées                                 │
│  → Plusieurs éléments liés dans un fichier              │
│  → Types TypeScript                                     │
│                                                         │
│  Pas d'export                                           │
│  ─────────────                                          │
│  → Composant utilisé uniquement en interne              │
│  → Fonctions helpers privées                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les Événements React

### Introduction

Les événements ([Events](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Events)) sont des changements ou des actions qui se produisent dans un système et auxquels on peut répondre d'une manière ou d'une autre.

```
┌─────────────────────────────────────────────────────────┐
│                    ÉVÉNEMENTS REACT                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Action utilisateur     →    Gestionnaire d'événement  │
│   (clic, saisie, etc.)        (fonction handler)        │
│                                                         │
│           │                          │                  │
│           ▼                          ▼                  │
│   ┌─────────────┐            ┌─────────────┐            │
│   │  onClick    │            │  setState() │            │
│   │  onChange   │     →      │  Mise à jour│            │
│   │  onSubmit   │            │  du state   │            │
│   │  onCopy     │            │             │            │
│   └─────────────┘            └─────────────┘            │
│                                      │                  │
│                                      ▼                  │
│                              [ Re-render ]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Différence entre JavaScript Vanilla et React

React utilise le **camelCase** pour tous les événements, contrairement au HTML classique.

| HTML (Vanilla JS) | React (JSX) |
|-------------------|-------------|
| `onclick` | `onClick` |
| `onchange` | `onChange` |
| `onsubmit` | `onSubmit` |
| `oncopy` | `onCopy` |
| `onmouseover` | `onMouseOver` |
| `onkeydown` | `onKeyDown` |

**Syntaxe comparée :**

```html
<!-- HTML Vanilla -->
<button onclick="myFunction()">Cliquer</button>
<input type="text" onchange="myFunction()" />
<p oncopy="myFunction()">Texte à copier</p>
```

```jsx
// React JSX
<button onClick={myFunction}>Cliquer</button>
<input type="text" onChange={myFunction} />
<p onCopy={myFunction}>Texte à copier</p>
```

---

### Liste des événements courants

| Catégorie | Événement | Description |
|-----------|-----------|-------------|
| **Souris** | `onClick` | Clic sur un élément |
| | `onDoubleClick` | Double-clic |
| | `onMouseEnter` | Survol (entrée) |
| | `onMouseLeave` | Survol (sortie) |
| | `onMouseDown` | Bouton enfoncé |
| | `onMouseUp` | Bouton relâché |
| **Clavier** | `onKeyDown` | Touche enfoncée |
| | `onKeyUp` | Touche relâchée |
| | `onKeyPress` | Touche pressée (déprécié) |
| **Formulaire** | `onChange` | Changement de valeur |
| | `onSubmit` | Soumission du formulaire |
| | `onFocus` | Focus sur l'élément |
| | `onBlur` | Perte du focus |
| **Presse-papiers** | `onCopy` | Copie |
| | `onCut` | Couper |
| | `onPaste` | Coller |
| **Autres** | `onScroll` | Défilement |
| | `onLoad` | Chargement terminé |
| | `onError` | Erreur de chargement |

---

### Déclaration d'un événement

#### ⚠️ Règle fondamentale : ne pas appeler la fonction immédiatement

```jsx
// ❌ INCORRECT : La fonction est exécutée au chargement de la page
<button onClick={this.handleClick()}>Cliquer</button>

// ✅ CORRECT : La fonction est passée en référence
<button onClick={this.handleClick}>Cliquer</button>

// ✅ CORRECT : Avec une fonction anonyme (si besoin de paramètres)
<button onClick={() => this.handleClick()}>Cliquer</button>
```

**Pourquoi ?**

| Syntaxe | Comportement |
|---------|--------------|
| `onClick={this.handleClick()}` | Exécute la fonction **immédiatement** au rendu |
| `onClick={this.handleClick}` | Passe la **référence** de la fonction |
| `onClick={() => this.handleClick()}` | Crée une fonction anonyme qui appellera `handleClick` au clic |

---

### Exemple basique : l'événement onCopy

```jsx
import React from 'react';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', color: 'black' },
      { brand: 'BMW', color: 'dark blue' },
      { brand: 'Mercedes', color: 'grey' },
    ],
  }

  // Fonction déclenchée lors de la copie
  noCopy = () => {
    alert("Copier c'est voler !");
  }

  render() {
    return (
      <div>
        <h1>My Cars</h1>
        {/* Événement onCopy sur le paragraphe */}
        <p onCopy={this.noCopy}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <div key={index}>
              <p>{car.brand}</p>
              <p>{car.color}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MyCars;
```

---

### Événements et modification du state

#### ⚠️ Règle : Ne JAMAIS modifier le state directement

```jsx
// ❌ INTERDIT : Modification directe du state
changeTitle = () => {
  this.state.title = "Nouveau titre"; // NE JAMAIS FAIRE ÇA !
}

// ✅ CORRECT : Utiliser setState()
changeTitle = () => {
  this.setState({ title: "Nouveau titre" });
}
```

**Pourquoi utiliser setState() ?**

| Raison | Explication |
|--------|-------------|
| **Détection des changements** | React compare le DOM virtuel avec le DOM actuel |
| **Cycle de vie** | React surveille les mutations pour gérer le cycle de vie |
| **Re-render** | `setState()` déclenche automatiquement un nouveau rendu |

---

### Méthodes de passage de paramètres

Il existe plusieurs façons de passer des paramètres à une fonction événementielle :

#### 1. Sans paramètre (référence directe)

```jsx
class App extends Component {
  state = { title: 'Mon titre' }

  changeTitle = () => {
    this.setState({ title: "Nouveau titre" });
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <button onClick={this.changeTitle}>Changer le titre</button>
      </div>
    );
  }
}
```

#### 2. Avec paramètre (fonction anonyme)

```jsx
class App extends Component {
  state = { title: 'Mon titre' }

  changeWithParam = (newTitle) => {
    this.setState({ title: newTitle });
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <button onClick={() => this.changeWithParam('Titre via paramètre')}>
          Changer avec paramètre
        </button>
      </div>
    );
  }
}
```

#### 3. Avec paramètre (bind)

```jsx
class App extends Component {
  state = { title: 'Mon titre' }

  changeWithBind = (newTitle) => {
    this.setState({ title: newTitle });
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <button onClick={this.changeWithBind.bind(this, 'Titre via bind')}>
          Changer avec bind
        </button>
      </div>
    );
  }
}
```

#### 4. Avec l'objet event (e)

```jsx
class App extends Component {
  state = { title: 'Mon titre' }

  changeWithInput = (e) => {
    this.setState({ title: e.target.value });
  }

  render() {
    return (
      <div>
        <h1>{this.state.title}</h1>
        <input 
          type="text" 
          value={this.state.title}
          onChange={this.changeWithInput} 
        />
      </div>
    );
  }
}
```

---

### Tableau récapitulatif des méthodes

| Méthode | Syntaxe | Utilisation |
|---------|---------|-------------|
| **Référence directe** | `onClick={this.func}` | Sans paramètre |
| **Fonction anonyme** | `onClick={() => this.func(param)}` | Avec paramètre(s) |
| **Bind** | `onClick={this.func.bind(this, param)}` | Alternative avec bind |
| **Event implicite** | `onChange={this.func}` | Accès à `e.target.value` |

---

### L'objet Event (e)

L'objet `event` est automatiquement passé aux gestionnaires d'événements React.

```jsx
handleClick = (e) => {
  console.log(e);                    // SyntheticBaseEvent
  console.log(e.target);             // Élément cliqué
  console.log(e.target.value);       // Valeur (pour les inputs)
  console.log(e.target.name);        // Attribut name
  console.log(e.type);               // Type d'événement (click, change, etc.)
}
```

**Propriétés utiles de l'objet event :**

| Propriété | Description |
|-----------|-------------|
| `e.target` | L'élément qui a déclenché l'événement |
| `e.target.value` | La valeur de l'élément (input, select, etc.) |
| `e.target.name` | L'attribut `name` de l'élément |
| `e.target.checked` | État coché (pour les checkbox) |
| `e.type` | Type de l'événement |
| `e.preventDefault()` | Empêche le comportement par défaut |
| `e.stopPropagation()` | Arrête la propagation de l'événement |

---

### Empêcher le comportement par défaut

La méthode `e.preventDefault()` empêche le comportement par défaut du navigateur.

```jsx
class Form extends Component {
  state = { username: '' }

  handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log('Formulaire soumis:', this.state.username);
  }

  handleChange = (e) => {
    this.setState({ username: e.target.value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          value={this.state.username}
          onChange={this.handleChange}
        />
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}
```

**Cas d'utilisation de preventDefault() :**

| Élément | Comportement par défaut | Raison d'utiliser preventDefault() |
|---------|-------------------------|-------------------------------------|
| `<form>` | Recharge la page | Traiter les données côté client |
| `<a>` | Navigation vers href | Gérer la navigation avec React Router |
| `<button type="submit">` | Soumet le formulaire | Contrôle personnalisé |

---

### Propagation des événements

React utilise le **bubbling** (propagation ascendante) par défaut.

```jsx
class EventPropagation extends Component {
  handleParentClick = () => {
    console.log('Parent cliqué');
  }

  handleChildClick = (e) => {
    e.stopPropagation(); // Arrête la propagation
    console.log('Enfant cliqué');
  }

  render() {
    return (
      <div onClick={this.handleParentClick} style={{ padding: '20px', background: 'lightblue' }}>
        <p>Zone parent</p>
        <button onClick={this.handleChildClick}>
          Cliquer ici
        </button>
      </div>
    );
  }
}
```

```
┌─────────────────────────────────────────────────────────┐
│                  PROPAGATION (BUBBLING)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Sans stopPropagation()     │  Avec stopPropagation()  │
│   ──────────────────────     │  ─────────────────────── │
│                              │                          │
│   Clic sur bouton            │  Clic sur bouton         │
│         │                    │         │                │
│         ▼                    │         ▼                │
│   handleChildClick()         │  handleChildClick()      │
│         │                    │         │                │
│         ▼                    │         ✗ (arrêté)       │
│   handleParentClick()        │                          │
│                              │                          │
└─────────────────────────────────────────────────────────┘
```

---

### Exemple complet : Formulaire avec plusieurs événements

```jsx
import { Component } from 'react';

class CompleteForm extends Component {
  state = {
    username: '',
    email: '',
    message: '',
    submitted: false
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ submitted: true });
    console.log('Données:', this.state);
  }

  handleReset = () => {
    this.setState({
      username: '',
      email: '',
      message: '',
      submitted: false
    });
  }

  handleFocus = (e) => {
    e.target.style.borderColor = 'blue';
  }

  handleBlur = (e) => {
    e.target.style.borderColor = 'gray';
  }

  render() {
    return (
      <div>
        <h2>Formulaire de contact</h2>
        
        {this.state.submitted && (
          <div className="success">Formulaire envoyé avec succès !</div>
        )}

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>

          <div>
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>

          <div>
            <label>Message :</label>
            <textarea
              name="message"
              value={this.state.message}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </div>

          <button type="submit">Envoyer</button>
          <button type="button" onClick={this.handleReset}>Réinitialiser</button>
        </form>
      </div>
    );
  }
}

export default CompleteForm;
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser le camelCase (`onClick`) | Utiliser le lowercase (`onclick`) |
| Passer une référence de fonction | Appeler la fonction directement `onClick={func()}` |
| Utiliser `setState()` pour modifier le state | Modifier `this.state` directement |
| Utiliser `e.preventDefault()` pour les formulaires | Laisser le formulaire recharger la page |
| Nommer les handlers avec le préfixe `handle` | Utiliser des noms génériques |
| Utiliser des arrow functions pour éviter le binding | Oublier de bind `this` dans le constructor |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                   ÉVÉNEMENTS REACT                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Syntaxe                                                │
│  ────────                                               │
│  • camelCase : onClick, onChange, onSubmit              │
│  • Valeur : fonction (référence, pas appel)             │
│                                                         │
│  Passage de paramètres                                  │
│  ─────────────────────                                  │
│  • Sans param : onClick={this.func}                     │
│  • Avec param : onClick={() => this.func(param)}        │
│  • Avec bind  : onClick={this.func.bind(this, param)}   │
│                                                         │
│  Objet event (e)                                        │
│  ───────────────                                        │
│  • e.target.value : valeur de l'input                   │
│  • e.preventDefault() : empêche le comportement défaut  │
│  • e.stopPropagation() : arrête la propagation          │
│                                                         │
│  Règle d'or                                             │
│  ──────────                                             │
│  • Toujours utiliser setState() pour modifier le state  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Destructuring (Déstructuration)

### Introduction

Le destructuring (déstructuration) est une syntaxe JavaScript qui permet d'extraire des valeurs d'un tableau ou d'un objet et de les assigner à des variables distinctes.

```
┌─────────────────────────────────────────────────────────┐
│                    DESTRUCTURING                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   TABLEAU                    │   OBJET                  │
│   ────────                   │   ─────                  │
│   const [a, b] = array       │   const {x, y} = object  │
│   → Position importante      │   → Nom de clé important │
│   → Crochets [ ]             │   → Accolades { }        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Destructuring d'un tableau

Le destructuring de tableau permet de créer des variables à partir des éléments d'un tableau, **basé sur leur position**.

**Sans destructuring :**

```js
const array = ["riri", "fifi", "loulou"];

const userOne = array[0];   // "riri"
const userTwo = array[1];   // "fifi"
const userThree = array[2]; // "loulou"

console.log(userOne, userTwo, userThree); // riri fifi loulou
```

**Avec destructuring :**

```js
const array = ["riri", "fifi", "loulou"];

const [userOne, userTwo, userThree] = array;

console.log(userOne, userTwo, userThree); // riri fifi loulou
```

**Syntaxes avancées :**

| Syntaxe | Description | Exemple |
|---------|-------------|---------|
| Ignorer des éléments | Utiliser des virgules | `const [first, , third] = arr` |
| Valeur par défaut | Assigner une valeur si undefined | `const [a = 0, b = 0] = arr` |
| Rest operator | Récupérer le reste | `const [first, ...rest] = arr` |
| Échange de variables | Permuter deux valeurs | `[a, b] = [b, a]` |

```js
const array = ["riri", "fifi", "loulou", "donald"];

// Ignorer le deuxième élément
const [first, , third] = array;
console.log(first, third); // riri loulou

// Rest operator : récupérer le reste du tableau
const [premier, ...reste] = array;
console.log(premier); // riri
console.log(reste);   // ["fifi", "loulou", "donald"]

// Échange de variables
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
```

---

### Destructuring d'un objet

Le destructuring d'objet permet de créer des variables à partir des propriétés d'un objet, **basé sur le nom des clés**.

**Sans destructuring :**

```js
const members = {
  userOne: "riri",
  userTwo: "fifi",
  userThree: "loulou"
};

const memberOne = members.userOne;     // "riri"
const memberTwo = members.userTwo;     // "fifi"
const memberThree = members.userThree; // "loulou"

console.log(memberOne, memberTwo, memberThree); // riri fifi loulou
```

**Avec destructuring :**

```js
const members = {
  userOne: "riri",
  userTwo: "fifi",
  userThree: "loulou"
};

const { userOne, userTwo, userThree } = members;

console.log(userOne, userTwo, userThree); // riri fifi loulou
```

**Syntaxes avancées :**

| Syntaxe | Description | Exemple |
|---------|-------------|---------|
| Renommer | Assigner à un autre nom | `const { userOne: hulk } = obj` |
| Valeur par défaut | Si propriété undefined | `const { name = 'inconnu' } = obj` |
| Rest operator | Récupérer le reste | `const { a, ...rest } = obj` |
| Imbriqué | Objets dans objets | `const { user: { name } } = obj` |

```js
const members = {
  userOne: "riri",
  userTwo: "fifi",
  userThree: "loulou"
};

// Renommer les variables
const { userOne: hulk, userTwo: spiderMan, userThree: superMan } = members;
console.log(hulk, spiderMan, superMan); // riri fifi loulou

// Rest operator
const { userOne, ...rest } = members;
console.log(userOne); // riri
console.log(rest);    // { userTwo: "fifi", userThree: "loulou" }

// Destructuring imbriqué
const user = {
  name: "Alice",
  address: {
    city: "Paris",
    country: "France"
  }
};

const { address: { city, country } } = user;
console.log(city, country); // Paris France
```

---

### Destructuring dans React

Le destructuring est omniprésent dans React pour accéder aux props, au state et aux données.

#### Destructuring du state dans un composant Class

```jsx
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', year: 2010, color: 'black' },
      { brand: 'BMW', year: 2012, color: 'dark blue' },
      { brand: 'Mercedes', year: 2020, color: 'grey' },
    ],
  }

  render() {
    // Destructuring du tableau cars
    const [audi, bmw, mercedes] = this.state.cars;

    return (
      <div className='flex gap-20'>
        <Car brand={audi.brand} year={audi.year} color={audi.color} />
        <Car brand={bmw.brand} year={bmw.year} color={bmw.color} />
        <Car brand={mercedes.brand} year={mercedes.year} color={mercedes.color} />
      </div>
    );
  }
}

export default MyCars;
```

#### Destructuring dans la méthode .map()

Au lieu d'utiliser `car.brand`, `car.year`, etc., on peut destructurer directement dans les paramètres de la fonction callback :

```jsx
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', year: 2010, color: 'black' },
      { brand: 'BMW', year: 2012, color: 'dark blue' },
      { brand: 'Mercedes', year: 2020, color: 'grey' },
    ],
  }

  render() {
    const currentYear = new Date().getFullYear();

    return (
      <div className='flex gap-20'>
        {/* Destructuring dans les paramètres de map() */}
        {this.state.cars.map(({ brand, year, color }, index) => (
          <Car 
            key={index} 
            brand={brand} 
            age={currentYear - year} 
            color={color} 
          />
        ))}
      </div>
    );
  }
}

export default MyCars;
```

**Comparaison :**

| Sans destructuring | Avec destructuring |
|-------------------|-------------------|
| `car.brand` | `brand` |
| `car.year` | `year` |
| `car.color` | `color` |
| `this.state.cars.map((car, index) => ...)` | `this.state.cars.map(({ brand, year, color }, index) => ...)` |

#### Destructuring des props dans un composant Fonction

```jsx
// ❌ Sans destructuring
const SingerFunction = (props) => {
  return (
    <div>
      <p>Nom : {props.name}</p>
      <p>Age : {props.age} ans</p>
    </div>
  );
};

// ✅ Avec destructuring dans le corps de la fonction
const SingerFunction = (props) => {
  const { name, age } = props;
  
  return (
    <div>
      <p>Nom : {name}</p>
      <p>Age : {age} ans</p>
    </div>
  );
};

// ✅✅ Avec destructuring directement dans les paramètres (recommandé)
const SingerFunction = ({ name, age }) => {
  return (
    <div>
      <p>Nom : {name}</p>
      <p>Age : {age} ans</p>
    </div>
  );
};
```

#### Destructuring des props dans un composant Class

Dans un composant classe, on ne peut pas destructurer dans les paramètres.  
Il faut le faire dans la méthode `render()` :

```jsx
import { Component } from 'react';

class SingerClass extends Component {
  render() {
    // Destructuring obligatoire dans render()
    const { name, age } = this.props;

    return (
      <div>
        <p>Nom : {name}</p>
        <p>Age : {age} ans</p>
      </div>
    );
  }
}

export default SingerClass;
```

#### Destructuring du state et des props combinés

```jsx
import { Component } from 'react';

class UserProfile extends Component {
  state = {
    isOnline: true,
    lastSeen: '10:30'
  }

  render() {
    // Destructuring des props ET du state
    const { name, age, city } = this.props;
    const { isOnline, lastSeen } = this.state;

    return (
      <div>
        <h2>{name}, {age} ans</h2>
        <p>Ville : {city}</p>
        <p>Statut : {isOnline ? '🟢 En ligne' : `🔴 Hors ligne (${lastSeen})`}</p>
      </div>
    );
  }
}

export default UserProfile;
```

---

### Tableau comparatif

| Aspect | Tableau | Objet |
|--------|---------|-------|
| **Syntaxe** | `const [a, b] = arr` | `const { a, b } = obj` |
| **Basé sur** | Position | Nom de la clé |
| **Ordre important** | ✅ Oui | ❌ Non |
| **Renommer** | Automatique (nouveau nom) | `{ ancien: nouveau }` |
| **Ignorer** | Virgule `, ,` | Ne pas déclarer |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Destructurer les props au début du composant | Accéder via `props.x` partout |
| Destructurer le state dans `render()` | Utiliser `this.state.x` partout |
| Utiliser des noms de variables explicites | Utiliser des noms génériques (a, b, c) |
| Destructurer dans les paramètres des fonctions | Créer des variables intermédiaires inutiles |
| Combiner avec les valeurs par défaut | Oublier de gérer les valeurs undefined |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                 DESTRUCTURING REACT                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Composant Fonction                                     │
│  ──────────────────                                     │
│  const Component = ({ prop1, prop2 }) => { ... }        │
│                                                         │
│  Composant Class                                        │
│  ───────────────                                        │
│  render() {                                             │
│    const { prop1, prop2 } = this.props;                 │
│    const { state1, state2 } = this.state;               │
│    ...                                                  │
│  }                                                      │
│                                                         │
│  Dans .map()                                            │
│  ──────────                                             │
│  array.map(({ key1, key2 }, index) => ...)              │
│                                                         │
│  Avantages                                              │
│  ─────────                                              │
│  • Code plus lisible et concis                          │
│  • Moins de répétitions                                 │
│  • Facilite la maintenance                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
## Callback function et invocation d'une méthode dans les props

### Introduction

Une [`callback`](https://developer.mozilla.org/fr/docs/Glossary/Callback_function) (fonction de rappel) est une fonction passée en tant qu'argument à une autre fonction.  
Elle est ensuite invoquée à l'intérieur de la fonction externe pour accomplir une action.

```
┌─────────────────────────────────────────────────────────┐
│                    CALLBACK FUNCTION                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   function A (callback) {                               │
│     // ... logique                                      │
│     callback();  ← Invocation de la callback            │
│   }                                                     │
│                                                         │
│   function B () {                                       │
│     console.log("Je suis la callback");                 │
│   }                                                     │
│                                                         │
│   A(B);  ← B est passée en argument à A                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Exemple JavaScript simple :**

```js
const greetings = (name) => {
  alert("Hello " + name);
}

const processUserInput = (callback) => {
  const name = prompt("Enter your name.");
  callback(name);
}

processUserInput(greetings);
```

| Élément | Rôle |
|---------|------|
| `greetings` | Fonction callback qui affiche un message |
| `processUserInput` | Fonction qui reçoit et invoque la callback |
| `processUserInput(greetings)` | Appel avec la callback en argument |

---

### Utilisation des callbacks dans React

Dans React, les callbacks sont essentielles pour :
- Modifier le state du parent depuis un composant enfant
- Réagir à des événements dans les composants enfants
- Créer des composants réutilisables et découplés

```
┌─────────────────────────────────────────────────────────┐
│              CALLBACK DANS REACT                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────────────┐                                   │
│   │     PARENT      │                                   │
│   │                 │                                   │
│   │  state = {...}  │                                   │
│   │                 │                                   │
│   │  maFonction = ()│ ← Fonction définie dans le parent │
│   │                 │                                   │
│   └────────┬────────┘                                   │
│            │                                            │
│            │ prop={this.maFonction}                     │
│            │                                            │
│            ▼                                            │
│   ┌─────────────────┐                                   │
│   │     ENFANT      │                                   │
│   │                 │                                   │
│   │ onClick={prop}  │ ← Invocation via événement        │
│   │                 │                                   │
│   └─────────────────┘                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Exemple pratique : Calcul de l'âge d'une voiture

Créons une fonction `getAge` qui calcule l'âge d'une voiture et retourne une chaîne formatée.

**MyCars.jsx (composant parent) :**

```jsx
import React from 'react';
import Car from './Car';

class MyCars extends React.Component {
  state = {
    cars: [
      { brand: 'Audi', year: 2010, color: 'black' },
      { brand: 'BMW', year: 2012, color: 'dark blue' },
      { brand: 'Mercedes', year: 2020, color: 'grey' },
    ],
  }

  // Callback qui calcule l'âge
  getAge = (year) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age > 1) {
      return `${age} ans`;
    }
    if (age === 1) {
      return `${age} an`;
    }
    return 'Neuve';
  }

  // Callback qui modifie le state
  addTenYears = () => {
    const updatedCars = this.state.cars.map(car => ({
      ...car,
      year: car.year - 10
    }));
    this.setState({ cars: updatedCars });
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>
          Ajouter 10 ans
        </button>
        <div className='flex justify-center items-center gap-20'>
          {this.state.cars.map(({ brand, year, color }, index) => (
            <Car 
              key={index} 
              brand={brand} 
              age={this.getAge(year)}  {/* Callback invoquée ici */}
              color={color} 
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MyCars;
```

**Car.jsx (composant enfant) :**

```jsx
const Car = ({ brand, age, color }) => {
  return (
    <div className="car-card">
      <h3>{brand}</h3>
      <p>Âge : {age}</p>
      <p>Couleur : {color}</p>
    </div>
  );
};

export default Car;
```

| Callback | Rôle | Invocation |
|----------|------|------------|
| `getAge(year)` | Calcule et formate l'âge | Dans le `.map()` via les props |
| `addTenYears()` | Modifie le state des voitures | Via `onClick` du bouton |

---

### Passer une fonction dans une prop

Le composant enfant attend une fonction à déclencher.  
Cette fonction est définie dans le composant parent et passée via les props.

**Principe :**

```
┌─────────────────────────────────────────────────────────┐
│           PASSER UNE FONCTION EN PROP                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   PARENT                                                │
│   ──────                                                │
│   state = { message: '' }                               │
│                                                         │
│   updateMessage = (msg) => {                            │
│     this.setState({ message: msg });                    │
│   }                                                     │
│                                                         │
│   <Enfant onUpdate={this.updateMessage} />              │
│            └───────────┬───────────┘                    │
│                        │                                │
│   ENFANT               │                                │
│   ──────               ▼                                │
│   <button onClick={() => props.onUpdate('Hello')}>      │
│     Cliquer                                             │
│   </button>                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Parent.jsx :**

```jsx
import { Component } from 'react';
import Child from './Child';

class Parent extends Component {
  state = {
    messageParent: null,
    messageChild: null,
  }

  // Fonction pour l'ordre du parent
  orderParent = () => {
    this.setState({ messageParent: "Range ta chambre" });
  }

  // Fonction callback passée à l'enfant
  answerChild = () => {
    this.setState({ messageChild: "Oui, Papa" });
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <h2>Parent</h2>
        <button onClick={this.orderParent}>Donner un ordre</button>
        <p>{this.state.messageParent}</p>
        <hr />
        <Child 
          name="Toto" 
          updatedState={this.state} 
          childAnswer={this.answerChild}  {/* Callback passée en prop */}
        />
      </div>
    );
  }
}

export default Parent;
```

**Child.jsx :**

```jsx
const Child = ({ name, updatedState, childAnswer }) => {
  // Bouton activé seulement si le parent a donné un ordre
  const isDisabled = updatedState.messageParent === null;

  return (
    <div>
      <h2>{name}</h2>
      <button 
        onClick={childAnswer}  {/* Invocation de la callback */}
        disabled={isDisabled}
      >
        Répondre
      </button>
      <p>{updatedState.messageChild}</p>
    </div>
  );
};

export default Child;
```

**Flux des données :**

| Étape | Action | Composant |
|-------|--------|-----------|
| 1 | Clic sur "Donner un ordre" | Parent |
| 2 | `orderParent()` modifie le state | Parent |
| 3 | Le state est passé via `updatedState` | Parent → Child |
| 4 | Le bouton "Répondre" devient actif | Child |
| 5 | Clic sur "Répondre" | Child |
| 6 | `childAnswer()` (callback) est invoquée | Child → Parent |
| 7 | Le state du parent est modifié | Parent |

---

### Exercice : Maman et Toto

**Objectif :** Compléter le code pour que :
1. Maman puisse donner un ordre
2. Toto puisse répondre uniquement après avoir reçu l'ordre

**Maman.jsx (à compléter) :**

```jsx
import { Component } from 'react';
import Toto from './Toto';

class Maman extends Component {
  state = {
    messageMaman: null,
    messageToto: null,
    disabled: true
  }

  // TODO: Compléter cette méthode
  ordreMaman = (msg) => {
    // ???
  }

  reponseToto = (msg) => {
    this.setState({ messageToto: msg });
  }

  render() {
    return (
      <div>
        <h1>Maman</h1>
        <button onClick={() => this.ordreMaman("Va ranger ta chambre")}>
          Ordre de la mère
        </button>
        <p>{this.state.messageMaman}</p>
        <hr />
        <Toto 
          name="Toto"
          reponseTotoProps={this.reponseToto}
          leState={this.state}
        />
      </div>
    );
  }
}

export default Maman;
```

**Toto.jsx (à compléter) :**

```jsx
const Toto = ({ name, reponseTotoProps, leState }) => {
  return (
    <div>
      <h2>{name}</h2>
      <button 
        // TODO: Compléter onClick et disabled
      >
        Réponse
      </button>
      <p>{leState.messageToto}</p>
    </div>
  );
};

export default Toto;
```

<details>
<summary>📝 Voir la correction</summary>

**Maman.jsx (corrigé) :**

```jsx
import { Component } from 'react';
import Toto from './Toto';

class Maman extends Component {
  state = {
    messageMaman: null,
    messageToto: null,
    disabled: true
  }

  ordreMaman = (msg) => {
    this.setState({ 
      messageMaman: msg, 
      disabled: false  // Active le bouton de Toto
    });
  }

  reponseToto = (msg) => {
    this.setState({ messageToto: msg });
  }

  render() {
    return (
      <div>
        <h1>Maman</h1>
        <button onClick={() => this.ordreMaman("Va ranger ta chambre")}>
          Ordre de la mère
        </button>
        <p>{this.state.messageMaman}</p>
        <hr />
        <Toto 
          name="Toto"
          reponseTotoProps={this.reponseToto}
          leState={this.state}
        />
      </div>
    );
  }
}

export default Maman;
```

**Toto.jsx (corrigé) :**

```jsx
const Toto = ({ name, reponseTotoProps, leState }) => {
  return (
    <div>
      <h2>{name}</h2>
      <button 
        onClick={() => reponseTotoProps("Non, je veux regarder la télé")}
        disabled={leState.disabled}
      >
        Réponse
      </button>
      <p>{leState.messageToto}</p>
    </div>
  );
};

export default Toto;
```

</details>

---

### Passer des paramètres à une callback

Il existe plusieurs façons de passer des paramètres à une callback :

| Méthode | Syntaxe | Utilisation |
|---------|---------|-------------|
| **Fonction anonyme** | `onClick={() => callback(param)}` | ✅ Recommandée |
| **Bind** | `onClick={callback.bind(this, param)}` | Alternative |
| **Fonction intermédiaire** | Créer une fonction qui appelle la callback | Pour logique complexe |

```jsx
// Méthode 1 : Fonction anonyme (recommandée)
<button onClick={() => this.handleClick('param1', 'param2')}>
  Cliquer
</button>

// Méthode 2 : Bind
<button onClick={this.handleClick.bind(this, 'param1', 'param2')}>
  Cliquer
</button>

// Méthode 3 : Fonction intermédiaire
handleButtonClick = () => {
  const param = this.calculateParam();
  this.handleClick(param);
}

<button onClick={this.handleButtonClick}>
  Cliquer
</button>
```

---

### Callback avec valeur de retour

Une callback peut également retourner une valeur utilisée par le parent :

```jsx
class Parent extends Component {
  state = {
    items: [
      { id: 1, name: 'Item 1', price: 10 },
      { id: 2, name: 'Item 2', price: 20 },
      { id: 3, name: 'Item 3', price: 30 },
    ]
  }

  // Callback qui retourne une valeur formatée
  formatPrice = (price) => {
    return `${price.toFixed(2)} €`;
  }

  // Callback qui calcule le total
  calculateTotal = () => {
    return this.state.items.reduce((sum, item) => sum + item.price, 0);
  }

  render() {
    return (
      <div>
        {this.state.items.map(item => (
          <Item 
            key={item.id}
            name={item.name}
            price={this.formatPrice(item.price)}  {/* Callback avec retour */}
          />
        ))}
        <p>Total : {this.formatPrice(this.calculateTotal())}</p>
      </div>
    );
  }
}
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Nommer les callbacks de manière explicite (`onSubmit`, `handleClick`) | Utiliser des noms génériques (`func`, `cb`) |
| Passer la callback en référence | Appeler la callback directement `prop={callback()}` |
| Définir les callbacks dans le parent | Modifier le state du parent depuis l'enfant |
| Utiliser des arrow functions pour le binding | Oublier le binding dans les classes |
| Destructurer les props dans l'enfant | Accéder via `props.callback` partout |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                 CALLBACKS DANS REACT                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Une callback est une fonction passée en argument       │
│  à une autre fonction (ou composant).                   │
│                                                         │
│  Utilisation dans React                                 │
│  ──────────────────────                                 │
│  • Parent définit la fonction                           │
│  • Parent passe la fonction en prop                     │
│  • Enfant invoque la fonction via la prop               │
│  • Le state du parent est modifié                       │
│                                                         │
│  Syntaxe                                                │
│  ───────                                                │
│  Parent : <Enfant onAction={this.maFonction} />         │
│  Enfant : <button onClick={onAction}>Clic</button>      │
│                                                         │
│  Avec paramètres                                        │
│  ───────────────                                        │
│  <button onClick={() => onAction(param)}>Clic</button>  │
│                                                         │
│  Avantages                                              │
│  ─────────                                              │
│  • Communication enfant → parent                        │
│  • Composants découplés et réutilisables                │
│  • Logique centralisée dans le parent                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## React Fragment

### Introduction

Dans React, un composant doit toujours retourner **un seul élément parent** dans le JSX.  
Souvent, on utilise une `<div>` pour englober plusieurs éléments, mais cela peut créer des problèmes.

```
┌─────────────────────────────────────────────────────────┐
│                    PROBLÈME DES DIVS                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Sans Fragment              │   Avec Fragment          │
│   ──────────────             │   ─────────────          │
│                              │                          │
│   <div>          ← Inutile   │   <>                     │
│     <h1>Titre</h1>           │     <h1>Titre</h1>       │
│     <p>Texte</p>             │     <p>Texte</p>         │
│   </div>                     │   </>                    │
│                              │                          │
│   → Div supplémentaire       │   → Aucun élément ajouté │
│     dans le DOM              │     dans le DOM          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Problématique

Lorsqu'on invoque un composant, l'élément parent de ce composant (souvent une `<div>`) devient l'enfant d'un autre élément.  
Cela peut provoquer des **problèmes de structure HTML** :

| Élément parent | Structure attendue | Problème avec `<div>` |
|----------------|--------------------|-----------------------|
| `<ul>` | `<ul><li>...</li></ul>` | `<ul><div><li>...</li></div></ul>` ❌ |
| `<table>` | `<table><tr><td>...</td></tr></table>` | `<table><div><tr>...</tr></div></table>` ❌ |
| `<tr>` | `<tr><td>...</td></tr>` | `<tr><div><td>...</td></div></tr>` ❌ |
| `<dl>` | `<dl><dt>...</dt><dd>...</dd></dl>` | `<dl><div><dt>...</dt></div></dl>` ❌ |

Ces structures invalides :
- Ne passent pas la validation W3C
- Peuvent causer des problèmes d'affichage
- Perturbent les styles CSS (flexbox, grid)

---

### Solution : React Fragment

Le **Fragment** est un composant React qui permet d'englober plusieurs éléments **sans ajouter de nœud supplémentaire** dans le DOM.

#### Syntaxe courte (recommandée)

```jsx
const MyComponent = () => {
  return (
    <>
      <h1>Titre</h1>
      <p>Premier paragraphe</p>
      <p>Deuxième paragraphe</p>
    </>
  );
};
```

#### Syntaxe longue

```jsx
import { Fragment } from 'react';

const MyComponent = () => {
  return (
    <Fragment>
      <h1>Titre</h1>
      <p>Premier paragraphe</p>
      <p>Deuxième paragraphe</p>
    </Fragment>
  );
};
```

| Syntaxe | Import nécessaire | Propriété `key` |
|---------|-------------------|-----------------|
| `<>...</>` | Non | ❌ Non supportée |
| `<Fragment>...</Fragment>` | Oui | ✅ Supportée |

---

### Cas d'utilisation

#### 1. Listes (`<ul>`, `<ol>`)

```jsx
// ❌ INCORRECT : div invalide dans ul
const ListItems = () => {
  return (
    <div>
      <li>Item 1</li>
      <li>Item 2</li>
    </div>
  );
};

// ✅ CORRECT : Fragment
const ListItems = () => {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
};

// Utilisation
const App = () => {
  return (
    <ul>
      <ListItems />
    </ul>
  );
};
```

**Résultat dans le DOM :**

```html
<!-- Avec div (invalide) -->
<ul>
  <div>
    <li>Item 1</li>
    <li>Item 2</li>
  </div>
</ul>

<!-- Avec Fragment (valide) -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

#### 2. Tableaux (`<table>`)

```jsx
// ❌ INCORRECT
const TableRows = () => {
  return (
    <div>
      <tr><td>Ligne 1</td></tr>
      <tr><td>Ligne 2</td></tr>
    </div>
  );
};

// ✅ CORRECT
const TableRows = () => {
  return (
    <>
      <tr><td>Ligne 1</td></tr>
      <tr><td>Ligne 2</td></tr>
    </>
  );
};

// Utilisation
const App = () => {
  return (
    <table>
      <tbody>
        <TableRows />
      </tbody>
    </table>
  );
};
```

#### 3. Colonnes de tableau (`<td>`)

```jsx
// ✅ CORRECT : Fragment pour plusieurs colonnes
const Columns = () => {
  return (
    <>
      <td>Colonne 1</td>
      <td>Colonne 2</td>
      <td>Colonne 3</td>
    </>
  );
};

const App = () => {
  return (
    <table>
      <tbody>
        <tr>
          <Columns />
        </tr>
      </tbody>
    </table>
  );
};
```

---

### Fragment avec la propriété `key`

Lorsqu'on utilise un Fragment dans une boucle (`.map()`), il faut utiliser la **syntaxe longue** pour ajouter la propriété `key` :

```jsx
import { Fragment } from 'react';

const Glossary = ({ items }) => {
  return (
    <dl>
      {items.map(item => (
        // ⚠️ Syntaxe longue obligatoire pour utiliser key
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
};

// Utilisation
const App = () => {
  const items = [
    { id: 1, term: 'React', description: 'Bibliothèque JavaScript' },
    { id: 2, term: 'JSX', description: 'Syntaxe JavaScript + HTML' },
    { id: 3, term: 'Component', description: 'Bloc réutilisable' },
  ];

  return <Glossary items={items} />;
};
```

**⚠️ Attention : la syntaxe courte `<>` ne supporte pas la propriété `key` !**

```jsx
// ❌ IMPOSSIBLE
<> key={item.id}
  <dt>{item.term}</dt>
  <dd>{item.description}</dd>
</>

// ✅ CORRECT
<Fragment key={item.id}>
  <dt>{item.term}</dt>
  <dd>{item.description}</dd>
</Fragment>
```

---

### Exemple complet : Liste de voitures

```jsx
import { Fragment } from 'react';

const CarList = () => {
  const cars = [
    { id: 1, brand: 'Audi', model: 'A4', year: 2020 },
    { id: 2, brand: 'BMW', model: 'Serie 3', year: 2021 },
    { id: 3, brand: 'Mercedes', model: 'Classe C', year: 2022 },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Marque</th>
          <th>Modèle</th>
          <th>Année</th>
        </tr>
      </thead>
      <tbody>
        {cars.map(car => (
          <Fragment key={car.id}>
            <tr>
              <td>{car.brand}</td>
              <td>{car.model}</td>
              <td>{car.year}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default CarList;
```

---

### Comparaison : avec et sans Fragment

| Aspect | Sans Fragment (`<div>`) | Avec Fragment (`<>`) |
|--------|-------------------------|----------------------|
| **Nœuds DOM** | Ajoute un nœud | Aucun nœud ajouté |
| **Validation HTML** | Peut être invalide | Toujours valide |
| **Performance** | Légèrement moins bon | Optimal |
| **CSS** | Peut perturber les styles | Aucun impact |
| **Accessibilité** | Peut affecter les lecteurs d'écran | Transparent |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser `<>...</>` par défaut | Utiliser `<div>` comme wrapper inutile |
| Utiliser `<Fragment>` avec `key` dans les boucles | Utiliser `<>` dans une boucle avec `key` |
| Vérifier la structure HTML | Ignorer les warnings de validation |
| Privilégier la syntaxe courte | Importer Fragment si non nécessaire |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                    REACT FRAGMENT                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Composant invisible qui permet d'englober              │
│  plusieurs éléments sans ajouter de nœud au DOM.        │
│                                                         │
│  Syntaxes                                               │
│  ────────                                               │
│  • Courte : <>...</>                                    │
│  • Longue : <Fragment>...</Fragment>                    │
│                                                         │
│  Quand utiliser ?                                       │
│  ────────────────                                       │
│  • Retourner plusieurs éléments sans wrapper            │
│  • Éviter les div inutiles                              │
│  • Structures HTML strictes (table, ul, dl)             │
│                                                         │
│  Quand utiliser la syntaxe longue ?                     │
│  ──────────────────────────────────                     │
│  • Nécessité d'ajouter la propriété key                 │
│  • Dans les boucles .map()                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les conditions dans React

### Introduction

Les conditions dans React fonctionnent comme en JavaScript classique.  
Cependant, certaines syntaxes sont plus adaptées au JSX que d'autres.

```
┌─────────────────────────────────────────────────────────┐
│              CONDITIONS DANS REACT                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   if...else        → Hors du JSX (logique complexe)     │
│   Ternaire ? :     → Dans le JSX (condition + 2 cas)    │
│   && logique       → Dans le JSX (condition + 1 cas)    │
│   || logique       → Valeur par défaut                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Syntaxe | Utilisation | Dans le JSX ? |
|---------|-------------|---------------|
| `if...else` | Logique complexe, plusieurs conditions | ❌ Non |
| `condition ? A : B` | Afficher A ou B selon la condition | ✅ Oui |
| `condition && A` | Afficher A uniquement si condition vraie | ✅ Oui |
| `value \|\| default` | Valeur par défaut si value est falsy | ✅ Oui |

---

### La structure if...else

#### ⚠️ Limitation : if...else ne fonctionne pas directement dans le JSX

```jsx
// ❌ IMPOSSIBLE : if...else dans le JSX
return (
  <div>
    {if (condition) {
      <p>Vrai</p>
    } else {
      <p>Faux</p>
    }}
  </div>
);
```

#### Solution 1 : Retours multiples

```jsx
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    if (this.state.winner) {
      return (
        <div className="game-container">
          <h2>Game Component</h2>
          <p>Bravo {this.state.name} 🎉</p>
        </div>
      );
    } else {
      return (
        <div className="game-container">
          <h2>Game Component</h2>
          <p>Dommage {this.state.name} 😢</p>
        </div>
      );
    }
  }
}

export default Game;
```

**Inconvénient :** Code dupliqué (le container est répété).

#### Solution 2 : Variable intermédiaire

```jsx
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    let result;
    if (this.state.winner) {
      result = <p>Bravo {this.state.name} 🎉</p>;
    } else {
      result = <p>Dommage {this.state.name} 😢</p>;
    }

    return (
      <div className="game-container">
        <h2>Game Component</h2>
        {result}
      </div>
    );
  }
}

export default Game;
```

**Avantage :** Pas de duplication, code plus lisible.

#### Solution 3 : Fonction dédiée

```jsx
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  renderMessage = () => {
    if (this.state.winner) {
      return <p>Bravo {this.state.name} 🎉</p>;
    }
    return <p>Dommage {this.state.name} 😢</p>;
  }

  render() {
    return (
      <div className="game-container">
        <h2>Game Component</h2>
        {this.renderMessage()}
      </div>
    );
  }
}

export default Game;
```

**Avantage :** Logique extraite, méthode réutilisable.

---

### L'opérateur ternaire (condition ? A : B)

L'opérateur ternaire est la méthode **recommandée** pour les conditions simples dans le JSX.

```
┌─────────────────────────────────────────────────────────┐
│                 OPÉRATEUR TERNAIRE                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   condition ? valeurSiVrai : valeurSiFaux               │
│                                                         │
│   Exemple :                                             │
│   isLoggedIn ? "Bienvenue" : "Connectez-vous"           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Exemple basique

```jsx
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    return (
      <div className="game-container">
        <h2>Game Component</h2>
        <p>
          {this.state.winner 
            ? `Bravo ${this.state.name} 🎉` 
            : `Dommage ${this.state.name} 😢`}
        </p>
      </div>
    );
  }
}

export default Game;
```

#### Ternaire avec éléments JSX

```jsx
render() {
  return (
    <div>
      {this.state.winner ? (
        <div className="success">
          <h3>Victoire !</h3>
          <p>Félicitations {this.state.name}</p>
        </div>
      ) : (
        <div className="failure">
          <h3>Défaite</h3>
          <p>Réessayez {this.state.name}</p>
        </div>
      )}
    </div>
  );
}
```

#### Ternaires imbriqués (à éviter)

```jsx
// ❌ Difficile à lire
{score > 80 
  ? 'Excellent' 
  : score > 60 
    ? 'Bien' 
    : score > 40 
      ? 'Moyen' 
      : 'Insuffisant'}

// ✅ Préférer une fonction
const getGrade = (score) => {
  if (score > 80) return 'Excellent';
  if (score > 60) return 'Bien';
  if (score > 40) return 'Moyen';
  return 'Insuffisant';
};

// Utilisation
<p>Note : {getGrade(this.state.score)}</p>
```

---

### L'opérateur logique && (ET)

L'opérateur `&&` permet d'afficher un élément **uniquement si la condition est vraie**.  
Si la condition est fausse, rien n'est affiché (équivalent à `null`).

```
┌─────────────────────────────────────────────────────────┐
│                   OPÉRATEUR &&                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   condition && elementAffiche                           │
│                                                         │
│   Équivaut à :                                          │
│   condition ? elementAffiche : null                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Exemple basique

```jsx
import { Component } from 'react';

class Notifications extends Component {
  state = {
    messages: 5,
    isAdmin: true,
  }

  render() {
    return (
      <div>
        <h2>Notifications</h2>
        
        {/* Affiche uniquement si messages > 0 */}
        {this.state.messages > 0 && (
          <p>Vous avez {this.state.messages} nouveaux messages</p>
        )}
        
        {/* Affiche uniquement si isAdmin est true */}
        {this.state.isAdmin && (
          <button>Accès administration</button>
        )}
      </div>
    );
  }
}

export default Notifications;
```

#### ⚠️ Attention aux valeurs falsy

```jsx
// ❌ PROBLÈME : 0 est falsy mais s'affiche quand même !
{this.state.count && <p>Count: {this.state.count}</p>}
// Si count = 0, affiche "0" au lieu de rien

// ✅ SOLUTION : Convertir en booléen explicitement
{this.state.count > 0 && <p>Count: {this.state.count}</p>}

// OU utiliser un ternaire
{this.state.count ? <p>Count: {this.state.count}</p> : null}
```

**Valeurs falsy en JavaScript :**

| Valeur | Type | Comportement avec && |
|--------|------|----------------------|
| `false` | boolean | N'affiche rien ✅ |
| `null` | null | N'affiche rien ✅ |
| `undefined` | undefined | N'affiche rien ✅ |
| `0` | number | **Affiche "0"** ⚠️ |
| `""` | string | N'affiche rien ✅ |
| `NaN` | number | **Affiche "NaN"** ⚠️ |

---

### L'opérateur logique || (OU)

L'opérateur `||` permet de définir une **valeur par défaut** si la première valeur est falsy.

```jsx
// Valeur par défaut pour les props
const UserCard = ({ name, avatar }) => {
  return (
    <div>
      <img src={avatar || '/default-avatar.png'} alt="Avatar" />
      <p>{name || 'Utilisateur anonyme'}</p>
    </div>
  );
};
```

#### Alternative moderne : l'opérateur ?? (Nullish Coalescing)

```jsx
// || : retourne la valeur de droite si la gauche est falsy (0, "", false, null, undefined)
// ?? : retourne la valeur de droite uniquement si la gauche est null ou undefined

const count = 0;

console.log(count || 10);  // 10 (car 0 est falsy)
console.log(count ?? 10);  // 0  (car 0 n'est ni null ni undefined)
```

---

### Tableau comparatif des méthodes

| Méthode | Syntaxe | Cas d'utilisation | Exemple |
|---------|---------|-------------------|---------|
| **if...else** | Hors JSX | Logique complexe | Plusieurs conditions imbriquées |
| **Ternaire** | `a ? b : c` | Choix entre 2 options | Afficher "Oui" ou "Non" |
| **&&** | `a && b` | Affichage conditionnel | Bouton visible si admin |
| **\|\|** | `a \|\| b` | Valeur par défaut | Nom par défaut si vide |
| **??** | `a ?? b` | Valeur si null/undefined | Éviter les problèmes avec 0 |

---

### Exemple complet : Profil utilisateur

```jsx
import { Component } from 'react';

class UserProfile extends Component {
  state = {
    user: {
      name: 'Alice',
      age: 25,
      isAdmin: true,
      isPremium: false,
      notifications: 3,
      bio: '',
    },
    isLoading: false,
    error: null,
  }

  render() {
    const { user, isLoading, error } = this.state;

    // Condition avec if : état de chargement
    if (isLoading) {
      return <div className="loader">Chargement...</div>;
    }

    // Condition avec if : gestion des erreurs
    if (error) {
      return <div className="error">Erreur : {error}</div>;
    }

    return (
      <div className="profile">
        <h2>{user.name}</h2>
        
        {/* Ternaire : afficher l'âge ou "Non renseigné" */}
        <p>Âge : {user.age ? `${user.age} ans` : 'Non renseigné'}</p>
        
        {/* || : valeur par défaut pour la bio */}
        <p>Bio : {user.bio || 'Aucune biographie'}</p>
        
        {/* && : afficher badge admin si isAdmin */}
        {user.isAdmin && <span className="badge admin">Admin</span>}
        
        {/* Ternaire : badge premium ou standard */}
        <span className={`badge ${user.isPremium ? 'premium' : 'standard'}`}>
          {user.isPremium ? '⭐ Premium' : 'Standard'}
        </span>
        
        {/* && avec condition numérique explicite */}
        {user.notifications > 0 && (
          <div className="notifications">
            🔔 {user.notifications} notification{user.notifications > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  }
}

export default UserProfile;
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser le ternaire pour les conditions simples | Imbriquer plusieurs ternaires |
| Utiliser `&&` pour l'affichage conditionnel | Utiliser `&&` avec des valeurs numériques sans vérification |
| Extraire la logique complexe dans des fonctions | Mettre trop de logique dans le JSX |
| Utiliser `??` pour les valeurs null/undefined | Confondre `\|\|` et `??` |
| Gérer les états de chargement et d'erreur | Ignorer les cas limites |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│              CONDITIONS DANS REACT                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  if...else (hors JSX)                                   │
│  ─────────────────────                                  │
│  → Logique complexe avant le return                     │
│  → Retours multiples possibles                          │
│                                                         │
│  Ternaire ? : (dans JSX)                                │
│  ───────────────────────                                │
│  → Choix entre deux éléments                            │
│  → {condition ? <A /> : <B />}                          │
│                                                         │
│  && logique (dans JSX)                                  │
│  ─────────────────────                                  │
│  → Affichage conditionnel (un seul élément)             │
│  → {condition && <A />}                                 │
│  → ⚠️ Attention aux valeurs 0 et NaN                    │
│                                                         │
│  || et ?? (valeurs par défaut)                          │
│  ─────────────────────────────                          │
│  → || : valeur par défaut si falsy                      │
│  → ?? : valeur par défaut si null/undefined             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les images et les formulaires dans React

### Introduction

Dans React, la gestion des images et des formulaires diffère légèrement du HTML classique.  
Les images nécessitent un import préalable, et les formulaires utilisent le concept de **composants contrôlés**.

```
┌─────────────────────────────────────────────────────────┐
│           IMAGES ET FORMULAIRES DANS REACT              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   IMAGES                     │   FORMULAIRES            │
│   ──────                     │   ───────────            │
│   • Import obligatoire       │   • Composants contrôlés │
│   • PNG, JPG : balise <img>  │   • State = source       │
│   • SVG : composant React    │   • onChange + value     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Les images

#### Images PNG / JPG

Pour afficher une image bitmap (PNG, JPG, etc.), il faut :
1. **Importer** l'image dans le composant
2. **Utiliser** l'import dans l'attribut `src`

```jsx
import romain from '../assets/Romain.png';

const Romain = () => {
  return <img src={romain} alt="Photo de Romain" />;
};

export default Romain;
```

**Pourquoi importer l'image ?**

| Méthode | Syntaxe | Fonctionnement |
|---------|---------|----------------|
| Import (recommandé) | `import img from './image.png'` | Webpack/Vite optimise et hash l'image |
| URL publique | `src="/images/photo.png"` | Fichier dans le dossier `public/` |
| URL externe | `src="https://example.com/image.png"` | Image hébergée ailleurs |

```jsx
// ✅ Import (recommandé pour les assets du projet)
import logo from './assets/logo.png';
<img src={logo} alt="Logo" />

// ✅ Dossier public (pour les images statiques)
<img src="/images/hero.jpg" alt="Hero" />

// ✅ URL externe
<img src="https://example.com/photo.jpg" alt="Photo externe" />
```

#### Images SVG

Pour les SVG, deux approches sont possibles :

**Approche 1 : Import comme image**

```jsx
import logo from '../assets/logo.svg';

const Logo = () => {
  return <img src={logo} alt="Logo" />;
};
```

**Approche 2 : Composant React (recommandé)**

Cette approche permet de personnaliser dynamiquement les propriétés du SVG via les props :

```jsx
const IconCircleUser = ({ width = "24", height = "24", color = "currentColor", className = "" }) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      fill={color}
      className={className}
    >
      <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c39.77 0 72 32.24 72 72S295.8 272 256 272c-39.76 0-72-32.24-72-72S216.2 128 256 128zM256 448c-52.93 0-100.9-21.53-135.7-56.29C136.5 349.9 176.5 320 224 320h64c47.54 0 87.54 29.88 103.7 71.71C356.9 426.5 308.9 448 256 448z"/>
    </svg>
  );
};

export default IconCircleUser;
```

**Utilisation :**

```jsx
import IconCircleUser from './components/IconCircleUser';

const App = () => {
  return (
    <div>
      <IconCircleUser width="50" height="50" color="blue" />
      <IconCircleUser width="100" height="100" color="red" className="icon-large" />
    </div>
  );
};
```

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| Import comme image | Simple, rapide | Pas de personnalisation dynamique |
| Composant React | Personnalisation via props, réutilisable | Plus verbeux |

---

### Les formulaires

#### Composants contrôlés vs non contrôlés

Dans React, il existe deux façons de gérer les formulaires :

```
┌─────────────────────────────────────────────────────────┐
│              COMPOSANTS DE FORMULAIRE                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   CONTRÔLÉ (recommandé)      │   NON CONTRÔLÉ           │
│   ─────────────────────      │   ─────────────          │
│   • State = source de vérité │   • DOM = source         │
│   • value + onChange         │   • ref pour accéder     │
│   • Validation en temps réel │   • Validation à submit  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Type | Description | Syntaxe |
|------|-------------|---------|
| **Contrôlé** | Le state React contrôle la valeur | `value={state}` + `onChange` |
| **Non contrôlé** | Le DOM contrôle la valeur | `ref` + `defaultValue` |

#### Formulaire contrôlé : exemple de base

```jsx
import { Component } from 'react';

class SimpleForm extends Component {
  state = {
    username: '',
  }

  handleChange = (e) => {
    this.setState({ username: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log('Valeur soumise:', this.state.username);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom d'utilisateur :
          <input 
            type="text" 
            value={this.state.username} 
            onChange={this.handleChange} 
          />
        </label>
        <button type="submit">Envoyer</button>
      </form>
    );
  }
}

export default SimpleForm;
```

**Flux des données :**

```
┌─────────────────────────────────────────────────────────┐
│              FLUX D'UN COMPOSANT CONTRÔLÉ               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. Utilisateur tape "A"                               │
│          │                                              │
│          ▼                                              │
│   2. onChange déclenché                                 │
│          │                                              │
│          ▼                                              │
│   3. setState({ username: "A" })                        │
│          │                                              │
│          ▼                                              │
│   4. Re-render du composant                             │
│          │                                              │
│          ▼                                              │
│   5. Input affiche "A" (via value={state})              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Gestion de plusieurs champs

Pour gérer plusieurs champs avec un seul handler, on utilise l'attribut `name` :

```jsx
import { Component } from 'react';

class MultiFieldForm extends Component {
  state = {
    username: '',
    email: '',
    password: '',
  }

  // Handler unique pour tous les champs
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log('Données:', this.state);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input 
            type="text" 
            name="username"
            value={this.state.username} 
            onChange={this.handleChange} 
          />
        </div>
        
        <div>
          <label>Email :</label>
          <input 
            type="email" 
            name="email"
            value={this.state.email} 
            onChange={this.handleChange} 
          />
        </div>
        
        <div>
          <label>Mot de passe :</label>
          <input 
            type="password" 
            name="password"
            value={this.state.password} 
            onChange={this.handleChange} 
          />
        </div>
        
        <button type="submit">S'inscrire</button>
      </form>
    );
  }
}

export default MultiFieldForm;
```

**Explication de la syntaxe `[name]: value` :**

```jsx
// Syntaxe avec computed property name
const { name, value } = e.target;
this.setState({ [name]: value });

// Équivalent à (si name = "email" et value = "test@test.com") :
this.setState({ email: "test@test.com" });
```

#### Types de champs de formulaire

| Type de champ | Attribut value | Handler |
|---------------|----------------|---------|
| `<input type="text">` | `value={state}` | `onChange` |
| `<input type="email">` | `value={state}` | `onChange` |
| `<input type="password">` | `value={state}` | `onChange` |
| `<input type="checkbox">` | `checked={state}` | `onChange` (e.target.checked) |
| `<input type="radio">` | `checked={state === value}` | `onChange` |
| `<textarea>` | `value={state}` | `onChange` |
| `<select>` | `value={state}` | `onChange` |

#### Exemple complet avec différents types de champs

```jsx
import { Component } from 'react';

class CompleteForm extends Component {
  state = {
    username: '',
    color: '',
    colors: ['', 'green', 'blue', 'red', 'yellow', 'black', 'white'],
    comment: '',
    newsletter: false,
    gender: '',
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Gestion spéciale pour les checkbox
    const newValue = type === 'checkbox' ? checked : value;
    
    this.setState({ [name]: newValue });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert(`
      Pseudo : ${this.state.username}
      Couleur : ${this.state.color}
      Commentaire : ${this.state.comment}
      Newsletter : ${this.state.newsletter ? 'Oui' : 'Non'}
      Genre : ${this.state.gender}
    `);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        {/* Input text */}
        <div>
          <label>Pseudo :</label>
          <input 
            type="text" 
            name="username"
            value={this.state.username} 
            onChange={this.handleChange} 
          />
        </div>

        {/* Select */}
        <div>
          <label>Couleur préférée :</label>
          <select 
            name="color"
            value={this.state.color}
            onChange={this.handleChange}
          >
            {this.state.colors.map((color, index) => (
              <option key={index} value={color}>
                {color || 'Sélectionner...'}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
        <div>
          <label>Commentaire :</label>
          <textarea 
            name="comment"
            value={this.state.comment}
            onChange={this.handleChange}
          />
        </div>

        {/* Checkbox */}
        <div>
          <label>
            <input 
              type="checkbox" 
              name="newsletter"
              checked={this.state.newsletter}
              onChange={this.handleChange}
            />
            S'abonner à la newsletter
          </label>
        </div>

        {/* Radio buttons */}
        <div>
          <label>Genre :</label>
          <label>
            <input 
              type="radio" 
              name="gender"
              value="homme"
              checked={this.state.gender === 'homme'}
              onChange={this.handleChange}
            />
            Homme
          </label>
          <label>
            <input 
              type="radio" 
              name="gender"
              value="femme"
              checked={this.state.gender === 'femme'}
              onChange={this.handleChange}
            />
            Femme
          </label>
          <label>
            <input 
              type="radio" 
              name="gender"
              value="autre"
              checked={this.state.gender === 'autre'}
              onChange={this.handleChange}
            />
            Autre
          </label>
        </div>

        <button type="submit">Valider</button>
      </form>
    );
  }
}

export default CompleteForm;
```

#### `e.preventDefault()` : empêcher le comportement par défaut

```jsx
handleSubmit = (e) => {
  e.preventDefault(); // ⚠️ OBLIGATOIRE pour les formulaires React
  
  // Sans preventDefault(), la page se recharge
  // et le state est perdu
  
  console.log('Données:', this.state);
}
```

| Comportement | Sans `preventDefault()` | Avec `preventDefault()` |
|--------------|-------------------------|-------------------------|
| Page | Rechargement | Pas de rechargement |
| State | Perdu | Conservé |
| Données | Envoyées au serveur (GET/POST) | Gérées côté client |

---

### Exemple complet : Formulaire avec affichage dynamique

```jsx
import { Component } from 'react';
import IconCircleUser from './IconCircleUser';

class UserForm extends Component {
  state = {
    username: '',
    color: '',
    colors: ['', 'green', 'blue', 'red', 'purple', 'orange'],
    comment: '',
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pseudo : ${this.state.username}\nCommentaire : ${this.state.comment}`);
  }

  render() {
    const { username, color, colors, comment } = this.state;

    return (
      <div className="form-container">
        {/* Aperçu en temps réel */}
        <div className="preview">
          <IconCircleUser width="100" height="100" color={color || 'gray'} />
          <div className="user-info">
            <p><strong>Utilisateur :</strong> {username || 'Non renseigné'}</p>
            <p><strong>Commentaire :</strong> {comment || 'Aucun'}</p>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Pseudo</label>
            <input 
              type="text" 
              id="username"
              name="username"
              value={username} 
              onChange={this.handleChange}
              placeholder="Entrez votre pseudo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Couleur de l'avatar</label>
            <select 
              id="color"
              name="color"
              value={color}
              onChange={this.handleChange}
            >
              {colors.map((c, index) => (
                <option key={index} value={c}>
                  {c || 'Sélectionner une couleur'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Message</label>
            <textarea 
              id="comment"
              name="comment"
              value={comment}
              onChange={this.handleChange}
              placeholder="Écrivez votre message..."
              rows="4"
            />
          </div>

          <button type="submit">Valider</button>
        </form>
      </div>
    );
  }
}

export default UserForm;
```

---

### Validation de formulaire

#### Validation basique

```jsx
import { Component } from 'react';

class ValidatedForm extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
  }

  validate = () => {
    const errors = {};
    const { email, password } = this.state;

    if (!email) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'L\'email n\'est pas valide';
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return errors;
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    
    const errors = this.validate();
    this.setState({ errors });

    if (Object.keys(errors).length === 0) {
      console.log('Formulaire valide:', this.state);
      // Envoyer les données...
    }
  }

  render() {
    const { email, password, errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Email :</label>
          <input 
            type="email" 
            name="email"
            value={email} 
            onChange={this.handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div>
          <label>Mot de passe :</label>
          <input 
            type="password" 
            name="password"
            value={password} 
            onChange={this.handleChange}
            className={errors.password ? 'error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit">Se connecter</button>
      </form>
    );
  }
}

export default ValidatedForm;
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|----------|-----------------|
| Utiliser des composants contrôlés | Manipuler le DOM directement |
| Utiliser `e.preventDefault()` sur `onSubmit` | Laisser le formulaire recharger la page |
| Utiliser l'attribut `name` pour les handlers uniques | Créer un handler par champ |
| Importer les images locales | Utiliser des chemins relatifs sans import |
| Créer des composants SVG pour la personnalisation | Dupliquer du code SVG |
| Valider les données avant soumission | Envoyer des données non validées |
| Utiliser `htmlFor` au lieu de `for` sur les labels | Utiliser `for` (mot réservé en JS) |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│           IMAGES ET FORMULAIRES REACT                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  IMAGES                                                 │
│  ──────                                                 │
│  • PNG/JPG : import + <img src={import} />              │
│  • SVG : composant avec props (width, height, color)    │
│  • Dossier public : src="/images/photo.png"             │
│                                                         │
│  FORMULAIRES                                            │
│  ───────────                                            │
│  • Composant contrôlé : value={state} + onChange        │
│  • Handler unique : name + [name]: value                │
│  • Checkbox : checked={state} au lieu de value          │
│  • Soumission : onSubmit + e.preventDefault()           │
│                                                         │
│  VALIDATION                                             │
│  ──────────                                             │
│  • Stocker les erreurs dans le state                    │
│  • Valider avant soumission                             │
│  • Afficher les messages d'erreur conditionnellement    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Intégrer du CSS dans React

### Introduction

React propose plusieurs méthodes pour intégrer du CSS, chacune adaptée à des besoins différents.

```
┌─────────────────────────────────────────────────────────┐
│              MÉTHODES CSS DANS REACT                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. Inline CSS         → style={{...}}                 │
│   2. Feuille externe    → import './styles.css'         │
│   3. CSS Modules        → import styles from '.module'  │
│   4. Frameworks         → Bootstrap, Tailwind           │
│   5. CSS-in-JS          → Styled Components             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

| Méthode | Scope | Dynamique | Recommandée |
|---------|-------|-----------|-------------|
| Inline CSS | Élément | ✅ Oui | ⚠️ Cas spécifiques |
| Feuille externe | Global | ❌ Non | ✅ Oui |
| CSS Modules | Local | ❌ Non | ✅ Oui |
| Frameworks | Global | ❌ Non | ✅ Prototypage |
| CSS-in-JS | Local | ✅ Oui | ✅ Oui |

---

### 1. Inline CSS

Pour déclarer du CSS inline, on utilise l'attribut `style` directement dans la balise JSX.

#### Syntaxe HTML vs JSX

| HTML classique | JSX |
|----------------|-----|
| `style="font-size: 24px; color: red"` | `style={{fontSize: '24px', color: 'red'}}` |
| Chaîne de caractères | Objet JavaScript |
| kebab-case (`font-size`) | camelCase (`fontSize`) |

```jsx
// ❌ HTML classique (ne fonctionne pas en JSX)
<p style="font-size: 24px; color: red">paragraphe</p>

// ✅ JSX : objet avec doubles accolades
<p style={{fontSize: '24px', color: 'red'}}>paragraphe</p>
```

#### Avec une variable

```jsx
import './App.css'

function App() {
  const paragrapheStyle = {
    fontSize: '20px',
    color: 'red',
  }

  return (
    <>
      <h1 style={{fontSize: '50px', color: 'blue'}}>Hello World !</h1>
      <p style={paragrapheStyle}>paragraphe</p>
    </>
  )
}

export default App
```

#### Styles dynamiques

```jsx
const Button = ({ isActive }) => {
  const buttonStyle = {
    backgroundColor: isActive ? 'green' : 'gray',
    cursor: isActive ? 'pointer' : 'not-allowed',
  };

  return <button style={buttonStyle}>Cliquer</button>;
};
```

| ✅ Avantages | ❌ Inconvénients |
|--------------|-----------------|
| Styles dynamiques faciles | Pas de pseudo-classes (`:hover`, `:focus`) |
| Pas de conflit de noms | Pas de media queries |
| Isolation totale | Difficile à maintenir |

> ⚠️ Il n'est pas recommandé d'utiliser le CSS inline pour la majorité des styles.  
> On préférera une feuille de style `.css`.

---

### 2. Feuille de style externe

On crée un fichier `.css` et on l'importe dans le composant.  
On utilise `className` (et non `class`) pour appliquer les classes CSS.

#### Création du fichier CSS

```css
/* styles.css */
.blue { color: blue; }
.red  { color: red;  }
.bigFont { font-size: 32px; }
```

#### Import et utilisation

```jsx
import './App.css'
import './styles.css'

import Form from './components/Form'

function App() {
  return (
    <>
      <h1 className="blue bigFont">Hello World !</h1>
      <p className="red">paragraphe</p>
      <Form head={true} />
    </>
  )
}

export default App
```

#### Classes conditionnelles via les props

**Composant parent :**

```jsx
<Form head={true} />   {/* → classe "blue" */}
<Form head={false} />  {/* → classe "red"  */}
```

**Composant enfant (Class) :**

```jsx
import { Component } from "react";

class Form extends Component {
  render() {
    // Classe conditionnelle basée sur la prop head (booléen)
    const myClass = this.props.head ? "blue" : "red";

    return (
      <div>
        <h2>Formulaire</h2>
        <p className={myClass}>je suis rouge ou bleu</p>
        <button>Valider</button>
      </div>
    )
  }
}

export default Form;
```

**Composant enfant (Fonction) :**

```jsx
// Composant : on reçoit className en prop
const Header = ({ className }) => {
  return <h1 className={className}>Bienvenue sur le site</h1>;
}

export default Header;
```

```jsx
// Composant parent : on passe les classes en prop
<Header className="bigFont blue" />
```

| ✅ Avantages | ❌ Inconvénients |
|--------------|-----------------|
| Syntaxe familière | Scope global (conflits possibles) |
| Support complet CSS | Noms de classes à gérer manuellement |
| Pseudo-classes, media queries | |

---

### 3. CSS Modules

Les CSS Modules permettent d'**isoler les styles** au niveau du composant, évitant les conflits de noms.

#### Création d'un fichier CSS Module

Le fichier doit être nommé avec l'extension `.module.css` :

```css
/* style.module.css */
.green { color: green; }
```

#### Import et utilisation

```jsx
import './App.css'
import './styles.css'
import styles from './style.module.css'  // Import de l'objet styles

import Header from './components/Header'

function App() {
  return (
    <>
      <Header className="bigFont blue" />
      {/* On accède à la classe via styles.green */}
      <p className={styles.green}>premier paragraphe</p>
    </>
  )
}

export default App
```

**Résultat dans le DOM :**

```html
<!-- Le nom de classe est automatiquement hashé -->
<p class="App_green__3xk2A">premier paragraphe</p>
```

> **À noter :** Pour utiliser la classe `.green`, il est obligatoire d'importer le fichier `.module.css` dans une variable (`styles`), puis d'y accéder via `styles.green`.

| ✅ Avantages | ❌ Inconvénients |
|--------------|-----------------|
| Scope local automatique | Import obligatoire |
| Pas de conflits de noms | Syntaxe légèrement différente (`styles.maClasse`) |
| Optimisation à la compilation | |

---

### 4. Frameworks CSS

#### Bootstrap

**Installation :**

```bash
npm install bootstrap
# Pour une version précise :
npm install bootstrap@5.3.0
```

**Configuration dans `main.jsx` :**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
```

Une fois importé, on peut utiliser les classes Bootstrap directement dans le JSX via `className` :

```jsx
<div className="container">
  <button className="btn btn-primary">Valider</button>
</div>
```

> **Inconvénient :** On charge l'intégralité de Bootstrap sur chaque page, même si on n'utilise pas toutes les classes.

---

#### React-Bootstrap

React-Bootstrap propose des **composants React** qui encapsulent les classes Bootstrap.

**Installation :**

```bash
npm install react-bootstrap bootstrap
```

**Configuration dans `main.jsx` :**

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
// OU
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
```

**Utilisation :**

```jsx
import { Container, Button } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container>
      <p>Welcome !</p>
      <Button variant="primary">Valider</Button>
    </Container>
  )
}

export default Welcome;
```

#### Différence entre Bootstrap et React-Bootstrap

| Aspect | Bootstrap classique | React-Bootstrap |
|--------|---------------------|-----------------|
| **Syntaxe** | `className="container"` | `<Container>` |
| **Import** | CSS global uniquement | Composants individuels |
| **Props** | Attributs HTML | Props React (`variant`, `size`) |

```jsx
// Bootstrap classique
<div className="container">
  <button className="btn btn-primary btn-lg">Cliquer</button>
</div>

// React-Bootstrap
import { Container, Button } from 'react-bootstrap';

<Container>
  <Button variant="primary" size="lg">Cliquer</Button>
</Container>
```

---

#### Tailwind CSS

Tailwind CSS est un framework CSS **utilitaire** : au lieu de fournir des composants prêts à l'emploi (comme Bootstrap), il fournit des classes utilitaires de bas niveau à combiner directement dans le JSX.

**Installation avec Vite :**

```bash
npm install tailwindcss @tailwindcss/vite
```

**Configuration dans `vite.config.js` :**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**Import dans `index.css` :**

```css
@import "tailwindcss";
```

**Utilisation dans le JSX :**

```jsx
const Card = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Titre</h2>
      <p className="mt-2 text-gray-500">Description de la carte</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Action
      </button>
    </div>
  );
};
```

**Classes utilitaires courantes :**

| Catégorie | Exemples de classes |
|-----------|---------------------|
| **Flexbox** | `flex`, `flex-col`, `items-center`, `justify-between` |
| **Espacement** | `p-4`, `px-6`, `mt-2`, `gap-4` |
| **Typographie** | `text-xl`, `font-bold`, `text-gray-800`, `uppercase` |
| **Couleurs** | `bg-blue-500`, `text-white`, `border-gray-200` |
| **Dimensions** | `w-full`, `h-screen`, `max-w-lg` |
| **Bordures** | `rounded`, `rounded-xl`, `border`, `border-2` |
| **Ombres** | `shadow`, `shadow-md`, `shadow-lg` |
| **Hover/Focus** | `hover:bg-blue-600`, `focus:outline-none` |

**Classes conditionnelles :**

```jsx
const Button = ({ isActive, children }) => {
  return (
    <button
      className={`px-4 py-2 rounded font-semibold transition
        ${isActive 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
    >
      {children}
    </button>
  );
};
```

> 💡 **Astuce VS Code :** Installer l'extension **Tailwind CSS IntelliSense** (par Tailwind Labs) pour l'autocomplétion des classes.

#### Comparaison Bootstrap vs Tailwind

| Aspect | Bootstrap | Tailwind |
|--------|-----------|----------|
| **Approche** | Composants prêts à l'emploi | Classes utilitaires |
| **Personnalisation** | Limitée | Totale |
| **Taille du bundle** | Lourd (si non purgé) | Optimisé (purge auto) |
| **Courbe d'apprentissage** | Faible | Modérée |
| **Design par défaut** | Oui (style Bootstrap reconnaissable) | Non (design sur mesure) |
| **Responsive** | Via classes (col-md-6) | Via préfixes (md:w-1/2) |

```jsx
// Bootstrap classique
<div className="d-flex justify-content-center align-items-center p-3">
  <button className="btn btn-primary btn-lg">Cliquer</button>
</div>

// Tailwind
<div className="flex justify-center items-center p-3">
  <button className="px-6 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-600">
    Cliquer
  </button>
</div>
```

| ✅ Avantages | ❌ Inconvénients |
|--------------|-----------------|
| Design sur mesure | Classes parfois longues dans le JSX |
| Bundle optimisé automatiquement | Courbe d'apprentissage des noms de classes |
| Responsive intégré | Pas de composants prêts à l'emploi |
| Pas de conflits de noms CSS | |

### 5. CSS-in-JS : Styled Components

[Styled Components](https://styled-components.com/) permet d'écrire du CSS directement dans les fichiers JavaScript via des template literals.

**Avantage principal :** Les styles ne sont chargés que lorsqu'on fait appel au composant, contrairement à Bootstrap.

**Installation :**

```bash
npm install styled-components
```

> **Extension VS Code recommandée :** `vscode-styled-components` (de Julien Possonnier) pour la coloration syntaxique dans les backticks.

#### Syntaxe de base

```jsx
import { Component } from "react";
import styled from 'styled-components';

// Création d'un composant stylé
const Title = styled.h2`
  color: purple;
  font-size: 24px;
`;

const Button = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: darkred;
  }
`;

class Form extends Component {
  render() {
    return (
      <div>
        <Title>Formulaire</Title>
        <Button>Valider</Button>
      </div>
    )
  }
}

export default Form;
```

> **À noter :** En inspectant l'élément dans le DOM, on remarquera qu'une classe CSS générée automatiquement est ajoutée. Par exemple : `class="sc-bRKDuR bWJJIR"`.

#### Styles dynamiques avec props

```jsx
const Button = styled.button`
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// Utilisation
<Button primary>Bouton principal</Button>
<Button>Bouton secondaire</Button>
<Button disabled>Bouton désactivé</Button>
```

| ✅ Avantages | ❌ Inconvénients |
|--------------|-----------------|
| Styles dynamiques via props | Dépendance externe |
| Pseudo-classes, media queries | Courbe d'apprentissage |
| Scope local automatique | Syntaxe différente du CSS classique |
| Chargé uniquement si utilisé | |

---

### Tableau comparatif

| Critère | Inline | Externe | Modules | Bootstrap | Tailwind | Styled Comp. |
|---------|:------:|:-------:|:-------:|:---------:|:--------:|:------------:|
| **Scope** | Élément | Global | Local | Global | Global | Local |
| **Dynamique** | ✅ | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| **Pseudo-classes** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Media queries** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dépendances** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Maintenance** | ❌ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| **Bundle optimisé** | ➖ | ❌ | ❌ | ❌ | ✅ | ➖ |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser CSS Modules ou Styled Components pour le scope local | Tout faire en inline |
| Séparer les styles complexes dans des fichiers | Mettre tout le CSS dans `App.css` |
| Utiliser des noms de classes explicites | Utiliser des noms génériques (`.box`, `.wrapper`) |
| Profiter des frameworks pour le prototypage | Charger tout Bootstrap si non utilisé |
| Utiliser `className` en JSX | Utiliser `class` (mot réservé en JS) |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│              CSS DANS REACT - RÉSUMÉ                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Inline CSS                                             │
│  ──────────                                             │
│  → style={{fontSize: '20px'}}                           │
│  → Cas spécifiques, styles dynamiques simples           │
│                                                         │
│  Feuille externe                                        │
│  ───────────────                                        │
│  → import './styles.css' + className="..."              │
│  → Projets simples, styles globaux                      │
│                                                         │
│  CSS Modules                                            │
│  ───────────                                            │
│  → import styles from './X.module.css'                  │
│  → className={styles.maClasse}                          │
│  → Isolation des styles par composant                   │
│                                                         │
│  Bootstrap                                              │
│  ──────────                                             │
│  → npm install bootstrap / react-bootstrap              │
│  → Composants prêts à l'emploi, prototypage rapide      │
│                                                         │
│  Tailwind CSS                                           │
│  ─────────────                                          │
│  → npm install tailwindcss @tailwindcss/vite            │
│  → Classes utilitaires, design sur mesure               │
│  → Bundle optimisé automatiquement                      │
│                                                         │
│  CSS-in-JS (Styled Components)                          │
│  ─────────────────────────────                          │
│  → const Button = styled.button`...`                    │
│  → Styles dynamiques, chargés à la demande              │
│                                                         │
│  Recommandation                                         │
│  ──────────────                                         │
│  → CSS Modules pour les projets standards               │
│  → Tailwind pour les projets modernes sur mesure        │
│  → Styled Components pour les design systems            │
│  → Bootstrap pour le prototypage rapide                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Création d'une modal : les portails

### Qu'est-ce qu'un portail ?

Un **portail** (portal) est une fonctionnalité React qui permet de rendre un composant enfant **en dehors de la hiérarchie DOM du composant parent**, tout en conservant le contexte React (state, events, etc.).

```
┌─────────────────────────────────────────────────────────┐
│                  PORTAIL REACT                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ARBRE REACT (logique)      DOM RÉEL (rendu)           │
│   ─────────────────────      ──────────────────         │
│                                                         │
│   <App>                      <body>                     │
│     <Button />                 <div id="root">          │
│     <Modal />  ─────────────►    <button />             │
│   </App>                       </div>                   │
│                                <div id="modal-root">    │
│                                  <Modal />  ◄────────── │
│                                </div>                   │
│                              </body>                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pourquoi utiliser un portail pour une modal ?**

| Problème | Sans portail | Avec portail |
|----------|-------------|--------------|
| **Position CSS** | Relative au parent (problème si `overflow: hidden`) | Toujours au niveau du `<body>` |
| **z-index** | Peut être bloqué par un parent | Indépendant |
| **Accessibilité** | Structure DOM complexe | Structure claire |
| **Style** | Héritage CSS non désiré | Isolé du parent |

---

### Syntaxe de base

```jsx
ReactDOM.createPortal(child, container)
```

| Paramètre | Description |
|-----------|-------------|
| `child` | Le JSX à afficher (contenu de la modal) |
| `container` | L'élément DOM cible (hors de `#root`) |

---

### Mise en place

#### 1. Structure HTML (`index.html`)

On prépare un conteneur dédié pour la modal :

```html
<body>
  <div id="root"></div>
  <!-- Conteneur dédié pour les modals -->
  <div id="modal-root"></div>
</body>
```

#### 2. Composant App (`App.jsx`)

```jsx
import './App.css'
import { Component } from 'react'
import ModalComponent from './components/ModalComponent.jsx'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }

  handleOpenModal = () => {
    this.setState({ showModal: true })
  }

  handleCloseModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    const modal = this.state.showModal 
      ? <ModalComponent close={this.handleCloseModal} /> 
      : null

    return (
      <div className="App relative">
        <h1>React Modal</h1>
        <button onClick={this.handleOpenModal}>Afficher la modal</button>
        {modal}
      </div>
    )
  }
}

export default App
```

**CSS associé (`App.css`) :**

```css
.App {
  height: 100svh;  /* Prend toute la hauteur de l'écran */
  width: 100svw;   /* Prend toute la largeur de l'écran */
  background-color: #213547;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.relative {
  position: relative; /* Nécessaire pour le positionnement absolu */
}
```

> **À noter :**  
> - `showModal` est le booléen dans le state qui contrôle l'affichage.  
> - `handleOpenModal` et `handleCloseModal` modifient ce booléen.  
> - La prop `close` passe la fonction de fermeture au composant enfant.

#### 3. Composant Modal (`ModalComponent.jsx`)

```jsx
import { Component } from 'react';
import ReactDOM from 'react-dom';

class ModalComponent extends Component {
  constructor(props) {
    super(props);
    // Création d'un conteneur div pour le portail
    this.popUpContainer = document.createElement('div');
    // Injection dans le DOM (hors de #root)
    document.body.appendChild(this.popUpContainer);
  }

  componentWillUnmount() {
    // Nettoyage : suppression du conteneur lors du démontage
    document.body.removeChild(this.popUpContainer);
  }

  render() {
    return ReactDOM.createPortal(
      // 1er paramètre : le JSX à afficher
      <div className="modal" onClick={this.props.close}>
        <div 
          className="modal-content"
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic sur le contenu
        >
          <h2>Titre de la modal</h2>
          <p>Je suis dans la modal !</p>
          <button onClick={this.props.close}>Fermer</button>
        </div>
      </div>,
      // 2ème paramètre : le conteneur cible
      this.popUpContainer
    )
  }
}

export default ModalComponent;
```

**CSS associé (`ModalComponent.css`) :**

```css
.modal {
  position: fixed;        /* Fixed pour couvrir tout l'écran */
  top: 0;
  left: 0;
  background-color: rgba(26, 26, 26, 0.5); /* Fond semi-transparent */
  width: 100svw;
  height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1000;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2em;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 50%;
  height: 50%;
}
```

---

### Fonctionnement détaillé

#### Cycle de vie du composant Modal

```
┌─────────────────────────────────────────────────────────┐
│              CYCLE DE VIE DE LA MODAL                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. Clic sur "Afficher la modal"                       │
│          │                                              │
│          ▼                                              │
│   2. handleOpenModal() → setState({ showModal: true })  │
│          │                                              │
│          ▼                                              │
│   3. constructor() : création de la <div> portail       │
│      → document.createElement('div')                   │
│      → document.body.appendChild(div)                  │
│          │                                              │
│          ▼                                              │
│   4. render() : ReactDOM.createPortal(JSX, div)         │
│      → La modal s'affiche dans la <div> portail         │
│          │                                              │
│          ▼                                              │
│   5. Clic sur "Fermer" ou sur le fond                   │
│          │                                              │
│          ▼                                              │
│   6. handleCloseModal() → setState({ showModal: false })│
│          │                                              │
│          ▼                                              │
│   7. componentWillUnmount() : suppression de la <div>   │
│      → document.body.removeChild(div)                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Propagation des événements

La fermeture de la modal utilise la **propagation des événements** :

```jsx
{/* Clic sur le fond → ferme la modal */}
<div className="modal" onClick={this.props.close}>

  {/* Clic sur le contenu → NE ferme PAS la modal */}
  <div 
    className="modal-content"
    onClick={(e) => e.stopPropagation()} // Arrête la propagation
  >
    <button onClick={this.props.close}>Fermer</button>
  </div>

</div>
```

```
┌─────────────────────────────────────────────────────────┐
│              PROPAGATION DES ÉVÉNEMENTS                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Clic sur le FOND              Clic sur le CONTENU     │
│   ─────────────                 ────────────────────    │
│                                                         │
│   .modal (onClick=close)        .modal-content          │
│      │                          (stopPropagation)       │
│      ▼                                 │                │
│   close() déclenché             ✗ propagation stoppée   │
│   Modal fermée                  Modal reste ouverte     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Résultat dans le DOM

```html
<!-- Sans portail : Modal imbriquée dans #root -->
<body>
  <div id="root">
    <div class="App">
      <h1>React Modal</h1>
      <button>Afficher la modal</button>
      <div class="modal">...</div>  <!-- ❌ Imbriquée dans App -->
    </div>
  </div>
</body>

<!-- Avec portail : Modal au niveau du body -->
<body>
  <div id="root">
    <div class="App">
      <h1>React Modal</h1>
      <button>Afficher la modal</button>
    </div>
  </div>
  <div>
    <div class="modal">...</div>  <!-- ✅ Hors de #root -->
  </div>
</body>
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser `position: fixed` pour la modal | Utiliser `position: absolute` (dépend du parent) |
| Nettoyer le portail dans `componentWillUnmount()` | Laisser la `<div>` portail dans le DOM |
| Utiliser `stopPropagation()` sur le contenu | Laisser le clic se propager indésirablement |
| Gérer la fermeture via le fond ET un bouton | N'avoir qu'un seul moyen de fermer |
| Ajouter un `z-index` élevé à la modal | Ignorer les conflits de z-index |
| Gérer l'accessibilité (`aria-modal`, focus trap) | Ignorer l'accessibilité |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│              PORTAILS REACT - RÉSUMÉ                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Rend un composant hors de la hiérarchie DOM parente    │
│  tout en conservant le contexte React.                  │
│                                                         │
│  Syntaxe                                                │
│  ───────                                                │
│  ReactDOM.createPortal(jsx, container)                  │
│                                                         │
│  Cycle de vie                                           │
│  ────────────                                           │
│  constructor()        → createElement + appendChild     │
│  render()             → createPortal(JSX, container)    │
│  componentWillUnmount → removeChild (nettoyage)         │
│                                                         │
│  Cas d'utilisation                                      │
│  ─────────────────                                      │
│  • Modals / Dialogues                                   │
│  • Tooltips                                             │
│  • Notifications / Toasts                               │
│  • Menus déroulants                                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les Refs

### Qu'est-ce qu'une Ref ?

Une **ref** (référence) est un moyen d'accéder directement à un élément du DOM dans React,  
sans passer par `document.getElementById()` ou `document.querySelector()`.

```
┌─────────────────────────────────────────────────────────┐
│                      LES REFS                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ❌ Vanilla JS       ✅ React                           │
│   ──────────────      ──────────────                    │
│   document            React.createRef()                 │
│     .getElementById   → ref={this.maRef}                │
│     ('monId')         → this.maRef.current              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pourquoi éviter `document.getElementById()` dans React ?**

| Problème | Explication |
|----------|-------------|
| **DOM Virtuel** | React compare le DOM virtuel avec le DOM réel pour optimiser les mises à jour |
| **Conflits** | Manipuler le DOM directement peut entrer en conflit avec les mises à jour de React |
| **Performance** | React ne peut pas tracker les changements faits en dehors de son cycle de vie |
| **Cohérence** | Le state devient désynchronisé avec le DOM réel |

---

### Cas d'utilisation des Refs

| Cas | Description |
|-----|-------------|
| **Focus** | Mettre le focus sur un champ au montage |
| **Media** | Lire/pause une vidéo ou un audio |
| **Animations** | Déclencher des animations impératives |
| **Mesures** | Lire la largeur/hauteur d'un élément |
| **Intégrations** | Utiliser des librairies tierces (non-React) |

> ⚠️ Les refs ne doivent pas remplacer le state. Elles sont réservées aux **manipulations impératives** du DOM.

---

### Création d'une Ref dans un composant Class

#### 1. Déclarer la ref dans le `constructor()`

```jsx
constructor(props) {
  super(props);
  this.myRef = React.createRef();
}
```

#### 2. Attacher la ref à un élément JSX

```jsx
<h2 ref={this.myRef}>Titre</h2>
```

#### 3. Accéder à l'élément via `.current`

```jsx
this.myRef.current          // → l'élément DOM
this.myRef.current.style    // → les styles de l'élément
this.myRef.current.focus()  // → met le focus sur l'élément
```

---

### Exemple complet

```jsx
import React, { Component } from 'react'

class RefComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }

    // Déclaration des refs
    this.myTitle = React.createRef();
    this.myInput = React.createRef();
  }

  // Au montage : focus automatique sur l'input
  componentDidMount() {
    this.myInput.current.focus();
  }

  // À chaque mise à jour : change la couleur du titre
  componentDidUpdate() {
    this.myTitle.current.style.color = 'red';
  }

  render() {
    return (
      <div>
        {/* ref attachée au titre */}
        <h2 ref={this.myTitle}>
          Valeur : {this.state.value}
        </h2>

        {/* ref attachée à l'input */}
        <input 
          ref={this.myInput}
          type="text" 
          value={this.state.value} 
          onChange={e => this.setState({ value: e.target.value })} 
        />
      </div>
    )
  }
}

export default RefComponent
```

**Flux d'exécution :**

```
┌─────────────────────────────────────────────────────────┐
│                  CYCLE DE VIE DES REFS                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. constructor()                                      │
│      → React.createRef() : ref = { current: null }      │
│          │                                              │
│          ▼                                              │
│   2. render()                                           │
│      → ref={this.myInput} : attaché à l'élément JSX     │
│          │                                              │
│          ▼                                              │
│   3. componentDidMount()                                │
│      → ref.current = élément DOM réel                   │
│      → this.myInput.current.focus() ✅                  │
│          │                                              │
│          ▼                                              │
│   4. componentDidUpdate()                               │
│      → this.myTitle.current.style.color = 'red' ✅      │
│          │                                              │
│          ▼                                              │
│   5. componentWillUnmount()                             │
│      → ref.current = null (nettoyage automatique)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

> **À noter :**  
> - La ref est `null` **avant** le montage du composant.  
> - La ref pointe vers l'élément DOM **après** `componentDidMount()`.  
> - La ref est remise à `null` **après** `componentWillUnmount()`.

---

### Ref sur un composant Class enfant

Il est possible d'attacher une ref à un **composant Class** pour accéder à ses méthodes :

```jsx
class Input extends Component {
  focusInput() {
    this.inputRef.current.focus();
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    return <input ref={this.inputRef} type="text" />;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.inputComponent = React.createRef();
  }

  handleClick = () => {
    // Appel d'une méthode du composant enfant
    this.inputComponent.current.focusInput();
  }

  render() {
    return (
      <div>
        <Input ref={this.inputComponent} />
        <button onClick={this.handleClick}>Focus l'input</button>
      </div>
    );
  }
}
```

> ⚠️ Les refs **ne fonctionnent pas** directement sur les composants **fonction**.  
> Pour cela, il faut utiliser `forwardRef`.

---

### Tableau comparatif : Ref vs State

| Aspect | Ref | State |
|--------|-----|-------|
| **Accès** | `this.myRef.current` | `this.state.maValeur` |
| **Modification** | Directe (`current.style = ...`) | Via `setState()` |
| **Re-render** | ❌ Non | ✅ Oui |
| **Usage** | Manipulation DOM directe | Données réactives |
| **Recommandé pour** | Focus, animations, mesures | Affichage dynamique |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser les refs pour le focus, les animations | Remplacer le state par des refs |
| Accéder aux refs dans `componentDidMount()` | Accéder aux refs dans le `constructor()` (null) |
| Utiliser `forwardRef` pour les composants fonction | Attacher une ref à un composant fonction sans forwardRef |
| Nettoyer les refs dans `componentWillUnmount()` | Laisser des refs pointer vers des éléments démontés |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                    LES REFS REACT                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Déclaration                                            │
│  ────────────                                           │
│  constructor() {                                        │
│    this.maRef = React.createRef();                      │
│  }                                                      │
│                                                         │
│  Attachement                                            │
│  ────────────                                           │
│  <input ref={this.maRef} />                             │
│                                                         │
│  Utilisation                                            │
│  ────────────                                           │
│  this.maRef.current           → élément DOM             │
│  this.maRef.current.focus()   → focus                   │
│  this.maRef.current.style.x   → style                   │
│  this.maRef.current.value     → valeur                  │
│                                                         │
│  Cycle de vie                                           │
│  ────────────                                           │
│  Avant montage  → current = null                        │
│  Après montage  → current = élément DOM                 │
│  Après démontage → current = null                       │
│                                                         │
│  ⚠️  Composant fonction → utiliser forwardRef           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## ForwardRef

### Qu'est-ce que forwardRef ?

`forwardRef` est une fonction React qui permet de **transmettre une ref d'un composant parent à un élément DOM à l'intérieur d'un composant enfant**.

Sans `forwardRef`, une ref attachée à un composant fonction pointe vers `null`, car les composants fonction n'ont pas d'instance.

```
┌─────────────────────────────────────────────────────────┐
│                     FORWARDREF                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   PARENT                    ENFANT (forwardRef)         │
│   ──────                    ───────────────────         │
│                                                         │
│   this.maRef ──────────────► ref={ref}                  │
│   (createRef)                    │                      │
│                                  ▼                      │
│                             <input ref={ref} />         │
│                             (élément DOM ciblé)         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Pourquoi forwardRef est nécessaire ?**

| Composant | Ref directe | forwardRef |
|-----------|-------------|------------|
| Composant Class | ✅ Fonctionne (instance de classe) | Non nécessaire |
| Composant Fonction | ❌ Pointe vers `null` | ✅ Obligatoire |

---

### Syntaxe de base

#### Composant enfant (fonction)

```jsx
import { forwardRef } from 'react';

const MyRef = forwardRef((props, ref) => {
  return (
    <div>
      <input ref={ref} type="text" />
    </div>
  );
});

export default MyRef;
```

> **À noter :**  
> - `forwardRef` reçoit une fonction avec **deux paramètres** : `props` et `ref`.  
> - La `ref` est transmise à l'élément DOM via l'attribut `ref={ref}`.  
> - Les `props` fonctionnent normalement (passage de données du parent vers l'enfant).

#### Composant parent (classe)

```jsx
import React, { Component } from 'react';
import MyRef from './components/MyRef.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    // Création de la ref dans le parent
    this.refComp = React.createRef();
  }

  handleClick = () => {
    console.log(this.refComp.current); // → <input> du composant enfant
    this.refComp.current.focus();      // → focus sur l'input de l'enfant
  }

  render() {
    return (
      <div className="container">
        <h1>React Refs</h1>
        {/* La ref est transmise au composant enfant via forwardRef */}
        <MyRef ref={this.refComp} name="Toto" />
        <button onClick={this.handleClick}>Focus l'input</button>
      </div>
    );
  }
}

export default App;
```

---

### Flux de données

```
┌─────────────────────────────────────────────────────────┐
│               FLUX FORWARDREF                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. Parent crée la ref                                 │
│      → this.refComp = React.createRef()                 │
│          │                                              │
│          ▼                                              │
│   2. Parent passe la ref au composant enfant            │
│      → <MyRef ref={this.refComp} />                     │
│          │                                              │
│          ▼                                              │
│   3. forwardRef intercepte la ref                       │
│      → forwardRef((props, ref) => ...)                  │
│          │                                              │
│          ▼                                              │
│   4. La ref est attachée à l'élément DOM cible          │
│      → <input ref={ref} />                              │
│          │                                              │
│          ▼                                              │
│   5. Parent accède à l'élément DOM de l'enfant          │
│      → this.refComp.current → <input>                   │
│      → this.refComp.current.focus()                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Exemple complet avec props

`forwardRef` n'empêche pas l'utilisation des props classiques :

```jsx
import { forwardRef } from 'react';

const CustomInput = forwardRef(({ name, placeholder, type = 'text' }, ref) => {
  console.log(name); // Les props fonctionnent normalement

  return (
    <div className="input-wrapper">
      <label>{name}</label>
      <input 
        ref={ref}           // La ref est transmise à l'élément DOM
        type={type} 
        placeholder={placeholder}
      />
    </div>
  );
});

export default CustomInput;
```

**Utilisation dans le parent :**

```jsx
import React, { Component } from 'react';
import CustomInput from './components/CustomInput.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  handleFocus = () => {
    this.inputRef.current.focus();
    this.inputRef.current.style.borderColor = 'blue';
  }

  handleReset = () => {
    this.inputRef.current.value = '';
    this.inputRef.current.focus();
  }

  render() {
    return (
      <div>
        <h1>ForwardRef Demo</h1>
        <CustomInput 
          ref={this.inputRef}
          name="Nom d'utilisateur"
          placeholder="Entrez votre nom"
          type="text"
        />
        <button onClick={this.handleFocus}>Focus</button>
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}

export default App;
```

---

### Différence entre Ref, forwardRef et createRef

| Concept | Usage | Composant |
|---------|-------|-----------|
| `React.createRef()` | Crée une ref dans le parent | Class |
| `ref={...}` | Attache la ref à un élément | Class ou Fonction |
| `forwardRef` | Transmet la ref d'un parent vers un élément DOM dans un composant fonction enfant | Fonction uniquement |

```jsx
// ❌ Sans forwardRef : ref pointe vers null sur un composant fonction
const Input = (props) => <input type="text" />;
// <Input ref={this.myRef} /> → this.myRef.current = null

// ✅ Avec forwardRef : ref pointe vers l'élément <input>
const Input = forwardRef((props, ref) => <input ref={ref} type="text" />);
// <Input ref={this.myRef} /> → this.myRef.current = <input>
```

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Utiliser `forwardRef` pour exposer un élément DOM d'un composant fonction | Attacher une ref directement à un composant fonction sans `forwardRef` |
| Nommer le composant forwardRef (évite les warnings Fast Refresh) | Exporter un composant anonyme |
| Documenter quelle ref est exposée | Exposer l'intégralité du composant via la ref |
| Combiner avec `useImperativeHandle` pour contrôler ce qui est exposé | Exposer trop de détails internes |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│                  FORWARDREF REACT                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Permet de transmettre une ref d'un parent vers         │
│  un élément DOM dans un composant fonction enfant.      │
│                                                         │
│  Composant enfant                                       │
│  ────────────────                                       │
│  import { forwardRef } from 'react';                    │
│                                                         │
│  const MyComp = forwardRef((props, ref) => (            │
│    <input ref={ref} />                                  │
│  ));                                                    │
│                                                         │
│  Composant parent                                       │
│  ─────────────────                                      │
│  this.maRef = React.createRef();                        │
│  <MyComp ref={this.maRef} />                            │
│  this.maRef.current.focus(); // → élément DOM enfant    │
│                                                         │
│  ⚠️  Uniquement pour les composants fonction            │
│  ✅  Les composants Class n'en ont pas besoin           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les composants d'ordre supérieur (HOC)

### Qu'est-ce qu'un HOC ?

Un **Higher Order Component** (HOC) est une fonction qui :
- **Accepte** un composant en paramètre
- **Retourne** un nouveau composant enrichi

```
┌─────────────────────────────────────────────────────────┐
│              HIGHER ORDER COMPONENT (HOC)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Composant original                                    │
│         │                                               │
│         ▼                                               │
│   ┌─────────────────┐                                   │
│   │      HOC        │  ← Ajoute de la logique           │
│   │  (fonction)     │     (state, méthodes, props)      │
│   └─────────────────┘                                   │
│         │                                               │
│         ▼                                               │
│   Nouveau composant enrichi                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Principe de base :**

```jsx
const NouveauComposant = HOC(ComposantOriginal);
```

**Analogie :** Un HOC est comme un "moule" qui enveloppe un composant pour lui ajouter des fonctionnalités supplémentaires, sans modifier le composant original.

---

### Syntaxe de base

```jsx
import { Component } from 'react';

// HOC : fonction qui reçoit un composant et retourne un nouveau composant
const monHOC = (WrappedComponent) => {
  return class MonHOC extends Component {
    state = {
      // State supplémentaire
    }

    maMethode = () => {
      // Logique partagée
    }

    render() {
      return (
        // Composant original enrichi avec les nouvelles props
        <WrappedComponent
          {...this.props}          // Passage des props originales
          maMethode={this.maMethode}  // Nouvelles props injectées
          hocState={this.state}    // State du HOC
        />
      );
    }
  };
};

export default monHOC;
```

> **À noter :**  
> - `{...this.props}` : le spread operator permet de passer toutes les props originales au composant wrappé.  
> - Le composant HOC retourné doit être **nommé** (évite les warnings Fast Refresh).

---

### Exemple complet : Compteur de hits

#### Création du HOC (`CountHits.jsx`)

```jsx
import { Component } from 'react';

// HOC qui reçoit un composant et une fonction génératrice de hits
const countHits = (WrappedComponent, hitGenerator) => {

  return class CountHits extends Component {
    state = {
      hits: 0,
      lastHit: 0
    }

    addHit = () => {
      const newHit = hitGenerator(); // Appel de la fonction génératrice
      this.setState({ 
        hits: this.state.hits + 1, 
        lastHit: newHit 
      });
    }

    render() {
      return (
        <WrappedComponent 
          addOneHit={this.addHit}   // Méthode injectée
          hocState={this.state}     // State injecté
          {...this.props}           // Props originales passées
        />
      );
    }
  };
};

export default countHits;
```

#### Composants wrappés (`Vegeta.jsx` et `Goku.jsx`)

```jsx
// Vegeta.jsx
import { Component } from 'react';
import vegeta from '../assets/vegeta.png';
import countHits from './CountHits';

class Vegeta extends Component {
  render() {
    const { hocState, addOneHit } = this.props;

    return (
      <div className="col p-5">
        <img 
          src={vegeta} 
          alt="Vegeta" 
          width="200"
          onClick={addOneHit}
          style={{ cursor: 'pointer' }}
        />
        <p>Nombre de hits : {hocState.hits}</p>
        <p>Dernier hit : {hocState.lastHit}</p>
      </div>
    );
  }
}

// Application du HOC avec une fonction génératrice de hits entre 5 et 15
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const VegetaWithCountHits = countHits(Vegeta, () => randBetween(5, 15));

export default VegetaWithCountHits;
```

```jsx
// Goku.jsx
import { Component } from 'react';
import goku from '../assets/goku.png';
import countHits from './CountHits';

class Goku extends Component {
  render() {
    const { hocState, addOneHit } = this.props;

    return (
      <div className="col p-5">
        <img 
          src={goku} 
          alt="Goku" 
          width="200"
          onClick={addOneHit}
          style={{ cursor: 'pointer' }}
        />
        <p>Nombre de hits : {hocState.hits}</p>
        <p>Dernier hit : {hocState.lastHit}</p>
      </div>
    );
  }
}

// Application du HOC avec une fonction génératrice de hits entre 7 et 17
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const GokuWithCountHits = countHits(Goku, () => randBetween(7, 17));

export default GokuWithCountHits;
```

#### Utilisation dans App

```jsx
import Vegeta from './components/Vegeta';
import Goku from './components/Goku';

const App = () => {
  return (
    <div className="row">
      <Vegeta />
      <Goku />
    </div>
  );
};

export default App;
```

**Flux de données :**

```
┌─────────────────────────────────────────────────────────┐
│                    FLUX DU HOC                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   1. countHits(Vegeta, hitGenerator)                    │
│      → Retourne un nouveau composant CountHits          │
│          │                                              │
│          ▼                                              │
│   2. CountHits gère :                                   │
│      → state : { hits: 0, lastHit: 0 }                 │
│      → méthode : addHit()                               │
│          │                                              │
│          ▼                                              │
│   3. CountHits render() :                               │
│      → <Vegeta                                          │
│           addOneHit={this.addHit}                       │
│           hocState={this.state}                         │
│           {...this.props}                               │
│        />                                               │
│          │                                              │
│          ▼                                              │
│   4. Vegeta reçoit addOneHit et hocState                │
│      → Affiche les hits                                 │
│      → Déclenche addHit au clic                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Avantages des HOC

| Avantage | Description |
|----------|-------------|
| **Réutilisabilité** | La logique est écrite une seule fois et partagée |
| **Séparation des responsabilités** | Le composant gère l'affichage, le HOC gère la logique |
| **Composition** | On peut combiner plusieurs HOC |
| **Non-invasif** | Le composant original n'est pas modifié |

**Exemple de composition de HOC :**

```jsx
// Combinaison de plusieurs HOC
const EnhancedComponent = withLogger(withAuth(withData(MyComponent)));
```

---

### Passer des props supplémentaires

On peut passer des paramètres supplémentaires au HOC :

```jsx
// HOC avec paramètre supplémentaire
const withColor = (WrappedComponent, color) => {
  return class WithColor extends Component {
    render() {
      return (
        <WrappedComponent 
          {...this.props}
          color={color}
        />
      );
    }
  };
};

// Utilisation
const RedButton = withColor(Button, 'red');
const BlueButton = withColor(Button, 'blue');
```

---

### HOC vs Custom Hooks

Avec l'arrivée des Hooks (React 16.8+), la plupart des cas d'usage des HOC peuvent être remplacés par des **Custom Hooks** :

| Aspect | HOC | Custom Hook |
|--------|-----|-------------|
| **Type de composant** | Composant classe | Composant fonction |
| **Syntaxe** | `export default monHOC(Comp)` | `const { data } = useMonHook()` |
| **Lisibilité** | Wrapper supplémentaire | Directement dans le composant |
| **Composition** | HOC imbriqués | Appels de hooks |
| **Debug** | Plus complexe (wrapper hell) | Plus simple |

```jsx
// ❌ Approche HOC (ancienne)
export default countHits(Vegeta, () => randBetween(5, 15));

// ✅ Approche Custom Hook (moderne)
const { hits, lastHit, addHit } = useCountHits(() => randBetween(5, 15));
```

> 💡 Les HOC restent utiles pour les **composants classe** ou quand on souhaite injecter des props sans modifier le composant original.

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Nommer le composant retourné par le HOC | Retourner un composant anonyme |
| Passer les props originales avec `{...this.props}` | Oublier de passer les props originales |
| Utiliser les Custom Hooks pour les composants fonction | Créer des HOC pour tout |
| Nommer les HOC avec le préfixe `with` (`withAuth`, `withLogger`) | Utiliser des noms génériques |
| Documenter les props injectées | Laisser les props implicites |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│              HIGHER ORDER COMPONENT (HOC)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Fonction qui reçoit un composant et retourne           │
│  un nouveau composant enrichi.                          │
│                                                         │
│  Syntaxe                                                │
│  ───────                                                │
│  const monHOC = (WrappedComponent) => {                 │
│    return class MonHOC extends Component {              │
│      render() {                                         │
│        return <WrappedComponent {...this.props} />;     │
│      }                                                  │
│    };                                                   │
│  };                                                     │
│                                                         │
│  Utilisation                                            │
│  ──────────                                             │
│  const NouveauComp = monHOC(ComposantOriginal);         │
│  export default NouveauComp;                            │
│                                                         │
│  Cas d'usage                                            │
│  ──────────                                             │
│  • Logique partagée entre plusieurs composants          │
│  • Authentification, logging, gestion d'erreurs         │
│  • Composants classe (sinon, préférer Custom Hooks)     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
## La Gestion des Erreurs dans React

### Introduction

En React, une erreur JavaScript dans un composant peut faire planter **toute l'application**.  
Pour éviter cela, React 16 a introduit le concept de **Error Boundaries** (Périmètres d'erreurs).

```
┌─────────────────────────────────────────────────────────┐
│              GESTION DES ERREURS REACT                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Sans Error Boundary        Avec Error Boundary        │
│   ────────────────────       ─────────────────────      │
│                                                         │
│   ┌─────────────────┐        ┌─────────────────┐        │
│   │      App        │        │  ErrorBoundary  │        │
│   │  ┌───────────┐  │        │  ┌───────────┐  │        │
│   │  │ Composant │  │        │  │ Composant │  │        │
│   │  │  💥 Error │  │        │  │  💥 Error │  │        │
│   │  └───────────┘  │        │  └───────────┘  │        │
│   └─────────────────┘        │  ┌───────────┐  │        │
│          │                   │  │  UI repli │  │        │
│          ▼                   │  └───────────┘  │        │
│   App entière plantée        └─────────────────┘        │
│                                    │                    │
│                                    ▼                    │
│                              Reste de l'app OK          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

> Selon la [documentation React](https://fr.legacy.reactjs.org/docs/error-boundaries.html) :  
> *"Une erreur JavaScript au sein d'une partie de l'interface utilisateur (UI) ne devrait pas casser l'ensemble de l'application."*

---

### Qu'est-ce qu'un Error Boundary ?

Un **Error Boundary** est un composant React (obligatoirement une **classe**) qui :
- **Intercepte** les erreurs JavaScript dans son arbre de composants enfants
- **Enregistre** ces erreurs
- **Affiche** une UI de repli à la place du composant qui a planté

| Ce qu'il intercepte | Ce qu'il n'intercepte PAS |
|---------------------|--------------------------|
| Erreurs lors du rendu | Gestionnaires d'événements (`onClick`, etc.) |
| Erreurs dans les méthodes de cycle de vie | Code asynchrone (`setTimeout`, `fetch`) |
| Erreurs dans les constructeurs enfants | Erreurs dans le composant Error Boundary lui-même |
| | Erreurs côté serveur (SSR) |

> ⚠️ Un Error Boundary doit obligatoirement être un **composant de classe**.  
> Il n'existe pas d'équivalent Hook natif (on peut utiliser des librairies comme `react-error-boundary`).

---

### Les deux méthodes clés

Un composant devient un Error Boundary s'il implémente **au moins une** de ces méthodes :

| Méthode | Rôle | Moment d'exécution |
|---------|------|--------------------|
| `static getDerivedStateFromError(error)` | Mettre à jour le state pour afficher l'UI de repli | Lors du rendu (phase de rendu) |
| `componentDidCatch(error, info)` | Logger l'erreur dans un service de reporting | Après le rendu (phase de commit) |

---

### `static getDerivedStateFromError()`

Cette méthode **statique** est appelée lorsqu'une erreur est levée dans un composant enfant.  
Elle doit retourner un objet pour mettre à jour le state.

```jsx
static getDerivedStateFromError(error) {
  // Appelée lors d'une erreur dans un enfant
  // Retourne le nouvel état pour afficher l'UI de repli
  return { hasError: true };
}
```

> **À noter :** C'est une méthode **statique**, elle ne peut donc pas accéder à `this`.

---

### `componentDidCatch()`

Cette méthode est appelée après qu'une erreur a été levée dans un composant enfant.  
Elle est utilisée pour **enregistrer l'erreur** dans un service de logging.

```jsx
componentDidCatch(error, info) {
  // error : l'erreur JavaScript levée
  // info : objet avec componentStack (trace de la pile de composants)
  console.error("Erreur capturée :", error);
  console.error("Composant en cause :", info.componentStack);
  
  // Envoi vers un service de logging (ex: Sentry)
  // logErrorToService(error, info);
}
```

| Paramètre | Description |
|-----------|-------------|
| `error` | L'erreur JavaScript levée |
| `info` | Objet contenant `componentStack` (trace des composants) |

---

### Exemple complet : ErrorBoundary

#### Composant ErrorBoundary (`ErrorBoundary.jsx`)

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
    };
  }

  // Appelée lors du rendu : met à jour le state pour afficher l'UI de repli
  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error,
    };
  }

  // Appelée après le rendu : pour logger l'erreur
  componentDidCatch(error, info) {
    console.error("Erreur capturée par ErrorBoundary :", error);
    console.error("Composant en cause :", info.componentStack);
    // logErrorToService(error, info); // Envoi vers Sentry, etc.
  }

  render() {
    if (this.state.hasError) {
      // UI de repli personnalisée
      return (
        <div className="col p-5 text-white bg-danger">
          <div 
            style={{ height: "200px", width: "auto" }}
            className="d-flex justify-content-center align-items-center overflow-hidden"
          >
            <p>💥 Houston, we have a problem !</p>
          </div>
        </div>
      );
    }

    // Affichage normal des enfants si pas d'erreur
    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Utilisation dans App (`App.jsx`)

```jsx
import ErrorBoundary from './components/ErrorBoundary';
import Frieza from './components/Frieza';
import Vegeta from './components/Vegeta';
import Goku from './components/Goku';

const App = () => {
  return (
    <div className="row">
      {/* Chaque personnage est isolé dans son propre ErrorBoundary */}
      <ErrorBoundary>
        <Frieza />
      </ErrorBoundary>
      <ErrorBoundary>
        <Vegeta />
      </ErrorBoundary>
      <ErrorBoundary>
        <Goku />
      </ErrorBoundary>
    </div>
  );
};

export default App;
```

**Si `Frieza` plante :**

```
┌─────────────────────────────────────────────────────────┐
│                   ISOLATION DES ERREURS                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │ErrorBoundary │  │ErrorBoundary │  │ErrorBoundary │  │
│   │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │  │
│   │  │ Frieza │  │  │  │ Vegeta │  │  │  │  Goku  │  │  │
│   │  │  💥    │  │  │  │   ✅   │  │  │  │   ✅   │  │  │
│   │  └────────┘  │  │  └────────┘  │  │  └────────┘  │  │
│   │  ┌────────┐  │  └──────────────┘  └──────────────┘  │
│   │  │UI repli│  │                                      │
│   │  └────────┘  │                                      │
│   └──────────────┘                                      │
│                                                         │
│   Frieza planté → UI repli   Vegeta et Goku OK ✅       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Composant qui peut planter (`Frieza.jsx`)

```jsx
import { Component } from 'react';
import HandleClicks from './HandleClicks';

class Frieza extends Component {
  render() {
    const { backGround, clickHandler } = this.props;

    // Simulation d'une erreur si bg est 'bg-danger'
    if (backGround === 'bg-danger') {
      throw new Error('Frieza has been defeated !');
    }

    return (
      <div className={`col p-5 ${backGround}`}>
        <div 
          style={{ height: "200px", width: "auto" }}
          className="d-flex justify-content-center align-items-start overflow-hidden"
          onClick={clickHandler}
        >
          <img src={frieza} alt="Frieza" width="200" />
        </div>
      </div>
    );
  }
}

const FriezaWithHandleClicks = HandleClicks(Frieza);
export default FriezaWithHandleClicks;
```

---

### Granularité des Error Boundaries

On peut placer les Error Boundaries à différents niveaux selon le besoin :

```jsx
// Niveau 1 : Protection globale de l'app
<ErrorBoundary fallback={<PageErreur />}>
  <App />
</ErrorBoundary>

// Niveau 2 : Protection d'une section
<ErrorBoundary fallback={<SectionErreur />}>
  <Sidebar />
</ErrorBoundary>

// Niveau 3 : Protection d'un composant individuel
<ErrorBoundary fallback={<WidgetErreur />}>
  <Widget />
</ErrorBoundary>
```

| Niveau | Avantage | Inconvénient |
|--------|----------|--------------|
| Global | Simple | Toute l'app affiche l'UI de repli |
| Section | Équilibré | Configuration intermédiaire |
| Composant | Isolation maximale | Beaucoup de Error Boundaries |

---

### Bonnes pratiques

| ✅ Faire | ❌ Ne pas faire |
|---------|----------------|
| Envelopper les composants susceptibles de planter | Placer un seul ErrorBoundary à la racine |
| Personnaliser l'UI de repli | Afficher un message d'erreur technique à l'utilisateur |
| Logger les erreurs dans `componentDidCatch()` | Ignorer les erreurs silencieusement |
| Isoler les sections critiques avec des ErrorBoundary séparés | Partager un ErrorBoundary pour des composants non liés |
| Utiliser un service de monitoring (Sentry, etc.) | Se contenter de `console.error` en production |

---

### Récapitulatif

```
┌─────────────────────────────────────────────────────────┐
│           GESTION DES ERREURS REACT                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Définition                                             │
│  ──────────                                             │
│  Composant classe qui intercepte les erreurs            │
│  dans son arbre d'enfants et affiche une UI de repli.   │
│                                                         │
│  Méthodes                                               │
│  ────────                                               │
│  getDerivedStateFromError(error)                        │
│  → Met à jour le state pour afficher l'UI de repli      │
│                                                         │
│  componentDidCatch(error, info)                         │
│  → Logger l'erreur dans un service de reporting         │
│                                                         │
│  Structure                                              │
│  ─────────                                              │
│  <ErrorBoundary>                                        │
│    <ComposantSusceptibleDePlanter />                    │
│  </ErrorBoundary>                                       │
│                                                         │
│  ⚠️  Obligatoirement un composant de classe             │
│  ⚠️  N'intercepte pas les erreurs dans les events       │
│  ⚠️  N'intercepte pas le code asynchrone                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Les Props de rendu

D'après la [doc](https://fr.legacy.reactjs.org/docs/render-props.html), Le terme « prop de rendu » (render prop, NdT) fait référence à une technique qui consiste à partager du code entre des composants React en utilisant une prop dont la valeur est une fonction.

Les props de rendu permettent d'éviter de répéter du code d'un composant à un autre