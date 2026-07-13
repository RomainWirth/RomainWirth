# Jour 01 - Première page HTML

⏱ **Durée estimée : une demi-journée**

## Objectifs

- Comprendre le rôle du HTML
- Créer et ouvrir une page HTML
- Écrire la structure de base d'un document
- Utiliser les balises de texte et de listes

> 🚀 Aujourd'hui, on pose la première pierre du projet *Ma Vitrine*.

---

## 1.1 - À quoi sert le HTML ?

**HTML** (HyperText Markup Language) décrit la **structure et le contenu** d'une page : titres, paragraphes, liens, images, sections. Il ne s'occupe pas de l'apparence (couleurs, mise en page) - c'est le rôle du CSS, qu'on verra au jour 3.

Le HTML fonctionne avec des **balises** entre chevrons : `<p>`, `<h1>`, etc.

---

## 1.2 - Mettre en place le projet

Crée un dossier `ma-vitrine/` et, à l'intérieur, un fichier `index.html`.

> 💡 `index.html` est le nom conventionnel de la page d'accueil d'un site : le navigateur l'ouvre par défaut.

Ouvre le dossier dans VS Code. Si tu as installé **Live Server**, tu pourras faire un clic droit sur `index.html` → « Open with Live Server ».

---

## 1.3 - La structure de base

Tout document HTML suit ce squelette. Tape-le (ne le copie-colle pas, c'est plus formateur) :

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

À quoi servent ces lignes :

| Ligne | Rôle |
|---|---|
| `<!DOCTYPE html>` | Indique que c'est du HTML5 |
| `<html lang="fr">` | Racine du document, langue française |
| `<meta charset="utf-8">` | Encodage (gère les accents) |
| `<meta name="viewport">` | Affichage correct sur mobile |
| `<title>` | Titre affiché dans l'onglet du navigateur |
| `<head>` | Informations sur la page (pas visibles) |
| `<body>` | Contenu visible de la page |

Ouvre la page : tu dois voir « Bonjour » et « Ma première page web. ».

---

## 1.4 - Balises paires et orphelines

- **Balises paires** : une ouverture et une fermeture. `<p>Texte</p>`
- **Balises orphelines** : pas de fermeture. `<br>`, `<img>`, `<meta>`

---

## 1.5 - Organiser le texte

### Titres

Six niveaux, de `<h1>` (le plus important) à `<h6>` :

```html
<h1>Titre principal</h1>
<h2>Sous-titre</h2>
<h3>Sous-sous-titre</h3>
```

> ⚠️ **Un seul `<h1>` par page** en général : c'est le titre principal. Les autres niveaux structurent le reste de façon hiérarchique.

### Paragraphes et retour à la ligne

```html
<p>Un paragraphe de texte.</p>
<p>Un autre paragraphe.<br>Avec un retour à la ligne.</p>
```

### Mise en valeur

```html
<p>Un mot <strong>important</strong> et un mot <em>en emphase</em>.</p>
```

- `<strong>` : importance forte (gras par défaut)
- `<em>` : emphase (italique par défaut)

### Listes

```html
<!-- Liste à puces -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

<!-- Liste numérotée -->
<ol>
  <li>Étape 1</li>
  <li>Étape 2</li>
</ol>
```

---

## Tâches du jour

> On démarre *Ma Vitrine*. Vérifie le résultat dans le navigateur à chaque étape.

### Tâche 1.1 - Structure

Crée `ma-vitrine/index.html` avec la structure de base du 1.3. Mets ton nom (ou celui de ton site) dans le `<title>`.

### Tâche 1.2 - Titre et présentation

Dans le `<body>`, remplace le contenu par :
- un `<h1>` avec ton nom ou le nom du site ;
- un `<p>` d'une phrase qui te présente (« Développeur·se web en formation », par exemple).

### Tâche 1.3 - Une petite section « À propos »

Ajoute sous le paragraphe :
- un `<h2>` « À propos » ;
- deux `<p>` qui te décrivent (parcours, ce que tu aimes...).

### Tâche 1.4 - Une liste

Ajoute :
- un `<h2>` « Ce que j'apprends » ;
- une liste à puces (`<ul>`) d'au moins 3 éléments (HTML, CSS...).

### ⚡ Pour aller plus loin

Ajoute une **liste numérotée** « Mes objectifs » avec 3 étapes, et utilise `<strong>` pour mettre un mot en valeur dans un de tes paragraphes.

---

## Livrable

- [ ] `ma-vitrine/index.html` existe et s'ouvre dans le navigateur
- [ ] La structure de base est correcte (`head`, `body`, métadonnées)
- [ ] La page a un `<h1>`, des `<h2>`, des paragraphes
- [ ] Au moins une liste (`<ul>` ou `<ol>`) est présente
- [ ] Le titre de l'onglet affiche le nom de mon site

➡️ **Demain (Jour 02)** : ajouter des liens, des images, une vraie structure sémantique et un formulaire de contact.
