# Étape 5 — Infolist (page ViewBook)

L'Infolist remplace les champs éditables par des entrées en lecture seule sur la page `ViewBook`.

## 5.1 Vérifier que la page View est bien configurée

Dans `BookResource.php`, `getPages()` doit contenir :

```php
public static function getPages(): array
{
    return [
        'index'  => Pages\ListBooks::route('/'),
        'create' => Pages\CreateBook::route('/create'),
        'view'   => Pages\ViewBook::route('/{record}'),
        'edit'   => Pages\EditBook::route('/{record}/edit'),
    ];
}
```

Si la page `ViewBook` n'existe pas, génère-la :

```bash
php artisan make:filament-page ViewBook --resource=BookResource --type=ViewRecord
```

---

## 5.2 Définir l'Infolist dans `BookResource`

Ajoute la méthode `infolist()` dans `BookResource.php` :

```php
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\BadgeEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\Section;

public static function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            Section::make('Informations générales')
                ->schema([
                    ImageEntry::make('cover')
                        ->label('Couverture')
                        ->columnSpanFull(),

                    TextEntry::make('title')
                        ->label('Titre'),

                    TextEntry::make('author.name')
                        ->label('Auteur'),

                    TextEntry::make('isbn')
                        ->label('ISBN')
                        ->placeholder('Non renseigné'),

                    TextEntry::make('published_at')
                        ->label('Date de parution')
                        ->date('d/m/Y'),
                ])->columns(2),

            Section::make('Statut')
                ->schema([
                    BadgeEntry::make('is_available')
                        ->label('Disponibilité')
                        ->formatStateUsing(fn (bool $state) => $state ? 'Disponible' : 'Emprunté')
                        ->color(fn (bool $state) => $state ? 'success' : 'danger'),

                    TextEntry::make('loans_count')
                        ->label('Nombre d\'emprunts')
                        ->state(fn (Book $record) => $record->loans()->count()),
                ]),
        ]);
}
```

---

## 5.3 Ajouter un bouton "Modifier" dans le header de la page View

Dans `app/Filament/Resources/BookResource/Pages/ViewBook.php` :

```php
use Filament\Actions;

protected function getHeaderActions(): array
{
    return [
        Actions\EditAction::make(),
    ];
}
```

---

## 5.4 Vérifier

Clique sur l'icône œil d'un livre dans la liste.  
Tu dois voir :
- La couverture (si uploadée)
- Le titre, auteur, ISBN, date de parution en lecture seule
- Un badge coloré vert (Disponible) ou rouge (Emprunté)
- Le nombre total d'emprunts
- Un bouton "Modifier" dans le header
