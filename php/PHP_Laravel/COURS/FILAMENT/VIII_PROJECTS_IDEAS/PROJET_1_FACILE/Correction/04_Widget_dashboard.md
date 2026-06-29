# Étape 4 — Widget Dashboard

## 4.1 Générer le widget

```bash
php artisan make:filament-widget TaskStats --stats-overview
```

Fichier généré : `app/Filament/Widgets/TaskStats.php`

---

## 4.2 Configurer le widget

Dans `app/Filament/Widgets/TaskStats.php` :

```php
namespace App\Filament\Widgets;

use App\Models\Task;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TaskStats extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Tâches totales', Task::count())
                ->description('Toutes les tâches')
                ->descriptionIcon('heroicon-m-clipboard-document-list')
                ->color('primary'),

            Stat::make('En cours', Task::where('status', 'in_progress')->count())
                ->description('Tâches en cours de réalisation')
                ->descriptionIcon('heroicon-m-arrow-path')
                ->color('warning'),

            Stat::make('Terminées', Task::where('status', 'done')->orWhere('is_completed', true)->count())
                ->description('Tâches complétées')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),
        ];
    }
}
```

> Le widget est détecté automatiquement par Filament grâce à `discoverWidgets()` déjà configuré dans le Panel Provider — aucun enregistrement manuel nécessaire.

---

## 4.3 Vérifier

Rends-toi sur `/admin`.
Tu dois voir trois cartes de statistiques :

- **Tâches totales** — compte global
- **En cours** — tâches avec statut `in_progress`
- **Terminées** — tâches avec statut `done` ou `is_completed` à `true`

Les chiffres se mettent à jour automatiquement à chaque rechargement de la page.
