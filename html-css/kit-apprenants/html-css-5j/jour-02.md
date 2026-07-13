# Jour 02 - Contenu, sémantique & formulaire

⏱ **Durée estimée : une journée**

## Objectifs

- Créer des liens et insérer des images
- Structurer la page avec les balises sémantiques
- Construire un formulaire de contact
- Comprendre l'importance de l'accessibilité de base

---

## 2.1 - Les liens

La balise `<a>` (ancre) crée un lien. L'attribut `href` indique la destination :

```html
<!-- Lien vers un autre site -->
<a href="https://developer.mozilla.org">Documentation MDN</a>

<!-- Lien vers une section de la même page (ancre interne) -->
<a href="#contact">Aller au contact</a>

<!-- Lien qui ouvre un nouvel onglet -->
<a href="https://github.com" target="_blank" rel="noopener">Mon GitHub</a>
```

> 💡 Un lien interne (`#contact`) pointe vers un élément qui a l'`id` correspondant (`<section id="contact">`). On s'en servira pour la navigation du site.

---

## 2.2 - Les images

La balise `<img>` (orpheline) insère une image :

```html
<img src="images/photo.jpg" alt="Portrait de profil">
```

- `src` : chemin vers le fichier image ;
- `alt` : **description textuelle** de l'image.

> ⚠️ L'attribut `alt` est **obligatoire** : il s'affiche si l'image ne charge pas, et il est lu par les lecteurs d'écran (accessibilité). Décris ce que montre l'image.

Crée un dossier `images/` dans ton projet et places-y une image (une photo, ou une image libre de droits depuis https://unsplash.com).

---

## 2.3 - Les balises sémantiques

Plutôt que d'empiler des `<div>` sans signification, on utilise des balises qui **décrivent le rôle** de chaque zone. C'est meilleur pour l'accessibilité et le référencement.

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
      <p>...</p>
    </section>

    <section id="contact">
      <h2>Contact</h2>
      <p>...</p>
    </section>
  </main>

  <footer>
    <p>© 2026 Mon nom</p>
  </footer>
</body>
```

| Balise | Rôle |
|---|---|
| `<header>` | En-tête de la page (titre, navigation) |
| `<nav>` | Menu de navigation |
| `<main>` | Contenu principal (un seul par page) |
| `<section>` | Une section thématique de contenu |
| `<article>` | Un contenu autonome (article, carte...) |
| `<footer>` | Pied de page |

---

## 2.4 - Le formulaire de contact

Un formulaire regroupe des champs de saisie dans une balise `<form>` :

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

Points clés :

- Chaque `<label>` est relié à son champ via `for="id"` ↔ `id="..."`. Cliquer sur le label active le champ (accessibilité).
- `type="email"` vérifie le format de l'email ; `type="text"` pour du texte libre.
- `<textarea>` pour un message multiligne.
- `required` rend le champ obligatoire.
- `<button type="submit">` envoie le formulaire.

> 💡 Sans JavaScript ni serveur, ce formulaire ne « part » nulle part pour l'instant. On apprend ici à le **structurer** correctement. Pour le rendre fonctionnel plus tard, on utiliserait un service comme Formspree, ou du code côté serveur.

---

## Tâches du jour

### Tâche 2.1 - Passer en structure sémantique

Réorganise ton `index.html` d'hier avec `<header>`, `<nav>`, `<main>`, plusieurs `<section>` (avec des `id`) et un `<footer>`.

### Tâche 2.2 - Navigation

Dans le `<nav>`, ajoute des liens vers chaque section (`#apropos`, `#projets`, `#contact`). Clique dessus : la page doit défiler vers la bonne section.

### Tâche 2.3 - Une image

Ajoute une image dans ta section « À propos » (avec un `alt` descriptif). Vérifie qu'elle s'affiche.

### Tâche 2.4 - Section « Projets »

Crée une section « Projets » avec 3 blocs, chacun contenant un `<h3>` (titre du projet), un `<p>` (description) et un lien `<a>` (vers un projet ou un site).

### Tâche 2.5 - Formulaire de contact

Dans la section « Contact », ajoute le formulaire du 2.4 (nom, email, message, bouton). Vérifie que cliquer sur un label active bien le champ correspondant.

### ⚡ Pour aller plus loin

Ajoute un lien `mailto:` dans le footer (`<a href="mailto:ton@email.fr">Écris-moi</a>`) et un champ `<select>` dans le formulaire pour choisir un sujet.

---

## Livrable

- [ ] La page utilise `header`, `nav`, `main`, `section`, `footer`
- [ ] La navigation mène aux bonnes sections via les ancres
- [ ] Au moins une image avec un `alt` descriptif s'affiche
- [ ] Une section « Projets » présente 3 blocs
- [ ] Un formulaire de contact structuré (labels reliés aux champs) est présent

➡️ **Demain (Jour 03)** : donner du style à tout ça avec le CSS.
