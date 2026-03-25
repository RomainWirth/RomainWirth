# Filament - Navigation & Configuration du Panel

Doc officielle : [https://filamentphp.com/docs/3.x/panels/navigation](https://filamentphp.com/docs/3.x/panels/navigation)

---

## Sommaire

| N° | Section | En une phrase |
| -- | ------- | ------------- |
| 1 | [Le Panel Provider](#1-le-panel-provider) | Point d'entrée unique pour toute la configuration du panel. |
| 2 | [Couleurs et thème](#2-couleurs-et-thème) | Palette Tailwind ou RGB custom, dark mode. |
| 3 | [Logo, favicon, icône](#3-logo-favicon-icône) | Personnaliser l'identité visuelle de la sidebar. |
| 4 | [Navigation par défaut](#4-la-navigation-par-défaut--autodiscovery) | Autodiscovery des Resources/Pages/Widgets + propriétés statiques de navigation. |
| 5 | [Groupes de navigation](#5-groupes-de-navigation) | Regrouper les items dans la sidebar et contrôler l'ordre des groupes. |
| 6 | [Badges dynamiques](#6-badges-dynamiques-sur-les-items-de-navigation) | Compteur en temps réel sur un item de menu. |
| 7 | [Navigation manuelle](#7-navigation-entièrement-manuelle) | Désactiver l'autodiscovery et construire la navigation à la main. |
| 8 | [Le Dashboard](#8-le-dashboard) | Personnaliser ou remplacer la page d'accueil du panel. |
| 9 | [Multi-panels](#9-multi-panels) | Plusieurs panels indépendants (admin, client…) sur la même app. |
| 10 | [Sidebar avancée](#10-personnalisation-avancée-de-la-sidebar) | Réductible, full-collapsed, navigation horizontale. |
| 11 | [Render hooks](#11-render-hooks---injecter-du-html-partout) | Injecter du HTML ou des vues Blade à n'importe quel endroit du panel. |
| — | [Récapitulatif](#récapitulatif) | Vue d'ensemble Panel Provider, navigation, apparence, multi-panels. |

---

## 1. Le Panel Provider

> **En résumé** : Le Panel Provider est le fichier de configuration central de Filament — l'équivalent d'un `config/` mais sous forme de classe fluente. Tout y passe : l'URL du panel, la page de login, les couleurs, les dossiers à scanner pour l'autodiscovery, les middlewares d'authentification. Un projet peut avoir plusieurs Panel Providers (un par panel). La méthode `panel()` retourne l'objet `Panel` après chaînage de toutes les options.

Tout part du **Panel Provider**, généré lors de l'installation :
```bash
php artisan filament:install --panels
# génère : app/Providers/Filament/AdminPanelProvider.php
```
C'est ici que se configure l'intégralité du panel :
```PHP
<?php

namespace App\Providers\Filament;

use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()                       // panel par défaut
            ->id('admin')                     // identifiant unique
            ->path('admin')                   // URL : /admin
            ->login()                         // active la page de login
            ->registration()                  // active la page d'inscription
            ->passwordReset()                 // active le reset de mot de passe
            ->colors([...])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->middleware([...])
            ->authMiddleware([Authenticate::class]);
    }
}
```

## 2. Couleurs et thème

> **En résumé** : Filament utilise Tailwind CSS et expose six emplacements de couleur (`primary`, `gray`, `danger`, `info`, `success`, `warning`). Chacun accepte une constante `Color::*` (toutes les couleurs Tailwind), un code hex, ou un tableau complet de nuances RGB 50→950 pour un contrôle total. La couleur `primary` est la plus visible : elle colore les boutons, les liens actifs et les badges. `darkMode(false)` supprime le toggle dark/light.

### Palette de couleurs
```PHP
<?php
use Filament\Support\Colors\Color;

->colors([
    'primary' => Color::Amber,    // couleur principale (boutons, liens actifs)
    'gray'    => Color::Slate,    // fond général
    'danger'  => Color::Rose,
    'info'    => Color::Blue,
    'success' => Color::Emerald,
    'warning' => Color::Orange,
])
```
Les couleurs disponibles correspondent à Tailwind : `Color::Red`, `Color::Blue`, `Color::Green`, `Color::Purple`, `Color::Indigo`...

On peut aussi passer une couleur RGB personnalisée :
```PHP
<?php
'primary' => Color::hex('#e11d48'), // rose-600
// ou
'primary' => [
    50  => '254, 242, 242',
    100 => '254, 226, 226',
    // ... (toutes les nuances 50→950 en RGB)
    900 => '127, 29, 29',
    950 => '69, 10, 10',
],
```

### Dark mode
```PHP
<?php
->darkMode(false)    // désactiver le dark mode
// Par défaut, Filament suit le système de l'utilisateur.
// Pour forcer le dark mode :
->darkMode(DefaultThemeMode::Dark)
```

## 3. Logo, favicon, icône

> **En résumé** : Par défaut Filament affiche le `$brandName` en texte dans la sidebar. `->brandLogo()` remplace ce texte par une image. `->darkModeBrandLogo()` permet de fournir une version alternative pour le dark mode (souvent logo blanc sur fond sombre). `->brandLogoHeight()` contrôle la taille. `->favicon()` met à jour l'icône dans l'onglet du navigateur.

```PHP
<?php
->brandName('Mon Application')               // nom dans la sidebar
->brandLogo(asset('images/logo.svg'))        // logo (remplace le nom texte)
->brandLogoHeight('2rem')                    // hauteur du logo
->darkModeBrandLogo(asset('images/logo-white.svg')) // logo pour le dark mode
->favicon(asset('images/favicon.ico')),
```

## 4. La navigation par défaut : autodiscovery

> **En résumé** : `discoverResources()` / `discoverPages()` / `discoverWidgets()` font en sorte que Filament scanne les dossiers configurés et enregistre automatiquement tout ce qu'il trouve — pas besoin de déclarer chaque classe manuellement. L'ordre et l'apparence de chaque item dans la sidebar se contrôlent via les propriétés statiques `$navigationIcon`, `$navigationLabel`, `$navigationGroup` et `$navigationSort` directement sur la Resource.

Filament **découvre automatiquement** les Resources, Pages et Widgets dans les dossiers configurés. Chaque Resource est ajoutée à la navigation selon ses propriétés statiques :
```PHP
<?php
class PostResource extends Resource
{
    protected static ?string $navigationIcon  = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Articles';         // label dans le menu
    protected static ?string $navigationGroup = 'Contenu';          // groupe de menu
    protected static ?int    $navigationSort  = 2;                   // ordre dans le groupe
    protected static ?string $modelLabel      = 'article';           // label singulier
    protected static ?string $pluralModelLabel = 'articles';         // label pluriel
}
```

## 5. Groupes de navigation

> **En résumé** : Déclarer le même `$navigationGroup = 'Contenu'` sur plusieurs Resources les regroupe automatiquement dans la sidebar. L'ordre des items à l'intérieur d'un groupe se gère avec `$navigationSort`. L'ordre des **groupes entre eux** se définit dans le Panel Provider via `->navigationGroups([...])` — le paramètre `->collapsed()` permet de replier un groupe par défaut.

Les groupes regroupent visuellement les items dans la sidebar. Il suffit de mettre le même `$navigationGroup` sur plusieurs Resources :
```PHP
<?php
// PostResource
protected static ?string $navigationGroup = 'Contenu';
protected static ?int    $navigationSort  = 1;

// CategoryResource
protected static ?string $navigationGroup = 'Contenu';
protected static ?int    $navigationSort  = 2;

// UserResource
protected static ?string $navigationGroup = 'Utilisateurs';
```
Pour contrôler l'**ordre des groupes** eux-mêmes, on les déclare dans le Panel Provider :
```PHP
<?php
->navigationGroups([
    NavigationGroup::make('Contenu')
        ->icon('heroicon-o-document-text')
        ->collapsed(),          // groupe replié par défaut
    NavigationGroup::make('Utilisateurs')
        ->icon('heroicon-o-users'),
    NavigationGroup::make('Settings')
        ->icon('heroicon-o-cog-6-tooth')
        ->collapsed(),
])
```

## 6. Badges dynamiques sur les items de navigation

> **En résumé** : `getNavigationBadge()` retourne une chaîne affichée dans une pastille à droite de l'item de menu — typiquement un compteur. `getNavigationBadgeColor()` change la couleur selon la valeur (ex : rouge si plus de 10 commandes en attente). `getNavigationBadgeTooltip()` ajoute une info-bulle au survol. Ces méthodes sont appelées à chaque rendu de la navigation : penser à mettre le résultat en cache si la requête est coûteuse.

Un badge (compteur) affiché à droite d'un item de menu :
```PHP
<?php
class OrderResource extends Resource
{
    public static function getNavigationBadge(): ?string
    {
        // Affiche le nombre de commandes en attente
        return static::getModel()::where('status', 'pending')->count() ?: null;
    }

    public static function getNavigationBadgeColor(): string | array | null
    {
        $count = static::getModel()::where('status', 'pending')->count();

        return $count > 10 ? 'danger' : 'warning';
    }

    public static function getNavigationBadgeTooltip(): ?string
    {
        return 'Commandes en attente de traitement';
    }
}
```

## 7. Navigation entièrement manuelle

> **En résumé** : Quand l'autodiscovery ne suffit pas (ordre très précis, items conditionnels, liens externes…), on passe une closure à `->navigation()` dans le Panel Provider. On construit alors la navigation avec `NavigationItem::make()` et `NavigationGroup::make()`. `...PostResource::getNavigationItems()` récupère les items générés par la Resource pour les intégrer dans un groupe custom. `->isActiveWhen()` définit quand l'item doit être considéré actif.

Pour désactiver l'autodiscovery et tout contrôler manuellement :
```PHP
<?php
->navigation(function (NavigationBuilder $builder): NavigationBuilder {
    return $builder
        ->items([
            NavigationItem::make('Dashboard')
                ->icon('heroicon-o-home')
                ->url(route('filament.admin.pages.dashboard'))
                ->isActiveWhen(fn () => request()->routeIs('filament.admin.pages.dashboard')),
        ])
        ->groups([
            NavigationGroup::make('Contenu')
                ->items([
                    ...PostResource::getNavigationItems(),
                    ...CategoryResource::getNavigationItems(),
                ]),
            NavigationGroup::make('Utilisateurs')
                ->items([
                    ...UserResource::getNavigationItems(),
                ]),
        ]);
})
```

## 8. Le Dashboard

> **En résumé** : Le Dashboard (`/admin`) est une page Filament comme les autres — elle peut être surchargée en créant `app/Filament/Pages/Dashboard.php` qui étend `\Filament\Pages\Dashboard`. `getColumns()` contrôle le nombre de colonnes de la grille de widgets. Pour le supprimer complètement, il suffit de ne pas l'inclure dans `->pages([])`.

Le Dashboard est une page spéciale (`/admin`). On peut la personnaliser ou la remplacer :

### Changer le titre et l'en-tête
```PHP
<?php
// app/Filament/Pages/Dashboard.php (créée automatiquement ou à créer)
<?php

namespace App\Filament\Pages;

class Dashboard extends \Filament\Pages\Dashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    protected static ?string $title = 'Tableau de bord';

    public function getColumns(): int | array
    {
        return 3; // nombre de colonnes pour les widgets
    }
}
```

### Désactiver le Dashboard
```PHP
<?php
->pages([
    // Ne pas inclure Dashboard::class
])
->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
```

## 9. Multi-panels

> **En résumé** : Un même projet Laravel peut avoir plusieurs panels complètement indépendants — ex. `admin` pour les gestionnaires (`/admin`) et `app` pour les clients (`/app`). Chaque panel a son propre `PanelProvider`, ses propres Resources dans des dossiers séparés, et peut utiliser un garde d'authentification différent. `canAccessPanel()` sur le modèle `User` permet de différencier les accès selon `$panel->getId()`.

On peut avoir plusieurs panels (ex: `admin` et `app` pour les clients) :
```bash
php artisan filament:install --panels
# → choisir un nouvel ID, ex: "app"
# génère : app/Providers/Filament/AppPanelProvider.php
```

Chaque panel a son propre chemin, ses propres Resources et son propre modèle d'authentification :
```PHP
<?php
// AppPanelProvider.php
->id('app')
->path('app')                    // URL : /app
->authGuard('web')               // garde d'auth différente si besoin
->discoverResources(
    in: app_path('Filament/App/Resources'),
    for: 'App\\Filament\\App\\Resources'
)
```

## 10. Personnalisation avancée de la sidebar

> **En résumé** : `->sidebarCollapsibleOnDesktop()` ajoute un bouton pour réduire la sidebar sur grand écran. `->sidebarFullyCollapsibleOnDesktop()` la réduit à de simples icônes (mode rail). `->topNavigation()` bascule vers une navigation horizontale en haut de page, ce qui libère l'espace latéral pour le contenu. Ces options se combinent avec `->maxContentWidth()` pour ajuster la mise en page globale.

```PHP
<?php
->sidebarCollapsibleOnDesktop()   // sidebar réductible sur desktop
->sidebarFullyCollapsibleOnDesktop() // réduite à des icônes uniquement
->topNavigation()                 // navigation horizontale en haut au lieu de sidebar
->maxContentWidth(MaxWidth::Full) // largeur max du contenu
```

### Ajouter des éléments dans le footer de la sidebar
```PHP
<?php
->renderHook(
    PanelsRenderHook::SIDEBAR_FOOTER,
    fn (): string => view('filament.sidebar-footer')->render(),
)
```

## 11. `render hooks` - injecter du HTML partout

> **En résumé** : Les render hooks sont des points d'injection prédéfinis dans le layout de Filament. `->renderHook(PanelsRenderHook::BODY_START, fn() => '...')` insère du HTML avant tout le contenu du body — utile pour une bannière de maintenance, un script d'analytics, ou un widget custom en dehors du système de widgets. La closure peut retourner une string, une `View` Blade ou un composant Livewire. Les hooks couvrent tout : sidebar, topbar, head, body, global search.

Les render hooks permettent d'injecter du contenu personnalisé à des endroits précis du panel :
```PHP
<?php
use Filament\View\PanelsRenderHook;

->renderHook(
    PanelsRenderHook::BODY_START,
    fn (): string => '<div class="bg-yellow-100 p-2 text-center">Mode maintenance activé</div>',
)

->renderHook(
    PanelsRenderHook::GLOBAL_SEARCH_BEFORE,
    fn (): View => view('filament.custom-header-block'),
)
```
Principaux hooks disponibles : `SIDEBAR_NAV_START`, `SIDEBAR_NAV_END`, `SIDEBAR_FOOTER`, `TOPBAR_START`, `TOPBAR_END`, `BODY_START`, `BODY_END`, `HEAD_END`.

## Récapitulatif
```
Panel Provider (AdminPanelProvider)
│
├── Identité
│   ├── ->id(), ->path()
│   ├── ->brandName(), ->brandLogo(), ->favicon()
│   └── ->colors([...])
│
├── Navigation auto
│   ├── $navigationIcon, $navigationLabel  → sur la Resource
│   ├── $navigationGroup, $navigationSort  → sur la Resource
│   └── ->navigationGroups([...])          → ordre des groupes dans le Provider
│
├── Badges
│   └── getNavigationBadge() / getNavigationBadgeColor() → sur la Resource
│
├── Navigation manuelle
│   └── ->navigation(fn (NavigationBuilder $b) => ...)
│
├── Apparence
│   ├── ->darkMode()
│   ├── ->sidebarCollapsibleOnDesktop()
│   └── ->topNavigation()
│
├── Multi-panels
│   └── Un PanelProvider par panel, path distinct
│
└── render hooks
    └── ->renderHook(PanelsRenderHook::*, fn)
```
