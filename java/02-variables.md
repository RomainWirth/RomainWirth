# Les variables

Un programme manipule des informations : le nom d'un navire, les points de coque qui lui restent, le nombre de rations de l'équipage. Pour les garder en mémoire pendant l'exécution, on utilise des **variables**.

## Objectifs

À la fin du chapitre, tu sauras :

* déclarer, initialiser et utiliser une variable ;
* choisir le bon type parmi les huit types primitifs ;
* utiliser le type `String` pour manipuler du texte ;
* nommer correctement tes variables ;
* lire une saisie au clavier avec `Scanner` ;
* repérer les erreurs de débutant les plus fréquentes.

## Qu'est-ce qu'une variable ?

Une variable est un **emplacement de la mémoire** qui porte un nom et contient une valeur. Pendant l'exécution du programme, on peut lire cette valeur, la comparer, la modifier.

Java est un langage **typé** : chaque variable a un type, choisi au moment de sa création, et ce type ne change jamais. Le compilateur s'en sert pour vérifier ton code avant même de l'exécuter.

## Déclaration, initialisation, utilisation

### Déclaration

Déclarer une variable, c'est indiquer son **type** puis son **nom** :

```java
int hull;
```

Cette ligne crée une variable `hull` (la coque d'un navire) qui contiendra un nombre entier (`int`). Le nom d'une variable s'écrit en un seul mot, sans espace.

### Initialisation

Initialiser une variable, c'est lui donner une première valeur avec l'opérateur d'**affectation** `=`. La valeur doit être compatible avec le type déclaré :

```java
hull = 10;
```

> Le signe `=` n'est pas celui des mathématiques. Il se lit « reçoit » : on range la valeur de droite dans la variable de gauche.

### Utilisation

On peut ensuite lire la valeur : pour l'afficher, la comparer, faire un calcul.

```java
System.out.println(hull);
```

Pour afficher un message plus lisible, on met du texte entre guillemets et on le **concatène** avec la valeur grâce à l'opérateur `+` :

```java
System.out.println("Points de coque : " + hull);
```

```
Points de coque : 10
```

### Déclarer et initialiser en une ligne

Le plus souvent, on fait les deux en même temps :

```java
int hull = 10;
```

Le résultat est exactement le même qu'en deux lignes, avec moins de code.

### Pourquoi initialiser avant d'utiliser ?

Une variable locale (déclarée dans une méthode comme `main`) n'a **aucune valeur** tant qu'on ne lui en a pas donné. Java refuse de la lire dans ce cas :

```java
int hull;
System.out.println(hull);
```

```
error: variable hull might not have been initialized
```

Ce n'est pas une question de mémoire gaspillée : le compilateur t'empêche simplement d'utiliser une valeur qui n'existe pas encore.

## Bien nommer ses variables

* Le nom commence par une **minuscule**, puis chaque nouveau mot prend une majuscule : c'est la convention `camelCase` (`shipName`, `maxHull`).
* Il ne contient ni espace ni tiret, et ne commence pas par un chiffre.
* Il ne peut pas être un mot-clé du langage (`class`, `int`, `public`...).
* Il décrit clairement ce que la variable contient : `hull` est meilleur que `h`, `rationCount` meilleur que `x`.
* Java distingue majuscules et minuscules : `hull` et `Hull` sont deux variables différentes.
* Dans ce cours, les noms sont **en anglais**, comme dans tout le code que tu écriras.

Une valeur qui ne doit jamais changer (une **constante**) se déclare avec le mot-clé `final` et un nom en majuscules :

```java
final int MAX_CREW = 8;
```

Une fois initialisée, une variable `final` ne peut plus être modifiée : le compilateur refuse toute nouvelle affectation.

## Les types primitifs

Java propose **8 types primitifs**. Ce sont des mots-clés du langage : ils s'écrivent en un mot, en minuscules, et contiennent directement une valeur simple (ce ne sont pas des objets).

### Les nombres entiers

Quatre types permettent de stocker des entiers. Ils ne diffèrent que par la place qu'ils occupent en mémoire, donc par l'intervalle de valeurs possibles :

| Type | Taille | Valeurs possibles |
| --- | --- | --- |
| `byte` | 8 bits (1 octet) | de -128 à 127 |
| `short` | 16 bits (2 octets) | de -32 768 à 32 767 |
| `int` | 32 bits (4 octets) | environ de -2,1 milliards à 2,1 milliards |
| `long` | 64 bits (8 octets) | environ de -9,2 × 10¹⁸ à 9,2 × 10¹⁸ |

Pourquoi -128 à 127 pour un `byte` ? Avec 8 bits, on peut former 2⁸ = 256 combinaisons. Comme on veut des valeurs négatives et positives, ces 256 valeurs sont réparties de -128 à 127.

```java
byte crewCount = 4;
short cannonballs = 1200;
int gold = 10;
long treasureValue = 9876543210L;
```

Quelques règles à retenir :

* Hors de l'intervalle, le code ne compile pas : `byte crewCount = 128;` est refusé.
* Un nombre entier écrit dans le code est **toujours un `int`** pour le compilateur. Pour une valeur qui dépasse la capacité d'un `int`, il faut ajouter le suffixe `L` : `9876543210L`. Le `l` minuscule est admis, mais il ressemble à un `1` : on utilise toujours `L`.
* Dans la pratique, on utilise `int` pour la grande majorité des entiers, et `long` quand les valeurs sont très grandes.
* Si on dépasse la valeur maximale d'un type pendant un calcul, Java ne signale aucune erreur : le résultat « fait le tour » et devient négatif. On en reparle avec les opérateurs.

### Les nombres décimaux

Deux types permettent de stocker des nombres à virgule :

| Type | Taille | Précision approximative |
| --- | --- | --- |
| `float` | 32 bits | environ 7 chiffres significatifs |
| `double` | 64 bits | environ 15 chiffres significatifs |

Les deux suivent la norme IEEE 754 : le nombre est stocké sous forme de mantisse et d'exposant, et non en « partie entière » et « partie décimale ».

Dans le code, la virgule décimale s'écrit avec un **point** : `7.5`.

Un nombre décimal écrit dans le code est **toujours un `double`**. Pour le ranger dans un `float`, il faut donc ajouter le suffixe `F`, sinon le compilateur refuse (il ne veut pas perdre de précision sans qu'on le lui demande) :

```java
float speedKnots = 7.5F;
double latitude = 45.8992;
```

On utilise le plus souvent `double`.

> Les décimaux sont stockés de manière approchée : `0.1 + 0.2` ne donne pas exactement `0.3`. Pour des montants d'argent, on évite `float` et `double`. Dans notre jeu, l'or est un nombre entier de pièces, ce qui règle le problème.

### Le booléen

Le type `boolean` ne peut prendre que deux valeurs : `true` ou `false`. Il sert à représenter une réponse oui/non.

```java
boolean isSunk = false;
```

> Il ne faut pas parler de « 0 » ou de « 1 » : en Java, `true` et `false` ne sont pas des nombres, et on ne peut pas écrire `boolean b = 1;`. La place réellement occupée en mémoire n'est d'ailleurs pas fixée par le langage.

### Le caractère

Le type `char` contient **un seul caractère**, écrit entre **apostrophes** simples `'` :

```java
char rankInitial = 'C';
```

Un `char` occupe 16 bits et contient en réalité le code numérique du caractère dans le codage Unicode (UTF-16). Certains symboles, comme les émojis, ne tiennent pas dans un seul `char`.

On n'utilise **pas** les mêmes guillemets pour un caractère (`'C'`) et pour du texte (`"Capitaine"`).

## Le type `String`

Pour du texte (un nom, une phrase), on utilise le type `String`.

`String` n'est **pas** un type primitif. C'est une **classe** de la bibliothèque standard de Java : c'est pourquoi elle s'écrit avec une majuscule, contrairement à `int` ou `boolean`. Elle est disponible dans tous les programmes sans rien importer.

```java
String shipName = "Corbeau Noir";
System.out.println(shipName);
```

Le texte s'écrit entre **guillemets doubles** `"`.

> Attention à l'erreur classique : `string` en minuscules n'existe pas. Il faut écrire `String`.

### Variable de type primitif et variable de type classe

Les deux sont des variables, mais elles ne contiennent pas la même chose :

* une variable de type primitif (`int hull`) **contient directement la valeur** ;
* une variable de type classe (`String shipName`) **désigne un objet**, c'est-à-dire un élément plus riche qui possède ses propres fonctionnalités. On approfondira cette distinction dans les chapitres sur les objets.

### Utiliser les méthodes d'un objet

Un objet apporte des fonctionnalités, appelées **méthodes**, qu'on appelle avec l'opérateur point `.` suivi du nom de la méthode et de parenthèses :

```java
String shipName = "Corbeau Noir";
int length = shipName.length();
System.out.println(length);
```

```
12
```

`length()` renvoie le nombre de caractères du texte (ici 12, l'espace compte). Dans l'IDE, taper `shipName.` ouvre la liste de toutes les méthodes disponibles : n'hésite pas à la parcourir.

### Concaténer des textes

L'opérateur `+` colle deux textes bout à bout et fabrique un **nouveau** texte :

```java
String captainName = "Barbe-Rouge";
String message = "Le capitaine " + captainName + " commande le " + shipName + ".";
System.out.println(message);
```

```
Le capitaine Barbe-Rouge commande le Corbeau Noir.
```

Fais attention aux espaces : ils font partie du texte, donc il faut les écrire toi-même à l'intérieur des guillemets.

> La classe `String` propose de nombreuses autres méthodes (`toUpperCase()`, `substring(...)`, `equals(...)`...). On en découvrira plusieurs au fil du cours. La documentation officielle de la classe est listée en fin de chapitre.

## Un premier exercice : permuter deux valeurs

Deux navires se sont échangé leur cargaison d'or. Comment échanger les valeurs de deux variables ?

Voici le début du programme :

```java
public class Main {
    public static void main(String[] args) {
        int firstShipGold = 25;
        int secondShipGold = 8;

        System.out.println("Avant l'échange : " + firstShipGold + " et " + secondShipGold);

        // à toi de jouer

        System.out.println("Après l'échange : " + firstShipGold + " et " + secondShipGold);
    }
}
```

**Consigne :** sans écrire directement `25` ni `8` à l'étape de l'échange, écris les instructions qui permutent les valeurs de `firstShipGold` et `secondShipGold`. L'affichage final doit être « 8 et 25 ».

**Réfléchis 10 minutes** avant de lire la suite. Pourquoi les deux lignes suivantes ne fonctionnent-elles pas ?

```java
firstShipGold = secondShipGold;
secondShipGold = firstShipGold;
```

**Solution.** Après la première ligne, la valeur d'origine de `firstShipGold` est écrasée : elle est perdue. Il faut la mettre de côté dans une troisième variable avant de l'écraser :

```java
int savedGold = firstShipGold;
firstShipGold = secondShipGold;
secondShipGold = savedGold;
```

C'est le principe d'une permutation : on a besoin d'un récipient temporaire, comme quand on échange le contenu de deux tonneaux.

**Pour aller plus loin :** refais l'exercice avec deux variables de type `String` (les noms des navires).

## Lire une saisie au clavier avec `Scanner`

Jusqu'ici, les valeurs étaient écrites dans le code. Pour qu'un programme interagisse avec l'utilisateur, on peut lire ce qu'il tape dans la console avec la classe `Scanner`.

* `Scanner` se trouve dans le package `java.util`. Contrairement à `String`, il faut donc l'**importer** en haut du fichier avec `import java.util.Scanner;`.
* On crée un `Scanner` branché sur le clavier (`System.in`) :

```java
Scanner scanner = new Scanner(System.in);
```

* On lit ensuite les valeurs avec des méthodes dédiées :

| Méthode | Lit | Type renvoyé |
| --- | --- | --- |
| `nextLine()` | toute la ligne tapée, jusqu'à `Entrée` | `String` |
| `next()` | le prochain mot (jusqu'au prochain espace) | `String` |
| `nextInt()` | un nombre entier | `int` |
| `nextDouble()` | un nombre décimal | `double` |

Exemple complet :

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Nom du capitaine : ");
        String captainName = scanner.nextLine();

        System.out.print("Points de coque du navire : ");
        int hull = scanner.nextInt();

        System.out.println("Le capitaine " + captainName + " prend la mer avec " + hull + " points de coque.");

        scanner.close();
    }
}
```

Exécution (l'utilisateur tape `Barbe-Rouge` puis `10`) :

```
Nom du capitaine : Barbe-Rouge
Points de coque du navire : 10
Le capitaine Barbe-Rouge prend la mer avec 10 points de coque.
```

Quelques remarques :

* `print` affiche sans passer à la ligne, ce qui permet de saisir la réponse juste après la question. `println` passe à la ligne.
* On utilise `nextLine()` pour le nom, car un nom comme « Jack le Borgne » contient des espaces : `next()` ne lirait que « Jack ».
* Si l'utilisateur tape du texte alors que le programme attend un nombre (`nextInt()`), le programme s'arrête avec une erreur `InputMismatchException`. On apprendra à gérer ce cas avec les exceptions.
* `scanner.close()` libère le `Scanner` quand on n'en a plus besoin.

> **Piège classique.** Si tu lis un nombre avec `nextInt()` **puis** du texte avec `nextLine()`, la lecture du texte renverra une ligne vide. En effet, `nextInt()` lit le nombre mais laisse le retour à la ligne (`Entrée`) dans la saisie, et `nextLine()` le consomme immédiatement. Dans l'exemple ci-dessus, on lit d'abord le texte puis le nombre, ce qui évite le problème. Si tu dois lire le texte après le nombre, ajoute un `scanner.nextLine();` pour vider la ligne.

## Les erreurs classiques

Une erreur de syntaxe empêche la compilation : l'IDE la souligne en rouge et il faut la corriger avant de continuer. Voici les plus fréquentes :

| Erreur | Exemple | Explication |
| --- | --- | --- |
| Point-virgule oublié | `int hull = 10` | Le compilateur ne sait pas où l'instruction se termine. |
| Mauvais type de valeur | `int hull = "dix";` | On ne peut pas ranger du texte dans un `int`. |
| `+` oublié dans une concaténation | `"Coque : " hull` | Deux éléments se suivent sans opérateur. |
| Guillemets mal placés | `"hull"` au lieu de `hull` | Le premier affiche le mot « hull », le second sa valeur. |
| Espaces oubliés | `"Coque:" + hull` | Le texte affiché sera collé à la valeur. |
| Variable non initialisée | `int hull;` puis lecture | Voir plus haut : `might not have been initialized`. |
| Valeur hors limite | `byte b = 128;` | Dépasse la capacité du type. |
| `string` au lieu de `String` | `string name = "Jack";` | Le type est une classe : majuscule obligatoire. |
| Faute de frappe sur un nom | `hul` au lieu de `hull` | `cannot find symbol` : l'autocomplétion de l'IDE évite ce genre d'erreur. |

Appuie-toi sur ton IDE : il est un allié, avec ses suggestions de noms et ses soulignements d'erreurs. Et lis toujours le message d'erreur en entier.

## À retenir

* Une variable est un emplacement de mémoire nommé, avec un type fixe.
* Les trois étapes : **déclaration**, **initialisation**, **utilisation**. On peut déclarer et initialiser en une seule ligne.
* Une variable locale doit être initialisée avant d'être lue.
* Il existe 8 types primitifs : `byte`, `short`, `int`, `long` (entiers), `float`, `double` (décimaux), `boolean` (vrai ou faux), `char` (un caractère).
* Un entier écrit dans le code est un `int` (suffixe `L` pour un `long`), un décimal est un `double` (suffixe `F` pour un `float`).
* `String` est une classe, pas un type primitif. Le texte s'écrit entre `"`, un caractère entre `'`.
* Les noms de variables sont en `camelCase` et en anglais ; une constante se déclare avec `final`.
* `Scanner` lit les saisies au clavier. `nextLine()` lit une ligne, `nextInt()` un entier.

## À toi de jouer

1. Déclare des variables pour décrire un navire : son nom (`String`), ses points de coque (`int`), sa vitesse (`double`), son état coulé ou non (`boolean`) et l'initiale de son type (`char`). Affiche une phrase qui les utilise toutes.
2. Que se passe-t-il si tu écris `byte crewCount = 130;` ? Et `float speedKnots = 7.5;` ? Note les messages d'erreur et corrige.
3. Écris un programme qui demande le nom d'un navire puis ses rations de départ, et qui affiche un message de bienvenue complet.
4. Dans l'exemple avec `Scanner`, inverse l'ordre : demande d'abord les points de coque (`nextInt()`), puis le nom (`nextLine()`). Que constates-tu ? Corrige le programme.

## Pour aller plus loin

* [Dev.java : les bases du langage](https://dev.java/learn/language/constructs/basics/) (variables, types, règles de nommage).
* [Dev.java : créer des variables de type primitif](https://dev.java/learn/creating-primitive-type-variables-in-your-programs/index.html).
* [Classe `String` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html).
* [Classe `Scanner` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html).
