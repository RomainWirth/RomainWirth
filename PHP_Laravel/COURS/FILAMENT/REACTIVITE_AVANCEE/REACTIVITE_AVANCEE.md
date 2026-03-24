# Filament — Réactivité avancée & sujets complémentaires

Doc officielle : [https://filamentphp.com/docs/3.x/panels/resources/getting-started](https://filamentphp.com/docs/3.x/panels/resources/getting-started)

## 1. Les hooks de cycle de vie sur les pages

Dans les classes de pages (`CreateRecord`, `EditRecord`), Filament expose des hooks qui permettent d'intervenir avant ou après la sauvegarde en BDD. C'est une couche au-dessus des callbacks de champs.

`mutateFormDataBeforeCreate` / `mutateFormDataBeforeSave`

Permet de transformer le tableau $data complet juste avant qu'il soit passé au modèle. Exemple

```PHP
<?php
// Ces méthodes se définissent dans la classe de page, pas la Resource
// app/Filament/Resources/MembershipResource/Pages/CreateMembership.php

protected function mutateFormDataBeforeCreate(array $data): array
{
    $data['slug'] = Str::slug($data['name'], '-');
    return $data;
}

protected function mutateFormDataBeforeSave(array $data): array
{
    // Réutilise la même logique pour la création et l'édition
    return $this->mutateFormDataBeforeCreate($data);
}
```
### Différence avec `dehydrateStateUsing()` :

|        | `dehydrateStateUsing()`            |	`mutateFormDataBefore*()`                        |
| ------ | ---------------------------------- | ------------------------------------------------ |
| Portée | Un seul champ                      | Tout le tableau `$data`                          |
| Lieu   | Dans la Resource, sur le composant | Dans la classe de page                           |
| Accès  | Valeur du champ uniquement         | Tous les champs en même temps                    |
| Usage  | Transformer une valeur (ex: hash)  |	Calculer une valeur à partir d'autres (ex: slug) |

### Tableau des hooks disponibles

```PHP
<?php
// Dans CreateRecord
protected function mutateFormDataBeforeCreate(array $data): array { ... }
protected function beforeCreate(): void { ... }   // avant la sauvegarde
protected function afterCreate(): void { ... }    // après la sauvegarde

// Dans EditRecord
protected function mutateFormDataBeforeFill(array $data): array { ... }  // avant le fill
protected function mutateFormDataBeforeSave(array $data): array { ... }
protected function beforeSave(): void { ... }
protected function afterSave(): void { ... }
```

Exemple avec `afterCreate()` :

```PHP
<?php
protected function afterCreate(): void
{
    // $this->record est disponible après la création
    Notification::make()
        ->title('Membership créé')
        ->success()
        ->send();

    // Ou déclencher un job
    dispatch(new SendWelcomeEmail($this->record));
}
```

## 2. `afterStateHydrated()` — réagir au chargement initial

`afterStateUpdated()` se déclenche à chaque interaction utilisateur. `afterStateHydrated()` se déclenche une seule fois au chargement, après que le state a été rempli depuis le modèle.

```PHP
<?php
TextInput::make('price_display')
    ->afterStateHydrated(function (TextInput $component, $state): void {
        // Convertit les centimes en euros à l'affichage initial
        $component->state($state / 100);
    })
    ->dehydrateStateUsing(fn ($state) => $state * 100), // reconvertit au save
```
**Cas d'usage :** transformer une donnée BDD dans un format plus pratique pour l'édition, sans utiliser un Cast Eloquent.

### Comparaison des callbacks de state

```
BDD → fill() → afterStateHydrated()  → [affichage initial]
                                             ↕ interaction utilisateur
                                       afterStateUpdated()
                                             ↕ submit
                                       dehydrateStateUsing() → BDD
```

## 3. `mutateDehydratedState()` — dernière transformation avant save

Moins connu, `mutateDehydratedState()` est appelé sur le state final juste avant que Filament ne construise le tableau à passer au modèle. C'est utile pour des transformations globales :
```PHP
<?php
TextInput::make('phone')
    ->mutateDehydratedStateUsing(
        fn (?string $state): ?string => $state
            ? preg_replace('/[^0-9+]/', '', $state) // nettoie le numéro
            : null
    ),
```

## 4. `dehydrateStateUsing` avancé avec `TagsInput`

Dans l'exemple ci-dessous, on voit un usage élaboré : normaliser et trier un tableau de tags avant de le sauvegarder :
```PHP
<?php

namespace App\Filament\Pages;

use App\Settings\SearchSettings as Settings;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Form;
use Filament\Pages\SettingsPage;

class SearchSettings extends SettingsPage
{
    protected static ?string $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Search settings';

    protected static ?string $navigationIcon = 'heroicon-m-magnifying-glass';

    protected static string $settings = Settings::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TagsInput::make('ignoredWords')
                    ->placeholder('Add a word by pressing space or tab...')
                    ->splitKeys([' ', 'Tab'])
                    ->helperText('The words in this list will be ignored in the search.')
                    ->dehydrateStateUsing(function (array $state) {
                        // Normalize : lowercase + trim
                        $state = array_map(fn ($item) => trim(strtolower($item)), $state);
                        sort($state);
                        return $state;
                    }),
            ]);
    }
}
```
Ici `$state` est un tableau (pas une string) car `TagsInput` stocke plusieurs valeurs.

## 5. `Rule` objects pour la validation avancée

Filament accepte toutes les règles de validation Laravel via `->rules([])`, y compris les objets `Rule` :
```PHP
<?php
use Illuminate\Validation\Rule;

TextInput::make('email')
    ->rules([
        'required',
        'email',
        Rule::unique('users', 'email')->ignore($this->record?->id),
    ]),

Select::make('status')
    ->rules([
        Rule::in(['draft', 'published', 'archived']),
    ]),

// Règle personnalisée avec closure
TextInput::make('slug')
    ->rules([
        function () {
            return function (string $attribute, mixed $value, Closure $fail) {
                if (str_contains($value, ' ')) {
                    $fail("Le slug ne peut pas contenir d'espaces.");
                }
            };
        },
    ]),
```

### Validation conditionnelle : `->requiredIf()` et `->prohibitedIf()`
```PHP
<?php
TextInput::make('company_name')
    ->requiredIf('account_type', 'business'), // requis si account_type === 'business'

TextInput::make('personal_note')
    ->prohibitedIf('is_public', true), // interdit si is_public est true
```

## 6. Les `otherTravelPreferencesToggles()` — génération dynamique de champs

Un pattern très intéressant dans ton UserResource.php:380 : générer dynamiquement un tableau de composants à partir d'une source de données :
```PHP
<?php

namespace App\Filament\Resources;

//...

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $recordTitleAttribute = 'full_name';

    protected static ?string $navigationGroup = 'General';

    protected static ?string $navigationIcon = 'heroicon-o-user';

    public static function getGloballySearchableAttributes(): array
    {
        return ['first_name', 'last_name'];
    }

    public static function form(Form $form): Form
    {
        // ...
    }
    protected static function travelPreferencesTab(): Tab
    {
        return Tab::make('Travel Preferences')
            ->schema([
                Select::make('travelerTypes')
                    ->relationship(name: 'travelerTypes', titleAttribute: 'name')
                    ->searchable()
                    ->preload()
                    ->multiple(),
                Group::make()
                    ->relationship('travelPreferences')
                    ->schema([
                        \Filament\Forms\Components\Repeater::make('travel_companions')
                            ->label('Family travel companions')
                            ->columnSpanFull()
                            ->schema([
                                TextInput::make('name')
                                    ->label('Full name')
                                    ->required(),
                                Select::make('relationship')
                                    ->label('Relationship to you')
                                    ->options([
                                        'partner' => 'Partner',
                                        'child' => 'Child',
                                        'other' => 'Other',
                                    ])->required(),
                                DatePicker::make('date_of_birth')
                                    ->label('Date of birth')
                                    ->required(),
                            ])
                            ->defaultItems(0)
                            ->addActionLabel('Add companion'),
                        TextInput::make('bucket_list'),
                        Select::make('transport_preferences')
                            ->options(TravelPreferences::travelPreferencesOptions())
                            ->multiple()
                            ->searchable(),
                        Select::make('flying_preferences')
                            ->options(TravelPreferences::travelClassOptions())
                            ->multiple()
                            ->searchable(),
                        TextInput::make('preferred_airlines')
                            ->label('Preferred airline(s)'),
                        Repeater::make('loyalty_programs')
                            ->label('Travel loyalty programme(s)')
                            ->columnSpanFull()
                            ->schema([
                                \Filament\Forms\Components\Select::make('type')
                                    ->label('Loyalty programme type')
                                    ->options(TravelPreferences::loyaltyProgramTypes())
                                    ->required(),
                                TextInput::make('name')
                                    ->label('Loyalty programme name')
                                    ->required(),
                                TextInput::make('account_holder')
                                    ->label('Account holder name')
                                    ->required(),
                                TextInput::make('account_number')
                                    ->label('Account number')
                                    ->required(),
                            ])
                            ->defaultItems(0)
                            ->addActionLabel('Add loyalty programme'),
                        Select::make('type_of_hotel')
                            ->options(TravelPreferences::typeOfHotelOptions())
                            ->multiple()
                            ->searchable(),
                        TextInput::make('favourite_hotel_brands')
                            ->label('Favourite hotel brands'),
                        Select::make('type_of_room')
                            ->options(TravelPreferences::typeOfRoomOptions())
                            ->multiple()
                            ->searchable(),
                        Select::make('type_of_bed')
                            ->options(TravelPreferences::typeOfBedOptions())
                            ->multiple()
                            ->searchable(),
                        Select::make('room_preferences')
                            ->options(TravelPreferences::roomPreferencesOptions())
                            ->multiple()
                            ->searchable(),
                        Select::make('type_of_pillow')
                            ->options(TravelPreferences::typeOfPillowOptions())
                            ->multiple()
                            ->searchable(),
                        Select::make('bathroom_type')
                            ->options(TravelPreferences::showerOrBathOptions())
                            ->multiple()
                            ->searchable(),
                        Textarea::make('comments')
                            ->columnSpanFull()
                            ->rows(5),
                        Textarea::make('dietary_requirements')
                            ->columnSpanFull()
                            ->rows(5),
                        ...self::otherTravelPreferencesToggles(),
                    ])->columns(2),
            ]);
    }
    protected static function otherTravelPreferencesToggles(): array
    {
        $fields = [];

        foreach (TravelPreferences::otherOptions() as $key => $label) {
            $fields[] = Toggle::make("other_options.{$key}") // dot-notation → JSON imbriqué
                ->label($label);
        }

        return $fields;
    }
}
```
utilisation du schéma avec le spread operator :
```PHP
->schema([
    ...self::otherTravelPreferencesToggles(), // ← spread du tableau
])
```
**Pourquoi ça fonctionne ?** Le dot-notation `other_options.vegetarian` mappe vers la clé `vegetarian` dans le JSON de la colonne `other_options`. Filament gère automatiquement la sérialisation/désérialisation via le Cast `array` sur le modèle.

## 7. Les RelationManagers

Ce sont des tables Filament embarquées dans la page d'édition d'un record, affichant les données d'une relation. Exemple :
```PHP
<?php
public static function getRelations(): array
{
    return [
        OrdersRelationManager::class,
        SubscriptionsRelationManager::class,
        ItineraryOrdersRelationManager::class,
    ];
}
```

Chaque RelationManager est une classe autonome qui définit sa propre `table()` et `form()` :
```PHP
<?php
// app/Filament/Resources/UserResource/RelationManagers/OrdersRelationManager.php

class OrdersRelationManager extends RelationManager
{
    // Nom de la relation Eloquent sur le modèle parent (User)
    protected static string $relationship = 'orders';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('number')
            ->columns([
                Tables\Columns\TextColumn::make('number'),
                Tables\Columns\TextColumn::make('total')
                    ->state(fn (Model $record) => priceInDecimals($record->total) . ' ' . $record->currency),
            ])
            ->headerActions([]) // pas de bouton "créer" ici
            ->actions([
                ViewAction::make()->form([...]) // modale de détail en lecture seule
            ]);
    }
}
```
La relation `$relationship = 'orders'` est scoped automatiquement : quand on édite l'utilisateur 5, la table n'affiche que `orders` where `user_id = 5`.

### Commande pour créer un RelationManager :
```bash
php artisan make:filament-relation-manager UserResource orders number
```

## 8. `->getStateUsing()` vs `->state()` vs `->formatStateUsing()`

Trois méthodes pour contrôler la valeur affichée, souvent confondues :

| Méthode                                    | Contexte         | Usage                                                            |
| ------------------------------------------ | ---------------- | ---------------------------------------------------------------- |
| `->getStateUsing(fn ($record))`            | Table uniquement | Calculer une valeur sur colonnes qui n'ont pas d'attribut direct |
| `->state(fn ($record))`                    | Table uniquement | Idem, syntaxe v3                                                 |
| `->formatStateUsing(fn ($state, $record))` | Form et Table    | Transformer un attribut existant à l'affichage                   |

```PHP
<?php
// Table : valeur calculée (pas d'attribut 'roles' sur le modèle)
TextColumn::make('roles')
    ->getStateUsing(fn ($record) => $record->roles->map->name->join(', ')),

// Table : syntaxe équivalente en v3
TextColumn::make('total')
    ->state(fn (Order $record) => '€' . number_format($record->total / 100, 2, ',')),

// Form : transforme l'attribut 'name' à l'affichage
TextInput::make('name')
    ->formatStateUsing(fn ($state) => Str::ucfirst($state)),
```

## 9. La page `SettingsPage`

Ci dessous un exemple de `SettingsPage` — une page Filament spéciale qui lit/écrit dans une classe de settings (souvent via `spatie/laravel-settings`) plutôt qu'un modèle Eloquent.

```PHP
<?php

namespace App\Filament\Pages;

use App\Settings\SearchSettings as Settings;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Form;
use Filament\Pages\SettingsPage;

class SearchSettings extends SettingsPage
{
    protected static ?string $navigationGroup = 'Settings';

    protected static ?string $navigationLabel = 'Search settings';

    protected static ?string $navigationIcon = 'heroicon-m-magnifying-glass';

    protected static string $settings = Settings::class;

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                TagsInput::make('ignoredWords')
                    ->placeholder('Add a word by pressing space or tab...')
                    ->splitKeys([' ', 'Tab'])
                    ->helperText('The words in this list will be ignored in the search.')
                    ->dehydrateStateUsing(function (array $state) {
                        $state = array_map(fn ($item) => trim(strtolower($item)), $state);
                        sort($state);
                        return $state;
                    }),
            ]);
    }
}
```
Filament hydrate/dehydrate automatiquement depuis/vers la classe settings. Pas de modèle, pas de `getPages()`, juste un formulaire de configuration.

## Récapitulatif des mécanismes de transformation

```
                    ┌─────────────────────────────────────────────┐
                    │             FLUX DES DONNÉES                │
                    └─────────────────────────────────────────────┘

BDD / Settings
    ↓
mutateFormDataBeforeFill($data)     ← transformer tout le tableau avant fill
    ↓
afterStateHydrated($state)          ← transformer un champ après hydratation
    ↓
formatStateUsing($state)            ← formater pour l'affichage
    ↓
[Formulaire visible par l'user]
    ↓
afterStateUpdated($state, $set, $get) ← réagir aux changements
    ↓
[Submit]
    ↓
dehydrateStateUsing($state)         ← transformer avant extraction
    ↓
mutateDehydratedStateUsing($state)  ← dernière transformation
    ↓
mutateFormDataBeforeCreate/Save($data) ← transformer tout le tableau
    ↓
beforeCreate() / beforeSave()       ← hook avant BDD
    ↓
BDD / Settings
    ↓
afterCreate() / afterSave()         ← hook post-BDD (notifications, jobs...)
```

Sources :

Lifecycle hooks : [https://filamentphp.com/docs/3.x/panels/resources/creating-records#lifecycle-hooks](https://filamentphp.com/docs/3.x/panels/resources/creating-records#lifecycle-hooks)
RelationManagers : [https://filamentphp.com/docs/3.x/panels/resources/relation-managers](https://filamentphp.com/docs/3.x/panels/resources/getting-started#settings-pages)
Settings pages : [https://filamentphp.com/docs/3.x/panels/resources/getting-started#settings-pages](https://filamentphp.com/docs/3.x/panels/resources/getting-started#settings-pages)
Validation : [https://filamentphp.com/docs/3.x/forms/validation](https://filamentphp.com/docs/3.x/forms/validation)
