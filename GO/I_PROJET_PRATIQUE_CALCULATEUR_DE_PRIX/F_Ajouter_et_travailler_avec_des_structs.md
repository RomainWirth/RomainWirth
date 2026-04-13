# AJOUTER ET TRAVAILLER AVEC DES STRUCTS

## Ajouter un struct `FileManager`

### Pourquoi introduire un struct pour la gestion des fichiers ?

Dans l'état précédent du projet, les fonctions `ReadLines()` et `WriteJSON()` du package `filemanager` prenaient les chemins de fichiers en **paramètres à chaque appel**. Cela fonctionnait, mais créait un couplage indirect : le package `prices` devait connaître et transmettre les chemins d'entrée et de sortie, ce qui mélange encore la logique métier avec des détails d'I/O.

L'idée est d'aller un cran plus loin en introduisant un **struct `FileManager`** qui regroupe dans un seul objet :
- les chemins vers les fichiers d'entrée et de sortie,
- les méthodes pour lire et écrire.

On peut ensuite passer un `FileManager` **déjà configuré** à un job. Celui-ci n'a plus besoin de savoir *où* se trouvent les fichiers - il délègue entièrement cette connaissance à son `IOManager`. C'est le principe d'**injection de dépendance** : une dépendance (ici, l'accès aux fichiers) est configurée à l'extérieur et injectée dans l'objet qui en a besoin.

### Étape 1 - Définir la struct `FileManager`

La struct encapsule les deux chemins nécessaires au cycle de vie d'un job : le fichier source (prix HT) et le fichier de destination (résultats JSON). Ces chemins sont fournis à la construction et restent constants ensuite.
```GO
type FileManager struct {
	InputFilePath  string
	OutputFilePath string
}
```

### Étape 2 - Transformer les fonctions libres en méthodes

Les anciennes fonctions `ReadLines(path)` et `WriteJSON(path, data)` deviennent des **méthodes** du `FileManager`. Elles n'ont plus besoin de recevoir les chemins en paramètres : elles les lisent directement depuis les champs du récepteur `fm`.

`WriteResult` remplace `WriteJSON` : le renommage reflète l'**intention métier** (écrire un résultat) plutôt que le détail technique (écrire du JSON). Si on change de format de sérialisation plus tard, l'interface publique reste stable.
```GO
func (fm FileManager) ReadLines() ([]string, error) {
  // ...
}

func (fm FileManager) WriteResult(data any) error {
	// ...
}
```

### Étape 3 - Ajouter un constructeur `New()`

En Go, il n'y a pas de constructeurs au sens strict. La convention est d'exposer une fonction `New()` qui retourne un **pointeur** vers une instance initialisée. Cela offre plusieurs avantages :
- centraliser la logique d'initialisation (validation de chemin, valeurs par défaut…),
- rendre le code appelant plus lisible (`filemanager.New(...)` vs un littéral de struct),
- éviter les initialisations partielles depuis l'extérieur du package.
```GO
func New(inputFilePath, outputFilePath string) *FileManager {
	return &FileManager{
		InputFilePath:  inputFilePath,
		OutputFilePath: outputFilePath,
	}
}
```

### Étape 4 - Intégrer `FileManager` dans le package `prices`

Le `FileManager` est injecté dans `TaxIncludedPriceJob` via le champ `IOManager`. Résultat : `LoadData()` et `Process()` appellent simplement `job.IOManager.ReadLines()` et `job.IOManager.WriteResult()` - les chemins de fichiers ont disparu de leur code. Le constructeur `NewTaxIncludedPriceJob` reçoit maintenant un `FileManager` en paramètre, ce qui rend la dépendance **explicite et configurable** depuis l'extérieur.
```GO
type TaxIncludedPriceJob struct {
	IOManager         filemanager.FileManager // ajout du gestionnaire de fichiers pour lire les prix HT et écrire les résultats
	TaxRate           float64                 // taux de taxe à appliquer (ex: 0.2 pour 20%)
	InputPrices       []float64               // liste des prix HT à traiter
	TaxIncludedPrices map[string]string       // résultats : clé = prix HT formaté, valeur = prix TTC
}

func (job *TaxIncludedPriceJob) LoadData() {
	lines, err := job.IOManager.ReadLines() // filemanager.ReadLines("prices.txt") => job.IOManager.ReadLines()
	// ...
}

func (job *TaxIncludedPriceJob) Process() {
	// ...

	job.IOManager.WriteResult(job) // filemanager.WriteJSON(fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", job.TaxRate*100), job) => job.IOManager.WriteResult(job)
}

// update de la signature de la function avec ajout de fm de type filemanager.FileManager
func NewTaxIncludedPriceJob(fm filemanager.FileManager, taxRate float64) *TaxIncludedPriceJob {
	return &TaxIncludedPriceJob{
		IOManager:   fm, // ajout de IOManager
		InputPrices: []float64{10, 20, 30}, // prix HT par défaut
		TaxRate:     taxRate,
	}
}
```

### Étape 5 - Mettre à jour `main.go`

Dans `main()`, on crée d'abord un `FileManager` configuré pour chaque taux de taxe via `filemanager.New()`, puis on le passe au constructeur du job. La séparation est claire : on configure l'I/O d'un côté, on instancie la logique métier de l'autre.

`filemanager.New()` retourne un `*FileManager` (pointeur). On le déréférence avec `*fm` pour passer une **valeur** à `NewTaxIncludedPriceJob`, qui attend un `filemanager.FileManager` (pas un pointeur). Ce comportement est volontaire : le job possède sa propre copie du FileManager.

Dans `main.go` :
```GO
package main

import (
	"fmt"

	"example.com/price-calculator/filemanager"
	"example.com/price-calculator/prices"
)

func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
    // création d'un FileManager configuré avec le fichier source et le fichier de sortie propre à ce taux
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		priceJob := prices.NewTaxIncludedPriceJob(*fm, taxRate) // déréférencement : *fm passe la valeur du FileManager, pas le pointeur
		priceJob.Process()
	}
}
```
### Bilan : avant / après

| Avant | Après |
|---|---|
| Chemins passés à chaque appel de fonction | Chemins encapsulés dans `FileManager` à la construction |
| `prices` connaît les chemins d'entrée et de sortie | `prices` ne connaît que son `IOManager` |
| Fonctions libres `ReadLines(path)` / `WriteJSON(path, data)` | Méthodes `fm.ReadLines()` / `fm.WriteResult(data)` |
| Couplage fort entre logique métier et I/O | Injection de dépendance : l'I/O est configurable de l'extérieur |

Ce pattern prépare également le terrain pour la section suivante : en isolant l'I/O dans un objet dédié, il devient possible de le rendre **swappable** - c'est-à-dire remplaçable par n'importe quelle autre implémentation compatible (base de données, API, mock de test…).

## Ajouter et utiliser des `struct tags`

### Qu'est-ce qu'un struct tag ?

Un **struct tag** est une chaîne de caractères littérale attachée à un champ de struct, placée à droite de son type entre backticks. Il ne fait rien par lui-même à la compilation : c'est une **métadonnée** que les packages peuvent lire au moment de l'exécution via la **réflexion** (`reflect`).

```
NomDuChamp TypeDuChamp `clé:"valeur"`
```

Le package `encoding/json` exploite ces tags pour contrôler la sérialisation et la désérialisation JSON : il inspecte le tag de chaque champ pour savoir quel nom de clé utiliser dans le JSON produit, et comment se comporter dans certains cas particuliers.

Sans struct tags, `encoding/json` utilise par défaut le **nom exact du champ** Go comme clé JSON (ex. `TaxRate` → `"TaxRate"`). Avec les tags, on peut produire un JSON avec des conventions différentes (snake_case, camelCase, ou toute autre forme), sans modifier les noms des champs dans le code Go.

### Anatomie de `json:"..."`

L'expression `json:"..."` suit la syntaxe : `` `json:"nom,option1,option2"` ``

- **`nom`** : la clé à utiliser dans le JSON à la place du nom du champ Go. Par convention, on utilise le **snake_case** (`tax_rate`, `input_prices`…) pour les API JSON.
- **`-`** : valeur spéciale qui indique à l'encodeur d'**ignorer complètement ce champ** - il n'apparaîtra pas dans le JSON produit, ni ne sera lu lors de la désérialisation.
- **`omitempty`** (option) : si la valeur du champ est la valeur zéro de son type (`0`, `""`, `nil`, `false`…), le champ est omis du JSON. Utile pour ne pas polluer un JSON avec des champs vides.

### Application dans `TaxIncludedPriceJob`

Dans le fichier `price.go`, on ajoute un tag à chaque champ de la struct :
```GO
type TaxIncludedPriceJob struct {
	IOManager         filemanager.FileManager `json:"-"`                   // ignoré lors de la sérialisation : c'est un détail d'infrastructure, pas une donnée métier
	TaxRate           float64                 `json:"tax_rate"`            // sérialisé en "tax_rate" dans le JSON (snake_case)
	InputPrices       []float64               `json:"input_prices"`        // sérialisé en "input_prices" dans le JSON
	TaxIncludedPrices map[string]string       `json:"tax_included_prices"` // sérialisé en "tax_included_prices" dans le JSON
}
```

**Pourquoi ignorer `IOManager` avec `json:"-"` ?**

`IOManager` est un objet d'infrastructure (il contient des chemins de fichiers et des méthodes d'I/O). Il n'a pas de sens dans les données de résultat : on ne veut pas que les chemins internes de l'application apparaissent dans les fichiers JSON produits. Le tag `json:"-"` exclut totalement ce champ de la sérialisation.

**Résultat : le JSON produit**

Avec ces tags, `WriteResult(job)` produira un fichier JSON structuré comme ceci :
```json
{
  "tax_rate": 0.2,
  "input_prices": [10, 20, 30],
  "tax_included_prices": {
    "10.00": "12.00",
    "20.00": "24.00",
    "30.00": "36.00"
  }
}
```

Sans les tags, les clés auraient été `TaxRate`, `InputPrices`, `TaxIncludedPrices` - des noms Go exportés, peu idiomatiques pour une API ou un fichier de données JSON.

## Travailler sur des structs échangeables

### Objectif : rendre le gestionnaire d'I/O remplaçable

Jusqu'ici, `TaxIncludedPriceJob` reçoit toujours un `filemanager.FileManager` : les données viennent d'un fichier texte et les résultats sont écrits dans un fichier JSON. Mais que se passe-t-il si on veut tester le programme interactivement, en saisissant les prix au clavier et en affichant les résultats dans la console plutôt que dans un fichier ?

Il faudrait pouvoir **remplacer** le `FileManager` par un autre objet qui fait la même chose, mais différemment. C'est ce qu'on appelle un struct **swappable** (échangeable) : deux structs différents qui exposent la même interface de méthodes et peuvent donc être utilisés de manière interchangeable.

Pour illustrer cela, on crée un second package `cmdmanager` dont le comportement est entièrement orienté ligne de commande : lire des prix saisis au clavier, afficher les résultats dans la console.

### Le struct `CMDManager`

Le struct est **vide** - il n'a aucun champ. C'est normal : contrairement au `FileManager` qui a besoin de stocker des chemins de fichiers, le `CMDManager` n'a aucun état à conserver. Il lit depuis `stdin` et écrit sur `stdout`, deux ressources globales qui ne nécessitent pas de configuration.

En Go, un struct vide est tout à fait valide. Il sert uniquement de **récepteur** pour y attacher des méthodes.
```GO
package cmdmanager

type CMDManager struct {} // pas de champs : aucune configuration nécessaire, l'I/O se fait via stdin/stdout
```

### Les méthodes `ReadLines()` et `WriteResult()`

Le `CMDManager` expose exactement les mêmes **noms et signatures** de méthodes que le `FileManager`. C'est cette correspondance de signatures qui rend les deux structs interchangeables - mais uniquement si on utilise une interface pour le déclarer explicitement (voir section suivante).

**`ReadLines()`** : au lieu de lire un fichier, elle démarre une boucle infinie qui lit une saisie à la fois avec `fmt.Scan`. `fmt.Scan` prend un **pointeur** (`&price`) car il doit modifier la variable `price` depuis l'extérieur de la fonction - c'est la mécanique standard de passage par référence en Go. La boucle se termine quand l'utilisateur entre `"0"`.

**`WriteResult()`** : au lieu d'écrire dans un fichier JSON, elle affiche simplement la donnée dans la console avec `fmt.Println`. Elle retourne toujours `error` (même si elle retourne `nil`) pour **respecter la même signature** que la méthode équivalente du `FileManager`. Si elle n'avait pas ce type de retour, elle ne serait pas interchangeable.
```GO
// lecture interactive : lit les prix un par un depuis la saisie clavier jusqu'à la valeur sentinelle "0"
func (cmd CMDManager) ReadLines() ([]string, error) {
	fmt.Println("S'il vous plaît, entrez les prix HT (un par ligne), puis confirmez chaque prix avec ENTER")

	var prices []string // slice qui accumule les saisies et sera retourné en fin de fonction

	for {
		var price string // variable réinitialisée à chaque itération pour recevoir la saisie
		fmt.Print("Prix HT : ")
		fmt.Scan(&price) // &price : passage par pointeur pour que fmt.Scan puisse écrire la valeur saisie dans price

		if price == "0" { // "0" est la valeur sentinelle : l'utilisateur signale qu'il a terminé sa saisie
			break
		}

		prices = append(prices, price)
	}

	return prices, nil
}

// affichage des résultats dans la console - retourne error pour respecter la même signature que FileManager.WriteResult
func (cmd CMDManager) WriteResult(data any) error {
	fmt.Println(data)
	return nil
}
```

### Le constructeur `New()`

Le constructeur est plus simple que celui du `FileManager` : pas de paramètres, pas de pointeur retourné. Il retourne directement une **valeur** `CMDManager` (pas un pointeur), car il n'y a aucun état à partager ou à muter.
```GO
func New() CMDManager {
	return CMDManager{}
}
```

### Le problème : `NewTaxIncludedPriceJob` n'accepte qu'un seul type

Si on essaie de passer `cmdm` là où la fonction attend un `filemanager.FileManager`, Go refuse à la compilation : ce sont deux types distincts, même s'ils ont les mêmes méthodes. Go est un langage à **typage statique strict** - la compatibilité de méthodes ne suffit pas, il faut un contrat explicite.
```GO
func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		cmdm := cmdmanager.New()
		priceJob := prices.NewTaxIncludedPriceJob(cmdm, taxRate) // erreur de compilation : cmdm n'est pas un filemanager.FileManager
		priceJob.Process()
	}
}
```

Le compilateur rejette `cmdm` car `NewTaxIncludedPriceJob` attend explicitement un `filemanager.FileManager`. Pourtant, `CMDManager` et `FileManager` implémentent exactement les mêmes méthodes (`ReadLines` et `WriteResult`). C'est précisément pour résoudre ce problème que les **interfaces** existent.

## Interfaces en renfort

### Qu'est-ce qu'une interface en Go ?

Une **interface** en Go est un type qui définit un ensemble de signatures de méthodes. Tout type qui implémente ces méthodes **satisfait automatiquement** l'interface - sans déclaration explicite (`implements` n'existe pas en Go). C'est ce qu'on appelle l'**implémentation implicite** ou *duck typing* statique : si un type "marche" comme l'interface (il a les bonnes méthodes), il **est** ce type.

Une interface permet d'écrire du code générique qui fonctionne avec n'importe quel type compatible, sans connaître son implémentation concrète. C'est le mécanisme central du **polymorphisme** en Go.

> **Polymorphisme**
>
> Le polymorphisme est la capacité d'un même code à se comporter différemment selon le type concret qu'il manipule.
>
> Dans les langages orientés objet classiques (Java, C++), il passe par l'héritage : une classe enfant redéfinit une méthode de la classe parente. En Go, il n'y a pas d'héritage. Le polymorphisme passe exclusivement par les **interfaces** : une fonction qui accepte un `iomanager.IOManager` peut recevoir un `FileManager`, un `CMDManager`, ou tout autre type futur qui satisfait le contrat - sans que la fonction ait besoin d'en connaître l'existence.
>
> C'est le polymorphisme **par composition** plutôt que par héritage, ce qui le rend plus flexible et moins fragile : ajouter un nouveau type compatible ne nécessite aucune modification du code existant.

### Étape 1 - Déclarer l'interface dans `main`

On commence par définir une interface `IOManager` qui liste les deux méthodes communes à `FileManager` et `CMDManager`. Go vérifiera automatiquement si un struct possède ces signatures - aucune annotation n'est requise du côté des structs :
```GO
type IOManager interface {
	ReadLines() ([]string, error)
	WriteResult(data any) error
}
```

Dès lors, `filemanager.FileManager` **et** `cmdmanager.CMDManager` satisfont tous les deux cette interface, car ils implémentent exactement ces deux méthodes avec ces signatures.

### Étape 2 - Déplacer l'interface dans son propre package `iomanager`

Déclarer l'interface dans `main` fonctionne, mais n'est pas réutilisable. Pour que `prices.go` puisse l'utiliser, on la place dans un package dédié `iomanager`. C'est la même logique de séparation des préoccupations : le contrat (l'interface) vit dans son propre package, indépendamment des implémentations et des consommateurs.
```GO
package iomanager

type IOManager interface {
	ReadLines() ([]string, error)
	WriteResult(data any) error
}
```

### Étape 3 - Remplacer le type concret par l'interface dans `prices.go`

Le champ `IOManager` du struct passe de `filemanager.FileManager` (type concret) à `iomanager.IOManager` (interface). Le package `prices` ne dépend plus d'aucune implémentation spécifique - il travaille avec n'importe quel objet qui respecte le contrat de l'interface.
```GO
type TaxIncludedPriceJob struct {
	IOManager         iomanager.IOManager `json:"-"`                   // l'interface accepte FileManager, CMDManager ou tout autre type compatible
	TaxRate           float64             `json:"tax_rate"`            // taux de taxe à appliquer (ex: 0.2 pour 20%)
	InputPrices       []float64           `json:"input_prices"`        // liste des prix HT à traiter
	TaxIncludedPrices map[string]string   `json:"tax_included_prices"` // résultats : clé = prix HT formaté, valeur = prix TTC
}
```

### Étape 4 - Mettre à jour le constructeur `NewTaxIncludedPriceJob()`
Le paramètre change de `filemanager.FileManager` à `iomanager.IOManager`. Désormais, `NewTaxIncludedPriceJob` accepte **n'importe quel type** qui satisfait l'interface - `FileManager`, `CMDManager`, ou un futur `DBManager` par exemple.
```GO
func NewTaxIncludedPriceJob(iom iomanager.IOManager, taxRate float64) *TaxIncludedPriceJob {
	return &TaxIncludedPriceJob{
		IOManager:   iom,
		InputPrices: []float64{10, 20, 30}, // prix HT par défaut
		TaxRate:     taxRate,
	}
}
```

### Étape 5 - Utilisation dans `main()`

On peut maintenant passer indifféremment `fm` (lecture fichier + écriture JSON) ou `cmdm` (saisie clavier + affichage console) à `NewTaxIncludedPriceJob`. On **swap** (échange) le gestionnaire d'I/O en une ligne, sans modifier ni `prices.go` ni aucune logique métier :
```GO
func main() {
  taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
    // fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		cmdm := cmdmanager.New() // on peut commenter cmdm et décommenter fm pour basculer d'un mode à l'autre
		priceJob := prices.NewTaxIncludedPriceJob(cmdm, taxRate)
		priceJob.Process()
	}
}
```

### Bilan : ce que les interfaces apportent ici

L'objectif n'est pas `interface{}` (le type vide qui accepte tout) - c'est une **interface nommée avec des méthodes définies**, qui sert de contrat entre packages.

| Sans interface | Avec interface `iomanager.IOManager` |
|---|---|
| `NewTaxIncludedPriceJob` n'accepte qu'un `FileManager` | Accepte tout type qui implémente `ReadLines` et `WriteResult` |
| Changer de source d'I/O implique de modifier `prices.go` | On échange le gestionnaire dans `main()` sans toucher à `prices.go` |
| Couplage fort au type concret | Couplage faible à un contrat abstrait |
| Tests unitaires difficiles (dépendance au système de fichiers) | On peut injecter un mock implémentant l'interface |

C'est le pattern **Dependency Inversion** : le package `prices` (haut niveau) ne dépend plus d'un package concret (bas niveau), mais d'une abstraction. L'implémentation concrète est décidée au niveau le plus haut de l'application - ici, dans `main()`.
