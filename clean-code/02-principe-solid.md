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

## Single Responsibility : Principe de Responsabilité Unique

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
 
## Open/Closed : Principe Ouvert/Fermé

"Les entités logicielles (classes, modules, fonctions, etc.) doivent être ouvertes à l'extension, mais fermées à la modification." - Bertrand Meyer

Ce principe stipule qu'une classe doit être conçue de manière à ce qu'on puisse étendre son comportement sans avoir à la modifier.

Une entité applicative (classe, fonction, module ...) doit être fermée à la modification directe mais ouverte à l'extension. L'objectif est de permettre l'ajout de nouvelles fonctionnalités sans altérer le code existant.

<!-- ajouter un exemple  -->
```js

```

## Liskov Substitution : Principe de Substitution de Liskov

"Si S est un sous-type de T, alors les objets de type T peuvent être remplacés par des objets de type S sans altérer les propriétés désirables du programme." - Barbara Liskov

Ce principe stipule que les objets d'une classe dérivée doivent pouvoir remplacer les objets de la classe de base sans affecter la cohérence du programme.

une instance de type T doit pouvoir être remplacée par une instance de type G, tel que G sous-type de T, sans que cela ne modifie la cohérence du programme. Cela garantit que les sous-classes peuvent être utilisées de manière interchangeable avec leurs classes de base.

<!-- ajouter exemple  -->
```JS

```
1. Les sous-classes doivent respecter le contrat défini par la classe de base.
2. Les préconditions ne peuvent pas être renforcées dans une sous-classe.
3. Les postconditions ne peuvent pas être affaiblies dans une sous-classe.
4. Les invariants de la classe de base doivent être préservés dans les sous-classes.
5. La règle "est-un" n'est pas suffisante pour déterminer l'héritage; il faut également
   considérer le comportement de la classe.

Une conception qui respecte le principe de substitution de Liskov rend le code plus robuste, plus facile à comprendre et plus réutilisable.

