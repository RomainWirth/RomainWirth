// Identifier les problèmes dans le code ci-dessous et proposer une solution pour respecter le principe de l'inversion de dépendance du SOLID.

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