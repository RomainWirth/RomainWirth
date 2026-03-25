# Étape 7 — Widgets du dashboard admin

> Référence cours : `VI_WIDGETS/01_LES_WIDGETS.md`

---

## 7.1 Générer les widgets

```bash
php artisan make:filament-widget TicketStatsOverview --stats-overview
php artisan make:filament-widget TicketChart --chart
php artisan make:filament-widget OldestTicketsTable --table
```

---

## 7.2 `TicketStatsOverview` — Statistiques clés

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Ticket;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TicketStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $open = Ticket::whereIn('status', ['open', 'in_progress'])->count();

        $mine = Ticket::where('agent_id', auth()->id())
            ->whereIn('status', ['open', 'in_progress'])
            ->count();

        $slaExceeded = Ticket::whereIn('status', ['open', 'in_progress'])
            ->where(function ($query) {
                $query
                    ->where(function ($q) {
                        // Priorité critical : SLA 4h
                        $q->where('priority', 'critical')
                          ->where('created_at', '<', Carbon::now()->subHours(4));
                    })
                    ->orWhere(function ($q) {
                        // Priorité high : SLA 8h
                        $q->where('priority', 'high')
                          ->where('created_at', '<', Carbon::now()->subHours(8));
                    })
                    ->orWhere(function ($q) {
                        // Priorité medium : SLA 24h
                        $q->where('priority', 'medium')
                          ->where('created_at', '<', Carbon::now()->subHours(24));
                    })
                    ->orWhere(function ($q) {
                        // Priorité low : SLA 72h
                        $q->where('priority', 'low')
                          ->where('created_at', '<', Carbon::now()->subHours(72));
                    });
            })
            ->count();

        return [
            Stat::make('Tickets ouverts', $open)
                ->description('Tous les tickets actifs')
                ->icon('heroicon-m-inbox')
                ->color('warning'),

            Stat::make('Mes tickets', $mine)
                ->description('Assignés à moi')
                ->icon('heroicon-m-user')
                ->color('info'),

            Stat::make('SLA dépassé', $slaExceeded)
                ->description('Tickets hors délai')
                ->icon('heroicon-m-exclamation-triangle')
                ->color($slaExceeded > 0 ? 'danger' : 'success'),
        ];
    }
}
```

---

## 7.3 `TicketChart` — Tickets créés vs résolus (30 jours)

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Ticket;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class TicketChart extends ChartWidget
{
    protected static ?string $heading = 'Tickets créés vs résolus (30 derniers jours)';

    protected int | string | array $columnSpan = 2;

    protected function getData(): array
    {
        $days = collect(range(29, 0))->map(fn ($i) => Carbon::now()->subDays($i));

        $created = $days->map(
            fn ($date) => Ticket::whereDate('created_at', $date)->count()
        );

        $resolved = $days->map(
            fn ($date) => Ticket::whereDate('updated_at', $date)
                ->where('status', 'resolved')
                ->count()
        );

        return [
            'datasets' => [
                [
                    'label'           => 'Créés',
                    'data'            => $created->values()->toArray(),
                    'borderColor'     => '#6366f1',
                    'backgroundColor' => 'rgba(99,102,241,0.1)',
                    'fill'            => true,
                ],
                [
                    'label'           => 'Résolus',
                    'data'            => $resolved->values()->toArray(),
                    'borderColor'     => '#22c55e',
                    'backgroundColor' => 'rgba(34,197,94,0.1)',
                    'fill'            => true,
                ],
            ],
            'labels' => $days->map(fn ($date) => $date->format('d/m'))->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
```

---

## 7.4 `OldestTicketsTable` — 5 tickets les plus anciens non résolus

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Ticket;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class OldestTicketsTable extends BaseWidget
{
    protected static ?string $heading = 'Tickets les plus anciens non résolus';

    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Ticket::query()
                    ->whereNotIn('status', ['resolved', 'closed'])
                    ->orderBy('created_at')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('#')
                    ->sortable(),

                Tables\Columns\TextColumn::make('subject')
                    ->label('Sujet')
                    ->limit(40),

                Tables\Columns\BadgeColumn::make('priority')
                    ->label('Priorité')
                    ->colors([
                        'secondary' => 'low',
                        'warning'   => 'medium',
                        'danger'    => fn ($state) => in_array($state, ['high', 'critical']),
                    ]),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ouvert le')
                    ->dateTime('d/m/Y H:i'),

                Tables\Columns\TextColumn::make('agent.name')
                    ->label('Agent')
                    ->default('Non assigné'),
            ]);
    }
}
```

---

## 7.5 Enregistrer les widgets dans le Panel Admin

Dans `app/Providers/Filament/AdminPanelProvider.php` :

```php
use App\Filament\Widgets\OldestTicketsTable;
use App\Filament\Widgets\TicketChart;
use App\Filament\Widgets\TicketStatsOverview;

->widgets([
    TicketStatsOverview::class,
    TicketChart::class,
    OldestTicketsTable::class,
])
```

---

## 7.6 Vérifier

- Accède à `/admin` → les trois widgets apparaissent sur le dashboard
- Les stats reflètent bien les données en BDD
- Le graphique affiche deux courbes sur 30 jours
- Le tableau liste les tickets les plus anciens ouverts (max 5)
