# Les événements CRUD

> **RAPPEL :** le CRUD signifie Create, Read, Update et Delete. Il s'agit des opérations standards dans l'interaction avec une API REST.

## Refactoriser le code et externaliser les routes

Avant d'aller plus loin dans le CRUD, on est obligé de constater que `main.go` commence à être encombré :
- 3 routes déclarées directement dans `main()`
- 3 handlers définis dans le même fichier
- Et ce n'est que le début : on va encore ajouter des routes pour les événements, puis pour les utilisateurs

La bonne pratique est d'externaliser la logique de routage dans un package dédié, pour que `main.go` reste un simple point d'entrée.

### Créer le package `routes`

On crée un dossier `routes/` à la racine du projet. Ce dossier va contenir deux fichiers :

```
event-booking-api/
├── db/
│   └── db.go
├── models/
│   └── event.go
├── routes/              ← nouveau dossier
│   ├── routes.go        ← enregistrement de toutes les routes
│   └── events.go        ← handlers pour les événements
├── go.mod
├── go.sum
└── main.go
```

**`routes/routes.go`** - ce fichier ne contiendra qu'une seule fonction, `RegisterRoutes()`, dont le rôle est d'enregistrer toutes les routes sur le serveur :

```go
package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(server *gin.Engine) {
    server.GET("/events", getEvents)
    server.GET("/events/:eventId", getEvent)
    server.POST("/events", createEvent)
}
```

`RegisterRoutes()` prend en paramètre un `*gin.Engine` - un pointeur vers le serveur Gin créé dans `main()`. Grâce au pointeur, la fonction opère directement sur le serveur d'origine : les routes sont enregistrées sur la même instance que celle qui sera démarrée par `server.Run()`. Aucune valeur de retour n'est nécessaire.

### Déplacer les handlers dans `routes/events.go`

Toujours dans le package `routes`, on crée un fichier `events.go` qui va accueillir les trois handlers déplacés depuis `main.go`.

Quelques points importants :

**Visibilité au sein d'un même package** - En Go, les fonctions dont le nom commence par une minuscule sont privées (non exportées). Mais "privé" signifie uniquement "inaccessible depuis un autre package". Au sein du même package, tous les fichiers se voient mutuellement. `routes.go` peut donc appeler `getEvents`, `getEvent` et `createEvent` définis dans `events.go` sans aucun problème, et sans avoir besoin de les exporter.

**Un placeholder temporaire** - Le handler `createEvent` assigne `event.UserID = 1` en dur. Il n'existe pas encore de système d'authentification dans le projet : on ne sait pas encore quel utilisateur crée l'événement. Cette valeur sera remplacée dans la section sur les utilisateurs et les JWT.

> **Note :** la ligne `event.ID = 1` qui existait dans l'ancienne version du handler est supprimée ici. Elle était incorrecte : c'est `Save()` qui assigne l'ID via `LastInsertId()` après l'insertion en base. Fixer l'ID manuellement avant `Save()` n'avait aucun effet utile.

```go
package routes

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "github.com/romainw/event-booking-api/models"
)

func getEvents(context *gin.Context) {
    events, err := models.GetAllEvents()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch events. Try again later."})
        return
    }
    context.JSON(http.StatusOK, events)
}

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

func createEvent(context *gin.Context) {
    var event models.Event
    err := context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
        return
    }

    event.UserID = 1 // placeholder - sera remplacé par l'ID de l'utilisateur authentifié

    err = event.Save()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create event. Try again later."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully!", "event": event})
}
```

### Mettre à jour `main.go`

On supprime les routes et les handlers de `main()`, et on les remplace par un unique appel à `RegisterRoutes()` :

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/romainw/event-booking-api/db"
    "github.com/romainw/event-booking-api/routes"
)

func main() {
    db.InitDB()
    server := gin.Default()

    routes.RegisterRoutes(server)

    server.Run(":8080")
}
```

`main()` n'a désormais plus qu'un seul rôle : initialiser les dépendances (`db.InitDB()`), créer le serveur, déléguer l'enregistrement des routes, et démarrer. Tout le reste est dans les packages dédiés.

Le comportement de l'API reste exactement le même qu'avant - c'est un refactoring pur, sans ajout de fonctionnalité.

---

## Mettre à jour un événement - route PUT

Pour chaque nouvelle opération, on suit désormais l'ordre logique de construction :
1. La **méthode** dans `models/event.go` - elle contient la logique SQL
2. Le **handler** dans `routes/events.go` - il reçoit la requête et appelle la méthode
3. La **route** dans `routes/routes.go` - elle branche l'URL sur le handler

### 1. Méthode `Update()` dans `models/event.go`

On ajoute une méthode `Update()` sur le type `Event`. Son rôle : exécuter un `UPDATE` SQL pour écraser les colonnes `name`, `description`, `location` et `dateTime` de l'événement correspondant à `event.ID`.

**Receveur valeur ou pointeur ?** Contrairement à `Save()`, `Update()` n'a pas besoin d'écrire de résultat dans le struct - elle lit seulement les champs pour construire la requête. Un receveur **valeur** `(event Event)` est donc suffisant ici.

```go
func (event Event) Update() error {
    query := `
    UPDATE events
    SET name = ?, description = ?, location = ?, dateTime = ?
    WHERE id = ?`

    stmt, err := db.DB.Prepare(query)
    if err != nil {
        return err
    }
    defer stmt.Close()

    _, err = stmt.Exec(event.Name, event.Description, event.Location, event.DateTime, event.ID)
    return err
}
```

Points à noter :
- `stmt.Exec()` retourne `(sql.Result, error)` - on ignore le résultat avec `_` et on ne retourne que l'erreur
- `defer stmt.Close()` libère la connexion au pool après l'appel à `Exec()`
- L'ordre des `?` dans `Exec()` doit correspondre exactement à l'ordre des colonnes dans `SET`, puis `WHERE id = ?` en dernier

### 2. Handler `updateEvent()` dans `routes/events.go`

Le handler doit :
1. Récupérer l'ID depuis l'URL et vérifier qu'il est valide
2. Vérifier que l'événement existe en base avant de tenter de le modifier
3. Lire le body JSON de la requête pour obtenir les nouvelles valeurs
4. Assigner l'ID à l'objet mis à jour (il vient de l'URL, pas du body)
5. Appeler `Update()` et retourner la réponse appropriée

**Pourquoi vérifier l'existence avec `GetEventByID` si on n'utilise pas l'événement retourné ?**
Un `UPDATE ... WHERE id = ?` sur un ID inexistant ne provoque pas d'erreur SQL - il modifie simplement 0 lignes, silencieusement. Sans ce contrôle, l'API retournerait un `200 OK` sur une mise à jour fantôme. On appelle donc `GetEventByID()` uniquement pour vérifier l'existence, sans utiliser la valeur retournée - d'où le `_`.

```go
func updateEvent(context *gin.Context) {
    eventId, err := strconv.ParseInt(context.Param("eventId"), 10, 64)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id."})
        return
    }

    _, err = models.GetEventByID(eventId)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch event."})
        return
    }

    var updatedEvent models.Event
    err = context.ShouldBindJSON(&updatedEvent)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
        return
    }

    updatedEvent.ID = eventId // l'ID vient de l'URL, pas du body JSON

    err = updatedEvent.Update()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not update event. Try again later."})
        return
    }

    context.JSON(http.StatusOK, gin.H{"message": "Event updated successfully!"})
}
```

### 3. Route dans `routes/routes.go`

On ajoute la route `PUT` en passant `updateEvent` comme handler :

```go
func RegisterRoutes(server *gin.Engine) {
    server.GET("/events", getEvents)
    server.GET("/events/:eventId", getEvent)
    server.POST("/events", createEvent)
    server.PUT("/events/:eventId", updateEvent)
}
```

### Tester la route PUT

On lance le serveur (`go run .`), puis on crée un fichier `update-event.http` :

```http
PUT http://localhost:8080/events/1
content-type: application/json

{
  "name": "Test event 1 - updated",
  "description": "An updated test event",
  "location": "An updated test location",
  "dateTime": "2026-07-20T20:00:00.000Z"
}
```

Réponse attendue :

```json
HTTP/1.1 200 OK

{
  "message": "Event updated successfully!"
}
```

Un `GET /events` confirme que l'événement avec `id: 1` a bien été modifié en base. Un PUT avec un ID inexistant (ex. `/events/99`) retourne une erreur `500` via le contrôle `GetEventByID`.

---

## Récapitulatif partiel : CRUD événements

| Opération | Méthode HTTP | URL | Handler | Méthode SQL |
|---|---|---|---|---|
| Lire tous | `GET` | `/events` | `getEvents()` | `Query()` |
| Lire un | `GET` | `/events/:eventId` | `getEvent()` | `QueryRow()` |
| Créer | `POST` | `/events` | `createEvent()` | `Prepare()` + `Exec()` |
| Modifier | `PUT` | `/events/:eventId` | `updateEvent()` | `Prepare()` + `Exec()` |

**Concepts clés abordés :**

| Concept | Où il intervient |
|---|---|
| Receveur valeur `(event Event)` | `Update()` - aucune écriture dans le struct nécessaire |
| `_, err = stmt.Exec(...)` | `Exec()` retourne `(sql.Result, error)` - le résultat n'est pas utile ici |
| `GetEventByID()` avant UPDATE | Évite un `200 OK` fantôme sur un ID inexistant |
| `event.ID = eventId` dans `updateEvent()` | L'ID vient de l'URL, pas du body JSON |
| Package `routes/` | Sépare routage + handlers de `main()` - chaque fichier a un seul rôle |

La prochaine sous-section couvre la suppression d'un événement : route `DELETE /events/:eventId`.

---

## Supprimer un événement - route DELETE

### 1. Méthode `Delete()` dans `models/event.go`

Même structure que `Update()` - receveur valeur, `Prepare()` + `defer stmt.Close()` + `Exec()` :

```go
func (event Event) Delete() error {
    query := "DELETE FROM events WHERE id = ?"

    stmt, err := db.DB.Prepare(query)
    if err != nil {
        return err
    }
    defer stmt.Close()

    _, err = stmt.Exec(event.ID)
    return err
}
```

### 2. Handler `deleteEvent()` dans `routes/events.go`

Même logique que `updateEvent()` pour les deux premières étapes (parser l'ID, vérifier l'existence), mais sans body JSON - une suppression ne nécessite pas de données entrantes.

```go
func deleteEvent(context *gin.Context) {
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

    err = event.Delete()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete event. Try again later."})
        return
    }

    context.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully!"})
}
```

Ici on utilise l'événement retourné par `GetEventByID()` - on ne jette pas la valeur avec `_` comme dans `updateEvent()`. On appelle `event.Delete()` directement dessus. C'est plus propre que de créer un `Event{ID: eventId}` manuellement.

### 3. Route dans `routes/routes.go`

```go
func RegisterRoutes(server *gin.Engine) {
    server.GET("/events", getEvents)
    server.GET("/events/:eventId", getEvent)
    server.POST("/events", createEvent)
    server.PUT("/events/:eventId", updateEvent)
    server.DELETE("/events/:eventId", deleteEvent)
}
```

### Tester la route DELETE

On crée un fichier `delete-event.http` :

```http
DELETE http://localhost:8080/events/3
```

Réponse attendue :

```json
HTTP/1.1 200 OK

{
  "message": "Event deleted successfully!"
}
```

Un `GET /events` confirme que l'événement avec `id: 3` n'apparaît plus dans la liste.

---

## Récapitulatif : CRUD complet sur les événements

| Opération | Méthode HTTP | URL | Handler | Méthode SQL |
|---|---|---|---|---|
| Lire tous | `GET` | `/events` | `getEvents()` | `Query()` |
| Lire un | `GET` | `/events/:eventId` | `getEvent()` | `QueryRow()` |
| Créer | `POST` | `/events` | `createEvent()` | `Prepare()` + `Exec()` |
| Modifier | `PUT` | `/events/:eventId` | `updateEvent()` | `Prepare()` + `Exec()` |
| Supprimer | `DELETE` | `/events/:eventId` | `deleteEvent()` | `Prepare()` + `Exec()` |

**Concepts clés de cette section :**

| Concept | Où il intervient |
|---|---|
| Receveur valeur `(event Event)` | `Update()`, `Delete()` - aucune écriture dans le struct nécessaire |
| `_, err = stmt.Exec(...)` | `Exec()` retourne `(sql.Result, error)` - le résultat n'est pas utile ici |
| `GetEventByID()` avant UPDATE/DELETE | Évite un `200 OK` fantôme sur un ID inexistant |
| `event.ID = eventId` dans `updateEvent()` | L'ID vient de l'URL, pas du body JSON |
| Package `routes/` | Sépare routage + handlers de `main()` - chaque fichier a un seul rôle |

La prochaine section ajoute la gestion des utilisateurs : inscription (`POST /users/signup`) avec hachage du mot de passe.

