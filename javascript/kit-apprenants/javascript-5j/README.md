# Explorateur — Kit JavaScript compact

**Kit apprenant — Version accélérée**
5 jours | JavaScript (ES6+) | Quelques bases de programmation recommandées

> Version **compacte** du kit *Explorateur*. Même objectif que la version complète — construire une application web qui récupère des données d'une API et les affiche de façon interactive — mais en **5 jours** au lieu de 11, en allant droit à l'essentiel.
>
> **Pour qui ?**
> - Tu as déjà programmé dans un autre langage (Python, PHP, Java...) et tu veux découvrir JavaScript vite.
> - Ou tu apprends vite et tu préfères un rythme soutenu.
>
> **Tu débutes totalement en programmation ?** Prends plutôt la version complète : [`../javascript-11j/`](../javascript-11j/README.md), qui déroule les mêmes notions plus progressivement.

---

## Sommaire

| Jour | Titre | Contenu |
|---|---|---|
| [Jour 01](./jour-01.md) | Fondamentaux express (1/2) | Variables, types, opérateurs, conditions, boucles |
| [Jour 02](./jour-02.md) | Fondamentaux express (2/2) | Fonctions, tableaux, objets, tableau d'objets, JSON |
| [Jour 03](./jour-03.md) | DOM & interactivité | Sélection, création d'éléments, événements |
| [Jour 04](./jour-04.md) | API & affichage | `async`/`await`, `fetch`, injection des cartes |
| [Jour 05](./jour-05.md) | Recherche, tri & finitions | Filtres, recherche, tri, vue détail, erreurs |

> 📝 Les exercices des jours 1 et 2 sont **à énoncés seuls**. Corrections dans [corrections-fondamentaux.md](./corrections-fondamentaux.md) — à consulter après avoir cherché.

---

## Le projet fil rouge : *Explorateur*

Une page web qui :
- récupère une liste d'éléments depuis une **API publique** ;
- affiche chaque élément en **carte** (image, nom, infos) ;
- propose **recherche**, **filtres** et **tri** ;
- affiche une **vue détail** au clic.

---

## Choisir son API

Choisis **une** API gratuite et sans clé, et garde-la pour tout le projet.

| API | Thème | URL de base | Documentation |
|---|---|---|---|
| **PokéAPI** | Pokémon | `https://pokeapi.co/api/v2/` | https://pokeapi.co/docs/v2 |
| **Dragon Ball API** | Dragon Ball | `https://dragonball-api.com/api/` | https://web.dragonball-api.com/documentation |
| **Rick and Morty API** | Rick & Morty | `https://rickandmortyapi.com/api/` | https://rickandmortyapi.com/documentation |
| **TVMaze** | Séries TV | `https://api.tvmaze.com/` | https://www.tvmaze.com/api |

> 💡 La plus simple pour ce kit : **Rick and Morty** (images + statut + espèce directement disponibles). Tu peux aussi utiliser toute autre API publique gratuite qui renvoie du JSON, une liste d'éléments avec image, et autorise les requêtes navigateur (CORS). Bonne liste : https://github.com/public-apis/public-apis.

---

## Mode d'emploi

- Un jour = un fichier, dans l'ordre.
- Chaque jour : **objectifs**, **explications condensées**, **exercices/tâches**, **livrable**.
- Sections **⚡ Pour aller plus loin** optionnelles.
- Pour approfondir une notion : le cours complet est dans [`../../00-sommaire.md`](../../00-sommaire.md), et la version 11 jours détaille chaque point.

## Prérequis techniques

- Un **navigateur** moderne + un **éditeur** (VS Code recommandé).
- Console : `F12` → onglet **Console** (c'est là qu'on code les jours 1-2).
- Aucune installation de Node.js nécessaire.
