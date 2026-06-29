# CRÉER UNE VERSION BASIQUE DU PROJET

N.B.: au besoin, ajouter un repo git au projet pour versionner l'avancée

## SET UP

### 1. Créer la structure du projet

```bash
mkdir price-calculator
cd price-calculator
```

### 2. Initialiser le module Go

Créer un fichier `go.mod` à la racine du projet. Il définit le nom du module et la version de Go utilisée :

```GO
module example.com/price-calculator

go 1.21.2
```

> Le nom du module (`example.com/price-calculator`) sert de chemin de base pour tous les imports internes au projet.

### 3. Créer le point d'entrée

Créer un fichier `main.go` avec la structure minimale d'un programme Go :

```GO
package main

func main() {
  // point d'entrée du programme
}
```

> `package main` et la fonction `main()` sont obligatoires pour produire un exécutable.

## Version basique

**Objectif global** : pour chaque taux de taxe, calculer les prix TTC correspondants et les regrouper dans une map `taxRate → []prixTTC`.
Étapes :
* Définir une slice de prix HT (float64) et une slice de taux de taxe (float64, ex: 0.2 pour 20%).
* Créer une map[float64][]float64 pour stocker les résultats :
   - clé   : le taux de taxe
   - valeur : la slice des prix TTC calculés pour ce taux
* Pour chaque taux de taxe, parcourir les prix et calculer : prixTTC = prix * (1 + taux).
* Stocker la slice résultante dans la map et afficher le tout.

Les concepts clés couverts :

### Étape 1 - Déclarer les données d'entrée

Déclarer un slice de prix HT (en `float64`) :
```GO
var prices []float64 = []float64{10, 20, 30}
// Forme courte : prices := []float64{10, 20, 30}
```

Déclarer un slice de taux de taxe (en `float64`, représentant des pourcentages décimaux) :
```GO
var taxRates []float64 = []float64{0, 0.021, 0.055, 0.1, 0.2}
// Forme courte : taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}
```

### Étape 2 - Initialiser la structure de résultats

Créer une map vide dont la clé est un taux de taxe (`float64`) et la valeur est un slice de prix TTC (`[]float64`) :
```GO
var result map[float64][]float64 = make(map[float64][]float64)
// Forme courte : result := make(map[float64][]float64)
```

### Étape 3 - Calculer les prix TTC avec des boucles imbriquées

Pour chaque taux de taxe, calculer les prix TTC de tous les articles et stocker l'ensemble dans `result` :
- **Boucle externe** : itère sur chaque taux de taxe dans `taxRates`
- **Slice intermédiaire** : `taxIncludedPrices` - créé à chaque itération pour stocker les prix TTC de ce taux
- **Boucle interne** : itère sur chaque prix HT dans `prices` et applique la formule `prix × (1 + taux)`
- **Stockage** : une fois tous les prix calculés pour un taux donné, on les enregistre dans `result`

```GO
for _, taxRate := range taxRates {
  // Slice temporaire pour stocker les prix TTC de ce taux (même longueur que prices)
  taxIncludedPrices := make([]float64, len(prices))

  for priceIndex, price := range prices {
    // Prix TTC = prix HT × (1 + taux de taxe)
    taxIncludedPrices[priceIndex] = price * (1 + taxRate)
  }

  // Associer le slice de prix TTC au taux correspondant dans la map
  result[taxRate] = taxIncludedPrices
}
```

### Étape 4 - Afficher les résultats

```GO
fmt.Println(result)
```

## Amélioration : ajout d'un struct

**Objectif** : amélioration de la solution basique en organisant la logique de calcul des prix dans un package séparé.
Etapes :
* Ajouter un dossier (package) `prices` et un fichier `package.go`
* Créer un type personnalisé (`struct`) appelé `TaxIncludedPriceJob` afin de générer et traiter les travaux en fonction de différents taux de taxes.
* L'objectif principal est de créer plusieurs travaux associés à des taux de taxation spécifiques et de les traiter en lisant les prix d'un fichier (initialement codés en dur) pour calculer les prix taxes comprises.

Les concepts clés couverts :
* **Création de struct** : L’instructeur explique la structure de la struct 'TaxIncludedPriceJob', qui inclut des champs tels que 'TaxRate', 'Prices' et 'TaxIncludedPrices'.
* **Accessibilité des champs** : Il souligne l'importance d'utiliser des noms de champs en majuscules pour permettre l'accès depuis l'extérieur du package.
* **Mapping de données** : L'utilisation d'un type map pour le champ 'TaxIncludedPrices' est mise en avant, associant les prix d'entrée à leurs prix avec taxes calculés.
* **Ajout de méthodes** : Bien que les détails ne soient pas fournis, l'instructeur mentionne qu'une méthode sera ajoutée à la struct pour faciliter le processus de calcul.


### Etape 1 - ajouter un package `prices`

Créer un dossier `prices` qui va contenir un fichier `prices.go`. Ce fichier sera le `package prices`.
Dans ce package, on va ajouter un type custom : un struct `TaxIncludedPriceJob`.
```GO
package prices

type TaxesIncludedPriceJob struct {
	// ...
}
```

### Etape 2 - ajouter le contenu à `TaxIncludedPriceJob`

```GO
// TaxIncludedPriceJob représente un travail de calcul de prix TTC.
// Il regroupe le taux de taxe, les prix HT en entrée et la map des prix TTC calculés.
type TaxIncludedPriceJob struct {
	TaxRate           float64            // taux de taxe à appliquer (ex: 0.2 pour 20%)
	InputPrices       []float64          // liste des prix HT à traiter
	TaxIncludedPrices map[string]float64 // résultats : clé = prix HT formaté, valeur = prix TTC
}
```

### Etape 3 - ajouter une fonction constructor

Ajouter une fonction `NewTaxesIncludedPriceJob` qui va retourner un pointeur du type struct `TaxesIncludedPriceJob`.
Retourner un pointeur permet de créer la valeur de retour qu'une seule fois dans la mémoire, et de ne partager que l'adresse de cette valeur.

la fonction constructeur
```GO
// NewTaxIncludedPriceJob crée et retourne un nouveau TaxIncludedPriceJob
// avec un jeu de prix HT par défaut et le taux de taxe fourni en paramètre.
func NewTaxIncludedPriceJob(taxRate float64) *TaxIncludedPriceJob {
	return &TaxIncludedPriceJob{
		InputPrices: []float64{10, 20, 30}, // prix HT par défaut
		TaxRate:     taxRate,
	}
}
```

### Etape 4 - Ajouter une méthode `Process()`

```GO
// Process calcule les prix TTC pour chaque prix HT de InputPrices
// en appliquant la formule : prixTTC = prix * (1 + TaxRate).
// Les résultats sont stockés dans TaxIncludedPrices avec le prix HT (formaté à 2 décimales) comme clé.
func (job TaxIncludedPriceJob) Process() {
	result := make(map[string]float64)
	for _, price := range job.InputPrices {
		// clé : prix HT formaté à 2 décimales pour garantir l'unicité et la lisibilité
		result[fmt.Sprintf("%.2f", price)] = price * (1 + job.TaxRate)
	}

	fmt.Println(result)
}
```

### Etape 5 - Modifier `main.go`

```GO
package main

import (
	// import du package prices qui encapsule la logique de calcul TTC
	"example.com/price-calculator/prices"
)

func main() {
	// La logique de calcul a été extraite dans le package prices.
	// main.go se contente désormais d'orchestrer les traitements :
	// pour chaque taux de taxe, on crée un job et on l'exécute.
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
		// crée un job pré-configuré avec les prix HT par défaut et le taux courant
		priceJob := prices.NewTaxIncludedPriceJob(taxRate)
		// calcule les prix TTC et affiche le résultat pour ce taux
		priceJob.Process()
	}
}
```
---

## Résumé

### Version basique
- Déclaration de slices (`[]float64`) pour les prix HT et les taux de taxe.
- Utilisation d'une `map[float64][]float64` pour associer chaque taux à ses prix TTC calculés.
- Boucles `for range` imbriquées : une sur les taux, une sur les prix.
- Formule appliquée : `prixTTC = prixHT × (1 + taxRate)`.
- Slice intermédiaire créée avec `make([]float64, len(prices))` à chaque itération.

### Amélioration avec un struct et un package séparé
- Création d'un **package `prices`** pour isoler la logique métier de `main.go`.
- Définition d'un **struct `TaxIncludedPriceJob`** avec trois champs exportés : `TaxRate`, `InputPrices`, `TaxIncludedPrices`.
- Noms de champs en **majuscule** pour les rendre accessibles hors du package (règle d'export Go).
- **Fonction constructeur** `NewTaxIncludedPriceJob(taxRate)` : initialise le struct et retourne un `*TaxIncludedPriceJob` (pointeur).
- **Méthode `Process()`** avec un **receiver pointeur** (`*TaxIncludedPriceJob`) : indispensable pour que les résultats soient stockés dans le struct d'origine et non dans une copie.
- `main.go` réduit à l'orchestration : boucle sur les taux → crée un job → appelle `Process()`.
