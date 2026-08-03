# Module 09 — Styles

## Objectifs

- Utiliser les styles scopés natifs d'Astro
- Intégrer Tailwind
- Appliquer quelques réflexes d'accessibilité de base

## Styles scopés

Un bloc `<style>` dans un fichier `.astro` est automatiquement scopé au composant : les règles ne fuient pas vers les autres composants, sans avoir besoin de CSS Modules ou de convention de nommage particulière.

```astro
---
interface Props {
  titre: string;
}
const { titre } = Astro.props;
---

<div class="card">
  <h3>{titre}</h3>
</div>

<style>
  .card {
    padding: 1rem;
    border-radius: 8px;
    background-color: #f5f5f5;
  }

  h3 {
    color: #4A7A74;
  }
</style>
```

Astro ajoute automatiquement un attribut de données unique à chaque élément concerné pour isoler le style, en coulisses. Aucune configuration nécessaire.

## Styles globaux

Pour du CSS qui doit s'appliquer à toute l'application (reset CSS, typographie de base, variables CSS), deux approches :

```astro
<style is:global>
  body {
    font-family: 'Atkinson Hyperlegible', sans-serif;
  }
</style>
```

Ou plus proprement, un fichier CSS global importé dans le layout principal :

`src/styles/global.css` :

```css
:root {
  --couleur-primaire: #4A7A74;
  --couleur-secondaire: #5C2E42;
}

body {
  font-family: 'Atkinson Hyperlegible', sans-serif;
  margin: 0;
}

h1, h2, h3 {
  font-family: 'Raleway', sans-serif;
}
```

```astro
---
import '../styles/global.css';
---
```

Cette approche est celle à privilégier pour ta charte perso (Raleway + Atkinson Hyperlegible, vert sauge/bordeaux), à réutiliser telle quelle sur les projets clients avec la charte adaptée.

## Intégration Tailwind

> **Note de version** : depuis Tailwind CSS v4 (et Astro 5.2+), l'intégration passe par le plugin Vite officiel de Tailwind plutôt que par l'ancien package `@astrojs/tailwind`, qui est désormais déprécié. La commande `npx astro add tailwind` reste la bonne porte d'entrée, mais elle installe maintenant ce plugin Vite plutôt que l'ancienne intégration.

```bash
npx astro add tailwind
```

Ça installe et configure automatiquement Tailwind : le plugin Vite est ajouté à `astro.config.mjs`, et un fichier CSS d'import est généré.

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`src/styles/global.css` :

```css
@import "tailwindcss";
```

Ce fichier est ensuite importé une fois dans le layout principal, comme n'importe quel CSS global :

```astro
---
import '../styles/global.css';
---
```

Utilisation dans le template :

```astro
<div class="p-4 rounded-lg bg-gray-100">
  <h3 class="text-xl font-bold text-teal-700">Titre</h3>
</div>
```

### Personnaliser le thème (charte graphique)

Différence importante par rapport aux versions précédentes de Tailwind : il n'y a plus de fichier `tailwind.config.mjs`. La configuration du thème (couleurs, polices, etc.) se fait directement en CSS, dans `global.css`, via un bloc `@theme` :

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-sauge: #4A7A74;
  --color-bordeaux: #5C2E42;
  --font-titre: 'Raleway', sans-serif;
  --font-corps: 'Atkinson Hyperlegible', sans-serif;
}
```

Tailwind génère automatiquement les classes utilitaires correspondantes à partir de ces variables (`bg-sauge`, `text-bordeaux`, `font-titre`, `font-corps`), utilisables ensuite via `class="text-sauge font-titre"`, exactement comme avec n'importe quelle couleur ou police native de Tailwind.

## Choisir entre styles scopés et Tailwind

Pour un site vitrine simple avec peu de composants, les styles scopés natifs suffisent largement et évitent une dépendance supplémentaire. Tailwind devient pertinent surtout à partir d'un certain nombre de composants, ou si tu veux itérer vite visuellement sans écrire de CSS dédié à chaque fois. Les deux approches sont compatibles dans un même projet.

## Accessibilité de base

Quelques réflexes à intégrer systématiquement, cohérents avec ta typographie Atkinson Hyperlegible pensée pour la lisibilité :

- Contraste suffisant entre texte et fond (vérifiable avec les devtools ou un outil comme WebAIM Contrast Checker)
- Hiérarchie de titres logique (`h1` unique par page, puis `h2`, `h3` dans l'ordre, sans sauter de niveau)
- `alt` descriptif sur chaque image (déjà vu au module précédent)
- Focus visible au clavier (ne jamais faire `outline: none` sans proposer une alternative de style au focus)
- Contrôles interactifs (boutons, liens) avec un intitulé explicite, pas juste une icône seule sans texte alternatif

## À tester

1. Ajoute un bloc `<style>` scopé à un composant, vérifie dans l'inspecteur du navigateur que la classe générée est unique à ce composant.
2. Crée `src/styles/global.css` avec tes couleurs et polices, importe-le dans le layout.
3. Installe Tailwind avec `npx astro add tailwind`, ajoute tes couleurs et polices personnalisées dans le bloc `@theme` de `global.css`.
4. Reprends une carte de service et stylise-la une fois avec du CSS scopé, une fois avec Tailwind, pour comparer les deux approches.
5. Vérifie au clavier (touche Tab) que tous les liens et boutons de ta page ont un focus visible.