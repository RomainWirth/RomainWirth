# ASTRO - SOMMAIRE

Kit d'apprentissage pratique sur le framework Astro, conçu pour des sites vitrine statiques performants. Chaque module contient des explications, des exemples de code et un exercice concret à réaliser en local.

Si tu connais déjà un framework JS (React, Vue...), certains modules ou sections sont signalés en tête de module pour indiquer ce que tu peux sauter ou survoler.

## Parcours conseillé

1. [01-bases-web.md](./01-bases-web.md)
2. [02-setup.md](./02-setup.md)
3. [03-fondamentaux.md](./03-fondamentaux.md)
4. [04-composants.md](./04-composants.md)
5. [05-interactivite.md](./05-interactivite.md)
6. [06-routing.md](./06-routing.md)
7. [07-content-collections.md](./07-content-collections.md)
8. [08-assets-images.md](./08-assets-images.md)
9. [09-styles.md](./09-styles.md)
10. [10-seo.md](./10-seo.md)
11. [11-formulaires.md](./11-formulaires.md)
12. [12-deploiement.md](./12-deploiement.md)
13. [13-projet-final.md](./13-projet-final.md)

## Contenu du dossier

### [01-bases-web.md](./01-bases-web.md)

Frameworks JS, Node.js et npm : pourquoi ils existent, ce qu'ils font, et vocabulaire de base nécessaire pour aborder Astro.

### [02-setup.md](./02-setup.md)

Création d'un projet Astro via le CLI officiel, commandes essentielles et configuration minimale du fichier `astro.config.mjs`.

### [03-fondamentaux.md](./03-fondamentaux.md)

MPA vs SPA, island architecture et syntaxe `.astro` : frontmatter, template, expressions. Différences principales avec React et Vue.

### [04-composants.md](./04-composants.md)

Composants `.astro` avec props typées TypeScript, slots simples et nommés, construction d'un layout réutilisable.

### [05-interactivite.md](./05-interactivite.md)

JavaScript vanilla dans une page Astro, intégration de composants React ou Vue, directives d'hydratation `client:load`, `client:visible`, `client:idle`.

### [06-routing.md](./06-routing.md)

Routing basé sur les fichiers, routes dynamiques avec `[slug].astro` et `getStaticPaths()`, gestion de la page 404.

### [07-content-collections.md](./07-content-collections.md)

Définition d'un schéma avec Zod, rédaction du contenu en Markdown, lecture avec `getCollection()` et `getEntry()`.

### [08-assets-images.md](./08-assets-images.md)

Composant `Image` natif d'Astro, optimisation automatique des images, différence entre `public/` et `src/assets/`.

### [09-styles.md](./09-styles.md)

Styles scopés natifs au composant, intégration de Tailwind, bonnes pratiques d'accessibilité de base.

### [10-seo.md](./10-seo.md)

Meta tags dynamiques par page, génération du sitemap et du robots.txt, SEO local et balisage JSON-LD.

### [11-formulaires.md](./11-formulaires.md)

Formulaire de contact via service tiers (Web3Forms, Formspree), interception JavaScript sans rechargement, SSR pour des besoins avancés.

### [12-deploiement.md](./12-deploiement.md)

Contenu généré par `npm run build`, gestion des variables d'environnement, déploiement sur hébergement mutualisé statique.

### [13-projet-final.md](./13-projet-final.md)

Mini-site vitrine complet à construire à partir d'un brief fictif, avec grille d'auto-évaluation et pistes pour aller plus loin.

## Logique du dossier

Ce cours peut servir :

- de parcours complet pour découvrir Astro et livrer un premier site vitrine client ;
- de référence rapide sur un concept précis (routing, content collections, SEO...) ;
- de base réutilisable à faire évoluer selon les besoins d'un client.

## Remarque

Les modules s'appuient sur un seul projet Astro créé au module 02, qui évolue tout au long du cours. Le module 13 (projet final) réutilise l'ensemble de ce qui a été construit. Chaque module se termine par une section "À tester" à compléter avant de passer à la suite.
