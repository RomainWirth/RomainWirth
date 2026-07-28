# 3. Préparer la structure d'un projet

## Sommaire

- [Créer un projet minimal](#creer-un-projet-minimal)
- [Compiler plusieurs fichiers avec `tsconfig.json`](#compiler-plusieurs-fichiers-avec-tsconfigjson)
- [Les options `tsconfig.json` à connaître en premier](#les-options-tsconfigjson-a-connaitre-en-premier)
- [Débugger le code TypeScript dans Chrome](#debugger-le-code-typescript-dans-chrome)
- [Structurer le projet avec `src` et `dist`](#structurer-le-projet-avec-src-et-dist)
- [Utiliser une librairie JavaScript dans un projet TypeScript](#utiliser-une-librairie-javascript-dans-un-projet-typescript)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Créer un projet minimal

Pour démarrer un projet TypeScript côté navigateur, la structure de base ressemble à n'importe quel petit projet web, avec un fichier `.ts` en plus :

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script src="main.js"></script>
</body>
</html>
```

`main.ts`
```typescript
const app = document.querySelector("#app")!;
app.innerHTML = "<h1>Hello TypeScript</h1>";
```

Le fichier HTML référence directement `main.js` (le fichier compilé), pas `main.ts`. Une balise `<div id="app">` vide sert de point d'entrée pour injecter du contenu généré depuis TypeScript.

Une fois ces deux fichiers en place, on ouvre un terminal à la racine du projet et on lance :
```bash
tsc main.ts
```
Ça génère `main.js` à côté de `main.ts`. Cette approche fonctionne, mais elle a une limite évidente : dès qu'un projet contient plusieurs fichiers `.ts`, il faudrait lancer `tsc` sur chacun d'eux manuellement. Ce n'est pas viable, d'où la nécessité d'un fichier de configuration.

## Compiler plusieurs fichiers avec `tsconfig.json`

Le fichier `tsconfig.json` centralise la configuration du compilateur pour tout le projet. Il se génère avec :
```bash
tsc --init
```

Une fois ce fichier présent à la racine du projet, la commande `tsc` (sans nom de fichier) compile automatiquement tous les fichiers `.ts` du projet en une seule fois, en respectant la configuration définie. `tsc --watch` fait la même chose, mais en recompilant à chaque sauvegarde.

Le fichier généré par `tsc --init` contient énormément d'options, presque toutes commentées par défaut. Il n'est pas nécessaire de toutes les connaître dès le début : on les active au fur et à mesure des besoins, en décommentant la ligne concernée.

## Les options `tsconfig.json` à connaître en premier

* **`target`** : la version de JavaScript générée à la compilation (`"es6"`, `"es2016"`, etc.). Plus la cible est récente, plus le code généré est proche de ce que tu as écrit (moins de transformations), mais moins il est compatible avec de vieux environnements.
* **`lib`** : la liste des bibliothèques de types que TypeScript doit prendre en compte (par exemple les API du DOM). Par défaut, TypeScript inclut un ensemble raisonnable de librairies déduit de `target`. Si tu décommentes cette ligne, il faut alors lister toi-même ce dont tu as besoin, par exemple `["DOM", "DOM.Iterable", "ES2016", "ScriptHost"]`.
* **`include`** et **`exclude`** (placées en dehors de `compilerOptions`) : permettent respectivement d'ajouter ou de retirer des fichiers de la compilation. Par exemple, si un fichier `test.ts` ne doit jamais être compilé avec le reste du projet, on l'ajoute au tableau `exclude`.
* **`sourceMap`** : génère un fichier `.js.map` à côté de chaque `.js`, qui fait le lien entre le code compilé et le fichier `.ts` d'origine. Indispensable pour déboguer confortablement (voir section suivante).

Il existe aussi des options qui n'apparaissent pas forcément dans les notes de cours d'origine, mais qui font partie des bonnes pratiques standard sur n'importe quel projet TypeScript :

* **`strict`** : active d'un coup tout un ensemble de vérifications strictes (interdiction des `any` implicites, vérification stricte du `null`/`undefined`, etc.). Il est fortement recommandé de l'activer dès le début d'un projet : l'activer après coup, une fois le projet avancé, oblige à corriger d'un coup toutes les zones du code qui en dépendaient implicitement.
* **`esModuleInterop`** : simplifie l'import de modules écrits en CommonJS (l'ancien système de modules de Node.js) depuis une syntaxe `import` moderne. Utile dès qu'on installe des dépendances via npm.
* **`skipLibCheck`** : ignore la vérification de type des fichiers `.d.ts` des dépendances installées. Ça accélère la compilation et évite d'être bloqué par une erreur de typage dans une librairie tierce qu'on ne maîtrise pas.

Toutes ces options se retrouvent dans le `tsconfig.json` généré automatiquement par `tsc --init` : il suffit de les décommenter (ou de vérifier qu'elles sont bien actives) plutôt que de les écrire à la main.

## Débugger le code TypeScript dans Chrome

Par défaut, l'onglet "Sources" des outils de développement du navigateur n'affiche que `index.html` et `main.js`, le fichier compilé. Impossible d'y placer un point d'arrêt directement dans le code TypeScript que tu as réellement écrit.

En activant l'option `sourceMap` dans `tsconfig.json` (elle est commentée par défaut, il suffit de retirer le commentaire) puis en relançant la compilation, un fichier `main.js.map` est généré à côté de `main.js`. Une fois la page rechargée, l'onglet "Sources" du navigateur affiche alors directement `main.ts`, avec la possibilité d'y poser des points d'arrêt comme sur n'importe quel fichier JavaScript classique.

Cette structure de fichiers (`.ts`, `.js` et `.js.map` mélangés à la racine) devient vite difficile à lire dès que le projet grossit, d'où l'intérêt de séparer les sources du code compilé.

## Structurer le projet avec `src` et `dist`

Deux options de `tsconfig.json` permettent de séparer proprement le code source du code compilé :
* **`rootDir`** : le dossier qui contient les fichiers `.ts` à compiler.
* **`outDir`** : le dossier où seront générés les fichiers `.js` compilés.

L'organisation la plus courante consiste à créer :
* un dossier `src/` qui contient tous les fichiers `.ts` du projet (dont `main.ts`) ;
* un dossier `dist/` qui contiendra les fichiers `.js` générés automatiquement par le compilateur, et qu'on ne modifie jamais à la main.

Dans `tsconfig.json`, on configure alors :
```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

En relançant `tsc` (ou en laissant tourner `tsc --watch`), le dossier `dist/` se remplit automatiquement avec les fichiers `.js` correspondant aux fichiers `.ts` de `src/`.

Il ne reste qu'à corriger le chemin de la balise `<script>` dans `index.html` pour pointer vers le nouvel emplacement du fichier compilé :
```html
<script src="dist/main.js"></script>
```

Comme le dossier `dist/` est entièrement généré, il est recommandé de l'ajouter à un fichier `.gitignore` si le projet est versionné avec Git : il n'y a aucun intérêt à suivre des fichiers générés automatiquement à chaque compilation.

## Utiliser une librairie JavaScript dans un projet TypeScript

Dès qu'un projet TypeScript installe une dépendance via npm, une question se pose : est-ce que cette librairie fournit elle-même ses types TypeScript ?

Sur la page npm d'une librairie, un badge à côté du nom du package l'indique directement :
* un badge bleu "TS" : la librairie fournit déjà ses propres types, rien à faire de plus ;
* un badge blanc "DT" : les types existent, mais dans un autre package à installer séparément ;
* aucun badge : aucun type n'existe, il faudra les écrire soi-même si on veut un typage complet.

Dans le deuxième cas (le plus fréquent), le projet [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) fournit des milliers de fichiers de déclaration de types pour des librairies JavaScript qui n'en fournissent pas nativement. On les installe avec :
```bash
npm install @types/nom-de-la-librairie
```
Par exemple, pour utiliser React avec ses types :
```bash
npm install @types/react
```
Une fois installé, TypeScript prend automatiquement en compte ces définitions, sans configuration supplémentaire.

Dans le troisième cas (aucun type disponible nulle part), il faut écrire soi-même un fichier de déclaration, avec l'extension `.d.ts`. La bonne pratique consiste à les regrouper dans un dossier `types/` à la racine du projet. Par exemple, pour typer une librairie fictive `to-no-case` :

```typescript
// types/to-no-case.d.ts
declare module "to-no-case" {
  export default function toNoCase(input: string): string;
}
```

Ce fichier ne contient aucune logique, seulement une déclaration de signature : le nom du module importé, et la forme de ce qu'il exporte (ici, une fonction par défaut qui prend une `string` et retourne une `string`). Une fois ce fichier présent dans le projet, l'import fonctionne normalement :

```typescript
import toNoCase from "to-no-case";
const str = toNoCase("my-string");
```

Pour que TypeScript prenne en compte automatiquement tous les fichiers `.d.ts` du dossier `types/`, on peut aussi passer par la clé [`include`](https://www.typescriptlang.org/tsconfig#include) du `tsconfig.json`, plutôt que d'importer le fichier de déclaration manuellement à chaque fois.

## Application pratique

* **P1 (currency-convertor)** et **P2 (guess-the-flag)** : les deux projets utilisent exactement la structure `src/` + `dist/` avec un `tsconfig.json` généré par `tsc --init`, dont les options `target`, `module`, `rootDir`, `outDir`, `sourceMap`, `strict` et `esModuleInterop` sont actives, comme décrit dans ce chapitre.

## Résumé

- Un fichier `tsconfig.json` (généré avec `tsc --init`) permet de compiler tous les fichiers `.ts` d'un projet en une seule commande `tsc`, plutôt que fichier par fichier.
- `target` choisit la version de JavaScript générée, `lib` précise les API disponibles (DOM, ES2016...), `include`/`exclude` ajoutent ou retirent des fichiers de la compilation.
- `strict` active d'un coup les vérifications de typage les plus importantes ; à activer dès le début d'un projet plutôt qu'après coup.
- `sourceMap` génère des fichiers `.js.map` qui permettent de déboguer directement le code `.ts` dans les outils de développement du navigateur.
- `rootDir` (dossier des sources `.ts`, en général `src/`) et `outDir` (dossier de sortie des `.js` compilés, en général `dist/`) séparent proprement code source et code généré.
- Le dossier de sortie (`dist/`) ne doit jamais être modifié à la main : il est entièrement régénéré à chaque compilation, et peut être ignoré par Git.
- Une librairie JS peut fournir ses propres types, avoir ses types disponibles via `@types/nom-de-la-librairie` (DefinitelyTyped), ou nécessiter l'écriture manuelle d'un fichier `.d.ts` avec `declare module`.
