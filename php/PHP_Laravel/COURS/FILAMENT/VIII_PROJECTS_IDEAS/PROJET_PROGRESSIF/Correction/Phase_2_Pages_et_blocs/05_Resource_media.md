# Phase 2 — Étape 5 : Resource Media (Médiathèque)

## 5.1 Créer le modèle `Media`

```bash
php artisan make:model Media -m
```

Migration `create_media_table` :

```php
Schema::create('media', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('path');
    $table->string('mime_type')->nullable();
    $table->string('alt_text')->nullable();
    $table->unsignedBigInteger('size')->default(0); // en octets
    $table->timestamps();
});
```

Modèle `app/Models/Media.php` :

```php
class Media extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'path', 'mime_type', 'alt_text', 'size'];

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type ?? '', 'image/');
    }

    public function formattedSize(): string
    {
        if ($this->size < 1024) return $this->size . ' o';
        if ($this->size < 1024 * 1024) return round($this->size / 1024, 1) . ' Ko';
        return round($this->size / (1024 * 1024), 1) . ' Mo';
    }
}
```

```bash
php artisan migrate
php artisan storage:link
```

---

## 5.2 Générer la Resource

```bash
php artisan make:filament-resource Media --generate
```

---

## 5.3 Formulaire avec FileUpload et détection automatique

```php
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;

public static function form(Form $form): Form
{
    return $form->schema([
        FileUpload::make('path')
            ->label('Fichier')
            ->required()
            ->directory('media')
            ->acceptedFileTypes(['image/*', 'application/pdf', 'video/*'])
            ->maxSize(20480) // 20 Mo
            ->afterStateUpdated(function ($state, callable $set) {
                if ($state) {
                    $set('name', $state->getClientOriginalName());
                    $set('mime_type', $state->getMimeType());
                    $set('size', $state->getSize());
                }
            }),

        TextInput::make('name')
            ->label('Nom du fichier')
            ->required(),

        TextInput::make('alt_text')
            ->label('Texte alternatif (images)')
            ->helperText('Important pour l\'accessibilité'),

        TextInput::make('mime_type')
            ->label('Type MIME')
            ->readOnly(),

        TextInput::make('size')
            ->label('Taille (octets)')
            ->readOnly()
            ->numeric(),
    ]);
}
```

---

## 5.4 Table avec galerie et filtre par type

```php
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;

public static function table(Table $table): Table
{
    return $table
        ->columns([
            ImageColumn::make('path')
                ->label('Aperçu')
                ->height(48)
                ->width(72)
                ->defaultImageUrl(asset('images/file-placeholder.svg'))
                ->visibility(fn ($record) => $record->isImage()),

            TextColumn::make('name')
                ->label('Nom')
                ->searchable()
                ->sortable(),

            TextColumn::make('mime_type')
                ->label('Type')
                ->badge()
                ->color(fn ($state) => match(true) {
                    str_starts_with($state ?? '', 'image/') => 'success',
                    str_starts_with($state ?? '', 'video/') => 'info',
                    $state === 'application/pdf'            => 'warning',
                    default                                 => 'gray',
                }),

            TextColumn::make('size')
                ->label('Taille')
                ->formatStateUsing(fn ($state) => match(true) {
                    $state < 1024           => $state . ' o',
                    $state < 1024 * 1024    => round($state / 1024, 1) . ' Ko',
                    default                 => round($state / (1024 * 1024), 1) . ' Mo',
                })
                ->sortable(),

            TextColumn::make('created_at')
                ->label('Ajouté le')
                ->dateTime('d/m/Y')
                ->sortable(),
        ])
        ->filters([
            SelectFilter::make('mime_type')
                ->label('Type de fichier')
                ->options([
                    'image' => 'Images',
                    'video' => 'Vidéos',
                    'pdf'   => 'PDF',
                ])
                ->query(function ($query, array $data) {
                    if (! $data['value']) return $query;
                    return match($data['value']) {
                        'image' => $query->where('mime_type', 'like', 'image/%'),
                        'video' => $query->where('mime_type', 'like', 'video/%'),
                        'pdf'   => $query->where('mime_type', 'application/pdf'),
                        default => $query,
                    };
                }),
        ])
        ->actions([
            Tables\Actions\Action::make('copy_path')
                ->label('Copier le chemin')
                ->icon('heroicon-m-clipboard')
                ->action(fn () => null) // Le vrai copier-coller se fait via JS Alpine
                ->extraAttributes(fn ($record) => [
                    'x-on:click' => "navigator.clipboard.writeText('{$record->url}')",
                ]),
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->defaultSort('created_at', 'desc');
}
```

> L'action "Copier le chemin" utilise Alpine.js (`x-on:click`) pour écrire l'URL dans le presse-papier sans rechargement de page.

---

## 5.5 Vérifier

- Uploade une image JPG → la miniature s'affiche dans la table
- Uploade un PDF → le badge affiche "application/pdf" en orange
- Le filtre **Type de fichier** filtre correctement les résultats
- L'action **Copier le chemin** place l'URL publique dans le presse-papier
