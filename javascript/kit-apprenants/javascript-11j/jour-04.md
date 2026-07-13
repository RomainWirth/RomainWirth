# Jour 04 - Les tableaux

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Créer et manipuler des tableaux
- Parcourir un tableau avec `forEach`
- Transformer et filtrer des données avec `map` et `filter`
- Trier avec `sort` et agréger avec `reduce`

> 🎯 **Chapitre clé.** Ces méthodes sont exactement celles que tu utiliseras pour manipuler les données de l'API à partir du jour 9. Prends le temps de bien les assimiler.

---

## 4.1 - Créer et lire un tableau

Un **tableau** (array) est une liste ordonnée de valeurs :

```javascript
const fruits = ['pomme', 'poire', 'abricot'];

fruits[0];       // 'pomme'  (l'index commence à 0)
fruits[2];       // 'abricot'
fruits.length;   // 3        (nombre d'éléments)
```

Ajouter / retirer :

```javascript
fruits.push('kiwi');   // ajoute à la fin
fruits.pop();          // retire le dernier
```

---

## 4.2 - Parcourir avec `forEach`

`forEach` exécute une fonction pour **chaque** élément du tableau :

```javascript
const equipe = ['Pikachu', 'Bulbizarre', 'Salamèche'];

equipe.forEach((membre) => {
  console.log(membre);
});
```

La fonction fléchée reçoit chaque élément l'un après l'autre. On peut aussi récupérer l'index :

```javascript
equipe.forEach((membre, index) => {
  console.log(`${index + 1}. ${membre}`);
});
// 1. Pikachu
// 2. Bulbizarre
// 3. Salamèche
```

---

## 4.3 - Transformer avec `map`

`map` crée un **nouveau tableau** en transformant chaque élément :

```javascript
const nombres = [1, 2, 3];
const doubles = nombres.map((n) => n * 2);

console.log(doubles);  // [2, 4, 6]
console.log(nombres);  // [1, 2, 3]  → l'original est inchangé
```

Exemple orienté données :

```javascript
const noms = ['pikachu', 'bulbizarre'];
const nomsMajuscules = noms.map((nom) => nom.toUpperCase());
// ['PIKACHU', 'BULBIZARRE']
```

> 💡 `map` sera au cœur du jour 9 : on transformera chaque élément de données en une **carte HTML**.

---

## 4.4 - Filtrer avec `filter`

`filter` crée un nouveau tableau en ne gardant que les éléments qui **passent un test** :

```javascript
const nombres = [1, 2, 3, 4, 5, 6];
const pairs = nombres.filter((n) => n % 2 === 0);

console.log(pairs); // [2, 4, 6]
```

La fonction passée à `filter` doit renvoyer `true` (on garde) ou `false` (on écarte).

> 💡 `filter` sera au cœur du jour 10 : filtrer les personnages par type, statut, etc.

---

## 4.5 - Trier avec `sort`

`sort` trie un tableau. Pour des **nombres**, il faut fournir une fonction de comparaison :

```javascript
const scores = [10, 2, 33, 4];

scores.sort((a, b) => a - b); // [2, 4, 10, 33]  ordre croissant
scores.sort((a, b) => b - a); // [33, 10, 4, 2]  ordre décroissant
```

Pour des **chaînes** (ordre alphabétique) :

```javascript
const noms = ['Salamèche', 'Pikachu', 'Bulbizarre'];
noms.sort(); // ['Bulbizarre', 'Pikachu', 'Salamèche']
```

> ⚠️ `sort` **modifie** le tableau original. Sur des nombres, ne jamais oublier la fonction `(a, b) => a - b`, sinon le tri se fait alphabétiquement (`[10, 2, 33]` deviendrait `[10, 2, 33]` mal trié).

---

## 4.6 - Agréger avec `reduce`

`reduce` réduit un tableau à **une seule valeur** (une somme, un total...) :

```javascript
const nombres = [1, 2, 3, 4];
const somme = nombres.reduce((total, n) => total + n, 0);

console.log(somme); // 10
```

Le `0` est la valeur de départ de `total`.

---

## Exercices

> 📝 Cherche par toi-même avant de consulter [les corrections](./corrections-fondamentaux.md).

On part de ce tableau pour plusieurs exercices :

```javascript
const nombres = [5, 12, 8, 130, 44, 3, 27];
```

### Exercice 4.1 - Parcourir

Avec `forEach`, affiche chaque nombre précédé de `'Nombre : '`.

### Exercice 4.2 - Doubler

Avec `map`, crée un tableau `doubles` contenant chaque nombre multiplié par 2.

### Exercice 4.3 - Filtrer

Avec `filter`, crée un tableau `grands` ne contenant que les nombres supérieurs à 10.

### Exercice 4.4 - Trier

Trie le tableau `nombres` dans l'ordre croissant, puis dans l'ordre décroissant.

### Exercice 4.5 - Somme

Avec `reduce`, calcule la somme de tous les nombres.

### Exercice 4.6 - Chaîner

À partir de `nombres`, obtiens en **une seule expression** la somme des carrés des nombres pairs. (Indice : `filter` puis `map` puis `reduce`.)

### Exercice 4.7 - Liste de noms

On te donne :

```javascript
const noms = ['pikachu', 'salamèche', 'carapuce', 'bulbizarre'];
```

1. Crée un tableau des noms en majuscules avec `map`.
2. Crée un tableau ne contenant que les noms de plus de 7 lettres avec `filter`.
3. Trie les noms par ordre alphabétique.

### ⚡ Pour aller plus loin

À partir de `noms`, obtiens le **nombre total de lettres** de tous les noms réunis (indice : `map` pour obtenir les longueurs, puis `reduce`).

---

## Livrable

- [ ] Je crée et lis des tableaux (index, `length`, `push`, `pop`)
- [ ] Je parcours un tableau avec `forEach`
- [ ] Je transforme un tableau avec `map`
- [ ] Je filtre un tableau avec `filter`
- [ ] Je trie avec `sort` (et je pense à `(a, b) => a - b` pour les nombres)
- [ ] Je sais agréger avec `reduce`

➡️ **Demain (Jour 05)** : structurer des données réalistes avec les objets - la forme exacte sous laquelle une API te renverra ses données.
