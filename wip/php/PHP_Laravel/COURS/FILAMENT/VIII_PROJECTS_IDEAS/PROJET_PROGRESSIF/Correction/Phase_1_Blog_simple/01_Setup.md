# Phase 1 — Étape 1 : Setup

## 1.1 Créer le projet Laravel

```bash
laravel new cms-progressif --no-interaction
cd cms-progressif
```

## 1.2 Configurer SQLite

Dans `.env` :

```env
DB_CONNECTION=sqlite
# Supprimer ou commenter les autres lignes DB_*
```

Créer le fichier de base de données :

```bash
touch database/database.sqlite
```

---

## 1.3 Installer Filament

```bash
composer require filament/filament:"^3.2" -W
php artisan filament:install --panels
```

> Choisir l'ID de panel : `admin`, path : `admin`.

Créer le premier utilisateur admin :

```bash
php artisan make:filament-user
```

---

## 1.4 Créer le modèle `Category`

```bash
php artisan make:model Category -m
```

Migration `create_categories_table` :

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('color')->default('#6366f1'); // couleur hex
    $table->timestamps();
});
```

Modèle `app/Models/Category.php` :

```php
class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'color'];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
```

---

## 1.5 Créer le modèle `Article`

```bash
php artisan make:model Article -m
```

Migration `create_articles_table` :

```php
Schema::create('articles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('excerpt')->nullable();
    $table->longText('body')->nullable();   // sera stocké en HTML via RichEditor
    $table->string('cover_image')->nullable();
    $table->boolean('is_published')->default(false);
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});
```

Modèle `app/Models/Article.php` :

```php
class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'title', 'slug', 'excerpt',
        'body', 'cover_image', 'is_published', 'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
```

---

## 1.6 Lancer les migrations

```bash
php artisan migrate
```

---

## 1.7 Vérifier

- Lance le serveur : `php artisan serve`
- Accède à `http://localhost:8000/admin`
- Connexion avec les identifiants créés à l'étape 1.3
- Le dashboard Filament vide s'affiche
