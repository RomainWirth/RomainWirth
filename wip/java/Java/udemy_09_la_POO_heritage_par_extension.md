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

Le plus simple est d'ajouter à la fille un constructeur qui reçoit les informations nécessaires et les transmet à `super(...)`. IntelliJ peut le générer : *Code => Generate => Constructor* (raccourci selon le système), en choisissant les attributs à initialiser. S'il y a plusieurs constructeurs dans la mère, il propose lequel appeler.

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

### Rappel : l'héritage ne casse pas l'encapsulation

Le principe d'encapsulation reste valable : on déclare les attributs `private` et on donne accès à leur valeur par des getters et des setters.

Un attribut `private` de la mère fait bien partie de la **structure** de la fille, mais il n'est manipulable que **dans la classe qui le définit**. La classe mère décide de ce qu'elle autorise, et `private` n'autorise pas la fille :

```java
public class Housing extends Building {
    public Housing(int constructionYear, int area, int bedroomCount) {
        super(constructionYear);
        this.constructionYear = constructionYear;   // constructionYear has private access in Building
        // ...
    }
}
```

### Les deux extrêmes

- **`private`** : la fille hérite de l'attribut mais ne peut pas le manipuler.
- **`public`** : la fille peut le lire et le modifier, mais **tout le reste du code** aussi. N'importe quel code qui possède un `Building` ou un `Housing` peut changer l'année de construction après l'initialisation, sans aucun contrôle.

`public` est donc trop permissif : on voudrait ouvrir l'accès à la fille, sans l'ouvrir à tout le monde.

### Les méthodes suivent la même logique

- Une méthode `public` de la mère est héritée : on peut l'appeler de l'extérieur, mais aussi **dans le corps de la fille**, que ce soit dans son constructeur ou dans une autre de ses méthodes (c'est `this` qui se cache devant l'appel).
- Une méthode `private` de la mère n'est pas utilisable par la fille.

```java
public class Housing extends Building {
    public Housing(int constructionYear, int area, int bedroomCount) {
        super(constructionYear);
        System.out.println(getConstructionYear());   // accesseur public hérité
        // ...
    }

    public boolean isRecent() {
        return getAge() < 10;   // si getAge() est public (ou protected) dans Building
    }
}
```

Si `getAge()` devient `private` dans `Building`, l'appel dans `isRecent()` ne compile plus.

### Le mot-clé `protected`

Entre `private` et `public`, il existe une visibilité faite pour l'héritage : **`protected`**. Un membre (attribut, méthode ou constructeur) `protected` dans la mère est **accessible aux classes filles**, comme s'il était public pour elles, mais **pas au reste du code**.

```java
public class Building {
    protected int constructionYear;   // accessible dans Building et dans ses filles
    // ...
    protected int getAge() { ... }
}
```

```java
public class Housing extends Building {
    public void rebuild(int year) {
        constructionYear = year;      // lecture et écriture autorisées
        int age = getAge();
    }
}
```

Depuis du code extérieur (par exemple `main`, dans un autre package), le membre reste inaccessible :

```java
Shop shop1 = new Shop(1990, "Boulangerie");
shop1.constructionYear;   // has protected access in Building
shop1.getAge();           // has protected access in Building
```

C'est la classe mère qui choisit, dans sa définition, d'ouvrir un membre à ses futures filles. L'héritage va dans un seul sens : **la fille connaît sa mère, la mère ne connaît pas ses filles**. En déclarant un membre `protected`, la mère le prévoit pour des filles qu'elle ne connaît pas encore.

### Tableau récapitulatif

| Visibilité | Même classe | Même package | Classe fille (autre package) | Reste du code |
|---|---|---|---|---|
| `private` | | | | |
| *(rien)* : package | | | | |
| `protected` | | | | |
| `public` | | | | |

> Attention : `protected` donne **aussi** l'accès au **package**, exactement comme l'absence de modificateur. Une classe du même package que la mère, même sans lien d'héritage, peut donc accéder à un membre `protected`. Le mot-clé est surtout utile quand on hérite d'une classe située dans **un autre package** que la sienne.

Complément (non abordé dans la transcription) : dans une classe fille située dans un **autre package**, l'accès à un membre `protected` se fait sur l'objet en cours (`this`) ou sur une référence du type de la fille, mais pas sur une simple référence de type `Building`.

### Que choisir ?

Il n'y a pas de règle absolue : les visibilités permettent d'ouvrir ou de fermer l'accès selon le besoin. Le principe d'encapsulation conseille toutefois de **commencer fermé** :

1. **Par défaut, `private`** pour les attributs, avec des getters et des setters. Leur visibilité les rend utilisables par la fille, qui accède donc à sa structure **par les méthodes**, sans pouvoir y faire n'importe quoi.
2. **`protected`** seulement quand la mère veut explicitement laisser ses filles manipuler directement un membre.

Avec `protected`, le développeur qui écrit la fille peut faire ce qu'il veut de l'attribut. Le **contrôle des valeurs** devient alors la responsabilité de la classe mère : si une fille affecte une année de construction absurde (négative, dans le futur), c'est `getAge()` de la mère qui produira un résultat faux. Avec un setter `private` ou `protected` qui valide la valeur, la mère garde la maîtrise de son état.

### À retenir

- L'héritage ne remet pas en cause l'encapsulation : un attribut `private` de la mère reste inaccessible à la fille, qui passe par les méthodes.
- `public` ouvre l'accès à la fille mais aussi à tout le code : souvent trop permissif.
- `protected` ouvre l'accès aux **classes filles** (et au **package**), mais pas au reste du code. Il s'applique aux attributs, aux méthodes et aux constructeurs.
- C'est la **classe mère** qui décide, dans sa définition, de ce qu'elle laisse aux filles.
- Par défaut : `private` + accesseurs. On utilise `protected` en connaissance de cause, en sachant que la mère doit alors contrôler les valeurs.

## Redéfinition de méthodes `@Override`

### Rappel : la surcharge (*overload*)

La **surcharge** consiste à définir plusieurs méthodes de **même nom** mais de **paramètres différents** (en nombre ou en type). Jusqu'ici, on l'a vue dans une même classe. Elle fonctionne aussi entre une mère et sa fille.

```java
public class Building {
    public void method(int a) {
        System.out.println("méthode de Building");
    }
}

public class Housing extends Building {
    public void method(int a, int b) {   // même nom, paramètres différents
        System.out.println("méthode de Housing");
    }
}
```

```java
Building building1 = new Building(1992);
Housing housing1 = new Housing(2008, 100, 3);

building1.method(1);       // "méthode de Building"
housing1.method(1);        // "méthode de Building" (héritée)
housing1.method(1, 2);     // "méthode de Housing"
building1.method(1, 2);    // Building ne connaît pas cette version
```

Il n'y a pas d'ambiguïté : `Housing` possède **deux** méthodes, celle qu'elle hérite et celle qu'elle définit, et les paramètres de l'appel déterminent laquelle est utilisée.

### La redéfinition (*override*)

Si la fille déclare une méthode avec le **même nom et exactement les mêmes paramètres** que la mère, on ne surcharge plus : on **redéfinit** la méthode.

```java
public class Housing extends Building {
    @Override
    public void method(int a) {
        System.out.println("méthode de Housing");
    }
}
```

```java
building1.method(1);   // "méthode de Building"
housing1.method(1);    // "méthode de Housing"
```

`Housing` n'a alors **plus qu'une seule** méthode `method(int)` : la sienne, qui **masque** celle de la mère. L'objet étant de type `Housing`, c'est la version de la fille qui est appelée. La Javadoc générée indique d'ailleurs que la méthode redéfinit celle de `Building` (« Overrides »).

| | Surcharge (*overload*) | Redéfinition (*override*) |
|---|---|---|
| Nom | identique | identique |
| Paramètres | **différents** | **identiques** |
| Où | même classe, ou mère et fille | classe fille uniquement |
| Résultat | plusieurs méthodes disponibles | la méthode de la fille remplace celle de la mère |

### L'annotation `@Override`

On place `@Override` juste au-dessus de la méthode redéfinie. Elle **n'est pas obligatoire**, mais elle est très utile :

- **Vérification par le compilateur** : elle précise qu'on veut redéfinir une méthode de la mère. S'il n'existe pas de méthode avec cette signature exacte dans la mère (faute de frappe sur le nom, paramètre ajouté ou modifié), le code **ne compile pas**.
- **Protection lors des modifications** : si on renomme ou modifie une méthode dans la mère, les filles annotées `@Override` ne compilent plus, ce qui oblige à les mettre à jour (en pratique, via un *refactor* de l'IDE). Sans l'annotation, la fille définirait silencieusement une **nouvelle** méthode et ne redéfinirait plus rien, sans aucune erreur.
- **Lisibilité** : en parcourant la fille, on voit immédiatement quelles méthodes redéfinissent celles de la mère, et lesquelles lui sont propres (`getArea()` et `getBedroomCount()` n'ont pas d'annotation).

```java
public class Housing extends Building {
    @Override
    public void method(int a, int b) { ... }   // method does not override or implement a method from a supertype
}
```

### Exemple : `display()` et appel à la méthode de la mère avec `super`

Ajoutons dans `Building` une méthode d'affichage :

```java
public class Building {
    // ...
    public void display() {
        System.out.println("Ce bâtiment a été construit en " + constructionYear);
    }
}
```

Elle est héritée par `Housing`. Mais un `Housing` a aussi une superficie et un nombre de chambres : on redéfinit donc `display()` dans la fille.

```java
public class Housing extends Building {
    @Override
    public void display() {
        System.out.println("Superficie : " + area + " m², chambres : " + bedroomCount);
    }
}
```

Problème : `housing1.display()` n'affiche plus l'année de construction. On voudrait afficher **tout ce qu'est une habitation**, donc réutiliser le `display()` de la mère. Mais écrire `display()` dans la fille appelle… la méthode de la fille elle-même :

```java
@Override
public void display() {
    display();   // équivaut à this.display() : appel récursif infini
    System.out.println("Superficie : " + area + " m², chambres : " + bedroomCount);
}
```

Rappel : sans rien devant, il y a implicitement `this`. La méthode s'appelle donc indéfiniment, jusqu'à une erreur à l'exécution : **`StackOverflowError`** (la JVM a empilé trop d'appels de méthodes). Pour appeler la version de la **mère**, on utilise le mot-clé **`super`** :

```java
@Override
public void display() {
    super.display();   // d'abord ce que faisait la mère
    System.out.println("Superficie : " + area + " m², chambres : " + bedroomCount);
}
```

```java
housing1.display();
// Ce bâtiment a été construit en 2008
// Superficie : 100 m², chambres : 3
```

### Appeler `super.méthode()` : un choix, pas une obligation

Contrairement au constructeur, qui **doit** appeler celui de la mère, une méthode redéfinie n'est **pas obligée** d'appeler la version de la mère. Elle peut l'appeler zéro fois, une fois, plusieurs fois, au début, au milieu ou à la fin : c'est la fille qui prend la responsabilité de redéfinir le comportement comme elle le souhaite.

En revanche, quand on veut la version de la mère, le préfixe `super.` est **indispensable**, sinon on retombe dans la récursion infinie.

### Générer la redéfinition avec IntelliJ

- Dans le corps de la fille, taper le début du nom d'une méthode de la mère (par exemple `d`) : l'autocomplétion propose de la redéfinir, et *Entrée* ajoute automatiquement `@Override` et l'appel à `super.méthode()`.
- Ou via le menu *Code => Generate => Override Methods…* (raccourci selon le système), qui liste les méthodes de la mère à redéfinir.

### Les méthodes `final` ne se redéfinissent pas

Une méthode déclarée `final` dans la mère est bien héritée, mais la fille **ne peut pas la redéfinir** : le code ne compile pas.

```java
public class Building {
    public final void display() { ... }
}

public class Housing extends Building {
    @Override
    public void display() { ... }   // display() in Housing cannot override display() in Building ; overridden method is final
}
```

C'est le moyen pour la mère d'imposer un comportement à toutes ses filles.

### Compléments (non abordés dans la transcription)

- La redéfinition ne peut pas **réduire la visibilité** : une méthode `public` de la mère reste `public` dans la fille. Elle peut en revanche l'élargir (`protected` => `public`).
- Une méthode `private` n'est pas héritée, donc elle ne peut pas être redéfinie.
- Une méthode `static` ne se redéfinit pas : la fille qui en déclare une de même signature la **masque** (*hiding*), ce qui est un mécanisme différent.
- Toute classe étend implicitement `Object` : redéfinir `toString()` ou `equals()` est donc une redéfinition, et `@Override` s'y applique.

### À retenir

- **Surcharge** (*overload*) : même nom, paramètres **différents** => plusieurs méthodes disponibles.
- **Redéfinition** (*override*) : même nom, paramètres **identiques**, dans la fille => la méthode de la fille remplace celle de la mère pour les objets de type fille.
- `@Override` n'est pas obligatoire, mais permet au compilateur de vérifier la redéfinition, protège lors des modifications de la mère et rend la classe plus lisible. On l'utilise systématiquement.
- `super.méthode()` appelle la version de la mère. Il est facultatif, mais sans `super.` l'appel est récursif et finit en `StackOverflowError`.
- Une méthode `final` de la mère ne peut pas être redéfinie.