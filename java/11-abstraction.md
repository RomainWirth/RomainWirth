# L'abstraction : classes abstraites et interfaces

La programmation orientée objet repose sur quatre principes : l'**encapsulation** (chapitre 7), l'**héritage** (chapitre 9), le **polymorphisme** (chapitre 10) et l'**abstraction**. Ce chapitre présente le quatrième, à travers deux mécanismes : les **classes abstraites** et les **interfaces**.

Le principe est de décrire **ce qu'un objet sait faire** sans dire **comment** il le fait. Le code qui l'utilise ne dépend que de ce contrat, pas des détails de chaque classe.

## Objectifs

À la fin du chapitre, tu sauras :

* déclarer une méthode abstraite et une classe abstraite, et expliquer pourquoi on ne peut pas l'instancier ;
* dire ce qu'une classe fille est obligée de faire ;
* déclarer une interface et l'implémenter avec `implements` ;
* choisir entre classe abstraite et interface, et les combiner ;
* utiliser un type abstrait pour écrire du code qui accepte des classes qui n'existent pas encore.

## La classe abstraite

### Le contexte : les ennemis du jeu

Dans le jeu, le joueur croise des navires ennemis : contrebandiers, frégates royales, et le Kraken. Ils ont une structure commune (un nom, une coque, une puissance de feu, une récompense), mais chacun a sa façon de provoquer le joueur. On écrit donc une classe mère `EnemyShip` et trois filles :

```java
public class EnemyShip {
    private final String name;
    private int hull;
    private final int firepower;
    private final int reward;

    public EnemyShip(String name, int hull, int firepower, int reward) {
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        this.reward = reward;
    }

    public String getName() { return name; }
    public int getHull() { return hull; }
    public int getFirepower() { return firepower; }
    public int getReward() { return reward; }

    public void takeDamage(int damage) {
        hull = Math.max(0, hull - damage);
    }
}
```

```java
public class Smuggler extends EnemyShip { /* ... */ }
public class RoyalFrigate extends EnemyShip { /* ... */ }
public class Kraken extends EnemyShip { /* ... */ }
```

Une classe `Encounter` représente la rencontre. Elle est composée d'un `EnemyShip` (chapitre 8) et, grâce au polymorphisme, un `Smuggler`, une `RoyalFrigate` ou le `Kraken` peut se cacher derrière :

```java
public class Encounter {
    private final EnemyShip enemy;

    public Encounter(EnemyShip enemy) {
        this.enemy = enemy;
    }

    public void announce() {
        System.out.println(enemy.getName() + " approche : " + /* la provocation de l'ennemi */);
    }
}
```

`Encounter` ne manipule qu'un `EnemyShip` : elle ne sait pas quelle fille se cache derrière. Il faut donc une méthode **dans `EnemyShip`** qui fournit la provocation.

### Première tentative : un corps « bidon »

On ajoute à `EnemyShip` une méthode `getTaunt()` :

```java
public class EnemyShip {
    // ...
    public String getTaunt() {
        return "???";   // que mettre ici ?
    }
}
```

Le problème est immédiat : il faut écrire un corps pour que le code compile, mais `EnemyShip` ne **sait pas quoi retourner**. Seule la fille sait si c'est un contrebandier qui supplie ou un Kraken qui rugit.

Le code compile et `Encounter` peut appeler `enemy.getTaunt()`. Mais à l'exécution :

* si une fille **ne redéfinit pas** la méthode, on obtient `???` ;
* rien n'**oblige** les filles à la redéfinir : le code compile avec ou sans redéfinition. Redéfinir ou non est leur responsabilité, et on oublie facilement.

### Le vrai problème

La mère **a** cette fonctionnalité (tout ennemi doit pouvoir provoquer), mais elle **ne sait pas l'implémenter**, car l'implémentation dépend de chaque fille. Il faudrait que la méthode soit :

* **présente** dans la mère, pour que `Encounter` puisse l'appeler ;
* **non implémentée** dans la mère ;
* **obligatoire** pour les filles.

### La méthode abstraite

On supprime le corps de la méthode et on le remplace par un point-virgule. Sans autre précaution, cela ne compile pas :

```java
public String getTaunt();   // error: missing method body, or declare abstract
```

Une méthode sans corps doit être déclarée **`abstract`** :

```java
public abstract String getTaunt();
```

Une méthode abstraite possède un **nom**, une **signature** (paramètres, type de retour) et une **visibilité**, mais **pas de corps** : on sait qu'elle existe et comment l'appeler, pas comment elle fait.

### La classe abstraite

Dès qu'une classe contient une méthode abstraite, la classe elle-même doit être déclarée `abstract`. Sinon le compilateur proteste :

```
error: EnemyShip is not abstract and does not override abstract method getTaunt() in EnemyShip
```

```java
public abstract class EnemyShip {
    // ...
    public abstract String getTaunt();
}
```

`EnemyShip` est maintenant une **classe abstraite**.

### On ne peut plus instancier

```java
EnemyShip enemy = new EnemyShip("Inconnu", 5, 2, 0);   // error: EnemyShip is abstract; cannot be instantiated
```

La raison est logique : si c'était possible, on pourrait appeler `enemy.getTaunt()`, une méthode qui n'a aucun code à exécuter.

### À quoi sert une classe abstraite ?

Une classe abstraite est faite pour **être héritée**. Elle constitue un **tronc commun** pour ses filles :

* des **attributs** (la structure) ;
* des **constructeurs**, que les filles appellent avec `super(...)` ;
* des **méthodes implémentées**, dont les filles héritent ;
* éventuellement des **méthodes abstraites** : un engagement imposé aux filles.

Une classe abstraite n'est donc **pas** une classe qui ne contient que des méthodes abstraites : elle peut en contenir **zéro, une ou plusieurs**. Inversement, une classe qui contient une méthode abstraite est **forcément** abstraite.

Comme on ne l'instancie jamais directement, son constructeur est généralement déclaré `protected` : seules les filles l'appellent, via `super(...)`.

### L'obligation pour les filles

Une fille d'une classe abstraite doit **redéfinir toutes ses méthodes abstraites**, sinon elle ne compile pas :

```java
public class Kraken extends EnemyShip {
    public Kraken() {
        super("Kraken", 25, 7, 0);
    }
    // error: Kraken is not abstract and does not override abstract method getTaunt() in EnemyShip
}
```

Chaque fille donne sa propre implémentation :

```java
public class Smuggler extends EnemyShip {
    public Smuggler(String name) {
        super(name, 6, 3, 10);
    }

    @Override
    public String getTaunt() {
        return "On n'a rien à déclarer, laissez-nous passer !";
    }
}

public class RoyalFrigate extends EnemyShip {
    public RoyalFrigate(String name) {
        super(name, 12, 5, 25);
    }

    @Override
    public String getTaunt() {
        return "Au nom du Roi, rendez-vous !";
    }
}

public class Kraken extends EnemyShip {
    public Kraken() {
        super("Kraken", 25, 7, 0);
    }

    @Override
    public String getTaunt() {
        return "Grouaaarh !";
    }
}
```

`@Override` est bien présent : la méthode existe dans la mère. En revanche, on **ne peut pas appeler `super.getTaunt()`** dans la fille : la méthode n'a pas d'implémentation dans la mère.

```
error: abstract method getTaunt() in EnemyShip cannot be accessed directly
```

Comparaison avec une méthode ordinaire redéfinie (comme `display()` au chapitre 9) :

| | Méthode implémentée | Méthode abstraite |
| --- | --- | --- |
| Corps dans la mère | oui | non |
| Redéfinition par la fille | **facultative** | **obligatoire** |
| `super.méthode()` dans la fille | possible | impossible |

La fille, elle, est une classe **instanciable** : `new Kraken()` fonctionne, et l'objet possède bien une méthode `getTaunt()` avec un corps à exécuter.

### Le polymorphisme continue de s'appliquer

On ne peut plus écrire `new EnemyShip(...)`, mais le **type** `EnemyShip` reste utilisable pour déclarer des variables, des attributs, des paramètres et des tableaux.

**Premier exemple : deux variables, un même appel.**

```java
EnemyShip enemy1 = new Smuggler("La Belle Combine");
EnemyShip enemy2 = new RoyalFrigate("HMS Victory");

System.out.println(enemy1.getTaunt());   // On n'a rien à déclarer, laissez-nous passer !
System.out.println(enemy2.getTaunt());   // Au nom du Roi, rendez-vous !
```

Les deux variables ont le **même type** et les deux lignes appellent la **même méthode**, pourtant le résultat diffère. En deux temps :

1. **À la compilation**, Java ne regarde que le **type de la variable** : `EnemyShip`. Il vérifie que cette classe possède bien une méthode `getTaunt()` : c'est le cas, l'appel est accepté.
2. **À l'exécution**, Java regarde l'**objet réellement présent en mémoire** et exécute la version de cet objet :

```
enemy1 (type EnemyShip) ──▶ [ objet Smuggler ]     ──▶ exécute getTaunt() écrite dans Smuggler
enemy2 (type EnemyShip) ──▶ [ objet RoyalFrigate ] ──▶ exécute getTaunt() écrite dans RoyalFrigate
```

**Pourquoi on ne risque jamais d'appeler une méthode sans corps.** Comme `EnemyShip` est abstraite, **aucun objet de ce type ne peut exister**. Derrière une variable de type `EnemyShip`, il y a toujours un objet d'une **fille concrète**, et cette fille a **l'obligation** d'avoir écrit le corps.

**Deuxième exemple : `Encounter` n'a pas besoin de savoir qui est l'ennemi.**

```java
public void announce() {
    System.out.println(enemy.getName() + " approche : " + enemy.getTaunt());
}
```

Le code de `announce()` est écrit **une seule fois**. Il ne mentionne ni `Smuggler`, ni `RoyalFrigate`, ni `Kraken` : il demande à l'ennemi sa provocation. La réponse dépend de l'objet donné à la construction.

```java
new Encounter(new Kraken()).announce();
// Kraken approche : Grouaaarh !

new Encounter(new Smuggler("La Belle Combine")).announce();
// La Belle Combine approche : On n'a rien à déclarer, laissez-nous passer !
```

Si on ajoute plus tard une nouvelle fille (un `GhostShip`), qui devra elle aussi écrire `getTaunt()`, la classe `Encounter` fonctionne **sans aucune modification**.

### L'idée d'abstraction

Une classe abstraite décrit **ce qu'un objet sait faire** (le contrat : nom et signature des méthodes) sans décider **comment** (l'implémentation, laissée aux filles). Le code qui utilise la mère dépend du contrat, pas des détails de chaque fille.

Compléments :

* une fille qui n'implémente pas toutes les méthodes abstraites de sa mère doit elle-même être déclarée `abstract` ;
* `abstract` est incompatible avec `private`, `final` et `static` pour une méthode, puisqu'une méthode abstraite doit pouvoir être redéfinie. Le compilateur répond `illegal combination of modifiers: abstract and private` (ou `final`, `static`).

### À retenir

* Une **méthode abstraite** a une signature mais **pas de corps** (un point-virgule à la place).
* Une classe qui contient une méthode abstraite doit être déclarée **`abstract`**. Une classe abstraite peut cependant n'en contenir aucune.
* On **ne peut pas instancier** une classe abstraite.
* Une classe abstraite contient des attributs, des constructeurs (appelés par `super(...)`) et des méthodes implémentées : c'est un **tronc commun**.
* Les filles **doivent** redéfinir toutes les méthodes abstraites (avec `@Override`) et ne peuvent pas appeler `super` dessus.
* Le type de la classe abstraite sert au **polymorphisme** : à l'exécution, c'est la méthode de la fille qui s'exécute.

## L'interface

### Le besoin : consigner un butin

À la fin d'un combat, ou en abordant un radeau de ravitaillement, le joueur récupère un butin. On veut une fonctionnalité qui l'écrit dans le **journal de bord** (un titre, une valeur, des lignes de séparation) à partir d'un objet : un navire ennemi vaincu, un radeau...

On crée une classe `Logbook` avec une méthode `record(...)`. De quel type doit être son paramètre ?

```java
public class Logbook {
    public void record(/* ??? */) {
        System.out.println("==============================");
        System.out.println(/* description */);
        System.out.println("------------------------------");
        System.out.println(/* valeur */);
        System.out.println("==============================");
    }
}
```

### Première tentative : un paramètre `EnemyShip`

```java
public void record(EnemyShip enemy) {
    System.out.println(enemy.getName());
    // ...
}
```

Cela fonctionne pour un ennemi. Mais on veut aussi consigner le contenu d'un `SupplyRaft` (radeau de ravitaillement) :

```java
logbook.record(raft);   // error: incompatible types: SupplyRaft cannot be converted to EnemyShip
```

### Pourquoi ni la surcharge ni le polymorphisme ne suffisent

* **Surcharge** : on pourrait écrire `record(SupplyRaft raft)` en plus. Mais il faut dupliquer le code, et chaque nouveau type de butin demanderait une méthode de plus.
* **Polymorphisme** : une seule méthode attendant une classe mère serait idéale. Mais `EnemyShip` et `SupplyRaft` n'ont **aucun lien d'héritage** : un radeau n'est pas un navire ennemi.

Il nous faut une méthode au paramètre d'un type qui exprime : « quelque chose qui a une description et une valeur ».

### Pourquoi pas une classe mère `Loot` ?

On pourrait déclarer une classe `Loot` avec `getLootValue()` et `getLootDescription()` et faire hériter `EnemyShip` et `SupplyRaft` de `Loot`. Mais `EnemyShip` hérite peut-être déjà d'une classe (ou en héritera plus tard), et en Java une classe ne peut étendre **qu'une seule** classe. De plus, un navire ennemi n'« est pas un » butin : c'est une chose qui **peut être pillée**.

La solution est de faire de `Loot` non pas une classe, mais une **interface**.

### Déclarer une interface

Une **interface** est un type qui décrit un **contrat** : une liste de méthodes que les classes qui l'implémentent s'engagent à fournir.

```java
public interface Lootable {
    int getLootValue();
    String getLootDescription();
}
```

C'est la déclaration d'un **nouveau type** : « un `Lootable`, c'est quelque chose qui sait donner sa valeur et sa description ». Dans IntelliJ : *New*, *Java Class*, puis choisir **Interface** dans la liste.

Dans une interface :

* toutes les méthodes sont **abstraites** par défaut : une signature, pas de corps. Écrire `abstract` est redondant ;
* toutes les méthodes sont **publiques**. Écrire `public` est redondant. Elles décrivent ce que l'objet offre aux autres, donc elles sont forcément publiques.

On peut maintenant écrire `record` avec **un seul** paramètre :

```java
public class Logbook {
    public void record(Lootable loot) {
        System.out.println("==============================");
        System.out.println(loot.getLootDescription());
        System.out.println("------------------------------");
        System.out.println("Valeur : " + loot.getLootValue());
        System.out.println("==============================");
    }
}
```

Dans son corps, on ne peut utiliser **que** ce que l'interface définit : `getLootValue()` et `getLootDescription()`.

### Implémenter une interface : `implements`

Pour qu'une classe soit acceptée par `record`, il faut établir un lien avec l'interface grâce au mot-clé **`implements`** :

```java
public class SupplyRaft implements Lootable {
    private final int rations;

    public SupplyRaft(int rations) {
        this.rations = rations;
    }

    @Override
    public int getLootValue() {
        return rations;
    }

    @Override
    public String getLootDescription() {
        return rations + " rations sur un radeau";
    }
}
```

* `extends` exprime l'héritage **par extension** (une seule classe).
* `implements` exprime l'héritage **par implémentation** (une ou plusieurs interfaces).

Une classe qui implémente une interface **doit** définir toutes ses méthodes (avec `@Override`) : l'interface est abstraite, la classe, elle, est instanciable. IntelliJ peut générer les squelettes (menu *Generate*).

**Piège :** les méthodes d'une interface sont `public`. Quand tu les implémentes, tu **dois** écrire `public`, sinon la visibilité serait réduite :

```java
class Weak implements Lootable {
    int getLootValue() { return 1; }   // error: getLootValue() in Weak cannot implement getLootValue() in Lootable
                                       //        attempting to assign weaker access privileges; was public
}
```

### Utilisation : une méthode, des classes sans lien

```java
Logbook logbook = new Logbook();
logbook.record(frigate);                  // une RoyalFrigate est un Lootable
logbook.record(new SupplyRaft(4));        // un SupplyRaft aussi
```

Règle : **là où une interface est attendue, un objet de n'importe quelle classe qui l'implémente convient.** C'est du polymorphisme, mais sans lien d'extension entre les classes : elles partagent seulement un **contrat**.

Si demain on ajoute un `Treasure` (coffre au trésor) sans aucun lien avec les classes existantes, il suffit qu'il implémente `Lootable` : `record` n'a pas à changer, même pour des classes qui n'existent pas encore.

### Le principe d'abstraction

Dans `record`, on ne sait **pas qui se cache** derrière le `Lootable`, mais on a la **garantie** qu'il sait donner sa valeur et sa description :

> « Je ne sais pas qui tu es, mais je sais que tu sais faire ça. »

Le code qui utilise l'interface dépend uniquement de ce contrat, pas des classes concrètes.

### Une interface est un type

On peut déclarer une variable du type de l'interface. Elle référence un **objet d'une classe qui l'implémente** : on ne peut pas faire `new` sur une interface.

```java
Lootable loot1 = new SupplyRaft(3);
Lootable loot2 = new Lootable();       // error: Lootable is abstract; cannot be instantiated

loot1.getLootValue();                  // accessible : défini par l'interface
```

Vue à travers l'interface, on n'accède qu'aux méthodes qu'elle définit. Si l'objet réel est un `RoyalFrigate`, `loot.getTaunt()` ne compile pas (`cannot find symbol`) : `getTaunt()` n'est pas dans le contrat de `Lootable`. Pour retrouver le type précis, on procède comme au chapitre 10 : `instanceof`, puis cast ou *pattern matching*.

On déclare rarement une variable de ce type. On utilise surtout le type interface en **paramètre** de méthode, comme avec `record`.

### Ce que peut contenir une interface

Au-delà des signatures abstraites, une interface peut contenir :

* des **constantes** : toute variable déclarée dans une interface est implicitement `public static final` (`int MAX_VALUE = 100;`) ;
* des **méthodes `default`**, avec un corps, héritées par les classes qui implémentent l'interface (Java 8) ;
* des méthodes `static` et `private` (Java 8 et 9).

```java
public interface Lootable {
    int getLootValue();
    String getLootDescription();

    default String summary() {
        return getLootDescription() + " (" + getLootValue() + " pièces d'or)";
    }
}
```

Toutes les classes qui implémentent `Lootable` disposent de `summary()`, sans rien écrire. Une méthode `default` s'appuie sur les méthodes abstraites de l'interface, jamais sur des attributs (une interface n'a pas d'attributs d'instance). Si une classe implémente deux interfaces qui fournissent la même méthode `default`, elle doit la redéfinir pour trancher (`inherits unrelated defaults`).

Une méthode avec corps, mais **sans** `default`, est refusée : `interface abstract methods cannot have body`.

Dans ce cours, on se concentre sur le rôle de contrat des interfaces.

### Classe abstraite ou interface ?

| | Classe abstraite | Interface |
| --- | --- | --- |
| Mots-clés | `abstract class` / `extends` | `interface` / `implements` |
| Contenu | attributs, constructeurs, méthodes implémentées, méthodes abstraites | signatures de méthodes, constantes, méthodes `default` |
| Nombre par classe | une seule (héritage simple) | plusieurs possibles |
| Attributs d'instance | oui | non |
| Instanciation | impossible | impossible |
| Rôle | tronc commun à des classes liées (relation « est un ») | contrat de fonctionnalités, entre classes sans lien |

Une classe peut implémenter plusieurs interfaces, séparées par des virgules : `class SupplyRaft implements Lootable, Comparable<SupplyRaft>`. `Comparable` est une interface de la bibliothèque standard, que tu rencontreras avec les tris.

Une interface peut aussi en étendre une autre avec `extends` : `interface Plunderable extends Lootable { ... }`.

### Combiner classe abstraite et interface

Classe abstraite et interface ne s'excluent pas : on les utilise souvent ensemble. La classe abstraite factorise ce qui est commun à des classes liées par un « est un », l'interface exprime un contrat que d'autres classes, sans lien avec elles, peuvent aussi respecter.

Une classe **abstraite** qui implémente une interface n'est **pas obligée** de définir toutes ses méthodes : elle implémente celles qui sont communes à toutes ses filles, et laisse les autres aux filles concrètes.

Faisons évoluer notre code : tous les ennemis doivent être `Lootable`, avec une valeur égale à leur récompense, mais la description du butin dépend de l'ennemi.

```java
public abstract class EnemyShip implements Lootable {
    private final String name;
    private int hull;
    private final int firepower;
    private final int reward;

    protected EnemyShip(String name, int hull, int firepower, int reward) {
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        this.reward = reward;
    }

    public abstract String getTaunt();

    @Override
    public int getLootValue() {        // commun à tous les ennemis : implémenté ici
        return reward;
    }

    // getLootDescription() n'est pas définie : EnemyShip est abstraite, elle n'y est pas obligée
    // ...
}
```

```java
public class Smuggler extends EnemyShip {
    // ...
    @Override
    public String getLootDescription() {
        return "Cargaison de contrebande";
    }
}

public class RoyalFrigate extends EnemyShip {
    // ...
    @Override
    public String getLootDescription() {
        return "Coffre de la Couronne";
    }
}
```

Les filles n'ont plus besoin d'écrire `implements Lootable` : elles le sont déjà, par héritage d'`EnemyShip`. Elles doivent en revanche respecter tout le contrat. Sans `getLootDescription()`, une fille ne compile pas :

```
error: Missing is not abstract and does not override abstract method getLootDescription() in Lootable
```

Elles héritent en revanche de `getLootValue()` sans rien écrire.

`Smuggler`, `RoyalFrigate`, `Kraken` et `SupplyRaft` (qui n'a aucun lien avec `EnemyShip`) sont alors tous des `Lootable` :

```java
logbook.record(smuggler);
logbook.record(frigate);
logbook.record(new SupplyRaft(4));
```

Ce découpage répartit les rôles : la classe abstraite apporte la structure et le comportement commun, l'interface apporte la compatibilité entre classes sans lien, et le compilateur vérifie que chaque classe concrète fournit tout ce qu'on attend d'elle. Ajouter un nouvel ennemi revient à écrire une fille qui complète ce qui manque.

### Choisir la fille à la création, pas dans la classe

Plutôt que de mettre plusieurs comportements dans une même classe, qui se comporterait différemment selon la façon dont ses attributs sont initialisés, on crée une classe fille par comportement. Le choix du type se fait **au moment de la création de l'objet**, et on manipule ensuite l'objet par le type de la classe mère :

```java
EnemyShip enemy;                         // déclaré avant le switch, typé par la mère
switch (choice) {
    case 1 -> enemy = new Smuggler("La Belle Combine");
    case 2 -> enemy = new RoyalFrigate("HMS Victory");
    default -> enemy = new Kraken();
}
Encounter encounter = new Encounter(enemy);   // une seule fois, quel que soit le type choisi
```

Avec une expression `switch`, c'est encore plus court :

```java
EnemyShip enemy = switch (choice) {
    case 1 -> new Smuggler("La Belle Combine");
    case 2 -> new RoyalFrigate("HMS Victory");
    default -> new Kraken();
};
```

Déclarer `enemy` avant le choix évite de dupliquer la suite du code dans chaque branche : c'est le polymorphisme qui permet de n'écrire cette suite qu'une fois.

### Quelques règles pour choisir

* Les classes ont une **structure ou un comportement commun**, avec une relation « est un » : **héritage**, avec une classe abstraite si la mère ne peut pas tout implémenter.
* Des classes **sans lien** doivent pouvoir être utilisées par le même code : **interface**.
* Un attribut de la mère que les filles doivent modifier : `protected`. Sinon, `private` avec des accesseurs.
* Le code commun à toutes les filles se **remonte dans la mère**, par exemple en extrayant une méthode `protected` que les filles appellent.
* Après chaque réorganisation de ce type, **relance le programme** pour vérifier que rien n'est cassé.

### À retenir

* Une **interface** décrit un contrat : des signatures de méthodes, publiques et sans corps par défaut. Elle peut contenir des constantes et des méthodes `default`.
* Une classe l'**implémente** avec `implements` et doit **définir toutes ses méthodes abstraites**, avec `public`.
* Une classe n'étend qu'**une** classe, mais peut implémenter **plusieurs** interfaces.
* Là où une interface est attendue, un objet de n'importe quelle classe qui l'implémente convient, même sans lien d'héritage avec les autres.
* On ne peut pas faire `new` sur une interface. Une variable de ce type n'expose que les méthodes de l'interface.
* Une classe abstraite peut implémenter une interface sans définir toutes ses méthodes : les filles concrètes complètent.
* On choisit la fille à la création de l'objet, puis on le manipule par le type de la mère ou de l'interface.

## Exemple complet

`Lootable.java`

```java
public interface Lootable {
    int getLootValue();
    String getLootDescription();
}
```

`EnemyShip.java`

```java
public abstract class EnemyShip implements Lootable {
    private final String name;
    private int hull;
    private final int firepower;
    private final int reward;

    protected EnemyShip(String name, int hull, int firepower, int reward) {
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        this.reward = reward;
    }

    public String getName() { return name; }
    public int getHull() { return hull; }
    public int getFirepower() { return firepower; }

    public void takeDamage(int damage) {
        hull = Math.max(0, hull - damage);
    }

    public abstract String getTaunt();

    @Override
    public int getLootValue() {
        return reward;
    }
}
```

`Smuggler.java`

```java
public class Smuggler extends EnemyShip {
    public Smuggler(String name) {
        super(name, 6, 3, 10);
    }

    @Override
    public String getTaunt() {
        return "On n'a rien à déclarer, laissez-nous passer !";
    }

    @Override
    public String getLootDescription() {
        return "Cargaison de contrebande";
    }
}
```

`SupplyRaft.java`

```java
public class SupplyRaft implements Lootable {
    private final int rations;

    public SupplyRaft(int rations) {
        this.rations = rations;
    }

    @Override
    public int getLootValue() {
        return rations;
    }

    @Override
    public String getLootDescription() {
        return rations + " rations sur un radeau";
    }
}
```

`Main.java`

```java
Logbook logbook = new Logbook();
logbook.record(new RoyalFrigate("HMS Victory"));
logbook.record(new SupplyRaft(4));
```

```
==============================
Coffre de la Couronne
------------------------------
Valeur : 25
==============================
==============================
4 rations sur un radeau
------------------------------
Valeur : 4
==============================
```

## Les erreurs classiques

| Erreur | Message | Explication |
| --- | --- | --- |
| Méthode sans corps et sans `abstract` | `missing method body, or declare abstract` | Ajouter un corps, ou déclarer la méthode `abstract`. |
| Méthode abstraite dans une classe non abstraite | `X is not abstract and does not override abstract method f() in X` | Déclarer la classe `abstract`. |
| Instancier une classe abstraite ou une interface | `X is abstract; cannot be instantiated` | Instancier une fille concrète. |
| Fille qui oublie une méthode abstraite | `X is not abstract and does not override abstract method f() in Y` | La redéfinir, ou déclarer la fille `abstract`. |
| Appeler `super` sur une méthode abstraite | `abstract method f() in X cannot be accessed directly` | Il n'y a pas d'implémentation dans la mère. |
| `abstract` avec `private`, `final` ou `static` | `illegal combination of modifiers: abstract and private` | Une méthode abstraite doit pouvoir être redéfinie. |
| Implémenter une méthode d'interface sans `public` | `attempting to assign weaker access privileges; was public` | Écrire `public`. |
| Corps dans une méthode d'interface sans `default` | `interface abstract methods cannot have body` | Ajouter `default`, ou retirer le corps. |
| Appeler une méthode de la fille via le type interface | `cannot find symbol` | Elle n'est pas dans le contrat : tester avec `instanceof`. |
| Modifier une constante d'interface | `cannot assign a value to static final variable` | Les attributs d'interface sont `static final`. |
| Deux interfaces avec la même méthode `default` | `inherits unrelated defaults` | Redéfinir la méthode dans la classe. |

## À retenir

* **Classe abstraite** : tronc commun (attributs, constructeurs, méthodes implémentées) avec, éventuellement, des méthodes abstraites que les filles doivent écrire. Non instanciable.
* **Interface** : contrat de méthodes, implémenté avec `implements`, par des classes sans lien entre elles. Une classe peut en implémenter plusieurs.
* Dans les deux cas, on écrit du code qui dépend du **contrat** (le type abstrait) et non des classes concrètes : il accepte les classes déjà écrites et celles qui viendront.
* Une classe abstraite peut implémenter une interface sans tout définir ; les filles complètent.
* Relation « est un » : héritage. Capacité commune à des classes sans lien : interface.

## À toi de jouer

1. Transforme ta classe `Ship` du chapitre 9 en classe abstraite avec une méthode abstraite `getTypeName()`. Que se passe-t-il pour `new Ship(...)` ? Que doivent faire `Sloop` et `Galleon` ?
2. Écris la classe abstraite `EnemyShip` et ses trois filles. Dans `Main`, déclare un tableau `EnemyShip[]` mêlant les trois types et appelle `getTaunt()` sur chacun.
3. Ajoute `GhostShip` (coque 15, puissance de feu 6, butin 40) avec sa provocation. Combien de lignes as-tu dû modifier dans `Encounter` ?
4. Provoque volontairement les erreurs du tableau : retire `@Override public String getTaunt()` d'une fille, essaie `new EnemyShip(...)`, essaie `super.getTaunt()`. Lis chaque message.
5. Déclare l'interface `Lootable`. Fais-la implémenter par `EnemyShip` (abstraite, avec `getLootValue()` seulement) et par `SupplyRaft`. Écris `Logbook.record(Lootable)`.
6. Ajoute une troisième classe sans lien (`Treasure`, avec une valeur et une description) qui implémente `Lootable`. Vérifie que `Logbook` fonctionne sans modification.
7. Ajoute dans `Lootable` une méthode `default String summary()` qui compose la description et la valeur. Utilise-la dans `Logbook`.
8. Oublie volontairement le mot `public` sur une méthode implémentée. Lis l'erreur. Explique pourquoi une méthode d'interface est toujours publique.
9. Écris une méthode qui reçoit un `Lootable` et affiche, si c'est un `EnemyShip`, sa provocation (utilise `instanceof` avec *pattern matching*). Est-ce une bonne idée ? Dans quel cas préférerais-tu ajouter une méthode à l'interface ?
10. Choisis la fille à la création : lis un nombre au clavier (1, 2 ou 3) et crée l'ennemi correspondant avec un `switch`, puis passe-le à `Encounter`.

**Indice de l'exercice 9 :** si tu te retrouves à enchaîner des `instanceof` pour choisir un comportement, c'est souvent le signe qu'une méthode redéfinie (abstraite ou d'interface) ferait mieux le travail.

## Pour aller plus loin

* [Dev.java : méthodes et classes abstraites](https://dev.java/learn/language/oop/inheritance/abstract-classes/).
* [Dev.java : définir une interface](https://dev.java/learn/language/oop/interfaces/defining-interfaces/).
* [Dev.java : implémenter une interface](https://dev.java/learn/language/oop/interfaces/examples/).
* [Dev.java : utiliser une interface comme un type](https://dev.java/learn/using-an-interface-as-a-type/).
