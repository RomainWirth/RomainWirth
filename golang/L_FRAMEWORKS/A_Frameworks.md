# Frameworks web en Go

La bibliothèque standard de Go inclut un serveur HTTP complet (`net/http`), suffisant pour construire une API. Les frameworks web s'appuient dessus pour ajouter du routing avancé, des middlewares, la gestion des paramètres de requête, etc. - sans sacrifier les performances.

## Fiber

[Fiber](https://gofiber.io/) est un framework web **inspiré d'Express.js** (Node.js), conçu pour être familier aux développeurs JavaScript tout en tirant parti des performances de Go. Il est bâti sur [**Fasthttp**](https://github.com/valyala/fasthttp), une implémentation HTTP alternative à `net/http`, optimisée pour la haute performance et la faible allocation mémoire.

### Points forts

- **Syntaxe proche d'Express** : `app.Get("/route", handler)`, middlewares, groupes de routes - très lisible pour qui connaît Node.js.
- **Performances élevées** : Fasthttp traite les requêtes sans allouer d'objets inutiles, ce qui réduit la pression sur le garbage collector.
- **Écosystème riche** : middlewares intégrés pour le logging, la compression, le CORS, le rate limiting, la gestion de sessions, etc.
- **Prise en main rapide** : idéal pour prototyper ou migrer une API Express vers Go.

### Exemple minimal

```go
package main

import "github.com/gofiber/fiber/v2"

func main() {
    app := fiber.New()

    // définition d'une route GET
    app.Get("/hello", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"message": "Hello, Fiber!"})
    })

    // démarrage du serveur sur le port 3000
    app.Listen(":3000")
}
```

### Point d'attention

Fiber utilise Fasthttp, qui n'est **pas compatible** avec `net/http`. Les middlewares ou librairies construits pour `net/http` (la très grande majorité de l'écosystème Go) ne fonctionnent pas directement avec Fiber. C'est un compromis à considérer si l'intégration avec d'autres packages Go est prioritaire.

---

## Gin

[Gin](https://gin-gonic.com/) est l'un des frameworks Go les plus populaires et les plus utilisés en production. Il est bâti sur `net/http` (contrairement à Fiber), ce qui le rend **totalement compatible** avec l'écosystème standard Go.

### Points forts

- **Compatibilité `net/http`** : tous les middlewares et packages standards fonctionnent sans adaptation.
- **Performances solides** : utilise un router basé sur un arbre radix (*httprouter*), très efficace pour les APIs avec de nombreuses routes.
- **Mature et stable** : large communauté, nombreux exemples et intégrations disponibles (Swagger, bases de données, auth...).
- **Binding et validation** : liaison automatique du JSON/form/query vers des structs Go, avec validation intégrée via des struct tags (`binding:"required"`).

### Exemple minimal

```go
package main

import "github.com/gin-gonic/gin"

func main() {
    r := gin.Default() // inclut les middlewares Logger et Recovery par défaut

    // définition d'une route GET avec paramètre d'URL
    r.GET("/hello/:name", func(c *gin.Context) {
        name := c.Param("name")
        c.JSON(200, gin.H{"message": "Hello, " + name + "!"})
    })

    // démarrage du serveur sur le port 8080
    r.Run(":8080")
}
```

---

## Echo

[Echo](https://echo.labstack.com/) est un framework minimaliste et très performant, lui aussi bâti sur `net/http`. Il est souvent comparé à Gin : les deux partagent les mêmes atouts (compatibilité standard, performances, maturité), mais Echo se distingue par une API légèrement plus explicite et une gestion des middlewares et du contexte plus flexible.

### Points forts

- **Contexte enrichi** : `echo.Context` offre des helpers pratiques pour lire les paramètres, binder les corps de requête, envoyer des réponses JSON/XML/HTML en une seule ligne.
- **Routing précis** : supporte les paramètres de chemin, les wildcards, et les groupes de routes avec middlewares dédiés par groupe.
- **Middleware intégré** : logger, recover, CORS, JWT, rate limiter, compression - tous officiellement maintenus.
- **Validation** : intégration native avec des librairies de validation comme `go-playground/validator`.
- **Compatible `net/http`** : comme Gin, pleinement interopérable avec l'écosystème standard.

### Exemple minimal

```go
package main

import (
    "net/http"
    "github.com/labstack/echo/v4"
)

func main() {
    e := echo.New()

    // définition d'une route GET avec paramètre d'URL
    e.GET("/hello/:name", func(c echo.Context) error {
        name := c.Param("name")
        return c.JSON(http.StatusOK, map[string]string{"message": "Hello, " + name + "!"})
    })

    // démarrage du serveur sur le port 8080
    e.Logger.Fatal(e.Start(":8080"))
}
```

---

## Comparatif rapide

| | **Fiber** | **Gin** | **Echo** |
|---|---|---|---|
| Base HTTP | Fasthttp | `net/http` | `net/http` |
| Compatibilité écosystème Go | Limitée | Totale | Totale |
| Inspiré de | Express (Node.js) | - | - |
| Performances brutes | Très élevées | Élevées | Élevées |
| Courbe d'apprentissage | Faible (si connu Express) | Faible | Faible |
| Maturité / communauté | Croissante | Très large | Large |
| Idéal pour | APIs hautes performances, profil JS | APIs standard, projets d'équipe | APIs avec contexte riche, middlewares fins |

> **En résumé** : **Fiber** pour les performances maximales avec une syntaxe Express. **Gin** pour la compatibilité maximale et la plus grande communauté. **Echo** pour une API un peu plus expressive et une gestion fine des middlewares par groupe de routes. Les trois sont d'excellents choix - le critère déterminant est souvent le profil de l'équipe et les contraintes d'intégration.
