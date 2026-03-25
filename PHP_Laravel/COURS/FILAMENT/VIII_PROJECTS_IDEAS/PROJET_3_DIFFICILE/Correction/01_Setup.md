# Étape 1 — Setup + Spatie Permission + Multi-panels

## 1.1 Créer le projet Laravel

```bash
composer create-project laravel/laravel helpdesk
cd helpdesk
```

---

## 1.2 Configurer la base de données

Dans `.env` :

```env
DB_CONNECTION=sqlite
# Supprime ou commente les autres lignes DB_*
```

```bash
touch database/database.sqlite
```

---

## 1.3 Installer Filament v3

```bash
composer require filament/filament:"^3.2" -W
php artisan filament:install --panels
```

Quand il demande un ID de panel, tape : `admin`

---

## 1.4 Installer Spatie Laravel Permission

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

Ajoute le trait sur le modèle `User` :

```php
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
    // ...
}
```

---

## 1.5 Créer les migrations et modèles

```bash
php artisan make:model Department -m
php artisan make:model Tag -m
php artisan make:model Ticket -m
php artisan make:model Message -m
php artisan make:model Attachment -m
```

**Migration `departments` :**

```php
Schema::create('departments', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->timestamps();
});
```

**Migration `tags` :**

```php
Schema::create('tags', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('color')->default('#6366f1');
    $table->timestamps();
});
```

**Migration `tickets` :**

```php
Schema::create('tickets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();       // client
    $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete(); // agent assigné
    $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
    $table->string('subject');
    $table->text('description');
    $table->string('status')->default('open');       // open | in_progress | resolved | closed
    $table->string('priority')->default('medium');   // low | medium | high | critical
    $table->dateTime('sla_deadline')->nullable();
    $table->timestamps();
});
```

**Table pivot `tag_ticket` :**

```php
Schema::create('tag_ticket', function (Blueprint $table) {
    $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
    $table->primary(['ticket_id', 'tag_id']);
});
```

**Migration `messages` :**

```php
Schema::create('messages', function (Blueprint $table) {
    $table->id();
    $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->json('content');           // tableau de blocs (Block Builder)
    $table->boolean('is_internal')->default(false);
    $table->timestamps();
});
```

**Migration `attachments` :**

```php
Schema::create('attachments', function (Blueprint $table) {
    $table->id();
    $table->foreignId('message_id')->constrained()->cascadeOnDelete();
    $table->string('path');
    $table->string('original_name');
    $table->string('mime_type')->nullable();
    $table->timestamps();
});
```

---

## 1.6 Configurer les modèles Eloquent

**`Department.php` :**

```php
protected $fillable = ['name', 'description'];

public function tickets(): HasMany
{
    return $this->hasMany(Ticket::class);
}
```

**`Tag.php` :**

```php
protected $fillable = ['name', 'color'];

public function tickets(): BelongsToMany
{
    return $this->belongsToMany(Ticket::class);
}
```

**`Ticket.php` :**

```php
protected $fillable = [
    'user_id', 'agent_id', 'department_id',
    'subject', 'description', 'status', 'priority', 'sla_deadline',
];

protected $casts = ['sla_deadline' => 'datetime'];

public function client(): BelongsTo   { return $this->belongsTo(User::class, 'user_id'); }
public function agent(): BelongsTo    { return $this->belongsTo(User::class, 'agent_id'); }
public function department(): BelongsTo { return $this->belongsTo(Department::class); }
public function messages(): HasMany   { return $this->hasMany(Message::class); }
public function tags(): BelongsToMany { return $this->belongsToMany(Tag::class); }
```

**`Message.php` :**

```php
protected $fillable = ['ticket_id', 'user_id', 'content', 'is_internal'];

protected $casts = ['content' => 'array', 'is_internal' => 'boolean'];

public function ticket(): BelongsTo      { return $this->belongsTo(Ticket::class); }
public function author(): BelongsTo      { return $this->belongsTo(User::class, 'user_id'); }
public function attachments(): HasMany   { return $this->hasMany(Attachment::class); }
```

**`Attachment.php` :**

```php
protected $fillable = ['message_id', 'path', 'original_name', 'mime_type'];

public function message(): BelongsTo { return $this->belongsTo(Message::class); }
```

---

## 1.7 Créer le second panel `/app`

```bash
php artisan make:filament-panel app
```

Cela génère `app/Providers/Filament/AppPanelProvider.php`.

Configure le path et la couleur dans ce nouveau fichier :

```php
return $panel
    ->id('app')
    ->path('app')
    ->login()
    ->colors(['primary' => Color::Teal])
    ->discoverResources(in: app_path('Filament/App/Resources'), for: 'App\\Filament\\App\\Resources')
    ->discoverPages(in: app_path('Filament/App/Pages'), for: 'App\\Filament\\App\\Pages')
    ->discoverWidgets(in: app_path('Filament/App/Widgets'), for: 'App\\Filament\\App\\Widgets');
```

> Les classes du panel client seront rangées dans `app/Filament/App/` pour les séparer clairement du panel admin.

---

## 1.8 Contrôler l'accès aux panels via les rôles

Sur le modèle `User`, implémente `canAccessPanel()` :

```php
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasRoles;

    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'admin') {
            return $this->hasRole(['super-admin', 'agent']);
        }

        if ($panel->getId() === 'app') {
            return $this->hasRole('client');
        }

        return false;
    }
}
```

---

## 1.9 Créer les rôles et un super-admin via Tinker

```bash
php artisan tinker
```

```php
use Spatie\Permission\Models\Role;

Role::create(['name' => 'super-admin']);
Role::create(['name' => 'agent']);
Role::create(['name' => 'client']);

$admin = App\Models\User::create([
    'name'     => 'Super Admin',
    'email'    => 'admin@helpdesk.com',
    'password' => bcrypt('password'),
]);
$admin->assignRole('super-admin');
```

---

## 1.10 Lancer les migrations et vérifier

```bash
php artisan migrate
php artisan serve
```

- `/admin` → accessible uniquement avec le compte super-admin
- `/app` → accessible uniquement avec un compte ayant le rôle `client`
