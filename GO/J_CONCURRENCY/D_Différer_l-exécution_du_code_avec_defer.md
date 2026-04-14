# Déferrer l'exécution avec `"defer"`

Il existe une dernière fonctionnalité liée à la concurrence qui peut être utile lorsqu'on travaille avec Go.

On va retourner sur le package `filemanager.go` de notre exercice sur le [calcul des prix](../I_PROJET_PRATIQUE_CALCULATEUR_DE_PRIX/A_SUMMARY.md).

Dans les méthodes de ce package (`ReadLines()` et `WriteResult()`), on ferme manuellement le fichier avec la fonction Close : `file.Close()`.
Cette façon de faire n'est pas optimale puisqu'on peut vite oublier d'appeler la fonction pour fermer le fichier.

On va donc appliquer la meilleure manière de fermer un fichier en utilisant un mot-clé spécial : `defer`.
On va toujours appeler `file.Close()`, mais en ajoutant `defer` devant l'appel :
```Go
func (fm FileManager) ReadLines() ([]string, error) {
	file, err := os.Open(fm.InputFilePath)
	if err != nil {
		return nil, errors.New("Erreur d'ouverture du fichier")
	}

	defer file.Close()

	scanner := bufio.NewScanner(file)

	var lines []string

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	err = scanner.Err()
	if err != nil {
		// file.Close()
		return nil, errors.New("Erreur lors de la lecture du fichier")
	}

	// file.Close()
	return lines, nil
}
```

En utilisant `defer`, Go va mettre en attente la fonction `file.Close()` et attendre que la méthode encapsulante termine son exécution (à cause d'une erreur ou non), en l'occurence : `ReadLines()`.
De cette manière, Go va appeler la fonction au moment souhaité, sans qu'on ait à se soucier d'ajouter l'appel de la fonction au bon endroit. Cela permet également de n'appeler qu'une seule fois la méthode.

On pourra également appliquer cela à la méthode `WriteResult()` :
```Go
func (fm FileManager) WriteResult(data any) error {
	file, err := os.Create(fm.OutputFilePath)
	if err != nil {
		return errors.New("Erreur de création du fichier")
	}

	defer file.Close()

	time.Sleep(3 * time.Second)

	encoder := json.NewEncoder(file)
	err = encoder.Encode(data)
	if err != nil {
		// file.Close()
		return errors.New("Erreur d'écriture dans le fichier")
	}

	// file.Close()
	return nil
}
```
