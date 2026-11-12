# POO : Le Polymorphisme

## Le Principe du Polymorphisme

### Définition

Le **polymorphisme** (du grec *poly* : plusieurs, *morphê* : forme) est un concept de la programmation orientée objet qui **existe grâce à l'héritage** : un objet peut être vu sous **plusieurs formes**.

> Sans héritage, il n'y a pas de polymorphisme.

Concrètement, une variable du type de la **classe mère** a le droit de référencer un objet d'une de ses **classes filles**.

On reprend les classes du chapitre précédent : `Housing` et `Shop` héritent de `Building`, qui possède une méthode `display()` redéfinie dans `Housing`. Un `Field` (terrain) est composé d'un `Building`.

### Rappel : affecter une référence ne crée pas d'objet

```java
Building building1 = new Building(1992);
Building building2 = building1;   // copie de la référence : pas de new, pas de nouvel objet
```

`building2` pointe vers **le même objet** que `building1`. Aucune allocation mémoire n'a lieu : seule la référence est copiée.

### Une variable de type mère peut référencer une fille

```java
Housing housing1 = new Housing(2008, 100, 3);
Building building2 = housing1;   // compile : un Housing est un Building
```

Là encore, c'est une **copie de référence** : aucun objet n'est créé. Il n'y a en mémoire qu'**un seul objet**, un `Housing`, mais deux variables qui le référencent :

```
  housing1  ──┐
              ├──▶ [ objet Housing | constructionYear, area, bedroomCount ]
  building2 ──┘
```

- `housing1` voit l'objet **sous la forme d'un `Housing`** : accès à `getArea()`, `getBedroomCount()`, `display()`, et aux méthodes héritées.
- `building2` le voit **sous la forme d'un `Building`** : accès seulement à `display()`, `getAge()`, `getConstructionYear()`, c'est-à-dire aux membres définis dans `Building`.

Il y a donc une **perte de visibilité**, mais **aucune perte en mémoire** : l'objet reste un `Housing` complet, c'est seulement la variable qui limite ce qu'on peut faire avec lui.

```java
building2.getAge();        // méthode de Building, non redéfinie : version héritée
building2.getArea();       // erreur : cannot find symbol : un Building ne connaît pas getArea()
```

### Ce qui est appelé à l'exécution : la méthode de l'objet réel

Que se passe-t-il quand on appelle une méthode **redéfinie** par la fille ?

```java
building2.display();   // la méthode display() de Housing est exécutée
```

Le code compile parce que `display()` existe dans `Building`. Mais à l'**exécution**, c'est la version de l'objet réellement présent en mémoire qui est jouée : celle de `Housing`, puisque c'est un `Housing` qui se cache derrière.

| | Type de la variable | Type réel de l'objet |
|---|---|---|
| Rôle | détermine **ce qu'on peut appeler** (compilation) | détermine **quelle version** est exécutée (exécution) |
| Pour `building2` | `Building` | `Housing` |

Le polymorphisme est donc un mécanisme qui permet de manipuler, **sous la forme de la classe mère**, un objet qui est en réalité du type de la fille.

Il fonctionne avec **n'importe quelle fille** :

```java
Building b1 = new Housing(2008, 100, 3);
Building b2 = new Shop(1990, "Boulangerie");
```

Écrit ainsi, il n'a pourtant **pas d'intérêt** : on crée un `Housing` et on le référence tout de suite sous une forme appauvrie. Quand on connaît le type précis, on le déclare tel quel (`Housing housing1 = new Housing(...)`) pour accéder à toutes ses méthodes. L'intérêt du polymorphisme est ailleurs.

### À quoi ça sert : « là où une mère est attendue, une fille convient »

Le constructeur de `Field` attend un `Building` (composition) :

```java
public Field(int width, int length, Building building) { ... }
```

Grâce au polymorphisme, on peut lui passer un `Building`, mais aussi un `Housing` ou un `Shop` :

```java
Field field1 = new Field(10, 20, new Housing(2008, 100, 3));
Field field2 = new Field(10, 20, new Building(1992));
```

On n'écrit **qu'un seul constructeur**, au lieu d'un par type de bâtiment (`Housing`, `Shop`, et toute future fille). Dans `Field`, on manipule un `Building` sans savoir précisément lequel : lorsqu'on appelle `building.display()`, c'est la méthode de l'objet réel qui s'exécute, redéfinie ou non.

Règle générale : **partout où un objet du type de la classe mère est attendu** (paramètre de méthode ou de constructeur, attribut, variable, valeur de retour), on peut fournir un objet d'une classe fille.

### Exemple : une méthode polymorphe

```java
public static void show(Building building) {
    building.display();
}

show(new Building(1992));            // display() de Building
show(new Housing(2008, 100, 3));     // display() de Housing (redéfinie)
show(new Shop(1990, "Boulangerie")); // display() de Building (Shop ne la redéfinit pas : version héritée)
```

Une seule méthode suffit pour les trois types. Le polymorphisme est **écrit à la définition** de la méthode (on déclare un `Building`) mais **joué à l'exécution**, selon l'objet réellement passé.

### Polymorphisme et surcharge

Sans polymorphisme, il faudrait trois méthodes **surchargées**, une par type :

```java
public static void show(Building building) { ... }
public static void show(Housing housing) { ... }
public static void show(Shop shop) { ... }
```

Cela compile, et Java choisit la méthode correspondant au **type de la variable** passée en argument. Mais le code est redondant. Attention : si on référence un `Housing` par une variable de type `Building`, c'est `show(Building)` qui est choisie, et si cette méthode n'existe pas, le code ne compile pas (il n'existe pas de méthode attendant un `Building`).

### Le polymorphisme ne fonctionne que dans un sens

L'héritage va de la fille vers la mère, et le polymorphisme aussi :

- **Fille → mère** (autorisé) : un `Housing` peut être utilisé là où un `Building` est attendu.
- **Mère → fille** (interdit) : un `Building` ne peut pas être utilisé là où un `Housing` est attendu.

```java
Housing housing2 = new Building(1992);   // erreur : incompatible types : Building cannot be converted to Housing

Building building3 = new Housing(2008, 100, 3);
Housing housing3 = building3;            // ne compile pas, même si c'est réellement un Housing
```

Dans le second cas, le compilateur ne regarde que le **type de la variable** (`Building`) : il ne peut pas être sûr qu'il s'agit d'un `Housing`. C'est une des raisons pour lesquelles on **type les objets aussi précisément qu'ils le sont** quand on le peut.

### Retrouver la fille : `instanceof` et le transtypage

Dans une méthode qui reçoit un `Building`, on ne peut pas appeler `getBedroomCount()` : l'objet reçu n'est pas forcément un `Housing`. Pour appliquer un comportement propre à un type plus précis (on parle de **particularisation**), on procède en deux temps :

1. **Tester** le type réel avec `instanceof` ;
2. **Transtyper** (*cast*) la référence vers le type précis, en plaçant le type entre parenthèses.

```java
public static void show(Building building) {
    building.display();

    if (building instanceof Housing) {
        Housing housing = (Housing) building;   // cast : on revient à la forme Housing
        System.out.println(housing.getBedroomCount());
    }
}
```

- `building instanceof Housing` est vrai **seulement si** l'objet réellement présent en mémoire est un `Housing` (ou une fille de `Housing`).
- Le **cast** `(Housing) building` est une affirmation faite au compilateur : « fais-moi confiance, c'est bien un `Housing` ». Il est obligatoire pour aller de la mère vers la fille.

Une seule méthode attend la classe mère, tout en permettant un comportement spécifique à un type plus précis.

### Le test `instanceof` est indispensable

Sans le test, le code compile, car le compilateur autorise le cast. Mais à l'exécution :

- si on passe un `Housing`, le cast réussit ;
- si on passe un simple `Building` (ou un `Shop`), le programme s'arrête avec une exception :

```
Exception in thread "main" java.lang.ClassCastException:
class Building cannot be cast to class Housing
```

Ce serait le pire scénario : un programme qui fonctionne dans un cas et plante dans un autre. Le test n'est pas obligatoire pour **compiler**, mais il l'est **en pratique** : c'est la responsabilité du développeur.

> Complément : depuis Java 16, la syntaxe *pattern matching* regroupe le test et le cast : `if (building instanceof Housing housing) { housing.getBedroomCount(); }`. Le vocabulaire courant : passer de la fille à la mère est du *upcasting* (implicite, toujours sûr), de la mère à la fille du *downcasting* (explicite, risqué).

### À retenir

- Le polymorphisme repose sur l'**héritage** : un objet de type fille peut être référencé par une variable de type mère.
- Affecter une référence ne crée pas d'objet : il n'y a toujours qu'un objet en mémoire, vu sous une autre **forme**.
- Le **type de la variable** détermine ce qu'on peut appeler (compilation) ; le **type réel de l'objet** détermine la version de la méthode exécutée (exécution). Si la fille a redéfini la méthode, c'est la sienne qui est appelée.
- Intérêt principal : **une seule méthode ou un seul constructeur** (`Field(…, Building)`) accepte la mère et toutes ses filles, présentes et futures.
- Le polymorphisme ne marche que de la **fille vers la mère**. Pour revenir à la fille : `instanceof` pour tester, puis cast.
- Un cast sans test préalable risque une `ClassCastException`.

## La classe `Object`

### Un constat : `println` accepte n'importe quel objet

```java
Building building1 = new Building(1992);
Housing housing1 = new Housing(2008, 100, 3);
Field field1 = new Field(10, 20, building1);

System.out.println(building1);
System.out.println(housing1);
System.out.println(field1);
```

Ce code compile quel que soit l'objet passé, et affiche quelque chose en console : le nom de la classe, un `@`, puis une valeur étrange (par exemple `Building@1b6d3586`). Deux questions se posent :

1. **Comment `println` accepte-t-elle n'importe quel objet ?** Le polymorphisme suppose un lien d'héritage, or `Field` n'hérite pas de `Housing`. Et `println` existe depuis longtemps : elle ne peut pas avoir été écrite pour attendre un `Building`, une classe que nous venons de créer.
2. **D'où vient cet affichage** (`Building@1b6d3586`) ? (réponse dans la section sur `toString`).

La Javadoc de `println` donne la réponse à la première : la méthode attend en paramètre un **`Object`**.

### `Object` : la classe mère de toutes les classes

`java.lang.Object` est la **racine** de la hiérarchie de classes en Java : toute classe en hérite, **directement ou indirectement**.

Pourtant, on n'écrit jamais `extends Object` : si une classe n'étend aucune autre classe, le compilateur ajoute **implicitement** `extends Object`.

```java
public class Building { ... }
// équivaut à :
public class Building extends Object { ... }   // IntelliJ signale que c'est redondant
```

`Housing` étend `Building`, qui étend `Object` : `Housing` hérite donc aussi d'`Object`. Une classe n'a qu'un seul parent direct (héritage **simple**), mais elle hérite de toute la **chaîne** de ses ancêtres.

```
Object
  └── Building
        ├── Housing
        └── Shop
```

On fait donc de l'héritage **depuis le début**, sans l'avoir écrit. Dans IntelliJ, `Ctrl + H` sur une classe affiche sa hiérarchie (par exemple `Housing → Building → Object`).

### Le constructeur d'`Object`

Le constructeur de la mère est toujours appelé (chapitre sur l'héritage). Pour une classe sans mère explicite, c'est donc **le constructeur par défaut d'`Object`** (sans paramètre) qui est appelé implicitement :

```java
public Building(int constructionYear) {
    // super();   ← ajouté implicitement : appelle le constructeur d'Object
    this.constructionYear = constructionYear;
}
```

Créer un `Building` revient donc d'abord à construire sa partie `Object` (d'après la Javadoc, ce constructeur « crée un nouvel objet », ce qui revient à réserver l'espace mémoire), puis à renseigner l'année de construction. On n'écrit généralement ni l'extension, ni cet appel : mais il faut savoir qu'ils existent.

### L'explication de `println` : le polymorphisme

La méthode `println` possède une version déclarée avec un paramètre de type `Object` :

```java
public void println(Object x) { ... }
```

Puisque **toutes** les classes héritent d'`Object`, un `Building`, un `Housing`, un `Field` ou n'importe quel objet peut lui être passé : c'est le polymorphisme, avec la classe mère la plus générale possible. Une seule méthode, écrite bien avant notre code, accepte tous les objets, y compris ceux que nous n'avons pas encore créés.

### Ce que tous les objets savent faire

Une classe hérite des **méthodes** de ses ancêtres. En tapant `building1.` dans l'IDE, on voit, en plus des méthodes de `Building`, des méthodes qui ne sont écrites nulle part dans notre code : ce sont celles d'`Object`. Un `Field`, un `Housing` ou toute autre classe disposent exactement des mêmes.

Parmi elles, trois nous intéressent particulièrement et sont l'objet des sections suivantes :

| Méthode | Rôle |
|---|---|
| `toString()` | représentation textuelle de l'objet (c'est ce que `println` utilise) |
| `equals(Object)` | comparaison de deux objets |
| `hashCode()` | code numérique associé à l'objet |

Ces méthodes ont un comportement par défaut, peu utile en général. Chaque classe peut donc les **redéfinir** (`@Override`) pour fournir un comportement adapté.

> Complément : `Object` définit aussi `getClass()` (retourne la classe réelle de l'objet), ainsi que `clone()`, `wait()`, `notify()` et `notifyAll()` (liés à la copie et aux threads, rarement utilisés dans un premier temps).

### À retenir

- `Object` est la classe mère de **toutes** les classes. Une classe sans `extends` étend implicitement `Object`.
- L'héritage est **simple** (un seul parent direct), mais forme une **hiérarchie** dont `Object` est la racine.
- Le constructeur d'`Object` est appelé implicitement au sommet de la chaîne de constructeurs.
- Une méthode qui attend un `Object` accepte n'importe quel objet : c'est le polymorphisme, et c'est pourquoi `println` fonctionne avec tous les types.
- Tout objet dispose des méthodes d'`Object`, notamment `toString()`, `equals()` et `hashCode()`, qu'on peut redéfinir.


## La méthode `toString`

### D'où vient l'affichage `Building@1b6d3586` ?

`println(Object)` ne peut utiliser, sur l'objet reçu, que ce que la classe `Object` définit. Voici son fonctionnement :

1. `println(Object x)` convertit `x` en chaîne avec la méthode statique `String.valueOf(x)`, puis affiche cette chaîne.
2. `String.valueOf(x)` retourne la chaîne `"null"` si `x` vaut `null` ; sinon, elle appelle **`x.toString()`**.
3. `toString()` est une méthode de `Object`, donc tout objet en dispose.

La Javadoc et le code de `Object.toString()` expliquent le format observé :

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

Le résultat est le **nom de la classe**, un `@`, puis la **valeur de hachage** (`hashCode()`, une empreinte entière de l'objet, détaillée dans la dernière section) écrite en hexadécimal. Ce n'est donc pas « la référence de l'objet » ni son adresse mémoire, contrairement à ce qu'on entend parfois.

### Redéfinir `toString`

`toString()` n'est pas `final` : une classe fille peut la **redéfinir**, comme n'importe quelle méthode héritée (voir la section sur `@Override`). Et grâce au polymorphisme, `println` appelle la version de l'objet réellement passé.

```java
public class Building {
    // ...
    @Override
    public String toString() {
        return "Ce bâtiment a été construit en " + constructionYear;
    }
}
```

```java
System.out.println(building1);   // Ce bâtiment a été construit en 2010
System.out.println(housing1);    // un Housing est un Building : il hérite de cette version
System.out.println(field1);      // Field n'a pas redéfini toString : Field@... (version d'Object)
```

Ici, on **n'appelle pas** `super.toString()` : le parent (`Object`) donnerait `Building@...`, qui n'aurait aucun intérêt. On redéfinit donc entièrement le comportement.

Pour `Housing`, au contraire, on **réutilise** la version de la mère puis on la complète :

```java
public class Housing extends Building {
    // ...
    @Override
    public String toString() {
        return super.toString() + ". C'est une habitation de " + area
                + " m² avec " + bedroomCount + " chambres";
    }
}
```

```java
System.out.println(housing1);
// Ce bâtiment a été construit en 2008. C'est une habitation de 100 m² avec 3 chambres
```

Dans IntelliJ, taper `t` dans le corps de la classe propose de redéfinir `toString()` ; le menu *Code → Generate → toString()* permet aussi de la générer à partir des attributs choisis.

### `println` : la version `String` et la version `Object`

`println` est **surchargée** : ce n'est pas la même méthode qui est appelée selon l'argument.

```java
System.out.println(building1.toString());   // println(String) : on convertit nous-mêmes
System.out.println(building1);              // println(Object) : toString() est appelée pour nous
```

Les deux lignes affichent exactement la même chose : l'appel explicite à `toString()` est **redondant** (IntelliJ le signale).

Dans la classe `Building`, on peut ainsi éviter une duplication. Si `display()` écrit le même texte que `toString()`, elle peut simplement afficher l'objet courant :

```java
public void display() {
    System.out.println(this);   // this est l'objet courant : println appelle sa toString()
}
```

### `toString` n'est pas appelée « par magie »

`toString()` est une méthode ordinaire. Elle n'est appelée que si du code l'appelle, ici `String.valueOf`, utilisé par `println`. Autrement dit, on ne peut pas affecter un objet à une `String` en espérant qu'il se convertisse tout seul :

```java
String str = building1;               // erreur : incompatible types : Building cannot be converted to String
String str = building1.toString();    // appel explicite
```

### La concaténation avec `+`

L'opérateur `+` appelle aussi `toString()`, mais seulement quand **l'un des deux opérandes est une `String`** :

```java
String text = "Bâtiment : " + building1;      // équivaut à "Bâtiment : " + building1.toString()
String text2 = "" + building1;                // astuce pour obtenir une String
Object o = building1 + building1;             // erreur : bad operand types for binary operator '+'
Object o2 = building1.toString() + building1; // on est revenu à String + Object
```

- Java connaissait l'opérateur `+` avant la création de `Building` : il ne peut donc pas connaître notre type. Il sait seulement traiter un `Object` à droite, en lui appliquant `toString()`.
- Il n'existe pas d'opérateur `+` entre deux objets quelconques : l'un des deux doit être une `String`.

### À retenir

- `Object.toString()` retourne `nomDeLaClasse@valeurDeHachageEnHexadécimal`. C'est ce que `println(objet)` affiche par défaut.
- `println(Object)` appelle `String.valueOf(x)`, qui retourne `"null"` si `x` est `null`, sinon `x.toString()`.
- `toString()` n'est pas `final` : on la redéfinit (`@Override`) pour donner une représentation lisible de l'objet. Le polymorphisme garantit que la version de l'objet réel est utilisée.
- Dans une fille, `super.toString()` permet de réutiliser et compléter la version de la mère. Si la mère est `Object`, on préfère généralement ne pas l'appeler.
- Pas besoin d'écrire `.toString()` pour `println(objet)` ni pour une concaténation avec une `String` : elle est appelée automatiquement.
- `toString()` reste une méthode comme une autre : elle n'est jamais appelée sans que du code l'appelle.


## Les méthodes `equals` et `hashCode`

### `==` compare des références, pas des états

```java
Building building1 = new Building(2010);
Building building2 = new Building(2010);

building1 == building2;   // false
```

Pour des objets, `==` teste si les deux variables **référencent le même objet en mémoire**. Ici, `new` a été appelé deux fois : il y a deux objets, à deux endroits différents, même s'ils ont exactement les mêmes valeurs.

```java
Building building3 = building1;   // copie de référence
building3 == building1;           // true : même objet
```

On réserve donc `==` aux **types primitifs** (et aux comparaisons de références, `== null` par exemple). Pour savoir si deux objets sont **dans le même état**, on utilise la méthode `equals`.

### `equals` dans `Object`

`equals(Object)` est une méthode d'`Object` : tous les objets en héritent. Mais la version d'`Object` ne fait que ce que fait `==` (elle retourne `true` seulement pour le même objet) :

```java
building1.equals(building2);   // false, même avec le même état
```

Pour comparer les états, il faut la **redéfinir**, comme on l'a fait pour `toString`.

### Redéfinir `equals` dans `Building`

La signature doit respecter celle de la mère : `public boolean equals(Object o)`. Le paramètre est un `Object`, pas un `Building`. Avec `@Override`, le compilateur le vérifie : un `equals(Building b)` serait une **surcharge**, pas une redéfinition. La méthode reste générale (polymorphisme) : on peut lui passer n'importe quel objet.

On écrit le corps étape par étape :

```java
@Override
public boolean equals(Object o) {
    if (this == o) {                       // 1. même objet : forcément égaux
        return true;
    }
    if (o == null) {                       // 2. null n'est jamais égal à this
        return false;
    }
    if (getClass() != o.getClass()) {      // 3. types différents : pas égaux
        return false;
    }
    Building building = (Building) o;      // 4. cast sûr : le type a été vérifié
    return constructionYear == building.constructionYear;   // 5. comparaison de l'état
}
```

1. **Même référence** : `this == o` → `true`, inutile d'aller plus loin.
2. **`o` est `null`** → `false` (`this` ne peut pas être `null`, puisqu'il appelle la méthode).
3. **Types différents** → `false`. `getClass()` retourne le type **réel** de l'objet : si les classes diffèrent, les objets ne peuvent pas être égaux.
4. **Cast** : sans risque de `ClassCastException`, car l'étape 3 a écarté les autres types.
5. **Comparaison des attributs** qui définissent l'égalité. Ici, un `Building` est défini par son année de construction.

```java
new Building(2010).equals(new Building(2010));   // true : deux objets, même état
new Building(2010).equals(new Building(2012));   // false
```

### Redéfinir `equals` dans une fille : `Shop`

Sans redéfinition, `Shop` hérite de l'`equals` de `Building`, qui ne compare que l'année de construction :

```java
Shop shop1 = new Shop(1990, "Boulangerie");
Shop shop2 = new Shop(1990, "Pharmacie");
shop1.equals(shop2);   // true (incorrect) : deux commerces différents, construits la même année
```

Il faut donc la redéfinir dans `Shop`, avec la même signature. Les trois premiers tests sont identiques. Ensuite, on commence par **déléguer à la mère** pour la partie qui la concerne, puis on compare ce que `Shop` ajoute :

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    if (!super.equals(o)) return false;          // l'état hérité (année) est-il identique ?
    Shop shop = (Shop) o;
    return Objects.equals(shopName, shop.shopName);
}
```

### Comparer des objets avec `Objects.equals`

Dans l'exemple, `shopName` est une `String`, donc un **objet** : on ne la compare pas avec `==`, mais avec `equals`. C'est la version de `String` qui est utilisée, et qui compare le **contenu**.

Un piège : `shopName.equals(shop.shopName)` provoque une **`NullPointerException`** si `shopName` vaut `null`, puisqu'on appelle une méthode sur `null`. Pourtant, deux commerces sans enseigne sont dans le même état, et on voudrait obtenir `true`, pas un plantage.

La classe utilitaire **`java.util.Objects`** (avec un `s`) fournit la méthode statique `Objects.equals(a, b)`, qui gère `null` : elle retourne `true` si `a == b` (y compris les deux `null`), et sinon `a != null && a.equals(b)`.

> Ne pas confondre `Object` (`java.lang`, la classe mère de toutes les classes) et `Objects` (`java.util`, une classe utilitaire de méthodes statiques).

### `hashCode` : la valeur de hachage

`hashCode()` est une autre méthode d'`Object`. Elle retourne un **entier**, la **valeur de hachage** : une sorte d'**empreinte** de l'objet. C'est cette valeur qui apparaissait, en hexadécimal, dans le résultat par défaut de `toString()`.

#### À quoi sert une valeur de hachage ?

Imaginons une bibliothèque qui range ses livres par rayon, selon la première lettre du titre. Pour savoir si un livre est présent, on va directement au bon rayon au lieu de parcourir tout le magasin. La valeur de hachage joue le rôle du **numéro de rayon** : un nombre calculé à partir du contenu, qui indique où chercher.

```java
"abc".hashCode();   // 96354
"abd".hashCode();   // 96355
```

Le même contenu donne toujours le même entier ; un contenu différent donne, en général, un entier différent.

Comparer deux objets avec `equals` peut être coûteux (il faut comparer tous leurs attributs), alors que comparer deux entiers est immédiat :

- deux objets de valeurs de hachage **différentes** sont forcément différents : inutile d'appeler `equals` ;
- deux objets de valeurs de hachage **identiques** sont peut-être égaux : c'est alors `equals` qui confirme.

Les collections comme `HashMap` et `HashSet` fonctionnent ainsi : elles rangent chaque élément dans une « case » choisie grâce à son `hashCode()`. Pour retrouver un élément, elles calculent sa valeur de hachage, vont directement à la bonne case, puis ne comparent avec `equals` que les quelques éléments qui s'y trouvent.

#### Version par défaut et version redéfinie

- Dans `Object`, `hashCode()` est liée à l'**identité** de l'objet (l'objet lui-même, et non son contenu). Deux `Building(2010)` distincts ont donc des valeurs de hachage différentes. Cette valeur n'est pas garantie comme étant l'adresse mémoire, et elle varie d'une exécution à l'autre.
- Une fois **redéfinie**, elle est calculée à partir de l'**état** de l'objet (ses attributs), comme `equals`.

Règle (le **contrat**) : **deux objets égaux selon `equals` doivent avoir le même `hashCode`.**

Or, si on redéfinit `equals` sans `hashCode`, c'est la version d'`Object` qui reste : deux `Shop` égaux auront des valeurs de hachage différentes. Ce n'est pas une bonne pratique : **si on redéfinit `equals`, on redéfinit toujours `hashCode`**, en se basant sur **les mêmes attributs**.

```java
// Building
@Override
public int hashCode() {
    return Objects.hash(constructionYear);
}

// Shop : la valeur du parent + les attributs propres à Shop
@Override
public int hashCode() {
    return Objects.hash(super.hashCode(), shopName);
}
```

`Objects.hash(...)` calcule la valeur de hachage à partir de plusieurs valeurs et évite de faire ce calcul soi-même. Ainsi, deux `Shop` égaux ont la même valeur de hachage, et deux `Shop` différents (année ou enseigne différente) en ont, en général, des valeurs différentes.

On appelle rarement `hashCode()` directement. En revanche, les **collections** l'utilisent : notamment les `Map` (clé → valeur), dont les clés doivent être uniques, et les ensembles (`Set`). Leur bon fonctionnement dépend de la cohérence entre `equals` et `hashCode`.

> Complément : le contrat ne fonctionne que dans un sens. Deux objets égaux ont le même `hashCode`, mais deux objets de même `hashCode` ne sont pas forcément égaux (on parle de collision).

### Laisser l'IDE générer ces méthodes

Dans IntelliJ, on se place dans le corps de la classe et on ouvre *Code → Generate…* (`Alt + Insert`, `Cmd + N` sur macOS), puis *equals() and hashCode()*. L'IDE propose de générer les deux **ensemble**, ce qui illustre la règle ci-dessus, puis demande de choisir les attributs à comparer.

Le code généré est fiable : il contient les mêmes étapes que celles écrites à la main (`this == o`, `null`, `getClass()`, cast, comparaison) et utilise `Objects.equals` et `Objects.hash`. Pour une classe fille, il appelle aussi `super.equals(o)` et `super.hashCode()`. Comprendre la logique reste utile pour relire, adapter, et choisir les bons attributs.

### À retenir

- `==` compare les **références** (même objet en mémoire) ; il s'utilise pour les types primitifs. `equals` compare les **états**.
- `Object.equals` fait la même chose que `==` : on la redéfinit dans les classes dont l'égalité dépend de l'état.
- Signature obligatoire : `public boolean equals(Object o)`. Avec `@Override`, une erreur de signature est détectée.
- Corps habituel : `this == o` → `true` ; `o == null` → `false` ; `getClass()` différent → `false` ; cast ; comparaison des attributs.
- Dans une fille : appeler `super.equals(o)` pour la partie héritée, puis comparer ses propres attributs.
- Pour comparer des attributs objets, utiliser `Objects.equals(a, b)`, qui ne plante pas si l'un est `null`.
- **Redéfinir `equals` impose de redéfinir `hashCode`** (avec `Objects.hash(...)`, sur les mêmes attributs) : deux objets égaux doivent avoir la même valeur de hachage.
- Les collections (`Map`, `Set`) s'appuient sur `equals` et `hashCode`.