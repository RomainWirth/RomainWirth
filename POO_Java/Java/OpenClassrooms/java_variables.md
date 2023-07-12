# JAVA

## I. LES VARIABLES

```
Qu'est-ce qu'une variable ?
Une variable est un outil contenant une donnée, 
par exemple un mot ou un chiffre, 
et qui sera utilisée par un programme.<br>
```
Un programme manipule en permanence des variables, certaines qui lui sont données, d'autre qu'il crée lui-même.

La variable contient une valeur qu'on lui assigne.

Elle est composée comme suit : `type nom = valeur;`

### A. Nommer une variable

Le nom d'une variable doit refléter la signification de son contenu : comme une étiquette.

* **Utiliser des noms descriptifs tout au long du code**<br>
Un nom descriptif est plus pratique à long terme : cela offre une meilleure lisibilité et facilite la compréhension du code.<br>
* **Il faut être complet**<br>
On évitera d'abréger ou de raccourcir les mots, même si une version plus courte semble évidente.<br>
* **Suivre une convention d'appellation commune**<br>
Par exemple, la convention du Camel Case : une phrase composée de plusieurs mots sans espaces ni ponctuation.<br>
Le premier mot est écrit en minuscules et tous les autres mots commencent par une majuscule.<br>

### B. Déclarer une variable

Pour créer une variable, il faut la déclarer.<br>
Elle sera déclarée de cette manière : `type nom = valeur;`.

N.B. : il s'agit en fait de la déclaration et de l'assignation faite en même temps.<br>
On peut le faire en deux temps :<br>
1. déclaration : `type nom;`
2. assignation : `nom = valeur;`

exemple : 
```
int incomes = 500;

// ou 

int income;
income = 500;
```

* `int` est le type de la variable : un entier.<br>
* `incomes` est le nom de la variable.<br>
* `500` est la valeur de la variable.<br>
* l'opérateur `=` indique qu'on assigne la valeur 500 à la variable income.<br>
* le point-virgule `;` indique à Java qu'on a terminé l'instruction.<br>

### C. Modifier la valeur d'une variable avec les opérateurs

Une variable peut par définition varier.<br>
C'est-à-dire qu'elle peut changer de valeur.<br>

Pour cela, on peut effectuer plusieurs opérations :
* l'addition : `+`
* la soustraction : `-`
* la multiplication : `*`
* la division : `/`

Les mêmes règles arithmétiques s'appliquent :<br> 
d'abord ce qui est entre parenthèses,<br> 
puis la multiplication et la division,<br> 
puis l'addition et la soustraction.

Lorsqu'on modifie la valeur d'une variable, on doit simplement assigner la nouvelle valeur au nom.<br>
l'affectation est composée de 3 éléments :<br>
* le `nom` situé à gauche
* l'opérateur `=` situé au centre
* la `valeur` située à droite

On pensera bien à terminer la ligne par le `;`.

N.B. : On peut écrire un code plus court avec des opérateurs d'affectation rassourcis :<br>
`epargne = epargne + 1000;` peut s'écrire `epargne += 1000;`.

### D. Les constantes

Les constantes sont des variables qui ne seront jamais modifiées.<br>
Elles sont composées de la même manière que les variables : type, nom et valeur.<br>
la seule différence est qu'une fois définie, sa valeur ne pourra plus être modifiée.<br>

Utilité ?<br>
1. **Elles permettent aux programmes d'être plus rapides**<br>
l'ordinateur sait combien d'espace une constance prend. Lorsqu'il effectue des opérations, il n'a pas besoin de vérifier les valeurs alternatives.<br>
2. **Cela permet de s'assurer que certaines valeurs ne changent pas**<br>

Pour indiquer qu'il s'agit d'une constante, il faudra ajouter le mot clé `final` lors de sa déclaration :<br>
`final int NUMBEROFWEEKDAYS = 7;`

N.B. : par convention, le nom d'une constante est écrit en majuscule afin de mieux la reconnaître. 

## II. LES TYPES

### A. Spécifier le type d'une variable

Comme on l'a vu, les variables sont déclarées avec un _**type**_ de cette manière :<br>
`type nom = valeur;` => `int myNumber = 10;`<br>
à noter que pour utiliser une variable, il faut obligatoirement lui assigner une valeur initiale.<br>
En programmation, on déclarera souvent une variable sans lui assigner de valeur (qu'on lui assignera plus tard).<br>

Déclarer un type à une variable (même sans lui assigner de valeur) permet à l'ordinateur (au processeur) de savoir combien d'espace il va devoir réserver à la variable.<br>
Il faut utiliser un mot clé qui indique le type de variable auquel on a affaire. 

### B. Les types numériques 

Il existe 2 types numériquess :<br>
* les nombres entiers : `int`
* les nombres décimaux : : `float` ou `double`
  * double est deux fois plus précis que float : il propose plus de chiffres après la virgule.

#### Mélanger les types numériques 

On sera souvent amenés à faire des opérations mathématiques.<br>
Cependant, les variables utilisées ne seront pas forcément du même type.<br>
exemple :
```
int a = 5;
int b = 2;
int c = a / b;
```
Le résultat de `c` est `2`. Car son type est `int`, et que le type de `a` et `b` est `int`.<br>
```
float a = 5;
int b = 2;
float c = a / b;
```
Le résultat cette fois sera `2.5`. Il est nécessaire qu'au moins un des deux opérants soit du type final souhaité.<br>

On peut procéder encore autrement pour obtenir ce même résultat :
```
int a = 5;
int b = 2;
float c = (float) a / b;
```

### C. Les booléens

Le type booléen indique qu'on souhaite un résultat binaire : soit vrai (`true`), soit faux (`false`).<br>

### D. Les chaînes de caractères

Le type `String` indique qu'on à une chaîne de caractères en valeur d'une variable.

La variable sera déclarée ainsi : `String city = "New York";`.

On peut fusionner plusieurs variables de type String avec l'opérateur `+` :
```
String firstFavoriteCity = "New York";
String secondFavoriteCity = "Buenos Aires";
String favorites = firstFavoriteCity + " " + secondFavoriteCity; 
// -> "New York Buenos Aires"
```

On appelle cette opération la concaténation

## III. LES FONCTIONS

### A. INTRODUCTION 

La fonction `main` est le point d'entrée du programme.<br>
Elle est déclarée comme cela :
```
public class Lesson {
    public static void main(String[] args){
        System.out.println("Hello World !");
    }
}
```

En premier lieu, nous avons la **classe**.<br>
Une classe est un ensemble de variables (nommées _**attributs**_) et de comportements (nommés _**méthodes**_).<br>

Une fonction peut être considérée comme un bloc de code avec un nom, qui exécute un service.<br>
la fonction `main` est en fait l'exécution du programme en lui-même : **c'est le point d'entrée.**<br>

Une fonction située **à l'intérieur d'une classe** est appelée une **méthode**.<br>

Regardons le code ci-dessous :<br>
```
package hello;


public class HelloWorld {
    /** Le programme commence ici */
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```
* La première instruction : `package hello;` = déclaration de **package**.
* La déclaration : `public class HelloWorld` = définit le nom de la classe comme étant HelloWorld.<br>
En Java, l'ensemble du code doit se trouver à l'intérieur d'une classe.
* `public static void main(String[] args)` est le morceau de code que l'interpréteur (compiler) de Java recherche quand on démarre le programme.<br>
* Entre les accolades se situe le corps de la fonction.
```
N.B. :
Deux étapes sont importantes pour qu'un programme Java se lance :
La compilation et l'interprétation.
Le compilateur intervient en amont pour prendre le code du développeur et le transformer en byteCode
(ou code binaire = langage machine).
L'interpréteur traduit le byteCode en instructions pour exécuter le programme.
```

* à l'intérieur de la méthode principale, on trouve l'instruction :<br>
`System.out.println("Hello World !");`<br>
Cette instruction permet d'afficher dans la console le message attendu.

N.B. les `/* */` indique des zones de commentaires qui sont ignorées par le programme mais qui servent à rendre le code plus lisible pour l'être humain.

### B. Exécuter un programme à partir du terminal 

En Java, il y a une correspondance directe entre :
* Les packages et les dossiers
* les classes et les fichiers

Pour exécuter un programme sur un ordinateur, on doit créer des dossiers qui correspondent aux packages, et des fichiers qui correspondent aux classes.<br>
Pour écrire le code "Hello World !", on a écrit la méthode principale d'une classe HelloWorld.<br>
Cette méthode principale se trouve dans un package `hello`.<br>

Etapes pour faire correspondre avec des fichiers et des dossiers :<br>
1. On doit d'abord créer un dossier dans lequel on mettra tout le code : il s'agit du dossier racine (**root**).
2. Dans ce dossier racine, on peut créer un dossier "hello" qui correspond au nom du package.
3. Enfin, on crée un fichier HelloWorld.java dans le dossier hello, qui correspond au nom de la classe.

`=> Package vers Dossier, Classe vers fichier.`<br>

Une fois le fichier HelloWorld.java créé, on peut saisir le code Java.<br>
Lorsque tout le code est à l'intérieur du fichier, on doit convertir ce code Java en **code exécutable par une machine** que l'ordinateur peut comprendre.<br>

N.B. : quel que soit le langage de programmation, il faut traduire le code en un ensemble d'instructions qu'un ordinateur peut exécuter : le code machine.<br>

Le langage dans lequel le code Java doit être transformé est appelé **Bytecode**.<br>
Pour transformer le code Java en Bytecode, on doit utiliser le **compilateur javac**.

Pour ce faire, on va naviguer avec le terminal jusqu'au dossier racine du programme, et exécuter la commande suivante :
```
$ javac hello\HelloWorld.java
```

la commande `javac` est en fait un programme (`javac.exe` sous Windows).<br>
Cette commande crée un fichier HelloWorld.class dans le dossier Hello.<br>
Il s'agit d'un fichier binaire.<br>
On peut ensuite exécuter le programme avec la commande `java` (ou `java.exe` sous Windows) :
```
$ java hello.HelloWorld Hello World!
```

L'IDE va simplifier la vie qui se chargera d'indiquer où se situent les bugs, d'interpréter et d'exécuter tout seul le programme.

### C. Organiser le code de manière optimale

Pour rappel, le but de la fonction `main` est de démarrer le programme.<br>

Pour autant, on n'écrira pas la totalité du programme dans cette fonction.<br>
Cela pourrait donner une trop grande quantité de code à un seul endroit.<br>
Ce serait difficilement compréhensible pour l'humain et compliquerait la maintenance du code.<br>
Pour cela, on doit **organiser son code** en classes.

Bonne pratique : la méthode `main` doit être la plus courte possible, en appelant uniquement les méthodes nécessaires.<br>

il existe deux types de classes qu'on peut écrire et utiliser :
**Utiliser les classes en tant que modèles**<br> 
On peut définir des types complexes qui regroupent différents attributs représentant un concept nommé : les **classes de modèles**.<br>
On les écrit souvent pour modéliser le domaine d'une application, ce pour quoi on écrit le programme.<br>

par exemple, la classe `String` qu'on utilise pour stocker et manipuler les chaînes de caractères dans un programme.<br>
Cette classe est disponible dans le package `java.lang` (dans n'importe quelle partie de notre code).

`String` est une classe (et non pas un type primitif comme **int** ou **double**) :<br> 
* son nom commence par une majuscule.
* il définit un état et un comportement :
  * Son **état** est une chaîne de caractères qu'on stocke. La valeur réelle est définie pour chaque objet quand on l'instancie.<br>
  * Son **comportement** est l'ensemble des méthodes que la classe `String` définit, et qui permet d'opérer sur la chaîne qu'on stocke.<br>

Exemple : String possède des méthodes telles que toUpperCase() ou encore replace()
```
public class MyClass {
    public static void main(String[] args) {
        String exemple = "hello";
        
        exemple = exemple.toUpperCase();
        System.out.println(exemple);
        // output : HELLO
        
        exemple = exemple.replace("HELL", "YEAH");
        System.out.println(exemple);
        // output : YEAHO
    }
}
```

### D. Nettoyer la fonction main

Concept fondamental : **ne rien garder dans la fonction main qui puisse être extrait vers une fonction**.

Parfois, on a pas accès à la fonction `main` : souvent lorsqu'on utilise des frameworks tels que **Spring**.

exemple : 
```
package cleanHello;

public class CleanWorld {
   /** Le programme commence ici */
   public static void main(String[] args) {
      sayHelloTo("world");
   }
   
   /** affiche le message "hello" au destinataire fourni
   *
   * @param recipient
   */
   private static void sayHelloTo(String recipient) {
      System.out.println("Hello " + recipient);
   }
}
```

la classe `CleanWorld` définit deux méthodes :
1. `main` est le point d’entrée du programme.<br> 
Son seul job, c'est de transmettre le travail à la méthode sayHello avec l'argument dont elle a besoin.<br>
Dans notre cas, c'est le destinataire prédéfini de notre hello : the world !<br>
2. La méthode `sayHello` imprime la chaîne « Hello »<br> 
et ajoute la valeur fournie à la variable destinataire `recipient` lorsqu'elle est appelée par la méthode `main`.

Rien n'a changé en termes de fonctionnalité. On peut cependant ajouter plus de logique au message qu'on va afficher en changeant la méthode `sayHello` et en personnalisant le nom du destinataire.<br>

## LA PORTEE DES VARIABLES

### A. Le principe de portée des variables

Une variable n'est **disponible** (et accessible) que **dans le contexte dans lequel elle a été déclarée**.<br>
Pour déterminer cela, on utilisera les accolades ouvrantes et fermantes : `{` & `}`.

Si la variable est déclarée dans le corps, entre les accolades, elle ne sera disponible que dans ce domaine.<br>
On parle alors de **scope** (portée en français).

La portée d'une variable peut être _locale_ ou _globale_, en fonction de l'endroit où elle a été déclarée.<br>
Une variable globale peut être disponible dans toutes les classes et méthodes d'un programme.<br>
Une variable locale n'est disponible que dans la méthode dans laquelle elle a été déclarée.<br>

### B. Déterminer la portée de la variable dans les classes

Les mêmes règles générales concernant la portée s'appliquent pour une classe.<br>
Chaque variable n'est accessible qu'au sein de son bloc de déclaration.

La portée d'une variable délimite son accessibilité. On peut cependant accéder aux champs de classe en dehors de la classe.<br>

exemple : 
```
Unicorn unicorn = new Unicorn();

System.out.println("I know it's height: "+unicorn.height);

// et peut changer son pouvoir !
unicorn.power = 0; // pas drôle!
```

### C. Implémenter un contrôle d'accès

Le contrôle d'accès est implémenté à une variable, une classe, un module ou un fichier.<br>

Un fichier de code est aussi appelé un **fichier source**.<br>
Un module est un ensemble de fichiers sources associés à un nom (comme un framework).<br>

**Désigner un niveau de contrôle :**<br>
En java, on doit utiliser des mots clés pour désigner un niveau de contrôle :<br>
* **public** : visible pour tous et donc le moins restrictif.
* **protected** (protégé) : visible pour le package et l'ensemble des sous-classes.
* **package-protected** (protégé par paquet) : généralement visible uniquement par le package dans lequel il se trouve (paramètres par défaut).<br>
Ne pas mettre de mot clé déclenche ce niveau de contrôle.
* **private** (privé) : accessible uniquement dans le contexte dans lequel les variables sont définies<br>
(à l'intérieur de la classe dans laquelle il est situé).

**Déterminer une hiérarchie de contrôle :**<br>
public > protected > package-protected (par défaut) > private

## IV. ECRIRE DES BOUCLES DANS LES FONCTIONS


