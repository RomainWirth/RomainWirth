# Module 08 - Les objets JavaScript

## Définition

Un objet JavaScript est une collection de **paires clés-valeurs** (aussi appelées propriétés), entre accolades.

```javascript
let user = {
    name: 'Romain',
    age: 34,
    isAdmin: false,
    adresse: {
        ville: 'Paris',
        codePostal: '75001'
    }
}
```

Les valeurs peuvent être de n'importe quel type : string, number, boolean, tableau, autre objet, ou même une fonction (on parle alors de **méthode**).

> ℹ️ **Objet littéral ≠ JSON** : le format JSON (utilisé pour échanger des données avec une API) s'inspire de la syntaxe des objets JS, mais est plus strict : les clés doivent être entre guillemets doubles, les fonctions et `undefined` sont interdits. Voir module 14 pour `JSON.stringify`/`JSON.parse`.

## Accéder aux données

**Notation pointée** (la plus courante) :

```javascript
const user = { name: 'Romain', age: 34 };
user.name; // 'Romain'
user.age;  // 34
```

**Notation bracket** - indispensable quand le nom de la clé est dynamique (stocké dans une variable) :

```javascript
const user = { name: 'Romain', age: 34 };
user['name'];   // 'Romain'

const key = 'name';
user[key];      // 'Romain' - on ne peut pas écrire user.key ici
```

## Ajouter, modifier, supprimer une propriété

```javascript
let user = { name: 'Romain' };

user.age = 34;       // ajout
user.name = 'Alex';  // modification
delete user.age;     // suppression

'name' in user;      // true - teste l'existence d'une clé
```

## Syntaxe raccourcie (ES6)

Quand le nom de la variable et de la clé sont identiques, on peut éviter la répétition :

```javascript
const name = 'Romain';
const age = 34;

// Syntaxe longue
const user = { name: name, age: age };

// Syntaxe raccourcie ES6
const user = { name, age }; // équivalent
```

Les **noms de propriétés calculés** permettent d'utiliser une expression comme clé :

```javascript
const key = 'role';
const user = {
    name: 'Romain',
    [key]: 'admin',        // la clé sera 'role'
    [`${key}_level`]: 2    // la clé sera 'role_level'
};
// { name: 'Romain', role: 'admin', role_level: 2 }
```

## Méthodes dans un objet

Une propriété dont la valeur est une fonction s'appelle une **méthode**. On peut l'écrire de deux façons :

```javascript
const user = {
    name: 'Romain',

    // Syntaxe longue
    sayHello: function() {
        return 'Bonjour ' + this.name;
    },

    // Syntaxe raccourcie (recommandée)
    greet() {
        return `Bonjour ${this.name}`;
    }
};

user.greet(); // 'Bonjour Romain'
```

> ℹ️ `this` dans une méthode fait référence à l'objet courant. Voir module 12 pour les détails.

## Méthodes utiles

```javascript
const user = { name: 'Romain', age: 34 };

Object.keys(user);    // ['name', 'age']
Object.values(user);  // ['Romain', 34]
Object.entries(user); // [['name', 'Romain'], ['age', 34]]
```

### Itérer sur un objet avec `Object.entries()`

Combiner `Object.entries()` et `for...of` avec destructuring (module 13) :

```javascript
const scores = { Alice: 95, Bob: 82, Charlie: 78 };

for (const [nom, score] of Object.entries(scores)) {
    console.log(`${nom} : ${score}`);
}
// Alice : 95
// Bob : 82
// Charlie : 78
```

### Copier et fusionner des objets

Les objets sont passés par référence (module 11). Pour créer une copie indépendante :

```javascript
const original = { name: 'Romain', age: 34 };

// Copie superficielle avec le spread operator
const copie = { ...original };
copie.name = 'Alex'; // original.name reste 'Romain'

// Fusionner deux objets
const defaults = { lang: 'fr', theme: 'light' };
const user = { name: 'Romain', theme: 'dark' };
const config = { ...defaults, ...user };
// { lang: 'fr', theme: 'dark', name: 'Romain' }
// Les propriétés de droite écrasent celles de gauche
```

Au lieu du spread, on peut aussi utiliser `Object.assign(cible, ...sources)` :

```javascript
const config = Object.assign({}, defaults, user); // même résultat
```

> ⚠️ Ces deux méthodes font une **copie superficielle** : si l'objet contient des propriétés qui sont elles-mêmes des objets, les références sont copiées, pas les objets. Pour un clone profond : `structuredClone(obj)`.

### Geler un objet avec `Object.freeze()`

`Object.freeze()` empêche toute modification d'un objet :

```javascript
const config = Object.freeze({ env: 'production', debug: false });
config.debug = true;    // silencieusement ignoré (ou erreur en mode strict)
console.log(config.debug); // false
```

Utile pour des objets de configuration qu'on ne veut pas voir modifiés accidentellement.

---

## Résumé

| Notion | À retenir |
|---|---|
| Objet littéral | `{ clé: valeur }` - les valeurs peuvent être de tout type |
| Notation pointée | `obj.cle` - usage courant |
| Notation bracket | `obj['cle']` ou `obj[variable]` - pour les clés dynamiques |
| Syntaxe raccourcie | `{ name, age }` équivaut à `{ name: name, age: age }` |
| Propriétés calculées | `{ [variable]: valeur }` |
| Méthode | Fonction dans un objet ; `greet() {}` en syntaxe raccourcie |
| `in` | Test d'existence d'une clé |
| `Object.keys/values/entries` | Obtenir les clés, valeurs ou paires sous forme de tableau |
| Copie | `{ ...obj }` ou `Object.assign({}, obj)` - superficielle |
| Fusion | `{ ...a, ...b }` - les propriétés de droite écrasent celles de gauche |
| `Object.freeze()` | Rend un objet immuable |
| Objet vs JSON | Objet littéral ≠ JSON : JSON exige des guillemets doubles sur les clés |

## Prochaine étape

**Module 09 - Les classes** : créer des modèles d'objets réutilisables avec `class`, `constructor`, `new`, héritage avec `extends`.
