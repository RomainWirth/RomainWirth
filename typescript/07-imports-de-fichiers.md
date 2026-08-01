# 7. Les imports de fichiers

## Sommaire

- [Les 3 approches possibles](#les-3-approches-possibles)
- [Les Namespaces](#les-namespaces)
- [Les modules JavaScript (ES modules)](#les-modules-javascript-es-modules)
- [Complément : les exports par défaut](#complement--les-exports-par-defaut)
- [Complément : les imports de types (`import type`)](#complement--les-imports-de-types-import-type)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Les 3 approches possibles

Quand un projet TypeScript est réparti sur plusieurs fichiers, il existe trois façons de les faire fonctionner ensemble une fois compilés :

* **Une balise `<script>` par fichier `.js` généré** : simple à comprendre, mais lourd à maintenir (il faut ajouter une balise à chaque nouveau fichier, dans le bon ordre) et source d'erreurs.
* **Les modules JavaScript (ES modules)** : la syntaxe standard `import`/`export`, native à JavaScript depuis ES6. Elle permet l'auto-complétion et une vérification fiable de ce qui est importé, mais ne fonctionne que sur des navigateurs récents, et nécessite un serveur local (sinon on obtient des erreurs CORS en ouvrant directement le fichier HTML).
* **Les namespaces TypeScript** : une fonctionnalité propre à TypeScript, qui fonctionne même sur d'anciens environnements JavaScript (le code généré ne contient aucune trace du mot-clé `namespace`, qui n'existe pas en JS). En contrepartie, l'auto-complétion est moins fiable et c'est une approche spécifique à TypeScript, différente des standards du langage.

Recommandation : privilégier les modules JavaScript si le projet cible ES6 ou supérieur (ce qui est le cas dans la grande majorité des projets aujourd'hui). Les namespaces restent utiles à connaître pour comprendre du code existant, mais sont aujourd'hui une approche legacy, y compris dans la documentation officielle de TypeScript.

## Les Namespaces

Pour utiliser les namespaces, il faut d'abord adapter le `tsconfig.json` du projet :
* remplacer `"module": "commonjs"` par `"module": "amd"` (ou `"system"`, seuls modules compatibles avec l'option `outFile`).
* ajouter une option `outFile`, qui indique le fichier (par convention `bundle.js`) dans lequel tout le code compilé sera regroupé.

Une fois compilé, seul ce fichier `bundle.js` doit être importé dans le HTML, à la place de toutes les balises `<script>` individuelles.

### Exemple

En partant du projet P3 (qui intègre chaque fichier séparément via une balise `<script>` par classe), voici comment le faire fonctionner avec des namespaces :

1. Dans `tsconfig.json` :
   * `"module": "amd"` à la place de `"commonjs"`.
   * `"target"` sur une version égale ou supérieure à `es6`.
   * `"outFile": "./dist/bundle.js"`.

2. Vider le dossier `dist` du projet, puis relancer `tsc --watch` : deux nouveaux fichiers apparaissent, `bundle.js` et `bundle.js.map`.

> `ATTENTION` : depuis TypeScript 6.0, les options `"module": "amd"` (ainsi que `"umd"` et `"system"`) et `outFile` ne sont plus supportées du tout : il ne s'agit pas d'une simple dépréciation contournable, mais d'une suppression immédiate et définitive (contrairement à d'autres dépréciations de la 6.0, comme `target: es5` ou `moduleResolution: node`, qui restent utilisables via `"ignoreDeprecations": "6.0"`). Concrètement, avec un `npm install typescript` aujourd'hui, le code ci-dessus ne compile plus : `tsc` refuse directement ces valeurs. Pour suivre cette section telle quelle, il faut installer une version 5.x de TypeScript (`npm install --save-dev typescript@5`). Cette section reste utile pour comprendre du code existant ou ancien, mais l'approche par namespaces n'a plus vraiment d'avenir dans un nouveau projet : le seul moyen d'obtenir un fichier unique à partir de plusieurs fichiers compilés est de passer par un bundler externe (esbuild, Vite, Webpack, Rollup), en combinaison avec des modules ES plutôt que des namespaces.

3. Dans le HTML, remplacer toutes les balises `<script>` existantes par une seule, pointant vers ce fichier :

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
        <!-- ... -->
    </div>
    <script src="./dist/bundle.js"></script>
</body>
</html>
```

4. Dans le fichier de classe principal `Food.class.ts`, entourer tout le contenu du fichier d'un `namespace` (le nom, ici `App`, est libre), et exporter chaque élément dont on aura besoin ailleurs avec le mot-clé `export` :

```typescript
namespace App {
  export enum HealthScoreClass {
    GOOD = "A",
    AVERAGE = "B",
    POOR = "C",
  }

  export abstract class Food {
    // ... reste du code de la classe, inchangé
  }
}
```

5. Dans les autres fichiers de classes (`Fruit.class.ts`, `Meat.class.ts`), ajouter en tout premier lieu une directive triple-slash faisant référence au fichier dont on dépend. Ce n'est pas une balise HTML, malgré sa syntaxe : c'est un commentaire spécial, propre à TypeScript, qui indique au compilateur l'ordre dans lequel assembler les fichiers du namespace. Il faut ensuite, comme pour le fichier principal, encapsuler le code dans le même namespace et exporter ce qui doit être accessible ailleurs :

```typescript
/// <reference path="./Food.class.ts" />

namespace App {
  export class Meat extends Food {
    // ...
  }
}
```

6. Dans `main.ts`, importer de la même façon tous les fichiers nécessaires via des directives triple-slash, et encapsuler tout le code du fichier dans le même namespace `App` pour pouvoir utiliser ce qui a été importé :

```typescript
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
        return Food.foodList.filter((food) => food.healthScore === HealthScoreClass.POOR);
      case "average":
        return Food.foodList.filter((food) => food.healthScore === HealthScoreClass.AVERAGE);
      case "good":
        return Food.foodList.filter((food) => food.healthScore === HealthScoreClass.GOOD);
      default:
        return [];
    }
  }
}
```

Si le projet de départ utilisait encore l'attribut HTML `onchange` sur la balise `<select>` plutôt qu'un écouteur d'événements, c'est l'occasion de migrer vers `addEventListener`, comme fait ci-dessus avec `healthScoreSelect.addEventListener("change", updateFoodList)`.

## Les modules JavaScript (ES modules)

Les modules JavaScript ne sont disponibles qu'à partir d'ES6. C'est la syntaxe recommandée dès que le projet cible cette version ou une version supérieure, puisqu'elle fonctionne nativement avec JavaScript (contrairement aux namespaces, propres à TypeScript).

Pour l'utiliser :
* exporter et importer les éléments nécessaires avec les mots-clés `export` et `import`.
* s'assurer que la target du projet est `es6` ou supérieure.
* n'inclure dans le HTML que le fichier d'entrée (`main.js`), avec l'attribut `type="module"`.
* travailler avec un serveur local (l'extension VS Code `Live Server` fonctionne bien pour ça) : les navigateurs bloquent le chargement de modules ES depuis un fichier ouvert directement (`file://`), à cause des règles CORS. Ce n'est un problème qu'en local ; une fois déployé sur un vrai serveur, tout fonctionne normalement.

### Exemple

En reprenant le projet P3 pour utiliser les imports plutôt que les namespaces :

1. Dans `tsconfig.json`, remplacer `"module": "commonjs"` par `"module": "esnext"` (ou `"es6"`), avec une target supérieure à `es5`.

2. Dans le HTML, ne garder qu'une seule balise `<script>`, avec `type="module"` :

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
        <!-- ... -->
    </div>
    <script type="module" src="./dist/main.js"></script>
</body>
</html>
```

3. Dans chaque fichier TypeScript, ajouter `export` devant chaque élément utilisé ailleurs (sauf dans `main.ts`, qui n'a besoin que d'importer), et `import` en tête des fichiers qui en ont besoin. Préciser l'extension `.js` dans le chemin d'import est optionnel avec `tsc` (contrairement à certains environnements Node en ESM strict, qui l'exigent) :

`Food.class.ts`
```typescript
export enum HealthScoreClass {
  GOOD = "A",
  AVERAGE = "B",
  POOR = "C",
}

export abstract class Food {
  // ...
}
```

`Meat.class.ts`
```typescript
import { Food, HealthScoreClass } from "./Food.class";

export class Meat extends Food {
  // ...
}
```

`Fruit.class.ts`
```typescript
import { Food, HealthScoreClass } from "./Food.class";

export class Fruit extends Food {
  // ...
}
```

`main.ts`
```typescript
import { Fruit } from "./classes/Fruit.class";
import { Meat } from "./classes/Meat.class";
import { Food, HealthScoreClass } from "./classes/Food.class";

new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");
```

## Complément : les exports par défaut

Le cours ne montre que des exports nommés (`export enum ...`, `export class ...`), importés avec des accolades (`import { Food } from ...`). Il existe une seconde forme, l'**export par défaut**, très répandue dans l'écosystème JavaScript/TypeScript moderne (par exemple dans la plupart des composants React) :

```typescript
// Logger.ts
export default class Logger {
  log(message: string) {
    console.log(message);
  }
}
```

```typescript
// main.ts
import Logger from "./Logger"; // pas d'accolades, et le nom choisi à l'import est libre
```

Un fichier ne peut avoir qu'un seul export par défaut, mais peut le combiner avec autant d'exports nommés que nécessaire. Les exports nommés restent en général préférables dans un projet avec plusieurs classes ou fonctions à exporter par fichier (comme c'est le cas ici pour `Food`, `Meat` et `Fruit`), car ils obligent à utiliser le même nom partout et permettent un renommage plus sûr avec les outils de refactoring.

## Complément : les imports de types (`import type`)

Quand un import ne sert qu'à annoter des types (une `interface`, un `type`, ou une classe utilisée uniquement comme type de paramètre, jamais instanciée dans le fichier), TypeScript propose une syntaxe dédiée : `import type`.

```typescript
import type { User } from "./User";
import { createUser } from "./User";

function displayUser(user: User): void {
  console.log(user.name);
}
```

L'intérêt est que ce genre d'import est entièrement supprimé à la compilation : il ne reste aucune trace de `import type { User }` dans le fichier `.js` généré, puisqu'un type n'existe de toute façon plus une fois le code compilé. Ce n'est pas obligatoire (un `import` classique fonctionne aussi très bien pour importer un type), mais ça rend explicite, dès la lecture du fichier, ce qui est une vraie dépendance d'exécution et ce qui n'est qu'une dépendance de typage.

## Application pratique

* **P3-food-list-refacto-with-namespaces** : reprend le projet P3-food-list initial pour le convertir à l'approche par namespaces, exactement comme détaillé plus haut.
* **P3-food-list-refacto-with-imports** : reprend le même projet de départ, mais avec l'approche par modules ES (`import`/`export`), l'approche recommandée pour un projet ciblant ES6 ou supérieur.

## Résumé

- Il existe 3 façons de faire fonctionner plusieurs fichiers TypeScript ensemble : une balise `<script>` par fichier, les modules ES (`import`/`export`), ou les namespaces TypeScript.
- Les modules ES sont l'approche recommandée pour tout projet ciblant ES6 ou supérieur : syntaxe standard, auto-complétion fiable, mais nécessite un serveur local (CORS) et un navigateur récent.
- Les namespaces fonctionnent même sur d'anciens environnements JS (aucune trace du mot-clé `namespace` dans le code généré), mais sont une approche spécifique à TypeScript, aujourd'hui considérée comme legacy.
- Utiliser des namespaces nécessite `"module": "amd"` (ou `"system"`) et une option `outFile` dans `tsconfig.json`, ainsi que des directives triple-slash (`/// <reference path="..." />`, un commentaire spécial TypeScript, pas une balise HTML) pour indiquer l'ordre des fichiers.
- Depuis TypeScript 6.0, `"module": "amd"/"umd"/"system"` et `outFile` ne sont plus du tout supportés (suppression immédiate, sans contournement possible via `ignoreDeprecations`). Pour suivre cette section, il faut rester sur TypeScript 5.x ; cette approche n'a de toute façon plus d'avenir dans un nouveau projet.
- Utiliser des modules ES nécessite `"module": "esnext"` (ou équivalent), l'attribut `type="module"` sur la balise `<script>`, et `export`/`import` dans chaque fichier concerné.
- En plus des exports nommés vus dans le cours, il existe les exports par défaut (`export default`), un seul par fichier, souvent utilisés pour des fichiers ne contenant qu'une seule classe ou fonction principale.
- `import type` importe uniquement un type (sans aucune trace dans le code compilé), pour distinguer une dépendance de typage d'une vraie dépendance d'exécution.
