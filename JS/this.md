# L'OPERATEUR THIS

`this` est un opérateur et comme tout opérateur il retourne une valeur.
1. **D'où vient cette valeur ?**<br> 
Cette valeur provient d'un contexte d'exécution. Il faut savoir qu'au lancement du script et ensuite à chaque appel d'une fonction un contexte d'exécution est placé en pile d'exécution.
2. **Qu'est qu'il y a dans un contexte d'exécution ?**<br> 
Il y a la valeur de `this` ça je viens de le dire et il y a aussi des informations qui vont permettre à la fonction de s'exécuter par exemple les arguments qui lui sont passés. Je ne détaille pas plus. Mais vous pouvez déjà comprendre qu'à chaque appel d'une fonction étant donné que l'on change les arguments et bien on va créer un nouveau contexte. Ce qu'il faut retenir ici c'est l'idée car en fait il y a beaucoup plus d'informations que ça dans un contexte d'exécution.
3. **Qui gère cette valeur de `this` ? Qui l'affecte ?**<br> 
Et bien c'est le moteur JavaScript qui le fait et qui le fait pour nous.
4. **Alors c'est gentil mais à quoi ça va me servir ?**<br> 
Par exemple quand vous instanciez une classe pour créer un nouvel objet et bien dans la fonction constructeur `this` va désigner ce nouvel objet.<br> 
Autre exemple : quand vous passez un callback à un gestionnaire d'événement et bien dans ce callback `this` va désigner l'élément du document sur lequel est posé ce gestionnaire.
5. **Et si la valeur de `this` ne vous convient pas ?**<br>
il faut que vous sachiez que vous pouvez la changer en utilisant les méthodes `call`, `apply` ou `bind` du constructeur Function.
6. **Que vaut `this` ?**<br> 
Pour pouvoir utiliser la valeur de `this` il faut être capable de prévoir ce que va faire le moteur JavaScript.<br>
Il faut aussi savoir que la valeur de `this` peut dépendre dans un très petit nombre de cas de l'utilisation ou pas du mode strict et aussi de l'environnement d'exécution de JavaScript à savoir le navigateur ou un serveur.

En JS, le mot-clé this se comporte légèrement différemment des autres langages de programmation.<br>
Son comportement variera également légèrement selon qu'on utilise le mode strict ou le mode non-strict.<br>

Dans la plupart des cas, la valeur de this sera déterminée à partir de la façon dont une fonction est appelée.<br>
Il n'est pas possible de lui affecter une valeur lors de l'exécution et sa valeur peut être différente à chaque fois que la fonction est appelée.<br>
La méthode `bind()` a été introduite avec ECMAScript 5 pour définir la valeur de this pour une fonction, indépendamment de la façon dont elle est appelée.<br>
ECMAScript 2015 (ES6) a ajouté les fonctions fléchées dans lequelles this correspond à la valeur du contexte englobant.<br>

La valeur de `this` est l'objet JS représentant le contexte dans lequel le code courant est exécuté.<br>
Le mot clé `this` est utilisé avec des méthodes d'un objet pour accéder à des informations stockées dans l'objet.<br>
Le mot clé `this` va dans ce cas être substitué par l'objet utilisant la méthode lors de l'appel.

## This avec une fonction classique invoquée dans la portée globale

Dans le contexte global d'exécution (c'est-à-dire celui en dehors de toute fonction), `this` fait référence à l'objet global (qu'on utilise ou non le mode strict).

```Javascript
// Si l'environnement de script est un navigateur,
// l'objet window sera l'objet global
console.log(this === window); // true

this.a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b); // "MDN"
console.log(b); // "MDN"
```

## Dans le contexte d'une fonction

Si this est utilisé dans une fonction, sa valeur dépendra de la façon dont la fonction a été appelée.

Avec un appel simple :
```Javascript
function f1() {
  return this;
}

// Dans un navigateur
f1() === window; // true (objet global)

// Côté serveur (ex. Node)
f1() === global; // true
```

Dans cet exemple, la valeur de `this` n'est pas définie lors de l'appel.<br>
Le code n'étant pas en mode strict, `this` doit toujours être un objet et ce sera donc l'objet global (soit window pour un navigareur).<br>

```Javascript
function f2() {
  "use strict"; // on utilise le mode strict
  return this;
}

f2() === undefined; // true
```
Dans cet exemple, `this` vaut `undefined` car `f2` a été appelé sans "base" (ex. : window.f2()).<br>
S'il n'est pas défini, il reste `undefined`. Cette fonctionnalité ne fut pas correctement implémentée dans certains navigateurs aux début du mode strict,<br>
en effet, certains renvoyaient alors l'objet `window`.

En mode strict, la valeur de `this` est conservée (il reste le même) entre le moment de sa définition et l'entrée dans le contexte d'exécution.<br>
S'il n'est pas défini, il reste undefined. Il pourrait être définir avec n'importe quelle autre valeur, telle que `null` ou `42` ou `"je ne suis pas this"`.

## Les fonctions fléchées et le mot clef `this`

Pour rappel, le mot clé `this` est utilisé avec des méthodes d'un objet pour accéder à des informations stockées dans l'objet.<br>
Le mot clé `this` va dans ce cas être substitué par l'objet utilisant la méthode lors de l'appel.

```javascript
let feuille = {
    nom: 'Ciseaux',
    prenom: 'Pierre',
    hobbies: ['ams', 'tram', 'gram'],

    getFullName(){
        console.log(this.prenom + ' ' + this.nom);
    }
};

feuille.getFullName();

// retourne : Pierre Ciseaux
```

En JavaScript, à la différence de la plupart des langages, le mot clef `this` n'est pas lié à un objet en particulier.<br>
La valeur de `this` va être évaluée au moment de l'appel de la méthode dans laquelle il est présent en JS.

La valeur de `this` ne va donc pas dépendre de l'endroit où la méthode a été déclarée mais de l'objet qui l'appelle.<br>
Cela permet à une méthode d'être réutilisée par différents objets.

Comme la valeur de `this` ne dépend pas de l'endroit où la méthode a été déclarée,<br> 
on va en fait pouvoir utiliser ce mot clef dans n'importe quelle fonction.

```javascript
let pierre = {name: 'Pierre'};
let mathilde = {name: 'Mathilde'};

function disBonjour() {
  alert('Bonjour ' + this.name);
}

pierre.bonjour = disBonjour;
mathilde.bonjour = disBonjour;

pierre.bonjour(); //Bonjour Pierre
mathilde.bonjour(); //Bonjour Mathilde
```

Les fonctions fléchées sont différentes des autres fonctions : elles ne possèdent pas de valeur propre pour `this`.<br>
Si on utilise ce mot clef dans une fonction fléchée, la valeur utilisée pour celui-ci<br> 
sera celle du contexte de la fonction fléchée, c'est-à-dire celle de la fonction englobante.
```javascript
let feuille = {
    nom: 'Ciseaux',
    prenom: 'Pierre',
    hobbies: ['ams', 'tram', 'gram'],

    disBonjour(){
        const bonjour = () => console.log('Bonjour ' + this.prenom);
        bonjour();
    }
};

feuille.disBonjour();
// retourne Bonjour Pierre
```