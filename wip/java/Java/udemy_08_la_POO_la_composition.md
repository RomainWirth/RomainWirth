# POO : La composition

## La composition

### Définition

La composition consiste à donner à une classe un **attribut dont le type est une autre classe**. Elle exprime une relation « **a un** » (*has-a*) : un terrain *a un* bâtiment, une voiture *a un* moteur, un utilisateur *a une* adresse.

Elle s'oppose à l'héritage, qui exprime une relation « **est un** » (*is-a*) et sera vu plus tard. On construit ainsi des objets complexes à partir d'objets plus simples, et on la privilégie souvent à l'héritage car elle couple moins les classes entre elles.

Le type de l'attribut peut être une classe écrite par nous (`Building`) ou une classe de la bibliothèque standard (`String`, `LocalDate`...). Un attribut de type `String` est donc déjà une composition.

```java
public class Building {
    private int constructionYear;
    private String type;          // composition avec une classe de la bibliothèque standard

    public Building(int constructionYear, String type) {
        this.constructionYear = constructionYear;
        this.type = type;
    }

    public int getConstructionYear() { return constructionYear; }
    public String getType() { return type; }
    // setters...
}
```

```java
public class Field {
    private int width;
    private int length;
    private Building building;   // composition : un Field a un Building

    public Field(int width, int length, Building building) {
        this.width = width;
        this.length = length;
        this.building = building;
    }
    // ...
}
```

```java
Building house = new Building(1992, "maison");
Field field = new Field(15, 32, house);
```

Le compilateur vérifie le type : passer autre chose qu'un `Building` (une `String`, un `int`...) à la place du troisième argument est une erreur de compilation.

### Composition, agrégation, association

En UML (Unified Modeling Language, « langage de modélisation unifié »), on distingue plusieurs niveaux de lien entre classes :

- **association** : lien quelconque entre deux classes;
- **agrégation** : « a un », mais la partie **existe indépendamment** du tout (le bâtiment est créé ailleurs et fourni au terrain);
- **composition** (au sens strict) : la partie **n'existe pas sans le tout**, qui la crée et la possède.

```java
// Composition au sens strict : la voiture crée et possède son moteur
public class Car {
    private final Engine engine = new Engine();
}
```

L'exemple `Field` / `Building` ci-dessus est donc, au sens strict, une agrégation : le bâtiment est créé hors du terrain et passé au constructeur. En pratique, on emploie souvent « composition » pour les deux cas en Java; ce qui compte surtout, c'est de savoir **qui crée l'objet** et **si la partie est obligatoire ou facultative** (voir plus bas).

### Rappel : références et passage par valeur

Voir le chapitre [POO : création de classes](udemy_07_la_POO_creation_de_classes.md), section « Variables, références et passage des arguments ».

Une variable de type classe contient une **référence** vers l'objet, et non l'objet lui-même. Quand on passe un objet à un constructeur ou à une méthode, c'est cette référence qui est **copiée** (Java passe toujours les arguments par valeur). Il n'y a donc **aucune duplication** de l'objet : l'argument et l'attribut désignent le **même** objet.

```
myFirstBuilding ───────┐
                       ▼
                  [ Building ]
                       ▲
myFieldOne.building ───┘
```

```java
myFirstBuilding.setType("commerce");
// myFieldOne.building désigne le même objet : la modification est visible via myFieldOne
```

Conséquence : deux terrains construits avec le même bâtiment le **partagent**, volontairement ou non.

### `null` et `NullPointerException`

Une variable de type objet contient une référence, qui peut valoir `null` (« aucun objet »). Un type primitif contient directement la valeur : il ne peut pas être `null` (voir `int` vs `Integer`).

```java
Field emptyField = new Field(25, 52, null);   // compile : terrain sans bâtiment
```

Le compilateur ne peut pas savoir si une référence sera `null` à l'exécution. L'erreur n'apparaît donc qu'au moment où on utilise la référence :

```java
public void displayField() {
    System.out.println(building.getType());   // 💥 si building vaut null
}
```

L'opérateur `.` appliqué à une référence `null` lève une `NullPointerException`. C'est une exception non vérifiée (`RuntimeException`) : le compilateur n'oblige pas à la gérer, et si rien ne l'intercepte, le programme s'arrête.

```
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Building.getType()" because "this.building" is null
	at Field.displayField(Field.java:57)
	at Main.main(Main.java:27)
```

Comment lire ce message :

- **Ce qui a échoué** : `Cannot invoke "Building.getType()"` (appel de `getType()`).
- **Ce qui valait `null`** : `"this.building"`, c'est-à-dire l'attribut `building` de l'objet courant (et non « `this` » lui-même).
- **La pile d'appels** (`at ...`) : la première ligne est l'endroit où l'exception a été levée (`Field.java`, ligne 57), les suivantes remontent la chaîne d'appels jusqu'à `main`.

Ce message détaillé est affiché par défaut depuis Java 15. Attention : la ligne indiquée est celle de l'**effet**. La **cause** (le `null` passé au constructeur) se trouve souvent ailleurs.

### Se protéger : le code défensif

Tout dépend de la règle métier : la partie est-elle **facultative** ou **obligatoire** ?

**1. Partie facultative : tester avant d'utiliser.**

```java
public void displayField() {
    System.out.println("Terrain de largeur : " + width + "m, de longueur : " + length + "m");
    if (building != null) {
        System.out.println("et ayant un bâtiment de type : " + building.getType() + ".");
    } else {
        System.out.println("et ne possédant pas de bâtiment.");
    }
}
```

**2. Partie obligatoire : refuser `null` dès la construction** (principe du *fail fast* : l'erreur apparaît là où elle est commise, pas plus loin).

```java
import java.util.Objects;

public Field(int width, int length, Building building) {
    this.width = width;
    this.length = length;
    this.building = Objects.requireNonNull(building, "building ne doit pas être null");
}
```

`Objects.requireNonNull` lève une `NullPointerException` avec le message indiqué si l'argument est `null`, sinon retourne l'argument.

À noter : « un terrain possède **obligatoirement** un bâtiment » et « on peut passer `null` » sont incompatibles. Il faut choisir l'une des deux règles et l'appliquer. Java propose aussi la classe `Optional` pour exprimer explicitement l'absence de valeur : à voir plus tard.

### Déléguer plutôt qu'enchaîner

La composition permet la **délégation** : la classe englobante confie à l'objet composé le travail qui le concerne, au lieu d'aller lire ses détails.

```java
// Peu souhaitable : Field connaît la structure interne de Building
System.out.println(building.getType() + " construit en " + building.getConstructionYear());

// Préférable : Building sait se décrire, Field délègue
// Dans Building :
public String describe() {
    return type + " construit en " + constructionYear;
}
// Dans Field :
System.out.println("et ayant un bâtiment : " + building.describe());
```

Si la structure de `Building` change, seul `Building` est modifié. On évite aussi les longues chaînes d'appels (`a.getB().getC().getD()`), fragiles et sources de `NullPointerException`.

## Organisation d'un projet : les packages

### Rôle

Un **package** regroupe des classes liées (par thème ou par rôle). Il sert à :

- **organiser** le projet plutôt que tout placer dans `src` ;
- **éviter les conflits de noms** : deux classes peuvent porter le même nom dans deux packages différents (par exemple `java.util.Date` et `java.sql.Date`) ;
- **contrôler la visibilité** (voir plus bas).

Chaque package correspond à un **dossier**.

### Convention de nommage

- Noms en **minuscules**, sans majuscules ni underscore, en général des mots collés.
- Le nom commence par le **nom de domaine inversé** de l'organisation (`com.johndoe`, `fr.monentreprise`), ce qui garantit l'unicité dans le monde. Sans domaine, on utilise un identifiant propre (pseudo, nom de société).
- On ajoute ensuite le **projet**, puis des sous-packages par rôle.
- Les racines `java` et `javax` sont réservées au JDK.

Le package `com.johndoe.project.classes` se traduit par des dossiers imbriqués dans `src` :

```
src
└── com
    └── johndoe
        └── project
            ├── Main.java
            └── classes
                ├── Building.java
                └── Field.java
```

### Déclarer un package

La déclaration `package` est la **première instruction** du fichier (hors commentaires) et doit correspondre à l'emplacement du fichier :

```java
package com.johndoe.project.classes;

public class Field { /* ... */ }
```

Le **nom complet** d'une classe (*fully qualified name*) est son package suivi de son nom : `com.johndoe.project.classes.Field`, et non `classes.Field`.

Déplacer une classe dans un package (opération de *refactor* de l'IDE) ajoute cette ligne et met à jour les références.

### Pourquoi `Field` et `Building` ne sont plus utilisables après le déplacement de `Main`

Une classe sans déclaration `package` appartient au **package par défaut** (sans nom). Une classe située dans un package nommé **ne peut pas importer** une classe du package par défaut. C'est pourquoi `Main` ne compile plus tant que `Field` et `Building` restent directement dans `src`.

Règle : toute classe d'un vrai projet est dans un package nommé. Le package par défaut ne convient que pour un test rapide.

### Les imports

Pour utiliser une classe d'un autre package, on l'importe :

```java
package com.johndoe.project;

import com.johndoe.project.classes.Building;
import com.johndoe.project.classes.Field;

public class Main { /* ... */ }
```

Un `import` ne copie rien : il indique simplement au compilateur à quel type correspond un nom simple (`Field`).

Pas d'import nécessaire dans deux cas :

- les classes sont dans le **même package** (l'import est implicite) : `Field` n'a pas besoin d'importer `Building` ;
- la classe appartient à `java.lang` (`String`, `Math`, `Integer`...), importé automatiquement.

`import com.johndoe.project.classes.*;` importe toutes les classes d'un package (mais pas ses sous-packages). On l'évite en général : on ne voit plus d'où vient chaque classe, et des ambiguïtés peuvent apparaître.

On peut aussi se passer d'import en utilisant le nom complet à chaque utilisation, mais cela alourdit la lecture. On le réserve au cas où deux classes portent le même nom :

```java
java.util.Date utilDate = new java.util.Date();
java.sql.Date sqlDate = new java.sql.Date(0L);
```

L'IDE gère les packages, les déplacements et les imports : on s'appuie dessus plutôt que de les écrire à la main.

### La visibilité package

Il existe quatre niveaux de visibilité :

| Modificateur | Même classe | Même package | Sous-classes | Partout |
|---|:---:|:---:|:---:|:---:|
| `private` | ✅ | ❌ | ❌ | ❌ |
| *(aucun)* : visibilité package | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

(`protected` concerne l'héritage, vu plus tard.)

La **visibilité package** (*package-private*) s'obtient en **n'écrivant aucun modificateur d'accès** (ni `public`, ni `protected`, ni `private`). Elle s'applique aux attributs, méthodes, constructeurs et classes. `static` et `final` ne sont pas des modificateurs de visibilité : ils se combinent librement avec elle.

```java
package com.johndoe.project.classes;

public class Building {
    int constructionYear;   // visibilité package
    // ...
}
```

```java
package com.johndoe.project.classes;

public class Field {
    // ...
    public int buildingAge(int currentYear) {
        return currentYear - building.constructionYear;   // ✅ même package : accès direct
    }
}
```

```java
package com.johndoe.project;

import com.johndoe.project.classes.Building;

public class Main {
    public static void main(String[] args) {
        Building house = new Building(1992, "maison");
        System.out.println(house.constructionYear);   // ❌ constructionYear is not public in Building;
                                                       //    cannot be accessed from outside package
    }
}
```

**À utiliser avec précaution** : donner accès aux attributs à tout le package affaiblit l'encapsulation, car les autres classes dépendent de la structure interne. Par défaut, on garde `private` et on passe par des accesseurs. La visibilité package sert aux classes d'un même package qui collaborent étroitement, ou aux classes internes qu'on ne veut pas exposer.

### Organiser les dépendances

Évitez les **dépendances circulaires** entre packages (A importe B et B importe A). Un type utilisé par une classe se place idéalement dans le même package qu'elle ou dans un package « plus bas ». C'est pourquoi l'enum de la section suivante est placé dans `classes`, à côté de `Building`.

Enfin, `classes` est un nom très générique : dans un vrai projet, on nomme les packages d'après leur **rôle** (`model`, `service`, `util`...).

## Le type `enum`

### Le problème : des valeurs libres

Avec un attribut `String`, n'importe quelle valeur est acceptée :

```java
Building b = new Building(1992, "mason");   // faute de frappe : compile, valeur invalide
```

Des constantes `public static final String TYPE_MAISON = "Maison";` réduisent les fautes de frappe, mais rien n'empêche de passer une autre chaîne : le compilateur ne peut rien vérifier.

### Définition

Un **enum** (type énuméré) définit un ensemble **fini et fixé à la compilation** de valeurs nommées. Le compilateur n'accepte que ces valeurs.

```java
package com.johndoe.project.classes;

public enum TypeBuilding {
    IMMEUBLE, MAISON, COMMERCE
}
```

Dans IntelliJ : clic droit dans l'arborescence → *New* → *Java Class* → *Enum*, puis on saisit le nom.

Propriétés :

- Chaque valeur est une **constante** `public static final` du type enum. C'est une **instance unique**, créée une seule fois au chargement de l'enum. On y accède par `TypeBuilding.MAISON`.
- On ne peut pas créer d'autres valeurs (`new TypeBuilding()` est impossible).
- Le **type** s'écrit en `PascalCase`, les **constantes** en `UPPER_SNAKE_CASE`.
- Comme il n'y a qu'une instance par constante, `==` suffit pour comparer deux valeurs (`equals` fonctionne aussi).

### Utilisation

```java
public class Building {
    private int constructionYear;
    private TypeBuilding type;

    public Building(int constructionYear, TypeBuilding type) {
        this.constructionYear = constructionYear;
        this.type = type;
    }
    // ...
}
```

```java
new Building(1992, TypeBuilding.MAISON);   // ✅
new Building(1992, "maison");              // ❌ ne compile pas : une String n'est pas un TypeBuilding
new Building(1992, null);                  // ⚠️ compile : un enum est un type objet, donc il peut valoir null
```

Le premier appel est le seul valide, et il est vérifié à la compilation : plus de faute de frappe possible. Le dernier rappelle que les précautions sur `null` vues plus haut restent valables.

### Méthodes fournies automatiquement

```java
TypeBuilding t = TypeBuilding.MAISON;

t.name();                          // "MAISON" : l'identifiant de la constante
t.ordinal();                       // 1 : sa position dans la déclaration (départ à 0)
TypeBuilding.values();             // tableau de toutes les constantes
TypeBuilding.valueOf("COMMERCE");  // String → constante ; IllegalArgumentException si le nom n'existe pas
```

`ordinal()` change si on réordonne les constantes : on ne s'en sert pas pour de la logique métier.

Parcourir toutes les valeurs :

```java
for (TypeBuilding type : TypeBuilding.values()) {
    System.out.println(type);   // affiche IMMEUBLE, MAISON, COMMERCE
}
```

### Enum et `switch`

L'enum s'utilise très bien avec `switch`. Les `case` portent le nom de la constante, sans le préfixe du type :

```java
switch (building.getType()) {
    case MAISON   -> System.out.println("Habitation individuelle");
    case IMMEUBLE -> System.out.println("Habitation collective");
    case COMMERCE -> System.out.println("Local commercial");
}
```

(La syntaxe avec `->` nécessite Java 14 ou plus. Si `getType()` retourne `null`, le `switch` lève une `NullPointerException`.)

### Enum avec attributs, constructeur et méthodes

Un enum est une classe particulière : il peut avoir des attributs, un constructeur et des méthodes. Chaque constante est créée en appelant le constructeur, avec les arguments entre parenthèses :

```java
public enum TypeBuilding {
    IMMEUBLE("Immeuble"), MAISON("Maison"), COMMERCE("Commerce");   // constantes d'abord, puis « ; »

    private final String label;

    TypeBuilding(String label) {   // constructeur implicitement private
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
```

Règles :

- Les **constantes sont déclarées en premier**, séparées par des virgules. Le `;` final est obligatoire dès qu'il y a des membres après elles.
- Le **constructeur est implicitement `private`** (d'où le `private` grisé par IntelliJ s'il est écrit). `public` et `protected` sont interdits : seules les constantes de l'enum peuvent être créées, à l'intérieur de l'enum.
- Les attributs sont en général `final` : une valeur d'enum doit rester constante. On fournit des getters, pas de setters.
- Un enum peut implémenter des interfaces, mais ne peut pas hériter d'une autre classe.

Le nom de l'attribut est `label` et non `name`, car `name()` existe déjà et retourne l'identifiant de la constante : un champ `name` prêterait à confusion.

```java
TypeBuilding.MAISON.name();       // "MAISON"
TypeBuilding.MAISON.getLabel();   // "Maison"
System.out.println(TypeBuilding.MAISON);   // "MAISON" : toString() retourne name() par défaut
```

Utilisation dans `Field` :

```java
System.out.println("et ayant un bâtiment de type : " + building.getType().getLabel() + ".");
// → et ayant un bâtiment de type : Maison.
```

### Quand utiliser un enum ?

Quand l'ensemble des valeurs est **connu à l'avance et stable** : jours de la semaine, points cardinaux, statuts d'une commande, types de bâtiment. Quand les valeurs évoluent à l'exécution (liste venant d'une base de données, par exemple), on utilise plutôt une classe.