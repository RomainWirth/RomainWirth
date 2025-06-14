# C. AJOUTER DES MÉTHODES ET DES FONCTIONS AUX `struct`

Les `struct` sont utiles pour combiner et regrouper des données qui ont une relation.  
On peut également attacher des fonctions aux `struct`. On appelle ces fonctions des `méthodes`.

## 1. Introduction des Méthodes

Lorsqu'une fonction a une existance liée à un struct, on va automatiquement la relier au `struct`.  
Par exemple, la fonction `outputUserDetails()` était étroitement liée au struct `user`, on va pouvoir la rattacher :
```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func (u user) outputUserDetails() {
	fmt.Println(u.firstName, u.lastName, u.birthDate)
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

	appUser.outputUserDetails()
}
```

Détaillons la fonction `outputUserDetails()` :  
devant le nom de la fonction, on a l'élément `(u user)` qui est apparu :
* il s'agit d'un `paramètre de réception` (=`receiver argument`)
* cela signifie que la fonction va travailler avec le struct `user` 
* et accéder directement aux clés de ce `struct`.

La fonction est donc devenue une méthode associée au struct `user`

Pour appeler la méthode, on va maintenant utiliser la variable déclarer en type struct `user`.  
On va pouvoir accéder à toutes les clés et méthodes associées au struct : `appUser.outputUserDetails()`

Output : 
```
go run .

Please enter your first name: John
Please enter your last name: DOE
Please enter your birthdate (MM/DD/YYYY): 12/03/1998
John, DOE. 12/03/1998
```

## 2. Utiliser des méthodes qui modifient les données

```Go
type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func (u user) outputUserDetails() {
	fmt.Println(u.firstName, u.lastName, u.birthDate)
}

func (u user) clearUserName() {
	u.firstName = ""
	u.lastName = ""
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

	appUser.outputUserDetails()
	appUser.clearUserName()
	appUser.outputUserDetails()
}
```

Output : 
```
go run .

Please enter your first name: John
Please enter your last name: DOE 
Please enter your birthdate (MM/DD/YYYY): 12/03/1998
John DOE 12/03/1998
John DOE 12/03/1998
```
La méthode `clearUserName()` fonctionne bien avec le type struct, mais ne modifie pas l'objet qui fait appel à cette méthode.  
Au lieu de cela, la méthode va créer une copie de la valeur de `appUser` dans l'espace mémoire et modifier cette copie.  
Elle ne va pas modifier directement la valeur de la variable.

Pour cela, il va falloir travailler avec les pointeurs :
```Go
func (u *user) clearUserName() {
	u.firstName = ""
	u.lastName = ""
}
```
Seul l'utilisation du pointeur permet d'opérer des modifications de la donnée qui accède à la méthode.  
Il est donc **nécessaire** de passer en `reveicer argument` une variable `pointeur` à la méthode qui veut modifer la donnée. 

Après le changement effectué sur la méthode, on va avoir cet output : 
```
go run .

Please enter your first name: John 
Please enter your last name: DOE
Please enter your birthdate (MM/DD/YYYY): 12/03/1998
John DOE 12/03/1998
  12/03/1998
```
* Le premier appel de la méthode `outputUserDetails()` retourne toute la donnée
* Le deuxième appel de la méthode `outputUserDetails()` retourne bien deux châines de caractère vide et la date de naissance.

## 3. Les fonctions `constructor`

La fonction `constructor` permet de construire un struct sans avoir à répéter le code de déclaration de l'objet : 
```Go
func newUser(firstname, lastname, birthdate string) *user {
	return &user{
		firstName: firstname,
		lastName:  lastname,
		birthDate: birthdate,
		createdAt: time.Now(),
	}
}

// lors de l'appel de cette fonction : 
appUser := newUser(userFirstName, userLastName, userBirthDate)

// à la place de : 
appUser := user{
	firstName: userFirstName,
	lastName:  userLastName,
	birthDate: userBirthDate,
	createdAt: time.Now(),
}
```

Pour créer une fonction constructor, on va utiliser une certaine convention de nommage avec le terme `new` : `newUser`.  
La fonction `newUser()` va retourner un pointeur `user`, cela afin d'eviter de copier la donnée en mémoire.  
On utilisera le pointeur `&` pour retourner la donnée.

## 4. Utiliser des fonctions `constructor` pour la validation

On peut faire évoluer la fonction `newUser()` en y incluant la validation des données : 
```Go
func newUser(firstname, lastname, birthdate string) (*user, error) {
	if firstname == "" || lastname == "" || birthdate == "" {
		fmt.Println("Error: All fields must be filled out.")
		return nil, errors.New("invalid user data")
	}

	return &user{
		firstName: firstname,
		lastName:  lastname,
		birthDate: birthdate,
		createdAt: time.Now(),
	}, nil
}

func main() {
  //...
  appUser, err := newUser(userFirstName, userLastName, userBirthDate)
	if err != nil {
		fmt.Println("Failed to create user:", err)
		return
	}
  // ...
}
```
* la fonction `newUser()` va retourner deux valeurs : un pointeur vers `user` et une variable `error`.
* on traite directement le cas ou la fonction retourne une erreur : 
  * en testant la donnée entrante : `firstname`, `lastname`, `birthdate`,
  * et en retournant une erreur. 
* si la donnée est valide, on construit l'objet.

* lors de l'appel de la fonction dans `main()`, on stocke les résultats dans deux variables : `appUser` et `err` :
  * `appUser` peut être soit un objet rempli de type `*user`, soit `nil`,
  * `err` peut être soit un objet de type `error`, soit `nil`.
* on traite le cas ou la fonction retourne une erreur et on stoppe l'exécution du code.
* si tout est ok on continue sur l'exécution du code.

L'ajout de validation des données dans le constructeur est vraiment utile dans l'utilisation des `struct`.  
Cela permet de construire un objet complet valide, sans répétition de code, et de manière réutilisable.

## 5. Structs, Packages & Exports

Étant donné que les structs possèdent leur propre type et leur propre méthodes, on pourrait les déplacer dans leur propre package.  
Un package dédié n'est pas forcément utile, cela va dépendre de l'architecture du code souhaitée  
et de la manière dont on va utiliser le `struct` : 
* dans un package courant, 
* ou partout dans l'application.

`Struct` dans son propre package :  

À partir de ce code : 
```Go
package main

import (
	"errors"
	"fmt"
	"time"
)

type user struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func (u user) outputUserDetails() {
	fmt.Println(u.firstName, u.lastName, u.birthDate)
}

func (u *user) clearUserName() {
	u.firstName = ""
	u.lastName = ""
}

func newUser(firstname, lastname, birthdate string) (*user, error) {
	if firstname == "" || lastname == "" || birthdate == "" {
		fmt.Println("Error: All fields must be filled out.")
		return nil, errors.New("invalid user data")
	}

	return &user{
		firstName: firstname,
		lastName:  lastname,
		birthDate: birthdate,
		createdAt: time.Now(),
	}, nil
}

func main() {
	userFirstName := getUserData("Please enter your first name: ")
	userLastName := getUserData("Please enter your last name: ")
	userBirthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	appUser, err := newUser(userFirstName, userLastName, userBirthDate)
	if err != nil {
		fmt.Println("Failed to create user:", err)
		return
	}

	appUser.outputUserDetails()
	appUser.clearUserName()
	appUser.outputUserDetails()
}

func getUserData(promptText string) string {
	fmt.Print(promptText)
	var value string
	fmt.Scan(&value)
	return value
}
```
On va externaliser le `struct` dans son propre package.  
* Pour cela, on va créer un nouveau dossier `user` et un fichier `user.go` dans ce dossier.  
L'application aura donc cette structure :  
```
| scructs.go
| go.mod
| structs
| user
| | user.go
```
* On va ensuite déporter les logique liée au struct `user` dans le nouveau fichier `user.go` : 
```Go
package user

import (
	"errors"
	"fmt"
	"time"
)

type User struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

func (u User) OutputUserDetails() {
	fmt.Println(u.FirstName, u.LastName, u.BirthDate)
}

func (u *User) ClearUserName() {
	u.FirstName = ""
	u.LastName = ""
}

func New(firstname, lastname, birthdate string) (*User, error) {
	if firstname == "" || lastname == "" || birthdate == "" {
		fmt.Println("Error: All fields must be filled out.")
		return nil, errors.New("invalid user data")
	}

	return &User{
		FirstName: firstname,
		LastName:  lastname,
		BirthDate: birthdate,
		CreatedAt: time.Now(),
	}, nil
}
```
On notera plusieurs choses :  
1. le nom du struct `User` prends maintenant une majuscule, tout comme les méthodes,  
de cette manière, on exporte 
2. les clés dans le struct `User` restent en minuscule :  
    * ATTENTION : si on souhaite accéder aux champs du struct, on va ajouter une lettre majuscule au début du nom.
    C'est **obligatoire** pour permettre l'accès à ces propriétés depuis un autre package distant.  
    * Si les champs ne doivent pas être accessibles en dehors du package, il faudra laisser une minuscule.
3. Les fonction constructeur `NewUser()` devient simplement `New()` par convention de nommage.

Cela permettra d'exporter le struct `User` et ses méthodes et d'y accéder partout ou on fera appel au package `user`.

* On va enfin modifier le package `main` : 
```Go
package main

import (
	"fmt"

	User "example.com/structs/user"
)

func main() {
	userFirstName := getUserData("Please enter your first name: ")
	userLastName := getUserData("Please enter your last name: ")
	userBirthDate := getUserData("Please enter your birthdate (MM/DD/YYYY): ")

	appUser, err := User.New(userFirstName, userLastName, userBirthDate)
	if err != nil {
		fmt.Println("Failed to create user:", err)
		return
	}

	appUser.OutputUserDetails()
	appUser.ClearUserName()
	appUser.OutputUserDetails()
}

func getUserData(promptText string) string {
	fmt.Print(promptText)
	var value string
	fmt.Scan(&value)
	return value
}
```
On notera plusieurs choses : 
1. dans les imports, on retrouve le struct `User` et le chemin vers le package `user`
2. `User` est bien écrit avec une première lettre en majuscule, indiquand qu'on accède à un élément importé
3. le seul moyen de créer l'objet appUser se fait via la fonction constructeur `New()`, accessible ici car elle a été exportée depuis le package `user` (première lettre en majuscule)
4. les méthodes liées au struct `User` et importées du package `user` prennent toutes une première lettre en majuscule.

## 6. Struct intégré (`struct embedding`)

Il s'agit du même concept Java : l'héritage.  

Dans certains cas, on souhaite créer un `struct` basé sur un autre `struct` :  
```Go
package user

import (
	"errors"
	"fmt"
	"time"
)

type User struct {
	firstName string
	lastName  string
	birthDate string
	createdAt time.Time
}

type Admin struct {
  email string
  password string
  User
}

func (u User) OutputUserDetails() {
	fmt.Println(u.firstName, u.lastName, u.birthDate)
}

func (u *User) ClearUserName() {
	// ...
}

func New(firstname, lastname, birthdate string) (*User, error) {
	// ...
}

func NewAdmin(email, password string) Admin {
	return Admin{
		email:    email,
		password: password,
		User: User{
			firstName: "ADMIN",
			lastName:  "ADMIN",
			birthDate: "---",
			createdAt: time.Now(),
		},
	}
}
```
le type struct `Admin` va avoir les champs `email`, `password`, ainsi qu'un champs `User` qui est du type struct `User`.  
Il est possible d'ajouter une clé qui prendra le type struct `User` de cette manière : 
```Go
type Admin struct {
  email string
  password string
  user User
}
```
En procédant ainsi, lors de la création de l'utilisateur Admin avec `NewAdmin()`, la fonction constructeur se comportera de cette manière : 
```Go
func NewAdmin(email, password string) Admin {
	return Admin{
		email:    email,
		password: password,
		user: User{
			firstName: "ADMIN",
			lastName:  "ADMIN",
			birthDate: "---",
			createdAt: time.Now(),
		},
	}
}
```
C'est ainsi que l'on crée un `struct` avec un nested `struct`.  

Actuellement, il n'est pas possible d'exploiter le struct `Admin`, puisqu'aucun des champs n'est accessible en dehors du package `user`.  
Pour cela, on doit modifier les champs avec une première lettre en majuscule.
Par exemple, en modifiant le struct `Admin` de cette manière : 
```Go
type Admin struct {
  email string
  password string
  User User
}
```
on va rendre accessible les méthodes liées au struct `User` dans les autres packages : 
```Go
func main() {
  admin := User.NewAdmin("test@example.com", "password123")

	admin.User.OutputUserDetails()
	admin.User.ClearUserName()
	admin.User.OutputUserDetails()
}
```

Output : 
```
go run .

Please enter your first name: John 
Please enter your last name: DOE
Please enter your birthdate (MM/DD/YYYY): 12/03/1998
ADMIN ADMIN ---
  ---
John DOE 12/03/1998
  12/03/1998
```
On peut remarquer que les méthodes de `User` sont bien accessibles pour le struct `Admin`.

Afin d'éviter d'appeler les méthodes de cette manière : `admin.User.OutputUserDetails()`,  
On peut rendre anonyme le `nested struct` dans le struct `Admin` : 
```Go
type Admin struct {
  email string
  password string
  User
}
```
Ce qui aura pour effet lors de l'appel du struct dans un autre package : 
```Go
admin := User.NewAdmin("test@example.com", "password123")

admin.OutputUserDetails()
admin.ClearUserName()
admin.OutputUserDetails()
```
On obtiendra le même output.

## 7. Créer d'autres types custom & ajouter des méthodes

Il est possible d'utiliser des alias pour déclarer un type.  
Par exempple, on pourrait déclarer le type str de type string : 
```Go
type str string
```
Faire uniquement ceci n'a aucun sens.  
Mais ajouter une méthode liée à ce type custom donne un sens : 
```Go
package main

import "fmt"

type str string

func (text str) log() {
  fmt.Println(text)
}

func main() {
  var name str = "John"

  name.log()
}
```
En appliquant ce code, l'ouptput dans le terminal serait le suivant : 
```
go run .

John
```

Il est possible d'utiliser ce genre d'alias pour n'importe quel type de base (`int`, `float64`, `string`, etc.) et aussi pour des types plus complexes.  

## 8. Utiliser des `struct tags`

Les `struct tags` sont des sortes de metadonnées qui indiquent le format qu'on souhaite donner à l'output d'un struct.  
Dans le cas du formattage en `.json`, il s'agit d'une information qu'on ajoute au type struct pour que les clés du json soient formattées correctement : 
```Go
type User struct {
  Name     string `json:"name"`
  LastName string `json:"last_name"`
}
```
Si notre application retourne un objet json, le type struct retourné aura des clés formattées écrites telles que dans les struct tags.