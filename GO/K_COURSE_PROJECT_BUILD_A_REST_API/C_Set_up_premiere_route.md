# SET UP DE LA PREMIÈRE ROUTE ET GÉRER UNE PREMIÈRE REQUÊTE

Une fois le projet préparé, on va pouvoir commencer à utiliser les features du framework Gin

## Mettre en place le serveur

Pour démarrer le projet, on va intégrer le package `gin` dans la fonction `main`.

### `gin.Default()` - créer le moteur

La fonction `gin.Default()` crée et retourne un **moteur Gin** (`*gin.Engine`) : c'est le coeur du serveur HTTP. Un `gin.Engine` est un struct qui centralise le routeur, les middlewares et la configuration du serveur.

`Default()` préconfigure automatiquement deux **middlewares** intégrés :

| Middleware | Rôle |
|---|---|
| **Logger** | Enregistre dans le terminal chaque requête reçue : méthode HTTP, route, statut, durée |
| **Recovery** | Intercepte les `panic` (crashes inattendus) et renvoie une réponse `500` au lieu de faire tomber tout le serveur |

On stocke le résultat dans une variable `server` (le nom est libre) : il s'agit d'un **pointeur vers un `gin.Engine`** (`*gin.Engine`). On travaille avec un pointeur car on veut opérer sur le même moteur - ajouter des routes, lancer le serveur - sans en copier la valeur à chaque opération.

### `server.Run()` - démarrer le serveur

La méthode `Run()` démarre le serveur HTTP et le met en écoute des requêtes entrantes. Elle **bloque** l'exécution : une fois appelée, la fonction `main` ne retourne pas tant que le serveur tourne.

Elle prend en paramètre une **adresse d'écoute** au format `"<host>:<port>"` :
- `":8080"` → écoute sur toutes les interfaces réseau locales sur le port `8080`, accessible via `localhost:8080`
- L'hôte peut être omis (comme ici), auquel cas Go écoute sur `0.0.0.0` (toutes les interfaces)
```Go
package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

  server.Run(":8080") // localhost:8080
}
```

Ce code est suffisant pour démarrer un serveur fonctionnel avec logging et récupération de panics, mais il ne répond encore à aucune requête : aucune route n'est définie. Tout appel HTTP retournera un `404 Not Found`. C'est l'étape suivante : enregistrer des routes.

## Set up la première route

On va utiliser les méthodes du routeur Gin pour enregistrer des routes HTTP. Pour chaque méthode HTTP, Gin expose une méthode correspondante sur `*gin.Engine` : `GET()`, `POST()`, `PUT()`, `PATCH()`, `DELETE()`.

### Enregistrer une route : `server.GET()`

La méthode `GET()` - comme toutes ses homologues - prend deux types de paramètres :

| Paramètre | Type | Rôle |
|---|---|---|
| `relativePath` | `string` | Le chemin de la route, ex. `"/events"` |
| `handlers` | `...gin.HandlerFunc` | Un ou plusieurs handlers (fonctions) qui traitent la requête |

Le second paramètre est **variadique** (`...`), ce qui signifie qu'on peut enchaîner plusieurs handlers pour une même route - c'est ainsi que fonctionnent les middlewares appliqués route par route.

### Les handlers : `gin.HandlerFunc`

Un **handler** est une fonction qui contient la logique de traitement d'une requête HTTP donnée. En Gin, un handler doit avoir la signature : `func(ctx *gin.Context)`. `gin.HandlerFunc` est un alias de type pour cette signature - il permet à Go de vérifier statiquement qu'une fonction passée en argument est bien un handler valide.

Un handler peut être :
- une **fonction nommée** déclarée ailleurs dans le code (recommandé pour la lisibilité et la testabilité)
- une **fonction anonyme** définie directement en ligne dans l'appel

### `*gin.Context` - le coeur du handler

`gin.Context` est le struct central de Gin. Il encapsule tout ce dont un handler a besoin pour traiter la requête et construire la réponse :
- **Requête entrante** : méthode HTTP, headers, paramètres d'URL (`:id`), query string, corps de la requête...
- **Réponse sortante** : méthodes d'écriture - `JSON()`, `String()`, `Status()`...
- **Pipeline de middlewares** : `ctx.Next()` pour passer au handler suivant, `ctx.Abort()` pour interrompre la chaîne

On reçoit un **pointeur** (`*gin.Context`) car Gin réutilise le même objet `Context` tout au long de la chaîne de handlers d'une requête - passer une copie serait à la fois incorrect et inutilement coûteux.

### `ctx.JSON()` - renvoyer du JSON

`JSON()` écrit une réponse HTTP avec le header `Content-Type: application/json` et **sérialise automatiquement** la donnée passée en argument.

Elle prend deux paramètres :

| Paramètre | Type | Rôle |
|---|---|---|
| `code` | `int` | Code de statut HTTP de la réponse |
| `obj` | `any` | Donnée à sérialiser en JSON (struct, map, slice, string...) |

Pour le code de statut, on préfère les constantes nommées du package `net/http` plutôt que des entiers nus : `http.StatusOK` (`200`), `http.StatusCreated` (`201`), `http.StatusBadRequest` (`400`), `http.StatusNotFound` (`404`)... Ces constantes rendent le code auto-documenté et éliminent les *magic numbers*.

### `gin.H` - construire un objet JSON rapidement

`gin.H` est un alias de type défini dans Gin : `type H map[string]any`. Il permet de construire un objet JSON inline sans définir une struct dédiée :
- `gin.H{"message": "Hello world !"}` → `{"message": "Hello world !"}`
- `gin.H{"id": 1, "title": "Concert"}` → `{"id": 1, "title": "Concert"}`

Pour des réponses plus complexes ou typées (la majorité des cas en production), on préférera retourner une struct Go annotée avec des tags `json:"..."`, que Gin sérialisera de la même manière.

En résumé : dès qu'une requête `GET` arrive sur `localhost:8080/events`, Gin appelle `getEvents`, qui renvoie un statut `200 OK` avec le corps JSON `{"message": "Hello world !"}`.
```Go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	server := gin.Default()

  server.GET("/events", getEvents) // GET, POST, PUT, PATCH, DELETE

  server.Run(":8080") // localhost:8080
}

func getEvents(context *gin.Context) {
  context.JSON(http.StatusOK, gin.H{"message": "Hello world !"})
}
```
En lançant l'application avec `go run .`, le serveur démarre et écoute sur `localhost:8080`.

En ouvrant un navigateur sur `localhost:8080/events`, on obtient l'affichage du JSON `{"message": "Hello world !"}`. Dans l'onglet *Network* des DevTools, on peut inspecter la requête, son statut `200 OK` et le header `Content-Type: application/json` renvoyé automatiquement par Gin.

Le middleware **Logger** (ajouté par `gin.Default()`) enregistre chaque requête dans le terminal :
```bash
romainw@fedora:~/Public/perso/go/event-booking-api$ go run .
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /events                   --> main.getEvents (3 handlers)
[GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
Please check https://github.com/gin-gonic/gin/blob/master/docs/doc.md#dont-trust-all-proxies for details.
[GIN-debug] Listening and serving HTTP on :8080
[GIN] 2026/04/15 - 17:07:53 | 200 | 34.837µs |       127.0.0.1 | GET      "/events"
[GIN] 2026/04/15 - 17:07:53 | 404 |    590ns |       127.0.0.1 | GET      "/favicon.ico"
```

Quelques points à noter dans ces logs :
- `(3 handlers)` : Gin comptabilise les handlers Logger + Recovery (ajoutés par `Default()`) + `getEvents` -> 3 au total.
- `[WARNING] You trusted all proxies` : avertissement de sécurité par défaut - à configurer avec `server.SetTrustedProxies()` pour la production.
- Chaque ligne de requête indique la durée de traitement (ex. `34.837µs`) et l'IP source.

Pour stopper le serveur, utiliser `Ctrl + C` dans le terminal.

## Set up un modèle `Event`

Une fois qu'on a implémenté la logique d'un serveur de base opérationnel, on souhaite continuer d'ajouter des endpoints.
On aura besoin d'une logique plus utile qui sera exécutée quand on aura d'autres requêtes entrantes.

### Ajouter une structure de données pour un `Event`

Pour cela, on va créer un nouveau package appelé `models`, dans lequel on aura un fichier `event.go`.
L'idée est de regrouper toute la logique qui s'occupe :
* du stockage de données d'événements dans une BDD
* de fetch de la data
* etc.

Ce fichier `event` va contenir le struct qui va définirla structure d'un événement.
Un événement aura un id, un nom, une description, un lieu, une date et devra être liée à un utilisateur par son ID.
```Go
package models

import "time"

type Event struct {
  ID          int
  Name        string
  Description string
  Location    string
  DateTime    time.Time
  UserID      int
}
```

Il ne restera qu'à ajouter des méthodes qui permettent d'intéragir avec un événement.

### Ajouter des méthodes et fonctions

#### La méthode `save()`

La première méthode servira à enregistrer un événement : `save()`.
Son objectif sera à terme de stocker les événements en base de données.
Pour l'instant, on va la stocker dans une variable (une slice d'events) `var events []Event`.
```Go
// variable pour stocker les objets de type événements dans une slice initialisée en slice vide
var events = []Event{}

func (e Event) Save() {
  events = append(events, e)
}
```
* La variable events est initialisée comme une slice vide de type Event
* la méthode `Save()` contient un 'receveur', une variable de type Event `(e Event)` sur lequel save est appelé. On peut avoir ce receveur comme une copie ou un pointeur, c'est au choix. (quel avantage de l'un et de l'autre ?)
* la méthode va simplement ajouter à la variable events le nouvel événement reçu via le receveur.

#### La fonction `GetAllEvents()`

`GetAllEvents()` n'est pas une méthode car on ne l'appelle pas sur un événement existant, mais plutôt pour obtenir tous les événements disponibles.
Cette fonction devra être disponible en dehors du package, elle va donc commencer par une majuscule.
Elle va retourner une slice d'events : `[]Event`
```Go
func GetAllEvents() []Event {
  return events
}
```

## Ajouter une route `POST`

Une fois le nouveau modèle créé avec ses méthodes et fonctions associées, on va pouvoir commencer à les utiliser.

### Modifier la route `GET`

Dans notre `main package`, on va d'abord modifier notre route `GET` et la fonction getEvents pour récupérer les événements :
```Go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/romainw/event-booking-api/models"
)

func main() {
	server := gin.Default()

	server.GET("/events", getEvents)

	server.Run(":8080")
}

func getEvents(context *gin.Context) {
  // appel de la fonction GetAllEvents
	events := models.GetAllEvents()
  // pour passer le résultat
	context.JSON(http.StatusOK, events)
}
```

### Ajout de la route `POST`

On peut également ajouter la route `POST` à laquelle on associe une fonction `createEvent` : `server.POST("/events", createEvent)`
```Go
func main() {
	server := gin.Default()

	server.GET("/events", getEvents)
  server.POST("/events", createEvent)

	server.Run(":8080")
}

...

func createEvent(context *gin.Context) {

}
```
