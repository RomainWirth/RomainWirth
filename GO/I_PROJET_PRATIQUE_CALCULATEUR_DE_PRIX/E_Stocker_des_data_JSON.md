# STOCKER DES DONNÉES JSON DANS DES FICHIERS

## Pourquoi persister les résultats en JSON ?

Jusqu'ici, les résultats des calculs étaient affichés dans la console. Pour une application réelle, cela ne suffit pas : les données doivent être **persistées** pour être consultées plus tard, partagées avec d'autres systèmes, ou archivées.

Le format **JSON** (JavaScript Object Notation) est un choix naturel pour stocker des données structurées : il est lisible par l'humain, supporté nativement par Go via le package `encoding/json`, et interopérable avec la quasi-totalité des langages et outils modernes.

L'objectif de cette section est d'ajouter au package `filemanager` une fonction `WriteJSON()` capable d'écrire n'importe quelle valeur Go dans un fichier JSON.

## La fonction `WriteJSON()` : signature et paramètre `interface{}`

On commence par définir la signature de la fonction dans le package `filemanager`. Le paramètre `data` est de type `interface{}` :
```GO
package filemanager

// ...

func WriteJSON(data interface{}) {}
```

### `interface{}` ou `any` ?

`any` est un alias de `interface{}` introduit en Go 1.18. Les deux sont **strictement équivalents**. `any` est plus moderne et idiomatique dans le code récent, mais `interface{}` reste très répandu dans les bases de code existantes. Le comportement est identique : ces types acceptent une valeur de **n'importe quel type** en paramètre.

Utiliser `interface{}` (ou `any`) ici rend `WriteJSON()` **générique** : elle peut sérialiser une struct, une map, une slice, ou tout autre type Go — sans avoir besoin d'une fonction différente pour chaque cas. C'est le package `encoding/json` qui se charge d'inspecter la valeur au moment de l'exécution via la **réflexion** (`reflect`) pour produire le JSON correspondant.

## Implémentation complète de `WriteJSON()`

La fonction accepte deux paramètres : le chemin du fichier cible et la donnée à sérialiser. Elle retourne une `error` selon la convention Go :
```GO
func WriteJSON(path string, data interface{}) error {
	// création (ou écrasement) du fichier au chemin indiqué
	file, err := os.Create(path)
	if err != nil {
		return errors.New("Erreur de création du fichier")
	}

	// création d'un encodeur JSON qui écrit directement dans le fichier
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

### Détail des étapes

**1. `os.Create(path)`**

`os.Create` crée le fichier s'il n'existe pas, ou le **tronque** (vide son contenu) s'il existe déjà. C'est le comportement souhaité ici : on veut toujours écrire un fichier propre. En cas d'échec (permissions insuffisantes, répertoire inexistant…), on retourne une erreur sans aller plus loin.

**2. `json.NewEncoder(file)`**

Plutôt que `json.Marshal()` qui produit un `[]byte` en mémoire, on utilise `json.NewEncoder()` qui prend un `io.Writer` en paramètre et **stream** l'encodage directement dans le fichier. C'est plus efficace en mémoire, surtout pour de grandes structures de données.

**3. `encoder.Encode(data)`**

`Encode` sérialise la valeur `data` en JSON et l'écrit dans le fichier. Si la valeur contient des types non sérialisables (ex. un channel, une fonction), `Encode` retourne une erreur. Dans ce cas, on ferme proprement le fichier avant de retourner.

**4. Fermeture explicite du fichier**

On ferme le fichier manuellement à chaque point de sortie. On aurait pu utiliser `defer file.Close()` après `os.Create`, ce qui est plus idiomatique en Go — mais cela aurait différé la fermeture à la fin de la fonction, y compris en cas d'erreur d'encodage. Le choix explicite ici garantit une libération immédiate de la ressource en cas de problème.

## Mise à jour de la struct et de `Process()`

### Changement de type pour `TaxIncludedPrices`

Le champ `TaxIncludedPrices` passe de `map[string]float64` à `map[string]string`. Ce changement permet de formater les valeurs avec deux décimales dès le calcul (`"12.34"` plutôt que `12.3456789`), ce qui produit un JSON directement exploitable et lisible sans post-traitement.

### Nommage dynamique des fichiers de sortie

Chaque job correspond à un taux de taxe différent (ex. 7%, 10%, 19%…). Pour éviter que les fichiers de résultats se remplacent mutuellement, le nom du fichier est **généré dynamiquement** à partir du taux : `tax_included_prices_19.json`, `tax_included_prices_7.json`, etc. C'est `fmt.Sprintf` avec le format `%.0f` (float sans décimale) qui s'en charge.
```GO
type TaxIncludedPriceJob struct {
	TaxRate           float64           // taux de taxe à appliquer (ex: 0.2 pour 20%)
	InputPrices       []float64         // liste des prix HT à traiter
	TaxIncludedPrices map[string]string // résultats formatés : prix HT → prix TTC
}

// ...

func (job *TaxIncludedPriceJob) Process() {
	job.LoadData()

	result := make(map[string]string)
	for _, price := range job.InputPrices {
		taxIncludedPrice := price * (1 + job.TaxRate)
		// formatage avec 2 décimales : la clé est le prix HT, la valeur est le prix TTC
		result[fmt.Sprintf("%.2f", price)] = fmt.Sprintf("%.2f", taxIncludedPrice)
	}

	job.TaxIncludedPrices = result

	// écriture des résultats dans un fichier JSON nommé d'après le taux (ex: tax_included_prices_19.json)
	filemanager.WriteJSON(fmt.Sprintf("./results_json/tax_included_prices_%.0f.json", job.TaxRate*100), job)
}
```

## Résumé

| Élément | Rôle |
|---|---|
| `os.Create(path)` | Crée ou écrase le fichier cible |
| `json.NewEncoder(file)` | Crée un encodeur JSON qui écrit en streaming dans le fichier |
| `encoder.Encode(data)` | Sérialise la donnée Go en JSON et l'écrit |
| `interface{}` / `any` | Permet d'accepter n'importe quel type en paramètre |
| Nommage dynamique | Génère un nom de fichier unique par job pour éviter les écrasements |
