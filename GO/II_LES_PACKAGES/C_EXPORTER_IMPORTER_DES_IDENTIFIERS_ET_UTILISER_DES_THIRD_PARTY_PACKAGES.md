# C. EXPORTER, IMPORTER DES IDENTIFIERS & UTILISER DES "THIRD PARTY PACKAGES"

## 1. EXPORTER, IMPORTER DES IDENTIFIERS (Variables, Functions, etc.)

**Afin d'exporter des fonctions ou variables depuis un package**,  
il est nécessaire d'écrire les noms des fonctions et variables dans le package avec une première lettre en `majuscule`.

**Pour importer dans un autre package**,  
il va falloir updtader les imports et modifier la manière d'appeler les fonctions.

Dans notre fichier `app.go`, on va pouvoir : 
* supprimer les anciennes fonctions qui ont été écrites dans le nouveau package, 
* ajouter à l'import `fileoperations` : 
  * `"example.com/control-structures/file-operations"`
* et utiliser les fonctions en les déclarant ainsi : 
  * `accountBalance, err := fileoperations.GetFloatFromFile(accountBalanceFile)`
  * `fileoperations.WriteFloatToFile(accountBalance, accountBalanceFile)`

## 2. UTILISER DES "THIRD PARTY PACKAGES"

Il s'agit de packages qui ne font pas partis de la librairie standard et qui ont été développés par d'autres développeurs.  
En effet, Go dispose d'une communauté et d'un écosystème très actif, avec des personnes qui développent des packages qu'elles partagent avec le reste du monde.

Par exemple, le package `go-randomdata` : [GitHub](https://github.com/Pallinder/go-randomdata) et [Package](https://pkg.go.dev/github.com/Pallinder/go-randomdata).  
Ce package permet de générer des fake datas pour créer des applications.

Pour trouver des packages, on peut se servir de la barre de recherche de la section [Packages](https://pkg.go.dev/) du site Go.  
Etant donné que les packages sont `open source`, il est possible d'utiliser n'importe lequel dans son application du moment qu'il est publié sur Go.  
Il faudra installer le package sur son application via la commande `go get` + `lien vers le repo du package` :  
`go get github.com/Nom-de-l-auteur/repo-github` (go get github.com/Pallinder/go-randomdata).  

Cette commande va permettre de télécharger le package.  
On n'aura pas le code source mais le fichier `go.md` sera édité :
```Go
module example.com/control-structures

go 1.23.5

require github.com/Pallinder/go-randomdata v1.2.0 // indirect
```

Le fichier `go.mod` ne sert pas uniquement à décrire le module, mais aussi pour lister toutes les dépendances externes du projet.  
Cela permet, lors du partage du projet, aux autres personnes de télécharger toutes les dépendances en exécutant : `go get`.

La commande `go get`, utilisée sans chemins après, va examiner le fichier `go.mod` et s'assurera que toutes les dépendances qui y sont spécifiées sont récupérées.
