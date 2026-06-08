# PROGRAMMATION ORIENTEE OBJET - Les fonctions de classe

## Définir des fonctions de classe

`Rappel, une fonction est un bloc de code qui contient une suite d'instructions que l'on pourra exécuter à la demande lorsqu'on appelle la fonction` 

Il est possible de définir des fonctions à l'intérieur des classes. Ces fonctions seront étroitement liées à la classe.

Ainsi, lors de l'instanciation d'un objet, celui-ci pourra utiliser la fonction comme pour accéder à ses attributs.

```
CLASS Character {
    name: STRING
    age: INTERGER
    sex: BOOLEAN

    FUNCTION constructor(name, age, sex) {...}
    FUNCTION sayHello(){
        SHOW "Hello, it's me ", this.name, ". "
    }
}

ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Tom", 22, TRUE)
    character1.sayHello()
END
```

Pour accéder à la fonction de classe, on va appeler la variable suivi du nom de la fonction séparées par un point :  
`variable.function()`

## Appel de fonctions

Des fonctions peuvent appeler d'autres fonctions 

```
CLASS Character {
    name: STRING
    age: INTERGER
    sex: BOOLEAN

    FUNCTION constructor(name, age, sex) {...}
    FUNCTION sayHello(){
        SHOW "Hello, it's me ", this.name, ". "
        SHOW this.displayAge()
    }
    FUNCTION displayAge() {
        SHOW "I am", this.age, " years old."
    }
}

ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Tom", 22, TRUE)
    character1.sayHello()
END
```

### Exemple 

```
CLASS Character {
    name: STRING
    age: INTERGER
    sex: BOOLEAN

    FUNCTION constructor(name, age, sex) {...}
    FUNCTION birthday(){
        SHOW "It's my birthday "
        this.addOneYear()
        SHOW "I am ", 
    }
    FUNCTION addOneYear() {
        this.age <- this.age + 1
    }
    FUNCTION modifyName(newName) {
        this.name <- newName
    }
}

ALGORITHM main
VARIABLES
    character1: Character
START
    character1 <- new Character("Tom", 22, TRUE)
    character1.birthday()
    character1.modifyName("Jerry")
END
```

## Exercices

I. Créer une fonction qui permet à chaque objet d'infliger des dégâts à partir du calcul suivant : 
* Pourcentage de PV * attack + 1  
La fonction retournera le résultat des dégâts

Créer une deuxième fonction qui permet à chaque objet d'afficher le message : 
* "Dégâts infligés : x dégâts.", x étant le résultat du précédent calcul

Faire en sorte de réaliser l'affichage pour 4 personnages

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
    FUNCTION calculateDammages() {
        RETURN this.pv / 100 * this.attack + 1
    }
    FUNCTION displayDammages() {
        SHOW this.calculateDammages(), " dammage distributed."
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
II. Créer une fonction qui permet de changer la couleur d'un livre

Créer une fonction qui permet d'inverser le booléen "isTranslatedInEnglish" :
* si la valeur était TRUE, elle devient FALSE
* si la valeur était FALSE, elle devient TRUE

Créer une fonction qui permet d'afficher un livre

Modifier ensuite les livres suivants selon les fonctions de classe : 
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
    FUNCTION changeColor(newColor) {
        this.coverColor <- newColor
    }
    FUNCTION changeIsTranslated() {
        this.isTranslatedInEnglish <- NOT this.isTranslatedInEnglish
    }
    FUNCTION displayBook() {
        SHOW book1.title, "of ", book1.nbOfPages, " pages, with a ", book1.coverColor, " cover,",
        IF NOT book1.isTranslatedInEnglish THEN
            SHOW " not "
        ENDIF
        SHOW "translated in english".
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    book1, book2, book3 : Book
START
    book1 <- new Book("L'algorithmique selon H2PROG", 500, "black", TRUE)
    book2 <- new Book("Le virus Asiatique", 300, "red", FALSE)
    book3 <- new Book("La France du 19ème", 500, "blue", TRUE)

    book2.changeColor("green")
    book2.changeIsTranslated()
    book2.displayBook()

    book3.changeIsTranslated()
    book3.displayBook()
END
```
Dans ce dernier exemple, la fonction `changeColor()`est un `setter`.  
Et la fonction `displayBook()` est en fait la création de la fonction `toString()`.

III. Créer une fonction qui permet d'afficher une voiture

Créer une fonction qui permet d'afficher les voitures de la marque "Yotota" sans passer par une fonction de classe.

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
    FUNCTION displayCar() {
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