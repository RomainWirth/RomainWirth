# Module 07 — Content Collections

## Objectifs

- Définir un schéma de contenu avec Zod
- Écrire du contenu en Markdown/MDX
- Récupérer et afficher ce contenu avec getCollection() et getEntry()

## Pourquoi les Content Collections

Dans le module précédent, la liste d'articles était codée en dur dans le fichier de routing. Les Content Collections permettent de séparer le contenu (fichiers Markdown) de la logique d'affichage, avec en plus une validation de structure via Zod. C'est l'équivalent d'un mini système de gestion de contenu fichier, sans base de données ni CMS externe (à la différence de Contentful que tu utilises sur des projets plus complexes).

Pour un site vitrine simple, les Content Collections évitent d'avoir besoin d'un CMS headless : le client ajoute un fichier Markdown pour publier un nouvel article, sans toucher au code.

## Définir le schéma

`src/content/config.ts` :

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    datePublication: z.date(),
    image: z.string().optional(),
  }),
});

export const collections = { blog };
```

Ce schéma garantit qu'un fichier Markdown mal formé (date manquante, titre absent) provoque une erreur au build plutôt qu'un bug silencieux en production. C'est un vrai filet de sécurité quand un client alimente lui-même le contenu.

## Écrire du contenu

`src/content/blog/bienfaits-reflexologie.md` :

```markdown
---
titre: "Les bienfaits de la réflexologie"
description: "Comprendre comment la réflexologie plantaire agit sur le corps"
datePublication: 2026-03-15
---

Le contenu de l'article en Markdown classique, avec titres, listes, liens...

## Un sous-titre

Du texte normal.
```

Le frontmatter du fichier Markdown est validé automatiquement contre le schéma Zod défini plus haut.

## Lire le contenu : getCollection() et getEntry()

Pour lister tous les articles :

```astro
---
import { getCollection } from 'astro:content';

const articles = await getCollection('blog');
---

<ul>
  {articles.map((article) => (
    <li>
      <a href={`/blog/${article.slug}`}>{article.data.titre}</a>
    </li>
  ))}
</ul>
```

Pour récupérer un article précis (par exemple dans une route dynamique) :

```astro
---
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const articles = await getCollection('blog');
  return articles.map((article) => ({
    params: { slug: article.slug },
  }));
}

const { slug } = Astro.params;
const article = await getEntry('blog', slug);
const { Content } = await article.render();
---

<h1>{article.data.titre}</h1>
<Content />
```

`article.render()` retourne un composant `Content` qui affiche le corps Markdown transformé en HTML.

## À tester

1. Crée `src/content/config.ts` avec le schéma ci-dessus.
2. Crée 2-3 fichiers Markdown dans `src/content/blog/`, avec un frontmatter volontairement incomplet sur l'un d'eux (par exemple sans date) pour observer l'erreur de validation Zod au build.
3. Corrige l'erreur, puis crée une page `src/pages/blog/index.astro` qui liste tous les articles via `getCollection()`.
4. Crée `src/pages/blog/[slug].astro` qui affiche un article complet via `getEntry()` et `.render()`.
5. Compare avec le module précédent : constate que tu n'as plus besoin de coder la liste en dur, elle vient directement des fichiers Markdown.
