# Les tableaux

Jusqu'ici, chaque valeur avait sa propre variable. Mais un navire a plusieurs canons, un équipage plusieurs pirates, et notre carte 48 cases. Déclarer 48 variables n'est pas envisageable. Les **tableaux** permettent de ranger plusieurs valeurs **du même type** sous un seul nom.

## Objectifs

À la fin du chapitre, tu sauras :

* déclarer, créer et initialiser un tableau ;
* lire et modifier ses éléments avec un index ;
* parcourir un tableau avec une boucle `for` ou `for-each` ;
* comprendre l'erreur `ArrayIndexOutOfBoundsException` et l'éviter ;
* expliquer pourquoi copier un tableau avec `=` ne fonctionne pas comme on l'attend ;
* utiliser un tableau à deux dimensions pour représenter une grille.

## Qu'est-ce qu'un tableau ?

Un tableau est une **suite de cases numérotées**, qui contiennent toutes des valeurs **du même type**. Deux règles à retenir :

* **la taille est fixe** : on la choisit à la création, et elle ne change plus jamais ;
* **les cases sont numérotées à partir de 0** : la première case a l'index `0`, la deuxième l'index `1`, et ainsi de suite.

```
index :    0     1     2     3     4
        +-----+-----+-----+-----+-----+
        |  3  |  5  |  6  |  3  |  7  |     firepower
        +-----+-----+-----+-----+-----+
```

Un tableau est un **objet** (comme `String`), même s'il contient des types primitifs. Cela a des conséquences importantes, qu'on voit plus bas.

## Déclarer et créer un tableau

### Déclarer

On écrit le type des éléments suivi de **crochets**, puis le nom :

```java
int[] cannonDamage;
```

`int[]` se lit « tableau d'entiers ». On peut écrire n'importe quel type : `String[]`, `double[]`, `boolean[]`...

> Java accepte aussi `int cannonDamage[];` (crochets après le nom), héritée du langage C. On utilise la première forme, qui met le type en évidence : `int[]` est le type de la variable.

À ce stade, la variable est seulement déclarée : le tableau n'existe pas encore.

### Créer avec `new` et une taille

Pour réserver la mémoire, on utilise le mot-clé `new`, suivi du type et de la **taille entre crochets** :

```java
cannonDamage = new int[6];
```

On peut déclarer et créer en une seule ligne, comme pour une variable :

```java
int[] cannonDamage = new int[6];
```

Le tableau contient maintenant **6 cases**, d'index 0 à 5. Pourquoi faut-il donner la taille à l'avance ? Parce que l'ordinateur doit réserver un espace mémoire d'une taille précise : 6 entiers côte à côte.

### Les valeurs par défaut

Les cases d'un tableau créé avec `new` ne sont pas vides : elles contiennent la **valeur par défaut** du type.

| Type des éléments | Valeur par défaut |
| --- | --- |
| `int`, `long`, `short`, `byte` | `0` |
| `double`, `float` | `0.0` |
| `boolean` | `false` |
| `char` | le caractère de code 0 (invisible) |
| `String` et tout objet | `null` (« aucun objet ») |

> Attention à `null` : une case `String` vide contient `null`, pas un texte vide. Appeler une méthode dessus provoque une erreur à l'exécution, `NullPointerException`. On la rencontrera avec les objets.

### Créer avec des valeurs

Quand on connaît les valeurs à l'avance, on les écrit entre **accolades**, séparées par des virgules. La taille est déduite :

```java
int[] firepower = {3, 5, 6, 3, 7};
String[] crewNames = {"Barbe-Rouge", "Anne la Fauve", "Jack le Borgne"};
```

> **Les crochets `[ ]` ne servent pas à écrire des valeurs.** `int[] firepower = [3, 5, 6];` est une erreur de syntaxe (`illegal start of expression`) : ce sont les accolades qui délimitent la liste.

Cette écriture avec les accolades seules n'est permise qu'**au moment de la déclaration**. Pour remplir un tableau déjà déclaré, il faut écrire `new int[]` devant les accolades :

```java
int[] firepower;
firepower = new int[]{3, 5, 6, 3, 7};   // correct
// firepower = {3, 5, 6, 3, 7};         // erreur de compilation
```

## Lire et modifier un élément

On accède à une case avec son **index entre crochets** :

```java
String[] crewNames = {"Barbe-Rouge", "Anne la Fauve", "Jack le Borgne"};

System.out.println(crewNames[0]);   // Barbe-Rouge
crewNames[2] = "Jack Voile-Noire";  // on remplace la troisième case
System.out.println(crewNames[2]);   // Jack Voile-Noire
```

### La taille avec `length`

Un tableau connaît sa taille grâce à `length`. **Pas de parenthèses** : c'est un attribut du tableau, pas une méthode.

```java
int size = crewNames.length;   // 3
```

> Ne confonds pas : `tableau.length` (sans parenthèses) pour un tableau, `texte.length()` (avec parenthèses) pour un `String`. Se tromper d'écriture provoque l'erreur `cannot find symbol`.

### Le dernier élément

Un tableau de `n` cases a ses index de `0` à `n - 1`. La dernière case est donc :

```java
String lastCrewMember = crewNames[crewNames.length - 1];
```

## L'erreur `ArrayIndexOutOfBoundsException`

Si on utilise un index qui n'existe pas, le programme s'arrête à l'exécution avec une erreur :

```java
int[] cannonDamage = new int[10];
cannonDamage[10] = 5;   // le dernier index est 9 !
```

```
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 10 out of bounds for length 10
```

Un index négatif donne la même erreur (`Index -1 out of bounds for length 10`). Le compilateur ne peut pas la détecter : c'est seulement à l'exécution qu'on sait si l'index est valide. Le message indique l'index fautif et la taille du tableau : lis-le attentivement.

La cause la plus fréquente est une erreur « d'un cran » dans une boucle : écrire `i <= tableau.length` au lieu de `i < tableau.length`.

## Parcourir un tableau

### Avec une boucle `for`

On utilise un indice de boucle qui va de `0` jusqu'à **strictement moins** que la taille :

```java
int[] firepower = {3, 5, 6, 3, 7};
int total = 0;

for (int i = 0; i < firepower.length; i++) {
    total += firepower[i];
}

System.out.println("Puissance de feu totale : " + total);        // 24
System.out.println("Moyenne : " + (double) total / firepower.length);  // 4.8
```

Cette forme donne accès à l'index `i`, nécessaire quand on veut **modifier** les cases ou savoir leur position :

```java
int[] cannonDamage = new int[6];

for (int i = 0; i < cannonDamage.length; i++) {
    cannonDamage[i] = i + 1;   // 1, 2, 3, 4, 5, 6
}
```

### Avec une boucle `for-each`

Quand on veut seulement **lire** tous les éléments, il existe une écriture plus courte, sans indice :

```java
int total = 0;

for (int value : firepower) {
    total += value;
}
```

Elle se lit « pour chaque `value` dans `firepower` ». À chaque tour, `value` prend la valeur de la case suivante.

Deux limites à connaître : on ne connaît pas l'index de la case en cours, et modifier `value` ne change **pas** le tableau (c'est une copie de la valeur).

### Exemple : trouver le maximum

```java
int[] firepower = {3, 5, 6, 3, 7};
int strongest = firepower[0];   // on part du premier élément

for (int i = 1; i < firepower.length; i++) {
    if (firepower[i] > strongest) {
        strongest = firepower[i];
    }
}

System.out.println("Puissance maximale : " + strongest);   // 7
```

On initialise avec `firepower[0]` plutôt qu'avec `0`, car cela fonctionne quelle que soit la plage des valeurs (même négatives). La boucle commence ensuite à `1`, puisque la case `0` est déjà prise en compte.

### Exercice : compter les faces d'un dé

On lance un dé à six faces 60 fois. Combien de fois chaque face est-elle sortie ?

**Réfléchis 10 minutes.** Une astuce : utilise un tableau de 6 cases, où la case `face - 1` compte le nombre de fois où `face` est sortie.

**Solution :**

```java
int[] counts = new int[6];

for (int roll = 0; roll < 60; roll++) {
    int dice = (int) (Math.random() * 6) + 1;   // de 1 à 6
    counts[dice - 1]++;                          // la face 1 est comptée dans la case 0
}

for (int face = 1; face <= 6; face++) {
    System.out.println("Face " + face + " : " + counts[face - 1] + " fois");
}
```

Le tableau sert de **compteur** : l'index représente la valeur, la case contient le nombre d'occurrences. Si le programme fonctionne, la somme des six compteurs vaut toujours 60.

## Les tableaux sont des objets : copie et comparaison

Un tableau est un **objet**. Une variable de type tableau ne contient pas les valeurs elles-mêmes, mais une **référence** vers le tableau. Pour des variables primitives, `b = a` copie la valeur. Pour un tableau, `b = a` copie la **référence** : les deux variables désignent le **même** tableau.

```java
int[] a = {1, 2, 3};
int[] b = a;     // b désigne le même tableau que a

b[0] = 99;
System.out.println(a[0]);   // 99 : a a changé aussi !
```

Pour obtenir une vraie copie indépendante, on utilise `Arrays.copyOf` (voir plus bas) :

```java
int[] c = Arrays.copyOf(a, a.length);
c[0] = 1;
System.out.println(a[0]);   // 99 : a n'est pas modifié
```

La même subtilité s'applique à la comparaison : `a == c` compare les **références**, pas le contenu. Deux tableaux distincts aux valeurs identiques ne sont pas `==`. Pour comparer le contenu, on utilise `Arrays.equals(a, c)`.

Autre piège : afficher un tableau directement n'affiche pas ses valeurs.

```java
System.out.println(firepower);   // affiche quelque chose comme [I@1b6d3586
```

Le texte affiché, `[I@...`, est un identifiant technique de l'objet (le type et un code numérique). Pour afficher le contenu, on utilise `Arrays.toString`.

## La classe utilitaire `Arrays`

Le package `java.util` contient la classe `Arrays`, une boîte à outils pour manipuler les tableaux. Il faut l'importer (`import java.util.Arrays;`).

| Méthode | Rôle | Exemple |
| --- | --- | --- |
| `Arrays.toString(t)` | affiche le contenu | `[1, 2, 4, 6]` |
| `Arrays.sort(t)` | trie le tableau (modifie le tableau d'origine) | |
| `Arrays.fill(t, v)` | remplit toutes les cases avec `v` | |
| `Arrays.copyOf(t, n)` | crée une copie de taille `n` | |
| `Arrays.equals(t1, t2)` | compare le contenu de deux tableaux | |
| `Arrays.deepToString(t)` | affiche un tableau à plusieurs dimensions | |

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] dice = {4, 1, 6, 2};

        Arrays.sort(dice);
        System.out.println(Arrays.toString(dice));   // [1, 2, 4, 6]

        int[] shots = new int[4];
        Arrays.fill(shots, 7);
        System.out.println(Arrays.toString(shots));  // [7, 7, 7, 7]
    }
}
```

## Exercice : suite de Fibonacci avec un tableau

On reprend la suite de Fibonacci du chapitre précédent, mais en **gardant toutes les valeurs** dans un tableau.

Rappel : `F(0) = 0`, `F(1) = 1`, et `F(n) = F(n-1) + F(n-2)`.

**Méthode.**

1. On demande le rang `rank`. Pour qu'il y ait un terme à chaque rang de 0 à `rank`, il faut `rank + 1` cases : un tableau de 10 cases s'arrête à l'index 9.
2. On renseigne les deux premiers termes, mais `fibo[1]` n'existe que si `rank >= 1`.
3. Une boucle `for` à partir de l'index 2 calcule chaque terme avec les deux précédents.
4. Une seconde boucle affiche les valeurs. Séparer le calcul de l'affichage rend chacune plus simple.

**Solution :**

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Rang souhaité : ");
        int rank = scanner.nextInt();

        int[] fibo = new int[rank + 1];
        fibo[0] = 0;
        if (rank >= 1) {
            fibo[1] = 1;
        }

        for (int n = 2; n <= rank; n++) {
            fibo[n] = fibo[n - 1] + fibo[n - 2];
        }

        System.out.println(Arrays.toString(fibo));
        System.out.println("Fibonacci au rang " + rank + " : " + fibo[rank]);

        scanner.close();
    }
}
```

Avec `rank = 10` : `[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]` puis `Fibonacci au rang 10 : 55`. Le programme fonctionne aussi pour `rank = 0` et `rank = 1`. Une version qui écrirait directement `fibo[1] = 1;` provoquerait une `ArrayIndexOutOfBoundsException` pour `rank = 0`, car le tableau n'aurait qu'une case.

**Quel intérêt par rapport à la version sans tableau ?** La version du chapitre précédent n'avait besoin que de trois variables, donc très peu de mémoire. La version avec tableau garde toutes les valeurs : on peut ensuite y accéder autant de fois qu'on veut sans recalculer, au prix d'un peu plus de mémoire.

## Les tableaux à deux dimensions

Un tableau peut contenir... d'autres tableaux. Un **tableau à deux dimensions** est un tableau dont chaque case est un tableau : c'est un « tableau de tableaux », qu'on visualise comme une grille de **lignes** et de **colonnes**.

```
             colonne 0  colonne 1  colonne 2
ligne 0   [      2          0          3    ]
ligne 1   [      1          4          0    ]
```

### Déclarer et créer

On double les crochets :

```java
int[][] damage;                  // déclaration
damage = new int[2][3];          // 2 lignes, 3 colonnes, toutes les cases à 0
```

Avec des valeurs connues, on écrit des accolades imbriquées, une paire par ligne :

```java
int[][] damage = {
    {2, 0, 3},
    {1, 4, 0}
};
```

Ce tableau représente les dégâts reçus par deux navires (les lignes) pendant trois tours (les colonnes).

### Lire une case

On donne **d'abord la ligne, puis la colonne** :

```java
System.out.println(damage[1][0]);   // 1 : ligne 1, colonne 0
damage[0][1] = 5;                   // modifie la ligne 0, colonne 1
```

Les deux valeurs de taille sont :

* `damage.length` : le nombre de **lignes** ;
* `damage[i].length` : le nombre de **colonnes** de la ligne `i`.

### Parcourir avec deux boucles

Pour parcourir toutes les cases, on imbrique deux boucles : une pour les lignes, une pour les colonnes.

```java
for (int row = 0; row < damage.length; row++) {
    System.out.print("[");
    for (int col = 0; col < damage[row].length; col++) {
        System.out.print("[" + damage[row][col] + "]");
    }
    System.out.println("]");
}
```

```
[[2][0][3]]
[[1][4][0]]
```

Le `println` est placé **après** la boucle interne : on passe à la ligne une fois par rangée terminée.

On écrit `damage[row].length` (la longueur de la ligne en cours) plutôt que `damage[0].length`. Les deux donnent le même résultat tant que toutes les lignes ont la même longueur, mais la première écriture reste correcte dans tous les cas : chaque ligne est un tableau distinct, qui pourrait avoir une longueur différente.

Pour un affichage rapide pendant la mise au point, `Arrays.deepToString(damage)` renvoie `[[2, 0, 3], [1, 4, 0]]`.

### Remplir un tableau à deux dimensions

Comme pour un tableau à une dimension, on peut le créer avec ses dimensions puis le remplir avec deux boucles imbriquées :

```java
int[][] grid = new int[3][3];
int count = 10;

for (int row = 0; row < grid.length; row++) {
    for (int col = 0; col < grid[row].length; col++) {
        grid[row][col] = count;
        count++;
    }
}
```

Une fois affiché avec la boucle précédente, on obtient :

```
[[10][11][12]]
[[13][14][15]]
[[16][17][18]]
```

## Application : la carte du jeu

Notre jeu se déroule sur une carte de **6 lignes et 8 colonnes**. Un tableau de caractères à deux dimensions est le choix naturel :

```java
public class Main {
    public static void main(String[] args) {
        char[][] map = new char[6][8];

        // 1. on remplit la carte de mer
        for (int row = 0; row < map.length; row++) {
            for (int col = 0; col < map[row].length; col++) {
                map[row][col] = '~';
            }
        }

        // 2. on place le navire (N) en haut à gauche et l'île du Crâne (X) en bas à droite
        map[0][0] = 'N';
        map[5][7] = 'X';

        // 3. on affiche la carte
        for (int row = 0; row < map.length; row++) {
            for (int col = 0; col < map[row].length; col++) {
                System.out.print(map[row][col] + " ");
            }
            System.out.println();
        }
    }
}
```

```
N ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ ~
~ ~ ~ ~ ~ ~ ~ X
```

Dans l'itération suivante du kit, le navire se déplacera sur cette carte : on aura besoin de connaître sa ligne et sa colonne, et de vérifier qu'il ne sort pas du tableau (c'est exactement le rôle de `ArrayIndexOutOfBoundsException` !).

## Les erreurs classiques

| Erreur | Exemple | Résultat |
| --- | --- | --- |
| Crochets au lieu d'accolades | `int[] t = [1, 2, 3];` | `illegal start of expression` |
| Accolades seules après la déclaration | `t = {1, 2, 3};` | Erreur de compilation : utiliser `new int[]{...}` |
| `i <= t.length` | `for (int i = 0; i <= t.length; i++)` | `ArrayIndexOutOfBoundsException` |
| Confondre `length` et `length()` | `t.length()` ou `texte.length` | `cannot find symbol` |
| Copier avec `=` | `int[] b = a;` | Les deux variables désignent le même tableau |
| Comparer avec `==` | `a == b` | Compare les références, pas le contenu |
| Afficher directement | `System.out.println(t);` | Affiche `[I@...` : utiliser `Arrays.toString(t)` |
| Ligne et colonne inversées | `map[col][row]` | Erreur ou case incorrecte : toujours ligne puis colonne |
| Appeler une méthode sur une case `null` | `names[0].length()` sur un `String[]` vide | `NullPointerException` |

## À retenir

* Un tableau contient des éléments **du même type**, à **taille fixe**, indexés **à partir de 0**.
* Création : `new int[6]` (cases à la valeur par défaut) ou `{3, 5, 6}` (valeurs connues, à la déclaration).
* `tableau.length` donne la taille (sans parenthèses). Le dernier index est `length - 1`.
* Utiliser un index hors des limites provoque `ArrayIndexOutOfBoundsException` à l'exécution.
* `for` quand on a besoin de l'index ou qu'on modifie. `for-each` pour simplement lire.
* Un tableau est un objet : `b = a` ne copie pas, `==` ne compare pas le contenu. Utilise `Arrays.copyOf`, `Arrays.equals` et `Arrays.toString`.
* Un tableau à deux dimensions est un tableau de tableaux : `grille[ligne][colonne]`, parcouru avec deux boucles imbriquées.

## À toi de jouer

1. Crée un tableau avec la coque de cinq navires (`int[]`). Affiche la coque moyenne, la plus grande valeur et la plus petite.
2. Un équipage de six pirates a pour noms un `String[]`. Affiche chaque nom précédé de son numéro (« 1 - Barbe-Rouge », « 2 - ... »). Puis affiche le tableau à l'envers (du dernier au premier).
3. Compte combien de navires ont une coque inférieure ou égale à 5 dans ton tableau de l'exercice 1.
4. Écris un programme qui demande à l'utilisateur 5 nombres au clavier, les range dans un tableau, puis les affiche triés avec `Arrays.sort`.
5. Reprends la carte de la section précédente : place 6 récifs (`R`) à des endroits de ton choix. Compte-les ensuite avec deux boucles imbriquées.
6. Provoque volontairement une `ArrayIndexOutOfBoundsException` avec un index trop grand, puis avec un index négatif. Note les messages.
7. Fais un tableau `a` de trois entiers, puis `int[] b = a;`. Modifie `b[0]` et affiche `a[0]`. Explique pourquoi `a` a changé, puis corrige avec `Arrays.copyOf`.

## Pour aller plus loin

* [Dev.java : créer et utiliser des tableaux](https://dev.java/learn/language/constructs/basics/arrays/) : déclaration, création, tableaux multidimensionnels.
* [Classe `Arrays` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html).
* [Spécification du langage Java : les tableaux (chapitre 10)](https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html) (pour les curieux).
