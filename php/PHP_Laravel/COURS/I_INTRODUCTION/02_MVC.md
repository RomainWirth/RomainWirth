# Le design pattern MVC

Le **MVC** (_Model-View-Controller_) est un **pattern d'architecture logicielle** qui divise une application en trois couches distinctes, chacune ayant une responsabilité unique. C'est l'un des patterns les plus répandus dans le développement web.

Laravel se base sur ce pattern, et toute son architecture en découle.

## Les trois couches

**1. Model**

La couche `Model` gère tout ce qui est lié aux **données** :

- Les requêtes vers la base de données (lecture, écriture, modification, suppression)
- Les règles métier liées aux données (validations, relations entre entités, etc.)
- La représentation d'une entité (ex. un `User`, un `Product`, etc.)

Dans Laravel, les Models s'appuient sur **Eloquent**, un ORM (_Object-Relational Mapper_) qui permet de manipuler les données de la base de données comme des objets PHP.

**2. View**

La couche `View` gère tout l'**affichage** : elle produit ce que l'utilisateur voit dans son navigateur (HTML, CSS, JavaScript).

Elle ne contient **aucune logique métier** : elle se contente d'afficher les données qu'on lui transmet.

Dans Laravel, les vues sont des fichiers **Blade** (`.blade.php`), le moteur de templates de Laravel, qui permet d'insérer des données dynamiques dans du HTML.

**3. Controller**

La couche `Controller` est le **chef d'orchestre** : elle fait le lien entre le Model et la View.

Son rôle :

1. Recevoir la requête HTTP de l'utilisateur (via le système de routing)
2. Appeler le ou les Models nécessaires pour récupérer ou manipuler les données
3. Passer ces données à la View appropriée
4. Retourner la réponse à l'utilisateur

## Une architecture en couches supplémentaires

Dans une application professionnelle, la couche Controller ne se limite pas aux seuls controllers. Laravel la découpe en plusieurs sous-éléments, chacun ayant sa propre responsabilité :

| Élément           | Rôle                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| **Controller**    | Orchestre la logique de la requête                                                                       |
| **Middleware**    | Intercepte la requête avant qu'elle atteigne le controller (ex : vérifier si l'utilisateur est connecté) |
| **Gate & Policy** | Gère les autorisations (ex : cet utilisateur a-t-il le droit de modifier cette ressource ?)              |
| **Service**       | Encapsule la logique métier complexe pour alléger le controller                                          |
| **Request**       | Gère la validation des données entrantes                                                                 |

Cette séparation respecte le principe de responsabilité unique (Single Responsibility Principle, l'un des principes SOLID) : chaque classe ne fait qu'une seule chose, et la fait bien.

## Pourquoi le MVC ?

| Avantage                           | Explication                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Séparation des responsabilités** | Chaque couche a un rôle précis, ce qui rend le code plus clair et maintenable                                     |
| **Travail en équipe**              | Un développeur front peut travailler sur les vues pendant qu'un autre travaille sur les models, sans interférence |
| **Testabilité**                    | On peut tester chaque couche indépendamment                                                                       |
| **Réutilisabilité**                | Un model peut être utilisé par plusieurs controllers, une vue par plusieurs actions                               |

## Résumé

- Le **MVC** divise l'application en trois couches : **Model** (données), **View** (affichage), **Controller** (logique).
- Le **Controller** reçoit la requête, interroge le **Model**, puis passe les données à la **View**.
- Laravel étend ce pattern avec des sous-éléments dans la couche Controller : Middlewares, Gates & Policies, Services, etc.
- Cette architecture garantit un code **lisible**, **maintenable** et **testable**.
