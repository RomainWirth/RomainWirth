# Polymorphisme et classe `Object`

Au chapitre précédent, tu as vu qu'un `Sloop` **est un** `Ship`. Ce chapitre explore une conséquence importante : **une variable de type `Ship` peut référencer un `Sloop` ou un `Galleon`**, et c'est le bon comportement qui s'exécute. On en profite pour regarder la classe `Object`, mère de toutes les classes, et trois de ses méthodes : `toString`, `equals` et `hashCode`.

## Objectifs

À la fin du chapitre, tu sauras :

* expliquer ce qu'est le polymorphisme et ce qu'il apporte ;
* distinguer le type d'une variable et le type réel de l'objet ;
* utiliser `instanceof` et le transtypage (*cast*) sans risquer une `ClassCastException` ;
* expliquer pourquoi `println` accepte n'importe quel objet ;
* redéfinir `toString`, `equals` et `hashCode`, et dire pourquoi les deux dernières vont ensemble.

## Le polymorphisme

### Définition

Le **polymorphisme** (du grec *poly* : plusieurs, *morphê* : forme) est un concept de la programmation orientée objet qui **existe grâce à l'héritage** : un objet peut être vu sous **plusieurs formes**.

> Sans héritage, il n'y a pas de polymorphisme.

Concrètement, une variable du type de la **classe mère** peut référencer un objet d'une de ses **classes filles**.

On reprend les classes du chapitre précédent : `Sloop` et `Galleon` héritent de `Ship`, qui possède une méthode `display()` redéfinie dans `Sloop`. Un `Captain` (chapitre 8) est lié à un `Ship` par composition.

### Rappel : affecter une référence ne crée pas d'objet

```java
Ship ship1 = new Ship("Vieux Rafiot", 10, 2);
Ship ship2 = ship1;   // copie de la référence : pas de new, pas de nouvel objet
```

`ship2` pointe vers **le même objet** que `ship1`. Seule la référence est copiée.

### Une variable de type mère peut référencer une fille

```java
Sloop sloop = new Sloop("Sea Wolf");
Ship asShip = sloop;   // accepté : un Sloop est un Ship
```

C'est encore une **copie de référence** : il n'y a en mémoire qu'**un seul objet**, un `Sloop`, mais deux variables qui le référencent :

```
  sloop   ──┐
            ├──▶ [ objet Sloop | name, hull, maxHull, firepower, speed ]
  asShip  ──┘
```

* `sloop` voit l'objet **sous la forme d'un `Sloop`** : accès à `canFlee()`, `display()` et toutes les méthodes héritées.
* `asShip` le voit **sous la forme d'un `Ship`** : accès seulement aux membres définis dans `Ship`.

Il y a donc une **perte de visibilité**, mais **aucune perte en mémoire** : l'objet reste un `Sloop` complet, c'est la variable qui limite ce qu'on peut faire avec lui.

```java
asShip.getName();       // méthode de Ship : accepté
asShip.canFlee(3);      // error: cannot find symbol : un Ship ne connaît pas canFlee()
```

### Ce qui est appelé à l'exécution : la méthode de l'objet réel

Que se passe-t-il quand on appelle une méthode **redéfinie** par la fille ?

```java
asShip.display();   // c'est la méthode display() de Sloop qui s'exécute
```

Le code compile parce que `display()` existe dans `Ship`. Mais à l'**exécution**, c'est la version de l'objet réellement présent en mémoire qui est jouée : celle de `Sloop`, puisque c'est un `Sloop` qui se cache derrière.

```
Sea Wolf : coque 10/10, puissance de feu 3
  Vitesse : 4
```

| | Type de la variable | Type réel de l'objet |
| --- | --- | --- |
| Rôle | détermine **ce qu'on peut appeler** (à la compilation) | détermine **quelle version** est exécutée (à l'exécution) |
| Pour `asShip` | `Ship` | `Sloop` |

Le polymorphisme fonctionne avec **n'importe quelle fille** :

```java
Ship ship1 = new Sloop("Sea Wolf");
Ship ship2 = new Galleon("Black Pearl");
```

Écrit ainsi, il n'a pourtant **pas d'intérêt** : on crée un `Sloop` et on le référence aussitôt sous une forme appauvrie. Quand on connaît le type précis, on le déclare tel quel. L'intérêt est ailleurs.

### À quoi ça sert : « là où une mère est attendue, une fille convient »

Le constructeur de `Captain` attend un `Ship` :

```java
public Captain(String name, Ship ship) { ... }
```

Grâce au polymorphisme, on peut lui passer un `Ship`, mais aussi un `Sloop` ou un `Galleon` :

```java
Captain anne = new Captain("Anne", new Sloop("Sea Wolf"));
Captain flint = new Captain("Flint", new Galleon("Black Pearl"));
```

On n'écrit **qu'un seul constructeur**, au lieu d'un par type de navire (et un de plus à chaque nouvelle fille). Dans `Captain`, on manipule un `Ship` sans savoir lequel : quand on appelle `ship.display()`, c'est la méthode de l'objet réel qui s'exécute.

Règle générale : **partout où un objet du type de la classe mère est attendu** (paramètre de méthode ou de constructeur, attribut, variable, valeur de retour, case d'un tableau), on peut fournir un objet d'une classe fille.

### Exemple : une méthode polymorphe

```java
static void show(Ship ship) {
    ship.display();
}

show(new Ship("Vieux Rafiot", 10, 2));   // display() de Ship
show(new Sloop("Sea Wolf"));             // display() de Sloop (redéfinie)
show(new Galleon("Black Pearl"));        // display() de Ship (Galleon ne la redéfinit pas : version héritée)
```

Une seule méthode suffit pour les trois types. Le polymorphisme est **écrit à la définition** de la méthode (on déclare un `Ship`) mais **joué à l'exécution**, selon l'objet réellement passé.

Cela marche aussi avec un tableau :

```java
Ship[] fleet = { new Sloop("Sea Wolf"), new Galleon("Black Pearl"), new Ship("Vieux Rafiot", 10, 2) };
for (Ship ship : fleet) {
    ship.display();   // chaque objet exécute sa propre version
}
```

### Polymorphisme et surcharge

Sans polymorphisme, il faudrait trois méthodes **surchargées**, une par type :

```java
static void show(Ship ship) { ... }
static void show(Sloop sloop) { ... }
static void show(Galleon galleon) { ... }
```

Cela compile, mais le code est redondant. Surtout, la surcharge est résolue sur le **type de la variable** (voir chapitre 7) et non sur le type réel :

```java
static void over(Ship s)  { System.out.println("over Ship"); }
static void over(Sloop s) { System.out.println("over Sloop"); }

Sloop sloop = new Sloop("Sea Wolf");
Ship asShip = sloop;
over(sloop);     // over Sloop
over(asShip);    // over Ship : le même objet, mais la variable est déclarée Ship
```

À l'inverse, c'est bien le **type réel** qui compte pour une méthode redéfinie (`asShip.display()` appelle celle de `Sloop`).

### Le polymorphisme ne fonctionne que dans un sens

L'héritage va de la fille vers la mère, et le polymorphisme aussi :

* **fille vers mère** (autorisé) : un `Sloop` peut être utilisé là où un `Ship` est attendu. On parle d'***upcasting***, implicite et toujours sûr ;
* **mère vers fille** (interdit sans précaution) : un `Ship` ne peut pas être utilisé là où un `Sloop` est attendu.

```java
Sloop s1 = new Ship("Vieux Rafiot", 10, 2);   // error: incompatible types: Ship cannot be converted to Sloop

Ship ship = new Sloop("Sea Wolf");
Sloop s2 = ship;                               // error : même erreur, bien que ce soit réellement un Sloop
```

Dans le second cas, le compilateur ne regarde que le **type de la variable** (`Ship`) : il ne peut pas être sûr qu'il s'agit d'un `Sloop`. C'est une des raisons pour lesquelles on **type les objets aussi précisément qu'ils le sont**, quand on le peut.

### Retrouver la fille : `instanceof` et le transtypage

Dans une méthode qui reçoit un `Ship`, on ne peut pas appeler `canFlee()` : l'objet reçu n'est pas forcément un `Sloop`. Pour utiliser un comportement propre à un type plus précis (le *downcasting*), on procède en deux temps :

1. **tester** le type réel avec `instanceof` ;
2. **transtyper** (*cast*) la référence vers ce type, en le plaçant entre parenthèses.

```java
static void show(Ship ship) {
    ship.display();

    if (ship instanceof Sloop) {
        Sloop sloop = (Sloop) ship;   // cast : on revient à la forme Sloop
        System.out.println("Fuite possible avec 3 : " + sloop.canFlee(3));
    }
}
```

* `ship instanceof Sloop` est vrai **seulement si** l'objet réellement présent en mémoire est un `Sloop` (ou une fille de `Sloop`).
* Le **cast** `(Sloop) ship` est une affirmation faite au compilateur : « fais-moi confiance, c'est bien un `Sloop` ». Il est obligatoire pour aller de la mère vers la fille.

Depuis Java 16, le *pattern matching* regroupe le test et le cast en une instruction :

```java
if (ship instanceof Sloop sloop) {
    System.out.println("Fuite possible avec 3 : " + sloop.canFlee(3));
}
```

La variable `sloop` n'existe que dans le `if` où le test est vrai. C'est la forme à privilégier.

### Le test `instanceof` est indispensable

Sans le test, le code compile : le compilateur autorise le cast. Mais à l'exécution :

* si on passe un `Sloop`, le cast réussit ;
* si on passe un `Galleon`, le programme s'arrête :

```
Exception in thread "main" java.lang.ClassCastException:
class Galleon cannot be cast to class Sloop (Galleon and Sloop are in unnamed module of loader 'app')
```

Ce serait le pire scénario : un programme qui fonctionne dans un cas et plante dans un autre. Le test n'est pas obligatoire pour **compiler**, mais il l'est **en pratique**.

Si tu écris une cascade de `instanceof` pour choisir le comportement selon le type, demande-toi si une méthode **redéfinie** ne ferait pas mieux : c'est justement son rôle (voir le chapitre suivant sur les interfaces et les classes abstraites).

### À retenir

* Le polymorphisme repose sur l'**héritage** : un objet fille peut être référencé par une variable mère.
* Affecter une référence ne crée pas d'objet : un seul objet en mémoire, vu sous une autre **forme**.
* Le **type de la variable** détermine ce qu'on peut appeler (compilation) ; le **type réel** de l'objet détermine la version de la méthode redéfinie exécutée (exécution).
* Intérêt principal : **une seule méthode, un seul constructeur ou un seul tableau** accepte la mère et toutes ses filles, présentes et futures.
* Polymorphisme de la fille vers la mère uniquement. Pour revenir à la fille : `instanceof`, puis cast (ou *pattern matching*).
* Un cast sans test préalable risque une `ClassCastException`.

## La classe `Object`

### Un constat : `println` accepte n'importe quel objet

```java
Ship ship = new Sloop("Sea Wolf");
Captain captain = new Captain("Anne", ship);

System.out.println(ship);
System.out.println(captain);
```

Ce code compile quel que soit l'objet, et affiche quelque chose en console : le nom de la classe, un `@`, puis une valeur étrange (par exemple `Sloop@1b6d3586`). Deux questions :

1. **Comment `println` accepte-t-elle n'importe quel objet ?** Le polymorphisme suppose un lien d'héritage, or `Captain` n'hérite pas de `Ship`. Et `println` existe depuis bien avant notre classe `Captain` : elle ne peut pas avoir été écrite pour l'attendre.
2. **D'où vient cet affichage ?** (réponse dans la section sur `toString`).

La Javadoc de `println` répond à la première : la méthode attend en paramètre un **`Object`**.

### `Object` : la classe mère de toutes les classes

`java.lang.Object` est la **racine** de la hiérarchie de classes en Java : toute classe en hérite, **directement ou indirectement**.

On n'écrit pourtant jamais `extends Object` : si une classe n'étend aucune autre classe, le compilateur ajoute **implicitement** `extends Object`.

```java
public class Pirate { ... }
// équivaut à :
public class Pirate extends Object { ... }   // IntelliJ signale que c'est redondant
```

`Sloop` étend `Ship`, qui étend `Object` : `Sloop` hérite donc aussi d'`Object`. Une classe n'a qu'un seul parent direct (héritage **simple**), mais elle hérite de toute la **chaîne** de ses ancêtres.

```
Object
  └── Ship
        ├── Sloop
        └── Galleon
```

On fait donc de l'héritage **depuis le début** du cours, sans l'avoir écrit. IntelliJ sait afficher la hiérarchie d'une classe (*Type Hierarchy*) : le raccourci dépend de ta configuration, cherche l'action dans le menu *Navigate* (voir le lien JetBrains en fin de chapitre).

### Le constructeur d'`Object`

Le constructeur de la mère est toujours appelé (chapitre 9). Pour une classe sans mère explicite, c'est le constructeur par défaut d'`Object`, sans paramètre, qui est appelé implicitement :

```java
public Pirate(String name) {
    // super();   <- ajouté implicitement : appelle le constructeur d'Object
    this.name = name;
}
```

Ce constructeur ne fait rien de visible. Ce n'est pas lui qui réserve la mémoire : c'est l'opérateur `new`, comme tu l'as vu au chapitre 7. On n'écrit généralement ni l'extension, ni cet appel, mais il faut savoir qu'ils existent.

### L'explication de `println` : le polymorphisme

La méthode `println` possède une version déclarée avec un paramètre de type `Object` :

```java
public void println(Object x) { ... }
```

Puisque **toutes** les classes héritent d'`Object`, un `Ship`, un `Captain` ou n'importe quel objet peut lui être passé : c'est du polymorphisme, avec la classe mère la plus générale possible. Une seule méthode, écrite bien avant notre code, accepte tous les objets, y compris ceux que nous n'avons pas encore créés.

### Ce que tous les objets savent faire

Une classe hérite des **méthodes** de ses ancêtres. En tapant `ship.` dans l'IDE, tu vois, en plus de celles de `Ship`, des méthodes qui ne sont écrites nulle part dans ton code : celles d'`Object`. Trois nous intéressent :

| Méthode | Rôle |
| --- | --- |
| `toString()` | représentation textuelle de l'objet (c'est ce que `println` utilise) |
| `equals(Object)` | comparaison de deux objets |
| `hashCode()` | code numérique associé à l'objet |

Leur comportement par défaut est peu utile : chaque classe peut donc les **redéfinir** (`@Override`).

`Object` définit aussi `getClass()` (la classe réelle de l'objet), ainsi que `clone()`, `wait()`, `notify()` et `notifyAll()` (copie et threads, rarement utilisés au début).

### À retenir

* `Object` est la classe mère de **toutes** les classes. Une classe sans `extends` étend implicitement `Object`.
* L'héritage est **simple**, mais forme une **hiérarchie** dont `Object` est la racine.
* Une méthode qui attend un `Object` accepte n'importe quel objet : c'est pourquoi `println` fonctionne avec tous les types.
* Tout objet dispose de `toString()`, `equals()` et `hashCode()`, qu'on peut redéfinir.

## La méthode `toString`

### D'où vient l'affichage `Sloop@1b6d3586` ?

`println(Object)` ne peut utiliser, sur l'objet reçu, que ce que la classe `Object` définit. Son fonctionnement :

1. `println(Object x)` convertit `x` en chaîne avec `String.valueOf(x)`, puis l'affiche ;
2. `String.valueOf(x)` retourne `"null"` si `x` vaut `null`, sinon elle appelle **`x.toString()`** ;
3. `toString()` est une méthode d'`Object` : tout objet en dispose.

La version d'`Object` ressemble à ceci :

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

Le résultat est le **nom de la classe**, un `@`, puis la **valeur de hachage** (`hashCode()`, étudiée plus bas) en hexadécimal. Ce n'est donc **pas** l'adresse mémoire de l'objet, contrairement à ce qu'on entend parfois.

### Redéfinir `toString`

`toString()` n'est pas `final` : on peut la **redéfinir**, et grâce au polymorphisme `println` appelle la version de l'objet réellement passé. Tu l'as déjà fait au chapitre 7 ; voici pourquoi cela marche.

```java
public class Ship {
    // ...
    @Override
    public String toString() {
        return name + " (coque " + hull + "/" + maxHull + ")";
    }
}
```

```java
System.out.println(ship);      // Sea Wolf (coque 10/10)
System.out.println(captain);   // Captain@... : Captain n'a pas redéfini toString (version d'Object)
```

Ici on n'appelle pas `super.toString()` : la version d'`Object` donnerait `Ship@...`, sans intérêt. On redéfinit donc entièrement le comportement.

Pour `Sloop`, au contraire, on **réutilise** la version de la mère et on la complète :

```java
public class Sloop extends Ship {
    // ...
    @Override
    public String toString() {
        return "Sloop " + super.toString() + ", vitesse " + speed;
    }
}
```

IntelliJ peut générer `toString()` à partir des attributs choisis : menu *Code*, *Generate* (`Alt + Insert`), puis *toString()*.

### `println` : la version `String` et la version `Object`

`println` est **surchargée** : ce n'est pas la même méthode qui est appelée selon l'argument.

```java
System.out.println(ship.toString());   // println(String) : on convertit nous-mêmes
System.out.println(ship);              // println(Object) : toString() est appelée pour nous
```

Les deux lignes affichent la même chose : l'appel explicite à `toString()` est **redondant**.

Si `display()` écrit le même texte que `toString()`, elle peut simplement afficher l'objet courant :

```java
public void display() {
    System.out.println(this);   // this est l'objet courant : println appelle sa toString()
}
```

### `toString` n'est pas appelée « par magie »

`toString()` est une méthode ordinaire. Elle n'est appelée que si du code l'appelle (ici `String.valueOf`, utilisée par `println`). On ne peut pas affecter un objet à une `String` en espérant qu'il se convertisse :

```java
String str = ship;              // error: incompatible types: Ship cannot be converted to String
String str = ship.toString();   // appel explicite
```

### La concaténation avec `+`

L'opérateur `+` appelle aussi `toString()`, mais seulement quand **l'un des opérandes est une `String`** :

```java
String text = "Navire : " + ship;        // équivaut à "Navire : " + ship.toString()
String text2 = "" + ship;                // astuce pour obtenir une String
Object o = ship + ship;                  // error: bad operand types for binary operator '+'
```

Java connaissait l'opérateur `+` avant la création de `Ship` : il ne sait traiter un objet que s'il est accolé à une `String`. Avec une référence `null`, la concaténation écrit `"null"` sans erreur : `"n = " + n` donne `n = null`.

### À retenir

* `Object.toString()` retourne `nomDeLaClasse@valeurDeHachageEnHexadécimal`. C'est ce que `println(objet)` affiche par défaut.
* `println(Object)` appelle `String.valueOf(x)`, qui retourne `"null"` si `x` vaut `null`, sinon `x.toString()`.
* On redéfinit `toString()` (`@Override`) pour donner une représentation lisible ; le polymorphisme garantit que la version de l'objet réel est utilisée.
* Dans une fille, `super.toString()` réutilise la version de la mère. Si la mère est `Object`, on évite de l'appeler.
* `.toString()` est inutile dans `println(objet)` et dans une concaténation avec une `String` : elle est appelée automatiquement.

## Les méthodes `equals` et `hashCode`

### `==` compare des références, pas des états

```java
Pirate pirate1 = new Pirate("Jack");
Pirate pirate2 = new Pirate("Jack");

pirate1 == pirate2;   // false
```

Pour des objets, `==` teste si les deux variables **référencent le même objet en mémoire**. Ici, `new` a été appelé deux fois : il y a deux objets à deux endroits différents, même avec les mêmes valeurs.

```java
Pirate pirate3 = pirate1;   // copie de référence
pirate3 == pirate1;         // true : même objet
```

On réserve donc `==` aux **types primitifs** et aux comparaisons de références (`== null`, par exemple). Pour savoir si deux objets sont **dans le même état**, on utilise `equals`.

**Piège classique : les `String`.** `String` est un objet : on compare son contenu avec `equals`, jamais avec `==` :

```java
String a = "hello";
String b = new String("hello");
System.out.println(a == b);        // false : deux objets distincts
System.out.println(a.equals(b));   // true : même contenu
```

Deux littéraux identiques (`"hello" == "hello"`) donnent souvent `true`, parce que Java partage les littéraux : c'est trompeur, et c'est ce qui fait croire à tort que `==` marche.

### `equals` dans `Object`

`equals(Object)` est une méthode d'`Object` : tous les objets en héritent. Mais la version d'`Object` fait la même chose que `==` : elle ne retourne `true` que pour le même objet.

```java
pirate1.equals(pirate2);   // false, même avec le même état
```

Pour comparer les états, il faut la **redéfinir**, comme `toString`.

### Redéfinir `equals` dans `Pirate`

La signature doit respecter celle de la mère : `public boolean equals(Object o)`. Le paramètre est un `Object`, pas un `Pirate`. Un `equals(Pirate p)` serait une **surcharge**, pas une redéfinition : avec `@Override`, le compilateur le refuse (`method does not override or implement a method from a supertype`). Sans l'annotation, la méthode d'`Object` resterait celle utilisée par les collections, et l'erreur serait invisible.

On écrit le corps étape par étape :

```java
public class Pirate {
    private final String name;

    public Pirate(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {                        // 1. même objet : forcément égaux
            return true;
        }
        if (o == null) {                        // 2. null n'est jamais égal à this
            return false;
        }
        if (getClass() != o.getClass()) {       // 3. types différents : pas égaux
            return false;
        }
        Pirate pirate = (Pirate) o;             // 4. cast sûr : le type a été vérifié
        return Objects.equals(name, pirate.name);   // 5. comparaison de l'état
    }
}
```

1. **Même référence** : `this == o` donne `true`, inutile d'aller plus loin.
2. **`o` vaut `null`** : `false` (`this` ne peut pas être `null`, puisqu'il appelle la méthode).
3. **Types différents** : `false`. `getClass()` retourne le type **réel** de l'objet.
4. **Cast** sans risque de `ClassCastException`, car l'étape 3 a écarté les autres types.
5. **Comparaison des attributs** qui définissent l'égalité. Ici, un pirate est défini par son nom.

```java
new Pirate("Jack").equals(new Pirate("Jack"));    // true : deux objets, même état
new Pirate("Jack").equals(new Pirate("Anne"));    // false
```

`getClass() != o.getClass()` est la forme stricte : un `Pirate` n'est jamais égal à un `Gunner`, même de même nom. C'est la plus simple à rendre correcte avec l'héritage.

### Redéfinir `equals` dans une fille : `Gunner`

Un `Gunner` est un pirate qui s'occupe d'un canon. Sans redéfinition, il hériterait de l'`equals` de `Pirate`, qui ne compare que le nom : deux canonniers de même nom mais de canons différents seraient « égaux ».

```java
public class Gunner extends Pirate {
    private final String cannonName;

    public Gunner(String name, String cannonName) {
        super(name);
        this.cannonName = cannonName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;          // l'état hérité (le nom) est-il identique ?
        Gunner gunner = (Gunner) o;
        return Objects.equals(cannonName, gunner.cannonName);
    }
}
```

On **délègue à la mère** pour la partie qui la concerne, puis on compare ce que `Gunner` ajoute.

```java
new Gunner("Jack", "Betsy").equals(new Gunner("Jack", "Betsy"));   // true
new Gunner("Jack", "Betsy").equals(new Gunner("Jack", "Lucy"));    // false
new Pirate("Jack").equals(new Gunner("Jack", "Betsy"));            // false
new Gunner("Jack", "Betsy").equals(new Pirate("Jack"));            // false (symétrique)
```

### Comparer des attributs avec `Objects.equals`

`name` est une `String`, donc un **objet** : on la compare avec `equals`, pas avec `==`. Mais `name.equals(pirate.name)` provoque une **`NullPointerException`** si `name` vaut `null`. Deux pirates anonymes sont pourtant dans le même état : on voudrait obtenir `true`, pas un plantage.

La classe utilitaire **`java.util.Objects`** (avec un `s`) fournit `Objects.equals(a, b)`, qui gère `null` : elle retourne `true` si `a == b` (y compris les deux `null`), sinon `a != null && a.equals(b)`.

> Ne confonds pas `Object` (`java.lang`, la classe mère de toutes les classes) et `Objects` (`java.util`, une classe utilitaire de méthodes `static`).

### Le contrat de `equals`

Une bonne implémentation respecte ces règles :

* **réflexive** : `x.equals(x)` est toujours vrai ;
* **symétrique** : `x.equals(y)` donne le même résultat que `y.equals(x)` ;
* **transitive** : si `x` égale `y` et `y` égale `z`, alors `x` égale `z` ;
* **cohérente** : tant que les objets ne changent pas, le résultat ne change pas ;
* `x.equals(null)` est toujours faux.

Les étapes ci-dessus les respectent. Elles sont plus délicates à tenir si on remplace `getClass()` par `instanceof` dans une hiérarchie non finale.

### `hashCode` : la valeur de hachage

`hashCode()` est une autre méthode d'`Object`. Elle retourne un **entier**, la **valeur de hachage** : une sorte d'**empreinte** de l'objet. C'est cette valeur qui apparaît, en hexadécimal, dans l'affichage par défaut de `toString()`.

#### À quoi sert-elle ?

Imagine une bibliothèque qui range ses livres par rayon, selon la première lettre du titre. Pour savoir si un livre est présent, on va directement au bon rayon plutôt que de parcourir tout le magasin. La valeur de hachage joue le rôle du **numéro de rayon**.

```java
"abc".hashCode();   // 96354
"abd".hashCode();   // 96355
```

Le même contenu donne toujours le même entier ; un contenu différent en donne, en général, un autre.

Comparer deux entiers est immédiat, alors que comparer deux objets avec `equals` peut être coûteux :

* deux objets de valeurs de hachage **différentes** sont forcément différents : inutile d'appeler `equals` ;
* deux objets de valeurs de hachage **identiques** sont peut-être égaux : c'est `equals` qui confirme.

Les collections `HashMap` et `HashSet` fonctionnent ainsi : elles rangent chaque élément dans une « case » choisie grâce à son `hashCode()`. Pour retrouver un élément, elles calculent sa valeur de hachage, vont directement à la bonne case, puis ne comparent avec `equals` que les quelques éléments qui s'y trouvent.

#### Version par défaut et version redéfinie

* Dans `Object`, `hashCode()` est liée à l'**identité** de l'objet, pas à son contenu. Deux `new Pirate("Jack")` distincts ont des valeurs différentes. Elle n'est pas garantie d'être l'adresse mémoire, et varie d'une exécution à l'autre.
* Une fois **redéfinie**, elle se calcule à partir de l'**état** de l'objet, comme `equals`.

La règle (le **contrat**) : **deux objets égaux selon `equals` doivent avoir le même `hashCode`.**

Si tu redéfinis `equals` sans `hashCode`, c'est celle d'`Object` qui reste. Voici ce que cela donne avec un ensemble (`Set`, chapitre sur les collections) :

```java
class Pirate {                       // equals redéfinie, hashCode non
    // ...
}

Set<Pirate> crew = new HashSet<>();
crew.add(new Pirate("Jack"));
crew.add(new Pirate("Jack"));
System.out.println(crew.size());                         // 2 au lieu de 1
System.out.println(crew.contains(new Pirate("Jack")));   // false
```

Les deux pirates sont « égaux » selon `equals`, mais leurs `hashCode` diffèrent : la collection les range dans des cases différentes et ne les compare jamais. **Si on redéfinit `equals`, on redéfinit toujours `hashCode`**, à partir des **mêmes attributs** :

```java
// Pirate
@Override
public int hashCode() {
    return Objects.hash(name);
}

// Gunner : la valeur de la mère, puis les attributs propres à Gunner
@Override
public int hashCode() {
    return Objects.hash(super.hashCode(), cannonName);
}
```

`Objects.hash(...)` calcule la valeur de hachage à partir de plusieurs valeurs. Avec les deux méthodes redéfinies, `crew.size()` vaut bien `1`.

> Le contrat ne marche que dans un sens : deux objets égaux ont le même `hashCode`, mais deux objets de même `hashCode` ne sont pas forcément égaux (on parle de **collision**).

**Piège : utiliser un attribut modifiable dans `hashCode`.** Si on modifie un objet **après** l'avoir rangé dans un `HashSet` ou comme clé de `HashMap`, sa valeur de hachage change, et la collection ne le retrouve plus :

```java
Set<MutablePirate> crew = new HashSet<>();
MutablePirate jack = new MutablePirate("Jack");
crew.add(jack);
jack.setName("Anne");
crew.contains(jack);   // false : l'objet est toujours dans la collection, mais dans la mauvaise case
```

C'est une bonne raison de rendre `final` les attributs qui définissent l'égalité, comme `name` ici.

### Laisser l'IDE générer ces méthodes

Dans IntelliJ, place-toi dans le corps de la classe et ouvre *Code*, *Generate...* (`Alt + Insert`), puis *equals() and hashCode()*. L'IDE génère les deux **ensemble**, ce qui illustre la règle ci-dessus, puis demande de choisir les attributs à comparer.

Le code généré est fiable : il contient des étapes équivalentes à celles écrites à la main (`this == o`, `null`, type, cast, comparaison) et utilise `Objects.equals` et `Objects.hash`. Selon les options choisies, il peut utiliser `instanceof` plutôt que `getClass()`. Comprendre la logique reste utile pour relire, adapter, et choisir les bons attributs.

### À retenir

* `==` compare les **références** ; `equals` compare les **états**. Les `String` se comparent avec `equals`.
* `Object.equals` fait la même chose que `==` : on la redéfinit dans les classes dont l'égalité dépend de l'état.
* Signature obligatoire : `public boolean equals(Object o)`, avec `@Override`.
* Corps habituel : `this == o` (vrai), `null` (faux), `getClass()` différent (faux), cast, comparaison des attributs.
* Dans une fille : `super.equals(o)` pour la partie héritée, puis comparaison de ses propres attributs.
* `Objects.equals(a, b)` compare sans planter sur `null`.
* **Redéfinir `equals` impose de redéfinir `hashCode`** (avec `Objects.hash(...)`, sur les mêmes attributs).
* Les collections (`Set`, `Map`) s'appuient sur `equals` et `hashCode`. Ne mets pas dans `hashCode` un attribut qui change après le rangement de l'objet.

## Exemple complet

`Pirate.java`

```java
import java.util.Objects;

public class Pirate {
    private final String name;

    public Pirate(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Pirate " + name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Pirate pirate = (Pirate) o;
        return Objects.equals(name, pirate.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
```

`Gunner.java`

```java
import java.util.Objects;

public class Gunner extends Pirate {
    private final String cannonName;

    public Gunner(String name, String cannonName) {
        super(name);
        this.cannonName = cannonName;
    }

    @Override
    public String toString() {
        return super.toString() + ", canonnier de " + cannonName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        Gunner gunner = (Gunner) o;
        return Objects.equals(cannonName, gunner.cannonName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), cannonName);
    }
}
```

`Main.java`

```java
Pirate jack1 = new Pirate("Jack");
Pirate jack2 = new Pirate("Jack");
Pirate betsyJack = new Gunner("Jack", "Betsy");

System.out.println(jack1 == jack2);                    // false
System.out.println(jack1.equals(jack2));               // true
System.out.println(jack1.hashCode() == jack2.hashCode());   // true
System.out.println(jack1.equals(betsyJack));           // false : un Pirate n'est pas un Gunner
System.out.println(betsyJack);                         // Pirate Jack, canonnier de Betsy
```

Remarque : `betsyJack` est déclarée `Pirate` mais référence un `Gunner`. `println` appelle donc la `toString()` de `Gunner` : c'est le polymorphisme en action.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Affecter une mère à une variable de type fille | `incompatible types: Ship cannot be converted to Sloop` | Le polymorphisme ne marche que de la fille vers la mère. |
| Appeler une méthode propre à la fille sur une variable mère | `cannot find symbol` | Tester avec `instanceof`, puis transtyper. |
| Cast sans `instanceof` | `ClassCastException` à l'exécution | Tester le type réel avant. |
| Cast entre classes sans lien | `incompatible types: String cannot be converted to Sloop` | Un cast n'est possible qu'entre types liés par l'héritage. |
| Affecter un objet à une `String` | `incompatible types: Ship cannot be converted to String` | Appeler `toString()`. |
| `objet + objet` | `bad operand types for binary operator '+'` | L'un des deux doit être une `String`. |
| `equals(Pirate p)` au lieu de `equals(Object o)` | surcharge silencieuse, ou erreur avec `@Override` | La signature doit être identique à celle d'`Object`. |
| Comparer des `String` avec `==` | `false` alors que le contenu est identique | Utiliser `equals`. |
| `equals` sans `hashCode` | un `Set` contient des doublons, `contains` répond `false` | Redéfinir les deux ensemble. |
| `name.equals(...)` avec `name` à `null` | `NullPointerException` | Utiliser `Objects.equals`. |
| Modifier un objet rangé dans un `HashSet` | l'objet n'est plus retrouvé | Ne pas inclure d'attribut modifiable dans `hashCode`. |

## À retenir

* Le **polymorphisme** permet de référencer une fille par une variable mère. Le type de la variable décide de ce qu'on peut appeler, le type réel de l'objet décide de la version de la méthode redéfinie exécutée.
* Il ne fonctionne que de la fille vers la mère. Pour revenir à la fille : `instanceof` (de préférence avec le *pattern matching*), puis cast.
* **`Object`** est la racine de toutes les classes : tout objet a `toString()`, `equals()` et `hashCode()`.
* **`toString()`** donne une représentation lisible ; `println` et la concaténation l'appellent automatiquement.
* **`equals()`** compare les états ; **`hashCode()`** doit rester cohérente avec elle. On redéfinit toujours les deux ensemble.
* `==` compare les références, `equals` les états.

## À toi de jouer

1. Écris une méthode `static void showFleet(Ship[] fleet)` qui parcourt un tableau mêlant `Ship`, `Sloop` et `Galleon` et appelle `display()` sur chacun. Que remarques-tu ?
2. Dans une méthode qui reçoit un `Ship`, utilise `instanceof` avec *pattern matching* pour afficher la vitesse si c'est un `Sloop` et le nombre d'emplacements de cale si c'est un `Galleon`. Compte combien de `instanceof` il faudrait pour 10 types de navires : qu'en penses-tu ?
3. Provoque volontairement une `ClassCastException` en transtypant un `Galleon` en `Sloop`. Lis le message, puis protège le code avec `instanceof`.
4. Prévois le résultat avant d'exécuter : `over(sloop)` et `over(asShip)` avec les deux méthodes surchargées `over(Ship)` et `over(Sloop)`. Explique la différence avec `asShip.display()`.
5. Affiche un `Captain` sans avoir redéfini `toString()`. Lis le résultat. Redéfinis la méthode pour afficher le nom du capitaine et le navire qu'il commande (en réutilisant la `toString()` du navire).
6. Écris la classe `Pirate` avec `equals` et `hashCode`. Vérifie que `new Pirate("Jack").equals(new Pirate("Jack"))` est vrai, puis que deux pirates de même nom dans un `HashSet` ne comptent que pour un.
7. Retire `hashCode` de `Pirate` et refais le test de l'exercice 6. Que se passe-t-il ?
8. Crée la classe `Gunner` fille de `Pirate`, avec un attribut `cannonName`. Redéfinis `equals`, `hashCode` et `toString`, en déléguant à la mère. Teste les quatre combinaisons du chapitre (y compris `Pirate` contre `Gunner`).
9. Compare deux `String` de même contenu avec `==` et avec `equals`, en créant l'une avec `new String("hello")`. Explique la différence.
10. Génère `equals` et `hashCode` avec IntelliJ pour `Pirate`. Compare avec ton code écrit à la main : quelles différences vois-tu ?

**Solution de l'exercice 4 :** `over(sloop)` affiche `over Sloop` et `over(asShip)` affiche `over Ship`. Le choix d'une méthode **surchargée** se fait à la compilation, d'après le type **déclaré** de la variable. Pour `asShip.display()`, la méthode est **redéfinie** : le choix se fait à l'exécution, d'après le type **réel** de l'objet.

## Pour aller plus loin

* [Dev.java : `Object` comme superclasse](https://dev.java/learn/inheritance/objects/).
* [Dev.java : les chaînes de caractères](https://dev.java/learn/language/constructs/numbers-strings/strings/).
* [API Java SE 21 : `java.lang.Object`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html) (le contrat de `equals` et de `hashCode` est décrit dans leur Javadoc).
* [API Java SE 21 : `java.util.Objects`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Objects.html).
* [JetBrains : hiérarchie du code source dans IntelliJ IDEA](https://www.jetbrains.com/help/idea/viewing-structure-and-hierarchy-of-the-source-code.html).
* [OpenJDK : JEP 394, pattern matching pour `instanceof`](https://openjdk.org/jeps/394).
