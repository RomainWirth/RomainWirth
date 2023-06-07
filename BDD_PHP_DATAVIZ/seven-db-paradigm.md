# PARADIGME DES BASES DE DONNEES

Source : https://www.youtube.com/watch?v=W2Z7fbCLSTw <br>

Cette vidéo traite du paradigme des 7 types de bases de données.

## 1. Le type de BDD le plus simple : KEY-VALUE DATABASE

![](./key-value-db.png)

Ce type de BDD est structuré comme un objet JS ou un dictionnaire Python :<br>
Il s'agit d'une paire clé, valeur, ou chaque clé est unique et pointe vers une valeur.<br>

Par exemple, dans Redis, on peut lire et écrire de la donnée avec des commandes : SET (écriture), GET (récupérer).<br>
Dans le cas de Redis (https://redis.io/) et Memcached (https://memcached.org/), toute la donnée est stockée dans la mémoire vive de l'ordinateur.<br>

Contrairement à toutes les autres bases de données qui conservent leur donnée sur le disque dur.<br>
Cela limite la quantité de donnée qu'on peut stocker, mais cela rend la base de données extrêmement rapide<br>
car on ne requiert pas d'accès au disque pour toute les requêtes.<br>
De plus, on ne peut pas procéder à des QUERIES, JOINS ou autre, ce qui limite la modélisation de données.

Ce genre de BDD ne sera pas utilisé pour les données principales d'une application.<br>
C'est souvent utilisé en CACHE pour réduire la latence des données.<br>

Des apps telles que Twitter, GitHub & Snapchat utilisent Redis pour une livraison des données en temps réel.<br>

Ces types de BDD sont utilisées en complément de BDD qui sont plus persistantes. 

## 2. Les BDD : WIDE COLUMN DATABASE

![](./wide-column-db.png)

Des DB populaires de ce type sont : Cassandra (https://cassandra.apache.org/_/index.html) et Apache Hbase (https://hbase.apache.org/).<br>
Ce type de BDD est comme une ket value db à laquelle on a ajouté une deuxième dimension.<br>
Concrètement, on un espace "clé", qui comportera des colonnes qui comportent un jeu de colonnes rangées, permettant de regrouper des données rangés ensemble.<br>
Mais, contrairement à une BDD relationnelle, elle ne possède pas de schéma.<br>
Cela permet de gérer des données non structurées.<br>
Pour cela, on utilise un 'query language' appelé CQL (Context Query Language), similaire à SQL