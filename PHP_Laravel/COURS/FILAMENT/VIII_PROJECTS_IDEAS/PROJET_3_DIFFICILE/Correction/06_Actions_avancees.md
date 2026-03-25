# Étape 6 — Actions avancées sur les tickets

> Référence cours : `III_ACTIONS/01_LES_ACTIONS.md`

---

## 6.1 Vue d'ensemble des actions

| Action | Déclencheur | Effet |
|---|---|---|
| `assign` | Bouton dans la table/vue | Assigne un agent, passe le statut à `in_progress` |
| `escalate` | Bouton dans la table/vue | Passe la priorité à `critical`, notifie les admins |
| `resolve` | Bouton dans la vue uniquement | Passe le statut à `resolved`, visible uniquement si `in_progress` |
| `close_all` | BulkAction dans la table | Ferme tous les tickets sélectionnés avec commentaire optionnel |

---

## 6.2 Ajouter les actions dans `TicketResource`

Dans `TicketResource.php`, dans la méthode `table()` :

```php
use Filament\Tables\Actions\Action;
use Filament\Tables\Actions\BulkAction;
use Filament\Notifications\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

// Dans ->actions([]) de table() :
Action::make('assign')
    ->label('Assigner')
    ->icon('heroicon-m-user-plus')
    ->color('info')
    ->form([
        \Filament\Forms\Components\Select::make('agent_id')
            ->label('Agent')
            ->options(
                User::role('agent')->pluck('name', 'id')
            )
            ->searchable()
            ->required(),
    ])
    ->action(function (Ticket $record, array $data): void {
        $record->update([
            'agent_id' => $data['agent_id'],
            'status'   => 'in_progress',
        ]);

        Notification::make()
            ->title('Ticket assigné')
            ->success()
            ->body("Ticket #{$record->id} assigné à " . User::find($data['agent_id'])->name)
            ->send();
    }),

Action::make('escalate')
    ->label('Escalader')
    ->icon('heroicon-m-arrow-up-circle')
    ->color('danger')
    ->requiresConfirmation()
    ->modalDescription('Passer ce ticket en priorité critique et notifier les administrateurs ?')
    ->visible(fn (Ticket $record) => $record->priority !== 'critical')
    ->action(function (Ticket $record): void {
        $record->update(['priority' => 'critical']);

        $superAdmins = User::role('super-admin')->get();

        Notification::make()
            ->title('Ticket escaladé')
            ->warning()
            ->body("Le ticket #{$record->id} « {$record->subject} » a été escaladé en priorité critique.")
            ->sendToDatabase($superAdmins);

        Notification::make()
            ->title('Ticket escaladé en critique')
            ->warning()
            ->send();
    }),

Action::make('resolve')
    ->label('Résoudre')
    ->icon('heroicon-m-check-circle')
    ->color('success')
    ->requiresConfirmation()
    ->modalDescription('Marquer ce ticket comme résolu ?')
    ->visible(fn (Ticket $record) => $record->status === 'in_progress')
    ->action(function (Ticket $record): void {
        $record->update(['status' => 'resolved']);

        Notification::make()
            ->title('Ticket résolu')
            ->success()
            ->send();
    }),
```

---

## 6.3 BulkAction — Fermer plusieurs tickets

Dans `->bulkActions([])` de `table()` :

```php
BulkAction::make('close_all')
    ->label('Fermer les tickets sélectionnés')
    ->icon('heroicon-m-x-circle')
    ->color('danger')
    ->form([
        \Filament\Forms\Components\Textarea::make('comment')
            ->label('Commentaire de clôture (optionnel)')
            ->rows(3),
    ])
    ->action(function (Collection $records, array $data): void {
        foreach ($records as $ticket) {
            $ticket->update(['status' => 'closed']);

            if (! empty($data['comment'])) {
                $ticket->messages()->create([
                    'user_id'     => auth()->id(),
                    'content'     => [[
                        'type' => 'paragraph',
                        'data' => ['text' => $data['comment']],
                    ]],
                    'is_internal' => true,
                ]);
            }
        }

        Notification::make()
            ->title($records->count() . ' ticket(s) fermé(s)')
            ->success()
            ->send();
    })
    ->deselectRecordsAfterCompletion(),
```

---

## 6.4 Protéger les actions par rôle

Pour que seuls les agents ou admins puissent assigner/escalader/résoudre, utilise `->visible()` ou `->authorize()` :

```php
// Exemple : visible uniquement pour les agents et super-admins
->visible(fn () => auth()->user()->hasAnyRole(['agent', 'super-admin']))
```

> Tu peux aussi créer une `Policy` sur `Ticket` et utiliser `->authorize('update', $record)`.

---

## 6.5 Vérifier

- Dans la table des tickets, les boutons **Assigner**, **Escalader**, **Résoudre** apparaissent par ligne
- Clique sur **Assigner** → un modal s'ouvre avec un Select des agents
- Après assignation, le statut du ticket passe à `in_progress`
- Clique sur **Escalader** → confirmation demandée, priorité passe à `critical`, notif DB envoyée aux super-admins
- **Résoudre** n'est visible que si le statut est `in_progress`
- Sélectionne plusieurs tickets → **Fermer les tickets sélectionnés** apparaît avec formulaire commentaire optionnel
