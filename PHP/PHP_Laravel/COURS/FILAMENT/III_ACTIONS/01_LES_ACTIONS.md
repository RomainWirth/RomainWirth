# Filament - Les Actions

Doc officielle : [https://filamentphp.com/docs/3.x/actions/overview](https://filamentphp.com/docs/3.x/actions/overview)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Qu'est-ce qu'une Action ?](#1-quest-ce-quune-action-) | Un bouton déclencheur utilisable dans 6 contextes différents. |
| 2 | [Actions prédéfinies (Built-in)](#2-les-actions-prédéfinies-built-in) | `EditAction`, `DeleteAction`, `ViewAction`… : zéro configuration pour le CRUD. |
| 3 | [Action::make() custom](#3-actionmake---action-personnalisée) | Créer un bouton métier avec icône, couleur, condition et logique PHP. |
| 4 | [Modale avec formulaire](#4-actions-avec-modale-et-formulaire) | Ouvrir une modale avec des champs Filament avant d'exécuter l'action. |
| 5 | [Personnaliser la modale](#5-personnaliser-la-modale) | Titre, description, labels des boutons, taille, icône. |
| 6 | [HeaderActions](#6-headeractions---actions-dans-len-tête-de-page) | Boutons dans l'en-tête des pages List, Create, Edit ou custom. |
| 7 | [BulkAction](#7-bulkaction---actions-sur-sélection-multiple) | Agir sur une sélection de lignes cochées. |
| 8 | [Actions dans un formulaire](#8-actions-dans-un-formulaire) | Bouton dans un champ (`suffixAction`) ou bloc autonome dans le form. |
| 9 | [ActionGroup](#9-actiongroup---regrouper-des-actions-dans-un-menu) | Regrouper plusieurs actions dans un dropdown pour alléger l'affichage. |
| 10 | [URL et redirection](#10-url-et-redirection) | Naviguer vers une URL ou rediriger après l'action. |
| 11 | [Autorisation des actions](#11-autorisation-des-actions) | Contrôler la visibilité et l'accès via policies ou closures. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble types / contextes / modale / utilitaires. |

---

## 1. Qu'est-ce qu'une Action ?

> **En résumé** : Une Action est l'abstraction Filament pour tout bouton qui fait quelque chose. La même classe `Action` (ou ses variantes) peut apparaître dans une ligne de table, dans l'en-tête d'une page, dans un formulaire ou dans une infolist. Ce qui change c'est le **contexte de déclaration** (dans `->actions()`, dans `getHeaderActions()`…) et le **namespace importé** (`Filament\Tables\Actions` vs `Filament\Actions`), pas la logique.

Une Action est un **bouton déclencheur** qui peut ouvrir une modale, exécuter du code, rediriger, etc. Filament distingue plusieurs contextes d'utilisation :

| Contexte                   | Déclaration                       |
| -------------------------- | --------------------------------- |
| Ligne de table             | `->actions([...])` dans `table()` |
| Sélection multiple (table) | `->bulkActions([...])`            |
| En-tête de table           | `->headerActions([...])`          |
| Formulaire                 | `->actions([...])` dans `form()`  |
| Page (header/footer)       | `getHeaderActions()`              |
| Infolist                   | sur une entrée ou en header       |

## 2. Les actions prédéfinies (Built-in)

> **En résumé** : Filament fournit des actions CRUD complètes prêtes à l'emploi. `EditAction`, `ViewAction` et `DeleteAction` ouvrent automatiquement la modale ou la page correspondante, et vérifient les policies du modèle (`canEdit()`, `canDelete()`…) sans aucune configuration. `ReplicateAction` duplique l'enregistrement. C'est le point de départ — on ne crée une action custom que pour ce que ces built-ins ne couvrent pas.

Filament fournit des actions CRUD déjà configurées, à importer depuis `Filament\Tables\Actions` ou `Filament\Actions` :
```PHP
<?php
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\ViewAction;
use Filament\Tables\Actions\CreateAction;
use Filament\Tables\Actions\ReplicateAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\RestoreAction;

public static function table(Table $table): Table
{
    return $table
        ->actions([
            EditAction::make(),
            ViewAction::make(),
            ReplicateAction::make(),
            DeleteAction::make(),
        ])
        ->bulkActions([
            DeleteBulkAction::make(),
        ]);
}
```
Ces actions ouvrent automatiquement des modales avec le formulaire de la Resource, sans configuration supplémentaire.

## 3. `Action::make()` - action personnalisée

> **En résumé** : `Action::make('identifiant')` crée un bouton métier sur mesure. Les méthodes fluentes définissent l'apparence (`->label()`, `->icon()`, `->color()`), les conditions (`->visible()`, `->disabled()`), et la logique via `->action(fn)` qui reçoit le `$record` courant. Sans `->form()`, l'action s'exécute directement — avec `->requiresConfirmation()` on ajoute juste une modale de confirmation avant l'exécution.

```PHP
<?php
use Filament\Tables\Actions\Action;

Action::make('approve')
    ->label('Approuver')
    ->icon('heroicon-o-check')
    ->color('success')
    ->requiresConfirmation() // ouvre une modale de confirmation simple
    ->action(function (Order $record): void {
        $record->update(['status' => 'approved']);

        Notification::make()
            ->title('Commande approuvée')
            ->success()
            ->send();
    }),
```

### Options essentielles
```PHP
<?php
Action::make('nom')
    ->label('Texte du bouton')
    ->icon('heroicon-o-pencil')
    ->color('primary')              // primary, success, warning, danger, gray
    ->size(ActionSize::Small)       // Small, Medium, Large
    ->tooltip('Info au survol')
    ->disabled(fn ($record) => $record->status === 'locked')
    ->hidden(fn ($record) => ! auth()->user()->isAdmin())
    ->visible(fn ($record) => $record->status === 'pending'),
```

## 4. Actions avec modale et formulaire

> **En résumé** : En ajoutant `->form([...])` à une action, Filament ouvre une modale contenant les champs déclarés. La closure `->action()` reçoit alors `$data` (les valeurs du formulaire) en plus du `$record`. On peut pré-remplir les champs avec les valeurs actuelles du record via `->fillForm(fn)` — utile pour une modale d'édition partielle sans ouvrir toute la page Edit.

On peut construire une modale complète avec un formulaire :
```PHP
<?php
Action::make('changeStatus')
    ->label('Changer le statut')
    ->icon('heroicon-o-arrow-path')
    ->form([
        Select::make('status')
            ->label('Nouveau statut')
            ->options([
                'pending'   => 'En attente',
                'approved'  => 'Approuvé',
                'cancelled' => 'Annulé',
            ])
            ->required(),
        Textarea::make('reason')
            ->label('Motif (optionnel)')
            ->rows(3),
    ])
    ->action(function (Order $record, array $data): void {
        $record->update([
            'status' => $data['status'],
            'reason' => $data['reason'] ?? null,
        ]);
    }),
```

### Pré-remplir le formulaire avec les données du record
```PHP
<?php
->fillForm(fn (Order $record): array => [
    'status' => $record->status,
    'reason' => $record->reason,
])
```

## 5. Personnaliser la modale

> **En résumé** : Par défaut, `->requiresConfirmation()` génère une modale avec des textes anglais génériques. On les surcharge avec `->modalHeading()`, `->modalDescription()`, `->modalSubmitActionLabel()` et `->modalCancelActionLabel()`. `->modalWidth()` contrôle la taille — utile quand le formulaire dans la modale est large.

```PHP
<?php
Action::make('archiver')
    ->requiresConfirmation()
    ->modalHeading('Archiver cette commande ?')
    ->modalDescription('Cette action est irréversible.')
    ->modalSubmitActionLabel('Oui, archiver')
    ->modalCancelActionLabel('Annuler')
    ->modalIcon('heroicon-o-archive-box')
    ->modalIconColor('warning'),
```
### Taille de la modale
```PHP
<?php
->modalWidth('lg') // sm, md, lg, xl, 2xl, 3xl... ou MaxWidth::Large
```

## 6. `HeaderActions` - actions dans l'en-tête de page

> **En résumé** : Les `HeaderActions` sont les boutons visibles en haut à droite des pages Filament. Sur `ListRecords`, on y met typiquement le bouton "Créer" (`CreateAction::make()`). Sur `EditRecord`, on peut ajouter des actions métier (ex : "Publier", "Envoyer un email"…). Ces actions sont déclarées en surchargeant `getHeaderActions()` dans la classe de page. Elles utilisent `Filament\Actions` (hors table), pas `Filament\Tables\Actions`.

Sur les pages `ListRecords`, `CreateRecord`, `EditRecord` ou une page custom :
```PHP
<?php
// app/Filament/Resources/OrderResource/Pages/ListOrders.php

use Filament\Actions\CreateAction;
use Filament\Actions\Action;

protected function getHeaderActions(): array
{
    return [
        CreateAction::make(), // bouton "Créer" standard

        Action::make('export')
            ->label('Exporter CSV')
            ->icon('heroicon-o-arrow-down-tray')
            ->action(function (): void {
                // logique d'export...
            }),
    ];
}
```

## 7. `BulkAction` - actions sur sélection multiple

> **En résumé** : Une `BulkAction` est identique à une `Action` normale, sauf que sa closure `->action()` reçoit une `Collection` Eloquent de tous les records cochés. On itère dessus avec `->each()`. `->deselectRecordsAfterCompletion()` vide la sélection une fois l'action terminée, ce qui évite que l'utilisateur relance l'action par erreur.

```PHP
<?php
use Filament\Tables\Actions\BulkAction;
use Illuminate\Database\Eloquent\Collection;

->bulkActions([
    BulkAction::make('approveAll')
        ->label('Approuver la sélection')
        ->icon('heroicon-o-check')
        ->color('success')
        ->requiresConfirmation()
        ->action(function (Collection $records): void {
            $records->each(fn (Order $record) => $record->update(['status' => 'approved']));
        })
        ->deselectRecordsAfterCompletion(), // déselectionne après l'action
])
```

## 8. Actions dans un formulaire

> **En résumé** : On peut placer des actions directement dans le schéma d'un formulaire. `->suffixAction()` (ou `->prefixAction()`) accroche un bouton à l'intérieur d'un champ (ex : bouton "générer" dans un TextInput). `Actions::make([...])` crée un bloc de boutons autonome inséré dans la grille du formulaire. Ces actions utilisent `Filament\Forms\Components\Actions\Action` (namespace différent des actions de table ou de page).

On peut placer des actions directement dans un formulaire, par exemple pour déclencher une action sans soumettre le formulaire entier :
```PHP
<?php
use Filament\Forms\Components\Actions\Action as FormAction;
use Filament\Forms\Components\Actions;

->schema([
    TextInput::make('slug')
        ->suffixAction( // bouton à droite du champ
            FormAction::make('generateSlug')
                ->icon('heroicon-m-arrow-path')
                ->action(function (Get $get, Set $set): void {
                    $set('slug', Str::slug($get('name'), '-'));
                })
        ),

    // Ou un bloc d'actions autonome dans le formulaire
    Actions::make([
        FormAction::make('sendTestEmail')
            ->label('Envoyer un email de test')
            ->action(fn ($record) => Mail::to($record->email)->send(new TestMail())),
    ]),
])
```

## 9. `ActionGroup` - regrouper des actions dans un menu

> **En résumé** : Quand une ligne de table cumule 4+ actions, l'interface devient surchargée. `ActionGroup::make([...])` regroupe plusieurs actions dans un menu déroulant (dropdown). On n'affiche que les actions principales en direct, et on met les actions secondaires dans le groupe. `->button()` affiche le groupe sous forme de bouton plein plutôt que d'une simple icône.

Évite de surcharger les lignes de table avec trop de boutons :
```PHP
<?php
use Filament\Tables\Actions\ActionGroup;

->actions([
    EditAction::make(),
    ActionGroup::make([
        ViewAction::make(),
        ReplicateAction::make(),
        DeleteAction::make(),
    ])
    ->label('Plus')
    ->icon('heroicon-m-ellipsis-vertical')
    ->color('gray')
    ->button(), // rendu en bouton plutôt qu'icône
])
```

## 10. URL et redirection

> **En résumé** : `->url()` transforme l'action en lien (pas de `->action()` nécessaire). `->openUrlInNewTab()` ouvre dans un nouvel onglet. Pour rediriger **après** avoir exécuté de la logique, on utilise `->successRedirectUrl()` qui est évalué une fois l'action terminée avec succès.

```PHP
<?php
Action::make('viewInvoice')
    ->label('Voir la facture')
    ->icon('heroicon-o-document')
    ->url(fn (Order $record): string => route('invoices.show', $record))
    ->openUrlInNewTab(),

// Ou rediriger après l'action
->action(function ($record): void {
    // ... traitement
})
->successRedirectUrl(fn ($record) => route('filament.admin.resources.orders.edit', $record)),
```

## 11. Autorisation des actions

> **En résumé** : Les actions built-in (`EditAction`, `DeleteAction`…) vérifient automatiquement les policies Laravel du modèle (`canEdit()`, `canDelete()`…). Pour les actions custom, on utilise `->visible(fn)` ou `->hidden(fn)` pour contrôler l'affichage, et `->authorize('policyMethod')` pour lever une exception si l'utilisateur n'a pas la permission. `->visible()` masque le bouton, `->authorize()` échoue même si l'action est appelée directement — c'est une défense en profondeur.

Chaque action peut être conditionnée par une policy ou un check manuel :
```PHP
<?php
DeleteAction::make()
    ->authorize('delete'), // vérifie $user->can('delete', $record)

Action::make('approve')
    ->visible(fn ($record) => auth()->user()->can('approve', $record)),

// Sur les actions built-in, Filament vérifie automatiquement
// les policies canDelete(), canEdit(), canView() du modèle
```

## Récapitulatif
```
Types d'actions
├── Built-in    → EditAction, DeleteAction, ViewAction, CreateAction, ReplicateAction
├── Custom      → Action::make() avec ->action(fn)
└── BulkAction  → sur sélection multiple

Contextes
├── Table rows       → ->actions([])
├── Table bulk       → ->bulkActions([])
├── Table header     → ->headerActions([])
├── Page header      → getHeaderActions()
├── Formulaire       → suffixAction(), Actions::make()
└── Infolist         → ->actions([])

Modale
├── ->requiresConfirmation()   → confirmation simple
├── ->form([...])              → formulaire dans la modale
├── ->fillForm(fn)             → pré-remplissage
└── ->modalWidth(), ->modalHeading(), etc.

Utilitaires
├── ActionGroup    → regrouper en dropdown
├── ->url()        → lien externe / interne
├── ->hidden()     → masquer conditionnellement
└── ->authorize()  → contrôle d'accès
```
