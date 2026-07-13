# Les principes SOLID

## Introduction

Cet acronyme est un moyen mnémotechnique pour aider à se souvenir des principes.

Le fait de respecter ces principes permettent de produire des applications/logiciels plus maintenable, evolutif, avec une meilleure structure et une architecturé.

SOLID est un acronyme qui signifie : 
* Single responsibility principle : Responsabilité unique
* Open/closed principle : Ouvert/fermé
* Liskov substitution principle : Substitution de liskov
* Interface segregation principle : Ségrégation des interfaces
* Dependency inversion principle : Inversion des dépendances

## Principe de Responsabilité Unique (Single Responsibility)

"Une classe ne devrait avoir qu'une seule raison de changer." - Robert C. Martin

Ce principe stipule qu'une classe ou module doit avoir une seule responsabilité, c'est-à-dire qu'elle ne devrait s'occuper que d'une seule tâche ou préoccupation : une classe, une fonction ou une méthode doit avoir une et une seule unique raison d'être. 

Cela favorise la modularité et facilite la maintenance en évitant les classes surchargées de responsabilités.

Cela rejoint le principe DRY (Don't Repeat Yourself) : on crée par exemple une fonction unique qui a sa propre "raison d'être" qu'on peut réutiliser partout où on en a besoin. 
<!-- à vérifier ce que j'ai écrit ici si vraiment logique.  -->

exemple : 
<!-- exemple à vérifier si pas meilleurs de mettre avec une class -->
```js
function calculatePriceWithAddedValueTax (priceWithoutTax: number) {
    const tax = 20%;
    return priceWithoutTax + (priceWithoutTax*tax);
};
```
 
## Principe Ouvert/Fermé (Open/Closed)

"Les entités logicielles (classes, modules, fonctions, etc.) doivent être ouvertes à l'extension, mais fermées à la modification." - Bertrand Meyer

Ce principe stipule qu'une classe doit être conçue de manière à ce qu'on puisse étendre son comportement sans avoir à la modifier.

Une entité applicative (classe, fonction, module ...) doit être fermée à la modification directe mais ouverte à l'extension. L'objectif est de permettre l'ajout de nouvelles fonctionnalités sans altérer le code existant.

<!-- exemple avec une classe personnage générique, et ajouter le contenu : points de vie, etc. -->
```js
class character {
    constructor () {

    }
}

class hero extends character {

}

class vilain extends character {

}
```

