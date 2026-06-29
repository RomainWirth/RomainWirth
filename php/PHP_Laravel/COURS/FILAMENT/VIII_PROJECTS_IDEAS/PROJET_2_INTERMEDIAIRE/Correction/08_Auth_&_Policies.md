# Étape 8 — Auth & Policies

## 8.1 Ajouter un champ `is_admin` au modèle `User`

Crée une migration :

```bash
php artisan make:migration add_is_admin_to_users_table
```

```php
// Dans la migration
$table->boolean('is_admin')->default(false);
```

```bash
php artisan migrate
```

Ajoute `is_admin` au `$fillable` du modèle `User` :

```php
protected $fillable = ['name', 'email', 'password', 'is_admin'];

protected $casts = ['is_admin' => 'boolean'];
```

---

## 8.2 Contrôler l'accès au panel

Seuls les admins peuvent accéder au panel `/admin`. Implémente l'interface `FilamentUser` sur le modèle `User` :

```php
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin === true;
    }
}
```

> Tout utilisateur non admin sera redirigé vers la page de login avec un message d'erreur.

---

## 8.3 Créer la Policy pour `Book`

```bash
php artisan make:policy BookPolicy --model=Book
```

Dans `app/Policies/BookPolicy.php` :

```php
namespace App\Policies;

use App\Models\Book;
use App\Models\User;

class BookPolicy
{
    // Tout le monde peut voir la liste
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Tout le monde peut voir un livre
    public function view(User $user, Book $book): bool
    {
        return true;
    }

    // Seul l'admin peut créer
    public function create(User $user): bool
    {
        return $user->is_admin;
    }

    // Seul l'admin peut modifier
    public function update(User $user, Book $book): bool
    {
        return $user->is_admin;
    }

    // Seul l'admin peut supprimer
    public function delete(User $user, Book $book): bool
    {
        return $user->is_admin;
    }
}
```

Laravel détecte automatiquement `BookPolicy` pour le modèle `Book` (convention `{Model}Policy`). Aucun enregistrement manuel nécessaire.

> **Effet immédiat dans l'UI** : le bouton "Nouveau livre", les boutons "Modifier" et "Supprimer" disparaissent pour les utilisateurs non admin. Filament consulte la Policy silencieusement.

---

## 8.4 Autoriser l'action "Emprunter" pour tous

L'action "Emprunter" est une action métier custom — elle n'est pas liée à une méthode de Policy standard. Elle reste visible pour tous les utilisateurs connectés (la Policy ne la bloque pas). Si tu veux la restreindre à certains rôles, utilise `->visible()` ou `->authorize()` directement sur l'action :

```php
// Exemple : visible uniquement pour les non-admins
Action::make('borrow')
    ->visible(fn (Book $record) => $record->is_available && ! auth()->user()->is_admin)
    // ...
```

---

## 8.5 Créer un deuxième utilisateur non-admin (pour tester)

Dans `php artisan tinker` :

```php
App\Models\User::create([
    'name'     => 'Utilisateur Lambda',
    'email'    => 'user@example.com',
    'password' => bcrypt('password'),
    'is_admin' => false,
]);
```

---

## 8.6 Vérifier

- Connexion avec l'admin : accès complet, boutons Créer/Modifier/Supprimer visibles
- Connexion avec un non-admin : redirigé vers login (accès panel refusé)
- Librairie là pour la page Catalogue public (sans panel) : voir étape 9
