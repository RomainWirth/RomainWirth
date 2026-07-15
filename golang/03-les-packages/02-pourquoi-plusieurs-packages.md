# B. POURQUOI UTILISER PLUS D'UN PACKAGE ? 

Dans le cas d'un projet de plus grande envergure, on va séparer le projet en différents dossiers pour conserver une `architecture clean`.  
Par exemple, il est tout à fait possible de créer un `package utility` qu'on pourra utiliser au travers de plusieurs projets.  

Dans le cas d'un `package utility`, il est nécessaire de rendre les fonctions plus plus génériques possible pour qu'elles soient réutilisables au travers de l'application. 

les fonctions `writeBalanceToFile()` et `getBalanceFromFile()` vont être modifiées en deux fonctions génériques : 
* `writeFloatToFile()`
* `getFloatFromFile()`

```Go
func writeFloatToFile(value float64, fileName string) {
	valueText := fmt.Sprint(value)
	os.WriteFile(fileName, []byte(valueText), 0644)
}

func getFloatFromFile(fileName string) (float64, error) {
	data, err := os.ReadFile(fileName)
	if err != nil {
		return 0, errors.New("failed to find file")
	}

	valueText := string(data)
	value, err := strconv.ParseFloat(valueText, 64)

	if err != nil {
		return 0, errors.New("failed to parse stored value")
	}
	return value, err
}
```
On va leur ajouter en paramètre `fileName string` pour qu'elles reçoivent le nom du fichier dans qui va être créé. 

On créera ensuite un dossier qui va contenir le fichier qui contiendra ce code :  
```bash
Structure de l'application :

| app.go  
| communication.go  
| file-operations  
| | file-operations.go  
| balance.txt  
| control-structures  
| go.md  
```
le fichier `file-operations.go` aura cette structure : 
```Go
package fileoperations

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

func WriteFloatToFile(value float64, fileName string) {
	valueText := fmt.Sprint(value)
	os.WriteFile(fileName, []byte(valueText), 0644)
}

func GetFloatFromFile(fileName string) (float64, error) {
	data, err := os.ReadFile(fileName)
	if err != nil {
		return 0, errors.New("failed to find file")
	}

	valueText := string(data)
	value, err := strconv.ParseFloat(valueText, 64)

	if err != nil {
		return 0, errors.New("failed to parse stored value")
	}
	return value, err
}
```
**À noter que les fonctions sont écrite ici avec la première lettre en `majuscules`.**  
C'est parce que Go permet d'importer des fonctions d'autres packages uniquement si ces dernières sont écrites avec une première lettre en **majuscule**.

> **Règle fondamentale** : en Go, la visibilité est contrôlée par la **casse** du premier caractère :
> - `MaFonction` → **exportée** (accessible depuis d'autres packages)
> - `maFonction` → **non exportée** (privée au package courant)

Cette convention s'applique aux fonctions, variables, constantes et types.

---

## Résumé

- Séparer le code en **packages distincts** favorise la réutilisabilité et une architecture claire.
- Un package utilitaire (ex. `fileoperations`) regroupe des fonctions génériques indépendantes du domaine métier.
- Pour être réutilisables entre packages, les fonctions doivent accepter leurs dépendances en **paramètres** (pas de constantes globales codées en dur).
- La **convention de nommage** Go contrôle la visibilité : `MaFonction` (majuscule) = exportée ; `maFonction` (minuscule) = privée.
- Le nom du package est déclaré en haut du fichier : `package fileoperations` (pas d'underscores, tout en minuscules par convention).