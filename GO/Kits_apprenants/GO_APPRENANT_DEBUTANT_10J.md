# TaskFlow - Apprendre Go par la pratique
**Cahier de formation - Version débutant**
8 itérations | Go 1.21+ | 11 jours | Aucun prérequis

> **Version débutant — Option B**
> Ce document propose un projet différent du cahier complet : **TaskFlow**, un gestionnaire de tâches en ligne de commande. Le domaine est volontairement simple (pas de mécanique de jeu, pas de combat, pas de concurrence) pour se concentrer sur les bases du langage. Recommandé si tu n'as jamais programmé ou si tu arrives d'un langage très différent (PHP, Python, JS).

---

## Sommaire

1. [Environnement & premier programme](#itération-1--environnement--premier-programme)
2. [Variables & types](#itération-2--variables--types)
3. [Fonctions & contrôle du flux](#itération-3--fonctions--contrôle-du-flux)
4. [Structs - modéliser une tâche](#itération-4--structs--modéliser-une-tâche)
5. [Slices & maps - gérer la liste](#itération-5--slices--maps--gérer-la-liste)
6. [Fichiers JSON - persister les données](#itération-6--fichiers-json--persister-les-données)
7. [Packages & organisation du code](#itération-7--packages--organisation-du-code)
8. [Tests unitaires *(bonus)*](#itération-8--tests-unitaires-bonus)
9. [Annexe A - Cheat Sheet Go](#annexe-a--cheat-sheet-go)
10. [Annexe B - Commandes et outils](#annexe-b--commandes-et-outils)

> **Comment utiliser ce document**
> - Chaque itération contient : objectifs, explication des concepts, tâches à réaliser et points de vigilance.
> - Lis l'explication **avant** de commencer les tâches - c'est l'inverse du cahier complet.
> - Les sections **⚡ Pour aller plus loin** sont optionnelles.
> - Si tu es bloqué(e) plus de 20 minutes, cherche la réponse dans la documentation officielle : https://go.dev/tour/

---

## Présentation du projet

Tu vas construire **TaskFlow**, un gestionnaire de tâches en ligne de commande.

À la fin du projet, le programme permettra de :
- Ajouter des tâches avec un titre et une priorité
- Lister toutes les tâches (en attente / terminées)
- Marquer une tâche comme terminée
- Supprimer une tâche
- Sauvegarder et charger les tâches depuis un fichier JSON

Exemple d'utilisation :

```
=== TaskFlow ===
> ajouter Écrire la documentation
Tâche ajoutée : "Écrire la documentation" [Normale]

> liste
1. [ ] Écrire la documentation     [Normale]
2. [x] Acheter du café             [Haute]

> terminer 1
✓ Tâche 1 marquée comme terminée.

> sauvegarder
Tâches sauvegardées dans tasks.json ✓
```

---

## Itération 1 - Environnement & premier programme

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Installer Go et configurer son environnement
- Comprendre la structure d'un programme Go minimal
- Créer et exécuter un premier programme
- Comprendre le rôle de `go mod init`

---

### 1.1 - Pourquoi Go ?

> 🏗️ **Pourquoi ce choix ?**
> - Go est un langage **compilé, statiquement typé** : les erreurs de type sont détectées à la compilation, avant même d'exécuter le programme.
> - Sa syntaxe est minimaliste : pas de classes, pas d'héritage, pas de surcharge. Moins de choses à apprendre pour commencer.
> - Le binaire produit est **autonome** : tu compiles une fois, tu distribues un seul fichier.
> - Go est utilisé par Google, Docker, Kubernetes, Terraform, GitHub CLI...

### 1.2 - Installation

**Go 1.21+**
- Télécharger depuis https://go.dev/dl/
- Vérifier l'installation :
  ```bash
  go version
  ```
  Résultat attendu : `go version go1.21.x linux/amd64` (ou similaire selon ton OS)

**Éditeur recommandé : VS Code**
- Installer l'extension **Go** (identifiant : `golang.go`)
- L'extension installe automatiquement les outils Go (gopls, dlv, etc.) au premier démarrage

### 1.3 - Ressources pour débutants

- Tour officiel du langage (exercices interactifs) : https://go.dev/tour/
- Playground en ligne (tester du code sans installer) : https://go.dev/play/
- Documentation standard : https://pkg.go.dev/std

### 1.4 - Créer le projet

```bash
mkdir taskflow
cd taskflow
go mod init taskflow
```

`go mod init` crée un fichier `go.mod` qui déclare le nom du module et la version de Go utilisée.

> 💡 **C'est quoi un module ?**
> Un module Go, c'est comme un projet. `go.mod` est le fichier de configuration — l'équivalent du `package.json` en Node.js. Il liste la version de Go et les dépendances externes.

Créer ensuite un fichier `main.go` à la racine.

### 1.5 - Structure minimale d'un programme Go

```go
package main

import "fmt"

func main() {
    fmt.Println("Bonjour !")
}
```

> 💡 **Les règles de base**
> - Chaque fichier Go commence par `package <nom>`. Le point d'entrée du programme est le package `main`.
> - `import` déclare les packages que tu utilises. `fmt` est le package de formatage (comme `console.log` en JS).
> - `func main()` est la fonction appelée au démarrage — il doit en exister une et une seule dans le package `main`.
> - Pour exécuter : `go run main.go`. Pour compiler : `go build -o taskflow`.

### 1.6 - Tâche : message de bienvenue

Écrire un programme qui affiche dans le terminal :

```
=== TaskFlow ===
Gestionnaire de tâches en ligne de commande
Tape 'aide' pour voir les commandes disponibles.
```

### 1.7 - Livrable

- [ ] `go.mod` créé avec `go mod init taskflow`
- [ ] `main.go` avec la fonction `main()` qui affiche le message de bienvenue
- [ ] Programme exécutable avec `go run main.go`

---

## Itération 2 - Variables & types

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Déclarer des variables avec `:=` et `var`
- Comprendre les types de base (`string`, `int`, `bool`)
- Lire une saisie utilisateur depuis le terminal
- Afficher des valeurs formatées avec `fmt.Printf`

---

### 2.1 - Les types de base en Go

Go est **statiquement typé** : chaque variable a un type fixé à la déclaration, qui ne change pas.

| Type | Exemple | Usage typique |
|------|---------|---------------|
| `string` | `"Écrire la doc"` | Texte |
| `int` | `42` | Nombre entier (taille de liste, index...) |
| `bool` | `true` / `false` | État binaire (fait / pas fait) |
| `float64` | `3.14` | Nombre décimal (rarement utile ici) |

> 💡 **Deux façons de déclarer une variable**
> ```go
> // Déclaration courte — uniquement à l'intérieur d'une fonction
> title := "Écrire la documentation"   // Go infère le type string
> count := 0                            // Go infère le type int
>
> // Déclaration longue — peut être à l'extérieur d'une fonction
> var priority string = "Normale"
> var done bool                         // Valeur zéro : false pour bool, "" pour string, 0 pour int
> ```
> Go **refuse de compiler** si tu déclares une variable sans l'utiliser. C'est voulu : ça évite le code mort.

### 2.2 - Tâche : afficher une tâche

Modifier `main.go` pour demander à l'utilisateur d'entrer une tâche et afficher :

```
=== TaskFlow ===
Nouvelle tâche : Écrire la documentation
Priorité (1=Haute, 2=Normale, 3=Basse) : 2

Tâche créée :
  Titre    : Écrire la documentation
  Priorité : Normale
  Statut   : En attente
```

Les variables à utiliser :

| Variable | Type | Valeur |
|----------|------|--------|
| `title` | `string` | saisie utilisateur |
| `priority` | `int` | saisie utilisateur (1, 2 ou 3) |
| `done` | `bool` | `false` (toujours au départ) |

> 💡 **Lire une saisie utilisateur**
> ```go
> // Lire un seul mot (pas d'espace)
> var title string
> fmt.Scan(&title)
>
> // Lire une ligne complète (avec des espaces)
> reader := bufio.NewReader(os.Stdin)
> title, _ := reader.ReadString('\n')
>
> // Lire un entier
> var priority int
> fmt.Scan(&priority)
> ```
> Le `&` devant le nom de variable signifie "passe l'adresse de cette variable" (on y reviendra à l'itération 4).

> 💡 **Afficher avec formatage**
> ```go
> fmt.Printf("Titre : %s\n", title)      // %s pour string
> fmt.Printf("Priorité : %d\n", priority) // %d pour int
> fmt.Printf("Terminé : %v\n", done)      // %v pour n'importe quel type
> ```

### 2.3 - Tâche : convertir la priorité en texte

Écrire une fonction `priorityLabel(p int) string` qui retourne :
- `"Haute"` si `p == 1`
- `"Normale"` si `p == 2`
- `"Basse"` si `p == 3`
- `"Inconnue"` pour toute autre valeur

> 💡 **`switch` en Go**
> ```go
> switch p {
> case 1:
>     return "Haute"
> case 2:
>     return "Normale"
> default:
>     return "Inconnue"
> }
> ```

### 2.4 - ⚡ Pour aller plus loin

- Utiliser `strings.TrimSpace()` pour supprimer le `\n` en fin de ligne lors de la lecture.
- Déclarer des **constantes** pour les priorités :
  ```go
  const (
      PriorityHigh   = 1
      PriorityNormal = 2
      PriorityLow    = 3
  )
  ```

### 2.5 - Livrable

- [ ] Variables `title`, `priority`, `done` déclarées avec les bons types
- [ ] Saisie utilisateur fonctionnelle pour le titre et la priorité
- [ ] Fonction `priorityLabel(p int) string` correcte
- [ ] Affichage formaté de la tâche créée

---

## Itération 3 - Fonctions & contrôle du flux

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer des fonctions avec paramètres et valeurs de retour
- Utiliser `if / else` pour les conditions
- Utiliser la boucle `for` (il n'y a pas de `while` en Go)
- Implémenter un menu interactif avec `switch`

---

### 3.1 - Déclarer une fonction

```go
// Fonction sans retour
func displayWelcome() {
    fmt.Println("=== TaskFlow ===")
}

// Fonction avec un paramètre et un retour
func priorityLabel(p int) string {
    switch p {
    case 1:
        return "Haute"
    case 2:
        return "Normale"
    default:
        return "Basse"
    }
}

// Fonction avec plusieurs retours (idiomatique en Go)
func parseID(input string) (int, error) {
    id, err := strconv.Atoi(input)
    if err != nil {
        return 0, fmt.Errorf("'%s' n'est pas un nombre valide", input)
    }
    return id, nil
}
```

> 💡 **Gestion d'erreur en Go**
> Go n'a pas d'exceptions. À la place, les fonctions qui peuvent échouer retournent `(résultat, error)`.
> ```go
> id, err := parseID("abc")
> if err != nil {
>     fmt.Println("Erreur :", err)
>     return
> }
> fmt.Println("ID valide :", id)
> ```
> C'est verbeux au début, mais ça force à traiter chaque cas d'erreur explicitement.

### 3.2 - La boucle `for`

En Go, `for` fait tout : boucle classique, boucle infinie, boucle `while`.

```go
// Boucle infinie (sortie avec break)
for {
    fmt.Print("> ")
    // lire commande...
    if commande == "quitter" {
        break
    }
}

// Boucle classique
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}

// Boucle sur un slice (équivalent foreach)
for index, value := range maSlice {
    fmt.Printf("%d : %s\n", index, value)
}
```

### 3.3 - Tâche : menu de commandes

Implémenter une boucle de menu infinie qui lit une commande et l'exécute avec `switch` :

| Commande | Action |
|----------|--------|
| `aide` | Afficher la liste des commandes |
| `ajouter` | Demander un titre et afficher `"Tâche ajoutée !"` (sans vraiment la stocker pour l'instant) |
| `liste` | Afficher `"(liste vide pour l'instant)"` |
| `quitter` | Afficher `"Au revoir !"` et terminer |
| autre | Afficher `"Commande inconnue. Tape 'aide'."` |

```
> aide
Commandes disponibles :
  ajouter  - créer une nouvelle tâche
  liste    - afficher toutes les tâches
  terminer - marquer une tâche comme terminée
  quitter  - quitter le programme

> ajouter
Titre de la tâche : Écrire la doc
Tâche ajoutée !

> quitter
Au revoir !
```

### 3.4 - Tâche : valider la priorité

Écrire une fonction `askPriority() int` qui :
1. Affiche `"Priorité (1=Haute, 2=Normale, 3=Basse) : "`
2. Lit la saisie
3. Si la valeur est invalide (ni 1, ni 2, ni 3), affiche un message d'erreur et redemande
4. Retourne la priorité valide

> 💡 **Boucle de validation**
> ```go
> for {
>     fmt.Print("Priorité : ")
>     var p int
>     fmt.Scan(&p)
>     if p >= 1 && p <= 3 {
>         return p
>     }
>     fmt.Println("Valeur invalide, recommence.")
> }
> ```

### 3.5 - ⚡ Pour aller plus loin

- Ajouter une fonction `readLine(prompt string) string` réutilisable pour lire une ligne avec un message.
- Gérer les commandes insensibles à la casse (`"Aide"`, `"AIDE"` → même résultat) avec `strings.ToLower()`.

### 3.6 - Livrable

- [ ] Boucle de menu fonctionnelle avec `switch`
- [ ] Commande `"quitter"` qui sort proprement
- [ ] Commande `"ajouter"` qui lit un titre et une priorité
- [ ] Fonction `askPriority() int` avec validation

---

## Itération 4 - Structs - modéliser une tâche

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer un `struct` pour regrouper les données d'une tâche
- Comprendre le constructeur idiomatique (`NewTask()`)
- Ajouter des **méthodes** sur un struct
- Comprendre la différence entre receveur valeur et receveur pointeur

---

### 4.1 - Pourquoi un struct ?

Jusqu'ici, une tâche est représentée par des variables séparées : `title`, `priority`, `done`. C'est difficile à manipuler dès qu'on veut en gérer plusieurs.

Un **struct** regroupe toutes ces données dans une seule entité nommée :

```go
type Task struct {
    ID       int
    Title    string
    Priority int
    Done     bool
}
```

> 🏗️ **Go n'a pas de classes**
> En Java ou Python, on utiliserait une classe. En Go, on utilise un struct + des fonctions associées appelées **méthodes**. C'est plus simple : pas d'héritage, pas de visibilité complexe.

### 4.2 - Le struct `Task`

Créer le struct `Task` avec les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `ID` | `int` | Identifiant unique |
| `Title` | `string` | Titre de la tâche |
| `Priority` | `int` | 1=Haute, 2=Normale, 3=Basse |
| `Done` | `bool` | Tâche terminée ou non |
| `CreatedAt` | `string` | Date de création (format `"2006-01-02"`) |

Créer une fonction `NewTask(id int, title string, priority int) Task` qui retourne une tâche initialisée.

> 💡 **Créer une date en Go**
> ```go
> import "time"
>
> today := time.Now().Format("2006-01-02")
> ```
> La date `2006-01-02` est le format de référence en Go (c'est une date fixe qui sert de patron).

### 4.3 - Les méthodes à implémenter

> 💡 **Méthode sur un struct**
> Une méthode est une fonction avec un **receveur** — le struct sur lequel elle opère.
> ```go
> // Receveur valeur — lit mais ne modifie pas
> func (t Task) Display() {
>     status := "[ ]"
>     if t.Done {
>         status = "[x]"
>     }
>     fmt.Printf("%d. %s %-30s [%s]\n", t.ID, status, t.Title, priorityLabel(t.Priority))
> }
>
> // Receveur pointeur — modifie le struct original
> func (t *Task) Complete() {
>     t.Done = true
> }
> ```
> **Règle** : si la méthode modifie le struct → receveur pointeur (`*Task`). Sinon → receveur valeur (`Task`).

Implémenter les méthodes suivantes :

| Méthode | Receveur | Rôle |
|---------|----------|------|
| `Display()` | valeur `(t Task)` | Affiche la tâche formatée |
| `Complete()` | pointeur `(t *Task)` | Marque la tâche comme terminée |
| `IsCompleted() bool` | valeur `(t Task)` | Retourne `true` si la tâche est terminée |
| `Summary() string` | valeur `(t Task)` | Retourne une ligne résumée (ex: `"[x] Écrire la doc (Haute)"`) |

### 4.4 - Tester le struct dans main()

Modifier `main.go` pour créer une tâche avec `NewTask()`, afficher ses détails avec `Display()`, appeler `Complete()` et afficher à nouveau.

```go
task := NewTask(1, "Écrire la documentation", 1)
task.Display()
// 1. [ ] Écrire la documentation              [Haute]

task.Complete()
task.Display()
// 1. [x] Écrire la documentation              [Haute]
```

### 4.5 - ⚡ Pour aller plus loin

- Ajouter un champ `DeadLine string` (date limite) et une méthode `IsOverdue() bool` qui retourne `true` si la deadline est dépassée.
- Ajouter une méthode `Uncomplete()` pour remettre une tâche à "non terminée".

### 4.6 - Livrable

- [ ] Struct `Task` avec tous les champs
- [ ] Fonction `NewTask(id int, title string, priority int) Task`
- [ ] Méthodes `Display`, `Complete`, `IsCompleted`, `Summary`
- [ ] Démonstration dans `main()` avec création, affichage, complétion

---

## Itération 5 - Slices & maps - gérer la liste

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer et manipuler des `slices` (listes dynamiques)
- Comprendre `append`, `len`, la boucle `for range`
- Utiliser une `map` pour grouper des tâches
- Implémenter les commandes `ajouter`, `liste`, `terminer`, `supprimer`

---

### 5.1 - Les slices : listes dynamiques

```go
// Créer une slice vide
tasks := []Task{}

// Ajouter un élément
tasks = append(tasks, NewTask(1, "Écrire la doc", 2))

// Parcourir
for _, task := range tasks {
    task.Display()
}

// Longueur
fmt.Println("Nombre de tâches :", len(tasks))

// Supprimer l'élément à l'index i
tasks = append(tasks[:i], tasks[i+1:]...)
```

> 💡 **Pourquoi `tasks = append(...)` et pas juste `append(...)`?**
> `append` ne modifie pas la slice en place — elle retourne une **nouvelle slice**. Il faut donc réassigner : `tasks = append(tasks, ...)`.

### 5.2 - Gérer un compteur d'ID

Pour attribuer un ID unique à chaque tâche, maintenir un compteur :

```go
nextID := 1

// À chaque ajout :
task := NewTask(nextID, title, priority)
tasks = append(tasks, task)
nextID++
```

### 5.3 - Tâche : implémenter les commandes de gestion

Mettre à jour la boucle de menu pour gérer une slice `tasks []Task` et implémenter :

**`ajouter`** : crée une nouvelle tâche et l'ajoute à la slice.

**`liste`** : affiche toutes les tâches. Si la slice est vide, afficher `"Aucune tâche."`.

```
> liste
1. [ ] Écrire la documentation     [Haute]
2. [ ] Acheter du café             [Normale]
3. [x] Répondre aux mails          [Basse]
```

**`terminer <id>`** : marque la tâche avec l'ID donné comme terminée.

```
> terminer 1
✓ Tâche 1 ("Écrire la documentation") marquée comme terminée.
```

**`supprimer <id>`** : supprime la tâche avec l'ID donné.

```
> supprimer 2
Tâche 2 supprimée.
```

> 💡 **Lire un argument depuis la commande**
> La saisie `"terminer 2"` doit être découpée :
> ```go
> import "strings"
> import "strconv"
>
> parts := strings.SplitN(input, " ", 2)
> if len(parts) == 2 {
>     id, err := strconv.Atoi(strings.TrimSpace(parts[1]))
>     if err != nil {
>         fmt.Println("ID invalide.")
>         continue
>     }
>     // utiliser id...
> }
> ```

> 💡 **Trouver une tâche par son ID**
> ```go
> for i, task := range tasks {
>     if task.ID == id {
>         // tasks[i] pour modifier (pas task — c'est une copie)
>         tasks[i].Complete()
>         return
>     }
> }
> fmt.Println("Tâche introuvable.")
> ```

### 5.4 - Les maps : regrouper par priorité

Une **map** est un dictionnaire clé → valeur.

```go
// Créer une map
tasksByPriority := map[string][]Task{}

// Ajouter
tasksByPriority["Haute"] = append(tasksByPriority["Haute"], task)

// Lire
tasks, ok := tasksByPriority["Haute"]
if !ok {
    fmt.Println("Aucune tâche haute priorité.")
}

// Parcourir
for priority, tasks := range tasksByPriority {
    fmt.Printf("--- %s ---\n", priority)
    for _, t := range tasks {
        t.Display()
    }
}
```

### 5.5 - Tâche : commande `par-priorité`

Ajouter une commande `"par-priorité"` qui affiche les tâches groupées par niveau de priorité (Haute / Normale / Basse), en utilisant une map construite à partir de la slice principale.

```
> par-priorité
--- Haute ---
1. [ ] Écrire la documentation

--- Normale ---
2. [x] Acheter du café

--- Basse ---
(aucune)
```

### 5.6 - ⚡ Pour aller plus loin

- Ajouter une commande `"en-attente"` qui affiche uniquement les tâches non terminées.
- Ajouter une commande `"stats"` qui affiche le nombre de tâches totales, terminées et en attente.

### 5.7 - Livrable

- [ ] Slice `tasks []Task` dans `main()`
- [ ] Commandes `ajouter`, `liste`, `terminer <id>`, `supprimer <id>` fonctionnelles
- [ ] Map utilisée pour la commande `par-priorité`
- [ ] Gestion du cas "tâche introuvable"

---

## Itération 6 - Fichiers JSON - persister les données

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Sérialiser et désérialiser des données avec `encoding/json`
- Lire et écrire un fichier avec `os`
- Gérer les erreurs de fichier sans faire planter le programme
- Comprendre les tags JSON sur les structs

---

### 6.1 - Tags JSON

Les tags JSON indiquent à Go comment nommer les champs dans le fichier :

```go
type Task struct {
    ID       int    `json:"id"`
    Title    string `json:"title"`
    Priority int    `json:"priority"`
    Done     bool   `json:"done"`
    CreatedAt string `json:"created_at"`
}
```

Sans tag, Go utilise le nom du champ tel quel (`"ID"`, `"Title"`...). Avec le tag, tu contrôles le nom dans le JSON.

### 6.2 - Sérialiser et désérialiser

```go
import (
    "encoding/json"
    "os"
)

// Sérialiser (struct → JSON)
data, err := json.MarshalIndent(tasks, "", "  ")
if err != nil {
    fmt.Println("Erreur de sérialisation :", err)
    return
}
err = os.WriteFile("tasks.json", data, 0644)

// Désérialiser (JSON → struct)
data, err := os.ReadFile("tasks.json")
if err != nil {
    fmt.Println("Erreur de lecture :", err)
    return
}
var tasks []Task
err = json.Unmarshal(data, &tasks)
```

### 6.3 - Tâche : fonctions Save et Load

Écrire deux fonctions dans `main.go` :

```go
func saveTasks(tasks []Task, path string) error { ... }
func loadTasks(path string) ([]Task, error)     { ... }
```

Ajouter les commandes :

- `"sauvegarder"` → appelle `saveTasks(tasks, "tasks.json")`
- `"charger"` → appelle `loadTasks("tasks.json")` et remplace la slice courante

```
> sauvegarder
Tâches sauvegardées dans tasks.json ✓

> charger
3 tâche(s) chargée(s) depuis tasks.json.
```

### 6.4 - Gestion des erreurs de fichier

| Situation | Comportement attendu |
|-----------|---------------------|
| Fichier inexistant au chargement | Afficher `"Aucune sauvegarde trouvée."` et démarrer avec une liste vide |
| Erreur d'écriture | Afficher l'erreur et continuer |
| Fichier JSON corrompu | Afficher `"Fichier corrompu, liste vide."` |

```go
// Vérifier si un fichier existe
if _, err := os.Stat(path); os.IsNotExist(err) {
    return nil, nil  // Pas d'erreur, juste pas de fichier
}
```

### 6.5 - ⚡ Pour aller plus loin

- Charger automatiquement `tasks.json` au démarrage si le fichier existe (sans que l'utilisateur ait à taper `charger`).
- Ajouter l'horodatage de sauvegarde avec `time.Now().Format(time.RFC3339)`.

### 6.6 - Livrable

- [ ] Tags JSON sur le struct `Task`
- [ ] Fonctions `saveTasks()` et `loadTasks()` fonctionnelles
- [ ] Commandes `"sauvegarder"` et `"charger"` dans le menu
- [ ] Erreurs de fichier gérées sans crash
- [ ] Fichier `tasks.json` généré lisible (avec indentation)

---

## Itération 7 - Packages & organisation du code

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Organiser le code en packages séparés
- Comprendre la règle d'exportation (majuscule = public)

---

### 7.1 - Architecture cible

```
taskflow/
├── go.mod
├── main.go              ← boucle de menu, entrée utilisateur
├── models/
│   └── task.go          ← struct Task + méthodes + NewTask
└── manager/
    ├── operations.go    ← logique : add, remove, complete, find
    └── save.go          ← saveTasks, loadTasks
```

### 7.2 - La règle d'exportation

> 💡 **Majuscule = exporté = accessible depuis d'autres packages**
> ```go
> // Dans models/task.go
> package models
>
> type Task struct { ... }      // Exporté ✓
> func NewTask(...) Task { ... } // Exporté ✓
>
> func formatDate() string { ... } // Non exporté — interne au package
> ```
> Pas de mot-clé `public` ou `private` en Go : la première lettre suffit.

### 7.3 - Tâche : refactoriser

Déplacer le struct `Task` et ses méthodes dans `models/task.go`. Déplacer la logique de gestion (add, complete, remove) dans `manager/operations.go`. Déplacer les fonctions de fichier dans `manager/save.go`.

```go
// main.go après refactorisation
import (
    "taskflow/models"
    "taskflow/manager"
)

func main() {
    tasks := []models.Task{}
    // ...
    manager.AddTask(&tasks, &nextID, title, priority)
}
```

> 💡 **Import circulaire — à éviter**
> `models` ne doit pas importer `manager`, et `manager` ne doit pas importer `main`. Seul `main.go` peut importer tous les packages. Si tu as une erreur `import cycle`, c'est que deux packages s'importent mutuellement.

### 7.4 - Livrable

- [ ] Dossiers `models/` et `manager/` créés
- [ ] Struct `Task` et méthodes dans `models/task.go`
- [ ] Logique de gestion dans `manager/operations.go`
- [ ] Fonctions fichier dans `manager/save.go`
- [ ] `go run main.go` fonctionne après refactorisation

---

## Itération 8 - Tests unitaires *(bonus)*

⏱ **Durée estimée : 1 jour**

> 💡 **Pourquoi cette itération en bonus ?** Les tests sont une bonne pratique indispensable, mais leur mise en place demande d'avoir bien assimilé la structuration en packages (itération 7). En consacrant une journée entière aux tests, tu peux les explorer sans la fatigue de la refactorisation.

### Objectifs pédagogiques

- Écrire des tests unitaires simples avec `testing`
- Lancer `go test` et interpréter les résultats
- Comprendre pourquoi et comment tester son code

---

### 8.1 - Les tests unitaires en Go

> 💡 **En Go, les tests font partie du langage**
> Pas de framework externe. La convention : créer un fichier `task_test.go` à côté de `task.go`.

```go
// models/task_test.go
package models

import "testing"

func TestNewTask(t *testing.T) {
    task := NewTask(1, "Écrire la doc", 1)

    if task.ID != 1 {
        t.Errorf("ID attendu : 1, obtenu : %d", task.ID)
    }
    if task.Title != "Écrire la doc" {
        t.Errorf("Titre attendu : 'Écrire la doc', obtenu : '%s'", task.Title)
    }
    if task.Done {
        t.Error("Une nouvelle tâche ne devrait pas être terminée")
    }
}
```

```bash
go test ./...       # Lancer tous les tests
go test -v ./...    # Avec le détail de chaque test
```

### 8.2 - Tâche : écrire les tests

Créer `models/task_test.go` avec les tests suivants :

#### Test 1 — `NewTask()`
- Vérifier que l'ID, le titre et la priorité sont correctement initialisés
- Vérifier que `Done == false` à la création

#### Test 2 — `Complete()`
- Appeler `Complete()` sur une tâche neuve
- Vérifier que `Done == true`

#### Test 3 — `IsCompleted()`
- Vérifier que `IsCompleted()` retourne `false` pour une tâche neuve
- Appeler `Complete()`, vérifier que `IsCompleted()` retourne `true`

#### Test 4 — `Summary()`
- Vérifier que `Summary()` contient le titre
- Vérifier que `Summary()` contient `"[x]"` après `Complete()`

> Exemple de résultat attendu pour `Summary()` : `"[x] Écrire la doc (Haute)"`

### 8.3 - ⚡ Pour aller plus loin

- Utiliser le pattern **table-driven tests** pour tester `priorityLabel()` sur toutes les valeurs possibles :
  ```go
  tests := []struct{ input int; expected string }{
      {1, "Haute"}, {2, "Normale"}, {3, "Basse"}, {99, "Inconnue"},
  }
  for _, tt := range tests {
      t.Run(fmt.Sprintf("priorité %d", tt.input), func(t *testing.T) {
          result := PriorityLabel(tt.input)
          if result != tt.expected {
              t.Errorf("attendu %s, obtenu %s", tt.expected, result)
          }
      })
  }
  ```

### 8.4 - Livrable

- [ ] `models/task_test.go` avec les 4 tests
- [ ] `go test ./...` passe avec 0 échec

---

> ✅ **Ce que tu sais maintenant faire**
> - Écrire un programme Go complet avec entrée utilisateur
> - Modéliser des données avec des structs et des méthodes
> - Gérer une liste dynamique avec des slices
> - Persister des données en JSON
> - Organiser son code en packages
> - Écrire et lancer des tests unitaires
>
> **La suite naturelle** : découvrir les **interfaces** (Go version condensée, itération 5) et la **concurrence** avec les goroutines (Go version complète, itération 10).

---

## Annexe A - Cheat Sheet Go

### Déclarations

```go
// Variables
x := 42                    // Déclaration courte (inférence de type)
var y int = 42             // Déclaration longue
var z int                  // Valeur zéro : 0

// Constantes
const MaxPriority = 3
const (
    PriorityHigh   = 1
    PriorityNormal = 2
    PriorityLow    = 3
)
```

### Fonctions

```go
func greet(name string) string {
    return "Bonjour, " + name
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division par zéro")
    }
    return a / b, nil
}
```

### Structs

```go
type Task struct {
    ID    int
    Title string
    Done  bool
}

// Constructeur idiomatique
func NewTask(id int, title string) Task {
    return Task{ID: id, Title: title, Done: false}
}

// Receveur valeur (lecture seule)
func (t Task) IsCompleted() bool { return t.Done }

// Receveur pointeur (modification)
func (t *Task) Complete() { t.Done = true }
```

### Slices

```go
tasks := []Task{}
tasks = append(tasks, NewTask(1, "Écrire la doc"))

for i, task := range tasks {
    fmt.Printf("%d : %s\n", i, task.Title)
}

// Supprimer l'élément à l'index i
tasks = append(tasks[:i], tasks[i+1:]...)

fmt.Println("Nombre :", len(tasks))
```

### Maps

```go
m := map[string]int{"Haute": 0, "Normale": 0}
m["Haute"]++

val, ok := m["Inconnue"]  // ok = false si la clé n'existe pas

for key, val := range m {
    fmt.Printf("%s : %d\n", key, val)
}
```

### JSON

```go
import "encoding/json"
import "os"

// Struct avec tags
type Task struct {
    ID    int    `json:"id"`
    Title string `json:"title"`
    Done  bool   `json:"done"`
}

// ⚠️ En production, toujours vérifier les erreurs (ne pas utiliser _)
// Écrire
data, _ := json.MarshalIndent(tasks, "", "  ")
os.WriteFile("tasks.json", data, 0644)

// Lire
data, _ := os.ReadFile("tasks.json")
var tasks []Task
json.Unmarshal(data, &tasks)
```

### Gestion d'erreurs

```go
result, err := doSomething()
if err != nil {
    fmt.Println("Erreur :", err)
    return
}

// Vérifier si un fichier existe
if _, err := os.Stat(path); os.IsNotExist(err) {
    fmt.Println("Fichier introuvable")
}
```

### Tests

```go
// models/task_test.go
package models

import "testing"

func TestComplete(t *testing.T) {
    task := NewTask(1, "Test", 1)
    task.Complete()
    if !task.IsCompleted() {
        t.Error("La tâche devrait être marquée comme terminée")
    }
}
```

---

## Annexe B - Commandes et outils

### Commandes essentielles

| Commande | Usage |
|----------|-------|
| `go run main.go` | Compiler et exécuter |
| `go build -o taskflow` | Compiler en binaire |
| `go mod init <nom>` | Initialiser un module |
| `go mod tidy` | Nettoyer les dépendances inutilisées |
| `go fmt ./...` | Formater tout le code |
| `go vet ./...` | Analyser les erreurs courantes |
| `go test ./...` | Lancer tous les tests |
| `go test -v ./...` | Tests avec détail |
| `go test -cover ./...` | Tests avec couverture de code |

### Outils recommandés

| Outil | Usage |
|-------|-------|
| **gopls** | Serveur de langage (installé par l'extension VS Code) |
| **dlv** | Debugger Go |
| **staticcheck** | Linter statique |

### Structure du projet final

```
taskflow/
├── go.mod
├── go.sum
├── main.go
├── models/
│   ├── task.go
│   └── task_test.go
└── manager/
    ├── operations.go
    └── save.go
```

