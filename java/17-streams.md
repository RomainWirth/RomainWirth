# Les streams

Filtrer les navires par prix, compter ceux qui ont des canons, calculer l'âge moyen des capitaines : avec des boucles et des `if`, chaque question demande plusieurs lignes. Les **streams** (Java 8) permettent d'exprimer ce genre de traitement en quelques lignes lisibles, en s'appuyant sur les expressions lambda du chapitre précédent.

## Objectifs

À la fin du chapitre, tu sauras :

* obtenir un stream à partir d'une collection ;
* distinguer opérations **intermédiaires** et **terminales** ;
* utiliser `filter`, `map`, `mapToInt`, `sorted`, `distinct`, `limit`, `skip`, `count`, les `...Match` ;
* écrire chaque lambda en partant de sa classe anonyme ;
* récupérer un résultat dans une collection et regrouper avec `groupingBy` ;
* extraire des lambdas complexes dans des méthodes qui retournent un `Predicate`.

## Le principe

Depuis Java 8, les collections ont une méthode `stream()` qui retourne un **stream** de leurs éléments. `Stream` est une classe générique : une liste de `String` donne un `Stream<String>`. On applique ensuite des opérations, de deux familles :

* les **opérations intermédiaires** (`filter`, `map`, `sorted`, `distinct`, `limit`, `skip`...) retournent **un nouveau stream** : on peut les enchaîner ;
* les **opérations terminales** (`forEach`, `count`, `average`, `collect`, `findFirst`...) produisent le résultat et terminent le traitement.

Un stream **ne modifie jamais la collection d'origine**.

Pour les exemples, on utilise l'équipage :

```java
List<String> names = List.of(
        "Anne", "Abel", "Albert", "Bart", "Calico",
        "Davy", "Edward", "Francis", "Grace", "Henry");
```

## La démarche à suivre pour chaque opération

La plupart des opérations attendent une **interface fonctionnelle**. Pour écrire la lambda, on suit toujours les mêmes étapes (chapitre 15) :

1. **identifier** l'interface fonctionnelle attendue ;
2. **écrire d'abord la classe anonyme**, qui fait apparaître le nom de la méthode, ses paramètres et son retour ;
3. **réduire** en lambda.

| Opération | Interface fonctionnelle | Méthode | Paramètre | Retour |
| --- | --- | --- | --- | --- |
| `forEach` | `Consumer<T>` | `accept` | un élément | rien (`void`) |
| `filter`, `allMatch`, `anyMatch`, `noneMatch` | `Predicate<T>` | `test` | un élément | `boolean` |
| `map` | `Function<T, R>` | `apply` | un élément | une valeur de type `R` |
| `mapToInt` | `ToIntFunction<T>` | `applyAsInt` | un élément | `int` |
| `sorted`, `max` | `Comparator<T>` | `compare` | deux éléments | `int` |

`count`, `distinct`, `limit` et `skip` n'attendent pas d'interface fonctionnelle.

## `forEach` : une action sur chaque élément

`forEach` attend un `Consumer`. La classe anonyme :

```java
names.stream().forEach(new Consumer<String>() {
    @Override
    public void accept(String s) {
        System.out.println(s);
    }
});
```

Le paramètre `s` n'a pas de sens : en réduisant, on choisit un nom explicite.

```java
names.stream().forEach(name -> System.out.println(name));
```

## `filter` : garder certains éléments

`filter` attend un `Predicate` : sa méthode `test` prend un élément et retourne un `boolean`. `true` : l'élément est **conservé** ; `false` : il est exclu.

```java
names.stream()
        .filter(new Predicate<String>() {
            @Override
            public boolean test(String name) {
                return name.startsWith("A");
            }
        })
        .forEach(name -> System.out.println(name));
```

En lambda : on supprime le `new`, le nom de la méthode et son type de retour, et avec une seule expression, les accolades et le `return` :

```java
names.stream()
        .filter(name -> name.startsWith("A"))
        .forEach(name -> System.out.println(name));
// Anne, Abel, Albert
```

`filter` retourne un nouveau stream de `String`, sur lequel on enchaîne `forEach`. Le nom du paramètre est libre : préfère un nom explicite (`name`) à une lettre.

## `map` : transformer les éléments

`map` transforme chaque élément et produit **un stream d'autres valeurs**. Elle attend une `Function`.

```java
names.stream()
        .map(new Function<String, String>() {
            @Override
            public String apply(String name) {
                return name.toUpperCase();
            }
        })
        .forEach(name -> System.out.println(name));
```

```java
names.stream()
        .map(name -> name.toUpperCase())
        .forEach(name -> System.out.println(name));
// ANNE, ABEL, ALBERT, ...
```

Le **type du stream peut changer** : avec les longueurs, on obtient un `Stream<Integer>`.

```java
names.stream()
        .map(name -> name.length())      // Stream<Integer>
        .forEach(length -> System.out.println(length));
// 4, 4, 6, 4, 6, 4, 6, 7, 5, 5
```

## `mapToInt` : un stream d'entiers primitifs

Pour obtenir un vrai **`IntStream`**, on utilise `mapToInt`, qui attend une `ToIntFunction` (méthode `applyAsInt`, qui retourne un `int`) :

```java
names.stream()
        .mapToInt(name -> name.length())     // IntStream
        .forEach(length -> System.out.println(length));
```

Un `IntStream` propose des opérations numériques : `sum`, `average`, `min`, `max`. `average` retourne un **`OptionalDouble`**, une enveloppe qui contient la moyenne si elle existe (voir le chapitre suivant). Sa méthode `ifPresent` attend un `DoubleConsumer` : une méthode `accept` qui reçoit un `double`.

```java
names.stream()
        .mapToInt(name -> name.length())
        .average()                                         // OptionalDouble
        .ifPresent(average -> System.out.println(average));
// 5.1
```

## `count` : compter

`count` est terminale et retourne un **`long`**. Elle se combine avec `filter` :

```java
long count = names.stream()
        .filter(name -> name.startsWith("A"))
        .count();
// 3
```

## `sorted` : trier

`sorted` retourne un nouveau stream trié ; la liste d'origine n'est pas modifiée.

```java
names.stream()
        .sorted()
        .forEach(name -> System.out.println(name));
```

Sans paramètre, `sorted` utilise l'**ordre naturel** : les éléments doivent implémenter `Comparable`. C'est le cas de `String` (tri alphabétique). Pour une classe qui n'est pas `Comparable`, le code **compile** mais plante à l'exécution (testé avec deux `Object`) :

```
ClassCastException: class java.lang.Object cannot be cast to class java.lang.Comparable ...
```

Pour trier selon un autre critère, on passe un `Comparator`. La classe anonyme (tri par nombre de lettres croissant) :

```java
names.stream()
        .sorted(new Comparator<String>() {
            @Override
            public int compare(String first, String second) {
                return Integer.compare(first.length(), second.length());
            }
        })
        .forEach(name -> System.out.println(name));
```

Réduite en lambda : deux paramètres déduits, une expression, donc ni accolades ni `return` :

```java
names.stream()
        .sorted((first, second) -> Integer.compare(first.length(), second.length()))
        .forEach(name -> System.out.println(name));
// Anne, Abel, Bart, Davy, Grace, Henry, Albert, Calico, Edward, Francis
```

À longueur égale, l'ordre d'origine est conservé (le tri de `sorted` est stable sur un stream ordonné, comme celui d'une liste).

## `distinct`, `limit` et `skip`

* `distinct()` supprime les doublons (en s'appuyant sur `equals`) ;
* `limit(n)` garde les `n` premiers ;
* `skip(n)` saute les `n` premiers.

```java
names.stream().limit(3).forEach(name -> System.out.println(name));   // Anne, Abel, Albert
names.stream().skip(3).forEach(name -> System.out.println(name));    // les 7 suivants
```

## `allMatch`, `anyMatch` et `noneMatch`

Trois opérations terminales qui retournent un `boolean` selon un `Predicate` :

```java
boolean all  = names.stream().allMatch(name -> name.startsWith("A"));    // false
boolean any  = names.stream().anyMatch(name -> name.startsWith("A"));    // true
boolean none = names.stream().noneMatch(name -> name.startsWith("Z"));   // true
```

* `allMatch` : **tous** les éléments vérifient la condition ;
* `anyMatch` : **au moins un** ;
* `noneMatch` : **aucun**.

## Récapitulatif

| Opération | Type | Rôle |
| --- | --- | --- |
| `filter(Predicate)` | intermédiaire | garde les éléments dont le test est vrai |
| `map(Function)` | intermédiaire | transforme chaque élément (le type peut changer) |
| `mapToInt(...)` | intermédiaire | produit un `IntStream` |
| `sorted()` / `sorted(Comparator)` | intermédiaire | trie |
| `distinct()` | intermédiaire | supprime les doublons |
| `limit(n)` / `skip(n)` | intermédiaire | garde / saute les `n` premiers |
| `forEach(Consumer)` | terminale | action sur chaque élément |
| `count()` | terminale | compte |
| `average()` | terminale | moyenne d'un `IntStream` |
| `allMatch` / `anyMatch` / `noneMatch` | terminale | teste tous / au moins un / aucun |
| `collect(...)` / `toList()` | terminale | récupère le résultat dans une collection |

## Application : chercher un navire au port

On reprend les critères du Builder (chapitre 14). Il faut maintenant obtenir le **résultat de la recherche** : la liste des navires de `GameData` (chapitre 13) qui correspondent. On suppose que `Ship` fournit `getName()`, `getPrice()`, `getMaxCrew()` et `getLength()`, que `Galleon` fournit `getCannons()` et `hasCannons()`, et que `ShipCriteria` a accès à ses attributs `crewSize`, `minPrice`, `maxPrice` et `cannons` (ce sont des hypothèses d'illustration).

### Première idée : une boucle

On inverse les tests : si un critère n'est pas respecté, `continue` passe au navire suivant.

```java
public ArrayList<Ship> result() {
    ArrayList<Ship> result = new ArrayList<>();
    for (Ship ship : GameData.getInstance().getShips()) {
        if (ship.getMaxCrew() < crewSize) {
            continue;
        }
        if (ship.getPrice() < minPrice || ship.getPrice() > maxPrice) {
            continue;
        }
        result.add(ship);
    }
    return result;
}
```

Ça marche, mais plus il y a de critères, plus il y a de `if`.

### Avec un stream

`filter` attend un `Predicate<Ship>`. On l'écrit d'abord en classe anonyme :

```java
Predicate<Ship> crewPredicate = new Predicate<Ship>() {
    @Override
    public boolean test(Ship ship) {
        return ship.getMaxCrew() >= crewSize;
    }
};
```

On ne l'utilise qu'une fois : on le réduit en lambda directement dans `filter`.

```java
GameData.getInstance().getShips().stream()
        .filter(ship -> ship.getMaxCrew() >= crewSize)
```

Une lambda reste lisible tant qu'elle est courte. Dès qu'elle se complique, on **extrait chaque critère dans une méthode** qui retourne un `Predicate<Ship>` :

```java
private Predicate<Ship> crewPredicate() {
    return ship -> ship.getMaxCrew() >= crewSize;
}

private Predicate<Ship> pricePredicate() {
    return ship -> ship.getPrice() >= minPrice && ship.getPrice() <= maxPrice;
}
```

Pour les canons, il y a trois cas (`Preference`, chapitre 14) :

```java
private Predicate<Ship> cannonsPredicate() {
    if (cannons == Preference.INDIFFERENT) {
        return ship -> true;                       // on garde tous les navires
    }
    if (cannons == Preference.WANTED) {
        return ship -> ship instanceof Galleon galleon && galleon.hasCannons();
    }
    // pas de canons voulus : un navire sans canons, ou un galion non armé
    return ship -> !(ship instanceof Galleon galleon) || !galleon.hasCannons();
}
```

Par convention, un accesseur qui retourne un `boolean` commence par `is` ou `has` (ici `hasCannons`).

Plutôt que d'enchaîner plusieurs `filter`, on combine les prédicats avec `and` (il existe aussi `or` et `negate`) :

```java
public ArrayList<Ship> result() {
    return GameData.getInstance().getShips().stream()
            .filter(crewPredicate()
                    .and(pricePredicate())
                    .and(cannonsPredicate()))
            .collect(Collectors.toCollection(ArrayList::new));
}
```

`collect` est l'opération terminale qui récupère le résultat dans une collection. `Collectors.toCollection(ArrayList::new)` demande une `ArrayList` : `ArrayList::new` est une **référence de constructeur**, vue au chapitre suivant. Si tu n'utilises pas le résultat de `collect`, l'IDE avertit (« result ignored ») : ici on le retourne.

Aère le code : **une opération par ligne**.

Test fait avec cinq navires : la version boucle (sans canons) retourne 3 navires ; la version stream avec `WANTED` retourne uniquement le galion armé ; avec `UNWANTED`, le sloop et le galion non armé ; avec `INDIFFERENT`, les mêmes que la boucle.

### Utilisation

```java
ShipCriteria criteria = new ShipCriteria.Builder(30)
        .minPrice(1000)
        .maxPrice(8000)
        .build();

criteria.result().forEach(ship -> System.out.println(ship));
```

`forEach` existe aussi directement sur les collections, avec un `Consumer`. Change les critères et vérifie que les résultats évoluent.

## `toList()` et `collect`

* `toList()` (Java 16) retourne une liste **non modifiable** : tester un `add` lève une `UnsupportedOperationException` (vérifié). Dans mon test, c'est une liste interne du JDK, pas une `ArrayList`.
* `collect(Collectors.toList())` retourne en pratique une `ArrayList`, mais la documentation ne garantit pas le type exact.
* `collect(Collectors.toCollection(ArrayList::new))` impose une `ArrayList`.

## Les streams sont paresseux et à usage unique

* Les opérations intermédiaires ne s'exécutent **que lorsqu'une opération terminale est appelée**. Un `filter` dont le corps affiche quelque chose n'affiche rien tant qu'il n'y a pas de terminale (vérifié).
* Un stream ne peut être consommé **qu'une fois** : le réutiliser après une opération terminale lève une `IllegalStateException` (`stream has already been operated upon or closed`). Pour recommencer, on rappelle `stream()` sur la collection.

## Remarques

* Les streams existent aussi pour les primitifs : `IntStream`, `LongStream`, `DoubleStream` (`sum`, `average`, `min`, `max`).
* Il existe des **streams parallèles** (`parallelStream()`), qui répartissent le travail sur plusieurs threads. Ils demandent des précautions et ne sont pas toujours plus rapides.
* Une lambda dans un stream ne doit pas **modifier** une variable extérieure : on ne produit pas de résultat par effet de bord, on le retourne avec `collect`, `count`, etc.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Pas d'opération terminale | rien ne s'exécute | Un stream est paresseux. |
| Réutiliser un stream | `IllegalStateException: stream has already been operated upon or closed` | Rappeler `stream()`. |
| `sorted()` sur une classe non `Comparable` | `ClassCastException` à l'exécution | Passer un `Comparator`. |
| Ignorer le résultat de `collect` | avertissement « result ignored » | Stocker ou retourner le résultat. |
| Modifier le résultat de `toList()` | `UnsupportedOperationException` | Copier dans une `ArrayList`. |
| Une lambda de plusieurs lignes dans un stream | illisible | Extraire dans une méthode. |
| Division d'entiers dans un tri | résultat tronqué | Convertir avec `(double)` (voir le chapitre suivant). |

## À retenir

* Un stream s'obtient avec `stream()` sur une collection ; il ne modifie pas la collection d'origine.
* **Intermédiaires** (`filter`, `map`, `sorted`, `distinct`, `limit`, `skip`) : retournent un stream, s'enchaînent. **Terminale** (`forEach`, `count`, `collect`...) : produit le résultat.
* `filter` attend un `Predicate`, `map` une `Function`, `forEach` un `Consumer`, `sorted` un `Comparator` (ou l'ordre naturel si `Comparable`).
* `map` peut changer le type ; `mapToInt` produit un `IntStream`, utile pour `average`, `sum`, `max`.
* `allMatch`, `anyMatch`, `noneMatch` répondent par un `boolean`.
* Une lambda complexe s'extrait dans une méthode qui retourne un `Predicate`, combinés avec `and`, `or`, `negate`.
* Un stream est paresseux et à usage unique. Une opération par ligne.

## À toi de jouer

1. Avec la liste de noms, affiche ceux qui commencent par `"A"`, puis leur nombre, puis leurs longueurs, puis la longueur moyenne.
2. Trie la liste par ordre alphabétique, puis par longueur, puis par longueur décroissante.
3. Affiche les trois premiers noms, puis tous sauf les trois premiers. Vérifie la liste d'origine : a-t-elle changé ?
4. Utilise `allMatch`, `anyMatch` et `noneMatch` avec une condition de ton choix.
5. Écris un stream sans opération terminale et mets un `println` dans un `filter`. Que se passe-t-il ? Appelle deux fois une terminale sur le même stream : que lis-tu ?
6. Essaie `sorted()` sur une liste d'objets qui n'implémentent pas `Comparable`. Quand l'erreur apparaît-elle ?
7. Pour chaque opération, écris d'abord la classe anonyme, puis la lambda.
8. Écris `ShipCriteria.result()` avec une boucle, puis avec un stream et des méthodes `crewPredicate`, `pricePredicate`, `cannonsPredicate`. Combine-les avec `and`, puis ajoute un critère avec `negate`.
9. Dans la liste de navires, compte les galions armés avec `filter` et `count`.

## Pour aller plus loin

* [Dev.java : l'API Stream](https://dev.java/learn/api/collections-and-streams/streams/).
* [Dev.java : traiter des données en mémoire avec l'API Stream (map, filter, reduce)](https://dev.java/learn/api/collections-and-streams/streams/map-filter-reduce/).
* [Dev.java : utiliser un `Collector`](https://dev.java/learn/api/collections-and-streams/streams/using-collectors/).
* [Dev.java : opérations intermédiaires](https://dev.java/learn/api/streams/intermediate-operation/).
* [API Java SE 21 : `Stream`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html).
