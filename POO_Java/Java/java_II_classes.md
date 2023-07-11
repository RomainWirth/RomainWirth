# JAVA : LES CLASSES

## Rappels (voir POO_variables_to_objets.md)

### la déclaration des variables

La variable est un conteneur qui contient une donnée. Cette donnée s'appelle une valeur.<br>
L'outil doit bien entendu avoir un nom.

### Nommer une variable

Pour bien nommer une variable, on suivra certaines conventions :
1. Le nom doit être descriptif
2. Le nom doit être complet
3. Le nom doit suivre une convention d'appellation commune

### Déclarer une variable

Afin d'utiliser une variable dans le code, on va devoir la créer, ou, en d'autres termes :<br>
**La Déclarer**<br>

### La super variable : L'objet

L'objet est une variable qui contient plusieurs valeurs, associées à des clés.<br>
Afin de créer un objet, on va utiliser une classe : le moule pour la création d'objets ayant une même structure.<br>

L'objet est donc une instance de la classe.<br>
Il n'existe qu'une classe, et plusieurs objets ou instance de classe.<br>


## Les classes

Tout programme a besoin d'une ou plusieurs classes qui font office de modèle.

Par exemple, un programme qui récupère les résultats des tests peut avoir plusieurs classes :<br>
* Student
* course
* grade

Chaque étudiant est représenté en instance de la classe Student. Il s'agit d'un objet de la classe Student.

Les classes sont les "plueprints" des objets. Elles définissent leur structure générale.

### Les classes : La syntaxe

Une classe sera construire ainsi :
```
public class Store {
  // instance fields
  String productType;
  int inventoryCount;
  double inventoryPrice;
  
  // constructor method
  public Store(String product, int count, double price) {
    productType = product;
    inventoryCount = count;
    inventoryPrice = price;
  }
  
  // main method
  public static void main(String[] args) {
    Store lemonadeStand = new Store("lemonade", 42, .99);
    Store cookieShop = new Store("cookies", 12, 3.75);
    
    System.out.println("Our first shop sells " + lemonadeStand.productType + " at " + lemonadeStand.inventoryPrice + " per unit.");
    
    System.out.println("Our second shop has " + cookieShop.inventoryCount + " units remaining.");
  }
}
```
Nous avons une première partie avec la déclaration de propriétés : les variables internes à la classe.<br>
Nous avons ensuite la méthode constructor, qui indique de quelle manière est construite la classe.<br>
Enfin, la méthode qui renvoit le résultat de la classe.

### Les classes : Les constructors

Afin de créer un objet (ou instance de classe), on aura besoin d'une méthode constructor.<br>
Le constructor est défini au sein de la classe.<br>

Afin de créer une instance, on devra appeler (ou invoquer) le constructeur dans la méthode "main()".<br>
exemple :
```
public class Car {
    // Constructor method
    public Car() {
        // instructions pour créer l'instance de classe Car
    }
    
    public static void main(String[] args) {
        // corps de la méthode main
        Car ferrari = new Car();
    }
}
```

Dans cet exemple, au lieu d'être déclarée avec un type de donnée primitif (int ou boolean), la variable ferrari est déclarée comme un type référence de donnée.<br>

### Les classes : Les champs d'instance

Ce code :
```
public class Store {
  
  // new method: constructor!
  public Store() {
    System.out.println("I am inside the constructor method.");
  }
  
  // main method is where we create instances!
  public static void main(String[] args) {
    System.out.println("Start of the main method.");
    
    // create the instance below
    Store lemonadeStand = new Store();
    // print the instance below
    System.out.println(lemonadeStand);
  }
}
```

résulte avec ceci dans la console :
```bash
Start of the main method.
I am inside the constructor method.
Store@2aae9190
```

L'impression de l'instance Store donne ceci : `Store@2aae9190`<br>
la première partie : **'Store'** fait référence à la classe.<br>
La seconde partie : **'@2aae9190'** fait référence à la localisation de l'instance dans l'espace mémoire de l'ordinateur.<br>

Actuellement, vu qu'il n'y a pas de données dans la classe, la console renvoit ces informations.<br>

Quand un objet es créé, le constructeur met en place l'état initial de l'objet.<br>
Cet état est fait de données associées qui représentent les caractéristiques d'un objet.<br>

Lorsqu'on souhaite modifier les caractéristiques des différentes instances (objets), on doit ajouter des propriétés aux classes :<br>
les champs d'instance.

exemple :
``` 
public class Store {
  // declare instance fields here!
  String productType;
  
  // constructor method
  public Store() {
    System.out.println("I am inside the constructor method.");
  }
  
  // main method
  public static void main(String[] args) {
    System.out.println("This code is inside the main method.");
    
    Store lemonadeStand = new Store();
    
    System.out.println(lemonadeStand);
  }
}
```

### les classes : Les paramètres constructor

Pour créer des objets avec des états individuels dynamiques, on utilisera une combinaison de la méthode constructeur et des propriétés du corps de la classe.<br>

On commencera par ajouter des propriétés au corps de la classe = déclaration de variables internes.<br>
Ces propriétés sont des informations générales nécessaires à la construction de l'objet.<br>

On fera référence à ces propriétés dans le constructeur de classe en y ajoutant des paramètres faisant référence à ces propriétés.<br>
Pour cela, il faudra passer en paramètre de cette fonction la référence à la propriété.<br>

Exemple :
```
public class Car {
  String color; // propriété de la classe
  // constructor method with a parameter
  public Car(String carColor) { // 
    // parameter value assigned to the field
    color = carColor;
  }
  public static void main(String[] args) {
    // program tasks
  }
}
```
Dans cet exemple, le paramètre _carColor_ représente n'importe quel valeur _String_ qu'on souhaite passer au constructeur.<br>
Il s'agit d'un paramètre "formal".

Il existe deux types de paramètres : "formal" & "actual".<br>
1. un paramètre "formal" spécifie le type et nom de la donnée qui peut être passé dans la method (fonction).<br>
   Les paramètres passés à la fonction permettent au compileur de différencier quelle méthode de constructeur utiliser lors de la construction de l'objet.<br>
```
public class Car {
  String color;
  int mpg;
  boolean isElectric;
 
  // constructor 1
  public Car(String carColor, int milesPerGallon) {
    color = carColor;
    mpg = milesPerGallon;
  }
  // constructor 2
  public Car(boolean electricCar, int milesPerGallon) {
    isElectric = electricCar;
    mpg = milesPerGallon;
  }
}
```
dans cet exemple, nous avons deux constructeurs.<br>
Quand on initialise un objet, le compiler saura quel constructeur utiliser grâce aux paramètres passés aux différentes methods.<br>
par exemple : `Car myCar = new Car(true, 40)` sera créé par le second constructeur car les arguments correspondent au type et à l'ordre des paramètres passés au second constructeur.<br>
Si on ne définit par de constructeur, le compileur java générera un constructeur par défaut qui ne contient aucuns arguments, et assignera à l'objet des valeurs par défaut.<br>
Des valeurs par défaut peuvent être créées en assignant des valeurs aux propriétés lors de leur délaration :
```
public class Car {
  String color = "red";
  boolean isElectric = false;
  int cupHolders = 4;
 
  public static void main(String[] args) {
    Car myCar = new Car();
    System.out.println(myCar.color); // Prints: red
  }
}
```
2. le paramètre "actual" est le paramètre (l'argument) passé lors de l'appel de la méthode.<br>
   Lorsque le constructeur possède des paramètres, on doit passer des valeurs lors de l'appel de la méthode.<br>
   Ces valeurs s'appellent des arguments. Une fois passés, ils seront utilisés pour donner aux propriétés une valeur initiale.<br>
   exemple :
```
public class Car {
  String color;
 
  public Car(String carColor) {
    // assign parameter value to instance field
    color = carColor;
  }
 
  public static void main(String[] args) {
    // parameter value supplied when calling constructor
    Car ferrari = new Car("red");
  }
}
```
Plusieurs points à noter :
* On passe la chaîne de caractètres `"red"` lors de l'appel de la méthode constructeur `new Car("red");`
* Le type de la valeur **DOIT** correspondre au type déclaré en paramètre de la fonction.<br>
* Au sein du constructeur, le paramètre `carColor` fait référence à la valeur passée lors de l'invocation : `"red"`<br>
  Cette valeur est assignée à la propriété `color`. (comme `color`a déjà été déclaré, il n'est pas nécessaire de spécifier son type lors de l'assignation).<br>
* L'objet `ferrari` contient l'état de `color` comme une propriété faisant référence à la valeur `"red"`.

Pour accéder à la valeur de ce champs, on utilisera l'opérateur `( . )` :
```
/*
accessing a field:
objectName.fieldName
*/
 
ferrari.color;
// "red"
```

###  Les classes : Les champs multiples

les objets ne sont pas limités à un seul champs d'instance.<br>
On peut déclarer autant de champs qui sont nécessaire à la réalisation du programme.<br>
Dans l'exemple ci-dessous, on trouvera trois propriétés à la classe `Car` : une chaîne de caractères, un booléen, un nombre entier.
```
public class Car {
  String color;
  // new fields!
  boolean isRunning;
  int velocity;
 
  // new parameters that correspond to the new fields
  public Car(String carColor, boolean carRunning, int milesPerHour) {
    color = carColor;
    // assign new parameters to the new fields
    isRunning = carRunning;
    velocity = milesPerHour;
  }
 
  public static void main(String[] args) {
    // new values passed into the method call
    Car ferrari = new Car("red", true, 27);
    Car renault = new Car("blue", false, 70);
 
    System.out.println(renault.isRunning);
    // false
    System.out.println(ferrari.velocity);
    // 27
  }
}
```
Le constructeur a maintenant plusieurs paramètres pour recevoir des valeurs pour les nouveaux champs.<br>
Il est nécessaire de spécifier les types et les noms de chaque paramètre à passer à la méthode.<br>
A noter que l'ordre est important aussi. Il faudra passer les valeurs dans le bon ordre lors de l'appel du constructeur.<br>
```
// values match types, no error
Car honda = new Car("green", false, 0);
 
// values do not match types, error!
Car junker = new Car(true, 42, "brown");
```

### Les classes : Résumé

* Java est un langage de programmation orienté objet qui possède au minimum une classe.<br>
  Les programmes sont souvent construits à partir de plusieurs classes et objets (ou instances de classes).<br>
* Les classes définissent l'état et le comportement de leurs instances.<br>
    * Le comportement découle des méthodes définies dans les classes.<br>
    * Les états découlent des propriétés (champs d'instance) déclarées au sein de la classe.<br>
* Les classes sont modélisées à partir de choses réelles qu'on veut représenter dans notre programme.