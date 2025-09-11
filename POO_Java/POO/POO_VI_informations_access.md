# PROGRAMMATION ORIENTEE OBJET - Visibilité des informations (Public / Private & Getter / Setter)

## Visbilité : Public vs Private

Afin de permettre ou non d'accéder à des attributs d'une classe, on utilisera les mots clés "Public" et "Private".

* `Public` définit une information accessible à tout le monde.
* `Private` définit une information qui n'est accessible que par l'objet lui-même.

Tout attribut ou fonction peut être déclaré en "public" ou "private".

```
CLASS Character {
  // attributs
  name: PUBLIC STRING
  age: PRIVATE INTEGER
  sex: PRIVATE BOOLEAN

  // fonctions
  PUBLIC FUNCTION constructor(name, age, sex) {
    this.name <- name
    this.age <- age
    this.sex <- sex
  }
  PUBLIC FUNCTION sayHello() {
    SHOW "Hello, it's me ", this.name, ". "
    SHOW this.displayAge()
  }
  PRIVATE FUNCTION displayAge() {
    SHOW "I am ", this.age, " years old."
  }
}
```
De manière générale, on va plutôt provilegier le fait de mettre en `private` les informations,  
c'est à dire de rendre inaccessible certaines informations par n'importe qui, depuis n'importe où.  
En résumé, le mot clé `private` perrmet d'empêcher l'accès des informations (attributs ou fonctions) depuis des algorithmes extérieurs à l'objet.

On peut cependant accéder à la totalité des attributs et fonctions au sein même de l'objet, grâce au mot clé `this`. 

```
ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Romain", 36, TRUE) => OK
    SHOW character1.name => OK
    SHOW character1.age => NOT POSSIBLE
    SHOW character1.sex => NOT POSSIBLE
    character1.sayHello() => OK
    character1.displayAge() => NOT POSSIBLE
END
```
En pratique, les attributs seront très souvent en `private` et la majorité des fonctions seront en `public`.

## Getter et Setter

En règle générale, on définira tous les attributs de la classe en `PRIVATE`, afin d'éviter que n'importe qui ne puisse faire n'importe quoi sur les objets.

Afin de toujours accéder aux attributs, on mettra en place des fonctions permettant d'obtenir la valeur `"Getter"`, et de mofidier la valeur `"Setter"`.

```
CLASS Character {
    // attributs
    name: PRIVATE STRING
    age: PRIVATE INTEGER
    sex: PRIVATE BOOLEAN

    // fonctions
    PUBLIC FUNCTION constructor(name, age, sex) {
        this.name <- name
        this.age <- age
        this.sex <- sex
    }
    PUBLIC FUNCTION getName() {
        RETURN this.name
    }
    PUBLIC FUNCTION setName(newName) {
        RETURN this.name <- newName
    }
    PUBLIC FUNCTION getAge() {
        RETURN this.age
    }
    PUBLIC FUNCTION setAge(newAge) {
        RETURN this.age <- newAge
    }
    PUBLIC FUNCTION displayAge() {
        SHOW "I am ", this.age, " years old."
    }
    PUBLIC FUNCTION sayHello() {
        SHOW "Hello, it's me ", this.name, ". "
    }
}
```

```
ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Mario", 36, TRUE)

    SHOW character1.getName()
    character1.setName("Luigi")
    SHOW character1.getName()
END
```
=> résultat : "Mario" puis "Luigi".

## Exercices

I. Modifier la classe `Character` pour que tous les attributs ne soient directement qu'au travers des objets et non depuis "l'extérieur".

Empêcher l'utilisation de la fonction calculateDammage() depuis l'extérieur

Modifier si nécessaire l'algorithme principal pour créer les affichages réalisés dans la partie précédente.

```
CLASS Character {
    name : PRIVATE STRING
    race : PRIVATE STRING
    class : PRIVATE STRING
    attack : PRIVATE INTEGER
    pv : PRIVATE INTEGER
    sex : PRIVATE BOOLEAN
    allianceForces : PRIVATE BOOLEAN

    PUBLIC FUNCTION constructor (name, race, class, attack, pv, sex, allianceForces) {
        this.name <- name
        this.race <- race
        this.class <- class
        this.attack <- attack
        this.pv <- pv
        this.sex <- sex
        this.allianceForces <- allianceForces
    }
    PUBLIC FUNCTION displayDammages() {
        SHOW this.calculateDammages(), " dammage distributed."
    }
    PRIVATE FUNCTION calculateDammages() {
        RETURN this.pv / 100 * this.attack + 1
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    character1, character2, character3, character4 : Character 
    tab[char] : ARRAY OF Character

START
    character1 <- new Character("Thirlond", "dwarf", "warrior", 10, 100, TRUE, TRUE)
    character2 <- new Character("Lalayn", "elf", "archer", 5, 50, FALSE, TRUE)
    character3 <- new Character("Thakluf", "orc", "archer", 5, 55, FALSE, FALSE)
    character4 <- new Character("Kelb", "gobelin", "thief", 2, 10, TRUE, FALSE)
    characters <- tab[character1, character2, character3, character4]

    FOR i FROM 0 TO size(tab)-1 BY STEP OF 1 DO 
        characters[i].displayDammage()
    ENDFOR 
END
```

II. Créer une fonction qui permet de basculer un livre en anglais et ayant les impacts suivants sur ses informations propres : 
* 5 pages de plus sont ajoutées
* La couleur de la couverture est automatiquement basculée vers la couleur verte
* Le booléen à la valeur TRUE

Empêcher que n'importe qui puisse modifier le booléen (pour les fonctions permettant de modifier la couleur et ajouter des pages, laissez l'accès de l'extérieur)

Laisser la possibilité de modifier le titre et le nombre de pages du livre directement depuis l'attribut

```
CLASS Book 
    title: PUBLIC STRING
    nbOfPages: PUBLIC INTEGER
    coverColor: PRIVATE STRING
    isTranslatedInEnglish: PRIVATE BOOLEAN

    PUBLIC FUNCTION Constructor (name, nbOfPages, coverColor, isTranslated) {
        this.title <- name
        this.nbOfPages <- nbOfPages
        this.coverColor <- coverColor
        this.isTranslatedInEnglish <- isTranslated
    }
    PUBLIC FUNCTION setCoverColor(newColor) {
        this.coverColor <- newColor
    }
    PRIVATE FUNCTION englishTranslation() {
        this.isTranslatedInEnglish = TRUE
    }
    PUBLIC FUNCTION displayBook() {
        SHOW book1.title, "of ", book1.nbOfPages, " pages, with a ", book1.coverColor, " cover,",
        IF NOT book1.isTranslatedInEnglish THEN
            SHOW " not "
        ENDIF
        SHOW "translated in english".
    }
    PUBLIC FUNCTION addPages(nbToAdd) {
        this.nbOfPages += nbToAdd
    }
    PUBLIC FUNCTION switchToEnglish() {
        this.englishTranslation()
        this.addPages(5)
        this.setCoverColor("green")
    }
ENDCLASS
```
Indiquer dans l'algorithme ci-dessous si c'est possible ou non : 
```
ALGORITHM main
VARIABLES
    book1, book2, book3 : Book
START
    book1 <- new Book("L'algorithmique selon H2PROG", 500, "black", TRUE) => possible
    book1.title <- "algo H2PROG" => possible
    book1.nbOfPages <- 10 => possible
    book1.displayBook() => possible
    book1.addPages(10) => possible
    book1.coverColor("blue") => PAS possible
    book1.englishTranslation() => PAS possible
    book1.setCoverColor("pink") => possible
    book1.switchToEnglish() => possible
END
```
III. Ajuster les attributs de la classe Car en private et créer les getters et setters

```
CLASS Car {
    brand : PRIVATE STRING
    model : PRIVATE STRING
    color : PRIVATE STRING
    nbOfDoors : PRIVATE INTEGER
    isElectric : PRIVATE BOOLEAN

    PUBLIC FUNCTION constructor (b, m, c, doors, elec) {
        this.brand <- b
        this.model <- m
        this.color <- c
        this.nbOfDoors <- doors
        this.isElectric <- elec
    }
    PUBLIC FUNCTION getBrand() {
        RETURN this.brand
    }
    PUBLIC FUNCTION setBrand(newBrand) {
        this.brand <- newBrand
    }
    PUBLIC FUNCTION getModel() {
        RETURN this.model
    }
    PUBLIC FUNCTION setModel(newModel) {
        this.model <- newModel
    }
    PUBLIC FUNCTION getColor() {
        RETURN this.color
    }
    PUBLIC FUNCTION setColor(newColor) {
        this.color <- newColor
    }
    PUBLIC FUNCTION getNbOfDoors() {
        RETURN this.nbOfDoors
    }
    PUBLIC FUNCTION setNbOfDoors(newNbOfDoors) {
        this.nbOfDoors <- newNbOfDoors
    }
    PUBLIC FUNCTION getIsElectric() {
        RETURN this.isElectric
    }
    PUBLIC FUNCTION setIsElectric(newIsElectric) {
        this.isElectric <- newIsElectric
    }
    PUBLIC FUNCTION displayCar() {
        SHOW tab[i].brand, tab[i].model, tab[i].color, tab[i].nbOfDoors, " doors,"
        IF NOT tab[i].isElectric THEN
            SHOW " not"
        ENDIF
        SHOW " electric"
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
        tab[i].displayCar()
    ENDFOR
    displayBrandCar(tab, "Yotota")
END

FUNCTION displayBrandCars(tab, brand)
    SHOW "Here are the cars for the brand : ", brand
    FOR i FROM 0 TO size(tab)-1 BY STEP OF 1 DO
        IF tab[i].brand === brand THEN
            tab[i].displayCar()
        ENDIF
    ENDFOR
END
```