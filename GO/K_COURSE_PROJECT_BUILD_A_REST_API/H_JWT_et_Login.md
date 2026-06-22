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

Maintenant que nous sommes en mesure de valider les informations d'un utilisateur, il est temps de s'assurer que nous pouvons générer un token et le renvoyer au client qui s'est connecté afin qu'il puisse utiliser ce token pour les requêtes qui sont envoyées aux routes protégées et prouver qu'il s'est authentifié avec succès.

## Générer un JWT

Pour générer le token, on utilise le package [golang-jwt/jwt](https://github.com/golang-jwt/jwt) :

```bash
go get -u github.com/golang-jwt/jwt/v5
```

On crée un nouveau fichier `utils/jwt.go` qui contiendra toute la logique de génération et de vérification des tokens.

### Les deux concepts clés : méthode de signature et claims

Avant d'écrire le code, il faut comprendre les deux paramètres que prend `jwt.NewWithClaims()`.

**La méthode de signature — `jwt.SigningMethodHS256`**

La signature d'un JWT garantit qu'il n'a pas été falsifié. Pour la produire, il faut choisir un algorithme et une clé secrète.

`HS256` signifie **HMAC-SHA256** : c'est un algorithme de signature **symétrique** — la même clé secrète est utilisée pour signer le token lors de sa création, et pour vérifier la signature quand le client renvoie le token. Si quelqu'un modifie le payload du token sans connaître la clé, la signature ne correspondra plus et le serveur rejettera le token.

On définit donc une constante `secretKey` connue uniquement du serveur :

```go
const secretKey = "supersecret"
```

> En production, cette clé ne doit pas être dans le code source — elle doit venir d'une variable d'environnement. Pour le cours, une constante suffit. Elle doit être longue et difficile à deviner : si un attaquant la connaît, il peut forger des tokens valides.

**Les claims — `jwt.MapClaims`**

Les "claims" sont les données embarquées dans le payload du JWT. Le mot vient du fait qu'on "affirme" (claims) des choses sur l'utilisateur : "j'affirme que cet utilisateur a l'ID 42 et que ce token expire à telle heure."

`jwt.MapClaims` est simplement une `map[string]any` — un dictionnaire dont les clés sont des strings et les valeurs peuvent être n'importe quel type. C'est la façon la plus directe de définir des claims sans créer un struct dédié.

On y inclut :
- `"email"` et `"userId"` : des données sur l'utilisateur (custom claims)
- `"exp"` : la date d'expiration du token, en timestamp Unix. C'est une claim **standard** reconnue par le package jwt — il vérifiera automatiquement que le token n'est pas expiré. On le règle à maintenant + 2 heures.

> Le payload d'un JWT est encodé en Base64, **pas chiffré**. N'importe qui peut le décoder. Ne jamais y inclure de mot de passe ou de données sensibles.

### La fonction `GenerateToken()`

```go
package utils

import (
    "time"

    "github.com/golang-jwt/jwt/v5"
)

const secretKey = "supersecret"

func GenerateToken(email string, userId int64) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "email":  email,
        "userId": userId,
        "exp":    time.Now().Add(time.Hour * 2).Unix(),
    })

    return token.SignedString([]byte(secretKey))
}
```

Points à noter :

- `jwt.NewWithClaims()` retourne un `*jwt.Token` — un objet token non encore signé.
- `token.SignedString([]byte(secretKey))` finalise le token : il assemble header + payload, calcule la signature HMAC-SHA256, et retourne la chaîne JWT finale sous la forme `header.payload.signature`. L'argument doit être `[]byte` — pour HS256, passer une `string` compile mais provoque une erreur à l'exécution. La conversion `[]byte(secretKey)` est donc obligatoire.
- `SignedString` retourne `(string, error)` — on propage directement le retour avec `return token.SignedString(...)`.

### Appeler `GenerateToken()` dans le handler `login()`

Maintenant que `GenerateToken` existe, on met à jour le handler `login()` pour générer le token après validation des credentials et le retourner au client :

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

    token, err := utils.GenerateToken(user.Email, user.ID)
    if err != nil {
        context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user."})
        return
    }

    context.JSON(http.StatusOK, gin.H{"message": "Login successful!", "token": token})
}
```

> **Pourquoi `user.ID` est disponible ici ?** La méthode `ValidateCredentials()` doit avoir récupéré l'ID depuis la base de données et l'avoir assigné à `u.ID`. C'est une modification à apporter à `ValidateCredentials()` : en plus du `password`, la query doit aussi sélectionner `id`, et le scan doit l'assigner sur le receveur. Pour que cette modification soit visible par l'appelant, `ValidateCredentials()` doit utiliser un **receveur pointeur** `*User`.

Dans ValidateCredentials, deux modifications sont nécessaires :

**1. Passer au receveur pointeur `*User`**

La query sélectionne maintenant aussi `id`, et `Scan` doit l'assigner dans `u.ID`. Avec un receveur valeur `(u User)`, Go travaille sur une **copie** du struct — `Scan(&u.ID)` écrit dans la copie locale, et l'appelant (le handler `login()`) ne verra jamais l'ID mis à jour. Avec `(u *User)`, on modifie directement le struct original.

C'est le même raisonnement que pour `Save()` : dès qu'une méthode a besoin d'écrire dans le struct et que l'appelant doit voir le résultat, le receveur doit être un pointeur.

**2. Sélectionner `id` en plus de `password`**

- Query : `"SELECT id, password FROM users WHERE email = ?"` 
- Scan : `row.Scan(&u.ID, &retrievedPassword)` — l'ordre des arguments doit correspondre exactement à l'ordre des colonnes dans `SELECT`

```go
func (u *User) ValidateCredentials() error {
    query := "SELECT id, password FROM users WHERE email = ?"
    row := db.DB.QueryRow(query, u.Email)

    var retrievedPassword string
    err := row.Scan(&u.ID, &retrievedPassword)
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

Après l'appel à `user.ValidateCredentials()` dans le handler `login()`, `user.ID` contient maintenant l'ID récupéré en base — `utils.GenerateToken(user.Email, user.ID)` peut donc l'embarquer dans le token.
```

### Tester la génération du token

On relance le serveur et on envoie une requête de login avec des credentials valides :

```http
POST http://localhost:8080/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpassword"
}
```

Réponse attendue :

```json
HTTP/1.1 200 OK

{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjE3MjA0NzIwMDAsInVzZXJJZCI6MX0.xxxx"
}
```

Le token est une chaîne en trois parties séparées par des points. On peut le coller sur [jwt.io](https://jwt.io) pour décoder le payload et voir les claims en clair — ce qui confirme que le payload n'est pas chiffré.

## Finaliser la logique JWT
