# Jour 02 - CSS & box model

⏱ **Durée estimée : une journée**

## Objectifs

- Lier le CSS et cibler des éléments avec les sélecteurs
- Styliser texte, couleurs, arrière-plans (+ variables)
- Comprendre et maîtriser le box model
- Décorer les éléments (bordures, ombres, coins arrondis)

> 🎨 *Ma Vitrine* passe du brut au stylé.

---

## 2.1 - Lier le CSS

Crée `css/style.css` puis, dans le `<head>` de `index.html` :

```html
<link rel="stylesheet" href="css/style.css">
```

Teste avec une règle :

```css
body {
  background-color: #f4f4f8;
}
```

---

## 2.2 - Syntaxe et sélecteurs

```css
h1 {                 /* sélecteur */
  color: #2c3e50;    /* propriété : valeur ; */
  font-size: 2.5rem;
}
```

| Sélecteur | Cible | Exemple |
|---|---|---|
| `balise` | Tous les éléments de ce type | `p` |
| `.classe` | Les éléments ayant cette classe | `.carte` |
| `#id` | L'élément unique avec cet id | `#contact` |
| `a b` | `b` à l'intérieur de `a` | `nav a` |

> 💡 On utilise surtout les **classes** (réutilisables). Les `id` servent aux ancres de navigation.

---

## 2.3 - Couleurs, texte et variables

Définis tes couleurs une fois dans `:root`, puis réutilise-les avec `var()` :

```css
:root {
  --principale: #3498db;
  --texte: #333333;
  --fond: #f4f4f8;
}

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  color: var(--texte);
  background-color: var(--fond);
  line-height: 1.6;
}

h1 {
  color: var(--principale);
  text-align: center;
}
```

Trois écritures de couleur : `red`, `#3498db`, `rgb(52, 152, 219)`.

Effet au survol avec une pseudo-classe :

```css
nav a {
  text-decoration: none;
  color: white;
}
nav a:hover {
  color: #e74c3c;
}
```

---

## 2.4 - Le box model

Chaque élément est une **boîte** à 4 couches :

```
┌─────────────────────────────┐  ← marge (margin) : espace extérieur
│  ┌───────────────────────┐  │  ← bordure (border)
│  │  ┌─────────────────┐  │  │  ← padding : espace intérieur
│  │  │    contenu      │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Propriété | Rôle |
|---|---|
| `width` / `height` | Taille du contenu |
| `padding` | Espace **intérieur** (contenu ↔ bordure) |
| `border` | Le trait autour |
| `margin` | Espace **extérieur** (entre boîtes) |

### La règle de départ indispensable

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

> 💡 `border-box` fait que `width` inclut padding et bordure : bien plus intuitif pour les calculs. Standard sur presque tous les sites.

---

## 2.5 - Décorer les boîtes

```css
.carte {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;                       /* coins arrondis */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);  /* ombre douce */
}
```

- `border-radius` : arrondit les coins.
- `box-shadow: décalage-x décalage-y flou couleur`.

---

## Tâches du jour

### Tâche 2.1 - Lier + réglages de départ
Crée et lie `css/style.css`. Ajoute la règle `* { box-sizing: border-box; margin: 0; padding: 0; }` en haut.

### Tâche 2.2 - Palette & typographie
Définis 2-3 variables de couleur dans `:root`. Applique une police lisible, une couleur de texte et `line-height: 1.6` sur `body`.

### Tâche 2.3 - En-tête & navigation
Donne à `<header>` un fond coloré et du texte blanc, centre le `<h1>`. Colore les liens du `<nav>`, retire le soulignement, ajoute un `:hover`.

### Tâche 2.4 - Cartes de projets
Ajoute `class="carte"` à tes 3 blocs de projets, puis stylise `.carte` : fond blanc, `padding`, `border-radius`, `box-shadow`.

### Tâche 2.5 - Aérer
Ajoute du `padding` vertical sur tes sections (`padding: 2rem 0`).

### ⚡ Pour aller plus loin
Importe une police Google Fonts (https://fonts.google.com) via un `<link>` et applique-la au site.

---

## Livrable

- [ ] Le CSS est lié et fonctionne
- [ ] `box-sizing: border-box` est appliqué globalement
- [ ] J'utilise des variables CSS dans `:root`
- [ ] L'en-tête et la navigation sont stylisés (avec `:hover`)
- [ ] Les cartes ont padding, coins arrondis et ombre

➡️ **Demain (Jour 03)** : organiser la page avec Flexbox et la rendre responsive.
