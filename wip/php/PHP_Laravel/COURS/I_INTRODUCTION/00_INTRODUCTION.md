# INTRODUCTION

Laravel est un framework web PHP qui permet de créer des applications web propres,
structurées et maintenables. Il repose sur l'architecture **MVC (Modèle-Vue-Contrôleur)**,
qui permet de séparer clairement la logique métier, les données et la présentation.

Ce framework a été créé en 2011 par Taylor Otwell, et c'est en 2015 avec Laravel 5
que le framework a vraiment explosé.

Attention, Laravel n'est pas un langage (le langage est le PHP). C'est une boîte à
outils pour bien organiser son code.

Il est utilisé dans le monde entier et c'est le framework PHP le plus utilisé (devant Symfony).

Laravel est connu pour faire un peu de 'magie'. C'est-à-dire que certaines opérations
complexes s'effectuent en très peu de lignes, grâce à des mécanismes comme les **facades**,
l'**injection de dépendances** et le **conteneur de services**. Le code de Laravel est
entièrement open source et accessible, mais il abstrait une grande partie de la complexité
pour nous permettre d'aller à l'essentiel.

## Framework

À quoi sert un framework ?

1. Le framework permet d'éviter de réinventer la roue. On va utiliser des fonctions
   (méthodes) qui permettent de réaliser des exécutions de code sans avoir à tout coder
   de zéro.
2. On a un code structuré proprement dès le départ.
3. Le code est standardisé, cela permet de retrouver toujours les mêmes patterns afin
   de développer plus vite ou encore d'arriver dans un projet existant sans être
   totalement perdu.
4. Permet de gagner du temps et de la qualité.

Le code est homogène entre développeurs. On évite le 'fait maison' où seul un
développeur comprend les tenants et les aboutissants d'un code qu'il maintient depuis
15 ans.  
Cela permet également d'éviter de faire des erreurs de débutant (notamment en termes
de sécurité).

## Versionning

Auparavant, on avait Laravel 1, 2, ..., 5. Puis 5.1, 5.2, 5.3... Certaines versions
étaient dites **LTS (Long Term Support)** (ex: 5.1, 5.5, 6.x) et bénéficiaient d'une
maintenance étendue de 3 ans sur la sécurité.

C'est alors que le versionning a changé : Laravel utilise maintenant le **Semantic
Versioning**.  
Cela signifie qu'une version majeure sort chaque année (autour du mois de
février/mars).  
**Depuis Laravel 9, il n'y a plus de versions LTS.** Toutes les versions bénéficient
désormais du même support : 18 mois de maintenance sur les bugs et 2 ans sur la
sécurité.

Depuis le changement de versionning, ce ne sont pas de gros changements qui sont
appliqués. On restera sur le même principe malgré les évolutions.  
Cela implique qu'une montée de version pour rester à jour et éviter la dette technique
est tout à fait réalisable, tant qu'on se tient à jour d'une version à l'autre.

## À quoi sert Laravel ?

Il est possible de coder n'importe quelle application web avec Laravel, que ce soit :

- un simple site
- une application métier
- un back-office
- une API
- un produit SaaS
- etc.

Laravel est utilisé aussi bien sur des petits que sur des gros projets (Ornikar, ou
encore HelloWork).  
C'est un framework robuste et largement utilisé dans le monde.

## La philosophie de Laravel

L'objectif est de rendre le développeur productif et serein.

Il facilite beaucoup de choses et fait attention à ne pas être verbeux (contrairement
à d'autres frameworks comme Symfony par exemple).  
Laravel simplifie grandement le code pour aller à l'essentiel, il faut pour cela être
capable de faire preuve d'abstraction et de lâcher prise.

1. Lisibilité avant tout
2. Simplicité autant que possible
3. Convention plutôt que configuration (ex: les tables en base de données sont écrites
   en minuscules et au pluriel, alors que le modèle de données est lui en PascalCase et
   au singulier. Ainsi, Laravel va comprendre que la classe `User` sera associée à la
   table `users`.)

## Les outils clés intégrés à Laravel

Laravel est livré avec un ensemble d'outils puissants directement intégrés au framework :

- **Artisan** : l'interface en ligne de commande (CLI) de Laravel. Elle permet de
  générer du code (modèles, contrôleurs, migrations...), de lancer des migrations, de
  vider les caches, etc. Exemple : `php artisan make:model Article`.
- **Eloquent ORM** : le système de mapping objet-relationnel de Laravel. Il permet
  d'interagir avec la base de données de façon intuitive via des classes PHP, sans
  écrire de SQL brut dans la plupart des cas.
- **Blade** : le moteur de templates de Laravel. Il permet d'écrire les vues (HTML)
  de façon propre et expressive, avec des directives comme `@foreach`, `@if`,
  `@extends`, etc.
- **Migrations** : un système de versioning de base de données. Elles permettent de
  décrire la structure de la BDD en PHP et de la faire évoluer de manière collaborative
  et traçable.
- **Routing** : un système de routage clair et expressif, permettant de définir
  facilement les URLs de l'application et les actions associées.

## L'écosystème de Laravel

Laravel est un framework très abouti et solide, avec beaucoup d'éléments.  
Il possède une communauté open source qui rajoute beaucoup de packages.
Laravel propose aussi d'autres outils dans son écosystème :

- des packages supplémentaires (gestion docker avec `Sail`, aide au déploiement avec
  `Envoy`, gestion de paiement en ligne avec `Cashier`, monitoring avec `Telescope`,
  authentification avec `Breeze` ou `Jetstream`, authentification API avec `Sanctum`,
  etc.)
- des produits payants (Laravel Nova pour créer des Back-Offices rapidement, Laravel
  Forge pour gérer des serveurs et sites en ligne, etc.)

## Résumé

Laravel est un framework web basé sur PHP, qui évolue chaque année et qui inspire
beaucoup d'autres frameworks sur sa façon de travailler.

Laravel possède une code base d'excellente qualité, une très grande communauté mondiale
avec beaucoup de tutos, d'entraide et de packages de qualité.

Il propose des packages gratuits très utiles (Cashier, Horizon, Sail, Telescope,
Breeze, Sanctum).

Il propose enfin des outils payants dédiés à l'écosystème Laravel (Laravel Cloud,
Laravel Forge, Laravel Nova).

Laravel existe depuis plus de 10 ans, et est réellement stable depuis sa version 5.

On peut faire confiance en sa solidité.
