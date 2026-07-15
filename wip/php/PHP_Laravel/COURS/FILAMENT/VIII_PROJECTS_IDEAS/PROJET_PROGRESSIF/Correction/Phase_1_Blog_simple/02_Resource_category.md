# Phase 1 — Étape 2 : Resource Category

## 2.1 Générer la Resource

```bash
php artisan make:filament-resource Category --generate
```

---

## 2.2 Formulaire avec `ColorPicker` et slug auto-généré

Dans `CategoryResource.php` :

```php
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Str;

public static function form(Form $form): Form
{
    return $form->schema([
        TextInput::make('name')
            ->label('Nom')
            ->required()
            ->maxLength(255)
            ->live(onBlur: true)
            ->afterStateUpdated(function (string $operation, $state, callable $set) {
                // Génère le slug uniquement à la création
                if ($operation === 'create') {
                    $set('slug', Str::slug($state));
                }
            }),

        TextInput::make('slug')
            ->label('Slug')
            ->required()
            ->unique(ignoreRecord: true)
            ->maxLength(255),

        ColorPicker::make('color')
            ->label('Couleur')
            ->required(),
    ]);
}
```

> `->live(onBlur: true)` déclenche l'`afterStateUpdated` quand l'utilisateur quitte le champ — plus fluide qu'un `->reactive()` qui se déclenche à chaque frappe.

---

## 2.3 Table avec `ColorColumn` et compteur d'articles

```php
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\TextColumn;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            ColorColumn::make('color')
                ->label('Couleur'),

            TextColumn::make('name')
                ->label('Nom')
                ->sortable()
                ->searchable(),

            TextColumn::make('slug')
                ->label('Slug')
                ->color('gray'),

            TextColumn::make('articles_count')
                ->label('Articles')
                ->counts('articles')
                ->sortable(),
        ])
        ->defaultSort('name');
}
```

> `->counts('articles')` ajoute automatiquement un `withCount('articles')` à la requête Eloquent et affiche le résultat dans la colonne.

---

## 2.4 Vérifier

- Crée plusieurs catégories (ex: "Technologie", "Voyage", "Cuisine")
- Le slug se génère automatiquement depuis le nom
- La couleur s'affiche en pastille dans la table
- La colonne **Articles** affiche `0` pour chaque nouvelle catégorie (elle s'incrémentera à l'étape suivante)
