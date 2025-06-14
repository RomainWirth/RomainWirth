# C. COMPRENDRE LES FONCTIONS

Pour rappel, une fonction est un bloc de code 'à la demande', c'est à dire qu'il s'agit de code qui est exécuté uniquement lorsqu'on fait appel à ce bloc.  

La fonction `main()` est spécifique puisqu'elle est appelée par Go pour faire fonctionner un programme.

Les fonctions du package `fmt` sont des fonctions qui sont exécutées uniquement lorsqu'on les a appelé.
On peut trouver le détail de ces fonctions dans le lien vers le **[Repository](https://cs.opensource.google/go/go)** dans la [documentation](https://pkg.go.dev/fmt@go1.24.3).

## DEFINIR UNE FONCTION

Afin de créer une fonction, on va utiliser le mot clé `func`.  
On va déclarer une fonction de cette manière : 
```Go
func name(arg1 int, arg2 int) int {
  // body de la fonction
} 
```
On va retrouver les éléments suivants : 
* **func** = mot clé de déclaration de la fonction
* **name** = nom de la fonction
* **(arg1 int, arg2 int)** = paramètres de la fonction : 2 arguments de type `int`
* **int** = type retourné par la fonction 
* **{ // body de la fonction }** = contenu de la fonction (ici on aura probablement un calcul)

Par exemple : 
```Go
func outputText(value string) {
  fmt.Print()
}
``` 
Cette fonction va avoir pour nom `outputText`, prendre en paramètre une valeur de type string et va retourner la valeur dans le terminal.

Exemple : 
```Go
package main

import (
	"fmt"
	"math"
)

const inflationRate float64 = 2.5

func main() {
	var investmentAmount, expectedReturnRate, years float64

	fmt.Print("Enter investment amount : ")
	fmt.Scan(&investmentAmount)
	fmt.Print("Enter expected return rate : ")
	fmt.Scan(&expectedReturnRate)
	fmt.Print("Enter years of investment : ")
	fmt.Scan(&years)
	fmt.Println("Inflation rate : ", inflationRate)

	futureValue, futureRealValue := calculateFutureValues(investmentAmount, expectedReturnRate, years)

	fmt.Print("Future Value : ")
	fmt.Println(futureValue)
	fmt.Print("Future Real Value : ")
	fmt.Println(futureRealValue)
}

func calculateFutureValues(investmentAmount, expectedReturnRate, years float64) (float64, float64) {
	futureValue := investmentAmount * math.Pow(1+expectedReturnRate/100, years)
	futureRealValue := futureValue / math.Pow(1+inflationRate/100, years)
	return futureValue, futureRealValue
}
```
Dans l'exemple ci-dessus, nous avons : 
* une fonction `calculateFutureValues` 
* qui prends `3 arguments de type float64` en paramètres,
* puis procède à deux calculs,
* et retourne deux valeurs de type `float64`.

On appelle cette fonction dans la fonction `main()` et on stocke les valeurs dans deux variables : 
```Go
futureValue, futureRealValue := calculateFutureValues(investmentAmount, expectedReturnRate, years)
```
Voici une alternative pour écrire la fonction `calculateFutureValues` :
```Go
func calculateFutureValues(investmentAmount, expectedReturnRate, years float64) (futureValue float64, futureRealValue float64) {
	futureValue = investmentAmount * math.Pow(1+expectedReturnRate/100, years)
	futureRealValue = futureValue / math.Pow(1+inflationRate/100, years)
	return // ou return futureValue, futureRealValue
}
```
Ici, on spécifie les noms des variables qu'on retourne dans la signature de la fonction : `(futureValue float64, futureRealValue float64)`,  
on assigne à ces variables les calculs qui permettent de leur donner une valeur,  
et enfin un utilise le mot clé `return` pour indiquer que l'exécution de la fonction est terminée.  

## EXERCICE : UPDATE DU CALCULATEUR DE PROFIT AVEC DES FONCTIONS

Objectif :  
Modifier la petite app du premier exercice avec des fonctions. 

Consignes :
* Remplacer ce code par une fonction custom qui affichera du texte, et attends que l'utilisateur entre le contenu et retourne la valeur : 
```Go
fmt.Print("Revenue: ")
fmt.Scan(&revenue)
```
* Créer une ou plusieurs fonctions pour les calculs : 
```Go
earningsBeforeTaxes := revenue - expenses
taxes := earningsBeforeTaxes * (taxRate / 100)
netProfitAfterTaxes := earningsBeforeTaxes - taxes
ratio := expenses / earningsBeforeTaxes * 100
``` 
* BONUS : formater les strings retournées dans le terminal

<details>
<summary style="font-weight:bold">Correction</summary>

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
Output : 
```
go run ./profit-calculator.go 

Revenue: 2500
Expenses: 1300
Tax Rate (in %): 7
Earning Before Taxes: 1200.00
Net Profit After Taxes: 1116.00
Ratio of Expenses to Earnings: 108.33
```
</details>