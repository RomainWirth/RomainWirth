# LES CHANNELS

## Introduction

Par défaut, les Goroutines ne retournent pas de valeur à leur appelant, et l'appelant n'attend pas leur fin d'exécution. Cela pose un problème dès qu'on a besoin de récupérer un résultat produit par une goroutine, ou simplement de savoir quand elle s'est terminée.

Pour répondre à ce besoin, Go introduit le concept de **channel** (canal en français).

Un channel est un **mécanisme de communication typé** qui permet à des goroutines de s'échanger des données de façon synchronisée. On peut l'imaginer comme un tuyau : une goroutine y envoie une valeur d'un côté, et une autre goroutine la reçoit de l'autre côté.

Les channels sont une composante centrale du modèle de concurrence de Go, résumé par la devise :
> *"Ne communiquez pas en partageant de la mémoire; partagez de la mémoire en communicant."*

Autrement dit, plutôt que de faire accéder plusieurs goroutines à une variable commune (ce qui nécessite des verrous et peut provoquer des *race conditions*), on préfère faire circuler les données entre goroutines via des channels.

## Création d'un channel

Pour créer un channel, on utilise la fonction `make()` avec le mot-clé `chan` suivi du type de données que le channel transmettra : `string`, `bool`, `int`, `float64`, un struct, etc.

```Go
make(chan string) // channel qui transmet des strings
```

Le type associé au channel est important : seules des valeurs de ce type pourront y être envoyées ou reçues. On stocke généralement le channel dans une variable pour pouvoir le passer aux goroutines concernées.

## L'opérateur `<-`

L'opérateur `<-` est l'opérateur de communication des channels. Sa direction indique le sens du flux de données :

- **Envoyer** une valeur dans un channel : `channel <- valeur`
- **Recevoir** une valeur depuis un channel : `valeur := <-channel` (ou simplement `<-channel` pour bloquer sans stocker la valeur)

Par défaut, un channel est **non-bufferisé** : l'envoi (`<-`) bloque la goroutine émettrice jusqu'à ce qu'une autre goroutine soit prête à recevoir la valeur, et inversement. C'est ce mécanisme de blocage qui permet la synchronisation entre goroutines.

## Utilisation

On va maintenant illustrer ces concepts avec un exemple concret. On souhaite lancer une goroutine lente et attendre qu'elle se termine avant de continuer.

On commence par créer un channel `done` dans `main`. Ici on choisit le type `bool` car on veut seulement signaler la fin de l'opération, sans transmettre de données particulières.

```Go
func main() {
  // go greet("Heureux de te rencontrer !")
  // go greet("Comment vas-tu ?")
  done := make(chan bool) // bool car on souhaite juste savoir si l'opération est terminée ou non.
  go slowGreet("Comment ... vas ... tu ... ?")
  // go greet("j'espère que tu aimes ce cours !")
}
```

On modifie ensuite la fonction `slowGreet` pour qu'elle accepte le channel en paramètre. Une fois son travail terminé, elle y envoie `true` via l'opérateur `<-` pour signaler qu'elle a fini. Dans `main`, la ligne `<-done` bloque l'exécution jusqu'à ce qu'une valeur soit reçue depuis le channel.

```Go
func slowGreet(phrase string, doneChan chan bool) {
	time.Sleep(3 * time.Second) // simule une opération lente (ex: appel réseau, calcul lourd)
	fmt.Println("hello !", phrase)
	doneChan <- true // envoie un signal de fin dans le channel
}

func main() {
	// go greet("Heureux de te rencontrer !")
	// go greet("Comment vas-tu ?")
	done := make(chan bool)
	go slowGreet("Comment ... vas ... tu ... ?", done) // on passe le channel à la goroutine
	// go greet("j'espère que tu aimes ce cours !")
	<-done
  // `fmt.Println(<-done)` permet d'afficher la valeur reçue depuis le channel (ici : true)
}
```

`<-done` bloque la goroutine principale (`main`) jusqu'à ce que la goroutine `slowGreet` envoie une valeur dans le channel. Sans cette ligne, `main` se terminerait immédiatement, sans attendre la fin de la goroutine.

> **Remarque :** si aucune goroutine n'envoie jamais de valeur dans un channel que `main` attend, le programme se bloque indéfiniment — Go détectera cette situation comme un **deadlock** et terminera le programme avec une erreur.

## Travailler avec plusieurs channels et goroutines

Un channel n'est pas limité à une seule goroutine émettrice : il peut recevoir des valeurs envoyées par plusieurs goroutines différentes. C'est une propriété fondamentale — un channel est conçu pour être un point de rendez-vous partagé entre plusieurs goroutines.

### Approche naïve : un seul `<-done`

Si on lance quatre goroutines sur un channel unique mais qu'on ne lit qu'une seule valeur depuis ce channel, le programme se terminera dès que la **première** goroutine aura envoyé son signal, sans attendre les autres. L'ordre dépend entièrement du scheduler Go, ce qui rend le résultat non-déterministe.

```Go
func greet(phrase string, doneChan chan bool) {
	fmt.Println("hello !", phrase)
	doneChan <- true // envoie un signal lorsque la goroutine a terminé
}

func slowGreet(phrase string, doneChan chan bool) {
	time.Sleep(3 * time.Second) // simule une opération lente
	fmt.Println("hello !", phrase)
	doneChan <- true
}

func main() {
	done := make(chan bool)

	go greet("Heureux de te rencontrer !", done)
	go greet("Comment vas-tu ?", done)
	go slowGreet("Comment ... vas ... tu ... ?", done)
	go greet("j'espère que tu aimes ce cours !", done)

	<-done // attend uniquement la première goroutine à terminer, puis quitte
}
```

Ce code a un comportement imprévisible : le programme se termine après la première complétion, ignorant les trois autres goroutines encore en cours.

### Approche correcte : répéter `<-done`

Pour attendre **toutes** les goroutines, il suffit de répéter `<-done` autant de fois qu'il y a de goroutines émétrices. Chaque `<-done` consomme exactement un signal envoyé dans le channel, et bloque jusqu'à ce qu'il soit disponible.

```Go
func main() {
	done := make(chan bool)

	go greet("Heureux de te rencontrer !", done)
	go greet("Comment vas-tu ?", done)
	go slowGreet("Comment ... vas ... tu ... ?", done)
	go greet("j'espère que tu aimes ce cours !", done)

	<-done // attend la 1ère goroutine terminée
	<-done // attend la 2ème
	<-done // attend la 3ème
	<-done // attend la 4ème (ici slowGreet, la plus lente)
}
```

L'ordre d'affichage dans la console reflète l'ordre de complétion des goroutines (les plus rapides en premier) :

```bash
romainw@fedora:~/Public/perso/go/goroutines-introduction$ go run .
hello ! j'espère que tu aimes ce cours !
hello ! Heureux de te rencontrer !
hello ! Comment vas-tu ?
hello ! Comment ... vas ... tu ... ?
```

Cette approche fonctionne, mais elle pose un problème de **maintenabilité** : il faut mettre à jour manuellement le nombre de `<-done` à chaque fois qu'on ajoute ou retire une goroutine.

### Approche scalable : slice de channels

Pour découpler le nombre de goroutines du nombre de `<-done`, on peut créer une **slice de channels** : chaque goroutine reçoit son propre channel, et on itère sur la slice pour attendre chacun d'eux.

```Go
dones := make([]chan bool, 4) // slice pouvant contenir 4 channels
```

On instancie chaque channel individuellement et on le passe à la goroutine correspondante :

```Go
func main() {
	dones := make([]chan bool, 4)

	dones[0] = make(chan bool)
	go greet("Heureux de te rencontrer !", dones[0])
	dones[1] = make(chan bool)
	go greet("Comment vas-tu ?", dones[1])
	dones[2] = make(chan bool)
	go slowGreet("Comment ... vas ... tu ... ?", dones[2])
	dones[3] = make(chan bool)
	go greet("j'espère que tu aimes ce cours !", dones[3])

	for _, done := range dones {
		<-done // attend chaque goroutine dans l'ordre de la slice
	}
}
```

> **Attention :** ici le `range` itère dans l'ordre de la slice, pas dans l'ordre de complétion des goroutines. Si `dones[2]` (slowGreet) est le troisième à être attendu, `main` bloquera à cet indice jusqu'à ce que cette goroutine lente se termine, même si les goroutines aux indices 3 et suivants ont déjà fini depuis longtemps.

### Approche avec `range` sur un channel et `close()`

Go permet également d'itérer directement sur un channel avec `for ... range`. La boucle reçoit les valeurs au fur et à mesure qu'elles arrivent dans le channel, sans se soucier du nombre de goroutines.

```Go
done := make(chan bool)

go greet("Heureux de te rencontrer !", done)
go greet("Comment vas-tu ?", done)
go slowGreet("Comment ... vas ... tu ... ?", done)
go greet("j'espère que tu aimes ce cours !", done)

for doneChan := range done {
  fmt.Println(doneChan)
}
```

Cependant, `for ... range` sur un channel boucle **indéfiniment** tant que le channel n'est pas fermé. Les goroutines terminent, plus personne n'envoie de valeur, mais la boucle continue d'attendre — ce qui provoque un deadlock :

```bash
romainw@fedora:~/Public/perso/go/goroutines-introduction$ go run .
hello ! j'espère que tu aimes ce cours !
true
hello ! Heureux de te rencontrer !
true
hello ! Comment vas-tu ?
true
hello ! Comment ... vas ... tu ... ?
true
fatal error: all goroutines are asleep - deadlock!
```

Pour signaler à `for ... range` que plus aucune valeur ne sera envoyée, il faut **fermer le channel** avec `close()`. On le fait dans la goroutine qui se termine en dernier (ici `slowGreet`) juste après son envoi :

```Go
func slowGreet(phrase string, doneChan chan bool) {
	time.Sleep(3 * time.Second) // simule une opération lente
	fmt.Println("hello !", phrase)
	doneChan <- true  // envoie le dernier signal
	close(doneChan)   // ferme le channel : signale à `for range` de s'arrêter
}
```

Une fois le channel fermé, la boucle `for ... range` se termine proprement et le programme s'exécute sans erreur :

```bash
romainw@fedora:~/Public/perso/go/goroutines-introduction$ go run .
hello ! j'espère que tu aimes ce cours !
hello ! Heureux de te rencontrer !
hello ! Comment vas-tu ?
hello ! Comment ... vas ... tu ... ?
```

> **Limite :** cette approche suppose qu'on sait à l'avance quelle goroutine sera la dernière à terminer, ce qui n'est pas toujours possible. Dans des cas plus complexes (nombre dynamique de goroutines, durées imprévisibles), on préférera utiliser un `sync.WaitGroup` qui gère ce problème de façon générique.

## Goroutines & Channels dans un projet

> Reprendre le code du projet de la section [I : price calculator](../I_PROJET_PRATIQUE_CALCULATEUR_DE_PRIX/A_SUMMARY.md)

On va maintenant appliquer les concepts de goroutines et de channels dans un projet réel : le calculateur de prix avec taxes. Dans sa version initiale, les calculs pour chaque taux de TVA sont effectués **séquentiellement** — l'un après l'autre. L'objectif ici est de les rendre **concurrents**, c'est-à-dire de lancer tous les jobs en parallèle et d'attendre que tous aient terminé avant de quitter le programme.

Structure du projet :
```
.
├── go.mod
├── main.go
├── cmdmanager/
│   └── cmdmanager.go
├── conversion/
│   └── conversion.go
├── filemanager/
│   └── filemanager.go
├── iomanager/
│   └── iomanager.go
├── prices/
│   └── prices.go
├── data/
│   └── prices.txt
└── results_json/
```
### Intégrer des goroutines et des channels au projet

#### Étape 1 — Simuler une opération lente dans `filemanager`

Pour rendre la concurrence visible et mesurable, on commence par introduire un délai artificiel dans `WriteResult()`, la méthode qui écrit le résultat dans un fichier JSON. Ce délai simule une opération lente, comme une écriture sur disque réseau ou un appel à une API externe.

```Go
func (fm FileManager) WriteResult(data any) error {
	file, err := os.Create(fm.OutputFilePath)
	if err != nil {
		return errors.New("Erreur de création du fichier")
	}

	// simulation d'une opération lente (I/O réseau, écriture distante, etc.)
	time.Sleep(3 * time.Second)

	encoder := json.NewEncoder(file)
	err = encoder.Encode(data)
	if err != nil {
		file.Close()
		return errors.New("Erreur d'écriture dans le fichier")
	}

	file.Close()
	return nil
}
```

Sans concurrence, 5 taux de TVA × 3 secondes = **15 secondes** d'exécution totale. Avec des goroutines, tous les jobs tournant en parallèle, on visera **3 secondes** (le temps du job le plus lent).

#### Étape 2 — Lancer les jobs en goroutines dans `main`

On adopte l'approche par **slice de channels** vue précédemment : on crée autant de channels qu'il y a de taux de TVA, on initialise chacun dans la boucle, et on lance `Process()` comme goroutine en lui passant son channel dédié.

À ce stade, `main` ne contient pas encore la boucle d'attente — les goroutines sont lancées mais le programme sortirait immédiatement sans attendre leurs résultats.

```Go
func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}
	doneChans := make([]chan bool, len(taxRates)) // slice de channels, un par taux de TVA

	for i, taxRate := range taxRates { // on utilise l'index i pour associer chaque goroutine à son propre channel
		doneChans[i] = make(chan bool) // chaque channel est créé individuellement avant d'être passé à la goroutine
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		// cmdm := cmdmanager.New()
		priceJob := prices.NewTaxIncludedPriceJob(fm, taxRate)
		go priceJob.Process(doneChans[i]) // lancement concurrent — Process() sera modifiée pour accepter le channel

		// if err != nil {
		// 	fmt.Println("Erreur lors du traitement des prix : ", err)
		// }
	}
}
```

#### Étape 3 — Adapter `Process()` dans `prices.go`

La signature de `Process()` doit évoluer : elle ne retourne plus d'erreur (les goroutines ne peuvent pas retourner de valeur à leur appelant), et elle accepte désormais un `chan bool` en paramètre. Une fois son travail terminé, elle y envoie `true` pour signaler sa complétion.

```Go
func (job *TaxIncludedPriceJob) Process(doneChan chan bool) { // suppression du type de retour error, ajout du channel en paramètre
	err := job.LoadData()

	if err != nil {
		// return err
	}

	result := make(map[string]string)
	for _, price := range job.InputPrices {
		taxIncludedPrice := price * (1 + job.TaxRate)
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	job.TaxIncludedPrices = result
	job.IOManager.WriteResult(job) // écriture du résultat — l'erreur éventuelle n'est plus propagée
	doneChan <- true               // signal de fin : débloque le <-doneChan correspondant dans main
}
```

> **Important :** le fait que `Process()` soit lancée en goroutine ne rend pas concurrentes les opérations *à l'intérieur* de `Process()`. `LoadData()`, le calcul des prix et `WriteResult()` s'exécutent toujours séquentiellement au sein de chaque goroutine. Ce qui est concurrent, c'est l'exécution simultanée des **différents appels** à `Process()` — un par taux de TVA.

#### Étape 4 — Attendre toutes les goroutines dans `main`

On ajoute une seconde boucle après le lancement des goroutines. Elle itère sur la slice `doneChans` et bloque sur chaque channel jusqu'à recevoir le signal de fin correspondant. La séparation en deux boucles distinctes est essentielle : si on attendait chaque goroutine dans la même boucle que son lancement, on perdrait tout le bénéfice de la concurrence (les goroutines seraient lancées et attendues une par une).

```Go
func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}
	doneChans := make([]chan bool, len(taxRates))

	// 1ère boucle : lancement de toutes les goroutines sans les attendre
	for i, taxRate := range taxRates {
		doneChans[i] = make(chan bool)
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		// cmdm := cmdmanager.New()
		priceJob := prices.NewTaxIncludedPriceJob(fm, taxRate)
		go priceJob.Process(doneChans[i])

		// if err != nil {
		// 	fmt.Println("Erreur lors du traitement des prix : ", err)
		// }
	}

	// 2ème boucle : attente de la fin de chaque goroutine dans l'ordre de la slice
	for _, doneChan := range doneChans {
		<-doneChan
	}
}
```

> **Remarque :** la seconde boucle attend les goroutines dans l'ordre de la slice, pas dans l'ordre de complétion. Si une goroutine rapide (indice 3) termine avant une goroutine lente (indice 1), `main` continuera à bloquer sur `doneChans[1]` jusqu'à ce que celle-ci ait fini. Le programme ne se terminera qu'une fois **toutes** les goroutines complétées.

#### Résultat

En lançant le programme avec `go run .`, l'exécution prend désormais **3 secondes** — le temps de l'opération `WriteResult()` la plus lente — contre **15 secondes** sans concurrence (5 jobs × 3 secondes). Toutes les goroutines s'exécutent en parallèle, et `main` attend que la dernière soit terminée avant de quitter.

| Mode | Durée |
|---|---|
| Séquentiel (sans goroutines) | ~15 secondes |
| Concurrent (avec goroutines) | ~3 secondes |

### Set up un channel Error

Avec la concurrence, la gestion des erreurs devient plus complexe. Dans la version séquentielle, `Process()` retournait une `error` que `main` pouvait inspecter directement. Ce mécanisme ne fonctionne plus avec les goroutines : **une goroutine ne peut pas retourner de valeur à son appelant**.

La solution idiomatique en Go est d'utiliser un **second channel dédié aux erreurs** (`chan error`). Chaque goroutine dispose ainsi de deux channels : `doneChan` pour signaler sa complétion réussie, et `errorChan` pour propager une erreur éventuelle. À tout moment, une goroutine n'émettra que dans **l'un ou l'autre** de ces deux channels — jamais les deux.

#### Adapter `Process()` dans `prices.go`

On ajoute `errorChan chan error` comme second paramètre. En cas d'erreur, on l'envoie dans `errorChan` et on interrompt l'exécution avec `return`. En cas de succès, on envoie `true` dans `doneChan` comme auparavant.

```Go
func (job *TaxIncludedPriceJob) Process(doneChan chan bool, errorChan chan error) { // ajout du paramètre errorChan de type chan error
	err := job.LoadData()

	if err != nil {
		errorChan <- err // propagation de l'erreur via le channel dédié — impossible de la retourner depuis une goroutine
		return           // on interrompt immédiatement : doneChan ne recevra rien pour cette goroutine
	}

	result := make(map[string]string)
	for _, price := range job.InputPrices {
		taxIncludedPrice := price * (1 + job.TaxRate)
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	job.TaxIncludedPrices = result
	job.IOManager.WriteResult(job)
	doneChan <- true // succès : signal de complétion
}
```

#### Adapter `main` pour les channels d'erreur

On crée une slice `errorChans` symétrique à `doneChans`, et on passe chaque channel à la goroutine correspondante.

```Go
func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}
	doneChans := make([]chan bool, len(taxRates))
	errorChans := make([]chan error, len(taxRates)) // slice d'error channels, un par goroutine

	for i, taxRate := range taxRates {
		doneChans[i] = make(chan bool)
		errorChans[i] = make(chan error) // channel d'erreur individuel — chaque goroutine a le sien
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		// cmdm := cmdmanager.New()
		priceJob := prices.NewTaxIncludedPriceJob(fm, taxRate)
		go priceJob.Process(doneChans[i], errorChans[i]) // on passe les deux channels à chaque goroutine

		// if err != nil {
		// 	fmt.Println("Erreur lors du traitement des prix : ", err)
		// }
	}

	for _, doneChan := range doneChans {
		<-doneChan
	}
}
```

#### Le problème : on ne peut pas écouter les deux slices séparément

On pourrait être tenté d'ajouter une seconde boucle `for` pour écouter les `errorChans`, comme on l'a fait pour les `doneChans` :

```Go
for _, errorChan := range errorChans {
	<-errorChan
}
```

Mais ceci provoque un **deadlock**. En effet, dans le cas nominal (aucune erreur), aucune goroutine n'envoie jamais rien dans `errorChans`. La boucle bloque indéfiniment en attendant une valeur qui n'arrivera jamais.

À l'inverse, si une erreur se produit, la goroutine envoie dans `errorChan` mais **pas** dans `doneChan`. La première boucle (`for _, doneChan := range doneChans`) bloquera alors sur le channel de cette goroutine, attendant un signal qui ne viendra pas.

Le problème fondamental est que, pour chaque goroutine, **exactement un seul** des deux channels recevra une valeur — mais on ne sait pas lequel à l'avance. Les deux boucles séparées ne peuvent pas modéliser cette réalité.

Pour gérer cela, Go propose une solution

### Gérer les channels avec le statement `"select"`

L'instruction `select` est la solution de Go au problème posé par les deux boucles séparées : elle permet d'**attendre simultanément plusieurs channels** et de réagir au premier qui reçoit une valeur.

> `select` est une structure de contrôle conçue exclusivement pour les channels. Son fonctionnement est analogue à `switch`, mais au lieu d'évaluer une expression, chaque `case` attend qu'une valeur soit disponible sur un channel. Dès qu'**un** des channels est prêt, le `case` correspondant s'exécute et le `select` se termine. Si plusieurs channels sont prêts simultanément, Go en choisit un aléatoirement.

#### Remplacer les deux boucles par un `select`

On remplace la boucle d'attente sur `doneChans` par une boucle `for` sur le nombre de goroutines (`len(taxRates)`), dans laquelle un `select` écoute à la fois `doneChans[i]` et `errorChans[i]`. Pour chaque goroutine, exactement l'un des deux `case` se déclenchera — selon que la goroutine a réussi ou échoué.

```Go
for i := range taxRates { // on itère une fois par goroutine lancée
  select {
  case err := <-errorChans[i]: // déclenché si la goroutine i a envoyé une erreur
    if err != nil {
      fmt.Println(err)
    }
  case <-doneChans[i]: // déclenché si la goroutine i s'est terminée avec succès
    fmt.Println("Done !")
  }
}
```

À chaque itération de la boucle, `select` se met en attente sur les deux channels à l'index `i`. Whichever channel reçoit une valeur en premier débloque le `select` et exécute le `case` correspondant. L'autre `case` est ignoré pour cette itération.

En cas de succès (aucune erreur), le programme produit :

```bash
romainw@fedora:~/Public/perso/go/practice-project$ go run .
Done !
Done !
Done !
Done !
Done !
```

#### Tester le cas d'erreur

Pour valider que le `case` d'erreur fonctionne, on peut injecter une erreur fictive directement dans `Process()` avant toute logique métier. Cela force chaque goroutine à émettre dans `errorChan` plutôt que dans `doneChan`.

```Go
func (job *TaxIncludedPriceJob) Process(doneChan chan bool, errorChan chan error) {
	err := job.LoadData()

	errorChan <- errors.New("Nouvelle erreur fictive !") // injection d'erreur pour test — à retirer en production

	if err != nil {
		errorChan <- err // erreur réelle de LoadData — bloque et stoppe la goroutine
		return
	}

	result := make(map[string]string)
	for _, price := range job.InputPrices {
		taxIncludedPrice := price * (1 + job.TaxRate)
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	job.TaxIncludedPrices = result
	job.IOManager.WriteResult(job)
	doneChan <- true
}
```

Le `select` capte les valeurs émises dans `errorChans` et affiche le message d'erreur pour chaque goroutine :

```bash
romainw@fedora:~/Public/perso/go/practice-project$ go run .
Nouvelle erreur fictive !
Nouvelle erreur fictive !
Nouvelle erreur fictive !
Nouvelle erreur fictive !
Nouvelle erreur fictive !
```

> **Synthèse :** `select` résout élégamment le problème de l'attente exclusive. Là où deux boucles `for` séparées ne peuvent pas modéliser qu'une goroutine émettra dans *l'un ou l'autre* channel, `select` exprime exactement cette logique : "attends le premier des deux, réagis en conséquence, passe à la goroutine suivante". C'est le pattern idiomatique Go pour la gestion concurrente des succès et des erreurs.

---

## Résumé

### Concepts fondamentaux

| Concept | Description |
|---|---|
| `make(chan T)` | Crée un channel non-bufferisé transmettant des valeurs de type `T` |
| `channel <- valeur` | Envoie une valeur dans un channel — bloque jusqu'à ce qu'un receveur soit prêt |
| `valeur := <-channel` | Reçoit une valeur depuis un channel — bloque jusqu'à ce qu'un émetteur envoie |
| `<-channel` | Reçoit et ignore une valeur — utilisé pour la synchronisation (signal de fin) |
| `close(channel)` | Ferme un channel — signale à `for range` qu'aucune valeur ne sera plus émise |

### Patterns d'attente de goroutines

| Pattern | Cas d'usage | Limite |
|---|---|---|
| `<-done` répété N fois | Nombre fixe et connu de goroutines | Fragile à la maintenance |
| Slice de channels + `for range` | Nombre dynamique de goroutines | Attend dans l'ordre de la slice, pas de complétion |
| `for range channel` + `close()` | Un seul channel partagé | Nécessite de savoir quelle goroutine termine en dernier |
| `select` dans une boucle | Plusieurs channels par goroutine (ex: done + error) | Pattern recommandé pour gestion d'erreurs concurrente |

### Règles importantes

- Un channel non-bufferisé **bloque** l'émetteur jusqu'à ce qu'un receveur soit prêt, et vice versa.
- Si personne n'écoute un channel, l'émetteur se bloque indéfiniment → **deadlock**.
- `for range` sur un channel boucle indéfiniment tant que le channel n'est pas fermé avec `close()`.
- Une goroutine **ne peut pas retourner de valeur** à son appelant : on utilise un channel pour propager résultats et erreurs.
- La séparation en **deux boucles distinctes** (lancement puis attente) est indispensable pour tirer parti de la concurrence.
- `select` écoute **simultanément** plusieurs channels et réagit au premier disponible — si plusieurs sont prêts en même temps, Go en choisit un aléatoirement.

### Schéma de communication goroutine / main

```
main                      goroutine
 |                             |
 |-- go job.Process(done, err) |
 |                             |-- traitement...
 |                             |
 |                         [succès] --> done <- true
 |                         [erreur] --> err <- error
 |                             |
 | select {                    |
 |   case <-done:  "Done !"    |
 |   case e := <-err: log(e)   |
 | }                           |
 |                             |
```
