# LE CYCLE DE VIE D'UN COMPOSANT REACT AVEC LES CLASSES

La méthode de cycle de vie d'un composant react (life cycle method) possède plusieurs phases qui possèdent chacune des méthodes associées.  
Ce méthodes ne sont accessibles que depuis un composant de type `class`.  
Voici les principales méthodes qui interviennent dans le cycle de vie d'un composant :
* Phase de Montage :
    * **La méthode `constructor`** :  
    Il s'agit de la première méthode qui se lance systématiquement lorsqu'on instancie une classe.  
    Cette méthode est obligatoire pour permettre le bon fonctionnement du composant.
    * La méthode `getDefivedStateFromProps` :  
    Cette méthode n'est pas obligatoire. Elle existe pour les rares cas où l’état dépend bien des changements de props au fil du temps.  
    * **La méthode `render()`** :  
    La méthode render() est la seule méthode requise dans une classe de composant.  
    * **La méthode `componentDidMount()`** :  
    componentDidMount() est appelée immédiatement après que le composant est monté (inséré dans l’arbre). 
* Phase de Mise à jour :
    * méthode `render()`
    * méthode `componentDidUpdate()`
* Phase de Démontage
    * méthode `componentWillUnmount()`

Se référer à la [documentation](https://fr.legacy.reactjs.org/docs/react-component.html).  
Pour mieux comprendre, on peut se référer à [ce diagramme](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## Phase de Montage

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

La méthode `componentDidMount()` ne sera invoquée qu'une seule fois après que ses enfants auront été montés (chargés dans le DOM).  
Il est possible d'appeler la méthode `setState()` directement dans componentDidMount.  
Cela déclenchera un rendu supplémentaire qui aura lieu avant que le navigateur ne mette à jour l'écran. 
```JS
componentDidMount() {

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

Pour mettre à jour le composant, on va se rendre dans la méthode `componentDidMount()` et y ajouter la méthode `setState()`
```JS
componentDidMount() {
  console.log(`step [${this.state.step}] - dans le componentDidMount`);

  this.setState({ step: 2 }, () => {
    console.log(`step [${this.state.step}] - après le setState du componentDidMount`);
  });
}
```
Pour contrôler la mise à jour, on va faire appel à la méthode `componentDidUpdate()`
```JS
componentDidUpdate(prevProps, prevState) {
  console.log(`step [${this.state.step}] - dans le componentDidUpdate`);
  console.log('Previous state: ', prevState);
  console.log('Current state: ', this.state);
}
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