# Jour 03 - CSS fondamentaux

⏱ **Durée estimée : une journée**

## Objectifs

- Lier une feuille de style à la page
- Cibler des éléments avec les sélecteurs
- Styliser texte, couleurs et arrière-plans
- Utiliser des polices et des variables CSS

> 🎨 Aujourd'hui, *Ma Vitrine* passe du brut au stylé.

---

## 3.1 - Le rôle du CSS

**CSS** (Cascading Style Sheets) définit l'**apparence** : couleurs, tailles, espacements, polices, mise en page. Le HTML structure, le CSS met en forme.

---

## 3.2 - Lier le CSS au HTML

Crée un dossier `css/` et un fichier `css/style.css`. Puis, dans le `<head>` de `index.html` :

```html
<link rel="stylesheet" href="css/style.css">
```

Teste tout de suite avec une règle dans `style.css` :

```css
body {
  background-color: #f4f4f8;
}
```

Recharge : le fond de la page doit changer de couleur. Si oui, le CSS est bien lié.

---

## 3.3 - La syntaxe CSS

```css
h1 {
  color: blue;
  font-size: 2rem;
}
```

- `h1` : le **sélecteur** (quels éléments cibler) ;
- `{ }` : le bloc de déclarations ;
- `color`, `font-size` : les **propriétés** ;
- `blue`, `2rem` : les **valeurs**.

Chaque déclaration se termine par un `;`.

---

## 3.4 - Les sélecteurs essentiels

```css
/* Par balise : tous les <p> */
p {
  color: #333;
}

/* Par classe : les éléments class="carte" (le point) */
.carte {
  background-color: white;
}

/* Par id : l'élément id="contact" (le dièse) */
#contact {
  color: green;
}

/* Descendant : les <a> à l'intérieur d'un <nav> */
nav a {
  color: white;
}
```

| Sélecteur | Cible | Exemple |
|---|---|---|
| `balise` | Tous les éléments de ce type | `p` |
| `.classe` | Les éléments ayant cette classe | `.carte` |
| `#id` | L'élément unique avec cet id | `#contact` |
| `a b` | `b` à l'intérieur de `a` | `nav a` |

> 💡 On utilise surtout les **classes** : elles sont réutilisables sur plusieurs éléments. Les `id` servent plutôt pour les ancres de navigation.

---

## 3.5 - Couleurs et texte

```css
body {
  font-family: 'Segoe UI', Arial, sans-serif;  /* police */
  color: #333333;                               /* couleur du texte */
  line-height: 1.6;                             /* hauteur de ligne (lisibilité) */
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  text-align: center;
}
```

Trois façons d'écrire une couleur :

```css
color: red;                  /* nom */
color: #3498db;              /* hexadécimal */
color: rgb(52, 152, 219);    /* rouge, vert, bleu */
```

---

## 3.6 - Arrière-plans

```css
header {
  background-color: #2c3e50;
  color: white;
}
```

---

## 3.7 - Les variables CSS

Pour réutiliser tes couleurs sans les répéter, définis-les une fois dans `:root` :

```css
:root {
  --couleur-principale: #3498db;
  --couleur-texte: #333333;
}

h1 {
  color: var(--couleur-principale);
}

p {
  color: var(--couleur-texte);
}
```

> 💡 Changer une couleur du site devient trivial : tu modifies une seule ligne dans `:root`.

---

## 3.8 - Les pseudo-classes utiles

Elles ciblent un état d'un élément :

```css
/* Au survol de la souris */
a:hover {
  color: #e74c3c;
}

/* Un élément sur deux dans une liste */
li:nth-child(even) {
  background-color: #f0f0f0;
}
```

---

## Tâches du jour

### Tâche 3.1 - Lier le CSS

Crée `css/style.css`, lie-le, et vérifie avec une couleur de fond sur `body`.

### Tâche 3.2 - Palette et typographie

Dans `:root`, définis 2-3 variables de couleur. Applique une police lisible sur `body`, une couleur de texte, et `line-height: 1.6`.

### Tâche 3.3 - Styliser l'en-tête

Donne à `<header>` un fond coloré et du texte blanc. Centre le `<h1>`.

### Tâche 3.4 - Styliser la navigation

Colore les liens du `<nav>`, retire le soulignement (`text-decoration: none;`) et ajoute un effet au survol (`:hover`).

### Tâche 3.5 - Classes sur les cartes

Ajoute `class="carte"` à tes 3 blocs de projets dans le HTML, puis stylise `.carte` (fond blanc, couleur de texte).

### ⚡ Pour aller plus loin

Importe une police depuis Google Fonts (https://fonts.google.com) via un `<link>` dans le `<head>`, et applique-la à ton site.

---

## Livrable

- [ ] Le fichier CSS est lié et fonctionne
- [ ] J'utilise des variables CSS dans `:root`
- [ ] Le texte a une police, une couleur et une hauteur de ligne lisibles
- [ ] L'en-tête et la navigation sont stylisés
- [ ] Les liens ont un effet au survol (`:hover`)
- [ ] Mes cartes de projets utilisent une classe commune

➡️ **Demain (Jour 04)** : maîtriser les espacements avec le box model et organiser la page avec Flexbox.
