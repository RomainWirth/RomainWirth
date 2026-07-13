# Module 04 - Les opérateurs

## Opérateurs arithmétiques

Ces opérateurs permettent d'effectuer des opérations mathématiques de base :

```javascript
let total = 10;
total += 5;   // 15  (addition)
total -= 3;   // 12  (soustraction)
total *= 2;   // 24  (multiplication)
total /= 4;   // 6   (division)
total++;      // 7   (incrémentation de 1)
total--;      // 6   (décrémentation de 1)
```

### Pré-incrément vs post-incrément

`i++` retourne la valeur **avant** l'incrémentation ; `++i` retourne la valeur **après**. La différence ne compte que quand on utilise la valeur dans une expression :

```javascript
let i = 5;
console.log(i++); // affiche 5, PUIS i devient 6
console.log(i);   // 6

let j = 5;
console.log(++j); // j devient 6, PUIS affiche 6
console.log(j);   // 6
```

Dans une boucle `for (let i = 0; i < n; i++)`, la distinction n'a pas d'importance pratique - les deux fonctionnent.

Le **modulo** `%` retourne le reste de la division entière :

```javascript
10 % 3;   // 1 → utile pour tester la parité : n % 2 === 0
```

L'**exponentiation** `**` :

```javascript
2 ** 8;   // 256 → équivalent de Math.pow(2, 8)
```

## Opérateurs de comparaison

JavaScript propose deux familles de comparaison :

| Opérateur | Nom | Compare | Exemple |
|---|---|---|---|
| `==` | égalité faible | la valeur, avec conversion de type | `'5' == 5` → `true` |
| `===` | égalité stricte | la valeur ET le type | `'5' === 5` → `false` |
| `!=` | inégalité faible | avec conversion de type | `'5' != 5` → `false` |
| `!==` | inégalité stricte | sans conversion | `'5' !== 5` → `true` |
| `<`, `>`, `<=`, `>=` | comparaisons numériques | | `3 < 5` → `true` |

> ⚠️ Toujours préférer `===` et `!==` à `==` et `!=`. L'égalité faible entraîne des conversions de type contre-intuitives (`'' == 0` → `true`, `null == undefined` → `true` mais `null === undefined` → `false`).

## Opérateurs logiques

| Opérateur | Nom | Effet |
|---|---|---|
| `&&` | ET logique | vrai si les deux opérandes sont vrais |
| `\|\|` | OU logique | vrai si au moins un opérande est vrai |
| `!` | NON logique | inverse un booléen |
| `??` | coalescence des nuls | renvoie l'opérande de droite si celui de gauche est `null` ou `undefined` |

```javascript
let isLoggedIn = true;
let isAdmin = false;
isLoggedIn && isAdmin;   // false
isLoggedIn || isAdmin;   // true
!isLoggedIn;             // false

let username = null;
let displayName = username ?? 'Invité'; // 'Invité'
```

### `||` vs `??` - quelle différence ?

`||` retourne la valeur de droite si celle de gauche est **falsy** (ce qui inclut `0`, `''`, `false`...).
`??` retourne la valeur de droite uniquement si celle de gauche est **`null` ou `undefined`** - ce qui est souvent plus précis :

```javascript
const score = 0;

const a = score || 10;  // 10 ⚠️ - 0 est falsy, la valeur par défaut s'applique
const b = score ?? 10;  //  0 ✅ - 0 n'est ni null ni undefined, on le conserve
```

Préférer `??` quand la valeur `0`, `false` ou `''` est une valeur valide et non un "vide".

### Court-circuit (*short-circuit evaluation*)

`&&` et `||` n'évaluent pas le second opérande si le premier suffit à déterminer le résultat :

```javascript
user && user.sayHello();         // sayHello() n'est appelé que si user est truthy
isAdmin || showLoginForm();      // showLoginForm() n'est appelé que si isAdmin est falsy
```

### Précédence : `&&` avant `||`

`&&` est évalué avant `||`, comme la multiplication avant l'addition :

```javascript
true || false && false   // true || (false && false) → true || false → true
(true || false) && false // true && false → false
```

En cas de doute, utiliser des parenthèses pour rendre l'intention explicite.

## Opérateur ternaire

Écriture condensée d'un `if...else` qui renvoie une valeur :

```javascript
const age = 20;
const statut = age >= 18 ? 'majeur' : 'mineur';
```

Le ternaire peut être imbriqué, mais au-delà d'un niveau ça nuit à la lisibilité - préférer un `if/else` dans ce cas.

## Chaînage optionnel `?.`

L'opérateur `?.` permet d'accéder à une propriété ou d'appeler une méthode sans lever d'erreur si la valeur est `null` ou `undefined`. Il retourne `undefined` au lieu de planter.

```javascript
const user = null;

console.log(user.name);    // TypeError: Cannot read properties of null ❌
console.log(user?.name);   // undefined ✅ - pas d'erreur

const order = { address: { city: 'Paris' } };
order?.address?.city;      // 'Paris'
order?.billing?.city;      // undefined (billing n'existe pas, pas d'erreur)
```

Très souvent combiné avec `??` pour fournir une valeur par défaut :

```javascript
const city = user?.address?.city ?? 'Ville inconnue';
```

---

## Résumé

| Opérateur | Catégorie | À retenir |
|---|---|---|
| `+` `-` `*` `/` `%` `**` | Arithmétique | `%` = reste de division, `**` = puissance |
| `++` `--` | Incrémentation | `i++` retourne avant ; `++i` retourne après |
| `+=` `-=` `*=` `/=` | Affectation raccourcie | Modifie ET réaffecte en une opération |
| `===` `!==` | Comparaison stricte | Vérifie valeur ET type - à toujours préférer |
| `==` `!=` | Comparaison faible | Conversion implicite de type - à éviter |
| `<` `>` `<=` `>=` | Comparaison d'ordre | Fonctionne aussi sur les strings (ordre alphabétique) |
| `&&` | ET logique | Court-circuite si le premier opérande est falsy |
| `\|\|` | OU logique | Court-circuite si le premier opérande est truthy |
| `!` | NON logique | Inverse un booléen |
| `??` | Coalescence des nuls | Valeur par défaut uniquement si `null`/`undefined` |
| `?.` | Chaînage optionnel | Accès sécurisé sans erreur si `null`/`undefined` |
| `? :` | Ternaire | `if/else` inline qui renvoie une valeur |

## Prochaine étape

**Module 05 - Conditions et boucles** : utiliser ces opérateurs dans des structures `if/else`, `switch` et des boucles `for`, `while`, `for...of`.
