# Récupérer des données depuis une Base de Données (BDD)

ORM = Object Oriented Mapping

Eloquent = nom de l'ORM de Laravel

Points de documentations abordés :
* Migrations
* Seeding
* Query Builder
* Eloquent (start)
* Factories
* Eloquent Collections
* Casts/Mutators

## A quoi sert la BDD

Laravel est un framework MVC (Model, Vue, Controller). On a déjà vu dans la partie Introduction à Laravel les parties Vue et Controller. On va aborder la partie Model.

Dans une application, on se sert de données qu'on récupère dynamiquement pour ensuite les afficher, les traiter.

## Gestion de BDD

éléments de la documentation abordés :
1. Migration
2. Seeding
3. Query Builder

Ces éléments permettent de :
* créer une BDD (avec ses tables, champs, etc.) grâce aux migrations
* remplir avec des données tests, grâce aux seeders
* récupérer les données directement avec les query builders (SQL)

## Eloquent ORM

Surcouche à la gestion de BDD efficaces.

éléments de la documentation abordés :
1. Eloquent
2. Factories
3. Mutators et Casts

Ces éléments permettent de rendre le code plus professionnel et robuste.

## INTRODUCTION - Database [getting started](https://laravel.com/docs/13.x/database)

Pratiquement toutes les applications web modernes interragissent avec une base de données.

PHP permet de le faire dès le début, et par conséquent, Laravel aussi, en proposant plusieurs surcouches et outils pour améliorer l'écriture du code.

Laravel propose 3 façons progressives d'intéragit avec le Système de Gestion de Base de Données (`SGBD`), via du SQL :
1. en faisant du SQL pur (`RAW SQL`)
2. en utilisant le `Query Builder` : une class avec plusieurs méthodes qui génèrent ensuite pour nous le SQL
3. en utilisant l'`ORM Eloquent` : Object Relationship Mapping (qui permet de manipuler la BDD via des objets PHP = `Pattern Repository/Entity`)

Laravel propose plusieurs databases (ainsi que celle générées par la communauté) :
* MariaDB
* MySQL
* PostgreSQL
* Sqlite
* SQL Server
* etc.

On a aussi du NoSQL avec MongoDB, et Laravel propose un package généré par MongoDB eux-même (qui maintient le package également).

### [Configuration](https://laravel.com/docs/13.x/database#configuration)

Peut-importe le choix de la BDD, `il est nécessaire de faire de la configuration`.
Par exemple, avec une BDD MySQL, on doit connaître l'`hôte`, le `port`, le `mot de passe` et le `nom de la BDD`.

Ces configurations sont dans le fichier `/config/database.php`.
exemple :
```PHP
<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'mysql'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DATABASE_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DATABASE_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'mysql_legacy' => [
            // ...
        ],
    // ...
```
Le fichier `database.php` contient des clés au lieu des données réelles, qui sont reliées au fichier `.env`.
Pointer vers le fichier `.env` permet d'éviter d'afficher et divulguer ces données sensibles.
Comme il existe un certain nombre de .env (local, pré-prod, prod par exemple), on aura des données différentes sur seon l'environnement dans lequel on se trouve.
exemple de données de database dans un fichier `.env` :
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=db-name
DB_USERNAME=root
DB_PASSWORD=password-to-define
```

### RAW SQL - première méthode

N.B.: voir cours sur les [bases de données et PHP](../../../../Bases-De-Données_&_PHP-DATAVIZ/)

D'habitude en `PHP`, on utilise `PDO` de manière native, notamment avec `prepare/exec` afin de protéger des `injections SQL`.
> note sur `PDO`
> note sur `injections SQL`

Avec Laravel, on peut faire la même chose avec une légère surcouche (= premier niveau concernant les surcouches du framework pour la BDD) en utilisant `Illuminate\Support\Facades\DB`.

Cette class propose plusieurs méthodes classiques SQL comme : `select`, `insert`, `update`, `delete`, etc...
```PHP
$users = DB::select("SELECT * FROM users WHERE active = ?", [1]);
```
Dans cet exemple, au lieu de faire du PDO classique, on utilise la class `DB` qui vient de `Illuminate\Support\Facades\DB`.
On ajoute ensuite `::` car c'est une façade, puis on ajoute le mot clé `select` qui est la méthode pour sélectionner des entrées de la BDD.
En premier paramètre de la méthode, on insert du SQL avec un `?`, qui indique que le deuxième paramètre le remplacera par la donnée du tableau afin d'effectuer la recherche.

Le `?` marque la dissociation entre le SQL et les données, qui indique une donnée dynamique. Le deuxième paramètre de la fonction va donner la valeur de ces données dynamiques.
De cette manière, on se protège d'`injections SQL` (principe de prepare/exec en PHP PDO).

### Query Builder - deuxième méthode

Le `Query Builder` permet d'utiliser des méthodes au lieu de mettre du RAW SQL dans `Illuminate\Support\Facades\DB`.

Chaque méthode retourne l'objet DB, donc on peut enchaîner facilement :
```PHP
$uses = DB::table('users')
          ->where('active', 1)
          ->get();
```
Cette syntaxe est l'équivalent de la query en RAW SQL vu plus haut.

Autre avantage du query builder : le développeur 'parle' à la classe, qui traduit en SQL avec un SQL optimisé et plus adapté au driver.
En effet, MySQL, PostgreSQL et les autres ont des différences sur la syntaxe SQL.
=> le query builder adapte les méthodes utilisées en fonction du SGBD utilisé.

### Eloquent ORM - troisième méthode

Eloquent est l'ORM de Laravel (équivalent Doctrine pour Symphony par exemple).

De manière simpliste, `chaque table a une classe dédiée` appelée `model` (ou entity selon le pattern officiel).

Quand on récupère des données via l'ORM, on récupère un tableau d'objet (qui sont des instances des modèles) au lieu d'un tableau de données (comme avec `Illuminate\Support\Facades\DB`).

Eloquent va réutiliser le query builder, mais, au lieu d'utiliser `DB` (de `Illuminate\Support\Facades\DB`), il utilise directement le model `User` qui provient de `app/model/user` :
```PHP
$users = User::where('active', 1)->get();
```
La classe User hérite de models de laravel. User fait référence à la table User. Dans cette query, on récupère tous les utilisateurs qui sont actifs, et get() exécute la query.
Cette query va retourner un tableau d'instances du modèle User.

L'avantage avec Eloquent est qu'on peut manipuler la BDD très simplement via les objets.

exemple :
```PHP
foreach ($user->posts as $post) {
  echo $post->title;
}
```
* `$user->posts as post` applique in `JOIN` sur la table post pour récupérer tous les posts ou du user via son id.
* `echo $post->title` va permettre d'afficher le titre d'un post.

```PHP
$user->last_seen = now();
$user->save(); // mise à jour dans la base
```
Cette syntaxe va mettre à jour automatiquement l'utilisateur dans la BDD, sans avoir à passer par le RAW SQL qui est bien plus lourd à écrire.

autre exemple de création d'un post pour un utilisateur :
```PHP
$user->posts()->create([
  'title' => 'Nouveau post',
  'content' => 'Contenu ici...',
]);
```

### À noter

Concernant le système de BDD, voici d'autres points à savoir :
* Il est possible d'avoir plusieurs bdd, il suffit simplement de préciser sur laquelle on effectue le SQL avant d'exécuter la requête :
```PHP
$user = DB::connection('sqlite')->select(/*...*/);
```
* On peut aussi gérer des transactions :
```PHP
DB::transaction(function () {
  DB::update('update users set votes = 1');

  DB::delete('delete from posts');
});
```
* On peut se connecter en CLI (ligne de commande) à la BDD :
```bash
# montrer la base de données :
php artisan db:show
# entrer en ligne de commande sur la bdd :
php artisan db
# permet de se connecter à la base de donées mysql :
php artisan db mysql
```

### Conclusion

Quand on code une application, on a forcément besoin d'une base de données.

Laravel propose un système sous 3 niveaux pour manipuler les BDD :
1. Via du `RAW SQL` en utilisant `Illuminate\Support\Facades\DB`
2. Via un `Query Builder` toujours avec `Illuminate\Support\Facades\DB`
3. Via l'`ORM Eloquent` qui utilise du query builder en manipulant la bdd sous forme d'objet

Laravel laisse le choix d'utiliser le niveau qu'on souhaite. Mais de manière générale, on va plutôt privilégier l'ORM pour sa praticité.

Pour certaines applications ou pour des points de l'application très précism, certains vont préférer revenir à du SQL écrit directement via du RAW SQL ou via le Query Builder.

Il est tout à fait possible d'alterner la méthode selon le besoin et la préférence.

Pour finir, Laravel propose plusieur drivers (système de gestion de base de données SGBD) comme MySQL, PostgreSQL, SQLServer, SQLite, etc., qu'il faudra configurer la (ou les) connection(s) via le fichier `/config/database.php` et via le `.env` pour les données.


## Les [Migrations](https://laravel.com/docs/13.x/migrations)

Les migrations sont un point très important de la base de données.

### Qu'est-ce qu'une migration ?

La structure d'une base de données ne se situe pas dans le code, mais dans le SGBD. La structure n'est pas versionnée comme pour le code via git.

Lorsqu'on travaille à plusieurs sur un projet, il devient donc compliqué de créer chacun de son côté une table et qu'un autre développeur sache qu'une table a été créée.

Laravel (comme d'autres frameworks) propose donc le système de migrations :
* On va coder la création de la BDD dans des fichiers
* Ces fichiers sont versionnés (avec git et ses commit)
* Il n'y aura qu'à lancer une commande `php artisan migrate` pour récupérer les informations pour la création et la mise à jour de la base de données

### Fonctionnement

Chaque migration est simplment un `fichier.php` horodaté contenant une classe avec deux méthodes :
1. `up()` : pour indiquer ce qui doit être réalisé quand on lance une migration (création de table, ajout d'une colonne, etc.)
2. `down()` : pour indiquer ce qui doit être réalisé quand on reverse une migration (annulation de la migration)

Comme avec un système de versionning, on peut revenir en arrière si besoin.

Dans les méthodes, on va utliser les classes `Illuminate\Support\Facades\Schema` et `Illuminate\Database\Schema\Blueprint` qui permettent de manipuler les BDD.

Le principe est de "parler" à ces classes qui vont traduire en SQL les demandes.

Double avantage :
1. Pas besoin d'être un pro en SQL, la classe va optimiser les demandes
2. Peut importe s'il s'agit du SGBD `MySQL`, `PostgreSQL`, `Sqlite`, `Oracle`, etc., on par aux classes Schema et Blueprint qui traduisent selon le driver indiqué.

Cela permet également de changer de SGBD plus facilement.

exemple :
```bash
php artisan make:migration create_flights_table`
```

```PHP
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations
  */
  public function up(): void
  {
    Schema::create('flights', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->string('airline');
      $table->timestamps();
    });
  }

  /**
   * Reverte the migrations
  */
  public function down(): void
  {
    Schema::drop('flights');
  }
}

```

### Quelques commandes

Lancer les dernières migrations :
```bash
php artisan migrate
```

Annuler la dernière migration :
```bash
php artisan migrate:rollback
```

Annuler les 5 dernières migrations :
```bash
php artisan migrate:rollback --step=5
```

Annuler toutes les migrations :
```bash
php artisan migrate:reset
```

N.B.: Annuler signifie appeler les méthodes `down()` des migrations (!= effacter)

Annuler les migrations puis relancer les migrations depuis zéro :
```bash
php artisan migrate:refresh

# Refresh the database and run all database seeds...
php artisan migrate:refresh --seed
```
> `Attention`: ne JAMAIS faire cela en production, cela va supprimer les données de la BDD.

Supprimer la BDD et lancer les migrations depuis zéro (sans rollback) : (utile si on a des problèmes dans les méthodes down())
```bash
php artisan migrate:fresh

php artisan migrate:fresh --seed
```

### Fonctionnement de l'horodatage

Un nom de fichier de migration ressemble à ceci : `2023_02_08_101080_create_products_table`.

Chaque fichier possède donc :
* une dateTime en préfix (`2023_02_08_101080`)
* un nom reconnaissable (`create_products_table`, `add_is_active_to_users_table`, etc.)

Cela permet, grâce au _dateTime_, d'ordonner les migrations : à chaque fois qu'un va lancer les migrations, cela va exécuter chaque fichier dans un ordre précis.

C'est aussi grâce à cela que Laravel sait quelle migration doit être lancée ou non grâce à un enregistrement en BDD d'un horodatage qui sera comparé à l'horodatage des fichiers de migration.

### Traduction en base de données

Il existe par défaut une table `migrations` en base de données qui contient le nom de la migration (nom du fichier) + un chiffre qui indique le lot de migration lancé.

/* donner un exemple de batch de migration de la table de migration */

Si on lance `php artisan migrate`, Laravel va procéder comme suit :
* il va aller voir en BDD la dernière entrée de la table "migrations" et regarde le nom de celle-ci.
* il va ensuite aller dans le dossier `/database/migrations` s'il y a des fichiers dont le time stamp se situe après celui de la dernière entrée.
* si oui, il appelle les méthodes `up()` de ces fichiers puis met à jour la table `migrations` en donnant le numéro de lot "batch" commun.

À l'inverse, pour un `php artisan rollback` va prendre toutes les migrations en bdd qui ont le même numéro batch que la dernière et il appelera pour chacun la méthode `down()`.

### Les classes Schema et Blueprint

Ces classes viennent de `Illuminate\Support\Facades\Schema` et `Illuminate\Database\Schema\Blueprint`.

Il s'agit simplement d'une surcouche qui permettent de créer une table en PHP, d'en supprimer, d'ajouter une colonne, de modifier le nom, etc. (de manipuler la structure de base de données)

Tout cela se fait en SQL, mais comme on écrit en PHP via ces classes, ces dernières traduisent correctement selon la SGBD connectée.

On peut créer tous les types d'une BDD (VARCHAR, DATE TEXT, etc.), index, clés étrangères et contraintes, etc.

Il existe beaucoup de méthodes :
* `id()` = alias pour créer un `BIG INTEGER unsigned` et `AUTO-INCREMENT` en commençant pas 1.
* `boolean()`
* `char()`
* `text()`
* `increment()`
* `integer()`
* `double()`
* `unsignedInteger()`
* `dateTime()`
* `date()`
* `time()`

### Conclusion

Quand on code un application, il a besoin d'une base de données et on a besoin de pouvoir structurer cette BDD.

On utilise git ou un autre logiciel de versionning pour versionner notre code. On en profite pour passer par la création de fichiers pour "versionner" aussi la BDD.

Ces fichiers sont des classes avec deux méthodes : `up()` pour lancer la migration et `down()` pour l'annuler.

C'est à nous de dire ce que doit faire une migration : créer une table, modifier un champs, etc.

De cette manière, on ne va jamais modifier directement la BDD en live, mais toujours par du code. Ce qui permet le partage de l'information entre développeurs mais aussi entre les différents environnements.

Pour nous aider à intéragir avec la BDD, on peut utiliser les classes `Illuminate\Support\Facades\Schema` et `Illuminate\Database\Schema\Blueprint`qui nous donnent de nombreuses méthodes pratiques.
Ces classes vont adapter le SQL au SGBD connecté.

Une table migration est créée en BDD. C'est grâce à cette table et parce que les fichiers de migration sont horodatés qu'on peut savoir où en sont les migrations et s'il faut en lancer d'autre ou si on est à jour.

Avec ce système, dès qu'un développeur "pull" une branche pour être à jour, il lance de suite les migrations au cas où il y a eu du changement, et Laravel s'occupe du reste.

## [Seeding](https://laravel.com/docs/13.x/seeding)

`Seeder` une application signifie insérer en BDD des données déjà établies.

Cela pour au moins deux raisons :
1. Pour créer des données nécessaires au bon fonctionnement de l'application. Le système de seeding permet d'avoir automatiquement dans la BDD des données et evite qu'on ait à les recréer manuellement à chaque fois.
2. Pour créer des données de test. Cela peut s'avérer pratique quand on doit tester l'application avec un très grand nombre de données. (ex: 1000, 2000 utilisateurs)

### Fonctionnement

Dans le dossier `/database/seeders`, on va avoir des classes qui héritent de `Illuminate\Database\Seeder`. Ces classes n'ont qu'une seule méthode `run()`.

C'est dans cette méthode qu'on va écrire le code qui va gérer les données.

On peut y faire ce que l'on veut : du `RAW SQL`, du `Query Builder` ou passer par l'`ORM`.

On va utiliser la commmande :
```bash
php artisan make:seeder <NameSeeder>
```
NameSeeder peut être : UserSeeder, DatabaseSeeder, etc.

exemple :
```PHP
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facade\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => Str::random(10),
            'email' => Str::random(10).'@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
```

Il existe un fichier de base `database/seeder/DatabaseSeeder.php` avec aussi une méthode `run()` qui hérite aussi de `Illuminate\Database\Seeder`.

Il suffit alors d'indiquer les seeders qui doivent être appelés avec la méthode `call()`
```PHP
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WihoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WihoutModelEvents;

    /**
     * Run the database seeders.
     */
    public function run(): void
    {
        $this->call([
          UserSeeder::class
        ]);
    }
}
```

On lancera ensuite la commande suivante pour 'seeder' la BDD :
```bash
php artisan db:seed
```

### Les commandes

Il est possible de préciser quel seeder on veut appeler (et par défaut c'est le fichier DatabaseSeeder) avec l'option `--class`
```bash
php artisan db:seed

php artisan db:seed --class=UserSeeder
```

Lorsqu'on fait un migrate fresh/refresh, on peut aussi vouloir automatiquement lancer les seeders
```bash
php artisan migrate:fresh --seed

php artisan migrate:fresh --seed --seeder=UserSeeder
```

> Beaucoup de développeurs Laravel se font un alias de commande `mfs` pour simplifier cela :
> `alias mfs= php artisan migrate:fresh --seed`

### Conclusion

migrations vs seeders :
* Les migrations servent à créer la structure d'une BDD
* Les seeder permettent d'hydrater la BDD (insérer des fake datas en BDD)

Grâce à ce système, on peut rapidement avoir une BDD utilisable en local pour développer, établir un état, etc.

Le fonctionnement est encore plus simple :
1. On crée un fichier qui hérite de `Illuminate\Database\Seeder` de Laravel
2. On écrit le code dans la méthode `run()` qui va générer le SQL souhaité
3. On lance la migration/le seeder en ligne de commande

Soit on l'appelle directement avec `--seed`, soit on call automatiquement ce seeder dans `database/seeders/DatabaseSeeder.php`.

De cette manière, on peut facilement tester les features ou mettre en place un état de développement cohérent avec notre besoin sans devoir passer du temps inutile à refaire les mêmes insertions manuellement en BDD.

## [Query Builder](https://laravel.com/docs/13.x/queries)

Le `Query Builder` est la deuxième couche d'abstraction proposé par Laravel pour manipuler les BDD.

C'est une classe avec beaucoup de méthode `fluent` (qui retournent le même objet, donc qui peuvent être chaînées) pour faire du SQL.

On peut y faire la plupart des opérations en DB (select, insert, where, groupe, order, limit, delete, join, etc.).

exemples :
```PHP
$users = DB::table('users')->get();

$user = DB::table('users')->where('name', 'John')->firstOrFail();

$users = DB::table('users')->count();

$price = DB::table('orders')->max('price');

$price = DB::table('orders')
    ->where('finalized', 1)
    ->avg('price');

$users = DB::table('users')
    ->whereBetween('votes', [1, 100])
    ->get();

$users = DB::table('users')
    ->whereMonth('created_at', '12')
    ->get();

$users = DB::table('users')->insert([
    ['email' => 'picard@example.com', 'votes' => 0],
    ['email' => 'janeway@example.com', 'votes' => 0],
]);

DB::table('users')->insertOrIgnore([
    ['id' => 1, 'email' => 'sisko@example.com'],
    ['id' => 2, 'email' => 'archer@example.com'],
]);

$users = DB::table('users')
    ->groupBy('account_id')
    ->having('account_id', '>', 100)
    ->get();

$randomUser = DB::table('users')
    ->inRandomOrder()
    ->first();

$users = DB::table('users')
    ->whereExists(function (Builder $query) {
        $query->select(DB::raw(1))
            ->from('orders')
            ->whereColumn('orders.user_id', 'users.id');
    })
    ->get();
```

### Avantages

1. Tous les développeurs ne sont pas des pros SQL. Avec le query builder qui génère pour nous le SQL, on a souvent un SQL plus optimisé pour un développeur lamba.

2. Pour la même requête, le SQL peut être différent selon le type de SGBD. En utilisant le query builder, on a pas besoin de penser à cela.

MySQL
```SQL
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
)
```
PostgreSQL
```SQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
)
```
Différence : `AUTO_INCREMENT` (MySQL) vs `SERIAL` (PostgreSQL)

3. Facilité de lecture du code sur des gros traitements avec la façon d'écrire des requêtes avec des méthodes chaînées, plutôt que par un RAW SQL de 50 lignes.

4. Les Query Builder utilise PDO en séparant le SQL des données, ce qui protège des injections SQL.

### Fonctionnement

Il existe beaucoup de méthodes proposées par la classe.

La plupart reprennent des noms SQL (comme oder, group, where, insert, etc.) ce qui simplifie pour les habitués au SQL.

Laravel propose aussi des méthodes, comme `inserOrIgnore` par exemple.

Dans tous les cas :
1. On commence la plupart du temps par : `DB::table('votre-table')`. Cela retourne un objet `Query Builder`.
2. On peut directement enchaîner les méthodes souhaitées (where, order, limit...).
3. Les méthode comme `insert`, `update`, `delete`, vont exécuter automatiquement la requête quand elles sont appelées. Mais quand on construit un `select`, il faut appeler la méthode `get()` pour exécuter la requête et récupérer le résultat.

À Moins d'avoir mis un "limit 1", c'est une Collection qui sera retournée.

### Les méthodes

Les méthodes sont recensées dans la [documentation](https://laravel.com/docs/13.x/queries)

### Debugging

Pour faire du débuggage, on peut utiliser plusieurs méthodes, dont le `dd()` ou le `dump()`
* `dump()` = affiche la requête.
* `dd()` = (dump and die) affiche la requête et arrête l'exécution du code.

exemple :
```PHP
DB::table('users')->where('votes', '>', 100)->dump();

DB::table('users')->where('votes', '>', 100)->dd();
// donnera :
// "select * from `users` where `votes` > ?"
// bindings: [100]
```

* `dumpRawSql()` = affiche des données 'bindées'.
* `ddRawSql()` = affiche des données 'bindées' et stop l'exécution du code.
```PHP
DB::table('users')->where('votes', '>', 100)->dumpRawSql();

DB::table('users')->where('votes', '>', 100)->ddRawSql();
// donnera :
// select * from `users` where `votes` > 100
```

### Conclusion

Le Query Builder est une classe avec un ensemble de méthodes qui vont générer du SQL adapté au SGBD connecté (MySQL, PostgreSQL, etc.).

On parle de Query Builder car on construit bien notre requête en enchaînant des méthodes.

Les deux gros avantages sont de simplifier l'écriture du code SQL pour le développeur et de gérer automatiquement la génération du SQL selon le SGBD conecté.

Le query builder est une interface fluide et expressive qui permet de construire des requêtes SQL de manière sécurisée et lisible, sans écrire directement du SQL brut.

## ORM Eloquent - [getting started](https://laravel.com/docs/13.x/eloquent)

Eloquent est l'ORM de Laravel (Object Relationship Mappin ou object-relational-mapper).

Eloquent permet de pouvoir manipuler une base de données sous forme d'objet, en respectant le Pattern repository

> Nore sur le Pattern Repository

### Fonctionnement :

Pour chaque table, on a un modèle (une classe) correspondante.

Tous les modèles héritent de `Illuminate\Database\Eloquent\Model` (une classe de 2500 lignes sans compter tous les traits qu'elle utilise).

Cela permet d'avoir des modèles très légers. C'est dans ces moments où on parle de 'magie' de Laravel.

### Une table = un modèle

Chaque table possède son modèle.
Les modèles sont par défaut dans `app\Models`

pour créer un modèle, on va utiliser la commande :
```bash
php artisan make:model Name
```
ce qui donne le code suivant :
```PHP
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Name extends Model
{
    // ...
}
```

Si on souhaite directement créer les migrations, il suffira d'ajouter le suffix `--migration` à la commande :
```bash
php artisan make:model Name --migration
```
ou encore avec l'option `--controller` :
```bash
php artisan make:model Name --controller
php artisan make:model Name -c
```
ou encore avec l'option `seed` :
```bash
php artisan make:model Name --seed
php artisan make:model Name -s
```
ou encore avec 3 options : `--controller`, `--resource`, `--requests` :
```bash
php artisan make:model Name --controller --resource --requests
php artisan make:model Name -crR
```
ou encore avec migration, factory, seed, controller avec `-mfsc`, ou encore pour la totalité avec `--all` ou `-a`.

### Conventions

On est libre d'appeler nos tables comme on le souhaite, tout comme les noms des variables.

Il est cependant fortement recommandé de respecter les conventions laravel pour deux grandes raisons :
1. Si Laravel les a choisi, c'est qu'elles fonctionnent bien et qu'elles font consensus général dans le milieu.
2. Si on respecte ces conventions, alors Laravel va faire de la "magie"

exemple :
* si on a respecté la convention d'une table au pluriel, comme `products`, `users`, `categories`, etc.
* et si on respecte la convention indiquant que le nom du modèle doit être au singulier comme `Product`, `User`, `Category`, etc.

Alors quand on manipule ces modèles, il n'y aura pas besoin de dire à quelles tables, ils correspondent car Laravel le saura automatiquement.

Les conventions :
1. Nom des tables au `pluriel` et en `snake_case` : users, bills, orders, failed_jobs, shop_entries...

## Factories

## Accessors et Mutators

## Model Product avec Eloquent

## Eloquent relationship

## Eloquent Collection
