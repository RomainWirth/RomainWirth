# SQL - Initiation

Source : https://www.youtube.com/watch?v=Cz3WcZLRaWc <br>
Source : https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7139618-decouvrez-le-systeme-de-gestion-de-base-de-donnees-sgbd <br>

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

![](./comparatif_SGBD.png)

Actuellement, il existe des ORM (Object Relational Mapping) = des outils qui permettent d'éviter d'utiliser du SQL brut, et permettent d'augmenter la productivité.<br>
Pour JS : Sequelize, Python : SQL Alchemy, Ruby on rails : Active Records.<br>
Il est tout de même nécessaire et préférable de bien comprendre comment fonctionne le SQL.

## Le RDBMS = Relational DataBase Management System

Composé de deux choses principales :
* La BDD en elle-même, qui est une collection de Tables qui contiennent chaque la donnée, organisée en colonnes et lignes (similaire à une feuille de calcul excel).<br> 
* La deuxième composante est le langage SQL, permettant de manipuler et lire la donnée dans la BDD. qui est souvent une variation du 'Structure Query Language' (selon le SGBD utilisé).<br>

## Tuto installation MySQL (Windows, Mac et Linux)

https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql

## Créer sa base de données

Une table est une sorte de dictionnaire ou une clé représente une colonne dans la BD et la valeur représente un type de donnée qui peut être stocké à cet endroit.<br>

Il existe beaucoup de types de données, et ils peuvent varier selon les différents bases de données SQL.<br>
Pour la plupart, elles représentent différents types de nombres et chaînes de caractères.<br>

Dans MySQL, on retrouve des mots clés qui vont indiquer le type de données qu'on va avoir dans une colonne de notre base de données:<br> 
**INT** pour integer (des nombres entiers) ou **FLOAT** pour des nombres décimaux (à virgule).<br>
Pour de petites chaînes de caractères (string), on utilise **VARCHAR**,<br> 
et pour de plus longues chaînes de caractères on utilisera **TEXT**.

En plus du type de données, une colonne pourrait avoir certaines contraintes :<br>
Une colonne pourra ne pas être capable de stocker une valeur "null"<br> 
ou peut-être que chaque valeur dans cette colonne devra être unique (une ID utilisateur par exemple).<br>

Une clé primaire ne pourra pas être "null" et doit être unique.

Tout cela résulte de la normalisation des bases de données relationnelles :<br>
chaque entité sera organisée dans sa plus petite forme normale.

On pourra utiliser l'extension _SQLTools sur VSCode_.<br>
Cela va permettre de stocker le détail de notre connection, visualiser la BDD et voir l'historique des queries qui ont été employées.

### Commandes pour créer sa base de données :

Pour information : pour créer une BDD, ou une TABLE, on utilisera le mot clé CREATE suivi de l'élément qu'on veut créer : DATABASE, TABLE...

Pour écrire un commentaire, on utilisera "--" suivi du commentaire.

Un **"STATEMENT"** est du code qui réalise quelque chose. Un "statement" se termine toujours pas **";"**.

Les termes qui apparaissent en couleur sont des mots clé SQL que le langage va interprêter pour réaliser quelque chose.<br>
La convention veut qu'on les écrive en majuscule mais SQL n'est pas sensible à la casse.

Le terme qui suivra les mots clés est l'identificateur. il permet d'identifier le contenu de la BDD, table, etc.

#### Pour créer une BDD, on procédera ainsi :

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
PRIMARY KEY indique à la BDD que cette colonne identifie une ligne unique :<br>
la donnée doit donc être unique, non nulle (!null).<br>
Les contraintes sont une sorte de couche supplémentaire de validation de données<br>
* la colonne est **fermée par une virgule**

(voir exemple ci-dessous) :<br>

```SQL
-- @block
CREATE TABLE Users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    bio TEXT,
    country VARCHAR(2)
); 
```

* @block permet d'exécuter une requête SQL pour contrôler si l'étape est bien réalisée.<br>
* La table Utilisateur est créée. Elle contient 4 colonnes, identifiées chacunes par un identificateur : id, email, bio, pays.<br>
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
Puis le mot clé **VALUES** permettra de spécifier les valeurs correspondantes aux colonnes (passées en paramètres).


```SQL
INSERT INTO Users (email, bio, country)
VALUES (
    'hello@world',
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
SELECT email, id, country FROM Users WHERE country = 'US' AND email LIKE 'h%' ORDER BY id DESC LIMIT 2;

```
* ici on cherche les informations emails, id et pays dans la table utilisateur
* où le pays est 'US' ET l'email commence par la lettre 'h'. 
* Le tri sera fait selon l'ID par un tri descendant.
* On limitera le résultat aux 2 premières lignes qui dorrespondent à cette recherche.

ATTENTION : ce genre de requêtes risquera de faire ralentir au fur et à mesure que la BDD grandira.

Afin de retrouver des données plus rapidement, on va employer une 'lookup table'.<br>
Une **'BDD index'** est comme un index à la fin d'un livre.<br>
Elle permet à la BDD de trouver des mots clés importants sans avoir à scanner la totalité des données.<br>
Cependant, cela vient avec un coût : des droits plus lents et plus de mémoire utilisée.

```SQL
CREATE INDEX email_index ON Users(email);
```