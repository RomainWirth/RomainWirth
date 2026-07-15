# Étape 2 — Resource `Ticket` (panel admin)

## 2.1 Générer la Resource

```bash
php artisan make:filament-resource Ticket --generate --view
```

Fichiers générés :

```
app/Filament/Resources/TicketResource.php
app/Filament/Resources/TicketResource/Pages/
    ListTickets.php
    CreateTicket.php
    EditTicket.php
    ViewTicket.php
```

---

## 2.2 Configurer le formulaire `form()`

```php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('subject')
            ->label('Sujet')
            ->required()
            ->maxLength(255)
            ->columnSpanFull(),

        Forms\Components\Textarea::make('description')
            ->label('Description')
            ->rows(4)
            ->required()
            ->columnSpanFull(),

        Forms\Components\Select::make('department_id')
            ->label('Département')
            ->relationship('department', 'name')
            ->searchable()
            ->preload()
            ->required(),

        Forms\Components\Select::make('agent_id')
            ->label('Agent assigné')
            ->relationship(
                name: 'agent',
                titleAttribute: 'name',
                modifyQueryUsing: fn ($query) => $query->role('agent')
            )
            ->searchable()
            ->preload()
            ->nullable(),

        Forms\Components\Select::make('status')
            ->label('Statut')
            ->options([
                'open'        => 'Ouvert',
                'in_progress' => 'En cours',
                'resolved'    => 'Résolu',
                'closed'      => 'Fermé',
            ])
            ->default('open')
            ->required(),

        Forms\Components\Select::make('priority')
            ->label('Priorité')
            ->options([
                'low'      => 'Basse',
                'medium'   => 'Moyenne',
                'high'     => 'Haute',
                'critical' => 'Critique',
            ])
            ->default('medium')
            ->required(),

        Forms\Components\Select::make('tags')
            ->label('Tags')
            ->relationship('tags', 'name')
            ->multiple()
            ->preload()
            ->searchable(),

        Forms\Components\DateTimePicker::make('sla_deadline')
            ->label('Deadline SLA')
            ->nullable(),
    ])->columns(2);
}
```

> `->role('agent')` dans `modifyQueryUsing` filtre les utilisateurs via Spatie Permission pour n'afficher que les agents dans le Select.

---

## 2.3 Configurer la table `table()`

```php
public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('id')
                ->label('#')
                ->sortable(),

            Tables\Columns\TextColumn::make('subject')
                ->label('Sujet')
                ->searchable()
                ->limit(50),

            Tables\Columns\TextColumn::make('client.name')
                ->label('Client')
                ->sortable()
                ->searchable(),

            Tables\Columns\TextColumn::make('agent.name')
                ->label('Agent')
                ->sortable()
                ->placeholder('Non assigné'),

            Tables\Columns\TextColumn::make('department.name')
                ->label('Département')
                ->sortable(),

            Tables\Columns\TextColumn::make('status')
                ->label('Statut')
                ->badge()
                ->formatStateUsing(fn (string $state): string => match ($state) {
                    'open'        => 'Ouvert',
                    'in_progress' => 'En cours',
                    'resolved'    => 'Résolu',
                    'closed'      => 'Fermé',
                    default       => $state,
                })
                ->color(fn (string $state): string => match ($state) {
                    'open'        => 'warning',
                    'in_progress' => 'primary',
                    'resolved'    => 'success',
                    'closed'      => 'gray',
                    default       => 'gray',
                }),

            Tables\Columns\TextColumn::make('priority')
                ->label('Priorité')
                ->badge()
                ->formatStateUsing(fn (string $state): string => match ($state) {
                    'low'      => 'Basse',
                    'medium'   => 'Moyenne',
                    'high'     => 'Haute',
                    'critical' => 'Critique',
                    default    => $state,
                })
                ->color(fn (string $state): string => match ($state) {
                    'low'      => 'gray',
                    'medium'   => 'warning',
                    'high'     => 'danger',
                    'critical' => 'danger',
                    default    => 'gray',
                }),

            Tables\Columns\IconColumn::make('sla_exceeded')
                ->label('SLA')
                ->state(fn (Ticket $record): bool => $record->sla_deadline && $record->sla_deadline->isPast() && $record->status !== 'closed')
                ->boolean()
                ->trueIcon('heroicon-m-exclamation-triangle')
                ->trueColor('danger')
                ->falseIcon('heroicon-m-check-circle')
                ->falseColor('success'),

            Tables\Columns\TextColumn::make('created_at')
                ->label('Créé le')
                ->dateTime('d/m/Y H:i')
                ->sortable(),
        ])
        ->filters([
            Tables\Filters\SelectFilter::make('status')
                ->label('Statut')
                ->options([
                    'open'        => 'Ouvert',
                    'in_progress' => 'En cours',
                    'resolved'    => 'Résolu',
                    'closed'      => 'Fermé',
                ]),

            Tables\Filters\SelectFilter::make('priority')
                ->label('Priorité')
                ->options([
                    'low' => 'Basse', 'medium' => 'Moyenne',
                    'high' => 'Haute', 'critical' => 'Critique',
                ]),

            Tables\Filters\SelectFilter::make('department')
                ->label('Département')
                ->relationship('department', 'name'),

            Tables\Filters\SelectFilter::make('agent')
                ->label('Agent')
                ->relationship('agent', 'name'),
        ])
        ->actions([
            Tables\Actions\ViewAction::make(),
            Tables\Actions\EditAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ])
        ->defaultSort('created_at', 'desc');
}
```

---

## 2.4 Configurer l'Infolist pour ViewTicket

```php
public static function infolist(Infolist $infolist): Infolist
{
    return $infolist->schema([
        Section::make('Ticket')
            ->schema([
                TextEntry::make('subject')->label('Sujet')->columnSpanFull(),
                TextEntry::make('description')->label('Description')->columnSpanFull(),
                TextEntry::make('client.name')->label('Client'),
                TextEntry::make('agent.name')->label('Agent assigné')->placeholder('Non assigné'),
                TextEntry::make('department.name')->label('Département'),
                BadgeEntry::make('status')
                    ->label('Statut')
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'open' => 'Ouvert', 'in_progress' => 'En cours',
                        'resolved' => 'Résolu', 'closed' => 'Fermé', default => $state,
                    })
                    ->color(fn ($state) => match ($state) {
                        'open' => 'warning', 'in_progress' => 'primary',
                        'resolved' => 'success', 'closed' => 'gray', default => 'gray',
                    }),
                BadgeEntry::make('priority')
                    ->label('Priorité')
                    ->color(fn ($state) => match ($state) {
                        'low' => 'gray', 'medium' => 'warning',
                        'high' => 'danger', 'critical' => 'danger', default => 'gray',
                    }),
                TextEntry::make('sla_deadline')->label('Deadline SLA')->dateTime('d/m/Y H:i'),
                TextEntry::make('created_at')->label('Créé le')->dateTime('d/m/Y H:i'),
            ])->columns(2),
    ]);
}
```

---

## 2.5 Vérifier

Rends-toi sur `/admin/tickets`. Tu dois pouvoir :

- Créer un ticket avec tous ses champs
- Voir les badges colorés pour le statut et la priorité
- Filtrer par statut, département, agent, priorité
- Voir l'indicateur SLA dépassé sur les tickets en retard
