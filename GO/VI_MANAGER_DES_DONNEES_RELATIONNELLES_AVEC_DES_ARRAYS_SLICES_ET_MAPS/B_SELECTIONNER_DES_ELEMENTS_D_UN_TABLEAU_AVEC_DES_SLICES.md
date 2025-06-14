# B. SÉLECTIONNER DES ÉLÉMENTS D'UN TABLEAU AVEC DES `SLICE`

Une slice est une sélection d'un certain nombre d'éléments d'un tableau.  
Pour cela, on va créer une sorte de nouveau tableau qui sera basé sur le premier en omettant les éléments qu'on ne souhaite pas récupérer.  
On utilisera cette syntaxe : `nameSlice := nameArray[indexA:indexB]`
* `nameSlice` : nom de la variable (slice).
* `nameArray` : nom du tableau référence.
* `indexA` : index du premier élément qu'on souhaite intégrer à la slice.
* `indexB` : index de l'élément qui sera la limite exclue.  
(si on souhaite les éléments des index 1 et 2, on notera [1:3])


Si par exemple, on souhaite récupérer les éléments 2 et 3 d'un tableau de 4 entrées de type float64 :
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}
fmt.Println("Prices:", prices)

fmt.Println(prices[2])

featuredPrices := prices[1:3]
fmt.Println("Slice:", featuredPrices)
```
output : 
```
go run .
Prices: [10.5 20 30.75 40]
30.75
Slice: [20 30.75]
```
La slice `featuredPrices` contient les éléments des index 1 et 2 du tableau `prices`.

Si on ne met pas d'index en premier : `[:n]`, on prendra les éléments à partir de l'index 0 jusqu'a l'index n (exclu).  
exemple :
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}

featuredPrices := prices[:3]
fmt.Println("Slice:", featuredPrices)
```
output : 
```
go run .
Prices: [10.5 20 30.75 40]
30.75
Slice: [10.5 20 30.75]
```

On retrouvera la même logique si on souhaite commencer à un index n et récupérer tout le reste du tableau : `[n:]`.

Attention, on ne pourra travailler que dans la limite de la taille du tableau. Si un tableau a une length de 4, on ne pourra pas faire de slice entre 1 et 7 par exemple.  
Pour un tableau de 4 éléments, la slice maximale pourra donc être `[:4]`.  
Voici les possibilités pour un tableau de 4 éléments : 
* `[0:4]` ou `[:]` = totalité du tableau
* `[0:n]` ou `[:n]` = du premier à l'élément n (exclu)
* `[n:4]` ou `[n:]` = de l'élément n jusqu'au dernier
* `[n:m]` = de l'élément n à l'élément m

Il est possible d'effectuer des `slices` sur des `slices` :
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}

featuredPrices := prices[1:]
highlightedPrices := featuredPrices[:1]

fmt.Println("Slice of slice:", highlightedPrices)
```
output : 
```
go run .

Slice of slice: [20]
```
* `featuredPrices` va contenir : [20.0 30.75 40.0]
* `highlightedPrices` vu contenir uniquement le premier élément de `featuredPrices`

#### Comprendre la connexion entre `array` et `slice`

Une `slice` est une sorte de référence à un tableau.  
La création d'un tableau engendre une création dans l'espace mémoire.  
La slice est une sorte de fenêtre sur un tableau.  
Si on modifie un élément dans une slice d'un tableau en référence, on va également modifier l'élément correspondant dans le tableau de référence.  

exemple : 
```Go
prices := [4]float64{10.5, 20.0, 30.75, 40.0}
fmt.Println("Prices:", prices)

featuredPrices := prices[1:]
fmt.Println("Featured prices:", featuredPrices)

featuredPrices[0] = 199.99
fmt.Println("Featured prices after modification:", featuredPrices)
fmt.Println("Prices after modification of featuredPrices:", prices)
```
output : 
```
go run .

Prices: [10.5 20 30.75 40]
Featured prices: [20 30.75 40]
Featured prices after modification: [199.99 30.75 40]
Prices after modification of featuredPrices: [10.5 199.99 30.75 40]
```
On constate bien que l'élément modifié de `featuredPrices` affecte l'élément référence du tableau original.

* Cela signifie que lorsqu'on crée une `slice`, on ne copie pas le tableau original dans un nouvel espace supplémentaire.
* On a uniquement un espace mémoire alloué au tableau, et la slice est une référence à une partir de ce tableau.
* Slice est donc une manière efficace de sélectionner des parties d'un tableau voir même de les éditer.