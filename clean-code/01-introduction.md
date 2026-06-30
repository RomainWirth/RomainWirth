# LE CLEAN CODE

## Pourquoi est-ce important ?

Qu'est ce que du code illisible ? il s'agit de code mal écrit, pas maintenable, et si on souhaite faire évoluer ce code, ce sera très compliqué. Il vaudrait mieux repartir du départ plutôt que d'essayer d'améliorer.

À contrario, on a le clean code : une installation bien orchestrée, bien écrite, dans laquelle on a une vue claire, qui est facile à lire. Du code propre.

L'objectif d'écrire du clean code est de se simplifier la vie. Pas dans l'instant, car cela demande plus de travail, mais plutôt pour l'avenir. Cela permet d'avoir des applications évolutives et maintenables. C'est bien plus motivant de retourner lire son code plus tard lorsque le code est bien écrit.

On m'a toujours dit : "Imagine que la personne qui va lire ton code est un tueur en série et qu'il sait ou tu habites. Ecris du code pour qu'il évite de venir te le faire payer."

Très souvent, cette personne, c'est soi-même.
Parfois, par manque de temps, ou par manque de budget, on est ammené à écrire du code "quick and dirty", mais dans la mesure du possible (90% du temps), il est préférable de faire attention à sa manière d'écrire son code.

## Les conventions de nommage

Il s'agit de la manière dont on va écrire le code : nom de variables, nom de classes, des méthodes, des interfaces, des objets, etc.
Les conventions de nommages permettent d'unifier l'écriture du code au sein d'une entreprise, d'une équipe, d'un projet. 
Au sein d'une entreprise, si une convention est existante, qu'elle ait été décidée officiellement ou non, il faut s'y plier. 
Lorsqu'on doit choisir une convention de nommage, on fera selon sa préférence, mais il faut noter que le choix d'une convention de nommage va dépendre principalement du langage de programmation qu'on utilise.
Quoi qu'il en soit, une fois la convention choisie, il est primordial de s'y tenir pour l'intégralité du code afin de donner de la cohérence au projet et le rendre le code plus lisible.
Il existe plusieurs conventions de nommage, mais 4 sont principalement utilisées et sont les plus courantes.

### le `camelCase`

Le camel case consiste à lier les mots sans tirets ni underscore, en commençant par une lettre minuscule, et les mots suivants par une majuscule :
* ma variable => maVariable
* ma fonction => maFonction
* mon super objet => monSuperObjet

Cette convention de nommage rend l'écriture lisible et cela rend plus simple de s'y retrouver.
Javascript est un des langages les plus populaires ou cette convention de nommage est largement utilisée. On le retrouve également en Go.  

### Le `PascalCase`

Le pascal case constite, comme le camel case, à lier les mots sans tirets ni underscore, mais en commençant la première lettre de chaque mot par une majuscule : 
* ma variable => MaVariable
* ma fonction => MaFonction
* mon super objet => MonSujetObjet

Le PascalCase est la convention qui est principalement utilisée en C#. On le retrouve également en Go pour les fonctions que l'on expose globalement. 

### Le `snake_case`

Le snake case utilise l'undescore pour séparer les mots, qui sont écrits en minuscule : 
* ma variable => ma_variable
* ma fonction => ma_fonction
* mon super objet => mon_super_objet

Le Python ou le Ruby privilégient le snake_case.

On utilisera aussi le snake case pour les constantes globales, on écrira en majuscule toutes les lettres : ma constante => MA_CONSTANTE

### le `kebab-case`

Le Kebab case est le même principe que le snake case, mais on utilise le tiret au lieu du underscore : 
* ma variable => ma-variable
* ma fonction => ma-fonction
* mon super objet => mon-super-objet

On utilise beaucoup cette convention pour les URL, c'est ce qu'il y a de mieux par rapport au référencement des sites internets. Cela permet plus facilement aux moteurs de recherche et aux robots de parser les URLs et de les comprendre. 
C'est également utilisé pour les noms de fichiers, parce que contrairement au underscore qui est considéré comme une lettre, le tiret est vraiment considéré comme un séparateur. 

## La règle du Boys Scout

La règle du Boys Scout est un des grands principes du développement logiciel. Il s'agit d'encourager les développeurs à laisser le code dans un meilleur état qu'il ne l'ont trouvé. 

Pourquoi ce nom ? C'est parce que cette règle est inspirée de la devise des scouts : "toujours laisser le camp plus propre qu'on ne l'a trouvé".

Les points clé de cette règle sont : 
* amélioration continue
* responsabilité collective
* réduction de la dette technique

Cette règle est principalement utile en entreprise et sur les gros projets, notamment ceux avec une base de code existante. C'est une règle très utile qu'il faut appliquer tout le temps dans la mesure du possible. 

Sur de gros projets existants, avec beaucoup de dossiers, de fichiers, des centaines, des milliers de lignes de code, ou on va devoir implémenter des features, refactoriser le code, corriger un bug, réaliser des tâches, on va essayer de le laisser plus propre que ce qu'on a pu avoir au départ, à l'ouverture du fichier. 

exemple avec du code déjà écrit ou notre objectif est d'ajouter une fonction pour supprimer une des tâches : 
```JS
var data = [];

// fonction pour ajouter des tâches
function add(t, p) {
    // On vérifie si le titre est défini
    if (!t) {
        console.log('Erreur: titre non défini');
        return false;
    }

    var prio = p || 'normale';

    data.push({
        titre: t, 
        priorite: p, 
        fini: false, 
        date_creation: new Date()
    });
}

// fonction pour obtenir une tâhce comme terminée
function getAll() {
    return data;
}

// fonction pour marquer une tâche comme terminée 
function marquerFini(i) {
    if (i >= 0 && i < data.length) {
        data[i].fini = true;
        return true;
    } else {
        console.log("Index invalide");
        return false;
    }
}

function afficher() {
    if (data.lentgh === 0) {
        console.log("Aucune tâche");
    } else {
        for (var i = 0; i < data.length; i++) {
            var t = data[i];
            var status = t.fini ? '[x]' : '[ ]';
            console.log(i + '. ' + status + ' ' + t.titre + ' (Priorité: )' + t.priorite);
        }
    }
}

// Exemple d'utilisation
add('Faire les courses', 'haute');
add('Appeler le plombier');
afficher();
marquerFini(0);
afficher();
```
Le code ci dessus pourrait être amélioré significativement. 
AMÉLIORATIONS POSSIBLES:
1. Variables avec des noms peu explicites 
3. Utilisation de 'var' au lieu de 'let' ou 'const'
4. Manque de validation des données d'entrée
5. Duplication de code dans l'affichage
6. Pas de gestion des erreurs cohérente (parfois on retourne false, parfois on log)
7. Commentaires inutiles qui ne fournissent pas d'informations supplémentaires
8. Fonction 'add' fait deux choses: validation et ajout
9. Code non modulaire (tout est dans le scope global)
10. Toujours écrire en anglais pour la cohérence

```JS
let data = [];

function validateTaskInput(title, priority) {
    if (!title) {
        console.log('Erreur: titre non défini');
        return false;
    }
    if (!priority) {
        console.log('Erreur: priorité non définie');
        return false;
    }
    return true;
}

function addTask(title, priority) {
    if (!validateTaskInput(title, priority)) {
        return false;
    }
    
    let prio = priority || 'normale';
    
    data.push({
        title: title, 
        priority: prio, 
        done: false, 
        created_date: new Date()
    });
    
    return true;
}

function getAllTasks() {
  return data;
}

function markTaskAsDone(i) {
  if (i >= 0 && i < data.length) {
    data[i].done = true;
    return true;
  } else {
    console.log('Index invalide');
    return false;
  }
}

function displayTasks() {
  if (data.length === 0) {
    console.log('Aucune tâche');
  } else {
    for (let i = 0; i < data.length; i++) {
        let t = data[i];
        let status = t.done ? '[X]' : '[ ]';
      console.log(i + '. ' + status + ' ' + t.title + ' (Priorité: ' + t.priority + ')');
    }
  }
}

function deleteTask(index) {
  if (index >= 0 && index < data.length) {
    data.splice(index, 1);
    return true;
  } else {
    console.log('Index invalide');
    return false;
  }
}

// Exemple d'utilisation
addTask('Faire les courses', 'haute');
addTask('Appeler le plombier');
marquerFini(0);
afficher();
```

Attention, lorsqu'on refactorise des fonctions, et particulièrement leurs noms, il faut faire attention à corriger également à l'endroit ou est appelé la fonction ou la variable.

## Améliorer la lisibilité du code d'un programme

exemple de code illisible : 
```js
// Version non lisible du code de gestion d'utilisateurs
var max = 3;
var tmps = 15;

// Classe utilisateur avec noms de variables peu explicites
function U(p, n, e, m) {
  this.p = p;
  this.n = n;
  this.e = e;
  this.m = m;
  this.d = new Date();
  this.t = 0;
  this.v = false;
  
  // Méthode sans documentation
  this.nc = function() { return this.p + " " + this.n; }
  
  // Logique complexe sans structure claire
  this.check = function(em, mdp) {
    if(this.v) { console.log("Locked"); return false; }
    var ok = this.e == em && this.m == mdp;
    if(!ok) { 
      this.t++; 
      if(this.t >= max) {
        this.v = true;
        var self = this;
        setTimeout(function() {
          self.v = false;
          self.t = 0;
        }, tmps * 60 * 1000);
      }
    } else { this.t = 0; }
    return ok;
  }
}

// Gestionnaire avec variables globales et logique mélangée
var users = [];
var addUser = function(a,b,c,d) {
  for(var i=0; i<users.length; i++) {
    if(users[i].e === c) throw "Exists";
  }
  var u = new U(a,b,c,d);
  users.push(u);
  return u;
}

var find = function(x) {
  for(var i=0; i<users.length; i++) {
    if(users[i].e === x) return users[i];
  }
  return null;
}

var auth = function(x, y) {
  var u = find(x);
  return u ? u.check(x, y) : false;
}

// Code de test sans structure claire
try {
  var u1 = addUser("Jean","Dupont","jean.dupont@exemple.fr","MotDePasse123");
  console.log("Created: " + u1.nc());
  
  // Code dupliqué et non optimisé
  if(auth("jean.dupont@exemple.fr", "MotDePasse123")) {
    console.log("OK!");
  } else { console.log("FAIL"); }
  
  // Test d'authentification avec mauvais mot de passe
  if(auth("jean.dupont@exemple.fr", "MotDePasse123")) {
    console.log("OK!");
  } else { console.log("FAIL"); }
} catch(e) {
  console.log("ERR: " + e);
}

// Variables globales inutilisées
var debug = true;
var version = "1.0";
var flag = false;
var tmp, x, y, z;

// Fonction non utilisée
function extraFunction() {
  return Math.random() > 0.5;
}

// Code mort
if(extraFunction()) {
  // Cette condition ne sera jamais exécutée
  console.log("This should never happen");
}
```

exemple de code lisible :
```js
/**
 * Module de gestion des utilisateurs
 * Ce module permet de créer, récupérer et authentifier des 
 * utilisateurs
 */

// Configuration constante avec des noms explicites
const LIMITE_TENTATIVES_CONNEXION = 3;
const DUREE_VERROUILLAGE_COMPTE = 15; // en minutes

/**
 * Représente un utilisateur dans le système
 */
class Utilisateur {
  constructor(prenom, nom, email, motDePasse) {
    this.prenom = prenom;
    this.nom = nom;
    this.email = email;
    this.motDePasse = motDePasse;
    this.dateCreation = new Date();
    this.tentativesConnexion = 0;
    this.estVerrouille = false;
  }

  /**
   * Retourne le nom complet de l'utilisateur
   * @returns {string} Le nom complet formaté
   */
  obtenirNomComplet() {
    return `${this.prenom} ${this.nom}`;
  }

  /**
   * Vérifie si les identifiants fournis correspondent à ceux de l'utilisateur
   * @param {string} email - Email fourni
   * @param {string} motDePasse - Mot de passe fourni
   * @returns {boolean} Vrai si les identifiants sont valides
   */
  verifierIdentifiants(email, motDePasse) {
    if (this.estVerrouille) {
      console.log("Compte verrouillé. Veuillez réessayer plus tard.");
      return false;
    }

    const identifiantsValides = this.email === email && this.motDePasse === motDePasse;
    
    if (!identifiantsValides) {
      this.gererEchecConnexion();
    } else {
      this.reinitialiserTentatives();
    }

    return identifiantsValides;
  }

  /**
   * Gère l'échec de connexion en incrémentant le compteur et en verrouillant si nécessaire
   */
  gererEchecConnexion() {
    this.tentativesConnexion += 1;
    
    if (this.tentativesConnexion >= LIMITE_TENTATIVES_CONNEXION) {
      this.verrouillerCompte();
    }
  }

  /**
   * Verrouille temporairement le compte utilisateur
   */
  verrouillerCompte() {
    this.estVerrouille = true;
    
    // Déverrouillage automatique après la durée spécifiée
    setTimeout(() => {
      this.estVerrouille = false;
      this.tentativesConnexion = 0;
    }, DUREE_VERROUILLAGE_COMPTE * 60 * 1000);
  }

  /**
   * Réinitialise le compteur de tentatives après une connexion réussie
   */
  reinitialiserTentatives() {
    this.tentativesConnexion = 0;
  }
}

/**
 * Gère une base d'utilisateurs avec des opérations CRUD
 */
class GestionnaireUtilisateurs {
  constructor() {
    this.utilisateurs = new Map();
  }

  /**
   * Crée un nouvel utilisateur
   * @param {string} prenom - Prénom de l'utilisateur
   * @param {string} nom - Nom de l'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} motDePasse - Mot de passe de l'utilisateur
   * @returns {Utilisateur} Le nouvel utilisateur créé
   */
  creerUtilisateur(prenom, nom, email, motDePasse) {
    if (this.utilisateurs.has(email)) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    const nouvelUtilisateur = new Utilisateur(prenom, nom, email, motDePasse);
    this.utilisateurs.set(email, nouvelUtilisateur);
    
    return nouvelUtilisateur;
  }

  /**
   * Récupère un utilisateur par son email
   * @param {string} email - Email de l'utilisateur à trouver
   * @returns {Utilisateur|null} L'utilisateur trouvé ou null
   */
  trouverParEmail(email) {
    return this.utilisateurs.get(email) || null;
  }

  /**
   * Authentifie un utilisateur avec ses identifiants
   * @param {string} email - Email de l'utilisateur
   * @param {string} motDePasse - Mot de passe fourni
   * @returns {boolean} Vrai si l'authentification a réussi
   */
  authentifier(email, motDePasse) {
    const utilisateur = this.trouverParEmail(email);
    
    if (!utilisateur) {
      return false;
    }
    
    return utilisateur.verifierIdentifiants(email, motDePasse);
  }
}

// Exemple d'utilisation
function demoGestionUtilisateurs() {
  const gestionnaire = new GestionnaireUtilisateurs();
  
  try {
    // Création d'un utilisateur
    const jean = gestionnaire.creerUtilisateur(
      "Jean", 
      "Dupont", 
      "jean.dupont@exemple.fr", 
      "MotDePasse123"
    );
    
    console.log(`Utilisateur créé: ${jean.obtenirNomComplet()}`);
    
    // Tentative d'authentification
    const estAuthentifie = gestionnaire.authentifier(
      "jean.dupont@exemple.fr", 
      "MotDePasse123"
    );
    
    if (estAuthentifie) {
      console.log("Authentification réussie!");
    } else {
      console.log("Échec de l'authentification");
    }
  } catch (erreur) {
    console.error(`Erreur: ${erreur.message}`);
  }
}

// Point d'entrée de démonstration
demoGestionUtilisateurs();
```

L'objectif d'avoir du code lisible est de limiter les erreurs, les bugs. On sera alors plus agile pour faire de la maintenance ou des modifications.

## Le principe DRY

DRY signifie "Don't Repeat Yourself", c'est à dire ne jamais se répéter. 
En d'autres termes, si plusieurs lignes de code identiques ou similaires sont répétées à plusieurs endroits différents, on en fera une fonction. Il s'agit de factorisation du code, qui doit être réutilisable et maintenable.
Cela permet de centraliser le code, et dans le cas ou on aurait besoin de modifier le code, plutôt que de modifier la même chose à plusieurs endroits différents, alors on aura à le modifier à un seul et unique endroit : constante ou variable globale, fonction, classe, etc. 

```js
// Exemple avec duplication de code
function calculerPrixTTC_Mauvais(produits) {
    let total = 0;
    
    for (let produit of produits) {
        if (produit.categorie === 'alimentaire') {
            total += produit.prix * 1.055; // TVA 5.5%
        } else if (produit.categorie === 'livres') {
            total += produit.prix * 1.055; // TVA 5.5%
        } else if (produit.categorie === 'standard') {
            total += produit.prix * 1.20; // TVA 20%
        }
    }
    
    return total;
}

// Fonction qui respecte le principe DRY
function calculerPrixTTC_Bon(produits) {
    const TAUX_TVA = {
        'alimentaire': 1.055,
        'livres': 1.055,
        'standard': 1.20,
        'autre': 1.10
    };

    let total = 0;

    for (let produit of produits) {
        const taux = TAUX_TVA[produit.categorie] || TAUX_TVA['autre'];
        total += produit.prix * taux;
    }

    return total;
}
```
EXEMPLE 2: Violation du principe DRY - Duplication de structures
```js
// Code avec duplication
class UtilisateurPremium {
    constructor(nom, email, dateInscription) {
        this.nom = nom;
        this.email = email;
        this.dateInscription = dateInscription;
        this.estPremium = true;
    }
    
    afficherInfos() {
        console.log(`Utilisateur premium: ${this.nom}, ${this.email}, inscrit le ${this.dateInscription}`);
    }
}

class UtilisateurStandard {
    constructor(nom, email, dateInscription) {
        this.nom = nom;
        this.email = email;
        this.dateInscription = dateInscription;
        this.estPremium = false;
    }
    
    afficherInfos() {
        console.log(`Utilisateur standard: ${this.nom}, ${this.email}, inscrit le ${this.dateInscription}`);
    }
}

// Application du principe DRY
class Utilisateur {
    constructor(nom, email, dateInscription, estPremium = false) {
        this.nom = nom;
        this.email = email;
        this.dateInscription = dateInscription;
        this.estPremium = estPremium;
    }
    
    afficherInfos() {
        const type = this.estPremium ? 'premium' : 'standard';
        console.log(`Utilisateur ${type}: ${this.nom}, ${this.email}, inscrit le ${this.dateInscription}`);
    }
}

// Utilisation
const utilisateurStandard = new Utilisateur('Alice', 'alice@example.com', '2023-01-01');
const utilisateurPremium = new Utilisateur('Bob', 'bob@example.com', '2023-02-15', true);
```

EXEMPLE 3: Extraction de code dupliqué en fonctions
```JS
// Code avec duplication
function envoyerEmailBienvenue_Mauvais(utilisateur) {
    const sujet = 'Bienvenue sur notre plateforme';
    const corps = `Bonjour ${utilisateur.nom},\n\nMerci de vous être inscrit!`;
    
    // Configuration du serveur SMTP
    const config = {
        host: 'smtp.example.com',
        port: 587,
        secure: true,
        auth: {
            user: 'notifications@example.com',
            pass: 'motdepasse123'
        }
    };
    
    // Envoi de l'email
    console.log(`Email envoyé à ${utilisateur.email} avec le sujet "${sujet}"`);
}

function envoyerEmailConfirmation_Mauvais(commande, utilisateur) {
    const sujet = 'Confirmation de votre commande';
    const corps = `Bonjour ${utilisateur.nom},\n\nVotre commande #${commande.id} a été confirmée!`;
    
    // Configuration du serveur SMTP (dupliquée)
    const config = {
        host: 'smtp.example.com',
        port: 587,
        secure: true,
        auth: {
            user: 'notifications@example.com',
            pass: 'motdepasse123'
        }
    };
    
    // Envoi de l'email (logique dupliquée)
    console.log(`Email envoyé à ${utilisateur.email} avec le sujet "${sujet}"`);
}

// Application du principe DRY
const EMAIL_CONFIG = {
    host: 'smtp.example.com',
    port: 587,
    secure: true,
    auth: {
        user: 'notifications@example.com',
        pass: 'motdepasse123'
    }
};

function envoyerEmail(destinataire, sujet, corps) {
    // Utilisation de la configuration centralisée
    // Logique d'envoi centralisée
    console.log(`Email envoyé à ${destinataire} avec le sujet "${sujet}"`);
}

function envoyerEmailBienvenue_Bon(utilisateur) {
    const sujet = 'Bienvenue sur notre plateforme';
    const corps = `Bonjour ${utilisateur.nom},\n\nMerci de vous être inscrit!`;
    
    envoyerEmail(utilisateur.email, sujet, corps);
}

function envoyerEmailConfirmation_Bon(commande, utilisateur) {
    const sujet = 'Confirmation de votre commande';
    const corps = `Bonjour ${utilisateur.nom},\n\nVotre commande #${commande.id} a été confirmée!`;
    
    envoyerEmail(utilisateur.email, sujet, corps);
}
```

## Bien gérer les erreurs pour un code robuste

La gestion des erreurs est essentiel lorsqu'on parle de clean code. 
Un code qui ne plante pas est un code qui gère efficacement les erreurs, on parle de code défensif.

Gérer les erreurs, cela signifie empêcher le programme de planter. 
L'erreur doit être affichée et clairement définie. 
Il faut également contrôler ce que fait l'utilisateur pour ne pas lui laisser la possibilité de faire planter le programme. 

Par exemple, dans un input, on demande à l'utilisateur de rentrer son âge, il ne faut en aucun cas lui laisser la possibilité d'entrer autre chose qu'un chiffre ou un nombre puisqu'un âge est un nombre. 

Une des bonnes pratiques est de créer des classes d'erreur personalisées que l'on va hérarchiser, c'est à dire des classes qui vont définir les différentes erreurs de l'application qui vont `extends` Error : `ApplicationError`, `ValidationError`, `DatabaseError`, etc. 
Cela va permettre d'être précis lorsqu'on renvoit une erreur, afin de pouvoir corriger le problème si c'est nécessaire.

Une classe d'erreur n'a pas besoin de beaucoup de choses. Un simple constructeur contenant le message d'erreur avec une capture de l'erreur est suffisant.

On peut également personnaliser nos fonctions d'erreur : `logError` qui va renvoyer en javascript l'erreur dans la console en faisant appel à un `console.error` par exemple. 

Lors de l'exécution d'une fonction, on pourra faire appel à ces erreurs pour signaler un problème. 
Il existe également des syntaxe spécifiques comme le `try ... catch`, dans le contexte d'une fonction asynchrone en JavaScript qui procède à un appel API, qui permettent d'éviter au code de planter avec une erreur serveur.

Une bonne gestion des erreurs, avec des erreurs contruites avec précision, permet de faire gagner beaucoup de temps lors de débuggage.

```js
// Classes d'erreurs personnalisées
class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends ApplicationError {
  constructor(message, field) {
    super(message);
    this.field = field;
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, query) {
    super(message);
    this.query = query;
  }
}

// Fonction de validation
function validateUser(user) {
  if (!user) {
    throw new ValidationError("L'utilisateur est requis", "user");
  }
  
  if (!user.name) {
    throw new ValidationError("Le nom d'utilisateur est requis", "name");
  }
  
  if (typeof user.age !== 'number' || user.age <= 0) {
    throw new ValidationError("L'âge doit être un nombre positif", "age");
  }
  
  if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    throw new ValidationError("Email invalide", "email");
  }
}

// Fonction simulant une opération de base de données
function saveUserToDatabase(user) {
  // Simulation d'une erreur de base de données (1 chance sur 3)
  if (Math.random() < 0.3) {
    throw new DatabaseError("Impossible de se connecter à la base de données", "INSERT INTO users");
  }
  
  console.log(`Utilisateur ${user.name} enregistré avec succès`);
  return { id: Math.floor(Math.random() * 1000), ...user };
}

// Fonction principale avec gestion des erreurs
async function registerUser(userData) {
  try {
    console.log("Début de l'enregistrement de l'utilisateur...");
    
    // Validation des données
    validateUser(userData);
    
    // Traitement des données
    const normalizedUser = {
      ...userData,
      name: userData.name.trim(),
      email: userData.email.toLowerCase()
    };
    
    // Sauvegarde en base de données
    const savedUser = await Promise.resolve(saveUserToDatabase(normalizedUser));
    
    console.log("Utilisateur enregistré avec succès");
    return {
      success: true,
      user: savedUser
    };
  } catch (error) {
    // Gestion différenciée selon le type d'erreur
    if (error instanceof ValidationError) {
      console.error(`Erreur de validation: ${error.message} (champ: ${error.field})`);
      return {
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: error.message,
          field: error.field
        }
      };
    } else if (error instanceof DatabaseError) {
      console.error(`Erreur de base de données: ${error.message}`);
      // Journalisation de l'erreur pour les administrateurs
      logError(error);
      return {
        success: false,
        error: {
          type: 'SYSTEM_ERROR',
          message: "Une erreur système est survenue, veuillez réessayer plus tard"
        }
      };
    } else {
      console.error("Erreur inattendue:", error);
      // Journalisation de l'erreur pour les administrateurs
      logError(error);
      return {
        success: false,
        error: {
          type: 'UNKNOWN_ERROR',
          message: "Une erreur inattendue s'est produite"
        }
      };
    }
  }
}

// Fonction de journalisation des erreurs
function logError(error) {
  // En production, on utiliserait un service de journalisation
  console.error(`[${new Date().toISOString()}] ERROR:`, {
    name: error.name,
    message: error.message,
    stack: error.stack,
    additionalInfo: error.query || error.field || null
  });
}

// Exemple d'utilisation
const testCases = [
  { name: "Alice", age: 30, email: "alice@example.com" },  // Données valides
  { name: "", age: 25, email: "bob@example.com" },         // Nom manquant
  { name: "Charlie", age: -5, email: "charlie@example.com" }, // Âge invalide
  { name: "David", age: 40, email: "invalid-email" },      // Email invalide
  null,                                                    // Utilisateur null
];

async function runTests() {
  for (const testCase of testCases) {
    console.log("\n-----------------------------------");
    console.log("Test avec:", testCase);
    const result = await registerUser(testCase);
    console.log("Résultat:", result);
  }
}

runTests();
```
pour tester le code ci-dessus, dans le terminal, utiliser la commande `node nom-du-fichier.js`

## Résumé