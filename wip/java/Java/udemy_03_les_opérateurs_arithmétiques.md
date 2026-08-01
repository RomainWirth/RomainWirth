# Les Opérateurs arithmétiques

## L'opérateur d'addition `+` et l'opérateur de soustraction `-`

Cet opérateur permet d'additionner deux nombres entiers. 
Le résultat d'une telle opération doit être stockée dans une variable.
```Java
int numberOne = 10;
int numberTwo = 5;

int sum = numberOne + numberTwo;
System.out.print(sum); // 15
```

L'opérateur de soustraction intervient auprès des nombres pour opéter une soustraction.
Tout comme pour l'addition, il faut toujours stocker le résultat dans une nouvelle variable.
```Java
int numberOne = 10;
int numberTwo = 5;

int sub = numberOne - numberTwo;
System.out.print(sum); // 5
```

Ces deux opérateurs retournent tous les deux un résultat typé, du même type que les variables qui sont utilisées dans l'opération. 
Si on additionne ou qu'on soustrait deux entiers de type int, le résultat sera stocké dans une variable de type int également. 

## Le multiplicateur `*` et le diviseur `/`

Ces deux opérateurs permettent de multiplier ou de soustraire des variables de nombres entre elles. 
```Java
int numberOne = 10;
int numberTwo = 5;

int mult = numberOne * numberTwo;
int div = numberOne / numberTwo;
System.out.print(mult); // 50
System.out.print(div); // 2
```
Lorsqu'on divise un entier par un autre, le résultat sera également un entier : un int divisé par un int sera stocké dans une variable de type int. 
Par exemple, si on cherche à diviser 42 par 20, on obtiendra 2, car en faisant 2 x 20 on obtient 40, et le reste est 2. 

## Le modulo `%`

Le modulo permet de récupérer le reste d'une division d'entiers. 
Par exemple, si on divise 42 par 5, on obtient 8, reste 2. 
En faisant l'opération arithmétique 42 modulo 5, on obtiendra donc 2. 
```Java
int numberOne = 42;
int numberTwo = 5;

int modulo = numberOne % numberTwo;
System.out.print(modulo); // 2
```

Le reste dans une division est forcément plus petit que le diviseur.
Si on récupère le reste dans la division par 2, cela nous permet d'obtenir 0 ou 1.
Si le reste tombe à 0, la division tombe juste, ce qui signifie que le nombre est pair. 
Si au contraire, le reste tombe à 1, dans ce cas le nombre est impair.

## Renvoyer un `double` dans une division de `int` par un `int`

On a vu que diviser une variable de type `int` par une autre variable de type `int` retourne une variable de type `int`. 
Si notre division n'est pas exacte, et qu'il y a un reste, il faudrait que notre variable de retour soit une variable de type `double`. 

Si on force le stockage du résultat dans une variable de type `double` alors que les variable utilisées dans l'opération sont de type `int`, le résultat sera bien une variable de type `double` mais incomplète, c'est à dire qu'on aura le résultat de l'entier à gauche de la virgule, et zéro en chiffre après la virgule :
```Java
int numberOne = 42;
int numberTwo = 5;

double div = numberOne / numberTwo;
System.out.print(div); // 8.0
```
Pour obtenir un double réel, il faudra passer par des variables transitoires du type souhaité : 
```Java
int numberOne = 42;
int numberTwo = 5;

double numberOneDoubled = numberOne;
double numberTwoDoubled = numberTwo;

double div = numberOneDoubled / numberTwoDoubled;
System.out.print(div); // 8.4
```

Il est possible d'effectuer d'opération arithmétique entre deux variables de type différent. 
Par exemple, diviser un `double` par un `int` donnera un résultat de type `double`.

### exercice d'opérateurs arithmétiques : somme et division

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la première montagne (chaîne de caractères) : ");
        String firstMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la première montagne (nombre entier) : ");
        int firstMountainHeight = scanner.nextInt();

        System.out.print("Saisir le nom de la deuxième montagne (chaîne de caractères) : ");
        String secondMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la deuxième montagne (nombre entier) : ");
        int secondMountainHeight = scanner.nextInt();

        int sum = firstMountainHeight + secondMountainHeight;
        System.out.println("À elle deux, les deux montagnes font : " + sum + " mètres.");

        int average = sum / 2;

        System.out.println("La moyenne entre ces deux montagne est de : " + average + " mètres.");

        scanner.close();
    }
}
```
résultat dans le terminal
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=43237 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la première montagne (chaîne de caractères) : Mont-blanc
Saisir la hauteur de la première montagne (nombre entier) : 4809
Saisir le nom de la deuxième montagne (chaîne de caractères) : Pic-du-midi
Saisir la hauteur de la deuxième montagne (nombre entier) : 2877
À elle deux, les deux montagnes font : 7686 mètres.
La moyenne entre ces deux montagne est de : 3843 mètres.

Process finished with exit code 0
```

Dans cet exemple, la variable `sum` retournée avec nos deux nombres est une somme paire : 7686, on tombe donc sur une moyenne "juste".
Essayons de tester avec un résultat de `sum` qui est un nombre impair : 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=41903 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la première montagne (chaîne de caractères) : Mont-blanc
Saisir la hauteur de la première montagne (nombre entier) : 4810
Saisir le nom de la deuxième montagne (chaîne de caractères) : Pic-du-midi
Saisir la hauteur de la deuxième montagne (nombre entier) : 2877
À elle deux, les deux montagnes font : 7687 mètres.
La moyenne entre ces deux montagne est de : 3843 mètres.

Process finished with exit code 0
```
la moyenne n'est pas un nombre décimal. 
On va devoir passer par une variable transitoire de type double pour modifier ce résultat, et modifier le type de la variable récupérant le résultat : 
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la première montagne (chaîne de caractères) : ");
        String firstMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la première montagne (nombre entier) : ");
        int firstMountainHeight = scanner.nextInt();

        System.out.print("Saisir le nom de la deuxième montagne (chaîne de caractères) : ");
        String secondMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la deuxième montagne (nombre entier) : ");
        int secondMountainHeight = scanner.nextInt();

        int sum = firstMountainHeight + secondMountainHeight;
        System.out.println("À elle deux, les deux montagnes font : " + sum + " mètres.");

        double averageDoubled = sum;
        double average = averageDoubled / 2;

        System.out.println("La moyenne entre ces deux montagne est de : " + average + " mètres.");

        scanner.close();
    }
}
```
resultat dans le terminal
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=33025 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la première montagne (chaîne de caractères) : Mont-blanc
Saisir la hauteur de la première montagne (nombre entier) : 4807
Saisir le nom de la deuxième montagne (chaîne de caractères) : Mont-Ventoux
Saisir la hauteur de la deuxième montagne (nombre entier) : 1910
À elle deux, les deux montagnes font : 6717 mètres.
La moyenne entre ces deux montagne est de : 3358.5 mètres.

Process finished with exit code 0
```

En réalité, il n'est pas nécessaire de passer par une variable intermédaire, on aurait pu faire une opération de transtypage pour 'caster' la somme en double.
Pour cela, il faut placer le type double entre parenthèses devant la variable : 
```Java
double average = (double)sum / 2;
```
Le fait de caster permet de créer dynamiquement une nouvelle variable au bon format à la volée sans être stockée dans une variable nommée.

### exercice d'opérateurs arithmétiques modulo

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la première montagne (chaîne de caractères) : ");
        String mountainName = scanner.next();
        System.out.print("Saisir la hauteur de la première montagne (nombre entier) : ");
        int mountainHeight = scanner.nextInt();

        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");
        System.out.println("Cette hauteur est-elle une valeur paire ?");
        int modulo = mountainHeight % 2;
        boolean isEven = modulo == 0;
        System.out.println(isEven);

        scanner.close();
    }
}
```
Resultat du terminal 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=42227 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la première montagne (chaîne de caractères) : Mont-blanc
Saisir la hauteur de la première montagne (nombre entier) : 4809
Le Mont-blanc culmine à 4809 mètres.
Cette hauteur est-elle une valeur paire ?
false

Process finished with exit code 0
```

## Les opérateurs d'affectation

L'opérateur `=` permet de donner une valeur à une variable.
Pour cela, il faut déclarer une variable qu'on initialise grâce à cet opérateur d'affection lors de l'initialisation.
On doit procéder dans un ordre précis : déclaration puis initialisation. 
```Java
int myFirstNumber;
myFirstNumber = 10;
```

Il est bien entendu possible de déclarer et d'initialiser en une seule ligne : 
```Java
int myFirstNumber = 10;
```

En Java, l'opération d'affectation est obligatoire afin de pouvoir utiliser la variable. 

Il n'y a pas de limite à l'affectation d'une variable. Il suffira à chaque fois d'utiliser l'opérateur d'affectation afin de modifier sa valeur.
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Les opérateurs");
        int myVariable = 10;
        System.out.println(myVariable);

        myVariable = 8;
        System.out.println(myVariable);
    }
}
```
terminal 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=33087 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Les opérateurs
10
8

Process finished with exit code 0
```

Une nouvelle affectation peut également contenir une opération arithmétique :
```Java
int myVariable = 10;
myVariable = myVariable + 12;
System.out.println(myVariable); // retourne 22
```

Il existe un opétateur raccourci pour réaliser cette opération : `+=`. `myVariable = myVariable + 12;` peut donc également être noté `myVariable += 12;`.

En suivant cette même logique, on retrouvera les autres opérateurs d'affectation : `-=`, `*=`, `/=`.
On utilisera très rarement ces 3 derniers opérateurs car leur utilisation fait perdre une certaine lisibilité. 

L'objectif restera de garder un code le plus lisible possible, même s'il n'est pas le plus raccourci possible.

## Les opérateurs `unaires`

Les opérateurs unaires sont des opérateurs raccourcis qui permettent d'écrire des chose plus simplement. 
Par exemple, augmenter la valeur d'une variable de 1 s'appelle faire une incrémentation. 
Dans ce cas, on pourrait écrire cela : 
```Java
int myNumber = 0;
myNumber = myNumber + 1;
```
Mais on peut remplacer cela par l'opérateur `++` : 
```Java
myNumber++;
```
Lors de l'exécution de cette ligne, la valeur de notre variable `myNumber` sera incrémenté d'une unité. 

Il s'agit ici d'une `post-incrémentation`, car comme tout opérateur, un résultat est retourné. 
Si on stocke dans une variable l'opération de post-incrémentation, la nouvelle variable ne contiendra pas le résultat escomté : 
```Java
int myVariable = 0;
System.out.println(myVariable); // 0
int result = myVariable++;
System.out.println(myVariable); // 1
System.out.println(result); // 0
```
Cela se produit car l'opération a été faire après l'affectation de la variable result.

Contrairement à l'opérateur de post-incrémentation, l'opérateur de `pré-incrémentation` commence par incrémenter la variable d'une unité et retourne ensuite le résultat. 
```Java
int myVariable = 0;
System.out.println(myVariable); // 0
int result = ++myVariable;
System.out.println(myVariable); // 1
System.out.println(result); // 1
```

L'opétateur négatif `-` permet de retourner le nombre de signe opposé de notre variable :
```Java
int myVariable = 10;
System.out.println(myVariable); // 10
int result = -myVariable;
System.out.println(myVariable); // 10
System.out.println(result); // -10
```

Sur le même principe que l'incrémentation, on retrouve l'opérateur de décrémentation `--`. Celui ci permet d'enlever une unité à notre variable.
```Java
int myVariable = 10;
System.out.println(myVariable); // 10
int result = myVariable--;
System.out.println(myVariable); // 9
System.out.println(result); // 10
```
On retrouvera le même principe avec la post-décrémentation : 
```Java
int myVariable = 10;
System.out.println(myVariable); // 10
int result = --myVariable;
System.out.println(myVariable); // 9
System.out.println(result); // 9
```

## Les opérateurs de comparaisons

Les opérateurs de comparaison sont des opérateurs relationnels qui permettent de comparer deux valeurs entre elles et qui retournera une résultat de type `boolean`.

La règle est la suivante : un int comparé à un int donne comme résultat un booléen.
```Java
int firstNumber = 10;
int secondNumber = 11;

boolean result = firstNumber > secondNumber;
System.out.print(result); // false
```
On a testé la comparaison stricte, il est également possible de comparer suppérieur ou égal `>=`. 
```Java
int firstNumber = 10;
int secondNumber = 10;

boolean result = firstNumber >= secondNumber;
System.out.print(result); // true
```

On peut tester avec la même logique avec les opérateurs inférieur strict `<` ou inférieur ou égale `<=`.

L'opérateur de comparaison permettant de savoir si deux variable sont égales est le double égal : `==`.
> attention à ne pas confondre avec l'opérateur d'affectation qui est un simple égale `=`.

On retrouve également l'opération non égale qui retourne vrai seulement si les deux valeurs sont différentes : `!=`.
> Le `!` signifie ici la négation

### exercice sur la comparaison

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String mountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int mountainHeight = scanner.nextInt();

        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");
        System.out.println("Cette hauteur est-elle supérieure à 3000 mètres ?");
        boolean isGreater = mountainHeight > 3000;
        System.out.println(isGreater);

        scanner.close();
    }
}
```
terminal : 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=43495 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la montagne (chaîne de caractères) : Mont-Blanc
Saisir la hauteur de la montagne (nombre entier) : 4809
Le Mont-Blanc culmine à 4809 mètres.
Cette hauteur est-elle supérieure à 3000 mètres ?
true

Process finished with exit code 0
```

## Les opérateurs logiques

Ces opérateurs s'appliquent à des variables de type `boolean` et retournent un résultat qui est lui aussi un `boolean`.

le `!` symbolise la négation. Placé devant une variable booléenne, il retourne l'opposé de sa valeur 
```Java
boolean myBool = true;
boolean opposite = !myBool;
System.out.print(opposite); // false
```

L'opérateur ET logique `&&` teste deux variables de cette manière :
- `true && true` retourne true
- `true && false` retourne false
- `false && true` retourne false
- `false && false` retourne false 

Le && est dit comme étant un opérateur passif : il teste d'abord l'opérateur de gauche, puis ensuite l'opérateur de droite. Si la partie de gauche est false, dans ce cas la valeur retournée est false. Si en revanche la partie de gauche est true, l'opérateur va ensuite tester la partie de droite. 

On retrouve également le OU logique `||` indique que si le premier boolean est vrai, ou le second, alors l'opération est vraie. 
- `true || true` retourne true
- `true || false` retourne true
-  `false || true` retourne true
- `false || false` retourne false

### exercice sur les opérateurs logiques

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String mountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int mountainHeight = scanner.nextInt();

        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");
        System.out.println("Cette hauteur est-elle située entre 3000 et 4000 mètres ?");
        boolean isGreaterThan3000 = mountainHeight > 3000;
        boolean isLowerThan4000 = mountainHeight < 4000;
        System.out.println(isGreaterThan3000 && isLowerThan4000);

        scanner.close();
    }
}
```

terminal 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=46113 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la montagne (chaîne de caractères) : Mont-Ventoux
Saisir la hauteur de la montagne (nombre entier) : 1910
Le Mont-Ventoux culmine à 1910 mètres.
Cette hauteur est-elle située entre 3000 et 4000 mètres ?
false

Process finished with exit code 0
```