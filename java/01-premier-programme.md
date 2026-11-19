# Mon premier programme

Dans ce chapitre, on installe l'environnement de travail, on crée un premier projet, on le lance, puis on comprend ce qui se passe réellement quand on appuie sur le bouton « Run ». Le programme d'exemple est un salut de pirate.

## Objectifs

À la fin du chapitre, tu sauras :

* créer un projet Java avec IntelliJ IDEA et Maven ;
* lancer un programme depuis l'IDE ;
* compiler et exécuter un programme à la main avec `javac` et `java` ;
* expliquer ce que sont le JDK, la JVM, le code source et le bytecode ;
* lire la structure minimale d'un programme Java : classe, méthode `main`, instruction ;
* afficher du texte dans la console.

## L'environnement de développement

Pour écrire du Java, il faut deux choses :

* **un JDK** (Java Development Kit) : l'ensemble d'outils officiel, qui contient le compilateur `javac`, la machine virtuelle et la bibliothèque standard ;
* **un IDE** (environnement de développement intégré) : un éditeur de code qui complète, détecte les erreurs, lance et débogue les programmes.

Ce cours utilise la version **21** du JDK et l'IDE **IntelliJ IDEA**. La *Community Edition* est gratuite et suffit largement. VS Code avec les extensions Java fait aussi très bien l'affaire, mais les captures et les raccourcis donnés ici sont ceux d'IntelliJ.

> **Bon à savoir.** IntelliJ sait télécharger et installer un JDK pour toi au moment de créer un projet. Tu n'as donc pas besoin de l'installer à l'avance.

## Mon premier projet

À l'ouverture, IntelliJ propose d'ouvrir un projet existant ou d'en créer un nouveau.

### Créer un nouveau projet

Clique sur `New Project`, puis renseigne :

* **Name** : le nom du projet, par exemple `ahoy`.
* **Location** : le dossier de ton ordinateur où le projet sera créé.
* **Build system** : choisis **Maven**. Un *système de build* est un outil qui sait compiler le projet et récupérer les bibliothèques dont il a besoin. On n'en a pas encore l'usage, mais Maven pose dès maintenant la structure de projet qu'on retrouve dans la plupart des projets Java professionnels. On y reviendra en détail le moment venu.
* **JDK** : choisis la version **21**. Si elle n'est pas dans la liste, utilise `Download JDK`.
* **Add sample code** : coche cette case pour que l'IDE génère un premier fichier.

Dans les options avancées, tu verras un champ **GroupId**. Il identifie ton projet et sert à nommer les packages (voir le chapitre sur les packages). Pour l'instant, garde la valeur proposée.

Clique sur `Create`. Une fenêtre s'ouvre avec ton projet.

### Découvrir l'explorateur de projet

Le volet de gauche est l'**explorateur** : il montre l'arborescence du projet.

```
ahoy
├── pom.xml
└── src
    ├── main
    │   └── java
    │       └── ...        <- ton code source (Main.java)
    └── test
        └── java           <- les tests (plus tard)
```

* `pom.xml` est le fichier de configuration de Maven. Il contient, entre autres, la version de Java utilisée. On ne le modifie pas pour l'instant.
* Le code source se trouve dans `src/main/java`. C'est la convention de Maven : le code du programme est dans `main`, celui des tests dans `test`.
* Un dossier `target` apparaîtra à la première compilation : c'est là que Maven range les fichiers produits.
* Dans l'explorateur, tu trouveras aussi les *External Libraries*, où figure la bibliothèque standard de Java correspondant à la version choisie (ici la 21).

### Lancer le programme

La partie centrale de la fenêtre affiche le fichier sélectionné. Ouvre `Main` : il ressemble à ceci (IntelliJ ajoute des commentaires d'astuces que tu peux ignorer ou supprimer) :

```java
public class Main {
    public static void main(String[] args) {
        System.out.printf("Hello and welcome!");

        for (int i = 1; i <= 5; i++) {
            System.out.println("i = " + i);
        }
    }
}
```

> Selon la valeur de GroupId, ton fichier peut commencer par une ligne `package ...;`. C'est normal, on l'expliquera avec les packages.

Dans la marge gauche, à côté de `class Main` et de `main`, une **flèche verte** est affichée. Clique dessus : un menu s'ouvre. La première commande, `Run 'Main.main()'`, lance le programme. Une fenêtre de console s'ouvre en bas et affiche le résultat :

```
Hello and welcome!i = 1
i = 2
i = 3
i = 4
i = 5

Process finished with exit code 0
```

Deux choses à remarquer :

* `Hello and welcome!` et `i = 1` sont collés sur la même ligne. C'est parce que `printf` n'ajoute pas de retour à la ligne, contrairement à `println`. On y revient plus bas.
* `exit code 0` signifie que le programme s'est terminé sans erreur.

IntelliJ affiche aussi au début de la console la commande complète qu'il a utilisée pour lancer ton programme. Elle est longue, mais on n'a besoin d'en retenir qu'un élément : elle appelle l'exécutable `java` et lui indique la classe `Main`. On va refaire la même chose à la main dans la section suivante.

### Premier changement : un salut de pirate

Remplace le contenu de `main` par :

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Ahoy, matey !");
    }
}
```

Relance avec la flèche verte :

```
Ahoy, matey !

Process finished with exit code 0
```

> L'interface d'IntelliJ évolue d'une version à l'autre : les menus peuvent changer de place ou de nom. Le fonctionnement général reste le même, et tu peux régler l'apparence dans les paramètres (`Settings`).

## Compilation et exécution

Quand tu cliques sur `Run 'Main.main()'`, deux opérations s'enchaînent :

1. la **compilation** ;
2. l'**exécution**.

### Le code source, le bytecode et la JVM

Un ordinateur ne comprend pas le Java que tu écris. Voici le trajet d'un programme :

```
Main.java  --javac-->  Main.class  --java (JVM)-->  résultat à l'écran
(code source)          (bytecode)
```

* Le **code source** est le fichier `.java`, lisible par un humain.
* Le **compilateur** `javac` le traduit en **bytecode**, enregistré dans un fichier `.class`. Le bytecode n'est pas du code machine : c'est un langage intermédiaire, identique quel que soit ton système d'exploitation.
* La **JVM** (Java Virtual Machine) lit ce bytecode et l'exécute sur ta machine. C'est ce qui permet au même `.class` de fonctionner sous Linux, Windows ou macOS, à condition d'avoir une JVM installée.

Le JDK contient donc `javac` (pour compiler) et `java` (pour lancer la JVM). Tu n'ouvriras jamais un fichier `.class` toi-même : tu modifies toujours le `.java`, puis tu recompiles.

### La compilation

La commande `javac` prend en entrée un fichier `.java` et produit un fichier `.class`.

Si la compilation réussit, le fichier `.class` apparaît. Si le code contient une erreur (une faute de syntaxe, par exemple), le compilateur affiche un message d'erreur et ne génère rien.

### L'exécution

La commande `java` demande à la JVM de lancer le programme. On lui donne **le nom de la classe**, sans l'extension `.class`.

### Le faire à la main

Pour comprendre ce que l'IDE fait à ta place, refais l'opération dans un terminal, dans un dossier à part (pas dans le projet Maven).

1. Crée un dossier `sandbox` et, dedans, un fichier `Main.java` :

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Ahoy, matey !");
    }
}
```

2. Ouvre un terminal dans ce dossier, puis compile :

```bash
javac Main.java
```

Il ne se passe rien d'apparent, mais un fichier `Main.class` vient d'apparaître à côté de `Main.java`.

3. Lance le programme :

```bash
java Main
```

```
Ahoy, matey !
```

> Attention : on écrit `java Main` et non `java Main.class`. La commande attend un nom de classe, pas un nom de fichier.

### Modifier le programme

Change le texte dans `Main.java`, par exemple `"Hisse les voiles !"`, enregistre, puis relance **uniquement** `java Main` : tu vois toujours l'ancien message. C'est normal : `java` exécute le `.class`, qui n'a pas changé. Il faut recompiler avec `javac Main.java` pour mettre à jour le bytecode, puis relancer `java Main`.

À l'inverse, supprime `Main.class` et lance `java Main` : la JVM affiche une erreur, car il n'y a plus rien à exécuter. Ici, la flèche verte de l'IDE a un vrai intérêt : elle compile et exécute en une seule fois.

> **Raccourci à connaître.** Depuis Java 11, `java Main.java` compile le fichier en mémoire et l'exécute directement, sans créer de `.class`. Pratique pour un test rapide, mais cela ne fonctionne que pour un programme tenant dans un seul fichier. On garde ici la compilation en deux temps pour bien comprendre le mécanisme.

### Que fait l'IDE avec Maven ?

Dans ton projet Maven, les `.class` ne sont pas à côté des `.java` : ils sont générés dans le dossier `target/classes`. Le principe est le même : les fichiers `.java` de `src/main/java` sont compilés par `javac`, et le résultat est rangé dans `target`. Tu n'as jamais à y toucher.

> VS Code, avec ses extensions Java, propose les mêmes fonctionnalités : une flèche permet de compiler et d'exécuter le programme.

### Voir une erreur de compilation

Dans ton dossier `sandbox`, retire volontairement le point-virgule après `println(...)`, puis compile :

```
Main.java:3: error: ';' expected
        System.out.println("Ahoy, matey !")
                                           ^
1 error
```

Le message indique le fichier, le numéro de ligne, la nature de l'erreur et l'endroit précis (la flèche `^`). **Lis toujours le message en entier** : la plupart du temps, il te dit presque exactement quoi corriger. Dans l'IDE, la même erreur est soulignée en rouge avant même de compiler.

## Lire un programme Java

Voici notre programme :

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Ahoy, matey !");
    }
}
```

Java est composé de **mots-clés** (`public`, `class`, `static`, `void`...) que le langage réserve pour son propre usage. L'IDE les affiche dans une couleur dédiée pour les repérer vite.

### La classe

La première ligne, `public class Main {`, définit une classe nommée `Main`. Un programme Java est toujours composé de classes.

* Les **accolades** `{` et `}` délimitent le corps de la classe. Tout ce qu'on écrit dans la classe se trouve entre elles.
* **Le nom du fichier doit être identique au nom de la classe publique** : `Main.java` contient `public class Main`. Java distingue les majuscules des minuscules : `main.java` ne conviendrait pas.

Si les noms diffèrent, le compilateur refuse de continuer avec ce message :

```
Main.java:1: error: class Ship is public, should be declared in a file named Ship.java
public class Ship {
       ^
1 error
```

(exemple si le fichier s'appelle `Main.java` et que la classe s'appelle `Ship`). Le compilateur cherche en effet la classe publique dans le fichier du même nom.

### La méthode `main`

À l'intérieur de la classe, on trouve la méthode `public static void main(String[] args)`.

* Une **méthode** est un bloc de code nommé, dont le corps est lui aussi délimité par des accolades.
* `main` est la méthode **principale** : c'est le **point d'entrée** du programme. Quand on lance `java Main`, la JVM cherche cette méthode précise et l'exécute.
* Sa signature est imposée : `public static void main(String[] args)`. Le sens exact de chaque mot sera vu plus tard dans le cours, il suffit de la recopier pour l'instant. Retiens simplement que `String[] args` permet de recevoir des arguments depuis la ligne de commande.

> Attention : la méthode `main` (minuscule) n'a rien à voir avec la classe `Main` (majuscule). Ce sont deux choses différentes qui se trouvent simplement porter le même nom ici. IntelliJ ne te force pas à appeler la classe `Main`, mais c'est une habitude répandue.

> Les versions récentes de Java permettent d'écrire un `main` plus court. On garde la forme complète, qui est celle que tu rencontreras partout.

Si tu supprimes `main`, l'IDE sait la recréer : tape `main` (ou `psvm`) dans le corps de la classe, puis `Entrée`.

### L'instruction

La ligne `System.out.println("Ahoy, matey !");` est une **instruction** : un ordre donné à l'ordinateur. Elle se termine toujours par un **point-virgule**.

* `System.out` désigne la sortie standard, c'est-à-dire la console.
* `println` affiche le texte entre parenthèses **puis passe à la ligne**.
* `printf` affiche du texte formaté, **sans passer à la ligne** automatiquement. On le reverra avec les variables.
* Le texte entre guillemets doubles est une **chaîne de caractères**.

Dans le raccourci IntelliJ, taper `sout` puis `Tab` écrit `System.out.println()` à ta place.

Quand on écrit plusieurs instructions dans `main`, elles sont exécutées **dans l'ordre, l'une après l'autre** :

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Ahoy, matey !");
        System.out.println("Hisse les voiles !");
        System.out.println("Cap sur l'île du Crâne.");
    }
}
```

```
Ahoy, matey !
Hisse les voiles !
Cap sur l'île du Crâne.
```

Une règle d'or : **tout ce qui s'ouvre doit se fermer**. Une accolade, une parenthèse, un guillemet : si l'un manque, le compilateur le signale. L'IDE ferme souvent automatiquement ce que tu ouvres, ce qui évite beaucoup d'erreurs.

## Erreurs fréquentes

| Message ou symptôme | Cause probable |
|---|---|
| `error: ';' expected` | Un point-virgule oublié à la fin d'une instruction. |
| `error: class X is public, should be declared in a file named X.java` | Le nom du fichier et celui de la classe publique diffèrent. |
| `error: cannot find symbol` | Une faute de frappe dans un nom (`System.out.printn`), ou une majuscule oubliée (`system`). |
| `Error: Could not find or load main class Main` | Tu as lancé `java` depuis le mauvais dossier, ou tu as écrit `java Main.class`. |
| Rien ne change après une modification | Tu as relancé `java` sans recompiler avec `javac`. |

## À retenir

* Un **JDK** fournit `javac` (compilateur) et `java` (lanceur de la JVM).
* Le code source (`.java`) est compilé en bytecode (`.class`), qui est exécuté par la JVM.
* Après chaque modification du code, il faut recompiler. L'IDE le fait pour toi avec la flèche verte.
* Un projet Maven range son code dans `src/main/java`, et les fichiers générés dans `target`.
* Le nom du fichier est identique au nom de la classe publique.
* `main` est le point d'entrée : `public static void main(String[] args)`.
* Chaque instruction se termine par `;`, et les instructions s'exécutent dans l'ordre.
* `println` passe à la ligne, `printf` non.

## À toi de jouer

1. Modifie le programme pour qu'il affiche le nom de ton navire sur une ligne, et ta devise de pirate sur la suivante.
2. Remplace `println` par `printf` dans les deux instructions. Que constates-tu ? Pourquoi ?
3. Provoque volontairement trois erreurs différentes (un `;` oublié, un guillemet non fermé, un `System` écrit `system`) et note à chaque fois le message de l'IDE puis celui de `javac`.
4. Dans le dossier `sandbox`, compile et lance un programme qui affiche un dessin simple de bateau en plusieurs lignes.

## Pour aller plus loin

* [Dev.java : Your First Steps in Java](https://dev.java/learn/first-steps/) et [Your first Java code](https://dev.java/learn/first-steps/first-java-code/) : le site de tutoriels à jour d'Oracle pour les versions récentes de Java.
* [Dev.java : lancer un programme à partir de son code source](https://dev.java/learn/first-steps/first-java-code/launch-simple-source-code-programs/) (le raccourci `java Main.java`).
* [Dev.java : créer une application avec IntelliJ IDEA](https://dev.java/learn/first-steps/using-ides/intellij-idea/).
* [Documentation de la commande `javac` (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html).
* [Documentation de la commande `java` (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html).
* [`PrintStream` : méthodes `println` et `printf` (API Java 21)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/io/PrintStream.html).
* [Maven en 5 minutes](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html) et [la structure de répertoires standard](https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html).
