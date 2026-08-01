# Mon Premier Programme

## L'environnement de développement

IDE Intellij IDEA (Community Edition est gratuit)
VSCode avec plugins

ce cours utilise Intellij

## Mon premier projet

Interface propose d'ouvrir un projet existant, ou alors de créer un nouveau projet. 

### Créer un nouveau projet

cliquer sur l'interface : `nouveau projet`.

* Il va falloir renseigner un nom : `MyFirstProject` par exemple
* Il faudra ensuite choisir l'emplacement sur l'ordinateur : 
* Choisir la version de Java : La JDK. Il est possible d'installer la version que l'on souhaite. Ici, ce sera la version 21. 
* Puis cliquer sur ...

Une fenêtre d'IDE va s'ouvrir avec le nouveau projet : 
Le volet de gauche est l'explorer : 
* il contient l'arborescence du projet. 
* On peut remarque qu'on possède déjà un dossier `src` qui contient un fichier Java `Main`. 
* Ce qui nous amène à comprendre que les fichiers du projet vont se trouver dans ce dossier `src`. 
* On peut aussi voir que notre projet est associé à la librairie standard de Java : ici, 21 car on a choisi la version JDK 21

La partie centrale de la fenêtre contient la visualisation des fichiers sélectionnés dans l'explorer :
* en sélectionnant le fichier `Main`, on va voir la structure de notre fichier
```Java
public class Main {
    public static void main(String[] args) {
        //TIP Press <shortcut actionId="ShowIntentionActions"/> with your caret at the highlighted text
        // to see how IntelliJ IDEA suggests fixing it.
        System.out.printf("Hello and welcome!");

        for (int i = 1; i <= 5; i++) {
            //TIP Press <shortcut actionId="Debug"/> to start debugging your code. We have set one <icon src="AllIcons.Debugger.Db_set_breakpoint"/> breakpoint
            // for you, but you can always add more by pressing <shortcut actionId="ToggleLineBreakpoint"/>.
            System.out.println("i = " + i);
        }
    }
}
```
* on peut remarquer qu'en marge gauche de ce panel, on voit une flèche verte, qui quand on clique dessus, ouvre une popover avec différentes commandes.
* la première commande `Run 'Main.main()'` permet de lancer notre programme dans le terminal intégré qui apparaît si on clique dessus.
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=32895 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Hello and welcome!i = 1
i = 2
i = 3
i = 4
i = 5

Process finished with exit code 0
```

On va modifier le code écrit dans la fonction `main()` : 
```Java
public class Main {
    public static void main(String[] args) {
        System.out.printf("Hello world !");
    }
}
``` 
Puis relancer le programme en cliquant sur la flèche verte puis sur `Run 'Main.main()'`.
```
/home/romainwirth/.jdks/ms-21.0.12/bin/java -javaagent:/app/lib/idea_rt.jar=43805 -Dfile.encoding=UTF-8 -Dsun.stdout.encoding=UTF-8 -Dsun.stderr.encoding=UTF-8 -classpath /home/romainwirth/dev/sandbox/Java-MyFirstProject/out/production/Java-MyFirstProject Main
Hello world !
Process finished with exit code 0
```

> Attention, l'interface graphique de l'IDE peut varier selon les versions utilisées, mais globalement, tous fonctionnent de la même manière. On peut également modifier l'apparence de l'IDE via les settings.

## Compilation et exécution

Dans cette section on va voir ce qu'il se passe derrière l'exécution de la commande `Run 'Main.main()'` depuis le panel de la flèche verte.
En réalité, il y a deux opérations qui se font : 
* La compilation
* L'exécution du programme

### La compilation

Lorsqu'on lance cette opération, c'est la commande `javac` qui sera exécutée sur le fichier en cours. 

Le compilateur est lui-même un programme qui prend en entrée un fichier java afin de le compiler ce qui permet d'obtenir en sortie un nouveau fichier généré qui lui a pour extension `.class`.

Lorsque le fichier correspondant `.class` apparaît, on comprend que la compilation a été un succès. 

En cas d'erreur, par exemple au niveau de la syntaxe, le compilateur ne peut pas faire ce qu'on lui demande : générer ce fichier `.class`.

Le fichier `.class` est en réalité le fichier `exécutable` java que l'on va chercher à lancer. 

### L'exécution du programme

Maintenant, pour lancer le programme manuellement, il faudrait lancer dans le temrinal la commande `java <nom-du-fichier>.class`.

Cette commande va donner l'ordre à la machine virtuelle java installée sur l'ordinateur de jouer ce programme.

En réalité, sur l'ordinateur, on a ce qu'on appelle une `jvm` : une machine virtuelle en java qui est là pour exécuter des programmes Java. 
C'est grâce à cette commande Java que l'on va donner la consigne à la JVM d'exécuter le programme.

### Modification du programme

À chaque modification du programme : lorsqu'on change des lignes de code, il faudra compiler de nouveau le fichier `.java` en `.class` avec la commande `javac`, afin de pouvoir ensuite l'exécuter grâce à la commande `java`. 

Sans cette opération, si on lance directement `java` suivi de notre fichier `.class`, on ne verra aucun changement s'opérer en sortie. 

Si on supprime le fichier `.class` et qu'on lance la commande d'exécution, on aura une erreur qui va remonter dans le terminal. Il sera nécessaire de compiler de nouveau avant de lancer l'exécution.

À l'intérieur de ce fichier `.class` il y a ce qu'on appelle du bytecode, qui est interprêté par la machine virtuelle lorsqu'on lance l'exécution du programme avec la commande `java`. Le bytecode est le résultat de la compilation, il s'agit de code incompréhensible pour nous et qu'on ne touchera jamais directement, uniquement au travers de notre fichier `.java` qui sera compilé en bytecode dans le `.class` puis exécuté par la jvm.

Lorsqu'on lance l'exécution de `Run 'Main.main()'` via la flèche verte, on lance en réalité les deux opération en une fois, ce qui donne le résultat obtenu plus haut. 

On peut remarquer dans le panel de gauche qu'un nouveau dossier `out` a été créé, qui contient des dossiers encapsulés et au bout, un fichier `.class` généré par la compilation.
C'est la raison pour laquelle on passe par un IDE pour compiler et lancer le programme : nous simplifier la tâche. 

> N.B. : VSCode, grâce à ses plugins, permet d'obtenir les mêmes fonctionnalités : on retrouvera une flèche permettant de compiler et exécuter le programme Java. 

## Mon premier programme

Dans notre fichier `Main.java`, on retrouve ce code : 
```Java
public class Main {
    public static void main(String[] args) {
        System.out.printf("Hello world !");
    }
}
```

Le langage Java est un langage de programmation composé de mots clés qui sont connus du langage afin de les utiliser pour écrire notre code source. 
L'IDE connaît également ces mots clés et les affiche d'une certaine couleur afin que l'on puisse les détecter rapidement.

La première ligne : `public class Main {}`
* Il s'agit de la définition d'une `public Class` appelée `Main`.

Cela nous indique qu'un fichier Java est composé de la définition d'une classe. 

> La classe Main est le point d'entrée de notre programme Java. 

Une chose importante à respecter : le fichier `.java` doit avoir exactement le même nom que la classe qui est définie à l'intérieur de celui-ci. 
La raison est que le fichier a pour objectif d'être compilé : tout ce que l'on écrit à pour objectif d'être donné au compilateur, et compilé grâce à la commande `javac`. 
Le compilateur s'attend à trouver dans le fichier une classe qui porte le même nom que le fichier et que l'on demande à compiler.

Si le nom de la classe n'est pas le même que celui du fichier, à la majuscule près, le compilateur sera alors mis en échec et ne pourra pas générer le fichier `.class`

* On retrouve aussi le principe des accolades `{}`, une ouvrante et une fermante, qui vont regrouper le corps de la classe en marquant le début et la fin du corps de cette classe.  
Tout le code que l'on va écrire va devoir se retrouver entre ces accolades. 

à l'intérieur des accolades, une méthode : `public static void main(String[] args) {}`
* la méthode `main` est la méthode principale

> attention, ce nom `main` n'a rien à voir avec le nom de la classe qui lui comporte un m majuscule : `Main`.

Cette méthode main est le point d'entrée du programme. C'est cette méthode qui va nous permettre d'éxécuter le programme car c'est elle qui sera jouée lors du lancement du programme. 

Le compilateur connaît cette méthode, c'est à dire qu'elle a une signature particulière avec ce `public static void`, suivi de son nom `main`, et le paramètre qu'elle prend : une chaîne de caractères `String[]`.
Une méthode définie de cette manière est connue par le compilateur comme étant un point d'entrée au programme. 
C'est en compilant un fichier avec cette méthode, portant ce nom précis, que le programme pourra être lancé avec la commande Java. 

L'IDE connaît bien aussi cette méthode, c'est à dire que si on s'amuse à la supprimer, l'IDE va suggérer directement de construire cette méthode et va nous aider à l'écrire. 
Dans le corps de la classe `Main`, si la méthode `main` n'est pas présente, on tape `m` et l'IDE propose directement le raccourci permettant d'écrire la méthode `public static void main`. Il suffit de taper sur entrée pour que l'IDE la rajoute automatiquement.

* On retrouve aussi les accolades `{}` qui vont contenir le corps de la méthode
C'est ici qu'on va écrire ce qui sera exécuté lorsque le programme sera lancé, qui va exécuter séquentiellement les instructions écrites dans cette méthode. 

`System.out.printf("Hello world !");` est la fonction qui permet d'_imprimer_ dans le terminal le contenu de la fonction printf. 
On peut aussi modifier pour utiliser println à la place. 
Quand on commence à écrire dans le corps de la méthode, l'IDE nous aide en faisant des suggestions, ce qui permet parfois d'éviter de tout taper.
Cette fonctionnalité de l'IDE permet de nous aider et de réduire considérablement le nombre d'erreurs syntaxiques. 
Il faut toujours respecter une chose : tout ce qui s'ouvre doit de fermer, une accolade, une parenthèse, une double quote, etc.

Si on écrit plusieurs lignes dans le corps de la méthodes, les lignes sont exécutées séquentiellement (l'une après l'autre).

Il existe des raccourcis dans intellij : par exemple, pour `System.out.println`, il suffit de taper `sout` puis tab pour écrire la fonction directement. 