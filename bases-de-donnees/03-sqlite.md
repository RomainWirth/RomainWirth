# SQLite

## Objectifs du chapitre

Ce cours presente SQLite comme SGBD relationnel leger, simple a prendre en main et tres utile pour apprendre SQL ou construire de petites applications.

## Prerequis

- connaitre les commandes SQL de base ;
- savoir lancer un terminal ;
- avoir une idee des notions de table et de cle primaire.

## Plan du chapitre

1. positionnement de SQLite
2. installation et outillage
3. schema d'exemple complet
4. insertions et lectures
5. bonnes pratiques et limites

## Qu'est-ce que SQLite

SQLite est un moteur de base de donnees relationnelle integre sous forme de bibliotheque.

Contrairement a MySQL ou PostgreSQL, il n'est pas concu comme un serveur separe. La base est generalement stockee dans un simple fichier.

### Ce que cela implique

- installation simple ;
- tres peu de configuration ;
- demarrage rapide ;
- transport facile d'un environnement a un autre.

SQLite est utilise dans :

- les applications mobiles ;
- les applications de bureau ;
- les prototypes ;
- les tests ;
- certains petits projets web ou outils internes.

## Points forts de SQLite

- leger ;
- rapide pour beaucoup d'usages locaux ;
- simple a sauvegarder ;
- tres pratique pour apprendre SQL ;
- largement supporte.

## Limites de SQLite

- moins adapte aux tres fortes charges concurrentes ;
- moins pertinent pour une grosse application serveur distribuee ;
- certaines fonctionnalites avancees de SGBD serveur sont plus limitees.

Cela ne veut pas dire que SQLite est faible, mais qu'il faut le choisir pour les bons usages.

## Installer et utiliser SQLite dans VS Code

Sous Linux, on peut installer le client en ligne de commande avec :

```bash
sudo apt install sqlite3
```

Ensuite, plusieurs approches sont possibles :

- utiliser directement le terminal avec `sqlite3` ;
- utiliser une extension VS Code ;
- utiliser un outil graphique comme DB Browser for SQLite.

### Avec VS Code

On peut utiliser par exemple :

- une extension SQLite ;
- SQLTools pour ecrire et lancer certaines requetes.

Flux de travail simple :

1. creer un fichier `nom.sqlite` ou `nom.db` ;
2. ouvrir ce fichier avec l'extension ;
3. creer un fichier `.sql` pour ecrire les requetes ;
4. executer les blocs SQL.

## Particularites utiles de SQLite

SQLite accepte une syntaxe SQL tres proche du standard, avec quelques specificites.

### Cle primaire auto-incrementee

Le pattern courant est :

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
```

### Dates et heures

SQLite ne possede pas exactement les memes types date que tous les autres SGBD. On stocke souvent les dates sous forme de texte, d'entier ou de valeurs calculees avec des fonctions comme `datetime('now')`.

### Booleens

SQLite n'a pas un type booleen strict comme certains autres SGBD. En pratique, on utilise souvent `0` et `1`.

## Exemple complet de schema

On prend ici l'exemple simplifie d'une base de stations-service.

### Remettre la base a zero

```sql
DROP TABLE IF EXISTS selling_point_service;
DROP TABLE IF EXISTS open_hours;
DROP TABLE IF EXISTS closing;
DROP TABLE IF EXISTS price;
DROP TABLE IF EXISTS out_of;
DROP TABLE IF EXISTS service;
DROP TABLE IF EXISTS gas;
DROP TABLE IF EXISTS selling_point;
```

### Creer les tables principales

```sql
CREATE TABLE selling_point (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL,
    longitude REAL,
    cp INTEGER,
    type TEXT CHECK (type IN ('A', 'R')) NOT NULL,
    address TEXT,
    city TEXT,
    automate INTEGER CHECK (automate IN (0, 1))
);

CREATE TABLE closing (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT CHECK (type IN ('O', 'C')) NOT NULL,
    start TEXT DEFAULT CURRENT_TIMESTAMP,
    end TEXT DEFAULT CURRENT_TIMESTAMP,
    selling_point_id INTEGER NOT NULL,
    FOREIGN KEY (selling_point_id) REFERENCES selling_point(id)
);

CREATE TABLE service (
    name TEXT PRIMARY KEY
);

CREATE TABLE selling_point_service (
    selling_point_id INTEGER,
    service_name TEXT,
    PRIMARY KEY (selling_point_id, service_name),
    FOREIGN KEY (selling_point_id) REFERENCES selling_point(id),
    FOREIGN KEY (service_name) REFERENCES service(name)
);

CREATE TABLE open_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT NOT NULL,
    close_day INTEGER CHECK (close_day IN (0, 1)),
    open TEXT,
    close TEXT,
    selling_point_id INTEGER NOT NULL,
    FOREIGN KEY (selling_point_id) REFERENCES selling_point(id)
);

CREATE TABLE gas (
    name TEXT PRIMARY KEY
);

CREATE TABLE price (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    selling_point_id INTEGER NOT NULL,
    gas_name TEXT NOT NULL,
    value REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (selling_point_id) REFERENCES selling_point(id),
    FOREIGN KEY (gas_name) REFERENCES gas(name)
);

CREATE TABLE out_of (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    selling_point_id INTEGER NOT NULL,
    gas_name TEXT NOT NULL,
    start TEXT,
    end TEXT,
    FOREIGN KEY (selling_point_id) REFERENCES selling_point(id),
    FOREIGN KEY (gas_name) REFERENCES gas(name)
);
```

## Inserer des donnees

### Points de vente

```sql
INSERT INTO selling_point (latitude, longitude, cp, type, address, city, automate)
VALUES
    (4491900, 487800, 26000, 'R', '162 AVENUE DE PROVENCE', 'VALENCE', 1),
    (4491200, 491400, 26000, 'R', '362 RUE FAVENTINES', 'VALENCE', 1),
    (4732555.47, 613314.06, 25640, 'A', 'AIRE DE CHAMPOUX', 'MARCHAUX', 1);
```

### Services proposes

```sql
INSERT INTO service (name)
VALUES
    ('Toilettes publiques'),
    ('Douches'),
    ('Restauration'),
    ('Boutique alimentaire'),
    ('Station de gonflage');
```

### Association point de vente / service

```sql
INSERT INTO selling_point_service (selling_point_id, service_name)
VALUES
    (1, 'Toilettes publiques'),
    (1, 'Boutique alimentaire'),
    (1, 'Station de gonflage'),
    (2, 'Toilettes publiques'),
    (2, 'Boutique alimentaire'),
    (3, 'Toilettes publiques'),
    (3, 'Douches'),
    (3, 'Restauration');
```

### Carburants et prix

```sql
INSERT INTO gas (name)
VALUES
    ('SP98'),
    ('SP98 supreme+'),
    ('SP95'),
    ('E85'),
    ('E10'),
    ('Gazole'),
    ('Gazole supreme+'),
    ('GPLc');

INSERT INTO price (selling_point_id, gas_name, value)
VALUES
    (1, 'SP98', 1.986),
    (1, 'SP95', 1.875),
    (1, 'Gazole', 1.684),
    (2, 'SP98', 1.986),
    (2, 'SP95', 1.875),
    (2, 'Gazole', 1.684),
    (3, 'SP98', 1.986),
    (3, 'SP95', 1.875),
    (3, 'Gazole', 1.684);
```

## Lire les donnees

### Tous les points de vente

```sql
SELECT * FROM selling_point;
```

### Les fermetures par point de vente

```sql
SELECT sp.id, sp.city, c.type, c.start, c.end
FROM selling_point AS sp
JOIN closing AS c ON sp.id = c.selling_point_id;
```

### Les services d'un point de vente

```sql
SELECT sp.city, sps.service_name
FROM selling_point AS sp
JOIN selling_point_service AS sps ON sp.id = sps.selling_point_id
WHERE sp.id = 1;
```

### Les carburants en rupture

```sql
SELECT sp.city, oo.gas_name, oo.start, oo.end
FROM selling_point AS sp
JOIN out_of AS oo ON sp.id = oo.selling_point_id;
```

## Ce que cet exemple montre

Ce schema permet d'illustrer plusieurs notions importantes :

- une cle primaire simple ;
- des tables de reference comme `gas` et `service` ;
- une relation plusieurs-a-plusieurs avec `selling_point_service` ;
- des cles etrangeres ;
- des contraintes `CHECK` ;
- des jointures pour lire des informations reliees.

## Bonnes pratiques avec SQLite

- garder un schema simple et lisible ;
- tester les requetes par blocs ;
- commenter les scripts quand ils deviennent longs ;
- sauvegarder le fichier `.sqlite` regulierement ;
- bien distinguer les donnees de reference, les donnees metier et les tables d'association.

## Quand choisir SQLite

SQLite est un bon choix pour :

- apprendre SQL ;
- faire un prototype ;
- embarquer une base dans une application ;
- stocker localement des donnees structurees ;
- preparer des exercices ou TP.

On lui preferera souvent un SGBD serveur si :

- de nombreux utilisateurs ecrivent en meme temps ;
- l'application doit monter tres fort en charge ;
- l'administration serveur avancee devient necessaire.

## A retenir

- SQLite est un vrai SGBD relationnel, leger et tres pratique ;
- il fonctionne souvent sans serveur dedie, avec un simple fichier ;
- il est excellent pour l'apprentissage, les tests et les petits projets ;
- il permet de pratiquer les bases du SQL, des contraintes et des jointures.

## Mini-exercices corriges

### Exercice 1

Question : quelle est la difference principale entre SQLite et un SGBD serveur comme PostgreSQL ?

Correction : SQLite fonctionne le plus souvent dans un fichier local sans serveur dedie, alors que PostgreSQL utilise un serveur de base de donnees.

### Exercice 2

Question : ecris la definition d'une cle primaire auto-incrementee en SQLite.

Correction :

```sql
id INTEGER PRIMARY KEY AUTOINCREMENT
```

### Exercice 3

Question : cite un cas ou SQLite est un bon choix et un cas ou il l'est moins.

Correction : bon choix pour un prototype local ; moins adapte a une application web tres sollicitee avec de nombreuses ecritures concurrentes.
