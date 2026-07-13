# Jour 02 - Fondamentaux express (2/2)

⏱ **Durée estimée : une journée**

## Objectifs

- Fonctions (classiques et fléchées)
- Tableaux et méthodes clés (`map`, `filter`, `sort`, `reduce`)
- Objets et tableaux d'objets
- Format JSON

> 🎯 C'est le chapitre le plus important : ces outils sont exactement ceux qu'on utilisera sur les données de l'API.

---

## 2.1 - Fonctions

```javascript
// Déclaration classique
function additionner(a, b) {
  return a + b;
}

// Fonction fléchée équivalente
const additionner = (a, b) => a + b;

// Paramètre par défaut
const saluer = (nom = 'inconnu') => `Bonjour ${nom}`;
```

- `a`, `b` = paramètres ; les valeurs à l'appel = arguments.
- `return` renvoie un résultat (sans lui, la fonction renvoie `undefined`).
- Une variable déclarée dans une fonction reste **locale**.

> 💡 On utilisera énormément les fonctions fléchées avec `map`/`filter` ci-dessous.

---

## 2.2 - Tableaux

```javascript
const fruits = ['pomme', 'poire', 'abricot'];
fruits[0];       // 'pomme' (index dès 0)
fruits.length;   // 3
fruits.push('kiwi'); // ajoute à la fin
```

### Les 4 méthodes essentielles

```javascript
const nombres = [1, 2, 3, 4, 5, 6];

// forEach : exécuter une action pour chaque élément
nombres.forEach((n) => console.log(n));

// map : transformer → nouveau tableau
nombres.map((n) => n * 2);           // [2, 4, 6, 8, 10, 12]

// filter : garder ceux qui passent le test
nombres.filter((n) => n % 2 === 0);  // [2, 4, 6]

// reduce : agréger en une valeur
nombres.reduce((total, n) => total + n, 0); // 21
```

### Trier

```javascript
const scores = [10, 2, 33, 4];
scores.sort((a, b) => a - b); // [2, 4, 10, 33] croissant
scores.sort((a, b) => b - a); // décroissant
```

> ⚠️ Sur des nombres, **toujours** fournir `(a, b) => a - b` : sans ça, `sort` trie alphabétiquement. Et `sort` modifie le tableau : trie une copie avec `[...tableau].sort(...)` si besoin.

---

## 2.3 - Objets

```javascript
const perso = {
  nom: 'Pikachu',
  type: 'Électrik',
  stats: { attaque: 55, defense: 40 },
};

perso.nom;              // 'Pikachu'  (notation pointée)
perso['type'];          // 'Électrik' (notation crochets)
perso.stats.attaque;    // 55 (imbriqué)
perso.niveau = 12;      // ajout d'une propriété
```

---

## 2.4 - Tableau d'objets (structure clé)

C'est **la forme des données d'une API** : une liste d'objets.

```javascript
const equipe = [
  { nom: 'Pikachu',   type: 'Électrik', pv: 60 },
  { nom: 'Salamèche', type: 'Feu',      pv: 45 },
  { nom: 'Carapuce',  type: 'Eau',      pv: 50 },
];

equipe.map((p) => p.nom);              // ['Pikachu', 'Salamèche', 'Carapuce']
equipe.filter((p) => p.pv > 45);       // Pikachu, Carapuce
[...equipe].sort((a, b) => b.pv - a.pv); // trié par pv décroissant
```

> 💡 Dès le jour 4, on fera exactement ça sur les données de l'API : `map` pour les cartes, `filter` pour la recherche, `sort` pour le tri.

---

## 2.5 - JSON

Le format d'échange des API. Comme un objet JS, mais clés entre guillemets doubles :

```json
{ "nom": "Pikachu", "niveau": 12 }
```

```javascript
JSON.stringify(perso);  // objet → texte JSON
JSON.parse(texte);      // texte JSON → objet
```

> 💡 Avec `fetch` (jour 4), `response.json()` fait le `JSON.parse` automatiquement.

---

## Exercices

> 📝 Corrections dans [corrections-fondamentaux.md](./corrections-fondamentaux.md).

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
Écris `carre(n)` (classique puis fléchée) qui renvoie le carré d'un nombre.

### 2.2 - Noms
Avec `map`, obtiens le tableau des noms.

### 2.3 - Filtrer
Avec `filter`, garde les personnages de `niveau >= 10`.

### 2.4 - Trier
Trie par `pv` décroissant et affiche les noms dans l'ordre.

### 2.5 - Phrase
Avec `forEach`, affiche `Pikachu (Électrik) - niveau 12, 60 PV` pour chacun.

### 2.6 - Recherche
Écris `chercher(liste, texte)` qui renvoie les personnages dont le nom **contient** le texte (insensible à la casse : `toLowerCase` + `includes`). Teste avec `'ca'`.

### ⚡ Pour aller plus loin
Écris `statistiques(liste)` renvoyant un objet `{ pvMoyen, niveauMax }` (indice : `reduce` + `Math.max(...map)`).

---

## Livrable

- [ ] J'écris des fonctions classiques et fléchées
- [ ] Je maîtrise `map`, `filter`, `sort`, `reduce`
- [ ] Je manipule un tableau d'objets
- [ ] Je comprends le format JSON
- [ ] J'ai écrit une fonction de recherche

🎉 **Fondamentaux terminés.** À partir du jour 3, on construit l'application *Explorateur*.

➡️ **Jour 03** : le DOM et l'interactivité.
