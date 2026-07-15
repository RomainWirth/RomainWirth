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
    calculateTaxRate
}