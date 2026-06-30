const MAX_LOGIN_ATTEMPTS = 3;
const ACCOUNT_LOCK_DURATION_MINUTES = 15;

class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
    this.loginAttempts = 0;
    this.isLocked = false;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  verifyCredentials(email, password) {
    if (this.isLocked) {
      console.log('Compte verrouille, reessayez plus tard.');
      return false;
    }

    const isValid = this.email === email && this.password === password;

    if (!isValid) {
      this.loginAttempts += 1;
      if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        this.lockTemporarily();
      }
      return false;
    }

    this.loginAttempts = 0;
    return true;
  }

  lockTemporarily() {
    this.isLocked = true;

    setTimeout(() => {
      this.isLocked = false;
      this.loginAttempts = 0;
    }, ACCOUNT_LOCK_DURATION_MINUTES * 60 * 1000);
  }
}

class UserManager {
  constructor() {
    this.users = new Map();
  }

  createUser(firstName, lastName, email, password) {
    if (this.users.has(email)) {
      throw new Error('Un utilisateur avec cet email existe deja.');
    }

    const user = new User(firstName, lastName, email, password);
    this.users.set(email, user);
    return user;
  }

  authenticate(email, password) {
    const user = this.users.get(email);
    if (!user) {
      return false;
    }

    return user.verifyCredentials(email, password);
  }
}

const manager = new UserManager();
const jean = manager.createUser('Jean', 'Dupont', 'jean.dupont@exemple.fr', 'MotDePasse123');
console.log(`Utilisateur cree: ${jean.getFullName()}`);
console.log(`Connexion: ${manager.authenticate('jean.dupont@exemple.fr', 'MotDePasse123')}`);
