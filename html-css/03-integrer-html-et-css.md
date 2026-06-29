# Integrer HTML et CSS

## Objectifs du chapitre

A la fin de ce chapitre, tu dois savoir :

- organiser un mini-projet HTML/CSS ;
- lier correctement les fichiers ;
- appliquer une methode de travail propre ;
- verifier accessibilite et compatibilite de base.

## Prerequis

- bases HTML ;
- bases CSS ;
- savoir creer des dossiers et fichiers.

## Arborescence recommandee

```text
mon-projet/
  index.html
  css/
    style.css
  images/
    logo.svg
```

## Exemple complet minimal

### index.html

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini projet</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    <header class="site-header">
      <h1>Mon site</h1>
      <nav>
        <a href="#presentation">Presentation</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>

    <main>
      <section id="presentation" class="card">
        <h2>Presentation</h2>
        <p>Une page simple pour relier HTML et CSS proprement.</p>
      </section>

      <section id="contact" class="card">
        <h2>Contact</h2>
        <p>Email : contact@example.com</p>
      </section>
    </main>

    <footer>
      <p>2026 - Mon site</p>
    </footer>
  </body>
</html>
```

### css/style.css

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f8fafc;
  color: #1f2937;
}

.site-header {
  background: #0f172a;
  color: #fff;
  padding: 1rem;
}

.site-header a {
  color: #93c5fd;
  margin-right: 1rem;
  text-decoration: none;
}

.site-header a:hover {
  text-decoration: underline;
}

main {
  max-width: 900px;
  margin: 1.5rem auto;
  padding: 0 1rem;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

footer {
  text-align: center;
  padding: 1rem;
  color: #6b7280;
}
```

## Methode de travail conseillee

1. Ecrire d'abord une structure HTML simple.
2. Verifier le sens semantique des balises.
3. Ajouter les classes utiles.
4. Appliquer un style CSS par blocs.
5. Tester sur desktop et mobile.
6. Corriger avant d'ajouter des effets avances.

## Erreurs frequentes a eviter

- styliser avec trop d'ids ;
- oublier le `viewport` ;
- utiliser des noms de classes flous ;
- melanger contenu et presentation ;
- ne pas verifier l'accessibilite de base.

## Accessibilite minimale

- texte alternatif sur les images ;
- contraste suffisant ;
- hierarchie de titres logique ;
- focus visible au clavier ;
- liens explicites.

## Compatibilite navigateur

Pour verifier une propriete CSS, consulter :

- https://caniuse.com/

## Mini-projet guide

Objectif : realiser une page de profil avec :

- un header ;
- une section presentation ;
- une section competences en liste ;
- un footer.

Checklist de validation :

- HTML valide et indente ;
- classes lisibles ;
- style coherent ;
- page lisible sur mobile.

## Mini-exercices corriges

### Exercice 1

Question : quel chemin faut-il mettre dans `href` si le CSS est dans un dossier `css` ?

Correction :

```html
<link rel="stylesheet" href="css/style.css">
```

### Exercice 2

Question : comment centrer un bloc de largeur fixe ?

Correction :

```css
.bloc {
  width: 800px;
  margin: 0 auto;
}
```

### Exercice 3

Question : donne un exemple de verification accessibilite rapide.

Correction : verifier qu'une image informative possede un `alt` descriptif et qu'un lien au clavier garde un focus visible.
