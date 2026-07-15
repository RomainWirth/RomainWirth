# Étape 4 — RelationManagers imbriqués

## 4.1 Générer le `MessagesRelationManager`

```bash
php artisan make:filament-relation-manager TicketResource messages subject
```

Fichier généré : `app/Filament/Resources/TicketResource/RelationManagers/MessagesRelationManager.php`

---

## 4.2 Configurer `MessagesRelationManager`

Ce RelationManager affiche le fil de messages d'un ticket dans la page d'édition.

```php
class MessagesRelationManager extends RelationManager
{
    protected static string $relationship = 'messages';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->columns([
                Tables\Columns\TextColumn::make('author.name')
                    ->label('Auteur'),

                Tables\Columns\IconColumn::make('is_internal')
                    ->label('Note interne')
                    ->boolean()
                    ->trueIcon('heroicon-m-lock-closed')
                    ->falseIcon('heroicon-m-chat-bubble-left'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->modifyQueryUsing(function ($query) {
                // Masquer les notes internes aux non-agents
                if (! auth()->user()->hasRole(['agent', 'super-admin'])) {
                    $query->where('is_internal', false);
                }
            })
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->mutateFormDataUsing(function (array $data): array {
                        // Injecter automatiquement l'auteur
                        $data['user_id'] = auth()->id();
                        return $data;
                    }),
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
            ])
            ->defaultSort('created_at');
    }

    public function form(Form $form): Form
    {
        return $form->schema([
            // Le contenu Block Builder sera configuré à l'étape 5
            // Pour l'instant, un champ texte simple
            Forms\Components\Textarea::make('content')
                ->label('Message')
                ->required()
                ->rows(4)
                ->columnSpanFull(),

            Forms\Components\Toggle::make('is_internal')
                ->label('Note interne (visible agents uniquement)')
                ->default(false),
        ]);
    }
}
```

> `mutateFormDataUsing()` sur `CreateAction` permet d'injecter l'`user_id` de l'auteur sans l'exposer dans le formulaire — c'est l'équivalent du hook `mutateFormDataBeforeCreate()` mais directement sur l'action.

---

## 4.3 Déclarer le RelationManager dans `TicketResource`

Dans `TicketResource.php` :

```php
public static function getRelations(): array
{
    return [
        RelationManagers\MessagesRelationManager::class,
    ];
}
```

---

## 4.4 Générer le `AttachmentsRelationManager`

```bash
php artisan make:filament-relation-manager MessageResource attachments original_name
```

> Note : ce RelationManager s'affiche dans la page d'édition d'un `Message`. Il nécessite une Resource `Message` — génère-la si elle n'existe pas encore :

```bash
php artisan make:filament-resource Message --generate
```

---

## 4.5 Configurer `AttachmentsRelationManager`

```php
class AttachmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'attachments';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('original_name')
            ->columns([
                Tables\Columns\TextColumn::make('original_name')
                    ->label('Fichier')
                    ->searchable(),

                Tables\Columns\TextColumn::make('mime_type')
                    ->label('Type'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ajouté le')
                    ->dateTime('d/m/Y H:i'),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\FileUpload::make('path')
                ->label('Fichier')
                ->required()
                ->directory('attachments')
                ->afterStateUpdated(function ($state, callable $set) {
                    if ($state) {
                        $set('original_name', $state->getClientOriginalName());
                        $set('mime_type', $state->getMimeType());
                    }
                }),

            Forms\Components\TextInput::make('original_name')
                ->label('Nom original')
                ->readOnly(),

            Forms\Components\TextInput::make('mime_type')
                ->label('Type MIME')
                ->readOnly(),
        ]);
    }
}
```

---

## 4.6 Vérifier

- Ouvre un ticket en édition → l'onglet **Messages** apparaît en bas
- Crée un message depuis le RelationManager
- Les notes internes sont masquées si l'utilisateur n'est pas agent
- Ouvre un message en édition → l'onglet **Attachments** apparaît
