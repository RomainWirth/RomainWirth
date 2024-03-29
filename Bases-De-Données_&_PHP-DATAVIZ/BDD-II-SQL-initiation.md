# SQL - Initiation

Doc officielle : https://sql.sh/cours <br>
Source : https://www.youtube.com/watch?v=Cz3WcZLRaWc <br>
Source : https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7139618-decouvrez-le-systeme-de-gestion-de-base-de-donnees-sgbd <br>

## La base de données

Rôle de la BDD : 
* Stocker les données/informations
* Accéder aux données
* Manipuler les données (M-à-J, Insertion, suppression)

Principe ACID :
* __A : Atomic__ = Une transaction est traitée dans son intégralité ou pas du toute.<br> Si une transaction échoue, toutes les modifications sont annulées (rollback) pour maintenir la cohérence des données.
* __C : Cohérence__ = Après l'exécution d'une transaction, la base de données passe d'un état valide à un autre état valide.<br> Cela garantit que toutes les contraintes, règles et relations définies dans la base de données sont respectées à tout moment, même si les données sont stockées sur différentes machines.
* __I : Isolation__ = Chaque transaction est isolée des autres jusqu'à ce qu'elle soit complète, ce qui signifie que même si plusieurs transactions s'exécutent simultanément, elles ne se perturbent pas mutuellement.<br> L'isolation évite les problèmes de concurrence et garantit que chaque transaction agit comme si elle était la seule en cours d'exécution.
* __D : Durabilité__ = Une fois qu'une transaction est confirmée (commit), les modifications qu'elle a apportées sont permanentes et persistantes même en cas de panne du système.<br> Cela garantit que les données modifiées restent dans la base de données même en cas de défaillance ultérieure.

## Choisir son SGBD

### RAPPEL : SGBD = Système de Gestion de Base de Données

Il s'agit d'un outil qui permet de gérer une base de données.<br> 
C'est un programme que va permettre d'interprêter le langage SQL de la BDD, et qui va permettre de lire ou modifier la BDD.<br>

### Le SQL = Structure Query Language

En français : langage de requête structurée.<br>
Il s'agit d'un langage informatique qui permet d'interragir avec des BDD.<br>
Ce langage est le plus répendu et donc indispensable à connaître. C'est avec lui qu'on va gérer notre BDD.

En pratique :<br>
Une **application va traduire une recherche faite par un utilisateur en SQL**,<br> 
l'envoyer au **SGBD**, qui va **récupérer l'information** en question dans le stockage de la BDD,<br>
pour ensuite le **redonner à l'application**.<br>
L'utilisateur aura ainsi son information avec toutes ses caractéristiques.

**Chaque SGBD implémente sa propre syntaxe du SQL en plus des normes communes à tous.**<br>
L'intérêt de connaître les bases du SQL et sa logique réside dans la diversité des SGBD.<br>
Comme chacun a sa propre déclinaison de la syntaxe SQL, on pourra s'en sortir quel que soit le SGBD utilisé par notre employeur.

## Les différents SGBD

Les SGBD existant : 
* **MySQL** (le plus répendu), auparavant open-source, maintenant racheté par Oracle Corporation.<br> 
**MariaDB** est sa copie open-source actuelle qui suit les même règles de langage que MySQL.
* **PostGreSQL**, "l'autre" grand SGBD open-source dispo sur le marché.<br> 
Moins utilisé que MySQL car confiné à Linux, plus difficile à appréhender pour les débutants.<br> 
Il se démocratise car il suit les recommandations du SQL et il est le plus rapide de ces dernières années.<br> 
Utilisé par Instagram ou Spotify.
* **Oracle Database**, le SGBD édité par Oracle Corporation.<br> 
Très cher, mais utile pour traiter un très gros volume de données.<br>
Utilisé principalement par les grandes entreprises.<br> 
Il perd des parts de marché face çà MariaDB ou PostgreSQL.
* **SQLite**, stocke toute la base de données dans un seul et unique fichier.<br>
Peu propice à l'utilisation sur un grand nombre de données, c'est un SGBD très simple à configurer.<br>
On va le privilégier pour développer une BDD en local, alors qu'en prod on utilisera plutôt MySQL ou PostgreSQL.<br>
Utilisé par les applications Android pour stocker de la donnée.

![](./img/comparatif_SGBD.png)

Actuellement, il existe des ORM (Object Relational Mapping) = des outils qui permettent d'éviter d'utiliser du SQL brut, et permettent d'augmenter la productivité.<br>
Pour JS : Sequelize, Python : SQL Alchemy, Ruby on rails : Active Records.<br>
Il est tout de même nécessaire et préférable de bien comprendre comment fonctionne le SQL.

## Le RDBMS = Relational DataBase Management System

Composé de deux choses principales :
* La BDD en elle-même, qui est une collection de Tables qui contiennent chaque la donnée, organisée en colonnes et lignes (similaire à une feuille de calcul excel).<br> 
* La deuxième composante est le langage SQL, permettant de manipuler et lire la donnée dans la BDD. qui est souvent une variation du 'Structure Query Language' (selon le SGBD utilisé).<br>

![](./img/base_de_donnees.png)

## La normalisation des bases de données relationnelles 

La normalisation des bases de données relationnelles est un processus visant à organiser les données de manière optimale pour réduire la redondance, améliorer l'intégrité des données et faciliter la maintenance et la gestion des bases de données. Les formes normales, souvent abrégées de "1NF", "2NF", "3NF", etc., définissent des règles spécifiques pour organiser les données de manière logique et éviter les problèmes de dépendances et de redondances.

Voici les principaux concepts de la normalisation :
1. Première forme normale (1NF) :<br>
Chaque table de la base de données doit avoir une structure bien définie, sans éléments répétitifs dans les colonnes.<br>
Les données doivent être atomiques, c'est-à-dire qu'elles ne doivent pas être subdivisées davantage.

2. Deuxième forme normale (2NF) :<br>
Toutes les colonnes non clés d'une table doivent dépendre totalement de la clé primaire.<br>
Si une table possède une clé primaire composée de plusieurs colonnes, chaque colonne doit contribuer à une seule information et ne pas être redondante.

3. Troisième forme normale (3NF) :<br>
Les données doivent être exemptes de dépendances transitives.<br>
Les colonnes qui ne sont pas des clés primaires doivent dépendre uniquement des clés primaires et ne pas être dépendantes d'autres colonnes non clés.

4. Forme normale de Boyce-Codd (BCNF) :<br>
Une extension de la troisième forme normale, plus rigoureuse dans la gestion des dépendances fonctionnelles entre les clés.

5. Quatrième et cinquième formes normales (4NF, 5NF) :<br>
D'autres formes de normalisation visant à éliminer les anomalies et à réduire davantage les redondances, mais elles sont moins couramment utilisées.

L'objectif principal de la normalisation est de minimiser la redondance des données, d'éviter les anomalies de mise à jour (insertion, modification, suppression) et de rendre les schémas de base de données plus flexibles et plus performants.<br> 
Chaque forme normale offre un niveau plus élevé d'organisation et de structuration des données, mais toutes ne sont pas toujours nécessaires selon le contexte et la complexité des données.

## Tuto installation MySQL (Windows, Mac et Linux)

<a href="https://linuxhint.com/installing_mysql_workbench_ubuntu/">installation mysql ubuntu</a>

https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql

## Créer sa base de données

![](./img/structure_BDD.png)

La banque de données contient les différentes bases de données.<br>
Les bases de données sont composées de tables.
Une table est une sorte de dictionnaire ou une clé représente une colonne dans la BD et la valeur représente un type de donnée qui peut être stocké à cet endroit.<br>
Les lignes d'enregistrement sont les données stockées dans les tables, organisées par colonnes.<br>

Il existe beaucoup de types de données, et ils peuvent varier selon les différents bases de données SQL.<br>
Pour la plupart, elles représentent différents types de nombres et chaînes de caractères.<br>

Dans MySQL, on retrouve des mots clés qui vont indiquer le type de données qu'on va avoir dans une colonne de notre base de données:<br> 
**INT** pour integer (des nombres entiers) ou **FLOAT** pour des nombres décimaux (à virgule).<br>
Pour de petites chaînes de caractères (string), on utilise **VARCHAR**,<br> 
et pour de plus longues chaînes de caractères on utilise **TEXT**.

## Le RDBMS = Relational DataBase Management System

Composé de deux choses principales :
* La BDD en elle-même, qui est une collection de être unique.

Tout cela résulte de la normalisation des bases de données relationnelles :<br>
chaque entité sera organisée dans sa plus petite forme normale.

On pourra utiliser l'extension _SQLTools sur VSCode_.<br>
Cela va permettre de stocker le détail de notre connection, visualiser la BDD et voir l'historique des queries qui ont été employées.

### Commandes pour accéder à sa BDD MySQL :

```bash
sudo mysql -u root -p
```
Cette commande demandera d'entrer le mot de passe de l'utilisateur pour accéder à la banque de données de mysql.<br>

Le terminal permettra maintenant d'utiliser les commandes SQL via mysql.<br>
Maintenant, on peut afficher toutes les BDD existantes avec la commande :<br>
```SQL
SHOW DATABASES;
```
Pour accéder à une base de données existante, on utilisera :
```SQL 
USE nom_de_la_bdd;
```
Afin de voir le contenu de la base de données (les tables), on utilisera la commande :
```SQL
SHOW TABLES;
```
Pour connaître la structure d'une table :
```SQL
DESCRIBE nom_de_la_table;
```
Afin d'accéder directement aux donées :
```SQL
SELECT * FROM nom_de_la_table;
```
La suppression d'une table (et de ses données) se fait de cette manière :
```SQL
DROP TABLE nom_de_la_table;

[on peut ajouter 'IF EXISTS' avant le nom de la table]
```

<a href="https://waytolearnx.com/2019/09/liste-des-commandes-mysql.html">liste des commandes</a>

### Commandes pour créer sa base de données :

## Le RDBMS = Relational DataBase Management System

Composé de deux choses principales :
* La BDD en elle-même, qui est une collection de  du commentaire.

Tout cela résulte de la normalisation des bases de données relationnelles :<br>
chaque entité sera organisée dans sa plus petite forme normale.

On pourra utiliser l'extension _SQLTools sur VSCode_.<br>
Cela va permettre de stocker le détail de notre connection, visualiser la BDD et voir l'historique des queries qui ont éidentificateur. il permet d'identifier le contenu de la BDD, table, etc.

#### Pour créer une BDD SQL, on procédera ainsi :

```SQL
CREATE DATABASE name; 
--pour créer la base de données : name sera remplacé par le nom de la BDD

SHOW DATABASES; 
--permet de visualiser les BDD sur la machine
```
#### La création de tables se fera de cette manière

Au sein d'une table, on pourra créer des colonnes grâce aux parenthèses :<br> 
* chaque colonne de la table est identifiée grâce aux **identificateurs** (ou noms)<br> 
* le nom est obligatoirement suivi du **type de données**, primordial pour éviter de sauvegarder le mauvais type de données et donc de renvoyer une ERREUR<br> 
(SQL est très strict sur l'intégrité des données)<br>
* on pourra aussi ajouter des contraintes (**CONSTRAINTS**) : PRIMARY KEY par exemple.<br>
PRIMARY KEY indique à la BDD que cette colonne identifie une ligne unique : la donnée doit donc être unique, non nulle (!null).<br>
Les contraintes sont une sorte de couche supplémentaire de validation de données<br>
* la colonne est **fermée par une virgule**

```
la PRIMARY KEY (clé primaire) permet d'identifier chaque enregistrement dans une table de base de données.
Chaque enregistrement de cette clé primaire doit être UNIQUE et ne doit pas contenir de valeur NULL.

La clé primaire est un index. Chacune des tables ne peut contenir qu'une seule clé primaire, composée d'une ou plusieurs colonnes.

L'usage le plus fréquent consiste à créer une colonne numérique qui s'incrémente automatiquement à chaque enregistrement grâce à AUTO_INCREMENT
```
Chacunes par un identificateur : id, email, bio, pays.<br>
Chaque colonne aura un type de données<br>
* la colonne **"ID"** comporte le mot clé **PRIMARY KEY** indique une donnée unique et non nulle<br>
**AUTO_INCREMENT** indique à la BDD qu'elle doit créer automatiquement une ID pour l'utilisateur.<br>
cette id va commencer à 1, et continuer avec 2, 3, etc.
* concernant l'email, le type **VARCHAR** indique un nombre de caractères spécifiques,<br>
ce type prend en argument un nombre qui représente la taille maximum qu'elle pourra prendre.<br>
l'email prend également la contrainte **NOT NULL** et **UNIQUE** :<br> 
cela signifie qu'il sera obligatoire d'ajouter une donnée dans cette colonne, unique à cet emplacement.<br>
* bio utilise le type **TEXT** : un plus grand nombre de caractères (inconnu) sera stocké à cet emplacement.<br>
* le pays aura le type **VARCHAR** limité à 2 caractères (code pays)

#### Insérer des données dans une table 

On utilisera les mots clés **INSERT INTO** et le nom de la table concernée.<br>
Cette commande prendra les paramètres qu'on souhaite modifier au sein de la table :<br> 
email, bio et country.<br>
```
N.B. : l'ID n'est pas modifié car on a spécifié **AUTO_INCREMENT** 
lors de la création de la table. La modification se fera toute seule.
```
Puis le mot clé **VALUES** permettra de spécifier les valeurs correspondantes aux colonnes (passées en paramètres).<br>
Attention à bien respecter la structure des tables.

```SQL
INSERT INTO Users (email, bio, country)
VALUES (
    'hello@world.com',
    'i love strangers !',
    'US' --USA ne peut pas être utilisé car on a spécifié une taille max à 2 caractères
);

```

N.B. : il est possible d'insérer de multiples lignes en même temps :

```SQL
INSERT INTO Users (email, bio, country)
VALUES
    ('hello@world', 'foo', 'US')
    ('hola@munda.com', 'bar', 'MX')
    ('bonjour@monde.fr', 'baz', 'FR');

```

#### Récupérer des données dans une table 

Pour récupérer des données, on utilisera le mot clé **SELECT**.<br>
Ce mot clé ous permet de retourner la donnée dans un tableau de résultat.<br>

Pour sélectionner toutes les données d'une table, on utilisera **SELET * FROM Users;**<br>
**' * '**  nous indique qu'on souhaite sélectionner toutes les données.<br>
On peut sélectionner des colonnes spécifiques en indiquant leur identificateur à la place de l'étoile.

```SQL
SELECT; 
--permet de lire de la donnée d'une BDD retournée dans une table de résultats.

SELECT * FROM Users;
--permet d'indiquer les données sélectionnées dans une table spécifique.

SELECT email, id FROM Users ORDER BY id ASC LIMIT 2;
--permet de sélectionner des colonnes spécifiques.
--ORDER BY permet de classer selon un certain champ (ici l'ID), avec un tri ascendant.

```

On aura souvent besoin de spécifier encore plus le tri de données :<br>
la clause **WHERE** permettra de trier spécifiquement les colonnes qui contiennent une donnée spécifique.<br>
Cela permet d'employer une logique conditionnelle sur une query.<br>

On pourra également ajouter des clauses grâce au mot clé **AND** ou **OR**,<br> 
toujours en spécifiant l'identificateur de la colonne et la valeur qu'on souhaite trier.

exemple :

```SQL
SELECT email, id, country FROM Users 
WHERE country = 'US' AND email LIKE 'h%' 
ORDER BY id DESC LIMIT 2;

```
* ici on cherche les informations emails, id et pays dans la table utilisateur
* où le pays est 'US' ET l'email commence par la lettre 'h'. 
* Le tri sera fait selon l'ID par un tri descendant.
* On limitera le résultat aux 2 premières lignes qui dorrespondent à cette recherche.

ATTENTION : ce genre de requêtes risquera de faire ralentir au fur et à mesure que la BDD grandira.

#### à propos des INDEX

Afin de retrouver des données plus rapidement, on va employer une 'lookup table' = un INDEX.<br>
Une **'BDD index'** est comme un index à la fin d'un livre.<br>
Elle permet à la BDD de trouver des mots clés importants sans avoir à scanner la totalité des données.<br>

```
En SQL, la commande CREATE INDEX permet de créer un index.
L'index est utile pour accélérer l'exécution d'une requête SQL qui lit des données
et ainsi améliorer les performances d'une application en utilisant une base de données.
```

Cependant, cela vient avec un coût : des droits plus lents et plus de mémoire utilisée.

```SQL
CREATE INDEX email_index ON Users(email);
```


#### Créer une relation entre deux tables : la jointure

Afin de créer une relation entre les tables, on utilisera une jointure.<br>

Tout d'abord, on crée une table contenant une clé étrangère faisant référence à une autre table :

```SQL
CREATE TABLE Rooms(
    id INT AUTO_INCREMENT,
    street VARCHAR(255),
    owner_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);
```

* Ici, on crée la table 'Rooms'.<br>
* l'id sera un nombre entier qui s'implémente automatiquement.<br>
* la colonne 'owner_id' sera également un entier, non null.<br>
* On indique ensuite la clé primaire qui prend en paramètre le nom de la colonne 'id'.<br>
* la clé étrangère s'appelle 'onwer_id', elle fait référence à la colonne 'id' de la table 'Users'.<br> 
Cela signifie que cette colonne dans la nouvelle table fait référence à une autre table 'Users' grâce à une clé étrangère.<br>
Cela indique à la BDD de ne pas supprimer de données concernant un utilisateur qui a des données associées dans la table room au même moment.<br>
Ainsi, on va conserver l'intégrité des données. 

```SQL
INSERT INTO Rooms (Owner_id, street)
VALUES (
    id INT AUTO_INCREMENT,
    street VARCHAR(255),
    owner_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);
```

Pour insérer des données, on procédera ainsi :

```SQL
INSERT INTO Rooms (Owner_id, street)
VALUES
    (1, 'san diego sailboat'),
    (1, 'nantucket cottage'),
    (1, 'vail cabin'),
    (1, 'sf cardboard box');
```

#### Concernant les jointures :

La jointure permet d'expliquer au SGBD comment **joindre deux tables selon un identifiant qu'elles ont en commun.**<br>

```
Les jointures permettent d'associer plusieurs tables dans une même requête.
Cela permet d'exploiter la puissance des bases de données relationnelles
pour obtenir des résultats qui combinent les données de plusieurs tables 
de manière efficace.

En général, les jointures consistent à associer des lignes de 2 tables 
en associant l'égalité des valeurs d'une colonne d'une première table 
par rapport à la valeur d'une colonne d'une seconde table.
```

Par exemple :<br> 
une base de 2 données qui possède une table 'user'<br> 
et une table 'adress' qui contient les adresses de ces utilisateurs.<br>
Avec une jointure, il est possible d'obtenir les données de l'utilisateur et de son adresse en une seule requête.

Un site web qui possède une table pour les articles (titre, contenur, date de publi...)<br>
et une autre pour les rédacteurs (nom, date d'inscription, date de naissance).<br>
Avec une jointure, il est possible d'effectuer une seule recherche pour afficher un article et le nom du rédacteur.<br>
Cela évite d'avoir à afficher le nom du rédacteur dans la table 'article'.

exemple plus concret :<br>
Si on possède une table 'utilisateur' et une table 'langue',<br> 
on peut spécifier grâce au mot clé **JOIN** que l'id de la langue doit être égale à l'id de l'utilisateur :

```SQL
SELECT * FROM utilisateurs --sélectionne tous les utilisateurs
JOIN langue --joindre les langues
ON utilisateurs.langue_id = langue.id --relation entre tous les utilisateurs ayant configuré dans une langue spécifique.
```
* On demande au SGBD de sélectionner tous les utilisateurs grâce à **SELECT * FROM `utilisateurs`**
* Au résultat de cette commande, on a joint la table langue grâce à **JOIN `langue`
* Pour pouvoir faire cette jointure, on précise au SGBD la correspondance entre la table _langue_ et la table _utilisateur_.<br>
La correspondance est effectuée via la clé _langue_id_ pour la table utilisateurs et _id_ pour la table langue.<br>
Cela se fait grâce à **ON `utilisateur`.`langue_id` = `langue`.`id`.
ble 'utilisateur' et une table 'langue',<br> 
on peut spécifier grâce au mot clé **JOIN** que l'id de la langue doit être égale à l'id de l'utilisateur :

```SQL
SELECT * FROM utilisateurs --sélectionne tous les utilisateurs
JOIN langue --joindre les langues
ON utilisateurs.langue_id = langue.id --relation entre tous les utilisateurs ayant configuré dans une langue spécifique.
```
* On demande au SGBD de sélectionner tous les utilisateurs grâce à **SELECT * FROM `utilisateurs`** 
jointure interne pour retourner les enregistrements quand la condition est vraie dans les deux tables.<br>
C'est l'une des jointures les plus communes.<br>
* **LEFT JOIN (ou LEFT OUTER JOIN)** :<br> 
jointure externe pour retourner tous les enregistrements de la table de gauche (LEFT = gauche),<br>
même si la condition n'est pas vérifiée dans l'autre table.
* **RIGHT JOIN** (ou **RIGHT OUTER JOIN**) :<br>
jointure externe pour retourner tous les enregistrements de la table de gauche (RIGHT = droite),<br>
même si la condition n'est pas vérifiée dans l'autre table.
* **OUTER JOIN** (ou **FULL OUTER JOIN**) :<br>
jointure externe pour retourner les résultats
Tout cela résulte de la normalisation des bases de données relationnelles :<br>
chaque entité sera organisée dans sa plus petite forme normale.

On pourra utiliser l'extension _SQLTools sur VSCode_.<br>
Cela va permettre de stocker le détail de notre connection, visualiser la BDD et voir l'historique des queries qui ont é<br>
* **UNION JOIN** : jointure d'union.

### Sélectionner et renommer certaines colonnes dans une liste de résultats

**SQL AS (alias)**

Dans le langage SQL, il est possible d'utiliser des **alias** pour renommer temporairement une colonne ou une table dans une requête.<br>
Cette astuce est particulièrement utile pour faciliter la lecture des requêtes.

**Intérêts et utilités**

* **Alias sur une colonne :**<br>
Permet de renommer le nom d'une colonne dans les résultats d'une requête SQL.<br>
C'est pratique pour avoir un nom facilement identifiable dans une application<br> 
qui doit ensuite exploiter les résultats d'une recherche.<br>
ex : une colonne qui s'appelle c_iso_3166 peut être renommée 'code_pays', ce qui est plus simple à comprendre.<br>
_**SYNTAXE :**_<br>
```SQL
SELECT colonne1 AS c1, colonne2
FROM `table`

--peut aussi s'afficher de cette manière :
SELECT colonne1 c1, colonne2
FROM `table`

```

* **Alias sur une table :**<br>
Permet d'attribuer un autre nom à une table dans une requête SQL.<br>
Cela peut aider à avoir des noms plus court, plus simple et plus facilement compréhensible.<br>
Ceci est particulièrement vrai lorsqu'il y a des jointures.<br>
_**SYNTAXE :**_<br>
```SQL
SELECT *
FROM `nom_table` AS t1

--peut aussi s'afficher de cette manière :
SELECT *
FROM `nom_table` t1

```

**N.B. : il est préférable d'utiliser la commande AS pour que ce soit plus explicite**

### Supprimer une table et une base de données

**SQL DROP TABLE**

La commande DROP TABLE en SQL permet de supprimer définitivement une table d'une base de données.<br>
Cela supprimer en même temps les éventuels index, trigger, contraintes et permissions associées à cette table.<br>

**Attention :** il faut utiliser cette commande avec attention car une fois supprimée, les données sont perdues.<br>
Avant de l'utiliser sur une base importante, il peut être judicieux d'effectuer un backup (au sauvegarde)<br> 
pour éviter les mauvaises surprises.

_**SYNTAXE :**_<br>
```SQL
DROP TABLE nom_table
```

## EN PRATIQUE

Exemple du MCD - MLD Twitter

### 1. SUPPRIMER LES DONNEES EXISTANTES

Il faut commencer par supprimer les tables qui existent : DROP TABLE

```SQL
-- @block
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Tweets;
DROP TABLE IF EXISTS Hashtags;
DROP TABLE IF EXISTS Users_users;
DROP TABLE IF EXISTS Tweets_users;
DROP TABLE IF EXISTS Hashtags_tweets;
```

### 2. CREER LES TABLES QUI COMPOSENT LA BDD

On utilisera : CREATE TABLE

```SQL
-- @block
CREATE TABLE Users(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL UNIQUE,
    user_address TEXT,
    user_postal_code INTEGER,
    user_city TEXT,
    user_country TEXT
);

-- @block
CREATE TABLE Tweets(
    tweet_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_content TEXT NOT NULL,
    tweet_created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    u_id INTEGER NOT NULL,
    FOREIGN KEY(u_id) REFERENCES Users(user_id) 
);

-- @block
CREATE TABLE Hashtags(
    hashtag_name TEXT PRIMARY KEY
);

-- @block
CREATE TABLE Users_users(
    user1_id INTEGER,
    user2_id INTEGER,
    PRIMARY KEY(user1_id, user2_id),
    FOREIGN KEY(user1_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(user2_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- @block
CREATE TABLE Hashtags_tweets(
    hashtag_name TEXT,
    tweet_id INTEGER,
    PRIMARY KEY(hashtag_name, tweet_id),
    FOREIGN KEY(hashtag_name) REFERENCES Hashtags(hashtag_name) ON DELETE CASCADE,
    FOREIGN KEY(tweet_id) REFERENCES Tweets(tweet_id) ON DELETE CASCADE
);
```

### 3. INSERER DES DONNEES

On utilisera INSERT INTO

```SQL
-- @block
INSERT INTO Users (user_name, user_email, user_address, user_postal_code, user_city, user_country)
VALUES
    ('Toto', 'toto@domaine.com', '123 nous irons aux bois', 78000, 'PARIS', 'FRANCE'),
    ('OuiOui', 'ouioui@domaine.com', '456 cueillir des cerises', 69000, 'LYON', 'FRANCE'),
    ('NonNon', 'nonnon@domaine.com', '789 dans mon panier neuf', 74000, 'ANNECY', 'FRANCE');
-- SELECT * FROM Users;

-- @block
INSERT INTO Tweets (tweet_content, u_id)
VALUES
    ('tweet 1 Toto', 1),
    ('tweet 2 Toto', 1),
    ('tweet 3 Toto', 1),
    ('tweet 1 OuiOui', 2),
    ('tweet 2 OuiOui', 2),
    ('tweet 3 OuiOui', 2),
    ('tweet 1 NonNon', 3),
    ('tweet 2 NonNon', 3),
    ('tweet 3 NonNon', 3);
-- SELECT * FROM Tweets;

-- @block
INSERT INTO Tweets_users (user_id, tweet_id)
VALUES 
    (1, 4),
    (1, 5),
    (1, 6),
    (1, 7),
    (1, 8),
    (1, 9),
    (2, 1),
    (2, 2),
    (2, 3),
    (2, 7),
    (2, 8),
    (2, 9),
    (3, 1),
    (3, 2),
    (3, 3),
    (3, 4),
    (3, 5),
    (3, 6);
-- SELECT * FROM Tweets_users;
```
