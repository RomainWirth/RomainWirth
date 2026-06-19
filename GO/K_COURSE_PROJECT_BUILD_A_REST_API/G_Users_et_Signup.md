# Gérer les utilisateurs

En reprenant le descriptif du projet, on peut remarquer qu'il manque encore plusieurs features à implémenter, notamment pour la gestion des utilisateurs.

On va donc devoir ajouter des routes pour implémenter ces features :

| Méthode | Route | Action |
|---|---|---|
| `POST` | `/users/signup` | Créer un nouveau compte utilisateur |
| `POST` | `/users/login` | Authentifier un utilisateur et recevoir un token |
| `POST` | `/events/:id/register` | Inscrire l'utilisateur connecté à un événement |
| `DELETE` | `/events/:id/register` | Annuler l'inscription de l'utilisateur connecté à un événement |

Il faudra aussi protéger certaines routes existantes (création, modification, suppression d'événements) qui ne devront être accessibles qu'à un utilisateur authentifié.

Pour tout cela, il faut d'abord pouvoir stocker des utilisateurs en base de données. On commence donc par ajouter une table `users`.

## Ajouter la table `users` dans `db/db.go`

Dans `db.go`, la fonction `createTables()` ne crée pour l'instant que la table `events`. On va y ajouter la création de la table `users`.

```go
createUsersTable := `
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`
```

Points à noter :
- `UNIQUE` sur `email` - deux utilisateurs ne peuvent pas avoir la même adresse email. SQLite retournera une erreur si on tente d'insérer un doublon.
- `password` stockera le mot de passe **haché**, jamais en clair (traité dans la prochaine section).

On exécute ensuite la query :

```go
_, err := DB.Exec(createUsersTable)
if err != nil {
    panic("Could not create users table.")
}
```

### Ajouter une clé étrangère dans `events`

Puisqu'un événement appartient à un utilisateur, on va formaliser ce lien en base de données avec une contrainte `FOREIGN KEY`. Cela garantit qu'on ne peut pas créer un événement qui référence un `user_id` inexistant.

La table `events` devient :

```go
createEventsTable := `
CREATE TABLE IF NOT EXISTS events (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    description TEXT NOT NULL,
    location    TEXT NOT NULL,
    dateTime    DATETIME NOT NULL,
    user_id     INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
)`
```

> **Virgule importante** : `user_id INTEGER,` - la contrainte `FOREIGN KEY` est une clause de table séparée, pas une propriété de colonne. Sans la virgule, la requête SQL est invalide et `DB.Exec()` retournera une erreur.

Comme `err` est déjà déclarée par le `:=` de la table `users`, on utilise `=` (sans `:`) pour la réutiliser :

```go
_, err = DB.Exec(createEventsTable)
if err != nil {
    panic("Could not create events table.")
}
```

### Ordre de création des tables

`users` doit être créée **avant** `events`. La contrainte `FOREIGN KEY(user_id) REFERENCES users(id)` dans `events` référence une table qui doit déjà exister au moment de l'exécution de `CREATE TABLE`. Inverser l'ordre provoquerait une erreur.

### Pourquoi supprimer la base de données existante ?

`CREATE TABLE IF NOT EXISTS` crée la table seulement si elle n'existe pas encore - mais elle ne **modifie jamais** une table existante. Si le fichier `api.db` existe déjà avec l'ancienne structure de la table `events` (sans `FOREIGN KEY`), Go ne retournera aucune erreur mais la contrainte ne sera pas ajoutée.

Il faut donc supprimer `api.db` avant de relancer le serveur, pour forcer la recréation des tables avec la nouvelle structure.

### État complet de `createTables()`

```go
func createTables() {
    createUsersTable := `
    CREATE TABLE IF NOT EXISTS users (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        email    TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`

    _, err := DB.Exec(createUsersTable)
    if err != nil {
        panic("Could not create users table.")
    }

    createEventsTable := `
    CREATE TABLE IF NOT EXISTS events (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        description TEXT NOT NULL,
        location    TEXT NOT NULL,
        dateTime    DATETIME NOT NULL,
        user_id     INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`

    _, err = DB.Exec(createEventsTable)
    if err != nil {
        panic("Could not create events table.")
    }
}
```

## Ajouter le modèle `User`

Pour travailler sur la logique `signup`, on ajoute un nouveau fichier `models/user.go`.

### Créer le type `User`

Le struct `User` reflète la structure de la table `users` :

```go
package models

type User struct {
    ID       int64
    Email    string `binding:"required"`
    Password string `binding:"required"`
}
```

Les tags `binding:"required"` permettent à `ShouldBindJSON()` de retourner une erreur si ces champs sont absents du body JSON de la requête - exactement comme pour le struct `Event`.

### Ajouter la méthode `Save()`

À la suite du struct, on ajoute une méthode `Save()` pour persister un utilisateur en base de données. Elle suit le même pattern que `Event.Save()`.

#### Receveur pointeur : `*User`

Le receveur doit être un **pointeur** `*User`, pas une valeur `User` :

```go
func (u *User) Save() error { ... }
```

Avec un receveur valeur (`u User`), Go travaille sur une **copie** du struct. L'assignation `u.ID = userId` modifierait la copie locale, et l'appelant ne verrait jamais l'ID mis à jour. Avec `*User`, on modifie directement le struct original - l'appelant récupère bien l'ID généré par la base de données.

#### La query

```go
query := `INSERT INTO users (email, password) VALUES (?, ?)`
```

On n'insère pas `id` : SQLite le génère automatiquement via `AUTOINCREMENT`.

#### Préparer et exécuter la requête

```go
stmt, err := db.DB.Prepare(query)
if err != nil {
    return err
}
defer stmt.Close()

result, err := stmt.Exec(u.Email, u.Password)
if err != nil {
    return err
}
```

`Prepare()` compile la requête SQL à l'avance. `defer stmt.Close()` garantit que le statement est libéré quoi qu'il arrive.

#### Récupérer l'ID généré

```go
userId, err := result.LastInsertId()
if err != nil {
    return err
}
u.ID = userId
return nil
```

`LastInsertId()` retourne `(int64, error)` - il faut gérer l'erreur **avant** d'assigner `u.ID`. On retourne `nil` explicitement pour indiquer que tout s'est bien passé.

#### Code complet

```go
func (u *User) Save() error {
	query := `INSERT INTO users (email, password) VALUES (?, ?)`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(u.Email, u.Password)
	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	u.ID = userId
	return nil
}
```

### Ajouter des routes handlers

Dans le package `routes`, on crée un nouveau fichier `users.go` dédié aux handlers liés aux utilisateurs. Le séparer de `events.go` garde le code organisé par domaine.

#### Enregistrer la route dans `routes.go`

Avant d'écrire le handler, il faut enregistrer la route dans la fonction qui configure le routeur (ex. `RegisterRoutes`) :

```go
router.POST("/users/signup", signup)
```

#### La fonction `signup()`

`signup` est un handler Gin standard : elle reçoit `*gin.Context` et ne retourne rien. Gin l'appelle automatiquement lors d'un `POST /users/signup`.

**Étape 1 — Désérialiser le body JSON**

```go
var user models.User
err := context.ShouldBindJSON(&user)
if err != nil {
    context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
    return
}
```

`ShouldBindJSON` lit le body de la requête et tente de le mapper sur `user`. Grâce aux tags `binding:"required"` du struct `User`, il retourne une erreur si `email` ou `password` est absent. On répond `400 Bad Request` et on sort avec `return` — sans `return`, l'exécution continuerait malgré l'erreur.

On passe `&user` (pointeur) et non `user` (valeur) : `ShouldBindJSON` a besoin de l'adresse mémoire pour modifier le struct.

**Étape 2 — Sauvegarder l'utilisateur**

```go
err = user.Save()
if err != nil {
    context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create user. Try again later."})
    return
}
```

On réutilise la variable `err` (déjà déclarée, donc `=` sans `:`). Si la base de données retourne une erreur (ex. email déjà utilisé - contrainte `UNIQUE`), on répond `500 Internal Server Error`. On pourrait affiner avec `409 Conflict` pour un doublon, mais `500` est suffisant pour l'instant.

**Étape 3 — Répondre au client**

```go
context.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
```

`201 Created` est le code HTTP sémantiquement correct pour une création de ressource. On ne renvoie **pas** l'objet `user` dans la réponse : il contient le mot de passe (même haché), qu'il vaut mieux ne pas exposer inutilement.

#### Code complet de `routes/users.go`

```go
package routes

import (
    "net/http"

    "github.com/<username>/<project>/models"
    "github.com/gin-gonic/gin"
)

func signup(context *gin.Context) {
    var user models.User
    err := context.ShouldBindJSON(&user)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
        return
    }

    err = user.Save()
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create user. Try again later."})
        return
    }

    context.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}
```

#### Tester la nouvelle route

On ajoute un fichier `create-user.http` dans le dossier `api-test`. L'extension **REST Client** de VS Code permet d'envoyer la requête directement depuis l'éditeur en cliquant sur *Send Request*.

```http
POST http://localhost:8080/users/signup
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "testpassword"
}
```

Réponse attendue :

```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{
  "message": "User created successfully"
}
```

Points à vérifier :
- Le statut est bien `201 Created`, pas `200 OK`.
- Le body ne contient **pas** le champ `user` — le mot de passe ne doit pas transiter en clair dans la réponse.
- Renvoyer la même requête une seconde fois doit retourner `500 Internal Server Error` : la contrainte `UNIQUE` sur `email` dans SQLite bloque l'insertion d'un doublon.

#### Ne pas stocker de mot de passe en `Plain Text` en base de données

