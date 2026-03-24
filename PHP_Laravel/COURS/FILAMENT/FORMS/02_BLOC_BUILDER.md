# Filament Forms - Le Builder de blocs

Doc officielle : [https://filamentphp.com/docs/3.x/forms/fields/builder](https://filamentphp.com/docs/3.x/forms/fields/builder)

## Qu'est-ce que le Builder ?

Le `Builder` est un composant de formulaire qui permet de composer du contenu de manière dynamique à partir de **blocs prédéfinis**. C'est l'équivalent d'un page builder (comme Gutenberg dans WordPress), mais entièrement en PHP/Livewire.

Il persiste ses données sous forme de **JSON** en base de données : un tableau d'objets, chacun ayant un `type` (le nom du bloc) et de directory data (les valeurs des champs du bloc).
```JSON
[
  {
    "type": "hero",
    "data": {
      "title": "Bienvenue",
      "hidden": false,
    }
  },
  {
    "type": "paragraph",
    "data": {
      "content": "<p>Lorem ipsum...</p>",
    }
  },
  {
    "type": "image",
    "data": {
      "caption": "Photo de Paris",
    }
  }
]
```

## 1. Déclaration de base

```PHP
<?php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\RichEditor;

Builder::make('body')
    ->blocks([
        Block::make('hero')
            ->label('Bloc héro')
            ->schema([
                TextInput::make('title')->required(),
                RichEditor::make('subtitle'),
            ]),

        Block::make('paragraph')
            ->label('Paragraphe')
            ->schema([
                RichEditor::make('content')->required(),
            ]),
    ])
```
Le nom passé à `Builder::make('body')` correspond à la colonne JSON en BDD (`body` dans cet exemple).

## 2. Anatomie d'un Block

Un `Block` est simplement un conteneur nommé avec un schéma de formulaire interne. Il peut contenir **n'importe quel composant Filament** : TextInput, Select, FileUpload, Toggle, Repeater, même un autre Builder imbriqué.

```PHP
<?php
Block::make('card')
    ->label('Carte')
    ->icon('heroicon-o-rectangle-stack') // icône dans la liste déroulante
    ->maxItems(3)                         // max 3 blocs de ce type
    ->schema([
        TextInput::make('title')
            ->required()
            ->maxLength(100),

        Textarea::make('description')
            ->rows(3),

        FileUpload::make('image')
            ->image()
            ->imageEditor(),

        Toggle::make('hidden')
            ->label('Masquer ce bloc'),
    ])
    ->columns(2), // grille interne du bloc
```

## 3. Organisation : extraire les blocs en classes

Pour les projets avec beaucoup de blocs, la bonne pratique est d'extraire chaque bloc dans sa propre classe. C'est le pattern recommandé dans la doc officielle.

### Structure de fichiers :

```
app/Filament/Resources/Blocks/
├── HeroBlock.php
├── ParagraphBlock.php
├── ImageBlock.php
├── CTABlock.php
└── Partials/
    └── SharedToggle.php   ← composants partagés entre blocs
```

### Exemple de classe bloc :

```PHP
<?php
// app/Filament/Resources/Blocks/HeroBlock.php

namespace App\Filament\Resources\Blocks;

use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;

class HeroBlock
{
    public static function schema(): Block
    {
        return Block::make('hero')
            ->label('Héro')
            ->icon('heroicon-o-photo')
            ->schema([
                FileUpload::make('image')
                    ->image()
                    ->required()
                    ->columnSpanFull(),

                TextInput::make('title')
                    ->required()
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }
}
```

### Utilisation dans la Resource :

```PHP
<?php
Builder::make('body')
    ->blocks([
        Blocks\HeroBlock::schema(),
        Blocks\ParagraphBlock::schema(),
        Blocks\ImageBlock::schema(),
        Blocks\CTABlock::schema(),
    ]),
```

## 4. Partials partagés entre blocs

Quand plusieurs blocs partagent un même champ (ex : un toggle "masquer ce bloc"), on crée une classe **Partial** :
```PHP
<?php
// app/Filament/Resources/Blocks/Partials/VisibilityToggle.php

namespace App\Filament\Resources\Blocks\Partials;

use Filament\Forms\Components\Toggle;

class VisibilityToggle
{
    public static function make(): Toggle
    {
        return Toggle::make('hidden')
            ->label('Masquer')
            ->onColor('warning')
            ->columnSpanFull();
    }
}
```

### Dans chaque bloc :
```PHP
<?php
Block::make('paragraph')
    ->schema([
        Partials\VisibilityToggle::make(), // ← réutilisé partout
        RichEditor::make('content')->required(),
    ]),
```
comme dans cet exemple :
```PHP
<?php

namespace App\Filament\Resources\Blocks\Partials;

use Filament\Forms\Components\Toggle;

class VisibilityToggle
{
    public static function make(): Toggle
    {
        return Toggle::make('hidden')
            ->label('Hide')
            ->onColor('warning')
            ->columnSpanFull();
    }
}
```

## 5. Options de l'interface utilisateur

```PHP
<?php
Builder::make('body')
    ->blocks([...])
    ->reorderableWithButtons()       // boutons ↑↓ pour réordonner
    ->reorderableWithDragAndDrop()   // drag & drop (défaut)
    ->collapsible()                  // blocs rétractables
    ->collapsed()                    // rétractés par défaut
    ->cloneable()                    // bouton "dupliquer un bloc"
    ->addBetweenBlocksButtonLabel('+ Ajouter ici')
    ->blockNumbers(false)            // masque les numéros de blocs
    ->minItems(1)                    // minimum 1 bloc
    ->maxItems(10),                  // maximum 10 blocs
```

## 6. Limiter certains blocs

On peut contrôler combien de fois un type de bloc spécifique peut être utilisé :
```PHP
<?php
Block::make('hero')
    ->maxItems(1) // un seul héro autorisé par page
    ->schema([...]),

Block::make('paragraph')
    // pas de limite → peut être ajouté autant de fois que souhaité
    ->schema([...]),
```

## 7. Labelisation dynamique des blocs

Par défaut, chaque bloc dans l'interface affiche son `label`. On peut le rendre dynamique en fonction des valeurs saisies :
```PHP
<?php
Block::make('card')
    ->label(function (array $state): string {
        // $state contient les valeurs actuelles du bloc
        return $state['title'] ?? 'Carte sans titre';
    })
    ->schema([
        TextInput::make('title'),
    ]),
```
Très utile pour s'y retrouver quand une page contient 20 blocs.

## 8. Récupérer les données en front-end

Les données JSON stockées en BDD sont structurées ainsi :
```JSON
[
  {
    "type": "hero",
    "data": {
      "title": "Ma page",
      "image": "hero.jpg",
      "hidden": false
    }
  },
  {
    "type": "paragraph",
    "data": {
      "content": "<p>Contenu...</p>",
      "hidden": false
    }
  }
]
```
Pour les rendre côté Blade, on itère sur les blocs :
```PHP
@foreach($page->body as $block)
    @if(!$block['data']['hidden'])
        @switch($block['type'])
            @case('hero')
                <x-blocks.hero :data="$block['data']" />
                @break
            @case('paragraph')
                <x-blocks.paragraph :data="$block['data']" />
                @break
        @endswitch
    @endif
@endforeach
```

## 9. Cast sur le modèle

Pour que Laravel transforme automatiquement la colonne JSON en tableau PHP :
```PHP
<?php
// app/Models/Page.php

protected $casts = [
    'body' => 'array',
    // ou, avec la classe AsArrayObject pour de meilleures performances :
    'body' => AsArrayObject::class,
];
```
Sans ce cast, $page->body retournerait une string JSON brute.

## 10. Builder imbriqué

Un bloc peut lui-même contenir un `Builder` ou un `Repeater` pour des structures plus complexes :
```PHP
<?php
Block::make('faq')
    ->label('FAQ')
    ->schema([
        TextInput::make('heading')->required(),

        Repeater::make('questions')
            ->schema([
                TextInput::make('question')->required(),
                Textarea::make('answer')->required(),
            ])
            ->defaultItems(1)
            ->addActionLabel('Ajouter une question'),
    ]),
```

## Récapitulatif visuel

```
Builder::make('body')
│
├── Block::make('hero')        → { type: "hero",      data: { title, image, hidden } }
├── Block::make('paragraph')   → { type: "paragraph", data: { content, hidden } }
├── Block::make('faq')         → { type: "faq",       data: { heading, questions: [...] } }
└── Block::make('cta')         → { type: "cta",       data: { label, url, hidden } }

Stocké en BDD : colonne JSON (ex: body, related_products)
Rendu en front : switch/case sur le type dans une vue Blade
```

Sources :

Builder component : [https://filamentphp.com/docs/3.x/forms/fields/builder](https://filamentphp.com/docs/3.x/forms/fields/builder)
Block object : [https://filamentphp.com/docs/3.x/forms/fields/builder#blocks](https://filamentphp.com/docs/3.x/forms/fields/builder#blocks)
