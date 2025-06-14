# C. UTILISER UNE INTERFACE

Bien qu'une interface n'utilise aucune logique, elle est un type :
```Go
type name interface {
  MethodName(type, type) type
}
```
Cela signifie qu'on peut l'utiliser à n'importe quel endroit ou on a besoin d'un type.  
Dans notre exemple avec la fonction `saveData()`, on peut maintenant passer en paramètre de la fonction une variable `data` de type `saver` : 
```Go
func saveData(data saver) {
  // ...
}
```
Cela garantit que, peut importe la valeur de la data qui est passée en paramètre,  
elle sera d'un type qui adhère à l'interface déclarée (qui a signé le contrat de l'interface déclarée).  

On peut donc appeler la méthode associée à l'interface déclarée dans la fonction qui prend en type l'interface.  
On peut également ajouter toute la logique de traitement de retour de la donnée associée à la méthode appelée.  
Il faudra bien entendu typer la valeur de retour de la fonction faisant appel à la méthode.  

Exemple : 
```Go
func saveData(data saver) error {
	err := data.Save()

	if err != nil {
		fmt.Println("Error saving data:", err)
		return err
	}

	fmt.Println("Data saved successfully!")
	return nil
}
```

on peut donc modifier le code dans la fonction main : 
```Go
todo.Display()
err = saveData(todo)

if err != nil {
	fmt.Println("Error saving todo:", err)
	return
}

//...

userNote.Display()
err = saveData(userNote)
if err != nil {
	fmt.Println("Error saving note:", err)
	return
}
```

## Comment est-ce que cela fonctionne ?

On peut se poser la question :  
pourquoi est-ce que Go ne retourne pas une erreur alors qu'on passe des types différents à la fonction `saveData()` ?  

Effectivement, `saveData()` n'accepte que des valeurs de type `saver`.  
C'est possible parce que l'interface déclarée, ici, `saver`, doit obligatoirement avoir 
* une méthode `Save()` 
* qui ne prends aucun paramètres 
* et retourne une valeur de type `error`.

Il n'est pas nécessaire de connecter explicitement l'interface à un autre type pour forcer ce type à adhérer à cette interface.  
À la place, Go regarde simplement la valeur passée à la fonction qui fait appel à l'interface,  
et verifie si cette valeur d'un type struct contient la méthode avec la même signature appelée dans l'interface.

C'est de cette manière que les interfaces permettent d'écrire du code `plus générique` et `plus flexible`.  

## Les interfaces nestées 

Il y a toujours une duplication de code dans notre exemple : 
```Go
type saver interface {
	Save() error
}

func main() {
	title, content := getNoteData()
	todoText := getUserInput("Todo text: ")

	todo, err := todo.New(todoText)

	if err != nil {
		fmt.Println("Error creating todo:", err)
		return
	}

	todo.Display()
	err = saveData(todo)

	if err != nil {
		fmt.Println("Error saving todo:", err)
		return
	}

	userNote, err := note.New(title, content)

	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	userNote.Display()
	err = saveData(userNote)

	if err != nil {
		fmt.Println("Error saving note:", err)
		return
	}
}

func saveData(data saver) error {
	err := data.Save()

	if err != nil {
		fmt.Println("Error saving data:", err)
		return err
	}

	fmt.Println("Data saved successfully!")
	return nil
}
```
chaque variable de type `struct` fait appel à une méthode `Display()`, puis on utilise la fonction `saveData()`.

On peut donc créer une nouvelle fonction `outputData()` :
* pour afficher la donnée via la méthode `Display()`,
* et sauvegarder la donnée via la fonction `saveData()`.

La première méthode serait de créer d'autres interfaces : 
```Go
type saver interface {
	Save() error
}

type displayer interface {
	Display()
}

type outputtable interface {
	Save() error
	Display()
}
```

Une meilleure méthode serait d'utiliser une interface nestée : 
```Go
type saver interface {
	Save() error
}

type outputtable interface {
  saver
  Display()
}
```
Dans le code ci-dessus, l'interface `outputtable` va embarquer la méthode présente dans `saver`,   
et ajouter la méthode `Display()`.

Notre fonction `outputData()` sera donc de type `outputtable` : 
```Go
func outputData(data outputtable) error {
	data.Display()
	return saveData(data)
}
```
N.B. : vu que `saveData()` retourne une variable de type `error`,  
la fonction `outputData()` va donc retourner également une variable de type `error`,  
et logiquement le résultat de la fonction `outputData()` sera le résultat de `saveData()`.

On va enfin appeler `outputData()` dans notre code : 
```Go
func main() {
	title, content := getNoteData()
	todoText := getUserInput("Todo text: ")

	todo, err := todo.New(todoText)

	if err != nil {
		fmt.Println("Error creating data:", err)
		return
	}

	err = outputData(todo)

	if err != nil {
		fmt.Println("Error saving data:", err)
		return
	}

	userNote, err := note.New(title, content)

	if err != nil {
		fmt.Println("Error:", err)
		return
	}
  
  outputData(userNote)
}
```
Et penser à gérer l'erreur pour éviter un éventuel crash.

## Le type interface{} (ou any)

prenons en exemple la fonction suivante : 
```Go
func printSomething(value interface{}) {
  fmt.Println(value)
}
```
Dans cette fonction, le paramètre accepte une valeur de type `interface{}`.  
Cela signifie que `value` peut être de n'importe quel type choisi : `int`, `float64`, `string`, `bool`, etc.  

Il faut faire attention avec de type, puisqu'on pourrait accepter des valeurs qu'on ne veut pas forcément gérer. 

Cela permet toutefois d'avoir une grande flexibilité.

__*N.B. : le type `interface{}` peut être remplacé par le type `any`.__

## Travailler avec les `Switches` de type

Dans le cas ou on souhaite avoir une fonction qui prends en paramètre une valeur de plusieurs types possibles, on peut travailler avec le `switch case` sur le type des valeurs.

Pour cela, on va utiliser cette syntaxe : 
```Go
func printSomething(value interface{}) {
  switch value.(type) {
    case int:
      // ...
    case float64:
      // ...
    case string:
      // ...
    default:
      // fallback logic
  }
  fmt.Println(value)
}
```
Dans notre cas, `switch value.(type)` indique qu'on va travailler avec le type de la variable `value`.  
on va traiter différents cas, ici `int`, `float64`, `string`, et un cas par défaut qui gère tous les autres types.  
N.B.: le `default` n'est pas obligatoire si on ne souhaite pas gérer les autres cas.

## Extraire l'information sur le type d'une valeur

Prennons cette syntaxe : `typedVal, ok := value.(int)`  
nous avons deux variables : 
* `typedVal` : une variable du type demandé `int` dans notre cas. 
* `ok` : une variable de type `bool` qui va retourner 
  * `true` si le type de la valeur testée est bien de type `int` (dans notre cas), 
  * ou `false` dans le cas contraire.  
_N.B.: `ok` peut prendre n'importe quel nom descriptif, par exemple : `valueIsInt`_

Cette syntaxe permet d'effectuer une vérification sur le type de la donnée  
pour ensuite effectuer des opération logiques en rapport avec le type de la donnée.

Exemple :
```Go
func printSomething(value interface{}) {
  intVal, ok := value.(int)
  if ok {
    // ajouter une logique en rapport avec le type de la donnée : int
  }

  stringVal, ok := value.(string)
  if ok {
    // ajouter une logique en rapport avec le type de la donnée : string
  }
}
```

## Interface, types dynamiques et limites

Le type générique `interface{}` ou `any` permet beaucoup de flexibilité.  
Mais cela a aussi ses limites.

Exemple : 
```Go
func add(a, b interface{}) {
  return a + b
}
```
Dans cet exemple, la fonction `add()` prends en paramètres deux variable de n'importe quel type,  
de sorte qu'on pourrait ajouter deux `float64`, deux `int` ou même deux `string`.  

Mais cela n'est pas possible car l'opération `+` n'est pas défini sur une variable de type `interface{}`.  
On pourrait effectuer une vérification de la donnée grâce à cette syntaxe : `typedVal, isInt := value.(int)`,  
mais il faudrait également spécifier un type de valeur de retour, et on perdrait l'intérêt du type `interface{}`.  
On peut alors spécifier le type de retour de cette manière : 
```Go
func add(a, b interface{}) interface{} {
  aInt, aIsInt := a.(int)
  bInt, bIsInt := b.(int)
  
  if aIsInt && bIsInt {
    return aInt + bInt
  }

  // même logique pour float64 ou string...

  return nil
}
```
Cela fait au final beaucoup de code. Pour palier à cela, Go permet l'utilisation des `génériques`.

## Introduction aux `génériques`

Le concept des `génériques` permet de solutionner des problèmes tels que ceux vu au point précédent. 

Le problème avec le type `interface{}` est qu'on accepte n'importe quel type de donnée.  
Cela manque de spécification: 
```Go
func main() {
  result := add(1, 2)

  result + 1
}

func add(a, b interface{}) interface{} {
  aInt, aIsInt := a.(int)
  bInt, bIsInt := b.(int)
  
  if aIsInt && bIsInt {
    return aInt + bInt
  }

  // même logique pour float64 ou string...

  return nil
}
```
l'opération arithmétique `result + 1` n'est pas possible dans notre cas puisque result est de type `interface{}` et ne comprends pas que `result` et `1` sont en réalité du même type.

L'idée est donc de modifier la fonction `add()` en une fonction générique.
La syntaxe de cette fonction est la suivante : 
```Go
func add[T any](a, b T) T {
  return a + b
}
```
* on ajoute à la fonction add un `placeholder de type` avec les crochets `[]`
* le placeholder va accepter un nom : `T` (par convention) de type `any` (ou `interface{}`)
* on spécifie le type des variables acceptées en paramètre : `T`
* et enfin le type de la variable retournée : `T`

Cette syntaxe indique que le type sera géré directement lors de l'appel de la fonction. 

N.B. : On peut utiliser autant de types qu'on le souhaite dans le placeholder : `func add[T any, K any](a, b T) K`.  

Dans le cas de notre fonction `add()`, on va toujours recevoir une erreur lors de l'opération arithmétique `a + b`.  
C'est parce que cette opération n'est pas définie dans le type `any`.  
Il va falloir spécifier les types acceptés par la fonction de cette manière : 
```Go
func add[T int | float64 | string](a, b T) T {
  return a + b
}
```
On spécifie donc que `T` peut être soit `int`, `float64` ou `string`.  
Cela permet d'effectuer l'opération arithmétique souhaitée : `+` :
```Go
func main() {
	result := add(5, 10)
	fmt.Println("Result of adding integers:", result)

	resultFloat := add(5.5, 10.2)
	fmt.Println("Result of adding floats:", resultFloat)
	
	resultString := add("Hello, ", "World!")
	fmt.Println("Result of adding strings:", resultString)
}
```
Cela est particulièrement utile lorsqu'on écrit une librairie qui sera utilisée par d'autre personnes.