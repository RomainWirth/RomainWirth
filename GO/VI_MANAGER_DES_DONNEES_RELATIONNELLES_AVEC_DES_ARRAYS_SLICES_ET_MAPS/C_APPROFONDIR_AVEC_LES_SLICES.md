# C. APPROFONDIR AVEC LES `SLICES`

## 1. Utilisation des propriétés associées à un tableau : `length` et `capacity`

La **Length** : accessible grâce à la fonction `len(array)`.  
Il s'agit d'une fonction par défaut de Go. Il est également possible d'appeler cette fonction sur d'autre types de données (ex.: `string`).

La **Capacity** : accessible grâce à la fonction `cap(array)`.  
C'est également une fonction par défaut de Go. 

* La length donne le nombre d'éléments d'un tableau ou d'une slice.
* La capacity donne la capacité totale d'un tableau ou d'une slice.

exemple : 
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}
fmt.Printf("length of prices: %v, capacity of prices: %v\n", len(prices), cap(prices))
featuredPrices := prices[1:]

featuredPrices[0] = 199.99
highlightedPrices := featuredPrices[:1]
fmt.Println("Highlighted prices:", highlightedPrices)

fmt.Printf("length : %v, capacity : %v\n",len(highlightedPrices), cap(highlightedPrices))
```
output :
```
go run .

length of prices: 4, capacity of prices: 4
length of featuredPrices: 3, capacity of featuredPrices: 3
Highlighted prices: [199.99]
length of highlighPrices: 1, capacity of highlighPrices: 3
```
* `prices` est un `tableau` de `4 éléments`.
  * sa length est de 4, 
  * tout comme sa capacité.
* `featuredPrices` est une `slice` des `3 derniers éléments de prices`.
  * sa length est de 3, 
  * tout comme sa capacité.
* `highlightedPrices` est une `slice` de la slice `featuredPrices` et contient 1 seul élément.
  * sa length est de 1
  * la capacité est de 3

la length de `highlightedPrices` est bien de 1, mais sa capacité est de 3 :
* length correspond au éléments qui sont présent dans la slice.
* capacity correspond à la capacité possible de la slice : à savoir les éléments qu'ont pourrait sélectionner.
* Pourquoi pas 4 ? (comme le tableau original `prices`), parce que la slice `featuredPrices` omets le premier élément de `prices`, et la capacité ne fonctionne qu'avec les éléments qui sont à la droite du tableau original, et pas avec les éléments à la gauche.  

Pour mieux comprendre, voici un complément à l'exemple ci-dessus :
exemple : 
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}
fmt.Printf("length of prices: %v, capacity of prices: %v\n", len(prices), cap(prices))
featuredPrices := prices[1:]

featuredPrices[0] = 199.99
highlightedPrices := featuredPrices[:1]
fmt.Println("Highlighted prices:", highlightedPrices)
fmt.Printf("length : %v, capacity : %v\n",len(highlightedPrices), cap(highlightedPrices))

highlightedPrices = highlightedPrices[:3]
fmt.Println("Highlighted prices after resizing:", highlightedPrices)
fmt.Printf("length of highlighPrices after resizing: %v, capacity of highlighPrices after resizing: %v\n", len(highlightedPrices), cap(highlightedPrices))
```
output :
```
go run .

length of prices: 4, capacity of prices: 4
length of featuredPrices: 3, capacity of featuredPrices: 3

Highlighted prices: [199.99]
length of highlighPrices: 1, capacity of highlighPrices: 3

Highlighted prices after resizing: [199.99 30.75 40]
length of highlighPrices after resizing: 3, capacity of highlighPrices after resizing: 3
```
La slice `highlightedPrices` a été modifiée à partir d'elle même.  
Mais on peut toujours modifier avec plus d'éléments vers la fin de la slice.  
En revanche, on ne pourra jamais modifier pour accéder à la première valeur du tableau original.

## 2. Créer des listes dynamiques avec des `slices`

Les tableaux en Go sont restrictifs : lorsqu'on déclare un tableau, on spécifie sa taille.  
RAPPEL : `var array [N]type = [N]type{value1, value2, valueN}`  

Hors, lorsqu'on travaille avec une base de données qui est dynamique et dont les données sont modifiées en permanence,  
cette restriction peut être problématique. 

Une solution pour remédier à cette restriction est la `slice`. 

En déclarant un tableau de cette manière : 
```Go
package main

import "fmt"

func main() {
	prices := []float64{}
}
```
Go va créer un tableau vide, et automatiquement une `slice` de ce tableau, puis, le tableau étant vide, il sera supprimé de l'espace mémoire de l'ordinateur.  
Seule la `slice` sera accessible.  

__Déclarer un `tableau vide` est en fait une déclaration de `slice`.__

Un nouveau tableau sera créé si on modifie la `slice` et que cette `slice` grandit au delà des capacité du tableau.  

On pourra travailler sur ce tableau de cette manière :
```Go
package main

import "fmt"

func main() {
	prices := []float64{10.99, 8.99}
	fmt.Println("Prices:", prices[0:1])
	prices[1] = 9.99
	prices[2] = 12.99 // This will cause a runtime error because the slice does not have enough capacity
}
```
* On assigne des valeurs à `prices`,
* on sélectionne une `slice` qui contient le premier de `prices`,
* on modifie la valeur à l'index 1 de `prices`,
* on ne peut par contre pas ajouter de valeur à prices de cette manière :
  * cela crée une `runtime error`
  * `prices[2]` est `out of range`

Pour modifier un tableau, on va utiliser une fonction de Go : `append()`.  
`append()` prends en paramètre :
* une `slice`
* une `liste d'éléments` à ajouter à cette slice
```Go
func main() {
	prices := []float64{10.99, 8.99}
	fmt.Println("Prices:", prices[0:1])
	prices[1] = 9.99

	updatedPrices := append(prices, 5.99)
	fmt.Println("Updated prices:", updatedPrices)
}
```
output : 
```
go run .

Prices: [10.99]
Updated prices: [10.99 9.99 5.99]
```
avec la fonction `append()`, go va retourner une nouvelle `slice`.  
Finalement, Go va créer un nouveau tableau basé sur le premier et augmenter sa capacité du nombre d'éléments passés à la fonction `append()`.

Pour modifier le tableau original, on va réassigner la nouvelle slice à la variable tableau existante.  
Ainsi, l'ancienne valeur de la variable tableau sera écrasée et remplacée par la nouvelle : 
```Go
func main() {
	prices := []float64{10.99, 8.99}
	fmt.Println("Prices:", prices[0:1])
	prices[1] = 9.99

	prices = append(prices, 5.99)
	fmt.Println("Updated prices:", prices)
}
```
output : 
```
go run .

Prices: [10.99]
Updated prices: [10.99 9.99 5.99]
```
`prices` sera maintenant un tableau de 3 éléments.  
Le management de la mémoire est pris en charge automatiquement par Go.

Cette approche est préférable dans l'écriture d'un programme en Go puisqu'on ne connaît en général pas la taille finale d'un tableau d'éléments.

Pour supprimer un élément d'un tableau, on va réassigner une slice du tableau au tableau actuel :  
`prices = prices[1:]` (on supprime le premier élément du tableau).  
Il n'existe pas de fonction pour faire cela. 

## Exercice : Problem

* Créer un nouveau dossier `array-slices`.
* ajouter un fichier `practice.go` et ajouter ce code dedans : 
```Go
package main

func main() {
  // Time to practice what you learned!

  // 1) Create a new array (!) that contains three hobbies you have
  // 		Output (print) that array in the command line.
  // 2) Also output more data about that array:
  //		- The first element (standalone)
  //		- The second and third element combined as a new list
  // 3) Create a slice based on the first element that contains
  //		the first and second elements.
  //		Create that slice in two different ways (i.e. create two slices in the end)
  // 4) Re-slice the slice from (3) and change it to contain the second
  //		and last element of the original array.
  // 5) Create a "dynamic array" that contains your course goals (at least 2 goals)
  // 6) Set the second goal to a different one AND then add a third goal to that existing dynamic array
  // 7) Bonus: Create a "Product" struct with title, id, price and create a
  //		dynamic list of products (at least 2 products).
  //		Then add a third product to the existing list of products.
}
```
* lancer les commandes `go mod init example.com/array-slices` puis `go build`
* Suivre les instructions en commentaires du fichier 
* contrôler le résultat dans le terminal avec la commande `go run .`

<details>
<summary style="font-weight:bold">Correction</summary>

```Go
package main

import "fmt"

func main() {
	// 1) Create a new array that contains three hobbies you have
	var hobbies = [3]string{"Reading", "Cycling", "Cooking"}
	// Output the entire array
	fmt.Println("Hobbies:", hobbies) // Hobbies: [Reading Cycling Cooking]

	// 2) Output more data about that array:
	// Output the first element
	fmt.Println(hobbies[0]) // Reading
	// Output the second and third element combined as a new list
	fmt.Println("Second and Third Hobbies:", hobbies[1:3]) // Second and Third Hobbies: [Cycling Cooking]

	// 3) Create a slice based on the first element that contains
	//		the first and second elements.
	//		Create that slice in two different ways (i.e. create two slices in the end)
	hobbiesSlice1 := hobbies[0:2]
	hobbiesSlice2 := hobbies[:2]
	fmt.Println("Hobbies Slice 1:", hobbiesSlice1) // Hobbies Slice 1: [Reading Cycling
	fmt.Println("Hobbies Slice 2:", hobbiesSlice2) // Hobbies Slice 2: [Reading Cycling]

	// 4) Re-slice the slice from (3) to contain the second and last element
	hobbiesSlice1 = hobbiesSlice1[1:3]
	fmt.Println("Re-sliced Hobbies Slice 1:", hobbiesSlice1) // Re-sliced Hobbies Slice 1: [Cycling Cooking]

	// 5) Create a "dynamic array" that contains your course goals
	courseGoals := []string{"Learn Go", "Build a web app"}

	// 6) Set the second goal to a different one AND then add a third goal
	courseGoals[1] = "Master Go"
	fmt.Println("Updated Course Goals:", courseGoals) // Updated Course Goals: [Learn Go Master Go]
	courseGoals = append(courseGoals, "Contribute to open source")
	fmt.Println("Course Goals:", courseGoals) // Course Goals: [Learn Go Master Go Contribute to open source]

	// 7) Bonus: Create a "Product" struct and a dynamic list of products
	products := []Product{
		{Title: "Laptop", ID: 1, Price: 999.99},
		{Title: "Smartphone", ID: 2, Price: 499.99},
	}
	// Add a third product to the existing list of products
	products = append(products, Product{Title: "Tablet", ID: 3, Price: 299.99})
	fmt.Println("Products:", products) // Products: [{Laptop 1 999.99} {Smartphone 2 499.99} {Tablet 3 299.99}]
}

type Product struct {
	Title string
	ID    int
	Price float64
}
```
Output dans le terminal : 
```
go run .

Hobbies: [Reading Cycling Cooking]
Reading
Second and Third Hobbies: [Cycling Cooking]
Hobbies Slice 1: [Reading Cycling]
Hobbies Slice 2: [Reading Cycling]
Re-sliced Hobbies Slice 1: [Cycling Cooking]
Updated Course Goals: [Learn Go Master Go]
Course Goals: [Learn Go Master Go Contribute to open source]
Products: [{Laptop 1 999.99} {Smartphone 2 499.99} {Tablet 3 299.99}]
```
</details>

## 3. Déballer les valeurs d'une liste

La fonction `append()` permet d'ajouter autant de valeurs que l'on souhaite à une liste (array, slice).  

Parfois, on travaille avec une `slice` et on souhaite lui ajouter une autre `slice`.  
L'idée est donc de regrouper deux slices ensemble. On peut utiliser pour cela la fonction `append()`.  

On ne pourra pas simplement `append()` la seconde slice à la première.  
La fonction `append()` prends en paramètres le nom de la slice, suivi des valeurs à ajouter séparées par des virgules :  
`slice = append(slice, value1, value2, valueN)`  
On ne va pas pouvoir mettre une slice à la place d'une valeur : `slice1 = append(slice1, slice2)`  
Go retournera une erreur de syntaxe et on ne pourra pas exécuter le code.

Pour cela, on va utiliser une certaine syntaxe, une sorte de `spread operator` : `...`
```Go
prices := []float64{10.99, 8.99}

prices = append(prices, 5.99, 12.99, 29.99, 100.10)

discountPrices := []float64(4.99, 3.99, 1.99)

prices = append(prices, discountPrices...)
```
Cette syntaxe indique qu'on récupère tous les éléments d'une liste pour les ajouter à une autre liste.  
On peut utiliser les `...` à chaque fois qu'on souhaite récupérer les éléments d'une liste séparéments sans avoir à les spécifier.  