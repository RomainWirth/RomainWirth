# Étape 4 — Actions

## 4.1 L'action "Emprunter" sur une ligne de livre

Cette action doit :
1. N'être visible que si le livre est disponible
2. Ouvrir une modale avec un champ "Nom de l'emprunteur"
3. Créer un enregistrement `Loan` et marquer le livre comme indisponible

Dans `BookResource.php`, ajoute l'action dans `->actions()` de `table()` :

```php
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use App\Models\Loan;

Action::make('borrow')
    ->label('Emprunter')
    ->icon('heroicon-o-book-open')
    ->color('warning')
    ->visible(fn (Book $record) => $record->is_available)
    ->form([
        Forms\Components\TextInput::make('borrower_name')
            ->label('Nom de l\'emprunteur')
            ->required()
            ->maxLength(100),

        Forms\Components\DatePicker::make('loaned_at')
            ->label('Date d\'emprunt')
            ->default(now())
            ->required(),
    ])
    ->action(function (Book $record, array $data): void {
        Loan::create([
            'book_id'       => $record->id,
            'borrower_name' => $data['borrower_name'],
            'loaned_at'     => $data['loaned_at'],
        ]);

        $record->update(['is_available' => false]);

        Notification::make()
            ->title('Livre emprunté')
            ->body("{$data['borrower_name']} a emprunté « {$record->title} ».")
            ->success()
            ->send();
    }),
```

> `->visible(fn (Book $record) => $record->is_available)` masque le bouton sur les lignes dont le livre est déjà emprunté.

---

## 4.2 L'action "Retourner"

L'inverse de l'emprunt — visible uniquement si le livre est indisponible :

```php
Action::make('return')
    ->label('Retourner')
    ->icon('heroicon-o-arrow-uturn-left')
    ->color('success')
    ->visible(fn (Book $record) => ! $record->is_available)
    ->requiresConfirmation()
    ->modalHeading('Confirmer le retour')
    ->modalDescription('Marquer ce livre comme disponible à nouveau ?')
    ->action(function (Book $record): void {
        // Met à jour le dernier emprunt non retourné
        $record->loans()
            ->whereNull('returned_at')
            ->latest()
            ->first()
            ?->update(['returned_at' => now()]);

        $record->update(['is_available' => true]);

        Notification::make()
            ->title('Livre retourné')
            ->body("« {$record->title} » est de nouveau disponible.")
            ->success()
            ->send();
    }),
```

---

## 4.3 Le `DeleteAction` avec confirmation

Filament l'affiche déjà avec confirmation par défaut. On peut personnaliser les textes :

```php
Tables\Actions\DeleteAction::make()
    ->modalHeading('Supprimer le livre')
    ->modalDescription('Cette action est irréversible. Les emprunts associés seront également supprimés.')
    ->modalSubmitActionLabel('Oui, supprimer'),
```

---

## 4.4 Résultat final de `->actions()`

```php
->actions([
    Tables\Actions\ViewAction::make(),
    Tables\Actions\EditAction::make(),
    Action::make('borrow')  // voir 4.1
        // ...
    Action::make('return')  // voir 4.2
        // ...
    Tables\Actions\DeleteAction::make(), // voir 4.3
]),
```

---

## 4.5 Vérifier

- Sur un livre disponible : le bouton **Emprunter** est visible, **Retourner** est masqué
- Sur un livre emprunté : **Retourner** est visible, **Emprunter** est masqué
- La modale d'emprunt valide le champ obligatoire
- Un `Loan` est bien créé en base après l'emprunt
