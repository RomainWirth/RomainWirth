/**
 * PRINCIPE OUVERT/FERMÉ (Open/Closed Principle)
 * 
 * "Les entités logicielles (classes, modules, fonctions, etc.) doivent être 
 * ouvertes à l'extension, mais fermées à la modification."
 * - Bertrand Meyer
 * 
 * Ce principe stipule qu'une classe doit être conçue de manière à ce qu'on 
 * puisse étendre son comportement sans avoir à la modifier.
 */

class PriceCalculator {
  calculatePrice(product) {
    if (product.type === 'livre') {
      // Calcul du prix pour un livre
      return product.basePrice - (product.basePrice * 0.10); // 10% de réduction
    } 
    else if (product.type === 'electronique') {
      // Calcul du prix pour un produit électronique
      return product.basePrice + (product.basePrice * 0.20); // Taxe de 20%
    } 
    else if (product.type === 'alimentaire') {
      // Calcul du prix pour un produit alimentaire
      return product.basePrice + (product.basePrice * 0.05); // Taxe de 5%
    }
    // Prix par défaut
    return product.basePrice;
  }
}

/**
 * PROBLÈMES AVEC CET EXEMPLE:
 * 
 * 1. Si nous ajoutons un nouveau type de produit (par exemple "vêtement"),
  nous devons modifier la classe PriceCalculator.
 * 2. Plus on ajoute de types de produits, plus la méthode calculerPrix devient longue et complexe.
 * 3. Risque d'introduire des bugs dans du code existant lors de l'ajout de nouveaux types.
 * 4. Violation du principe de responsabilité unique car la classe gère le calcul de prix
 *    pour tous les types de produits.
 */

// Exemple d'utilisation du mauvais exemple
function demonstrateBadApproach() {
  const calculator = new PriceCalculator();
  
  const book = { type: 'livre', basePrice: 20 };
  const electronic = { type: 'electronique', basePrice: 100 };
  const food = { type: 'alimentaire', basePrice: 5 };
  
  console.log(`Prix du livre: ${calculator.calculatePrice(book)}`);
  console.log(`Prix de l'électronique: ${calculator.calculatePrice(electronic)}`);
  console.log(`Prix du produit alimentaire: ${calculator.calculatePrice(food)}`);
  
  // Si on veut ajouter un nouveau type, il faut modifier la classe PriceCalculator
  const vetement = { type: 'vetement', basePrice: 50 };
  console.log(`Prix du vêtement: ${calculator.calculatePrice(vetement)}`); // Retournera le prix de base
}

console.log("==== Exemple qui ne respecte pas le principe ====");
demonstrateBadApproach();