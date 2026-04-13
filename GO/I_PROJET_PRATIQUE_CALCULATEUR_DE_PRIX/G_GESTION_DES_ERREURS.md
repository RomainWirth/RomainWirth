# GESTION DES ERREURS

## Le problème : les erreurs silencieuses

Dans l'état précédent du projet, `Process()` appelait `LoadData()` et `WriteResult()` sans jamais vérifier si ces fonctions avaient échoué. Si une erreur survenait (fichier introuvable, échec de conversion, erreur d'écriture…), elle était simplement ignorée : le programme continuait à s'exécuter avec un état incorrect, sans aucun message d'avertissement.

C'est une **erreur silencieuse** - le cas le plus difficile à diagnostiquer en production.

## La convention Go pour la gestion d'erreurs

En Go, il n'y a pas d'exceptions (`try/catch`). La convention est de retourner une valeur `error` en dernier paramètre de retour d'une fonction. L'appelant est **explicitement responsable** de vérifier cette valeur avant de continuer.

Ce mécanisme force une gestion d'erreur **locale et visible** : chaque couche de l'application décide de gérer l'erreur, de la transformer, ou de la **propager vers le haut** (ce qu'on appelle le *forwarding* ou *bubbling* d'erreur).

## Étape 1 - `LoadData()` propage ses erreurs

`LoadData()` passe de `func ... ()` à `func ... () error`. Elle retourne désormais les erreurs de `ReadLines()` et `StringsToFloats()` à son appelant, au lieu de les ignorer silencieusement. Si tout se passe bien, elle retourne `nil` - la valeur zéro de `error`, qui signifie "aucune erreur".
```GO
func (job *TaxIncludedPriceJob) LoadData() error { // modification du retour : la fonction remonte maintenant les erreurs
	lines, err := job.IOManager.ReadLines()
	if err != nil {
		return err // propagation de l'erreur vers l'appelant (Process)
	}

	prices, err := conversion.StringsToFloats(lines)

	if err != nil {
		return err // propagation de l'erreur vers l'appelant (Process)
	}

	job.InputPrices = prices
	return nil // succès : aucune erreur à remonter
}
```

## Étape 2 - `Process()` propage les erreurs de bout en bout

`Process()` adopte le même pattern. Elle reçoit l'erreur éventuelle de `LoadData()`, et si elle existe, la retourne immédiatement sans effectuer le calcul - c'est le **early return** (retour anticipé), idiome Go pour éviter l'imbrication de conditions.

Pour `WriteResult()`, plutôt que de capturer son erreur dans une variable et de la retourner séparément, on **retourne directement son résultat** : `return job.IOManager.WriteResult(job)`. C'est une forme concise et idiomatique du forwarding d'erreur : si `WriteResult` réussit, on retourne `nil` ; si elle échoue, on retourne son erreur.
```GO
func (job *TaxIncludedPriceJob) Process() error { // la fonction remonte maintenant les erreurs
	err := job.LoadData() // l'erreur éventuelle est capturée

	if err != nil {
		return err // early return : on n'effectue pas le calcul si le chargement a échoué
	}

	result := make(map[string]string)
	for _, price := range job.InputPrices {
		taxIncludedPrice := price * (1 + job.TaxRate)
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	job.TaxIncludedPrices = result

	return job.IOManager.WriteResult(job) // forwarding direct : on retourne l'erreur (ou nil) de WriteResult
}
```

## Étape 3 - `main()` gère l'erreur en bout de chaîne

`main()` est le **point terminal** de la chaîne d'erreurs. Elle ne peut pas propager plus loin (elle ne retourne rien), donc c'est ici qu'on décide quoi faire de l'erreur : l'afficher, l'enregistrer dans un log, arrêter le programme… Dans ce cas, on affiche un message clair dans la console et on continue avec le taux de taxe suivant.
```GO
func main() {
	taxRates := []float64{0, 0.021, 0.055, 0.1, 0.2}

	for _, taxRate := range taxRates {
		fm := filemanager.New("./data/prices.txt", fmt.Sprintf("./results_json/tax_included_prices_%.2f.json", taxRate*100))
		// cmdm := cmdmanager.New()
		priceJob := prices.NewTaxIncludedPriceJob(fm, taxRate)
		err := priceJob.Process() // l'erreur est capturée et gérée ici, en bout de chaîne

		if err != nil {
			fmt.Println("Erreur lors du traitement des prix : ", err) // affiche l'erreur et continue avec le taux suivant
		}
	}
}
```

## Bilan : la chaîne de propagation

```
ReadLines() / StringsToFloats() / WriteResult()
        ↓ retournent une error
    LoadData()
        ↓ propage l'error
    Process()
        ↓ propage l'error
    main()
        ↓ gère l'error (affichage console)
```

| Concept | Explication |
|---|---|
| Retour `error` | Convention Go : dernier paramètre de retour, `nil` si succès |
| Early return | On retourne immédiatement en cas d'erreur, sans imbriquer de conditions |
| Forwarding | On retourne l'erreur reçue sans la modifier, pour la traiter plus haut |
| Point terminal | `main()` ne propage pas : c'est ici que l'erreur est finalement traitée |
