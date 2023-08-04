# JAVA

## INTRODUCTION A LA PROGRAMMATION ORIENTEE OBJET (POO)

Qu'est-ce qu'un objet ? 

Il s'agit d'une sorte de catégorie.<br>
Un objet fait partis d'un groupe ou d'un type. Des objets peuvent avoir des points communs entre eux.<br>
Exemple :<br> 
il existe différents types de livres, mais ils ont tous un titre, un auteur, une couverture, des pages, etc.<br>
en d'autres termes, les objets livres ont tous des attributs (ou propriétés) similaires qui nous permettent de les classer dans la catégorie "livres".<br>
Les attributs sont une sorte de "plan" pour l'objet "livre".<br>

En programmation, on appelle ça une **_"classe"_**.<br>

Pour créer un livre, on se base sur le plan correspondant.<br>
Le livre créé a besoin d'un titre (nom). tout comme les variables en programmation.<br>

Un objet est donc une sorte de super-variable.<br>
Un objet est issu d'une classe : c'est une instance de classe.<br>
Avant de créer un objet, il faut construire la classe.<br>

### CONCEVOIR DES CLASSES

Une classe possède des attributs. Dans l'exemple de la classe livre, les attributs sont :<br>
* le titre
* l'auteur
* le nombre de pages
* l'éditeur

On appelle cela **attributs de classe** en langage Java.<br>
Il s'agit en fait de variables internes à la classe.

Pour déclarer une classe, on utilisera le mot clé **class**, suivi de son nom et d'accolades qui délimiterons le champs de la classe.<br>
Les attributs seront directement ajoutés au début du corps de la classe :
```
class Book {
    String title;
    String author;
    int numberOfPages;
    String publisher;
}
```

### UTILISER DES CLASSES

Pour utiliser une classe et donc créer un objet de classe, on va devoir instancier la classe.<br>
Cette instanciation crée un objet spécifique.<br>
par exemple la classe livre peut avoir une instance "Alice au pays des merveilles".<br>

Le processus s'appelle l'**instanciation**.

### CREER DES INSTANCES DE CLASSE

Pour créer une instance de classe, on doit ajouter dans la classe un constructeur de classe.<br>
Il s'agit d'une méthode appelée "constructor".<br>

Le constructeur est une sorte de fonction interne de la classe, qui indique comment instancier la classe.<br>
Cette fonction a le même nom que la classe à laquelle elle appartient.<br>
A l'intérieur de cette fonction, on utilise les paramètres pour initialiser les attributs de notre objet avec le mot clé `this`.<br>
```
class Book {
    //Attributs de classe
    String title;
    String author;
    int numberOfPages;
    String publisher;
      
    //Constructeur de la classe Book
    Book(String title, String author, int numberOfPages, String publisher) {
        //Initialise l’attribut title avec la valeur de l’argument title
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.publisher = publisher;
    }
}
```
Il est possible de déclarer plusieurs constructeurs qui seront différenciés par _la signature_ de la fonction constructeur.<br>
La signature correspond à l'ensemble [nom(paramètres)] du constructeur.<br>

Pour créer une nouvelle instance de la classe, on procédera ainsi :
```
Book myBook = new Book("L'art de coder", "Nom de l'auteur", 425, "maison d'édition");
```
Dans le code ci dessous, nous avons de gauche à droite :
1. `Book` qui correspond au type complexe Book, créé par la classe Book.<br>
(Quand on crée une classe, on crée en fait un type complexe qui peut être réutilisé plus tard quand on crée un objet du type de la classe).<br>
2. `myBook` correspond au nom de l'objet créé.<br>
3. `=` opérateur d'assignation.<br>
4. `new` est le mot clé permettant d'indiquer qu'on crée une nouvelle instance de la classe Book.<br>
5. `Book` est le nom de la classe et fait référence au constructeur de la classe Book.<br>
6. `("L'art de coder", "Nom de l'auteur", 425, "maison d'édition")` correspond aux paramètres à renseigner lors de l'appel du constructeur de classe.<br>

Maintenant qu'on a instancié notre classe Book avec la création de l'objet myBook, on peut accéder à ses propriétés (attributs).<br>
La façon courante d'accéder aux champs consiste à utiliser le point (`.`).<br>
On va donc écrire le nom de l'instance (objet) suivi d'un point et du nom de la propriété à laquelle on souhaite accéder :<br>
`instanceName.attributeName`

exemple :
```
myBook.title = "Coding is Art"

myBook.author = "Becky James";

myBook.numberOfPages = myBook.numberOfPages + 10;
```
On peut ainsi modifier les valeurs des champs à l'intérieur de l'objet.<br>

#### RESUME

Structure d'une classe : 3 parties<br>
1. Attributs (ou propriétés)
   * Un attribut se déclare (comme une variable)
   * Il y a trois types d'attributs : 
     * Public = accessible depuis l'extérieur, via la référence sur l'attribut de la classe
     * Privé = Même si on dispose de leur référence à l'objet, on ne peut pas accéder à l'attribut 
     * Protégé = ces attributs sont publics, mais uniquement pour la descendance (voir héritage)
2. Constructeurs<br>
   * Il s'agit de méthodes particulières qui permettent l'élaboration de l'objet 
   * Il est possible d'avoir plusieurs constructeurs qui vont différer grâce à leurs paramètres
   * Il existe un paramètre par défaut
3. Méthodes
   * Il existe des méthodes publiques, privées ou protégées 
   * Permettent la manipulation de la classe
   * Ce sont des services rendus aux autres classes "utilisatrices"

Il existe une méthode particulière : `toString`.<br>
Cette méthode permet d'afficher l'objet créé. il s'agit d'un Getter<br>

Nous avons deux méthodes particulières : les **Getters** et les **Setters**.<br>
Les _Getters_ permettent de récupérer les données.<br>
Par convention, un getter sera appelé : `getNomDeLAttribut`.<br>
Les _Setters_ permettent d'affecter des valeurs aux attributs.<br>
Par convention, un setter sera appelé : `setNomDeLAttribut`.<br>

voir cette <a href="https://youtu.be/On0X8RLMqko">ressource</a>

## SPECIALISER LES CLASSES AVEC L'HERITAGE ET LE POLYMORPHISME

### L'HERITAGE

Différentes classes peuvent avoir des points communs.<br>
par exemple, un livre et un cd ont tous les deux un titre, un auteur.<br> 
Ils ont également des éléments particuliers : le livre un nombre de pages, le cd une durée.<br>

L'idée est que le socle commun peut être mutualisé.<br>
Pour cela, on créera une **classe mère**.<br>
Les classes qui ont ce socle commun sont appelées des **classes filles**.<br>
l'héritage permet aux classes filles de reprendre les mêmes attributs et méthodes que leur classe mère,<br> 
et d'ajouter en plus leurs particularités en les spécialisant par des attributs et/ou méthodes qui leur sont propres.

La classe mère est considérée comme la "référence" et grâce au mécanisme d'héritage, on partagera ses attributs et ses méthodes à ses classes filles.<br>

L'idée derrière la notion d'héritage est la possibilité d'enrichir ou de modifier des instances de classe (objets) :<br>
` Animal > Mammifère > Humain `<br>
On introduit la notion de `super-classe` et la notion de hiérarchie de classe<br>

Attention :
* un champs défini comme private ne peut pas être hérité ni manipulé par la classe fille. 
  * cf. encapsulation
  * un élément public peut être manipulé
  * un élément privé est protégé
* en Java, une classe fille ne peut hériter que d'une seule classe mère.
* une classe mère peut en revanche avoir plusieurs filles.

exemple :<br>
Création d'une classe mère `FigureGeometrique`
```
public class FigureGeometrique {
    // attributs
    private int x;
    private int y;
    
    // constructeur
    public void moveTo(int newX, int newY) {
        this.x = newX;
        this.y = newY;
    }
}
```
Puis création d'une classe fille `Carre`
```
public class Carre extends FigureGeometrique {
    // attributs
    private long cote;
    public long getCote() {
        return cote;
    }
    public long getPerimetre(){
        return 4*cote;
    }
}
```
Avec la classe `Carre`, on récupère automatiquement les attributs de la classe mère `FigureGeometrique`.<br>
On lui ajoute un nouvel attribut de classe et 2 nouvelles méthodes permettant sa spécialisation.<br>

Lorsqu'on fait l'héritage, tous les champs sont hérités. Ils peuvent être manipulés **si leur accessibilité le permet**.<br>

#### Initialiser les attributs hérités

L'initialisation des attributs d'une instance de classe se fait dans le constructeur de classe.<br>
Quand des attributs sont hérités, on peut les initialiser dans le constructeur de la fille en appelant le constructeur de la classe parent.<br>

exemple :<br>
création d'un constructeur dans la classe mère
```
class FigureGeometrique {
    private int x;
    private int y;
    FigureGeometrique(int x, int y) {
        this.x = x;
        this.y = y;
    }
}
```
utilisation de ce constructeur dans la classe fille 
```
class Carre extends FigureGeometrique {
  long cote;
  Carre(long cote, int x, int y){
     //Appel du constructeur de la classe mère FigureGeometrique
     super(x, y);
     this.cote = cote;
  }
}
```
En java, pour appeler le constructeur de la classe mère depuis le constructeur de la classe fille, on utilise la méthode **super**.<br>
Cette méthode fait directement référence à la méthode écrite dans la classe parent, ici le constructeur. (voir polymorphisme)

#### EN RESUME

1. L'héritage permet d'étendre une classe.
   * En modifiant son comportement via des constructeurs et des méthodes.
   * En rajoutant des attributs et des méthodes.
2. L'héritage ne permet pas en pratique de supprimer des méthodes ou des attributs.
   * Possibilité de surcharger des méthodes avec un code "vide".
3. L'héritage donne la possibilité de définir des "généalogies complexes".
4. Il n'y a pas d'héritage multiple en Java.

### LE POLYMORPHISME

Lorsqu'on construit une classe héritant d'une autre classe, on peut redéfinir certaines méthodes de la classe mère.<br>
Il s'agit de remplacer le comportement de la fonction qui a été définie par la classe mère.<br>

Ce concept s'appelle le **polymorphisme**.<br>
L'idée est de pouvoir utiliser le même nom de méthode sur des objets différents.<br>
Cela n'a de sens que si le comportement des méthodes est différent.<br>
Le polymorphisme permet de modifier le comportement d'une classe fille par rapport à sa classe mère.<br>
Cela permet d'utiliser l'héritage comme un mécanisme d'extension en adaptant le comportement des objets.<br>

#### redéfinir une méthode d'une classe parente

exemple :<br>
Nous avons une classe mère `Animal` qui possède la méthode `deplacer()` :
```
class Animal {
    void deplacer() {
      System.out.println("Je me déplace");
    }
}
```
En appliquant le principe de polymorphisme dans les classes filles `Chien`, `Oiseau` et `Pigeon`, on obtient ceci :
```
class Chien extends Animal {
   void deplacer() {
      System.out.println("Je marche");
   }
}
```
```
class Oiseau extends Animal {
   void deplacer(){
      System.out.println("Je vole");
   }
}
```
```
class Pigeon extends Oiseau {
   void deplacer() {
      System.out.println("Je vole surtout en ville");
   }
}
```
On peut appeler `deplacer()` sur toutes les classes. Le polymorphisme permet d'appeler la méthode adéquate selon le type d'objet.
```
public class Test {
    public static void main(String[] args) {
        Animal a1 = new Animal();
        Animal a2 = new Chien();
        Animal a3 = new Pigeon();

        a1.deplacer();
        a2.deplacer();
        a3.deplacer();
    }
}
```

#### Appeler une méthode d'une classe parente

La redéfinition des méthodes dans la classe fille remplace tout le code de la méthode mère.<br>
Parfois, c'est un fonctionnement idéal, <br>
et parfois, on souhaite quand même appeler le code de la classe mère en y ajoutant autre chose dans la classe fille.<br>

exemple :
```
class Chien extends Animal {
   void deplacer() {
      super.deplacer();
      System.out.println("ouaf ouaf");
   }
```

**_Attention_**, dans le cas d'un héritage multiple (classe mère > classe fille > classe petiteFille),<br> 
il est seulement possible d'accéder à l'implémentation de la classe parente et pas plus.

#### Utiliser les annotations 

En Java, il existe des types spéciaux commençant par `@` : ce sont les **annotations**.<br>
Ces types servent à préciser le comportement d'une classe, d'une méthode, d'un attribut ou même d'une variable.<br>
Les annotations donnent des informations au compilateur pour l'exécution du code de notre programme.

L'une des annotations les plus connues et utilisées est `@Override`.<br>
Elle est utilisée en complément du polymorphisme pour indiquer que la méthode annotée est une redéfinition d'une méthode de la classe mère.<br>
si l'annotation est présente sur une méthode, le compilateur va vérifier que la signature de la méthode est bien identique à celle de la méthode dans la classe mère.<br>

exemple :
```
class Animal {
   void deplacer() {
   System.out.println("Je me déplace");
}
class Chien extends Animal {
   @Override
   void deplacer() {
      System.out.println("Je marche");
   }
}
```

### EN RESUME

**L'héritage** est un concept fondamental en java qui permet de réutiliser du code d'une classe mère.<br>
**Le Polymorphisme** permet de "surcharger" les méthodes de la classe mère pour redéfinir leurs comportements sans changer leur signature.<br>

## GERER LES PILES DE DONNEES AVEC LA BONNE COLLECTION

Java propose une structure de données capable de contenir un nombre fixe de valeurs d'un même type.<br>
cette structure s'appelle un **tableau** (ou **Array**).

### Utiliser un tableau pour stocker un nombre fixe d'éléments

Un **tableau** est un liste ordonnée et numérotée d'éléments du même type.<br>
Chaque élément est associé à un numéro appelé **index**.<br>
L'index commence par 0.<br>

La **Déclaration** d'un tableau utilise la même syntaxe que n'importe quelle variable.<br>
On doit fournir :<br>
* Le **type** des éléments que le tableau contiendra, suivi de `[]`.
* Le **nom** de la variable qui doit expliciter clairement l'intention du tableau.

exemple :
```
// Déclarez la variable
int[] cupsOfCoffeePerDayOfTheWeek;

// Créez le tableau et assignez-le à la variable
cupsOfCoffeePerDayOfTheWeek = new int[7];
```
Lorsque le tableau est créé, chaque élément est initialisé avec la valeur par défaut du type du tableau.<br>
Dans le cas d'un tableau de `int`, le tableau est initialisé avec la valeur `0`.

On peut aussi déclarer un tableau en une seule ligne : `Type [] nomDuTableau = new Type [nombreDElements];`
```
int[] myArray = new int[3];
```

Une fois le tableau créé, on peut y effectuer deux opérations :
1. **Accéder** à une valeur à un index donné.
2. **Définir** une nouvelle valeur à un index donné.

Dans les deux cas, on utilise le nom de la variable suivi du crochet d'ouverture, de la valeur de l'index souhaité et du crochet de fermeture.<br>
```
// Attribuez la valeur 3 au cinquième jour de la semaine
// C'est l'index 4, puisque le premier index est 0
cupsOfCoffeePerDayOfTheWeek[4]=3;

//Afficher le nombre de cafés le premier jour de la semaine
System.out.println(cupsOfCoffeePerDayOfTheWeek[0]);
```

#### Les tableaux multidimentionnels 

Un tableau ne contient qu'une seule ligne et plusieurs colonnes.<br>
Dans le cas d'un tableau multidimentionnel, on aura un tableau qui contient plusieurs lignes et plusieurs colonnes.<br>

Un tel tableau se déclare ainsi :<br>
```
// Créez un tableau multidimensionnel pour gérer tous les rangs d'un théâtre
String[][] myTheatreSeats = new String[30][12];
// Rang 10, siège 6. N'oubliez pas que l'index commence à 0!
myTheatreSeats[9][5] = "James Logan";
```

Les tableaux sont efficaces et parfaits pour gérer un nombre fixe d'éléments.<br>
Dans la pratique, on doit souvent gérer un nombre variable d'éléments.<br>
Pour cela, on va utiliser les **collections**.<br>

### Utiliser les listes si le nombre d'éléments n'est pas fixe

Un tableau est assez limité : on ne peut pas insérer d'élément supplémentaire, on peut seulement remplacer des éléments.<br>
On va alors utiliser une **liste ordonnée**.<br>

Comme ces listes sont modifiables, on peut modifier leur contenu et le nombre d'éléments d'une collection.<br>
Une liste se déclare ainsi :<br>
```
List<String> myList = new ArrayList<String>();
```
Voici un aperçu de ce que l'on peut faire avec les listes :<br>
* **accéder** à chaque élément via son index
* **ajouter** (append) un nouvel élément à la fin
* **insérer** un nouvel élément à un index spécifique
* **supprimer** un nouvel élément à un index spécifique

Attention ! Malgré la puissance de `ArrayList`, on ne peut pas changer le **type**. On ne pourra changer que la valeur des éléments.<br>

Il existe plusieurs classes qui utilisent des listes. La plus utilisée étant `ArrayList`.<br>
On peut créer notre propre classe, l'important est d'utiliser l'**interface** `List` sur notre classe.<br>

N.B. : une interface est une classe définissant les signatures des méthodes que devront implémenter toutes les classes qui l'implémentent.<br>

C'est un contrat imposé par celui qui l'écrit à toutes les classes qui l'utiliseront.<br>
Ce contrat définit toutes les opérations qu'une classe doit fournir.<br>
_Voir toutes les opérations prises en charges et la manière d'utiliser les classes ici : <a href="https://docs.oracle.com/javase/tutorial/collections/interfaces/list.html">Tuto Java</a>_

### La classe ArrayList

#### Créer une liste et ajouter des éléments

Pour créer une liste, on doit : 
1. Déclarer une variable dont le type est l'interface `List`.<br>
Cela signifie qu'on peut assigner n'importe quel objet à la variable qui met en place l'interface `List`, y compris la classe `ArrayList`.<br>
2. Initialiser la variable avec une expression commençant par le mot clé `new` qui crée une intance de la classe `ArrayList`.

On peut procéder en une seule ligne avec la syntaxe suivante : Type nom = new [Type de liste]<br>
`List<Integer> myList = new ArrayList<Integer>();`<br>
* Type : **List<Integer>**
* nom : **myList**
* opérateur d'affectation : **=**
* mot clé : **new**
* Type de liste : **ArrayList<Integer>()**

1. La déclaration a lieu avant l'opérateur d'affectation `=`.<br>
On déclare d'abord le type `List` suivi directement du paramètre de type (ici <Interger>).<br>
Le paramètre de type limite le type d'objets qui peuvent être stockés dans la liste (ici des nombres entiers).<br>
2. la création en tant que telle a lieu avec l'expression `new ArrayList<Integer>()`.<br>
L'objet initialisé est assigné à la variable myList.

Le terme `Integer` est écrit en toutes lettres avec une majuscule. la raison est qu'**une liste ne peut stocker que des objets**, et pas de types primitifs.<br>
De la même manière, on doit utiliser :
* `Double` au lieu de `double` si on veut stocker des décimales
* `Boolean` au lieu de `boolean` si on veut enregister des valeurs vraies/fausses
* `Float` au lieu de `float` si on insiste vraiment pour les utiliser

La version objet des types primitifs est très utile car équipée de méthodes.<br>
Voir la doc officielle <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/Integer.html">oracle</a>

Pour ajouter des éléments à la liste, on doit procéder un par un :
``` 
List<Integer> myList = new ArrayList<Integer>();
myList.add(7);
myList.add(5); //-> [7,5]
```
La première affectation crée une liste vide appelée `myList`.<br>
On ajoute le premier élément avec l'affectation : `myList.add(7)`. Java place automatiquement la valeur dans un objet `Integer` et l'ajoute à l'index 0.<br>
L'affectation `myList.add(5)` crée une instance de la classe `Integer` avec une valeur de 5 et l'ajoute à la liste à l'index 1.

N.B. : Le boxing java est une conversion automatique que Java effectue entre un type primitif et sa classe correspondante, lorsqu'un objet est attendu.<br>
C'est le cas avec la classe `ArrayList`.<br>
voir l'<a href="https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html">histoire complète</a> sur le site de tutoriels Java.

Explication de `.add()` :<br>
En Java, ajouter, modifier ou supprimer des éléments nécessite l'utilisation d'une méthode.<br>
Pour l'interface `List`, il y a trois méthodes implémentées par la classe `ArrayList` qui sont très pratiques :
* `add` : pour ajouter un nouvel élément à la fin d'un tableau.<br> 
On peut également ajouter un élément à une position donnée de cette manière : `myList.add(1,12)`
* `set` : pour remplacer un nouvel élément sur un index spécifique.<br>
On doit fournir l'élément et l'index sur lequel on souhaite que la valeur soit positionnée.
* `remove` : pour supprimer un élément existant sur un index spécifique.<br>
On doit fournir l'index de l'élément qu'on souhaite supprimer.

exemple de syntaxe :
``` 
List<Integer> myList = new ArrayList<Integer>(); // -> []
myList.add(7); // -> [7]
myList.add(5); //-> [7, 5]
myList.add(1,12) //-> [7, 12, 5]
myList.set(0,4); // -> [4, 12, 5]
myList.remove(1); // removed 12 -> [4, 5]
```

#### Assurer le suivi du nombre d'éléments 

La méthode `myArray.size()` permet d'obtenir le nombre d'éléments dans une liste.<br>
On peut aussi obtenir ces informations avec les tableaux : on utilisera la propriété `myArray.length` au lieu de `.size()`.

La méthode `.size()` est largement utilisée, particulièrement quand on a besoin de faire une boucle sur une liste.

### Utiliser une collection non ordonnée - ensembles

Un ensemble est une collection d'éléments unique non ordonnés.<br>
On peut les utiliser si on ne se soucie pas de l'ordre des éléments (ex : liste d'ingrédients d'une recette).<br>

#### Déclaration des ensembles 

De la même manière qu'on gère les listes, on va utiliser les différentes classes de Java pour gérer les ensembles.<br>
L'ensemble le plus communément utilisé est le `HashSet`.

La section <a href="https://docs.oracle.com/javase/tutorial/collections/interfaces/set.html">Tutoriel</a> de Java donne plus d'information sur les différents implémentations des ensembles.

Voici comment se réclare un ensemble :
```
Set<Type> nomDeLaVariable = new HashSet<String>();
```

On va d'abord déclarer le type avant le nom de la variables de l'ensemble, puis employer l'opérateur d'affectation suivi du mot clé "new" et du type d'ensemble.<br>
C'est comparable avec le fonctionnement d'une `ArrayList` : on déclare d'abord la variable avec l'interface `Set` et on l'initialie avec une instance de la classe concrète `HashSet`.

#### Manilupation des éléments d'un ensemble

Voici les opérations fréquentes qu'on peut utiliser avec les ensembles :
* `.add()` permet d'ajouter un élément.
* `.remove()` permet de supprimer un élément.
* `.size()` permet de connaître le nombre d'éléments de l'ensemble.

### Consulter les dictionnaires ou "maps"

Un dictionnaire est une liste d'éléments organisés en fonction d'une clé.<br>
cette clé est un terme spécifique qu'on recherche pour trouver sa définition ou sa valeur.<br>
C'est ce qu'on appelle une association "**Clé<>Valeur**" (**Key <> Value**).

Toutes les clés d'un dictionnaire doivent être uniques, tout comme un numéro de plaque d'immatriculation.<br>

#### Déclarer un dictionnaire

Comme pour les listes et les ensembles, il existe plusieurs classes Java pour manipuler les dictionnaires.<br>
Chacune de ces classes respecte l'interface `Map`, pour laquelle il y aune doc complète sur le site des <a href="https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html">Tutoriels Java</a>

La classe la plus courante est `HashMap`.<br>
Pour déclarer et initialiser une instance de cette classe, on procédera ainsi :
```
Map<String, Integer>myMap = new HashMap<String, Integer>();
```
On appelle l'interface Map, suivi du type de clé et du type de valeur entre <>, puis le nom de la variable.<br>
On utilise ensuite l'opérateur d'assignation, suivi du mot clé "new", puis du type de dictionnaire et enfin le type de clé et le type de valeur.<br>
Dans cette syntaxe ci-dessus :
* `String` est le type de la clé.
* `Integer` est le type de la valeur associée.

Pour ajouter des éléments au dictionnaire, on utilisera la méthode : `.put()` sur le nom de la variable déclarée.<br>
Entre les parenthèses, on ajoutera le nom de la clé, suivi de la valeur associée à cette clé.<br>
Les clés sont sensibles à la casse. Aussi, on pourra avoir deux clés similaires, l'une avec une lettre majuscule au début, l'autre avec une minuscule :<br>
"Romain" et "romain", qui auront chacune leur propre valeur.<br>

Afin d'éviter des similarités dans les clés, il existe une astuce qui consiste à utiliser des constantes pour spécifier les clés une fois et les réutiliser ensuite dans tout le code :
```
// Définissez des clés en tant que constantes dans votre classe
private static final String KJENNY = "Jenny";
private static final String KLIVIA = "Livia";
private static final String KPAUL = "Paul";
// Utilisez des constantes en tant que keys
myMap.put(KJENNY, 34);
myMap.put(KLIVIA, 28);
myMap.put(KPAUL, 31);

// Accédez à un élément
System.out.println(myMap.get(KJENNY)); // -> 34
```

Une constante se déclare avec les mots clé : `private static final`.

N.B. : le type d'un dictionnaire ne peut pas être modifié.<br>
Toutes les clés doivent être du même type et toutes les valeurs doivent être du même type.

#### Manipulation des éléments du dictionnaire

Voici les opération fréquentes qu'on peut effectuer avec les dictionnaires :
* `get()` est une méthode pour accéder à un élément, il faut spécifier la clé en argument.
* `put()` permet d'ajouter un élément, il faudra spécifier la clé et la valeur en argument.
* `remove()` sera employé pour supprimer un élément, seule la clé devra être spécifiée en argument.

Pour compter les éléments, on utilisera la propriété `size()`.

