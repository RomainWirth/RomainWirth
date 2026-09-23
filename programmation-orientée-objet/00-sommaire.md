# PROGRAMMATION ORIENTÉE OBJET - SOMMAIRE

Cours d'introduction à la Programmation Orientée Objet (POO). Les concepts sont présentés en pseudo-code (langage algorithmique), indépendamment de tout langage réel, afin de se concentrer sur la logique de conception. Chaque chapitre contient des explications, des exemples et des exercices corrigés qui suivent trois fils rouges : les classes `Character`, `Book` et `Car`.

## Parcours conseillé

1. [01-introduction.md](./01-introduction.md)
2. [02-des-variables-aux-objets.md](./02-des-variables-aux-objets.md)
3. [03-creer-et-manipuler-des-objets.md](./03-creer-et-manipuler-des-objets.md)
4. [04-les-fonctions-de-classe.md](./04-les-fonctions-de-classe.md)
5. [05-visibilite-et-encapsulation.md](./05-visibilite-et-encapsulation.md)
6. [06-heritage-et-polymorphisme.md](./06-heritage-et-polymorphisme.md)
7. [07-interactions-entre-objets.md](./07-interactions-entre-objets.md)
8. [08-abstraction-en-pratique.md](./08-abstraction-en-pratique.md)
9. [09-mini-projet-modelisation-libre.md](./09-mini-projet-modelisation-libre.md)
10. [10-synthese.md](./10-synthese.md)

## Contenu du dossier

### [01-introduction.md](./01-introduction.md)

Qu'est-ce que la POO : différence entre programmation procédurale et orientée objet, logique de conception par entités « à existence propre », premières définitions des objets et des classes.

### [02-des-variables-aux-objets.md](./02-des-variables-aux-objets.md)

Rappel sur les variables (nommage, camelCase, types primaires STRING/INTEGER/BOOLEAN) et passage des variables isolées à la notion d'objet regroupé par une classe.

### [03-creer-et-manipuler-des-objets.md](./03-creer-et-manipuler-des-objets.md)

Le constructeur, l'instanciation avec le mot clé `new`, le rôle de `this`, l'hydratation des objets, l'accès aux attributs via `objet.attribut`, et le parcours d'un tableau d'objets avec une boucle.

### [04-les-fonctions-de-classe.md](./04-les-fonctions-de-classe.md)

Définition de fonctions (méthodes) à l'intérieur d'une classe et appels d'une fonction par une autre.

### [05-visibilite-et-encapsulation.md](./05-visibilite-et-encapsulation.md)

Visibilité `public` / `private`, principe d'encapsulation, mise en place des getters et setters pour un accès contrôlé aux attributs, et nuance sur les limites d'un usage systématique des getters/setters.

### [06-heritage-et-polymorphisme.md](./06-heritage-et-polymorphisme.md)

Héritage (`EXTENDS`, `super`, `PROTECTED`), redéfinition de fonctions, polymorphisme, distinction entre héritage (« est un ») et composition (« a un »), avec un exemple et un exercice pratiques de composition (`Car`/`Engine`, `Garage`).

### [07-interactions-entre-objets.md](./07-interactions-entre-objets.md)

Un objet qui gère une collection d'autres objets (`Library` et ses `Book`, `Garage` et sa flotte de `Car`), et un objet qui agit directement sur un autre objet passé en paramètre (combat entre deux `Character`).

### [08-abstraction-en-pratique.md](./08-abstraction-en-pratique.md)

L'abstraction concrétisée par `ABSTRACT CLASS` (classe non instanciable, fonctions abstraites) et `INTERFACE` (`IMPLEMENTS`), appliquées aux fils rouges `Character` et `Car`.

### [09-mini-projet-modelisation-libre.md](./09-mini-projet-modelisation-libre.md)

Mini-projet de modélisation sans squelette de classe fourni (système de vélos en libre-service), pour pratiquer la démarche complète de conception : identifier les entités, leurs attributs, leurs traitements et leurs interactions.

### [10-synthese.md](./10-synthese.md)

Glossaire des notions clés (y compris composition, classe abstraite et interface), exemple récapitulatif complet et présentation des 4 piliers de la POO (encapsulation, abstraction, héritage, polymorphisme).

## Conseil de progression

- lire un chapitre ;
- réaliser les exercices sans regarder la correction ;
- comparer avec le corrigé, puis passer au chapitre suivant.
