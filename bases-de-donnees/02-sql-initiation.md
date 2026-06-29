# SQL - initiation complete

## Objectifs du chapitre

Ce cours introduit les bases du SQL pour manipuler une base relationnelle. A la fin, on doit comprendre :

- a quoi sert SQL ;
- comment creer une base et des tables ;
- comment inserer, lire, modifier et supprimer des donnees ;
- comment relier plusieurs tables ;
- comment ecrire des requetes lisibles et efficaces.

## Prerequis

- avoir lu le chapitre sur les SGBD ;
- connaitre les notions de table, ligne et colonne ;
- disposer d'un SGBD local ou d'un outil de test SQL.

## Plan du chapitre

1. SQL et categories de commandes
2. schema, types et contraintes
3. CRUD et requetes SELECT
4. jointures, index et transactions
5. bonnes pratiques

## SQL et SGBD

SQL signifie `Structured Query Language`, soit langage de requete structure.

SQL sert a communiquer avec un SGBD relationnel pour :

- definir la structure des donnees ;
- inserer des donnees ;
- les lire ;
- les modifier ;
- les supprimer ;
- gerer certaines contraintes et certains acces.

Le SQL standard existe, mais chaque SGBD ajoute souvent ses specificites. Il faut donc distinguer :

- les bases communes du SQL ;
- les variantes propres a MySQL, PostgreSQL, SQLite, Oracle, etc.

## Les grandes categories de commandes SQL

### DDL : definir la structure

Le DDL, ou `Data Definition Language`, regroupe les commandes qui definissent le schema :

- `CREATE` ;
- `ALTER` ;
- `DROP`.

### DML : manipuler les donnees

Le DML, ou `Data Manipulation Language`, sert a agir sur les donnees :

- `INSERT` ;
- `UPDATE` ;
- `DELETE`.

### DQL : interroger les donnees

Le DQL, ou `Data Query Language`, est principalement represente par `SELECT`.

### TCL : gerer les transactions

Le TCL concerne notamment :

- `COMMIT` ;
- `ROLLBACK`.

## Choisir un SGBD relationnel

Quelques SGBD connus :

- MySQL et MariaDB ;
- PostgreSQL ;
- SQLite ;
- Oracle Database ;
- SQL Server.

Le choix depend souvent de :

- la taille du projet ;
- les performances attendues ;
- l'environnement d'hebergement ;
- la facilite d'administration ;
- les habitudes de l'equipe.

Pour apprendre, SQLite et MySQL sont souvent de bons points de depart.

## Les objets essentiels d'une base relationnelle

### La base de donnees

Une base regroupe des tables et d'autres objets lies.

### La table

Une table stocke des lignes d'enregistrements ayant la meme structure.

### La colonne

Une colonne represente une propriete, par exemple :

- `name` ;
- `email` ;
- `created_at`.

### La ligne

Une ligne correspond a un enregistrement concret.

## Types de donnees courants

Les types precis changent selon les SGBD, mais on retrouve souvent :

- `INT` ou `INTEGER` pour les entiers ;
- `REAL`, `FLOAT` ou `DECIMAL` pour les nombres decimaux ;
- `VARCHAR(n)` pour les chaines courtes ;
- `TEXT` pour les textes plus longs ;
- `DATE`, `TIME`, `DATETIME`, `TIMESTAMP` pour les dates ;
- `BOOLEAN` pour les booleens.

Il faut choisir des types adaptes :

- ni trop permissifs ;
- ni trop contraignants ;
- suffisamment explicites pour proteger l'integrite des donnees.

## Les contraintes importantes

Les contraintes permettent au SGBD de verifier certaines regles.

### PRIMARY KEY

La cle primaire identifie chaque ligne de facon unique.

### NOT NULL

La colonne doit obligatoirement contenir une valeur.

### UNIQUE

La valeur doit etre unique dans la colonne.

### FOREIGN KEY

La cle etrangere relie une table a une autre.

### DEFAULT

Une valeur par defaut est utilisee si rien n'est fourni.

### CHECK

Permet d'imposer une regle sur les valeurs autorisees.

## Creer une base de donnees

Exemple general :

```sql
CREATE DATABASE location_db;
```

Ensuite, selon le SGBD :

```sql
USE location_db;
```

En SQLite, on travaille plutot directement dans un fichier de base de donnees.

## Creer une table

Exemple simple :

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    country CHAR(2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Dans cet exemple :

- `id` identifie chaque utilisateur ;
- `email` est obligatoire et unique ;
- `bio` est facultatif ;
- `country` stocke un code pays ;
- `created_at` est rempli automatiquement.

## Lire la structure d'une base

Selon le SGBD, on retrouve souvent ces commandes :

```sql
SHOW DATABASES;
SHOW TABLES;
DESCRIBE users;
```

Ces commandes varient selon les outils et le SGBD, mais l'idee reste la meme :

- lister les bases ;
- lister les tables ;
- inspecter la structure d'une table.

## Inserer des donnees

### Inserer une ligne

```sql
INSERT INTO users (email, bio, country)
VALUES ('hello@world.com', 'I love databases', 'FR');
```

### Inserer plusieurs lignes

```sql
INSERT INTO users (email, bio, country)
VALUES
    ('alice@example.com', 'Developer', 'FR'),
    ('bob@example.com', 'Designer', 'BE'),
    ('carol@example.com', 'Teacher', 'CH');
```

Il faut toujours respecter :

- le bon ordre des colonnes ;
- les types attendus ;
- les contraintes definies.

## Lire des donnees avec SELECT

### Lire toutes les colonnes

```sql
SELECT * FROM users;
```

### Lire certaines colonnes

```sql
SELECT id, email FROM users;
```

### Trier les resultats

```sql
SELECT id, email
FROM users
ORDER BY id ASC;
```

### Limiter le nombre de lignes

```sql
SELECT id, email
FROM users
ORDER BY id DESC
LIMIT 5;
```

## Filtrer avec WHERE

La clause `WHERE` permet de restreindre les resultats.

```sql
SELECT id, email, country
FROM users
WHERE country = 'FR';
```

On peut combiner plusieurs conditions :

```sql
SELECT id, email, country
FROM users
WHERE country = 'FR' AND email LIKE 'a%';
```

Operateurs utiles :

- `=` ;
- `!=` ou `<>` ;
- `>` ;
- `<` ;
- `>=` ;
- `<=` ;
- `LIKE` ;
- `IN` ;
- `BETWEEN` ;
- `IS NULL`.

## Modifier des donnees

```sql
UPDATE users
SET country = 'CA'
WHERE id = 1;
```

Sans `WHERE`, on modifie potentiellement toutes les lignes de la table. C'est une erreur tres frequente chez les debutants.

## Supprimer des donnees

```sql
DELETE FROM users
WHERE id = 1;
```

Comme pour `UPDATE`, l'absence de `WHERE` peut entrainer une suppression massive.

## Supprimer une table

```sql
DROP TABLE IF EXISTS users;
```

Cette commande supprime la structure et les donnees. Elle doit donc etre utilisee avec prudence.

## Fonctions d'agregation

SQL permet de produire des resultats synthetiques.

```sql
SELECT COUNT(*) FROM users;
SELECT AVG(price) FROM products;
SELECT MIN(price) FROM products;
SELECT MAX(price) FROM products;
```

### Grouper les resultats

```sql
SELECT country, COUNT(*) AS total_users
FROM users
GROUP BY country;
```

### Filtrer les groupes

```sql
SELECT country, COUNT(*) AS total_users
FROM users
GROUP BY country
HAVING COUNT(*) >= 2;
```

## Joindre plusieurs tables

La force des bases relationnelles repose en grande partie sur les jointures.

### Exemple de structure

```sql
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

Ici, `owner_id` relie un logement a un utilisateur.

### INNER JOIN

```sql
SELECT users.email, rooms.street
FROM users
INNER JOIN rooms ON rooms.owner_id = users.id;
```

Cette jointure retourne les lignes pour lesquelles la relation existe dans les deux tables.

### LEFT JOIN

```sql
SELECT users.email, rooms.street
FROM users
LEFT JOIN rooms ON rooms.owner_id = users.id;
```

On recupere tous les utilisateurs, meme ceux qui n'ont pas encore de logement.

## Alias

Les alias rendent les requetes plus lisibles.

```sql
SELECT u.email, r.street
FROM users AS u
JOIN rooms AS r ON r.owner_id = u.id;
```

## Les index

Un index aide le SGBD a retrouver plus vite certaines donnees, un peu comme l'index d'un livre.

```sql
CREATE INDEX email_index ON users(email);
```

Un index peut ameliorer les lectures, mais il a aussi un cout :

- plus d'espace disque ;
- insertions et mises a jour parfois un peu plus lentes.

On indexe donc surtout :

- les colonnes souvent recherchees ;
- les colonnes de jointure ;
- certaines colonnes de tri.

## Transactions

Une transaction regroupe plusieurs operations qui doivent reussir ensemble.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

En cas de probleme, on peut annuler :

```sql
ROLLBACK;
```

## Outils pratiques

Pour apprendre ou pratiquer, on peut utiliser :

- le terminal du SGBD ;
- DB Browser for SQLite ;
- l'extension SQLTools dans VS Code ;
- phpMyAdmin ou Adminer pour certains environnements web.

## Bonnes pratiques SQL

- choisir des noms coherents et stables ;
- definir des cles primaires simples ;
- ecrire des requetes lisibles ;
- tester les `SELECT` avant les `UPDATE` et `DELETE` ;
- eviter `SELECT *` dans les requetes applicatives importantes ;
- indexer avec moderation ;
- commenter les scripts de schema ou de migration quand c'est utile.

## A retenir

- SQL permet de definir, lire et manipuler les donnees relationnelles ;
- les commandes essentielles sont `CREATE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE` et `DROP` ;
- les cles primaires, cles etrangeres et contraintes assurent la qualite des donnees ;
- les jointures sont essentielles pour relier les tables ;
- les index ameliorent certaines recherches ;
- les transactions garantissent des operations fiables.

## Mini-exercices corriges

### Exercice 1

Question : ecris une requete qui affiche les emails des utilisateurs francais tries par id croissant.

Correction :

```sql
SELECT email
FROM users
WHERE country = 'FR'
ORDER BY id ASC;
```

### Exercice 2

Question : quelle est la difference entre `DELETE` et `DROP TABLE` ?

Correction : `DELETE` supprime des lignes d'une table existante, alors que `DROP TABLE` supprime la table elle-meme avec sa structure.

### Exercice 3

Question : a quoi sert une cle etrangere ?

Correction : elle relie deux tables et aide a garantir l'integrite referentielle en evitant des references invalides.
