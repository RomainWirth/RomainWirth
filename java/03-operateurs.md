# Les opérateurs

Une fois les informations stockées dans des variables, il faut pouvoir les manipuler : calculer les dégâts d'un tir, mettre à jour les rations de l'équipage, savoir si un navire peut fuir. Pour cela, on utilise des **opérateurs**.

Un opérateur est un symbole qui agit sur une ou plusieurs valeurs (les **opérandes**) et **produit un résultat**. Ce résultat peut être rangé dans une variable, affiché ou réutilisé dans un autre calcul.

## Objectifs

À la fin du chapitre, tu sauras :

* faire des calculs avec les opérateurs arithmétiques, y compris la division entière et le modulo ;
* comprendre comment Java traite des types différents dans un même calcul, et convertir un type en un autre (transtypage) ;
* modifier une variable avec les opérateurs d'affectation et les opérateurs unaires ;
* comparer des valeurs et combiner des conditions avec les opérateurs logiques ;
* prévoir l'ordre d'évaluation d'une expression.

## Les opérateurs arithmétiques

### Addition et soustraction : `+` et `-`

```java
int cannons = 10;
int newCannons = 5;

int total = cannons + newCannons;
int remaining = cannons - newCannons;

System.out.println(total);      // 15
System.out.println(remaining);  // 5
```

Le résultat d'une opération doit être **rangé dans une variable** (ou utilisé directement, par exemple dans un `println`), sinon il est perdu.

### Multiplication et division : `*` et `/`

```java
int barrels = 10;
int trips = 5;

int product = barrels * trips;
int quotient = barrels / trips;

System.out.println(product);   // 50
System.out.println(quotient);  // 2
```

**Attention : la division de deux entiers donne un entier.** La partie décimale est simplement supprimée, sans arrondi :

```java
System.out.println(42 / 20);  // 2, et non 2.1
System.out.println(7 / 2);    // 3, et non 3.5
```

On parle de **division entière**.

> Diviser un entier par `0` provoque une erreur à l'exécution : `ArithmeticException: / by zero`. Avec des nombres décimaux, le résultat est `Infinity` (ou `NaN` pour `0.0 / 0.0`), sans erreur.

### Le modulo : `%`

Le modulo donne le **reste** d'une division entière.

```java
int barrels = 47;
int perTrip = 8;

System.out.println(barrels / perTrip);  // 5 : voyages complets
System.out.println(barrels % perTrip);  // 7 : tonneaux restants
```

47 tonneaux à embarquer, 8 par voyage : cela fait 5 voyages complets (5 × 8 = 40), et il reste 7 tonneaux. C'est exactement la question que posera la première itération du kit.

Le reste est toujours plus petit que le diviseur. Cela donne une astuce classique : le reste d'une division **par 2** vaut 0 ou 1, ce qui permet de tester la parité d'un nombre.

```java
int gold = 25;
boolean isEven = gold % 2 == 0;
System.out.println(isEven);  // false
```

> Pour un nombre négatif, le reste est négatif aussi : `-5 % 2` donne `-1`. Pour tester qu'un nombre est impair, il vaut donc mieux écrire `n % 2 != 0` que `n % 2 == 1`.

## Des types différents dans un même calcul

### La règle : le plus « large » l'emporte

Quand une opération mélange plusieurs types numériques, Java convertit automatiquement les opérandes vers le type le plus large avant de calculer :

* `int` avec `long` : le résultat est un `long` ;
* `int` avec `double` : le résultat est un `double` ;
* `byte` ou `short` : ils sont toujours convertis en `int` avant le calcul, donc `byte + byte` donne un `int`.

```java
double speedKnots = 7.5;
int crew = 4;
double result = speedKnots * crew;  // 30.0
```

### Le piège de la division entière

Ranger un résultat dans un `double` ne suffit pas à obtenir une division décimale. La division est effectuée **avant** la conversion, en nombres entiers :

```java
int sum = 25 + 8;
double average = sum / 2;
System.out.println(average);  // 16.0 et non 16.5
```

Le calcul `33 / 2` donne `16` (division entière), et ce `16` est ensuite converti en `16.0`.

Pour obtenir `16.5`, il faut qu'**au moins un des deux opérandes** soit décimal **au moment de la division**. On a trois solutions :

```java
double a = (double) sum / 2;  // 16.5 : on convertit sum en double
double b = sum / 2.0;         // 16.5 : on écrit 2 comme un décimal
double c = sum * 1.0 / 2;     // 16.5 : moins lisible, à éviter
```

### Le transtypage (cast)

Écrire un type entre parenthèses devant une valeur, comme `(double) sum`, s'appelle un **transtypage** ou **cast**. Cela produit une valeur du nouveau type, utilisée pour le calcul. **La variable d'origine n'est pas modifiée** : `sum` reste un `int`.

Attention à l'endroit où l'on place le cast :

```java
int a = 42;
int b = 5;

System.out.println((double) a / b);    // 8.4 : a est converti, puis la division est décimale
System.out.println((double) (a / b));  // 8.0 : la division entière est faite d'abord !
```

Le cast s'applique à ce qui le suit immédiatement : ici `a` dans le premier cas, `(a / b)` dans le second.

### Conversion vers un type plus petit

Dans l'autre sens, on peut forcer une conversion vers un type plus petit, mais on **perd de l'information** :

```java
double speedKnots = 7.9;
int roundedDown = (int) speedKnots;  // 7 : la partie décimale est supprimée, pas arrondie
```

Java refuse cette conversion sans cast explicite, pour que tu en sois conscient : `int x = 7.9;` ne compile pas.

## Le dépassement de capacité

Chaque type a des valeurs limites. Quand un calcul les dépasse, Java **ne signale aucune erreur** : le résultat « fait le tour » :

```java
int max = Integer.MAX_VALUE;  // 2 147 483 647
System.out.println(max + 1);  // -2147483648
```

Ce comportement est la source de bugs silencieux. Si le dépassement est possible, on utilise un `long`, ou la méthode `Math.addExact`, qui lève une `ArithmeticException` (`integer overflow`) en cas de dépassement.

De même, les décimaux sont approchés :

```java
System.out.println(0.1 + 0.2);  // 0.30000000000000004
```

On ne compare donc jamais deux décimaux avec `==` après un calcul, et on évite `float` et `double` pour des montants d'argent.

## Concaténer du texte avec des nombres

L'opérateur `+` sert aussi à coller du texte (chapitre précédent). Quand il mélange texte et nombre, le nombre est converti en texte. **L'ordre compte**, car l'expression est évaluée de gauche à droite :

```java
System.out.println("Coque : " + 1 + 2);  // Coque : 12
System.out.println(1 + 2 + " tonneaux");  // 3 tonneaux
```

Dans le premier cas, `"Coque : " + 1` donne un texte, auquel on ajoute `2` : le résultat est « Coque : 12 ». Dans le second, `1 + 2` est d'abord calculé (3), puis converti en texte. Pour forcer un calcul dans un message, on utilise des parenthèses :

```java
System.out.println("Total : " + (1 + 2));  // Total : 3
```

## Les opérateurs d'affectation

L'opérateur `=` **range** une valeur dans une variable. Cette valeur peut être le résultat d'un calcul qui utilise la valeur actuelle de la variable :

```java
int hull = 10;
hull = hull - 3;
System.out.println(hull);  // 7
```

On peut changer la valeur d'une variable autant de fois que l'on veut : la nouvelle valeur remplace l'ancienne.

Pour ne pas répéter le nom de la variable, il existe des **opérateurs d'affectation composés** :

| Opérateur | Équivalent à | Exemple |
| --- | --- | --- |
| `+=` | `x = x + y` | `rations += 4;` |
| `-=` | `x = x - y` | `hull -= damage;` |
| `*=` | `x = x * y` | `gold *= 2;` |
| `/=` | `x = x / y` | `gold /= 2;` |
| `%=` | `x = x % y` | `index %= 8;` |

```java
int hull = 10;
int damage = 3;
hull -= damage;  // hull vaut maintenant 7
```

Ils sont très courants dans un jeu : mettre à jour une coque ou un stock de rations avec `-=` et `+=` est plus lisible que la forme longue. L'important est que la ligne reste facile à comprendre.

## Les opérateurs unaires

Un opérateur **unaire** n'a qu'un seul opérande.

### L'incrémentation et la décrémentation : `++` et `--`

Ajouter 1 à une variable est tellement courant que Java a un opérateur dédié :

```java
int turn = 0;
turn = turn + 1;  // forme longue
turn += 1;        // forme composée
turn++;           // opérateur d'incrémentation
```

Les trois lignes font la même chose. `--` retire 1 de la même façon.

Ces opérateurs existent en deux versions, qui diffèrent quand on utilise leur **résultat** :

* **post-incrémentation** `x++` : renvoie l'ancienne valeur, puis incrémente ;
* **pré-incrémentation** `++x` : incrémente, puis renvoie la nouvelle valeur.

```java
int x = 0;
int result = x++;
System.out.println(x);       // 1
System.out.println(result);  // 0 : on a récupéré l'ancienne valeur

x = 0;
result = ++x;
System.out.println(x);       // 1
System.out.println(result);  // 1 : on a récupéré la nouvelle valeur
```

Même principe pour la décrémentation :

```java
int x = 10;
int result = x--;  // post-décrémentation : result vaut 10, x vaut 9
x = 10;
result = --x;      // pré-décrémentation : result vaut 9, x vaut 9
```

> Pour rester lisible, on utilise `++` et `--` sur une **ligne à part** (`turn++;`) et on évite de récupérer leur résultat dans une autre expression.

### L'opérateur négatif `-`

Placé devant une valeur, `-` renvoie son opposé. La variable d'origine ne change pas.

```java
int speed = 10;
int reverse = -speed;
System.out.println(speed);    // 10
System.out.println(reverse);  // -10
```

## Les opérateurs de comparaison

Ils comparent deux valeurs et renvoient un **`boolean`** : `true` ou `false`.

| Opérateur | Signification |
| --- | --- |
| `==` | égal à |
| `!=` | différent de |
| `>` | strictement supérieur à |
| `>=` | supérieur ou égal à |
| `<` | strictement inférieur à |
| `<=` | inférieur ou égal à |

```java
int hull = 10;
int maxHull = 10;

System.out.println(hull > 5);         // true
System.out.println(hull >= maxHull);  // true
System.out.println(hull < maxHull);   // false
System.out.println(hull != 0);        // true
```

> **Ne confonds pas `=` et `==`.** Un seul `=` **range** une valeur, deux `==` **comparent**. L'écriture `if (hull = 5)` est une erreur de débutant classique.

> **Attention pour les textes.** `==` fonctionne comme prévu pour les types primitifs. Il ne faut **pas** l'utiliser pour comparer le contenu de deux `String` : on utilise pour cela la méthode `equals`, que l'on étudiera avec les objets.

## Les opérateurs logiques

Ils combinent des `boolean` et renvoient un `boolean`.

### Le NON : `!`

Il inverse la valeur :

```java
boolean isSunk = false;
boolean isAfloat = !isSunk;  // true
```

### Le ET : `&&`

Le résultat est vrai **si les deux** conditions sont vraies :

| a | b | `a && b` |
| --- | --- | --- |
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

### Le OU : `||`

Le résultat est vrai **si au moins une** des deux conditions est vraie :

| a | b | `a \|\| b` |
| --- | --- | --- |
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

Exemple : dans notre jeu, un navire peut tenter de fuir s'il a assez de vitesse et s'il lui reste des rations.

```java
int speed = 4;
int rations = 6;
boolean canFlee = speed >= 3 && rations > 0;
System.out.println(canFlee);  // true
```

Pour savoir si un navire est en danger, on peut combiner deux situations :

```java
int hull = 3;
boolean isInDanger = hull <= 3 || rations == 0;
```

### L'évaluation en court-circuit

Les opérateurs `&&` et `||` évaluent leurs opérandes **de gauche à droite et s'arrêtent dès que le résultat est connu** :

* avec `&&`, si la partie gauche est `false`, le résultat est forcément `false` : la partie droite n'est **pas évaluée** ;
* avec `||`, si la partie gauche est `true`, le résultat est forcément `true` : la partie droite n'est **pas évaluée**.

C'est très utile pour se protéger d'une erreur :

```java
int crew = 0;
int rations = 10;

boolean enoughRations = crew > 0 && rations / crew >= 2;
System.out.println(enoughRations);  // false, sans erreur
```

Comme `crew > 0` est faux, la division `rations / crew` n'est jamais exécutée, ce qui évite une division par zéro. L'ordre des conditions a donc de l'importance.

> Il existe aussi les opérateurs `&` et `|` (un seul symbole), qui évaluent **toujours** les deux côtés. On les utilise très rarement avec des booléens. Dans cet exemple, remplacer `&&` par `&` provoquerait une `ArithmeticException`.

## La priorité des opérateurs

Quand plusieurs opérateurs apparaissent dans la même expression, Java respecte un ordre de priorité, du plus prioritaire au moins prioritaire :

1. les opérateurs unaires (`!`, `-`, `++`, `--`) et les casts ;
2. `*`, `/`, `%` ;
3. `+`, `-` ;
4. `<`, `<=`, `>`, `>=` ;
5. `==`, `!=` ;
6. `&&` ;
7. `||` ;
8. les affectations (`=`, `+=`, etc.).

```java
System.out.println(1 + 2 * 3);    // 7 : la multiplication passe avant
System.out.println((1 + 2) * 3);  // 9 : les parenthèses forcent l'ordre
System.out.println(true || false && false);  // true : && passe avant ||
```

Plutôt que d'apprendre le tableau par coeur, on met des **parenthèses** dès qu'une expression n'est pas évidente. Elles ne coûtent rien et évitent les erreurs de lecture.

## Quelques opérations utiles : la classe `Math`

Les opérateurs ne couvrent pas tous les calculs. La classe `Math`, disponible sans import, fournit des méthodes courantes :

| Méthode | Rôle | Exemple |
| --- | --- | --- |
| `Math.max(a, b)` | le plus grand des deux | `Math.max(0, -3)` donne `0` |
| `Math.min(a, b)` | le plus petit des deux | `Math.min(3, 7)` donne `3` |
| `Math.abs(x)` | la valeur absolue | `Math.abs(-4)` donne `4` |
| `Math.pow(a, b)` | a à la puissance b (renvoie un `double`) | `Math.pow(2, 3)` donne `8.0` |
| `Math.sqrt(x)` | la racine carrée (renvoie un `double`) | `Math.sqrt(16)` donne `4.0` |
| `Math.round(x)` | l'arrondi à l'entier le plus proche | `Math.round(2.5)` donne `3` |

Un exemple tiré du jeu : les dégâts d'un tir valent `puissance de feu + dé - 4`, mais jamais moins de 0.

```java
int firepower = 3;
int dice = 2;  // le dé sera tiré au hasard dans une itération ultérieure
int damage = Math.max(0, firepower + dice - 4);
System.out.println(damage);  // 1
```

Avec `firepower = 3` et `dice = 1`, le calcul donne exactement `0`. Avec `firepower = 2` et `dice = 1`, il donnerait `-1` : `Math.max` le ramène à `0`, et un tir raté ne soigne donc jamais l'ennemi.

## Exercice : somme et moyenne

Deux navires ont des points de coque différents. On veut calculer leur total et leur moyenne.

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Points de coque du premier navire : ");
        int firstHull = scanner.nextInt();

        System.out.print("Points de coque du second navire : ");
        int secondHull = scanner.nextInt();

        int sum = firstHull + secondHull;
        System.out.println("À eux deux, les navires ont " + sum + " points de coque.");

        int average = sum / 2;
        System.out.println("Moyenne : " + average);

        scanner.close();
    }
}
```

Exécution avec `10` et `7` :

```
Points de coque du premier navire : 10
Points de coque du second navire : 7
À eux deux, les navires ont 17 points de coque.
Moyenne : 8
```

La moyenne exacte est 8,5, mais le programme affiche `8`. **Réfléchis 5 minutes** : pourquoi, et comment l'obtenir correctement ?

**Solution.** `sum / 2` est une division entière, donc la partie décimale est perdue. Il faut qu'un des opérandes soit un `double` :

```java
double average = (double) sum / 2;
System.out.println("Moyenne : " + average);  // Moyenne : 8.5
```

Le programme est ainsi correct pour une somme paire comme pour une somme impaire.

## Exercice : parité, comparaison et conditions

Avec les mêmes saisies, ajoute les lignes suivantes à ton programme et vérifie les résultats :

```java
boolean isEven = firstHull % 2 == 0;
boolean isFirstStronger = firstHull > secondHull;
boolean areBothHealthy = firstHull > 5 && secondHull > 5;

System.out.println("Coque du premier navire paire ? " + isEven);
System.out.println("Le premier navire a-t-il plus de coque ? " + isFirstStronger);
System.out.println("Les deux navires sont-ils en bon état (plus de 5) ? " + areBothHealthy);
```

Avec `10` et `7`, tu dois obtenir `true`, `true` et `true`.

## À retenir

* Un opérateur produit un résultat à partir d'une ou plusieurs valeurs.
* `/` entre deux entiers est une **division entière**. `%` donne le reste.
* Dans un calcul mélangeant plusieurs types, le plus large l'emporte. Pour une division décimale, convertir **avant** la division : `(double) sum / 2`.
* Un cast ne modifie pas la variable d'origine, et réduire un type fait perdre de l'information.
* Les dépassements de capacité ne provoquent pas d'erreur : le résultat « fait le tour ».
* `x++` renvoie l'ancienne valeur, `++x` la nouvelle. `+=`, `-=`, `*=`, `/=`, `%=` raccourcissent les affectations.
* Les comparaisons (`==`, `!=`, `<`, `<=`, `>`, `>=`) renvoient un `boolean`. Ne confonds pas `=` et `==`.
* `&&` et `||` s'arrêtent dès que le résultat est connu (court-circuit).
* En cas de doute sur l'ordre des opérations, utilise des parenthèses.

## À toi de jouer

1. **Charger la chaloupe.** Il y a 47 tonneaux de rhum à charger, 8 par voyage. Affiche le nombre de voyages complets et le nombre de tonneaux restants. Comment calculer le nombre total de voyages, en comptant le dernier voyage incomplet ? (Indice : tu auras besoin d'une condition, qu'on verra dans le chapitre suivant.)
2. **Partage du butin.** Un équipage de 7 pirates se partage 100 pièces d'or de façon égale. Combien chacun reçoit-il ? Combien de pièces restent pour le capitaine ?
3. **Vitesse moyenne.** Un navire a parcouru 17 milles en 4 jours. Calcule la moyenne par jour **sans** perdre la partie décimale.
4. **Peut-il fuir ?** Écris une expression booléenne qui est vraie quand un navire a une vitesse d'au moins 3 **et** qu'il lui reste au moins 1 ration, **ou** quand sa coque est supérieure à 8.
5. **Dégâts.** Avec `firepower = 5` et un dé qui vaut 1, puis 6, calcule `Math.max(0, firepower + dice - 4)`. Que se passe-t-il avec `firepower = 3` et un dé qui vaut 1 ?

## Pour aller plus loin

* [Dev.java : utiliser les opérateurs](https://dev.java/learn/language-basics/using-operators/).
* [Dev.java : récapitulatif des opérateurs](https://dev.java/learn/language/constructs/basics/all-operators/), avec le tableau de priorité.
* [Classe `Math` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html).
* [Spécification du langage Java : conversions et promotions numériques](https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html) (pour les curieux).
