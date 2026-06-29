# Phase 1 — Étape 4 : Widget Dashboard

## 4.1 Générer le widget

```bash
php artisan make:filament-widget ArticleStatsOverview --stats-overview
```

---

## 4.2 Implémenter les statistiques

```php
<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ArticleStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $total = Article::count();
        $published = Article::where('is_published', true)->count();
        $drafts = Article::where('is_published', false)->count();

        $publishedThisMonth = Article::where('is_published', true)
            ->whereMonth('published_at', Carbon::now()->month)
            ->whereYear('published_at', Carbon::now()->year)
            ->count();

        return [
            Stat::make('Total articles', $total)
                ->description('Tous les articles')
                ->icon('heroicon-m-document-text')
                ->color('primary'),

            Stat::make('Publiés', $published)
                ->description("{$publishedThisMonth} ce mois-ci")
                ->icon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Brouillons', $drafts)
                ->description('En attente de publication')
                ->icon('heroicon-m-pencil-square')
                ->color('warning'),
        ];
    }
}
```

> Les `Stat` acceptent `->description()`, `->icon()` et `->color()` pour enrichir l'affichage. La couleur peut être `primary`, `success`, `warning`, `danger`, `info`, ou une couleur Tailwind hex.

---

## 4.3 Enregistrer le widget dans le panel

Dans `app/Providers/Filament/AdminPanelProvider.php` :

```php
use App\Filament\Widgets\ArticleStatsOverview;

->widgets([
    ArticleStatsOverview::class,
])
```

> Par défaut, les widgets sont découverts automatiquement si le dossier `app/Filament/Widgets/` est configuré dans `->discoverWidgets()`. Si ce n'est pas le cas, déclare-les manuellement comme ci-dessus.

---

## 4.4 Résultat de la Phase 1

À ce stade, l'application est un **blog fonctionnel** avec :
- ✅ Gestion des catégories avec couleurs
- ✅ Création d'articles riches (RichEditor + image de couverture)
- ✅ Slug auto-généré
- ✅ Publication différée avec date
- ✅ Filtres dans la table
- ✅ Dashboard avec statistiques

---

## 4.5 Vérifier

- Accède à `/admin` → les 3 cartes de statistiques apparaissent sur le dashboard
- Les chiffres reflètent bien les articles en BDD
- Publie un article → la carte **Publiés ce mois-ci** s'incrémente
