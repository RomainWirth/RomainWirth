# Interagir avec la Base de données

Maintenant que la base de données est initialisée et les tables créées, on va connecter la couche **modèles** (`models/`) à la couche **base de données** (`db/`).

Concrètement, cela signifie mettre à jour les méthodes du struct `Event` pour qu'elles exécutent de vraies requêtes SQL au lieu de manipuler une variable en mémoire. Deux types d'opérations sont nécessaires :

| Opération SQL | Méthode Go | Déclenchée par |
|---|---|---|
| `INSERT` | `Save()` | Route `POST /events` |
| `SELECT` | `GetAllEvents()` | Route `GET /events` |
| `SELECT ... WHERE id = ?` | `GetEventById()` | Route `GET /events/:id` |

On commence par l'écriture.

## Stocker des données : `Save()` avec INSERT

### Contexte : passage au receveur par pointeur

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

### La requête SQL : INSERT avec des paramètres liés

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

### `db.DB.Prepare()` : préparer le statement

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

### `stmt.Exec()` : exécuter avec les valeurs

```go
result, err := stmt.Exec(e.Name, e.Description, e.Location, e.DateTime, e.UserID)
if err != nil {
    return err
}
```

`stmt.Exec()` remplace les `?` par les valeurs passées **dans l'ordre**. Il exécute la requête et retourne un `sql.Result` et une erreur. En cas d'erreur (contrainte NOT NULL violée, type incompatible...), on la retourne.

### `result.LastInsertId()` : récupérer l'ID généré

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

### La fonction `Save()` complète

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

## Récupérer tous les événements : `GetAllEvents()` avec SELECT

La méthode `GetAllEvents()` existe déjà dans `models/event.go`. Pour l'instant, elle retourne simplement la slice en mémoire. On va la réécrire pour qu'elle lise toutes les lignes de la table `events` depuis la base de données.

### Mettre à jour la signature

`GetAllEvents()` doit maintenant pouvoir signaler un échec. On met à jour sa signature pour qu'elle retourne également une `error` :

```go
// Avant
func GetAllEvents() []Event { ... }

// Après
func GetAllEvents() ([]Event, error) { ... }
```

Les **retours nommés multiples** se déclarent entre parenthèses. En cas de succès on retournera `events, nil` (pas d'erreur), en cas d'échec `nil, err` (pas de données).

### La requête SQL : SELECT

La requête est simple - on veut toutes les colonnes de tous les événements :

```go
query := "SELECT * FROM events"
```

`SELECT *` sélectionne toutes les colonnes dans l'ordre où elles ont été définies lors du `CREATE TABLE` : `id`, `name`, `description`, `location`, `dateTime`, `user_id`. Cet ordre est important pour `Scan()` plus loin.

### `db.DB.Query()` vs `db.DB.Exec()`

On utilise `db.DB.Query()` et non `db.DB.Exec()`. La distinction est fondamentale :

| Méthode | Retour | Usage |
|---|---|---|
| `Exec()` | `sql.Result` | Requêtes qui **modifient** des données : INSERT, UPDATE, DELETE, CREATE |
| `Query()` | `*sql.Rows` | Requêtes qui **lisent** des données : SELECT |

`Query()` retourne un curseur `*sql.Rows` - une référence vers les lignes résultat maintenues côté base de données - ainsi qu'une erreur :

```go
rows, err := db.DB.Query(query)
if err != nil {
    return nil, err
}
defer rows.Close()
```

Le `defer rows.Close()` est ici aussi essentiel : `*sql.Rows` maintient une connexion ouverte du pool tant qu'il n'est pas fermé. Sans `Close()`, cette connexion ne serait jamais rendue au pool, ce qui finirait par l'épuiser. On le place juste après la vérification d'erreur pour garantir qu'il sera toujours exécuté.

### Parcourir les lignes avec `rows.Next()` et `rows.Scan()`

`Query()` ne retourne pas directement une slice : il retourne un curseur qu'on parcourt ligne par ligne.

```go
var events []Event

for rows.Next() {
    var event Event
    err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
    if err != nil {
        return nil, err
    }
    events = append(events, event)
}
```

**`rows.Next()`** avance le curseur d'une ligne et retourne `true` tant qu'il reste des lignes à lire. Quand toutes les lignes ont été parcourues (ou en cas d'erreur interne), il retourne `false` et la boucle s'arrête.

**`rows.Scan()`** lit le contenu de la ligne courante et le copie dans les variables passées en argument. Chaque argument doit être un **pointeur** vers la variable à remplir (`&event.ID`, `&event.Name`...), dans le même ordre que les colonnes retournées par la requête SQL.

C'est le même principe que `fmt.Scan()` : on passe des pointeurs pour que la fonction puisse écrire directement dans les variables. Si l'ordre ne correspond pas ou qu'un type est incompatible, `Scan()` retourne une erreur.

On déclare la variable `event` **à l'intérieur** de la boucle : une nouvelle instance est ainsi créée à chaque itération, ce qui évite que les données d'une ligne ne contaminent la suivante.

### La fonction `GetAllEvents()` complète

```go
func GetAllEvents() ([]Event, error) {
    query := "SELECT * FROM events"

    rows, err := db.DB.Query(query)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []Event
    for rows.Next() {
        var event Event
        err := rows.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
        if err != nil {
            return nil, err
        }
        events = append(events, event)
    }

    return events, nil
}
```

## Mettre à jour `main.go`

Les deux handlers touchés par ces changements doivent être mis à jour pour gérer les erreurs renvoyées par les méthodes du modèle.

### Mise à jour du handler `getEvents()`

`GetAllEvents()` retourne maintenant deux valeurs. Le handler doit capturer les deux et répondre avec une erreur `500` si la lecture échoue :

```go
func getEvents(context *gin.Context) {
    events, err := models.GetAllEvents()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch events. Try again later."})
        return
    }
    context.JSON(http.StatusOK, events)
}
```

Si `GetAllEvents()` réussit, `err` vaut `nil`, la condition est ignorée, et on retourne la slice `events` directement sérialisée en JSON par Gin avec un statut `200 OK`.

### Mise à jour du handler `createEvent()`

`Save()` retourne maintenant une `error`. Le handler doit la capturer et répondre avec une erreur `500` si l'insertion échoue :

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
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create event. Try again later."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Event created!", "event": event})
}
```

`event.Save()` est appelé avec `=` (et non `:=`) car la variable `err` est déjà déclarée par le premier `ShouldBindJSON`. Go réutilise la même variable. Après l'appel, `event.ID` contient l'identifiant généré par SQLite (grâce au receveur pointeur de `Save()`), et on l'inclut dans la réponse JSON via `"event": event`.

### Vérifier en local

On lance le serveur : `go run .`, puis on envoie une requête `POST /events` via le fichier `create-event.http`. Les données sont maintenant **persistées** dans `api.db`.

On peut couper le serveur (`Ctrl+C`), le relancer, puis envoyer une requête `GET /events` via `get-events.http` : les événements créés précédemment sont bien renvoyés - ils survivent au redémarrage du serveur, ce qui confirme que la persistance fonctionne.

### Récapitulatif : `Prepare()`, `Exec()` et `Query()`

Dans les sections précédentes, on a interagi avec la base de données de trois façons différentes. Voici un tableau de synthèse :

| Méthode utilisée | Où | Opération SQL |
|---|---|---|
| `db.DB.Exec(query)` | `createTables()` dans `db.go` | `CREATE TABLE` |
| `db.DB.Prepare(query)` + `stmt.Exec(...)` | `Save()` dans `models/event.go` | `INSERT` |
| `db.DB.Query(query)` | `GetAllEvents()` dans `models/event.go` | `SELECT` |

### La règle de base : `Exec()` vs `Query()`

La distinction fondamentale, indépendamment de `Prepare()`, est la suivante :

| Méthode | Quand l'utiliser |
|---|---|
| `Exec()` | La requête **modifie** des données ou la structure : `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP` |
| `Query()` | La requête **lit** des données et retourne des lignes : `SELECT` |

`Exec()` retourne un `sql.Result` (nombre de lignes affectées, dernier ID inséré...).
`Query()` retourne un `*sql.Rows` (curseur sur les lignes résultat).

Utiliser `Query()` pour un `INSERT` ou `Exec()` pour un `SELECT` fonctionnerait techniquement dans certains cas, mais c'est une mauvaise pratique : les types de retour ne correspondent pas à l'usage attendu et le code devient trompeur.

### `Prepare()` : quand est-ce réellement utile ?

`Prepare()` est **toujours optionnel**. On peut toujours appeler directement `db.DB.Exec(query, args...)` ou `db.DB.Query(query, args...)` avec les valeurs en paramètres - la protection contre les injections SQL fonctionne de la même façon dans les deux cas, car `database/sql` utilise des paramètres liés dans tous les cas.

L'avantage de `Prepare()` est la **performance** : le moteur SQL compile et optimise la requête une seule fois lors de l'appel à `Prepare()`. Les appels suivants à `stmt.Exec()` ou `stmt.Query()` réutilisent cette version compilée, sans retraitement.

Cet avantage est **réel uniquement si le statement préparé est réutilisé plusieurs fois sans être fermé** entre les exécutions. Par exemple :

```go
// Cas où Prepare() apporte un gain réel :
// on insère 1000 événements en une seule opération batch
stmt, err := db.DB.Prepare("INSERT INTO events (name) VALUES (?)")
if err != nil { ... }
defer stmt.Close() // fermé UNE SEULE FOIS, après la boucle entière

for _, name := range eventNames {
    _, err = stmt.Exec(name)
    if err != nil { ... }
}
```

### Le cas de notre `Save()` : pas de gain réel

Dans notre implémentation de `Save()`, on fait :

```go
stmt, err := db.DB.Prepare(query)
if err != nil { return err }
defer stmt.Close()          // ← fermé à la fin de Save()

result, err := stmt.Exec(...) // ← exécuté une seule fois
```

`stmt.Close()` est exécuté à la fin de `Save()` - c'est-à-dire après un seul `stmt.Exec()`. Le statement est donc préparé, utilisé une fois, puis détruit. Il n'y a **aucun gain de performance** par rapport à un simple `db.DB.Exec(query, args...)`.

On a utilisé `Prepare()` ici pour deux raisons :
1. **Montrer le mécanisme** - comprendre la séparation entre la préparation et l'exécution est utile pour les cas où elle compte vraiment.
2. **Cohérence pédagogique** - introduire `*sql.Stmt` et ses méthodes (`Exec`, `Close`) comme des concepts distincts.

En production, pour une insertion unique comme `Save()`, écrire directement `db.DB.Exec(query, args...)` serait tout aussi correct et légèrement plus concis.

## Récupérer un événement par son ID : `GetEventByID()` avec SELECT WHERE

L'API doit pouvoir retourner un seul événement identifié par son `id`. Cela nécessite trois choses : une nouvelle route dans `main.go`, une nouvelle fonction dans `models/event.go`, et l'import du package `strconv`.

### Ajouter la route et le handler dans `main.go`

Gin permet de déclarer des **segments dynamiques** dans un chemin de route avec la syntaxe `/:nomDuParametre`. Ce paramètre capture la valeur correspondante dans l'URL et la rend accessible dans le handler.

On enregistre la nouvelle route dans `main()` :

```go
server.GET("/events/:eventId", getEvent)
```

La partie `:eventId` définit un paramètre nommé `eventId`. Gin associera automatiquement la valeur de ce segment à ce nom dans le handler. Par exemple, une requête `GET /events/3` donnera `eventId = "3"`.

Le handler `getEvent` doit ensuite :
1. Lire la valeur du paramètre via `context.Param("eventId")` - qui retourne toujours une `string`
2. La convertir en `int64` via `strconv.ParseInt()`
3. Interroger la base de données
4. Retourner l'événement ou une erreur

`strconv.ParseInt()` prend trois arguments :
- la chaîne à convertir
- la **base** de numération (10 = système décimal)
- la **taille en bits** du type cible (64 pour `int64`)

Elle retourne la valeur convertie et une erreur. Si la chaîne n'est pas un nombre valide (ex. `"abc"`), l'erreur est non-nulle et on répond `400 Bad Request` :

```go
func getEvent(context *gin.Context) {
    eventId, err := strconv.ParseInt(context.Param("eventId"), 10, 64)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id."})
        return
    }
}
```

Il faut également ajouter `"strconv"` aux imports de `main.go` :

```go
import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/romainw/event-booking-api/db"
    "github.com/romainw/event-booking-api/models"
)
```

### Ajouter `GetEventByID()` dans `models/event.go`

On ajoute une nouvelle **fonction** (pas une méthode - pas de receveur) dans `models/event.go`. Elle prend un `id int64` et retourne `(*Event, error)`.

**Pourquoi retourner `*Event` et non `Event` ?**

En cas d'erreur (aucun événement trouvé, problème de lecture...), on veut pouvoir retourner `nil` pour signaler l'absence de valeur. Or un struct `Event` ne peut pas être `nil` - sa valeur zéro est `Event{}` (struct vide), qui est une valeur valide.

Un **pointeur** `*Event`, en revanche, a bien `nil` comme valeur zéro : il ne pointe vers rien. C'est donc le type adapté pour exprimer "soit un événement, soit rien".

```go
// impossible de retourner nil avec ce type
func GetEventByID(id int64) (Event, error) { ... }

// nil est une valeur valide pour un pointeur
func GetEventByID(id int64) (*Event, error) { ... }
```

### `db.DB.QueryRow()` : lire une seule ligne

On utilise `QueryRow()` plutôt que `Query()`. La différence est essentielle :

| Méthode | Retour | Usage |
|---|---|---|
| `Query()` | `*sql.Rows` (curseur multi-lignes) | `SELECT` pouvant retourner plusieurs lignes |
| `QueryRow()` | `*sql.Row` (une seule ligne) | `SELECT` avec un résultat attendu unique |

`QueryRow()` ne retourne **jamais d'erreur directement** - contrairement à `Query()`. L'erreur éventuelle est conservée dans l'objet `*sql.Row` et n'est surfacée que lors de l'appel à `Scan()`. Si aucune ligne ne correspond à la requête, `Scan()` retourne l'erreur sentinelle `sql.ErrNoRows`.

```go
query := "SELECT * FROM events WHERE id = ?"
row := db.DB.QueryRow(query, id)
```

Le second argument `id` remplace le `?` de la requête - même mécanisme de paramètres liés que pour `Exec()`.

Il n'y a **pas de `defer row.Close()`** ici : `*sql.Row` (au singulier) est automatiquement fermé après l'appel à `Scan()`.

### `row.Scan()` : lire les données de la ligne

On lit la ligne avec `Scan()`, exactement comme dans `GetAllEvents()`, mais sans boucle :

```go
var event Event
err := row.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
if err != nil {
    return nil, err
}
return &event, nil
```

En cas d'erreur (incluant `sql.ErrNoRows` si l'`id` n'existe pas en base), on retourne `nil, err`. En cas de succès, on retourne `&event` - l'adresse de la variable locale `event` - ce qui en fait un pointeur `*Event`.

> **Note :** retourner `nil, err` sans distinguer `sql.ErrNoRows` des autres erreurs donne un statut `500` même quand l'événement n'existe simplement pas. En production on distinguerait les deux cas pour retourner un `404 Not Found` approprié. Pour ce cours, on simplifie en traitant toutes les erreurs de la même façon.

### La fonction `GetEventByID()` complète

```go
func GetEventByID(id int64) (*Event, error) {
    query := "SELECT * FROM events WHERE id = ?"
    row := db.DB.QueryRow(query, id)

    var event Event
    err := row.Scan(&event.ID, &event.Name, &event.Description, &event.Location, &event.DateTime, &event.UserID)
    if err != nil {
        return nil, err
    }
    return &event, nil
}
```

### Finaliser le handler `getEvent()`

On complète le handler en appelant `GetEventByID()` avec l'`id` récupéré depuis la route :

```go
func getEvent(context *gin.Context) {
    eventId, err := strconv.ParseInt(context.Param("eventId"), 10, 64)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id."})
        return
    }

    event, err := models.GetEventByID(eventId)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event."})
        return
    }
    context.JSON(http.StatusOK, event)
}
```

`event` est ici de type `*Event`. Gin sérialise un pointeur vers un struct comme un **objet JSON** `{...}` - et non comme un tableau `[...]`.

### Tester la nouvelle route

On crée un fichier `get-single-event.http`. On récupère d'abord un `id` valide via `get-events.http` :

```
GET http://localhost:8080/events
```

Réponse :
```json
[
  {
    "id": 1,
    "name": "Test event",
    "description": "A test event",
    "location": "A test location",
    "dateTime": "2026-07-20T18:00:00Z",
    "userId": 1
  }
]
```

L'événement en base a l'`id` `1`. On teste la nouvelle route :

```
GET http://localhost:8080/events/1
```

Réponse - un **objet** JSON (et non un tableau, contrairement à `GET /events`) :
```json
{
  "id": 1,
  "name": "Test event",
  "description": "A test event",
  "location": "A test location",
  "dateTime": "2026-07-20T18:00:00Z",
  "userId": 1
}
```

**Cas d'erreur 1 - paramètre non numérique** : `GET http://localhost:8080/events/abc`

`strconv.ParseInt` échoue, le handler retourne immédiatement :
```json
HTTP/1.1 400 Bad Request

{
  "message": "Could not parse event id."
}
```

**Cas d'erreur 2 - ID inexistant en base** : `GET http://localhost:8080/events/99`

`QueryRow()` ne trouve aucune ligne, `Scan()` retourne `sql.ErrNoRows` :
```json
HTTP/1.1 500 Internal Server Error

{
  "message": "Could not fetch event."
}
```

---

## Récapitulatif : interactions avec la base de données

Voici ce qui a été mis en place dans cette section :

| Opération | Méthode Go | Fichier | Méthode SQL utilisée |
|---|---|---|---|
| Créer un événement | `Save()` sur `*Event` | `models/event.go` | `Prepare()` + `stmt.Exec()` |
| Lire tous les événements | `GetAllEvents()` | `models/event.go` | `db.DB.Query()` + `rows.Scan()` |
| Lire un événement par ID | `GetEventByID(id)` | `models/event.go` | `db.DB.QueryRow()` + `row.Scan()` |
| Handler POST /events | `createEvent()` | `main.go` | appelle `event.Save()` |
| Handler GET /events | `getEvents()` | `main.go` | appelle `models.GetAllEvents()` |
| Handler GET /events/:id | `getEvent()` | `main.go` | appelle `models.GetEventByID(id)` |

**Concepts clés abordés :**

| Concept | Où il intervient |
|---|---|
| Receveur par pointeur `(e *Event)` | `Save()` - pour que `e.ID = id` soit visible après l'appel |
| Paramètres liés `?` | Toutes les requêtes - protection contre l'injection SQL |
| `defer rows.Close()` / `stmt.Close()` | Libère les ressources du pool de connexions |
| `Exec()` vs `Query()` vs `QueryRow()` | Écriture / lecture multi-lignes / lecture une ligne |
| Retour `*Event` vs `Event` | `GetEventByID()` - `nil` n'est possible que pour un pointeur |
| `strconv.ParseInt()` | Handler `getEvent()` - convertit le paramètre URL `string` en `int64` |

L'état de `models/event.go` à la fin de cette section reflète un struct `Event` avec des champs `int64`, trois opérations SQL fonctionnelles, et aucune donnée en mémoire - tout passe par la base de données.

La prochaine section ajoute les opérations manquantes du CRUD : **UPDATE** et **DELETE**, ainsi qu'un refactoring de la structure des routes dans `main.go`.
