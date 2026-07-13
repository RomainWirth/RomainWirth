# Jour 02 - Opérateurs, conditions et boucles

⏱ **Durée estimée : une demi-journée à une journée**

## Objectifs pédagogiques

- Utiliser les opérateurs arithmétiques et de comparaison
- Prendre des décisions avec `if` / `else if` / `else`
- Comprendre la différence entre `==` et `===`
- Répéter des actions avec les boucles `for` et `while`

---

## 2.1 - Les opérateurs arithmétiques

```javascript
let a = 10;
let b = 3;

a + b;   // 13  addition
a - b;   // 7   soustraction
a * b;   // 30  multiplication
a / b;   // 3.33 division
a % b;   // 1   modulo (reste de la division) - utile pour tester la parité
```

Raccourcis fréquents :

```javascript
let score = 0;
score += 10;  // équivaut à score = score + 10  → 10
score++;      // ajoute 1  → 11
```

---

## 2.2 - Les opérateurs de comparaison

Ils renvoient un booléen (`true` ou `false`) :

```javascript
5 > 3;    // true
5 < 3;    // false
5 >= 5;   // true
5 === 5;  // true  (égalité stricte)
5 !== 3;  // true  (différent)
```

> ⚠️ **`===` vs `==`** : utilise toujours `===` (égalité **stricte**), qui compare la valeur ET le type. `==` fait des conversions surprenantes :
> ```javascript
> '5' == 5;   // true  ⚠️ conversion automatique
> '5' === 5;  // false ✅ types différents
> ```

---

## 2.3 - Les conditions

Le `if` exécute un bloc **si** une condition est vraie :

```javascript
const age = 15;

if (age >= 18) {
  console.log('Majeur');
} else if (age >= 13) {
  console.log('Adolescent');
} else {
  console.log('Enfant');
}
```

### Les opérateurs logiques

- `&&` (ET) : vrai si **les deux** conditions sont vraies
- `||` (OU) : vrai si **au moins une** condition est vraie
- `!` (NON) : inverse un booléen

```javascript
const vie = 20;
const estEmpoisonne = false;

if (vie > 0 && !estEmpoisonne) {
  console.log('Le personnage est en pleine forme');
}
```

---

## 2.4 - Les boucles

Une boucle **répète** un bloc de code.

### `for` - quand on connaît le nombre de répétitions

```javascript
for (let i = 0; i < 5; i++) {
  console.log('Tour numéro ' + i);
}
// Affiche les tours 0 à 4
```

Les trois parties : **initialisation** (`let i = 0`), **condition** (`i < 5`), **incrément** (`i++`).

### `while` - tant qu'une condition est vraie

```javascript
let energie = 3;

while (energie > 0) {
  console.log('Attaque ! Énergie restante : ' + energie);
  energie--;
}
```

> ⚠️ Assure-toi que la condition finira par devenir fausse, sinon la boucle tourne à l'infini et fige la page.

---

## Exercices

> 📝 Cherche par toi-même avant de consulter [les corrections](./corrections-fondamentaux.md).

### Exercice 2.1 - Pair ou impair

Écris un `if` qui affiche `'pair'` ou `'impair'` selon la valeur d'une variable `nombre`. (Indice : utilise le modulo `%`.)

### Exercice 2.2 - Catégorie de niveau

Une variable `niveau` contient un nombre. Affiche :
- `'Débutant'` si le niveau est inférieur à 10 ;
- `'Confirmé'` s'il est entre 10 et 30 (inclus) ;
- `'Expert'` s'il est supérieur à 30.

### Exercice 2.3 - Compte à rebours

Avec une boucle `for`, affiche un compte à rebours de 10 à 1, puis le mot `'Partez !'`.

### Exercice 2.4 - Table de multiplication

Avec une boucle, affiche la table de multiplication de 7 (de `7 x 1 = 7` jusqu'à `7 x 10 = 70`).

### Exercice 2.5 - Barre de vie

Une variable `pointsDeVie` vaut `5`. Avec une boucle `while`, simule des attaques qui retirent 1 point à chaque tour, en affichant les points restants à chaque tour, jusqu'à atteindre 0. Affiche `'K.O. !'` à la fin.

### ⚡ Pour aller plus loin

Écris une boucle qui parcourt les nombres de 1 à 30 et affiche :
- `'Fizz'` si le nombre est divisible par 3 ;
- `'Buzz'` s'il est divisible par 5 ;
- `'FizzBuzz'` s'il est divisible par les deux ;
- le nombre lui-même sinon.

---

## Livrable

- [ ] J'utilise les opérateurs arithmétiques et le modulo
- [ ] Je comprends pourquoi on préfère `===` à `==`
- [ ] J'écris des conditions avec `if` / `else if` / `else`
- [ ] Je combine des conditions avec `&&`, `||`, `!`
- [ ] J'écris des boucles `for` et `while`

➡️ **Demain (Jour 03)** : ranger notre code dans des fonctions réutilisables.
