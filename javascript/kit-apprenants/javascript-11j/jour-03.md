# Jour 03 - Les fonctions

⏱ **Durée estimée : une demi-journée à une journée**

## Objectifs pédagogiques

- Comprendre à quoi servent les fonctions
- Déclarer une fonction avec des paramètres et une valeur de retour
- Écrire des fonctions fléchées (arrow functions)
- Comprendre la portée des variables

---

## 3.1 - Pourquoi des fonctions ?

Une **fonction** est un bloc de code nommé qu'on peut réutiliser autant de fois qu'on veut. Elle évite de répéter le même code et rend le programme plus lisible.

```javascript
function direBonjour() {
  console.log('Bonjour !');
}

direBonjour(); // on "appelle" la fonction → affiche "Bonjour !"
direBonjour(); // on peut la rappeler autant de fois qu'on veut
```

---

## 3.2 - Paramètres et valeur de retour

Une fonction peut recevoir des **paramètres** (des données en entrée) et **retourner** un résultat avec `return`.

```javascript
function additionner(a, b) {
  return a + b;
}

const resultat = additionner(3, 5); // 8
console.log(resultat);
```

- `a` et `b` sont les **paramètres** (déclaration).
- `3` et `5` sont les **arguments** (à l'appel).
- `return` renvoie une valeur qu'on peut stocker dans une variable.

> 💡 Sans `return`, une fonction renvoie `undefined`. Une fois que `return` s'exécute, la fonction s'arrête immédiatement.

### Exemple utile pour le projet

```javascript
function decrirePersonnage(nom, niveau) {
  return `${nom} est au niveau ${niveau}`;
}

console.log(decrirePersonnage('Pikachu', 12)); // "Pikachu est au niveau 12"
```

---

## 3.3 - Les fonctions fléchées

Syntaxe plus courte, très utilisée en JavaScript moderne (et partout dans la partie API de ce kit) :

```javascript
// Fonction classique
function doubler(n) {
  return n * 2;
}

// Fonction fléchée équivalente
const doubler = (n) => {
  return n * 2;
};

// Version courte : si le corps tient en une ligne, on peut retirer { } et return
const doubler = (n) => n * 2;
```

```javascript
doubler(5); // 10
```

> 💡 Tu croiseras énormément les fonctions fléchées à partir du jour 4 (avec `map`, `filter`...) et dans toute la partie API. Habitue-toi à leur syntaxe dès maintenant.

---

## 3.4 - Paramètres par défaut

On peut donner une valeur par défaut à un paramètre s'il n'est pas fourni :

```javascript
function saluer(nom = 'inconnu') {
  return `Bonjour ${nom}`;
}

saluer('Sacha'); // "Bonjour Sacha"
saluer();        // "Bonjour inconnu"
```

---

## 3.5 - La portée des variables

Une variable déclarée **dans** une fonction n'existe que dans cette fonction :

```javascript
function calculer() {
  const secret = 42;
  return secret;
}

calculer();
console.log(secret); // ❌ erreur : secret n'existe pas ici
```

---

## Exercices

> 📝 Cherche par toi-même avant de consulter [les corrections](./corrections-fondamentaux.md).

### Exercice 3.1 - Carré

Écris une fonction `carre(n)` qui renvoie le carré d'un nombre. Teste-la avec plusieurs valeurs.

### Exercice 3.2 - Le plus grand

Écris une fonction `plusGrand(a, b)` qui renvoie le plus grand des deux nombres.

### Exercice 3.3 - Message de bienvenue

Écris une fonction `bienvenue(prenom)` qui renvoie la chaîne `Bienvenue <prenom> dans l'aventure !`. Utilise l'interpolation.

### Exercice 3.4 - Version fléchée

Réécris les fonctions des exercices 3.1 et 3.2 en **fonctions fléchées**.

### Exercice 3.5 - Est majeur

Écris une fonction `estMajeur(age)` qui renvoie `true` si l'âge est supérieur ou égal à 18, `false` sinon.

### ⚡ Pour aller plus loin

Écris une fonction `calculerDegats(attaque, defense)` qui renvoie `attaque - defense`, mais jamais moins de 0 (utilise une condition ou `Math.max`). Ajoute un paramètre par défaut `defense = 0`.

---

## Livrable

- [ ] Je sais déclarer une fonction avec `function`
- [ ] Je comprends la différence entre paramètre, argument et valeur de retour
- [ ] J'utilise `return` correctement
- [ ] Je sais écrire une fonction fléchée
- [ ] J'ai compris que les variables d'une fonction restent locales

➡️ **Demain (Jour 04)** : manipuler des listes de données avec les tableaux et leurs méthodes - la compétence clé pour la suite du projet.
