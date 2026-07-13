# Module 03 - `let`, `const` et `var`

> **Pourquoi trois mots-clés ?**
> `var` est l'original (1995), avec un comportement de portée qui causait des bugs difficiles à détecter. `let` et `const` ont été introduits en ES6 (2015) pour y remédier. En pratique, `var` n'est plus utilisé dans le code moderne.

## `let`

L'instruction `let` permet de déclarer une variable dont la portée est celle du **bloc courant** :

```javascript
let x = 1;

if (x === 1) {
  let x = 2;
  console.log(x); // 2
}

console.log(x); // 1
```

## `var` vs `let` - la portée de bloc

`var` définit une variable dont la portée est celle de la **fonction** englobante (sans distinction des blocs). `let` limite la portée au **bloc** dans lequel elle est déclarée.

```javascript
function varTest() {
  var x = 1;
  if (true) {
    var x = 2; // c'est la même variable !
    console.log(x); // 2
  }
  console.log(x); // 2
}

function letTest() {
  let x = 1;
  if (true) {
    let x = 2; // c'est une variable différente
    console.log(x); // 2
  }
  console.log(x); // 1
}
```

Au niveau global, `var` ajoute une propriété à l'objet global (`window`) alors que `let` ne le fait pas :

```javascript
var x = "global";
let y = "global2";
console.log(this.x); // "global"
console.log(this.y); // undefined
console.log(y);      // "global2"
```

### Le bug classique de `var` en boucle

C'est l'exemple qui illustre le mieux pourquoi `var` a été remplacé. Avec `var`, la boucle ne crée pas une nouvelle variable à chaque itération - toutes les itérations partagent la même :

```javascript
// Avec var - bug classique
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// Affiche : 3, 3, 3 ⚠️
// Au moment où les callbacks s'exécutent, la boucle est terminée et i vaut 3

// Avec let - comportement attendu
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// Affiche : 0, 1, 2 ✅
// let crée une nouvelle liaison pour chaque itération
```

### Redéclaration

`var` peut être redéclarée dans la même portée sans erreur, ce qui peut masquer des bugs :

```javascript
var x = 1;
var x = 2; // OK silencieux ⚠️

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared ✅

const z = 1;
const z = 2; // SyntaxError ✅
```

## Hoisting et zone morte temporelle

`var` est "hissée" (hoisted) en haut de sa fonction et initialisée à `undefined` avant l'exécution - on peut donc l'utiliser avant sa ligne de déclaration sans erreur (mais avec la valeur `undefined`).

`let` et `const` sont aussi hissées, mais restent dans une **zone morte temporelle** (temporal dead zone) : y accéder avant la ligne de déclaration lève une erreur `ReferenceError`.

```javascript
console.log(a); // undefined (pas d'erreur, mais piégeux)
var a = 1;

console.log(b); // ReferenceError
let b = 1;
```

## `const`

La déclaration `const` crée une **constante** : l'identifiant ne peut pas être réaffecté. Une constante doit être initialisée lors de sa déclaration.

```javascript
const number = 42;

try {
  number = 99;
} catch (err) {
  console.log(err);
  // TypeError: Assignment to constant variable.
}

console.log(number); // 42
```

**Attention** : `const` crée une référence en lecture seule vers une valeur. Si le contenu est un objet ou un tableau, l'objet lui-même peut toujours être modifié (voir module 10, Valeur vs Référence) :

```javascript
const person = { name: 'Jean' };
person.name = 'Paul'; // ✅ autorisé : on modifie l'objet, pas la référence
person = {};           // ❌ TypeError : on tente de réaffecter la constante
```

## Convention recommandée

- Utiliser **`const`** par défaut pour toute variable qui n'a pas besoin d'être réaffectée.
- Réserver **`let`** aux cas où la valeur doit changer (compteurs, accumulateurs, résultats intermédiaires...).
- **Éviter `var`** dans du code moderne.

Pour les vraies constantes (valeurs jamais modifiées, connues à l'avance), certaines équipes utilisent la convention **SCREAMING_SNAKE_CASE** pour les distinguer des variables `const` ordinaires :

```javascript
const MAX_RETRIES = 3;       // vraie constante : valeur fixe, jamais mutée
const API_BASE_URL = 'https://api.example.com';

const user = { name: 'Romain' }; // const mais objet modifiable - pas en SCREAMING
user.name = 'Alex';              // ✅ autorisé
```

C'est une convention, pas une obligation du langage - mais elle améliore la lisibilité dans les projets d'équipe.

---

## Résumé

| Notion | `var` | `let` | `const` |
|---|---|---|---|
| Portée | Fonction | Bloc | Bloc |
| Hoisting | ✅ initialisée à `undefined` | ✅ mais zone morte (ReferenceError) | ✅ mais zone morte (ReferenceError) |
| Redéclaration | ✅ silencieuse | ❌ SyntaxError | ❌ SyntaxError |
| Réaffectation | ✅ | ✅ | ❌ TypeError |
| Objet global (`window`) | ✅ ajouté | ❌ | ❌ |
| Usage recommandé | ❌ à éviter | Valeurs qui changent | Par défaut |

| Notion | À retenir |
|---|---|
| Bug `var` en boucle | Toutes les itérations partagent la même variable — `let` crée une liaison par itération |
| Zone morte temporelle | `let`/`const` inaccessibles avant leur ligne de déclaration |
| `const` ≠ immuable | L'identifiant ne peut pas être réaffecté, mais l'objet pointé peut être modifié |
| SCREAMING_SNAKE_CASE | Convention optionnelle pour les vraies constantes (`MAX_RETRIES`, `API_BASE_URL`) |

## Prochaine étape

**Module 04 — Les opérateurs** : arithmétiques, de comparaison stricte (`===` vs `==`), logiques (`&&`, `||`, `??`) et ternaire.
