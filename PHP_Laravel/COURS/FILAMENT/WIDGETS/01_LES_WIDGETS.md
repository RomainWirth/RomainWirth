# Filament - Les Widgets

Doc officielle : [https://filamentphp.com/docs/3.x/widgets/overview](https://filamentphp.com/docs/3.x/widgets/overview)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Qu'est-ce qu'un Widget ?](#1-quest-ce-quun-widget-) | Trois types natifs : `StatsOverviewWidget`, `ChartWidget`, `TableWidget`. |
| 2 | [Création d'un widget](#2-création-dun-widget) | `make:filament-widget` génère la classe avec le flag du type voulu. |
| 3 | [StatsOverviewWidget](#3-statsoverviewwidget---cartes-de-statistiques) | Cartes de chiffres avec description, couleur et mini-sparkline. |
| 4 | [ChartWidget](#4-chartwidget---graphiques) | Graphiques Chart.js avec filtres temporels intégrés. |
| 5 | [TableWidget](#5-tablewidget---table-intégrée) | Table Filament complète embarquée dans un widget. |
| 6 | [Enregistrer les widgets](#6-enregistrer-les-widgets) | Dashboard (Panel Provider), Resource pages, ou pages custom. |
| 7 | [Mise en page](#7-mise-en-page-columnspan) | Contrôler la largeur dans la grille via `$columnSpan`. |
| 8 | [Polling](#8-polling-rafraîchissement-automatique) | Rafraîchissement automatique à intervalle défini. |
| 9 | [Données contextuelles](#9-widgets-avec-données-contextuelles-record) | Injecter le `$record` courant dans un widget de page Edit. |
| 10 | [Widget custom Blade](#10-widget-custom-blade-pur) | Vue Blade libre pour des interfaces entièrement sur mesure. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble des types, enregistrement et options. |

---

## 1. Qu'est-ce qu'un Widget ?

> **En résumé** : Un widget est un composant autonome qui s'insère dans le dashboard ou dans n'importe quelle page Filament pour afficher des données visuelles. Filament propose 3 types prêts à l'emploi : `StatsOverviewWidget` (cartes de chiffres clés), `ChartWidget` (graphiques Chart.js) et `TableWidget` (mini-table). On peut aussi créer un widget Blade libre pour des interfaces entièrement sur mesure.

Un Widget est un bloc réutilisable affiché sur le dashboard ou dans n'importe quelle page Filament. Filament propose trois types natifs :

| Type                | Usage                                  |
| ------------------- | -------------------------------------- |
| `StatsOverviewWidget` | Cartes de statistiques (chiffres clés) |
| `ChartWidget`         | Graphiques (line, bar, pie...)         |
| `TableWidget`         | Table Filament intégrée dans un widget |

## 2. Création d'un widget

> **En résumé** : Comme pour les Resources ou les Pages, `make:filament-widget` génère automatiquement la classe dans `app/Filament/Widgets/`. Le flag (`--stats-overview`, `--chart`, `--table`) détermine le type de base généré. Sans flag, Artisan génère un widget Blade libre.

```bash
php artisan make:filament-widget StatsOverview --stats-overview
php artisan make:filament-widget RevenueChart --chart
php artisan make:filament-widget LatestOrders --table
```

Les fichiers sont générés dans app/Filament/Widgets/.

## 3. `StatsOverviewWidget` - cartes de statistiques

> **En résumé** : C'est le type le plus simple : on retourne un tableau de `Stat` dans `getStats()`. Chaque `Stat` affiche un label, une valeur chiffrée, une description optionnelle, une icône et une couleur. `->chart([...])` ajoute une mini-sparkline animée. `->url()` rend la carte entière cliquable vers une page Filament.

```PHP
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\User;
use App\Models\Order;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Utilisateurs', User::count())
                ->description('Total inscrits')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Commandes du mois', Order::whereMonth('created_at', now()->month)->count())
                ->description('+12% vs mois dernier')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('warning'),

            Stat::make('Chiffre d\'affaires', '€' . number_format(Order::sum('total') / 100, 2))
                ->description('Toutes commandes confondues')
                ->color('primary'),
        ];
    }
}
```
### Options de `Stat`
```PHP
<?php
Stat::make('label', 'value')
    ->description('texte sous la valeur')
    ->descriptionIcon('heroicon-m-arrow-trending-up') // icône Heroicon
    ->color('success')   // success, warning, danger, primary, gray
    ->chart([7, 3, 4, 8, 6, 12, 9]) // mini-sparkline (tableau de valeurs)
    ->url(route('filament.admin.resources.orders.index')) // rend la carte cliquable
    ->extraAttributes(['class' => 'cursor-pointer']),
```

## 4. `ChartWidget` - graphiques

> **En résumé** : `ChartWidget` s'appuie sur Chart.js. On retourne les données dans `getData()` au format Chart.js (datasets + labels), et `getType()` définit le type de rendu (`line`, `bar`, `pie`…). `getFilters()` ajoute un sélecteur de période intégré au widget — la valeur choisie est disponible dans `$this->filter` pour adapter la requête Eloquent.

```PHP
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use App\Models\Order;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Chiffre d\'affaires mensuel';

    protected static ?int $sort = 2; // ordre d'affichage sur le dashboard

    protected function getData(): array
    {
        $data = Order::query()
            ->selectRaw('MONTH(created_at) as month, SUM(total) as total')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->pluck('total', 'month')
            ->toArray();

        return [
            'datasets' => [
                [
                    'label' => 'Revenus (€)',
                    'data' => array_values($data),
                    'backgroundColor' => '#36A2EB',
                    'borderColor' => '#36A2EB',
                ],
            ],
            'labels' => ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
                         'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        ];
    }

    protected function getType(): string
    {
        return 'line'; // 'bar', 'pie', 'doughnut', 'polarArea', 'radar'
    }
}
```
### Filtres temporels intégrés
```PHP
<?php
protected function getFilters(): ?array
{
    return [
        '7d'  => '7 derniers jours',
        '30d' => '30 derniers jours',
        '1y'  => 'Cette année',
    ];
}

protected function getData(): array
{
    $filter = $this->filter; // contient la valeur sélectionnée ('7d', '30d', '1y')

    $startDate = match($filter) {
        '7d'  => now()->subDays(7),
        '30d' => now()->subDays(30),
        '1y'  => now()->startOfYear(),
        default => now()->subDays(30),
    };

    // ... requête avec $startDate
}
```
## 5. `TableWidget` - table intégrée

> **En résumé** : `TableWidget` embarque une table Filament complète (colonnes, filtres, actions…). La différence avec une Resource : on passe la query directement dans `->query()` de la méthode `table()`. `$columnSpan = 'full'` étale le widget sur toute la largeur. C'est idéal pour afficher les derniers enregistrements d'un modèle en bas d'un dashboard.

```PHP
<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use App\Models\Order;

class LatestOrders extends BaseWidget
{
    protected static ?string $heading = 'Dernières commandes';

    protected int | string | array $columnSpan = 'full'; // occupe toute la largeur

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Order::query()->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('number')
                    ->label('N° commande'),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Client'),
                Tables\Columns\TextColumn::make('total')
                    ->formatStateUsing(fn ($state) => '€' . number_format($state / 100, 2)),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'danger'  => 'cancelled',
                    ]),
            ]);
    }
}
```
## 6. Enregistrer les widgets

> **En résumé** : Les widgets s'enregistrent à trois endroits distincts. Sur le dashboard principal : dans `->widgets([...])` du Panel Provider, qui fixe aussi l'ordre d'affichage. Dans une Resource : via `getHeaderWidgets()` / `getFooterWidgets()` sur la page List ou Edit concernée. Dans une page custom : via `getWidgets()`. Filament auto-découvre les classes dans `app/Filament/Widgets/`, mais l'enregistrement explicite permet de contrôler ordre et visibilité.

### Sur le Dashboard

Par défaut, Filament détecte automatiquement les widgets dans `app/Filament/Widgets/`. Pour contrôler l'ordre et la visibilité, déclare-les dans le Panel Provider :
```PHP
<?php
// app/Providers/Filament/AdminPanelProvider.php

->widgets([
    Widgets\AccountWidget::class,    // widget natif Filament (info user connecté)
    Widgets\FilamentInfoWidget::class,
    StatsOverview::class,
    RevenueChart::class,
    LatestOrders::class,
])
```
### Dans une Resource (sur les pages List/Edit)
```PHP
<?php
// app/Filament/Resources/OrderResource/Pages/ListOrders.php

protected function getHeaderWidgets(): array
{
    return [
        OrderStatsOverview::class,
    ];
}

protected function getFooterWidgets(): array
{
    return [
        RevenueChart::class,
    ];
}
```
### Dans une page custom
```PHP
<?php
// app/Filament/Pages/Dashboard.php

public function getWidgets(): array
{
    return [
        StatsOverview::class,
        RevenueChart::class,
    ];
}
```

## 7. Mise en page (`columnSpan`)

> **En résumé** : Le dashboard est une grille (2 colonnes par défaut). Chaque widget déclare sa largeur via la propriété `$columnSpan` : un entier (nombre de colonnes occupées), `'full'` (toute la largeur), ou un tableau responsive (`['md' => 2, 'xl' => 3]`). Le nombre total de colonnes de la grille se configure avec `->widgetColumnSpan()` dans le Panel Provider.

Le dashboard utilise une grille de 2 colonnes par défaut. On contrôle la largeur de chaque widget :
```PHP
<?php
class StatsOverview extends BaseWidget
{
    protected int | string | array $columnSpan = 'full'; // largeur totale

    // Ou responsive :
    protected int | string | array $columnSpan = [
        'md' => 2,
        'xl' => 3,
    ];
}
```
Pour changer le nombre de colonnes du dashboard :
```PHP
<?php
// AdminPanelProvider.php
->widgets([...])
->widgetColumnSpan('full') // ou un entier
```

## 8. Polling (rafraîchissement automatique)

> **En résumé** : `$pollingInterval` est une propriété statique de la classe widget. Filament déclenche automatiquement un rechargement Livewire à l'intervalle défini (`'15s'`, `'30s'`…). Mettre `null` désactive le polling. Utile pour les widgets de monitoring en temps réel — mais attention à la charge serveur si plusieurs widgets polent en simultané.

```PHP
<?php
class StatsOverview extends BaseWidget
{
    protected static ?string $pollingInterval = '15s'; // se rafraîchit toutes les 15s

    // Désactiver le polling :
    protected static ?string $pollingInterval = null;
}
```

## 9. Widgets avec données contextuelles (Record)

> **En résumé** : Quand un widget est affiché depuis la page Edit d'une Resource, Filament peut y injecter automatiquement le `$record` courant — à condition que le widget déclare une propriété publique `public ?Model $record = null`. C'est idéal pour créer des widgets contextuels qui n'affichent des stats que pour l'enregistrement en cours (ex : les commandes passées par un utilisateur précis).

Dans une page Edit, on peut passer le `$record` courant au widget :
```PHP
<?php
// Dans la page Edit
protected function getHeaderWidgets(): array
{
    return [UserOrderStats::class];
}

// Le record est automatiquement injecté si le widget déclare :
class UserOrderStats extends BaseWidget
{
    public ?Model $record = null; // Filament injecte le record ici

    protected function getStats(): array
    {
        return [
            Stat::make('Commandes', $this->record->orders()->count()),
            Stat::make('Total dépensé', '€' . $this->record->orders()->sum('total') / 100),
        ];
    }
}
```

## 10. Widget custom (Blade pur)

> **En résumé** : Pour une interface qui ne rentre dans aucun des 3 types natifs (carte interactive, tableau de bord maison, composant Alpine.js…), on crée un widget de base et on définit `$view` pointant vers un template Blade. `getViewData()` injecte les variables dans la vue. Le wrapper `<x-filament-widgets::widget>` applique automatiquement le style Filament (fond, bordure, padding).

Pour un widget entièrement custom (interface spéciale, carte interactive...) :
```bash
php artisan make:filament-widget MapWidget
```

```PHP
<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class MapWidget extends Widget
{
    protected static string $view = 'filament.widgets.map-widget';

    // Données passées à la vue
    public function getViewData(): array
    {
        return [
            'locations' => Store::all(['lat', 'lng', 'name']),
        ];
    }
}
```

```PHP
{{-- resources/views/filament/widgets/map-widget.blade.php --}}
<x-filament-widgets::widget>
    <x-filament::section>
        <div id="map" style="height: 400px;"
             x-data="mapComponent(@js($locations))">
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
```

## Récapitulatif

```
Widgets disponibles
├── StatsOverviewWidget  → cartes avec chiffre + description + spark chart
├── ChartWidget          → graphique Chart.js (line, bar, pie...)
├── TableWidget          → table Filament (query + columns)
└── Widget (custom)      → vue Blade libre

Enregistrement
├── Dashboard            → via Panel Provider (->widgets([...]))
├── Resource pages       → getHeaderWidgets() / getFooterWidgets()
└── Pages custom         → getWidgets()

Options transversales
├── $sort                → ordre d'affichage
├── $columnSpan          → largeur dans la grille
├── $pollingInterval     → rafraîchissement automatique
└── $record              → données contextuelles (page Edit)
```
