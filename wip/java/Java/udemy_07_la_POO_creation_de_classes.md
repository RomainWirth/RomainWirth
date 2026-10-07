# POO : La Création des classes en Java

## Les bases de la Programmation Orientée Objet en Java

### Rappels sur la POO

(Voir cours sur la Programmation Orientée Objet)

La POO est une manière de modéliser les concepts et comportements pertinents pour le problème qu'on résout, en s'inspirant souvent (mais pas toujours) d'objets ou d'entités du monde réel. On appelle ça l'abstraction : on garde ce qui compte pour l'application, on ignore le reste.

Concrètement, cela se traduit par une façon d'organiser son code autour d'objets plutôt qu'autour d'une simple suite d'instructions. Au lieu de manipuler des données et des fonctions séparément, on les regroupe dans des objets qui représentent ces concepts et comportements : une voiture, un utilisateur, une commande, etc.

Chaque objet a :
- des attributs (ses données, ce qu'il est). ex : un utilisateur a un nom, un email
- des méthodes (ses comportements, ce qu'il fait). ex : un utilisateur peut se connecter, changer son mot de passe

Les 4 grands principes habituellement cités :
1. Encapsulation : les données d'un objet sont protégées, on n'y accède que via ses méthodes (pas de manipulation directe et anarchique)
2. Héritage : une classe peut hériter des attributs/méthodes d'une autre (ex : Chien hérite de Animal)
3. Polymorphisme : des objets différents peuvent répondre à un même appel de méthode chacun à leur façon (ex : .crier() fait "Whaou" pour un chien, "Miaou" pour un chat)
4. Abstraction : on expose seulement ce qui est nécessaire à l'utilisation de l'objet, on cache la complexité interne

En résumé : la POO = modéliser le code comme un ensemble d'objets qui interagissent entre eux, chacun responsable de ses propres données et comportements, en ne retenant de chaque concept que ce qui est pertinent pour le problème à résoudre.

Java est un langage de programmation orienté objet.

### Exemple

créer un programme permettant de schématiser une rue composée de plusieurs terrains situés le long de cette rue.

on va avoir besoin d'un code composé de plusieurs terrains et un terrain sera défini par une largeur sur la rue et une longueur correspondant à sa profondeur. Par soimplicité, on dira qu'un terrain a une forme rectangulaire. 

De manière séquentielle, on pourrait déclarer de cette manière :

Main.java
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        int widthFieldOne = 12;
        int lengthFieldOne = 32;

        System.out.println("Mon terrain 1 a une largeur de " + widthFieldOne + "m et une longueur de " + lengthFieldOne + "m");

        int widthFieldTwo = 12;
        int lengthFieldTwo = 32;

        System.out.println("Mon terrain 2 a une largeur de " + widthFieldTwo + "m et une longueur de " + lengthFieldTwo + "m");
    }
}
```
Avec cette méthode, on comprends que si on veut ajouter un nouveau terrain, on va devoir dupliquer du code. Cela rend le programme difficile à maintenir et compliqué à faire évoluer.

C'est maintenant que la programmation orientée objet et son paradigme entrent en jeu pour résoudre ce genre de problèmes. 

### Création d'une classe `Field`

Le premier avantage est la possibilité de créer son propre type. Pour cela, en java, on va créer une nouvelle classe.
Cette classe sera appelée `Field` et représentera ce qu'est un terrain. 
À chaque complilation, un `Field.class` sera créé et à chaque modification que l'on fera dans cette classe terrain, le compilateur régénère ce `.class` afin d'apporter à l'intérieur les modifications. 

Field.java
```java
public class Field {
    ...
}
```

### Phase 1 : Déclaration

On pourra ainsi modifier notre classe `Main` en déclarant deux objets de type `Field` : 
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // délcaration de deux objets de type Field
        Field myFieldOne;
        Field myFieldTwo;
    }
}
```
Ici, la "variable" `myFieldOne` est du type `Field`. Il s'agit d'un objet typé en Field. Contrairement au type primitif `int`, `Field` est à écrire avec une majuscule. 
Avec un type primitif, on parlera de variable, et avec un type de classe, on parlera d'objet. 

### Phase 2 : Initialisation 

Pour initialiser les objets, on utilisera le mot clé `new` en faisant appel à la fonction constructeur : `new Field();`.  
L'objectif d'un constructeur est d'allouer un espace mémoire afin de placer à l'intérieur ce que va contenir l'objet.
Celui ci va retourner l'adresse de cet espace mémoire qui va finalement être stocké dans notre objet "myFieldOne".
En d'autre mots, `myFieldOne` est en quelque sorte un pointeur vers cet espace mémoire.  
En Java, on appelle cette adresse une référence.  
Si un objet n'est pas initialisé, il ne pointe alors vers aucun espace mémoire. On dit alors que cet objet est nul.
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // initialisation de deux objets de type Field
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation par le constructeur : 
        myFieldOne = new Field();
        myFieldTwo = new Field();
    }
}
```

### Phase 3 : utilisation

Pour l'instant, notre classe `Field` est vide, elle ne définit pas grand chose. On va maintenant populer notre classe en regardant ce que l'on peut y mettre. 

Qu'est ce qui définit un terrain ? Pour y répondre, on va faire appel aux attributs. 
Les attributs vont permettre de représenter ce qu'est l'objet. Dans notre cas, un terrain se définit par une largeur et une longueur. 
On va donc définir dans le corps de notre classe une largeur `width` de type int et une longueur `length` de type int également. `Ces attributs définissent la structure de l'objet`. Un attribut est également appelé un `champs` (field en anglais).

Lorsque le constructeur sera appelé, cela va se concrétiser par une allocation mémoire avec la structure de deux cases : une pour la largeur, et une pour la longueur. 

Field.java
```java
public class Field {
    int width;
    int length;
}
```

Pour attribuer des valeurs à mes objets, je vais faire appel à l'opérateur `.` depuis l'objet

Main.java
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field();

        // utilisation avec l'opérateur . depuis mon objet :
        myFieldOne.width = 12;
        myFieldOne.length = 32;

        myFieldTwo.width = 15;
        myFieldTwo.length = 42;
    }
}
```
Ici, j'attibue une valeur de 12 à la largeur et 32 à la longueur de mon premier terrain, et une largeur de 14 et une longueur de 42 pour mon deuxième terrain. 

Nos deux objets sont du même type, ils ont la même structure, mais il ne sont pas dans le même état, puisque leurs valeurs sont différentes. 

### Les méthodes de classes

Notre prochaine question va être centrée sur les capacités de notre classe et sur la définition de son comportement.  
On va donc déclarer des fonctions (appelées méthodes) qui vont permettre de définir le comportement de notre objet.
La méthode sera appelée directement depuis nos objets.

Qu'est-il possible de faire avec notre terrain ? 
On peut par exemple calculer la superficie du terrain. On va donc déclarer une méthode `area` qui va retourner un type `int`, et qui calculera la superficie du terrain : longueur x largeur. 
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

Pour obtenir un résultat exploitable, on va déclarer une variable de type `int` qui va recevoir le résultat de notre méthode. À noter qu'il n'est pas obligatoire de passer par une variable nommée. Cela sera préférable si on est amené à réutiliser la variable plusieurs fois. 
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field();

        // utilisation avec l'opérateur . depuis mon objet :
        myFieldOne.width = 12;
        myFieldOne.length = 32;

        myFieldTwo.width = 15;
        myFieldTwo.length = 42;
        
        int areaFieldOne = myFieldOne.area();
        System.out.println("Superficie du terrain 1 : " + areaFieldOne + "m2.");
        System.out.println("Superficie du terrain 2 : " + myFieldTwo.area() + "m2.");
    }
}
```

La classe `Main` et sa méthode `main` contient l'utilisation de nos objets de type `Field` et la classe `Field` contient la définition de notre type `Field` qui contient la définition de ce qu'est un terrain. 

La définition n'est faite qu'une seule fois et est ensuite compilée. Après, au lancement du programme, on utilise des objets que l'on va créer, on en crée autant que l'on veut et ces objets sont la concrétisation en mémoire de ce que l'on a défini dans la classe.  

### La construction de l'objet

On va pouvoir approfondir la classe en définissant un ou plusieurs constructeurs permettant de dire comment on va construire notre objet. 
Si un constructeur n'est pas défini pas dans la classe, il existe un constructeur par défaut qui ne prend rien en paramètre. Il s'agit de celui que l'on a déjà appelé depuis la méthode `main` avec le mot clé `new` : `new Field()`. 
Ce compilateur par défaut est automatiquement ajouté par le compilateur. Ce constructeur fait son travail : il alloue un espace mémoire structuré tel que la classe est définie.

Le constructeur a le même nom que la classe. C'est une méthode particulière qui ne possède pas de type de retour. 
Il est possible dans le constructeur d'initialiser les variables définies dans notre classe. Cela donnera des valeurs par défaut à tout objet initialisé mais non attribué. 
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
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field();

        // utilisation avec l'opérateur . depuis mon objet :
        // myFieldOne.width = 12;
        // myFieldOne.length = 32;

        myFieldTwo.width = 15;
        myFieldTwo.length = 42;
        
        int areaFieldOne = myFieldOne.area();
        System.out.println("Superficie du terrain 1 : " + areaFieldOne + "m2.");
        System.out.println("Superficie du terrain 2 : " + myFieldTwo.area() + "m2.");
    }
}
```

De cette manière, `myFieldOne` aura pour longueur et largeur les valeurs définies dans le constructeur de classe, alors que `myFieldTwo` contiendra les valeurs attribuées après l'initialisation dans `main`, puisque ces valeurs écrasent celles attribuées dans le constructeur. 

On peut ajouter un nouveau constructeur qui prendra deux paramètres de cette manière : 
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

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }
}
```
La construction de notre deuxième objet pourra se faire ainsi : 
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field(15, 42);

        // utilisation avec l'opérateur . depuis mon objet :
        // myFieldOne.width = 12;
        // myFieldOne.length = 32;
        
        int areaFieldOne = myFieldOne.area();
        System.out.println("Superficie du terrain 1 : " + areaFieldOne + "m2.");
        System.out.println("Superficie du terrain 2 : " + myFieldTwo.area() + "m2.");
    }
}
```
L'utilisation de l'un ou de l'autre constructeur se fera en fonction des informations que l'on connaît. 
Si on ne connaît pas à l'avance les données, on utilisera le premier constructeur, qui donnera des valeurs par défaut, et au contraire, si les données sont connues à l'avance, on pourra utiliser le second. 

Cet exemple n'est pas très cohérent mais c'était pour mettre en avant les possibilités de constructeur. En effet, définir des valeurs par défaut n'est pas très cohérent pour la définition d'un terrain. 
On pourrait supprimer le constructeur initialisant les valeurs par défaut et ne garder que celui demandant les paramètres largeur et longueur. Cela implique que pour construire un objet de type `Field`, il faudra forcément renseigner ces valeurs. Autrement, ce ne sera pas possible. 

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
On a ici une bonne représentation de structure de classe : 
* en premier les attributs de la classe
* ensuite le/les constructeur de classe
* enfin, les méthodes

Cette structure est important à respecter visuellement. Cela va nous permettre facilement de nous retrouver dans une classe. 
En réalité, comme le code est compilé, il n'est pas obligatoire de respecter cet ordre. Ce sera plus par convention, par bonne pratique et par souci de lisibilité. 

La POO en Java fonctionne de cette manière : la classe servira de moule pour nos objets, qui seront ensuite créés autant de fois que nécessaire lors de l'appel du type de classe.  

### Autres méthodes

On peut ajouter autant de méthodes que l'on souhaite, tant est si bien qu'elles sont cohérentes avec l'utilisation de notre classe. 

Par exemple, on peut ajouter une méthode d'affichage : 
```java
void display() {
    System.out.println("Terrain de taille : " + width + " x " + length);
}
```

on pourra ensuite appeler cette méthode dans notre `main`, en faisant attention à l'appeler après l'initialisation de l'objet : 
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field(15, 42);

        myFieldOne.display();
        myFieldTwo.display();

        int areaFieldOne = myFieldOne.area();
        System.out.println("Superficie du terrain 1 : " + areaFieldOne + "m2.");
        int areaFieldTwo = myFieldTwo.area();
        System.out.println("Superficie du terrain 2 : " + areaFieldTwo + "m2.");
    }
}
```

On peut aussi faire appel à une autre méthode au sein d'une méthode. 
Par exemple, la méthode `display` peut faire appel à la méthode `area` pour afficher également la superficie du terrain : 
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

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }

    void display() {
        System.out.println("Terrain de taille : " + width + " x " + length + ", superficie : " + area() + "m2");
    }
}
```
Cela va permettre d'éviter de devoir appeler la méthode `area()` dans `main` afin d'afficher la superficie : 
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field(15, 42);

        myFieldOne.display();
        myFieldTwo.display();
    }
}
```

On peut ajouter une nouvelle méthode qui va contenir des paramètres. Par exemple, une méthode permettant de vérifier si la superficie du terrain est plus grande que la valeur passée en paramètre de la méthode : 
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

    int area() {
        int fieldArea = length * width;

        return fieldArea;
    }

    void display() {
        System.out.println("Terrain de taille : " + width + " x " + length + ", superficie : " + area() + "m2");
    }

    boolean hasGreaterAreaThan(int value) {
        if (area() > value) {
            return true;
        } else {
            return false;
        }
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Terrains");

        // déclaration de deux objets de type terrain :
        Field myFieldOne;
        Field myFieldTwo;

        // initialisation des objet par le constructeur :
        myFieldOne = new Field();
        myFieldTwo = new Field(15, 42);

        myFieldOne.display();
        myFieldTwo.display();

        if (myFieldOne.hasGreaterAreaThan(400)) {
            System.out.println("Mon terrain 1 a une superficie plus grande que 400 m2.");
        } else {
            System.out.println("Mon terrain 1 n'a pas une superficie plus grande que 400 m2.");
        }
    }
}
```

## Les visibilités

Nous allons découvrir deux nouveaux mots clés qui vont nous permettre de jouer avec la visibilité des éléments que l'on retrouve dans une classe. 

Dans la classe, nous avons déclaré des attributs qui définissent la structur, un constructeur qui définit la façcon de construire un nouveau terrain et puis des méthodes permettant de définir le comportement de notre objet. 

Il y a également une visibilité qu'on va définir pour chacun de ces éléments. Cette visibilité va se placer devant l'élément. 

Les deux mots clés sont `public` et `private` :
- un élément `public` indique qu'il est accessible à l'intérieur et à l'extérieur de la classe. Cela signifie qu'on peut y accéder et l'utiliser/la manipuler depuis n'importe quelle autre classe dans l'application, grâce à l'opérateur `.`. L'accès pourra être fait en lecture et en écriture.  
- un élément `private` indique que cet élément n'est accessible que depuis l'intérieur de la classe à laquelle il appartient. On pourra également accéder et manipuler cet élément grâce à l'opétateur `.`. 

Pour l'exemple, dans notre class `Field`, on va indiquer que notre largeur `width` a une visibilité `public` et que la longueur `length` a une visibilité `private`. 
`myFieldOne.width` sera utilisable dans la classe `Field` mais aussi dans la classe `main`, alors que `myFieldOne.length` ne sera utilisable que dans la classe `Field`. 

La décision de rendre `public`ou `private` un élément se fera lors de la conception de l'application, si on décide ou non de rendre un élément de classe accessible ou non. 

De manière générale, on va déclarer le constructeur en `public`. Il est également possible de le déclarer en `private` dans certains cas.

On pourra appliquer le même principe sur les méthodes. On gardera une méthode privée lorsqu'elle est utilitaire à l'intérieur de la classe et qu'elle n'a pas pour vocation à être appelée depuis l'extérieur de la classe. 

## Le principe d'encapsulation

### Définition

Pour rappel, la POO est fondée sur quatre fondamentaux qui sont l'encapsulation, l'abstraction, l'héritage et le polymorphisme.

Le principe d'encapsulation va chercher à protéger notre code afin que celui ci ne devienne pas incohérent. 
Par incohérent, on entend que le code autoriserait l'objet créé à évoluer dans un état qui ne serait plus correct. 

Dans notre exemple, cela se traduirait par quelque chose comme un cas ou notre terrain aurait une largeur ou une longueur négative. Une valeur négative ne provoquerait pas d'erreur, mais cela engendrerait un résultat avec une incohérence lors de l'exécution du programme. 

En déclarant une largeur `public`, cela permet à n'importe qui qui accède au programme de déclarer une valeur négative, puisqu'il n'existe aucun contrôle. 
En plus de la modification, cette valeur est également disponible en lecture simple. 

Le principe d'encapsulation consiste à déclarer les attributs privés afin de ne pas pouvoir y accéder directement depuis l'objet : on protège les attributs de classe. 
En effet, seul le développeur doit prendre les responsabilités sur la façon dont la classe doit être développée.
De cette manière, on va protéger la classe qui sera utilisée ailleurs dans le programme par d'autres développeurs qui pourraient utiliser des objets du type de la classe créée. 

Grâce au principe d'encapsulation, on protège la définition de ce qu'est la classe en interdisant la manipulation directe de ses attributs. De ce fait, l'objet va cacher ses attributs et n'autorisera personne à le manipuler n'importe comment. 

### Les getters

Le principe d'encapsulation indique que les attributs d'une classe doivent être privés. 
Pour y accéder, on va créer une méthode : un `getter` (`accesseur` en français).

Par convention, un getter sera écrit : `get` + nom de l'attribut, tout attaché, en camelCase, suivi de parenthèses.
`getWidth()`, `getLength()`, etc. 

Point important, un getter doit être déclaré `public` pour permettre d'accéder depuis n'importe ou dans l'application.

```java
public int getWidth() {
    return width;
}

public int getLength() {
    return length;
}
```

Pour accéder au getter depuis une autre classe comme la classe `main`, on utilisera le nom de l'objet, suivi de l'opérateur `.`, et enfin le getter

```java
myFieldOne.getWidth();
myFieldOne.getLength();
```

### Les setters

De la même manière que pour la lecture, on ne pourra pas modifier directement un attribut. 
Pour cela, on fera appel aux setters (ou mutateur en français). 

Le setter fonctionnera de la même manière que le getter : `set` + nom de l'attribut attaché en camelCase suivi des parenthèses, déclaré en `public`. 

En revanche, cette méthode ne retourne rien : `void`, et prend en paramètre une valeur qui va venir modifier l'attribut associé. 

```java
public void setWidth(int newWidth) {
    width = newWidth;
}

public void setLength(int newLength) {
    length = newLength;
}
```

Comme cette méthode est `public`, on va pouvoir l'utiliser depuis une autre classe telle que `main`.

```java
myFieldOne.setWidth(14);
```

Il y a un intérêt tour particulier à utiliser un setter : en utilisant une telle méthode, on peut ajouter du code permettant de contrôler la manière dont on va modifier l'attribut. Par exemple, si on ne souhaite pas de valeur négative pour une longueur ou une largeur, ou encore une valeur beaucoup trop grande, on peut ajouter des séries de tests et ajouter une instruction permettant de lever une exception/erreur (point qu'on abordera dans un prochain chapitre).

```java
public void setWidth(int newWidth) {
    if (newWidth < 0) {
        // throw exception
    } else {
        width = newWidth;
    }
}
```

En résumé, le principe d'encapsulation est le fait d'enfermer à l'intérieur de la classe sa représentation faite par ses attributs et d'offrir par un accès public à ses attributs seulement par des méthodes. 
Afin de pouvoir lire la valeur de cet attribut, on utilise la méthode get (getter), et pour modifier la valeur de cet attribut, on utilise la méthode set (setter) avec la possibilité d'ajouter des points de contrôles lors de la modification.

Point important, les getters et setters ne sont pas du tout obligatoire. On peut d'ailleurs faire des méthodes 'get' dans méthodes 'set' et inversement.
La responsabilité de protéger la classe est attribuée au développeur de cette classe et c'est à lui d'autoriser ou non les accès aux attributs via des getters et des setters. 

### Générer les getters et setters automatiquement avec IntelliJ

l'IDE IntelliJ permet de générer automatiquement les getters et setters. 
Pour cela, on va utiliser la souris avec un clic droit dans la classe, puis `generate`, puis `Getter et Setter`, et enfin sélectionner les attributs pour lesquels on souhaite générer les getters et setters.

On pourra remarquer que les setters utilisent le mot clé `this`. Nous verrons plus en détail ce mot clé dans le paragraphe dédié. 

## Surcharge de méthode : overloading

La surcharge (overloading) consiste à définir plusieurs méthodes portant le même nom dans une même classe, à condition que leur liste de paramètres diffère. 

Le compilateur choisit la bonne version selon les arguments passés à l'appel.
```java
public void increaseLength() { 
    length++; 
}
public void increaseLength(int value) { 
    length += value; 
}
```
à l'appel, on utilisera une méthode ou l'autre en fonction du paramètre "optionnel" qui sera passé ou non : 
```java 
myFieldOne.increaseLength();     // → version sans paramètre (+1)
myFieldOne.increaseLength(20);   // → version avec int (+20)
```
Le choix est fait à la compilation (liaison statique) d'après le nombre et le type des arguments.

### Ce qui compte pour la signature :

La signature d'une méthode = nom + types/nombre/ordre des paramètres. Pour surcharger, il faut que l'un de ces éléments change :
```java
void display()                    // 0 paramètre
void display(String prefix)       // 1 paramètre
void display(int a, String b)     // types différents
void display(String b, int a)     // ordre différent : valide aussi
```

### Ce qui ne suffit PAS

- Changer uniquement le type de retour : erreur de compilation.
```java
int area() { ... }
double area() { ... }   // => même signature
```
- Changer uniquement le nom des paramètres : `f(int a)` et `f(int b)` sont identiques.
- Changer uniquement les modificateurs (`public`, `static`...) ou la clause `throws`.

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

les deux versions de increaseLength pourraient se déléguer :
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

1. **Conversion implicite de types**. Java choisit la surcharge la plus spécifique, en élargissant au besoin (int → long → double) :
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

3. **Le choix dépend du type déclaré, pas du type réel**. Contrairement au polymorphisme (redéfinition / overriding), la surcharge est résolue sur le **type statique** :
```java
void print(Object o) { System.out.println("Object"); }
void print(String s) { System.out.println("String"); }

Object x = "hello";
print(x);   // affiche "Object", car x est déclaré Object
```

### Surcharge vs redéfinition

|            |Surcharge (overload)      | Redéfinition (override) |
| ---------- | ------------------------ | ----------------------- |
| Où         | Même classe (ou héritée) | Sous-classe             |
| Signature  | **Différente**           | **Identique**           |
| Résolution | Compilation              | Exécution               |
| Annotation | aucune                   | `@Override`             | 

## Le mot clé `this`

### Définition

this est une référence à l'instance courante, c'est-à-dire l'objet sur lequel une méthode ou un constructeur est en train de s'exécuter.
- Dans une méthode, this désigne l'objet qui a appelé la méthode. Avec myFieldOne.display(), this vaut myFieldOne dans le corps de display.
- Dans un constructeur, this désigne l'objet en cours d'initialisation. Quand new est appelé, la mémoire est allouée sur le tas, les champs reçoivent leurs valeurs par défaut, puis le constructeur s'exécute avec this pointant vers cet objet.

### Les 4 usages

1. **Accéder aux champs de l'instance** : `this.width`
2. **Lever l'ambiguïté (masquage / shadowing)** quand un paramètre porte le même nom qu'un champ
3. **Appeler un autre constructeur** de la même classe : `this(...)`
4. **Retourner l'instance courante** : `return this`, ce qui permet d'enchaîner les appels (method chaining)

Et une limite : `this` n'existe pas dans un contexte `static`.

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

**Masquage**. Dans `Field(int width, int length)`, le nom `width` désigne le paramètre, car la variable locale prend le dessus sur le champ. Sans `this`, `width = width;` affecte le paramètre à lui-même : le code compile, mais les champs restent à `0`. `this.width` désigne explicitement le champ de l'objet.

`this(...)`. `Field()` ne duplique aucune logique : il délègue à `Field(int, int)`. L'appel doit être la première instruction du constructeur, et un constructeur ne peut pas s'appeler lui-même, directement ou en cycle.

`return this`. Dans `a.increaseLength(5).increaseLength(3)`, chaque appel renvoie `a` lui-même : il n'y a aucune copie, c'est le même objet modifié deux fois. C'est la base du method chaining (très utilisé dans le pattern Builder).

`this` **dépend de l'appelant**. Le code de `area()` existe une seule fois, mais `this` pointe vers `a` ou `b` selon l'appel, ce qui permet à chaque instance d'avoir ses propres valeurs.

**Pas de `this` en `static`**. Une méthode statique appartient à la classe, pas à une instance : elle ne peut ni utiliser `this`, ni accéder directement aux champs d'instance.

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

> À vérifier selon ta version de Java : les versions récentes (préversion à partir de Java 21) assouplissent cette signature, notamment avec des `main` d'instance. La forme ci-dessus reste la forme classique.

**Compilation et lancement** (IntelliJ fait cela pour toi et place les `.class` dans `out/production/<module>`) :

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

Cela garantit que la valeur reçue n'est pas écrasée par erreur dans le corps de la méthode. Cela ne change rien pour l'appelant : Java passe les arguments **par valeur**, sa variable n'est de toute façon jamais modifiée par une réaffectation du paramètre. Comme pour les attributs, si le paramètre est un objet, `final` interdit de changer la référence, pas de modifier l'objet.

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