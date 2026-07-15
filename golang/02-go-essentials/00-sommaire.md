# GO ESSENTIALS - Sommaire

> Valeurs, types, fonctions et fonctionnalités fondamentales du langage Go.

---

## [B - Composants clés d'un programme Go](B_GO_PROGRAM_KEY_COMPONENTS.md)

- Organisation du code en **packages** (`package main`, packages secondaires).
- Le package **`main`** comme point d'entrée obligatoire de l'application.
- La **fonction `main()`** : première fonction exécutée, unique par application.
- Commandes essentielles : `go mod init`, `go build`, `go run .`.
- Import et utilisation du package **`fmt`** (bibliothèque standard).

---

## [C - Valeurs & Types](C_VALUES_&_TYPES.md)

- Go est un **langage fortement typé** : opérations entre types différents interdites à la compilation.
- Types de base : `int`, `float64`, `string`, `bool`; types de niche : `int32`, `int64`, `uint`, `rune`.
- **Valeurs nulles** par défaut selon le type (`0`, `0.0`, `""`, `false`).
- Déclaration explicite `var x int = 5` vs déclaration concise `x := 5`.
- `const` pour les constantes immuables ; déclarables en dehors de toute fonction.
- **Conversion de type** : `float64(monInt)`.
- Formatage d'affichage : `fmt.Printf()` (`%v`, `%f`, `%.2f`), `fmt.Sprintf()` pour créer des strings.
- Limites de `fmt.Scan()` (bloqué au premier espace) et alternative avec `bufio.NewReader`.

---

## [D - Comprendre les fonctions](D_COMPRENDRE_LES_FONCTIONS.md)

- Déclaration avec `func nom(param type) typeRetour { ... }`.
- **Retour de plusieurs valeurs** : `func f() (float64, float64) { return a, b }`.
- **Retours nommés** dans la signature : `func f() (result float64, err error)` + `return` nu.
- Groupement de paramètres de même type : `func f(a, b, c float64)`.
- Appel et déstructuration : `val1, val2 := maFonction(args...)`.

---

## [E - Structures de contrôle](E_STRUCTURES_DE_CONTROLE.md)

- `if condition { ... }` - pas de parenthèses autour de la condition en Go.
- `else if condition { ... }` - enchaînement de conditions.
- `else { ... }` - cas par défaut.
- **Conditions imbriquées** (*nested if*) pour les logiques à plusieurs niveaux.
- `return` stoppe immédiatement l'exécution de la fonction courante.
- Variable déclarable directement dans la condition d'un `if`.

---

## [F - Les boucles `for`](F_LES_BOUCLES_FOR.md)

- Go n'a **qu'un seul type de boucle** : `for` (remplace `while`, `do...while`, etc.).
- Syntaxe classique : `for i := 0; i < n; i++ { ... }`.
- Syntaxe simplifiée : `for range n { ... }` (Go 1.22+).
- Boucle infinie : `for { ... }` - contrôlée par `break` ou `return`.
- Boucle conditionnelle : `for condition { ... }` (équivalent du `while`).
- `break` sort de la boucle ; `continue` relance l'itération suivante.

---

## [G - Switch Case](G_SWITCH_CASE.md)

- `switch variable { case valeur: ... }` - alternative lisible aux longues chaînes `if/else if`.
- `default` - cas par défaut si aucun `case` ne correspond.
- **`break` implicite** en Go : pas besoin de l'écrire à la fin de chaque `case`.
- `fallthrough` - force l'exécution du `case` suivant (inconditionnellement).
- `return` dans un `switch` sort de la **fonction entière**.
- `switch` sans variable : équivalent de `if/else if` avec expressions booléennes.

---

## [H - Faire persister et extraire de la data d'un fichier](H_FAIRE_PERSISTER_ET_EXTRAIRE_DE_LA_DATA_D_UN_FICHIER.md)

- Package **`os`** : `os.WriteFile(nom, []byte(contenu), 0644)` pour écrire dans un fichier.
- `[]byte()` convertit une `string` en tableau d'octets (format requis par `WriteFile`).
- `0644` : permissions Unix (lecture/écriture propriétaire, lecture seule pour les autres).
- `os.ReadFile(nom)` lit un fichier et retourne `[]byte` → reconvertir en `string(data)`.
- Package **`strconv`** : `strconv.ParseFloat(str, 64)` convertit une `string` en `float64`.
- Ces fonctions retournent toujours un **couple** `(valeur, error)`.
- L'identifiant `_` ignore une valeur de retour - à éviter en production.

---

## [I - Gestion des erreurs](I_ERROR_HANDLING.md)

- Pas de `try/catch` en Go : les erreurs sont des **valeurs retournées**.
- Convention : `func f() (valeur, error)` - retourner l'erreur comme dernier élément.
- `errors.New("message")` (package `errors`) crée une valeur d'erreur.
- `nil` signifie *absence de valeur* : `if err != nil` détecte une erreur.
- Retourner une **valeur par défaut + error** permet à l'application de continuer proprement.
- Gérer les erreurs **au plus près de leur origine**, avant de poursuivre l'exécution.

---

## [J - Utilisation de `panic`](J_UTILISATION_DE_PANIC.md)

- `panic("message")` arrête **immédiatement** l'exécution et affiche une stack trace.
- À réserver aux erreurs **irrécupérables** (état incohérent, contrainte métier absolue).
- Pour les erreurs *attendues*, préférer le mécanisme `(valeur, error)`.
- Peut être capturé avec `recover()` à un niveau supérieur (usage avancé).
- Combiné avec `os.WriteFile()` pour persister les résultats dans un fichier texte.
