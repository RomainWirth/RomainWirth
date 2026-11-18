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

La méthode `add` attend un `Object`. On peut donc lui passer n'importe quoi : une chaîne de caractères, mais aussi un `Building`.

```java
list.add("Message 1");
list.add(BuildingFactory.createBuilding("shop", 1850));
```

L'affichage montre alors une chaîne et un `Building` dans la même liste (la méthode `toString` du bâtiment est appelée pour l'affichage).

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
// ClassCastException à l'exécution : Building ne peut pas être converti en String
```

La case 1 contient un `Building`. Le code compile, mais plante à l'exécution.

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

- on ne peut plus ajouter n'importe quel objet : `messages.add(BuildingFactory.createBuilding(...))` **ne compile pas** ;
- on n'a plus besoin de caster : `get` retourne directement un `String`, et il n'y a plus de risque de `ClassCastException`.

On peut de la même façon créer une liste de bâtiments :

```java
MyGenericArrayList<Building> buildings = new MyGenericArrayList<>();
buildings.add(BuildingFactory.createBuilding("shop", 1850));
Building building = buildings.get(0);
```

La même classe sert à créer des listes de `String`, de `Building` ou de n'importe quel autre type, sans dupliquer le code.

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

---

## La classe ArrayList

### Une classe générique du JDK

La classe `MyGenericArrayList` écrite dans la section précédente n'avait qu'un but pédagogique : la classe `ArrayList` existe déjà dans le JDK, et c'est elle qu'on utilise en pratique.

Si on regarde sa déclaration, on constate qu'il s'agit d'une `ArrayList<E>`. Le paramètre de type s'appelle ici `E`, pour « Element ». On y retrouve la même structure que notre version : un tableau d'objets en attribut, et des méthodes pour le manipuler. Par exemple, une méthode interne fait grossir le tableau en le recopiant, comme nous l'avions fait avec `Arrays.copyOf`, et une méthode `get` retourne un élément du tableau.

On l'utilise en précisant le type des éléments :

```java
ArrayList<Building> buildings = new ArrayList<>();
```

Cette liste ne propose que des méthodes manipulant des `Building` : on ne peut y ajouter que des bâtiments, et on en récupère sans cast. La généricité évite d'écrire une version de `ArrayList` pour chaque type : le compilateur s'appuie sur le type fourni pour vérifier le code.

### Ajouter des éléments : add

La méthode `add` existe sous plusieurs formes :

- `add(element)` ajoute l'élément **à la fin** de la liste ;
- `add(index, element)` insère l'élément **à une position donnée**. Si la position n'existe pas dans la liste, la méthode lève une exception (`IndexOutOfBoundsException`) ;
- `addFirst(element)` et `addLast(element)` ajoutent explicitement au début ou à la fin. Ces méthodes ont été introduites en **Java 21**.

```java
buildings.add(BuildingFactory.createBuilding("house", 1990));
buildings.add(BuildingFactory.createBuilding("shop", 1850));
```

La lecture de la documentation (la Javadoc) de la méthode indique les cas où elle peut échouer. C'est un bon réflexe à prendre pour chaque méthode d'une classe que l'on découvre.

### Supprimer des éléments : remove

La méthode `remove` existe sous deux formes, qui se distinguent par leur paramètre et leur valeur de retour :

| Méthode | Paramètre | Retour | Particularité |
|---|---|---|---|
| `remove(int index)` | la position de l'élément | l'élément supprimé | lève une exception si l'index n'est pas compris entre 0 et la taille de la liste (exclue) |
| `remove(Object o)` | l'objet à supprimer | un `boolean` | `true` si l'élément a été trouvé et supprimé, `false` sinon |

```java
// supprime le premier élément et récupère sa référence
Building removed = buildings.remove(0);

// supprime l'objet, true si présent dans la liste
boolean found = buildings.remove(someBuilding);
```

Il existe beaucoup d'autres méthodes : `size()` pour connaître la taille de la liste, `clear()` pour la vider entièrement, etc.

### Une liste contient des références

Une liste est un objet très léger : c'est un simple tableau de **références**. Un objet que l'on ajoute à la liste n'est pas dupliqué en mémoire : il est créé ailleurs dans le programme, et la liste ne stocke que la référence vers cet objet.

### Parcourir une liste

Pour parcourir tous les éléments, il existe plusieurs écritures. On prend l'exemple d'une liste alimentée avec deux bâtiments :

```java
ArrayList<Building> buildings = new ArrayList<>();
buildings.add(BuildingFactory.createBuilding("house", 1990));
buildings.add(BuildingFactory.createBuilding("shop", 1850));
```

#### La boucle for classique

On utilise un indice qui va de 0 jusqu'à la taille de la liste (exclue), et la méthode `get` pour récupérer chaque élément :

```java
for (int i = 0; i < buildings.size(); i++) {
    Building building = buildings.get(i);
    System.out.println(building);
}
```

Chaque bâtiment est affiché grâce à sa méthode `toString`, et on obtient bien les deux éléments dans la console.

#### La boucle foreach

La boucle foreach est une écriture simplifiée, utilisable dès qu'on parcourt une collection (un objet itérable). Elle masque l'indice : on déclare une variable qui prend successivement la valeur de chaque élément, puis deux points, puis la collection à parcourir.

```java
for (Building building : buildings) {
    System.out.println(building);
}
```

Le résultat est identique. On lit cette boucle : « pour chaque `building` dans `buildings` ».

### Compléments

**Complément :** la version simplifiée vue plus haut agrandit le tableau d'une case à chaque ajout. La vraie `ArrayList` est plus efficace : elle réserve une capacité supérieure au nombre d'éléments, et ne recopie son tableau que lorsque celle-ci est atteinte, en l'agrandissant d'environ 50 %. Les détails internes peuvent varier selon la version du JDK.

**Complément :** `remove(Object)` s'appuie sur la méthode `equals` pour repérer l'élément à supprimer : c'est le premier élément égal à l'objet passé qui est retiré. C'est une bonne raison de bien redéfinir `equals` (et `hashCode`), comme vu dans le chapitre sur le polymorphisme.

**Complément :** avec une `ArrayList<Integer>`, l'appel `remove(1)` est ambigu pour le lecteur : c'est la version qui prend un index qui est appelée, et non la suppression de l'entier `1`. Pour supprimer la valeur, on écrit `remove(Integer.valueOf(1))`.

**Complément :** la boucle foreach s'appuie en réalité sur un itérateur, et non sur `get(i)`. Modifier la liste (ajout ou suppression) pendant un foreach lève généralement une `ConcurrentModificationException`.

**Complément :** l'`ArrayList` est une implémentation de l'interface `List`. On trouve souvent dans le code la déclaration `List<Building> buildings = new ArrayList<>();`, qui applique le principe vu dans le chapitre sur l'abstraction : on programme vis-à-vis de l'interface, sans dépendre de l'implémentation.

### À retenir

- `ArrayList<E>` est une classe générique du JDK : `E` est le type des éléments.
- Elle stocke un tableau de références qui s'agrandit automatiquement, ce qui la rend préférable à un tableau classique de dimension fixe quand le nombre d'éléments varie.
- `add` ajoute à la fin, `add(index, element)` insère à une position (exception si elle n'existe pas), `addFirst` et `addLast` existent depuis Java 21.
- `remove(int)` supprime par position et retourne l'élément ; `remove(Object)` supprime par objet et retourne un `boolean`.
- `size()` donne la taille, `clear()` vide la liste.
- La liste ne contient que des références : les objets ne sont pas dupliqués en mémoire.
- On parcourt une liste avec une boucle `for` classique (indice et `get`) ou avec un foreach, plus simple à écrire.

---

## Le patron de conception Singleton

### Contexte

Après la Factory, on continue à alléger la méthode `main`. Elle contient encore le jeu de données qui a servi à faire fonctionner le programme : la création des bâtiments, que l'on ajoute ensuite à une liste. Ce code n'a rien à faire dans le `main`.

Le besoin est le suivant : **créer une seule fois** les données, et pouvoir y **accéder partout** dans le programme.

### Étape 1 : regrouper les données dans une classe

Les données sont plusieurs bâtiments : on utilise donc une collection, ici une `ArrayList<Building>`. Plutôt que de la laisser comme variable locale du `main`, on la range dans une classe qui contient les données du système.

On crée un package `data` et, à l'intérieur, une classe `AppData` :

```java
package data;

import java.util.ArrayList;

public class AppData {

    private ArrayList<Building> buildings;

    public AppData() {
        // les listes sont initialisées dans le constructeur
        this.buildings = new ArrayList<>();
        initData();
    }

    private void initData() {
        buildings.add(BuildingFactory.createBuilding("house", 1990));
        buildings.add(BuildingFactory.createBuilding("apartment", 2005));
        buildings.add(BuildingFactory.createBuilding("shop", 1850));
    }

    public ArrayList<Building> getBuildings() {
        return buildings;
    }
}
```

Quelques points à noter :

- l'attribut est privé et accessible par un accesseur, comme pour toute classe ;
- l'opérateur diamant `<>` évite de répéter le type : la variable étant déclarée `ArrayList<Building>`, le `new ArrayList<>()` en déduit le même type ;
- grâce au polymorphisme, la méthode `add` attend un `Building` et accepte n'importe quelle fille (`House`, `ApartmentBuilding`, `Shop`) ;
- le code de création des données est extrait dans une méthode `initData`, appelée par le constructeur. Le `main` n'a plus à s'en occuper.

Dans le `main`, on récupère les données ainsi :

```java
AppData data = new AppData();
Building building = data.getBuildings().get(0); // premier élément de la liste
```

### Le problème : plusieurs instances

Rien n'empêche d'écrire plusieurs fois `new AppData()`. Or à chaque appel du constructeur, une nouvelle liste est créée et `initData` recrée tous les objets. On se retrouve avec des données dupliquées, ce qui n'est pas souhaitable.

On veut **une seule et unique instance** de `AppData`, accessible partout dans le programme. C'est le rôle du patron de conception **Singleton**.

### Étape 2 : mettre en place le Singleton

**1. Masquer le constructeur.** On le déclare `private` : plus aucune classe extérieure ne peut écrire `new AppData()`.

```java
private AppData() {
    this.buildings = new ArrayList<>();
    initData();
}
```

**2. Détenir l'unique instance dans la classe elle-même.** Le constructeur privé ne peut être appelé qu'à l'intérieur de la classe : c'est donc elle qui doit créer et conserver son instance. On ajoute un attribut du type de la classe.

**3. Rendre l'attribut statique.** L'instance est créée une seule fois, au chargement de la classe, directement sur la ligne de déclaration :

```java
private static final AppData instance = new AppData();
```

Le constructeur privé reste utilisable ici, puisqu'on est à l'intérieur de la classe.

**4. Fournir un accesseur statique.** Il retourne l'unique instance :

```java
public static AppData getInstance() {
    return instance;
}
```

Cet accesseur doit être `static`, pour être appelé depuis le nom de la classe sans avoir besoin d'un objet (qu'on ne peut justement pas créer). Une méthode statique ne peut utiliser que des éléments statiques, car elle n'a pas de `this` : elle n'est pas liée à une instance. L'attribut `instance` doit donc lui aussi être statique.

Voici la classe complète :

```java
package data;

import java.util.ArrayList;

public class AppData {

    private static final AppData instance = new AppData();

    private ArrayList<Building> buildings;

    private AppData() {
        this.buildings = new ArrayList<>();
        initData();
    }

    public static AppData getInstance() {
        return instance;
    }

    private void initData() {
        buildings.add(BuildingFactory.createBuilding("house", 1990));
        buildings.add(BuildingFactory.createBuilding("apartment", 2005));
        buildings.add(BuildingFactory.createBuilding("shop", 1850));
    }

    public ArrayList<Building> getBuildings() {
        return buildings;
    }
}
```

### Utilisation

Partout dans le programme, on récupère l'unique instance par le nom de la classe :

```java
AppData data = AppData.getInstance();
Building building = data.getBuildings().get(0);
```

Il n'est même pas obligatoire de la stocker dans une variable :

```java
Building building = AppData.getInstance().getBuildings().get(0);
```

Peu importe le nombre d'appels, c'est toujours la même référence qui est retournée : les données ne sont créées qu'une fois, et la liste est accessible depuis n'importe où.

### Résumé du patron

Un Singleton se compose de trois éléments :

- un **constructeur privé**, pour interdire la création d'instances depuis l'extérieur ;
- un **attribut statique** contenant l'unique instance, initialisé dans la classe ;
- un **accesseur statique** (`getInstance`) qui retourne cette instance.

### Compléments

**Complément :** ici l'instance est créée dès le chargement de la classe (initialisation « précoce »). Une variante, l'initialisation « paresseuse », ne la crée qu'au premier appel de `getInstance` :

```java
private static AppData instance;

public static AppData getInstance() {
    if (instance == null) {
        instance = new AppData();
    }
    return instance;
}
```

Cette variante n'est pas sûre lorsque plusieurs threads l'appellent en même temps : deux instances pourraient être créées. L'initialisation précoce, plus simple, n'a pas ce défaut.

**Complément :** le mot-clé `final` sur l'attribut `instance` garantit qu'il ne sera jamais réaffecté.

**Complément :** `getBuildings()` retourne directement la liste interne : n'importe quelle classe pourrait la modifier (ajout, suppression). Selon le besoin, on peut retourner une vue en lecture seule avec `Collections.unmodifiableList(buildings)`.

**Complément :** le Singleton est un patron très répandu, mais aussi critiqué : il crée un état global partagé, ce qui rend le code plus difficile à tester et crée un couplage fort entre les classes. Il est donc à utiliser avec discernement.

### À retenir

- Le patron Singleton garantit qu'une classe n'a qu'une seule instance, accessible partout dans le programme.
- Il repose sur un constructeur privé, un attribut statique contenant l'instance et un accesseur statique `getInstance()`.
- Une méthode statique ne peut manipuler que des éléments statiques : l'attribut `instance` est donc statique.
- Les données sont regroupées dans une classe dédiée plutôt que dans le `main`, et créées une seule fois.
- Une `ArrayList<Building>` stocke aussi bien des `House`, des `ApartmentBuilding` ou des `Shop`, grâce au polymorphisme.

---

## Charger les données depuis un fichier XML avec l'aide d'une IA

### Contexte

Le Singleton `AppData` initialise ses listes avec des données écrites en dur dans le programme (méthode `initData`). On souhaite faire évoluer ce point : **récupérer les données depuis un fichier XML**.

Cette section illustre aussi une démarche : savoir utiliser un assistant d'intelligence artificielle pour avancer sur un sujet que l'on ne maîtrise pas encore, sans perdre son esprit critique.

### Le fichier XML

Le fichier décrit une collection de bâtiments. L'élément racine `buildings` contient des éléments `house` et `apartment`, chacun avec ses propres informations. Les informations communes (nom, année de construction) côtoient celles qui sont spécifiques à chaque type : superficie du jardin et présence d'une piscine pour une maison, nombre d'étages pour un immeuble d'habitations.

```xml
<buildings>
    <house>
        <name>Harbour House</name>
        <constructionYear>1990</constructionYear>
        <gardenArea>120</gardenArea>
        <pool>1</pool>
    </house>
    <apartment>
        <name>Seaview Residence</name>
        <constructionYear>2005</constructionYear>
        <floors>4</floors>
    </apartment>
</buildings>
```

Ce fichier est donné à titre d'illustration. Notez que la présence de la piscine est codée par un entier : `1` pour oui, `0` pour non. Il faudra convertir cette valeur en `boolean` à la lecture.

### Ajouter le fichier au projet : le dossier de ressources

Un fichier de données n'est pas du code Java : on ne le place pas dans le dossier des sources. On crée un dossier dédié à la racine du projet, que l'on nomme par convention `res` (ressources), comme le dossier `src` contient les sources.

Dans IntelliJ :

1. clic droit sur le projet, puis New > Directory, et on le nomme `res` ;
2. clic droit sur ce dossier, puis Mark Directory as > Resources Root ;
3. on y place le fichier XML.

### Utiliser une IA pour trouver la solution

Pour lire un fichier XML, il faut connaître l'API adaptée. Face à un besoin pour lequel on ne connaît pas la bibliothèque, on cherchait traditionnellement sur un moteur de recherche, pour tomber sur des tutoriels. Un assistant d'IA (ChatGPT, par exemple) permet de gagner du temps, à condition de bien s'y prendre.

#### Étape 1 : poser une question simple

Une première demande générale, comme « je souhaite parser un fichier XML en Java », donne un panorama des approches possibles. L'IA propose généralement plusieurs techniques, dont **DOM** (le fichier est entièrement chargé en mémoire sous forme d'arbre) et **SAX** (lecture en flux), avec un exemple pour chacune. On peut ensuite lui demander de détailler l'une d'elles.

#### Étape 2 : donner du contexte

Plus la demande est précise, plus la réponse est adaptée. On peut préciser :

- la **signature** voulue : par exemple une méthode qui prend en paramètre le nom du fichier et la liste à remplir ;
- un **exemple du fichier** XML, complet et correctement fermé ;
- les **classes** manipulées.

La réponse intègre alors ces éléments. Mais si l'exemple ne contient qu'un seul type d'élément, le code produit ne distingue pas les deux types de bâtiments : l'IA ne peut deviner que ce que l'on lui montre.

#### Étape 3 : itérer

On affine la demande : on décrit la hiérarchie de classes (classe mère `Building`, classes filles `House` et `ApartmentBuilding`) et on fournit un fichier XML contenant les deux types. L'IA propose alors des classes proches de celles du programme et une méthode qui teste, pour chaque élément, s'il s'agit d'une maison ou d'un appartement, puis crée l'objet correspondant et l'ajoute à la liste.

Le résultat est intéressant, car il se rapproche de ce que l'on a construit dans le cours.

### Garder un regard critique

Le code généré ne doit jamais être intégré tel quel. Une IA peut se tromper : à vous de lire le code, de le comprendre, de le tester et de corriger les erreurs éventuelles.

Dans la solution obtenue, on remarque ainsi que le code de lecture des informations communes est **dupliqué** pour la maison et pour l'immeuble. On sait que la duplication est une mauvaise pratique. De même, la création des objets est faite directement avec les constructeurs, alors qu'on dispose d'une fabrique pour cela.

Voici une version simplifiée et corrigée qui s'appuie sur la `BuildingFactory` :

```java
import java.io.File;
import java.util.List;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

public final class BuildingXmlParser {

    private BuildingXmlParser() {
    }

    public static void load(String fileName, List<Building> buildings) throws Exception {
        Document document = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder()
                .parse(new File(fileName));

        NodeList children = document.getDocumentElement().getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            if (children.item(i) instanceof Element element) {
                int constructionYear = Integer.parseInt(readText(element, "constructionYear"));
                // le nom de la balise ("house", "apartment") sert de type pour la fabrique
                buildings.add(BuildingFactory.createBuilding(element.getTagName(), constructionYear));
            }
        }
    }

    private static String readText(Element element, String tagName) {
        return element.getElementsByTagName(tagName).item(0).getTextContent();
    }
}
```

Cette version est volontairement réduite à l'année de construction : on lit les informations communes à un seul endroit (`readText`), et c'est la fabrique qui choisit la classe à instancier. Les informations spécifiques (jardin, piscine, étages) se traiteraient de la même façon, en respectant les constructeurs réels des classes.

### Analyser la solution proposée

La solution obtenue en questionnant l'IA est proche de ce que l'on écrirait soi-même. Il reste à l'analyser pour la comprendre :

- la classe est une **classe utilitaire** : `final`, constructeur privé, et une méthode `parse` publique et statique, appelée depuis le nom de la classe ;
- `parse` reçoit le chemin du fichier sous forme de `String`, ainsi que les listes à remplir (propriétaires et bâtiments) ;
- un objet `File` (package `java.io`) est créé à partir du chemin ;
- le DOM parser s'utilise en trois temps : une `DocumentBuilderFactory` fournit un `DocumentBuilder`, dont la méthode `parse` lit le fichier et retourne le document ;
- on récupère les enfants de l'élément racine (`getChildNodes`) et on boucle dessus : chaque enfant est un élément `house` ou `apartment`, dont on lit les informations dans les balises ;
- le travail est découpé en petites méthodes (`readOwner`, `readBuilding`) pour ne pas avoir une méthode `parse` beaucoup trop longue.

### Intégrer au programme

Le parseur est rangé dans un package dédié aux outils. Dans `AppData`, on ajoute une méthode qui l'appelle à la place des ajouts écrits en dur :

```java
private void initDataFromXml() {
    BuildingXmlParser.parse("res/buildings.xml", owners, buildings);
}
```

Le fichier se trouve dans le dossier de ressources : le chemin est `res/buildings.xml`. Le reste du programme ne change pas : il continue d'utiliser `AppData.getInstance().getBuildings()`.

Un `System.out.println(buildings.size())` après le chargement permet de vérifier que les données ont bien été lues. Avec le fichier du TP, on obtient 50 bâtiments. Mais on obtient aussi 50 propriétaires, ce qui est suspect.

### Un piège : les doublons

Dans le fichier, certains propriétaires possèdent plusieurs bâtiments. Ils y sont décrits à chaque fois avec les mêmes informations : même nom, même prénom, même âge. Il ne s'agit pas d'homonymes, mais bien de la même personne.

On souhaite donc que tous ces bâtiments **référencent le même objet propriétaire**, au lieu d'en créer un nouveau à chaque fois. C'est le rôle de ce passage de la méthode `parse` :

```java
Owner owner = readOwner(element);
int index = owners.indexOf(owner);
if (index != -1) {
    owner = owners.get(index);  // déjà présent : on réutilise l'objet existant
} else {
    owners.add(owner);          // nouveau : on l'ajoute à la liste
}
buildings.add(readBuilding(element, owner));
```

La logique est correcte, mais elle ne fonctionne pas : la liste contient 50 propriétaires. `indexOf` n'a donc jamais retourné autre chose que `-1`.

#### Comprendre indexOf

La documentation de `indexOf` dit qu'elle retourne la position de la première occurrence de l'élément s'il est présent, et `-1` sinon. En regardant le code de la méthode, on constate qu'elle parcourt la liste avec une boucle et **appelle `equals`** sur chaque élément pour savoir s'il est égal à l'objet recherché.

Or la méthode `equals` n'a pas été redéfinie dans nos classes : c'est donc la version de `Object`, qui compare les références. Comme chaque propriétaire a été créé par un `new` distinct, `equals` retourne toujours `false`, et `indexOf` retourne toujours `-1`.

On retrouve ici l'intérêt de la redéfinition de `equals` vue dans le chapitre sur le polymorphisme : toute méthode d'une collection qui cherche un élément s'appuie dessus.

#### La correction : redéfinir equals

Il n'y a rien à changer dans la méthode `parse` : la stratégie est la bonne. Il faut seulement dire comment deux propriétaires sont égaux. La classe `Owner` hérite de `Person` : on commence donc par définir l'égalité de deux personnes (même nom, même prénom, même âge) :

```java
// classe Person
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Person person = (Person) o;
    return age == person.age
            && Objects.equals(lastName, person.lastName)
            && Objects.equals(firstName, person.firstName);
}
```

Puis on complète pour `Owner`, en s'appuyant sur la méthode de la classe mère :

```java
// classe Owner
@Override
public boolean equals(Object o) {
    if (!super.equals(o)) return false;
    Owner owner = (Owner) o;
    return Objects.equals(company, owner.company);
}
```

Deux propriétaires sont égaux s'ils le sont en tant que personnes (sinon la méthode retourne `false`) et s'ils ont aussi la même valeur pour leur attribut propre. `Objects.equals` compare deux valeurs en se protégeant d'une éventuelle `NullPointerException`.

IntelliJ sait générer ces méthodes (Code > Generate > equals() and hashCode()) : on choisit les attributs qui définissent l'égalité. Il faut savoir les écrire, mais la génération évite les erreurs.

#### Résultat

Après avoir relancé le programme, on obtient toujours 50 bâtiments, mais seulement 11 propriétaires. Chaque propriétaire n'existe qu'une fois en mémoire et est partagé par tous les bâtiments qu'il possède.

Ce cas pratique montre qu'un bug peut venir d'ailleurs que du code que l'on regarde : la méthode `parse` n'avait aucun problème, c'est l'absence de `equals` dans une autre classe qui faussait le résultat.

### Compléments

**Complément :** DOM, SAX et StAX sont fournis avec le JDK (paquet `javax.xml`) : aucune dépendance externe n'est nécessaire. DOM est le plus simple pour de petits fichiers, SAX et StAX conviennent mieux aux fichiers volumineux.

**Complément :** le chemin du fichier (`res/buildings.xml`, par exemple) dépend de l'endroit où le programme est lancé. Un fichier placé dans un dossier de ressources peut aussi être lu via le classpath (`getResourceAsStream`), ce qui évite les chemins dépendant de la machine.

**Complément :** `indexOf`, `contains` et `remove(Object)` s'appuient tous sur `equals`. Lorsqu'on redéfinit `equals`, on redéfinit aussi `hashCode` pour respecter le contrat vu dans le chapitre sur le polymorphisme.

**Complément :** pour éviter les doublons sur un grand nombre d'éléments, une `Map` ou un `Set` (qui s'appuient sur `hashCode`) sont plus efficaces qu'un `indexOf` sur une liste, qui parcourt tous les éléments.

**Complément :** quand on utilise une IA, on ne lui transmet pas de données confidentielles ou sensibles : un extrait fictif du fichier suffit.

### À retenir

- Un fichier de données se range dans un dossier de ressources (`res`), pas dans les sources Java.
- Un XML se lit avec les API du JDK (DOM, SAX, StAX) ; le type d'élément peut servir à choisir la classe à créer, via la fabrique.
- Une IA est un bon point de départ pour découvrir une API : on lui pose une question simple, puis on lui donne du contexte (signature, exemples, classes) et on itère.
- Le code généré se lit, se comprend et se teste : il peut contenir des erreurs ou de mauvaises pratiques (par exemple de la duplication de code).
- La méthode `initData` du Singleton peut ainsi charger les données depuis un fichier plutôt que de les écrire en dur.
- Les méthodes de recherche des collections (`indexOf`, `contains`, `remove(Object)`) utilisent `equals` : sans redéfinition, deux objets de même contenu ne sont jamais considérés comme égaux.
- Quand un objet est partagé entre plusieurs autres (un propriétaire de plusieurs bâtiments), on réutilise la référence existante plutôt que d'en créer une copie.

---

## Classes mutables et classes immuables

### Définitions

Une classe est **immuable** (en anglais *immutable*) lorsque ses objets sont initialisés dans un certain état, et que cet état **ne peut plus évoluer** pendant toute la vie de l'objet.

À l'inverse, une classe est **mutable** (*mutable*) lorsque ses objets peuvent **changer d'état** après leur création.

Pour l'illustrer, on prend une classe simple, `Tenant` (locataire), qui n'a qu'un nom.

### Une classe mutable

Avec l'encapsulation, on déclare l'attribut privé et on ajoute un accesseur et un mutateur :

```java
public class Tenant {

    private String name;

    public Tenant(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Tenant : " + name;
    }
}
```

C'est le `setName` qui permet de faire **muter** l'objet :

```java
Tenant tenant = new Tenant("Anne");
tenant.setName("Mary"); // l'état de l'objet a changé
```

`Tenant` est donc une classe mutable.

### Une classe immuable

Pour qu'un objet ne puisse plus changer d'état, deux règles s'appliquent :

- **pas de setter** ;
- **tous les attributs sont `final`**.

```java
public class Tenant {

    private final String name;

    public Tenant(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Tenant : " + name;
    }
}
```

L'état est fixé par le constructeur et ne change plus. Les objets immuables sont beaucoup plus simples à maintenir et à tester : on a la garantie qu'un objet créé dans un état donné ne changera pas après avoir été manipulé. Ils peuvent aussi être partagés sans risque entre plusieurs parties du programme.

### Une classe immuable se compose de classes immuables

Cette garantie ne tient que si les attributs eux-mêmes sont de types immuables.

#### Le cas de String

La classe `String` est immuable : la documentation l'indique (« String objects are immutable »). Elle enferme un tableau d'octets déclaré `final`, et aucune méthode ne permet de modifier la valeur de la chaîne.

Les méthodes comme `toUpperCase` ne modifient pas l'objet : elles retournent **une nouvelle chaîne** :

```java
String name = "Anne";
String upper = name.toUpperCase();
// name vaut toujours "Anne", upper vaut "ANNE"
```

Réaffecter une variable (`name = name.toUpperCase();`) ne modifie pas l'objet d'origine : la variable pointe simplement vers un autre objet. La différence est sur la référence, pas sur l'état de l'objet initial.

#### Le cas de StringBuilder

`StringBuilder` représente aussi une chaîne de caractères, mais c'est une classe **mutable** (la première phrase de sa Javadoc le précise). Elle propose des méthodes qui modifient l'objet, comme `reverse`.

Si la classe `Tenant` utilise un `StringBuilder` comme nom, elle ne peut plus garantir son immutabilité, même avec un attribut `final` et sans setter.

```java
public class Tenant {

    private final StringBuilder name;

    public Tenant(StringBuilder name) {
        this.name = name; // copie de la référence
    }

    public StringBuilder getName() {
        return name;
    }
}
```

Le programme semble fonctionner. Mais :

```java
StringBuilder name = new StringBuilder("Anne");
Tenant tenant = new Tenant(name);

name.reverse(); // le nom du locataire est maintenant "ennA"
```

Le constructeur a copié la **référence** : `name` (dans le programme) et l'attribut de `Tenant` désignent le même objet. Modifier l'un modifie l'autre. De même, `tenant.getName().reverse()` modifie le nom à l'intérieur du locataire.

### La copie défensive

Pour protéger une classe immuable qui contient un objet mutable, il faut faire une **copie défensive**, à deux endroits :

- **dans le constructeur** : on ne conserve pas la référence reçue, on crée un nouvel objet dans le même état ;
- **dans le getter** : on ne retourne pas l'objet encapsulé, on retourne une copie.

```java
public class Tenant {

    private final StringBuilder name;

    public Tenant(StringBuilder name) {
        this.name = new StringBuilder(name); // copie défensive à la création
    }

    public StringBuilder getName() {
        return new StringBuilder(name);      // copie défensive au retour
    }
}
```

Avec ces deux protections, ni le code qui a créé l'objet, ni celui qui appelle le getter ne peuvent modifier l'état du `Tenant`.

### Pourquoi préférer l'immutabilité

Toute cette complexité disparaît avec une `String` : le nom reçu ne peut pas être modifié depuis l'extérieur, et le getter peut retourner l'attribut directement, sans risque.

Les classes immuables sont plus simples à utiliser, à partager et à tester. Le choix dépend toutefois de l'objet que l'on modélise : certains objets sont faits pour évoluer. Mais à chaque création de classe, on se pose la question : cette classe doit-elle être mutable, ou immuable ?

### Compléments

**Complément :** `final` sur une référence signifie que la variable ne sera pas réaffectée, mais n'empêche pas de modifier l'objet pointé. Un attribut `final StringBuilder` reste donc modifiable via ses méthodes.

**Complément :** pour qu'une classe immuable ne puisse pas être rendue mutable par une fille, on la déclare aussi `final` (comme `String`) : personne ne peut en hériter pour lui ajouter des mutateurs.

**Complément :** depuis Java 16, les `record` permettent de déclarer simplement des classes dont les attributs sont `final` et sans setter. Ils restent soumis à la même règle : si un attribut est d'un type mutable, le `record` n'est pas pour autant immuable en profondeur.

**Complément :** `List.of(...)` crée une liste immuable, et `Collections.unmodifiableList(...)` fournit une vue en lecture seule d'une liste existante. Ils s'utilisent pour exposer une collection sans permettre de la modifier, comme évoqué pour `getBuildings()` dans la section sur le Singleton.

### À retenir

- Un objet d'une classe immuable ne peut plus changer d'état après sa création ; celui d'une classe mutable le peut.
- Une classe immuable n'a pas de setter et tous ses attributs sont `final`.
- Elle ne doit être composée que de classes immuables, sinon l'immutabilité est compromise.
- `String` est immuable (ses méthodes retournent une nouvelle chaîne), `StringBuilder` est mutable.
- Avec un attribut mutable, il faut faire une copie défensive dans le constructeur et dans le getter.
- Les classes immuables sont plus simples à maintenir, à partager et à tester.

---

## Les dates : Date et LocalDate

Java propose deux classes principales pour représenter une date. Elles illustrent la différence entre classe mutable et classe immuable vue dans la section précédente.

### La classe Date

La classe `Date` (package `java.util`) est l'ancienne classe du langage. Elle s'utilise comme les classes que l'on crée soi-même : on déclare une variable, puis on appelle un constructeur avec `new`.

```java
Date date = new Date(1234567890000L); // un timestamp en millisecondes
System.out.println(date);
```

Le `println` appelle la méthode `toString` de `Date` et affiche la date correspondante (ici, un jour de février 2009, selon le fuseau horaire).

### La classe LocalDate

La classe `LocalDate` (package `java.time`) a été introduite avec **Java 8**, en 2014. Elle représente une date sans heure : année, mois, jour.

Particularité : **tous ses constructeurs sont privés**. On ne peut donc pas écrire `new LocalDate(...)`. On passe par des **méthodes statiques** de la classe, qui fabriquent l'objet, comme dans le patron Factory :

```java
LocalDate today = LocalDate.now();             // la date du jour, d'après l'horloge de la machine
LocalDate date = LocalDate.of(2024, 10, 2);    // année, mois, jour : le 2 octobre 2024

System.out.println(date);                      // 2024-10-02
```

### La grosse différence : mutable ou immuable

**`Date` est mutable.** Elle possède des méthodes de modification (des setters) qui changent l'état de l'objet :

```java
Date date = new Date(1234567890000L);
date.setYear(95); // attention : l'année attendue est "année - 1900", ici 1995
```

L'objet `date` désigne maintenant une date en 1995 : c'est le même objet, dont l'état a changé.

**`LocalDate` est immuable.** La documentation le précise, et on constate qu'elle n'a aucun setter. Les méthodes comme `minusYears` ne modifient pas l'objet : elles **retournent un nouvel objet** :

```java
LocalDate date = LocalDate.of(2024, 10, 2);

LocalDate date2 = date.minusYears(29);

System.out.println(date);   // 2024-10-02 : l'objet d'origine n'a pas changé
System.out.println(date2);  // 1995-10-02 : un nouvel objet
```

Appeler `date.minusYears(29)` sans utiliser son résultat ne sert donc à rien. IntelliJ le signale d'ailleurs par un avertissement (« result ignored »), puisque la valeur retournée, le nouvel objet, n'est pas stockée.

Pour « faire évoluer » une variable, on la **réaffecte** :

```java
date = date.minusYears(29);
```

La variable pointe maintenant vers le nouvel objet. L'ancien, plus référencé, pourra être nettoyé par le ramasse-miettes.

#### Comment c'est fait en interne

Il est instructif de regarder le code de la méthode, comme pour `ArrayList` ou `indexOf`. Dans le JDK, `minusYears` s'appuie sur `plusYears` en passant l'opposé de la valeur. `plusYears` crée un nouvel objet en appelant le constructeur privé avec la nouvelle valeur. C'est exactement le principe d'une classe immuable : une méthode appelée sur un objet ne peut pas modifier son état, elle retourne un nouvel objet construit à partir de l'image de l'objet d'origine, avec les modifications demandées.

Le constructeur est privé pour que l'on ne passe que par les méthodes statiques (`now`, `of`) pour créer des dates : on retrouve la combinaison constructeur masqué et méthodes de fabrication.

### Quelle classe utiliser ?

`Date` permet de faire évoluer un seul objet, alors que `LocalDate` crée de nouveaux objets à chaque opération. Le choix dépend de ce que représente la classe, mais en pratique on utilise `LocalDate` pour les raisons vues sur l'immutabilité : objets sûrs à partager, simples à tester et à raisonner.

### Afficher une date au format souhaité

L'affichage par défaut (`2024-10-02`) n'est pas toujours celui que l'on veut. La méthode `format` d'une `LocalDate` attend un `DateTimeFormatter`, que l'on construit avec un **pattern** : une chaîne dont les lettres représentent chaque élément de la date.

```java
LocalDate date = LocalDate.of(2024, 10, 2);

DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
String text = date.format(formatter);

System.out.println(text); // 02/10/2024
```

La méthode `format` retourne la chaîne de caractères, que l'on peut ensuite afficher. Les principales lettres du pattern sont :

| Lettre | Signification |
|---|---|
| `y` | année (`yyyy` : 4 chiffres) |
| `M` (majuscule) | mois (`MM` : 2 chiffres) |
| `d` | jour du mois (`dd` : 2 chiffres) |
| `m` (minuscule) | minutes |

Attention à la casse : `M` désigne le mois, `m` les minutes. La Javadoc de `DateTimeFormatter` donne la liste complète des lettres et des exemples d'utilisation.

### Compléments

**Complément :** `LocalDate.of` numérote les mois de 1 à 12, ce qui est plus naturel que l'ancienne classe `Date`, dont les mois commençaient à 0. On peut aussi utiliser l'énumération `Month` : `LocalDate.of(2024, Month.OCTOBER, 2)`.

**Complément :** la méthode `setYear` de `Date` et d'autres méthodes sont dépréciées (*deprecated*) : elles sont conservées pour compatibilité, mais on déconseille de les utiliser.

**Complément :** le package `java.time` contient d'autres classes immuables sur le même principe : `LocalTime` (heure), `LocalDateTime` (date et heure), `Instant` (un instant précis), `Duration` et `Period`. Un `DateTimeFormatter` est lui aussi immuable.

**Complément :** pour comparer deux dates, on utilise `isBefore`, `isAfter` et `equals` plutôt que `==`. La classe `LocalDate` redéfinit `equals` pour comparer les valeurs, comme vu dans le chapitre sur le polymorphisme.

**Complément :** dans notre exemple fil rouge, la date de construction d'un `Building` pourrait être une `LocalDate` plutôt qu'un simple entier pour l'année : cela permet de bénéficier de toutes les opérations de la classe.

### À retenir

- `Date` est l'ancienne classe, mutable : ses setters modifient l'objet.
- `LocalDate` (Java 8, `java.time`) est immuable : aucune méthode ne modifie l'objet, elles retournent un nouvel objet.
- Les constructeurs de `LocalDate` sont privés : on crée une date avec `LocalDate.now()` ou `LocalDate.of(année, mois, jour)`.
- Avec une classe immuable, on réaffecte la variable avec le résultat : `date = date.minusYears(29);`. Ignorer le résultat n'a aucun effet.
- Pour formater une date, on passe un `DateTimeFormatter` (créé avec `ofPattern`) à la méthode `format`.
- Dans un pattern, `M` représente le mois et `m` les minutes.

---

## Application : construire un modèle immuable

On applique maintenant les notions de classe immuable et de copie défensive à notre programme. Les données sont chargées depuis le fichier XML : les objets créés doivent refléter exactement le contenu du fichier, et on ne doit plus pouvoir modifier leur état après leur initialisation.

### Étape 1 : rendre les classes du modèle immuables

Les classes `House`, `ApartmentBuilding` et `Shop` héritent de `Building` (par l'intermédiaire de `Housing` pour les deux premières) : si on veut des filles immuables, la mère doit l'être aussi. Et chaque classe doit être composée d'objets immuables. On vérifie donc de bas en haut :

- les attributs de type `int` ne posent pas de problème : un type primitif est une valeur ;
- les attributs de type `String` non plus : `String` est immuable ;
- un `Building` est associé à un propriétaire (`Owner`), qui doit donc être immuable lui aussi ;
- `Owner` hérite de `Person` : on commence par `Person`.

Dans `Person`, il n'y a rien à modifier sur le fond : aucun setter, aucune méthode qui réaffecte un attribut. Le nom, le prénom et l'âge sont de types immuables. IntelliJ signale d'ailleurs que les attributs peuvent être déclarés `final`. Il suffit de l'ajouter :

```java
public class Person {

    private final String lastName;
    private final String firstName;
    private final int age;

    // constructeur, getters, equals, hashCode...
}
```

On fait de même pour l'attribut de `Owner`, puis pour les attributs de `Building` et de chacune de ses filles. On obtient des objets initialisés dans l'état décrit par le fichier XML, avec la garantie qu'ils ne pourront plus être modifiés.

### Étape 2 : se méfier des paramètres mutables

Un objet immuable n'est sûr que si tout ce qu'il contient l'est aussi. Prenons une classe `Rental` (location) qui représente un bâtiment loué à partir d'une date, pour un certain nombre de nuits. Le bâtiment est immuable, mais la date d'arrivée passée en paramètre est un objet de type `Date`, c'est-à-dire un objet **mutable**.

Cette classe est donnée à titre d'illustration. On suppose que `Building` fournit un tarif par nuit.

```java
public class Rental {

    private Building building;
    private final Date startDate;
    private final int nights;
    private double price;

    public Rental(Building building, Date startDate, int nights) {
        // copie de la référence : dangereux, la Date reste modifiable depuis l'extérieur
        this.startDate = startDate;
        if (startDate.before(new Date())) {
            throw new IllegalArgumentException("La date d'arrivée doit être dans le futur");
        }
        this.building = building;
        this.nights = nights;
        updatePrice();
    }

    private void updatePrice() {
        this.price = building.getPricePerNight() * nights;
    }
}
```

Le constructeur vérifie que la date d'arrivée est correcte : si elle ne l'est pas, une exception est levée. Mais cette vérification ne protège que le moment de la création :

```java
Date date = /* une date dans le futur */;
Rental rental = new Rental(building, date, 1); // accepté

date.setYear(95); // la date de la location devient 1995 !
```

La `Rental` a copié la **référence** de la date. Comme la date est toujours manipulable à l'extérieur, on peut la modifier après coup, et la location se retrouve avec une date d'arrivée dans le passé, sans qu'aucun contrôle ne l'ait détecté.

### Étape 3 : la copie défensive

La classe doit se protéger avec une **copie défensive** : au lieu de conserver la référence reçue, elle crée son propre objet `Date`. Il y a deux façons de le faire :

```java
// 1. en créant une nouvelle Date à partir du timestamp
this.startDate = new Date(startDate.getTime());

// 2. en clonant la date
this.startDate = (Date) startDate.clone();
```

La méthode `clone` est définie dans `Object` et retourne un `Object` : il faut donc caster le résultat en `Date`. `Date` redéfinit bien cette méthode pour cloner correctement la date. Les deux techniques sont équivalentes.

Il est préférable de copier la date **avant** de la contrôler, de façon à contrôler la copie que l'on conserve :

```java
public Rental(Building building, Date startDate, int nights) {
    this.startDate = new Date(startDate.getTime());
    if (this.startDate.before(new Date())) {
        throw new IllegalArgumentException("La date d'arrivée doit être dans le futur");
    }
    // ...
}
```

Et comme on l'a vu dans la section précédente, le getter qui retourne la date doit lui aussi retourner une copie.

Rien de tout cela ne serait nécessaire si on manipulait un objet de classe immuable. Si l'on changeait le modèle pour utiliser `LocalDate`, la copie défensive deviendrait inutile.

### Étape 4 : une classe mutable doit assumer les conséquences de ses setters

Dans l'exemple précédent, `Rental` n'est que partiellement immuable : le bâtiment n'est pas `final`. Supposons qu'on lui ajoute un setter pour changer de bâtiment après la création :

```java
public void setBuilding(Building building) {
    this.building = building;
}
```

On crée une location sur un premier bâtiment dont le tarif est de 200 euros la nuit, puis on décide de partir dans un second bâtiment à 100 euros :

```java
rental.setBuilding(secondBuilding);
```

Le bâtiment a changé, mais le prix de la location est resté à 200 euros. Le setter a réaffecté l'attribut, sans rien changer d'autre : or le prix dépend du bâtiment. L'objet est maintenant **incohérent**.

Il faut donc que le setter appelle la méthode qui recalcule l'état dépendant, ici `updatePrice` :

```java
public void setBuilding(Building building) {
    this.building = building;
    updatePrice();
}
```

Dernier point : le paramètre peut être `null`. Dans ce cas, `updatePrice` provoquerait une `NullPointerException` en appelant `building.getPricePerNight()`. On refuse donc explicitement la valeur, avec une `IllegalArgumentException`, et on documente ce comportement dans la Javadoc :

```java
/**
 * Change le bâtiment loué et recalcule le prix.
 *
 * @param building le nouveau bâtiment
 * @throws IllegalArgumentException si le bâtiment est null
 */
public void setBuilding(Building building) {
    if (building == null) {
        throw new IllegalArgumentException("Le bâtiment ne peut pas être null");
    }
    this.building = building;
    updatePrice();
}
```

L'exception levée apparaît alors dans la documentation affichée à l'appel de la méthode.

Cette difficulté illustre l'intérêt des classes immuables : avec elles, ces questions ne se posent pas. Écrire un setter n'est pas anodin : il faut penser à ce qu'il implique sur le reste de l'état de l'objet.

### Compléments

**Complément :** `updatePrice` est privée, donc elle n'est pas redéfinissable par une fille. C'est ce qui permet de l'appeler sans risque depuis le constructeur et le setter. Appeler dans un constructeur une méthode redéfinissable est au contraire à éviter : la fille pourrait l'exécuter avant que ses propres attributs soient initialisés.

**Complément :** l'alternative à un setter sur une classe immuable est de retourner un nouvel objet avec la modification, comme le fait `LocalDate.minusYears`. Par exemple, une méthode `withBuilding(Building)` qui retournerait une nouvelle `Rental`.

### À retenir

- Pour qu'une classe soit immuable, ses attributs doivent être `final` et de types immuables (types primitifs, `String`, objets de classes immuables).
- Une classe mère et ses filles doivent toutes être immuables pour que l'ensemble le soit.
- Un attribut de type mutable (comme `Date`) oblige à faire une copie défensive à la création et au retour du getter, sans quoi l'objet peut être modifié depuis l'extérieur après avoir été validé.
- Le plus simple est de choisir des types immuables (`LocalDate` plutôt que `Date`).
- Un setter doit maintenir la cohérence de l'objet (par exemple recalculer le prix), refuser les valeurs invalides, et documenter les exceptions qu'il peut lever.

---

## Le patron de conception Builder

### Contexte

Notre liste contient désormais beaucoup de bâtiments. Pour qu'un utilisateur choisisse celui qui lui convient, on ne peut plus se contenter de prendre le premier élément de la liste : il faut lui permettre de faire une **recherche**. Il saisit des critères, et on obtient en résultat une liste réduite de bâtiments, à partir des données du Singleton.

On crée pour cela une classe qui représente les critères d'une recherche, `SearchCriteria`, dans le package `data`. Elle contient :

- le nombre de voyageurs ;
- un tarif minimum par nuit ;
- un tarif maximum par nuit ;
- un critère sur la présence d'une piscine.

On souhaite que cette classe soit **immuable** : une fois les critères créés, on ne les modifie plus. Pour faire une nouvelle recherche, on crée un nouvel objet.

### Première version : une classe immuable

On applique les règles vues précédemment : tous les attributs sont `final`, pas de setter. Comme les attributs `final` doivent être initialisés, on ajoute un constructeur qui les prend tous :

```java
public class SearchCriteria {

    private final int travelers;
    private final int minPrice;
    private final int maxPrice;
    private final int pool;

    public SearchCriteria(int travelers, int minPrice, int maxPrice, int pool) {
        this.travelers = travelers;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.pool = pool;
    }

    // getters
}
```

### Le problème : paramètres obligatoires et optionnels

Les quatre critères n'ont pas le même statut :

- le **nombre de voyageurs est obligatoire** : il faut toujours le renseigner ;
- le tarif minimum, le tarif maximum et la piscine sont **optionnels** : l'utilisateur peut ne pas les préciser.

Avec un seul constructeur à quatre paramètres, on oblige à tout renseigner. La première idée est de multiplier les constructeurs (surcharge) :

```java
public SearchCriteria(int travelers) {
    this(travelers, 0, Integer.MAX_VALUE, 0);
}

public SearchCriteria(int travelers, int minPrice) {
    this(travelers, minPrice, Integer.MAX_VALUE, 0);
}

public SearchCriteria(int travelers, int maxPrice) { // erreur de compilation !
    this(travelers, 0, maxPrice, 0);
}
```

Cette approche échoue : les deux derniers constructeurs ont la même signature (`int, int`), et le nom des paramètres ne compte pas pour le compilateur. Il est impossible de distinguer « je donne le tarif minimum » de « je donne le tarif maximum ». Avec trois critères optionnels, il faudrait en plus un constructeur pour chaque combinaison possible.

On ne peut pas non plus créer l'objet avec un constructeur par défaut puis renseigner les valeurs avec des setters : la classe est immuable, elle n'en a pas.

### La solution : le patron de conception Builder

Le patron **Builder** (monteur) répond à ce besoin : construire une instance d'une classe immuable lorsqu'il y a des paramètres obligatoires et des paramètres optionnels. On passe par un objet intermédiaire, le builder, que l'on configure étape par étape avant de lui demander de produire l'objet final.

#### 1. Une classe interne statique

On déclare la classe `Builder` **à l'intérieur** de `SearchCriteria`. C'est une classe interne, qui a accès aux éléments privés de la classe qui la contient. Elle est déclarée `static` : on doit pouvoir l'utiliser sans disposer d'une instance de `SearchCriteria` (qui n'existe pas encore, puisque c'est précisément ce que le builder doit construire). On y accède par `SearchCriteria.Builder`.

#### 2. Le constructeur de la classe devient privé

Si le constructeur reste public, n'importe qui peut le contourner. On le déclare privé : seul le builder, qui est dans le corps de la classe, peut l'appeler. Il reçoit le builder en paramètre et recopie ses valeurs :

```java
private SearchCriteria(Builder builder) {
    this.travelers = builder.travelers;
    this.minPrice = builder.minPrice;
    this.maxPrice = builder.maxPrice;
    this.pool = builder.pool;
}
```

#### 3. Les attributs du builder

Le builder reprend les attributs de la classe. L'attribut **obligatoire** est `final` : on ne pourra pas créer de builder sans le renseigner. Les attributs **optionnels** ne sont pas `final`, puisqu'on pourra les modifier par des méthodes. Ils doivent surtout être **initialisés avec une valeur par défaut correcte**, car on ne sera pas obligé d'appeler les méthodes qui les renseignent.

```java
public static class Builder {

    private final int travelers;                 // obligatoire
    private int minPrice = 0;                    // optionnel
    private int maxPrice = Integer.MAX_VALUE;    // optionnel
    private int pool = POOL_INDIFFERENT;         // optionnel

    public Builder(int travelers) {
        this.travelers = travelers;
    }
}
```

Le constructeur du builder ne prend que l'attribut obligatoire : on ne peut pas créer un builder sans préciser le nombre de voyageurs.

#### 4. Les méthodes pour les paramètres optionnels

Chaque paramètre optionnel a sa méthode, qui renseigne l'attribut du builder **et retourne le builder lui-même** (`return this`). Cela permet d'enchaîner les appels :

```java
public Builder minPrice(int minPrice) {
    this.minPrice = minPrice;
    return this;
}

public Builder maxPrice(int maxPrice) {
    this.maxPrice = maxPrice;
    return this;
}

public Builder withPool(boolean wanted) {
    this.pool = wanted ? POOL_WANTED : POOL_UNWANTED;
    return this;
}
```

Si ces méthodes ne retournaient rien (`void`), il faudrait écrire une instruction par ligne en repartant à chaque fois de la variable du builder. Avec `return this`, on obtient une écriture fluide.

#### 5. La méthode build

La méthode `build` ne prend rien en paramètre. Elle appelle le constructeur privé de `SearchCriteria`, en lui passant le builder (`this`), et retourne l'objet créé :

```java
public SearchCriteria build() {
    return new SearchCriteria(this);
}
```

### Utilisation

Une recherche avec le seul critère obligatoire :

```java
SearchCriteria criteria = new SearchCriteria.Builder(3).build();
```

Une recherche plus complète, en enchaînant les méthodes optionnelles :

```java
SearchCriteria criteria = new SearchCriteria.Builder(3)
        .minPrice(100)
        .maxPrice(300)
        .withPool(true)
        .build();
```

On n'est jamais obligé de renseigner les critères optionnels, et on peut le faire dans n'importe quel ordre. L'objet obtenu est immuable : pour faire une autre recherche, on crée un nouveau builder et un nouvel objet.

### Un critère à trois états : piscine

Le critère de piscine est stocké sous forme d'entier et non de `boolean`. Un booléen n'a que deux valeurs, alors qu'il y a ici **trois choix** : on veut une piscine, on ne veut pas de piscine, ou cela n'a pas d'importance. L'absence de précision est le troisième cas :

| Valeur | Signification |
|---|---|
| 0 | l'utilisateur ne se prononce pas (valeur par défaut) |
| 1 | l'utilisateur veut une piscine |
| 2 | l'utilisateur ne veut pas de piscine |

La méthode `withPool` attend un `boolean` (c'est plus naturel pour l'appelant) et le traduit en 1 ou 2. Si elle n'est pas appelée, la valeur reste à 0.

Ces valeurs ne doivent pas apparaître « en dur » dans le code : on les remplace par des **constantes nommées**, déclarées dans la classe `SearchCriteria` (et non dans le builder, puisqu'elles font partie du vocabulaire de la classe). Dans IntelliJ, le refactoring « Introduce Constant » permet de les extraire :

```java
public static final int POOL_INDIFFERENT = 0;
public static final int POOL_WANTED = 1;
public static final int POOL_UNWANTED = 2;
```

### Attention aux valeurs par défaut

Les attributs optionnels du builder doivent être initialisés correctement. Un type primitif `int` vaut `0` par défaut. Cela convient au tarif minimum et à la piscine (« ne se prononce pas »), mais pas au tarif maximum : s'il vaut `0`, plus aucun bâtiment ne peut correspondre à la recherche, et on n'obtient aucun résultat. C'est pourquoi il est initialisé à `Integer.MAX_VALUE`. Pour que le code soit explicite, on initialise aussi le tarif minimum à `0` plutôt que de compter sur la valeur par défaut.

Pour vérifier le contenu d'un objet, on redéfinit `toString` dans `SearchCriteria` :

```java
@Override
public String toString() {
    return "SearchCriteria{travelers=" + travelers
            + ", minPrice=" + minPrice
            + ", maxPrice=" + maxPrice
            + ", pool=" + pool + "}";
}
```

### Résultat

On dispose d'une classe immuable que l'on construit sans multiplier les constructeurs, avec des paramètres obligatoires imposés par le constructeur du builder et des paramètres optionnels renseignés au besoin, dans un code lisible.

### Compléments

**Complément :** on peut valider les critères dans `build()` avant de créer l'objet : par exemple, lever une `IllegalArgumentException` si le tarif minimum est supérieur au tarif maximum ou si le nombre de voyageurs est négatif. L'objet créé est ainsi toujours valide.

**Complément :** pour un critère à trois états comme la piscine, une énumération (`PoolPreference` avec `INDIFFERENT`, `WANTED`, `UNWANTED`) est préférable à des constantes entières : le compilateur empêche de passer une valeur invalide.

**Complément :** la forme `Builder` interne et statique, avec des méthodes qui retournent `this`, est la plus répandue en Java. On la retrouve dans le JDK (par exemple avec `StringBuilder`, dont les méthodes `append` retournent l'objet pour permettre le chaînage) et dans de nombreuses bibliothèques. Certaines bibliothèques, comme Lombok, la génèrent automatiquement avec l'annotation `@Builder`.

**Complément :** le patron Builder se distingue de la Factory vue plus haut. La Factory choisit **quelle classe** instancier selon une condition. Le Builder construit **un objet complexe** pas à pas, quand il y a beaucoup de paramètres dont certains sont facultatifs.

### À retenir

- Le patron Builder permet de construire une instance d'une classe immuable lorsqu'il y a des paramètres obligatoires et des paramètres optionnels.
- La surcharge de constructeurs ne suffit pas : deux constructeurs ayant les mêmes types de paramètres sont impossibles, même avec des noms différents.
- Le builder est une classe interne statique. Le constructeur de la classe principale est privé et reçoit le builder en paramètre.
- Le paramètre obligatoire est un attribut `final` passé au constructeur du builder ; les paramètres optionnels sont renseignés par des méthodes qui retournent `this`, ce qui permet le chaînage.
- Les attributs optionnels du builder doivent recevoir une valeur par défaut cohérente (par exemple `Integer.MAX_VALUE` pour un maximum).
- La méthode `build()` crée l'objet final ; on remplace les valeurs magiques par des constantes nommées.