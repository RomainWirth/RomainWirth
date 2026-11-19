# Java et les bases de données : JDBC

Jusqu'ici, ton programme oublie tout dès qu'il s'arrête. Pour **sauvegarder** une partie de pirates et la **reprendre** plus tard, il faut stocker les données dans une base. Ce chapitre montre comment un programme Java parle à une base SQL avec **JDBC** : se connecter, créer des tables, insérer, lire, modifier, et garantir que la sauvegarde est complète ou n'a pas lieu du tout (transaction).

Les exemples utilisent **SQLite**, une base stockée dans un simple fichier : rien à installer côté serveur. Une variante **MySQL** est donnée à la fin.

## Prérequis

* Le SQL du cours de bases de données (chapitres I à III) : `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, clés primaires et étrangères, jointures. On ne les réexplique pas ici.
* Les exceptions (chapitre 12), le `try-with-resources`, et les classes immuables (chapitre 14).

## Objectifs

À la fin du chapitre, tu sauras :

* ajouter un **driver JDBC** à un projet Maven ;
* ouvrir une **connexion** et la fermer proprement ;
* exécuter du SQL avec `Statement`, et surtout avec **`PreparedStatement`** ;
* lire un `ResultSet` et le transformer en objets Java ;
* faire respecter les **clés étrangères** avec SQLite ;
* regrouper plusieurs requêtes dans une **transaction** ;
* ranger tout cela dans une classe d'accès aux données.

## Qu'est-ce que JDBC ?

**JDBC** (*Java Database Connectivity*) est l'API standard de Java pour parler à une base de données relationnelle. Elle se trouve dans le package **`java.sql`** du JDK : des **interfaces** (`Connection`, `Statement`, `PreparedStatement`, `ResultSet`...) et la classe `DriverManager`.

Les interfaces sont dans le JDK, mais **pas leur implémentation** : celle-ci est fournie par un **driver**, une bibliothèque propre à chaque base (SQLite, MySQL, PostgreSQL...). C'est le principe de l'abstraction (chapitre 11) : ton code utilise `Connection`, et le driver fournit la classe concrète.

```
ton code  ->  java.sql (interfaces)  ->  driver (sqlite-jdbc)  ->  fichier pirates.db
```

Changer de base, c'est donc surtout changer de driver et d'URL de connexion (le SQL peut aussi varier d'un moteur à l'autre).

## Ajouter le driver avec Maven

Le driver SQLite s'appelle **`sqlite-jdbc`** (projet Xerial). Un projet **Maven** (utilisé depuis l'itération 1 du kit) déclare ses dépendances dans le fichier `pom.xml`. Maven les télécharge et les place sur le **classpath**.

```xml
<dependencies>
    <dependency>
        <groupId>org.xerial</groupId>
        <artifactId>sqlite-jdbc</artifactId>
        <version>3.53.2.1</version>
    </dependency>
</dependencies>
```

* `groupId` et `artifactId` identifient la bibliothèque ; `version` en fixe la version.
* La version `3.53.2.1` est celle indiquée dans le README du projet à la date de rédaction. Vérifie la dernière version sur [Maven Central](https://central.sonatype.com/artifact/org.xerial/sqlite-jdbc) avant de l'utiliser, et fixe-la toujours explicitement.
* Après modification du `pom.xml`, il faut **recharger le projet Maven** pour que l'IDE télécharge la dépendance.

> Depuis JDBC 4, il n'est plus nécessaire de charger le driver à la main (`Class.forName(...)`) : le JDK le trouve tout seul sur le classpath, et `DriverManager.getConnection(...)` fonctionne directement.

Au premier lancement, tu peux voir des lignes `SLF4J: ...` dans la console. Elles viennent de la bibliothèque de journalisation utilisée par le driver et sont sans gravité (observé avec la version 3.44.1.0 du driver, sans configuration de journalisation).

## Se connecter

L'URL de connexion identifie le driver et la base. Pour SQLite :

```
jdbc:sqlite:pirates.db
```

`pirates.db` est le chemin du fichier. **Il est créé s'il n'existe pas** (vérifié). Un chemin relatif est relatif au **dossier de travail** du programme au moment du lancement : si tu ne trouves pas le fichier, affiche `new File("pirates.db").getAbsolutePath()`.

```java
try (Connection connection = DriverManager.getConnection("jdbc:sqlite:pirates.db")) {
    System.out.println("Connecté : " + connection.isValid(1));
}
```

Une `Connection` est une **ressource** : elle doit toujours être fermée. Le `try-with-resources` (chapitre 12) la ferme automatiquement, même en cas d'exception. Utiliser une connexion fermée lève une `SQLException` (`database connection closed`).

`getConnection` et la plupart des méthodes JDBC lèvent une **`SQLException`**, exception **vérifiée** (chapitre 12) : il faut la traiter ou la déclarer.

### Base en mémoire

L'URL `jdbc:sqlite::memory:` crée une base **en mémoire**, qui disparaît à la fermeture de la connexion. Piège : **chaque connexion obtient sa propre base vide**. Une table créée avec une connexion n'existe pas dans une deuxième (`no such table: t`, vérifié). C'est pratique pour des tests, pas pour une sauvegarde.

### Activer les clés étrangères

Par défaut, **SQLite n'applique pas les clés étrangères** : on peut insérer un navire qui référence une partie inexistante, sans erreur (vérifié : la ligne est acceptée). Il faut activer l'option **à chaque connexion** :

```sql
PRAGMA foreign_keys = ON;
```

Ce réglage n'est pas mémorisé dans le fichier : il porte sur la connexion en cours. On le fait donc dans une méthode qui fabrique toutes nos connexions :

```java
public final class Database {

    private static final String URL = "jdbc:sqlite:pirates.db";

    private Database() {
    }

    public static Connection connect() throws SQLException {
        Connection connection = DriverManager.getConnection(URL);
        try (Statement statement = connection.createStatement()) {
            statement.execute("PRAGMA foreign_keys = ON");
        } catch (SQLException e) {
            connection.close();
            throw e;
        }
        return connection;
    }
}
```

Une classe utilitaire (constructeur privé, méthode statique), comme la fabrique du chapitre 13. Si le `PRAGMA` échoue, on ferme la connexion avant de relancer l'exception, pour ne pas la laisser ouverte.

## Le schéma de sauvegarde

Une partie sauvegardée (`game`) possède plusieurs navires (`ship`) : une association un-à-plusieurs.

```
game (id, player_name, saved_at, gold)
ship (id, game_id → game.id, name, type, hull)
```

On crée les tables en SQL depuis Java. `executeUpdate` exécute une instruction qui ne retourne pas de lignes (création, insertion, modification, suppression). Les blocs de texte (`"""`) de Java facilitent l'écriture du SQL sur plusieurs lignes :

```java
public static void createTables() {
    try (Connection connection = connect(); Statement statement = connection.createStatement()) {
        statement.executeUpdate("""
            CREATE TABLE IF NOT EXISTS game (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                saved_at TEXT NOT NULL,
                gold INTEGER NOT NULL CHECK (gold >= 0)
            )""");
        statement.executeUpdate("""
            CREATE TABLE IF NOT EXISTS ship (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                game_id INTEGER NOT NULL REFERENCES game(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('sloop', 'galleon')),
                hull INTEGER NOT NULL CHECK (hull >= 0)
            )""");
    } catch (SQLException e) {
        throw new DatabaseException("Impossible de créer les tables", e);
    }
}
```

* `IF NOT EXISTS` : on peut appeler la méthode à chaque démarrage (vérifié : deux appels de suite ne posent pas de problème).
* Les contraintes (`NOT NULL`, `CHECK`, `REFERENCES`) font de la **base** un deuxième filet de sécurité, en plus des contrôles de ton code Java.
* `ON DELETE CASCADE` : supprimer une partie supprime ses navires (vérifié : après suppression, il reste 0 navire).
* **Dates** : SQLite n'a pas de vrai type date. On stocke un `LocalDateTime` (chapitre 14) sous forme de **texte ISO** (`2026-11-19T16:59:17`), avec `toString()` pour écrire et `LocalDateTime.parse(...)` pour lire.
* Attention : **l'ordre de création compte** (`game` avant `ship`, qui y fait référence).

Tu peux contrôler le contenu du fichier avec le client en ligne de commande `sqlite3 pirates.db` (voir le chapitre SQLite du cours).

### Une exception à nous : `DatabaseException`

`SQLException` est vérifiée : si on la laisse remonter, elle encombre les signatures de toutes les méthodes du programme. Le reste du jeu n'a pas à connaître JDBC. On l'**enveloppe** dans notre propre exception, en gardant la **cause** (chapitre 12) :

```java
public class DatabaseException extends RuntimeException {
    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

Elle est **non vérifiée** : une base inaccessible n'est pas une situation que chaque appelant sait réparer. Le menu du jeu, lui, l'attrape et affiche « sauvegarde impossible ».

## Exécuter des requêtes : `Statement` et `PreparedStatement`

### Le danger de la concaténation

On pourrait construire le SQL en collant des `String` :

```java
String sql = "SELECT id FROM game WHERE player_name = '" + name + "'";
```

C'est **une très mauvaise idée**. Deux problèmes, vérifiés :

* un nom comme `Anne O'Malley` contient une apostrophe : le SQL devient invalide (`near "Malley": syntax error`) ;
* un nom malveillant comme `x' OR '1'='1` change le sens de la requête : elle retourne **toutes les lignes**. C'est l'**injection SQL**, une des failles les plus répandues.

### La solution : la requête préparée

Une **requête préparée** (`PreparedStatement`) contient des **paramètres `?`**, qu'on renseigne ensuite avec des méthodes `setXxx`. Les valeurs ne sont **jamais interprétées comme du SQL** :

```java
String sql = "SELECT id FROM game WHERE player_name = ?";
try (Connection connection = Database.connect();
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, name);
    try (ResultSet resultSet = statement.executeQuery()) {
        // ...
    }
}
```

Avec la même requête préparée, `Anne O'Malley` est trouvé normalement, et `x' OR '1'='1` ne retourne aucune ligne (vérifié).

* Les paramètres sont **numérotés à partir de 1** (comme les colonnes d'un `ResultSet`, contrairement aux tableaux).
* Le type de `setXxx` correspond au type de la colonne : `setString`, `setInt`, `setLong`, `setDouble`, `setBoolean`...
* Un paramètre peut représenter une **valeur**, jamais un nom de table ou de colonne.
* Avec le driver SQLite testé : un paramètre jamais renseigné est traité comme `NULL` (`param not set rows=0`), et un numéro trop grand lève une `ArrayIndexOutOfBoundsException` (pas une `SQLException`). Relis les numéros à chaque fois.

**Règle : toute valeur qui vient de l'extérieur (saisie, fichier, autre méthode) passe par un paramètre `?`.** `Statement` simple reste acceptable pour du SQL **fixe**, sans aucune valeur variable (comme la création des tables).

### Insérer

`executeUpdate` retourne le **nombre de lignes** touchées :

```java
String sql = "INSERT INTO game (player_name, saved_at, gold) VALUES (?, ?, ?)";
try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, playerName);
    statement.setString(2, LocalDateTime.now().toString());
    statement.setInt(3, gold);
    int rows = statement.executeUpdate();   // 1
}
```

Le `id` est généré par la base. Pour le récupérer, JDBC propose `getGeneratedKeys()`, mais avec la version `3.44.1.0` du driver SQLite que j'ai testée, il lève `SQLFeatureNotSupportedException: not implemented by SQLite JDBC driver`. La solution propre à SQLite est de demander l'identifiant de la dernière insertion **sur la même connexion** :

```java
try (Statement statement = connection.createStatement();
     ResultSet resultSet = statement.executeQuery("SELECT last_insert_rowid()")) {
    resultSet.next();
    long gameId = resultSet.getLong(1);
}
```

(Les versions plus récentes du driver ont pu changer : teste `getGeneratedKeys()` avec ta version. Avec MySQL, il est bien pris en charge.)

### Modifier et supprimer

Même principe : `UPDATE` et `DELETE` avec des paramètres, et `executeUpdate` retourne le nombre de lignes modifiées. C'est utile pour savoir si quelque chose s'est passé :

```java
String sql = "UPDATE ship SET hull = ? WHERE id = ?";
try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setInt(1, 55);
    statement.setLong(2, shipId);
    return statement.executeUpdate() == 1;   // false si l'identifiant n'existe pas
}
```

Avec un identifiant inconnu, aucune ligne n'est modifiée : retour `false`, **sans exception** (vérifié).

### Insérer plusieurs lignes : le batch

Pour insérer plusieurs navires avec la même requête, on peut les regrouper : `addBatch()` pour chaque ligne, puis un seul `executeBatch()`, qui retourne le nombre de lignes de chaque ajout (`[1, 1, 1]`, vérifié).

## Lire : `ResultSet`

`executeQuery` retourne un **`ResultSet`** : un curseur sur les lignes du résultat. Il est **positionné avant la première ligne** : `next()` avance d'une ligne et retourne `false` quand il n'y en a plus.

```java
String sql = "SELECT id, name, type, hull FROM ship WHERE game_id = ? ORDER BY id";
try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setLong(1, gameId);
    try (ResultSet resultSet = statement.executeQuery()) {
        while (resultSet.next()) {
            long id = resultSet.getLong("id");
            String name = resultSet.getString("name");
            String type = resultSet.getString("type");
            int hull = resultSet.getInt("hull");
            System.out.println(id + " " + name + " " + type + " " + hull);
        }
    }
}
```

* On lit une colonne par son **nom** (`getString("name")`) ou par son **numéro** à partir de 1 (`getString(2)`). Le nom est plus lisible ; un nom inconnu lève une `SQLException` (`no such column: 'nope'`).
* Choisis le getter selon le type : `getInt`, `getLong`, `getString`, `getDouble`, `getBoolean`...
* Il faut **fermer** le `ResultSet` (le `try-with-resources` s'en charge ; fermer le `Statement` le ferme aussi, mais l'écrire reste plus clair).

### Le piège du `NULL`

Une colonne SQL peut contenir `NULL`. `getString` retourne alors `null`, mais `getInt` ne peut pas retourner `null` : elle retourne **`0`**. Pour distinguer un vrai `0` d'un `NULL`, appelle **`wasNull()` juste après la lecture** de la colonne :

```java
int hull = resultSet.getInt("hull");
if (resultSet.wasNull()) {
    // la colonne valait NULL
}
```

(`wasNull()` concerne la **dernière colonne lue**. Vérifié : pour `SELECT NULL AS n`, `getInt` retourne `0` et `wasNull()` retourne `true`.) `getObject("n")` retourne `null`, et un `Integer` peut donc représenter l'absence de valeur.

### Transformer des lignes en objets

On ne veut pas passer des `ResultSet` dans tout le programme : on les convertit en **objets**. Des **records** (Java 16, classes immuables concises, chapitre 14) conviennent bien :

```java
public record ShipRow(long id, String name, String type, int hull) {}

public record GameRow(long id, String playerName, LocalDateTime savedAt,
                      int gold, List<ShipRow> ships) {}
```

Un `record` génère le constructeur, les accesseurs (`name()` et non `getName()`), `equals`, `hashCode` et `toString`.

### Les jointures

Pour charger les parties **avec** leurs navires, on utilise une jointure : une ligne par navire, avec les données de la partie répétées. `LEFT JOIN` conserve aussi une partie **sans navire** (les colonnes du navire valent alors `NULL`) :

```sql
SELECT g.id, g.player_name, g.saved_at, g.gold, s.id, s.name, s.type, s.hull
FROM game g LEFT JOIN ship s ON s.game_id = g.id
ORDER BY g.id, s.id
```

Le code regroupe les lignes par partie avec une `Map` (chapitre 13) et utilise `wasNull()` pour savoir si la ligne contient un navire (voir la classe complète plus bas).

## Les transactions

### Le problème

Sauvegarder une partie, c'est **plusieurs** requêtes : une ligne `game`, puis une ligne `ship` par navire. Si la deuxième échoue (disque plein, contrainte violée), on se retrouve avec une partie **à moitié sauvegardée**.

Test fait : on insère une partie, puis un navire invalide, **sans** transaction. L'insertion de la partie reste en base, sans ses navires.

### La solution : une transaction

Une **transaction** regroupe plusieurs requêtes en un bloc **tout ou rien** : soit toutes réussissent (`commit`), soit aucune n'est conservée (`rollback`).

Par défaut, une connexion est en **mode auto-commit** : chaque requête est validée immédiatement (`getAutoCommit()` retourne `true`). Pour grouper :

1. `connection.setAutoCommit(false)` : on démarre la transaction ;
2. on exécute les requêtes ;
3. `connection.commit()` si tout s'est bien passé ;
4. `connection.rollback()` dans le `catch`, si une requête a échoué.

```java
try (Connection connection = Database.connect()) {
    connection.setAutoCommit(false);
    try {
        // 1. insérer la partie, récupérer son id
        // 2. insérer chaque navire
        connection.commit();
        return gameId;
    } catch (SQLException e) {
        connection.rollback();
        throw e;
    }
} catch (SQLException e) {
    throw new DatabaseException("Sauvegarde impossible", e);
}
```

Le `try` interne gère la transaction (annuler en cas d'erreur, puis relancer l'exception), le `try` externe gère la connexion et la conversion vers `DatabaseException`.

Test fait : en sauvegardant deux navires dont le second a un type invalide (`raft`), la sauvegarde échoue avec `Sauvegarde impossible` (cause : `CHECK constraint failed: type IN ('sloop', 'galleon')`), et la base ne contient **ni la partie ni le premier navire** : rollback réussi.

> Ne compte pas sur la fermeture de la connexion pour annuler : ce que fait une connexion fermée **sans** `commit` ni `rollback` dépend du driver (avec le driver SQLite testé, la ligne n'était pas conservée). **Toujours** `commit` ou `rollback` explicitement.

## Ranger le code : la classe d'accès aux données

Tout le code SQL est regroupé dans le package `db`, derrière une classe dont les méthodes parlent le langage du jeu (`saveGame`, `loadGames`, `updateHull`). Le reste du programme n'importe jamais `java.sql`.

```java
public class GameRepository {

    public record NewShip(String name, String type, int hull) {}
    public record ShipRow(long id, String name, String type, int hull) {}
    public record GameRow(long id, String playerName, LocalDateTime savedAt,
                          int gold, List<ShipRow> ships) {}

    public long saveGame(String playerName, int gold, List<NewShip> ships) {
        String insertGame = "INSERT INTO game (player_name, saved_at, gold) VALUES (?, ?, ?)";
        String insertShip = "INSERT INTO ship (game_id, name, type, hull) VALUES (?, ?, ?, ?)";
        try (Connection connection = Database.connect()) {
            connection.setAutoCommit(false);
            try {
                long gameId;
                try (PreparedStatement statement = connection.prepareStatement(insertGame)) {
                    statement.setString(1, playerName);
                    statement.setString(2, LocalDateTime.now().toString());
                    statement.setInt(3, gold);
                    statement.executeUpdate();
                }
                try (Statement statement = connection.createStatement();
                     ResultSet resultSet = statement.executeQuery("SELECT last_insert_rowid()")) {
                    resultSet.next();
                    gameId = resultSet.getLong(1);
                }
                try (PreparedStatement statement = connection.prepareStatement(insertShip)) {
                    for (NewShip ship : ships) {
                        statement.setLong(1, gameId);
                        statement.setString(2, ship.name());
                        statement.setString(3, ship.type());
                        statement.setInt(4, ship.hull());
                        statement.executeUpdate();
                    }
                }
                connection.commit();
                return gameId;
            } catch (SQLException e) {
                connection.rollback();
                throw e;
            }
        } catch (SQLException e) {
            throw new DatabaseException("Sauvegarde impossible", e);
        }
    }

    public List<GameRow> loadGames() {
        String sql = "SELECT g.id, g.player_name, g.saved_at, g.gold, s.id, s.name, s.type, s.hull "
                + "FROM game g LEFT JOIN ship s ON s.game_id = g.id ORDER BY g.id, s.id";
        Map<Long, GameRow> games = new LinkedHashMap<>();
        try (Connection connection = Database.connect();
             PreparedStatement statement = connection.prepareStatement(sql);
             ResultSet resultSet = statement.executeQuery()) {
            while (resultSet.next()) {
                long gameId = resultSet.getLong("id");
                GameRow game = games.get(gameId);
                if (game == null) {
                    game = new GameRow(gameId, resultSet.getString("player_name"),
                            LocalDateTime.parse(resultSet.getString("saved_at")),
                            resultSet.getInt("gold"), new ArrayList<>());
                    games.put(gameId, game);
                }
                long shipId = resultSet.getLong(5);
                if (!resultSet.wasNull()) {      // la partie a un navire sur cette ligne
                    game.ships().add(new ShipRow(shipId, resultSet.getString(6),
                            resultSet.getString(7), resultSet.getInt(8)));
                }
            }
        } catch (SQLException e) {
            throw new DatabaseException("Chargement impossible", e);
        }
        return new ArrayList<>(games.values());
    }

    public boolean updateHull(long shipId, int hull) {
        String sql = "UPDATE ship SET hull = ? WHERE id = ?";
        try (Connection connection = Database.connect();
             PreparedStatement statement = connection.prepareStatement(sql)) {
            statement.setInt(1, hull);
            statement.setLong(2, shipId);
            return statement.executeUpdate() == 1;
        } catch (SQLException e) {
            throw new DatabaseException("Mise à jour impossible", e);
        }
    }
}
```

Résultat de test : une sauvegarde de deux navires puis `loadGames()` donne `GameRow[id=1, playerName=Anne, savedAt=..., gold=120, ships=[ShipRow[id=1, name=Black Wave, ...], ShipRow[id=2, name=Royal Fortune, ...]]]`. Une partie sans navire est bien chargée, avec une liste vide. `updateHull(2, 55)` retourne `true`, `updateHull(999, 1)` retourne `false`, et `updateHull(2, -1)` lève `DatabaseException` (cause : `CHECK constraint failed: hull >= 0`).

Les choix de conception :

* **Une connexion par opération**, ouverte et fermée dans un `try-with-resources`. Pour un fichier SQLite local, c'est rapide et simple ; on ne garde pas de connexion ouverte dans un attribut statique ou un Singleton.
* **Les contrôles dans le programme et dans la base** : le jeu vérifie les valeurs (chapitre 12) ; les contraintes de la base rattrapent ce qui lui échappe.
* **Les exceptions** : toute `SQLException` est convertie en `DatabaseException` avec un message utile et la **cause** conservée.
* **Les records** transportent les données entre la base et le jeu.

## Les erreurs classiques

| Erreur | Message ou symptôme | Explication |
| --- | --- | --- |
| Construire le SQL par concaténation | `near "Malley": syntax error`, ou injection SQL | Utiliser `PreparedStatement` et des `?`. |
| Oublier `PRAGMA foreign_keys = ON` | des lignes orphelines sont acceptées | À activer à **chaque** connexion. |
| Utiliser le driver sans la dépendance | `No suitable driver found for jdbc:sqlite:...` | Ajouter `sqlite-jdbc` au `pom.xml` et recharger Maven. |
| Ne pas fermer les connexions | fuite de ressources | `try-with-resources`. |
| Numéroter les paramètres ou colonnes à partir de 0 | décalage, ou `ArrayIndexOutOfBoundsException` | JDBC commence à **1**. |
| `getInt` sur une colonne `NULL` | retourne `0` | Tester `wasNull()` juste après. |
| Plusieurs requêtes liées sans transaction | données à moitié enregistrées | `setAutoCommit(false)`, `commit`, `rollback`. |
| Oublier `commit` | rien n'est conservé | Toujours `commit` ou `rollback` explicitement. |
| `jdbc:sqlite::memory:` pour persister | chaque connexion a sa propre base vide | Utiliser un fichier. |
| Laisser une `SQLException` se propager partout | signatures encombrées | La convertir en exception du programme avec la cause. |
| Chemin de fichier relatif mal compris | le fichier est créé ailleurs | Afficher `getAbsolutePath()`. |
| Charger tout `ResultSet` en mémoire sans besoin | lenteur sur de gros résultats | Ne sélectionner que les colonnes utiles, filtrer en SQL. |

## Variante : MySQL

Avec MySQL, la base est un **serveur** séparé, qu'il faut installer et configurer. Le code Java reste presque identique : seuls le **driver** et l'**URL** changent. Cette section n'a pas été testée pour ce cours : vérifie-la avec ton installation.

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version><!-- dernière version stable sur Maven Central --></version>
</dependency>
```

```java
Connection connection = DriverManager.getConnection(
        "jdbc:mysql://localhost:3306/pirates", "pirate_user", "mot-de-passe");
```

Les différences à prévoir :

* l'URL contient la machine, le **port** (3306 par défaut) et le **nom de la base**, qu'il faut avoir créée au préalable (`CREATE DATABASE`) ;
* il faut un **utilisateur** et un **mot de passe** (jamais écrits en dur dans un code public : on les lit dans la configuration) ;
* pas de `PRAGMA foreign_keys` : les clés étrangères sont appliquées par défaut avec le moteur InnoDB ;
* la clé auto-incrémentée s'écrit `AUTO_INCREMENT` (et non `AUTOINCREMENT`) ;
* les types sont plus stricts (`DATETIME`, `BOOLEAN`...) ;
* `getGeneratedKeys()` est le moyen standard de récupérer un identifiant généré.

## À retenir

* **JDBC** (`java.sql`) est l'API standard d'accès aux bases ; le **driver** fournit les classes concrètes.
* Avec Maven, le driver se déclare dans le `pom.xml`. L'URL SQLite est `jdbc:sqlite:fichier.db` (créé s'il n'existe pas).
* SQLite : `PRAGMA foreign_keys = ON` à **chaque connexion**.
* `Connection`, `Statement`, `PreparedStatement` et `ResultSet` se ferment avec `try-with-resources`.
* **Toute valeur variable passe par un `?`** d'un `PreparedStatement` : jamais de concaténation. Numérotation à partir de **1**.
* `executeUpdate` (modification, retourne un nombre de lignes), `executeQuery` (lecture, retourne un `ResultSet`).
* `ResultSet` : `next()` pour avancer, getters par nom ou numéro, `wasNull()` pour détecter `NULL`.
* **Transaction** : `setAutoCommit(false)`, `commit`, `rollback`. Tout ou rien.
* On range le SQL dans une classe d'accès (package `db`) et on convertit `SQLException` en exception du programme, avec la cause.

## À toi de jouer

1. Crée un projet Maven, ajoute `sqlite-jdbc` et ouvre une connexion à `jdbc:sqlite:pirates.db`. Où le fichier a-t-il été créé ? Vérifie avec `getAbsolutePath()`.
2. Écris `Database.connect()` avec le `PRAGMA`. Insère un navire qui référence une partie inexistante : avec le `PRAGMA`, puis sans. Que constates-tu ?
3. Crée les tables `game` et `ship` avec `createTables()`. Appelle-la deux fois : que se passe-t-il, et pourquoi ?
4. Insère une partie avec `PreparedStatement`, y compris un joueur nommé `O'Malley`. Écris ensuite la même recherche par concaténation et lis l'erreur.
5. Teste avec le nom `x' OR '1'='1` en concaténation, puis en requête préparée. Compare le nombre de lignes retournées.
6. Écris `loadGames()` avec la jointure et les records. Teste avec une partie sans navire.
7. Écris `updateHull` et vérifie le retour avec un identifiant inexistant. Essaie une valeur négative et lis le message.
8. Écris `saveGame` **sans** transaction et fais échouer le deuxième navire. Que reste-t-il en base ? Ajoute ensuite la transaction et refais le test.
9. Ouvre le fichier avec `sqlite3 pirates.db` et vérifie les données avec un `SELECT`.
10. (Pour aller plus loin) Ajoute une méthode `deleteGame(long id)` et vérifie que les navires sont supprimés avec `ON DELETE CASCADE`. Ajoute un score dans la table `game`, et écris une requête qui retourne les trois meilleurs.

## Pour aller plus loin

* [API Java SE 21 : le package `java.sql`](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html).
* [API Java SE 21 : `Connection`](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html) et [`PreparedStatement`](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html).
* [SQLite : le support des clés étrangères](https://sqlite.org/foreignkeys.html).
* [Le projet `sqlite-jdbc` (Xerial)](https://github.com/xerial/sqlite-jdbc) et [sa page Maven Central](https://central.sonatype.com/artifact/org.xerial/sqlite-jdbc).
