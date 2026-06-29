# Phase 2 — Étape 6 : Block Builder sur les Pages

> Référence cours : `I_FORMS/02_BLOC_BUILDER.md`

## 6.1 Créer le modèle `Page`

```bash
php artisan make:model Page -m
```

Migration `create_pages_table` :

```php
Schema::create('pages', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();
    $table->json('content')->nullable();   // stocke les blocs
    $table->string('seo_title')->nullable();
    $table->text('seo_description')->nullable();
    $table->string('status')->default('draft'); // draft | published
    $table->timestamps();
});
```

Modèle `app/Models/Page.php` :

```php
class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'content',
        'seo_title', 'seo_description', 'status',
    ];

    protected $casts = [
        'content' => 'array',  // essentiel pour le Block Builder
    ];
}
```

```bash
php artisan migrate
```

---

## 6.2 Générer la Resource

```bash
php artisan make:filament-resource Page --generate --view
```

---

## 6.3 Formulaire avec Block Builder (4 blocs)

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Illuminate\Support\Str;

public static function form(Form $form): Form
{
    return $form->schema([
        Section::make('Page')
            ->schema([
                TextInput::make('title')
                    ->label('Titre')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($operation, $state, callable $set)
                        => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('status')
                    ->label('Statut')
                    ->options(['draft' => 'Brouillon', 'published' => 'Publié'])
                    ->default('draft'),
            ])
            ->columns(2),

        Section::make('Contenu')
            ->schema([
                Builder::make('content')
                    ->label('Blocs de contenu')
                    ->columnSpanFull()
                    ->blocks([

                        Block::make('hero')
                            ->label('Section Hero')
                            ->icon('heroicon-m-star')
                            ->schema([
                                TextInput::make('heading')
                                    ->label('Titre principal')
                                    ->required(),

                                TextInput::make('subheading')
                                    ->label('Sous-titre'),

                                FileUpload::make('background')
                                    ->label('Image de fond')
                                    ->image()
                                    ->directory('pages/hero'),

                                ColorPicker::make('overlay_color')
                                    ->label('Couleur de surimpression')
                                    ->default('#00000066'),
                            ]),

                        Block::make('paragraph')
                            ->label('Texte')
                            ->icon('heroicon-m-bars-3-bottom-left')
                            ->schema([
                                RichEditor::make('content')
                                    ->label('Contenu')
                                    ->required()
                                    ->toolbarButtons([
                                        'bold', 'italic', 'underline',
                                        'h2', 'h3', 'bulletList', 'orderedList',
                                        'link', 'blockquote',
                                    ]),
                            ]),

                        Block::make('image')
                            ->label('Image')
                            ->icon('heroicon-m-photo')
                            ->schema([
                                Select::make('media_id')
                                    ->label('Choisir depuis la médiathèque')
                                    ->options(fn () => \App\Models\Media::where('mime_type', 'like', 'image/%')
                                        ->pluck('name', 'id'))
                                    ->searchable(),

                                TextInput::make('caption')
                                    ->label('Légende'),

                                Select::make('alignment')
                                    ->label('Alignement')
                                    ->options([
                                        'left'   => 'Gauche',
                                        'center' => 'Centre',
                                        'right'  => 'Droite',
                                    ])
                                    ->default('center'),
                            ]),

                        Block::make('cta')
                            ->label('Appel à l\'action')
                            ->icon('heroicon-m-cursor-arrow-rays')
                            ->schema([
                                TextInput::make('text')
                                    ->label('Texte du bouton')
                                    ->required(),

                                TextInput::make('url')
                                    ->label('URL')
                                    ->url()
                                    ->required(),

                                ColorPicker::make('button_color')
                                    ->label('Couleur du bouton')
                                    ->default('#6366f1'),

                                Select::make('size')
                                    ->label('Taille')
                                    ->options(['sm' => 'Petit', 'md' => 'Moyen', 'lg' => 'Grand'])
                                    ->default('md'),
                            ]),

                    ]),
            ]),

        Section::make('SEO')
            ->schema([
                TextInput::make('seo_title')
                    ->label('Titre SEO')
                    ->maxLength(60),

                Textarea::make('seo_description')
                    ->label('Description SEO')
                    ->maxLength(160)
                    ->rows(2),
            ])
            ->collapsed(),
    ]);
}
```

---

## 6.4 Vue Blade pour le rendu des blocs

```bash
mkdir -p resources/views/filament/pages
touch resources/views/filament/pages/page-content.blade.php
```

Dans `page-content.blade.php` :

```blade
<div class="space-y-8">
    @foreach ($getState() ?? [] as $block)
        @switch($block['type'])

            @case('hero')
                <div class="relative rounded-xl overflow-hidden min-h-48 flex items-center justify-center text-white"
                     style="background-image: url('{{ $block["data"]["background"] ? asset("storage/".$block["data"]["background"]) : "" }}'); background-size: cover; background-color: {{ $block['data']['overlay_color'] ?? '#6366f1' }};">
                    <div class="text-center p-8">
                        <h1 class="text-3xl font-bold">{{ $block['data']['heading'] }}</h1>
                        @if ($block['data']['subheading'] ?? null)
                            <p class="mt-2 text-lg opacity-90">{{ $block['data']['subheading'] }}</p>
                        @endif
                    </div>
                </div>
            @break

            @case('paragraph')
                <div class="prose dark:prose-invert max-w-none">
                    {!! $block['data']['content'] !!}
                </div>
            @break

            @case('image')
                @php $media = \App\Models\Media::find($block['data']['media_id'] ?? null) @endphp
                @if ($media)
                    <figure class="text-{{ $block['data']['alignment'] ?? 'center' }}">
                        <img src="{{ $media->url }}" alt="{{ $media->alt_text }}" class="inline-block max-w-full rounded-lg">
                        @if ($block['data']['caption'] ?? null)
                            <figcaption class="mt-2 text-sm text-gray-500">{{ $block['data']['caption'] }}</figcaption>
                        @endif
                    </figure>
                @endif
            @break

            @case('cta')
                <div class="text-center">
                    <a href="{{ $block['data']['url'] }}"
                       class="inline-block px-6 py-3 rounded-lg text-white font-semibold"
                       style="background-color: {{ $block['data']['button_color'] ?? '#6366f1' }}; font-size: {{ ['sm'=>'0.875rem','md'=>'1rem','lg'=>'1.125rem'][$block['data']['size'] ?? 'md'] }};">
                        {{ $block['data']['text'] }}
                    </a>
                </div>
            @break

        @endswitch
    @endforeach
</div>
```

---

## 6.5 Vérifier

- Crée une page et ajoute les 4 types de blocs
- Les blocs sont réordonnables par glisser-déposer dans le Builder
- Sauvegarde → la colonne `content` en BDD contient un JSON avec la liste des blocs
- La vue Blade rend chaque bloc avec sa mise en forme propre (sera utilisée à l'étape 8)
