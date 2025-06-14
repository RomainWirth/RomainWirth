# G. FAIRE PERSISTER ET EXTRAIRE DE LA DATA D'UN FICHIER

## 1. Faire persister de la data vers un fichier

Afin de conserver une donnée, on peut faire appel au package `os` et aux fonctions associées, telle que `.WriteFile()`.
```Go
import "os"

func writeDataToFile(data type) {
  dataText := fmt.Sprint(data)
  os.WriteFile("data.txt", []byte(dataText), 0644)
}
```
la fonction `writeDataToFile()` va se décomposer comme suit : 
* elle prend en paramètre `data`, que l'on va typer avec le type de data qu'on veut stocker. 
* on va ensuite modifier le type de cette data et la transfomer en `string` pour la stocker ensuite.
* `os.WriteFile()` va permettre de créer un fichier. Elle porend 3 paramètres :
  * une string : ici, `data.txt` qui correspond au nom du fichier qui va être créé
  * `[]byte()` : il s'agit d'une conversion vers une collection d'octets (byte collection).
  * `0644` : il s'agit d'une notation des autorisations de fichiers.  
  plus d'informations sur les autorisations de fichiers [ici](https://www.redhat.com/en/blog/linux-file-permissions-explained)

## 2. Extraire et lire de la data depuis un fichier

Pour cela, on va utiliser la fonction `.ReadFile()`.
```Go
import (
  "fmt"
  "os"
  "strconv"
)

const dataTextFile = "data.txt"

func getDataFromFile() float64 {
  data, _ := os.ReadFile(dataTextFile)
  
  dataText := string(data)
  
  dataConverted, _ := strconv.ParseFloat(dataText, 64)
  return dataConverted
}
```
Dans cet exemple, nous avons une fonction `getDataFromFile()` :
* elle retourne une variable de type `float64`.
* On va d'abord utiliser la fonction `.ReadFile()` du package `os` pour récupérer le contenu du fichier dont le nom a été stocké dans la constante `dataTextFile`. 
* on va ensuite convertir le contenu en `string`, car c'est le seul type qui peut lire le contenu de type `[]byte`.
* on va ensuite utiliser le package `strconv` (pour string converter) avec la fonction `.ParseFloat()` qui prends deux paramètres : 
  * `dataText` : le contenu du fichier qu'on a récupéré.
  * `64` : la `bitSize` dans laquelle on voudra convertir la donnée.
* on pourra ensuite `return` la donnée qui est de type `float64`.

_N.B. : le underscore `_` utilisé comme deuxième variable de retour des fonctions `.ReadFile()` et `.ParseFloat()` est utilisé ici pour éviter de traiter l'erreur potentielle du retour des fonctions._