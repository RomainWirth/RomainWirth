# Étape 3 — Resource `Author` & RelationManager

## 3.1 Générer la Resource Author

```bash
php artisan make:filament-resource Author --generate
```

Fichiers générés :

```
app/Filament/Resources/AuthorResource.php
app/Filament/Resources/AuthorResource/Pages/
    ListAuthors.php
    CreateAuthor.php
    EditAuthor.php
```

---

## 3.2 Configurer le formulaire `form()`

Dans `AuthorResource.php` :

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('name')
            ->required()
            ->maxLength(255),

        Forms\Components\TextInput::make('nationality')
            ->label('Nationalité')
            ->maxLength(100),

        Forms\Components\DatePicker::make('birth_date')
            ->label('Date de naissance'),
    ]);
}
```

---

## 3.3 Configurer la table `table()`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('name')
                ->label('Nom')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('nationality')
                ->label('Nationalité')
                ->sortable(),

            Tables\Columns\TextColumn::make('birth_date')
                ->label('Naissance')
                ->date('d/m/Y')
                ->sortable(),

            Tables\Columns\TextColumn::make('books_count')
                ->label('Livres')
                ->counts('books')   // SELECT COUNT(*) via withCount()
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

## 3.4 Créer le RelationManager `BooksRelationManager`

Un RelationManager est une mini-table Filament embarquée dans la page d'édition d'un auteur. Elle affiche automatiquement uniquement les livres de l'auteur en cours d'édition.

```bash
php artisan make:filament-relation-manager AuthorResource books title
```

Fichier généré : `app/Filament/Resources/AuthorResource/RelationManagers/BooksRelationManager.php`

---

## 3.5 Configurer le RelationManager

```php
class BooksRelationManager extends RelationManager
{
    // Nom de la relation Eloquent sur Author
    protected static string $relationship = 'books';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Titre')
                    ->searchable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Parution')
                    ->date('d/m/Y'),

                Tables\Columns\IconColumn::make('is_available')
                    ->label('Disponible')
                    ->boolean(),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(), // bouton "Ajouter un livre" en haut
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('title')
                ->required()
                ->maxLength(255),

            Forms\Components\DatePicker::make('published_at')
                ->label('Date de parution'),

            Forms\Components\Toggle::make('is_available')
                ->label('Disponible')
                ->default(true),
        ]);
    }
}
```

> Le `author_id` est injecté automatiquement par Filament — pas besoin de l'inclure dans le formulaire du RelationManager.

---

## 3.6 Déclarer le RelationManager dans AuthorResource

Dans `AuthorResource.php`, ajoute la méthode `getRelations()` :

```php
public static function getRelations(): array
{
    return [
        RelationManagers\BooksRelationManager::class,
    ];
}
```

---

## 3.7 Vérifier

Rends-toi sur `/admin/authors`, crée un auteur, puis ouvre-le en édition.
En bas de la page, un onglet **Books** doit apparaître avec la table des livres de cet auteur.
Tu peux créer un livre directement depuis cette table — il sera automatiquement associé à l'auteur.
