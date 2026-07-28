# 10. Projet : deviner le drapeau d'un pays

Ce second projet pratique met, comme le précédent, en application les modules 1 à 3 (introduction, les types, structure d'un projet), avec en plus une première manipulation d'un appel réseau (`fetch`). Objectif : créer une application simple permettant à l'utilisateur d'identifier le pays d'un drapeau affiché à l'écran parmi 4 choix.

Il s'agit d'un projet simple contenant une structure html basique avec
* Un titre
* l'affichage du drapeau à deviner
* 4 boutons contenant un nom de pays, dont un seul est correct
* l'affichage conditionnel de la réponse si elle est correcte ou non
* un bouton pour changer de pays

Pour ce POC, l'application utilisera l'API gratuite [countries](https://countries.dev/) pour récupérer les données.

Optionnel : ajouter du CSS, bootstrap ou autre (tailwind)

## Sommaire

- [Étape 1 : préparer la structure du projet et initialiser](#etape-1--preparer-la-structure-du-projet-et-initialiser)
- [Étape 2 : préparer le HTML](#etape-2--preparer-le-html)
- [Étape 3 : récupérer les données de l'API](#etape-3--recuperer-les-donnees-de-lapi)
- [Étape 4 : Traiter les données](#etape-4--traiter-les-donnees)
- [Étape 5 : Le jeu](#etape-5--le-jeu)
- [Étape 6 : rechargement du jeu](#etape-6--rechargement-du-jeu)
- [Bonus : Clean Code](#bonus--clean-code)

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

Optionnel : ajouter bootstrap

### Correction

N.B.: la structure html ci-dessous est à titre indicatif et sera modifiée au fur et à mesure.

On va avoir besoin de :
* Un titre
* l'affichage du drapeau à deviner
* 4 boutons contenant un nom de pays, dont un seul est correct
* l'affichage conditionnel de la réponse si elle est correcte ou non
* un bouton pour changer de pays

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guess the Flag</title>
</head>
<body>
    <div id="app">
        <h1>À quel pays appartient ce drapeau ?</h1>
        <div id="flagToGuess"></div>
        <div id="buttons"></div>
        <div id="result"></div>
    </div>
    <script src="main.js"></script>
</body>
</html>
```

> Optionnel : insérer les balises [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/download/) link dans head et script à la fin du body, avant la balise script src main.js
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <title>Guess the Flag</title>
</head>
<body>
    <div id="app" class="container text-center mt-5">
        <h1>À quel pays appartient ce drapeau ?</h1>
        <div id="flagToGuess"></div>
        <div id="buttons" class="container-fluid"></div>
        <div id="result"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
    <script src="dist/main.js"></script>
</body>
</html>
```

## Étape 3 : récupérer les données de l'API

### Instructions

* Se rendre sur le site [countries.dev](https://countries.dev/) et aller voir la documentation. 
* Aller chercher la documentation pour récupérer tous les pays.
* Utiliser la fonction `fetch` de JavaScript, récupérer la liste de tous les pays proposés par l'API `countries`.
* Afficher les résultats dans la console pour découvrir la structure de données.

### Correction

Pour commencer, on se rend sur le site internet countries.dev, et plus précisément dans la documentation pour récupérer tous les pays : [https://countries.dev/docs/api/countries](https://countries.dev/docs/api/countries)
* la documentation propose directement ceci : 
```JavaScript
fetch("https://countries.dev/countries?fields=name%2Ccapital%2Cflag&full=true&sort=population&limit=10&offset=0", {
  method: "GET"
})
```
* les paramètres permettent de filtrer les données que l'on récupère : name, capital, flag, full, sort et limit. 
* pour récupérer la totalité des données, on va retirer ces paramètres (on en rajoutera pas la suite selon les données dont on a besoin pour notre application).

On va ensuite préparer notre code pour récupérer les données au format JSON pour ensuite les afficher dans la console du navigateur
```TypeScript
fetch("https://countries.dev/countries", {
    method: "GET"
}).then((response) => {
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
}).then((countries) => {
    console.log(countries);
}).catch((error) => {
    console.error("Erreur lors de la récupération des pays:", error);
});
```
Voici la structure de données que l'on doit recevoir (cf.: documentation) : 
```JSON
[
  {
    "name": "Israel",
    "topLevelDomain": [
      ".il"
    ],
    "alpha2Code": "IL",
    "alpha3Code": "ISR",
    "callingCodes": [
      "972"
    ],
    "capital": "Jerusalem",
    "altSpellings": [
      "string"
    ],
    "subregion": "Western Asia",
    "region": "Asia",
    "population": 9216900,
    "latlng": [
      31.5,
      34.75
    ],
    "demonym": "Israeli",
    "area": 20770,
    "timezones": [
      "UTC+02:00"
    ],
    "borders": [
      "EGY",
      "JOR",
      "LBN",
      "SYR"
    ],
    "nativeName": "ישראל",
    "numericCode": "376",
    "flags": {
      "svg": "http://example.com",
      "png": "http://example.com"
    },
    "currencies": [
      {
        "code": "ILS",
        "name": "Israeli new shekel",
        "symbol": "₪"
      }
    ],
    "languages": [
      {
        "iso639_1": "he",
        "iso639_2": "heb",
        "name": "Hebrew",
        "nativeName": "עברית"
      }
    ],
    "flag": "🇮🇱",
    "maps": {
      "googleMaps": "http://example.com",
      "openStreetMaps": "http://example.com"
    },
    "populationDensity": 443.6
  },
  ...
]
```

## Étape 4 : Traiter les données

### Instructions

Traiter les données JSON :
* Pour réaliser cette application, on a besoin de récupérer au moins le nom et le drapeau du pays.
* Regrouper ces données dans un set de données.
* Récupérer un pays unique de manière aléatoire.

Mettre en place le jeu : 
* Créer une fonction `startApplication` qui va récupérer les données de l'api et qui contient tout le code du jeu.
* Remplir le tableau de pays à partir des données récupérées depuis l'API.
* Créer une fonction qui permet de récupérer aléatoirement un pays.
* Afficher le drapeau à l'écran.

### Correction

On va commencer par créer un type `Country` qui aura comme propriétés un nom et un drapeau :
```TypeScript
type Country = {
  name: string;
  flag: string;
}
``` 
Ensuite, on va créer une variable tableau de type `country`, qui va regrouper la totalité des pays récupérés, et une seconde variable, aussi de type `country`, qui elle va contenir un seul pays récupéré aléatoirement à partir du tableau créé précédemment :
```TypeScript
let countriesList: Country[] = [];
let randomCountry: Country;
``` 
On va maintenant créer la fonction `startApplication`, qui prendra en paramètre les données :
* il va falloir créer un type `responseData` qui aura comme propriétés la traduction en français du nom du pays, le drapeau, et potentiellement d'autres propriétés qu'on ne connaît pas encore : 
```TypeScript
type ResponseData = {
    translations: {
        fr: string;
        [props: string]: string;
    };
    flags: {
        svg: string;
        png: string;
    };
}
```
* La fonction startApplication devra itérer sur le set de données passées en paramètre pour mettre ces données formatées dans notre tableau `countriesList`
```TypeScript
function startApplication(data: ResponseData[]) {
    for (let _country of data) {
        const country: Country = {
            name: _country.translations.fr,
            flag: _country.flags.svg
        };
        countriesList.push(country);
    }
}
```
* À noter que cette fonction sera appelée dans notre fonction fetch pour traiter les réponses récupérées lors de l'appel API.

On va maintenant créer notre fonction `getRandomCountry` pour récupérer aléatoirement le pays parmis la liste de pays récupérés : 
    * Elle prendra en paramètres la liste des pays
    * Il faudra créer un nombre entier aléatoire qui puisse matcher la taille du tableau de données
    * La fonction va retourner un pays de manière aléatoire parmis le tableau de données des pays, basé sur le nombre récupéré auparavant 
```TypeScript
function getRandomCountry(countryList: Country[]): Country {
    let random = Math.floor(Math.random() * countryList.length);
    return countryList[random];
}
```
On va maintenant compléter la fonction `startApplication` :
* qui fera appel à La fonction `getRandomCountry` pour rensigner le pays aléatoire (`randomCOuntry`)
* va afficher le drapeau dans la balise ayant pour id `flagToGuess` en manipulant le DOM
```TypeScript
let randomCountry: Country;
...
function startApplication(data: ResponseData[]) {
    for (let _country of data) {
        const country: Country = {
            name: _country.translations.fr,
            flag: _country.flags.svg
        };
        countriesList.push(country);
    }
    randomCountry = getRandomCountry(countriesList);
    document.querySelector("#flagToGuess")!.innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;
}
```

> À noter que la fonction `startApplication` sera appelé dans l'exécution de la fonction `fetch`.

## Étape 5 : Le jeu

### Instructions

Finaliser le jeu et faire en sorte de générer 4 boutons contenant des noms de pays, dont un correspondant au drapeau affiché à l'écran. 

* Utiliser la fonction `getRandomCountry` pour récupérer 3 mauvaises réponses et populer les boutons
* Afficher les boutons dans un ordre aléatoire
* Ajouter le traitement au clic des boutons pour vérifier si le choix de l'utilisateur est correct

### Correction

On va devoir générer 4 variables supplémentaires contenant les noms de pays aléatoires ainsi que le nom du pays correspondant au drapeau.
Étant donné qu'on aura besoin d'avoir récupéré les informations au préalables, le code que l'on va écrire devra être exécuté dans la fonction `startApplication`.

Dans notre fonction `startApplication`, va commencer par générer les 4 réponses : 
* dans une première constante `correctAnswer` sera le nom du pays déjà récupéré
* dans un tableau `wrongAnswers` que l'on va populer grâce à une boucle `while` : 
    * il va falloir parcourir les données du tableau pour éviter de prendre deux fois la même valeur. 
    * et se servir de la fonction `getRandomCountry` pour récupérer une donnée à chaque tour de boucle pour comparer cette donnée aux données du tableau de `wrongAnswers`.
* On va récupérer ces données dans un nouveau tableau d'élément contenant toutes les réponses : `allAnswers`. 
```TypeScript
const correctAnswer = randomCountry.name;
const wrongAnswers: string[] = [];
while (wrongAnswers.length < 3) {
    const randomWrongCountry = getRandomCountry(countriesList);
    if (randomWrongCountry.name !== correctAnswer && !wrongAnswers.includes(randomWrongCountry.name)) {
        wrongAnswers.push(randomWrongCountry.name);
    }
}

let allAnswers = [correctAnswer, ...wrongAnswers];
```
* Il faudra aussi mettre un ordre aléatoire au tableau, pour cela, on va faire appel à l'algorithme de `Fisher-Yates` que l'on va mettre dans une fonction annexe `shuffleStringArray` : 
```TypeScript
function shuffleStringArray(array: string[]): string[] {
    let randomArray = array;
    // algorithme de `Fisher-Yates`
    for(let i = randomArray.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    return randomArray;
}
```
La prochaine étape consiste à générer les boutons que l'on va populer avec les réponses du tableau `allAnswers`.
* on va créer une nouvelle fonction `generateButtons` :
    * elle prendra en paramètre un tableau de `string`
    * et retourner une `string` contenant les boutons html en templating
    * chaque bouton devra faire appel à une fonction `checkAnswer` qui sera déclenchée au clic
* et créer la fonction `checkAnswer` :
    * qui prendra en paramètre une string, 
    * pour la comparer à celle de la bonne réponse,
    * et affichera le résultat dans la balise html `result`
```TypeScript
function generateButtons(array: string[]): string {
    let buttonsHTML = "";
    for (let element of array) {
        buttonsHTML += `<button class="btn btn-primary m-2" onClick="checkAnswer('${element}')">${element}</button>`;
    }
    return buttonsHTML;
}

function checkAnswer(answer: string): void {
    const resultElement = document.querySelector("#result") as HTMLDivElement;
    if (answer === randomCountry.name) {
        resultElement.innerHTML = `<p class="alert alert-success">Bonne réponse !</p>`;
    } else {
        resultElement.innerHTML = `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;
    }
}
```

Puis utiliser le code qu'on vient d'écrire et manipuler le DOM, on va appeler la fonction `generateButtons` directement dans notre fonction `startApplication` : 
*  
```TypeScript
function startApplication(data: ResponseData[]) {
    for (let _country of data) {
        const country: Country = {
            name: _country.translations.fr,
            flag: _country.flags.svg
        };
        countriesList.push(country);
    }
    randomCountry = getRandomCountry(countriesList);
    document.querySelector("#flagToGuess")!.innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;

    const correctAnswer = randomCountry.name;
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < 3) {
        const randomWrongCountry = getRandomCountry(countriesList);
        if (randomWrongCountry.name !== correctAnswer && !wrongAnswers.includes(randomWrongCountry.name)) {
            wrongAnswers.push(randomWrongCountry.name);
        }
    }

    let allAnswers = [correctAnswer, ...wrongAnswers];
    allAnswers = shuffleStringArray(allAnswers);

    document.querySelector('#buttons')!.innerHTML = generateButtons(allAnswers);
}
```
> À noter que les class CSS ajoutées dans les balises html générées sont les classes Bootstrap afin de donner un minimum de style, cela est optionnel si on a pas ajouté Bootstrap

## Étape 6 : rechargement du jeu

### Instructions

L'objectif de cette étape de d'ajouter un bouton pour redémarrer notre application afin d'éviter d'avoir à mettre à jour la page du navigateur manuellement avec F5 ou via le bouton actualiser. 
Pour cela, on va ajouter un bouton `redémarrer` en dessous de la réponse. 
On en profitera également pour refactoriser un petit peu la fonction `startApplication`

### Correction

La fonction `startApplication` contient essentiellement deux parties : 
* la récupération des données de l'API
* la partie du jeu à proprement dite.

Afin d'éviter de régénérer les datas du jeu à chaque redémarrage du programme, on va scinder la fonction en deux, en créant une fonction subsidiaire `startGame` contenant la partie dédiée au jeu. Ainsi, on pourra appeler uniquement cette nouvelle fonction et éviter de régénérer la totalité du programme en cas de redémarrage.
```TypeScript
function startApplication(data: ResponseData[]) {
    for (let _country of data) {
        const country: Country = {
            name: _country.translations.fr,
            flag: _country.flags.svg
        };
        countriesList.push(country);
    }
    startGame();
}

function startGame() {
    randomCountry = getRandomCountry(countriesList);
    document.querySelector("#flagToGuess")!.innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;

    const correctAnswer = randomCountry.name;
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < 3) {
        const randomWrongCountry = getRandomCountry(countriesList);
        if (randomWrongCountry.name !== correctAnswer && !wrongAnswers.includes(randomWrongCountry.name)) {
            wrongAnswers.push(randomWrongCountry.name);
        }
    }

    let allAnswers = [correctAnswer, ...wrongAnswers];
    allAnswers = shuffleStringArray(allAnswers);

    document.querySelector('#buttons')!.innerHTML = generateButtons(allAnswers);
}
```

Le nouveau bouton sera ajouté directement dans la fonction `checkAnswer`, à la suite de la balise `<p>` contenant la réponse, et contiendra la propriété onClick qui fera appel à la fonction `startGame` fraîchement créée.
```TypeScript
function checkAnswer(answer: string): void {
    const resultElement = document.querySelector("#result") as HTMLDivElement;
    if (answer === randomCountry.name) {
        resultElement.innerHTML = `<p class="alert alert-success">Bonne réponse !</p>`;
    } else {
        resultElement.innerHTML = `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;
    }
    resultElement.innerHTML += `<button class="btn btn-secondary mt-2" onClick="startGame()">Nouvelle partie</button>`;
}
```

## Bonus : Clean Code

* Passer la récupération des données (`fetch`) en `async/await` plutôt qu'en chaîne de `.then()`.
* Typer explicitement le retour de `response.json()` pour que le typage de `ResponseData` soit réellement exploité par TypeScript.
* Retirer l'index signature `[props: string]: any` du type `ResponseData`, devenue inutile puisque seules les propriétés `translations` et `flags` sont utilisées.
* Stocker les éléments DOM récupérés via `querySelector` (`#flagToGuess`, `#buttons`, `#result`) dans des constantes réutilisables, plutôt que de les requêter à chaque appel de fonction.
* Remplacer la boucle `for...of` de `startApplication` par un `.map()` pour construire `countriesList`.
* Extraire le calcul des mauvaises réponses de `startGame` dans une fonction dédiée `getWrongAnswers`, pour que chaque fonction ne fasse qu'une seule chose.
* Refactoriser `generateButtons` avec `.map()` et `.join()` plutôt qu'une boucle avec concaténation.
* Corriger `mixArray` : typer précisément `string[]` plutôt que `any[]`, et copier le tableau (`[...array]`) plutôt que de muter directement le tableau reçu en paramètre.
* Ajouter un retour visuel pour l'utilisateur en cas d'échec du chargement des pays (`try/catch` autour du `fetch`, message affiché dans `#result`).
* Remplacer le `if/else` de `checkAnswer` par un ternaire, puisqu'il ne fait qu'assigner une chaîne différente à une variable.

```TypeScript
type Country = {
  name: string;
  flag: string;
}

type ResponseData = {
    translations: {
        fr: string;
        [props: string]: string;
    };
    flags: {
        svg: string;
        png: string;
    };
}

const flagElement = document.querySelector("#flagToGuess") as HTMLDivElement;
const buttonsElement = document.querySelector("#buttons") as HTMLDivElement;
const resultElement = document.querySelector("#result") as HTMLDivElement;

let countriesList: Country[] = [];
let randomCountry: Country;

async function initApplication(): Promise<void> {
    try {
        const response = await fetch("https://countries.dev/countries");
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data: ResponseData[] = await response.json();
        startApplication(data);
    } catch (error) {
        resultElement.innerHTML = `<p class="alert alert-danger">Impossible de charger les pays. Réessaie plus tard.</p>`;
        console.error("Erreur lors de la récupération des pays:", error);
    }
}

function startApplication(data: ResponseData[]) {
    countriesList = data.map((_country) => ({
        name: _country.translations.fr,
        flag: _country.flags.svg
    }));
    startGame();
}

function startGame() {
    randomCountry = getRandomCountry(countriesList);
    flagElement.innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;

    const wrongAnswers = getWrongAnswers(randomCountry.name);
    const allAnswers = shuffleStringArray([randomCountry.name, ...wrongAnswers]);

    buttonsElement.innerHTML = generateButtons(allAnswers);
}

function getWrongAnswers(correctAnswer: string): string[] {
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < 3) {
        const candidate = getRandomCountry(countriesList).name;
        if (candidate !== correctAnswer && !wrongAnswers.includes(candidate)) {
            wrongAnswers.push(candidate);
        }
    }
    return wrongAnswers;
}

function getRandomCountry(countryList: Country[]): Country {
    let random = Math.floor(Math.random() * countryList.length);
    return countryList[random];
}

function shuffleStringArray(array: string[]): string[] {
    let randomArray = [...array];
    // algorithme de `Fisher-Yates`
    for (let i = randomArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    return randomArray;
}

function generateButtons(answers: string[]): string {
    return answers
        .map((answer) => `<button class="btn btn-primary m-2" onClick="checkAnswer('${answer}')">${answer}</button>`)
        .join('');
}

function checkAnswer(answer: string): void {
    const message = answer === randomCountry.name
        ? `<p class="alert alert-success">Bonne réponse !</p>`
        : `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;

    resultElement.innerHTML = `${message}<button class="btn btn-secondary mt-2" onClick="startGame()">Nouvelle partie</button>`;
}

initApplication();
```