# Jour 05 - Les objets et les données structurées

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Créer et lire des objets
- Combiner objets et tableaux (tableau d'objets)
- Manipuler un tableau d'objets avec `map`, `filter`, `sort`
- Comprendre le format JSON

> 🎯 **Chapitre charnière.** Une API te renvoie toujours ses données sous forme de **tableau d'objets** au format **JSON**. Ce que tu apprends aujourd'hui, c'est exactement la forme des données que tu manipuleras dès le jour 8.

---

## 5.1 - Qu'est-ce qu'un objet ?

Un **objet** regroupe des informations liées sous forme de paires **clé : valeur** :

```javascript
const personnage = {
  nom: 'Pikachu',
  type: 'Électrik',
  niveau: 12,
  estCapture: true,
};
```

Chaque information a une **clé** (`nom`, `type`...) et une **valeur**.

---

## 5.2 - Accéder aux données d'un objet

Deux notations :

```javascript
personnage.nom;        // 'Pikachu'   → notation pointée (la plus courante)
personnage['type'];    // 'Électrik'  → notation crochets
```

Modifier ou ajouter :

```javascript
personnage.niveau = 13;       // modifie
personnage.region = 'Kanto';  // ajoute une nouvelle clé
```

---

## 5.3 - Objets imbriqués

Une valeur peut elle-même être un objet ou un tableau :

```javascript
const personnage = {
  nom: 'Pikachu',
  stats: {
    attaque: 55,
    defense: 40,
  },
  types: ['Électrik'],
};

personnage.stats.attaque; // 55
personnage.types[0];      // 'Électrik'
```

> 💡 Les API renvoient souvent des données imbriquées comme ça. Savoir "descendre" dans un objet (`objet.cle.sousCle`) est essentiel.

---

## 5.4 - Un tableau d'objets

C'est **la** structure de données la plus courante : une liste d'éléments, chacun étant un objet.

```javascript
const equipe = [
  { nom: 'Pikachu',    type: 'Électrik', niveau: 12 },
  { nom: 'Salamèche',  type: 'Feu',      niveau: 9  },
  { nom: 'Carapuce',   type: 'Eau',      niveau: 10 },
];
```

On peut la parcourir et la manipuler avec les méthodes du jour 4 :

```javascript
// Afficher chaque nom
equipe.forEach((p) => console.log(p.nom));

// Récupérer seulement les noms
const noms = equipe.map((p) => p.nom);
// ['Pikachu', 'Salamèche', 'Carapuce']

// Garder les personnages de niveau > 10
const experimentes = equipe.filter((p) => p.niveau > 10);

// Trier par niveau décroissant
equipe.sort((a, b) => b.niveau - a.niveau);
```

> 💡 **C'est le cœur du projet.** À partir du jour 9, tu feras exactement ça : `map` pour créer les cartes, `filter` pour la recherche, `sort` pour le tri - sur les données venues de l'API.

---

## 5.5 - Le format JSON

**JSON** (JavaScript Object Notation) est un format texte pour échanger des données. Il ressemble beaucoup à un objet JavaScript, mais les clés sont entre guillemets doubles :

```json
{
  "nom": "Pikachu",
  "type": "Électrik",
  "niveau": 12
}
```

C'est le format que renvoient **toutes** les API que tu utiliseras. Deux fonctions font le pont :

```javascript
// Objet JS → texte JSON
JSON.stringify(personnage);

// Texte JSON → objet JS
JSON.parse('{"nom":"Pikachu","niveau":12}');
```

> 💡 À partir du jour 8, `fetch` fera automatiquement le `JSON.parse` pour toi via `response.json()`. Mais il faut comprendre le principe : **du texte JSON entrant → un objet JS manipulable**.

---

## Exercices

> 📝 Cherche par toi-même avant de consulter [les corrections](./corrections-fondamentaux.md).

Pour ces exercices, part de ce tableau d'objets :

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

Affiche le type du personnage à l'index 3 (`Bulbizarre`).

### Exercice 5.2 - Liste de noms

Avec `map`, crée un tableau contenant uniquement les noms des personnages.

### Exercice 5.3 - Filtrer par niveau

Avec `filter`, crée un tableau des personnages de niveau supérieur ou égal à 10.

### Exercice 5.4 - Trier

Trie les personnages par `pv` décroissant, puis affiche leurs noms dans le nouvel ordre.

### Exercice 5.5 - Une phrase par personnage

Avec `forEach`, affiche pour chaque personnage une phrase du type :
`Pikachu (Électrik) - niveau 12, 60 PV`

### Exercice 5.6 - Recherche par nom

Écris une fonction `chercher(liste, texte)` qui renvoie les personnages dont le nom **contient** le texte donné (indice : `filter` + `.toLowerCase()` + `.includes()`). Teste avec `chercher(personnages, 'ca')`.

### ⚡ Pour aller plus loin

Écris une fonction `statistiques(liste)` qui renvoie un objet contenant le **PV moyen** et le **niveau maximum** de la liste. (Indice : `reduce` pour la somme, `Math.max` avec `map`.)

---

## Livrable

- [ ] Je crée des objets et j'accède à leurs propriétés (`.` et `[]`)
- [ ] Je sais lire des données imbriquées (`objet.cle.sousCle`)
- [ ] Je manipule un tableau d'objets avec `map`, `filter`, `sort`
- [ ] Je comprends ce qu'est le format JSON
- [ ] J'ai écrit une fonction de recherche sur un tableau d'objets

🎉 **Fin de la partie fondamentaux !** Tu as maintenant toutes les briques du langage. À partir de demain, on quitte la console pour construire une vraie page web.

➡️ **Demain (Jour 06)** : découvrir le DOM et manipuler le contenu d'une page HTML depuis JavaScript.
