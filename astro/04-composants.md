# Module 04 — Composants

## Objectifs

- Créer des composants .astro réutilisables
- Utiliser props et slots
- Construire un layout de base

## Composants .astro et props

Un composant `.astro` reçoit ses props via `Astro.props`, en général typées avec une interface TypeScript.

`src/components/Card.astro` :

```astro
---
interface Props {
  titre: string;
  description: string;
}

const { titre, description } = Astro.props;
---

<div class="card">
  <h3>{titre}</h3>
  <p>{description}</p>
</div>
```

Utilisation dans une page :

```astro
---
import Card from '../components/Card.astro';
---

<Card titre="Réflexologie plantaire" description="Séance de 45 minutes" />
```

## Slots

Le slot permet d'injecter du contenu HTML depuis le composant parent à l'intérieur d'un composant enfant. *(Si tu connais React : c'est l'équivalent de `children`.)*

`src/components/Section.astro` :

```astro
---
interface Props {
  titre: string;
}
const { titre } = Astro.props;
---

<section>
  <h2>{titre}</h2>
  <slot />
</section>
```

Utilisation :

```astro
<Section titre="Nos services">
  <p>Contenu libre injecté dans le slot par défaut.</p>
</Section>
```

Il existe aussi des slots nommés pour injecter plusieurs zones de contenu distinctes :

```astro
<!-- Dans le composant -->
<header><slot name="header" /></header>
<main><slot /></main>
<footer><slot name="footer" /></footer>

<!-- Dans l'usage -->
<Layout>
  <span slot="header">En-tête personnalisé</span>
  <p>Contenu principal</p>
  <span slot="footer">Pied de page</span>
</Layout>
```

## Layouts

Un layout est un composant `.astro` classique, mais utilisé spécifiquement pour englober une page entière (structure HTML, head, nav, footer communs).

`src/layouts/BaseLayout.astro` :

```astro
---
interface Props {
  titre: string;
}
const { titre } = Astro.props;
---

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>{titre}</title>
  </head>
  <body>
    <nav>Navigation commune</nav>
    <main>
      <slot />
    </main>
    <footer>Pied de page commun</footer>
  </body>
</html>
```

Utilisation dans une page :

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout titre="Accueil">
  <h1>Contenu de la page d'accueil</h1>
</BaseLayout>
```

C'est ce pattern que tu utiliseras systématiquement pour éviter de dupliquer le head, la nav et le footer sur chaque page d'un site client.

## À tester

1. Crée `src/layouts/BaseLayout.astro` avec la structure ci-dessus.
2. Crée un composant `Card.astro` avec au moins deux props typées.
3. Modifie `index.astro` pour utiliser le layout, et affiche trois `Card` dedans (par exemple pour trois services).
4. Ajoute un slot nommé "footer" dans le layout, et personnalise le pied de page depuis une page.
5. Vérifie en `npm run dev` que tout s'affiche correctement et que les types TypeScript ne remontent pas d'erreur (`npx astro check`).
