# PROGRAMMATION ORIENTEE OBJET - Accéder aux informations d'un objet

Une fois un objet créé, il est possible d'accéder aux informations directement en écrivant le nom suivi d'un point et du nom de l'attribut que l'on souhaite obtenir.

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

=> en résumé, pour accéder à un attribut, il suffit d'appeler la variables et de lui ajouter un point suivi de l'attribut souhaité :  
`variables.attribute`

## Exercices

I. À partir de la classe `Character`, réaliser les affichages suivants :
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

    SHOW character1.name, "is a ", character1.race, " ", character1.class, "with and attack of ", character1.attack, "and ", character1.pv, "health points, from "
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

II. À partir de la classe `Book`, réaliser les affichages suivants :
* L'algorithmique selon H2PROG, de 500 pages, couverture noire, traduit en anglais.
* Le virus Asiatique, de 300 pages, couverture rouge, non traduit en anglais.
* La France du 19ème, de 500 pages, couverture bleu, traduit en anglais

```
CLASS Book {
  title: STRING
  nbOfPages: INTEGER
  coverColor: STRING
  isTranslatedInEnglish: BOOLEAN

  FUNCTION Constructor (name, nbOfPages, coverColor, isTranslated) {
    this.title <- name
    this.nbOfPages <- nbOfPages
    this.coverColor <- coverColor
    this.isTranslatedInEnglish <- isTranslated
  }
}
ENDCLASS

ALGORITHM main
VARIABLES
    book1, book2, book3 : Book
START
    book1 <- new Book("L'algorithmique selon H2PROG", 500, "black", TRUE)

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
    car1, car2, car3 : Car
    tab[car] : ARRAY OF Car

START
    car1 <- new Car("Yotota", "Ryas", "black", 5, TRUE)
    car2 <- new Car("Yotota", "Risau", "red", 3, FALSE)
    car3 <- new Car("Troen", "5C", "red", 5, TRUE)
    tab <- new [car1, car2, car3]

    FOR i FROM 0 TO size(tab)-1 BY STEP OF 1 DO
        SHOW tab[i].brand, tab[i].model, tab[i].color, tab[i].nbOfDoors, " doors,"
        IF NOT tab[i].isElectric THEN
            SHOW " not"
        ENDIF
        SHOW " electric"
    ENDFOR
END
```
l'index d'un tableau commence toujours à 0. Il est donc nécessaire, lorsqu'on itère sur un tableau, de limiter la boucle à la taille tu tableau -1, afin de commencer à l'index 0 et de terminer au dernier index.