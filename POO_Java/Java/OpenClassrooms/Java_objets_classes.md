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

