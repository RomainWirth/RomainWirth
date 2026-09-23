# PROGRAMMATION ORIENTEE OBJET - Créer et manipuler des objets

## Le Constructeur

Pour créer des objets à partir d'une classe, il faut définir un constructeur.

Un constructeur est une fonction intégrée comme élément d'une classe.

```
CLASS Personnage {
    nom : STRING
    age : INTEGER
    sexe : BOOLEAN
    
    FUNCTION constructor() {
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
ALGORITHM main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
START
    perso1 <- new Personnage()
    perso2 <- new Personnage()
    perso3 <- new Personnage()
END
```
Chaque personnage créé aura la structure de la classe Personnage : avec un nom, un âge et un sexe.
Chaque objet personnage créé sera du type Personnage (provenant de la classe Personnage).<br>
le type Personnage est un type complexe.<br>

## Hydratation

Actuellement, comme on a rempli aucun attribut de classe au moment de la création des objets, les objets sont vides.<br>
On pourra ensuite remplir ces objets grâce au concept d'hydratation.<br>

Pour obtenir des objets remplis, on va compléter le constructeur de classe :
```
CLASS Personnage {
    nom : STRING
    age : INTEGER
    sexe : BOOLEAN
    
    FUNCTION constructor(nom, age, sexe) {
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
ALGORITHM main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
START
    perso1 <- new Personnage("Romain", 34, TRUE)
    perso2 <- new Personnage("Flora", 38, FALSE)
    perso3 <- new Personnage("Katia", 40, FALSE)
END
```
Les paramètres de la fonction "constructeur" devront être renseignés au moment de son appel dans l'algorithme d'instanciation.<br>
l'objet créé à partir de la classe aura donc les attributs de la classe.

## Accéder aux attributs d'un objet

Une fois un objet créé et hydraté, il est possible d'accéder à ses informations directement en écrivant le nom de l'objet suivi d'un point et du nom de l'attribut que l'on souhaite obtenir.

```
CLASS Character {
  name: STRING
  age: INTEGER
  sex: BOOLEAN

  FUNCTION constructor(name, age, sex) {
    this.name <- name
    this.age <- age
    this.sex <- sex
  }
}

ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Romain", 36, TRUE)
    SHOW "Hello", character1.name
    SHOW "Tu as", character1.age, "ans"
    IF character1.sex THEN
        SHOW "et tu es un homme"
    ELSE
        SHOW "et tu es une femme"
    ENDIF
END
```

=> en résumé, pour accéder à un attribut, il suffit d'appeler la variable et de lui ajouter un point suivi de l'attribut souhaité :  
`variable.attribute`

## Parcourir un tableau d'objets

Il est très courant de manipuler plusieurs objets d'une même classe en même temps, en les rangeant dans un tableau.<br>
On peut alors parcourir ce tableau avec une boucle, et accéder aux attributs de chaque objet via l'index courant :

```
tab <- [obj1, obj2, obj3]

FOR i FROM 0 TO size(tab)-1 BY STEP OF 1 DO
    SHOW tab[i].nomDeLAttribut
ENDFOR
```
l'index d'un tableau commence toujours à 0. Il est donc nécessaire, lorsqu'on itère sur un tableau, de limiter la boucle à la taille du tableau -1, afin de commencer à l'index 0 et de terminer au dernier index.

## Exercices

I. À partir de la classe `Character`, créer les objets suivants, puis afficher pour chacun :
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
    character1, character2, character3, character4 : Character 

START
    character1 <- new Character("Thirlond", "dwarf", "warrior", 10, 100, TRUE, TRUE)
    SHOW character1.name, "is a ", character1.race, " ", character1.class, "with an attack of ", character1.attack, "and ", character1.pv, "health points, from "
    IF character1.allianceForces THEN
        SHOW "the alliance"
    ELSE
        SHOW "the horde"
    ENDIF

    character2 <- new Character("Lalayn", "elf", "archer", 5, 50, FALSE, TRUE)
    // same algo

    character3 <- new Character("Thakluf", "orc", "archer", 5, 55, FALSE, FALSE)
    // same algo

    character4 <- new Character("Kelb", "gobelin", "thief", 2, 10, TRUE, FALSE)
    // same algo
END
```

II. À partir de la classe `Book`, créer les objets suivants, puis afficher pour chacun :
* Apprendre l'algorithmique, de 500 pages, couverture noire, traduit en anglais.
* Le virus Asiatique, de 300 pages, couverture rouge, non traduit en anglais.
* La France du 19ème, de 500 pages, couverture bleue, traduit en anglais

```
CLASS Book {
  title: STRING
  nbOfPages: INTEGER
  coverColor: STRING
  isTranslatedInEnglish: BOOLEAN

  FUNCTION constructor (t, nop, cc, isTr) {
    this.title <- t
    this.nbOfPages <- nop
    this.coverColor <- cc
    this.isTranslatedInEnglish <- isTr
  }
}
ENDCLASS

ALGORITHM main
VARIABLES
    book1, book2, book3 : Book
START
    book1 <- new Book("Apprendre l'algorithmique", 500, "black", TRUE)
    SHOW book1.title, "of ", book1.nbOfPages, " pages, with a ", book1.coverColor, " cover,",
    IF NOT book1.isTranslatedInEnglish THEN
        SHOW " not "
    ENDIF
    SHOW "translated in english".

    book2 <- new Book("Le virus Asiatique", 300, "red", FALSE)
    // same algo
    book3 <- new Book("La France du 19ème", 500, "blue", TRUE)
    // same algo
END
```

III. À partir de la classe `Car`, créer les objets suivants, les ranger dans un tableau, puis afficher chacun d'entre eux en parcourant le tableau avec une boucle :
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
    car1, car2, car3 : Car
    tab : ARRAY OF Car

START
    car1 <- new Car("Yotota", "Ryas", "black", 5, TRUE)
    car2 <- new Car("Yotota", "Risau", "red", 3, FALSE)
    car3 <- new Car("Troen", "5C", "red", 5, TRUE)
    tab <- [car1, car2, car3]

    FOR i FROM 0 TO size(tab)-1 BY STEP OF 1 DO
        SHOW tab[i].brand, tab[i].model, tab[i].color, tab[i].nbOfDoors, " doors,"
        IF NOT tab[i].isElectric THEN
            SHOW " not"
        ENDIF
        SHOW " electric"
    ENDFOR
END
```
