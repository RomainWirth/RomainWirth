# Les Tests Unitaires

Un code propre est également un code **testé**. Les tests font partie du code au même titre que les fonctions qu'ils vérifient.

## Pourquoi écrire des tests ?

Les tests unitaires permettent de vérifier que chaque fonction produit le résultat attendu, isolément du reste du programme. Ils apportent plusieurs bénéfices concrets :

- **Filet de sécurité** : lors d'une modification du code, on relâche l'intégralité du jeu de tests pour s'assurer qu'aucune régression n'a été introduite.
- **Documentation vivante** : un test bien nommé décrit le comportement attendu de la fonction. Il peut remplacer des commentaires.
- **Conception forcée** : écrire des tests oblige à concevoir des fonctions courtes, avec une seule responsabilité et sans effets de bord — c'est exactement ce que le clean code recherche.
- **Confiance** : on peut refactoriser ou évoluer le code sans craindre de casser ce qui fonctionnait.

## Quoi tester ?

Pour chaque fonction, on couvre trois types de cas :

1. **Le cas nominal** : l'entrée est valide et correspond au cas le plus courant.
2. **Les cas limites** (*boundary cases*) : les valeurs exactement à la frontière des règles métier (ex. exactement 100 km, exactement 500 km).
3. **Les cas d'erreur** : les entrées invalides doivent provoquer une erreur claire et prévisible.

## Les frameworks de test

Pour écrire des tests, on utilise généralement un **framework de test**. Voici les trois frameworks les plus rencontrés en JavaScript.

### Jest

Créé par Meta, Jest est le framework de référence pour les projets **React** et les applications Node.js. Il fonctionne sans configuration et embarque tout le nécessaire (lanceur de tests, assertions, mocks, couverture de code).

```bash
npm install --save-dev jest
npx jest               # exécute tous les tests
npx jest --coverage    # ajoute un rapport de couverture de code
```

```js
// exemple de test Jest
test('getRatePerKm should return 10 for a short standard trip', () => {
  expect(getRatePerKm(50, 'standard')).toBe(10);
});

test('validateInputs should throw for a negative distance', () => {
  expect(() => validateInputs(-5, 'standard')).toThrow("Distance must be a non-negative number");
});
```

### Vitest

Vitest est conçu pour les projets utilisant **Vite** (Vue, React, SvelteKit…). Son API est volontairement compatible avec Jest, ce qui facilite la migration. Il est nettement plus rapide grâce à l'exécution native ESM et au rechargement à chaud pendant le développement.

```bash
npm install --save-dev vitest
npx vitest             # mode watch (relance les tests à chaque modification)
npx vitest run         # exécution unique (CI/CD)
```

```js
// exemple de test Vitest — syntaxe identique à Jest
import { describe, test, expect } from 'vitest';

describe('calculateTaxRate', () => {
  test('should return 0.2 for standard service', () => {
    expect(calculateTaxRate(200, 'standard')).toBe(0.2);
  });

  test('should return 0.1 for premium service over 1000 km', () => {
    expect(calculateTaxRate(1200, 'premium')).toBe(0.1);
  });
});
```

### Mocha + Chai

Mocha est un **lanceur de tests** flexible et modulaire. Il ne fournit pas lui-même les assertions : on lui associe une bibliothèque dédiée, le plus souvent **Chai**, qui propose trois styles d'assertion selon les préférences de l'équipe.

```bash
npm install --save-dev mocha chai
npx mocha              # exécute les tests
```

```js
// exemple avec Chai (style "expect")
const { expect } = require('chai');

describe('getRatePerKm', () => {
  it('should return 8 for a medium standard trip', () => {
    expect(getRatePerKm(200, 'standard')).to.equal(8);
  });

  it('should return 15 for a short premium trip', () => {
    expect(getRatePerKm(50, 'premium')).to.equal(15);
  });
});
```

### Comparatif

| | Jest | Vitest | Mocha + Chai |
| --- | --- | --- | --- |
| **Tout-en-un** | ✅ (assertions, mocks, coverage) | ✅ (assertions, mocks, coverage) | ❌ (nécessite Chai + plugins) |
| **Config nécessaire** | Minimale | Minimale (projet Vite) | Modérée |
| **Vitesse** | Rapide | Très rapide (ESM natif) | Rapide |
| **Écosystème cible** | React, Node.js | Vite, Vue, SvelteKit | Tout projet Node.js |
| **API compatible Jest** | — | ✅ (migration facile) | ❌ |
| **Popularité (2024)** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ (en progression) | ⭐⭐⭐ (historique) |

Dans ce chapitre, pour se concentrer sur les concepts sans dépendance externe, on utilise un **mini-framework maison** qui reproduit la même logique.

## Fichier initial pour écrire les tests

On repart de la solution de l'exercice précédent. Pour pouvoir importer les fonctions dans les fichiers de test, on ajoute un `module.exports` à la fin du fichier source (`delivery.js`) : 
```js
/**
 * Calculate the total trip cost including taxes based on distance and service type.
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The final price including tax
 * @returns {Error} If the parameters are invalid: the distance is negative or the service type is invalid
 */
function calculateTotalTripCost(distanceInKm, serviceType) {
    validateInputs(distanceInKm, serviceType);

    const tripCostWithoutTaxes = calculateTripCostWithoutTaxes(distanceInKm, serviceType);
    
    const taxRate = calculateTaxRate(distanceInKm, serviceType);

    const finalPrice = calculatePriceWithTaxes(tripCostWithoutTaxes, taxRate);

    console.log("Prix: " + finalPrice);
    return finalPrice;
}

/**
 * Calculate the trip cost without taxes based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The trip cost without taxes
 */
function calculateTripCostWithoutTaxes(distanceInKm, serviceType) {
    const ratePerKm = getRatePerKm(distanceInKm, serviceType);
    return distanceInKm * ratePerKm;
}

/**
 * Calculate the final price including tax
 * @param {number} priceWithoutTaxes - The price without taxes
 * @param {number} taxRate - The applicable tax rate
 * @returns {number} The final price including tax
 */
function calculatePriceWithTaxes(priceWithoutTaxes, taxRate) {
    return priceWithoutTaxes * (1 + taxRate);
}

/**
 * Calculate the rate per kilometer based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The rate per kilometer based on distance and service type
 */
function getRatePerKm(distanceInKm, serviceType) {
    const standardRates = {
        shortTrip: 10,    // <= 100 km
        mediumTrip: 8,    // > 100 km et <= 500 km
        longTrip: 6       // > 500 km
    }

    const premiumRates = {
        shortTrip: 15,    // <= 100 km
        mediumTrip: 12,   // > 100 km et <= 500 km
        longTrip: 10      // > 500 km
    }

    const rates = serviceType === "standard" ? standardRates : premiumRates;

    if (distanceInKm <= 100) {
        return rates.shortTrip;
    } else if (distanceInKm > 100 && distanceInKm <= 500) {
        return rates.mediumTrip;
    } else if (distanceInKm > 500) {
        return rates.longTrip;
    }
}

/**
 * Calculate the applicable tax rate based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The applicable tax rate
 */
function calculateTaxRate(distanceInKm, serviceType) {
    if (serviceType === "standard") {
        return 0.2; // 20% de taxe pour service standard
    } else { // service premium
        return distanceInKm > 1000 ? 0.1 : 0.15; // 10% pour très long trajet premium, sinon 15%
    }
}

/**
 * Validate the inputs for distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @throws {Error} If the distance is negative or if the service type is invalid
 */
function validateInputs(distanceInKm, serviceType) {
    if (typeof distanceInKm !== 'number' || distanceInKm < 0) {
        throw new Error("Distance must be a non-negative number");
    }
    
    if (serviceType !== 'standard' && serviceType !== 'premium') {
        throw new Error("Service type must be 'standard' or 'premium'");
    }
}

// Exemple d'utilisation
try {
    calculateTotalTripCost(150, "standard"); // Calcul pour 150 km en standard
    calculateTotalTripCost(700, "premium");  // Calcul pour 700 km en premium

    calculateTotalTripCost(50, "standard");
    calculateTotalTripCost(1200, "premium");
} catch (error) {
    console.error(`Erreur : ${error.message}`);
}

module.exports = {
    calculateTotalTripCost,
    calculateTripCostWithoutTaxes,
    calculatePriceWithTaxes,
    getRatePerKm,
    calculateTaxRate,
    validateInputs,
}
```

## Écrire les tests

Afin d'écrire des tests unitaires, il existe pleins de frameworks. 
Il en existe un très connu en JavaScript : JEST. 

## Le framework de test maison

Afin d'écrire des tests unitaires, il existe de nombreux frameworks. Le plus connu en JavaScript est **Jest** (`npm install --save-dev jest`). Pour cet exercice, on utilise un framework maison léger, sans dépendance, afin de comprendre ce que fait un framework de test à son niveau le plus bas.

Voici son fonctionnement :

- **`test(name, callback)`** : définit un test. Elle exécute le `callback` dans un `try/catch`. Si le callback ne lève pas d'erreur, le test est « passé » (`✓`). Si une erreur est levée, le test est « échoué » (`✗`).
- **`assertEquals(currentValue, expectedValue, message)`** : vérifie que deux valeurs sont strictement égales (`===`). Si ce n'est pas le cas, elle lève une erreur, ce qui fait échouer le test enclôturant.
- **`assertThrows(callback, expectedErrorMessage)`** : vérifie qu'une fonction lève bien une erreur. Elle exécute le `callback` et s'attend à ce qu'une exception soit levée. Si l'erreur n'est pas levée, le test échoue. Si un `expectedErrorMessage` est fourni, le message de l'erreur doit correspondre exactement.
- **`displaySummary()`** : affiche le bilan final (nombre de tests, réussis, échoués). À appeler **après** tous les tests.
```js
// Compteurs pour le suivi des tests
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Codes de couleur ANSI
const colours = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  background: {
    blue: '\x1b[44m',
    green: '\x1b[42m',
    red: '\x1b[41m'
  }
};

// Framework de test simple
function test(name, callback) {
  totalTests++;
  try {
    callback();
    passedTests++;
    console.log(`${colours.green}✓${colours.reset} Passed test: ${name}`);
  } catch (error) {
    failedTests++;
    console.error(`${colours.red}✗${colours.reset} Failed test: ${name}`);
    console.error(`  Erreur: ${error.message}`);
  }
}

function assertEquals(currentValue, expectedValue, message) {
  if (currentValue !== expectedValue) {
    throw new Error(message || `Expected value: ${expectedValue}, Current value: ${currentValue}`);
  }
}

function assertThrows(callback, expectedErrorMessage, message) {
  try {
    callback();
    throw new Error(message || "An error was expected but none was thrown");
  } catch (error) {
    if (expectedErrorMessage && error.message !== expectedErrorMessage) {
      throw new Error(`Expected error message: "${expectedErrorMessage}", received: "${error.message}"`);
    }
  }
}

// Fonction pour afficher le tableau récapitulatif
function displaySummary() {
  console.log("\n" + colours.background.blue + "======== TEST SUMMARY ========" + colours.reset);
  console.log("┌────────────────┬───────────────────┐");
  console.log(`│ Total tests    │ ${totalTests.toString().padStart(17, ' ')} │`);
  console.log("├────────────────┼───────────────────┤");
  console.log(`│ Passed tests   │ ${colours.green}${passedTests.toString().padStart(17, ' ')}${colours.reset} │`);
  console.log("├────────────────┼───────────────────┤");
  console.log(`│ Failed tests   │ ${failedTests > 0 ? colours.red : colours.green}${failedTests.toString().padStart(17, ' ')}${colours.reset} │`);
  console.log("└────────────────┴───────────────────┘");
  
  if (failedTests === 0) {
    console.log(colours.background.green + " All tests passed successfully! " + colours.reset);
  } else {
    console.log(colours.background.red + ` Warning: ${failedTests} test(s) failed! ` + colours.reset);
  }
}
```

## Écrire les tests

On importe toutes les fonctions exportées depuis le fichier source, puis on organise les tests par **groupe logique** (une section par fonction). Chaque test suit la convention de nommage : `[nomDeLaFonction] should [comportement attendu]`.

> **Bonne pratique** : un test doit être **indépendant**, **répétable** et **rapide**. Il ne doit pas dépendre de l'état d'un autre test. 
```js
const {
    calculateTotalTripCost,
    calculateTripCostWithoutTaxes,
    calculatePriceWithTaxes,
    getRatePerKm,
    calculateTaxRate,
    validateInputs
} = require('./delivery');

console.log("\n" + colours.background.blue + "=== Tests for calculateTripPrice ===" + colours.reset);

// Tests for calculateTotalTripCost
// On vérifie les 3 tranches de distance pour chaque type de service,
// la tranche > 1000 km en premium (taux de taxe différent),
// et les erreurs d'entrée.
test('calculateTotalTripCost should correctly calculate the price for a short standard trip', () => {
  const price = calculateTotalTripCost(50, 'standard');
  assertEquals(price, 50 * 10 * 1.2, "Incorrect price for a short standard trip");
});

test('calculateTotalTripCost should correctly calculate the price for a medium standard trip', () => {
  const price = calculateTotalTripCost(200, 'standard');
  assertEquals(price, 200 * 8 * 1.2, "Incorrect price for a medium standard trip");
});

test('calculateTotalTripCost should correctly calculate the price for a long standard trip', () => {
  const price = calculateTotalTripCost(600, 'standard');
  assertEquals(price, 600 * 6 * 1.2, "Incorrect price for a long standard trip");
});

test('calculateTotalTripCost should correctly calculate the price for a short premium trip', () => {
  const price = calculateTotalTripCost(50, 'premium');
  assertEquals(price, 50 * 15 * 1.15, "Incorrect price for a short premium trip");
});

test('calculateTotalTripCost should correctly calculate the price for a medium premium trip', () => {
  const price = calculateTotalTripCost(200, 'premium');
  assertEquals(price, 200 * 12 * 1.15, "Incorrect price for a medium premium trip");
});

test('calculateTotalTripCost should correctly calculate the price for a long premium trip', () => {
  const price = calculateTotalTripCost(600, 'premium');
  assertEquals(price, 600 * 10 * 1.15, "Incorrect price for a long premium trip");
});

test('calculateTotalTripCost should correctly calculate the price for a very long premium trip', () => {
  const price = calculateTotalTripCost(1200, 'premium');
  assertEquals(price, 1200 * 10 * 1.1, "Incorrect price for a very long premium trip");
});

test('calculateTotalTripCost should throw an error for an invalid distance', () => {
  assertThrows(() => calculateTotalTripCost(-10, 'standard'), "Distance must be a non-negative number");
  assertThrows(() => calculateTotalTripCost(0, 'standard'), "Distance must be a non-negative number");
  assertThrows(() => calculateTotalTripCost('abc', 'standard'), "Distance must be a non-negative number");
});

test('calculateTotalTripCost should throw an error for an invalid service type', () => {
  assertThrows(() => calculateTotalTripCost(100, 'economy'), "Service type must be 'standard' or 'premium'");
  assertThrows(() => calculateTotalTripCost(100, ''), "Service type must be 'standard' or 'premium'");
});

console.log("\n" + colours.background.blue + "=== Tests for validateInputs ===" + colours.reset);

// Tests for validateInputs
// validateInputs ne retourne rien : on vérifie qu'elle ne lève pas d'erreur
// pour des entrées valides, et qu'elle lève la bonne erreur pour chaque cas invalide.
test('validateInputs should not throw for valid parameters', () => {
  validateInputs(100, 'standard'); // ne doit pas lever d'erreur
  validateInputs(100, 'premium');
});

test('validateInputs should throw an error for a negative distance', () => {
  assertThrows(() => validateInputs(-5, 'standard'), "Distance must be a non-negative number");
});

test('validateInputs should throw an error for a zero distance', () => {
  assertThrows(() => validateInputs(0, 'standard'), "Distance must be a non-negative number");
});

test('validateInputs should throw an error for a non-numeric distance', () => {
  assertThrows(() => validateInputs('abc', 'standard'), "Distance must be a non-negative number");
});

test('validateInputs should throw an error for an invalid service type', () => {
  assertThrows(() => validateInputs(100, 'economy'), "Service type must be 'standard' or 'premium'");
});

console.log("\n" + colours.background.blue + "=== Tests for calculateTripCostWithoutTaxes ===" + colours.reset);

// Tests for calculateTripCostWithoutTaxes
// On vérifie que chaque combinaison (distance, service) produit bien distance × tarif.
test('calculateTripCostWithoutTaxes should correctly calculate the base trip cost', () => {
  assertEquals(calculateTripCostWithoutTaxes(50, 'standard'), 50 * 10, "Incorrect base cost for short standard trip");
  assertEquals(calculateTripCostWithoutTaxes(200, 'standard'), 200 * 8, "Incorrect base cost for medium standard trip");
  assertEquals(calculateTripCostWithoutTaxes(600, 'standard'), 600 * 6, "Incorrect base cost for long standard trip");
  
  assertEquals(calculateTripCostWithoutTaxes(50, 'premium'), 50 * 15, "Incorrect base cost for short premium trip");
  assertEquals(calculateTripCostWithoutTaxes(200, 'premium'), 200 * 12, "Incorrect base cost for medium premium trip");
  assertEquals(calculateTripCostWithoutTaxes(600, 'premium'), 600 * 10, "Incorrect base cost for long premium trip");
});

console.log("\n" + colours.background.blue + "=== Tests for getRatePerKm ===" + colours.reset);

// Tests for getRatePerKm
// On couvre les 3 tranches pour chaque type de service, et les valeurs limites
// exactes (100 km et 500 km) pour s'assurer que les frontières sont correctes.
test('getRatePerKm should return the correct rate for a standard service', () => {
  assertEquals(getRatePerKm(50, 'standard'), 10, "Incorrect rate for short standard trip");
  assertEquals(getRatePerKm(200, 'standard'), 8, "Incorrect rate for medium standard trip");
  assertEquals(getRatePerKm(600, 'standard'), 6, "Incorrect rate for long standard trip");
});

test('getRatePerKm should return the correct rate for a premium service', () => {
  assertEquals(getRatePerKm(50, 'premium'), 15, "Incorrect rate for short premium trip");
  assertEquals(getRatePerKm(200, 'premium'), 12, "Incorrect rate for medium premium trip");
  assertEquals(getRatePerKm(600, 'premium'), 10, "Incorrect rate for long premium trip");
});

test('getRatePerKm should handle boundary values correctly', () => {
  assertEquals(getRatePerKm(100, 'standard'), 10, "Incorrect rate for boundary distance between short and medium");
  assertEquals(getRatePerKm(500, 'standard'), 8, "Incorrect rate for boundary distance between medium and long");
});

console.log("\n" + colours.background.blue + "=== Tests for calculateTaxRate ===" + colours.reset);

// Tests for calculateTaxRate
// Pour standard : la taxe est toujours 20% quelle que soit la distance.
// Pour premium : 15% jusqu'à 1000 km inclus, 10% au-delà.
// On vérifie aussi les valeurs limites (999, 1000, 1001).
test('calculateTaxRate should return the correct rate for a standard service', () => {
  assertEquals(calculateTaxRate(50, 'standard'), 0.2, "Incorrect tax rate for standard service");
  assertEquals(calculateTaxRate(500, 'standard'), 0.2, "Incorrect tax rate for standard service");
  assertEquals(calculateTaxRate(1200, 'standard'), 0.2, "Incorrect tax rate for standard service");
});

test('calculateTaxRate should return the correct rate for a short premium service', () => {
  assertEquals(calculateTaxRate(50, 'premium'), 0.15, "Incorrect tax rate for premium service <= 1000 km");
  assertEquals(calculateTaxRate(999, 'premium'), 0.15, "Incorrect tax rate for premium service <= 1000 km");
  assertEquals(calculateTaxRate(1000, 'premium'), 0.15, "Incorrect tax rate for premium service at exactly 1000 km");
});

test('calculateTaxRate should return the correct rate for a long premium service', () => {
  assertEquals(calculateTaxRate(1001, 'premium'), 0.1, "Incorrect tax rate for premium service > 1000 km");
  assertEquals(calculateTaxRate(2000, 'premium'), 0.1, "Incorrect tax rate for premium service > 1000 km");
});

// Afficher le récapitulatif à la fin
displaySummary();
```

## Résumé

| Concept | Définition |
| --- | --- |
| **Test unitaire** | Vérifie qu'une fonction produit le bon résultat, en isolation |
| **Cas nominal** | L'entrée est valide, le code suit le chemin principal |
| **Cas limite** | Valeur exactement à la frontière d'une règle (ex. exactement 100 km) |
| **Cas d'erreur** | Entrée invalide : la fonction doit lever une erreur prévisible |
| **Régression** | Bug introduit par une modification qui cassait un test existant |
| **Jest** | Framework de test JavaScript le plus répandu en production |

**Les bonnes pratiques retenues :**
- Un test = un comportement vérifié. Ne pas tester plusieurs cas indépendants dans un seul test.
- Le nom du test décrit ce qui est vérifié : `[fonction] should [comportement] when [contexte]`.
- Les messages d'erreur des assertions doivent être identiques aux messages levés par le code : tout décalage fait échouer les tests même si la logique est correcte.
- `displaySummary()` se place **après** tous les tests, jamais avant.
- Un code difficile à tester est souvent un signal que la fonction fait trop de choses (violation de SRP).