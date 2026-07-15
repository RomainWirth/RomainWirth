# Phase 3 — Étape 11 : Versioning des Posts

## 11.1 Créer le modèle `Revision`

```bash
php artisan make:model Revision -m
```

Migration `create_revisions_table` :

```php
Schema::create('revisions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('post_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->json('content');          // snapshot du contenu Block Builder
    $table->string('title');          // snapshot du titre
    $table->string('status');         // statut du post au moment de la sauvegarde
    $table->timestamps();
});
```

Modèle `app/Models/Revision.php` :

```php
class Revision extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'user_id', 'content', 'title', 'status'];

    protected $casts = [
        'content' => 'array',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
```

Ajoute la relation dans `Post.php` :

```php
public function revisions(): HasMany
{
    return $this->hasMany(Revision::class)->latest();
}
```

```bash
php artisan migrate
```

---

## 11.2 Créer le `PostObserver`

```bash
php artisan make:observer PostObserver --model=Post
```

Dans `app/Observers/PostObserver.php` :

```php
<?php

namespace App\Observers;

use App\Models\Post;
use App\Models\Revision;

class PostObserver
{
    public function updated(Post $post): void
    {
        // Crée une révision uniquement si le contenu ou le titre a changé
        if ($post->wasChanged(['content', 'title'])) {
            Revision::create([
                'post_id' => $post->id,
                'user_id' => auth()->id() ?? $post->author_id,
                'content' => $post->content,
                'title'   => $post->title,
                'status'  => $post->status,
            ]);
        }
    }
}
```

Enregistre l'Observer dans `app/Providers/AppServiceProvider.php` :

```php
use App\Models\Post;
use App\Observers\PostObserver;

public function boot(): void
{
    Post::observe(PostObserver::class);
}
```

---

## 11.3 Page custom "Historique" dans le panel CMS

```bash
php artisan make:filament-page PostHistory --panel=cms
```

Fichier `app/Filament/Cms/Pages/PostHistory.php` :

```php
<?php

namespace App\Filament\Cms\Pages;

use App\Models\Post;
use App\Models\Revision;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;

class PostHistory extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-clock';
    protected static string $view = 'filament.cms.pages.post-history';
    protected static ?string $navigationLabel = 'Historique';
    protected static ?string $title = 'Historique des révisions';

    // ID du post passé en query param : /cms/post-history?post=5
    public ?int $postId = null;
    public ?Post $post = null;

    public function mount(): void
    {
        $this->postId = request()->integer('post');
        $this->post   = Post::find($this->postId);
    }

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Revision::query()
                    ->where('post_id', $this->postId)
                    ->with('author')
            )
            ->columns([
                TextColumn::make('id')
                    ->label('#'),

                TextColumn::make('title')
                    ->label('Titre snapshot')
                    ->limit(40),

                TextColumn::make('status')
                    ->label('Statut')
                    ->badge(),

                TextColumn::make('author.name')
                    ->label('Modifié par'),

                TextColumn::make('created_at')
                    ->label('Date')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->actions([
                \Filament\Tables\Actions\Action::make('restore')
                    ->label('Restaurer')
                    ->icon('heroicon-m-arrow-uturn-left')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->modalDescription('Restaurer cette révision écrasera le contenu actuel du post.')
                    ->action(function (Revision $record): void {
                        $record->post->update([
                            'title'   => $record->title,
                            'content' => $record->content,
                        ]);

                        Notification::make()
                            ->title('Révision restaurée')
                            ->success()
                            ->send();
                    }),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
```

Vue Blade `resources/views/filament/cms/pages/post-history.blade.php` :

```blade
<x-filament-panels::page>
    @if ($this->post)
        <x-filament::section>
            <p class="text-sm text-gray-500">
                Historique des révisions pour :
                <strong>{{ $this->post->title }}</strong>
            </p>
        </x-filament::section>
    @endif

    {{ $this->table }}
</x-filament-panels::page>
```

---

## 11.4 Lien "Historique" depuis `PostResource`

Dans `PostResource`, dans `->actions([])` de la table :

```php
\Filament\Tables\Actions\Action::make('history')
    ->label('Historique')
    ->icon('heroicon-m-clock')
    ->url(fn (Post $record) => PostHistory::getUrl(['post' => $record->id]))
    ->openUrlInNewTab(),
```

---

## 11.5 Vérifier

- Ouvre un post et modifie le titre → sauvegarde
- Réédite le post et modifie le contenu → sauvegarde à nouveau
- Clique sur **Historique** → la page `/cms/post-history?post=X` liste les révisions
- Clique sur **Restaurer** sur une ancienne révision → le post retrouve son contenu d'avant
