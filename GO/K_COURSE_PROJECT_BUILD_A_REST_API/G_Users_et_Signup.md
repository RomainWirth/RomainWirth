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
