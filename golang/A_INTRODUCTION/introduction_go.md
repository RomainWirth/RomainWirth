# Introduction au Go

## Qu'est-ce que Go ?

Go (aussi appelé **Golang**) est un langage de programmation open source compilé et statiquement typé, conçu pour être simple, efficace et lisible. Il produit des binaires natifs, ce qui lui confère des performances proches du C, tout en offrant une syntaxe bien plus accessible.

Quelques caractéristiques clés :

- **Compilation rapide** : le compilateur Go est extrêmement rapide.
- **Gestion mémoire automatique** : garbage collector intégré.
- **Concurrence native** : les **goroutines** et les **channels** rendent la programmation concurrente simple et efficace.
- **Typage statique** : les erreurs de type sont détectées à la compilation.
- **Bibliothèque standard riche** : couvre HTTP, JSON, cryptographie, tests, etc.
- **Binaire autonome** : les programmes compilés ne nécessitent pas de runtime externe.

---

## Historique

| Année | Événement |
|-------|-----------|
| **2007** | Conception du langage par **Robert Griesemer**, **Rob Pike** et **Ken Thompson** chez Google, en réaction à la complexité croissante des projets C++. |
| **2009** | Annonce publique et mise en open source de Go. |
| **2012** | Sortie de **Go 1.0**, première version stable avec une API garantie stable. |
| **2015** | Introduction du **garbage collector** à faible latence (GC concurrent). |
| **2022** | **Go 1.18** introduit les **génériques**, fonctionnalité très attendue. |
| **2024** | La série **Go 1.22+** continue d'améliorer les performances et la sécurité de la boucle `for`. |

Go est né de la frustration face aux temps de compilation interminables et à la complexité de C++. L'objectif était de créer un langage aussi performant que C, mais aussi productif que Python.

---

## Dans quels types de projets Go est-il utilisé ?

### Services backend & APIs REST
Go est massivement utilisé pour construire des serveurs HTTP et des APIs grâce à sa bibliothèque standard `net/http` et à des frameworks comme **Gin**, **Echo** ou **Chi**.

### Microservices & systèmes distribués
Sa légèreté, ses performances et sa gestion native de la concurrence en font un excellent choix pour les architectures microservices. Des outils comme **Docker** et **Kubernetes** sont eux-mêmes écrits en Go.

### Outils en ligne de commande (CLI)
Grâce aux binaires compilés autonomes, Go est idéal pour créer des outils CLI portables. Des projets comme **Hugo**, **Terraform** ou **GitHub CLI** (`gh`) utilisent Go.

### Infrastructure & DevOps
De nombreux outils de l'écosystème cloud-native sont écrits en Go : Docker, Kubernetes, Prometheus, Terraform, Consul, etcd...

### Traitement de données & concurrence
Les goroutines permettent de traiter de grands volumes de données ou de gérer de nombreuses connexions simultanées avec peu de ressources.

---

## Démarrer un projet Go

### 1. Installer Go

Télécharger et installer Go depuis le site officiel :
[https://go.dev/dl/](https://go.dev/dl/)

Vérifier l'installation :

```bash
go version
# go version go1.22.x linux/amd64
```

### 2. Initialiser un module

Go utilise les **modules** comme système de gestion de dépendances (depuis Go 1.11).

```bash
# Créer un dossier pour le projet
mkdir mon-projet && cd mon-projet

# Initialiser le module (remplacer par votre chemin de module)
go mod init github.com/votre-utilisateur/mon-projet
```

Cela crée un fichier `go.mod` qui définit le nom du module et la version de Go utilisée.

### 3. Créer le fichier principal

```bash
touch main.go
```

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
```

### 4. Lancer le programme

```bash
# Exécuter directement
go run main.go

# Compiler en binaire
go build -o mon-programme
./mon-programme
```

### 5. Ajouter des dépendances

```bash
# Ajouter un package externe
go get github.com/gin-gonic/gin

# Nettoyer les dépendances inutilisées
go mod tidy
```

### Structure typique d'un projet Go

```
mon-projet/
├── go.mod
├── go.sum
├── main.go
├── internal/        # code privé au projet
│   └── handlers/
├── pkg/             # code réutilisable/exportable
│   └── utils/
└── cmd/             # points d'entrée si plusieurs binaires
    └── server/
```

---

## Liens utiles

- **Documentation officielle** : [https://go.dev/doc/](https://go.dev/doc/)
- **Tour interactif de Go** : [https://go.dev/tour/](https://go.dev/tour/)
- **Bibliothèque standard** : [https://pkg.go.dev/std](https://pkg.go.dev/std)
- **Playground en ligne** : [https://go.dev/play/](https://go.dev/play/)
- **Go by Example** : [https://gobyexample.com/](https://gobyexample.com/)
