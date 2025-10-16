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

Le destructuring permet de créer des alias pour un objet. 

exemple 1 : 
```JS
import React from 'react';
import { Car } from './Car';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        year: 2010,
        color: 'black',
      }, 
      {
        brand: 'BMW',
        year: 2012,
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        year: 2020,
        color: 'grey',
      },
    ],
  }

  render() {
    // ici on destructure le tableau cars en donnant des alias à chaque objet
    const [ audi, bmw, mercedes ] = this.state.cars; 

    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>Ajouter 10 ans</button>
        <div className='flex justify-center items-center gap-20'>
          <Car 
            brand={audi.brand} 
            year={audi.year} 
            color={audi.color} 
          />
          <Car 
            brand={bmw.brand} 
            year={bmw.year} 
            color={bmw.color} 
          />
          <Car 
            brand={mercedes.brand} 
            year={mercedes.year} 
            color={mercedes.color} 
          />
        </div>
      </div>
    );
  }
}

export default Mycars;
```

exemple 2 :  
on va destructurer l'objet passé en paramètre de la méthode `.map()` appelée dans la méthode `render()`.  
Au lieu de mettre `car` en premier argument, on va mettre : `{ brand, year, color }`.  
Ceci va permettre d'éviter d'appeler `car.brand`, `car.color` ...
```JS
import React from 'react';
import { Car } from './Car';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        year: 2010,
        color: 'black',
      }, 
      {
        brand: 'BMW',
        year: 2012,
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        year: 2020,
        color: 'grey',
      },
    ],
  }

  age = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  }

  addTenYears = () => {
    const updateState = this.state.cars.map(car => {
      return car.year -= 10;
    });
    this.setState({ updateState });
  }

  render() {
    const currentYear = new Date().getFullYear();

    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>Ajouter 10 ans</button>
        <div className='flex justify-center items-center gap-20'>
          {/* ici on destructure le paramètre car en nommant les 3 clés de l'objet */}
          {this.state.cars.map(({ brand, year, color }, index) => (
            <Car key={index} brand={brand} age={currentYear - year} color={color} />
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;
```

## Callback function et invocation d'une méthode dans les props

RAPPEL : Qu'est-ce qu'une callback ?  
Une [`callback`](https://developer.mozilla.org/fr/docs/Glossary/Callback_function) (fonction de rappel) est une fonction passée dans une autre fonction en tant qu'argument.  
Elle est ensuite inviquée à l'intérieur de la fonction externe pour accomplir une sorte de routine ou d'action. 

exemple : 
```JS
const greetings = (name) => {
  alert("Hello " + name);
}

const processUserInput = (callback) => {
  const name = prompt("Enter your name.");
  callback(name);
}

processUserInput(greetings);
```

On va créer une fonction 'getAge' qui prendra en paramètre 'year'.  
Cette fonction devra calculer l'age de la voiture et retourner une chaîne de caractère à afficher :  
'x an' si 0 ou 1 an, 'x ans' si plus de 1 an.

```JS
import React from 'react';
import { Car } from './Car';

class Mycars extends React.Component {
  state = {
    cars: [
      {
        brand: 'Audi', 
        year: 2010,
        color: 'black',
      }, 
      {
        brand: 'BMW',
        year: 2012,
        color: 'dark blue',
      }, 
      {
        brand: 'Mercedes',
        year: 2020,
        color: 'grey',
      },
    ],
  }

  getAge = (year) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    if (age > 1) {
      return `${age} ans.`;
    }
    if (age === 1) {
      return `${age} an.`;
    }
    return '';
  }

  addTenYears = () => {
    const updateState = this.state.cars.map(car => {
      return car.year -= 10;
    });
    this.setState({ updateState });
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <button className='btn' onClick={this.addTenYears}>Ajouter 10 ans</button>
        <div className='flex justify-center items-center gap-20'>
          {this.state.cars.map(({brand, year, color}, index) => (
            <Car key={index} brand={brand} age={this.getAge(year)} color={color} />
          ))}
        </div>
      </div>
    );
  }
}

export default Mycars;
```

## Passer une fonction dans une prop

Le composant enfant va attendre une fonction à déclancher.  
Cette fonction est dans un premier temps inconnue, c'est le composant parent qui va déterminer quelle sera la fonction à passer.  
En général, il s'agit d'une fonction qui va modifier l'état d'une donnée qui est affichée par le composant enfant.

composant parent : 
```JS
import { Component } from 'react';
import Child from './Child';

class Parent extends Component {
  state = {
    messageParent: null,
    messageChild: null,
  }

  orderParent = () => {
    this.setState({ messageParent: "Range ta chambre" })
  }

  answerChild = () => {
    this.setState({ messageChild: "Oui, Papa" })
  }

  render() {
    return (
      <div className='flex column justify-center items-center gap-20'>
        <h2>Parent</h2>
        <button onClick={this.orderParent}>Parent order</button>
        <p>{this.state.messageParent}</p>
        <hr />
        <Child name="Toto" updatedState={this.state} childAnswer={this.answerChild} />
      </div>
    );
  }
}

export default Parent;
```

Composant enfant : 
```JS
const Child = (props) => {
  const { name, updatedState, childAnswer } = props;

  const btn = updatedState.messageParent !== null 
    ? <button onClick={() => childAnswer()}>Answer</button> 
    : <button disabled>Answer</button>;

  return (
    <div>
      <h2>{name}</h2>
      {btn}
      <p>{updatedState.messageChild}</p>
    </div>
  )
}

export default Child;
```

### Exercice Maman/Toto

composant Parent : 
```JS
import { Component } from 'react';
import Toto from './Toto';

class Maman extends Component {
    state = {
        messageMaman: null,
        messageToto: null,
        disabled: true
    }

    // Compléter le code de la méthode ordreMaman.
    ordreMaman = () => 
    reponseToto = msg => this.setState({ messageToto: msg });

    render() {
        return (
            <div>
                <h1>Maman</h1>
                <button 
                    onClick={() => this.ordreMaman("Va ranger ta chambre")}
                >Order de la mère</button>

                <p>{this.state.messageMaman}</p>

                <hr />
                
                <Toto 
                    name="Toto"
                    reponseTotoProps={this.reponseToto}
                    leState={this.state}
                />
            </div>
        )
    }
}

export default Maman;
```

composant enfant : 
```JS
const Toto = props => {
  return (
    <div>
        <h2>{props.name}</h2>
        <button 
          // compléter
        >Réponse</button>

        <p>{props.leState.messageToto}</p>
    </div>
  )
}

export default Toto
```

<details>
<summary>Correction</summary>

composant Parent : 
```JS
import { Component } from 'react';
import Toto from './Toto';

class Maman extends Component {
    state = {
        messageMaman: null,
        messageToto: null,
        disabled: true
    }

    ordreMaman = msg => this.setState({ messageMaman: msg, disabled: false });
    reponseToto = msg => this.setState({ messageToto: msg });

    render() {
        return (
            <div>
                <h1>Maman</h1>
                <button 
                    onClick={() => this.ordreMaman("Va ranger ta chambre")}
                >Order de la mère</button>

                <p>{this.state.messageMaman}</p>

                <hr />
                
                <Toto 
                    name="Toto"
                    reponseTotoProps={this.reponseToto}
                    leState={this.state}
                />
            </div>
        )
    }
}

export default Maman;
```

composant Enfant : 
```JS
const Toto = props => {
  return (
    <div>
        <h2>{props.name}</h2>
        <button 
          onClick={() => props.reponseTotoProps("Non, je veux regarder la télé")}
          disabled={props.leState.disabled}
        >Réponse</button>

        <p>{props.leState.messageToto}</p>
    </div>
  )
}

export default Toto
```
</details>


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

