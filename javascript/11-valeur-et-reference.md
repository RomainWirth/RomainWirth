# Module 11 - Valeur vs Référence

Comprendre la différence entre valeur et référence est essentiel pour éviter une catégorie entière de bugs silencieux en JavaScript.

## Les deux modes de passage

JavaScript a des types de données passées par **valeur** :
- Boolean, null, undefined, String, Number

Et des types passés par **référence** (techniquement tous des objets) :
- Array, Function, Object

## Primitives - passage par valeur

Quand on assigne une variable primitive à une autre, on copie la valeur. Les deux variables sont indépendantes :

```javascript
let x = 10;
let a = x;
a = 5;
console.log(x, a); // 10, 5 → inchangé
```

## Objets - passage par référence

Les objets ne sont pas copiés, c'est leur **adresse mémoire** qui est copiée. Deux variables peuvent pointer vers le même objet :

```javascript
let reference = [1];
let referenceCopy = reference; // même adresse mémoire

reference.push(2);
console.log(reference, referenceCopy); // [1, 2], [1, 2]
```

Même comportement avec un objet :

```javascript
const user = { name: 'Alice' };
const autreUser = user; // même référence

autreUser.name = 'Bob';
console.log(user.name); // 'Bob' ⚠️ - l'objet original est modifié
```

### `const` n'empêche pas la mutation

`const` empêche la **réaffectation** de la variable, mais pas la **modification** de l'objet ou du tableau pointé :

```javascript
const fruits = ['pomme', 'poire'];
fruits.push('abricot'); // ✅ - on modifie l'objet, pas la variable
console.log(fruits);    // ['pomme', 'poire', 'abricot']

fruits = ['kiwi'];      // ❌ TypeError - on ne peut pas réaffecter
```

Ce comportement est une conséquence directe du passage par référence (voir aussi module 03).

Réassigner une variable remplace son adresse, sans toucher à l'objet original :

```javascript
let object = { first: 'reference' };
object = { second: 'reference2' }; // object pointe maintenant vers un nouvel objet
```

## Passer un objet à une fonction

Quand on passe un objet ou un tableau à une fonction, c'est la **référence** qui est transmise. La fonction peut donc modifier l'objet original :

```javascript
function vider(tableau) {
    tableau.length = 0; // modifie l'objet original !
}

const fruits = ['pomme', 'poire', 'abricot'];
vider(fruits);
console.log(fruits); // [] ⚠️ - le tableau original est vidé
```

Pour éviter ça, travailler sur une copie (voir section "Clonage" ci-dessous).

## `==` et `===` sur des références

Ces opérateurs vérifient l'**adresse**, pas le contenu :

```javascript
let a = ['Hi !'];
let b = a;
console.log(a === b); // true → même adresse

let c = ['Hi !'];
console.log(a === c); // false → adresses différentes, même si contenu identique
```

## Pure functions

Une **pure function** n'a aucun effet en dehors de sa portée : elle ne modifie pas les arguments reçus.

Exemple de **fonction impure** :

```javascript
function changeAgeImpure(person) {
    person.age = 25; // modifie l'objet original !
    return person;
}
```

Exemple de **fonction pure** équivalente :

```javascript
function changeAgePure(person) {
    let newPersonObject = JSON.parse(JSON.stringify(person)); // clone profond
    newPersonObject.age = 25;
    return newPersonObject;
}

let alex = { name: 'Alex', age: 30 };
let changedAlex = changeAgePure(alex);

console.log(alex);        // { name: 'Alex', age: 30 } → inchangé
console.log(changedAlex); // { name: 'Alex', age: 25 }
```

`map`, `filter` et `reduce` (voir module 07) sont des exemples classiques de pure functions natives.

## Alternatives modernes au clonage

La technique `JSON.stringify`/`JSON.parse` fonctionne mais a des limites (perd les fonctions, les `undefined`, les dates deviennent des strings). Alternatives :

### Clone superficiel (shallow clone)

```javascript
const original = { name: 'Alex', age: 30 };
const copie = { ...original }; // spread operator - voir module 13

copie.name = 'Bob';
console.log(original.name); // 'Alex' ✅ - inchangé
```

**Attention** : le clone superficiel ne copie que le premier niveau. Si l'objet contient des objets imbriqués, leurs références sont copiées, pas les objets eux-mêmes :

```javascript
const original = { name: 'Alex', adresse: { ville: 'Paris' } };
const copie = { ...original };

copie.adresse.ville = 'Lyon'; // modifie l'objet imbriqué partagé
console.log(original.adresse.ville); // 'Lyon' ⚠️ - l'original est aussi modifié
```

### Clone profond (deep clone)

Pour cloner un objet à tous les niveaux d'imbrication :

```javascript
// Option 1 : structuredClone (natif, recommandé)
const copie = structuredClone(original);

// Option 2 : JSON (limitations mentionnées ci-dessus)
const copie = JSON.parse(JSON.stringify(original));
```

`structuredClone` est disponible dans tous les navigateurs modernes et gère correctement les dates, les tableaux imbriqués, les Map, les Set, etc.

---

## Résumé

| Notion | À retenir |
|---|---|
| Passage par valeur | Primitives (number, string, boolean...) - copie indépendante |
| Passage par référence | Objets, tableaux, fonctions - l'adresse est copiée, pas la valeur |
| `const` + objet | Empêche la réaffectation, mais pas la mutation du contenu |
| `===` sur objets | Compare les adresses, pas le contenu - deux objets distincts ne sont jamais `===` |
| Mutation via fonction | Passer un objet à une fonction peut modifier l'original |
| Pure function | Fonction qui ne modifie pas ses arguments - retourne un nouvel objet |
| Clone superficiel | `{ ...obj }` ou `[...arr]` - copie le premier niveau seulement |
| Clone profond | `structuredClone(obj)` - copie tous les niveaux d'imbrication |

## Prochaine étape

**Module 12 - Le mot-clé `this`** : contexte d'exécution, différence entre fonction classique et fléchée, `call`, `apply`, `bind`, piège classique dans les callbacks.
