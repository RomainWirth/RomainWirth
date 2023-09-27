# VUEJS

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

Afin de tester la version build, on lancera la commande 
```bash
npm run preview
```
Cette commande va lancer un petit serveur html permettant de voir le rendu de la version build.

Ces commandes sont disponibles dans le fichier `package.json`.

Vite permet d'inclure également d'autres fichiers.<br>
Dans notre fichier JavaScript, on peut inclure d'autres fichiers grâce à l'import :
```JavaScript
import image from './image.jpg'

console.log(image)
// cela va montrer dans la console le chemin du fichier image.jpg
```

