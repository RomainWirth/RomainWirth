# A. À QUEL PROBLÈME RÉPOND `struct` ?

Le `Struct` permet de regrouper et structurer la donnée en objets plus simples à manipuler.  
```Go
package main

import (
	"fmt"
)

func main() {
	firstName := getUserData("Please enter your first name: ")
	lastName := getUserData("Please enter your last name: ")
	birthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	// ... do something awesome with that gathered data!

	fmt.Println(firstName, lastName, birthDate)
}

func getUserData(promptText string) string {
	fmt.Print(promptText)
	var value string
	fmt.Scan(&value)
	return value
}
```
Dans l'exemple ci-dessus, nous avons 3 variables qui sont séparées mais qui ont une relation : elles définissent un `User`.  
Avec un `Struct`, on pourrait créer un objet `User` qui regroupe et structure les trois données.

# B. CRÉER ET UTILISER DES `struct`

## 1. Définir des `struct`

On peut définir un `struct` de cette manière : 
```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}
```
Ce struct définit un objet `user` qui a trois champs : 
* FirstName de type `string`
* LastName de type `string`
* BirthDate de type `string`

On peut utiliser des champs de n'importe quel type : `int`, `bool`, etc., et même des `Struct`.  
`time.Time` est un type `struct` importé du package `time`.

## 2. Instancier des `struct` & les notations litérales de `struct` 

```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func main() {
	userFirstName := getUserData("Please enter your first name: ")
	userLastName := getUserData("Please enter your last name: ")
	userBirthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	var appUser user

	appUser = user{
		firstName: userFirstName,
		lastName:  userLastName,
		birthDate: userBirthDate,
		createdAt: time.Now(),
	}

	fmt.Println(firstName, lastName, birthDate)
}
```
* La variable `appUser` est déclarée. Elle a pour type `user` (qui est un `struct`)
* On va ensuite **instancier** le `struct` user en initialisant la variable `appUser`.

## 3. Notations litérales alternatives de `struct` & `struct` null

Les deux notations ci-dessous sont équivalentes : 
```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

appUser = user{
	firstName: userFirstName,
	lastName:  userLastName,
	birthDate: userBirthDate,
	createdAt: time.Now(),
}

appUser = user{
	userFirstName,
	userLastName,
	userBirthDate,
	time.Now(),
}
```
Attention, dans le cas de la deuxième notation, il est important de garder le même ordre que le `blueprint` user pour assigner les variables aux bonnes clés.  

Il est également possible de créer un `struct` vide : 
```Go
appUser = user{}
```
Cette notation est la valeur `null` du type `struct`.

Il est donc possible de ne pas assigner de valeur à une clé dans le cas ou aucune valeur n'est disponible.  
Dans ce cas, la clé qui ne possède pas de valeur sera set à la valeur nulle du type de la clé (`string` = "", `int` = 0)  

## 4. Passer des valeurs `struct` en tant que paramètres

```Go
package main

import (
	"fmt"
	"time"
)

type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func main() {
	userFirstName := getUserData("Please enter your first name: ")
	userLastName := getUserData("Please enter your last name: ")
	userBirthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	appUser := user{
		firstName: userFirstName,
		lastName:  userLastName,
		birthDate: userBirthDate,
		createdAt: time.Now(),
	}

	outputUserDetails(appUser)
}

func getUserData(promptText string) string {
	fmt.Print(promptText)
	var value string
	fmt.Scan(&value)
	return value
}

func outputUserDetails(u user) {
	fmt.Printf("User Details:\nFirst Name: %s\nLast Name: %s\nBirthdate: %s\nCreated At: %s\n",
		u.firstName, u.lastName, u.birthDate, u.createdAt.Format(time.RFC1123))
}
```
Dans le code ci-dessus, la fonction `outputUserDetails()` prends en paramètre une variable `u` de type struct `user`.  
Afin d'accéder aux clés de la variable `u` de type `user`, on utilise la notation `[name].[key]` : `u.firstName`.  
Lors de l'appel de la fonction, on passe en paramètre la variables `appUser` qui est bien du type struct `user`.  

Output : 
```
go run .

Please enter your first name: John
Please enter your last name: DOE
Please enter your birthdate (MM/DD/YYYY): 12/03/1998
User Details:
First Name: John
Last Name: DOE
Birthdate: 12/03/1998
Created At: Tue, 10 Jun 2025 13:15:21 CEST
```

## 5. `struct`et `pointeurs`

Prenons le code ci-dessous : 
```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func main() {
	userFirstName := getUserData("Please enter your first name: ")
	userLastName := getUserData("Please enter your last name: ")
	userBirthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	appUser := user{
		firstName: userFirstName,
		lastName:  userLastName,
		birthDate: userBirthDate,
		createdAt: time.Now(),
	}

	outputUserDetails(&appUser)
}

func outputUserDetails(u *user) {
	fmt.Println(u.firstName, u.lastName, u.birthDate)
}
```

la fonction `outputUserDetails()` prends maintenant en paramètre un pointeur.  
lors de son appel, on lui passe le pointeur `&appUser`.  

Rappel : lorsqu'on passe un pointeur à une fonction, on lui passe l'adresse mémoire de la variable.  
Afin d'accéder à la variable, il faut déréférencer le pointeur.

Contrairement à ce qui a été vu dans la section des pointeurs (rappelé ci-dessus), il n'est pas nécessaire de procéder au déréférencement.  
Go permet un raccouri, on peut accéder directement à la valeur à chaque clé de la variable `struct` passée en paramètre avec la notation : `[name].[key]`.

_Les structs sont donc une exception lors de l'utilisation de pointeurs._

L'écriture correcte techniqumentserait la suivante : 
```Go
func outputUserDetails(u *user) {
	fmt.Prinln((*u).firstName, (*u).lastName, (*u).birthDate)
}
```