# Jour 08 - Asynchrone : Promises et `fetch`

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Comprendre ce qu'est le code asynchrone
- Récupérer des données d'une API avec `fetch`
- Utiliser `async` / `await`
- Gérer les erreurs avec `try...catch`

> 🎯 **Le cœur technique du projet.** Aujourd'hui, on remplace les données écrites à la main par de vraies données venues d'Internet.

---

## 8.1 - C'est quoi « asynchrone » ?

Aller chercher des données sur Internet prend du **temps** (quelques dizaines ou centaines de millisecondes). JavaScript ne se fige pas pendant l'attente : il lance la requête, continue son travail, et traite la réponse **quand elle arrive**. C'est ce qu'on appelle le code **asynchrone**.

Pour gérer ce « plus tard », JavaScript utilise des **Promises** (promesses) : un objet qui représente un résultat *à venir*.

---

## 8.2 - Choisir et tester son API

Reprends l'API choisie dans le [README](./README.md). Avant de coder, **teste l'URL directement dans le navigateur** en la collant dans la barre d'adresse : tu verras le JSON brut renvoyé. Ça permet de comprendre la **forme** des données.

Exemples d'URL de liste :

| API | URL à tester |
|---|---|
| Rick and Morty | `https://rickandmortyapi.com/api/character` |
| PokéAPI | `https://pokeapi.co/api/v2/pokemon?limit=20` |
| Dragon Ball | `https://dragonball-api.com/api/characters?limit=20` |
| TVMaze | `https://api.tvmaze.com/shows` |

> 💡 **Installe une extension de formatage JSON** (comme « JSON Viewer ») pour lire le JSON plus facilement dans le navigateur. Repère où se trouve la **liste** des éléments et le nom des champs (`name`, `image`, `status`...).

---

## 8.3 - `fetch` : récupérer des données

`fetch(url)` lance une requête et renvoie une **Promise**. La version moderne et lisible utilise `async` / `await` :

```javascript
async function chargerDonnees() {
  const reponse = await fetch('https://rickandmortyapi.com/api/character');
  const data = await reponse.json();
  console.log(data);
}

chargerDonnees();
```

Décryptage :

1. `await fetch(...)` : attend la réponse du serveur.
2. `await reponse.json()` : convertit le JSON reçu en objet JavaScript manipulable.
3. `data` contient maintenant les données prêtes à l'emploi.

> 💡 **Deux `await` obligatoires** : le premier attend la réponse, le second attend la lecture du corps. C'est toujours le cas avec `fetch`.

> ⚠️ `await` ne fonctionne **que** dans une fonction marquée `async`.

---

## 8.4 - Trouver la liste dans les données

Selon l'API, la liste d'éléments est à un endroit différent de la réponse :

```javascript
// Rick and Morty : la liste est dans data.results
const liste = data.results;

// PokéAPI (liste) : aussi dans data.results
const liste = data.results;

// Dragon Ball : dans data.items
const liste = data.items;

// TVMaze (/shows) : data est directement le tableau
const liste = data;
```

> 💡 C'est pour ça qu'on inspecte le JSON au 8.2 : pour savoir **où** est la liste et **comment** s'appellent les champs. Adapte le code à ton API.

---

## 8.5 - Gérer les erreurs

Une requête peut échouer (pas de connexion, URL erronée, serveur en panne). On protège le code avec `try...catch` :

```javascript
async function chargerDonnees() {
  try {
    const reponse = await fetch('https://rickandmortyapi.com/api/character');

    if (!reponse.ok) {
      throw new Error(`Erreur HTTP : ${reponse.status}`);
    }

    const data = await reponse.json();
    console.log(data.results);
  } catch (erreur) {
    console.error('Impossible de charger les données :', erreur);
  }
}

chargerDonnees();
```

- `reponse.ok` est `false` si le serveur répond une erreur (404, 500...). **`fetch` ne lève pas d'erreur tout seul** dans ce cas, il faut le vérifier.
- `try...catch` attrape aussi les erreurs de réseau.

---

## Tâches du jour

### Tâche 8.1 - Inspecter l'API

Ouvre l'URL de liste de ton API dans le navigateur. Repère : où est la liste ? Quels champs contient chaque élément (nom, image...) ? Note-les.

### Tâche 8.2 - Premier fetch

Dans `app.js`, écris une fonction `async` qui `fetch` ton API et affiche la liste des éléments dans la console (`console.log`). Appelle-la.

### Tâche 8.3 - Isoler la liste

Extrais la liste dans une variable (`data.results`, `data.items` ou `data` selon ton API) et affiche `liste.length` dans la console pour vérifier combien d'éléments tu as reçus.

### Tâche 8.4 - Afficher les noms

Avec `forEach` (ou `map`), affiche dans la console le **nom** de chaque élément de la liste. (Le champ s'appelle souvent `name`.)

### Tâche 8.5 - Gérer l'erreur

Ajoute un `try...catch` et la vérification de `reponse.ok`. Teste en mettant volontairement une faute dans l'URL : tu dois voir ton message d'erreur s'afficher proprement dans la console.

### ⚡ Pour aller plus loin

Stocke la liste récupérée dans une variable **globale** (déclarée en dehors de la fonction) pour pouvoir la réutiliser demain. Affiche le premier élément complet (`liste[0]`) pour explorer tous ses champs disponibles.

---

## Livrable

- [ ] J'ai inspecté le JSON de mon API et repéré la liste et les champs
- [ ] Je récupère des données avec `fetch` + `async`/`await`
- [ ] Je convertis la réponse avec `.json()`
- [ ] J'isole la liste d'éléments selon la structure de mon API
- [ ] Je gère les erreurs avec `try...catch` et `reponse.ok`

➡️ **Demain (Jour 09)** : transformer ces données en cartes affichées dans la page - la jonction entre le DOM (jour 6) et l'API (jour 8).
