# Jour 04 - API & affichage

⏱ **Durée estimée : une journée**

## Objectifs

- Récupérer des données d'une API avec `fetch` + `async`/`await`
- Gérer les erreurs
- Générer les cartes à partir des vraies données

> 🎯 Le cœur technique : les données d'Internet apparaissent à l'écran.

---

## 4.1 - Asynchrone et `fetch`

Aller chercher des données prend du temps : JS ne se fige pas, il traite la réponse **quand elle arrive** (code asynchrone, géré par les *Promises*).

```javascript
async function charger() {
  const reponse = await fetch('https://rickandmortyapi.com/api/character');
  const data = await reponse.json();
  console.log(data);
}
charger();
```

- `await fetch(...)` attend la réponse du serveur.
- `await reponse.json()` convertit le JSON en objet JS.
- `await` ne marche que dans une fonction `async`.

> 💡 **Teste d'abord l'URL dans le navigateur** pour voir la forme du JSON et repérer la liste + les champs.

---

## 4.2 - Où est la liste ?

Selon l'API, la liste est à un endroit différent :

```javascript
const liste = data.results; // Rick & Morty, PokéAPI
const liste = data.items;   // Dragon Ball
const liste = data;         // TVMaze (/shows)
```

Champs courants d'un élément :
- Rick & Morty : `name`, `image`, `status`, `species`
- Dragon Ball : `name`, `image`, `race`
- TVMaze : `name`, `image.medium`, `genres`

---

## 4.3 - Gérer les erreurs

```javascript
async function charger() {
  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    const data = await reponse.json();
    return data.results; // adapte selon ton API
  } catch (erreur) {
    console.error('Échec du chargement :', erreur);
  }
}
```

> ⚠️ `fetch` ne rejette pas tout seul sur une erreur HTTP (404, 500) : vérifie `reponse.ok`.

---

## 4.4 - Générer les cartes

Une fonction qui crée **une** carte (adapte les champs à ton API) :

```javascript
function creerCarte(element) {
  const carte = document.createElement('div');
  carte.classList.add('carte');

  const img = document.createElement('img');
  img.src = element.image;
  img.alt = element.name;

  const titre = document.createElement('h3');
  titre.textContent = element.name;

  const info = document.createElement('p');
  info.textContent = element.status; // ou race, species...

  carte.append(img, titre, info); // append accepte plusieurs éléments
  return carte;
}
```

Une fonction qui affiche la liste :

```javascript
function afficherListe(liste) {
  const galerie = document.querySelector('#galerie');
  galerie.innerHTML = ''; // vider avant de (re)dessiner
  liste.forEach((el) => galerie.appendChild(creerCarte(el)));
}
```

---

## 4.5 - Assembler

```javascript
const URL_API = 'https://rickandmortyapi.com/api/character';
const message = document.querySelector('#message');
let donnees = []; // liste complète, réutilisée au jour 5

async function initialiser() {
  message.textContent = 'Chargement...';
  try {
    const reponse = await fetch(URL_API);
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    const data = await reponse.json();
    donnees = data.results; // adapte
    message.textContent = `${donnees.length} éléments`;
    afficherListe(donnees);
  } catch (erreur) {
    message.textContent = 'Erreur de chargement 😕';
    console.error(erreur);
  }
}

initialiser();
```

Recharge la page : les cartes avec images apparaissent. 🎉

> 💡 **PokéAPI** : la liste `/pokemon` ne contient que noms + URL. Il faut une 2e requête par Pokémon :
> ```javascript
> const details = await Promise.all(
>   data.results.map((p) => fetch(p.url).then((r) => r.json()))
> );
> ```
> Si c'est trop pour l'instant, Rick & Morty ou Dragon Ball donnent tout en une requête.

---

## Tâches du jour

### 4.1 - Inspecter
Ouvre l'URL de ton API, repère la liste et les champs (nom, image...).

### 4.2 - Fetch + affichage
Écris `creerCarte`, `afficherListe` et `initialiser` adaptés à ton API. Les cartes doivent s'afficher.

### 4.3 - Message d'état
Affiche le nombre d'éléments chargés, ou un message d'erreur en cas d'échec (teste avec une URL fausse).

### ⚡ Pour aller plus loin
Ajoute une 2e info et une couleur de fond selon une valeur (`carte.classList.add(element.status.toLowerCase())`).

---

## Livrable

- [ ] Je récupère des données avec `fetch` + `async`/`await`
- [ ] Je gère les erreurs (`try/catch` + `reponse.ok`)
- [ ] J'ai `creerCarte` et `afficherListe`
- [ ] Les vraies données s'affichent en cartes
- [ ] La liste complète est gardée dans `donnees`

➡️ **Jour 05** : recherche, filtres, tri, vue détail et finitions.
