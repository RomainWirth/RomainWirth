# 2. Les types

## Sommaire

- [Rappel express : le typage en JavaScript vs TypeScript](#rappel-express--le-typage-en-javascript-vs-typescript)
- [Typage implicite et typage explicite](#typage-implicite-et-typage-explicite)
- [Les types primitifs et le type `any`](#les-types-primitifs-et-le-type-any)
- [Typer un objet](#typer-un-objet)
- [Le typage structurel (duck typing)](#le-typage-structurel-duck-typing)
- [Créer ses propres types avec `type`](#creer-ses-propres-types-avec-type)
- [Les fonctions typées](#les-fonctions-typees)
- [Les callbacks et le typage de fonction](#les-callbacks-et-le-typage-de-fonction)
- [L'union de types](#lunion-de-types)
- [La surcharge de fonctions](#la-surcharge-de-fonctions)
- [Les tableaux et les tuples](#les-tableaux-et-les-tuples)
- [`type` ou `interface` ?](#type-ou-interface-)
- [Union, intersection et héritage sur les objets](#union-intersection-et-heritage-sur-les-objets)
- [Propriétés dynamiques (index signatures)](#proprietes-dynamiques-index-signatures)
- [Le type énumération `enum`](#le-type-enumeration-enum)
- [`unknown` et `never`](#unknown-et-never)
- [Autres opérateurs utiles : `!`, `as`, `?`, `??`](#autres-operateurs-utiles----as---)
- [Typer les promesses et l'asynchrone](#typer-les-promesses-et-lasynchrone)
- [Compléments : `readonly`, `keyof`, `satisfies` et `as const`](#complements--readonly-keyof-satisfies-et-as-const)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Rappel express : le typage en JavaScript vs TypeScript

Comme tu connais déjà bien JavaScript, tu sais qu'en `ES5`/`ES6` le type d'une variable est déduit de son contenu, sans aucune vérification :

```javascript
let firstName = "Mario";
console.log(typeof firstName); // "string"
firstName = 30;
console.log(typeof firstName); // "number", ça compile sans problème
```

Avec TypeScript, tu peux (mais tu n'es pas obligé de) préciser le type au moment de la déclaration, avec la syntaxe `nomVariable: type` :

```typescript
let firstName: string = "Mario";
let age: number = 30;
let isConnected: boolean = true;

firstName = 30; // Erreur TS : Type 'number' is not assignable to type 'string'
```

Une fois qu'une variable est typée (explicitement ou non), il devient impossible de lui assigner une valeur d'un autre type. C'est exactement ce qui manque à JavaScript.

## Typage implicite et typage explicite

Il n'est pas obligatoire d'écrire le type d'une variable si TypeScript peut le déduire de sa valeur d'initialisation. On appelle ça **l'inférence de type**.

```typescript
let name: string = "Tom"; // typage explicite
let name2 = "Tom"; // typage implicite : TypeScript déduit "string" tout seul
```

Les deux lignes sont strictement équivalentes pour le compilateur. Ajouter le type explicitement sert surtout à la lisibilité du code (on voit le type sans avoir à survoler la variable dans l'éditeur).

Attention en revanche si tu déclares une variable sans valeur initiale ni type :

```typescript
let city; // aucun type précisé, aucune valeur : TypeScript déduit "any"
city = "Paris";
city = 42; // autorisé, puisque "city" est de type "any"
```

Dès qu'une variable est typée `any` (que ce soit explicitement ou par déduction faute de mieux), TypeScript arrête de vérifier son type, exactement comme en JavaScript. C'est pour ça qu'il est recommandé de toujours donner une valeur initiale à tes variables, ou de préciser leur type dès la déclaration si tu ne peux pas les initialiser tout de suite.

## Les types primitifs et le type `any`

TypeScript propose trois types de base, qu'on appelle les types primitifs :
* `number` pour tous les nombres (pas de distinction entier / décimal, comme en JavaScript) ;
* `string` pour les chaînes de caractères ;
* `boolean` pour les valeurs `true` et `false`.

```typescript
let age: number = 30;
let firstName: string = "Mario";
let isConnected: boolean = true;
```

Attention à la casse : `number` et `Number` sont deux types différents pour TypeScript (`Number` est le type de l'objet enveloppe de JavaScript, à ne pas utiliser ici). Il faut toujours utiliser la version en minuscules pour typer une variable.

Le type `any` signifie littéralement "n'importe quoi". Une variable `any` peut changer de type librement, exactement comme en JavaScript :

```typescript
let anything: any;
anything = "Mario";
console.log(typeof anything); // "string"
anything = 42;
console.log(typeof anything); // "number"
```

Ce type est **vivement déconseillé** dans la grande majorité des cas : il fait perdre tout l'intérêt de TypeScript. À noter que les paramètres non typés d'une fonction sont eux aussi considérés comme `any` par défaut.

`any` peut malgré tout dépanner ponctuellement, par exemple pour typer rapidement un tableau hétérogène pendant un prototypage :

```typescript
const character: any[] = ["Mario", 32, true];

function displayCharacter(data: any[]): void {
  for (const value of data) {
    console.log(value);
  }
}
```
Dans un vrai projet, on préférera presque toujours un type plus précis (union, tuple, `unknown`) à `any`, voir plus bas dans ce chapitre.

## Typer un objet

La façon la plus directe de typer un objet est d'écrire la forme attendue entre accolades, directement dans le paramètre ou la déclaration :

```typescript
function damage(characterToDamage: { life: number }, amount: number): number {
  characterToDamage.life -= amount;
  return characterToDamage.life;
}

const result = damage({ life: 100 }, 12);
console.log(result); // 88
```

On peut typer un objet avec autant de propriétés que nécessaire, et même typer des objets imbriqués :

```typescript
const address: {
  street: string;
  city: string;
  zip: number;
} = {
  street: "123 rue des champs",
  city: "Paris",
  zip: 75000,
};
```

Cette syntaxe fonctionne, mais elle devient vite illisible si le même type d'objet est utilisé à plusieurs endroits (par exemple en paramètre de plusieurs fonctions). C'est pour ça qu'on préfère en général définir un type nommé une bonne fois pour toutes, voir la section suivante.

## Le typage structurel (duck typing)

TypeScript compare les types selon leur **forme** (les propriétés qu'ils contiennent), pas selon leur nom. C'est ce qu'on appelle le typage structurel, ou familièrement le "duck typing" ("si ça ressemble à un canard et que ça cane comme un canard, alors c'est un canard") :

```typescript
type Point2D = { x: number; y: number };
type Coordinates = { x: number; y: number };

function displayPoint(point: Point2D): void {
  console.log(`(${point.x}, ${point.y})`);
}

const coord: Coordinates = { x: 10, y: 20 };
displayPoint(coord); // OK : même si Point2D et Coordinates sont deux noms différents, leur forme est identique
```

Ça fonctionne aussi avec un objet qui a plus de propriétés que nécessaire, tant qu'il contient au minimum celles attendues :

```typescript
const coordWithLabel = { x: 10, y: 20, label: "Origine" };
displayPoint(coordWithLabel); // OK : la propriété "label" en trop n'empêche rien, tant que x et y sont présents
```

Ce fonctionnement diffère d'un langage à typage nominal (comme Java ou C#), où deux types sont incompatibles s'ils ne portent pas exactement le même nom, même avec une forme identique. C'est cette caractéristique qui explique pourquoi une interface et un type différents, ou deux interfaces sans lien de parenté, peuvent être utilisés de façon interchangeable dès qu'ils ont la même forme.

## Créer ses propres types avec `type`

Pour éviter de répéter la même forme d'objet partout, on peut créer un type nommé, réutilisable, avec le mot-clé `type` :

```typescript
type Address = {
  street: string;
  city: string;
  postalCode: number;
};

const address: Address = {
  street: "rue des mouettes",
  city: "Lalaland",
  postalCode: 12345,
};

function displayAddress(address: Address): void {
  console.log("Rue : " + address.street);
  console.log("Code postal : " + address.postalCode);
  console.log("Ville : " + address.city);
}
```

On peut aussi créer des alias simples, pour donner un nom plus parlant à un type déjà existant :

```typescript
type Age = number;
type Username = string;
```

Ce ne sont pas de nouveaux types à proprement parler, mais des renommages (des **alias**) de types existants. Deux alias d'un même type sous-jacent restent strictement identiques aux yeux de TypeScript :

```typescript
type Money = number;
type PlayerAge = number;

function checkAge(ageToCheck: PlayerAge) { /* ... */ }

const lotOfMoney: Money = 500000;
checkAge(lotOfMoney); // Aucune erreur : Money et PlayerAge sont tous les deux des alias de "number"
```

Un alias peut aussi être une valeur JavaScript précise plutôt qu'un type classique. C'est ce qu'on appelle un **type littéral** :

```typescript
type Ten = 10;

const five: Ten = 5; // Erreur TS : Type '5' is not assignable to type '10'
const ten: Ten = 10; // OK
```
Ce mécanisme n'a que peu d'intérêt utilisé seul avec un simple nombre, mais il devient très utile combiné à une union (voir plus bas) pour restreindre une variable à un ensemble précis de valeurs autorisées.

## Les fonctions typées

En TypeScript, une fonction peut être écrite avec les trois syntaxes habituelles de JavaScript, en ajoutant le type de chaque paramètre et, en général, le type de la valeur retournée :

```typescript
// Déclaration classique
function myFunction(param1: string, param2: number): boolean {
  return param1.length > param2;
}

// Fonction anonyme stockée dans une variable
const myOtherFunction = function (param1: string, param2: number): boolean {
  return param1.length > param2;
};

// Fonction fléchée
const myArrowFunction = (param1: string, param2: number): boolean => {
  return param1.length > param2;
};
```

Le type de retour (`returnType`) peut être un type simple, un type complexe, une union, ou encore `void` si la fonction ne retourne rien (une procédure) :

```typescript
const birthday = (age: number): number => {
  return age + 1;
};

let newAge: number = birthday(30);
console.log("Nouvel âge : " + newAge); // "Nouvel âge : 31"
```

Dès qu'un type de retour est précisé, la fonction doit obligatoirement utiliser `return` avec une valeur de ce type sur tous les chemins possibles du code.

Il est bien sûr possible de donner une valeur par défaut à un paramètre :

```typescript
const birthdayWithDefault = (age: number = 17): number => {
  return age + 1;
};

console.log(birthdayWithDefault()); // 18, la valeur par défaut est utilisée
console.log(birthdayWithDefault(30)); // 31
```

Regarde la différence dans le fichier `.js` généré selon la cible de compilation choisie (`--target`). Une cible ES5 transforme la valeur par défaut en une vérification manuelle :
```javascript
var birthdayWithDefault = function (age) {
    if (age === void 0) { age = 17; }
    return age + 1;
};
```
Alors qu'une cible ES6 (`--target es6`) conserve la syntaxe native des paramètres par défaut :
```javascript
const birthdayWithDefault = (age = 17) => {
    return age + 1;
};
```
Dans les deux cas, le comportement à l'exécution est identique : seule la syntaxe générée change.

## Les callbacks et le typage de fonction

Une fonction callback (fonction de rappel) est une fonction passée en argument à une autre fonction, pour être appelée plus tard par celle-ci (typiquement une fois qu'un traitement est terminé).

Pour typer une variable qui contiendra une fonction, la syntaxe est `nomVariable: (parametres) => typeDeRetour` :

```typescript
let myFunction: (nb: number) => number;
myFunction = (nb) => nb + 1;

console.log(myFunction(10)); // 11
```

Ce typage précis est surtout utile pour les paramètres callback :

```typescript
const myCallback = (result: number): void => {
  console.log(`Résultat : ${result}`);
};

const myOtherCallback = (result: number): void => {
  console.log(`Résultat doublé : ${result * 2}`);
};

function addAndCallback(n1: number, n2: number, callback: (result: number) => void): void {
  const result = n1 + n2;
  callback(result);
}

addAndCallback(10, 15, myCallback);      // "Résultat : 25"
addAndCallback(10, 15, myOtherCallback); // "Résultat doublé : 50"
```
Tant que la signature de la fonction passée correspond au type attendu (ici, un paramètre `number` et un retour `void`), n'importe quelle fonction respectant cette forme peut être utilisée en callback.

## L'union de types

Le symbole `|` (pipe) permet de dire qu'une variable peut être de plusieurs types différents :

```typescript
let idOrCode: string | number = 10;
console.log(idOrCode); // 10
idOrCode = "ABC123";
console.log(idOrCode); // "ABC123"
```

Une fonction peut aussi accepter ou retourner une union de types :

```typescript
function describe(input: number | boolean): number | string {
  if (typeof input === "number") {
    return input;
  } else {
    return input ? "Homme" : "Femme";
  }
}

console.log(describe(33));    // 33
console.log(describe(false)); // "Femme"
```

## La surcharge de fonctions

Quand une fonction accepte une union de types en paramètre et en retour, TypeScript perd la précision du type retourné : il sait seulement que le résultat est l'un des types de l'union, jamais lequel exactement.

```typescript
function add(e1: number | string, e2: number | string): number | string {
  if (typeof e1 === "number" && typeof e2 === "number") {
    return e1 + e2;
  }
  return e1.toString() + " " + e2.toString();
}

const sum = add(5, 15); // TypeScript sait seulement que "sum" est "number | string"
// Math.floor(sum) provoquerait une erreur : Math.floor attend un "number", pas "number | string"
```

La **surcharge de fonction** (function overload) permet de déclarer plusieurs signatures possibles pour la même fonction, afin que TypeScript retrouve un type de retour précis selon les types passés en argument :

```typescript
function add(e1: number, e2: number): number;
function add(e1: string, e2: string): string;
function add(e1: number | string, e2: number | string): number | string {
  if (typeof e1 === "number" && typeof e2 === "number") {
    return e1 + e2;
  }
  return e1.toString() + " " + e2.toString();
}

const sum = add(5, 15);            // TypeScript sait que "sum" est un "number"
Math.floor(sum);                   // OK, plus d'erreur

const concat = add("Mario", "Bros."); // TypeScript sait que "concat" est un "string"
concat.toUpperCase();                 // OK
```

Les deux premières lignes (les signatures de surcharge) ne contiennent pas de corps : elles servent uniquement à décrire les combinaisons valides de types. La dernière déclaration (avec le corps) doit rester compatible avec toutes les signatures déclarées au-dessus.

Comme il n'existe pas de surcharge mélangeant `number` et `string`, un appel comme `add("Mario", 10)` est rejeté **à la compilation** : TypeScript refuse simplement de compiler le fichier, il ne s'agit pas d'un plantage à l'exécution.

## Les tableaux et les tuples

Comme en JavaScript, on peut typer des tableaux de type simple (`string[]`, `number[]`, `boolean[]`) ou des tableaux plus complexes (tableaux d'objets, tableaux de tableaux...).

```typescript
let names: string[] = ["Mario", "Luigi"];
// Notation équivalente, à privilégier quand le type devient complexe :
let namesGeneric: Array<string> = ["Mario", "Luigi"];
```

Avec le symbole `|`, on peut aussi définir un tableau contenant plusieurs types possibles, dans n'importe quel ordre et en nombre libre :

```typescript
let tab: (number | string)[];
tab = ["Mario", 5];
tab[0] = "Luigi";
tab[1] = 10;
```

Un **tuple** est un tableau de taille fixe, où chaque position a un type précis et non modifiable :

```typescript
let tabTuple: [string, number] = ["Mario", 10];
tabTuple[0] = 10; // Erreur : l'index 0 doit rester une "string"
tabTuple[2] = 12; // Erreur : le tuple n'a que 2 positions (index 0 et 1)

let tabTriple: [string, number, boolean] = ["Mario", 10, true];
console.log(tabTriple);
```

Un tuple est donc beaucoup plus strict qu'un tableau à union simple :

```typescript
const player: (string | number)[] = ["John", 30]; // ordre libre, taille libre
const playerTuple: [string, number] = ["John", 30]; // ordre et taille fixes
```

On peut aussi typer des tableaux d'objets directement :

```typescript
const coordinates: { x: number; y: number }[] = [
  { x: 10, y: 20 },
  { x: 30, y: 40 },
];
```

## `type` ou `interface` ?

`interface` permet de définir la forme d'un objet, de façon très proche de `type` :

```typescript
type CharacterAsType = {
  name: string;
  strength: number;
};

interface CharacterAsInterface {
  name: string;
  strength: number;
}
```

Dans les grandes lignes :
* `type` est plus flexible : il permet de créer des unions (`|`), des intersections (`&`), des alias de types simples, des tuples...
* `interface` est réservé à la description d'objets et de classes. Il permet l'héritage via `extends`, et deux `interface` déclarées avec le même nom voient automatiquement leurs propriétés fusionnées (on appelle ça la **déclaration merging**), ce qui n'est pas le cas de `type` (qui, lui, interdit la redéclaration).

Convention généralement admise : utiliser `interface` pour les objets et les classes, et `type` pour les types plus simples (union, alias, tuple).

## Union, intersection et héritage sur les objets

L'union `|` fonctionne aussi bien avec des objets qu'avec des types simples :

```typescript
type Character = {
  name: string;
  strength: number;
  healthPoints: number;
  manaPoints: number;
};

type Hero = {
  name: string;
  age: number;
  class: string;
};

type Player = Character | Hero;
```

Pour accéder en toute sécurité aux propriétés qui n'existent que sur l'un des deux types de l'union, on utilise le mot-clé `in`, qui vérifie la présence d'une propriété avant d'y accéder :

```typescript
function displayPlayer(player: Player): void {
  console.log("Nom : " + player.name);
  if ("age" in player) {
    console.log("Âge : " + player.age);
  }
  if ("class" in player) {
    console.log("Classe : " + player.class);
  }
}
```

`extends` permet à une interface d'hériter d'une autre :

```typescript
interface Character2 {
  name: string;
  healthPoints: number;
}

interface Hero2 extends Character2 {
  age: number;
  class: string;
}

interface Monster extends Character2 {
  type: string;
}
```

Pour bien distinguer les membres d'une union d'objets, on utilise souvent un **type littéral** comme propriété de discrimination :

```typescript
type AnimalClass = "bird" | "fish";

interface Animal {
  family: "animal";
  class: AnimalClass;
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

function displayWildlife(wildlife: Wildlife): void {
  console.log("Famille : " + wildlife.family);
  if (wildlife.class === "bird") {
    console.log("Peut voler : " + wildlife.canFly);
  }
  if (wildlife.class === "fish") {
    console.log("Peut respirer sous l'eau : " + wildlife.canBreatheUnderWater);
  }
}
```

L'**intersection**, avec le symbole `&`, permet à l'inverse de fusionner plusieurs types pour n'en faire qu'un, qui a toutes les propriétés réunies :

```typescript
type Named = { name: string };
type Aged = { age: number };

type Human = Named & Aged;

const mario: Human = {
  name: "Mario",
  age: 30,
};
```

Avec `interface`, l'équivalent de l'intersection se fait avec `extends`, en séparant les interfaces héritées par des virgules :

```typescript
interface Human2 extends Named, Aged {
  job: string;
}
```

> Note : contrairement aux classes (qui ne peuvent hériter que d'une seule classe mère), une interface peut hériter d'autant d'interfaces que nécessaire.

## Propriétés dynamiques (index signatures)

TypeScript permet de définir un type d'objet acceptant un nombre de propriétés non connu à l'avance, tant qu'elles respectent un type donné. C'est ce qu'on appelle une **index signature** :

```typescript
type ApiError = {
  code: string;
  [key: string]: string;
};

const notFound: ApiError = {
  code: "404",
  message: "Cette page n'existe pas",
  image: "page404.jpg",
};
```

Attention, l'index signature s'applique à toutes les propriétés du type, y compris celles déjà nommées explicitement : elles doivent donc être compatibles avec le type déclaré dans l'index.

```typescript
type Character3 = {
  name: string;
  age: number;
  // [key: string]: string; // Erreur : "age" est un "number", incompatible avec cette signature
  [key: string]: string | number; // Fonctionne : chaque propriété est "string" ou "number"
};

const player3: Character3 = {
  name: "Mario",
  age: 30,
  sizeCm: 156,
  job: "plumber",
};
```

## Le type énumération `enum`

Un `enum` regroupe un ensemble de constantes nommées, à la place de plusieurs `const` séparées :

```typescript
enum Role {
  VISITOR,
  USER,
  ADMIN,
}

console.log(Role.USER); // 1
```

Par défaut, les valeurs numériques d'un enum démarrent à 0 et s'incrémentent de 1. On peut aussi préciser ses propres valeurs :

```typescript
enum RoleWithValues {
  VISITOR = 2,
  USER = 1,
  ADMIN = 0,
}
```

Un enum peut aussi contenir des chaînes de caractères :

```typescript
enum IdentityGuidelines {
  PRIMARY = "#123456",
  SECONDARY = "#234567",
  TERTIARY = "#345678",
}

const title = document.querySelector("h1") as HTMLElement | null;
if (title) {
  title.style.color = IdentityGuidelines.PRIMARY;
}
```

## `unknown` et `never`

`unknown` représente une valeur dont le type n'est pas connu à l'avance, comme `any`, mais de façon beaucoup plus sûre : impossible d'utiliser une valeur `unknown` sans avoir d'abord vérifié son type réel.

```typescript
let varUnknown: unknown;
varUnknown = 32;
varUnknown = "Mario";

let age: number = varUnknown; // Erreur : on ne peut pas assigner un "unknown" directement

if (typeof varUnknown === "string") {
  const firstName: string = varUnknown; // OK, TypeScript sait que c'est une "string" ici
}
if (typeof varUnknown === "number") {
  const playerAge: number = varUnknown; // OK, TypeScript sait que c'est un "number" ici
}
```

Contrairement à `any`, `unknown` t'oblige donc à écrire une vérification de type (`typeof`, `instanceof`...) avant toute utilisation concrète de la valeur.

`never` s'utilise sur le type de retour d'une fonction qui ne se termine jamais normalement, typiquement une fonction qui lève systématiquement une exception :

```typescript
function throwException(message: string, errorCode: number): never {
  throw { message, errorCode };
}
```

À la différence de `void` (qui signifie "ne retourne rien de particulier, mais se termine normalement"), `never` signifie "cette fonction ne se termine jamais avec un retour, que ce soit une exception ou une boucle infinie".

Depuis TypeScript 4.4, avec `strict` activé (voir chapitre 3), la variable d'un bloc `catch` est elle aussi typée `unknown` par défaut, plutôt que `any` comme c'était le cas auparavant :

```typescript
try {
  throw new Error("Une erreur");
} catch (error) {
  console.log(error.message); // Erreur : "error" est "unknown", impossible d'accéder à "message" directement
  if (error instanceof Error) {
    console.log(error.message); // OK, TypeScript sait que "error" est bien une instance d'Error ici
  }
}
```

## Autres opérateurs utiles : `!`, `as`, `?`, `??`

Le point d'exclamation `!` après une expression indique à TypeScript qu'on est certain que la valeur ne sera jamais `null` ni `undefined` à cet endroit précis (c'est une **assertion de non-nullité**) :

```typescript
const firstNameInput = document.querySelector("input")!;
(firstNameInput as HTMLInputElement).value = "Mario";
```

À utiliser avec précaution : si la valeur s'avère `null` à l'exécution, ce code plantera quand même, TypeScript se contente de faire confiance au développeur sans vérifier.

`as` permet de forcer TypeScript à considérer une valeur comme un type plus précis (une **assertion de type**) :

```typescript
const firstNameInputEl = document.querySelector("#firstName") as HTMLInputElement;
firstNameInputEl.value = "Mario";
```

Le paramètre optionnel `?` indique qu'un argument n'est pas obligatoire lors de l'appel d'une fonction :

```typescript
function greet(name: string, age?: number): void {
  console.log("Bonjour " + name);
  if (age) console.log("Âge : " + age);
}

greet("Mario", 30); // "Bonjour Mario" puis "Âge : 30"
greet("Luigi");     // "Bonjour Luigi" seulement
```

L'opérateur `??` (nullish coalescing, ou "coalescence des nuls") fournit une valeur par défaut uniquement si l'expression de gauche vaut `null` ou `undefined` :

```typescript
let nameInput: string | undefined;
const player = nameInput ?? "Mario";
console.log(player); // "Mario"
```

Ce qui équivaut, de façon plus verbeuse, à :

```typescript
let nameInput: string | null = null;
let player: string;

if (nameInput === null || nameInput === undefined) {
  player = "Mario";
} else {
  player = nameInput;
}

console.log(player);
```

> Attention, `??` ne doit pas être confondu avec l'opérateur `||` (OU logique) de JavaScript. `||` fournit une valeur par défaut dès que l'expression de gauche est "falsy" (donc aussi pour `0`, `""` ou `false`), alors que `??` ne réagit qu'à `null` et `undefined` :

```typescript
const score = 0;
console.log(score || 10); // 10 : 0 est "falsy", donc le OU logique bascule sur la valeur par défaut
console.log(score ?? 10); // 0 : 0 n'est ni "null" ni "undefined", donc "??" garde la valeur d'origine
```

## Typer les promesses et l'asynchrone

Tu sais déjà utiliser les promesses et `async`/`await` en JavaScript. En TypeScript, une promesse se type avec `Promise<T>`, où `T` représente le type de la valeur que la promesse va résoudre :

```typescript
function waitOneSecond(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("Terminé"), 1000);
  });
}
```

Une fonction `async` retourne toujours une `Promise`, même si son `return` semble renvoyer une valeur simple : TypeScript enrobe automatiquement le type déclaré (ou déduit) dans `Promise<...>` :

```typescript
async function getUsername(): Promise<string> {
  return "Mario"; // le vrai type de retour de la fonction est bien Promise<string>
}

async function main() {
  const username = await getUsername(); // "username" est typé "string", pas "Promise<string>"
  console.log(username.toUpperCase());
}
```

Pour typer une réponse `fetch`, il faut typer soi-même le résultat de `.json()` : TypeScript ne peut pas deviner la forme d'une réponse réseau.

```typescript
interface User {
  id: number;
  name: string;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`https://api.example.com/users/${id}`);
  const data = await response.json(); // typé "any" par défaut
  return data as User; // on affirme la forme réelle des données, sans vérification à l'exécution
}
```

## Compléments : `readonly`, `keyof`, `satisfies` et `as const`

Voici quatre notions standard de TypeScript, non abordées dans le cours, mais utiles dès qu'on manipule des types un peu sérieusement.

**`readonly`** empêche la modification d'une propriété ou d'un tableau après son initialisation :

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const origin: Point = { x: 0, y: 0 };
origin.x = 10; // Erreur : "x" est en lecture seule

const readonlyNames: readonly string[] = ["Mario", "Luigi"];
readonlyNames.push("Peach"); // Erreur : "push" n'existe pas sur un tableau "readonly"
```

**`keyof`** permet de récupérer, sous forme de type union, l'ensemble des noms de propriétés d'un type existant :

```typescript
interface Character4 {
  name: string;
  age: number;
}

type CharacterKeys = keyof Character4; // équivaut à : "name" | "age"

function getProperty(character: Character4, key: CharacterKeys) {
  return character[key];
}
```
C'est très utile pour écrire des fonctions génériques qui accèdent dynamiquement aux propriétés d'un objet, sans perdre la vérification de type sur les noms de propriétés.

**`satisfies`** (disponible depuis TypeScript 4.9) vérifie qu'une valeur respecte bien un type donné, tout en conservant le type le plus précis possible pour la suite du code :

```typescript
type ColorName = "red" | "green" | "blue";

const palette = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
} satisfies Record<ColorName, string>;

// TypeScript sait que "palette.red" est bien défini,
// contrairement à ce qu'il saurait avec : const palette: Record<ColorName, string> = {...}
palette.red.toUpperCase();
```
La différence avec une simple annotation `: Record<ColorName, string>` est que `satisfies` vérifie la conformité du type sans "élargir" le type de `palette` à `Record<ColorName, string>` : TypeScript garde en mémoire que `palette` a précisément les clés `red`, `green` et `blue`.

**`as const`** (une assertion de constante) fige une valeur littérale dans le type le plus étroit possible, plutôt que dans le type élargi que TypeScript utilise par défaut :

```typescript
const rolesArray = ["visitor", "user", "admin"];
// type déduit par défaut : string[] (n'importe quelle chaîne pourrait être ajoutée)

const rolesArrayConst = ["visitor", "user", "admin"] as const;
// type déduit : readonly ["visitor", "user", "admin"] (chaque valeur est un type littéral, le tableau est en lecture seule)

type Role = (typeof rolesArrayConst)[number]; // équivaut à : "visitor" | "user" | "admin"
```

`as const` est très utile pour dériver une union de types littéraux directement à partir d'une valeur JavaScript déjà existante (ici un tableau), plutôt que d'écrire l'union à la main en double. Le même principe s'applique aux objets : chaque propriété devient `readonly`, et chaque valeur littérale garde son type le plus précis plutôt que d'être élargie à `string`/`number`/`boolean`.

## Application pratique

* **P1 (currency-convertor)** et **P2 (guess-the-flag)** : ces deux projets mettent en pratique le typage des variables, des fonctions et des objets vus dans ce chapitre (types primitifs, unions, tableaux, objets typés avec `type`), dans un contexte concret de manipulation du DOM et de données.

## Résumé

- Une variable typée en TypeScript ne peut plus changer de type après sa déclaration, contrairement à JavaScript.
- TypeScript déduit le type d'une variable si elle est initialisée (inférence) : inutile de tout annoter explicitement.
- Les trois types primitifs sont `number`, `string` et `boolean` ; `any` désactive toute vérification et doit rester exceptionnel.
- `type` crée un alias de type réutilisable (objet, union, tuple...), pratique pour éviter de répéter la même forme partout.
- `interface` est dédiée aux objets et aux classes, supporte l'héritage via `extends` et la fusion de déclarations, contrairement à `type`.
- Les fonctions se typent au niveau des paramètres et du retour ; `void` signifie "ne retourne rien", `never` signifie "ne se termine jamais normalement".
- Un callback se type avec la syntaxe `(parametres) => typeDeRetour`, ce qui permet d'accepter n'importe quelle fonction respectant cette signature.
- L'union `|` autorise plusieurs types possibles, l'intersection `&` fusionne plusieurs types en un seul.
- La surcharge de fonction (overloads) permet de garder un type de retour précis même quand une fonction accepte plusieurs combinaisons de types en entrée.
- Un tuple (`[type1, type2, ...]`) est un tableau à taille et types fixes, plus strict qu'un tableau à union simple.
- Une index signature (`[key: string]: type`) permet de typer un objet avec un nombre de propriétés inconnu à l'avance.
- TypeScript compare les types par leur forme, pas par leur nom (typage structurel/duck typing) : deux types différents mais de forme identique sont interchangeables.
- `unknown` oblige à vérifier le type réel d'une valeur avant de l'utiliser, contrairement à `any` qui ne vérifie jamais rien ; depuis TS 4.4, la variable d'un `catch` est elle aussi `unknown` par défaut avec `strict`.
- `!`, `as`, `?` et `??` sont des outils du quotidien : assertion de non-nullité, assertion de type, paramètre optionnel, valeur par défaut si `null`/`undefined`.
- Une fonction `async` retourne toujours une `Promise<T>` ; typer une réponse `fetch` nécessite de typer soi-même le résultat de `.json()`, TypeScript ne le devine pas.
- `readonly`, `keyof`, `satisfies` et `as const` sont des compléments utiles au socle standard de TypeScript, à connaître au-delà de ce cours.
