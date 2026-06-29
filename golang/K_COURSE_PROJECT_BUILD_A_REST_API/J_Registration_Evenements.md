# S'enregistrer aux événements

Pour finaliser l'API REST, deux nouvelles routes gèrent les inscriptions aux événements :

- `POST /events/:eventId/register` — s'inscrire à un événement
- `DELETE /events/:eventId/register` — annuler son inscription

Les deux routes font partie du groupe `authenticated` : un utilisateur doit être connecté pour gérer ses inscriptions.

## Ajouter une table `registrations`

La table `registrations` est une **table de jointure** : elle ne stocke pas de données métier, uniquement des paires `(event_id, user_id)` qui matérialisent le lien entre un utilisateur et un événement auquel il s'est inscrit.

Dans `db.go`, on l'ajoute après les tables `users` et `events` :

```go
createRegistrationsTable := `
CREATE TABLE IF NOT EXISTS registrations (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER,
    event_id INTEGER,
    FOREIGN KEY(user_id)  REFERENCES users(id),
    FOREIGN KEY(event_id) REFERENCES events(id)
)`

_, err = DB.Exec(createRegistrationsTable)
if err != nil {
    panic("Could not create registrations table.")
}
```

Comme pour les tables précédentes, `CREATE TABLE IF NOT EXISTS` ne modifie pas un schéma existant — supprimer `api.db` avant de relancer le serveur pour que la nouvelle table soit créée.

## S'inscrire à un événement

### Déclarer la route POST

Dans `routes.go`, dans le groupe `authenticated` :

```go
authenticated.POST("/events/:eventId/register", registerForEvent)
```

### La méthode `Register()` — modèle `Event`

Dans `models/event.go`, on ajoute une méthode `Register()` sur le struct `Event`. Elle insère une ligne dans `registrations` :

```go
func (e Event) Register(userId int64) error {
    query := "INSERT INTO registrations (event_id, user_id) VALUES (?, ?)"

    stmt, err := db.DB.Prepare(query)
    if err != nil {
        return err
    }
    defer stmt.Close()

    _, err = stmt.Exec(e.ID, userId)
    return err
}
```

**Receveur valeur `(e Event)`** : la méthode ne modifie pas le struct, un receveur valeur suffit.

### Le handler `registerForEvent()`

Nouveau fichier `routes/registration.go`. Le handler :
1. Extrait l'`userId` du contexte (posé par le middleware `Authenticate`)
2. Parse l'`eventId` depuis le paramètre de route
3. Vérifie que l'événement existe avec `GetEventByID`
4. Appelle `event.Register(userId)` et renvoie `201 Created`

```go
func registerForEvent(context *gin.Context) {
    userId := context.GetInt64("userId")

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

    err = event.Register(userId)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not register for event."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Successfully registered for event."})
}
```

### Tester

On supprime `api.db`, on relance le serveur, puis on prépare les données : un premier utilisateur crée un événement, un second s'y inscrit.

**Créer l'organisateur** (`create-user.http`) :

```http
POST http://localhost:8080/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword"
}
```

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Thu, 25 Jun 2026 11:50:35 GMT
Content-Length: 39
Connection: close

{
  "message": "User created successfully"
}
```

**Se connecter et créer un événement** (`login.http`, `create-event.http`) :

```
HTTP/1.1 200 OK

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjE3ODIzOTU1MTAsInVzZXJJZCI6MX0._qYOgzQ5VqgB_OPHFD13do5gVzigTVjgmTBvHiK0qT0"
}
```

```
HTTP/1.1 201 Created

{
  "event": {
    "id": 1,
    "name": "Test event 1",
    "description": "A first test event for test2@example.com",
    "location": "A new test location",
    "dateTime": "2026-07-20T22:00:00Z",
    "userId": 1
  },
  "message": "Event created successfully!"
}
```

**Créer un participant et se connecter** (`create-user.http`, `login.http`) :

```http
POST http://localhost:8080/signup
Content-Type: application/json

{
  "email": "test2@example.com",
  "password": "testpassword2"
}
```

```
HTTP/1.1 201 Created

{ "message": "User created successfully" }
```

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "test2@example.com",
  "password": "testpassword2"
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Date: Thu, 25 Jun 2026 11:54:31 GMT
Content-Length: 198
Connection: close

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzgyMzk1NjcxLCJ1c2VySWQiOjJ9.yj7vKxgAB6zVlChkUvmSVMvOGiUBBORridi8IdIlkOc"
}
```

**S'inscrire à l'événement** (`register.http`) :

```http
POST http://localhost:8080/events/1/register
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzgyMzk1NjcxLCJ1c2VySWQiOjJ9.yj7vKxgAB6zVlChkUvmSVMvOGiUBBORridi8IdIlkOc
```

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Thu, 25 Jun 2026 12:02:32 GMT
Content-Length: 47
Connection: close

{
  "message": "Successfully registered for event."
}
```

**Test avec token invalide** (un caractère supprimé) :

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8
Date: Thu, 25 Jun 2026 12:04:00 GMT
Content-Length: 29
Connection: close

{
  "message": "Not authorized."
}
```

Le middleware `Authenticate` intercepte la requête avant même d'atteindre `registerForEvent`.

## Annuler son inscription

### Déclarer la route DELETE

Dans `routes.go`, dans le groupe `authenticated` :

```go
authenticated.DELETE("/events/:eventId/register", cancelRegistration)
```

### La méthode `CancelRegistration()` — modèle `Event`

Même structure que `Register()`, avec une requête `DELETE` :

```go
func (e Event) CancelRegistration(userId int64) error {
    query := "DELETE FROM registrations WHERE event_id = ? AND user_id = ?"

    stmt, err := db.DB.Prepare(query)
    if err != nil {
        return err
    }
    defer stmt.Close()

    _, err = stmt.Exec(e.ID, userId)
    return err
}
```

### Le handler `cancelRegistration()`

> **Pourquoi `var event models.Event` au lieu de `GetEventByID` ?** `CancelRegistration` n'utilise que `e.ID` pour construire la requête SQL. On n'a pas besoin du reste des champs. Créer un `Event` minimal avec uniquement l'`ID` renseigné évite un aller-retour en base inutile. Pour un enregistrement, `GetEventByID` était nécessaire pour valider l'existence de l'événement avant d'agir ; ici, si l'événement n'existe pas ou si l'utilisateur n'était pas inscrit, la requête `DELETE` retourne simplement 0 lignes affectées sans erreur.

Première version, avec un code de statut incorrect :

```go
func cancelRegistration(context *gin.Context) {
    userId := context.GetInt64("userId")

    eventId, err := strconv.ParseInt(context.Param("eventId"), 10, 64)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id."})
        return
    }

    var event models.Event
    event.ID = eventId

    err = event.CancelRegistration(userId)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not cancel registration for event."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "Successfully canceled registration for event."}) // ← 201 incorrect pour un DELETE
}
```

### Tester — et corriger le code de statut

**Annuler l'inscription** (`cancel-registration.http`) :

```http
DELETE http://localhost:8080/events/1/register
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzgyMzk1NjcxLCJ1c2VySWQiOjJ9.yj7vKxgAB6zVlChkUvmSVMvOGiUBBORridi8IdIlkOc
```

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Date: Thu, 25 Jun 2026 13:04:41 GMT
Content-Length: 58
Connection: close

{
  "message": "Successfully canceled registration for event."
}
```

`201 Created` n'a pas de sens pour une annulation : ce code signifie qu'une ressource a été **créée**. Pour une suppression, `200 OK` est sémantiquement correct. On corrige :

```go
context.JSON(http.StatusOK, gin.H{"message": "Successfully canceled registration for event."})
```

Handler final :

```go
func cancelRegistration(context *gin.Context) {
    userId := context.GetInt64("userId")

    eventId, err := strconv.ParseInt(context.Param("eventId"), 10, 64)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse event id."})
        return
    }

    var event models.Event
    event.ID = eventId

    err = event.CancelRegistration(userId)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not cancel registration for event."})
        return
    }

    context.JSON(http.StatusOK, gin.H{"message": "Successfully canceled registration for event."})
}
```

---

## Résumé

### Table `registrations`

- Table de jointure `(event_id, user_id)` avec `FOREIGN KEY` sur `users(id)` et `events(id)`
- Ajoutée dans `db.go` après `users` et `events` — supprimer `api.db` avant de relancer le serveur

### S'inscrire (`POST /events/:eventId/register`)

- Route dans le groupe `authenticated`
- Handler `registerForEvent()` : `GetInt64("userId")` → parse `eventId` → `GetEventByID` → `event.Register(userId)` → `201 Created`
- Méthode `Register(userId int64) error` sur `Event` : `INSERT INTO registrations (event_id, user_id) VALUES (?, ?)`
- Receveur valeur `(e Event)` : la méthode ne modifie pas le struct

### Se désinscrire (`DELETE /events/:eventId/register`)

- Route dans le groupe `authenticated`
- Handler `cancelRegistration()` : parse `eventId` → `var event models.Event; event.ID = eventId` → `event.CancelRegistration(userId)` → `200 OK`
- `var event models.Event; event.ID = eventId` : évite un `SELECT` inutile — `CancelRegistration` n'utilise que l'ID dans sa requête SQL
- Méthode `CancelRegistration(userId int64) error` sur `Event` : `DELETE FROM registrations WHERE event_id = ? AND user_id = ?`
- **`201 Created` vs `200 OK`** : `201` signifie création d'une ressource — sémantiquement incorrect pour une suppression, `200 OK` est juste

## Pour aller plus loin

L'API couvre les cas de base, mais plusieurs fonctionnalités manquent encore :

**Gestion des sessions**
- `POST /logout` — invalider le token côté client (supprimer le token du stockage local). Les JWT étant stateless, une vraie révocation côté serveur nécessite une blocklist (table `revoked_tokens` ou cache Redis).

**Inscriptions**
- `GET /events/:eventId/registrations` — lister tous les participants d'un événement (route admin/organisateur)
- `GET /users/me/registrations` — lister tous les événements auxquels l'utilisateur connecté est inscrit
- Vérification de doublons dans `Register()` : renvoyer `409 Conflict` si l'utilisateur est déjà inscrit

**Événements**
- `GET /events?from=2026-01-01&to=2026-12-31` — filtrer les événements par date
- `GET /events?location=Paris` — filtrer par lieu
- Pagination : `GET /events?page=1&limit=20`

**Utilisateurs**
- `GET /users/me` — profil de l'utilisateur connecté
- `PUT /users/me` — modifier son email ou mot de passe
- `DELETE /users/me` — supprimer son compte (et ses inscriptions, via `ON DELETE CASCADE`)

**Robustesse**
- Validation des champs à l'entrée (email valide, mot de passe min. 8 caractères, date future pour un événement)
- Gestion des contraintes de capacité : champ `maxAttendees` sur `events`, vérification avant `Register()`
- Transactions SQL pour grouper `Register()` et une vérification de capacité atomiquement
