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

<!-- faire référence au cours JavaScript sur this et faire quelques rappels clé -->

Le mot clé `this` permet de faire référence aux informations de l'objet lui-même.

On pourrait traduire `this` par le mot `mon`(/ma) : this.brand => ma marque, this.model => mon modèle...

Le mot clé this va permettre de faire appel aux propriétés de la class via les méthodes.

Problème d'accessibilité avec this résolu avec this : `displayCar(this.Car) {}` pour type le mot clé `this` tu type de la classe. (liaison explicite)

TypeScript ajoute une fonctionnalité, le typage de `this` : `displayCar(this: Car) {}`.
```TypeScript
let displayingCars = {
    displayCar: carOne.displayCar.bind(carOne);
}
```

## Visibilité et Accessibilité

En POO, les informations (attributs et fonctions) disposent d'une visibilité permettant de décrire leur accessibilité : 
* `public` = permet de rendre une information accessible de n'importe où.
* `private` = permet de rendre une infromation inacessible de l'extérieur d'un objet. 

Par défaut, si aucun mot clef n'est positionné devant une information, c'est la visibilité "public" qui est définie. 
De manière générale, on préférera réduire l'accessibilité des informations autant que possible pour conserver un meilleur contrôle du programme. 
Par exemple, avant d'aller modifier une information, il peut être nécessaire de faire un contrôle particulier. Si l'attribut est accessible directement, un membre de notre équipe pourrait modifier celui-ci sans prendre les précautions nécessaires au préalable. C'est la raison pour laquelle on va privilégier de définir les informations en tant que `private`.
Si une information est `private`, elle n'est utilisable que par un objet lui même à l'aide du mot clé `this`.
De cette manière, afin de manipuler les informations, on fera appel à des fonctions `getter` et `setter`. 
```TypeScript
class Car {
    private brand: string;
    private model: string;
    private colour: string;
    private nbDoors: number

    constructor(brand: string, model: string, colour: string, nbDoors: number) {
        this.brand = brand;
        this.model = model;
        this.colour = colour;
        this.nbDoors = nbDoors;
    }

    displayCar(this: Car) {
        console.log("Brand : " + this.brand);
        console.log("Model : " + this.model);
        console.log("Colour : " + this.colour);
        console.log("Number of doors : " + this.nbDoors);
    }

    updateNbDoors(nbDoors: number) {
        this.nbDoors = nbDoors;
    }
}
``` 
Impossible : 
```TypeScript
let carOne = new Car("Ford", "Mustang", "black", 3);
carOne.nbDoors = 5; // nbDoors ne sera pas accessible directement
```
Possible : 
```TypeScript
let carOne = new Car("Ford", "Mustang", "black", 3);
carOne.updateNbDoors(5);
```

`private` permet de rajouter des sécurités supplémentaires sur l'utilisation des attributs et des informations puisqu'on va définir des fonctions en `private` également. 
De cette manière, la modification des attributs ne se fera qu'au travers de fonctions (méthodes) Getters et Setters.

De la même manière que les attributs, les fonctions (méthodes) peuvent être définies en `public` ou `private`. 
En ajoutant le mot clé `private` devant une fonction, on va indiquer que seules des fonctions internes à la classe pourront y accéder. 
```TypeScript
class Car {
    private brand: string;
    private model: string;
    private colour: string;
    private nbDoors: number

    constructor(brand: string, model: string, colour: string, nbDoors: number) {
        this.brand = brand;
        this.model = model;
        this.colour = colour;
        this.nbDoors = nbDoors;
    }

    public displayCar(this: Car) {
        console.log("Brand : " + this.brand);
        console.log("Model : " + this.model);
        console.log("Colour : " + this.colour);
        console.log("Number of doors : " + this.nbDoors);
    }

    public updateNbDoors(nbDoors: number) {
        this.nbDoors = nbDoors;
    }
}
``` 
On peut modifier la syntaxe de construction de la classe de cette manière, sans changer l'accessibilité : 
```TypeScript
class Car {
    constructor(
        private brand: string,
        private model: string,
        private colour: string,
        private nbDoors: number,
    ) {}

    public displayCar(this: Car) {
        console.log("Brand : " + this.brand);
        console.log("Model : " + this.model);
        console.log("Colour : " + this.colour);
        console.log("Number of doors : " + this.nbDoors);
    }

    public updateNbDoors(nbDoors: number) {
        this.nbDoors = nbDoors;
    }
}
``` 
En TypeScript, ce sera la méthode employée : on va définir les attributs directement à l'intérieur du constructeur. 

## `Getters` et `Setters`

Les Getters et le Setters sont des fonctions de classe qui permettent de manipuler les attributs de cette classe qui sont définis en tant que `private`. 

Un `Getter` va permettre d'accéder aux attributs (get...), et un `Setter` permettra de les modifier (set...).

L'écriture de ces fonctions est standard en POO. Elle est parfois générée automatiquement par l'IDE. 
Deux méthodes pour écrire les getters et setters : 

### Manière Standard à la POO

> à noter que les getters et les setters sont totalement optionnels, surtout si on ne souhaite pas que les attributs puissent être visibles ou modifiables.

Un getter est une fonction permettant d'accéder à l'affichage d'un attribut `private`. 

Par convention, un getter sera défini de cette manière : 
* le nom en Camel Case : `get` + attribut = `getBrand`, `getModel`, etc.
* le mot clé `public` pour l'accessibilité de la méthode
* le type retourné = même type que l'attribut associé
* le return statement

```TypeScript
class Car {
    constructor(
        private brand: string,
        private model: string,
        private colour: string,
        private nbDoors: number,
    ) {}

    public getBrand(): string {
        return this.brand;
    };
}

let carOne = new Car("Ford", "Mustang", "black", 3);
console.log(carOne.getBrand());
``` 
Pour gagner de la place, on pourra écrire le getter sur une seule ligne : `public getBrand(): string { return this.brand }`

Par convention, lorsqu'un attribut a un getter associé, il aura automatiquement son setter. 

Le setter permet quant à lui de modifier l'attribut `private` d'un objet.
Par convention, un getter sera défini de cette manière : 
* le nom en Camel Case : `set` + attribut = `setBrand`, `setModel`, etc.
* le mot clé `public` pour l'accessibilité de la méthode
* le paramètre de la fonction : un paramètre du même type que l'attribut à modifier
* le type retourné = type void : un setter ne retourne rien, il permet uniquement de modifier la valeur de l'attribut associé
* pas de return statement, simplement `this.<attribut> = <paramètre>`

```TypeScript
class Car {
    constructor(
        private brand: string,
        private model: string,
        private colour: string,
        private nbDoors: number,
    ) {}

    public setBrand(brand: string): void {
        this.brand = brand;
    };
}

let carOne = new Car("Ford", "Mustang", "black", 3);
carOne.setBrand("Chevrolet");
``` 
à noter qu'il sera préférable d'ajouter des vérifications lors de la modification d'un attribut d'un objet, afin d'éviter d'engendrer des problèmes, par exemple, si on modifie le modèle du véhicule, on peut ajouter une vérification si le modèle appartient bien à la marque définie auparavant. 

Une fonctionnalité supplémentaire liée aux setters est de pouvoir chaîner les fonctions.
Pour cela, il faut que le setter retourne l'objet complet avec this. 
Il faudra donc modifier le type de retour de la fonction : 
```TypeScript
class Car {
    constructor(
        private brand: string,
        private model: string,
        private colour: string,
        private nbDoors: number,
    ) {}

    ...

    public setBrand(brand: string): Car {
        this.brand = brand;
        return this;
    };
    public setModel(model: string): Car {
        this.model = model;
        return this;
    };
    public setColour(colour: string): Car {
        this.colour = colour;
        return this;
    };
}

let carOne = new Car("Ford", "Mustang", "black", 3);
carOne.setBrand("Chevrolet").setModel("Camaro").setColour("yellow");
```
Cette fonctionnalité est totalement optionnelle.

Ce que l'on vient de voir sont les versions standard de la POO. 
TypeScript apporte d'autres fonctionnalités supplémentaires.

### Méthode de TypeScript

La première chose intervient au niveau de la définition des attributs. 
Par convention, on va ajouter un underscore `_` devant les noms des attributs. 
Cela permet d'améliorer la syntaxe que l'on va ensuite utiliser et indiquer plus précisément que les informations sont `private`.

Ensuite, les getters seront définis différement avec TypeScript : 
* on fera appel au mot clé `get`, 
* suivi du nom de l'attribut au format fonction : `get brand()

```TypeScript
class Car {
    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
    ) {}

    public displayCar(this: Car) {
        console.log("Brand : " + this._brand);
        console.log("Model : " + this._model);
        console.log("Colour : " + this._colour);
        console.log("Number of doors : " + this._nbDoors);
    }

    get brand(): string { return this._brand }
}
```

Enfin, il en ira de même avec les setters qui seront définis de la même manière : 
* en faisant appel au mot clé `set`
* suivi du nom de la fonction liée à l'attribut
* il faudra bien ajouté le paramètre qui devra être du même type que l'attribut, avec la nuance que le nom de l'attribut devra être précédé (par convention) par le mot clé `new` en kebab case
* pas de type retourné : un assesseur ne peut pas retourner quoi que ce soit, il sera donc impossible de faire du chaînage avec cette syntaxe
* le corps de la fonction
```TypeScript
class Car {
    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
    ) {}

    public displayCar(this: Car) {
        console.log("Brand : " + this._brand);
        console.log("Model : " + this._model);
        console.log("Colour : " + this._colour);
        console.log("Number of doors : " + this._nbDoors);
    }

    get brand(): string { return this._brand }
    set brand(newBrand: string): void { 
        this._brand = newBrand;
    }
}
```

Un des avantages de cette syntaxe sera lorsque l'on souhaite accéder au getter depuis l'objet créé à partir de la classe : 
```TypeScript
let carOne = new Car("Ford", "Mustang", "black", 3);
console.log(carOne.brand)
```
`console.log(carOne.brand)` n'est pas un appel de fonction, mais bien un appel d'attribut via le getter associé.
On pourra faire appel au setter de la même manière : `object.<attribut> = <newAttribut>;` 
En réalité, on fait bel et bien appel au setter pour modifier le contenu de l'attribut.
```TypeScript
carOne.brand = "Chevrolet";
```

Cette syntaxe propre à TypeScript permet de cacher la syntaxe qui a été écrite lors de la définition de la classe. 
Elle est moins intuitive que la syntaxe standard de la POO et peut destabiliser. L'une comme l'autre a ses avantages et ses inconvénients. 

## Le mot clé `readonly`

`readonly` est une fonctionnalité spécifique au langage TypeScript (mais pas dans la POO).
Ce mot clé va définir qu'une variable ou qu'un attribut ne pourra plus changer de valeur après son initialisation.
Attention, il ne s'agit pas de la même chose que de définir une constante de classe, mais il n'est pas possible de faire cela en TypeScript. 
Cependant, il sera possible de créer des constantes d'objets. 

À la différence d'une constante, cette information peut-être définie par le constructeur et être spécifique à un objet.
Une constante de classe sera identique à tous les objets créés à partir de la classe, alors qu'une constante d'objet est une valeur fixe dédiée à un objet spécifique. 
De cette manière, chaque objet découlant d'une même classe pourra avoir une valeur différente dans sa constante d'objet.
Le constructeur pourra donc se charger d'initialiser la valeur de la constante d'objets, rendant celle-ci spécifique à l'objet instancié.
On pourra cependant définir une valeur fixe pour tous les objets découlant d'une classe, en procédant à l'initialisation directement au niveau de la déclaration de l'attribut. 

```TypeScript
class Car {
    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number,
    ) {}

    public displayCar(this: Car) {
        console.log("Brand : " + this._brand);
        console.log("Model : " + this._model);
        console.log("Colour : " + this._colour);
        console.log("Number of doors : " + this._nbDoors);
        console.log("Year : " + this.year);
    }

    get brand(): string { return this._brand }
    set brand(newBrand: string): void { 
        this._brand = newBrand;
    }
}

let carOne = new Car("Ford", "Mustang", "black", 3, 2020);
let carTwo = new Car("Ford", "Mustang", "black", 3, 2021);
carOne.displayCar(); // Year : 2020
carTwo.displayCar(); // Year : 2021
```
Ceci sera impossible : `carOne.year = 2019;`

Pour définir une constante d'objet identique entre tous les objets construits à partir de la classe, on va modifier la définition de l'attribut : 
```TypeScript 
class Car {
    public readonly year: number = 2019;

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
    ) {}
}
let carOne = new Car("Ford", "Mustang", "black", 3);
let carTwo = new Car("Ford", "Mustang", "black", 3);
``` 
De cette manière, tous les véhicules créés auront comme année 2019, et on ne pourra plus jamais modifier cette valeur. 

## Le mot clé `static`

Jusqu'ici, tous les attributs et fonctions que l'on définit sont dédiés aux objets et sont donc accessibles soit par l'objet lui-même via le mot clé `this` soit par un autre programme en utilisant le nom de l'objet, si l'information est définie en tant que `public`.

Avec le mot clé `static`, on pourra définir qu'un attribut ou une fonction sera dédiée à la classe et donc accessible depuis le nom de la classe. 
`static` permet d'indiquer qu'une information (attribut ou fonction) est accessible directement depuis la classe elle-même (et non depuis l'objet).

Cette fonctionnalité est intéressante pour définir : 
* Des attributs communs aux objets (mettre en oeuvre le pattern singleton, définir des "constantes de classe", ...)
* Créer des listes d'objets provenants d'une classe (tableaux)
* Créer des fonctions communes aux objets (de récupération de data de la BDD, ou encore des fonctions utilitaires)
* Créer des classes permettant de regrouper des fonctions utilitaires (boîte à outil)

En POO, on est capable de créer des constantes de classe, à savoir définir des valeurs fixes liées à une classe et non pas à un objet. 
Avec TypeScript, on pourra faire de même mais pour cela il faudra combiner le mot clé `static` et le mot clé `readonly`.

```TypeScript
class Car {
    public static readonly VAT: number = 20;

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {}
}
let carOne = new Car("Ford", "Mustang", "black", 3, 2019);
let carTwo = new Car("Ford", "Mustang", "black", 3, 2020);
``` 
`public static readonly VAT: number = 20;` : 
* `public` : accessible partout
* `readonly` : non modifiable
* `VAT` : en majuscule par convention car il s'agit d'une constante
* `: number` : typage de la donnée
* `= 20` : attribution de la valeur fixe 20

l'attribut `VAT` est donc accessible depuis la classe elle même grâce au mot clé `static`, elle sera non modifiable grâce à `readonly`, et est bien liée à la classe et non pas aux objets. 
Pour accéder à cet attribut, on utilisera le nom de la classe suivi d'un point et de la contante : `Car.VAT`, que ce soit depuis l'extérieur de la classe ou depuis l'intérieur. Cela signifie qu'à l'intérieur de la classe, on utilisera pas le mot clé `this` pour accéder à la constante. 
```TypeScript
class Car {
    public static readonly VAT: number = 20;

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {}

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }
}

console.log(Car.VAT);
```

Une autre fonctionnalité possible est de définir des attributs statiques permettant de regrouper tous les objets provenant d'une même classe via une liste.
Par exemple, on pourra définir une liste de voitures, qui sera un tableau de voitures, et qui regroupera toutes les objets de type voiture instanciés depuis le constructeur. Pour cela, il faudra dans le constructeur ajouter à cette liste chaque instace via un array.push : 
```TypeScript
class Car {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {
        Car.CarList.push(this);
    }

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }
}
``` 
Cette syntaxe de définition de liste d'objet, bien que faisable, n'est pas vraiment logique et ne respecte pas vraiment les concepts de la POO. En effet, en POO, on essaie de définir des objets ayant une entité propre, c'est à dire qu'un objet (ici, une voiture) n'a pas à connaître les autres objets. 

La bonne solution serait plutôt de créer une autre classe propre qui elle aura en charge de lister les objets du même type : 
```TypeScript
class CarFleet {
    public CarList: Car[] = [];
}

class Car {
    public static readonly VAT: number = 20;

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {}

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }
}

let carOne = new Car("Ford", "Mustang", "black", 3, 2019);
let carTwo = new Car("Ford", "Mustang", "black", 3, 2020);

let americanCarFleet = new CarFleet;
americanCarFleet.CarList.push(carOne, carTwo);
```
Cette syntaxe correspond plus au concept de POO.

Il est également possible d'ajouter le mot clé `static` sur des fonctions. Reprenons la syntaxe la liste interne à la classe. Afin de modifier cette liste, on ne passera pas par le constructeur, mais au lieu de cela, on va créer une fonction spécifique qui va permettre de mettre à jour cette liste : 
```TypeScript 
class Car {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {}

    public static addCarToFleet(car: Car) {
        Car.CarList.push(car);
    }

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }
}

let carOne = new Car("Ford", "Mustang", "black", 3, 2020);
Car.addCarToFleet(carOne);
```
Dans ce cas, le mot clé static fait plus de sens, car seule la classe va permettre d'ajouter un objet à la liste, et non pas l;'objet lui-même. 

Pour supprimer un objet de la liste, on devra également créer une fonction dédiée :
```TypeScript
class Car {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];

    constructor(
        private _brand: string,
        private _model: string,
        private _colour: string,
        private _nbDoors: number,
        public readonly year: number
    ) {}

    public static addCarToFleet(car: Car) {
        Car.CarList.push(car);
    }

    public static removeLastCarFromFleet() {
        Car.CarList.pop();
    }

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }
}
```
Le mot clé static serait intéressant dans le cas ou on souhaiterais récupérer les éléments d'une base de données via une fonction dédiée. 
On pourrait aussi utiliser cela dans une classe `ToolBox` regroupant toutes les fonctions génériques utilitaires : 
```TypeScript
class ToolBox {
    public static displayArrayElements(array: any[]) {
        for (let el of array) {
            console.log(el);
        }
    }

    public static calculateAverage(...numbers: number[]) {
        let sum = 0;
        for (let n of numbers) {
            sum += n;
        }
        return sum/numbers.length;
    }
}

let grades = [10, 15, 20];

ToolBox.displayArrayElements(grades);
ToolBox.calculateAverage(grades);
```

## L'héritage

L'héritage est un concept propre à la POO et permet de créer une classe héritant des propriétés d'une autre classe. On parle de `classe mère` et de `classe fille`.
Une classe fille ne peut avoir qu'une seule mère, mais plusieurs classes filles peuvent hériter de la classe mère. 

Le mot clé `protected` se placera devant les informations pouvant être héritées par une classe fille, car les informations `private` ne seront pas accessibles par les objets d'une classe fille. Cela indique aussi que les informations protected ne sont accessibles que par la classe mère et la classe fille.

Le mot clé `super` va permettre de faire appel aux fonctions d'une classe mère. 

Dans le constructeur d'une classe fille, on va devoir faire appel dans les paramètres du constucteur aux attributs de la classe mère (sans mot clé, juste avec un nom  de paramètre correspondant et son type), ainsi qu'à la fonction `super()` qui est obligatoire et qui prendra en paramètres les paramètres du constructeur.
Pour manipuler des informations issues de la classe mère dans une classe fille, il faudra soit que les attributs de la classe mère soient `public`, soit `protected`.

```TypeScript
class Car {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];

    constructor(
        protected _brand: string,
        protected _model: string,
        protected _colour: string,
        protected _nbDoors: number,
        protected readonly year: number
    ) {}

    public static addCarToFleet(car: Car) {
        Car.CarList.push(car);
    }

    public static removeLastCarFromFleet() {
        Car.CarList.pop();
    }

    public displayCar(this: Car) {
        console.log(Car.VAT);
    }

    protected displayColour() {
        console.log("Colour : " + this._colour);
    }

    get brand(): string { return this._brand; }
    get model(): string { return this._model; }
    
    set brand(newBrand: string) {
        this._brand = newBrand;
    }
    set model(newModel: string) {
        this._model = newModel;
    }
}

class RaceCar extends Car {
    private _speed: number;

    constructor(
        brand: string,
        model: string,
        nbDoors: number,
        year: number,
        speed: number,
    ) {
        super(brand, model, "blue", nbDoors, year);
        this._speed = speed;
    }

    public displaySpeed() {
        console.log("Max speed is : " + this._speed);
    }

    // redéfinir les méthodes de la classe mère
    public displayCar(this: RaceCar) {
        super.displayCar(); // appel de la fonction de la classe mère
        this.displaySpeed();
    }
}

let carOne = new Car("Ford", "Mustang", "black", 3, 2019);
let carTwo = new Car("Ford", "Mustang", "black", 3, 2020);
let raceCarOne = new RaceCar("Ferrari", "Ferrari", 3, 2025, 300);

Car.addCarToFleet(carOne);
Car.addCarToFleet(carTwo);
```

## Le mot clé `abstract`

Le mot clé `abstract` permet de définir des fonctions abstraites dans une classe. C'est à dire que l'on va définir une fonction dans une classe mère sans pour autant écrire son implémentation, qui sera faite pas la classe fille. 
Si une classe contient une fonction abstraite, alors elle doit elle-même être définie comme une classe abstraite, et elle ne pourra plus être instanciée directement. Elle devra obligatoirement être instanciée par une classe fille.
Il s'agit ici d'une préparation qui devra être obligatoirement implémentée par une classe fille. 
```TypeScript
abstract class Car {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];
    public readonly year: number;

    constructor(
        protected _brand: string,
        protected _model: string,
        protected _colour: string,
        protected _nbDoors: number,
        protected readonly year: number
    ) {}

    abstract displayCar(this: Car);
}

class RaceCar extends Car {
    private _speed: number;

    constructor(
        brand: string,
        model: string,
        nbDoors: number,
        year: number,
        speed: number,
    ) {
        super(brand, model, "blue", nbDoors, year);
        this._speed = speed;
    }

    public displaySpeed() {
        console.log("Max speed is : " + this._speed);
    }

    public displayCar(this: RaceCar) {
        console.log("Brand : " + this._brand);
        console.log("Model : " + this._model);
        console.log("Colour : " + this._colour);
        console.log("Number of doors : " + this._nbDoors);
        console.log("Year : " + this.year);
        this.displaySpeed();
    }
}

let carOne = new RaceCar("Ford", "Mustang", 3, 2019, 240);
let carTwo = new RaceCar("Ford", "Mustang", 3, 2020, 260);
let raceCarOne = new RaceCar("Ferrari", "Ferrari", 3, 2025, 300);
```

## Les interfaces

Rappel, une interface permet de définir la structure qu'aura un ou plusieurs objets. 
Elle pourra s'utiliser également au niveau des classes. 

Pour qu'une classe implémente une interface, il suffira d'utiliser le mot clé `implements`, et d'indiquer le nom de l'interface à implémenter.

Comme pour les classes abstraites, les interfaces permettent de définir une structure d'une classe et ne peuvent pas être instanciées. 
La différence entre les classes abstraites et les interfaces est que l'interface ne définit aucune implémentation de code. 
Une classe pourra implémenter plusieurs interfaces, alors qu'une classe ne pourra hériter que d'une seule autre classe.

```TypeScript
interface Vehicule {
    mass: number;
    calculateWeight(): number;
}

interface Drivable {
    nbWheels: number;
}

abstract class Car implements Vehicule, Drivable {
    public static readonly VAT: number = 20;
    public static CarList: Car[] = [];
    
    constructor(
        protected _brand: string,
        protected _model: string,
        protected _colour: string,
        protected _nbDoors: number,
        protected readonly _year: number,
        public _mass: number,
        public nbWheels: number = 4,
    ) {}

    public calculateWeight() {
        return this._mass * 9.81; 
    }

    abstract displayCar(this: Car);
}

class RaceCar extends Car {
    private _speed: number;

    constructor(
        brand: string,
        model: string,
        nbDoors: number,
        year: number,
        mass: number,
        speed: number,
    ) {
        super(brand, model, "blue", nbDoors, year, 1500);
        this._speed = speed;
    }

    public displaySpeed() {
        console.log("Max speed is : " + this._speed);
    }

    public displayCar(this: RaceCar) {
        console.log("Brand : " + this._brand);
        console.log("Model : " + this._model);
        console.log("Colour : " + this._colour);
        console.log("Number of doors : " + this._nbDoors);
        console.log("Mass : " + this._mass)
        console.log("Year : " + this._year);
        this.displaySpeed();
        console.log("Weight : " + this.calculateWeight();)
    }
}
```

> Attention, les informations au sein d'une interface sont forcément `public`
