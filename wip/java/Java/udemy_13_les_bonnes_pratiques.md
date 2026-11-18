# Les bonnes pratiques

## Le patron de conception Factory

### Contexte

Au fil des chapitres, la méthode `main` a grossi. Elle contient désormais :

- la création des différents bâtiments (`House`, `ApartmentBuilding`, `Shop`) qui seront construits sur des terrains (`Field`) ;
- les critères permettant de décider quel bâtiment créer ;
- la création des annonces.

Le code de création des bâtiments pose problème. Il a été écrit pour tester le programme, mais un bâtiment peut être créé à plusieurs endroits de l'application. Ce code n'a donc rien à faire dans le `main`.

### Le problème

Créer un bâtiment dépend d'une condition : selon le type demandé, on crée une `House` (maison), un `ApartmentBuilding` (immeuble d'habitations) ou un `Shop` (bâtiment commercial), que l'on pourra ensuite placer sur un terrain (`Field`).

La hiérarchie est la suivante : `Housing` (classe d'habitation) hérite de `Building` et se spécialise en `House` et `ApartmentBuilding`, tandis que `Shop` hérite directement de `Building`. La variable qui reçoit le résultat est de type `Building`.

```java
Building building;
if (type.equals("house")) {
    building = new House(constructionYear);
} else if (type.equals("apartment")) {
    building = new ApartmentBuilding(constructionYear);
} else if (type.equals("shop")) {
    building = new Shop(constructionYear);
} else {
    throw new IllegalArgumentException("Unknown building type: " + type);
}
```

Deux problèmes apparaissent :

- **Une fille doit être choisie sous condition**, puis vue comme sa classe mère. Quelqu'un qui ne connaît pas la règle pourrait très bien créer un `Shop` là où il faudrait une `House`.
- **Le code doit être répété** à chaque endroit où l'on crée un bâtiment. Or la duplication de code est une mauvaise pratique : la règle serait recopiée partout et il faudrait la modifier partout si elle évolue.

Remarque : les constructeurs et les conditions ci-dessus sont simplifiés à titre d'illustration. Seul le principe compte : un `if` qui décide quelle fille instancier.

### La solution : le patron de conception Factory

Un **patron de conception** (design pattern) est une solution éprouvée à un problème récurrent de conception. Celui qui répond à notre besoin s'appelle **Factory** (fabrique) : on centralise la création d'un objet dans un endroit dédié, qui décide quelle classe instancier.

La mise en place se fait en trois temps :

1. extraire le code de création dans une méthode ;
2. déplacer cette méthode dans une classe dédiée, la fabrique ;
3. empêcher les autres classes de contourner la fabrique.

### Étape 1 : extraire le code dans une méthode

On crée une méthode et on y déplace le code de création :

- le nom décrit ce qu'elle fait (`createBuilding`) ;
- les valeurs dont le code a besoin deviennent des paramètres (`type`, `constructionYear`) ;
- le résultat est retourné, la méthode ayant pour type de retour `Building` ;
- à l'endroit d'origine, le bloc `if` est remplacé par un appel à la méthode.

```java
private static Building createBuilding(String type, int constructionYear) {
    Building building;
    if (type.equals("house")) {
        building = new House(constructionYear);
    } else if (type.equals("apartment")) {
        building = new ApartmentBuilding(constructionYear);
    } else if (type.equals("shop")) {
        building = new Shop(constructionYear);
    } else {
        throw new IllegalArgumentException("Unknown building type: " + type);
    }
    return building;
}
```

La méthode `createBuilding` retourne un `Building` : c'est elle qui fabrique le bâtiment.

### Étape 2 : déplacer la méthode dans une classe dédiée

Cette méthode n'a pas sa place dans `Main`. Comme elle doit être utilisée partout dans le programme, elle ne peut pas rester privée dans `Main` : elle doit être publique et rangée dans une classe dédiée, la fabrique.

On crée une nouvelle classe `BuildingFactory`, placée dans le même package que la classe `Building`, et on y déplace la méthode. Deux modifications sont nécessaires :

- la méthode devient `public`, pour être appelable depuis le reste du programme ;
- elle devient `static`, pour être appelée depuis le nom de la classe (`BuildingFactory.createBuilding(...)`) sans avoir à instancier la fabrique.

L'appel dans `Main` est ensuite adapté en conséquence.

```java
public class BuildingFactory {

    public static Building createBuilding(String type, int constructionYear) {
        if (type.equals("house")) {
            return new House(constructionYear);
        } else if (type.equals("apartment")) {
            return new ApartmentBuilding(constructionYear);
        } else if (type.equals("shop")) {
            return new Shop(constructionYear);
        }
        throw new IllegalArgumentException("Unknown building type: " + type);
    }
}
```

La fabrique est ici une classe utilitaire fonctionnant sur le principe procédural : elle ne se manipule pas comme un objet, elle offre seulement une fonctionnalité statique.

### Étape 3 : sécuriser la fabrique

Une classe utilitaire de ce type reçoit deux marqueurs :

- un **constructeur privé**, pour qu'on ne puisse pas instancier `BuildingFactory` depuis l'extérieur ;
- le mot-clé **`final`** sur la classe, pour qu'on ne puisse pas en hériter.

```java
public final class BuildingFactory {

    private BuildingFactory() {
    }

    public static Building createBuilding(String type, int constructionYear) {
        // ...
    }
}
```

### Empêcher de contourner la fabrique

Un dernier problème subsiste. Rien n'empêche d'écrire, ailleurs dans le programme :

```java
Building building = new Shop(1850);
```

Les classes `House`, `ApartmentBuilding` et `Shop` restent accessibles, avec des valeurs de paramètres qui pourraient être incohérentes. La fabrique est publique, mais elle ne sert à rien si on peut la contourner.

La raison est simple : les constructeurs des filles sont publics. Il faut donc changer leur visibilité :

- les rendre `private` n'est pas possible, car la fabrique elle-même ne pourrait plus les utiliser ;
- on utilise la **visibilité package** (aucun mot-clé devant le constructeur). Elle autorise l'accès aux classes du même package, et seulement à elles.

La fabrique, `Building` et ses filles doivent donc se trouver dans le **même package**.

```java
public class Shop extends Building {

    // visibilité package : accessible dans le package uniquement
    Shop(int constructionYear) {
        super(constructionYear);
    }
}
```

Les constructeurs des classes mères (`Housing` et `Building`) peuvent eux aussi passer en visibilité package. Même si on n'instancie pas `Building` directement, l'intention est la même : seule la fabrique, ou une classe du même package, peut construire un bâtiment.

### Résultat

Depuis l'extérieur du package, la seule façon d'obtenir un bâtiment est :

```java
Building building = BuildingFactory.createBuilding("shop", 1850);
```

La fabrique retourne une fille de `Building`, vue comme un `Building`. Créer directement un `Shop` à l'extérieur du package n'est plus possible : le code ne compile pas.

Ce patron est une bonne pratique, car :

- le code a été déplacé au bon endroit, dans une fonctionnalité dédiée ;
- la règle de création n'existe qu'à un seul endroit ;
- les visibilités sont utilisées pour n'exposer que la fonctionnalité publique voulue (`createBuilding`) et masquer les constructeurs.

### Compléments

**Complément :** IntelliJ propose des raccourcis pour ces refactorisations. Les menus Refactor > Extract > Method (extraire du code dans une méthode) et Refactor > Move (déplacer une méthode dans une autre classe) créent la méthode, déterminent ses paramètres et adaptent les appels. L'ampoule d'IntelliJ peut aussi les proposer, mais pas systématiquement : cela dépend du contexte et de la version de l'IDE. Il est préférable de savoir effectuer ces étapes à la main, pour comprendre ce que l'outil fait à votre place.

**Complément :** la visibilité package n'interdit pas l'accès aux autres classes du même package. Si une classe est placée dans le même package sans être la fabrique, elle pourra toujours appeler les constructeurs. La protection fonctionne donc surtout pour les classes situées à l'extérieur du package, d'où l'importance de bien organiser ses packages.

**Complément :** ce patron est souvent appelé « Simple Factory » ou « Static Factory Method ». Il en existe des variantes plus élaborées (Factory Method, Abstract Factory), qui reposent sur l'héritage et les interfaces vues dans les chapitres précédents.

**Complément :** le type est ici passé sous forme de `String` pour simplifier. Dans un vrai programme, on préférera un type plus sûr, une énumération par exemple, qui évite les fautes de frappe. Le cas d'un type inconnu est traité par une `IllegalArgumentException`, comme vu dans le chapitre sur les exceptions.

**Complément :** un `Field` n'est pas un `Building` : c'est un terrain, qui peut accueillir un bâtiment. La fabrique ne crée donc que des bâtiments, qu'on associe ensuite au terrain (composition, et non héritage).

### À retenir

- Un patron de conception est une solution éprouvée à un problème de conception récurrent.
- Le patron Factory centralise la création d'un objet, notamment lorsque la classe à instancier dépend d'une condition.
- Il évite de dupliquer la logique de création dans le programme.
- La fabrique est une classe `final`, avec un constructeur privé et une méthode publique statique.
- Les constructeurs des filles (et des classes mères) sont en visibilité package, la fabrique étant placée dans le même package : l'extérieur ne peut créer un objet qu'en passant par elle.
- Ces étapes (extraire la méthode, la déplacer) peuvent se faire à la main ; IntelliJ propose des raccourcis de refactorisation dans le menu Refactor.

---

## La généricité

### Le principe

On a déjà rencontré la généricité sans la nommer : lorsqu'on déclare une `ArrayList`, on précise entre chevrons le type des éléments qu'elle contient.

```java
ArrayList<String> messages = new ArrayList<>();
```

Une `ArrayList` de `String`, c'est une liste de chaînes de caractères. Les chevrons contiennent un **paramètre de type**, et c'est ce qu'on appelle la **généricité**.

La généricité a été introduite en **Java 5**. La classe `ArrayList`, elle, existait dès la première version du langage. Comprendre à quoi ressemblait la version d'origine permet de comprendre pourquoi la généricité a été ajoutée.

Pour cela, on va recréer une version simplifiée de `ArrayList`, d'abord sans généricité, puis avec.

### Avant la généricité : une liste d'objets

Une `ArrayList` est une collection qui stocke ses éléments dans un tableau. Comme un tableau est de dimension fixe, la liste doit le recréer plus grand à chaque ajout.

Voici une version simplifiée :

```java
import java.util.Arrays;

public class MyArrayList {

    private Object[] array;

    public MyArrayList() {
        // à la création, la liste est vide
        this.array = new Object[0];
    }

    public void add(Object element) {
        // nouveau tableau : copie de l'ancien avec une case supplémentaire
        Object[] newArray = Arrays.copyOf(array, array.length + 1);
        // la dernière case reçoit le nouvel élément
        newArray[array.length] = element;
        // on remplace l'ancien tableau par le nouveau
        this.array = newArray;
    }

    public Object get(int index) {
        return array[index];
    }

    public Object[] getArray() {
        return array;
    }
}
```

Points importants :

- le tableau est de type `Object[]`, ce qui permet de stocker n'importe quel type d'objet ;
- à chaque `add`, on crée un tableau de dimension `n + 1` grâce à `Arrays.copyOf`, qui copie le tableau d'origine en lui donnant une taille supérieure ;
- on place le nouvel élément dans la dernière case, puis on réaffecte l'attribut.

Utilisation :

```java
MyArrayList list = new MyArrayList();
list.add("Message 1");
list.add("Message 2");
System.out.println(Arrays.toString(list.getArray()));
```

Le programme fonctionne. Mais cette conception comporte deux problèmes.

### Premier problème : on peut ajouter n'importe quel objet

La méthode `add` attend un `Object`. On peut donc lui passer n'importe quoi : une chaîne de caractères, mais aussi un `Shop`.

```java
list.add("Message 1");
list.add(new Shop(1850));
```

L'affichage montre alors une chaîne et un `Shop` dans la même liste (la méthode `toString` de `Shop` est appelée pour l'affichage).

En soi, cela ne pose pas de problème immédiat. Mais plus loin dans le programme, on voudra récupérer ce qu'on a ajouté, et on ne sait plus ce que contient réellement la liste.

### Second problème : le cast à la récupération

La méthode `get` retourne un `Object`. Pour récupérer la chaîne de caractères ajoutée en premier, il faut caster :

```java
String message = (String) list.get(0);
System.out.println(message);
```

Cela fonctionne pour l'indice 0, mais pas pour l'indice 1 :

```java
String message = (String) list.get(1);
// ClassCastException à l'exécution : Shop ne peut pas être converti en String
```

La case 1 contient un `Shop`. Le code compile, mais plante à l'exécution.

### Bilan

Avant la généricité, la classe `ArrayList` présentait deux défauts :

- à l'ajout, on pouvait insérer **n'importe quel objet** ;
- à la récupération, on était **obligé de caster**, sans aucune garantie que l'objet soit du type attendu. En cas d'erreur, le programme plantait à l'exécution.

La généricité règle ces deux problèmes.

### Une classe générique

On crée maintenant la version générique, `MyGenericArrayList`. L'idée est de déclarer que la liste est une liste **de quelque chose**, ce quelque chose étant précisé à l'utilisation.

On place pour cela un **paramètre de type** entre chevrons après le nom de la classe. Par convention, on le nomme `T` (pour « Type ») :

```java
public class MyGenericArrayList<T> {

    private Object[] array;

    public MyGenericArrayList() {
        this.array = new Object[0];
    }

    public void add(T element) {
        Object[] newArray = Arrays.copyOf(array, array.length + 1);
        newArray[array.length] = element;
        this.array = newArray;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        return (T) array[index];
    }
}
```

`T` représente un type précis, qui sera fourni à la création de l'objet et qui servira ensuite dans toute la classe. Les changements par rapport à la version précédente sont les suivants :

- `add` n'attend plus un `Object` mais un **`T`** : on ne peut ajouter que des éléments de ce type ;
- `get` ne retourne plus un `Object` mais un **`T`** : l'appelant n'a plus à caster ;
- à l'intérieur de `get`, le tableau étant toujours de type `Object[]`, un cast vers `T` est nécessaire. Il est sans risque : seuls des éléments de type `T` ont pu être ajoutés.

### Utilisation

À l'utilisation, on précise le type voulu entre chevrons :

```java
MyGenericArrayList<String> messages = new MyGenericArrayList<>();
messages.add("Message 1");
messages.add("Message 2");

String first = messages.get(0); // aucun cast nécessaire
```

Les deux problèmes sont résolus :

- on ne peut plus ajouter n'importe quel objet : `messages.add(new Shop(...))` **ne compile pas** ;
- on n'a plus besoin de caster : `get` retourne directement un `String`, et il n'y a plus de risque de `ClassCastException`.

On peut de la même façon créer une liste de boutiques :

```java
MyGenericArrayList<Shop> shops = new MyGenericArrayList<>();
shops.add(new Shop(1850));
Shop shop = shops.get(0);
```

La même classe sert à créer des listes de `String`, de `Shop` ou de n'importe quel autre type, sans dupliquer le code.

### Ce que la généricité apporte

| Sans généricité | Avec généricité |
|---|---|
| `add(Object)` : tout est accepté | `add(T)` : seul le type attendu est accepté |
| `get` retourne un `Object` | `get` retourne un `T` |
| cast obligatoire à la récupération | aucun cast nécessaire |
| erreur détectée à l'exécution (`ClassCastException`) | erreur détectée à la compilation |

L'idée principale est de **déplacer la détection des erreurs de l'exécution vers la compilation**, et d'écrire une classe une seule fois pour tous les types.

### Compléments

**Complément :** le cast `(T) array[index]` génère un avertissement de compilation (« unchecked cast »), car le compilateur ne peut pas vérifier le type réel à cet endroit. L'annotation `@SuppressWarnings("unchecked")` signale qu'on assume ce choix en connaissance de cause. Ce cas est sûr ici, car seul `add(T)` peut remplir le tableau.

**Complément :** par convention, on utilise des lettres majuscules pour les paramètres de type : `T` (Type), `E` (Element, très utilisé pour les collections), `K` et `V` (Key et Value, pour les `Map`).

**Complément :** les paramètres de type doivent être des classes ou interfaces, jamais des types primitifs. On écrit `ArrayList<Integer>` et non `ArrayList<int>`. Le passage entre `int` et `Integer` est géré automatiquement (autoboxing).

**Complément :** depuis Java 7, l'opérateur diamant `<>` permet d'omettre le type à droite : `new ArrayList<>()`. Le compilateur déduit le type à partir de la déclaration à gauche.

### À retenir

- La généricité permet de paramétrer une classe par un ou plusieurs types, écrits entre chevrons.
- Elle est apparue en Java 5. Avant, les collections stockaient des `Object`.
- Sans généricité, on pouvait ajouter n'importe quel objet et il fallait caster à la lecture, avec un risque de `ClassCastException`.
- Une classe générique déclare un paramètre de type (`T`) : `add(T)` n'accepte que ce type et `get` le retourne sans cast.
- Les erreurs de type sont détectées à la compilation et non plus à l'exécution.
- Une classe générique s'écrit une seule fois et s'utilise avec n'importe quel type, ce qui évite la duplication de code.