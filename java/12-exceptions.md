# Les exceptions

Un programme ne se déroule pas toujours comme prévu : un joueur saisit `abc` au lieu d'un nombre, on partage les rations entre zéro pirate, on tente de sortir de la carte. Le code a pourtant compilé. Ce chapitre explique ce qui se passe à ce moment-là, comment réagir, et comment signaler soi-même qu'une opération est impossible.

## Objectifs

À la fin du chapitre, tu sauras :

* distinguer une erreur de compilation et une exception ;
* lire la trace d'une exception ;
* attraper une exception avec `try` / `catch`, et choisir **où** le faire ;
* distinguer exceptions vérifiées et non vérifiées ;
* lancer une exception avec `throw`, et déclarer qu'une méthode peut en lancer avec `throws` ;
* créer tes propres exceptions ;
* utiliser `finally` et `try-with-resources` pour libérer des ressources.

## Le principe d'exception

### Définition

Une **exception** est une erreur qui se produit **à l'exécution** du programme. Il faut la distinguer d'une erreur de compilation :

| | Erreur de compilation | Exception |
| --- | --- | --- |
| Moment | avant l'exécution, à la compilation | pendant l'exécution, par la machine virtuelle |
| Cause | le code est incorrect (syntaxe, types...) | une instruction ne peut pas s'exécuter (division par zéro, saisie invalide...) |
| Conséquence | le fichier ne compile pas | le programme s'arrête brutalement |

Une exception est particulièrement désagréable : le code a compilé, il peut fonctionner une première fois, puis planter la fois suivante avec d'autres valeurs.

Quand une exception est lancée et n'est pas traitée, le programme **s'arrête immédiatement** : tout le code écrit après l'instruction fautive **n'est pas exécuté**. C'est dangereux, car certaines opérations (fermeture d'une ressource, sauvegarde, affichage de fin) ne sont jamais faites.

### Un exemple : partager les rations

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Début");
        int rations = 12;
        int crew = 0;
        int perPirate = rations / crew;
        System.out.println("Rations par pirate : " + perPirate);
        System.out.println("Fin");
    }
}
```

Ce code compile. Avec `crew = 4`, il affiche `3` et va jusqu'au bout. Avec `crew = 0`, il **plante** : ni le résultat ni « Fin » ne s'affichent. Pense toujours à tester **un cas qui fonctionne, puis un cas qui provoque l'erreur**.

### Lire la trace d'une exception

Quand une exception n'est pas attrapée, sa **trace** s'écrit dans la console :

```
Début
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Main.main(Main.java:5)
```

On y trouve :

* le **type** de l'exception : `ArithmeticException` ;
* son **message** : `/ by zero` ;
* la **méthode** et la **ligne** où l'erreur s'est produite : `Main.main`, ligne 5. Dans IntelliJ, ce lien est cliquable.

La trace est écrite dans le flux d'erreur (`System.err`), que l'IDE affiche en rouge. Une exception est un **objet** Java : elle est créée, puis **lancée**.

## Surveiller et attraper : `try` / `catch`

### Principe

Un bloc `try` (« tenter ») entoure le code qui peut échouer. Si une exception est lancée dans ce bloc, un bloc `catch` correspondant l'**attrape** :

```java
try {
    int perPirate = rations / crew;
    System.out.println("Rations par pirate : " + perPirate);
} catch (ArithmeticException e) {
    System.out.println("Impossible de partager les rations : l'équipage est vide");
}

System.out.println("Fin");
```

* Entre les parenthèses du `catch` : le **type** de l'exception et le **nom** de l'objet exception (`e`).
* **Aucune exception** dans le `try` : le bloc `catch` est **ignoré**.
* **Une exception** dans le `try` : l'exécution du `try` s'interrompt à l'instruction fautive (la suite du bloc n'est pas exécutée), puis le `catch` s'exécute.
* Dans tous les cas, le programme **continue après le `catch`** : « Fin » s'affiche.

### Portée des variables

Une variable déclarée dans le bloc `try` est **locale à ce bloc**. C'est pourquoi l'affichage du résultat est dans le `try` : si la division échoue, la variable n'est pas initialisée. Si tu déclares la variable avant le `try` pour l'utiliser après, le compilateur te rappelle qu'elle peut ne pas avoir de valeur :

```java
int perPirate;
try {
    perPirate = rations / crew;
} catch (ArithmeticException e) {
    // perPirate n'a pas de valeur ici
}
System.out.println(perPirate);   // error: variable perPirate might not have been initialized
```

### Le type d'exception dans le `catch`

* Si tu attrapes un autre type que celui qui est lancé, aucun `catch` ne correspond : le programme plante comme avant.
* On peut attraper la classe **`Exception`**, mère de (presque) toutes les exceptions : c'est du polymorphisme (chapitre 10), là où la mère est attendue, n'importe quelle fille convient. Mais c'est trop large : on attrape aussi des erreurs qu'on n'avait pas prévues, et on les cache. On attrape le type **le plus précis possible**.

### Le `catch` doit apporter une solution

Un `catch` n'est pas là pour faire taire l'erreur. Un simple message ne corrige rien. Un `catch` **vide** est pire : l'erreur disparaît sans laisser de trace.

```java
} catch (ArithmeticException e) {
    // à ne jamais faire : l'erreur est avalée
}
```

On corrige (redemander une saisie, utiliser une valeur par défaut **cohérente**) ou on signale clairement le problème.

### Utiliser l'objet exception

L'objet reçu par le `catch` donne des informations :

```java
try {
    // ...
} catch (ArithmeticException e) {
    System.out.println(e.getMessage());   // "/ by zero"
    e.printStackTrace();                  // écrit la trace complète
}
```

`printStackTrace()` écrit la trace (type, message, pile d'appels) **même si l'exception a été attrapée**. Le rouge dans la console ne veut donc pas dire que le programme a planté. C'est utile pendant le développement.

### Plusieurs `catch`

Un `try` peut avoir plusieurs `catch`, pour réagir différemment selon le type :

```java
try {
    // ...
} catch (InputMismatchException e) {
    System.out.println("Ce n'est pas un entier");
} catch (ArithmeticException e) {
    System.out.println("Division par zéro");
}
```

Le premier `catch` dont le type correspond est exécuté, les autres sont ignorés. **L'ordre compte** : un `catch` sur un type général placé avant un type plus précis rend le second inutile, et le compilateur le refuse :

```java
try { /* ... */ }
catch (Exception e) { }
catch (ArithmeticException e) { }   // error: exception ArithmeticException has already been caught
```

On écrit donc les types **du plus précis au plus général**.

Si deux types appellent la même réaction, on les regroupe avec `|` :

```java
} catch (NotEnoughGoldException | IllegalArgumentException e) {
    System.out.println("Achat impossible : " + e.getMessage());
}
```

Un `catch` sur une exception qui ne peut pas être lancée dans le `try` est refusé (pour les exceptions vérifiées, voir plus bas) :

```
error: exception IOException is never thrown in body of corresponding try statement
```

## Propagation et pile d'appels

Plaçons la division dans une méthode :

```java
static int share(int rations, int crew) {
    return rations / crew;
}
```

Si `share(12, 0)` est appelée depuis `main`, la trace est plus longue : c'est la **pile d'appels** des méthodes qui ont mené à l'erreur.

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Main.share(Main.java:2)
	at Main.main(Main.java:5)
```

Une exception non attrapée **remonte de méthode en méthode** (de la méthode fautive vers celle qui l'a appelée, puis vers celle qui l'a appelée, et ainsi de suite) jusqu'à `main`, où elle fait planter le programme. Elle s'arrête dès qu'un `try` / `catch` correspondant l'attrape. La pile peut être très longue quand l'erreur survient en profondeur ; on la lit **de haut en bas** : la première ligne est l'endroit exact, les suivantes sont les appelants.

## Où placer le `try` / `catch` ?

### Au plus proche du code fautif... seulement si on sait corriger

On pourrait être tenté de mettre le `try` / `catch` dans `share` :

```java
static int share(int rations, int crew) {
    int result;
    try {
        result = rations / crew;
    } catch (ArithmeticException e) {
        result = 0;   // quelle valeur mettre ?
    }
    return result;
}
```

Le programme ne plante plus, mais il affiche maintenant que « 12 rations partagées entre 0 pirate font 0 par pirate » : un programme qui dit des **bêtises**. Mettre `-1` ne ferait pas mieux : l'appelant ne peut pas savoir si c'est un vrai résultat ou une valeur de remplacement.

Le vrai problème n'est pas la division : c'est le **paramètre** `crew`. La méthode est incapable de faire ce qu'on lui demande si `crew` vaut 0, et elle n'a pas à décider seule quoi faire. Dans ce cas, **on ne met pas de `try` / `catch` dans la méthode**, puisqu'on ne sait pas quoi mettre dans le `catch`.

### Déclarer avec `throws` et documenter

On signale dans la signature que la méthode peut échouer, avec **`throws`** suivi du type d'exception, et on le documente dans la Javadoc (chapitre 7) :

```java
/**
 * Partage des rations entre les pirates de l'équipage.
 *
 * @param rations le nombre de rations
 * @param crew    le nombre de pirates
 * @return le nombre de rations par pirate
 * @throws ArithmeticException si crew vaut 0
 */
static int share(int rations, int crew) throws ArithmeticException {
    return rations / crew;
}
```

La méthode ne traite pas l'erreur : elle **laisse l'appelant s'en occuper**, qui connaît le contexte et sait quoi faire (afficher un message, demander autre chose). C'est lui qui place le `try` / `catch` :

```java
try {
    int perPirate = share(rations, crew);
    System.out.println("Rations par pirate : " + perPirate);
} catch (ArithmeticException e) {
    System.out.println("L'équipage est vide : personne à nourrir");
}
```

Deux habitudes à prendre :

1. **écrire la Javadoc** de tes méthodes pour dire si elles peuvent échouer, et pourquoi ;
2. **lire la Javadoc** des méthodes que tu n'as pas écrites.

## Exceptions vérifiées ou non

Si tu déclares `throws Exception` (le type général), le compilateur **t'oblige** à surveiller chaque appel à la méthode, avec un `try` / `catch` ou en faisant remonter l'erreur avec `throws` dans la méthode appelante :

```java
static void b() throws Exception { /* ... */ }
static void c() { b(); }   // error: unreported exception Exception; must be caught or declared to be thrown
```

Si tu déclares `throws ArithmeticException`, rien n'est exigé. Pourquoi ? Il existe **deux familles** d'exceptions :

| | Héritant de `RuntimeException` | Héritant directement de `Exception` |
| --- | --- | --- |
| Surveillance | **non obligatoire** | **obligatoire** (vérifiée à la compilation) |
| Nom | exception **non vérifiée** (*unchecked*) | exception **vérifiée** (*checked*) |
| Exemples | `ArithmeticException`, `IllegalArgumentException`, `NullPointerException` | `IOException`, `SQLException` |

`ArithmeticException` hérite de `RuntimeException` : on n'est pas obligé de l'attraper, sinon il faudrait entourer chaque division d'un `try` / `catch`.

```
Throwable
  ├── Error                    (erreurs graves de la JVM : on ne les attrape pas)
  └── Exception                (vérifiées)
        └── RuntimeException   (non vérifiées)
```

Quand tu écris tes propres méthodes, c'est à toi de décider quel type d'exception elles lancent. Selon sa position dans la hiérarchie, l'appelant sera obligé ou non de la surveiller.

Repère pour choisir :

* **vérifiée** quand l'appelant peut raisonnablement **récupérer** (un joueur n'a pas assez d'or : on lui propose autre chose) ;
* **non vérifiée** quand c'est une **erreur de programmation** (un paramètre qui n'aurait jamais dû être négatif).

## Exemple : `Scanner.nextInt()`

La méthode `nextInt()` peut elle aussi échouer. Quand l'utilisateur saisit autre chose qu'un entier, elle ne renvoie pas une valeur arbitraire (`0`, `-1`...) : on ne pourrait pas distinguer une vraie saisie d'une valeur de remplacement. Elle **lance une exception**.

Sa Javadoc indique les cas d'échec. Voici ce que j'ai observé avec JDK 21 :

| Situation | Exception | Message |
| --- | --- | --- |
| saisie qui n'est pas un entier (`abc`) | `InputMismatchException` | `null` |
| entier trop grand pour un `int` | `InputMismatchException` | `For input string: "99999999999"` |
| plus rien à lire | `NoSuchElementException` | `null` |
| scanner déjà fermé | `IllegalStateException` | `Scanner closed` |

Toutes héritent de `RuntimeException` : aucun `try` / `catch` n'est obligatoire, mais **si on l'utilise mal, elle plante**. C'est à nous de décider de surveiller ou non l'appel.

> `InputMismatchException` est une **fille** de `NoSuchElementException`. Si tu attrapes les deux dans des `catch` séparés, mets `InputMismatchException` en premier, sinon le compilateur refuse le second.

## Cas pratique : redemander une saisie jusqu'à ce qu'elle soit valide

On veut une méthode `choose` qui demande un entier au joueur et ne rend la main que lorsque la valeur est **à la fois un entier et comprise entre deux bornes**. Elle prend le scanner, le nom de la variable à renseigner, et les bornes `min` et `max`.

### Première version : vérifier les bornes

```java
static int choose(Scanner scanner, String variableName, int min, int max) {
    int value = 0;
    boolean validChoice = false;

    do {
        System.out.print("Saisir " + variableName + " entre " + min + " et " + max + " : ");
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

* Une boucle `do ... while` convient : on demande **d'abord**, puis on boucle tant que le choix n'est pas valide.
* `!validChoice` est la négation de `validChoice == false`, et se lit mieux.
* Pour une valeur sans borne supérieure, on peut passer `Integer.MAX_VALUE`.

Cette version gère les valeurs hors bornes, mais pas `abc` : `nextInt()` lance une exception et le programme s'arrête.

**Remarque : le scanner est passé en paramètre.** Il est tentant de créer un `new Scanner(System.in)` dans la méthode. Ne le fais pas : un `Scanner` lit et **met en mémoire tampon** une partie de l'entrée. Avec deux scanners sur `System.in`, le premier a déjà « avalé » les saisies suivantes, et le second ne voit plus rien. Avec les saisies `1 2`, un second `Scanner` lève une `NoSuchElementException`. On crée donc **un seul** `Scanner` dans `main` et on le transmet.

### Deuxième version : attraper l'exception dans la boucle

`nextInt()` lance une exception (`InputMismatchException`, indiquée dans sa Javadoc) quand elle ne peut pas lire un entier. On place l'appel **et tout ce qui utilise sa valeur** dans un `try` : si l'appel échoue, le test des bornes n'a aucun sens. Le `catch` signale que la saisie n'est pas valide, et la boucle continue :

```java
do {
    System.out.print("Saisir " + variableName + " entre " + min + " et " + max + " : ");
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

Avec cette version, `abc` provoque une **boucle infinie** qui répète « la valeur n'est pas un entier ». Pourquoi ?

Quand `nextInt()` échoue, elle **ne consomme pas** la saisie : `abc` reste dans la mémoire tampon du scanner. À l'itération suivante, `nextInt()` relit le même texte et échoue pour la même raison, et ainsi de suite (je l'ai vérifié : la même exception se répète indéfiniment).

Le `catch` doit donc **corriger l'erreur**, pas seulement l'attraper : il doit consommer la saisie invalide. Comme c'est du texte, on utilise `next()` :

```java
} catch (InputMismatchException e) {
    System.out.println("Attention, la valeur n'est pas un entier");
    scanner.next();   // consomme la saisie invalide
}
```

À l'itération suivante, `nextInt()` attend une nouvelle saisie.

Avec les saisies `abc`, `9`, `3`, la méthode affiche « pas un entier », puis « pas entre 1 et 5 », puis rend `3`. Ce `try` / `catch` est bien à sa place : `choose` sait quoi faire en cas d'erreur, redemander, et reste « enfermée » dans la boucle tant que la valeur n'est pas valide.

## Lancer une exception : `throw`

Jusqu'ici, tu as attrapé des exceptions lancées par d'autres. Une méthode ou un constructeur peut aussi **lancer** les siennes, quand elle ne peut pas faire ce qu'on lui demande.

### Créer et lancer : `new` et `throw`

Une exception est un objet : on la **crée** avec `new` (avec un message qui explique la cause), puis on la **lance** avec `throw` :

```java
IllegalArgumentException exception = new IllegalArgumentException("L'or ne peut pas être négatif");
throw exception;

// écriture habituelle, plus courte
throw new IllegalArgumentException("L'or ne peut pas être négatif");
```

Ne confonds pas **`throw`** (lance une exception, dans le corps) et **`throws`** (déclare dans la signature qu'une méthode peut en lancer).

Dès que `throw` est exécuté, la méthode **s'arrête** : le code qui suit n'est pas exécuté.

### Un constructeur qui se protège

```java
public class Captain {
    private final String name;
    private int gold;

    /**
     * Crée un capitaine.
     *
     * @param name le nom, non vide
     * @param gold l'or de départ, positif ou nul
     * @throws IllegalArgumentException si le nom est vide ou l'or négatif
     */
    public Captain(String name, int gold) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Le nom ne peut pas être vide");
        }
        if (gold < 0) {
            throw new IllegalArgumentException("L'or ne peut pas être négatif : " + gold);
        }
        this.name = name;
        this.gold = gold;
    }
}
```

On écrit un `if` par vérification, pour que chaque cas ait son propre message. Si l'exception est lancée, le constructeur s'arrête : l'**objet n'est pas créé**, on n'obtient aucune référence. L'objet ne peut donc pas être manipulé dans un état invalide : c'est l'encapsulation (chapitre 7) qui fait son travail.

`IllegalArgumentException` hérite de `RuntimeException` : aucun `try` / `catch` n'est **obligatoire**. Mais l'absence d'obligation ne veut pas dire que le risque a disparu. Si on appelle `new Captain("", 5)` sans surveillance, l'exception est lancée, non attrapée, et **remonte jusqu'à `main` qui plante**. La **Javadoc** est alors essentielle : c'est elle qui dit que le constructeur peut lancer une `IllegalArgumentException`, et dans quel cas.

La classe doit **se protéger elle-même**, même si l'appelant a déjà vérifié ses valeurs (avec `choose`, par exemple) : rien ne l'oblige à passer par cette vérification.

### Une exception vérifiée : `throws` obligatoire

Pour une situation que l'appelant peut résoudre, on utilise une exception **vérifiée**. Voici une méthode pour dépenser de l'or :

```java
public void spend(int amount) throws NotEnoughGoldException {
    if (amount < 0) {
        throw new IllegalArgumentException("Montant négatif : " + amount);   // erreur de programmation
    }
    if (amount > gold) {
        throw new NotEnoughGoldException("Il manque " + (amount - gold) + " pièces d'or");   // situation de jeu
    }
    gold -= amount;
}
```

Une exception vérifiée impose à **l'appelant** de décider :

```java
try {
    captain.spend(15);
    System.out.println("Achat effectué");
} catch (NotEnoughGoldException e) {
    System.out.println("Achat impossible : " + e.getMessage());
}
```

* Dans la méthode qui lance l'exception, il faut **déclarer** `throws` (sinon : `unreported exception ...; must be caught or declared to be thrown`). Entourer d'un `try` / `catch` un `throw` qu'on écrit soi-même est rarement utile : si la méthode peut échouer, on le dit dans la signature et l'appelant décide.
* L'appelant doit à son tour surveiller l'appel : `try` / `catch`, ou `throws` dans sa propre signature.
* On utilise l'objet seulement **dans le `try`**, là où l'opération a réussi.
* Ne mets pas `throws Exception` sur `main` pour faire disparaître le souligné rouge : personne ne surveille `main` (elle est appelée par la machine virtuelle), l'exception ferait simplement planter le programme. L'appelant doit prendre ses responsabilités avec un `try` / `catch`.

Autant que possible, lance des types **précis**. `throw new Exception("...")` oblige les appelants à attraper `Exception`, donc à tout attraper : cela ne dit rien sur ce qui s'est passé.

## Créer ses propres exceptions

Les exceptions standard (`IllegalArgumentException`, `IllegalStateException`...) couvrent beaucoup de cas. Pour une règle propre à ton application, tu crées ta propre classe, qui **hérite** d'`Exception` (vérifiée) ou de `RuntimeException` (non vérifiée) :

```java
public class NotEnoughGoldException extends Exception {
    public NotEnoughGoldException(String message) {
        super(message);
    }
}
```

Le message est transmis au constructeur de la mère avec `super(message)` (chapitre 9) : `getMessage()` le retourne.

Une exception peut aussi porter des **informations** utiles à celui qui l'attrape :

```java
public class OutOfMapException extends Exception {
    private final int row;
    private final int col;

    public OutOfMapException(int row, int col) {
        super("Position (" + row + ", " + col + ") hors de la carte");
        this.row = row;
        this.col = col;
    }

    public int getRow() { return row; }
    public int getCol() { return col; }
}
```

```java
public class Board {
    private static final int ROWS = 6;
    private static final int COLS = 8;

    /**
     * Vérifie qu'une position est dans la carte.
     *
     * @throws OutOfMapException si la position est hors de la carte
     */
    public void checkInside(int row, int col) throws OutOfMapException {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            throw new OutOfMapException(row, col);
        }
    }
}
```

```java
try {
    board.checkInside(6, 0);
} catch (OutOfMapException e) {
    System.out.println(e.getMessage());   // Position (6, 0) hors de la carte
}
```

Un nom d'exception se termine par `Exception`, et décrit **ce qui est arrivé**.

### Envelopper une exception : la cause

Parfois, une méthode attrape une exception de bas niveau et en lance une autre, plus parlante pour son appelant. On passe l'exception d'origine comme **cause**, pour ne pas perdre l'information :

```java
public class NotEnoughGoldException extends Exception {
    public NotEnoughGoldException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

```java
try {
    int price = Integer.parseInt(text);
    // ...
} catch (NumberFormatException e) {
    throw new NotEnoughGoldException("Prix illisible : " + text, e);   // e est conservée comme cause
}
```

L'appelant retrouve la cause avec `getCause()`, et `printStackTrace()` l'affiche à la suite de la trace (« Caused by »). Tu utiliseras ce mécanisme en JDBC, où les exceptions de la base de données sont enveloppées dans celles de ton application.

## `finally` et `try-with-resources`

### `finally`

Un bloc `finally` après le `try` / `catch` s'exécute **toujours**, qu'il y ait eu une exception ou non, même si le `try` contient un `return` :

```java
static int f() {
    try {
        return 1;
    } finally {
        System.out.println("nettoyage");   // affiché avant que 1 ne soit retourné
    }
}
```

On s'en sert pour **libérer une ressource** (fermer un fichier, une connexion) quoi qu'il arrive.

### `try-with-resources`

Écrire le `finally` à la main est fastidieux. Pour les objets qui implémentent l'interface **`AutoCloseable`** (chapitre 11), Java ferme la ressource **automatiquement** à la fin du bloc :

```java
try (Resource a = new Resource("a"); Resource b = new Resource("b")) {
    System.out.println("corps");
    throw new IllegalStateException("boom");
} catch (IllegalStateException e) {
    System.out.println("attrapée : " + e.getMessage());
}
```

```
open a
open b
corps
close b
close a
attrapée : boom
```

Les ressources sont déclarées entre parenthèses, créées dans l'ordre, puis **fermées dans l'ordre inverse**, avant que le `catch` ne s'exécute, même si une exception a été lancée. Tu retrouveras cette forme avec les connexions JDBC. Les classes de la bibliothèque qui ouvrent des ressources (fichiers, connexions, `Scanner`) l'implémentent.

Attention avec `Scanner(System.in)` : fermer le scanner **ferme aussi `System.in`**, et tu ne pourras plus lire au clavier. Dans un programme console, on crée un seul `Scanner` dans `main` et on évite de le mettre dans un `try-with-resources` tant que le programme a besoin de lire.

## Les bonnes pratiques

* **Attraper le type le plus précis**, pas `Exception`.
* **Ne jamais avaler** une exception (`catch` vide). Au minimum, signale-la.
* Attraper **là où on sait quoi faire**. Sinon, laisser remonter avec `throws`.
* **Ne pas utiliser les exceptions pour le déroulement normal** : un test `if (crew > 0)` est plus clair et plus rapide qu'un `catch (ArithmeticException)`.
* **Écrire le message** de l'exception pour celui qui le lira : ce qui s'est passé, et avec quelles valeurs.
* **Documenter** avec `@throws`.
* Une classe doit **se protéger elle-même** : elle ne fait pas confiance aux appelants.

## Exemple complet

`OutOfMapException.java`

```java
public class OutOfMapException extends Exception {
    private final int row;
    private final int col;

    public OutOfMapException(int row, int col) {
        super("Position (" + row + ", " + col + ") hors de la carte");
        this.row = row;
        this.col = col;
    }

    public int getRow() { return row; }
    public int getCol() { return col; }
}
```

`Board.java`

```java
public class Board {
    private static final int ROWS = 6;
    private static final int COLS = 8;

    public void checkInside(int row, int col) throws OutOfMapException {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
            throw new OutOfMapException(row, col);
        }
    }
}
```

`Main.java`

```java
Board board = new Board();
try {
    board.checkInside(2, 3);        // dans la carte : rien ne se passe
    board.checkInside(6, 0);        // hors de la carte : exception
    System.out.println("jamais affiché");
} catch (OutOfMapException e) {
    System.out.println(e.getMessage() + " (ligne " + e.getRow() + ")");
}
```

```
Position (6, 0) hors de la carte (ligne 6)
```

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Lancer une exception vérifiée sans `throws` | `unreported exception X; must be caught or declared to be thrown` | Déclarer `throws`, ou attraper. |
| Appeler une méthode qui déclare une exception vérifiée sans la surveiller | même message | `try` / `catch`, ou `throws`. |
| `catch` d'une exception vérifiée jamais lancée | `exception X is never thrown in body of corresponding try statement` | Retirer le `catch`. |
| `catch (Exception e)` avant un `catch` plus précis | `exception X has already been caught` | Du plus précis au plus général. |
| Utiliser une variable assignée dans le `try` après le `catch` | `variable v might not have been initialized` | Initialiser avant, ou utiliser dans le `try`. |
| Boucle de saisie qui ne consomme pas l'entrée invalide | boucle infinie | Appeler `scanner.next()` dans le `catch`. |
| Plusieurs `Scanner` sur `System.in` | `NoSuchElementException` | Un seul scanner, passé en paramètre. |
| `catch` vide | l'erreur disparaît | Corriger, ou signaler. |
| Valeur de remplacement (`0`, `-1`) dans le `catch` | résultats faux, sans erreur | Laisser l'appelant décider. |
| Fermer un `Scanner(System.in)` trop tôt | `NoSuchElementException` ou `IllegalStateException` | Fermer à la toute fin, ou ne pas fermer. |
| Confondre `throw` et `throws` | erreur de syntaxe | `throw` lance, `throws` déclare. |
| `throws Exception` sur `main` pour éviter le souligné | le programme plante quand même | Placer un `try` / `catch`. |

## À retenir

* Une **exception** est une erreur **à l'exécution**. Non traitée, elle arrête le programme : le code qui suit n'est pas exécuté.
* C'est un **objet** : sa trace donne le type, le message, la pile d'appels (de haut en bas : l'endroit exact, puis les appelants).
* `try` surveille, `catch (Type e)` attrape. Le programme continue après. Plusieurs `catch`, du plus précis au plus général ; `|` pour regrouper.
* Le `catch` doit **apporter une solution** : ni vide, ni valeur de remplacement trompeuse.
* Une exception non attrapée **remonte** la pile d'appels jusqu'à `main`.
* Une méthode qui ne sait pas corriger l'erreur la déclare avec **`throws`** et la documente avec `@throws`.
* **Vérifiées** (`Exception`) : le compilateur oblige à les surveiller ; **non vérifiées** (`RuntimeException`) : non. Vérifiée quand l'appelant peut récupérer, non vérifiée pour une erreur de programmation.
* **`throw new Type("message")`** lance une exception ; la méthode s'arrête ; un constructeur qui lance **ne crée pas l'objet**.
* On crée ses propres exceptions en héritant d'`Exception` ou de `RuntimeException`, avec `super(message)` et, si besoin, une cause.
* `finally` s'exécute toujours ; `try-with-resources` ferme automatiquement les `AutoCloseable`.
* Un `Scanner` sur `System.in` : un seul, créé dans `main`. Dans une boucle de saisie, le `catch` consomme l'entrée invalide avec `next()`.

## À toi de jouer

1. Écris un programme qui lit deux entiers et affiche le résultat de la division. Teste un cas valide, puis un diviseur égal à 0. Lis la trace : où est la ligne fautive ?
2. Entoure la division d'un `try` / `catch (ArithmeticException e)`. Affiche `e.getMessage()` puis appelle `e.printStackTrace()`. Que remarques-tu sur la couleur et l'ordre d'affichage ?
3. Écris `static int share(int rations, int crew)` **sans** `try` / `catch`, avec la Javadoc `@throws`. Appelle-la dans un `try` / `catch` depuis `main`. Pourquoi ne pas mettre le `try` / `catch` dans `share` ?
4. Écris `choose(Scanner scanner, String name, int min, int max)`. Teste avec une valeur correcte, hors bornes, et `abc`. Retire volontairement `scanner.next()` pour observer la boucle infinie, puis remets-le.
5. Provoque une `NoSuchElementException` en créant un deuxième `Scanner` sur `System.in` dans `choose`. Explique pourquoi.
6. Dans `Captain`, lance une `IllegalArgumentException` si le nom est vide ou l'or négatif. Teste `new Captain("", 5)` sans `try` / `catch`, puis avec. Écris la Javadoc.
7. Crée `NotEnoughGoldException` (vérifiée) et `Captain.spend(int amount)`. Constate l'erreur de compilation à l'appel sans `try` / `catch`. Traite-la.
8. Crée `OutOfMapException` avec la ligne et la colonne. Dans ton exercice de carte (chapitre 5), appelle `Board.checkInside` avant chaque déplacement et attrape l'exception pour redemander une direction.
9. Écris deux `catch` dans le mauvais ordre (`Exception` puis `ArithmeticException`). Lis l'erreur, puis corrige. Combien de types peut-on regrouper avec `|` ?
10. Écris une classe `Resource` qui implémente `AutoCloseable` et affiche « open » et « close ». Utilise-la dans un `try-with-resources` en lançant une exception dans le corps. Dans quel ordre les messages s'affichent-ils ?

**Indice de l'exercice 2 :** `printStackTrace()` écrit sur le flux d'erreur, tes `println` sur la sortie standard : les deux flux peuvent s'entremêler dans la console.

## Pour aller plus loin

* [Dev.java : qu'est-ce qu'une exception ?](https://dev.java/learn/exceptions/what-is-an-exception/).
* [Dev.java : attraper et traiter les exceptions](https://dev.java/learn/language/annotations-exceptions/exceptions/catching-handling/).
* [Dev.java : lancer des exceptions](https://dev.java/learn/language/annotations-exceptions/exceptions/throwing/).
* [API Java SE 21 : `Throwable`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Throwable.html).
* [API Java SE 21 : `RuntimeException`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/RuntimeException.html).
* [Spécification du langage Java : les exceptions, chapitre 11](https://docs.oracle.com/javase/specs/jls/se21/html/jls-11.html) (pour les curieux).
