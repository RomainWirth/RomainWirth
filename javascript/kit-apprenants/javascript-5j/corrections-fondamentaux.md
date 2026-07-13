# Corrections des exercices - Fondamentaux (Jours 1 et 2)

> ⚠️ **À lire après avoir cherché par toi-même.** Plusieurs solutions peuvent être valides : si ton code fonctionne et reste lisible, il est correct même s'il diffère de celui-ci.

---

## Jour 01

### 1.1 - Fiche personnage

```javascript
const nom = 'Pikachu';
const niveau = 12;
const estCapture = true;
console.log(`${nom} est au niveau ${niveau}. Capturé : ${estCapture}`);
```

### 1.2 - Pair ou impair

```javascript
const nombre = 7;
console.log(nombre % 2 === 0 ? 'pair' : 'impair');
```

### 1.3 - Catégorie de niveau

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

### 1.4 - Compte à rebours

```javascript
for (let i = 10; i >= 1; i--) {
  console.log(i);
}
console.log('Partez !');
```

### 1.5 - Barre de vie

```javascript
let pointsDeVie = 5;
while (pointsDeVie > 0) {
  console.log(`PV restants : ${pointsDeVie}`);
  pointsDeVie--;
}
console.log('K.O. !');
```

### ⚡ FizzBuzz

```javascript
for (let i = 1; i <= 30; i++) {
  if (i % 3 === 0 && i % 5 === 0) console.log('FizzBuzz');
  else if (i % 3 === 0) console.log('Fizz');
  else if (i % 5 === 0) console.log('Buzz');
  else console.log(i);
}
```

> 💡 On teste **d'abord** le cas ÷3 et ÷5, sinon il ne serait jamais atteint.

---

## Jour 02

Base commune :

```javascript
const personnages = [
  { nom: 'Pikachu',   type: 'Électrik', niveau: 12, pv: 60 },
  { nom: 'Salamèche', type: 'Feu',      niveau: 9,  pv: 45 },
  { nom: 'Carapuce',  type: 'Eau',      niveau: 10, pv: 50 },
  { nom: 'Bulbizarre',type: 'Plante',   niveau: 14, pv: 70 },
  { nom: 'Roucool',   type: 'Normal',   niveau: 8,  pv: 40 },
];
```

### 2.1 - Fonction

```javascript
function carre(n) {
  return n * n;
}
const carreFleche = (n) => n * n;

console.log(carre(5));       // 25
console.log(carreFleche(9)); // 81
```

### 2.2 - Noms

```javascript
const noms = personnages.map((p) => p.nom);
// ['Pikachu', 'Salamèche', 'Carapuce', 'Bulbizarre', 'Roucool']
```

### 2.3 - Filtrer

```javascript
const experimentes = personnages.filter((p) => p.niveau >= 10);
// Pikachu, Carapuce, Bulbizarre
```

### 2.4 - Trier

```javascript
const parPv = [...personnages].sort((a, b) => b.pv - a.pv);
parPv.forEach((p) => console.log(p.nom));
// Bulbizarre, Pikachu, Carapuce, Salamèche, Roucool
```

> 💡 `[...personnages]` : on trie une **copie** pour ne pas modifier l'original.

### 2.5 - Phrase

```javascript
personnages.forEach((p) => {
  console.log(`${p.nom} (${p.type}) - niveau ${p.niveau}, ${p.pv} PV`);
});
```

### 2.6 - Recherche

```javascript
function chercher(liste, texte) {
  return liste.filter((p) =>
    p.nom.toLowerCase().includes(texte.toLowerCase())
  );
}

console.log(chercher(personnages, 'ca')); // Carapuce
```

> 💡 Les deux côtés en minuscules (`toLowerCase`) → recherche insensible à la casse. C'est la logique réutilisée au jour 5 pour la barre de recherche.

### ⚡ Pour aller plus loin

```javascript
function statistiques(liste) {
  const sommePv = liste.reduce((total, p) => total + p.pv, 0);
  const pvMoyen = sommePv / liste.length;
  const niveauMax = Math.max(...liste.map((p) => p.niveau));
  return { pvMoyen, niveauMax };
}

console.log(statistiques(personnages)); // { pvMoyen: 53, niveauMax: 14 }
```

> 💡 `Math.max(...liste.map(...))` : on obtient les niveaux avec `map`, puis on les « éclate » en arguments avec `...`.

---

🎉 Si tu as réussi la majorité de ces exercices, tu as les fondamentaux nécessaires pour le projet *Explorateur* (jours 3 à 5).
