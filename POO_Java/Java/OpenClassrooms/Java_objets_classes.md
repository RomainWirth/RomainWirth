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

Attention : 
* un champs défini comme private ne peut pas être hérité ni manipulé par la classe fille.
* en Java, une classe fille ne peut hériter que d'une seule classe mère.
* une classe mère peut en revanche avoir plusieurs filles.

exemple :<br>
Création d'une classe mère `FigureGeometrique`
```
public class FigureGeometrique {
    private int x;
    private int y;
    public void moveTo(int newX, int newY) {
        this.x = newX;
        this.y = newY;
    }
}
```
Puis création d'une classe fille `Carre`
```
public class Carre extends FigureGeometrique {
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

#### Appeler 