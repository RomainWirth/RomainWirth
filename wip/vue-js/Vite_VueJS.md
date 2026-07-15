# VUEJS et VITE

<a href="https://blog.dyma.fr/vue/">blog.dyma.fr</a>

## INTRODUCTION

### QU'EST-CE QUE `Vue.js` ?

Vue.js est un framework permettant de développer des interfaces utilisateur.<br>
Vue est développé entièrement en TypeScript depuis sa version 3.

TypeScript est un langage de programmation open source développé par Miscrosoft.<br>
C'est un sur-ensemble syntaxique de JavaScript.<br>
Cela signifie que c'est du JavaScript amélioré, qui permet notamment un typage fort.<br>
Il est ensuite transformé en JavaScript pour être lu par les navigateurs.

Vue.js est fondé sur deux concepts clés : le rendu déclaratif et la réactivité.

Le rendu déclaratif est le fait de décrire le rendu (HTML) en fonction de l'état de l'application (en JS).

La réactivité est le fait que Vue suit les changements d'état dans le code JS<br> 
et met à jour le DOM de manière optimisée si des changements doivent être faits.

### UN FRAMEWORK PROGRESSIF

L'une des grandes forces de Vue.js est d'être progressif :<br> 
on peut faire une application très simple sans étape de build juste avec la librairie core,<br>
mais on peut aussi faire une application très complexe avec beaucoup d'étapes de builds automatisés,<br>
une gestion de route, de l'état de l'application, etc.

On pourra aborder les librairies officielles qui font parties du framework Vue.js :
* **Vue Router** : permet de gérer la navigation de l'utilisateur dans l'application.<br>
![](./assets/router--1-.png)
* **Pinia** : permet de gérer l'état de l'application.<br>
![](./assets/pinia--1-.png)
* **Vite** : permet de construire l'application (ex : en transpilant le Sass et CSS ou le TypeScript en JS) et de l'optimiser.<br>
![](./assets/vite--1-.png)

_N.B.: Transpiler signifie convertir dans un autre langage de même niveau<br> 
(au contraire de la compilation qui transforme le code dans un langage de haut niveau à un langage plus proche du langage machine)_

### TOUS LES RENDUS POSSIBLES

Vue.js permet de faire des applications de tous les principaux types de rendus :
* **SPA (Single-Page Application)** :<br>
Le serveur envoie une page HTML avec un lien vers des fichiers JS qui contiennent toute l'application.<br>
Le navigateur va charger toute l'application qui va gérer un grand nombre d'opérations comme le routage entre les pages.
* **SSR (Server Side Rendering)** :<br>
La page Web est générée par le serveur qui construit le HTML, le CSS et le JS nécessaires en fonction de la requête pour rendre la page.<br>
Pendant ce temps, le navigateur télécharge la SPA qui sera ensuite utilisée.<br>
Cela permet aux utilisateurs d'avoir un premier affichage quasi-immédiat sans avoir à attendre le chargement de l'application.<br>
Lorsque le SSR est configuré on dit alors que l'application est universelle car elle est rendue côté serveur et côté client.
* **SSG (Static-Site-Generation / JAMStack)** :<br>
Toutes les pages sont pré-générées sur le serveur (HTML, CSS et JS sont générés en amont) et servies au navigateur en fonction des requêtes.<br>
C'est utilse pour faire de petits sites statiques. On peut alors utiliser VitePress, la librairie SSG officielle de Vue.

Il est aussi possible de faire des applications bureautiques (ex avec Electron ou Tauri),<br>
des applications mobiles (ex avec Ionic ou Quasar),<br>
ou développer des applications pour le terminal.

### UNE TRACTION INCROYABLE

* Vue.js dépasse les 3 millions de dl par semaine sur npm.
* C'est le framework JS qui a le plus d'étoiles sur Github (environ 200'000).
* Le framework est très stable et est utilisé par Laravel (comme framework JS par défaut), GitLab et par PageKit.

## LA VERSION Vue.js 3

Vue 3 est sorti en septembre 2020 et est devenu la version officielle par défaut en février 2022.<br>
L'ensemble du framework a été entièrement réécrit en TypeScript et est plus performant que la V2 : plus léger et optimisé.<br>
Il bénéficie d'une nouvelle API appelée **API Cmposition** qui permet de rendre plus facile le dev d'applications complexes.<br>

### AVANTAGES
**Taille**<br>
La librairie Vue.js fait seulement 20kB lorsqu'elle est minimisée et compressée : léger avec un chargement instantané.<br>

**Rapidité**<br>
Les performances de Vue sont excellentes et surpassent celle de React sur le rendu et la MAJ du DOM.<br>
Vue.js utilise un DOM virtuel pour minimiser le nombre de mutations du DOM nécessaires lors de changements.<br>
Vue.js a des algorithmes de calcul des mutations nécessaires qui s'avèrent plus performants et légers que ceux de React.<br>

**Un framework complet**<br>
Vue comporte tous les éléments d'une application moderne complète :<br> 
gestion de la navigation, gestion avancée de l'état, gestion de la construction de l'application de manière optimisée, gestion des rendus, etc.

## LES SPA (Single-Page Applications)

Vue fonctionne sur le principe des "Single-Page Applications" (SPA).<br>
Les principales caractéristiques des SPA sont :
* le rendu est effectué côté client (quand un élément change, la page est modifié grâce aux scripts de l’application chargée côté client)
* pour fonctionner elle charge en principe une seule fois l’application (HTML, CSS et JavaScript)
* seules les données sont transmises, si nécessaire, entre le serveur et l’application client (le plus souvent au format JSON)
* le développement mobile est simplifié car le code backend peut être utilisé que l’application soit Web ou native (iOS, Android).
* elle est particulièrement adaptée pour stocker les données localement et de n’envoyer des requêtes au serveur lorsque c’est nécessaire

### Le fonctionnement :

![](./assets/How-does-Single-Page-Application-Works.jpg)

### Quelques informations

Comparaison des principaux frameworks :

|                                      | AngularJS                | ReactJS            | Vue.js             |
|--------------------------------------|--------------------------|--------------------|--------------------|
| Site web officiel                    | https://angularjs.org/   | https://react.dev/ | https://vuejs.org/ |
| Date de la première version          | 2010                     | 2013               | 2014               |
| Communauté                           | ++++                     | +++++              | ++                 |
| Entreprise assurant le développement | Google / Wix             | Facebook / Uber    | GitLab / Alibaba   |
| License                              | MIT                      | MIT                | MIT                |

**Angular :**<br>
Avantages :
* grande documentation
* Liaison de données bidirectionnelles permettant de minimiser les risques d'erreur
* Nouvelles fonctionnalités proposées régulièrement
* utilise le modèle MVVM (Model-View-View-Model) :<br> 
permet aux devs de travailler séparément sur une même action de l'app et en utilisant le même ensemble de données

Inconvénients :
* Problèmes de migrations entre versions
* Syntaxe de la première version d'Angular très complexe

* **React :**<br>
Avantages :
* Facile à apprendre : syntaxe simple à prendre en main
* Framework très flexible et très réactif
* Utilise un DOM virtuel (<a href="https://fr.legacy.reactjs.org/docs/faq-internals.html">concept de programmation</a>)
* Combiné avec ES6/7 : peut travailler avec une charge élevée de manière facile
* Librairie JS open source facilement manipulable par les devs car c'est un langage connu
* Montée en versions se fait facilement, Google automatise aussi une grande partie du processus de la migration

Inconvénients :
* manque de documentation officielle de la part de React Native
* React très long à maîtriser et nécessite une connaissance approfondie de celui-ci<br> 
pour réussir à intégrer l'interface utilisateur dans le framework **MVC**

**Vue.js**<br>
Avantages :
* framework similaire à Angular (gestion des blocs HTML + optimisation avec l'utilisation de différents composants)
* documentation détaillée
* perçu comme adaptable : période de transition rapide entre un autre framework et celui-ci
* peut développer des grands gabarits réutilisables en les réalisants sans temps supplémentaire
* framework de petite taille (environ 20Ko)<br> 
et garde sa vitesse et flexibilité pour atteindre de meilleures performances par rapport aux autres frameworks

Inconvénients :
* manque de ressources
* certaines docs en chinois

## DEBUTER AVEC VITE ET VUE 3

article : <a href="https://blog.ninja-squad.com/2022/02/23/debuter-avec-vite-et-vue/">ninja squad</a>
doc officielle : <a href="https://vitejs.dev/guide/">vitejs</a>
vidéo : <a href="https://grafikart.fr/tutoriels/javascript-vite-1351">grafikart</a>

### Découverte de vite

(Dans cette partie, on suit le tuto de grafikart)

Afin d'utiliser vite, il faudra avoir Node.js et NPM :
DL node : <a href="https://nodejs.org/fr/download">nodejs.org/fr/download</a>
pour Ubuntu, voir la doc : <a href="https://doc.ubuntu-fr.org/nodejs">doc.ubuntu-fr.org/nodejs</a>

Pour commencer à utiliser vite, il faut se rendre sur la partie "guide" de <a href="https://vitejs.dev/">vitejs.dev</a>, "guetting started".<br>
On lancera un premier projet avec les commandes : <br>
avec NPM :
```bash
npm create vite@mlatest
```
puis suivre les prompts :<br>
```bash
Need to install the following packages :
    create-vite@latest
Ok to proceed? (y) y
Package name : #nom du projet
Select a framework : #framework
Select a variant : #JavaScript ou TypeScript
```
pour terminer la mise en place du projet, on utilisera les commandes suivantes :
```bash
npm install

# suivi de 

npm run dev
```
`npm install` va permettre de terminer l'installation.<br> 
`npm run dev` va permettre d'initialiser un serveur de développement.<br>
Suite à ça on pourra suivre le lien donné pour afficher dans le navigateur le rendu de l'application.

Une fois la phase de développement terminée, on va lancer une commande pour construire le projet :
```bash
npm run build
```
Cette commande va 'bundler' les fichiers javascript afin de les fusionner et créer un seul.<br>
Cela va générer un dossier 'dist' qui va contenir la page `html` qui va inclure le chemin du JS une fois qu'il a été compilé,<br>
ainsi que le dossier assets qui va contenir le JS

Afin de tester la version build, on lancera la commande 
```bash
npm run preview
```
Cette commande va lancer un petit serveur html permettant de voir le rendu de la version build.

Ces commandes sont disponibles dans le fichier `package.json`.

#### Fonctionnalités de base de vite

1. **vite permet d'accéder à l'écosystème de Node.js pour le frontend :**<br>
On va pouvoir télécharger des librairies provenant directement de npm.<br>
exemple avec le package canvas-confetti :
```bash
npm install --save canvas-confetti
```
Cette commande permet d'installer le package dans le projet et de l'utiliser via :
```javascript
import confetti from 'canvas-confetti'; 

confetti();
```
* `import` : indique qu'on souhaite utiliser le package (cela crée une variable qu'on pourra utiliser)
* `confetti` : désigne le package qu'on utilisera dans le fichier (il s'agit du nom de la variable)
* `from 'canvas-confetti'` : désigne le package tel que défini lors de l'installation avec npm.
* `confetti();` : lance la fonction associée au package importé (varie selon les packages => voir la doc).

2. **vite permet d'inclure d'autres types de fichiers :**<br>
Cela est impossible à faire en JavaScript.
exemple :
```javascript
import background from './image.jpg'

console.log(background)
```
Dans notre cas, `console.log(background)` retournera dans la console le chemin vers le fichier importé.

3. **il est également possible d'importer directement du css :**<br>
```javascript
import `./style.css`
```
De cette manière, il n'est pas nécessaire de stocker cet import dans une variable.<br>
On a simplement besoin d'indiquer le chemin vers le fichier contenant le css.<br>
Au niveau de la page web, en mode développement, cela se traduit par l'injection d'une balise `<style>`<br> 
dans laquelle on retrouve le contenu de notre fichier `style.css`.<br>

Lorsqu'on build (`npm run build`) : on retrouve dans la console l'information comme quoi le css est bien chargé,<br>
on retrouve le fichier javascript, et on voit que vite a extrait toute la partie CSS dans un fichier séparé.<br>
Au niveau du `html` (dans le dossier ./dist), on constate que le lien vers le fichier css a été modifié.<br>
l'avantage de cette méthode : on peut modifier directement le fichier CSS et l'élément sera modifié directement<br> 
(mise a jour de la partie style mais pas de rechargement de la page complète).<br>

4. **il a également la possibilité de supporter des pré-processeurs :**<br>
par exemple, si on travaille avec SASS (`style.scss`), on aura simplement à importer le fichier en question :
```javascript
import `./style.scss`
```
Afin de compiler la syntaxe, on devra ajouter sass au projet :
```bash
npm install -D sass
```
`-D` indique qu'il s'agit d'une dépendance de développement.<br>
De cette manière, on pourra utiliser le nesting et toutes les propriétés qu'offre SASS.<br>
vite va convertir directement `.scss` en `.css` sans avoir besoin de passer par le script :
`sass --watch...`.

5. **vite supporte aussi l'import de fichiers de manière asynchrone :**<br>
A partir d'un fichier `counter.js` (qui contient par exemple une fonction JS).<br>
```javascript
import('./counter.js').then((module) => {
    module.setUpCounter(document.querySelector('button'))
})
```
De cette manière, on attend que le fichier `./counter.js` soit chargé pour utiliser le module<br>
et la fonction associée au fichier qui va dépendre du bouton sélectionné depuis le DOM.<br>
Ainsi, si on a des fichiers lourds, cela permet de séparer et d'éviter d'avoir un seul fichier JS.<br>
Le tout sera chargé de manière asynchrone, et c'est supporté nativement par vite.<br>

6. **support natif des variables d'environnement :**<br>
par exemple, en faisant des requêtes avec `fetch()` et on fait appel à une API qui se situe sur un autre domaine.<br>
On peut donc gérer ce domaine grâce à ces variables d'environnement.<br>
Pour cela, on va créer un fichier `.env` qui va être utilisé pour stocker ces variables d'environnement.<br>
Les variables qui vont être exposées à `vite` devront être préfixées par `VITE_`.<br>
On pourra avoir d'autres variables d'environnement en fonction du mode qui est utilisé par `vite`.
```javascript
VITE_API_ENDPOINT=https://local.dev 
```

On peut également créer un fichier `.env.production` qui contiendra les variables d'environnement dédiées à la production.<br>
Dans ce cas, on contacter un autre service via la variable :
```javascript
VITE_API_ENDPOINT=https://domaine.fr
```
Dans le fichier `main.js`, on aura accès à toutes ces variables en faisant :
```javascript
console.log(import.meta.env.VITE_API_ENDPOINT)
```
Pour accéder à l'un ou à l'autre, on utilisera la commande : `npm run dev` ou `npm run build`.

Si on regarde dans le dossier `./dist/assets/` le fichier `index.js`, on peut constater la modification de ce dernier avec les variables.<br>
La variable d'environnement a bien été remplacée par le nom de domaine.<br>

On peut ajouter d'autres variables d'environnement qui ne possèdent pas le préfixe `VITE_`.<br>
exemple :
```javascript
DATABASE_URL=wordpress
```
Ce procédé protège la variable : si on se sert de cette variable d'environnement pour sauvegarder des informations côté serveur,<br>
on y aura pas accès : ni en dev ni en production.<br>
On peut le constater dans le fichier `index.js` du dossier `./dist/assets/`,<br> 
ainsi que dans la console du navigateur, si on procède à :
```javascript
console.log(import.meta.env.DATABASE_URL)
```
la console renvoit `undefined`.

Cela signifie que seules les variables d'environnement débutant par `VITE_` seront publiées en clair.<br>

7. **Les plugins :**<br>
    * Lors de l'installation de vite au démarrage du projet en framework, vite va créer un nouveau fichier : `vite.config.js`.<br>
    Ce fichier va permettre de définir la configuration de vite.<br>
    A l'intérieur, il va charger un plugins correspondant à celui du framework utilisé (react, vue, etc.)<br>
    Ce plugin permettra de faire les transformations liées au framework sur lequel on souhaite créer notre application.<br>
    * on aura également à la racine du projet le fichier `.eslintrc.cjs` qui est un linter permettant de détecter si des erreurs ont été faites dans le code
    * on aura enfin un fichier `tsconfig.json` pour la configuration de typescript<br>

La présence de ces fichiers indique à vite qu'il doit utiliser ces fonctionnalités.<br>
Dans le fichier `package.json`, on constatera que de nouvelles dépendances se sont ajoutées.<br>

Vite est recommandé dès qu'on commence à travailler avec des frameworks : il est parfait pour les solutions de base.<br>

#### Intégration de vite au niveau du backend

On ira voir dans la documentation dans la partie <a href="https://vitejs.dev/guide/backend-integration.html">backend integration</a>

vite est directement intégré en laravel. mais il est possible de l'intégré avec d'autres langages backend.<br>
N.B.: Ce tuto est basé sur le langage php.<br>

Pour cela, on va commencer par :
```bash
npm init
```
cette commande va initialiser le fichier `package.json`.<br>

On va ensuite installer vite avec :
```bash
npm install -D vite
```
cette commande indiquera que vite est une dépendance de développement

Dans le fichier `package.json`, on pourra modifier les scripts :
```json
{
    "name": "server",
    "version": "1.0.0",
    "description": "index.js",
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    },
    "author": "",
    "licence": "ISC",
    "devDependencies": {
        "vite": "^4.4.9"
    }
}
```

On pourra ajouter un dossier `resources` qui contiendra notre `main.js`, ainsi qu'un `main.css`.<br>
On va après importer le css dans le `main.js` :
```javascript
import './main.css'

document.body.append('Hello world')
```
On peut ensuite lancer la commande :
```bash 
npm run dev
```
Le projet va démarrer sur le port `http://localhost:5173/`

Par la suite, au niveau du dossier `./public/` dans le fichier `index.php`, on ajoutera le code suivant :<br>
`<script src="http://localhost:5173/@vite/client" type="module"></script>`<br>
`<script src="http://localhost:5173/resources/main.js" type="module"></script>` <br>
de cette manière :
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php
    $dev = true;
    ?>
    <script src="http://localhost:5173/@vite/client" type="module"></script>
    <script src="http://localhost:5173/resources/main.js" type="module"></script>
</head>
<body>
    <p>Ceci est mon site php <?php date('d/m/y') ?></p>
</body>
</html>
```
Les deux scripts devront être chargés pour que l'application fonctionne.<br>

Afin de gérer les images qui sont en chemin relatif (intégrées via le css),<br>
Il sera nécessaire d'ajouter à la racine du projet le fameux fichier : `vite.config.js`,<br>
dans lequel on va intégrer :
```javascript
import {defineConfig} from "vite"

export default defineConfig({
    server: {
        origin: 'http://localhost:5173'
    }
    build: {
        // generate manifest.json in outDir
        manifest: true,
        rollupOptions: {
            // overwrite default .html entry
            input: 'resources/main.js',
        },
    },
})
```
* `defineConfig` est importé depuis 'vite'
* `manifest` : il s'agit d'un fichier qui va contenir le chemin vers les ressources
* `rollupOptions` : options qui vont servir au bundler qui est utilisé par vite (rollup),<br>
on lui spécifie le chemin d'entrée : `'resources/main.js'`
* pour la partie serveur, on aura la clé `server` qui contiendra `origin`<br> 
suivi de l'url qui va servir à préfixer tous les chemins absolus.<br>
On lui spécifie le serveur vite : `http://localhost:5173`.

concernant la partie build : on va devoir changer le `outDir` qui permet de spécifier le dossier dans lequel on souhaite exporter les assets.<br>
Si on ne souhaite pas rajouter de dossier supplémentaire, on ajoutera l'option : `assetsDir`.<br>
Le problème avec cette option, c'est que cela changera le chemin relatif des images.<br>
Pour palier à cela, il faudra ajouter l'option `base` suivi du chemin de base.<br>
Enfin, l'option `copyPublicDir: false` indiquera de ne pas copier le contenu du dossier `public` dans le répertoire `/assets`.

Le fichier `vite.config.js` ressemblera donc à ceci :
```javascript
import {defineConfig} from "vite"

export default defineConfig({
    server: {
        origin: 'http://localhost:5173'
    },
    base: '/assets',
    build: {
        copyPublicDir: false,
        outDir: 'public/assets',
        assetsDir: '',
        manifest: true,
        rollupOptions: {
            // overwrite default .html entry
            input: 'resources/main.js',
        },
    },
})
```

Dans le cas de notre app en PHP, il faudra intégrer la lecture de ce fichier `manifest.json` ce qui donnera ceci :
```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <?php
    $dev = true;
    if(!$dev) {
        $manifest = json_decode(file_get_contents('./assets/manifest.json'), true);
        ?>
        <script src="/assets/<?= $manifest['resources/main.js']['file'] ?>" type="module"></script>
        <link rel="stylesheet" src="/assets/<?= $manifest['resources/main.css']['file'] ?>">
        <?php
    } else {
        ?>
        <script src="http://localhost:5173/assets/@vite/client" type="module"></script>
        <script src="http://localhost:5173/assets/resources/main.js" type="module"></script>
    }
    ?>
</head>
<body>
    <p>Ceci est mon site php <?php date('d/m/y') ?></p>
</body>
</html>
```

Quel que soit le langage de programmation, la logique reste la meme :<br>
* Si on est en production : on lit le fichier manifeste et on génère les chemins vers les différentes ressources.
* Si on est en développement : on peut se baser sur le serveur de développement de vite.

Une petite subtilité si on développe en React : il faudra ajouter quelques scripts (voir la <a href="https://vitejs.dev/guide/backend-integration.html">doc</a>)

**En conclusion :**<br> 
L'intérêt de vite est le serveur de développement qui va permettre d'être extrêmement rapide.<br>
Dans la phase de dev, tous les fichiers vont être importés les uns après les autres.<br>
Lorsqu'on fait une modification sur un fichier JS, vite n'aura besoin que de compiler ce fichier,<br>
ce qui permet d'être beaucoup plus rapide par rapport à d'autres systèmes.<br>
En revanche, dans le cas du bundling, c'est l'outil `rollup` qui prend le relais :<br>
il s'agit d'un outil séparé qui permet de gérer la partie bundler.<br>
Enfin, il est possible d'utiliser l'API des plugins qui permet d'intéragir au niveau des plugins de vite<br>
et d'ajouter des comportement supplémentaires.<br>
Il existe beaucoup de plugins mais il est possible de développer son propre plugin pour des situation spécifiques.<br>


### VueJS

<a href="https://worldline.github.io/vuejs-training/fr/#prerequis">Introduction à Vue</a>

#### Rendu déclaratif

La caractéristique principale de Vue est le rendu déclaratif :<br> 
à l'aide d'une syntaxe de modèle qui étend le HTML,<br> 
nous pouvons décrire comment le HTML devrait ressembler en fonction de l'état du JavaScript.<br> 
Lorsque l'état change, le HTML est automatiquement mis à jour.

```html
<script>
export default {
  data() {
    return {
        message: "Hello World!"
    }
  }
}
</script>

<template>
  <h1>{{ message }}</h1>
</template>
```

Regarder la doc pour l'utilisation des éléments de vue.

#### Initialiser un projet Vue

```bash
npm init vue@latest
Need to install the following packages:
create-vue@3.7.5
Ok to proceed? (y) y

Vue.js - The Progressive JavaScript Framework

✔ Project name: … project-meteo
✔ Add TypeScript? … No / Yes # sélectionner No
✔ Add JSX Support? … No / Yes # sélectionner No
✔ Add Vue Router for Single Page Application development? … No / Yes # sélectionner Yes
✔ Add Pinia for state management? … No / Yes # sélectionner Yes
✔ Add Vitest for Unit Testing? … No / Yes # sélectionner No
✔ Add an End-to-End Testing Solution? › No # sélectionner No
✔ Add ESLint for code quality? … No / Yes # sélectionner No

Scaffolding project in /home/user/Cours/JS-avance/SPA_VueJS-Intro/testProject/project-meteo...

Done. Now run:

  cd project-meteo
  npm install
  npm run dev

```
Lancer les commandes :
```bash
npm install
```
cela va installer les dépendances nécessaires.<br>
puis :
```bash
npm run dev
```
Cela va lancer le projet directement avec VITE (si vie a été installé avant).