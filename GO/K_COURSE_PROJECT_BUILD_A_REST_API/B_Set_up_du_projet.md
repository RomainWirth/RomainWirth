# PROJECT: REST API

## Prérequis

* Comprendre comment internet fonctionne
* Comprendre comment le web fonctionne
* Comprendre HTTP et les codes de réponse
* Connaître le concept d'API REST
* Être familier avec git et github (optionnel)

### Rappels

**HTTP** (HyperText Transfer Protocol) est le protocole de communication sur lequel repose le web. Chaque échange entre un client et un serveur passe par une **requête HTTP** (envoyée par le client) et une **réponse HTTP** (renvoyée par le serveur). Les méthodes HTTP les plus courantes sont :

| Méthode | Usage |
|---|---|
| `GET` | Lire une ressource (sans effet de bord) |
| `POST` | Créer une ressource |
| `PUT` / `PATCH` | Mettre à jour une ressource (totalement / partiellement) |
| `DELETE` | Supprimer une ressource |

Chaque réponse contient un **code de statut** qui indique si la requête a réussi ou échoué :

| Plage | Signification | Exemples courants |
|---|---|---|
| 2xx | Succès | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Redirection | `301 Moved Permanently` |
| 4xx | Erreur client | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| 5xx | Erreur serveur | `500 Internal Server Error` |

**Une API REST** (Representational State Transfer) est une architecture qui expose des ressources via des URLs et des méthodes HTTP. Elle est dite *stateless* : chaque requête contient toutes les informations nécessaires à son traitement, le serveur ne conserve pas d'état de session côté serveur entre deux appels.

## Planifier le Projet

L'objectif est de créer un projet de démonstration complet : une API REST.

Il s'agit d'un serveur web qui sert, reçoit, stocke des données et pourrait être utilisé comme backend d'une app mobile, d'un site web, peu importe où on en a besoin.
L'objectif n'est pas de créer l'interface graphique en utilisant du HTML, CSS et JavaScript, mais uniquement le backend : on ne fera qu'envoyer, recevoir, lire et stocker de la data.

Le projet sera une API REST de réservation d'évènements : **"Event Booking"**.

### Description du projet

L'API REST devra prendre en charge les routes avec les requêtes HTTP suivantes :

| Méthode | Route | Action |
|---|---|---|
| `GET` | `/events` | Obtenir la liste de tous les événements disponibles |
| `GET` | `/events/<id>` | Obtenir un événement spécifique par son id |
| `POST` | `/events` | Créer un nouvel événement réservable (authentification requise) |
| `PUT` | `/events/<id>` | Mettre à jour un événement existant (authentification requise) |
| `DELETE` | `/events/<id>` | Supprimer un événement (authentification requise) |
| `POST` | `/signup` | Créer un nouveau compte utilisateur |
| `POST` | `/login` | Authentifier un utilisateur et recevoir un token |
| `POST` | `/events/<id>/register` | Inscrire l'utilisateur connecté à un événement |
| `DELETE` | `/events/<id>/register` | Annuler l'inscription de l'utilisateur connecté à un événement |

L'API devra supporter l'authentification des utilisateurs pour sécuriser certains endpoints.
La couche de protection sera mise en œuvre à l'aide de **JSON Web Tokens (JWT)**.

### Rappel : les JSON Web Tokens (JWT)

Un **JWT** est un token signé numériquement qui encode des informations (appelées *claims*) dans un format compact, transmissible dans un header HTTP. Il est composé de trois parties séparées par des points (`.`) :

```
header.payload.signature
```

1. **Header** : algorithme de signature utilisé (ex. : `HS256`).
2. **Payload** : données utiles (ex. : `userId`, date d'expiration `exp`...). Attention : ces données sont *encodées*, pas *chiffrées* - ne jamais y stocker de mot de passe.
3. **Signature** : garantit que le token n'a pas été falsifié. Elle est calculée avec une clé secrète connue uniquement du serveur.

**Flux d'authentification avec JWT :**
1. L'utilisateur envoie ses identifiants au endpoint `POST /login`.
2. Le serveur les vérifie, génère un JWT signé et le renvoie au client.
3. Pour chaque requête protégée, le client joint le token dans le header `Authorization: Bearer <token>`.
4. Le serveur vérifie la signature du token. Si elle est valide, il autorise l'accès.

Ce mécanisme est *stateless* : le serveur n'a pas besoin de stocker les sessions - la validité est prouvée par la signature.

## Démarrage et mise en place du projet

### Créer l'environnement du projet

* Créer un dossier racine du nom du projet.
* Ajouter un fichier `README.md` (contiendra la description du projet et les instructions).
* Initialiser un dépôt git (optionnel mais recommandé).

**Rappel procédure git + github :**
```bash
git init                        # initialiser le dépôt local
git add .                       # indexer tous les fichiers
git commit -m "initial commit"  # créer le premier commit
# sur GitHub : créer un repo vide, puis :
git remote add origin https://github.com/utilisateur/mon-projet.git
git push -u origin main
```

* Initialiser le module Go :
```bash
# si le projet est hébergé sur github (recommandé)
go mod init github.com/votre-utilisateur/mon-projet

# si le projet est purement local
go mod init mon-projet
```

> La commande `go mod init` crée le fichier `go.mod` qui identifie le module et liste ses dépendances. C'est l'équivalent du `package.json` en Node.js.

* Créer le fichier `main.go` :
```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

Une fois `main.go` créé, par où commencer ? Il existe beaucoup d'endpoints et de features, et on peut vite se perdre.
On pourrait utiliser le package `http` de la [librairie standard de Go](https://pkg.go.dev/net/http), mais dans ce projet, on va utiliser un outil plus avancé : le framework `Gin`.

### Utiliser le framework `Gin`

Gin ne fait pas partie de la librairie standard de Go, mais a été développé par la communauté. C'est l'un des frameworks web Go les plus populaires : il offre un routeur rapide, une gestion claire des middlewares, et un binding automatique des données JSON.

[Site officiel de Gin](https://gin-gonic.com/) - [Repository GitHub](https://github.com/gin-gonic/gin)

**Pourquoi Gin plutôt que `net/http` ?**

| `net/http` (stdlib) | `Gin` |
|---|---|
| Pas de paramètres de route dynamiques natifs (`/events/:id`) | Paramètres de route intégrés et faciles à lire |
| Pas de binding JSON automatique | `ctx.ShouldBindJSON()` lie le corps JSON à une struct |
| Middleware manuel | Système de middleware en chaîne (`gin.Use()`) |
| Idéal pour des projets simples | Idéal pour des APIs avec de nombreuses routes et middlewares |

Pour installer Gin, il faut utiliser la commande :
```bash
go get github.com/gin-gonic/gin
```

> Cette commande télécharge Gin et l'ajoute automatiquement dans `go.mod` et `go.sum`. Le fichier `go.sum` contient les hashes cryptographiques des dépendances pour garantir leur intégrité.

Puis ajouter l'import dans le package `main` :
```Go
import "github.com/gin-gonic/gin"
```

L'import permettra d'utiliser directement Gin dans le projet.

---

## Résumé

| Concept | Rôle dans le projet |
|---|---|
| **API REST** | Architecture exposant des ressources via des URLs et méthodes HTTP |
| **`net/http`** | Package standard de Go - suffisant pour des projets simples |
| **Gin** | Framework web Go - routeur rapide, binding JSON, middlewares |
| **JWT** | Mécanisme d'authentification stateless : le serveur signe un token, le client le présente à chaque requête |
| **`go mod init`** | Initialise le module et crée `go.mod` - point de départ de tout projet Go |
| **`go get`** | Télécharge une dépendance externe et l'enregistre dans `go.mod` |

Ce fichier pose les bases du projet. Les étapes suivantes consisteront à implémenter les routes avec Gin, connecter une base de données, gérer la logique métier des événements, puis sécuriser les endpoints avec les JWT.
