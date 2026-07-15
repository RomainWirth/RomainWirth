// Correction

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

// Pour aller plus loin : Factory pour créer des dépendances
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