# Phase 1 — Étape 3 : Resource Article

## 3.1 Générer la Resource

```bash
php artisan make:filament-resource Article --generate --view
```

> `--view` génère aussi la page `ViewArticle` pour lire un article sans l'éditer.

---

## 3.2 Formulaire complet

```php
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Illuminate\Support\Str;

public static function form(Form $form): Form
{
    return $form->schema([
        Section::make('Contenu')
            ->schema([
                TextInput::make('title')
                    ->label('Titre')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        if ($operation === 'create') {
                            $set('slug', Str::slug($state));
                        }
                    }),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                Textarea::make('excerpt')
                    ->label('Extrait')
                    ->rows(3)
                    ->maxLength(500)
                    ->columnSpanFull(),

                RichEditor::make('body')
                    ->label('Corps de l\'article')
                    ->toolbarButtons([
                        'bold', 'italic', 'underline', 'strike',
                        'h2', 'h3',
                        'bulletList', 'orderedList', 'blockquote',
                        'link', 'codeBlock',
                    ])
                    ->columnSpanFull(),
            ])
            ->columns(2),

        Section::make('Paramètres')
            ->schema([
                Select::make('category_id')
                    ->label('Catégorie')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->nullable(),

                FileUpload::make('cover_image')
                    ->label('Image de couverture')
                    ->image()
                    ->directory('articles/covers')
                    ->imageResizeMode('cover')
                    ->imageCropAspectRatio('16:9'),

                Toggle::make('is_published')
                    ->label('Publié')
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set) {
                        // Remplir published_at automatiquement si on publie
                        if ($state) {
                            $set('published_at', now());
                        }
                    }),

                DateTimePicker::make('published_at')
                    ->label('Date de publication')
                    ->visible(fn ($get) => $get('is_published'))
                    ->nullable(),
            ])
            ->columns(2),
    ]);
}
```

> `->live()` sur le `Toggle` permet au `DateTimePicker` de s'afficher/masquer dynamiquement selon l'état de publication.

---

## 3.3 Table avec image, badge et filtres

```php
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            ImageColumn::make('cover_image')
                ->label('')
                ->circular(false)
                ->height(48)
                ->width(80),

            TextColumn::make('title')
                ->label('Titre')
                ->searchable()
                ->sortable()
                ->limit(50),

            TextColumn::make('category.name')
                ->label('Catégorie')
                ->badge()
                ->color(fn ($record) => $record->category?->color ?? 'gray'),

            ToggleColumn::make('is_published')
                ->label('Publié'),

            TextColumn::make('published_at')
                ->label('Publié le')
                ->dateTime('d/m/Y H:i')
                ->sortable()
                ->placeholder('—'),

            TextColumn::make('updated_at')
                ->label('Modifié le')
                ->dateTime('d/m/Y')
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ])
        ->filters([
            TernaryFilter::make('is_published')
                ->label('Statut')
                ->trueLabel('Publiés')
                ->falseLabel('Brouillons')
                ->placeholder('Tous'),

            SelectFilter::make('category')
                ->label('Catégorie')
                ->relationship('category', 'name')
                ->searchable()
                ->preload(),
        ])
        ->actions([
            Tables\Actions\ViewAction::make(),
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('updated_at', 'desc');
}
```

> `ToggleColumn` permet de publier/dépublier un article directement depuis la table sans ouvrir le formulaire d'édition.

---

## 3.4 Vérifier

- Crée un article avec un titre → le slug se génère automatiquement
- Active le `RichEditor` : les boutons de mise en forme fonctionnent
- Uploade une image de couverture → elle s'affiche en miniature dans la table
- Active **Publié** → le champ **Date de publication** apparaît et se pré-remplit avec l'heure actuelle
- Les filtres **Statut** et **Catégorie** fonctionnent dans la table
