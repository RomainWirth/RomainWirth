# Module 14 - Gestion des erreurs et JSON

## `try...catch`

```javascript
try {
    // code potentiellement à risque
    JSON.parse('{ceci n\'est pas du JSON valide}');
} catch (err) {
    // exécuté seulement si une erreur a été levée dans le bloc try
    console.log('Une erreur est survenue :', err.message);
} finally {
    // exécuté dans tous les cas, erreur ou non
    console.log('Nettoyage effectué');
}
```

- `try` : contient le code susceptible de générer une erreur.
- `catch` : reçoit l'objet erreur si une exception a été levée.
- `finally` : s'exécute toujours (typiquement pour nettoyer des ressources : fermer une connexion, arrêter un indicateur de chargement...).

## L'objet `Error`

L'objet reçu dans le `catch` possède plusieurs propriétés utiles :

```javascript
try {
    null.propriete;
} catch (err) {
    console.log(err.name);    // 'TypeError'
    console.log(err.message); // "Cannot read properties of null"
    console.log(err.stack);   // pile d'appels complète (utile pour déboguer)
}
```

### Types d'erreurs natifs

| Type | Déclenché quand |
|---|---|
| `TypeError` | Opération sur un type incorrect (`null.x`, appeler un non-fonction) |
| `ReferenceError` | Variable non déclarée, zone morte de `let`/`const` |
| `SyntaxError` | Code JS non analysable (souvent au parse de JSON) |
| `RangeError` | Valeur hors plage valide (`new Array(-1)`, récursion infinie) |

On peut tester le type dans le `catch` pour réagir différemment selon l'erreur :

```javascript
try {
    // ...
} catch (err) {
    if (err instanceof TypeError) {
        console.log('Problème de type :', err.message);
    } else if (err instanceof RangeError) {
        console.log('Valeur hors limites :', err.message);
    } else {
        throw err; // re-throw les erreurs non gérées
    }
}
```

> ℹ️ **Re-throw** : attraper une erreur pour la logger, puis la relancer avec `throw err` permet de ne traiter que les cas qu'on connaît sans avaler silencieusement les autres.

### Erreurs personnalisées

On peut créer ses propres types d'erreur en étendant `Error` (voir module 09 sur l'héritage) :

```javascript
class ValidationError extends Error {
    constructor(champ, message) {
        super(message);
        this.name = 'ValidationError';
        this.champ = champ;
    }
}

try {
    throw new ValidationError('email', 'Format invalide');
} catch (err) {
    if (err instanceof ValidationError) {
        console.log(`Champ '${err.champ}' : ${err.message}`);
        // Champ 'email' : Format invalide
    }
}
```

Les erreurs personnalisées permettent d'identifier précisément la source d'un problème et de transporter des informations supplémentaires (nom du champ, code d'erreur...).

## `throw`

On peut déclencher volontairement une erreur avec `throw` :

```javascript
function diviser(a, b) {
    if (b === 0) {
        throw new Error('Division par zéro impossible');
    }
    return a / b;
}

try {
    diviser(10, 0);
} catch (err) {
    console.log(err.message); // "Division par zéro impossible"
}
```

> ℹ️ Toujours lancer une instance d'`Error` (ou d'une classe qui en hérite) plutôt qu'une string : l'objet `Error` transporte `name`, `message` et `stack`, ce qui facilite le débogage.

> ℹ️ Quand une promesse est rejetée ou qu'`await` échoue, c'est ce même mécanisme qui est utilisé en interne - capturable avec un `try...catch` classique (voir modules 15 et 16).

---

## JSON

**JSON** (JavaScript Object Notation) est un format texte pour représenter des données structurées. C'est le format d'échange le plus utilisé entre un client web et une API.

### `JSON.stringify()` - objet JS → texte

```javascript
const user = { name: 'Romain', age: 34, dev: true };
const jsonText = JSON.stringify(user);
console.log(jsonText);          // '{"name":"Romain","age":34,"dev":true}'
console.log(typeof jsonText);   // "string"
```

Pour un affichage lisible (utile pour le débogage), passer `null` et un nombre d'espaces :

```javascript
console.log(JSON.stringify(user, null, 2));
// {
//   "name": "Romain",
//   "age": 34,
//   "dev": true
// }
```

Utile pour envoyer des données dans le corps d'une requête HTTP (voir module 17) ou pour cloner un objet en profondeur (voir module 11).

### `JSON.parse()` - texte → objet JS

```javascript
const jsonText = '{"name":"Romain","age":34,"dev":true}';
const user = JSON.parse(jsonText);
console.log(user.name);     // "Romain"
console.log(typeof user);   // "object"
```

C'est l'opération inverse. C'est ce que fait en interne `response.json()` de l'API Fetch (module 17).

### Limites de `JSON.stringify`/`JSON.parse`

Cette technique de clonage est pratique mais a des limites : elle perd les fonctions, les `undefined`, et transforme les dates en strings. Alternatives :

```javascript
const copie1 = { ...objet };           // spread (clone superficiel)
const copie2 = structuredClone(objet); // clone profond natif
```

### Ce que JSON ne peut pas représenter

```javascript
const obj = {
    fn: () => 'bonjour',   // fonction
    undef: undefined,       // undefined
    date: new Date(),       // date (convertie en string)
    regex: /abc/,           // regex
};

JSON.stringify(obj);
// '{"date":"2026-07-13T..."}'
// fn, undef et regex disparaissent silencieusement
```

> ⚠️ `JSON.stringify` ignore silencieusement les propriétés dont la valeur est `undefined`, une fonction ou un `Symbol`. Pas d'erreur, elles disparaissent simplement du résultat.

---

## Résumé

| Notion | À retenir |
|---|---|
| `try...catch` | Entoure le code à risque ; `catch` reçoit l'objet erreur |
| `finally` | Toujours exécuté, erreur ou non - utile pour le nettoyage |
| `throw` | Déclenche une erreur volontairement - toujours utiliser `new Error(...)` |
| `err.name` | Type de l'erreur (`'TypeError'`, `'ReferenceError'`...) |
| `err.message` | Description lisible de l'erreur |
| `err.stack` | Pile d'appels complète - utile pour le débogage |
| Types natifs | `TypeError`, `ReferenceError`, `SyntaxError`, `RangeError` |
| `instanceof` | Permet de distinguer les types d'erreur dans le `catch` |
| Re-throw | Attraper, logger, relancer avec `throw err` les erreurs non gérées |
| Erreurs personnalisées | `class MonErreur extends Error` - transporte des infos métier |
| `JSON.stringify(obj)` | Objet JS → string JSON |
| `JSON.stringify(obj, null, 2)` | Avec indentation pour l'affichage débug |
| `JSON.parse(str)` | String JSON → objet JS |
| Limites JSON | Perd fonctions, `undefined`, régex ; dates converties en string |

## Prochaine étape

**Module 15 - Les Promesses** : objet `Promise`, `resolve`/`reject`, `.then()`, `.catch()`, `.finally()`, chaînage, `Promise.all()` - le fondement de tout code asynchrone en JavaScript.
