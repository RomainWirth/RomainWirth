# Filament — Les Actions

Doc officielle : [https://filamentphp.com/docs/3.x/actions/overview](https://filamentphp.com/docs/3.x/actions/overview)

## 1. Qu'est-ce qu'une Action ?

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

## 3. `Action::make()` — action personnalisée

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

## 6. `HeaderActions` — actions dans l'en-tête de page

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

## 7. `BulkAction` — actions sur sélection multiple
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

## 9. `ActionGroup` — regrouper des actions dans un menu

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
