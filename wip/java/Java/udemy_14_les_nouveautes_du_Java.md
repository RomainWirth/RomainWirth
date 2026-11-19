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

---

## Les Streams

---

## La classe Optional

---

## Les références de méthodes