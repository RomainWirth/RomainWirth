# A. COMPRENDRE LES POINTEURS 

## Qu'est-ce qu'un pointeur ?  

Un pointeur est une variable qui stocke les `adresses des valeurs` plutôt que les valeurs elles-même.

Lorsqu'on crée une variable, la valeur de cette variable est stockée dans la mémoire de l'ordinateur.  
Chaque espace de la mémoire de l'ordinateur possède une adresse.  
Cette adresse est nécessaire pour que l'ordinateur puisse récupérer la valeur et l'exploiter.  

Par exemple, lorsqu'on déclare une variable : 
```Go
age := 32
```
sa valeur est stockée dans la mémoire de l'ordinateur :  
valeur de age : `32` => adresse mémoire : `0xc000018050`  

Chaque valeur utilisée en Go est stockée (pour une période plus ou moins longue) dans la mémoire de l`ordinateur.

Un `pointeur est une variable` dans laquelle on **ne stocke pas** de valeur  
mais dans laquelle on utilise l'opérateur `&` (esperluette) pour récupérer et stocker l'adresse d'une valeur au lieu de la valeur elle-même.  
```Go
agePointer := &age
```
valeur de agePointer : `0xc000018050` => adresse de la valeur de `age`.

# B. POURQUOI UTILISER UN POINTEUR ? 

Il y a deux avantages à utiliser des pointeurs : 
* Cela permet d'éviter les copies de valeurs inutiles. 
* On peut utiliser des pointeurs pour directement modifier des valeurs.

## 1. PREMIER AVANTAGE : 

Par défaut, dans un programme en Go,  
lorsqu'on passe une variable en paramètre d'une fonction,  
pour que cette fonction travaille avec la valeur de cette variable,  
Go crée une copie de la valeur de cette variable en mémoire  
et passe cette copie à la fonction. 

Durant une cette période de temps, jusqu'à ce que l'exécution de la fonction soit terminée,  
et que la copie de la valeur soit nettoyée par le 'garbage collector'*,  
on aura la même valeur deux fois en mémoire.  

Cela peut poser problème lorsqu'on a des valeurs très grandes et complexes dans certaines applications :  
Vu qu'on a deux fois la même valeur, on occupe deux fois l'espace dans la mémoire de l'ordinateur.

Lorsqu'on passe un pointeurs en argument d'une fonction, on ne crée par une copie de la valeur.  
Au lieu de cela, la fonction va recevoir l'adresse mémoire  
et peut utiliser cette adresse pour rechercher la valeur qui est stockée à cette adresse.
Cela va permettre de travailler avec la valeur qui est stockée là.

*_garbage collector = processus qui s'exécute automatiquement en arrière plan et qui se débarrasse des valeurs inutilisées_ 

## 2. DEUXIÈME AVANTAGE

On peut écrire des fonctions auxquelles on passe en paramètre des pointeurs au lieux de valeurs :  
On passe donc une adresse au lieu d'une valeur.

En connaissant l'adresse de la valeur originale,  
ces fonctions peuvent donc directement modifier cette valeur.  

Cela permet de manipuler directement la valeur au lieu davoir à calculer une nouvelle valeur basée sur la valeur d'entrée,  
puis retourner cette valeur pour qu'elle soit utilisée là ou la fonction a été appelée.  

De cette manière, on peut reduire le code puisqu'on peut éviter d'avoir l'instruction de retour.

ATTENTION : Cela peut aussi mener à du code plus difficile à comprendre et des comportement non souhaités.

