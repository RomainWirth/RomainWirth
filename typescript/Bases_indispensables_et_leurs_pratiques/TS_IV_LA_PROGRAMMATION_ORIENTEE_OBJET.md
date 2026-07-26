# La Programmation Orientée Objet (POO)

## Rappels sur la POO

Javascript est à la base un langage orienté Prototype. Les version récentes du langage permettent (plus ou moins) d'écrire du code en utilisant la Programmation Orientée Objet (POO). De nombreux concepts sont manquant ou se mettent en oeuvre de manière "particulière".

Différence entre programmation procédurale et programmation orientée objet : 
* Procédurale : quand on veut représenter des données, on va créer des variables spécifiques pour chacune d'elles, et lorsqu'on veut ajouter des traitements, on va créer des fonctions spécifiques à chaque fois, de manière dissociée et sans lien direct. 
* POO : permet de regrouper des données et des traitements dans une même entité propre : une classe. Cela permet une meilleure lisibilité et robustesse du code puisqu'on regroupe les éléments travaillant ensemble.

Un object permet de représenter uune entité propre (un livre, un être humain, un animal) à l'aide d'informations : 
* Attribut : correspond aux données brutes (nom, âge, libellé, sexe, liste de couleurs, liste de passions...)
* Méthodes (fonction) : correspond aux fonctionnalités (traitements) que peut réaliser un objet

On va créer des classes (des "moules") qui permettent de créer des objets à l'infini. C'est une sorte d'usine à fabriquer un type d'objet que l'on pourra instancier grâce au mot clé `new`.

```JavaScript
class Car {
    brand;
    model;
    colour;
    nbDoors;
}

let carOne = new Car();
carOne.brand = "Ford";
carOne.model = "Mustang";
carOne.colour = "black";
carOne.nbDoors = 3;
console.log(carOne);
```
En JavaScript, il n'est pas possible d'utiliser des mots clé comme `private` pour limiter l'accessibilité aux attributs des objets. 

TypeScript permet une meilleure écriture de la POO et ajoute de nombreux éléments manquants à JavaScript, dont la gestion de la visibilité des informations (attributs et fonctions).

On peut également ajouter un constructeur de classe, afin de spécifier de quelle manière est créé l'objet : 
```JavaScript
class Car {
    brand;
    model;
    colour;
    nbDoors;

    constructor(brand, model, colour, nbDoors) {
        this.brand = brand;
        this.model = model;
        this.colour = colour;
        this.nbDoors = nbDoors;
    }
}
let carOne = new Car("Ford", "Mustang", "black", 3);
console.log(carOne);
```

Le problème avec JavaScript est qu'on pourrait accéder directement à l'attribut d'un objet afin de le modifer, ce qui peut créer des incohérences. 
En POO, on va éviter de faire cela, on passera plutôt par des fonctions (méthodes) qui vont permettre de faire les modifications : 
```JavaScript
class Car {
    constructor(brand, model, colour, nbDoors) {
        this.brand = brand;
        this.model = model;
        this.colour = colour;
        this.nbDoors = nbDoors;
    }

    displayBrand() {
        console.log("Brand :" + this.brand);
    }

    displayCar() {
        console.log("Brand : " + this.brand);
        console.log("Model : " + this.model);
        console.log("Colour : " + this.colour);
        console.log("Number of doors : " + this.nbDoors);
    }
}
let carOne = new Car("Ford", "Mustang", "black", 3);
carOne.displayBrand();
carOne.displayCar();
```

En TypeScript, la syntaxe ci-dessus engendrerai plusieurs erreurs : 
* Il faudrait définir correctement les propriétés de class, qui seront disponibles en `public`
```TypeScript
class Car {
    brand;
    model;
    colour;
    nbDoors;

    constructor(brand, model, colour, nbDoors) {
        this.brand = brand;
        this.model = model;
        this.colour = colour;
        this.nbDoors = nbDoors;
    }
}
``` 
* Il faudra aussi typer correctement les propriétés 

## Le mot clé `this`

<!-- faire référence au cours JavaScript sur this -->

Le mot clé `this` permet de faire référence aux informations de l'objet lui-même.

On pourrait traduire `this` par le mot `mon`(/ma) : this.brand => ma marque, this.model => mon modèle...

Le mot clé this va permettre de faire appel aux propriétés de la class via les méthodes.

## Visibilité et Accessibilité

## Le mot clé `readonly`

## Le mot clé `static`

## L'héritage

## Le mot clé `abstract`

## Les interfaces
