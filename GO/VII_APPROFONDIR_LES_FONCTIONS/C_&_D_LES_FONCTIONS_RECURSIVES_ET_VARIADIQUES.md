# C. LES FONCTIONS `RÉCURSIVES`

Une fonction est `récursive` lorsqu'elle s'appelle elle-même.  
Un bon exemple pour démontrer ceci est une fonction factorielle :  
`factorial of 5 => 5 * 4 * 3 * 2 * 1 = 120`

Une façon simple d'écrire cette fonction est la suivante : 
```Go
package main

import "fmt"

func main() {
	fact := factorial(5)

	fmt.Println("Factorial of 5 is:", fact)
}

func factorial(number int) int {
	result := 1
	for i := 1; i <= number; i++ {
		result = result * i
	}

	return result
}
```
Mais cette fonction n'utilise pas la récursivité.  
Pour ce faire, la fonction `factorial` va s'appeler elle même :
```Go
func factorial(number int) int {
  if number == 0 {
    return 1
  }
  return number * factorial(number - 1)
}
```
Voici son fonctionnement :  
En appelant la fonction `factorial` et en lui passant le chiffre `5` en paramètre,  
* on vérifie que le nombre n'est pas égal à 0. Comme ce n'est pas le cas,  
* on retourne le nombre, multiplié par le résultat de la fonction factorial de lui-même moins 1 (soit 4).
* avant de retourner le résultat final de la fonction principale, on va attendre le résultat de la fonction appelée à l'intérieur. 
* Etant donné que la fonction s'appelle elle-même, il va falloir attendre que le résultat soit différent de celui retourné par `return number * factorial(number - 1)`, soit le résultat `return 1`.

Ainsi, le procédé est le suivant :  
factorial(5) => `return 120`  
| factorial(4) => return 24  
| | factorial(3) => return 6  
| | | factorial(2) => return 2  
| | | | factorial(1) => return 1  
| | | | | factorial(0) => return 1   

output : 
```
go run .

Factorial of 5 is: 120
```

# D. UTILISER DES FONCTIONS `VARIADIQUES`

Une fonction variadique est une fonction qui peut accepter un nombre variable d'arguments du même type.  
Cela signifie qu'on peut appeler la fonction avec autant de paramètres qu'on le souhaite (de 0 à N) pour cet argument.  

Prenons l'exemple suivant : 
```Go
package main

import "fmt"

func main() {
	numbers := []int{1, 2, 3, 4, 5}
	total := sumup(numbers)

	fmt.Println("Total sum:", total)
}

func sumup(numbers []int) int {
	sum := 0
	for _, number := range numbers {
		sum += number
	}
	return sum
}
```
Ici, la fonction `sumup()` va retourner la somme des éléments du tableau passé en paramètres.

Dans certains cas, on ne possède pas de `slice` à passer en paramètres ou alors on ne sait pas à l'avance ce qu'on va passer en paramètre d'une fonction.  

C'est dans ce cas qu'on pourra utiliser des fonctions variadiques. 

Pour déclarer une telle fonction, on va utiliser cette syntaxe : `func name(variable ...type) type {...}`
* on déclare une fonction `name`
* qui prends en paramètre `variable`, et on utilise le spread operator avant le type souhaité : `...type`
* la fonction retournera comme d'habiture un `type` de variable.

Exemple : 
```Go
package main

import "fmt"

func main() {
	total := sumup(1, 2, 3, 4, 5)

	fmt.Println("Total sum:", total)
}

func sumup(numbers ...int) int {
	sum := 0
	for _, number := range numbers {
		sum += number
	}
	return sum
}
```
* la fonction `sumup()` prends un nombre indéfini de variables `numbers` de type `int`
* elle retourne une valeur de type `int`

Il est possible de passer d'autres paramètres en complément : 
```Go
func sumup(startingValue int, numbers ...int) int {
	sum := 0
	for _, number := range numbers {
		sum += number
	}
	return sum
}
```
* ici, la première valeur passée en paramètre lors de l'appel de la fonction `sumup()` correspondra à `startingValue`.

__ATTENTION : une fonction ne peut avoir qu'`un seul paramètre variadique` et celui ci doit se placer en dernier dans la liste des paramètres de la fonction.__

## Séparer des `slices` en valeurs de paramètres

Dans notre exemple, il n'est plus possible d'utiliser une slice pour la passer en paramètre lors de l'appel de la fonction variadique.  

Afin de passer la slice, on va utiliser l'inverse du spread operator de cette manière : 
```Go
package main

import "fmt"

func main() {
	slice := []int{1, 2, 3, 4, 5}

	sliceTotal := sumup(slice...)
	fmt.Println("Total sum of slice:", sliceTotal)
}

func sumup(numbers ...int) int {
	sum := 0
	for _, number := range numbers {
		sum += number
	}
	return sum
}
```
* `sliceTotal := sumup(slice...)` : on va `spread` la variable `slice` passée en paramètre dans l'appel de la fonction `sumup()`.

Les trois points (spread operator) peuvent être très utiles pour rendre les fonctions plus dynamiques et flexibles.  
On peut les utiliser : 
* soit lorsqu'on définit une fonction dans la liste des paramètres 
* soit lorsqu'on souhaite séparer les variables d'une slice afin de les utiliser lors d'un appel de fonction variadique.