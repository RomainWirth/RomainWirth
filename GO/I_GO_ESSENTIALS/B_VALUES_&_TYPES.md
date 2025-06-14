# B. VALUES & TYPES

Go est un `langage fortement typé`. C'est à dire que les types de données sont importants.  
Dans un programme en Go, chaque valeur a un type spécifique.  

Il n'est pas possible de procéder à un calcul entre deux valeur de type différent : 
```Go
var investmentAmount int = 1000
var expectedReturnRate float64 = 5.5

var futureValue = investmentAmount * (1 + expectedReturnRate/100) // IMPOSSIBLE : int != float64
```
le langage ne permet pas un tel calcul :  
`invalid operation: investmentAmount * (1 + expectedReturnRate / 100) (mismatched types int and float64)`

un moyen de résoudre ce conflit : convertir la valeur de investmentAmount de **int** à **float64** :
```Go
var futureValue = float64(investmentAmount) * (1 + expectedReturnRate/100)
```

Ou alors de corriger la déclaration de investmentAmount : 
```Go
var investmentAmount float64 = 1000.0
```

__*RAPPEL :*__ 

## 1. TYPES DE BASE

Go propose plusieurs types de base intégrés :  

* `int` = Un nombre entier (**SANS** virgule, ex. : -5, 10, 12, etc.)

* `float64` = Un nombre décimal (**AVEC** virgule, ex. : -5,2, 10,123, 12,9, etc.)

* `string` = Une valeur textuelle (créée avec des guillemets doubles ou des "backticks" : "Hello World", Hi everyone)

* `bool` = valeur booléenne : true ou false (vrai ou faux)

Il existe aussi certains types de base "de niche" intéressants, qu'on n`aura pas souvent besoin d’utiliser :

* `uint` = Un entier non signé : entier strictement positif ou nul (ex. : 0, 10, 255, etc.)

* `int32` = Un entier signé sur 32 bits : un entier ayant une plage spécifique de mémoire allant de -2 147 483 648 à 2 147 483 647 (ex. : -1234567890, 1234567890)

* `rune` = Un alias pour `int32`, il représente un point de code Unicode (caractère unique), utilisé pour manipuler des caractères Unicode (ex. : 'a', 'ñ', '世')

* `uint32` = Un entier non signé sur 32 bits, pouvant prendre des valeurs de 0 à 4 294 967 295

* `int64` => Un entier signé sur 64 bits, ayant une plage de valeurs plus large, allant de -9 223 372 036 854 775 808 à 9 223 372 036 854 775 807


Il existe également d’autres types comme `int8` ou `uint8` qui fonctionnent de la même manière (= entiers avec une plage de valeurs plus petite).

## 2. Valeurs nulles

Tous les types de valeurs de Go possèdent ce qu’on appelle une "valeur nulle".  
Il s'agit de la valeur stockée dans une variable si aucune autre valeur n’est explicitement assignée.

Par exemple, la variable int suivante aurait une valeur par défaut de 0 (car 0 est la valeur nulle de int, int32, etc.) :
```Go
var age int // age vaut 0
```
Voici une liste des valeurs nulles pour les différents types :

* `int` = 0

* `float64` = 0.0

* `string` = "" (une chaîne de caractères vide)

* `bool` = false (faux)


## 3. Déclaration des variables

Voici comment on déclare une variable que l'on assigne immédiatement en Go : 
```Go
var helloWorld string = "Hello world !"
var nombreDecimal float64 = 5.5
```
Il existe une manière alternative et plus **concise** pour déclarer une variable : 
```Go
helloWorld := "Hello world !"
nombreDecimal := 5.5
```
Cette façon de déclarer déduit automatiquement le type de la variable.  
__*Attention : la manière concise ne permet pas de déclarer une variable avec un type explicite.*__

Il est possible de déclarer plusieurs variables en une seule ligne.  
Les variables peuvent être du même type ou de type différent mais leur valeur devra être explicite.
```Go
var nombreUn, nombreDeux float64 = 1000.0, 10 // nombreUn et nombreDeux = type float64
var nombreUn, nombreDeux = 1000.0, 10 // nombreUn = type float64 et nombreDeux = type int

var nombreDecimal, nombreEntier, chaineDeCaracteres = 5.5, 10, "toto"

// ou bien :

nombreUn, nombreDeux := 1000.0, 10.0 // float64 implicite 
nombreUn, nombreDeux := 1000.0, 10 // première variable de type float64 et deuxième variable de type int

nombreDecimal, nombreEntier, chaineDeCaracteres := 5.5, 10, "toto"
```
__*Attention : lorsqu'on spécifie le type lors de la déclaration de plusieurs variables, toutes les variables seront du même type spécifié.*__

Afin de stocker des variables qu'on ne souhaite pas modifier, on utilisera le mot clé `const`.  
La constante est une variable spéciale qui restera donc inchangée tout au long de l'exécution du programme.  
Cette variable spéciale peut être déclarée en dehors du scope de la fonction main() : 
```Go
package main

import (
	"fmt"
	"math"
)

const inflationRate float64 = 2.5

func main() {
	var investmentAmount, expectedReturnRate, years float64
  // ...reste du code
}
```

Il est également possible de déclarer des variables en dehors du scope d'une fonction, mais on ne pourra pas utiliser la déclaration concise `name := "nom"` :
```Go
package main

import (
	"fmt"
	"math"
)

const inflationRate float64 = 2.5
var investmentAmount, expectedReturnRate, years float64

func main() {
  // ...reste du code
}
```
Déclarer ainsi les variables permettra d'y accéder partout dans le fichier, sans avoir à les passer en argument aux fonctions.  
**Cependant, on utilisera cette syntaxe uniquement pour des constantes qui sont globales.**  
Comme dans tout langage de programmation, on va préférer garder les variables dans le scope dans lequel elle vont être utilisées.

#### EXEMPLE : FETCHING USER INPUT DEPUIS LE TERMINAL

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

	futureValue := investmentAmount * math.Pow(1+expectedReturnRate/100, years)
	futureRealValue := futureValue / math.Pow(1+inflationRate/100, years)

	fmt.Print("Future Value : ")
	fmt.Println(futureValue)
	fmt.Print("Future Real Value : ")
	fmt.Println(futureRealValue)
}
```
Explications : 
Dans la fonction main(), 
* on déclare la _constante_ `inflationRate` de type `float64` (nombre décimal signé sur 64 bits), qu'on initialise à 2.5.
* on déclare ensuite les _variables_ `investmentAmount`, `expectedReturnDate` et `years` qui sont également de type `float64` (nombres décimaux signé sur 64 bits).  
* on utilise ensuite les _fonctions_ : 
  - `fmt.Print()` pour indiquer des informations à l'utilisateur dans le terminal  
  - `fmt.Scan()` pour récupérer les datas que l'utilisateur va écrire dans le terminal.
* les _variables_ `futureValue` et `futureRalValue` contiennent les calculs du programme
* les _fonctions_ `fmt.Print()` et `fmt.Println()` permettent d'indiquer les résultats à l'utilisateur.

Output dans le terminal :
```
go run .

Enter investment amount :  2000
Enter expected return rate : 5.5
Enter years of investment : 10
Inflation rate : 2.5
Future Value : 3416.2889167071858
Future Real Value : 2668.799441564969
```

_Les limites de la fonction `fnt.Scan()` :_  
La fonction fmt.Scan() est une excellente fonction pour récupérer et utiliser facilement les entrées de l'utilisateur via le terminal.  
Mais cette fonction a aussi une limitation importante : il n'est pas (facilement) possible de récupérer des valeurs d'entrée composées de plusieurs mots.  
Récupérer un texte qui contient plus d'un mot est délicat avec cette fonction.

## EXERCICE : CRÉER UN CALCULATEUR DE PROFIT

Objectif :  
Créer une petite app qui permet de calculer les profits à partir du revenu, des dépenses et du taux d'imposition de utilisateur. 

Consignes :
* Demander le **revenu**, les **dépenses** et le **taux d'imposition** à l'utilisateur
* Calculer le **revenu avant impôt** et le **revenu après impôts** (profit)
* Calculer le **ratio**

<details>
<summary style="font-weight:bold">Correction</summary>

```Go
package main

import "fmt"

func main() {
	var revenue, expenses, taxRate float64

	fmt.Print("Revenue: ")
	fmt.Scan(&revenue)
	fmt.Print("Expenses: ")
	fmt.Scan(&expenses)
	fmt.Print("Tax Rate (in %): ")
	fmt.Scan(&taxRate)

	earningsBeforeTaxes := revenue - expenses
	taxes := earningsBeforeTaxes * (taxRate / 100)
	netProfitAfterTaxes := earningsBeforeTaxes - taxes
	ratio := expenses / earningsBeforeTaxes * 100

	fmt.Println("Earning Before Taxes: ", earningsBeforeTaxes)
	fmt.Println("Net Profit After Taxes: ", netProfitAfterTaxes)
	fmt.Println("Ratio of Expenses to Earnings: ", ratio)
}
```
Output : 
```
go run ./profit-calculator.go 

Revenue: 2200
Expenses: 1300
Tax Rate (in %): 7
Earning Before Taxes:  900
Net Profit After Taxes:  837
Ratio of Expenses to Earnings:  144.44444444444443
```
</details>

## 4. Formatter de 'strings' avec les fonctions 'fmt.Print...()'

La ligne de code suivant est une manière de formatter une chaîne de caractères : 
```Go
fmt.Println("Earning Before Taxes: ", earningsBeforeTaxes)
```
On ajoute en premier argument de la fonction Println la chaîne de caractère : `"Earning Before Taxes: "`.  

la fonction `fmt.Printf()` permet d'intégrer une variable au milieu d'une chaîne de caractères grâce à `%v` :
```Go
futureValue := 10
futureRealValue := 100

fmt.Printf("Future Value : %v\n", futureValue)
fmt.Printf("Future Value : %v\nFuture Real Value : %v", futureValue, futureRealValue)
```
Output
```
go run .

Future Value : 10
Future Value : 10
Future Real Value : 100
```

## 5. Formatter des floats en strings

On utilisera `%f` avec la fonction fmt.Printf() :
```Go
package main

import (
	"fmt"
	"math"
)

const inflationRate float64 = 2.5

func main() {
	var investmentAmount, expectedReturnRate, years float64

	fmt.Print("Investment Amount : ")
	fmt.Scan(&investmentAmount)
	fmt.Print("Expected Return Rate : ")
	fmt.Scan(&expectedReturnRate)
	fmt.Print("Years : ")
	fmt.Scan(&years)
	fmt.Println("inflation rate : ", inflationRate)

	futureValue := investmentAmount * math.Pow(1+expectedReturnRate/100, years)
	futureRealValue := futureValue / math.Pow(1+inflationRate/100, years)

	fmt.Printf("Future Value : %f\nFuture Real Value : %f\n", futureValue, futureRealValue)
}
```
Output : 
```
go run .

Investment Amount : 2500
Expected Return Rate : 5.5
Years : 15
inflation rate :  2.5
Future Value : 5581.191231
Future Real Value : 3853.620311
```
On remarque ici que le nombre de chiffres après la virgule est plus petit qu'avant.  
Mais on peut aller encore plus loin :  
```Go
fmt.Printf("Future Value : %.0f\nFuture Real Value : %f\n", futureValue, futureRealValue)
```
Output :
```
go run .

Investment Amount : 2500
Expected Return Rate : 5.5
Years : 15
inflation rate :  2.5
Future Value : 5581
Future Real Value : 3853.620311
```
En ajoutant `.0` entre `%` et `f`, la valeur de Future Value ne renvoit plus de chiffres après la virgule.

N.B. : en mettant `.2`, on aura deux chiffres après la virgule.

## 6. Introduction de la fonction fmt.Sprint...()

* fmt.Sprint()
* fmt.Sprintf()
* fmt.Sprintln()

Ces fonctions permettent de créer une nouvelle valeur texte. Ces fonctions retournent une `string`.  
On pourra stocker cette valeur dans une nouvelle variable : 
```Go
	formattedFutureValue := fmt.Sprintf("Future Value : %.2f\n", futureValue)
	formattedRealFutureValue := fmt.Sprintf("Future Real Value : %.2f\n", futureRealValue)

	fmt.Print(formattedFutureValue, formattedRealFutureValue)
```
Output : 
```
go run .

Investment Amount : 2500
Expected Return Rate : 5.5
Years : 15
inflation rate :  2.5
Future Value : 5581.19
Future Real Value : 3853.62
```

## 7. Contruire des strings multiples

Pour cela, on va utiliser les backticks :
```Go
fmt.Printf(`Future Value : %.2f
	Future Real Value : %.2f`, futureValue, futureRealValue)
```
Cette syntaxe va considérer le texte comme au chaîne complète à formater. 

Output : 
```
go run .

Investment Amount : 2500
Expected Return Rate : 5.5
Years : 15
inflation rate :  2.5
Future Value : 5581.19
	Future Real Value : 3853.62
```
les deux dernières lignes ressortent 'bizarrement' dans la console. 

Pour plus de détails, se référer au [package fmt](https://pkg.go.dev/fmt@go1.24.3) de la documentation 'standard library' de Go.