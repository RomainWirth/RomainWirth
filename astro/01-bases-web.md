# Module 01 — Les bases avant de commencer

> **Tu connais déjà un framework JS (React, Vue, Angular...) ?**
> Tu peux sauter ce module entièrement et aller directement au module 02 (Setup & CLI). Tout ce qui suit est pensé pour quelqu'un qui n'a jamais utilisé de framework JavaScript.

## Objectifs

- Comprendre ce qu'est un framework JavaScript, et pourquoi ça existe
- Comprendre ce que sont Node.js et npm, et pourquoi on en a besoin même pour un site "statique"
- Comprendre la différence entre un site fait "à la main" et un site généré par un outil comme Astro
- Voir un minimum de vocabulaire qui reviendra dans tout le cours

## Le web sans framework, pour rappel

Un site web "à la main" classique, c'est un ou plusieurs fichiers HTML, du CSS pour la mise en forme, et parfois un peu de JavaScript pour l'interactivité (un menu qui s'ouvre, un formulaire qui vérifie les champs). Si tu as dix pages, tu as dix fichiers HTML, et si tu changes ton menu de navigation, tu dois le modifier dans les dix fichiers un par un.

C'est cette limite qui a fait naître les outils qu'on appelle aujourd'hui des "frameworks" ou plus largement des outils de génération de site.

## Qu'est-ce qu'un framework JavaScript

Un framework JavaScript (React, Vue, Angular, Svelte...) est un outil qui permet de découper une interface en morceaux réutilisables, appelés composants. Un menu de navigation devient un seul composant, réutilisé sur toutes les pages : le modifier une fois le modifie partout.

Ces frameworks sont nés pour construire des applications très interactives (Gmail, Trello, Netflix), où la page ne recharge jamais entièrement, tout se met à jour dynamiquement en JavaScript. On appelle ça des SPA (Single Page Application), une notion qu'on retrouvera au module suivant.

Astro n'est pas un concurrent direct de React ou Vue : c'est un outil différent, pensé pour des sites où le contenu prime sur l'interactivité (sites vitrine, blogs, sites d'entreprise). On le détaille au module 03. Il peut même utiliser des composants React ou Vue ponctuellement si besoin (module 05), sans en avoir besoin par défaut.

## Node.js et npm, à quoi ça sert

Ton navigateur (Chrome, Firefox) sait exécuter du JavaScript, mais seulement dans une page web déjà ouverte. Node.js permet d'exécuter du JavaScript directement sur ton ordinateur, en dehors du navigateur, ce qui est indispensable pour faire tourner des outils de développement.

npm (Node Package Manager) est l'outil qui vient avec Node.js et qui permet d'installer des "paquets" : des bouts de code écrits par d'autres développeurs, réutilisables dans ton projet, plutôt que de tout réécrire toi-même. Astro lui-même s'installe via npm.

Quelques commandes que tu croiseras tout le long du cours :

| Commande | Ce qu'elle fait |
|---|---|
| `npm install` | Télécharge tous les paquets nécessaires au projet (listés dans `package.json`) |
| `npm run dev` | Lance un serveur de développement local, avec rechargement automatique |
| `npm run build` | Génère la version finale du site, prête à être mise en ligne |

Tu n'as pas besoin de tout comprendre en détail sur Node.js pour ce cours : il te suffit de savoir que c'est l'outil qui fait tourner les commandes ci-dessus en coulisses.

## Pourquoi un outil comme Astro, alors qu'on peut coder en HTML/CSS/JS pur

Trois raisons principales, qui reviendront concrètement dans les modules suivants :

1. **Réutilisation** : écrire un menu ou un pied de page une seule fois, et l'utiliser sur toutes les pages (module 04, "Composants")
2. **Contenu structuré** : gérer facilement plusieurs articles de blog sans dupliquer de code (module 07, "Content Collections")
3. **Performance automatique** : Astro optimise les images, ne charge du JavaScript que là où c'est vraiment nécessaire, et génère des pages très rapides sans effort particulier de ta part

## Un peu de vocabulaire qui reviendra souvent

- **Composant** : un morceau d'interface réutilisable (un bouton, une carte, un menu)
- **Props** : les informations qu'on transmet à un composant pour le personnaliser (un peu comme les arguments d'une fonction)
- **Build** : l'étape qui transforme ton code source en fichiers finaux prêts à être mis en ligne
- **Hydratation** : le fait de "réveiller" un composant avec du JavaScript côté navigateur, pour le rendre interactif. Notion centrale d'Astro, détaillée au module 03.
- **Frontmatter** : la zone d'un fichier Astro, délimitée par `---`, qui contient du code JavaScript/TypeScript exécuté avant l'affichage de la page

## À tester

1. Vérifie que Node.js est installé sur ta machine avec `node --version` dans un terminal. Si rien ne s'affiche, il faudra l'installer avant le module suivant.
2. Vérifie de la même façon que npm est disponible avec `npm --version`.
3. Sans encore installer Astro, ouvre un fichier HTML basique dans ton éditeur et repère mentalement : où mettrais-tu le menu si tu avais dix pages à créer ? C'est exactement le problème que les prochains modules vont résoudre.
