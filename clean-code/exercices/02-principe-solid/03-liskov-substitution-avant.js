// Identifier les problèmes dans le code ci-dessous et proposer une solution pour respecter le principe de substitution de Liskov (Liskov Substitution Principle) du SOLID.
class Bird {
  fly() {
    return "Je vole dans les airs !";
  }

  eat() {
    return "Je mange des graines !";
  }
}

class Ostrich extends Bird {
  // Une autruche est un oiseau qui ne peut pas voler
  // Cela viole le principe de substitution de Liskov, car on s'attend
  // à ce que tous les oiseaux puissent voler
  fly() {
    throw new Error("Je ne peux pas voler !");
  }
}

// Exemple d'utilisation qui montre le problème
function makeBirdFly(bird) {
  return bird.fly(); // Ceci fonctionnera pour Bird mais pas pour Ostrich
}

function demonstrateBadApproach() {
  try {
    const bird = new Bird();
    console.log(`Bird: ${makeBirdFly(bird)}`);
    
    const ostrich = new Ostrich();
    console.log(`Ostrich: ${makeBirdFly(ostrich)}`); // Ceci lancera une erreur
  } catch (error) {
    console.log(`Erreur avec l'autruche: ${error.message}`);
  }
}

demonstrateBadApproach();