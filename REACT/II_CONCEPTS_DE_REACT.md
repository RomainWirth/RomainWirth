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

