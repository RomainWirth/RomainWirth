# Étape 9 — Page custom "Catalogue"

Une page accessible aux utilisateurs non-admin, qui affiche la liste des livres disponibles sans les actions d'édition ni de suppression.

## 9.1 Générer la page

```bash
php artisan make:filament-page Catalogue
```

Fichiers générés :
```
app/Filament/Pages/Catalogue.php
resources/views/filament/pages/catalogue.blade.php
```

---

## 9.2 Configurer la classe `Catalogue`

Dans `app/Filament/Pages/Catalogue.php` :

```php
namespace App\Filament\Pages;

use App\Models\Book;
use Filament\Pages\Page;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Filament\Tables;

class Catalogue extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon  = 'heroicon-o-book-open';
    protected static ?string $navigationLabel = 'Catalogue';
    protected static ?string $navigationGroup = null;
    protected static ?int    $navigationSort  = 10;
    protected static ?string $title           = 'Catalogue des livres disponibles';

    protected static string $view = 'filament.pages.catalogue';

    public function table(Table $table): Table
    {
        return $table
            ->query(Book::query()->where('is_available', true)->with('author'))
            ->columns([
                Tables\Columns\ImageColumn::make('cover')
                    ->label(''),

                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('author.name')
                    ->label('Auteur')
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Parution')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            // Pas d'actions d'édition ni de suppression
            ->actions([])
            ->bulkActions([])
            ->defaultSort('title');
    }
}
```

> `->query()` sur la table remplace la query par défaut : on filtre uniquement les livres disponibles. La table est en lecture seule (aucune action déclarée).

---

## 9.3 Configurer la vue Blade

Dans `resources/views/filament/pages/catalogue.blade.php` :

```blade
<x-filament-panels::page>

    {{ $this->table }}

</x-filament-panels::page>
```

> `{{ $this->table }}` déclenche le rendu de la table Filament configuree dans `table()`.

---

## 9.4 Rendre la page accessible aux non-admins

Si `canAccessPanel()` bloque les non-admins au niveau du panel entier (voir étape 8), la page Catalogue ne peut servir de vue publique dans ce même panel. Deux options :

**Option A** — Créer un deuxième panel dédié aux utilisateurs (multi-panel) dans une future évolution.

**Option B** — Garder `canAccessPanel()` permissif pour tous et protéger uniquement les actions sensibles via les Policies (solution la plus simple pour ce projet) :

```php
// User.php
public function canAccessPanel(Panel $panel): bool
{
    return true; // tous les utilisateurs connectés accèdent au panel
}
```

Les Policies de l'étape 8 continuent de masquer les boutons Créer/Modifier/Supprimer pour les non-admins.

---

## 9.5 Vérifier

- Rends-toi sur `/admin/catalogue`
- La table affiche uniquement les livres disponibles
- Aucun bouton d'édition ou suppression
- La recherche et le tri fonctionnent
- Un utilisateur non-admin connecté voit cette page mais ne peut pas modifier les livres depuis les autres pages
