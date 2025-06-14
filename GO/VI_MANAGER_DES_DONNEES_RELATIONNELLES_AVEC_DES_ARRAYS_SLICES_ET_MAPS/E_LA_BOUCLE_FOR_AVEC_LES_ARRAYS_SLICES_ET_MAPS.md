# E. LA BOUCLE `FOR` AVEC LES `ARRAYS`, `SLICES` ET `MAP`

Dans le cas d'une `slice`, la boucle for aura cette syntaxe : `for index, value := range arrayName {...}`  
* `for` : mot clé pour initialiser une boucle
* `index` : mot clé pour l'index des éléments de la slice
* `value` : mot clé pour la valeur des éléments de la slice
* `range` : signifie qu'on va itérer sur chaque élément de la slice
* `arrayName` : nom de la slice sur lequel on va itérer.

exemple :
```Go
userNames := make([]string, 2, 5)

userNames[0] = "Julie"
userNames = append(userNames, "John")
userNames = append(userNames, "Doe")

for index, value := range userNames {
  fmt.Println("index:", index, "value:", value)
}
```
output :
```
go run .

index: 0 value: Julie
index: 1 value: 
index: 2 value: John
index: 3 value: Doe
```
* Le tableau `userNames` fait une taille de `2 éléments` et a une capacité de `5 éléments`.
* On a `4 itérations` sur la boucle.
* Chaque itération affiche l'`index` et la `valeur` de chaque élément du tableau.
* à l'`index 0` : Julie.
* `index 1` : aucune valeur car aucune valeur n'a été assignée.
* `index 2 et 3` : les valeurs John et Doe.
* `index 4` : non affiché car non exploité.

N.B.: 
* `index` et `value` peuvent être remplacés par n'importe quel nom de variable, `i` et `val` par exemple.
* Si on a besoin ni de l'index ni de la valeur, mais simplement itérer un nombre de fois égale à la taille du tableau,  
on peut déclarer la boucle for ainsi : `for range arrayName {...}`

La boucle for fonctionne de la même manière sur un tableau ou encore sur une map.  
Dans le cas d'une map, on utilisera le mot `key` au lieu de l'index  
puisqu'on a une paire clé/valeur dans ce type de données : `for key, value := range mapName {...}`.

exemple : 
```Go
package main

import "fmt"

type floatMap map[string]float64

func main() {
  floatNumbers := make(floatMap, 3)

  floatNumbers["pi"] = 3.14
	floatNumbers["e"] = 2.71
	floatNumbers["phi"] = 1.618

	for key, value := range floatNumbers {
		fmt.Println("key:", key, "value:", value)
	}
}
```
output :
```
go run .

key: pi value: 3.14
key: e value: 2.71
key: phi value: 1.618
```