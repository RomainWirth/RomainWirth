# Préparer la structure d'un projet 

A. Création du projet
B. Initialisation de la configuration du projet
C. Utiliser le debbuger de Chrome
D. Structurer le projet

## A. Création du projet

Pour initialiser un projet TypeScript, on va commencer par créer la structure de base d'un projet web : 
* un fichier `index.html` avec la structure de base, à laquelle on va intégrer la balise script qui fera référence à un fichier `.js`.
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="main.js"></script>
</body>
</html>
```
* un fichier avec l'extension `.ts` : `main.ts`. c'est dans ce fichier que l'on va créer tout le code nécessaire en typescript, qui sera compilé et transformé en JavaScript pour être interprêté par le navigateur. Pour récupérer les éléments du DOM depuis ce fichier typescript, on va devoir ajouter une balise vide `div` avec l'id `app`. 
```TypeScript
const app = document.querySelector('#app')!;
app.innerHTML = "<h1>Hello TypeScript</h1>";
```

Ceci est simplement l'initialisation qu'on fera évoluer par la suite, il est possible de faire différemment, en ajoutant plusieurs balises html qu'on ira récupérer grâce aux méthodes de manipulation du DOM.

Une fois ces étapes réalisées, on va ouvrir notre dossier courant dans le terminal intégré : `open in integrated terminal`, et entrer la commande `tsc main.ts` qui va permettre de générer un fichier `main.js` qui contiendra la compilation du code typescript. 

> N.B.: il faut au préalable installer le paquet typescript qui fournir la commande `tsc`

Une fois ces éléments en place, on va pouvoir initialiser le projet.

## B. Initialisation de la configuration du projet

Comment procédér si on a plusieurs fichiers TypeScript ? 
Manuellement, il faudrait générer chaque fichier `.js` correspondant via la commande `tsc`. Ce n'est pas viable. C'est pour cela qu'on va avoir recours à un fichier de configuration que l'on va générer pour tout compiler en une seule fois.

Pour générer ce fichier, on va avoir recours à la commande `tsc --init`. 
Un fichier `tsconfig.json` va être créé. maintenant, en utilisant la commande `tsc`, cela va générer automatiquement tous les fichier `.js` correspondants aux fichiers `.ts` du projet.

`tsc --watch` va permettre de prendre en compte chaque mise à jour des fichiers existants, sans avoir besoin de retaper la commande à chaque fois.

Le fichier `tsconfig.json` contient beaucoup de propriétés, avec une majorité qui est commentée. On aura la possibilité des les activer en temps voulu, simplement en décommentant la ligne concernée.
On va s'attarder sur plusieurs points : 
* `"target": "es2016",`, qu'on va faire passer à `es6` pour avoir la dernières version de JavaScript en compilé.
*  `"lib": []` va permettre de renseigner toutes les librairies que TypeScript va intégrer dans le projet. De base, le projet intègre certaines librairies par défaut. En décommentant cette ligne, il va falloir spécifier les librairies nécessaires qu'on doit intégrer. Les informations de base sont : `["DOM", "DOM.Iterable", "ES6", "ScriptHost"]`.

Si on ajoute d'autre fichiers `.ts` au projet, et qu'on ne souhaite pas que ces fichiers soient compilés en `.js`, on va ajouter une propriété `"exclude": []` en dehors de l'objet `"compilerOptions"`. Le tableau devra contenir les fichiers qu'on ne souhaite pas prendre en compte. Par exemple, si on ajoute un fichier `test.ts` au projet et qu'on ajoute ce nom au tableau exclude, en relançant la commande `tsc`, seul le fichier `main.js` va être créé.
Au contraire, si on souhaite inclure d'autres fichiers, on ajoutera la propriété `"include": []`.

à noter que les modules ajoutés se font via la ligne de commande et le gestionnaire de paquets `npm` (ou autre comme `yarn`).

Plus d'informations sur la [documentation officielle](https://www.typescriptlang.org/tsconfig/)

## C. Utiliser le debbuger de Chrome

Dans la partie `source` du `Débogueur` du panel inspecteur d'élément du navigateur, on pourra accéder au code source de la page. 
On y retrouvera le fichier `index.html` et le fichier `main.js`. Problème, on utilise typescript, et on souhaite accéder à ce code précisément. 

Il va falloir paramétrer le navigateur (chrome) pour pouvoir accéder au code typescript directement dans le navigateur.

Dans notre fichier `tsconfig.json`, on va rechercher la propriété `sourceMap` qui est pour le moment commentée. Il suffira de la décommenter, sauvegarder, et en actualisant la page dans le navigateur et en inspectant l'élément (F12), on pourra accéder au fichier source `main.ts` au même endroit que les deux autre fichiers.

On notera également qu'en activant cette propriété, un nouveau fichier `main.js.map` a été généré dans notre projet (voir plus si on a encore d'autre fichiers `.ts`). Cette structure risque de vite devenir ingérable, c'est pour cela qu'on va devoir travailler l'architecture du projet.

## D. Structurer le projet

Pour mieux structurer le projet, on va accéder aux propriétés `outDir` et `rootDir` du fichier `tsconfig.json`. 
* `rootDir` va permettre d'indiquer dans quel dossier sont présents les fichiers TypeScript à considérer lors de la compilation.
* `outDir` va indiquer dans quel dossier les fichiers `.js` seront générés.

On va ajouter deux fichiers : 
* un fichier `src` qui contiendra les fichiers source TypeScript. On y ajoutera `main.ts` et tout autre fichier `.ts` qu'on aurait pu créer. 
* un fichier `dist` qui lui va contenir les fichiers `.js` générés automatiquement.

Il faudra ensuite décommenter les lignes `rootDir` et `outDir` du fichier `tsconfig` et specifier les chemins vers les dossiers correspondant : `"./src"` pour `rootDir` et `"./dist"` pour `outDir`. 

En relançant `tsc` dans le terminal (si `tsc --watch` n'est pas en cours), on pourra remarquer que le fichier dist contient maintenant nos fichier `.js`, générés depuis les fichiers `.ts` contenus dans le dossier `src`.

Pour terminer cette configuration, il faudra corriger le chemin dans notre balise `script` du fichier index.html : `src="dist/main.js"`.

> Avec cette configuration, toute la structure créé dans le dossier `src` sera reproduite dans le dossier `dist`. 