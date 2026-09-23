# PROGRAMMATION ORIENTEE OBJET - Les interactions entre objets

## Pourquoi ce chapitre ?

Jusqu'ici, chaque objet vivait plutôt seul : un `Character` affichait ses propres informations, un `Book` gérait ses propres attributs, une `Car` s'affichait elle-même. Or, en pratique, un programme orienté objet est avant tout un ensemble d'objets **qui interagissent entre eux** :
* un objet qui en **gère plusieurs autres** (une bibliothèque qui contient des livres, un garage qui contient des voitures) ;
* un objet qui **agit sur un autre objet** (un personnage qui attaque un autre personnage).

C'est ce deuxième niveau de complexité que ce chapitre aborde.

## Un objet qui en contient plusieurs autres

On a déjà vu qu'un objet peut contenir un autre objet en attribut (composition, voir chapitre précédent). On peut aller plus loin : un objet peut contenir un **tableau** d'autres objets, et proposer des fonctions pour les gérer (ajouter, retirer, rechercher...).

```
CLASS Library {
    books : PRIVATE ARRAY OF Book

    PUBLIC FUNCTION constructor() {
        this.books <- []
    }
    PUBLIC FUNCTION addBook(book) {
        this.books <- this.books + [book]   // on ajoute le livre au tableau
    }
    PUBLIC FUNCTION countBooks() {
        RETURN size(this.books)
    }
    PUBLIC FUNCTION displayAllBooks() {
        FOR i FROM 0 TO size(this.books)-1 BY STEP OF 1 DO
            this.books[i].displayBook()
        ENDFOR
    }
}
ENDCLASS
```

Ici, `Library` ne connaît pas les détails internes d'un `Book` (son titre, ses pages...) : elle se contente de lui déléguer l'affichage via `this.books[i].displayBook()`. C'est le même principe de délégation qu'on a vu avec `Car` et `Engine`, appliqué cette fois à une **collection** d'objets plutôt qu'à un seul.

## Un objet qui agit sur un autre objet

Une fonction peut aussi prendre **un autre objet en paramètre**, et agir sur lui. C'est ce qui permet à deux objets de la même classe (ou de classes différentes) d'interagir directement entre eux.

```
CLASS Character {
    name : PRIVATE STRING
    pv : PRIVATE INTEGER
    attack : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack) {
        this.name <- name
        this.pv <- pv
        this.attack <- attack
    }
    PUBLIC FUNCTION getPv() {
        RETURN this.pv
    }
    PUBLIC FUNCTION isAlive() {
        RETURN this.pv > 0
    }
    PUBLIC FUNCTION attackTarget(target) {
        // "target" est un autre objet Character, passé en paramètre
        target.receiveDamage(this.attack)
        SHOW this.name, " attaque ", target.getName(), " !"
    }
    PUBLIC FUNCTION receiveDamage(amount) {
        this.pv <- this.pv - amount
    }
    PUBLIC FUNCTION getName() {
        RETURN this.name
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    hero, monster : Character
START
    hero <- new Character("Aragorn", 100, 15)
    monster <- new Character("Orque", 40, 5)

    hero.attackTarget(monster)
    SHOW "PV restants de l'orque : ", monster.getPv()

    monster.attackTarget(hero)
    SHOW "PV restants d'Aragorn : ", hero.getPv()
END
```

À noter : dans `attackTarget`, `this` désigne l'attaquant, et `target` désigne un **autre objet** de la même classe. On peut appeler les fonctions publiques de `target` (`target.receiveDamage(...)`, `target.getName()`) exactement comme on le ferait depuis l'algorithme principal — un objet n'a pas de traitement de faveur particulier pour accéder à un autre objet, même de sa propre classe : il doit passer par ses fonctions publiques (ou `getters`/`setters`), pas par un accès direct à ses attributs `private`.

## Exercices

I. Sur la classe `Character`, ajouter une fonction `fight(otherCharacter)` qui simule un combat entre `this` et `otherCharacter` : chacun attaque l'autre à tour de rôle jusqu'à ce que l'un des deux n'ait plus de PV (`isAlive()` retourne `FALSE`). Afficher le nom du vainqueur à la fin.

```
CLASS Character {
    name : PRIVATE STRING
    pv : PRIVATE INTEGER
    attack : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack) {
        this.name <- name
        this.pv <- pv
        this.attack <- attack
    }
    PUBLIC FUNCTION getName() {
        RETURN this.name
    }
    PUBLIC FUNCTION isAlive() {
        RETURN this.pv > 0
    }
    PUBLIC FUNCTION receiveDamage(amount) {
        this.pv <- this.pv - amount
    }
    PUBLIC FUNCTION attackTarget(target) {
        target.receiveDamage(this.attack)
    }
    PUBLIC FUNCTION fight(otherCharacter) {
        WHILE this.isAlive() AND otherCharacter.isAlive() DO
            this.attackTarget(otherCharacter)
            IF otherCharacter.isAlive() THEN
                otherCharacter.attackTarget(this)
            ENDIF
        ENDWHILE

        IF this.isAlive() THEN
            SHOW this.name, " remporte le combat !"
        ELSE
            SHOW otherCharacter.getName(), " remporte le combat !"
        ENDIF
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    hero, monster : Character
START
    hero <- new Character("Aragorn", 100, 15)
    monster <- new Character("Orque", 40, 5)

    hero.fight(monster)
END
```

II. Créer une classe `Library` qui contient un tableau de `Book`, avec une fonction `addBook(book)` pour en ajouter, et une fonction `findByTitle(title)` qui retourne le livre correspondant au titre recherché (ou une valeur indiquant qu'il n'existe pas). Ajouter 3 livres à une bibliothèque, puis rechercher l'un d'entre eux par son titre.

```
CLASS Book {
    title : PRIVATE STRING
    nbOfPages : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(title, nbOfPages) {
        this.title <- title
        this.nbOfPages <- nbOfPages
    }
    PUBLIC FUNCTION getTitle() {
        RETURN this.title
    }
    PUBLIC FUNCTION displayBook() {
        SHOW this.title, " (", this.nbOfPages, " pages)"
    }
}
ENDCLASS

CLASS Library {
    books : PRIVATE ARRAY OF Book

    PUBLIC FUNCTION constructor() {
        this.books <- []
    }
    PUBLIC FUNCTION addBook(book) {
        this.books <- this.books + [book]
    }
    PUBLIC FUNCTION findByTitle(title) {
        FOR i FROM 0 TO size(this.books)-1 BY STEP OF 1 DO
            IF this.books[i].getTitle() === title THEN
                RETURN this.books[i]
            ENDIF
        ENDFOR
        RETURN NULL
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    myLibrary : Library
    found : Book
START
    myLibrary <- new Library()
    myLibrary.addBook(new Book("Apprendre l'algorithmique", 500))
    myLibrary.addBook(new Book("Le virus Asiatique", 300))
    myLibrary.addBook(new Book("La France du 19ème", 500))

    found <- myLibrary.findByTitle("Le virus Asiatique")
    IF found !== NULL THEN
        found.displayBook()
    ENDIF
END
```

III. Créer une classe `Garage` qui gère une flotte de `Car`. Elle doit permettre : d'ajouter une voiture (`addCar`), de lister les voitures disponibles à la location (`listAvailableCars`, celles dont l'attribut `isRented` vaut `FALSE`), et de louer une voiture par sa position dans le tableau (`rentCar(index)`, qui passe son `isRented` à `TRUE`).

```
CLASS Car {
    brand : PRIVATE STRING
    model : PRIVATE STRING
    isRented : PRIVATE BOOLEAN

    PUBLIC FUNCTION constructor(brand, model) {
        this.brand <- brand
        this.model <- model
        this.isRented <- FALSE
    }
    PUBLIC FUNCTION getIsRented() {
        RETURN this.isRented
    }
    PUBLIC FUNCTION rent() {
        this.isRented <- TRUE
    }
    PUBLIC FUNCTION displayCar() {
        SHOW this.brand, " ", this.model
    }
}
ENDCLASS

CLASS Garage {
    cars : PRIVATE ARRAY OF Car

    PUBLIC FUNCTION constructor() {
        this.cars <- []
    }
    PUBLIC FUNCTION addCar(car) {
        this.cars <- this.cars + [car]
    }
    PUBLIC FUNCTION listAvailableCars() {
        FOR i FROM 0 TO size(this.cars)-1 BY STEP OF 1 DO
            IF NOT this.cars[i].getIsRented() THEN
                this.cars[i].displayCar()
            ENDIF
        ENDFOR
    }
    PUBLIC FUNCTION rentCar(index) {
        this.cars[index].rent()
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    myGarage : Garage
START
    myGarage <- new Garage()
    myGarage.addCar(new Car("Yotota", "Ryas"))
    myGarage.addCar(new Car("Troen", "5C"))

    SHOW "Voitures disponibles :"
    myGarage.listAvailableCars()

    myGarage.rentCar(0)

    SHOW "Voitures disponibles après location :"
    myGarage.listAvailableCars()
END
```

En résumé, un système orienté objet prend toute sa valeur quand les objets **collaborent** : un objet "conteneur" qui gère une collection d'autres objets, ou un objet qui agit directement sur un autre via ses fonctions publiques. C'est cette collaboration entre objets qui remplace, en POO, l'enchaînement d'instructions de la programmation procédurale.
