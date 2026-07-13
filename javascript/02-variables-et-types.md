# Module 02 - Variables et types primitifs

## Définition

Une variable est un contenant utilisé pour enregistrer une donnée spécifique utile au programme pour fonctionner. Une donnée placée dans une variable s'appelle une **valeur**. Pour savoir ce à quoi correspond la variable, il faut lui donner un nom. Le nom doit indiquer ce qui se trouve à l'intérieur de la variable.

## Règles générales pour nommer une variable

- Utiliser des noms descriptifs dans l'ensemble du code : être précis et descriptif rend la vie plus facile pour lire et maintenir le code dans le temps.
- Éviter les abréviations ou les raccourcis de mots même lorsque c'est possible.
- Suivre une convention de nommage constante : la convention la plus courante est le **camelCase** (`numberOfCats`, `firstName`).

## Création d'une variable - la déclaration

En JavaScript, une variable se déclare ainsi :

```javascript
let numberOfCats = 2;
```

> ℹ️ Auparavant, une variable se déclarait avec le mot-clé `var`. Il a progressivement été remplacé par `let` et `const` (voir le module 03).

## Modification de la valeur d'une variable

La manière la plus simple de modifier la valeur d'une variable est de la réaffecter :

```javascript
let numberOfCats = 2;
numberOfCats = 4;
```

On n'utilise pas de mot-clé avant la variable puisqu'elle a déjà été déclarée.

## Mutabilité des variables

Une variable déclarée avec `let` est **mutable** par défaut : elle peut changer dans le temps. À l'inverse, une **constante** (déclarée avec `const`) ne peut pas être réaffectée - voir module 03.

## Les types primitifs

JavaScript possède les types primitifs suivants :

| Type | Description |
|---|---|
| `number` | Nombre entier ou décimal |
| `string` | Chaîne de caractères |
| `boolean` | `true` ou `false` |
| `undefined` | Variable déclarée sans valeur assignée |
| `null` | Absence de valeur volontaire |
| `bigint` | Très grands entiers |
| `symbol` | Identifiants uniques |

En JavaScript, il n'est pas nécessaire de déclarer le type d'une variable : c'est un langage à **typage dynamique**.

## Comprendre les types en JavaScript

JavaScript est un langage à **types dynamiques** et à **typage faible**. Cela signifie qu'on peut initialiser une variable en tant que nombre et la réaffecter comme une chaîne ou tout autre type :

```javascript
let value = 42;           // number
value = 'quarante-deux';  // string, tout à fait valide
```

> **`typeof`** - pour connaître le type d'une variable :
> ```javascript
> typeof 42;           // "number"
> typeof 'bonjour';    // "string"
> typeof true;         // "boolean"
> typeof undefined;    // "undefined"
> typeof null;         // "object" (particularité historique de JS)
> typeof [1,2,3];      // "object" (un tableau est un objet)
> typeof function(){}; // "function"
> ```

## Le type `number`

Les variables de type `number` peuvent être positives ou négatives, entières ou décimales (JS ne distingue pas int/float, il n'y a qu'un seul type `number`) :

```javascript
let age = 32;
let price = 19.99;
let negative = -7;
```

### `NaN` (Not a Number)

`NaN` est une valeur spéciale du type `number` obtenue quand une opération mathématique échoue :

```javascript
parseInt('bonjour'); // NaN - impossible de convertir en nombre
0 / 0;               // NaN
```

`NaN` a un comportement inhabituel : il n'égale rien, pas même lui-même. Pour le détecter, on utilise `Number.isNaN()` :

```javascript
NaN === NaN;           // false ⚠️
Number.isNaN(NaN);     // true ✅
Number.isNaN('texte'); // false (n'est pas NaN, c'est une string)
```

### `Infinity`

```javascript
1 / 0;   //  Infinity
-1 / 0;  // -Infinity
```

### Quelques méthodes utiles

```javascript
Math.floor(4.7);   // 4  - arrondi inférieur
Math.ceil(4.1);    // 5  - arrondi supérieur
Math.round(4.5);   // 5  - arrondi classique
Math.random();     // nombre aléatoire entre 0 (inclus) et 1 (exclus)
Math.max(3, 1, 7); // 7
Math.min(3, 1, 7); // 1
```

## Le type `boolean`

Il n'y a que deux valeurs : `true` ou `false`. On les utilise pour indiquer si un utilisateur est connecté ou non, si une case est cochée ou non, si un ensemble de conditions particulières est réuni, etc.

### Valeurs truthy et falsy

En JavaScript, toute valeur peut être évaluée comme un booléen dans un contexte conditionnel (`if`, `while`, opérateur `&&`...). On parle de valeurs **falsy** (considérées comme `false`) et **truthy** (tout le reste).

Les 6 valeurs **falsy** à connaître :

```javascript
false
0
''        // chaîne vide
null
undefined
NaN
```

Tout le reste est **truthy**, y compris des valeurs qui peuvent surprendre :

```javascript
'0'        // truthy (chaîne non vide)
[]         // truthy (tableau vide)
{}         // truthy (objet vide)
-1         // truthy (tout nombre non zéro)
```

Cela permet des raccourcis très courants :

```javascript
const username = '';
if (username) {
    console.log('Bonjour ' + username); // ne s'exécute pas : '' est falsy
}

const items = [1, 2, 3];
if (items.length) {
    console.log('Il y a des éléments'); // s'exécute : 3 est truthy
}
```

Pour convertir explicitement une valeur en booléen, on utilise `!!` (double négation) :

```javascript
!!''        // false
!!'bonjour' // true
!!0         // false
!!42        // true
```

## Le type `string`

Les chaînes de caractères permettent d'enregistrer du texte. On les encadre avec des guillemets simples ou doubles : `''` ou `""`.

On peut concaténer des chaînes grâce à l'opérateur `+`, ou utiliser **la string interpolation** (template literals) avec des backticks `` ` `` :

```javascript
const myName = 'Romain';
const salutation = `Bienvenue sur mon site ${myName}!`;
console.log(salutation); // "Bienvenue sur mon site Romain!"
```

## `undefined` et `null`

```javascript
let x;
console.log(x); // undefined → déclarée, mais sans valeur

let user = null; // null → absence de valeur volontaire
```

Pour tester l'un ou l'autre en une seule fois, on utilise l'égalité faible :

```javascript
if (x == null) { /* vrai si x est null OU undefined */ }
```

---

## Conversion de types

JS convertit parfois les types automatiquement (coercition implicite), ce qui peut surprendre. On peut aussi convertir explicitement.

### Vers un nombre

```javascript
Number('42');      // 42
Number('');        // 0
Number('bonjour'); // NaN
Number(true);      // 1
Number(false);     // 0
Number(null);      // 0
Number(undefined); // NaN

parseInt('42px');   // 42 - lit les chiffres jusqu'au premier caractère non numérique
parseFloat('3.14'); // 3.14
```

### Vers une chaîne

```javascript
String(42);     // '42'
String(true);   // 'true'
String(null);   // 'null'
(42).toString(); // '42'
```

### Vers un booléen

```javascript
Boolean(0);   // false
Boolean('');  // false
Boolean(1);   // true
Boolean('a'); // true
```

### La coercition implicite - pièges courants

```javascript
'5' + 3;    // '53'  ⚠️ l'opérateur + concatène quand l'un des opérandes est une string
'5' - 3;    // 2     ✅ les autres opérateurs numériques convertissent automatiquement
'5' * 2;    // 10
true + 1;   // 2     (true vaut 1)
false + 1;  // 1     (false vaut 0)
```

> ℹ️ Ces comportements sont une conséquence du typage faible de JS. C'est pourquoi on préfère toujours `===` (voir module 04) pour éviter les comparaisons avec conversion implicite.

---

## Résumé

| Notion | À retenir |
|---|---|
| Variable | Contenant nommé pour stocker une valeur ; nom en camelCase |
| Déclaration | `let nom = valeur;` — `let` remplace l'ancien `var` |
| Mutabilité | `let` = mutable ; `const` = non réaffectable (voir module 03) |
| Typage dynamique | Pas besoin de déclarer le type ; une variable peut changer de type |
| Typage faible | JS convertit les types automatiquement — source de bugs si mal maîtrisé |
| `typeof` | Retourne le type d'une valeur sous forme de string |
| `number` | Un seul type pour entiers et décimaux ; `NaN` et `Infinity` inclus |
| `NaN` | Résultat d'une opération math impossible — se détecte avec `Number.isNaN()` |
| `boolean` | `true` ou `false` ; 6 valeurs falsy : `false`, `0`, `''`, `null`, `undefined`, `NaN` |
| Truthy/Falsy | Toute valeur peut être évaluée comme booléen dans un `if` |
| `string` | Texte entre `''` ou `""` ; interpolation avec `` ` `` et `${}` |
| `undefined` | Variable déclarée sans valeur |
| `null` | Absence de valeur volontaire |
| Conversions | `Number()`, `parseInt()`, `String()`, `Boolean()` pour convertir explicitement |
| Coercition | `'5' + 3 = '53'` ⚠️ — `+` avec une string concatène au lieu d'additionner |

## Prochaine étape

**Module 03 — `let`, `const` et `var`** : comprendre en détail les différences de portée, le hoisting et la zone morte temporelle — ainsi que le bug classique de `var` en boucle.
