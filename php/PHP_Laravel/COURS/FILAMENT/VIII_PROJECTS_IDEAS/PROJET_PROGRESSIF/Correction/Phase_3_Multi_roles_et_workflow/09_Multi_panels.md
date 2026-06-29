# Phase 3 — Étape 9 : Multi-panels et rôles

> Référence cours : `VII_PANELS/01_LES_PANELS.md`

## 9.1 Installer Spatie Laravel Permission

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

Ajouter le trait dans le modèle `User` (`app/Models/User.php`) :

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements FilamentUser
{
    use HasRoles;
    // ...
}
```

---

## 9.2 Créer le modèle `Post`

```bash
php artisan make:model Post -m
```

Migration `create_posts_table` :

```php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->json('content')->nullable();
    $table->string('status')->default('draft'); // draft|review|published|archived
    $table->string('rejection_comment')->nullable();
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});
```

Modèle `app/Models/Post.php` :

```php
class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id', 'reviewer_id', 'title', 'slug',
        'content', 'status', 'rejection_comment', 'published_at',
    ];

    protected $casts = [
        'content'      => 'array',
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
```

```bash
php artisan migrate
```

---

## 9.3 Générer le panel CMS

```bash
php artisan make:filament-panel cms
```

Cela crée `app/Providers/Filament/CmsPanelProvider.php`.

---

## 9.4 Configurer les deux panels

**`AdminPanelProvider`** (panel `/admin`) — inchangé, mais on ajoute l'accès par rôle :

```php
->id('admin')
->path('admin')
->colors(['primary' => Color::Indigo])
->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
->authMiddleware([Authenticate::class])
```

**`CmsPanelProvider`** (panel `/cms`) — pour les editors et reviewers :

```php
->id('cms')
->path('cms')
->login()
->colors(['primary' => Color::Emerald])
->discoverResources(
    in: app_path('Filament/Cms/Resources'),
    for: 'App\\Filament\\Cms\\Resources'
)
->discoverPages(
    in: app_path('Filament/Cms/Pages'),
    for: 'App\\Filament\\Cms\\Pages'
)
->authMiddleware([Authenticate::class])
->databaseNotifications()
```

```bash
mkdir -p app/Filament/Cms/Resources
mkdir -p app/Filament/Cms/Pages
```

---

## 9.5 Routing par rôle dans `User`

Dans `app/Models/User.php`, implémente `canAccessPanel()` :

```php
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasRoles;

    public function canAccessPanel(Panel $panel): bool
    {
        return match ($panel->getId()) {
            'admin' => $this->hasRole('super-admin'),
            'cms'   => $this->hasAnyRole(['editor', 'reviewer']),
            default => false,
        };
    }
}
```

---

## 9.6 Seed des rôles et utilisateurs de test

```bash
php artisan make:seeder RolesAndUsersSeeder
```

Dans `RolesAndUsersSeeder.php` :

```php
use Spatie\Permission\Models\Role;
use App\Models\User;

public function run(): void
{
    $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
    $editor     = Role::firstOrCreate(['name' => 'editor']);
    $reviewer   = Role::firstOrCreate(['name' => 'reviewer']);

    $admin = User::factory()->create([
        'name'  => 'Super Admin',
        'email' => 'admin@cms.test',
    ]);
    $admin->assignRole($superAdmin);

    $editorUser = User::factory()->create([
        'name'  => 'Éditeur Test',
        'email' => 'editor@cms.test',
    ]);
    $editorUser->assignRole($editor);

    $reviewerUser = User::factory()->create([
        'name'  => 'Relecteur Test',
        'email' => 'reviewer@cms.test',
    ]);
    $reviewerUser->assignRole($reviewer);
}
```

```bash
php artisan db:seed --class=RolesAndUsersSeeder
```

---

## 9.7 Vérifier

- Connecte-toi avec `admin@cms.test` → accès à `/admin` uniquement
- Connecte-toi avec `editor@cms.test` → accès à `/cms` uniquement
- Essaie d'accéder à `/admin` avec l'editor → redirection ou 403
- Les deux panels ont leur couleur propre (Indigo vs Emerald)
