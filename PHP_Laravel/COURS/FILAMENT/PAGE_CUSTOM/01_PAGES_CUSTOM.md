# Filament - Pages Custom

Doc officielle : [https://filamentphp.com/docs/3.x/panels/pages](https://filamentphp.com/docs/3.x/panels/pages)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Qu'est-ce qu'une page custom ?](#1-quest-ce-quune-page-custom-) | Page Filament libre, sans Resource ni modèle Eloquent associé. |
| 2 | [Créer une page custom](#2-créer-une-page-custom) | `make:filament-page` génère la classe et la vue Blade. |
| 3 | [La vue Blade](#3-la-vue-blade) | Wrapper `<x-filament-panels::page>` pour le layout standard du panel. |
| 4 | [Passer des données à la vue](#4-passer-des-données-à-la-vue) | Propriétés publiques Livewire ou `getViewData()` pour les calculs. |
| 5 | [Page avec un formulaire](#5-page-custom-avec-un-formulaire) | `InteractsWithForms` + `statePath('data')` pour un form sans Resource. |
| 6 | [SettingsPage](#6-settingspage---raccourci-pour-les-settings) | Raccourci qui gère fill/save automatiquement depuis une classe Settings. |
| 7 | [Page avec une table](#7-page-custom-avec-une-table) | `InteractsWithTable` pour embarquer une table Filament dans une page libre. |
| 8 | [Combiner form + table + widgets](#8-combiner-formulaire--table--widgets) | Implémenter plusieurs interfaces sur la même page. |
| 9 | [Actions dans le header](#9-actions-dans-le-header-de-page) | Boutons d'action dans l'en-tête via `getHeaderActions()`. |
| 10 | [Cycle de vie](#10-cycle-de-vie-dune-page-custom) | `mount()` pour l'initialisation, puis méthodes publiques pour les interactions. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble navigation, données, form, table, actions, cycle de vie. |

---

## 1. Qu'est-ce qu'une page custom ?

> **En résumé** : Une page custom est la brique la plus libre de Filament : aucun modèle Eloquent imposé, aucun CRUD pré-généré. On part d'une classe vide qui étend `Page` et on y met exactement ce dont on a besoin — un formulaire de configuration, un rapport, un tableau de bord métier, un outil interne. La navigation, le layout et les actions de header fonctionnent exactement comme sur les pages de Resource.

Une page custom est une page Filament **sans Resource associée**. Elle permet de construire n'importe quelle interface : tableau de bord métier, formulaire de configuration, rapport, outil interne...

Elle se distingue des pages de Resource (`ListRecords`, `EditRecord`...) qui sont liées à un modèle Eloquent.

## 2. Créer une page custom

> **En résumé** : `make:filament-page` génère deux fichiers : la classe PHP dans `app/Filament/Pages/` et la vue Blade associée. Les propriétés statiques `$navigationIcon`, `$navigationLabel`, `$navigationGroup` et `$navigationSort` contrôlent où la page apparaît dans le menu. `$view` pointe vers le template Blade à utiliser pour le rendu.

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

> **En résumé** : La vue Blade d'une page custom est un fichier classique, mais wrapé dans `<x-filament-panels::page>` pour bénéficier du layout complet (header, navigation, fil d'Ariane…). À l'intérieur, c'est du HTML/Tailwind libre. Les propriétés Livewire sont accessibles via `$this->` dans la vue.

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

> **En résumé** : Il y a deux façons. Les **propriétés publiques** Livewire (`public string $period`) sont réactives : si elles changent, Livewire re-rend automatiquement la vue. `getViewData()` est plutôt pour des **données calculées au rendu** (requêtes Eloquent lourdes) qui n'ont pas besoin d'être réactives — les variables retourées sont injectées dans la vue comme des variables Blade classiques.

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

> **En résumé** : Pour embarquer un formulaire Filament dans une page custom, on implémente l'interface `HasForms` et on utilise le trait `InteractsWithForms`. `->statePath('data')` lie le formulaire à la propriété publique `$data` — Livewire synchronise automatiquement les valeurs. `mount()` réalise le fill initial. La méthode `save()` est appelée par `wire:submit` dans la vue et récupère les données validées via `$this->form->getState()`.

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

> **En résumé** : Quand une page de configuration lit et écrit dans une classe de settings (traitée par `spatie/laravel-settings` ou similaire), `SettingsPage` élimine tout le boilerplate : plus de `mount()`, plus de `save()`, plus de `statePath()`. Il suffit de définir `$settings = MySettings::class` et Filament s'occupe de tout. À n'utiliser que quand on a une classe de settings dédiée — sinon, la page custom manuelle (section 5) est plus flexible.

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

## 7. Page custom avec une table

> **En résumé** : Pour embarquer une table Filament complète dans une page custom (colonnes, filtres, actions, pagination…), on implémente `HasTable` et on utilise le trait `InteractsWithTable`. La différence avec un `TableWidget` : ici la table occupe toute la page, pas juste un bloc. On passe la query directement dans `->query()`, sans dépendre d'une Resource. Dans la vue, `{{ $this->table }}` réalise le rendu complet.

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

> **En résumé** : Une page custom peut implémenter plusieurs interfaces simultanément (`HasForms`, `HasTable`, `HasWidgets`) et utiliser les traits correspondants. C'est le modèle du dashboard custom : widgets en en-tête pour les chiffres clés, table pour les derniers événements, formulaire de filtrage. Chaque interface ajoute ses propres méthodes de configuration.

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

> **En résumé** : `getHeaderActions()` fonctionne exactement comme sur les pages de Resource : on retourne un tableau d'`Action`. Les actions peuvent appeler des méthodes de la classe (`fn () => $this->exportData()`), ouvrir des modales, ou dispatcher des événements Livewire. C'est le bon endroit pour les boutons globaux de la page (export, actualisation, création…).

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

> **En résumé** : Le cycle de vie est celui de Livewire. `mount()` est appelé une seule fois à l'arrivée sur la page : on y fait le fill du formulaire, les vérifications de permissions (`abort_unless`), ou le chargement de données initiales. Ensuite toute interaction (submit, clic) appelle des **méthodes publiques** de la classe via `wire:submit` ou `wire:click`, ce qui déclenche un re-render Livewire automatique. Les paramètres d'URL sont injectés en argument de `mount()`.

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
