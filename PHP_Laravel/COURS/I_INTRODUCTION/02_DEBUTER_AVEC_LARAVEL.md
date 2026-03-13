# DÉBUTER AVEC LARAVEL

## Le design pattern MVC

Le **MVC** (_Model-View-Controller_) est un **pattern d'architecture logicielle** qui divise une application en trois couches distinctes, chacune ayant une responsabilité unique. C'est l'un des patterns les plus répandus dans le développement web.

Laravel se base sur ce pattern, et toute son architecture en découle.

### Les trois couches

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

### Une architecture en couches supplémentaires

Dans une application professionnelle, la couche Controller ne se limite pas aux seuls controllers. Laravel la découpe en plusieurs sous-éléments, chacun ayant sa propre responsabilité :

| Élément           | Rôle                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| **Controller**    | Orchestre la logique de la requête                                                                       |
| **Middleware**    | Intercepte la requête avant qu'elle atteigne le controller (ex : vérifier si l'utilisateur est connecté) |
| **Gate & Policy** | Gère les autorisations (ex : cet utilisateur a-t-il le droit de modifier cette ressource ?)              |
| **Service**       | Encapsule la logique métier complexe pour alléger le controller                                          |
| **Request**       | Gère la validation des données entrantes                                                                 |

Cette séparation respecte le principe de responsabilité unique (Single Responsibility Principle, l'un des principes SOLID) : chaque classe ne fait qu'une seule chose, et la fait bien.

### Pourquoi le MVC ?

| Avantage                           | Explication                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Séparation des responsabilités** | Chaque couche a un rôle précis, ce qui rend le code plus clair et maintenable                                     |
| **Travail en équipe**              | Un développeur front peut travailler sur les vues pendant qu'un autre travaille sur les models, sans interférence |
| **Testabilité**                    | On peut tester chaque couche indépendamment                                                                       |
| **Réutilisabilité**                | Un model peut être utilisé par plusieurs controllers, une vue par plusieurs actions                               |

### Résumé

- Le **MVC** divise l'application en trois couches : **Model** (données), **View** (affichage), **Controller** (logique).
- Le **Controller** reçoit la requête, interroge le **Model**, puis passe les données à la **View**.
- Laravel étend ce pattern avec des sous-éléments dans la couche Controller : Middlewares, Gates & Policies, Services, etc.
- Cette architecture garantit un code **lisible**, **maintenable** et **testable**.

## Les [controllers](https://laravel.com/docs/12.x/controllers)

Le controller est en POO (Programmation Orientée Objet), tout comme l'ensemble du framework Laravel.

C'est la pièce centrale du pattern MVC : il reçoit une requête HTTP, coordonne les appels aux modèles (données) et renvoie une réponse (vue, JSON, redirection, etc.).

Chaque méthode reçoit en paramètre un objet `Request` qui détient de nombreuses informations : la route actuelle, les paramètres de la requête, les données du formulaire, l'utilisateur connecté, les headers, etc.

Les méthodes de controllers effectuent la plupart des actions suivantes :

- Retourner une vue avec des données pour celle-ci
- Retourner du JSON (pour une API REST par exemple)
- Générer un document PDF et le renvoyer
- Rediriger vers une autre route
- etc.

Dans le cadre d'une application orientée 'web', on fera appel à une URL qui appellera la méthode d'un controller (système de routing).

### Créer un controller

Pour créer un controller, on va faire appel à la commande :

```bash
php artisan make:controller UserController
```

Artisan s'occupera de créer le fichier, de l'installer au bon endroit et d'ajouter tout ce qui est nécessaire de base.

Il est possible de le faire manuellement, mais Artisan permet un gain de temps considérable et évite les erreurs de structure.

Exemple de controller :

```PHP
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
 /**
  * Show the profile for a given user.
  */
  public function show(string $id): View
  {
   return view('user.profile', [
    'user' => User::findOrFail($id)
   ]);
  }
}
```

- Laravel va mettre le fichier dans le dossier `Controllers` situé sous le chemin `App\Http\Controllers` pour respecter les conventions PSR de PHP.
- La `class UserController` étend la classe de base `Controller`.
- Elle contient une méthode `show()` qui reçoit en paramètre un `$id` et retourne une `View`.
- La vue sera un fichier contenant du HTML/CSS/JS, à laquelle on passe un tableau de données.

> PSR — PHP Standards Recommendations
> Les PSR sont des recommandations de standardisation publiées par le PHP-FIG (PHP Framework Interoperability Group), un groupe réunissant les principaux acteurs de l'écosystème PHP (Laravel, Symfony, Laminas, etc.).
>
> Elles définissent des conventions communes pour garantir l'interopérabilité entre projets et frameworks. Les principales PSR sont :
>
> | PSR    | Sujet                                               |
> | ------ | --------------------------------------------------- |
> | PSR-1  | Règles de base du style de code                     |
> | PSR-2  | Guide de style de code (remplacé par PSR-12)        |
> | PSR-4  | Autoloading — convention de nommage des namespaces  |
> | PSR-7  | Interface pour les messages HTTP (Request/Response) |
> | PSR-12 | Style de code étendu (successeur de PSR-2)          |
>
> Laravel respecte notamment PSR-4 : le namespace d'une classe doit correspondre à son chemin dans le système de fichiers. C'est pourquoi App\Http\Controllers\UserController correspond au fichier app/Http/Controllers/UserController.php.
>
> Respecter les PSR garantit un code lisible, maintenable et compatible avec l'ensemble de l'écosystème PHP.

### Conventions

Par exemple, dans une application, on souhaite gérer 2 pages :

1. Une page qui va afficher toute une liste de produits
2. Une page qui va afficher un produit spécifique

On aurait donc un controller `ProductsController` qui aurait 2 méthodes :

1. `all()`, `getAll()`, `list()`, `items()`... pour afficher tous les produits
2. `get($id)`, `getProduct($id)`, `product($id)`, `show($id)`... pour afficher un seul produit

Ces noms de méthodes sont ok et cohérents. Mais comme ils sont récurrents (CRUD), Laravel propose une convention de nommage :

1. `index()` pour afficher tous les produits
2. `show($id)` pour afficher un seul produit

> CRUD — Create, Read, Update, Delete
> Le CRUD regroupe les quatre opérations fondamentales de la persistance des données :
>
> | Opération | SQL      | HTTP        | Description                   |
> | --------- | -------- | ----------- | ----------------------------- |
> | Create    | `INSERT` | `POST`      | Créer une nouvelle ressource  |
> | Read      | `SELECT` | `GET`       | Lire / afficher une ressource |
> | Update    | `UPDATE` | `PUT/PATCH` | Modifier une ressource        |
> | Delete    | `DELETE` | `DELETE`    | Supprimer une ressource       |
>
> La quasi-totalité des applications web repose sur ces quatre opérations. C'est pourquoi Laravel fournit des outils pour les automatiser (resource controller, routes resource, etc.).

Il n'est pas obligatoire de suivre cette convention mais elle est fortement recommandée :

1. Comme toute convention, cela permet d'industrialiser le code pour standardiser et rendre le code commun à tous les développeurs de ce projet (et du framework plus largement).
2. Au delà d'unifier le code entre développeurs, cette convention a été réfléchie par des gens compétents, ce qui implique qu'elle est bonne et logique.
3. Laravel 'fait de la magie' si on respecte ces conventions.

Le troisième point est important puisque c'est ce qui fait la force de Laravel.  
Cela permet de gagner beaucoup de temps et de lignes de codes en générant des éléments et fonctionnalités automatiquement.

Si on veut gérer le CRUD d'un produit (ressource), il faudrait les routes suivantes (au nombre de 7 en général) et les méthodes du controller associées :

| Action                                              | Méthode   |
| --------------------------------------------------- | --------- |
| Afficher tous les produits                          | `index`   |
| Afficher un produit                                 | `show`    |
| Afficher le formulaire de création                  | `create`  |
| Traiter la soumission du formulaire de création     | `store`   |
| Afficher le formulaire de modification              | `edit`    |
| Traiter la soumission du formulaire de modification | `update`  |
| Supprimer un produit                                | `destroy` |

```bash
php arsitan make:controller PhotoController --resource
```

En ajoutant `--resource`, Laravel crée automatiquement le controller avec les 7 méthodes pré-remplies et les bons paramètres. C'est un moyen d'automatiser le CRUD, une étape très répétitive.

Voici les correspondances complètes entre les routes et les méthodes du controller :

| Verb HTTP | URI                  | Action  | Route Name     |
| --------- | -------------------- | ------- | -------------- |
| GET       | /photos              | index   | photos.index   |
| GET       | /photos/create       | create  | photos.create  |
| POST      | /photos              | store   | photos.store   |
| GET       | /photos/{photo}      | show    | photos.show    |
| GET       | /photos/{photo}/edit | edit    | photos.edit    |
| PUT/PATCH | /photos/{photo}      | update  | photos.update  |
| DELETE    | /photos/{photo}      | destroy | photos.destroy |

Pour déclarer toutes ces routes en une seule ligne :

```PHP
Route::resource('photos', PhotoController::class)
```

### Injection de dépendance

L'injection de dépendance est un principe de conception qui consiste à **fournir** à une classe les objets dont elle a besoin, plutôt que de la laisser les instancier elle-même.  
Laravel gère cela automatiquement via son **conteneur d'injection de dépendances** (IoC container).

**Injection dans le constructeur :**

```PHP
<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;

class UserController extends Controller
{
 /**
  * Create a new controller instance
  */
  public function __construct(
   protected UserRepository $users,
  ) {}
}
```

Laravel détecte le type attendu (`UserRepository`) et l'injecte automatiquement à l'instanciation du controller.

**Injection dans une méthode — avec `Request` :**

Chaque méthode peut recevoir en premier paramètre une instance de `Request`, l'objet central qui encapsule toutes les informations de la requête HTTP entrante (données POST, paramètres GET, fichiers, headers, session, utilisateur connecté, etc.).

```PHP
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
 /**
  * Store a new user.
  */
  public function store(Request $request): RedirectResponse
  {
   $name = $request->name;

   // Store the user...

   return redirect('/users');
  }
}
>
```

**Injection combinée — `Request` + paramètre de route :**

```PHP
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;

class UserController extends Controller
{
 /**
  * Update the given user.
  */
  public function update(Request $request, string $id): RedirectResponse
  {
   // Update the user...

   return redirect('/users');
  }
}
>
```

La méthode `update()` reçoit à la fois la requête et l'`$id` issu de la route (`/users/{id}`).  
Laravel résout automatiquement l'ordre des paramètres : `Request` est injecté avant les paramètres de route.

### Résumé

- Laravel respecte le pattern **MVC**. La couche Controller centralise la logique applicative.
- Un controller est une **classe PHP** dont chaque méthode correspond à une action déclenchée par une route.
- Ces méthodes peuvent retourner une **vue**, du **JSON**, une **redirection**, un **fichier**, etc.
- Laravel recommande une **convention de nommage CRUD** : `index`, `show`, `create`, `store`, `edit`, `update`, `destroy`.
- La commande `php artisan make:controller --resource` génère automatiquement ces 7 méthodes.
- L'objet `Request` est `automatiquement injecté` dans toutes les méthodes qui le déclarent en paramètre.
- Le `conteneur IoC` de Laravel gère l'`injection de dépendances` de manière transparente.
- Laravel respecte les conventions **PSR** (notamment PSR-4 pour l'autoloading des namespaces).

## Le [Routing](https://laravel.com/docs/12.x/routing)

Le système de routing est le **point d'entrée** de toute application Laravel.  
Son rôle est d'associer une URL à une action : appeler la bonne méthode du bon controller en fonction de l'URL et du verbe HTTP utilisés.

Les fichiers de routes se trouvent dans le dossier `/routes` :

| Fichier       | Usage                                                   |
| ------------- | ------------------------------------------------------- |
| `web.php`     | Routes pour les pages web (avec session, CSRF, cookies) |
| `api.php`     | Routes pour les API REST (sans état, token-based)       |
| `console.php` | Routes pour les commandes Artisan                       |

Dans la grande majorité des cas, on travaillera dans `web.php`.

### Le fonctionnement

Pour chaque route, il faut définir :

1. **Le verbe HTTP** (GET, POST, PUT, PATCH, DELETE)
2. **Une URI** (ex: `/products`, `/contact`, `/mon-compte`)
3. **Une action** (controller + méthode, ou fonction anonyme)

> #### Les verbes HTTP
>
> | Verbe    | Usage courant                                  |
> | -------- | ---------------------------------------------- |
> | `GET`    | Lire / afficher une ressource                  |
> | `POST`   | Créer une nouvelle ressource                   |
> | `PUT`    | Remplacer entièrement une ressource existante  |
> | `PATCH`  | Modifier partiellement une ressource existante |
> | `DELETE` | Supprimer une ressource                        |
>
> `GET` et `POST` sont les verbes utilisés nativement par les formulaires HTML.  
> `PUT`, `PATCH` et `DELETE` nécessitent en général une requête JavaScript (fetch/axios) ou un champ caché `@method` dans Blade pour être simulés via un formulaire HTML.

Avec Laravel, on utilise la façade `Illuminate\Support\Facades\Route` pour déclarer les routes.  
On appelle une méthode correspondant au verbe HTTP, en passant l'URI en premier argument et l'action en second :

**Avec une fonction anonyme** (pratique pour les tests ou les routes simples) :

```PHP
use Illuminate\Support\Facades\Route;

Route::get('/greetings', function () {
    return 'Hello World';
});
```

**Avec un controller** (recommandé en production) :

```PHP
use Illuminate\Support\Facades\Route;

Route::get('/user', [UserController::class, 'index']);
```

Les injections de dépendances fonctionnent aussi comme pour les méthodes des controllers :

```PHP
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/user', [UserController::class, 'index']);
```

Les injections de dépendances fonctionnent également dans les fonctions anonymes, comme dans les méthodes de controllers :

```PHP
use Illuminate\Http\Request;

Route::get('/users', function (Request $request) {
 // $request contient toutes les infos de la requête
});
```

### Les paramètres

Une route a souvent besoin de recevoir des paramètres, comme l'ID d'une ressource.  
On indique qu'une partie de l'URI est dynamique en l'entourant d'accolades `{}`.  
Le paramètre sera automatiquement injecté dans la signature du controller ou de la fonction anonyme :

```PHP
Route::get('/user/{id}', function (string $id): string {
 return 'User ' . $id;
});
```

Il est possible de définir plusieurs paramètres. Ils sont injectés **dans l'ordre de leur déclaration dans l'URI** :

```PHP
Route::get('/posts/{post}/comments/{comment}', function (string $postId, string $commentId): void {
 // ...
});
```

> Le nom du paramètre dans l'URI ({post}) peut différer du nom de la variable dans la signature ($postId).  
> Ce qui compte, c'est l'ordre, pas le nom.

### Paramètres optionnels

On peut rendre un paramètre optionnel en ajoutant `?` après son nom dans l'URI.  
La variable correspondante dans la signature doit alors avoir une valeur par défaut :

```PHP
Route::get('/user/{name?}', function (?string $name = null) {
 return $name ?? 'Anonyme';
});
```

Les URLs suivantes seront toutes acceptées :

- `/user/thibault`
- `/user`
- `/user/`

### Contraintes de paramètres (REGEX)

Prenons l'exemple où on aurait besoin de deux routes similaires :

- `/user/{id}` => pour récupérer un user par son id (nombre)
- `/user/{name}` => pour récupérer un user par son nom (chaîne de caractères)

Le nom du paramètre (`id`, `name`) n'a aucune valeur pour le router : il voit uniquement un segment dynamique dans l'URI. Il faut donc différencier les deux par leur format via une expression régulière, avec la méthode `where()` :

```PHP
Route::get('/user/{name}', function (string $name) {
 // ...
})->where('name', '[A-Za-z]+');
Route::get('/user/{id}', function (string $id) {
 // ...
})->where('id', '[0-9]+');
```

> **URI**
> URI (Uniform Resource Identifier) est l'identifiant d'une ressource.  
> Dans le contexte du routing web, l'URI correspond au chemin de l'URL, sans le domaine.  
> Exemple : pour https://monsite.com/user/42, l'URI est /user/42.  
> À ne pas confondre avec URL (Uniform Resource Locator) qui inclut le protocole, le domaine et le chemin.

### L'alias de contraintes REGEX

Laravel propose des méthodes raccourcies pour les contraintes les plus courantes, ce qui rend le code plus lisible qu'une regex brute :

```PHP
Route::get('/user/{id}/{name}', function (string $id, string $name) {
 // ...
})->whereNumber('id')->whereAlpha('name');

Route::get('/user/{pseudo}', function (string $pseudo) {
 // ...
})->whereAlphaNumeric('pseudo');

Route::get('/user/{uuid}', function (string $uuid) {
 // ...
})->whereUuid('uuid');

Route::get('/category/{category}', function (string $category) {
 // ...
})->whereIn('category', ['movie', 'song', 'painting']);

Route::get('/category/{category}', function (string $category) {
 // ...
})->whereIn('category', CategoryEnum::cases());
```

### Global Constraint

Lorsqu'un paramètre comme `{id}` est présent sur de nombreuses routes avec la même contrainte, il serait fastidieux de répéter `whereNumber('id')` partout.  
Laravel permet de définir des contraintes globales dans `App\Providers\AppServiceProvider`, via la méthode `Route::pattern()` :

```PHP
use Illuminate\Support\Facades\Routes

public function boot(): void
{
 Route::pattern('id', '[0-9]+');
}
```

Toutes les routes ayant un paramètre `{id}` respecteront automatiquement cette contrainte, sans avoir à la redéclarer :

```PHP
Route::get('/user/{id}', function (string $id) {
 // Only executed if {id} is numeric...
})
```

### Routes nommées

Nommer ses routes est une **bonne pratique essentielle**.

Pourquoi ? Imaginons une route `/contact` utilisée à plusieurs endroits dans le code (menu, footer, CTA, etc.).  
Si on écrit l'URL en dur (`href="/contact"`), et qu'on décide plus tard de la renommer en `/contactez-nous` suite à un audit SEO, il faudra modifier chaque occurrence dans le code — source d'erreurs et très fastidieux.

Avec des routes nommées, **on référence la route par sa clé**, pas par son URL. Si l'URL change, il suffit de la modifier à un seul endroit : la déclaration de la route.

**Déclarer un nom :**

```PHP
Route::get('/user/profile', function () {
 // ...
})->name('profile');
```

**Utiliser le nom pour générer une URL ou une redirection :**

```PHP
// Générer une URL
$url = route('profile');                        // "/user/profile"

// Rediriger vers une route nommée
return redirect()->route('profile');
return to_route('profile');                     // syntaxe raccourcie
```

**Avec des paramètres :**

```PHP
Route::get('/user/{id}/profile', function (string $id) {
    // ...
})->name('profile');

$url = route('profile', ['id' => 1]);           // "/user/1/profile"
```

> Convention de nommage : les noms de routes suivent généralement la convention ressource.action, par exemple users.index, users.show, users.edit. Cela correspond directement aux noms générés par Route::resource().

### Routes groupées

On retrouve souvent dans une application des groupes de routes qui partagent des caractéristiques communes :

- Un même **préfixe d'URI** (ex: toutes les pages admin commencent par `/admin`)
- Un même **middleware** (ex: toutes les pages de l'espace connecté nécessitent d'être authentifié)
- Un même **préfixe de nom** (ex: `admin.users`, `admin.products`, etc.)
- Un même **controller**

Au lieu de répéter ces informations sur chaque route, Laravel permet de les factoriser via la méthode `group()`, combinée à d'autres méthodes :

**Grouper par controller :**

```PHP
Route::controller(OrderController::class)->group(function () {
 Route::get('orders/{id}', 'show');
 Route::get('orders', 'store');
});
```

**Grouper par préfixe d'URI :**

```PHP
Route::prefix('admin')->group(function () {
 Route::get('/users', function () {
  // Matches the "/admin/users" URL
 });
});
```

**Grouper par préfixe de nom :**

```PHP
Route::prefix('admin.')->group(function () {
 Route::get('/users', function () {
  // Route assigned name "admin.users"...
 })->name('users');
});
```

**Grouper par middleware :**

```PHP
Route::middleware(['first', 'second'])->group(function () {
 Route::get('/', function () {
  // Uses first and second middleware...
 });

 Route::get('/user/profile', function () {
  // Uses first and second middleware...
 });
});
```

**Grouper par sous-domaine :**

```PHP
Route::domain('{account}.example.com')->group(function () {
 Route::get('/user/{id}', function (string $account, string $id) {
  // ...
 });
});
```

Ces méthodes sont **cumulables** :

```PHP
Route::prefix('admin')
 ->name('admin.')
 ->middleware(['auth', 'isAdmin'])
 ->group(function () {
  Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
  Route::get('/products', [AdminProductController::class, 'index'])->name('products.index');
 });
```

### Résumé

- Le routing associe une **URI + verbe HTTP** à une **action** (controller + méthode, ou fonction anonyme).
- Les fichiers de routes sont dans `/routes` : principalement `web.php` (pages) et `api.php` (API).
- Les paramètres dynamiques sont déclarés avec `{param}` et injectés automatiquement.
- Les paramètres peuvent être **optionnels** (`{param?}`) ou **contraints** par regex (`where()` ou ses alias).
- Les **contraintes globales** (`Route::pattern()`) évitent de répéter les mêmes contraintes sur chaque route.
- Les **routes nommées** (`name()`) permettent de référencer une route par une clé plutôt que par son URL.
- Les **groupes de routes** (`group()`) factorisent les préfixes d'URI, de noms, les middlewares et les controllers communs.

## Views

### Blade templates

### Blade Components

### Helper

## URL Generation

## Collection

## Résumé
