# POO : La création des classes en Java

## Les bases de la Programmation Orientée Objet en Java

### Rappels sur la POO

(Voir cours sur la Programmation Orientée Objet)

La POO est une manière de modéliser les concepts et comportements pertinents pour le problème qu'on résout, en s'inspirant souvent (mais pas toujours) d'objets ou d'entités du monde réel. On appelle ça l'**abstraction** : on garde ce qui compte pour l'application, on ignore le reste.

Concrètement, on organise son code autour d'**objets** plutôt qu'autour d'une simple suite d'instructions. Au lieu de manipuler des données et des fonctions séparément, on les regroupe dans des objets qui représentent ces concepts : une voiture, un utilisateur, une commande, etc.

Chaque objet a :

- des **attributs** (ses données, ce qu'il est). Ex : un utilisateur a un nom, un email ;
- des **méthodes** (ses comportements, ce qu'il fait). Ex : un utilisateur peut se connecter, changer son mot de passe.

Une **classe** est le plan (le moule) qui décrit les attributs et les méthodes d'un type d'objets. Un **objet**, ou **instance**, est une réalisation concrète de ce plan, avec ses propres valeurs. À partir d'une classe, on peut créer autant d'objets que nécessaire.

Les 4 grands principes habituellement cités :

1. **Encapsulation** : les données d'un objet sont protégées, on n'y accède que via ses méthodes (pas de manipulation directe et anarchique).
2. **Héritage** : une classe peut hériter des attributs et méthodes d'une autre (ex : `Chien` hérite de `Animal`).
3. **Polymorphisme** : des objets différents peuvent répondre à un même appel de méthode chacun à leur façon (ex : `.crier()` fait « Whaou » pour un chien, « Miaou » pour un chat).
4. **Abstraction** : on expose seulement ce qui est nécessaire à l'utilisation de l'objet, on cache la complexité interne.

En résumé : la POO consiste à modéliser le code comme un ensemble d'objets qui interagissent entre eux, chacun responsable de ses propres données et comportements, en ne retenant de chaque concept que ce qui est pertinent pour le problème à résoudre.

Java est un langage orienté objet, même si ses types primitifs (`int`, `double`...) ne sont pas des objets.

### Exemple

On veut créer un programme permettant de schématiser une rue composée de plusieurs terrains situés le long de cette rue.

Un terrain est défini par une **largeur** (sur la rue) et une **longueur** (sa profondeur). Par simplicité, on dira qu'un terrain a une forme rectangulaire.

De manière séquentielle, on pourrait écrire :

`Main.java`

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        int widthFieldOne = 12;
        int lengthFieldOne = 32;

        System.out.println("Mon terrain 1 a une largeur de " + widthFieldOne + "m et une longueur de " + lengthFieldOne + "m");

        int widthFieldTwo = 15;
        int lengthFieldTwo = 42;

        System.out.println("Mon terrain 2 a une largeur de " + widthFieldTwo + "m et une longueur de " + lengthFieldTwo + "m");
    }
}
```

Avec cette méthode, pour ajouter un terrain, il faut dupliquer du code (les variables et l'affichage). De plus, rien ne relie la largeur et la longueur d'un même terrain : ce sont des variables indépendantes. Le programme devient difficile à maintenir et à faire évoluer.

C'est là que la programmation orientée objet intervient pour résoudre ce genre de problèmes.

### Création d'une classe `Field`

Le premier avantage de la POO est la possibilité de **créer son propre type**. En Java, on crée pour cela une nouvelle classe. Cette classe, appelée `Field`, représente ce qu'est un terrain.

`Field.java`

```java
public class Field {
    ...
}
```

Règles :

- une classe `public` est écrite dans un fichier du **même nom** (`Field.java`) ;
- par convention, un nom de classe commence par une majuscule (`PascalCase`) ;
- à la compilation, chaque classe produit un fichier `.class` (le bytecode). Le compilateur le régénère à chaque modification de la classe.

### Phase 1 : Déclaration

On peut maintenant déclarer, dans `Main`, deux variables de type `Field` :

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux variables de type Field
        Field myFieldOne;
        Field myFieldTwo;
    }
}
```

Ici, `myFieldOne` est une variable dont le **type** est `Field`. Contrairement au type primitif `int`, qui s'écrit en minuscules, `Field` commence par une majuscule : c'est une classe.

Une variable d'un type primitif contient **la valeur** ; une variable d'un type classe contient une **référence** vers un objet (voir plus loin).

À ce stade, aucun objet n'existe : la variable est seulement déclarée. L'utiliser avant de l'avoir initialisée est une erreur de compilation.

### Phase 2 : Initialisation

Pour créer un objet, on utilise le mot-clé `new` suivi du **constructeur** : `new Field()`.

`new` effectue plusieurs opérations :

1. il **alloue** de la mémoire pour l'objet (sur le tas, ou *heap*) ;
2. il initialise ses attributs à leurs valeurs par défaut ;
3. il **exécute le constructeur**, qui finit d'initialiser l'objet ;
4. il **retourne une référence** vers l'objet créé.

Cette référence est rangée dans la variable : `myFieldOne` ne contient pas l'objet, mais de quoi le retrouver. On peut la voir comme un pointeur vers l'emplacement mémoire de l'objet (Java n'expose pas l'adresse elle-même, il ne manipule que des références).

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        Field myFieldOne;
        Field myFieldTwo;

        // initialisation par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field();

        // déclaration et initialisation peuvent aussi s'écrire en une ligne :
        // Field myFieldOne = new Field();
    }
}
```

Une variable de type classe peut aussi **ne référencer aucun objet** : elle vaut alors `null`.

```java
Field myFieldThree = null;
myFieldThree.display();   // 💥 NullPointerException à l'exécution
```

Une variable locale non initialisée est refusée par le compilateur, alors que `null` est une valeur explicite. Utiliser une variable qui vaut `null` provoque une `NullPointerException` (voir le chapitre sur la composition).

### Phase 3 : Utilisation

Pour l'instant, la classe `Field` est vide. Qu'est-ce qui définit un terrain ? Pour répondre, on utilise des **attributs**.

Un terrain se définit par une largeur `width` et une longueur `length`, toutes deux de type `int`. Ces attributs définissent la **structure** de l'objet. Un attribut est aussi appelé un **champ** (*field* en anglais : coïncidence de vocabulaire avec le nom de notre classe).

Chaque objet créé aura ses propres emplacements mémoire pour `width` et `length`.

`Field.java`

```java
public class Field {
    int width;
    int length;
}
```

(Ces attributs n'ont pas de modificateur d'accès pour l'instant : on verra plus loin qu'on les déclare normalement `private`.)

Un attribut non initialisé reçoit une **valeur par défaut** : `0` pour `int`, `0.0` pour `double`, `false` pour `boolean`, `null` pour un type classe. Cela ne vaut que pour les attributs, pas pour les variables locales.

Pour accéder aux attributs d'un objet, on utilise l'opérateur `.` sur la variable :

```java
Field myFieldOne = new Field();
Field myFieldTwo = new Field();

myFieldOne.width = 12;
myFieldOne.length = 32;

myFieldTwo.width = 15;
myFieldTwo.length = 42;
```

On attribue ici une largeur de 12 et une longueur de 32 au premier terrain, et une largeur de 15 et une longueur de 42 au second.

Les deux objets sont du même type et ont la même structure, mais ils ne sont pas dans le même **état**, puisque leurs valeurs diffèrent.

### Les méthodes de classes

Il reste à définir les **capacités** de la classe, c'est-à-dire son comportement. On déclare pour cela des fonctions appelées **méthodes**, que l'on appelle depuis les objets avec l'opérateur `.`.

Que peut-on faire avec un terrain ? Par exemple calculer sa superficie. On déclare une méthode `area` qui retourne un `int` : longueur × largeur.

```java
public class Field {
    int width;
    int length;

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }
}
```

On appelle la méthode sur un objet. Le résultat peut être rangé dans une variable (préférable s'il est réutilisé), ou utilisé directement :

```java
int areaFieldOne = myFieldOne.area();
System.out.println("Superficie du terrain 1 : " + areaFieldOne + "m2.");
System.out.println("Superficie du terrain 2 : " + myFieldTwo.area() + "m2.");
```

La classe `Main` contient l'**utilisation** des objets `Field`, alors que la classe `Field` contient la **définition** de ce qu'est un terrain. La définition n'est écrite et compilée qu'une fois ; au lancement du programme, on crée autant d'objets que nécessaire, qui sont la concrétisation en mémoire de cette définition. Chaque objet a ses propres valeurs d'attributs, mais le code des méthodes n'existe qu'en un seul exemplaire.

### La construction de l'objet

Un **constructeur** définit comment construire un objet.

Si aucun constructeur n'est écrit dans la classe, le compilateur ajoute automatiquement un **constructeur par défaut**, sans paramètre : c'est celui qu'on a appelé jusqu'ici avec `new Field()`. Dès qu'on écrit **au moins un** constructeur, le constructeur par défaut n'est plus généré.

Un constructeur ressemble à une méthode, mais :

- il porte **le même nom que la classe** ;
- il n'a **pas de type de retour** (pas même `void`) ;
- il n'est appelé qu'avec `new`.

```java
public void Field() { }   // ❌ ce n'est pas un constructeur : c'est une méthode nommée Field (à cause de void)
```

Le constructeur permet d'initialiser les attributs, par exemple avec des valeurs par défaut :

```java
public class Field {
    int width;
    int length;

    Field() {
        width = 8;
        length = 10;
    }

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }
}
```

```java
Field myFieldOne = new Field();   // 8 x 10, valeurs du constructeur
Field myFieldTwo = new Field();
myFieldTwo.width = 15;            // écrase la valeur du constructeur
myFieldTwo.length = 42;
```

`myFieldOne` a les valeurs définies dans le constructeur, alors que `myFieldTwo` a les valeurs attribuées après sa création, qui écrasent celles du constructeur.

On peut ajouter un second constructeur qui prend des paramètres (c'est une **surcharge**, voir plus loin) :

```java
public class Field {
    int width;
    int length;

    Field() {
        width = 8;
        length = 10;
    }

    Field(int paramWidth, int paramLength) {
        width = paramWidth;
        length = paramLength;
    }

    // ...
}
```

```java
Field myFieldOne = new Field();            // 8 x 10
Field myFieldTwo = new Field(15, 42);      // 15 x 42
```

On choisit le constructeur selon les informations dont on dispose : valeurs par défaut si on ne connaît pas les données, constructeur avec paramètres si elles sont connues.

Cet exemple n'est pas très cohérent : une largeur et une longueur « par défaut » n'ont guère de sens pour un terrain. On pourrait supprimer le constructeur sans paramètre et ne garder que celui qui demande la largeur et la longueur. Pour construire un `Field`, il faudrait alors **obligatoirement** les renseigner : `new Field()` ne compilerait plus.

### Structure de classe

```java
public class Field {
    int width;
    int length;

    Field(int paramWidth, int paramLength) {
        width = paramWidth;
        length = paramLength;
    }

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }
}
```

On a ici une bonne représentation de la structure d'une classe :

1. les **attributs** ;
2. le ou les **constructeurs** ;
3. les **méthodes**.

Ce n'est pas une obligation du compilateur, mais une convention de lisibilité qui permet de se repérer facilement dans une classe.

La classe sert de **moule** : les objets sont créés autant de fois que nécessaire en appelant son constructeur avec `new`.

### Autres méthodes

On peut ajouter autant de méthodes que l'on souhaite, pourvu qu'elles soient cohérentes avec le rôle de la classe.

Par exemple, une méthode d'affichage :

```java
void display() {
    System.out.println("Terrain de taille : " + width + " x " + length);
}
```

On l'appelle depuis `main`, **après** l'initialisation de l'objet (sans quoi la variable n'est pas initialisée) :

```java
myFieldOne.display();
myFieldTwo.display();
```

Une méthode peut en appeler une autre de la même classe. Appelée sans préfixe, elle s'applique à l'**objet courant** (voir `this`). Par exemple, `display` peut appeler `area` pour afficher aussi la superficie :

```java
void display() {
    System.out.println("Terrain de taille : " + width + " x " + length + ", superficie : " + area() + "m2");
}
```

Cela évite d'appeler `area()` dans `main` pour afficher la superficie.

Une méthode peut aussi recevoir des **paramètres**. Par exemple, une méthode qui indique si la superficie du terrain est supérieure à une valeur donnée :

```java
boolean hasGreaterAreaThan(int value) {
    if (area() > value) {
        return true;
    } else {
        return false;
    }
}
```

Le `if` / `else` peut se simplifier, car la condition est déjà un booléen :

```java
boolean hasGreaterAreaThan(int value) {
    return area() > value;
}
```

Utilisation depuis `main` :

```java
if (myFieldOne.hasGreaterAreaThan(400)) {
    System.out.println("Mon terrain 1 a une superficie plus grande que 400 m2.");
} else {
    System.out.println("Mon terrain 1 n'a pas une superficie plus grande que 400 m2.");
}
```

## Les visibilités

Les éléments d'une classe (attributs, constructeurs, méthodes) ont chacun une **visibilité**, qui se place devant leur déclaration. Elle indique **qui peut les utiliser**. Deux mots-clés à connaître pour commencer :

- **`public`** : l'élément est accessible à l'intérieur **et** à l'extérieur de la classe. On peut l'utiliser depuis n'importe quelle autre classe de l'application avec l'opérateur `.` (en lecture et en écriture pour un attribut).
- **`private`** : l'élément n'est accessible que **depuis l'intérieur de la classe** qui le contient.

Par exemple, avec `width` en `public` et `length` en `private` :

```java
public class Field {
    public int width;
    private int length;
    // ...
}
```

```java
myFieldOne.width = 12;    // ✅ public : accessible depuis Main
myFieldOne.length = 32;   // ❌ length has private access in Field
```

`private` s'applique à la **classe** et non à l'instance : à l'intérieur de `Field`, une méthode peut accéder aux attributs privés d'un **autre** `Field`.

```java
boolean hasSameWidthAs(Field other) {
    return this.width == other.width;   // ✅ même classe : l'accès à other.width est autorisé
}
```

Le choix de rendre un élément `public` ou `private` se fait à la **conception** de l'application, selon ce qu'on souhaite exposer.

- **Constructeurs** : on les déclare en général `public`. Un constructeur `private` est possible dans certains cas, par exemple pour empêcher la création d'objets (c'est le cas de `Math`, voir plus loin).
- **Méthodes** : on garde `private` une méthode utilitaire interne, qui n'a pas vocation à être appelée de l'extérieur.

Deux autres niveaux existent : la **visibilité package** (aucun modificateur) et `protected` (lié à l'héritage). Ils sont vus avec les packages et l'héritage.

## Le principe d'encapsulation

### Définition

Pour rappel, la POO est fondée sur quatre principes : encapsulation, abstraction, héritage et polymorphisme.

Le principe d'**encapsulation** protège la classe pour qu'elle ne devienne pas **incohérente**, c'est-à-dire pour qu'un objet ne puisse pas se retrouver dans un **état invalide**.

Dans notre exemple, ce serait un terrain avec une largeur ou une longueur négative. Une valeur négative ne provoquerait aucune erreur du compilateur, mais le programme produirait des résultats absurdes (une superficie négative, par exemple).

Si la largeur est `public`, n'importe quel code peut y écrire n'importe quelle valeur, puisqu'aucun contrôle n'existe. Elle est aussi lisible par tous.

Le principe d'encapsulation consiste à :

- déclarer les **attributs `private`**, pour interdire l'accès direct depuis l'extérieur ;
- n'offrir l'accès à l'objet que par des **méthodes publiques**, qui peuvent contrôler ce qui est lu et modifié.

Le développeur de la classe garde ainsi la maîtrise de son fonctionnement : les autres développeurs qui l'utilisent ne peuvent pas la manipuler n'importe comment.

### Les getters

Pour lire un attribut privé, on crée une méthode : un **getter** (*accesseur* en français).

Par convention, son nom est `get` suivi du nom de l'attribut avec une majuscule (camelCase), avec des parenthèses : `getWidth()`, `getLength()`. Pour un attribut booléen, on utilise plutôt `is` (`isEmpty()`). Un getter est en général `public`, pour être utilisable partout dans l'application.

```java
public int getWidth() {
    return width;
}

public int getLength() {
    return length;
}
```

Depuis une autre classe, on l'appelle sur l'objet :

```java
myFieldOne.getWidth();
myFieldOne.getLength();
```

### Les setters

De même, on ne modifie pas directement un attribut privé. On passe par un **setter** (*mutateur* en français).

Il est nommé `set` suivi du nom de l'attribut en camelCase, est en général `public`, ne retourne rien (`void`) et prend en paramètre la nouvelle valeur.

```java
public void setWidth(int newWidth) {
    width = newWidth;
}

public void setLength(int newLength) {
    length = newLength;
}
```

```java
myFieldOne.setWidth(14);
```

L'intérêt d'un setter est de pouvoir **contrôler** la modification : refuser une valeur négative ou trop grande, par exemple, en levant une exception (notion vue dans un prochain chapitre).

```java
public void setWidth(int newWidth) {
    if (newWidth < 0) {
        throw new IllegalArgumentException("La largeur ne peut pas être négative");
    }
    width = newWidth;
}
```

Attention : si le setter contrôle la valeur mais pas le **constructeur**, on peut quand même créer un objet invalide avec `new Field(-5, 10)`. Le constructeur doit appliquer les mêmes règles.

En résumé, l'encapsulation consiste à enfermer dans la classe la représentation de l'objet (ses attributs), et à n'y donner accès que par des méthodes : un getter pour lire, un setter pour modifier, avec la possibilité d'ajouter des contrôles.

Les getters et setters ne sont **pas obligatoires** : on peut avoir un getter sans setter (attribut en lecture seule), ou l'inverse. C'est le développeur de la classe qui décide ce qu'il autorise. Un setter sans aucun contrôle n'apporte guère plus qu'un attribut `public`, avec pour seul avantage de pouvoir ajouter un contrôle plus tard sans changer le code qui l'appelle. Quand c'est possible, on préfère une méthode qui exprime une action (`increaseLength(5)`) à un simple setter.

### Générer les getters et setters avec IntelliJ

IntelliJ peut générer les getters et setters automatiquement : clic droit dans la classe, puis *Generate*, puis *Getter and Setter* (raccourci habituel : `Alt + Insert`, qui dépend de la configuration), puis sélection des attributs concernés.

Les setters générés utilisent le mot-clé `this`, expliqué plus loin.

## Surcharge de méthode : overloading

La surcharge (*overloading*) consiste à définir **plusieurs méthodes portant le même nom dans une même classe**, à condition que leur **liste de paramètres diffère**.

Le compilateur choisit la bonne version selon les arguments passés à l'appel.

```java
public void increaseLength() {
    length++;
}
public void increaseLength(int value) {
    length += value;
}
```

À l'appel, on utilise l'une ou l'autre version selon l'argument passé ou non. Java n'a pas de paramètres optionnels : la surcharge permet de les simuler.

```java
myFieldOne.increaseLength();     // → version sans paramètre (+1)
myFieldOne.increaseLength(20);   // → version avec int (+20)
```

Le choix est fait **à la compilation** (liaison statique) d'après le nombre et le type des arguments.

### Ce qui compte pour la signature

La signature d'une méthode = **nom + types/nombre/ordre des paramètres**. Pour surcharger, il faut que l'un de ces éléments change :

```java
void display()                    // 0 paramètre
void display(String prefix)       // 1 paramètre
void display(int a, String b)     // types différents
void display(String b, int a)     // ordre différent : valide aussi
```

### Ce qui ne suffit PAS

- Changer uniquement le **type de retour** : erreur de compilation.

```java
int area() { ... }
double area() { ... }   // => même signature
```

- Changer uniquement le **nom des paramètres** : `f(int a)` et `f(int b)` sont identiques.
- Changer uniquement les **modificateurs** (`public`, `static`...) ou la clause `throws`.

### Les constructeurs peuvent aussi se surcharger

Les constructeurs se surchargent de la même façon, ce qui est très courant.

```java
public Field() {
    this(10, 10);          // appelle l'autre constructeur
}

public Field(int paramWidth, int paramLength) {
    width = paramWidth;
    length = paramLength;
}
```

`this(...)` permet de réutiliser un constructeur depuis un autre et d'éviter la duplication.

### Réduire la duplication entre surcharges

Les deux versions de `increaseLength` peuvent se déléguer :

```java
public void increaseLength() {
    increaseLength(1);
}

public void increaseLength(int value) {
    length += value;
}
```

Si la logique évolue (par exemple une validation), on ne la modifie qu'à un seul endroit.

### Pièges à connaître

1. **Conversion implicite de types**. Java choisit la surcharge la plus spécifique, en élargissant au besoin (`int` → `long` → `double`) :

```java
void show(long x)   { System.out.println("long"); }
void show(double x) { System.out.println("double"); }

show(5);   // affiche "long" (int est élargi vers long en priorité)
```

2. **Ambiguïté**. Si aucune version n'est clairement meilleure, le compilateur refuse :

```java
void f(int a, double b) { }
void f(double a, int b) { }

f(1, 2);   // ❌ ambigu
```

3. **Le choix dépend du type déclaré, pas du type réel**. Contrairement au polymorphisme (redéfinition / *overriding*), la surcharge est résolue sur le **type statique** :

```java
void print(Object o) { System.out.println("Object"); }
void print(String s) { System.out.println("String"); }

Object x = "hello";
print(x);   // affiche "Object", car x est déclaré Object
```

### Surcharge vs redéfinition

| | Surcharge (*overload*) | Redéfinition (*override*) |
|---|---|---|
| Où | Même classe (ou héritée) | Sous-classe |
| Signature | **Différente** | **Identique** |
| Résolution | Compilation | Exécution |
| Annotation | aucune | `@Override` |

## Le mot-clé `this`

### Définition

`this` est une référence à l'**instance courante**, c'est-à-dire l'objet sur lequel une méthode ou un constructeur est en train de s'exécuter.

- Dans une **méthode**, `this` désigne l'objet qui a appelé la méthode. Avec `myFieldOne.display()`, `this` vaut `myFieldOne` dans le corps de `display`.
- Dans un **constructeur**, `this` désigne l'objet en cours d'initialisation. Quand `new` est appelé, la mémoire est allouée sur le tas, les champs reçoivent leurs valeurs par défaut, puis le constructeur s'exécute avec `this` pointant vers cet objet.

### Les 4 usages

1. **Accéder aux champs de l'instance** : `this.width`
2. **Lever l'ambiguïté (masquage / *shadowing*)** quand un paramètre porte le même nom qu'un champ
3. **Appeler un autre constructeur** de la même classe : `this(...)`
4. **Retourner l'instance courante** : `return this`, ce qui permet d'enchaîner les appels (*method chaining*)

Et une limite : `this` n'existe **pas** dans un contexte `static`.

### Exemple

```java
public class Field {
    private int width;
    private int length;

    // Usage 2 : paramètres = noms des champs → this lève l'ambiguïté
    public Field(int width, int length) {
        this.width = width;
        this.length = length;
    }

    // Usage 3 : délégation à un autre constructeur (1re instruction)
    public Field() {
        this(10, 10);
    }

    // Usage 4 : on retourne l'instance courante pour chaîner
    public Field increaseLength(int value) {
        this.length += value;
        return this;
    }

    // Usage 1 : accès explicite à un champ
    public int area() {
        return this.width * this.length;
    }

    // static : pas d'instance, donc pas de this
    public static Field square(int side) {
        return new Field(side, side);
    }
}
```

```java
Field a = new Field(12, 32);
Field b = new Field();                    // 10 x 10
a.increaseLength(5).increaseLength(3);    // 12 x 40
```

**Masquage.** Dans `Field(int width, int length)`, le nom `width` désigne le paramètre, car la variable locale prend le dessus sur le champ. Sans `this`, `width = width;` affecte le paramètre à lui-même : le code compile, mais les champs restent à `0`. `this.width` désigne explicitement le champ de l'objet.

**`this(...)`.** `Field()` ne duplique aucune logique : il délègue à `Field(int, int)`. L'appel doit être la première instruction du constructeur, et un constructeur ne peut pas s'appeler lui-même, directement ou en cycle.

**`return this`.** Dans `a.increaseLength(5).increaseLength(3)`, chaque appel renvoie `a` lui-même : il n'y a aucune copie, c'est le même objet modifié deux fois. C'est la base du *method chaining* (très utilisé dans le pattern *Builder*).

**`this` dépend de l'appelant.** Le code de `area()` existe une seule fois, mais `this` pointe vers `a` ou `b` selon l'appel, ce qui permet à chaque instance d'avoir ses propres valeurs.

**Pas de `this` en `static`.** Une méthode statique appartient à la classe, pas à une instance : elle ne peut ni utiliser `this`, ni accéder directement aux champs d'instance.

## Le mot-clé `static`

`static` est omniprésent en Java : la méthode `main` en est un exemple.

### Définition

Un membre `static` (attribut ou méthode) appartient à la **classe**, et non à une instance.

- **Attribut d'instance** (sans `static`) : chaque objet a sa propre copie.
- **Attribut de classe** (`static`) : une seule copie, créée à l'initialisation de la classe (à sa première utilisation) et partagée par toutes les instances. Il ne fait pas partie de la structure d'un objet et existe même si aucune instance n'a été créée.

```java
public class Field {
    private static int width;   // partagé par tous les Field
    private int length;         // propre à chaque Field

    public Field(int paramWidth, int paramLength) {
        width = paramWidth;     // écrase la valeur pour TOUTES les instances
        length = paramLength;
    }

    public void display() {
        System.out.println(width + " x " + length);
    }
}
```

```java
Field one = new Field(12, 32);
Field two = new Field(15, 42);
one.display();   // 15 x 32 : width a été écrasée par la 2e construction
```

### Intérêt

Une valeur commune n'est stockée qu'une fois, et la modifier une seule fois se répercute sur toutes les instances. Par exemple, des terrains qui doivent tous avoir la même largeur (largeur de la rue divisée par le nombre de terrains).

Usages typiques :

```java
public static final int MAX_WIDTH = 100;   // constante (UPPER_SNAKE_CASE)
private static int count = 0;              // compteur d'instances (count++ dans le constructeur)
```

**Attention** : un attribut `static` modifiable est un état global, partagé par tout le programme. Il rend le code plus difficile à tester et n'est pas sûr en contexte multi-thread. On privilégie les constantes (`static final`).

### Accès à un attribut static

On y accède par le **nom de la classe** : `Field.width`. Passer par une instance (`one.width`) ou par `this.width` compile, mais prête à confusion : à éviter. Il vaut mieux éviter aussi un attribut `public` (encapsulation) et passer par un accesseur.

### Les méthodes static

```java
public static void methodStatic() { ... }
ClassAssociated.methodStatic();   // appel sans objet
```

Une méthode `static` convient quand son traitement ne dépend d'aucune instance.

Restrictions :

- Pas de `this` : il n'y a pas d'instance courante.
- Accès **direct** uniquement aux membres `static` (attributs et méthodes). Pour atteindre un membre d'instance, il faut une référence à un objet (`obj.display()`).
- L'inverse est permis : une méthode d'instance peut utiliser librement les membres `static`.

Par convention, on rend `static` les getters et setters d'un attribut `static`.

```java
public class Field {
    private static int width;
    private int length;

    public Field(int length) { this.length = length; }

    // paramètre = nom du champ, et this est interdit : on utilise Field.width
    public static void setWidth(int width) { Field.width = width; }

    public int area() { return Field.width * this.length; }
}
```

```java
Field.setWidth(100 / 2);    // appel via la classe, sans objet
Field a = new Field(32);
a.area();                   // 50 * 32 = 1600
```

### Erreurs fréquentes

```java
public static void display() {
    System.out.println(this.length);   // ❌ non-static variable this cannot be referenced from a static context
    area();                            // ❌ non-static method area() cannot be referenced from a static context
}
```

Appeler une méthode statique via une instance (`field.display()`) compile avec un avertissement : préférer `Field.display()`. Éviter aussi de nommer une variable comme sa classe (`Field Field`) : le compilateur interprète alors `Field.` comme la variable plutôt que comme la classe.

### La méthode `main`

```java
public static void main(String[] args)
```

- `public` : accessible par la JVM.
- `static` : la JVM l'appelle sans créer d'instance. C'est le point d'entrée du programme, d'où l'aspect « procédural » du départ.
- `void` : ne retourne rien.
- `String[] args` : arguments de la ligne de commande.

Le nom `Main` est une convention : n'importe quelle classe peut contenir un `main`. Depuis `main`, on appelle directement les méthodes `static`, mais on peut aussi créer des objets et appeler leurs méthodes d'instance (`myFieldOne.display()`).

> À vérifier selon la version de Java utilisée : les versions récentes (préversion à partir de Java 21) assouplissent cette signature, notamment avec des `main` d'instance. La forme ci-dessus reste la forme classique.

**Compilation et lancement** (IntelliJ fait cela automatiquement et place les `.class` dans `out/production/<module>`) :

```bash
javac -d out src/*.java    # .java → .class (bytecode)
java -cp out Main          # lance la JVM sur la classe Main (nom de classe, sans .class)
```

Avec des packages, il faut le nom complet de la classe : `java -cp out com.exemple.Main`.

### Les classes utilitaires

`Math` ne contient que des membres `static`. Sa classe est `final` et son constructeur est `private` : `new Math()` est impossible depuis l'extérieur.

- Constantes : `Math.PI`, `Math.E` (`public static final double`)
- Méthodes : `Math.max`, `Math.sqrt`, `Math.pow`, `Math.abs`...

Pour écrire sa propre classe utilitaire : classe `final`, constructeur `private`, méthodes `static`.

`Arrays` suit le même principe et propose des méthodes pour manipuler les tableaux : `Arrays.toString(tab)`, `Arrays.sort(tab)`, `Arrays.fill(tab, v)`, `Arrays.copyOf(tab, n)`, `Arrays.equals(a, b)`.

## Variables, références et passage des arguments

### Ce que contient une variable

Une variable est une **boîte**. Ce qu'elle contient dépend de son type :

- **type primitif** (`int`, `double`, `boolean`...) : la boîte contient **la valeur** ;
- **type classe** (`Field`, `String`...) : la boîte contient une **référence**, c'est-à-dire une « flèche » vers l'objet, qui est rangé ailleurs en mémoire.

Une variable n'est donc **pas** un objet : c'est un moyen d'y accéder. L'objet (l'**instance**) est créé par `new`, qui retourne une référence rangée dans la variable. Une variable peut pointer vers un objet, en changer, ou ne pointer vers aucun objet (`null`).

```java
Field field1 = new Field(12, 32);
```

```
  field1 ┌───┐         ┌─────────────────┐
         │ ──┼───────▶ │ Field           │
         └───┘         │ width  : 12     │
                       │ length : 32     │
                       └─────────────────┘
```

### Copier une variable : valeur ou référence

L'affectation `=` copie **le contenu de la boîte**. Le résultat dépend donc du type.

**Type primitif : on copie la valeur.** Les deux variables sont indépendantes.

```java
int a = 5;
int b = a;       // b reçoit une copie de la valeur
b = 6;           // a vaut toujours 5
```

**Type classe : on copie la référence.** Il n'y a **aucun nouvel objet** : les deux variables pointent vers le même.

```java
Field field2 = field1;      // copie de la flèche, pas de l'objet
field2.setWidth(20);
System.out.println(field1.getWidth());   // 20 : c'est le même objet
```

```
  field1 ┌───┐
         │ ──┼───┐
         └───┘   │      ┌─────────────────┐
                 ├────▶ │ Field           │
  field2 ┌───┐   │      │ width  : 20     │
         │ ──┼───┘      │ length : 32     │
         └───┘          └─────────────────┘
```

Conséquence : `==` sur deux variables d'objets compare les **références** (les flèches), pas le contenu. Deux terrains de mêmes dimensions, créés par deux `new`, sont deux objets distincts.

```java
Field f1 = new Field(12, 32);
Field f2 = new Field(12, 32);
System.out.println(f1 == f2);   // false : deux objets différents
```

### Passer une variable à une méthode

Java passe **toujours** les arguments **par valeur** : à l'appel, le **paramètre** (la variable déclarée dans la signature de la méthode) reçoit une **copie du contenu** de l'**argument** (la variable passée à l'appel). C'est comme si on écrivait, au début de la méthode, `paramètre = argument;`.

Pour un type primitif (voir le chapitre sur le procédural), la valeur est copiée : la méthode ne peut pas modifier la variable de l'appelant. Pour un objet, c'est **la référence** qui est copiée, pas l'objet.

Le paramètre est une variable **locale** : elle est créée à l'appel et supprimée à la fin de la méthode.

```java
public class Main {
    static void widen(Field paramField) {
        paramField.setWidth(20);
    }

    static void replace(Field paramField) {
        paramField = new Field(1, 1);
    }

    public static void main(String[] args) {
        Field field1 = new Field(12, 32);
        // ...
    }
}
```

À l'appel d'une de ces méthodes avec `field1`, on obtient **deux flèches vers un seul objet** :

```
  field1     ┌───┐
  (main)     │ ──┼───┐
             └───┘   │      ┌─────────────────┐
                     ├────▶ │ Field           │
  paramField ┌───┐   │      │ width  : 12     │
  (méthode)  │ ──┼───┘      │ length : 32     │
             └───┘          └─────────────────┘
```

Avec la flèche copiée, on peut faire **deux choses très différentes**.

#### A. Suivre la flèche et modifier l'objet

```java
widen(field1);
System.out.println(field1.getWidth());   // 20
```

```
  field1     ──┐
               ├──▶ [ Field | width : 20 | length : 32 ]   ◀ l'objet a été modifié
  paramField ──┘
```

Les deux flèches mènent au même objet : la modification est **visible depuis l'appelant**. La méthode n'a pas modifié la variable `field1` (la flèche), mais l'objet vers lequel elle pointe.

#### B. Changer la flèche elle-même

```java
replace(field1);
System.out.println(field1.getWidth());   // 20 : field1 n'a pas bougé
```

```
  field1     ─────▶ [ Field 1 | width : 20 | length : 32 ]    ◀ inchangé
  paramField ─────▶ [ Field 2 | width : 1  | length : 1  ]    ◀ nouvel objet
```

`paramField` pointe désormais vers un **autre** objet, mais seule la **copie** de la flèche a changé : `field1` n'a pas bougé. À la fin de la méthode, `paramField` disparaît : le nouvel objet n'est plus accessible, et Java le supprime automatiquement (*ramasse-miettes*, ou *garbage collector*).

Les deux actions peuvent se succéder dans une même méthode. Tant que le paramètre n'est pas réaffecté, il partage l'objet de l'appelant. Dès qu'il l'est, **le lien est coupé** : ce qu'on fait ensuite avec lui n'affecte plus l'appelant.

```java
static void demo(Field paramField) {
    paramField.setWidth(30);                  // 1. même objet que l'appelant : visible chez lui
    paramField = new Field(1, 1);             // 2. paramField pointe vers un nouvel objet
    paramField.setWidth(99);                  // 3. modifie seulement le nouvel objet
}
```

### Retourner un objet

Une méthode ne peut **jamais** réaffecter la variable de l'appelant. Elle peut en revanche **retourner** une référence, que l'appelant range où il veut (comme `x = increment(x)` pour un primitif) :

```java
static Field createDefaultField() {
    return new Field(10, 10);
}

field1 = createDefaultField();   // field1 pointe maintenant vers le nouvel objet
```

### À retenir

| Dans la méthode, on... | Primitif | Objet |
|---|---|---|
| modifie la valeur du paramètre | aucun effet sur l'original | (sans objet) |
| modifie l'**objet** pointé (`paramField.setWidth(...)`) | (sans objet) | **visible** depuis l'appelant |
| **réaffecte** le paramètre (`paramField = ...`) | aucun effet sur l'original | aucun effet sur l'original |

- Un paramètre est une **copie** de l'argument : pour un objet, une copie de la **référence**, pas de l'objet.
- Deux variables qui pointent vers le **même objet** le **partagent** : une modification faite via l'une est visible via l'autre. On le retrouvera avec la composition (un objet qui en contient un autre).
- Déclarer un paramètre `final` interdit de le réaffecter dans la méthode (cas B), mais pas de modifier l'objet qu'il référence (cas A).
- Le terme « adresse mémoire » est une simplification : Java manipule des références et n'expose pas d'adresses.

### Observer le passage d'un objet avec le debug

Avec un point d'arrêt sur l'appel `widen(field1);` et `Step Into` (`F7`) :

- le panneau **Variables** affiche `paramField = {Field@715}` ;
- en remontant à `main` dans **Frames**, il affiche `field1 = {Field@715}`.

Le même identifiant (ici `@715`, un nombre qui varie d'une exécution à l'autre) indique que les deux variables pointent vers **le même objet**. Après `paramField = new Field(1, 1);` dans `replace`, `paramField` affiche un autre identifiant, alors que `field1` garde le sien.

## Le mot-clé `final`

### Définition

`final` indique qu'une variable ne peut être **affectée qu'une seule fois**. Une fois la valeur donnée, on ne peut plus la modifier.

```java
private final int width;
```

Un attribut `final` doit obligatoirement être initialisé, sinon le code ne compile pas (`variable width not initialized in the default constructor`). Il peut l'être :

- **à la déclaration** : `private final int width = 10;`
- **dans le constructeur** : chaque constructeur doit l'affecter, exactement une fois.
- (plus rare) dans un bloc d'initialisation.

```java
public class Field {
    private final int width;

    public Field(int width) {
        this.width = width;
    }
}
```

Toute tentative de réaffectation est une erreur de compilation :

```java
public void increaseWidth() {
    this.width++;   // Cannot assign a value to final variable width
}
```

### `final` ne signifie pas `static`

Un attribut `final` n'est **pas partagé**, contrairement à `static` : chaque instance a son propre emplacement mémoire, avec sa propre valeur, fixée une fois pour toutes à la construction.

| | Partagé entre les instances | Modifiable |
|---|---|---|
| `private int width` | non | oui |
| `private static int width` | oui | oui |
| `private final int width` | non | non (après initialisation) |
| `public static final int MAX_WIDTH` | oui | non |

On parle de **constante** pour un attribut `static final`, par convention nommé en `UPPER_SNAKE_CASE` (`Math.PI`). Un attribut `final` d'instance est plutôt un attribut **non modifiable** : sa valeur peut différer d'un objet à l'autre.

### Intérêt : les objets immuables

Une classe dont tous les attributs sont `final` produit des objets **immuables** : une fois construits, leur état ne change plus. C'est plus sûr (pas de modification inattendue), plus simple à raisonner et sans risque en contexte multi-thread. `String` en est l'exemple le plus courant.

Avec l'encapsulation, on fournit des **getters**, mais **pas de setters** (IntelliJ ne propose d'ailleurs pas de générer un setter pour un attribut `final`).

Pour une classe immuable, on déclare aussi souvent la classe elle-même `final` (voir plus bas).

**Piège : `final` n'implique pas l'immuabilité de ce qu'il référence.** `final` empêche de *réaffecter* la variable, pas de modifier l'objet vers lequel elle pointe.

```java
private final int[] values = new int[3];

values[0] = 5;            // autorisé : on modifie le contenu du tableau
values = new int[5];      // interdit : on réaffecte la référence
```

Il en va de même pour une `List`, un objet mutable, etc. Une classe n'est réellement immuable que si ses attributs `final` sont eux-mêmes de types immuables (`int`, `String`...), ou si elle en fait des copies défensives.

### `final` en paramètre de méthode

Un paramètre peut être déclaré `final` : on ne peut alors pas lui réaffecter une valeur dans la méthode.

```java
public Field(final int width, final int length) {
    width = -1;              // cannot assign a value to final parameter width
    this.width = width;
    this.length = length;
}
```

Cela garantit que la valeur reçue n'est pas écrasée par erreur dans le corps de la méthode. Cela ne change rien pour l'appelant : Java passe les arguments **par valeur** (voir la section précédente), sa variable n'est de toute façon jamais modifiée par une réaffectation du paramètre. Comme pour les attributs, si le paramètre est un objet, `final` interdit de changer la référence, pas de modifier l'objet.

En pratique, cet usage est peu répandu : beaucoup de projets préfèrent ne pas réaffecter leurs paramètres sans l'écrire.

### Autres usages (aperçu)

- **Variable locale** : `final int max = 10;` (affectée une seule fois).
- **Méthode `final`** : ne peut pas être redéfinie (*override*) dans une sous-classe.
- **Classe `final`** : ne peut pas être étendue (`String`, `Math`...).

Les deux derniers usages relèvent de l'héritage : à reprendre dans le chapitre correspondant.

## Combinaison de `static` et `final`

Ces deux mots-clés se combinent.

- `static` : l'attribut appartient à la classe et est **partagé** par toutes les instances.
- `final` : l'attribut ne peut être affecté qu'**une seule fois**.

Ensemble, ils définissent une **constante de classe** : une valeur unique, partagée, qui ne change jamais.

```java
private static final int WIDTH = 12;
```

### Initialisation

L'attribut doit être initialisé, et il ne peut **pas** l'être dans un constructeur : le constructeur s'exécute à chaque création d'objet, alors qu'un attribut `static` n'appartient à aucun objet en particulier.

```java
public Field(int width) {
    WIDTH = width;   // cannot assign a value to final variable WIDTH
}
```

Deux endroits sont possibles :

- **à la déclaration** (le cas courant) : `private static final int WIDTH = 12;`
- dans un **bloc d'initialisation statique** (plus rare, utile si l'initialisation demande plusieurs instructions) :

```java
private static final int WIDTH;

static {
    WIDTH = 12;
}
```

Initialiser à la déclaration n'est pas propre à `static final` : n'importe quel attribut peut l'être (`private int length = 10;`).

### Convention de nommage

Une constante s'écrit en **`UPPER_SNAKE_CASE`** : majuscules, mots séparés par des `_` (`WIDTH`, `MAX_WIDTH`, `DEFAULT_LENGTH`). C'est une convention de la communauté Java, pas une obligation du compilateur.

### Visibilité

- **`private`** : la constante ne sert qu'à l'intérieur de la classe.
- **`public`** : elle est accessible depuis l'extérieur, par le nom de la classe.

```java
public class Field {
    public static final int MAX_WIDTH = 100;   // accessible : Field.MAX_WIDTH
    private static final int MIN_WIDTH = 1;    // usage interne

    private final int width;

    public Field(int width) {
        this.width = Math.max(MIN_WIDTH, Math.min(width, MAX_WIDTH));
    }
}
```

```java
System.out.println(Field.MAX_WIDTH);   // 100, sans créer d'objet
```

Pas besoin de getter pour une constante `public` : comme elle ne peut pas être modifiée, l'exposer ne casse pas l'encapsulation. On retrouve ce principe dans `Math.PI` ou `Integer.MAX_VALUE`.

### Intérêt

- **Éviter les « nombres magiques »** : `MAX_WIDTH` est plus lisible que `100` répété dans le code.
- **Un seul endroit à modifier** si la valeur change.
- **Une seule copie en mémoire**, partagée par toutes les instances.

### Points d'attention

- **`final` ne rend pas l'objet pointé immuable.** Une constante `public static final` de type tableau ou `List` reste modifiable dans son contenu. Réservé aux types immuables (`int`, `String`...) pour les constantes publiques.

```java
public static final int[] SIZES = {10, 20};

Field.SIZES[0] = 99;   // compile : le contenu du tableau est modifiable
```

- **Valeurs recopiées à la compilation.** Pour une constante de type primitif ou `String` initialisée avec une valeur littérale, le compilateur recopie la valeur dans les classes qui l'utilisent. Si on la modifie, il faut **recompiler** les classes qui en dépendent.

## La `Javadoc`

### Contexte : les commentaires en Java

Commenter son code apporte du contexte et des explications quand c'est nécessaire. Java propose trois formes de commentaires :

```java
// commentaire sur une ligne

/* commentaire
   sur plusieurs lignes */

/**
 * Commentaire de documentation (Javadoc)
 */
```

Les deux premiers sont ignorés par le compilateur : ils n'existent que dans le fichier source et disparaissent du bytecode (`.class`). Ils servent à celui qui **lit** le code, en général pour expliquer le *pourquoi* d'un choix.

La **Javadoc** (`/** ... */`) est aussi ignorée à l'exécution, mais elle est reconnue par des outils (l'IDE, l'outil `javadoc`) qui l'exploitent pour documenter la classe à celui qui **utilise** le code, sans qu'il ait à lire l'implémentation.

### Définition

La Javadoc est un commentaire spécifique qui sert de **notice d'utilisation** d'une classe, d'un attribut, d'un constructeur ou d'une méthode : ce qu'ils représentent ou font, ce qu'ils attendent en paramètre, ce qu'ils retournent.

Elle commence par `/**` et se termine par `*/`. Par convention, chaque ligne intermédiaire commence par `*`. Elle se place **juste au-dessus** de l'élément documenté (et avant ses annotations, comme `@Override`).

```java
/**
 * Représente un terrain rectangulaire.
 */
public class Field {
    ...
}
```

La **première phrase** est le résumé : c'est elle qui apparaît dans les listes de la documentation générée. On la rédige comme une phrase complète, qui se termine par un point.

### Où la voit-on ?

- **Dans l'IDE** : en survolant le nom d'une classe, d'une méthode ou d'un attribut, une fenêtre affiche sa documentation, sans ouvrir le fichier. Dans IntelliJ, taper `/**` puis `Entrée` au-dessus d'une méthode génère le squelette avec les `@param` et `@return`.
- **En HTML** : l'outil `javadoc` génère un site de documentation à partir des commentaires. Dans IntelliJ : menu *Tools → Generate JavaDoc*, ou en ligne de commande :

```bash
javadoc -d doc src/*.java    # génère la documentation HTML dans le dossier doc
```

Pour une classe déjà compilée (par exemple une bibliothèque), le survol ne fonctionne que si l'IDE a accès aux sources ou à la documentation associée : les commentaires ne sont pas dans le `.class`.

### Les balises (`@tag`)

Au-delà de la description, on utilise des balises qui commencent par `@` :

| Balise | S'applique à | Rôle |
|---|---|---|
| `@param nom description` | méthode, constructeur | décrit un paramètre (une balise par paramètre) |
| `@return description` | méthode non `void` | décrit la valeur retournée |
| `@throws Exception description` | méthode, constructeur | exception pouvant être levée |
| `@author` | classe | auteur(s) |
| `@version` | classe | version |
| `@since` | classe, méthode | version à partir de laquelle l'élément existe |
| `@see` | tous | renvoie vers un autre élément |
| `@deprecated` | tous | élément à ne plus utiliser (avec l'alternative à utiliser) |

Remarques :

- `@author` et `@version` sont de moins en moins utilisées : le gestionnaire de versions (Git) conserve déjà ces informations. L'outil `javadoc` ne les affiche d'ailleurs que si on le demande (options `-author` et `-version`).
- On peut insérer du code dans le texte avec `{@code ...}` et un lien avec `{@link Field}`.

### Exemple complet

```java
/**
 * Représente un terrain rectangulaire.
 *
 * @author John DOE
 * @version 1
 */
public class Field {
    /** Largeur du terrain, en mètres. */
    private int width;

    /** Longueur du terrain, en mètres. */
    private int length;

    /**
     * Crée un terrain à partir de ses dimensions.
     *
     * @param width  la largeur du terrain, en mètres
     * @param length la longueur du terrain, en mètres
     */
    public Field(int width, int length) {
        this.width = width;
        this.length = length;
    }

    /**
     * Calcule la superficie du terrain.
     *
     * @return la superficie, en m²
     */
    public int area() {
        return width * length;
    }

    /**
     * Augmente la longueur du terrain de 1 mètre.
     */
    public void increaseLength() {
        length++;
    }

    /**
     * Augmente la longueur du terrain du nombre de mètres indiqué.
     *
     * @param value le nombre de mètres à ajouter
     */
    public void increaseLength(int value) {
        length += value;
    }
}
```

Pour une méthode surchargée (comme `increaseLength`) ou plusieurs constructeurs, chaque version a **sa propre Javadoc**, qui précise ce qui la distingue des autres : c'est elle qui permet de savoir laquelle choisir.

### Bonnes pratiques

- **Documenter ce qui est utilisé par d'autres** : classes, constructeurs et méthodes `public` (et `protected`). Par défaut, l'outil `javadoc` ne génère d'ailleurs la documentation que pour ces éléments ; les attributs `private` n'y figurent pas, même si leur commentaire reste utile dans le code.
- **Décrire le contrat** (ce que fait l'élément, ses paramètres, son résultat, ses cas d'erreur), pas répéter le code. Une Javadoc du type « Retourne la largeur » sur `getWidth()` n'apporte rien.
- **Maintenir la Javadoc à jour** : à chaque modification d'une méthode (paramètres, comportement, retour), mettre à jour sa documentation. Une documentation fausse est pire que pas de documentation.