# AJOUTER ET TRAVAILLER AVEC DES STRUCTS

## Ajouter un struct `FileManager`

ajout d'un `struct` filemanager dans le projet, permettant d'améliorer la gestion des opérations liées aux fichiers, en particulier lors de l'accès et de la manipulation des fichiers JSON.

Voici les points clés :
* Création du `struct` filemanager : nouveau struct pour centraliser les opérations liées aux fichiers, ce qui facilite la gestion et la réutilisation du code.
```GO
type FileManager struct {
	InputFilePath  string
	OutputFilePath string
}
```
* Fonctions associées : Le struct filemanager inclut diverses méthodes, telles que ReadJSON pour lire des données JSON à partir d'un fichier et WriteJSON qui devien WriteResult pour écrire des données JSON dans un fichier. Cela aide à encapsuler la logique de gestion des fichiers à un seul endroit, rendant le code plus propre et plus maintenable.
```GO
func (fm FileManager) ReadLines() ([]string, error) {
  // ...
}

func (fm FileManager) WriteResult(data any) error {
	// ...
}
```
* Ajout d'un constructeur New : Une fonction New(inputFilePath, outputFilePath string) *FileManager a été ajoutée pour instancier proprement la struct depuis l'extérieur du package.
```GO
func New(inputFilePath, outputFilePath string) *FileManager {
	return &FileManager{
		InputFilePath:  inputFilePath,
		OutputFilePath: outputFilePath,
	}
}
```
* Utilisation de filemanager : comment intégrer ce nouveau struct dans les packages existants, remplaçant les appels directs aux fonctions de gestion des fichiers par des appels aux méthodes du struct filemanager.
Cela démontre la séparation des préoccupations et améliore l'organisation du projet.
Dans le package `prices` :
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
    // ajout de la variable vm ... commentaire à compléter
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		priceJob := prices.NewTaxIncludedPriceJob(*fm, taxRate) // update de l'appel de la function NewTaxeIncludedPriceJob
		priceJob.Process()
	}
}
```
* Avantages d'un struct : En consolidant la gestion des fichiers dans une structure dédiée, le code devient non seulement plus facile à lire et à maintenir, mais permet également d'évoluer à l’avenir en ajoutant de nouvelles fonctionnalités liées à la gestion des fichiers sans perturber les autres parties de l'application.

En résumé, l'introduction d'un struct comme filemanager dans un projet Go peut grandement améliorer l'organisation et la maintenabilité du code, en regroupant les opérations d'accès aux fichiers dans une entité logique cohérente.

## Ajouter et utiliser des `struct tags`



## Travailler sur des structs "swappable"
