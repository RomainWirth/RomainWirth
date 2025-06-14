# A. GO PROGRAM KEY COMPONENTS

```Go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}

```

**Println(...)** est une fonction qui équivaut à l'exécution d'une commande : on souhaite ici 'print' dans le terminal `la valeur` passé en paramètre de la fonction.

**fmt** est un package intégré nativement à Go que l'on importe. Il permet d'avoir accès à différents fonctions utilitaires de Go, telle que Print, Println...

**func main()** est une fonction qu'on définit nous même. Il s'agit ici de la fonction principale qui sera exécutée par Go.

**package main** est une clause indiquée au début de chaque fichier. Cette clause est nécessaire au bon fonctionnement du fichier et doit toujours être écrite au début du fichier.

## 1. Fichiers et Packages

Lorsqu'on écrit du Go, on sépare le code dans des "paquets" (packages).
* Il faut au minimum un package par application. 
* Il est possible d'avoir plusieurs packages.
* Un package peut être séparé en plusieurs fichiers.

```Go
app.go // package main
| second
| | name.go // pachage second
| | name2.go // package second
| third
| | name.go // package third
| fourth
| | name.go // pachage fourth
| | name2.go // package fourth

```
L'idée derrière cette architecture est d'organiser le code.\
On a besoin de ces packages qu'on va importer dans d'autres packages pour faire fonctionner notre application.

le package **fmt** est un package de [Go standard library](https://pkg.go.dev/std).

## 2. L'importance du nom "main"

`main` est un package spécial qui indique à Go que ce sera ce package qui est le point d'entrée principal de l'application.  
Il s'agit également du `module` qui permet à l'application de fonctionner.  

Lorsqu'on souhaite démarrer l'application, on va d'abord utiliser la commande : `go mod init example.com/first-app`.  
Cette commande va initialiser un fichier `go.mod` qui va contenir ces information : 

```Go
module example.com/first-app

go 1.23.5
```

Nous avons donc un module avec un nom (ou 'path'), et on pourra ensuite utiliser la commande `go build`.  
Une fois cette dernière commande exécutée, un nouveau fichier `first-app` va apparaître.  
Ainsi, on aura simplement à exécuter la commande `./first-app` dans le terminal depuis la racine pour lancer l'application.

En résumé, le package `main()` indiquera toujours le point d'entrée, quel que soit la manière de lancer l'application. (dev, prod, etc.)

## 3. L'importance de la fonction "main()"

Cette fonction, située dans le package main, est la fonction qui sera exécutée comme point d'entrée du programme :
* Elle doit être nommée `main()` pour indiquer à Go quelle est la toute première fonction à exécuter.
* Il ne peut y avoir qu'une seule fonction `main()` au sein d'un même package.
* Par convention, on aura une seule fonction `main()` dans une application, qui sera située dans le package `main`.