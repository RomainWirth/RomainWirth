# PROGRAMMATION ORIENTEE OBJET - L'abstraction en pratique

## Rappel

L'abstraction, c'est le fait de ne modéliser que ce qui est utile au programme, en masquant les détails internes de fonctionnement.<br>
On l'a déjà pratiquée sans le nommer explicitement : quand `Car` appelle `this.engine.displayEngine()` sans savoir comment cette fonction est implémentée (chapitre héritage/polymorphisme), c'est de l'abstraction.

Ce chapitre va plus loin : comment **imposer**, au niveau de la classe elle-même, qu'un certain comportement existe, sans en fixer l'implémentation ?

## Le problème que l'abstraction résout

Reprenons la classe `Character` du chapitre précédent. Rien n'empêche, dans l'algorithme principal, d'écrire :

```
badExample <- new Character("Fantôme", 10, 1)
```

Or, dans la logique du jeu, un `Character` "brut" n'a pas vraiment de sens : on ne joue qu'avec des `Warrior`, des `Archer`, etc. `Character` ne sert qu'à **factoriser** ce que ces classes ont en commun ; il ne devrait jamais être instancié directement.

C'est exactement ce que permet une **classe abstraite**.

## La classe abstraite (`ABSTRACT CLASS`)

Une classe abstraite :
* **ne peut jamais être instanciée directement** (`new` est interdit sur elle) ;
* peut définir des fonctions normales (avec leur code), comme n'importe quelle classe ;
* peut aussi définir des fonctions **abstraites** : seulement leur signature (nom, paramètres), sans code. Chaque classe enfant est alors **obligée** de fournir sa propre implémentation.

```
ABSTRACT CLASS Shape {
    PUBLIC ABSTRACT FUNCTION area()   // pas de code : chaque enfant doit l'implémenter

    PUBLIC FUNCTION describe() {
        SHOW "Cette forme a une aire de ", this.area()
    }
}
ENDCLASS

CLASS Circle EXTENDS Shape {
    radius : PRIVATE FLOAT

    PUBLIC FUNCTION constructor(radius) {
        this.radius <- radius
    }
    PUBLIC FUNCTION area() {
        RETURN 3.14 * this.radius * this.radius
    }
}
ENDCLASS

CLASS Square EXTENDS Shape {
    side : PRIVATE FLOAT

    PUBLIC FUNCTION constructor(side) {
        this.side <- side
    }
    PUBLIC FUNCTION area() {
        RETURN this.side * this.side
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    shapes : ARRAY OF Shape
START
    shapes <- [new Circle(5), new Square(4)]

    FOR i FROM 0 TO size(shapes)-1 BY STEP OF 1 DO
        shapes[i].describe()
    ENDFOR

    badExample <- new Shape()   // ERREUR : impossible d'instancier une classe abstraite
END
```

Deux choses à observer :
* `describe()` est une fonction "normale" définie une seule fois dans `Shape`, et **réutilisée telle quelle** par `Circle` et `Square` (comme n'importe quel héritage classique).
* `area()` n'a **aucune implémentation** dans `Shape` : c'est une simple promesse — « toute forme doit savoir calculer son aire » — que chaque classe enfant doit tenir. C'est ça, l'abstraction : `Shape` décrit *ce qu'il faut faire*, pas *comment* le faire.

## L'interface (`INTERFACE`)

Une classe abstraite peut mélanger fonctions concrètes et fonctions abstraites, et une classe ne peut hériter (`EXTENDS`) que d'**une seule** classe abstraite ou classe normale.

Une **interface** va plus loin dans l'abstraction : elle ne contient **que** des signatures de fonctions (aucun code, aucun attribut), et une classe peut **implémenter plusieurs interfaces** à la fois (contrairement à l'héritage, limité à un seul parent). On utilise le mot clé `IMPLEMENTS`.

```
INTERFACE Rentable {
    FUNCTION rent()
    FUNCTION isAvailable()
}
ENDINTERFACE

CLASS Car IMPLEMENTS Rentable {
    isRented : PRIVATE BOOLEAN

    PUBLIC FUNCTION constructor() {
        this.isRented <- FALSE
    }
    PUBLIC FUNCTION rent() {
        this.isRented <- TRUE
    }
    PUBLIC FUNCTION isAvailable() {
        RETURN NOT this.isRented
    }
}
ENDCLASS
```

Une interface s'utilise quand on veut garantir qu'un objet propose certains comportements, sans se soucier de sa classe d'origine : n'importe quelle classe qui `IMPLEMENTS Rentable` (une `Car`, mais aussi bien un `Bike` ou une `MeetingRoom`) pourra être traitée de la même façon par une fonction qui attend "quelque chose de louable".

## Abstraite ou interface : laquelle choisir ?

| | Classe abstraite | Interface |
|---|---|---|
| Peut contenir du code | Oui (fonctions concrètes + abstraites) | Non (que des signatures) |
| Peut contenir des attributs | Oui | Non |
| Une classe peut en hériter/implémenter combien ? | Une seule | Plusieurs |
| Relation exprimée | « est un » (comme l'héritage classique) | « est capable de » |

## Exercices

I. Transformer la classe `Character` du chapitre précédent en `ABSTRACT CLASS`, avec `specialAttack()` comme fonction abstraite. `Warrior` et `Archer` doivent continuer à fonctionner à l'identique, mais il ne doit plus être possible d'écrire `new Character(...)` dans l'algorithme principal.

```
ABSTRACT CLASS Character {
    name : PROTECTED STRING
    pv : PROTECTED INTEGER
    attack : PROTECTED INTEGER

    PUBLIC FUNCTION constructor(name, pv, attack) {
        this.name <- name
        this.pv <- pv
        this.attack <- attack
    }
    PUBLIC ABSTRACT FUNCTION specialAttack()
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
    // party <- [new Character("Fantôme", 10, 1), ...]  => ERREUR, désormais impossible

    FOR i FROM 0 TO size(party)-1 BY STEP OF 1 DO
        party[i].specialAttack()
    ENDFOR
END
```

II. Créer une interface `Rentable` (comme dans l'exemple ci-dessus) et faire en sorte que `Car` l'implémente. Écrire une fonction `displayIfAvailable(item)` qui prend n'importe quel objet `Rentable` en paramètre, et n'affiche l'objet que s'il est disponible à la location (`isAvailable()`).

```
INTERFACE Rentable {
    FUNCTION rent()
    FUNCTION isAvailable()
}
ENDINTERFACE

CLASS Car IMPLEMENTS Rentable {
    brand : PRIVATE STRING
    model : PRIVATE STRING
    isRented : PRIVATE BOOLEAN

    PUBLIC FUNCTION constructor(brand, model) {
        this.brand <- brand
        this.model <- model
        this.isRented <- FALSE
    }
    PUBLIC FUNCTION rent() {
        this.isRented <- TRUE
    }
    PUBLIC FUNCTION isAvailable() {
        RETURN NOT this.isRented
    }
    PUBLIC FUNCTION displayCar() {
        SHOW this.brand, " ", this.model
    }
}
ENDCLASS

FUNCTION displayIfAvailable(item)
    IF item.isAvailable() THEN
        item.displayCar()
    ELSE
        SHOW "Non disponible."
    ENDIF
END

ALGORITHM main
VARIABLES
    car1 : Car
START
    car1 <- new Car("Yotota", "Ryas")
    displayIfAvailable(car1)   // affiche la voiture

    car1.rent()
    displayIfAvailable(car1)   // affiche "Non disponible."
END
```

En résumé, l'abstraction ne se limite pas à "choisir des attributs pertinents" (ce qu'on pratique depuis le premier chapitre) : elle peut aussi se traduire concrètement par une classe abstraite ou une interface, qui **impose** un contrat de comportement à toutes les classes qui en héritent ou l'implémentent, sans jamais dicter comment ce comportement doit être codé.
