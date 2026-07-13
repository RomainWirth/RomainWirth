class PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice; // Implémentation par défaut
  }
}

// Stratégie pour les livres
class PriceStrategyBook extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice - (basePrice * 0.10); // 10% de réduction
  }
}

// Stratégie pour les produits électroniques
class PriceStrategyElectronic extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.20); // Taxe de 20%
  }
}

// Stratégie pour les produits alimentaires
class PriceStrategyFood extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.05); // Taxe de 5%
  }
}
class PriceStrategyV extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.08); // Taxe de 8%
  }
}

// Classe Produit qui utilise une stratégie de prix
class Product {
  constructor(name, basePrice, priceStrategy) {
    this.name = name;
    this.basePrice = basePrice;
    this.priceStrategy = priceStrategy;
  }

  getFinalPrice() {
    return this.priceStrategy.calculatePrice(this.basePrice);
  }
}

// Nouveau calculateur de prix qui respecte le principe OCP
class PriceCalculator {
  calculatePrice(product) {
    return product.getFinalPrice();
  }
}
/**
 * AVANTAGES DE CETTE APPROCHE:
 * 
 * 1. La classe Produit est fermée à la modification, mais ouverte à l'extension
 * 2. Pour ajouter un nouveau type de produit, il suffit de créer une nouvelle stratégie
 *    sans modifier le code existant
 * 3. Chaque stratégie a une seule responsabilité
 * 4. Le code est plus modulaire et plus facile à tester
 * 5. Le comportement peut être changé à l'exécution en changeant la stratégie
 */

// Exemple d'utilisation de la bonne approche
function demonstrateGoodApproach() {
  const strategieLivre = new PriceStrategyBook();
  const strategieElectronique = new PriceStrategyElectronic();
  const strategieAlimentaire = new PriceStrategyFood();
  
  const livre = new Product('Le Petit Prince', 20, strategieLivre);
  const electronique = new Product('Téléphone', 100, strategieElectronique);
  const alimentaire = new Product('Pommes', 5, strategieAlimentaire);
  
  const calculateur = new PriceCalculator();

  console.log(`Prix du livre: ${calculateur.calculatePrice(livre)}`);
  console.log(`Prix de l'électronique: ${calculateur.calculatePrice(electronique)}`);
  console.log(`Prix du produit alimentaire: ${calculateur.calculatePrice(alimentaire)}`);
  
  // Ajout d'un nouveau type de produit sans modifier les classes existantes
  class PriceStrategyClothing extends PriceStrategy {
    calculatePrice(basePrice) {
      return basePrice + (basePrice * 0.15); // Taxe de 15%
    }
  }
  
  const strategieVetement = new PriceStrategyClothing();
  const vetement = new Product('T-shirt', 50, strategieVetement);

  console.log(`Prix du vêtement: ${calculateur.calculatePrice(vetement)}`);
}

console.log("\n==== Exemple qui respecte le principe ====");
demonstrateGoodApproach();