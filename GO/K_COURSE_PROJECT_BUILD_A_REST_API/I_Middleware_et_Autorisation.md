# Middleware et Autorisation

## Récupérer et stocker les IDs utilisateur

### État de départ : `createEvent` avec un `UserID` codé en dur

Au début de cette section, le handler `createEvent` vérifie le token mais assigne un `UserID` arbitraire :

```go
func createEvent(context *gin.Context) {
    token := context.Request.Header.Get("Authorization")
    if token == "" {
        context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized"})
        return
    }

    err := utils.VerifyToken(token)
    if err != nil {
        context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized."})
        return
    }

    var event models.Event
    err = context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
        return
    }

    event.UserID = 1 // ← valeur arbitraire, à remplacer

    err = event.Save()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create event. Try again later."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully", "event": event})
}
```

L'objectif est de remplacer `event.UserID = 1` par l'ID réel de l'utilisateur qui s'est authentifié.

### Modifier `VerifyToken()` pour retourner l'ID utilisateur

`VerifyToken()` analyse déjà le token et a accès aux claims — dont `"userId"`. Il suffit d'extraire cette valeur et de la retourner plutôt que de la laisser commentée.

**Nouvelle signature** : `func VerifyToken(token string) (int64, error)`

Chaque `return` doit maintenant retourner deux valeurs :
- En cas d'erreur : `return 0, errors.New("...")` — `0` est la valeur nulle de `int64`
- En cas de succès : `return userId, nil`

Il serait possible d'extraire la partie claims dans une fonction séparée pour un code plus propre, mais on reste simple et on garde tout dans `VerifyToken`.

Première tentative, en décommentant les claims et en extrayant `userId` :

```go
func VerifyToken(token string) (int64, error) {
    parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
        _, ok := token.Method.(*jwt.SigningMethodHMAC)
        if !ok {
            return nil, errors.New("Unexpected signing method")
        }
        return []byte(secretKey), nil
    })

    if err != nil {
        return 0, errors.New("Could not parse token.")
    }

    if !parsedToken.Valid {
        return 0, errors.New("Invalid token")
    }

    claims, ok := parsedToken.Claims.(jwt.MapClaims)
    if !ok {
        return 0, errors.New("Invalid token")
    }

    userId := claims["userId"].(int64) // ← a priori logique, mais incorrect
    return userId, nil
}
```

### Mettre à jour `createEvent()`

`utils.VerifyToken(token)` retourne maintenant `(int64, error)`. On récupère l'ID et on l'assigne à `event.UserID` :

```go
func createEvent(context *gin.Context) {
    token := context.Request.Header.Get("Authorization")
    if token == "" {
        context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized."})
        return
    }

    userId, err := utils.VerifyToken(token)
    if err != nil {
        context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized."})
        return
    }

    var event models.Event
    err = context.ShouldBindJSON(&event)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
        return
    }

    event.UserID = userId // ← l'ID réel, extrait du token

    err = event.Save()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create event. Try again later."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Event created successfully!", "event": event})
}
```

### Vérifier le type de `UserID` dans le struct `Event`

`userId` est de type `int64`. Le champ `UserID` du struct `Event` doit être du même type :

```go
type Event struct {
    ID          int64     `json:"id"`
    Name        string    `json:"name"        binding:"required"`
    Description string    `json:"description" binding:"required"`
    Location    string    `json:"location"    binding:"required"`
    DateTime    time.Time `json:"dateTime"    binding:"required"`
    UserID      int64     `json:"userId"`
}
```

### Tester — et comprendre l'erreur

On supprime `api.db` pour repartir sur une base propre, puis on relance le serveur.

**1. Créer un utilisateur** (`create-user.http`) :

```http
POST http://localhost:8080/signup
Content-Type: application/json

{
  "email": "test2@example.com",
  "password": "testpassword"
}
```

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Wed, 24 Jun 2026 12:42:15 GMT
Content-Length: 39
Connection: close

{
  "message": "User created successfully"
}
```

**2. Se connecter** (`login.http`) :

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "test2@example.com",
  "password": "testpassword"
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Wed, 24 Jun 2026 12:43:57 GMT
Content-Length: 198
Connection: close

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzgyMzEyMjM3LCJ1c2VySWQiOjJ9.E8IL2_IG7x8_MfKaRDSBxmpv_uRa26nAP3o4Pz4oy3I"
}
```

**3. Créer un événement avec le token** (`create-event.http`) :

```http
POST http://localhost:8080/events
Content-Type: application/json
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzgyMzEyMjM3LCJ1c2VySWQiOjJ9.E8IL2_IG7x8_MfKaRDSBxmpv_uRa26nAP3o4Pz4oy3I

{
  "name": "Test event 1",
  "description": "A first test event for test2@example.com",
  "location": "A new test location",
  "dateTime": "2026-07-20T22:00:00.000Z"
}
```

```
HTTP/1.1 500 Internal Server Error
Date: Wed, 24 Jun 2026 12:46:18 GMT
Content-Length: 0
Connection: close
```

Terminal :

```
romainw@fedora:~/Public/perso/go/event-booking-api$ go run .
[GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.

[GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
 - using env:   export GIN_MODE=release
 - using code:  gin.SetMode(gin.ReleaseMode)

[GIN-debug] GET    /events                   --> github.com/romainw/event-booking-api/routes.getEvents (3 handlers)
[GIN-debug] GET    /events/:eventId          --> github.com/romainw/event-booking-api/routes.getEvent (3 handlers)
[GIN-debug] POST   /events                   --> github.com/romainw/event-booking-api/routes.createEvent (3 handlers)
[GIN-debug] PUT    /events/:eventId          --> github.com/romainw/event-booking-api/routes.updateEvent (3 handlers)
[GIN-debug] DELETE /events/:eventId          --> github.com/romainw/event-booking-api/routes.deleteEvent (3 handlers)
[GIN-debug] POST   /signup                   --> github.com/romainw/event-booking-api/routes.signup (3 handlers)
[GIN-debug] POST   /login                    --> github.com/romainw/event-booking-api/routes.login (3 handlers)
[GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
Please check https://github.com/gin-gonic/gin/blob/master/docs/doc.md#dont-trust-all-proxies for details.
[GIN-debug] Listening and serving HTTP on :8080
[GIN] 2026/06/24 - 14:40:12 | 201 |  67.13ms |       127.0.0.1 | POST     "/signup"
[GIN] 2026/06/24 - 14:40:42 | 200 |  67.53ms |       127.0.0.1 | POST     "/login"

2026/06/24 14:40:53 [Recovery] 2026/06/24 - 14:40:53 panic recovered:
POST /events HTTP/1.1
Host: localhost:8080
Accept-Encoding: gzip, deflate
Authorization: *
Connection: close
Content-Length: 168
Content-Type: application/json
User-Agent: vscode-restclient


interface conversion: interface {} is float64, not int64
/usr/lib/golang/src/runtime/iface.go:275 (0x422804)
        panicdottypeE: panic(&TypeAssertionError{iface, have, want, ""})
/home/romainw/Public/perso/go/event-booking-api/utils/jwt.go:48 (0xd89908)
        VerifyToken: userId := claims["userId"].(int64)
/home/romainw/Public/perso/go/event-booking-api/routes/events.go:43 (0xd8b272)
        createEvent: userId, err := utils.VerifyToken(token)
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/context.go:192 (0xd34ede)
        (*Context).Next: c.handlers[c.index](c)
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/recovery.go:90 (0xd44b50)
        CustomRecoveryWithWriter.func1: c.Next()
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/context.go:192 (0xd34ede)
        (*Context).Next: c.handlers[c.index](c)
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/logger.go:282 (0xd43809)
        LoggerWithConfig.func1: c.Next()
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/context.go:192 (0xd34ede)
        (*Context).Next: c.handlers[c.index](c)
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/gin.go:722 (0xd427fd)
        (*Engine).handleHTTPRequest: c.Next()
/home/romainw/go/pkg/mod/github.com/gin-gonic/gin@v1.12.0/gin.go:672 (0xd420fb)
        (*Engine).ServeHTTP: c.Next()
/usr/lib/golang/src/net/http/server.go:3311 (0x6e1f0d)
        serverHandler.ServeHTTP: handler.ServeHTTP(rw, req)
/usr/lib/golang/src/net/http/server.go:2073 (0x6d36af)
        (*conn).serve: handler.ServeHTTP(rw, req)
/usr/lib/golang/src/runtime/asm_amd64.s:1771 (0x490a20)
        goexit: BYTE    $0x90   // NOP

[GIN] 2026/06/24 - 14:40:53 | 500 |   1.09ms |       127.0.0.1 | POST     "/events"
```

**Pourquoi ce panic ?**

Le message est explicite : `interface {} is float64, not int64`. Un JWT est du JSON. Lorsque `encoding/json` désérialise un nombre JSON en `interface{}`, il utilise systématiquement `float64` — jamais `int64`. L'assertion `.(int64)` compile sans erreur mais **panique à l'exécution** car le type réel est `float64`.

La stack trace pointe directement sur la ligne coupable : `userId := claims["userId"].(int64)` dans `jwt.go:48`.

Le middleware `Recovery` de `gin.Default()` a intercepté le panic (ligne `recovery.go:90`) et renvoyé un `500` au lieu de crasher le serveur entier.

**La correction** : extraire d'abord en `float64` (le type réel), puis convertir en `int64` :

```go
userId := int64(claims["userId"].(float64))
```

### `VerifyToken()` corrigée

```go
func VerifyToken(token string) (int64, error) {
    parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
        _, ok := token.Method.(*jwt.SigningMethodHMAC)
        if !ok {
            return nil, errors.New("Unexpected signing method")
        }
        return []byte(secretKey), nil
    })

    if err != nil {
        return 0, errors.New("Could not parse token.")
    }

    if !parsedToken.Valid {
        return 0, errors.New("Invalid token")
    }

    claims, ok := parsedToken.Claims.(jwt.MapClaims)
    if !ok {
        return 0, errors.New("Invalid token")
    }

    userId := int64(claims["userId"].(float64))
    return userId, nil
}
```

### Retest après correction

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Wed, 24 Jun 2026 12:58:35 GMT
Content-Length: 214
Connection: close

{
  "event": {
    "id": 1,
    "name": "Test event 1",
    "description": "A first test event for test2@example.com",
    "location": "A new test location",
    "dateTime": "2026-07-20T22:00:00Z",
    "userId": 2
  },
  "message": "Event created successfully"
}
```

`"userId": 2` confirme que c'est bien l'ID de `test2@example.com` (deuxième utilisateur créé) qui est stocké, et non plus le placeholder `1`.

### Rappel : le receveur pointeur sur `Save()` et `ValidateCredentials()`

Tant que les tests sont en place, c'est l'occasion de vérifier un autre point. En changeant temporairement le receveur de `Save()` en valeur `(e Event)` au lieu de `(e *Event)`, la réponse devient :

```json
{
  "event": {
    "id": 0,
    "name": "Test event 1",
    "description": "A first test event for test2@example.com",
    "location": "A new test location",
    "dateTime": "2026-07-20T22:00:00Z",
    "userId": 2
  },
  "message": "Event created successfully"
}
```

`"id": 0` — l'événement a bien été inséré en base, mais l'objet retourné ne connaît pas son ID. Avec un receveur valeur, `stmt.Exec` et `result.LastInsertId()` opèrent sur une **copie** de `e` — `e.ID = id` modifie cette copie, pas l'objet original dans le handler.

Il faut impérativement garder `(e *Event)` :

```go
func (e *Event) Save() error {
    query := `
    INSERT INTO events (name, description, location, dateTime, user_id)
    VALUES (?, ?, ?, ?, ?)`

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

Le même raisonnement s'applique à `User.ValidateCredentials()` : avec `(u User)`, `u.ID` après le `Scan` resterait `0` dans l'objet original — le token généré embarquerait un ID invalide, et `"userId": 0` apparaîtrait dans toutes les réponses.

---

La prochaine section extrait cette vérification de token dans un **middleware Gin** réutilisable, appliqué en une fois à toutes les routes protégées via un groupe de routes.
