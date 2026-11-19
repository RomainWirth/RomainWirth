# Apprendre Java en construisant un jeu de pirates : sommaire

## Introduction

Ce cours t'emmène des premières lignes de Java jusqu'à une application structurée, qui accède à une base de données et manipule ses données avec des streams. Les exemples suivent un fil conducteur : un jeu d'aventure pirate en console. Tu y rencontreras des navires (`Ship`, `Sloop`, `Galleon`), un capitaine (`Captain`), un équipage (`Pirate`), des cases de la carte (`Cell`, `Reef`, `Port`), des ennemis (`EnemyShip`) et une cale (`Hold`).

Les chapitres servent de **boîte à outils**. Ils sont écrits pour être lus en autonomie, ou à côté des itérations du kit « La Malédiction de l'île du Crâne », qui te fait construire le jeu pas à pas et renvoie aux chapitres au moment où tu en as besoin.

### À qui s'adresse ce cours

À un développeur débutant en Java, qui a déjà des bases d'algorithmique : variable, condition, boucle, fonction. Aucune connaissance de Java ni de programmation objet n'est nécessaire.

### Ce dont tu as besoin

* le **JDK 21** (les exemples sont écrits pour Java 21) ;
* **IntelliJ IDEA** et **Maven** : le chapitre 1 explique la mise en place ;
* pour le chapitre 19, des notions de SQL : elles sont traitées dans le cours de bases de données (chapitres I à III), qui est un prérequis.

### Comment sont écrits les chapitres

* Un chapitre commence par une liste d'**objectifs**, et se termine par un **À retenir**, une série d'exercices **À toi de jouer** et des **liens vers la documentation officielle** de Java et des outils.
* Les noms de classes, de méthodes et de variables sont en **anglais**, comme dans un vrai projet. Les explications sont en français.
* Les messages d'erreur du compilateur et de la machine virtuelle sont cités tels qu'ils s'affichent, dans une section sur les erreurs fréquentes (**Les erreurs classiques** dans la plupart des chapitres). Lis-les : savoir lire une erreur est une compétence centrale.
* Les exemples de code se tapent et se lancent. Lis le code, puis écris-le toi-même, puis casse-le volontairement pour voir ce qui se passe.

## Parcours recommandé

### Partie 1 : les bases du langage

1. [Mon premier programme](01-premier-programme.md) : JDK, JVM, IntelliJ, projet Maven, compilation et exécution à la main.
2. [Les variables](02-variables.md) : types primitifs, `String`, saisie au clavier avec `Scanner`.
3. [Les opérateurs](03-operateurs.md) : calculs, division entière et modulo, conversions de types, opérateurs logiques.
4. [Les structures de contrôle](04-structures-de-controle.md) : `if`, `switch`, boucles, `break` et `continue`.
5. [Les tableaux](05-tableaux.md) : tableaux à une et deux dimensions, parcours, copies.
6. [Les méthodes et le débogage](06-methodes-et-debogage.md) : paramètres, valeur de retour, passage par valeur, portée, surcharge, débogueur d'IntelliJ.

### Partie 2 : la programmation orientée objet

7. [Classes et objets](07-classes-et-objets.md) : attributs, constructeurs, encapsulation, `static`, `final`, Javadoc.
8. [Composition, packages et enum](08-composition-packages-enum.md) : objets composés d'objets, organisation en packages, visibilité, `enum`.
9. [L'héritage](09-heritage.md) : `extends`, `super`, `protected`, redéfinition, héritage ou composition.
10. [Polymorphisme et classe `Object`](10-polymorphisme-et-object.md) : type déclaré et type réel, `instanceof`, `toString`, `equals` et `hashCode`.
11. [L'abstraction](11-abstraction.md) : classes abstraites et interfaces.

### Partie 3 : écrire du code robuste

12. [Les exceptions](12-exceptions.md) : `try` / `catch` / `finally`, `throw` et `throws`, exceptions personnalisées.
13. [Patrons de conception, généricité et collections](13-patrons-generiques-collections.md) : Factory, classes génériques, `ArrayList`, Singleton, chargement d'un fichier XML.
14. [Immuabilité, dates et patron Builder](14-immuabilite-dates-builder.md) : objets immuables, copie défensive, `LocalDate`, Builder.
15. [Les tests unitaires avec JUnit](15-tests-unitaires.md) : tests automatisés, assertions, tests paramétrés. *Chapitre facultatif.*

### Partie 4 : le style fonctionnel

16. [Classes anonymes et expressions lambda](16-classes-anonymes-et-lambdas.md) : interfaces fonctionnelles, lambdas.
17. [Les streams](17-streams.md) : `filter`, `map`, `sorted`, `collect`, `groupingBy`.
18. [La classe `Optional` et les références de méthodes](18-optional-et-references-de-methodes.md) : gérer l'absence de valeur, `::`.

### Partie 5 : les données

19. [Java et les bases de données : JDBC](19-jdbc-et-sql.md) : SQLite, `PreparedStatement`, `ResultSet`, transactions, clés étrangères.

### Annexe

20. [Concevoir avant de coder avec UML](20-uml.md) : diagrammes de cas d'utilisation, de séquence et de classes.

## Pourquoi cet ordre

* Les parties **1** et **2** suivent la montée en complexité : d'abord un programme qui exécute des instructions, puis des classes, puis des classes qui s'organisent entre elles.
* La partie **3** apprend à écrire du code qui résiste aux erreurs : exceptions, patrons de conception, immuabilité, tests. Elle s'appuie sur la programmation objet.
* La partie **4** ne se comprend bien qu'une fois les interfaces et les classes anonymes vues au chapitre 11 : une lambda est une façon courte d'écrire une classe anonyme.
* La partie **5** assemble tout : des objets Java, sauvegardés et relus dans une base de données.
* L'annexe UML peut se lire dès que tu as vu les classes (chapitre 7) ; elle prend tout son sens après l'héritage et les interfaces (chapitres 9 à 11).

## Lien avec les itérations du kit

| Itération du kit | Chapitres |
| --- | --- |
| 1. Prise en main | 1 à 4 |
| 2. La carte au trésor | 5 et 6 |
| 3. Les premiers objets | 7 et 8 |
| 4. Héritage, abstraction et exceptions | 9, 11 et 12 |
| 5. La carte prend vie | 11, 13 et 20 |
| 6. Rencontres et combats | 10 et 11 |
| 7. La carte complète | 10 et 13 |
| 8. Sauvegarde SQL | 19 |
| 9. Architecture propre | 13, 14 et 15 (facultatif) |
| 10. Analyse de la flotte | 16 à 18 |

## Conseils de progression

* Lis un chapitre en entier, puis fais les exercices **À toi de jouer** sans regarder la solution.
* Tape le code toi-même, même quand il te paraît évident : c'est en le tapant qu'on remarque ce qu'on n'avait pas compris.
* Provoque les erreurs citées dans la section sur les erreurs fréquentes et lis chaque message.
* Fais des pauses de réflexion : quand un chapitre pose une question, cherche avant de lire la réponse.
* Utilise la documentation officielle (liens en fin de chapitre) : c'est l'outil de tous les jours d'un développeur.
