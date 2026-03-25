# Étape 2 — Resource `Book`

## 2.1 Générer la Resource

```bash
php artisan make:filament-resource Book --generate --view
```

- `--generate` : crée automatiquement `form()` et `table()` à partir des colonnes de la table
- `--view` : ajoute la page `ViewBook` (utilisée pour l'Infolist à l'étape 5)

Fichiers générés :

```
app/Filament/Resources/BookResource.php
app/Filament/Resources/BookResource/Pages/
    ListBooks.php
    CreateBook.php
    EditBook.php
    ViewBook.php
```

---

## 2.2 Configurer le formulaire `form()`

Dans `BookResource.php`, remplace le contenu de `form()` :

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('title')
            ->required()
            ->maxLength(255),

        Forms\Components\Select::make('author_id')
            ->relationship('author', 'name')
            ->searchable()
            ->preload()
            ->required(),

        Forms\Components\TextInput::make('isbn')
            ->label('ISBN')
            ->unique(ignoreRecord: true)
            ->maxLength(20),

        Forms\Components\DatePicker::make('published_at')
            ->label('Date de parution'),

        Forms\Components\FileUpload::make('cover')
            ->label('Couverture')
            ->image()
            ->directory('covers'),

        Forms\Components\Toggle::make('is_available')
            ->label('Disponible')
            ->default(true),
    ]);
}
```

> `->relationship('author', 'name')` sur le `Select` charge automatiquement les auteurs depuis la BDD et affiche leur `name`. Pas besoin d'écrire la query.

---

## 2.3 Configurer la table `table()`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\ImageColumn::make('cover')
                ->label(''),

            Tables\Columns\TextColumn::make('title')
                ->label('Titre')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('author.name')
                ->label('Auteur')
                ->sortable()
                ->searchable(),

            Tables\Columns\TextColumn::make('isbn')
                ->label('ISBN')
                ->toggleable(isToggledHiddenByDefault: true),

            Tables\Columns\TextColumn::make('published_at')
                ->label('Parution')
                ->date('d/m/Y')
                ->sortable(),

            Tables\Columns\IconColumn::make('is_available')
                ->label('Disponible')
                ->boolean(),
        ])
        ->filters([
            Tables\Filters\TernaryFilter::make('is_available')
                ->label('Disponibilité')
                ->trueLabel('Disponibles')
                ->falseLabel('Empruntés'),
        ])
        ->actions([
            Tables\Actions\ViewAction::make(),
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('title');
}
```

---

## 2.4 Configurer `getPages()`

Vérifie que `ViewBook` est bien déclaré dans `getPages()` :

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

---

## 2.5 Vérifier

Lance le serveur et rends-toi sur `/admin/books`. Tu dois pouvoir :

- Créer un livre (formulaire complet avec upload de couverture)
- Voir la liste avec filtre disponibilité
- Trier par titre ou date de parution
