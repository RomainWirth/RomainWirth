# JAVASCRIPT INTRODUCTION
## I. NOTIONS DE BASE 
### Où utilise-t-on le JavaScript ?

Le JavaScript s'utilise dans le document html dans la balise :
```HTML
<script></script>
```
Elle est placé dans le head ou à la fin du body.
Cette balise peut faire référence à un document index.js (ou script.js) pour décentraliser le code et gagner en lisibilité. 
Dans ce cas, la balise script du html sera comme suit :
```HTML
<script src="index.js"></script>
```

### Rappel algo

L'objectif d'un programme est de réaliser un ensemble d'instructions exécutables par un ordinateur pour répondre à un problème qu'on se pose.

Pour fonctionner, le programme a besoin de variables pour enregistrer et manipuler des données. 

### A. LES VARIABLES
#### 1. Définition

Une vrariables est un contenant utilisé pour enregistrer une donnée spécifique utile au programme pour fonctionner. 
Une donnée placée dans une variable s'appelle une valeur. 
Pour connaître ce à quoi correspond la variable, il faut lui donner un nom.
Le nom doit indiquer ce qui se trouve à l'intérieur de la variable.

#### 2. Règles générales pour nommer une variable

* Utiliser des noms descriptifs dans l'ensemble du code : être précis et descriptif rend la vie plus facile pour lire et maintenir le code dans le temps.
* Mettre les points sur les i : en d'autres termes, éviter les abréviations ou les raccourcis de mots même lorsque c'est possible.
* Suivre une convention de nommage constante : convention la plus courrante = camelCase.

#### 3. Création d'une variable - la déclaration

Pour utiliser une variable dans le code, il faut la déclarer.
En JavaScript une variable se déclare ainsi : 

```javascript
let numberOfCats = 2;
let numberOfCats = 4;
```

N.B. : auparavant, une variable se déclarait avec le mot clé "var", il a été remplacé par "let" (rapport à la portée des variables et pour mieux lire le code, voir partie sur la portée des variables).

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

Une variable est de base mutable : elle peut changer dans le temps.
Elle est déclarée avec le mot clé "let", suivi de son nom et on lui affecte une valeur.

par la suite, on va pouvoir changer sa valeur autant de fois qu'on le souhaite. 

exemple avec un compteur :

```javascript
let compteur = 0;
compteur++;
compteur = 10;
```

### B. LES CONSTANTES

Une constante est une donnée qui ne sera jamais modifiée durant l'exécution du programme. 

Il s'agit d'une variable qui n'est <strong>pas mutable.</strong>
On lui donnera une valeur de départ et on ne pourra plus changer sa valeur par la suite. Une erreur sera retournée par javascript si on a une erreur logique dans notre code en changeant la valeur d'une constante.
```javascript
const nombreDePostParPage = 20;
nombreDePostParPage = 30; // retournera une erreur dans la console car on ne peut pas changer sa valeur
```


## II. ENREGISTRER DES DONNEES AVEC DES TYPES DE DONNEES

### A. QU'EST-CE QU'UN TYPE DE DONNEES

Le type d'une variable est le genre de données qu'elle enregistre. 
En JavaScript, il existe 3 types primitifs principaux :
* number (number);
* string (chaîne de caractères);
* boolean (valeur logique vraie ou fausse);

Les types primitis sont les briques de base de chaque structure de données en JavaScript, peu importe la complecité finale de l'application.

En JavaScript il n'est pas important de déclarer le type d'une variable. 

### B. LES NOMBRES : LE TYPE "NUMBER"

les variables de type number peuvent être positives ou négatives. Ces variables peuvent être des nombres entiers ou décimaux. 

N.B. : en programmation, les nombres entiers sont aussi appelés (entiers ou) integers et les nombres décimaux sont appelés (virgule flottante ou) floating-point.

Il faut faire attention aux floating-point qui peut provoquer des erreurs en langage de programmation. 

Quand c'est possible, il est préférable d'utiliser des calculs entiers (pour de calculs de prix, il est préférable de calculer en centimes).

### C. LES VALEURS LOGIQUES : LE TYPE "BOOLEAN"

Les booléens sont le plus simples de types primitifs : il n'y a que deux valeurs, <strong>true</strong> ou <strong>false</strong> (vrai ou faux). 

On les utilise dans toutes sortes de cas. Indiquer si un utilisateur est connecté ou non, si une case est cochée ou non, si en ensemble de conditions particulières est réuni...

### D. LES CHAÎNES DE CARACTERES : LE TYPE "STRING"

Les chaînes de caractères sont la façon d'enregistrer du texte dans des variables JavaScript. 
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

JavaScript est un langage dit à <i>type dynamiques et à <strong>typage faible</strong></i>. Cela signifie qu'on peut initialiser une variable en tant que nombre et la réaffecter comme une chaîne ou tout autre type de variable. 

Cela permet une grande souplesse, mais comporte des risques de comportement inattendu si on ne fait pas attention. 

En résumé, il vaut mieux utiliser des constantes lorsque cela est possible afin d'éviter les erreurs intempestives. 

## III. DEFINIR DES OBJETS ET LEURS ATTRIBUTS AVEC DES CLASSES

## A. LES OBJETS JAVASCRIPT

### Définition

Les objects JS sont écrits en <strong>JSON (JavaScript Object Notation)</strong>. Il s'agit de séries de <strong>paires clés-valeurs</strong>, séparées par des virgules, entre accolades. On peut les enregistrer dans une variable :

```javascript
let myObject = {
    propriete1: 'valeur1',
    propriete2: 2,
    propriete3: true,
    propriete4: [{
        proprieteA: 'valeurA',
        proprieteB: 'valeurB',
        proprieteC: 5,
        proprieteD: false
    }, {
        proprieteA: 'valeurE',
        proprieteB: 'valeurF',
        proprieteC: 5,
        proprieteD: false
    }]
}
```
Chaque clé est une chaîne (propriete1, propriete2, propriete3...) et les valeurs peuvent avoir tout type de données : string, number, boolean, tableau d'objets...

Cela permet de regrouper les attributs d'une chose unique à un même emplacement (profil d'utilisateur, configuration d'une application, etc.).

### Accéder aux données d'un objet

Pour accéder aux données d'un objet, on va utiliser <strong>la notation pointée</strong>. 

Une fois qu'un objet est enregistré dans une variable, on peut accéder à ses données de cette manière (utiliser le nom de la variable, suivi d'un point ( . ) puis le nom de la clé (propriété) dont on veut récupérer la valeur ):

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

## B. MANIPULER DES CLASSES

### Qu'est-ce qu'une classe ?

Une <strong>classe</strong> est un modèle pour un objet dans le code. Elle permet de construire plusieurs objects de même type (appelés <strong>instances</strong> de la même classe) plus facilement, rapidement et en toute fiabilité.

