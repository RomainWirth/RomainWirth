# CRÉER UNE VERSION BASIQUE DU PROJET

N.B.: au besoin, ajouter un repo git au projet pour versionner l'avancée

## SET UP

* Créer un nouveau dossier pour l'application
* Ajouter deux fichiers : `go.mod` et `main.go`

go.mod :
```GO
module example.com/price-calculator

go 1.21.2
```
main.go
```GO
package main

func main() {
  // ...
}
```

## Version basique

* ajouter un slice de prix qui est un ensemble de `float64`
```GO
var prices []float64 = []float64{10, 20, 30}
```
* ajouter un slice pour les taxes, c'est également un `float64`
```GO
var taxRates []float64 = []float64{0, 0.021, 0.055, 0.1, 0.2}
```
