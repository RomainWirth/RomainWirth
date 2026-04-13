# EXTERNALISER DES TRAITEMENTS DANS LEUR PROPRES PACKAGES

## Externaliser la logique de partage dans un package

### Pourquoi externaliser dans un package dédié ?

Lorsqu'une fonction appartenant à un package commence à regrouper plusieurs responsabilités distinctes (lire un fichier, parser des données, calculer des prix…), elle devient difficile à maintenir, à tester et à réutiliser.

Le principe de **responsabilité unique** (Single Responsibility Principle) stipule qu'une unité de code ne devrait avoir qu'une seule raison de changer. En Go, les **packages** sont le mécanisme naturel pour isoler et encapsuler ces responsabilités.

Externaliser une logique dans son propre package apporte plusieurs avantages :

- **Réutilisabilité** : la fonction `StringsToFloats()` n'est plus liée au domaine des prix - n'importe quel autre package du projet peut l'importer et s'en servir.
- **Testabilité** : une fonction pure, sans dépendance externe (pas de fichier, pas de réseau), est triviale à tester unitairement avec des cas nominaux et des cas d'erreur.
- **Lisibilité** : `LoadData()` exprime clairement son intention (charger des données) sans noyer le lecteur dans les détails d'une conversion numérique.
- **Maintenabilité** : si le format des prix change (ex. virgule à la place du point), il suffit de modifier le package `conversion` sans toucher au package `prices`.

### Point de départ : `LoadData()` mélange deux responsabilités

Dans le package `prices`, la méthode `LoadData()` est actuellement comme ceci : elle lit un fichier ligne par ligne **et** convertit chaque ligne en `float64`. Ces deux opérations sont de natures différentes et méritent d'être séparées.
```GO
func (job *TaxIncludedPriceJob) LoadData() {
	// ouverture du fichier contenant les prix HT
	file, err := os.Open("prices.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}

	// scanner pour lire le fichier ligne par ligne
	scanner := bufio.NewScanner(file)

	var lines []string

	// lecture de chaque ligne jusqu'à la fin du fichier
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// vérification d'une éventuelle erreur survenue pendant le scan
	err = scanner.Err()
	if err != nil {
		fmt.Println("Erreur lors de la lecture du fichier :", err)
		file.Close()
		return
	}

	// allocation d'une slice de float64 de la même taille que le nombre de lignes lues
	prices := make([]float64, len(lines))

	for lineIndex, line := range lines {
		// conversion de la ligne texte en float64 (précision 64 bits)
		floatPrice, err := strconv.ParseFloat(line, 64)

		if err != nil {
			// format invalide : fermeture du fichier et abandon du traitement
			fmt.Printf("Erreur de conversion du prix à la ligne %d : %s\n", lineIndex+1, err)
			file.Close()
			return
		}

		prices[lineIndex] = floatPrice
	}

	// mise à jour du job avec les prix lus depuis le fichier (possible grâce au récepteur pointeur)
	job.InputPrices = prices
}
```

### Étape 1 - Créer le package `conversion`

On crée un nouveau dossier `conversion/` à la racine du module, contenant un fichier `conversion.go`. Ce package n'a qu'une responsabilité : convertir des types de données, sans rien savoir des prix ni des fichiers.

On commence par déclarer la signature de la fonction. Elle reçoit une slice de chaînes de caractères et retourne une slice de `float64` ainsi qu'une erreur (idiome Go pour la gestion d'erreurs) :
```GO
package conversion

func StringsToFloats(strings []string) ([]float64, error) {
  // ... implémentation
}
```

### Étape 2 - Implémenter `StringsToFloats()`

On extrait la boucle de conversion depuis `LoadData()` et on l'adapte pour qu'elle soit générique : elle ne dépend plus d'un index ou d'un contexte particulier. En cas d'erreur de parsing, on retourne immédiatement `nil` et une erreur explicite - ce qui est la convention Go pour signaler un échec sans paniquer.
```GO
package conversion

func StringsToFloats(strings []string) ([]float64, error) {
  var floats []float64

	for _, stringVal := range strings {
		floatVal, err := strconv.ParseFloat(stringVal, 64)

		if err != nil {
			// la valeur n'est pas un nombre valide : on interrompt la conversion et on remonte l'erreur
			return nil, errors.New("Erreur de conversion en float")
		}

		floats = append(floats, floatVal)
	}

	return floats, nil
}
```

> **Note** : on utilise `append` plutôt qu'un `make` avec index. Cela simplifie le code et reste efficace pour des volumes de données raisonnables.

### Étape 3 - Mettre à jour `LoadData()` pour déléguer la conversion

`LoadData()` n'a plus qu'à appeler `conversion.StringsToFloats()` après la lecture des lignes. Elle reste responsable de l'accès au fichier, et délègue entièrement la conversion à un package spécialisé. Le contrat est clair : si la conversion échoue, on ferme le fichier et on remonte l'erreur.
```GO
// En cas d'erreur d'ouverture, de lecture ou de conversion, un message est affiché et la fonction retourne.
func (job *TaxIncludedPriceJob) LoadData() {
	// ouverture du fichier contenant les prix HT
	file, err := os.Open("prices.txt")
	if err != nil {
		fmt.Println("Erreur lors de l'ouverture du fichier :", err)
		return
	}

	// scanner pour lire le fichier ligne par ligne
	scanner := bufio.NewScanner(file)

	var lines []string

	// lecture de chaque ligne jusqu'à la fin du fichier
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// vérification d'une éventuelle erreur survenue pendant le scan
	err = scanner.Err()
	if err != nil {
		fmt.Println("Erreur lors de la lecture du fichier :", err)
		file.Close()
		return
	}

	prices, err := conversion.StringsToFloats(lines)

	if err != nil {
		// échec de la conversion : fermeture du fichier et abandon du traitement
		fmt.Println(err)
		file.Close()
		return
	}

	// mise à jour du job avec les prix lus depuis le fichier (possible grâce au récepteur pointeur)
	job.InputPrices = prices
	file.Close()
}
```

### Bilan

| Avant | Après |
|---|---|
| `LoadData()` gère lecture **et** conversion | `LoadData()` gère uniquement la lecture |
| Logique de conversion couplée au package `prices` | Logique de conversion isolée dans `conversion` |
| Impossible de réutiliser la conversion ailleurs | `StringsToFloats()` réutilisable dans tout le module |
| Difficile à tester unitairement | `StringsToFloats()` testable sans fichier ni dépendance |

## Externaliser les accès au fichier dans un package

### Pourquoi séparer l'accès au fichier du domaine métier ?

Après la section précédente, `LoadData()` délègue désormais la conversion à `conversion.StringsToFloats()`. Mais elle conserve encore une responsabilité qui n'a rien à voir avec les prix : **ouvrir et lire un fichier sur le système de fichiers**.

Ce couplage pose un problème de conception : le package `prices` doit connaître l'existence d'un fichier, son chemin, et les détails de `bufio.Scanner`. Si demain les prix sont lus depuis une base de données ou une API, il faudra modifier `prices` - alors qu'il ne devrait s'occuper que du calcul des prix TTC.

C'est le concept de **Séparation des préoccupations** (Separation of Concerns, SoC) : chaque couche de l'application ne doit connaître que ce dont elle a besoin pour accomplir sa mission. En JavaScript, on retrouve ce même principe avec les modules utilitaires (`utils/`) ou les services dédiés à l'I/O. En Go, on l'exprime via les packages.

En pratique, cela signifie :

- Le package `filemanager` sait lire des fichiers - il ne sait rien des prix.
- Le package `conversion` sait convertir des chaînes en nombres - il ne sait rien des fichiers.
- Le package `prices` orchestre ces deux packages pour accomplir sa mission métier.

Chaque package est **atomique** : il fait une seule chose, et il la fait bien.

### Point de départ : `LoadData()` accède encore directement au système de fichiers

Même après le refactoring précédent, `LoadData()` continue d'ouvrir le fichier, d'instancier un scanner et de gérer les erreurs d'I/O. Cette logique d'accès au fichier doit être extraite dans son propre package.

### Étape 1 - Créer le package `filemanager`

On crée un dossier `filemanager/` contenant un fichier `filemanager.go`. Ce package expose une seule fonction publique : `ReadLines()`. On commence par en définir la signature - elle reçoit un chemin de fichier en paramètre, ce qui la rend réutilisable pour n'importe quel fichier texte dans l'application :
```GO
package filemanager

func ReadLines() {
	// ... implémentation
}
```

### Étape 2 - Implémenter `ReadLines()`

On extrait le code d'accès au fichier depuis `LoadData()` et on l'adapte. La fonction accepte maintenant un `path string` en paramètre au lieu d'un nom de fichier codé en dur - c'est ce qui la rend générique. En cas d'erreur, elle retourne `nil` et une erreur (convention Go), sans afficher quoi que ce soit : c'est l'appelant qui décide comment gérer l'erreur.

> **Fermeture du fichier** : on ferme explicitement le fichier avec `file.Close()` à chaque point de sortie (erreur ou succès). Il n'y a pas de `defer file.Close()` ici, car en cas d'erreur lors du scan, on veut fermer avant de retourner.
```GO
package filemanager

import (
	"bufio"
	"errors"
	"os"
)

func ReadLines(path string) ([]string, error) {
	// ouverture du fichier au chemin spécifié
	file, err := os.Open(path)
	if err != nil {
		return nil, errors.New("Erreur d'ouverture du fichier")
	}

	// scanner pour lire le fichier ligne par ligne
	scanner := bufio.NewScanner(file)

	var lines []string

	// lecture de chaque ligne jusqu'à la fin du fichier
	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	// vérification d'une éventuelle erreur survenue pendant le scan
	err = scanner.Err()
	if err != nil {
		file.Close()
		return nil, errors.New("Erreur lors de la lecture du fichier")
	}

	file.Close()
	return lines, nil
}
```

### Étape 3 - Simplifier `LoadData()` en déléguant la lecture

`LoadData()` n'a plus qu'une seule ligne d'I/O : l'appel à `filemanager.ReadLines()`. Toute la gestion du fichier (ouverture, scanner, fermeture) a disparu. La méthode est réduite à son essence : récupérer des lignes, les convertir, mettre à jour le job.
```GO
func (job *TaxIncludedPriceJob) LoadData() {
	lines, err := filemanager.ReadLines("prices.txt")
	if err != nil {
		fmt.Println(err)
		return
	}

	prices, err := conversion.StringsToFloats(lines)

	if err != nil {
		fmt.Println(err)
		return
	}

	job.InputPrices = prices
}

```

### Bilan de l'architecture finale

Après ces deux refactorings, chaque package a une responsabilité clairement définie :

| Package | Responsabilité | Dépendances |
|---|---|---|
| `filemanager` | Lire un fichier texte ligne par ligne | `os`, `bufio` |
| `conversion` | Convertir des `[]string` en `[]float64` | `strconv`, `errors` |
| `prices` | Orchestrer le chargement et le calcul des prix TTC | `filemanager`, `conversion` |

`LoadData()` est maintenant une fonction d'**orchestration** : elle ne contient plus aucune logique d'implémentation, uniquement des appels à des packages spécialisés et la gestion de leurs erreurs.

---

## Résumé des concepts abordés

### Single Responsibility Principle (SRP)

Chaque unité de code - fonction, fichier, package - ne devrait avoir qu'**une seule raison de changer**. Lorsqu'on détecte qu'une fonction mélange plusieurs préoccupations (lire un fichier, convertir des données, calculer un résultat), c'est le signal qu'il faut découper.

### Séparation des préoccupations (Separation of Concerns, SoC)

Les différentes couches d'une application doivent être isolées les unes des autres. La couche I/O (accès au fichier) ne doit pas être mélangée à la couche métier (calcul des prix). En Go, les **packages** sont le mécanisme naturel pour matérialiser cette séparation.

### Package atomique

Un package est dit **atomique** lorsqu'il accomplit exactement une mission, sans dépendre de détails qui appartiennent à d'autres domaines. Les packages `filemanager` et `conversion` sont des exemples de packages atomiques : ils sont génériques, autonomes et réutilisables.

### Réutilisabilité

En extrayant une logique dans un package dédié, on la rend disponible à l'ensemble du module sans duplication de code. Si un deuxième package a besoin de lire des fichiers ou de convertir des chaînes, il lui suffit d'importer `filemanager` ou `conversion`.

### Testabilité

Une fonction pure - sans effets de bord, sans dépendance au système de fichiers ou au réseau - est directement testable avec des données en mémoire. `StringsToFloats()` peut être testée avec un simple `[]string{"1.5", "2.0"}` sans avoir à créer de fichier. C'est l'un des bénéfices directs de la séparation des préoccupations.

### Fonction d'orchestration

Après refactoring, `LoadData()` ne contient plus aucune logique d'implémentation : elle appelle des packages spécialisés, gère leurs erreurs et met à jour l'état du job. Ce rôle de **chef d'orchestre** est un pattern courant dans les architectures en couches : la couche supérieure coordonne, les couches inférieures exécutent.

