# Étape 8 — Panel client (`/app`)

> Référence cours : `VII_PANELS/03_PAGES_CUSTOM.md` + `IV_NOTIFICATIONS/01_LES_NOTIFICATIONS.md`

---

## 8.1 Configurer `AppPanelProvider`

Dans `app/Providers/Filament/AppPanelProvider.php`, configure le panel client avec une couleur différente, ses propres chemins et les notifications :

```php
<?php

namespace App\Providers\Filament;

use App\Models\User;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AppPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('app')
            ->path('app')
            ->login()
            ->colors(['primary' => Color::Teal])
            ->discoverResources(
                in: app_path('Filament/App/Resources'),
                for: 'App\\Filament\\App\\Resources'
            )
            ->discoverPages(
                in: app_path('Filament/App/Pages'),
                for: 'App\\Filament\\App\\Pages'
            )
            ->pages([Pages\Dashboard::class])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([Authenticate::class])
            ->databaseNotifications()           // Cloche de notifications en haut
            ->databaseNotificationsPolling('30s'); // Rafraîchissement toutes les 30s
    }
}
```

> L'accès est déjà filtré par `canAccessPanel()` dans le modèle `User` (étape 1) : seuls les utilisateurs avec le rôle `client` accèdent à ce panel.

---

## 8.2 Créer les dossiers du panel client

```bash
mkdir -p app/Filament/App/Pages
mkdir -p app/Filament/App/Resources
```

---

## 8.3 Page "Nouveau Ticket"

```bash
php artisan make:filament-page CreateTicket --panel=app
```

Fichier : `app/Filament/App/Pages/CreateTicket.php`

```php
<?php

namespace App\Filament\App\Pages;

use App\Models\Ticket;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class CreateTicket extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-plus-circle';
    protected static string $view = 'filament.app.pages.create-ticket';
    protected static ?string $navigationLabel = 'Nouveau ticket';
    protected static ?string $title = 'Ouvrir un nouveau ticket';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill();
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('subject')
                    ->label('Sujet')
                    ->required()
                    ->maxLength(255),

                Select::make('department_id')
                    ->label('Département')
                    ->relationship('department', 'name')
                    ->required(),

                Select::make('priority')
                    ->label('Priorité')
                    ->options([
                        'low'    => 'Faible',
                        'medium' => 'Moyenne',
                        'high'   => 'Haute',
                    ])
                    ->default('medium')
                    ->required(),

                Textarea::make('description')
                    ->label('Description du problème')
                    ->required()
                    ->rows(5)
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    public function submit(): void
    {
        $data = $this->form->getState();

        $ticket = Ticket::create([
            'subject'       => $data['subject'],
            'department_id' => $data['department_id'],
            'priority'      => $data['priority'],
            'client_id'     => auth()->id(),
            'status'        => 'open',
        ]);

        // Premier message = description initiale
        $ticket->messages()->create([
            'user_id'     => auth()->id(),
            'content'     => [[
                'type' => 'paragraph',
                'data' => ['text' => $data['description']],
            ]],
            'is_internal' => false,
        ]);

        Notification::make()
            ->title('Ticket créé avec succès')
            ->success()
            ->body("Votre ticket #{$ticket->id} a bien été enregistré.")
            ->send();

        $this->form->fill();
    }
}
```

Vue Blade (`resources/views/filament/app/pages/create-ticket.blade.php`) :

```blade
<x-filament-panels::page>
    <form wire:submit="submit">
        {{ $this->form }}

        <div class="mt-4">
            <x-filament::button type="submit">
                Envoyer le ticket
            </x-filament::button>
        </div>
    </form>

    <x-filament-actions::modals />
</x-filament-panels::page>
```

---

## 8.4 Page "Mes Tickets"

```bash
php artisan make:filament-page MyTickets --panel=app
```

Fichier : `app/Filament/App/Pages/MyTickets.php`

```php
<?php

namespace App\Filament\App\Pages;

use App\Models\Ticket;
use Filament\Pages\Page;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MyTickets extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static string $view = 'filament.app.pages.my-tickets';
    protected static ?string $navigationLabel = 'Mes tickets';
    protected static ?string $title = 'Mes tickets';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Ticket::query()
                    ->where('client_id', auth()->id())
                    ->withCount('messages')
            )
            ->columns([
                TextColumn::make('id')
                    ->label('#')
                    ->sortable(),

                TextColumn::make('subject')
                    ->label('Sujet')
                    ->searchable(),

                BadgeColumn::make('status')
                    ->label('Statut')
                    ->colors([
                        'secondary' => 'open',
                        'primary'   => 'in_progress',
                        'success'   => 'resolved',
                        'danger'    => 'closed',
                    ])
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'open'        => 'Ouvert',
                        'in_progress' => 'En cours',
                        'resolved'    => 'Résolu',
                        'closed'      => 'Fermé',
                        default       => $state,
                    }),

                BadgeColumn::make('priority')
                    ->label('Priorité')
                    ->colors([
                        'secondary' => 'low',
                        'warning'   => 'medium',
                        'danger'    => fn ($state) => in_array($state, ['high', 'critical']),
                    ]),

                TextColumn::make('messages_count')
                    ->label('Réponses')
                    ->counts('messages'),

                TextColumn::make('created_at')
                    ->label('Créé le')
                    ->dateTime('d/m/Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
```

Vue Blade (`resources/views/filament/app/pages/my-tickets.blade.php`) :

```blade
<x-filament-panels::page>
    {{ $this->table }}
</x-filament-panels::page>
```

---

## 8.5 Notifier le client quand un agent répond

Dans le contrôleur de création de message (ou dans un Observer), envoie une notification au client :

```php
// Dans MessagesRelationManager, après la création d'un message non-interne
// Utilise le hook afterCreate() ou un Observer sur le modèle Message

// Observer : app/Observers/MessageObserver.php
<?php

namespace App\Observers;

use App\Models\Message;
use Filament\Notifications\Notification;

class MessageObserver
{
    public function created(Message $message): void
    {
        // Notifier le client uniquement si c'est une réponse d'un agent
        $ticket = $message->ticket;

        if (
            $message->user_id !== $ticket->client_id
            && ! $message->is_internal
        ) {
            Notification::make()
                ->title("Nouvelle réponse sur votre ticket #{$ticket->id}")
                ->body("Un agent a répondu à votre ticket : « {$ticket->subject} »")
                ->icon('heroicon-o-chat-bubble-left-right')
                ->iconColor('info')
                ->sendToDatabase($ticket->client);
        }
    }
}
```

Enregistre l'Observer dans `AppServiceProvider` :

```php
use App\Models\Message;
use App\Observers\MessageObserver;

public function boot(): void
{
    Message::observe(MessageObserver::class);
}
```

---

## 8.6 Vérifier

- Accède à `/app` en tant que client → dashboard avec navigation **Nouveau ticket** et **Mes tickets**
- Crée un ticket → le ticket apparaît immédiatement dans **Mes tickets**
- Connecte-toi en tant qu'agent sur `/admin` → réponds au ticket
- Reviens sur `/app` en tant que client → la cloche de notification affiche la réponse de l'agent
- Les tickets d'autres clients ne sont pas visibles
