# A. LES FONCTIONS EN TANT QUE `VALEURS` ET LES `TYPES DE FONCTIONS`

Les fonctions en Go sont des valeurs de première classe.  

RAPPEL : Une fonction est un bloc de code qu'on peut exécuter à la demande et qui peut nous renvoyer des valeurs.

Une fonction peut elle-même être une valeur de paramètre pour d'autres fonctions. 

## 1. Passer une fonction en paramètre d'une autre fonction

Prenons le code ci-dessous : 
```Go
package main

import "fmt"

func main() {
	numbers := []int{1, 2, 3, 4, 5}
	doubled := doubleNumbers(&numbers)

	fmt.Println("Original numbers:", numbers)
	fmt.Println("Doubled numbers:", doubled)
}

func doubleNumbers(numbers *[]int) []int {
	dNumbers := []int{}
	for _, num := range *numbers {
		dNumbers = append(dNumbers, double)
	}

	return dNumbers
}

func double(number int) int {
	return number * 2
}
```
output : 
```
go run .

Original numbers: [1 2 3 4 5]
Doubled numbers: [2 4 6 8 10]
```
On peut oberver que `doubleNumbers()` fait appel à la fonction `double()`.  
Imaginons qu'on ait également une fonction `triple()` :
```Go
func triple(number int) int {
	return number * 3
}
```
Afin de généraliser la fonction `doubleNumbers()` et qu'elle puisse opérer n'importe quelle action sur un nombre entier, on va lui passer en paramètre une fonction générique.  
Pour cela, on va déjà modifier son nom pour qu'il corresponde plus à la réalité de ce qu'elle fait : `transformNumbers()`.  
Puis on va la réécrire de cette manière : 
```Go
func transformNumbers(numbers *[]int, transform func(int) int) []int {
	dNumbers := []int{}
	for _, num := range *numbers {
		dNumbers = append(dNumbers, transform(num))
	}

	return dNumbers
}
```
* `transformNumbers()` prends maintenant 2 paramètres : 
  * `numbers *[]int` : une référence à un tableau de nombres entiers `int`
  * `transform func(int) int` : une fonction générique appelée transform qui doit prendre en paramètre un entier `int` et retourner un entier `int`.
* `transformNumbers()` retournera comme avant un tableau d'entiers. 

Ainsi, lorsqu'on appelle cette fonction, on peut lui passer notre référence au tableau de nombres  
et n'importe quelle fonction qui correspond à la fonction générique passée en paramètres. 

Exemple :
```Go
func main() {
	numbers := []int{1, 2, 3, 4, 5}
	fmt.Println("Original numbers:", numbers)

	doubled := transformNumbers(&numbers, double)
	fmt.Println("Doubled numbers:", doubled)

	tripled := transformNumbers(&numbers, triple)
	fmt.Println("Tripled numbers:", tripled)
}
```
output : 
```
go run .

Original numbers: [1 2 3 4 5]
Doubled numbers: [2 4 6 8 10]
Tripled numbers: [3 6 9 12 15]
```
* lors de l'appel de `transformNumbers()` : 
  * on passe la référence au tableau `numbers`
  * on passe la fonction `double` puis `triple` directement (sans l'exécuter)

Une telle syntaxe permet de réduire les lignes de code et d'avoir un code plus concis.

## 2. Les types de fonctions

Il est possible de stocker des types de fonctions dans des types customs : 
```Go
type transformFn func(int) int

func transformNumbers(numbers *[]int, transform transformFn) []int {
	// ...
}
```
Cette syntaxe aura le même effet que le code précédent mais sera plus lisible.  

Ceci peut être particulièrement efficace en cas de type de fonction plus complexe : 
```Go
type anotheFn func(int, []string, map[string][]int) ([]int, string)
```
* La fonction prends 3 paramètres : `int`, `[]string`, `map[string][]int`.
* Elle retourne `[]int` et `string`.

Pour simplifier la déclaration lorsqu'on déclare la fonction qui prendra cette fonction en paramètre, utiliser un alias peut être plus efficace.

## 3. Retourner une fonction en tant que `valeur`

Il est parfois souhaitable de retourner une fonction lors de l'exécution d'une autre fonction.  
Imaginons, dans notre exemple, qu'on souhaite utiliser soit la fonction `double`, soit `triple` selon le nommbre du tableau numbers :
```Go
func getTransformFunction(numbers *[]int) transformFn {
	if (*numbers)[0] == 1 {
		return double
	} else {
		return triple
	}
}
```
Lors de l'appel de cette fonction : 
```Go
type transformFn func(int) int

func main() {
	numbers := []int{1, 2, 3, 4, 5}
	fmt.Println("Original numbers:", numbers)
	moreNumbers := []int{6, 7, 8, 9, 10}
	fmt.Println("More numbers:", moreNumbers)

	transformerFn1 := getTransformFunction(&numbers)
	transformerFn2 := getTransformFunction(&moreNumbers)

	transformedNumbers := transformNumbers(&numbers, transformerFn1)
	fmt.Println("Transformed numbers with function 1:", transformedNumbers)

	transformedMoreNumbers := transformNumbers(&moreNumbers, transformerFn2)
	fmt.Println("Transformed numbers with function 2:", transformedMoreNumbers)
}
```
* `transformerFn1` et `transformerFn2` deviennent des fonctions de type `transformFn`
* On peut passer ces fonctions lors de l'appel de `transformNumbers()` à la place de `double` et `triple`

output : 
```
go run .

Original numbers: [1 2 3 4 5]
More numbers: [6 7 8 9 10]

Transformed numbers with function 1: [2 4 6 8 10]
Transformed numbers with function 2: [18 21 24 27 30]
```
Le code ci-dessus est loin de refléter un use case,  
il permet simplement de mettre en lumière les possibilités pour des fonctions en tant que `valeurs` ou `type`.