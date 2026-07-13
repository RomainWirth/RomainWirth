# Module 05 — Rendre une page interactive

> **Tu connais déjà React ou Vue ?**
> Lis rapidement la partie "JavaScript simple dans une page Astro", puis passe directement à la section "Pour aller plus loin : intégrer React ou Vue" en fin de module, qui reprend les directives `client:load`, `client:visible`, `client:idle`.

## Objectifs

- Ajouter un peu d'interactivité à une page Astro sans framework JS
- Comprendre l'île d'interactivité (island), le concept central d'Astro
- Savoir quand un framework comme React devient utile, et comment l'intégrer le cas échéant

## Rappel : une page Astro est statique par défaut

Comme vu au module 03, une page `.astro` ne génère que du HTML, sans JavaScript, tant que tu n'en ajoutes pas explicitement. C'est très bien pour du texte, des images, une mise en page. Mais certains éléments ont besoin d'interactivité réelle dans le navigateur : un menu mobile qui s'ouvre au clic, un bouton qui affiche ou masque un contenu.

## JavaScript simple dans une page Astro

La façon la plus directe d'ajouter de l'interactivité, sans aucun framework, est une balise `<script>` classique dans ton fichier `.astro`.

```astro
<button id="menu-toggle">Menu</button>
<ul id="menu-liste" style="display: none;">
  <li>Accueil</li>
  <li>Services</li>
  <li>Contact</li>
</ul>

<script>
  const bouton = document.getElementById('menu-toggle');
  const liste = document.getElementById('menu-liste');

  bouton.addEventListener('click', () => {
    liste.style.display = liste.style.display === 'none' ? 'block' : 'none';
  });
</script>
```

Ce script s'exécute une fois la page chargée dans le navigateur, exactement comme dans un site HTML/CSS/JS classique sans aucun outil particulier. Astro l'intègre tel quel, en l'optimisant légèrement au build (minification).

Pour un menu mobile ou un simple bouton "afficher plus", cette approche suffit largement, et c'est celle que tu utiliseras le plus souvent sur un site vitrine simple. Pas besoin de React pour ouvrir un menu.

## Où placer le code JavaScript

Pour un composant réutilisable avec son propre comportement, tu peux regrouper HTML, style et script dans un seul fichier `.astro` :

`src/components/MenuMobile.astro` :

```astro
<button id="menu-toggle" aria-label="Ouvrir le menu">☰</button>
<nav id="menu-liste" class="menu-ferme">
  <a href="/">Accueil</a>
  <a href="/services">Services</a>
  <a href="/contact">Contact</a>
</nav>

<style>
  .menu-ferme {
    display: none;
  }
  .menu-ouvert {
    display: flex;
    flex-direction: column;
  }
</style>

<script>
  const bouton = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu-liste');

  bouton?.addEventListener('click', () => {
    menu?.classList.toggle('menu-ouvert');
    menu?.classList.toggle('menu-ferme');
  });
</script>
```

Ce composant est ensuite importé et utilisé comme n'importe quel autre composant Astro (module 04) :

```astro
---
import MenuMobile from '../components/MenuMobile.astro';
---

<MenuMobile />
```

## Pour aller plus loin : intégrer React ou Vue

Pour un besoin d'interactivité plus complexe (formulaire avec validation en temps réel poussée, carousel avec état interne riche), il peut devenir pertinent d'utiliser un framework comme React ou Vue à l'intérieur d'un projet Astro. Ce n'est pas nécessaire pour la majorité des sites vitrine, mais c'est une capacité importante d'Astro à connaître.

### Installation de l'intégration React

```bash
npx astro add react
```

Ça installe les dépendances et modifie `astro.config.mjs` automatiquement :

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

### Le concept d'île (island)

Par défaut, si tu importes un composant React dans une page Astro sans précision supplémentaire, il est converti en HTML statique au build, et son JavaScript n'est jamais envoyé au navigateur : le bouton ne réagira à aucun clic. C'est voulu. Il faut dire explicitement à Astro quand "réveiller" ce composant en JavaScript, uniquement pour lui, sans toucher au reste de la page. Cette zone isolée s'appelle une île.

```astro
---
import MenuMobileReact from '../components/MenuMobileReact.jsx';
---

<!-- Hydraté immédiatement au chargement de la page -->
<MenuMobileReact client:load />

<!-- Hydraté seulement quand le composant devient visible à l'écran -->
<MenuMobileReact client:visible />

<!-- Hydraté quand le navigateur est inactif (priorité basse) -->
<MenuMobileReact client:idle />
```

| Directive | Cas d'usage typique |
|---|---|
| `client:load` | Élément critique visible immédiatement |
| `client:visible` | Élément plus bas dans la page (carousel en bas de page) |
| `client:idle` | Élément non prioritaire (widget de chat, tracking) |

## Vanilla JS ou React, comment choisir

Pour la quasi-totalité des sites vitrine, le JavaScript simple (première partie du module) suffit : menu mobile, bouton d'affichage, petite animation. React ou Vue ne deviennent utiles que si l'état à gérer devient complexe (plusieurs champs de formulaire interdépendants, données qui changent souvent). Ajouter React pour un simple menu qui s'ouvre et se ferme revient à charger un outil bien plus lourd que nécessaire, ce qui va à l'encontre de la philosophie de performance d'Astro.

## À tester

1. Crée le composant `MenuMobile.astro` en JavaScript simple ci-dessus, intègre-le dans ton layout.
2. Vérifie en dev que le clic ouvre et ferme bien le menu.
3. Si tu veux t'exercer avec React : installe l'intégration, crée un composant équivalent en `.jsx` avec `useState`, intègre-le avec `client:load`, et compare le poids du JavaScript généré (onglet Réseau des devtools) entre les deux approches pour un même résultat visuel.
