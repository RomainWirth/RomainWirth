# Jour 05 - Recherche, tri & finitions

⏱ **Durée estimée : une journée**

## Objectifs

- Recherche par nom, filtres par catégorie, tri
- Vue détail au clic
- Finitions et gestion des cas limites

> 🏁 Dernier jour : on transforme la galerie en outil d'exploration complet.

---

## 5.1 - Le principe

On garde `donnees` (liste complète, jamais modifiée) et on **réaffiche** une version filtrée/triée à chaque interaction : partir de `donnees` → `filter`/`sort` → `afficherListe(resultat)`.

---

## 5.2 - Recherche par nom

```javascript
const champ = document.querySelector('#recherche');

champ.addEventListener('input', () => {
  const texte = champ.value.toLowerCase();
  const resultats = donnees.filter((el) =>
    el.name.toLowerCase().includes(texte)
  );
  afficherListe(resultats);
});
```

> 💡 On repart **toujours** de `donnees`, jamais de la liste déjà filtrée.

---

## 5.3 - Filtres par catégorie

HTML (exemple Rick & Morty) :

```html
<div id="filtres">
  <button data-filtre="all">Tous</button>
  <button data-filtre="Alive">Vivants</button>
  <button data-filtre="Dead">Morts</button>
</div>
```

JS :

```javascript
document.querySelectorAll('#filtres button').forEach((bouton) => {
  bouton.addEventListener('click', () => {
    const filtre = bouton.dataset.filtre;
    const resultats = filtre === 'all'
      ? donnees
      : donnees.filter((el) => el.status === filtre);
    afficherListe(resultats);
  });
});
```

> 💡 Adapte le champ filtré : `status`, `race`, type, genre...

---

## 5.4 - Tri

```html
<select id="tri">
  <option value="default">Par défaut</option>
  <option value="asc">Nom A→Z</option>
  <option value="desc">Nom Z→A</option>
</select>
```

```javascript
document.querySelector('#tri').addEventListener('change', (e) => {
  const resultats = [...donnees]; // copie : sort modifie le tableau
  if (e.target.value === 'asc') resultats.sort((a, b) => a.name.localeCompare(b.name));
  if (e.target.value === 'desc') resultats.sort((a, b) => b.name.localeCompare(a.name));
  afficherListe(resultats);
});
```

> 💡 `localeCompare` pour le texte (gère les accents) ; `(a, b) => a.stat - b.stat` pour des nombres.

---

## 5.5 - Cas « aucun résultat »

```javascript
function afficherListe(liste) {
  const galerie = document.querySelector('#galerie');
  galerie.innerHTML = '';
  if (liste.length === 0) {
    galerie.innerHTML = '<p>Aucun résultat.</p>';
    return;
  }
  liste.forEach((el) => galerie.appendChild(creerCarte(el)));
}
```

---

## 5.6 - Vue détail

HTML : `<section id="detail" class="cache"></section>` (avant la galerie).

Dans `creerCarte`, rends la carte cliquable :

```javascript
carte.addEventListener('click', () => afficherDetail(element));
```

La fonction détail :

```javascript
function afficherDetail(element) {
  const detail = document.querySelector('#detail');
  detail.innerHTML = `
    <button id="fermer">← Retour</button>
    <h2>${element.name}</h2>
    <img src="${element.image}" alt="${element.name}">
    <p>Statut : ${element.status}</p>
    <p>Espèce : ${element.species}</p>
  `;
  detail.classList.remove('cache');
  document.querySelector('#fermer').addEventListener('click', () => {
    detail.classList.add('cache');
  });
}
```

> ⚠️ `innerHTML` ici car on maîtrise le contenu. Pour du texte utilisateur, on utiliserait `textContent`.

---

## 5.7 - Organisation finale de `app.js`

```javascript
const URL_API = '...';
let donnees = [];

function creerCarte(element) { /* ... */ }
function afficherListe(liste) { /* ... */ }
function afficherDetail(element) { /* ... */ }
function brancherEvenements() { /* recherche, filtres, tri */ }

async function initialiser() { /* fetch + afficherListe */ }

initialiser();
brancherEvenements();
```

---

## Tâches du jour

### 5.1 - Recherche
Filtre par nom en direct depuis `donnees`.

### 5.2 - Filtres
Ajoute des boutons de filtre adaptés à ton API.

### 5.3 - Tri
Ajoute le menu de tri (A→Z / Z→A).

### 5.4 - Aucun résultat
Gère le cas liste vide.

### 5.5 - Vue détail
Rends les cartes cliquables et affiche une vue détail avec bouton retour.

### ⚡ Pour aller plus loin
- Cumuler recherche + filtre + tri via une seule fonction `appliquer()`.
- Sauvegarder des favoris avec `localStorage`.
- Pagination (`?page=` / `?offset=`).
- Déployer sur GitHub Pages ou Netlify.

---

## Livrable final

- [ ] Recherche, filtres et tri fonctionnent
- [ ] Le cas « aucun résultat » est géré
- [ ] Une vue détail s'affiche au clic
- [ ] Chargement et erreurs sont gérés
- [ ] Le code est organisé en fonctions claires

## Bilan

En 5 jours tu maîtrises : les fondamentaux JS, la manipulation de données (`map`/`filter`/`sort`/`reduce`), le DOM, les événements, l'asynchrone (`fetch`) et l'intégration API ↔ interface. Socle idéal pour aborder React, Vue ou Astro - ou approfondir avec la [version 11 jours](../javascript-11j/README.md) et le [cours complet](../../00-sommaire.md).

🎉 **Kit terminé !**
