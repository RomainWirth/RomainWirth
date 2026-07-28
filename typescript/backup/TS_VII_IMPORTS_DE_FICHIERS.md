# Les imports de fichiers

Avec TypeScript, il existe 3 façons pour utiliser plusieurs fichiers et les intégrer dans les pages web :
* Ajout d'une balise `<script>` par fichier `.js` généré :
    * Avantages : permet d'intégrer manuellement chaque fichier et d'assurer le fonctionnement.
    * Désavantage : lourd à mettre en place et risque d'erreur.
* Utilisation des modules JavaScript (ne fonctionne que sur des navigateurs modernes acceptant la suntaxe ES6) :
    * Avantages : permet d'assurer la bonne utilisation des informations récupérées dans les fichiers TypeScript (auto-completion).
    * Désavantages : ne fonctionne pas sur tous les navigateurs. Il faudra passer par un serveur local pour éviter les `CORS error`.
* Utilisation des Namespaces TypeScript :
    * Avantages : le code écrit fonctionnera dans toutes les version de JS (le code généré n'utilise pas la syntaxe des Namespace car elle n'existe pas en JS).
    * Désavantages : ne permet pas l'auto-complétion, risque d'erreur et fonctionnalité spécifique à TypeScript.

Recommandation : utiliser la syntaxe des modules JavaScript si le projet doit fonctionner en ES6 (ou supérieur).

## Les Namespaces

Pour pouvoir utiliser les namespaces, il faut commencer par faire des modification dans le fichier de configuration TypeScript du projet : 
* il faut modifier la ligne `"module": "commonjs",` en spéficiant `amd` à la place de `commonjs` : `"module": "amd",`.
* la ligne outFile devra spécifier un fichier `bundle.js` (par convention) qui va récupérer la compilation du code TypeScript.

Le fichier principal de TypeScript doit également être ajouté aux Namespace.

Enfin, il suffira d'importer le fichier `bundle.js` dans le html à la place de tous les autres imports des balises `script`.

### Exemple :

À partir du projet P3, on va refactoriser pour utiliser les namespaces. En effet, ce projet intègre chaque fichier séparément dans des balises script dans le html.
* on va commencer par modifier le fichier `tsconfig.json` : 
    * pour modifier la ligne module de `commonjs` vers `amd`, 
    * bien vérifier que target fait référence à une version ultérieur à `es5` pour que cela fonctionne.
    * modifier la ligne du fichier de sortie `outFile` : `"./dist/bundle.js"`

> Attention dépréciation

* on va ensuite supprimer tout le contenu du dossier `dist` du projet, pour ensuite lancer la commande `tsc --watch`. Deux nouveaux fichiers apparaissent dans ce dossier : `bundle.js` et `bundle.js.map`
* dans le html, on va supprimer les lignes script existantes pour les remplacer par une balise script faisant référence à ce fichier bundle : 
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
    <script src="./dist/bundle.js"></script>
</body>
</html>
```
* Dans le fichier de classe principals `Food.class.ts` : 
    * on va ajouter en haut du fichier un namespace grâce au mot clé `namespace`, que l'on va nommer `App` (peut être nommé différemment), suivi d'accolades `{}`. 
    * et on va déplacer tout le code contenu dans le fichier entre les accolades du namespace
    * en complément, il va falloir exporter chaque élément qu'on a besoin d'utiliser, en ajoutant le mot clé `export` devant : 
```TypeScript
namespace App {
    export enum HealthScoreClass {
        GOOD = "A",
        AVERAGE = "B",
        POOR = "C"
    }
    
    export abstract class Food {
        ...
    }
}
```
* Au niveau des autres fichiers class `Fruit.class.ts` et `Meat.class.ts` :
    * il va falloir d'abord ajouter l'import du namespace grâce à la syntaxe des 3 slash et d'une balise html `<reference />` ou il faut spécifier le `path` : `/// <reference path="./Food.class.ts" />`
    * et bien ajouter la classe courante dans le même namespace de la même manière qu'on a fait pour la classe principale, et exporter les éléments souhaités
```TypeScript
/// <reference path="./Food.class.ts" />

namespace App {
    export class Meat extends Food {
        ...
    }
}
```
* Au niveau du fichier principal `main.ts` :
    * il faut importer les fichiers nécessaires de la même manière que pour les classes avec la syntaxe des 3 slash et de la balise reference
    * pour pouvoir utiliser les imports dans ce fichier, il faut ici aussi encapsuler tout le code dans le même namespace `App`
```TypeScript
/// <reference path="./classes/Food.class.ts" />
/// <reference path="./classes/Meat.class.ts" />
/// <reference path="./classes/Fruit.class.ts" />

namespace App {
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
}
```

Dans le cas ou on aurait pas encore refactorisé le code en utilisant un écouteur d'événements au lieu d'utiliser la propriété `onChange` de la balise `<select>` du html, il faudra faire cette modification :
* modifier pour récupérer la balise select : `const healthScoreSelect = document.querySelector("#health-score-select")! as HTMLSelectElement;`
* ajouter un écouteur d'événement sur la balise select et lui passer la fonction updateFoodList : `healthScoreSelect.addEventListener("change", updateFoodList);`

## Les modules JavaScript

La fonctionnalité des modules JavaScript n'est disponible qu'en version ES6 et supérieur. 
Elle permet une écriture de code bien structurée. 

Cette syntaxe est recommandée puisqu'elle fonctionne directement avec JavaScript, alors que les namespaces sont spécifiques au langage TypeScript. 

Pour utiliser cette syntaxe : 
* il suffiera d'exporter et importer tous les éléments des fichiers dont on a besoin à l'aide des mots clés `export` et `import`.
* il faudra aussi bien entendu spécifier la target comme es6 ou supérieur.
* inclure le fichier principal dans une balise script dans le html.
* il faudra enfin travailler avec un serveur local pour que la fonctionnalité soit utilisable, on travaillera donc avec `Live Server` (problématique uniquement en local, car en production tout fonctionne sur un serveur)

### Exemple : 

À partir du projet P3, on va refactoriser pour utiliser les imports : 
* dans le fichier tsconfig, on va modifier la ligne `"module"` pour changer `"commonjs"` à `"esnext"`, et s'assurer qu'on est dans les dernières version de javascript (> es5)
* dans le html : 
    * on va supprimer les lignes script existantes pour ne garder que celle faisant référence au fichier `main.js`, 
    * et y ajouter une propriété `type="module"`
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
    <script type="module" src="./dist/main.js"></script>
</body>
</html>
```
* pour pouvoir utiliser le module, on va installer dans VSCode l'extension `Live Server`, qui va nous fournir un serveur local sur le port 5500, en cliquant sur un bouton en bas à droite de notre IDE (une fois l'extension installée).
* dans chaque fichier typescript : 
    * on va ajouter le mot clé `export` devant chaque élément requis dans les autres fichiers (sauf `main.ts` qui ne nécessite que les imports)
    * et ajouter au sommet des fichiers nécessitant les imports le mot clé `import` suivi des éléments à importer ainsi que la source (l'extension de fichier à spécifier est `.js` mais n'est pas obligatoire)

Food.class.ts
```TypeScript
export enum HealthScoreClass {
    GOOD = "A",
    AVERAGE = "B",
    POOR = "C"
}

export abstract class Food {
    ...
}
```
Meat.class.ts
```TypeScript
import { Food, HealthScoreClass } from './Food.class';

export class Meat extends Food {
    ...
}
```
Fruit.class.ts
```TypeScript
import { Food, HealthScoreClass } from './Food.class';

export class Fruit extends Food {
    ...
}
```
main.ts
```TypeScript
import { Fruit } from './classes/Fruit.class';
import { Meat } from './classes/Meat.class';
import { Food, HealthScoreClass } from './classes/Food.class';

new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

...
```

