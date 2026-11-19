# La classe `Optional` et les références de méthodes

Deux dernières évolutions de Java 8 qui complètent les streams. `Optional` exprime, dans le type même du résultat, qu'**une valeur peut ne pas exister**, et réduit les risques de `NullPointerException`. Les **références de méthodes** sont un troisième niveau de réduction d'écriture, après la classe anonyme et la lambda.

## Objectifs

À la fin du chapitre, tu sauras :

* expliquer pourquoi `Optional` existe, et l'utiliser (`ifPresent`, `ifPresentOrElse`, `orElse`...) ;
* exploiter les résultats d'une recherche avec les streams ;
* regrouper des éléments avec `groupingBy` ;
* remplacer une lambda par une **référence de méthode** quand c'est possible.

## La classe `Optional`

### Le problème

Cherchons le **premier nom de plus de 3 lettres** dans l'équipage. On filtre, puis `findFirst` récupère le premier élément. Comme toujours, on écrit d'abord la classe anonyme du `Predicate`, puis la lambda :

```java
names.stream()
        .filter(name -> name.length() > 3)
        .findFirst();
```

On s'attend à récupérer une `String`. Mais que retourne la méthode si **aucun** nom ne correspond (avec un filtre à plus de 30 lettres, par exemple) ? Elle ne peut pas retourner de chaîne. Elle pourrait retourner `null`, ou lever une exception.

Si elle retournait `null`, l'appelant pourrait utiliser le résultat comme un objet normal... et provoquer une `NullPointerException`. Rien ne l'aurait prévenu de tester le résultat avant.

### La solution : `Optional`

`Optional` est une **enveloppe** qui contient un objet **s'il est présent**, et qui est vide sinon. Le type de retour avertit l'appelant que le résultat peut ne pas exister. `Optional` est générique : ici `findFirst` retourne un `Optional<String>`.

```java
Optional<String> first = names.stream()
        .filter(name -> name.length() > 3)
        .findFirst();
```

On ne manipule plus directement une `String` : on manipule l'enveloppe. Affichée, elle donne `Optional[Anne]`, ou `Optional.empty` si elle est vide.

### Utiliser un `Optional`

**`isPresent()` et `get()`.** `isPresent()` indique si une valeur est présente ; `get()` la retourne :

```java
if (first.isPresent()) {
    String name = first.get();
    System.out.println(name.toUpperCase());
}
```

On n'accède à la valeur que lorsqu'on sait qu'elle existe. Appeler `get()` sur un `Optional` vide lève une `NoSuchElementException` (`No value present`).

**`ifPresent()`.** On passe l'action à exécuter **uniquement si la valeur est présente**. Elle attend un `Consumer`. La classe anonyme, puis la lambda :

```java
first.ifPresent(new Consumer<String>() {
    @Override
    public void accept(String name) {
        System.out.println(name);
    }
});

first.ifPresent(name -> System.out.println(name));
```

S'il n'y a pas de valeur, il ne se passe rien : pas d'affichage, et surtout pas de `NullPointerException`.

**`ifPresentOrElse()`.** Prévoit aussi le cas d'absence. Deux paramètres : un `Consumer` (cas présent) et un `Runnable` (cas absent). `Runnable` n'a qu'une méthode `run`, sans paramètre ni retour : la lambda commence donc par `()`.

```java
first.ifPresentOrElse(
        name -> System.out.println(name),
        () -> System.out.println("Il n'y a pas de nom"));
```

Avec un filtre à 3 lettres, le nom est affiché ; avec un filtre à 30 lettres, c'est le message qui s'affiche (testé).

**`orElse()` et `orElseThrow()`.** `orElse(valeur)` retourne la valeur, ou une valeur de repli si l'`Optional` est vide (`"inconnu"`, par exemple). `orElseThrow()` lève une `NoSuchElementException` si la valeur est absente.

Utiliser `isPresent()` puis `get()` revient à écrire un test de nullité sous un autre nom : préfère `ifPresent`, `ifPresentOrElse`, `orElse`.

### Créer un `Optional`

```java
Optional.of("Anne");          // la valeur ne doit pas être null
Optional.ofNullable(value);   // accepte null : retourne alors un Optional vide
Optional.empty();
```

`Optional.of(null)` lève une `NullPointerException` (vérifié).

### `OptionalInt` et `OptionalDouble`

Pour les primitifs : `OptionalInt`, `OptionalDouble` et `OptionalLong`. Ils sont retournés par les opérations des streams numériques, comme `max` ou `average`. `ifPresent` d'un `OptionalInt` attend un `IntConsumer` (méthode `accept(int)`).

```java
names.stream()
        .mapToInt(name -> name.length())
        .max()                                      // OptionalInt
        .ifPresent(max -> System.out.println(max)); // 7
```

Sur un stream vide, `max()` et `average()` retournent un optionnel vide (`OptionalInt.empty`, `OptionalDouble.empty`) : on évite de retourner une valeur arbitraire ou `null`. Pour récupérer la valeur après `isPresent()`, on utilise `getAsInt()` ou `getAsDouble()`.

### Quand l'utiliser

`Optional` est conçu pour exprimer le **résultat d'une méthode** qui peut ne rien retourner. On ne l'utilise **pas** pour les attributs de classe, ni pour les paramètres de méthodes. Il n'élimine pas toutes les `NullPointerException` : il prévient que la valeur peut être absente, et oblige à y penser.

### À retenir

* `Optional<T>` est une enveloppe qui contient une valeur si elle est présente, vide sinon.
* Une méthode qui peut ne pas avoir de résultat (`findFirst`, `max`, `average`) retourne un `Optional` plutôt que `null`.
* `isPresent()` / `get()`, `ifPresent(action)`, `ifPresentOrElse(action, sinon)`, `orElse(valeur)`, `orElseThrow()`.
* Variantes pour les primitifs : `OptionalInt`, `OptionalDouble`, `OptionalLong`.

## Application : exploiter les résultats d'une recherche

On reprend la liste obtenue avec `criteria.result()` (chapitre 16) :

```java
ArrayList<Ship> results = criteria.result();
```

On suppose que `Ship` fournit `getName()`, `getPrice()`, `getMaxCrew()`, `getLength()` et `getCaptain()`, que `Captain` fournit `getAge()`, et que `Galleon` fournit `getCannons()` (hypothèses d'illustration). Pour chaque opération : classe anonyme, puis lambda.

### Les noms de tous les navires

C'est un `map` (`Function<Ship, String>`) :

```java
results.stream()
        .map(ship -> ship.getName())
        .forEach(name -> System.out.println(name));
```

Pour les récupérer dans une liste :

```java
List<String> names = results.stream()
        .map(ship -> ship.getName())
        .toList();
```

### Le prix moyen

`mapToInt` (`ToIntFunction<Ship>`), puis `average`, qui retourne un `OptionalDouble` :

```java
results.stream()
        .mapToInt(ship -> ship.getPrice())
        .average()
        .ifPresent(average -> System.out.println("Prix moyen : " + average));
```

C'est un `OptionalDouble` car il peut n'y avoir aucun navire à moyenner. Avec quatre navires de prix 9000, 1500, 1800 et 7000, on obtient `4825.0` (testé).

### L'âge moyen des capitaines, sans doublons

Plusieurs navires peuvent avoir le même capitaine : pour ne pas le compter plusieurs fois, `distinct()` supprime les doublons. Deux lambdas : un `map` (`Function<Ship, Captain>`) puis un `mapToInt` (`ToIntFunction<Captain>`) :

```java
results.stream()
        .map(ship -> ship.getCaptain())        // Stream<Captain>
        .distinct()                            // sans doublons
        .mapToInt(captain -> captain.getAge())
        .average()
        .ifPresent(average -> System.out.println("Âge moyen : " + average));
```

`distinct()` s'appuie sur `equals` et `hashCode` : ça fonctionne grâce à leur redéfinition dans `Pirate` et `Captain` (chapitre 13). Sans elles, deux capitaines identiques seraient comptés deux fois. Avec Anne Bonny (32 ans) à la tête de deux navires et Jack Rackham (40 ans) de deux autres, on obtient `36.0` : chacun n'est compté qu'une fois (testé).

Quand une ligne devient trop longue, **aère le code**. L'IDE affiche le type à chaque étape (`Stream<Ship>`, `Stream<Captain>`, `IntStream`, `OptionalDouble`).

### Le navire de plus grand équipage

`max` attend un `Comparator` et retourne un `Optional` du type des éléments :

```java
results.stream()
        .max((first, second) -> Integer.compare(first.getMaxCrew(), second.getMaxCrew()))
        .ifPresent(ship -> System.out.println(ship));
```

### Trier selon le prix au mètre

On trie selon un critère calculé. `Comparator.comparingDouble` prend une `ToDoubleFunction`, qui retourne un `double` à partir d'un élément :

```java
List<Ship> sorted = results.stream()
        .sorted(Comparator.comparingDouble(
                ship -> (double) ship.getPrice() / ship.getLength()))
        .toList();
```

Le `(double)` est important : le prix et la longueur sont des entiers, et sans conversion la division est **entière** et tronque le résultat. (`5 / 2` donne `2`, `(double) 5 / 2` donne `2.5`, vérifié.) Les navires sortent du prix au mètre le plus faible au plus élevé.

### Compter les galions armés

Un `Predicate<Ship>` avec `instanceof` et un test sur les canons, puis `count()` (un `long`) :

```java
long count = results.stream()
        .filter(ship -> ship instanceof Galleon galleon && galleon.getCannons() > 0)
        .count();

System.out.println("Il y a " + count + " galion(s) armé(s)");
```

### Regrouper les navires par capitaine

`Collectors.groupingBy` regroupe les éléments selon un critère : une `Function<Ship, Captain>` qui indique sous quelle clé ranger chaque navire. Le résultat est une **`Map`** : une collection associative clé-valeur, ici capitaine → liste de ses navires.

```java
Map<Captain, List<Ship>> byCaptain = results.stream()
        .collect(Collectors.groupingBy(ship -> ship.getCaptain()));
```

Pour afficher, on parcourt la `Map` avec son `forEach`, qui attend un `BiConsumer` : une méthode `accept` à **deux paramètres** (la clé et la valeur). Avec deux paramètres, les parenthèses sont obligatoires :

```java
byCaptain.forEach((captain, ships) ->
        System.out.println(captain + " commande " + ships.size() + " navire(s)"));
```

Chaque capitaine n'apparaît qu'une fois : cela repose, là encore, sur `equals` et `hashCode`. L'ordre d'affichage d'une `HashMap` n'est pas garanti.

### À retenir

* On filtre, transforme (`map`, `mapToInt`), compte, trie (`Comparator.comparingDouble`), regroupe (`groupingBy`) et cherche un maximum avec les streams.
* `average` et `max` retournent un optionnel, qu'on exploite avec `ifPresent`.
* `distinct` et `groupingBy` s'appuient sur `equals` et `hashCode`.
* Une division d'entiers tronque : convertir avec `(double)`.

## Les références de méthodes

### Le contexte

Les références de méthodes forment un **troisième niveau de réduction** :

1. la **classe anonyme** écrit tout : `new`, interface, méthode, paramètres, corps ;
2. la **lambda** réduit la classe anonyme à `paramètres -> corps` ;
3. la **référence de méthode** réduit encore la lambda, **quand elle se contente d'appeler une méthode**.

Elle s'écrit avec l'opérateur `::` : `NomDeClasse::nomDeLaMéthode`, **sans parenthèses ni paramètres**.

### Quand est-ce possible ?

Seulement si la lambda **ne fait rien d'autre qu'appeler une méthode**, avec les paramètres reçus, tels quels. Deux configurations :

* **Configuration 1 : la méthode reçoit les paramètres** : `param -> méthode(param)` ;
* **Configuration 2 : la méthode est appelée sur le paramètre** : `param -> param.méthode()`.

Dans les deux cas, le corps ne contient **rien de plus** : pas de calcul, pas d'opération supplémentaire.

### Configuration 1 : on passe les paramètres à une méthode

**Sans paramètre.** Une interface fonctionnelle dont la méthode ne prend rien et ne retourne rien :

```java
@FunctionalInterface
public interface Action {
    void run();
}

private static void execute(Action action) {
    action.run();
}

private static void sayHello() {
    System.out.println("Bonjour");
}
```

```java
// classe anonyme
execute(new Action() {
    @Override
    public void run() {
        sayHello();
    }
});

execute(() -> sayHello());     // lambda
execute(Main::sayHello);       // référence de méthode
```

La référence indique **où** se trouve la méthode (`Main`) et **laquelle** (`sayHello`). Que la méthode soit statique ou non n'a pas d'incidence sur cette écriture ici.

On peut viser une méthode du JDK. `System.out` est un attribut statique de `System`, et `println()` sans paramètre convient :

```java
execute(() -> System.out.println());   // lambda
execute(System.out::println);          // référence de méthode
```

**Avec un paramètre.** Changeons l'interface pour qu'elle prenne un `int` :

```java
@FunctionalInterface
public interface IntAction {
    void run(int i);
}
```

```java
execute(new IntAction() {
    @Override
    public void run(int i) {
        display(i);
    }
});

execute(i -> display(i));          // lambda
execute(Main::display);            // référence de méthode
execute(System.out::println);      // la version de println qui prend un int
```

> **Piège (testé).** Si `Main` contient **deux** méthodes `execute`, l'une attendant une `Action`, l'autre une `IntAction`, l'appel `execute(System.out::println)` ne compile plus : `reference to execute is ambiguous`. Le compilateur ne peut pas choisir. Donne des noms différents à tes méthodes, ou écris une lambda explicite.

La méthode visée doit **respecter l'interface fonctionnelle** : mêmes paramètres, type de retour compatible. Avec une interface qui retourne un `int` :

```java
@FunctionalInterface
public interface IntOperation {
    int apply(int i);
}
```

`Math.abs` prend un `int` et retourne un `int` : elle convient.

```java
operate(i -> Math.abs(i));   // lambda
operate(Math::abs);          // référence de méthode
```

Avec `-3`, ça affiche `3` (testé). En revanche, `println` ne convient pas ici : elle ne retourne rien.

**Quand la réduction n'est pas possible.** Dès que la lambda fait autre chose qu'appeler la méthode avec le paramètre :

```java
operate(i -> Math.abs(i) + 1);   // on ajoute 1 : pas de référence de méthode
```

### Configuration 2 : on appelle une méthode sur le paramètre

```java
@FunctionalInterface
public interface TextMeasure {
    int measure(String text);
}
```

```java
// classe anonyme
use(new TextMeasure() {
    @Override
    public int measure(String text) {
        return text.length();
    }
});

use(text -> text.length());   // lambda
use(String::length);          // référence de méthode
```

La lambda est de la forme `param -> param.méthode()`. On écrit `String::length`, où `String` est la **classe du paramètre** et `length` la méthode appelée. `length` n'est **pas statique** : elle est appelée sur un objet, le paramètre reçu. `String::length` se lit : « la méthode `length` de `String`, appelée sur chaque élément reçu ». Si le corps ajoute quelque chose (`text -> text.length() + 1`), la réduction n'est plus possible.

### Avec plusieurs paramètres

```java
@FunctionalInterface
public interface Cutter {
    String cut(String text, int index);
}
```

**Premier cas : les deux paramètres sont passés à une méthode.** Avec `truncate(String text, int index)` dans `Main` :

```java
cut((text, index) -> truncate(text, index));   // lambda
cut(Main::truncate);                           // référence de méthode
```

**Second cas : on appelle une méthode sur le premier paramètre, en lui passant le second.** `substring(int)` de `String` prend un `int` :

```java
cut((text, index) -> text.substring(index));   // lambda
cut(String::substring);                        // référence de méthode
```

Avec `"Black Wave"` et `6`, `substring` donne `Wave` (testé). Si on faisait quelque chose de plus (`text.substring(index + 1)`), la référence ne serait pas possible.

### La bonne pratique : extraire la logique dans une méthode

Une lambda reste simple, et on évite d'y mettre plusieurs lignes. Pour plusieurs opérations, on **extrait le code dans une méthode** qui reçoit les mêmes paramètres : la lambda se réduit alors à son appel, et on peut la remplacer par une référence de méthode. Le code est découpé en méthodes nommées, plus lisibles et testables.

En pratique, on écrit souvent la lambda d'abord, puis on la réduit quand la configuration le permet. IntelliJ signale en général qu'une lambda peut devenir une référence de méthode (avertissement que je n'ai pas pu tester ici).

### Application : simplifier les streams

**Les noms des navires :**

```java
// avant
results.stream()
        .map(ship -> ship.getName())
        .forEach(name -> System.out.println(name));

// après
results.stream()
        .map(Ship::getName)
        .forEach(System.out::println);
```

* `ship -> ship.getName()` est de la forme `param -> param.méthode()` : `Ship::getName`, « la méthode `getName` de `Ship`, appelée sur chaque navire » ;
* `name -> System.out.println(name)` transmet son paramètre à `println` : `System.out::println`, sans même citer le paramètre. C'est plus délicat à lire au début, car on ne voit plus le paramètre de la méthode de l'interface réduite. On s'y habitue.

**Les prix :**

```java
results.stream()
        .mapToInt(Ship::getPrice)
        .average()
        .ifPresent(average -> System.out.println("Prix moyen : " + average));
```

`mapToInt` est réduite. La dernière lambda **ne peut pas** l'être : elle construit une phrase avant d'afficher. Seul l'affichage direct de la valeur pourrait devenir `System.out::println`.

**L'âge moyen des capitaines :**

```java
results.stream()
        .map(Ship::getCaptain)
        .distinct()
        .mapToInt(Captain::getAge)
        .average()
        .ifPresent(average -> System.out.println("Âge moyen : " + average));
```

**Le navire de plus grand équipage :**

```java
results.stream()
        .max(Comparator.comparingInt(Ship::getMaxCrew))
        .ifPresent(System.out::println);
```

`Comparator.comparingInt` attend un critère qui retourne un entier : on lui passe directement `Ship::getMaxCrew`. C'est plus court et plus lisible que `(first, second) -> Integer.compare(...)`.

**Le regroupement par capitaine :**

```java
Map<Captain, List<Ship>> byCaptain = results.stream()
        .collect(Collectors.groupingBy(Ship::getCaptain));
```

**Ce qui reste en lambda :**

* le tri par prix au mètre : la valeur est **calculée** (division), pas seulement obtenue par un appel ;
* le filtre sur les galions armés : la condition (`instanceof` et comparaison) est trop riche, sauf à l'extraire dans une méthode dédiée.

### Les quatre formes de références de méthodes

| Forme | Exemple | Lambda équivalente |
| --- | --- | --- |
| méthode statique | `Math::abs` | `i -> Math.abs(i)` |
| méthode d'un objet précis | `System.out::println` | `x -> System.out.println(x)` |
| méthode du type du paramètre | `String::length` | `text -> text.length()` |
| constructeur | `ArrayList::new` | `() -> new ArrayList<>()` |

`ArrayList::new`, vue dans `Collectors.toCollection(ArrayList::new)` (chapitre 16), est une **référence de constructeur** : elle fournit une nouvelle liste vide à chaque appel.

Quand une méthode existe en plusieurs versions (surcharge), comme `println`, c'est le contexte (les paramètres de l'interface fonctionnelle) qui détermine celle qui est appelée.

Une référence de méthode ne change pas le comportement, seulement l'écriture : elle cache une lambda, qui cache elle-même une classe anonyme sur une interface fonctionnelle.

### À retenir

* Une **référence de méthode** (`Classe::méthode`) réduit une lambda qui se contente d'appeler une méthode.
* Deux configurations : `param -> méthode(param)` et `param -> param.méthode()`. Avec plusieurs paramètres, même principe.
* Impossible si le corps ajoute un calcul. La méthode doit respecter l'interface fonctionnelle (paramètres et retour).
* Elle s'écrit avec `::`, sans parenthèses ni paramètres.
* Des méthodes surchargées avec des interfaces fonctionnelles différentes rendent l'appel ambigu.
* Quand une lambda devient longue, on extrait la logique dans une méthode, puis on y fait référence.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| `get()` sur un `Optional` vide | `NoSuchElementException: No value present` | Utiliser `ifPresent`, `orElse`... |
| `isPresent()` puis `get()` partout | un test de nullité déguisé | Préférer `ifPresent` / `orElse`. |
| `Optional.of(null)` | `NullPointerException` | `Optional.ofNullable(...)`. |
| `Optional` en attribut ou en paramètre | mauvais usage | Réservé aux retours de méthode. |
| Division d'entiers dans un critère de tri | résultat tronqué | `(double)`. |
| Référence de méthode avec un calcul en plus | ne compile pas / impossible | Garder la lambda. |
| Deux méthodes surchargées avec des interfaces fonctionnelles différentes | `reference to execute is ambiguous` | Noms différents, ou lambda explicite. |
| `groupingBy` sans `equals`/`hashCode` sur la clé | chaque objet est sa propre clé | Redéfinir `equals` et `hashCode`. |

## À retenir

* `Optional<T>` exprime qu'un résultat peut être absent : `ifPresent`, `ifPresentOrElse`, `orElse`, `orElseThrow`. Ni attribut, ni paramètre.
* On exploite une liste avec les streams : `map`, `mapToInt`, `average`, `max`, `sorted`, `count`, `groupingBy`.
* Trois niveaux de réduction : classe anonyme, lambda, référence de méthode. Chacun cache le précédent.

## À toi de jouer

1. Cherche le premier nom de plus de 3 lettres, puis de plus de 30 lettres. Affiche-le avec `ifPresent`, puis avec `ifPresentOrElse`, puis avec `orElse`.
2. Appelle `get()` sur un `Optional` vide : lis l'erreur. Essaie `Optional.of(null)`.
3. Calcule le maximum et la moyenne des longueurs des noms. Que retourne `average()` sur un stream vide ?
4. À partir de la liste de navires de la recherche : affiche les noms, le prix moyen, l'âge moyen des capitaines sans doublons, le navire de plus grand équipage.
5. Trie les navires par prix au mètre. Retire le `(double)` : le résultat change-t-il pour tes données ? Pourquoi est-ce quand même dangereux ?
6. Compte les galions armés, puis regroupe les navires par capitaine et affiche le nombre de navires de chacun.
7. Pour `Action`, `IntAction`, `IntOperation`, `TextMeasure` et `Cutter` : écris la classe anonyme, la lambda, puis la référence de méthode quand c'est possible.
8. Écris deux méthodes `execute` surchargées (`Action` et `IntAction`) et appelle-les avec `System.out::println`. Lis l'erreur, puis corrige.
9. Reprends tes streams du chapitre 16 et réduis en références de méthodes tout ce qui peut l'être. Qu'est-ce qui ne peut pas l'être, et pourquoi ?

## Pour aller plus loin

* [Dev.java : utiliser les `Optional`](https://dev.java/learn/api/collections-and-streams/streams/optionals/).
* [Dev.java : écrire des lambdas sous forme de références de méthodes](https://dev.java/learn/language/fp/lambdas/method-references/).
* [API Java SE 21 : `Optional`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html).
* [API Java SE 21 : `Collectors`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Collectors.html).
