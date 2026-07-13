// Identifier les problèmes dans le code ci-dessous et proposer une solution pour respecter le principe ouvert/fermé (Open/Closed) du SOLID.
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

demonstrateBadApproach();