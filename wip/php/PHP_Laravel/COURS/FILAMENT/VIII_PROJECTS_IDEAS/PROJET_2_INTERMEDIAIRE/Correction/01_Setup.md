# Étape 1 — Setup

## 1.1 Créer le projet Laravel

```bash
composer create-project laravel/laravel bibliotheque
cd bibliotheque
```

---

## 1.2 Configurer la base de données

Dans `.env`, configure la connexion (SQLite est le plus simple pour débuter) :

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

Les trois modèles du projet et leurs relations :

```
Author  1──n  Book  1──n  Loan
```

```bash
php artisan make:model Author -m
php artisan make:model Book -m
php artisan make:model Loan -m
```

**Migration `authors` :**

```php
Schema::create('authors', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('nationality')->nullable();
    $table->date('birth_date')->nullable();
    $table->timestamps();
});
```

**Migration `books` :**

```php
Schema::create('books', function (Blueprint $table) {
    $table->id();
    $table->foreignId('author_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->string('isbn')->nullable()->unique();
    $table->date('published_at')->nullable();
    $table->string('cover')->nullable();   // chemin image
    $table->boolean('is_available')->default(true);
    $table->timestamps();
});
```

**Migration `loans` :**

```php
Schema::create('loans', function (Blueprint $table) {
    $table->id();
    $table->foreignId('book_id')->constrained()->cascadeOnDelete();
    $table->string('borrower_name');
    $table->date('loaned_at');
    $table->date('returned_at')->nullable();
    $table->timestamps();
});
```

---

## 1.6 Configurer les modèles Eloquent

**`app/Models/Author.php` :**

```php
protected $fillable = ['name', 'nationality', 'birth_date'];

public function books(): HasMany
{
    return $this->hasMany(Book::class);
}
```

**`app/Models/Book.php` :**

```php
protected $fillable = ['author_id', 'title', 'isbn', 'published_at', 'cover', 'is_available'];

protected $casts = ['is_available' => 'boolean', 'published_at' => 'date'];

public function author(): BelongsTo
{
    return $this->belongsTo(Author::class);
}

public function loans(): HasMany
{
    return $this->hasMany(Loan::class);
}
```

**`app/Models/Loan.php` :**

```php
protected $fillable = ['book_id', 'borrower_name', 'loaned_at', 'returned_at'];

protected $casts = ['loaned_at' => 'date', 'returned_at' => 'date'];

public function book(): BelongsTo
{
    return $this->belongsTo(Book::class);
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


