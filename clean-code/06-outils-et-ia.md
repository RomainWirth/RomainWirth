# Les Outils à connaître et l'IA

## Le Principe KISS

KISS = acronyme pour *Keep It Simple, Stupid*.

Le principe KISS encourage à **garder le code aussi simple que possible**. Une solution complexe n'est pas forcément meilleure qu'une solution simple : la complexité est un coût (lisibilité réduite, surface de bugs plus grande, maintenance plus lourde). KISS ne signifie pas "ne pas faire de validation" — cela signifie ne pas ajouter de logique inutile là où une formulation plus directe existe.

Dans les deux exemples ci-dessous, la version complexe multiplie les variables intermédiaires et les vérifications redondantes pour un résultat identique.

Exemple 1 — approche complexe :
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
L'approche KISS réduit la fonction à l'essentiel. Ici, `reduce` fait exactement ce que la boucle `while` faisait, en une ligne, sans variable intermédiaire ni réécriture de l'incrémentation :
```js
function calculateEasyResult(numbers) {
    return numbers.reduce((sum, number) => sum + number, 0);
}
```

Exemple 2 — approche complexe :
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
function isEven(number) {
    return number % 2 === 0;
}
```

> **À retenir :** KISS ne s'oppose pas à la validation des entrées (qui reste bonne pratique) — il s'oppose aux détours inutiles pour arriver au même résultat. Si une expression native du langage (`reduce`, `%`, `?? `) exprime clairement l'intention, utilisez-la.

## ESLint, le linter le plus utilisé pour un code propre

ESLint est une extension VS Code (et un outil Node.js) qui **analyse le code en temps réel** pendant qu'on l'écrit. On définit des règles de style et de qualité ; si une règle n'est pas respectée, un soulignement et un message apparaissent dans l'éditeur — sans que ce soit une erreur d'exécution du programme.

ESLint est particulièrement utile en équipe : il garantit que tout le monde respecte les mêmes conventions, automatiquement.

Pour ajouter ESLint :
1. Installer l'extension **ESLint** depuis le Marketplace VS Code.
2. Installer le package dans le projet : `npm install --save-dev eslint`.
3. Générer le fichier de configuration avec le raccourci `Ctrl+Shift+P` → `ESLint: Create ESLint configuration`, ou directement en ligne de commande :
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
Un fichier `eslint.config.mjs` est créé automatiquement à l'issue de l'initialisation :
```mjs
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
]);
```
Il s'agit des configurations de base ajoutées en fonction des choix faits lors de l'initialisation.

### Désactiver une règle ponctuellement

Parfois, ESLint signale quelque chose que vous souhaitez volontairement ignorer (variable inutilisée car nécessaire par signature, import de type, etc.). Le commentaire `eslint-disable` permet de désactiver une règle spécifique sur une ligne :

```js
// Désactive la règle no-unused-vars uniquement pour la prochaine ligne
// eslint-disable-next-line no-unused-vars
const _unusedVar = setup();

// Désactive pour un bloc entier (puis réactive)
/* eslint-disable no-console */
console.log("debug temporaire");
/* eslint-enable no-console */
```

> **Attention** : `eslint-disable` est un contournement. L'utiliser sur l'ensemble du fichier ou en abus dégrade l'utilité du linter. Préférez corriger la cause plutôt que de masquer l'avertissement.

### Configurer ESLint dans VS Code

Dans les paramètres VS Code (`Ctrl+,`), on peut activer la **correction automatique à la sauvegarde** — ESLint corrige les règles auto-fixables (espaces, points-virgules, ordre des imports) chaque fois qu'on sauvegarde le fichier :

```json
// .vscode/settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### Règles utiles pour le clean code

```mjs
// eslint.config.mjs — exemples de règles orientées clean code
export default [
  {
    rules: {
      "no-unused-vars": "warn",          // variable déclarée mais jamais utilisée
      "no-console": "warn",              // console.log laissé en production
      "eqeqeq": "error",                 // interdit == au profit de ===
      "no-var": "error",                 // interdit var, force const/let
      "prefer-const": "warn",            // utilise const quand la variable n'est pas réassignée
      "max-lines-per-function": ["warn", { "max": 30 }], // fonction trop longue
    }
  }
];
```

## GitHub Copilot : l'IA qui aide à écrire un code propre

GitHub Copilot est une IA intégrée directement dans VS Code. Elle génère des suggestions de code en ligne, répond à des questions et peut effectuer des tâches complètes (refactorisation, génération de tests, documentation) grâce à son interface de chat.

Copilot est un outil payant, disponible sur [github.com/features/copilot](https://github.com/features/copilot). Une version gratuite (avec quota mensuel) existe pour tester l'outil. Il permet de choisir parmi plusieurs modèles d'IA (Claude, GPT-4o, etc.).

### Installation

1. S'inscrire sur GitHub Copilot.
2. Installer les deux extensions VS Code : **GitHub Copilot** et **GitHub Copilot Chat**.
3. Se connecter avec son compte GitHub dans VS Code.

### Fonctionnalités principales

**Complétion en ligne** : Copilot suggère du code à mesure qu'on écrit. On accepte la suggestion avec `Tab`, on la rejette avec `Echap`, ou on parcourt les alternatives avec `Alt+]`.

**Chat** (`Ctrl+Alt+I` ou icône dans la barre latérale) : une interface de conversation avec des commandes dédiées :

| Commande | Rôle |
| --- | --- |
| `/explain` | Explique le code sélectionné |
| `/fix` | Propose une correction pour le code sélectionné |
| `/tests` | Génère des tests unitaires pour la fonction sélectionnée |
| `/doc` | Ajoute de la documentation JSDoc |
| `/refactor` | Refactorise le code sélectionné |
| `@workspace` | Pose une question sur l'ensemble du projet |

**Code Review inline** : depuis le menu contextuel (clic droit sur une sélection), Copilot peut effectuer une revue de code et signaler des problèmes potentiels (logique, sécurité, lisibilité).

**Edit mode** : en mode édition, Copilot peut modifier directement plusieurs fichiers à la fois selon une instruction en langage naturel.

### Usages concrets pour le clean code

- Demander à Copilot de renommer des variables obscures : *"Rename all variables in this function to be more descriptive"*
- Générer les tests unitaires d'une fonction refactorisée
- Demander une explication d'un bloc de code complexe avant de le modifier
- Faire réviser un fichier entier : *"Review this file for clean code violations"*

## ZZZCode AI, l'IA en ligne pour améliorer la qualité du code

[ZZZCode AI](https://zzzcode.ai/) est un outil en ligne (sans installation) qui propose plusieurs fonctionnalités d'assistance au code. Contrairement à Copilot qui s'intègre dans l'éditeur, ZZZCode fonctionne par copier/coller dans une interface web : on colle son code, on choisit l'outil, et l'IA retourne un résultat.

### Fonctionnalités disponibles

| Outil | Description |
| --- | --- |
| **AI Code Refactor** | Refactorise le code collage pour le rendre plus lisible et maintenable |
| **AI Bug Detector** | Analyse le code et identifie les bugs potentiels avec des explications |
| **AI Code Review** | Effectue une revue complète du code (qualité, sécurité, lisibilité) |
| **AI Code Documentation** | Génère automatiquement des commentaires et de la documentation |
| **AI Code Explainer** | Explique en langage naturel ce que fait un bloc de code |
| **AI Code Generator** | Génère du code à partir d'une description en langage naturel |
| **AI Code Converter** | Convertit du code d'un langage vers un autre |
| **AI Answer Question** | Répond à toute question de programmation |

Tous ces outils sont disponibles pour de nombreux langages : JavaScript, TypeScript, Python, Java, C#, PHP, SQL, etc.

### Quand l'utiliser ?

ZZZCode est utile pour des tâches ponctuelles sans avoir besoin d'un abonnement : refactoriser un bloc de code existant, générer la documentation d'une fonction, ou comprendre un code legacy qu'on ne peut pas modifier.

## Résumé

| Outil | Catégorie | Rôle principal |
| --- | --- | --- |
| **KISS** | Principe | Garder le code simple : préférer la solution la plus directe |
| **ESLint** | Linter (analyse statique) | Appliquer des règles de style et de qualité en temps réel dans l'éditeur |
| **GitHub Copilot** | IA intégrée à l'éditeur | Complétion, refactorisation, tests, revue de code sans quitter VS Code |
| **ZZZCode AI** | IA en ligne | Refactorisation, détection de bugs, documentation, conversion de code |

**Ce qu'on retient :**
- ESLint et les tests unitaires sont **automatisables** : ils s'exécutent sans intervention humaine et bloquent les régressions en continu.
- Les outils IA accélèrent le travail mais ne remplacent pas le jugement du développeur : il faut toujours relire et comprendre le code généré ou suggéré.
- KISS s'applique aussi au choix des outils : ne pas multiplier les dépendances et les configurations si ce n'est pas justifié par un besoin réel.