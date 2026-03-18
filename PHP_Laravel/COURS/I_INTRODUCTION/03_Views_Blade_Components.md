
# [Views](https://laravel.com/docs/12.x/views)

Les Views sont la troisième couche du modèle MVC.
C'est ici qu'on retrouve tout le code HTML (et le CSS/JS associé) - et rien d'autre : **pas de logique métier**.
Ce sont les controllers qui préparent les données et retournent les vues avec ces données.

Laravel place les vues dans le dossier `/resources/views`.

## Créer une vue

Il est possible de créer des vues manuellement, mais Artisan le fait en une commande :

```bash
php artisan make:view greeting
```
Artisan crée le fichier /resources/views/greeting.blade.php.

> Les vues Laravel sont des fichiers .blade.php. Blade est le moteur de templates de Laravel (voir section dédiée).
> Il permet entre autres d'utiliser la syntaxe {{ $variable }} pour afficher des données, et des directives comme @if, @foreach, etc., intégrées directement dans du HTML.

## Afficher une vue

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

## Passer des données à uune vue

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

## Vues dans des sous-dossiers
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

## Vérifier qu'une vuew existe

La façade `View` expose une méthode `exists()` :
```PHP
use Illuminate\Support\Facades\View;

if (View::exists('admin.profile')) {
  return view('admin.profile');
}
```

## Rendre la première vue disponible

Quand plusieurs vues peuvent convenir, on utilise View::first() pour afficher la première qui existe :
```PHP
use Illuminate\Support\Facades\View;

return View::first(['custom.admin', 'admin'], $data);
```
Laravel essaie les vues dans l'ordre et retourne la première disponible.
C'est pratique pour des systèmes de thèmes ou de personnalisation par client (multi-tenant).

## Partage de données à toutes les vues

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

## View Composers - partage ciblé

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
## Optimisation - cache des vues

Par défaut, les vues Blade sont compilées à la demande (au premier accès) puis mises en cache.
En production, on peut forcer la compilation de toutes les vues à l'avance pour éviter le coût de compilation lors des requêtes :
```bash
php artisan view:cache    # Compile toutes les vues Blade
php artisan view:clear    # Vide le cache des vues compilées
```

## Résumé

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

# Blade templates

Blade est le moteur de template de Laravel.

## Moteur de template ?

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
## Comment cela fonctionne ?

Si le fichier est en `blade.php`, on peut utiliser le moteur directement.
Laravel passe ensuite derrière pour compiler le fichier en PHP 'normal'.

`{{ $name }}` seront transformés en `<?= $name; ?>` classique.

La syntaxe de blade est plus propre et lisible que la syntaxe classique de php.

Laravel propose également d'autres directives très pratiques.
Contrairement à d'autre moteurs de template connus d'autres frameworks, Laravel est permissif et permet de faire du PHP pur dans un fichier `blade.php`. Ce qui peut être très pratique.

## Afficher une donnée en blade

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

## Conflts avec un framework JavaScript

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

## Héritage de templates

L'une des fonctionnalités les plus puissantes de Blade est l'**héritage de templates**.
Elle permet de définir un **layout** (mise en page commune) et des vues enfants qui l'étendent, évitant de dupliquer le code HTML structurel (head, navigation, footer) sur chaque page.

## Créer un layout

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

## Créer une vue enfant

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

## Conserver le contenu parent

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

## Blades directives

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

## Loop directives

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

## Attributs additionnels

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

## Inclure des sous-vues

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

## Stacks

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

## Les formulaires

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

## Les formulaires - les erreurs

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

## Bonus

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

## Résumé

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

# Blade [Components](https://laravel.com/docs/12.x/blade#components)

## Qu'est-ce qu'un component ?

Dans le monde du développement web, on travaille de plus en plus sous forme de **composants**, particulièrement avec les frameworks JS (React, Vue, Angular, etc.).
Cette méthode de travail permet d'organiser le code et les structures de pages de manière plus logique et plus facile à appréhender.
C'est une bonne façon de factoriser et donc d'améliorer la lisibilité du code et sa maintenabilité.

Laravel propose un système de composants Blade.
Chaque composant possède :
* Une classe PHP pour gérer ses données
* Une vue `.blade.php` pour afficher ces données

## Component = une classe et une vue

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

## Créer un composant

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

## Utiliser un componsant

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

## Passer des données à un componsant

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

## Les méthodes de classe

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

## Slots

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

## Layouts

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

## Résumé

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
