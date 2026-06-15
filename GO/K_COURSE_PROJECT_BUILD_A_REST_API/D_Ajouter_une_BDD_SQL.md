# Ajouter une base de données SQL

L'objectif de cette section est d'ajouter une base de données locale avec SQLite, qui ne sera en fin de compte qu'un simple fichier ajouté au projet.
L'avantage est de ne pas avoir à installer d'outils supplémentaires pour disposer d'une base de données.

## Initialiser une base de données SQL

### Ajouter le package sql

La librairie standard de Go contient un package [`database/sql`](https://pkg.go.dev/database/sql).
Ce package fournit une interface générique pour interagir avec des bases de données SQL. Il est conçu pour fonctionner avec n'importe quel moteur de base de données, à condition d'utiliser conjointement un [driver adapté](https://go.dev/wiki/SQLDrivers).

Pour notre projet, nous allons utiliser le driver [go-sqlite3](https://github.com/mattn/go-sqlite3), qui prend en charge SQLite.

> **Note :** go-sqlite3 est un package **CGo** - il intègre du code C compilé (la bibliothèque SQLite elle-même). Cela signifie qu'il nécessite un compilateur C sur la machine (`gcc` sous Linux/macOS, `mingw` sous Windows). La première compilation sera **notablement plus lente** que pour un projet Go pur, le temps que CGo compile la bibliothèque C intégrée.

Pour ajouter le driver au projet :
```bash
go get github.com/mattn/go-sqlite3
```
Sortie terminal :
```bash
romainw@fedora:~/Public/perso/go/event-booking-api$ go get github.com/mattn/go-sqlite3
go: downloading github.com/mattn/go-sqlite3 v1.14.45
go: added github.com/mattn/go-sqlite3 v1.14.45
```

### Mise en place

On va ajouter un dossier `db/` à la racine du projet, qui contiendra un fichier `db.go`. C'est dans ce fichier que sera centralisé tout le code d'initialisation et de configuration de la base de données.

```
event-booking-api/
├── db/
│   └── db.go       ← nouveau fichier
├── models/
│   └── event.go
├── go.mod
├── go.sum
└── main.go
```

#### Import des packages et import "side-effect"

Le fichier `db.go` commence par déclarer son appartenance au package `db`, puis importer les deux packages nécessaires.

```go
package db

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
)
```

Le package `database/sql` est le package standard de Go avec lequel on interagira directement : il expose le type `*sql.DB`, les méthodes de requêtage, etc.

Le package `github.com/mattn/go-sqlite3` ne sera jamais appelé directement dans le code. Son rôle est de s'**enregistrer comme driver SQLite** auprès du package `database/sql` via sa fonction `init()`, qui s'exécute automatiquement au démarrage du programme. C'est suffisant pour que `sql.Open("sqlite3", ...)` fonctionne.

En Go, importer un package sans l'utiliser provoque une **erreur de compilation**. Pour signaler explicitement qu'un import est intentionnel et uniquement pour ses effets de bord (`init()`), on le préfixe d'un **underscore** `_`. Cette convention s'appelle un **blank import** (ou **import side-effect**).

#### Créer la variable globale et la fonction d'initialisation

On déclare une variable globale `DB` de type `*sql.DB`. Déclarée au niveau du package, elle sera accessible depuis toute autre partie de l'application qui importera le package `db`, ce qui permettra à n'importe quel handler ou modèle d'interagir avec la base de données.

```go
var DB *sql.DB
```

Puis on crée la fonction `InitDB()` (majuscule = exportée, donc accessible depuis `main`), responsable d'ouvrir la base de données et de configurer le pool de connexions.

On utilise `sql.Open()`, qui prend deux paramètres :
- le **nom du driver** : `"sqlite3"` - doit correspondre exactement au nom utilisé lors de l'enregistrement dans `init()` du driver
- la **source de données** (DSN) : pour SQLite, c'est simplement le chemin vers le fichier `.db`. Si le fichier n'existe pas encore, il sera créé automatiquement.

```go
func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "api.db")
}
```

> **Important :** `sql.Open()` ne crée **pas** de connexion vers la base de données. Elle valide les arguments et initialise l'objet pool `*sql.DB`. Les connexions réelles sont établies **de façon paresseuse** (lazy), à la première requête SQL. On utilise `=` (et non `:=`) car `DB` est déjà déclarée en variable globale - `:=` créerait une variable locale qui masquerait la globale.

#### Gestion de l'erreur

Si `sql.Open()` retourne une erreur (driver inconnu, arguments invalides...), on appelle `panic()` pour interrompre immédiatement l'exécution. Il n'a aucun sens de démarrer l'application si la base de données est inaccessible.

```go
if err != nil {
    panic("Could not connect to database.")
}
```

> **À noter :** `panic()` est appelé ici **lors du démarrage de l'application**, avant que le serveur Gin ne soit lancé. Le middleware `Recovery` de `gin.Default()` intercepte les panics **pendant le traitement des requêtes HTTP** (dans les handlers), pas pendant l'initialisation. Un `panic()` à ce stade provoquera bien un **crash complet du programme** - ce qui est le comportement voulu : mieux vaut échouer fort et tôt que démarrer silencieusement dans un état cassé.

#### Configurer le pool de connexions

Une fois la base de données ouverte, on configure le **pool de connexions** géré automatiquement par `database/sql`. Le pool évite de créer et détruire une connexion à chaque requête SQL, ce qui serait coûteux.

```go
DB.SetMaxOpenConns(10)
DB.SetMaxIdleConns(5)
```

| Méthode | Rôle |
|---|---|
| `SetMaxOpenConns(10)` | Limite à 10 le nombre de connexions **ouvertes simultanément** vers la BDD. Au-delà, les goroutines en attente d'une connexion seront mises en file jusqu'à ce qu'une se libère. |
| `SetMaxIdleConns(5)` | Autorise le pool à conserver jusqu'à 5 connexions **inactives** (non utilisées) plutôt que de les fermer immédiatement après usage. Elles sont disponibles pour la prochaine requête sans le coût d'ouverture d'une nouvelle connexion. |

Ces valeurs ne forcent pas l'ouverture de connexions à l'avance : le pool crée des connexions à la demande et en recycle jusqu'à 5 en veille.

État du fichier `db.go` à ce stade :

```go
package db

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "api.db")

    if err != nil {
        panic("Could not connect to database.")
    }

    DB.SetMaxOpenConns(10)
    DB.SetMaxIdleConns(5)
}
```

### Créer les tables dans la base de données

#### Rappel : les tables SQL

Une **table** est la structure de base d'une base de données relationnelle. On peut la concevoir comme un tableau :
- chaque **colonne** (champ) représente un attribut d'une entité (`name`, `location`...)
- chaque **ligne** (enregistrement) représente une instance de cette entité - un événement, un utilisateur...

Chaque colonne est déclarée avec un **type SQL** (`TEXT`, `INTEGER`, `DATETIME`...) et des **contraintes** (`NOT NULL`, `PRIMARY KEY`, `AUTOINCREMENT`...).

La table `events` est le reflet SQL du struct `Event` défini dans `models/event.go` :

| Champ Go (`Event`) | Colonne SQL | Type SQL | Contraintes |
|---|---|---|---|
| `ID int` | `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` |
| `Name string` | `name` | `TEXT` | `NOT NULL` |
| `Description string` | `description` | `TEXT` | `NOT NULL` |
| `Location string` | `location` | `TEXT` | `NOT NULL` |
| `DateTime time.Time` | `dateTime` | `DATETIME` | `NOT NULL` |
| `UserID int` | `user_id` | `INTEGER` | - |

`PRIMARY KEY` identifie chaque ligne de façon unique. `AUTOINCREMENT` délègue à SQLite la génération automatique de cet identifiant à chaque insertion - c'est pour cette raison que `UserID` n'a pas de contrainte `NOT NULL` : il sera renseigné plus tard, lorsqu'on ajoutera l'authentification.

#### La fonction `createTables()`

On ajoute une fonction **non-exportée** `createTables()` (minuscule = privée au package `db`), appelée automatiquement par `InitDB()`. Elle n'a aucune raison d'être exposée à l'extérieur du package.

Les chaînes de caractères multi-lignes s'écrivent en Go avec des **backticks** `` ` `` (raw string literals), exactement comme les template literals en JavaScript.

La requête utilise `CREATE TABLE IF NOT EXISTS` : si la table existe déjà (lors d'un redémarrage du serveur par exemple), elle n'est pas recréée et aucune erreur n'est levée.

```go
func createTables() {
    createEventsTable := `
    CREATE TABLE IF NOT EXISTS events (
        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
        name        TEXT     NOT NULL,
        description TEXT     NOT NULL,
        location    TEXT     NOT NULL,
        dateTime    DATETIME NOT NULL,
        user_id     INTEGER
    )
    `

    _, err := DB.Exec(createEventsTable)

    if err != nil {
        panic("Could not create events table.")
    }
}
```

`DB.Exec()` exécute une requête SQL qui ne retourne pas de lignes (INSERT, UPDATE, DELETE, CREATE...). Elle retourne un `sql.Result` et une erreur. Le résultat (`sql.Result`) ne nous intéresse pas ici - on l'ignore avec `_` - et on gère uniquement l'erreur avec un `panic()` si la création de table échoue.

#### Appeler `createTables()` depuis `InitDB()`

`createTables()` est appelée en fin d'initialisation, après la configuration du pool :

```go
func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "api.db")

    if err != nil {
        panic("Could not connect to database.")
    }

    DB.SetMaxOpenConns(10)
    DB.SetMaxIdleConns(5)

    createTables()
}
```

### Appeler `InitDB()` depuis `main`

La dernière étape consiste à appeler `db.InitDB()` au démarrage de l'application, **avant** de lancer le serveur Gin, pour s'assurer que la base de données est prête avant de traiter la première requête :

```go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/romainw/event-booking-api/db"
    "github.com/romainw/event-booking-api/models"
)

func main() {
    db.InitDB()
    server := gin.Default()

    server.GET("/events", getEvents)
    server.POST("/events", createEvent)

    server.Run(":8080")
}
```

On démarre ensuite le serveur avec `go run .`. La première compilation sera plus lente que d'habitude en raison de la compilation CGo du package go-sqlite3 :

```bash
romainw@fedora:~/Public/perso/go/event-booking-api$ go run .
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /events                   --> main.getEvents (3 handlers)
[GIN-debug] POST   /events                   --> main.createEvent (3 handlers)
[GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
Please check https://github.com/gin-gonic/gin/blob/master/docs/doc.md#dont-trust-all-proxies for details.
[GIN-debug] Listening and serving HTTP on :8080
```

On peut aussi remarquer la création d'un nouveau fichier `api.db` à la racine du projet. Ce fichier **est** la base de données SQLite : il contient la définition des tables créées et, plus tard, toutes les données persistées. On interagit avec lui exclusivement via le package `database/sql` et des requêtes SQL.

---

### Récapitulatif : initialisation de la base de données

Voici ce qui a été mis en place dans cette section :

| Étape | Fichier | Ce qui a été fait |
|---|---|---|
| Ajout du driver | `go.mod` / `go.sum` | `go get github.com/mattn/go-sqlite3` ajoute le driver CGo SQLite |
| Package `db` | `db/db.go` | Nouveau package dédié à la base de données |
| Blank import `_` | `db/db.go` | Enregistre le driver SQLite auprès de `database/sql` via son `init()` |
| Variable globale `DB` | `db/db.go` | `*sql.DB` accessible depuis toute l'application |
| `InitDB()` | `db/db.go` | Ouvre la BDD (lazy), configure le pool, crée les tables |
| Pool de connexions | `db/db.go` | Max 10 connexions ouvertes, 5 connexions inactives en veille |
| `createTables()` | `db/db.go` | Crée la table `events` si elle n'existe pas (`IF NOT EXISTS`) |
| Appel au démarrage | `main.go` | `db.InitDB()` appelé avant `server.Run()` |
| Fichier BDD | `api.db` | Créé automatiquement par SQLite à la première ouverture |

Le flux d'exécution au démarrage est le suivant :

```
main() → db.InitDB() → sql.Open() → SetMaxOpenConns/SetMaxIdleConns → createTables() → DB.Exec(CREATE TABLE IF NOT EXISTS)
                    ↓
             gin.Default() → server.Run(":8080")
```

À ce stade, la base de données est opérationnelle et les tables sont créées. L'étape suivante est d'y **lire et écrire des données** depuis les handlers et les modèles.

---

## Interagir avec la Base de données

Maintenant que la base de données est initialisée et les tables créées, on va connecter la couche **modèles** (`models/`) à la couche **base de données** (`db/`).

Concrètement, cela signifie mettre à jour les méthodes du struct `Event` pour qu'elles exécutent de vraies requêtes SQL au lieu de manipuler une variable en mémoire. Deux types d'opérations sont nécessaires :

| Opération SQL | Méthode Go | Déclenchée par |
|---|---|---|
| `INSERT` | `Save()` | Route `POST /events` |
| `SELECT` | `GetAllEvents()` | Route `GET /events` |
| `SELECT ... WHERE id = ?` | `GetEventById()` | Route `GET /events/:id` |

On commence par l'écriture.

### Stocker des données : `Save()` avec INSERT

#### Contexte : passage au receveur par pointeur

La méthode `Save()` existe déjà dans `models/event.go`. Pour l'instant, elle ajoute simplement l'événement dans une slice en mémoire, sans persistance. On va la réécrire entièrement pour qu'elle insère une ligne dans la table `events`.

Avant d'écrire la logique, il faut corriger la signature de la méthode. En section C, on avait noté :

> À noter pour la suite : quand on intégrera une vraie base de données, `Save()` devra probablement utiliser un **receveur par pointeur** pour mettre à jour le champ `ID` avec l'ID auto-généré par la BDD.

C'est exactement ce moment. SQLite génère automatiquement l'`id` lors de l'insertion (`AUTOINCREMENT`). On veut récupérer cet `id` et l'assigner à `e.ID` pour que le code appelant puisse y accéder après l'appel à `Save()`.

Avec un **receveur par valeur** `(e Event)`, Go travaille sur une **copie** du struct : `e.ID = id` modifie la copie locale, l'original n'est pas touché.
Avec un **receveur par pointeur** `(e *Event)`, Go opère sur le struct **original en mémoire** : `e.ID = id` met bien à jour l'événement passé par l'appelant.

```go
// Avant (valeur) : e.ID = id ne persiste pas après l'appel
func (e Event) Save() error { ... }

// Après (pointeur) : e.ID = id est visible pour l'appelant
func (e *Event) Save() error { ... }
```

On met également à jour le type du champ `ID` dans le struct, qui doit passer de `int` à `int64` pour correspondre au type retourné par `LastInsertId()` (voir plus bas) :

```go
type Event struct {
    ID          int64     `json:"id"`   // int → int64
    Name        string    `json:"name"        binding:"required"`
    Description string    `json:"description" binding:"required"`
    Location    string    `json:"location"    binding:"required"`
    DateTime    time.Time `json:"dateTime"    binding:"required"`
    UserID      int64     `json:"userId"`
}
```

#### La requête SQL : INSERT avec des paramètres liés

On déclare la requête SQL sous forme de chaîne de caractères multi-lignes (backtick) :

```go
query := `
INSERT INTO events (name, description, location, dateTime, user_id)
VALUES (?, ?, ?, ?, ?)
`
```

Les `?` sont des **paramètres liés** (placeholders). Ils ne sont pas remplacés par une simple interpolation de texte : le driver SQL les traite séparément des données. C'est le mécanisme fondamental de protection contre les **injections SQL**.

> **Injection SQL** : une attaque qui consiste à insérer du code SQL malveillant dans les données envoyées par un utilisateur. Par exemple, si on construisait la requête par concaténation de chaînes : `"INSERT INTO events (name) VALUES ('" + userInput + "'")`
> Un attaquant pourrait passer comme valeur : `'); DROP TABLE events; --`, ce qui exécuterait `DROP TABLE events` sur la base.
> Avec les paramètres liés `?`, la valeur passée est **toujours traitée comme une donnée**, jamais comme du SQL. Le driver l'échappe ou l'envoie dans un canal séparé selon le protocole. L'attaque devient impossible.

#### `db.DB.Prepare()` : préparer le statement

On prépare le statement via la variable globale `db.DB` (le pool de connexions) :

```go
stmt, err := db.DB.Prepare(query)
if err != nil {
    return err
}
defer stmt.Close()
```

`Prepare()` envoie la requête SQL au moteur de base de données, qui la **compile et l'optimise une fois**. En retour, on obtient un `*sql.Stmt` - un statement prêt à être exécuté avec les valeurs réelles.

Si la préparation échoue (syntaxe SQL invalide, table inexistante...), on retourne l'erreur immédiatement : inutile de continuer.

Le `defer stmt.Close()` est placé **juste après la vérification d'erreur**. Le mot-clé `defer` programme l'exécution de `Close()` pour la fin de la fonction courante (`Save()`), qu'elle se termine normalement ou via un `return` anticipé. Cela garantit que les ressources associées au statement sont toujours libérées, même en cas d'erreur plus loin dans la fonction.

> **`Prepare()` vs `Exec()` direct** : `db.DB.Exec(query, args...)` prépare et exécute en une seule opération - c'est pratique pour les requêtes exécutées une seule fois. `Prepare()` est préférable quand on veut **exécuter le même statement plusieurs fois** (dans une boucle, par exemple) car la phase de compilation n'est faite qu'une seule fois. Ici, pour une insertion unique, les deux fonctionneraient ; on utilise `Prepare()` pour illustrer le mécanisme et par souci de cohérence avec le reste du cours.

#### `stmt.Exec()` : exécuter avec les valeurs

```go
result, err := stmt.Exec(e.Name, e.Description, e.Location, e.DateTime, e.UserID)
if err != nil {
    return err
}
```

`stmt.Exec()` remplace les `?` par les valeurs passées **dans l'ordre**. Il exécute la requête et retourne un `sql.Result` et une erreur. En cas d'erreur (contrainte NOT NULL violée, type incompatible...), on la retourne.

#### `result.LastInsertId()` : récupérer l'ID généré

```go
id, err := result.LastInsertId()
e.ID = id
return err
```

`LastInsertId()` retourne l'`id` généré automatiquement par SQLite lors de l'insertion (`AUTOINCREMENT`). Il est de type `int64` - c'est pour cela que le champ `ID` du struct a été mis à jour en `int64` plus haut.

On assigne cet `id` au champ `e.ID` du receveur - grâce au receveur par pointeur, cette modification est visible pour l'appelant.

Puis on `return err` directement, sans `if err != nil`. Cette écriture courante en Go est équivalente à :

```go
if err != nil {
    return err
}
return nil
```

Si `LastInsertId()` réussit, `err` vaut `nil` et `return err` retourne `nil` - ce qui signifie "succès". La fonction `Save()` ne retourne pas l'`id` : il est directement accessible via `event.ID` après l'appel, puisqu'on a utilisé un receveur par pointeur.

#### La fonction `Save()` complète

```go
func (e *Event) Save() error {
    query := `
    INSERT INTO events (name, description, location, dateTime, user_id)
    VALUES (?, ?, ?, ?, ?)
    `

    stmt, err := db.DB.Prepare(query)
    if err != nil {
        return err
    }
    defer stmt.Close()

    result, err := stmt.Exec(e.Name, e.Description, e.Location, e.DateTime, e.UserID)
    if err != nil {
        return err
    }

    id, err := result.LastInsertId()
    e.ID = id
    return err
}
```

Du côté du handler `createEvent` dans `main.go`, la gestion de l'erreur retournée par `Save()` doit également être mise à jour :

```go
func createEvent(context *gin.Context) {
    var event models.Event
    err := context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
        return
    }

    err = event.Save()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create event."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Event created!", "event": event})
}
```

`event.Save()` est maintenant appelé sur un **pointeur** (Go passe automatiquement l'adresse de `event` puisque la méthode a un receveur `*Event`). Après l'appel, `event.ID` contient l'identifiant généré par SQLite, qu'on peut inclure dans la réponse JSON.

### Récupérer des datas events (SELECT)

### Preparing statements vs directly executing queries

### Récupérer un événement avec son ID


