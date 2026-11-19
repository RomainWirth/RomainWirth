# Classes et objets

Jusqu'ici, tu as manipulé des variables, des tableaux et des méthodes. Le programme reste une suite d'instructions où les données (la coque d'un navire, sa puissance de feu) et les actions (subir des dégâts, se réparer) sont écrites séparément. Dès qu'il y a plusieurs navires, plusieurs ennemis, plusieurs capitaines, cela devient vite ingérable.

La **programmation orientée objet** (POO) apporte une autre manière de découper un programme : on regroupe dans une même **classe** les données d'un concept et les actions qui lui sont liées. Ce chapitre est le plus important du cours : tout ce qui suit (héritage, interfaces, collections, JDBC...) s'appuie dessus.

## Objectifs

À la fin du chapitre, tu sauras :

* expliquer ce qu'est une classe, un objet, un attribut, une méthode ;
* écrire une classe avec ses attributs, ses constructeurs et ses méthodes, puis créer des objets avec `new` ;
* protéger l'état d'un objet grâce à la visibilité `private` et aux accesseurs (encapsulation) ;
* utiliser `this`, la surcharge, `static` et `final` à bon escient ;
* prévoir ce qui se passe quand on copie ou qu'on passe un objet à une méthode ;
* documenter ta classe avec la Javadoc.

## Rappels sur la POO

La POO consiste à modéliser un problème avec des **objets**, en s'inspirant souvent (mais pas toujours) du monde réel. On ne garde de chaque concept que ce qui compte pour l'application : c'est l'**abstraction**. Un navire de notre jeu a un nom, une coque, une puissance de feu ; sa couleur de voiles n'intéresse pas le programme, on l'ignore.

Chaque objet possède :

* des **attributs** : ses données, ce qu'il *est* (un nom, des points de coque) ;
* des **méthodes** : ses comportements, ce qu'il *fait* (subir des dégâts, se réparer).

Une **classe** est le plan qui décrit les attributs et les méthodes d'un type d'objets. Un **objet**, ou **instance**, est une réalisation concrète de ce plan, avec ses propres valeurs. Depuis une classe `Ship`, on peut créer autant de navires que nécessaire.

La POO repose habituellement sur quatre principes :

1. **L'encapsulation** : les données d'un objet sont protégées, on n'y accède que par ses méthodes (vue dans ce chapitre).
2. **L'abstraction** : on n'expose que ce qui est nécessaire pour utiliser l'objet, on cache la complexité interne.
3. **L'héritage** : une classe peut reprendre les attributs et méthodes d'une autre (`GhostShip` est un `Ship`).
4. **Le polymorphisme** : des objets différents répondent à un même appel chacun à sa façon (`attack()` ne produit pas le même effet pour un `Kraken` et pour une `Sloop`).

Les deux derniers font l'objet des chapitres suivants.

> Java est un langage orienté objet, mais ses types primitifs (`int`, `double`, `boolean`...) ne sont pas des objets : ce sont de simples valeurs.

## Pourquoi des classes ? Un exemple

On veut représenter deux navires, chacun avec un nom, une coque et une puissance de feu. Avec ce que tu connais déjà :

```java
public class Main {
    public static void main(String[] args) {
        String shipOneName = "Black Pearl";
        int shipOneHull = 30;
        int shipOneFirepower = 5;

        System.out.println(shipOneName + " : coque " + shipOneHull + ", puissance de feu " + shipOneFirepower);

        String shipTwoName = "Sea Wolf";
        int shipTwoHull = 20;
        int shipTwoFirepower = 3;

        System.out.println(shipTwoName + " : coque " + shipTwoHull + ", puissance de feu " + shipTwoFirepower);
    }
}
```

Pour ajouter un navire, il faut dupliquer les variables et l'affichage. Surtout, **rien ne relie** `shipOneName`, `shipOneHull` et `shipOneFirepower` : ce sont trois variables indépendantes, que seul le nom permet d'associer. Avec dix navires, trente variables... et une erreur de copier-coller est vite arrivée.

La solution : créer **son propre type**, `Ship`, qui regroupe ces informations.

## Créer une classe

En Java, on crée un type en écrivant une classe, dans un fichier qui porte son nom :

`Ship.java`

```java
public class Ship {
    // attributs, constructeurs, méthodes...
}
```

Règles à retenir :

* une classe `public` s'écrit dans un fichier du **même nom** (`Ship.java`) ;
* par convention, un nom de classe commence par une majuscule, en `PascalCase` ;
* chaque classe produit, à la compilation, son propre fichier `.class` (du bytecode, comme pour `Main`).

Une classe se compose, dans cet ordre habituel (convention de lisibilité, pas une obligation du compilateur) :

1. les **attributs** ;
2. le ou les **constructeurs** ;
3. les **méthodes**.

## Créer et utiliser un objet

Créer un objet se fait en trois temps : déclarer, initialiser, utiliser.

### 1. Déclarer

```java
Ship blackPearl;
Ship seaWolf;
```

`blackPearl` est une variable dont le **type** est `Ship`. Contrairement à `int`, qui s'écrit en minuscules, `Ship` commence par une majuscule : c'est une classe.

À ce stade, **aucun navire n'existe**. Utiliser la variable avant de l'avoir initialisée est une erreur de compilation (`variable blackPearl might not have been initialized`).

### 2. Initialiser avec `new`

Pour créer un objet, on utilise le mot-clé `new` suivi du **constructeur** :

```java
blackPearl = new Ship();
```

`new` fait plusieurs choses :

1. il réserve de la mémoire pour l'objet (dans une zone appelée le **tas**, ou *heap*) ;
2. il initialise les attributs à leur valeur par défaut ;
3. il exécute le **constructeur**, qui termine l'initialisation ;
4. il retourne une **référence** vers l'objet créé.

Cette référence est rangée dans la variable. La variable ne contient donc **pas** le navire, mais de quoi le retrouver (voir la section sur les références, plus bas). On peut déclarer et initialiser en une ligne :

```java
Ship blackPearl = new Ship();
```

Une variable de type classe peut aussi ne référencer **aucun objet** : elle vaut alors `null`. C'est une valeur explicite, que le compilateur accepte. Mais appeler une méthode sur `null` provoque une `NullPointerException` à l'exécution :

```java
Ship ghost = null;
ghost.getHull();   // NullPointerException
```

### 3. Utiliser : les attributs

Qu'est-ce qui définit un navire ? Un nom, une coque, une puissance de feu. On les déclare dans la classe : ce sont les **attributs** (ou *champs*, en anglais *fields*).

```java
public class Ship {
    String name;
    int hull;
    int firepower;
}
```

Chaque objet créé possède **ses propres** emplacements mémoire pour `name`, `hull` et `firepower`. On y accède avec l'opérateur `.` :

```java
Ship blackPearl = new Ship();
blackPearl.name = "Black Pearl";
blackPearl.hull = 30;
blackPearl.firepower = 5;

Ship seaWolf = new Ship();
seaWolf.name = "Sea Wolf";
seaWolf.hull = 20;
seaWolf.firepower = 3;
```

Les deux objets ont la même **structure** (même type), mais pas le même **état** (valeurs différentes).

Un attribut non initialisé reçoit une **valeur par défaut** : `0` pour un `int`, `0.0` pour un `double`, `false` pour un `boolean`, `null` pour un type classe (donc un `String`). Cela ne vaut que pour les attributs : une variable **locale** doit toujours être initialisée.

> Pour l'instant, ces attributs sont accessibles de partout. Nous verrons plus bas pourquoi ce n'est pas une bonne idée, et comment on les protège.

## Les méthodes

Il reste à donner des **comportements** à la classe. On écrit pour cela des méthodes, que l'on appelle sur un objet avec l'opérateur `.`. Tu connais déjà leur forme (chapitre 6), mais elles **n'ont plus de `static`** : elles s'appliquent à un objet précis.

Par exemple, calculons les dégâts d'une attaque, avec la formule du jeu : `max(0, puissance de feu + jet de dé - 4)`.

```java
public class Ship {
    String name;
    int hull;
    int firepower;

    int computeDamage(int diceRoll) {
        return Math.max(0, firepower + diceRoll - 4);
    }
}
```

```java
int damage = blackPearl.computeDamage(6);   // 5 + 6 - 4 = 7
System.out.println("Dégâts : " + damage);
```

Dans `computeDamage`, `firepower` désigne l'attribut **de l'objet sur lequel on appelle la méthode** : `blackPearl.computeDamage(6)` utilise la puissance de feu de `blackPearl`, `seaWolf.computeDamage(6)` celle de `seaWolf`.

Voici deux autres méthodes, une qui modifie l'objet et une qui retourne un booléen :

```java
void takeDamage(int damage) {
    hull = Math.max(0, hull - damage);
}

boolean isSunk() {
    return hull == 0;
}
```

Une méthode peut en appeler une autre de la même classe, sans préfixe : l'appel s'applique alors à l'objet courant (voir `this`).

```java
void display() {
    System.out.println(name + " : coque " + hull + (isSunk() ? " (coulé)" : ""));
}
```

Retiens la répartition des rôles :

* la classe `Ship` contient la **définition** de ce qu'est un navire. Elle est écrite et compilée une seule fois ;
* la classe `Main` contient l'**utilisation** : au lancement, on crée autant d'objets qu'on veut. Chacun a ses valeurs d'attributs, mais le code des méthodes n'existe qu'en un seul exemplaire.

## Les constructeurs

Un **constructeur** décrit comment construire un objet. Il ressemble à une méthode, avec trois différences :

* il porte **exactement le nom de la classe** ;
* il n'a **pas de type de retour**, pas même `void` ;
* il ne s'appelle qu'avec `new`.

Tant que tu n'écris aucun constructeur, le compilateur en ajoute un automatiquement : le **constructeur par défaut**, sans paramètre. C'est celui qu'on a appelé jusqu'ici avec `new Ship()`. Dès que tu écris **au moins un** constructeur, le constructeur par défaut n'est **plus** généré.

```java
public void Ship() { }   // ce n'est PAS un constructeur : c'est une méthode nommée Ship
```

À cause du `void`, ceci est une méthode ordinaire. Le code compile, mais `new Ship()` appelle bien le constructeur par défaut, pas cette méthode. Piège classique.

Un constructeur sert à initialiser les attributs. Il peut prendre des paramètres :

```java
public class Ship {
    String name;
    int hull;
    int firepower;

    Ship(String paramName, int paramHull, int paramFirepower) {
        name = paramName;
        hull = paramHull;
        firepower = paramFirepower;
    }

    // méthodes...
}
```

```java
Ship blackPearl = new Ship("Black Pearl", 30, 5);
Ship seaWolf = new Ship("Sea Wolf", 20, 3);
```

Les trois lignes d'initialisation sont désormais écrites **une seule fois**, dans le constructeur. On peut aussi proposer plusieurs constructeurs (c'est de la **surcharge**, voir plus bas) :

```java
Ship() {
    name = "Unnamed sloop";
    hull = 20;
    firepower = 3;
}
```

Est-ce cohérent ? Cela dépend de ce qu'on veut modéliser. Un navire sans nom peut avoir du sens dans le jeu (une chaloupe de départ). En revanche, ne pas imposer de renseigner des informations indispensables est une source d'erreurs. **Si tu supprimes le constructeur sans paramètre, `new Ship()` ne compile plus** :

```
error: constructor Ship in class Ship cannot be applied to given types;
  required: String,int,int
  found:    no arguments
```

Le constructeur devient ainsi un moyen de **garantir** qu'un objet est toujours créé avec les informations nécessaires.

## La visibilité : `public` et `private`

Chaque élément d'une classe (attribut, constructeur, méthode) possède une **visibilité**, placée devant sa déclaration, qui indique **qui peut l'utiliser**. Deux mots-clés suffisent pour commencer :

* **`public`** : accessible depuis n'importe quelle autre classe ;
* **`private`** : accessible uniquement **depuis l'intérieur de la classe** qui le contient.

```java
public class Ship {
    public String name;
    private int hull;
    // ...
}
```

```java
blackPearl.name = "Black Pearl";   // accepté : name est public
blackPearl.hull = 30;              // erreur : hull has private access in Ship
```

`private` s'applique à la **classe**, pas à l'instance : dans `Ship`, une méthode peut lire les attributs privés d'un **autre** `Ship` :

```java
public boolean hasMoreFirepowerThan(Ship other) {
    return this.firepower > other.firepower;   // accepté : on est dans la classe Ship
}
```

Quelques repères de conception :

* les **attributs** sont `private` (on en explique la raison juste après) ;
* les **constructeurs** sont en général `public` ;
* les **méthodes** destinées aux autres classes sont `public`, les méthodes utilitaires internes sont `private`.

Il existe deux autres niveaux : la visibilité **package** (aucun modificateur : visible par les classes du même package) et `protected` (lié à l'héritage). Ils sont vus avec les packages et l'héritage.

## L'encapsulation

### Le problème

Si `hull` est `public`, n'importe quel code peut écrire n'importe quelle valeur :

```java
blackPearl.hull = -500;
```

Le compilateur ne dit rien. Le programme, lui, se retrouve avec un navire à la coque négative, et des résultats absurdes (est-il coulé ? combien reste-t-il de points ?). L'objet est dans un **état invalide**.

L'**encapsulation** a pour but d'empêcher cela. Le principe :

* déclarer les attributs `private`, pour interdire l'accès direct de l'extérieur ;
* n'offrir l'accès à l'objet que par des **méthodes publiques**, qui peuvent contrôler ce qui est lu et ce qui est modifié.

Celui qui écrit la classe garde ainsi la maîtrise de son fonctionnement : les autres développeurs ne peuvent pas la manipuler n'importe comment.

### Les getters

Pour **lire** un attribut privé, on écrit un **getter** (*accesseur*). Par convention, il s'appelle `get` suivi du nom de l'attribut en `camelCase` ; pour un booléen, on utilise plutôt `is` (`isSunk()`). Il est en général `public`.

```java
public String getName() {
    return name;
}

public int getHull() {
    return hull;
}
```

```java
System.out.println(blackPearl.getHull());
```

### Les setters

Pour **modifier** un attribut privé, on écrit un **setter** (*mutateur*) : `set` suivi du nom de l'attribut, `public`, `void`, avec la nouvelle valeur en paramètre. Son intérêt est de pouvoir **contrôler** la modification :

```java
public void setHull(int hull) {
    if (hull < 0) {
        throw new IllegalArgumentException("La coque ne peut pas être négative");
    }
    this.hull = hull;
}
```

> `throw new IllegalArgumentException(...)` signale une erreur et interrompt la méthode. Les exceptions sont l'objet d'un prochain chapitre ; pour l'instant, retiens que c'est la façon de refuser une valeur invalide.

Attention : si le setter contrôle la valeur mais pas le **constructeur**, on peut quand même créer un objet invalide avec `new Ship("Fantôme", -5, 3)`. Le constructeur doit appliquer **les mêmes règles**.

### Getters et setters ne sont pas obligatoires

C'est la personne qui conçoit la classe qui décide de ce qu'elle autorise :

* un getter **sans** setter : l'attribut est en lecture seule (le nom d'un navire ne change pas) ;
* ni l'un ni l'autre : l'attribut est purement interne.

Un setter **sans aucun contrôle** n'apporte guère plus qu'un attribut `public`. Quand c'est possible, préfère une méthode qui exprime une **action métier** : `takeDamage(5)` et `repair(3)` en disent plus, et protègent mieux, que `setHull(hull - 5)`.

```java
public void takeDamage(int damage) {
    hull = Math.max(0, hull - damage);   // la coque ne passe jamais sous 0
}
```

### Générer le code avec IntelliJ

IntelliJ peut générer constructeurs, getters et setters : clic droit dans la classe, puis **Generate** (raccourci par défaut : `Alt + Insert`), puis le choix voulu (*Constructor*, *Getter*, *Setter*, *toString()*...) et la sélection des attributs. Pratique, mais relis toujours le code généré : l'outil ne connaît pas tes règles de contrôle.

## `this` : l'objet courant

`this` est une référence à l'**objet sur lequel le code s'exécute**.

* Dans une **méthode**, `this` est l'objet qui a reçu l'appel : avec `blackPearl.display()`, `this` désigne `blackPearl` dans le corps de `display`.
* Dans un **constructeur**, `this` est l'objet en cours de construction.

Il a quatre usages.

**1. Désigner explicitement un attribut** : `this.hull`.

**2. Lever l'ambiguïté quand un paramètre porte le même nom qu'un attribut.** C'est le cas typique des constructeurs et des setters générés par l'IDE :

```java
public Ship(String name, int hull, int firepower) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
}
```

Dans le corps, `name` désigne le **paramètre** (la variable locale prend le dessus), et `this.name` désigne l'**attribut**. Sans `this`, `name = name;` affecte le paramètre à lui-même : le code **compile**, mais l'attribut reste à sa valeur par défaut (`null`, `0`...). C'est un bug silencieux.

**3. Appeler un autre constructeur de la même classe** avec `this(...)`, pour ne pas dupliquer le code :

```java
public Ship(String name) {
    this(name, 20, 3);   // une chaloupe standard
}
```

L'appel `this(...)` doit être la **première instruction** du constructeur, et un constructeur ne peut pas s'appeler lui-même, directement ou en cycle. Avec JDK 21 :

```
error: call to this must be first statement in constructor
error: recursive constructor invocation
```

> Les versions récentes de Java assouplissent la règle de la première instruction (JEP 513, finalisé dans Java 25) : on pourra écrire certaines instructions avant `this(...)`, à condition de ne pas utiliser l'objet en cours de construction. Avec JDK 21, la règle ci-dessus s'applique.

**4. Retourner l'objet courant** avec `return this`, pour **enchaîner** les appels (*method chaining*) :

```java
public Ship load(int barrels) {
    this.cargo += barrels;
    return this;
}
```

```java
blackPearl.load(5).load(3);   // 8 tonneaux au total
```

Il n'y a aucune copie : chaque appel renvoie `blackPearl` lui-même, modifié. On retrouve ce style dans le patron de conception *Builder*.

Une dernière limite : `this` **n'existe pas** dans un contexte `static` (voir plus bas).

## La surcharge

La **surcharge** (*overloading*) consiste à écrire, dans une même classe, **plusieurs méthodes ou constructeurs de même nom** dont la **liste de paramètres diffère**. Le compilateur choisit la bonne version d'après les arguments de l'appel.

```java
public void repair() {
    repair(1);               // réparation minimale
}

public void repair(int points) {
    hull = Math.min(MAX_HULL, hull + points);
}
```

```java
blackPearl.repair();      // +1
blackPearl.repair(10);    // +10
```

Java n'a pas de paramètres optionnels : la surcharge permet de les simuler. Remarque que la première version **délègue** à la seconde : si la logique évolue (une validation, par exemple), on ne la modifie qu'à un endroit. C'est la même idée que `this(...)` pour les constructeurs.

### Ce qui fait la différence

La **signature** d'une méthode est son nom plus le **nombre, le type et l'ordre** de ses paramètres. Pour surcharger, un de ces éléments doit changer :

```java
void display()                       // aucun paramètre
void display(String prefix)          // un paramètre
void display(int round, String s)    // types différents
void display(String s, int round)    // ordre différent : valide aussi
```

Ce qui **ne suffit pas** :

* changer seulement le **type de retour** : `error: method area() is already defined in class Ship` ;
* changer seulement le **nom des paramètres** : `f(int a)` et `f(int b)` sont identiques ;
* changer seulement les modificateurs (`public`, `static`) ou la clause `throws`.

### Les pièges

**Les conversions implicites.** Java choisit la version la plus spécifique, en élargissant au besoin (`int` vers `long`, puis `double`) :

```java
static void show(long x)   { System.out.println("long"); }
static void show(double x) { System.out.println("double"); }

show(5);   // affiche "long"
```

**L'ambiguïté.** Si aucune version n'est clairement meilleure, le compilateur refuse :

```java
static void f(int a, double b) { }
static void f(double a, int b) { }

f(1, 2);   // error: reference to f is ambiguous
```

**Le choix se fait sur le type déclaré, pas sur le type réel de l'objet.**

```java
static void print(Object o) { System.out.println("Object"); }
static void print(String s) { System.out.println("String"); }

Object x = "hello";
print(x);          // affiche "Object", car x est déclaré Object
print("hello");    // affiche "String"
```

### Surcharge et redéfinition : ne pas confondre

| | Surcharge (*overload*) | Redéfinition (*override*) |
| --- | --- | --- |
| Où | dans la même classe (ou une classe parente) | dans une sous-classe |
| Signature | **différente** | **identique** |
| Choix de la version | à la compilation | à l'exécution |
| Annotation | aucune | `@Override` |

La redéfinition est liée à l'héritage et au polymorphisme : elle est vue dans les chapitres suivants.

## Les références : ce que contient une variable

Une variable est une boîte. Ce qu'elle contient dépend de son type :

* un **type primitif** (`int`, `double`...) : la boîte contient **la valeur** ;
* un **type classe** (`Ship`, `String`...) : la boîte contient une **référence**, une « flèche » vers l'objet, rangé ailleurs en mémoire.

Une variable n'est donc pas un objet : c'est un moyen d'y accéder. L'objet est créé par `new`, qui retourne la référence rangée dans la variable.

```java
Ship ship1 = new Ship("Black Pearl", 30, 5);
```

```
  ship1  ┌───┐         ┌──────────────────────┐
         │ ──┼───────▶ │ Ship                 │
         └───┘         │ name  : "Black Pearl"│
                       │ hull  : 30           │
                       └──────────────────────┘
```

> On entend parfois « adresse mémoire » : c'est une simplification. Java manipule des références et n'expose pas d'adresses. Ce qu'affiche un `System.out.println` sur un objet sans `toString` (`Ship@1b6d3586`) est le nom de la classe suivi d'un code de hachage, **pas** une adresse.

### Copier une variable

L'affectation `=` copie **le contenu de la boîte**.

**Type primitif : on copie la valeur.** Les deux variables sont indépendantes.

```java
int a = 5;
int b = a;
b = 6;        // a vaut toujours 5
```

**Type classe : on copie la référence.** Il n'y a **aucun nouvel objet** : les deux variables pointent vers le même.

```java
Ship ship2 = ship1;      // copie de la flèche, pas du navire
ship2.takeDamage(3);
System.out.println(ship1.getHull());   // 27 : c'est le même objet
```

```
  ship1  ┌───┐
         │ ──┼───┐
         └───┘   │      ┌──────────────────────┐
                 ├────▶ │ Ship (hull : 27)     │
  ship2  ┌───┐   │      └──────────────────────┘
         │ ──┼───┘
         └───┘
```

Conséquence : `==` sur deux objets compare les **références**, pas le contenu. Deux navires identiques créés par deux `new` sont deux objets distincts :

```java
Ship s1 = new Ship("Sea Wolf", 20, 3);
Ship s2 = new Ship("Sea Wolf", 20, 3);
System.out.println(s1 == s2);   // false
```

Pour comparer le contenu, on utilise la méthode `equals`, que tu écriras toi-même plus loin dans le cours.

### Passer un objet à une méthode

Java passe **toujours** les arguments **par valeur** (voir chapitre 6) : le paramètre reçoit une **copie du contenu** de l'argument. Pour un objet, ce contenu est une référence : c'est donc **la flèche** qui est copiée, pas le navire.

```java
static void hit(Ship paramShip) {
    paramShip.takeDamage(5);
}

static void replace(Ship paramShip) {
    paramShip = new Ship("Autre navire");
}
```

À l'appel, il y a **deux flèches vers un seul objet** :

```
  ship1      ┌───┐
  (main)     │ ──┼───┐
             └───┘   │      ┌──────────────────────┐
                     ├────▶ │ Ship                 │
  paramShip  ┌───┐   │      └──────────────────────┘
  (méthode)  │ ──┼───┘
             └───┘
```

On peut alors faire deux choses très différentes.

**A. Suivre la flèche et modifier l'objet.** La modification est **visible depuis l'appelant**, car il s'agit du même objet :

```java
hit(ship1);
System.out.println(ship1.getHull());   // 5 de moins
```

**B. Changer la flèche.** Seule la **copie** de la flèche change : la variable de l'appelant n'a pas bougé.

```java
replace(ship1);
System.out.println(ship1.getName());   // toujours "Black Pearl"
```

À la fin de la méthode, `paramShip` disparaît. Le navire créé n'est plus accessible : Java le supprime automatiquement (c'est le **ramasse-miettes**, ou *garbage collector*).

Les deux actions peuvent se succéder dans la même méthode. Tant que le paramètre n'est pas réaffecté, il partage l'objet de l'appelant ; dès qu'il l'est, **le lien est coupé**.

```java
static void demo(Ship paramShip) {
    paramShip.takeDamage(10);               // même objet que l'appelant : visible chez lui
    paramShip = new Ship("Autre navire");   // paramShip pointe vers un nouvel objet
    paramShip.takeDamage(10);               // modifie seulement le nouvel objet
}
```

Une méthode ne peut donc **jamais** réaffecter la variable de l'appelant. Elle peut en revanche **retourner** une référence, que l'appelant range où il veut :

```java
static Ship createStarterShip() {
    return new Ship("Chaloupe");
}

ship1 = createStarterShip();   // ship1 pointe maintenant vers le nouvel objet
```

| Dans la méthode, on... | Primitif | Objet |
| --- | --- | --- |
| modifie la valeur du paramètre | aucun effet sur l'original | (sans objet) |
| modifie l'**objet** pointé (`paramShip.takeDamage(5)`) | (sans objet) | **visible** chez l'appelant |
| **réaffecte** le paramètre (`paramShip = ...`) | aucun effet sur l'original | aucun effet sur l'original |

### Observer dans le débogueur

Place un point d'arrêt sur l'appel `hit(ship1);` et utilise `Step Into` (voir chapitre 6). Dans le panneau **Variables**, `paramShip` s'affiche avec un identifiant du type `{Ship@715}` ; en remontant à `main` dans **Frames**, `ship1` affiche **le même identifiant**. Le nombre varie d'une exécution à l'autre, mais l'égalité des deux montre qu'ils pointent vers le même objet. Après `paramShip = new Ship(...)`, `paramShip` affiche un autre identifiant, alors que `ship1` garde le sien.

## `toString` : afficher un objet

Que se passe-t-il si on affiche un objet directement ?

```java
System.out.println(ship1);   // affiche par exemple : Ship@1b6d3586
```

Ce n'est pas très parlant. Toutes les classes héritent d'une méthode `toString()` (de la classe `Object`, vue avec l'héritage) qui donne ce texte par défaut. On peut la **redéfinir** pour produire un affichage lisible :

```java
@Override
public String toString() {
    return name + " (coque " + hull + "/" + MAX_HULL + ", puissance de feu " + firepower + ")";
}
```

`println` et la concaténation avec `+` appellent `toString()` automatiquement :

```java
System.out.println(ship1);
// Black Pearl (coque 30/40, puissance de feu 5)
System.out.println("Navire : " + ship1);
```

> L'annotation `@Override` demande au compilateur de vérifier que tu redéfinis bien une méthode existante. Elle sera expliquée avec l'héritage ; prends dès maintenant l'habitude de l'écrire.

Une méthode `toString()` bien écrite est aussi précieuse dans le débogueur : IntelliJ l'affiche à côté de la variable.

## Le mot-clé `static`

Tu connais déjà `static` : c'est le mot de `public static void main`. Un membre `static` (attribut ou méthode) appartient à la **classe**, et non à une instance.

* **Attribut d'instance** (sans `static`) : chaque objet a sa propre copie.
* **Attribut de classe** (`static`) : **une seule copie**, partagée par tous les objets. Elle existe même si aucun objet n'a été créé.

### Un exemple... de ce qu'il ne faut pas faire

```java
public class Ship {
    private static int hull;      // partagé par tous les navires !
    private String name;

    public Ship(String name, int hull) {
        this.name = name;
        Ship.hull = hull;         // écrase la valeur pour TOUS les navires
    }
    // ...
}
```

```java
Ship blackPearl = new Ship("Black Pearl", 30);
Ship seaWolf = new Ship("Sea Wolf", 20);
// blackPearl.display() affiche maintenant une coque de 20 !
```

La coque est une donnée **propre à chaque navire** : elle ne doit pas être `static`. Un attribut `static` modifiable est en réalité un **état global**, partagé par tout le programme : il complique les tests et n'est pas sûr dès qu'on utilise plusieurs threads. On le réserve à ce qui est **vraiment commun à tous les objets**.

### Les bons usages

Un **compteur** d'instances :

```java
private static int shipCount = 0;

public Ship(...) {
    // ...
    shipCount++;
}

public static int getShipCount() {
    return shipCount;
}
```

Une **constante** (voir plus bas) :

```java
public static final int MAX_HULL = 40;
```

### Accéder à un membre `static`

On y accède par le **nom de la classe** : `Ship.getShipCount()`, `Ship.MAX_HULL`. Passer par un objet (`blackPearl.getShipCount()`) compile aussi, mais prête à confusion : à éviter (IntelliJ le signale).

### Méthodes `static` : leurs limites

Une méthode `static` convient quand son traitement **ne dépend d'aucun objet** en particulier (`Math.max`, par exemple). Elle a deux restrictions :

* pas de `this` : il n'y a pas d'objet courant ;
* elle ne peut accéder **directement** qu'aux membres `static`. Pour atteindre un membre d'instance, il lui faut une référence à un objet.

L'inverse est permis : une méthode d'instance peut utiliser librement les membres `static`.

```java
public static void show() {
    System.out.println(this.hull);   // error: non-static variable this cannot be referenced from a static context
    display();                       // error: non-static method display() cannot be referenced from a static context
}
```

C'est exactement l'erreur que tu rencontrais au chapitre 6 en appelant depuis `main` une méthode sans `static` : `main` est `static`, donc il ne peut pas appeler directement une méthode d'instance. Il faut d'abord créer un objet.

### La méthode `main`

```java
public static void main(String[] args)
```

* `public` : accessible par la JVM ;
* `static` : la JVM l'appelle **sans créer d'objet**. C'est le point d'entrée du programme, d'où l'aspect « procédural » du début du cours ;
* `void` : ne retourne rien ;
* `String[] args` : les arguments de la ligne de commande.

Le nom de la classe `Main` est une convention : n'importe quelle classe peut contenir un `main`. Depuis `main`, on crée des objets et on appelle leurs méthodes : le reste du programme devient orienté objet.

> Java 21 propose en préversion une forme simplifiée de `main` (sans `static`, sans `String[] args`), finalisée dans une version plus récente (Java 25). Nous restons sur la forme classique, la seule qui fonctionne partout.

### Les classes utilitaires

`Math` ne contient que des membres `static` : des constantes (`Math.PI`) et des méthodes (`Math.max`, `Math.sqrt`...). Sa classe est `final` et son constructeur `private` : on ne peut pas écrire `new Math()`. `Arrays` (`Arrays.toString`, `Arrays.sort`...) suit le même principe.

Pour écrire ta propre classe utilitaire : classe `final`, constructeur `private`, méthodes `static`.

## Le mot-clé `final`

`final` signifie qu'une variable **ne peut être affectée qu'une seule fois**.

```java
private final String name;
```

Un attribut `final` doit être initialisé, sinon le code ne compile pas. Il peut l'être :

* **à la déclaration** : `private final int firepower = 3;` ;
* **dans le constructeur** : chaque constructeur doit l'affecter, exactement une fois.

```java
public class Ship {
    private final String name;

    public Ship(String name) {
        this.name = name;
    }
}
```

Sans cela, ou si on tente de réaffecter :

```
error: variable name not initialized in the default constructor       (aucun constructeur écrit)
error: variable firepower might not have been initialized             (constructeur qui l'oublie)
error: cannot assign a value to final variable firepower              (réaffectation)
```

### `final` n'est pas `static`

Un attribut `final` n'est **pas partagé** : chaque objet a sa propre valeur, fixée une fois pour toutes à la construction.

| | Partagé entre les objets | Modifiable |
| --- | --- | --- |
| `private int hull` | non | oui |
| `private static int hull` | oui | oui |
| `private final String name` | non | non (après initialisation) |
| `public static final int MAX_HULL` | oui | non |

### Les objets immuables

Une classe dont **tous les attributs sont `final`** produit des objets **immuables** : une fois construits, leur état ne change plus. C'est plus sûr et plus simple à raisonner. `String` en est l'exemple le plus connu. On fournit alors des getters, mais **aucun setter**.

**Piège :** `final` empêche de **réaffecter** la variable, pas de **modifier l'objet** vers lequel elle pointe.

```java
final int[] values = new int[3];
values[0] = 5;             // accepté : on modifie le contenu du tableau
values = new int[5];       // error: cannot assign a value to final variable values
```

Il en va de même pour une liste ou n'importe quel objet modifiable. Une classe n'est vraiment immuable que si ses attributs `final` sont eux-mêmes de types immuables (`int`, `String`...).

### `final` sur un paramètre ou une variable locale

```java
public Ship(final String name) {
    name = "Autre";   // error: final parameter name may not be assigned
}
```

Cela évite d'écraser un paramètre par erreur, mais ne change rien pour l'appelant (Java passe tout par valeur). Si le paramètre est un objet, `final` interdit de changer la référence, pas de modifier l'objet. En pratique, on l'utilise peu sur les paramètres.

`final` existe aussi sur les **méthodes** (elles ne peuvent plus être redéfinies) et sur les **classes** (elles ne peuvent plus être étendues, comme `String` ou `Math`) : ces deux usages sont vus avec l'héritage.

## Les constantes : `static final`

Combiner les deux mots-clés donne une **constante de classe** : une valeur unique, partagée, qui ne change jamais.

```java
public class Ship {
    public static final int MAX_HULL = 40;      // accessible de l'extérieur
    private static final int MIN_FIREPOWER = 1; // usage interne
    // ...
}
```

```java
System.out.println(Ship.MAX_HULL);   // 40, sans créer d'objet
```

Points à connaître :

* **Nommage** : `UPPER_SNAKE_CASE` (majuscules, mots séparés par `_`), par convention de la communauté Java (`Math.PI`, `Integer.MAX_VALUE`).
* **Initialisation** : à la déclaration. Elle ne peut **pas** se faire dans un constructeur, qui s'exécute à chaque création d'objet alors qu'une constante n'appartient à aucun objet :

  ```
  error: cannot assign a value to static final variable W
  ```

  Si l'initialisation demande plusieurs instructions, on utilise un bloc `static { ... }`, plus rare.
* **Visibilité** : une constante `public` n'a pas besoin de getter. Comme elle ne peut pas être modifiée, l'exposer ne casse pas l'encapsulation.
* **Intérêt** : éviter les « nombres magiques » (`Ship.MAX_HULL` est plus lisible que `40` répété partout), n'avoir qu'**un seul endroit à modifier**, et ne stocker la valeur qu'une fois.

Deux précautions :

* `final` ne rend pas immuable ce qui est pointé. Une constante `public static final int[] SIZES = {10, 20};` voit son contenu modifiable (`SIZES[0] = 99;` compile). Réserve les constantes publiques aux types immuables (`int`, `String`...).
* Pour une constante de type primitif ou `String` initialisée avec un littéral, le compilateur recopie la valeur dans les classes qui l'utilisent. Si tu la modifies, **recompile** aussi celles-ci.

## La Javadoc

### Les commentaires en Java

Java propose trois formes de commentaires :

```java
// commentaire sur une ligne

/* commentaire
   sur plusieurs lignes */

/**
 * Commentaire de documentation (Javadoc)
 */
```

Les deux premiers n'existent que dans le fichier source : ils disparaissent du bytecode. Ils servent à celui qui **lit** le code, en général pour expliquer le *pourquoi* d'un choix.

La **Javadoc** (`/** ... */`) est reconnue par des outils (l'IDE, l'outil `javadoc`) qui s'en servent pour documenter la classe à celui qui **utilise** le code, sans qu'il ait à lire l'implémentation.

### Écrire de la Javadoc

Elle se place **juste au-dessus** de l'élément documenté (classe, attribut, constructeur, méthode), avant ses annotations comme `@Override`. La **première phrase** est le résumé : elle apparaît dans les listes de la documentation générée, on la rédige donc comme une phrase complète qui se termine par un point.

Des balises commençant par `@` complètent la description :

| Balise | S'applique à | Rôle |
| --- | --- | --- |
| `@param nom description` | méthode, constructeur | décrit un paramètre (une balise par paramètre) |
| `@return description` | méthode non `void` | décrit la valeur retournée |
| `@throws Exception description` | méthode, constructeur | exception pouvant être levée |
| `@see` | tous | renvoie vers un autre élément |
| `@since` | classe, méthode | version à partir de laquelle l'élément existe |
| `@deprecated` | tous | élément à ne plus utiliser, avec l'alternative |
| `@author`, `@version` | classe | auteur, version (de moins en moins utilisées : Git conserve ces informations) |

On peut insérer du code dans le texte avec `{@code ...}` et un lien avec `{@link Ship}`.

```java
/**
 * Représente un navire du jeu.
 */
public class Ship {
    /** Nombre maximal de points de coque. */
    public static final int MAX_HULL = 40;

    private final String name;
    private int hull;
    private final int firepower;

    /**
     * Crée un navire.
     *
     * @param name      le nom du navire
     * @param hull      les points de coque initiaux, entre 0 et {@link #MAX_HULL}
     * @param firepower la puissance de feu
     * @throws IllegalArgumentException si la coque est hors des bornes autorisées
     */
    public Ship(String name, int hull, int firepower) {
        // ...
    }

    /**
     * Calcule les dégâts infligés par une attaque.
     *
     * @param diceRoll le résultat du dé (entre 1 et 6)
     * @return les dégâts, jamais négatifs
     */
    public int computeDamage(int diceRoll) {
        return Math.max(0, firepower + diceRoll - 4);
    }
}
```

Pour une méthode surchargée, chaque version a **sa propre Javadoc** : c'est elle qui permet de savoir laquelle choisir.

### Où la voit-on ?

* **Dans l'IDE** : en survolant un nom de classe ou de méthode, une bulle affiche sa documentation. Dans IntelliJ, taper `/**` puis `Entrée` au-dessus d'une méthode génère le squelette avec les `@param` et `@return`.
* **En HTML** : l'outil `javadoc` génère un site à partir des commentaires. Dans IntelliJ : *Tools*, puis *Generate JavaDoc*. En ligne de commande :

```bash
javadoc -d doc src/*.java
```

Les commentaires ne sont pas conservés dans les `.class` : pour une bibliothèque déjà compilée, l'IDE a besoin d'accéder aux sources ou à la documentation associée.

### Bonnes pratiques

* **Documente ce qui est utilisé par d'autres** : classes, constructeurs et méthodes `public`. Par défaut, `javadoc` ne génère d'ailleurs que ceux-là.
* **Décris le contrat** (ce que fait l'élément, ses paramètres, son résultat, ses cas d'erreur), pas le code. « Retourne la coque » sur `getHull()` n'apporte rien.
* **Garde-la à jour** : une documentation fausse est pire que pas de documentation.

## Exemple complet

Voici la classe `Ship` qui rassemble tout ce chapitre (`MAX_HULL`, utilisée plus haut dans `repair`, y est définie).

`Ship.java`

```java
public class Ship {
    public static final int MAX_HULL = 40;
    private static int shipCount = 0;

    private final String name;
    private int hull;
    private final int firepower;

    public Ship(String name, int hull, int firepower) {
        if (hull < 0 || hull > MAX_HULL) {
            throw new IllegalArgumentException("La coque doit être comprise entre 0 et " + MAX_HULL);
        }
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        shipCount++;
    }

    public Ship(String name) {
        this(name, 20, 3);
    }

    public String getName() { return name; }
    public int getHull() { return hull; }
    public int getFirepower() { return firepower; }

    public boolean isSunk() {
        return hull == 0;
    }

    public int computeDamage(int diceRoll) {
        return Math.max(0, firepower + diceRoll - 4);
    }

    public void takeDamage(int damage) {
        hull = Math.max(0, hull - damage);
    }

    public void repair() {
        repair(1);
    }

    public void repair(int points) {
        hull = Math.min(MAX_HULL, hull + points);
    }

    public boolean hasMoreFirepowerThan(Ship other) {
        return this.firepower > other.firepower;
    }

    public static int getShipCount() {
        return shipCount;
    }

    @Override
    public String toString() {
        return name + " (coque " + hull + "/" + MAX_HULL + ", puissance de feu " + firepower + ")";
    }
}
```

`Main.java`

```java
public class Main {
    public static void main(String[] args) {
        Ship blackPearl = new Ship("Black Pearl", 30, 5);
        Ship seaWolf = new Ship("Sea Wolf");

        System.out.println(blackPearl);   // Black Pearl (coque 30/40, puissance de feu 5)
        System.out.println(seaWolf);      // Sea Wolf (coque 20/40, puissance de feu 3)

        System.out.println(blackPearl.computeDamage(6));   // 7
        blackPearl.takeDamage(8);
        blackPearl.repair();
        System.out.println(blackPearl.getHull());          // 23

        System.out.println(blackPearl.hasMoreFirepowerThan(seaWolf));   // true
        System.out.println(Ship.getShipCount());                        // 2
    }
}
```

Dans cette classe, `name` et `firepower` sont `final` (un navire ne change ni de nom ni de canons), `hull` est modifiable mais **uniquement** par `takeDamage` et `repair`, qui garantissent qu'elle reste entre 0 et `MAX_HULL`. Il est impossible de créer un navire invalide depuis l'extérieur.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Utiliser un objet non initialisé | `variable a might not have been initialized` | Une variable locale doit être initialisée (avec `new` ou `null`). |
| Appeler une méthode sur `null` | `NullPointerException` à l'exécution | La variable ne référence aucun objet. |
| Appeler un constructeur qui n'existe pas | `constructor Ship in class Ship cannot be applied to given types` | Dès qu'un constructeur est écrit, le constructeur par défaut disparaît. |
| Écrire `void` devant un constructeur | aucune erreur, mais ce n'est plus un constructeur | C'est une méthode nommée `Ship`. |
| Accéder à un attribut privé | `hull has private access in Ship` | Passer par un getter ou une méthode. |
| `name = name;` dans un constructeur | aucune erreur, mais l'attribut reste à `null` | Écrire `this.name = name;`. |
| Oublier d'initialiser un `final` | `variable firepower might not have been initialized` | Initialiser à la déclaration ou dans chaque constructeur. |
| Réaffecter un `final` | `cannot assign a value to final variable` | Un `final` ne s'affecte qu'une fois. |
| Utiliser `this` ou un membre d'instance dans du `static` | `non-static variable this cannot be referenced from a static context` | Une méthode `static` n'a pas d'objet courant. |
| Surcharger avec seulement un autre type de retour | `method area() is already defined in class Ship` | Les paramètres doivent différer. |
| Appel de surcharge ambigu | `reference to f is ambiguous` | Précise le type d'un argument avec un cast ou une valeur adaptée. |
| Comparer deux objets avec `==` | pas d'erreur, mais `false` | `==` compare les références, pas le contenu. |
| Croire qu'une méthode peut réaffecter la variable de l'appelant | pas d'erreur, mais aucun effet | Retourner la nouvelle référence. |
| Mettre `static` sur un attribut propre à chaque objet | une modification change tous les objets | `static` ne convient qu'à ce qui est commun à tous. |

## À retenir

* Une **classe** décrit un type (attributs, constructeurs, méthodes) ; un **objet** en est une instance, créée avec `new`.
* Une variable d'un type classe contient une **référence**, ou `null`. Copier la variable copie la référence, pas l'objet ; `==` compare les références.
* Un **constructeur** porte le nom de la classe et n'a pas de type de retour. Si tu n'en écris aucun, Java en fournit un sans paramètre ; dès que tu en écris un, il disparaît.
* **Encapsulation** : attributs `private`, accès par des méthodes `public` qui contrôlent l'état. Le constructeur applique les mêmes règles que les setters.
* `this` désigne l'objet courant : lever une ambiguïté, appeler un autre constructeur (`this(...)`), enchaîner (`return this`).
* La **surcharge** : même nom, paramètres différents ; le choix se fait à la compilation.
* `static` : appartient à la classe, partagé, sans `this`. `final` : une seule affectation. `static final` : constante.
* Java passe tout **par valeur** : pour un objet, une copie de la référence. On peut modifier l'objet, pas réaffecter la variable de l'appelant.
* La **Javadoc** documente le contrat de ce qui est public.

## À toi de jouer

1. Écris une classe `Captain` avec les attributs privés `name` (non modifiable) et `gold`. Ajoute un constructeur, un getter pour chaque attribut, et deux méthodes `earn(int amount)` et `spend(int amount)`. Refuse (par une `IllegalArgumentException`) un montant négatif, et un achat supérieur à l'or disponible.
2. Écris une classe `Cannon` avec un attribut `power` et une méthode `fire()` qui retourne `power + d6 - 4`, jamais négatif. Utilise un `Random` ou `Math.random()` pour le dé.
3. Ajoute à `Ship` une méthode `isStrongerThan(Ship other)` qui compare la coque **et** la puissance de feu de deux navires (à toi de définir la règle). Pourquoi peut-elle lire directement `other.hull`, alors que `hull` est `private` ?
4. Crée un `Ship` avec une coque négative. Que se passe-t-il avec ta classe ? Modifie le constructeur pour empêcher cela, puis teste avec `try/catch` (le chapitre sur les exceptions en détaille le principe).
5. Écris deux constructeurs pour `Ship` : un complet, un qui crée une chaloupe standard (coque 20, puissance de feu 3) en déléguant avec `this(...)`.
6. Prévois ce qu'affiche ce programme **avant** de l'exécuter, puis dessine les flèches :

   ```java
   Ship a = new Ship("A", 10, 1);
   Ship b = a;
   b.takeDamage(4);
   Ship c = new Ship("A", 6, 1);
   System.out.println(a.getHull());
   System.out.println(a == b);
   System.out.println(a == c);
   ```

7. Écris une méthode `static void sinkAll(Ship[] fleet)` qui amène la coque de chaque navire d'un tableau à 0, et une méthode `static Ship[] createFleet(int size)` qui retourne un tableau de `size` chaloupes. Que contient un tableau de `Ship` juste après sa création, avant d'y ranger des navires ?
8. Ajoute un compteur `static` qui compte les navires créés, puis une méthode `static int getShipCount()`. Pourquoi le compteur est-il `static`, alors que la coque ne doit pas l'être ?
9. Écris la Javadoc complète de ta classe `Captain`, génère le site HTML, et ouvre-le dans un navigateur.
10. Dans le débogueur, place un point d'arrêt dans `takeDamage` et observe l'identifiant de l'objet affiché pour `this`, à chaque appel sur un navire différent.

**Solution de l'exercice 6 :** `a` et `b` désignent le même objet : après `b.takeDamage(4)`, `a.getHull()` vaut `6`. `a == b` est `true` (même référence). `a == c` est `false` (deux objets distincts, même si leurs valeurs sont identiques).

**Indice de l'exercice 7 :** les cases d'un tableau d'objets valent `null` tant qu'on n'y range rien ; appeler une méthode dessus lèverait une `NullPointerException`.

## Pour aller plus loin

* [Dev.java : classes et objets](https://dev.java/learn/language/oop/classes-objects/).
* [Dev.java : créer des classes](https://dev.java/learn/language/oop/classes-objects/creating-classes/).
* [Dev.java : créer et utiliser des objets](https://dev.java/learn/language/oop/classes-objects/creating-objects/).
* [Dev.java : définir des constructeurs](https://dev.java/learn/classes-objects/defining-constructors/).
* [Dev.java : appeler des méthodes et des constructeurs](https://dev.java/learn/classes-objects/calling-methods-constructors/).
* [Oracle : spécification des commentaires de documentation (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/javadoc/doc-comment-spec.html).
* [Oracle : l'outil Javadoc (JDK 21)](https://docs.oracle.com/en/java/javase/21/javadoc/javadoc-tool.html).
* [Spécification du langage Java : les classes (chapitre 8)](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html) (pour les curieux).
