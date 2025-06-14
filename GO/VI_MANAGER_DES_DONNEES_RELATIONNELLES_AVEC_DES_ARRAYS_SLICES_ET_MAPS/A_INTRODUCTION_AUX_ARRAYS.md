# A. INTRODUCTION AUX `ARRAYS`

Retour sur les `struct`: un struct est type complexe. Il s'agit d'un mécanisme de groupement des données.  
On peut y regrouper différent types de données en une seule.  

Dans certains cas, on peut avoir des données similaires qui ont besoin d'être regroupées.  
Lorsqu'on souhaite décrire les même choses mais avec des valeurs différentes, Go intègre un différent type de structure de données : `array`(le tableau).  
_Dans d'autres langages, ce peut être un nom différent : Python = list, JavaScript = array_

Un tableau est une structure de données qui contient des valeurs, potentiellement différentes, qui décrivent la même chose.

## 1. Déclarer un tableau 

Pour déclarer un tableau, on va procéder ainsi : `variable := [n]type{value1, value2, value3, value4, valueN}`.  
* `variable` : nom de la variable de type `array`
* `[n]` : on aura un tableau d'une longueur de n éléments 
* `type` : indique le type de données contenues dans le tableau (`int`, `float64`, ..., et `struct`)
* `{value1, value2, value3, value4, valueN}` : données stockées dans le tableau

Exemple : 
```Go
func main() {
  prices := [4]float64{10.5, 20.0, 30.75, 40.0}
}
```
la variable `prices` contient un `tableau` de `float64` d'une longueur de `4 éléments`, dont les valeurs sont spécifiées entre les accolades.

La `différence` fondamentale avec un `struct` est que toutes les valeurs du `tableau` décrivent le `même type de données`. 

## 2. Travailler avec un tableau

On peut également déclarer un tableau de cette manière : `var name [N]type`  
(ici, un tableau de `N` `type` appelé `name` a été déclaré).

```Go
package main

import "fmt"

func main() {
	var productNames [4]string
	fmt.Println("Product names:", productNames)
}
```
Output :
```
go run .

Product names: [   ]
```
* Le tableau `productNames` de `4 strings` a été déclaré.
* Comme aucune valeur n'a été assignée, les valeurs sont nulles : on a donc un tableau de `strings` vides.

Il est possible d'ajouter une valeur au tableau : 
```Go
package main

import "fmt"

func main() {
	var productNames [4]string
  productNames = [4]string{"Livre"}

  // ou : 
  var productNames [4]string = [4]string{"Livre"}

	fmt.Println("Product names:", productNames)
}
```
Output :
```
go run .

Product names: [Livre   ]
```
Ici, uniquement la première valeur a été assignée au tableau.  

Pour accéder à un élément en particulier, on va utiliser cette syntaxe : `name[index]`
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}
fmt.Println("Prices:", prices)

fmt.Println(prices[2])
```
output :
```
go run .

Prices: [10.5 20 30.75 40]
30.75
```
_C'est similaire à ce qui existe dans d'autres langages de programmation._

De la même manière, on peut ajouter ou modifier des datas à l'index souhaité : 
```Go
var productNames [4]string = [4]string{"Livre"}

productNames[2] = "Jeu vidéo"

fmt.Println("Product names:", productNames)
```
output : 
```
go run .

Product names: [Livre  Jeu vidéo ]
```
le résultat sera un tableau avec le premier élément `"livre"`, le second et le dernier sont vide, et le troisième `"Jeu vidéo"`.