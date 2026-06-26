# Projet Adventure Quest - Apprendre Go par la pratique
**Cahier de formation - Version condensée**
8 itérations | Go 1.21+ | 11 jours

> **Version condensée — Option A**
> Ce document est une variante du cahier complet (21 jours). L'API REST a été supprimée. Deux fusions ont été opérées : Environnement+Variables (J1) et Packages+Fichiers (J6). Les goroutines/channels sont abordés en itération 8 sous une forme ciblée et pratique. Recommandé pour les apprenants ayant déjà des bases dans un autre langage.

---

## Sommaire

1. [Environnement & premiers pas](#itération-1--environnement--premiers-pas)
2. [Fonctions et contrôle du flux](#itération-2--fonctions-et-contrôle-du-flux)
3. [Structs et méthodes - modéliser le héros](#itération-3--structs-et-méthodes--modéliser-le-héros)
4. [Slices et maps - inventaire et quêtes](#itération-4--slices-et-maps--inventaire-et-quêtes)
5. [Interfaces - différents types de quêtes](#itération-5--interfaces--différents-types-de-quêtes)
6. [Packages & persistance JSON](#itération-6--packages--persistance-json)
7. [Tests unitaires - valider le comportement du jeu](#itération-7--tests-unitaires--valider-le-comportement-du-jeu)
8. [Goroutines & channels - concurrence ciblée](#itération-8--goroutines--channels---concurrence-ciblée)
9. [Annexe A - Cheat Sheet Go](#annexe-a--cheat-sheet-go)
10. [Annexe B - Commandes et outils](#annexe-b--commandes-et-outils)

> **Comment utiliser ce document**
> - Chaque itération contient : objectifs, contexte du projet, tâches à réaliser et points de vigilance.
> - Les tâches sont à réaliser **avant** de consulter les notes de cours.
> - Les sections **⚡ Pour aller plus loin** sont optionnelles.
> - Les solutions ne sont pas incluses - l'objectif est de chercher, expérimenter et comprendre.

---

## Présentation du projet

Tu vas construire **Adventure Quest**, un gestionnaire de quêtes RPG en ligne de commande.

À la fin du projet, le programme permettra de :
- Créer un héros avec un nom, des points de vie et un niveau
- Ajouter des quêtes à compléter (mission de combat, mission d'exploration, mission de collecte)
- Afficher la liste des quêtes actives et terminées
- Calculer les récompenses selon le type de quête
- Sauvegarder et charger la progression depuis un fichier
- Lancer des tâches concurrentes : timer de quête et sauvegarde automatique en arrière-plan

Chaque itération ajoute une brique. Tu commenceras avec un simple `Hello, World!` et tu termineras avec un programme complet.

---

## Itération 1 - Environnement & premiers pas

⏱ **Durée estimée : 1 jour**

> 🗓️ **Journée dense** : cette itération couvre l'installation ET les bases du langage. Prends le temps de tester chaque exemple dans le playground (https://go.dev/play/) avant de passer à la suite.

### Objectifs pédagogiques

- Installer Go et configurer son environnement
- Comprendre la structure d'un programme Go minimal
- Déclarer des variables avec `:=` et `var`
- Comprendre les types de base (`string`, `int`, `float64`, `bool`)
- Utiliser `fmt.Scan()` pour lire une saisie utilisateur

---

### 1.1 - Pourquoi Go ?

> 🏗️ **Pourquoi ce choix ?**
> - Go est un langage **compilé, statiquement typé** : les erreurs de type sont détectées à la compilation.
> - Sa syntaxe est minimaliste : pas de classes, pas d'héritage, pas de surcharge.
> - La gestion de la **concurrence** est native (goroutines, channels) - un atout majeur pour les APIs et les outils serveur.
> - Le binaire produit est **autonome** : aucune dépendance à installer sur la machine cible.
> - Go est utilisé par Google, Docker, Kubernetes, Terraform, GitHub CLI...

### 1.2 - Installation

**Go 1.21+**
- Télécharger depuis https://go.dev/dl/
- Vérifier l'installation :
  ```bash
  go version
  ```
  Résultat attendu : `go version go1.21.x linux/amd64` (ou similaire)

**Éditeur recommandé : VS Code**
- Installer l'extension **Go** (identifiant : `golang.go`)
- L'extension installe automatiquement les outils Go (gopls, dlv, etc.) au premier démarrage

### 1.3 - Ressources

- Tour officiel du langage (interactif) : https://go.dev/tour/
- Documentation standard : https://pkg.go.dev/std
- Playground en ligne : https://go.dev/play/

### 1.4 - Créer le projet

```bash
mkdir adventure-quest
cd adventure-quest
go mod init adventure-quest
```

`go mod init` crée un fichier `go.mod` qui déclare le nom du module et la version de Go utilisée. C'est l'équivalent du `package.json` en Node.js ou du `pom.xml` en Java.

Créer ensuite un fichier `main.go` à la racine.

### 1.5 - Premier programme : annoncer le jeu

Écrire un programme qui affiche dans le terminal :

```
=== Adventure Quest ===
Bienvenue, aventurier !
Tape 'aide' pour commencer.
```

> 💡 **À noter**
> - Tout programme Go possède un **package `main`** et une **fonction `main()`** - c'est le point d'entrée.
> - `fmt.Println()` affiche une ligne. `fmt.Printf()` permet le formatage (`%s`, `%d`, `%v`...).
> - Pour exécuter : `go run main.go`. Pour compiler : `go build -o adventure-quest`.

### 1.6 - Les types de base en Go

| Type | Exemple | Notes |
|------|---------|-------|
| `string` | `"Aragorn"` | Séquence de bytes UTF-8 |
| `int` | `42` | Entier signé (64 bits sur la plupart des machines) |
| `float64` | `3.14` | Flottant 64 bits (type flottant par défaut) |
| `bool` | `true` / `false` | |

> 💡 **`:=` vs `var`**
> ```go
> name := "Aragorn"         // Déclaration courte - seulement dans une fonction
> var level int = 1         // Déclaration longue - peut être à l'extérieur d'une fonction
> var hp int                // Valeur zéro : 0 pour int, "" pour string, false pour bool
> ```
> Go n'autorise pas les variables déclarées mais non utilisées - le compilateur refuse.

### 1.7 - Tâche : créer le héros

Modifier `main.go` pour :

1. Demander à l'utilisateur de saisir le nom de son héros
2. Afficher les stats initiales du héros :

```
=== Adventure Quest ===
Entre le nom de ton héros : Thorin
---
Héros : Thorin
Points de vie : 100
Niveau : 1
Or : 0
---
Que veux-tu faire ? (quêtes / stats / quitter)
```

Les variables à utiliser :

| Variable | Type | Valeur initiale |
|----------|------|-----------------|
| `heroName` | `string` | saisie utilisateur |
| `heroHP` | `int` | `100` |
| `heroLevel` | `int` | `1` |
| `heroGold` | `int` | `0` |

> 💡 **Lire une saisie**
> ```go
> var name string
> fmt.Scan(&name)   // Lit un mot (s'arrête à l'espace)
>
> reader := bufio.NewReader(os.Stdin)
> name, _ := reader.ReadString('\n')  // Lit toute la ligne
> ```
> Pour lire une ligne entière (avec des espaces), `bufio.NewReader` est nécessaire.

### 1.8 - Tâche : mini-calculateur de niveau

Écrire une fonction `xpToNextLevel(level int) int` qui retourne le XP nécessaire pour passer au niveau suivant selon la formule : `level * 100`.

Puis afficher, pour les niveaux 1 à 5 :

```
Niveau 1 → 100 XP pour progresser
Niveau 2 → 200 XP pour progresser
Niveau 3 → 300 XP pour progresser
...
```

> 💡 **À noter**
> - En Go, une fonction retourne un type explicitement déclaré dans sa signature.
> - Pas de `return` implicite : chaque chemin d'exécution doit retourner une valeur.

### 1.9 - ⚡ Pour aller plus loin

- Ajouter un type `heroClass` de type `string` avec une constante `const` pour les classes disponibles (`"Guerrier"`, `"Mage"`, `"Rôdeur"`).
- Utiliser `iota` pour définir les classes comme constantes numériques.

### 1.10 - Livrable

- [ ] `go.mod` créé avec `go mod init adventure-quest`
- [ ] `main.go` avec la fonction `main()` qui affiche le message de bienvenue
- [ ] Variable `heroName` lue depuis le terminal
- [ ] Affichage des stats initiales
- [ ] Fonction `xpToNextLevel(level int) int` correcte
- [ ] Boucle affichant les XP pour les niveaux 1 à 5

---

## Itération 2 - Fonctions et contrôle du flux

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer des fonctions avec plusieurs valeurs de retour
- Utiliser `if / else`, `switch` et la boucle `for`
- Comprendre le pattern `value, err` (gestion d'erreur idiomatique)
- Implémenter une boucle de jeu principale

---

### 2.1 - Les valeurs de retour multiples

Go permet de retourner plusieurs valeurs depuis une fonction :

```go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division par zéro")
    }
    return a / b, nil
}

result, err := divide(10, 2)
if err != nil {
    fmt.Println("Erreur :", err)
    return
}
fmt.Println(result) // 5
```

Le pattern `result, err` est au cœur de Go. Il n'y a pas d'exceptions : les erreurs sont des valeurs comme les autres.

### 2.2 - Tâche : menu de jeu en boucle

Implémenter une boucle de jeu (`for` infini) qui :

1. Affiche le prompt : `> `
2. Lit la commande saisie
3. Traite la commande avec un `switch` :
   - `"stats"` → afficher les stats du héros
   - `"quêtes"` → afficher `"(liste vide pour l'instant)"`
   - `"aide"` → afficher la liste des commandes disponibles
   - `"quitter"` → afficher un message d'au revoir et terminer le programme
   - toute autre entrée → afficher `"Commande inconnue. Tape 'aide' pour voir les commandes."`

```
> stats
Héros : Thorin | PV : 100 | Niveau : 1 | Or : 0

> aide
Commandes disponibles :
  stats   - afficher les stats du héros
  quêtes  - lister les quêtes actives
  aide    - afficher cette aide
  quitter - quitter le jeu

> quitter
À bientôt, Thorin !
```

> 💡 **`for` en Go**
> ```go
> for {          // Infini (équivalent while(true))
>     // ...
>     break      // Pour sortir
> }
>
> for i := 0; i < 5; i++ { }   // Classique
>
> for index, value := range slice { }  // Range
> ```
> Il n'existe pas de `while` en Go - tout se fait avec `for`.

### 2.3 - Tâche : simuler un lancer de dé

Écrire une fonction `rollDice(sides int) int` qui retourne un entier aléatoire entre 1 et `sides` inclus.

Ajouter la commande `"dé"` au menu : lancer un dé à 6 faces et afficher le résultat.

```
> dé
Tu lances le dé... et obtiens un 4 !
```

> 💡 **Nombres aléatoires**
> ```go
> import "math/rand"
>
> n := rand.Intn(6) + 1  // Entier entre 1 et 6
> ```
> Depuis Go 1.20, le générateur est automatiquement initialisé - pas besoin de `rand.Seed()`.

### 2.4 - Tâche : fonction de combat rapide

Écrire `simulateFight(heroHP int, enemyHP int, heroAttack int, enemyAttack int) (bool, int)` qui :
- Simule un combat tour par tour (le héros attaque en premier)
- Retourne `(true, pvRestants)` si le héros gagne, `(false, 0)` si le héros perd
- Affiche chaque tour dans le terminal

> 💡 **À noter**
> - Utiliser une boucle `for` avec condition.
> - Vérifier après chaque attaque si les PV tombent à 0 ou en dessous.

### 2.5 - ⚡ Pour aller plus loin

- Ajouter une fonction `clamp(value, min, max int) int` qui s'assure qu'une valeur reste dans un intervalle.
- Utiliser des **named return values** : `func rollDice(sides int) (result int)`.

### 2.6 - Livrable

- [ ] Boucle de jeu avec `switch` sur les commandes
- [ ] Commande `"quitter"` qui sort proprement du programme
- [ ] Fonction `rollDice(sides int) int` fonctionnelle
- [ ] Fonction `simulateFight()` avec affichage des tours

---

## Itération 3 - Structs et méthodes - modéliser le héros

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer des `struct` pour modéliser les données
- Ajouter des **méthodes** sur des structs (receveur valeur vs pointeur)
- Comprendre la différence entre receveur valeur `(h Hero)` et receveur pointeur `(h *Hero)`
- Introduire la notion de constructeur idiomatique (`NewHero()`)

---

### 3.1 - Architecture à créer

> 🏗️ **Pourquoi ce choix ?**
> - Remplacer les variables `heroName`, `heroHP`, etc. par un **struct `Hero`** regroupe les données liées dans une seule entité.
> - Les **méthodes** (`func (h Hero) DisplayStats()`) associent le comportement à la donnée - c'est l'équivalent Go des méthodes de classe en Java/Python, sans l'héritage.
> - Go n'a pas de constructeurs : la convention est une fonction `NewXxx()` qui retourne une valeur initialisée.

### 3.2 - Le struct `Hero`

Créer le struct `Hero` avec les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| `Name` | `string` | Nom du héros |
| `HP` | `int` | Points de vie actuels |
| `MaxHP` | `int` | Points de vie maximum |
| `Level` | `int` | Niveau actuel |
| `XP` | `int` | Points d'expérience |
| `Gold` | `int` | Or accumulé |
| `Attack` | `int` | Force d'attaque de base |

Créer une fonction `NewHero(name string) Hero` qui retourne un `Hero` initialisé avec des valeurs par défaut (HP=100, MaxHP=100, Level=1, Attack=10...).

### 3.3 - Les méthodes à implémenter

| Méthode | Receveur | Rôle |
|---------|----------|------|
| `DisplayStats()` | valeur `(h Hero)` | Affiche les stats formatées |
| `IsAlive() bool` | valeur `(h Hero)` | Retourne `true` si HP > 0 |
| `TakeDamage(dmg int)` | pointeur `(h *Hero)` | Réduit les HP (min 0) |
| `Heal(amount int)` | pointeur `(h *Hero)` | Augmente les HP (max MaxHP) |
| `GainXP(xp int)` | pointeur `(h *Hero)` | Ajoute du XP, déclenche `LevelUp()` si seuil atteint |
| `LevelUp()` | pointeur `(h *Hero)` | Incrémente le niveau, augmente MaxHP et Attack |

> 💡 **Receveur valeur vs receveur pointeur**
> ```go
> func (h Hero) IsAlive() bool {      // Copie de Hero - h non modifié
>     return h.HP > 0
> }
>
> func (h *Hero) TakeDamage(dmg int) { // Référence - modifie le Hero original
>     h.HP -= dmg
>     if h.HP < 0 {
>         h.HP = 0
>     }
> }
> ```
> **Règle simple** : si la méthode modifie le struct → receveur pointeur. Sinon → receveur valeur.
> **Cohérence** : si un seul des méthodes a un receveur pointeur, mettre toutes les méthodes en pointeur.

### 3.4 - Créer le struct `Enemy`

| Champ | Type | Description |
|-------|------|-------------|
| `Name` | `string` | Nom de l'ennemi |
| `HP` | `int` | Points de vie |
| `Attack` | `int` | Attaque |
| `XPReward` | `int` | XP donné au héros si vaincu |
| `GoldReward` | `int` | Or donné au héros si vaincu |

Ajouter les méthodes `IsAlive() bool` et `TakeDamage(dmg int)` sur `Enemy`.

### 3.5 - Mettre à jour la boucle de jeu

Remplacer les variables séparées par une instance `hero := NewHero(heroName)`. Mettre à jour les commandes `"stats"` et `"dé"` pour utiliser les méthodes du struct.

Ajouter la commande `"combat"` : créer un ennemi (`Gobelin`, HP=30, Attack=5, XP=20, Gold=10) et appeler la fonction `simulateFight` mise à jour pour utiliser les structs.

### 3.6 - ⚡ Pour aller plus loin

- Ajouter un champ `Class` de type `string` avec une constante pour chaque classe (`"Guerrier"`, `"Mage"`, `"Rôdeur"`).
- Créer des fonctions `NewWarrior(name string) Hero`, `NewMage(name string) Hero` avec des stats différentes.

### 3.7 - Livrable

- [ ] Struct `Hero` avec tous les champs listés
- [ ] Fonction `NewHero(name string) Hero`
- [ ] Méthodes `DisplayStats`, `IsAlive`, `TakeDamage`, `Heal`, `GainXP`, `LevelUp`
- [ ] Struct `Enemy` avec ses méthodes
- [ ] Commande `"combat"` fonctionnelle dans la boucle de jeu

---

## Itération 4 - Slices et maps - inventaire et quêtes

⏱ **Durée estimée : 1 jour**

> 🗓️ **Journée dense** : cette itération couvre deux structures de données en une seule journée. Concentre-toi sur les tâches essentielles — les sections "Pour aller plus loin" sont à remettre à plus tard.

### Objectifs pédagogiques

- Créer et manipuler des `slices` (tableaux dynamiques)
- Créer et manipuler des `maps` (dictionnaires)
- Comprendre la différence entre `array` et `slice`
- Utiliser `append`, `len`, la boucle `for range`

---

### 4.1 - Arrays vs Slices

> 💡 **Array vs Slice**
> ```go
> // Array : taille fixe, déclarée à la compilation
> var arr [3]string = [3]string{"épée", "bouclier", "potion"}
>
> // Slice : taille dynamique - à préférer
> inventory := []string{}
> inventory = append(inventory, "épée")
> inventory = append(inventory, "bouclier")
>
> fmt.Println(len(inventory)) // 2
> ```
> Un `slice` est une **vue** sur un array sous-jacent. Il gère lui-même sa capacité via `append`.

### 4.2 - Le struct `Quest`

Créer le struct `Quest` :

| Champ | Type | Description |
|-------|------|-------------|
| `ID` | `int` | Identifiant unique |
| `Title` | `string` | Titre de la quête |
| `Description` | `string` | Description |
| `XPReward` | `int` | Récompense en XP |
| `GoldReward` | `int` | Récompense en or |
| `Completed` | `bool` | Quête terminée ou non |

### 4.3 - Ajouter l'inventaire au héros

Ajouter un champ `Inventory []string` au struct `Hero`.

Implémenter les méthodes :

| Méthode | Receveur | Rôle |
|---------|----------|------|
| `AddItem(item string)` | pointeur | Ajoute un item à l'inventaire |
| `RemoveItem(item string) bool` | pointeur | Retire un item, retourne `false` s'il n'est pas trouvé |
| `HasItem(item string) bool` | valeur | Vérifie si l'item est dans l'inventaire |
| `DisplayInventory()` | valeur | Affiche l'inventaire formaté |

> 💡 **Parcourir un slice**
> ```go
> for index, item := range h.Inventory {
>     fmt.Printf("%d. %s\n", index+1, item)
> }
>
> // Si l'index n'est pas nécessaire :
> for _, item := range h.Inventory {
>     fmt.Println(item)
> }
> ```

### 4.4 - Gérer une liste de quêtes avec une map

Créer une **map** `questBook map[int]Quest` dans la fonction `main` pour stocker les quêtes disponibles :

```go
questBook := map[int]Quest{
    1: {ID: 1, Title: "La Caverne du Gobelin",    XPReward: 50,  GoldReward: 20},
    2: {ID: 2, Title: "Le Marché aux Artefacts",  XPReward: 30,  GoldReward: 50},
    3: {ID: 3, Title: "La Tour du Sorcier",        XPReward: 100, GoldReward: 80},
}
```

Ajouter les commandes :

- `"quêtes"` - affiche la liste de toutes les quêtes avec leur statut (✓ terminée / ○ en cours)
- `"accepter <id>"` - marque une quête comme acceptée (l'ajouter à une slice `activeQuests []Quest`)
- `"terminer <id>"` - marque la quête comme `Completed = true` et attribue les récompenses au héros

> 💡 **Lire un argument depuis la commande**
> La saisie `"accepter 2"` doit être découpée :
> ```go
> parts := strings.Split(input, " ")
> if len(parts) == 2 {
>     id, err := strconv.Atoi(parts[1])
>     // ...
> }
> ```

### 4.5 - ⚡ Pour aller plus loin

- Trier l'affichage des quêtes par `ID` croissant avec `sort.Slice()`.
- Ajouter une commande `"inventaire"` qui affiche les items du héros.

### 4.6 - Livrable

- [ ] Struct `Quest` avec tous les champs
- [ ] Champ `Inventory []string` dans `Hero` avec les méthodes associées
- [ ] Map `questBook` initialisée avec 3 quêtes
- [ ] Commandes `"quêtes"`, `"accepter <id>"`, `"terminer <id>"` fonctionnelles
- [ ] Attribution XP et or lors de la complétion d'une quête

---

## Itération 5 - Interfaces - différents types de quêtes

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Comprendre ce qu'est une `interface` en Go
- Implémenter une interface sur plusieurs types
- Comprendre le duck typing implicite de Go
- Utiliser les interfaces pour écrire du code générique

---

### 5.1 - Pourquoi les interfaces ?

> 🏗️ **Pourquoi ce choix ?**
> - Jusqu'ici, toutes les quêtes sont du même type `Quest`. Mais les quêtes de combat, d'exploration et de collecte ont des comportements différents : calcul de récompense, condition de complétion, description de l'action.
> - En Java, on utiliserait l'héritage. En Go, on utilise des **interfaces**.
> - Une interface en Go est **implicite** : un type implémente une interface s'il possède toutes ses méthodes. Pas de mot-clé `implements`.

### 5.2 - Définir l'interface `Questable`

```go
type Questable interface {
    Title() string
    Description() string
    Reward() (xp int, gold int)
    Complete(h *Hero) string  // Applique les effets et retourne un message
}
```

### 5.3 - Implémenter 3 types de quêtes

Créer trois structs, chacun implémentant `Questable` :

**`CombatQuest`**
| Champ | Type |
|-------|------|
| `EnemyName` | `string` |
| `EnemyCount` | `int` |
| `XP` | `int` |
| `Gold` | `int` |

`Complete()` : attribue XP et or, affiche `"Tu as vaincu X [ennemis] !"`.

**`ExploreQuest`**
| Champ | Type |
|-------|------|
| `Location` | `string` |
| `XP` | `int` |
| `ItemReward` | `string` |

`Complete()` : attribue XP, ajoute l'item à l'inventaire, affiche le message.

**`GatherQuest`**
| Champ | Type |
|-------|------|
| `ResourceName` | `string` |
| `Quantity` | `int` |
| `Gold` | `int` |

`Complete()` : attribue l'or, affiche le message.

### 5.4 - Utiliser l'interface

Modifier la liste des quêtes pour utiliser `[]Questable` :

```go
quests := []Questable{
    CombatQuest{EnemyName: "Gobelin", EnemyCount: 3, XP: 60, Gold: 30},
    ExploreQuest{Location: "Forêt Noire", XP: 40, ItemReward: "Herbe mystérieuse"},
    GatherQuest{ResourceName: "Pierre de mana", Quantity: 5, Gold: 50},
}
```

La commande `"terminer <id>"` appelle `quests[id].Complete(&hero)` sans connaître le type concret.

> 💡 **Type assertion**
> Si tu as besoin d'accéder à des champs spécifiques d'un type concret depuis une interface :
> ```go
> if cq, ok := q.(CombatQuest); ok {
>     fmt.Printf("Ennemis à vaincre : %d\n", cq.EnemyCount)
> }
> ```
> Utiliser le pattern `value, ok` pour éviter un panic si l'assertion échoue.

### 5.5 - ⚡ Pour aller plus loin

- Ajouter une méthode `Difficulty() string` à l'interface qui retourne `"Facile"`, `"Moyen"` ou `"Difficile"`.
- Afficher la difficulté dans la liste des quêtes.

### 5.6 - Livrable

- [ ] Interface `Questable` définie
- [ ] Structs `CombatQuest`, `ExploreQuest`, `GatherQuest` implémentant `Questable`
- [ ] Liste de quêtes `[]Questable`
- [ ] Commande `"terminer <id>"` polymorphique (fonctionne pour les 3 types)

---

## Itération 6 - Packages & persistance JSON

⏱ **Durée estimée : 1 jour**

> 🗓️ **Journée en deux temps** : matin → refactoriser en packages, après-midi → ajouter la sauvegarde JSON. Les deux sujets sont indépendants dans leur apprentissage mais liés dans le projet : les packages doivent être en place avant d'ajouter `game/save.go`.

### Objectifs pédagogiques

- Organiser le code en packages séparés
- Comprendre les règles d'exportation (majuscule = public)
- Sérialiser et désérialiser des données en JSON avec `encoding/json`
- Gérer les erreurs de fichier proprement

---

### 6.1 - Architecture cible (matin)

```
adventure-quest/
├── go.mod
├── main.go              ← point d'entrée, boucle de jeu
├── models/
│   ├── hero.go          ← struct Hero + méthodes
│   ├── enemy.go         ← struct Enemy + méthodes
│   └── quest.go         ← interface Questable + types de quêtes
└── game/
    ├── combat.go        ← logique de combat
    ├── commands.go      ← traitement des commandes
    └── save.go          ← sauvegarde JSON
```

> 🏗️ **Pourquoi ce choix ?**
> - `models/` contient les données métier (structs, interfaces). Pas de logique applicative.
> - `game/` contient la logique du jeu. Il importe `models/`.
> - `main.go` orchestre : il crée le héros, initialise les quêtes, lance la boucle. Il ne contient pas de logique.
> - Cette séparation facilite les tests et la maintenance.

### 6.2 - Règles d'exportation

> 💡 **Majuscule = exporté (public)**
> ```go
> // Dans models/hero.go
> type Hero struct {       // Exporté - accessible depuis les autres packages
>     Name string          // Exporté
>     hp   int             // Non exporté - privé au package models
> }
>
> func NewHero(name string) Hero { ... }  // Exporté
> func (h *Hero) levelUp() { ... }        // Non exporté - interne au package
> ```
> Il n'y a pas de `public`/`private`/`protected` en Go : la casse de la première lettre suffit.

### 6.3 - Tâche : refactoriser (matin)

Déplacer chaque struct et fonction dans le package correspondant. Adapter les imports dans `main.go` et `game/`.

```go
// main.go
import (
    "adventure-quest/models"
    "adventure-quest/game"
)

func main() {
    hero := models.NewHero("Thorin")
    // ...
    game.HandleCommand(input, &hero, quests)
}
```

> 💡 **Points de vigilance**
> - Un package ne peut pas importer un package qui l'importe lui-même (**import circulaire** - erreur de compilation).
> - Les structs dans `models/` ne doivent pas importer `game/`.
> - `main.go` peut importer tous les packages.

### 6.4 - Sérialisation JSON (après-midi)

> 💡 **Tags JSON sur les structs**
> ```go
> type Hero struct {
>     Name  string `json:"name"`
>     HP    int    `json:"hp"`
>     Level int    `json:"level"`
> }
>
> // Sérialiser
> data, err := json.Marshal(hero)         // []byte
> // ou avec indentation :
> data, err := json.MarshalIndent(hero, "", "  ")
>
> // Désérialiser
> var hero Hero
> err = json.Unmarshal(data, &hero)
> ```
> Les champs non exportés (minuscule) sont ignorés par `json.Marshal`.

### 6.5 - Struct de sauvegarde

Créer un struct `SaveData` qui contient tout ce qui doit persister :

```go
type SaveData struct {
    Hero      models.Hero `json:"hero"`
    Quests    []Quest     `json:"quests"`
    Timestamp string      `json:"saved_at"`
}
```

> 💡 **Note** : les interfaces ne se sérialisent pas directement en JSON (le type concret est perdu). Utiliser le struct `Quest` simple (de l'itération 4) pour la sauvegarde.

### 6.6 - Fonctions à implémenter dans `game/save.go`

| Fonction | Signature | Rôle |
|----------|-----------|------|
| `Save` | `(hero models.Hero, quests []Quest, path string) error` | Écrit la sauvegarde en JSON |
| `Load` | `(path string) (models.Hero, []Quest, error)` | Charge la sauvegarde depuis le fichier |

Ajouter les commandes :

- `"sauvegarder"` → appelle `game.Save(hero, quests, "save.json")`
- `"charger"` → appelle `game.Load("save.json")` et remplace le héros et les quêtes courants

### 6.7 - Gestion des erreurs de fichier

| Erreur | Comportement attendu |
|--------|---------------------|
| Fichier inexistant au chargement | Afficher `"Aucune sauvegarde trouvée."` - ne pas crasher |
| Erreur d'écriture | Afficher l'erreur et continuer |
| JSON invalide | Afficher `"Fichier de sauvegarde corrompu."` |

> 💡 **Vérifier si un fichier existe**
> ```go
> if _, err := os.Stat(path); os.IsNotExist(err) {
>     // Le fichier n'existe pas
> }
> ```

### 6.8 - ⚡ Pour aller plus loin

- Ajouter un horodatage (`time.Now().Format(time.RFC3339)`) dans `SaveData.Timestamp`.
- Permettre plusieurs slots de sauvegarde : `"sauvegarder <nom>"` / `"charger <nom>"`.

### 6.9 - Livrable

- [ ] Dossiers `models/` et `game/` créés
- [ ] Structs et interfaces dans `models/`
- [ ] Logique de combat et de commandes dans `game/`
- [ ] `go run main.go` fonctionne toujours après refactorisation
- [ ] Struct `SaveData` avec tags JSON
- [ ] Fonctions `Save()` et `Load()` dans `game/save.go`
- [ ] Commandes `"sauvegarder"` et `"charger"` fonctionnelles
- [ ] Erreurs de fichier gérées sans crash

---

## Itération 7 - Tests unitaires - valider le comportement du jeu

⏱ **Durée estimée : 1 jour**

> 🗓️ **Journée ciblée** : cette itération couvre les tests de base. L'objectif est d'écrire les 4 tests essentiels et de maîtriser la commande `go test`. Le pattern table-driven tests est en "Pour aller plus loin" — ne l'aborde que si tu as du temps.

### Objectifs pédagogiques

- Comprendre pourquoi et quand tester son code
- Écrire des tests unitaires avec le package `testing` de la stdlib Go
- Utiliser `go test` et interpréter ses résultats
- Organiser ses fichiers de test (`_test.go`)

---

> 🏗️ **Pourquoi ce moment ?**
> Tu viens d'organiser ton code en packages (`models/`, `game/`). Tes fonctions sont maintenant **isolées et indépendantes** — c'est exactement ce qu'on veut tester.
> Tester du code non structuré, c'est difficile. Tester des fonctions pures dans des packages bien séparés, c'est naturel.

---

### 7.1 - Pourquoi tester ?

Imagine que tu modifies la formule de `LevelUp()` pour équilibrer le jeu. Comment tu sais que tu n'as pas cassé autre chose ?

Sans tests : tu relances le programme, tu joues manuellement, tu espères.
Avec tests : tu lances `go test ./...` en une seconde et tu as la réponse.

Les tests sont un **filet de sécurité** — ils te permettent de modifier le code avec confiance.

> 💡 **En Go, les tests font partie du langage**
> Pas de framework externe à installer. Le package `testing` est dans la stdlib.
> La convention est simple : un fichier `hero_test.go` teste le fichier `hero.go` dans le même package.

---

### 7.2 - Structure d'un test Go

```go
// models/hero_test.go
package models

import "testing"

func TestIsAlive(t *testing.T) {
    hero := NewHero("Thorin")

    if !hero.IsAlive() {
        t.Error("Un héros avec 100 HP devrait être en vie")
    }

    hero.HP = 0
    if hero.IsAlive() {
        t.Error("Un héros avec 0 HP ne devrait pas être en vie")
    }
}
```

> 💡 **Les règles d'un test Go**
> - Le fichier doit se terminer par `_test.go`
> - La fonction doit commencer par `Test` (majuscule)
> - Elle reçoit `*testing.T` en paramètre — c'est l'objet de test
> - `t.Error("message")` : signale un échec mais **continue** le test
> - `t.Fatal("message")` : signale un échec et **arrête** le test immédiatement
> - `t.Errorf("format", args...)` : comme `t.Error` avec formatage `fmt.Sprintf`

---

### 7.3 - Lancer les tests

```bash
# Lancer tous les tests du projet
go test ./...

# Lancer les tests d'un package spécifique
go test ./models/...

# Avec détail de chaque test
go test -v ./...

# Avec couverture de code
go test -cover ./...
```

---

### 7.4 - Tâche : tests unitaires essentiels

Créer le fichier `models/hero_test.go` et écrire les tests suivants :

#### Test 1 — `NewHero()`

Vérifier que le constructeur initialise correctement le héros :

```
Étant donné NewHero("Thorin")
Alors hero.Name == "Thorin"
Et   hero.HP == 100
Et   hero.Level == 1
Et   hero.Gold == 0
```

#### Test 2 — `IsAlive()`

Vérifier deux cas :
- Un héros avec HP > 0 est en vie
- Un héros avec HP == 0 n'est pas en vie

#### Test 3 — `TakeDamage()`

Vérifier trois cas :
- Après `TakeDamage(30)` sur un héros à 100 HP → HP == 70
- Après `TakeDamage(200)` sur un héros à 100 HP → HP == 0 (pas de valeur négative)
- Après `TakeDamage(0)` → HP inchangé

#### Test 4 — `Heal()`

Vérifier deux cas :
- Un héros à 50 HP qui reçoit `Heal(30)` → HP == 80
- Un héros à 90 HP qui reçoit `Heal(50)` → HP == MaxHP (pas de dépassement)

> 💡 **À noter**
> `t.Errorf` est ton meilleur ami pour des messages d'erreur clairs :
> ```go
> if hero.HP != 70 {
>     t.Errorf("HP attendu : 70, obtenu : %d", hero.HP)
> }
> ```

---

### 7.5 - Points de vigilance

- **Ne tester que ce que tu possèdes** — teste tes fonctions, pas les fonctions de la stdlib (`fmt`, `os`, etc.)
- **Un test = un comportement** — si ton test a 15 assertions sans rapport, découpe-le
- **Les tests doivent être déterministes** — un test qui passe une fois sur deux n'est pas un test. Si tu testes `rollDice()`, teste la plage de valeurs, pas la valeur exacte :
  ```go
  result := rollDice(6)
  if result < 1 || result > 6 {
      t.Errorf("rollDice(6) doit retourner entre 1 et 6, obtenu : %d", result)
  }
  ```

---

### 7.6 - ⚡ Pour aller plus loin — Table-Driven Tests

Le pattern idiomatique Go pour tester plusieurs cas d'un coup :

```go
func TestXpToNextLevel(t *testing.T) {
    tests := []struct {
        name     string
        level    int
        expected int
    }{
        {"niveau 1", 1, 100},
        {"niveau 2", 2, 200},
        {"niveau 3", 3, 300},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := XpToNextLevel(tt.level)
            if result != tt.expected {
                t.Errorf("niveau %d : attendu %d, obtenu %d", tt.level, tt.expected, result)
            }
        })
    }
}
```

Appliquer ce pattern pour tester `simulateFight()` et les récompenses de quêtes.

---

### 7.7 - Livrable

- [ ] `models/hero_test.go` avec les 4 tests unitaires (`NewHero`, `IsAlive`, `TakeDamage`, `Heal`)
- [ ] `go test ./...` passe avec 0 échec
- [ ] `go test -v ./...` affiche le détail de chaque test

---

> ✅ **Ce que tu sais maintenant faire**
> - Écrire des tests unitaires avec `testing.T`
> - Lancer et interpréter les résultats de `go test`
> - Distinguer `t.Error` (continue) et `t.Fatal` (arrête)
> - Tester les cas nominaux, limites et d'erreur

---

## Itération 8 - Goroutines & channels - concurrence ciblée

⏱ **Durée estimée : 1 jour**

> 🗓️ **Journée ciblée** : cette itération n'a pas pour ambition de couvrir toute la concurrence Go — c'est un sujet vaste. L'objectif est de comprendre le modèle mental (goroutine + channel) et d'appliquer deux cas d'usage concrets directement dans Adventure Quest. Le reste (WaitGroup, Mutex, patterns avancés) est en "Pour aller plus loin".

### Objectifs pédagogiques

- Comprendre le modèle de concurrence de Go (goroutines et channels)
- Lancer une goroutine avec `go`
- Communiquer entre goroutines via des channels
- Utiliser `select` pour gérer plusieurs channels simultanément
- Appliquer la concurrence sur deux cas réels du projet

---

> 🏗️ **Pourquoi ce moment ?**
> Tu as maintenant un projet structuré en packages, avec une sauvegarde JSON fonctionnelle. C'est le bon moment pour ajouter des comportements **en arrière-plan** — sans bloquer la boucle principale du jeu.
> La concurrence Go repose sur une philosophie simple : *"Ne communique pas en partageant de la mémoire — partage de la mémoire en communiquant."* Les channels sont le mécanisme de cette communication.

---

### 8.1 - Goroutines

> 💡 **Goroutine**
> Une goroutine est une **fonction exécutée de manière concurrente**. Elle est bien plus légère qu'un thread OS (quelques Ko vs plusieurs Mo). Go peut en gérer des milliers simultanément.
> ```go
> go doSomething()        // Lance doSomething() en concurrence - non bloquant
>
> go func() {            // Fonction anonyme en goroutine
>     fmt.Println("concurrent")
> }()
> ```
> **Important** : une goroutine lancée avec `go` n'attend pas la fin du programme. Si `main()` se termine, toutes les goroutines s'arrêtent immédiatement.

### 8.2 - Channels

> 💡 **Channel**
> Un channel est un **tuyau typé** pour envoyer et recevoir des valeurs entre goroutines.
> ```go
> ch := make(chan string)        // Channel non bufferisé
> ch := make(chan string, 10)    // Channel bufferisé (capacité 10)
>
> go func() { ch <- "message" }()  // Envoi (bloquant si non bufferisé et pas de récepteur)
> msg := <-ch                       // Réception (bloquant jusqu'à réception)
>
> close(ch)  // Fermer depuis l'émetteur quand on n'envoie plus
> ```
> Un channel non bufferisé **synchronise** émetteur et récepteur — les deux attendent l'un l'autre.

### 8.3 - Select

> 💡 **`select`**
> `select` attend sur plusieurs channels simultanément et traite le **premier qui reçoit une valeur**.
> ```go
> select {
> case msg := <-ch1:
>     fmt.Println("reçu depuis ch1 :", msg)
> case msg := <-ch2:
>     fmt.Println("reçu depuis ch2 :", msg)
> case <-time.After(5 * time.Second):
>     fmt.Println("timeout - aucun message reçu")
> }
> ```
> `time.After(d)` retourne un channel qui reçoit une valeur après la durée `d` — parfait pour implémenter des timeouts.

---

### 8.4 - Tâche : timer de quête en arrière-plan

Certaines quêtes ont une durée limitée. L'objectif est de lancer un compte à rebours **en arrière-plan** pendant que le joueur continue d'utiliser la boucle de jeu.

Implémenter dans `game/timer.go` la fonction :

```go
func StartQuestTimer(questTitle string, duration time.Duration, done chan bool)
```

Comportement attendu :
- Lance un compte à rebours en arrière-plan via une goroutine
- Si `duration` s'écoule sans signal sur `done` → afficher `"⏰ Temps écoulé pour la quête '[titre]' !"`
- Si un signal est reçu sur `done` → la goroutine s'arrête silencieusement

Utilisation depuis `main.go` :

```go
done := make(chan bool)
go game.StartQuestTimer("La Tour du Sorcier", 30*time.Second, done)

// Plus tard, quand la quête est terminée :
done <- true
```

> 💡 **Squelette de la fonction**
> ```go
> func StartQuestTimer(questTitle string, duration time.Duration, done chan bool) {
>     select {
>     case <-time.After(duration):
>         fmt.Printf("⏰ Temps écoulé pour la quête '%s' !\n", questTitle)
>     case <-done:
>         // Quête terminée à temps - sortie silencieuse
>     }
> }
> ```
> `select` bloque jusqu'à ce que l'un des deux channels reçoive une valeur — le timeout ou le signal de complétion.

Ajouter la commande `"timer <id>"` dans la boucle de jeu : lance un timer de 60 secondes pour la quête correspondante.

---

### 8.5 - Tâche : sauvegarde automatique en arrière-plan

Implémenter une sauvegarde automatique toutes les 30 secondes, **sans bloquer la boucle de jeu**.

Dans `main.go`, lancer au démarrage :

```go
go func() {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()
    for {
        <-ticker.C
        if err := game.Save(hero, quests, "autosave.json"); err != nil {
            fmt.Println("[Autosave] Erreur :", err)
        } else {
            fmt.Println("[Autosave] Progression sauvegardée automatiquement.")
        }
    }
}()
```

> 💡 **`time.NewTicker`**
> `time.NewTicker(d)` envoie une valeur sur son channel `.C` à intervalle régulier de durée `d`.
> Différence avec `time.After` : `After` ne s'active qu'**une fois**, `Ticker` se répète indéfiniment.
> Toujours appeler `ticker.Stop()` avec `defer` pour libérer les ressources.

---

### 8.6 - Points de vigilance

- **Race condition** : si plusieurs goroutines lisent et écrivent le même struct `Hero` simultanément, le comportement est indéfini. Dans ce projet, la boucle de jeu est **mono-goroutine** — seule la sauvegarde lit le héros depuis une goroutine séparée. C'est acceptable ici, mais en production il faudrait un `sync.Mutex` ou passer une copie.
- **Ne jamais envoyer sur un channel fermé** — panic immédiat. Ferme toujours depuis l'émetteur, jamais depuis le récepteur.
- **Une goroutine qui "fuit"** (goroutine leak) : si personne ne lit depuis un channel, la goroutine qui envoie est bloquée indéfiniment. Toujours prévoir une sortie.

---

### 8.7 - ⚡ Pour aller plus loin

- Utiliser `sync.WaitGroup` pour attendre la fin de plusieurs goroutines :
  ```go
  var wg sync.WaitGroup
  wg.Add(2)
  go func() { defer wg.Done(); /* tâche 1 */ }()
  go func() { defer wg.Done(); /* tâche 2 */ }()
  wg.Wait() // Attend que les 2 goroutines soient terminées
  ```
- Protéger l'accès concurrent au struct `Hero` avec `sync.Mutex` :
  ```go
  type SafeHero struct {
      mu   sync.Mutex
      hero models.Hero
  }
  func (s *SafeHero) UpdateHP(dmg int) {
      s.mu.Lock()
      defer s.mu.Unlock()
      s.hero.TakeDamage(dmg)
  }
  ```
- Détecter les race conditions avec `go run -race main.go`

---

### 8.8 - Livrable

- [ ] Fonction `StartQuestTimer()` dans `game/timer.go`
- [ ] Commande `"timer <id>"` dans la boucle de jeu
- [ ] Sauvegarde automatique toutes les 30 secondes en arrière-plan
- [ ] Boucle de jeu non bloquée par les goroutines
- [ ] Aucun panic au lancement ou à l'arrêt du programme

---

> ✅ **Ce que tu sais maintenant faire**
> - Lancer une fonction en arrière-plan avec `go`
> - Créer un channel et l'utiliser pour synchroniser des goroutines
> - Utiliser `select` pour gérer plusieurs événements concurrents
> - Implémenter un timer et une tâche périodique sans bloquer le programme principal
>
> La concurrence Go est un sujet profond — ce que tu viens d'apprendre est le cœur du modèle. Les patterns avancés (pipelines, fan-out, context) viendront naturellement avec la pratique.

---

## Annexe A - Cheat Sheet Go

### Déclarations

```go
// Variables
x := 42                    // Déclaration courte (inférence de type)
var y int = 42             // Déclaration longue
var z int                  // Valeur zéro : 0

// Constantes
const Pi = 3.14
const (
    A = iota   // 0
    B          // 1
    C          // 2
)

// Types nommés
type Meters float64
type Direction string
```

### Fonctions

```go
func add(a, b int) int { return a + b }

func swap(a, b string) (string, string) { return b, a }

func divide(a, b float64) (float64, error) {
    if b == 0 { return 0, fmt.Errorf("division par zéro") }
    return a / b, nil
}

// Fonction anonyme
double := func(x int) int { return x * 2 }

// Fonction variadique
func sum(nums ...int) int {
    total := 0
    for _, n := range nums { total += n }
    return total
}
```

### Structs

```go
type Hero struct {
    Name string
    HP   int
}

// Constructeur idiomatique
func NewHero(name string) Hero {
    return Hero{Name: name, HP: 100}
}

// Receveur valeur (lecture)
func (h Hero) IsAlive() bool { return h.HP > 0 }

// Receveur pointeur (modification)
func (h *Hero) TakeDamage(dmg int) { h.HP -= dmg }
```

### Interfaces

```go
type Animal interface {
    Sound() string
    Move()
}

type Dog struct{}
func (d Dog) Sound() string { return "Woof" }
func (d Dog) Move()         { fmt.Println("runs") }
// Dog implémente Animal implicitement

// Type assertion
if dog, ok := a.(Dog); ok { fmt.Println(dog) }
```

### Slices et Maps

```go
// Slice
s := []int{1, 2, 3}
s = append(s, 4)
fmt.Println(len(s), cap(s))

// Supprimer l'élément à l'index i
s = append(s[:i], s[i+1:]...)

// Map
m := map[string]int{"a": 1, "b": 2}
m["c"] = 3
delete(m, "a")
val, ok := m["z"]  // ok = false si la clé n'existe pas
```

### Gestion d'erreurs

```go
result, err := doSomething()
if err != nil {
    return fmt.Errorf("contexte : %w", err)  // Wrap l'erreur
}

// Erreur personnalisée
type NotFoundError struct { ID int }
func (e *NotFoundError) Error() string {
    return fmt.Sprintf("élément %d non trouvé", e.ID)
}
```

### JSON

```go
import "encoding/json"

// Tags sur struct
type Hero struct {
    Name string `json:"name"`
    HP   int    `json:"hp"`
}

// Sérialiser
data, err := json.MarshalIndent(hero, "", "  ")

// Désérialiser
var hero Hero
err = json.Unmarshal(data, &hero)
```

### Goroutines et Channels

```go
// Goroutine
go func() { fmt.Println("concurrent") }()

// Channel non bufferisé
ch := make(chan int)
go func() { ch <- 42 }()
val := <-ch

// Channel bufferisé
ch := make(chan string, 10)

// Select
select {
case msg := <-ch1: fmt.Println(msg)
case msg := <-ch2: fmt.Println(msg)
case <-time.After(1 * time.Second): fmt.Println("timeout")
}

// Ticker (répétitif)
ticker := time.NewTicker(30 * time.Second)
defer ticker.Stop()
for {
    <-ticker.C
    // exécuté toutes les 30 secondes
}

// WaitGroup
var wg sync.WaitGroup
wg.Add(1)
go func() { defer wg.Done(); /* ... */ }()
wg.Wait()
```

---

## Annexe B - Commandes et outils

### Commandes essentielles

| Commande | Usage |
|----------|-------|
| `go run main.go` | Compiler et exécuter |
| `go build -o adventure-quest` | Compiler en binaire |
| `go mod init <nom>` | Initialiser un module |
| `go get <package>` | Ajouter une dépendance |
| `go mod tidy` | Nettoyer les dépendances inutilisées |
| `go fmt ./...` | Formater tout le code |
| `go vet ./...` | Analyser les erreurs courantes |
| `go test ./...` | Lancer tous les tests |
| `go test -v ./...` | Tests avec détail |
| `go test -cover ./...` | Tests avec couverture de code |
| `go run -race main.go` | Détecter les race conditions |

### Outils recommandés

| Outil | Usage |
|-------|-------|
| **gopls** | Serveur de langage (installé par l'extension VS Code) |
| **dlv** | Debugger Go |
| **staticcheck** | Linter statique |
| **air** | Live reload pendant le développement (`go install github.com/air-verse/air@latest`) |

### Structure de module recommandée

```
adventure-quest/
├── go.mod
├── go.sum
├── main.go
├── models/
│   ├── hero.go
│   ├── enemy.go
│   └── quest.go
└── game/
    ├── combat.go
    ├── commands.go
    ├── save.go
    └── timer.go     ← Itération 8
```
