# Les principes SOLID

## Introduction

Cet acronyme est un moyen mnémotechnique pour aider à se souvenir des principes.

Le fait de respecter ces principes permettent de produire des applications/logiciels plus maintenable, evolutif, avec une meilleure structure et une architecturé.

SOLID est un acronyme qui signifie : 
* Single responsibility principle : Responsabilité unique
* Open/closed principle : Ouvert/fermé
* Liskov substitution principle : Substitution de liskov
* Interface segregation principle : Ségrégation des interfaces
* Dependency inversion principle : Inversion des dépendances

## Single Responsibility : Principe de Responsabilité Unique

"Une classe ne devrait avoir qu'une seule raison de changer." - Robert C. Martin

Ce principe stipule qu'une classe ou module doit avoir une seule responsabilité, c'est-à-dire qu'elle ne devrait s'occuper que d'une seule tâche ou préoccupation : une classe, une fonction ou une méthode doit avoir une et une seule unique raison d'être. 

Cela favorise la modularité et facilite la maintenance en évitant les classes surchargées de responsabilités.

Cela rejoint le principe DRY (Don't Repeat Yourself) : on crée par exemple une fonction unique qui a sa propre "raison d'être" qu'on peut réutiliser partout où on en a besoin. 
<!-- à vérifier ce que j'ai écrit ici si vraiment logique.  -->

exemple : 
<!-- exemple à vérifier si pas meilleurs de mettre avec une class -->
```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  };

  getCompleteName() {
    return this.name;
  };

  getEmail() {
    return this.email;
  };

  // Cette méthode gère la validation de l'email (responsabilité 1)
  validateEmail() {
    return this.email.includes('@') && this.email.includes('.');
  };

  // Cette méthode gère la persistance des données (responsabilité 2)
  saveToDatabase() {
    console.log(`Sauvegarde de l'utilisateur ${this.name} dans la base de données`);
    // Code de sauvegarde en base de données
  };

  // Cette méthode gère l'envoi d'emails (responsabilité 3)
  sendEmail(subject, content) {
    console.log(`Envoi d'un email à ${this.email} avec le sujet: ${subject}`);
  };
};

const badUser = new User("Pierre Martin", "pierre.martin@exemple.fr");
badUser.validateEmail();
badUser.saveToDatabase();
badUser.sendEmail("Test", "Contenu du message");
```
Problèmes : 
1. La classe User a au moins 3 responsabilités différentes:
   - Gérer les données de l'utilisateur
   - Gérer la persistance en base de données
   - Gérer l'envoi d'emails

2. Si la méthode d'envoi d'emails change, nous devons modifier cette classe.
3. Si la méthode de persistance change, nous devons également modifier cette classe.
4. Difficile à tester car les responsabilités sont mélangées.

```js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  };

  getCompleteName() {
    return this.name;
  };

  getEmail() {
    return this.email;
  };
};

// Responsabilité: Valider les données
class EmailValidator {
  static validate(email) {
    return email.includes('@') && email.includes('.');
  };
};

// Responsabilité: Gérer la persistance des utilisateurs
class UserRepository {
  save(user) {
    console.log(`Sauvegarde de l'utilisateur ${user.getCompleteName()} dans la base de données`);
    // Code de sauvegarde en base de données
  };

  load(id) {
    // Code pour charger un utilisateur depuis la base de données
    console.log(`Chargement de l'utilisateur avec l'ID ${id}`);
    return new User("Utilisateur chargé", "exemple@email.com");
  };
};

// Responsabilité: Gérer l'envoi d'emails
class EmailService {
  send(recipient, subject, content) {
    console.log(`Envoi d'un email à ${recipient} avec le sujet: ${subject}`);
    // Code d'envoi d'email
  };
};

// Exemple d'utilisation
function demonstrateUser() {
  // Création d'un utilisateur
  const utilisateur = new User("Jean Dupont", "jean.dupont@exemple.fr");
  
  // Validation de l'email
  if (EmailValidator.validate(utilisateur.getEmail())) {
    // Sauvegarde de l'utilisateur
    const repo = new UserRepository();
    repo.save(utilisateur);
    
    // Envoi d'un email de bienvenue
    const emailService = new EmailService();
    emailService.send(
      utilisateur.getEmail(),
      "Bienvenue !",
      `Bonjour ${utilisateur.getCompleteName()}, bienvenue sur notre plateforme !`,
    );
  };
};

demonstrateUser();
```
Avantages : 
1. Chaque classe a une seule responsabilité bien définie
2. Les changements dans une responsabilité n'affectent qu'une seule classe
3. Plus facile à tester car chaque composant peut être testé isolément
4. Plus facile à maintenir et à étendre
5. Meilleure réutilisation du code

Si nous devons changer la façon dont les emails sont envoyés, nous ne modifions que EmailService.
Si nous devons changer la méthode de persistance, nous ne modifions que UserRepository.

## Open/Closed : Principe Ouvert/Fermé

"Les entités logicielles (classes, modules, fonctions, etc.) doivent être ouvertes à l'extension, mais fermées à la modification." - Bertrand Meyer

Ce principe stipule qu'une classe doit être conçue de manière à ce qu'on puisse étendre son comportement sans avoir à la modifier.

Une entité applicative (classe, fonction, module ...) doit être fermée à la modification directe mais ouverte à l'extension. L'objectif est de permettre l'ajout de nouvelles fonctionnalités sans altérer le code existant.

```js
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
  };
};

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
};

demonstrateBadApproach();
```
Problèmes : 
1. Si nous ajoutons un nouveau type de produit (par exemple "vêtement"), nous devons modifier la classe PriceCalculator.
2. Plus on ajoute de types de produits, plus la méthode calculerPrix devient longue et complexe.
3. Risque d'introduire des bugs dans du code existant lors de l'ajout de nouveaux types.
4. Violation du principe de responsabilité unique car la classe gère le calcul de prix pour tous les types de produits.

```js
class PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice; // Implémentation par défaut
  };
};

// Stratégie pour les livres
class PriceStrategyBook extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice - (basePrice * 0.10); // 10% de réduction
  };
};

// Stratégie pour les produits électroniques
class PriceStrategyElectronic extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.20); // Taxe de 20%
  };
};

// Stratégie pour les produits alimentaires
class PriceStrategyFood extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.05); // Taxe de 5%
  };
};
class PriceStrategyV extends PriceStrategy {
  calculatePrice(basePrice) {
    return basePrice + (basePrice * 0.08); // Taxe de 8%
  };
};

// Classe Produit qui utilise une stratégie de prix
class Product {
  constructor(name, basePrice, priceStrategy) {
    this.name = name;
    this.basePrice = basePrice;
    this.priceStrategy = priceStrategy;
  };

  getFinalPrice() {
    return this.priceStrategy.calculatePrice(this.basePrice);
  };
};

// Nouveau calculateur de prix qui respecte le principe OCP
class PriceCalculator {
  calculatePrice(product) {
    return product.getFinalPrice();
  };
};

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
    };
  };
  
  const strategieVetement = new PriceStrategyClothing();
  const vetement = new Product('T-shirt', 50, strategieVetement);

  console.log(`Prix du vêtement: ${calculateur.calculatePrice(vetement)}`);
};

demonstrateGoodApproach();
```
Avantages :
1. La classe Produit est fermée à la modification, mais ouverte à l'extension
2. Pour ajouter un nouveau type de produit, il suffit de créer une nouvelle stratégie sans modifier le code existant
3. Chaque stratégie a une seule responsabilité
4. Le code est plus modulaire et plus facile à tester
5. Le comportement peut être changé à l'exécution en changeant la stratégie


## Liskov Substitution : Principe de Substitution de Liskov

"Si S est un sous-type de T, alors les objets de type T peuvent être remplacés par des objets de type S sans altérer les propriétés désirables du programme." - Barbara Liskov

Ce principe stipule que les objets d'une classe dérivée doivent pouvoir remplacer les objets de la classe de base sans affecter la cohérence du programme.

une instance de type T doit pouvoir être remplacée par une instance de type G, tel que G sous-type de T, sans que cela ne modifie la cohérence du programme. Cela garantit que les sous-classes peuvent être utilisées de manière interchangeable avec leurs classes de base.

<!-- ajouter exemple  -->
```JS
class Bird {
  fly() {
    return "Je vole dans les airs !";
  };

  eat() {
    return "Je mange des graines !";
  };
};

class Ostrich extends Bird {
  // Une autruche est un oiseau qui ne peut pas voler
  // Cela viole le principe de substitution de Liskov, car on s'attend
  // à ce que tous les oiseaux puissent voler
  fly() {
    throw new Error("Je ne peux pas voler !");
  };
};

function makeBirdFly(bird) {
  return bird.fly(); // Ceci fonctionnera pour Bird mais pas pour Ostrich
};

function demonstrateBadApproach() {
  try {
    const bird = new Bird();
    console.log(`Bird: ${makeBirdFly(bird)}`);
    
    const ostrich = new Ostrich();
    console.log(`Ostrich: ${makeBirdFly(ostrich)}`); // Ceci lancera une erreur
  } catch (error) {
    console.log(`Erreur avec l'autruche: ${error.message}`);
  }
};

demonstrateBadApproach();
```
Problèmes : 
1. Une instance d'Autruche ne peut pas être utilisée partout où une instance d'Oiseau est attendue sans causer d'erreurs.
2. Le code qui utilise la classe Oiseau doit connaître les spécificités de ses sous-classes pour éviter des erreurs.
3. Si nous remplaçons un Oiseau par une Autruche, le comportement change de façon inattendue (erreur plutôt que vol).

```js
class Animal {
  eat() {
    return "Je mange de la nourriture !";
  };
};

class FlyingBird extends Animal {
  fly() {
    return "Je vole dans les airs !";
  };
};

class NonFlyingBird extends Animal {
  // Pas de méthode fly() ici car cette classe représente les oiseaux qui ne volent pas
};

class Canary extends FlyingBird {
  sing() {
    return "Je chante une belle mélodie !";
  };
};

class OstrichRefactore extends NonFlyingBird {
  run() {
    return "Je cours très vite !";
  };
};

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

demonstrateGoodApproach();
```
Avantages :
1. Chaque classe ne promet que ce qu'elle peut réellement fournir.
2. Les sous-classes peuvent être utilisées partout où leur classe de base est attendue.
3. Le code client n'a pas besoin de connaître le type spécifique de l'objet.
4. La hiérarchie de classes est plus précise et reflète mieux le monde réel.
5. Pas d'exceptions ou de comportements inattendus lors de la substitution.

Conclusion :
1. Les sous-classes doivent respecter le contrat défini par la classe de base.
2. Les préconditions ne peuvent pas être renforcées dans une sous-classe.
3. Les postconditions ne peuvent pas être affaiblies dans une sous-classe.
4. Les invariants de la classe de base doivent être préservés dans les sous-classes.
5. La règle "est-un" n'est pas suffisante pour déterminer l'héritage; il faut également considérer le comportement de la classe.

Une conception qui respecte le principe de substitution de Liskov rend le code plus robuste, plus facile à comprendre et plus réutilisable.

## Interface segregation : Principe de ségrégation d'interface

"Les clients ne devraient pas être forcés de dépendre d'interfaces qu'ils n'utilisent pas." - Robert C. Martin

Ce principe stipule qu'il vaut mieux avoir plusieurs interfaces spécifiques qu'une seule interface générale. Les classes ne devraient pas être obligées d'implémenter des méthodes dont elles n'ont pas besoin.

préférer plusieurs interfaces spécifiques pour chaque client plutôt qu'une seule interface générale. Cela évite aux classes de dépendre de méthodes dont elles n'ont pas besoin, réduisant ainsi les couplages inutiles.

```js
class MultifunctionDevice {
  constructor() {
    if (this.constructor === MultifunctionDevice) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    };
  };

  print(document) {
    throw new Error("La méthode imprimer doit être implémentée");
  };

  scan(document) {
    throw new Error("La méthode scan doit être implémentée");
  };

  photocopy(document) {
    throw new Error("La méthode photocopy doit être implémentée");
  };

  sendFax(document) {
    throw new Error("La méthode sendFax doit être implémentée");
  };
};

// Une imprimante simple n'a pas besoin de scanner, photocopier ou envoyer des fax
class SimplePrinter extends MultifunctionDevice {
  print(document) {
    console.log(`Impression du document: ${document}`);
    return true;
  };

  // Obligé d'implémenter ces méthodes même si elles ne sont pas utilisées
  scan(document) {
    throw new Error("Cette imprimante ne peut pas scanner");
  };

  photocopy(document) {
    throw new Error("Cette imprimante ne peut pas photocopier");
  };

  sendFax(document) {
    throw new Error("Cette imprimante ne peut pas envoyer de fax");
  };
};

// Un scanner simple n'a pas besoin d'imprimer, photocopier ou envoyer des fax
class SimpleScanner extends MultifunctionDevice {
  scan(document) {
    console.log(`Numérisation du document: ${document}`);
    return `${document}_scanned`;
  };

  // Obligé d'implémenter ces méthodes même si elles ne sont pas utilisées
  print(document) {
    throw new Error("Ce scanner ne peut pas imprimer");
  };

  photocopy(document) {
    throw new Error("Ce scanner ne peut pas photocopier");
  };

  sendFax(document) {
    throw new Error("Ce scanner ne peut pas envoyer de fax");
  };
};

function demonstrateBadApproach() {
  try {
    const printer = new SimplePrinter();
    printer.print("rapport.pdf"); // Fonctionne bien
    
    try {
      printer.scan("rapport.pdf"); // Lancera une erreur
    } catch (error) {
      console.log(`Erreur: ${error.message}`);
    }
    
    const scanner = new SimpleScanner();
    scanner.scan("facture.pdf"); // Fonctionne bien
    
    try {
      scanner.print("facture.pdf"); // Lancera une erreur
    } catch (error) {
      console.log(`Erreur: ${error.message}`);
    }
  } catch (error) {
    console.log(`Erreur inattendue: ${error.message}`);
  }
};

demonstrateBadApproach();
```
Problèmes :
1. Les classes sont forcées d'implémenter des méthodes qu'elles n'utilisent pas.
2. Les classes lèvent des exceptions pour des fonctionnalités qu'elles ne supportent pas, ce qui peut causer des problèmes à l'exécution.
3. Les clients qui utilisent ces classes doivent connaître les limitations spécifiques de chaque implémentation.
4. Le code est moins lisible et plus difficile à maintenir.

```js
// Interface pour l'impression
class Imprimable {
  constructor() {
    if (this.constructor === Imprimable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  };

  imprimer(document) {
    throw new Error("La méthode imprimer doit être implémentée");
  };
};

// Interface pour la numérisation
class Scannable {
  constructor() {
    if (this.constructor === Scannable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  };

  scanner(document) {
    throw new Error("La méthode scanner doit être implémentée");
  };
};

// Interface pour l'envoi de fax
class FaxEnvoyable {
  constructor() {
    if (this.constructor === FaxEnvoyable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    };
  };

  envoyerFax(document) {
    throw new Error("La méthode envoyerFax doit être implémentée");
  };
};

// Implémentation d'une imprimante simple
class ImprimanteRefactoree extends Imprimable {
  imprimer(document) {
    console.log(`Impression du document: ${document}`);
    return true;
  };
};

// Implémentation d'un scanner simple
class ScannerRefactore extends Scannable {
  scanner(document) {
    console.log(`Numérisation du document: ${document}`);
    return `${document}_scanned`;
  };
};

// Implémentation d'un télécopieur simple
class TelecopieurRefactore extends FaxEnvoyable {
  envoyerFax(document) {
    console.log(`Envoi du document par fax: ${document}`);
    return true;
  };
};

// Un appareil multifonction qui implémente plusieurs interfaces
class AppareilMultifonctionRefactore extends Imprimable {
  constructor() {
    super();
    this._scanner = new ScannerRefactore();
    this._fax = new TelecopieurRefactore();
  };

  imprimer(document) {
    console.log(`Impression du document par l'appareil multifonction: ${document}`);
    return true;
  };

  scanner(document) {
    return this._scanner.scanner(document);
  };

  envoyerFax(document) {
    return this._fax.envoyerFax(document);
  };
  
  photocopier(document) {
    const documentScanne = this.scanner(document);
    this.imprimer(documentScanne);
    console.log(`Photocopie du document: ${document}`);
    return true;
  };
};

function demonstrateGoodApproach() {
  // Utilisation d'une imprimante simple
  const imprimante = new ImprimanteRefactoree();
  imprimante.imprimer("rapport.pdf");
  
  // Utilisation d'un scanner simple
  const scanner = new ScannerRefactore();
  scanner.scanner("facture.pdf");
  
  // Utilisation d'un télécopieur simple
  const fax = new TelecopieurRefactore();
  fax.envoyerFax("contrat.pdf");
  
  // Utilisation d'un appareil multifonction
  const multifonction = new AppareilMultifonctionRefactore();
  multifonction.imprimer("document1.pdf");
  multifonction.scanner("document2.pdf");
  multifonction.envoyerFax("document3.pdf");
  multifonction.photocopier("document4.pdf");
  
  console.log("\nUtilisation polymorphique:");
  
  // Démonstration de polymorphisme avec des interfaces spécifiques
  const imprimables = [imprimante, multifonction];
  imprimables.forEach(imprimable => {
    imprimable.imprimer("document_polymorphique.pdf");
  });
};

demonstrateGoodApproach();
```
Avantages : 
1. Chaque classe n'implémente que les méthodes dont elle a besoin.
2. Les clients ne dépendent que des interfaces qu'ils utilisent réellement.
3. Les interfaces sont plus petites, plus cohérentes et plus faciles à comprendre.
4. Facilite la maintenance et l'évolution du code.
5. Le code est plus modulaire et respecte mieux le principe de responsabilité unique.
6. Utilise la composition plutôt que l'héritage pour l'appareil multifonction.

Conclusion :
1. Concevez des interfaces fines et cohérentes plutôt qu'une seule interface générique.
2. Les clients ne devraient dépendre que des méthodes qu'ils utilisent réellement.
3. Ce principe nous aide à éviter les dépendances inutiles et les effets de bord.
4. Les interfaces ségrégées facilitent la mise en œuvre de mocks pour les tests.
5. En JavaScript, où les interfaces ne sont pas natives, ce principe s'applique aux
   contrats implicites entre les composants.

La ségrégation des interfaces nous permet de créer des systèmes plus modulaires,
plus flexibles et plus faciles à maintenir.

