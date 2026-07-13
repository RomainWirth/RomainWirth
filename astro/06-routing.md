# Module 06 — Routing

## Objectifs

- Comprendre le routing basé sur les fichiers
- Créer des routes dynamiques
- Gérer une page 404

## Routing basé sur les fichiers

Dans Astro, chaque fichier `.astro` (ou `.md`) placé dans `src/pages/` devient automatiquement une route, sans configuration supplémentaire.

```
src/pages/
├── index.astro          → /
├── services.astro        → /services
├── contact.astro         → /contact
└── a-propos.astro        → /a-propos
```

Pour une sous-section, il suffit de créer un dossier :

```
src/pages/
└── blog/
    ├── index.astro       → /blog
    └── premier-article.astro → /blog/premier-article
```

## Routes dynamiques

Pour générer une page par élément d'une liste (articles de blog, fiches services), on utilise la syntaxe `[slug].astro`.

`src/pages/blog/[slug].astro` :

```astro
---
export async function getStaticPaths() {
  const articles = [
    { slug: 'bienfaits-reflexologie', titre: 'Les bienfaits de la réflexologie' },
    { slug: 'premiere-seance', titre: 'À quoi s\'attendre lors d\'une première séance' },
  ];

  return articles.map((article) => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;
---

<h1>{article.titre}</h1>
```

`getStaticPaths()` est exécuté au build, et Astro génère un fichier HTML statique pour chaque entrée du tableau retourné. C'est le mécanisme central pour un site statique avec du contenu variable (fiches produits, articles, portfolio).

Concrètement, avec l'exemple ci-dessus, Astro génère `/blog/bienfaits-reflexologie/index.html` et `/blog/premiere-seance/index.html`, chacun en HTML pur.

En pratique, la liste ne sera pas codée en dur comme dans l'exemple : elle viendra d'une Content Collection (module suivant), ce qui rend l'ajout d'un article aussi simple que l'ajout d'un fichier Markdown.

## Page 404

Astro reconnaît un fichier spécial pour la page d'erreur :

`src/pages/404.astro` :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titre="Page non trouvée">
  <h1>404</h1>
  <p>Cette page n'existe pas.</p>
  <a href="/">Retour à l'accueil</a>
</BaseLayout>
```

Ce fichier est automatiquement servi par la plupart des hébergeurs statiques (dont o2switch, via Apache) quand une URL ne correspond à aucune route existante, à condition que la configuration serveur pointe bien dessus (souvent automatique, à vérifier après déploiement).

## À tester

1. Crée trois pages statiques simples : `services.astro`, `contact.astro`, `a-propos.astro`.
2. Crée une route dynamique `blog/[slug].astro` avec un tableau de 2-3 articles factices codés en dur dans `getStaticPaths()`.
3. Vérifie que chaque article génère bien sa propre URL en dev (`/blog/ton-slug`).
4. Crée `404.astro` et teste en tapant une URL inexistante en dev.
5. Fais `npm run build` et regarde dans `dist/` : vérifie qu'il y a bien un dossier par article, chacun avec son `index.html`.
