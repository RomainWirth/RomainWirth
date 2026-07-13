# Jour 01 - Environnement, variables et types

⏱ **Durée estimée : une demi-journée**

## Objectifs pédagogiques

- Savoir ouvrir et utiliser la console du navigateur
- Afficher des messages avec `console.log()`
- Déclarer des variables avec `let` et `const`
- Reconnaître les types primitifs de JavaScript

---

## 1.1 - La console, ton terrain de jeu

Tout le code des jours 1 à 5 se tape directement dans la **console du navigateur**. Pas besoin d'installer quoi que ce soit.

**Ouvrir la console** : `F12` (ou `Cmd+Option+I` sur Mac), puis onglet **Console**.

Tape ceci, puis `Entrée` :

```javascript
console.log('Bonjour !');
```

Le message s'affiche. `console.log()` est l'outil que tu utiliseras en permanence pour **afficher des valeurs** et vérifier ce que fait ton code.

> 💡 Tu peux aussi taper une expression directement (sans `console.log`) : la console affiche automatiquement son résultat. `console.log()` reste indispensable dès qu'on écrit des scripts plus longs.

---

## 1.2 - Les variables : `let` et `const`

Une **variable** est une boîte nommée dans laquelle on range une valeur pour la réutiliser.

```javascript
let age = 25;
const prenom = 'Sacha';
```

- **`let`** : la valeur peut changer plus tard.
- **`const`** : la valeur est fixée une fois pour toutes (constante).

```javascript
let score = 0;
score = 10;      // ✅ autorisé avec let

const pays = 'France';
pays = 'Belgique'; // ❌ erreur : on ne peut pas réaffecter une const
```

> 💡 **Règle pratique** : utilise `const` par défaut. Passe à `let` uniquement si tu sais que la valeur va changer. On évite l'ancien mot-clé `var`.

### Nommer ses variables

- Un nom clair et descriptif : `nombreDeVies` plutôt que `n`.
- Convention **camelCase** : première lettre minuscule, puis une majuscule à chaque nouveau mot (`prenomUtilisateur`).
- Pas d'espaces ni d'accents, pas de chiffre en première position.

---

## 1.3 - Les types primitifs

Chaque valeur a un **type**. Les types de base :

| Type | Exemple | Usage |
|---|---|---|
| `string` | `'Pikachu'` | Du texte (entre guillemets) |
| `number` | `42`, `3.14` | Un nombre (entier ou décimal) |
| `boolean` | `true`, `false` | Vrai ou faux |
| `undefined` | `undefined` | Variable déclarée sans valeur |
| `null` | `null` | Absence de valeur volontaire |

Pour connaître le type d'une valeur, on utilise `typeof` :

```javascript
typeof 'Pikachu'; // "string"
typeof 42;        // "number"
typeof true;      // "boolean"
```

### Les chaînes de caractères

On peut coller (concaténer) des chaînes avec `+`, ou mieux, utiliser les **backticks** `` ` `` avec `${}` (interpolation) :

```javascript
const nom = 'Sacha';
const message = 'Bonjour ' + nom + ' !';     // concaténation
const message2 = `Bonjour ${nom} !`;          // interpolation (préférable)
console.log(message2);                         // "Bonjour Sacha !"
```

---

## Exercices

> 📝 Fais ces exercices dans la console. Cherche par toi-même avant de regarder [les corrections](./corrections-fondamentaux.md).

### Exercice 1.1 - Première variable

1. Déclare une constante `pseudo` contenant ton pseudo (une chaîne).
2. Affiche dans la console la phrase : `Bienvenue, <pseudo> !` en utilisant l'interpolation avec les backticks.

### Exercice 1.2 - Fiche personnage

Déclare les variables suivantes pour représenter un personnage :

| Variable | Type | Exemple de valeur |
|---|---|---|
| `nom` | `string` | `'Pikachu'` |
| `niveau` | `number` | `12` |
| `estCapture` | `boolean` | `true` |

Puis affiche une phrase du type :
`Pikachu est au niveau 12. Capturé : true`

### Exercice 1.3 - Types

Pour chacune de ces valeurs, **devine** le type avant de le vérifier avec `typeof` :

```javascript
'42'
42
false
undefined
3.14
```

### Exercice 1.4 - Modifier une valeur

1. Déclare `let vies = 3`.
2. Affiche `vies`.
3. Change sa valeur à `2`, puis affiche-la de nouveau.
4. Essaie de faire la même chose avec une `const` et observe l'erreur dans la console.

### ⚡ Pour aller plus loin

Déclare deux variables `prenom` et `nom`, puis crée une variable `nomComplet` qui les combine avec un espace. Affiche le résultat. Que se passe-t-il si l'une des deux est un nombre au lieu d'une chaîne ?

---

## Livrable

- [ ] Je sais ouvrir la console du navigateur
- [ ] J'ai affiché des messages avec `console.log()`
- [ ] J'ai déclaré des variables avec `let` et `const` et compris la différence
- [ ] J'ai utilisé l'interpolation `` `${...}` ``
- [ ] J'ai identifié le type de plusieurs valeurs avec `typeof`

➡️ **Demain (Jour 02)** : prendre des décisions dans le code avec les conditions, et répéter des actions avec les boucles.
