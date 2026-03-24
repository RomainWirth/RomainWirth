# Filament Forms

Doc officielle : [https://filamentphp.com/docs/3.x/forms/getting-started](https://filamentphp.com/docs/3.x/forms/getting-started)

## 1. Architecture générale : Filament repose sur Livewire

Avant tout, il faut comprendre la fondation technique. Filament est entièrement construit sur Laravel Livewire, qui est lui-même un système de composants full-stack : chaque interaction (frappe, clic, changement de champ) déclenche une requête HTTP vers le serveur PHP, qui re-render le composant et renvoie uniquement le diff HTML au navigateur via AJAX.

```
Navigateur (Alpine.js)
       ↕ AJAX (JSON)
Serveur (Livewire Component)
       ↕
Filament Form (gestion du state)
       ↕
Eloquent Model
```

**Implication concrète** : Filament n'est pas un SPA JavaScript. L'état du formulaire vit côté serveur en PHP. C'est pourquoi la réactivité entre champs nécessite des allers-retours serveur.

Doc : [https://livewire.laravel.com/docs/components](https://livewire.laravel.com/docs/components)

## 2. Le cycle de vie d'un formulaire

Quand tu ouvres une page Edit dans Filament, voici ce qui se passe dans l'ordre :

### Phase 1 - `fill()` (hydratation)
Le modèle Eloquent est chargé depuis la BDD. Filament appelle `$form->fill($record->attributesToArray())` pour peupler le state PHP avec les données du modèle.

### Phase 2 - `mount()` (initialisation Livewire)
Le composant Livewire est monté. Les composants de formulaire s'initialisent via `setUp()` - où sont définies toutes les règles de validation, les callbacks, les valeurs par défaut.

### Phase 3 - Interactions (réactivité)
À chaque changement de champ marqué `->live()` ou `->reactive()`, Livewire envoie une requête au serveur. Filament met à jour le state, exécute les afterStateUpdated(), puis re-render.

### Phase 4 - `dehydrate()` (sauvegarde)
Lors du submit, Filament appelle `$form->getState()`, qui :
1. Valide les données selon les règles déclarées
2. Applique les `dehydrateStateUsing()` sur chaque champ (ex : hashage du mot de passe)
3. Exclut les champs avec `->dehydrated(false)` (ex : password_confirmation)
4. Retourne un tableau propre, passé à `$record->fill($data)->save()`

Doc : [https://filamentphp.com/docs/3.x/forms/adding-a-form-to-a-livewire-component](https://filamentphp.com/docs/3.x/forms/adding-a-form-to-a-livewire-component)

## 3. Le State : comment Filament gère les données

Le "state" est le concept central. C'est un tableau PHP associatif qui vit dans le composant Livewire sous la propriété `$data`. Chaque champ a un statePath : un chemin en dot-notation qui pointe vers sa valeur dans ce tableau.

```PHP
$data = [
    'email'    => 'admin@domain.com',
    'password' => '',
    'roles'    => [1, 2],
    'travelPreferences' => [
        'bucket_list' => '...',
        'loyalty_programs' => [
            ['type' => 'air', 'name' => 'Miles & More'],
        ]
    ]
]
```

StatePath imbriqué avec `->relationship()`

Quand on écrit :
```PHP
<?php
Group::make()
    ->relationship('travelPreferences') // ← définit un sous-state
    ->schema([
        TextInput::make('bucket_list'), // statePath: "travelPreferences.bucket_list"
    ]),
```

Filament charge automatiquement la relation, mappe ses données dans un sous-tableau du state, et les re-sauvegarde dans la relation lors du `dehydrate()`.

exemple :

`$set` et `$get` dans les callbacks
Ce sont des wrappers autour du state. Ils utilisent le dot-notation :
```PHP
<?php
->afterStateUpdated(function ($state, callable $set, callable $get) {
    $set('location', [        // équivalent à data_set($data, 'location', [...])
        'lat' => $state['lat'],
        'lng' => $state['lng'],
    ]);
    $get('destination_id');   // équivalent à data_get($data, 'destination_id')
})
```

## 4. Le système de réactivité

Filament a deux niveaux de réactivité :

`->reactive()` (ancien, v2)
Déclenche un re-render Livewire à chaque frappe (ou à chaque événement `input`). Coûteux en requêtes.

`->live()` (v3, recommandé)
Plus fin, avec options :
```PHP
<?php
->live()                    // à chaque changement immédiat
->live(onBlur: true)        // seulement quand le champ perd le focus
->live(debounce: 500)       // après 500ms d'inactivité (typing)
```
utilisation de `->live(debounce: 500)` pour ne pas envoyer une requête à chaque lettre tapée.

```PHP
<?php
->lazy() // (ancienne syntaxe) = live(onBlur: true)
```
**Règle d'or** : n'utiliser `->live()` que sur les champs qui en ont besoin, car chaque requête Livewire re-render toute la page du formulaire.

## 5. La validation

### Déclaration inline (fluent API)

Filament traduit ses méthodes en règles de validation Laravel :
```PHP
<?php
TextInput::make('email')
    ->email()                      // → ['email']
    ->required()                   // → ['required']
    ->unique(ignoreRecord: true)   // → ['unique:users,email,{id}']
    ->maxLength(255),              // → ['max:255']
```

Règles personnalisées avec `->rules()`
```PHP
<?php
TextInput::make('slug')
    ->rules(['alpha_dash', 'min:3']),
```

### Validation contextuelle avec `->required(fn ...)`

Les méthodes de validation acceptent des closures, ce qui permet une validation conditionnelle :
```PHP
<?php
TextInput::make('password')
    ->required(fn (string $operation): bool => $operation === 'create'),
    // requis uniquement à la création, pas à l'édition
```

### `->unique()` avec `ignoreRecord`

Sans `ignoreRecord: true`, la validation unique rejette le record existant lors de l'édition (car il trouve sa propre valeur en BDD). Ce flag injecte automatiquement l'id du record courant dans la règle unique.

## 6. Visibilité conditionnelle

### `->visible()` et `->hidden()`

```PHP
<?php
Select::make('neighbourhood')
    ->visible(fn (Get $get) => $get('neighbourhood') !== 'New neighbourhood'),
```
Différence importante :
* `->visible(false)` - le champ n'est pas rendu dans le HTML du tout
* `->disabled(true)` - le champ est rendu mais non modifiable et non sauvegardé
* `->readOnly()` - le champ est rendu, non modifiable, mais sauvegardé

### `->disabled()` et `autorisation`

```PHP
<?php
Select::make('roles')
    ->disabled(fn () => !Auth::user()->hasRole('Administrator')),
```

Un champ `disabled` ne **soumet pas sa valeur** - attention en édition : utilisez `->disabled()->dehydrated()` si vous voulez garder la valeur en BDD malgré le champ désactivé.

## 7. Le pattern Fluent Builder

Tous les composants Filament utilisent le pattern Builder (interface fluide) : chaque méthode retourne `$this`, donc les appels sont chaînables.

Exemple :
```PHP
<?php
TextInput::make('name')   // retourne une instance de TextInput
    ->reactive()           // retourne $this
    ->afterStateUpdated(fn (...) => ...)  // retourne $this
    ->lazy()               // retourne $this
    ->required()           // retourne $this
    ->maxLength(255)       // retourne $this
```

C'est un pattern déclaratif : tu décris le formulaire, Filament se charge du rendu et du comportement. Il n'y a pas de template Blade à écrire pour les cas standard.

## 8. Layout : la théorie du columnSpan

Filament utilise une grille CSS. Chaque Section, Group ou Form définit un nombre de colonnes. Les composants enfants déclarent combien de colonnes ils occupent :

```PHP
<?php
Forms\Components\Section::make()
    ->schema([
        TextInput::make('first_name'),  // occupe 1/2 (défaut: 1 colonne sur 2)
        TextInput::make('last_name'),   // occupe 1/2
        Textarea::make('bio')
            ->columnSpanFull(),         // occupe les 2 colonnes
    ])
    ->columns(2),                       // grille à 2 colonnes dans cette section
```

Responsive avec un tableau :
```PHP
<?php
->columnSpan(['default' => 1, 'sm' => 2, 'lg' => 3])
```

## 9. formatStateUsing() vs dehydrateStateUsing()
Ces deux méthodes sont symétriques et souvent confondues :

| Méthode                 |	Quand                | Direction        |
| ----------------------- | -------------------- | ---------------- |
| `formatStateUsing()`    |	À l'affichage (fill) | BDD → Formulaire |
| `dehydrateStateUsing()` |	À la sauvegarde	     | Formulaire → BDD |

```PHP
<?php
TextInput::make('plan')
    ->formatStateUsing(        // affiche "Premium Plan" dans le champ
        fn ($state) => Str::of($state)->replace('-', ' ')->ucwords()
    ),

TextInput::make('password')
    ->dehydrateStateUsing(     // enregistre le hash en BDD, pas le plain text
        fn ($state) => Hash::make($state)
    ),
```

## 10. Composants custom - Architecture interne

Prenons l'exemple d'un composant entièrement sur-mesure : PlaceSelector. Voici la théorie derrière :

Tout composant Filament hérite de `Field`, qui hérite de `Component`. La classe `Component` est elle-même un objet PHP qui :
* maintient son propre state
* possède une vue Blade associée (`$view`)
* peut enregistrer des **event listeners Livewire** pour communiquer avec le frontend
* peut utiliser des **traits** pour activer des comportements (affix, placeholder, etc.)

```
Field
 └── Component
      └── Concerns\HasState       - gère la lecture/écriture du state
      └── Concerns\HasValidation  - gère les règles de validation
      └── Concerns\CanBeDisabled  - gère disabled/enabled
      └── Concerns\HasLifecycle   - setUp(), mount(), ...
```
Le `registerListeners()` dans `PlaceSelector` permet d'écouter des événements Livewire émis depuis la vue Alpine.js :
```PHP
<?php
// Vue Blade (Alpine.js émet l'event)
$dispatch('placeSelector::selectItem', { statePath: '...', placeId: '...' })

// PHP reçoit l'event
$this->registerListeners([
    'placeSelector::selectItem' => [
        function (PlaceSelector $component, string $statePath, string $placeId): void {
            // auto-remplit les autres champs via data_set()
        }
    ]
]);
```

## 11. Organisation du code - Patterns observés dans ce projet

### Pattern 1 : Sections extraites dans des classes dédiées

 chaque onglet délégué à une classe externe :
```PHP
<?php
Tab::make('General')->schema(Sections\GeneralTab::schema()),
Tab::make('Location')->schema(Sections\LocationTab::schema()),
```

Chaque `Section` est dans le directory **Sections**. Avantage : le fichier Resource reste lisible même avec des formulaires complexes.

### Pattern 2 : Blocs réutilisables (Builder)

Les blocs du `Builder` sont chacun dans une classe distincte dans le directory **Blocks**, avec une méthode static `schema()` qui retourne un `Builder\Block`.

Exemple :
```PHP
<?php

namespace App\Filament\Resources\Blocks;

use App\Filament\Resources\Blocks\Partials\VisibilityToggle;
use Filament\Forms;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;

class HeroBlock
{
    public static function schema()
    {
        return Forms\Components\Builder\Block::make('hero')
            ->schema([
                VisibilityToggle::make(),
                SpatieMediaLibraryFileUpload::make('hero_image')
                    ->collection('hero')
                    ->label('Hero image')
                    ->helperText('This is the background for the hero')
                    ->required()
                    ->imageEditor()
                    ->columnSpanFull(),
                TextInput::make('title')
                    ->label('Title')
                    ->required()
                    ->columnSpanFull(),
            ]);
    }
}
```

### Pattern 3 : Partials partagés entre blocs

VisibilityToggle.php - un Toggle commun inclus dans tous les blocs. Évite la duplication.

```PHP
<?php

namespace App\Filament\Resources\Blocks\Partials;

use Filament\Forms\Components\Toggle;

class VisibilityToggle
{
    public static function make(): Toggle
    {
        return Toggle::make('hidden')
            ->label('Hide')
            ->onColor('warning')
            ->columnSpanFull();
    }
}
```

## Récuapitulatif du flux de données

```
BDD (MySQL)
   ↓ $record->attributesToArray()
   ↓ formatStateUsing()
State PHP ($data[])
   ↓ afterStateUpdated() / $set() / $get()
   ↓ visible() / disabled()
Rendu HTML (Livewire + Alpine.js)
   ↓ interactions utilisateur
   ↓ live() / reactive()
Validation (required / unique / rules)
   ↓ dehydrateStateUsing()
   ↓ dehydrated(false) = exclusion
$form->getState()
   ↓ $record->fill($data)->save()
BDD (MySQL)
```

## Sources complémentaires :

Architecture Livewire : [https://livewire.laravel.com/docs/lifecycle-hooks](https://livewire.laravel.com/docs/lifecycle-hooks)
Form lifecycle Filament : [https://filamentphp.com/docs/3.x/forms/adding-a-form-to-a-livewire-component#lifecycle-hooks](https://filamentphp.com/docs/3.x/forms/adding-a-form-to-a-livewire-component#lifecycle-hooks)
Composants custom : [https://filamentphp.com/docs/3.x/forms/fields/custom](https://filamentphp.com/docs/3.x/forms/fields/custom)
Validation : [https://filamentphp.com/docs/3.x/forms/validation](https://filamentphp.com/docs/3.x/forms/validation)
