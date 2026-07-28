# 4. La programmation orientée objet

## Sommaire

- [Rappels sur la POO](#rappels-sur-la-poo)
- [Le mot clé `this`](#le-mot-cle-this)
- [Visibilité et accessibilité](#visibilite-et-accessibilite)
- [Complément : l'assertion de définition tardive (`!`)](#complement--lassertion-de-definition-tardive-)
- [Les paramètres de constructeur raccourcis](#les-parametres-de-constructeur-raccourcis)
- [Getters et setters](#getters-et-setters)
- [Le mot clé `readonly`](#le-mot-cle-readonly)
- [Le mot clé `static`](#le-mot-cle-static)
- [L'héritage](#lheritage)
- [Le mot clé `abstract`](#le-mot-cle-abstract)
- [Les interfaces sur les classes](#les-interfaces-sur-les-classes)
- [Complément : les vrais champs privés avec `#`](#complement--les-vrais-champs-prives-avec-)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Rappels sur la POO

JavaScript est à la base un langage orienté prototype, pas un langage orienté objet. Les versions récentes permettent d'écrire du code avec une syntaxe proche de la POO (classes ES6), mais plusieurs concepts clés de la POO restent absents ou limités (visibilité des attributs, interfaces, classes abstraites...). TypeScript comble une grande partie de ces manques.

Petit rappel de vocabulaire :
* la **programmation procédurale** représente les données avec des variables séparées et les traitements avec des fonctions séparées, sans lien direct entre les deux ;
* la **programmation orientée objet** regroupe données et traitements dans une même entité, la **classe**, qu'on peut ensuite **instancier** (créer des objets concrets à partir du modèle) avec le mot-clé `new` ;
* un **attribut** correspond à une donnée brute de l'objet (nom, âge, couleur...), une **méthode** correspond à une fonctionnalité (un traitement) que l'objet peut réaliser.

Voici une classe JavaScript basique :

```javascript
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

  displayCar() {
    console.log("Brand : " + this.brand);
    console.log("Model : " + this.model);
    console.log("Colour : " + this.colour);
    console.log("Number of doors : " + this.nbDoors);
  }
}

const carOne = new Car("Ford", "Mustang", "black", 3);
carOne.displayCar();
```

En JavaScript, rien n'empêche de modifier directement un attribut depuis l'extérieur (`carOne.nbDoors = 12`), même si ça n'a pas de sens métier. TypeScript ajoute justement la possibilité de restreindre cette accessibilité, en plus d'imposer le typage des attributs et des paramètres.

## Le mot clé `this`

`this` fait référence aux informations de l'objet en train d'exécuter la méthode courante. On peut le traduire mentalement par "mon"/"ma" : `this.brand` se lit "ma marque".

TypeScript permet en plus de typer explicitement `this` comme premier paramètre d'une méthode (ce paramètre n'existe pas à l'exécution, il ne sert qu'à la vérification de type) :

```typescript
class Car {
  constructor(
    private brand: string,
    private model: string,
  ) {}

  displayCar(this: Car): void {
    console.log(`${this.brand} ${this.model}`);
  }
}
```

Cette précision devient utile si une méthode est un jour extraite de son objet, par exemple pour être utilisée comme callback : dans ce cas, `this` perd sa liaison naturelle avec l'objet d'origine.

```typescript
const carOne = new Car("Ford", "Mustang");

const displayFn = carOne.displayCar; // la méthode est extraite, this n'est plus lié à carOne
// displayFn(); // Erreur à l'exécution : this est undefined ici

const displayFnBound = carOne.displayCar.bind(carOne); // on relie explicitement this à carOne
displayFnBound(); // "Ford Mustang"
```

La note d'origine illustrait cette idée avec un objet littéral construit à partir de `.bind()`, mais la syntaxe utilisait un point-virgule à l'intérieur d'un objet (`{ displayCar: carOne.displayCar.bind(carOne); }`), ce qui ne compile pas : dans un objet littéral, les propriétés se séparent par des virgules, jamais par des points-virgules. L'exemple ci-dessus corrige ce point tout en gardant la même idée pédagogique (le rôle de `.bind()`).

## Visibilité et accessibilité

En POO, chaque information (attribut ou méthode) a une visibilité qui définit son accessibilité :
* `public` : accessible depuis n'importe où (comportement par défaut si aucun mot-clé n'est précisé) ;
* `private` : accessible uniquement depuis l'intérieur de la classe elle-même, via `this` ;
* `protected` : accessible depuis la classe elle-même et ses classes filles (voir la section sur l'héritage).

Il est recommandé de restreindre l'accessibilité des attributs autant que possible : si un attribut est modifiable directement de l'extérieur, rien ne garantit qu'il sera modifié en respectant les règles métier attendues (validation, cohérence avec d'autres attributs...). C'est pour ça qu'on privilégie `private`, combiné à des méthodes dédiées pour lire et modifier la donnée.

```typescript
class Car {
  private brand: string;
  private model: string;
  private nbDoors: number;

  constructor(brand: string, model: string, nbDoors: number) {
    this.brand = brand;
    this.model = model;
    this.nbDoors = nbDoors;
  }

  public updateNbDoors(nbDoors: number): void {
    this.nbDoors = nbDoors;
  }
}

const carOne = new Car("Ford", "Mustang", 3);
carOne.nbDoors = 5;      // Erreur : "nbDoors" est private, inaccessible depuis l'extérieur
carOne.updateNbDoors(5); // OK : on passe par une méthode publique dédiée
```

## Complément : l'assertion de définition tardive (`!`)

Avec `strict` activé (voir chapitre 3), TypeScript impose par défaut qu'un attribut soit initialisé soit à sa déclaration, soit dans le constructeur (règle `strictPropertyInitialization`). Ce n'est pas toujours possible : par exemple, un attribut renseigné seulement plus tard, par une méthode d'initialisation dédiée :

```typescript
class Car {
  private brand!: string; // le "!" indique à TypeScript qu'on garantit que cet attribut sera bien initialisé, ailleurs que dans le constructeur

  public init(brand: string): void {
    this.brand = brand;
  }
}

const carOne = new Car();
carOne.init("Ford");
```

Sans ce `!`, TypeScript refuserait de compiler (`Property 'brand' has no initializer and is not definitely assigned in the constructor`). Ce `!` est une promesse faite au compilateur : si `init()` n'est jamais appelée avant d'utiliser `brand`, aucune erreur ne sera levée à la compilation, mais le programme plantera bel et bien à l'exécution.

## Les paramètres de constructeur raccourcis

Écrire la déclaration d'un attribut, puis l'assigner dans le constructeur (`this.brand = brand;`) pour chaque attribut devient vite répétitif. TypeScript propose un raccourci : ajouter directement un modificateur de visibilité (`public`, `private`, `protected`, `readonly`) devant un paramètre du constructeur. Cela déclare **et** initialise l'attribut en une seule fois.

```typescript
class Car {
  constructor(
    private brand: string,
    private model: string,
    private colour: string,
    private nbDoors: number,
  ) {}

  public displayCar(): void {
    console.log(`${this.brand} ${this.model}, ${this.colour}, ${this.nbDoors} portes`);
  }
}
```

C'est cette syntaxe raccourcie qui est utilisée dans la quasi-totalité des exemples suivants, car c'est la plus courante en TypeScript.

## Getters et setters

Un getter et un setter sont des méthodes qui permettent de lire et de modifier un attribut `private`, sans y accéder directement.

Il existe deux façons de les écrire.

### Méthode classique de la POO : méthodes `getX()` / `setX()`

```typescript
class Car {
  constructor(private brand: string) {}

  public getBrand(): string {
    return this.brand;
  }

  public setBrand(brand: string): void {
    this.brand = brand;
  }
}

const carOne = new Car("Ford");
console.log(carOne.getBrand()); // "Ford"
carOne.setBrand("Chevrolet");
```

Une astuce courante consiste à faire retourner `this` par les setters, ce qui permet de chaîner les appels :

```typescript
class Car {
  constructor(
    private brand: string,
    private model: string,
    private colour: string,
  ) {}

  public setBrand(brand: string): Car {
    this.brand = brand;
    return this;
  }

  public setModel(model: string): Car {
    this.model = model;
    return this;
  }

  public setColour(colour: string): Car {
    this.colour = colour;
    return this;
  }
}

const carOne = new Car("Ford", "Mustang", "black");
carOne.setBrand("Chevrolet").setModel("Camaro").setColour("yellow");
```
Getters et setters sont totalement facultatifs : on ne les écrit que pour les attributs qu'on souhaite réellement rendre lisibles et/ou modifiables depuis l'extérieur.

### Syntaxe dédiée de TypeScript : `get`/`set`

TypeScript propose une syntaxe d'accesseur native, très proche de celle des objets JavaScript. Par convention, l'attribut privé sous-jacent est préfixé par un underscore `_`, pour bien le distinguer de l'accesseur public qui porte le même nom sans préfixe :

```typescript
class Car {
  constructor(private _brand: string) {}

  get brand(): string {
    return this._brand;
  }

  set brand(newBrand: string) {
    this._brand = newBrand;
  }
}

const carOne = new Car("Ford");
console.log(carOne.brand); // appel du getter, sans parenthèses : "Ford"
carOne.brand = "Chevrolet"; // appel du setter, comme une simple affectation
```

La note d'origine ajoutait un type de retour explicite sur le setter (`set brand(newBrand: string): void { ... }`). Ce n'est pas autorisé : un `set` accessor ne peut jamais déclarer de type de retour en TypeScript (erreur `TS1095 : A 'set' accessor cannot have a return type annotation`), puisqu'un setter ne retourne jamais rien par définition.

Avec cette syntaxe, `carOne.brand` n'est ni un attribut public classique, ni un vrai appel de fonction visible : c'est un appel caché au getter (en lecture) ou au setter (en écriture). C'est plus concis, mais aussi moins explicite à la lecture qu'un `getBrand()`/`setBrand()` classique : les deux approches sont valables, à choisir selon les préférences de l'équipe.

## Le mot clé `readonly`

`readonly` interdit de modifier une propriété après son initialisation (dans le constructeur, ou directement à la déclaration).

```typescript
class Car {
  constructor(
    private brand: string,
    public readonly year: number,
  ) {}
}

const carOne = new Car("Ford", 2020);
const carTwo = new Car("Ford", 2021);
console.log(carOne.year); // 2020
console.log(carTwo.year); // 2021
carOne.year = 2019; // Erreur : "year" est en lecture seule
```

Chaque instance peut donc avoir sa propre valeur pour un attribut `readonly`, initialisée via le constructeur. Si on initialise l'attribut directement à sa déclaration (sans passer par le constructeur), la valeur devient au contraire identique pour tous les objets créés à partir de la classe :

```typescript
class Car {
  public readonly year: number = 2019;

  constructor(private brand: string) {}
}

const carOne = new Car("Ford");
const carTwo = new Car("Chevrolet");
console.log(carOne.year); // 2019
console.log(carTwo.year); // 2019
```

`readonly` n'est pas l'équivalent d'une constante de classe : TypeScript ne permet pas de définir directement une valeur strictement identique et partagée par toutes les instances autrement que via ce genre d'initialisation par défaut, ou via `static readonly` (voir la section suivante).

## Le mot clé `static`

Jusqu'ici, tous les attributs et méthodes sont dédiés à un objet précis, et accessibles via `this` (ou via le nom de l'objet si `public`). `static` permet à l'inverse de définir un attribut ou une méthode dédiée à la classe elle-même, accessible directement via le nom de la classe.

`static` est utile pour :
* définir des constantes de classe (en le combinant à `readonly`) ;
* regrouper une liste d'instances créées à partir de la classe ;
* définir des fonctions utilitaires communes (récupération de données, calculs...), y compris dans une classe qui ne sert qu'à ça (une "boîte à outils").

```typescript
class Car {
  public static readonly VAT: number = 20;

  constructor(
    private brand: string,
    public readonly year: number,
  ) {}

  public displayVat(): void {
    console.log(Car.VAT); // on accède à VAT via le nom de la classe, jamais via "this"
  }
}

console.log(Car.VAT); // 20, accessible sans instancier de voiture
```

On peut aussi regrouper les instances créées, mais attention à l'endroit où on le fait. Une première approche, qui fonctionne, mais qui n'est pas idéale du point de vue de la POO :

```typescript
class Car {
  public static carList: Car[] = [];

  constructor(private brand: string) {
    Car.carList.push(this); // chaque nouvelle voiture s'ajoute elle-même à la liste
  }
}
```
Le problème : chaque voiture "connaît" la liste globale de toutes les voitures, ce qui viole le principe qu'un objet doit rester une entité autonome. Une classe dédiée à la gestion de la liste est une meilleure séparation des responsabilités :

```typescript
class Car {
  constructor(private brand: string) {}
}

class CarFleet {
  public carList: Car[] = [];

  public addCar(car: Car): void {
    this.carList.push(car);
  }
}

const carOne = new Car("Ford");
const carTwo = new Car("Chevrolet");

const americanCarFleet = new CarFleet();
americanCarFleet.addCar(carOne);
americanCarFleet.addCar(carTwo);
```

La note d'origine nommait l'attribut statique `CarList` (avec une majuscule). Par convention, un attribut ou une variable s'écrit toujours en camelCase (`carList`), la majuscule en première lettre étant réservée aux noms de classes, d'interfaces et de types. Le nom a été corrigé en conséquence.

`static` fonctionne aussi sur les méthodes, par exemple pour une classe purement utilitaire :

```typescript
class ToolBox {
  public static displayArrayElements(array: unknown[]): void {
    for (const el of array) {
      console.log(el);
    }
  }

  public static calculateAverage(...numbers: number[]): number {
    let sum = 0;
    for (const n of numbers) {
      sum += n;
    }
    return sum / numbers.length;
  }
}

const grades = [10, 15, 20];

ToolBox.displayArrayElements(grades);
console.log(ToolBox.calculateAverage(...grades)); // 15
```

La note d'origine appelait `ToolBox.calculateAverage(grades)` en passant directement le tableau `grades`. Or `calculateAverage` attend un paramètre "rest" (`...numbers: number[]`), c'est-à-dire une suite de nombres séparés, pas un tableau unique. Il faut utiliser l'opérateur de décomposition (`...grades`) au moment de l'appel pour éclater le tableau en arguments individuels, sinon TypeScript refuse la compilation (un tableau `number[]` n'est pas assignable à un paramètre `number`).

## L'héritage

L'héritage permet à une classe (la classe fille) de reprendre les attributs et méthodes d'une autre classe (la classe mère). Une classe fille ne peut avoir qu'une seule classe mère directe, mais une classe mère peut avoir plusieurs classes filles.

Le mot-clé `protected` permet à un attribut d'être accessible depuis la classe mère et ses classes filles, mais pas depuis l'extérieur (contrairement à `private`, qui bloque même les classes filles). Dans le constructeur d'une classe fille, l'appel à `super(...)` est obligatoire : il déclenche le constructeur de la classe mère avec les paramètres attendus par celle-ci.

```typescript
class Car {
  public static readonly VAT: number = 20;

  constructor(
    protected brand: string,
    protected model: string,
    protected colour: string,
    protected readonly year: number,
  ) {}

  public displayCar(): void {
    console.log(`${this.brand} ${this.model}, ${this.colour}, ${this.year}`);
  }

  get brandName(): string {
    return this.brand;
  }
}

class RaceCar extends Car {
  private speed: number;

  constructor(brand: string, model: string, year: number, speed: number) {
    super(brand, model, "blue", year); // toutes les voitures de course sont bleues
    this.speed = speed;
  }

  public displaySpeed(): void {
    console.log("Vitesse max : " + this.speed);
  }

  // redéfinition (override) de la méthode de la classe mère
  public override displayCar(): void {
    super.displayCar(); // appel explicite de la méthode de la classe mère
    this.displaySpeed();
  }
}

const raceCarOne = new RaceCar("Ferrari", "SF90", 2025, 340);
raceCarOne.displayCar();
```

Le mot-clé `override` (disponible depuis TypeScript 4.3) n'est pas obligatoire par défaut, mais fortement recommandé : il indique explicitement qu'une méthode redéfinit volontairement une méthode de la classe mère. Si la méthode de la classe mère est renommée ou supprimée par erreur, TypeScript signale une erreur sur le `override` orphelin, ce qui évite un bug silencieux.

## Le mot clé `abstract`

Une classe abstraite définit une structure commune à plusieurs classes filles, avec la possibilité de laisser certaines méthodes sans implémentation (des méthodes abstraites). Une classe abstraite ne peut jamais être instanciée directement, seulement héritée.

```typescript
abstract class Car {
  constructor(
    protected brand: string,
    protected model: string,
    protected readonly year: number,
  ) {}

  abstract displayCar(): void; // aucune implémentation ici, obligatoire dans les classes filles
}

class RaceCar extends Car {
  constructor(
    brand: string,
    model: string,
    year: number,
    private speed: number,
  ) {
    super(brand, model, year);
  }

  public displayCar(): void {
    console.log(`${this.brand} ${this.model} (${this.year}), vitesse max : ${this.speed}`);
  }
}

const raceCarOne = new RaceCar("Ferrari", "SF90", 2025, 340);
raceCarOne.displayCar();
// const genericCar = new Car("Ford", "Mustang", 2020); // Erreur : impossible d'instancier une classe abstraite
```

La note d'origine déclarait à la fois un champ `public readonly year: number;` en haut de la classe abstraite, et un paramètre de constructeur `protected readonly year: number` juste en dessous. Les deux déclarent un attribut nommé `year` avec des visibilités différentes (`public` puis `protected`) : TypeScript refuse cette redéclaration (`Duplicate identifier 'year'`). L'exemple ci-dessus ne garde que la déclaration via le paramètre de constructeur, qui suffit à elle seule à déclarer et initialiser l'attribut.

## Les interfaces sur les classes

Une interface peut aussi décrire la structure attendue d'une classe. Le mot-clé `implements` impose qu'une classe fournisse bien toutes les propriétés et méthodes définies par l'interface. Contrairement à l'héritage (une seule classe mère possible), une classe peut implémenter plusieurs interfaces à la fois.

```typescript
interface Vehicule {
  mass: number;
  calculateWeight(): number;
}

interface Drivable {
  nbWheels: number;
}

abstract class Car implements Vehicule, Drivable {
  constructor(
    protected brand: string,
    protected model: string,
    public mass: number,
    public nbWheels: number = 4,
  ) {}

  public calculateWeight(): number {
    return this.mass * 9.81;
  }

  abstract displayCar(): void;
}

class RaceCar extends Car {
  constructor(brand: string, model: string, mass: number, private speed: number) {
    super(brand, model, mass);
  }

  public displayCar(): void {
    console.log(`${this.brand} ${this.model}`);
    console.log("Masse : " + this.mass);
    console.log("Poids : " + this.calculateWeight());
    console.log("Vitesse max : " + this.speed);
  }
}
```

La note d'origine déclarait l'attribut `mass` avec un underscore (`public _mass: number`), alors que l'interface `Vehicule` exige une propriété nommée exactement `mass`. Une classe qui n'a pas de propriété portant exactement le nom attendu par l'interface ne "l'implémente" pas correctement (`Class 'Car' incorrectly implements interface 'Vehicule'`). Comme cet attribut est `public` (pas besoin de passer par un getter dédié), l'underscore n'a d'ailleurs pas lieu d'être : la convention du préfixe `_` ne s'applique qu'aux attributs privés/protégés associés à un accesseur `get`/`set` du même nom.

La note d'origine contenait aussi une erreur de syntaxe dans l'affichage final : `console.log("Weight : " + this.calculateWeight();)`, où la parenthèse fermante de `console.log` était placée après le point-virgule au lieu d'avant. Corrigé en `console.log("Poids : " + this.calculateWeight());` ci-dessus.

Comme pour les classes abstraites, une interface ne peut jamais être instanciée directement : elle décrit uniquement une forme, sans aucune implémentation. Toutes les propriétés d'une interface sont implicitement publiques.

## Complément : les vrais champs privés avec `#`

Le mot-clé `private` de TypeScript n'existe qu'à la compilation : une fois le code transformé en JavaScript, `private` disparaît complètement, et l'attribut redevient accessible normalement depuis le fichier `.js` généré (ou depuis du code JavaScript qui utiliserait cette classe sans passer par le compilateur).

Depuis ES2022, JavaScript (et donc TypeScript) propose une vraie visibilité privée à l'exécution, avec le préfixe `#` :

```typescript
class Car {
  #brand: string;

  constructor(brand: string) {
    this.#brand = brand;
  }

  public getBrand(): string {
    return this.#brand;
  }
}

const carOne = new Car("Ford");
console.log(carOne.getBrand()); // "Ford"
console.log(carOne.#brand);     // Erreur, y compris dans le JavaScript généré
```

À la différence de `private`, un champ `#brand` reste réellement inaccessible depuis l'extérieur de la classe, même dans le fichier `.js` compilé. En pratique, le mot-clé `private` de TypeScript suffit dans la grande majorité des projets (l'équipe respecte les types), mais `#` est la solution à connaître si une vraie étanchéité est nécessaire (par exemple si la classe est publiée dans une librairie utilisée par du code externe non typé).

## Application pratique

* **P3 (food-list)**, et ses deux variantes **refacto-with-imports** et **refacto-with-namespaces** : ce projet met en pratique les classes, l'encapsulation (`private`/`protected` avec getters et setters), et potentiellement l'héritage ou les interfaces selon la modélisation retenue pour représenter les aliments et les listes de courses. Les deux variantes montrent aussi comment organiser plusieurs classes dans plusieurs fichiers (voir le chapitre sur les imports).

## Résumé

- La POO regroupe données (attributs) et traitements (méthodes) dans une classe, qu'on instancie avec `new`.
- `public`, `private` et `protected` contrôlent l'accessibilité d'un attribut ou d'une méthode ; `public` est la valeur par défaut.
- Ajouter un modificateur de visibilité directement devant un paramètre du constructeur déclare et initialise l'attribut en une seule ligne.
- Avec `strict`, un attribut initialisé en dehors du constructeur nécessite une assertion de définition tardive (`nom!: type`), sinon TypeScript refuse de compiler.
- Un getter/setter classique s'écrit en méthodes `getX()`/`setX()` ; la syntaxe `get`/`set` de TypeScript permet d'y accéder comme un simple attribut, mais un `set` ne peut jamais avoir de type de retour explicite.
- `readonly` interdit de modifier un attribut après son initialisation ; combiné à `static`, il permet de définir une vraie constante de classe.
- `static` rattache un attribut ou une méthode à la classe elle-même plutôt qu'à chaque instance, et s'accède via le nom de la classe.
- `extends` met en place l'héritage (une seule classe mère), `super(...)` appelle le constructeur (ou une méthode) de la classe mère, `protected` rend un attribut accessible aux classes filles.
- `override` signale explicitement qu'une méthode redéfinit celle d'une classe mère, et sécurise contre les erreurs de renommage.
- `abstract` définit une classe qui ne peut pas être instanciée directement, avec des méthodes à implémentation obligatoire dans les classes filles.
- `implements` impose qu'une classe respecte la structure d'une ou plusieurs interfaces ; toutes les propriétés d'une interface sont publiques.
- `private` de TypeScript n'existe qu'à la compilation ; les champs `#` (ES2022) offrent une vraie confidentialité à l'exécution.
