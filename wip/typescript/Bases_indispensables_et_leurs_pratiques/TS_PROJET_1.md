# PROJET 1 : Convertisseur de devise

Objectif : créer un convertisseur de devises basé sur le dollar US.

Il s'agit d'un projet simple contenant une structure html basique avec 
* un input text pour inscrire le montant à convertir, 
* deux inputs select : devise d'origine et devise cible,
* l'affichage du résultat

Lorsque le montant est saisi dans l'input text, la conversion est effectuée de la devise d'origine vers la devise cible automatiquement.

Pour ce POC, on va utiliser ces devises : 
* Dollar = 1
* Euro = 0,88
* Livre = 0,75
* Yen = 163,11

On considère que toutes les conversions passent d'abord par la conversion en Dollars. 
Ex. : Euro en Livre : Euro -> Dollar -> Livre

Optionnel : ajouter du CSS

## Étape 1 : préparer la structure du projet et initialiser

### Instruction

* Créer un fichier `index.html`
* Créer deux dossiers : `dist` et `src`
* Entrer la commande `tsc --init`
* Dans le nouveau fichier `tsconfig.json`, modifier `outDir` et `rootDir`
* Dans le dossier `src`, ajouter le fichier `main.ts`
* Lancer `tsc --watch` dans le terminal

## Etape 2 : préparer le HTML

N.B.: la structure html ci-dessous est à titre indicatif et sera modifiée au fur et à mesure.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convertisseur de Devises</title>
</head>
<body>
    <form action="">
        <div>
            <label for="amount">Montant :</label>
            <input type="number" id="amount" name="amount" required>
        </div>
        <div>
            <label for="sourceCurrency">Devise source :</label>
            <select id="sourceCurrency" name="sourceCurrency" required>
                <option value="USD">Dollars - USD</option>
                <option value="EUR">Euros - EUR</option>
                <option value="GBP">Livres - GBP</option>
                <option value="JPY">Yens - JPY</option>
            </select>
        </div>
        <div>
            <label for="targetCurrency">Devise cible :</label>
            <select id="targetCurrency" name="targetCurrency" required>
                <option value="USD">Dollars - USD</option>
                <option value="EUR">Euros - EUR</option>
                <option value="GBP">Livres - GBP</option>
                <option value="JPY">Yens - JPY</option>
            </select>
        </div>
    </form>
    <p id="result">Resultat :</p>
    <script src="dist/main.js"></script>
</body>
</html>
```

Dans le navigateur, vérifier sur le localhost (ou `127.0.0.1:<port>`) que la structure fonctionne bien. 

## Étape 3 : Créer les 4 devises dans TypeScript

### Instruction

* Créer la liste des 4 devises sous forme d'un objet JavaScript et du type : `CurrencyType`.
* Le type CurrencyType est caractérisé par 4 propriétés : 
    * `name`: nom de la devise
    * `code`: code permettant de représenter la devise (en général les 3 premières lettres)
    * `symbol`: symbole utilisé pour représenter la devise
    * `taux`: taux de conversion vers le dollar
* Valeurs arbitraires : 
    * Dollar = 1
    * Euro = 0,88
    * Livre = 0,75
    * Yen = 163,11
* Mettre ces 4 devises dans un tableau de `CurrencyType`

### Correction

```TypeScript
type CurrencyType = {
    name: string;
    code: string;
    symbol: string;
    rate: number;
}

const dollar: CurrencyType = {
    name = "Dollar",
    code = "USD",
    symbol = "$",
    rate = 1
}

const euro: CurrencyType = {
    name = "Euro",
    code = "EUR",
    symbol = "€",
    rate = 0.88
}

const pound: CurrencyType = {
    name = "Pound",
    code = "GBP",
    symbol = "£",
    rate = 0.75
}

const dollar: CurrencyType = {
    name = "Yen",
    code = "YEN",
    symbol = "¥",
    rate = 163.11
}

const currencies: CurrencyType[] = [dollar, euro, pound, yen];
console.log({ currencies });
```
Pour vérifier que notre javascript est bien intégré, on va utiliser l'inspecteur d'élément du navigateur et regarder plus précisément la console si `currencies` apparaît.

## Étape 4 : Les listes déroulantes 

### Instruction

Cette étape consiste à afficher les listes déroulantes contenant nos devises que l'on va utiliser pour faire notre conversion. 
* Écrire une fonction permettant, à partir du tableau de devise, de générer la liste déroulante en HTML (balise "option")
* L'attribut `valeur` des balises sera représenté par le code des devises
* Utiliser cette fonction pour lister les devises dans le fichier HTML au niveau des deux balises `select` 

### Correction 

Pour commencer, on va supprimer du HTML les balises `option` :
```HTML
<div>
    <label for="sourceCurrency">Devise source :</label>
    <select id="sourceCurrency" name="sourceCurrency" required></select>
</div>
<div>
    <label for="targetCurrency">Devise cible :</label>
    <select id="targetCurrency" name="targetCurrency" required></select>
</div>
```
On va ensuite au niveau de notre fichier `main.ts` : 
* récupérer les balises HTML `select` grâce à leur `id`
* créer une fonction `generateCurrencyOptions` qui va prendre en paramètre un tableau de `CurrencyType`, parcourir ce tableau pour générer du code `html` avec les balises `option` en intégrant les valeurs du tableau, et retourner cela dans une chaîne de caractères
* ajouter le résultat de cette fonction à chaque balise `select` récupérée auparavant
```TypeScript
const sourceCurrencySelect = document.querySelector('#sourceCurrency')! as HTMLSelectElement;
const targetCurrencySelect = document.querySelector('#targetCurrency')! as HTMLSelectElement;

function generateCurrencyOptions(_currencies: CurrencyType[]): string {
    let options = '';
    for (let currency of _currencies) {
        options += `<option value="${currency.code}">${currency.name} (${currency.symbol})</option>`;
    }
    return options;
}

sourceCurrencySelect.innerHTML = generateCurrencyOptions(currencies);
targetCurrencySelect.innerHTML = generateCurrencyOptions(currencies);
```

## Étape 5 : Récupérer les valeurs

### Instruction

Écrire le code TypeScript pour récupérer les valeurs saisies dans le formulaire HTML (montant et devises).

### Correction : 

* On va commencer par récupérer le montant entré par l'utilisateur dans le champs texte (input) : 
    * initialiser une variable `amount` qui va récupérer la valeur de l'input et lui attribuer la valeur de `0` (pour éviter un bug)
    * récupérer le contenu de l'élément HTML dans une variable `amountInput`
    * écouter les changements d'état de l'input text pour intégrer le résultat dans notre nouvelle variable `amount`
    * attention, la valeur récupérée est de type `string`, il faut la convertir en `number`.
```TypeScript
let amount: number = 0;
const amountInput = document.querySelector('#amount')! as HTMLInputElement;
amountInput.addEventListener('keyup', () => {
    amount = parseInt(amountInput.value);
});
```
* Puis récupérer les informations concernant les changements au niveau des inputs select 
    * initialiser deux variables `sourceCurrencySelectValue` et `targetCurrencySelectValue` pour récupérer la valeur de chaque input select
    * écouter les changements d'état des input select pour intégrer leurs résultats dans les variables respectives
```TypeScript
let sourceCurrencySelectValue: string = sourceCurrencySelect.value;
sourceCurrencySelect.addEventListener('change', () => {
    sourceCurrencySelectValue = sourceCurrencySelect.value;
});

let targetCurrencySelectValue: string = targetCurrencySelect.value;
targetCurrencySelect.addEventListener('change', () => {
    targetCurrencySelectValue = targetCurrencySelect.value;
});
```

## Étape : Finalisation du projet

### Instruction

Finaliser le convertisseur de devises et faire en sorte de réaliser le calcul de la conversion du montant de la devise initiale vers la devise finale en utilisant le Dollar comme référence

Il faudra écrire les fonctions : 
* `calculateResult`, qui prend en paramètre les deux devises et le montant, et retournera le résultat du calcul.
* `getCurrency`, qui permet de récupérer une devise à partir de son code en 3 lettres.
* `displayResult`, qui permet d'afficher le résultat dans la balise html contenant l'id `result`.

### Correction

* On va créer une variable qui va récupérer l'élément html ayant pour id `result` (p, div ou autre)
    * initialisation de la variable avec `let`
    * créer la fonction `displayResult` qui aura pour objectif de modifier le contenu de cette variable grâce au résultat de la fonction `calculateResult`
```TypeScript
let resultHTMLElement = document.querySelector('#result')! as HTMLParagraphElement;
function displayResult() {
    resultHTMLElement.innerHTML = "Résultat :" + calculateResult();
}
```
* On va ensuite créer la signature `getCurrency` 
    * premier paramètre `currencyCode` de type string
    * second paramètre `currencyTypes` de type `CurrencyType[]`
* Et créer la fonction de notre fonction `calculateResult`
    * premier paramètre : le montant (`amount` de type `number`)
    * deuxième paramètre : la devise source (`sourceCurrency` de type `string`)
    * troisième paramètre : la devise cible (`targetCurrency` de type `string`)
```TypeScript
function getCurrency(currencyCode: string, currencyTypes: CurrencyType[]): CurrencyType | null {
    for (let currency in currencyTypes) {
        if (currencyCode === currency.code) {
            return currency
        }
    }
    return null;
}

function calculateResult(amount: number, sourceCurrencyValue: CurrencyCode, targetCurrencyValue: CurrencyCode): number {
    let sourceCurrencyObject: unknown = getCurrency(sourceCurrencyValue, currencies);

    let sourceCurrency: CurrencyType;
    if (sourceCurrencyObject) {
        sourceCurrency = sourceCurrencyObject as CurrencyType;
    } else {
        throw { message: "source currency is not correct"}
    }

    let targetCurrencyObject: unknown = getCurrency(targetCurrencyValue, currencies);
    if (targetCurrencyObject) {
        targetCurrency = targetCurrencyObject as CurrencyType;
    } else {
        throw { message: "target currency is not correct"}
    }

    return (amount * targetCurrency.rate) / sourceCurrency.rate;
}
```
* Enfin, bien penser à update la fonction `displayResult()` en ajoutant les paramètres lors de l'appel de `calculateResult()`, et appeler `displayResult()` dans les eventListeners : 
```TypeScript
...
function displayResult() {
    resultHTMLElement.innerHTML = "Résultat : " + calculateResult(amount, sourceCurrencySelectValue, targetCurrencySelectValue);
}
...
sourceCurrencySelect.addEventListener('change', () => {
    sourceCurrencySelectValue = sourceCurrencySelect.value;
    displayResult();
});
...
targetCurrencySelect.addEventListener('change', () => {
    targetCurrencySelectValue = targetCurrencySelect.value;
    displayResult();
});
...
amountInput.addEventListener('keyup', () => {
    amount = parseInt(amountInput.value);
    displayResult();
});
...
```

## Bonus : Clean Code

* Refactoriser et améliorer la création des types et variables de devises avec des `enum`.
* Refactorier la création de notre variable tableau `currencies`.
* Refactorier la fonction `generateCurrencyOptions` avec les méthodes `.map` et `.join`.
* Modifier pour que la conversion ne se fasse qu'au clic d'un bouton 'convertir'

index.html
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Convertisseur de Devises</title>
</head>
<body>
    <form>
        <div>
            <label for="amount">Montant :</label>
            <input type="number" id="amount" name="amount" required>
        </div>
        <div>
            <label for="sourceCurrency">Devise source :</label>
            <select id="sourceCurrency" name="sourceCurrency" required>
            </select>
        </div>
        <div>
            <label for="targetCurrency">Devise cible :</label>
            <select id="targetCurrency" name="targetCurrency" required>
            </select>
        </div>
        <button type="submit">Convertir</button>
    </form>
    <div id="result"></div>
    <script src="dist/main.js"></script>
</body>
</html>
```

main.ts
```TypeScript
type CurrencyType = {
    name: CurrencyName;
    code: CurrencyCode;
    symbol: CurrencySymbol;
    rate: CurrencyRate;
}

enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY"
}

enum CurrencySymbol {
    USD = "$",
    EUR = "€",
    GBP = "£",
    JPY = "¥"
}

enum CurrencyName {
    USD = "US Dollar",
    EUR = "Euro",
    GBP = "British Pound",
    JPY = "Japanese Yen"
}

enum CurrencyRate {
    USD = 1,
    EUR = 0.88,
    GBP = 0.75,
    JPY = 163.11
}

const dollar: CurrencyType = {
    name: CurrencyName.USD,
    code: CurrencyCode.USD,
    symbol: CurrencySymbol.USD,
    rate: CurrencyRate.USD
};
const euro: CurrencyType = {
    name: CurrencyName.EUR,
    code: CurrencyCode.EUR,
    symbol: CurrencySymbol.EUR,
    rate: CurrencyRate.EUR
};
const pound: CurrencyType = {
    name: CurrencyName.GBP,
    code: CurrencyCode.GBP,
    symbol: CurrencySymbol.GBP,
    rate: CurrencyRate.GBP
};
const yen: CurrencyType = {
    name: CurrencyName.JPY,
    code: CurrencyCode.JPY,
    symbol: CurrencySymbol.JPY,
    rate: CurrencyRate.JPY
};

const currencies: CurrencyType[] = [dollar, euro, pound, yen];

const generateCurrencyOptions = (currencies: CurrencyType[]): string => {
    return currencies.map(currency => `<option value="${currency.code}">${currency.name} (${currency.symbol})</option>`).join('');
}

const sourceCurrencySelect = document.querySelector<HTMLSelectElement>('#sourceCurrency')!;
sourceCurrencySelect.innerHTML = generateCurrencyOptions(currencies);

const targetCurrencySelect = document.querySelector<HTMLSelectElement>('#targetCurrency')!;
targetCurrencySelect.innerHTML = generateCurrencyOptions(currencies);

const getCurrencyCode = (currencyInputValue: string): CurrencyCode => {
    switch (currencyInputValue) {
        case "USD":
            return CurrencyCode.USD;
        case "EUR":
            return CurrencyCode.EUR;
        case "GBP":
            return CurrencyCode.GBP;
        case "JPY":
            return CurrencyCode.JPY;
        default:
            throw new Error(`Unsupported currency code: ${currencyInputValue}`);
    }
};

const calculateResult = (amount: number, sourceCurrencyValue: string, targetCurrencyValue: string): number => {
    const sourceCurrencyCode = getCurrencyCode(sourceCurrencyValue);
    const targetCurrencyCode = getCurrencyCode(targetCurrencyValue);

    const sourceCurrency = currencies.find(currency => currency.code === sourceCurrencyCode);
    const targetCurrency = currencies.find(currency => currency.code === targetCurrencyCode);

    if (!sourceCurrency || !targetCurrency) {
        throw new Error(`Source or target currency not found`);
    }

    return (amount * targetCurrency.rate) / sourceCurrency.rate;
}

const displayResultOnClick = (amount: number): void => {
    const result = calculateResult(amount, sourceCurrencySelectValue, targetCurrencySelectValue);
    resultHTMLElement.innerHTML = `Résultat : ${result.toFixed(2)} ${targetCurrencySelectValue}`;
}

let sourceCurrencySelectValue: string = sourceCurrencySelect.value;
sourceCurrencySelect.addEventListener('change', () => {
    sourceCurrencySelectValue = sourceCurrencySelect.value;
});
let targetCurrencySelectValue: string = targetCurrencySelect.value;
targetCurrencySelect.addEventListener('change', () => {
    targetCurrencySelectValue = targetCurrencySelect.value;
});

let amount: number = 0;
const amountInput = document.querySelector('#amount')! as HTMLInputElement;
amountInput.addEventListener('keyup', () => {
    amount = parseFloat(amountInput.value);
});

const resultHTMLElement = document.querySelector('#result')! as HTMLDivElement;
const convertButton = document.querySelector('button[type="submit"]')! as HTMLButtonElement;
convertButton.addEventListener('click', (event) => {
    event.preventDefault();
    displayResultOnClick(amount);
});

```