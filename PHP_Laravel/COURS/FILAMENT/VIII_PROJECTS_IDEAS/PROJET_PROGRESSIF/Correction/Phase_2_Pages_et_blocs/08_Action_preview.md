# Phase 2 — Étape 8 : Action "Prévisualiser"

> Référence cours : `III_ACTIONS/01_LES_ACTIONS.md` + `IV_INFOLIST/01_LES_INFOLISTS.md`

## 8.1 Objectif

Ajouter un bouton **Prévisualiser** sur les lignes de `PageResource` qui ouvre un modal affichant le rendu réel de la page (blocs de contenu, SEO, statut) — sans quitter l'interface admin.

---

## 8.2 Créer la vue Blade d'aperçu

La vue Blade du rendu est déjà créée à l'étape 6 (`page-content.blade.php`). On crée maintenant une vue dédiée à la prévisualisation dans le modal :

```bash
touch resources/views/filament/pages/preview-modal.blade.php
```

Dans `preview-modal.blade.php` :

```blade
<div class="space-y-6 p-2">
    {{-- Méta SEO --}}
    @if ($getRecord()->seo_title || $getRecord()->seo_description)
        <div class="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm space-y-1">
            <p class="font-semibold text-blue-600 underline text-base">
                {{ $getRecord()->seo_title ?: $getRecord()->title }}
            </p>
            <p class="text-green-700 text-xs">https://monsite.fr/{{ $getRecord()->slug }}</p>
            @if ($getRecord()->seo_description)
                <p class="text-gray-600 dark:text-gray-400">{{ $getRecord()->seo_description }}</p>
            @endif
        </div>
    @endif

    {{-- Rendu des blocs --}}
    @include('filament.pages.page-content', ['getState' => fn () => $getRecord()->content])
</div>
```

---

## 8.3 Ajouter l'Action dans `PageResource`

Dans `PageResource.php`, méthode `table()`, dans `->actions([])` :

```php
use Filament\Tables\Actions\Action;
use Filament\Infolists\Components\ViewEntry;
use Filament\Infolists\Infolist;

// Dans ->actions([]) :
Action::make('preview')
    ->label('Prévisualiser')
    ->icon('heroicon-m-eye')
    ->color('info')
    ->modalContent(fn (Page $record) => view(
        'filament.pages.preview-modal',
        ['getRecord' => fn () => $record]
    ))
    ->modalHeading(fn (Page $record) => "Aperçu : {$record->title}")
    ->modalSubmitAction(false)   // Pas de bouton "Sauvegarder" — lecture seule
    ->modalCancelActionLabel('Fermer')
    ->slideOver(),               // S'ouvre en panneau latéral plutôt qu'en modal centré
```

> `->slideOver()` est une option Filament v3 qui affiche la modal en panneau latéral (drawer) — idéal pour un aperçu pleine hauteur.

---

## 8.4 Alternative : Infolist dans la modal

Pour une approche purement Filament (sans vue Blade), on peut utiliser `->infolist()` directement sur l'Action :

```php
Action::make('preview')
    ->label('Prévisualiser')
    ->icon('heroicon-m-eye')
    ->color('info')
    ->infolist([
        \Filament\Infolists\Components\Section::make('Informations')
            ->schema([
                \Filament\Infolists\Components\TextEntry::make('title')
                    ->label('Titre'),

                \Filament\Infolists\Components\TextEntry::make('status')
                    ->label('Statut')
                    ->badge()
                    ->color(fn ($state) => $state === 'published' ? 'success' : 'gray'),

                \Filament\Infolists\Components\TextEntry::make('slug')
                    ->label('Slug')
                    ->copyable(),
            ])
            ->columns(2),

        \Filament\Infolists\Components\Section::make('Contenu')
            ->schema([
                \Filament\Infolists\Components\ViewEntry::make('content')
                    ->label('')
                    ->view('filament.pages.page-content')
                    ->columnSpanFull(),
            ]),
    ])
    ->modalHeading(fn (Page $record) => "Aperçu : {$record->title}")
    ->modalSubmitAction(false)
    ->modalCancelActionLabel('Fermer')
    ->slideOver(),
```

> `ViewEntry::make('content')` passe la valeur du champ `content` (le tableau des blocs) dans la variable `$getState()` de la vue Blade — c'est la même mécanique que dans un Infolist classique.

---

## 8.5 Résultat de la Phase 2

À ce stade, l'application dispose de :
- ✅ Tout ce que la Phase 1 avait
- ✅ Médiathèque centralisée
- ✅ Pages statiques éditables avec 4 types de blocs
- ✅ Menus de navigation configurables et réordonnables
- ✅ Aperçu en direct des pages depuis l'interface admin

---

## 8.6 Vérifier

- Dans la table des Pages, clique sur **Prévisualiser** → le panneau latéral s'ouvre
- Le bloc hero s'affiche avec son image et son titre
- Le bloc CTA s'affiche avec la couleur personnalisée
- La section SEO affiche le format Google dans l'aperçu
- Le bouton **Fermer** referme le panneau sans sauvegarder
