# Résumé du module - Build a REST API

Ce module couvre la construction d'une **API REST complète en Go** avec le framework **Gin**, une base de données **SQLite** et une authentification par **JWT**. L'API permet de gérer des événements et des inscriptions d'utilisateurs.

---

## Sommaire

1. [Set up du projet](#b_set_up_du_projetmd) - Prérequis, rappels HTTP, initialisation du module Go et installation de Gin
2. [Set up de la première route](#c_set_up_premiere_routemd) - Créer le serveur Gin, définir une route GET, struct Event, handler et JSON
3. [Set up d'une BDD SQL](#d_setup_une_bdd_sqlmd) - SQLite, driver CGo go-sqlite3, fichier `db.go`, création de tables
4. [Interactions avec la BDD](#e_interactions_bddmd) - `INSERT`, `SELECT`, `QueryRow`, `Scan`, `Prepare`, `Exec`
5. [Les événements CRUD](#f_crud_eventsmd) - Refactorisation, package `routes`, UPDATE, DELETE, paramètres de route
6. [Utilisateurs et Signup](#g_users_et_signupmd) - Table `users`, struct `User`, hashage bcrypt, route `POST /signup`
7. [JWT et Login](#h_jwt_et_loginmd) - Génération et validation de JWT, route `POST /login`, claims, `MapClaims`
8. [Middleware et Autorisation](#i_middleware_et_autorisationmd) - Récupérer l'`userId` depuis le token, middleware `Authenticate`, groupes de routes, autorisation propriétaire
9. [S'enregistrer aux événements](#j_registration_evenementsmd) - Table `registrations`, `POST /events/:eventId/register`, `DELETE /events/:eventId/register`

---

## [B - Set up du projet](B_Set_up_du_projet.md)

**Sections 175–178**

Point de départ du module. Rappels sur les prérequis théoriques (HTTP, REST, codes de statut) avant d'entrer dans le code.

- Tableau des méthodes HTTP (`GET`, `POST`, `PUT`, `DELETE`) et des plages de codes de statut (2xx, 4xx, 5xx)
- Initialisation du module Go : `go mod init`
- Installation du framework **Gin** : `go get github.com/gin-gonic/gin`
- Explication de `go.mod` et `go.sum`

---

## [C - Set up de la première route](C_Set_up_premiere_route.md)

**Sections 179–181**

Mise en place du serveur HTTP et de la première route. Introduction aux concepts fondamentaux de Gin.

- `gin.Default()` : création du moteur Gin avec les middlewares Logger et Recovery
- `server.Run(":8080")` : démarrage du serveur
- Définition d'une route `GET /events` et d'un **handler** (fonction `*gin.Context`)
- Struct `Event` avec tags JSON (`json:"name"`)
- `context.JSON()` pour renvoyer une réponse JSON avec un code de statut
- Binding JSON entrant avec `context.ShouldBindJSON()`
- Paramètres de route (`:id`) avec `context.Param()`

---

## [D - Set up d'une BDD SQL](D_Setup_une_BDD_SQL.md)

**Sections 182–183**

Introduction de la persistance des données avec SQLite.

- Package `database/sql` (interface générique) + driver **go-sqlite3** (CGo)
- Import blank `_ "github.com/mattn/go-sqlite3"` pour enregistrer le driver
- Fichier `db/db.go` : variable globale `DB *sql.DB`, fonction `InitDB()`
- `sql.Open()` et `DB.Ping()` pour ouvrir et vérifier la connexion
- `DB.Exec()` avec `CREATE TABLE IF NOT EXISTS` pour créer la table `events`
- Appel de `db.InitDB()` depuis `main()`

---

## [E - Interactions avec la BDD](E_Interactions_BDD.md)

**Sections 184–185**

Connexion entre la couche modèles (`models/`) et la base de données.

- `Save()` : insertion avec `INSERT INTO` - `DB.Prepare()`, `stmt.Exec()`, `result.LastInsertId()`
- `GetAllEvents()` : lecture avec `SELECT *` - `DB.Query()`, boucle `rows.Next()`, `rows.Scan()`
- `GetEventByID()` : lecture filtrée avec `WHERE id = ?` - `DB.QueryRow()`, `row.Scan()`
- Importance de `defer stmt.Close()` et `defer rows.Close()`
- Erreurs `sql.ErrNoRows`

---

## [F - Les événements CRUD](F_CRUD_Events.md)

**Sections 186–188**

Complétion du CRUD pour les événements et refactorisation du code.

- Externalisation des routes dans un **package `routes`** : `routes/routes.go`, `RegisterRoutes()`
- Handlers `getEventById()`, `updateEvent()`, `deleteEvent()` ajoutés
- `UPDATE events SET ... WHERE id = ?` avec `Save()` réutilisé / méthode `Update()` dédiée
- `DELETE FROM events WHERE id = ?` - méthode `Delete()` sur `Event`
- Gestion des erreurs : `404 Not Found` si l'événement n'existe pas

---

## [G - Utilisateurs et Signup](G_Users_et_Signup.md)

**Sections 187–188**

Ajout de la gestion des comptes utilisateurs.

- Table `users` (`id`, `email`, `password`) dans `db.go`
- Struct `User` dans `models/user.go` avec tags JSON et binding (`binding:"required"`)
- Hashage du mot de passe avec **bcrypt** : `bcrypt.GenerateFromPassword()`
- Méthode `Save()` sur `User` : `INSERT INTO users`
- Handler `signup()` : binding → hashage → sauvegarde → `201 Created`
- Route `POST /signup` (publique, sans authentification)

---

## [H - JWT et Login](H_JWT_et_Login.md)

**Sections 188–189**

Authentification par token JWT.

- Concept JWT : header + payload (claims) + signature - token signé, non chiffré
- Package `github.com/golang-jwt/jwt/v5`
- `GenerateToken(email string, userId int64)` : `jwt.NewWithClaims()`, `MapClaims` (`email`, `userId`, `exp`), `token.SignedString([]byte(secretKey))`
- Erreur fréquente : `return secretKey` au lieu de `return []byte(secretKey)` → panic au runtime
- `ValidateToken(token string)` : `jwt.Parse()`, vérification `SigningMethodHS256`, extraction des claims
- Handler `login()` : `DB.QueryRow` pour retrouver l'utilisateur, `bcrypt.CompareHashAndPassword()`, génération du token → `200 OK`

---

## [I - Middleware et Autorisation](I_Middleware_et_Autorisation.md)

**Sections 189–192**

Protection des routes et autorisation basée sur la propriété des ressources.

- **Récupérer l'`userId`** : `VerifyToken()` retourne l'`int64` extrait des claims - erreur `.(int64)` qui panique (float64 dans `MapClaims`) → correction `int64(claims["userId"].(float64))`
- **`context.Set("userId", userId)`** dans le handler `createEvent` → `context.GetInt64("userId")` pour lire la valeur
- **Middleware `Authenticate`** : extrait et valide le token depuis le header `Authorization`, appelle `context.AbortWithStatusJSON(401, ...)` si invalide - différence avec `JSON()` + `return`
- **Groupes de routes** Gin : `authenticated := server.Group("/")` + `authenticated.Use(middlewares.Authenticate)` pour appliquer le middleware à un ensemble de routes
- **Autorisation propriétaire** dans `updateEvent()` et `deleteEvent()` : `event.UserID != userId` → `403 Forbidden`

---

## [J - S'enregistrer aux événements](J_Registration_Evenements.md)

**Sections 193–196**

Gestion des inscriptions : une table de jointure et deux nouvelles routes authentifiées.

- Table `registrations` (`event_id`, `user_id`) avec `FOREIGN KEY` sur `users` et `events`
- `Register(userId int64) error` sur `Event` : `INSERT INTO registrations (event_id, user_id) VALUES (?, ?)`
- Handler `registerForEvent()` : `GetInt64("userId")` → `ParseInt` → `GetEventByID` → `Register` → `201 Created`
- `CancelRegistration(userId int64) error` sur `Event` : `DELETE FROM registrations WHERE event_id = ? AND user_id = ?`
- Handler `cancelRegistration()` : `var event models.Event; event.ID = eventId` (évite un SELECT inutile) → `CancelRegistration` → `200 OK`
- Erreur de statut courante : `201 Created` pour un DELETE → correction en `200 OK`
