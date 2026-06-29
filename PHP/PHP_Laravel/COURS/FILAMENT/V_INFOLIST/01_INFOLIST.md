# Filament - L'Infolist

Doc officielle : [https://filamentphp.com/docs/3.x/infolists/overview](https://filamentphp.com/docs/3.x/infolists/overview)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Qu'est-ce qu'un Infolist ?](#1-quest-ce-quun-infolist-) | L'équivalent lecture seule d'un formulaire : afficher sans éditer. |
| 2 | [Activer la page View](#2-activer-la-page-view-sur-une-resource) | Ajouter la page `ViewRecord` à la Resource via `getPages()`. |
| 3 | [Définir l'Infolist](#3-définir-linfolist-dans-la-resource) | Méthode `infolist()` dans la Resource avec des `Entry` et des `Section`. |
| 4 | [Composants d'entrée (Entry)](#4-les-composants-dentrée-entry) | `TextEntry`, `BadgeEntry`, `ImageEntry`, `IconEntry`, `RepeatableEntry`… |
| 5 | [Mise en page](#5-mise-en-page) | `Section`, `Grid`, `Split`, `Tabs` : identiques aux layouts de formulaire. |
| 6 | [Actions dans un Infolist](#6-actions-dans-un-infolist) | Ajouter des boutons d'action sur une `Section` ou un `Entry`. |
| 7 | [Hors Resource (Livewire custom)](#7-infolist-dans-un-contexte-autre-quune-resource) | Trait `InteractsWithInfolists` pour utiliser un Infolist dans un Widget. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble composants / layout / contextes / actions. |

---

## 1. Qu'est-ce qu'un Infolist ?

> **En résumé** : L'Infolist est la version affichage-seulement d'un formulaire. Là où `form()` utilise des `TextInput`, `Select`… que l'utilisateur peut modifier, `infolist()` utilise des `TextEntry`, `BadgeEntry`… en lecture seule. C'est la base de la page `ViewRecord`. Les composants de layout (`Section`, `Grid`, `Tabs`…) sont identiques à ceux des formulaires.

Un Infolist est l'équivalent lecture seule d'un formulaire. Il sert à afficher les données d'un record de manière structurée, sans champs éditables. C'est la base de la page ViewRecord dans une Resource.

|             | Formulaire (`form()`)                       | Infolist (`infolist()`)             |
| ----------- | ------------------------------------------- | ----------------------------------- |
| Contexte    | Créer / éditer	                            | Afficher / consulter                |
| Composants  | TextInput, Select...                        |	TextEntry, BadgeEntry...            |
| Interaction | Éditable                                    | Lecture seule                       |
| State       | Hydraté depuis le modèle, sauvegardé en BDD |	Hydraté depuis le modèle uniquement |

## 2. Activer la page View sur une Resource

> **En résumé** : La page `ViewRecord` n'est pas générée par défaut. On l'ajoute soit en passant `--view` lors de la génération de la Resource, soit en déclarant manuellement `'view' => Pages\ViewPost::route('/{record}')` dans `getPages()`. Une fois ajoutée, Filament affiche automatiquement un bouton "Voir" dans la table et gère le routing.

```bash
php artisan make:filament-resource Post --generate --view
```
Ou ajouter manuellement la page dans `getPages()` :
```PHP
<?php
public static function getPages(): array
{
    return [
        'index'  => Pages\ListPosts::route('/'),
        'create' => Pages\CreatePost::route('/create'),
        'view'   => Pages\ViewPost::route('/{record}'),   // ← page View
        'edit'   => Pages\EditPost::route('/{record}/edit'),
    ];
}
```

## 3. Définir l'Infolist dans la Resource

> **En résumé** : La méthode `infolist()` fonctionne exactement comme `form()` : on lui passe un `->schema([...])` avec des composants. La différence : les composants sont des `Entry` (lecture seule) au lieu de champs éditables. La dot-notation (`author.name`) charge les relations automatiquement, comme en formulaire. Le layout (`Section`, `->columns()`…) est identique.

```PHP
<?php
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\BadgeEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\Section;

public static function infolist(Infolist $infolist): Infolist
{
    return $infolist
        ->schema([
            Section::make('Informations générales')
                ->schema([
                    TextEntry::make('title')
                        ->label('Titre'),
                    TextEntry::make('author.name')
                        ->label('Auteur'),
                    TextEntry::make('published_at')
                        ->label('Publié le')
                        ->dateTime('d/m/Y à H:i'),
                    BadgeEntry::make('status')
                        ->label('Statut')
                        ->colors([
                            'warning' => 'draft',
                            'success' => 'published',
                            'danger'  => 'archived',
                        ]),
                ])->columns(2),

            Section::make('Contenu')
                ->schema([
                    TextEntry::make('body')
                        ->html() // rendu HTML brut
                        ->columnSpanFull(),
                ]),
        ]);
}
```
## 4. Les composants d'entrée (`Entry`)

> **En résumé** : Chaque `Entry` est l'équivalent lecture seule d'un champ de formulaire. `TextEntry` est le plus polyvalent : il formate dates, montants, HTML, relations et valeurs calculées. `BadgeEntry` affiche une valeur sous forme de badge coloré. `RepeatableEntry` est l'équivalent du `Repeater` côté affichage : il itère sur un tableau JSON ou une relation et affiche chaque élément avec un sous-schéma.

### `TextEntry` - le plus polyvalent

```PHP
<?php
TextEntry::make('name'),

// Formatage de date
TextEntry::make('created_at')
    ->dateTime('d/m/Y'),

// Formatage monétaire
TextEntry::make('total')
    ->money('EUR'),

// Transformation personnalisée
TextEntry::make('price')
    ->formatStateUsing(fn ($state) => '€' . number_format($state / 100, 2)),

// Rendu HTML
TextEntry::make('description')
    ->html(),

// Valeur depuis une relation
TextEntry::make('category.name'),

// Valeur calculée
TextEntry::make('full_name')
    ->getStateUsing(fn (User $record) => $record->first_name . ' ' . $record->last_name),

// Masquer si null
TextEntry::make('deleted_at')
    ->placeholder('Non supprimé') // affiché quand la valeur est null
    ->hidden(fn ($record) => $record->deleted_at === null),
```

### `BadgeEntry` - valeur avec badge coloré
```PHP
<?php
BadgeEntry::make('status')
    ->colors([
        'gray'    => 'draft',
        'warning' => 'pending',
        'success' => 'published',
        'danger'  => 'archived',
    ])
    ->icons([
        'heroicon-o-pencil'       => 'draft',
        'heroicon-o-clock'        => 'pending',
        'heroicon-o-check-circle' => 'published',
    ]),
```

### `ImageEntry` - affichage d'image
```PHP
<?php
ImageEntry::make('avatar')
    ->circular()          // rendu en cercle
    ->size(80),           // taille en px

ImageEntry::make('cover_image')
    ->height(200)
    ->extraImgAttributes(['class' => 'rounded-lg']),
```

### `IconEntry` - valeur booléenne ou icône
```PHP
<?php
use Filament\Infolists\Components\IconEntry;

IconEntry::make('is_active')
    ->boolean(), // ✓ vert / ✗ rouge automatiquement

IconEntry::make('type')
    ->icon(fn (string $state): string => match ($state) {
        'admin'  => 'heroicon-o-shield-check',
        'editor' => 'heroicon-o-pencil',
        default  => 'heroicon-o-user',
    })
    ->color(fn (string $state): string => match ($state) {
        'admin'  => 'danger',
        'editor' => 'warning',
        default  => 'gray',
    }),
```

### `ColorEntry` - affichage d'une couleur
```PHP
<?php
use Filament\Infolists\Components\ColorEntry;

ColorEntry::make('brand_color'), // affiche un carré coloré (#hex)
```

### `KeyValueEntry` - tableau clé/valeur
```PHP
<?php
use Filament\Infolists\Components\KeyValueEntry;

KeyValueEntry::make('metadata')
    ->label('Métadonnées'), // affiche un JSON sous forme de tableau
```

### `RepeatableEntry` - liste d'éléments répétés
```PHP
<?php
use Filament\Infolists\Components\RepeatableEntry;

RepeatableEntry::make('travel_companions')
    ->schema([
        TextEntry::make('name')->label('Nom'),
        TextEntry::make('relationship')->label('Lien'),
        TextEntry::make('date_of_birth')->date('d/m/Y'),
    ])
    ->columns(3),
```

## 5. Mise en page

> **En résumé** : Les composants de layout de l'Infolist sont les mêmes qu'en formulaire. `Section` regroupe des entrées avec un titre, et peut être rétractable. `Grid` crée une grille à N colonnes. `Split` dispose deux blocs côte à côte (ex : photo à gauche, infos à droite). `Tabs` creé des onglets pour séparer des catégories d'informations. On utilise `->columnSpanFull()` pour qu'une entrée occupe toute la largeur.

Les mêmes composants de layout qu'en formulaire sont disponibles :

### `Section`
```PHP
<?php
use Filament\Infolists\Components\Section;

Section::make('Coordonnées')
    ->description('Informations de contact')
    ->icon('heroicon-o-phone')
    ->collapsible()    // réductible
    ->collapsed()      // replié par défaut
    ->schema([
        TextEntry::make('email'),
        TextEntry::make('phone'),
    ])
    ->columns(2),
```

### `Grid` et `Split`
```PHP
<?php
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Split;

// Grid : grille de colonnes
Grid::make(3)->schema([
    TextEntry::make('first_name'),
    TextEntry::make('last_name'),
    TextEntry::make('email'),
]),

// Split : disposition côte-à-côte (gauche / droite)
Split::make([
    ImageEntry::make('avatar')->circular()->grow(false),
    Section::make([
        TextEntry::make('name'),
        TextEntry::make('email'),
        TextEntry::make('bio')->html(),
    ]),
]),
```

### `Tabs`
```PHP
<?php
use Filament\Infolists\Components\Tabs;

Tabs::make()->tabs([
    Tabs\Tab::make('Profil')->schema([
        TextEntry::make('name'),
        TextEntry::make('email'),
    ]),
    Tabs\Tab::make('Adresse')->schema([
        TextEntry::make('address'),
        TextEntry::make('city'),
    ]),
]),
```

## 6. Actions dans un Infolist

> **En résumé** : Un Infolist est en lecture seule, mais on peut y intégrer des boutons d'action. On les déclare via `->headerActions([...])` sur une `Section`. C'est utile pour des actions métier contextuelles à la vue (ex : "Approuver", "Envoyer un email"…) sans avoir à quitter la page. Ces actions utilisent `Filament\Infolists\Components\Actions\Action` (namespace propre à l'Infolist).

On peut ajouter des actions directement dans l'Infolist (sur une `Section` ou un `Entry`) :
```PHP
<?php
Section::make('Statut')
    ->schema([
        TextEntry::make('status'),
    ])
    ->headerActions([
        \Filament\Infolists\Components\Actions\Action::make('approve')
            ->label('Approuver')
            ->icon('heroicon-o-check')
            ->color('success')
            ->action(fn (Order $record) => $record->update(['status' => 'approved']))
            ->requiresConfirmation(),
    ]),
```

## 7. Infolist dans un contexte autre qu'une Resource

> **En résumé** : Un Infolist ne se limite pas aux pages `ViewRecord`. On peut l'utiliser dans n'importe quel composant Livewire (Widget, page custom…) en ajoutant le trait `InteractsWithInfolists`. On définit ensuite une méthode publique qui retourne un `Infolist` configuré avec `->record($this->user)`. Dans la vue Blade, on affiche l'infolist avec `{{ $this->nomDeLaMethode }}`.

L'Infolist peut être utilisé dans n'importe quel composant Livewire via le trait `InteractsWithInfolists` :
```PHP
<?php
use Filament\Infolists\Concerns\InteractsWithInfolists;
use Filament\Infolists\Infolist;

class UserProfileWidget extends Widget
{
    use InteractsWithInfolists;

    public User $user;

    public function userInfolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->record($this->user)
            ->schema([
                TextEntry::make('name'),
                TextEntry::make('email'),
                BadgeEntry::make('role'),
            ]);
    }

    public function render(): View
    {
        return view('filament.widgets.user-profile-widget');
    }
}
```

```PHP
{{-- Dans la vue Blade --}}
{{ $this->userInfolist }}
```

## Récapitulatif

```
Composants d'entrée
├── TextEntry       → texte, date, money, html, relation, calculé
├── BadgeEntry      → valeur avec badge coloré + icône
├── ImageEntry      → affichage d'image (circular, size...)
├── IconEntry       -> icône ou booléen (->boolean())
├── ColorEntry      → carré de couleur hex
├── KeyValueEntry   → JSON affiché en tableau clé/valeur
└── RepeatableEntry → liste de sous-entrées (ex: JSON array)

Layout (identique aux forms)
├── Section     → regroupement avec titre, collapsible
├── Grid        → colonnes fixes
├── Split       → disposition gauche/droite
└── Tabs        → onglets

Contextes
├── Resource ViewRecord → méthode infolist() dans la Resource
└── Livewire custom     → trait InteractsWithInfolists + ->record()

Actions
└── Sur Section ou Entry → ->headerActions([...])
```
