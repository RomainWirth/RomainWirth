# Jour 03 - DOM & interactivité

⏱ **Durée estimée : une journée**

## Objectifs

- Mettre en place le projet *Explorateur*
- Sélectionner, modifier et créer des éléments
- Réagir aux événements (clic, saisie)

> 🚀 Début du projet fil rouge. On quitte la console pour de vrais fichiers.

---

## 3.1 - Le DOM en bref

Quand le navigateur charge une page, il en crée une représentation objet manipulable en JS : le **DOM**. Point d'entrée : `document`.

---

## 3.2 - Mise en place

Crée un dossier `explorateur/` avec 3 fichiers.

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
  <header><h1>Explorateur</h1></header>
  <main>
    <input type="text" id="recherche" placeholder="Rechercher...">
    <p id="message">Chargement...</p>
    <div id="galerie"></div>
  </main>
  <script src="app.js"></script>
</body>
</html>
```

**`style.css`**

```css
body { font-family: sans-serif; margin: 0; padding: 1rem; background: #f4f4f8; }
#galerie {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}
.carte {
  background: #fff; border-radius: 12px; padding: 1rem; text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1); cursor: pointer;
}
.carte img { width: 100%; height: auto; }
.cache { display: none; }
```

**`app.js`**

```javascript
console.log('app.js chargé');
```

Ouvre `index.html` (idéalement avec l'extension **Live Server** de VS Code) et vérifie le message dans la console.

---

## 3.3 - Sélectionner et modifier

```javascript
const message = document.querySelector('#message'); // sélecteur CSS (#id, .classe, balise)

message.textContent = 'Bienvenue';        // change le texte
message.style.color = 'purple';           // style
message.classList.add('important');       // classe CSS
```

| Méthode | Effet |
|---|---|
| `querySelector('#id')` | Premier élément correspondant |
| `querySelectorAll('.x')` | Tous les éléments (à parcourir avec `forEach`) |
| `.textContent` | Lire/écrire le texte |
| `.innerHTML` | Lire/écrire le HTML interne |
| `.classList.add/remove/toggle` | Gérer les classes |

> ⚠️ Préfère `textContent` pour du texte ; réserve `innerHTML` au HTML que tu maîtrises.

---

## 3.4 - Créer des éléments

```javascript
const galerie = document.querySelector('#galerie');

const noms = ['Pikachu', 'Salamèche', 'Carapuce'];

noms.forEach((nom) => {
  const carte = document.createElement('div');  // créer
  carte.classList.add('carte');
  carte.textContent = nom;                       // configurer
  galerie.appendChild(carte);                    // attacher
});
```

> 💡 C'est le principe du projet : au jour 4, ce tableau de noms écrit à la main sera remplacé par les données de l'API.

---

## 3.5 - Événements

```javascript
// Clic
const bouton = document.querySelector('#bouton');
bouton.addEventListener('click', () => console.log('cliqué'));

// Saisie (à chaque frappe)
const champ = document.querySelector('#recherche');
champ.addEventListener('input', () => {
  console.log(champ.value.toLowerCase()); // .value = contenu du champ
});
```

---

## Tâches du jour

> Pas de corrections : c'est ton application.

### 3.1 - Mise en place
Crée les 3 fichiers, vérifie le message console.

### 3.2 - Générer des cartes
Depuis `app.js`, génère une carte par nom d'un tableau (avec un `<h3>` pour le nom).

### 3.3 - Recherche en direct
Branche `#recherche` : à chaque frappe, masque les cartes dont le nom ne contient pas le texte saisi.

```javascript
champ.addEventListener('input', () => {
  const texte = champ.value.toLowerCase();
  document.querySelectorAll('.carte').forEach((carte) => {
    const ok = carte.textContent.toLowerCase().includes(texte);
    carte.style.display = ok ? 'block' : 'none';
  });
});
```

### ⚡ Pour aller plus loin
Affiche un compteur « X résultats » qui se met à jour à chaque frappe.

---

## Livrable

- [ ] Le projet *Explorateur* est en place
- [ ] Je sélectionne et modifie des éléments
- [ ] Je crée des cartes avec `createElement` + `appendChild`
- [ ] Je réagis au clic et à la saisie
- [ ] Ma recherche filtre les cartes en direct

➡️ **Jour 04** : remplacer les données écrites à la main par une vraie API.
