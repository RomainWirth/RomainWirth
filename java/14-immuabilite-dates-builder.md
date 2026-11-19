# Immuabilité, dates et patron Builder

Dans le chapitre précédent, tu as appris à créer et à stocker des objets. Ici, on apprend à les **protéger** : certains objets ne doivent plus changer après leur création (classes **immuables**), et il faut savoir copier ce qui est modifiable (**copie défensive**). On voit aussi les dates, avec `LocalDate`, puis le patron **Builder**, qui permet de construire proprement un objet immuable dont certains paramètres sont facultatifs.

## Objectifs

À la fin du chapitre, tu sauras :

* distinguer classes **mutables** et **immuables**, et faire une **copie défensive** ;
* utiliser `LocalDate` plutôt que `Date`, et formater une date ;
* construire un modèle immuable cohérent, avec des setters qui gardent l'objet valide ;
* construire un objet immuable avec des paramètres facultatifs grâce au **Builder**.

## Classes mutables et immuables

Une classe est **immuable** quand l'état de ses objets est fixé à la création et **ne peut plus évoluer**. Elle est **mutable** quand ses objets peuvent changer d'état après leur création.

### Mutable

Une classe `Parrot` (perroquet) avec un nom, un accesseur et un mutateur (chapitre 7) est mutable : `setName` fait **muter** l'objet.

```java
public class Parrot {
    private String name;

    public Parrot(String name) { this.name = name; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

### Immuable

Deux règles :

* **pas de setter** ;
* **tous les attributs sont `final`**.

```java
public class Parrot {
    private final String name;

    public Parrot(String name) { this.name = name; }
    public String getName() { return name; }
}
```

Un objet immuable est plus simple à maintenir et à tester : un objet créé dans un état donné ne changera pas. Il peut être partagé sans risque.

### Une classe immuable se compose de classes immuables

La garantie ne tient que si les attributs sont eux-mêmes immuables.

* **`String` est immuable** : ses méthodes ne modifient pas l'objet, elles retournent **une nouvelle chaîne**. `"Anne".toUpperCase()` renvoie `"ANNE"` et laisse `"Anne"` intact. Réaffecter une variable ne modifie pas l'objet d'origine : la variable pointe vers un autre objet.
* **`StringBuilder` est mutable** : la première phrase de sa Javadoc le dit (« a mutable sequence of characters »), et il possède des méthodes qui modifient l'objet, comme `reverse`.

Avec un `StringBuilder`, `final` et l'absence de setter ne suffisent plus :

```java
public class Parrot {
    private final StringBuilder name;

    public Parrot(StringBuilder name) { this.name = name; }   // copie de la RÉFÉRENCE
    public StringBuilder getName() { return name; }
}
```

```java
StringBuilder name = new StringBuilder("Polly");
Parrot parrot = new Parrot(name);

name.reverse();                    // le perroquet s'appelle maintenant "ylloP"
parrot.getName().reverse();        // et on peut encore le modifier de l'extérieur
```

Le constructeur a copié la **référence** : `name` et l'attribut désignent le **même objet**.

### La copie défensive

Pour protéger une classe immuable qui contient un objet mutable, on fait une **copie défensive**, à **deux endroits** :

* **dans le constructeur** : on ne garde pas la référence reçue, on crée un nouvel objet dans le même état ;
* **dans le getter** : on ne retourne pas l'objet encapsulé, on retourne une copie.

```java
public Parrot(StringBuilder name) {
    this.name = new StringBuilder(name);      // copie à la création
}

public StringBuilder getName() {
    return new StringBuilder(name);           // copie au retour
}
```

Avec les deux protections, ni celui qui a créé l'objet, ni celui qui appelle le getter ne peuvent changer l'état du perroquet. Avec une `String`, rien de tout cela n'est nécessaire : le getter retourne directement l'attribut.

### Pourquoi préférer l'immuabilité

Les classes immuables sont plus simples à utiliser, à partager et à tester. Le choix dépend de ce que tu modélises : un navire qui prend des dégâts est fait pour évoluer. Mais à chaque classe que tu crées, **pose-toi la question**.

### Remarques

* **`final` sur une référence** : la variable ne sera pas réaffectée, mais l'objet pointé reste modifiable. Un `final StringBuilder` reste modifiable via ses méthodes.
* Pour qu'une fille ne puisse pas rendre la classe mutable, on déclare aussi la classe `final` (comme `String`).
* Depuis Java 16, un **`record`** déclare des attributs `final`, sans setter. La règle reste la même : si un attribut est d'un type mutable, le record n'est pas immuable en profondeur.
* `List.of(...)` crée une liste immuable ; `Collections.unmodifiableList(l)` est une **vue** : si on modifie `l`, la vue change (test fait : `[a]` devient `[a, b]`). `List.copyOf(l)` crée une copie immuable, qui ne bouge plus.

### À retenir

* Immuable : pas de setter, attributs `final`, composée de types immuables.
* `String` : immuable ; `StringBuilder` : mutable.
* Attribut mutable : copie défensive dans le constructeur **et** dans le getter.

## Les dates : `Date` et `LocalDate`

### `Date`, l'ancienne classe

`Date` (package `java.util`) existe depuis les débuts du langage. Elle est **mutable** :

```java
Date date = new Date(1234567890000L);   // un timestamp en millisecondes
date.setYear(95);                        // l'année attendue est « année − 1900 » : 1995
```

L'objet désigne maintenant une date en 1995 : c'est le même objet, dont l'état a changé. `setYear` est **dépréciée** (*deprecated*) : conservée pour compatibilité, à ne plus utiliser. Le compilateur l'indique : `warning: [deprecation] setYear(int) in Date has been deprecated`.

### `LocalDate`, la classe moderne

`LocalDate` (package `java.time`, **Java 8**) représente une date **sans heure**. Elle est **immuable**, et tous ses constructeurs sont **privés** (je l'ai vérifié par réflexion) : on passe par des méthodes statiques, comme dans une Factory.

```java
LocalDate today = LocalDate.now();
LocalDate landing = LocalDate.of(1718, 11, 22);       // année, mois (1 à 12), jour
LocalDate sameDay = LocalDate.of(1718, Month.NOVEMBER, 22);
System.out.println(landing);                            // 1718-11-22
```

`LocalDate.of(2024, 13, 1)` lève une `DateTimeException` : `Invalid value for MonthOfYear (valid values 1 - 12): 13`.

Les méthodes comme `minusYears` ne modifient pas l'objet : elles **retournent un nouvel objet**.

```java
LocalDate date = LocalDate.of(2024, 10, 2);
LocalDate older = date.minusYears(29);

System.out.println(date);     // 2024-10-02 : inchangée
System.out.println(older);    // 1995-10-02 : un nouvel objet
```

Appeler `date.minusYears(29);` sans utiliser le résultat ne sert à rien (IntelliJ l'avertit : *result ignored*). Pour « faire évoluer » une variable, on la **réaffecte** : `date = date.minusYears(29);`. L'ancien objet, plus référencé, sera nettoyé par le ramasse-miettes.

C'est exactement une classe immuable : une méthode ne peut pas modifier l'état, elle construit un nouvel objet à partir de l'ancien. Dans le code du JDK, tu peux voir que `minusYears` délègue à `plusYears` : à toi de l'ouvrir dans IntelliJ.

> **Quelle classe utiliser ?** En pratique, `LocalDate`, pour les raisons de l'immuabilité. `Date` n'est utile que pour dialoguer avec de vieilles API.

### Afficher une date au format souhaité

La méthode `format` attend un `DateTimeFormatter`, construit avec un **pattern** dont les lettres représentent chaque élément :

```java
LocalDate date = LocalDate.of(1718, 11, 22);
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

System.out.println(date.format(formatter));   // 22/11/1718
```

| Lettre | Signification |
| --- | --- |
| `y` | année (`yyyy` : 4 chiffres) |
| `M` (majuscule) | mois (`MM` : 2 chiffres) |
| `d` | jour du mois (`dd` : 2 chiffres) |
| `H` | heure, 0 à 23 |
| `m` (minuscule) | **minutes** |

Attention à la casse. Avec `"dd/mm/yyyy"` sur un `LocalDate`, on obtient une exception : `UnsupportedTemporalTypeException: Unsupported field: MinuteOfHour` (une date n'a pas de minutes). La Javadoc de `DateTimeFormatter` liste toutes les lettres.

### Remarques

* `java.time` contient d'autres classes immuables : `LocalTime` (heure), `LocalDateTime` (date et heure, ex. `LocalDateTime.of(1718, 11, 22, 14, 30)` avec le pattern `"dd/MM/yyyy HH:mm"`), `Instant`, `Duration`, `Period`. `DateTimeFormatter` est lui aussi immuable.
* On compare deux dates avec `isBefore`, `isAfter` et `equals`, pas `==`.
* Dans le kit, les entrées du journal de bord utilisent `LocalDateTime`.

### À retenir

* `Date` : ancienne, mutable, setters dépréciés. `LocalDate` (Java 8) : immuable, méthodes qui retournent un nouvel objet.
* On crée une date avec `LocalDate.now()` ou `LocalDate.of(...)`, jamais avec `new`.
* Pour formater : `DateTimeFormatter.ofPattern(...)`. `M` = mois, `m` = minutes.

## Construire un modèle immuable

### Étape 1 : rendre les classes immuables de bas en haut

Les filles d'une classe mère doivent être immuables **si la mère l'est** (et inversement). On vérifie donc chaque classe :

* `int`, `String` : pas de problème ;
* un `Ship` référence un `Captain` : il doit lui aussi être immuable ;
* `Captain` hérite de `Pirate` : on commence par `Pirate`.

Dans `Pirate`, aucun setter ne réaffecte un attribut : IntelliJ signale d'ailleurs que les attributs peuvent être `final`. On l'ajoute, puis on fait de même pour `Captain`, `Ship` et ses filles. Les objets sont alors dans l'état décrit par le fichier XML, sans pouvoir être modifiés ensuite.

### Étape 2 : se méfier des paramètres mutables

Une classe `Voyage` représente une expédition d'un navire à partir d'une date de départ. Le navire est immuable, mais la date reçue est un `Date` : **mutable**. Version dangereuse :

```java
public class BadVoyage {
    private final Date departure;

    public BadVoyage(Date departure) {
        this.departure = departure;                       // copie de la RÉFÉRENCE
        if (departure.before(new Date())) {
            throw new IllegalArgumentException("Le départ doit être dans le futur");
        }
    }
}
```

La vérification ne protège que **le moment de la création** :

```java
Date date = /* une date dans le futur */;
BadVoyage voyage = new BadVoyage(date);     // accepté
date.setYear(95);                           // le départ est maintenant en 1995 !
```

Test fait : après `setYear(95)`, le départ de la `BadVoyage` est bien dans le passé, sans que rien ne l'ait détecté.

### Étape 3 : la copie défensive

La classe crée **son propre** objet. Deux écritures équivalentes :

```java
this.departure = new Date(departure.getTime());        // nouvelle Date à partir du timestamp
this.departure = (Date) departure.clone();             // clone() retourne un Object : cast nécessaire
```

On copie **avant** de contrôler, pour contrôler la copie qu'on conserve, et le getter retourne lui aussi une copie :

```java
public Voyage(Date departure, int days) {
    this.departure = new Date(departure.getTime());
    if (this.departure.before(new Date())) {
        throw new IllegalArgumentException("Le départ doit être dans le futur");
    }
    this.days = days;
}

public Date getDeparture() {
    return new Date(departure.getTime());
}
```

Même test : après `date.setYear(95)`, le départ de `Voyage` reste dans le futur. Avec une `LocalDate`, la copie défensive deviendrait inutile.

### Étape 4 : une classe mutable doit assumer ses setters

Imagine un `Voyage` dont le coût dépend du navire (`costPerDay * days`), et un setter :

```java
public void setShip(Ship ship) {
    this.ship = ship;
}
```

On change de navire, mais le **coût reste celui de l'ancien** : l'objet est devenu **incohérent**. Le setter doit recalculer ce qui dépend de l'attribut, et refuser les valeurs invalides (ici `null`, qui ferait planter le recalcul), en le documentant :

```java
/**
 * Change le navire et recalcule le coût.
 *
 * @param ship le nouveau navire
 * @throws IllegalArgumentException si le navire est null
 */
public void setShip(Ship ship) {
    if (ship == null) {
        throw new IllegalArgumentException("Le navire ne peut pas être null");
    }
    this.ship = ship;
    updateCost();
}
```

Écrire un setter n'est pas anodin : avec une classe immuable, la question ne se pose pas.

### Remarques

* `updateCost` est **privée**, donc non redéfinissable : on peut l'appeler sans risque depuis le constructeur et le setter. Appeler dans un constructeur une méthode redéfinissable est à éviter : la fille pourrait l'exécuter avant que ses propres attributs soient initialisés.
* L'alternative à un setter, sur une classe immuable : une méthode qui retourne un **nouvel objet**, comme `LocalDate.minusYears` (par exemple `voyage.withShip(otherShip)`).

### À retenir

* Une classe immuable est composée de types immuables ; la mère et les filles doivent l'être toutes.
* Un attribut mutable impose une copie défensive à la création **et** au getter.
* Un setter garde l'objet cohérent, refuse les valeurs invalides, et documente ses exceptions.

## Le patron Builder

### Le besoin

Pour acheter un navire au port, le joueur fait une **recherche**. La classe `ShipCriteria` représente les critères :

* l'**effectif** de l'équipage minimum : **obligatoire** ;
* un prix minimum, un prix maximum, la présence de canons : **facultatifs**.

On la veut **immuable** : pour une nouvelle recherche, on crée un nouvel objet.

### Première version

Attributs `final`, pas de setter, un constructeur qui prend tout :

```java
public ShipCriteria(int crewSize, int minPrice, int maxPrice, Preference cannons) { ... }
```

Avec un seul constructeur, il faut tout renseigner. La surcharge (chapitre 7) ne s'en sort pas :

```java
public ShipCriteria(int crewSize, int minPrice) { ... }
public ShipCriteria(int crewSize, int maxPrice) { ... }   // même signature !
```

```
error: constructor ShipCriteria(int,int) is already defined in class ShipCriteria
```

Le nom des paramètres ne compte pas pour le compilateur : impossible de distinguer « je donne le minimum » de « je donne le maximum ». Il faudrait en plus un constructeur par combinaison. Et on ne peut pas utiliser des setters : la classe est immuable.

### La solution : le Builder

Le **Builder** (monteur) construit un objet immuable quand il y a des paramètres obligatoires **et** facultatifs. On configure un objet intermédiaire, puis on lui demande l'objet final.

```java
public final class ShipCriteria {

    public enum Preference { INDIFFERENT, WANTED, UNWANTED }

    private final int crewSize;
    private final int minPrice;
    private final int maxPrice;
    private final Preference cannons;

    private ShipCriteria(Builder builder) {
        this.crewSize = builder.crewSize;
        this.minPrice = builder.minPrice;
        this.maxPrice = builder.maxPrice;
        this.cannons = builder.cannons;
    }

    // getters, toString

    public static class Builder {

        private final int crewSize;                              // obligatoire
        private int minPrice = 0;                                // facultatif
        private int maxPrice = Integer.MAX_VALUE;                // facultatif
        private Preference cannons = Preference.INDIFFERENT;     // facultatif

        public Builder(int crewSize) {
            this.crewSize = crewSize;
        }

        public Builder minPrice(int minPrice) {
            this.minPrice = minPrice;
            return this;
        }

        public Builder maxPrice(int maxPrice) {
            this.maxPrice = maxPrice;
            return this;
        }

        public Builder cannons(boolean wanted) {
            this.cannons = wanted ? Preference.WANTED : Preference.UNWANTED;
            return this;
        }

        public ShipCriteria build() {
            return new ShipCriteria(this);
        }
    }
}
```

Les cinq éléments du patron :

1. Une **classe interne statique** `Builder`, dans la classe qu'il construit : elle a accès à ses éléments privés. Elle est `static` : on doit pouvoir l'utiliser **sans instance** de `ShipCriteria` (qu'on cherche justement à construire). On y accède par `ShipCriteria.Builder`.
2. Le **constructeur de la classe principale est privé** et reçoit le builder : personne ne peut le contourner.
3. Les **attributs du builder** reprennent ceux de la classe : l'obligatoire est `final`, les facultatifs ne le sont pas et ont une **valeur par défaut correcte**.
4. Une **méthode par paramètre facultatif**, qui renseigne l'attribut et retourne **`this`** : on peut enchaîner les appels.
5. **`build()`** appelle le constructeur privé en lui passant le builder (`this`).

### Utilisation

```java
ShipCriteria simple = new ShipCriteria.Builder(12).build();

ShipCriteria full = new ShipCriteria.Builder(12)
        .minPrice(100)
        .maxPrice(300)
        .cannons(true)
        .build();
```

L'effectif est imposé par le constructeur du builder ; le reste est facultatif et se donne **dans n'importe quel ordre**. Résultat de `toString` pour la première : `ShipCriteria{crewSize=12, minPrice=0, maxPrice=2147483647, cannons=INDIFFERENT}`.

### Un critère à trois états

La présence de canons a **trois** états : on en veut, on n'en veut pas, ou ça n'a pas d'importance. Un `boolean` n'en a que deux. On utilise une **énumération** (chapitre 8), qui empêche de passer une valeur invalide. La méthode `cannons(boolean)` garde une écriture naturelle pour l'appelant et traduit en `WANTED` ou `UNWANTED` ; si elle n'est pas appelée, la valeur reste `INDIFFERENT`. (Avec trois constantes entières, il faudrait des « constantes nommées » `static final int` à la place des valeurs magiques `0`, `1`, `2` : l'énumération est préférable.)

### Attention aux valeurs par défaut

Un `int` vaut `0` par défaut : cela convient au prix minimum, mais pas au prix maximum, qui bloquerait toute recherche. On l'initialise à `Integer.MAX_VALUE`. On initialise aussi le minimum à `0` **explicitement**, pour que le code soit lisible.

### Valider dans `build()`

On peut contrôler les critères avant de créer l'objet, pour qu'il soit toujours valide :

```java
public ShipCriteria build() {
    if (crewSize < 1) {
        throw new IllegalArgumentException("crewSize must be >= 1");
    }
    if (minPrice > maxPrice) {
        throw new IllegalArgumentException("minPrice > maxPrice");
    }
    return new ShipCriteria(this);
}
```

### Factory ou Builder ?

* La **Factory** choisit **quelle classe** instancier selon une condition.
* Le **Builder** construit **un objet complexe** pas à pas, quand il y a beaucoup de paramètres, dont certains facultatifs.

Le Builder est répandu : `StringBuilder.append` retourne l'objet pour permettre le chaînage, et des bibliothèques comme Lombok le génèrent avec `@Builder`. Dans le kit, il sert pour `GameOptions` (nombre d'ennemis et de récifs).

### À retenir

* Le Builder construit une instance immuable avec des paramètres obligatoires et facultatifs.
* Deux constructeurs de mêmes types de paramètres sont impossibles, quels que soient les noms.
* Classe interne statique, constructeur principal privé, obligatoire dans le constructeur du builder, facultatifs par des méthodes qui retournent `this`, `build()` crée l'objet.
* Valeurs par défaut cohérentes, validation dans `build()`.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Garder la référence d'un objet mutable | l'objet change de l'extérieur | Copie défensive (constructeur et getter). |
| Ignorer le résultat de `date.minusYears(...)` | aucun effet | Réaffecter : `date = date.minusYears(...)`. |
| `m` à la place de `M` dans un pattern | `Unsupported field: MinuteOfHour` | `M` = mois, `m` = minutes. |
| Un setter qui ne recalcule pas l'état dépendant | objet incohérent | Appeler la méthode de recalcul, refuser `null`. |
| Deux constructeurs de même signature | `constructor X is already defined` | Utiliser le Builder. |

## À retenir

* **Immuable** : pas de setter, attributs `final`, composée de types immuables. Attribut mutable : copie défensive à la création **et** au getter.
* **`LocalDate`** (immuable) plutôt que `Date` (mutable).
* Un setter garde l'objet cohérent, refuse les valeurs invalides et documente ses exceptions.
* **Builder** : objet immuable avec paramètres obligatoires et facultatifs ; valeurs par défaut cohérentes, validation dans `build()`.

## À toi de jouer

1. Écris `Parrot` avec un `StringBuilder`, prouve que l'immuabilité est cassée, puis corrige avec une copie défensive. Refais-le avec une `String`.
2. Écris `BadVoyage` et `Voyage` avec une `Date`, prouve la faille avec `setYear`, puis refais `Voyage` avec une `LocalDate` et supprime la copie défensive.
3. Affiche la date `1718-11-22` au format `22/11/1718`, puis essaie `dd/mm/yyyy`.
4. Écris `Voyage.setShip` qui recalcule le coût et refuse `null`, avec sa Javadoc.
5. Écris `ShipCriteria` avec son Builder (effectif obligatoire, prix minimum et maximum, canons en `Preference`). Ajoute la validation dans `build()` et teste `minPrice > maxPrice`.
6. Écris `GameOptions.Builder` pour le jeu : nom du joueur obligatoire, nombre d'ennemis et de récifs facultatifs, avec des valeurs par défaut cohérentes.

## Pour aller plus loin

* [Dev.java : l'API Date Time](https://dev.java/learn/date-time/) et [formater et analyser les dates](https://dev.java/learn/date-time/parsing-formatting/).
* [API Java SE 21 : `LocalDate`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/LocalDate.html).
* [API Java SE 21 : `DateTimeFormatter`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/time/format/DateTimeFormatter.html) (liste des lettres du pattern).
