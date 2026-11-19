# Patrons de conception, généricité et collections

Ton code fonctionne, mais fonctionner ne suffit pas : il doit aussi être simple à lire, à modifier et à faire évoluer. Ce chapitre présente des solutions éprouvées à des problèmes qui reviennent sans cesse : créer des objets proprement (**Factory**), n'avoir qu'une seule instance (**Singleton**), écrire du code qui marche avec plusieurs types (**généricité**), stocker des objets (**`ArrayList`**) et charger des données depuis un fichier.

Un **patron de conception** (*design pattern*) est une solution éprouvée à un problème de conception récurrent. Ce n'est pas une bibliothèque : c'est une manière d'organiser tes classes, que tu recopies dans ton propre code. Le chapitre suivant complète avec l'immuabilité, les dates et le patron Builder.

## Objectifs

À la fin du chapitre, tu sauras :

* centraliser la création d'objets avec une **Factory** ;
* écrire et utiliser une **classe générique**, et parcourir une `ArrayList` ;
* garantir une instance unique avec un **Singleton** ;
* charger des données depuis un **fichier XML**, et utiliser une IA avec esprit critique.

## Le patron Factory

### Le problème

Dans le jeu, on veut créer un navire d'un type donné : un `Sloop` (sloop, rapide) ou un `Galleon` (galion, puissant). La hiérarchie est celle du chapitre 9 : `Ship` est la classe mère abstraite, `Sloop` et `Galleon` en héritent. Le type demandé arrive sous forme de texte (lu dans un fichier, par exemple) :

```java
Ship ship;
if (type.equals("sloop")) {
    ship = new Sloop(name, builtYear, captain);
} else if (type.equals("galleon")) {
    ship = new Galleon(name, builtYear, captain);
} else {
    throw new IllegalArgumentException("Unknown ship type: " + type);
}
```

Deux problèmes :

* **Une fille est choisie sous condition**, puis vue comme sa classe mère (polymorphisme, chapitre 10). Quelqu'un qui ne connaît pas la règle pourrait créer un `Galleon` là où il fallait un `Sloop`.
* **Le code est dupliqué** à chaque endroit où l'on crée un navire. Si la règle change, il faut la modifier partout.

### La solution en trois étapes

**Étape 1 : extraire le code dans une méthode.** Le nom décrit ce qu'elle fait, les valeurs nécessaires deviennent des paramètres, le résultat est retourné.

**Étape 2 : la déplacer dans une classe dédiée**, la fabrique, rangée dans le même package que `Ship`. La méthode est `public` (appelable partout) et `static` (appelable sans instancier la classe) :

```java
package com.pirates.adventure.model;

public final class ShipFactory {

    private ShipFactory() {
    }

    public static Ship createShip(String type, String name, int builtYear, Captain captain) {
        return switch (type) {
            case "sloop" -> new Sloop(name, builtYear, captain);
            case "galleon" -> new Galleon(name, builtYear, captain);
            default -> throw new IllegalArgumentException("Unknown ship type: " + type);
        };
    }
}
```

**Étape 3 : sécuriser.** `ShipFactory` est une classe utilitaire : elle ne se manipule pas comme un objet. On la protège avec :

* un **constructeur privé** : personne ne peut écrire `new ShipFactory()` ;
* `final` sur la classe : personne ne peut en hériter.

### Empêcher de contourner la fabrique

Rien n'empêche encore d'écrire, ailleurs : `new Galleon("Royal Fortune", 1718, null)`. La fabrique est inutile si on peut la contourner. Il faut changer la visibilité des **constructeurs des filles** :

* `private` est impossible : la fabrique ne pourrait plus les appeler ;
* on utilise la **visibilité package** : aucun mot-clé devant le constructeur (chapitre 8). Seules les classes du **même package** y ont accès.

```java
package com.pirates.adventure.model;

public class Sloop extends Ship {

    Sloop(String name, int builtYear, Captain captain) {   // visibilité package
        super(name, builtYear, captain);
    }
}
```

La fabrique, `Ship`, `Sloop` et `Galleon` sont dans le même package. Depuis un autre package, le compilateur refuse :

```
error: Sloop(String,int,Captain) is not public in Sloop; cannot be accessed from outside package
```

La seule façon d'obtenir un navire est donc :

```java
Ship ship = ShipFactory.createShip("sloop", "Black Wave", 1712, captain);
```

Les constructeurs de `Ship` passent aussi en visibilité package, même si on n'instancie jamais une classe abstraite : l'intention est la même.

> La visibilité package n'interdit rien aux autres classes **du même package** : une classe rangée à côté de la fabrique peut toujours appeler les constructeurs. La protection vaut surtout pour l'extérieur du package, d'où l'importance de bien ranger tes classes.

### Variantes et remarques

* Ici le type est un `String`, pour simplifier. Une faute de frappe (`"galeon"`) ne sera détectée qu'à l'exécution, par l'`IllegalArgumentException`. Dans un vrai programme, on préfère une **énumération** (chapitre 8), qui évite les fautes de frappe.
* Ce patron s'appelle « Simple Factory » ou « Static Factory Method ». Il existe des variantes plus élaborées (Factory Method, Abstract Factory), qui reposent sur l'héritage et les interfaces.
* IntelliJ sait extraire du code dans une méthode (menu **Refactor > Extract Method**) et la déplacer (**Refactor > Move**). Sache faire ces étapes à la main pour comprendre ce que l'outil fait à ta place.

### À retenir

* La Factory centralise la création d'un objet, surtout quand la classe à instancier dépend d'une condition.
* Fabrique : classe `final`, constructeur privé, méthode publique statique.
* Constructeurs des filles en visibilité package, fabrique dans le même package : l'extérieur ne peut créer l'objet qu'en passant par elle.

## La généricité

### Le principe

Tu as déjà utilisé la généricité sans la nommer :

```java
ArrayList<String> messages = new ArrayList<>();
```

Entre chevrons se trouve un **paramètre de type**. La généricité est apparue avec **Java 5** ; la classe `ArrayList` existait avant. Pour comprendre pourquoi on l'a ajoutée, on refait une version simplifiée de `ArrayList`, d'abord sans généricité.

### Avant la généricité

Une liste stocke ses éléments dans un tableau. Comme un tableau a une taille fixe, la liste en recrée un plus grand à chaque ajout :

```java
import java.util.Arrays;

public class MyList {

    private Object[] array = new Object[0];

    public void add(Object element) {
        array = Arrays.copyOf(array, array.length + 1);   // copie avec une case de plus
        array[array.length - 1] = element;
    }

    public Object get(int index) {
        return array[index];
    }
}
```

Le tableau est un `Object[]` : il accepte n'importe quel objet (polymorphisme). Deux problèmes :

1. **À l'ajout, tout est accepté** : `list.add("Doubloon")` comme `list.add(new Item())`.
2. **À la lecture, il faut caster**, sans garantie sur le type réel :

```java
String first = (String) list.get(0);    // fonctionne
String second = (String) list.get(1);   // compile, mais plante à l'exécution
```

```
class Item cannot be cast to class java.lang.String ...
```

Le code compile, mais lève une `ClassCastException` à l'exécution.

### Une classe générique

On déclare un **paramètre de type**, par convention `T`, entre chevrons après le nom de la classe :

```java
public class MyGenericList<T> {

    private Object[] array = new Object[0];

    public void add(T element) {
        array = Arrays.copyOf(array, array.length + 1);
        array[array.length - 1] = element;
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        return (T) array[index];
    }
}
```

* `add` attend un **`T`**, pas un `Object` ;
* `get` retourne un **`T`** : plus de cast pour l'appelant ;
* dans `get`, le cast `(T)` est nécessaire (le tableau est un `Object[]`). Le compilateur ne peut pas le vérifier et émet un avertissement *unchecked cast* ; `@SuppressWarnings("unchecked")` indique que tu l'assumes. Ici il est sûr : seul `add(T)` remplit le tableau.

À l'utilisation, on précise le type :

```java
MyGenericList<String> messages = new MyGenericList<>();
messages.add("Doubloon");
String first = messages.get(0);   // aucun cast
messages.add(new Item());         // error: incompatible types: Item cannot be converted to String
```

| Sans généricité | Avec généricité |
| --- | --- |
| `add(Object)` : tout est accepté | `add(T)` : seul le type attendu est accepté |
| `get` retourne un `Object` | `get` retourne un `T` |
| cast obligatoire | aucun cast |
| erreur à l'**exécution** (`ClassCastException`) | erreur à la **compilation** |

L'intérêt : **déplacer la détection des erreurs de l'exécution vers la compilation**, et écrire une classe **une seule fois** pour tous les types.

### Limiter le type : `T extends`

On peut imposer que `T` soit d'un certain type (classe ou interface) avec `extends`. La cale du navire ne doit contenir que des objets de valeur :

```java
public interface Lootable {
    int value();
}

public record Gold(int value) implements Lootable { }

public class Hold<T extends Lootable> {

    private final List<T> items = new ArrayList<>();

    public void add(T item) {
        items.add(item);
    }

    public int total() {
        int sum = 0;
        for (T item : items) {
            sum += item.value();   // possible : T est forcément un Lootable
        }
        return sum;
    }
}
```

`Hold<Gold>` est accepté, `Hold<String>` est refusé :

```
error: type argument String is not within bounds of type-variable T
```

Dans la classe, on peut appeler `value()` sur un `T`, puisque le compilateur sait que `T` est un `Lootable`. Tu retrouveras `Hold<T extends Item>` dans le kit.

### Remarques

* Conventions : `T` (Type), `E` (Element, pour les collections), `K` et `V` (Key et Value, pour les `Map`).
* Un paramètre de type est une classe ou une interface, **jamais un type primitif** : `ArrayList<Integer>`, pas `ArrayList<int>` (`unexpected type; required: reference; found: int`). La conversion entre `int` et `Integer` est automatique (*autoboxing*).
* L'**opérateur diamant** `<>` (Java 7) évite de répéter le type à droite : `new ArrayList<>()`.

### À retenir

* Une classe générique est paramétrée par un ou plusieurs types écrits entre chevrons.
* Sans généricité, on stockait des `Object` : n'importe quoi à l'ajout, cast et risque de `ClassCastException` à la lecture.
* `T extends Type` limite les types acceptés.
* Les erreurs de type sont détectées à la compilation.

## La classe `ArrayList`

La classe `MyGenericList` n'avait qu'un but pédagogique. Dans la vraie vie, on utilise `ArrayList<E>`, du JDK : `E` est le type des éléments.

```java
ArrayList<Ship> fleet = new ArrayList<>();
```

Elle ne propose que des méthodes manipulant des `Ship` : on n'y ajoute que des navires (donc aussi des `Sloop` et des `Galleon`, grâce au polymorphisme) et on en récupère sans cast.

### Ajouter

* `add(element)` ajoute **à la fin** ;
* `add(index, element)` insère à une position ; `IndexOutOfBoundsException` si elle n'existe pas (`Index: 20, Size: 5`) ;
* `addFirst(element)` et `addLast(element)` ajoutent au début ou à la fin (**Java 21**, ils n'existent pas avant).

### Supprimer

| Méthode | Paramètre | Retour | Particularité |
| --- | --- | --- | --- |
| `remove(int index)` | la position | l'élément supprimé | exception si l'index est invalide (`Index 20 out of bounds for length 5`) |
| `remove(Object o)` | l'objet | `boolean` | `true` si trouvé et supprimé, `false` sinon |

```java
Ship removed = fleet.remove(0);         // par position
boolean found = fleet.remove(someShip); // par objet
```

Autres méthodes courantes : `size()`, `clear()`, `get(index)`, `isEmpty()`.

> **Piège avec `ArrayList<Integer>`** : `remove(1)` appelle la version par **index** (elle supprime la deuxième case), pas la suppression de la valeur `1`. Pour supprimer la valeur, écris `remove(Integer.valueOf(1))`. Test fait : sur `[5, 1, 7]`, `remove(1)` donne `[5, 7]`.

### Une liste contient des références

Une liste est un simple tableau de **références** : les objets ne sont pas dupliqués, ils existent ailleurs en mémoire.

### Parcourir

Boucle `for` classique, avec un indice et `get` :

```java
for (int i = 0; i < fleet.size(); i++) {
    Ship ship = fleet.get(i);
    System.out.println(ship);
}
```

Boucle **foreach**, qui masque l'indice : « pour chaque `ship` dans `fleet` » :

```java
for (Ship ship : fleet) {
    System.out.println(ship);
}
```

Le foreach fonctionne sur toute collection (tout objet itérable).

### Remarques

* La vraie `ArrayList` est plus efficace que notre version : elle réserve une **capacité** supérieure au nombre d'éléments, et ne recopie son tableau que lorsqu'elle est atteinte. Les détails internes peuvent changer d'une version du JDK à l'autre.
* `remove(Object)` (comme `indexOf` et `contains`) s'appuie sur **`equals`** : c'est la raison de bien le redéfinir (chapitre 10, et plus bas dans ce chapitre).
* **Modifier une liste pendant un foreach** lève généralement une `ConcurrentModificationException`. Observé avec `[a, b, c]` : supprimer `"a"` dans la boucle lève l'exception. Mais supprimer `"b"` (l'avant-dernier élément) ne lève rien, et la boucle s'arrête simplement sans voir `"c"` : un bug silencieux. Pour supprimer selon un critère, utilise `removeIf` :

```java
fleet.removeIf(ship -> ship.getBuiltYear() < 1700);   // lambda : voir le chapitre 16
```

* On déclare souvent `List<Ship> fleet = new ArrayList<>();` : on programme vis-à-vis de l'**interface** `List` (chapitre 11), sans dépendre de l'implémentation.

### À retenir

* `ArrayList<E>` est un tableau de références qui s'agrandit tout seul.
* `add` (fin), `add(index, e)`, `addFirst`/`addLast` (Java 21) ; `remove(int)` retourne l'élément, `remove(Object)` retourne un `boolean`.
* On parcourt avec `for` (indice) ou foreach. On ne modifie pas la liste dans un foreach.

## Le patron Singleton

### Le besoin

Le `main` contient encore le jeu de données qui a servi aux tests. On regroupe les données dans une classe, créée **une seule fois**, accessible **partout** :

```java
package com.pirates.adventure.data;

public class GameData {

    private final List<Ship> ships = new ArrayList<>();

    public GameData() {
        // chargement des données
    }

    public List<Ship> getShips() {
        return ships;
    }
}
```

Problème : rien n'empêche d'écrire plusieurs `new GameData()`, donc de **dupliquer** les données. On veut **une seule instance**. C'est le rôle du **Singleton**.

### Mise en place

1. **Constructeur privé** : plus personne ne peut écrire `new GameData()`.
2. **Un attribut `static final`** du type de la classe, qui contient l'unique instance, créé une seule fois au chargement de la classe.
3. **Un accesseur statique** `getInstance()` qui retourne cette instance. Il est `static` pour être appelé depuis le nom de la classe (on ne peut pas créer d'objet pour l'appeler), et donc l'attribut aussi : une méthode statique n'a pas de `this`, elle ne peut utiliser que des éléments statiques.

```java
public class GameData {

    private static final GameData INSTANCE = new GameData();

    private final List<Ship> ships = new ArrayList<>();

    private GameData() {
    }

    public static GameData getInstance() {
        return INSTANCE;
    }

    public List<Ship> getShips() {
        return Collections.unmodifiableList(ships);
    }
}
```

Depuis l'extérieur :

```java
GameData data = GameData.getInstance();
GameData.getInstance().getShips();
GameData other = new GameData();   // error: GameData() has private access in GameData
```

`GameData.getInstance() == GameData.getInstance()` donne `true` : c'est toujours la même référence. Une constante s'écrit en majuscules (`INSTANCE`), chapitre 2.

### Un résumé

Un Singleton, c'est : un **constructeur privé**, un **attribut statique** contenant l'instance, un **accesseur statique**.

### Remarques

* **Initialisation paresseuse** : on crée l'instance au premier appel seulement :

```java
private static GameData instance;

public static GameData getInstance() {
    if (instance == null) {
        instance = new GameData();
    }
    return instance;
}
```

Cette variante n'est **pas sûre** si plusieurs threads l'appellent en même temps (deux instances pourraient être créées). L'initialisation précoce du dessus n'a pas ce défaut.

* `getShips()` retourne ici `Collections.unmodifiableList(...)` : une **vue en lecture seule**. Sans cela, n'importe quelle classe pourrait ajouter ou supprimer des navires. Tester l'ajout à cette vue lève une `UnsupportedOperationException`.
* Le Singleton est très répandu mais **critiqué** : il crée un **état global** partagé, un couplage fort entre les classes, et complique les tests. À utiliser avec discernement (dans le kit, uniquement pour la configuration de la partie).

### À retenir

* Singleton : une seule instance, accessible partout. Constructeur privé + `static final` + `getInstance()`.
* Une méthode statique n'utilise que des éléments statiques.
* Expose les collections en lecture seule.

## Charger des données depuis un fichier XML

### Le besoin

Les navires sont écrits en dur dans le code. On veut les lire dans un **fichier XML** :

```xml
<ships>
    <sloop>
        <name>Black Wave</name>
        <builtYear>1712</builtYear>
        <captain><name>Anne Bonny</name><age>32</age><flag>Skull</flag></captain>
    </sloop>
    <galleon>
        <name>Royal Fortune</name>
        <builtYear>1718</builtYear>
        <captain><name>Jack Rackham</name><age>40</age><flag>Crossed Swords</flag></captain>
    </galleon>
    <sloop>
        <name>Sea Wolf</name>
        <builtYear>1720</builtYear>
        <captain><name>Anne Bonny</name><age>32</age><flag>Skull</flag></captain>
    </sloop>
</ships>
```

Le nom de la balise (`sloop`, `galleon`) correspond au type attendu par la fabrique.

### Où ranger le fichier ?

Un fichier de données n'est pas du code Java. Dans un projet **Maven**, il va dans **`src/main/resources`** : ce dossier est déjà reconnu par IntelliJ comme dossier de ressources. Son contenu est placé sur le **classpath** et lu avec `getResourceAsStream`, ce qui évite les chemins qui dépendent de l'endroit où on lance le programme.

```
src/main/java/...      le code
src/main/resources/ships.xml
```

(Dans un projet IntelliJ sans Maven, on crée un dossier `res` et on le marque comme dossier de ressources : **clic droit > Mark Directory as > Resources Root**.)

### Utiliser une IA pour trouver la solution

Pour lire un fichier XML, il faut connaître l'API adaptée. Un assistant d'IA permet d'avancer vite sur un sujet qu'on ne maîtrise pas, **à condition de bien s'y prendre** :

1. **Une question simple** (« comment lire un fichier XML en Java ? ») : tu obtiens un panorama, par exemple **DOM** (le fichier est entièrement chargé en mémoire sous forme d'arbre) et **SAX** (lecture en flux).
2. **Du contexte** : la signature voulue, un extrait du fichier (complet, correctement fermé), les classes de ton programme. L'IA ne peut deviner que ce que tu lui montres : un fichier qui ne contient qu'un seul type de navire donnera un code qui ne distingue pas les deux types.
3. **Itérer** : décris la hiérarchie (`Ship`, `Sloop`, `Galleon`), fournis un fichier avec les deux types, et demande de corriger.

Ne transmets **jamais de données confidentielles** : un extrait fictif suffit.

### Garder un regard critique

Le code généré ne s'intègre **jamais tel quel** : tu le lis, tu le comprends, tu le testes. Une IA propose souvent du code qui duplique la lecture des informations communes, ou qui crée les objets directement avec `new` alors que tu as une fabrique. Voici une version corrigée, qui s'appuie sur `ShipFactory` :

```java
public final class ShipXmlParser {

    private ShipXmlParser() {
    }

    public static void load(String resource, List<Ship> ships)
            throws IOException, SAXException, ParserConfigurationException {
        List<Captain> captains = new ArrayList<>();

        try (InputStream in = ShipXmlParser.class.getResourceAsStream(resource)) {
            if (in == null) {
                throw new FileNotFoundException("Resource not found: " + resource);
            }
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            Document document = factory.newDocumentBuilder().parse(in);

            NodeList children = document.getDocumentElement().getChildNodes();
            for (int i = 0; i < children.getLength(); i++) {
                if (children.item(i) instanceof Element element) {
                    Captain captain = readCaptain(element);
                    // ...voir « Le piège des doublons » ci-dessous
                    String type = element.getTagName();   // "sloop" ou "galleon"
                    ships.add(ShipFactory.createShip(type, text(element, "name"),
                            Integer.parseInt(text(element, "builtYear")), captain));
                }
            }
        }
    }

    private static String text(Element element, String tagName) {
        return element.getElementsByTagName(tagName).item(0).getTextContent();
    }
}
```

Ce qu'il faut comprendre :

* classe utilitaire : `final`, constructeur privé, méthode publique statique ;
* le **DOM parser** s'utilise en trois temps : une `DocumentBuilderFactory` fournit un `DocumentBuilder`, dont la méthode `parse` lit la source et retourne le document ;
* on boucle sur les enfants de la racine ; le test `instanceof Element` ignore les nœuds de texte (les retours à la ligne entre les balises) ;
* la lecture du texte est écrite **une seule fois** (`text`), et c'est la **fabrique** qui choisit la classe à instancier ;
* les exceptions sont **précises** (chapitre 12), pas un `throws Exception` générique ;
* `try-with-resources` ferme le flux (chapitre 12).

> **Sécurité.** Avec JDK 21, le DOM parser par défaut **résout les entités externes** : un fichier XML malveillant avec `<!ENTITY e SYSTEM "file:///etc/hostname">` fait lire un fichier de ta machine (test fait). `FEATURE_SECURE_PROCESSING` bloque cet accès (`SAXParseException`). Pour les fichiers qui ne sont pas à toi, on interdit même les déclarations `DOCTYPE` avec `setFeature("http://apache.org/xml/features/disallow-doctype-decl", true)`.

### Le piège des doublons

Dans le fichier, le capitaine Anne Bonny commande deux navires, décrit à chaque fois avec les mêmes informations. C'est la **même personne** : on veut que les deux navires référencent le **même objet** `Captain`, pas deux copies. Logique à ajouter dans la boucle :

```java
Captain captain = readCaptain(element);
int index = captains.indexOf(captain);
if (index != -1) {
    captain = captains.get(index);   // déjà présent : on réutilise l'objet existant
} else {
    captains.add(captain);           // nouveau : on l'ajoute à la liste
}
```

La logique est bonne, mais sans rien d'autre elle **ne marche pas** : la liste contient trois capitaines. `indexOf` retourne toujours `-1`.

`indexOf` parcourt la liste et appelle **`equals`** sur chaque élément. Or `equals` n'est pas redéfini dans notre classe : c'est celle d'`Object`, qui compare les **références**. Chaque capitaine est créé par un `new` distinct, donc `equals` répond toujours `false`. (Test : `indexOf` sur une classe sans `equals` retourne `-1` ; sur un `record`, qui génère `equals`, il retourne `0`.)

La correction n'est pas dans `load` : il faut dire **quand deux capitaines sont égaux**. `Captain` hérite de `Pirate` (nom, âge) : on définit d'abord l'égalité des pirates, puis on complète pour le capitaine :

```java
// classe Pirate
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    Pirate pirate = (Pirate) o;
    return age == pirate.age && Objects.equals(name, pirate.name);
}

@Override
public int hashCode() {
    return Objects.hash(name, age);
}

// classe Captain
@Override
public boolean equals(Object o) {
    if (!super.equals(o)) return false;      // même type, même nom, même âge
    Captain captain = (Captain) o;
    return Objects.equals(flag, captain.flag);
}

@Override
public int hashCode() {
    return Objects.hash(super.hashCode(), flag);
}
```

`Objects.equals` compare deux valeurs en se protégeant d'une `NullPointerException`. Le test `getClass() != o.getClass()` dans `Pirate` garantit que le cast dans `Captain` est sûr. IntelliJ génère ces méthodes avec **Alt + Insert > equals() and hashCode()** (le menu Generate que tu as déjà vu) : tu choisis les attributs.

Résultat : avec le fichier d'exemple, on obtient **3 navires** et **2 capitaines**, et les deux navires d'Anne Bonny partagent le même objet (même identité). Le bug ne venait pas du code qu'on regardait : c'est l'absence de `equals` dans une autre classe qui faussait le résultat.

### Remarques

* DOM, SAX et StAX sont fournis avec le JDK, sans dépendance externe. DOM est simple pour de petits fichiers ; SAX et StAX conviennent mieux aux fichiers volumineux.
* `indexOf`, `contains` et `remove(Object)` s'appuient tous sur `equals`. Avec beaucoup d'éléments, une `Map` ou un `Set` (qui s'appuient sur `hashCode`) sont plus efficaces qu'un `indexOf`, qui parcourt toute la liste.

### À retenir

* Un fichier de données se range dans le dossier de ressources (`src/main/resources` avec Maven), lu par le classpath.
* Une IA est un bon point de départ pour découvrir une API : question simple, contexte, itération. Son code se lit, se comprend, se teste, se corrige.
* Les méthodes de recherche des collections utilisent `equals` : sans redéfinition, deux objets de même contenu ne sont jamais égaux.
* Quand un objet est partagé, on réutilise la référence existante plutôt que d'en créer une copie.
* Un parseur XML se configure en mode sécurisé.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| `new Sloop(...)` hors du package | `Sloop(...) is not public in Sloop; cannot be accessed from outside package` | Passer par la fabrique. |
| `new GameData()` avec un Singleton | `GameData() has private access in GameData` | Utiliser `getInstance()`. |
| Ajouter un type invalide à une liste générique | `incompatible types: X cannot be converted to Y` | La généricité fait son travail. |
| `ArrayList<int>` | `unexpected type; required: reference; found: int` | Utiliser `Integer`. |
| `Hold<String>` avec `T extends Lootable` | `type argument String is not within bounds of type-variable T` | Respecter la borne. |
| `remove(1)` sur une `ArrayList<Integer>` | supprime la case 1, pas la valeur | `remove(Integer.valueOf(1))`. |
| Supprimer dans un foreach | `ConcurrentModificationException`, ou saut silencieux | `removeIf`, ou un itérateur. |
| `indexOf` / `contains` qui ne trouvent rien | toujours `-1` / `false` | Redéfinir `equals` et `hashCode`. |
| Parseur XML sans configuration | lecture de fichiers locaux possible | `FEATURE_SECURE_PROCESSING`. |

## À retenir

* **Factory** : centralise la création, constructeurs en visibilité package. **Singleton** : une instance, accessible partout (à utiliser avec discernement).
* **Généricité** : on écrit la classe une fois, les erreurs de type sont détectées à la compilation. `T extends` limite le type.
* **`ArrayList<E>`** : tableau de références qui s'agrandit. Redéfinir `equals` pour que `indexOf`, `contains` et `remove(Object)` fonctionnent.
* Un fichier de données se range dans `src/main/resources` ; une IA aide à découvrir une API, mais son code se lit, se teste, se corrige.

## À toi de jouer

1. Écris `Ship`, `Sloop`, `Galleon` et `ShipFactory` dans le même package. Vérifie que `new Sloop(...)` ne compile pas depuis un autre package, puis remplace le `String` du type par une énumération.
2. Écris `MyList` (avec `Object`), provoque une `ClassCastException`, puis écris `MyGenericList<T>` et constate que l'erreur devient une erreur de compilation.
3. Écris `Hold<T extends Lootable>` avec `Gold` et `Rum`. Essaie `Hold<String>` et lis l'erreur. Ajoute une méthode qui retourne l'objet le plus précieux.
4. Remplis une `ArrayList<Ship>`, parcours-la avec les deux boucles, puis supprime les navires construits avant 1700 d'abord avec un foreach (observe), puis avec `removeIf`.
5. Teste `remove(1)` et `remove(Integer.valueOf(1))` sur une `ArrayList<Integer>`.
6. Écris `GameData` en Singleton. Vérifie que `getInstance() == getInstance()`, puis tente `new GameData()`. Retourne la liste avec `Collections.unmodifiableList` et tente un `add`.
7. Place `ships.xml` dans `src/main/resources`, écris `ShipXmlParser.load` et affiche le nombre de navires et de capitaines. **Avant** de redéfinir `equals`, combien de capitaines obtiens-tu ? Après ?
8. Teste ton parseur avec un fichier XML contenant une entité externe (vers un fichier sans importance) avec et sans `FEATURE_SECURE_PROCESSING`.

## Pour aller plus loin

* [Dev.java : introduction à la généricité](https://dev.java/learn/language/fp/generics/intro/).
* [Dev.java : le Collections Framework et les listes](https://dev.java/learn/api/collections-and-streams/collections-framework/lists/).
* [API Java SE 21 : `ArrayList`](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html).
