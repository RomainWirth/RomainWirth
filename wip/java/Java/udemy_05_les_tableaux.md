# Les Tableaux

Les Tableaux sont des types à part entière, permettant de créer un ensemble de variables qui seront regroupés dans ce tableau.
En Java, on peut déclarer des tableaux sur la base d'un type, ce qui signifie que tous les éléments du tableau seront de ce type là, à savoir des entiers. 
L'autre particularité de Java, c'est que les tableaux sont de taille fixe (la taille n'évoluera jamais). 

## Déclarer un tableau

Pour déclarer un tableau, on va écrire le type, suivi de crochets acollés, puis le nom du tableau et enfin le point virgule : `type[] nomDuTableau;`.
Il existe une deuxième manière (moins utilisée), le type, suivi du nom du tableau et des crochets acollés, terminé par un point virgule : `type nomDuTableau[];`.

La première méthode est beaucoup plus lisible car c'est le type qui est ciblé, et non pas la variable. 

## Initialiser un tableau

Pour initialiser, on procédera comme pour une variable, en initialisant par exemple sur la même ligne : `int[] numbersArray = [1, 4, 7, 2, 5, 3, 9];`.
On pourra déclarer des tableaux du type que l'on souhaite : `String`, `int`, `double`, etc. 
Il suffira de spécifier le type suivi des crochets acollés.

Si on souhaite initialiser un tableau avec des valeurs récupérées au fur et à mesure, il faudra initialiser le tableau à une certaine dimension, puis procéder à son remplissage.

## Les tableaux à une dimension

Pour cela, on va déclarer le tableau sur une première ligne, puis dans un second temps, l'initialiser d'une certaine manière grâce au mot clé `new`, suivi du type avec des acollés, et entre les crochets spécifier la taille du tableau grâce à un nombre qui indiquera le nombre de cases dans le tableau. 
```
type[] myArray;

myArray = new type[x];
```
Il est nécessaire de procéder ainsi car on doit obligatoirement connaître la taille du tableau à l'avance. 
C'est une question "machine" qui doit allouer un espace mémoire pour stocker les données du tabeau. En déclarant et initilisant un tableau de cette manière, notre programme donne l'ordre à la machine d'allouer un espace mémoire qui sera de `x` fois la taille du type mentionné. Par exemple, si on déclare un tableau d'entiers (int), et qu'on l'initialise à 10, notre tableau aura comme espace mémoire de 10x32 bits (32 bits étant la taille d'un entier). 
```Java
int[] myArray;

myArray = new int[10];
```

Comme un tableau à une taille fixe, on a la garantie que cette taille de `x` sera toujours la même une fois le tableau initialisé. 

On pourra toujours connaître la taille d'un tableau grâce à la propriété `.length`. Pour connaître cette taille, il faudra la stocker dans une variable de type `int` : `int arrayLength = myArray.length;`.

Pour attribuer des valeurs dans les cases d'un tableau, on va assigner des valeurs à l'index souhaité que l'on place entre crochets (l'index d'un tableau commence toujours par 0), en utilisant l'opérateur d'assignation `=` de cette manière : `myArray[x] = ...;`. 
 
Pour accéder à la dernière case du tableau, on utilisera la propriété `.length` à laquelle on soustrait 1. En effet, un tableau de 10 cases, le dernier index est 9. `.length` nous donneras 10, et pour obternir l'index 9, on devra soustraire 1. 

### La boucle for

La boucle fer est très pratique car elle permet de parcourir toutes les cases d'un tableau de la première à la dernière case. On utilisera pour cela un indice de boucle `i` qui va commencer à 0 (premier index du tableau), et qui va varier jusqu'à être inférieur strictement à la dimension du tableau. 
```Java
int[] myArray;

myArray = new int[10];

int arrayLength = myArray.length;

myArray[0] = 12;
myArray[1] = -42;
myArray[arrayLength - 1] = 21;

for (int i = 0; i < myArray.length; i++) {
    array[i] = ...;
}
```
Ce type de boucle permet de parcourir la totalité d'un tableau et de manipuler à chaque répétition la case du tableau et de manipuler à chaque répétition la case du tableau correspondant à l'indice. 
En effet, la boucle continue tant que i n'a pas atteint la taille du tableau. il va donc itérer autant de fois que la taille du tableau.

### Accéder au dernier élément d'un tableau

Pour accéder au dernier élément d'un tableau, on peut être tenté d'indiquer à la place de l'index la taille du tableau. 
Par exemple, sur un tableau de 10 cases, si on inscrit `myArray[10]`, cela provoquera une erreur `index out of bounds exception`.
En effet, il faudra accéder à la dernière case en donnant son index. Dans notre exemple, ce sera l'index 9 (il en sera de même avec la valeur -1).

Pour éviter ce type d'erreur, on appelera toujours la taille du tableau moins 1 : `int lastElement = myArray[myArray.length - 1];`.

## Exercice : suite de Fibonacci

Ecriture d'une suite : la suite de fibonacci à l'aide d'un tableau

Ecrire un programme qui demande à l'utilisateur d'entrer un nombre n puis calcule et affiche les nombres de Fibonacci jusqu'à ce rang n.
Définition de la suite de Fibonacci :
- F0 = 0
- F1 = 1
- Fn = Fn-1 + Fn-2

Correction : 
1) déclarer un tableau d'entiers `int[]`. Étant donné qu'on doit connaître à l'avance la taille du tableau, il faudra demander à l'utilisateur le rang de la valeur de retour souhaitée. 
Attention, si un utilisateur veut aller jusqu'au rang 10, cela signifie qu'il faudra 11 index, étant donné qu'on débute à l'index 0, un tableau à 10 entrées s'arrêterait à l'index 9. Il faudra donc ajouter 1 au rang choisi.  
```Java
int rank = scanner.nextInt();
int[] fibo = new int[rank + 1];
``` 
2) Les deux premières entrées de la suite de Fibonacci étant déjà connues, on va les renseigner : 
```Java
fibo[0] = 0;
fibo[1] = 1;
```
3) on va devoir maintenant calculer toutes les autres entrées du tableau. Selon la formule, `Fn = Fn-1 + Fn-2`, signifie ceci : `fibo[2] = fibo[1] + fibo[0];`. Il faudra donc une boucle de répétition pour pouvoir écrire tous les éléments suivants. On utilisera alors une boucle `for` classique, en commençant l'indice d'intération à la valeur 2 (on possède déjà les deux premières valeurs à l'index 0 et 1) :
```Java
for (int n = 2; n <= rank; n++ ) {
    fibo[n] = fibo[n-1] + fibo[n-2];
}
```
4) Maintenant que notre tableau est rempli, on va afficher chaque case, également grâce à une boucle for : 
```Java
for (int n = 0; n <= rank; n++) {
    System.out.print(fibo[n] + ", ");
}
``` 
> Faire deux boucles dans cet exercice permet de séparer la phase d'initialisation de la phase d'affichage. 

5) On va pouvoir maintenant donner exactement la valeur de fibonacci au rang souhaité par l'utilisateur : 
```Java
System.out.println("\nFibo au rang " + rank + " : " + fibo[rank]);
```

Totalité du programme : 
```Java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Début du programme : Suite de fibonacci avec un tableau");

        Scanner scanner = new Scanner(System.in);
        System.out.print("Saisir le rang souhaité : ");
        int rank = scanner.nextInt();

        int[] fibo = new int[rank + 1];

        fibo[0] = 0;
        fibo[1] = 1;

        for (int n = 2; n <= rank; n++) {
            fibo[n] = fibo[n-1] + fibo[n-2];
        }

        for (int n = 0; n <= rank; n++) {
            System.out.print(fibo[n] + ", ");
        }

        System.out.println("\nFibo au rang " + rank + " : " + fibo[rank]);
        System.out.println("Fin du programme");
    }
}
```

Le principal avantage de cette version par rapport à celle sans tableau est que toutes la valeurs sont stockées et peuvent être calculées une seule fois afin d'être récupérées autant de fois qu'on le souhaite. 

En comparaison avec une version dans tableau qui n'avait besoin que de 3 variables, la version avec tableau a une empreinte plus importante en mémoire. Mais comme mentionné plus haut, on a pas besoin de recalculer pour accéder à une valeur précise.

## Les tableaux à deux dimensions

Un tableau à deux dimensions va posséder plusieurs lignes et sur chacune des lignes plusieurs colonnes. 

<!-- intégrer la représentation scématique-->

On appelle également ces tableaux à deux dimensions des tableaux de tableaux. 

### Déclarer et initialiser un tableau de tableau

On va déclarer un tableau à deux dimensions de la même manière qu'un tableau à une seule dimension, mais en doublant les crochets : `type[][] myArray;`.

On pourra aussi initialiser sur la même ligne que la déclaration `type[][] myArray = {{x, y, z}, {x, y, z}};`.
Cette déclaration propose un tableau à deux lignes et 3 colonnes.

exemple : 
```Java
int[][] myArray = {{0, 1, 2, 3, 4}, {5, 6, 7, 8, 9}};
```

Pour pouvoir afficher l'ensemble des données de ce tableau à deux dimensions, on aura besoin d'utiliser deux lignes : 
- une première qui va parcourir chacune des lignes avec l'indice d'itération `i`, 
- et une seconde qui elle va parcourir chacune des colonnes de chaque ligne grâce à l'indice d'itération `j`
```Java
int[][] myArray = {
    {0, 1, 2, 3, 4}, 
    {5, 6, 7, 8, 9}
};

for (int i = 0; i < myArray.length; i++) {
    for (int j = 0; j < myArray[0].length; j++) {
        System.out.println("case["+i+"]["+j+"] = " + myArray[i][j]);
    }
}
```
Retour terminal : 
```
case[0][0] = 0
case[0][1] = 1
case[0][2] = 2
case[0][3] = 3
case[0][4] = 4
case[1][0] = 5
case[1][1] = 6
case[1][2] = 7
case[1][3] = 8
case[1][4] = 9
```
Si on souhaite afficher plus visuellement notre tableau à deux dimensions, on procédera sans sauter de lignes pour les avoir tous à la suite, puis sauter une ligne seulement après avoir exécuté cette boucle imbriquée :
```Java
int[][] myArray = {
    {0, 1, 2, 3, 4}, 
    {5, 6, 7, 8, 9}
};

for (int i = 0; i < myArray.length; i++) {
    System.out.print("[");
    for (int j = 0; j < myArray[0].length; j++) {
        System.out.print("["+myArray[i][j]+"]");
    }
    System.out.println("]");
}
```
Retour terminal : 
```
[[0][1][2][3][4]]
[[5][6][7][8][9]]
```

Comme pour un tableau à une dimension, si on ne connait pas les valeurs l'avance, on peut l'initialiser dans le programme. 
Il est obligatoire de donner le nombre de lignes `x` et de colonnes `y` lorsqu'on va créer ce nouveau tableau : 
```Java
type[][] myArray;

myArray = new type[x][y];
```
Puis assigner des valeurs grâce à deux boucles imbriquées.

Prenons en exemple un tableau de nombres entiers `int[][]` de dimension 3 lignes et 3 colonnes :
```Java
int[][] myArray;
myArray = new int[3][3];
```
On pourra assigner des valeurs à ce tableau grâce à deux boucles imbriquées. On utilisera une variable compteur que l'on assignera à chaque tour de boucle en l'incrémentant de 1 à chaque fois : 
```Java
int count = 10;
for (int i = 0; i < myArray.length; i++) {
    for (int j = 0; j < myArray[0].length; j++) {
        myArray[i][j] = count;
        count++;
    }
}
```
Pour afficher de tableau à deux dimensions, on utilisera aussi deux boucles imbriquées : 
```Java
for (int i = 0; i < myArray.length; i++) {
    System.out.print("[");
    for (int j = 0; j < myArray[0].length; j++) {
        System.out.print("["+myArray[i][j]+"]");
    }
    System.out.println("]");
}
```
Retour dans le terminal : 
```
[[10][11][12]]
[[13][14][15]]
[[16][17][18]]
```