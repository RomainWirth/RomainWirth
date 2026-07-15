# PROGRAMMATION ORIENTEE OBJET - Héritage et polymorphisme

## Pourquoi l'héritage ?

Imaginons que notre jeu ait plusieurs types de personnages : des guerriers, des archers, des voleurs.
Tous partagent les mêmes informations de base (un nom, des points de vie, une attaque) et les mêmes traitements (afficher, subir des dégâts...), mais chacun possède aussi un comportement qui lui est propre.

Sans héritage, on serait obligé de **recopier** les mêmes attributs et les mêmes fonctions dans chaque classe (`Warrior`, `Archer`, `Thief`...). C'est une duplication de code : difficile à maintenir et source d'erreurs.

```
L'héritage permet de définir une classe "générale" une seule fois,
puis de créer des classes "spécialisées" qui en récupèrent tout le contenu.
```

## Le vocabulaire de l'héritage

* La **classe parent** (ou super-classe / classe mère) contient les attributs et fonctions communs.
* La **classe enfant** (ou sous-classe / classe fille) **hérite** de la classe parent : elle récupère automatiquement ses attributs et ses fonctions, et peut en ajouter de nouveaux.

On utilise le mot clé `EXTENDS` pour indiquer qu'une classe hérite d'une autre.

```
CLASS Character {
    name : PROTECTED STRING
    pv : PROTECTED INTEGER
    attack : PROTECTED INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack) {
        this.name <- name
        this.pv <- pv
        this.attack <- attack
    }
    PUBLIC FUNCTION displayCharacter() {
        SHOW this.name, " a ", this.pv, " PV et ", this.attack, " d'attaque."
    }
}
ENDCLASS

CLASS Warrior EXTENDS Character {
    weapon : PRIVATE STRING

    PUBLIC FUNCTION constructor(name, pv, attack, weapon) {
        super(name, pv, attack)
        this.weapon <- weapon
    }
}
ENDCLASS
```

Ici, un objet `Warrior` possède **automatiquement** les attributs `name`, `pv`, `attack` et la fonction `displayCharacter()`, même s'ils ne sont écrits que dans `Character`.

### Le mot clé `PROTECTED`

On a vu `public` (accessible partout) et `private` (accessible uniquement dans l'objet).
L'héritage introduit un troisième niveau de visibilité :

* `PROTECTED` définit une information accessible **par l'objet lui-même ET par ses classes enfants**, mais pas depuis l'extérieur.

On met donc en `protected` (plutôt que `private`) les attributs du parent qui devront être utilisés par les classes enfants.

## Le constructeur et `super()`

Une classe enfant doit initialiser à la fois les attributs hérités du parent et ses propres attributs.
Le mot clé `super()` **appelle le constructeur de la classe parent**.

```
    PUBLIC FUNCTION constructor(name, pv, attack, weapon) {
        super(name, pv, attack)   // initialise name, pv, attack via Character
        this.weapon <- weapon     // initialise l'attribut propre à Warrior
    }
```

`super(...)` doit être appelé en premier dans le constructeur de l'enfant, avant d'utiliser `this`.

## La redéfinition de fonction (override)

Une classe enfant peut **redéfinir** une fonction héritée pour lui donner un comportement différent.
Il suffit de créer, dans l'enfant, une fonction portant le **même nom** que dans le parent.

```
CLASS Character {
    name : PROTECTED STRING

    PUBLIC FUNCTION constructor(name) { this.name <- name }
    PUBLIC FUNCTION specialAttack() {
        SHOW this.name, " attaque."
    }
}
ENDCLASS

CLASS Warrior EXTENDS Character {
    PUBLIC FUNCTION specialAttack() {
        SHOW this.name, " assène un puissant coup d'épée !"
    }
}
ENDCLASS
```

Quand on appelle `specialAttack()` sur un `Warrior`, c'est **la version de `Warrior`** qui s'exécute (elle "remplace" celle du parent).

### Réutiliser le comportement du parent avec `super`

Parfois, on ne veut pas tout remplacer, mais **compléter** le comportement du parent.
`super.nomDeLaFonction()` permet d'exécuter la version du parent depuis l'enfant.

```
CLASS Archer EXTENDS Character {
    PUBLIC FUNCTION specialAttack() {
        super.specialAttack()                 // exécute d'abord "X attaque."
        SHOW this.name, " décoche une flèche ! "
    }
}
ENDCLASS
```

## Le polymorphisme

Le polymorphisme (du grec « plusieurs formes ») est la conséquence directe de l'héritage et de la redéfinition :

```
Des objets de classes différentes peuvent répondre à une même fonction,
chacun avec son propre comportement.
```

Concrètement, on peut ranger un `Warrior` et un `Archer` dans un même tableau de type `Character` (puisqu'ils **sont** des `Character`), puis appeler la même fonction sur chacun : chaque objet exécute **sa** version.

```
ALGORITHM main
VARIABLES
    party : ARRAY OF Character
START
    party <- [new Warrior("Thirlond"), new Archer("Lalayn")]

    FOR i FROM 0 TO size(party)-1 BY STEP OF 1 DO
        party[i].specialAttack()
    ENDFOR
END
```

Affichage obtenu :
```
Thirlond assène un puissant coup d'épée !
Lalayn attaque.
Lalayn décoche une flèche !
```

Le code de la boucle est **le même pour tous les personnages** : il ne connaît que le type `Character`. C'est chaque objet qui "sait" comment se comporter. C'est là toute la puissance du polymorphisme : on ajoute de nouveaux types (`Thief`, `Mage`...) sans jamais modifier la boucle.

## Héritage ou composition ?

L'héritage exprime une relation **« est un »** :
* un `Warrior` **est un** `Character` → héritage justifié.

Lorsque la relation est plutôt **« a un »**, on préfère la **composition** (un objet contient un autre objet en attribut) :
* une `Car` **a un** `Engine` → on met un attribut `engine` de type `Engine` dans `Car`, on ne fait pas hériter `Car` de `Engine`.

Règle simple : n'utilise l'héritage que si la phrase « l'enfant **est un** parent » a du sens.

## Exercices

I. À partir de la classe `Character`, créer deux classes enfants `Warrior` et `Archer` :
* `Warrior` possède en plus une arme (`weapon`) et redéfinit `specialAttack()` pour afficher : « X assène un coup d'épée ! »
* `Archer` possède en plus un nombre de flèches (`arrows`) et redéfinit `specialAttack()` pour afficher : « X décoche une flèche ! »

Instancier un guerrier et un archer, les placer dans un tableau de `Character` et déclencher l'attaque spéciale de chacun via une boucle (polymorphisme).

```
CLASS Character {
    name : PROTECTED STRING
    pv : PROTECTED INTEGER
    attack : PROTECTED INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack) {
        this.name <- name
        this.pv <- pv
        this.attack <- attack
    }
    PUBLIC FUNCTION specialAttack() {
        SHOW this.name, " attaque."
    }
}
ENDCLASS

CLASS Warrior EXTENDS Character {
    weapon : PRIVATE STRING

    PUBLIC FUNCTION constructor(name, pv, attack, weapon) {
        super(name, pv, attack)
        this.weapon <- weapon
    }
    PUBLIC FUNCTION specialAttack() {
        SHOW this.name, " assène un coup d'épée ! "
    }
}
ENDCLASS

CLASS Archer EXTENDS Character {
    arrows : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack, arrows) {
        super(name, pv, attack)
        this.arrows <- arrows
    }
    PUBLIC FUNCTION specialAttack() {
        SHOW this.name, " décoche une flèche ! "
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    party : ARRAY OF Character
START
    party <- [new Warrior("Thirlond", 100, 10, "épée"), new Archer("Lalayn", 50, 5, 20)]

    FOR i FROM 0 TO size(party)-1 BY STEP OF 1 DO
        party[i].specialAttack()
    ENDFOR
END
```

II. À partir de la classe `Book`, créer une classe enfant `AudioBook` qui ajoute une durée d'écoute (`duration`, en minutes) et un narrateur (`narrator`).
Redéfinir la fonction d'affichage pour qu'elle affiche, **en plus des informations du livre**, la durée et le narrateur (en réutilisant l'affichage du parent grâce à `super`).

```
CLASS Book {
    title : PROTECTED STRING
    nbOfPages : PROTECTED INTEGER

    PUBLIC FUNCTION constructor(title, nbOfPages) {
        this.title <- title
        this.nbOfPages <- nbOfPages
    }
    PUBLIC FUNCTION displayBook() {
        SHOW this.title, " (", this.nbOfPages, " pages)"
    }
}
ENDCLASS

CLASS AudioBook EXTENDS Book {
    duration : PRIVATE INTEGER
    narrator : PRIVATE STRING

    PUBLIC FUNCTION constructor(title, nbOfPages, duration, narrator) {
        super(title, nbOfPages)
        this.duration <- duration
        this.narrator <- narrator
    }
    PUBLIC FUNCTION displayBook() {
        super.displayBook()
        SHOW " - version audio de ", this.duration, " min, lue par ", this.narrator
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    audio1 : AudioBook
START
    audio1 <- new AudioBook("L'algorithmique selon H2PROG", 500, 630, "Romain")
    audio1.displayBook()
END
```

III. À partir de la classe `Car`, créer une classe enfant `ElectricCar` qui ajoute une capacité de batterie (`batteryCapacity`, en kWh) et sa fonction d'accès (`getBatteryCapacity`).
Redéfinir `displayCar()` pour préciser l'autonomie de la batterie.

```
CLASS Car {
    brand : PROTECTED STRING
    model : PROTECTED STRING

    PUBLIC FUNCTION constructor(brand, model) {
        this.brand <- brand
        this.model <- model
    }
    PUBLIC FUNCTION displayCar() {
        SHOW this.brand, " ", this.model
    }
}
ENDCLASS

CLASS ElectricCar EXTENDS Car {
    batteryCapacity : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(brand, model, batteryCapacity) {
        super(brand, model)
        this.batteryCapacity <- batteryCapacity
    }
    PUBLIC FUNCTION getBatteryCapacity() {
        RETURN this.batteryCapacity
    }
    PUBLIC FUNCTION displayCar() {
        super.displayCar()
        SHOW " - électrique, batterie de ", this.batteryCapacity, " kWh"
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    car1 : ElectricCar
START
    car1 <- new ElectricCar("Troen", "5C", 60)
    car1.displayCar()
    SHOW "Capacité : ", car1.getBatteryCapacity(), " kWh"
END
```

En résumé, l'héritage évite la duplication de code (une classe enfant réutilise le parent), la **redéfinition** permet de spécialiser un comportement, et le **polymorphisme** permet de traiter uniformément des objets de types différents tout en laissant chacun répondre à sa manière.
