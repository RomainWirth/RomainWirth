class Animal {
  eat() {
    return "Je mange de la nourriture !";
  }
}

class FlyingBird extends Animal {
  fly() {
    return "Je vole dans les airs !";
  }
}

class NonFlyingBird extends Animal {
  // Pas de méthode fly() ici car cette classe représente les oiseaux qui ne volent pas
}

class Canary extends FlyingBird {
  sing() {
    return "Je chante une belle mélodie !";
  }
}

class OstrichRefactore extends NonFlyingBird {
  run() {
    return "Je cours très vite !";
  }
}

/**
 * AVANTAGES DE CETTE APPROCHE:
 * 
 * 1. Chaque classe ne promet que ce qu'elle peut réellement fournir.
 * 2. Les sous-classes peuvent être utilisées partout où leur classe de base est attendue.
 * 3. Le code client n'a pas besoin de connaître le type spécifique de l'objet.
 * 4. La hiérarchie de classes est plus précise et reflète mieux le monde réel.
 * 5. Pas d'exceptions ou de comportements inattendus lors de la substitution.
 */

// Fonction qui utilise uniquement les oiseaux qui peuvent voler
function makeFlyingBirdFly(flyingBird) {
  return flyingBird.fly();
}

// Fonction générique qui fonctionne avec n'importe quel animal
function feedAnimal(animal) {
  return animal.eat();
}

function demonstrateGoodApproach() {
  const canary = new Canary();
  const ostrich = new OstrichRefactore();
  
  // Tous les animaux peuvent manger
  console.log(`Canari mange: ${feedAnimal(canary)}`);
  console.log(`Autruche mange: ${feedAnimal(ostrich)}`);
  
  // Seuls les oiseaux qui peuvent voler sont passés à cette fonction
  console.log(`Canari vole: ${makeFlyingBirdFly(canary)}`);
  
  // On ne tente pas de faire voler l'autruche car son type n'implique pas cette capacité
  console.log(`Autruche court: ${ostrich.run()}`);
  
  // La substitution fonctionne correctement sans erreurs
  const flyingBirds = [new FlyingBird(), new Canary()];
  flyingBirds.forEach(bird => {
    console.log(makeFlyingBirdFly(bird));
  });
}

console.log("\n==== Exemple qui respecte le principe ====");
demonstrateGoodApproach();
