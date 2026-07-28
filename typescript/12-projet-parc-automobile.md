# 12. Projet : parc automobile

Ce dernier projet pratique met en application le module 5 (les génériques), en réutilisant les acquis du module 4 (POO) vus dans le projet précédent : créer un parc automobile contenant des bus et des voitures.

Il sera possible d'ajouter ou de retirer des véhicules du parc.

## Sommaire

- [Étape 1 : préparer la structure du projet et initialiser](#etape-1--preparer-la-structure-du-projet-et-initialiser)
- [Étape 2 : préparer le HTML](#etape-2--preparer-le-html)
- [Étape 3 : Créer les classes de véhicules](#etape-3--creer-les-classes-de-vehicules)
- [Étape 4 : Listes de véhicules](#etape-4--listes-de-vehicules)
- [Étape 5 : Création du parc automobile](#etape-5--creation-du-parc-automobile)
- [Étape 6 : Manipuler le DOM](#etape-6--manipuler-le-dom)
- [Étape 7 : Finalisation du projet](#etape-7--finalisation-du-projet)
- [Bonus : refactorisation](#bonus--refactorisation)

## Étape 1 : préparer la structure du projet et initialiser

### Instruction

* Créer un fichier `index.html`
* Créer deux dossiers : `dist` et `src`
* Entrer la commande `tsc --init`
* Dans le nouveau fichier `tsconfig.json`, modifier `outDir` et `rootDir`
* Dans le dossier `src`, ajouter le fichier `index.ts`
* Lancer `tsc --watch` dans le terminal

## Étape 2 : préparer le HTML

### Instructions

Dans le fichier `index.html`, ajouter la structure standard ainsi que la structure de base pour le projet.

### Correction

On va simplement initialiser la structure de base, qu'on rempliera plus tard

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vehicule fleet</title>
</head>
<body>
    <script src="./dist/index.js"></script>
</body>
</html>
```

## Étape 3 : Créer les classes de véhicules

### Instructions

Tous les véhicules disposent d'une plaque d'immatriculation et sont caractérisés par un type (bus ou voiture).

Créer 3 classes : `Vehicule`, `Bus`, `Car`.

### Correction
On va commencer par créer la classe `Vehicule` : 
* le constructor va initialiser les propriétés `registration` (plaque d'immatriculation) de type `string` et `type` (bus ou voiture) de type `string` également, qui ne seront accessibles que dans la classe (`private`).
* On va ajouter les Getters pour le moment pour accéder aux informations
* Et tester avec la création de deux variables bus et deux variables voitures et les afficher via un `console.log`
```TypeScript
class Vehicule {
    constructor(
        private _registration: string,
        private _type: string,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

let busOne = new Vehicule("XX-1111-XX", "bus");
let busTwo = new Vehicule("YY-2222-YY", "bus");
let carOne = new Vehicule("AA-1111-AA", "car");
let carTwo = new Vehicule("BB-2222-BB", "car");

console.log({ busOne, busTwo, carOne, carTwo });
```
On va maintenant créer une énumération pour les véhicules, afin d'uniformiser les données : 
* création de l'enum
* modification des variables initialisées
```TypeScript
enum VehiculeType {
    BUS = "bus",
    CAR = "car"
}

class Vehicule {
    constructor(
        private _registration: string,
        private _type: string,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

let busOne = new Vehicule("XX-1111-XX", VehiculeType.BUS);
let busTwo = new Vehicule("YY-2222-YY", VehiculeType.BUS);
let carOne = new Vehicule("AA-1111-AA", VehiculeType.CAR);
let carTwo = new Vehicule("BB-2222-BB", VehiculeType.CAR);

console.log({busOne, busTwo, carOne, carTwo});
```
Il est temps maintenant de créer nos classes spécifiques `Bus` et `Car` qui auront les même propriétés que la classe `Vehicule` (`extends`) :
* le constructor va déclarer la propriété `registration`
* le type de véhicule sera hérité de la classe mère (`super()`) 
```TypeScript
class Bus extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.BUS)
    }
}

class Car extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.CAR)
    }
}
```
Maintenant que nos classes spécifiques sont créées, on va pouvoir passer la classe mère en classe abstraite : 
* Cela implique d'ajouter le mot clé `abstract` devant la classe Vehicule
* Modifier les déclarations de variables avec les classes correspondantes : 
    * `busOne et busTwo = new Bus()` et `carOne et carTwo = new Car()`
    * mettre à jour les paramètres passé aux classes lors des créations des variables
```TypeScript
enum VehiculeType {
    BUS = "bus",
    CAR = "car"
}

abstract class Vehicule {
    constructor(
        private _registration: string,
        private _type: string,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

class Bus extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.BUS)
    }
}

class Car extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.CAR)
    }
}

let busOne = new Bus("XX-1111-XX");
let busTwo = new Bus("YY-2222-YY");
let carOne = new Car("AA-1111-AA");
let carTwo = new Car("BB-2222-BB");

console.log({busOne, busTwo, carOne, carTwo});
```

## Étape 4 : Listes de véhicules

### Instructions

* Écrire une classe `generic` permettant de créer une liste d'un type de véhicule (`car` ou `bus`)
* La classe doit permettre d'ajouter un véhicule ou d'en retirer un (le dernier)

### Correction

On va ajouter une nouvelle classe `VehiculeList` : 
* cette classe sera de type générique `<T>`
* elle prendra un attribut tableau `_fleet` uniquement accessible à cette classe `private`, de type générique
* on va lui ajouter une fonction `addVehicule` afin d'ajouter des nouveaux véhicules à la flotte. Cette fonction prend en paramètre un véhicule de type générique.
* pour accéder à la liste de véhicules, il faudra ajouter un Getter (rappel : la liste `_fleet` est `private`)
* ajouter des `console.log` pour visualiser les nouveautés
* et enfin ajouter la dernière fonctionnalité : supprimer la dernière entrée de la liste de véhicules (`removeLastEntry()`) avec la méthode `.pop`
```TypeScript
class VehiculeList<T> {
    private _fleet: Array<T> = [];

    get fleet() { return this._fleet; }

    addVehicule(vehicule: T) {
        this._fleet.push(vehicule);
    }

    removeLastEntry() {
        if (this._fleet.length > 0) {
            this._fleet.pop();
        }
    }
}

let carFleet = new VehiculeList<Car>();
carFleet.addVehicule(carOne);
carFleet.addVehicule(carTwo);
carFleet.removeLastEntry();

let busFleet = new VehiculeList<Bus>();
busFleet.addVehicule(busOne);
busFleet.addVehicule(busTwo);

console.log({ carFleet: carFleet.fleet, busFleet: busFleet.fleet });
```

## Étape 5 : Création du parc automobile 

### Instructions

* Créer une classe permettant de représenter le parc automobile `VehiculeFleet`
* Le parc contient une liste de voitures et une liste de bus
* Il sera possible : 
    * d'ajouter un véhicule dans le parc à partir du type de véhicule (bus ou voiture)
    * de louer un véhicule en fonction de son type
    * d'afficher le parc

### Correction

On va commencer par créer la classe `VehiculeFleet` :
* Dans cette classe, on va ajouter deux attributs : une liste et voitures et une liste de bus, que l'on va pour l'instant laisser accessible (`public`), et qui seront initialisés grâce au constructeur de chaque liste respectivement. 
```TypeScript
class VehiculeFleet {
    public cars: VehiculeList<Car> = new VehiculeList<Car>();
    public buses: VehiculeList<Bus> = new VehiculeList<Bus>();
}
```
* On pourra ensuite supprimer toutes les variables de création de listes de voitures et de bus puisque cette responsabilité sera donnée à la nouvelle classe
* On va ensuite créer un nouvel objet `vehiculeFleet` à partir de la nouvelle classe et y ajouter des véhicules grâce aux fonctions liées aux différentes classes 
```TypeScript
let vehiculeFleet = new VehiculeFleet();
vehiculeFleet.buses.addVehicule(busOne);
vehiculeFleet.buses.addVehicule(busTwo);
vehiculeFleet.cars.addVehicule(carOne);
vehiculeFleet.cars.addVehicule(carTwo);
console.log({ vehiculeFleet });
```
Pour sécuriser la liste du parc auto, on va passer les attributs en `private`
* On va d'abord modifier la déclaration des attributs avec `private _property: GenericType<Type> = new GenericClass<Type>();`
* On va ensuite ajouter les getters liés à nos deux attributs. De cette manière, on aura pas besoin de modifier la création de notre objet vehiculeFleet puisque les fonctions addVehicule sont accessibles publiquement.
* Pour plus de visibilité, on va ajouter à la class VehiculeFleet une fonction `addVehicule` de type générique mais avec une contrainte de recevoir forcément un véhicule, qui va permettre d'ajouter un véhicule à la flotte.
* Une fois cette étape faite, on va ajouter une fonction pour louer un véhicule, une fonction simple qui retirera uniquement le dernier véhicule ajouté à la liste : 
    * `rentVehicule` qui prendra un paramètre un type de véhicule (bus ou voiture), du type `enum VehiculeType`
    * on va tester si le type de véhicule est un bus ou une voiture, et en fonction, appeler la fonction `removeLastEntry` sur chaque liste correspondante
* Enfin, il va nous falloir une fonction pour pouvoir visualiser la liste des véhicules selon leur type :
    * il faudra boucler sur la liste de chacun des types de véhicules pour afficher la plaque d'imatriculation
```TypeScript
class VehiculeFleet {
    private _cars: VehiculeList<Car> = new VehiculeList<Car>();
    private _buses: VehiculeList<Bus> = new VehiculeList<Bus>();

    get cars() { return this._cars; }
    get buses() { return this._buses; }

    addVehicule<T extends Vehicule>(vehicule: T) {
        if (vehicule.type === VehiculeType.BUS) {
            this._buses.addVehicule(vehicule as Bus);
        } else if (vehicule.type === VehiculeType.CAR) {
            this._cars.addVehicule(vehicule as Car);
        }
    }

    rentVehicule(vehiculeType: VehiculeType) {
        if (vehiculeType === VehiculeType.BUS) {
            this._buses.removeLastEntry();
        } else if (vehiculeType === VehiculeType.CAR) {
            this._cars.removeLastEntry();
        }
    }

    displayFleet() {
        console.log("Cars in fleet:");
        for (let car of this._cars.fleet) {
            console.log(`- ${car.registration}`);
        }

        console.log("Buses in fleet:");
        for (let bus of this._buses.fleet) {
            console.log(`- ${bus.registration}`);
        }
    }
}

```
* On pourra ainsi modifier l'ajout de véhicules à notre liste en remplaçant `.buses.addVehicule` par `addVehicule` tout simplement
* au lieu d'utiliser un console.log, on va utiliser la fonction `displayFleet`
* Et ensuite tester notre nouvelle fonction de location de véhicule
```TypeScript
let vehiculeFleet = new VehiculeFleet();
vehiculeFleet.displayFleet();
vehiculeFleet.addVehicule(busOne);
vehiculeFleet.addVehicule(busTwo);
vehiculeFleet.addVehicule(carOne);
vehiculeFleet.addVehicule(carTwo);
vehiculeFleet.displayFleet();

vehiculeFleet.rentVehicule(VehiculeType.BUS);
vehiculeFleet.displayFleet();
```

## Étape 6 : Manipuler le DOM

### Instructions

Lister les véhicules dans le DOM et ajouter la possibilité de louer : 
* On aura besoin d'une liste déroulante, 
* Et d'un bouton Louer qui déclenchera le suppression d'un véhicule de la liste

Il faudra donc : 
* Ajouter le HTML nécessaire
* Créer une fonction `getVehicules` disponible depuis le parc auto, et qui retourne la liste de tous les véhicules sous la forme d'un tableau
* Écrire une fonction indépendante des classes qui permet de créer la liste déroulante affichée sur le DOM et contenant tous les véhicules

### Correction

Pour la partie HTML : 

On va ajouter une div qui va englober nos éléments : 
* balise select avec un id `vehicule-list` : elle sera populée par la suite avec la liste des véhicules
* une balise button avec un id `rent` : qui déclenchera l'action de location (suppression d'un véhicule de la liste)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vehicule fleet</title>
</head>
<body>
    <div id="app">
        <select id="vehicule-list"></select>
        <button id="rent-button">Louer</button>
    </div>
    <script src="./dist/index.js"></script>
</body>
</html>
```
Au niveau de typescript : 

On va ajouter dans notre classe `VehiculeFleet` la fonction `getVehicules` : 
* cette fonction va retourner un tableau de véhicules
* on utilisera une variable intermédiaire de type tableau de vehicules, que l'on va populer au fur et à mesure
* pour populer le tableau, on utilise la méthode `.push` et lui passer les listes de voitures et de bus grâce au spread operator (...)
```TypeScript
getVehicules(): Vehicule[] {
    let vehiculeArray: Vehicule[] = [];
    vehiculeArray.push(...this._cars.fleet, ...this._buses.fleet);
    return vehiculeArray;
}
```
On va ensuite créer la fonction pour créer la liste de véhicules `createVehiculeList` :
* cette fonction va retourner une chaîne de caractères (`string`), qui sera les balises options que l'on va injecter dans le html
* on passera par une variable transitoire que l'on va initialiser à du texte vide, 
* et que l'on va populer en itérant sur la liste de la flotte de véhicules grâce à une boucle for  
* dans chaque balise option, on ajoutera pour `value` la plaque d'imatriculation pour pouvoir identifier clairement le véhicule et le louer spécifiquement
```TypeScript
function createVehiculeList(): string {
    let txt = "";
    for (let vehicule of vehiculeFleet.getVehicules()) {
        txt += `<option value="${vehicule.registration}">${vehicule.registration} (${vehicule.type})</option>`;
    }
    return txt;
}
```
On récupérera ensuite la balise select depuis le DOM pour lui injecter le résultat de notre nouvelle fonction
```TypeScript
const selectListElement = document.querySelector("#vehicule-list")! as HTMLSelectElement;
selectListElement.innerHTML = createVehiculeList();
``` 

## Étape 7 : Finalisation du projet

### Instructions

* Au clic sur le bouton louer, le système doit retirer le véhicule correspondant à la plaque d'immatriculation sélectionnée de la liste de véhicules disponibles et mettre à jour l'affichage des véhicules dans le DOM.
* Modifier la fonction `rentVehicule` de la classe `VehiculeFleet` pour louer un véhicule à partir d'une plaque d'immatriculation (ou ajouter une nouvelle fonction)
* Ajouter la fonction `getVehiculeRegistration` permettant de récupérer un véhicule à partir de son numéro d'immatricutation. Si aucun véhicule ne correspond, la fonction retourne `null`
* Ajouter la fonction `rentVehicule` dans la classe `VehiculeList` pour permettre de louer un véhicule en particulier

### Corrections

Pour commencer, on va récupérer le bouton depuis le DOM grâce à son identifiant, puis ajouter un écouteur d'événement pour lui ajouter une action au travers d'une fonction anonyme : 
* récupérer l'immatriculation du véhicule sélectionné
* puis déclencher la fonction de location : on créera une nouvelle fonction `rentSingleVehicule` qui prendra en paramètre la plaque d'immatriculation
* déclencher la mise à jour de la liste de véhicules dans le DOM
```TypeScript
const rentButtonElement = document.querySelector("#rent-button")! as HTMLButtonElement;
rentButtonElement.addEventListener("click", () => {
    const selectedRegistration = selectListElement.value;
    vehiculeFleet.rentSingleVehicule(selectedRegistration);
    selectListElement.innerHTML = createVehiculeList();
});
```
On va maintenant écrire la nouvelle fonction `rentSingleVehicule` :
* Cette fonction se situe dans la classe `VehiculeFleet`, elle prend en paramètre une immatriculation
* on va lui ajouter une variable intermédiaire `vehicule`, qui est le véhicule récupéré grâce à son immatriculation
    * on aura besoin d'une nouvelle fonction subsidiaire `getVehiculeRegistration()` qui prend également en paramètre une immatriculation
    * elle va itérer sur la liste des véhicules pour retourner le véhicule correspondant à l'immatriculation
    * sinon, elle retourne `null`
* de retour dans la fonction `rentSingleVehicule`, 
    * on va devoir tester si notre variable `vehicule` existe pour supprimer le véhicule de la liste correspondante (bus ou voiture) via une nouvelle fonction `rentVehicule` (issue de la classe `VehiculeList`) qui prend en paramètre le véhicule à louer `vehiculeToRent`
    * sinon on enverra un message disant qu'il y a une erreur d'immatriculation.
* il ne reste plus qu'à écrire la fonction `rentVehicule` dans la classe `VehiculeList`
    * elle prend en paramètre le véhicule à louer de type générique (`T`)
    * elle fera appel à la méthode `.splice` pour supprimer un élément de la liste à l'index de l'élément passé en paramètre de `rentVehicule`.
* Pour tester, on va ajouter plusieurs véhicules à notre flotte
```TypeScript
enum VehiculeType {
    BUS = "bus",
    CAR = "car"
}

abstract class Vehicule {
    constructor(
        private _registration: string,
        private _type: string,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

class Bus extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.BUS)
    }
}

class Car extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.CAR)
    }
}

class VehiculeList<T> {
    private _fleet: Array<T> = [];

    get fleet() { return this._fleet; }

    addVehicule(vehicule: T) {
        this._fleet.push(vehicule);
    }

    removeLastEntry() {
        if (this._fleet.length > 0) {
            this._fleet.pop();
        }
    }

    rentVehicule(vehicule: T) {
        this._fleet.splice(this._fleet.indexOf(vehicule), 1);
    }
}

class VehiculeFleet {
    private _cars: VehiculeList<Car> = new VehiculeList<Car>();
    private _buses: VehiculeList<Bus> = new VehiculeList<Bus>();

    get cars() { return this._cars; }
    get buses() { return this._buses; }

    addVehicule<T extends Vehicule>(vehicule: T) {
        if (vehicule.type === VehiculeType.BUS) {
            this._buses.addVehicule(vehicule as Bus);
        } else if (vehicule.type === VehiculeType.CAR) {
            this._cars.addVehicule(vehicule as Car);
        }
    }

    rentVehicule(vehiculeType: VehiculeType) {
        if (vehiculeType === VehiculeType.BUS) {
            this._buses.removeLastEntry();
        } else if (vehiculeType === VehiculeType.CAR) {
            this._cars.removeLastEntry();
        }
    }

    displayFleet() {
        console.log("Cars in fleet:");
        for (let car of this._cars.fleet) {
            console.log(`- ${car.registration}`);
        }

        console.log("Buses in fleet:");
        for (let bus of this._buses.fleet) {
            console.log(`- ${bus.registration}`);
        }
    }

    getVehicules(): Vehicule[] {
        let vehiculeArray: Vehicule[] = [];
        vehiculeArray.push(...this._cars.fleet, ...this._buses.fleet);
        return vehiculeArray;
    }

    rentSingleVehicule(registration: string) {
        let vehiculeToRent = this.getVehiculeRegistration(registration);
        if (vehiculeToRent) {
            if (vehiculeToRent.type === VehiculeType.BUS) {
                this._buses.rentVehicule(vehiculeToRent as Bus);
            } else if (vehiculeToRent.type === VehiculeType.CAR) {
                this._cars.rentVehicule(vehiculeToRent as Car);
            }
        } else {
            throw {message: "Erreur d'immatriculation"}
        }
    }

    private getVehiculeRegistration(registration: string): Vehicule | null {
        let vehicules = this.getVehicules();
        for (let v of vehicules) {
            if (v.registration === registration) {
                return v;
            }
        }
        return null;
    }
}

let busOne = new Bus("XX-1111-XX");
let busTwo = new Bus("YY-2222-YY");
let busThree = new Bus("ZZ-3333-ZZ");
let carOne = new Car("AA-1111-AA");
let carTwo = new Car("BB-2222-BB");
let carThree = new Car("CC-3333-CC");

let vehiculeFleet = new VehiculeFleet();
vehiculeFleet.displayFleet();
vehiculeFleet.addVehicule(busOne);
vehiculeFleet.addVehicule(busTwo);
vehiculeFleet.addVehicule(carOne);
vehiculeFleet.addVehicule(carTwo);
vehiculeFleet.addVehicule(busThree);
vehiculeFleet.addVehicule(carThree);
vehiculeFleet.displayFleet();

const selectListElement = document.querySelector("#vehicule-list")! as HTMLSelectElement;
selectListElement.innerHTML = createVehiculeList();

function createVehiculeList(): string {
    let txt = "";
    for (let vehicule of vehiculeFleet.getVehicules()) {
        txt += `<option value="${vehicule.registration}">${vehicule.registration} (${vehicule.type})</option>`;
    }
    return txt;
}

const rentButtonElement = document.querySelector("#rent-button")! as HTMLButtonElement;
rentButtonElement.addEventListener("click", () => {
    const selectedRegistration = selectListElement.value;
    vehiculeFleet.rentSingleVehicule(selectedRegistration);
    selectListElement.innerHTML = createVehiculeList();
});
```

## Bonus : refactorisation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vehicule fleet</title>
</head>
<body>
    <div id="app">
        <select id="vehicule-list"></select>
        <button id="rent-button">Louer</button>
    </div>
    <script src="./dist/index.js"></script>
</body>
</html>
```

```TypeScript
enum VehiculeType {
    BUS = "bus",
    CAR = "car"
}

abstract class Vehicule {
    constructor(
        private readonly _registration: string,
        private readonly _type: VehiculeType,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

class Bus extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.BUS)
    }
}

class Car extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.CAR)
    }
}

class VehiculeList<T> {
    private _fleet: Array<T> = [];

    get fleet() { return this._fleet; }

    addVehicule(vehicule: T) {
        this._fleet.push(vehicule);
    }

    removeLastEntry() {
        if (this._fleet.length > 0) {
            this._fleet.pop();
        }
    }

    rentVehicule(vehicule: T) {
        const index = this._fleet.indexOf(vehicule);
        if (index !== -1) {
            this._fleet.splice(index, 1);
        }
    }
}

class VehiculeFleet {
    private readonly _cars: VehiculeList<Car> = new VehiculeList<Car>();
    private readonly _buses: VehiculeList<Bus> = new VehiculeList<Bus>();

    get cars() { return this._cars; }
    get buses() { return this._buses; }

    addVehicule<T extends Vehicule>(vehicule: T) {
        if (vehicule.type === VehiculeType.BUS) {
            this._buses.addVehicule(vehicule as Bus);
        } else if (vehicule.type === VehiculeType.CAR) {
            this._cars.addVehicule(vehicule as Car);
        }
    }

    rentVehicule(vehiculeType: VehiculeType) {
        if (vehiculeType === VehiculeType.BUS) {
            this._buses.removeLastEntry();
        } else if (vehiculeType === VehiculeType.CAR) {
            this._cars.removeLastEntry();
        }
    }

    displayFleet() {
        console.log("Cars in fleet:");
        for (let car of this._cars.fleet) {
            console.log(`- ${car.registration}`);
        }

        console.log("Buses in fleet:");
        for (let bus of this._buses.fleet) {
            console.log(`- ${bus.registration}`);
        }
    }

    getVehicules(): Vehicule[] {
        return [...this._cars.fleet, ...this._buses.fleet];
    }

    rentSingleVehicule(registration: string) {
        const vehiculeToRent = this.getVehiculeRegistration(registration);
        if (!vehiculeToRent) {
            throw new Error("Erreur d'immatriculation");
        } 

        if (vehiculeToRent.type === VehiculeType.BUS) {
            this._buses.rentVehicule(vehiculeToRent as Bus);
        } else if (vehiculeToRent.type === VehiculeType.CAR) {
            this._cars.rentVehicule(vehiculeToRent as Car);
        }
    }

    private getVehiculeRegistration(registration: string): Vehicule | null {
        return this.getVehicules().find(v => v.registration === registration) ?? null;
    }
}

const busOne = new Bus("XX-1111-XX");
const busTwo = new Bus("YY-2222-YY");
const busThree = new Bus("ZZ-3333-ZZ");
const carOne = new Car("AA-1111-AA");
const carTwo = new Car("BB-2222-BB");
const carThree = new Car("CC-3333-CC");

const vehiculeFleet = new VehiculeFleet();
vehiculeFleet.displayFleet();
vehiculeFleet.addVehicule(busOne);
vehiculeFleet.addVehicule(busTwo);
vehiculeFleet.addVehicule(busThree);
vehiculeFleet.addVehicule(carOne);
vehiculeFleet.addVehicule(carTwo);
vehiculeFleet.addVehicule(carThree);
vehiculeFleet.displayFleet();

const selectListElement = document.querySelector("#vehicule-list")! as HTMLSelectElement;
function createVehiculeList(): string {
    return vehiculeFleet.getVehicules()
        .map(vehicule => `<option value="${vehicule.registration}">${vehicule.registration} (${vehicule.type})</option>`)
        .join('');
}
selectListElement.innerHTML = createVehiculeList();

const rentButtonElement = document.querySelector("#rent-button")! as HTMLButtonElement;
rentButtonElement.addEventListener("click", () => {
    const selectedRegistration = selectListElement.value;
    vehiculeFleet.rentSingleVehicule(selectedRegistration);
    selectListElement.innerHTML = createVehiculeList();
});
```