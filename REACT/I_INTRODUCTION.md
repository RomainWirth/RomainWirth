# INTRODUCTION A REACT

ReactJS est une `bibliothèque` JavaScript `open source` développée par Fasebook en 2013.  
Cette bibliothèque est maintenue et enrichie par une grande communauté de développeurs partout dans le monde.

React est utilisée pour la création d'interfaces web monopages (Single Page Application). On peut également l'utiliser pour créer des applications mobiles Cross-platform, via React Native.

## Environnement de travail

### Vite



### React Developer Tools

L'extension [React Dev Tools](https://react.dev/learn/react-developer-tools) permet d'inspecter les composants React, éditer les props et les states.  
Cette extension contient : 
* l'onglet `Component` : qui permet d'inspecter les composants React, éditer les props et les states.
* l'onglet `Profiler` : qui permet de gérer la performance et identifier les problèmes dans un projet.

Il faudra ajouter l'extension au navigateur pour pouvoir utiliser les onglets depuis la console de ce dernier.

### Les pachages NPM

Il s'agit de modules (ou bibliothèques) JavaScript qui permettent d'étendre facilement les fonctionnalités d'une application React.js.  
Ces modules s'installent localement dans un projet à l'aide du gestionnaire de paquets `Node Package Manager`.  

React bénéficie d'un grand nombre de packages : 
* formulaires
* navigation (`react-router` = extrêmement populaire pour gérer la navigation dans les applications React monopage)
* requêtes HTTP
* gestion d'état (`redux` = utilisé pour centraliser et organiser la gestion d’état à grande échelle)
* animations
* styling (`styled-components` = permet de créer des composants stylés en CSS directement dans le JavaScript, facilitant la modularité et la lisibilité du code, et bien plus encore.)
* etc.

Avantages de packages : On ne réinvente pas la roue à chaque projet ! 
* Gain de temps
* Réduction des erreurs
* Accélération du développement

Il faudra toutefois faire attention à la `qualité des paquets` : maintenus, compatibles avec la version de React.

## Les Composants 

Les composants sont des blocs de code qui permettent de découper l'interface utilisateur en éléments `indépendants` et `réutilisables`.  
Cela permet de considérer chaque élément de manière isolée.  

Un composant est comme une fonction JavaScript. Il accepte des entrées quelconques (`props`) et renvoit des éléments React décrivant ce qui doit apparaître à l'écran.

Par exemple, une page HTML pourra être composée d'un `header`, d'un `footer`, de `sections`, d'un `aside`, de `boutons`, etc.  
Chaque composant peut également contenir d'autre sous-composants.  


## Notions de `Class`

prenons en exemple une petite app qui met en avant deux personnages : Riri et Fifi qui doivent se lancer des dégâts

fichier `App.jsx`
```JavaScript
import { Component } from 'react'
import Riri from './components/Riri'
import Fifi from './components/Riri'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      riri: 100,
      fifi: 100
    }
  }

  reduceLife = (param, param2) => {
    const characterToUpdate = param === 'Riri' ? 'fifi' : 'riri';
    this.setState(prevState => ({
      [characterToUpdate]: prevState[characterToUpdate] - param2
    }))
  }

  render() {
    return (
      <div className='container text-center'>
        <h1>Riri vs Fifi</h1>
        <hr />
        <div className='row'>
          <Riri name="riri" life={this.state.riri} reduceHandler={this.reduceLife} />
          <Fifi name="fifi" life={this.state.fifi} reduceHandler={this.reduceLife} />
        </div>
      </div>
    )
  }
}

export default App
```
La class était le composant dans lequel on pouvait avoir le `state` (data locale).  
Il existe plusieurs méthodes qui appartiennent à une class.  
La class contient une méthode (fonction de class) `render()` qui permet de retourner du jsx.  
Il est possible de créer des méthodes qui seront propre au composant 'class' : dans l'exmple, la méthode reduceLife est une fonction qui permet de modifier les états des éléments de la class.  

Sur les nouveaux projets, on utilisera plutôt des composants 'fonctions'.  
Les class peuvent encore être employées pour développer en React. Il est possible que dans le futur ce ne soit plus maintenu.

## Utiliser React via les liens CDN

Pour utiliser les liens CDN, on utilisera les balises script disponibles sur le site [legacy.reactjs.org](https://fr.legacy.reactjs.org/docs/cdn-links.html).  
Ces balises script seront à ajouter dans le head d'un document html :

index.html
```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <title>Class Component</title>
</head>

<body>
  <h1>Hello World !</h1>

  <!-- React class component -->
  <script>
    class App extends React.Component {
      render() {
        return (
          <div>
            <h2>Class Component</h2>
            <p>This is a class component in React.</p>
          </div>
        );
      }
    }
  </script>
</body>

</html>
```
Entre les balises script du body, on peut voir du code JavaScript.  
la méthode `render()` va retourner du JSX, qui est similaire à du html.  
Le JSX est bien du Javascript interprêté par le navigateur pour retourner du html.

On aura besoin d'un outil : [`Babel`](https://babeljs.io/) qui va compiler le JSX pour qu'il soit lisible par le navigateur.
Pour faire fonctionner le code dans le navigateur, il faudra ajouter la balise script : 
`<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>` dans le head du document html, et ajouter `type="text/babel"` dans la balise script du body.

Enfin, il faudra injecter le code dans le HTML

Parcitularité du JSX, le return ne pourra retourner qu'un seul élément parent : 
```html
<body>
  <h1>Hello World !</h1>

  <!-- React class component -->
  <script type="text/babel">
    class App extends React.Component {
      render() {
        return (
          <h2>Class Component</h2>
          <p>This is a class component in React.</p>
        );
      }
    }
  </script>
</body>
```
=> Cette syntaxe est impossible : il faudra entourer les balises h2 et p par une balise div.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <title>Class Component</title>
</head>


<body>
  <h1>Hello World !</h1>
  <div id="app"></div>

  <!-- React class component -->
  <script type="text/babel">
    class App extends React.Component {
      render() {
        return (
          <div>
            <h2 className="titre">Class Component</h2>
            <p>This is a class component in React.</p>
          </div>
        );
      }
    }

    const container = document.getElementById('app');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);

    // ancienne version de react (<18) :
    // const container = document.getElementById('app');
    // ReactDOM.render(<App />, container);
    
  </script>
</body>
```

Pour plus de lisibilité, on va externaliser le code JS dans un fichier `script.js`, et modifier le code html pour lire le contenu de ce fichier :  
index.html
```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <title>Class Component</title>
</head>

<body>
  <h1>Hello World !</h1>
  <div id="app"></div>

  <!-- React class component -->
  <script src="./script.js" type="text/babel"></script>
</body>

</html>
```

script.js
```JavaScript
class App extends React.Component {
  render() {
    return (
      <div>
        <h2>Class Component</h2>
        <p>This is a class component in React.</p>
      </div>
    );
  }
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```
La syntaxe ci-dessus utilise le component class.  
Ci dessous, la syntaxe plus récente avec le component function : 
script.js
```JavaScript
const App = () => {
  return (
    <div>
      <h2>Functional Component</h2>
      <p>This is a functional component in React.</p>
    </div>
  );
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<App />);
```

## Configurer un projet React

### Introduction

[Créer une nouvelle appli React](https://fr.legacy.reactjs.org/docs/create-a-new-react-app.html)

Historiquement, pour créer simplement une application React, on utilisera le terminal et la ligne de commande :  
`npx create-react-app app-name`

Sur la nouvelle [documentation](https://fr.react.dev/learn/start-a-new-react-project), on va pouvoir créer une application React via `Vite`.  
Vite permet de créer de A à Z sans avoir à tout paramétrer.

Voici la manière 'manuelle' de procéder pour configurer un projet React : 
* on aura besoin d'un compilateur pour permettre aux navigateurs d'interprêter le langage JSX : `Babel`.
* on aura aussi besoin d'un bundler : [`webpack`](https://webpack.js.org/).  
webpack permet d'organiser tous les fichiers, modules et dépendances, quels que soient leur extension vers des assets statiques.  
la configuration du bundle se fera dans le fichier `webpack.config.js`:
```JS
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};
```
Entry = point de départ où le bundler commence à traiter le code source de l'application. (Un ou plusieurs fichiers, dans notre cas, le fichier entryu sera sous ce path : `'./src/index.js'`).  
Output = endroit où le bundler génère le ou les fichiers résultants après avoir traité le code source. Ces fichiers peuvent être regroupés (bundled), minifiés et prêts à être servis par le navigateur.  
Le bundle sera créé sous le dossier `'dist'`, qui contiendra le fichier `'bundle.js'`.

### Configuration manuelle depuis le terminal : 

Voici les commandes à utiliser : 
* `npm init` pour initialiser un projet avec un fichier `package.json` qui référencera toutes les dépendances.
* `npm install react@[version]` (version = latest or previous ex: 18.2.0)
* `npm install react-dom@[version]` (version = même version que react !)
* `npm install webpack --save-dev` (ou -D au lieu de --save-dev = pour les dépendances dev)
* `npm install webpack-cli --save-dev` cli = command line interface = permet d'accéder à certaines commandes pour initialiser un projet webpack, écouter les fichiers, modifier, etc.
* `npm install webpack-dev-server --save-dev` permet d'avoir un 'hot reload' = mise à jour instantannée du DOM
* `npm install @babel/core --save-dev` pour compiler le code pour le navigateur
* `npm install babel-loader --save-dev` package 'loader' de babel, qui permet de gérer entre autre l'ordre de chargement des fichiers CSS, etc.
* `npm install @babel/preset-react --save-dev` plugin babel de react
* `npm install @babel/preset-env --save-dev` package lié au preset (config prédéfinie) indispensable pour utiliser les versions récentes de JS dans le projet.
* `npm install html-webpack-plugin --save-dev` plugin html de webpack pour lui permettre d'injecter le code dans le html

### Création des fichiers du projet : 

À la racine du projet, nous avons actuellement : 
* dossier `node_modules`
* fichier `package.json`
* fichier `package-lock.json`

On va ajouter un dossier `src` qui va contenir l'essentiel de notre application.  
On ajoutera dans ce dossier un dossier `components` qui va contenir tous les composants qui vont peupler l'application.  
On va enfin ajouter un fichier `App.js` dans le dossier components.
Le fichier App.js contiendra ceci : 
```JS
import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World !</h1>  
      </div>
    );
  }
}

export default App;
```
On va enfin ajouter dans le dossier src le fichier `index.html`, et un fichier `index.js`.
```
NB: si on crée un app avec vite, index.js sera remplacé par main.jsx
```
Dans notre fichier index.html
```HTML
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma première app react</title>
</head>

<body>
  <div id="root"></div>
</body>

</html>
```
Dans notre fichier index.js
```JS
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

// Ceci est équivalent :
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```
Enfin, on va créer à la racine du projet le fichier `webpack.config.js` qui contiendra la configuration de l'app :
```JS
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      }
    ]
  }
};
```
Explications :  
Début de la configuration installée dans le fichier :  
`entry: './src/index.js',`  
`output: {
    path: path.join(__dirname, '/dist'),  
    filename: 'bundle.js',  
  },`
Ces deux lignes indiquent le point d'entrée et de sortie du bundle. 
'join' st l'équivalent de 'resolve' en simplifié.
```JS
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
};
```
Ensuite, on va ajouter le plugin HTML : 
```JS
const HtmlWebpackPlugin = require('html-webpack-plugin');
//...
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
//...
```
Puis ajouter les modules : 
```JS
//...
  module: {
    rules: [
      test: /.js$/, // indique qu'on va compiler les fichiers en .js
        exclude: /node_modules/, // exclusion des node_modules
        use: {
          loader: 'babel-loader', // le loader
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] // les presets
          }
        },
    ]
  }
//...
```
Pour finir, on va modifier les `scripts` dans le fichier `package.json` : 
```JSON
{
  "name": "react_manual_config",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --mode development --open --hot"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.28.4",
    "@babel/preset-env": "^7.28.3",
    "@babel/preset-react": "^7.27.1",
    "babel-loader": "^10.0.0",
    "html-webpack-plugin": "^5.6.4",
    "webpack": "^5.102.0",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.2"
  }
}
```
la ligne : `"start": "webpack-dev-server --mode development --open --hot"`
* `"start"` = commande qui sera lancée dans le terminal => `npm start`

Elle aura pour effet de lancer la commande complète qui suit : `webpack-dev-server --mode development --open --hot`

* `webpack-dev-server` = dépendance de webpack pour lancer le serveur de développement
* `--mode development` = indique qu'on est en mode local
* `--open` = inidique qu'on ouvre dans un nouvel ongler
* `--hot` = indique qu'on active le 'hot reload'

Au niveau du terminal, on peut enfin lancer au niveau de la racine du projet la commande : `npm start`, et l'application va s'ouvrir automatiquement dans le navigateur. 

Pour terminer la configuration, on va ajouter la commande `build` dans le fichier package.json en dessous de la commande `start` :  
`"build": "webpack --mode production"`

En lançant `npm run build` dans le terminal à la racine du projet, le bundle va se générer et un dossier `dist` sera créé automatiquement dans le projet.  
Ce dossier va contenir : 
* le fichier `bundle.js`, = contient le code minifié par webpack
* un fichier `index.html`, 
* et un fichier `bundle.js.LICENCE.txt`

```
NB: Ceci est totalement pour la culture générale, puisque le package `Vite` permet d'automatiser tout ça.
```

## Créer une application React via CRA (create-react-app)

Il s'agit de l'utilisation d'une version simplifiée pour créer une application, via une seule ligne de commande que l'on peut retrouver sur la documentation [`create-a-new-react-app`](https://fr.legacy.reactjs.org/docs/create-a-new-react-app.html).

Il faudra bien entendu au préalable avoir installé la dernière version de [`nodejs`](https://nodejs.org/fr).

On utilisera la commande suivante : 
```bash
npx create-react-app mon-app
cd mon-app
npm start
```
Attention, cette méthode était l'outil recommandé par react depuis son lancement, mais il commence à être délaissé. 
Si create-react-app n'est pas maintenu, cela risque d'induire des failles et des problématiques si on travaille sur un 'vrai' projet.  
On préférera utiliser des outils qui sont bien maintenus, mis à jour et toujours apprécié par les développeurs.

L'alternative recommandée est `Vite`.

## Initialisation d'un projet React via  "Vite"

[`Pourquoi utiliser vite`](https://vite.dev/guide/why.html).  
Vite est un outil de développement rapide conçu pour développer des applications web modernes pour différentes librairies (disponibles sur la [`documentation`](https://vite.dev/guide/))

Pour initialiser un projet vite de React, on va utiliser la commande suivante : `npm create vite@latest`.  
On va indiquer le nom du projet, le framework utilisé (ici, React), le langage souhaité (ici, javascript).

`npm run dev` permettra de lancer le projet et de le visualiser dans le navigateur.

En comparaison avec la méthode CRA, les noms et emplacements des fichiers vont être en partis différents.  
On aura aussi un fichier `vite.config.js`.

L'application telle quel contient une petite interface qui contient un bouton 'compteur'.

## Différences entre CRA et VITE

| Create React App | VITE | 
| --- | --- |
| CRA nécessite Babel et Webpack. Sur les gros projets, Webpack peut créer des ralentissements | Vite utilise Rollup pour effectuer le bundle. Il exploite les modules ES native du navigateur. Rollup est un module bundler de JavaScript |
| index.html se situe sous le dossier `/public` | index.html est situé à la racine du projet | 
| index.js (ou .jsx) se retrouve dans le dossier `/src` | index.js est appelé main.jsx et se situe au même endroit sous `/src` |
| index.js contient la fonction reportWebVitals() pour contrôler la performance | - |
| logo est contenu sous `/src` | le logo est situé sous `/src/assets`. Le dossier assets contiendra les images du projet |
| concernant les tests, tout est préconfiguré avec RTL / Jest | Vite nécessite de configurer cela manuellement |
| - | .eslintrc.cjs = fichier de configuration ESLint, fourni au niveau de Vite. On peut désactiver les notifications d'erreur de ESLint dans ce fichier en ajoutant `'react/prop-types': 'off',` dans les rules |
| http://localhost:3000/ par défaut | http://localhost:5173/ pour le port 3000, il faut changer la configuration sous `vite.config.js` en ajoutant `server: { port: 3000 },` |

