# Étape 1 — Setup

## 1.1 Créer le projet Laravel

```bash
composer create-project laravel/laravel todo-manager
cd todo-manager
```

---

## 1.2 Configurer la base de données

Dans `.env`, configure la connexion SQLite :

```env
DB_CONNECTION=sqlite
# Supprime ou commente les autres lignes DB_*
```

Puis crée le fichier de base de données :

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

Cela génère `app/Providers/Filament/AdminPanelProvider.php`.

---

## 1.4 Créer un utilisateur admin

```bash
php artisan make:filament-user
```

Renseigne le nom, l'email et le mot de passe. Tu pourras te connecter sur `/admin`.

---

## 1.5 Créer les migrations et modèles

Les deux modèles du projet et leur relation :

```
Category  1──n  Task
```

```bash
php artisan make:model Category -m
php artisan make:model Task -m
```

**Migration `categories` :**

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('color')->default('#6366f1');
    $table->timestamps();
});
```

**Migration `tasks` :**

```php
Schema::create('tasks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('status')->default('pending');     // pending | in_progress | done
    $table->string('priority')->default('medium');    // low | medium | high
    $table->date('due_date')->nullable();
    $table->boolean('is_completed')->default(false);
    $table->timestamps();
});
```

---

## 1.6 Configurer les modèles Eloquent

**`app/Models/Category.php` :**

```php
protected $fillable = ['name', 'color'];

public function tasks(): HasMany
{
    return $this->hasMany(Task::class);
}
```

**`app/Models/Task.php` :**

```php
protected $fillable = [
    'category_id', 'title', 'description',
    'status', 'priority', 'due_date', 'is_completed',
];

protected $casts = [
    'is_completed' => 'boolean',
    'due_date'     => 'date',
];

public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}
```

---

## 1.7 Lancer les migrations

```bash
php artisan migrate
```

---

## 1.8 Vérifier que tout fonctionne

```bash
php artisan serve
```

Rends-toi sur `http://localhost:8000/admin` et connecte-toi avec l'utilisateur créé à l'étape 1.4.
Tu dois voir le dashboard Filament vide — la base est prête.
