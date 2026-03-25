# Phase 2 — Étape 7 : Resource Menu et MenuItems

## 7.1 Créer les modèles `Menu` et `MenuItem`

```bash
php artisan make:model Menu -m
php artisan make:model MenuItem -m
```

Migration `create_menus_table` :

```php
Schema::create('menus', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('location')->unique(); // header | footer | sidebar
    $table->timestamps();
});
```

Migration `create_menu_items_table` :

```php
Schema::create('menu_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('menu_id')->constrained()->cascadeOnDelete();
    $table->foreignId('parent_id')->nullable()->constrained('menu_items')->nullOnDelete();
    $table->string('label');
    $table->string('url');
    $table->integer('order')->default(0);
    $table->timestamps();
});
```

Modèle `app/Models/Menu.php` :

```php
class Menu extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'location'];

    public function items(): HasMany
    {
        return $this->hasMany(MenuItem::class)->orderBy('order');
    }
}
```

Modèle `app/Models/MenuItem.php` :

```php
class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = ['menu_id', 'parent_id', 'label', 'url', 'order'];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuItem::class, 'parent_id')->orderBy('order');
    }
}
```

```bash
php artisan migrate
```

---

## 7.2 Générer les Resources

```bash
php artisan make:filament-resource Menu --generate
php artisan make:filament-relation-manager MenuResource items label
```

---

## 7.3 Formulaire `MenuResource` avec Repeater réordonnables

L'approche la plus simple est de gérer les items directement dans un `Repeater` dans le formulaire du Menu :

```php
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;

public static function form(Form $form): Form
{
    return $form->schema([
        TextInput::make('name')
            ->label('Nom du menu')
            ->required(),

        Select::make('location')
            ->label('Emplacement')
            ->options([
                'header'  => 'En-tête',
                'footer'  => 'Pied de page',
                'sidebar' => 'Barre latérale',
            ])
            ->required()
            ->unique(ignoreRecord: true),

        Repeater::make('items')
            ->label('Éléments du menu')
            ->relationship()               // Filament gère la sync avec la relation hasMany
            ->reorderable('order')         // Glisser-déposer pour réordonner
            ->collapsible()
            ->schema([
                TextInput::make('label')
                    ->label('Libellé')
                    ->required(),

                TextInput::make('url')
                    ->label('URL')
                    ->url()
                    ->required()
                    ->placeholder('https://... ou /chemin/relatif'),

                Select::make('parent_id')
                    ->label('Sous-menu de')
                    ->options(
                        // Items du même menu déjà enregistrés (limité à la liste actuelle)
                        fn ($record) => MenuItem::where('menu_id', $record?->id ?? 0)
                            ->whereNull('parent_id')
                            ->pluck('label', 'id')
                    )
                    ->nullable()
                    ->placeholder('(aucun — item racine)'),
            ])
            ->addActionLabel('Ajouter un élément')
            ->columnSpanFull(),
    ]);
}
```

> `->reorderable('order')` indique quelle colonne stocker l'ordre. Filament met à jour cette valeur automatiquement lors du réarrangement par glisser-déposer.

---

## 7.4 Table `MenuResource`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            TextColumn::make('name')
                ->label('Nom')
                ->sortable(),

            TextColumn::make('location')
                ->label('Emplacement')
                ->badge()
                ->formatStateUsing(fn ($state) => match ($state) {
                    'header'  => 'En-tête',
                    'footer'  => 'Pied de page',
                    'sidebar' => 'Barre latérale',
                    default   => $state,
                }),

            TextColumn::make('items_count')
                ->label('Éléments')
                ->counts('items'),
        ]);
}
```

---

## 7.5 Vérifier

- Crée un menu "Navigation principale" avec l'emplacement "En-tête"
- Ajoute 4-5 items (Accueil, À propos, Blog, Contact)
- Réordonne les items par glisser-déposer
- Assign un item comme sous-menu d'un autre → le `parent_id` est enregistré
- La table affiche le compteur d'éléments par menu
