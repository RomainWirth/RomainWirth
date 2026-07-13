# Jour 01 - Fondamentaux express (1/2)

⏱ **Durée estimée : une demi-journée**

## Objectifs

- Variables, types et interpolation
- Opérateurs et comparaison stricte
- Conditions et boucles

> Tout se code dans la **console** du navigateur (`F12` → Console).

---

## 1.1 - Variables et types

```javascript
const prenom = 'Sacha';   // const : non réassignable (par défaut)
let score = 0;            // let : réassignable
score = 10;

// Types primitifs : string, number, boolean, undefined, null
typeof 'texte';  // "string"
typeof 42;       // "number"
typeof true;     // "boolean"
```

Interpolation avec les backticks :

```javascript
const nom = 'Pikachu';
const niveau = 12;
console.log(`${nom} est au niveau ${niveau}`); // "Pikachu est au niveau 12"
```

> 💡 Utilise `const` par défaut, `let` seulement si la valeur change. Oublie `var`.

---

## 1.2 - Opérateurs

```javascript
10 + 3;   // 13
10 % 3;   // 1   modulo (reste) - utile pour la parité : n % 2 === 0
2 ** 8;   // 256 puissance

let pv = 100;
pv -= 20; // 80
pv++;     // 81
```

Comparaison - **toujours `===`** (compare valeur ET type) :

```javascript
5 === 5;    // true
'5' === 5;  // false  ✅
'5' == 5;   // true   ⚠️ à éviter (conversion implicite)
```

Logiques : `&&` (et), `||` (ou), `!` (non).

```javascript
const vie = 20;
const empoisonne = false;
vie > 0 && !empoisonne; // true
```

---

## 1.3 - Conditions

```javascript
const niveau = 15;

if (niveau >= 30) {
  console.log('Expert');
} else if (niveau >= 10) {
  console.log('Confirmé');
} else {
  console.log('Débutant');
}
```

Ternaire (condition qui renvoie une valeur) :

```javascript
const statut = niveau >= 18 ? 'majeur' : 'mineur';
```

---

## 1.4 - Boucles

```javascript
// for : nombre de tours connu
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 à 4
}

// while : tant qu'une condition est vraie
let energie = 3;
while (energie > 0) {
  console.log(energie);
  energie--;
}
```

> ⚠️ Vérifie qu'une boucle `while` finit toujours par s'arrêter, sinon la page se fige.

---

## Exercices

> 📝 Corrections dans [corrections-fondamentaux.md](./corrections-fondamentaux.md).

### 1.1 - Fiche personnage
Déclare `nom` (string), `niveau` (number), `estCapture` (boolean) et affiche : `Pikachu est au niveau 12. Capturé : true`.

### 1.2 - Pair ou impair
À partir d'une variable `nombre`, affiche `'pair'` ou `'impair'` (indice : `%`).

### 1.3 - Catégorie de niveau
Affiche `'Débutant'` (< 10), `'Confirmé'` (10–30 inclus) ou `'Expert'` (> 30) selon une variable `niveau`.

### 1.4 - Compte à rebours
Avec un `for`, affiche 10 → 1 puis `'Partez !'`.

### 1.5 - Barre de vie
`pointsDeVie = 5`. Avec un `while`, retire 1 point par tour en affichant les PV restants, puis `'K.O. !'`.

### ⚡ Pour aller plus loin - FizzBuzz
De 1 à 30 : `'Fizz'` (÷3), `'Buzz'` (÷5), `'FizzBuzz'` (÷3 et ÷5), sinon le nombre.

---

## Livrable

- [ ] Je déclare des variables (`const`/`let`) et je connais les types de base
- [ ] J'utilise l'interpolation `` `${...}` ``
- [ ] J'écris des conditions et je préfère `===`
- [ ] J'écris des boucles `for` et `while`

➡️ **Jour 02** : fonctions, tableaux et objets - la manipulation de données.
