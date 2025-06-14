# A. SÉPARER DU CODE EN PLUSIEURS PACKAGES

À partir de cette application fictive : 
```Go
package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

const accountBalanceFile = "balance.txt"

func main() {
	accountBalance, err := getBalanceFromFile()

	if err != nil {
		fmt.Println("--------")
		fmt.Println("ERROR : ")
		fmt.Println(err)
		fmt.Println("--------")
		// panic("Cannot start the application without a valid balance file.")
	}

	fmt.Println("Welcome to Go Bank !")

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

		switch choice {
		case 1:
			fmt.Println("Your account balance is: ", accountBalance)
		case 2:

			fmt.Print("Enter the amount to deposit: ")

			var depositAmount float64
			fmt.Scan(&depositAmount)

			if depositAmount > 0 {

				accountBalance += depositAmount
				fmt.Println("Deposit successful! New balance is: ", accountBalance)
				writeBalanceToFile(accountBalance)
				continue

			} else {

				fmt.Println("Invalid deposit amount.")
				continue

			}
		case 3:
			fmt.Print("Enter the amount to withdraw: ")

			var withdrawAmount float64
			fmt.Scan(&withdrawAmount)

			if withdrawAmount <= 0 {

				fmt.Println("Invalid withdrawal amount.")
				continue

			} else if withdrawAmount > accountBalance {

				fmt.Println("Insufficient funds for withdrawal.")
				continue

			} else {

				accountBalance -= withdrawAmount
				fmt.Println("Withdrawal successful! New balance is: ", accountBalance)
				writeBalanceToFile(accountBalance)
				continue

			}
		case 4:
			fmt.Println("Exiting the application.")
			fmt.Println("Thank you for using Go Bank! Goodbye!")
			fmt.Println("Have a great day!")
			return
		default:
			fmt.Println("Invalid choice. Please try again.")
			continue
		}
	}
}

func writeBalanceToFile(balance float64) {
	balanceText := fmt.Sprint(balance)
	os.WriteFile(accountBalanceFile, []byte(balanceText), 0644)
}

func getBalanceFromFile() (float64, error) {
	data, err := os.ReadFile(accountBalanceFile)
	if err != nil {
		return 1000.0, errors.New("failed to read balance file, setting default balance to 1000.0")
	}

	balanceText := string(data)
	balance, err := strconv.ParseFloat(balanceText, 64)

	if err != nil {
		return 1000.0, errors.New("failed to parse stored balance value, setting default balance to 1000.0")
	}
	return balance, err
}
```
Nous allons séparer le code en plusieurs fichiers afin de rendre le code plus facile à lire.  
On va commencer par séparer le code suivant dans une fonction `greetings()`: 
```Go
fmt.Println("What do you want to do ?")
fmt.Println("1. Check Balance")
fmt.Println("2. Deposit Money")
fmt.Println("3. Withdraw Money")
fmt.Println("4. Exit")

func greetings() {
  fmt.Println("What do you want to do ?")
  fmt.Println("1. Check Balance")
  fmt.Println("2. Deposit Money")
  fmt.Println("3. Withdraw Money")
  fmt.Println("4. Exit")
}
```

Cette fonction pourra ensuite être déplacée dans un nouveau fichier `communication.go`: 
```Go
package main

import "fmt"

func greetings() {
	fmt.Println("Welcome to Go Bank!")
	fmt.Println("Your account balance is: 1000.0")
	fmt.Println("What do you want to do ?")
	fmt.Println("1. Check Balance")
	fmt.Println("2. Deposit Money")
	fmt.Println("3. Withdraw Money")
	fmt.Println("4. Exit")
}
```
Ce fichier étant situé à la racine, il fera partis tu même package `main`.  
Il faudra bien entendu importer le package `"fmt"` afin d'utiliser la fonction `.Println()` dans le fichier.