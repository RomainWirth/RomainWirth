# Les Outils à connaître et l'IA

## Le Principe KISS

KISS = accronyme pour Keep It Simple, Stupid.
Le principe KISS est d'encourager à garder le code aussi simple que possible.

exemple d'une approche "non kiss" : 
```js
/**
 * Calculates the sum of numbers in an array using a complex implementation
 * @param {number[]} numbers - The array of numbers to sum
 * @returns {number} The sum of all numbers in the array
 * @throws {Error} If the input is not an array
 * @throws {Error} If any element in the array is not a number
 */
function calculateComplexResult(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Le paramètre doit être un tableau');
  }
  
  let result = 0; 
  let i = 0;
  
  // Boucle while avec incrémentation manuelle
  while (i < numbers.length) {
    // Vérifier si la valeur est un nombre
    if (typeof numbers[i] !== 'number') {
      throw new Error(`L'élément à l'index ${i} n'est pas un nombre`);
    }
    
    // Utiliser une condition pour ajouter
    if (numbers[i] !== undefined && !isNaN(numbers[i])) {
      result = result + numbers[i];
    }
    
    i = i + 1;
  }
  
  return result;
}
```
l'approche KISS simplifie au maximum la fonction : 
```js
function calculateEasyResult(numbers) {
    return numbers.reduce((sum, number) => sum + number, 0);
}
```

Deuxième exemple : 
```js
function isEvenComplex(number) {
  if (typeof number !== 'number') {
    throw new Error('Le paramètre doit être un nombre');
  }
  
  const division = number / 2;
  const isInteger = Math.floor(division) === division;
  
  return isInteger;
}
```
Avec l'approche KISS en utilisant le modulo : 
```js
function isEvenEasy(nombre) {
    return nombre % 2 === 0;
}
```

## Esling, le linter vscode le plus utilisé pour un code propre

Eslint est une extension de vscode qui va surveiller en temps réel le code pendant qu'on l'écrit, et on va pouvoir définir des règles de clean code, et si ces règles ne sont pas respectées, des "erreurs" vont apparaître. 
Il ne s'agit pas d'erreurs de bug, mais plutôt d'erreurs en rapport avec les conventions qu'on aura défini dans le linter. 
C'est une extension qui va nous pousser à respecter toutes les conventions définies sur le projet. 

Pour ajouter Eslint, on va aller dans les extensions de vscode et la rechercher pour ensuite l'ajouter. 
On va ensuite installer le package node qui indique que l'on souhaite utiliser Eslint dans le projet en cours : `npm i eslint --save-dev`.
Il faudra ensuite créer un fichier de configuration Eslint. 
On va utiliser les commandes `ctrl` + `shift` + `p` pour rechercher dans vscode `ESLint: Create ESLint configuration` (ou alors `npx esling --init`). En cliquant sur la suggestion, la commande sera directement injectée dans le terminal. 
On devra faire certains choix pour configurer :
```bash
npx eslint --init
You can also run this command directly using 'npm init @eslint/config@latest'.

> npx
> "create-config"

@eslint/create-config: v2.0.0
✔ What do you want to lint? · javascript
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser
ℹ The config that you've selected requires the following dependencies:

eslint, @eslint/js, globals
✔ Would you like to install them now? · No / Yes
✔ Which package manager do you want to use? · npm
☕️Installing...

added 2 packages, and audited 72 packages in 2s

18 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
✔ Successfully created /home/romainwirth/dev/ressources/RomainWirth/clean-code/exercices/05-tests-unitaires/eslint.config.mjs file.
```
Un fichier `eslint.config.mjs` sera créé à l'issue : 
```mjs
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
]);
```
Il s'agit des configurations de base qui sont ajoutées suites aux choix qu'on indiqué en initialisant le linter. 

`eslint-disable-next-line no-unused-vars` = qu'est ce que c'est et comment ça s'utilise ?

settings de eslint dans vscode ? pour définir nos propres réglages

## Github Copilot : l'IA qui aide à écrire un code propre

## ZZZCode AI, l'IA qui touche à tout pour du Clean Code facile