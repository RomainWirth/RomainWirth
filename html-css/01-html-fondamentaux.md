# HTML - fondamentaux

## Objectifs du chapitre

A la fin de ce chapitre, tu dois savoir :

- expliquer le role du HTML ;
- ecrire la structure de base d'une page ;
- utiliser les balises les plus courantes ;
- creer des liens, listes et images ;
- structurer une page avec des balises semantiques.

## Prerequis

- savoir creer un fichier texte ;
- utiliser un editeur de code ;
- ouvrir un fichier dans un navigateur.

## Le role du HTML

HTML signifie HyperText Markup Language.

Son role est de decrire la structure et le contenu d'une page :

- titres ;
- paragraphes ;
- liens ;
- images ;
- sections de contenu.

Le HTML ne sert pas a faire le style visuel detaille. Cette partie est geree par le CSS.

## Structure minimale d'un document HTML

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre de la page</title>
  </head>
  <body>
    <h1>Bonjour</h1>
    <p>Ma premiere page HTML.</p>
  </body>
</html>
```

Points importants :

- `<!DOCTYPE html>` : indique un document HTML5 ;
- `<html lang="fr">` : langue principale ;
- `<meta charset="utf-8">` : encodage ;
- `<meta name="viewport">` : affichage mobile correct ;
- `<title>` : titre de l'onglet et des resultats de recherche.

## Balises paires et balises orphelines

### Balises paires

Elles ont une ouverture et une fermeture.

Exemple :

```html
<p>Texte du paragraphe</p>
```

### Balises orphelines

Elles n'ont pas de balise fermante.

Exemples :

- `<br>`
- `<img>`
- `<meta>`

## Attributs

Les attributs ajoutent des informations a une balise.

Exemple :

```html
<img src="images/logo.png" alt="Logo du site" title="Accueil">
```

Attributs utiles a connaitre :

- `href` pour les liens ;
- `src` pour les ressources ;
- `alt` pour la description d'image ;
- `id` pour un identifiant unique ;
- `class` pour regrouper des elements ;
- `title` pour une infobulle.

## Organiser le texte

### Titres

```html
<h1>Titre principal</h1>
<h2>Sous-titre</h2>
```

Regle importante : un seul `h1` principal par page en general.

### Paragraphes et retour a la ligne

```html
<p>Premier paragraphe.</p>
<p>Deuxieme paragraphe.<br>Ligne suivante.</p>
```

### Listes

```html
<ul>
  <li>Fraises</li>
  <li>Framboises</li>
</ul>

<ol>
  <li>Etape 1</li>
  <li>Etape 2</li>
</ol>
```

### Mettre en valeur du texte

- `<strong>` pour une importance forte ;
- `<em>` pour une emphase ;
- `<mark>` pour surligner.

## Liens hypertextes

### Lien vers une page

```html
<a href="https://developer.mozilla.org">MDN</a>
```

### Lien vers une autre page du site

```html
<a href="contact.html">Contact</a>
```

### Ancre dans la meme page

```html
<a href="#faq">Aller a la FAQ</a>
<h2 id="faq">FAQ</h2>
```

## Images

```html
<img src="images/montagne.jpg" alt="Chemin de randonnee en montagne">
```

Bonnes pratiques :

- toujours renseigner `alt` ;
- utiliser des noms de fichiers simples (minuscules, tirets) ;
- choisir un format adapte :
  - JPEG pour photos ;
  - PNG pour transparence ;
  - SVG pour logos vectoriels ;
  - WebP pour bon compromis qualite/poids.

## Structurer une page avec des balises semantiques

Exemple de squelette :

```html
<body>
  <header>
    <nav></nav>
  </header>

  <main>
    <section>
      <h1>Titre principal</h1>
      <article>Contenu principal</article>
    </section>

    <aside>Infos complementaires</aside>
  </main>

  <footer></footer>
</body>
```

Role des balises :

- `header` : en-tete ;
- `nav` : navigation ;
- `main` : contenu principal ;
- `section` : bloc thematique ;
- `article` : contenu autonome ;
- `aside` : contenu secondaire ;
- `footer` : pied de page.

## Bonnes pratiques HTML

- respecter l'indentation ;
- garder des titres dans l'ordre logique ;
- privilegier les balises semantiques ;
- eviter de multiplier les `div` inutiles ;
- commenter avec moderation quand c'est utile.

## Mini-exercices corriges

### Exercice 1

Question : ecris une page minimale avec un titre principal et un paragraphe.

Correction :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Exercice</title>
  </head>
  <body>
    <h1>Bienvenue</h1>
    <p>Mon premier exercice HTML.</p>
  </body>
</html>
```

### Exercice 2

Question : cree une liste ordonnee de 3 etapes.

Correction :

```html
<ol>
  <li>Installer un editeur</li>
  <li>Creer un fichier index.html</li>
  <li>Ouvrir dans le navigateur</li>
</ol>
```

### Exercice 3

Question : ajoute une image accessible.

Correction :

```html
<img src="images/chat.jpg" alt="Chat assis sur un canapé">
```
