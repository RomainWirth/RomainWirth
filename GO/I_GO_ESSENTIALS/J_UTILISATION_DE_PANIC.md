# J. UTILISATION DE `PANIC`

Pour éviter de sortir du programme en cas d'erreur avec un `return`, on peut utiliser la fonction `panic()`.  
Cette fonction est faite pour être utilisée dans le cas ou on ne peut simplement pas continuer l'exécution code.  
`panic("some message")` va également arrêter l'exécution du code mais va également ajouter un message d'erreur.  
Ainsi, lorsqu'on run l'application, le message d'erreur ressemble plus à un crash qui renvoie le message écrit avec la fonction et des détails de l'erreur. 

## EXERCICE : RETOUR SUR LE CALCULATEUR DE PROFIT

À partir de la petite application créée précédemment, nous allons ajouter quelques features : 
* Validation de l'entrée utilisateur :
  * Montrer un message d'erreur et stopper le programme si l'entrée est invalide
  * Pas de nombres négatifs
  * Pas de valeur à 0
* Stocker les résultats dans un fichier

```Go
package main

import "fmt"

func main() {
	revenue := getUserInput("Revenue: ")
	expenses := getUserInput("Expenses: ")
	taxRate := getUserInput("Tax Rate (in %): ")

	earningsBeforeTaxes, netProfitAfterTaxes, ratio := calculateFinancials(revenue, expenses, taxRate)

	fmt.Printf("Earning Before Taxes: %.2f\n", earningsBeforeTaxes)
	fmt.Printf("Net Profit After Taxes: %.2f\n", netProfitAfterTaxes)
	fmt.Printf("Ratio of Expenses to Earnings: %.2f\n", ratio)
}

func getUserInput(infoText string) float64 {
	var userInput float64

	fmt.Print(infoText)
	fmt.Scan(&userInput)

	return userInput
}

func calculateFinancials(revenue, expenses, taxRate float64) (float64, float64, float64) {
	ebt := revenue - expenses
	taxes := ebt * (taxRate / 100)
	profit := ebt - taxes
	ratio := expenses / ebt * 100

	return ebt, profit, ratio
}
```

<details>
<summary style="font-weight:bold">Correction</summary>

```Go
package main

import (
	"errors"
	"fmt"
	"os"
)

const dataFile = "results.txt"

func main() {
	revenue, err1 := getUserInput("Revenue: ")
	if err1 != nil {
		panic("revenue cannot be negative. Please enter a valid amount.")
	}

	expenses, err2 := getUserInput("Expenses: ")
	if err2 != nil {
		panic("expenses cannot be negative. Please enter a valid amount.")
	}

	taxRate, err3 := getUserInput("Tax Rate (in %): ")
	if err3 != nil || taxRate > 100 {
		panic("tax rate must be between 0 and 100. Please enter a valid percentage.")
	}

	earningsBeforeTaxes, netProfitAfterTaxes, ratio := calculateFinancials(revenue, expenses, taxRate)

	fmt.Printf("Earning Before Taxes: %.2f\n", earningsBeforeTaxes)
	fmt.Printf("Net Profit After Taxes: %.2f\n", netProfitAfterTaxes)
	fmt.Printf("Ratio of Expenses to Earnings: %.2f\n", ratio)

	storeResults(earningsBeforeTaxes, netProfitAfterTaxes, ratio)
}

func getUserInput(infoText string) (float64, error) {
	var userInput float64

	fmt.Print(infoText)
	fmt.Scan(&userInput)

	if userInput < 0 {
		return 0, errors.New("input cannot be negative")
	}

	return userInput, nil
}

func calculateFinancials(revenue, expenses, taxRate float64) (float64, float64, float64) {
	ebt := revenue - expenses
	taxes := ebt * (taxRate / 100)
	profit := ebt - taxes
	ratio := expenses / ebt * 100

	return ebt, profit, ratio
}

func storeResults(ebt, profit, ratio float64) {
	results := fmt.Sprintf("Earnings Before Taxes: %.2f\nNet Profit After Taxes: %.2f\nRatio of Expenses to Earnings: %.2f\n", ebt, profit, ratio)
	os.WriteFile(dataFile, []byte(results), 0644)
}
```
Output dans le terminal : 
```
go run .

Revenue: 2200
Expenses: 1300
Tax Rate (in %): 7
Earning Before Taxes: 900.00
Net Profit After Taxes: 837.00
Ratio of Expenses to Earnings: 144.44
```
Et un nouveau fichier `results.txt` contenant ceci : 
```
Earnings Before Taxes: 900.00
Net Profit After Taxes: 837.00
Ratio of Expenses to Earnings: 144.44
```
</details>