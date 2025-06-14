# I. GO ESSENTIALS

### _Values, Basic Types & Core Language Features_

* Comprendre les **"Key Components"** d'un programme Go
* Travailler avec les **"Value & Types"**
* Créer et exécuter des **"Functions"**
* Controller les exécutions avec des **"Control Structures"**

Avant de commencer, regardons comment initialiser un projet Go : 
* Créer le dossier qui va contenir l'application (terminal : `mkdir go-app`)
* Dans ce dossier, ajouter un fichier `app.go` (terminal : `cd go-app` puis `touch app.go`)
* Ajouter dans ce fichier les lignes suivantes : 
```Go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```
Dans le terminal, à la racine du projet, écrire ces commandes : 

* `go mod init example.com/app-name`  
Initialise in fichier go.mod qui contient le code suivant : 
```Go
module example.com/control-structures

go 1.23.5
```
* `go build`  
va générer un fichier appelé `app-name`
* `go run .`  
va permettre de faire fonctionner l'application dans le terminal

## A. GO PROGRAM KEY COMPONENT

### 1. Fichiers et Packages
### 2. L'importance du nom `main`
### 3. L'importance de la fonction `main()`

## B. VALUES & TYPES

### 1. TYPES DE BASE
### 2. Valeurs nulles
### 3. Déclaration des variables
### EXERCICE : CRÉER UN CALCULATEUR DE PROFIT
### 4. Formatter de 'strings' avec les fonctions `fmt.Print...()`
### 5. Formatter des floats en strings
### 6. Introduction de la fonction `fmt.Sprint...()`
### 7. Contruire des strings multiples

## C. COMPRENDRE LES FONCTIONS

### DEFINIR UNE FONCTION
### EXERCICE : UPDATE DU CALCULATEUR DE PROFIT AVEC DES FONCTIONS

## D. STRUCTURES DE CONTRÔLE

### 1. `if` Statement = `si`
### 2. Travailler avec le `else if` = `sinon si`

## E. LES BOUCLES FOR

## F. SWITCH CASE

## G. FAIRE PERSISTER ET EXTRAIRE DE LA DATA D'UN FICHIER

### 1. Faire persister de la data vers un fichier
### 2. Extraire et lire de la data depuis un fichier

## I. ERROR HANDLING

## J. UTILISATION DE PANIC