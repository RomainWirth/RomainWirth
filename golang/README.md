# GO

Notes taken while learning [GO](https://go.dev/)

Prérequis : installer Go sur sa machine. Se référer à la documentation [Download and install](https://go.dev/doc/install)

# I. GO ESSENTIALS

* Comprendre les **"Key Components"** d'un programme Go
* Travailler avec les **"Value & Types"**
* Créer et exécuter des **"Functions"**
* Controller les exécutions avec des **"Control Structures"**

### A. GO PROGRAM KEY COMPONENT
### B. VALUES & TYPES
### C. COMPRENDRE LES FONCTIONS
### D. STRUCTURES DE CONTRÔLE
### E. LES BOUCLES FOR
### F. SWITCH CASE
### G. FAIRE PERSISTER DE LA DATA VERS UN FICHIER
### H. EXTRAIRE ET LIRE DE LA DATA DEPUIS UN FICHIER
### I. ERROR HANDLING
### J. UTILISATION DE PANIC

# II. LES PACKAGES

* Séparer le code au travers de `plusieurs fichiers`
* Séparer les fichiers au travers de `plusieurs packages`
* `Importer et utiliser` les packages custom

### A. SÉPARER DU CODE EN PLUSIEURS PACKAGES
### B. POURQUOI UTILISER PLUS D'UN PACKAGE ?
### C. EXPORTER, IMPORTER DES IDENTIFIERS (Variables, Functions, etc.)
### D. UTILISER DES "THIRD PARTY PACKAGES"

## III. LES POINTEURS : Travailler avec des adresses plutôt que des valeurs.

* Qu'est-ce qu'un pointeur ?
* Pourquoi est-ce que cela existe ?
* Comment travailler avec des pointeurs ?

### A. COMPRENDRE LES POINTEURS 
### B. POURQUOI UTILISER UN POINTEUR ? 
### C. COMMENT TRAVAILLER AVEC DES POINTEURS ?

## IV. STRUCTS & CUSTOM TYPES

* Que sont les `Structs` ?
* Créer & utiliser des `Structs`
* Ajouter des `Méthodes` (fonctions) aux Structs

### A. À QUEL PROBLÈME RÉPOND `struct` ?
### B. CRÉER ET UTILISER DES `struct`
### C. AJOUTER DES MÉTHODES ET DES FONCTIONS AUX `struct`

## V. INTERFACE & GENERIC CODE

* Que sont les `interfaces` ?
* Comment **créer** et **utiliser** des interfaces ?

### A. QU'EST CE QU'UNE INTERFACE ?
### B. CRÉER UNE INTERFACE
### C. UTILISER UNE INTERFACE

## VI. MANAGER DES DONNÉES RELATIONNELLES AVEC DES `ARRAYS`, `SLICE` et `MAPS`

* Comprendre les tableaux `arrays` et leurs limites
* Comprendre et utiliser des `slices`
* Approfondir avec les `slices`
* Comprendre et utiliser les `maps`

### A. INTRODUCTION AUX `ARRAYS`
### B. SÉLECTIONNER DES ÉLÉMENTS D'UN TABLEAU AVEC DES `SLICE`
### C. APPROFONDIR AVEC LES `SLICES`
### D. INTRODUCTION AUX `MAPS`
### E. LA BOUCLE `FOR` AVEC LES `ARRAYS`, `SLICES` ET `MAP`

## VII. APPROFONDIR LES `FONCTIONS`

* Utiliser des fonctions en tant que `valeurs`
* fonctions `anonymes`
* les `récursives`
* les fonctions `variadiques`

### A. LES FONCTIONS EN TANT QUE `VALEURS` ET LES `TYPES DE FONCTIONS`
### B. INTRODUCTION AUX FONCTIONS `ANONYMES`
### C. LES FONCTIONS `RÉCURSIVES`
### D. UTILISER DES FONCTIONS `VARIADIQUES`

## VIII. PRATIQUER LE GO 

* Construire une `Demo App` de zéro
* Il s'agit d'un outil qui calcule les prix tax incluses d'une liste de prix hors taxes et d'une liste de montants de taxe
* Il faudra utiliser les `interfaces`, les `structs`, les `fonctions`, les `methodes`,  
travailler avec des fichiers, plusieurs `packages`