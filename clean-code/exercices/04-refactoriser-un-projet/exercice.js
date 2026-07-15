/**
 * EXERCICE DE REFACTORING
 * 
 * Consigne: Refactoriser ce code pour le rendre plus lisible, maintenable et conforme 
 * aux principes du Clean Code:
 * 1. Améliorer le nommage
 * 2. Diviser en fonctions avec responsabilité unique
 * 3. Éliminer la duplication
 * 4. Gérer correctement les erreurs
 * 5. Ajouter des commentaires utiles (si nécessaire)
 * 6. ...
 */

/**
 * Calcule le prix final pour un service de livraison basé sur la distance et le type 
 * de service.
 * @param {number} d - La distance de livraison en kilomètres
 * @param {string} t - Le type de service ('standard' ou 'premium')
 * @returns {number} Le prix final incluant la taxe
 * 
 * Pour le service standard:
 * - Tarif de 10/km pour les distances <= 100km
 * - Tarif de 8/km pour les distances entre 100km et 500km
 * - Tarif de 6/km pour les distances > 500km
 * - Taux de taxe fixe de 20%
 * 
 * Pour le service premium:
 * - Tarif de 15/km pour les distances <= 100km
 * - Tarif de 12/km pour les distances entre 100km et 500km
 * - Tarif de 10/km pour les distances > 500km
 * - Taux de taxe de 15% pour les distances <= 1000km
 * - Taux de taxe de 10% pour les distances > 1000km
 */
function p(d, t) {
    let r = 0;
    let tx = 0;

    if (t === "standard") {
        if (d <= 100) {
            r = d * 10;
        } else if (d > 100 && d <= 500) {
            r = d * 8;
        } else if (d > 500) {
            r = d * 6;
        }
        tx = 0.2;
    } else if (t === "premium") {
        if (d <= 100) {
            r = d * 15;
        } else if (d > 100 && d <= 500) {
            r = d * 12;
        } else if (d > 500) {
            r = d * 10;
        }
        if (d > 1000) {
            tx = 0.1;
        } else {
            tx = 0.15;
        }
    }

    let f = r * (1 + tx);

    console.log("Prix: " + f);
    return f;
}

// Exemple d'utilisation
p(150, "standard"); // Calcul pour 150 km en standard
p(700, "premium");  // Calcul pour 700 km en premium