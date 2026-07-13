# Module 10 — SEO

## Objectifs

- Gérer les meta tags dynamiquement par page
- Ajouter Open Graph pour le partage sur réseaux sociaux
- Générer un sitemap.xml et un robots.txt

## Pourquoi ce module est important pour toi

Pour un client comme un praticien indépendant (réflexologue, coach sportif), une part importante de la valeur d'un site vitrine tient dans sa capacité à être bien référencé localement. C'est souvent ce qui justifie le budget aux yeux du client, autant que le design.

## Meta tags dynamiques

L'approche propre consiste à créer un composant SEO réutilisable, alimenté par des props différentes par page.

`src/components/SEO.astro` :

```astro
---
interface Props {
  titre: string;
  description: string;
  image?: string;
}

const { titre, description, image = '/og-default.jpg' } = Astro.props;
const url = Astro.site ? new URL(Astro.url.pathname, Astro.site) : Astro.url;
---

<title>{titre}</title>
<meta name="description" content={description} />
<link rel="canonical" href={url} />

<!-- Open Graph -->
<meta property="og:title" content={titre} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:url" content={url} />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
```

Utilisation dans le layout :

```astro
---
import SEO from '../components/SEO.astro';

interface Props {
  titre: string;
  description: string;
}
const { titre, description } = Astro.props;
---

<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <SEO titre={titre} description={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

Chaque page passe ensuite son propre titre et sa propre description au layout, plutôt que d'avoir un titre générique identique partout, erreur SEO fréquente sur les sites mal conçus.

## Sitemap automatique

```bash
npx astro add sitemap
```

Ça ajoute l'intégration à `astro.config.mjs` :

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://exemple.fr', // obligatoire pour que le sitemap fonctionne
  integrations: [sitemap()],
});
```

Au build, Astro génère automatiquement `sitemap-index.xml` et `sitemap-0.xml` dans `dist/`, à partir de toutes les routes statiques et dynamiques du site. Aucune configuration manuelle par page nécessaire.

## robots.txt

Fichier statique à placer directement dans `public/robots.txt` :

```
User-agent: *
Allow: /

Sitemap: https://exemple.fr/sitemap-index.xml
```

## SEO local

Pour un praticien avec une zone géographique précise, quelques éléments supplémentaires comptent particulièrement :

- Mentionner explicitement la ville et la zone d'intervention dans les titres et descriptions de page, pas seulement dans le contenu
- Structurer les données avec un balisage Schema.org de type `LocalBusiness` (JSON-LD), qui aide Google à afficher des informations enrichies
- Cohérence du nom, adresse, téléphone entre le site et la fiche Google Business Profile du client (hors périmètre du code, mais à mentionner au client)

Exemple de JSON-LD minimal à placer dans le head :

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Nom du praticien",
  "description": "Description de l'activité",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ville",
    "addressRegion": "Région",
    "addressCountry": "FR"
  }
})} />
```

## À tester

1. Crée le composant `SEO.astro` et intègre-le dans ton layout.
2. Passe un titre et une description différents sur chacune de tes pages (accueil, services, contact).
3. Installe l'intégration sitemap, fais `npm run build`, et vérifie la présence du fichier sitemap dans `dist/`.
4. Crée `public/robots.txt` avec le contenu ci-dessus.
5. Utilise un outil comme le débogueur de partage Facebook/LinkedIn (ou simplement l'inspecteur du navigateur) pour vérifier que les balises Open Graph s'affichent correctement.
