# Filament Forms - Composants custom

Doc officielle : [https://filamentphp.com/docs/3.x/forms/fields/custom](https://filamentphp.com/docs/3.x/forms/fields/custom)

← [Retour : Introduction](01_INTRODUCTION.md)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| — | [Pourquoi un composant custom ?](#pourquoi-créer-un-composant-custom-) | Pour les cas que les composants natifs ne couvrent pas. |
| 1 | [Architecture](#1-architecture-dun-composant-custom) | Une classe PHP `extends Field` + une vue Blade. |
| 2 | [La classe PHP](#2-la-classe-php) | Traits, `$view`, `setUp()`, getters, et méthodes fluides. |
| 3 | [Les traits Concerns](#3-les-traits-concerns) | Activer des comportements natifs (placeholder, affixes…) sans les réécrire. |
| 4 | [La vue Blade](#4-la-vue-blade) | Wrapper Filament + `wire:model` + UI custom Alpine.js. |
| 5 | [Variables disponibles dans la vue](#5-les-variables-disponibles-dans-la-vue) | Toutes les méthodes PHP publiques sont accessibles depuis Blade. |
| 6 | [Communication Vue ↔ PHP](#6-la-communication-vue--php-via-dispatchformevent) | `dispatchFormEvent` émet un event Blade → PHP écoute via `registerListeners`. |
| 7 | [Modifier d'autres champs](#7-modifier-dautres-champs-depuis-un-listener) | `$component->state()` ou `data_set($livewire, 'data.field', val)`. |
| 8 | [afterStateUpdated vs registerListeners](#8-afterstateupdated-vs-registerlisteners---quand-utiliser-quoi-) | Deux mécanismes de réactivité selon le déclencheur. |
| 9 | [Cycle de vie complet](#9-le-cycle-de-vie-complet-dun-composant-custom) | De l'instanciation au `dehydrate()` en passant par les interactions. |
| 10 | [Enregistrement (optionnel)](#10-enregistrement-du-composant-optionnel) | Déclarer le composant dans un `ServiceProvider` pour le raccourci de syntaxe. |
| — | [Récapitulatif](#récapitulatif) | Schéma complet classe PHP + vue Blade. |

---

## Pourquoi créer un composant custom ?

> **En résumé** : Les composants natifs (TextInput, Select, FileUpload…) couvrent l'essentiel. On crée un composant custom quand l'UI ou la logique sort du cadre standard : intégration d'une librairie JS tierce, widget visuel spécifique, ou réutilisation d'une logique métier complexe dans plusieurs formulaires.

Les composants natifs de Filament couvrent 90% des cas. Un composant custom est justifié quand :
* on intègre une API externe (autocomplétion, cartes, sélecteurs spéciaux...)
* on a besoin d'un widget UI particulier (color picker, drag-and-drop, éditeur de code...)
* on veut encapsuler une logique métier complexe qui dépasse ce qu'un afterStateUpdated peut faire

## 1. Architecture d'un composant custom

> **En résumé** : Un composant custom se compose toujours de deux fichiers qui travaillent ensemble : une classe PHP (la logique) et une vue Blade (le rendu). La classe déclare le `$view` qui pointe vers la Blade, et Filament se charge d'injecter les données automatiquement. Livewire fait le pont entre les interactions de la vue et les méthodes PHP.

Un composant custom est une classe PHP qui hérite de `Field` (ou d'un composant existant), couplée à une **vue Blade** qui gère le rendu HTML/Alpine.js.
```
MyCustomField.php          ← logique PHP (state, validation, listeners)
       ↕ $getStatePath(), $getSuggestions()...
my-custom-field.blade.php  ← rendu HTML + wire:model + Alpine.js
       ↕ wire:click / $dispatch
Livewire Component         ← gère les events entre vue et PHP
```

## 2. La classe PHP

> **En résumé** : La classe PHP est la colonne vertébrale du composant. Elle hérite de `Field`, déclare les traits voulus, indique sa vue Blade via `$view`, et configure tout son comportement dans `setUp()`. Les propriétés internes (ex : `$presets`) ne sont **pas** stockées en BDD — elles servent uniquement à configurer l'affichage. Les méthodes publiques `get*()` sont accessibles dans la vue Blade. Les méthodes fluides (ex : `->presets([...])`) permettent de configurer le composant depuis la Resource, comme n'importe quel composant natif.

```PHP
<?php
namespace App\Forms\Components;

use Filament\Forms\Components\Concerns;
use Filament\Forms\Components\Field;

class ColorPicker extends Field
{
    // (1) Traits optionnels pour activer des comportements natifs
    use Concerns\CanBeLengthConstrained;
    use Concerns\HasPlaceholder;
    use Concerns\HasAffixes;

    // (2) Vue Blade associée
    protected string $view = 'forms.components.color-picker';

    // (3) État interne du composant (pas stocké en BDD)
    protected array $presets = [];

    // (4) Cycle de vie : appelé à l'initialisation
    protected function setUp(): void
    {
        parent::setUp();

        // Valeur par défaut
        $this->default('#ffffff');

        // Callback à chaque changement de valeur
        $this->afterStateUpdated(function (?string $state) {
            // logique métier...
        });

        // Écoute des events Livewire émis depuis la vue
        $this->registerListeners([
            'colorPicker::selectPreset' => [
                function (ColorPicker $component, string $statePath, string $color): void {
                    // Vérification de sécurité essentielle
                    if ($component->isDisabled()) return;
                    if ($statePath !== $component->getStatePath()) return;

                    // Modifier le state directement
                    $component->state($color);
                },
            ],
        ]);
    }

    // (5) Méthodes "getter" appelables depuis la vue Blade
    public function getPresets(): array
    {
        return $this->presets;
    }

    // (6) API fluide : configurable depuis la Resource
    public function presets(array $colors): static
    {
        $this->presets = $colors;
        return $this; // indispensable pour le chaînage
    }
}
```
### Utilisation dans une Resource :
```PHP
<?php
ColorPicker::make('brand_color')
    ->presets(['#ff0000', '#00ff00', '#0000ff'])
    ->required(),
```

## 3. Les traits Concerns

> **En résumé** : Plutôt que de réimplémenter `placeholder`, `prefix`, `maxLength`… à la main, on `use` les traits fournis par Filament. Chaque trait ajoute à la fois la méthode fluide (utilisable depuis la Resource : `->placeholder('...')`) et le getter correspondant (utilisable depuis la Blade : `$getPlaceholder()`). On ne prend que ce dont on a besoin.

Filament fournit des dizaines de traits dans `Filament\Forms\Components\Concerns` que tu peux composer librement dans ton composant. Ils ajoutent des méthodes et comportements prêts à l'emploi :

| Trait                   |	Méthodes ajoutées                               |
| ----------------------- | ----------------------------------------------- |
| HasPlaceholder          | ->placeholder('...'), $getPlaceholder()         |
| HasAffixes              | ->prefix('€'), ->suffix('%'), ->prefixIcon(...) |
| CanBeLengthConstrained  |	->minLength(), ->maxLength(), $getMaxLength()   |
| HasExtraInputAttributes |	->extraInputAttributes([...])                   |
| CanBeAutofocused        | ->autofocus(), $isAutofocused()                 |
| CanBeReadOnly           |	->readOnly(), $isReadOnly()                     |
| HasHint                 |	->hint('...'), ->hintIcon(...)                  |

Ces méthodes sont alors **automatiquement disponibles dans la vue Blade** grâce aux variables injectées.

## 4. La vue Blade

> **En résumé** : La vue Blade doit toujours être enveloppée dans `<x-dynamic-component :component="$getFieldWrapperView()">` — c'est le wrapper Filament qui gère le label, les erreurs de validation et le helper text. À l'intérieur, on écrit l'HTML/Alpine.js qu'on veut. L'input doit utiliser `wire:model="{{ $getStatePath() }}"` pour être synchronisé avec le state PHP. Pour les actions (clics, sélections), on utilise `dispatchFormEvent()`.

C'est le cœur du rendu. Filament injecte automatiquement des variables dans la vue à partir de la classe PHP.
```PHP
{{-- resources/views/forms/components/color-picker.blade.php --}}

{{-- (1) Wrapper standard Filament : label, helper-text, erreurs de validation --}}
<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
    :id="$getId()"
    :label="$getLabel()"
    :required="$isRequired()"
    :state-path="$getStatePath()"
>
    {{-- (2) Contenu custom --}}
    <div x-data="{ open: false }">

        {{-- (3) L'input lié au state Livewire --}}
        <input
            {{ $applyStateBindingModifiers('wire:model') }}="{{ $getStatePath() }}"
            type="text"
            id="{{ $getId() }}"
            @if($isDisabled()) disabled @endif
            @if($placeholder = $getPlaceholder()) placeholder="{{ $placeholder }}" @endif
        />

        {{-- (4) UI custom : galerie de couleurs préréglées --}}
        @if(count($getPresets()) > 0)
            <div class="flex gap-2 mt-2">
                @foreach($getPresets() as $color)
                    <button
                        type="button"
                        style="background-color: {{ $color }}"
                        class="w-6 h-6 rounded-full border"
                        {{-- (5) Dispatch d'un event Livewire vers PHP --}}
                        wire:click="dispatchFormEvent(
                            'colorPicker::selectPreset',
                            '{{ $getStatePath() }}',
                            '{{ $color }}'
                        )"
                    ></button>
                @endforeach
            </div>
        @endif

    </div>
</x-dynamic-component>
```

## 5. Les variables disponibles dans la vue

> **En résumé** : Filament transforme automatiquement les méthodes publiques de la classe PHP en variables Blade. `getLabel()` devient `$getLabel()` dans la vue, `getPresets()` devient `$getPresets()`, etc. On n'a donc jamais besoin de passer des données manuellement — il suffit d'écrire un getter public dans la classe PHP et il est immédiatement disponible dans la vue.

Filament injecte automatiquement des variables via son système de `ViewComponent`. Les principales :

| Variable / méthode                        | Retourne                                             |
| ----------------------------------------- | ---------------------------------------------------- |
| $getId()                                  | L'identifiant HTML unique du champ                   |
| $getLabel()                               |	Le label du champ                                    |
| $getStatePath()                           |	Ex: data.brand_color - chemin dans le state Livewire |
| $isDisabled()                             |	true si ->disabled()                                 |
| $isRequired()                             |	true si ->required()                                 |
| $getPlaceholder()                         |	La valeur du placeholder                             |
| $getHelperText()                          | Le texte d'aide                                      |
| $getHint()                                | Le hint                                              |
| $getExtraAttributes()                     |	Attributs HTML supplémentaires                       |
| $applyStateBindingModifiers('wire:model') |	wire:model ou wire:model.live selon la config        |
| $getFieldWrapperView()                    | La vue du wrapper Filament (label, erreurs...)       |
| $field                                    | L'instance complète de la classe PHP                 |

Toutes les méthodes publiques de ta classe PHP sont aussi accessibles directement dans la vue, donc `$getPresets()`, `$getSuggestions()`, etc.

## 6. La communication Vue ↔ PHP via `dispatchFormEvent`

> **En résumé** : `wire:model` gère la synchronisation passive (l'input met à jour le state automatiquement). Pour les interactions actives (clic sur un bouton, sélection dans une liste de suggestions…), on utilise `dispatchFormEvent()` côté Blade pour émettre un event nommé, et `registerListeners()` côté PHP pour l'écouter. Le `statePath` est toujours passé en paramètre pour identifier quel composant a émis l'event — indispensable quand plusieurs instances coexistent.

C'est le mécanisme clé pour faire communiquer Alpine.js/Blade vers PHP.

### Côté vue (Blade) - émettre un event :
```PHP
wire:click="dispatchFormEvent('myComponent::doSomething', '{{ $getStatePath() }}', 'param1')"
```

### Côté PHP - écouter l'event :
```PHP
<?php
$this->registerListeners([
    'myComponent::doSomething' => [
        function (MyComponent $component, string $statePath, string $param1): void {

            // ① Toujours vérifier ces deux conditions
            if ($component->isDisabled()) return;
            if ($statePath !== $component->getStatePath()) return;

            // ② Modifier le state du composant
            $component->state('nouvelle valeur');

            // ③ Ou modifier d'autres champs du formulaire directement
            $livewire = $component->getLivewire();
            data_set($livewire, 'data.other_field', 'valeur');
        },
    ],
]);
```

> Pourquoi vérifier `$statePath !== $component->getStatePath()` ?
> Parce qu'un même formulaire Livewire peut contenir plusieurs instances du même composant (ex : dans un Repeater). Sans cette vérification, tous les composants répondraient à l'event en même temps.

## 7. Modifier d'autres champs depuis un listener

> **En résumé** : Depuis un `registerListeners`, on peut modifier n'importe quel champ du formulaire, pas seulement le composant courant. Pour le composant lui-même : `$component->state('valeur')`. Pour un autre champ : on récupère l'instance Livewire avec `$component->getLivewire()` et on écrit directement dans `$data` via `data_set()`. C'est l'équivalent de `$set()` mais disponible aussi en dehors d'un `afterStateUpdated`.

Deux approches selon ce qu'on veut faire :

### A - Modifier le state directement sur le composant courant :
```PHP
<?php
$component->state('nouvelle valeur');
```

### B - Modifier un autre champ du formulaire :
```PHP
<?php
$livewire = $component->getLivewire();
data_set($livewire, 'data.slug', 'nouvelle-valeur');
data_set($livewire, 'data.latitude', 48.8566);
```

`data_set()` est une helper Laravel qui écrit dans des tableaux imbriqués via dot-notation. C'est l'équivalent d'un `$set('field', value)` mais utilisable hors d'un callback standard.

## 8. `afterStateUpdated` vs `registerListeners` - quand utiliser quoi ?

> **En résumé** : `afterStateUpdated` est déclenché automatiquement quand `wire:model` met à jour la valeur du champ (l'utilisateur tape ou sélectionne). `registerListeners` est déclenché par un event custom qu'on émet volontairement depuis la vue. Règle simple : si la réaction vient d'un changement de valeur → `afterStateUpdated`. Si elle vient d'une action UI spécifique (clic, sélection dans une autocomplete…) → `registerListeners`.

|             | afterStateUpdated                             |	registerListeners                                  |
| ----------- | --------------------------------------------- | -------------------------------------------------- |
| Déclencheur |	Changement de la valeur du champ (wire:model)	| Event custom émis depuis la vue                    |
| Usage       |	Réagir à la saisie utilisateur                | Réagir à un clic ou action UI complexe             |
| Contexte    |	$state, $set, $get disponibles                | Instance complète du composant disponible          |
| Exemple     |	Auto-générer un slug                          | Sélectionner un item dans une liste de suggestions |

## 9. Le cycle de vie complet d'un composant custom

> **En résumé** : Connaître ce cycle aide à savoir où placer sa logique. `setUp()` est le bon endroit pour les defaults, listeners et callbacks (pas dans le constructeur). `afterStateHydrated()` sert à transformer les données juste après leur chargement depuis la BDD. `afterStateUpdated()` réagit aux interactions. `dehydrateStateUsing()` transforme les données juste avant la sauvegarde.

```
1. new MyComponent()        ← instanciation
2. setUp()                  ← configuration (defaults, listeners, callbacks)
3. mount() / fill()         ← hydratation du state depuis le modèle
4. afterStateHydrated()     ← callback post-hydratation (si défini)
       ↓
   [rendu de la vue Blade]
       ↓
5. Interaction utilisateur  ← frappe / clic dans la vue
6. wire:model update        ← Livewire met à jour le state PHP
7. afterStateUpdated()      ← callback post-update
8. dispatchFormEvent()      ← event custom → registerListeners
       ↓
   [re-render de la vue]
       ↓
9. getState() / dehydrate() ← lors du submit : extraction + transformation
10. dehydrateStateUsing()   ← transformation finale avant save
```

## 10. Enregistrement du composant (optionnel)

> **En résumé** : Par défaut, un composant custom s'utilise avec son namespace complet (`App\Forms\Components\ColorPicker::make(...)`). L'enregistrement dans un `ServiceProvider` n'est utile que si on distribue le composant sous forme de package Laravel, ou si on veut pouvoir l'appeler sans namespace dans tout le projet. Pour un usage interne dans une seule appli, c'est optionnel.

Pour utiliser le composant avec sa syntaxe courte (sans namespace complet), il faut l'enregistrer dans un `ServiceProvider` :
```PHP
<?php
// app/Providers/AppServiceProvider.php

use Filament\Support\Facades\FilamentView;
use App\Forms\Components\ColorPicker;

public function boot(): void
{
    // Pas nécessaire pour l'usage interne, mais utile pour les packages
    Filament::registerFormComponents([
        ColorPicker::class,
    ]);
}
```

## Récapitulatif

```
MyCustomField extends Field
│
├── Traits Concerns\*          → comportements natifs (placeholder, affixes...)
├── $view                      → pointe vers la vue Blade
├── setUp()
│   ├── $this->default(...)
│   ├── $this->afterStateUpdated(...)
│   └── $this->registerListeners([
│           'myField::event' => [fn(MyField $c, $statePath, ...) => ...]
│       ])
├── Getters publics            → accessibles dans la vue ($getSuggestions()...)
└── Méthodes fluides           → ->presets([...]) pour configurer depuis la Resource

my-field.blade.php
├── <x-dynamic-component :component="$getFieldWrapperView()">  → wrapper Filament
├── <input wire:model="...">   → lié au state via $getStatePath()
└── wire:click="dispatchFormEvent('myField::event', '...')"    → event vers PHP
```

Sources :

Custom fields : [https://filamentphp.com/docs/3.x/forms/fields/custom](https://filamentphp.com/docs/3.x/forms/fields/custom)
Concerns disponibles : [https://github.com/filamentphp/filament/tree/3.x/packages/forms/src/Components/Concerns](https://github.com/filamentphp/filament/tree/3.x/packages/forms/src/Components/Concerns)
Livewire events : [https://livewire.laravel.com/docs/events](https://livewire.laravel.com/docs/events)

