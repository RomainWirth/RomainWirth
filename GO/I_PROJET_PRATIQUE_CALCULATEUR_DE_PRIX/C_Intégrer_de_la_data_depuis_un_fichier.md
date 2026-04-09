# INTÉGRER DE LA DATA DEPUIS UN FICHIER

**Objectif** : remplacer les prix HT codés en dur dans le constructeur par une lecture dynamique depuis un fichier texte `prices.txt`.

Cela permet de modifier les prix sans recompiler le programme - la logique métier et les données sont séparées.

## Ajouter un fichier de data et une méthode pour récupérer les données

### Packages ajoutés

Deux packages de la bibliothèque standard Go sont nécessaires dans `prices.go` :

| Package | Rôle |
|---|---|
| `os` | Ouvrir et fermer des fichiers (`os.Open`, `file.Close`) |
| `bufio` | Lire un fichier ligne par ligne de manière efficace (`bufio.NewScanner`) |

> **Pourquoi `bufio` plutôt que `os.ReadFile` ?**
> `os.ReadFile` charge le fichier entier en mémoire d'un coup. `bufio.NewScanner` lit le fichier ligne par ligne en utilisant un buffer interne - plus efficace pour les grands fichiers et plus adapté quand on veut traiter chaque ligne individuellement.

### Étape 1 - Ajouter le fichier `prices.txt`

Créer un fichier `prices.txt` à la racine du projet. Il contient une liste de prix HT, un par ligne :

```txt
4.49
12.30
27.99
6.75
53.20
89.00
34.50
71.15
18.90
45.60
62.75
3.99
77.40
29.99
91.25
```

### Étape 2 - Ajouter la méthode `LoadData()`

Dans le package `prices`, ajouter une méthode `LoadData()` sur `*TaxIncludedPriceJob`.

Cette première version se concentre sur la **lecture** du fichier : ouvrir `prices.txt` et collecter chaque ligne dans un `[]string`. La conversion en `float64` sera ajoutée à l'étape suivante (section *Travailler avec le fichier de données*).

```GO
import (
	"bufio"    // lecture ligne par ligne via un scanner bufferisé
	"fmt"
	"os"       // accès au système de fichiers (open/close)
	"strconv"  // conversion string → float64
)

// LoadData lit les prix HT depuis prices.txt et les charge dans job.InputPrices.
// Le receiver est un pointeur pour que la modification de InputPrices soit persistée.
func (job TaxIncludedPriceJob) LoadData() {
	// ouverture du fichier contenant les prix HT
	file, err := os.Open("prices.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}

	// scanner pour lire le fichier ligne par ligne
	scanner := bufio.NewScanner(file)

	var lines []string

	// lecture de chaque ligne jusqu'à la fin du fichier
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// vérification d'une éventuelle erreur survenue pendant le scan
	err = scanner.Err()
	if err != nil {
		fmt.Println("Erreur lors de la lecture du fichier :", err)
		file.Close()
		return
	}

}
```

> **Note sur la fermeture du fichier** : dans cette version, `file.Close()` est appelé manuellement uniquement en cas d'erreur. Le fichier reste ouvert en fin de fonction normale — cela sera l'occasion d'introduire `defer file.Close()` comme amélioration dans une prochaine version.

---

### Résumé

- **`os.Open`** : ouvre un fichier en lecture seule ; retourne `(*os.File, error)`.
- **`bufio.NewScanner`** : lit un fichier ligne par ligne via un buffer interne, plus efficace que charger tout le fichier en mémoire d'un coup.
- **`scanner.Scan()`** : avance d'une ligne à chaque appel ; retourne `false` en fin de fichier.
- **`scanner.Text()`** : retourne la ligne courante sous forme de `string`.
- **`file.Close()`** : ferme le fichier manuellement en cas d'erreur dans cette version.
- **`strconv.ParseFloat(s, 64)`** : convertit une `string` en `float64` — utilisé à la section suivante pour traiter les lignes lues.

## Travailler avec le fichier de données

**Objectif** : compléter `LoadData()` pour convertir les lignes lues en `float64` et les stocker dans `job.InputPrices`, puis modifier `Process()` pour appeler `LoadData()` avant les calculs.

### Modifier `LoadData()` — ajout de la conversion

Après la lecture des lignes dans `lines []string`, ajouter une deuxième passe  qui alloue une slice de `float64` de la bonne taille et convertit chaque ligne :
```GO
	// allocation d'une slice de float64 de la même taille que le nombre de lignes lues
	prices := make([]float64, len(lines))

	for lineIndex, line := range lines {
		// conversion de la ligne texte en float64 (précision 64 bits)
		floatPrice, err := strconv.ParseFloat(line, 64)

		if err != nil {
			// la ligne ne contient pas un nombre valide : on ferme le fichier et on abandonne
			fmt.Printf("Erreur de conversion du prix à la ligne %d : %s\n", lineIndex+1, err)
			file.Close()
			return
		}

		prices[lineIndex] = floatPrice
	}

	// mise à jour du job avec les prix lus depuis le fichier (possible grâce au récepteur pointeur)
	job.InputPrices = prices
```

Etait final de `LoadData()` :
```GO
// LoadData lit le fichier "prices.txt" ligne par ligne et charge les prix HT dans job.InputPrices.
// Chaque ligne du fichier doit contenir un prix numérique (ex: "9.99").
// Le récepteur est un pointeur (*TaxIncludedPriceJob) pour que la modification de job.InputPrices
// soit visible en dehors de la méthode.
// En cas d'erreur d'ouverture, de lecture ou de conversion, un message est affiché et la fonction retourne.
func (job *TaxIncludedPriceJob) LoadData() {
	// ouverture du fichier contenant les prix HT
	file, err := os.Open("prices.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}

	// scanner pour lire le fichier ligne par ligne
	scanner := bufio.NewScanner(file)

	var lines []string

	// lecture de chaque ligne jusqu'à la fin du fichier
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// vérification d'une éventuelle erreur survenue pendant le scan
	err = scanner.Err()
	if err != nil {
		fmt.Println("Erreur lors de la lecture du fichier :", err)
		file.Close()
		return
	}

	// allocation d'une slice de float64 de la même taille que le nombre de lignes lues
	prices := make([]float64, len(lines))

	for lineIndex, line := range lines {
		// conversion de la ligne texte en float64 (précision 64 bits)
		floatPrice, err := strconv.ParseFloat(line, 64)

		if err != nil {
			// la ligne ne contient pas un nombre valide : on ferme le fichier et on abandonne
			fmt.Printf("Erreur de conversion du prix à la ligne %d : %s\n", lineIndex+1, err)
			file.Close()
			return
		}

		prices[lineIndex] = floatPrice
	}

	// mise à jour du job avec les prix lus depuis le fichier (possible grâce au récepteur pointeur)
	job.InputPrices = prices
}
```

### Modifier `Process()` pour appeler `LoadData()`

Deux changements par rapport à la version précédente :
1. Appeler `job.LoadData()` en début de méthode pour peupler `job.InputPrices` depuis le fichier.
2. Stocker les résultats directement dans `job.TaxIncludedPrices` plutôt que dans une variable locale, pour rester cohérent avec la structure du struct.

```GO
// Process charge les prix HT depuis le fichier, calcule les prix TTC
// et les stocke dans job.TaxIncludedPrices.
func (job *TaxIncludedPriceJob) Process() {
	// 1. Chargement des prix HT depuis prices.txt
	job.LoadData()

	// 2. Initialisation de la map de résultats
	job.TaxIncludedPrices = make(map[string]float64)

	// 3. Calcul des prix TTC pour chaque prix HT chargé
	for _, price := range job.InputPrices {
		// Clé : prix HT formaté à 2 décimales (ex : "10.50")
		key := fmt.Sprintf("%.2f", price)
		job.TaxIncludedPrices[key] = price * (1 + job.TaxRate)
	}

	fmt.Println(job.TaxIncludedPrices)
}
```

### Modifier l'affichage des prix

**Objectif** : améliorer la lisibilité des résultats en formatant les prix TTC avec exactement deux chiffres après la virgule.

Changements par rapport à la version précédente :
- Le type de `result` passe de `map[string]float64` à `map[string]string` : la valeur (prix TTC) est maintenant une chaîne formatée plutôt qu'un `float64` brut.
- Le prix TTC est d'abord calculé dans une variable intermédiaire `taxIncludedPrice`, puis converti en string formatée avec `fmt.Sprintf("%.2f", ...)`.

```GO
func (job *TaxIncludedPriceJob) Process() {
	// chargement des prix HT depuis prices.txt avant le calcul
	job.LoadData()

	// map[string]string : clé = prix HT formaté, valeur = prix TTC formaté (2 décimales)
	// le changement de float64 → string permet un affichage propre sans notation scientifique
	result := make(map[string]string)
	for _, price := range job.InputPrices {
		// calcul du prix TTC intermédiaire (float64) avant formatage
		taxIncludedPrice := price * (1 + job.TaxRate)
		// clé : prix HT formaté à 2 décimales pour garantir l'unicité et la lisibilité
		// valeur : prix TTC formaté à 2 décimales (ex : "10.49" au lieu de "10.490000...")
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	fmt.Println(result)
}
```

### Flux complet d'exécution

Avec ces modifications, voici ce qui se passe lors de chaque appel à `priceJob.Process()` dans `main.go` :

```
priceJob.Process()
  └── job.LoadData()
        ├── os.Open("prices.txt")
        ├── bufio.NewScanner → lit ligne par ligne
        ├── strconv.ParseFloat → convertit chaque ligne en float64
        └── job.InputPrices = prices  ← stocké dans le struct
  └── for _, price := range job.InputPrices
        └── job.TaxIncludedPrices[key] = price * (1 + job.TaxRate)
  └── fmt.Println(job.TaxIncludedPrices)
```

> **Remarque** : `LoadData()` est appelée à chaque `Process()`, donc le fichier est relu à chaque taux de taxe. Pour un fichier de petite taille c'est acceptable ; pour un usage en production, on lirait le fichier une seule fois avant la boucle et on passerait les prix en paramètre.

### État final de `main.go`

```GO
package main

import (
	"example.com/price-calculator/prices"
)

func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
		priceJob := prices.NewTaxIncludedPriceJob(taxRate)
		priceJob.Process() // charge les prix depuis prices.txt puis calcule les TTC
	}
}
```

---

### Résumé de la section

- `LoadData()` est appelée depuis `Process()` : le chargement des données est encapsulé dans la méthode, `main.go` n'a pas à s'en préoccuper.
- Les résultats sont stockés dans `job.TaxIncludedPrices` (et non dans une variable locale) — cohérent avec le design du struct.
- Le receiver pointeur `*TaxIncludedPriceJob` est indispensable sur les deux méthodes pour que les modifications des champs (`InputPrices`, `TaxIncludedPrices`) persistent sur le struct d'origine.

