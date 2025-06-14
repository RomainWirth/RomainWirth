# A. QU'EST CE QU'UNE INTERFACE ?

Prenons en exemple le code suivant : 
```Go
func main() {
	title, content := getNoteData()
	todoText := getUserInput("Todo text: ")

	todo, err := todo.New(todoText)

	if err != nil {
		fmt.Println("Error creating todo:", err)
		return
	}

	todo.Display()
	err = todo.Save()

	if err != nil {
		fmt.Println("Error saving todo:", err)
		return
	}

	fmt.Println("Todo saved successfully!")

	userNote, err := note.New(title, content)

	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	userNote.Display()
	err = userNote.Save()

	if err != nil {
		fmt.Println("Error saving note:", err)
		return
	}

	fmt.Println("Note saved successfully!")
}
```
On peut remarquer une répétition dans le code à partir du moment ou on sauvegarde les informations : 
```Go
todo.Display()
err = todo.Save()

if err != nil {
	fmt.Println("Error saving todo:", err)
	return
}

fmt.Println("Todo saved successfully!")

//...

userNote.Display()
err = userNote.Save()

if err != nil {
	fmt.Println("Error saving note:", err)
	return
}

fmt.Println("Note saved successfully!")
```
On pourrait créer une fonction `saveData()` qui permettrait de sauvegarder la donnée,  
mais quel paramètre lui passer ? data de type `todo.Toto`, ou de type `note.Note` ?  
Il n'est pas possible de passer les deux types dans un seul argument.  
__*C'est ici que l'interface entre en jeu*__

Une interface est une sorte de contrat qui garantis qu'un `struct` possède une certaine méthode.  

# B. CRÉER UNE INTERFACE

#### Déclaration d'une interface

Voici la syntaxe pour déclarer une interface :
```Go
type name interface {
  MethodName(type, type) type
}
```
Une interface ne possède pas de corps de fonction. Elle définit simplement l'existance d'une méthode : 
* son nom
* les types des paramètres acceptés par la méthode
* les types des valeurs de retour

Appliqué à notre exemple :
```Go
type saver interface {
	Save() error
}
```
* Nous avons une `interface` appelée `saver`.
* Elle fait appel à la méthode `Save()`, 
* Méthode qui retourne une valeur de type `error`.  
N.B. : dans notre exemple, la méthode `Save()` ne prends pas de paramètres.

Par convention, lorsqu'une interface ne fait référence qu'à une seule méthode, on va simplement ajouter `er` à la fin du nom :  
* Save > Saver
* Display > Displayer
