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

**`routes/routes.go`** — ce fichier ne contiendra qu'une seule fonction, `RegisterRoutes()`, dont le rôle est d'enregistrer toutes les routes sur le serveur :

```go
package routes

import "github.com/gin-gonic/gin"

func RegisterRoutes(server *gin.Engine) {
    server.GET("/events", getEvents)
    server.GET("/events/:eventId", getEvent)
    server.POST("/events", createEvent)
}
```

`RegisterRoutes()` prend en paramètre un `*gin.Engine` — un pointeur vers le serveur Gin créé dans `main()`. Grâce au pointeur, la fonction opère directement sur le serveur d'origine : les routes sont enregistrées sur la même instance que celle qui sera démarrée par `server.Run()`. Aucune valeur de retour n'est nécessaire.

### Déplacer les handlers dans `routes/events.go`

Toujours dans le package `routes`, on crée un fichier `events.go` qui va accueillir les trois handlers déplacés depuis `main.go`.

Quelques points importants :

**Visibilité au sein d'un même package** — En Go, les fonctions dont le nom commence par une minuscule sont privées (non exportées). Mais "privé" signifie uniquement "inaccessible depuis un autre package". Au sein du même package, tous les fichiers se voient mutuellement. `routes.go` peut donc appeler `getEvents`, `getEvent` et `createEvent` définis dans `events.go` sans aucun problème, et sans avoir besoin de les exporter.

**Un placeholder temporaire** — Le handler `createEvent` assigne `event.UserID = 1` en dur. Il n'existe pas encore de système d'authentification dans le projet : on ne sait pas encore quel utilisateur crée l'événement. Cette valeur sera remplacée dans la section sur les utilisateurs et les JWT.

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

    event.UserID = 1 // placeholder — sera remplacé par l'ID de l'utilisateur authentifié

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

Le comportement de l'API reste exactement le même qu'avant — c'est un refactoring pur, sans ajout de fonctionnalité.
