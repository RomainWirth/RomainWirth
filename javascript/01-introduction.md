# Module 01 - Introduction au JavaScript

## Qu'est-ce que JavaScript ?

JavaScript est le langage de programmation du web. Il permet de rendre les pages web interactives : réagir à un clic, afficher ou masquer du contenu, valider un formulaire, communiquer avec un serveur sans recharger la page, etc.

Dans le développement web, les trois langages se répartissent les rôles ainsi :

| Langage | Rôle | Exemple |
|---|---|---|
| **HTML** | Structure | `<h1>Titre</h1>` |
| **CSS** | Apparence | `color: red;` |
| **JavaScript** | Comportement | `button.addEventListener('click', ...)` |

JavaScript a été créé en 1995 par Brendan Eich pour le navigateur Netscape. Il est aujourd'hui standardisé sous le nom **ECMAScript** (souvent abrégé ES). La version ES6 (2015) a introduit les fonctionnalités modernes utilisées dans ce cours : `let`/`const`, fonctions fléchées, classes, modules, etc. Les versions suivantes (ES7, ES8...) ont continué d'enrichir le langage.

> ℹ️ JavaScript fonctionne aussi **hors du navigateur** grâce à Node.js, qui permet d'exécuter du JS côté serveur (API, scripts, outils de build). Dans ce cours, on travaille côté navigateur.

## La console du navigateur

La console est l'outil de développement le plus utilisé au quotidien. Elle affiche les messages émis par `console.log()` et les erreurs JS de la page en cours.

**Ouvrir la console** : `F12` (ou `Cmd+Option+I` sur Mac) → onglet "Console".

```javascript
console.log('Bonjour');          // affiche une valeur
console.log('valeur :', 42);     // affiche un label + une valeur
console.error('Quelque chose a planté'); // affiche en rouge
console.warn('Attention');       // affiche en orange
console.table([{a: 1}, {a: 2}]); // affiche un tableau formaté
```

On peut aussi taper du JavaScript directement dans la console pour tester des expressions à la volée - c'est très utile pour expérimenter pendant l'apprentissage.

---

## Où utilise-t-on le JavaScript ?

Le JavaScript s'utilise dans un document HTML via la balise :

```html
<script></script>
```

Elle est placée dans le `<head>` ou à la fin du `<body>` (préférable, pour ne pas bloquer l'affichage de la page pendant le chargement du script).

Cette balise peut faire référence à un fichier externe (`index.js` ou `script.js`) pour décentraliser le code et gagner en lisibilité :

```html
<script src="index.js"></script>
```

> 🆕 **`defer` et `async` sur la balise `<script>`**
>
> Quand on place `<script>` dans le `<head>`, deux attributs évitent de bloquer le rendu de la page :
> - `<script defer src="index.js"></script>` : le script est téléchargé en parallèle du HTML et exécuté seulement une fois le HTML entièrement parsé, dans l'ordre d'apparition des balises.
> - `<script async src="index.js"></script>` : le script est téléchargé en parallèle et exécuté dès qu'il est prêt, sans garantie d'ordre.
>
> En pratique, `defer` est le choix par défaut le plus sûr pour un script qui manipule le DOM.

## Rappel algo

L'objectif d'un programme est de réaliser un ensemble d'instructions exécutables par un ordinateur pour répondre à un problème qu'on se pose.

Pour fonctionner, un programme a besoin de **variables** pour enregistrer et manipuler des données.

---

## Le cycle d'exécution du JavaScript dans le navigateur

Quand un navigateur charge une page web, il :
1. Parse le HTML de haut en bas
2. Rencontre une balise `<script>` → télécharge et exécute le script (sauf si `defer`/`async`)
3. Construit le **DOM** (Document Object Model) : la représentation de la page sous forme d'objet JS manipulable

C'est ce DOM que JavaScript manipule pour modifier dynamiquement le contenu affiché :

```javascript
// Sélectionner un élément et changer son texte
document.querySelector('h1').textContent = 'Nouveau titre';
```

> ℹ️ La manipulation du DOM n'est pas couverte en détail dans ce cours, qui se concentre sur les fondamentaux du langage. C'est la prochaine étape naturelle une fois les bases maîtrisées.

---

## Résumé

| Notion | À retenir |
|---|---|
| Rôle de JS | Comportement des pages web (interactivité, communication serveur) |
| Place dans le web | HTML = structure, CSS = apparence, JS = comportement |
| ECMAScript | Standard du langage ; ES6 (2015) = version moderne de référence |
| Node.js | JS hors navigateur (non couvert dans ce cours) |
| Balise `<script>` | À placer en fin de `<body>` ou dans `<head>` avec `defer` |
| `defer` vs `async` | `defer` : exécution après le HTML, dans l'ordre — choix par défaut |
| Console | Outil de développement quotidien — `F12` → onglet Console |
| DOM | Représentation de la page en objet JS, manipulable dynamiquement |

## Prochaine étape

**Module 02 — Variables et types primitifs** : déclarer des variables, comprendre les types de données (`number`, `string`, `boolean`, `null`, `undefined`) et le typage dynamique de JavaScript.
