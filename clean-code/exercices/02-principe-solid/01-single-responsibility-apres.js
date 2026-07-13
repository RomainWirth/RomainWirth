// Correction - Responsabilité: Gérer les données de l'utilisateur
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

demonstrateUser();
