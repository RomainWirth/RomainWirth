# II. LES CONCEPTS DE REACT 

## Les Composants React

Il existe 2 types de composants dans React : `State Component`vs `UI Component`.

Le **State Component** était sous format de Class. Avec l'évolution de React (à partir de la version 16.8), React a intégré les Hooks, sans se débarasser des classes.  
Les Hooks permettent, entre autres, d'avoir un state dans un composant fonction.  
Avant l'arrivée des Hooks, on devait partir sur un composant Class pour avoir un état local à notre composant
Rappel : le state est une manière d'enregistrer des datas localement dans un composant. 

Le **UI Component** est un composant de présentation. Dans les anciennes versions de React, il contiendra uniquement les gabaris de blocs, par exmple html. Il ne contiendra pas de data ni de state. 
À partir de la version 16 de React, on tend à unifier les deux types de composant, et la gestion de state se fait directement dans le composant fonction (UI Component) via les Hooks.

On va d'abord aborder la logique des class avant de passer à la logique des Hooks.

Dans un projet, nous aurons le fichier `App.js` sous src. Ce fichier contiendra le code suivant qui va évoluer par la suite :
```JS
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

Nous allons ensuite créer un nouveau composant class : `Mycars.js`
```JS
import React from 'react';

class Mycars extends React.Component {
  render() {
    return (
      <div>
        <h2>My Cars Component</h2>
        <p>Ceci est un paragraphe</p>
      </div>
    );
  }
}

export default Mycars;
```

Pour afficher le composant Mycars, on va devoir l'importer et l'utiliser dans le jsx de App.js : 
```JS
import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars' // import du composant

class App extends Component {

  render() {

    return (
      <div className="App">
        <h1>Hello World!</h1>
        {/* utilisation du composant Mycars */}
        <Mycars /> 
      </div>
    )
  }
}

export default App
```
On va ensuite modifier le tout et ajouter un composant fonction `Car` qui ne contiendra pas de state.  
Ce composant contiendra deux paragraphes : Marque et Couleur.  
Après avoir modifié les composants parent, notre projet contiendra ceci :  
App.js
```JS
import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {

  render() {

    return (
      <div className="App">
        <Mycars />
      </div>
    )
  }
}

export default App
```

./components/Mycars.js
```JS
import React from 'react';
import Cars from './Cars';

class Mycars extends React.Component {
  render() {
    return (
      <div>
        <h1>My Cars</h1>
        <Cars />
      </div>
    );
  }
}

export default Mycars;
```

./components/Car.js
```JS
const Car = () => {
  return (
    <div>
      <p>Marque : </p>
      <p>Couleur : </p>
    </div>
  );
}

export default Car;
```

## Props et State

### Props 

Le composant Car.js pourra contenir des props.  
Une `prop` est une propriété que l'on souhaite pouvoir modifier à l'appel d'un composant.  
Il existe deux types de props (ceci est valable en typescript): 
* children qui est un 'node' (un noeud) et qui pourra contenir du jsx.
* prop qui est une propriété définie qu'on va appliquer directement.
```
NB : pour simplifier, j'ai utilisé du CSS inline, ceci n'est pas une bonne pratique. Il faut toujours utiliser des class dans un fichier CSS dédié !
```

Car.js
```JS
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
children pourra contenir des éléments jsx tel qu'une `span`.  
On ajoute une variable `colorInfo` qui va tester si la prop `color` existe bien et appliquer un bloc de code ou un autre dans un cas ou l'autre.

Lors de l'appel de Car dans Mycars.js, on pourra procéder ainsi : 
```JS
import React from 'react';
import Car from './Car';

class Mycars extends React.Component {
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

export default Mycars;
```

**ATTENTION**  
Dans React, les props sont immuables. Il ne faut pas les modifier à l'intérieur du composant.  
La prop est un élément qui est maléable, c'est à dire que c'est le parent qui va envoyer la data au composant via la prop.  
Le composant ne doit faire qu'afficher la data ou procéder à une action précise.  
Il ne doit en aucun cas modifier la valeur passée, faut via une fonction pour un traitement spécifique.

exemple :  
Mycars.js fait appel au composant `Car`
```JS
import React from 'react';
import { Car } from './Car';
import Header from './Header';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        color: 'black',
      }, 
      {
        brand: 'BMW',
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        color: 'grey',
      },
    ],
  }

  render() {
    const { title, colorTitle } = this.props;

    return (
      <div>
        <Header title={title} colorTitle={colorTitle} />
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>{car.brand}</Car>
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;
```
Car.js
```JS
import { Wrapper } from './Wrapper';

export const Car = ({ children, color }) => {

  children = 'toto'; // => CECI EST À BANNIR !

  return children && (
    <Wrapper>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </Wrapper>
  );
}
```
Modifier `children` de cette manière est possible mais proscrit. 

### State

Les composants State pourront contenir un objet state, qu'on pourra modifier. 

App.js
```JS
import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} />
      </div>
    )
  }
}

export default App

```

On accédera à la prop au niveau du composant `Mycars.js` grâce au mot clé `this` : `this.props.title`.

```JS
import React from 'react';
import Car from './Car';

class Mycars extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
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

export default Mycars;
```

Cela permettra, lors de la modification du state, de modifier dynamiquement le contenu de la prop.
```
NB: Dans les nouvelles version de React, on utilise les Hooks pour ce genre de choses. 
```

Exercice :  
1. Modifier le composant Car pour inscrire le conditionnement dans le jsx.
2. Ajouter une propriété au state dans App pour modifier la couleur du texte de h1 dans le composant Mycars.
3. Essayer d'optimiser le code en utilisant le state et un tableau d'éléments pour les voitures.  
Le tableau doit contenir des objets avec deux clés : brand et color, qui contiennent des strings.  
Créer une boucle pour afficher les voitures.

<details>
<summary style="font-weight:bold">Correction</summary>

Car.js
```JS
const Car = ({ children, color }) => {
  return children && (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px', width: '150px' }}>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </div>
  );
}

export default Car;
```
App.js
```JS
import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
    colorTitle: 'green'
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
      </div>
    )
  }
}

export default App
```
Mycars.js
```JS
import React from 'react';
import Car from './Car';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        color: 'black',
      }, 
      {
        brand: 'BMW',
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        color: 'grey',
      },
    ],
  }

  render() {
    const { title, colorTitle } = this.props;

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

export default Mycars;
```
</details>

## Export default vs Named Export 

### Option 1 : Export default

Export default permet d'exporter un élément et de l'importer dans un autre composant avec le nom de notre choix (pas obligatoirement avec le vrai nom de la classe ou de la fonction).  

exemple :  
`export default Mycars` peut être importé de ces deux manières :  
* `import Mycars from './components/Mycars'`
* `import Container from './components/Mycars'`

### Option2 : Named Export 

Le named export oblige à conserver le nom du composant à exporter, et il faudra respecter une certaine syntaxe entre accolades.  
On utilisera le terme export devant la class ou la fonction.

exmple :  
`export class Mycars extends Component` (ou `export const Mycars ...`) peut être importé uniquement de cette manière : 
* `import { Mycars } from './components/Mycars'`

### Bonnes pratiques

De manière générale, chaque composant doit avoir son fichier propre. C'est une bonne pratique.

Il est toutefois possible d'avoir deux composants dans un même fichier :  
composant Mycars.js
```JS
import React from 'react';
import Header from './Header';

import { Wrapper } from './Wrapper';

const Car = ({ children, color }) => {
  return children && (
    <Wrapper>
      <p>Marque : {children}</p>
      <p>Couleur : {color ? color : 'inconnue'}</p>
    </Wrapper>
  );
}

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        color: 'black',
      }, 
      {
        brand: 'BMW',
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        color: 'grey',
      },
    ],
  }

  render() {
    const { title, colorTitle } = this.props;

    return (
      <div>
        <Header title={title} colorTitle={colorTitle} />
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>{car.brand}</Car>
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;
```

Dans ce cas, le composant `Car` est uniquement utilisé et ne pourra être utilisé que dans le composant `Mycars`.

## Les Événements React

Les événements ([Events](https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting/Events)) sont des changements, des actions qui se produisent dans un système que l'on programme et auxquels ont peut répondre d'une manière ou d'une autre. 
exemple : `onClick`, `onChange`, etc. 

exemple :  
On va créer une fonction `noCopy` qui doit alerter l'utlisateur lorsqu'un élément est copié. 
Cette fonction va être appelée à l'événement `onCopy` que l'on peut associer à n'importe quelle balise html.  
```JS
import React from 'react';
import { Car } from './Car';
import Header from './Header';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        color: 'black',
      }, 
      {
        brand: 'BMW',
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        color: 'grey',
      },
    ],
  }

  // Fonction noCopy qui déclenche une alerte dans le DOM
  noCopy = () => {
    alert("Copier c'est voler !");
  }

  render() {
    const { title, colorTitle } = this.props;

    return (
      <div>
        <Header title={title} colorTitle={colorTitle} />
        {/* paragraphe avec un event onCopy */}
        <p onCopy={this.noCopy}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <div style={{ display: 'flex' }}>
          {this.state.cars.map((car, index) => (
            <Car key={index} color={car.color}>{car.brand}</Car>
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;
```
ATTENTION : lors de l'appel de la fonction, on a pas ajouté de parenthèses après son appel : `this.noCopy()`.  
L'ajout de parenthèses provoque un déclenchement de la fonction au chargement de la page.  
Pour éviter ceci, il faudra appeler la fonction dans une fonction anonyme : `() => {this.noCopy()}`


### Les événements et le changement de state

La modification direct d'un state dans une fonction n'est pas possible et est strictement interdit en react :  
```JS
import { Component } from 'react'
import './App.css'

import Mycars from './components/Mycars'

class App extends Component {
  state = {
    title: 'Mon catalogue voitures',
  }

  changeTitle = (e) => {
    this.state = "TRUC"; // INTERDIT
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} />
        <button onClick={this.changeTitle}>Changer le nom en dur</button>
      </div>
    )
  }
}

export default App

```

React a besoin via le DOM virtuel ce qui a été modifié et apporté au composant afin de détecter la différence entre le DOM virtuel et le DOM actuel (sur le navigateur)  
et de mettre à jour seulement l'information nouvelle apportée au composant. 
En utilisant this.state, React ne pourra pas détecter une quelconque modification.

React a également besoin de surveiller les mutations du "state" pour pouvoir gérer le cycle de vie du composant.  
(Voir chapitre sur le cycle de vie d'un composant React)

Pour palier à ce problème, React contient une logique de modification du state avec `setState()` :
```JS
...
  changeTitle = (e) => {
    this.setState({
      title: "Mon nouveau titre"
    }); 
  }

  changeWithParam = (title) => {
    this.setState({
      title
    })
  }


  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} />
        <button onClick={this.changeTitle}>Changer le nom en dur</button>
        <button onClick={() => this.changeWithParam('Titre via paramètre')}>Changer le nom avec paramètre</button>
      </div>
    )
  }
...
```
La mutation du state est systématiquement détectée par React qui se chargera d'enclencher le rechargement du composant et de mettre à jour le DOM.  
La méthode `render()` va donc se lancer. (plus de détails dans le chapitre sur le cycle de vie d'un composant React)

#### Modification du state via un Bind

Le `bind()` est une méthode qui est utilisée pour passer de la data en argument à une fonction d'une composant class.

Syntaxe : `this.function.bind(this,[arg1...]);`

```JS
...
  changeWithBind = (param) => {
    this.setState({
      title: param
    })
  }


  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
        <button onClick={this.changeWithBind.bind(this, 'Titre via bind')}>Changer le nom avec Bind</button>
      </div>
    )
  }
...
```

#### Modification dynamique avec input text

L'objectif ici est de capter le changement d'un élément input text (formulaire) pour modifier un autre élément du DOM. 
```JS
...
  changeWithInput = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  render() {
    return (
      <div className="App">
        <Mycars title={this.state.title} colorTitle={this.state.colorTitle} />
        <input type="text" onChange={(e) => this.changeWithInput(e)} value={this.state.title}/>
      </div>
    )
  }
...
```
`changeInput` est une fonction qui modifie l'état de l'élément qui contient title.  
`onChange` va contenir l'appel de la fonction `changeInput`.  
`value` est un paramètre qui affiche le contenu dans l'input.

### Différence entre JS Vanilla et React : 

React utilisera toujours le camelCase pour l'ajout de propriété à une balise.

* Vanilla : on fait `oncopy`, `onclick`, `onchange`, etc.  
```JS
<p oncopy="myFunction()">Hello world !</p>
<button onclick="myFunction()">mon bouton</button>
<input type="text" onchange="myFunction()" />
```
* React : on fait `onCopy`, `onClick`, `onChange`, etc. (camel case)  
```JS
<p onCopy={myFunction()}>Hello world !</p>
<button onClick={myFunction()}>mon bouton</button>
<input type="text" onChange={myFunction()} />
```

### Note sur le constructor, la mutation et les mauvaises pratiques à éviter

Si on initialise pas d'état local et qu'on ne lie pas de méthode, il n'est pas nécessaire d'implémenter son propre constructeur pour un composant réact.  
On définit directement le state sans le constructor, sans le `this`.

Comme vu plus haut : "il ne faut jamais modifier le state directement, on doit toujours passer par la méthode setState()".  
Il s'agit de la procédure courante à l'extérieur du constructor.  
Mais si on a besoin d'initialiser l'état local d'un composant en affectant un objet à `this.state`,  
ou si on souhaite lier des méthodes gestionnaires d'événements à l'instance, il faudra implémenter le constructeur.  
La procédure dans ce cas est un peu différente. 

Exemple 1 :  
On a besoin d'initialiser l’état local d'un composant en affectant le state (l'objet `this.state`).  
Dans ce cas, on ne doit **SURTOUT PAS** appeler `setState()` dans le `constructor()`!  
Au lieu de ça, on affecte directement l’état initial à `this.state` dans le constructeur.
```JS
constructor(props) {
  super(props);
  
  // Ne pas appeler `this.setState()` ici !
  this.state = { counter: 0 };
}
```

Exemple 2 :  
Si on souhaite lier des méthodes gestionnaires d’événements à l’instance, on va donc devoir implémenter le constructeur.
```JS
constructor(props) {
   super(props);
   this.handleClick = this.handleClick.bind(this);
}
```
Le constructeur est le seul endroit où on doit affecter directement une valeur à `this.state` sans passer par la méthode `setState()` car cette dernière est strictement interdite dans le constructor().

Une autre erreur courante chez les débutants en React consiste à copier les props dans l’état local.  
Ne jamais faire ça !

Exemple :
```JS
constructor(props) {
  super(props);
   
  // Ne jamais faire ça !
  this.state = { color: props.color };
}
```

N.B. :`constructor(props)` est une méthode qui n'est plus obligatoire depuis React 16.  

## Desctructuring array 



## Callback function

## Invoquer une méthode dans les props