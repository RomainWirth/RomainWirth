# Laravel Filament - Vue d'ensemble

## Qu'est-ce que Filament ?

Filament est un ensemble de composants full-stack pour Laravel, construit sur **Livewire** et **Alpine.js**. Il permet de créer des panneaux d'administration, des formulaires et des tables de données de manière rapide et élégante.

> **À retenir :** Filament n'est pas un SPA JavaScript. Tout l'état vit côté serveur PHP (Livewire). Chaque interaction déclenche une requête AJAX vers le serveur, qui re-rend le composant et renvoie uniquement le diff HTML. C'est ce qui rend la réactivité entre champs possible sans écrire de JS.

Site officiel : [https://filamentphp.com](https://filamentphp.com)
Documentation : [https://filamentphp.com/docs](https://filamentphp.com/docs)
GitHub : [https://github.com/filamentphp/filament](https://github.com/filamentphp/filament)

---

## Les packages principaux (v3)

Filament v3 est **modulaire** : chaque package peut être utilisé indépendamment dans n'importe quel projet Laravel (pas uniquement dans un panel d'admin).

| Package                | Rôle                                   | Cours                                                  |
| ---------------------- | -------------------------------------- | ------------------------------------------------------ |
| `filament/filament`    | Le panel complet (admin)               | ------------------------------------------------------ |
| `filament/forms`       | Constructeur de formulaires            | [Forms](FORMS/01_INTRODUCTION.md)                      |
| `filament/tables`      | Constructeur de tables                 | [Tables](TABLES/01_LES_TABLES.md)                      |
| `filament/notifications` | Système de notifications             | [Notifications](NOTIFICATIONS/01_LES_NOTIFICATIONS.md) |
| `filament/actions`     | Actions (modals, confirmations...)     | [Actions](ACTIONS/01_LES_ACTIONS.md)                   |
| `filament/infolist`    | Affichage de données en lecture seule  | [Infolist](INFOLIST/01_INFOLIST.md)                    |
| `filament/widgets`     | Widgets (stats, charts...)             | [Widgets](WIDGETS/01_LES_WIDGETS.md)                   |

---

## Les concepts fondamentaux

### 1. Resources

La pièce maîtresse de Filament. Chaque `Resource` correspond à un **modèle Eloquent** et génère automatiquement les pages CRUD (liste, création, édition, vue).

> C'est l'équivalent d'un contrôleur + vues CRUD, mais configuré entièrement en PHP, sans blade à écrire à la main.

```bash
php artisan make:filament-resource Post --generate
```

Une Resource contient :
* `form()` - le formulaire de création/édition → voir [Forms](FORMS/01_INTRODUCTION.md)
* `table()` - la table de liste → voir [Tables](TABLES/01_LES_TABLES.md)
* `infolist()` - la vue lecture seule → voir [Infolist](INFOLIST/01_INFOLIST.md)
* `getPages()` - les pages associées (List, Create, Edit, View)
* `getRelations()` - les RelationManagers (tables imbriquées) → voir [Réactivité avancée](REACTIVITE_AVANCEE/REACTIVITE_AVANCEE.md)

Structure générée :
```
app/Filament/Resources/PostResource.php
app/Filament/Resources/PostResource/Pages/
    ListPosts.php
    CreatePost.php
    EditPost.php
    ViewPost.php     ← si --view
```

### 2. Pages

Des pages Filament **sans modèle associé**, utiles pour des interfaces custom : dashboard métier, formulaire de configuration, outils internes...

> Contrairement à une Resource qui est liée à un modèle Eloquent, une page custom est une ardoise vierge - on y met ce qu'on veut : formulaire, table, widgets, HTML libre.

```bash
php artisan make:filament-page Settings
```

→ Voir le cours complet : [Pages custom](PAGE_CUSTOM/01_PAGES_CUSTOM.md)

### 3. Widgets

Des blocs réutilisables affichés sur le **dashboard** ou dans les pages. Trois types natifs :

* `StatsOverviewWidget` - cartes de statistiques (chiffres clés)
* `ChartWidget` - graphiques (line, bar, pie...) via Chart.js
* `TableWidget` - table Filament embarquée dans un widget

> Les widgets se rafraîchissent automatiquement via polling et peuvent recevoir le `$record` courant dans une page d'édition.

→ Voir le cours complet : [Widgets](WIDGETS/01_LES_WIDGETS.md)

### 4. Panels

En v3, tout est organisé en **Panels**. Un panel = une instance d'administration avec sa propre URL, ses propres Resources, ses middlewares, ses couleurs, son logo...

> On peut avoir plusieurs panels dans un même projet (ex : `/admin` pour les admins, `/app` pour les clients), chacun avec ses propres règles d'accès.

```php
<?php
// app/Providers/Filament/AdminPanelProvider.php
->id('admin')
->path('admin')
->colors(['primary' => Color::Amber])
->login()
->databaseNotifications()
```

→ Voir le cours complet : [Navigation & Panel](NAVIGATION_&_PANEL/01_NAVIGATION_&_PANEL.md)

---

## Les formulaires

Filament fournit des dizaines de composants de formulaire. L'état du formulaire vit côté serveur ; la réactivité entre champs (afficher/masquer, calculer une valeur) se fait via des callbacks PHP.

```php
<?php
Forms\Components\TextInput::make('name')->required(),
Forms\Components\Select::make('status')->options([...]),
Forms\Components\RichEditor::make('content'),
Forms\Components\FileUpload::make('avatar'),
Forms\Components\Toggle::make('is_active'),
Forms\Components\DateTimePicker::make('published_at'),
```

→ Voir les cours :
- [Forms - Architecture & cycle de vie](FORMS/01_INTRODUCTION.md)
- [Forms - Block Builder](FORMS/02_BLOC_BUILDER.md)
- [Forms - Composants custom](FORMS/03_CUSTOM_COMPONENT.md)
- [Réactivité avancée (hooks, lifecycle, RelationManagers...)](REACTIVITE_AVANCEE/REACTIVITE_AVANCEE.md)

---

## Les tables

Les tables gèrent l'affichage, le tri, la recherche, le filtrage et les actions sur les données.

```php
<?php
Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
Tables\Columns\BadgeColumn::make('status'),
Tables\Columns\ImageColumn::make('avatar'),

// Filtres
Tables\Filters\SelectFilter::make('status'),
Tables\Filters\TrashedFilter::make(),

// Actions par ligne et en masse
Tables\Actions\EditAction::make(),
Tables\Actions\DeleteAction::make(),
```

→ Voir le cours complet : [Tables](TABLES/01_LES_TABLES.md)

---

## Les actions

Une Action est un bouton déclencheur qui peut ouvrir une modale, exécuter du code PHP, rediriger, etc. Elles s'utilisent dans les tables, les formulaires, les pages et les Infolists.

> Filament fournit des actions CRUD prêtes à l'emploi (`EditAction`, `DeleteAction`...) et permet d'en créer des custom avec `Action::make()`.

→ Voir le cours complet : [Actions](ACTIONS/01_LES_ACTIONS.md)

---

## Les notifications

Filament propose deux types : les **toasts** (flash visuels éphémères) et les **notifications en base de données** (persistées, accessibles via une cloche dans le header du panel).

→ Voir le cours complet : [Notifications](NOTIFICATIONS/01_LES_NOTIFICATIONS.md)

---

## L'Infolist

L'Infolist est l'équivalent **lecture seule** d'un formulaire. Il s'utilise sur la page `ViewRecord` d'une Resource pour afficher les données sans champs éditables (`TextEntry`, `BadgeEntry`, `ImageEntry`...).

→ Voir le cours complet : [Infolist](INFOLIST/01_INFOLIST.md)

---

## Autorisation & Policies

Filament s'appuie automatiquement sur les **Policies Eloquent** de Laravel. Si une Policy est enregistrée pour un modèle, Filament masque ou bloque les actions (créer, éditer, supprimer) selon les retours de ses méthodes.

> L'accès au panel lui-même est contrôlé par `canAccessPanel()` sur le modèle `User`.

→ Voir le cours complet : [Auth & Policies](AUTH_&_POLICIES/01_AUTH_&_POLICIES.md)

---

## Ressources pour apprendre

Docs officielles v3 : [https://filamentphp.com/docs/3.x/panels/getting-started](https://filamentphp.com/docs/3.x/panels/getting-started)
Screencasts officiels : [https://filamentphp.com/screencasts](https://filamentphp.com/screencasts)
Laracasts : [https://laracasts.com](https://laracasts.com) (rechercher "Filament")
GitHub discussions : [https://github.com/filamentphp/filament/discussions](https://github.com/filamentphp/filament/discussions)
