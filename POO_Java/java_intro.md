# INTRODUCTION A JAVA

Introduction à Java : <a href="https://www.codecademy.com/courses/learn-java/lessons/hello-world-java/exercises/introduction-to-java">codecademy</a>

## La programmation avec Java

Les langages de programmation permettent aux humains d'écrire des instructions qu'un ordinateur pourra exécuter.<br>
Avec des instructions précises, les ordinateurs coordonnent les applications et systèmes qui font fonctionner le monde moderne.<br>

L'entreprise <a href="https://en.wikipedia.org/wiki/Sun_Microsystems">Sun Microsystems</a> a sorti en 1995 le langage de programmation Java.<br>
Java est connu pour être simple, portable, sécurisé et robuste.<br>
Malgré sa sortie il y a plus de 25 ans, Java reste l'un des plus populaires parmis les langages de programmation aujourd'hui.<br>

L'une des raisons pour sa popularité vient de la "Java Virtual Machine", qui garantit que le même code Java peut être exécuté sur différents OS et plateformes.<br>

```
Le slogan de Sun Microsystems pour Java : "Write once, run everywhere".
```

Les langages de programmation sont composés se _syntaxe_ : des instructions spécifiques que Java comprends.<br>
On écrit la syntaxe dans des fichiers pour créer des _programmes_, qui sont exécutés par les ordinateurs pour effectuer une tâche souhaitée.<br>

## Hello Java File !

Java fonctionne sur différentes plateformes, mais est écrit de la même manière par les programmeurs.<br>

Il s'agit d'un langage de programmation compilé.<br>
Cela signifie que le code écrit sur un fichier **.java** est transformé en "byte code" par un compilateur avant d'être exécuté par la VM Java sur l'ordinateur.<br>

### Getting started : Hello World

```
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World !");
    }
}
```
la class "HelloWorld" contient ma méthode main() qui renvoit ici l'impression dans la console de "Hello World !".<br>
`public`, `static` et `void` sont des éléments de syntaxe de Java.<br>
`String[] args` est un espace réservé (placeholder) pour des informations qu'on veut passer au programme.<br>
Cette syntaxe est nécessaire pour permettre au programme de fonctionner.

l'élément `System.out.println("Hello World !");` permet au programme d'afficher dans la console "Hello World !".

### la déclaration "Print"

`System.out.println("Hello World !");` fait ressortir l'information "Hello World !" dans la console.<br>

* `System` est une classe intégrée de Java qui contient des outils utiles pour des programmes.
* `out` est un raccourcis pour "output".
* `println` est un raccourcis pour "print line".

On utilisera cette déclaration : `System.out.println()` à chaque fois qu'on souhaite que le programme crée une nouvelle ligne dans la console.<br>

### Commenter le code 

L'écriture du code ne suffit pas pour comprendre le code.<br>
Il est toujours nécessaire de commenter correctement son code lorsque c'est nécessaire.<br>

En effet, d'autres personnes lirons le code, et des précisions seront souvent nécessaires.<br>
Nous serons également ammenés à relire notre code, souvent plus tard. Les commentaires seront donc utiles pour nous aider à la relecture.<br>

``` 
N.B. : Il faut toujours coder en gardant à l'esprit que la personne qui reprendra notre code 
est probablement un psychopathe tueur en série qui sait ou on habite !
```

Pour ajouter des commentaires en Java, nous aurons deux options :
1. l'utilisation de `//` pour commenter une ligne.
2. L'utilisation de `/* */` pour commenter un groupe de lignes.

```
// Commenter une ligne

/* 
Commenter 
un groupe 
de lignes
*/
```

### Les point-virgules et les Whitespaces

Java n'interprète pas les espace blancs (whitespace) : les zone de code sans syntaxe.<br>
Mais l'être humain utilise ces espaces pour rendre lisible son code.<br>

En revanche, Java interprète les point-virgules `;`.<br>
Le point-virgule indique à Java qu'on a terminé une instruction (une ligne de code qui effectue une tâche unique).<br>

Attention, il n'y aura pas de point-virgule après les accolades `{}` qui indiquent un certain nombre d'instructions.<br>


### Les erreurs

Java est un langage de programmation compilé.<br> 
Cela signifie que le code qu'on écrit dans un fichier **.java** est transformé par un compilateur avant d'être exécuté par la Java Virtual Machine de l'ordinateur.<br>

Le compilateur (compiler) est un programme qui traduit des langages "human-friendly" dans un autre langage de programmation que l'ordinateur peut exécuter.<br>

Le processus de compilation peut attrapper des erreurs avant que l'ordinateur n'exécute le code.<br>

Java procède à une série de vérifications pendant qu'il transforme le code.<br>
Le code qui ne passe pas ces vérifications ne sera pas compilé.

Pour compiler un fichier, on utilisera dans la console du terminal la commande :
```bash
javac File.java
```
Une compilation qui passe les vérifications produit un fichier avec l'extension `.class`.

Nous pourrons exécuter ce fichier avec la console avec la commande :
```bash
java File
```

Une compilation qui ne passe pas les vérifications produira une liste d'erreurs.<br>
Il n'y aura pas de fichier `.class` tant que les erreurs ne seront pas corrigées et que la commande de compilation ne sera pas exécutée de nouveau.<br>

### La compilation : création d'exécutables

La compilation aide à attrapper les erreurs.<br>
Une fois les erreurs corrigées, la compilation exécutée, la commande produit un "exécutable" class.<br>
`FileName.class` 

Exécutable signifie qu'on peut exécuter le program depuis le terminal.

On utilisera la commande : 
```bash
java FileName
```

à noter qu'on utilisera pas l'extension `.class` lors de l'exécution de la commande.
