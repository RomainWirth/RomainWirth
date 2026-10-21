# POO : L'Héritage par extension

## Le Principe d'Héritage par Extension

### Contexte : les limites de la version précédente

Dans la version précédente, un `Building` avait un attribut `type` de type `TypeBuilding`, une énumération avec trois valeurs (`MAISON`, `IMMEUBLE`, `COMMERCE`). Cette solution fonctionne tant que les types ne diffèrent que par leur **nom**.

Elle atteint sa limite quand on veut décrire plus précisément chaque type de bâtiment, car ils n'ont pas la même structure : une habitation a une superficie et un nombre de chambres, un commerce a une enseigne. Une énumération ne sait porter qu'un nom (et éventuellement quelques valeurs fixes).

On veut donc créer de **nouveaux types** (`Housing`, `Shop`), chacun avec sa propre représentation. On repart d'un `Building` simplifié : on retire l'énumération (attribut, paramètre du constructeur et getter).

```java
import java.time.LocalDate;

public class Building {
    private int constructionYear;

    public Building(int constructionYear) {
        this.constructionYear = constructionYear;
    }

    public int getConstructionYear() {
        return constructionYear;
    }

    public int getAge() {
        return LocalDate.now().getYear() - constructionYear;
    }
}
```

`LocalDate.now()` retourne la date du jour (classe de `java.time`, à importer), et `getYear()` son année : la différence avec l'année de construction donne l'âge du bâtiment.

### Le problème : la duplication

Créons une classe `Housing` pour représenter une habitation, indépendamment de `Building` :

```java
public class Housing {
    private int constructionYear;   // dupliqué depuis Building
    private int area;
    private int bedroomCount;

    public int getConstructionYear() { ... }   // dupliqué
    // il faudrait aussi dupliquer getAge()...
}
```

Une habitation a une année de construction, comme un bâtiment : on retrouve le même attribut, le même getter, et il faudrait aussi recopier `getAge()`. Les deux classes n'ont aucun lien, et chaque modification doit être répétée. Cette duplication est difficile à maintenir, surtout si on ajoute ensuite `Shop` et d'autres types.

### L'héritage par extension

L'**héritage** consiste à créer une classe à partir d'une classe existante, dont elle reprend la structure et le comportement. Il se déclare avec le mot-clé `extends`.

```java
public class Housing extends Building {
    private int area;
    private int bedroomCount;
    // ...
}
```

Une `Housing` **est un** `Building` : c'est la relation « **est un** » (*is-a*), à ne pas confondre avec la relation « a un » de la composition.

Vocabulaire :

- **classe mère** (ou parent, *superclass*) : `Building` ;
- **classe fille** (ou *subclass*) : `Housing`, qui **étend** `Building`.

On supprime donc de `Housing` l'année de construction et son getter : ils sont déjà dans la classe mère. En lisant la déclaration `class Housing extends Building`, on comprend que `Housing` contient tout ce que contient `Building`, **plus** sa superficie et son nombre de chambres.

#### Ce que la fille hérite

- **La structure** : les attributs de la mère. Un objet `Housing` contient `constructionYear`, `area` et `bedroomCount`.
- **Le comportement** : les méthodes de la mère. Un objet `Housing` peut appeler `getConstructionYear()` et `getAge()`.

Tout ce que sait faire la mère, la fille sait le faire aussi. La fille peut en plus avoir ses **propres** attributs et méthodes (`getArea()`, `getBedroomCount()`), que la mère ne connaît pas.

```java
Building building1 = new Building(1992);
Housing housing1 = new Housing(2008, 100, 3);

housing1.getConstructionYear();   // héritée de Building
housing1.getAge();                // héritée de Building
housing1.getArea();               // propre à Housing

building1.getArea();              // cannot find symbol : Building ne connaît pas getArea()
```

La classe fille est plus **spécialisée** que la mère : elle contient plus d'informations (un objet `Housing` occupe donc plus de mémoire qu'un objet `Building`). Dans l'autocomplétion d'IntelliJ, les membres propres à la classe de l'objet apparaissent en gras, et les membres hérités en normal.

On évite ainsi de répéter la structure et le comportement commun : il n'est défini qu'à un seul endroit.

#### Héritage simple

- Une classe mère peut avoir **plusieurs** classes filles (`Housing` et `Shop` étendent toutes deux `Building`).
- Une classe fille n'a **qu'une seule** classe mère : en Java, on ne peut pas étendre deux classes (c'est l'héritage **simple**).
- Une classe qui n'étend rien étend implicitement la classe `Object`. C'est pourquoi tout objet dispose de méthodes comme `toString()` ou `equals()`.

#### Visibilité et héritage

Un attribut `private` de la mère existe bien dans l'objet fille, mais le code de la **fille ne peut pas y accéder directement** :

```java
public class Housing extends Building {
    public void display() {
        System.out.println(constructionYear);   // constructionYear has private access in Building
        System.out.println(getConstructionYear());   // via l'accesseur public
    }
}
```

La fille passe donc par les méthodes publiques de la mère (getters), ce qui préserve l'encapsulation. Il existe un niveau intermédiaire, `protected`, détaillé dans la section suivante. Par défaut, on garde `private` et on passe par des accesseurs.

(Rendre les attributs `public` pour les manipuler depuis `main`, comme on peut le faire pour une démonstration, ne doit pas être conservé dans un vrai code.)

### Les constructeurs et `super`

Les constructeurs ne sont **pas hérités**. Chaque classe définit les siens. En revanche, pour construire un objet fille, il faut d'abord construire sa **partie mère**. Le constructeur de la fille doit donc appeler un constructeur de la mère avec le mot-clé **`super`**.

#### Première tentative : initialiser l'attribut hérité

```java
public class Housing extends Building {
    // ...
    public Housing(int constructionYear, int area, int bedroomCount) {
        this.constructionYear = constructionYear;   // private dans Building : impossible
        this.area = area;
        this.bedroomCount = bedroomCount;
    }
}
```

Cela ne compile que si l'attribut est rendu `public` ou `protected`, et cela duplique ce que fait déjà le constructeur de `Building`.

#### Solution : `super(...)`

On invoque le constructeur de la mère, qui initialise sa partie de la structure, puis la fille initialise ce qui lui est propre :

```java
public class Housing extends Building {
    private int area;
    private int bedroomCount;

    public Housing(int constructionYear, int area, int bedroomCount) {
        super(constructionYear);        // construit d'abord la partie Building
        this.area = area;
        this.bedroomCount = bedroomCount;
    }
    // getters...
}
```

```java
public class Shop extends Building {
    private String shopName;

    public Shop(int constructionYear, String shopName) {
        super(constructionYear);
        this.shopName = shopName;
    }

    public String getShopName() {
        return shopName;
    }
}
```

Les arguments de `super(...)` déterminent **quel constructeur** de la mère est appelé (comme pour une surcharge). Avec Ctrl/Cmd + clic sur `super`, IntelliJ ouvre le constructeur ciblé.

Pour construire un `Housing`, on construit donc d'abord un `Building`, puis on s'occupe de ce qu'une habitation a en plus. L'attribut `constructionYear` peut rester `private` dans `Building`.

#### Règles sur `super(...)`

- L'appel ne peut apparaître **qu'une seule fois**, et il est normalement la **première instruction** du constructeur.
- Il ne peut pas être combiné avec `this(...)` dans le même constructeur.
- Si on **n'écrit pas** d'appel, le compilateur ajoute **implicitement** `super();` (constructeur sans paramètre de la mère).

> À vérifier selon la version de Java utilisée : depuis Java 25, des instructions sont autorisées avant `super(...)`, à condition de ne pas utiliser l'objet en cours de construction (`this`). On peut ainsi valider un paramètre avant l'appel. L'appel au constructeur de la mère reste obligatoire, explicite ou implicite, et la mère est toujours construite avant le corps de la fille.

#### Quand l'appel implicite ne compile pas

L'appel implicite `super()` suppose que la mère possède un constructeur **sans paramètre** (écrit explicitement, ou constructeur par défaut généré par le compilateur).

| Constructeurs de la mère | Constructeur de la fille |
|---|---|
| Un constructeur sans paramètre | `super()` est ajouté implicitement : on n'a rien à écrire |
| **Uniquement** des constructeurs avec paramètres | La fille **doit** appeler explicitement l'un d'eux avec `super(...)` |

Dans notre cas, `Building` n'a qu'un constructeur à un paramètre (`int`). Le constructeur par défaut n'existe plus. Toute classe fille doit donc l'appeler, sinon elle ne compile pas, même si la fille n'écrit aucun constructeur :

```java
public class Shop extends Building {
    // aucun constructeur écrit : le compilateur ajoute un constructeur par défaut qui appelle super()
}
// constructor Building in class Building cannot be applied to given types
```

Le plus simple est d'ajouter à la fille un constructeur qui reçoit les informations nécessaires et les transmet à `super(...)`. IntelliJ peut le générer : *Code → Generate → Constructor* (raccourci selon le système), en choisissant les attributs à initialiser. S'il y a plusieurs constructeurs dans la mère, il propose lequel appeler.

#### Ordre de construction

La mère est toujours construite **avant** la fille. Avec un `println` dans chaque constructeur :

```java
new Housing(2008, 100, 3);
// affiche d'abord : Building (constructeur de la mère)
// puis :            Housing  (constructeur de la fille)
```

### Utilisation

```java
Housing housing1 = new Housing(2008, 100, 3);
Shop shop1 = new Shop(1990, "Boulangerie");

System.out.println(housing1.getConstructionYear());   // 2008 (héritée)
System.out.println(housing1.getAge());                // héritée
System.out.println(housing1.getArea());               // 100 (propre à Housing)
System.out.println(shop1.getShopName());              // "Boulangerie" (propre à Shop)
System.out.println(shop1.getAge());                   // héritée
```

On retrouve l'héritage de la structure et du comportement dans les deux classes filles, chacune avec ses ajouts.

Puisqu'un `Housing` **est un** `Building`, on pourra aussi le ranger dans une variable de type `Building`. C'est le polymorphisme, à voir dans le chapitre suivant.

### Héritage ou composition ?

- **Héritage** : relation « **est un** ». Une habitation est un bâtiment ; la fille est un cas particulier de la mère et en reprend tout le comportement.
- **Composition** : relation « **a un** ». Un terrain a un bâtiment ; l'objet en contient un autre.

On n'utilise pas l'héritage uniquement pour réutiliser du code : si la relation « est un » n'a pas de sens, on préfère la composition. Dans le doute, la composition est souvent le meilleur choix, car elle couple moins les classes entre elles.

De même, une énumération reste adaptée quand les types ne diffèrent que par un nom ou quelques valeurs fixes. L'héritage convient quand leur **structure** ou leur **comportement** diffèrent.

### À retenir

- `class Fille extends Mère` : la fille hérite de la **structure** (attributs) et du **comportement** (méthodes) de la mère.
- La fille peut ajouter ses propres attributs et méthodes : elle est plus **spécialisée**.
- Héritage **simple** : une seule mère par classe, mais plusieurs filles possibles. Toute classe étend implicitement `Object`.
- Les attributs `private` de la mère existent dans l'objet fille, mais ne sont accessibles que par les méthodes publiques de la mère.
- Les constructeurs ne sont pas hérités : le constructeur de la fille appelle celui de la mère avec `super(...)`, implicitement (`super()`) si on ne l'écrit pas.
- Si la mère n'a pas de constructeur sans paramètre, la fille **doit** appeler explicitement un de ses constructeurs.
- La mère est construite **avant** la fille.

## La visibilité `protected`



## Redéfinition de méthodes `@Override`