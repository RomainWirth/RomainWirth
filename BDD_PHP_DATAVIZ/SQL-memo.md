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

Une table est une sorte de dictionnaire ou une clé est représentée dans une colonne et la valeur représente un type de donnée qui peut être stocké à cet endroit.