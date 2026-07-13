# Jour 10 - Recherche, filtres et tri

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Conserver les données dans une variable pour les retravailler
- Filtrer les éléments par nom (recherche en direct)
- Filtrer par catégorie (boutons)
- Trier les résultats

> 🎯 On transforme la galerie statique en un vrai outil d'exploration interactif.

---

## 10.1 - Le principe : garder les données de côté

Jusqu'ici, on affichait les données une fois. Pour filtrer et trier, il faut **conserver la liste complète** dans une variable, puis **réafficher** une version filtrée/triée à chaque action.

```javascript
let donnees = []; // variable globale : la liste complète

async function initialiser() {
  const reponse = await fetch('https://rickandmortyapi.com/api/character');
  const data = await reponse.json();
  donnees = data.results;   // on garde tout
  afficherListe(donnees);   // on affiche tout au départ
}
```

L'idée générale de chaque interaction :

1. partir de `donnees` (la liste complète, jamais modifiée) ;
2. appliquer un `filter` et/ou un `sort` pour obtenir une **nouvelle** liste ;
3. appeler `afficherListe(...)` avec cette nouvelle liste.

---

## 10.2 - Recherche par nom

On reprend le champ `#recherche` du jour 7. Cette fois, au lieu de masquer des cartes, on **recalcule** la liste et on la réaffiche :

```javascript
const champ = document.querySelector('#recherche');

champ.addEventListener('input', () => {
  const texte = champ.value.toLowerCase();

  const resultats = donnees.filter((element) =>
    element.name.toLowerCase().includes(texte)
  );

  afficherListe(resultats);
});
```

> 💡 On part **toujours** de `donnees` (la liste complète), pas de la liste déjà filtrée. Sinon, une fois qu'on a filtré, on ne pourrait plus revenir en arrière.

---

## 10.3 - Filtrer par catégorie (boutons)

Ajoute des boutons dans `index.html`. Exemple pour Rick and Morty (statut) :

```html
<div id="filtres">
  <button data-filtre="all">Tous</button>
  <button data-filtre="Alive">Vivants</button>
  <button data-filtre="Dead">Morts</button>
  <button data-filtre="unknown">Inconnus</button>
</div>
```

L'attribut `data-filtre` porte la valeur à filtrer. On lit cet attribut avec `.dataset` :

```javascript
const boutons = document.querySelectorAll('#filtres button');

boutons.forEach((bouton) => {
  bouton.addEventListener('click', () => {
    const filtre = bouton.dataset.filtre;

    if (filtre === 'all') {
      afficherListe(donnees);
    } else {
      const resultats = donnees.filter((element) => element.status === filtre);
      afficherListe(resultats);
    }
  });
});
```

> 💡 Adapte le champ filtré à ton API : `status` (Rick & Morty), `race` (Dragon Ball), le type (PokéAPI), un genre (TVMaze)...

---

## 10.4 - Trier

Ajoute un menu déroulant de tri :

```html
<select id="tri">
  <option value="default">Ordre par défaut</option>
  <option value="nom-asc">Nom (A→Z)</option>
  <option value="nom-desc">Nom (Z→A)</option>
</select>
```

```javascript
const selectTri = document.querySelector('#tri');

selectTri.addEventListener('change', () => {
  const critere = selectTri.value;

  // On copie la liste pour ne pas modifier l'originale ([...donnees])
  let resultats = [...donnees];

  if (critere === 'nom-asc') {
    resultats.sort((a, b) => a.name.localeCompare(b.name));
  } else if (critere === 'nom-desc') {
    resultats.sort((a, b) => b.name.localeCompare(a.name));
  }

  afficherListe(resultats);
});
```

> 💡 `localeCompare` compare deux chaînes en tenant compte des accents - plus fiable que `<` pour trier du texte. Pour trier des **nombres** (ex : PV, ki), on revient à `(a, b) => a.stat - b.stat` (jour 4).

> ⚠️ On travaille sur une **copie** (`[...donnees]`) car `sort` modifie le tableau. Sans la copie, on modifierait la liste d'origine.

---

## 10.5 - Gérer le cas « aucun résultat »

Si un filtre ne renvoie rien, préviens l'utilisateur au lieu de laisser la galerie vide :

```javascript
function afficherListe(liste) {
  const galerie = document.querySelector('#galerie');
  galerie.innerHTML = '';

  if (liste.length === 0) {
    galerie.innerHTML = '<p>Aucun résultat.</p>';
    return;
  }

  liste.forEach((element) => galerie.appendChild(creerCarte(element)));
}
```

---

## Tâches du jour

### Tâche 10.1 - Stocker les données

Modifie ton code pour conserver la liste complète dans une variable globale `donnees`.

### Tâche 10.2 - Recherche

Branche le champ de recherche pour filtrer par nom en direct, en réaffichant la galerie (10.2).

### Tâche 10.3 - Boutons de filtre

Ajoute des boutons de filtre adaptés à ton API et fais-les filtrer la galerie au clic (10.3).

### Tâche 10.4 - Tri

Ajoute le menu de tri et trie les cartes par nom croissant / décroissant (10.4).

### Tâche 10.5 - Aucun résultat

Gère le cas où aucun élément ne correspond, avec un message dédié (10.5).

### ⚡ Pour aller plus loin

Fais **cumuler** la recherche et les filtres : crée une fonction `appliquer()` qui part de `donnees`, applique le filtre actif **puis** la recherche **puis** le tri, et réaffiche. Chaque interaction appelle `appliquer()`. (Indice : garde le filtre actif et le tri actif dans des variables globales.)

---

## Livrable

- [ ] Je conserve la liste complète dans une variable
- [ ] La recherche par nom filtre la galerie en direct
- [ ] Les boutons filtrent par catégorie
- [ ] Le menu de tri réordonne les cartes
- [ ] Le cas « aucun résultat » est géré

➡️ **Demain (Jour 11)** : ajouter une vue détaillée au clic, peaufiner l'application et découvrir des pistes bonus.
