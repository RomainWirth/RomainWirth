# Étape 5 — Block Builder pour les messages

> Référence cours : `I_FORMS/02_BLOC_BUILDER.md`

---

## 5.1 Pourquoi le Block Builder ?

Le contenu d'un `Message` peut varier : texte simple, bloc de code, citation, etc. Le Block Builder permet à l'agent de choisir le type de bloc et de l'éditer avec des champs adaptés. Le résultat est stocké en JSON dans la colonne `content` (déjà castée `'array'` dans la migration étape 1).

---

## 5.2 Modèle `Message` — cast JSON

Dans `app/Models/Message.php`, vérifie que le cast est bien en place :

```php
protected $casts = [
    'content' => 'array',
];
```

---

## 5.3 Remplacer le `Textarea` dans le formulaire

Dans `MessagesRelationManager` (ou dans `MessageResource` si elle existe), remplace le champ `content` par un `Builder` :

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;

// Dans form() :
Builder::make('content')
    ->label('Contenu du message')
    ->required()
    ->columnSpanFull()
    ->blocks([

        Block::make('paragraph')
            ->label('Texte')
            ->icon('heroicon-m-bars-3-bottom-left')
            ->schema([
                RichEditor::make('text')
                    ->label('Contenu')
                    ->required()
                    ->toolbarButtons([
                        'bold', 'italic', 'underline',
                        'bulletList', 'orderedList', 'link',
                    ]),
            ]),

        Block::make('code_block')
            ->label('Bloc de code')
            ->icon('heroicon-m-code-bracket')
            ->schema([
                Select::make('language')
                    ->label('Langage')
                    ->options([
                        'php'        => 'PHP',
                        'javascript' => 'JavaScript',
                        'bash'       => 'Bash',
                        'sql'        => 'SQL',
                        'other'      => 'Autre',
                    ])
                    ->default('php'),

                Textarea::make('code')
                    ->label('Code')
                    ->required()
                    ->rows(6)
                    ->fontFamily('mono'),
            ]),

        Block::make('quote')
            ->label('Citation')
            ->icon('heroicon-m-chat-bubble-bottom-center-text')
            ->schema([
                TextInput::make('source')
                    ->label('Source (auteur / ticket référencé)'),

                Textarea::make('text')
                    ->label('Citation')
                    ->required()
                    ->rows(3),
            ]),

    ]),
```

---

## 5.4 Afficher le contenu dans l'Infolist (vue Blade)

Pour rendre le JSON dans un `ViewEntry` de l'Infolist, crée une vue Blade :

```bash
mkdir -p resources/views/filament/infolists
touch resources/views/filament/infolists/message-content.blade.php
```

Dans `message-content.blade.php` :

```blade
<div class="space-y-4">
    @foreach ($getState() as $block)
        @switch($block['type'])

            @case('paragraph')
                <div class="prose dark:prose-invert max-w-none">
                    {!! $block['data']['text'] !!}
                </div>
            @break

            @case('code_block')
                <div class="rounded-lg bg-gray-900 p-4">
                    <p class="mb-2 text-xs font-semibold uppercase text-gray-400">
                        {{ $block['data']['language'] }}
                    </p>
                    <pre class="overflow-x-auto text-sm text-gray-100"><code>{{ $block['data']['code'] }}</code></pre>
                </div>
            @break

            @case('quote')
                <blockquote class="border-l-4 border-primary-500 pl-4 italic text-gray-600 dark:text-gray-400">
                    <p>{{ $block['data']['text'] }}</p>
                    @if ($block['data']['source'])
                        <footer class="mt-1 text-xs font-medium">— {{ $block['data']['source'] }}</footer>
                    @endif
                </blockquote>
            @break

        @endswitch
    @endforeach
</div>
```

Dans l'Infolist du `TicketResource` (ou du `MessagesRelationManager`), utilise ce `ViewEntry` :

```php
use Filament\Infolists\Components\ViewEntry;

ViewEntry::make('content')
    ->label('Message')
    ->view('filament.infolists.message-content')
    ->columnSpanFull(),
```

---

## 5.5 Vérifier

- Crée un nouveau message → le Builder affiche trois types de blocs disponibles
- Ajoute un bloc **Texte**, un bloc **Code** et une **Citation**
- Sauvegarde → la colonne `content` en BDD contient un tableau JSON avec les blocs
- Ouvre la vue en lecture → chaque bloc est rendu avec sa mise en forme propre
