# Filament - Réactivité avancée & sujets complémentaires

Doc officielle : [https://filamentphp.com/docs/3.x/panels/resources/getting-started](https://filamentphp.com/docs/3.x/panels/resources/getting-started)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Hooks de cycle de vie](#1-les-hooks-de-cycle-de-vie-sur-les-pages) | Intervenir avant/après la sauvegarde depuis la classe de page (`mutateFormDataBefore*`, `afterCreate`…). |
| 2 | [afterStateHydrated()](#2-afterstatehydrated---réagir-au-chargement-initial) | Transformer un champ une seule fois au chargement, avant que l'utilisateur n'interagit. |
| 3 | [mutateDehydratedState()](#3-mutatedehydratedstate---dernière-transformation-avant-save) | Dernière passe de nettoyage sur un champ juste avant que Filament construise le tableau à sauvegarder. |
| 4 | [dehydrateStateUsing avancé](#4-dehydratestateusing-avancé-avec-tagsinput) | Normaliser un tableau de valeurs (tags) avant sauvegarde. |
| 5 | [Rule objects validation](#5-rule-objects-pour-la-validation-avancée) | Utiliser les objets `Rule` Laravel et les closures de validation dans Filament. |
| 6 | [Génération dynamique de champs](#6-les-othertravelpreferencestoggles---génération-dynamique-de-champs) | Générer un tableau de composants à la volée et l'injecter dans un schéma via le spread operator. |
| 7 | [RelationManagers](#7-les-relationmanagers) | Tables Filament embarquées dans la page Edit d'un record pour afficher une relation. |
| 8 | [getStateUsing / state / formatStateUsing](#8-getstateusing-vs-state-vs-formatstateusing) | Trois méthodes distinctes pour contrôler la valeur affichée dans une colonne ou un champ. |
| 9 | [SettingsPage](#9-la-page-settingspage) | Page Filament spéciale qui lit/écrit dans une classe de settings plutôt qu'un modèle Eloquent. |
| — | [Récapitulatif](#récapitulatif-des-mécanismes-de-transformation) | Flux complet des données : BDD → hydratation → interaction → déhydratation → BDD. |

---

## 1. Les hooks de cycle de vie sur les pages

> **En résumé** : Dans Filament, la logique métier autour de la sauvegarde ne se place pas dans la Resource mais dans les **classes de pages** (`CreateRecord`, `EditRecord`). `mutateFormDataBeforeCreate/Save()` permet de modifier tout le tableau `$data` avant qu'il soit passé au modèle (ex : calculer un slug). `beforeCreate()` / `afterCreate()` sont des hooks sans retour, parfaits pour déclencher des notifications ou des jobs. À ne pas confondre avec `dehydrateStateUsing()` qui agit champ par champ depuis la Resource.

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

## 2. `afterStateHydrated()` - réagir au chargement initial

> **En résumé** : `afterStateHydrated()` se déclenche **une seule fois**, quand Filament remplit le formulaire depuis le modèle (ou depuis `mutateFormDataBeforeFill`). C'est l'endroit pour convertir une donnée stockée en BDD dans un format plus commode à éditer (ex : centimes → euros). `dehydrateStateUsing()` fait l'opération inverse au moment du save. Ces deux callbacks vont toujours en binôme.

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

## 3. `mutateDehydratedState()` - dernière transformation avant save

> **En résumé** : `mutateDehydratedStateUsing()` est la dernière étape de transformation d'un champ avant que sa valeur soit incluse dans le tableau final envoyé au modèle. Contrairement à `dehydrateStateUsing()` qui remplace la valeur, `mutateDehydratedStateUsing()` reçoit la valeur **déjà déhydratée** et peut la nettoyer une dernière fois. Utile pour des sanitisations légères comme retirer les caractères non désirés d'un numéro de téléphone.

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

> **En résumé** : `TagsInput` stocke un tableau de chaînes, pas une simple string. `dehydrateStateUsing()` reçoit donc `array $state`. C'est l'endroit pour normaliser les tags (lowercase, trim, tri alphabétique) avant de les persister. Cet exemple est dans une `SettingsPage` (pas une Resource), ce qui montre que le même mécanisme fonctionne partout où Filament gère un formulaire.

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

> **En résumé** : `->rules([])` accepte n'importe quelle règle Laravel : strings (`'required'`), objets `Rule` (ex : `Rule::unique()->ignore($this->record?->id)` pour exclure le record en cours d'édition), ou closures personnalisées. `->requiredIf()` et `->prohibitedIf()` permettent une validation conditionnelle déclarative sans écrire de règle custom.

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

## 6. Les `otherTravelPreferencesToggles()` - génération dynamique de champs

> **En résumé** : Quand un formulaire contient de nombreux champs identiques (ex : une liste d'options booléennes issues d'une enum ou d'un tableau de config), on évite la duplication en générant le tableau de composants dynamiquement dans une méthode statique. Le spread operator `...self::method()` l'injecte dans le `->schema([])` comme si les composants étaient écrits en dur. La dot-notation `other_options.key` mappe automatiquement vers une clé dans une colonne JSON castée en `array`.

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

> **En résumé** : Un `RelationManager` est une mini-Resource (avec sa propre `table()` et `form()`) qui s'affiche en onglet en bas de la page Edit d'un record parent. Il est automatiquement scopé : si on édite l'utilisateur 5, la table n'affiche que ses commandes. On le déclare dans `getRelations()` de la Resource. La commande `make:filament-relation-manager` génère la classe avec les bons stubs.

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

> **En résumé** : Ces trois méthodes semblent similaires mais ont des rôles distincts. `->getStateUsing()` et `->state()` (syntaxe v3) servent dans les **colonnes de table** pour définir une valeur calculée quand il n'y a pas d'attribut direct sur le modèle. `->formatStateUsing()` sert à **transformer l'affichage** d'un attribut existant, aussi bien dans une colonne que dans un champ de formulaire — sans modifier la valeur sous-jacente.

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

> **En résumé** : `SettingsPage` est une page Filament qui remplace le modèle Eloquent par une classe de settings (typiquement via le package `spatie/laravel-settings`). On déclare `protected static string $settings = MySettings::class` et Filament prend en charge hydratation/déhydratation automatiquement. Tout ce qu'on sait faire dans un formulaire de Resource (validation, `dehydrateStateUsing`…) fonctionne de la même façon ici.

Ci dessous un exemple de `SettingsPage` - une page Filament spéciale qui lit/écrit dans une classe de settings (souvent via `spatie/laravel-settings`) plutôt qu'un modèle Eloquent.

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
