# Filament - Auth & Policies

Doc officielle : [https://filamentphp.com/docs/3.x/panels/resources/getting-started#authorization](https://filamentphp.com/docs/3.x/panels/resources/getting-started#authorization)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Comment Filament gère les autorisations](#1-comment-filament-gère-les-autorisations) | Filament consulte automatiquement la Policy Eloquent du modèle avant chaque action. |
| 2 | [Créer et enregistrer une Policy](#2-créer-et-enregistrer-une-policy) | Convention de nommage `{Model}Policy` ou enregistrement manuel dans `AuthServiceProvider`. |
| 3 | [Anatomie d'une Policy](#3-anatomie-dune-policy-filament) | Les 7 méthodes standard et leurs effets visuels dans Filament. |
| 4 | [Overrides dans la Resource](#4-overrides-dans-la-resource) | Surcharger les méthodes `can*()` pour affiner ou remplacer la Policy. |
| 5 | [Accès au panel : FilamentUser](#5-accès-au-panel--filamentuser) | Contrôler qui peut accéder au panel via `canAccessPanel()` sur le modèle User. |
| 6 | [Spatie Laravel Permission](#6-intégration-avec-spatie-laravel-permission) | Package de rôles/permissions le plus courant avec Filament. |
| 7 | [Navigation conditionnelle](#7-masquer-des-éléments-de-navigation-conditionnellement) | Masquer un item de navigation ou une page selon le rôle. |
| 8 | [Autorisation sur les Actions custom](#8-autorisation-sur-les-actions-custom) | `->authorize()` bloque, `->visible()` masque — les deux ensemble pour une sécurité correcte. |
| 9 | [Super Admin](#9-super-admin---contourner-toutes-les-vérifications) | `Gate::before()` court-circuite toutes les vérifications pour un rôle privilégié. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble des 5 niveaux d'autorisation. |

---

## 1. Comment Filament gère les autorisations

> **En résumé** : Filament ne réinvente pas la roue — il s'appuie directement sur les **Policies Eloquent** de Laravel. Si une Policy est enregistrée pour un modèle, Filament la consulte silencieusement avant chaque opération (affichage du bouton, accès à la page, exécution de l'action). Aucune configuration supplémentaire n'est nécessaire. Si une méthode de Policy retourne `false`, Filament masque ou bloque l'élément concerné automatiquement.

Filament s'appuie sur le système de Policies Eloquent de Laravel. Quand une Policy existe pour un modèle, Filament la consulte automatiquement avant d'afficher ou exécuter chaque action. Aucune configuration supplémentaire n'est requise : si la Policy est enregistrée, elle est respectée.

| Action Filament       |	Méthode de Policy vérifiée |
| --------------------- | -------------------------- |
| Voir la liste         |	`viewAny()`                |
| Voir un record        | `view()`                   |
| Créer	                | `create()`                 |
| Éditer                | `update()`                 |
| Supprimer	            | `delete()`                 |
| Restore (soft delete)	| `restore()`                |
| Force delete          | `forceDelete()`            |

## 2. Créer et enregistrer une Policy

> **En résumé** : Laravel détecte automatiquement `PostPolicy` pour le modèle `Post` — c'est la convention `{Model}Policy` dans `app/Policies/`. Si le nom diffère ou si la Policy est ailleurs, il faut l'enregistrer manuellement dans `$policies` de l'`AuthServiceProvider`. Une fois enregistrée, Filament la prend en compte sans autre configuration.

```bash
php artisan make:policy PostPolicy --model=Post
```
Laravel détecte automatiquement la Policy si elle respecte la convention de nommage `{Model}Policy` dans `app/Policies/`. Sinon, on l'enregistre dans `AuthServiceProvider` :
```PHP
<?php
// app/Providers/AuthServiceProvider.php

protected $policies = [
    Post::class => PostPolicy::class,
];
```

## 3. Anatomie d'une Policy Filament

> **En résumé** : Une Policy Filament suit la structure Laravel standard. Les méthodes sans `$record` (`viewAny`, `create`) reçoivent uniquement `$user`. Celles avec `$record` (`view`, `update`, `delete`…) reçoivent aussi le modèle concerné. L'effet est immédiat dans l'UI : si `create()` retourne `false`, le bouton « Créer » disparaît ; si `update()` retourne `false` pour un record, le bouton « Éditer » de cette ligne est masqué.

```PHP
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    // Peut-on voir la liste des posts ?
    public function viewAny(User $user): bool
    {
        return true; // tous les utilisateurs connectés
    }

    // Peut-on voir un post spécifique ?
    public function view(User $user, Post $post): bool
    {
        return true;
    }

    // Peut-on créer un post ?
    public function create(User $user): bool
    {
        return $user->hasRole('editor') || $user->hasRole('admin');
    }

    // Peut-on modifier un post ?
    public function update(User $user, Post $post): bool
    {
        // L'auteur peut modifier ses propres posts, les admins peuvent tout modifier
        return $user->id === $post->author_id || $user->hasRole('admin');
    }

    // Peut-on supprimer un post ?
    public function delete(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->hasRole('admin');
    }
}
```
Filament appelle ces méthodes automatiquement. Si `create()` retourne `false`, le bouton "Créer" disparaît. Si `update()` retourne `false` pour un record, le bouton "Éditer" est masqué sur cette ligne.

## 4. Overrides dans la Resource

> **En résumé** : Les méthodes `can*()` de la Resource permettent de **remplacer ou affiner** la Policy sans la modifier. C'est utile quand la logique est simple et ne justifie pas une Policy complète, ou pour désactiver une action pour tout le monde (`return false`). Attention : la surcharge dans la Resource **prend le dessus** sur la Policy — si les deux existent, c'est la Resource qui gagne.

Si on veut affiner ou remplacer le comportement de la Policy directement dans la Resource, on surcharge les méthodes `can*()` :
```PHP
<?php
class PostResource extends Resource
{
    // Surcharge locale - prend le dessus sur la Policy
    public static function canCreate(): bool
    {
        return auth()->user()->hasRole('admin');
    }

    public static function canEdit(Model $record): bool
    {
        return auth()->user()->id === $record->author_id;
    }

    public static function canDelete(Model $record): bool
    {
        return false; // suppression désactivée pour tout le monde
    }

    public static function canDeleteAny(): bool
    {
        return false; // désactive la bulk delete
    }

    public static function canView(Model $record): bool
    {
        return auth()->user()->can('view', $record);
    }

    public static function canViewAny(): bool
    {
        // Masque la Resource entière dans la navigation si false
        return auth()->user()->hasAnyRole(['admin', 'editor']);
    }
}
```
> **Important** : si une Policy est enregistrée et qu'on surcharge `canCreate()` dans la Resource, c'est la `surcharge dans la Resource qui prend le dessus`.

## 5. Accès au panel : `FilamentUser`

> **En résumé** : `canAccessPanel()` est une garde-barrière au niveau du panel entier — avant même d'arriver à une Resource. Si elle retourne `false`, l'utilisateur est renvoyé vers le login. Avec plusieurs panels (`admin`, `app`…), `$panel->getId()` permet de différencier les règles d'accès selon le panel concerné.

Pour contrôler qui peut accéder au panel (indépendamment des permissions sur les Resources), le modèle `User` doit implémenter `FilamentUser` :
```PHP
<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements FilamentUser
{
    public function canAccessPanel(Panel $panel): bool
    {
        // Seuls les admins accèdent au panel
        return $this->hasRole('admin');

        // Ou par email domain :
        // return str_ends_with($this->email, '@monentreprise.com');

        // Ou par colonne booléenne :
        // return $this->is_admin === true;
    }
}
```
Si `canAccessPanel()` retourne `false`, l'utilisateur est redirigé vers la page de login (ou une page custom).

### Multi-panels

Avec plusieurs panels, on peut différencier les accès :
```PHP
<?php
public function canAccessPanel(Panel $panel): bool
{
    return match ($panel->getId()) {
        'admin' => $this->hasRole('admin'),
        'app'   => $this->hasRole('client'),
        default => false,
    };
}
```

## 6. Intégration avec Spatie Laravel Permission

> **En résumé** : `spatie/laravel-permission` est le package standard pour gérer rôles et permissions dans Laravel. Il ajoute le trait `HasRoles` sur `User` et donne accès à `$user->hasRole()`, `$user->can()`, `$user->assignRole()`. Dans les Policies Filament, on utilise ces méthodes pour contrôler les accès. Les rôles et permissions se créent dans un Seeder pour être reproductibles.

Le package `spatie/laravel-permission` est la solution la plus répandue pour gérer les rôles/permissions avec Filament.

### Installation
```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

### Sur le modèle User
```PHP
<?php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    use HasRoles;

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasAnyRole(['admin', 'editor']);
    }
}
```

### Dans les Policies avec Spatie
```PHP
<?php
public function create(User $user): bool
{
    return $user->can('create posts'); // vérifie la permission nommée
}

public function update(User $user, Post $post): bool
{
    return $user->hasRole('admin') || $user->can('edit own posts');
}
```

### Créer des rôles et permissions (dans un Seeder)
```PHP
<?php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

// Créer les permissions
Permission::create('view posts');
Permission::create('create posts');
Permission::create('edit posts');
Permission::create('delete posts');

// Créer les rôles avec leurs permissions
Role::create('admin')->givePermissionTo(Permission::all());

Role::create('editor')
    ->givePermissionTo(['view posts', 'create posts', 'edit posts']);

Role::create('viewer')
    ->givePermissionTo(['view posts']);

// Assigner un rôle à un utilisateur
$user->assignRole('admin');
```

## 7. Masquer des éléments de navigation conditionnellement

> **En résumé** : Pour les **Resources**, `canViewAny()` fait déjà le travail : si elle retourne `false`, l'item disparaît du menu. Pour les **pages custom**, il n'y a pas de Policy associée — on surcharge `shouldRegisterNavigation()` pour le même effet. Dans les deux cas, la route reste accessible directement si on connaît l'URL : `shouldRegisterNavigation` ne protège que l'affichage dans le menu.

`canViewAny()` sur une Resource masque automatiquement l'item de navigation si `false`. Pour des pages custom, on surcharge `shouldRegisterNavigation()` :
```PHP
<?php
class SettingsPage extends Page
{
    public static function shouldRegisterNavigation(): bool
    {
        return auth()->user()->hasRole('admin');
    }
}
```

## 8. Autorisation sur les Actions custom

> **En résumé** : Les actions CRUD standards (`EditAction`, `DeleteAction`…) sont automatiquement protégées par la Policy. Pour les actions métier custom, c'est à nous de gérer. `->visible()` masque le bouton dans l'UI (expérience utilisateur), `->authorize()` bloque l'exécution même si quelqu'un accède à l'action directement (sécurité). La bonne pratique est d'utiliser les **deux ensemble** : cacher le bouton ET protéger l'action.

Pour les actions non-CRUD, on passe par `->authorize()` ou `->visible()` :
```PHP
<?php
// Via ->authorize() : lève une exception si non autorisé
Action::make('publish')
    ->authorize(fn (Post $record) => auth()->user()->can('publish', $record))
    ->action(fn (Post $record) => $record->update(['status' => 'published'])),

// Via ->visible() : masque simplement le bouton
Action::make('delete')
    ->visible(fn (Post $record) => auth()->user()->can('delete', $record))
    ->action(fn (Post $record) => $record->delete()),

// Différence :
// ->authorize() → bouton visible mais bloqué si accès direct (sécurité)
// ->visible()   → bouton masqué (UX)
// Bonne pratique : utiliser les deux ensemble
Action::make('approve')
    ->visible(fn ($record) => auth()->user()->can('approve', $record))
    ->authorize(fn ($record) => auth()->user()->can('approve', $record))
    ->action(...),
```

## 9. Super Admin - contourner toutes les vérifications

> **En résumé** : `Gate::before()` est un hook Laravel qui s'exécute **avant** toute vérification de Policy ou de Gate. Si le callback retourne `true`, toutes les vérifications sont court-circuitées et l'accès est accordé. C'est la façon la plus propre de créer un rôle `super_admin` qui bypass tout — sans avoir à ajouter `$user->hasRole('super_admin')` dans chaque méthode de chaque Policy.

Pour donner un accès total à un rôle admin sans définir chaque permission, on utilise le `Gate::before()` dans un Service Provider :
```PHP
<?php
// app/Providers/AuthServiceProvider.php

use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    Gate::before(function (User $user, string $ability) {
        if ($user->hasRole('super_admin')) {
            return true; // court-circuite toutes les vérifications
        }
    });
}
```

## Récapitulatif
```
Niveaux d'autorisation
│
├── 1. canAccessPanel()     → accès au panel entier (sur le modèle User)
│
├── 2. Policy Eloquent      → vérification automatique par Filament
│   ├── viewAny()  → liste
│   ├── view()     → détail
│   ├── create()   → création
│   ├── update()   → édition
│   └── delete()   → suppression
│
├── 3. Overrides Resource   → surcharge locale des can*()
│   ├── canCreate(), canEdit(), canDelete()
│   ├── canViewAny()         → masque la navigation si false
│   └── canDeleteAny()       → désactive la bulk delete
│
├── 4. Actions custom       → ->authorize() + ->visible()
│
└── 5. Super Admin          → Gate::before() court-circuite tout

Gestion des rôles
└── spatie/laravel-permission (HasRoles sur User)
    ├── $user->assignRole('admin')
    ├── $user->hasRole('editor')
    └── $user->can('create posts')
```
