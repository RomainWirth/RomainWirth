# Les principes SOLID

## Introduction

**SOLID** est un moyen mnémotechnique regroupant cinq principes de conception orientée objet. Les principes eux-mêmes ont été formalisés par Robert C. Martin (« Uncle Bob ») au début des années 2000 ; l'acronyme, lui, a été proposé par Michael Feathers.

Respecter ces principes permet de produire des logiciels plus **maintenables**, **évolutifs** et **testables**, avec une meilleure structure et une architecture plus claire. L'objectif commun est de **limiter le couplage** (les dépendances entre composants) et d'**augmenter la cohésion** (chaque composant a un rôle clair), afin que le code puisse évoluer sans se casser.

SOLID est l'acronyme de :

| Lettre | Principe | Idée en une phrase |
| --- | --- | --- |
| **S** | Single Responsibility | Une classe n'a qu'une seule raison de changer. |
| **O** | Open/Closed | Ouvert à l'extension, fermé à la modification. |
| **L** | Liskov Substitution | Une sous-classe doit pouvoir remplacer sa classe parente. |
| **I** | Interface Segregation | Plusieurs interfaces spécifiques valent mieux qu'une interface générale. |
| **D** | Dependency Inversion | Dépendre d'abstractions, pas d'implémentations concrètes. |

> Les exemples de ce chapitre sont en JavaScript. Comme le langage n'a pas d'interfaces natives, on les simule avec des classes « abstraites » et des conventions.

## S — Single Responsibility : Principe de Responsabilité Unique

> « Une classe ne devrait avoir qu'une seule raison de changer. » — Robert C. Martin

Une classe (ou un module, une fonction) ne doit avoir **qu'une seule responsabilité**, c'est-à-dire ne s'occuper que d'une seule préoccupation. La bonne question à se poser est : « **qui**, ou quel type de changement, pourrait m'obliger à modifier cette classe ? ». S'il y a plusieurs réponses (l'équipe base de données, l'équipe métier, l'équipe emailing…), c'est que la classe porte trop de responsabilités.

En pratique, ce principe pousse à **découper** les grosses classes « fourre-tout » en composants spécialisés. On le confond parfois avec DRY (*Don't Repeat Yourself*) : les deux sont complémentaires mais distincts. DRY vise à éviter la duplication ; SRP vise à isoler les raisons de changer. Une classe bien centrée sur une responsabilité est d'ailleurs plus facile à réutiliser sans se répéter.

**Signes d'alerte :** une classe dont le nom contient « Manager », « Helper » ou « Utils », des méthodes sans rapport entre elles, ou une classe qu'on modifie pour des raisons très différentes.

### Mauvais exemple

Ici, la classe `User` gère à la fois les données, la validation, la persistance et l'envoi d'emails :

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

### Bon exemple (refactorisé)

On sépare chaque responsabilité dans sa propre classe : `User` (données), `EmailValidator` (validation), `UserRepository` (persistance) et `EmailService` (emails).

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

## O — Open/Closed : Principe Ouvert/Fermé

> « Les entités logicielles (classes, modules, fonctions…) doivent être ouvertes à l'extension, mais fermées à la modification. » — Bertrand Meyer

On doit pouvoir **ajouter** un nouveau comportement sans **modifier** le code existant. Pourquoi ? Parce que modifier du code déjà écrit, testé et en production risque d'introduire des régressions. À la place, on conçoit des points d'extension (héritage, interfaces, stratégies injectées) qui permettent de brancher de nouvelles fonctionnalités.

Le symptôme typique d'une violation d'OCP est la **longue série de `if/else` ou de `switch`** sur un « type » : chaque nouveau cas oblige à rouvrir la même fonction. La solution passe souvent par le **polymorphisme** (une classe/stratégie par cas), comme dans le *design pattern* Strategy utilisé ci-dessous.

### Mauvais exemple

Chaque nouveau type de produit oblige à modifier la méthode `calculatePrice` :

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

### Bon exemple (refactorisé)

On isole chaque règle de calcul dans une **stratégie** dédiée. Ajouter un type revient à créer une nouvelle classe, sans toucher aux existantes (pattern Strategy) :

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


## L — Liskov Substitution : Principe de Substitution de Liskov

> « Si S est un sous-type de T, alors les objets de type T peuvent être remplacés par des objets de type S sans altérer les propriétés du programme. » — Barbara Liskov

Une sous-classe doit pouvoir **remplacer** sa classe parente **partout** où celle-ci est attendue, sans provoquer d'erreur ni de comportement inattendu. Autrement dit, hériter ne suffit pas : la sous-classe doit **respecter le contrat** de la classe parente.

C'est le principe le plus subtil de SOLID. La relation « **est-un** » du langage courant est trompeuse : une autruche *est un* oiseau, mais si `Bird` promet de savoir voler, alors `Ostrich` ne peut pas tenir ce contrat — la hiérarchie est donc mal conçue. Concrètement, une sous-classe respecte LSP si :
* elle **ne renforce pas** les préconditions (elle n'exige pas plus que le parent) ;
* elle **n'affaiblit pas** les postconditions (elle ne promet pas moins que le parent) ;
* elle **ne lève pas** d'exception là où le parent réussissait.

### Mauvais exemple

`Ostrich` hérite de `Bird` mais ne peut pas voler : elle casse le contrat en levant une erreur.

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

### Bon exemple (refactorisé)

On revoit la hiérarchie : la capacité de voler n'est portée que par les classes qui la possèdent réellement (`FlyingBird`), séparée des oiseaux non-volants (`NonFlyingBird`).

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

## I — Interface Segregation : Principe de Ségrégation des Interfaces

> « Les clients ne devraient pas être forcés de dépendre d'interfaces qu'ils n'utilisent pas. » — Robert C. Martin

Mieux vaut **plusieurs interfaces spécifiques** qu'une seule grosse interface générale. Une classe ne devrait jamais être obligée d'implémenter des méthodes dont elle n'a pas l'usage.

Le symptôme d'une violation est une classe qui implémente une méthode « pour rien » — souvent en la laissant vide ou en levant une erreur « non supporté ». C'est SRP appliqué aux **contrats** : on découpe les grosses interfaces en petits contrats cohérents (`Imprimable`, `Scannable`, `FaxEnvoyable`…), et une classe n'implémente que ceux qui la concernent. Un appareil multifonction combine alors ces contrats, idéalement par **composition** plutôt que par un héritage géant.

### Mauvais exemple

`MultifunctionDevice` impose `print`, `scan`, `photocopy` et `sendFax` à toutes ses sous-classes, même à une simple imprimante :

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

### Bon exemple (refactorisé)

On découpe en interfaces spécifiques (`Imprimable`, `Scannable`, `FaxEnvoyable`). Chaque appareil n'implémente que ce qu'il sait faire, et le multifonction s'appuie sur la composition.

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

## D — Dependency Inversion : Principe d'Inversion des Dépendances

> « Les modules de haut niveau ne devraient pas dépendre des modules de bas niveau : les deux devraient dépendre d'abstractions. Les abstractions ne devraient pas dépendre des détails ; les détails devraient dépendre des abstractions. » — Robert C. Martin

Les modules de **haut niveau** (la logique métier) ne doivent pas dépendre directement des modules de **bas niveau** (les détails techniques : base de données, API, fichiers…). Les deux doivent dépendre d'une **abstraction** commune (une interface).

Il faut distinguer deux notions liées :
* l'**inversion de dépendance** (DIP) est le *principe* : on programme contre une interface, pas contre une implémentation concrète ;
* l'**injection de dépendance** est une *technique* qui met en œuvre ce principe : on **passe** la dépendance depuis l'extérieur (souvent via le constructeur) au lieu de la créer soi-même avec `new`.

Le bénéfice majeur est la **testabilité** : on peut remplacer la vraie base de données par un *mock* sans rien changer à la logique métier.

### Mauvais exemple

`UserService` crée lui-même une `MySQLDatabase` : il est soudé à une implémentation précise.

```js
// Classe de bas niveau: gère les détails spécifiques de la sauvegarde en base de données MySQL
class MySQLDatabase {
    save(donnees) {
      console.log(`Sauvegarde des données dans MySQL: ${JSON.stringify(donnees)}`);
      return true;
    }
}

// Classe de haut niveau: service utilisateur qui dépend directement de MySQLDatabase
class UserService {
  constructor() {
    // Dépendance directe sur une implémentation concrète
    this.database = new MySQLDatabase();
  }
  
  registerUser(name, email) {
    const user = { name, email };
    
    // La logique métier est directement couplée à l'implémentation MySQL
    return this.database.save(user);
  }
}

function demonstrateBadApproach() {
  const service = new UserService();
  service.registerUser("Jean Dupont", "jean@exemple.fr");
  
  console.log("Pour changer de base de données, il faut modifier la classe ServiceUtilisateur.");
}

// Si nous voulons utiliser MongoDB, nous devons créer une nouvelle classe
class MongoDB {
  save(donnees) {
    console.log(`Sauvegarde des données dans MongoDB: ${JSON.stringify(donnees)}`);
    return true;
  }
}

// Et nous devrions créer une nouvelle version du service ou modifier l'existant
class UserServiceWithMongoDB {
  constructor() {
    // Nouvelle dépendance directe
    this.database = new MongoDB();
  }
  
  registerUser(name, email) {
    const user = { name, email };
    return this.database.save(user);
  }
}

demonstrateBadApproach();
```
Problèmes : 
1. Le ServiceUtilisateur dépend directement de l'implémentation concrète de MySQLDatabase.
2. Si nous voulons changer de base de données (par exemple, passer à MongoDB), nous devons modifier la classe ServiceUtilisateur.
3. Difficile à tester car nous ne pouvons pas facilement remplacer la dépendance par un mock ou une autre implémentation.
4. Le couplage fort limite la flexibilité et la réutilisabilité du code.

### Bon exemple (refactorisé)

On définit une abstraction `DatabaseInterface`, et `UserService` reçoit sa base de données par **injection de dépendance**. On peut alors brancher MySQL, MongoDB ou un mock sans modifier le service.

```js
// 1. Définir une abstraction (interface) pour la base de données
class DatabaseInterface {
  save(data) {
    throw new Error("Cette méthode doit être implémentée");
  }
}

// 2. Implémentations concrètes qui respectent l'interface
class MySQLDatabase extends DatabaseInterface {
  save(data) {
    console.log(`Sauvegarde des données dans MySQL: ${JSON.stringify(data)}`);
    return true;
  }
}

class MongoDB extends DatabaseInterface {
  save(data) {
    console.log(`Sauvegarde des données dans MongoDB: ${JSON.stringify(data)}`);
    return true;
  }
}

// 3. Service de haut niveau qui dépend de l'abstraction, pas de l'implémentation
class UserService {
  // Injection de dépendance: la base de données est passée en paramètre
  constructor(database) {
    if (!(database instanceof DatabaseInterface)) {
      throw new Error("La base de données doit implémenter l'interface DatabaseInterface");
    }
    this.database = database;
  }
  
  registerUser(name, email) {
    const user = { name, email };
    return this.database.save(user);
  }
}

function demonstrateGoodApproach() {
  // Utiliser MySQL
  const mysqlDB = new MySQLDatabase();
  const serviceMySQL = new UserService(mysqlDB);
  serviceMySQL.registerUser("Jean Dupont", "jean@exemple.fr");
  
  // Changer pour MongoDB sans modifier le service
  const mongoDB = new MongoDB();
  const serviceMongo = new UserService(mongoDB);
  serviceMongo.registerUser("Marie Martin", "marie@exemple.fr");
  
  // Facilité de test avec un mock
  class MockDatabase extends DatabaseInterface {
    constructor() {
      super();
      this.saved = [];
    }
    
    save(data) {
      console.log("Utilisation de la base de données mock pour les tests");
      this.saved.push(data);
      return true;
    }
  }
  
  const mockDB = new MockDatabase();
  const serviceTest = new UserService(mockDB);
  serviceTest.registerUser("Test Utilisateur", "test@exemple.fr");
  
  console.log("Données enregistrées dans le mock:", mockDB.saved);
}

demonstrateGoodApproach();
``` 
Avantages :
1. Le `UserService` ne dépend que de l'abstraction (`DatabaseInterface`), pas des détails d'implémentation.
2. On peut facilement changer l'implémentation de la base de données sans modifier le service.
3. Facilite les tests car on peut injecter des mocks ou des stubs.
4. Les modules sont faiblement couplés, ce qui améliore la flexibilité et la réutilisabilité.
5. Les composants de haut et de bas niveau dépendent tous deux de l'abstraction.

Pour aller plus loin : Factory pour créer des dépendances
```js
// Une factory pour créer des instances de base de données
class DataBaseFactory {
  static createDataBase(type) {
    switch (type) {
      case 'mysql':
        return new MySQLDatabase();
      case 'mongodb':
        return new MongoDB();
      default:
        throw new Error(`Type de base de données non supporté: ${type}`);
    }
  }
}

// Configuration par injection de dépendance
function configureApp(typeDB) {
  const database = DataBaseFactory.createDataBase(typeDB);
  const service = new UserService(database);
  
  return service;
}

function demonstrateFactoryPattern() {
  console.log("\nUtilisation d'une Factory pour l'inversion de dépendance:");
  
  // Configuration basée sur l'environnement ou les paramètres
  const serviceMySQL = configureApp('mysql');
  serviceMySQL.registerUser("Pierre Durand", "pierre@exemple.fr");
  
  const serviceMongo = configureApp('mongodb');
  serviceMongo.registerUser("Sophie Leroy", "sophie@exemple.fr");
}

demonstrateFactoryPattern();
```
Conclusion : 
1. Les modules de haut niveau (logique métier) et de bas niveau (détails techniques) devraient dépendre d'abstractions (interfaces).
2. L'inversion de dépendance est facilitée par l'injection de dépendance.
3. Ce principe améliore la testabilité, la maintenabilité et la flexibilité du code.
4. En JavaScript, où les interfaces ne sont pas natives, on simule ce comportement avec des classes abstraites et des conventions.
5. Les patterns comme Factory et Service Locator peuvent aider à gérer les dépendances.

L'inversion de dépendance est un principe fondamental pour construire des systèmes modulaires et évolutifs avec des composants faiblement couplés.

## Relations entre les principes

Les cinq principes ne sont pas isolés : ils se renforcent mutuellement.

- **SRP** est la base : des composants bien découpés facilitent tous les autres principes.
- **OCP** s'appuie sur le polymorphisme (héritage / interfaces) pour éviter de modifier l'existant.
- **LSP** est la condition pour que ce polymorphisme soit fiable : une sous-classe qui casse le contrat casse aussi l'extension prévue par OCP.
- **ISP** applique l'idée de SRP aux interfaces : des contrats fins évitent les dépendances inutiles.
- **DIP** relie le tout : en dépendant d'abstractions, les modules restent découplés et interchangeables.

Le fil conducteur commun : **réduire le couplage** et **dépendre d'abstractions stables** plutôt que de détails concrets.

## Résumé

| Principe | Ce qu'il évite | Outil / technique clé |
| --- | --- | --- |
| **S**ingle Responsibility | Les classes « fourre-tout » | Découpage par responsabilité |
| **O**pen/Closed | Les `if/else` / `switch` qui gonflent | Polymorphisme, pattern Strategy |
| **L**iskov Substitution | Les sous-classes qui trahissent le contrat | Hiérarchies fondées sur le comportement |
| **I**nterface Segregation | Les interfaces obèses | Interfaces fines + composition |
| **D**ependency Inversion | Le couplage à une implémentation | Abstractions + injection de dépendance |

**À retenir :**

- SOLID est un ensemble de **lignes directrices**, pas de règles absolues : le but est un code souple et testable, pas d'ajouter de la complexité inutile.
- Le point commun des cinq principes est de **maîtriser les dépendances** : peu de couplage, beaucoup de cohésion.
- Attention à la sur-ingénierie : n'introduis une abstraction que lorsqu'un besoin réel de variation ou de test le justifie (principe YAGNI — *You Aren't Gonna Need It*).
- Ces principes se combinent naturellement avec les autres bonnes pratiques du clean code : DRY, nommage explicite, tests unitaires et *design patterns*.