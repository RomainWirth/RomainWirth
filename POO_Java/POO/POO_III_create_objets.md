# PROGRAMMATION ORIENTEE OBJET - Créer des objets

## Le Constructeur

Pour créer des objets à partir d'une classe, il faut définir un constructeur.

Un constructeur est une fonction intégrée comme élément d'une classe.

```
CLASSE Personnage {
    nom : CHAINE DE CARACTERES
    age : ENTIER
    sexe : BOOLEEN
    
    FONCTION constructeur() {
    }
}
```

Le constructeur permet de générer des objets de la classe.<br>
Les accolades de la syntaxe permettent de définir le début et la fin d'un bloc de code.<br>

Les données sont les attributs de la classe (ou propriétés).<br>
Les fonctions sont les traitements.

## Instanciation

L'instanciation est la création et l'initialisation d'un objet.<br>
L'objet instancié dispose de la structure de la classe correspondante.<br>
On parle d'instanciation de la classe Personnage.<br>

Le mot clé `new` permet de créer un objet d'une classe (= instancier une classe pour en faire un objet).<br>

Exemple : à partir de la classe personnage, on va créer un algorithme permettant d'instancier de nouveaux personnages :
```
ALGORITHME main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
DEBUT
    perso1 <- new Personnage()
    perso2 <- new Personnage()
    perso3 <- new Personnage()
FIN
```
Chaque personnage créé aura la structure de la classe Personnage : avec un nom, un âge et un sexe.
Chaque objet personnage créé sera du type Personnage (provenant de la classe Personnage).<br>
le type Personnage est un type complexe.<br>

Actuellement, comme on a rempli aucun attribut de classe au moment de la création des objets, les objets sont vides.<br>
On pourra ensuite remplir ces objets grâce au concept d'hydratation.<br>

Pour obtenir des objets remplis, on va compléter le constructeur de classe :
```
CLASSE Personnage {
    nom : CHAINE DE CARACTERES (STRING)
    age : ENTIER (INTEGER)
    sexe : BOOLEEN (BOOLEAN)
    
    FONCTION constructeur(nom, age, sexe) {
        this.nom <- nom
        this.age <- age
        this.sexe <- sexe
    }
}
```
Le mot clé `this` permet d'accéder aux informations directement présentes dans l'objet.<br>
On peut traduire ce mot clé par "mon" : mon nom, mon age, mon sexe.

L'algorithme d'instanciation qui en découle sera donc le suivant :
```
ALGORITHME main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
DEBUT
    perso1 <- new Personnage("Romain", 34, VRAI)
    perso2 <- new Personnage("Flora", 38, FAUX)
    perso3 <- new Personnage("Katia", 40, FAUX)
FIN
```
Les paramètres de la fonction "constructeur" devront être renseignés au moment de son appel dans l'algorithme d'instanciation.<br>
l'objet créé à partir de la classe aura donc les attributs de la classe.

## Exercices 

I. À partir de la classe `Character`, ajouter le constructeur nécessaire pour créer les objets suivants :
* Thirlond est un guerrier Nain avec une attaque de 10 et 100 points de vie (PV), il appartient aux forces du alliance.
* Lalayn est une archère Elfe avec une attaque de 5 et 50 PV, elle appartient aux forces de l'alliance.
* Thakluf est une archère Orque avec une attaque de 5 et 55 PV, elle appartient aux forces de la horde.
* Kelb est un voleur Gobelin avec une attaque de 2 et 10 PV, il appartient aux forces de la horde.

```
CLASS Character {
  name : STRING
  race : STRING
  class : STRING
  attack : INTEGER
  pv : INTEGER
  sex : BOOLEAN
  allianceForces : BOOLEAN

  FUNCTION constructor (name, race, class, attack, pv, sex, allianceForces) {
    this.name <- name
    this.race <- race
    this.class <- class
    this.attack <- attack
    this.pv <- pv
    this.sex <- sex
    this.allianceForces <- allianceForces
  }
}
ENDCLASS

ALGORITHM main
VARIABLES
    character1 : Character
    character2 : Character
    character3 : Character
    character4 : Character
START
    character1 <- new Character("Thirlond", "dwarf", "warrior", 10, 100, TRUE, TRUE)
    character2 <- new Character("Lalayn", "elf", "archer", 5, 50, FALSE, TRUE)
    character3 <- new Character("Thakluf", "orc", "archer", 5, 55, FALSE, FALSE)
    character4 <- new Character("Kelb", "gobelin", "thief", 2, 10, TRUE, FALSE)
END
```

II. À partir de la classe `Book`, ajouter le constructeur nécessaire pour créer les objets suivants : 
* L'algorithmique selon H2PROG, de 500 pages, couverture noire, traduit en anglais.
* Le virus Asiatique, de 300 pages, couverture rouge, non traduit en anglais.
* La France du 19ème, de 500 pages, couverture bleu, traduit en anglais

```
CLASS Book {
  title: STRING
  nbOfPages: INTEGER
  coverColor: STRING
  isTranslatedInEnglish: BOOLEAN

  FUNCTION Constructor (t, nop, cc, isTr) {
    this.title <- t
    this.nbOfPages <- nop
    this.coverColor <- cc
    this.isTranslatedInEnglish <- isTr
  }
}
ENDCLASS

ALGORITHM main
VARIABLES
    book1 : Book
    book2 : Book
    book3 : book
START
    book1 <- new Book("L'algorithmique selon H2PROG", 500, "black", TRUE)
    book2 <- new Book("Le virus Asiatique", 300, "red", FALSE)
    book3 <- new Book("La France du 19ème", 500, "blue", TRUE)
END
```

III. À partir de la classe `Voiture`, ajouter le constructeur nécessaire pour créer les objets suivants : 
* Yotota Ryas noire 5 portes électrique
* Yotota Risau rouge 3 portes non électrique
* Troen 5C rouge 5 portes électrique

```
CLASS Car {
  brand : STRING
  model : STRING
  color : STRING
  nbOfDoors : INTEGER
  isElectric : BOOLEAN

  FUNCTION constructor (b, m, c, doors, elec) {
    this.brand <- b
    this.model <- m
    this.color <- c
    this.nbOfDoors <- doors
    this.isElectric <- elec
  }
}
ENDCLASS

ALGORITHM main
VARIABLES
    car1 : Car
    car2 : Car
    car3 : Car

START
    car1 <- new Car("Yotota", "Ryas", "black", 5, TRUE)
    car2 <- new Car("Yotota", "Risau", "red", 3, FALSE)
    car3 <- new Car("Troen", "5C", "red", 5, TRUE)
END
```