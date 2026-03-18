# [Helpers](https://laravel.com/docs/12.x/helpers)

Laravel fournit un ensemble de **fonctions utilitaires** et de **classes d'aide** utilisables n'importe où dans l'application, sans avoir besoin d'instancier un objet ou d'injecter un service.

Il en existe deux types :

- **Fonctions procédurales** - des fonctions globales appelables directement (`dd()`, `collect()`, `now()`, `request()`, etc.)
- **Classes utilitaires** - des classes avec méthodes statiques (`Arr::`, `Str::`, `Number::`, etc.)

Ces helpers couvrent les besoins les plus courants du quotidien : debug, manipulation de chaînes et de tableaux, gestion des dates, génération d'URLs, etc.

## Debug - `dd()` et `dump()`

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

## Dates - `now()` et `today()`

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

## Collections - `collect()`

`collect()` transforme un tableau en **Collection Laravel**, un objet enrichi avec de nombreuses méthodes de manipulation de données.
```PHP
$numbers = collect([1, 2, 3, 4, 5]);

$doubled = $numbers->map(fn($n) => $n * 2);           // [2, 4, 6, 8, 10]
$evens   = $numbers->filter(fn($n) => $n % 2 === 0); // [2, 4]
$sum     = $numbers->sum();                            // 15
```

## Configuration - `config()` et `env()`

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

## Requête HTTP - `request()`

`request()` retourne l'instance de la requête HTTP courante (équivalent à l'injection de `Request`) :
```PHP
$name   = request('name');    // équivalent à $request->input('name')
$all    = request()->all();
$isAjax = request()->ajax();
```

## Redirection - `redirect()` et `back()`

```PHP
return redirect('/dashboard');
return redirect()->route('users.index');
return redirect()->back();

return back()->withErrors(['email' => 'Email invalide.']);
return back()->with('success', 'Profil mis à jour.');
```

## Réponse HTTP - `response()` et `abort()`

```PHP
return response('Hello', 200);
return response()->json(['status' => 'ok']);
return response()->download(storage_path('file.pdf'));

abort(404);                    // lance une exception HTTP 404
abort(403, 'Accès refusé.');
```

## Vues - `view()`

Déjà couvert dans la section **[# Views](#vues---view)**, `view()` retourne une instance de vue Blade :
```PHP
return view('users.index', compact('users'));
```

## URLs - `url()`, `asset()` et `route()`

Couvertes en détail dans la section **[# URL Generation](#url-generation)** ci-dessous :
```PHP
url('/profile/1');                   // URL absolue
asset('css/app.css');                // URL vers public/css/app.css
route('users.show', ['id' => 1]);   // URL d'une route nommée
```

## Classes utilitaires - `Str::` et `Arr::`

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

## Résumé

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

# [URL Generation](https://laravel.com/docs/12.x/urls)

Laravel fournit un ensemble d'outils pour **générer et manipuler des URL** de façon fiable : URLs absolues, URLs de routes nommées, assets publics, URLs signées (protégées contre la manipulation), et URLs temporaires.

## `url()` - URL absolue

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

## `asset()` - URL d'un fichier public

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

## URL courante et historique

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

## `route()` - URL d'une route nommée

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

## `action()` - URL d'une méthode de controller

Comme la plupart des URL redirigent vers un controller, Laravel propose le helper `action()` pour générer l'URL associée à une méthode de controller directement :

```PHP
use App\Http\Controllers\HomeController;

$url = action([HomeController::class, 'index']);
```

Avec des paramètres de route :

```PHP
$url = action([UserController::class, 'profile'], ['id' => 1]);
```

## URLs signées

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

## Gestion des URI

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

## Interface fluente (`Uri`)

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

## Résumé

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

# [Collection](https://laravel.com/docs/12.x/collections)

## Qu'est-ce qu'une Collection ?

En PHP natif, les tableaux (`array`) sont des **types primitifs**, pas des objets : on les manipule avec des fonctions procédurales (`array_map()`, `array_filter()`, `usort()`, etc.) dont la syntaxe est peu homogène et difficile à chaîner.

Laravel propose la classe `Collection` (`Illuminate\Support\Collection`) qui **encapsule un tableau** dans un objet et expose plus de 150 méthodes pour transformer, filtrer, trier et agréger les données - avec une API cohérente et chaînable.

> Les Collections sont omniprésentes dans Laravel : les requêtes Eloquent retournent des Collections, `DB::table()->get()` également.

## Créer une Collection

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

## Méthodes essentielles

Les méthodes des Collections sont **non-destructives** par défaut : elles retournent une **nouvelle** Collection sans modifier l'originale.

## Transformation

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

## Recherche et extraction

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

## Agrégation

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

## Tri et organisation

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

## Sérialisation

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

## Chaînage de méthodes

L'un des grands atouts des Collections est la **fluidité du chaînage** : chaque méthode retourne une nouvelle Collection, ce qui permet d'enchaîner les opérations sans variables intermédiaires :

```PHP
$result = collect($rawData)
    ->filter(fn($item) => $item['active'])
    ->sortBy('name')
    ->pluck('name')
    ->values()
    ->toArray();
```

## Lazy Collections

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

## Résumé

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
