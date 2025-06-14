# EXERCICE : CRÉER UNE APPLICATION POUR SAUVEGARDER DES USER INPUTS DANS UN JSONFILE

Dans un nouveau projet intitulé `note` :
* Créer un fichier `main.go` qui contient le package `main`
* Ajouter une fonction `getUserInput()` : 
  * Qui prendra en paramètre une variable de type `string`.
  * Qui retournera une `string`.
  * Cette fonction va devoir récupérer l'input de l'utilisateur via le package standard `bufio` et la méthode `NewReader()`.
  * La variable retournée devra être Trim grâce à la méthode `TrimSuffix()` du package standard `strings`.
* Ajouter également une fonction `getNoteData()` :
  * Cette fonction va retourner deux `string` : title et content
  * title et content vont recevoir le résultat de la fonction `getUserInput()`
* la fonction `main()` : 
  * va faire appel à la fonction `getNoteData()` et stocker les valeurs dans deux variables title et content. 

* Dans un package `note` (créer un dossier intitulé `note` et un fichier `note.go`) :
  * créer le type struct `Note` composé de : 
    * title de type `string`, 
    * content de type `string` 
    * et createdAt de type `time.Time`.
  * créer une fonction constructeur `New()` qui doit retourner une variable de type struct `Note` et une variable de type `error`.
  * créer une méthode `display()` accessible en dehors du package `note`  
  cette méthode va simplement afficher dans la console un texte contenant le titre et le contenu. (package fmt avec la fonction `Printf`)
  * créer une méthode `Save()` qui va sauvegarder le contenu de l'input dans un fichier `.json` :
    * utiliser le package `strings` et les méthodes :
      * `ReplaceAll()` pour supprimer les espaces et autres caractères spéiaux du title
      * `ToLower()` pour mettre en minuscule le nom du fichier
      * penser à ajouter l'extension `.json` à la fin du nom du fichier
    * encoder au format json le contenu du struct grâce au package `json` et la méthode `Marshal()`.
    * retourner le résultat de la méthode `.WriteFile()` du package `os` 

ATTENTION: 
* Bien penser à la portée et à l'accessibilité des données
* Bien penser à gérer les erreurs
* Au démarrage du projet, utiliser les commandes `go mod example.com/name` puis `go build` pour pouvoir run l'application avec la commande `go run .`.
* Bien appliquer les struct tags pour formatter le fichier json.

<details>
<summary style="font-weight:bold">Correction</summary>

Structure de l'app : 
```
| main.go
| go.mod
| learn_go.json
| note
| | note.go
```
fichier main.go :
```Go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"example.com/go-starting-module/note"
)

func main() {
	title, content := getNoteData()

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

func getUserInput(prompt string) string {
	fmt.Printf("%v ", prompt)

	reader := bufio.NewReader(os.Stdin)
	text, err := reader.ReadString('\n')

	if err != nil {
		fmt.Println("Error reading input:", err)
		return ""
	}

	text = strings.TrimSuffix(text, "\n")
	text = strings.TrimSuffix(text, "\r")

	return text
}

func getNoteData() (string, string) {
	title := getUserInput("Note title :")
	content := getUserInput("Note content :")

	return title, content
}
```
fichier note.go
```Go
package note

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"
)

type Note struct {
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func (note Note) Display() {
	fmt.Printf("Your note titled %v has the following content:\n\n%v\n\n", note.Title, note.Content)
}

func (note Note) Save() error {
	fileName := strings.ReplaceAll(note.Title, " ", "_")
	fileName = strings.ToLower(fileName) + ".json"

	json, err := json.Marshal(note)

	if err != nil {
		fmt.Println("Error marshalling note:", err)
		return err
	}

	return os.WriteFile(fileName, json, 0644)
}

func New(title, content string) (Note, error) {
	if title == "" || content == "" {
		return Note{}, errors.New("invalid input")
	}

	return Note{
		Title:     title,
		Content:   content,
		CreatedAt: time.Now(),
	}, nil
}
```
Output dans le terminal : 
```
go run .

Note title : Learn Go    
Note content : Blablablabla
Your note titled Learn Go has the following content:

Blablablabla

Note saved successfully!
```
Et un nouveau fichier `learn_go.json` contenant ceci : 
```json
{"title":"Learn Go","content":"Blablablabla","created_at":"2025-06-10T18:25:06.162833117+02:00"}
```
</details>