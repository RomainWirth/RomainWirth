# Jour 01 - HTML complet

⏱ **Durée estimée : une demi-journée à une journée**

## Objectifs

- Structure de base d'une page HTML
- Texte, listes, liens, images
- Balises sémantiques
- Formulaire de contact

> 🚀 En une journée, on pose **toute la structure** de *Ma Vitrine*. Le style viendra au jour 2.

---

## 1.1 - Le rôle du HTML

**HTML** décrit la **structure et le contenu** (titres, textes, liens, images), pas l'apparence (rôle du CSS, jour 2). Il fonctionne avec des **balises** entre chevrons : `<p>`, `<h1>`...

- **Balises paires** : `<p>Texte</p>` (ouverture + fermeture).
- **Balises orphelines** : `<img>`, `<br>`, `<meta>` (pas de fermeture).

---

## 1.2 - Structure de base

Crée un dossier `ma-vitrine/` avec un fichier `index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma Vitrine</title>
  </head>
  <body>
    <h1>Bonjour</h1>
    <p>Ma première page web.</p>
  </body>
</html>
```

| Élément | Rôle |
|---|---|
| `<!DOCTYPE html>` | Document HTML5 |
| `lang="fr"` | Langue de la page |
| `<meta charset="utf-8">` | Encodage (accents) |
| `<meta name="viewport">` | Affichage mobile correct (indispensable pour le responsive) |
| `<title>` | Titre de l'onglet |
| `<head>` / `<body>` | Métadonnées / contenu visible |

Ouvre la page dans le navigateur (idéalement avec **Live Server**).

---

## 1.3 - Texte et listes

```html
<h1>Titre principal</h1>   <!-- un seul par page -->
<h2>Sous-titre</h2>

<p>Un paragraphe avec un mot <strong>important</strong> et un mot <em>en emphase</em>.</p>

<ul>                        <!-- liste à puces -->
  <li>HTML</li>
  <li>CSS</li>
</ul>

<ol>                        <!-- liste numérotée -->
  <li>Étape 1</li>
  <li>Étape 2</li>
</ol>
```

> ⚠️ Un seul `<h1>` par page ; les autres niveaux (`<h2>`, `<h3>`) structurent hiérarchiquement.

---

## 1.4 - Liens et images

```html
<!-- Liens -->
<a href="https://github.com" target="_blank" rel="noopener">Mon GitHub</a>
<a href="#contact">Aller au contact</a>   <!-- vers un id de la page -->

<!-- Image (alt obligatoire) -->
<img src="images/photo.jpg" alt="Portrait de profil">
```

> ⚠️ L'attribut `alt` est **obligatoire** : décrit l'image (affiché si l'image ne charge pas, lu par les lecteurs d'écran). Crée un dossier `images/` pour tes fichiers.

---

## 1.5 - Balises sémantiques

On structure la page avec des balises qui décrivent le **rôle** de chaque zone (meilleur pour l'accessibilité et le référencement) :

```html
<body>
  <header>
    <h1>Mon site</h1>
    <nav>
      <a href="#apropos">À propos</a>
      <a href="#projets">Projets</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section id="apropos">
      <h2>À propos</h2>
      <p>...</p>
    </section>

    <section id="projets">
      <h2>Projets</h2>
      <!-- cartes de projets -->
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <!-- formulaire -->
    </section>
  </main>

  <footer>
    <p>© 2026 Mon nom</p>
  </footer>
</body>
```

| Balise | Rôle |
|---|---|
| `<header>` | En-tête (titre + navigation) |
| `<nav>` | Menu de navigation |
| `<main>` | Contenu principal (un seul par page) |
| `<section>` | Section thématique |
| `<footer>` | Pied de page |

---

## 1.6 - Le formulaire de contact

```html
<form>
  <label for="nom">Nom</label>
  <input type="text" id="nom" name="nom" required>

  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message</label>
  <textarea id="message" name="message" rows="5" required></textarea>

  <button type="submit">Envoyer</button>
</form>
```

- Chaque `<label>` est relié à son champ via `for="id"` ↔ `id="..."` (accessibilité).
- `type="email"` valide le format ; `required` rend le champ obligatoire.

> 💡 Sans JavaScript ni serveur, le formulaire ne « part » nulle part : on apprend ici à le **structurer**. Pour le rendre fonctionnel plus tard : un service comme Formspree.

---

## Tâches du jour

> Vérifie le résultat dans le navigateur à chaque étape.

### Tâche 1.1 - Structure & sémantique
Crée `ma-vitrine/index.html` avec la structure de base, puis organise le `<body>` avec `header`, `nav`, `main`, trois `<section>` (`#apropos`, `#projets`, `#contact`) et un `<footer>`.

### Tâche 1.2 - Contenu « À propos »
Dans la section « À propos » : un `<h2>`, deux paragraphes de présentation, une liste de ce que tu apprends, et une image (avec `alt`).

### Tâche 1.3 - Galerie de projets
Dans la section « Projets », ajoute 3 blocs, chacun avec un `<h3>`, un `<p>` et un lien `<a>`.

### Tâche 1.4 - Navigation & formulaire
Relie les liens du `<nav>` aux sections (`#apropos`...). Ajoute le formulaire de contact du 1.6 dans la section « Contact ».

### ⚡ Pour aller plus loin
Ajoute un lien `mailto:` dans le footer et un champ `<select>` (choix du sujet) dans le formulaire.

---

## Livrable

- [ ] La page utilise `header`, `nav`, `main`, `section`, `footer`
- [ ] Titres, paragraphes, au moins une liste et une image (avec `alt`)
- [ ] La navigation mène aux bonnes sections
- [ ] Une galerie de 3 projets est présente
- [ ] Un formulaire de contact structuré (labels reliés aux champs)

➡️ **Demain (Jour 02)** : donner du style avec le CSS et maîtriser le box model.
