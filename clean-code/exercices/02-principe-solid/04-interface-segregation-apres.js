// Correction

// Interface pour l'impression
class Imprimable {
  constructor() {
    if (this.constructor === Imprimable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  }

  imprimer(document) {
    throw new Error("La méthode imprimer doit être implémentée");
  }
}

// Interface pour la numérisation
class Scannable {
  constructor() {
    if (this.constructor === Scannable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  }

  scanner(document) {
    throw new Error("La méthode scanner doit être implémentée");
  }
}

// Interface pour l'envoi de fax
class FaxEnvoyable {
  constructor() {
    if (this.constructor === FaxEnvoyable) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  }

  envoyerFax(document) {
    throw new Error("La méthode envoyerFax doit être implémentée");
  }
}

// Implémentation d'une imprimante simple
class ImprimanteRefactoree extends Imprimable {
  imprimer(document) {
    console.log(`Impression du document: ${document}`);
    return true;
  }
}

// Implémentation d'un scanner simple
class ScannerRefactore extends Scannable {
  scanner(document) {
    console.log(`Numérisation du document: ${document}`);
    return `${document}_scanned`;
  }
}

// Implémentation d'un télécopieur simple
class TelecopieurRefactore extends FaxEnvoyable {
  envoyerFax(document) {
    console.log(`Envoi du document par fax: ${document}`);
    return true;
  }
}

// Un appareil multifonction qui implémente plusieurs interfaces
class AppareilMultifonctionRefactore extends Imprimable {
  constructor() {
    super();
    this._scanner = new ScannerRefactore();
    this._fax = new TelecopieurRefactore();
  }

  imprimer(document) {
    console.log(`Impression du document par l'appareil multifonction: ${document}`);
    return true;
  }

  scanner(document) {
    return this._scanner.scanner(document);
  }

  envoyerFax(document) {
    return this._fax.envoyerFax(document);
  }
  
  photocopier(document) {
    const documentScanne = this.scanner(document);
    this.imprimer(documentScanne);
    console.log(`Photocopie du document: ${document}`);
    return true;
  }
}

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
}

demonstrateGoodApproach();