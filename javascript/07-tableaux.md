# Module 07 - Les tableaux (Array)

Un tableau est une liste ordonnée d'éléments. En JavaScript, un tableau est un **objet** (passé par référence, voir module 11) et peut contenir des valeurs de types différents.

## Créer un tableau

```javascript
let vide = [];                              // tableau vide
let fruits = ['pomme', 'poire', 'abricot']; // tableau initialisé
let mixte = [1, 'texte', true, null];       // types hétérogènes (possible mais rare)
```

Pour vérifier qu'une valeur est bien un tableau (et non un autre objet) :

```javascript
Array.isArray([1, 2, 3]); // true
Array.isArray('texte');   // false
Array.isArray({ a: 1 });  // false
```

> ℹ️ `typeof [1,2,3]` retourne `'object'` - pas très utile. `Array.isArray()` est la bonne méthode.

## Accès aux éléments

```javascript
const fruits = ['pomme', 'poire', 'abricot'];

fruits[0];       // 'pomme'  - index commence à 0
fruits[fruits.length - 1]; // 'abricot' - dernier élément (méthode classique)
fruits.at(-1);   // 'abricot' - index négatif (ES2022)
fruits.at(-2);   // 'poire'
```

## Propriétés et méthodes de base (mutatrices)

```javascript
array.length;             // nombre d'éléments

array.push('valeur4');    // ajoute à la fin - retourne la nouvelle longueur
array.unshift('valeur0'); // ajoute au début - retourne la nouvelle longueur
array.pop();              // supprime et retourne le dernier élément
array.shift();            // supprime et retourne le premier élément
```

> ⚠️ Ces méthodes **modifient le tableau original**.

## Recherche

```javascript
const fruits = ['pomme', 'poire', 'abricot'];

fruits.indexOf('poire');    // 1 - position de la première occurrence (-1 si absent)
fruits.includes('kiwi');    // false - test de présence
```

`indexOf`/`includes` comparent par égalité stricte, utiles pour les valeurs primitives. Pour des **objets** ou des **conditions plus complexes**, utiliser `find`/`findIndex` :

```javascript
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];

users.find(u => u.id === 2);       // { id: 2, name: 'Bob' } - retourne l'élément
users.findIndex(u => u.id === 2);  // 1 - retourne l'index (-1 si absent)
users.find(u => u.id === 99);      // undefined
```

### `some` et `every`

```javascript
const nombres = [1, 2, 3, 4, 5];

nombres.some(n => n > 4);   // true - au moins un élément satisfait la condition
nombres.every(n => n > 0);  // true - tous les éléments satisfont la condition
nombres.every(n => n > 2);  // false
```

## Extraction et modification

```javascript
const nombres = [1, 2, 3, 4, 5];

// slice - extrait une portion SANS modifier le tableau original
nombres.slice(1, 3);    // [2, 3] - de l'index 1 (inclus) à 3 (exclus)
nombres.slice(-2);      // [4, 5] - les 2 derniers éléments
console.log(nombres);   // [1, 2, 3, 4, 5] - inchangé

// splice - supprime/insère des éléments ET MODIFIE le tableau original
const retires = nombres.splice(1, 2); // supprime 2 éléments depuis l'index 1
// retires = [2, 3], nombres = [1, 4, 5]

// splice peut aussi insérer des éléments
nombres.splice(1, 0, 'a', 'b'); // insère 'a' et 'b' à l'index 1 sans suppression
// nombres = [1, 'a', 'b', 4, 5]
```

> ℹ️ `slice` = sûr (non mutatrice). `splice` = mutatrice et puissante mais à manier avec précaution.

## `forEach` - exécuter une action pour chaque élément

```javascript
const fruits = ['pomme', 'poire', 'abricot'];
fruits.forEach((fruit, index) => {
  console.log(index, fruit);
});
```

## `map` - transformer chaque élément (retourne un **nouveau** tableau)

```javascript
const nombres = [1, 2, 3];
const doubles = nombres.map(n => n * 2); // [2, 4, 6]
console.log(nombres); // [1, 2, 3] → inchangé
```

## `filter` - ne garder que certains éléments

```javascript
const nombres = [1, 2, 3, 4, 5, 6];
const pairs = nombres.filter(n => n % 2 === 0); // [2, 4, 6]
```

## `reduce` - réduire un tableau à une seule valeur

```javascript
const nombres = [1, 2, 3, 4];
const somme = nombres.reduce((accumulateur, valeurCourante) => accumulateur + valeurCourante, 0);
// somme = 10
```

## `reduce` - réduire un tableau à une seule valeur

```javascript
const nombres = [1, 2, 3, 4];
const somme = nombres.reduce((accumulateur, valeurCourante) => accumulateur + valeurCourante, 0);
// somme = 10
```

`reduce` est plus polyvalent qu'il n'y paraît - il peut produire n'importe quel type de valeur (tableau, objet, string...) :

```javascript
// Compter les occurrences
const mots = ['chat', 'chien', 'chat', 'lapin', 'chien', 'chat'];
const comptage = mots.reduce((acc, mot) => {
    acc[mot] = (acc[mot] || 0) + 1;
    return acc;
}, {});
// { chat: 3, chien: 2, lapin: 1 }
```

> ℹ️ `map`, `filter` et `reduce` sont des **pure functions** : elles ne modifient jamais le tableau d'origine, elles en retournent un nouveau. Voir module 11 pour le détail.

## `sort` - trier un tableau

```javascript
const fruits = ['poire', 'pomme', 'abricot'];
fruits.sort(); // ['abricot', 'poire', 'pomme'] - tri alphabétique par défaut
```

> ⚠️ **Piège classique** : `sort` compare les éléments convertis en **strings** par défaut. Sur des nombres, le résultat est faux :
> ```javascript
> [10, 9, 2, 1, 100].sort(); // [1, 10, 100, 2, 9] ⚠️ - ordre alphabétique !
> ```
> Pour trier des **nombres**, passer une fonction de comparaison :
> ```javascript
> [10, 9, 2, 1, 100].sort((a, b) => a - b); // [1, 2, 9, 10, 100] ✅ ascendant
> [10, 9, 2, 1, 100].sort((a, b) => b - a); // [100, 10, 9, 2, 1] ✅ descendant
> ```

> ⚠️ `sort` **modifie le tableau original**. Pour trier sans muter, travailler sur une copie : `[...tableau].sort(...)`

## `reverse` - inverser l'ordre

```javascript
const nombres = [1, 2, 3, 4, 5];
nombres.reverse(); // [5, 4, 3, 2, 1] - modifie le tableau original
```

Mutateur aussi : `[...tableau].reverse()` pour une copie inversée.

```javascript
const fruits = ['pomme', 'poire', 'abricot'];
fruits.join(', ');  // "pomme, poire, abricot"
fruits.join('');    // "pommepoire abricot"
fruits.join(' - '); // "pomme - poire - abricot"
```

## Chaînage de méthodes

Les méthodes non-mutatrices retournent un nouveau tableau, ce qui permet de les chaîner :

```javascript
const commandes = [
    { produit: 'laptop', prix: 1200, actif: true },
    { produit: 'souris', prix: 25, actif: false },
    { produit: 'clavier', prix: 80, actif: true },
    { produit: 'moniteur', prix: 350, actif: true },
];

const totalActifs = commandes
    .filter(c => c.actif)                    // garde les commandes actives
    .map(c => c.prix)                        // extrait les prix
    .reduce((total, prix) => total + prix, 0); // additionne

// totalActifs = 1630
```

---

## Résumé

### Méthodes mutatrices (modifient le tableau original)

| Méthode | Effet |
|---|---|
| `push(v)` | Ajoute à la fin, retourne la nouvelle longueur |
| `pop()` | Supprime et retourne le dernier élément |
| `unshift(v)` | Ajoute au début |
| `shift()` | Supprime et retourne le premier élément |
| `splice(i, n)` | Supprime `n` éléments depuis l'index `i` (peut aussi insérer) |
| `sort(fn)` | Trie sur place - passer une fonction pour les nombres |
| `reverse()` | Inverse l'ordre sur place |

### Méthodes non-mutatrices (retournent un nouveau tableau ou une valeur)

| Méthode | Retourne | Effet |
|---|---|---|
| `slice(d, f)` | Tableau | Extrait une portion (index négatifs OK) |
| `map(fn)` | Tableau | Transforme chaque élément |
| `filter(fn)` | Tableau | Garde les éléments qui satisfont la condition |
| `reduce(fn, init)` | Valeur | Réduit à une seule valeur |
| `find(fn)` | Élément | Premier élément qui satisfait la condition |
| `findIndex(fn)` | Index | Index du premier élément trouvé (-1 si absent) |
| `some(fn)` | Booléen | `true` si au moins un élément satisfait la condition |
| `every(fn)` | Booléen | `true` si tous les éléments satisfont la condition |
| `includes(v)` | Booléen | `true` si la valeur est présente |
| `indexOf(v)` | Index | Position de la valeur (-1 si absente) |
| `join(sep)` | String | Fusionne en chaîne selon un séparateur |
| `at(n)` | Élément | Accès par index, supporte les négatifs |
| `flat(n)` | Tableau | Aplatit les tableaux imbriqués |

## Prochaine étape

**Module 08 - Les objets** : paires clé-valeur, notation pointée et bracket, `Object.keys`, `Object.entries`.
