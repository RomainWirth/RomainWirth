// Import des fonctions à tester
const {
    calculateTotalTripCost,
    calculateTripCostWithoutTaxes,
    calculatePriceWithTaxes,
    getRatePerKm,
    calculateTaxRate
} = require('./delivery');

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

console.log("\n" + colours.background.blue + "=== Tests for calculateTripPrice ===" + colours.reset);
displaySummary();

// Tests for calculateTotalTripCost
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
  assertThrows(() => calculateTotalTripCost(-10, 'standard'), "Distance must be a positive number");
  assertThrows(() => calculateTotalTripCost(0, 'standard'), "Distance must be a positive number");
  assertThrows(() => calculateTotalTripCost('abc', 'standard'), "Distance must be a positive number");
});

test('calculateTotalTripCost should throw an error for an invalid service type', () => {
  assertThrows(() => calculateTotalTripCost(100, 'economy'), "Service type must be 'standard' or 'premium'");
  assertThrows(() => calculateTotalTripCost(100, ''), "Service type must be 'standard' or 'premium'");
});

console.log("\n" + colours.background.blue + "=== Tests for validateInput ===" + colours.reset);

// Tests for validateInput
test('validateInput should validate correct parameters', () => {
  validateInput(100, 'standard'); // Should not throw an error
  validateInput(100, 'premium'); // Should not throw an error
});

test('validateInput should throw an error for a negative distance', () => {
  assertThrows(() => validateInput(-5, 'standard'), "Distance must be a positive number");
});

test('validateInput should throw an error for a zero distance', () => {
  assertThrows(() => validateInput(0, 'standard'), "Distance must be a positive number");
});

test('validateInput should throw an error for a non-numeric distance', () => {
  assertThrows(() => validateInput('abc', 'standard'), "Distance must be a positive number");
});

test('validateInput should throw an error for an invalid service type', () => {
  assertThrows(() => validateInput(100, 'economy'), "Service type must be 'standard' or 'premium'");
});

console.log("\n" + colours.background.blue + "=== Tests for calculateTripCostWithoutTaxes ===" + colours.reset);

// Tests for calculateTripCostWithoutTaxes
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
test('calculateTaxRate should return the correct rate for a standard service', () => {
  assertEquals(calculateTaxRate(50, 'standard'), 0.2, "Incorrect tax rate for standard service");
  assertEquals(calculateTaxRate(500, 'standard'), 0.2, "Incorrect tax rate for standard service");
  assertEquals(calculateTaxRate(1200, 'standard'), 0.2, "Incorrect tax rate for standard service");
});

test('calculateTaxRate should return the correct rate for a short premium service', () => {
  assertEquals(calculateTaxRate(50, 'premium'), 0.15, "Incorrect tax rate for premium service < 1000 km");
  assertEquals(calculateTaxRate(999, 'premium'), 0.15, "Incorrect tax rate for premium service < 1000 km");
});

test('calculateTaxRate should return the correct rate for a long premium service', () => {
  assertEquals(calculateTaxRate(1001, 'premium'), 0.1, "Incorrect tax rate for premium service > 1000 km");
  assertEquals(calculateTaxRate(2000, 'premium'), 0.1, "Incorrect tax rate for premium service > 1000 km");
});

// Afficher le récapitulatif à la fin
displaySummary();