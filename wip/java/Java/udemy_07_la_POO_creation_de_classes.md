# Les bases de la POO

## Rappel sur la POO

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

## Exemple

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

## Création d'une classe `Field`

Le premier avantage est la possibilité de créer son propre type. Pour cela, en java, on va créer une nouvelle classe.
Cette classe sera appelée `Field` et représentera ce qu'est un terrain. 
À chaque complilation, un `Field.class` sera créé et à chaque modification que l'on fera dans cette classe terrain, le compilateur régénère ce `.class` afin d'apporter à l'intérieur les modifications. 

Field.java
```java
public class Field {
    ...
}
```

## Phase 1 : Déclaration

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

## Phase 2 : Initialisation 

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

## Phase 3 : utilisation

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

## Les méthodes de classes

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

## La construction de l'objet

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

## Structure de classe

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

## Autres méthodes

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

