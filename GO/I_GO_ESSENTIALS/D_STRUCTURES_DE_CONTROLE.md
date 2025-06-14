# D. LES STRUCTURES DE CONTRÔLE

Les structures de contrôle sont des éléments qu'on va utiliser pour contrôler le code qui doit s'exécuter. 

## 1. `if` Statement = `si`

Le mot clé `if` permet d'introduire une condition.  
Une condition se déclare comme suit : 
* On va commencer la déclaration par le mot clé `if`, 
* suivi de la condition à réaliser (sans parenthèses), 
* suivi des accolade (curly brackets) qui vont contenir le bout de code à exécuter.
```GO
if condition {
  // code à exécuter
}
```

Exemple : 
```Go
package main

import "fmt"

func main() {
	accountBalance := 1000.0

	fmt.Println("Welcome to Go Bank !")
	fmt.Println("What do you want to do ?")
	fmt.Println("1. Check Balance")
	fmt.Println("2. Deposit Money")
	fmt.Println("3. Withdraw Money")
	fmt.Println("4. Exit")

	var choice int
	fmt.Print("Enter your choice (type 1, 2, 3 or 4) : ")
	fmt.Scan(&choice)

	if choice == 1 {
		fmt.Println("Your account balance is: ", accountBalance)
	}

	fmt.Println("You chose option", choice)
}
```
Dans le code ci dessus, la déclaration de condition est la suivante : 
* mot clé : `if` 
* condition : `choice == 1` qui retourne un booleen (true ou false)
* code à exécuter : `fmt.Println("Your account balance is: ", accountBalance)`

Output : 
```
go run .

Welcome to Go Bank !
What do you want to do ?
1. Check Balance
2. Deposit Money
3. Withdraw Money
4. Exit
Enter your choice (type 1, 2, 3 or 4) : 1
You chose option 1
Your account balance is:  1000
```

## 2. Travailler avec le `else if` = `sinon si`

le `else if` est utilisé en continuité d'un `if` : 
```Go
if conditionOne {
  // execute code
} else if conditionTwo {
  // execute code
}
```
Ici, `conditionTwo` sera évaluée uniquement si `conditionOne` retourne `false`.  

Dans notre exemple, nous pourrions avoir le code suivant : 
```Go
if choice == 1 {
		fmt.Println("Your account balance is: ", accountBalance)
} else if choice == 2 {
	fmt.Println("Enter the amount to deposit: ")
	
  var depositAmount float64
	fmt.Scan(&depositAmount)

	if depositAmount > 0 {
		accountBalance += depositAmount
		fmt.Println("Deposit successful! New balance is: ", accountBalance)
	} else {
		fmt.Println("Invalid deposit amount.")
	}
}
```
Dans le code ci-dessus, la suite de la condition est comme suit : 
* mot clé : `else if`
* condition : `choice == 2` qui retourne un booléen (true ou false)
* code à exécuter : 
```Go
fmt.Println("Enter the amount to deposit: ")

var depositAmount float64
fmt.Scan(&depositAmount)

accountBalance += depositAmount

fmt.Println("Deposit successful! New balance is: ", accountBalance)
```
* On déclare une variable de type `float64`, 
* puis on va scanner l'entrée de l'utilisateur, 
* Et enfin afficher le nouveau montant sur le compte.

#### 3. Utilisation de `else` = `sinon`

Chaque condition `if` peut avoir un et uniquement un `else` qui permet de terminer sur un cas par défaut :
```Go
if choice == 1 {
  ...
} else if choice == 4 {

	fmt.Println("Thank you for using Go Bank! Goodbye!")

} else {
	
  fmt.Println("Invalid choice. Please try again.")

}
```
Ici, dans le bloc de code situé après le `else`, on estime que l'utilisateur a potentiellement affiché autre chose que les choix proposé.
On retourne donc un message indiquant à l'utilisateur que son choix est invalide.

#### 4. Les conditions nestées (nested `if`) et `return` pour terminer le programme

Il est possible d'intégrer autant de conditions nécessaires dans l'exécution de code sous condition : 
```Go
if condition {
  // code to execute and send a result
  if conditionFromResultAbove {
    // code to execute
  } else if otherCondition {
    // code to execute
  } else {
    // code to execute
    return
  }
} else {
  // code to execute
  if conditionFromResultAbove {
    // code to execute
  }
}
```
* Ici, le code peut prendre deux chemin : `if condition` ou `else`.
* Puis dans l'exécution de la première condition, on aura trois nouveaux chemins possibles.
* le mot clé `return` permet de stopper le programme après l'exécution du code situé avant. 

On a donc des `nested if statements` et un `return` qui permet de stopper l'exécution du programme.

exemple : 
```Go
if choice == 1 {

	fmt.Println("Your account balance is: ", accountBalance)

} else if choice == 2 {

	fmt.Println("Enter the amount to deposit: ")
	var depositAmount float64
	fmt.Scan(&depositAmount)

	if depositAmount > 0 {

		accountBalance += depositAmount
		fmt.Println("Deposit successful! New balance is: ", accountBalance)

	} else {

		fmt.Println("Invalid deposit amount.")
    return

	}
}
```
Dans cet exemple, le code exécuté après la deuxième condition : `choice == 2` contient une partie d'exécution,  
puis une condition qui dépend du résultat de l'exécution du code juste au dessus  
et qui permet ou non d'exécuter le code écrit en dessous. 

#### EXERCICE : COMPLÉTER LE PROGRAMME AVEC LES DIFFÉRENTES CONDITIONS

* else if choice == 3 {...}
* else if
* else

Ne pas hésiter à être inventif et à compléter avec des `nested conditions`

```Go
package main

import "fmt"

func main() {
	accountBalance := 1000.0

	fmt.Println("Welcome to Go Bank !")
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

		fmt.Println("Your account balance is: ", accountBalance)

	} else if choice == 2 {

		fmt.Println("Enter the amount to deposit: ")

		var depositAmount float64
		fmt.Scan(&depositAmount)

		if depositAmount > 0 {

			accountBalance += depositAmount
			fmt.Println("Deposit successful! New balance is: ", accountBalance)

		} else {

			fmt.Println("Invalid deposit amount.")

		}
	}
  // compléter ici 
}
```

<details>
<summary style="font-weight:bold">Correction</summary>

```Go
package main

import "fmt"

func main() {
	accountBalance := 1000.0

	fmt.Println("Welcome to Go Bank !")
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

		fmt.Println("Your account balance is: ", accountBalance)

	} else if choice == 2 {

		fmt.Println("Enter the amount to deposit: ")

		var depositAmount float64
		fmt.Scan(&depositAmount)

		if depositAmount > 0 {

			accountBalance += depositAmount
			fmt.Println("Deposit successful! New balance is: ", accountBalance)

		} else {

			fmt.Println("Invalid deposit amount.")
			return

		}
	} else if choice == 3 {

		fmt.Print("Enter the amount to withdraw: ")

		var withdrawAmount float64
		fmt.Scan(&withdrawAmount)

		if withdrawAmount <= 0 {

			fmt.Println("Invalid withdrawal amount.")
			return

		} else if withdrawAmount > accountBalance {

			fmt.Println("Insufficient funds for withdrawal.")
			return

		} else {

			accountBalance -= withdrawAmount
			fmt.Println("Withdrawal successful! New balance is: ", accountBalance)

		}
	} else if choice == 4 {

		fmt.Println("Thank you for using Go Bank! Goodbye!")
		return

	} else {

		fmt.Println("Invalid choice. Please try again.")
		return

	}

	fmt.Println("Exiting the application.")
	fmt.Println("Have a great day!")
}
```
</details>