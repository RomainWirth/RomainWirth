# Étape 7 — Widgets du Dashboard

## 7.1 Générer les widgets

```bash
php artisan make:filament-widget LibraryStats --stats-overview
php artisan make:filament-widget LoansChart --chart
```

---

## 7.2 `LibraryStats` — cartes de statistiques

Dans `app/Filament/Widgets/LibraryStats.php` :

```php
namespace App\Filament\Widgets;

use App\Models\Author;
use App\Models\Book;
use App\Models\Loan;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LibraryStats extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Livres', Book::count())
                ->description('Dans la bibliothèque')
                ->descriptionIcon('heroicon-m-book-open')
                ->color('primary'),

            Stat::make('Auteurs', Author::count())
                ->description('Référencés')
                ->descriptionIcon('heroicon-m-user')
                ->color('info'),

            Stat::make('Emprunts en cours', Loan::whereNull('returned_at')->count())
                ->description(Book::where('is_available', false)->count() . ' livres indisponibles')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('warning'),
        ];
    }
}
```

---

## 7.3 `LoansChart` — emprunts par mois

Dans `app/Filament/Widgets/LoansChart.php` :

```php
namespace App\Filament\Widgets;

use App\Models\Loan;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class LoansChart extends ChartWidget
{
    protected static ?string $heading = 'Emprunts par mois';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $data = collect(range(11, 0))->map(function (int $monthsAgo) {
            $month = Carbon::now()->subMonths($monthsAgo);

            return [
                'month' => $month->translatedFormat('M Y'),
                'count' => Loan::whereYear('loaned_at', $month->year)
                    ->whereMonth('loaned_at', $month->month)
                    ->count(),
            ];
        });

        return [
            'datasets' => [
                [
                    'label'           => 'Emprunts',
                    'data'            => $data->pluck('count')->toArray(),
                    'backgroundColor' => '#6366f1',
                ],
            ],
            'labels' => $data->pluck('month')->toArray(),
        ];
    }
}
```

> `Carbon::now()->subMonths($monthsAgo)` génère les 12 derniers mois pour les labels et les requêtes.

---

## 7.4 Enregistrer les widgets dans le Panel Provider

Dans `AdminPanelProvider.php`, les widgets dans `app/Filament/Widgets/` sont détectés automatiquement grâce à `discoverWidgets()` (déjà configuré par défaut).

Pour contrôler l'ordre d'affichage sur le dashboard, ajoute `$sort` dans chaque widget :

```php
// LibraryStats.php
protected static ?int $sort = 1;

// LoansChart.php
protected static ?int $sort = 2;
```

---

## 7.5 Vérifier

Rends-toi sur `/admin`.
Tu dois voir :
- Trois cartes de stats (livres, auteurs, emprunts en cours)
- Un bar chart des emprunts sur les 12 derniers mois
