class MultifunctionDevice {
  constructor() {
    if (this.constructor === MultifunctionDevice) {
      throw new Error("Cette classe est abstraite et ne peut pas être instanciée directement");
    }
  }

  print(document) {
    throw new Error("La méthode imprimer doit être implémentée");
  }

  scan(document) {
    throw new Error("La méthode scan doit être implémentée");
  }

  photocopy(document) {
    throw new Error("La méthode photocopy doit être implémentée");
  }

  sendFax(document) {
    throw new Error("La méthode sendFax doit être implémentée");
  }
}

// Une imprimante simple n'a pas besoin de scanner, photocopier ou envoyer des fax
class SimplePrinter extends MultifunctionDevice {
  print(document) {
    console.log(`Impression du document: ${document}`);
    return true;
  }

  // Obligé d'implémenter ces méthodes même si elles ne sont pas utilisées
  scan(document) {
    throw new Error("Cette imprimante ne peut pas scanner");
  }

  photocopy(document) {
    throw new Error("Cette imprimante ne peut pas photocopier");
  }

  sendFax(document) {
    throw new Error("Cette imprimante ne peut pas envoyer de fax");
  }
}

// Un scanner simple n'a pas besoin d'imprimer, photocopier ou envoyer des fax
class SimpleScanner extends MultifunctionDevice {
  scan(document) {
    console.log(`Numérisation du document: ${document}`);
    return `${document}_scanned`;
  }

  // Obligé d'implémenter ces méthodes même si elles ne sont pas utilisées
  print(document) {
    throw new Error("Ce scanner ne peut pas imprimer");
  }

  photocopy(document) {
    throw new Error("Ce scanner ne peut pas photocopier");
  }

  sendFax(document) {
    throw new Error("Ce scanner ne peut pas envoyer de fax");
  }
}

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
}

demonstrateBadApproach();

