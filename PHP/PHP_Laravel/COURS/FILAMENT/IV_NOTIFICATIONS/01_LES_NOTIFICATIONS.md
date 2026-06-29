# Filament - Les Notifications

Doc officielle : [https://filamentphp.com/docs/3.x/notifications/overview](https://filamentphp.com/docs/3.x/notifications/overview)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Deux types de notifications](#1-quest-ce-que-le-système-de-notifications-filament-) | Flash (toast) éphémère vs Database persistante en BDD. |
| 2 | [Notifications flash (toast)](#2-notifications-flash-toast) | `Notification::make()->success()->send()` : toast immédiat dans le navigateur. |
| 3 | [Envoyer depuis n'importe où](#3-envoyer-une-notification-depuis-nimporte-où) | Depuis une Action, un hook de page, ou un Job avec `sendToDatabase()`. |
| 4 | [Notifications en base de données](#4-notifications-en-base-de-données) | Persistance, cloche dans le panel, envoi à un ou plusieurs utilisateurs. |
| 5 | [Broadcast (temps réel)](#5-broadcast-temps-réel) | Envoyer un toast en temps réel à un autre utilisateur via WebSocket. |
| 6 | [Depuis un composant Livewire custom](#6-notifications-depuis-une-livewire-class-hors-resource) | Trait `InteractsWithNotifications` pour les composants maison. |
| 7 | [Tester les notifications](#7-tester-les-notifications) | `Notification::fake()` + `assertNotified()` dans les tests Pest/PHPUnit. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble types / statuts / options utiles. |

---

## 1. Qu'est-ce que le système de notifications Filament ?

> **En résumé** : Filament distingue deux besoins. Le **toast** (flash) est un message visuel qui apparaît quelques secondes dans le coin de l'écran, utile pour confirmer une action (ex : "Enregistré"). La **notification database** est persistée en BDD et accessible plus tard via une cloche dans le header — utile pour des évènements asynchrones (export terminé, nouveau message…). Les deux utilisent la même API `Notification::make()` mais se délivrent différemment (`->send()` vs `->sendToDatabase()`).

Filament propose deux types de notifications bien distincts :

| Type          | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| Flash (toast)	| Notification visuelle éphémère, affichée immédiatement dans le navigateur |
| Database      | Notification persistée en BDD, accessible via une cloche dans le panel    |

Les deux utilisent la même API Notification::make(), mais avec des méthodes de livraison différentes.

## 2. Notifications flash (toast)

> **En résumé** : C'est le cas le plus courant. On chaîne `Notification::make()` avec un titre, un statut (couleur), et `->send()`. La notification apparaît immédiatement dans le navigateur de l'utilisateur courant et disparait automatiquement après quelques secondes. On peut ajouter un corps de texte, une icône, une durée, et même des boutons d'action cliquables directement dans le toast.

### Usage de base
```PHP
<?php
use Filament\Notifications\Notification;

Notification::make()
    ->title('Enregistrement réussi')
    ->success()
    ->send();
```

### Les statuts / couleurs
```PHP
<?php
Notification::make()
    ->title('Succès !')
    ->success()   // vert
    ->send();

Notification::make()
    ->title('Attention')
    ->warning()   // orange
    ->send();

Notification::make()
    ->title('Erreur')
    ->danger()    // rouge
    ->send();

Notification::make()
    ->title('Info')
    ->info()      // bleu
    ->send();
```

### Options complètes
```PHP
<?php
Notification::make()
    ->title('Commande approuvée')
    ->body('La commande #1234 a été approuvée avec succès.') // texte secondaire
    ->icon('heroicon-o-check-circle')
    ->iconColor('success')
    ->color('success')
    ->duration(5000)            // durée en ms (défaut : 6000)
    ->persistent()              // ne disparaît pas automatiquement
    ->send();
```

### Avec une action cliquable dans le toast
```PHP
<?php
Notification::make()
    ->title('Nouvel utilisateur inscrit')
    ->body('John Doe vient de s\'inscrire.')
    ->actions([
        \Filament\Notifications\Actions\Action::make('voir')
            ->label('Voir le profil')
            ->url(route('filament.admin.resources.users.edit', $user))
            ->button(),

        \Filament\Notifications\Actions\Action::make('ignorer')
            ->label('Ignorer')
            ->close(), // ferme le toast
    ])
    ->send();
```

## 3. Envoyer une notification depuis n'importe où

> **En résumé** : `->send()` fonctionne dans n'importe quel contexte Livewire (Action, hook de page, composant…). Hors contexte Livewire (Job, Command, Controller, Event Listener…), `->send()` ne peut pas fonctionner car il n'y a pas de connexion WebSocket active — on utilise alors `->sendToDatabase()` pour persister la notification, que l'utilisateur verra à sa prochaine connexion.

### Depuis une Action ou un hook de page
```PHP
<?php
// Depuis une Action Filament
Action::make('approve')
    ->action(function (Order $record): void {
        $record->update(['status' => 'approved']);

        Notification::make()
            ->title('Commande approuvée')
            ->success()
            ->send();
    }),

// Depuis afterCreate() dans une page
protected function afterCreate(): void
{
    Notification::make()
        ->title('Membre créé')
        ->success()
        ->send();
}
```

### Depuis un Job ou un Service (hors contexte Livewire)

Quand on est hors d'un composant Livewire (dans un Job, un Controller...), on utilise `sendToDatabase()` ou on envoie vers un utilisateur spécifique :
```PHP
<?php
// Envoyer à un utilisateur précis (stocké en BDD)
Notification::make()
    ->title('Votre export est prêt')
    ->success()
    ->sendToDatabase($user); // $user est un modèle User
```

## 4. Notifications en base de données

> **En résumé** : La notification database nécessite une table dédiée (migration Laravel standard `notifications`). Filament ajoute ensuite une icone cloche dans le header du panel qui affiche les notifications non lues. L'envoi se fait avec `->sendToDatabase($user)` — on peut passer un User unique ou une Collection d'utilisateurs. Filament gère automatiquement l'interface "marquer comme lu" dans la cloche.

### Prérequis : migration
```bash
php artisan notifications:table
php artisan migrate
```
Le modèle `User` doit utiliser le trait `Notifiable` (Laravel standard) et `HasDatabaseNotifications` de Filament :
```PHP
<?php
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    use Notifiable; // trait standard Laravel - suffit pour Filament
}
```

### Activer la cloche dans le Panel
```PHP
<?php
// app/Providers/Filament/AdminPanelProvider.php

use Filament\Http\Middleware\Authenticate;
use Filament\Notifications\Livewire\DatabaseNotifications;

->plugins([...])
->databaseNotifications()           // active la cloche dans le header
->databaseNotificationsPolling('30s') // polling pour check auto (optionnel)
```

### Envoyer une notification en BDD
```PHP
<?php
// Envoyer à l'utilisateur connecté
Notification::make()
    ->title('Rapport généré')
    ->body('Votre rapport mensuel est disponible.')
    ->actions([
        \Filament\Notifications\Actions\Action::make('télécharger')
            ->url('/reports/monthly.pdf')
            ->button(),
    ])
    ->sendToDatabase(auth()->user());

// Envoyer à plusieurs utilisateurs
Notification::make()
    ->title('Maintenance prévue')
    ->warning()
    ->sendToDatabase(User::all());
```

### Marquer comme lue

Filament gère l'interface "marquer comme lu" automatiquement via la cloche. En code :
```PHP
<?php
// Marquer toutes les notifs d'un user comme lues
auth()->user()->unreadNotifications->markAsRead();

// Ou une seule
$notification->markAsRead();
```

## 5. Broadcast (temps réel)

> **En résumé** : `->broadcast($user)` envoie un toast visible en temps réel dans le navigateur d'un **autre utilisateur** (pas l'utilisateur courant). Cela passe par Laravel Echo + un driver WebSocket (Pusher, Reverb, Ably…). C'est utile pour des notifications push : un admin approuve une commande et le client voit immédiatement un toast. Sans configuration broadcast, cette méthode ne fonctionnera pas.

Pour envoyer une notification toast en temps réel à un autre utilisateur (via WebSocket/Pusher/Reverb) :
```PHP
<?php
Notification::make()
    ->title('Nouveau message reçu')
    ->info()
    ->broadcast($targetUser); // envoie via broadcast channel
```
Le panel doit être configuré avec Laravel Echo et un driver broadcast (Pusher, Reverb...).

## 6. Notifications depuis une Livewire class (hors Resource)

> **En résumé** : Dans un composant Livewire qu'on a créé soi-même (hors Resource Filament), `Notification::make()->send()` fonctionne directement sans trait supplémentaire. Le trait `InteractsWithNotifications` expose en plus une méthode `$this->notify()` raccourcie. Si on préfère la syntaxe complète, `Notification::make()->send()` marche également dans ce contexte.

Dans un composant Livewire custom, on utilise le trait `InteractsWithNotifications` :
```PHP
<?php
use Filament\Notifications\Concerns\InteractsWithNotifications;

class MyLivewireComponent extends Component
{
    use InteractsWithNotifications;

    public function save(): void
    {
        // ... logique

        $this->notify( // méthode simplifiée
            'success',
            'Sauvegardé avec succès'
        );

        // Ou la syntaxe complète :
        Notification::make()
            ->title('Sauvegardé')
            ->success()
            ->send();
    }
}
```

## 7. Tester les notifications

> **En résumé** : `Notification::fake()` intercepte les notifications sans les envoyer réellement. `Notification::assertNotified()` vérifie qu'une notification avec un titre et un statut donnés a bien été déclenchée. C'est l'équivalent de `Mail::fake()` ou `Queue::fake()` dans Laravel. On peut aussi utiliser `assertNothingNotified()` pour vérifier qu'aucune notification n'a été envoyée.

```PHP
<?php
use Filament\Notifications\Notification;

// Dans un test Pest/PHPUnit
it('sends a success notification after approval', function () {
    Notification::fake();

    $order = Order::factory()->create();

    livewire(EditOrder::class, ['record' => $order])
        ->callAction('approve');

    Notification::assertNotified(
        Notification::make()
            ->title('Commande approuvée')
            ->success()
    );
});
```

## Récapitulatif
```
Types
├── Flash (toast)    → ->send()             visible immédiatement dans le navigateur
├── Database         → ->sendToDatabase()   persisté, accessible via la cloche
└── Broadcast        → ->broadcast()        temps réel vers un autre utilisateur

Statuts
├── ->success()   vert
├── ->warning()   orange
├── ->danger()    rouge
└── ->info()      bleu

Configuration database
├── php artisan notifications:table + migrate
├── ->databaseNotifications() dans le Panel Provider
└── Trait Notifiable sur le modèle User

Options utiles
├── ->body()         texte secondaire
├── ->persistent()   ne disparaît pas automatiquement
├── ->duration()     durée en ms
├── ->actions([])    boutons cliquables dans le toast
└── ->icon()         icône Heroicon
```
