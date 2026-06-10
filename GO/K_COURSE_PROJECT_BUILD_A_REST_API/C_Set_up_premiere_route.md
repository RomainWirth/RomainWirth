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

Une fois le serveur de base opérationnel, on continue d'ajouter des endpoints avec une logique plus utile.

### Ajouter une structure de données pour un `Event`

On crée un nouveau package `models` avec un fichier `event.go`. L'idée est de regrouper toute la logique liée au stockage et à la récupération des données événements.

Ce fichier va contenir le struct qui définit la structure d'un événement. On ajoute des struct tags sur chaque champ pour contrôler deux comportements :
* `json:"..."` : définit la clé JSON utilisée lors de la sérialisation/désérialisation. Sans ces tags, Go utilise les noms de champs tels quels en PascalCase (`Name`, `UserID`...), ce qui n'est pas idiomatique pour une API REST. Les tags permettent d'obtenir du camelCase ou du snake_case côté JSON.
* `binding:"required"` : indique à Gin que ce champ est obligatoire lors du parsing d'une requête entrante. Si le champ est absent du body JSON, Gin retourne une erreur.
```Go
package models

import "time"

type Event struct {
    ID          int       `json:"id"`
    Name        string    `json:"name"        binding:"required"`
    Description string    `json:"description" binding:"required"`
    Location    string    `json:"location"    binding:"required"`
    DateTime    time.Time `json:"dateTime"    binding:"required"`
    UserID      int       `json:"userId"`
}
```

### Ajouter des méthodes et fonctions

#### La méthode `Save()`

La méthode `Save()` sert à enregistrer un événement. À terme, elle écrira en base de données. Pour l'instant, on stocke les événements dans une **slice de package** `events`.
```Go
var events = []Event{}

func (e Event) Save() {
  events = append(events, e)
}
```
#### Receveur par valeur vs receveur par pointeur :

|                       | Receveur valeur `(e Event)`               | Receveur pointeur `(e *Event)`      |
|-----------------------| ----------------------------------------- | ----------------------------------- |
| Modifie le receveur ?	| Non — travaille sur une copie	            | Oui — modifie l'original en mémoire |
| Cas d'usage	          | Lecture ou opération sur variable externe	| Modification de l'objet lui-même    |
| Coût mémoire          |	Copie du struct à chaque appel            | Juste un pointeur, pas de copie     |


Ici, un receveur par valeur suffit : `Save()` n'a pas besoin de modifier l'événement lui-même. La modification porte sur la variable de package `events` (via `append`), pas sur le receveur e.

```
À noter pour la suite : quand on intégrera une vraie base de données, Save() devra probablement utiliser un receveur par pointeur pour mettre à jour le champ ID avec l'ID auto-généré par la BDD, et retourner une error pour gérer les échecs d'écriture.
```

#### La fonction `GetAllEvents()`

`GetAllEvents()` n'est pas une méthode mais une **fonction de package** : on ne l'appelle pas sur un événement existant, mais pour obtenir l'ensemble des événements stockés. Elle commence par une majuscule pour être exportée hors du package
```Go
func GetAllEvents() []Event {
  return events
}
```

## Ajouter une route `POST`

### Modifier la route `GET`

On modifie le handler `getEvents` pour qu'il utilise `GetAllEvents()` et renvoie la vraie liste des événements :
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
	events := models.GetAllEvents()
	context.JSON(http.StatusOK, events)
}
```

```
Rappel sur *gin.Context : tout handler Gin reçoit un *gin.Context en paramètre. C'est l'objet central qui encapsule la requête entrante (méthode HTTP, headers, paramètres d'URL, body...) et expose les méthodes pour construire la réponse (JSON(), String()...). On travaille toujours avec un pointeur pour ne pas copier le contexte à chaque appel — Gin réutilise le même objet tout au long de la chaîne de handlers d'une requête.
```

### Ajout de la route `POST`

On ajoute `POST /events` dans `main` et on crée le handler `createEvent` :
```Go
func main() {
	server := gin.Default()

	server.GET("/events", getEvents)
  server.POST("/events", createEvent)

	server.Run(":8080")
}
```

#### `shouldBindJSON()` - parser le body de la requête

`ShouldBindJSON()` est une méthode du contexte Gin qui :
1. Lit le **corps (body) de la requête HTTP** entrante
2. Le **décode depuis le JSON** vers le struct Go passé en argument (comme `json.Unmarshal()` de la bibliothèque standard, mais intégré au pipeline Gin)
3. **Valide les champs** marqués `binding:"required"` : si un champ requis est absent ou vide, une erreur est retournée
4. Retourne une **erreur** si le parsing ou la validation échouent, `nil` sinon

On lui passe un **pointeur** vers la variable à remplir (`&event`) pour que Gin puisse écrire directement dedans. Sans pointeur, les modifications seraient faites sur une copie qui serait aussitôt perdue.
```Go
func createEvent(context *gin.Context) {
    var event models.Event

    err := context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
        return // indispensable : stoppe l'exécution après l'envoi de la réponse d'erreur
    }

    event.ID = 1     // valeur fictive provisoire — sera géré par la BDD plus tard
    event.UserID = 1 // valeur fictive provisoire — sera géré par l'authentification plus tard
    event.Save()

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully", "event": event})
}
```
#### Points clés :

* `http.StatusBadRequest` (`400`) : le client a envoyé une requête malformée ou incomplète (body manquant, champ requis absent...).
* `return` après l'envoi de l'erreur : **indispensable**. Sans lui, le handler continue de s'exécuter après avoir déjà envoyé une réponse, ce qui provoquerait une seconde écriture sur la même réponse HTTP.
* `event.Save()` : ne pas oublier d'appeler la méthode pour que l'événement soit effectivement ajouté à la slice — sans cet appel, la requête `GET /events` ne retournera jamais les événements créés.
* `http.StatusCreated` (`201`) : code sémantiquement correct pour une création de ressource, à préférer à `200 OK`.
* On renvoie l'événement créé dans la réponse : bonne pratique qui permet au client de récupérer les champs générés côté serveur (ici l'`id`, à terme depuis la BDD).

### Tester les requêtes et réparer la requête `POST`

Pour tester tous type de requêtes, et particulièrement les requêtes qui ne sont pas des requêtes `GET`, on peut utiliser des outils comme POSTMAN.

// Note sur postman

On peut également utiliser un plugin sur visual studio code : `REST Client`.
Ce plugin permet de tester directement dans VS Code des routes
