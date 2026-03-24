# Filament - Les Widgets

Doc officielle : [https://filamentphp.com/docs/3.x/widgets/overview](https://filamentphp.com/docs/3.x/widgets/overview)

## 1. Qu'est-ce qu'un Widget ?

Un Widget est un bloc réutilisable affiché sur le dashboard ou dans n'importe quelle page Filament. Filament propose trois types natifs :

| Type                | Usage                                  |
| ------------------- | -------------------------------------- |
| `StatsOverviewWidget` | Cartes de statistiques (chiffres clés) |
| `ChartWidget`         | Graphiques (line, bar, pie...)         |
| `TableWidget`         | Table Filament intégrée dans un widget |

## 2. Création d'un widget

```bash
php artisan make:filament-widget StatsOverview --stats-overview
php artisan make:filament-widget RevenueChart --chart
php artisan make:filament-widget LatestOrders --table
```

Les fichiers sont générés dans app/Filament/Widgets/.

## 3. `StatsOverviewWidget` - cartes de statistiques

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
