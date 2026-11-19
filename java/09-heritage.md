# L'héritage

Au chapitre précédent, un `Ship` portait un type (`SLOOP` ou `GALLEON`) sous forme d'enum. Cela suffit tant que les types ne diffèrent que par un **nom** et quelques valeurs fixes. Mais un sloop a une vitesse qui lui permet de fuir, un galion a une cale plus grande : ces deux navires n'ont pas la **même structure**, ni les mêmes comportements. Un enum ne sait pas porter cela.

L'**héritage** permet de créer de nouveaux types à partir d'un type existant, sans recopier ce qu'ils ont en commun. Ce chapitre présente aussi la visibilité `protected` et la **redéfinition** de méthodes.

## Objectifs

À la fin du chapitre, tu sauras :

* créer une classe fille avec `extends` et dire ce qu'elle hérite ;
* écrire les constructeurs d'une classe fille avec `super(...)` ;
* choisir entre `private`, `protected` et `public` pour un membre destiné à être hérité ;
* redéfinir une méthode avec `@Override` et appeler la version de la mère avec `super` ;
* choisir entre héritage et composition.

## Le principe d'héritage

### Le problème : la duplication

Reprenons une classe `Ship`, simplifiée (on retire l'enum, l'attribut et le getter) :

```java
public class Ship {
    private final String name;
    private int hull;
    private final int maxHull;
    private final int firepower;

    public Ship(String name, int maxHull, int firepower) {
        this.name = name;
        this.maxHull = maxHull;
        this.hull = maxHull;
        this.firepower = firepower;
    }

    public String getName() { return name; }
    public int getHull() { return hull; }
    public int getMaxHull() { return maxHull; }
    public int getFirepower() { return firepower; }

    public int computeDamage(int diceRoll) {
        return Math.max(0, firepower + diceRoll - 4);
    }

    public void takeDamage(int damage) {
        hull = Math.max(0, hull - damage);
    }
}
```

On veut maintenant un `Sloop`, avec une vitesse. Sans héritage, on écrirait une seconde classe indépendante :

```java
public class Sloop {
    private final String name;        // dupliqué depuis Ship
    private int hull;                 // dupliqué
    private final int maxHull;        // dupliqué
    private final int firepower;      // dupliqué
    private final int speed;

    // + tous les getters, computeDamage, takeDamage... dupliqués
}
```

Le nom, la coque, la puissance de feu, les getters, les calculs : tout est recopié. Il faudrait recommencer pour `Galleon`. Et la moindre correction (la formule des dégâts, par exemple) devrait être refaite dans chaque classe.

### L'héritage par extension

L'**héritage** consiste à créer une classe à partir d'une classe existante, dont elle reprend la structure et le comportement. Il se déclare avec le mot-clé `extends` :

```java
public class Sloop extends Ship {
    private final int speed;
    // ...
}
```

Un `Sloop` **est un** `Ship` : c'est la relation « **est un** » (*is-a*), à ne pas confondre avec la relation « **a un** » de la composition.

Vocabulaire :

* **classe mère** (ou parent, *superclass*) : `Ship` ;
* **classe fille** (*subclass*) : `Sloop`, qui **étend** `Ship`.

En lisant `class Sloop extends Ship`, on comprend que `Sloop` contient tout ce que contient `Ship`, **plus** sa vitesse. On supprime donc de `Sloop` le nom, la coque, etc. : ils sont déjà dans la mère.

### Ce que la fille hérite

* **La structure** : les attributs de la mère. Un objet `Sloop` contient `name`, `hull`, `maxHull`, `firepower` **et** `speed`.
* **Le comportement** : les méthodes de la mère. Un `Sloop` peut appeler `getName()`, `computeDamage(...)`, `takeDamage(...)`.

Tout ce que sait faire la mère, la fille sait le faire aussi. La fille peut en plus avoir ses **propres** attributs et méthodes, que la mère ne connaît pas :

```java
Ship ship = new Ship("Vieux Rafiot", 10, 2);
Sloop sloop = new Sloop("Sea Wolf");

sloop.computeDamage(6);   // héritée de Ship
sloop.getSpeed();         // propre à Sloop
ship.getSpeed();          // error: cannot find symbol : Ship ne connaît pas getSpeed()
```

La fille est plus **spécialisée** : elle contient plus d'informations qu'un `Ship` (un objet `Sloop` occupe donc un peu plus de mémoire). Chaque comportement commun n'est défini qu'à **un seul endroit**.

### Héritage simple

* Une classe mère peut avoir **plusieurs** filles : `Sloop` et `Galleon` étendent toutes deux `Ship`.
* Une classe fille n'a **qu'une seule** mère : on ne peut pas étendre deux classes. C'est l'héritage **simple**.
* Une classe qui n'étend rien étend implicitement la classe **`Object`**. C'est pourquoi tout objet dispose de méthodes comme `toString()` ou `equals()`.

Une classe peut hériter d'une mère qui hérite elle-même d'une autre : on parle de **hiérarchie**. Toutes les classes remontent à `Object`.

### Visibilité et héritage

Un attribut `private` de la mère existe bien dans l'objet fille, mais le code de la **fille ne peut pas y accéder directement** :

```java
public class Sloop extends Ship {
    public void display() {
        System.out.println(name);        // error: name has private access in Ship
        System.out.println(getName());   // accepté : accesseur public hérité
    }
}
```

La fille passe par les méthodes publiques de la mère, ce qui préserve l'encapsulation. Un niveau intermédiaire, `protected`, existe : voir plus bas.

## Les constructeurs et `super`

Les constructeurs ne sont **pas hérités** : chaque classe définit les siens. Mais pour construire un objet fille, il faut d'abord construire sa **partie mère**. Le constructeur de la fille appelle donc un constructeur de la mère avec le mot-clé **`super`**.

### Première tentative : initialiser l'attribut hérité

```java
public class Sloop extends Ship {
    private final int speed;

    public Sloop(String name) {
        this.name = name;   // error: name has private access in Ship
        // ...
    }
}
```

Cela ne compilerait que si `name` devenait `public` ou `protected`, et on dupliquerait ce que fait déjà le constructeur de `Ship`.

### La solution : `super(...)`

```java
public class Sloop extends Ship {
    private final int speed;

    public Sloop(String name) {
        super(name, 10, 3);   // construit d'abord la partie Ship
        this.speed = 4;
    }

    public int getSpeed() { return speed; }

    public boolean canFlee(int diceRoll) {
        return diceRoll <= speed;
    }
}
```

```java
public class Galleon extends Ship {
    private final int holdSlots;

    public Galleon(String name) {
        super(name, 18, 5);
        this.holdSlots = 4;
    }

    public int getHoldSlots() { return holdSlots; }
}
```

Les arguments de `super(...)` déterminent **quel constructeur** de la mère est appelé (comme pour une surcharge). Le sloop impose lui-même sa coque (10) et sa puissance de feu (3) : l'appelant n'a plus qu'à donner un nom. Les attributs de `Ship` restent `private` : seul le constructeur de la mère y touche.

### Règles sur `super(...)`

* Il ne peut apparaître **qu'une fois**, et il est la **première instruction** du constructeur. Sinon : `call to super must be first statement in constructor`.
* Il ne se combine pas avec `this(...)` dans un même constructeur (les deux veulent être la première instruction).
* Si tu n'écris **aucun** appel, le compilateur ajoute **implicitement** `super();`, c'est-à-dire l'appel au constructeur **sans paramètre** de la mère.

> Les versions récentes de Java assouplissent la règle de la première instruction (JEP 513, finalisé dans Java 25) : on peut écrire certaines instructions avant `super(...)`, par exemple pour valider un paramètre, à condition de ne pas utiliser l'objet en cours de construction. Le constructeur de la mère reste obligatoire, et la mère est toujours construite avant la fin du constructeur de la fille. Avec JDK 21, la règle de la première instruction s'applique.

### Quand l'appel implicite ne compile pas

L'appel implicite `super()` suppose que la mère possède un constructeur **sans paramètre** (écrit par toi, ou constructeur par défaut généré par le compilateur).

| Constructeurs de la mère | Constructeur de la fille |
| --- | --- |
| Un constructeur sans paramètre | `super()` est ajouté implicitement : rien à écrire |
| **Uniquement** des constructeurs avec paramètres | La fille **doit** appeler explicitement l'un d'eux avec `super(...)` |

Ici, `Ship` n'a qu'un constructeur à trois paramètres : toute fille doit l'appeler, **même si elle n'écrit aucun constructeur** :

```java
public class Frigate extends Ship {
    // aucun constructeur écrit : le compilateur ajoute un constructeur par défaut qui appelle super()
}
```

```
error: constructor Ship in class Ship cannot be applied to given types;
  required: String,int,int
  found:    no arguments
```

Le message surprend, car il pointe vers la classe fille sans constructeur : c'est bien le constructeur invisible, généré par le compilateur, qui échoue. La solution : écrire un constructeur dans la fille qui transmet les informations à `super(...)`. IntelliJ peut le générer : menu *Code*, *Generate*, *Constructor* (raccourci `Alt + Insert`).

### L'ordre de construction

La mère est toujours construite **avant** la fille. Avec un `println` dans chaque constructeur :

```java
new Sloop("Sea Wolf");
// Constructeur Ship     (la mère d'abord)
// Constructeur Sloop    (puis la fille)
```

**Piège :** n'appelle jamais, depuis le constructeur de la mère, une méthode que la fille peut redéfinir (voir plus bas). Au moment de l'appel, la partie fille n'est pas encore initialisée :

```java
class Base {
    Base() { describe(); }                         // appelle une méthode redéfinissable
    void describe() { System.out.println("base"); }
}

class Child extends Base {
    private String label = "ready";
    @Override
    void describe() { System.out.println("label = " + label); }
}

new Child();   // affiche : label = null
```

La méthode de `Child` s'exécute avant que `label` soit initialisé : elle voit `null`.

## Utilisation

```java
Sloop seaWolf = new Sloop("Sea Wolf");
Galleon blackPearl = new Galleon("Black Pearl");

seaWolf.takeDamage(4);                          // héritée
System.out.println(seaWolf.getHull());          // 6 (héritée)
System.out.println(seaWolf.canFlee(4));         // true (propre à Sloop)
System.out.println(blackPearl.getHoldSlots());  // 4 (propre à Galleon)
System.out.println(blackPearl.computeDamage(6));// 7 (héritée)
```

Chaque fille a reçu la structure et le comportement de `Ship`, avec ses propres ajouts.

Puisqu'un `Sloop` **est un** `Ship`, on peut le ranger dans une variable de type `Ship` : c'est le **polymorphisme**, que tu verras au chapitre suivant.

## Héritage ou composition ?

* **Héritage** : relation « **est un** ». Un galion est un navire. La fille est un cas particulier de la mère et en reprend tout le comportement.
* **Composition** : relation « **a un** ». Un navire a un capitaine. L'objet en contient un autre.

On n'utilise pas l'héritage uniquement pour **réutiliser du code**. Si la phrase « X est un Y » n'a pas de sens (un `Captain` n'est pas un `Ship`), on choisit la composition. Dans le doute, la composition est souvent le meilleur choix, car elle couple moins les classes : toute modification de la mère se répercute sur toutes ses filles.

L'enum reste adapté quand les types ne diffèrent que par un nom ou quelques valeurs fixes. L'héritage convient quand leur **structure** ou leur **comportement** diffèrent.

## La visibilité `protected`

### L'héritage ne casse pas l'encapsulation

Un attribut `private` de la mère fait partie de la **structure** de la fille, mais il n'est manipulable que **dans la classe qui le définit**. La mère décide de ce qu'elle autorise, et `private` n'autorise pas la fille.

### Les deux extrêmes

* **`private`** : la fille hérite de l'attribut mais ne peut pas le manipuler directement.
* **`public`** : la fille peut le lire et le modifier, mais **tout le reste du code** aussi. N'importe qui pourrait écrire `ship.hull = 9999`, sans aucun contrôle.

`public` est trop permissif : on voudrait ouvrir l'accès à la fille, sans l'ouvrir à tout le monde.

### Les méthodes suivent la même logique

* Une méthode `public` de la mère est héritée : on l'appelle de l'extérieur, mais aussi **dans le corps de la fille** (c'est `this` qui se cache devant l'appel).
* Une méthode `private` de la mère n'est pas utilisable par la fille.

```java
public class Sloop extends Ship {
    public String status() {
        return getName() + " : " + getHull() + "/" + getMaxHull();   // méthodes héritées
    }
}
```

### Le mot-clé `protected`

Entre `private` et `public`, il existe une visibilité faite pour l'héritage : **`protected`**. Un membre (attribut, méthode ou constructeur) `protected` est **accessible aux classes filles**, comme s'il était public pour elles, mais **pas au reste du code**.

```java
public class Ship {
    protected int hull;   // accessible dans Ship et dans ses filles
    // ...
    protected void clampHull() {
        hull = Math.max(0, Math.min(hull, getMaxHull()));
    }
}
```

```java
public class Sloop extends Ship {
    public void emergencyRepair() {
        hull = getMaxHull();   // lecture et écriture autorisées
        clampHull();
    }
}
```

Depuis du code extérieur (par exemple `main`, dans un autre package), le membre reste inaccessible :

```java
Ship ship = new Ship("Sea Wolf", 10, 3);
ship.hull = 5;          // error: hull has protected access in Ship
ship.clampHull();       // error: clampHull() has protected access in Ship
```

C'est la **classe mère** qui choisit d'ouvrir un membre à ses futures filles. L'héritage va dans un seul sens : **la fille connaît sa mère, la mère ne connaît pas ses filles**. Déclarer un membre `protected`, c'est le prévoir pour des filles qu'elle ne connaît pas encore.

### Tableau récapitulatif

| Visibilité | Même classe | Même package | Classe fille (autre package) | Reste du code |
| --- | :---: | :---: | :---: | :---: |
| `private` | oui | non | non | non |
| *(rien)* : package | oui | oui | non | non |
| `protected` | oui | oui | oui | non |
| `public` | oui | oui | oui | oui |

**Attention :** `protected` donne **aussi** l'accès au **package**, comme l'absence de modificateur. Une classe du même package que la mère, même sans lien d'héritage, accède donc à un membre `protected`. Le mot-clé est surtout utile quand on hérite d'une classe située dans **un autre package**.

**Complément :** dans une classe fille située dans un **autre package**, un membre `protected` est accessible sur `this` ou sur une référence du type de la fille, mais **pas** sur une simple référence de type `Ship` :

```java
// dans une classe Other extends Ship, située dans un autre package :
firepower = 4;            // accepté
this.firepower = 5;       // accepté
other.firepower = 6;      // accepté si other est de type Other
ship.firepower = 7;       // error: firepower has protected access in Ship  (ship est de type Ship)
```

### Que choisir ?

Le principe d'encapsulation conseille de **commencer fermé** :

1. **Par défaut, `private`** pour les attributs, avec des getters (et éventuellement des setters). La fille accède à sa structure **par les méthodes**, sans pouvoir en faire n'importe quoi.
2. **`protected`** seulement quand la mère veut explicitement laisser ses filles manipuler un membre.

Avec `protected` sur un attribut, la personne qui écrit la fille peut y mettre n'importe quoi. Le **contrôle des valeurs** reste alors à la charge de la mère : si une fille met `hull = 999`, plus rien n'empêche une coque supérieure à la coque maximale. C'est le rôle de `clampHull()` ci-dessus : une méthode `protected` qui **remet l'état en cohérence**. Préfère souvent un attribut `private` accompagné d'une méthode `protected` qui contrôle les modifications.

## La redéfinition de méthodes : `@Override`

### Rappel : la surcharge

La **surcharge** (*overload*) consiste à définir plusieurs méthodes de **même nom** mais de **paramètres différents**. Elle fonctionne aussi entre mère et fille :

```java
public class Ship {
    public void method(int a) {
        System.out.println("méthode de Ship");
    }
}

public class Sloop extends Ship {
    public void method(int a, int b) {   // même nom, paramètres différents
        System.out.println("méthode de Sloop");
    }
}
```

```java
sloop.method(1);      // "méthode de Ship" (héritée)
sloop.method(1, 2);   // "méthode de Sloop"
ship.method(1, 2);    // error: Ship ne connaît pas cette version
```

`Sloop` possède **deux** méthodes : celle qu'elle hérite et celle qu'elle définit. Les paramètres de l'appel déterminent laquelle est utilisée.

### La redéfinition

Si la fille déclare une méthode avec le **même nom et exactement les mêmes paramètres** que la mère, on ne surcharge plus : on **redéfinit** (*override*) la méthode.

```java
public class Sloop extends Ship {
    @Override
    public void method(int a) {
        System.out.println("méthode de Sloop");
    }
}
```

```java
ship.method(1);    // "méthode de Ship"
sloop.method(1);   // "méthode de Sloop"
```

`Sloop` n'a plus qu'**une seule** méthode `method(int)` : la sienne, qui remplace celle de la mère pour les objets de type `Sloop`.

| | Surcharge (*overload*) | Redéfinition (*override*) |
| --- | --- | --- |
| Nom | identique | identique |
| Paramètres | **différents** | **identiques** |
| Où | même classe, ou mère et fille | classe fille uniquement |
| Résultat | plusieurs méthodes disponibles | la méthode de la fille remplace celle de la mère |

### L'annotation `@Override`

On place `@Override` juste au-dessus de la méthode redéfinie. Elle n'est **pas obligatoire**, mais elle est précieuse :

* **Vérification par le compilateur** : si la mère n'a aucune méthode de cette signature exacte (faute de frappe, paramètre ajouté ou modifié), le code **ne compile pas** :

  ```
  error: method does not override or implement a method from a supertype
  ```

* **Protection lors des modifications** : si on change une méthode de la mère, les filles annotées ne compilent plus, ce qui oblige à les mettre à jour. Sans l'annotation, la fille définirait silencieusement une **nouvelle** méthode et ne redéfinirait plus rien, sans aucune erreur.
* **Lisibilité** : on voit tout de suite quelles méthodes redéfinissent celles de la mère, et lesquelles sont propres à la fille.

Prends l'habitude de l'écrire **systématiquement**. C'est aussi le cas pour `toString()`, vue au chapitre 7 : elle redéfinit celle d'`Object`.

### Exemple : `display()` et `super`

Ajoutons dans `Ship` une méthode d'affichage :

```java
public void display() {
    System.out.println(name + " : coque " + hull + "/" + maxHull + ", puissance de feu " + firepower);
}
```

Elle est héritée par `Sloop`. Mais un sloop a aussi une vitesse : on redéfinit `display()` dans la fille.

```java
public class Sloop extends Ship {
    @Override
    public void display() {
        System.out.println("Vitesse : " + speed);
    }
}
```

Problème : `sloop.display()` n'affiche plus le nom ni la coque. On voudrait afficher **tout ce qu'est un sloop**, donc réutiliser le `display()` de la mère. Mais écrire `display()` dans la fille appelle... la méthode de la fille elle-même :

```java
@Override
public void display() {
    display();   // équivaut à this.display() : appel récursif infini
    System.out.println("Vitesse : " + speed);
}
```

Sans préfixe, il y a implicitement `this`. La méthode s'appelle indéfiniment, jusqu'à une erreur à l'exécution : **`StackOverflowError`** (la JVM a empilé trop d'appels). Pour appeler la version de la **mère**, on utilise **`super`** :

```java
@Override
public void display() {
    super.display();   // d'abord ce que faisait la mère
    System.out.println("  Vitesse : " + speed);
}
```

```java
sloop.display();
// Sea Wolf : coque 6/10, puissance de feu 3
//   Vitesse : 4
```

Même idée pour `toString()` :

```java
@Override
public String toString() {
    return "Sloop " + super.toString();
}
```

### `super.méthode()` : un choix, pas une obligation

Contrairement au constructeur, qui **doit** appeler celui de la mère, une méthode redéfinie n'est **pas obligée** d'appeler la version de la mère. Elle peut l'appeler zéro fois, une fois ou plusieurs, au début, au milieu ou à la fin : c'est la fille qui décide. Mais pour appeler la version de la mère, le préfixe `super.` est **indispensable**.

### Générer la redéfinition avec IntelliJ

Dans le corps de la fille, tape le début du nom d'une méthode de la mère : l'autocomplétion propose de la redéfinir, et valider ajoute `@Override` et l'appel à `super`. Le menu *Code*, *Generate* (`Alt + Insert`), puis *Override Methods...* liste les méthodes de la mère à redéfinir.

### Les méthodes `final` ne se redéfinissent pas

Une méthode `final` de la mère est héritée, mais la fille **ne peut pas la redéfinir** :

```java
public class Ship {
    public final void anchor() { /* ... */ }
}

public class Sloop extends Ship {
    @Override
    public void anchor() { }
}
```

```
error: anchor() in Sloop cannot override anchor() in Ship
  overridden method is final
```

C'est le moyen pour la mère d'imposer un comportement à toutes ses filles.

### Compléments

* La redéfinition ne peut pas **réduire la visibilité** : une méthode `public` de la mère reste `public` dans la fille (`error: attempting to assign weaker access privileges; was public`). Elle peut en revanche l'élargir (`protected` vers `public`).
* Le type de retour doit être identique, ou un **sous-type** : `Ship copy()` peut être redéfinie en `Sloop copy()`.
* Une méthode `private` n'est pas héritée, donc elle ne peut pas être redéfinie.
* Une méthode `static` ne se redéfinit pas : la fille qui en déclare une de même signature la **masque** (*hiding*), un mécanisme différent.
* Redéfinir `toString()` ou `equals()` est une redéfinition de méthode d'`Object` : `@Override` s'y applique.

## Exemple complet

`Ship.java`

```java
package com.pirates.adventure.model;

public class Ship {
    private final String name;
    protected int hull;
    private final int maxHull;
    private final int firepower;

    public Ship(String name, int maxHull, int firepower) {
        this.name = name;
        this.maxHull = maxHull;
        this.hull = maxHull;
        this.firepower = firepower;
    }

    public String getName() { return name; }
    public int getHull() { return hull; }
    public int getMaxHull() { return maxHull; }
    public int getFirepower() { return firepower; }

    public int computeDamage(int diceRoll) {
        return Math.max(0, firepower + diceRoll - 4);
    }

    public void takeDamage(int damage) {
        hull = Math.max(0, hull - damage);
    }

    public void display() {
        System.out.println(name + " : coque " + hull + "/" + maxHull + ", puissance de feu " + firepower);
    }

    @Override
    public String toString() {
        return name + " (" + hull + "/" + maxHull + ")";
    }
}
```

`Sloop.java`

```java
package com.pirates.adventure.model;

public class Sloop extends Ship {
    private final int speed;

    public Sloop(String name) {
        super(name, 10, 3);
        this.speed = 4;
    }

    public int getSpeed() { return speed; }

    public boolean canFlee(int diceRoll) {
        return diceRoll <= speed;
    }

    @Override
    public void display() {
        super.display();
        System.out.println("  Vitesse : " + speed);
    }

    @Override
    public String toString() {
        return "Sloop " + super.toString();
    }
}
```

`Main.java`

```java
Sloop seaWolf = new Sloop("Sea Wolf");
seaWolf.takeDamage(4);
seaWolf.display();
System.out.println(seaWolf);
```

```
Sea Wolf : coque 6/10, puissance de feu 3
  Vitesse : 4
Sloop Sea Wolf (6/10)
```

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Fille sans constructeur, mère sans constructeur sans paramètre | `constructor Ship in class Ship cannot be applied to given types` | Écrire un constructeur dans la fille qui appelle `super(...)`. |
| `super(...)` pas en première instruction | `call to super must be first statement in constructor` | Il doit être la première instruction (JDK 21). |
| Utiliser un attribut `private` de la mère | `name has private access in Ship` | Passer par un accesseur, ou le rendre `protected` en connaissance de cause. |
| Utiliser un membre `protected` depuis un autre package, hors héritage | `hull has protected access in Ship` | `protected` n'ouvre l'accès qu'aux filles (et au package). |
| `@Override` sur une méthode qui n'existe pas dans la mère | `method does not override or implement a method from a supertype` | Vérifier le nom et les paramètres. |
| Redéfinir en réduisant la visibilité | `attempting to assign weaker access privileges; was public` | Garder la même visibilité ou l'élargir. |
| Redéfinir une méthode `final` | `overridden method is final` | La mère l'interdit. |
| Appeler `display()` au lieu de `super.display()` dans `display()` | `StackOverflowError` à l'exécution | Utiliser le préfixe `super.`. |
| Oublier `@Override` et se tromper de paramètre | aucune erreur, mais ce n'est plus une redéfinition | Toujours écrire `@Override`. |
| Appeler une méthode redéfinissable dans le constructeur de la mère | valeurs `null` ou `0` dans la fille | La fille n'est pas encore initialisée. |
| Utiliser l'héritage sans relation « est un » | pas d'erreur, mais conception fragile | Préférer la composition. |

## À retenir

* `class Fille extends Mère` : la fille hérite de la **structure** (attributs) et du **comportement** (méthodes) de la mère, et peut y ajouter les siens.
* Héritage **simple** : une seule mère, mais plusieurs filles possibles. Toute classe étend implicitement `Object`.
* Un attribut `private` de la mère existe dans la fille, mais n'est accessible que par les méthodes de la mère.
* Les constructeurs ne sont pas hérités : la fille appelle celui de la mère avec `super(...)`, implicitement (`super()`) si on ne l'écrit pas. Si la mère n'a pas de constructeur sans paramètre, la fille **doit** l'écrire. La mère est construite **avant** la fille.
* `protected` ouvre l'accès aux filles (et au package), pas au reste du code. Par défaut, on garde `private` avec des accesseurs.
* **Redéfinition** : même nom, mêmes paramètres, dans la fille. On écrit toujours `@Override`.
* `super.méthode()` appelle la version de la mère. Sans `super.`, l'appel est récursif et finit en `StackOverflowError`.
* Une méthode `final` ne se redéfinit pas ; la visibilité ne peut pas être réduite.
* Héritage pour « est un », composition pour « a un ».

## À toi de jouer

1. Crée la classe `Galleon extends Ship` (coque 18, puissance de feu 5, 4 emplacements de cale). Instancie un `Sloop` et un `Galleon` et appelle sur chacun une méthode héritée et une méthode propre.
2. Ajoute un `println` dans chaque constructeur (`Ship`, `Sloop`) et affiche l'ordre de construction en créant un `Sloop`. Prévois le résultat avant d'exécuter.
3. Retire le constructeur de `Galleon` et lis l'erreur obtenue. Explique pourquoi elle apparaît alors que tu n'as rien écrit.
4. Crée une classe `Item` (nom) et deux filles, `Rations` (quantité) et `RepairKit` (points de réparation). Écris pour chacune une méthode `describe()` qui redéfinit celle de la mère et appelle `super.describe()`.
5. Dans quelle situation l'héritage est-il mal choisi ? Entre `Captain` et `Ship`, `Pirate` et `Captain` (un capitaine *est-il* un pirate ?), `Port` et `Ship` : dis pour chacun s'il faut hériter ou composer, et pourquoi.
6. Passe l'attribut `hull` de `Ship` en `protected`, modifie-le depuis `Sloop`, puis essaie depuis `Main` (dans un autre package). Lis les messages d'erreur. Remets-le en `private` et ajoute une méthode `protected void repair(int points)` qui ne dépasse jamais la coque maximale.
7. Redéfinis `toString()` dans `Sloop` en réutilisant celle de `Ship` avec `super.toString()`. Que se passe-t-il si tu enlèves `super.` ?
8. Écris volontairement `@Override public void dispaly()` (faute de frappe) dans une fille, puis sans l'annotation. Compare le comportement.
9. Dans la mère, déclare `public final void anchor()`. Essaie de la redéfinir. Puis essaie de redéfinir une méthode `public` avec une visibilité `protected`.
10. Reproduis le piège de la méthode redéfinie appelée dans le constructeur de la mère (classes `Base` et `Child` de ce chapitre). Que vaut `label` quand `describe()` s'exécute ? Pourquoi ?

**Indice de l'exercice 5 :** la question à se poser est « X *est-il* un Y dans tous les cas, pour toujours ? ». Un capitaine *a* un navire, mais un galion *est* un navire.

## Pour aller plus loin

* [Dev.java : qu'est-ce que l'héritage ?](https://dev.java/learn/language/oop/inheritance/what-is-inheritance/).
* [Dev.java : redéfinir et masquer des méthodes](https://dev.java/learn/inheritance/overriding/).
* [Spécification du langage Java : les classes, chapitre 8](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html) (la section 8.4.8 traite de l'héritage et de la redéfinition de méthodes, la section 8.8.7 des constructeurs et de `super(...)` ; pour les curieux).
* [OpenJDK : JEP 513, corps de constructeur flexibles](https://openjdk.org/jeps/513).
