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

## Travailler sur des structs "swappable"
