# Filament Forms

Doc officielle : [https://filamentphp.com/docs/3.x/forms/getting-started](https://filamentphp.com/docs/3.x/forms/getting-started)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Architecture générale](#1-architecture-générale--filament-repose-sur-livewire) | Filament = Laravel + Livewire. L'état du formulaire vit côté **serveur PHP**. |
| 2 | [Cycle de vie d'un formulaire](#2-le-cycle-de-vie-dun-formulaire) | `fill` → `mount` → interactions → `dehydrate` → save. |
| 3 | [Le State](#3-le-state--comment-filament-gère-les-données) | Un simple tableau PHP `$data[]` qui centralise toutes les valeurs des champs. |
| 4 | [Réactivité](#4-le-système-de-réactivité) | `->live()` pour qu'un champ déclenche un aller-retour serveur à chaque changement. |
| 5 | [Validation](#5-la-validation) | Les règles se déclarent directement sur le composant, en API fluente. |
| 6 | [Visibilité conditionnelle](#6-visibilité-conditionnelle) | `->visible()`, `->disabled()`, `->readOnly()` : trois comportements distincts. |
| 7 | [Pattern Fluent Builder](#7-le-pattern-fluent-builder) | Tous les composants sont chaînables. On **déclare**, Filament **construit**. |
| 8 | [Layout & columnSpan](#8-layout--la-théorie-du-columnspan) | Grille CSS configurable : `->columns(2)` + `->columnSpan(1)`. |
| 9 | [formatStateUsing vs dehydrateStateUsing](#9-formatstateusing-vs-dehydratestateusing) | Transformer les données à l'**affichage** ou à la **sauvegarde**. |
| 10 | [Organisation du code](#10-organisation-du-code---patterns) | Extraire les sections, blocs et partials dans des classes dédiées. |
| 11 | [Récapitulatif du flux de données](#récapitulatif-du-flux-de-données) | Vue d'ensemble du chemin BDD → formulaire → BDD. |
| → | [02 - Bloc Builder](02_BLOC_BUILDER.md) | Créer un page builder dynamique via JSON. |
| → | [03 - Composants custom](03_CUSTOM_COMPONENT.md) | Créer ses propres champs Filament. |

---

## 1. Architecture générale : Filament repose sur Livewire

> **En résumé** : Filament n'est pas une application JS. Tout tourne en PHP côté serveur. Chaque interaction passe par un aller-retour HTTP vers Laravel via Livewire. C'est ce qui rend la réactivité entre champs possible, mais aussi ce qui la rend "coûteuse" en requêtes.

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

> **En résumé** : Un formulaire Filament passe par 4 phases. `fill()` charge les données depuis la BDD. `mount()` initialise le composant. Les interactions déclenchent des mises à jour du state. Enfin, `dehydrate()` valide et sauvegarde. Comprendre ces phases aide à savoir **où placer sa logique**.

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

> **En résumé** : Le state, c'est simplement un tableau PHP `$data[]` qui vit dans le composant Livewire. Chaque champ lit et écrit dans ce tableau via son `statePath` (un chemin en dot-notation). `$get('field')` lit une valeur, `$set('field', val)` l'écrit. Tout le reste (validation, affichage, sauvegarde) se base sur ce tableau.

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

> **En résumé** : Par défaut, un champ ne déclenche rien avant la soumission du formulaire. `->live()` active les mises à jour en temps réel (aller-retour serveur à chaque changement). C'est indispensable pour des comportements comme "afficher ce champ si cet autre champ a telle valeur". À utiliser avec parcimonie : chaque `->live()` = une requête HTTP par interaction.

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

> **En résumé** : Les règles de validation se déclarent directement sur le champ avec des méthodes fluentes (`->required()`, `->email()`, `->unique()`). Filament les traduit en règles Laravel standard. On peut aussi injecter des closures pour une validation conditionnelle (ex : requis seulement à la création).

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

> **En résumé** : Trois méthodes distincts, trois comportements différents. `->visible(false)` supprime le champ du HTML. `->disabled()` l'affiche mais n'enregistre pas sa valeur. `->readOnly()` l'affiche, n'autorise pas la saisie, mais **conserve** la valeur en BDD. Le choix entre les trois a des implications sur la sauvegarde.

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

> **En résumé** : Chaque composant Filament retourne `$this` après chaque méthode, ce qui permet de chaîner les appels. L'approche est **déclarative** : on décrit ce que le formulaire doit faire, Filament s'occupe du rendu HTML et du comportement. Il n'y a pas de template Blade à écrire pour les cas courants.

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

> **En résumé** : Filament utilise une grille CSS configurable. Chaque `Section`, `Group` ou `Form` définit un nombre de colonnes avec `->columns(N)`. Les champs enfants déclarent combien de colonnes ils occupent avec `->columnSpan(N)` ou `->columnSpanFull()`. C'est le même modèle que CSS Grid, mais en PHP.

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

> **En résumé** : Ces deux méthodes permettent de transformer les données à deux moments clés. `formatStateUsing()` transforme la valeur **à l'affichage** (BDD → champ). `dehydrateStateUsing()` transforme la valeur **à la sauvegarde** (champ → BDD). Exemple typique : afficher un slug reformaté, mais hasher un mot de passe avant d'enregistrer.

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

## 10. Organisation du code - Patterns

> **En résumé** : Sur des formulaires complexes, on n'écrit pas tout dans la Resource. On extrait les sections dans des classes dédiées. C'est ce qui rend les formulaires maintenables même avec des dizaines de champs.

### Pattern 1 : Sections extraites dans des classes dédiées

Quand un formulaire est long (beaucoup d'onglets, de sections), on extrait chaque partie dans une classe avec une méthode `schema()` statique. La Resource reste lisible car elle ne contient plus que la structure.

```PHP
<?php
// Dans la Resource
Tab::make('General')->schema(Sections\GeneralTab::schema()),
Tab::make('Location')->schema(Sections\LocationTab::schema()),

// Dans app/Filament/Resources/Sections/GeneralTab.php
class GeneralTab
{
    public static function schema(): array
    {
        return [
            TextInput::make('name')->required(),
            // ...
        ];
    }
}
```

### Pattern 2 : Blocs Builder et Partials partagés

Pour les composants `Builder`, chaque bloc vit dans sa propre classe. Les éléments communs à plusieurs blocs (ex : un toggle "Masquer") sont extraits en **Partials**.

```
app/Filament/Resources/
├── Sections/
│   ├── GeneralTab.php
│   └── LocationTab.php
└── Blocks/
    ├── HeroBlock.php
    ├── ParagraphBlock.php
    └── Partials/
        └── VisibilityToggle.php   ← réutilisé dans tous les blocs
```

→ Pour le détail complet du Builder : [02 - Bloc Builder](02_BLOC_BUILDER.md)

→ Pour créer ses propres composants de formulaire : [03 - Composants custom](03_CUSTOM_COMPONENT.md)

## Récapitulatif du flux de données

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
