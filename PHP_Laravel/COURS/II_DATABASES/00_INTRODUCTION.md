# Récupérer des produits via une Base de Données (BDD)

ORM = Object Oriented Mapping

Eloquent = nom de l'ORM de Laravel

Points de documentations abordés :
* Migrations
* Seeding
* Query Builder
* Eloquent (start)
* Factories
* Eloquent Collections
* Casts/Mutators

## A quoi sert la BDD

Laravel est un framework MVC (Model, Vue, Controller). On a déjà vu dans la partie Introduction à Laravel les parties Vue et Controller. On va aborder la partie Model.

Dans une application, on se sert de données qu'on récupère dynamiquement pour ensuite les afficher, les traiter.

## Gestion de BDD

éléments de la documentation abordés :
1. Migration
2. Seeding
3. Query Builder

Ces éléments permettent de :
* créer une BDD (avec ses tables, champs, etc.) grâce aux migrations
* remplir avec des données tests, grâce aux seeders
* récupérer les données directement avec les query builders (SQL)

## Eloquent ORM

Surcouche à la gestion de BDD efficaces.

éléments de la documentation abordés :
1. Eloquent
2. Factories
3. Mutators et Casts

Ces éléments permettent de rendre le code plus professionnel et robuste.
