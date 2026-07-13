# Jour 11 - Vue détail, finitions et bonus

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Afficher une vue détaillée au clic sur une carte
- Soigner l'expérience (chargement, erreurs, responsive)
- Découvrir des pistes d'amélioration
- Faire le bilan des compétences acquises

> 🏁 **Dernier jour du projet.** On ajoute la touche finale : une vue détail, puis on polit l'ensemble.

---

## 11.1 - Rendre les cartes cliquables

On ajoute un gestionnaire de clic sur chaque carte, dans la fonction `creerCarte` :

```javascript
function creerCarte(element) {
  const carte = document.createElement('div');
  carte.classList.add('carte');
  // ... (image, titre, infos comme au jour 9)

  carte.addEventListener('click', () => {
    afficherDetail(element);
  });

  return carte;
}
```

---

## 11.2 - Afficher le détail

Approche simple : une zone de détail dans le HTML qu'on remplit au clic.

Ajoute dans `index.html`, avant la galerie :

```html
<section id="detail" class="cache"></section>
```

Une classe CSS pour la masquer par défaut :

```css
.cache {
  display: none;
}
```

La fonction qui remplit et affiche la zone :

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

  detail.classList.remove('cache'); // on l'affiche

  // Bouton de fermeture
  document.querySelector('#fermer').addEventListener('click', () => {
    detail.classList.add('cache');
  });
}
```

> 💡 Ici on utilise `innerHTML` avec des **template literals** (backticks) pour construire le HTML en une fois - pratique pour du contenu qu'on maîtrise. Adapte les champs (`species`, `status`...) à ton API.

> ⚠️ Rappel de sécurité : n'utilise `innerHTML` qu'avec des données de confiance. Pour du texte saisi par un utilisateur, préfère `textContent`.

---

## 11.3 - Améliorer l'expérience de chargement

Affiche un indicateur pendant le chargement des données :

```javascript
async function initialiser() {
  const message = document.querySelector('#message');
  message.textContent = 'Chargement en cours...';

  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    const data = await reponse.json();
    donnees = data.results;
    message.textContent = `${donnees.length} éléments`;
    afficherListe(donnees);
  } catch (erreur) {
    message.textContent = 'Impossible de charger les données 😕';
    console.error(erreur);
  }
}
```

---

## 11.4 - Checklist de finitions

- [ ] La page a un titre et une mise en page agréable
- [ ] Les images ont toutes un attribut `alt`
- [ ] Un message s'affiche pendant le chargement
- [ ] Les erreurs réseau affichent un message clair (pas juste une console vide)
- [ ] Le cas « aucun résultat » est géré
- [ ] La grille s'adapte aux petits écrans (le `grid-template-columns` du jour 6 le fait déjà)
- [ ] Le code est rangé en fonctions (`creerCarte`, `afficherListe`, `afficherDetail`, `initialiser`)

---

## 11.5 - Organisation finale du code

Une structure propre de `app.js` à ce stade :

```javascript
// 1. Constantes et variables globales
const URL_API = 'https://rickandmortyapi.com/api/character';
let donnees = [];

// 2. Fonctions d'affichage
function creerCarte(element) { /* ... */ }
function afficherListe(liste) { /* ... */ }
function afficherDetail(element) { /* ... */ }

// 3. Fonctions de logique (filtre, tri, recherche)
function appliquer() { /* ... */ }

// 4. Branchements des événements
function brancherEvenements() { /* ... */ }

// 5. Point de départ
async function initialiser() { /* ... */ }

initialiser();
brancherEvenements();
```

---

## Tâches du jour

### Tâche 11.1 - Vue détail

Rends les cartes cliquables et affiche une vue détail au clic, avec un bouton pour revenir à la galerie.

### Tâche 11.2 - Indicateur de chargement

Affiche « Chargement en cours... » pendant le `fetch`, remplacé par le résultat une fois chargé.

### Tâche 11.3 - Finitions

Passe la checklist du 11.4 et corrige ce qui manque.

### Tâche 11.4 - Nettoyage du code

Réorganise `app.js` selon la structure du 11.5. Vérifie que chaque fonction a une responsabilité claire.

---

## ⚡ Pour aller plus loin (après le kit)

Quelques pistes pour continuer à faire évoluer *Explorateur* :

- **Pagination** : charger la page suivante de résultats (la plupart des API ont un paramètre `?page=` ou `?offset=`).
- **Favoris** : permettre de marquer des éléments en favori et les sauvegarder avec `localStorage` (les favoris persistent après rechargement).
- **Chargement au défilement** : charger plus d'éléments quand on arrive en bas de la page.
- **Deux API** : ajouter un sélecteur pour changer d'API à la volée.
- **Déploiement** : mettre le projet en ligne gratuitement (GitHub Pages, Netlify) pour le partager.
- **Refactoring** : une fois à l'aise, revoir le code à la lumière du cours *clean code* du workspace.

---

## Bilan - Ce que tu sais faire maintenant

En 11 jours, tu es passé·e de zéro à une application web complète. Tu maîtrises :

- **Les fondamentaux** : variables, types, conditions, boucles, fonctions
- **Les données** : tableaux et objets, `map` / `filter` / `sort` / `reduce`
- **Le DOM** : sélectionner, modifier, créer des éléments
- **L'interactivité** : événements, clics, saisie
- **L'asynchrone** : `fetch`, `async`/`await`, gestion d'erreurs
- **L'intégration** : relier une API à une interface interactive

C'est exactement le socle nécessaire pour aborder un framework moderne (React, Vue, Astro) ou approfondir le JavaScript avec le cours complet du dossier `javascript/`.

## Livrable final

- [ ] Mon application charge des données depuis une API
- [ ] Elle affiche des cartes avec image et informations
- [ ] La recherche, les filtres et le tri fonctionnent
- [ ] Une vue détail s'affiche au clic
- [ ] Le chargement et les erreurs sont gérés proprement
- [ ] Le code est organisé en fonctions claires

🎉 **Félicitations, tu as terminé le kit !**
