# 1. Introduction à TypeScript

## Sommaire

- [Qu'est-ce que TypeScript ?](#quest-ce-que-typescript-)
- [La problématique de JavaScript](#la-problematique-de-javascript)
- [Installer TypeScript](#installer-typescript)
- [Compiler du TypeScript](#compiler-du-typescript)
- [Premier exemple complet](#premier-exemple-complet)
- [Lire les erreurs de TypeScript](#lire-les-erreurs-de-typescript)
- [Les outils autour de TypeScript](#les-outils-autour-de-typescript)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Qu'est-ce que TypeScript ?

JavaScript est un langage faiblement typé. Concrètement, tu peux déclarer une variable, lui donner un nombre, puis lui réaffecter une chaîne de caractères juste après, sans que rien ne t'en empêche.

```javascript
let firstName = "Mario";
console.log(typeof firstName); // "string"
firstName = 30;
console.log(typeof firstName); // "number"
```

Ce comportement est très souple, mais il devient dangereux dès que le projet grossit ou qu'une équipe travaille dessus : rien ne garantit qu'une fonction reçoit bien le type de données qu'elle attend.

TypeScript est un langage qui reprend JavaScript et lui ajoute une couche de typage statique. On dit que c'est un **superset** de JavaScript : tout code JavaScript valide est aussi du code TypeScript valide, mais TypeScript ajoute la possibilité de déclarer explicitement le type des variables, des paramètres et des valeurs de retour.

Les deux apports principaux de TypeScript par rapport à JavaScript :
* la gestion des types (le compilateur vérifie la cohérence des types avant même d'exécuter le code) ;
* une meilleure prise en charge de la programmation orientée objet (JavaScript reste un langage orienté prototype, même si les classes ES6 imitent une syntaxe objet).

Le principal inconvénient de TypeScript, c'est qu'aucun navigateur ni Node.js ne sait l'exécuter directement. Le code doit d'abord être **compilé** en JavaScript. Cela ajoute un intermédiaire entre le code que tu écris et le code qui s'exécute réellement : tu ne peux par exemple plus tester tes bouts de code TypeScript directement dans la console du navigateur.

À ces deux inconvénients (nouvelle technologie à apprendre, compilation obligatoire), il faut ajouter le fait que le typage n'est vérifié qu'à la compilation. Une fois le fichier `.js` généré, plus aucune trace du typage : si quelqu'un modifie le fichier JavaScript compilé à la main, TypeScript ne peut plus rien vérifier.

## La problématique de JavaScript

Voici un exemple concret du problème posé par le typage faible de JavaScript : un formulaire additionnant deux nombres saisis par l'utilisateur.

`index.html`
```html
<h1>Additionner deux nombres</h1>
<div>
  <label for="nb1">Nombre 1 :</label>
  <input type="number" name="nb1" id="nb1">
</div>
<div>
  <label for="nb2">Nombre 2 :</label>
  <input type="number" name="nb2" id="nb2">
</div>
<input type="button" value="Calculer" id="calcul">
<div class="results"></div>
<script src="main.js"></script>
```

`main.js`
```javascript
const nb1 = document.querySelector("#nb1");
const nb2 = document.querySelector("#nb2");

document.querySelector("#calcul").addEventListener("click", function () {
  let result = add(nb1.value, nb2.value);
  document.querySelector(".results").innerHTML = result;
});

function add(n1, n2) {
  return n1 + n2;
}
```

Avec ce code, le résultat affiché n'est pas une addition, mais une concaténation : la valeur récupérée depuis un champ de formulaire (`nb1.value`) est toujours une chaîne de caractères, même si le champ est de type `number`. Si on saisit 3 et 4, le résultat affiché est `"34"` et non `7`.

Il existe plusieurs façons de corriger ce problème en JavaScript pur :

```javascript
// Conversion explicite avec parseInt
function add(n1, n2) {
  return parseInt(n1) + parseInt(n2);
}

// Vérification du type avant le calcul
function add(n1, n2) {
  if (typeof n1 === "number" && typeof n2 === "number") {
    return n1 + n2;
  } else {
    return "Les valeurs ne sont pas de type 'number'";
  }
}

// Conversion implicite avec l'opérateur unaire +
function add(n1, n2) {
  if (typeof n1 !== "number" || typeof n2 !== "number") {
    // +n1 force la conversion en nombre, équivalent à parseInt(n1)
    return +n1 + +n2;
  }
  return n1 + n2;
}
```

> Rappel : attention avec les opérateurs de comparaison : avec `&&`, la conversion ne se déclenche que si **les deux** valeurs ne sont pas des nombres. Si une seule des deux valeurs est une chaîne de caractères (cas le plus courant avec un champ de formulaire), la condition est fausse et le code retombe sur `n1 + n2`, qui reste une concaténation. Il faut utiliser `||` pour déclencher la conversion dès qu'**au moins une** des deux valeurs n'est pas un nombre.

Toutes ces solutions fonctionnent, mais elles demandent d'écrire du code défensif à la main, partout où c'est nécessaire. TypeScript permet d'éviter ça en détectant ces problèmes avant même l'exécution, directement lors de l'écriture du code.

## Installer TypeScript

TypeScript peut s'installer de deux façons.

**Installation globale**, pour pouvoir utiliser TypeScript dans n'importe quel projet de la machine :
```bash
npm install -g typescript
```

**Installation locale à un projet** (recommandée), pour figer la version de TypeScript utilisée par le projet :
```bash
npm init -y
npm install --save-dev typescript
```
`npm init -y` génère un fichier `package.json` à la racine du dossier. C'est ce fichier qui liste les dépendances du projet, dont TypeScript une fois installé.

Sur Linux, si Node.js n'est pas encore installé, tu peux passer par le gestionnaire de paquets de ta distribution :
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```
Si la version installée n'est pas une version LTS (Long Term Support) ou pose problème, il est recommandé d'utiliser [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager), qui permet d'installer, de mettre à jour et de basculer facilement entre plusieurs versions de Node.js.

Pour un projet côté navigateur (sans bundler), il est recommandé d'installer une extension d'éditeur adaptée. Sur VS Code :
* **ESLint** : détecte les problèmes de syntaxe, corrige automatiquement certains d'entre eux, et permet de personnaliser ses propres règles de qualité de code.
* **Material Icon Theme** : améliore la lisibilité de l'explorateur de fichiers avec des icônes dédiées par type de fichier.
* **Path Intellisense** : autocomplète les chemins de fichiers dans les imports.

## Compiler du TypeScript

Le compilateur de TypeScript s'appelle `tsc`. Pour compiler un fichier :
```bash
tsc main.ts
# ou, si TypeScript est installé localement au projet :
npx tsc main.ts
```
Cette commande lit `main.ts` et génère un fichier `main.js` à côté, prêt à être exécuté par un navigateur ou par Node.js.

Deux options utiles :
* `--target es6` (ou une autre version) permet de choisir la version de JavaScript générée par la compilation. Par défaut, `tsc` cible souvent une version assez ancienne de JavaScript (ES5), pour maximiser la compatibilité.
* `--watch` relance automatiquement la compilation à chaque sauvegarde du fichier, pratique pendant le développement :
```bash
tsc main.ts --watch
```

Dans un vrai projet, il est rare d'appeler `tsc` sur un seul fichier avec des options en ligne de commande à chaque fois. On configure plutôt un fichier `tsconfig.json` à la racine du projet, qui centralise toutes ces options (cible, dossiers source et de sortie, options de vérification stricte, etc.). Ce fichier est abordé plus en détail dans le chapitre sur la structure d'un projet.

## Premier exemple complet

Reprenons l'exemple du formulaire d'addition, mais cette fois écrit en TypeScript. Voici une première version, qui reprend simplement le code JavaScript existant dans un fichier `.ts` :

```typescript
const inputNb1 = document.querySelector("#nb1");
const inputNb2 = document.querySelector("#nb2");

document.querySelector("#calcul").addEventListener("click", function () {
  let result = addNumbers(inputNb1.value, inputNb2.value);
  document.querySelector(".results").innerHTML = result;
});

function addNumbers(n1, n2) {
  return n1 + n2;
}
```

Ce code ne compile pas tel quel : `document.querySelector` peut retourner `null` (si aucun élément ne correspond au sélecteur), et TypeScript refuse d'accéder à `.value` sur une valeur potentiellement `null`. De plus, les paramètres `n1` et `n2` de `addNumbers` n'ont pas de type explicite.

Voici la version corrigée et typée :

```typescript
const inputNb1 = document.querySelector("#nb1") as HTMLInputElement;
const inputNb2 = document.querySelector("#nb2") as HTMLInputElement;
const divResults = document.querySelector(".results") as HTMLDivElement;
const calculButton = document.querySelector("#calcul") as HTMLButtonElement;

calculButton.addEventListener("click", function () {
  const result = addNumbers(+inputNb1.value, +inputNb2.value);
  divResults.innerHTML = result.toString();
});

function addNumbers(n1: number, n2: number): number {
  return n1 + n2;
}
```

Ce qui a changé par rapport à la version précédente :
* Chaque élément du DOM récupéré est explicitement typé avec `as HTMLInputElement`, `as HTMLDivElement`, etc. Ce mot-clé `as` s'appelle une **assertion de type** : il indique à TypeScript "fais-moi confiance, je sais que cette valeur est de ce type précis", ce qui débloque l'accès à `.value` sans erreur de compilation.
* La fonction `addNumbers` attend maintenant deux paramètres de type `number` et retourne un `number`. TypeScript garantit qu'on ne pourra jamais l'appeler avec autre chose que des nombres.
* `inputNb1.value` (et `inputNb2.value`) restent des chaînes de caractères puisqu'un champ HTML retourne toujours du texte : l'opérateur unaire `+` convertit ces chaînes en nombres avant l'appel à `addNumbers`.
* `result` est de type `number` (déduit du type de retour de `addNumbers`). Comme `innerHTML` attend une chaîne de caractères, on doit appeler `.toString()` avant de l'assigner.

Le fait que TypeScript déduise tout seul le type de `result` sans qu'on l'écrive explicitement s'appelle **l'inférence de type**. TypeScript n'oblige pas à typer chaque variable : il devine le type le plus précis possible à partir de la valeur assignée. Ce n'est que dans les cas ambigus (paramètres de fonction, valeur potentiellement `null`, etc.) qu'un typage explicite est nécessaire.

Une fois compilé (`tsc main.ts`), voici le fichier `main.js` généré :
```javascript
var inputNb1 = document.querySelector("#nb1");
var inputNb2 = document.querySelector("#nb2");
var divResults = document.querySelector(".results");
var calculButton = document.querySelector("#calcul");
calculButton.addEventListener("click", function () {
    var result = addNumbers(+inputNb1.value, +inputNb2.value);
    divResults.innerHTML = result.toString();
});
function addNumbers(n1, n2) {
    return n1 + n2;
}
```

Ce code généré est au format ES5 (d'où l'usage de `var`) et ne contient plus aucune trace du typage : tout le travail de vérification a été fait au moment de la compilation, pas à l'exécution. C'est le fichier `.ts` qui reste la source de vérité du projet, le fichier `.js` généré n'est en principe jamais modifié à la main.

## Lire les erreurs de TypeScript

Quand TypeScript détecte un problème de typage, il ne compile pas et affiche un message d'erreur avec trois informations essentielles :
* le nom du fichier concerné ;
* le numéro de ligne et de colonne où se situe le problème ;
* un code d'erreur et une description.

Exemple :
```
index.ts:4:25 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```
Ici, `4:25` indique la ligne 4 et la colonne 25, `TS2345` est le code qui identifie précisément ce type d'erreur, et la description explique que l'argument passé est une `string` alors qu'un `number` était attendu.

Selon la complexité du code (notamment avec les génériques, voir le chapitre dédié), ces messages d'erreur peuvent devenir très longs et difficiles à lire. L'outil en ligne [TypeScript Error Translator](https://ts-error-translator.vercel.app/) permet de coller un message d'erreur TypeScript pour en obtenir une explication plus digeste.

## Les outils autour de TypeScript

Voici quelques ressources utiles à connaître dès le début de l'apprentissage, pour aller plus loin par toi-même :
* Le [bac à sable TypeScript](https://www.typescriptlang.org/play) (TypeScript Playground) : permet d'écrire et de tester du code TypeScript directement dans le navigateur, sans rien installer.
* La [documentation officielle de TypeScript](https://www.typescriptlang.org/fr/docs/handbook/typescript-from-scratch.html) : la ressource de référence en cas de doute sur une notion.
* L'extension VS Code [Total TypeScript](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator) : donne des conseils de syntaxe et intègre directement un traducteur d'erreurs dans l'éditeur.

## Application pratique

* **P1 (currency-convertor)** et **P2 (guess-the-flag)** : ces deux projets appliquent directement les bases de ce chapitre. Ils mettent en place un premier projet TypeScript fonctionnel : installation, configuration minimale, compilation, et manipulation d'éléments du DOM typés avec `as HTMLElement` (ou ses variantes), exactement comme dans l'exemple du formulaire d'addition ci-dessus.

## Résumé

- TypeScript est un superset de JavaScript qui ajoute un typage statique vérifié à la compilation.
- JavaScript est faiblement typé : une variable peut changer de type en cours d'exécution, ce qui peut provoquer des bugs silencieux (comme une addition qui devient une concaténation).
- Le code TypeScript (`.ts`) doit être compilé en JavaScript (`.js`) avant de pouvoir s'exécuter dans un navigateur ou Node.js, avec la commande `tsc`.
- `tsc fichier.ts --watch` recompile automatiquement à chaque modification, `--target` choisit la version de JavaScript générée.
- L'opérateur `as` permet une assertion de type, utile par exemple pour typer précisément un élément du DOM récupéré via `querySelector`.
- TypeScript pratique l'inférence de type : il n'est pas nécessaire de tout typer explicitement, seulement les cas ambigus (paramètres de fonction, valeurs potentiellement `null`, etc.).
- Une erreur TypeScript indique toujours le fichier, la ligne, la colonne, un code d'erreur (`TSxxxx`) et une description du problème.
- Un fichier `tsconfig.json` permet de centraliser la configuration du compilateur au lieu de répéter des options en ligne de commande (détaillé au chapitre 3).
