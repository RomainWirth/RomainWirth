# JAVASCRIPT - SOMMAIRE

Kit d'apprentissage pratique sur JavaScript, des bases au code asynchrone. Chaque module couvre un sujet précis avec des explications et des exemples de code concrets.

## Parcours conseillé

1. [01-introduction.md](./01-introduction.md)
2. [02-variables-et-types.md](./02-variables-et-types.md)
3. [03-let-const-var.md](./03-let-const-var.md)
4. [04-operateurs.md](./04-operateurs.md)
5. [05-conditions-et-boucles.md](./05-conditions-et-boucles.md)
6. [06-strings.md](./06-strings.md)
7. [07-tableaux.md](./07-tableaux.md)
8. [08-objets.md](./08-objets.md)
9. [09-classes.md](./09-classes.md)
10. [10-fonctions.md](./10-fonctions.md)
11. [11-valeur-et-reference.md](./11-valeur-et-reference.md)
12. [12-this.md](./12-this.md)
13. [13-destructuring-spread-rest.md](./13-destructuring-spread-rest.md)
14. [14-erreurs-et-json.md](./14-erreurs-et-json.md)
15. [15-promesses.md](./15-promesses.md)
16. [16-async-await.md](./16-async-await.md)
17. [17-fetch.md](./17-fetch.md)

## Contenu du dossier

### [01-introduction.md](./01-introduction.md)

Rôle de JavaScript dans le web (HTML/CSS/JS), ECMAScript et ES6, console du navigateur (`console.log`, `console.error`...), intégration via `<script>`, attributs `defer`/`async`, cycle d'exécution et DOM.

### [02-variables-et-types.md](./02-variables-et-types.md)

Déclaration et nommage des variables, types primitifs, typage dynamique et faible, `typeof`, `NaN`/`Infinity`, méthodes `Math`, valeurs **truthy/falsy**, conversions explicites (`Number`, `String`, `Boolean`) et coércition implicite.

### [03-let-const-var.md](./03-let-const-var.md)

Portée de bloc vs portée de fonction, hoisting et zone morte temporelle, **bug classique de `var` en boucle**, redéclaration silencieuse, `const` et mutation d'objet, SCREAMING_SNAKE_CASE.

### [04-operateurs.md](./04-operateurs.md)

Opérateurs arithmétiques, pré/post-incrément, comparaison stricte vs faible (`===`/`==`), logiques (`&&`, `||`, `!`, `??`), différence `||` vs `??`, short-circuit, précédence, ternaire, chaînage optionnel `?.`.

### [05-conditions-et-boucles.md](./05-conditions-et-boucles.md)

`if`/`else if`/`else`, **guard clauses**, `switch` (avec `return`), boucles `for`/`while`/`do...while`/`for...of`/`for...in`, `for...of` avec `.entries()`, warning `for...in` sur tableau, `break`/`continue`.

### [06-strings.md](./06-strings.md)

Immutabilité des strings, accès par index (`at()`), recherche (`includes`, `startsWith`, `endsWith`, `indexOf`), transformation (`trim`, `replace`, `replaceAll`), extraction (`slice`), formatage (`padStart`, `repeat`), template literals (expressions, multiligne).

### [07-tableaux.md](./07-tableaux.md)

`Array.isArray()`, accès avec `at()`, méthodes **mutatrices** (`push`/`pop`/`sort`/`splice`/`reverse`) vs **non-mutatrices** (`map`/`filter`/`reduce`/`find`/`some`/`every`), **piège `sort` sur les nombres**, chaînage de méthodes.

### [08-objets.md](./08-objets.md)

Notation pointée et bracket, syntaxe raccourcie ES6, noms de propriétés calculés, méthodes dans un objet, copie et fusion avec spread / `Object.assign()`, itération avec `Object.entries()`, `Object.freeze()`, distinction objet littéral vs JSON.

### [09-classes.md](./09-classes.md)

Champs de classe, **propriétés privées `#`**, getters/setters, héritage avec `extends`/`super`, surcharge de méthode, membres `static`, `instanceof`, classes vs objets littéraux.

### [10-fonctions.md](./10-fonctions.md)

Portée locale, fonctions déclarées / expressions de fonction / fléchées, paramètres par défaut, **fonctions d'ordre supérieur**, **closures**, récursivité, différences de hoisting et de `this`.

### [11-valeur-et-reference.md](./11-valeur-et-reference.md)

Passage par valeur vs par référence, `const` ne protège pas de la mutation, passer un objet à une fonction, **clone superficiel vs clone profond** (`structuredClone`), pure functions.

### [12-this.md](./12-this.md)

Les **5 règles de détermination de `this`** (défaut, implicite, explicite, `new`, flèche), piège dans les callbacks, `call` vs `apply` vs `bind`, `this` dans les event listeners et dans les classes.

### [13-destructuring-spread-rest.md](./13-destructuring-spread-rest.md)

Rest parameter, spread sur tableaux / objets / strings, clone superficiel, destructuring de tableau et d'objet (valeurs par défaut, renommage, imbriqué, paramètres de fonction), **destructuring dans les boucles** et dans les imports.

### [14-erreurs-et-json.md](./14-erreurs-et-json.md)

Propriétés de l'objet `Error` (`name`, `message`, `stack`), types d'erreurs natifs (`TypeError`, `ReferenceError`...), `instanceof` dans le `catch`, **erreurs personnalisées**, re-throw, `JSON.stringify` (indentation incluse), limites du format JSON.

### [15-promesses.md](./15-promesses.md)

États `pending`/`fulfilled`/`rejected`, `Promise.resolve`/`reject`, `.then()`/`.catch()`/`.finally()`, chaînage, `Promise.all()`, **`Promise.allSettled()`**, **`Promise.race()`**, rejets non gérés.

### [16-async-await.md](./16-async-await.md)

Syntaxe `async`/`await`, réécriture d'enchaînements de promesses, **séquentiel vs parallèle** (piège de performance), `await` dans les boucles (`for...of` vs `forEach`), top-level `await`.

### [17-fetch.md](./17-fetch.md)

Les deux opérations asynchrones, **distinction erreur réseau vs erreur HTTP**, `response.ok`, exemple POST (method/body/Content-Type), `AbortController`, CORS, exemple GET+PUT enchaînés en `.then()` et en `async`/`await`.

## Logique du dossier

Ce cours peut servir :

- de parcours complet pour apprendre JavaScript des bases à l'asynchrone ;
- de référence rapide sur un concept précis (closures, destructuring, promesses...) ;
- de base avant d'aborder des frameworks JS (React, Vue, Astro).

## Remarque

Les modules 15 à 17 (promesses, `async`/`await`, Fetch) forment un bloc cohérent sur la programmation asynchrone et sont à lire dans l'ordre. Le module 11 (Valeur vs Référence) est indispensable avant d'aborder les modules 13 et suivants. Chaque module se termine par un résumé en tableau et une indication vers le module suivant.
