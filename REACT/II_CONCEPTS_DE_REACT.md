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

Rappel : au sein d'un composant, le return renvoit du JSX.  

Pour fonctionner, les éléments qui sont dans le jsx doivent tous être enveloppés par une balise (souvent une div).  
Parfois, lorsqu'on invoque un composant, l'élément parent de ce composant étant une div, cette div deviendra l'enfant d'une autre élément.  
Cela peut se produire sur des balises html telle que des listes (ul>li), ou des tableaux (tr>td).  
Une div qui se glisse au milieu de ces éléments n'empêche pas le code de fonctionner, mais elle va provoquer des problèmes de syntaxe qui ne passent pas au W3C validator.

Pour éviter des divs intempestives et régler cette problématique, React propose le Fragment JSX : `<>...</>`.  

Le fragment va avoir pour effet de supprimer la div dans la compilation du code.

NB: le fragment peut s'importer : `import { Fragment } from 'react'`  
et être utilisé de cette manière : 
```JS
<Fragment>
  ...
</Fragment>
```
Cette syntaxe n'est pas nécessaire et on va privilégier `<>...</>`.

ATTENTION : si on doit utiliser la propriété `key={index}`, on devra obligatoirement utiliser `Fragment`. 

## Approfondir avec le destructuring

Le destructuring permet un affichage plus concis et plus "propre".

### Le destructuring avec un tableau

```JS
const array = ["riri", "fifi", "loulou"];
console.log(array); // output : ["riri", "fifi", "loulou"]

const userOne = array[0];
const userTwo = array[1];
const userThree = array[2];
console.log(userOne, userTwo, userThree); // ouput : riri fifi loulou

const [userOne, userTwo, userThree] = array;
console.log(userOne, userTwo, userThree); // ouput : riri fifi loulou
```
`const [userOne, userTwo, userThree] = array` permet d'assigner à chaque donnée du tableau une variable :  
_userOne_ pour riri, _userTwo_ pour fifi, et _userThree_ pour loulou.  

Cette syntaxe équivaut à : `const [userOne, userTwo, userThree] = ["riri", "fifi", "loulou"];`

Imaginons maintenant que l'on ne souhaite afficher qu'une seule variable, on pourrait utiliser le `spread operator` de cette manière :  
```JS
const [userOne, ...rest] = array;
console.log(rest); // output : ["fifi", "loulou"]
```

### Le destructuring avec un objet

```JS
const members = {
  userOne: "riri",
  userTwo: "fifi",
  userThree: "loulou"
}
console.log(members); // output : {userOne: "riri", userTwo: "fifi", userThree: "loulou"}

const memberOne = members.userOne;
const memberTwo = members.userTwo;
const memberThree = members.userThree;
console.log(userOne, userTwo, userThree); // ouput : riri fifi loulou

const {userOne, userTwo, userThree} = members;
console.log(userOne, userTwo, userThree); // ouput : riri fifi loulou
```
En utilisant le spread operator, voici ce qu'il se passerait : 
```JS
const {userOne, ...rest} = array;
console.log(rest); // output : {userTwo: "fifi", userThree: "loulou"}
```

Si on souhaite associer une autre `key` aux éléments de l'objet, on va procéder ainsi : 
```JS
const members = {
  userOne: "riri",
  userTwo: "fifi",
  userThree: "loulou"
}

const {userOne: hulk, userTwo: spiderMan, userThree: superMan} = members;
consolelog(hulk, spiderMan, superMan); // ouput : riri fifi loulou
```

### Le destructuring dans React

Le destructuring est très utile pour récupérer des variables passées en props d'un composant à un autre.   
Composant Display :
```JS
import { Component } from 'react';

import SingerFunction from './SingerFunction';
import SingerClass from './SingerClass';

class Display extends Component {
  render() {
    return (
      <div className='flex column items-center justify-center gap-10'>
        <h2>Chanteurs</h2>
        <div className="flex gap-20">
          <SingerFunction name="Eric Clapton" age="74" />
          <SingerFunction name="Jimi Hendrix" age="27" />
          <SingerClass name="David Gilmor" age="73" />
          <SingerClass name="Carlos Santana" age="71" />
        </div>
      </div>
    )
  } 
};

export default Display;
```
Composant SingerFunction : 
```JS
const SingerFunction = (props) => {
  const { name, age } = props;
  
  return (
    <div className="flex column items-center justify-center gap-10 bordered p-10">
      <h2>Chanteur :</h2>
      <p>Nom : {name}</p>
      <p>Age : {age} ans</p>
    </div>
  );
};

export default Singer;
```

Il est également possible de destructurer directement au niveau des paramètres de la fonction : 
```JS
const SingerFunction = ({ name, age }) => {
  return (
    <div className="flex column items-center justify-center gap-10 bordered p-10">
      <h2>Chanteur :</h2>
      <p>Nom : {name}</p>
      <p>Age : {age} ans</p>
    </div>
  );
};

export default Singer;
```
Le code est ainsi plus concis et plus clair.

**N.B. : Ceci fonctionne bien avec les composants de type fonction.**

Avec un composant de type class, Cela va se passer différemment, il faudra impérativement utiliser le destructuring dans la méthode `render()` en accédant aux propriétés via `this.props` :  
Composant SingerClass :
```JS
import { Component } from 'react';

class SingerClass extends Component {
  render() {
    const { name, age } = this.props;
    return (
      <div className='flex column items-center justify-center gap-10 bordered p-10'>
        <h3>Chanteur :</h3>
        <p>Nom : {name}</p>
        <p>Age : {age} ans</p>
      </div>
    )
  }
}

export default SingerClass;
```

## Les conditions dans React

Les conditions dans React sont les mêmes que dans JavaScript.  
Les exemples suivant montrent quelques cas de figure intéressants.  

* `if ... else ...` :
```JS
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    if (this.state.winner) {  
      return (
        <div className="flex column align-center gap-10 bordered p-20 m-20">
          <h2>Game Component</h2>
          <p>Bravo {this.state.name}</p>
        </div>
      );
    } else {
      return (
        <div className="flex column align-center gap-10 bordered p-20 m-20">
          <h2>Game Component</h2>
          <p>Dommage {this.state.name}</p>
        </div>
      );
    }
  }
}

export default Game;
```
Cette syntaxe n'est pas très pratique, et est lourde.  
Avec un `if ... else ...`, il n'est pas possible d'afficher directement une condition dans le JSX.  

```JS
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    let result;
    if (this.state.winner) {
      result = <p>Bravo {this.state.name}</p>;
    } else {
      result = <p>Dommage {this.state.name}</p>;
    }

    return (
      <div className="flex column align-center gap-10 bordered p-20 m-20">
        <h2>Game Component</h2>
        {result}
      </div>
    );
  }
}

export default Game;
```

Afin d'éviter la lourdeur de la syntaxe `if ... else ...`, on va utiliser les opérateurs ternaires : `condition ? result if condition true : result if condition  false`
```JS
import { Component } from 'react';

class Game extends Component {
  state = {
    name: 'Link',
    winner: true,
  }

  render() {
    return (
      <div className="flex column align-center gap-10 bordered p-20 m-20">
        <h2>Game Component</h2>
        <p>
          {this.state.winner 
            ? `Bravo ${this.state.name}` 
            : `Dommage ${this.state.name}`}
        </p>
      </div>
    )
  }
}

export default Game;
```

Si on ne souhaite rien retourner si la condition n'est pas remplie, on peut utiliser l'opérateur `&&` :  
`condition && result if condition true` équivaut à `condition ? result if condition true : result if condition false`  
result if condition false sera `null`.

## Les images et les formulaires dans React

### Les images

* Pour afficher une image PNG, on va créer un composant qui va contenir la balise `<img />`. src va contenir le nom de l'image qu'on aura importée au préalable : 
```JS
import romain from '../assets/Romain.png'

const Romain = () => {
  return <img src={romain} alt="" />
};

export default Romain;
```
* Pour une image svg, on va procéder un peu différemment.  
On va créer un composant et copier les balises qui définissent le svg.  
On va ainsi pouvoir modifier certaines données comme la `height`, `width`, et la couleur avec `fill` via les props.  
On peut également ajouter une propriété `className` : 
```JS
const IconCircleUser = ({width, height, color, className}) => {
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
  )
}

export default IconCircleUser;
```
### Les formulaires

Le formulaire permet à l'utilisateur d'interragir avec le DOM, pour éventuellement modifier certains éléments :

```JS
import { Component } from 'react';

import Romain from './Romain';
import IconCircleUser from './IconCircleUser';

class Form extends Component {

  state = {
    username: '',
    color: '',
    colors: ['', 'green', 'blue', 'red', 'yellow', 'black', 'white'],
    comment: '',
  }

  handlePseudo = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  handleColor = (e) => {
    this.setState({
      color: e.target.value
    })
  }

  handleComments = (e) => {
    this.setState({
      comment: e.target.value
    })
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    alert(`Pseudo : ${this.state.username} \nCommentaire : ${this.state.comment}`);
  }

  render() {
    return (
      <div className="flex column justify-center items-center gap-10 bordered p-20 m-10">
        <div className="flex column gap-10">
          <Romain />
        </div>
        <h2>User</h2>
        <div className="flex gap-20 items-start">
          <IconCircleUser width="100" height="100" color={this.state.color} />
          <p className='flex column gap-10'>
            <span>
              utilisateur : 
            </span>
            <span>
              {this.state.username}
            </span>
          </p>
          <p className='flex column gap-10'>
            <span>
              Commentaire : 
            </span>
            <span>
              {this.state.comment}
            </span>
          </p>
        </div>
        <form className="flex gap-20" onSubmuit={this.handleSubmitForm}>
          <div className="flex column items-start gap-5 m-20">
            <label>Pseudo</label>
            <input type="text" value={this.state.username} onChange={this.handlePseudo} />
          </div>
          <div className="flex column items-start gap-5 m-20">
            <label>Couleur</label>
            <select onChange={this.handleColor}>
              {this.state.colors.map((color, index) => (
                <option key={index} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div className="flex column items-start gap-5 m-20">
            <label>Message</label>
            <textarea onChange={this.handleComments}></textarea>
          </div>
          <button>Valider</button>
        </form>
      </div>
    )
  }
}

export default Form;
```
* `onChange` appelle les fonctions qui gèrent les changements d'états des variables.

* `e.preventDefault()` est une méthode qui interdit le rechargement de la page  
et évite ainsi de perdre les données après un clic par exemple.

## Intégrer du CSS dans React

### Inline CSS

Pour déclarer du CSS inline, on va se servir de la balise `style` qui est directement intégrée dans la balise html.  

En html classique, cela ressemble à :  
`<p style="font-size: 24px; color: red">paragraphe</p>`

En JSX, on va utiliser les accolades et y intégrer un objet :  
`<p style={{fontSize: '24px', color: 'red'}}>paragraphe</p>`

Étant donné qu'il s'agit d'un objet, on peut l'intégrer à une variable :  
```JSX
import './App.css'

import Form from './components/Form'

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
Bien entendu, il n'est pas du tout recommandé de procéder de cette manière pour intégrer le CSS.  
On va plutôt utiliser une feuille de style : un fichier `.css`.

### Externale style sheet + Modules

On va donc créer un fichier `styles.css`.
style.css
```CSS
.blue {
  color: blue;
}

.red {
  color: red;
}
```
On va ensuite importer le fichier dans notre fichier JSX,
et on va utiliser la propriété `className` directement dans les balises html du JSX :  
```JS
import './App.css'
import './styles.css'

import Form from './components/Form'

function App() {
  return (
    <>
      <h1 className="blue">Hello World !</h1>
      <p className="red">paragraphe</p>
      <Form />
    </>
  )
}

export default App
```
Il est possible de gérer la CSS depuis l'élément parent via les props : 
```JS
import './App.css'
import './styles.css'

import Form from './components/Form'

function App() {
  const paragrapheStyle = {
    fontSize: '20px',
    color: 'red',
  }

  return (
    <>
      <h1 style={{fontSize: '50px', color: 'blue'}}>Hello World !</h1>
      <p style={paragrapheStyle}>paragraphe</p>
      <p className="blue">paragraphe</p>
      <Form head={true} />
    </>
  )
}

export default App
```
composant : 
```JS
import { Component } from "react";

class Form extends Component {
  render() {

    const myClass = this.props.head ? "blue" : "red";

    return (
      <div>
        <h2>Formulaire</h2>
        <p className={myClass}>je suis rouge ou bleu</p>
        <button>Valider</button>
      </div>
    )
  };
};

export default Form;
```
Ici, on accède à la prop `head` via `this.props.head`.  
Dans notre cas, head est un bouléen (true ou false).  
Le résultat de head va activer la constante `myClass` qui est directement injectée dans en paramètre à la propriété `className` de l'élément p.  
Si head est true, on applique la classe CSS `"blue"`, sinon, ce sera `"red"`.

Dans le cas d'un composant fonction, on va directement déclarer la props au début du composant et l'intégrer au JSX.  
Lors de l'appel du composant, il faudra passer la prop attendue :  
composant :
```JS
const Header = ({className}) => {
  return <h1 className={className}>Bienvenue sur le site</h1>;
}

export default Header;
```
Composant parent : 
```JS
...
  <>
    <Header className="bigFont blue"/>
  </>
...
```

En ce qui concerne les modules :  
Il faut en premier lieu créer un fichier `style.module.css`.  
Ce fichier va contenir du code CSS classique : 
```CSS
.green {
  color: green;
}
```
En revanche, pour y accéder, il faudra appliquer une autre syntaxe : 
```JS
import './App.css'
import './styles.css'
import styles from './style.module.css'

import Header from './components/Header'

function App() {
  return (
    <>
      <Header className="bigFont blue"/>
      <p className={styles.green}>premier paragraphe</p>
    </>
  )
}

export default App
```
Dans la propriété `className`, on va aller chercher la classe CSS green en utilisant `styles.green`.  
Afin d'utiliser la class green, il sera obligatoirement nécessaire d'importer une variable depuis le fichier `.module.css`. 

### CSS Frameworks et librairies : 

#### Bootstrap

Pour intégrer Bootstrap à une application, on utilisera la ligne de commande : `npm install bootstrap`.  
Si on souhaite une version précise, on ajoutera `@4.3.1` (pour la version 4.3.1) : `npm install bootstrap@4.3.1`.  

Le fichier package.json sera modifié et incluera la dépendance de bootstrap.

Enfin, dans notre fichier `index.js` (ou `main.jsx` si projet initialisé avec vite), on importera bootstrap : `import 'bootstrap/dist/css/bootstrap.min.css';`.

Une fois ces étapes faites, on peut déjà observer des changements dans le DOM.

Pour appliquer les classes bootstrap, il suffit de se référer à la [documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/) et de les utiliser directement dans les propriétés `className` du JSX.

L'inconvénient de ce procédé est qu'on va charger l'intégralité de bootstrap sur chacune des pages, qu'on l'utilise ou non. 

#### Styled components 

La librairie [styled-components](https://styled-components.com/) permet de styliser les composants de manière très ciblée.  
Son avantage face a bootstrap est qu'on va charger les styles uniquement lorsqu'on y fait appel. 

Styled components permet de coder du CSS dynamique. 

Pour l'utiliser, il faudra également installer la dépendance avec npm : `npm install styled-components`.  
Il faudra ensuite importer styled component dans chaque fichier ou l'on souhaite l'utiliser et coder du CSS directement dans le fichier.  
On va créer une constante qui fera office de composant et qui appliquera directement le style écrit : 
```JS
import { Component } from "react";
import styled from 'styled-components';

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
  };
};

export default Form;
```
On pourra remarquer lors de l'inspection de l'élément h2 dans le DOM qu'une classe CSS "bizarre" a été ajouté. Par exemple : `class="sc-bRKDuR bWJJIR"`.

Enfin, pour s'aider lors de l'écriture du CSS, on va ajouter une extension vs code afin d'appliquer une coloration syntaxique entre les bactics `` `vscode-styled-components` (de Julien Possonnier).

### Le package React-Bootstrap

L'idée avec ce package est de travailler avec des composant Bootstrap.  
Pour installer la dépendance, on va se rendre sur [react-bootstrap](https://react-bootstrap.github.io/docs/getting-started/introduction).  
Il faudra copier la ligne de commande `npm install react-bootstrap bootstrap` et l'ajouter à notre projet.

On pourra ensuite utiliser bootstrap partout dans le projet

Pour fonctionner correctement, il faudra importer les packages dans les fichiers JS ou JSX.  
Avec vite, dans `main.jsx`, il faut ajouter :  
* `import '../node_modules/bootstrap/dist/css/bootstrap.min.css';`  
OU
* `import 'bootstrap/dist/css/bootstrap.min.css';`

On peut ensuite intégrer les composant react-bootstrap directement dans les composants :  
```JS
import { Container } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container>
      <p>Welcome !</p>
    </Container>
  )
}

export default Welcome;
```

### Différence entre bootstrap et react-bootstrap

La différence entre les deux packages sera la syntaxe.  
Avec bootstrap classique, pour créer un container, on va procéder ainsi :  
```JS
...
const Welcome = () => {
  return (
    <div className='container'>
      <p>Welcome !</p>
    </div>
  )
}
...
```
alors qu'avec react-bootstrap on va utiliser directement le composant grâce à l'import : 
```JS
import { Container } from 'react-bootstrap';

const Welcome = () => {
  return (
    <Container>
      <p>Welcome !</p>
    </Container>
  )
}
...
```

## Note sur le componant PureComponent

Cette composant class de base prédéfinie doit être utilisée à la place de `shouldComponentUpdate()` dans un composant de class standard.  
Il s'agit d'un composant qui hérite de la class `PureComponent`.  

```JS
import { PureComponent } from 'react'

class PureComp extends PureComponent {
  render () {
    <div>
      <p>Hello Pure component</p>
    </div>
  }
}
```
Le Pure Component prendra sur lui de se rafraîchir du moment qu'un state ou une props est modifiée.  
Le composant PureComponent contient sa propre méthode `shouldComponentUpdate` qu'on ne peut en aucun cas modifier.  
Si une props ou un state est appelé pour être modifié mais que sa data ne change pas, alors le Pure Component ne se render pas de nouveau.

## React Memo

React Memo est un utilitaire qui permet de 'mémoriser' les informations. 

memo permet d'éviter de recharger un composant sauf si le contenu des props à changé :  
memo va comparer le contenu des variables passées en props, et refaire le render uniquement si celles-ci ont changé.

un composant avec memo se déclare ainsi :
* import de memo depuis react.
* export du composant encapsulé dans la fonction memo.

```JS
import { memo } from 'react';

const FunctionComp = (props) => {
  return (
    <div>
      <h2>Function Component</h2>
      <p>
        <span className="purple">
          Function component paragraph for name :
        </span>
        {props.name}
      </p>
    </div>
  );
};

export default memo(FunctionComp);
```

## Création d'une modal : les portails

Un portail est un solution qui permet de créer un composant enfant qui sera en dehors de la hiérarchie du DOM du composant parent.

Pour créer un portail, on va créer un composant`Modal`, qui sera injecté dans le DOM via une fonction qui manipule le state.  

Dans App.jsx :
```JS
import './App.css'

import { Component } from 'react'

import ModalComponent from './components/ModalComponent.jsx'

class App extends Component {

  constructor (props) {
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

  render () {

    const modal = this.state.showModal ? <ModalComponent close={this.handleCloseModal} /> : null

    return (
      <div className="App relative">
        <h1>React Modal</h1>
        <button onClick={this.handleOpenModal}>Display modal</button>
        {modal}
      </div>
    )
  }
}

export default App

```
avec le CSS associé : 
```CSS
.App {
  height: 100svh; // prends la totalité de la hauteur de l\'écran
  width: 100svw; // prends la totalité de la largeur de l\'écran
  background-color: #213547;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
}

.relative {
  position: relative; // pour l'exemple, un position relative est nécessaire. voir la doc MJS
}
```
* On intègre une variable qui va contenir le comoposant `ModalComponent` et qui va afficher la modal selon si showModal est au state true ou false.
* Le composant App contient deux fonctions qui vont gérer l'ouverture et la fermeture de la modale.
* un bouton va gérer l'affichage de la modal en appelant `handleOpenModal` au clic.
* Le composant `ModalComponent` va prendre une prop `close` qui contient elle-même la fonction `handleCloseModal` à déclencher lors d'un autre clic.

Le composant ModalComponent.jsx : 
```JS
import { Component } from 'react';
import ReactDOM from 'react-dom';

class ModalComponent extends Component {
  constructor(props) {
    super(props);

    this.popUpContainer = document.createElement('div');

    document.body.appendChild(this.popUpContainer);
  }

  componentWillUnmount() {
    document.body.removeChild(this.popUpContainer);
  }

  render () {
    return ReactDOM.createPortal(
      <div className="modal" onClick={this.props.close}>
        <div className="modal-content">
          <p>
            Je suis dans le modal !
          </p>
          <button>Fermer</button>    
        </div>
      </div>,
      this.popUpContainer
    )
  }
}

export default ModalComponent;
```
avec le CSS associé : 
```CSS
.modal {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(26, 26, 26, 0.5);
  width: 100svw;
  height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
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

Le composant `MocalComponent` contient le contenu de la modal.  
Le CSS associé indique que le composant est en `absolute`, cela signifie qu'il sera placé d'une certaine manière par rapport au composant parent.  
On va donc devoir spécifier quel est l'élément parent par rapport auquel il va devoir se positionner.
La structure du composant se compose ainsi : 
* la méthode `constructor()` va intégrer la création d'un élément `div` dans le DOM qui sera le parent du composant. 
* la méthode `componentWillUnmount()` va permettre de supprimer l'élément créé juste au dessus.  
Sans cela, la div créée restera dans le DOM et sera vide.(voir cycle de vie du composant)
* dans la méthode `render()`, on retourne `ReactDOM.createPortal()`.  
ReactDOM doit être importé pour être utilisé.  
`createPortal()` prends en paramètres deux éléments : 
  * 1er paramètre: le JSX qui contient le contenu à afficher.
  * 2ème paramètre: le conteneur parent.
* on peut noter que la fonction `onClick` est appelée sur la totalité de l'élément, et pas seulement sur le bouton.  
on se sert ici de la propagation d'événement :  
si on clique sur le bouton et qu'il ne possède pas d'événement, alors on va aller se référer à l'événement le plus proche au niveau des éléments parents.  
De cette manière, peut importe ou on va cliquer, le DOM va capturer l'événement `clic` et appliquer la fonction associée. 

## Les Refs

L'attribut `ref` dans react est un moyen pour faire référence à un élément dans le DOM.  
Cet attribut permet d'éviter d'accéder à un élément du DOM via son id.  
La manipulation du DOM via `document.get...` n'est pas du tout recommandé avec react :
* React procède à la mise à jour du DOM en effectuant une comparaison avec le DOM virtuel.  
* De cette manière, il procède au rafraîchissement des seuls éléments ayant changé.

Une ref dans un composant class va se déclarer ainsi : 
```JS
import React, { Component } from 'react'

class RefComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }

    this.myTitle = React.createRef();
    this.myInput = React.createRef();
  }

  update = (e) => {
    this.setState({ value: e.target.value })
  }

  componentDidMount() {
    this.myInput.current.focus();
  }

  componentDidUpdate() {
    this.myTitle.current.style.color = 'red';
  }

  render () {
    return (
      <div>
        <h2 ref={this.myTitle}>Valeur : {this.state.value}</h2>
        <input 
          ref={this.myInput}
          type="text" 
          id="" 
          name="" 
          value={this.state.value} 
          onChange={e => this.setState({ value: e.target.value })} />
      </div>
    )
  }
}

export default RefComponent
```

* Au niveau de la méthode `constructor()`, on va déclarer une variable avec le mot clef `this`, et lui attribuer la méthode `React.createRef()`.  
* Ensuite, dans le JSX, on va ajouter la propriété `ref` qui va contenir la variable.  
* On va ensuite pouvoir manipuler le DOM grâce en faisant référence aux variables `ref`. 

## ForwardRef 

Le forward ref permet de passer une référence d'un composant parent à un composant enfant. 

Le forward ref ne s'utilise que dans un composant de type fonction : 
```JS
import { forwardRef } from 'react';

const MyRef = forwardRef((props, ref) => {

  console.log(props.name);

  return (
    <div>
      <input ref={ref} type="text" />
    </div>
  );
});

export default MyRef;
```

Et au niveau du composant parent : 
```JS
import './App.css'

import React, { Component } from 'react'

import MyRef from './components/MyRef.jsx'

class App extends Component {
  constructor(props) {
    super(props)
    this.refComp = React.createRef();
  }

  handleClick = () => {
    console.log(this.refComp.current);
    this.refComp.current.focus();
  }

  render() {
    console.log(this.refComp);
    return (
      <div className="container">
        <h1>React Refs</h1>
        <MyRef ref={this.refComp} name="Toto" />
        <button onClick={this.handleClick}>Valider</button>
      </div>
    )
  }
}

export default App
```


## Les composants d'ordre suppérieur

Un composant d'ordre suppérieur (Higher Order Component = HOC) est une fonction qui accepte un composant et renvoie un nouveau composant.

Principe de base : 
```JS
const newComponent = HOC(OriginalComponent);
```

Exemple : 
```JS
const countHits = (WrappedComponent, hitGenerator) => {
  class CountHists extends Component {
    state = { hits: 0, lastHit: 0 }
    
    addHit = () => {
      const newHit = hitGenerator();
      this.setState({ hits: this.state.hits + 1, lastHit: newHit });
    }
    
    render() {
      return (
        <WrappedComponent 
          addOneHit={this.addHit} 
          hocState={this.state} 
          {...this.props} 
        />
      )
    }
  }
  return CountHists;
}
```
Utilisation : 
```JS
export default countHits(Vegeta, () => Randbetween(5, 15));
export default countHits(Goku, () => Randbetween(7, 17));
```

Avantage des HOC : 
| Avantage             | Description |
|-|-|
| Réutilisabilité                | La logique de comptage est écrite une seule fois |
| Séparation des responsabilités | Le composant `Vegeta` gère l'affichage, le HOC gère la logique |
|Composition                     | On peut combiner plusieurs HOC |

En résumé, `countHits` : 
1. `Reçoit`: un composant (`Vegeta` ou `Goku`) + une fonction génératrice de hits
2. `Ajoute`: un state (`hits`, `lastHit`) et une méthode (addHit)
3. `Retourne`: le composant original avec des props supplémentaires (addOneHit, hocState)

C'est un pattern de `composition` qui permet de partager une logique commune entre plusieurs composants sans dupliquer le code.

Avec l'arrivée des Hooks (React 16.8+), la plupart des cas d'usage des HOC peuvent être remplacés par des Custom Hooks : 
| Approche | Syntaxe | Utilisation |
|-|-|-|
| Hoc (ancienne) | `export default countHits(Vegeta)` | Composants class |
| Custom Hook (moderne) | `const { hits, addHit } = useCountHits()` | Composants fonction |

## La Gestion des Erreurs dans React

Selon la [documentation](https://fr.legacy.reactjs.org/docs/error-boundaries.html)

```
Une erreur JavaScript au sein d’une partie de l’interface utilisateur (UI) ne devrait pas casser l’ensemble de l’application. 
Pour résoudre ce problème, React 16 a introduit un nouveau concept appelé « Périmètres d’erreurs » (Error Boundaries, NdT).
```

Les périmètres d’erreurs sont des composants React qui `interceptent les erreurs JavaScript n’importe où au sein de leur arbre de composants enfants, enregistrent ces erreurs, et affichent une UI de repli` à la place de l’arbre de composants qui a planté.  
 Les périmètres d’erreurs interceptent les erreurs survenant au rendu, dans les méthodes de cycle de vie, ainsi que dans les constructeurs de tous les éléments de leur arborescence.

 