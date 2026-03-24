# Laravel Filament — Vue d'ensemble

## Qu'est-ce que Filament ?

Filament est un ensemble de composants full-stack pour Laravel, construit sur Livewire et Alpine.js. Il permet de créer des panneaux d'administration, des formulaires et des tables de données de manière rapide et élégante.

Site officiel : [https://filamentphp.com](https://filamentphp.com)
Documentation : [https://filamentphp.com/docs](https://filamentphp.com/docs)
GitHub : [https://github.com/filamentphp/filament](https://github.com/filamentphp/filament)

## Les packages principaux (v3)

Filament v3 est modulaire et se compose de plusieurs packages indépendants :

| Package                | Rôle                                   |
| ---------------------- | -------------------------------------- |
| filament/filament      |	Le panel complet (admin)              |
| filament/forms         |	Constructeur de formulaires           |
| filament/tables        |	Constructeur de tables                |
| filament/notifications |	Système de notifications              |
| filament/actions       |	Actions (modals, confirmations...)    |
| filament/infolist      |	Affichage de données en lecture seule |
| filament/widgets       |	Widgets (stats, charts...)            |

## Les concepts fondamentaux

1. Resources

La pièce maîtresse de Filament. Chaque `Resource` correspond à un modèle Eloquent et génère automatiquement les pages CRUD.
```bash
php artisan make:filament-resource Post --generate
```

Une resource contient :
* `form()` — le formulaire de création/édition
* `table()` — la table de liste
* `getPages()` — les pages associées (List, Create, Edit, View)

2. Pages

Des pages personnalisées comme le Login.php que tu as ouvert. On peut créer des pages entièrement custom :
```bash
php artisan make:filament-page Settings
```

3. Widgets

Des blocs affichés sur le dashboard ou dans les pages :
* `StatsOverviewWidget` — cartes de statistiques
* `ChartWidget` — graphiques
* `TableWidget` — tables embarquées

4. Panels

En v3, tout est organisé en **Panels**. Un panel = une instance d'administration avec sa propre URL, ses middlewares, ses couleurs, etc.
```php
<?php
// app/Providers/Filament/AdminPanelProvider.php
->path('admin')
->login(Login::class) // ← ton fichier custom
->colors(['primary' => Color::Amber])
```

## Les formulaires

Filament fournit des dizaines de composants de formulaire :
```php
<?php
Forms\Components\TextInput::make('name')->required(),
Forms\Components\Select::make('status')->options([...]),
Forms\Components\RichEditor::make('content'),
Forms\Components\FileUpload::make('avatar'),
Forms\Components\Toggle::make('is_active'),
Forms\Components\DateTimePicker::make('published_at'),
```

## Les tables
```php
<?php
Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
Tables\Columns\BadgeColumn::make('status'),
Tables\Columns\ImageColumn::make('avatar'),

// Filtres
Tables\Filters\SelectFilter::make('status'),
Tables\Filters\TrashedFilter::make(),

// Actions
Tables\Actions\EditAction::make(),
Tables\Actions\DeleteAction::make(),
```

## Resources pour apprendre

Docs officielles v3 : [https://filamentphp.com/docs/3.x/panels/getting-started](https://filamentphp.com/docs/3.x/panels/getting-started)
Tutoriels vidéo : [https://filamentphp.com/screencasts](https://filamentphp.com/screencasts) (screencasts officiels)
Laracasts : [https://laracasts.com](https://laracasts.com) (rechercher "Filament")
GitHub discussions : [https://github.com/filamentphp/filament/discussions](https://github.com/filamentphp/filament/discussions)
Discord officiel : lien disponible sur le site officiel
