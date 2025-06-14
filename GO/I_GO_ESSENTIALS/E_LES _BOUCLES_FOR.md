# E. LES BOUCLES `for`

Les boucles permettent d'exécuter un bloc de code tant qu'une condition n'est pas remplie. 
Contrairement à d'autres langages, Go n'utilise qu'un seul type de boucle : la boucle `for`.

```Go
for i := 0; i < 2; i++ {
  // code à exécuter
}
```
La boucle ci-dessus va exécuter le code entre accolades sur deux itérations.
Cette boucle se décompose comme suit : 
* `for` : mot clé.
* `i := 0;` : initialisation de la variable testée dans la condition de la boucle.
* `i < 2;` : condition de sortie de la boucle = nombre de fois qu'on va exécuter le code.
* `i++` : incrémentation de la variable i de 1. Syntaxe équivalente à : `i = i + 1`.

Cette syntaxe de boucle for a été modernisée de cette manière : 
```Go
for range 2 {
  // code à exécuter
}
```
Ci-dessus, la boucle for a été simplifiée avec le mot clé `range` suivi de la condition de sortie de la boucle.

la boucle infinie : 
```Go
for {
  // code à exécuter
}
```

__*Les mots clés `break` et `continue` :*__
* `break` permet de sortir d'une boucle :
```Go
package main

import "fmt"

func main() {
	for {
    // ...
    if {
      // ...
    } else if choice == 4 {

			fmt.Println("Exiting the application.")
			break

		} else {

			fmt.Println("Invalid choice. Please try again.")

		}
	}

	fmt.Println("Thank you for using Go Bank! Goodbye!")
	fmt.Println("Have a great day!")
}
```
Ci dessus, le contenu de la fonction `main()` va s'exécuter à l'infini, tant qu'on est pas allé dans la condition `choice == 4`.  
Le code contenu dans cette condition contient le mot clé `break` qui permet de sortir de la boucle et d'exécuter le code situé en dehors de la boucle for.

* `continue` permet de retourner au début de l'exécution de la boucle. 
```Go
for {
	fmt.Println("What do you want to do ?")
	fmt.Println("1. Check Balance")
	fmt.Println("2. Deposit Money")
	fmt.Println("3. Withdraw Money")
	fmt.Println("4. Exit")
	var choice int
	fmt.Print("Enter your choice (type 1, 2, 3 or 4): ")
	fmt.Scan(&choice)
	fmt.Println("You chose option", choice)
	if choice == 1 {
		// code à exécuter
	} else if choice == 2 {
		// code à exécuter
		if depositAmount > 0 {
			// code à exécuter
		} else {
			fmt.Println("Invalid deposit amount.")
			continue
		}
	}
}
```
Ce-dessus, dans le `else`, on exécute une ligne de code, puis le terme `continue` renvoit au début de la boucle `for` avec l'affichage des choix possibles.

**`for` suivi d'une condition :**  
Il existe une variation commune de la boucle for :
```Go
for condition {
  // code à exécuter
}
```
`condition` correspond à une expression qui retourne une valeur booléenne (`true`ou `false`).  
Dans ce cas, la boucle continuera de s'exécuter tant que la condition n'a pas retourné `false`.  