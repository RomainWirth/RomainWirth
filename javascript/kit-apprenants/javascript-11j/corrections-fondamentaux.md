# Corrections des exercices - Fondamentaux (Jours 1 à 5)

> ⚠️ **À lire après avoir cherché par toi-même.** Ces corrections sont un point de comparaison, pas la « seule bonne réponse » : en programmation, il existe souvent plusieurs solutions valides. Si ton code fonctionne et est lisible, il est correct même s'il diffère de celui-ci.

---

## Jour 01 - Variables et types

### Exercice 1.1 - Première variable

```javascript
const pseudo = 'Sacha';
console.log(`Bienvenue, ${pseudo} !`);
```

### Exercice 1.2 - Fiche personnage

```javascript
const nom = 'Pikachu';
const niveau = 12;
const estCapture = true;

console.log(`${nom} est au niveau ${niveau}. Capturé : ${estCapture}`);
```

### Exercice 1.3 - Types

```javascript
typeof '42';        // "string"  → entre guillemets = texte
typeof 42;          // "number"
typeof false;       // "boolean"
typeof undefined;   // "undefined"
typeof 3.14;        // "number"  → JS ne distingue pas entier et décimal
```

### Exercice 1.4 - Modifier une valeur

```javascript
let vies = 3;
console.log(vies); // 3
vies = 2;
console.log(vies); // 2

const viesConst = 3;
viesConst = 2; // ❌ TypeError: Assignment to constant variable.
```

### ⚡ Pour aller plus loin

```javascript
const prenom = 'Sacha';
const nom = 'Ketchum';
const nomComplet = `${prenom} ${nom}`;
console.log(nomComplet); // "Sacha Ketchum"

// Avec un nombre :
const x = 'Niveau ';
const y = 12;
console.log(x + y); // "Niveau 12" → le nombre est converti en texte par le +
```

---

## Jour 02 - Opérateurs, conditions et boucles

### Exercice 2.1 - Pair ou impair

```javascript
const nombre = 7;

if (nombre % 2 === 0) {
  console.log('pair');
} else {
  console.log('impair');
}
```

### Exercice 2.2 - Catégorie de niveau

```javascript
const niveau = 20;

if (niveau < 10) {
  console.log('Débutant');
} else if (niveau <= 30) {
  console.log('Confirmé');
} else {
  console.log('Expert');
}
```

### Exercice 2.3 - Compte à rebours

```javascript
for (let i = 10; i >= 1; i--) {
  console.log(i);
}
console.log('Partez !');
```

### Exercice 2.4 - Table de multiplication

```javascript
for (let i = 1; i <= 10; i++) {
  console.log(`7 x ${i} = ${7 * i}`);
}
```

### Exercice 2.5 - Barre de vie

```javascript
let pointsDeVie = 5;

while (pointsDeVie > 0) {
  console.log(`PV restants : ${pointsDeVie}`);
  pointsDeVie--;
}
console.log('K.O. !');
```

### ⚡ Pour aller plus loin - FizzBuzz

```javascript
for (let i = 1; i <= 30; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log('FizzBuzz');
  } else if (i % 3 === 0) {
    console.log('Fizz');
  } else if (i % 5 === 0) {
    console.log('Buzz');
  } else {
    console.log(i);
  }
}
```

> 💡 On teste **d'abord** le cas des deux multiples (`&&`), sinon il ne serait jamais atteint.

---

## Jour 03 - Les fonctions

### Exercice 3.1 - Carré

```javascript
function carre(n) {
  return n * n;
}

console.log(carre(5)); // 25
console.log(carre(9)); // 81
```

### Exercice 3.2 - Le plus grand

```javascript
function plusGrand(a, b) {
  if (a > b) {
    return a;
  }
  return b;
}

console.log(plusGrand(4, 9)); // 9
```

### Exercice 3.3 - Message de bienvenue

```javascript
function bienvenue(prenom) {
  return `Bienvenue ${prenom} dans l'aventure !`;
}

console.log(bienvenue('Sacha'));
```

### Exercice 3.4 - Version fléchée

```javascript
const carre = (n) => n * n;
const plusGrand = (a, b) => (a > b ? a : b); // avec un ternaire

console.log(carre(6));        // 36
console.log(plusGrand(4, 9)); // 9
```

### Exercice 3.5 - Est majeur

```javascript
function estMajeur(age) {
  return age >= 18;
}

console.log(estMajeur(20)); // true
console.log(estMajeur(15)); // false
```

### ⚡ Pour aller plus loin

```javascript
function calculerDegats(attaque, defense = 0) {
  return Math.max(0, attaque - defense);
}

console.log(calculerDegats(10, 4)); // 6
console.log(calculerDegats(3, 8));  // 0  (jamais négatif)
console.log(calculerDegats(5));     // 5  (défense par défaut = 0)
```

---

## Jour 04 - Les tableaux

On part de :

```javascript
const nombres = [5, 12, 8, 130, 44, 3, 27];
```

### Exercice 4.1 - Parcourir

```javascript
nombres.forEach((n) => {
  console.log('Nombre : ' + n);
});
```

### Exercice 4.2 - Doubler

```javascript
const doubles = nombres.map((n) => n * 2);
console.log(doubles); // [10, 24, 16, 260, 88, 6, 54]
```

### Exercice 4.3 - Filtrer

```javascript
const grands = nombres.filter((n) => n > 10);
console.log(grands); // [12, 130, 44, 27]
```

### Exercice 4.4 - Trier

```javascript
const croissant = [...nombres].sort((a, b) => a - b);
console.log(croissant); // [3, 5, 8, 12, 27, 44, 130]

const decroissant = [...nombres].sort((a, b) => b - a);
console.log(decroissant); // [130, 44, 27, 12, 8, 5, 3]
```

> 💡 On utilise `[...nombres]` pour trier une **copie** et ne pas modifier le tableau d'origine.

### Exercice 4.5 - Somme

```javascript
const somme = nombres.reduce((total, n) => total + n, 0);
console.log(somme); // 229
```

### Exercice 4.6 - Chaîner

```javascript
const resultat = nombres
  .filter((n) => n % 2 === 0)  // [12, 8, 130, 44]
  .map((n) => n * n)           // [144, 64, 16900, 1936]
  .reduce((total, n) => total + n, 0);

console.log(resultat); // 19044
```

### Exercice 4.7 - Liste de noms

```javascript
const noms = ['pikachu', 'salamèche', 'carapuce', 'bulbizarre'];

const majuscules = noms.map((nom) => nom.toUpperCase());
// ['PIKACHU', 'SALAMÈCHE', 'CARAPUCE', 'BULBIZARRE']

const longs = noms.filter((nom) => nom.length > 7);
// ['salamèche', 'bulbizarre']

const tries = [...noms].sort();
// ['bulbizarre', 'carapuce', 'pikachu', 'salamèche']
```

### ⚡ Pour aller plus loin

```javascript
const totalLettres = noms
  .map((nom) => nom.length)
  .reduce((total, n) => total + n, 0);

console.log(totalLettres); // 31
```

---

## Jour 05 - Les objets et les données structurées

On part de :

```javascript
const personnages = [
  { nom: 'Pikachu',   type: 'Électrik', niveau: 12, pv: 60 },
  { nom: 'Salamèche', type: 'Feu',      niveau: 9,  pv: 45 },
  { nom: 'Carapuce',  type: 'Eau',      niveau: 10, pv: 50 },
  { nom: 'Bulbizarre',type: 'Plante',   niveau: 14, pv: 70 },
  { nom: 'Roucool',   type: 'Normal',   niveau: 8,  pv: 40 },
];
```

### Exercice 5.1 - Lire

```javascript
console.log(personnages[3].type); // 'Plante'
```

### Exercice 5.2 - Liste de noms

```javascript
const noms = personnages.map((p) => p.nom);
// ['Pikachu', 'Salamèche', 'Carapuce', 'Bulbizarre', 'Roucool']
```

### Exercice 5.3 - Filtrer par niveau

```javascript
const experimentes = personnages.filter((p) => p.niveau >= 10);
// Pikachu, Carapuce, Bulbizarre
```

### Exercice 5.4 - Trier

```javascript
const parPv = [...personnages].sort((a, b) => b.pv - a.pv);
parPv.forEach((p) => console.log(p.nom));
// Bulbizarre, Pikachu, Carapuce, Salamèche, Roucool
```

### Exercice 5.5 - Une phrase par personnage

```javascript
personnages.forEach((p) => {
  console.log(`${p.nom} (${p.type}) - niveau ${p.niveau}, ${p.pv} PV`);
});
```

### Exercice 5.6 - Recherche par nom

```javascript
function chercher(liste, texte) {
  return liste.filter((p) =>
    p.nom.toLowerCase().includes(texte.toLowerCase())
  );
}

console.log(chercher(personnages, 'ca'));
// Carapuce (contient "ca")
```

> 💡 On met les **deux** côtés en minuscules (`toLowerCase`) pour que la recherche ne dépende pas de la casse. C'est exactement la logique qu'on réutilise au jour 10 pour la barre de recherche.

### ⚡ Pour aller plus loin

```javascript
function statistiques(liste) {
  const sommePv = liste.reduce((total, p) => total + p.pv, 0);
  const pvMoyen = sommePv / liste.length;
  const niveauMax = Math.max(...liste.map((p) => p.niveau));

  return { pvMoyen, niveauMax };
}

console.log(statistiques(personnages));
// { pvMoyen: 53, niveauMax: 14 }
```

> 💡 `Math.max(...liste.map(...))` : on extrait les niveaux en tableau avec `map`, puis on les « éclate » en arguments avec `...` pour les passer à `Math.max`.

---

🎉 Si tu as réussi la majorité de ces exercices, tu as tous les fondamentaux nécessaires pour le projet *Explorateur* (jours 6 à 11).
