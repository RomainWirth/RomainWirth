# Étape 3 — Resource `Task`

## 3.1 Générer la Resource

```bash
php artisan make:filament-resource Task --generate
```

Fichiers générés :

```
app/Filament/Resources/TaskResource.php
app/Filament/Resources/TaskResource/Pages/
    ListTasks.php
    CreateTask.php
    EditTask.php
```

---

## 3.2 Configurer le formulaire `form()`

Dans `TaskResource.php` :

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('title')
            ->label('Titre')
            ->required()
            ->maxLength(255),

        Forms\Components\Textarea::make('description')
            ->label('Description')
            ->rows(3)
            ->columnSpanFull(),

        Forms\Components\Select::make('category_id')
            ->label('Catégorie')
            ->relationship('category', 'name')
            ->searchable()
            ->preload()
            ->nullable(),

        Forms\Components\Select::make('status')
            ->label('Statut')
            ->options([
                'pending'     => 'En attente',
                'in_progress' => 'En cours',
                'done'        => 'Terminée',
            ])
            ->default('pending')
            ->required(),

        Forms\Components\Select::make('priority')
            ->label('Priorité')
            ->options([
                'low'    => 'Basse',
                'medium' => 'Moyenne',
                'high'   => 'Haute',
            ])
            ->default('medium')
            ->required(),

        Forms\Components\DatePicker::make('due_date')
            ->label('Date d\'échéance'),

        Forms\Components\Toggle::make('is_completed')
            ->label('Terminée')
            ->default(false),
    ])->columns(2);
}
```

> `->columns(2)` organise les champs sur deux colonnes. `->columnSpanFull()` sur la description lui permet d'occuper toute la largeur.

---

## 3.3 Configurer la table `table()`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('title')
                ->label('Titre')
                ->searchable()
                ->sortable(),

            Tables\Columns\TextColumn::make('category.name')
                ->label('Catégorie')
                ->badge()
                ->color(fn (?string $state, Task $record): string => $record->category?->color ?? 'gray'),

            Tables\Columns\TextColumn::make('status')
                ->label('Statut')
                ->badge()
                ->formatStateUsing(fn (string $state): string => match ($state) {
                    'pending'     => 'En attente',
                    'in_progress' => 'En cours',
                    'done'        => 'Terminée',
                    default       => $state,
                })
                ->color(fn (string $state): string => match ($state) {
                    'pending'     => 'warning',
                    'in_progress' => 'primary',
                    'done'        => 'success',
                    default       => 'gray',
                }),

            Tables\Columns\TextColumn::make('priority')
                ->label('Priorité')
                ->badge()
                ->formatStateUsing(fn (string $state): string => match ($state) {
                    'low'    => 'Basse',
                    'medium' => 'Moyenne',
                    'high'   => 'Haute',
                    default  => $state,
                })
                ->color(fn (string $state): string => match ($state) {
                    'low'    => 'gray',
                    'medium' => 'warning',
                    'high'   => 'danger',
                    default  => 'gray',
                }),

            Tables\Columns\TextColumn::make('due_date')
                ->label('Échéance')
                ->date('d/m/Y')
                ->sortable(),

            Tables\Columns\IconColumn::make('is_completed')
                ->label('Terminée')
                ->boolean(),
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('status')
                ->label('Statut')
                ->options([
                    'pending'     => 'En attente',
                    'in_progress' => 'En cours',
                    'done'        => 'Terminée',
                ]),

            Tables\Filters\SelectFilter::make('category_id')
                ->label('Catégorie')
                ->relationship('category', 'name'),

            Tables\Filters\SelectFilter::make('priority')
                ->label('Priorité')
                ->options([
                    'low'    => 'Basse',
                    'medium' => 'Moyenne',
                    'high'   => 'Haute',
                ]),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('due_date');
}
```

---

## 3.4 Vérifier

Rends-toi sur `/admin/tasks`. Tu dois pouvoir :

- Créer une tâche avec tous ses champs
- Voir les badges colorés pour le statut et la priorité dans la liste
- Filtrer par statut, catégorie ou priorité
- Trier par date d'échéance
