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

> PSR - PHP Standards Recommendations
> Les PSR sont des recommandations de standardisation publiées par le PHP-FIG (PHP Framework Interoperability Group), un groupe réunissant les principaux acteurs de l'écosystème PHP (Laravel, Symfony, Laminas, etc.).
>
> Elles définissent des conventions communes pour garantir l'interopérabilité entre projets et frameworks. Les principales PSR sont :
>
> | PSR    | Sujet                                               |
> | ------ | --------------------------------------------------- |
> | PSR-1  | Règles de base du style de code                     |
> | PSR-2  | Guide de style de code (remplacé par PSR-12)        |
> | PSR-4  | Autoloading - convention de nommage des namespaces  |
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

> CRUD - Create, Read, Update, Delete
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

**Injection dans une méthode - avec `Request` :**

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

**Injection combinée - `Request` + paramètre de route :**

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
Si on écrit l'URL en dur (`href="/contact"`), et qu'on décide plus tard de la renommer en `/contactez-nous` suite à un audit SEO, il faudra modifier chaque occurrence dans le code - source d'erreurs et très fastidieux.

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

## [Views](https://laravel.com/docs/12.x/views)

Les Views sont la troisième couche du modèle MVC.
C'est ici qu'on retrouve tout le code HTML (et le CSS/JS associé) - et rien d'autre : **pas de logique métier**.
Ce sont les controllers qui préparent les données et retournent les vues avec ces données.

Laravel place les vues dans le dossier `/resources/views`.

### Créer une vue

Il est possible de créer des vues manuellement, mais Artisan le fait en une commande :

```bash
php artisan make:view greeting
```
Artisan crée le fichier /resources/views/greeting.blade.php.

> Les vues Laravel sont des fichiers .blade.php. Blade est le moteur de templates de Laravel (voir section dédiée).
> Il permet entre autres d'utiliser la syntaxe {{ $variable }} pour afficher des données, et des directives comme @if, @foreach, etc., intégrées directement dans du HTML.

### Afficher une vue

Pour retourner une vue depuis un controller (ou une route), on utilise la fonction helper view() ou la façade View :

**avec la fonction helper (la plusn courante) :**
```PHP
retuirn view('greeting');
```
**avec la façade :**
```PHP
use Illuminate\Support\Facades\View;

return View::make('greeting');
```
les deux approches sont strictement équivalentes.

### Passer des données à uune vue

Une vue a généralement besoin de données pour afficher du contenu dynamique.
Dans la vue Blade, chaque clé du tableau passé devient une variable PHP directement accessible :
```HTML
<!-- resources/views/greeting.blade.php -->
<html>
  <body>
    <h1>Hello, {{ $name }}</h1>
    <p>{{ $occupation }}</p>
  </body>
</html>
```
Il y a trois façons de transmettre ces données.
1. **Via un tableau en deuxième paramètre (le plus courant) :**
```PHP
return view('greeting', ['name' => 'James', 'occupation' => 'Astronaut']);
```
2. **Via la fonction `compact()` (pratique quand les variables existent déjà) :**
```PHP
$name = 'James';
$occupation = 'Astronaut';

return view('greeting', compact('name', 'occupation'));
// équivalent à ['name' => $name, 'occupation' => $occupation]
```
3. **Via des appels enchaînés à `with()` (utile pour des données conditionnelles) :**
```PHP
return view('greeting')
  ->with('name', 'Victoria')
  ->with('occupation', 'Astronaut');
```
`with()` accepte aussi directement un tableau :
```PHP
return view('greeting')->with(['name' => 'Victoria', 'occupation' => 'Astronaut']);
```
Le choix entre ces méthodes dépend du contexte et du style de code.
Par exemple, `with()` peut être utile si on stocke la vue dans une variable et qu'on ajoute les données conditionnellement plus loin dans le code.

### Vues dans des sous-dossiers
Pour organiser les vues, on peut les placer dans des sous-dossiers :
```
resources/views/
  admin/
    profile.blade.php
  user/
    profile.blade.php
```
On les référence avec la notation point . plutôt que `/` ou `\` (qui peut varier selon l'OS) :
```PHP
return view('admin.profile', $data);
return view('profile.profile', $data);
```

### Vérifier qu'une vuew existe

La façade `View` expose une méthode `exists()` :
```PHP
use Illuminate\Support\Facades\View;

if (View::exists('admin.profile')) {
  return view('admin.profile');
}
```

### Rendre la première vue disponible

Quand plusieurs vues peuvent convenir, on utilise View::first() pour afficher la première qui existe :
```PHP
use Illuminate\Support\Facades\View;

return View::first(['custom.admin', 'admin'], $data);
```
Laravel essaie les vues dans l'ordre et retourne la première disponible.
C'est pratique pour des systèmes de thèmes ou de personnalisation par client (multi-tenant).

### Partage de données à toutes les vues

Certaines données doivent être disponibles partout (ex. : le nom du site, la version de l'app, etc.).
Plutôt que de les passer à chaque `view()`, on les partage globalement via `View::share()` dans le `AppServiceProvider` :
```PHP
<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    View::share('appName', 'Mon Application');
  }
}
```
Toutes les vues auront automatiquement accès à la variable `$appName`.

### View Composers - partage ciblé

Les View Composers permettent de lier des données à des vues spécifiques, quel que soit le controller qui les appelle.
C'est utile quand une vue a toujours besoin d'une même donnée calculée (un compteur, une liste de catégories, etc.).

On les enregistre dans le `AppServiceProvider` via `View::composer()` :
**Avec une closure :**
```PHP
use Illuminate\Support\Facades\View;
use Illuminate\View\View as ViewInstance;

class AppServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    View::composer('profile', function (ViewInstance $view) {
      $view->with('count', 42);
    });
  }
}
```
**Avec une classe dédiée (recommandé pour les cas complexes) :**
```PHP
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
  public function boot(): void
  {
    View::composer('profile', ProfileComposer::class);
  }
}
```
La classe Composer doit implémenter une méthode `compose()` :
```PHP
<?php

namespace App\View\Composers;

use App\Repositories\UserRepository;
use Illuminate\View\View;

class ProfileComposer
{
  public function __construct(
    protected UserRepository $users,
  ) {}

  public function compose(View $view): void
  {
    $view->with('count', $this->users->count());
  }
}
```
> Laravel résout automatiquement les dépendances du constructeur via le conteneur IoC - pas besoin de les instancier manuellement.

**Cibler plusieurs vues ou toutes les vues :**
```PHP
// Plusieurs vues spécifiques
View::composer(['profile', 'dashboard'], MultiComposer::class);

// Toutes les vues
View::composer('*', function (View $view) {
  // ...
});
```
### Optimisation - cache des vues

Par défaut, les vues Blade sont compilées à la demande (au premier accès) puis mises en cache.
En production, on peut forcer la compilation de toutes les vues à l'avance pour éviter le coût de compilation lors des requêtes :
```bash
php artisan view:cache    # Compile toutes les vues Blade
php artisan view:clear    # Vide le cache des vues compilées
```

### Résumé

| Concept                  | Outil                                                |
| ------------------------ | ---------------------------------------------------- |
| Créer une vue            | `php artisan make:view greeting`                     |
| Retourner une vue        | `return view('greeting', ['key' => 'value']);`       |
| Vue dans un sous-dossier |	`return view('admin.profile');`                     |
| Données avec compact     |	`return view('greeting', compact('name'));`         |
| Données conditionnelles	 | `view('greeting')->with('key', 'value');`            |
| Données globales         |	`View::share('key', 'value');`                      |
| Première vue disponible  |	`View::first(['custom.vue', 'default.vue']);`       |
| Données ciblées	         | `View::composer('profile', ProfileComposer::class);` |
| Cache                    |	`php artisan view:cache / php artisan view:clear`   |

## Blade templates

Blade est le moteur de template de Laravel.

### Moteur de template ?

Un moteur de template est une surcouche afin de générer de l'html avec du code dynamique plus facilement et plus proprement.

Pour render des datas, on peut utiliser cette méthode en php pur :
```PHP
<div>
    <?php
    foreach ($products as $product) {
      echo "<div>";
        echo $product["name"];
        echo " - ";
        echo $product["price"] . " €";
      echo "</div>";
    }
    ?>
</div>
```
Même si on peut rendre ce code plus élégant avec des `${}` et autre, cela reste brouillon et pas très beau : `<?php ?>` en plein milieu du code.

Avec `blade`, il est possible de faire cela :
```PHP
@foreach ($users as $user)
  <p>This is user {{ $user->id }}</p>
@endforeach
```
### Comment cela fonctionne ?

Si le fichier est en `blade.php`, on peut utiliser le moteur directement.
Laravel passe ensuite derrière pour compiler le fichier en PHP 'normal'.

`{{ $name }}` seront transformés en `<?= $name; ?>` classique.

La syntaxe de blade est plus propre et lisible que la syntaxe classique de php.

Laravel propose également d'autres directives très pratiques.
Contrairement à d'autre moteurs de template connus d'autres frameworks, Laravel est permissif et permet de faire du PHP pur dans un fichier `blade.php`. Ce qui peut être très pratique.

### Afficher une donnée en blade

Pour afficher une donnée ou le contenu d'une fonction, il suffit de l'entourer de 'moustaches' : `{{ }}`.
```PHP
// pour une variable
{{ $name }}

// pour une fonction
{{ time()}}
```

Les variables sont automatiquement échappées avec `htmlspecialchars` pour protéger des attaques XSS.
Si on veut éviter cette protection, on peut utilise {!! !!}
```PHP
// pour une variable
{!! $name !!}

// pour une fonction
{{ time()}}
```

### Conflts avec un framework JavaScript

Comment faire si on utilise aussi un framework JS tel que `Vue.js` ?
Vue.js utilise aussi les moustaches, ce qui peut engendrer des conflits.

Laravel propose d'utiliser `@{{ }}` quand on veut utiliser un framework JS :
```
Hello, @{{ name }}
```
Laravel comprends que "name" n'est pas à interprêter comme du PHP.
Laravel compile le fichier blade.php en .php, @{{ }} sera transformé en {{ }} pour que le framework JS qui arrive juste après puisse prendre en compte la variable.

Pour les blocs entiers contenant de nombreuses moustaches JS, il est plus pratique d'utiliser `@verbatim / @endverbatim` plutôt que de préfixer chaque `{{ }}` :
```PHP
@verbatim
    <div id="app">
        <h1>{{ title }}</h1>
        <p>{{ message }}</p>
        <ul>
            <li v-for="item in items">{{ item.name }}</li>
        </ul>
    </div>
@endverbatim
```
Tout le bloc est transmis tel quel au navigateur, sans aucune interprétation de la part de Blade.

### Héritage de templates

L'une des fonctionnalités les plus puissantes de Blade est l'**héritage de templates**.
Elle permet de définir un **layout** (mise en page commune) et des vues enfants qui l'étendent, évitant de dupliquer le code HTML structurel (head, navigation, footer) sur chaque page.

#### Créer un layout

Un layout est une vue Blade classique qui définit la structure HTML globale et des **zones dynamiques** avec `@yield` :

```PHP
<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mon App - @yield('title', 'Accueil')</title>
    @stack('styles')
</head>
<body>
    @include('partials.nav')

    <main>
        @yield('content')
    </main>

    @stack('scripts')
</body>
</html>
```

- `@yield('title', 'Accueil')` : définit un slot nommé `title`. Le deuxième argument est la valeur par défaut si aucune vue enfant ne remplit ce slot.
- `@yield('content')` : zone principale du contenu de la page.
- `@stack('scripts')` : zone d'injection de scripts (voir section **Stacks**).

#### Créer une vue enfant

Une vue enfant hérite du layout via `@extends`, puis remplit ses slots avec `@section` :

```PHP
<!-- resources/views/home.blade.php -->
@extends('layouts.app')

@section('title', 'Page d\'accueil')

@section('content')
    <h1>Bienvenue</h1>
    <p>Contenu de la page d'accueil.</p>
@endsection
```

- `@extends('layouts.app')` : indique que cette vue hérite du layout `layouts/app.blade.php`.
- `@section('title', 'Page d\'accueil')` : syntaxe courte pour les sections d'une seule ligne (sans `@endsection`).
- `@section('content') ... @endsection` : remplit la zone `content` définie dans le layout.

#### Conserver le contenu parent

Avec `@parent`, on peut **conserver** le contenu déjà défini dans le layout et y ajouter du contenu :

```PHP
<!-- layout : sidebar par défaut -->
@section('sidebar')
    <nav>Liens communs à toutes les pages</nav>
@endsection
```

```PHP
<!-- vue enfant : étend la sidebar -->
@section('sidebar')
    @parent
    <p>Liens supplémentaires spécifiques à cette page.</p>
@endsection
```

Le rendu final contiendra les deux blocs, celui du layout puis celui de la vue enfant.

### Blades directives

Lorsqu'on affiche des données, il faut parfois gérer des blocs de PHP pour faire des foreach, des switchs, des if/else...

Blade intervient avec ses directives :
* @if / @elseif / @endif
* @foreach / @endforeach
* @isset / @endisset
* @empty / @endempty
```PHP
@if (count($records) === 1)
  "I have one record!"
@elseif (count($records) > 1)
  "I have multiple records!"
@else
  "I don't have any records!"
@endif

@isset ($records)
  // $recors is defined and is not null
@endisset

@empty($records)
  // $recors is "empty"...
@endempty

@switch($i)
  @case(1)
    First case...
    @break

  @case(2)
    Second case...
    @break

  @default
    Default case...
@endswitch

@for($i = 0; $i < 10; $i++)
  The current value is {{ $i }}
@endfor

@foreach ($users as $user)
  <p>This is user {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
  <li>{{ $user->name }}</p>
@empty
  <p>No users</p>
@endforelse

@while (true)
  <p>I'm looping forever</p>
@endwhile
```

**Directives d'authentification :**

Ces directives affichent ou masquent des blocs selon l'état de connexion de l'utilisateur :

```PHP
@auth
    {{-- Affiché uniquement si l'utilisateur est connecté --}}
    <a href="/profil">Mon profil</a>
@endauth

@guest
    {{-- Affiché uniquement si l'utilisateur n'est pas connecté --}}
    <a href="/login">Se connecter</a>
@endguest

{{-- On peut cibler un guard spécifique --}}
@auth('admin')
    <a href="/admin">Espace admin</a>
@endauth
```

**Directives d'autorisation (liées aux Policies / Gates) :**

Ces directives conditionnent l'affichage selon les permissions de l'utilisateur connecté :

```PHP
@can('update', $post)
    <a href="/posts/{{ $post->id }}/edit">Modifier</a>
@endcan

@cannot('delete', $post)
    <p>Vous n'avez pas la permission de supprimer.</p>
@endcannot

{{-- Vrai si l'utilisateur peut faire au moins l'une des actions --}}
@canany(['update', 'delete'], $post)
    <div class="actions">...</div>
@endcanany
```

> Ces directives sont l'équivalent Blade de `Auth::check()`, `$user->can()`, etc. Elles rendent le code de vue très lisible sans PHP pur.

### Loop directives

Dans une boucle, on a parfois besoin de connaître l'index actuel, savoir s'il est pair ou impair, etc.

Pour éviter de faire du php pur avec des count et des modulo, blade génère une variable `$loop` dans chaque boucle.
Cette variable dispose de plusieurs méthodes :
| Property           |	Description                                            |
| ------------------ | ------------------------------------------------------- |
| `$loop->index`     |	The index of the current loop iteration (starts at 0). |
| `$loop->iteration` |	The current loop iteration (starts at 1).              |
| `$loop->remaining` |	The iterations remaining in the loop.                  |
| `$loop->count`     |	The total number of items in the array being iterated. |
| `$loop->first`     |	Whether this is the first iteration through the loop.  |
| `$loop->last`      |	Whether this is the last iteration through the loop.   |
| `$loop->even`      |	Whether this is an even iteration through the loop.    |
| `$loop->odd`       |	Whether this is an odd iteration through the loop.     |
| `$loop->depth`     |	The nesting level of the current loop.                 |
| `$loop->parent`    |	When in a nested loop, the parent's loop variable.     |

On pourra ainsi procéder comme ceci :
```PHP
@foreach ($users as $user)
  @foreach ($users->posts as $post)
    @if ($loop->parent->first)
      // This is the first iteration of the parent loop.
    @endif
  @endforeach
@endforeach
```

**Il est toujours possible d'améliorer la qualité d'écriture du code :**
Si on a besoin d'écrire un bloc PHP, il est préférable d'utiliser `@php / @endphp` plutôt que `<?php ?>` :
```PHP
@php
  $counter = 1;
@endphp
```

**Il est utile de pouvoir générer des classes selon des conditions :**
Blade propose d'utiliser la directive `@class` qui prend un tableau clé => valeur
* la clé est la classe (string) à afficher
* la valeur est la condition, si elle est true, la classe (clé) est injectée
```PHP
@php
  $isActive = false;
  $hasError = true;
@endphp

<span @class([
  'p-4',
  'font-bold' => $isActive,
  'text-gray-500' => ! $isActive,
  'bg-red' => $hasError,
])></span>

<span class="p-4 text-gray-500 bg-red"></span>
```

**Il est possible de faire la même chose avec `@style` :**
```PHP
@php
  $isActive = true;
@endphp

<span @style([
  'background-color: red',
  'font-weight: bold' => $isActive,
])></span>

<span style="background-color: red; font-weight: bold;"></span>
```

À noter que s'il n'y a pas de valeur, alors cela revient à "true" : `background-color: red` est toujours injecté et seulement `font-weight: bold` est conditionnel.

### Attributs additionnels

Sur les formulaires, il est souvent nécessaire de gérer des attributs comme `checked`, `selected`, `disabled`, `readonly` ou encore `required`.
Il y a des directives pour chacun d'entre eux :
```PHP
<input
  type="checkbox"
  name="active"
  value="active"
  @checked(old('active', $user->active))
/>

<select name="version">
  @foreach ($product->versions as $version)
    <option value="{{ $version }}" @selected(old('version') == $version)>
      {{ $version }}
    </option>
  @endforeach
</select>

<input
  type="email"
  name="email"
  value="email@laravel.com"
  @readonly($user->isNotAdmin())
/>

<button type="submit" @disabled($errors->isNotEmpty())>Submit</button>

<input
  type="text"
  name="title"
  value="title"
  @required($user->isAdmin())
/>
```

### Inclure des sous-vues

Prenons l'exemple d'un component `menu`. L'élément va se retrouver sur plusieurs pages et l'idéal est de ne pas réécrire à chaque fois le code.
On va plutôt écrire le code une seule fois dans un fichier puis le ré-utiliser (factorisation).
En php pur, on utilise la fonction `include()`.
Avec blade, on va utiliser la directive `@include` qui est le même principe qu'un `return view` :
* En premier paramètre on indique le chemin du fichier (préfixé automatiquement par _`resources/views`_)
* En deuxième paramètre on passe des données potentielles via un tableau
```PHP
<div>
  @include('shared.errors')
  <form>
      <!-- Form Contents -->
  </form>
</div>

@include('view.name', ['status' => 'complete'])
```
Il existes quelques variantes :
```PHP
@includeWhen($boolean, 'view.name', ['status' => 'complete'])

@includeUnless($boolean, 'view.name', ['status' => 'complete'])

@includeIf('view.name', ['status' => 'complete'])
```

### Stacks

Les stacks (`@push` / `@stack`) permettent d'injecter du contenu (CSS, scripts, etc.) dans des emplacements prédéfinis dans le layout, **depuis n'importe quelle vue enfant**.

C'est particulièrement utile pour charger des assets spécifiques à une seule page sans les inclure globalement.

**Le layout définit les emplacements avec `@stack` :**

```PHP
<!-- resources/views/layouts/app.blade.php -->
<head>
    @stack('styles')
</head>
<body>
    @yield('content')
    @stack('scripts')
</body>
```

**Les vues enfants y poussent leur contenu avec `@push` :**

```PHP
@push('styles')
    <link rel="stylesheet" href="/css/dashboard.css">
@endpush

@push('scripts')
    <script src="/js/chart.js"></script>
    <script src="/js/dashboard.js"></script>
@endpush
```

Pour insérer en **tête de stack** (au lieu de la fin), on utilise `@prepend` :

```PHP
@prepend('scripts')
    <script src="/js/must-load-first.js"></script>
@endprepend
```

> Plusieurs vues peuvent pousser dans le même stack : leur contenu est **cumulé** dans l'ordre des appels.

### Les formulaires

Les formulaires sont des cas classiques du développement frontend.
Blade intervient pour faciliter la tâche :
* Chaque formulaire doit avoir un jeton de sécurité CSRF (CSRF token) par défaut sur Laravel.\
  Pour le générer, il suffit d'utiliser `@csrf` dans un `form`. Cela va créer automatiquement un input de type text, de name `csrf` et dont la value sera le token.
```PHP
<form method="POST" action="/profile">
  @csrf

  ...
</form>
```

> **CSRF - Cross-Site Request Forgery**
>
> Le CSRF est une attaque qui consiste à faire exécuter à un utilisateur authentifié une requête à son insu, en l'attirant sur une page malveillante qui envoie silencieusement une requête vers l'application.
>
> **Exemple d'attaque :**
> Un utilisateur est connecté à sa banque. Il visite un site malveillant qui contient un formulaire caché pointant vers `banque.com/virement` avec des données préremplies. Son navigateur envoie automatiquement les cookies de session - la banque croit que la requête est légitime.
>
> **La protection par token :**
> Pour s'en prémunir, Laravel génère un **token CSRF** unique par session utilisateur. Ce token est inclus dans chaque formulaire via `@csrf`, et Laravel le vérifie à chaque requête `POST`, `PUT`, `PATCH` ou `DELETE`.
> Si le token est absent ou invalide, Laravel retourne une erreur `419 Page Expired`.
>
> Ce mécanisme garantit que la requête provient bien d'un formulaire de l'application et non d'un site tiers.

Les verbes `PUT`, `PATCH` et `DELETE` ne fonctionnent pas en HTML sous un `<form>` (en réalité c'est toujours un `POST`).
Si on veut simuler cela en Laravel parce que les routes les utilisent, il faut envoyer un `<input>` hidden qui a pour name `name="_method"` et pour valeur le verbe.\
Au lieu de faire cela manuellement, on peut utiliser la directive `@method('PUT')`, `@methode('DELETE')`, etc.

### Les formulaires - les erreurs

Un formulaire doit aussi inclure la gestion des erreurs.
Blade intervient avec la directive `@error('field-name') / @enderror`.

Ce bloc n'intervient que si on renvoie une erreur pour ce champ. À l'intérieur de ce bloc on a accès à la variable `$message` :
```PHP
@error('title')
  <div class="alert alert-danger">{{ $message }}</div>
@enderror
```
`@error('title')` : si on a une erreur générée sur le champs titre
`$message` : renvoit le message d'erreur dans une balise div générée pour l'occation.
```PHP
<input
    id="email"
    type="email"
    class="@error('email') is-invalid @else is-valid @enderror"
/>
```
`class="@error('email') is-invalid @else is-valid @enderror"`: si on a une erreur dans le champs `email`, une classe CSS sera alors appliquée au champs.

### Bonus

Il est possible de créer [ses propres directives](https://laravel.com/docs/12.x/blade#extending-blade).
Cela est très pratique quand on développe une librairie particulière :
```PHP
public function boot(): void
{
  Blade::directive('datetime', function (string $expression) {
    return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
  });
}
```
Cette directive sera appelée `@datetime`, et lorsqu'on l'appelle, la fonction anonyme sera appelée.

On peut également créer [ses propres conditions if](https://laravel.com/docs/12.x/blade#custom-if-statements) :
```PHP
Blade::if('disk', function (string $value) {
  return config('filesystems.default') === $value;
});
```
`@disk` sera un `@if` customisé :
```PHP
@disk('local')
  <!-- The application is using the local disk... -->
@elsedisk('s3')
  <!-- The application is using the s3 disk... -->
@else
  <!-- The application is using some other disk... -->
@enddisk

@unlessdisk('local')
  <!-- The application is not using the local disk... -->
@enddisk
```

### Résumé

Au lieu de faire du PHP pur dans les vues, il est préférable d'utiliser les directives Blade.
Les fichiers doivent finir par `.blade.php` et sont compilés à la volée (ou en cache) en fichiers `.php` par le serveur.

| Fonctionnalité                    | Syntaxe                                              |
| --------------------------------- | ---------------------------------------------------- |
| Afficher une variable             | `{{ $variable }}`                                    |
| HTML non-échappé (⚠ XSS)         | `{!! $variable !!}`                                  |
| Héritage d'un layout              | `@extends('layouts.app')`                            |
| Définir une zone dans le layout   | `@yield('content')`                                  |
| Remplir une zone                  | `@section('content') ... @endsection`                |
| Section courte (mono-ligne)       | `@section('title', 'Ma page')`                       |
| Conserver le contenu parent       | `@parent`                                            |
| Conditionnel                      | `@if / @elseif / @else / @endif`                     |
| Valeur définie / null             | `@isset / @empty`                                    |
| Switch                            | `@switch / @case / @default / @endswitch`            |
| Boucle `for`                      | `@for / @endfor`                                     |
| Boucle `foreach`                  | `@foreach / @endforeach`                             |
| Boucle avec fallback vide         | `@forelse / @empty / @endforelse`                    |
| Boucle `while`                    | `@while / @endwhile`                                 |
| Variable de boucle                | `$loop->index`, `$loop->first`, `$loop->last`, etc.  |
| Authentification                  | `@auth / @guest`                                     |
| Autorisations                     | `@can / @cannot / @canany`                           |
| Inclure une vue                   | `@include('partial', ['key' => 'val'])`              |
| Inclusion conditionnelle          | `@includeWhen / @includeUnless / @includeIf`         |
| Stacks (assets ciblés)            | `@push / @stack / @prepend`                          |
| Bloc PHP                          | `@php ... @endphp`                                   |
| Classes conditionnelles           | `@class(['ma-classe' => $condition])`                |
| Styles conditionnels              | `@style(['color: red' => $condition])`               |
| Attributs HTML                    | `@checked / @selected / @disabled / @readonly / @required` |
| Jeton CSRF                        | `@csrf`                                              |
| Méthode HTTP simulée              | `@method('PUT')` / `@method('DELETE')`               |
| Erreur de formulaire              | `@error('field') {{ $message }} @enderror`           |
| Bloquer l'interprétation Blade    | `@verbatim ... @endverbatim`                         |
| Variable JS dans Blade            | `@{{ jsVariable }}`                                  |
| Directive personnalisée           | `Blade::directive('name', fn)`                       |
| Condition `@if` personnalisée     | `Blade::if('name', fn)`                              |

## Blade [Components](https://laravel.com/docs/12.x/blade#components)

### Qu'est-ce qu'un component ?

Dans le monde du développement web, on travaille de plus en plus sous forme de **composants**, particulièrement avec les frameworks JS (React, Vue, Angular, etc.).
Cette méthode de travail permet d'organiser le code et les structures de pages de manière plus logique et plus facile à appréhender.
C'est une bonne façon de factoriser et donc d'améliorer la lisibilité du code et sa maintenabilité.

Laravel propose un système de composants Blade.
Chaque composant possède :
* Une classe PHP pour gérer ses données
* Une vue `.blade.php` pour afficher ces données

### Component = une classe et une vue

La classe PHP du composant permet de générer les différentes données nécessaires à la vue via son constructeur et ses propriétés publiques.

La vue a accès automatiquement à ces propriétés :
```PHP
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Alert extends Component
{
  /**
   * Create the component instance.
   */
  public function __construct(
    public string $type,
    public string $message,
  ) {}

  /**
   * Get the view / contents that represent the component.
   */
  public function render(): View
  {
    return view('components.alert');
  }
}
```
La vue `components/alert.blade.php` a automatiquement accès aux propriétés publiques de la classe (`$type`, `$message`) sous forme de variables :
```PHP
<div class="alert alert-{{ $type }}">
    {{ $message }}
</div>
```
Pour appeler ce composant depuis une autre vue :
```PHP
<x-alert type="error" :message="$message" />
```
* `x-alert` fait référence à la classe `Alert`.
* `type-error` assigne une valeur statique (string littérale),
* `:message="$message"` : le préfixe : indique à Blade d'interpréter la valeur comme une expression PHP.

### Créer un composant

On va utiliser la commande Artisan :
```bash
php artisan make:component Alert
```
Cette commande crée la classe dans `app/View/Components/Alert.php` et la vue dans `resources/views/components/alert.blade.php`.

Il est possible de préfixer d'un sous-dossier, pratique pour regrouper les composants par domaine (formulaire, ui, etc.) :
```bash
php artisan make:component Forms/Input
```
Crée la classe dans `app/View/Components/Forms/Input.php` et la vue dans `resources/views/components/forms/input.blade.php`.

On peut aussi créer une vue sans classe PHP associée (composant anonyme) :
```bash
php artisan make:component --view alert
```

### Utiliser un componsant

Pour utiliser un composant dans un fichier Blade, on préfixe son nom en kebab-case de `x-`.

exemple:
```PHP
<x-alert/>

<x-user-profile/>
```

> Conventions de nommage
> | Convention  |	Exemple         |	Usage typique                                        |
> | ----------- | --------------- | ---------------------------------------------------- |
> | PascalCase  |	`AlertMessage`  |	Classes PHP, composants Blade                        |
> | camelCase	  | `alertMessage`  |	Variables PHP, propriétés de composant (côté classe) |
> | kebab-case	| `alert-message`	| Balises HTML, attributs HTML, noms de fichiers CSS   |
> | snake_case	| `alert_message`	| Colonnes de base de données, clés de configuration   |
> Dans les composants Blade : la classe est en `PascalCase` (`UserProfile`), la balise HTML est en `kebab-case` (`<x-user-profile>`), et les attributs PHP sont en `camelCase` côté constructeur.

Si le composant est dans un sous-dossier, on peut utiliser `.` comme séparateur :
```PHP
<x-inputs.button/>
```
Ce qui correspond à `app/View/Components/Inputs/Button.php`.

### Passer des données à un componsant

Deux méthodes possibles :
* Générées les données directement par le constructeur du Composant
* Passer les données à la volée via les attributs de la balise `<x-votre-composant/>`
```PHP
<x-alert type="error" :message="$message" />
```
Le composant `alert` reçoit deux attributs : `type` et `message`.

* `type="error"` est une valeur statique (string littérale).
* `:message="$message"` : le préfixe `:` indique à Blade d'interpréter la valeur comme une expression PHP - ici, la variable `$message`.

Ce genre de syntaxe est inspirée des frameworks JS comme `Vue.js`.

Il faut respecter la convention de nommage :
* `camelCase` pour les propriétés de la classe PHP.
* `kebab-case` pour les attributs de la balise HTML.

### Les méthodes de classe

Les composants sont des classes PHP : on peut donc définir des méthodes en plus des propriétés, et les appeler directement dans la vue.

Dans la classe, on crée une méthode `isSelected` qui prend en paramètre une variable de type `string` :
```PHP
/**
 * Determine if the given option is the currently selected option.
 */
public function isSelected(string $option): bool
{
  return $option === $this->selected;
}
```
Dans la vue associée, on appelle la méthode `isSelected` à laquelle on passe la variable `$value`.
```PHP
<option {{ $isSelected($value) ? 'selected' : '' }} value="{{ $value }}">
  {{ $label }}
</option>
```

### Slots

L'idée est de rendre un composant générique en laissant l'appelant injecter son propre contenu.
Le composant conserve la même structure HTML/CSS, seul le contenu varie.

Pour passer du contenu HTML (plus qu'une simple string), on utilise les slots :
```PHP
<!-- /resources/views/components/alert.blade.php -->

<div class="alert alert-danger">
  {{ $slot }}
</div>
```
Dans une autre vue qui appelle le composant, le contenu entre les balises ouvrante et fermante alimente automatiquement `$slot` :
```PHP
<x-alert>
    <strong>Whoops!</strong> Something went wrong!
</x-alert>
```

**Valeur par défaut**
```PHP
<div class="alert alert-danger">
    @if ($slot->isEmpty())
        This is default content if the slot is empty.
    @else
        {{ $slot }}
    @endif
</div>
```
Si `$slot` est vide (`isEmpty()`), alors on affiche la le texte par défaut. Sinon, on affiche le contenu de `$slot`.

**Slots nommés :**

Pour passer plusieurs zones de contenu distinctes à un composant, on utilise les slots nommés avec <x-slot:name> :
```PHP
<!-- resources/views/components/modal.blade.php -->

<div class="modal">
    <div class="modal-header">{{ $header }}</div>
    <div class="modal-body">{{ $slot }}</div>
    <div class="modal-footer">{{ $footer }}</div>
</div>
```
```PHP
<x-modal>
    <x-slot:header>
        <h2>Confirmation</h2>
    </x-slot:header>

    <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>

    <x-slot:footer>
        <button>Annuler</button>
        <button class="btn-danger">Supprimer</button>
    </x-slot:footer>
</x-modal>
```
Les slots nommés correspondent à des variables `$header`, `$footer`, etc. dans la vue du composant. Le contenu entre les balises ouvrante et fermante du composant (hors slots nommés) alimente toujours `$slot`.

**Le sac d'attributs `$attributes`**

Lorsqu'on appelle un composant avec des attributs HTML supplémentaires (`class`, `id`, `data-*`, etc.) qui ne correspondent pas à des propriétés du constructeur, ils sont automatiquement regroupés dans la variable `$attributes`.
```PHP
<!-- resources/views/components/alert.blade.php -->

<div {{ $attributes->merge(['class' => 'alert']) }}>
    {{ $slot }}
</div>
```
```PHP
<x-alert class="alert-danger mt-4" id="main-alert">
    Quelque chose s'est mal passé.
</x-alert>
```
Rendu HTML :
```PHP
<div class="alert alert-danger mt-4" id="main-alert">
    Quelque chose s'est mal passé.
</div>
```

### Layouts

Les slots permettent de définir des **layouts** sur les pages afin de factoriser le code (navigation, footer, structure HTML commune, etc.).
```PHP
<!-- resources/views/components/layout.blade.php -->

<html>
    <head>
        <title>{{ $title ?? 'Todo Manager' }}</title>
    </head>
    <body>
        <h1>Todos</h1>
        <hr/>
        {{ $slot }}
    </body>
</html>
```
Toutes les pages qui font appel au composant `layout` bénéficient automatiquement de cette structure HTML. Le `$slot` est remplacé par le contenu entre les balises du composant :
```PHP
<!-- resources/views/tasks.blade.php -->

<x-layout>
    @foreach ($tasks as $task)
        <div>{{ $task }}</div>
    @endforeach
</x-layout>
```
Ici, `title` est passé en attribut et récupéré dans le composant via `$title`. Le contenu du `@foreach` alimente `$slot`.

> **`@section` / `@yield` vs composants layouts**
>
> L'approche `@extends` / `@yield` est une alternative à l'approche composant pour gérer les layouts.
> Elle est entièrement couverte dans la section **Blade templates > Héritage de templates** ci-dessus.
>
> | Directive    | Rôle                                                                      |
> | ------------ | ------------------------------------------------------------------------- |
> | `@extends`   | Déclare le layout dont hérite la vue enfant                               |
> | `@yield`     | Définit une zone injectable dans le layout                                |
> | `@section`   | Remplit une zone `@yield` depuis la vue enfant                            |
> | `@endsection`| Ferme une section                                                         |
> | `@show`      | Ferme la section **et l'affiche immédiatement** (= `@endsection` + rendu) |
> | `@parent`    | Conserve le contenu du parent dans la section enfant                      |

### Résumé

Un composant Blade est une **classe PHP** couplée à une **vue Blade**.

| Concept                         | Description / Syntaxe                                                   |
| ------------------------------- | ----------------------------------------------------------------------- |
| Créer un composant              | `php artisan make:component Alert`                                      |
| Créer dans un sous-dossier      | `php artisan make:component Forms/Input`                                |
| Créer une vue sans classe       | `php artisan make:component --view alert`                               |
| Appeler un composant            | `<x-alert />` (nom en kebab-case, préfixé `x-`)                        |
| Attribut statique               | `<x-alert type="error" />`                                              |
| Attribut dynamique (PHP)        | `<x-alert :message="$message" />` (`:` = expression PHP)               |
| Slot par défaut                 | `{{ $slot }}` dans la vue du composant                                  |
| Slot nommé                      | `<x-slot:header>...</x-slot:header>` → `{{ $header }}` dans la vue    |
| Valeur par défaut d'un slot     | `@if ($slot->isEmpty())` dans la vue du composant                       |
| Attributs HTML supplémentaires  | `$attributes->merge(['class' => 'base-class'])`                         |
| Méthodes de classe              | Appelables directement dans la vue : `{{ $isSelected($value) ? ... }}`  |
| Layout avec composant           | `<x-layout>...</x-layout>` + `{{ $slot }}` dans le composant layout    |

Les composants permettent de **factoriser le code** en réutilisant des blocs (bouton, alerte, formulaire) et en définissant des **layouts** communs à toutes les pages.

## [Helpers](https://laravel.com/docs/12.x/helpers)

Laravel fournit un ensemble de **fonctions utilitaires** et de **classes d'aide** utilisables n'importe où dans l'application, sans avoir besoin d'instancier un objet ou d'injecter un service.

Il en existe deux types :

- **Fonctions procédurales** - des fonctions globales appelables directement (`dd()`, `collect()`, `now()`, `request()`, etc.)
- **Classes utilitaires** - des classes avec méthodes statiques (`Arr::`, `Str::`, `Number::`, etc.)

Ces helpers couvrent les besoins les plus courants du quotidien : debug, manipulation de chaînes et de tableaux, gestion des dates, génération d'URLs, etc.

### Debug - `dd()` et `dump()`

`dd()` signifie **Dump & Die** : il affiche le contenu d'une ou plusieurs variables de façon lisible, puis **stoppe l'exécution** du code.

```PHP
$user = User::find(1);
dd($user);                   // affiche $user et stoppe
dd($user, $request->all()); // accepte plusieurs variables
```

`dump()` fait la même chose sans stopper l'exécution : l'affichage a lieu puis le code continue.
```PHP
dump($user); // affiche $user et continue
```
> Ces fonctions sont uniquement destinées au **debug** et ne doivent pas rester en production.

### Dates - `now()` et `today()`

`now()` retourne un objet `Carbon` représentant la date et l'heure actuelles dans le fuseau horaire défini dans `config/app.php`.
```PHP
$now = now();
$now->format('d/m/Y H:i');  // "18/03/2026 14:30"
$now->addDays(7);            // dans 7 jours
$now->diffForHumans();       // "il y a quelques secondes"
```

`today()` retourne un `Carbon` avec l'heure fixée à minuit (00:00:00) :
```PHP
$today = today(); // 2026-03-18 00:00:00
```
> `Carbon` est une bibliothèque PHP de gestion de dates intégrée à Laravel. Elle étend la classe native `DateTime` avec de nombreuses méthodes pratiques.

### Collections - `collect()`

`collect()` transforme un tableau en **Collection Laravel**, un objet enrichi avec de nombreuses méthodes de manipulation de données.
```PHP
$numbers = collect([1, 2, 3, 4, 5]);

$doubled = $numbers->map(fn($n) => $n * 2);           // [2, 4, 6, 8, 10]
$evens   = $numbers->filter(fn($n) => $n % 2 === 0); // [2, 4]
$sum     = $numbers->sum();                            // 15
```

### Configuration - `config()` et `env()`

`config()` lit une valeur depuis les fichiers de configuration (`config/*.php`) :
```PHP
$appName = config('app.name');
$dbName  = config('database.connections.mysql.database');
$value   = config('app.timezone', 'UTC'); // valeur par défaut si absente
```

`env()` lit une variable d'environnement depuis le fichier `.env` :
```PHP
$debug  = env('APP_DEBUG');
$apiKey = env('STRIPE_KEY', 'default-value');
```

> En production, il est déconseillé d'appeler `env()` directement hors des fichiers `config/`. Après un `php artisan config:cache`, le `.env` n'est plus lu - seule la config mise en cache est utilisée.

### Requête HTTP - `request()`

`request()` retourne l'instance de la requête HTTP courante (équivalent à l'injection de `Request`) :
```PHP
$name   = request('name');    // équivalent à $request->input('name')
$all    = request()->all();
$isAjax = request()->ajax();
```

### Redirection - `redirect()` et `back()`

```PHP
return redirect('/dashboard');
return redirect()->route('users.index');
return redirect()->back();

return back()->withErrors(['email' => 'Email invalide.']);
return back()->with('success', 'Profil mis à jour.');
```

### Réponse HTTP - `response()` et `abort()`

```PHP
return response('Hello', 200);
return response()->json(['status' => 'ok']);
return response()->download(storage_path('file.pdf'));

abort(404);                    // lance une exception HTTP 404
abort(403, 'Accès refusé.');
```

### Vues - `view()`

Déjà couvert dans la section **[## Views](#vues---view)**, `view()` retourne une instance de vue Blade :
```PHP
return view('users.index', compact('users'));
```

### URLs - `url()`, `asset()` et `route()`

Couvertes en détail dans la section **[## URL Generation](#url-generation)** ci-dessous :
```PHP
url('/profile/1');                   // URL absolue
asset('css/app.css');                // URL vers public/css/app.css
route('users.show', ['id' => 1]);   // URL d'une route nommée
```

### Classes utilitaires - `Str::` et `Arr::`

Laravel fournit deux classes utilitaires très complètes pour manipuler chaînes et tableaux.

`Str::` - **manipulation de chaînes de caractères (string)** :
```PHP
use Illuminate\Support\Str;

Str::upper('hello');                     // "HELLO"
Str::slug('Mon Article');               // "mon-article"
Str::limit('Texte très long...', 50);  // tronque à 50 caractères
Str::contains('Laravel', 'avel');       // true
Str::startsWith('Laravel', 'La');       // true
Str::random(16);                         // chaîne aléatoire de 16 caractères
Str::uuid();                             // génère un UUID v4
```

`Arr::` - **manipulation de tableaux (Array)** :
```PHP
use Illuminate\Support\Arr;

Arr::get($array, 'user.name', 'défaut'); // lecture avec notation pointée
Arr::has($array, 'user.email');          // vérifie l'existence d'une clé
Arr::pluck($users, 'name');              // extrait une colonne : ['Alice', 'Bob']
Arr::first($array, fn($v) => $v > 10);  // premier élément correspondant
Arr::random($array);                     // élément aléatoire
Arr::flatten([[1, 2], [3, 4]]);          // [1, 2, 3, 4]
```

### Résumé

| Helper / Classe             | Usage principal                             |
| --------------------------- | ------------------------------------------- |
| `dd($var)`                  | Debug - affiche et stoppe l'exécution       |
| `dump($var)`                | Debug - affiche sans stopper                |
| `now()`                     | Date/heure courante (objet `Carbon`)        |
| `today()`                   | Date courante à minuit (objet `Carbon`)     |
| `collect($array)`           | Transforme un tableau en Collection Laravel |
| `config('app.name')`        | Lire une valeur de configuration            |
| `env('APP_KEY')`            | Lire une variable d'environnement           |
| `request('field')`          | Accéder aux données de la requête courante  |
| `redirect('/url')`          | Rediriger vers une URL                      |
| `back()`                    | Rediriger vers la page précédente           |
| `response()->json()`        | Retourner une réponse JSON                  |
| `abort(404)`                | Lancer une exception HTTP                   |
| `view('nom')`               | Retourner une vue Blade                     |
| `url('/path')`              | Générer une URL absolue                     |
| `asset('file')`             | Générer l'URL d'un asset public             |
| `route('name')`             | Générer l'URL d'une route nommée            |
| `Str::slug('Mon Titre')`    | Convertir en slug URL                       |
| `Str::random(16)`           | Générer une chaîne aléatoire                |
| `Arr::pluck($arr, 'key')`   | Extraire une colonne d'un tableau           |
| `Arr::get($arr, 'a.b')`     | Lire via notation pointée                   |

## [URL Generation](https://laravel.com/docs/12.x/urls)

Laravel fournit un ensemble d'outils pour **générer et manipuler des URL** de façon fiable : URLs absolues, URLs de routes nommées, assets publics, URLs signées (protégées contre la manipulation), et URLs temporaires.

### `url()` - URL absolue

`url()` génère une URL absolue en prenant automatiquement en compte le domaine de l'application (avec ou sans HTTPS, selon la configuration) :

```PHP
$post = App\Models\Post::find(1);

echo url("/posts/{$post->id}");
// https://example.com/posts/1
```

La méthode `query()` permet d'ajouter des paramètres de query string :

```PHP
echo url()->query('/posts', ['search' => 'Laravel']);
// https://example.com/posts?search=Laravel

echo url()->query('/posts?sort=latest', ['search' => 'Laravel']);
// https://example.com/posts?sort=latest&search=Laravel

// Un paramètre existant peut être écrasé :
echo url()->query('/posts?sort=latest', ['sort' => 'oldest']);
// https://example.com/posts?sort=oldest

// Les tableaux sont encodés automatiquement :
echo urldecode(url()->query('/posts', ['columns' => ['title', 'body']]));
// https://example.com/posts?columns[0]=title&columns[1]=body
```

### `asset()` - URL d'un fichier public

`asset()` génère l'URL d'un fichier situé dans le dossier `public/` de l'application.
C'est la méthode à utiliser pour référencer des fichiers CSS, JavaScript ou images dans les vues :

```PHP
<link rel="stylesheet" href="{{ asset('css/app.css') }}">
<script src="{{ asset('js/app.js') }}"></script>
<img src="{{ asset('images/logo.png') }}" alt="Logo">
```

`secure_asset()` force le schéma `https://` :

```PHP
<img src="{{ secure_asset('images/logo.png') }}">
```

### URL courante et historique

`url()` retourne une instance de `\Illuminate\Routing\UrlGenerator` qui expose des méthodes pour inspecter l'URL courante :

```PHP
echo url()->current();      // URL courante sans la query string
echo url()->full();         // URL courante avec la query string
echo url()->previous();     // URL complète de la requête précédente
echo url()->previousPath(); // Chemin seul de la requête précédente
```

Les mêmes méthodes sont disponibles via la façade `URL` :

```PHP
use Illuminate\Support\Facades\URL;

echo URL::current();
echo URL::full();
```

### `route()` - URL d'une route nommée

Grâce au **nommage des routes**, on peut générer une URL à partir de la clé de la route plutôt que d'écrire le chemin en dur (voir section **Routing > Routes nommées**) :

```PHP
Route::get('/post/{post}', function (Post $post) {
    // ...
})->name('post.show');

echo route('post.show', ['post' => 1]);
// https://example.com/post/1
```

Avec plusieurs paramètres :

```PHP
Route::get('/post/{post}/comment/{comment}', function (Post $post, Comment $comment) {
    // ...
})->name('comment.show');

echo route('comment.show', ['post' => 1, 'comment' => 3]);
// https://example.com/post/1/comment/3
```

Tout paramètre supplémentaire non défini dans la route est ajouté en query string :

```PHP
echo route('post.show', ['post' => 1, 'search' => 'rocket']);
// https://example.com/post/1?search=rocket
```

### `action()` - URL d'une méthode de controller

Comme la plupart des URL redirigent vers un controller, Laravel propose le helper `action()` pour générer l'URL associée à une méthode de controller directement :

```PHP
use App\Http\Controllers\HomeController;

$url = action([HomeController::class, 'index']);
```

Avec des paramètres de route :

```PHP
$url = action([UserController::class, 'profile'], ['id' => 1]);
```

### URLs signées

Signer une URL protège ses paramètres contre toute manipulation : Laravel génère un **hash** (signature) ajouté en query string. Si l'URL est modifiée, la signature devient invalide et le serveur peut rejeter la requête.

**Cas d'usage typique :** lien de désinscription à une newsletter envoyé par email - on veut s'assurer qu'un utilisateur ne peut pas changer l'ID pour désabonner quelqu'un d'autre.

**Générer une URL signée :**

```PHP
use Illuminate\Support\Facades\URL;

return URL::signedRoute('unsubscribe', ['user' => 1]);
// https://example.com/unsubscribe/1?signature=abc123...
```

**Vérifier la signature dans la route :**

```PHP
use Illuminate\Http\Request;

Route::get('/unsubscribe/{user}', function (Request $request) {
    if (! $request->hasValidSignature()) {
        abort(401);
    }
    // Traitement de la désinscription...
})->name('unsubscribe');
```

**URL signée temporaire** (expiration automatique) :

Utile pour les liens de réinitialisation de mot de passe ou de confirmation d'email :

```PHP
use Illuminate\Support\Facades\URL;

return URL::temporarySignedRoute(
    'unsubscribe', now()->plus(minutes: 30), ['user' => 1]
);
```

### Gestion des URI

> **Rappel :** Une URI est la partie du chemin après le domaine.
> Exemple : pour `https://mon-site.com/articles/3/cours-laravel`, l'URI est `/articles/3/cours-laravel`.

Laravel fournit la classe `Uri` pour construire et manipuler des URI de façon orientée objet :

```PHP
use App\Http\Controllers\UserController;
use App\Http\Controllers\InvokableController;
use Illuminate\Support\Uri;

// Generate a URI instance from the given string...
$uri = Uri::of('https://example.com/path');

// Generate URI instances to paths, named routes, or controller actions...
$uri = Uri::to('/dashboard');
$uri = Uri::route('users.show', ['user' => 1]);
$uri = Uri::signedRoute('users.show', ['user' => 1]);
$uri = Uri::temporarySignedRoute('user.index', now()->plus(minutes: 5));
$uri = Uri::action([UserController::class, 'index']);
$uri = Uri::action(InvokableController::class);

// Generate a URI instance from the current request URL...
$uri = $request->uri();

// Generate a URI instance from the previous request URL...
$uri = $request->session()->previousUri();
```

### Interface fluente (`Uri`)

`Uri` implémente une **interface fluente** : chaque méthode de modification retourne l'instance elle-même, ce qui permet d'**enchaîner les appels** :

```PHP
$uri = Uri::of('https://example.com')
    ->withScheme('https')
    ->withHost('mon-site.com')
    ->withPort(8000)
    ->withPath('/users')
    ->withQuery(['page' => 2])
    ->withFragment('section-1');

// https://mon-site.com:8000/users?page=2#section-1
```

### Résumé

| Fonction / Méthode                                  | Usage                                                   |
| --------------------------------------------------- | ------------------------------------------------------- |
| `url('/path')`                                      | URL absolue basée sur le domaine de l'app               |
| `url()->query('/path', ['key' => 'val'])`           | URL avec query string                                   |
| `asset('css/app.css')`                              | URL d'un fichier dans `public/`                         |
| `secure_asset('img/logo.png')`                      | URL HTTPS d'un fichier dans `public/`                   |
| `url()->current()`                                  | URL courante (sans query string)                        |
| `url()->full()`                                     | URL courante (avec query string)                        |
| `url()->previous()`                                 | URL de la requête précédente                            |
| `route('route.name', ['param' => 1])`               | URL d'une route nommée                                  |
| `action([Controller::class, 'method'])`             | URL d'une méthode de controller                         |
| `URL::signedRoute('name', ['param' => 1])`          | URL signée (protégée contre la manipulation)            |
| `URL::temporarySignedRoute('name', now()->addMinutes(30), [...])` | URL signée avec expiration |
| `Uri::of('...')`, `Uri::route(...)`, etc.           | Manipulation orientée objet d'une URI                   |

## [Collection](https://laravel.com/docs/12.x/collections)

### Qu'est-ce qu'une Collection ?

En PHP natif, les tableaux (`array`) sont des **types primitifs**, pas des objets : on les manipule avec des fonctions procédurales (`array_map()`, `array_filter()`, `usort()`, etc.) dont la syntaxe est peu homogène et difficile à chaîner.

Laravel propose la classe `Collection` (`Illuminate\Support\Collection`) qui **encapsule un tableau** dans un objet et expose plus de 150 méthodes pour transformer, filtrer, trier et agréger les données - avec une API cohérente et chaînable.

> Les Collections sont omniprésentes dans Laravel : les requêtes Eloquent retournent des Collections, `DB::table()->get()` également.

### Créer une Collection

Le plus souvent, on utilise le helper `collect()` :

```PHP
$collection = collect([1, 2, 3, 4, 5]);
$collection = collect(['name' => 'Alice', 'role' => 'admin']);
```

On peut aussi instancier la classe directement ou créer une Collection depuis un JSON :

```PHP
use Illuminate\Support\Collection;

$collection = new Collection([1, 2, 3]);
$collection = Collection::fromJson('{"name":"Alice","role":"admin"}');
```

### Méthodes essentielles

Les méthodes des Collections sont **non-destructives** par défaut : elles retournent une **nouvelle** Collection sans modifier l'originale.

#### Transformation

**`map()`** - transforme chaque élément et retourne une nouvelle Collection :

```PHP
$numbers = collect([1, 2, 3, 4, 5]);

$doubled = $numbers->map(fn(int $n) => $n * 2);
// Collection : [2, 4, 6, 8, 10]
```

**`filter()`** - conserve uniquement les éléments satisfaisant la condition :

```PHP
$evens = $numbers->filter(fn(int $n) => $n % 2 === 0);
$evens->all(); // [2, 4]

// Sans callback, filter() retire les valeurs "falsy" (null, false, 0, '') :
$clean = collect([1, null, 2, false, 3])->filter()->values();
// Collection : [1, 2, 3]
```

**`reject()`** - inverse de `filter()` - conserve ce qui **ne** satisfait **pas** la condition :

```PHP
$odds = $numbers->reject(fn(int $n) => $n % 2 === 0);
// Collection : [1, 3, 5]
```

**`each()`** - itère sur chaque élément sans modifier la Collection (effets de bord) :

```PHP
$collection->each(function (mixed $item) {
    Log::info($item);
});
```

#### Recherche et extraction

**`first()` / `last()`** - retourne le premier / dernier élément, avec ou sans condition :

```PHP
$first = collect([1, 2, 3])->first();                     // 1
$last  = collect([1, 2, 3])->last();                      // 3
$big   = collect([1, 2, 3, 4])->first(fn($n) => $n > 2); // 3
```

**`pluck()`** - extrait une colonne par clé :

```PHP
$users = collect([
    ['name' => 'Alice', 'role' => 'admin'],
    ['name' => 'Bob',   'role' => 'user'],
]);

$names = $users->pluck('name');
$names->all(); // ['Alice', 'Bob']

// Avec un deuxième argument pour indexer le résultat par clé :
$byName = $users->pluck('role', 'name');
// ['Alice' => 'admin', 'Bob' => 'user']
```

**`where()`** - filtre par clé/valeur (idéal pour les tableaux associatifs ou les modèles Eloquent) :

```PHP
$products = collect([
    ['name' => 'Desk',     'price' => 200],
    ['name' => 'Chair',    'price' => 100],
    ['name' => 'Bookcase', 'price' => 150],
    ['name' => 'Door',     'price' => 100],
]);

$cheap = $products->where('price', 100);
/*
    [
        ['name' => 'Chair', 'price' => 100],
        ['name' => 'Door',  'price' => 100],
    ]
*/
```

**`contains()`** - vérifie si une valeur ou une condition est présente :

```PHP
collect([1, 2, 3])->contains(2);                     // true
collect([1, 2, 3])->contains(fn(int $n) => $n > 5); // false
$products->contains('name', 'Desk');                  // true
```

#### Agrégation

```PHP
$numbers = collect([1, 2, 3, 4, 5]);

$numbers->count();            // 5
$numbers->sum();              // 15
$numbers->avg();              // 3.0
$numbers->min();              // 1
$numbers->max();              // 5

// Sur des tableaux associatifs :
$products->sum('price');      // 550
$products->avg('price');      // 137.5
```

#### Tri et organisation

**`sortBy()` / `sortByDesc()`** - trie par une clé ou une expression :

```PHP
$sorted     = $products->sortBy('price');     // ordre croissant
$sortedDesc = $products->sortByDesc('price'); // ordre décroissant
```

**`groupBy()`** - regroupe les éléments par une clé :

```PHP
$grouped = $products->groupBy('price');
/*
    Collection {
        100 => [['name' => 'Chair', ...], ['name' => 'Door', ...]],
        150 => [['name' => 'Bookcase', ...]],
        200 => [['name' => 'Desk', ...]],
    }
*/
```

**`chunk()`** - divise la Collection en sous-Collections de taille fixe :

```PHP
$chunks = collect([1, 2, 3, 4, 5])->chunk(2);
// [[1, 2], [3, 4], [5]]
```

**`unique()`** - retire les doublons :

```PHP
$unique = collect([1, 2, 2, 3, 3, 4])->unique()->values();
// [1, 2, 3, 4]
```

> `values()` réindexe la Collection (repart de 0) après une opération qui peut créer des "trous" dans les index.

#### Sérialisation

**`all()`** - retourne le tableau PHP sous-jacent (sans conversion récursive) :

```PHP
$array = collect([1, 2, 3])->all(); // [1, 2, 3]
```

**`toArray()`** - convertit récursivement en tableau PHP (y compris les sous-Collections ou modèles Eloquent) :

```PHP
$collection = collect(['name' => 'Desk', 'price' => 200]);
$collection->toArray();
// ['name' => 'Desk', 'price' => 200]
```

**`toJson()`** - convertit en chaîne JSON :

```PHP
$json = collect(['name' => 'Desk', 'price' => 200])->toJson();
// '{"name":"Desk","price":200}'
```

### Chaînage de méthodes

L'un des grands atouts des Collections est la **fluidité du chaînage** : chaque méthode retourne une nouvelle Collection, ce qui permet d'enchaîner les opérations sans variables intermédiaires :

```PHP
$result = collect($rawData)
    ->filter(fn($item) => $item['active'])
    ->sortBy('name')
    ->pluck('name')
    ->values()
    ->toArray();
```

### Lazy Collections

Pour les jeux de données très volumineux, Laravel propose les **Lazy Collections** (`LazyCollection`). Contrairement aux Collections classiques qui chargent tout en mémoire, elles utilisent les **générateurs PHP** pour traiter les données au fil de l'eau :

```PHP
use Illuminate\Support\LazyCollection;

LazyCollection::make(function () {
    $handle = fopen('large-file.csv', 'r');
    while (($line = fgets($handle)) !== false) {
        yield $line;
    }
})->chunk(100)->each(function ($chunk) {
    // traite 100 lignes à la fois sans tout charger en mémoire
});
```

Eloquent expose aussi les Lazy Collections via `cursor()` :

```PHP
User::cursor()->each(function (User $user) {
    // itère sur des milliers d'utilisateurs sans saturer la mémoire RAM
});
```

### Résumé

Une **Collection** est une enveloppe objet autour d'un tableau PHP, exposant plus de 150 méthodes cohérentes et chaînables.

| Méthode / Concept                              | Rôle                                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `collect($array)`                              | Créer une Collection depuis un tableau                     |
| `Collection::fromJson($json)`                  | Créer une Collection depuis du JSON                        |
| `->all()`                                      | Retourner le tableau PHP sous-jacent                       |
| `->toArray()`                                  | Conversion récursive en tableau                            |
| `->toJson()`                                   | Conversion en chaîne JSON                                  |
| `->map(fn($item) => ...)`                      | Transformer chaque élément                                 |
| `->filter(fn($item) => ...)`                   | Conserver selon condition                                  |
| `->reject(fn($item) => ...)`                   | Exclure selon condition                                    |
| `->each(fn($item) => ...)`                     | Itérer sans modifier                                       |
| `->first() / ->last()`                         | Premier / dernier élément                                  |
| `->pluck('key')`                               | Extraire une colonne par clé                               |
| `->where('key', $val)`                         | Filtrer par clé/valeur                                     |
| `->contains($val)`                             | Vérifier la présence d'une valeur                          |
| `->count() / ->sum() / ->avg()`                | Comptage et agrégation                                     |
| `->min() / ->max()`                            | Valeur minimale / maximale                                 |
| `->sortBy('key') / ->sortByDesc('key')`        | Trier par clé                                              |
| `->groupBy('key')`                             | Regrouper par clé                                          |
| `->chunk($n)`                                  | Découper en sous-Collections de taille `$n`                |
| `->unique()`                                   | Supprimer les doublons                                     |
| `->values()`                                   | Réindexer (repart de 0)                                    |
| `->merge($array)`                              | Fusionner avec un autre tableau                            |
| `User::cursor()`                               | Lazy Collection - itération économe en mémoire             |

## Résumé
