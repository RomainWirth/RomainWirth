# Les Variables

Lors de l'écriture d'un programme, on a la possibilité de stocker des informations dans la mémoire de l'ordinateur, et plus particulièrement lors de l'exécution de ce programme. 
Pour cela, on va déclarer des variables qui vont occuper un espace mémoire et qui vont avvueillir des valeurs lorsque ce code sera exécuté.

## Déclaration, Initialisation, Utilisation

### Déclaration

Une variable s'écrit en un seul mot, elle est donc nommée et a son propre nom. 
Lorsqu'on écrit ce nom, nous sommes dans l'étape de déclaration. 
Java est un langage typé. C'est à dire que lorsqu'on déclare une variable, on doit obligatoirement dire de quel type elle est. 
Il existe plusieurs types : `int` pour un nombre entier, `string` pour une chaîne de caractères par exemple. 
La précision du typage est obligatoire en Java, c'est à dire que n'importe quelle variable qu'on crée ou qu'on manipule sera forcément d'un type en particulier, et ce type ne pourra pas changer. 

Une variable de type int se déclare ainsi : 
```Java
int montBlancHeight;
```
Cette déclaration de variable définit la hauteur du mont blanc, qui sera un nombre entier. 
On aura la garantie que cette variable sera toujours manipulée comme un `int` dans la suite de l'exécution du programme. 

### Initialisation

Pour initialiser une variable, on va utiliser l'opérateur d'affectation : `=`. On écrira que notre variable est égale à une valeur et cette valeur devra être forcément du même type que celui déclaré : 
```Java
montBlancHeight = 4809;
```
Maintenant, lorsque le programme va exécuter les lignes qui suivent cette étape, il y aura en mémoire une variable qui aura cette valeur. 

### Utilisation

On va pouvoir jouer avec notre variable en lisant sa valeur afin de faire un affichage, un calcul, une comparaison, ce que l'on souhaite. 
Pour afficher la valeur de notre variable dans le terminal lors de l'exécution du programme, on va utiliser la fonction println : 
```Java
System.out.println(montBlancHeight);
```

Pour aller plus loin dans l'affichage, on peut ajouter une autre ligne avec la méthode println : 
```Java
System.out.println("Hauteur du Mont Blanc : ");
System.out.println(montBlancHeight);
```
Et pour afficher en une seule ligne, on fera appel à la concaténation avec l'opérateur `+` : 
```Java
System.out.println("Hauteur du Mont Blanc : " + montBlancHeight + " mètres");
```

Déclaration, initialisation et utilisation seront toujours les 3 étapes à utiliser dans un programme. 
On peut déclarer n'importe quel nombre de variables et du type que l'on souhaite. 
Il est important d'initaliser une variable une fois qu'elle est déclarer, puis de l'utiliser, cela afin d'éviter d'utiliser de l'espace mémoire pour rien. 

Il est possible et préférable lorsque c'est possible de déclarer et initialiser en même temps : 
```Java
int montBlancHeight = 4807;
```
Cela permet une réduction syntaxique du code qui va fonctionner exactement de la même manière.

## Les types primitifs

Les variables de type primitif représentent des types de données de base fournies par le langage pour manipuler des valeurs simples. Ces types sont directement pris en charge par la machine virtuelle Java et ne sont pas des objets. 

Il existe 8 types primitifs en Java. 

Les types primitifs sont des mots clés du Java qui sont directement compris par le compilateur, ils sont écrits en un mot et commencent par une minuscule. 
Ils sont directement compris par le compilateur, exactement comme le mot clé `public`, `static`, `void` par exemple. 

En comparaison, `System`, qui commence par une majuscule, n'est pas un mot clé du Java.

### Les nombres entiers

Il existe 4 types primitifs qui permettent de déclarer des nombres entiers, et qui seront différenciés par l'espace mémoire qu'on leur alloue : 
| type | description |
| --- | --- |
| `byte` | le byte prend en mémoire 8 bits (ou 1 octet) |
| `short` | codé sur 16 bits (2 octets) |
| `int` | Nombres entier qui prend en mémoire 32 bits (4 octets) |
| `long` | Nombres entiers qui prennent en mémoire 64 bits (8 octets) |

Concernant le `byte`, étant donné qu'un byte est codé sur 8 bits, on peut avoir en réalité `deux puissance huit` possibilités, soit 256 possibilités. 
Étant donné qu'on peut renseigner autant des valeurs positives que négatives, on aura pas de possibilités comprises entre 0 et 255, mais en réalité entre `-128` et `127`.

Cela signifie qu'on peut stocker dans notre variable de type byte une valeur entre -128 et 127.  
Si on cherche à stocker une valeur qui n'est pas comprise entre ces valeurs, par exemple 128, le code ne compilerait pas.  
```Java
byte myByte = 42;
```

Le `short` pourra accueillir des valeurs plus grandes, signées négativement et positivement. 
```Java
short myShort = 132;
```

Le `int` et le `long` pourront accueillir des valeurs plus grandes. 
Le `long` pourra accueillir les plus grandes valeurs parmis les types d'entiers. 
```Java
int myInt = 547;
long myLong = 987654321L;
```

Il est à noter que tous les entiers écrits dans le code, quel que soit le type déclaré, sont en réalité interprétés comme un `int` par le compilateur. 
C'est pour cela que pour un type `long`, il faudra ajouter un `L` à la fin de la valeur déclarer pour indiquer au compilateur qu'il s'agit d'une valeur de type `long` et qu'il faudra stocker cette valeur dans une variable de type long en mémoire. (un `l` minuscule est aussi admis, mais il se confond facilement avec un `1`, raison pour laquelle on privilégie le l majuscule).

### Les nombres décimaux

Concernant les nombres décimaux, il existe deux types primitifs : 
| type | description |
| --- | --- |
| `float` | codé sur 32 bits |
| `double` | codé sur 64 bits (32 pour la partie entière, et 32 pour la partie décimale) |

Pour initialiser le type `float`, on écrira un nombre coupé en deux séparé par un point (la virgule n'est pas comprise par le compilateur).
Lors de l'initialisation d'un float, il est nécessaire d'ajouter un suffixe `F` de la même manière que pour le long, afin que le compilateur alloue un espace mémoire de 63 bits, et pour pouvoir accueillir un `double` lorsqu'il n'y a pas de suffixe derrière un nombre décimal. 
Ce suffixe est obligatoire pour permettre au code de compiler, car le nombre décimal vu comme un double ne peut pas être stocké dans une variable de type `float`.  
```Java
float myFloat = 423.536F;
```
Concernant le `double`, étant donné qu'il occupe une place plus importante qu'un float, il offre une plus grand précision.
```Java
double myDouble = 32.48115;
``` 

### Le booléen

Le booléen `boolean` est codé sur un seul bit. Le booléen a pour valeur soit vrai (1), soit faux (0).

Pour initialiser un boolean, on utilisera le mot clé `true` ou le mot clé `false`. 
```Java
boolean myBool = true;
```
En mémoire, le boolean est stocké sur 1 bit, donc soit un 0 soit un 1, qui est traduit par `0 = false` et `1 = true`.

### Le caractère

Le dernier type primitif est le catactère `char`, qui représente un seul caractère unicode. Il occupe 16 bits en mémoire et accueille une valeur numérique qui représente un entier dans la table de correspondance des caractères unicode. 
Pour initialiser une variable de type `char`, on va écrire un simple caractère entre "sinle quote" `'`.
```Java
char myChar = 't';
```

Les types primitifs sont constamment utilisés dans l'écriture du code en Java. On les manipulera via des opérateurs, tels que des additions, des soustractions ou alors encore des comparaisons. 

## Le type `String`

Le type `String` représente les chaînes de caractères. 
String n'est pas un mot clé du Java, et on remarque qu'il commence par une majuscule. 
Le type string est en réalité un type de classe, fournie par la librairie standard. 
Cela signifie qu'on peut utiliser ce type String que Java connaît puisqu'il est fourni dans la JRE qui est rattachée au projet.

Pour déclarer une variable de type chaîne de caractères, on va spécifier le type, suivi du nom de la variable, fermé par un point virgule : 
```Java
String myString;
```
Pour initialiser, on va affecter une valeur entre double quote `""` :
```Java
myString = "Chaîne de caractères";
```
Pour l'utilisation, on pourra utiliser la méthode println par exemple pour afficher dans le terminal la valeur de notre variable : 
```Java
System.out.println(myString);
```

String n'est pas un type primitif, c'est un type de classe. la variable `myString` est en fait un objet de type String. 
On parle de variable quand on manipule des types primitifs et on parle d'objet quand on manipule des variables de classe. 

Un objet apporte tout un tas de fonctionnalités, grâce à l'opérateur point `.`. 
Pour un objet de type String, il existe une liste de méthodes accessibles en ajoutant le point à la fin de la variable déclarée : `myString.` ouvrira un panel avec la liste des méthodes permettant de manipuler les chaînes de caractères. 
Par exemple, la méthode `.length` va retourner la longueur de la chaîne de caractères. La méthode length retourne un int, un nombre entier décrivant le nombre de caractères présents lors de l'initialisation de l'objet de type String.

Pour manipuler les chaînes de caractères, on pourra utiliser l'opérateur de concaténation `+` pour mettre bout à bout deux chaînes de caractères par exemple. Cela va donc créer une nouvelle chaîne de caractères qui va allier les deux qui sont concaténées. 

Il existe tout un tas de fonctionnalités liées au type string qui est un type largement utilisé.

### exercice de permutation de données 

<!-- ajouter des instructions -->
```Java
public class Main {
    public static void main(String[] args) {
        String mountainName = "Mont-Blanc";
        String secondMountainName = "Pic du midi";
        int mountainHeight = 2877;
        int secondMountainHeight = 4809;

        System.out.println("Avant permutation : ");
        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");
        System.out.println("Le " + secondMountainName + " culmine à " + secondMountainHeight + " mètres.");

        int savedMountainHeight = mountainHeight;
        mountainHeight = secondMountainHeight;
        secondMountainHeight = savedMountainHeight;

        System.out.println("Après permutation : ");
        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");
        System.out.println("Le " + secondMountainName + " culmine à " + secondMountainHeight + " mètres.");
    }
}
```

## Les erreurs classiques

Régulièrement, la syntaxe de Java peut poser des problèmes. Il arrive souvent que du code que l'on écrit dans l'IDE soit souligné en rouge. 
Une erreur syntaxique empêche le compilateur de pouvoir compiler. On se retrouve alors obligé de devoir corriger notre erreur avant de pouvoir avancer dans l'écriture du code. 

Voici une liste de quelques petites erreurs qu'on peut éviter :
- oubli du point virgule `;` en fin de déclaration provoque forcément une erreur. Cette ponctuation marque la fin d'une instruction. Si elle est absente, le compilateur va comprendre que la ligne suivante fait également partie de la l'instruction de la ligne courante. En général, l'IDE aide et indique qu'il manque un point virgule. 
- initialiser une variable par une valeur qui n'est pas du bon type.  
- oublier un `+` lors d'une concaténation. 
- ne pas mettre les double quotes `""` au bon endroit. On peut vite faire cette erreur et renvoyer le nom d'une variable au lieu de sa valeur. Il faudra également faire attention à la gestion des espaces. 
- utiliser une variable avant son initialisation. 
- ne pas s'appuyer sur son IDE. Il est un allié pour l'écriture du code et nous permet d'éviter un grand nombre d'erreurs. Par exemple, les suggestions de noms de variable peut nous permettre d'éviter des typo via des erreurs de frappe. 

### exercice sur l'utilisation du scanner

Le scanner permet de récupérer des informations qui seront transmises via le terminal.
Cela permet d'éviter d'initialiser des variables dans le code, mais de les initialiser grâce aux informations saisies dans le terminal.

scanner va scanner caractère par caractère la donnée saisie dans le terminal une fois que l'utilisateur aux appuyé sur `Entrée`, afin de récupérer la valeur pour l'assigner à une variable. 

Scanner est placé depuis la JRE dans le package `java.util`.

Pour déclarer un scanner, on va procéder ainsi : 
```Java
Scanner scanner = new Scanner(System.in);
```
Pour récupérer la saisie au format String, on va utiliser la méthode `next()` : 
```Java
String stringWritten = scanner.next();
```
Afin de récupérer la saisie au format int, on utilisera la méthode `nextInt()` :
```Java
int intWritten = scanner.nextInt();
```

exemple :
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Saisir le nom de la montagne : ");

        String mountainName = scanner.next();
        System.out.println("Saisir la hauteur de la montagne : ");
        int mountainHeight = scanner.nextInt();

        System.out.println("Le " + mountainName + " culmine à " + mountainHeight + " mètres.");

        scanner.close();
    }
}
```
valeur dans le terminal : 
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=34683 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Saisir le nom de la montagne : 
Mont-Blanc
Saisir la hauteur de la montagne : 
4807
Le Mont-Blanc culmine à 4807 mètres.

Process finished with exit code 0
```

Pour éviter de devoir saisir les données dans un retour à la ligne, on pourra utiliser la méthode `print` au lieu de `println`. 