# I. INTRODUCTION

A. Qu'est-ce que TypeScript ?  
B. Problématique de JavaScript
C. Installation de TypeScript
D. Exemple de code

## A. QU'EST-CE QUE TYPESCRIPT ?

Rappel : JavaScript est un langage de programmation faiblement typé. Il est possible en JS de faire un peu n'importe quoi sur les variables et de modifier les types à la volée.  
On peut penser que cest un avantage mais cela peut devenir un gros inconvénient lorsqu'on travaille sur des projets conséquents, et en particulier avec une équipe.  
JavaScript est un langage orienté prototype et non orienté objet.  
Même si les versions ES6 et supérieures de JS apportent de nouvelles fonctionnalités comme la possibilité d'écrire du code plus orienté objet,  
il reste néanmoins un langage peu adapté à l'utilisation de la POO. 

TypeScript est un langage de programmation qui reprend et complète JavaScript. Il va permettre d'améliorer tous les défauts de JS en ajoutant de nouvelles fonctionnalités :
* Gestion des types
* Meilleure prise en charge de la Programmation Orientée Objet (POO)

Le Principal inconvénient est qu'il ne peut pas être exécuté directement par les navigateurs ou Node.JS.  
Le code doit être compilé en JavaScript (il sera possible de définir la version souhaitée du code généré).

Le principal avantage de TypeScript est de permettre l'écriture d'un code plus robuste et plus simple d'utilisation pour les développeurs (une fois maîtrisé).

## B. PROBLEMATIQUE DE JAVASCRIPT

Comme vu précédemment, JavaScript est un langage faiblement typé.  
Il est donc nécessaire de rajouter du code supplémentaire (test, conversion...) pour s'assurer qu'il n'engendre pas d'incohérences ou de bugs.

### Exemple d'incohérence : 
`fichier mainJs.js`
```JS
const nb1 = document.querySelector("#nb1");
const nb2 = document.querySelector("#nb2");

document.querySelector("#calcul").addEventListener("click", function() {
  let result = add(nb1.value, nb2.value);
  document.querySelector(".results").innerHTML=result;
})

function add(n1, n2) {
  return n1 + n2;
}
```
`fichier index.html`
```HTML
<h1>Additionner deux nombres</h1>
<div>
  <label for="nb1">Nombre 1 :</label>
  <input type="number" name="nb1" id="nb1">
</div>
<div>
  <label for="nb2">Nombre 2 :</label>
  <input type="number" name="nb2" id="nb2">
</div>
<input type="button" value="Calculer" id="calcul">
<div class="results"></div>
<script src="mainJs.js"></script>
```
_**Avec ce code, le résultat n'est pas une addition, mais une concaténation.**_  
_**La récupération d'informations dans un champs de formulaire est de type 'string' (chaîne de caractères) : si on indique 3 pour nb1 et 4 pour nb2, le résultat ne sera pas 7 mais 34.**_

Corrections possibles :
```JS
// Conversion de type :

document.querySelector("#calcul").addEventListener("click", function() {
  let result = add(parseInt(nb1.value), parseInt(nb2.value));
  document.querySelector(".results").innerHTML=result;
})

// ou 

function add(n1, n2) {
  return parseInt(n1) + parseInt(n2);
}

// ou Ajout de test :

function add(n1, n2) {
  if (typeof(n1) === "number" && typeof(n2) === "number") {
    return n1 + n2;
  } else {
    return "Les valeurs ne sont pas de type 'Number'";
  }
}

// ou combinaison conversion de type et test :

function add(n1, n2) {
  if (typeof(n1) !== "number" && typeof(n2) !== "number") {
    // Conversion implicite en type number
    // équivalent à : parseInt(n1) + parseInt(n2)
    return +n1 + +n2;
  }
  return n1 + n2;
}

```

## C. INSTALLATION DE TYPESCRIPT

Site officiel : [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

Pour installer TypeScript, il faudra installer le gestionnaise de paquet [NodeJS](https://nodejs.org/en) puis dans le terminal d'utiliser la commande suivante :  
`npm install -g typescript`

Une fois ces étapes faites, TypeScript est désormais installé de manière globale (-g).  
On peut l'utiliser dans tous les projets sur l'ordinateur.

Il est recommandé d'utiliser un IDE adapté à l'écriture du code TypeScript, tel que Visual Studio Code.

On pourra ajouter à VSCode les extentions : 
* ESLint qui permet :
    * de trouver les problèmes de syntaxe, 
    * de corriger automatiquement certains problèmes, 
    * et enfin de customiser les règles de ESLing.
* Material Icon Theme : qui permet de modifier les icones dans l'explorer.
* Path Intellisense : qui permet d'autocompléter les noms de fichiers.

## D. PREMIERS PAS EN TYPESCRIPT : Exemple de code

_voir dossier Module2 : './TP/introduction/Module2'_

`index.html`
```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <h1>Additionner deux nombres :</h1>
    <div>
      <label for="nb1">Nombre 1 :</label>
      <input type="number" name="nb1" id="nb1">
    </div>
    <div>
      <label for="nb2">Nombre 2 :</label>
      <input type="number" name="nb2" id="nb2">
    </div>
    <input type="button" value="Calculer" id="calcul">
    <div class="results"></div>
    <script src="main.js"></script>
  </body>
</html>
```
`main.ts` en ayant copié/collé le code de `mainJs.js` (vu dans le point B)
```TypeScript
const inputNb1 = document.querySelector("#nb1");
const inputNb2 = document.querySelector("#nb2");

document.querySelector("#calcul").addEventListener("click", function() {
  let result = addNumbers(inputNb1.value, inputNb2.value);
  document.querySelector(".results").innerHTML=result;
})

function addNumbers(n1, n2) {
  if (typeof(n1) !== "number" && typeof(n2) !== "number") {
    // Conversion implicite en type number
    // équivalent à : parseInt(n1) + parseInt(n2)
    return +n1 + +n2;
  }
  return n1 + n2;
}
```

en lançant la commande `tsc main.ts`, le terminal va compiler et un fichier `main.js` va apparaître.

Il va falloir faire des corrections dans le ficheir `main.ts`.
```TypeScript
const inputNb1 = document.querySelector("#nb1") as HTMLInputElement;
const inputNb2 = document.querySelector("#nb2") as HTMLInputElement;
const divResults = document.querySelector(".results") as HTMLDivElement;
const calculButton = document.querySelector("#calcul") as HTMLButtonElement;

calculButton.addEventListener("click", function() {
  const result = addNumbers(+inputNb1.value, +inputNb2.value);
  divResults.innerHTML=result.toString();    
})

function addNumbers(n1: number, n2: number): number {
  return n1 + n2;
}
```
On peut remarquer plusieurs différences : 
* On a ajouté deux variables pour récupérer les éléments du DOM : `divResults` et `calculButton`.
* Les variables initialisées au début sont toutes typées en HTML Element.
* La fonction `addNumbers` prends maintenant des paramètres typés `number` et retourne un résultat de type `number`.  
on contraint de cette manière le typage des variables qu'on passe en paramètre de la fonction.  
ainsi, on est certain de traiter des nombres pour faire notre addition.
* la fonction appelée au click pour retourner le résultat dans le DOM et qui appelle addNumbers devra obligatoirement avoir des paramètres typés `number` pour pouvoir fonctionner.  
la variable result étant typée en `number` (résultat de addNumbers), on devra ajouter la méthode `toString()` pour l'ajouter au DOM qui attend une variable de type `string`.

_N.B.: il est possible encore d'améliorer ce code_

On va pouvoir lancer de nouveau la commande `tsc main.ts` mais en ajoutant la configuration `--watch` pour que le fichier main.js soit mis à jour continuellement.

commande complète : `tsc main.ts --watch`.

voici le code généré sur main.js : 
```JavaScript
var inputNb1 = document.querySelector("#nb1");
var inputNb2 = document.querySelector("#nb2");
var divResults = document.querySelector(".results");
var calculButton = document.querySelector("#calcul");
calculButton.addEventListener("click", function () {
    var result = addNumbers(+inputNb1.value, +inputNb2.value);
    divResults.innerHTML = result.toString();
});
function addNumbers(n1, n2) {
    return n1 + n2;
}
```
Le code dans ce fichier est au format ES5, on ne voit plus les contrôles qui ont été faits dans main.ts.  
Ce n'est pas important puisque le fichier js n'est plus géré directement par le développeur.
On ne va s'intéresser qu'au fichier TypeScript.

En résumé, TypeScript a permis ici d'écrire du code plus robuste en faisant en sorte de forcer le développeur à utiliser le bon type d'informations. 