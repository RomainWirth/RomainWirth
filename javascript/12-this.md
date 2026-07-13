# Module 12 - Le mot-clé `this`

## Qu'est-ce que `this` ?

`this` est un opérateur qui retourne une valeur : l'objet représentant le **contexte d'exécution** du code courant. Sa valeur est déterminée par la façon dont une fonction est appelée, pas par l'endroit où elle est déclarée.

## `this` dans le contexte global

```javascript
// Dans un navigateur
console.log(this === window); // true
this.a = 37;
console.log(window.a); // 37
```

## `this` dans une fonction classique

La valeur de `this` dépend du mode d'appel :

```javascript
function f1() {
  return this;
}
f1() === window; // true en navigateur (objet global)

function f2() {
  "use strict";
  return this;
}
f2() === undefined; // true (mode strict)
```

## `this` dans une méthode d'objet

`this` est substitué par l'objet qui appelle la méthode :

```javascript
let feuille = {
    nom: 'Ciseaux',
    prenom: 'Pierre',
    getFullName() {
        console.log(this.prenom + ' ' + this.nom);
    }
};

feuille.getFullName(); // "Pierre Ciseaux"
```

La même fonction peut être réutilisée par différents objets :

```javascript
let pierre = { name: 'Pierre' };
let mathilde = { name: 'Mathilde' };

function disBonjour() {
  alert('Bonjour ' + this.name);
}

pierre.bonjour = disBonjour;
mathilde.bonjour = disBonjour;

pierre.bonjour();   // "Bonjour Pierre"
mathilde.bonjour(); // "Bonjour Mathilde"
```

## `this` et les fonctions fléchées

Les fonctions fléchées **n'ont pas de `this` propre** : elles utilisent celui du contexte englobant. C'est pourquoi elles sont très utilisées comme callbacks à l'intérieur des méthodes d'objet ou de classe.

```javascript
let feuille = {
    prenom: 'Pierre',
    disBonjour() {
        const bonjour = () => console.log('Bonjour ' + this.prenom);
        bonjour(); // hérite du this de disBonjour → "Pierre"
    }
};

feuille.disBonjour(); // "Bonjour Pierre"
```

Si on avait utilisé une fonction classique à la place de la fléchée, `this` aurait été `undefined` (en strict) ou `window` (hors strict), et non `feuille`.

## Le piège classique : `this` dans les callbacks

Le cas de bug le plus fréquent avec `this` : l'utiliser dans une fonction classique passée en callback (setTimeout, forEach, etc.). La fonction n'est plus appelée comme méthode de l'objet, donc `this` perd sa valeur :

```javascript
const obj = {
    nom: 'Romain',
    startTimer() {
        setTimeout(function() {
            console.log(this.nom); // undefined - this = window, pas obj
        }, 1000);
    }
};

obj.startTimer();
```

**Solution : remplacer la fonction classique par une fléchée**, qui hérite du `this` du contexte englobant (`startTimer`) :

```javascript
const obj = {
    nom: 'Romain',
    startTimer() {
        setTimeout(() => {
            console.log(this.nom); // "Romain" ✅
        }, 1000);
    }
};

obj.startTimer();
```

C'est précisément pour résoudre ce type de problème que les fonctions fléchées ont été introduites en ES6.

---

## Modifier `this` manuellement

Les méthodes `call`, `apply` et `bind` permettent de définir explicitement la valeur de `this` pour une fonction.

**`call`** - appel immédiat, arguments passés **individuellement** :

```javascript
function add(a, b) {
    return this.base + a + b;
}
const ctx = { base: 10 };
add.call(ctx, 2, 3); // 15
```

**`apply`** - appel immédiat, arguments passés dans un **tableau** :

```javascript
add.apply(ctx, [2, 3]); // 15 - même résultat, syntaxe différente
```

> ℹ️ `call` et `apply` sont équivalents : la seule différence est la façon de passer les arguments. `apply` est utile quand ils sont déjà dans un tableau.

**`bind`** - ne lance pas la fonction immédiatement, retourne une **nouvelle fonction** avec `this` fixé :

```javascript
function direBonjour() {
    console.log('Bonjour ' + this.name);
}

const user = { name: 'Romain' };
const direBonjourRomain = direBonjour.bind(user);
direBonjourRomain(); // "Bonjour Romain" - peut être appelée plus tard
```

`bind` est particulièrement utile pour passer une méthode en callback sans en perdre le `this` :

```javascript
const obj = {
    nom: 'Romain',
    direBonjour() {
        console.log('Bonjour ' + this.nom);
    }
};

setTimeout(obj.direBonjour, 1000);              // undefined - this perdu
setTimeout(obj.direBonjour.bind(obj), 1000);    // "Bonjour Romain" ✅
```

---

## `this` dans les event listeners

Dans un gestionnaire d'événement DOM, `this` désigne **l'élément qui a déclenché l'événement** quand on utilise une fonction classique :

```javascript
const button = document.querySelector('button');

button.addEventListener('click', function() {
    console.log(this); // <button> - l'élément DOM
    this.classList.toggle('active');
});
```

Avec une **fonction fléchée**, `this` hérite du contexte englobant (souvent `window` au niveau global) - ce qui peut provoquer un bug si on s'attend à cibler l'élément :

```javascript
button.addEventListener('click', () => {
    console.log(this); // window ⚠️ - pas l'élément
});
```

> ℹ️ En pratique : utiliser une **fonction classique** quand on a besoin de `this` pour cibler l'élément DOM. Utiliser une **fléchée** quand on veut accéder au `this` d'une classe ou d'un objet englobant.

## `this` dans les classes

Dans une classe, `this` fait référence à l'**instance** créée par `new`. C'est le cas d'usage le plus courant et le plus intuitif :

```javascript
class Timer {
    constructor(nom) {
        this.nom = nom;
        this.ticks = 0;
    }

    demarrer() {
        // Bonne pratique : flèche pour conserver le this de la méthode
        setInterval(() => {
            this.ticks++;
            console.log(`${this.nom} : ${this.ticks}`);
        }, 1000);
    }
}

const t = new Timer('Minuteur');
t.demarrer(); // Minuteur : 1, Minuteur : 2...
```

Si on avait utilisé `function()` à la place de `() =>` dans `setInterval`, `this` aurait perdu la référence à l'instance (voir section "Piège classique" ci-dessus) - c'est le cas le plus fréquent dans les classes.

---

## Les 5 règles qui déterminent `this`

La valeur de `this` suit des règles précises selon le contexte d'appel :

| Règle | Contexte | Valeur de `this` |
|---|---|---|
| **Liaison par défaut** | Appel simple `f()` | `window` (ou `undefined` en strict) |
| **Liaison implicite** | Appel méthode `obj.f()` | L'objet `obj` |
| **Liaison explicite** | `f.call(ctx)` / `f.apply(ctx)` / `f.bind(ctx)` | L'objet `ctx` |
| **Liaison `new`** | `new Classe()` | La nouvelle instance créée |
| **Flèche** | `const f = () => {}` | `this` du contexte englobant (lexical) |

Ces règles s'appliquent dans cet ordre de priorité : `new` > explicite > implicite > défaut. La flèche est un cas à part : elle ne suit aucune de ces règles, `this` est figé à la création.

---

## Résumé

| Situation | Valeur de `this` |
|---|---|
| Contexte global (navigateur) | `window` |
| Appel simple `f()` hors strict | `window` |
| Appel simple `f()` en strict | `undefined` |
| Méthode `obj.greet()` | `obj` |
| Fonction fléchée | `this` du contexte englobant (lexical) |
| Callback `function` dans `setTimeout` | `window` (piège) |
| Callback `() =>` dans `setTimeout` | `this` de la méthode englobante ✅ |
| Event listener `function` | L'élément DOM ciblé |
| Event listener `() =>` | `window` ⚠️ |
| `new Classe()` | La nouvelle instance |
| `f.call(ctx)` / `f.apply(ctx)` | `ctx` |
| `f.bind(ctx)()` | `ctx` (figé définitivement) |

## Prochaine étape

**Module 13 - Destructuring, Spread et Rest** : extraire des valeurs de tableaux et d'objets, éclater ou rassembler des listes avec `...`.
