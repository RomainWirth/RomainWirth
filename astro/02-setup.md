# Module 02 — Setup & CLI

## Objectifs

- Créer un projet Astro
- Comprendre les commandes de base
- Comprendre la configuration minimale

## Installation

Astro se crée avec un CLI officiel. Depuis un terminal :

```bash
npm create astro@latest mon-cours-astro
```

Le CLI pose quelques questions :
- Template : choisis "Empty" pour partir de zéro, c'est plus formateur qu'un template pré-rempli
- TypeScript : oui, strict ou strictest selon ton habitude (tu es déjà en TS sur Next.js donc autant garder ce réflexe)
- Installer les dépendances : oui
- Initialiser un repo git : oui

Une fois terminé :

```bash
cd mon-cours-astro
npm run dev
```

Le site tourne par défaut sur `http://localhost:4321`.

## Les commandes essentielles

| Commande | Effet |
|---|---|
| `npm run dev` | Lance le serveur de développement avec hot reload |
| `npm run build` | Génère le site statique dans `dist/` |
| `npm run preview` | Sert le contenu de `dist/` en local, pour vérifier le build avant déploiement |
| `npx astro check` | Vérifie les types TypeScript et les erreurs dans les fichiers .astro |
| `npx astro add <intégration>` | Ajoute une intégration (Tailwind, React, sitemap, etc.) de façon automatisée |

## Structure générée

```
mon-cours-astro/
├── src/
│   ├── pages/          → chaque fichier devient une route
│   ├── components/     → composants réutilisables
│   ├── layouts/         → gabarits de page (à créer, pas généré par défaut)
│   └── assets/          → images optimisées (selon version)
├── public/              → fichiers servis tels quels (favicon, robots.txt...)
├── astro.config.mjs     → configuration du projet
├── package.json
└── tsconfig.json
```

Point important par rapport à Next.js : dans Astro, tout ce qui est dans `src/pages/` devient une route automatiquement, mais il n'y a pas de notion de `app/` ou `pages/api/` par défaut. Le routing API existe mais nécessite le mode serveur (on n'en aura pas besoin pour ce cours orienté sites vitrine statiques).

## astro.config.mjs

Fichier de configuration central. Exemple minimal :

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://exemple.fr',
  output: 'static', // valeur par défaut, on la explicitera pour clarté
});
```

Le champ `site` sera réutilisé plus tard pour le sitemap et les URLs canoniques (module SEO), autant le renseigner dès maintenant.

## À tester

1. Crée le projet avec `npm create astro@latest`.
2. Lance `npm run dev` et vérifie que la page par défaut s'affiche sur `localhost:4321`.
3. Modifie le fichier `src/pages/index.astro` (change le texte du titre) et observe le hot reload.
4. Lance `npm run build` puis `npm run preview`, vérifie que le contenu buildé correspond à ce que tu voyais en dev.
5. Ouvre `astro.config.mjs` et ajoute le champ `site` avec une URL fictive.

Si les 5 points fonctionnent, tu es prêt pour le module suivant.
