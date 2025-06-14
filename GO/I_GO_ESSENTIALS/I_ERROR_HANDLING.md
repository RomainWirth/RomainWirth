# I. ERROR HANDLING

Dans certains langages, on va gérer les erreurs grâce à des blocs `try {...} catch {...}`.  
En Go, il faut écrire les fonctions de manière à ce qu'elle ne fasse pas crasher l'application.  

Reprenons le code de l'exemple qu'on va modifier : 
```Go
import (
  "errors"
  "fmt"
  "os"
  "strconv"
)

const dataTextFile = "data.txt"

func main() {
  data, err := getBalanceFromFile()

	if err != nil {
		fmt.Println("ERROR : ")
		fmt.Println(err)
	}
  
  // suite du code 

}

func getDataFromFile() (float64, error) {
  data, err := os.ReadFile(dataTextFile)
  if err != nil {
    return 1000.0, return 1000.0, errors.New("Failed to read balance file, setting default balance to 1000.0")
  }
  
  dataText := string(data)
  
  dataConverted, err := strconv.ParseFloat(dataText, 64)
  if err != nil {
    return 1000.0, errors.New("Failed to parse stored balance value, setting default balance to 1000.0")
  }

  return dataConverted, nil
}
``` 
Dans le code ci dessus, la fonction `getDataFromFile()`  qui retourne un couple de valeurs : `(float64, error)`: 
* la fonction `os.ReadFile()` retourne deux valeurs : 
  * l'une de type `[]byte`, stockée dans la variable `data`, 
  * l'autre étant l'erreur : stockée dans la variable `err`.
* On va ensuite gérer l'erreur de cette manière : `if err != nil {...}` :
  * `nil` : c'est une valeur spéciale qui correspond à l'`absence d'une valeur utile` :   
  la valeur `err` sera `nil` si on a pas d'erreur.
  * `if err != nil` (si err est différent de nil), nous avons une erreur.
  * on retourne la valeur par défaut : `1000.0` (de type float64) et `errors.New()`
  * (idem pour la gestion de l'erreur de `.ParseFloat()`)

**Le package `errors` fait partie de la librairie standard de Go.**  
**Ce package importé permet d'utiliser la fonction `.New()` qui va générer une valeur error qui contient une string.**  

* la fonction `getDataFromFile()` va bien retourner deux données : 
  * `dataConverted` : la donnée souhaitée,
  * `nil` : signifie qu'on a pas d'erreur (elles sont gérées avant dans la fonction).

* Pour finir, la fonction `main()` faisant appel à `getDataFromFile()` :
  * on va stocker dans deux variables le retour de la fonction `getDataFromFile()` : `data` et `err`,
  * puis gérer l'erreur dans un bloc `if` qui ne bloquera pas l'exécution du code. 