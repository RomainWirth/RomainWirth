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
| Modifie le receveur ?	| Non - travaille sur une copie	            | Oui - modifie l'original en mémoire |
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

	server.Run(":8080") // localhost:8080
}

func getEvents(context *gin.Context) {
	events := models.GetAllEvents()
	context.JSON(http.StatusOK, events)
}
```

> **Rappel sur `*gin.Context`** : tout handler Gin reçoit un `*gin.Context` en paramètre. C'est l'objet central qui encapsule la requête entrante (méthode HTTP, headers, paramètres d'URL, body...) et expose les méthodes pour construire la réponse (`JSON()`, `String()`...). On travaille toujours avec un `pointeur` pour ne pas copier le contexte à chaque appel - Gin réutilise le même objet tout au long de la chaîne de handlers d'une requête.

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

    event.ID = 1     // valeur fictive provisoire - sera géré par la BDD plus tard
    event.UserID = 1 // valeur fictive provisoire - sera géré par l'authentification plus tard

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully", "event": event})
}
```
#### Points clés :

* `http.StatusBadRequest` (`400`) : le client a envoyé une requête malformée ou incomplète (body manquant, champ requis absent...).
* `return` après l'envoi de l'erreur : **indispensable**. Sans lui, le handler continue de s'exécuter après avoir déjà envoyé une réponse, ce qui provoquerait une seconde écriture sur la même réponse HTTP.
* `event.Save()` : **intentionnellement absent** à ce stade - on va constater lors des tests ce que cela implique, puis corriger
* `http.StatusCreated` (`201`) : code sémantiquement correct pour une création de ressource, à préférer à `200 OK`.
* On renvoie l'événement créé dans la réponse : bonne pratique qui permet au client de récupérer les champs générés côté serveur (ici l'`id`, à terme depuis la BDD).

### Tester les requêtes et réparer la requête `POST`

Pour tester tous types de requêtes - et particulièrement celles qui ne sont pas des requêtes GET - on peut utiliser des outils comme **Postman** (application desktop/web, utile pour des tests manuels ou partagés en équipe) ou directement dans VS Code avec le plugin **REST Client**.

#### le plug-in `REST Client`

**REST Client** est une extension VS Code qui permet d'envoyer des requêtes HTTP directement depuis un fichier `.http` ou `.rest`, sans quitter l'éditeur. Il affiche la réponse dans un onglet dédié, avec le statut, les headers et le body.

À installer depuis le marketplace VS Code : chercher `REST Client` (auteur : Huachao Mao).

On ajoutera un dossier `api-test` à la racine du projet pour regrouper les fichiers de test.

#### Test de la route `POST`

Le premier fichier sera `create-event.http`. L'extension `.http` est reconnue automatiquement par REST Client, qui affiche un bouton `Send Request` au-dessus de chaque requête.

Un fichier `.http` contient :
* la **méthode + URL** : `POST http://localhost:8080/events` - `http://` est obligatoire avec localhost, car `https://` provoquerait une erreur SSL en local.
* les **headers**, séparés de la méthode par un retour à la ligne : `content-type: application/json` indique au serveur que le body est du JSON.
* le **body** JSON, séparé des headers par **une ligne vide obligatoire**.
```http
POST http://localhost:8080/events
content-type: application/json

{
  "name": "Test event",
  "description": "A test event",
  "location": "A test location",
  "dateTime": "2026-07-20T18:00:00.000Z"
}
```
Pour exécuter la requête :lancer le serveur local : `go run .` (ou `go run main.go`), puis cliquer sur `Send Request`.

Terminal :
```bash
[GIN] 2026/06/11 - 10:06:16 | 201 | 248.916µs |       127.0.0.1 | POST     "/events"
```
Fichier `Response` - statut `201 Created` :
```Go
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Jun 2026 14:25:01 GMT
Content-Length: 180
Connection: close

{
  "event": {
    "id": 1,
    "name": "Test event",
    "description": "A test event",
    "location": "A test location",
    "dateTime": "2026-07-20T18:00:00Z",
    "userId": 1
  },
  "message": "Event created successfully"
}
```

> Les clés JSON sont en camelCase (`id`, `name`, `userId`...) grâce aux tags `json:"..."` définis sur le struct `Event`. Sans ces tags, Go utiliserait les noms de champs PascalCase (`ID`, `Name`, `UserID`...).

#### Test de la route `GET`

On crée un second fichier `get-events.http`. Une requête `GET` n'a ni headers spécifiques ni body : une seule ligne suffit.
```http
GET http://localhost:8080/events
```
On clique sur `Send Request` avec le serveur toujours en cours d'exécution.

Terminal :
```bash
[GIN] 2026/06/11 - 10:20:20 | 200 | 117.732µs |       127.0.0.1 | GET      "/events"
```
Fichier `Response` - statut `200 OK` :
```Go
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Jun 2026 08:20:20 GMT
Content-Length: 2
Connection: close

[]
```
La réponse est une **slice vide** `[]` : l'événement créé via `POST` n'a pas été retenu. C'est attendu - `event.Save()` n'est pas encore appelé dans `createEvent`.

#### Réparation de la route `POST`

Pour persister l'événement, il suffit d'appeler `event.Save()` avant d'envoyer la réponse :
```Go
func createEvent(context *gin.Context) {
    var event models.Event

    err := context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "could not parse request data"})
        return
    }

    event.ID = 1
    event.UserID = 1

    event.Save() // ajoute l'événement à la slice events

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully", "event": event})
}
```
En relançant le serveur puis en exécutant `create-event` puis `get-events` :
```Go
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 11 Jun 2026 14:25:37 GMT
Content-Length: 133
Connection: close

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
L'événement est bien retourné. À noter que la persistance est **en mémoire uniquement** : si on redémarre le serveur et qu'on appelle directement `GET /events`, la slice sera de nouveau vide. La prochaine étape sera de connecter une vraie base de données.

---

## Résumé

| Concept | Ce qu'on a mis en place |
|---|---|
| **`gin.Default()`** | Crée le moteur Gin avec les middlewares Logger et Recovery préconfigurés |
| **`server.Run()`** | Démarre le serveur HTTP en écoute sur un port donné (bloque `main`) |
| **`server.GET()` / `server.POST()`** | Enregistre une route HTTP et lui associe un ou plusieurs handlers |
| **`gin.HandlerFunc`** | Signature attendue pour tout handler Gin : `func(ctx *gin.Context)` |
| **`*gin.Context`** | Objet central encapsulant la requête entrante et les méthodes de réponse |
| **`ctx.JSON()`** | Sérialise une valeur Go en JSON et l'envoie avec le statut HTTP approprié |
| **`gin.H`** | Alias `map[string]any` pour construire des objets JSON inline |
| **Struct `Event` + tags** | Modélise la ressource avec des tags `json:"..."` (sérialisation) et `binding:"required"` (validation) |
| **`ShouldBindJSON()`** | Décode et valide le body JSON d'une requête vers un struct Go |
| **`event.Save()`** | Méthode de persistance (en mémoire ici, en BDD à terme) |
| **REST Client** | Plugin VS Code pour tester des requêtes HTTP depuis des fichiers `.http` |

## Et ensuite ?

L'API fonctionne, mais les données ne survivent pas au redémarrage du serveur : elles sont stockées dans une simple variable en mémoire. Pour une vraie API, il faut une **base de données**.

La prochaine étape consistera à connecter une base de données **SQLite** via le driver Go `go-sqlite3`, et à réécrire les méthodes `Save()` et `GetAllEvents()` pour qu'elles lisent et écrivent en base plutôt que dans une slice. On y abordera :

* la connexion à la base de données et l'initialisation du schéma
* l'exécution de requêtes SQL depuis Go (`INSERT`, `SELECT`)
* la gestion des erreurs de base de données
* l'auto-incrémentation des IDs par la BDD (ce qui justifiera de passer `Save()` en receveur par pointeur pour récupérer l'ID généré)

