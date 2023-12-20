```SQL
CREATE TABLE `cinemas` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`name` varchar(255) NOT NULL,
`address` varchar(255) NOT NULL,
`city` varchar(255) NOT NULL,
`tel` varchar(255) NOT NULL,
`compagny` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `cinemas` (`name`, `address`, `city`, `tel`, `compagny`)
VALUES ('Pathé Annecy', '7 Avenue de Brogny', 'ANNECY', '0892696696', 'Pathé Gaumont'),
('Megarama Seynod', '1 Rue de Tremblay', 'SEYNOD', '0485920050', 'Megarama'),
('La Turbine', '3 Rue des Tisserands', 'CRAN GEVRIER', '0964400471', NULL);
```
```SQL
CREATE TABLE `movie-room` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`number` int NOT NULL,
`capacity` int NOT NULL,
`cinema_id` varchar(255) NOT NULL,
FOREIGN KEY (`cinema_id`) REFERENCES `cinemas`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `movie-room` (`number`, `capacity`, `cinema_id`)
VALUES (1, 350, 1),
(2, 420, 1),
(3, 220, 1),
(4, 270, 1),
(5, 280, 1),
(1, 157, 1),
(2, 158, 1),
(3, 120, 1),
(4, 130, 1),
(1, 157, 1);
```
```SQL
CREATE TABLE `movies` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`title` varchar(255) NOT NULL,
`genre` varchar(255) NOT NULL,
`year` date NOT NULL,
`budget` bigint NOT NULL,
`length` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `movies` (`title`, `genre`, `year`, `budget`, `length`)
VALUES ('Indiana Jones, Les Aventuriers de l\'Arche perdue', 'aventure', '1981-09-16', '20000000', '1h55min'),
('Star Wars', 'aventure', '1977-10-19', '11500000', '1h45min'),
('Pulp Fiction', 'drame', '1994-10-26', '8000000', '2h34min'),
('Le cinquième élément', 'action', '1997-05-07', '75000000', '2h06min'),
('Apocalypse Now', 'guerre', '1979-09-26', '31000000', '2h33min'),
('La cité de la peur', 'comédie', '1994-03-09', '7500000', '1h33min'),
('Mon voisin Totoro', 'jeunesse', '1999-12-08', '3000000', '1h26min'),
```
```SQL
CREATE TABLE `actors` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`lastname` varchar(255) NOT NULL,
`firstname` varchar(255) NOT NULL,
`birthdate` date NOT NULL,
`nationality` varchar(2) NOT NULL,
`specialty` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `actors` (`lastname`, `firstname`, `birthdate`, `nationality`, `speciality`) 
VALUES ('LAUBY', 'Chantal', '1948-03-23', 'FR', 'comique'),
('CHABAT', 'Alain', '1958-11-24', 'FR', 'acteur et réalisateur'),
('FARRUGIA', 'Dominique', '1962-09-02', 'FR', 'comique'),
('DARMON', 'Gérard', '1948-02-29', 'FR', 'acteur et chanteur'),
('HALL', 'Albert', '1937-11-10', 'US', 'acteur polyvalent'),
('DUVALL', 'Robert', '1931-01-05', 'US', 'acteur, réalisateur et producteur'),
('FORREST', 'Frederic', '1936-12-23', 'US', 'acteur de film de guerre'),
('SHEEN', 'Martin', '1940-08-03', 'US', 'acteur'),
('JOVOVICH', 'Milla', '1975-12-17', 'UK', 'actrice'),
('HOLM', 'Ian', '1931-09-12', 'GB', 'acteur'),
('WILLIS', 'Bruce', '1955-03-19', 'US', 'acteur de film d\'action'),
('TRAVOLTA', 'John', '1954-02-18', 'US', 'acteur et danseur'),
('JACKSON', 'Samuel L.', '1948-12-21', 'US', 'acteur'),
('THURMAN', 'Uma', '1970-04-29', 'US', 'actrice'),
('HAMIL', 'Mark', '1951-09-25', 'US', 'maîtrise la force'),
('FORD', 'harrison', '1942-07-13', 'US', 'acteur'),
('FISHER', 'Carrie', '1956-10-21', 'US', 'actrice'),
('ALLEN', 'Karen', '1951-10-05', 'US', 'actrice');
```
```SQL
CREATE TABLE `actors_movies` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`movies_id` int NOT NULL,
`actors_id` int NOT NULL,
`role` varchar(255) NOT NULL,
FOREIGN KEY (`movies_id`) REFERENCES `movies`(`id`),
FOREIGN KEY (`actors_id`) REFERENCES `actors`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `actors_movies` (`movies_id`, `actors_id`, `role`) 
VALUES (1, 16, 'Indiana Jones'),
(1, 18, 'Marion Ravenwood'),
(2, 15, 'Luke Skywalker'),
(2, 16, 'Han Solo'),
(2, 17, 'La Princesse Leia Organa'),
(3, 12, 'Vincent Vega'),
(3, 13, 'Jules Winnfield'),
(3, 14, 'Mia Wallace'),
(3, 11, 'Butch Coolidge'),
(4, 11, 'Korben Dallas'),
(4, 10, 'Père Vito Cornelius'),
(4, 9, 'Leeloo'),
(5, 8, 'le Capitaine Willard'),
(5, 7, 'Chef'),
(5, 6, 'le Lieutenant-colonel Kilgore'),
(5, 5, 'Chef Phillips'),
(6, 1, 'Odile Deray'),
(6, 2, 'Serge Karamazov'),
(6, 3, 'Simon Jérémi'),
(6, 4, 'Commissaire Patrick Bialès');
```
```SQL
INSERT INTO `actors` (`lastname`, `firstname`, `birthdate`, `nationality`, `speciality`)
VALUES ('OLDMAN', 'Gary', '1958-03-21', 'GB', 'acteur');
```
```SQL
INSERT INTO `actors_movies` (`movies_id`, `actors_id`, `role`) 
VALUES (4, 19, 'Jean-Baptiste Emanuel Zorg');
```
```SQL
CREATE TABLE `show` (
`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
`movies_id` int NOT NULL,
`movie-room_id` int NOT NULL,
`date` varchar(255) NOT NULL,
FOREIGN KEY (`movies_id`) REFERENCES `movies`(`id`),
FOREIGN KEY (`movie-room_id`) REFERENCES `movie-room`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
```
```SQL
INSERT INTO `show` (`movie_id`, `movie-room_id`, `date`) 
VALUES (2, 4, '2023-12-27 20:00:00'),
(2, 10, '2023-12-13 20:00:00'),
(5, 1, '2023-12-02 18:00:00'),
(1, 2, '2023-12-19 20:00:00'),
(3, 7, '2023-12-20 18:00:00'),
(5, 7, '2023-12-15 21:00:00'),
(5, 5, '2023-12-22 21:00:00'),
(3, 6, '2023-12-23 17:00:00'),
(1, 9, '2023-12-07 21:00:00'),
(6, 2, '2023-12-16 16:30:00'),
(4, 1, '2023-12-21 18:00:00'),
(1, 9, '2023-12-26 15:00:00'),
(5, 4, '2023-12-07 12:00:00'),
(2, 8, '2023-12-25 21:00:00'),
(1, 2, '2023-12-01 20:00:00'),
(5, 1, '2023-12-01 21:00:00'),
(4, 9, '2023-12-14 19:00:00'),
(3, 7, '2023-12-06 18:00:00'),
(4, 9, '2023-12-29 18:00:00'),
(4, 4, '2023-12-18 18:00:00'),
(3, 5, '2023-12-19 18:00:00'),
(2, 10, '2023-12-20 22:00:00'),
(1, 7, '2023-12-21 22:00:00'),
(1, 4, '2023-12-22 18:00:00'),
(6, 7, '2023-12-02 22:00:00');
```
```SQL
ALTER TABLE `movies` ADD `length_in_min` INT;
```
```SQL
UPDATE `movies` SET `length_in_min` = 115 WHERE id = 1;
UPDATE `movies` SET `length_in_min` = 105 WHERE id = 2;
UPDATE `movies` SET `length_in_min` = 154 WHERE id = 3;
UPDATE `movies` SET `length_in_min` = 126 WHERE id = 4;
UPDATE `movies` SET `length_in_min` = 183 WHERE id = 5;
UPDATE `movies` SET `length_in_min` = 93 WHERE id = 6;
UPDATE `movies` SET `length_in_min` = 86 WHERE id = 7;
```
```SQL
ALTER TABLE `movies` DROP `length`;
```
```SQL
CREATE TABLE `specialty` (
`id`  NOT NULL AUTO_INCEMENT PRIMARY KEY, 
`name` VARCHAR(255) NOT NULL
);
```
```SQL
INSERT INTO `specialty` (`name`)
VALUES ('comique'),
('acteur'),
('actrice'),
('acteur polyvalent'),
('acteur de film de guerre'),
('acteur de film d\'action'),
('chanteur'),
('danseur'),
('producteur'),
('realisateur'),
('maitrise de la force');
```
```SQL
CREATE TABLE `actors_specialty` (
`id` INT NOT NULL AUTO_INCEMENT PRIMARY KEY,
`actors_id` INT NOT NULL,
`specialty_id` INT NOT NULL,
FOREIGN KEY (`actors_id`) REFERENCES `actors`(`id`),
FOREIGN KEY (`specialty_id`) REFERENCES `specialty`(`id`)
);
```
```SQL
INSERT INTO `actors_specialty` (`actors_id`, `specialty_id`)
VALUES (1, 1),
(2, 2),
(2, 10),
(3, 1),
(4, 2),
(4, 7),
(5, 4),
(6, 2),
(6, 9),
(6, 10),
(7, 5),
(8, 2),
(9, 3),
(10, 2),
(11, 6),
(12, 2),
(12, 8),
(13, 2),
(14, 3),
(15, 11),
(16, 2),
(17, 3),
(18, 3),
(19, 2);
```
```SQL
ALTER TABLE `actors` DROP `speciality`;
```