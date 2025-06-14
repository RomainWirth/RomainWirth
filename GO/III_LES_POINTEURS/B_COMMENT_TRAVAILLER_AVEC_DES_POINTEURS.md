# B. COMMENT TRAVAILLER AVEC DES POINTEURS ? 

```Go
package main

import "fmt"

func main() {
	age := 32 // = variable régulière. 

  fmt.Println("Age:", age)
	fmt.Println(getAdultYears(age))
}

func getAdultYears(age int) int {
	return age - 18
}
```
Output : 
```
go run .

Age: 32
14
```

Le code ci-dessus est standard :  
On a une fonction `getAdultYears()` à laquelle on passe une variable de type `int` et qui retourne une valeur de type `int`.  

Dans notre cas, nous avons une copie de la valeur age qui est créée.  
Cela signifie que la valeur de age reçue en argument de la fonction ne sera techniquement pas la même que celle de la variable `age`.  
Ce sera une copie de ce nombre. La valeur sera identique, mais stockée à un endroit différent.  
Cela implique que **le nombre 32 sera stocké deux fois**.

Une fois la fonction exécutée, le garbage collector va passer par là et nettoyger la mémoire en supprimant la deuxième variable.

## 1. Création d'un pointeur : 

```Go
age := 32

var userAge *int // variable est un pointeur de type int
userAge = &age // userAge is a pointer to age

// écriture simplifiée et préférable : 
userAge := &age // variable est de type *int implicitement 
```
le type `*int` indique qu'on est en train de travailler avec un pointeur.  
Cette syntaxe existe pour tous les types (string, boolean, etc.) : `*type`.  

## 2. Pointeur en tant que valeur :

```Go
package main

import "fmt"

func main() {
	age := 32

	userAge := &age // userAge is a pointer to age

	fmt.Println("Age:", userAge) // get the memory adress of the value 
}
```
Output : 
```
go run .

Age: 0xc000012110
```
Dans l'output, on va recevoir non pas la valeur, mais l'adresse de la valeur.

Cela signifie que si on passe la valeur de `useAge` à une fonction,  
on lui passera l'adresse mémoire de la valeur de la variable `age`.  
On va donc éviter de copier la valeur et la dupliquer en mémoire.  

Si on a besoin de la valeur qui est stockée à cette adresse directement, on va devoir faire un `déréférencement`: on va devoir ajouter une astérisque devant le pointeur
```Go
package main

import "fmt"

func main() {
	age := 32

	userAge := &age // userAge is a pointer to age

	fmt.Println("Age:", *userAge) // Dereferencing the pointer to get the value 
}
```
On va donc : 
* utiliser l'esperluette `&` devant une variable pour récupérer l'adresse d'un pointeur.
* utiliser l'astérisque `*` pour faire le contraire : pour récupérer la valeur derrière le pointeur. 

Output : 
```
go run .

Age: 32
```

Chaque valeur en Go a une `valeur nulle` : il s'agit de la valeur par défaut assignée à une variable.  
Par exemple : 
* valeur `null` d'un `int` => `0`
* valeur `null` d'un `float64` => `0.0`
* valeur `null` d'une `string` => `""`

Pour un pointeur : `nil` = une valeur spéciale de Go. 

**`nil` représente l'absence d'une valeur/adresse.** 

## 3. Utiliser des pointeurs et passer des pointeurs en paramètre de fonctions : 

Pour pouvoir travailler avec un pointeur passé en paramètre d'une fonction, il est nécessaire de le 'déférencer' :
```Go
func getAdultYears(age *int) int {
	return *age - 18
}
```
* On va recevoir un paramètre l'adresse
* On va ensuite utiliser la valeur stockée à cette adresse
* puis déduire 18 à la valeur et renvoyer cette nouvelle valeur

Sur un code complet, on va avoir ceci : 
```Go
package main

import "fmt"

func main() {
	age := 32

	userAge := &age // userAge is a pointer to age

	fmt.Println("Age:", *userAge) // Dereferencing the pointer to get the value of age
	
	fmt.Println(getAdultYears(userAge))
}

func getAdultYears(age *int) int {
	return *age - 18
}
```

Output : 
```
go run .

Age: 32
14
```
On va avoir le même résultat qu'avec du code standard, mais cette fois avec des pointeurs.  
La différence important est que maintenant, on a plus de copie créée de la valeur 32 :  
* On crée la valeur une fois, on la stocke une fois un mémoire, 
* puis on utilise un pointeur pour récupérer son adresse, on ne copie pas la valeur
* On passe ce pointeur à la fonction (qui prend en paramètre un pointeur)
* On stocke le résultat dans une nouvelle variable

ATTENTION, il faut bien prendre conscience que ceci est réellement utile pour des cas de grandes valeurs ou d'objets complexes.  
L'exemple ci-dessus est simplement ici pour mettre en lumnière le fonctionnement des pointeurs.

## 4. Utiliser des pointeurs pour muter des valeurs 

Analysons le code ci-dessous :
```Go
package main

import "fmt"

func main() {
	ageOne := 32
	fmt.Println("age : ", ageOne)

	userAge := &ageOne // userAge is a pointer to age

	fmt.Println("Age (pointer):", *userAge) // Dereferencing the pointer to get the value of age
	editAgeToAdultYears(userAge)
	fmt.Println("age : ", ageOne)
}

func editAgeToAdultYears(ageTwo *int) int {
	*ageTwo = *ageTwo - 18
	return *ageTwo
}
```

* La variable `ageOne` initialisée à 32. Elle est donc de type `int`.
* `userAge` est un pointeur vers la variable `ageOne`. useAge contient donc l'adresse mémoire de age.
* la fonction `editAgeToAdultYears()` prends en paramètre une variable `ageTwo`, qui est un pointeur de type `int` et retournera une valeur de type `int`.
* dans la fonction `editAgeToAdultYears()` : 
  * on va opérer une modification de la variable `ageTwo` en soustrayant 18 à la valeur de `ageTwo` (grâce au **déréférencement**).  
  Cela aura pour effet de **`modifier la valeur à la case mémoire de la variable passée en paramètre`.**
  * on retourne la variable age après avoir modifié sa valeur.
* retour dans `main()` : 
  * on appelle la fonction `editAgeToAdultYears()` en lui passant en paramètre la variable `ageOne`.
  * le résultat sera une modification de la valeur de la variable passée en paramètre de la fonction `editAgeToAdultYears()`.

_N.B.: le nom de la fonction `editAgeToAdultYears()` indique bien qu'on va effectuer une action : éditer la variable `ageOne` pour qu'elle contienne une autre valeur._

## 5. Exemple avec la fonction `Scan()`

```Go
package main

import (
	"fmt"

	fileoperations "example.com/control-structures/file-operations"
	"github.com/Pallinder/go-randomdata"
)

const accountBalanceFile = "balance.txt"

func main() {
	accountBalance, err := fileoperations.GetFloatFromFile(accountBalanceFile)

	if err != nil {
		fmt.Println("--------")
		fmt.Println("ERROR : ")
		fmt.Println(err)
		fmt.Println("--------")
		// panic("Cannot start the application without a valid balance file.")
	}

	fmt.Println("Welcome to Go Bank !")

	fmt.Println("Reach us 24/7 : ", randomdata.PhoneNumber())

	for {
		greetings()

		var choice int
		fmt.Print("Enter your choice (type 1, 2, 3 or 4): ")
		fmt.Scan(&choice)

    // reste du code
  }
}
```

Ici, la fonction `fmt.Scan()` est utilisée en prenant en paramètre un pointeur : `&choice`.  
Ce pointeur pointe vers la variable `choice` de type `int`.

La fonction `Scan()` est créée de façon à déférencer le pointeur  
et écrase la valeur stockée à cette adresse par la valeur saisie par l'utilisateur.