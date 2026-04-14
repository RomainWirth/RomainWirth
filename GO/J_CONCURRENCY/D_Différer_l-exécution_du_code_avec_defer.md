# Déferrer l'exécution avec `"defer"`

## Introduction

`defer` est un mot-clé Go qui permet de **différer l'exécution d'une fonction** : au lieu d'appeler la fonction immédiatement, Go la met en attente et l'exécutera **juste avant que la fonction encapsulante retourne**, qu'elle se termine normalement ou avec une erreur.

C'est un mécanisme de nettoyage (*cleanup*) conçu pour garantir que certaines opérations - fermer un fichier, libérer une ressource, déverrouiller un mutex - seront **toujours exécutées**, même si la fonction se termine prématurément via un `return` anticipé.

> La devise : **"ouvre une ressource, puis `defer` sa fermeture immédiatement."** Cela évite d'oublier la fermeture, et s'assure qu'elle aura lieu dans tous les cas d'exécution possibles.

## Le problème : fermetures manuelles répétées et fragiles

On va retourner sur le package `filemanager.go` de notre exercice sur le [calcul des prix](../I_PROJET_PRATIQUE_CALCULATEUR_DE_PRIX/A_SUMMARY.md).

Dans les méthodes de ce package (`ReadLines()` et `WriteResult()`), on ferme manuellement le fichier avec `file.Close()`. Cette approche présente deux problèmes :

1. **Oubli facile** : si on ajoute un `return` anticipé (en cas d'erreur), il faut penser à appeler `file.Close()` avant *chaque* point de sortie de la fonction.
2. **Duplication** : on finit par appeler `file.Close()` à plusieurs endroits, ce qui alourdit le code et introduit des risques d'incohérence.

## La solution : `defer`

En préfixant l'appel de `file.Close()` avec `defer`, on délègue à Go la responsabilité d'appeler cette fonction au bon moment. On l'écrit **une seule fois**, juste après l'ouverture du fichier, et Go s'assure qu'elle sera exécutée à la sortie de la fonction, peu importe comment elle se termine.

### Application à `ReadLines()`

```Go
func (fm FileManager) ReadLines() ([]string, error) {
	file, err := os.Open(fm.InputFilePath)
	if err != nil {
		return nil, errors.New("Erreur d'ouverture du fichier")
	}

	defer file.Close() // sera appelé automatiquement à la fin de ReadLines(), dans tous les cas

	scanner := bufio.NewScanner(file)

	var lines []string

	for scanner.Scan() {
		lines = append(lines, scanner.Text())
	}

	err = scanner.Err()
	if err != nil {
		// file.Close() - plus nécessaire : defer s'en charge
		return nil, errors.New("Erreur lors de la lecture du fichier")
	}

	// file.Close() - plus nécessaire : defer s'en charge
	return lines, nil
}
```

`defer file.Close()` est enregistré dès que le fichier est ouvert avec succès. Qu'on atteigne le `return nil, errors.New(...)` sur l'erreur de scanner ou le `return lines, nil` final, `file.Close()` sera appelé dans les deux cas.

### Application à `WriteResult()`

```Go
func (fm FileManager) WriteResult(data any) error {
	file, err := os.Create(fm.OutputFilePath)
	if err != nil {
		return errors.New("Erreur de création du fichier")
	}

	defer file.Close() // sera appelé automatiquement à la fin de WriteResult(), dans tous les cas

	time.Sleep(3 * time.Second)

	encoder := json.NewEncoder(file)
	err = encoder.Encode(data)
	if err != nil {
		// file.Close() - plus nécessaire : defer s'en charge
		return errors.New("Erreur d'écriture dans le fichier")
	}

	// file.Close() - plus nécessaire : defer s'en charge
	return nil
}
```

## Comportement de `defer` : ce qu'il faut savoir

- **Ordre d'exécution LIFO** : si plusieurs `defer` sont empilés dans une même fonction, ils s'exécutent dans l'ordre inverse de leur déclaration (le dernier `defer` déclaré s'exécute en premier). C'est utile quand les ressources doivent être libérées dans l'ordre inverse de leur acquisition.
- **Les arguments sont évalués immédiatement** : la fonction est différée, mais ses arguments sont capturés au moment de la déclaration du `defer`, pas au moment de son exécution.
- **`defer` et `return`** : `defer` s'exécute *après* que la valeur de retour est calculée, mais *avant* que la fonction retourne effectivement à l'appelant. Dans les fonctions avec des valeurs de retour nommées, `defer` peut même modifier la valeur retournée.
- **`defer` ne s'exécute pas si le programme se termine avec `os.Exit()`** : il est réservé aux retours de fonctions normaux.

## Résumé

| Sans `defer` | Avec `defer` |
|---|---|
| `file.Close()` à chaque point de sortie | Un seul `defer file.Close()` après l'ouverture |
| Risque d'oubli sur les `return` anticipés | Exécution garantie dans tous les cas |
| Code dupliqué et fragile | Code concis et robuste |

`defer` est le pattern Go privilégié pour toute gestion de ressources : fichiers, connexions réseau, verrous de concurrence (`sync.Mutex`), etc. La règle est simple : **dès qu'on ouvre une ressource, on `defer` immédiatement sa fermeture.**
