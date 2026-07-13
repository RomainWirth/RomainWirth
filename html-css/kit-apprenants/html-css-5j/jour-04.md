# Jour 04 - Box model & mise en page

⏱ **Durée estimée : une journée**

## Objectifs

- Comprendre le box model (contenu, padding, bordure, marge)
- Maîtriser les espacements
- Décorer les éléments (bordures, coins arrondis, ombres)
- Organiser la page avec Flexbox

> 🧱 Le jour le plus important pour un rendu pro. Prends ton temps.

---

## 4.1 - Le box model

Chaque élément HTML est une **boîte** composée de 4 couches, de l'intérieur vers l'extérieur :

```
┌─────────────────────────────┐  ← marge (margin)
│  ┌───────────────────────┐  │  ← bordure (border)
│  │  ┌─────────────────┐  │  │  ← espacement interne (padding)
│  │  │    contenu      │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

| Couche | Propriété | Rôle |
|---|---|---|
| Contenu | `width`, `height` | Le texte, l'image... |
| Padding | `padding` | Espace **intérieur**, entre le contenu et la bordure |
| Bordure | `border` | Le trait autour |
| Marge | `margin` | Espace **extérieur**, entre cette boîte et les autres |

```css
.carte {
  padding: 1rem;      /* espace intérieur sur les 4 côtés */
  border: 1px solid #ddd;
  margin: 1rem;       /* espace extérieur sur les 4 côtés */
}
```

On peut cibler un seul côté : `padding-top`, `margin-bottom`, etc.

---

## 4.2 - L'astuce `box-sizing`

Par défaut, `padding` et `border` s'**ajoutent** à la largeur, ce qui complique les calculs. Cette règle, à mettre tout en haut du CSS, règle le problème une fois pour toutes :

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

> 💡 `border-box` fait que `width` inclut le padding et la bordure : bien plus intuitif. C'est une règle de départ standard sur presque tous les sites.

---

## 4.3 - Décorer les boîtes

```css
.carte {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;                        /* coins arrondis */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);   /* ombre douce */
}
```

- `border-radius` : arrondit les coins ;
- `box-shadow` : ombre portée (`décalage-x décalage-y flou couleur`).

---

## 4.4 - Centrer et limiter la largeur du contenu

Sur grand écran, un contenu pleine largeur est illisible. On limite la largeur et on centre :

```css
main {
  max-width: 960px;
  margin: 0 auto;   /* 0 en haut/bas, auto à gauche/droite = centré */
  padding: 1rem;
}
```

> 💡 `margin: 0 auto` est **la** technique pour centrer horizontalement un bloc de largeur limitée.

---

## 4.5 - Flexbox : aligner des éléments

Flexbox aligne des éléments sur une ligne (ou une colonne) facilement. On l'active avec `display: flex` sur le **conteneur** ; ses enfants directs deviennent des éléments flexibles.

### Aligner la navigation

```css
nav {
  display: flex;
  gap: 1.5rem;               /* espace entre les liens */
  justify-content: center;   /* alignement horizontal */
}
```

### Répartir l'en-tête (titre à gauche, menu à droite)

```css
header {
  display: flex;
  justify-content: space-between;  /* écarte les éléments aux extrémités */
  align-items: center;             /* centre verticalement */
  padding: 1rem 2rem;
}
```

Propriétés Flexbox les plus utiles (sur le conteneur) :

| Propriété | Effet |
|---|---|
| `display: flex` | Active Flexbox |
| `gap` | Espace entre les éléments |
| `justify-content` | Alignement sur l'axe principal (`center`, `space-between`...) |
| `align-items` | Alignement sur l'axe secondaire (`center`...) |
| `flex-direction` | `row` (défaut) ou `column` |
| `flex-wrap` | `wrap` pour passer à la ligne si ça déborde |

---

## 4.6 - Une galerie de cartes en Flexbox

```css
.galerie {
  display: flex;
  flex-wrap: wrap;      /* les cartes passent à la ligne si besoin */
  gap: 1rem;
}

.carte {
  flex: 1 1 250px;      /* base 250px, s'étirent pour remplir la ligne */
}
```

---

## Tâches du jour

### Tâche 4.1 - Réglages de départ

Ajoute la règle `* { box-sizing: border-box; margin: 0; padding: 0; }` en haut de ton CSS.

### Tâche 4.2 - Centrer le contenu

Limite `<main>` à `max-width` (ex : 960px) et centre-le avec `margin: 0 auto`.

### Tâche 4.3 - Styliser les cartes

Donne à `.carte` du `padding`, un `border-radius`, une `box-shadow` et une couleur de fond.

### Tâche 4.4 - En-tête en Flexbox

Passe le `<header>` en `display: flex` avec le titre à gauche et la navigation à droite (`justify-content: space-between`, `align-items: center`).

### Tâche 4.5 - Galerie en Flexbox

Entoure tes 3 cartes de projets d'un conteneur `class="galerie"` et applique Flexbox pour les afficher côte à côte, avec passage à la ligne (`flex-wrap: wrap`).

### Tâche 4.6 - Espacer les sections

Ajoute du `padding` vertical (`padding: 2rem 0`) sur tes sections pour les aérer.

### ⚡ Pour aller plus loin

Découvre **CSS Grid** pour la galerie : remplace le Flexbox de `.galerie` par
`display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;`
et compare le comportement.

---

## Livrable

- [ ] `box-sizing: border-box` est appliqué globalement
- [ ] Le contenu principal est centré et de largeur limitée
- [ ] Les cartes ont padding, coins arrondis et ombre
- [ ] L'en-tête est aligné avec Flexbox
- [ ] La galerie affiche les cartes côte à côte et passe à la ligne
- [ ] Les sections sont correctement espacées

➡️ **Demain (Jour 05)** : rendre le site adaptable au mobile, soigner l'accessibilité et le mettre en ligne.
