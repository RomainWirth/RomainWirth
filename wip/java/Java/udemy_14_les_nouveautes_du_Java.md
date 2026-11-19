
# Les Nouveautés du Java
 
## Les classes anonymes
 
### Contexte
 
Une classe anonyme est un mécanisme important à comprendre avant d'aborder les nouveautés du langage, et en particulier les expressions lambda : celles-ci sont une écriture simplifiée de ce que l'on va voir ici.
 
Pour l'illustrer, on part d'un programme simple. On reprend l'interface `Announcement` du chapitre sur l'abstraction, qui impose deux méthodes :
 
```java
public interface Announcement {
    String getTitle();
    String getContent();
}
```
 
Une méthode de la classe `Main` attend en paramètre un objet de ce type et utilise les deux méthodes de l'interface :
 
```java
public class Main {
 
    public static void main(String[] args) {
        // ... on veut appeler display(...)
    }
 
    private static void display(Announcement announcement) {
        System.out.println(announcement.getTitle());
        System.out.println(announcement.getContent());
    }
}
```
 
Une méthode qui attend un paramètre d'un certain type n'accepte qu'un **objet** de ce type. Ici le type est une interface : il faut donc lui passer un objet dont la classe **implémente** `Announcement`.
 
### Première solution : une classe nommée
 
On crée une classe qui implémente l'interface, puis on instancie un objet de cette classe :
 
```java
public class ShopAnnouncement implements Announcement {
 
    @Override
    public String getTitle() {
        return "Boutique à vendre";
    }
 
    @Override
    public String getContent() {
        return "Boutique située en centre-ville, très bien placée.";
    }
}
```
 
```java
ShopAnnouncement announcement = new ShopAnnouncement();
display(announcement);
```
 
Cette solution fonctionne très bien, mais elle présente deux inconvénients :
 
- la classe est **publique** (dans un fichier Java, une classe est publique ou en visibilité package, jamais privée) : on peut donc créer n'importe où dans le programme de nouveaux objets de ce type ;
- on ne souhaite créer **qu'un seul objet** de ce type, pour le passer à cette méthode.
### Deuxième solution : une classe interne
 
Pour régler le premier problème, on peut déclarer la classe non pas dans un fichier dédié, mais **à l'intérieur** de la classe `Main`. C'est une classe interne, ici statique, qui peut être déclarée `private` : elle n'est alors utilisable qu'à l'intérieur de `Main`.
 
```java
public class Main {
 
    private static class ShopAnnouncement implements Announcement {
 
        @Override
        public String getTitle() {
            return "Boutique à vendre";
        }
 
        @Override
        public String getContent() {
            return "Boutique située en centre-ville, très bien placée.";
        }
    }
 
    public static void main(String[] args) {
        display(new ShopAnnouncement());
    }
 
    // ...
}
```
 
Le premier problème est réglé, mais on a toujours une **classe nommée** (`ShopAnnouncement`), alors qu'on n'a besoin que d'une seule instance.
 
### Troisième solution : une classe anonyme
 
Si l'on veut une seule instance, on n'est pas obligé de nommer la classe. On fait un `new` **directement sur l'interface** et on ouvre un corps : c'est une **classe anonyme**.
 
```java
Announcement announcement = new Announcement() {
 
    @Override
    public String getTitle() {
        return "Boutique à vendre";
    }
 
    @Override
    public String getContent() {
        return "Boutique située en centre-ville, très bien placée.";
    }
};
 
display(announcement);
```
 
Points à noter :
 
- le `new` est appelé sur l'interface, suivi de parenthèses (appel du constructeur par défaut) et d'un **corps entre accolades**. IntelliJ aide à générer ce corps avec l'auto-complétion ;
- le corps est celui de la classe anonyme : on y redéfinit toutes les méthodes imposées par l'interface ;
- le **point-virgule** après l'accolade fermante est obligatoire, puisqu'il termine l'instruction de déclaration ;
- l'objet est vu sous la forme de l'interface : la variable est de type `Announcement`, et on n'a accès qu'aux fonctionnalités de l'interface (`getTitle` et `getContent`).
Cette écriture est un peu déroutante au début : on définit une classe et on l'instancie en même temps, au milieu d'une méthode. Mais elle fonctionne très bien, et c'est un mécanisme très utilisé pour créer une instance unique, sans classe nommée accessible dans tout le programme.
 
### Avec une classe abstraite
 
Le mécanisme ne se limite pas aux interfaces. Un `new` sur une **classe abstraite** ouvre également le corps d'une classe anonyme, avec les méthodes abstraites à redéfinir. On crée ainsi un objet qui dit comment réaliser les opérations du type abstrait, pour le passer à une méthode qui attend ce type.
 
### Passer l'objet directement en paramètre
 
On écrit parfois encore plus directement : on fait le `new` au moment de l'appel, sans stocker l'objet dans une variable.
 
```java
display(new Announcement() {
 
    @Override
    public String getTitle() {
        return "Boutique à vendre";
    }
 
    @Override
    public String getContent() {
        return "Boutique située en centre-ville, très bien placée.";
    }
});
```
 
Le code fonctionne, mais il n'est pas le plus simple à lire : il faut bien respecter l'ordre des parenthèses, des accolades et du point-virgule qui termine l'appel de la méthode.
 
### Dans quels cas l'utiliser
 
Une classe anonyme sert à **fournir un comportement à une méthode, à un endroit précis du programme**. Beaucoup de méthodes attendent en paramètre un objet qui dit « comment faire » : comment comparer deux éléments, quoi exécuter dans un thread, quoi faire lorsqu'on clique sur un bouton. Ce comportement est souvent propre à l'endroit où on l'écrit : créer pour lui une classe nommée, dans son propre fichier, serait disproportionné.
 
L'exemple le plus courant est le **tri d'une liste**. La méthode `sort` attend un objet de type `Comparator`, interface qui décrit comment comparer deux éléments :
 
```java
buildings.sort(new Comparator<Building>() {
 
    @Override
    public int compare(Building first, Building second) {
        return Integer.compare(first.getConstructionYear(), second.getConstructionYear());
    }
});
```
 
Ici on veut trier les bâtiments par année de construction, à cet endroit précis du programme. Une classe `ConstructionYearComparator` publique n'aurait pas de raison d'exister : on n'en a besoin qu'une fois, et elle serait accessible partout. Cet exemple suppose que `Building` possède un accesseur `getConstructionYear()`.
 
On retrouve le même besoin avec :
 
- `Runnable`, pour indiquer le code à exécuter dans un thread ;
- les écouteurs d'événements des interfaces graphiques (clic sur un bouton, par exemple) ;
- les rappels (callbacks) que l'on passe à une méthode pour qu'elle les appelle plus tard.
#### Et aujourd'hui ?
 
Dans tous ces exemples, l'interface n'a **qu'une seule méthode**. Depuis Java 8, on écrit alors une expression lambda, beaucoup plus courte : c'est l'objet de la section suivante. La classe anonyme n'a pas disparu pour autant. Elle reste utile lorsque :
 
- l'interface possède **plusieurs méthodes** (comme `Announcement`, avec `getTitle` et `getContent`) : une lambda ne peut remplacer qu'une seule méthode ;
- on veut instancier une **classe abstraite**, ce qu'une lambda ne permet pas ;
- l'objet a besoin de ses **propres attributs** pour conserver un état.
La classe anonyme est donc à la fois un outil encore utilisé et une étape pour comprendre les expressions lambda, qui en sont une écriture simplifiée.
 
### Vers les expressions lambda
 
Une classe anonyme doit redéfinir toutes les méthodes de l'interface : avec cinq méthodes, il faut un corps de cinq méthodes. Mais lorsque l'interface n'a **qu'une seule méthode**, la classe anonyme n'en contient qu'une, et cette écriture lourde peut être réduite : c'est le rôle des **expressions lambda**, présentées dans la section suivante.
 
### Compléments
 
**Complément :** même si elle n'a pas de nom dans le code, une classe anonyme est une vraie classe : le compilateur lui en attribue un (de la forme `Main$1`) et produit un fichier `.class`.
 
**Complément :** une classe anonyme n'a pas de constructeur déclaré. On peut en revanche passer des arguments au constructeur de la classe abstraite ou de la classe mère qu'elle étend, entre les parenthèses du `new`.
 
**Complément :** les méthodes supplémentaires définies dans le corps d'une classe anonyme ne sont pas appelables depuis l'extérieur par la variable, puisque celle-ci est du type de l'interface. Elles ne servent qu'à l'intérieur de la classe anonyme.
 
**Complément :** une classe anonyme peut utiliser les variables locales de la méthode dans laquelle elle est définie, à condition qu'elles ne soient jamais réaffectées (variables `final` ou « effectivement finales »).
 
**Complément :** dans le corps d'une classe anonyme, `this` désigne l'instance de la classe anonyme elle-même, et non l'instance de la classe `Main` qui la contient.
 
### À retenir
 
- Une méthode qui attend une interface en paramètre doit recevoir un objet d'une classe qui implémente cette interface.
- Une classe nommée dans un fichier est accessible partout (publique ou package) ; une classe interne peut être privée, mais reste nommée.
- Une classe anonyme se crée par un `new` sur une interface (ou une classe abstraite), suivi d'un corps où l'on redéfinit les méthodes. Le point-virgule final est obligatoire.
- Elle sert à créer une seule instance, sans classe nommée, vue sous la forme du type abstrait.
- On l'utilise pour fournir un comportement à usage unique à une méthode (tri avec `Comparator`, `Runnable`, écouteurs d'événements), sans créer de classe nommée.
- Elle doit définir toutes les méthodes de l'interface : l'écriture devient lourde, ce que les expressions lambda vont simplifier lorsque l'interface n'a qu'une seule méthode. Les classes anonymes restent utiles pour une interface à plusieurs méthodes, une classe abstraite ou un objet avec son propre état.
---
 
## Les expressions lambda
 
### Contexte
 
Les expressions lambda ont été introduites en **Java 8**. Une expression lambda est une **réduction d'écriture d'une classe anonyme**, dans un cas précis : celui où l'interface n'a qu'une seule méthode à définir.
 
Dans la section précédente, l'interface `Announcement` avait deux méthodes : la classe anonyme devait redéfinir les deux. Voyons maintenant ce qui se passe avec une interface qui n'en contient qu'une.
 
### Les interfaces fonctionnelles
 
Une **interface fonctionnelle** est une interface qui ne contient qu'**une seule méthode abstraite**. On peut l'indiquer avec l'annotation `@FunctionalInterface` :
 
```java
@FunctionalInterface
public interface Display {
    void show(String message);
}
```
 
L'annotation est une garantie : si l'on ajoute une seconde méthode abstraite à l'interface, le programme ne compile plus. Une interface fonctionnelle ne peut pas avoir deux méthodes.
 
Une méthode peut attendre une interface fonctionnelle en paramètre :
 
```java
private static void display(Display display) {
    display.show("Bienvenue");
}
```
 
### De la classe anonyme à l'expression lambda
 
Avec une classe anonyme, on passe à cette méthode un objet qui implémente `Display` :
 
```java
display(new Display() {
    @Override
    public void show(String message) {
        System.out.println(message);
    }
});
```
 
Comme l'interface n'a qu'une seule méthode, il n'y a qu'une seule chose à écrire dans la classe anonyme : le corps de cette méthode. Le compilateur sait de quelle méthode il s'agit : on peut donc supprimer le `new Display()`, les accolades de la classe et le nom de la méthode. On conserve les **paramètres**, une **flèche** `->` et le **corps** :
 
```java
display((String message) -> {
    System.out.println(message);
});
```
 
C'est une expression lambda : `paramètres -> corps`.
 
### Les simplifications successives
 
On peut encore réduire l'écriture, étape par étape.
 
**1. Une seule instruction : pas d'accolades.** Si le corps n'a qu'une instruction, on peut supprimer les accolades et le point-virgule interne :
 
```java
display((String message) -> System.out.println(message));
```
 
**2. Le type du paramètre n'est pas obligatoire.** Le compilateur le connaît, puisque l'interface fonctionnelle impose `String` :
 
```java
display((message) -> System.out.println(message));
```
 
**3. Un seul paramètre : pas de parenthèses.**
 
```java
display(message -> System.out.println(message));
```
 
Ces trois écritures sont équivalentes. La dernière est la plus courante.
 
### Plusieurs paramètres
 
Si la méthode de l'interface attend plusieurs paramètres, la lambda doit les reprendre dans le même ordre. Avec **plusieurs paramètres, les parenthèses sont obligatoires** :
 
```java
@FunctionalInterface
public interface PriceRule {
    int apply(int pricePerNight, int nights);
}
```
 
```java
(pricePerNight, nights) -> pricePerNight * nights
```
 
Les types peuvent être écrits ou omis : `(int pricePerNight, int nights) -> ...` est aussi valide. Si on les écrit, on les écrit pour tous les paramètres.
 
### Une méthode qui retourne une valeur
 
Lorsque la méthode de l'interface retourne une valeur (ici un `int`), la lambda doit la retourner. Avec un corps entre accolades, on écrit un `return` comme dans une méthode :
 
```java
PriceRule rule = (pricePerNight, nights) -> {
    System.out.println("Calcul du prix");
    return pricePerNight * nights;
};
```
 
Ici il y a deux instructions : les accolades sont obligatoires, et le `return` aussi.
 
Lorsqu'il n'y a **qu'une seule expression**, on supprime à la fois les accolades **et** le `return` : la valeur de l'expression est automatiquement retournée.
 
```java
PriceRule rule = (pricePerNight, nights) -> pricePerNight * nights;
```
 
### Récapitulatif des règles d'écriture
 
| Situation | Écriture |
|---|---|
| Aucun paramètre | `() -> corps` |
| Un paramètre | `message -> corps` (parenthèses facultatives) |
| Plusieurs paramètres | `(a, b) -> corps` (parenthèses obligatoires) |
| Type des paramètres | facultatif (cohérent pour tous les paramètres) |
| Une seule instruction | accolades facultatives, pas de point-virgule interne |
| Plusieurs instructions | accolades obligatoires, une instruction par ligne avec `;` |
| Méthode qui retourne une valeur | `return` dans les accolades, ou simple expression sans `return` ni accolades |
 
### Un exemple concret : trier des bâtiments
 
On reprend l'exemple de la section précédente, qui triait des bâtiments par année de construction avec un `Comparator`. `Comparator` est une interface fonctionnelle : sa méthode `compare` attend deux bâtiments et retourne un `int`. La classe anonyme se réduit alors à :
 
```java
buildings.sort((first, second) -> Integer.compare(first.getConstructionYear(), second.getConstructionYear()));
```
 
Les deux paramètres sont déduits, il n'y a qu'une expression, donc ni accolades ni `return`.
 
### Comment écrire une lambda
 
Une lambda **ne s'invente pas** : on ne peut pas l'écrire sans connaître la méthode que l'on est en train de réduire. Il faut savoir :
 
- combien de paramètres elle attend et de quel type ;
- ce qu'elle doit retourner (`void` ou une valeur, et de quel type).
Deux approches possibles :
 
- si l'on connaît l'interface fonctionnelle, on écrit directement la lambda ;
- sinon, on **repasse par la classe anonyme** : on fait un `new` sur l'interface, et l'IDE génère la méthode à redéfinir. On voit alors son nom, ses paramètres et son type de retour, et on réduit ensuite en lambda. IntelliJ propose d'ailleurs la transformation par un avertissement (« peut être remplacé par une lambda »).
L'auto-complétion peut aussi écrire directement une lambda, mais elle ne montre pas ce que la méthode attend. C'est pourquoi, tant qu'on n'est pas à l'aise, il est préférable de passer par la classe anonyme.
 
### Une réduction syntaxique
 
Une expression lambda permet d'écrire un code plus court, et souvent plus lisible. Mais en réduisant le nombre de lignes, on a retiré de l'information : le nom de l'interface, le nom de la méthode, le type des paramètres. La lambda cache toujours le principe de **classe anonyme sur une interface fonctionnelle**. Il faut prendre le temps de comprendre d'où elle vient, pour savoir la lire et l'écrire.
 
### Lambda ou classe anonyme : que choisir ?
 
L'expression lambda et la classe anonyme répondent au même besoin : fournir, à un endroit précis du programme, un comportement à usage unique à une méthode. Mais la lambda n'est possible que dans une partie des cas.
 
#### Le critère : le type attendu
 
Tout dépend du type que la méthode attend en paramètre :
 
| Type attendu | Classe anonyme | Lambda |
|---|---|---|
| Interface à **une seule** méthode abstraite (`Comparator`, `Runnable`, `Display`) | oui | **oui, choix habituel** |
| Interface à **plusieurs** méthodes abstraites (`Announcement`) | oui | non |
| **Classe abstraite** | oui | non |
| **Classe concrète** que l'on veut redéfinir partiellement | oui | non |
 
La raison est simple : une lambda ne contient que le corps d'**une** méthode et n'écrit pas son nom. Le compilateur ne peut la rattacher qu'à une interface qui n'a qu'une seule méthode à définir.
 
#### Ce que permet une classe anonyme et pas une lambda
 
**Plusieurs méthodes.** Pour `Announcement`, qui impose `getTitle` et `getContent`, la classe anonyme est la seule écriture possible.
 
**Un état propre.** Une classe anonyme est une vraie classe : elle peut déclarer ses propres attributs et les modifier au fil des appels.
 
```java
Display counter = new Display() {
 
    private int count = 0; // attribut propre à cet objet
 
    @Override
    public void show(String message) {
        count++;
        System.out.println(count + " : " + message);
    }
};
```
 
Une lambda ne peut pas déclarer d'attribut. Elle ne peut utiliser que des variables locales jamais réaffectées (« effectivement finales »), et ne peut donc pas modifier une variable locale de la méthode qui l'entoure.
 
**Des méthodes supplémentaires.** On peut ajouter dans une classe anonyme des méthodes privées d'aide, utilisées par les méthodes de l'interface.
 
**`this` désigne l'objet lui-même.** Dans une classe anonyme, `this` est l'instance anonyme, ce qui permet de la passer à une autre méthode ou de la comparer. Dans une lambda, `this` désigne l'objet de la classe qui l'entoure : une lambda n'a pas de « soi » auquel faire référence.
 
#### Ce que la lambda apporte
 
**Un code plus court et plus lisible.** Pour une interface à une seule méthode, la lambda supprime tout ce qui est répétitif : `new`, nom de l'interface, signature de la méthode. Il reste l'essentiel, les paramètres et le traitement.
 
**Une lecture plus claire des traitements enchaînés.** Dans les sections suivantes (Streams, `Optional`), on enchaînera plusieurs opérations qui reçoivent chacune un petit comportement. Avec des classes anonymes, le code deviendrait illisible : avec des lambda, chaque opération tient sur une ligne.
 
#### En pratique
 
On peut suivre cette démarche :
 
1. **L'interface n'a qu'une seule méthode abstraite** (interface fonctionnelle) ? On utilise une **lambda**.
2. **Elle en a plusieurs**, ou le type est une **classe abstraite** ? Il faut une **classe anonyme**.
3. **On a besoin d'un état propre à l'objet** (compteur, liste de valeurs mémorisées) ? Il faut une **classe anonyme** (ou une classe nommée).
4. **Le comportement est long, ou réutilisé à plusieurs endroits** ? Ni l'une ni l'autre : on écrit une **classe nommée** ou une méthode. Une lambda ou une classe anonyme de plus d'une poignée de lignes est difficile à lire et à tester, et un comportement réutilisé ne doit pas être dupliqué.
IntelliJ aide pour la première étape : lorsqu'une classe anonyme pourrait être une lambda, il affiche un avertissement et propose de la remplacer.
 
### Compléments
 
**Complément :** une interface fonctionnelle contient **une seule méthode abstraite**. Elle peut aussi avoir des méthodes `default` ou `static`, et redéclarer des méthodes de `Object` (comme `equals`). C'est le cas de `Comparator`, qui est bien une interface fonctionnelle bien qu'elle propose plusieurs méthodes.
 
**Complément :** comme pour une classe anonyme, une lambda ne peut utiliser que les variables locales qui ne sont jamais réaffectées (variables « effectivement finales »).
 
**Complément :** dans une lambda, `this` désigne l'objet de la classe qui l'entoure, contrairement à une classe anonyme où `this` désigne l'instance anonyme. Une lambda n'est donc pas qu'un sucre syntaxique strict de la classe anonyme, même si l'on peut la voir ainsi pour comprendre.
 
**Complément :** le JDK fournit des interfaces fonctionnelles prêtes à l'emploi dans le package `java.util.function` (`Consumer`, `Function`, `Predicate`, `Supplier`). Elles sont très utilisées avec les Streams, présentés dans la section suivante.
 
### À retenir
 
- Une expression lambda (Java 8) est une écriture réduite d'une classe anonyme qui implémente une interface fonctionnelle.
- Une interface fonctionnelle n'a qu'une seule méthode abstraite ; l'annotation `@FunctionalInterface` le garantit à la compilation.
- La syntaxe est `paramètres -> corps`. Un seul paramètre : parenthèses facultatives. Plusieurs paramètres : parenthèses obligatoires. Le type des paramètres est facultatif.
- Avec une seule instruction, les accolades sont facultatives ; si la méthode retourne une valeur, le `return` l'est aussi.
- Avec plusieurs instructions, les accolades sont obligatoires, avec `return` si la méthode retourne une valeur.
- On ne peut pas inventer une lambda : il faut connaître la méthode de l'interface. En cas de doute, on repasse par la classe anonyme.
- Une lambda est plus courte, mais cache le principe de classe anonyme : il faut le comprendre pour bien l'utiliser.
- On choisit une lambda lorsque le type attendu est une interface fonctionnelle. Une classe anonyme reste nécessaire pour une interface à plusieurs méthodes, une classe abstraite ou un objet qui conserve son propre état.
---
 
## Les Streams
 
### Contexte
 
Les streams sont une évolution majeure du langage, introduite avec **Java 8** (2014). Ils sont énormément utilisés : ils permettent d'exprimer en quelques lignes des traitements sur des collections (filtrer, transformer, compter, trier, regrouper) qu'il faudrait sinon écrire avec des boucles et des conditions.
 
Ils s'utilisent avec les expressions lambda, vues dans la section précédente.
 
### Le principe
 
Depuis Java 8, les collections (listes, ensembles...) proposent une méthode `stream()` qui retourne un **stream** de leurs éléments. `Stream` est une classe générique : une liste de `String` donne un `Stream<String>`. C'est sur ce stream que l'on applique les opérations.
 
On peut distinguer deux familles d'opérations :
 
- les **opérations intermédiaires** (`filter`, `map`, `sorted`, `distinct`, `limit`...) retournent un **nouveau stream**, ce qui permet de les enchaîner ;
- les **opérations terminales** (`forEach`, `count`, `average`, `collect`, `findFirst`...) produisent le résultat et terminent le traitement.
Un stream **ne modifie jamais la collection d'origine** : les opérations travaillent sur un nouveau flux de données.
 
Pour les exemples qui suivent, on utilise une liste de dix prénoms :
 
```java
List<String> names = List.of(
        "Anne", "Alice", "Albert", "Bob", "Claire",
        "David", "Emma", "Frank", "Gabriel", "Hugo");
```
 
### forEach : exécuter une action sur chaque élément
 
La première opération est `forEach`. Elle attend un `Consumer`, interface fonctionnelle dont l'unique méthode `accept` prend un élément et ne retourne rien. Pour écrire correctement la lambda, on repasse par la classe anonyme, qui montre la méthode à réduire :
 
```java
names.stream().forEach(new Consumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
});
```
 
On la réduit ensuite en lambda, en choisissant un nom de paramètre explicite :
 
```java
names.stream().forEach(name -> System.out.println(name));
```
 
Les dix prénoms s'affichent dans la console.
 
### filter : ne garder que certains éléments
 
`filter` attend un `Predicate`. C'est une interface fonctionnelle générique : sa méthode `test` prend un élément et retourne un `boolean`. Si elle retourne `true`, l'élément est **conservé**, sinon il est exclu.
 
```java
names.stream()
        .filter(name -> name.startsWith("A"))
        .forEach(name -> System.out.println(name));
// Anne, Alice, Albert
```
 
`filter` retourne un nouveau stream de `String`, sur lequel on enchaîne `forEach`. Le nom du paramètre de la lambda est libre : c'est lui qui désigne l'élément dans le corps. Mieux vaut un nom explicite (`name`) qu'une lettre sans signification (`s`).
 
### map : transformer les éléments
 
`map` transforme chaque élément et produit un **stream d'autres valeurs**. Elle attend une `Function`, qui prend un élément et retourne une valeur.
 
```java
names.stream()
        .map(name -> name.toUpperCase())
        .forEach(name -> System.out.println(name));
// ANNE, ALICE, ALBERT, ...
```
 
Le type du stream peut changer. Avec les longueurs, on obtient un stream d'entiers :
 
```java
names.stream()
        .map(name -> name.length())   // Stream<Integer>
        .forEach(length -> System.out.println(length));
```
 
Pour obtenir un véritable **stream d'entiers primitifs** (`IntStream`), on utilise `mapToInt`. Il propose des opérations numériques, comme la moyenne :
 
```java
names.stream()
        .mapToInt(name -> name.length())
        .average()                                   // OptionalDouble
        .ifPresent(average -> System.out.println(average));
// 4.9
```
 
La méthode `average` retourne un `OptionalDouble` : une enveloppe qui contient la moyenne si elle existe. Ce type est présenté dans la section sur `Optional`.
 
### count : compter
 
`count` est une opération terminale qui retourne le nombre d'éléments, sous forme de `long`. Elle se combine bien avec `filter` :
 
```java
long count = names.stream()
        .filter(name -> name.startsWith("A"))
        .count();
// 3
```
 
### sorted : trier
 
`sorted` retourne un nouveau stream trié. La liste d'origine n'est pas modifiée.
 
```java
names.stream()
        .sorted()
        .forEach(name -> System.out.println(name));
```
 
Sans paramètre, `sorted` utilise l'**ordre naturel** des éléments : ceux-ci doivent donc implémenter l'interface `Comparable`. C'est le cas de `String`, ce qui donne ici un tri alphabétique. Pour une classe qui n'est pas `Comparable`, le programme compile, mais lève une exception à l'exécution.
 
Pour trier selon un autre critère, on passe un `Comparator`. Interface fonctionnelle, sa méthode `compare` prend deux éléments et retourne un entier : négatif si le premier est avant le second, nul s'ils sont équivalents, positif sinon. Ici, un tri par nombre de lettres croissant :
 
```java
names.stream()
        .sorted((first, second) -> Integer.compare(first.length(), second.length()))
        .forEach(name -> System.out.println(name));
```
 
### distinct, limit et skip
 
- `distinct()` supprime les doublons (en s'appuyant sur `equals`) ;
- `limit(n)` ne garde que les `n` premiers éléments ;
- `skip(n)` saute les `n` premiers éléments et garde les suivants.
```java
names.stream().limit(3).forEach(name -> System.out.println(name)); // les 3 premiers
names.stream().skip(3).forEach(name -> System.out.println(name));  // les 7 suivants
```
 
### allMatch, anyMatch et noneMatch
 
Ces trois opérations terminales retournent un `boolean` selon un `Predicate` :
 
```java
boolean all  = names.stream().allMatch(name -> name.startsWith("A"));  // false
boolean any  = names.stream().anyMatch(name -> name.startsWith("A"));  // true
boolean none = names.stream().noneMatch(name -> name.startsWith("Z")); // true
```
 
- `allMatch` : tous les éléments vérifient la condition ;
- `anyMatch` : au moins un élément la vérifie ;
- `noneMatch` : aucun élément ne la vérifie.
### Récapitulatif
 
| Opération | Type | Rôle |
|---|---|---|
| `filter(Predicate)` | intermédiaire | garde les éléments pour lesquels le test est vrai |
| `map(Function)` | intermédiaire | transforme chaque élément (le type peut changer) |
| `mapToInt(...)` | intermédiaire | produit un `IntStream` |
| `sorted()` / `sorted(Comparator)` | intermédiaire | trie |
| `distinct()` | intermédiaire | supprime les doublons |
| `limit(n)` / `skip(n)` | intermédiaire | garde les `n` premiers / saute les `n` premiers |
| `forEach(Consumer)` | terminale | exécute une action sur chaque élément |
| `count()` | terminale | compte les éléments |
| `average()` | terminale | moyenne d'un `IntStream` |
| `allMatch` / `anyMatch` / `noneMatch` | terminale | teste tous / au moins un / aucun élément |
| `collect(...)` / `toList()` | terminale | récupère le résultat dans une collection |
 
Les streams permettent d'écrire en une seule instruction des traitements qui seraient assez complexes avec des boucles. Ils se combinent très bien avec les expressions lambda.
 
### Application : filtrer les bâtiments d'une recherche
 
On reprend la classe `SearchCriteria`, construite avec le Builder. Après avoir créé les critères, il faut obtenir le **résultat de la recherche** : une `ArrayList<Building>` des bâtiments du Singleton qui correspondent aux critères. On ajoute une méthode `result()` dans `SearchCriteria`.
 
Dans les exemples de cette section, on suppose que `Building` fournit les accesseurs `getName()`, `getPricePerNight()`, `getMaxTravelers()` et `getSurface()`, que `House` fournit `getGardenArea()` et `hasPool()`, et que `getOwner()` retourne le propriétaire. Ce sont des hypothèses d'illustration.
 
#### Première idée : une boucle
 
On parcourt la liste du Singleton, et on n'ajoute un bâtiment que s'il respecte tous les critères. Pour éviter des conditions imbriquées, on inverse les tests : si un critère n'est pas respecté, on passe au bâtiment suivant avec `continue`.
 
```java
public ArrayList<Building> result() {
    ArrayList<Building> result = new ArrayList<>();
    for (Building building : AppData.getInstance().getBuildings()) {
        if (building.getMaxTravelers() < travelers) {
            continue;
        }
        if (building.getPricePerNight() < minPrice
                || building.getPricePerNight() > maxPrice) {
            continue;
        }
        result.add(building);
    }
    return result;
}
```
 
Cela fonctionne, mais plus il y a de critères, plus il y a de `if`, et plus le code devient compliqué.
 
#### Avec les streams
 
On récupère le stream des bâtiments, on filtre avec un `Predicate<Building>`, puis on collecte le résultat. La méthode `filter` attend un `Predicate`, interface fonctionnelle générique dont la méthode `test` prend un `Building` et retourne un `boolean`. Sur le même principe que précédemment, on l'écrit d'abord avec une classe anonyme pour voir la méthode, puis on la réduit en lambda :
 
```java
AppData.getInstance().getBuildings().stream()
        .filter(building -> building.getMaxTravelers() >= travelers)
```
 
Une lambda reste lisible tant qu'elle est courte. Dès qu'elle se complique, on **extrait chaque critère dans une méthode** qui retourne un `Predicate<Building>` :
 
```java
private Predicate<Building> travelersPredicate() {
    return building -> building.getMaxTravelers() >= travelers;
}
 
private Predicate<Building> pricePredicate() {
    return building -> building.getPricePerNight() >= minPrice
            && building.getPricePerNight() <= maxPrice;
}
```
 
Pour le critère de la piscine, il y a trois cas (voir le Builder) :
 
```java
private Predicate<Building> poolPredicate() {
    if (pool == POOL_INDIFFERENT) {
        return building -> true; // on garde tous les bâtiments
    }
    if (pool == POOL_WANTED) {
        // il faut une maison avec piscine
        return building -> building instanceof House house && house.hasPool();
    }
    // pas de piscine voulue : pas une maison, ou une maison sans piscine
    return building -> !(building instanceof House house) || !house.hasPool();
}
```
 
Par convention, un accesseur qui retourne un `boolean` est préfixé par `is` ou `has` (ici `hasPool`).
 
Plutôt que d'enchaîner plusieurs `filter`, on combine les prédicats avec la méthode `and` de `Predicate` (il existe aussi `or` et `negate`) :
 
```java
public ArrayList<Building> result() {
    return AppData.getInstance().getBuildings().stream()
            .filter(travelersPredicate()
                    .and(pricePredicate())
                    .and(poolPredicate()))
            .collect(Collectors.toCollection(ArrayList::new));
}
```
 
L'opération terminale `collect` récupère le résultat dans une collection. `Collectors.toCollection(ArrayList::new)` demande une `ArrayList` ; la syntaxe `ArrayList::new` est une référence de méthode, présentée dans la dernière section de ce chapitre. Si l'on ne retourne pas le résultat de `collect`, l'IDE affiche un avertissement « résultat ignoré » : ici on le retourne directement.
 
Même si tout s'enchaîne, il faut aérer le code : une opération par ligne rend la lecture beaucoup plus facile.
 
#### Utilisation
 
```java
SearchCriteria criteria = new SearchCriteria.Builder(5)
        .minPrice(100)
        .maxPrice(200)
        .build();
 
criteria.result().forEach(building -> System.out.println(building));
```
 
La méthode `forEach` existe aussi directement sur les collections : elle attend un `Consumer`, l'action à réaliser pour chaque élément. On vérifie en changeant les critères (par exemple un maximum de 150 euros) que les résultats évoluent bien.
 
### Compléments
 
**Complément :** un stream est paresseux : les opérations intermédiaires ne s'exécutent que lorsqu'une opération terminale est appelée. Un stream ne peut aussi être consommé qu'une seule fois : le réutiliser après une opération terminale lève une `IllegalStateException`.
 
**Complément :** pour comparer deux entiers, on préfère `Integer.compare(a, b)` à la soustraction `a - b` : la soustraction peut déborder (dépasser la capacité d'un `int`) et donner un résultat faux.
 
**Complément :** `Stream.toList()`, disponible depuis Java 16, est une écriture plus courte de `collect(Collectors.toList())`. Elle retourne une liste non modifiable.
 
**Complément :** les streams existent aussi pour les types primitifs : `IntStream`, `LongStream` et `DoubleStream`. Ils proposent des opérations numériques (`sum`, `average`, `min`, `max`).
 
**Complément :** il existe aussi des **streams parallèles** (`parallelStream()`), qui répartissent le traitement sur plusieurs threads. Ils demandent des précautions et ne sont pas systématiquement plus rapides.
 
### À retenir
 
- Un stream s'obtient avec la méthode `stream()` d'une collection (Java 8) ; il ne modifie pas la collection d'origine.
- Les opérations intermédiaires (`filter`, `map`, `sorted`, `distinct`, `limit`, `skip`) retournent un stream et s'enchaînent ; une opération terminale (`forEach`, `count`, `collect`...) produit le résultat.
- `filter` attend un `Predicate`, `map` une `Function`, `forEach` un `Consumer`, `sorted` un `Comparator` (ou l'ordre naturel si les éléments sont `Comparable`).
- `map` peut changer le type du stream ; `mapToInt` produit un `IntStream`, utile pour `average`, `sum`, `max`.
- `allMatch`, `anyMatch` et `noneMatch` répondent à une condition sous forme de `boolean`.
- Quand une lambda devient complexe, on l'extrait dans une méthode qui retourne un `Predicate`, et on combine les prédicats avec `and`, `or` et `negate`.
- On aère le code en écrivant une opération par ligne.
---
 
## La classe Optional
 
### Contexte
 
La classe `Optional` a elle aussi été introduite avec **Java 8**. Elle permet de réduire les risques de `NullPointerException` dans le code.
 
### Le problème
 
Reprenons la liste de prénoms et cherchons le **premier prénom de plus de 3 lettres**. On filtre avec le stream, puis on utilise `findFirst`, qui récupère le premier élément :
 
```java
names.stream()
        .filter(name -> name.length() > 3)
        .findFirst();
```
 
On s'attendrait à récupérer une `String`. Mais que doit retourner la méthode si aucun prénom ne correspond (par exemple avec un filtre de plus de 30 lettres) ? Elle ne peut pas retourner de chaîne de caractères. Elle pourrait retourner `null`, ou lever une exception.
 
Si elle retournait `null`, l'appelant pourrait ensuite manipuler le résultat comme un objet normal, en appelant une méthode dessus... et obtenir une `NullPointerException`. Rien ne l'aurait alerté qu'il fallait tester le résultat avant de s'en servir.
 
### La solution : Optional
 
Java 8 introduit `Optional`, une **enveloppe** qui contient un objet **s'il est présent**, et qui est vide sinon. Elle indique, dans le type même de retour, que le résultat peut ne pas exister.
 
`Optional` est une classe générique : `findFirst` retourne ici un `Optional<String>`.
 
```java
Optional<String> first = names.stream()
        .filter(name -> name.length() > 3)
        .findFirst();
```
 
On ne manipule plus directement une `String` : on manipule l'enveloppe, et c'est elle qui permet de savoir si la valeur existe.
 
### Utiliser un Optional
 
**isPresent() et get().** `isPresent()` retourne un `boolean` qui indique si une valeur est présente. Si c'est le cas, `get()` retourne la valeur :
 
```java
if (first.isPresent()) {
    String name = first.get();
    System.out.println(name.toUpperCase());
}
```
 
On est ainsi protégé : on n'accède à la valeur que lorsqu'on sait qu'elle existe.
 
**ifPresent().** Plus concis : on passe l'action à exécuter (un `Consumer`) uniquement si la valeur est présente.
 
```java
first.ifPresent(name -> System.out.println(name));
```
 
S'il n'y a aucun prénom correspondant, il ne se passe rien : pas d'affichage, et surtout pas de `NullPointerException`. Cette écriture évite le `if` sur plusieurs lignes.
 
**ifPresentOrElse().** On peut aussi prévoir l'action pour le cas où la valeur est absente. Le second paramètre est une action sans argument :
 
```java
first.ifPresentOrElse(
        name -> System.out.println(name),
        () -> System.out.println("Il n'y a pas de prénom"));
```
 
Avec un filtre à 3 lettres, le prénom trouvé est affiché ; avec un filtre à 30 lettres, le message « Il n'y a pas de prénom » s'affiche.
 
### OptionalInt et OptionalDouble
 
Pour les types primitifs, il existe des variantes : `OptionalInt`, `OptionalDouble` et `OptionalLong`. Elles servent de type de retour aux opérations des streams numériques, comme `max` ou `average` sur un `IntStream` :
 
```java
names.stream()
        .mapToInt(name -> name.length())
        .max()                                    // OptionalInt
        .ifPresent(max -> System.out.println(max));
```
 
Si le stream est vide, il n'y a ni maximum ni moyenne : l'`Optional` est vide, ce qui évite de retourner une valeur arbitraire ou `null`.
 
Pour récupérer la valeur d'un `OptionalInt` ou d'un `OptionalDouble` après `isPresent()`, on utilise `getAsInt()` ou `getAsDouble()`.
 
### Application : exploiter les résultats d'une recherche
 
On reprend la liste de résultats d'une recherche (`ArrayList<Building>`), obtenue avec `SearchCriteria.result()`, pour en tirer des informations avec les streams. Comme dans la section précédente, on suppose que `Building` fournit `getName()`, `getPricePerNight()`, `getMaxTravelers()`, `getSurface()` et `getOwner()`, que `Owner` fournit `getResponseTime()` (son délai de réponse), et que `House` fournit `getGardenArea()`.
 
```java
ArrayList<Building> results = criteria.result();
```
 
#### Les noms de tous les bâtiments
 
On part d'un stream de `Building` et on veut un stream de noms : c'est un `map`.
 
```java
results.stream()
        .map(building -> building.getName())
        .forEach(name -> System.out.println(name));
```
 
Pour récupérer les noms dans une liste, on termine avec `toList()` (ou `collect(Collectors.toList())`) :
 
```java
List<String> names = results.stream()
        .map(building -> building.getName())
        .toList();
```
 
#### Le tarif moyen
 
On transforme les bâtiments en tarifs avec `mapToInt`, puis on calcule la moyenne, qui retourne un `OptionalDouble`.
 
```java
results.stream()
        .mapToInt(building -> building.getPricePerNight())
        .average()
        .ifPresent(average -> System.out.println("Tarif moyen : " + average));
```
 
Le résultat est un `OptionalDouble` car il peut n'y avoir aucun bâtiment à moyenner : la liste de résultats est vide, ou un filtre n'a rien laissé passer. C'est ici la protection contre la `NullPointerException`.
 
#### Le délai moyen de réponse des propriétaires, sans doublons
 
Plusieurs bâtiments peuvent appartenir au même propriétaire : pour éviter de compter plusieurs fois le même, on supprime les doublons avec `distinct()`.
 
```java
results.stream()
        .map(building -> building.getOwner())   // Stream<Owner>
        .distinct()                             // sans doublons
        .mapToInt(owner -> owner.getResponseTime())
        .average()
        .ifPresent(average -> System.out.println("Délai moyen : " + average));
```
 
`distinct()` s'appuie sur `equals` (et `hashCode`) : cela fonctionne grâce à la redéfinition de ces méthodes dans `Person` et `Owner`, vue dans la section sur le chargement du fichier XML.
 
Quand une ligne devient trop longue ou trop complexe, on aère le code. Les enchaînements se lisent bien lorsqu'il y a une opération par ligne, et l'IDE affiche le type de l'objet manipulé à chaque étape (`Stream<Building>`, `Stream<Owner>`, `IntStream`, `OptionalDouble`).
 
#### Le bâtiment de plus grande capacité
 
`max` attend un `Comparator` et retourne un `Optional` du type des éléments :
 
```java
results.stream()
        .max((first, second) -> Integer.compare(first.getMaxTravelers(), second.getMaxTravelers()))
        .ifPresent(building -> System.out.println(building));
```
 
On a ici le bâtiment qui peut accueillir le plus de voyageurs. En élargissant la fourchette de prix de la recherche, on peut voir apparaître un autre bâtiment, de capacité plus grande.
 
#### Trier selon le prix au mètre carré
 
Pour trier avec `sorted()` sans paramètre, la classe `Building` devrait implémenter `Comparable`. Sinon, on fournit un critère avec un `Comparator`. La classe `Comparator` propose des méthodes statiques pratiques, comme `comparingDouble`, qui prend une fonction retournant un `double` :
 
```java
List<Building> sorted = results.stream()
        .sorted(Comparator.comparingDouble(
                building -> (double) building.getPricePerNight() / building.getSurface()))
        .toList();
 
sorted.forEach(building -> System.out.println(building));
```
 
Le `(double)` est important : le tarif et la surface sont des entiers, et sans conversion la division serait une division entière, qui tronque le résultat. Les bâtiments sortent triés du prix au mètre carré le plus faible au plus élevé.
 
#### Compter les maisons avec jardin
 
On filtre les bâtiments qui sont des maisons avec un jardin de surface strictement positive, puis on compte avec `count()` (un `long`).
 
```java
long count = results.stream()
        .filter(building -> building instanceof House house && house.getGardenArea() > 0)
        .count();
 
System.out.println("Il y a " + count + " maisons avec jardin");
```
 
#### Regrouper les bâtiments par propriétaire
 
`Collectors.groupingBy` regroupe les éléments d'un stream selon un critère. Elle retourne une `Map` : une collection associative clé-valeur, ici avec comme clé un propriétaire et comme valeur la liste de ses bâtiments.
 
```java
Map<Owner, List<Building>> byOwner = results.stream()
        .collect(Collectors.groupingBy(building -> building.getOwner()));
 
byOwner.forEach((owner, buildings) ->
        System.out.println(owner + " possède " + buildings.size() + " bâtiment(s)"));
```
 
Le `forEach` d'une `Map` attend deux paramètres : la clé et la valeur. La lambda a donc deux paramètres, d'où les parenthèses. Les bâtiments étant regroupés par propriétaire, chaque propriétaire n'apparaît qu'une seule fois. Là encore, cela repose sur `equals` et `hashCode` de `Owner`.
 
### Compléments
 
**Complément :** utiliser `isPresent()` suivi de `get()` revient à écrire un test de nullité sous un autre nom. On préfère les méthodes qui évitent de tester soi-même : `ifPresent`, `ifPresentOrElse`, ou encore `orElse(valeurParDéfaut)`, qui retourne la valeur ou une valeur de repli, et `orElseThrow()`, qui lève une exception si la valeur est absente.
 
**Complément :** appeler `get()` sur un `Optional` vide lève une `NoSuchElementException`. Il faut donc toujours s'assurer de la présence de la valeur avant.
 
**Complément :** on peut créer un `Optional` soi-même : `Optional.of(valeur)` (la valeur ne doit pas être nulle), `Optional.ofNullable(valeur)` (accepte `null` et retourne alors un `Optional` vide) et `Optional.empty()`.
 
**Complément :** `Optional` est conçu pour exprimer le **résultat d'une méthode** qui peut ne rien retourner. On ne l'utilise pas pour les attributs de classe ni pour les paramètres de méthodes.
 
**Complément :** `Optional` n'élimine pas toutes les `NullPointerException` : elle prévient simplement que la valeur peut être absente, et oblige à y penser.
 
### À retenir
 
- `Optional<T>` (Java 8) est une enveloppe qui contient une valeur si elle est présente, vide sinon.
- Une méthode qui peut ne pas avoir de résultat (`findFirst`, `max`, `average`...) retourne un `Optional` au lieu de `null` : le type avertit l'appelant.
- `isPresent()` teste la présence, `get()` retourne la valeur, `ifPresent(action)` exécute une action si elle est présente, `ifPresentOrElse(action, sinon)` prévoit aussi le cas d'absence.
- Pour les types primitifs : `OptionalInt`, `OptionalDouble`, `OptionalLong`.
- On a vu avec les streams comment filtrer, transformer, compter, trier, regrouper (`groupingBy`) et chercher le maximum d'une collection de bâtiments.
---
 
## Les références de méthodes
 
