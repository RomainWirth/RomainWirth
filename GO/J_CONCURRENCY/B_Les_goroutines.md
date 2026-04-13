# GOROUTINES

## Introduction : le problème de l'exécution séquentielle

Par défaut, un programme Go exécute les instructions **séquentiellement** : chaque appel de fonction bloque l'exécution jusqu'à ce qu'elle se termine, puis la suivante commence.

Dans la plupart des cas, ce comportement est parfaitement adapté. Mais certaines opérations sont intrinsèquement lentes : lecture réseau, accès disque, appel à une API externe, calcul intensif… Si ces opérations sont indépendantes les unes des autres, les exécuter l'une après l'autre est un gaspillage de temps.

C'est là qu'interviennent les **goroutines** : elles permettent de lancer une fonction de manière **non bloquante**, pour que l'exécution du programme continue immédiatement sans attendre le résultat.

### Exemple : exécution séquentielle bloquante

```Go
package main

import (
	"fmt"
	"time"
)

func greet(phrase string) {
  fmt.Println("hello !", phrase)
}

func slowGreet(phrase string) {
  time.Sleep(3 * time.Second) // simule une opération lente (réseau, disque...)
  fmt.Println("hello !", phrase)
}

func main() {
  greet("Heureux de te rencontrer !")
  greet("Comment vas-tu ?")
  slowGreet("Comment ... vas ... tu ... ?")  // bloque ici pendant 3 secondes
  greet("j'espère que tu aimes ce cours !") // attend la fin de slowGreet
}
```

En lançant ce programme avec `go run .`, les deux premières fonctions s'exécutent quasi-instantanément, puis le programme se fige 3 secondes sur `slowGreet`, et seulement après reprend. Pourtant, aucune de ces fonctions ne dépend du résultat des autres : elles pourraient toutes tourner en même temps.

## Lancer une goroutine avec le mot-clé `go`

Il suffit d'ajouter le mot-clé **`go`** devant un appel de fonction pour que Go l'exécute dans une nouvelle goroutine - c'est-à-dire de manière **concurrente**, en parallèle du reste du programme.

```Go
func main() {
  go greet("Heureux de te rencontrer !")
  go greet("Comment vas-tu ?")
  go slowGreet("Comment ... vas ... tu ... ?")
  go greet("j'espère que tu aimes ce cours !")
}
```

En lançant ce programme, on remarque qu'il se termine **instantanément** - et qu'on ne voit rien dans la console.

## Comprendre le comportement des goroutines

### Exécution non bloquante

Lorsqu'on appelle une fonction avec `go`, Go **dispatche** la tâche vers le scheduler (ordonnanceur) et passe immédiatement à la ligne suivante, sans attendre que la goroutine se termine. C'est le comportement fondamental d'une goroutine :

> Une goroutine ne retourne pas de valeur à son appelant, et l'appelant n'attend pas sa fin.

### Pourquoi rien ne s'affiche ?

Quand `main()` termine, **le programme entier s'arrête** - y compris toutes les goroutines en cours d'exécution, qu'elles aient terminé ou non. C'est le comportement garanti par Go : la fonction `main()` est elle-même la goroutine principale, et sa fin entraîne la fin du processus.

Dans l'exemple ci-dessus, `main()` dispatche les quatre goroutines et se termine presque immédiatement. Les goroutines n'ont pas eu le temps de s'exécuter.

### Goroutine vs thread

Une goroutine **n'est pas un thread système**. Go gère son propre scheduler qui multiplex les goroutines sur un pool de threads OS (contrôlé par `GOMAXPROCS`, qui vaut par défaut le nombre de cœurs disponibles). Cela permet de lancer des **milliers voire des millions de goroutines** simultanément avec une empreinte mémoire très faible (une goroutine démarre avec ~2 Ko de stack, contre ~1–8 Mo pour un thread OS).

| | Thread OS | Goroutine Go |
|---|---|---|
| Taille initiale de stack | ~1–8 Mo | ~2 Ko |
| Création | Lente (appel système) | Très rapide |
| Nombre raisonnable | Quelques milliers | Des millions |
| Géré par | Le système d'exploitation | Le runtime Go |

## Synchroniser les goroutines

Pour qu'un programme attende la fin de ses goroutines avant de se terminer, il faut une forme de **synchronisation**. Go propose plusieurs mécanismes selon les besoins :

### `sync.WaitGroup` - attendre la fin d'un groupe de goroutines

`sync.WaitGroup` est la solution la plus directe quand on veut simplement attendre que toutes les goroutines aient terminé, sans récupérer de valeur.

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func greet(phrase string, wg *sync.WaitGroup) {
    defer wg.Done() // signale au WaitGroup que cette goroutine est terminée
    fmt.Println("hello !", phrase)
}

func slowGreet(phrase string, wg *sync.WaitGroup) {
    defer wg.Done() // appelé automatiquement à la sortie de la fonction
    time.Sleep(3 * time.Second)
    fmt.Println("hello !", phrase)
}

func main() {
    var wg sync.WaitGroup

    wg.Add(4) // on déclare qu'on attend la fin de 4 goroutines

    go greet("Heureux de te rencontrer !", &wg)
    go greet("Comment vas-tu ?", &wg)
    go slowGreet("Comment ... vas ... tu ... ?", &wg)
    go greet("j'espère que tu aimes ce cours !", &wg)

    wg.Wait() // bloque main() jusqu'à ce que les 4 goroutines aient appelé Done()
}
```

**Mécanisme** :
- `wg.Add(n)` : déclare qu'on attend `n` goroutines.
- `wg.Done()` : appelé par chaque goroutine quand elle se termine (via `defer` pour s'assurer que c'est toujours exécuté, même en cas de panique).
- `wg.Wait()` : bloque jusqu'à ce que le compteur atteigne zéro.

### Channels - communiquer entre goroutines

Quand les goroutines doivent **retourner des données** ou **se synchroniser entre elles**, on utilise des **channels**. C'est le mécanisme fondamental de communication en Go - abordé en détail dans la section suivante.

> "Do not communicate by sharing memory; instead, share memory by communicating." - Rob Pike, co-créateur de Go

## Résumé

| Concept | Description |
|---|---|
| `go f()` | Lance `f` dans une nouvelle goroutine (non bloquant) |
| Goroutine principale | `main()` - sa fin arrête tout le programme |
| `sync.WaitGroup` | Attendre la fin d'un ensemble de goroutines |
| `defer wg.Done()` | Garantit que `Done()` est toujours appelé en fin de goroutine |
| Channels | Communiquer des valeurs entre goroutines |
