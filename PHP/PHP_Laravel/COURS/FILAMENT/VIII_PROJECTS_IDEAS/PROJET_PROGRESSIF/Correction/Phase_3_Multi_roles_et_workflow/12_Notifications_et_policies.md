# Phase 3 — Étape 12 : Notifications et Policies

> Référence cours : `IV_NOTIFICATIONS/01_LES_NOTIFICATIONS.md`

## 12.1 Notifications DB dans le workflow

Les notifications sont envoyées dans les actions de l'étape 10. On les complète ici avec `sendToDatabase()` pour qu'elles persistent et apparaissent dans la cloche.

---

### Notification à la soumission → reviewers

Dans l'action `submit_for_review` (étape 10), après `$record->update(...)` :

```php
use App\Models\User;
use Filament\Notifications\Notification;

$reviewers = User::role(['reviewer', 'super-admin'])->get();

Notification::make()
    ->title('Nouveau post soumis pour relecture')
    ->body("« {$record->title} » attend votre validation.")
    ->icon('heroicon-o-document-check')
    ->iconColor('warning')
    ->actions([
        \Filament\Notifications\Actions\Action::make('Voir le post')
            ->url(PostResource::getUrl('edit', ['record' => $record]))
            ->markAsRead(),
    ])
    ->sendToDatabase($reviewers);
```

---

### Notification à l'approbation → auteur

Dans l'action `approve` (étape 10), après `$record->update(...)` :

```php
Notification::make()
    ->title('Votre post a été approuvé !')
    ->body("« {$record->title} » est maintenant publié.")
    ->icon('heroicon-o-check-circle')
    ->iconColor('success')
    ->sendToDatabase($record->author);
```

---

### Notification au rejet → auteur

Dans l'action `reject` (étape 10), après `$record->update(...)` :

```php
Notification::make()
    ->title('Votre post a été rejeté')
    ->body("« {$record->title} » : {$data['rejection_comment']}")
    ->icon('heroicon-o-x-circle')
    ->iconColor('danger')
    ->sendToDatabase($record->author);
```

---

## 12.2 Activer les notifications DB dans le panel CMS

Dans `CmsPanelProvider.php` (déjà fait à l'étape 9) :

```php
->databaseNotifications()
->databaseNotificationsPolling('30s')
```

> La cloche de notifications apparaît automatiquement dans le header du panel. `->databaseNotificationsPolling('30s')` rafraîchit toutes les 30 secondes via polling Livewire.

---

## 12.3 Créer la `PostPolicy`

```bash
php artisan make:policy PostPolicy --model=Post
```

Dans `app/Policies/PostPolicy.php` :

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['editor', 'reviewer', 'super-admin']);
    }

    public function view(User $user, Post $post): bool
    {
        // Les reviewers voient tous les posts en relecture
        if ($user->hasRole('reviewer')) {
            return $post->status === 'review' || $post->author_id === $user->id;
        }
        // Les editors voient uniquement leurs propres posts
        if ($user->hasRole('editor')) {
            return $post->author_id === $user->id;
        }
        return $user->hasRole('super-admin');
    }

    public function create(User $user): bool
    {
        return $user->hasAnyRole(['editor', 'super-admin']);
    }

    public function update(User $user, Post $post): bool
    {
        // Un editor ne peut modifier que ses propres posts en brouillon
        if ($user->hasRole('editor')) {
            return $post->author_id === $user->id && $post->status === 'draft';
        }
        return $user->hasRole('super-admin');
    }

    public function delete(User $user, Post $post): bool
    {
        if ($user->hasRole('editor')) {
            return $post->author_id === $user->id && $post->status === 'draft';
        }
        return $user->hasRole('super-admin');
    }
}
```

Enregistre la Policy dans `app/Providers/AuthServiceProvider.php` (Laravel 10) ou `AppServiceProvider.php` (Laravel 11+) :

```php
// Laravel 11 : dans AppServiceProvider::boot()
use App\Models\Post;
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;

Gate::policy(Post::class, PostPolicy::class);
```

---

## 12.4 Appliquer la Policy dans `PostResource`

Filament v3 résout automatiquement les Policies si elles sont enregistrées. Pour vérifier ou forcer :

```php
// Dans PostResource, limitez la query aux posts visibles par l'utilisateur connecté
public static function getEloquentQuery(): Builder
{
    $query = parent::getEloquentQuery();

    // Les editors ne voient que leurs propres posts
    if (auth()->user()->hasRole('editor')) {
        $query->where('author_id', auth()->id());
    }

    return $query;
}
```

---

## 12.5 Résultat final de la Phase 3

À ce stade, l'application est un **CMS complet** avec :
- ✅ Deux panels distincts (`/admin` et `/cms`) routés par rôle
- ✅ Workflow complet : brouillon → relecture → publié / rejeté → archivé
- ✅ Notifications DB à chaque étape du workflow
- ✅ Versioning automatique du contenu via Observer
- ✅ Page "Historique" avec restauration de révision
- ✅ Policy limitant les editors à leurs propres articles

---

## 12.6 Vérifier

- Editor crée et soumet un post → les reviewers reçoivent une notification dans la cloche
- Reviewer approuve → l'editor reçoit une notif "Votre post est publié"
- Reviewer rejette avec commentaire → l'editor voit le commentaire dans son formulaire et reçoit une notif
- Editor essaie de modifier un post en review → bouton Edit désactivé (Policy)
- La cloche se met à jour toutes les 30 secondes
