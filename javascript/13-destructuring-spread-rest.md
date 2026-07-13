# Module 13 - Destructuring, Spread et Rest

## Les trois points `...` - deux usages distincts

Les `...` désignent deux choses opposées selon le contexte :
- **Rest parameter** : rassemble plusieurs valeurs en un tableau (dans les paramètres d'une fonction).
- **Spread operator** : décompose un tableau ou un objet en valeurs individuelles.

---

## Le rest parameter

Stocke une liste indéfinie de valeurs sous forme d'un tableau :

```javascript
function logArgs(...args) {
   console.log(args);
}
logArgs('coucou', 3, 'Bob'); // ['coucou', 3, 'Bob']
```

Permet de récupérer un premier paramètre nommé et "le reste" dans un tableau :

```javascript
function argsToObject(key, ...values) {
   let object = {};
   object[key] = values;
   return object;
}

let o = argsToObject('fruits', 'pomme', 'poire', 'abricot');
// { fruits: ['pomme', 'poire', 'abricot'] }
```

---

## Le spread operator

Décompose un tableau ou un objet en valeurs individuelles :

```javascript
let args = ['var 1', 'var 2', 'var 3'];
console.log(...args); // console.log('var 1', 'var 2', 'var 3')
```

### Concaténer des tableaux

```javascript
let fruits = ['pomme', 'poire', 'abricot'];
let legumes = ['salade', 'asperge'];

let mots = ['automne', ...fruits, 'voiture', ...legumes];

const tab1 = [1, 2, 3];
const tab2 = [...tab1]; // copie (clone superficiel)
```

> ⚠️ Le spread fait une **copie superficielle** : si le tableau contient des objets, leurs références sont copiées, pas les objets eux-mêmes. Voir module 11 pour les détails.

### Spread sur une chaîne

Le spread fonctionne sur tout itérable, y compris les strings :

```javascript
[...'hello'];        // ['h', 'e', 'l', 'l', 'o']
[...'pomme', 'fin']; // ['p', 'o', 'm', 'm', 'e', 'fin']
```

### Dupliquer/étendre un objet

```javascript
const person1 = { name: 'Jean', age: 25 };

const person2 = {
    ...person1,       // récupère toutes les propriétés de person1
    name: 'Paul',     // remplace le nom
    sexe: 'M'         // ajoute une propriété
};

console.log(person1); // { name: 'Jean', age: 25 }
console.log(person2); // { name: 'Paul', age: 25, sexe: 'M' }
```

![](./assets/spread-operator-duplicate-reference.png)

---

## Destructuring (décomposition)

La décomposition consiste à extraire des valeurs d'un tableau ou d'un objet pour les affecter à des variables. Elle rend le code plus court et plus lisible.

### Décomposer un tableau

La recherche se base sur la **position** :

```javascript
const vecteur = [2, -1, 1];
let [x, y, z] = vecteur;
console.log(`x=${x} y=${y} z=${z}`); // x=2 y=-1 z=1
```

![](./assets/destructuring-array.png)

**Sauter un élément** : ajouter une virgule sans nom de variable :

```javascript
const [,,z] = vecteur; // récupère seulement z
```

**Valeurs par défaut** :

```javascript
let args = [];
let [type = 'legume', firstEl = 'salade'] = args;
// type = 'legume', firstEl = 'salade'
```

**Récupérer "le reste" dans un tableau** :

```javascript
let args = ['fruits', 'pomme', 'poire', 'abricot'];
let [type, ...elements] = args;
// type = 'fruits', elements = ['pomme', 'poire', 'abricot']
```

**Intervertir deux variables** :

```javascript
let valA = 'coucou';
let valB = 'byebye';
[valA, valB] = [valB, valA];
```

**Tableau à deux dimensions** :

```javascript
const matrice = [[2,1,1],[3,1,4],[5,0,1]];
const [L1, L2, L3] = matrice;
const [,[L2_x]] = matrice; // L2_x = 3
```

### Destructuring d'un objet

La recherche se base sur le **nom** de la propriété :

```javascript
const vecteur = { x: 2, y: -1, z: 1 };
let { x, y, z } = vecteur;
console.log(`x=${x} y=${y} z=${z}`); // x=2 y=-1 z=1
```

![](./assets/destructuring-object.png)

**Ne récupérer qu'une clé** :

```javascript
let objet = { slug: 'test', title: 'Ceci est un test', content: '...', visible: true };
let { title } = objet;
```

**Valeur par défaut** :

```javascript
let { visible = false } = objet;
```

**Renommer la variable** :

```javascript
let { content: article } = objet;              // content stocké dans "article"
let { visible: isVisible = false } = objet;   // content + valeur par défaut
```

**Déstructuration au moment de l'appel d'une fonction** :

```javascript
function test(id, { maxLength = 10, current = 0 } = {}) { /* ... */ }

const vecteur = { x: 2, y: -1, z: 1 };
function print({ x, y, z }) {
    console.log(`x=${x} y=${y} z=${z}`);
}
print(vecteur); // x=2 y=-1 z=1
```

**Propriétés imbriquées** :

```javascript
const line = {
    width: 2,
    color: 'blue',
    A: { x: 2, y: 1, z: 3 },
    B: { x: 4, y: 3, z: 2 }
};

const { width, A: { x: startA } } = line;
console.log(`width=${width} startA=${startA}`); // width=2 startA=2
```

---

## Destructuring dans les boucles

Le destructuring s'utilise directement dans un `for...of`, ce qui évite d'avoir à accéder aux propriétés manuellement :

```javascript
const users = [
    { name: 'Alice', score: 95 },
    { name: 'Bob',   score: 82 },
];

for (const { name, score } of users) {
    console.log(`${name} : ${score}`);
}
```

Combiner avec `.entries()` pour avoir index et valeur :

```javascript
const fruits = ['pomme', 'poire', 'abricot'];

for (const [index, fruit] of fruits.entries()) {
    console.log(`${index} : ${fruit}`);
}
```

Combiner avec `Object.entries()` pour itérer sur un objet :

```javascript
const scores = { Alice: 95, Bob: 82, Charlie: 78 };

for (const [nom, score] of Object.entries(scores)) {
    console.log(`${nom} : ${score}`);
}
```

## Destructuring dans les imports de modules

C'est l'usage le plus fréquent en pratique, même si les modules ES ne sont pas couverts en détail dans ce cours :

```javascript
// Importer uniquement les fonctions dont on a besoin
import { useState, useEffect } from 'react';
import { getCollection, getEntry } from 'astro:content';

// Destructuring de l'objet retourné par une fonction
const { data, error, loading } = useFetch('/api/users');
```

La syntaxe est exactement la même que le destructuring d'objet vu plus haut.

---

## Résumé

### Les `...` en détail

| Syntaxe | Nom | Sens | Effet |
|---|---|---|---|
| `function f(...args)` | Rest | Rassemble | Regroupe les arguments en tableau |
| `f(...tab)` | Spread | Éclate | Passe chaque élément comme argument distinct |
| `[...tab1, ...tab2]` | Spread | Éclate | Concatène des tableaux |
| `{ ...obj1, ...obj2 }` | Spread | Éclate | Fusionne des objets |
| `const [a, ...rest] = tab` | Rest en destructuring | Rassemble | `rest` = éléments restants du tableau |

### Destructuring

| Syntaxe | Basé sur | Exemple |
|---|---|---|
| `const [a, b] = arr` | Position | Premier et deuxième élément |
| `const [,, c] = arr` | Position | Troisième élément (sauter les deux premiers) |
| `const [a = 'def'] = arr` | Position | Valeur par défaut si absent |
| `const { x, y } = obj` | Nom de clé | Propriétés `x` et `y` |
| `const { x: monX } = obj` | Nom de clé | Propriété `x` renommée `monX` |
| `const { x = 0 } = obj` | Nom de clé | Valeur par défaut si absent |
| `function f({ a, b }) {}` | Nom de clé | Destructuring dans les paramètres |
| `const { A: { x } } = obj` | Imbriqué | Descend dans les objets imbriqués |

> ℹ️ Le spread crée une copie **superficielle** : les objets imbriqués sont toujours partagés par référence (voir module 11).

## Prochaine étape

**Module 14 - Gestion des erreurs et JSON** : `try`/`catch`/`finally`, `throw`, `JSON.stringify`/`JSON.parse` et les stratégies de clonage d'objets.
