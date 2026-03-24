# Filament - Pages Custom

Doc officielle : [https://filamentphp.com/docs/3.x/panels/pages](https://filamentphp.com/docs/3.x/panels/pages)

## 1. Qu'est-ce qu'une page custom ?

Une page custom est une page Filament **sans Resource associée**. Elle permet de construire n'importe quelle interface : tableau de bord métier, formulaire de configuration, rapport, outil interne...

Elle se distingue des pages de Resource (`ListRecords`, `EditRecord`...) qui sont liées à un modèle Eloquent.

## 2. Créer une page custom
```bash
php artisan make:filament-page Reports
```
Génère `app/Filament/Pages/Reports.php` et la vue `resources/views/filament/pages/reports.blade.php`.
```PHP
<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;

class Reports extends Page
{
    protected static ?string $navigationIcon  = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Rapports';
    protected static ?string $navigationGroup = 'Analytics';
    protected static ?int    $navigationSort  = 3;
    protected static ?string $title           = 'Rapports mensuels';

    protected static string $view = 'filament.pages.reports';
}
```

## 3. La vue Blade
```PHP
{{-- resources/views/filament/pages/reports.blade.php --}}
<x-filament-panels::page>

    {{-- Contenu libre --}}
    <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
            <h2 class="text-lg font-semibold">Chiffre d'affaires</h2>
            <p class="text-3xl font-bold text-primary-600">{{ $this->revenue }}</p>
        </div>
    </div>

</x-filament-panels::page>
```
La balise `<x-filament-panels::page>` applique le layout standard du panel (header, navigation...).

## 4. Passer des données à la vue

Les propriétés publiques de la classe sont directement accessibles dans la vue via `$this->` (Livewire) ou en les déclarant comme `getViewData()` :
```PHP
<?php
class Reports extends Page
{
    protected static string $view = 'filament.pages.reports';

    // Propriété publique Livewire → accessible dans la vue
    public string $period = 'monthly';

    // Ou via getViewData() pour des données calculées
    protected function getViewData(): array
    {
        return [
            'revenue'     => Order::sum('total') / 100,
            'orderCount'  => Order::count(),
            'topProducts' => Product::withCount('orders')->orderByDesc('orders_count')->limit(5)->get(),
        ];
    }
}
```

```PHP
<x-filament-panels::page>
    <p>Revenus : {{ $revenue }}</p>
    <p>Commandes : {{ $orderCount }}</p>
</x-filament-panels::page>
```

## 5. Page custom avec un formulaire

On intègre un formulaire Filament (sans modèle Eloquent) grâce au trait `InteractsWithForms` :
```PHP
<?php

namespace App\Filament\Pages;

use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class GeneralSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?string $title          = 'Paramètres généraux';
    protected static string  $view           = 'filament.pages.general-settings';

    // État du formulaire - propriété publique Livewire
    public ?array $data = [];

    public function mount(): void
    {
        // Pré-remplir le formulaire au chargement
        $this->form->fill([
            'site_name'    => config('app.name'),
            'maintenance'  => cache('maintenance_mode', false),
            'contact_email'=> config('mail.from.address'),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('site_name')
                    ->label('Nom du site')
                    ->required(),
                TextInput::make('contact_email')
                    ->label('Email de contact')
                    ->email()
                    ->required(),
                Toggle::make('maintenance')
                    ->label('Mode maintenance'),
            ])
            ->statePath('data'); // lie le formulaire à $this->data
    }

    public function save(): void
    {
        $data = $this->form->getState(); // récupère les données validées

        // Logique de sauvegarde (settings, cache, fichier .env...)
        cache(['maintenance_mode' => $data['maintenance']], now()->addYear());

        Notification::make()
            ->title('Paramètres sauvegardés')
            ->success()
            ->send();
    }
}
```

```PHP
{{-- resources/views/filament/pages/general-settings.blade.php --}}
<x-filament-panels::page>
    <x-filament::section>
        <form wire:submit="save">
            {{ $this->form }}

            <div class="mt-4 flex justify-end">
                <x-filament::button type="submit">
                    Sauvegarder
                </x-filament::button>
            </div>
        </form>
    </x-filament::section>
</x-filament-panels::page>
```

## 6. `SettingsPage` - raccourci pour les settings

Pour les pages de configuration qui lisent/écrivent dans une classe settings (typiquement via `spatie/laravel-settings`), Filament propose `SettingsPage` qui se charge du fill et du save automatiquement :
```PHP
<?php
use Filament\Pages\SettingsPage;
use App\Settings\GeneralSettings;

class ManageGeneralSettings extends SettingsPage
{
    protected static string $settings = GeneralSettings::class;

    public function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('site_name')->required(),
            Toggle::make('maintenance'),
        ]);
    }
}
```
> Pas besoin de `mount()`, `save()`, ni `statePath()` - tout est géré par `SettingsPage`.

## . Page custom avec une table

Pour intégrer une table Filament dans une page custom (sans Resource), on utilise `InteractsWithTable` :
```PHP
<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use App\Models\Log;

class ActivityLog extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';
    protected static string  $view           = 'filament.pages.activity-log';

    public function table(Table $table): Table
    {
        return $table
            ->query(Log::query()->latest())
            ->columns([
                TextColumn::make('user.name')->label('Utilisateur'),
                TextColumn::make('action')->badge(),
                TextColumn::make('description'),
                TextColumn::make('created_at')->dateTime('d/m/Y H:i')->label('Date'),
            ])
            ->filters([
                //...
            ])
            ->paginated([10, 25, 50]);
    }
}
```

```PHP
<x-filament-panels::page>
    {{ $this->table }}
</x-filament-panels::page>
```

## 8. Combiner formulaire + table + widgets

Une page custom peut combiner les trois en implémentant plusieurs interfaces :
```PHP
<?php
class Dashboard extends Page implements HasForms, HasTable, HasWidgets
{
    use InteractsWithForms;
    use InteractsWithTable;
    use InteractsWithWidgets;

    protected function getHeaderWidgets(): array
    {
        return [
            StatsOverview::class,
            RevenueChart::class,
        ];
    }

    public function table(Table $table): Table { ... }

    public function form(Form $form): Form { ... }
}
```

## 9. Actions dans le header de page

Comme sur les pages de Resource, on peut ajouter des boutons dans l'en-tête :
```PHP
<?php
use Filament\Actions\Action;

protected function getHeaderActions(): array
{
    return [
        Action::make('export')
            ->label('Exporter')
            ->icon('heroicon-o-arrow-down-tray')
            ->action(fn () => $this->exportData()),

        Action::make('refresh')
            ->label('Actualiser')
            ->icon('heroicon-o-arrow-path')
            ->action(fn () => $this->dispatch('$refresh')),
    ];
}
```

## 10. Cycle de vie d'une page custom
```
URL chargée
    ↓
mount()                  ← initialisation (fill du form, récup de données...)
    ↓
render() / vue Blade     ← affichage
    ↓
[Interaction utilisateur via Livewire]
    ↓
méthodes publiques       ← save(), delete(), ou toute méthode appelée par wire:click / wire:submit
    ↓
re-render automatique
```

### `mount()` - initialisation
```PHP
<?php
public function mount(): void
{
    // Vérifier les permissions à l'entrée de la page
    abort_unless(auth()->user()->hasRole('admin'), 403);

    // Charger des données initiales
    $this->form->fill($this->loadSettings());
}
```

### Paramètres d'URL
```PHP
<?php
class UserProfile extends Page
{
    // Paramètre d'URL : /admin/user-profile/{userId}
    public function mount(int $userId): void
    {
        $this->user = User::findOrFail($userId);
        $this->form->fill($this->user->toArray());
    }

    protected static function getRoutePath(): string
    {
        return 'user-profile/{userId}';
    }
}
```

## Récapitulatif
```
Page custom (make:filament-page)
│
├── Propriétés de navigation
│   ├── $navigationIcon, $navigationLabel
│   ├── $navigationGroup, $navigationSort
│   └── shouldRegisterNavigation() → masquer conditionnellement
│
├── Données
│   ├── Propriétés publiques      → accessibles dans la vue via $this->
│   └── getViewData(): array      → données calculées passées à la vue
│
├── Formulaire → implements HasForms + use InteractsWithForms
│   ├── form(Form $form): Form    → définit le schéma
│   ├── mount()                   → fill initial
│   ├── ->statePath('data')       → lie le form à $this->data
│   └── save()                    → traitement du submit
│
├── Raccourci settings → extends SettingsPage
│   └── fill/save automatiques depuis une classe Settings
│
├── Table → implements HasTable + use InteractsWithTable
│   └── table(Table $table): Table
│
├── Actions header
│   └── getHeaderActions(): array
│
└── Cycle de vie
    ├── mount()     → initialisation
    └── méthodes publiques → appelées par wire:submit / wire:click
```
