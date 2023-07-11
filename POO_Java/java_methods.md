# JAVA : LES METHODES

N.B. : avant de procéder plus loin, regarder le memo sur les classes Java.

## INTRODUCTION

Les méthodes permettent de créer un comportement aux objets lors de leur construction.<br>
Les méthodes sont des blocs de code réutilisables utilisés pour accomplir des tâches spécifiques : des **_fonctions_**.<br>
Nous avons la capacité de définir nos propres méthodes qui vont prendre une valeur d'entrée, en faire quelque chose, et en retourner la sortie qu'on souhaite.<br>

Les méthodes vont accomplir de petites tâches qui vont modifier l'état d'un objet.<br>
Elle permettent de décomposer un grand problème en de plus petits problèmes beaucoup plus gérables.<br>

Lorsqu'on comprend ce qu'une méthode réalise, mais qu'on ne sait pas de quelle manière, on appelle cela : "procedural abstraction".<br>

## Définir une méthode

Prenons l'exemple suivant :
```
public void checkBalance(){
  System.out.println("Hello!");
  System.out.println("Your balance is " + balance);
}
```
la première ligne `public void checkBalance()` est la déclaration de la méthode. Cela donne au programme des informations à son propos :
* `public` signifie que d'autres classes peuvent accéder à cette méthode.
* `void` indique qu'il n'y a pas de finalité spécifique à la méthode. Il existe d'autres finalités aux methods.
* `checkBalance()` est le nom de la méthode.

Chaque méthode à sa propre signature qui comprends : le nom et les types de paramètres.<br>

Le corps de la méthode comprends tout ce qui se situe entre les accolades `{` et `}`.

## Appeler une méthode

Lorsqu'on appelle une méthode "non-static" dans une classe, elle peut être utilisée dans un objet de cette classe.<br>
Afin d'avoir une exécution des méthodes, il faut les appeler dans l'objet qu'on a créé.<br>
exemple :
```
class Car {
  String color;
 
  public Car(String carColor) {
    color = carColor;
  }
 
  public void startEngine() {
    System.out.println("Starting the car!");
    System.out.println("Vroom!");
  }
 
  public static void main(String[] args){
    Car myFastCar = new Car("red");
    // Call a method on an object 
    myFastCar.startEngine();
    System.out.println("That was one fast car!");
  }
}
```
Output :
```bash
Starting the car!
Vroom!
That was one fast car!
```

Dans la méthode `main`, nous faison appel à la méthode `startEngine()` de cette manière :
```
myFastCar.startEngine();
```
Premièrement, on fait référence à l'objet `myFastCar`, puis on utiliser l'opérateur `.` pour appeler la méthode `startEngine()`.<br>
à noter qu'on doit inclure les parenthèdes après le nom de la méthode pour pouvoir l'appeler.<br>

Le code est généralement exécuté dans son ordre de lecture de haut en bas.<br>
Cependant, les méthodes sont ignorées par le compiler à moins d'être appelées.<br>

Quand la méthode est appelée, le compiler exécute chaque déclaration au sein de la méthode.<br>
Une fois toutes les instructions exécutées, l'ordre d'exécution de haut en bas continue.

L'output ressort de cette manière car la méthode est appelée avant le println "That was one fast car!".

## la portée (scope)

Une méthode est une tâche qu'un objet de classe va exécuter.<br>

Le domaine de cette tâche est définie par les accolades : `{` et `}`.<br> 
Tout ce qui se situe entre ces accolade (dans le corps de la méthode) fait partie de cette tâche.<br>
Le domaine est appelé "la portée" (ou scope en anglais).<br>

On ne peut pas accéder aux variables qui sont déclarées dans la méthode et qui sont en dehors du scope de cette méthode.<br>
exemple :
```
class Car {
  String color;
  int milesDriven;
 
  public Car(String carColor) {
    color = carColor;
    milesDriven = 0;         
  }
 
  public void drive() {
     String message = "Miles driven: " + milesDriven;
     System.out.println(message);
  }
 
  public static void main(String[] args){
     Car myFastCar = new Car("red");
     myFastCar.drive();
  }
}
```
Dans le code ci-dessus, la variable `message`, déclarée et initialisée dans la méthode `drive` ne peut pas être utilisée dans `main()`.<br>
Elle n'existe que dans le _scope_ de la méthode `drive()`.<br>

En revanche, `mileDriven`, qui est déclaré au début de la classe, peut être utilisée dans toutes les méthodes de la classe.<br>
Son scope est inclu dans toute la classe.<br>

## Ajouter des paramètres

Le scope d'une méthode nous empêche d'utiliser des variables déclarées dans une méthode vers une autre.<br>

De la même manière qu'on a ajouté des paramètres aux constructeurs, on peut customiser toutes les autres méthodes pour accepter des paramètres.<br>
exemple : 
```
class Car {
 
  String color;
 
  public Car(String carColor) {
    color = carColor;         
  }
 
  public void startRadio(double stationNum, String stationName) {
    System.out.println("Turning on the radio to " + stationNum + ", " + stationName + "!");
    System.out.println("Enjoy!");
  }
 
  public static void main(String[] args){
    Car myCar = new Car("red");
    myCar.startRadio(103.7, "Meditation Station");
  }
}
```
Dans cet exemple, nous avons une méthode `startRadio()` qui prends en paramètres `Double stationNum` et `String stationName`.<br>
En ajoutant des valeurs on impacte la signature de la méthode.<br>
Comme la signature des constructeurs, la signature d'une méthode inclue son nom ainsi que les types des paramètres acceptés.<br>
La signature de la méthode `startRadio()` est donc : `startRadio(Double, String)`.

Dans la méthode `main()`, on fait appel à la méthode `startRadio()` sur l'objet `myCar` en lui passant des arguments double `103.7` et string `"Meditation Station`.<br>
Cela donne en résultat :
```bash
Turning on the radio to 103.7, Meditation Station!
Enjoy!
```
N.B. : comme pour les constructeurs, les arguments passés lors de l'appel de la méthode doivent être dans le bon ordre!

Grâce à la "surcharge" des méthodes, les programmes Java peuvent contenir plusieurs méthodes portant le même nom,<br> 
tant que la liste des paramètres de chaque méthode est _unique_.
exemple :
```
// Method 1
public void startRadio(double stationNum, String stationName) {
  System.out.println("Turning on the radio to " + stationNum + ", " + stationName + "!");
  System.out.println("Enjoy!");
}
 
// Method 2
public void startRadio(double stationNum) {
  System.out.println("Turning on the radio to " + stationNum + "!");
}
 
public static void main(String[] args){
  Car myCar = new Car("red");
  // Calls the first startRadio() method
  myCar.startRadio(103.7, "Meditation Station");
 
  // Calls the second startRadio() method
  myCar.startRadio(98.2);
}
```

## Réassigner les propriétés

exemple :
```
public class SavingsAccount{
  double balance;
  public SavingsAccount(double startingBalance){
    balance = startingBalance;
  }
 
  public void deposit(double amountToDeposit){
     //Add amountToDeposit to the balance
  }
 
  public void withdraw(double amountToWithdraw){
     //Subtract amountToWithdraw from the balance
  }
 
  public static void main(String[] args){
 
  }
}
```
Dans cet exemple, nous avons une variable balance déclarée dans la classe SavingsAccount.<br>
Nous avons deux méthodes qui changent l'état de cette variable : `deposit()` et `withdraw()`.<br>
Elles ont pour but de changer la valeur de `balance` en ajoutant ou en enlevant une valeur.<br>

On peut réassigner à `balance` une nouvelle valeur en utilisant l'opérateur `=` :
```
public void deposit(double amountToDeposit){
  double updatedBalance = balance + amountToDeposit;
  balance = updatedBalance;
}
```

En appelant `deposit()`, cela devrait changer la valeur de la propriété `balance` :
```
public static void main(String[] args){
  SavingsAccount myAccount = new SavingsAccount(2000);
  System.out.println(myAccount.balance);
  myAccount.deposit(100);
  System.out.println(myAccount.balance);
}
```
ce code print en premier `2000` : la valeur initiale de `myAccount.balance`.<br>
ensuite, on imprime `2100`, qui est la valeur de `myAccount.balance` après l'exécution de la méthode `deposit()`.

Changer les propriétés est la manière dont on change l'état d'un objet.<br>
Cela rend notre objet plus flexible et réaliste.<br>

