# F. SWITCH CASE

Le `switch` statement est une alternative au `if condition {...} else if condition {...} else {...}`.  
La déclaration du switch se fait ainsi : 
```Go
switch variableToTest {
  case variableOfReferenceOne:
    // code à exécuter
  case variableOfReferenceTwo:
    // code à exécuter
  case ...
    // code à exécuter
  default:
    // code à exécuter
}
```
Cela signifie qu'on va tester une variable de cette manière : \
* `variableToTest == variableOfReferenceOne`, 
* `variableToTest == variableOfReferenceTwo`,
* etc.
* `default` sera le code par défaut qui sera exécuté si aucune des conditions n'est activée.

Dans notre exemple, le `if {...} else if {...} else` pourra être remplacé de cette manière :
```Go
switch choice {
  case 1:
    // code à exécuter
  case 2:
    // code à exécuter
  case 3:
    // code à exécuter
  case 4:
    // code à exécuter
  default:
    // code à exécuter
}
```

**Le mot clé `break` :**  
Contrairement à d'autres langages, le mot clé `break` n'est pas nécessaire dans l'exécution d'un `switch case` pour sortir d'un cas.  
Le switch s'arrête automatiquement, sans avoir besoin du `break`.  

On pourra utiliser `break` pour sortir prématurément d'un `switch` imbriqué, dans une boucle ou un bloc nommé (ce n'est pas courant).  

**Le mot clé `continue`**  
Il ne sera utile que dans le cas d'une boucle.

**Le mot clé `return`**  
Il permet de sortir immédiatement de la fonction `switch`, peu importe ou il est utilisé.

```Go
func test(x int) {
  switch x {
  case 1:
    fmt.Println("Un")
    return // Sort de la fonction test
  }
  fmt.Println("Fin de la fonction")
}
```

**Le mot clé `fallthrough` :**  
Go possède le mot clé `fallthrough` qui permet d'exécuter le case suivant même si ce n'est pas le comportement par défaut.  
```Go
switch x {
case 1:
    fmt.Println("Un")
    fallthrough
case 2:
    fmt.Println("Deux")
}
// Si x == 1, affichera "Un" puis "Deux"
```