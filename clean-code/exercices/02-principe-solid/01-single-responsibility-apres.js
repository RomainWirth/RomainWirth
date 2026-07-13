// Responsabilité: Gérer les données de l'utilisateur
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getCompleteName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }
}

// Responsabilité: Valider les données
class EmailValidator {
  static validate(email) {
    return email.includes('@') && email.includes('.');
  }
}

// Responsabilité: Gérer la persistance des utilisateurs
class UserRepository {
  save(user) {
    console.log(`Sauvegarde de l'utilisateur ${user.getCompleteName()} dans la base de données`);
    // Code de sauvegarde en base de données
  }

  load(id) {
    // Code pour charger un utilisateur depuis la base de données
    console.log(`Chargement de l'utilisateur avec l'ID ${id}`);
    return new User("Utilisateur chargé", "exemple@email.com");
  }
}

// Responsabilité: Gérer l'envoi d'emails
class EmailService {
  send(recipient, subject, content) {
    console.log(`Envoi d'un email à ${recipient} avec le sujet: ${subject}`);
    // Code d'envoi d'email
  }
}

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
      `Bonjour ${utilisateur.getCompleteName()}, bienvenue sur notre plateforme !`
    );
  }
}

/**
* AVANTAGES DE CETTE APPROCHE:
* 
* 1. Chaque classe a une seule responsabilité bien définie
* 2. Les changements dans une responsabilité n'affectent qu'une seule classe
* 3. Plus facile à tester car chaque composant peut être testé isolément
* 4. Plus facile à maintenir et à étendre
* 5. Meilleure réutilisation du code
* 
* Si nous devons changer la façon dont les emails sont envoyés, nous ne modifions que EmailService.
* Si nous devons changer la méthode de persistance, nous ne modifions que UserRepository.
*/

console.log("\n==== Exemple qui respecte le principe ====");
demonstrateUser();
