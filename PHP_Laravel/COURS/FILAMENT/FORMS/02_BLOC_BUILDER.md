# Filament Forms - Le Builder de blocs

Doc officielle : [https://filamentphp.com/docs/3.x/forms/fields/builder](https://filamentphp.com/docs/3.x/forms/fields/builder)

← [Retour : Introduction](01_INTRODUCTION.md)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| — | [Qu'est-ce que le Builder ?](#quest-ce-que-le-builder-) | Un page builder PHP/Livewire qui persiste son contenu en JSON. |
| 1 | [Déclaration de base](#1-déclaration-de-base) | `Builder::make('colonne')` + liste de `Block::make('type')`. |
| 2 | [Anatomie d'un Block](#2-anatomie-dun-block) | Un bloc = un nom + un schéma de champs + options d'affichage. |
| 3 | [Extraire les blocs en classes](#3-organisation--extraire-les-blocs-en-classes) | Un fichier par bloc pour garder la Resource lisible. |
| 4 | [Partials partagés](#4-partials-partagés-entre-blocs) | Factoriser les champs communs à plusieurs blocs. |
| 5 | [Options UI](#5-options-de-linterface-utilisateur) | Drag & drop, collapse, clone, min/max blocs… |
| 6 | [Limiter certains blocs](#6-limiter-certains-blocs) | `->maxItems(1)` sur un `Block` pour le limiter indépendamment. |
| 7 | [Label dynamique](#7-labelisation-dynamique-des-blocs) | Afficher le titre saisi dans l'en-tête du bloc. |
| 8 | [Rendu front-end](#8-récupérer-les-données-en-front-end) | Itérer sur le JSON avec un `@switch` Blade. |
| 9 | [Cast sur le modèle](#9-cast-sur-le-modèle) | Déclarer `'body' => 'array'` pour éviter une string JSON brute. |
| 10 | [Builder imbriqué](#10-builder-imbriqué) | Un bloc peut contenir un `Repeater` ou un autre `Builder`. |
| — | [Récapitulatif visuel](#récapitulatif-visuel) | Schéma complet Builder → JSON → BDD → Blade. |

---

## Qu'est-ce que le Builder ?

> **En résumé** : Le Builder permet à un éditeur de contenu de composer une page depuis un back-office en assemblant des blocs (hero, paragraphe, image, FAQ…) dans l'ordre qu'il souhaite. Côté technique c'est un champ de formulaire qui stocke son contenu dans une colonne JSON. Du côté PHP/Filament on définit les blocs disponibles et leurs champs ; du côté Blade on lit le JSON pour l'afficher.

Le `Builder` est un composant de formulaire qui permet de composer du contenu de manière dynamique à partir de **blocs prédéfinis**. C'est l'équivalent d'un page builder (comme Gutenberg dans WordPress), mais entièrement en PHP/Livewire.

Il persiste ses données sous forme de **JSON** en base de données : un tableau d'objets, chacun ayant un `type` (le nom du bloc) et les `data` (les valeurs des champs du bloc).
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

> **En résumé** : On appelle `Builder::make('nom_colonne')` et on passe la liste des blocs disponibles via `->blocks([...])`. Le `nom_colonne` doit correspondre exactement à la colonne JSON en BDD. Chaque `Block::make('type')` définit un type de bloc avec son propre schéma de champs.

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

> **En résumé** : Un `Block` est un mini-formulaire identifié par un nom unique. On lui attribue un label lisible, une icône optionnelle, un nombre max d'occurrences, et un schéma de champs exactement comme pour un formulaire Filament classique. Les champs peuvent utiliser `->columns()` pour la mise en page interne.

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

> **En résumé** : Quand il y a plus de 2-3 blocs, on évite de tout écrire dans la Resource. Chaque bloc devient une classe PHP dans un dossier `Blocks/`, avec une méthode `schema()` statique. La Resource n'appelle plus que `HeroBlock::schema()` — elle reste lisible quelle que soit la complexité.

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

> **En résumé** : Même principe que pour les sections de formulaire : si un champ (ex : un toggle "Masquer ce bloc") est présent dans tous les blocs, on l'extrait dans une classe `Partials/VisibilityToggle.php` avec une méthode `make()` statique. On l'appelle alors dans chaque bloc à la place de dupliquer le code.

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

## 5. Options de l'interface utilisateur

> **En résumé** : Le Builder expose de nombreuses options pour contrôler l'expérience éditeur. Les plus utiles : `->collapsible()` pour replier les blocs quand la liste est longue, `->cloneable()` pour dupliquer un bloc existant, et `->reorderableWithDragAndDrop()` (activé par défaut). `->minItems()` / `->maxItems()` définissent des contraintes globales sur le nombre total de blocs.

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

> **En résumé** : `->maxItems(N)` sur un `Block` individuel limite ce bloc spécifique indépendamment des autres. Exemple typique : autoriser un seul bloc `hero` par page mais un nombre illimité de blocs `paragraph`. À distinguer du `->maxItems()` global sur le `Builder` qui limite le total de tous les blocs.

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

> **En résumé** : Par défaut l'en-tête d'un bloc affiche juste son type (ex : "Carte"). En passant une closure à `->label()`, on peut y afficher la valeur d'un champ interne (ex : le titre saisi). Très pratique quand la liste contient de nombreux blocs du même type : l'éditeur voit directement son contenu sans avoir à déplier chaque bloc.

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

> **En résumé** : En front, `$page->body` est un tableau PHP (grâce au cast). On boucle dessus et on dispatche sur le `type` pour inclure le bon composant Blade. Chaque composant Blade reçoit `$data` (les valeurs du bloc). On peut ajouter une condition `hidden` pour masquer un bloc sans le supprimer.

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

> **En résumé** : Sans cast, `$page->body` renvoie une string JSON brute — inutilisable directement. On déclare `'body' => 'array'` dans `$casts` pour que Laravel la désérialise automatiquement. Pour de meilleures performances sur de gros JSON, `AsArrayObject::class` est préférable car il évite la copie du tableau à chaque accès.

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

> **En résumé** : Un `Block` peut contenir un `Repeater` (liste d'éléments identiques) ou un autre `Builder` (sous-blocs de types différents). C'est utile pour des structures comme une FAQ (1 bloc FAQ qui contient N questions/réponses). Attention à ne pas trop imbriquer : la complexité de l'UI éditeur et du JSON stocké augmente rapidement.

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
