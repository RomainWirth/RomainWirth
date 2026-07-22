# II. LES TYPES

A. Les Variables et les Types : ES5 à TS
B. TypeScript et les types
C. Les fonctions et callback
D. Le type "any"
E. L'Union
F. Surcharge de fonction
G. Les Tableaux
H. Les types prédéfinis
I. Les Objets et les interfaces
J. L'union et les objets
K. Líntersection
L. Typage de propriétés
M. Le type énumération
N. Autres fonctionnalités

## A. LES VARIABLES ET LES TYPES : ES5 À TS

### RAPPEL : les types de base en JavaScript ES5 et ES6

version `ES5`
```JavaScript
// déclaration de variables :
var firstName = "Mario";
var age = 30;
var sex = true; // true = homme, false = femme
var occupation = "Plumber";
var sport = ["Tenis", "Karting"];
var address = {
    street: "123 rue des champs",
    city: "Paris",
    zip: 75000
};

function displayCharacter(_firstName, _age, _sex, _occupation, _sports, _address) {
  console.log("It's me " + _firstName);
    console.log("I am " + _age + " years old.");
    console.log("I am a " + (_sex ? "man" : "woman"));
    console.log("My job is " + _occupation); 
    for (var sport of _sports) {
      console.log("I like " + sport);
    }
    console.log("I live at : ");
    console.log(_address.street);
    console.log(_address.zip);
    console.log(_address.city);
}

displayCharacter(firstName, age, sex, occupation, sport, address);
```
En JavaScript, les types des variables sont définis par leur contenu : 
* firstName et occupation sont considérées de type `string`.
* age est considérée de type `number`.
* sex est considérée de type `boolean`. 
* sport est un array contenant des variables considérées de type `string`.
* address est un objet contenant des variables considérées de type `string` et `number`.

Le problème avec cette syntaxe est qu'il est possible de faire une conversion de type d'une variable.  

exemple : 
```JS
var firstName = "Mario";
console.log(typeof firstName); // output => string
firstName = 30;
console.log(typeof firstName); // output => number
```
Cela est problématique car des erreurs ou des incohérences peuvent être occasionnées lors de l'exécution d'un programme.

version `ES6`
```JavaScript
// déclaration de variables :
let firstName = "Mario";
let age = 30;
let sex = true; // true = homme, false = femme
let occupation = "Plumber";
const sport = ["Tenis", "Karting"];
const address = {
    street: "123 rue des champs",
    city: "Paris",
    zip: 75000
};

const displayCharacter = (_firstName, _age, _sex, _occupation, _sports, _address) => {
  console.log(`
    It's me ${_firstName},
    I am ${_age} years old ${(_sex ? "man" : "woman")}.
    My job is ${_occupation}.
    I like ${_sports[0]} and ${_sports[1]}.
    I live at :
    ${_address.street},
    ${_address.zip}
    ${_address.city}
  `);
}

displayCharacter(firstName, age, sex, occupation, sport, address);
```
## B. TYPESCRIPT ET LES TYPES

Modifions maintenant le code avec TypeScript : 
```TypeScript
// déclaration de variables :
let firstName: string = "Mario";
let age: number = 30;
let sex: boolean = true; // true = homme, false = femme
let occupation: string = "Plumber";
const sport: Array<string> | string[] = ["Tenis", "Karting"];
const address: {
  street: string; 
  city: string; 
  zip: number
} = {
  street: "123 rue des champs",
  city: "Paris",
  zip: 75000
};

const displayCharacter = (
  _firstName: string, 
  _age: number, 
  _sex: boolean, 
  _occupation: string, 
  _sports: Array<string> | string[], 
  _address: {
    street: string; 
    city: string; 
    zip: number
}) => {
  console.log(`
    It's me ${_firstName},
    I am ${_age} years old ${(_sex ? "man" : "woman")}.
    My job is ${_occupation}.
    I like ${_sports[0]} and ${_sports[1]}.
    I live at :
    ${_address.street},
    ${_address.zip}
    ${_address.city}
  `);
}

displayCharacter(firstName, age, sex, occupation, sport, address);
```

* Les variables initialisées sont toutes typées.  
À noter que les variables firstName, age, sec ou occupation n'ont pas besoin d'avoir leur type précisé.  
Le type est induit directement lors de l'initialisation grâce à la valeur contenue dans la variable.  
Il faut également noter qu'il sera impossible de modifier le type de la variable en assignant une valeur d'un autre type.  

exemple : 
```
let firstName = "Mario";
firstName = 30; // => impossible avec typescript, une erreur sera générée.
```

* les paramètres de la fonction doivent également être typés.  
Ainsi, on oblige l'utilisateur de la fonction de passer des paramètres qui ne correspondent pas au types attendus.

### Typage implicite vs explicite

pour déclarer une variable en typescript, il n'est pas nécessaire d'écrire le type d'une variable.  
Il est directement induit grâce à la valeur : `let name: string = "Tom";` est équivalent à `let name = "Tom";`.  
L'ajout du type permet d'identifier plus rapidement le type de la variable.

Il est également possible de déclarer différemment une variable : 
```TypeScript
let name: string;
name = "Tom";
```
Cependant, si dans ce cas de figure on ne précise pas le type de la variable, cette dernière prendra le type `any`, et on pourra lui assigner n'importe quelle valeur.
```TypeScript
let name; // any induit
name = "Tom";
name = 31;
```
En procédant ainsi, on perd tout l'intérêt de TypeScript. 

## C. LES FONCTIONS

### Syntaxes possibles : 
```TypeScript
// 1.
function myFunction(param1: type1, param2: type2): returnType {
  ...
}

// 2. fonction anonyme placée dans une variable
var myFunction = function(param1: type1, param2: type2): returnType {
  ...
}

// 3. fonction fléchée
let myFunction = (param1: type1, param2: type2): returnType => {
  ...
}
const myFunction = (param1: type1, param2: type2): returnType => {
  ...
}
```
Avec les dernière conventions, on préférera pour la version 2 et 3 l'utilisation de `const` à la place de `var` et `let`.

`returnType` : le type de la valeur retournée peut-être un type simple ou complexe, ou encoire le vide (void).  
le type void indique que la fonction est une procédure et ne retourne rien.
```TypeScript
let age: number = 30;
const birthday = (_age: number): number => {
  return _age + 1;
}

let newAge: number;
newAge = birthday(age);
console.log("new age : " + newAge); // output : "new age : 31"
```
Cette fonction prends en paramètre une variable de type number, et doit retourner obligatoirement une valeur de type number.  
Si je précise le type retourné, je dois obligatoirement utiliser le mot clé `return` avec le résultat du type attendu.

Il est bien évidemment possible de renseigner une valeur par défaut au paramètre : 
```TypeScript
const birthday = (_age: number = 17): number => {
  return _age + 1;
}

let newAge: number;
newAge = birthday();
console.log("new age : " + newAge); // output : "new age : 18"
```
Cela signifie que si on ne passe pas d'argument à la fonction, alors la fonction prendra par défaut la valeur déclarée (ici, 17).

On pourra remarquer la différence sur la compilation dans le fichier `main.js`.
Lorsque la valeur par défaut n'est pas renseignée :
```JavaScript
var birthday = function (_age) {
    return _age + 1;
};
var newAge;
newAge = birthday(age);
console.log("new age : " + newAge);
```
Lorsque la valeur par défaut est renseignée : 
```JavaScript
var birthday = function (_age) {
    if (_age === void 0) { _age = 17; }
    return _age + 1;
};
var newAge;
newAge = birthday();
console.log("new age : " + newAge);
```

Concernant le fichier main.js, il est possible de définir la version compilée souhaitée.  
Par défaut, on sera sur une version ES5, mais on peut préciser ES6 lors de l'exécution de la commande : `tsc main.ts --target es6 --watch`
```JavaScript
const birthday = (_age = 17) => {
    return _age + 1;
};
let newAge;
newAge = birthday(age);
console.log("new age : " + newAge);
newAge = birthday();
console.log("new age : " + newAge);
```
Dans la version compilée du fichier `main.js`, le paramètre _age est écrit avec la valeur par défaut.  
Cette syntaxe n'est apparue qu'à partir de ES6.  
On peut également voir que la fonction compilée est une fonction flechée.

### Les fonctions de rappel : les callbacks

_**Rappel** : Une callback est juste une fonction passée en paramètre à une autre fonction, qui sera appelée plus tard, souvent pour gérer une suite d’opérations ou une réponse._

Une **fonction callback** (fonction de rappel) est une fonction que l'on passe en argument à une autre fonction. Elle sera **appelée (exécutée) plus tard** par cette fonction.

Les fonctions callbacks sont utilisées quand une action prend du temps (ex: chargement d'un fichier, attente d'une réponse, etc.).  
Elles permettent de dire " quand tu as fini, exécute cette fonction".

#### Le Type "Function"

Il est possible de déclarer des variables ayant un type "Function".
```TypeScript
const birthday = (_age: number): number => {
  return _age + 1;
}

let myFunction: Function;
myFunction = birthday;
let newAge = myFunction(10);
console.log(newAge); // output => 11
```
La syntaxe ci dessus peut provoquer une perte d'information.  
Il serait préférable de préciser les types de la fonction : 
```TypeScript
let myFunction = (nb: number) => number; 
```
En procédant ainsi, on indique que myFunction prendra obligatoirement un paramètre de type number et retournera un number.

Cette syntaxe peut-être intéressante avec les fonctions de rappel (callback).

#### Function et callback

Les fonctions de rappel (callback) s'utilisent dans d'autres fonctions. 
```TypeScript
const myCallback = (result: number): void => {
  console.log(result)
};

const add = (nb1: number, nb2: number, callback: (n: number) => void) => {
  let res = nb1 + nb2;
  callback(res);
}

add(10, 15, myCallback);
// output : 25
```

En reprenant notre exemple : 
```TypeScript
const birthday = (_age: number = 17): number => {
  return _age + 1;
}

let test: (nb: number) => number;
test = birthday;
test(20);
```
test devra prendre obligatoirement un paramètre de type number pour pouvoir fonctionner.  
si on fait appel à `test()` sans lui passer d'argument, alors typescript nous renverra une erreur.  

On ne peut également pas mettre de valeur par défaut lors d'un typage de type fonction :  
`let test: (nb: number = 17) => number;` => ce n'est pas permis.

Tant que la signature de notre fonction callback correspond au type souhaité, on peut appeler d'importe quelle callback : 
```TypeScript
const myCallback = (result: number): void => {
  console.log(`Result is : ${result}.`);
}
const myOtherCallback = (result: number): void => {
  console.log(`Result multiplied by 2 is : ${result * 2}.`);
}

const displayAddNumbers = (_n1: number, _n2: number, callback: (_n: number) => void): void => {
  const result = _n1 + _n2;
  callback(result);
}

displayAddNumbers(10, 15, myCallback);

displayAddNumbers(10, 15, myOtherCallback);
```
La fonction `displayAddNumbers` récupère une fonction dans ses paramètres.  
Cette fonction prends en `paramètre` une `variable` de type `number` et retourne `void`.  
Ainsi, on peut appeler n'importe quelle fonction qui correspond à cette signature : `myCallback` et `myOtherCallback`.

## D. LE TYPE "ANY"

Le type `any` veut dire "n'importe quoi". Cela signifie qu'il peut être utilisé pour obtenir une variable pouvant "changer" de type.  

L'utilisation de ce type est **vivement déconseillé** afin d'éviter de perdre les avantages et l'intérêt du langage TypeScript.  

exemple : 
```TypeScript
let varAny: any;
varAny = "Mario";
console.log(typeof varAny); // output => string
varAny = 10;
console.log(typeof varAny); // output => number
```

Les paramètres non typés d'une fonction sont également de type "any" par défaut. 

Parfois, il sera intéressant de l'utilisater, notamment avec des tableaux.
exemple : 
```TypeScript
let firstName = "Mario";
let age = 32;
let sex = true;
const sports = ["tennis", "karting"];
const address = {
  street: "10 rue des lilas",
  city: "Paris",
  zipCode: 75000,
};

const character = [firstName, age, sex];

function displayCharacter(character: any[]): void {
  for (let value of character) {
    console.log(value);
  }
}
```

## E. L'UNION (PIPE `|`)

Une variable peut être définie comme pouvant contenir des valeurs de types différents à l'aide du symbole de l'union (pipe : `|`).

exemple : 
```TypeScript
let varUnion: string | number = 10;
console.log(varUnion); // output 10
varUnion = "Mario";
console.log(varUnion); // ouput Mario
```

Une fonction peut également retourner des valeurs de type différent.
On pourra spécifier les types retournés de la même manière que pour la variable.

exmple : 
```TypeScript
const test = (_input: number | boolean): number | string => {
  if (typeof _input === "number") {
    return _input;
  } else if (typeof _input === "boolean") {
    return _input ? "Homme" : "Femme";
  }
}

console.log(test(33)); // output = 33
console.log(test(false)); // output = Femme
```

## F. SURCHARGE DE FONCTION

Les surcharges de fonctions permettent de définir des fonctions génériaques qui peuvent ensuite être utilisées de manière plus précise grâce à la surcharge de fonction.
Grâce à cette fonctionnalité, TypeScript sera capable de détecter le type d'informations retournées.

exemple : 
```TypeScript
let firstName = "Mario";
let age = 32;
let sex = true;
const sports = ["tennis", "karting"];
const address = {
  street: "10 rue des lilas",
  city: "Paris",
  zipCode: 75000,
};

function add(e1: number | string, e2: number | string): number | string {
  if (typeof e1 === 'number' && typeof e2 === 'number') {
    return e1 + e2;
  }

  return e1.toString() + " " + e2.toString();
}

let sum = add(5,15);  
```
fonction basique "add" qui permet soit de faire de la concaténation si on envoit des informations de type chaîne de caratères (string), soit un calcul, une addition si les informations transférées sont de type number.
Si on utilise pas la notion de surcharge de fonction ici, TypeScript va perdre le type et ne sera pas comment bien utiliser l'information retournée.

Dans notre exemple, on sait intuitivement que 'sum' retourne une variable de type number. 
Pourtant, dans l'état actuel, TypeScript n'est pas capable d'identifier qu'il s'agit d'un number. 
En effet, la fonction add retourne soit un 'number' soit une 'string' (`number | string`).
Il sera donc impossible d'utiliser une méthode qui va utiliser une variable de type number sur la variable `sum`, comme `Math.floot(sum)`. 

Pour corriger ce problème, on va utiliser la surcharge de fonction : `function add(e1: number, e2: number): number;`.
Cela indique que si les paramètres de la fonction sont de type number, la fonction va retourner un résultat de type number.
La surcharge de fonction se déclare au dessus de la fonction concernée.
```TypeScript
function add(e1: number, e2: number): number;
function add(e1: number | string, e2: number | string): number | string {
  if (typeof e1 === 'number' && typeof e2 === 'number') {
    return e1 + e2;
  }

  return e1.toString() + " " + e2.toString();
}
```

De la même manière, on pourra faire une autre surcharge de fonction pour le type string : `function add(e1: string, e2: string): string;`.
Cela permettra d'écrire ceci : 
```TypeScript
let concat = add("Mario", "Bros.");
```
Ainsi, on pourra utiliser les méthodes javascript sur les strings sur la variable concat comme `concat.toUpperCase()`.

Comme la surcharge comprenant une variable de type number et une variable de type string n'existe pas, on ne pourra pas mélanger les types des variables en paramètres : `let test = add("Mario", 10);` fera planter le programme.

## G. LES TABLEAUX

TypeScript offre plus de possibilités en ce qui concerne les tableaux.
Comme en JavaScript, on va pouvoir définir des tableaux de type simple, c'est à dire contenant "string", "number", "boolean", ou alors des tableaux de type complexes, à savoir réaliser des tableaux de tableaux, des tableaux contenant des objets JavaScript ou des tableaux contenant des objets issus de classes.

Lors de la déclaration de la variable, on pourra indiquer explicitement le type souhaité ou bien laisser TypeScript le détecter automatiquement à partir de l'initialisation de la variable.
Grâce au symbole de l'union `|`, il sera possible de faire des tableaux contenant uniquement des valeurs de certains types : 
```TypeScript
let tab: (number | string)[];
tab = ["Mario", 5];
tab[0] = "Luigi";
tab[1] = 10;
```

On peut également combiner des tableaux de type `any`, même s'il est préférable d'éviter cette solution dès lors que c'est possible. En effet, any revient à faire du JavaScript.

On peut aussi déclarer des tableaux de taille fixe, qu'on appelle des `tuple`. La taille ainsi que les types seront fixes et il sera impossible de modifier ces caractéristiques. 
```TypeScript
let tabTuple: [string, number] = ["Mario", 10]; // la tableau contient deux éléments : index 0 de type string et index 1 de type number. 
tabTuple[0] = 10; // retourne une erreur : la variable à l'index 0 est de type string.
tabTuple[2] = 12; // retourne une erreur : le tableau a une taille de 2, l'index max est 1.

let tabTriple: [string, number, boolean] = ["Mario", 10, true];
console.log(tableTriple);
```

Un tuple est fixe et est donc beacoup moins polyvalent qu'un tableau : 
```TypeScript
const player: (string | number)[] = ["John", 30]; // Peut aussi être déclaré [30, "John"] ou encore [10, "John", 40]
const playerTuple: [number, string] = ["John", 30]; // retourne une erreur : la variable à l'index 0 est de type number et à l'index 1 est de type string.
const playerTupleCorrect: [string, number] = ["John", 30];
```
le tableau player peut contenir soit des variables de type `string`, soit des variables de type `number` dans n'importe quel ordre, et peut être de la taille qu'on souhaite : 1, 2, 10 éléments.

On peut aussi déclarer des tableaux d'objets : 
```TypeScript
const coordinates: {x: number, y: number}[] = [
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    { x: 50, y: 60 }
];
```

## H. LES TYPES PRÉDÉFINIS

En TypeScript, il est possible de créer ses propres types. Cette fonctionnalité est associée aux objets.
Par exemple, on peut créer un type `Address` qui sera un objet contenant plusieurs caractéristiques : `street` de type string, `city` également de type string, et `postalCode` de type number.
```TypeScript
const Address = {
  street: string,
  city: string,
  postalCode: number
};
```

On pourra ensuite utiliser ce type prédéfini pour renseigner un objet : 
```TypeScript
const address: Address = {
  street: "rue des mouettes",
  city: "LALALAND",
  postalCode: 12345
}

const displayAddress = function (_address: Address): void {
  console.log("Rue : " + address.street);
  console.log("Code postal : " + address.postalCode);
  console.log("Ville : " + address.city);
}
```

## I. LES OBJETS ET LES INTERFACES

Les interfaces sont également des déclarations de type prédéfini : 
```TypeScript
type Character = {
  name: string;
  sex: string;
  class: string;
  strength: number;
  healthPoints: number;
  manaPoints: number;
}

interface Character {
  name: string;
  sex: string;
  class: string;
  strength: number;
  healthPoints: number;
  manaPoints: number;
}
```

L'interface permettent d'effectuer le même travail que le type.
Par contre, le mot clé `type` est plus flexible : il permet d'effectuer des unions, des intersections, etc.
Le mot clé interface permet, quand à lui, de préciser qu'on travaille avec des objets et des classes, c'est pour cela qu'on choisira en règle générale de créer des interfaces pour être utilisées avec des classes et des objets. L'utilisation de `type` est plutôt associé avec des types simples.

Par convention, dès lors qu'on utilise des objets et des classes, on utilisera le mot clé `interface`, et si on doit définir des types un peu plus simple, on pourra utiliser le mot clé `type`.

## J. L'UNION ET LES OBJETS

L'union `|` peut s'utiliser autant sur le typage que sur les objets (même fonctionnement avec les interfaces) : 
```TypeScript
type Character = {
  name: string;
  sex: boolean;
  strength: number;
  healthPoints: number;
  manaPoints: number;
}

type Hero = {
  name: string;
  class: string;
}

type Player = Character | Hero;
```

Lorsqu'on réalise une fonction pour afficher un objet d'un type ayant utilisé une union, il est nécessaire de faire des vérifications sur les propriétés. 
Pour cela, on utilisera le mot clé `in` :
```TypeScript
function displayPayer(player: Player): void {
  console.log("name : " + player.name);
  if("age" in player) {
    console.log("age : " + player.age);
    console.log("sex : " + (player.sexe ? "Male" : "Female"));
  }
  if ("class" in player) {
    console.log("character class : " + player.class);
  }
}
```

On peut aussi utiliser le mot clé `extends` pour qu'un type hérite d'un autre type : 
```TypeScript
interface Character {
  name: string;
  sex: boolean;
  healthPoints: number;
}

interface Hero extends Character {
  age: number;
  class: string;
}

interface Monster extends Character {
  type: string;
}
```

Pour faciliter l'utilisation de type Union sur des objets, on pourra rajouter une propriété permettant de faire la distinction de type : le type littéral.
Le type littéral permet de définir des propriétés d'objet, ou même une variable comme ayant une valeur fixe.
```TypeScript
interface Animal {
  family: "animal";
  name: string;
}

interface Bird extends Animal {
  class: "bird";
  hasWings: boolean;
  canFly: boolean;
}

interface Fish extends Animal {
  class: "fish";
  hasBranchia: boolean;
  canBreatheUnderWater: boolean;
}

type Wildlife = Bird | Fish;

function displayWildLife(_wildlife: Wildlife) {
  console.log("Family : " + _wildlife.family);
  if (_wildlife.class === "bird") {
    console.log("Can fly : " + _wildlife.canFly);
  }
  if (_wildlife.class === "fish") {
    console.log("Can swim : " + _wildlife.canBreatheUnderWater)
  }
}
```
Écrit de manière plus efficace : 
```TypeScript
const Class = "fish" | "bird";

interface Animal {
  family: "animal";
  class: Class;
  name: string;
}

interface Bird extends Animal {
  class: "bird";
  hasWings: boolean;
  canFly: boolean;
}

interface Fish extends Animal {
  class: "fish";
  hasBranchia: boolean;
  canBreatheUnderWater: boolean;
}

```
<!-- Mes exemples ne sont pas efficace... il faut les modifier -->

## K. L'INTERSECTION

L'intersection permet de combiner les types à l'aide de l'opérateur `&`. Ainsi, si une variable combine deux types avec l'intersection, il sera alors des deux types.
```TypeScript
type Animal = {
  family: "animal";
  class: Class;
  name: string;
}

type Bird = {
  class: "bird";
  hasWings: boolean;
  canFly: boolean;
}

type duck = Bird & Animal;
```

Ce type ne sera réellement utilisable qu'avec des objets. 
L'intersection permet de créer de nouveaux types en combinant des types existants, le nouveau type ayant toutes les caractéristiques réunies des types qui lui sont déclarés.

Concernant la déclaration avec le mot clé `interface`, la syntaxe sera légèrement différente, en utilisant le mot clé `extends`.
Extends va créer un héritage sur les interfaces concernées, séparées par des virgules : `interface duck extends Animal, Bird {};`.

> N.B.: Lorsqu'on va écrire des classes et qu'on voudra étendre une classe mère ou une interface, on ne pourra le faire que sur une seule. Cependant, il sera possible de le faire sur autant d'interfaces que nécessaire.

exemple avec type :
```TypeScript
type Character = {
  name: string;
  age: number;
}

type Human = {
  name: string; // redondant et inutile dans notre exemple
  class: string;
}

type Male = Character & Human;

const mario: Male = {
  name: "Mario",
  age: 30,
  class: "plumber",
}
```

exemple avec interface :
```TypeScript
interface Character {
  name: string;
  age: number;
}

interface Human {
  class: string;
}

interface Male extends Character, Human {};

const mario: Male = {
  name: "Mario",
  age: 30,
  class: "plumber",
}
```
Cette syntaxe n'est pas forcément ce qu'il faut utiliser en permanence. Il faut adapter selon le contexte, si par exemple on souhaite utiliser de manière dissociée un type. 

Dans notre exemple, ce n'est pas le plus pertinent, puisqu'on pourrait écrire plus simplement de cette manière : 
```TypeScript
interface Character {
  name: string;
  age: number;
}

interface Human extends Character {
  class: string;
}

const mario: Human = {
  name: "Mario",
  age: 30,
  class: "plumber",
}
```

## L. TYPAGE DE PROPRIÉTÉS

Typescript offre une autre possibilité liée aux objets : la déclaration d'une propriété dynamique. 
Cela permet d'ajouter autant de propriétés de nécessaire à l'objet de manière dynamique après son initialisation, sans pour autant que cela soit défini à l'avance. 

Lorsque l'on défini un objet par l'intermédiaire du mot clé `type`, ou via une interface, il est possible de définir le type de propriété que pourra contenir l'objet : 
```TypeScript
type Error = {
  code: string;
  [props: string]: string;
}
```
Dans cet exemple, les objets de type `error` pourront avoir autant de propriétés que nécessaire, mais toutes du type string.

```TypeScript
const notFound: Error = {
  code: "404",
  message: "Oups, page doesn't exists",
  image: "page404.jpg"
}

const serverError: Error = {
  code: "500",
  message: "Internal server error",
}
```

## M. LE TYPE ÉNUMÉRATION



## N. AUTRES FONCTIONNALITÉS
