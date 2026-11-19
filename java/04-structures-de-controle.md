# Les structures de contrôle

Jusqu'ici, ton programme s'exécute ligne après ligne, de haut en bas, une seule fois. Mais un jeu doit **réagir** : si la coque tombe à zéro, le navire coule ; tant que le Kraken n'est pas vaincu, le combat continue ; pour chaque canon, on tire. Les **structures de contrôle** permettent de décider quelles instructions exécuter, et combien de fois.

On distingue deux familles :

* les **structures conditionnelles** (`if`, `else`, `switch`) : exécuter un bloc seulement dans certains cas ;
* les **structures répétitives**, ou **boucles** (`for`, `while`, `do/while`) : exécuter un bloc plusieurs fois.

## Objectifs

À la fin du chapitre, tu sauras :

* choisir entre `if`, `else if`, `else` et `switch` ;
* écrire une boucle `for`, `while` ou `do/while` et savoir laquelle utiliser ;
* éviter les boucles infinies et les erreurs « d'un cran » ;
* interrompre une boucle avec `break` et sauter une répétition avec `continue` ;
* tirer un nombre au hasard avec `Math.random()`.

## La structure conditionnelle `if`

Le mot-clé `if` (« si ») est suivi d'une **condition entre parenthèses**, puis d'un **bloc de code entre accolades**. La condition est une expression qui renvoie un `boolean`. Si elle vaut `true`, le bloc est exécuté ; sinon, il est ignoré.

```java
int rations = 0;

if (rations == 0) {
    System.out.println("Plus de rations : l'équipage a faim !");
}

System.out.println("Fin du tour");
```

```
Plus de rations : l'équipage a faim !
Fin du tour
```

Si `rations` valait `4`, seule la ligne « Fin du tour » s'afficherait.

> **Erreur de débutant : `=` au lieu de `==`.** Écrire `if (rations = 0)` est une erreur : `=` range une valeur au lieu de comparer. Java refuse de compiler : `incompatible types: int cannot be converted to boolean`. C'est une chance, car le compilateur t'aide à repérer la faute.

### Les accolades

Quand le bloc ne contient qu'**une seule instruction**, les accolades sont facultatives :

```java
if (rations == 0)
    System.out.println("Plus de rations !");
System.out.println("Fin du tour");  // cette ligne s'exécute toujours
```

Ce style est piégeux : seule la première ligne après le `if` appartient à la condition, même si tu l'indentes autrement. **Mets toujours les accolades**, même pour une seule instruction : le code est plus clair et les erreurs d'ajout de ligne disparaissent.

> Autre piège : un point-virgule juste après la condition, comme `if (rations == 0);`, termine l'instruction. Le bloc qui suit n'a alors plus aucun lien avec le `if` et s'exécute toujours.

### Conditions imbriquées

Un `if` peut contenir un autre `if` :

```java
int hull = 8;
int rations = 5;

if (hull > 0) {
    System.out.println("Le navire flotte.");

    if (rations < 3) {
        System.out.println("Mais les vivres sont presque épuisés.");
    }

    System.out.println("Fin de l'inspection du navire.");
}

System.out.println("Fin du programme.");
```

Avec `hull = 8` et `rations = 5`, la condition interne est fausse :

```
Le navire flotte.
Fin de l'inspection du navire.
Fin du programme.
```

On peut combiner plusieurs conditions avec `&&` et `||` (voir le chapitre sur les opérateurs) pour éviter des imbrications inutiles :

```java
if (hull > 0 && rations < 3) {
    System.out.println("Le navire flotte, mais les vivres sont presque épuisés.");
}
```

## La structure `if ... else`

Pour exécuter un autre bloc quand la condition est fausse, on ajoute `else` (« sinon ») :

```java
int hull = 0;

if (hull > 0) {
    System.out.println("Le navire flotte encore.");
} else {
    System.out.println("Le navire est coulé.");
}
```

```
Le navire est coulé.
```

Un `if ... else` exécute **toujours exactement un des deux blocs**.

## La structure `if ... else if ... else`

Quand il y a plus de deux cas, on enchaîne les conditions avec `else if` (« sinon si ») :

```java
int hull = 4;
int maxHull = 10;

if (hull <= 0) {
    System.out.println("Le navire est coulé.");
} else if (hull <= 3) {
    System.out.println("Coque critique !");
} else if (hull < maxHull) {
    System.out.println("Coque endommagée.");
} else {
    System.out.println("Coque intacte.");
}
```

```
Coque endommagée.
```

Java teste les conditions **dans l'ordre** et exécute **le premier bloc dont la condition est vraie**, puis saute tout le reste de la chaîne. Le `else` final, facultatif, s'exécute si aucune condition n'était vraie.

### Pourquoi pas plusieurs `if` à la suite ?

Compare avec des `if` indépendants :

```java
int hull = 2;

if (hull <= 5) {
    System.out.println("Coque faible");
}
if (hull <= 3) {
    System.out.println("Coque critique");
}
```

```
Coque faible
Coque critique
```

Ici, **les deux conditions sont vraies**, donc les deux messages s'affichent : chaque `if` est évalué séparément. Avec `else if`, seul le premier cas vrai serait exécuté.

La différence est donc d'abord une question de **logique** : des cas qui s'excluent mutuellement s'écrivent avec `else if`. La différence de vitesse d'exécution est négligeable : ne choisis jamais l'un ou l'autre pour des raisons de performance. Choisis celui qui exprime le mieux ce que tu veux faire.

> Dans une chaîne `else if`, l'**ordre** des conditions est important. Si tu avais mis `hull < maxHull` en premier, il serait vrai aussi pour une coque critique, et les cas suivants ne seraient jamais atteints. Place les cas les plus précis en premier.

### Exercice : le navire le plus puissant

Tu as la puissance de feu de trois navires : `firstFirepower`, `secondFirepower`, `thirdFirepower`. Affiche le numéro du navire le plus puissant (1, 2 ou 3). En cas d'égalité, on prend le premier.

**Réfléchis 10 minutes**, avec une chaîne `if ... else if ... else`.

**Solution :**

```java
if (firstFirepower >= secondFirepower && firstFirepower >= thirdFirepower) {
    System.out.println("Le navire 1 est le plus puissant");
} else if (secondFirepower >= thirdFirepower) {
    System.out.println("Le navire 2 est le plus puissant");
} else {
    System.out.println("Le navire 3 est le plus puissant");
}
```

Le premier test vérifie si le navire 1 est au moins aussi puissant que les deux autres. Sinon, le navire 1 est éliminé : il reste à comparer le 2 et le 3. Utiliser `>=` plutôt que `>` règle le cas des égalités.

## La structure `switch`

Quand on compare **une même variable à plusieurs valeurs précises**, le `switch` est plus lisible qu'une longue chaîne de `else if` :

```java
char direction = 'E';

switch (direction) {
    case 'N':
        System.out.println("Cap au nord");
        break;
    case 'S':
        System.out.println("Cap au sud");
        break;
    case 'E':
        System.out.println("Cap à l'est");
        break;
    case 'O':
        System.out.println("Cap à l'ouest");
        break;
    default:
        System.out.println("Direction inconnue");
        break;
}
```

```
Cap à l'est
```

Fonctionnement :

* Java compare la valeur entre parenthèses à chaque `case`, dans l'ordre.
* Quand un `case` correspond, l'exécution **commence là**, et se poursuit **jusqu'au prochain `break`** (ou la fin du `switch`).
* `default` est exécuté si aucun `case` ne correspond. Il est facultatif, mais recommandé.

### Le `break` est important

Sans `break`, l'exécution continue dans le `case` suivant, même s'il ne correspond pas : c'est le « passage au cas suivant » (*fall-through*). C'est la cause d'erreurs fréquentes, mais on peut l'utiliser volontairement pour regrouper des cas qui font la même chose :

```java
switch (direction) {
    case 'N':
    case 'S':
        System.out.println("Axe nord-sud");
        break;
    case 'E':
    case 'O':
        System.out.println("Axe est-ouest");
        break;
    default:
        System.out.println("Direction inconnue");
        break;
}
```

### Ce qu'un `switch` peut tester

* Il teste uniquement l'**égalité** avec des valeurs constantes. Pas de `<`, `>` ni de `!=` : pour des intervalles, utilise `if ... else if`.
* Types acceptés : `byte`, `short`, `char`, `int`, `String` et les énumérations (vues plus tard). Pas de `long`, `float`, `double` ni `boolean`.
* Deux `case` avec la même valeur sont refusés à la compilation : `duplicate case label`.

### La syntaxe moderne avec `->`

Depuis Java 14, le `switch` accepte une écriture plus courte avec une flèche. Elle n'a **pas besoin de `break`** : seul le cas qui correspond est exécuté, sans passage au suivant.

```java
switch (direction) {
    case 'N' -> System.out.println("Cap au nord");
    case 'S' -> System.out.println("Cap au sud");
    case 'E' -> System.out.println("Cap à l'est");
    case 'O' -> System.out.println("Cap à l'ouest");
    default -> System.out.println("Direction inconnue");
}
```

Le `switch` peut aussi **renvoyer une valeur** et se ranger dans une variable (on parle de *switch expression*) :

```java
String label = switch (direction) {
    case 'N' -> "nord";
    case 'S' -> "sud";
    case 'E' -> "est";
    case 'O' -> "ouest";
    default -> "inconnue";
};
System.out.println("Direction : " + label);
```

Les deux écritures sont valables. Dans ce cours, on utilise la forme moderne quand elle simplifie le code, mais tu rencontreras la forme classique (avec `break`) dans beaucoup de projets existants : il faut savoir lire les deux.

### Exercice : le menu de création du navire

Écris un programme qui affiche un menu :

```
Choisis ton navire :
1 - Sloop
2 - Galleon
```

Lis le choix de l'utilisateur avec `Scanner` (`nextInt()`), puis affiche « Tu as choisi le Sloop », « Tu as choisi le Galleon » ou « Choix invalide » avec un `switch`.

## La boucle `for`

Une boucle répète un bloc d'instructions. La boucle `for` est idéale quand on **sait à l'avance combien de fois** répéter.

```java
for (int day = 1; day <= 5; day++) {
    System.out.println("Jour " + day + " : cap vers l'île du Crâne.");
}
```

```
Jour 1 : cap vers l'île du Crâne.
Jour 2 : cap vers l'île du Crâne.
Jour 3 : cap vers l'île du Crâne.
Jour 4 : cap vers l'île du Crâne.
Jour 5 : cap vers l'île du Crâne.
```

Les parenthèses contiennent trois parties séparées par des points-virgules :

```
for (initialisation ; condition ; mise à jour) {
    bloc d'instructions
}
```

1. **L'initialisation** est exécutée une seule fois, au début : on y déclare une variable appelée **indice de boucle** (`day`, ou `i` par habitude).
2. **La condition** est testée avant chaque répétition. Tant qu'elle est vraie, le bloc s'exécute ; dès qu'elle est fausse, la boucle s'arrête.
3. **La mise à jour** est exécutée après chaque répétition, en général `day++`.

L'ordre réel d'exécution est : initialisation, puis (condition, bloc, mise à jour) en boucle, jusqu'à ce que la condition soit fausse.

> Il faut **déclarer le type** de l'indice : `for (int day = 1; ...)`. Écrire `for (day = 1; ...)` sans `int` provoque l'erreur `cannot find symbol`, puisque `day` n'existe pas.

L'indice déclaré dans le `for` n'existe **que dans la boucle** : après l'accolade fermante, il n'est plus accessible. C'est la **portée** de la variable.

### Exemple : cumuler une valeur

Chaque jour, l'équipage consomme une ration de plus que la veille. Combien de rations en cinq jours ?

```java
int total = 0;

for (int day = 1; day <= 5; day++) {
    total += day;
}

System.out.println("Rations consommées : " + total);  // 15
```

La variable `total` est déclarée **avant** la boucle : elle doit survivre aux répétitions.

### Compter à rebours

La mise à jour peut décrémenter :

```java
for (int i = 3; i > 0; i--) {
    System.out.print(i + " ");
}
System.out.println("Feu !");
```

```
3 2 1 Feu !
```

### Attention aux erreurs « d'un cran »

La condition `day <= 5` répète 5 fois en partant de 1. Écrire `day < 5` la répéterait 4 fois seulement. En partant de `0`, on écrit `i < 5` pour répéter 5 fois. Ces erreurs, appelées *off-by-one*, sont très fréquentes : vérifie toujours la première et la dernière répétition.

### Boucles imbriquées

On peut placer une boucle dans une autre. La boucle interne s'exécute **entièrement** à chaque tour de la boucle externe. C'est la base de l'affichage d'une grille, comme notre carte :

```java
for (int row = 0; row < 3; row++) {
    for (int col = 0; col < 4; col++) {
        System.out.print("~ ");
    }
    System.out.println();
}
```

```
~ ~ ~ ~
~ ~ ~ ~
~ ~ ~ ~
```

Le `println()` sans argument, après la boucle interne, passe à la ligne : une fois par rangée.

## Tirer un nombre au hasard

Un jeu a besoin de hasard : un dé, un ennemi placé au hasard. La méthode `Math.random()` renvoie un `double` **au hasard entre 0 inclus et 1 exclu** (par exemple `0.7342...`).

Pour obtenir un entier dans un intervalle, on multiplie puis on convertit avec un cast :

```java
int randomIndex = (int) (Math.random() * 100);       // entier de 0 à 99
int dice = (int) (Math.random() * 6) + 1;            // entier de 1 à 6 : un dé
```

* `Math.random() * 6` donne un décimal entre 0 et 5,99... ;
* `(int)` supprime la partie décimale : le résultat est un entier de 0 à 5 ;
* `+ 1` décale l'intervalle à 1 – 6.

La formule générale pour un entier entre `min` et `max` inclus est `(int) (Math.random() * (max - min + 1)) + min`.

> Il existe une classe plus pratique pour cela, `java.util.Random`, qu'on utilisera plus tard dans le kit pour le dé du jeu. `Math.random()` suffit pour s'entraîner.

### Exercice : dix lancers de dé

Lance dix fois un dé à six faces, affiche chaque résultat, puis la plus grande et la plus petite valeur obtenue.

**Solution :**

```java
public class Main {
    public static void main(String[] args) {
        int highest = 1;
        int lowest = 6;

        for (int i = 1; i <= 10; i++) {
            int dice = (int) (Math.random() * 6) + 1;
            System.out.println("Lancer " + i + " : " + dice);

            if (dice > highest) {
                highest = dice;
            }
            if (dice < lowest) {
                lowest = dice;
            }
        }

        System.out.println("Plus grande valeur : " + highest);
        System.out.println("Plus petite valeur : " + lowest);
    }
}
```

Pourquoi `highest` commence à 1 et `lowest` à 6 ? Ce sont les pires cas : n'importe quelle valeur tirée est supérieure ou égale à 1 et inférieure ou égale à 6, donc elle remplacera ces valeurs initiales si elle est meilleure. Pour un intervalle quelconque, on initialise `highest` avec la plus petite valeur possible et `lowest` avec la plus grande.

## La boucle `while`

La boucle `while` (« tant que ») répète un bloc tant qu'une condition est vraie. On l'utilise quand on **ne connaît pas à l'avance** le nombre de répétitions.

```java
int hull = 10;

while (hull > 0) {
    hull = Math.max(0, hull - 3);
    System.out.println("Coque : " + hull);
}
```

```
Coque : 7
Coque : 4
Coque : 1
Coque : 0
```

La condition est testée **avant chaque répétition** : si elle est fausse dès le départ, le bloc n'est jamais exécuté.

### Attention aux boucles infinies

Si la condition ne devient jamais fausse, la boucle ne s'arrête jamais :

```java
int hull = 10;

while (hull > 0) {
    System.out.println("Le navire prend l'eau...");
    // oubli : hull ne change jamais
}
```

Ce programme affiche le message sans fin et utilise toute la puissance d'un coeur du processeur. Il ne « plante » pas : il boucle, jusqu'à ce que tu l'arrêtes avec le bouton carré rouge `Stop` d'IntelliJ.

Pour t'en prémunir, vérifie à chaque `while` : **qu'est-ce qui, dans le bloc, finira par rendre la condition fausse ?**

### Exemple classique : contrôler une saisie

On veut acheter entre 1 et 10 rations, et redemander tant que la valeur saisie est incorrecte :

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Combien de rations (1 à 10) ? ");
        int rations = scanner.nextInt();

        while (rations < 1 || rations > 10) {
            System.out.println("Quantité invalide, recommence.");
            System.out.print("Combien de rations (1 à 10) ? ");
            rations = scanner.nextInt();
        }

        System.out.println("Tu achètes " + rations + " rations.");
        scanner.close();
    }
}
```

On est obligé de poser la question **une première fois avant** la boucle, puis de la répéter dedans : la ligne est dupliquée. Le `do/while` règle ce défaut.

## La boucle `do/while`

Dans un `do/while`, le bloc s'exécute **d'abord**, puis la condition est testée. Le bloc s'exécute donc **au moins une fois** :

```
do {
    instructions
} while (condition);
```

> N'oublie pas le **point-virgule** après la condition du `while`.

Le même contrôle de saisie, sans duplication :

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int rations;

        do {
            System.out.print("Combien de rations (1 à 10) ? ");
            rations = scanner.nextInt();
        } while (rations < 1 || rations > 10);

        System.out.println("Tu achètes " + rations + " rations.");
        scanner.close();
    }
}
```

La variable `rations` est déclarée **avant** le `do`. Si elle était déclarée dans le bloc, elle n'existerait plus au moment du test `while (...)` : c'est la même règle de portée que pour le `for`.

**Comment choisir ?**

| Situation | Boucle |
| --- | --- |
| Nombre de répétitions connu à l'avance | `for` |
| Répéter tant qu'une condition est vraie, éventuellement zéro fois | `while` |
| Répéter au moins une fois (saisie à contrôler, menu) | `do/while` |

## Les mots-clés `break` et `continue`

Ils s'utilisent dans une boucle, avec un `if`.

**`break`** arrête immédiatement la boucle. L'exécution reprend après l'accolade fermante.

```java
int rations = 3;

for (int day = 1; day <= 10; day++) {
    if (rations == 0) {
        System.out.println("Plus de rations au jour " + day + " : on s'arrête.");
        break;
    }
    rations--;
}
```

```
Plus de rations au jour 4 : on s'arrête.
```

**`continue`** abandonne le reste de la répétition en cours et passe à la suivante, sans quitter la boucle :

```java
for (int i = 1; i <= 10; i++) {
    if (i % 5 == 0) {
        continue;
    }
    System.out.print(i + " ");
}
```

```
1 2 3 4 6 7 8 9
```

Avec `break` à la place de `continue`, la boucle s'arrêterait au premier multiple de 5 et n'afficherait que `1 2 3 4`.

> Utilise `break` et `continue` avec modération : une boucle qui s'arrête par sa condition est plus facile à lire qu'une boucle pleine de sorties cachées. Dans un `switch` classique, `break` a un autre rôle : il termine le cas.

## Exercice : chasse au trésor (froid, tiède, chaud)

Un trésor est enterré sur une case numérotée entre 0 et 99. Le joueur propose des numéros jusqu'à trouver le bon. Après chaque essai, le programme indique :

* **« Froid »** si l'écart avec le bon numéro est supérieur à 20 ;
* **« Tiède »** si l'écart est entre 6 et 20 ;
* **« Chaud »** si l'écart est entre 1 et 5 ;
* **« Trouvé ! »** avec le nombre d'essais, si le joueur a deviné.

**Méthode.** Avance par étapes, en testant à chaque fois :

1. Tire le numéro secret : `int treasure = (int) (Math.random() * 100);`.
2. Lis une proposition avec `Scanner` dans une variable `guess`.
3. Calcule l'écart (la « distance ») entre `guess` et `treasure`. Elle doit toujours être positive : si `guess` est supérieur, on fait `guess - treasure`, sinon `treasure - guess`. Tu peux aussi utiliser `Math.abs`.
4. Affiche la bonne indication avec une chaîne `if ... else if ... else`.
5. Ajoute la boucle. Comme on ne sait pas combien d'essais seront nécessaires, c'est un `while`. Introduis un booléen `found` initialisé à `false`, et passe-le à `true` quand l'écart vaut 0.
6. Ajoute un compteur `attempts` incrémenté à chaque tour, et affiche-le à la victoire.

**Solution :**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int treasure = (int) (Math.random() * 100);
        boolean found = false;
        int attempts = 0;

        while (!found) {
            System.out.print("Sur quelle case creuser (0 à 99) ? ");
            int guess = scanner.nextInt();
            attempts++;

            int distance = Math.abs(guess - treasure);

            if (distance > 20) {
                System.out.println("Froid...");
            } else if (distance > 5) {
                System.out.println("Tiède...");
            } else if (distance > 0) {
                System.out.println("Chaud !");
            } else {
                System.out.println("Trouvé ! Il t'a fallu " + attempts + " essais.");
                found = true;
            }
        }

        scanner.close();
    }
}
```

Remarque la chaîne `else if` : comme les conditions sont testées dans l'ordre, `distance > 5` n'est évalué que si `distance > 20` est faux. On n'a donc pas besoin d'écrire « entre 6 et 20 » : c'est la condition précédente qui exclut les valeurs supérieures.

## Exercice : la vigie devine (do/while et dichotomie)

Cette fois, les rôles sont inversés. Tu choisis un numéro de case entre 0 et 99 ; la **vigie** (l'ordinateur) doit le deviner. À chaque proposition, tu réponds par le programme lui-même : il affiche « Trop petit » ou « Trop grand » selon ton numéro.

**Étape 1 : une version naïve.** La vigie propose un nombre au hasard à chaque tour. Le bloc doit s'exécuter au moins une fois : c'est un `do/while`. La condition est `while (guess != secret)`. Attention : `guess` doit être déclaré **avant** le `do`, pour être visible dans le `while`.

**Étape 2 : la vigie devient maligne.** Elle retient deux bornes, `lowerBound` (0 au départ) et `upperBound` (99 au départ), entre lesquelles le numéro se trouve forcément.

* Si la proposition est trop petite, le numéro est au-dessus : `lowerBound = guess + 1`.
* Si elle est trop grande, il est en dessous : `upperBound = guess - 1`.

**Étape 3 : la meilleure stratégie.** Plutôt que le hasard, la vigie propose **toujours le milieu** de l'intervalle : à chaque essai, la moitié des possibilités disparaît. C'est la **recherche par dichotomie**.

**Solution finale :**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Choisis un numéro de case entre 0 et 99 : ");
        int secret = scanner.nextInt();

        int lowerBound = 0;
        int upperBound = 99;
        int guess;
        int attempts = 0;

        do {
            guess = lowerBound + (upperBound - lowerBound) / 2;
            attempts++;
            System.out.println("La vigie propose : " + guess);

            if (guess < secret) {
                System.out.println("Trop petit !");
                lowerBound = guess + 1;
            } else if (guess > secret) {
                System.out.println("Trop grand !");
                upperBound = guess - 1;
            } else {
                System.out.println("Trouvé en " + attempts + " essais !");
            }
        } while (guess != secret);

        scanner.close();
    }
}
```

Avec cette stratégie, la vigie trouve n'importe quel numéro entre 0 et 99 en **7 essais au maximum** : chaque essai divise par deux le nombre de possibilités, et 2⁷ = 128 est la première puissance de 2 qui dépasse 100.

## Exercice : la suite de Fibonacci

La suite de Fibonacci est définie par :

* F(0) = 0
* F(1) = 1
* F(n) = F(n-1) + F(n-2) pour n supérieur ou égal à 2

Ses premiers termes sont : 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...

**Consigne :** demande un rang `rank` à l'utilisateur, puis affiche tous les termes de la suite jusqu'à ce rang, **y compris pour `rank = 0` ou `rank = 1`**.

**Méthode.**

1. Pour calculer un terme, il suffit de connaître **les deux précédents**. On garde donc deux variables : `previous` (F(n-2)) et `current` (F(n-1)).
2. À chaque tour de boucle, on calcule `next = previous + current`, puis on **décale** : `previous` prend l'ancienne valeur de `current`, et `current` prend `next`.
3. On commence avec F(0) = 0 et F(1) = 1, qu'il faut afficher avant la boucle.

**Solution :**

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Rang souhaité : ");
        int rank = scanner.nextInt();

        int previous = 0;
        int current = 1;

        System.out.print(previous);
        if (rank >= 1) {
            System.out.print(" " + current);
        }

        for (int n = 2; n <= rank; n++) {
            int next = previous + current;
            System.out.print(" " + next);
            previous = current;
            current = next;
        }

        System.out.println();
        scanner.close();
    }
}
```

Avec `rank = 10`, le programme affiche :

```
0 1 1 2 3 5 8 13 21 34 55
```

Le terme F(0) est toujours affiché, F(1) seulement si `rank >= 1`, et la boucle ne s'exécute que pour `rank >= 2`. Le programme est donc correct pour tous les rangs, ce qui n'était pas le cas d'une version qui ne gérerait que `rank >= 2`.

> Avec un `int`, la suite dépasse la capacité du type au rang 47 (le résultat devient négatif). Pour aller plus loin, utilise un `long` : il tient jusqu'au rang 92.

## Les erreurs classiques

| Erreur | Exemple | Conséquence |
| --- | --- | --- |
| `=` au lieu de `==` | `if (hull = 0)` | Erreur de compilation. |
| Point-virgule après la condition | `if (hull == 0);` | Le bloc suivant s'exécute toujours. |
| Accolades omises | `if (...) a(); b();` | Seule la première instruction dépend du `if`. |
| Mauvais ordre dans un `else if` | cas général avant le cas précis | Les cas suivants ne sont jamais atteints. |
| `break` oublié dans un `switch` | `case 'N': ...` sans `break` | L'exécution continue dans le `case` suivant. |
| Indice non déclaré | `for (i = 0; ...)` | `cannot find symbol`. |
| Erreur d'un cran | `i <= 5` au lieu de `i < 5` | Une répétition en trop ou en moins. |
| Condition qui ne change jamais | `while (hull > 0)` sans modifier `hull` | Boucle infinie. |
| Variable déclarée dans la boucle, utilisée dans le `while` d'un `do/while` | `do { int x; ... } while (x > 0);` | `cannot find symbol` : la variable n'existe plus au test. |

## À retenir

* `if` exécute un bloc si une condition est vraie. `else` traite le cas contraire. `else if` enchaîne plusieurs cas exclusifs : le premier vrai est exécuté, les autres sont ignorés.
* Mets **toujours les accolades**, même pour une seule instruction.
* `switch` compare une variable à des valeurs précises. Sans `break`, l'exécution continue dans le `case` suivant. La syntaxe `->` (Java 14+) évite ce piège.
* `for` : nombre de répétitions connu. `while` : condition testée avant (peut ne jamais s'exécuter). `do/while` : condition testée après (au moins une exécution).
* Une variable déclarée dans une boucle n'existe que dans cette boucle (portée).
* Une boucle infinie ne plante pas : elle tourne sans fin. Vérifie toujours ce qui rendra la condition fausse.
* `break` arrête la boucle, `continue` passe à la répétition suivante.
* `(int) (Math.random() * n)` donne un entier de 0 à n-1.

## À toi de jouer

1. **Prise du port.** Un navire a `hull`, `rations` et `gold`. Écris une chaîne `if ... else if ... else` qui affiche : « Alerte coque » si `hull <= 3`, sinon « Alerte vivres » si `rations <= 2`, sinon « Alerte or » si `gold < 5`, sinon « Tout va bien ». Teste-la avec plusieurs valeurs. Que se passe-t-il si `hull <= 3` et `rations <= 2` ?
2. **Salves.** Écris une boucle `for` qui affiche « Canon 1 : feu ! » jusqu'au canon 6.
3. **Tempête.** Un navire a 10 points de coque et perd 2 points par vague. Avec une boucle `while`, simule les vagues jusqu'à ce que la coque soit à 0 ou qu'il y ait eu 3 vagues. Combien de vagues subit-il avec 10 points de coque ? Et avec 4 ?
4. **Un menu avec `do/while`.** Affiche un menu de trois choix (1, 2, 3) et redemande tant que le choix n'est pas valide.
5. **Un dé truqué.** Lance un dé à six faces jusqu'à obtenir un 6, en comptant les lancers. Affiche le nombre de lancers.
6. **La grille.** Avec deux boucles imbriquées, affiche une grille de 6 lignes et 8 colonnes de `~`, comme la future carte du jeu.

## Pour aller plus loin

* [Dev.java : les instructions de contrôle de flux](https://dev.java/learn/language/constructs/basics/controlling-flow/) : `if`, `while`, `do/while`, `for`, `break` et `continue`.
* [Dev.java : le `switch` classique](https://dev.java/learn/language-basics/switch-statement/) et [le `switch` expression](https://dev.java/learn/language/constructs/basics/switch-expression/) (syntaxe `->`).
* [Spécification du langage Java : les instructions](https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html) (pour les curieux).
* [Classe `Math`, méthode `random()` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html).
* [Classe `Random` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Random.html).
