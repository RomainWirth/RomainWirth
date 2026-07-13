// Identifier les problèmes dans le code ci-dessous et proposer une solution pour respecter le principe de responsabilité unique (Single Responsibility Principle) du SOLID.
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

  // Cette méthode gère la validation de l'email (responsabilité 1)
  validateEmail() {
    return this.email.includes('@') && this.email.includes('.');
  }

  // Cette méthode gère la persistance des données (responsabilité 2)
  saveToDatabase() {
    console.log(`Sauvegarde de l'utilisateur ${this.name} dans la base de données`);
    // Code de sauvegarde en base de données
  }

  // Cette méthode gère l'envoi d'emails (responsabilité 3)
  sendEmail(subject, content) {
    console.log(`Envoi d'un email à ${this.email} avec le sujet: ${subject}`);
    // Code d'envoi d'email
  }
}

const badUser = new User("Pierre Martin", "pierre.martin@exemple.fr");
badUser.validateEmail();
badUser.saveToDatabase();
badUser.sendEmail("Test", "Contenu du message");