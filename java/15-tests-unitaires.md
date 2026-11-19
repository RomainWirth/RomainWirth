# Les tests unitaires avec JUnit

Depuis le début du cours, tu vérifies ton code en le lançant et en regardant la console. Ça marche, mais c'est lent, ça repose sur ta mémoire (« qu'est-ce que je devais revérifier ? ») et ça ne prévient pas quand une modification casse quelque chose qui marchait. Un **test automatisé** est un petit programme qui vérifie ton code à ta place, à chaque fois que tu le lances, en quelques millisecondes.

Ce chapitre présente **JUnit 6**, la bibliothèque de tests la plus utilisée en Java. Tu testeras les classes des chapitres précédents : `Captain` et ses exceptions, `ShipFactory`, `equals` et `hashCode`, la copie défensive, le Builder.

## Objectifs

À la fin du chapitre, tu sauras :

* ajouter JUnit 6 à un projet Maven et organiser tes tests ;
* écrire un test avec `@Test` et les **assertions** ;
* tester un **cas normal**, un **cas limite** et un **cas d'erreur** (`assertThrows`) ;
* lire le message d'un test qui échoue ;
* préparer chaque test avec `@BeforeEach` ;
* écrire un test **paramétré** pour plusieurs valeurs ;
* reconnaître ce qui rend un code difficile à tester.

## Pourquoi tester

* **Détecter les erreurs tôt.** Un bug trouvé à l'écriture coûte quelques minutes ; trouvé en production, des heures.
* **Pouvoir modifier sans peur.** Quand tu changes le code (refactorisation, chapitres 13 et 14), les tests te disent immédiatement si le comportement a changé : c'est ce qu'on appelle éviter les **régressions**.
* **Documenter.** Un test montre comment une classe s'utilise et ce qu'elle promet.
* **Penser aux cas limites.** Écrire un test oblige à se demander : « et si le nom est vide ? et si l'or est négatif ? »

Un **test unitaire** vérifie **une petite unité de code** (une méthode, une classe), de façon **isolée**, **automatique** et **répétable**.

> Les petits `main` jetables qui servent à essayer du code ne sont pas des tests : personne ne les relance, et ils ne signalent pas d'eux-mêmes une erreur. Un vrai test dit tout seul « réussi » ou « échoué ».

## Mettre en place JUnit

### La dépendance

Avec Maven, on ajoute JUnit au `pom.xml`, avec la portée **`test`** : la bibliothèque n'est utilisée que pour les tests et n'est pas livrée avec l'application.

```xml
<dependencies>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>6.1.3</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

* **Jupiter** est le nom de l'API de JUnit (annotations et assertions) ; `junit-jupiter` regroupe l'API, le moteur d'exécution et les tests paramétrés. Le groupe `org.junit.jupiter` et ce nom d'artefact sont les mêmes qu'avec JUnit 5.
* `6.1.3` est la dernière version d'après les notes de version du projet à la date de rédaction. Vérifie la version sur [Maven Central](https://central.sonatype.com/artifact/org.junit.jupiter/junit-jupiter) et fixe-la toujours explicitement.
* JUnit 6 demande **Java 17 minimum** (le kit utilise JDK 21) et un **`maven-surefire-plugin` en version 3.0.0 ou plus** : si `mvn test` ne détecte aucun test, déclare une version récente du plugin dans le `pom.xml`.
* Après modification du `pom.xml`, recharge le projet Maven (comme pour `sqlite-jdbc` au chapitre 19).

### Où ranger les tests

Maven sépare le code et les tests :

```
src/main/java/com/pirates/adventure/model/Captain.java
src/test/java/com/pirates/adventure/model/CaptainTest.java
```

* Les tests sont dans **`src/test/java`**, avec **le même package** que la classe testée : le test peut ainsi utiliser les éléments en visibilité package (comme les constructeurs de la fabrique du chapitre 13).
* La classe de test porte le nom de la classe testée suivi de **`Test`** : `CaptainTest`.

### Lancer les tests

* Avec Maven, la commande `mvn test` compile le code, lance tous les tests et affiche un bilan.
* Dans IntelliJ, une flèche verte apparaît à côté d'une classe ou d'une méthode de test pour la lancer. Les résultats s'affichent dans un panneau : vert si le test réussit, rouge s'il échoue.

## Un premier test

Voici la classe à tester : la fabrique du chapitre 13.

```java
public final class ShipFactory {

    private ShipFactory() { }

    public static Ship createShip(String type, String name) {
        return switch (type) {
            case "sloop" -> new Sloop(name);
            case "galleon" -> new Galleon(name);
            default -> throw new IllegalArgumentException("Unknown ship type: " + type);
        };
    }
}
```

Et son test :

```java
package com.pirates.adventure.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class ShipFactoryTest {

    @Test
    void createsSloop() {
        Ship ship = ShipFactory.createShip("sloop", "Black Wave");

        assertInstanceOf(Sloop.class, ship);
        assertEquals("Black Wave", ship.getName());
    }
}
```

* **`@Test`** (de `org.junit.jupiter.api`) marque une méthode comme test : JUnit la découvre et l'exécute.
* La classe et les méthodes de test peuvent être en **visibilité package** (pas besoin de `public`), et les méthodes ne retournent rien (`void`) ni ne prennent de paramètre.
* Les **assertions** (`assertEquals`, `assertInstanceOf`...) sont des méthodes statiques de la classe `Assertions`, importées avec `import static`. Si une assertion est fausse, le test **échoue** ; si aucune ne l'est, il **réussit**.
* Le nom du test décrit le comportement vérifié (`createsSloop`), pas la méthode testée (`testCreateShip`). On peut aussi l'écrire en clair avec `@DisplayName("spend retire l'or dépensé")`.

### La structure d'un test : préparer, agir, vérifier

Un bon test suit presque toujours trois temps, séparés par une ligne vide :

1. **Préparer** (*arrange*, ou *given*) : créer les objets nécessaires ;
2. **Agir** (*act*, ou *when*) : appeler la méthode testée ;
3. **Vérifier** (*assert*, ou *then*) : contrôler le résultat.

```java
@Test
void spendRemovesGold() throws NotEnoughGoldException {
    Captain captain = new Captain("Anne", 100);          // préparer

    captain.spend(30);                                    // agir

    assertEquals(70, captain.getGold());                  // vérifier
}
```

Un test vérifie **un seul comportement**. S'il en vérifie plusieurs, on ne sait plus lequel est en cause quand il échoue.

## Les assertions

| Assertion | Vérifie |
| --- | --- |
| `assertEquals(attendu, obtenu)` | que les deux valeurs sont égales (`equals`, ou `==` pour les types primitifs) |
| `assertNotEquals(a, b)` | qu'elles sont différentes |
| `assertTrue(condition)` / `assertFalse(condition)` | qu'une condition est vraie / fausse |
| `assertNull(x)` / `assertNotNull(x)` | qu'une référence est `null` / non `null` |
| `assertSame(attendu, obtenu)` | que ce sont **le même objet** (`==` sur les références) |
| `assertInstanceOf(Type.class, x)` | que l'objet est du type attendu |
| `assertThrows(Type.class, () -> ...)` | que le code lance cette exception |
| `assertAll(...)` | que plusieurs assertions sont vraies, **toutes évaluées** |
| `assertEquals(attendu, obtenu, delta)` | que deux `double` sont égaux à `delta` près |

### L'ordre des paramètres : attendu d'abord

`assertEquals(expected, actual)` : la valeur **attendue** en premier, la valeur **obtenue** en second. L'ordre n'influence pas la réussite du test, mais **le message d'échec** :

```java
int actual = 5;
assertEquals(actual, 4);       // on a inversé les paramètres
```

```
expected: <5> but was: <4>
```

Le message dit « attendu 5, obtenu 4 », alors que le code produit 5 : on cherche la faute au mauvais endroit. Écris toujours **la valeur attendue en dur d'abord**.

### Lire un message d'échec

Un test qui échoue dit ce qu'il attendait et ce qu'il a obtenu :

```
expected: <Black Wave> but was: <Black Wav>
```

C'est l'indice principal : compare les deux valeurs, puis suis la trace jusqu'à la ligne du test, comme pour une exception (chapitre 12).

Un test qui échoue pour une autre raison qu'une assertion fausse, par exemple une exception inattendue, est signalé comme une **erreur** : `/ by zero` avec la trace de l'`ArithmeticException`.

### Les nombres à virgule

Les `double` ne sont pas exacts : `0.1 + 0.2` vaut `0.30000000000000004`. `assertEquals(0.3, 0.1 + 0.2)` échoue (message : `expected: <0.3> but was: <0.30000000000000004>`). On passe une **tolérance** :

```java
assertEquals(2.5, Calc.average(2, 3), 0.0001);
```

### Plusieurs assertions : `assertAll`

Quand un test fait plusieurs assertions, la première qui échoue arrête le test. Avec `assertAll`, toutes sont évaluées et le rapport les liste toutes :

```java
@Test
void keepsValues() {
    Captain captain = new Captain("Anne", 100);

    assertAll(
            () -> assertEquals("Anne", captain.getName()),
            () -> assertEquals(100, captain.getGold())
    );
}
```

Chaque assertion est une **lambda** (chapitre 16).

## Tester les exceptions

Un bon test vérifie aussi que le code **refuse** ce qu'il doit refuser (chapitre 12). `assertThrows` exécute un code et vérifie qu'il lance l'exception attendue :

```java
@Test
void blankNameIsRejected() {
    assertThrows(IllegalArgumentException.class, () -> new Captain(" ", 10));
}
```

`assertThrows` **retourne l'exception**, ce qui permet de vérifier son message ou ses données :

```java
@Test
void spendingTooMuchThrows() {
    Captain captain = new Captain("Anne", 100);

    NotEnoughGoldException exception =
            assertThrows(NotEnoughGoldException.class, () -> captain.spend(150));

    assertEquals("Il manque 50 pièces d'or", exception.getMessage());
    assertEquals(100, captain.getGold());   // l'or n'a pas bougé
}
```

La dernière ligne est importante : un échec ne doit pas laisser l'objet dans un état incohérent. Si le code ne lance **pas** l'exception, ou en lance une autre, le test échoue.

> N'écris pas le test d'une exception avec un `try` / `catch` : si l'exception n'est pas lancée, le test réussit à tort. `assertThrows` n'a pas ce défaut.

## Tester `equals` et `hashCode`

Le contrat vu aux chapitres 10 et 13 se teste facilement, avec la classe `Pirate` (nom, âge) :

```java
class PirateTest {

    @Test
    void samePropertiesAreEqual() {
        assertEquals(new Pirate("Anne", 32), new Pirate("Anne", 32));
    }

    @Test
    void differentAgeIsNotEqual() {
        assertNotEquals(new Pirate("Anne", 32), new Pirate("Anne", 33));
    }

    @Test
    void equalObjectsHaveSameHashCode() {
        assertEquals(new Pirate("Anne", 32).hashCode(), new Pirate("Anne", 32).hashCode());
    }

    @Test
    void isNotEqualToNull() {
        assertNotEquals(null, new Pirate("Anne", 32));
    }
}
```

Le test de `hashCode` est précieux : sur une classe qui redéfinit `equals` **sans** `hashCode`, il échoue (je l'ai vérifié, avec un message `expected: <1443055846> but was: <502838712>`). Le test attrape l'oubli que le compilateur ne voit pas.

## Tester l'immuabilité et la copie défensive

Le test prouve que la copie défensive (chapitre 14) protège bien l'objet :

```java
@Test
void parrotIsProtectedFromOutsideChanges() {
    StringBuilder name = new StringBuilder("Polly");
    Parrot parrot = new Parrot(name);

    name.reverse();                    // on modifie l'objet passé au constructeur
    parrot.getName().reverse();        // et celui retourné par le getter

    assertEquals("Polly", parrot.getName().toString());
}
```

Si tu retires la copie dans le constructeur ou dans le getter, ce test devient rouge.

## Tester un Builder

On vérifie les **valeurs par défaut** et la **validation** de `build()` (chapitre 14) :

```java
@Test
void builderUsesDefaults() {
    ShipCriteria criteria = new ShipCriteria.Builder(12).build();

    assertAll(
            () -> assertEquals(12, criteria.getCrewSize()),
            () -> assertEquals(0, criteria.getMinPrice()),
            () -> assertEquals(Integer.MAX_VALUE, criteria.getMaxPrice())
    );
}

@Test
void builderRejectsInvertedPrices() {
    assertThrows(IllegalArgumentException.class,
            () -> new ShipCriteria.Builder(12).minPrice(500).maxPrice(300).build());
}
```

## Préparer chaque test : `@BeforeEach`

Plusieurs tests ont souvent besoin du même objet de départ. On évite de le répéter avec **`@BeforeEach`**, méthode exécutée **avant chaque test** :

```java
class CaptainTest {

    private Captain captain;

    @BeforeEach
    void setUp() {
        captain = new Captain("Anne", 100);
    }

    @Test
    void spendRemovesGold() throws NotEnoughGoldException {
        captain.spend(30);

        assertEquals(70, captain.getGold());
    }

    @Test
    void spendingTooMuchThrows() {
        assertThrows(NotEnoughGoldException.class, () -> captain.spend(150));
    }
}
```

**Pour chaque test, JUnit crée une nouvelle instance de la classe de test** (j'ai vérifié : cinq tests donnent cinq instances différentes et cinq appels à `setUp`). Chaque test repart donc d'un `Captain` neuf, et ce qu'un test modifie n'affecte pas les autres.

Autres annotations de cycle de vie :

* `@AfterEach` : après chaque test (libérer une ressource) ;
* `@BeforeAll` / `@AfterAll` : une seule fois pour toute la classe, sur une méthode **`static`** ;
* `@Disabled("raison")` : désactive un test (le rapport l'indique avec la raison, vérifié). À éviter durablement : un test désactivé ne protège plus rien.

### Des tests indépendants

* **Aucun test ne doit dépendre d'un autre.** JUnit ne garantit pas l'ordre d'exécution (j'ai observé que l'ordre ne suit pas celui du fichier).
* Un test **ne dépend pas d'un état partagé** laissé par un autre : pas d'attribut `static` modifié, pas de Singleton à l'état changeant (une des critiques du chapitre 13).

## Les tests paramétrés

Pour tester plusieurs valeurs avec la même logique, on évite de copier le test. Un **test paramétré** s'exécute une fois par jeu de valeurs. Il utilise `@ParameterizedTest` au lieu de `@Test`, et une source de valeurs :

```java
@ParameterizedTest
@ValueSource(strings = {"raft", "Sloop", ""})
void invalidTypesAreRejected(String type) {
    assertThrows(IllegalArgumentException.class, () -> ShipFactory.createShip(type, "x"));
}

@ParameterizedTest
@CsvSource({"sloop,Sloop", "galleon,Galleon"})
void typeGivesExpectedClass(String type, String expectedClass) {
    Ship ship = ShipFactory.createShip(type, "n");

    assertEquals(expectedClass, ship.getClass().getSimpleName());
}
```

* `@ValueSource` fournit une liste de valeurs d'un même type ;
* `@CsvSource` fournit des lignes de plusieurs valeurs séparées par des virgules, qui deviennent les paramètres de la méthode ;
* le rapport liste chaque exécution, numérotée et accompagnée de sa valeur (les valeurs texte sont affichées entre guillemets depuis JUnit 6). Les imports viennent de `org.junit.jupiter.params` et `org.junit.jupiter.params.provider`.

Les tests paramétrés sont idéaux pour les **cas limites** : zéro, valeur négative, chaîne vide, valeur maximale, juste en dessous et juste au-dessus d'une borne.

## Que tester ?

* Le **comportement public** : ce que la classe promet à ceux qui l'utilisent, pas ses détails internes. Une méthode `private` se teste à travers les méthodes publiques qui l'appellent.
* Un **cas normal**, des **cas limites** (valeurs aux bornes, vides, `null`) et des **cas d'erreur** (exceptions).
* Ce qui a de la **logique** : calculs, règles, validations, conversions. Un simple accesseur n'a pas besoin de test.
* Quand tu trouves un bug, écris **d'abord un test qui le reproduit** (il échoue), puis corrige jusqu'à ce qu'il passe : le bug ne reviendra pas sans que tu le saches. Cette idée est poussée plus loin dans le **TDD** (*Test Driven Development*) : on écrit le test **avant** le code.

### Ce qui est difficile à tester

Un code est difficile à tester quand il est **couplé** à ce qui l'entoure :

* du code qui dépend d'un **Singleton** à l'état global (chapitre 13) ;
* du code qui lit au **clavier** (`Scanner(System.in)`) ou affiche directement dans la console : on sépare la **logique** (testable) de la saisie et de l'affichage ;
* du code qui utilise une **base de données** réelle, avec une URL écrite en dur (chapitre 19) : pour le tester, on rend l'URL paramétrable (une base temporaire pour les tests) ;
* du code qui dépend de l'**heure** (`LocalDate.now()`) ou du **hasard** (le dé du jeu) : on passe la valeur en paramètre, ce qui rend le test répétable.

Un code facile à tester est en général un code bien conçu : méthodes courtes, responsabilités séparées, dépendances passées en paramètres. Les tests te poussent à améliorer ta conception.

## Remarques

* Un test peut échouer pour une mauvaise raison : une erreur **dans le test lui-même**. Vérifie qu'un test échoue bien quand le code est faux (casse volontairement le code, une fois).
* **Couverture** : des outils mesurent la part du code exécutée par les tests. Un pourcentage élevé n'est pas une garantie : il dit ce qui est exécuté, pas ce qui est vérifié.
* Les **mocks** (objets simulés qui remplacent une dépendance, avec une bibliothèque comme Mockito) ne sont pas traités ici.
* JUnit 6 reprend les annotations et assertions de JUnit 5 : `@Test`, `@BeforeEach`, `@DisplayName`, `@ParameterizedTest` et les méthodes de `Assertions` utilisées ici ne figurent pas parmi les changements des notes de version. Un projet resté en JUnit 5 (branche 5.14) fonctionne avec ce chapitre.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Paramètres de `assertEquals` inversés | `expected: <5> but was: <4>` trompeur | Attendu d'abord, obtenu ensuite. |
| `assertEquals` sur des `double` sans tolérance | `expected: <0.3> but was: <0.30000000000000004>` | Ajouter un `delta`. |
| `assertSame` à la place de `assertEquals` | échoue pour deux objets égaux mais distincts | `assertSame` compare les références. |
| Test d'exception avec `try` / `catch` | le test réussit même sans exception | Utiliser `assertThrows`. |
| Oublier `hashCode` avec `equals` | test de `hashCode` rouge | Redéfinir les deux. |
| Tests dépendants les uns des autres | échecs aléatoires | Chaque test prépare son état. |
| Plusieurs comportements dans un test | on ne sait pas quoi corriger | Un test, un comportement. |
| Tests dans `src/main/java` | non lancés par `mvn test` | Les ranger dans `src/test/java`. |
| Importer `@Test` de `org.junit` (JUnit 4) | le test peut ne pas être exécuté | Importer `org.junit.jupiter.api.Test`. |
| Un `Scanner(System.in)` dans la logique | impossible à tester | Séparer saisie et logique. |
| Désactiver un test qui échoue | le bug passe inaperçu | Corriger le code ou le test. |

## À retenir

* Un **test unitaire** vérifie une petite unité de code, de façon automatique et répétable.
* Avec Maven : dépendance `junit-jupiter` (portée `test`), tests dans `src/test/java`, même package que la classe testée, nom `XxxTest`. Lancer avec `mvn test`.
* `@Test` marque un test. Structure : **préparer, agir, vérifier**. Un test, un comportement.
* Assertions : `assertEquals(attendu, obtenu)`, `assertTrue`, `assertNull`, `assertSame`, `assertInstanceOf`, `assertAll`. Tolérance pour les `double`.
* `assertThrows` vérifie qu'une exception est lancée et la retourne pour inspecter son message.
* `@BeforeEach` prépare chaque test ; JUnit crée une instance de classe de test par test ; les tests sont indépendants et leur ordre n'est pas garanti.
* `@ParameterizedTest` (`@ValueSource`, `@CsvSource`) répète un test avec plusieurs valeurs, idéal pour les cas limites.
* On teste le comportement public : cas normal, cas limites, cas d'erreur. Un code testable est un code bien découpé.

## À toi de jouer

1. Ajoute `junit-jupiter` à ton projet et écris `ShipFactoryTest` avec un test pour `"sloop"` et un pour `"galleon"`. Lance-les.
2. Casse volontairement la fabrique (retourne un `Galleon` pour `"sloop"`) et lis le message d'échec. Remets le code.
3. Écris `CaptainTest` : or dépensé, or insuffisant (`assertThrows` + message + or inchangé), nom vide, or négatif. Utilise `@BeforeEach`.
4. Inverse les paramètres d'un `assertEquals` et fais-le échouer. Que lis-tu ?
5. Teste `0.1 + 0.2` avec et sans tolérance.
6. Écris `PirateTest` pour `equals` et `hashCode`. Supprime `hashCode` de `Pirate` : quel test devient rouge ?
7. Écris le test de copie défensive de `Parrot`, puis supprime la copie dans le getter : le test échoue-t-il ?
8. Teste `ShipCriteria.Builder` : valeurs par défaut, `minPrice > maxPrice`, effectif nul. Utilise `assertAll`.
9. Transforme tes tests de types invalides de la fabrique en test paramétré avec `@ValueSource`, puis ajoute des cas limites avec `@CsvSource`.
10. Ajoute un test `OutOfMapException` : `checkInside(6, 0)` lance l'exception avec la ligne et la colonne attendues (chapitre 12).
11. Choisis une méthode de ton jeu difficile à tester (saisie au clavier, dé, date). Comment la modifier pour la rendre testable ?

## Pour aller plus loin

* [Le guide de l'utilisateur de JUnit](https://docs.junit.org/current/user-guide/) (annotations, assertions, tests paramétrés, cycle de vie).
* [Notes de version de JUnit](https://docs.junit.org/current/release-notes.html) (versions disponibles, changements de la branche 6).
* [JUnit Jupiter sur Maven Central](https://central.sonatype.com/artifact/org.junit.jupiter/junit-jupiter).
