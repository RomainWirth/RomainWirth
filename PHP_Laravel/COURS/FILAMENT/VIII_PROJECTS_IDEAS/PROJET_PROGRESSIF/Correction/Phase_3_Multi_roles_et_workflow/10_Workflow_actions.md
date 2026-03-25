# Phase 3 — Étape 10 : Workflow d'actions

> Référence cours : `III_ACTIONS/01_LES_ACTIONS.md`

## 10.1 Cycle de vie d'un Post

```
[draft] → submit_for_review → [review] → approve → [published]
                                        → reject  → [draft]  (avec commentaire)
[published] → archive → [archived]
```

| Statut | Couleur badge | Qui peut agir |
|---|---|---|
| `draft` | gray | editor (auteur) |
| `review` | warning | reviewer + super-admin |
| `published` | success | super-admin |
| `archived` | secondary | super-admin |

---

## 10.2 `PostResource` dans le panel CMS

```bash
# Depuis la racine du projet
php artisan make:filament-resource Post --panel=cms --generate
# Fichier généré : app/Filament/Cms/Resources/PostResource.php
```

---

## 10.3 Formulaire du Post

```php
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Illuminate\Support\Str;

public static function form(Form $form): Form
{
    return $form->schema([
        Section::make('Article')
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
            ])
            ->columns(2),

        // Réutilise les blocs de la Phase 2 — même structure de Builder
        Section::make('Contenu')
            ->schema([
                // Copie ici le Builder::make('content') de PageResource (étape 6)
                // ou crée un FormComponent partagé
            ]),
    ]);
}
```

> Pour réutiliser le même `Builder` sur `Post` et `Page`, extrait-le dans une classe de composant partagée : `app/Forms/Components/ContentBuilder.php` qui retourne le `Builder` configuré.

---

## 10.4 Actions du workflow

Dans `PostResource.php`, méthode `table()`, dans `->actions([])` :

```php
use App\Models\Post;
use Filament\Notifications\Notification;
use Filament\Tables\Actions\Action;

// 1. Soumettre pour relecture (editor → review)
Action::make('submit_for_review')
    ->label('Soumettre pour relecture')
    ->icon('heroicon-m-paper-airplane')
    ->color('warning')
    ->visible(fn (Post $record) => $record->status === 'draft'
        && $record->author_id === auth()->id())
    ->requiresConfirmation()
    ->action(function (Post $record): void {
        $record->update(['status' => 'review']);

        Notification::make()
            ->title('Post soumis pour relecture')
            ->success()
            ->send();
    }),

// 2. Approuver (reviewer/admin → published)
Action::make('approve')
    ->label('Approuver')
    ->icon('heroicon-m-check-circle')
    ->color('success')
    ->visible(fn (Post $record) => $record->status === 'review'
        && auth()->user()->hasAnyRole(['reviewer', 'super-admin']))
    ->requiresConfirmation()
    ->action(function (Post $record): void {
        $record->update([
            'status'       => 'published',
            'published_at' => now(),
            'reviewer_id'  => auth()->id(),
        ]);

        Notification::make()
            ->title('Post approuvé et publié')
            ->success()
            ->send();
    }),

// 3. Rejeter avec commentaire (reviewer/admin → draft)
Action::make('reject')
    ->label('Rejeter')
    ->icon('heroicon-m-x-circle')
    ->color('danger')
    ->visible(fn (Post $record) => $record->status === 'review'
        && auth()->user()->hasAnyRole(['reviewer', 'super-admin']))
    ->form([
        \Filament\Forms\Components\Textarea::make('rejection_comment')
            ->label('Raison du rejet')
            ->required()
            ->rows(3),
    ])
    ->action(function (Post $record, array $data): void {
        $record->update([
            'status'             => 'draft',
            'rejection_comment'  => $data['rejection_comment'],
            'reviewer_id'        => auth()->id(),
        ]);

        Notification::make()
            ->title('Post rejeté')
            ->warning()
            ->send();
    }),

// 4. Archiver (admin → archived)
Action::make('archive')
    ->label('Archiver')
    ->icon('heroicon-m-archive-box')
    ->color('gray')
    ->visible(fn (Post $record) => $record->status === 'published'
        && auth()->user()->hasRole('super-admin'))
    ->requiresConfirmation()
    ->action(fn (Post $record) => $record->update(['status' => 'archived'])),
```

---

## 10.5 Afficher le commentaire de rejet

Dans le formulaire du Post (en lecture seule pour l'editor), affiche le commentaire quand il y en a un :

```php
\Filament\Forms\Components\Placeholder::make('rejection_comment')
    ->label('❌ Raison du rejet')
    ->content(fn ($record) => $record?->rejection_comment)
    ->visible(fn ($record) => (bool) $record?->rejection_comment)
    ->columnSpanFull(),
```

---

## 10.6 Table du Post avec badges de statut

```php
TextColumn::make('status')
    ->label('Statut')
    ->badge()
    ->color(fn ($state) => match ($state) {
        'draft'     => 'gray',
        'review'    => 'warning',
        'published' => 'success',
        'archived'  => 'secondary',
        default     => 'gray',
    })
    ->formatStateUsing(fn ($state) => match ($state) {
        'draft'     => 'Brouillon',
        'review'    => 'En relecture',
        'published' => 'Publié',
        'archived'  => 'Archivé',
        default     => $state,
    }),
```

---

## 10.7 Vérifier

- Connecté en tant qu'editor → crée un post, clique **Soumettre** → statut passe à `review`
- Connecté en tant que reviewer → vois le post en relecture, clique **Approuver** → statut `published`
- Clique **Rejeter** → formulaire de commentaire s'ouvre, le post repasse en `draft`
- Connecté en tant qu'editor → le commentaire de rejet s'affiche dans le formulaire
