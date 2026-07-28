# 11. Projet : liste d'aliments

Ce troisième projet pratique met en application le module 4 (la programmation orientée objet) : créer une liste d'aliments et permettre à l'utilisateur de filtrer en fonction de la classe d'aliments. 

Qualité nutritionnelle : 
* A. Bonne
* B. Moyenne
* C. Mauvaise
* Toutes

En prendra aussi en considération les macros : protéines, lipide, glucides. 

## Sommaire

- [Étape 1 : préparer la structure du projet et initialiser](#etape-1--preparer-la-structure-du-projet-et-initialiser)
- [Étape 2 : préparer le HTML](#etape-2--preparer-le-html)
- [Étape 3 : Création de la classe pour les Aliments](#etape-3--creation-de-la-classe-pour-les-aliments)
- [Étape 4 : Création des classes viande et fruit](#etape-4--creation-des-classes-viande-et-fruit)
- [Étape 5 : Finalisation](#etape-5--finalisation)

## Étape 1 : préparer la structure du projet et initialiser

### Instruction

* Créer un fichier `index.html`
* Créer deux dossiers : `dist` et `src`
* Entrer la commande `tsc --init`
* Dans le nouveau fichier `tsconfig.json`, modifier `outDir` et `rootDir`
* Dans le dossier `src`, ajouter le fichier `main.ts`
* Lancer `tsc --watch` dans le terminal

## Étape 2 : préparer le HTML

### Instructions

Dans le fichier `index.html`, ajouter la structure standard ainsi que la structure de base pour le projet.

On aura besoin de : 
* une partie avec la phrase `Afficher les aliments de x valeur nutritionnelle`, x étant une liste déroulante,
* une partie tableau pour afficher les aliments qui seront filtrés

### Correction

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste d'Aliments</title>
</head>
<body>
    <div id="app">
        <h1>Liste d'Aliments</h1>
        <div>
            Afficher les aliments de 
            <select id="health-score-select">
                <option value="all">Toutes</option>
                <option value="bad">Mauvaises</option>
                <option value="average">Moyennes</option>
                <option value="good">Bonnes</option>
            </select>
             valeur nutritionnelle.
        </div>
        <table id="food-table" style="border:1px solid black;">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Calories</th>
                    <th>Lipides</th>
                    <th>Glucides</th>
                    <th>Protéines</th>
                    <th>Classe</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody id="food-table-body">
                <!-- Les lignes de la table seront générées ici -->
            </tbody>
        </table>
    </div>
    <script src="src/main.js"></script>
</body>
</html>
```

## Étape 3 : Création de la classe pour les Aliments

### Instructions

* Créer une classe `Food` permettant de représenter tous types d'aliments (fichier dédié)
* Un aliment est caractérisé par : 
    * un nom
    * une qualité nutritionnelle
    * un nombre de calories au 100g
    * un nombre de lipides au 100g
    * un nombre de glucies au 100g
    * un nombre de protéines au 100g
    * une image
* Créer une énumération pour la classe d'aliments avec les valeurs : 
    * A. (Bonne), 
    * B. (Moyenne), 
    * C. (Mauvaise)
* Une classe aliment devra conserver une liste de tous les aliments qui auront été générés. 
* Créer des Getters et des Setters nécessaires sur les attributs pouvant être modifiés.

Pour cela, on va utiliser les aliments suivants : 
* pomme : 
* poire :
* jambon :
* poulet :

On ajoutera aussi un dossier images contenant les images pour les aliments. 

### Correction

* On va commencer par créer un nouveau dossier `classes` dans `src`, qui va contenir un fichier `Food.class.ts` ou sera défini notre classe aliments. 
Il faudra intégrér le fichier script avant le fichier `main.js` qui utilisera les différentes classes qui devront être accessible avant : 
index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste d'Aliments</title>
</head>
<body>
    <div id="app">
        ...
    </div>
    <script src="src/classes/Food.class.js"></script>
    <script src="src/main.js"></script>
</body>
</html>
```
* Il faudra ensuite ajouter un dossier `images` dans P3 et ajouter des images récupérées depuis internet pour les aliments.
* la classe `Food` aura des attributs qu'on souhaite ne pas être modifiables et non accessibles depuis l'extérieur d'un objet : le nom de type string, le nutriscore et l'image de type string devront être `private`.
* Et ajouter un `enum` pour les attributs du nutriscore pour typer l'attribut nutriscore.
* Les autres propriétés (calories, lipides, protéines et glucides) seront chacune de type number et seront accessibles depuis l'extérieur de la classe (`public`) mais ne seront plus modifiables une fois instanciées, on utilisera donc `readonly` en complément. 
* On va ajouter aussi les getters et les setters pour les éléments `private`.
* Dernière chose à ajouter : la classe aliment devra être capable de connaître le statut des autres aliments. On va donc ajouter un attribut liste qui sera un tableau d'aliments en `static`(accessible uniquement depuis la classe), et indiquer qu'à chaque aliment qu'on instancie la liste sera complétée.
Food.classes.ts
```TypeScript
enum HealthScoreClass {
    GOOD = "A",
    AVERAGE = "B",
    POOR = "C"
}

class Food {
    public static foodList: Food[] = [];

    constructor(
        private _name: string, 
        public readonly calories: number, 
        public readonly protein: number, 
        public readonly carbohydrates: number, 
        public readonly fat: number, 
        private _healthScore: HealthScoreClass, 
        private _image: string,
    ) {
        Food.foodList.push(this);
    }

    get name(): string { return this._name; }
    get healthScore(): HealthScoreClass { return this._healthScore; }
    get image(): string { return this._image; }
    set name(newName: string) {
        this._name = newName;
    }
    set healthScore(newHealthScore: HealthScoreClass) {
        this._healthScore = newHealthScore;
    }
    set image(newImage: string) {
        this._image = newImage;
    }
}

let food1 = new Food("Apple", 52, 0.3, 14, 0.2, HealthScoreClass.GOOD, "apple.jpg");
let food2 = new Food("Pear", 57, 0.4, 15, 0.1, HealthScoreClass.GOOD, "pear.jpg");
```

## Étape 4 : Création des classes viande et fruit

### Instructions 

* Créer les classes viande et fruit qui héritent de la classe aliment. 
* Lors de l'instanciation de l'un des aliments, la qualité nutritionnelle sera définie comme suit : 
    * viande : moyenne
    * fruit : bonne
* Les deux classes permettent d'accéder directement à la liste de leurs aliments.
* La classe aliments ne pourra pas être instanciée.
* Mettre chaque classe dans un fichier dédié

### Correction

* On va commencer par rendre la classe `Food` non instanciable et donc ne plus générer d'aliments génériques, on va la passer en `abstract`. 
* bonus : on pourra en profiter pour ajouter des fonctions abstraites pour afficher les aliments, dès lors, il faudra implémenter cette fonction dans chacune des classes filles. 
* on pensera aussi à ajouter une fonction permettant d'afficher les valeurs nutritionnelles, uniquement exploitable depuis les classes filles (`protected`).
```TypeScript
abstract class Food {
    public static foodList: Food[] = [];

    constructor(
        protected _name: string, 
        public readonly calories: number, 
        public readonly protein: number, 
        public readonly carbohydrates: number, 
        public readonly fat: number, 
        protected _healthScore: HealthScoreClass, 
        protected _image: string,
    ) {
        Food.foodList.push(this);
    }

    get name(): string { return this._name; }
    get healthScore(): HealthScoreClass { return this._healthScore; }
    get image(): string { return this._image; }
    set name(newName: string) {
        this._name = newName;
    }
    set healthScore(newHealthScore: HealthScoreClass) {
        this._healthScore = newHealthScore;
    }
    set image(newImage: string) {
        this._image = newImage;
    }

    abstract displayFood(): void;
    protected displayNutritionalInfo(): void {
        console.log(`Nutritional Information for ${this._name}:`);
        console.log(`Calories: ${this.calories}`);
        console.log(`Protein: ${this.protein}g`);
        console.log(`Carbohydrates: ${this.carbohydrates}g`);
        console.log(`Fat: ${this.fat}g`);
        console.log(`Health Score: ${this._healthScore}`);
    }
}
```
* On ensuite créer les nouvelles classes dans le fichier de classe existant
```TypeScript
class Fruit extends Food {}
class Meat extends Food {}
```
* Étant donné que l'on souhaite pouvoir accéder à tous les attributs depuis les classes filles, on va modifier les attributs `private` en `protected`.
* On va ensuite créer le constructeur qui devra faire appel au constructeur de la classe mère grâce à la fonction `super()`, qui prendra en paramètre les éléments nécessaire correspondant au constructeur de la class aliment. Attention, chaque nouvelle classe a son propre nutriscore qui sera directement indiqué dans son constructeur. 
* Enfin, chaque classe fille contiendra son attribut liste propre
```TypeScript
class Fruit extends Food {
    public static fruitList: Fruit[] = [];

    constructor(
        name: string, 
        calories: number, 
        protein: number, 
        carbohydrates: number, 
        fat: number, 
        image: string,
    ) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.GOOD, image);
        Fruit.fruitList.push(this);
    }

    public displayFood(): void {
        console.log(`Fruit: ${this._name}`);
        this.displayNutritionalInfo();
    }
}

class Meat extends Food {
    public static meatList: Meat[] = [];

    constructor(
        name: string, 
        calories: number, 
        protein: number, 
        carbohydrates: number, 
        fat: number, 
        image: string,
    ) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.AVERAGE, image);
        Meat.meatList.push(this);
    }

    public displayFood(): void {
        console.log(`Meat: ${this._name}`);
        this.displayNutritionalInfo();
    }
}
```
* Maintenant que nos classes sont toutes créées, on va les séparer dans leur fichiers propres que l'on va créer dans le dossier `classes` : 
    * `Fruit.class.ts`
    * `Meat.class.ts`
* On va ensuite copier coller le code correspondant à chaque classe dans chacun des fichiers class.
* Le code lié à l'instanciation des classes n'a rien à faire dans le fichier de classe Food, et devra donc être mis dans le fichier `main.ts`.
```TypeScript
new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

for (let f of Food.foodList) {
    f.displayFood();
    console.log('-------------------');
}
```
* Enfin, le fichier html devra être modifié pour intégrer chacun des fichiers `.js` correspondant à nos nouvelles classes
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste d'Aliments</title>
</head>
<body>
    <div id="app">
        ...
    </div>
    <script src="src/classes/Food.class.js"></script>
    <script src="src/classes/Fruit.class.js"></script>
    <script src="src/classes/Meat.class.js"></script>
    <script src="src/main.js"></script>
</body>
</html>
```

## Étape 5 : Finalisation

### Instructions

* Le fichier `main.ts` doit permettre de créer les 4 aliments comme décrits dans le tableau
* Les informations doivent être listées dans le fichier HTML dans la balise `tbody` du tableau
* La liste déroulante doit permettre de filtrer sur les aliments

### Correction

* On va commencer par afficher tous les aliments dans notre tableau html : 
    * on va récupérer la balise tbody du DOM dans notre fichier TypeScript `main.ts` grâce à son identifiant `food-table-body`
    * on va ensuite créer une variable string vide que l'on va populer avec les données du tableau
    * et finir par intégrer notre nouvelle variable dans la balise tbody
```TypeScript
new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

const tableBody = document.querySelector("#food-table-body")! as HTMLTableSectionElement;
let foodListBalise = "";
for (let food of Food.foodList) {
    foodListBalise += `
        <tr>
            <td>${food.name}</td>
            <td>${food.calories}</td>
            <td>${food.fat}</td>
            <td>${food.carbohydrates}</td>
            <td>${food.protein}</td>
            <td>${food.healthScore}</td>
            <td><img src="./images/${food.image}" alt="${food.name}" width="100"></td>
        </tr>
    `;
}
tableBody.innerHTML = foodListBalise;
```
* Maintenant que nous avons affiché le tableau d'éléments, on va ajouter le système pour filtrer le tableau : 
    * on va récupérer les valeurs des options de la balise `select` grâce à son id `health-score-select`
    * il faudra ensuite ajouter l'écoute du changement de l'élément directement dans la liste déroulante avec l'attribut `onChange` qui appelera directement une fonction `updateFoodList()`
```html
...
<body>
    <div id="app">
        <h1>Liste d'Aliments</h1>
        <div>
            Afficher les aliments de 
            <select id="health-score-select" onChange="updateFoodList()">
                <option value="all">Toutes</option>
                <option value="bad">Mauvaises</option>
                <option value="average">Moyennes</option>
                <option value="good">Bonnes</option>
            </select>
             valeur nutritionnelle.
        </div>
    ...
```
    * cette fonction `updateFoodList()` devra être ajoutée et encadrera le code déjà écrit dans le fichier `main.ts`.
```TypeScript
function updateFoodList() {
    const healthScoreSelectOptions = (document.querySelector("#health-score-select")! as HTMLSelectElement).value;
    console.log({healthScoreSelectOptions});

    const tableBody = document.querySelector("#food-table-body")! as HTMLTableSectionElement;
    let foodListBalise = "";
    for (let food of Food.foodList) {
        foodListBalise += `
            <tr>
                <td>${food.name}</td>
                <td>${food.calories}</td>
                <td>${food.fat}</td>
                <td>${food.carbohydrates}</td>
                <td>${food.protein}</td>
                <td>${food.healthScore}</td>
                <td><img src="./images/${food.image}" alt="${food.name}" width="100"></td>
            </tr>
        `;
    }
    tableBody.innerHTML = foodListBalise;
}
```
* pour que les aliments s'affichent au démarrage, il faudra penser à appeler la fonction directement 
* pour filtrer les aliments, il faudra modifier le code pour parcourir une liste complète d'aliments. On passera par une variable intermédiaire `selectedFoodList` qui va réceptionner le résultat d'une nouvelle fonction `getWantedFood()` qui prendra en paramètre l'option sélectionnée et qui filtrera la liste des aliments selon l'option sélectionnée à l'aide d'un `switch ... case`. 
* On ajoutera aussi une variable intermédiaire pour éviter d'être trop spécifique, un objet contenant 3 propriétés qui vont regrouper les listes correpondantes :
```TypeScript
const foodList = {
    bad: [],
    average: Meat.meatList,
    good: Fruit.fruitList,
}

function getWantedFood(healthScore: string): any[] {
    switch (healthScore) {
        case "all":
            return Food.foodList;
        case "bad":
            return [];
        case "average":
            return foodList.average;
        case "good":
            return foodList.good;
        default:
            return [];
    }
}
```

État complet du code : 
index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste d'Aliments</title>
</head>
<body>
    <div id="app">
        <h1>Liste d'Aliments</h1>
        <div>
            Afficher les aliments de 
            <select id="health-score-select" onChange="updateFoodList()">
                <option value="all">Toutes</option>
                <option value="bad">Mauvaises</option>
                <option value="average">Moyennes</option>
                <option value="good">Bonnes</option>
            </select>
             valeur nutritionnelle.
        </div>
        <table id="food-table" style="border:1px solid black;">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Calories</th>
                    <th>Lipides</th>
                    <th>Glucides</th>
                    <th>Protéines</th>
                    <th>Classe</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody id="food-table-body">
                <!-- Les lignes de la table seront générées ici -->
            </tbody>
        </table>
    </div>
    <script src="dist/classes/Food.class.js"></script>
    <script src="dist/classes/Fruit.class.js"></script>
    <script src="dist/classes/Meat.class.js"></script>
    <script src="dist/main.js"></script>
</body>
</html>
```
./src/main.ts
```TypeScript
new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

updateFoodList();

function updateFoodList() {
    const healthScoreSelectOptions = (document.querySelector("#health-score-select")! as HTMLSelectElement).value;
    let selectedFoodList = getWantedFood(healthScoreSelectOptions);
    
    const tableBody = document.querySelector("#food-table-body")! as HTMLTableSectionElement;
    

    let foodListBalise = "";
    for (let food of selectedFoodList) {
        foodListBalise += `
            <tr>
                <td>${food.name}</td>
                <td>${food.calories}</td>
                <td>${food.fat}</td>
                <td>${food.carbohydrates}</td>
                <td>${food.protein}</td>
                <td>${food.healthScore}</td>
                <td><img src="./images/${food.image}" alt="${food.name}" width="100"></td>
            </tr>
        `;
    }
    tableBody.innerHTML = foodListBalise;
}

const foodList = {
    bad: [],
    average: Meat.meatList,
    good: Fruit.fruitList,
}

function getWantedFood(healthScore: string): any[] {
    switch (healthScore) {
        case "all":
            return Food.foodList;
        case "bad":
            return [];
        case "average":
            return foodList.average;
        case "good":
            return foodList.good;
        default:
            return [];
    }
}
``` 
./src/classes/Food.class.ts
```TypeScript
enum HealthScoreClass {
    GOOD = "A",
    AVERAGE = "B",
    POOR = "C"
}

abstract class Food {
    public static foodList: Food[] = [];

    constructor(
        protected _name: string, 
        public readonly calories: number, 
        public readonly protein: number, 
        public readonly carbohydrates: number, 
        public readonly fat: number, 
        protected _healthScore: HealthScoreClass, 
        protected _image: string,
    ) {
        Food.foodList.push(this);
    }

    get name(): string { return this._name; }
    get healthScore(): HealthScoreClass { return this._healthScore; }
    get image(): string { return this._image; }
    set name(newName: string) {
        this._name = newName;
    }
    set healthScore(newHealthScore: HealthScoreClass) {
        this._healthScore = newHealthScore;
    }
    set image(newImage: string) {
        this._image = newImage;
    }

    abstract displayFood(): void;

    protected displayNutritionalInfo(): void {
        console.log(`Nutritional Information for ${this._name}:`);
        console.log(`Calories: ${this.calories}`);
        console.log(`Protein: ${this.protein}g`);
        console.log(`Carbohydrates: ${this.carbohydrates}g`);
        console.log(`Fat: ${this.fat}g`);
        console.log(`Health Score: ${this._healthScore}`);
    }
}
```
./src/classes/Fruit.class.ts
```TypeScript
class Fruit extends Food {
    public static fruitList: Fruit[] = [];

    constructor(
        name: string, 
        calories: number, 
        protein: number, 
        carbohydrates: number, 
        fat: number, 
        image: string,
    ) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.GOOD, image);
        Fruit.fruitList.push(this);
    }

    public displayFood(): void {
        console.log(`Fruit: ${this._name}`);
        this.displayNutritionalInfo();
    }
}
```
./src/classes/Meat.class.ts
```TypeScript
class Meat extends Food {
    public static meatList: Meat[] = [];

    constructor(
        name: string, 
        calories: number, 
        protein: number, 
        carbohydrates: number, 
        fat: number, 
        image: string,
    ) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.AVERAGE, image);
        Meat.meatList.push(this);
    }

    public displayFood(): void {
        console.log(`Meat: ${this._name}`);
        this.displayNutritionalInfo();
    }
}
```

### BONUS : refactorisation

Dans un soucis de bonne pratique, on va refactoriser le code ci dessus : 

index.html :
* suppression du onChange pour le remplacer par un écouteur d'événement dans notre fichier typescript
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste d'Aliments</title>
</head>
<body>
    <div id="app">
        <h1>Liste d'Aliments</h1>
        <div>
            Afficher les aliments de 
            <select id="health-score-select">
                <option value="all">Toutes</option>
                <option value="bad">Mauvaises</option>
                <option value="average">Moyennes</option>
                <option value="good">Bonnes</option>
            </select>
             valeur nutritionnelle.
        </div>
        <table id="food-table" style="border:1px solid black;">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Calories</th>
                    <th>Lipides</th>
                    <th>Glucides</th>
                    <th>Protéines</th>
                    <th>Classe</th>
                    <th>Image</th>
                </tr>
            </thead>
            <tbody id="food-table-body">
                <!-- Les lignes de la table seront générées ici -->
            </tbody>
        </table>
    </div>
    <script src="dist/classes/Food.class.js"></script>
    <script src="dist/classes/Fruit.class.js"></script>
    <script src="dist/classes/Meat.class.js"></script>
    <script src="dist/main.js"></script>
</body>
</html>
```

main.ts : 
* extraction des constantes `healthScoreSelect` et `foodTableBody` hors des fonctions
* ajout des constantes `IMAGES_PATH` et `IMAGES_WIDTH`
* ajout de l'event listener au changement de la liste déroulante
* modification de la fonction `getWantedFood` avec l'utilisation de la method `.filter()` et typage de la fonction
```TypeScript
new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

const healthScoreSelect = document.querySelector("#health-score-select")! as HTMLSelectElement;
const foodTableBody = document.querySelector("#food-table-body")! as HTMLTableSectionElement;

const IMAGES_PATH = "./images/";
const IMAGES_WIDTH = 100;

healthScoreSelect.addEventListener("change", updateFoodList);

updateFoodList();

function updateFoodList() {
    foodTableBody.innerHTML = "";

    const selectedFoodList = getWantedFood(healthScoreSelect.value);
    
    for (const food of selectedFoodList) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${food.name}</td>
            <td>${food.calories}</td>
            <td>${food.protein}</td>
            <td>${food.carbohydrates}</td>
            <td>${food.fat}</td>
            <td><img src="${IMAGES_PATH}${food.image}" alt="${food.name}" width="${IMAGES_WIDTH}"></td>
        `;
        foodTableBody.appendChild(row);
    }
}

function getWantedFood(healthScore: string): Food[] {
    switch (healthScore) {
        case "all":
            return Food.foodList;
        case "bad":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.POOR);
        case "average":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.AVERAGE);
        case "good":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.GOOD);
        default:
            return [];
    }
}
```

## Pour aller plus loin : modulariser ce projet (chapitre 7)

Le code ci-dessus fonctionne, mais toutes les classes (`Food`, `Fruit`, `Meat`) restent accessibles globalement via de simples balises `<script>` dans `index.html`, dans le bon ordre. Une fois le chapitre 7 vu (imports de fichiers), ce même projet est repris et modularisé de deux façons différentes dans [Projets-de-cours/](../Projets-de-cours/) :

- **P3-food-list-refacto-with-imports** : chaque classe est déplacée dans son propre fichier, avec de vrais `export`/`import` ES modules.
- **P3-food-list-refacto-with-namespaces** : la même séparation en fichiers, mais avec des `namespace` TypeScript et des directives `/// <reference path="..." />`, l'approche legacy présentée dans le chapitre 7.

Comparer les deux versions est un bon exercice pour bien comprendre pourquoi les modules ES sont aujourd'hui l'approche recommandée.