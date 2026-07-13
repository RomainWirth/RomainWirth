# Jour 09 - Injecter les données dans le DOM

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Relier les données de l'API (jour 8) à l'affichage (jour 6)
- Générer une carte par élément de données
- Afficher une image, un nom et quelques infos
- Organiser son code en fonctions

> 🎯 **Le moment où tout se connecte.** Aujourd'hui, les vraies données de l'API apparaissent à l'écran sous forme de cartes.

---

## 9.1 - Le plan

On combine ce qu'on a appris :

1. `fetch` récupère la liste (jour 8).
2. `map` ou `forEach` parcourt la liste (jour 4-5).
3. `createElement` crée une carte par élément (jour 6).
4. `appendChild` ajoute les cartes à la galerie (jour 6).

---

## 9.2 - Une fonction pour créer une carte

On isole la création d'une carte dans une fonction. Elle reçoit **un** élément et renvoie **un** élément DOM.

Exemple pour l'API Rick and Morty (adapte les champs à ton API) :

```javascript
function creerCarte(perso) {
  const carte = document.createElement('div');
  carte.classList.add('carte');

  const image = document.createElement('img');
  image.src = perso.image;      // champ image de l'API
  image.alt = perso.name;

  const titre = document.createElement('h3');
  titre.textContent = perso.name;

  const info = document.createElement('p');
  info.textContent = perso.status; // ex : "Alive", "Dead"

  carte.appendChild(image);
  carte.appendChild(titre);
  carte.appendChild(info);

  return carte;
}
```

> 💡 **Adapte les champs à ton API.** Reporte-toi à ce que tu as noté au jour 8. Par exemple :
> - Rick and Morty : `perso.image`, `perso.name`, `perso.status`
> - Dragon Ball : `perso.image`, `perso.name`, `perso.race`
> - PokéAPI : l'image nécessite une étape supplémentaire (voir 9.5)
> - TVMaze : `show.image.medium`, `show.name`, `show.genres`

---

## 9.3 - Afficher toutes les cartes

Une fonction qui reçoit la liste et remplit la galerie :

```javascript
function afficherListe(liste) {
  const galerie = document.querySelector('#galerie');
  galerie.innerHTML = ''; // vide la galerie avant de (re)dessiner

  liste.forEach((element) => {
    const carte = creerCarte(element);
    galerie.appendChild(carte);
  });
}
```

> 💡 **Vider avant de redessiner** (`galerie.innerHTML = ''`) sera essentiel au jour 10 : quand on filtrera, on réaffichera la galerie à partir de zéro.

---

## 9.4 - Assembler le tout

```javascript
const galerie = document.querySelector('#galerie');
const message = document.querySelector('#message');

async function initialiser() {
  try {
    const reponse = await fetch('https://rickandmortyapi.com/api/character');
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);

    const data = await reponse.json();
    const liste = data.results; // adapte selon ton API

    message.textContent = `${liste.length} éléments chargés`;
    afficherListe(liste);
  } catch (erreur) {
    message.textContent = 'Erreur de chargement 😕';
    console.error(erreur);
  }
}

initialiser();
```

Recharge la page : les cartes avec images doivent apparaître. 🎉

---

## 9.5 - Cas particulier de PokéAPI

Avec PokéAPI, la liste `/pokemon` ne contient que des **noms** et des **URL**, pas les images ni les stats. Il faut faire une seconde requête par Pokémon. C'est un bon exercice avancé :

```javascript
async function chargerPokemons() {
  const reponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
  const data = await reponse.json();

  // Pour chaque pokémon, on va chercher le détail
  const details = await Promise.all(
    data.results.map((p) => fetch(p.url).then((r) => r.json()))
  );

  // details est un tableau d'objets complets (avec .sprites, .types...)
  afficherListe(details);
}
```

> 💡 Si PokéAPI te paraît trop complexe pour l'instant, l'API **Rick and Morty** ou **Dragon Ball** donne les images directement dans la première requête - plus simple pour ce jour.

---

## Tâches du jour

### Tâche 9.1 - Fonction `creerCarte`

Écris la fonction `creerCarte` adaptée aux champs de **ton** API (image + nom + une info).

### Tâche 9.2 - Fonction `afficherListe`

Écris la fonction `afficherListe` qui vide la galerie et y ajoute une carte par élément.

### Tâche 9.3 - Brancher le tout

Dans ta fonction `initialiser` (issue du jour 8), appelle `afficherListe(liste)` avec les données récupérées. Vérifie que les cartes s'affichent.

### Tâche 9.4 - Message d'état

Affiche dans `#message` le nombre d'éléments chargés, ou un message d'erreur si le chargement échoue.

### Tâche 9.5 - Soigner l'affichage

Ajoute un peu de CSS pour que les cartes soient jolies (coins arrondis, ombre, image bien dimensionnée). Le `style.css` du jour 6 est un bon point de départ.

### ⚡ Pour aller plus loin

Ajoute une deuxième information sur chaque carte (par exemple l'espèce, la race, ou le type), et une classe CSS de couleur différente selon cette valeur (indice : `carte.classList.add(perso.status.toLowerCase())`).

---

## Livrable

- [ ] J'ai une fonction `creerCarte` qui renvoie un élément DOM
- [ ] J'ai une fonction `afficherListe` qui remplit la galerie
- [ ] Les vraies données de l'API s'affichent en cartes avec images
- [ ] Un message d'état informe l'utilisateur (chargement / erreur)
- [ ] Mon code est organisé en fonctions réutilisables

➡️ **Demain (Jour 10)** : rendre l'application vraiment utile avec la recherche, les filtres et le tri.
