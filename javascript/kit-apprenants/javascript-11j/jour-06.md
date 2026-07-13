# Jour 06 - Découverte du DOM

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Comprendre ce qu'est le DOM
- Mettre en place le projet *Explorateur* (HTML + CSS + JS)
- Sélectionner des éléments de la page
- Modifier et créer des éléments depuis JavaScript

> 🚀 **Début du projet fil rouge.** À partir d'aujourd'hui, on construit l'application *Explorateur*. On travaille dans de vrais fichiers, plus seulement dans la console.

---

## 6.1 - Qu'est-ce que le DOM ?

Quand le navigateur charge une page HTML, il en construit une représentation en mémoire : le **DOM** (Document Object Model). C'est un arbre d'objets qui représente chaque balise de la page.

JavaScript peut **lire et modifier** ce DOM pour changer la page en direct : ajouter du texte, créer des éléments, changer des styles... sans recharger la page.

L'objet de départ s'appelle `document`.

---

## 6.2 - Mettre en place le projet

Crée un dossier `explorateur/` avec trois fichiers :

**`index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Explorateur</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Explorateur</h1>
  </header>

  <main>
    <p id="message">Chargement...</p>
    <div id="galerie"></div>
  </main>

  <script src="app.js"></script>
</body>
</html>
```

**`style.css`** (un point de départ minimal)

```css
body {
  font-family: sans-serif;
  margin: 0;
  padding: 1rem;
  background: #f4f4f8;
}

#galerie {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.carte {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.carte img {
  width: 100%;
  height: auto;
}
```

**`app.js`**

```javascript
console.log('app.js est bien chargé');
```

Ouvre `index.html` dans ton navigateur, puis la console (`F12`). Tu dois voir le message `app.js est bien chargé`.

> 💡 **Astuce VS Code** : installe l'extension **Live Server** et clique sur « Go Live » pour recharger automatiquement la page à chaque modification.

---

## 6.3 - Sélectionner des éléments

Pour agir sur un élément, il faut d'abord le **sélectionner**. La méthode la plus polyvalente est `querySelector`, qui prend un **sélecteur CSS** :

```javascript
// Par id (le # comme en CSS)
const message = document.querySelector('#message');

// Par balise
const titre = document.querySelector('h1');

// Par classe (le . comme en CSS)
const premiereCarte = document.querySelector('.carte');
```

`querySelector` renvoie **le premier** élément trouvé. Pour en récupérer **plusieurs**, on utilise `querySelectorAll` (on y reviendra).

---

## 6.4 - Modifier un élément

Une fois l'élément sélectionné, on peut le modifier :

```javascript
const message = document.querySelector('#message');

message.textContent = 'Bonjour !';          // change le texte
message.style.color = 'purple';              // change un style
message.classList.add('important');          // ajoute une classe CSS
```

| Propriété / méthode | Effet |
|---|---|
| `element.textContent` | Lit ou change le texte |
| `element.innerHTML` | Lit ou change le HTML interne |
| `element.style.xxx` | Change un style en ligne |
| `element.classList.add('x')` | Ajoute une classe |
| `element.classList.remove('x')` | Retire une classe |
| `element.classList.toggle('x')` | Ajoute/retire selon présence |

> ⚠️ Préfère `textContent` à `innerHTML` quand tu insères du **texte** : c'est plus sûr. On utilisera `innerHTML` seulement pour insérer du HTML qu'on maîtrise.

---

## 6.5 - Créer et ajouter des éléments

Pour ajouter du contenu, on **crée** un élément, on le remplit, puis on l'**attache** à la page :

```javascript
const galerie = document.querySelector('#galerie');

// 1. Créer un élément
const carte = document.createElement('div');

// 2. Le configurer
carte.classList.add('carte');
carte.textContent = 'Pikachu';

// 3. L'ajouter dans la galerie
galerie.appendChild(carte);
```

En combinant avec une boucle, on peut générer plusieurs éléments d'un coup :

```javascript
const noms = ['Pikachu', 'Salamèche', 'Carapuce'];
const galerie = document.querySelector('#galerie');

noms.forEach((nom) => {
  const carte = document.createElement('div');
  carte.classList.add('carte');
  carte.textContent = nom;
  galerie.appendChild(carte);
});
```

> 💡 **Tu tiens le principe du projet.** Au jour 9, on remplacera ce tableau de noms écrit à la main par les vraies données de l'API - mais la logique de création de cartes sera la même.

---

## Tâches du jour

> Ces tâches construisent réellement ton projet. Pas de fichier de corrections ici : c'est ton application.

### Tâche 6.1 - Mise en place

Crée les trois fichiers (`index.html`, `style.css`, `app.js`) et vérifie que le message de la console s'affiche.

### Tâche 6.2 - Modifier le message

Depuis `app.js`, sélectionne le paragraphe `#message` et remplace son texte par `Bienvenue dans l'Explorateur`.

### Tâche 6.3 - Générer des cartes

Dans `app.js`, crée un tableau d'au moins 4 noms de ton choix, puis génère une carte par nom dans `#galerie` (avec une boucle `forEach`, comme dans l'exemple ci-dessus).

### Tâche 6.4 - Enrichir une carte

Modifie ta boucle pour que chaque carte contienne un titre (`<h3>`) avec le nom. (Indice : crée un `h3` avec `createElement`, mets le nom dans son `textContent`, et ajoute-le à la carte avec `appendChild` avant d'ajouter la carte à la galerie.)

### ⚡ Pour aller plus loin

Fais en sorte qu'une carte sur deux ait une couleur de fond différente (indice : `index % 2 === 0` dans un `forEach` avec index, puis `classList.add`).

---

## Livrable

- [ ] Le projet *Explorateur* est en place (3 fichiers, page qui s'ouvre)
- [ ] Je sais sélectionner un élément avec `querySelector`
- [ ] Je modifie le texte et les classes d'un élément
- [ ] Je crée des éléments avec `createElement` et `appendChild`
- [ ] Je génère plusieurs cartes à partir d'un tableau

➡️ **Demain (Jour 07)** : rendre la page interactive en réagissant aux clics et à la saisie de l'utilisateur.
