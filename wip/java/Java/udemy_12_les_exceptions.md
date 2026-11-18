# Les exceptions

## Le principe d'exception

### Définition

Une **exception** est une erreur qui se produit **à l'exécution** du programme. Il faut la distinguer d'une erreur de compilation :

| | Erreur de compilation | Exception |
|---|---|---|
| Moment | avant l'exécution, à la compilation | pendant l'exécution, par la machine virtuelle |
| Cause | le code est syntaxiquement incorrect | une instruction ne peut pas s'exécuter (division par zéro, saisie invalide...) |
| Conséquence | le fichier ne compile pas | le programme s'arrête brutalement |

Une exception est donc particulièrement désagréable : le code a compilé, il peut fonctionner une première fois, puis planter à la fois suivante avec d'autres valeurs.

Quand une exception est lancée et n'est pas traitée, le programme **s'arrête immédiatement** : tout le code écrit après l'instruction fautive **n'est pas exécuté**. C'est dangereux, car certaines opérations (fermeture d'une ressource, sauvegarde, affichage de fin) ne sont jamais faites.

### Un exemple : la division par zéro

```java
Scanner scanner = new Scanner(System.in);
System.out.println("Début du programme");

System.out.print("Saisir a : ");
int a = scanner.nextInt();
System.out.print("Saisir b : ");
int b = scanner.nextInt();

int result = a / b;
System.out.println("Le résultat de la division de " + a + " par " + b + " est " + result);

scanner.close();
System.out.println("Fin du programme");
```

Ce code compile. Selon les valeurs saisies :

- `12` et `4` : résultat `3`, le programme va jusqu'au bout ;
- `12` et `5` : résultat `2` (division entière), le programme va jusqu'au bout ;
- `12` et `0` : le programme **plante**. Ni le résultat ni « Fin du programme » ne s'affichent, et le scanner n'est jamais fermé.

Il faut toujours commencer par tester un cas qui fonctionne, puis un cas qui provoque l'erreur.

### Lire la trace d'une exception

Quand une exception n'est pas attrapée, sa **trace** s'écrit dans la console (en rouge dans IntelliJ) :

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Main.main(Main.java:19)
```

On y trouve :

- le **type** de l'exception : `ArithmeticException` ;
- son **message** : `/ by zero` (division par zéro) ;
- la **méthode** et la **ligne exacte** où l'erreur s'est produite (`main`, ligne 19). Le lien est cliquable dans l'IDE.

Une exception est un **objet** Java : elle est créée, puis **lancée**.

## Surveiller et attraper : `try` / `catch`

### Principe

Un bloc `try` (« tenter ») entoure le code qui peut échouer. Si une exception est lancée dans ce bloc, un bloc `catch` correspondant l'**attrape** :

```java
try {
    int result = a / b;
    System.out.println("Le résultat est " + result);
} catch (ArithmeticException e) {
    System.out.println("Erreur lors de la division : impossible de diviser par zéro");
}

scanner.close();
System.out.println("Fin du programme");
```

- Entre les parenthèses du `catch` : le **type** de l'exception et le **nom** de l'objet exception (`e`).
- **Aucune exception** dans le `try` : le bloc `catch` est **ignoré**.
- **Une exception** dans le `try` : l'exécution du `try` s'interrompt à l'instruction fautive (la suite du bloc n'est pas exécutée), puis le `catch` s'exécute.
- Dans tous les cas, le programme **continue après le `catch`** : le scanner se ferme, « Fin du programme » s'affiche.

### Portée des variables

Une variable déclarée dans le bloc `try` est **locale à ce bloc**. C'est pourquoi l'affichage du résultat a été déplacé à l'intérieur du `try` : si la division échoue, la variable n'est même pas initialisée.

### Le type d'exception dans le `catch`

- Si on attrape un autre type d'exception que celui lancé, il n'y a plus de `catch` correspondant : le programme plante de nouveau.
- On peut attraper la classe **`Exception`**, mère de toutes les exceptions. C'est le polymorphisme : là où la mère est attendue, n'importe quelle fille convient. N'importe quelle exception sera donc attrapée.

### Le `catch` doit apporter une solution

Un `catch` n'est pas là pour faire taire l'erreur. Un simple affichage ne corrige rien. On peut, par exemple, redemander la saisie de `b` dans une boucle, jusqu'à ce qu'elle soit valide.

### Utiliser l'objet exception

L'objet reçu par le `catch` donne des informations :

```java
try {
    ...
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());   // "/ by zero"
    e.printStackTrace();                  // écrit la trace complète dans la console
}
```

`printStackTrace()` écrit en rouge la trace (type, message, pile d'appels) **même si l'exception a été attrapée**. Le rouge ne veut donc pas dire que le programme a planté : c'est utile pendant le développement pour voir une exception qui a pourtant été traitée.

## Propagation et pile d'appels

Plaçons la division dans une méthode :

```java
public static int divide(int value1, int value2) {
    return value1 / value2;
}
```

Si `divide(12, 0)` est appelée depuis `main`, la trace est plus longue : c'est la **pile d'appels** des méthodes qui ont mené à l'erreur.

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Main.divide(Main.java:28)
	at Main.main(Main.java:19)
```

Une exception non attrapée **remonte de méthode en méthode** (de la méthode fautive vers la méthode appelante, puis vers celle qui l'a appelée, et ainsi de suite) jusqu'à arriver dans `main`, où elle fait planter le programme. Elle s'arrête dès qu'un bloc `try` / `catch` correspondant l'attrape. La pile peut être très longue quand l'erreur survient en profondeur.

## Où placer le `try` / `catch` ?

### Au plus proche du code fautif... seulement si on sait corriger

On pourrait être tenté de mettre le `try` / `catch` dans `divide` :

```java
public static int divide(int value1, int value2) {
    int result;               // déclarée avant le try pour pouvoir être retournée
    try {
        result = value1 / value2;
    } catch (ArithmeticException e) {
        result = 0;           // quelle valeur mettre ?
    }
    return result;
}
```

Le programme ne plante plus, mais il affiche maintenant que « 12 divisé par 0 vaut 0 » : un programme qui dit des **bêtises**. Mettre `-1` ne ferait pas mieux : l'appelant ne peut pas savoir si c'est le vrai résultat ou la valeur de remplacement.

Le vrai problème n'est pas la division elle-même : c'est le **paramètre** `value2`. La méthode est incapable de faire ce qu'on lui demande si `value2` vaut 0, et elle n'a pas à décider seule quoi faire. Dans ce cas, **on ne met pas de `try` / `catch` dans la méthode**, puisqu'on ne sait pas quoi mettre dans le `catch`.

### Déclarer avec `throws` et documenter

On signale dans la signature que la méthode peut échouer, avec le mot-clé **`throws`** suivi du type d'exception, et on le documente dans la Javadoc :

```java
/**
 * Divise deux entiers.
 *
 * @param value1 le dividende
 * @param value2 le diviseur
 * @return le résultat de la division de value1 par value2
 * @throws ArithmeticException si value2 vaut 0
 */
public static int divide(int value1, int value2) throws ArithmeticException {
    return value1 / value2;
}
```

La méthode ne traite pas l'erreur : elle **laisse l'appelant s'en occuper**, qui connaît le contexte et sait quoi faire (redemander la saisie, afficher un message...). C'est l'appelant qui place alors le `try` / `catch` :

```java
try {
    int result = divide(a, b);
    System.out.println("Le résultat est " + result);
} catch (ArithmeticException e) {
    System.out.println("Impossible de diviser par zéro");
}
```

Deux habitudes à prendre :

1. **Écrire la Javadoc** de ses propres méthodes pour dire si elles peuvent échouer, et pourquoi ;
2. **Lire la Javadoc** des méthodes qu'on n'a pas écrites.

## Exceptions vérifiées ou non

Si on déclare `throws Exception` (le type général), l'IDE souligne en rouge chaque appel à la méthode : on est **obligé** de la surveiller, soit avec un `try` / `catch`, soit en faisant remonter l'erreur avec `throws` dans la méthode appelante. Si on déclare `throws ArithmeticException`, plus rien n'est souligné. Pourquoi ?

Il existe **deux branches** d'exceptions :

| | Exceptions héritant de `RuntimeException` | Exceptions héritant directement de `Exception` |
|---|---|---|
| Surveillance | **non obligatoire** | **obligatoire** (vérifiée à la compilation) |
| Exemple | `ArithmeticException` | (selon la méthode appelée) |

`ArithmeticException` hérite de `RuntimeException` : on n'est pas obligé de l'attraper. Sinon, il faudrait entourer chaque division d'un `try` / `catch`.

Quand on crée ses propres méthodes, c'est au développeur de décider quel type d'exception elle peut lancer. Selon la hiérarchie de ce type, l'appelant sera obligé ou non de la surveiller.

> Complément : au sommet de la hiérarchie se trouve `Throwable`, dont héritent `Exception` (et donc `RuntimeException`) mais aussi `Error`, qui désigne des erreurs graves de la machine virtuelle, qu'on n'attrape normalement pas. Une exception qui n'hérite pas de `RuntimeException` est dite **vérifiée** (*checked*), les autres sont **non vérifiées** (*unchecked*).

## Exemple : `Scanner.nextInt()`

La méthode `nextInt()` que l'on utilise pour lire un entier peut elle aussi planter. Si l'utilisateur saisit autre chose qu'un entier, elle ne renvoie pas une valeur arbitraire (`0`, `-1`...). Heureusement : on n'aurait aucun moyen de distinguer une vraie saisie d'une valeur de remplacement. Elle **lance une exception**.

Sa Javadoc indique les trois cas où elle peut planter, avec la raison pour chacun :

- la saisie ne contient pas que des chiffres (par exemple `abc`) ;
- la saisie ne contient que des chiffres, mais le nombre est trop grand pour tenir dans un `int` ;
- le scanner a été fermé avant l'appel.

Ces trois exceptions héritent de `RuntimeException` (la méthode n'est pas soulignée en rouge) : on n'est pas obligé d'entourer l'appel d'un `try` / `catch`. Mais **si on l'utilise mal, elle plante**, et sans `try` / `catch` l'erreur se propage. C'est donc à nous de décider de surveiller ou non cet appel.

> Complément : les trois types sont `InputMismatchException` (saisie invalide ou hors limites d'un `int`), `NoSuchElementException` (plus de saisie disponible) et `IllegalStateException` (scanner fermé).

## Cas pratique : redemander une saisie jusqu'à ce qu'elle soit valide

On veut une méthode utilitaire `choose` qui demande un entier à l'utilisateur et ne rend la main que lorsque la valeur est **à la fois un entier et comprise entre deux bornes**. Elle prend en paramètres le nom de la variable à renseigner et les bornes `min` et `max`.

### Première version : vérifier les bornes

```java
public static int choose(String variableName, int min, int max) {
    Scanner scanner = new Scanner(System.in);
    int value = 0;
    boolean validChoice = false;

    do {
        System.out.print("Saisir une valeur pour " + variableName
                + " entre " + min + " et " + max + " : ");
        value = scanner.nextInt();

        if (value < min || value > max) {
            System.out.println("Attention, la valeur n'est pas entre " + min + " et " + max);
        } else {
            validChoice = true;
        }
    } while (!validChoice);

    return value;
}
```

- Une boucle `do ... while` convient bien : on demande **d'abord** la saisie, puis on boucle tant que le choix n'est pas valide.
- `!validChoice` est la négation de `validChoice == false`, et se lit mieux.
- Pour une valeur sans borne supérieure, on peut passer `Integer.MAX_VALUE`, la plus grande valeur d'un `int`.

Cette version gère les valeurs hors bornes (`-3`, `34`), mais pas les saisies qui ne sont pas des entiers : avec `abc`, `nextInt()` lance une exception et le programme s'arrête.

### Deuxième version : attraper l'exception dans la boucle

`nextInt()` ne renvoie pas de valeur arbitraire quand elle ne peut pas lire un entier : elle lève une exception (ici `InputMismatchException`, indiquée dans sa Javadoc). On place donc l'appel, **et tout ce qui utilise sa valeur**, dans un `try` : si l'appel échoue, le test des bornes n'a aucun sens. Le `catch` indique que le choix n'est pas valide, et la boucle continue :

```java
do {
    System.out.print("Saisir une valeur pour " + variableName
            + " entre " + min + " et " + max + " : ");
    try {
        value = scanner.nextInt();
        if (value < min || value > max) {
            System.out.println("Attention, la valeur n'est pas entre " + min + " et " + max);
        } else {
            validChoice = true;
        }
    } catch (InputMismatchException e) {
        System.out.println("Attention, la valeur n'est pas un entier");
    }
} while (!validChoice);
```

### Le piège : la boucle infinie

Avec cette version, une saisie comme `abc` provoque une **boucle infinie** qui répète « la valeur n'est pas un entier ». Pourquoi ?

Quand `nextInt()` échoue, elle **ne consomme pas** la saisie : `abc` reste dans la mémoire tampon (le *buffer*) du scanner. À l'itération suivante, `nextInt()` relit le même texte et échoue pour la même raison, et ainsi de suite.

Le `catch` doit donc **corriger l'erreur**, pas seulement l'attraper : il doit consommer la saisie invalide. Comme c'est une chaîne de caractères, on utilise `next()` :

```java
} catch (InputMismatchException e) {
    System.out.println("Attention, la valeur n'est pas un entier");
    scanner.next();   // consomme la saisie invalide : le buffer est vide à l'itération suivante
}
```

À l'itération suivante, `nextInt()` attend une nouvelle saisie.

On teste les trois cas : une valeur correcte (le `catch` est ignoré), une valeur hors bornes (message puis nouvelle demande), et une saisie qui n'est pas un entier (message puis nouvelle demande). Ce `try` / `catch` est bien à sa place : la méthode `choose` sait quoi faire en cas d'erreur, redemander la saisie, et reste « enfermée » à l'intérieur tant que la valeur n'est pas valide.

## Lancer une exception : `throw`

Jusqu'ici, on a attrapé des exceptions lancées par d'autres. Une méthode ou un constructeur peut aussi **lancer** les siennes, quand elle ne peut pas faire ce qu'on lui demande. Par exemple, un constructeur qui reçoit des paramètres incohérents refuse de créer l'objet.

### Créer et lancer : `new` et `throw`

Une exception est un objet : on la **crée** avec `new` (avec un message qui explique la cause), puis on la **lance** avec le mot-clé `throw` :

```java
Exception exception = new Exception("La largeur doit être strictement positive");
throw exception;

// écriture habituelle, plus courte
throw new Exception("La largeur doit être strictement positive");
```

Ne pas confondre `throw` (lance une exception) et `throws` (déclare dans la signature qu'une méthode peut en lancer).

Dès que `throw` est exécuté, la méthode **s'arrête** : le code qui suit n'est pas exécuté.

### Exemple : un constructeur qui se protège

```java
public class Field {
    private int width;
    private int length;

    /**
     * Crée un terrain.
     *
     * @param width  la largeur, strictement positive
     * @param length la longueur, strictement positive
     * @throws Exception si la largeur ou la longueur n'est pas strictement positive
     */
    public Field(int width, int length) throws Exception {
        if (width <= 0) {
            throw new Exception("La largeur doit être strictement positive");
        }
        if (length <= 0) {
            throw new Exception("La longueur doit être strictement positive");
        }
        this.width = width;
        this.length = length;
    }
}
```

On écrit un `if` par vérification, pour que chaque cas ait son propre message. Si l'exception est lancée, le constructeur s'arrête : l'**objet n'est pas créé** et on n'obtient aucune référence. Il ne peut donc pas être manipulé par la suite : la classe se protège des états invalides.

### Qui doit traiter l'exception ?

`Exception` fait partie des exceptions **obligatoires à surveiller** (voir plus haut), donc :

- dans la méthode qui lance l'exception, on a deux possibilités : l'entourer d'un `try` / `catch`, ou ajouter **`throws Exception`** à sa signature. Entourer d'un `try` / `catch` un `throw` qu'on écrit soi-même n'a pas de sens, puisqu'on dit explicitement que la méthode peut échouer. On choisit donc `throws` ;
- l'appelant doit alors à son tour surveiller l'appel : `try` / `catch`, ou `throws`.

À l'appel, on place le `try` / `catch` autour de la création, et on n'utilise l'objet que **dans le `try`**, là où la création a réussi :

```java
try {
    Field field1 = new Field(10, -5);
    field1.display();   // exécuté seulement si le constructeur n'a rien lancé
} catch (Exception e) {
    System.out.println("Impossible de créer le terrain : " + e.getMessage());
}
```

`e.getMessage()` retourne le message passé au constructeur de l'exception.

Il ne faut **pas** ajouter `throws Exception` à la méthode `main` pour faire disparaître le souligné rouge : personne ne surveille `main` (elle est appelée directement par la machine virtuelle), donc l'exception ferait simplement planter le programme. L'appelant doit prendre ses responsabilités avec un `try` / `catch`.

### Lancer une exception non vérifiée

Avec `throws Exception`, tous les appelants sont obligés de surveiller le constructeur. On peut à la place lancer une exception qui hérite de **`RuntimeException`**, comme **`IllegalArgumentException`**, adaptée à un paramètre incorrect :

```java
public Field(int width, int length) {   // pas de throws obligatoire
    if (width <= 0) {
        throw new IllegalArgumentException("La largeur doit être strictement positive");
    }
    if (length <= 0) {
        throw new IllegalArgumentException("La longueur doit être strictement positive");
    }
    this.width = width;
    this.length = length;
}
```

- La signature n'a plus besoin de `throws` (on peut tout de même l'écrire pour informer le lecteur).
- À l'appel, plus aucun `try` / `catch` n'est **obligatoire** : le code est plus simple à écrire.

Mais l'absence d'obligation ne veut pas dire que le risque a disparu. Si on appelle `new Field(10, -5)` sans `try` / `catch`, l'exception est lancée, non attrapée, et **remonte jusqu'à `main` qui plante**. C'est au développeur de décider de surveiller l'appel pour corriger ou signaler l'erreur. La **Javadoc** devient alors essentielle : c'est elle qui indique que le constructeur peut lancer une `IllegalArgumentException` et dans quel cas (`@throws IllegalArgumentException si la largeur ou la longueur n'est pas strictement positive`). On prend donc le temps de **lire la documentation** des constructeurs et méthodes qu'on utilise.

La classe doit enfin **se protéger elle-même**, même si l'appelant a déjà vérifié ses valeurs (avec `choose`, par exemple) : rien n'oblige l'appelant à passer par cette vérification, il peut très bien écrire n'importe quelle valeur dans le code.

## À retenir

- Une **exception** est une erreur **à l'exécution** (le code a compilé). Non traitée, elle **arrête brutalement** le programme : le code qui suit n'est pas exécuté.
- C'est un **objet** : on lit son **type**, son **message** et la **pile d'appels** dans la trace.
- `try` surveille un code, `catch (Type e)` attrape l'exception correspondante. Le programme **continue après le `catch`**.
- Les variables déclarées dans le `try` sont **locales** au bloc.
- Attraper `Exception` attrape toutes les exceptions (polymorphisme). Le `catch` doit **apporter une solution**, pas seulement faire taire l'erreur.
- `getMessage()` donne le message ; `printStackTrace()` écrit la trace complète, même quand l'exception est attrapée.
- Une exception non attrapée **remonte** la pile d'appels jusqu'à `main`.
- Une méthode qui ne sait pas corriger l'erreur ne l'attrape pas : elle la déclare avec **`throws`** et la documente dans sa **Javadoc** (`@throws`). Ne pas renvoyer de valeur de remplacement trompeuse (`0`, `-1`).
- Les exceptions héritant de **`RuntimeException`** (comme `ArithmeticException`) **ne sont pas obligatoires à surveiller** ; celles héritant directement de `Exception` le sont.
- Lire la Javadoc des méthodes qu'on utilise : elle indique si elles peuvent planter et pourquoi.
- Une méthode qui ne peut pas faire ce qu'on lui demande **lance** une exception : `throw new Type("message")`. Elle s'arrête, et un constructeur qui lance une exception **ne crée pas l'objet**.
- `throw` lance une exception, `throws` la déclare dans la signature. Avec une exception vérifiée (`Exception`), on ajoute `throws` à la méthode, et l'appelant doit surveiller l'appel. On ne met pas `throws Exception` sur `main`.
- Avec une exception non vérifiée (`IllegalArgumentException`, qui hérite de `RuntimeException`), aucun `try` / `catch` n'est obligatoire, mais l'exception remonte jusqu'à `main` si on ne la surveille pas : la Javadoc (`@throws`) doit l'indiquer.
- Une boucle de saisie met le `try` / `catch` **dans** la boucle. Le `catch` doit corriger l'erreur : `nextInt()` ne consomme pas la saisie invalide, il faut la consommer (`next()`) sinon on tourne indéfiniment.