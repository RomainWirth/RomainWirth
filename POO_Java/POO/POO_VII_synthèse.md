# NOTIONS

* `OBJET` = un objet est une "super variable" contenant des données et des traitements.
* `CLASSE` = une classe est un "moule" permettant de générer des objets ayant une structure prédéfinie.
* `ATTRIBUTS` = les attributs représentent la partie "données" des objets. Ce sont les "variables" des objets.
* `THIS` = Ce mot clef permet d'accéder aux informations directement depuis l'objet lui-même. Il n'est pas utilisable par les algorithmes appelants.
* `CONSTRUCTEUR` = Une fonction "constructeur" est une fonction qui permet de créer un objet à partir d'une classe. On parle d'instanciation de la classe.
* `Private / Public` = "Private" permet de rendre inaccessible une information (attribut ou fonction), depuis l'extérieur de l'objet. Le mot clef "public" à l'inverse, le permet.
* `Getter / Setter` = Les fonctions de "getters" permettent d'accéder à un attribut placé en "private" et un "setter" de le modifier.

## Exemple 

```
CLASS Character {
  name: PUBLIC STRING
  attack: PRIVATE INTEGER
  healthPoints: PRIVATE INTEGER

  PUBLIC FUNCTION constructor (name, attack, hp) {
    this.name <- name
    this.attack <- attack
    this.healthPoints <- hp
  }
  PRIVATE FUNCTION calculateDammages() {
    RETURN this.healthPoints / 100 * this.attack + 1
  }
  PUBLIC FUNCTION displayDammages() {
    SHOW this.calculateDammages(), " distributed dammages."
  }
  PUBLIC FUNCTION getName() {
    RETURN this.name
  }
  PUBLIC FUNCTION setName(newname) {
    this.name <- newName
  }
}