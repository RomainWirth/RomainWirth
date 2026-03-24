# Filament - Navigation & Configuration du Panel

Doc officielle : [https://filamentphp.com/docs/3.x/panels/navigation](https://filamentphp.com/docs/3.x/panels/navigation)

## 1. Le Panel Provider

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
```PHP
<?php
->brandName('Mon Application')               // nom dans la sidebar
->brandLogo(asset('images/logo.svg'))        // logo (remplace le nom texte)
->brandLogoHeight('2rem')                    // hauteur du logo
->darkModeBrandLogo(asset('images/logo-white.svg')) // logo pour le dark mode
->favicon(asset('images/favicon.ico')),
```

## 4. La navigation par défaut : autodiscovery

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
