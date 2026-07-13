# Explorateur — Apprendre JavaScript par la pratique

**Kit apprenant — Version débutant complet**
11 jours | JavaScript (ES6+) | Aucun prérequis en programmation

> Ce kit t'amène de zéro à une **application web fonctionnelle** qui récupère des données depuis une API publique gratuite et les affiche dans une page web que tu peux filtrer, trier et explorer.
>
> Il se découpe en deux temps :
> 1. **Les fondamentaux du langage** (jours 1 à 5) — des exercices courts à faire dans la console, pour acquérir les réflexes de base (variables, conditions, boucles, fonctions, tableaux, objets).
> 2. **Le projet fil rouge** (jours 6 à 11) — construire l'application *Explorateur* : découverte du DOM, événements, puis récupération de données via une API et affichage dynamique.

---

## Sommaire

### Partie 1 — Les fondamentaux (jours 1 à 5)

| Jour | Titre | Contenu |
|---|---|---|
| [Jour 01](./jour-01.md) | Environnement, variables et types | Console, `let`/`const`, types primitifs |
| [Jour 02](./jour-02.md) | Opérateurs, conditions et boucles | Comparaisons, `if`, `switch`, `for`, `while` |
| [Jour 03](./jour-03.md) | Les fonctions | Déclaration, paramètres, fonctions fléchées |
| [Jour 04](./jour-04.md) | Les tableaux | `map`, `filter`, `sort`, `reduce` |
| [Jour 05](./jour-05.md) | Les objets et les données structurées | Objets, tableaux d'objets, JSON |

> 📝 Les exercices des jours 1 à 5 n'ont **pas** leur correction dans les fichiers de cours. Les corrections sont regroupées dans [corrections-fondamentaux.md](./corrections-fondamentaux.md) — à consulter **après** avoir cherché par toi-même.

### Partie 2 — Le projet fil rouge *Explorateur* (jours 6 à 11)

| Jour | Titre | Contenu |
|---|---|---|
| [Jour 06](./jour-06.md) | Découverte du DOM | Sélectionner, modifier, créer des éléments |
| [Jour 07](./jour-07.md) | Événements et interactivité | Clics, saisie, réagir à l'utilisateur |
| [Jour 08](./jour-08.md) | Asynchrone : Promises et `fetch` | Récupérer les données de l'API |
| [Jour 09](./jour-09.md) | Injecter les données dans le DOM | Générer des cartes à partir des données |
| [Jour 10](./jour-10.md) | Recherche, filtres et tri | Rendre l'application interactive |
| [Jour 11](./jour-11.md) | Vue détail, finitions et bonus | Page de détail, gestion des erreurs, polish |

---

## Le projet fil rouge : *Explorateur*

À partir du jour 6, tu construis une **page web** qui :

- récupère une liste d'éléments (personnages, créatures...) depuis une **API publique** ;
- affiche chaque élément sous forme de **carte** (image, nom, quelques infos) ;
- propose une **barre de recherche** pour filtrer par nom ;
- propose des **boutons de filtre** (par type, statut, espèce... selon l'API) ;
- permet de **trier** les résultats (par nom, par une statistique...) ;
- affiche une **vue détaillée** au clic sur une carte.

Le thème dépend de l'API que tu choisis — le code, lui, reste le même.

---

## Choisir son API

Ce kit est conçu pour fonctionner avec **n'importe quelle API publique renvoyant une liste d'éléments avec une image**. Voici quatre API gratuites, sans clé d'authentification, adaptées aux débutants. **Choisis-en une** et garde-la pour tout le projet.

| API | Thème | URL de base | Documentation |
|---|---|---|---|
| **PokéAPI** | Pokémon | `https://pokeapi.co/api/v2/` | https://pokeapi.co/docs/v2 |
| **Dragon Ball API** | Dragon Ball | `https://dragonball-api.com/api/` | https://web.dragonball-api.com/documentation |
| **Rick and Morty API** | Rick & Morty | `https://rickandmortyapi.com/api/` | https://rickandmortyapi.com/documentation |
| **TVMaze** | Séries TV | `https://api.tvmaze.com/` | https://www.tvmaze.com/api |

> 💡 **Débutant ?** L'API **Rick and Morty** est la plus simple à prendre en main : les données sont propres, chaque personnage a une image, un statut (vivant / mort), une espèce et une origine — parfait pour s'entraîner au filtrage et au tri.
>
> **Envie de chercher toi-même ?** Tu es libre d'utiliser une autre API publique gratuite. Une bonne liste est disponible ici : https://github.com/public-apis/public-apis. Vérifie qu'elle respecte ces critères :
> - gratuite et sans clé (ou avec une clé gratuite immédiate) ;
> - renvoie du **JSON** ;
> - renvoie une **liste** d'éléments ;
> - autorise les requêtes depuis le navigateur (**CORS** activé) ;
> - chaque élément contient de préférence une **image**.

---

## Comment utiliser ce kit

- **Un jour = un fichier.** Suis les jours dans l'ordre, ils sont progressifs.
- Chaque jour contient : des **objectifs**, des **explications**, des **exercices ou tâches**, et un **livrable** (checklist de fin de journée).
- Lis l'explication **avant** de te lancer dans les exercices.
- Les sections **⚡ Pour aller plus loin** sont optionnelles.
- Si tu es bloqué·e plus de 20 minutes sur un exercice de fondamentaux, consulte [les corrections](./corrections-fondamentaux.md).
- Pour la théorie détaillée, tu peux t'appuyer sur le cours complet du dossier parent (`javascript/00-sommaire.md`).

## Prérequis techniques

- Un **navigateur** moderne (Chrome, Firefox, Edge...).
- Un **éditeur de code** (VS Code recommandé).
- Aucune installation de Node.js n'est nécessaire : tout tourne dans le navigateur.

> 💡 **Ouvrir la console du navigateur** : touche `F12` (ou `Cmd+Option+I` sur Mac), puis onglet **Console**. C'est là que tu feras tous les exercices des jours 1 à 5.

## Durée indicative

Compte environ une demi-journée à une journée par chapitre pour un rythme confortable en autonomie. Les jours 8 à 11 (la partie API) peuvent demander un peu plus de temps car ils combinent tout ce qui précède.
