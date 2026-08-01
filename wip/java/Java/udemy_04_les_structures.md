# Les Structures

## La structure conditionnelle `if`

La structure conditionnelle `si` se traduit par le mot clé `if` suivi de la condition entre parenthèses `()` puis par le bloc de code à exécuter entre accolades `{}`.

La condition testée retourne un booléen true ou false. 
Si ce booléen retourne true, l'instruction entres les accolades sera exécutée, sinon, elle sera ignorée.
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 10;
        
        if (myNumber > 5) {
            System.out.println("Mon entier est plus grand que 5");
        }
        if (myNumber < 5) {
            System.out.println("Mon entier est plus petit que 5");
        }
        if (myNumber = 5)  {
            System.out.println("Mon entier est égale à 5");
        }
    }
}
```
Dans cet exemple, le code va s'exécuter de manière séquentielle, en commençant par la déclaration et l'initialisation de notre variable, puis en testant la première condition. 
10 est bien supérieur à 5, le test de la condition retourne true, l'instruction écrivant `Mon entier est plus grand que 5` sera bien exécutée.
En revanche, la deuxième et la troisième condition retournent false, le bloc de code entre accolades ne sera pas exécuté pour celles-ci. 

Dans le cas ou il n'y a qu'une seule instruction, les accolades sont optionnelles. 
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 10;
        
        if (myNumber > 0 && myNumber <= 10)
            System.out.println("Mon entier est compris entre 0 et 10");

        System.out.println("Fin du programme");
    }
}

// retourne 
// Mon entier est compris entre 0 et 10
// Fin du programme
```
Si la condition contient plusieurs lignes d'instructions, il est nécessaire d'utiliser les accolades :
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 10;
        
        if (myNumber > 0 && myNumber <= 10) {
            System.out.println("Mon entier est compris entre 0 et 10");
            System.out.println("fin du if");
        }

        System.out.println("Fin du programme");
    }
}

// retourne 
// Mon entier est compris entre 0 et 10
// Fin du if
// Fin du programme
```

Il est également possible d'imbriquer les conditions : un `if` dans un `if`. 
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 10;
        
        if (myNumber > 0 && myNumber <= 10) {
            System.out.println("Mon entier est compris entre 0 et 10");

            if (myNumber < 5) {
                System.out.println("Mon entier est  inférieur à 5");
                System.out.println("fin du deuxième if");
            }

            System.out.println("fin du premier if");
        }

        System.out.println("Fin du programme");
    }
}

// retourne 
// Mon entier est compris entre 0 et 10
// Fin du if
// Fin du programme
```

### exercice sur la structure if

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String firstMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int firstMountainHeight = scanner.nextInt();

        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String secondMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int secondMountainHeight = scanner.nextInt();

        if (firstMountainHeight > secondMountainHeight) {
            System.out.println("La première montagne " + firstMountainName + " est plus haute que la deuxième " + secondMountainName);
        }
        if (secondMountainHeight < firstMountainHeight) {
            System.out.println("La deuxième montagne " + secondMountainName + " est plus haute que la première " + firstMountainName);
        }
        if (firstMountainHeight == secondMountainHeight) {
            System.out.println("les deux montagnes " + firstMountainName + " et " + secondMountainName + " sont de même hauteur");
        }

        scanner.close();
    }
}
```

Ce programme fonctionne correctement mais on constate que l'on a 3 conditions `if` qui se suivent et seulement une va retourner quelque chose. 

Il est possible d'améliorer cela grâce à la structure `else`

## La structure conditionnelle `if ... else ...`

La structure conditionnelle `if ... else` se traduit en français `si ... sinon ...`. 

Comme pour la structure `if` simple, la structure `if else` commence par un `if`, suivi de la condition à tester entre parenthèse, un bloc de code entre accolades qui s'exécutera si la condition est `true`, puise le mot clé `else` suivi d'un autre bloc de code entre accolades qui s'exécutera dans le cas ou la condition est `false`. 

```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 10;
        
        if (myNumber > 5) {
            System.out.println("Mon entier est plus grand que 5");
        } else {
            System.out.println("Mon entier est plus petit que 5");
        }
    }
}

// retourne la première instruction
```

On peut bien entendu ajouter une nouvelle condition `if` dans notre bloc else, et même ajouter une structure `if ... else ...` : 
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = -10;
        
        if (myNumber > 0) {
            System.out.println("Mon entier est positif");
        } else {
            if (myNumber < 0) {
                System.out.println("Mon entier est négatif");
            } else {
                System.out.println("Mon entier est nul");
            }
        }
    }
}

// retourne la deuxième instruction
```

Une structure composée de 3 `if` successifs est moins performante, puisque lors de l'exécution du programme, chaque if sera testé. 
La structure `if` accompagnée du `else` écrit de cette manière avec des `if` imbriqués nous permet d'éviter une telle structure lourde à exécuter.

### exercice

<!-- ajouter des instructions -->
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String firstMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int firstMountainHeight = scanner.nextInt();

        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String secondMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int secondMountainHeight = scanner.nextInt();

        System.out.print("Saisir le nom de la montagne (chaîne de caractères) : ");
        String thirdMountainName = scanner.next();
        System.out.print("Saisir la hauteur de la montagne (nombre entier) : ");
        int thirdMountainHeight = scanner.nextInt();

        if (firstMountainHeight > secondMountainHeight && firstMountainHeight > thirdMountainHeight) {
            System.out.println("La montagne " + firstMountainName + " est la plus haute");
        } else {
            if (secondMountainHeight > thirdMountainHeight) {
                System.out.println("La montagne " + secondMountainName + " est la plus haute");
            } else {
                System.out.println("La montagne " + thirdMountainName + " est la plus haute");
            }
        }

        scanner.close();
    }
}
```

Cette structure de code est plus optimisée que plusieurs `if` qui se suivent :
- il y a moins de code à écrire, et donc potentiellement moins d'erreurs. 
- le code est plus optimisé en terme d'exécution, réduisant le travail effectué par la machine, permettant un programme plus rapide à s'exécuter.

## La structure conditionnelle `if ... else if ...`

La syntaxe précédente va permettre d'introduire de la structure `if ... else if ... else ...`.
En repartant de l'exercice précédent, on peut améliorer la structure en utilisant le mot clé `else if`, qui se traduit pas sinon si :
```
if (premier test) {
    code à exécuter
} if else (second test) {
    code à exécuter
} else {
    code à exécuter
}
```
Cele va se traduire de cette manière sur les conditions introduites dans l'éxercice précédent : 
```Java
if (firstMountainHeight > secondMountainHeight && firstMountainHeight > thirdMountainHeight) {
    System.out.println("La montagne " + firstMountainName + " est la plus haute");
} else if (secondMountainHeight > thirdMountainHeight) {
    System.out.println("La montagne " + secondMountainName + " est la plus haute");
} else {
    System.out.println("La montagne " + thirdMountainName + " est la plus haute");
}
```

## La structure `switch`

Le switch est une structure alternative au `if ... else if ... else ...` permettant de tester la valeur d'une variable à un cas potentiel.
La structure est la suivante : 
```Java
switch (variable à tester) {
    case valeur de test 1:
        code à exécuter;
        break;
    case valeur de test 2:
        code à exécuter;
        break;
    case valeur de test 3:
        code à exécuter;
        break;
    default : 
        code à exécuter;
}
```
chaque case doit être singulier. En cas contraire, le compilateur refusera de compiler et entrainera un crash de l'appliation.
Le mot clé `break` permet de stopper l'exécution du switch case une fois le code du bon cas effectué. 
Il n'y a pas de règle quand à l'écriture de `break`, c'est au choix selon ce que l'on souhaite exécuter. 

Il est possible de cumuler des `case` quand le résultat est sensé être identique : 
```Java
char myChar = 'c';

switch (myChar) {
    case 'a' :
    case 'e' :
    case 'i' :
    case 'o' :
    case 'u' :
    case 'y' :
        System.out.println("Voyelle");
        break;
    default :
        System.out.println("Consonne");
        break;
}
```

> Un switch ne peut tester que l'égalité entre une variable et un `case` potentiel. Il ne sera pas possible de tester d'autres types d'opérateurs (>, >=, <, <=, !=, etc.)

Sur une structure testant une variable dans une égalité, on va privilégier le `switch case` plutôt qu'une structure `if ... else if ... else` 

### exercice

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

        int valueToTest = mountainHeight / 1000;

        switch (valueToTest) {
            case 0:
                System.out.println("la montagne : " + mountainName + " culime entre 0 et 999 mètres.");
                break;
            case 1:
                System.out.println("la montagne : " + mountainName + " culime entre 1000 et 1999 mètres.");
                break;
            case 2:
                System.out.println("la montagne : " + mountainName + " culime entre 2000 et 2999 mètres.");
                break;
            case 3:
                System.out.println("la montagne : " + mountainName + " culime entre 3000 et 3999 mètres.");
                break;
            case 4:
                System.out.println("la montagne : " + mountainName + " culime entre 4000 et 4999 mètres.");
                break;
            default :
                System.out.println("la montagne : " + mountainName + " culime à plus de 5000 mètres.");
                break;
        }

        scanner.close();
    }
}
```

## La structure répétitive `for`

La structure `for` est une structure de répétition, ou autrement appelé `boucle`. 
La boucle `for` permet de parcourir un certain nombre d'éléments et de faire une opération en rapport avec ces éléments, que ce soit une somme, trouver un élément parmis ce grand nombre, etc. 
Cela permet d'éviter un travail long et répétif.

La boucle `for` est une structure constituée de 3 parties : `for (initialisation; condition; incrémentation)`
- la phase d'initialisation, qui sera exécutée une seule fois dès le début.
- la condition est une expression booléenne souvent obtenue par un test permettant de répéter le bloc d'instruction tant que cette condition est vraie.
- la phase d'incrémentation est appelée après chaque exécutio du bloc d'instruction qui suit.

La structure va se déclarer ainsi : 
```
for (initialisation; condition; incrémentation) {
    bloc d'instructions;
}
```

De manière classique, lors de la phase d'initialisation, on va créer une variable qui va être ce que l'on appelle l'`indice de boucle`. On le nomme en général `i`.
La phase de condition sera une comparaison qui détermine combien de fois on va répéter le contenu de la boucle. 
La phase d'incrémentation consiste généralement à incrémenter la variable d'initialisation, permettant à chaque tout de boucle de la faire augmenter jusqu'à atteindre la valeur de test de la condition : 
```Java
int sum = 0;

for (i = 0; i <= 9; i++) {
    System.out.println("Mon chiffre " + i);
    int myNumber = i;
    sum = sum + myNumber;
}

System.out.println("La somme est : " + sum);
```

il est possible d'améliorer l'écriture de la somme arithmétique : `sum += myNumber;`.

### exercice :

Tirer 10 nombres aléatoirement entre 0 et 99 et afficher la plus grande et la plus petite valeur dans la console. 
<!-- compléter les instructions -->
Utiliser la méthode `Math.random()`
```Java
public class Main {
    public static void main(String[] args) {
        int greatestValue = 0;
        int lowestValue = 99;

        for (int i = 0; i < 10; i++) {
            double decimalValue = Math.random();
            decimalValue = decimalValue * 100;
            int randomNumber = (int) decimalValue;
            // int randomNumber = (int) (Math.random() * 100);
            System.out.println("Mon nombre " + (i+1) + " est " + randomNumber);

            if (randomNumber > greatestValue) {
                greatestValue = randomNumber;
            }

            if (randomNumber < lowestValue) {
                lowestValue = randomNumber;
            }
        }

        System.out.println("La plus grand valeur est " + greatestValue);
        System.out.println("La plus petite valeur est " + lowestValue);
    }
}
```

## Les structures répétitives `while` et `do/while`

### `while`

`while` peut se traduire par `tant que`. Cela signifie que `tant que` la condition est vraie, alors exécute le code. 

Cette structure se déclare ainsi : 
```
while (condition) {
    code à exécuter;
}
```

La boucle `while` pose la problématique des boucles infinies : une condition qui n'est jamais atteinte provoque une répétition de bloc de code indéfiniement, créant ainsi une perte mémoire et potentiellement un crash du programme. 
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 4;

        while (myNumber < 10) {
            System.out.println("mon nombre "+ myNumber + " < 10");
        }
    }
}
```
Pour sortir d'une boucle infinie, il est nécessaire de faire en sorte que le test réalisé retourne false à un moment donné.
Dans notre exemple. on pourra incrémenter notre nombre entier de 1 unité à chaque tour de boucle : 
```Java
public class Main {
    public static void main(String[] args) {
        int myNumber = 4;

        while (myNumber < 10) {
            System.out.println("mon nombre "+ myNumber + " < 10");
            myNumber++;
        }
    }
}
```
La boucle `while` s'écrit lorsqu'on ne connaît pas à l'avance le nombre de répétitions qu'on va faire.
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir un nombre entier : ");
        int myNumber = scanner.nextInt();

        while (myNumber < 0 || myNumber > 10) {
            if (myNumber < 0) {
                System.out.println("Le nombre saisi est négatif, recommencer");
                System.out.print("Saisir un nombre entier : ");
                myNumber = scanner.nextInt();
            } else {
                System.out.println("Le nombre saisi est trop grand, recommencer");
                System.out.print("Saisir un nombre entier : ");
                myNumber = scanner.nextInt();
            }
        }
        System.out.println("mon nombre " + myNumber + " est compris entre 0 et 10");

        scanner.close();
    }
}
```
Il existe une autre structure que va permettre de faire le test apès avoir exécuté le bloc d'instruction : la structure do while.

### exercice

Écrire un programme ou l'ordinateur tire aléatoirement un nombre entier entre 0 et 100, et l'utilisateur doit chercher à deviner ce nombre.
Si la différence entre le nombre porposé et le nombre à trouver est : 
- Supérieur à 20 : l'ordinateur affichera "froid"
- Entre 6 et 20 : l'ordinateur affichera "tiède"
- Entre 1 et 5 : l'ordinateur affichera "chaud"
- Nul : l'ordinateur affichera gagné et le nombre de tentatives

Correction : 
1) commencer par déclarer et initialiser la variable `randomNumber`.
2) déclarer ensuite une variable `guess` pour récupérer le nombre entré par l'utilisateur.
3) comparer la distance entre le nombre aléatoire et le nombre entré par l'utilisateur, pour cela, il faut déclarer une variable `distance`, et si le nombre `guess` est supérieur au `randomNumber`, on soustrait `randomNumber` à `guess`, sinon, on soustrait `guess` à `randomNumber`. (permet d'avoir toujours un écart positif)
4) déclarer les conditions d'affichage : si `distance > 20`, `distance > 5 et <= 20`, et si `distance > 0 et <= 5`, et ajouter les fonctions pour afficher les résultats. 
5) Afficher le phrase de victoire 
6) Pour plus de performance, utiliser la structure `if ... else if ... else ... `. N.B. : les conditions pourront être simplifiées : si `distance > 20`, sinon si `distance > 5`, sinon si `distance > 0` sinon.
7) Ajouter la boucle while. La condition doit être un booléen, on va donc déclarer et initialiser une variable booléenne `found` à false pour pouvoir l'ajouter au test de la boucle while. `found` restera false tant que le nombre n'aura pas été trouvé.
8) Ajouter la condition de sortie dans le else : `found = true`.
9) Déclarer et initialiser une variable `count` à 0, et que l'on incrémentera à chaque tour de boucle, et que l'on affichera lors de la victoire. 

```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int randomNumber = (int) (Math.random() * 100);

        boolean found = false;
        int count = 0;

        while (!found) {
            System.out.print("Saisir un nombre entier : ");
            int guess = scanner.nextInt();
            count++;

            int distance;
            if (guess > randomNumber) {
                distance = guess - randomNumber;
            } else {
                distance = randomNumber - guess;
            }

            if (distance > 20) {
                System.out.println("Froid, retentez votre chance");
            } else if (distance > 5) {
                System.out.println("Tiède, retentez votre chance");
            } else if (distance > 0) {
                System.out.println("Chaud, retentez votre chance");
            } else {
                System.out.println("Gagné, nombre de tentatives : " + count);
                found = true;
            }
        }

        scanner.close();
    }
}
```

### `do/while`

à la différence du while, do while exécute d'abord un bloc d'instruction situé après le mot clé `do`, tant que la condition après `while` est true.
Cette syntaxe permet d'éviter une initialisation arbitraire d'une variable à tester. 
```
do {
    instructions;
} while (condition);
```
Cela permet d'initialiser d'abord une variable avant même de tester si la condition se rapportant à cette variable est vraie ou fausse : 
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir un nombre entier : ");
        int myNumber;

        do {
            myNumber = scanner.nextInt();
            if (myNumber < 0) {
                System.out.println("Le nombre saisi est négatif, recommencer");
                System.out.print("Saisir un nombre entier : ");
                myNumber = scanner.nextInt();
            } else {
                System.out.println("Le nombre saisi est trop grand, recommencer");
                System.out.print("Saisir un nombre entier : ");
                myNumber = scanner.nextInt();
            }
        } while (myNumber < 0 || myNumber > 10);
        
        System.out.println("mon nombre " + myNumber + " est compris entre 0 et 10");

        scanner.close();
    }
}
```
L'avantage de cette structure est qu'elle permet d'exécuter le bloc d'instructions au moins une première fois.
Attention, cela implique de déclarer la variable au dessus du bloc d'instructions pour pouvoir être utilisée dans la condition. 

### exercice 

Devinette avec un do/while 

On va écrire un programme ou on saisi un nombre entre 0 et 99, et c'est à l'ordinateur de trouver le nombre en un minimum de tentatives. 
L'ordinateur sera orienté avec les indications suivantes : 
- `c'est trop grand !` si la tentative est supérieure au nombre choisi.
- `c'est trop petit !` si la tentative est inférieure au nombre choisi.

Correction : 
On va utiliser la même stratégie : écrire le contenu de la boucle avant d'écrire la boucle et sa condition.
1) on va commencer par écrire une variable qui récupère l'entrée de l'utilisateur.
```Java
Scanner scanner = new Scanner(System.in);

System.out.print("Choisir un nombre entre 0 et 99 : ");
int myNumber = scanner.nextInt();
```
2) on déclare et initialise la variable qui va récupérer le nombre deviné par l'ordinateur : la méthode Math.random multipliée par 100 et on affiche cette valeur dans le terminal.
```Java
int guessedNumber = (int) (Math.random() * 100);
```
3) on va ensuite tester si la valeur de l'ordinateur est inférieure à notre nombre, si c'est le cas, on affichera "C'est trop petit !", sinon, si la valeur est supérieure, on affichera "C'est tropm grand !", sinon, on affichera "Gagné".
```Java
if (guessedNumber < myNumber) {
    System.out.println("C'est trop petit !");
} else if (guessedNumber > myNumber) {
    System.out.println("C'est trop grand !");
} else {
    System.out.println("Gagné");
}
```
4) on introduit maintenant la boucle de répétition do/while, on enferme le bloc d'instruction depuis la variable de l'ordinateur jusqu'au résultat else dans le bloc `do`. N.B. : la saisie de l'utilisateur est à laisser à l'extérieur du bloc de répétition, puisqu'il ne doit être réalisé qu'une seule fois au début.
5) on utilise do/while afin d'exécuter le bloc tant que le nombre de l'utilisateur est différent de celui de l'ordinateur. 
6) il faudra sortir la déclaration de la variable de l'ordinateur et laisser l'initialiser dans la boucle, afin de la laisser visible pour le while. (portée des variables).
```Java
Scanner scanner = new Scanner(System.in);

System.out.print("Choisir un nombre entre 0 et 99 : ");
int myNumber = scanner.nextInt();
int guessedNumber;

do {
    guessedNumber = (int) (Math.random() * 100);
    System.out.println("L'ordinateur à tenté : " + guessedNumber);
    if (guessedNumber < myNumber) {
        System.out.println("C'est trop petit !");
    } else if (guessedNumber > myNumber) {
        System.out.println("C'est trop grand !");
    } else {
        System.out.println("Gagné en " + count + " tentatives.");
    }
} while (myNumber != guessedNumber);
```
7) on ajoute la variable de comptage pour connaître le nombre de tentatives qu'on initialise à 0, et on incrémente à chaque exécution du bloc `do`.
```Java
int count = 0;

do {
    ...
    count++;
    ...
} while (...);
```
8) Pour l'instant, l'ordinateur se contente de trouver la valeur de manière aléatoire, sans prendre en compte les indications qu'on lui donne. On va donc modifier le programme pour réduire son nombre de tentatives en bornant les possibilités. On va ajouter deux variable de borne suppérieure et borne inférieure, permettant de délimiter la valeur minimum et maximum qu'il est possible d'atteindre. Dans chacun des blocs des conditions, on attribue le nombre aléatoire à la variable borne sup et borne inf.  
```Java
System.out.print("Choisir un nombre entre 0 et 99 : ");
int myNumber = scanner.nextInt();
int guessedNumber;
int count = 0;

int lowerBound = 0;
int upperBound = 99;

do {
    guessedNumber = (int) (Math.random() * 100);
    System.out.println("L'ordinateur à tenté : " + guessedNumber);
    count++;
    if (guessedNumber < myNumber) {
        System.out.println("C'est trop petit !");
    } else if (guessedNumber > myNumber) {
        System.out.println("C'est trop grand !");
    } else {
        System.out.println("Gagné en " + count + " tentatives.");
    }
} while (myNumber != guessedNumber);
```
9) on va utiliser nos bornes pour modifier la variable aléatoire de l'ordinateur. Il va falloir modifier la règle de calcul pour ne plus modifier par 100 la variable aléatoire : borne max - borne min + 1 + borne min (initialisation = (99 - 0 + 1) + 0 = 100), puis à chaque tour de boucle cet écart va se réduire, réduisant le nombre de possibilités. 
```Java
guessedNumber = (int) (Math.random() * (upperBound - lowerBound + 1) + lowerBound);
```
10) dernière amélioration : l'ordinateur peut tenter plusieurs fois la même valeur. Il faudra donc exclure ces valeurs des possibilités. Pour corriger cela, on va affiner la borne min en l'affectant à la valeur du nombre ordinateur random + 1, qui sera la prochaine plus petite valeur atteignable. Et pour la valeur de la borne max, on l'affectera à la valeur du nombre de l'ordinateur random - 1.
```Java
if (guessedNumber < myNumber) {
    System.out.println("C'est trop petit !");
    lowerBound = guessedNumber + 1;
} else if (guessedNumber > myNumber) {
    System.out.println("C'est trop grand !");
    upperBound = guessedNumber - 1;
} else {
    ...
}
```
11) la méthode pour trouver peut potentiellement aller jusqu'à 100 tentatives. L'idée serait de toujours couper la poire en deux parties égales et de proposer la valeur médiane. On va donc supprimer l'initialisation de la valeur aléatoire avec le random pour la remplacer par le nombre total de possibilités divisé par deux, à laquelle on ajoute la borne inférieure : 
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Choisir un nombre entre 0 et 99 : ");
        int myNumber = scanner.nextInt();
        int guessedNumber;
        int count = 0;

        int lowerBound = 0;
        int upperBound = 99;

        do {
            guessedNumber = (upperBound - lowerBound + 1) / 2 + lowerBound;
            System.out.println("L'ordinateur à tenté : " + guessedNumber);
            count++;
            if (guessedNumber < myNumber) {
                System.out.println("C'est trop petit !");
                lowerBound = guessedNumber + 1;
            } else if (guessedNumber > myNumber) {
                System.out.println("C'est trop grand !");
                upperBound = guessedNumber - 1;
            } else {
                System.out.println("Gagné en " + count + " tentatives.");
            }
        } while (myNumber != guessedNumber);

        scanner.close();
    }
}
```

Cette recherche s'appelle la recherche par dichotomie, qui permet de faire une recherche en un maximum de 7 tentatives (100 n'est divisible que 7 fois maximum).

## Les mots clés `break` et `continue`

`break` et `continue` ne s'écrivent que dans des boucles répétitives.

Break permet de mettre fin à une boucle quand une condition est vérifiée. Attention, après le break, la suite du code n'est pas exécutée.  
```Java
for (int i = 1; i <= 10; i++) {
    if (i % 5 == 0) {
        break;
    }
    System.out.println(i); // affiche 1 2 3 4
}
```

Continue permet de passer à la répétition suivante. C'est à dire que si la condition est remplie, on va skip le reste de l'exécution mais passer à la répétition suivante sans sortir de la boucle. 
```Java
for (int i = 1; i <= 10; i++) {
    if (i % 5 == 0) {
        continue;
    }
    System.out.println(i); // affiche 1 2 3 4 6 7 8 9
}
```

### exercice

Ecriture d'une suite : la suite de fibonacci

Ecrire un programme qui demande à l'utilisateur d'entrer un nombre n puis calcule et affiche les nombres de Fibonacci jusqu'à ce rang n.
Définition de la suite de Fibonacci :
- F0 = 0
- F1 = 1
- Fn = Fn-1 + Fn-2

Correction : 
1) on va commencer par écrire une variable qu'on va appeler fibo0, initialisé à la valeur 0, et une variable fibo1, initialisée à la valeur 1. 
```Java
int fibo0 = 0;
int fibo1 = 1;
```
2) on va ensuite commencer à écrire notre algorithme de manière basique en initialisant une variable fibo2 = fibo1 + fibo0, puis une variable fibo3 = fibo2 + fibo1.
```Java
int fibo2 = fibo1 + fibo0;
int fibo3 = fibo2 + fibo1;
```
3) à partir de cela, on va pouvoir écrire une variable fibon qui sera égale à fibo(n-1) + fibo(n-2).
```Java
int fiboN = fiboNmoins1 + fiboNmoins2;
```
4) puis modifier nos variable fibo2 et fibo3 : 
```Java
int fiboNmoins2 = fibo0;
int fiboNmoins1 = fibo1;
```
5) à partir d'ici, on va commencer à écrire notre boucle : n au lieu de i, initilisé à 2, qui va itérer tant qu'on a pas atteint le nombre `rank` que l'on initialise à 10 dans un premier temps, et on incrémente n. Il faudra donc réclarer une nouvelle variable rank de type int qu'on initialise à 10.
```Java
int rank = 10;

for (n = 2; n <= rank; n++) {

}
``` 
6) à chaque tour de boucle on va recalculer fiboN, puis assigner à fiboNmoins2 la valeur de fiboNmoins1, puis à fiboNmoins1 la valeur de fiboN que l'on vient de calculer.
7) on ajoute les print pour afficher les variables : 
```Java
int rank = 10;

int fibo0 = 0;
int fibo1 = 1;

System.out.print(fibo0 + " ");
System.out.print(fibo1 + " ");

int fiboNmoins2 = fibo0;
int fiboNmoins1 = fibo1;

for (int n = 2; n <= rank; n++) {
    int fiboN = fiboNmoins1 + fiboNmoins2;
    System.out.print(fiboN + " ");

    fiboNmoins2 = fiboNmoins1;
    fiboNmoins1 = fiboN;
}
```
7) Ensuite, on va ajouter la commande pour demander à l'utilisateur de saisir le rang souhaité : 
```Java
Scanner scanner = new Scanner(System.in);
System.out.print("Saisir le rang souhaité : ");
int rank = scanner.nextInt();
```
8) On ajoutera une condition pour exécuter le code uniquement si la valeur du rang est supérieure ou égale à 2 (selon les variable d'initiatlisation), et on va afficher la valeur finale de `fiboN` dans un print. Seulement, fiboN est déclaré et initialisé dans la boucle. Il faudra donc sortir la déclaration de la variable dans la boucle et l'initialiser à -1 (sachant que la valeur sera forcément modifiée). 
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Début du programme");

        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le rang souhaité : ");
        int rank = scanner.nextInt();

        int fibo0 = 0;
        int fibo1 = 1;

        if (rank >= 2) {

            System.out.print(fibo0 + " ");
            System.out.print(fibo1 + " ");

            int fiboNmoins2 = fibo0;
            int fiboNmoins1 = fibo1;
            int fiboN = -1;

            for (int n = 2; n <= rank; n++) {
                fiboN = fiboNmoins1 + fiboNmoins2;
                System.out.print(fiboN + " ");

                fiboNmoins2 = fiboNmoins1;
                fiboNmoins1 = fiboN;
            }

            System.out.println("\nFibo au rang " + rank + " est " + fiboN);
        }

        System.out.println("Fin du programme");
    }
}
```