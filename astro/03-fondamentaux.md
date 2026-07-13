# Module 03 — Fondamentaux

> **Tu connais déjà React, Vue ou un framework similaire ?**
> Tu peux lire ce module normalement, mais la section "Différences avec React/Vue" en fin de module est la seule vraiment utile pour toi : le reste te confirmera surtout des intuitions que tu as déjà.

## Objectifs

- Comprendre la différence MPA vs SPA
- Comprendre l'island architecture
- Écrire ta première syntaxe .astro

## MPA vs SPA

Une SPA (Single Page Application) charge une seule page HTML au départ, puis gère toute la navigation en JavaScript côté navigateur : quand tu cliques sur un lien, rien ne recharge vraiment, le contenu se met juste à jour dynamiquement. C'est le fonctionnement d'applications comme Gmail ou Trello, et c'est ce que produisent des frameworks comme React ou Vue quand ils sont utilisés seuls.

Une MPA (Multi Page Application) génère une vraie page HTML distincte pour chaque URL, comme le faisait le web historiquement : cliquer sur un lien recharge une nouvelle page complète, générée à l'avance.

Astro est nativement une MPA : chaque route produit un fichier HTML séparé, sans JavaScript par défaut. C'est une des raisons pour lesquelles les sites Astro sont en général très rapides pour du contenu majoritairement statique (site vitrine, blog) : il n'y a rien à "réveiller" en JavaScript si tu n'en ajoutes pas explicitement.

## Island architecture

C'est le concept central d'Astro. Par défaut, une page Astro est du HTML pur, zéro JavaScript envoyé au navigateur. Si tu as besoin d'interactivité (un carousel, un menu mobile, un formulaire réactif), tu isoles cette portion dans un composant "île", qui sera le seul bout de JS chargé, et seulement pour cette zone précise de la page.

Concrètement : le reste de la page (texte, images, structure) reste du HTML statique performant, et seules les îles sont hydratées en JS. C'est l'inverse de Next.js où, par défaut, toute la page peut être hydratée côté client.

Ça correspond bien à ton positionnement pour des sites vitrine : la majorité du contenu (présentation, services, contact) n'a pas besoin d'interactivité lourde.

## Syntaxe .astro

Un fichier `.astro` a deux parties : le frontmatter (code JavaScript/TypeScript exécuté côté serveur, au build) et le template (HTML avec quelques extensions).

```astro
---
// Frontmatter : exécuté au build, jamais envoyé au navigateur
const titre = "Bienvenue";
const items = ["Accueil", "Services", "Contact"];
---

<!-- Template : HTML avec expressions JS entre accolades -->
<h1>{titre}</h1>

<ul>
  {items.map((item) => <li>{item}</li>)}
</ul>
```

## Différences avec React/Vue

*(Section utile surtout si tu as déjà pratiqué un framework JS. Si ce n'est pas ton cas, tu peux la survoler et passer à "À tester".)*

- Le frontmatter n'est jamais exécuté côté client, contrairement à un composant React classique qui peut tourner côté navigateur
- Pas de hooks (`useState`, `useEffect`) dans un composant `.astro` pur : il n'y a pas d'état réactif, puisque le composant ne s'exécute qu'au build ou côté serveur
- La syntaxe ressemble à JSX pour les expressions, mais ce n'est pas du JSX : c'est un langage de template propre à Astro
- Il n'y a pas de virtual DOM ni de re-render : un composant `.astro` s'exécute une seule fois, au moment du build

## À tester

1. Ouvre `src/pages/index.astro`.
2. Ajoute dans le frontmatter une variable `const services = ["Site vitrine", "Application web", "Audit technique"]`.
3. Affiche-la dans le template sous forme de liste `<ul>` avec `.map()`.
4. Fais `npm run build`, puis regarde le fichier HTML généré dans `dist/index.html` : vérifie qu'aucun JavaScript lié à cette liste n'apparaît dans le fichier.
5. Compare mentalement avec ce que produirait le même composant en React : il y aurait un bundle JS embarqué même pour du contenu statique. C'est la différence concrète que tu viens de constater.
