# Étape 2 — Resource `Category`

## 2.1 Générer la Resource

```bash
php artisan make:filament-resource Category --generate
```

Fichiers générés :

```
app/Filament/Resources/CategoryResource.php
app/Filament/Resources/CategoryResource/Pages/
    ListCategories.php
    CreateCategory.php
    EditCategory.php
```

---

## 2.2 Configurer le formulaire `form()`

Dans `CategoryResource.php` :

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->label('Nom')
            ->required()
            ->maxLength(100),

        Forms\Components\ColorPicker::make('color')
            ->label('Couleur'),
    ]);
}
```

> `ColorPicker` est un composant Filament natif qui affiche un sélecteur de couleur visuel et stocke la valeur hexadécimale (ex : `#6366f1`).

---

## 2.3 Configurer la table `table()`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\ColorColumn::make('color')
                ->label(''),

            Tables\Columns\TextColumn::make('name')
                ->label('Nom')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('tasks_count')
                ->label('Tâches')
                ->counts('tasks')
                ->sortable(),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('name');
}
```

> `->counts('tasks')` génère automatiquement un `SELECT COUNT(*)` via `withCount('tasks')`. La relation `tasks` doit être définie sur le modèle `Category`.

---

## 2.4 Vérifier

Rends-toi sur `/admin/categories`, crée quelques catégories (ex : Travail, Personnel, Courses) avec des couleurs différentes.
Ces catégories seront disponibles dans le formulaire de création de tâches à l'étape suivante.
