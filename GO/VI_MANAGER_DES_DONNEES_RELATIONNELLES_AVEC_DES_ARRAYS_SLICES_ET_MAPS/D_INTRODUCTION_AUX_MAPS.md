# D. INTRODUCTION AUX `MAPS`

Une `map` est une autre structure de données qui permet également de regrouper des données.  
Cela ressemble à un `struct` et un `array`, mais en différent :  
* comme un struct, une map possède une paire `clé`/`valeur`.
* comme un array, une map se déclare un peu de la même manière.

déclarer une map : `mapName := map[type]type{key1: value1, key2: value2, keyN: valueN}`
* `mapName` : nom de la variable
* `map` : mot clé pour déclarer une map
* `[type]` : type de la clé qui sera écrite
* `type` : type de la valeur associée à une clé
* `{key1: value1, ...}` : coupe clé/valeur de la map

exemple : 
```Go
map := map[string]string{}

websites := map[string]string{
	"Google":         "https://www.google.com",
	"Facebook":       "https://www.facebook.com",
	"Twitter":        "https://www.twitter.com",
	"LinkedIn":       "https://www.linkedin.com",
	"GitHub":         "https://www.github.com",
	"Reddit":         "https://www.reddit.com",
	"Stack Overflow": "https://stackoverflow.com",
}

listParticipants := map[int]string{
	1: "Alice",
	2: "Bob",
	3: "Charlie",
	4: "Diana",
}
```

## 1. Travailler avec une `map`

La `map` est très pratique puisqu'on est pas obligé de retenir le contenu de la valeur ou sa position.  
La seule valeur à retenir est la clé associée à la valeur qu'on recherche.

On utilisera cette syntaxe : `mapName[key]`

exemple :
```Go
package main

import "fmt"

func main() {
	websites := map[string]string{
		"Google":         "https://www.google.com",
		"Facebook":       "https://www.facebook.com",
		"Twitter":        "https://www.twitter.com",
		"LinkedIn":       "https://www.linkedin.com",
		"GitHub":         "https://www.github.com",
		"Reddit":         "https://www.reddit.com",
		"Stack Overflow": "https://stackoverflow.com",
	}
	
	fmt.Println("Google URL:", websites["Google"])
}
```
output : 
```
go run .

https://www.google.com
```
Inconvénient, si on fait une faute de frappe sur le nom de la key, on ne pourra pas récupérer la valeur.

À la différence d'un array ou d'une slice, une map est toujours dynamique.  
On peut toujours ajouter de nouvelles paires clé/valeur.  

Pour ajouter une valeur, on va simplement accéder à la variable et introduire une nouvelle clé et une valeur correspondante : `mapName[key] = value`

exemple : 
```Go
websites["Amazon Web Services"] = "https://aws.amazon.com"
fmt.Println("Updated Websites:", websites)
```
output : 
```
go run .

Websites: map[Facebook:https://www.facebook.com GitHub:https://www.github.com Google:https://www.google.com LinkedIn:https://www.linkedin.com Reddit:https://www.reddit.com Stack Overflow:https://stackoverflow.com Twitter:https://www.twitter.com]

Google URL: https://www.google.com

Updated Websites: map[Amazon Web Services:https://aws.amazon.com Facebook:https://www.facebook.com GitHub:https://www.github.com Google:https://www.google.com LinkedIn:https://www.linkedin.com Reddit:https://www.reddit.com Stack Overflow:https://stackoverflow.com Twitter:https://www.twitter.com]
```

* Il est également possible d'écraser et remplacer une valeur en ciblant la clé associée à cette valeur :  
`mapName[existingKey] = newValue`

* On peut également supprimer une paire clé/valeur de cette manière :  
`delete(mapName[existingKey] = valueToDelete)`

## 2. `Maps` vs `Struct`

Avec les `maps`, on peut utiliser tout ce qu'on veut en tant que clé : `string`, `int`, `float64`, etc.  
Cela permet plus de flexibilité.  
Les `maps` résolvent d'autre problèmes que les `structs` : ce que l'on peut faire avec un map ne peut pas être réalisé avec un struct.  
Une fois le struct défini, on ne pourra pas lui ajouter de clé, ce qui est utile pour traiter des données qui ont exactement le type struct défini.  
Par contre, lorsqu'on a une collection de données qu'on veut labelliser, sans connaître à l'avance le nombre de données, le map est très utile et sera un meilleurs choix.

## 3. Utiliser la fonction `make()`

Lorsqu'on crèe un tableau vide (une slice), nous avons vu que Go alloue un espace mémoire qui est directement supprimé.  
On reste donc avec la `slice` qu'on va exploiter.  
Pour ajouter des données à cette slice, on a vu qu'on peut utiliser la fonction `append()` :
```Go
array := []string{}

array = append(array, "value1")
array = append(array, "value2")
```

En créant un tableau vide, Go ne sait pas à l'avance l'espace mémoire à attribuer.  
Et à chaque fois qu'on ajoute des données, Go réalloue de l'espace mémoire.  
Si on sait à l'avance le nombre de données, on peut déjà spécifier l'espace nécessaire.  
Go saura donc à l'avance que le tableau recevra X éléments.

Il est possible de spécifier à Go qu'on va avoir un array de plus oun moins grande taille de manière plus efficiente.  
C'est là que la fonction `make()` entre en jeu.  

Voici la syntaxe de déclaration avec la fonction `make()` :  
`arrayName := make([]type, length, capacity)`
* `arrayName` : nom de la slice
* `make()` : fonction de construction de la slice
* `[]type` : le type attendu des valeurs de la slice
* `length` : un nombre spécifiant la taille initiale du tableau
* `capacity` : nombre définissant le nombre maximum d'entrées possibles dans le tableau.  
Permet de contrôler la quantité d'espace mémoire qui sera alloué au tableau

Avec ces données, Go va créer un tableau `arrayName` : 
* du type spécifié en premier paramètre, 
* avec une taille prédéfinie grâce au deuxième paramètre et les valeurs initialisées à `null`, 
* dont la capacité maximum sera le nombre spécifié en troisième paramètre de la fonction.

de cette manière, on peut directement assigner des valeurs aux index précisés dans la taille du tableau sans utiliser la fonction `append()`.  

Exemple : 
```Go
package main

import "fmt"

func main() {
	userNames := make([]string, 2, 5)

	fmt.Println("User Names:", userNames)

	userNames[0] = "John"
	userNames[1] = "Doe"

	fmt.Println("User Names:", userNames)
}
```
output : 
```
go run .

User Names: [ ]
User Names: [John Doe]
```
Lorsqu'on va ajouter des données avec la fonction `append()`, ce sera fait de manière plus efficiente puisque Go n'aura pas besoin de réallouer de la mémoire au tableau.  
Il pourra utiliser l'espace existant parce qu'on a déjà réservé assez d'espace.  
Le seul moment ou il faudra allouer plus d'espace mémoire sera lorsqu'on va aller au delà de la capacité du tableau.

Cela va rendre le management de l'espace mémoire plus efficace et peut avoir de l'incidence sur la performance de l'application.

## 4. Créer des `maps` avec `make()`

En créant une map de cette manière : `mapName := map[type]type{}`, on ne spécifie pas l'espace mémoire qu'on souhaite allouer.  
Ce peut être problématique dans la gestion de la performance et le management de l'espace mémoire.  
C'est le même problème que pour la création de tableaux/slices.

On peut résoudre ce problème avec la fonction `make()` : `mapName := make(map[type]type, length)`.  
* `mapName` : nom de la variable
* `make()` : la fonction de création
* `map[type]type` : une map avec le type des keys et le type des values
* `capacity` : espace mémoire pré-alloué.
* Ici, pas de `length` : comme une map ne peut pas avoir de key nulle, on ne va pas pouvoir ajouter d'éléments à null.

En procédant ainsi, on aura un gain de performance lorsqu'on va remplir les datas de la map.  
Le seul moment ou Go aura besoin de réallouer de l'espace mémoire sera lorsqu'on ajoute des datas en dépassant l'espace prévu initialement.

## 5. Travailler avec les `alias de type`

Pour gagner en efficacité dans l'écriture du code, on peut travailler avec des `alias de type`.  
déclarer une map de cette manière : `mapName := make(map[type]type, length)` peut être difficile à lire.  

C'est là qu'on pourra utiliser les alias.

Pour déclarer un alias, on procédera ainsi : `type aliasName map[type]type`.  
On pourra également ajouter des méthodes et les utiliser. 

exemple : 
```Go
package main

import "fmt"

type floatMap map[string]float64

func (m floatMap) output() {
	fmt.Println("Float Map:", m)
}

func main() {
	floatNumbers := make(floatMap, 3)

	floatNumbers["pi"] = 3.14
	floatNumbers["e"] = 2.71
	floatNumbers["phi"] = 1.618

	floatNumbers.output()
}
```
output : 
```
go run .

Float Map: map[e:2.71 phi:1.618 pi:3.14]
```

Même sans utiliser de méthodes, utiliser des alias permet d'avoir du code plus concis et donc plus efficace à lire.