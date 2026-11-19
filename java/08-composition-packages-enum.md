# Composition, packages et enum

Au chapitre précédent, tu as écrit tes premières classes. Un vrai programme en contient des dizaines, qui **collaborent** : un navire a un capitaine, une cale, un type. Ce chapitre répond à trois questions :

* comment relier les classes entre elles (la **composition**) ;
* comment les ranger pour s'y retrouver (les **packages**) ;
* comment représenter un ensemble fini de valeurs sans risquer la faute de frappe (les **enum**).

## Objectifs

À la fin du chapitre, tu sauras :

* construire un objet à partir d'autres objets, et distinguer « a un » et « est un » ;
* expliquer ce qui est partagé quand on passe un objet à un constructeur ;
* lire une `NullPointerException` et t'en protéger ;
* organiser un projet en packages, et utiliser les imports ;
* distinguer les quatre niveaux de visibilité ;
* définir et utiliser un `enum`, avec ou sans attributs.

## La composition

### Définition

La **composition** consiste à donner à une classe un **attribut dont le type est une autre classe**. Elle exprime une relation « **a un** » (*has-a*) : un navire *a un* capitaine, un capitaine *a un* perroquet, un navire *a une* cale.

Elle s'oppose à l'**héritage**, qui exprime une relation « **est un** » (*is-a*) et que tu verras au chapitre suivant : un `Galleon` *est un* `Ship`. On construit ainsi des objets complexes à partir d'objets plus simples. On privilégie souvent la composition, car elle **couple moins** les classes entre elles.

Le type de l'attribut peut être une classe que tu as écrite (`Captain`) ou une classe de la bibliothèque standard (`String`, `LocalDate`...). Un attribut de type `String` est donc déjà une composition.

Voici un capitaine, puis un navire qui en possède un :

```java
public class Captain {
    private final String name;
    private final int yearsAtSea;

    public Captain(String name, int yearsAtSea) {
        this.name = name;
        this.yearsAtSea = yearsAtSea;
    }

    public String getName() { return name; }
    public int getYearsAtSea() { return yearsAtSea; }
}
```

```java
public class Ship {
    private final String name;
    private final Captain captain;   // composition : un Ship a un Captain
    private int hull;

    public Ship(String name, Captain captain, int hull) {
        this.name = name;
        this.captain = captain;
        this.hull = hull;
    }
    // ...
}
```

```java
Captain flint = new Captain("Flint", 20);
Ship blackPearl = new Ship("Black Pearl", flint, 35);
```

Le compilateur vérifie le type : passer une `String` ou un `int` à la place du `Captain` est une erreur de compilation.

### Composition, agrégation, association

En **UML** (*Unified Modeling Language*, un langage de schémas pour décrire des classes), on distingue plusieurs niveaux de lien :

* **association** : un lien quelconque entre deux classes ;
* **agrégation** : « a un », mais la partie **existe indépendamment** du tout. Le capitaine est créé ailleurs puis fourni au navire ;
* **composition** (au sens strict) : la partie **n'existe pas sans le tout**, qui la crée et la possède.

```java
public class Ship {
    private final Captain captain;               // agrégation : créé à l'extérieur et fourni
    private final Cargo cargo = new Cargo();     // composition stricte : le navire crée sa cale
    // ...
}
```

L'exemple `Ship` / `Captain` est donc, au sens strict, une agrégation. En pratique, on emploie souvent le mot « composition » pour les deux cas en Java. Ce qui compte vraiment, c'est de savoir **qui crée l'objet** et **si la partie est obligatoire ou facultative** (voir plus bas).

### Rappel : références et passage par valeur

Reprends la section sur les références du chapitre 7. Une variable de type classe contient une **référence**, pas l'objet. Quand tu passes un objet à un constructeur, la référence est **copiée** : il n'y a **aucune duplication** de l'objet. L'argument et l'attribut désignent le **même** capitaine.

```
  flint ──────────────────┐
                          ▼
                    [ Captain ]
                          ▲
  blackPearl.captain ─────┘
```

Conséquence : deux navires construits avec le même capitaine le **partagent**, volontairement ou non. Si le capitaine est modifiable, une modification faite via un navire est visible depuis l'autre. Tu peux le vérifier :

```java
Ship twin = new Ship("Twin", flint, 20);
// twin.getCaptain() == blackPearl.getCaptain()   -> true : un seul capitaine, deux navires
```

Est-ce voulu ? Peut-être pas : un capitaine ne commande qu'un seul navire à la fois. C'est une règle de conception à faire respecter dans le code, pas quelque chose que Java vérifie pour toi.

### `null` et `NullPointerException`

Une variable de type classe peut valoir `null` (« aucun objet »). Un type primitif contient directement sa valeur : il ne peut pas être `null` (c'est une des différences entre `int` et `Integer`).

Imaginons que le capitaine ait un perroquet **facultatif** :

```java
public class Parrot {
    private final String name;
    public Parrot(String name) { this.name = name; }
    public String getName() { return name; }
}
```

```java
public class Captain {
    private final String name;
    private final Parrot parrot;   // facultatif : peut valoir null

    public Captain(String name, Parrot parrot) {
        this.name = name;
        this.parrot = parrot;
    }

    public Captain(String name) {
        this(name, null);          // capitaine sans perroquet
    }

    public Parrot getParrot() { return parrot; }
    // ...
}
```

```java
Captain anne = new Captain("Anne");   // compile : pas de perroquet
```

Le compilateur ne peut pas savoir si une référence sera `null` à l'exécution. L'erreur n'apparaît qu'au moment où on **utilise** la référence :

```java
System.out.println(anne.getParrot().getName());
```

L'opérateur `.` appliqué à une référence `null` lève une `NullPointerException`. C'est une exception **non vérifiée** (`RuntimeException`) : le compilateur n'oblige pas à la gérer, et si rien ne l'intercepte, le programme s'arrête. Voici ce qu'affiche Java 21 :

```
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "com.pirates.adventure.model.Parrot.getName()" because the return value of "com.pirates.adventure.model.Captain.getParrot()" is null
	at com.pirates.adventure.Main.main(Main.java:14)
```

Comment le lire :

* **ce qui a échoué** : `Cannot invoke "...Parrot.getName()"` : on a tenté d'appeler `getName()` ;
* **ce qui valait `null`** : `the return value of "...Captain.getParrot()"`, c'est-à-dire ce que renvoie `getParrot()`. Quand c'est un attribut, le message dit par exemple `because "this.parrot" is null` ;
* **la pile d'appels** (les lignes `at ...`) : la première ligne est l'endroit où l'exception a été levée, les suivantes remontent la chaîne d'appels jusqu'à `main`.

Ce message détaillé est affiché par défaut depuis Java 15. Attention : la ligne indiquée est celle de l'**effet**. La **cause** (le `null` passé au constructeur) se trouve souvent ailleurs.

### Se protéger : le code défensif

Tout dépend de la règle métier : la partie est-elle **facultative** ou **obligatoire** ?

**1. Partie facultative : tester avant d'utiliser.**

```java
public String describe() {
    String text = "Capitaine " + name;
    if (parrot != null) {
        text += ", accompagné de " + parrot.getName();
    }
    return text;
}
```

**2. Partie obligatoire : refuser `null` dès la construction.** C'est le principe du *fail fast* : l'erreur apparaît là où elle est commise, et non trois méthodes plus loin.

```java
import java.util.Objects;

public Ship(String name, Captain captain, int hull) {
    this.name = name;
    this.captain = Objects.requireNonNull(captain, "captain must not be null");
    this.hull = hull;
}
```

`Objects.requireNonNull` lève une `NullPointerException` avec le message indiqué si l'argument est `null`, sinon elle retourne l'argument. Un navire sans capitaine devient impossible à créer.

Attention à la cohérence : « un navire possède **obligatoirement** un capitaine » et « on peut passer `null` » sont incompatibles. Il faut choisir une règle et l'appliquer partout. Java propose aussi la classe `Optional` pour exprimer clairement l'absence de valeur : tu la croiseras plus tard.

### Déléguer plutôt qu'enchaîner

La composition permet la **délégation** : la classe englobante confie à l'objet qu'elle contient le travail qui le concerne, au lieu d'aller fouiller dans ses détails.

```java
// Peu souhaitable : Ship connaît la structure interne de Captain
System.out.println(captain.getName() + ", " + captain.getYearsAtSea() + " ans de mer");

// Préférable : Captain sait se décrire, Ship délègue
// Dans Captain :
public String describe() {
    return name + ", " + yearsAtSea + " ans de mer";
}
// Dans Ship :
System.out.println("Capitaine " + captain.describe());
```

Si la structure de `Captain` change, seule `Captain` est modifiée. On évite aussi les longues chaînes d'appels (`ship.getCaptain().getParrot().getName()`), fragiles et sources de `NullPointerException`.

Pour une composition stricte, la délégation protège aussi l'encapsulation. Si `Ship` possède une `Cargo` et expose `getCargo()`, n'importe qui peut la modifier à sa guise. On préfère une méthode du navire qui délègue :

```java
public void load(int barrels) {
    cargo.addBarrels(barrels);
}
```

## Organiser un projet : les packages

### Rôle

Un **package** regroupe des classes liées (par thème ou par rôle). Il sert à :

* **organiser** le projet plutôt que tout placer au même endroit ;
* **éviter les conflits de noms** : deux classes peuvent porter le même nom dans deux packages différents (`java.util.Date` et `java.sql.Date`, par exemple) ;
* **contrôler la visibilité** (voir plus bas).

Chaque package correspond à un **dossier**.

### Convention de nommage

* Des **minuscules** uniquement, sans underscore, en général des mots collés.
* Le nom commence par le **nom de domaine inversé** de l'organisation (`com.monentreprise`, `fr.monsite`), ce qui garantit l'unicité dans le monde. Sans domaine, on choisit un identifiant propre. Dans le kit, le package racine est `com.pirates.adventure`.
* On ajoute ensuite le **projet**, puis des sous-packages par rôle.
* Le préfixe `java` est réservé au JDK : la JVM refuse de charger une classe dans un package `java.xxx` (`SecurityException: Prohibited package name`). Le préfixe `javax` l'est par convention.

Dans un projet Maven, le package `com.pirates.adventure.model` correspond à des dossiers imbriqués sous `src/main/java` :

```
src
└── main
    └── java
        └── com
            └── pirates
                └── adventure
                    ├── Main.java
                    └── model
                        ├── Captain.java
                        ├── Cargo.java
                        ├── Parrot.java
                        ├── Ship.java
                        └── ShipType.java
```

Sans Maven, c'est le même principe : les packages correspondent à des dossiers à partir de la racine des sources.

### Déclarer un package

La déclaration `package` est la **première instruction** du fichier (commentaires mis à part) et doit correspondre à l'emplacement du fichier :

```java
package com.pirates.adventure.model;

public class Ship { /* ... */ }
```

Le **nom complet** d'une classe (*fully qualified name*) est son package suivi de son nom : `com.pirates.adventure.model.Ship`, et non `model.Ship`. C'est ce nom complet qu'il faut donner à `java` pour lancer un programme :

```bash
javac -d out $(find src -name '*.java')
java -cp out com.pirates.adventure.Main
```

`java -cp out Main` échoue avec `Could not find or load main class Main`, puisque la classe s'appelle en réalité `com.pirates.adventure.Main`. IntelliJ s'occupe de tout cela.

Dans IntelliJ, déplacer une classe dans un package (opération de *refactor*) ajoute la ligne `package` et met à jour les références.

### Le package par défaut

Une classe sans déclaration `package` appartient au **package par défaut** (sans nom). Une classe située dans un package nommé **ne peut pas utiliser** une classe du package par défaut :

```
error: cannot find symbol
  symbol:   variable Util
  location: class Main
```

Voilà pourquoi, dès que tu déplaces `Main` dans un package, tes autres classes doivent suivre. La règle : **toute classe d'un vrai projet est dans un package nommé**. Le package par défaut ne convient que pour un essai rapide (comme dans les premiers chapitres).

### Les imports

Pour utiliser une classe d'un autre package, on l'**importe** :

```java
package com.pirates.adventure;

import com.pirates.adventure.model.Captain;
import com.pirates.adventure.model.Ship;
import com.pirates.adventure.model.ShipType;

public class Main { /* ... */ }
```

Un `import` ne copie rien : il indique au compilateur à quel type correspond un nom simple (`Ship`). Sans lui, tu obtiens `cannot find symbol`.

Deux cas dispensent d'import :

* les classes sont dans le **même package** (`Ship` n'a pas besoin d'importer `Captain`, s'ils sont tous deux dans `model`) ;
* la classe appartient à `java.lang` (`String`, `Math`, `Integer`...), importé automatiquement.

`import com.pirates.adventure.model.*;` importe toutes les classes d'un package (mais pas ses sous-packages). On l'évite en général : on ne voit plus d'où vient chaque classe, et des ambiguïtés peuvent apparaître :

```java
import java.util.*;
import java.sql.*;

Date d;   // error: reference to Date is ambiguous
```

On peut aussi se passer d'import en écrivant le nom complet. On le réserve au cas où deux classes portent le même nom :

```java
java.util.Date utilDate = new java.util.Date();
java.sql.Date sqlDate = new java.sql.Date(0L);
```

L'IDE gère les imports. Quand tu tapes un nom de classe inconnu, IntelliJ propose en général de l'importer (bulle d'aide en survolant le nom souligné en rouge, ou action contextuelle via `Alt + Entrée` si ce raccourci fonctionne chez toi). Il peut aussi ajouter les imports sans ambiguïté automatiquement : réglage *Settings*, *Editor*, *General*, *Auto Import*. À toi de choisir la méthode qui te convient ; ce qui compte, c'est de comprendre ce que fait un `import`.

### Les quatre niveaux de visibilité

| Modificateur | Même classe | Même package | Sous-classes | Partout |
| --- | :---: | :---: | :---: | :---: |
| `private` | oui | non | non | non |
| *(aucun)* : visibilité package | oui | oui | non | non |
| `protected` | oui | oui | oui | non |
| `public` | oui | oui | oui | oui |

(`protected` concerne l'héritage, vu au chapitre suivant.)

La **visibilité package** (*package-private*) s'obtient en **n'écrivant aucun modificateur d'accès**. Elle s'applique aux attributs, méthodes, constructeurs et classes. Attention : c'est bien la visibilité **par défaut**, pas `protected`. `static` et `final` ne sont pas des modificateurs de visibilité : ils se combinent librement avec elle.

```java
package com.pirates.adventure.model;

public class Captain {
    int yearsAtSea;   // visibilité package
    // ...
}
```

```java
package com.pirates.adventure.model;

public class Ship {
    public int captainExperience() {
        return captain.yearsAtSea;   // accepté : même package
    }
}
```

```java
package com.pirates.adventure;

public class Main {
    public static void main(String[] args) {
        Captain c = new Captain("Anne", 3);
        System.out.println(c.yearsAtSea);   // refusé
    }
}
```

```
error: yearsAtSea is not public in Captain; cannot be accessed from outside package
```

À utiliser avec précaution : donner accès aux attributs à tout le package affaiblit l'encapsulation, car les autres classes dépendent de la structure interne. Par défaut, garde `private` et passe par des accesseurs. La visibilité package sert aux classes d'un même package qui collaborent très étroitement.

### Organiser les dépendances

Évite les **dépendances circulaires** entre packages (A importe B et B importe A). Un type utilisé par une classe se place idéalement dans le même package qu'elle, ou dans un package « plus bas ». C'est pourquoi l'enum de la section suivante se place dans `model`, à côté de `Ship`.

Enfin, on nomme les packages d'après leur **rôle** (`model`, `service`, `util`, `db`...) plutôt qu'avec un nom générique comme `classes`.

## Le type `enum`

### Le problème : des valeurs libres

Imagine que le type du navire soit une `String` :

```java
Ship ship = new Ship("Sea Wolf", "sloop", anne);
Ship oops = new Ship("Sea Wolf", "sloup", anne);   // faute de frappe : compile, valeur invalide
```

Des constantes `public static final String SLOOP = "sloop";` réduisent les fautes, mais rien n'empêche de passer une autre chaîne : le compilateur ne peut rien vérifier.

### Définition

Un **enum** (type énuméré) définit un ensemble **fini et fixé à la compilation** de valeurs nommées. Le compilateur n'accepte que ces valeurs.

```java
package com.pirates.adventure.model;

public enum ShipType {
    SLOOP, GALLEON
}
```

Dans IntelliJ : clic droit sur le package, puis *New*, *Java Class*, et choisir *Enum*.

Propriétés :

* Chaque valeur est une **constante** `public static final` du type enum. C'est une **instance unique**, créée une seule fois au chargement de l'enum. On y accède par `ShipType.SLOOP`.
* On ne peut pas créer d'autres valeurs : `new ShipType()` donne `enum classes may not be instantiated`.
* Le **type** s'écrit en `PascalCase`, les **constantes** en `UPPER_SNAKE_CASE`.
* Comme il n'y a qu'une instance par constante, `==` suffit pour comparer deux valeurs (`equals` fonctionne aussi).

### Utilisation

```java
public class Ship {
    private final String name;
    private final ShipType type;
    // ...

    public Ship(String name, ShipType type, Captain captain) {
        this.name = name;
        this.type = type;
        // ...
    }
}
```

```java
new Ship("Sea Wolf", ShipType.SLOOP, anne);   // accepté
new Ship("Sea Wolf", "sloop", anne);          // incompatible types: String cannot be converted to ShipType
new Ship("Sea Wolf", null, anne);             // compile : un enum est un type objet, donc il peut valoir null
```

Seul le premier appel est valide, et il est vérifié **à la compilation** : plus de faute de frappe possible. Le dernier rappelle que les précautions sur `null` vues plus haut s'appliquent aussi aux enum (`Objects.requireNonNull` dans le constructeur règle le problème).

### Méthodes fournies automatiquement

```java
ShipType t = ShipType.GALLEON;

t.name();                       // "GALLEON" : l'identifiant de la constante
t.ordinal();                    // 1 : sa position dans la déclaration (départ à 0)
ShipType.values();              // tableau de toutes les constantes
ShipType.valueOf("SLOOP");      // String -> constante
```

`valueOf` lève une `IllegalArgumentException` si le nom n'existe pas, et il est sensible à la casse : `ShipType.valueOf("Sloop")` échoue avec `No enum constant com.pirates.adventure.model.ShipType.Sloop`.

`ordinal()` change si on réordonne les constantes : ne t'en sers pas pour de la logique métier.

Parcourir toutes les valeurs :

```java
for (ShipType type : ShipType.values()) {
    System.out.println(type);   // affiche SLOOP, puis GALLEON
}
```

### Enum et `switch`

L'enum s'utilise très bien avec `switch`. Les `case` portent le nom de la constante, **sans** le préfixe du type :

```java
switch (ship.getType()) {
    case SLOOP -> System.out.println("Rapide et maniable");
    case GALLEON -> System.out.println("Lent, mais puissant");
}
```

Deux détails :

* si `getType()` retourne `null`, le `switch` lève une `NullPointerException` ;
* un `switch` utilisé comme **expression** (qui retourne une valeur) doit couvrir **toutes** les constantes, sinon : `the switch expression does not cover all possible input values`. Cela signifie qu'ajouter une constante à l'enum fait apparaître, à la compilation, tous les `switch` à compléter. C'est un gros avantage.

```java
int bonus = switch (ship.getType()) {
    case SLOOP -> 1;
    case GALLEON -> 3;
};
```

### Enum avec attributs, constructeur et méthodes

Un enum est une classe particulière : il peut avoir des attributs, un constructeur et des méthodes. Chaque constante est créée en appelant le constructeur, avec ses arguments entre parenthèses.

C'est exactement ce qu'il nous faut : un sloop et un galion n'ont ni la même coque, ni la même puissance de feu.

```java
package com.pirates.adventure.model;

public enum ShipType {
    SLOOP("Sloop", 20, 3),
    GALLEON("Galleon", 35, 5);   // constantes d'abord, puis « ; »

    private final String label;
    private final int maxHull;
    private final int firepower;

    ShipType(String label, int maxHull, int firepower) {   // implicitement private
        this.label = label;
        this.maxHull = maxHull;
        this.firepower = firepower;
    }

    public String getLabel() { return label; }
    public int getMaxHull() { return maxHull; }
    public int getFirepower() { return firepower; }
}
```

Règles :

* les **constantes sont déclarées en premier**, séparées par des virgules. Le `;` final est obligatoire dès qu'il y a des membres après elles (sans lui : `',', '}', or ';' expected`) ;
* le **constructeur est implicitement `private`** : écrire `public` donne `modifier public not allowed here`. Seules les constantes de l'enum sont créées, et c'est à l'intérieur de l'enum ;
* les attributs sont en général `final` : une valeur d'enum doit rester constante. On fournit des getters, pas de setters ;
* un enum peut implémenter des interfaces, mais ne peut pas hériter d'une autre classe.

Le nom de l'attribut est `label` et non `name`, car `name()` existe déjà et retourne l'identifiant de la constante : un champ `name` prêterait à confusion.

```java
ShipType.GALLEON.name();       // "GALLEON"
ShipType.GALLEON.getLabel();   // "Galleon"
System.out.println(ShipType.GALLEON);   // "GALLEON" : toString() retourne name() par défaut
```

Le constructeur de `Ship` peut maintenant en tirer parti, sans que l'appelant ait à fournir la coque :

```java
public Ship(String name, ShipType type, Captain captain) {
    this.name = Objects.requireNonNull(name, "name must not be null");
    this.type = Objects.requireNonNull(type, "type must not be null");
    this.captain = Objects.requireNonNull(captain, "captain must not be null");
    this.hull = type.getMaxHull();
}
```

### Quand utiliser un enum ?

Quand l'ensemble des valeurs est **connu à l'avance et stable** : types de navires, directions (`NORTH`, `SOUTH`, `EAST`, `WEST`), jours de la semaine, statuts d'une commande. Quand les valeurs évoluent à l'exécution (une liste lue dans une base de données, par exemple), on utilise plutôt une classe.

## Exemple complet

Voici `Ship` et `Captain` au terme de ce chapitre.

`model/Captain.java`

```java
package com.pirates.adventure.model;

public class Captain {
    private final String name;
    private final int yearsAtSea;
    private final Parrot parrot;   // facultatif

    public Captain(String name, int yearsAtSea, Parrot parrot) {
        this.name = name;
        this.yearsAtSea = yearsAtSea;
        this.parrot = parrot;
    }

    public Captain(String name, int yearsAtSea) {
        this(name, yearsAtSea, null);
    }

    public String getName() { return name; }

    public String describe() {
        String text = "Capitaine " + name + ", " + yearsAtSea + " ans de mer";
        if (parrot != null) {
            text += ", accompagné de " + parrot.getName();
        }
        return text;
    }
}
```

`model/Ship.java`

```java
package com.pirates.adventure.model;

import java.util.Objects;

public class Ship {
    private final String name;
    private final ShipType type;
    private final Captain captain;               // agrégation : fourni de l'extérieur
    private final Cargo cargo = new Cargo();     // composition : créé par le navire
    private int hull;

    public Ship(String name, ShipType type, Captain captain) {
        this.name = Objects.requireNonNull(name, "name must not be null");
        this.type = Objects.requireNonNull(type, "type must not be null");
        this.captain = Objects.requireNonNull(captain, "captain must not be null");
        this.hull = type.getMaxHull();
    }

    public void load(int barrels) {
        cargo.addBarrels(barrels);
    }

    public String describe() {
        return name + " (" + type.getLabel() + ", coque " + hull + "/" + type.getMaxHull() + ")\n"
             + "  " + captain.describe() + "\n"
             + "  Cale : " + cargo.describe();
    }
}
```

`Main.java`

```java
package com.pirates.adventure;

import com.pirates.adventure.model.Captain;
import com.pirates.adventure.model.Parrot;
import com.pirates.adventure.model.Ship;
import com.pirates.adventure.model.ShipType;

public class Main {
    public static void main(String[] args) {
        Captain flint = new Captain("Flint", 20, new Parrot("Polly"));
        Ship blackPearl = new Ship("Black Pearl", ShipType.GALLEON, flint);
        blackPearl.load(12);
        System.out.println(blackPearl.describe());
    }
}
```

Résultat :

```
Black Pearl (Galleon, coque 35/35)
  Capitaine Flint, 20 ans de mer, accompagné de Polly
  Cale : 12 tonneaux, 0 pièces d'or
```

Ce programme montre les trois notions : un `Ship` **a un** `Captain` et une `Cargo` (composition), les classes sont rangées dans le package `model` (packages), et le type de navire est un `ShipType` (enum).

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Utiliser un objet qui vaut `null` | `NullPointerException: Cannot invoke ... because ... is null` | Tester `null`, ou le refuser dès la construction. |
| Deux objets partagent sans le vouloir le même composant | une modification chez l'un apparaît chez l'autre | L'argument est une référence : pas de copie. |
| Oublier l'import | `cannot find symbol` | Ajouter l'import (proposé par l'IDE). |
| `import java.util.*` et `import java.sql.*` | `reference to Date is ambiguous` | Importer la classe voulue explicitement. |
| Utiliser une classe du package par défaut depuis un package nommé | `cannot find symbol` | Mettre toutes les classes dans un package. |
| Lancer `java Main` alors que `Main` est dans un package | `Could not find or load main class Main` | Donner le nom complet : `com.pirates.adventure.Main`. |
| Accéder à un membre sans modificateur depuis un autre package | `... is not public in Captain; cannot be accessed from outside package` | Ajouter un accesseur, ou garder le code dans le même package. |
| Créer une valeur d'enum avec `new` | `enum classes may not be instantiated` | Les valeurs sont les constantes déclarées. |
| `public` devant un constructeur d'enum | `modifier public not allowed here` | Le constructeur d'un enum est implicitement `private`. |
| Oublier le `;` après les constantes | `',', '}', or ';' expected` | Obligatoire dès qu'il y a des membres. |
| `switch` expression qui oublie une constante | `the switch expression does not cover all possible input values` | Couvrir toutes les constantes. |
| `valueOf` avec un nom inexistant ou mal casé | `IllegalArgumentException: No enum constant ...` | Respecter exactement le nom de la constante. |
| Se servir de `ordinal()` pour la logique métier | pas d'erreur, mais fragile | Utiliser un attribut dédié. |

## À retenir

* La **composition** donne à une classe un attribut dont le type est une autre classe : relation « a un ». L'héritage exprime « est un ».
* Un objet passé à un constructeur n'est **pas copié** : plusieurs objets peuvent partager le même.
* Une référence peut valoir `null`. Pour une partie **facultative**, on teste ; pour une partie **obligatoire**, on refuse `null` dès la construction avec `Objects.requireNonNull`.
* Une `NullPointerException` se lit : ce qui a échoué, ce qui valait `null`, la pile d'appels.
* Un **package** regroupe des classes, correspond à un dossier, et se nomme en minuscules (domaine inversé). Le nom complet est « package + classe ». Les classes d'un vrai projet sont toujours dans un package nommé.
* On **importe** les classes d'un autre package ; `java.lang` et le même package n'ont pas besoin d'import.
* Quatre visibilités : `private`, package (aucun modificateur), `protected`, `public`. Par défaut, on garde `private`.
* Un **enum** définit un ensemble fini de constantes vérifié à la compilation. Il peut avoir des attributs, un constructeur (`private`) et des méthodes. `switch` sur un enum fait vérifier l'exhaustivité au compilateur.

## À toi de jouer

1. Écris une classe `Parrot` (nom, mot préféré) et ajoute un perroquet **facultatif** à `Captain`. Écris `describe()` pour qu'il ne plante jamais, avec ou sans perroquet.
2. Reproduis volontairement la `NullPointerException` d'un capitaine sans perroquet qui appelle `getParrot().getName()`. Lis le message, puis corrige.
3. Écris une classe `Cargo` (tonneaux, or) créée par `Ship` lui-même (`new Cargo()` dans l'attribut), avec les méthodes `load`, `addGold` et `describe`. Pourquoi ne pas ajouter un `getCargo()` ?
4. Pourquoi est-il dangereux de passer le même `Captain` à deux `Ship` ? Écris un test qui le prouve, puis imagine comment l'empêcher (indice : un attribut `ship` dans `Captain`, ou un contrôle dans une autre classe).
5. Range tes classes dans les packages `com.pirates.adventure` (`Main`) et `com.pirates.adventure.model` (le reste). Corrige les imports. Lance le programme depuis IntelliJ, puis en ligne de commande avec `java -cp`.
6. Mets un attribut de `Captain` en visibilité package, utilise-le depuis `Ship`, puis depuis `Main`. Lis l'erreur obtenue. Remets-le en `private` avec un accesseur.
7. Crée un enum `Direction` (`NORTH`, `SOUTH`, `EAST`, `WEST`) avec, pour chacun, un déplacement en ligne et en colonne (`rowDelta`, `colDelta`). Reprends ton exercice de la carte (chapitre 5) : remplace les `if` sur les lettres saisies par un `switch` sur la direction.
8. Écris une méthode `static Direction parse(String text)` qui transforme `"N"`, `"S"`, `"E"`, `"O"` en constante, et retourne `null` si le texte est invalide. Que se passe-t-il avec `Direction.valueOf("north")` ?
9. Ajoute une constante `GHOST_SHIP` à `ShipType` et compile : que signalent les `switch` qui n'ont pas été mis à jour ?
10. Cherche le code source de la classe `java.lang.Enum` (ou la documentation de l'API) et repère les méthodes `name`, `ordinal`, `compareTo`. Que renvoie `ShipType.GALLEON.compareTo(ShipType.SLOOP)` ?

**Solution de l'exercice 10 :** `1`. `compareTo` compare les positions (`ordinal`) : `GALLEON` est en position 1, `SLOOP` en position 0.

## Pour aller plus loin

* [Dev.java : les packages](https://dev.java/learn/packages/).
* [Dev.java : les enum](https://dev.java/learn/classes-objects/enums/).
* [API Java SE 21 : `java.util.Objects`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html).
* [JetBrains : imports automatiques dans IntelliJ IDEA](https://www.jetbrains.com/help/idea/creating-and-optimizing-imports.html).
* [JEP 358 : messages détaillés des `NullPointerException`](https://openjdk.org/jeps/358).
