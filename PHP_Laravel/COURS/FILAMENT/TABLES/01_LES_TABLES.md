# Filament Tables

Doc officielle : [https://filamentphp.com/docs/3.x/tables/getting-started](https://filamentphp.com/docs/3.x/tables/getting-started)

## 1. Structure de base

Une table est définie dans la méthode table(Table $table): Table d'une Resource. Elle se compose de quatre parties :
```PHP
<?php
public static function table(Table $table): Table
{
    return $table
        ->columns([...])     // colonnes affichées
        ->filters([...])     // UI de filtrage
        ->actions([...])     // actions par ligne
        ->bulkActions([...]); // actions sur sélection multiple
}
```

## 2. Les colonnes

### `TextColumn` - la plus utilisée
```PHP
<?php
Tables\Columns\TextColumn::make('name')
    ->sortable()
    ->searchable(),
```

Options essentielles :
```PHP
<?php
TextColumn::make('price')
    ->numeric()                  // formatage numérique
    ->money('EUR')               // formatage monétaire : €12.50
    ->dateTime('d/m/Y H:i')     // formatage date
    ->date('d/m/Y')
    ->since()                    // "il y a 3 jours"
    ->sortable()
    ->searchable()
    ->limit(50)                  // tronque à 50 caractères
    ->wrap()                     // autorise le retour à la ligne
    ->label('Prix TTC')
    ->toggleable(isToggledHiddenByDefault: true), // masquée par défaut mais activable
```

### Dot-notation pour les relations

Filament charge automatiquement les relations :
```PHP
<?php
// Relation BelongsTo
TextColumn::make('destination.name')->sortable(),

// Relation imbriquée (2 niveaux)
TextColumn::make('latestActivityLog.causer.first_name')->label('Last updated by'),
```

### Valeur calculée avec `->state()`

Quand la valeur à afficher n'est pas directement un attribut du modèle :
```PHP
<?php
TextColumn::make('products')
    ->state(fn (Order $record) => $record->items->implode('description', ', ')),

TextColumn::make('total')
    ->state(fn (Order $record) => '€' . number_format($record->total / 100, 2, ',')),
```

### `->badge()` - affichage sous forme de badge coloré

```PHP
<?php
TextColumn::make('payment_status')
    ->badge()
    ->color(fn (string $state): string => match ($state) {
        'paid'    => 'success',
        'pending' => 'warning',
        'failed'  => 'danger',
        default   => 'gray',
    }),
```

### `IconColumn` - icônes et booléens

```PHP
<?php
// Booléen : ✓ vert / ✗ rouge
Tables\Columns\IconColumn::make('is_published')
    ->boolean(),

// Valeur calculée (pas directement un attribut)
Tables\Columns\IconColumn::make('shipped_by_gloobles')
    ->state(fn (Order $record) => $record->isShippedByGloobles())
    ->boolean(),
```

### `ImageColumn`

```PHP
<?php
Tables\Columns\ImageColumn::make('avatar')
    ->circular()         // avatar rond
    ->size(40),          // 40px
```

### Résumé des types de colonnes

| Classe            | Usage                                                 |
| ----------------- | ----------------------------------------------------- |
| `TextColumn`      | Texte, dates, nombres, badges                         |
| `IconColumn`      | Icônes, booléens                                      |
| `ImageColumn`     | Images                                                |
| `BadgeColumn`     | Badges (v2, remplacé par `TextColumn->badge()` en v3) |
| `ColorColumn`     | Affiche une couleur                                   |
| `CheckboxColumn`  | Permet l'édition inline d'un booléen                  |
| `SelectColumn`    | Permet l'édition inline d'un select                   |
| `TextInputColumn` | Permet l'édition inline d'un texte                    |

### 3. Colonnes custom (réutilisables)

Exactement comme pour les Forms, on peut extraire des colonnes fréquemment réutilisées dans des classes dédiées. Exemple :
```PHP
<?php
// app/Filament/Tables/Columns/BooleanColumn.php

class BooleanColumn
{
    public static function make(string $name, bool $hidden = false): IconColumn
    {
        return IconColumn::make($name)
            ->boolean()
            ->toggleable(isToggledHiddenByDefault: $hidden);
    }
}
```

**Utilisation :**
```PHP
<?php
->columns([
    BooleanColumn::make('is_published'),
    BooleanColumn::make('is_highlighted', hidden: true), // masquée par défaut
])
```

## 4. Les filtres

Les filtres ajoutent un panneau latéral (ou en ligne) permettant à l'utilisateur de filtrer les résultats. Chaque filtre modifie la **query Eloquent**.

### `SelectFilter` - filtre par valeur
```PHP
<?php
// Par relation
Tables\Filters\SelectFilter::make('destination')
    ->relationship('destination', 'name', fn (Builder $query) => $query->isFinal())
    ->searchable(),

// Par valeurs manuelles, avec multi-sélection
Tables\Filters\SelectFilter::make('payment_status')
    ->options(PaymentStatus::toArray())
    ->multiple()
    ->default([PaymentStatus::Paid->value]), // valeur par défaut
```

### `TernaryFilter` - filtre à trois états (oui / non / tous)
```PHP
<?php
Tables\Filters\TernaryFilter::make('is_friend'),
// Affiche : Tous | Oui | Non
```

### `TrashedFilter` - gestion des soft deletes
```PHP
<?php
Tables\Filters\TrashedFilter::make(),
// Affiche : Sans supprimés | Avec supprimés | Supprimés uniquement
```

### `Filter` personnalisé - le plus puissant

Permet de créer n'importe quel filtre avec un formulaire et une query custom :
```PHP
<?php
Tables\Filters\Filter::make('created_at')
    // (1) Formulaire du filtre (composants Filament Forms)
    ->form([
        Forms\Components\DatePicker::make('created_from'),
        Forms\Components\DatePicker::make('created_until'),
    ])
    // (2) Application du filtre à la query
    ->query(function (Builder $query, array $data): Builder {
        return $query
            ->when(
                $data['created_from'],
                fn (Builder $query, $date) => $query->whereDate('created_at', '>=', $date),
            )
            ->when(
                $data['created_until'],
                fn (Builder $query, $date) => $query->whereDate('created_at', '<=', $date),
            );
    }),
```

La méthode `->when()` d'Eloquent est parfaite ici : la clause n'est appliquée que si la valeur est non-nulle.

Filtre simple (sans formulaire, juste un toggle booléen) :
```PHP
<?php
Tables\Filters\Filter::make('not_published')
    ->query(fn (Builder $query): Builder => $query->where('is_published', false)),
// S'active avec un simple checkbox dans le panneau
```

## 5. Les actions par ligne

Actions affichées sur chaque ligne de la table.

### Actions natives

```PHP
<?php
->actions([
    Tables\Actions\EditAction::make(),
    Tables\Actions\ViewAction::make(),
    Tables\Actions\DeleteAction::make(),
    Tables\Actions\RestoreAction::make(),   // soft delete
    Tables\Actions\ForceDeleteAction::make(),
])
```

### Action custom

```PHP
<?php
Tables\Actions\Action::make('publish')
    ->label('Publier')
    ->icon('heroicon-o-eye')
    ->color('success')
    ->requiresConfirmation()                 // affiche une modale de confirmation
    ->modalHeading('Publier cet article ?')
    ->modalDescription('Cette action est visible publiquement.')
    ->visible(fn (Post $record) => !$record->is_published)
    ->action(function (Post $record): void {
        $record->update(['is_published' => true]);
    }),
```

### Action avec formulaire dans une modale

```PHP
<?php
Tables\Actions\Action::make('change_status')
    ->form([
        Forms\Components\Select::make('status')
            ->options(Status::toArray())
            ->required(),
        Forms\Components\Textarea::make('reason')
            ->required(),
    ])
    ->action(function (array $data, Model $record): void {
        $record->update(['status' => $data['status']]);
    }),
```

## 6. Les BulkActions - actions sur sélection multiple

Permettent d'agir sur plusieurs lignes cochées simultanément.

### Actions natives

```PHP
<?php
->bulkActions([
    Tables\Actions\DeleteBulkAction::make(),
    Tables\Actions\ForceDeleteBulkAction::make(),
    Tables\Actions\RestoreBulkAction::make(),
])
```

### `BulkAction` custom

```PHP
<?php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Support\Collection;

BulkAction::make('update_status')
    ->label('Changer le statut')
    ->icon('heroicon-o-arrow-path')
    // (1) Formulaire affiché dans une modale
    ->form([
        Forms\Components\Select::make('shipping_status')
            ->options(ShippingStatus::toArray())
            ->required(),
    ])
    // (2) Action appliquée à chaque record sélectionné
    ->action(function (array $data, Collection $records): void {
        $records->each(fn (Model $record) => $record->update([
            'shipping_status' => $data['shipping_status'],
        ]));
    })
    ->requiresConfirmation()
    ->deselectRecordsAfterCompletion(), // décoche tout après l'action
```

## 7. Tri, recherche, pagination

```PHP
<?php
$table
    ->defaultSort('created_at', 'desc')   // tri par défaut
    ->searchable()                         // active la recherche globale
    ->paginated([10, 25, 50, 100])         // options de pagination
    ->defaultPaginationPageOption(25)
    ->poll('30s')                          // rafraîchissement automatique
    ->striped()                            // lignes alternées
    ->deferLoading()                       // chargement différé (skeleton)
```

### Recherche globale vs par colonne

```PHP
<?php
// Recherche sur colonne simple
TextColumn::make('name')->searchable(),

// Recherche sur plusieurs colonnes (ex: prénom + nom)
TextColumn::make('full_name')->searchable(['first_name', 'last_name']),

// Recherche globale au niveau du panel (barre de recherche en haut)
public static function getGloballySearchableAttributes(): array
{
    return ['name', 'email', 'tracking_code'];
}
```

## 8. Surcharger la query Eloquent

Pour modifier la query de base de la table (exclure des scopes, ajouter des eager loads...) :
```PHP
<?php
public static function getEloquentQuery(): Builder
{
    return parent::getEloquentQuery()
        ->withoutGlobalScopes([
            SoftDeletingScope::class,    // inclut les soft-deleted
            HideItineraryOnlyScope::class,
        ])
        ->with(['destination', 'categories']); // eager loading
}
```

## 9. `->layout()` - changer la présentation

Par défaut la table est en mode liste. On peut passer en grille :
```PHP
<?php
use Filament\Tables\Enums\FiltersLayout;

$table
    ->filters([...])
    ->filtersLayout(FiltersLayout::AboveContent) // filtres au-dessus du tableau
    // ou FiltersLayout::Dropdown (défaut), FiltersLayout::BelowContent
```

## 10. Colonnes éditables en ligne

Filament permet d'éditer certaines valeurs directement dans la table sans passer par la page d'édition :
```PHP
<?php
Tables\Columns\TextInputColumn::make('name')
    ->rules(['required', 'max:255']),

Tables\Columns\SelectColumn::make('status')
    ->options(Status::toArray()),

Tables\Columns\CheckboxColumn::make('is_published'),

Tables\Columns\ToggleColumn::make('is_featured'),
```

## 11. `hintAction` sur une colonne

Permet d'ajouter un bouton d'action directement dans une cellule :
```PHP
<?php
TextColumn::make('plan')
    ->hintAction(
        Tables\Actions\Action::make('cancel')
            ->icon('heroicon-c-x-circle')
            ->color('danger')
            ->requiresConfirmation()
            ->action(fn (Subscription $record) => $record->cancel())
            ->hidden(fn (Subscription $record) => (bool) $record->ends_at)
    ),
```

## Récapitulatif structurel
```
Table
├── columns([])
│   ├── TextColumn       → texte, dates, badges, dot-notation, state()
│   ├── IconColumn       → booléens, icônes
│   ├── ImageColumn      → avatars, images
│   ├── *Column (inline) → CheckboxColumn, SelectColumn, TextInputColumn
│   └── Custom Column    → classe dédiée (BooleanColumn.php)
│
├── filters([])
│   ├── SelectFilter     → par valeur ou relation
│   ├── TernaryFilter    → 3 états
│   ├── TrashedFilter    → soft deletes
│   └── Filter           → form + query Eloquent custom
│
├── actions([])          → par ligne : Edit, Delete, Action custom + modale
│
└── bulkActions([])      → sur sélection : BulkAction + form + Collection
```

Sources :

Tables : [https://filamentphp.com/docs/3.x/tables/getting-started](https://filamentphp.com/docs/3.x/tables/getting-started)
Columns : [https://filamentphp.com/docs/3.x/tables/columns/getting-started](https://filamentphp.com/docs/3.x/tables/columns/getting-started)
Filters : [https://filamentphp.com/docs/3.x/tables/filters/getting-started](https://filamentphp.com/docs/3.x/tables/filters/getting-started)
Actions : [https://filamentphp.com/docs/3.x/tables/actions](https://filamentphp.com/docs/3.x/tables/actions)
