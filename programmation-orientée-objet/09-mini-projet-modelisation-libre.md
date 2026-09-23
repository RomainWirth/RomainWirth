# PROGRAMMATION ORIENTEE OBJET - Mini-projet : modélisation libre

## Pourquoi ce chapitre ?

Dans tous les chapitres précédents, la classe à utiliser était **déjà donnée** : il fallait la compléter, l'étendre, la faire évoluer. C'est indispensable pour apprendre la syntaxe et les mécanismes, mais ce n'est pas la partie la plus difficile de la POO.

La vraie difficulté, c'est celle posée dès le chapitre 1 : partir d'un besoin exprimé en langage courant, et décider **soi-même** quelles sont les entités, quels attributs et traitements leur donner, et comment elles interagissent. C'est ce que ce chapitre te propose de pratiquer, sans squelette fourni.

## La méthode (rappel du chapitre 1)

Face à un énoncé, pose-toi dans l'ordre les questions suivantes :
1. Quelles sont les entités qui ont une "existence propre" dans ce système ?
2. Pour chaque entité, quels attributs sont **réellement utiles** au programme (pas "tout ce qu'on pourrait savoir sur elle" — voir la notion d'abstraction) ?
3. Quels traitements (fonctions) chaque entité doit-elle savoir faire ?
4. Quelles entités **interagissent** avec quelles autres ? Est-ce de la composition ("a un"), de l'héritage ("est un"), ou un simple appel de fonction avec un objet en paramètre ?

## Énoncé

Une ville souhaite mettre en place un système de vélos en libre-service, avec les règles suivantes :

* La ville dispose de plusieurs **stations**, chacune située à une adresse, avec un nombre de places limité.
* Chaque station contient un certain nombre de **vélos**. Un vélo peut être **mécanique** ou **électrique** ; un vélo électrique a en plus un niveau de batterie.
* Un **utilisateur** peut emprunter un vélo dans une station (si elle en a un de disponible), puis le restituer dans une autre station (si elle a une place libre).
* Quand un utilisateur restitue un vélo électrique, la station doit pouvoir afficher le niveau de batterie restant.

Avant de regarder la correction ci-dessous, prends le temps de répondre toi-même aux 4 questions de la méthode, et d'esquisser tes classes.

## Correction proposée

### 1. Les entités

* `Bike` (le vélo)
* `ElectricBike` (un vélo électrique — spécialisation de `Bike`, relation "est un")
* `Station` (contient des vélos — relation "a plusieurs", composition)
* `User` (interagit avec les stations)

### 2 et 3. Attributs et traitements retenus

On ne modélise que ce qui sert le système décrit — pas, par exemple, la couleur du vélo ou l'âge de l'utilisateur, qui ne sont mentionnés nulle part dans l'énoncé (c'est l'abstraction en action).

### 4. Les interactions

* `Station` **contient** un tableau de `Bike` (composition, comme `Library` contenait des `Book`).
* `ElectricBike` **hérite** de `Bike` (héritage, comme `ElectricCar` héritait de `Car`).
* `User` **agit sur** une `Station` en lui passant des instructions (`borrowFrom`, `returnTo`) — pas de composition ni d'héritage ici, juste des fonctions qui prennent des objets en paramètre.

### Le code

```
CLASS Bike {
    id : PROTECTED STRING
    isAvailable : PROTECTED BOOLEAN

    PUBLIC FUNCTION constructor(id) {
        this.id <- id
        this.isAvailable <- TRUE
    }
    PUBLIC FUNCTION getId() {
        RETURN this.id
    }
    PUBLIC FUNCTION getIsAvailable() {
        RETURN this.isAvailable
    }
    PUBLIC FUNCTION setIsAvailable(value) {
        this.isAvailable <- value
    }
    PUBLIC FUNCTION displayBike() {
        SHOW "Vélo ", this.id
    }
}
ENDCLASS

CLASS ElectricBike EXTENDS Bike {
    batteryLevel : PRIVATE INTEGER

    PUBLIC FUNCTION constructor(id, batteryLevel) {
        super(id)
        this.batteryLevel <- batteryLevel
    }
    PUBLIC FUNCTION getBatteryLevel() {
        RETURN this.batteryLevel
    }
    PUBLIC FUNCTION displayBike() {
        super.displayBike()
        SHOW " (électrique, batterie : ", this.batteryLevel, "%)"
    }
}
ENDCLASS

CLASS Station {
    name : PRIVATE STRING
    capacity : PRIVATE INTEGER
    bikes : PRIVATE ARRAY OF Bike

    PUBLIC FUNCTION constructor(name, capacity) {
        this.name <- name
        this.capacity <- capacity
        this.bikes <- []
    }
    PUBLIC FUNCTION hasAvailableBike() {
        RETURN size(this.bikes) > 0
    }
    PUBLIC FUNCTION hasFreeSlot() {
        RETURN size(this.bikes) < this.capacity
    }
    PUBLIC FUNCTION removeBike() {
        // retire et retourne le dernier vélo du tableau (opération "retirer un élément",
        // symétrique du "tab + [element]" déjà vu pour ajouter un élément)
        bike <- this.bikes[size(this.bikes) - 1]
        REMOVE LAST ELEMENT FROM this.bikes
        RETURN bike
    }
    PUBLIC FUNCTION addBike(bike) {
        this.bikes <- this.bikes + [bike]
    }
    PUBLIC FUNCTION displayStation() {
        SHOW "Station ", this.name, " : ", size(this.bikes), "/", this.capacity, " vélos"
        FOR i FROM 0 TO size(this.bikes)-1 BY STEP OF 1 DO
            this.bikes[i].displayBike()
        ENDFOR
    }
}
ENDCLASS

CLASS User {
    name : PRIVATE STRING
    currentBike : PRIVATE Bike

    PUBLIC FUNCTION constructor(name) {
        this.name <- name
        this.currentBike <- NULL
    }
    PUBLIC FUNCTION borrowFrom(station) {
        IF station.hasAvailableBike() THEN
            this.currentBike <- station.removeBike()
            SHOW this.name, " a emprunté un vélo."
        ELSE
            SHOW "Aucun vélo disponible dans cette station."
        ENDIF
    }
    PUBLIC FUNCTION returnTo(station) {
        IF station.hasFreeSlot() THEN
            station.addBike(this.currentBike)
            SHOW this.name, " a rendu son vélo."
            this.currentBike <- NULL
        ELSE
            SHOW "Aucune place disponible dans cette station."
        ENDIF
    }
}
ENDCLASS

ALGORITHM main
VARIABLES
    stationA, stationB : Station
    romain : User
START
    stationA <- new Station("Gare", 10)
    stationA.addBike(new Bike("V001"))
    stationA.addBike(new ElectricBike("V002", 80))

    stationB <- new Station("Centre-ville", 10)

    romain <- new User("Romain")
    romain.borrowFrom(stationA)
    romain.returnTo(stationB)

    stationB.displayStation()
END
```

### Ce que cet exercice illustre

* **Le choix entre héritage et composition n'était pas donné** : c'est à toi de reconnaître qu'`ElectricBike` "est un" `Bike` (héritage), alors que `Station` "a des" `Bike` (composition).
* **`User` n'hérite de rien et ne contient rien** : il interagit simplement avec des objets `Station` qu'on lui passe en paramètre — le troisième type de relation entre objets, à côté de l'héritage et de la composition.
* **Aucun attribut inutile** n'a été ajouté (pas de couleur de vélo, pas d'email d'utilisateur) : ils n'étaient pas nécessaires au regard de l'énoncé. C'est l'abstraction, appliquée dès la phase de conception et pas seulement via `ABSTRACT CLASS`/`INTERFACE`.

## À toi de jouer

Reprends la même méthode (les 4 questions) sur un scénario de ton choix — idéalement un sujet qui te parle dans ton propre travail (par exemple : un système de suivi de tickets clients, une plateforme de réservation de créneaux, un gestionnaire de recettes de cuisine...). Esquisse les classes, leurs attributs, leurs traitements, et surtout leurs interactions, avant d'écrire la moindre ligne de code.
