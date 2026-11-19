# Les méthodes et le débogage

Plus un programme grandit, plus la méthode `main` devient longue et difficile à lire. On y trouve de l'affichage, des calculs, des vérifications, tout mélangé. La solution : **découper** le programme en petites tâches nommées, appelées **méthodes**.

Ce chapitre traite aussi d'un outil indispensable : le **débogueur**, qui permet d'observer un programme pendant son exécution.

## Objectifs

À la fin du chapitre, tu sauras :

* définir et appeler une méthode, avec ou sans paramètres, avec ou sans valeur de retour ;
* expliquer ce que signifie « Java passe tout par valeur » ;
* prévoir ce qui arrive à une variable, à un tableau, quand on les passe à une méthode ;
* utiliser la portée des variables à ton avantage ;
* écrire plusieurs méthodes portant le même nom (surcharge) ;
* utiliser le débogueur d'IntelliJ pour suivre l'exécution et trouver un bug.

## Pourquoi des méthodes ?

Une méthode est un **bloc de code qui porte un nom**. On l'écrit une fois, on l'appelle autant de fois qu'on veut. Elle apporte trois choses :

* **de la lisibilité** : `printMap(map)` en dit plus que vingt lignes de boucles imbriquées ;
* **de la réutilisation** : le même code sert à plusieurs endroits, et une correction suffit ;
* **de la décomposition** : un gros problème devient plusieurs petits problèmes que l'on résout un par un.

Dans le kit, une règle s'appliquera : **la méthode `main` doit rester courte**, une quinzaine de lignes. Elle décrit le déroulement général, et chaque étape est confiée à une méthode.

> Tu en as déjà utilisé : `System.out.println(...)`, `Math.max(...)`, `scanner.nextInt()` sont des méthodes écrites par d'autres. Il s'agit maintenant d'écrire les tiennes.

## Définir une méthode

Voici une méthode qui affiche la carte du jeu :

```java
public class Main {

    public static void main(String[] args) {
        char[][] map = new char[6][8];
        // ... on remplit la carte ...
        printMap(map);   // appel de la méthode
    }

    static void printMap(char[][] map) {
        for (int row = 0; row < map.length; row++) {
            for (int col = 0; col < map[row].length; col++) {
                System.out.print(map[row][col] + " ");
            }
            System.out.println();
        }
    }
}
```

La méthode s'écrit **dans la classe**, **en dehors de `main`** (jamais à l'intérieur). Son **en-tête** se décompose ainsi :

```
static   void        printMap   (char[][] map)
   |       |             |            |
 mot-clé  type de     nom de la    paramètres
          retour      méthode
```

* **`static`** : pour l'instant, retiens simplement ceci : `main` est `static`, et une méthode `static` ne peut appeler directement que d'autres méthodes `static`. On comprendra la raison profonde avec les classes et les objets. Dans ce chapitre, toutes nos méthodes seront donc `static`. Plus tard dans le kit, quand on créera des objets, ce mot-clé disparaîtra de la plupart des méthodes.
* **Le type de retour** indique ce que la méthode renvoie. `void` signifie « rien ».
* **Le nom** est en `camelCase`, commence par une minuscule et est de préférence un **verbe** (`printMap`, `computeDamage`, `isInsideMap`), en anglais.
* **Les paramètres**, entre parenthèses, sont les informations dont la méthode a besoin pour travailler. S'il n'y en a pas, on écrit `()`.
* Le **corps** de la méthode est entre accolades.

Le nom de la méthode, ajouté au **type de ses paramètres**, forme sa **signature** : `printMap(char[][])`. Le type de retour ne fait pas partie de la signature.

> Le compilateur ignore une méthode tant qu'elle n'est pas appelée. L'**ordre** dans lequel tu écris les méthodes dans la classe n'a aucune importance : une méthode peut être appelée même si elle est écrite plus bas dans le fichier.

## Appeler une méthode

On l'appelle par son nom, suivi de parenthèses contenant les **valeurs** à lui donner. Quand Java rencontre l'appel, il saute dans la méthode, exécute son corps, puis **revient** à la ligne suivante de l'appelant :

```java
public static void main(String[] args) {
    System.out.println("Début");
    printMap(map);               // on entre dans printMap, puis on revient ici
    System.out.println("Fin");   // exécutée après la fin de printMap
}
```

## Paramètres et arguments

Deux mots à bien distinguer :

* un **paramètre** est la variable déclarée dans l'en-tête de la méthode (`map` dans `printMap(char[][] map)`) ;
* un **argument** est la valeur donnée lors de l'appel (`map` dans `printMap(map)`).

Une méthode peut avoir plusieurs paramètres, séparés par des virgules. Il faut les passer **dans le même ordre** et **avec des types compatibles** :

```java
static void fire(String targetName, int damage) {
    System.out.println("Tir sur " + targetName + " : " + damage + " dégâts");
}

public static void main(String[] args) {
    fire("Frégate royale", 4);   // correct
    // fire(4, "Frégate royale"); // erreur : types dans le mauvais ordre
}
```

Un paramètre est une **variable locale** de la méthode : elle est créée à l'appel, avec une valeur copiée depuis l'argument, et disparaît à la fin de la méthode. Son nom est libre : il n'a aucun rapport avec le nom de la variable de l'appelant.

Java accepte les conversions qui ne perdent pas d'information : un `int` peut être passé à un paramètre `double`. L'inverse est refusé :

```java
static double half(double value) { return value / 2; }

half(5);     // correct : 5 devient 5.0
```

## Retourner une valeur

Une méthode peut renvoyer un résultat grâce au mot-clé **`return`**. Le type de la valeur est annoncé dans l'en-tête, à la place de `void` :

```java
static int computeDamage(int firepower, int dice) {
    return Math.max(0, firepower + dice - 4);
}
```

L'appelant décide quoi faire de la valeur : la ranger dans une variable, l'afficher, l'utiliser dans un calcul.

```java
int damage = computeDamage(3, 5);           // 4
System.out.println(computeDamage(5, 6));    // 7
```

Quelques règles :

* `return` **termine immédiatement** la méthode : le code écrit après n'est pas exécuté.
* La valeur renvoyée doit être **compatible avec le type annoncé**. Une méthode `int` ne peut pas renvoyer un texte.
* **Tous les chemins** d'une méthode non `void` doivent se terminer par un `return`. Sinon le compilateur refuse : `missing return statement`.
* Une méthode `void` ne renvoie rien. On peut y écrire `return;` seul pour la quitter plus tôt. Mais on ne peut pas utiliser son résultat : `int y = printMap(map);` est une erreur.

Une méthode qui renvoie un `boolean` se nomme généralement avec un préfixe `is`, `has` ou `can`. Voici un exemple très utile pour notre carte : le navire est-il toujours sur la grille ?

```java
static boolean isInsideMap(char[][] map, int row, int col) {
    return row >= 0 && row < map.length
        && col >= 0 && col < map[row].length;
}
```

Grâce au court-circuit de `&&`, la dernière condition `map[row].length` n'est évaluée que si `row` est valide : on évite l'`ArrayIndexOutOfBoundsException`.

Un exemple avec plusieurs `return` :

```java
static String describeHull(int hull) {
    if (hull <= 0) {
        return "coulé";
    }
    if (hull <= 3) {
        return "critique";
    }
    return "correct";
}
```

Chaque `return` quitte la méthode : pas besoin de `else`.

## Le passage par valeur

C'est un point fondamental, et une source d'erreurs fréquente. **En Java, les arguments sont toujours passés par valeur** : le paramètre reçoit une **copie** de la valeur de l'argument.

### Avec une variable de type primitif

Une variable primitive est une boîte qui contient une valeur. Appeler une méthode photocopie cette valeur dans la boîte du paramètre :

```java
static void increment(int n) {
    n++;
}

public static void main(String[] args) {
    int x = 5;
    increment(x);
    System.out.println(x);   // 5
}
```

```
À l'appel :                      Après n++ :

  x ┌───┐        n ┌───┐          x ┌───┐        n ┌───┐
    │ 5 │ ─copie─▶ │ 5 │            │ 5 │          │ 6 │
    └───┘          └───┘            └───┘          └───┘
```

Les deux boîtes sont **indépendantes** : modifier `n` ne change pas `x`. Le `6` disparaît avec `n` à la fin de la méthode.

Une méthode ne peut donc **jamais réaffecter la variable de l'appelant**. Pour récupérer un résultat, elle le **retourne**, et c'est l'appelant qui décide où le ranger :

```java
static int incremented(int n) {
    return n + 1;
}

int y = incremented(x);   // y vaut 6, x vaut toujours 5
x = incremented(x);       // x vaut maintenant 6
```

### Avec un tableau

Pour un tableau (c'est un objet, voir le chapitre précédent), la variable ne contient pas les valeurs, mais une **référence** vers le tableau. Le passage se fait toujours par valeur, mais **ce qui est copié, c'est la référence**. Le paramètre et la variable de l'appelant désignent alors **le même tableau** :

```java
static void repairAll(int[] hulls, int points) {
    for (int i = 0; i < hulls.length; i++) {
        hulls[i] += points;
    }
}

public static void main(String[] args) {
    int[] hulls = {10, 4, 7};
    repairAll(hulls, 2);
    System.out.println(Arrays.toString(hulls));   // [12, 6, 9]
}
```

Les cases du tableau **sont modifiées** : la méthode a travaillé sur le même tableau que `main`. C'est pour cela que notre méthode peut remplir ou modifier la carte reçue en paramètre.

En revanche, **réaffecter le paramètre** n'a aucun effet pour l'appelant :

```java
static void resetHulls(int[] hulls) {
    hulls = new int[3];   // le paramètre désigne un nouveau tableau...
    hulls[0] = 99;        // ...mais la variable de main, elle, n'a pas bougé
}
```

Après l'appel `resetHulls(hulls)`, le tableau de `main` est inchangé : seule la copie de la référence, locale à la méthode, a été redirigée.

```
À l'appel :                         Après hulls = new int[3] :

  main.hulls ─┐                       main.hulls ─────▶ [12, 6, 9]
              ├──▶ [12, 6, 9]         resetHulls.hulls ▶ [0, 0, 0]
  param hulls ┘
```

On retient donc :

| Ce qu'on passe | Ce que la méthode reçoit | Ce que la méthode peut faire |
| --- | --- | --- |
| Un type primitif (`int`, `boolean`...) | une copie de la valeur | rien changer chez l'appelant |
| Un tableau ou un objet | une copie de la **référence** | modifier son contenu, visible par l'appelant |

> On retrouvera le même mécanisme avec les objets, dans le chapitre sur la création de classes.

## La portée des variables

Une variable n'existe que **dans le bloc où elle est déclarée** (entre les accolades les plus proches). C'est sa **portée** (*scope*).

```java
static void report() {
    int hull = 10;                   // existe seulement dans report()
    System.out.println(hull);
}

public static void main(String[] args) {
    report();
    System.out.println(hull);        // erreur : cannot find symbol
}
```

Conséquences :

* les variables de `main` ne sont **pas visibles** dans les autres méthodes, et inversement. Pour échanger des informations, on utilise les **paramètres** (pour envoyer) et le **`return`** (pour recevoir) ;
* deux méthodes peuvent avoir chacune une variable appelée `hull` : ce sont deux variables différentes, sans rapport ;
* une variable déclarée dans une boucle ou un `if` disparaît à l'accolade fermante.

C'est une contrainte volontaire : elle t'oblige à voir clairement ce dont chaque méthode a besoin.

## La surcharge

Java autorise **plusieurs méthodes de même nom**, à condition que leurs **paramètres diffèrent** (en nombre ou en type). On parle de **surcharge** (*overloading*) :

```java
static void fire(int firepower) {
    System.out.println("Tir de puissance " + firepower);
}

static void fire(int firepower, int dice) {
    System.out.println("Tir de puissance " + firepower + " avec un dé de " + dice);
}

static void fire(double firepower) {
    System.out.println("Tir à puissance décimale " + firepower);
}
```

Le compilateur choisit la bonne méthode en regardant les arguments de l'appel :

```java
fire(3);       // Tir de puissance 3
fire(3, 2);    // Tir de puissance 3 avec un dé de 2
fire(3.5);     // Tir à puissance décimale 3.5
```

Seule la **signature** compte : deux méthodes qui ne diffèrent que par leur type de retour sont refusées (`method f(int) is already defined`). Tu retrouveras la surcharge pour les constructeurs, dans le chapitre sur les classes.

> Il existe un mécanisme qui ressemble à la surcharge mais qui est différent : la **redéfinition** d'une méthode dans une classe fille. On le verra avec l'héritage.

## Exemple complet : découper le programme de la carte

On reprend la carte 6 × 8 du chapitre précédent, que l'on découpe en méthodes. `main` ne fait plus que décrire le déroulement :

```java
public class Main {

    public static void main(String[] args) {
        char[][] map = createMap(6, 8);
        map[0][0] = 'N';   // le navire
        map[5][7] = 'X';   // l'île du Crâne
        printMap(map);

        System.out.println("(5, 7) est sur la carte : " + isInsideMap(map, 5, 7));
        System.out.println("(6, 0) est sur la carte : " + isInsideMap(map, 6, 0));
    }

    static char[][] createMap(int rows, int cols) {
        char[][] map = new char[rows][cols];
        for (int row = 0; row < rows; row++) {
            for (int col = 0; col < cols; col++) {
                map[row][col] = '~';
            }
        }
        return map;
    }

    static void printMap(char[][] map) {
        for (int row = 0; row < map.length; row++) {
            for (int col = 0; col < map[row].length; col++) {
                System.out.print(map[row][col] + " ");
            }
            System.out.println();
        }
    }

    static boolean isInsideMap(char[][] map, int row, int col) {
        return row >= 0 && row < map.length
            && col >= 0 && col < map[row].length;
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
(5, 7) est sur la carte : true
(6, 0) est sur la carte : false
```

Chaque méthode a **une seule responsabilité**, et son nom dit ce qu'elle fait. Remarque que `createMap` renvoie un tableau, et que `printMap` le reçoit : un tableau peut être aussi bien un paramètre qu'une valeur de retour.

## Le mode débogage

### Pourquoi déboguer ?

Quand un programme ne fait pas ce qu'on attend, la tentation est d'ajouter des `System.out.println` partout. Le **débogueur** est bien plus efficace : il permet de **mettre le programme en pause**, de **lire la valeur de chaque variable**, puis d'**avancer instruction par instruction**. On voit exactement ce que fait le programme, plutôt que de le deviner.

### Les points d'arrêt

Un **point d'arrêt** (*breakpoint*) marque une ligne où le programme doit se mettre en pause. Dans IntelliJ, on clique dans la **marge**, à gauche du numéro de la ligne : un point rouge apparaît.

Il faut ensuite lancer le programme en mode **debug** (l'icône en forme d'insecte, à côté du bouton `Run`). L'exécution s'arrête **juste avant** la ligne marquée : cette ligne n'est pas encore exécutée.

### Les commandes du débogueur

| Commande | Raccourci par défaut* | Rôle |
| --- | --- | --- |
| `Resume Program` | `F9` | Reprend l'exécution jusqu'au **prochain point d'arrêt**, ou jusqu'à la fin. |
| `Step Over` | `F8` | Exécute la ligne courante **sans entrer** dans les méthodes qu'elle appelle, puis passe à la suivante. |
| `Step Into` | `F7` | Si la ligne appelle une méthode, **entre dans cette méthode** pour la suivre pas à pas. |
| `Step Out` | `Shift + F8` | Termine la méthode en cours et **revient à l'appelant**. |
| `Rerun` | `Ctrl + F5` | **Relance** le programme en mode debug depuis le début. |
| `Stop` | `Ctrl + F2` | **Arrête** le programme et la session de debug. |
| `View Breakpoints` | `Ctrl + Maj + F8` | Ouvre la liste de **tous les points d'arrêt**, pour les consulter, les activer ou les supprimer. |
| `Mute Breakpoints` | | **Désactive tous les points d'arrêt** temporairement, sans les supprimer. Un nouveau clic les réactive. |

\* Les raccourcis dépendent du système et de la configuration (*keymap*) de l'IDE : vérifie-les dans les réglages.

La différence entre `Step Over` et `Step Into` se voit sur une ligne comme `int damage = computeDamage(3, 5);` : `Step Over` exécute toute la méthode d'un coup et passe à la ligne suivante, alors que `Step Into` entre dans `computeDamage` et s'arrête à sa première ligne.

### Observer l'état du programme

Pendant une pause, deux zones de la fenêtre de debug sont particulièrement utiles :

* **Variables** : les valeurs des variables visibles à cet endroit. Un tableau ou un objet peut être déplié pour voir son contenu.
* **Frames** (la pile d'appels) : la liste des méthodes en cours d'exécution, de la plus récente jusqu'à `main`. Un clic sur une ligne affiche les variables de cette méthode.

### Pour aller plus loin avec le débogueur

* **Évaluer une expression** (`Alt + F8`) : calculer à la volée une expression avec les variables courantes (`hull + 2`, `map.length`).
* **Point d'arrêt conditionnel** : clic droit sur le point d'arrêt, puis saisie d'une condition (`row > 4`). L'exécution ne s'arrête que si elle est vraie. Très pratique dans une boucle.
* **Run to Cursor** (`Alt + F9`) : exécuter jusqu'à la ligne où se trouve le curseur, sans poser de point d'arrêt.

### Exemple : observer le passage par valeur

Avec les méthodes `increment` et `incremented` vues plus haut :

1. Pose un point d'arrêt sur la ligne `int y = incremented(x);` et lance en debug.
2. `Step Into` (`F7`) : tu entres dans `incremented`. Le panneau **Variables** montre `n = 5`, et **Frames** liste `incremented` au-dessus de `main`.
3. Dans la méthode, `n` vaut `5`. Clique ensuite sur la ligne `main` dans **Frames** : `x` vaut toujours `5`. Ce sont bien deux variables indépendantes.

Avec un tableau, tu verrais en revanche deux variables différentes (`hulls` dans `main`, `hulls` dans `repairAll`) qui affichent **le même identifiant** (le numéro après le `@`) : elles désignent le même objet.

### Exercice : chasse au bug

Voici une version défectueuse de `isInsideMap`. Le navire doit pouvoir être déplacé n'importe où dans la carte, mais le programme plante en testant une case en dehors.

```java
static boolean isInsideMap(char[][] map, int row, int col) {
    return row >= 0 && row <= map.length
        && col >= 0 && col < map[row].length;
}
```

Avec le `main` de l'exemple précédent, l'appel `isInsideMap(map, 6, 0)` lève une `ArrayIndexOutOfBoundsException`.

1. Lance le programme en debug avec un point d'arrêt sur la ligne du `return`.
2. Observe les valeurs de `row`, `col` et `map.length` dans le panneau **Variables**.
3. Utilise **Evaluate Expression** (`Alt + F8`) pour calculer `row <= map.length`, puis `map[row]`. Que constates-tu ?
4. Corrige l'erreur, relance et vérifie que le résultat est correct.

**Solution :** `row <= map.length` est vrai pour `row = 6`, alors que le dernier index valide est `5`. L'expression `map[row]` tente ensuite d'accéder à la ligne 6, qui n'existe pas. Il faut un `<` strict : `row < map.length`.

## Les erreurs classiques

| Erreur | Message du compilateur | Explication |
| --- | --- | --- |
| Appeler une méthode non `static` depuis `main` | `non-static method f() cannot be referenced from a static context` | Ajoute `static` à la méthode (pour l'instant). |
| Oublier un `return` | `missing return statement` | Un chemin ne renvoie rien. |
| Mauvais type d'argument | `incompatible types: String cannot be converted to int` | Vérifie l'ordre et le type des arguments. |
| Renvoyer un `double` dans un `int` | `incompatible types: possible lossy conversion from double to int` | Il faut un cast explicite, en connaissance de cause. |
| Utiliser le résultat d'une méthode `void` | `incompatible types: void cannot be converted to int` | Une méthode `void` ne renvoie rien. |
| `return` d'une valeur dans une méthode `void` | `incompatible types: unexpected return value` | Change le type de retour, ou retire la valeur. |
| Deux méthodes de même signature | `method f(int) is already defined` | Change le nom ou les paramètres. |
| Utiliser une variable d'une autre méthode | `cannot find symbol` | Passe-la en paramètre. |
| Croire qu'une méthode modifie un `int` de l'appelant | pas d'erreur, mais aucun effet | Retourne le résultat et réaffecte-le. |

## À retenir

* Une méthode est un bloc de code nommé : `static type nom(paramètres) { corps }`. Elle s'écrit dans la classe, en dehors de `main`.
* `void` : aucune valeur de retour. Sinon, `return` renvoie une valeur du type annoncé, et termine la méthode.
* Un **paramètre** est la variable de l'en-tête, un **argument** la valeur de l'appel. Ils doivent correspondre en nombre, en ordre et en type.
* Java passe **toujours** les arguments **par valeur** : une copie d'une valeur primitive, ou une copie de la **référence** pour un tableau ou un objet.
* Une méthode peut donc modifier le **contenu** d'un tableau reçu, mais jamais réaffecter la variable de l'appelant.
* Une variable n'existe que dans son bloc (portée). Pour échanger des données entre méthodes : paramètres et `return`.
* **Surcharge** : même nom, paramètres différents.
* Le **débogueur** permet de s'arrêter sur une ligne, d'inspecter les variables et d'avancer pas à pas : `Step Over`, `Step Into`, `Step Out`, `Resume`.

## À toi de jouer

1. Écris une méthode `static int rollDice()` qui renvoie un entier entre 1 et 6, et appelle-la trois fois depuis `main`.
2. Écris `static boolean isEven(int number)` puis utilise-la pour afficher si un nombre saisi au clavier est pair.
3. Écris `static int sum(int[] values)` et `static double average(int[] values)`. Teste-les avec un tableau de puissances de feu.
4. Écris une méthode `static void repair(int[] hulls, int index, int points)` qui ajoute des points de coque au navire d'un index donné. Que se passe-t-il si l'index est invalide ? Protège-toi avec une condition.
5. Écris deux versions surchargées de `max` : une pour deux `int`, une pour trois `int`. Appelle `max(2, 9)` et `max(2, 9, 4)`.
6. Écris une méthode `static void swap(int a, int b)` qui échange ses deux paramètres, appelle-la avec deux variables de `main` et affiche-les ensuite. Que constates-tu, et pourquoi ? Comment faire autrement avec un tableau de deux cases ?
7. Découpe en méthodes ton exercice de la chasse au trésor (chapitre 4) : une méthode pour calculer la distance, une pour afficher l'indication « froid / tiède / chaud », et une pour lire une proposition. `main` doit tenir en moins de 15 lignes.
8. Dans le débogueur, suis pas à pas l'exécution de `printMap` avec un point d'arrêt conditionnel qui ne s'arrête qu'à la ligne 3 (`row == 3`).

## Pour aller plus loin

* [Dev.java : définir des méthodes](https://dev.java/learn/language/oop/classes-objects/defining-methods/).
* [Dev.java : appeler des méthodes et des constructeurs](https://dev.java/learn/classes-objects/calling-methods-constructors/).
* [Dev.java : le débogage en Java](https://dev.java/learn/debugging/).
* [JetBrains : déboguer sa première application Java avec IntelliJ IDEA](https://www.jetbrains.com/help/idea/debugging-your-first-java-application.html).
* [Spécification du langage Java : les méthodes (chapitre 8, section 8.4)](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.4) (pour les curieux).
