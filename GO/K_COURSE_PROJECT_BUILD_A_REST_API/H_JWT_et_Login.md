# JWT & Login

## Commencer avec les tokens d'authentification (JWT)

Nous avons maintenant la capacité de créer des utilisateurs. L'étape suivante est de les **authentifier** : vérifier qu'un utilisateur est bien celui qu'il prétend être, et lui permettre d'accéder à des routes protégées.

On veut s'assurer que :
- seuls des utilisateurs connectés peuvent créer, modifier ou supprimer des événements
- chaque événement est lié à son créateur, et seul ce créateur peut le modifier ou le supprimer

Pour cela, on va utiliser des **tokens d'authentification** au format JWT.

### Qu'est-ce qu'un JWT ?

**JWT** (JSON Web Token) est un standard ouvert ([RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)) qui définit un format compact pour transmettre des informations de manière sécurisée entre deux parties.

Un JWT est une chaîne de caractères composée de trois parties séparées par des points :

```
header.payload.signature
```

- **Header** : algorithme de signature utilisé (ex. `HS256`) et type du token (`JWT`), encodé en Base64URL.
- **Payload** : les données embarquées dans le token (ex. l'ID de l'utilisateur, la date d'expiration). Encodé en Base64URL — lisible, mais **non chiffré**.
- **Signature** : hash du header + payload signé avec une clé secrète connue uniquement du serveur. Elle garantit que le token n'a pas été falsifié.

> Le payload est encodé en Base64, **pas chiffré** : n'importe qui peut le décoder et lire son contenu. Il ne faut donc jamais y stocker de données sensibles (mot de passe, etc.). La sécurité repose sur la **signature** : sans la clé secrète, on ne peut pas forger un token valide.

### Comment ça fonctionne ?

1. L'utilisateur envoie ses identifiants (`email` + `password`) sur une route `POST /users/login`.
2. Le serveur vérifie les credentials et, s'ils sont valides, génère un JWT signé contenant l'identité de l'utilisateur.
3. Le serveur retourne ce token au client.
4. Pour chaque requête vers une route protégée, le client joint le token dans le header `Authorization: Bearer <token>`.
5. Le serveur vérifie la signature du token et en extrait les données pour identifier l'utilisateur — **sans consulter la base de données**.

Le serveur ne stocke aucune session côté serveur : le token est **stateless**. Toutes les informations nécessaires sont dans le token lui-même.

Pour implémenter cela, on aura besoin d'une route `POST /login`.

## La route Login

### Enregistrer la route dans `routes.go`

Dans `routes.go`, on ajoute la route :

```go
router.POST("/login", login)
```

La logique de connexion sera gérée par le handler `login()`, défini dans `users.go`.

### Le handler `login()`

Le handler suit le même squelette que `signup()` : bind du JSON, appel d'une méthode du modèle, réponse HTTP.

**Étape 1 — Désérialiser le body**

```go
var user models.User
err := context.ShouldBindJSON(&user)
if err != nil {
    context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
    return
}
```

**Étape 2 — Valider les credentials**

```go
err = user.ValidateCredentials()
if err != nil {
    context.JSON(http.StatusUnauthorized, gin.H{"message": "Could not authenticate user."})
    return
}
```

On répond `401 Unauthorized` (et non `403 Forbidden`) : `401` signifie que l'identité n'est pas établie, `403` que l'identité est connue mais l'accès est refusé. Ici, on ne sait pas qui est l'utilisateur — `401` est le code correct.

**Étape 3 — Répondre au client**

```go
context.JSON(http.StatusOK, gin.H{"message": "Login successful!"})
```

Pour l'instant on retourne un simple message. La génération du token JWT viendra dans l'étape suivante.

**Code complet du handler :**

```go
func login(context *gin.Context) {
    var user models.User

    err := context.ShouldBindJSON(&user)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
        return
    }

    err = user.ValidateCredentials()
    if err != nil {
        context.JSON(http.StatusUnauthorized, gin.H{"message": "Could not authenticate user."})
        return
    }

    context.JSON(http.StatusOK, gin.H{"message": "Login successful!"})
}
```

### La méthode `ValidateCredentials()` dans `models/user.go`

Cette méthode est responsable de deux vérifications :
1. L'email existe-t-il en base de données ?
2. Le mot de passe fourni correspond-il au hash stocké ?

#### Receveur valeur : `User` (pas `*User`)

On utilise un receveur valeur `(u User)` et non pointeur `*User` : la méthode n'a pas besoin de modifier le struct, elle lit simplement `u.Email` et `u.Password`.

#### La query

```go
query := "SELECT password FROM users WHERE email = ?"
row := db.DB.QueryRow(query, u.Email)
```

On utilise `QueryRow` (et non `Query`) car l'email est `UNIQUE` — on attend exactement une ligne ou rien. `QueryRow` retourne directement une `*Row` sans itération.

On ne sélectionne que `password` : si l'email n'existe pas, `Scan` retournera une erreur et on s'arrêtera là.

#### Extraire le mot de passe stocké

```go
var retrievedPassword string
err := row.Scan(&retrievedPassword)
if err != nil {
    return errors.New("Invalid credentials")
}
```

`Scan` lit la colonne `password` dans `retrievedPassword`. Si l'email est introuvable, `err` vaut `sql.ErrNoRows` — on retourne un message générique **sans préciser** que c'est l'email qui est inconnu. Révéler si c'est l'email ou le mot de passe qui est incorrect aiderait un attaquant à deviner les comptes existants (énumération).

#### Vérifier le mot de passe

```go
passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)
if !passwordIsValid {
    return errors.New("Invalid credentials")
}

return nil
```

Même message d'erreur que pour l'email inconnu — intentionnellement vague.

**Code complet :**

```go
func (u User) ValidateCredentials() error {
    query := "SELECT password FROM users WHERE email = ?"
    row := db.DB.QueryRow(query, u.Email)

    var retrievedPassword string
    err := row.Scan(&retrievedPassword)
    if err != nil {
        return errors.New("Invalid credentials")
    }

    passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)
    if !passwordIsValid {
        return errors.New("Invalid credentials")
    }

    return nil
}
```

### La fonction `CheckPasswordHash()` dans `utils/hash.go`

On ajoute cette fonction au fichier `utils/hash.go` aux côtés de `HashPassword` :

```go
func CheckPasswordHash(password, hashedPassword string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
    return err == nil
}
```

Points à noter :
- `CompareHashAndPassword` attend `(hash, password)` dans cet ordre — le hash en premier. Inverser les arguments retournera toujours une erreur.
- On retourne `err == nil` : si le mot de passe correspond, `err` est `nil` → `true`. Sinon → `false`.
- Pas besoin de recalculer le salt : bcrypt l'extrait automatiquement du hash stocké (il fait partie de la chaîne `$2a$10$...`).

### Tester la route login

On crée un fichier `login.http` dans le dossier `api-test` :

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword"
}
```

Réponse attendue avec des credentials valides :

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "message": "Login successful!"
}
```

Avec un mot de passe incorrect ou un email inconnu :

```
HTTP/1.1 401 Unauthorized
Content-Type: application/json; charset=utf-8

{
  "message": "Could not authenticate user."
}
```
