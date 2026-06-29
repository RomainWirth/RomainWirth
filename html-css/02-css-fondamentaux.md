# CSS - fondamentaux

## Objectifs du chapitre

A la fin de ce chapitre, tu dois savoir :

- lier un fichier CSS a une page HTML ;
- cibler des elements avec des selecteurs ;
- styliser texte, couleurs, fonds et bordures ;
- comprendre le box model ;
- utiliser les pseudo-classes les plus utiles.

## Prerequis

- avoir les bases HTML ;
- savoir utiliser `class` et `id` ;
- avoir un fichier HTML de test.

## Role du CSS

CSS signifie Cascading Style Sheets.

Son role est de definir l'apparence :

- couleurs ;
- tailles ;
- espacements ;
- bordures ;
- alignements ;
- mise en page.

HTML structure, CSS met en forme.

## Lier CSS au HTML

Dans le `head` de la page HTML :

```html
<link rel="stylesheet" href="style.css">
```

## Syntaxe CSS de base

```css
h1 {
  color: blue;
  font-size: 2rem;
}
```

Elements de syntaxe :

- selecteur ;
- accolades ;
- proprietes ;
- valeurs.

## Selecteurs essentiels

### Selecteur de balise

```css
p {
  color: #333;
}
```

### Selecteur de classe

```css
.message {
  color: green;
}
```

### Selecteur d'identifiant

```css
#hero {
  background-color: #f5f5f5;
}
```

### Plusieurs selecteurs

```css
h1, h2, h3 {
  font-family: Arial, sans-serif;
}
```

### Selecteurs utiles supplementaires

```css
article p {
  line-height: 1.6;
}

h2 + p {
  margin-top: 0;
}

a[title] {
  text-decoration: underline;
}
```

## Styliser le texte

```css
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #222;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

em {
  font-style: italic;
}
```

Unites recommand ees :

- `rem` pour les tailles globales ;
- `em` pour des ajustements locaux ;
- `%` pour certaines largeurs.

## Couleurs et fonds

```css
h1 {
  color: #1f3a8a;
}

.card {
  background-color: #f8fafc;
}

.hero {
  background: linear-gradient(90deg, #0ea5e9, #22c55e);
}
```

## Bordures, coins et ombres

```css
.card {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

## Box model

Chaque element est une boite :

- contenu ;
- padding ;
- bordure ;
- margin.

```css
.box {
  width: 300px;
  padding: 16px;
  border: 1px solid #ccc;
  margin: 20px auto;
}
```

Conseil pratique :

```css
* {
  box-sizing: border-box;
}
```

## Pseudo-classes frequentes

```css
a:hover {
  color: #2563eb;
}

a:active {
  color: #1d4ed8;
}

input:focus {
  outline: 2px solid #2563eb;
}

a:visited {
  color: #7c3aed;
}
```

## Bonnes pratiques CSS

- nommer les classes clairement ;
- eviter les ids pour le style si une classe suffit ;
- regrouper les styles lies ;
- limiter les selecteurs trop complexes ;
- verifier le rendu sur mobile et desktop.

## Mini-exercices corriges

### Exercice 1

Question : colorer tous les paragraphes en gris fonce.

Correction :

```css
p {
  color: #444;
}
```

### Exercice 2

Question : appliquer un fond clair et des coins arrondis a une carte.

Correction :

```css
.carte {
  background-color: #f3f4f6;
  border-radius: 10px;
}
```

### Exercice 3

Question : changer la couleur d'un lien au survol.

Correction :

```css
a:hover {
  color: #0ea5e9;
}
```
