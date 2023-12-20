I. ECRIRE LES REQUETES DE SELECTION D'UNE TABLE :
1. Lister l’ensemble des films.
```SQL 
SELECT * FROM `movies`;
```
2. Liste des films plus long que 2 heures
```SQL 
SELECT * FROM `movies` WHERE `length_in_min` > 120;
```
3. Liste des films par ordre alphabétique décroissant
```SQL 
SELECT * FROM `movies` ORDER BY `title` DESC;
```
4.Liste des séances sur les 10 derniers jours
```SQL 
SELECT * FROM `show` WHERE date >= DATE_SUB(NOW(), INTERVAL 10 DAY) AND date < CURDATE() ORDER BY date;
```
II. CREER LES DIFFERENTES TABLES DE LA BASE DE DONNEES :
1. Liste des films avec Harrison Ford dans son casting
```SQL 
SELECT * FROM `movies` AS m
    JOIN `actors_movies` AS am ON m.id = am.movies_id
    JOIN `actors` AS a ON am.actors_id = a.id
    WHERE a.lastname = 'FORD';
```
2. Liste des toutes les salles avec un film ayant Bruce Willis ou Harrison Ford dans son casting
```SQL 
SELECT DISTINCT mr.`room-number`, c.name FROM `movie-room` mr
    JOIN cinemas AS c ON mr.cinema_id = c.id
    JOIN `show` AS s ON mr.id = s.`movie-room_id`
    JOIN `movies` AS m ON s.movie_id = m.id
    JOIN `actors_movies` AS am ON m.id = am.movies_id
    JOIN `actors` AS a ON am.actors_id = a.id
    WHERE a.lastname = 'FORD' OR a.lastname = 'WILLIS'
    ORDER BY c.name;
```
3. Nombre de places totale pour le cinéma Mégarama
```SQL 
SELECT SUM(mr.capacity) FROM `movie-room` AS mr
    JOIN cinemas AS c ON mr.cinema_id = c.id
    WHERE c.compagny = 'Megarama';
```
4. Liste des films projetés dans une salle entre 100 et 200 places
```SQL 
SELECT DISTINCT m.title FROM movies AS m
    JOIN `show` AS s ON m.id = s.movie_id
    JOIN `movie-room` AS mr ON s.`movie-room_id` = mr.id
    WHERE mr.capacity >= 100 AND mr.capacity <= 200;
```
5. Tous les cinémas qui ont passé ou vont passer star wars
```SQL 
SELECT DISTINCT c.name FROM cinemas AS c
    JOIN `movie-room` AS mr ON c.id = mr.cinema_id
    JOIN `show` AS s on mr.id = s.`movie-room_id`
    JOIN movies AS m ON s.movie_id = m.id
    WHERE m.title = 'Star Wars';
```
6. Nombre total de place par cinéma
```SQL 
SELECT DISTINCT c.name AS cinema, SUM(mr.capacity) AS total_capacity FROM `movie-room` AS mr
    JOIN cinemas AS c ON mr.cinema_id = c.id
    GROUP BY c.name;
```
7. Budget total de tous les films par année de sortie
```SQL 
SELECT DISTINCT SUM(m.budget), YEAR(m.year) FROM movies AS m GROUP BY YEAR(m.year);
```
III. INSERTION, MISE A JOUR ET SUPPRESSION
1. Créer un film avec au moins trois projections pour le mois prochain
```SQL 
INSERT INTO `movies` (`title`, `genre`, `year`, `budget`, `length_in_min`)
VALUES ('Le Seigneur des Anneaux, la communauté de l\'Anneau', 'aventure', '2001-12-19', '93000000', '178');
```
```SQL 
INSERT INTO `actors` (`lastname`, `firstname`, `birthdate`, `nationality`)
VALUES ('WOOD', 'Elijah', '1981-01-28', 'US'),
('MCKELLEN', 'Ian', '1939-05-25', 'GB'),
('MORTENSEN', 'Viggo', '1958-10-20', 'US'),
('ASTIN', 'Sean', '1971-02-25', 'US');
```

```SQL 
INSERT INTO `actors_specialty` (`specialty_id`, `actors_id`)
SELECT s.id AS specialty_id, (SELECT a.id FROM actors AS a WHERE a.lastname = 'WOOD') AS actor_id  FROM specialty AS s WHERE s.name IN ('acteur', 'producteur');
```
```SQL 
INSERT INTO `actors_specialty` (`specialty_id`, `actors_id`)
SELECT s.id AS specialty_id, (SELECT a.id FROM actors AS a WHERE a.lastname = 'MCKELLEN') AS actor_id  FROM specialty AS s WHERE s.name IN ('acteur');
```
```SQL 
INSERT INTO `actors_specialty` (`specialty_id`, `actors_id`)
SELECT s.id AS specialty_id, (SELECT a.id FROM actors AS a WHERE a.lastname = 'MORTENSEN') AS actor_id  FROM specialty AS s WHERE s.name IN ('acteur', 'realisateur', 'producteur');
```
```SQL 
INSERT INTO `actors_specialty` (`specialty_id`, `actors_id`)
SELECT s.id AS specialty_id, (SELECT a.id FROM actors AS a WHERE a.lastname = 'ASTIN') AS actor_id  FROM specialty AS s WHERE s.name IN ('acteur', 'realisateur', 'producteur');
```

```SQL 
INSERT INTO `actors_movies` (`actors_id`, `movies_id`, `role`)
SELECT (SELECT a.id AS actors_id FROM actors AS a WHERE a.lastname = 'WOOD') AS actors_id, m.id AS movies_id, 'Frodon Sacquet' AS role FROM movies AS m WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau';
```
```SQL 
INSERT INTO `actors_movies` (`actors_id`, `movies_id`, `role`)
SELECT (SELECT a.id AS actors_id FROM actors AS a WHERE a.lastname = 'MCKELLEN') AS actors_id, m.id AS movies_id, 'Gandalf' AS role FROM movies AS m WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau';
```
```SQL 
INSERT INTO `actors_movies` (`actors_id`, `movies_id`, `role`)
SELECT (SELECT a.id AS actors_id FROM actors AS a WHERE a.lastname = 'MORTENSEN') AS actors_id, m.id AS movies_id, 'Aragorn' AS role FROM movies AS m WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau';
```
```SQL 
INSERT INTO `actors_movies` (`actors_id`, `movies_id`, `role`)
SELECT (SELECT a.id AS actors_id FROM actors AS a WHERE a.lastname = 'ASTIN') AS actors_id, m.id AS movies_id, 'Samsagace Gamegie' AS role FROM movies AS m WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau';
```

```SQL 
SET @FILM_ID = (SELECT m.id AS movie_id FROM movies AS m WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau');
INSERT INTO `show` (`movie_id`, `movie-room_id`, `date`)
VALUES (@FILM_ID, 2, '2024-01-10 20:00:00'),
       (@FILM_ID, 1, '2024-01-15 19:00:00'),
       (@FILM_ID, 5, '2024-01-20 21:00:00');
```
2. Ajouter un cinéma et ses salles
```SQL 
INSERT INTO cinemas (name, address, city, tel, compagny)
VALUES ('Pathé Archamps', 'Archpark 2ème Avenue', 'ARCHAMPS', '04 50 43 28 00', 'Pathé Gaumont');
```
```SQL 
INSERT INTO `movie-room` (`room-number`, capacity, cinema_id)
VALUES (1, 500, 4), (2, 254, 4), (3, 165, 4), (4, 165, 4), (5, 122, 4), (6, 330, 4), (7, 196, 4);
```
3. Ajouter 1 000 000 au budget du film que vous avez créé
```SQL 
UPDATE `movies` AS m
SET m.budget = m.budget + 1000000
WHERE m.title = 'Le Seigneur des Anneaux, la communauté de l\'Anneau';
```
4. Augmenter de 5% le budget de tous les films
```SQL 
UPDATE `movies` AS m
SET m.budget = m.budget * 1.05;
```
5. Supprimer un film
```SQL 
DELETE FROM movies AS m WHERE m.id = 5;
```
6. Supprimer les films n’ayant aucune projection
```SQL 
DELETE m FROM movies AS m LEFT JOIN `show` AS s ON m.id = s.movie_id WHERE s.date IS NULL;
```
IV. POUR ALLER PLUS LOIN (OPTIONNEL)
1. Liste de tous les films qui passent aujourd’hui
```SQL 
SELECT * FROM movies AS m
JOIN `show` s ON m.id = s.movie_id
WHERE DATE(s.date) = CURDATE();
```
2. Durée totale de projection pour chaque cinéma
```SQL 
SELECT c.name, SUM(m.length_in_min)
FROM cinemas AS c
JOIN `movie-room` AS rm ON c.id = rm.cinema_id
JOIN `show` AS s ON rm.id = s.`movie-room_id`
JOIN movies AS m ON s.movie_id = m.id
GROUP BY c.name;
```
3. Liste de tous les films ne contenant pas Harrison Ford
```SQL 
SELECT * FROM `movies` AS m
WHERE m.id NOT IN (
    SELECT am.movies_id FROM actors_movies AS am
    JOIN actors AS a ON am.actors_id = a.id
    WHERE a.lastname = 'FORD'
);
```
* `SELECT * FROM movies AS m` => Sélectionne toutes les colonnes de la table 'movies' et utilise l'alias 'm' pour désigner la table
* `WHERE m.id NOT IN (...)` => Filtre les résultats de la table 'movies' en excluant certains enregistrements en fonction de la condition spécifiés entre parenthèses
* la sous-requête : `SELECT am.movies_id FROM actors_movies AS am JOIN actors AS a ON am.actors_id = a.id WHERE a.lastname = 'FORD'`<br>
    * `SELECT am.movies_id`: Sélectionne la colonne movies_id de la table actors_movies.
    * `FROM actors_movies AS am JOIN actors AS a ON am.actors_id = a.id`: Effectue une jointure entre les tables actors_movies (alias am) et actors (alias a) en utilisant la clé étrangère actors_id pour les relier.
    * `WHERE a.lastname = 'FORD'`: Filtre les résultats pour ne récupérer que les enregistrements de la table actors où le nom de famille (lastname) est égal à 'FORD'.<br>


=> Elle sélectionne tous les 'movies_id' de la table 'actors_movies' associés aux acteurs portant le nom de famille 'FORD'.<br>
En utilisant `m.id NOT IN (...)` dans la requête principale, on sélectionne tous les enregistrements de la table 'movies' dont l'id n'est pas présent dans les résultats de la sous-requête.

4. Liste des cinéma qui passent tous les films
```SQL 
SELECT c.id, c.name
FROM cinemas AS c
JOIN `movie-room` AS mr ON c.id = mr.cinema_id
JOIN `show` AS s ON mr.id = s.`movie-room_id`
JOIN movies AS m ON s.movie_id = m.id
GROUP BY c.id, c.name
HAVING COUNT(DISTINCT m.id) = (
    SELECT COUNT(DISTINCT id) FROM movies
);
```
* `SELECT c.id, c.name FROM cinemas AS c` => Sélectionne les colones 'id' et 'name' de la table 'cinemas' alias 'c'
* `JOIN movie-room AS mr ON c.id = mr.cinema_id` => fait une jointure entre les tables 'cinemas' et "'movie-room' grâce aux 'id'
* `JOIN show AS s ON mr.id = s.movie-room_id` => fait une jointure supplémentaire avec la table 'show'
* `JOIN movies AS m ON s.movie_id = m.id` => fait une jointure avec la table movies
* `GROUP BY c.id, c.name` => groupe les résultats par l'identifiant et le nom du cinéma
* `HAVING VOUNT(DISTINCT m.id) = (SELECT COUNT(DISTINCT id) FROM movies)` => utilise la clause 'having' pour filtrer les résultats.<br>
Elle compare le nombre de films uniques projetés dans chaque cinéma ('COUNT(DISTINCT m.id)')<br> 
avec le nombre total de films uniques présents dans la table 'movies' ('SELECT COUNT(DISTINCT id) FROM movies').<br>
Inclus les résultats ou les cinémas qui ont les deux 'COUNT' égaux.