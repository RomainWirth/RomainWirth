# Classes anonymes et expressions lambda

Une méthode a parfois besoin qu'on lui dise **comment faire** quelque chose : comment comparer deux navires pour les trier, quoi faire quand un événement arrive, quoi afficher. Ce « comment faire » se transmet sous forme d'objet. Ce chapitre montre comment le fournir de plus en plus simplement : classe nommée, classe interne, **classe anonyme**, puis **expression lambda** (Java 8). C'est la base des chapitres suivants (streams, `Optional`, références de méthodes).

## Objectifs

À la fin du chapitre, tu sauras :

* écrire une **classe anonyme** et dire quand l'utiliser ;
* reconnaître une **interface fonctionnelle** ;
* écrire une **expression lambda** en partant d'une classe anonyme ;
* choisir entre classe anonyme, lambda et classe nommée.

## Les classes anonymes

### Le contexte

Un avis officiel se lit à haute voix sur le quai. On modélise ça avec une interface à **deux** méthodes (chapitre 11) :

```java
public interface Proclamation {
    String getTitle();
    String getContent();
}
```

Une méthode attend un objet de ce type :

```java
private static void display(Proclamation proclamation) {
    System.out.println(proclamation.getTitle());
    System.out.println(proclamation.getContent());
}
```

Une méthode qui attend un paramètre d'un certain type n'accepte qu'un **objet** de ce type. Ici c'est une interface : il faut un objet dont la classe **implémente** `Proclamation`.

### Première solution : une classe nommée

```java
public class WantedNotice implements Proclamation {

    @Override
    public String getTitle() {
        return "Avis de recherche";
    }

    @Override
    public String getContent() {
        return "Récompense : 500 doublons";
    }
}
```

```java
display(new WantedNotice());
```

Ça fonctionne, mais :

* la classe est **publique** (ou en visibilité package, jamais privée dans un fichier à part) : on peut créer des objets de ce type n'importe où ;
* on ne veut qu'**un seul objet** de ce type, pour cette méthode.

### Deuxième solution : une classe interne

On déclare la classe **à l'intérieur** de `Main`, en `private static` : seule `Main` peut l'utiliser.

```java
public class Main {

    private static class WantedNotice implements Proclamation {
        @Override
        public String getTitle() { return "Avis de recherche"; }

        @Override
        public String getContent() { return "Récompense : 500 doublons"; }
    }

    public static void main(String[] args) {
        display(new WantedNotice());
    }
}
```

Le premier problème est réglé, mais on a toujours une classe **nommée** pour une seule instance.

### Troisième solution : une classe anonyme

Pour une seule instance, inutile de nommer la classe. On écrit un `new` **directement sur l'interface**, suivi d'un corps entre accolades :

```java
Proclamation notice = new Proclamation() {

    @Override
    public String getTitle() {
        return "Avis de recherche";
    }

    @Override
    public String getContent() {
        return "Récompense : 500 doublons";
    }
};

display(notice);
```

* le `new` porte sur l'**interface**, suivi de parenthèses puis du **corps** : c'est la **classe anonyme** ;
* on y redéfinit **toutes** les méthodes de l'interface ;
* le **point-virgule** final est obligatoire : il termine la déclaration ;
* la variable est du type de l'interface : on n'a accès qu'à `getTitle` et `getContent`.

On définit une classe et on l'instancie en même temps, au milieu d'une méthode. Au début c'est déroutant, mais c'est très répandu.

On peut aussi faire le `new` directement à l'appel, sans variable :

```java
display(new Proclamation() {
    @Override
    public String getTitle() { return "Avis de recherche"; }

    @Override
    public String getContent() { return "Récompense : 500 doublons"; }
});
```

Respecte bien l'ordre des parenthèses, des accolades et du point-virgule qui ferme l'appel.

Le mécanisme marche aussi avec une **classe abstraite** : un `new` sur la classe abstraite ouvre un corps où tu redéfinis ses méthodes abstraites (chapitre 11).

### Dans quels cas l'utiliser

Une classe anonyme sert à **fournir un comportement à une méthode, à un endroit précis**. L'exemple le plus courant est le **tri** : `sort` attend un `Comparator`, qui décrit comment comparer deux éléments.

```java
ships.sort(new Comparator<Ship>() {
    @Override
    public int compare(Ship first, Ship second) {
        return Integer.compare(first.getBuiltYear(), second.getBuiltYear());
    }
});
```

On trie les navires par année de construction, ici seulement. Une classe `BuiltYearComparator` publique n'aurait pas de raison d'exister : elle serait accessible partout pour un usage unique. Même besoin avec `Runnable` (le code à exécuter dans un thread), les écouteurs d'événements d'une interface graphique, les rappels (*callbacks*).

> `Integer.compare(a, b)` est préférable à `a - b` : la soustraction peut déborder (dépasser la capacité d'un `int`) et donner un résultat faux.

### Ce que le compilateur fait

Une classe anonyme est une **vraie classe**, même sans nom dans ton code : le compilateur lui en attribue un (de la forme `Main$1`) et produit un fichier `.class` (vérifié : `P15$1.class`, `P15$2.class`...).

### À retenir

* Une méthode qui attend une interface doit recevoir un objet d'une classe qui l'implémente.
* Classe nommée : accessible partout. Classe interne privée : restreinte, mais nommée. Classe anonyme : **une instance, sans nom**, créée par `new Interface() { ... };`.
* Elle sert à fournir un comportement à usage unique (tri, `Runnable`, écouteurs).
* Elle doit redéfinir **toutes** les méthodes de l'interface : l'écriture est lourde, ce que les lambdas simplifient.

## Les expressions lambda

### Le principe

Les expressions lambda sont apparues avec **Java 8**. Une lambda est une **écriture réduite d'une classe anonyme**, dans un cas précis : quand l'interface n'a **qu'une seule méthode abstraite**. Avec `Proclamation` (deux méthodes), on ne peut pas.

### Les interfaces fonctionnelles

Une **interface fonctionnelle** ne contient qu'**une seule méthode abstraite**. L'annotation `@FunctionalInterface` le garantit à la compilation :

```java
@FunctionalInterface
public interface Display {
    void show(String message);
}
```

Si tu ajoutes une seconde méthode abstraite, ça ne compile plus :

```
error: Unexpected @FunctionalInterface annotation
  Two is not a functional interface
    multiple non-overriding abstract methods found in interface Two
```

Une méthode peut attendre une interface fonctionnelle :

```java
private static void display(Display display) {
    display.show("Bienvenue à bord");
}
```

### De la classe anonyme à la lambda

Avec une classe anonyme :

```java
display(new Display() {
    @Override
    public void show(String message) {
        System.out.println(message);
    }
});
```

Il n'y a qu'une méthode : le compilateur sait laquelle. On supprime donc `new Display()`, les accolades de la classe et le nom de la méthode. On garde les **paramètres**, une **flèche** `->` et le **corps** :

```java
display((String message) -> {
    System.out.println(message);
});
```

C'est une **expression lambda** : `paramètres -> corps`.

### Les simplifications successives

1. **Une seule instruction : pas d'accolades** (ni de point-virgule interne) :

```java
display((String message) -> System.out.println(message));
```

2. **Le type du paramètre est facultatif** : le compilateur le connaît :

```java
display((message) -> System.out.println(message));
```

3. **Un seul paramètre : pas de parenthèses** :

```java
display(message -> System.out.println(message));
```

Les quatre écritures sont équivalentes (testé : elles affichent la même chose). La dernière est la plus courante.

### Plusieurs paramètres

La lambda reprend les paramètres dans le même ordre. Avec **plusieurs paramètres, les parenthèses sont obligatoires** :

```java
@FunctionalInterface
public interface LootRule {
    int apply(int gold, int crewSize);
}
```

```java
(gold, crewSize) -> gold / crewSize
```

Les types sont facultatifs, mais **cohérents** : on les écrit pour tous ou pour aucun. `(int gold, crewSize) -> ...` ne compile pas :

```
error: invalid lambda parameter declaration
  (cannot mix implicitly-typed and explicitly-typed parameters)
```

### Une méthode qui retourne une valeur

Avec un corps entre accolades, on écrit un `return` comme dans une méthode :

```java
LootRule rule = (gold, crewSize) -> {
    System.out.println("Partage du butin");
    return gold / crewSize;
};
```

Avec **une seule expression**, on supprime les accolades **et** le `return` : la valeur est retournée automatiquement :

```java
LootRule rule = (gold, crewSize) -> gold / crewSize;
```

Avec 1000 pièces et 8 pirates, les deux versions retournent `125`.

### Récapitulatif

| Situation | Écriture |
| --- | --- |
| Aucun paramètre | `() -> corps` |
| Un paramètre | `message -> corps` (parenthèses facultatives) |
| Plusieurs paramètres | `(a, b) -> corps` (parenthèses obligatoires) |
| Type des paramètres | facultatif, cohérent pour tous |
| Une seule instruction | accolades facultatives, pas de `;` interne |
| Plusieurs instructions | accolades obligatoires, une instruction par ligne avec `;` |
| Méthode qui retourne une valeur | `return` dans les accolades, ou simple expression sans `return` |

### Un exemple concret : trier les navires

`Comparator` est une interface fonctionnelle : sa méthode `compare` prend deux navires et retourne un `int`. La classe anonyme du tri se réduit à :

```java
ships.sort((first, second) -> Integer.compare(first.getBuiltYear(), second.getBuiltYear()));
```

Les deux paramètres sont déduits, il n'y a qu'une expression : ni accolades ni `return`.

### Comment écrire une lambda

Une lambda **ne s'invente pas** : il faut savoir combien de paramètres la méthode attend (et leur type), et ce qu'elle retourne.

* Tu connais l'interface fonctionnelle : tu écris directement la lambda.
* Sinon, tu **repasses par la classe anonyme** : tu fais un `new` sur l'interface, l'IDE génère la méthode à redéfinir (nom, paramètres, retour), puis tu réduis. C'est la démarche qu'on suivra dans tout le reste du cours.

### Une réduction qui cache des informations

La lambda raccourcit le code, mais retire de l'information : le nom de l'interface, celui de la méthode, le type des paramètres. Elle cache toujours une **classe anonyme sur une interface fonctionnelle**. Prends le temps de comprendre d'où elle vient pour savoir la lire et l'écrire.

## Lambda ou classe anonyme ?

Les deux fournissent un comportement à usage unique. Le critère est le **type attendu** :

| Type attendu | Classe anonyme | Lambda |
| --- | --- | --- |
| Interface à **une seule** méthode abstraite (`Comparator`, `Runnable`, `Display`) | oui | **oui, choix habituel** |
| Interface à **plusieurs** méthodes (`Proclamation`) | oui | non |
| **Classe abstraite** | oui | non |
| **Classe concrète** à redéfinir partiellement | oui | non |

Test fait : `Proclamation p = () -> "x";` donne `incompatible types: Proclamation is not a functional interface`, et `Abs x = () -> {};` avec une classe abstraite donne la même erreur.

### Ce que permet une classe anonyme et pas une lambda

**Un état propre.** C'est une vraie classe : elle peut déclarer des attributs et les modifier.

```java
Display counter = new Display() {

    private int count = 0;   // attribut propre à cet objet

    @Override
    public void show(String message) {
        count++;
        System.out.println(count + " : " + message);
    }
};
```

Deux appels affichent `1 : a` puis `2 : b`. Une lambda ne peut pas déclarer d'attribut.

**Des méthodes d'aide**, ajoutées dans le corps, utilisables par les méthodes de l'interface.

**`this`.** Dans une classe anonyme, `this` désigne l'instance **anonyme**. Dans une lambda, `this` désigne l'objet de la classe **englobante** : une lambda n'a pas de « soi ». Vérifié : dans une même méthode, `this.getClass().getName()` donne `P15$1` dans la classe anonyme, alors que dans la lambda `this` est bien l'objet `P15` (et donne accès à ses attributs).

### Les variables locales : effectivement finales

Une lambda comme une classe anonyme peut lire les variables locales de la méthode qui les entoure, **à condition qu'elles ne soient jamais réaffectées** (variables `final` ou « effectivement finales »). Sinon :

```
error: local variables referenced from a lambda expression must be final or effectively final
error: local variables referenced from an inner class must be final or effectively final
```

Avec une lambda, on ne peut donc pas modifier un compteur local. Avec une classe anonyme, on utilise un attribut de la classe anonyme, comme `count` ci-dessus.

### Ce que la lambda apporte

* **un code plus court et plus lisible** pour une interface à une méthode : il reste l'essentiel, les paramètres et le traitement ;
* **des traitements enchaînés lisibles** : au chapitre suivant (streams), on enchaînera plusieurs opérations qui reçoivent chacune un petit comportement. Avec des classes anonymes, ce serait illisible.

### En pratique

1. L'interface n'a **qu'une** méthode abstraite : **lambda**.
2. Elle en a plusieurs, ou le type est une classe abstraite : **classe anonyme**.
3. Il faut un **état propre** (compteur, valeurs mémorisées) : classe anonyme (ou nommée).
4. Le comportement est **long** ou **réutilisé** à plusieurs endroits : ni l'une ni l'autre, une **méthode** ou une **classe nommée**. Une lambda de plus de quelques lignes est difficile à lire et à tester, et on ne duplique pas un comportement.

IntelliJ signale en général une classe anonyme qui pourrait devenir une lambda : c'est un avertissement que je n'ai pas pu tester ici. Sache faire la transformation à la main.

## Remarques

* Une interface fonctionnelle contient **une seule méthode abstraite**, mais peut avoir des méthodes `default` ou `static`, et redéclarer des méthodes d'`Object` (comme `equals`). C'est le cas de `Comparator`, qui a plusieurs méthodes mais une seule abstraite.
* Une classe anonyme n'a pas de constructeur déclaré, mais on peut passer des arguments au constructeur de la classe mère entre les parenthèses du `new`.
* Les méthodes supplémentaires d'une classe anonyme ne sont pas appelables de l'extérieur : la variable est du type de l'interface.
* Le JDK fournit des interfaces fonctionnelles prêtes à l'emploi dans `java.util.function` : `Consumer`, `Function`, `Predicate`, `Supplier`... Elles sont très utilisées avec les streams.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Oublier le `;` après le corps d'une classe anonyme | erreur de syntaxe | Le `;` termine la déclaration. |
| Lambda sur une interface à plusieurs méthodes | `X is not a functional interface` | Utiliser une classe anonyme. |
| Lambda sur une classe abstraite | même message | Idem. |
| Modifier une variable locale dans une lambda | `must be final or effectively final` | Utiliser un attribut, ou une autre approche. |
| Mélanger paramètres typés et non typés | `cannot mix implicitly-typed and explicitly-typed parameters` | Tous typés, ou aucun. |
| Oublier les parenthèses avec plusieurs paramètres | erreur de syntaxe | `(a, b) -> ...`. |
| Mettre `return` sans accolades | erreur de syntaxe | Soit `{ return x; }`, soit `x` seul. |
| Une lambda très longue | code illisible | Extraire dans une méthode. |
| Croire que `this` désigne la lambda | `this` est la classe englobante | Utiliser une classe anonyme si besoin d'un « soi ». |

## À retenir

* Une **expression lambda** (Java 8) est une écriture réduite d'une classe anonyme qui implémente une **interface fonctionnelle**.
* Interface fonctionnelle : **une seule méthode abstraite** (`@FunctionalInterface` le garantit).
* Syntaxe : `paramètres -> corps`. Un paramètre : parenthèses facultatives. Plusieurs : obligatoires. Type facultatif, mais cohérent.
* Une seule instruction : accolades facultatives, et `return` facultatif si la méthode retourne une valeur.
* On ne peut pas inventer une lambda : en cas de doute, on repasse par la classe anonyme.
* Une classe anonyme reste nécessaire pour une interface à plusieurs méthodes, une classe abstraite ou un état propre.
* Les variables locales utilisées doivent être effectivement finales.
* Dans une lambda, `this` est l'objet englobant.

## À toi de jouer

1. Crée l'interface `Proclamation` (deux méthodes) et affiche un avis avec une classe nommée, puis une classe interne, puis une classe anonyme. Combien de fichiers `.class` sont produits ?
2. Trie une `ArrayList<Ship>` par année de construction avec une classe anonyme `Comparator`, puis avec une lambda. Trie ensuite par prix décroissant.
3. Crée `@FunctionalInterface Display`, puis ajoute une deuxième méthode abstraite. Lis l'erreur.
4. Crée `LootRule` et écris-la avec des accolades et `return`, puis avec une simple expression. Essaie de mélanger des types écrits et omis.
5. Écris un compteur d'appels avec une classe anonyme. Essaie ensuite de le faire avec une lambda et une variable locale : lis l'erreur.
6. Essaie `Proclamation p = () -> "x";` et lis l'erreur. Pourquoi est-elle logique ?
7. Dans une classe qui a un attribut, affiche `this` dans une classe anonyme puis dans une lambda. Quelle différence observes-tu ?

## Pour aller plus loin

* [Dev.java : écrire sa première lambda](https://dev.java/learn/language/fp/lambdas/first-lambdas/) et [les lambdas](https://dev.java/learn/language/fp/lambdas/).
* [Dev.java : quand utiliser classes imbriquées, locales, anonymes et lambdas](https://dev.java/learn/language/oop/classes-objects/design-best-practices/).
* [Dev.java : écrire et combiner des comparateurs](https://dev.java/learn/language/fp/lambdas/writing-comparators/).
* [API Java SE 21 : `java.util.function`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/package-summary.html).
