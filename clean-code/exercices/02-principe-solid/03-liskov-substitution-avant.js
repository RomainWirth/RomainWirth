/**
 * PRINCIPE DE SUBSTITUTION DE LISKOV (Liskov Substitution Principle)
 * 
 * "Si S est un sous-type de T, alors les objets de type T peuvent être remplacés 
 * par des objets de type S sans altérer les propriétés désirables du programme."
 * - Barbara Liskov
 * 
 * Ce principe stipule que les objets d'une classe dérivée doivent pouvoir 
 * remplacer les objets de la classe de base sans affecter la cohérence du programme.
 */

// ========================================================================
// EXEMPLE QUI NE RESPECTE PAS LE PRINCIPE DE SUBSTITUTION DE LISKOV
// ========================================================================

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

/**
 * PROBLÈMES AVEC CET EXEMPLE:
 * 
 * 1. Une instance d'Autruche ne peut pas être utilisée partout où une 
 *    instance d'Oiseau est attendue sans causer d'erreurs.
 * 2. Le code qui utilise la classe Oiseau doit connaître les spécificités 
 *    de ses sous-classes pour éviter des erreurs.
 * 3. Si nous remplaçons un Oiseau par une Autruche, le comportement change 
 *    de façon inattendue (erreur plutôt que vol).
 */

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

console.log("==== Exemple qui ne respecte pas le principe ====");
demonstrateBadApproach();

/**
 * CONCLUSION SUR LE PRINCIPE DE SUBSTITUTION DE LISKOV:
 * 
 * 1. Les sous-classes doivent respecter le contrat défini par la classe de base.
 * 2. Les préconditions ne peuvent pas être renforcées dans une sous-classe.
 * 3. Les postconditions ne peuvent pas être affaiblies dans une sous-classe.
 * 4. Les invariants de la classe de base doivent être préservés dans les sous-classes.
 * 5. La règle "est-un" n'est pas suffisante pour déterminer l'héritage; il faut également
 *    considérer le comportement de la classe.
 * 
 * Une conception qui respecte le principe de substitution de Liskov rend le code
 * plus robuste, plus facile à comprendre et plus réutilisable.
 */
