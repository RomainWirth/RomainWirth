# Résumé

Ce cours couvre les fondamentaux pour débuter avec Laravel, en suivant le cheminement naturel d'une requête HTTP à travers l'application.

## Architecture générale

Laravel suit le **design pattern MVC** (Modèle - Vue - Contrôleur) :

- Le **Modèle** gère les données et leur logique (Eloquent).
- La **Vue** affiche les données (templates Blade - aucune logique métier).
- Le **Contrôleur** reçoit les requêtes, orchestre les traitements et retourne une réponse.

Le cycle d'une requête : `Routing → Controller → (Model) → View → Réponse HTTP`.

## Récapitulatif par section

| Sujet           | L'essentiel à retenir                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **MVC**         | Séparation des responsabilités : données (Model), logique (Controller), présentation (View)                                |
| **Controllers** | Classes PHP dans `app/Http/Controllers/`. Créés avec `php artisan make:controller`. Méthodes CRUD conventionnelles (`index`, `show`, `store`, `update`, `destroy`) |
| **Routing**     | Déclaré dans `routes/web.php` (pages) ou `routes/api.php` (API). Routes nommées (`->name()`), groupées (`prefix`, `middleware`, `name`), paramétrisées (`{id}`) |
| **Views**       | Fichiers `.blade.php` dans `resources/views/`. Données passées via `view('nom', compact('var'))` ou `->with()`. Partage global : `View::share()` |
| **Blade templates** | Moteur de template : `{{ $var }}` (échappé), `{!! $var !!}` (brut). Héritage : `@extends` / `@yield` / `@section`. Directives : `@if`, `@foreach`, `@auth`, `@can`, `@include`, `@push` / `@stack` |
| **Blade Components** | Composants réutilisables (classe PHP + vue Blade). `php artisan make:component`. Balise `<x-nom-composant>`. Slots (`$slot`, slots nommés), `$attributes->merge()` |
| **Helpers**     | Fonctions globales (`dd()`, `now()`, `collect()`, `config()`, `request()`, `redirect()`, `route()`, etc.) et classes utilitaires (`Str::`, `Arr::`) disponibles partout dans l'app |
| **URL Generation** | `url()` (URL absolue), `asset()` (fichier `public/`), `route()` (route nommée), `action()` (controller). URLs signées (`URL::signedRoute`) et temporaires (`URL::temporarySignedRoute`). Manipulation orientée objet avec `Uri::` |
| **Collections** | Enveloppe objet autour des tableaux : `collect($array)`. Plus de 150 méthodes chaînables (`map`, `filter`, `pluck`, `sortBy`, `groupBy`, etc.). Retournées nativement par Eloquent. `LazyCollection` pour les grands jeux de données |

## Commandes Artisan essentielles

```bash
php artisan make:controller NomController     # Créer un controller
php artisan make:controller NomController -r  # Controller avec méthodes CRUD

php artisan make:view nom                     # Créer une vue Blade
php artisan make:component NomComponent       # Créer un composant Blade

php artisan route:list                        # Lister toutes les routes
php artisan view:cache                        # Compiler les vues en cache
php artisan view:clear                        # Vider le cache des vues
```

## Flux d'une page typique

```
Requête HTTP GET /users
        ↓
routes/web.php → Route::get('/users', [UserController::class, 'index'])
        ↓
UserController@index → $users = User::all()  (Eloquent → BDD)
        ↓
return view('users.index', compact('users'))
        ↓
resources/views/users/index.blade.php → HTML rendu
        ↓
Réponse HTTP 200
```

> Ce cours est une introduction. Laravel couvre bien d'autres thèmes : **Eloquent ORM** (modèles, relations, migrations), **Middleware** (filtrage des requêtes), **Authentication** (Breeze, Sanctum, Passport), **Validation**, **Events & Listeners**, **Queues**, **Notifications**, **API Resources**, etc.

