# PROGRAMMATION ORIENTEE OBJET - INTRODUCTION

## Qu'est ce que la POO ?

<a href="https://course.valentinflgt.fr/#/c/2023/poo/1.-introduction#classe">source</a>

La POO (ou OOP en anglais = Object Oriented Programming).<br>
C'est un modèle de programmation qui repose sur le concept de `class` et `d'objet`.

```
On mettra l'accent sur la donnée et les objets, et leur représentation
```

La POO s'articule autour de plusieurs grands concepts :
* Les objets
* Les class
* L'héritage

## Rappels de la programmation 

Tout programme contient 2 parties fondamentales :<br>
1. **Les données :**<br> 
Dans un programme, les données sont véhiculées par des variables.<br>
Le stockage des informations se fait via une base de données.<br>
2. **Les traitements :**<br>
Ce sont les lignes d'instructions qui permettent d'utiliser et manipuler les information, ergo, les données.<br> 
Ajouter, modifier, lire ou encore supprimer.<br>

Il existe plusieurs manières de mettre en oeuvre les relations entre ces deux parties : deux logiques de programmation différentes.<br>
1. La programmation séquentielle / procédurale :
   * Cette méthode de programmation dissocie fortement les données et les traitements, et chaque instruction se réalise indépendamment des données.<br>
   il n'y a pas de corrélation directe entre les deux.<br>
   * Les fonctions créées permettent de structurer le code et de le rendre réutilisable (concept de factorisation).<br>
   * La logique de programmation est basée sur l'enchaînement d'instructions.<br>
2. La Programmation Orientée Objet :
   * Cette méthode de programmation permet de regrouper des informations et des traitements en un bloc ayant une "existence propre".<br>
   * La logique de programmation est basée sur la création d'entités et non sur l'enchaînement d'instructions.<br>

## La logique de la POO

En POO, on va se poser des questions sur les éléments ayant une "existence propre".<br>
Cela induit un questionnement sur ce qui est nécessaire à la réalisation du programmae.<br>

exemple :<br>
On souhaite créer une application qui gère une concession automobile et va permettre aux clients d'achater des voitures.<br>
* En POO, on va commencer par se poser la question : quelles sont les entités qui auront une "existence propre" ?
  * Les voitures
  * les clients
  * le parc automobile
* Quelles sont les informations dont j'aurai besoin sur chacune des entités ?
  * Voitures : modèle, marque, plaque d'immatriculation...
  * Client : nom, prénom, téléphone...
  * Parc automobile : adresse, nom, téléphone...

Quels sont les traitements associés à mes entités ?
* Voiture : afficher les caractéristiques, modifier l'état du véhicule, modifier le prix...
* Client : réserver, modifier les infos personnelles, commander...
* Parc auto : lister les voitures, ajouter une voiture, supprimer une voiture...

**On va créer des blocs logiques qui donnreont lieu à des "objets".**<br>
Par exemple, pour les voitures, nous aurons un objet voiture qui aura :<br>
* une marque
* un nom de modèle
* une année de création
* le nombre de portes
* un prix

Cette classe d'objet pour être utilisée autant de fois qu'on aura de voitures, grâce à l'instanciation.<br>
(Voiture 1, voiture 2, voiture 3...).<br>
Les traitement liés à ces objets peuvent être les suivant : afficher les caractéristiques, modifier le prix, etc.<br>

## Les objets

L'objet est un concept de programmation qui représente quelque chose.<br>
En programmation (POO), un objet est un bloc logique, la représentation d'une donnée que notre application manipule.<br>

L'objet est issu d'un "moule" qui regroupe et structure les informations (données + traitement).

**Cette structure est appelée une Classe.**

## Les Classes

Une classe est la représentation programmatique d'un objet.<br>
Elle va permettre de générer des objets qui disposent d'une structure semblable.<br>

```
Une classe est un créateur d'objets ayant des caractéristiques communes.
les classes sont donc les moules des objets.
```

La classe est composée de propriétés et de méthodes.<br>
1. Les propriétés sont les variables internes à la _**class**_.<br>
Elles stockent des valeurs qui représentent l'objet représenté.
2. Les méthodes sont les fonctions internes à la class.<br>
   * On parle de _**getters**_ qui permettent l'accès à des propriétés privées depuis un contexte externe.<br>
   * On parle de _**setters**_ qui permettent la mise à jour de propriétés privées depuis un contexte externe.<br>

## Les concepts de programmation

Bien que la logique de programmation entre procédural/séquentiel et POO soit radicalement différente,<br>
les bases apprises pour réaliser des programmes restent valables :<br>
On utilisera toujours des variables, des tableaux, des boucles, des fonctions, etc.

Ce qui va différer sera la réflexion et la conception des programmes :<br> 
l'architecture globale sera différente.<br>
