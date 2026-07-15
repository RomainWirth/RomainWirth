# NOTIONS

* `OBJET` = un objet est une "super variable" contenant des données et des traitements.
* `CLASSE` = une classe est un "moule" permettant de générer des objets ayant une structure prédéfinie.
* `ATTRIBUTS` = les attributs représentent la partie "données" des objets. Ce sont les "variables" des objets.
* `THIS` = Ce mot clef permet d'accéder aux informations directement depuis l'objet lui-même. Il n'est pas utilisable par les algorithmes appelants.
* `CONSTRUCTEUR` = Une fonction "constructeur" est une fonction qui permet de créer un objet à partir d'une classe. On parle d'instanciation de la classe.
* `Private / Public` = "Private" permet de rendre inaccessible une information (attribut ou fonction), depuis l'extérieur de l'objet. Le mot clef "public" à l'inverse, le permet.
* `Getter / Setter` = Les fonctions de "getters" permettent d'accéder à un attribut placé en "private" et un "setter" de le modifier.
* `ENCAPSULATION` = principe consistant à protéger les données d'un objet en les rendant `private`, et à ne les exposer qu'au travers de fonctions publiques (getters/setters). C'est ce que mettent en œuvre `private/public` et les getters/setters.
* `HÉRITAGE` = mécanisme permettant à une classe (classe "enfant") de récupérer les attributs et les fonctions d'une autre classe (classe "parent"), afin de réutiliser du code et de spécialiser un comportement.
* `POLYMORPHISME` = capacité d'objets de classes différentes à répondre à une même fonction (même nom) avec un comportement qui leur est propre.
* `ABSTRACTION` = fait de ne modéliser que les informations et traitements utiles au programme, en masquant les détails internes de fonctionnement.

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
  PRIVATE FUNCTION calculateDamages() {
    RETURN this.healthPoints / 100 * this.attack + 1
  }
  PUBLIC FUNCTION displayDamages() {
    SHOW this.calculateDamages(), " distributed damages."
  }
  PUBLIC FUNCTION getName() {
    RETURN this.name
  }
  PUBLIC FUNCTION setName(newName) {
    this.name <- newName
  }
}
```

Cette classe peut ensuite être instanciée puis utilisée dans un algorithme principal :

```
ALGORITHM main
VARIABLES
    hero : Character
START
    hero <- new Character("Aragorn", 12, 80)
    SHOW hero.getName()        // Aragorn
    hero.displayDamages()      // 10.6 distributed damages.
    hero.setName("Strider")
    SHOW hero.getName()        // Strider
END
```

Depuis l'extérieur de l'objet :
* `hero.getName()` et `hero.setName(...)` sont accessibles car `public` ;
* `hero.calculateDamages()` est **inaccessible** car `private` : seul l'objet peut l'appeler via `this` (ici au travers de `displayDamages()`).

## Les 4 piliers de la POO

Toutes les notions du cours se regroupent autour de 4 grands principes :

1. **L'encapsulation** : regrouper données et traitements dans un même objet, et protéger l'accès aux données (`private` + getters/setters). C'est l'objet des chapitres sur les classes et la visibilité.
2. **L'abstraction** : ne modéliser que ce qui est utile au programme et masquer les détails internes (l'utilisateur d'un objet appelle `displayDamages()` sans connaître le calcul interne).
3. **L'héritage** : réutiliser et spécialiser une classe existante en créant une classe enfant (chapitre 07).
4. **Le polymorphisme** : permettre à des objets différents de répondre à une même fonction de manière adaptée (chapitre 07).

## En résumé

* On **modélise** le réel sous forme de **classes** (les moules) et d'**objets** (les instances).
* Une classe regroupe des **attributs** (données) et des **fonctions** (traitements).
* Le **constructeur** initialise chaque objet ; `this` désigne l'objet courant.
* La **visibilité** (`public`/`private`) protège les données ; les **getters/setters** offrent un accès contrôlé.
* L'**héritage** et le **polymorphisme** permettent de réutiliser et d'étendre le code sans le dupliquer.