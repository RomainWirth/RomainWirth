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
  
/**
 * PROBLÈMES AVEC CET EXEMPLE:
 * 
 * 1. La classe User a au moins 3 responsabilités différentes:
 *    - Gérer les données de l'utilisateur
 *    - Gérer la persistance en base de données
 *    - Gérer l'envoi d'emails
 * 
 * 2. Si la méthode d'envoi d'emails change, nous devons modifier cette classe.
 * 3. Si la méthode de persistance change, nous devons également modifier cette classe.
 * 4. Difficile à tester car les responsabilités sont mélangées.
 */

// exemple :
console.log("==== Exemple qui ne respecte pas le principe ====");
const mauvaisUtilisateur = new User("Pierre Martin", "pierre.martin@exemple.fr");
mauvaisUtilisateur.validateEmail();
mauvaisUtilisateur.saveToDatabase();
mauvaisUtilisateur.sendEmail("Test", "Contenu du message");