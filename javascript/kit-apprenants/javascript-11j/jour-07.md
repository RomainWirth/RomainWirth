# Jour 07 - Événements et interactivité

⏱ **Durée estimée : une journée**

## Objectifs pédagogiques

- Réagir aux actions de l'utilisateur avec `addEventListener`
- Gérer le clic sur un bouton
- Lire la valeur d'un champ de saisie
- Filtrer un affichage en direct selon la saisie

---

## 7.1 - Qu'est-ce qu'un événement ?

Un **événement** est une action de l'utilisateur (ou du navigateur) : un clic, une touche pressée, un texte saisi, la page chargée... JavaScript peut **écouter** ces événements et exécuter du code en réaction.

La méthode centrale est `addEventListener` :

```javascript
element.addEventListener('type-d-evenement', fonction);
```

---

## 7.2 - Réagir à un clic

Ajoute un bouton dans ton `index.html`, dans le `<main>` :

```html
<button id="bouton-test">Clique-moi</button>
```

Puis dans `app.js` :

```javascript
const bouton = document.querySelector('#bouton-test');

bouton.addEventListener('click', () => {
  console.log('Le bouton a été cliqué !');
});
```

À chaque clic, la fonction s'exécute. Cette fonction s'appelle un **gestionnaire d'événement** (ou *callback*).

Exemple concret - un compteur de clics :

```javascript
const bouton = document.querySelector('#bouton-test');
let compteur = 0;

bouton.addEventListener('click', () => {
  compteur++;
  bouton.textContent = `Cliqué ${compteur} fois`;
});
```

---

## 7.3 - Lire un champ de saisie

Ajoute un champ de recherche dans `index.html`, avant la galerie :

```html
<input type="text" id="recherche" placeholder="Rechercher...">
```

L'événement `input` se déclenche à **chaque frappe**. On lit le contenu du champ avec `.value` :

```javascript
const champ = document.querySelector('#recherche');

champ.addEventListener('input', () => {
  console.log('Texte saisi :', champ.value);
});
```

> 💡 `.value` renvoie toujours une **chaîne**. Pour comparer sans se soucier de la casse, on passe tout en minuscules avec `.toLowerCase()`.

---

## 7.4 - Filtrer un affichage en direct

Voici le principe qu'on réutilisera au jour 10 : à chaque frappe, on masque les cartes qui ne correspondent pas.

Suppose que chaque carte contienne le nom en `textContent`. On peut récupérer **toutes** les cartes avec `querySelectorAll` et les parcourir :

```javascript
const champ = document.querySelector('#recherche');

champ.addEventListener('input', () => {
  const texte = champ.value.toLowerCase();
  const cartes = document.querySelectorAll('.carte');

  cartes.forEach((carte) => {
    const nom = carte.textContent.toLowerCase();
    if (nom.includes(texte)) {
      carte.style.display = 'block';   // on montre
    } else {
      carte.style.display = 'none';    // on cache
    }
  });
});
```

> 💡 `querySelectorAll` renvoie une liste d'éléments qu'on parcourt avec `forEach`, exactement comme un tableau.

---

## 7.5 - Attendre le chargement de la page

Si ton `<script>` est dans le `<head>`, le JS peut s'exécuter **avant** que la page soit prête, et `querySelector` ne trouvera rien. Deux solutions :

- placer le `<script>` **juste avant** `</body>` (ce qu'on a fait au jour 6) ✅ ;
- ou envelopper le code dans :

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // ton code ici, exécuté une fois la page prête
});
```

---

## Tâches du jour

### Tâche 7.1 - Bouton compteur

Ajoute un bouton et fais-le afficher le nombre de fois qu'il a été cliqué (exemple du 7.2).

### Tâche 7.2 - Champ de recherche

Ajoute le champ `#recherche` et affiche dans la console, à chaque frappe, le texte saisi en minuscules.

### Tâche 7.3 - Filtrer les cartes

Reprends les cartes générées au jour 6 et branche la recherche du 7.4 : quand on tape dans le champ, seules les cartes dont le nom contient le texte restent visibles.

### Tâche 7.4 - Bouton « tout afficher »

Ajoute un bouton qui, au clic, réaffiche toutes les cartes (remet `display = 'block'` sur toutes) et vide le champ de recherche (`champ.value = ''`).

### ⚡ Pour aller plus loin

Affiche un compteur de résultats visibles (« 3 résultats ») qui se met à jour à chaque frappe. Indice : compte les cartes dont le nom correspond avant de les masquer/afficher.

---

## Livrable

- [ ] Je réagis à un clic avec `addEventListener('click', ...)`
- [ ] Je lis la valeur d'un champ avec `.value`
- [ ] Je réagis à la saisie avec l'événement `input`
- [ ] Je sélectionne plusieurs éléments avec `querySelectorAll` et les parcours
- [ ] Ma recherche filtre les cartes en direct

➡️ **Demain (Jour 08)** : arrêter d'écrire les données à la main et aller les chercher sur une vraie API avec `fetch`.
