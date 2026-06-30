function calculatePriceWithDuplication(products) {
  let total = 0;

  for (const product of products) {
    if (product.category === 'food') {
      total += product.price * 1.055;
    } else if (product.category === 'books') {
      total += product.price * 1.055;
    } else if (product.category === 'standard') {
      total += product.price * 1.2;
    }
  }

  return total;
}

const VAT_RATE = {
  food: 1.055,
  books: 1.055,
  standard: 1.2,
  default: 1.1,
};

function calculatePriceDry(products) {
  let total = 0;

  for (const product of products) {
    const rate = VAT_RATE[product.category] || VAT_RATE.default;
    total += product.price * rate;
  }

  return total;
}

class User {
  constructor(name, email, registrationDate, isPremium = false) {
    this.name = name;
    this.email = email;
    this.registrationDate = registrationDate;
    this.isPremium = isPremium;
  }

  displayInfo() {
    const userType = this.isPremium ? 'premium' : 'standard';
    console.log(`Utilisateur ${userType}: ${this.name}, ${this.email}, inscrit le ${this.registrationDate}`);
  }
}

const products = [
  { category: 'food', price: 10 },
  { category: 'standard', price: 50 },
];

console.log('Total (duplique):', calculatePriceWithDuplication(products));
console.log('Total (DRY):', calculatePriceDry(products));
