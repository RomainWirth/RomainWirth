# Module 06 - Les chaînes de caractères (String)

La déclaration et l'interpolation ont été vues au module 02. Ce module couvre l'ensemble des méthodes utiles au quotidien.

> ℹ️ **Les strings sont immuables.** Aucune méthode ne modifie la chaîne originale - elles retournent toutes une **nouvelle** chaîne. Il faut stocker le résultat dans une variable.
> ```javascript
> const phrase = 'bonjour';
> phrase.toUpperCase(); // 'BONJOUR' - phrase est toujours 'bonjour'
> const majuscule = phrase.toUpperCase(); // on stocke le résultat
> ```

---

## Longueur et accès aux caractères

```javascript
const mot = 'Bonjour';

mot.length;      // 7 - nombre de caractères
mot[0];          // 'B' - accès par index (comme un tableau)
mot.charAt(0);   // 'B' - équivalent
mot.at(-1);      // 'r' - index négatif : commence par la fin (ES2022)
mot.at(-2);      // 'u'
```

---

## Recherche et test

```javascript
const phrase = 'Bonjour le monde';

phrase.includes('monde');       // true - teste la présence d'une sous-chaîne
phrase.startsWith('Bonjour');   // true - commence par...
phrase.endsWith('monde');       // true - se termine par...
phrase.indexOf('monde');        // 11 - position de la première occurrence (-1 si absent)
phrase.lastIndexOf('o');        // 9 - position de la dernière occurrence
```

---

## Transformation

```javascript
const phrase = '  Bonjour le monde  ';

phrase.trim();           // 'Bonjour le monde' - retire les espaces en début/fin
phrase.trimStart();      // 'Bonjour le monde  ' - retire seulement en début
phrase.trimEnd();        // '  Bonjour le monde' - retire seulement en fin
phrase.toUpperCase();    // '  BONJOUR LE MONDE  '
phrase.toLowerCase();    // '  bonjour le monde  '

'Bonjour le monde'.replace('monde', 'JS');    // 'Bonjour le JS' - première occurrence seulement
'aaabbbccc'.replaceAll('a', 'x');             // 'xxxbbbccc' - toutes les occurrences
```

> ℹ️ `replace` avec un premier argument string ne remplace que la **première** occurrence. Pour toutes les remplacer, utiliser `replaceAll` ou passer une **regex** avec le flag `g` : `str.replace(/a/g, 'x')`.

---

## Extraction

```javascript
const phrase = 'Bonjour le monde';

phrase.slice(8, 10);    // 'le' - extrait de l'index 8 (inclus) à 10 (exclus)
phrase.slice(8);        // 'le monde' - jusqu'à la fin
phrase.slice(-5);       // 'monde' - les 5 derniers caractères
phrase.substring(8, 10); // 'le' - similaire à slice, mais pas d'index négatif
```

> ℹ️ Préférer `slice` à `substring` en pratique : `slice` supporte les index négatifs et son comportement est plus prévisible.

---

## Formatage

```javascript
'5'.padStart(3, '0');   // '005' - complète à gauche jusqu'à longueur 3
'5'.padEnd(3, '0');     // '500' - complète à droite
'ha'.repeat(3);         // 'hahaha'
```

---

## Concaténation et template literals

Avec l'opérateur `+` (déconseillé pour plus de deux variables) :

```javascript
const greeting = 'Bonjour ' + name + ' !';
```

Avec les **template literals** (préférable) :

```javascript
const name = 'Romain';
const age = 34;
const greeting = `Bonjour ${name}, tu as ${age} ans !`;
```

Les template literals acceptent **n'importe quelle expression** entre `${}` :

```javascript
const prix = 9.9;
console.log(`Total : ${(prix * 1.2).toFixed(2)} €`); // "Total : 11.88 €"
console.log(`Statut : ${age >= 18 ? 'majeur' : 'mineur'}`);
```

Ils peuvent aussi s'étendre sur **plusieurs lignes** sans caractère d'échappement :

```javascript
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age : ${age}</p>
  </div>
`;
```

---

## `split` et `join`

`split()` transforme une chaîne en tableau, `join()` (méthode Array) fait l'inverse :

```javascript
'pomme,poire,abricot'.split(',');           // ['pomme', 'poire', 'abricot']
'Bonjour le monde'.split(' ');             // ['Bonjour', 'le', 'monde']
'abc'.split('');                           // ['a', 'b', 'c'] - découpe caractère par caractère

['pomme', 'poire', 'abricot'].join(', ');  // 'pomme, poire, abricot'
['pomme', 'poire', 'abricot'].join('');    // 'pommepoire abricot'
```

---

## Résumé

| Méthode | Retourne | À retenir |
|---|---|---|
| `.length` | `number` | Propriété, pas une méthode (pas de `()`) |
| `.at(n)` | `string` | Supporte les index négatifs |
| `.includes(s)` | `boolean` | Présence d'une sous-chaîne |
| `.startsWith(s)` / `.endsWith(s)` | `boolean` | Début / fin de chaîne |
| `.indexOf(s)` | `number` | Position, -1 si absent |
| `.trim()` | `string` | Retire les espaces en début et fin |
| `.toUpperCase()` / `.toLowerCase()` | `string` | Changement de casse |
| `.replace(a, b)` | `string` | Remplace la **première** occurrence |
| `.replaceAll(a, b)` | `string` | Remplace **toutes** les occurrences |
| `.slice(début, fin)` | `string` | Extrait une sous-chaîne, index négatifs OK |
| `.padStart(n, c)` / `.padEnd(n, c)` | `string` | Complète jusqu'à longueur `n` |
| `.repeat(n)` | `string` | Répète la chaîne `n` fois |
| `.split(sep)` | `array` | Découpe en tableau selon un séparateur |

> ℹ️ Toutes ces méthodes retournent une **nouvelle** chaîne, la chaîne originale reste inchangée.

## Prochaine étape

**Module 07 - Les tableaux** : créer et manipuler des tableaux avec `push`, `pop`, `map`, `filter`, `reduce`...
