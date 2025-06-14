# B. INTRODUCTION AUX FONCTIONS `ANONYMES`

Qu'est-ce qu'une fonction anomyme ? 

En programmation, de manière générale, lorsqu'on a une fonction qui a besoin d'une autre fonction en paramètre,  
ou une fonction qui retourne une autre fonction, on peut gagner du temps et des efforts en utilisant des fonctions anonymes.

Une fonction anonyme est une fonction qui n'a pas de nom.  
Elle est utilisée pour des besoins ponctuels, de la même manière qu'une callback,  
ou pour encapsuler une logique temporaire sans polluer l'espace de noms du programme.

Dans notre exemple ci-dessus, on avait créé deux fonctions `double` et `triple` à l'avance.  
Mais la fonction `transformNumbers()` peut ne pas se résumer à doubler ou tripler les nombres d'un tableau d'entiers.  
Dans ce cas, on fera appel aux fonctions anonymes qui seront utilisées dans l'instant : 
```Go
transformed := transformNumbers(&numbers, func(number int) int { return number * 2 })
```
* Le deuxième paramètre de la fonction `transformNumbers()` est une fonction anonyme qui retourne un nombre multiplié par 2.  
* Il ne s'agit pas d'un type de fonction, parce qu'on l'écrit à l'endroit ou une fonction est attendue.
* Il s'agit bien d'une fonction anonyme puisqu'elle n'a pas de nom.

Il y a une restriction :  
le type de la fonction anonyme doit bien correspondre au type de la fonction attendue en paramètre de la fonction dans laquelle elle est passée en paramètre.

Cette syntaxe est pratique puisqu'elle permet d'avoir directement les informations quand à ce que fait la fonction passée en paramètre, sans avoir à chercher ailleurs dans le code.

On va préférer une fonction anonyme dans les cas ou on a pas besoin de réutiliser la logique de cette fonction.  
Autrement, il est préférable d'écrire une fonction nommée afin de la réutiliser partout ou on en a besoin.

#### Comprendre les fermetures (`closures`)

Les `closures` utilisent également des fonctions anonymes pour un aspect spécifique.  

Prenons un cas ou nous souhaitons créer une fonction qui crée des fonctions : 
```Go
func createTranformer(factor int) func(int) int {
  return func(number int) int {
    return number * factor
  }
}
```
`createTranformer()` est une fonction qui crée des fonctions avec différents paramètres : 
* `createTranformer()` prends en paramètre 
  * `factor`, un entier `int` 
  * et retourne une fonction anonyme qui prend en paramètre un entier `int` et retourne un entier `int`  
  son rôle est donc de fabriquer une fonction anonyme.
* `return func(number int) int` : la fonction retournée prend bien un number `int` en paramètre et retourne un `int`
  * elle procède à l'opération arithmétique `number` multiplié par `factor`.  

Cela signifie qu'on peut maintenant créer des fonctions à la volée grâce à cette usine à fonction : 
```Go
double := createTransformer(2)
triple := createTransformer(3)
```
Ces deux fonctions auront le même effet que les deux fonctions `double` et `triple` créées auparavant.  
On aura en revanche un code plus concis qu'avant.  
L'avantage est qu'on pourra créer autant de fonctions similaires qu'on le souhaite.

Exemple complet : 
```Go
package main

import "fmt"

func main() {
	numbers := []int{1, 2, 3}

	transformed := transformNumbers(&numbers, func(number int) int { return number * 2 })
	fmt.Println(transformed)

	double := createTransformer(2)
	triple := createTransformer(3)

	doubled := transformNumbers(&numbers, double)
	fmt.Println("Doubled numbers:", doubled)

	tripled := transformNumbers(&numbers, triple)
	fmt.Println("Tripled numbers:", tripled)
}

func transformNumbers(numbers *[]int, transform func(int) int) []int {
	dNumbers := []int{}

	for _, val := range *numbers {
		dNumbers = append(dNumbers, transform(val))
	}

	return dNumbers
}

func createTransformer(factor int) func(int) int {
	return func(number int) int {
		return number * factor
	}
}
```
