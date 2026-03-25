# Étape 6 — Notifications

## 6.1 Toast lors de la création d'un livre

Filament envoie déjà un toast par défaut après une création/édition réussie. Pour le personnaliser, surcharge `getCreatedNotification()` dans `CreateBook.php` :

```php
// app/Filament/Resources/BookResource/Pages/CreateBook.php

use Filament\Notifications\Notification;

protected function getCreatedNotification(): ?Notification
{
    return Notification::make()
        ->title('Livre ajouté')
        ->body('Le livre a été ajouté à la bibliothèque.')
        ->success();
}
```

> Le toast d'emprunt a déjà été ajouté directement dans l'action "Emprunter" à l'étape 4.

---

## 6.2 Activer les notifications en base de données

Les notifications en base de données persistent et s'affichent via une cloche dans le header du panel.

### Créer la table

```bash
php artisan notifications:table
php artisan migrate
```

### Activer dans le Panel Provider

Dans `app/Providers/Filament/AdminPanelProvider.php` :

```php
->databaseNotifications()
->databaseNotificationsPolling('30s'),  // rafraîchit toutes les 30s
```

### Implémenter `FilamentUser` sur le modèle `User`

Pour que Filament puisse envoyer des notifications à un utilisateur, le modèle doit utiliser la notification Filament :

```php
// app/Models/User.php

use Filament\Models\Contracts\FilamentUser;
use Filament\Notifications\Notification;  // optionnel ici
use Illuminate\Notifications\Notifiable;  // déjà présent par défaut

class User extends Authenticatable implements FilamentUser
{
    use Notifiable;

    // ...
}
```

---

## 6.3 Envoyer une notification en base lors du retour d'un livre

Dans l'action "Retourner" (vue étape 4), ajoute après le toast :

```php
use Filament\Notifications\Notification;
use Filament\Notifications\Actions\Action as NotifAction;
use App\Models\User;

// Envoyer à tous les admins
$admins = User::where('is_admin', true)->get();

Notification::make()
    ->title('Livre retourné')
    ->body("« {$record->title} » est de nouveau disponible.")
    ->icon('heroicon-o-book-open')
    ->color('success')
    ->actions([
        NotifAction::make('voir')
            ->label('Voir le livre')
            ->url(BookResource::getUrl('view', ['record' => $record]))
            ->markAsRead(),
    ])
    ->sendToDatabase($admins);
```

> `->sendToDatabase()` persiste la notification en BDD. La cloche dans le header affichera le compteur de notifications non lues.

---

## 6.4 Vérifier

- Crée un livre → toast de confirmation
- Emprunte un livre → toast de confirmation
- Retourne un livre → toast + notification dans la cloche du header
- Clique sur la cloche : la notification apparait avec le lien vers le livre
