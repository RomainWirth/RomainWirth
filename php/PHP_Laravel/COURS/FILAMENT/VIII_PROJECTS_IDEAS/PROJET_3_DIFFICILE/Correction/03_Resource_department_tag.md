# Étape 3 — Resources `Department` & `Tag`

## 3.1 Générer les Resources

```bash
php artisan make:filament-resource Department --generate
php artisan make:filament-resource Tag --generate
```

---

## 3.2 Resource `Department`

### Formulaire

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->label('Nom')
            ->required()
            ->maxLength(100),

        Forms\Components\Textarea::make('description')
            ->label('Description')
            ->rows(3)
            ->columnSpanFull(),
    ]);
}
```

### Table

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')
                ->label('Nom')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('description')
                ->label('Description')
                ->limit(60),

            Tables\Columns\TextColumn::make('tickets_count')
                ->label('Tickets')
                ->counts('tickets')
                ->sortable(),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('name');
}
```

---

## 3.3 Resource `Tag`

### Formulaire

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->label('Nom')
            ->required()
            ->maxLength(50),

        Forms\Components\ColorPicker::make('color')
            ->label('Couleur'),
    ]);
}
```

### Table

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

            Tables\Columns\TextColumn::make('tickets_count')
                ->label('Tickets')
                ->counts('tickets')
                ->sortable(),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('name');
}
```

---

## 3.4 Ajouter les tags (many-to-many) dans `TicketResource`

Dans le formulaire de `TicketResource`, le champ `Select` pour les tags doit utiliser `->multiple()` pour permettre la sélection de plusieurs tags :

```php
Forms\Components\Select::make('tags')
    ->label('Tags')
    ->relationship('tags', 'name')
    ->multiple()
    ->preload()
    ->searchable(),
```

> Filament gère automatiquement la synchronisation de la table pivot `tag_ticket` lors de la sauvegarde du formulaire grâce à `->relationship()` sur un champ `Select` avec `->multiple()`.

---

## 3.5 Vérifier

- Crée quelques départements (Facturation, Technique, Commercial)
- Crée quelques tags (urgent, bug, feature-request, question) avec des couleurs
- Depuis la Resource Ticket, vérifie que les tags s'affichent comme sélection multiple
