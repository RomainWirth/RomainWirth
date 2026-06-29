# Filament Tables

Doc officielle : [https://filamentphp.com/docs/3.x/tables/getting-started](https://filamentphp.com/docs/3.x/tables/getting-started)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Structure de base](#1-structure-de-base) | `columns`, `filters`, `actions`, `bulkActions` : les 4 piliers d'une table. |
| 2 | [Les colonnes](#2-les-colonnes) | `TextColumn`, dot-notation, `state()`, `badge()`, `IconColumn`, `ImageColumn`. |
| 3 | [Colonnes custom](#3-colonnes-custom-réutilisables) | Extraire une colonne répétitive dans une classe dédiée. |
| 4 | [Les filtres](#4-les-filtres) | Modifier la query Eloquent depuis l'UI via `SelectFilter`, `TernaryFilter`, `Filter` custom. |
| 5 | [Actions par ligne](#5-les-actions-par-ligne) | Boutons sur chaque ligne : natifs (`EditAction`…) ou entièrement custom avec modale. |
| 6 | [BulkActions](#6-les-bulkactions---actions-sur-sélection-multiple) | Agir sur une sélection de lignes cochées, avec formulaire dans une modale. |
| 7 | [Tri, recherche, pagination](#7-tri-recherche-pagination) | Options globales de la table : tri par défaut, recherche, pagination, polling. |
| 8 | [Surcharger la query](#8-surcharger-la-query-eloquent) | Modifier la requête de base : scopes, eager loading, soft deletes. |
| 9 | [Layout des filtres](#9---layout---changer-la-présentation) | Changer la position du panneau de filtres. |
| 10 | [Colonnes éditables](#10-colonnes-éditables-en-ligne) | Éditer une valeur directement dans la table sans passer par la page d'édition. |
| 11 | [hintAction sur colonne](#11-hintaction-sur-une-colonne) | Ajouter un bouton d'action directement dans une cellule. |
| — | [Récapitulatif structurel](#récapitulatif-structurel) | Vue d'ensemble Table → columns / filters / actions / bulkActions. |

---

## 1. Structure de base

> **En résumé** : La table est définie dans la méthode `table()` de la Resource. Elle s'articule toujours autour de 4 clés : `columns` (ce qu'on affiche), `filters` (comment l'utilisateur filtre), `actions` (boutons par ligne), `bulkActions` (boutons sur sélection). Tout le reste (tri, pagination, recherche…) se configure directement sur l'objet `$table`.

Une table est définie dans la méthode `table(Table $table): Table` d'une Resource. Elle se compose de quatre parties :
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

> **En résumé** : `TextColumn` couvre la grande majorité des cas (texte, dates, nombres, badges). La dot-notation (`destination.name`) charge automatiquement les relations sans écrire de query. `->state()` permet d'afficher une valeur calculée qui n'est pas un attribut direct du modèle. `->badge()` + `->color()` transforme une valeur en badge coloré selon son contenu.

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

> **En résumé** : Quand la même configuration de colonne revient dans plusieurs tables (ex : une `IconColumn` booléen avec `toggleable`), on l'extrait dans une classe dédiée avec une méthode statique `make()`. Le principe est identique aux blocs du Builder ou aux sections de formulaire : on factorise pour éviter la duplication et centraliser les modifications.

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

> **En résumé** : Les filtres modifient la query Eloquent en fonction des choix de l'utilisateur dans le panneau de filtres. `SelectFilter` couvre les cas simples (filtrer par une valeur ou une relation). `TernaryFilter` gère les booléens à trois états. Le `Filter` générique est le plus puissant : on lui passe un formulaire Filament et une closure qui reçoit le `Builder` Eloquent — on peut faire n'importe quelle requête.

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

> **En résumé** : Les actions apparaissent dans la dernière colonne de chaque ligne. Filament fournit les actions CRUD natives (`EditAction`, `DeleteAction`…). Pour un comportement métier spécifique, on utilise `Action::make()` en définissant l'icône, la couleur, une confirmation optionnelle, et la closure `->action()` qui reçoit le `$record`. On peut aussi ouvrir une modale avec un formulaire Filament via `->form([...])` pour collecter des données avant d'agir.

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

> **En résumé** : Les BulkActions apparaissent dans la barre du dessus quand l'utilisateur coche des lignes. La différence avec une `Action` : la closure `->action()` reçoit une `Collection` de records au lieu d'un seul. On peut aussi ouvrir une modale avec un formulaire (ex : choisir un nouveau statut) avant d'appliquer l'action. `->deselectRecordsAfterCompletion()` décoche tout après l'exécution.

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

> **En résumé** : Ces options se configurent directement sur l'objet `$table`. `->defaultSort('colonne', 'asc|desc')` définit l'ordre initial. La recherche peut être activée colonne par colonne (`->searchable()`) ou sur plusieurs colonnes à la fois. `->poll('30s')` rafraîchit automatiquement la table sans recharger la page. `->deferLoading()` affiche un skeleton pendant le chargement — utile pour les tables lentes.

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

> **En résumé** : Par défaut Filament applique tous les global scopes du modèle (ex : `SoftDeletingScope` qui exclut les enregistrements supprimés). On override `getEloquentQuery()` pour retirer certains scopes ou ajouter des eager loads. C'est aussi là qu'on ajoute des `->with([...])` pour éviter les problèmes N+1 sur les colonnes en dot-notation.

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

> **En résumé** : Par défaut le panneau de filtres est dans un dropdown en haut à droite. `FiltersLayout::AboveContent` l'affiche directement au-dessus de la table — pratique quand il y a beaucoup de filtres ou qu'on veut qu'ils soient visibles en permanence. `FiltersLayout::BelowContent` le place en dessous.

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

> **En résumé** : Certains types de colonnes permettent d'éditer la valeur directement dans la cellule sans naviguer vers la page d'édition. `TextInputColumn` pour le texte, `SelectColumn` pour un select, `CheckboxColumn` / `ToggleColumn` pour les booléens. On peut ajouter des `->rules([...])` pour valider la saisie. À utiliser avec mesure : trop d'éditions inline rend la table confuse.

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

> **En résumé** : `->hintAction()` ajoute un petit bouton discret directement dans la cellule (en général une icône à droite). C'est différent des actions de ligne qui sont groupées dans la dernière colonne : ici l'action est contextuelle à une colonne précise. Utile pour des actions courtes liées à la valeur affichée (ex : annuler un abonnement depuis la cellule "Plan").

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
