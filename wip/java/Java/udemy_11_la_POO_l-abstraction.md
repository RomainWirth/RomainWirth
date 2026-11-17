# POO : L'abstraction

## Le principe d'abstraction : classe abstraite

### Les quatre principes de la POO

La programmation orientée objet repose sur quatre principes : l'**encapsulation**, l'**héritage**, le **polymorphisme** et l'**abstraction**. Les trois premiers ont été vus ; ce chapitre présente le quatrième, à travers deux mécanismes : les **classes abstraites** (cette section) et les **interfaces** (section suivante).

### Le contexte

On reprend des classes simples :

```java
public class Building {
    private int constructionYear;

    public Building(int constructionYear) { ... }
    public void display() { ... }
    public int getConstructionYear() { ... }
    public int getAge() { ... }
}

public class Housing extends Building {
    private int area;
    private int bedroomCount;
    // constructeur, accesseurs, display() redéfinie
}

public class Shop extends Building {
    private String shopName;
    // constructeur, accesseur
}
```

La classe `Field` (terrain) est composée d'un `Building` et, grâce au polymorphisme, un `Housing` ou un `Shop` peut se cacher derrière ce `Building`. Sa méthode `display()` affiche la taille du terrain, puis, si le bâtiment n'est pas `null`, une phrase du type « ce terrain est composé d'un bâtiment de type... ».

On veut compléter cette phrase :

- pour une habitation : « un bâtiment de type Habitation avec 3 chambres » ;
- pour un commerce : « un bâtiment de type Commerce, enseigne Boulangerie ».

Or `Field` ne manipule qu'un `Building` : elle ne sait pas quelle fille se cache derrière. Il faut donc une méthode **dans `Building`** qui fournit cette information.

### Première tentative : une méthode avec un corps « bidon »

On ajoute à `Building` une méthode `specificName()` :

```java
public class Building {
    // ...
    public String specificName() {
        return "???";   // que mettre ici ?
    }
}
```

Le problème est immédiat : il faut écrire un corps pour que le code compile, mais `Building` ne sait **pas quoi retourner**. Seule la fille sait si c'est une habitation (avec son nombre de chambres) ou un commerce (avec son enseigne).

Le code compile et `Field` peut appeler `building.specificName()`, mais à l'exécution :

- si on passe un `Building` : on obtient `???` ;
- si on passe un `Housing` ou un `Shop` qui **ne redéfinit pas** la méthode : on obtient aussi `???` ;
- seul un `Shop` qui la redéfinit affiche un résultat cohérent.

Le code compile avec ou sans redéfinition : rien n'oblige les filles à le faire. C'est leur responsabilité de décider si elles redéfinissent une méthode de la mère, et ici on oublie facilement de le faire.

### Le vrai problème

La mère **a** cette fonctionnalité (tout bâtiment doit pouvoir donner son nom spécifique), mais elle **ne sait pas l'implémenter**, car l'implémentation dépend de chaque fille. Il faudrait que :

- la méthode soit **présente** dans la mère (pour que `Field` puisse l'appeler) ;
- mais **non implémentée** dans la mère ;
- et que les filles aient l'**obligation** de la redéfinir.

### La solution : la méthode abstraite

On supprime le corps de la méthode et on le remplace par un point-virgule :

```java
public String specificName();   // erreur : missing method body, or declare abstract
```

Une méthode sans corps ne compile pas, sauf si on la déclare **`abstract`** :

```java
public abstract String specificName();
```

Une méthode abstraite possède un **nom**, une **signature** (paramètres, type de retour) et une **visibilité**, mais **pas de corps** : on sait qu'elle existe et comment l'appeler, mais pas comment elle fait.

### La classe abstraite

Dès qu'une classe contient une méthode abstraite, la classe elle-même doit être déclarée `abstract` :

```java
public abstract class Building {
    // ...
    public abstract String specificName();
}
```

`Building` est devenue une **classe abstraite**.

### Ce qu'on ne peut plus faire : instancier

```java
Building building1 = new Building(1992);   // erreur : Building is abstract; cannot be instantiated
```

On ne peut pas créer d'objet d'une classe abstraite. La raison est logique : si c'était possible, on pourrait appeler `building1.specificName()`, une méthode qui n'a aucun code à exécuter.

### À quoi sert alors une classe abstraite ?

Une classe abstraite est faite pour **être héritée**. Elle constitue un **tronc commun** pour ses filles :

- des **attributs** (la structure) ;
- des **constructeurs**, que les filles appellent avec `super(...)` ;
- des **méthodes implémentées**, dont les filles héritent ;
- éventuellement des **méthodes abstraites** : un engagement imposé aux filles.

Une classe abstraite n'est donc **pas** une classe qui ne contient que des méthodes abstraites. Elle peut en contenir **zéro, une ou plusieurs**. Inversement, une classe qui contient une méthode abstraite est **forcément** abstraite.

### L'obligation pour les filles

Une fille d'une classe abstraite doit **redéfinir toutes ses méthodes abstraites**, sinon elle ne compile pas :

```java
public class Housing extends Building {
    // ...
    // erreur : Housing is not abstract and does not override abstract method specificName() in Building
}
```

Chaque fille donne sa propre implémentation :

```java
public class Housing extends Building {
    private int bedroomCount;
    // ...

    @Override
    public String specificName() {
        return "Habitation avec " + bedroomCount + " chambres";
    }
}

public class Shop extends Building {
    private String shopName;
    // ...

    @Override
    public String specificName() {
        return "Commerce, enseigne " + shopName;
    }
}
```

`@Override` est bien présent : la méthode existe dans la mère. En revanche, on **ne peut pas appeler `super.specificName()`** dans la fille : la méthode n'a pas d'implémentation dans la mère.

Comparaison avec `display()`, redéfinie dans `Housing` :

| | `display()` (méthode implémentée) | `specificName()` (méthode abstraite) |
|---|---|---|
| Corps dans la mère | oui | non |
| Redéfinition par la fille | **facultative** | **obligatoire** |
| `super.méthode()` dans la fille | possible | impossible |

La fille est une classe **instanciable** : on peut faire `new Housing(...)`, et l'objet possède bien une méthode `specificName()` avec un corps à exécuter.

### Le polymorphisme continue de s'appliquer
 
On ne peut plus écrire `new Building(...)`, mais le **type** `Building` reste utilisable pour déclarer des variables, des attributs et des paramètres. Une variable de type `Building` peut référencer n'importe laquelle de ses filles.
 
#### Premier exemple : deux variables, un même appel
 
On suppose que `Housing` et `Shop` ont chacune écrit leur propre version de `specificName()` (voir plus haut).
 
```java
Building building1 = new Housing(2008, 100, 3);
Building building2 = new Shop(1990, "Boulangerie");
 
System.out.println(building1.specificName());   // Habitation avec 3 chambres
System.out.println(building2.specificName());   // Commerce, enseigne Boulangerie
```
 
Les deux variables ont le **même type** (`Building`) et les deux lignes appellent la **même méthode**, pourtant le résultat est différent. Voici ce qui se passe, en deux temps :
 
1. **À la compilation**, Java ne regarde que le **type de la variable** : `Building`. Il vérifie que `Building` possède bien une méthode `specificName()`. C'est le cas (elle est déclarée abstraite), donc l'appel est accepté.
2. **À l'exécution**, Java regarde l'**objet réellement présent en mémoire** et exécute la version de **cet objet** :
```
building1 (type Building) ──▶ [ objet Housing ] ──▶ exécute le corps de specificName() écrit dans Housing
building2 (type Building) ──▶ [ objet Shop    ] ──▶ exécute le corps de specificName() écrit dans Shop
```
 
#### Pourquoi on ne risque jamais d'appeler une méthode sans corps
 
Dans `Building`, `specificName()` n'a pas de corps. On pourrait craindre d'appeler « du vide ». Ce n'est jamais le cas : comme `Building` est abstraite, **aucun objet de type `Building` ne peut exister**. Derrière une variable de type `Building`, il y a donc toujours un objet d'une **fille concrète** (`Housing`, `Shop`...), et cette fille a l'**obligation** d'avoir écrit le corps de la méthode.
 
#### Deuxième exemple : `Field` n'a pas besoin de savoir qui est le bâtiment
 
`Field` possède un attribut de type `Building` :
 
```java
public class Field {
    private int width;
    private int length;
    private Building building;   // le type de la classe abstraite
 
    // constructeur : Field(int width, int length, Building building)
 
    public void display() {
        System.out.println("Ce terrain mesure " + width + " x " + length);
        if (building != null) {
            System.out.println("Il est composé d'un bâtiment de type " + building.specificName());
        }
    }
}
```
 
Le code de `display()` est écrit **une seule fois**. Il ne mentionne ni `Housing` ni `Shop` : il demande simplement au bâtiment son `specificName()`. La réponse dépend de l'objet donné à la construction du terrain :
 
```java
Field field1 = new Field(10, 20, new Housing(2008, 100, 3));
field1.display();
// Ce terrain mesure 10 x 20
// Il est composé d'un bâtiment de type Habitation avec 3 chambres
 
Field field2 = new Field(10, 20, new Shop(1990, "Boulangerie"));
field2.display();
// Ce terrain mesure 10 x 20
// Il est composé d'un bâtiment de type Commerce, enseigne Boulangerie
```
 
Si on ajoute plus tard une nouvelle fille (par exemple `Chalet`), qui doit elle aussi écrire `specificName()`, la classe `Field` fonctionne **sans aucune modification**.
 
#### À retenir sur ce point
 
- Le **type de la variable** (`Building`) détermine **ce qu'on a le droit d'appeler** (vérifié à la compilation).
- L'**objet réel** (`Housing`, `Shop`...) détermine **quelle version** s'exécute (décidé à l'exécution).
- Avec une classe abstraite, l'objet réel est toujours une fille qui a écrit le corps : l'appel est donc toujours valide.

### L'idée d'abstraction

Une classe abstraite permet de décrire **ce qu'un objet sait faire** (le contrat : le nom et la signature des méthodes) sans décider **comment il le fait** (l'implémentation, laissée aux filles). Le code qui utilise la mère (`Field`) dépend du contrat et non des détails de chaque fille.

> Compléments :
> - Une fille qui n'implémente pas toutes les méthodes abstraites de sa mère doit elle-même être déclarée `abstract`.
> - `abstract` est incompatible avec `private`, `final` et `static` pour une méthode : une méthode abstraite doit pouvoir être redéfinie par les filles.

### À retenir

- Une **méthode abstraite** (`abstract`) a une signature mais **pas de corps** (un point-virgule à la place).
- Une classe qui contient une méthode abstraite doit être déclarée **`abstract`**. Une classe abstraite peut cependant ne contenir aucune méthode abstraite.
- On **ne peut pas instancier** une classe abstraite (`new` est interdit).
- Une classe abstraite contient des attributs, des constructeurs (appelés par les filles avec `super(...)`) et des méthodes implémentées : elle sert de **tronc commun** à ses filles.
- Les filles **doivent** redéfinir toutes les méthodes abstraites (avec `@Override`), sinon elles ne compilent pas, et ne peuvent pas appeler `super` sur ces méthodes.
- On utilise toujours le type de la classe abstraite pour le **polymorphisme** : à l'exécution, c'est la méthode de la fille qui s'exécute.
- Principe d'abstraction : définir **ce que** font les objets (le contrat) et laisser les filles définir **comment**.

## Interface

Une **interface** est un type **complètement abstrait** : elle ne contient que des méthodes abstraites (des signatures, sans corps). Sa syntaxe est simple. L'essentiel est de comprendre **pourquoi** on en a besoin et comment on s'en sert. On le découvre avec un besoin concret.

### Le besoin : générer une annonce

On veut une fonctionnalité qui affiche une annonce dans la console (un titre, un contenu, des lignes de séparation), à partir d'un objet : un commerce, un terrain, etc. On la place dans une **classe utilitaire** (par exemple dans un package `tools`) : un constructeur privé, pas d'instance, et une méthode **statique**.

```java
public class AnnouncementUtils {
    private AnnouncementUtils() { }   // classe utilitaire : on ne l'instancie pas

    public static void generate(/* ??? */) {
        System.out.println("==============================");
        System.out.println(/* titre */);
        System.out.println("------------------------------");
        System.out.println(/* contenu */);
        System.out.println("==============================");
    }
}
```

La méthode doit recevoir en paramètre l'objet sur lequel baser l'annonce. Mais de quel type ?

### Première tentative : un paramètre `Shop`

```java
public static void generate(Shop shop) {
    System.out.println(shop.specificName());   // titre
    // ...
}
```

Ça fonctionne pour un commerce. Mais on veut aussi générer l'annonce d'un `Field` (terrain) :

```java
AnnouncementUtils.generate(field1);   // erreur : incompatible types : Field cannot be converted to Shop
```

IntelliJ propose de remplacer `Shop` par `Field` dans la signature, ce qui ne résout rien : on cherche une méthode qui accepte les deux.

### Pourquoi ni la surcharge ni le polymorphisme ne suffisent

- **Surcharge** : on pourrait écrire une deuxième méthode `generate(Field field)`. Cela fonctionne, mais :
  - il faut dupliquer le code, et chaque nouveau type d'objet (habitation, etc.) nécessiterait une méthode de plus ;
  - chaque type n'a pas forcément les méthodes qui donnent un titre et un contenu.
- **Polymorphisme** : une seule méthode attendant une classe mère serait la bonne solution, mais `Shop` et `Field` n'ont **aucun lien d'héritage** (un commerce est un bâtiment, un terrain n'en est pas un).

Il nous faut une seule méthode, avec un paramètre d'un type qui exprime : « quelque chose qui possède un titre et un contenu ».

### Pourquoi pas une classe `Announcement` ?

On pourrait déclarer une classe `Announcement` avec `getTitle()` et `getContent()`, puis faire hériter `Shop` et `Field` de cette classe, pour appliquer le polymorphisme. Mais `Shop` hérite déjà de `Building` : en Java, une classe ne peut étendre **qu'une seule** classe. Il est impossible de faire aussi hériter `Shop` d'`Announcement`.

La solution est de faire d'`Announcement` non pas une classe, mais une **interface**.

### Déclarer une interface

Dans IntelliJ : *New → Java Class*, puis choisir **Interface** dans la liste. Le fichier généré contient `public interface` au lieu de `public class` :

```java
public interface Announcement {
    String getTitle();
    String getContent();
}
```

C'est la déclaration d'un **nouveau type** : « une annonce, c'est quelque chose qui sait donner un titre et un contenu ».

Dans une interface :

- toutes les méthodes sont **abstraites** : une signature, pas de corps. Déclarer `abstract` devant la méthode est donc **redondant** (permis mais inutile) ;
- toutes les méthodes sont **publiques**. Déclarer `public` devant la méthode est aussi redondant. Il n'existe pas de visibilité package dans une interface : puisqu'une interface décrit des fonctionnalités offertes, elles sont forcément publiques.

On peut maintenant écrire la méthode utilitaire avec **un seul** paramètre :

```java
public static void generate(Announcement announcement) {
    System.out.println("==============================");
    System.out.println(announcement.getTitle());
    System.out.println("------------------------------");
    System.out.println(announcement.getContent());
    System.out.println("==============================");
}
```

Dans son corps, on ne peut utiliser **que** ce que l'interface définit : `getTitle()` et `getContent()`.

### Implémenter une interface : l'héritage par implémentation

Pour passer un `Shop` à cette méthode, il faut établir un lien entre la classe et l'interface avec le mot-clé **`implements`** :

```java
public class Shop extends Building implements Announcement {
    // ...

    @Override
    public String getTitle() {
        return specificName();
    }

    @Override
    public String getContent() {
        return "Commerce construit en " + getConstructionYear()
                + " (" + getAge() + " ans), enseigne " + shopName;
    }
}
```

- `extends` exprime l'héritage **par extension** (une seule classe).
- `implements` exprime l'héritage **par implémentation** (une ou plusieurs interfaces).

Un `Shop` hérite donc par extension de `Building` et par implémentation d'`Announcement`.

Une classe qui implémente une interface **doit** définir toutes ses méthodes (avec `@Override`) : l'interface est entièrement abstraite, la classe, elle, est instanciable. L'IDE peut générer les squelettes (*Implement methods*).

On fait de même pour `Field`, qui n'a aucun lien avec `Shop` :

```java
public class Field implements Announcement {
    // ...

    @Override
    public String getTitle() {
        return building == null ? "Terrain nu" : "Terrain avec " + building.specificName();
    }

    @Override
    public String getContent() {
        return "Le terrain a une superficie de " + (width * length) + " m²";
    }
}
```

### Utilisation : une méthode, des classes sans lien

```java
AnnouncementUtils.generate(shop1);    // un Shop est une Announcement
AnnouncementUtils.generate(field1);   // un Field aussi
```

Règle : **là où une interface est attendue, un objet d'une classe qui l'implémente convient.** C'est le polymorphisme, mais sans lien d'extension entre les classes : elles partagent seulement un contrat.

Si on veut générer l'annonce d'un `Housing`, ou de n'importe quel autre type, il suffit que sa classe implémente `Announcement` : on retrouvera obligatoirement `getTitle()` et `getContent()` dans son corps. La méthode `generate` n'a pas besoin d'être modifiée, même pour des classes qui n'existent pas encore.

### Le principe d'abstraction

Dans `generate`, on ne sait **pas qui se cache** derrière l'`Announcement`, mais on a la **garantie** qu'il sait faire `getTitle()` et `getContent()`. L'interface joue ce rôle :

> « Je ne sais pas qui tu es, mais je sais que tu sais faire ça. »

Le code qui utilise l'interface dépend uniquement de ce contrat, pas des classes concrètes. Ce mécanisme est très utilisé : il permet de définir des fonctionnalités qui acceptent des objets de classes pas encore écrites, à condition qu'elles implémentent l'interface.

### Une interface est un type

On peut déclarer une variable du type de l'interface. Elle sera initialisée avec un **objet d'une classe qui l'implémente** (on ne peut pas faire `new` sur une interface) :

```java
Announcement announcement1 = field1;                       // copie de référence
Announcement announcement2 = new Shop(1990, "Boulangerie"); // un vrai Shop, vu comme une Announcement

announcement2.getTitle();      // accessible : défini par l'interface
announcement2.specificName();  // erreur : cannot find symbol (hors du contrat de l'interface)
```

Derrière la variable, c'est un `Shop` qui est réellement créé, mais vu à travers l'interface, on n'accède qu'aux fonctionnalités qu'elle définit. On déclare rarement une variable de cette façon : on utilise surtout le type interface en **paramètre** de méthodes, comme avec `generate`.

### Classe abstraite ou interface ?

| | Classe abstraite | Interface |
|---|---|---|
| Mot-clé | `abstract class` / `extends` | `interface` / `implements` |
| Contenu | attributs, constructeurs, méthodes implémentées, méthodes abstraites | méthodes abstraites (signatures) |
| Nombre par classe | une seule (héritage simple) | plusieurs possibles |
| Instanciation | impossible | impossible |
| Rôle | tronc commun à des classes liées (relation « est un ») | contrat de fonctionnalités, entre classes sans lien |

> Compléments :
> - Une classe peut implémenter plusieurs interfaces, séparées par des virgules : `class Shop extends Building implements Announcement, Comparable<Shop>`.
> - Depuis Java 8, une interface peut aussi contenir des méthodes avec corps (`default` et `static`) et des constantes. Dans ce cours, on se limite au cas des méthodes abstraites.

### Combiner classe abstraite et interface

Classe abstraite et interface ne s'excluent pas : on les utilise souvent ensemble. La classe abstraite factorise ce qui est commun à des classes liées par un « est un », et l'interface exprime un contrat que d'autres classes, sans lien avec elles, peuvent aussi respecter.

Une classe **abstraite** qui implémente une interface n'est **pas obligée** de définir toutes ses méthodes : elle peut en implémenter certaines, celles qui sont communes à toutes ses filles, et laisser les autres à ses filles concrètes.

On peut l'illustrer en **faisant évoluer** le code de la section précédente, où `Shop` déclarait elle-même `implements Announcement` et définissait `getTitle()` et `getContent()`. Si `Housing` doit aussi être une `Announcement`, la même implémentation serait à répéter dans chaque fille de `Building`. Or une partie du contrat est commune à tous les bâtiments : on remonte donc l'implémentation d'`Announcement` dans `Building`.

Avant (section précédente) :

```java
public class Shop extends Building implements Announcement {
    @Override public String getTitle()   { /* ... */ }
    @Override public String getContent() { /* ... */ }
}
```

Après (évolution) :

```java
public abstract class Building implements Announcement {
    // ...

    @Override
    public String getContent() {   // commun à tous les bâtiments : implémenté ici
        return "Construit en " + getConstructionYear() + " (" + getAge() + " ans)";
    }

    // getTitle() n'est pas définie : Building est abstraite, elle n'y est pas obligée
}

public class Housing extends Building {
    @Override
    public String getTitle() {
        return "Habitation avec " + bedroomCount + " chambres";
    }
}

public class Shop extends Building {
    @Override
    public String getTitle() {
        return "Commerce, enseigne " + shopName;
    }
}
```

Les filles n'ont plus besoin d'écrire `implements Announcement` : elles le sont déjà, par héritage de `Building`. Elles doivent en revanche respecter tout le contrat : si `Housing` ne définissait pas `getTitle()`, le code ne compilerait pas (*Housing is not abstract and does not override abstract method getTitle() in Announcement*). Elles héritent en revanche de `getContent()` sans rien écrire.

`Housing`, `Shop` et `Field` (qui n'a aucun lien avec `Building`) sont alors tous des `Announcement` :

```java
AnnouncementUtils.generate(housing1);
AnnouncementUtils.generate(shop1);
AnnouncementUtils.generate(field1);
```

Ce découpage répartit les rôles : la classe abstraite apporte la structure et le comportement commun, l'interface apporte la compatibilité entre des classes sans lien, et le compilateur vérifie que chaque classe concrète fournit tout ce qu'on attend d'elle. Ajouter un nouveau type (un `Chalet`, par exemple) revient à écrire une fille qui complète ce qui manque.

### Choisir la fille à la création, pas dans la classe

Plutôt que de mettre plusieurs comportements dans une même classe, qui se comporterait différemment selon la façon dont ses attributs sont initialisés, on crée une classe fille par comportement. Le choix du type se fait **au moment de la création de l'objet**, et on manipule ensuite l'objet par le type de la classe mère :

```java
Building building;                           // déclaré avant le if (portée) et typé par la mère
if (isShop) {
    building = new Shop(1990, "Boulangerie");
} else {
    building = new Housing(2008, 100, 3);
}
Field field = new Field(10, 20, building);   // une seule fois, quel que soit le type choisi
```

Déclarer `building` avant le `if` évite de dupliquer la suite du code dans chaque branche : c'est le polymorphisme qui permet de n'écrire cette suite qu'une seule fois.

#### Quelques règles pour choisir

- Les classes ont une **structure ou un comportement commun**, avec une relation « est un » : **héritage**, avec une classe abstraite si la mère ne peut pas tout implémenter.
- Des classes **sans lien** doivent pouvoir être utilisées par le même code : **interface**.
- Un attribut de la mère que les filles doivent modifier : le déclarer `protected`. Sinon, le laisser `private` et passer par des accesseurs.
- Le code commun à toutes les filles : le **remonter dans la mère**, par exemple en extrayant une méthode `protected` que les filles appellent.
- Après chaque réorganisation de ce type, **relancer le programme** pour vérifier qu'on n'a rien cassé.

#### Ajouts possibles pour « À retenir »

- Une classe abstraite peut implémenter une interface sans définir toutes ses méthodes : les filles concrètes complètent.
- On choisit la classe fille à la création de l'objet, puis on le manipule par le type de la mère ou de l'interface.

### À retenir

- Une **interface** (`interface`) est un type complètement abstrait : elle liste des méthodes sans corps, toutes publiques (`abstract` et `public` sont implicites).
- Une classe l'**implémente** avec `implements` (héritage par implémentation) et doit **définir toutes ses méthodes**.
- Une classe n'étend qu'**une** classe, mais peut implémenter **plusieurs** interfaces.
- Là où une interface est attendue, on peut passer **un objet de n'importe quelle classe qui l'implémente**, même sans lien d'héritage avec les autres : c'est le polymorphisme par interface.
- Cela évite de surcharger une méthode pour chaque type et permet d'écrire du code qui accepte des classes futures.
- L'interface est un **contrat** : on ne sait pas qui se cache derrière, mais on est sûr qu'il sait faire ce qu'elle déclare.
- On ne peut pas faire `new` sur une interface ; une variable de ce type référence un objet d'une classe qui l'implémente, et n'en voit que les fonctionnalités de l'interface.