# JAVASCRIPT INTRODUCTION
## I. NOTIONS DE BASE 
### Où utilise-t-on le JavaScript ?

Le JavaScript s'utilise dans le document html dans la balise :

```HTML
<script></script>
```
Elle est placé dans le head ou à la fin du body.<br>
Cette balise peut faire référence à un document index.js (ou script.js) pour décentraliser le code et gagner en lisibilité.<br>
Dans ce cas, la balise script du html sera comme suit :

```HTML
<script src="index.js"></script>
```

### Rappel algo

L'objectif d'un programme est de réaliser un ensemble d'instructions exécutables par un ordinateur pour répondre à un problème qu'on se pose.

Pour fonctionner, le programme a besoin de variables pour enregistrer et manipuler des données. 

### A. LES VARIABLES
#### 1. Définition

Une vrariables est un contenant utilisé pour enregistrer une donnée spécifique utile au programme pour fonctionner.<br> 
Une donnée placée dans une variable s'appelle une valeur.<br> 
Pour connaître ce à quoi correspond la variable, il faut lui donner un nom.<br>
Le nom doit indiquer ce qui se trouve à l'intérieur de la variable.

#### 2. Règles générales pour nommer une variable

* Utiliser des noms descriptifs dans l'ensemble du code : être précis et descriptif rend la vie plus facile pour lire et maintenir le code dans le temps.
* Mettre les points sur les i : en d'autres termes, éviter les abréviations ou les raccourcis de mots même lorsque c'est possible.
* Suivre une convention de nommage constante : convention la plus courrante = camelCase.

#### 3. Création d'une variable - la déclaration

Pour utiliser une variable dans le code, il faut la déclarer.<br>
En JavaScript une variable se déclare ainsi : 

```javascript
let numberOfCats = 2;
let numberOfCats = 4;
```

N.B. : auparavant, une variable se déclarait avec le mot clé "var", il a été remplacé par "let"<br> 
(rapport à la portée des variables et pour mieux lire le code, voir partie sur la portée des variables).

#### 4. Modification de la valeur d'une variable

La manière la plus simple de modifier la valeur d'une variable est simplement de la réaffecter : 

```javascript
let numberOfCats = 2;
numberOfCats = 4;
```
Notez qu'on n'utilise pas de mot clé avant la variable puisqu'elle a déjà été déclarée.

Pour modifier une variable, on va surtout employer les opérateurs arithmétiques.

#### a. Opérateurs arithmétiques - travail sur les nombres

Ces opérateurs vont permettre d'effectuer des opérations mathématiques de base : addition, soustraction, multiplication et division.

#### Addition et soustraction

Pour ajouter deux variables, on utilise le signe + .
Pour soustraire, on utilise le signe - .

Pour ajouter ou soustraire un nombre à une variable, on peut utiliser les opérateurs += et -= .

Pour ajouter ou soustraire 1 à la variable, on peut utiliser ++ ou -- .

#### Multiplication et division

Pour multiplier deux variables, on va utiliser le signe * .
Pour diviser on utilise le signe / .

De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.

#### Mutabilité des variables

Une variable est de base mutable : elle peut changer dans le temps.<br>
Elle est déclarée avec le mot clé "let", suivi de son nom et on lui affecte une valeur.

par la suite, on va pouvoir changer sa valeur autant de fois qu'on le souhaite. 

exemple avec un compteur :

De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.


Une constante est une donnée qui ne sera jamais modifiée durant l'exécution du programme. 

Il s'agit d'une variable qui n'est <strong>pas mutable.</strong><br>
On lui donnera une valeur de départ et on ne pourra plus changer sa valeur par la suite.<br> 
Une erreur sera retournée par javascript si on a une erreur logique dans notre code en changeant la valeur d'une constante.

```javascript
De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.

* string (chaîne de caractères);
* boolean (valeur logique vraie ou fausse);

Les types primitis sont les briques de base de chaque structure de données en JavaScript, peu importe la complecité finale de l'application.

En JavaScript il n'est pas important de déclarer le type d'une variable. 

### B. LES NOMBRES : LE TYPE "NUMBER"

les variables de type number peuvent être positives ou négatives.<br> 
De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.


Les booléens sont le plus simples de types primitifs : il n'y a que deux valeurs, <strong>true</strong> ou <strong>false</strong> (vrai ou faux). 

On les utilise dans toutes sortes de cas.<br> 
Indiquer si un utilisateur est connecté ou non, si une case est cochée ou non, si en ensemble de conditions particulières est réuni...

### D. LES CHAÎNES DE CARACTERES : LE TYPE "STRING"

Les chaînes de caractères sont la façon d'enregistrer du texte dans des variables JavaScript.<br> 
On peut enregistrer dans une variable de type string n'importe quelle chaîne de caractères : d'une seule lettre à un très grand nombre (jusqu'à 134 millions).

On encadre la valeur d'une variable de type string par des guillemets simples ou doubles : '' ou "".

On peut aussi concaténer (ajouter à la fin l'une de l'autre) les chaînes de caractères, grâce à l'opérateur +.

Pour simplifier la concaténation, on peut utiliser <strong>la string interpolation</strong>. On va alors utiliser le signe ` pour encadrer le texte et si on veut injecter une variable on utilise l'expression ${maVariable}.

```javascript
const myName = 'Romain';
const salutation = `Bienvenue sur mon site ${myName}!`;
console.log(salutation); // retourne "Bienvenue sur mon site Romain!" dans la console
```

Les autres opérateurs pour les chaînes seront vu plus tard.

### C. COMPRENDRE LES TYPES EN JAVASCRIPT

JavaScript est un langage dit à <i>type dynamiques et à <strong>typage faible</strong></i>.<br> 
Cela signifie qu'on peut initialiser une variable en tant que nombre et la réaffecter comme une chaîne ou tout autre type de variable. 

De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.

### A. LES OBJETS JAVASCRIPT

### Définition

Les objects JS sont écrits en <strong>JSON (JavaScript Object Notation)</strong>.<br> 
Il s'agit de séries de <strong>paires clés-valeurs</strong>, séparées par des virgules, entre accolades. On peut les enregistrer dans une variable :

```javascript
let myObject = {
    propriete1: 'valeur1',
    propriete2: 2,
    propriete3: true,
    propriete4: [{
        proprieteA: 'valeurA',
        proprieteB: 'valeurB',
        proprieteC: 5,
De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.
es valeurs peuvent avoir tout type de données : string, number, boolean, tableau d'objets...

Cela permet de regrouper les attributs d'une chose unique à un même emplacement (profil d'utilisateur, configuration d'une application, etc.).

### Accéder aux données d'un objet

Pour accéder aux données d'un objet, on va utiliser <strong>la notation pointée</strong>. 

Une fois qu'un objet est enregistré dans une variable, on peut accéder à ses données de cette manière :<br> 
(utiliser le nom de la variable, suivi d'un point ( . ) puis le nom de la clé (propriété) dont on veut récupérer la valeur)

```javascript
let myObject = {
    propriete1: 'valeur1',
    propriete2: 'valeur2',
    propriete3: 'valeur3',
};
let objectProp1 = myObject.propriete1; // renvoie : 'valeur1'
let objecyProp2 = myObjecy.propriete2; // renvoie : 'valeur2'
```
Une autre manière d'accéder aux données : <strong>La notation bracket (bracket notation)</strong>.

```javascript
let myObject = {
    propriete1: 'valeur1',
    propriete2: 'valeur2',
    propriete3: 'valeur3',
};
let objectProp1 = myObject["propriete1"]; // renvoie : 'valeur1'
let objectProp2 = myObject["propriete2"]; // renvoie : 'valeur2'
```

L'intérêt de cette notation sera qu'on va pouvoir mettre entre bracket une variable qui contient en string le nom de la propriété que l'on souhaite atteindre :

```javascript
let myObject = {
    propriete1: 'valeur1',
    propriete2: 'valeur2',
    propriete3: 'valeur3',
};
let propertyToAccess = "propriete1"; // renvoie : 'valeur1'
let objectProp2 = myObject[propertyToAccess]; // renvoie : 'valeur2'
```

### B. MANIPULER DES CLASSES

### Qu'est-ce qu'une classe ?

Une <strong>classe</strong> est un modèle pour un objet dans le code. Elle permet de construire plusieurs objects de même type<br> (appelés <strong>instances</strong> de la même classe) plus facilement, rapidement et en toute fiabilité.

Pour créer une classe dans JavaScript, on utilise le mot <strong>class</strong>, suivi par un nom. On encadre ensuite le code de la classe entre accolades { } :

```javascript
class Name {
    ...
}
```

Pour cette classe, on souhaite que chaque <i>Name</i> ait une propriété 1, propriété 2, propriété 3.

Pour cela, on va utiliser un <strong><i>constructor</i></strong>.

Le constructor d'une classe est la fonction qui est appelée quand on crée une nouvelle instance de cette classe avec le mot clé <strong>new</strong>.

```javascript
class Name {
    constructor(propriete1, propriete2, propriete3) {
        ...
    }
}
```

Pour créer une instance de la classe <strong><i>Name</i></strong>, il y a un ensemble d'instructions à suivre à l'intérieur du constructor.

Pour attribuer les propriétés reçues à cette instance, on va utiliser le mot clé <strong><i>this</i></strong> et la notation dot :

```javascript
class Name {
    constructor(propriete1, propriete2, propriete3) {
        this.propriete1 = propriete1;
        this.propriete2 = propriete2;
        this.propriete3 = propriete3;
    }
}
```

Ici, le mot clé <strong>this</strong> fait référence à la nouvelle instance. Donc il utilise la notation dot pour attribuer les valeurs reçues aux clés correspondantes.

    THIS est utilisé pour faire référence aux objets :
    JavaScript possède ce mot clé spécial : this, 
    qui peut être utilisé à l'intérieur d'une méthode 
    pour faire référence à l'objet courant.

voir memo sur <a href="#">THIS</a>

Une fois la classe terminée, on peut créer des instances par le mot clé _**new**_ :

```javascript
let myName = new Name("Toto", "Pimpin", 9);

// Cette ligne va créer l'objet suivant :
{
    propriete1: "Toto",
    propriete2: "Pimpin",
    propriete3: 9
}
```

Avec une classe _**Name**_ on peut créer facilement et rapidement de nouveaux objets _**Name**_.

## IV. REGROUPER LES DONEES AVEC LES TABLEAUX ET LES OBJETS

### A. UTILISER UN TABLEAU POUR ENREGISTRER UNE LISTE ORDONNEE D'ELEMENTS

Pour créer un tableau vide et l'enregistrer dans une variable, on utilise une paire de crochets :

```javascript
let array = [];
```

ici, on déclare la variable _**array**_ et on lui assigne un tableau vide avec les crochets **[ ]**.

On peut remplir directement le tableau lors de sa déclaration en l'initialisant avec les données :

```javascript
let array = ["valeur1", "valeur2", "valeur3", "valeur4",];
```

on peut accéder au tableau grâce à la notation brackets de cette manière :

```javascript
let firstValue = array[0]; // "valeur1"
let secondValue = array[1]; // "valeur2"
let thirdValue = array[2]; // "valeur3"
```

N.B. : l'indice (index) d'un tableau commence toujours à 0.

### B. UTILISER DES VALEURS PLUTÔT QUE DES REFERENCES

En JS, les types primitis (numbers, boolean, string) sont passés par **valeur**. 

```javascript
let firstVariable = 20;
let secondVariable = firstValue; // 20
```
c'est la valeur de la première variable qui est copiée dans la nouvelle variable, et aucun lien n'est maintenu entre mes deux variables.<br> 
C'est à dire que la seconde variable fera référence à la valeur de la première variable, et non pas à la première variable elle-même.<br>
Si la première variable est modifiée par la suite dans le code (valeur modifiée à 40), la seconde variable contiendra toujours la première valeur de la première variable (valeur reste 20).

Ce n'est pas le cas avec les objets et tableaux qui sont passés par **référence**.

voir cet <a href="https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0">article</a> (en anglais) expliqué <a href="./value_vs_reference.md">ici</a>.

### C. TRVAILLER SUR LES TABLEAUX

Les tableaux sont très puissants et ont beauocup d'attributs et de méthodes utiles. Voici quelques-uns d'entre eux :

#### Le Comptage d'Eléments

La propriété _length_ d'un tableau indique le nombre d'éléments qu'il contient :

```javascript
let array = ["valeur1", "valeur2", "valeur3"];
let arraySize = array.length; // 3
```

On utilise la notation dot pour accéder à la propriété _length_ du tableau.<br>
Cela est particulièrement utile lorsqu'on ne connaît pas le nombre d'éléments du tableau.

#### L'ajout et la suppression d'éléments

Pour **ajouter** un élément à la fin du tableau, on utilise la méthode _push_ :

```javascript
let array = ["valeur1", "valeur2", "valeur3"];
array.push("valeur4"); // le tableau aura un élément supplémentaire à la fin
```
On utilise la notation dot pour accéder à la méthode _push_ du tableau et placer l'élément à ajouter entre parenthèses.

Pour ajouter un élément au début du tableau, on utilisera la méthode _unshift_ à la place de push.

Pour **supprimer** le dernier élément d'un tableau, on va appeler la méthode _pop_, dans passer aucun argument :

```javascript
let array = ["valeur1", "valeur2", "valeur3"];
array.pop(); // supprimera la valeur3 du tableau
```

