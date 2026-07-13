# Module 08 — Assets & images

## Objectifs

- Comprendre astro:assets et le composant Image
- Optimiser automatiquement les images d'un site client
- Distinguer public/ et src/assets/

## Pourquoi ce module compte particulièrement

Pour un site vitrine (photo de praticien, photos de cabinet, logo), le poids des images est souvent le premier facteur qui plombe un score Lighthouse. Astro fournit un système d'optimisation automatique qu'il faut utiliser systématiquement plutôt que des balises `<img>` classiques.

## public/ vs src/assets/

- `public/` : fichiers servis tels quels, sans transformation (favicon, robots.txt, fichiers qui doivent garder un nom de fichier fixe). Rien n'est optimisé ici.
- `src/assets/` : images qui passent par le pipeline d'optimisation d'Astro (compression, conversion de format, génération de tailles multiples).

Pour toute image de contenu (photos, illustrations), il faut privilégier `src/assets/`.

## Le composant Image

```astro
---
import { Image } from 'astro:assets';
import photoCabinet from '../assets/photo-cabinet.jpg';
---

<Image
  src={photoCabinet}
  alt="Cabinet de réflexologie à Seynod"
  width={800}
  height={600}
/>
```

Astro génère automatiquement une version optimisée de l'image (format moderne comme WebP quand le navigateur le supporte, taille correcte, attribut `loading="lazy"` par défaut). L'attribut `alt` est obligatoire, ce qui est aussi un bon réflexe côté accessibilité.

## Images responsive

```astro
<Image
  src={photoCabinet}
  alt="Cabinet de réflexologie"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 800px"
/>
```

Astro génère alors plusieurs variantes de l'image et laisse le navigateur choisir la plus adaptée à la taille d'écran, via `srcset`.

## Images depuis une Content Collection

Si une image est référencée dans le frontmatter d'un article Markdown (par exemple `image: "../../assets/article-1.jpg"`), Zod permet de valider que c'est bien une image via `image()` :

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    titre: z.string(),
    image: image().optional(),
  }),
});
```

## Cas où <img> classique reste acceptable

Pour une icône SVG décorative ou un logo très simple sans besoin d'optimisation particulière, une balise `<img>` standard reste correcte. Le composant `Image` d'Astro est surtout pertinent pour des photos (poids réel à optimiser).

## À tester

1. Place une photo (une vraie image, quelques centaines de Ko) dans `src/assets/`.
2. Affiche-la avec le composant `Image` dans une page, avec un `alt` descriptif.
3. Fais `npm run build`, va dans `dist/`, et compare le poids du fichier généré avec le fichier source original.
4. Ouvre le HTML généré et vérifie la présence de `loading="lazy"` et d'un format d'image optimisé.
5. Teste la version responsive avec `widths` et `sizes`, observe le `srcset` généré dans le HTML final.
