# Projet Adventure Quest - Apprendre Go par la pratique
**Cahier de formation - Version apprenant**
10 itérations progressives | Go 1.21+ | Apprentissage par le projet | 21 jours

---

## Sommaire

1. [Mise en place de l'environnement](#itération-1--mise-en-place-de-lenvironnement)
2. [Variables, types et premier programme](#itération-2--variables-types-et-premier-programme)
3. [Fonctions et contrôle du flux](#itération-3--fonctions-et-contrôle-du-flux)
4. [Structs et méthodes - modéliser le héros](#itération-4--structs-et-méthodes--modéliser-le-héros)
5. [Slices et maps - inventaire et quêtes](#itération-5--slices-et-maps--inventaire-et-quêtes)
6. [Interfaces - différents types de quêtes](#itération-6--interfaces--différents-types-de-quêtes)
7. [Packages - organiser le code](#itération-7--packages--organiser-le-code)
8. [Tests unitaires - valider le comportement du jeu](#itération-8---tests-unitaires---valider-le-comportement-du-jeu)
9. [Fichiers - sauvegarder et charger les données](#itération-9--fichiers--sauvegarder-et-charger-les-données)
10. [Goroutines et channels - concurrence](#itération-10--goroutines-et-channels--concurrence)
11. [Bonus - API REST](#itération-11-bonus--api-rest)
12. [Annexe A - Cheat Sheet Go](#annexe-a--cheat-sheet-go)
13. [Annexe B - Commandes et outils](#annexe-b--commandes-et-outils)

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
- (Bonus) Exposer le tout via une API REST

Chaque itération ajoute une brique. Tu commenceras avec un simple `Hello, World!` et tu termineras avec un programme complet.

---

## Itération 1 - Mise en place de l'environnement

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Installer Go et configurer son environnement
- Comprendre la structure d'un programme Go minimal
- Créer et exécuter un premier programme
- Comprendre le rôle de `go mod init`

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

### 1.6 - Livrable

- [ ] `go.mod` créé avec `go mod init adventure-quest`
- [ ] `main.go` avec la fonction `main()` qui affiche le message de bienvenue
- [ ] Programme exécutable avec `go run main.go`

---

## Itération 2 - Variables, types et premier programme

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Déclarer des variables avec `:=` et `var`
- Comprendre les types de base (`string`, `int`, `float64`, `bool`)
- Utiliser `fmt.Scan()` pour lire une saisie utilisateur
- Comprendre la **déclaration courte** et ses limites

---

### 2.1 - Les types de base en Go

| Type | Exemple | Notes |
|------|---------|-------|
| `string` | `"Aragorn"` | Séquence de bytes UTF-8 |
| `int` | `42` | Entier signé (64 bits sur la plupart des machines) |
| `float64` | `3.14` | Flottant 64 bits (type flottant par défaut) |
| `bool` | `true` / `false` | |
| `int64` | `int64(42)` | Entier 64 bits explicite |

> 💡 **`:=` vs `var`**
> ```go
> name := "Aragorn"         // Déclaration courte - seulement dans une fonction
> var level int = 1         // Déclaration longue - peut être à l'extérieur d'une fonction
> var hp int                // Valeur zéro : 0 pour int, "" pour string, false pour bool
> ```
> Go n'autorise pas les variables déclarées mais non utilisées - le compilateur refuse.

### 2.2 - Tâche : créer le héros

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

### 2.3 - Tâche : mini-calculateur de niveau

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

### 2.4 - ⚡ Pour aller plus loin

- Ajouter un type `heroClass` de type `string` avec une constante `const` pour les classes disponibles (`"Guerrier"`, `"Mage"`, `"Rôdeur"`).
- Utiliser `iota` pour définir les classes comme constantes numériques.

### 2.5 - Livrable

- [ ] Variable `heroName` lue depuis le terminal
- [ ] Affichage des stats initiales
- [ ] Fonction `xpToNextLevel(level int) int` correcte
- [ ] Boucle affichant les XP pour les niveaux 1 à 5

---

## Itération 3 - Fonctions et contrôle du flux

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer des fonctions avec plusieurs valeurs de retour
- Utiliser `if / else`, `switch` et la boucle `for`
- Comprendre le pattern `value, err` (gestion d'erreur idiomatique)
- Implémenter une boucle de jeu principale

---

### 3.1 - Les valeurs de retour multiples

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

### 3.2 - Tâche : menu de jeu en boucle

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

### 3.3 - Tâche : simuler un lancer de dé

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

### 3.4 - Tâche : fonction de combat rapide

Écrire `simulateFight(heroHP int, enemyHP int, heroAttack int, enemyAttack int) (bool, int)` qui :
- Simule un combat tour par tour (le héros attaque en premier)
- Retourne `(true, pvRestants)` si le héros gagne, `(false, 0)` si le héros perd
- Affiche chaque tour dans le terminal

> 💡 **À noter**
> - Utiliser une boucle `for` avec condition.
> - Vérifier après chaque attaque si les PV tombent à 0 ou en dessous.

### 3.5 - ⚡ Pour aller plus loin

- Ajouter une fonction `clamp(value, min, max int) int` qui s'assure qu'une valeur reste dans un intervalle.
- Utiliser des **named return values** : `func rollDice(sides int) (result int)`.

### 3.6 - Livrable

- [ ] Boucle de jeu avec `switch` sur les commandes
- [ ] Commande `"quitter"` qui sort proprement du programme
- [ ] Fonction `rollDice(sides int) int` fonctionnelle
- [ ] Fonction `simulateFight()` avec affichage des tours

---

## Itération 4 - Structs et méthodes - modéliser le héros

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer des `struct` pour modéliser les données
- Ajouter des **méthodes** sur des structs (receveur valeur vs pointeur)
- Comprendre la différence entre receveur valeur `(h Hero)` et receveur pointeur `(h *Hero)`
- Introduire la notion de constructeur idiomatique (`NewHero()`)

---

### 4.1 - Architecture à créer

> 🏗️ **Pourquoi ce choix ?**
> - Remplacer les variables `heroName`, `heroHP`, etc. par un **struct `Hero`** regroupe les données liées dans une seule entité.
> - Les **méthodes** (`func (h Hero) DisplayStats()`) associent le comportement à la donnée - c'est l'équivalent Go des méthodes de classe en Java/Python, sans l'héritage.
> - Go n'a pas de constructeurs : la convention est une fonction `NewXxx()` qui retourne une valeur initialisée.

### 4.2 - Le struct `Hero`

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

### 4.3 - Les méthodes à implémenter

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

### 4.4 - Créer le struct `Enemy`

| Champ | Type | Description |
|-------|------|-------------|
| `Name` | `string` | Nom de l'ennemi |
| `HP` | `int` | Points de vie |
| `Attack` | `int` | Attaque |
| `XPReward` | `int` | XP donné au héros si vaincu |
| `GoldReward` | `int` | Or donné au héros si vaincu |

Ajouter les méthodes `IsAlive() bool` et `TakeDamage(dmg int)` sur `Enemy`.

### 4.5 - Mettre à jour la boucle de jeu

Remplacer les variables séparées par une instance `hero := NewHero(heroName)`. Mettre à jour les commandes `"stats"` et `"dé"` pour utiliser les méthodes du struct.

Ajouter la commande `"combat"` : créer un ennemi (`Gobelin`, HP=30, Attack=5, XP=20, Gold=10) et appeler la fonction `simulateFight` mise à jour pour utiliser les structs.

### 4.6 - ⚡ Pour aller plus loin

- Ajouter un champ `Class` de type `string` avec une constante pour chaque classe (`"Guerrier"`, `"Mage"`, `"Rôdeur"`).
- Créer des fonctions `NewWarrior(name string) Hero`, `NewMage(name string) Hero` avec des stats différentes.

### 4.7 - Livrable

- [ ] Struct `Hero` avec tous les champs listés
- [ ] Fonction `NewHero(name string) Hero`
- [ ] Méthodes `DisplayStats`, `IsAlive`, `TakeDamage`, `Heal`, `GainXP`, `LevelUp`
- [ ] Struct `Enemy` avec ses méthodes
- [ ] Commande `"combat"` fonctionnelle dans la boucle de jeu

---

## Itération 5 - Slices et maps - inventaire et quêtes

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer et manipuler des `slices` (tableaux dynamiques)
- Créer et manipuler des `maps` (dictionnaires)
- Comprendre la différence entre `array` et `slice`
- Utiliser `append`, `len`, la boucle `for range`

---

### 5.1 - Arrays vs Slices

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

### 5.2 - Le struct `Quest`

Créer le struct `Quest` :

| Champ | Type | Description |
|-------|------|-------------|
| `ID` | `int` | Identifiant unique |
| `Title` | `string` | Titre de la quête |
| `Description` | `string` | Description |
| `XPReward` | `int` | Récompense en XP |
| `GoldReward` | `int` | Récompense en or |
| `Completed` | `bool` | Quête terminée ou non |

### 5.3 - Ajouter l'inventaire au héros

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

### 5.4 - Gérer une liste de quêtes avec une map

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

### 5.5 - ⚡ Pour aller plus loin

- Trier l'affichage des quêtes par `ID` croissant avec `sort.Slice()`.
- Ajouter une commande `"inventaire"` qui affiche les items du héros.
- Ajouter des items en récompense quand une quête est terminée.

### 5.6 - Livrable

- [ ] Struct `Quest` avec tous les champs
- [ ] Champ `Inventory []string` dans `Hero` avec les méthodes associées
- [ ] Map `questBook` initialisée avec 3 quêtes
- [ ] Commandes `"quêtes"`, `"accepter <id>"`, `"terminer <id>"` fonctionnelles
- [ ] Attribution XP et or lors de la complétion d'une quête

---

## Itération 6 - Interfaces - différents types de quêtes

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Comprendre ce qu'est une `interface` en Go
- Implémenter une interface sur plusieurs types
- Comprendre le duck typing implicite de Go
- Utiliser les interfaces pour écrire du code générique

---

### 6.1 - Pourquoi les interfaces ?

> 🏗️ **Pourquoi ce choix ?**
> - Jusqu'ici, toutes les quêtes sont du même type `Quest`. Mais les quêtes de combat, d'exploration et de collecte ont des comportements différents : calcul de récompense, condition de complétion, description de l'action.
> - En Java, on utiliserait l'héritage. En Go, on utilise des **interfaces**.
> - Une interface en Go est **implicite** : un type implémente une interface s'il possède toutes ses méthodes. Pas de mot-clé `implements`.

### 6.2 - Définir l'interface `Questable`

```go
type Questable interface {
    Title() string
    Description() string
    Reward() (xp int, gold int)
    Complete(h *Hero) string  // Applique les effets et retourne un message
}
```

### 6.3 - Implémenter 3 types de quêtes

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

### 6.4 - Utiliser l'interface

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

### 6.5 - ⚡ Pour aller plus loin

- Ajouter une méthode `Difficulty() string` à l'interface qui retourne `"Facile"`, `"Moyen"` ou `"Difficile"`.
- Afficher la difficulté dans la liste des quêtes.

### 6.6 - Livrable

- [ ] Interface `Questable` définie
- [ ] Structs `CombatQuest`, `ExploreQuest`, `GatherQuest` implémentant `Questable`
- [ ] Liste de quêtes `[]Questable`
- [ ] Commande `"terminer <id>"` polymorphique (fonctionne pour les 3 types)

---

## Itération 7 - Packages - organiser le code

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Organiser le code en packages séparés
- Comprendre les règles d'exportation (majuscule = public)
- Faire communiquer plusieurs packages
- Comprendre le rôle de chaque package

---

### 7.1 - Architecture cible

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
    └── commands.go      ← traitement des commandes
```

> 🏗️ **Pourquoi ce choix ?**
> - `models/` contient les données métier (structs, interfaces). Pas de logique applicative.
> - `game/` contient la logique du jeu. Il importe `models/`.
> - `main.go` orchestre : il crée le héros, initialise les quêtes, lance la boucle. Il ne contient pas de logique.
> - Cette séparation facilite les tests et la maintenance.

### 7.2 - Règles d'exportation

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

### 7.3 - Tâche : refactoriser

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

### 7.4 - Points de vigilance

- Un package ne peut pas importer un package qui l'importe lui-même (**import circulaire** - erreur de compilation).
- Les structs dans `models/` ne doivent pas importer `game/`.
- `main.go` peut importer tous les packages.

### 7.5 - Livrable

- [ ] Dossiers `models/` et `game/` créés
- [ ] Structs et interfaces dans `models/`
- [ ] Logique de combat et de commandes dans `game/`
- [ ] `main.go` réduit à l'initialisation et à la boucle principale
- [ ] `go run main.go` fonctionne toujours après refactorisation

---

## Itération 8 - Tests unitaires - valider le comportement du jeu

⏱ **Durée estimée : 2 jours**

---

### Objectifs pédagogiques

- Comprendre pourquoi et quand tester son code
- Écrire des tests unitaires avec le package `testing` de la stdlib Go
- Maîtriser le pattern **table-driven tests** - le pattern de test idiomatique en Go
- Utiliser `go test` et interpréter ses résultats
- Organiser ses fichiers de test (`_test.go`)

---

> 🏗️ **Pourquoi ce moment ?**
> Tu viens d'organiser ton code en packages (`models/`, `game/`). Tes fonctions sont maintenant **isolées et indépendantes** - c'est exactement ce qu'on veut tester.
> Tester du code non structuré, c'est difficile. Tester des fonctions pures dans des packages bien séparés, c'est naturel.
> Un test unitaire répond à une question simple : *"Si je donne cette entrée à ma fonction, est-ce qu'elle me retourne bien ce que j'attends ?"*

---

### 8.1 - Pourquoi tester ?

Imagine que tu modifies la formule de `LevelUp()` pour équilibrer le jeu. Comment tu sais que tu n'as pas cassé autre chose ?

Sans tests : tu relances le programme, tu joues manuellement, tu espères.
Avec tests : tu lances `go test ./...` en une seconde et tu as la réponse.

Les tests sont un **filet de sécurité** - ils te permettent de modifier le code avec confiance.

> 💡 **En Go, les tests font partie du langage**
> Pas de framework externe à installer. Le package `testing` est dans la stdlib.
> La convention est simple : un fichier `hero_test.go` teste le fichier `hero.go` dans le même package.

---

### 8.2 - Structure d'un test Go

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
> - Elle reçoit `*testing.T` en paramètre - c'est l'objet de test
> - `t.Error("message")` : signale un échec mais **continue** le test
> - `t.Fatal("message")` : signale un échec et **arrête** le test immédiatement
> - `t.Errorf("format", args...)` : comme `t.Error` avec formatage `fmt.Sprintf`

---

### 8.3 - Lancer les tests

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

Résultat attendu :
```
ok      adventure-quest/models    0.003s
ok      adventure-quest/game      0.002s
```

En cas d'échec :
```
--- FAIL: TestIsAlive (0.00s)
    hero_test.go:12: Un héros avec 0 HP ne devrait pas être en vie
FAIL
```

---

### 8.4 - Tâche : premiers tests unitaires

Créer le fichier `models/hero_test.go` et écrire les tests suivants :

#### Test 1 - `NewHero()`

Vérifier que le constructeur initialise correctement le héros :

```
Étant donné NewHero("Thorin")
Alors hero.Name == "Thorin"
Et   hero.HP == 100
Et   hero.Level == 1
Et   hero.Gold == 0
```

#### Test 2 - `IsAlive()`

Vérifier deux cas :
- Un héros avec HP > 0 est en vie
- Un héros avec HP == 0 n'est pas en vie

#### Test 3 - `TakeDamage()`

Vérifier trois cas :
- Après `TakeDamage(30)` sur un héros à 100 HP → HP == 70
- Après `TakeDamage(200)` sur un héros à 100 HP → HP == 0 (pas de valeur négative)
- Après `TakeDamage(0)` → HP inchangé

#### Test 4 - `Heal()`

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
> Un bon message d'erreur dit **ce qui était attendu** et **ce qui a été obtenu**.

---

### 8.5 - Le pattern Table-Driven Tests

Imagine que tu veuilles tester `xpToNextLevel()` pour les niveaux 1 à 5. Tu pourrais écrire 5 fonctions de test... ou utiliser le pattern **table-driven** :

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
        {"niveau 4", 4, 400},
        {"niveau 5", 5, 500},
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

Résultat avec `go test -v` :
```
--- PASS: TestXpToNextLevel (0.00s)
    --- PASS: TestXpToNextLevel/niveau_1 (0.00s)
    --- PASS: TestXpToNextLevel/niveau_2 (0.00s)
    --- PASS: TestXpToNextLevel/niveau_3 (0.00s)
    --- PASS: TestXpToNextLevel/niveau_4 (0.00s)
    --- PASS: TestXpToNextLevel/niveau_5 (0.00s)
```

> 💡 **Pourquoi ce pattern ?**
> - Un seul endroit pour ajouter un nouveau cas de test → ajouter une ligne dans le tableau
> - Les sous-tests (`t.Run`) sont nommés → facile à identifier lequel échoue
> - C'est le pattern utilisé dans la **stdlib Go elle-même** - c'est du Go idiomatique
> - Quand un cas échoue, les autres continuent de s'exécuter

---

### 8.6 - Tâche : table-driven tests sur les quêtes

Créer le fichier `models/quest_test.go` et écrire un test table-driven pour la fonction qui calcule les récompenses selon le type de quête.

Les cas à couvrir :

| Nom du test | Type de quête | Niveau héros | Récompense attendue |
|---|---|---|---|
| "combat niveau 1" | `Combat` | 1 | XP et or selon ta formule |
| "combat niveau 5" | `Combat` | 5 | XP et or × 5 |
| "exploration niveau 1" | `Exploration` | 1 | XP et or selon ta formule |
| "collecte niveau 1" | `Collecte` | 1 | XP et or selon ta formule |
| "type inconnu" | `""` | 1 | 0, 0 (ou erreur selon ton implémentation) |

> 💡 **Tester les cas limites**
> Les bugs se cachent aux extrêmes : niveau 0, valeur négative, chaîne vide, nil...
> Un bon test couvre toujours au moins un **cas nominal**, un **cas limite** et un **cas d'erreur**.

---

### 8.7 - Tâche : tester `simulateFight()`

La fonction `simulateFight()` de l'itération 3 retourne `(bool, int)`. Elle est parfaite pour un test table-driven.

Écrire `game/combat_test.go` avec les cas suivants :

| Nom du test | heroHP | enemyHP | heroAttack | enemyAttack | héros gagne ? |
|---|---|---|---|---|---|
| "héros écrase l'ennemi" | 100 | 10 | 50 | 5 | true |
| "héros perd" | 10 | 100 | 5 | 50 | false |
| "combat équilibré" | 100 | 100 | 10 | 10 | true (héros attaque en premier) |
| "ennemi à 0 HP" | 100 | 0 | 10 | 10 | true |

> 💡 **À noter**
> Un test ne doit pas afficher de texte dans le terminal (les `fmt.Println` dans `simulateFight` s'afficheront quand même).
> Pour les tests silencieux, utiliser `go test -v` montre les prints - c'est acceptable à ce stade.
> En production, on passerait par un logger injectable, mais c'est hors périmètre de cette itération.

---

### 8.8 - Points de vigilance

- **Ne tester que ce que tu possèdes** - teste tes fonctions, pas les fonctions de la stdlib (`fmt`, `os`, etc.)
- **Un test = un comportement** - si ton test a 15 assertions sans rapport, découpe-le
- **Les tests doivent être déterministes** - un test qui passe une fois sur deux n'est pas un test. Si tu testes `rollDice()`, teste la plage de valeurs, pas la valeur exacte :
  ```go
  result := rollDice(6)
  if result < 1 || result > 6 {
      t.Errorf("rollDice(6) doit retourner entre 1 et 6, obtenu : %d", result)
  }
  ```
- **Les tests font partie du code** - ils se commitent sur Git, ils s'exécutent en CI/CD

---

### 8.9 - ⚡ Pour aller plus loin

- Utiliser `t.Helper()` dans une fonction d'assertion réutilisable :
  ```go
  func assertInt(t *testing.T, got, want int, msg string) {
      t.Helper() // Pointe vers l'appelant dans les logs d'erreur
      if got != want {
          t.Errorf("%s : attendu %d, obtenu %d", msg, want, got)
      }
  }
  ```
- Mesurer la couverture de code avec `go test -coverprofile=coverage.out ./...` puis `go tool cover -html=coverage.out`
- Découvrir `testify/assert` (package externe très populaire) : `github.com/stretchr/testify`

---

### 8.10 - Livrable

- [ ] `models/hero_test.go` avec les 4 tests unitaires (`NewHero`, `IsAlive`, `TakeDamage`, `Heal`)
- [ ] `models/quest_test.go` avec un test table-driven sur les récompenses (minimum 4 cas)
- [ ] `game/combat_test.go` avec un test table-driven sur `simulateFight()` (minimum 4 cas)
- [ ] `go test ./...` passe avec 0 échec
- [ ] `go test -v ./...` affiche le détail de chaque sous-test
- [ ] Tous les tests sont déterministes (pas de dépendance à `rand` sans contrôle)

---

> ✅ **Ce que tu sais maintenant faire**
> - Écrire des tests unitaires avec `testing.T`
> - Appliquer le pattern table-driven pour tester plusieurs cas proprement
> - Lancer et interpréter les résultats de `go test`
> - Distinguer `t.Error` (continue) et `t.Fatal` (arrête)
> - Tester les cas nominaux, limites et d'erreur
>
> À partir de maintenant, chaque nouvelle fonction que tu écris mérite son test. C'est un réflexe à construire.

---

## Itération 9 - Fichiers - sauvegarder et charger les données

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Lire et écrire des fichiers avec le package `os`
- Sérialiser et désérialiser des données en JSON avec `encoding/json`
- Gérer les erreurs de fichier proprement
- Comprendre les tags de struct JSON

---

### 9.1 - Sérialisation JSON

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

### 9.2 - Struct de sauvegarde

Créer un struct `SaveData` qui contient tout ce qui doit persister :

```go
type SaveData struct {
    Hero      Hero      `json:"hero"`
    Quests    []Quest   `json:"quests"`   // Version simplifiée sans interface
    Timestamp string    `json:"saved_at"`
}
```

> 💡 **Note** : les interfaces ne se sérialisent pas directement en JSON (le type concret est perdu). Pour la sauvegarde, utiliser le struct `Quest` de l'itération 5, plus simple et sérialisable.

### 9.3 - Fonctions à implémenter

Dans `game/save.go` :

| Fonction | Signature | Rôle |
|----------|-----------|------|
| `Save` | `(hero models.Hero, quests []Quest, path string) error` | Écrit la sauvegarde en JSON |
| `Load` | `(path string) (models.Hero, []Quest, error)` | Charge la sauvegarde depuis le fichier |

Ajouter les commandes :

- `"sauvegarder"` → appelle `game.Save(hero, quests, "save.json")`
- `"charger"` → appelle `game.Load("save.json")` et remplace le héros et les quêtes courants

```
> sauvegarder
Progression sauvegardée dans save.json ✓

> charger
Partie chargée - Bienvenue de retour, Thorin !
```

### 9.4 - Gestion des erreurs de fichier

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

### 9.5 - ⚡ Pour aller plus loin

- Ajouter un horodatage (`time.Now().Format(time.RFC3339)`) dans `SaveData.Timestamp`.
- Permettre plusieurs slots de sauvegarde : `"sauvegarder <nom>"` / `"charger <nom>"`.

### 9.6 - Livrable

- [ ] Struct `SaveData` avec tags JSON
- [ ] Fonctions `Save()` et `Load()` dans `game/save.go`
- [ ] Commandes `"sauvegarder"` et `"charger"` fonctionnelles
- [ ] Erreurs de fichier gérées sans crash

---

## Itération 10 - Goroutines et channels - concurrence

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Comprendre le modèle de concurrence de Go (goroutines et channels)
- Lancer une goroutine avec `go`
- Communiquer entre goroutines via des channels
- Utiliser `select` pour gérer plusieurs channels

---

### 10.1 - Goroutines

> 💡 **Goroutine**
> Une goroutine est une **fonction exécutée de manière concurrente**. Elle est bien plus légère qu'un thread OS (quelques Ko vs plusieurs Mo). Go peut gérer des milliers de goroutines simultanément.
> ```go
> go doSomething()   // Lance doSomething() en concurrence
>
> // Attendre la fin avec un WaitGroup :
> var wg sync.WaitGroup
> wg.Add(1)
> go func() {
>     defer wg.Done()
>     // ...
> }()
> wg.Wait()
> ```

### 10.2 - Channels

> 💡 **Channel**
> Un channel est un **tuyau typé** pour envoyer des valeurs entre goroutines.
> ```go
> ch := make(chan string)        // Channel non bufferisé
> ch := make(chan string, 10)    // Channel bufferisé (capacité 10)
>
> go func() { ch <- "message" }()  // Envoi (bloquant si non bufferisé)
> msg := <-ch                       // Réception (bloquant)
>
> close(ch)  // Fermer le channel quand on n'envoie plus
> ```

### 10.3 - Tâche : timer de quête en arrière-plan

Ajouter un système de timer : certaines quêtes ont une durée limitée. Lancer un compte à rebours en goroutine pendant que le joueur continue de jouer.

Implémenter la fonction `StartQuestTimer(questTitle string, duration time.Duration, done chan bool)` :
- Lance un compte à rebours en arrière-plan
- Si `duration` s'écoule sans signal sur `done` → afficher `"⏰ Temps écoulé pour la quête '[titre]' !"`
- Si un signal `true` est envoyé sur `done` → la goroutine s'arrête silencieusement

```go
done := make(chan bool)
go game.StartQuestTimer("La Tour du Sorcier", 60*time.Second, done)

// Plus tard, quand la quête est terminée :
done <- true
```

> 💡 **`select`**
> ```go
> select {
> case <-time.After(duration):
>     fmt.Println("Temps écoulé !")
> case <-done:
>     // Quête terminée à temps
> }
> ```
> `select` attend sur plusieurs channels simultanément et traite le premier qui reçoit une valeur.

### 10.4 - Tâche : sauvegarde automatique

Implémenter une sauvegarde automatique toutes les 30 secondes en arrière-plan :

```go
go func() {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop()
    for {
        <-ticker.C
        game.Save(hero, quests, "autosave.json")
        fmt.Println("[Autosave] Progression sauvegardée automatiquement.")
    }
}()
```

> 💡 **`time.NewTicker`** : envoie une valeur sur son channel `.C` à intervalle régulier.

### 10.5 - Points de vigilance

- **Race condition** : si plusieurs goroutines accèdent au même struct `Hero`, utiliser un `sync.Mutex`.
- Ne jamais envoyer sur un channel fermé - panic immédiat.
- Fermer un channel depuis **l'émetteur**, jamais depuis le récepteur.

### 10.6 - Livrable

- [ ] Fonction `StartQuestTimer()` avec goroutine + `select`
- [ ] Sauvegarde automatique toutes les 30 secondes en arrière-plan
- [ ] Aucune race condition (utiliser `go run -race main.go` pour vérifier)

---

## Itération 11 (Bonus) - API REST

⏱ **Durée estimée : 3 jours**

### Objectifs pédagogiques

- Exposer le gestionnaire de quêtes via une API HTTP
- Utiliser le framework **Gin**
- Appliquer les concepts du module K_COURSE_PROJECT_BUILD_A_REST_API

---

### 11.1 - Routes à implémenter

| Méthode | Route | Action |
|---------|-------|--------|
| `GET` | `/hero` | Retourne les stats du héros |
| `PUT` | `/hero/heal` | Soigne le héros |
| `GET` | `/quests` | Liste toutes les quêtes |
| `POST` | `/quests/:id/complete` | Complète une quête |
| `GET` | `/quests/:id` | Détail d'une quête |

### 11.2 - Setup

```bash
go get github.com/gin-gonic/gin
```

Créer `api/server.go` qui initialise Gin et enregistre les routes. Appeler `api.StartServer()` depuis `main.go` (en goroutine pour ne pas bloquer la boucle CLI).

### 11.3 - Livrable

- [ ] Serveur Gin démarré sur `:8080`
- [ ] `GET /hero` retourne le JSON du héros
- [ ] `GET /quests` retourne la liste des quêtes
- [ ] `POST /quests/:id/complete` complète la quête et retourne les récompenses
- [ ] CLI et API fonctionnent simultanément (goroutines)

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

### Goroutines et Channels

```go
// Goroutine
go func() { fmt.Println("concurrent") }()

// Channel
ch := make(chan int)
go func() { ch <- 42 }()
val := <-ch

// Select
select {
case msg := <-ch1: fmt.Println(msg)
case msg := <-ch2: fmt.Println(msg)
case <-time.After(1 * time.Second): fmt.Println("timeout")
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
├── game/
│   ├── combat.go
│   ├── commands.go
│   └── save.go
└── api/          ← Bonus
    └── server.go
```
