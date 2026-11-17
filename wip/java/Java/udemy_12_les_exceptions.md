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