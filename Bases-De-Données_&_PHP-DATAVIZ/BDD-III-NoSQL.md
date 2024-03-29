# NoSQL

## INTRODUCTION

Le NoSQL, ou "Not only SQL", est une approche de gestion de base de données qui diffère des systèmes de gestion de base de données relationnelle (SQL).<br> 
Contrairement aux bases de données relationnelles, les bases de données NoSQL sont conçues pour stocker et gérer des données non structurées ou semi-structurées à grande échelle.

Le NoSQL offre une grande flexibilité pour manipuler différents types de données :<br> 
* des données textuelles, 
* des données hiérarchiques, 
* des données de séries temporelles, 
* etc.

Ces systèmes sont souvent utilisés dans des contextes où les données sont très volumineuses<br> 
ou où la structure des données peut varier de manière significative.

Les bases de données NoSQL se déclinent en plusieurs types,<br> 
dont les principales catégories sont :
1. **Bases de données de type clé-valeur :**<br> 
Elles stockent les données sous forme de paires clé-valeur,<br> 
où chaque donnée est associée à une clé unique.

2. **Bases de données de type document :**<br> 
Elles stockent des données sous forme de documents,<br> 
généralement au format JSON ou BSON (format binaire JSON).<br> 
_MongoDB_ est un exemple populaire de base de données de type document.

3. **Bases de données de type colonne :**<br> 
Elles stockent les données sous forme de colonnes plutôt que de lignes,<br> 
ce qui est utile pour les requêtes analytiques ou de données agrégées.

4. **Bases de données de graphe :**<br> 
Elles sont conçues pour stocker et interroger des relations complexes entre les données,<br>
très utilisées dans les réseaux sociaux, la recommandation et l'analyse des réseaux.

Les bases de données NoSQL offrent souvent une meilleure extensibilité horizontale,<br> c'est-à-dire qu'elles peuvent être plus facilement étendues sur plusieurs serveurs<br> 
pour gérer de grandes quantités de données.<br> 
Elles sont également souvent utilisées dans les applications web,<br> 
mobiles et d'analyse de données où la flexibilité et la scalabilité sont des priorités.

### Le NoSQL réponds à des besoins tels que :
* **Big Data :**<br> 
Gérer de grandes quantités de données qui peuvent être non structurées ou semi-structurées.

* **Applications Web et Mobiles :**<br> 
Soutenir des applications nécessitant une scalabilité horizontale et une gestion flexible des données.

* **Analyse de Données :**<br> 
Traiter des données pour l'analyse et la génération de rapports en temps réel.

### Principales technologies NoSQL

1. **Bases de données de type clé-valeur :** Exemples : Redis, Amazon DynamoDB.

2. **Bases de données de type document :** Exemples : MongoDB, Couchbase.

3. **Bases de données de type colonne :** Exemples : Cassandra, HBase.

4. **Bases de données de graphe :** Exemples : Neo4j, Amazon Neptune.

En résumé, le NoSQL offre une alternative aux bases de données relationnelles en offrant une flexibilité accrue, une scalabilité horizontale et la capacité à gérer différents types de données pour répondre aux besoins diversifiés des applications modernes.

### Le Principe BASE du NoSQL

voir <a href="https://openclassrooms.com/fr/courses/4462426-maitrisez-les-bases-de-donnees-nosql/4462471-maitrisez-le-theoreme-de-cap">Cours OpenClassroom</a>

Comme pour le principe ACID des SGBD, NoSQL a des propriétés pour caractériser ses bases :
* **B**_asically_ **A**_vailable_ :<br> 
quelle que soit la charge de la BDD (données/requêtes), le système garantie un taux de disponibilité de la donnée. 
* **S**_oft-state_ :<br>
la base peut changer lors des mises à jour ou lors d'ajout/suppression de serveurs.<br>
La base NoSQL n'a pas à être cohérente à tout instant.
* **E**_ventually consistent_ :<br>
A terme, la base atteindre un état cohérent.

## Débuter avec MongoDB sur Ubuntu

suivre le <a href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/">tuto</a> sur le site de mongodb.

### Dénormaliser un Schéma SQL > JSON

* **Des données fréquemment interrogées conjointement :**<br>
Par exemple, les requêtes demandent fréquemment le lieu d’habitation d’une personne.<br> 
De fait, la jointure devient coûteuse. Accessoirement, cette information étant peu mise à jour, cela pose peu de problèmes.<br>
Résultat, l’entité ‘Habitation’ et l’association ‘habite’ sont intégrés à l’entité Personne.<br> 
Habitation devient un document imbriqué à l’intérieur de Personne, représenté par : “{habite}”

* **Toutes les données d’une entité sont indépendantes :**<br>
Prenons l’exemple des domaines d’expertise d’une personne, ils sont indépendants des domaines d’une autre personne.<br> 
De fait, rapatrier les données de cette entité n’impacte aucune autre instance de Personne.<br> 
Ainsi, la liste des domaines est importé dans Personne et représenté par : “[domaines]”

* **Une association avec des relations 1-n des deux côtés :**<br>
Cette fois-ci, c’est plus délicat pour l’entité Etablissement.<br> 
Une personne peut avoir plusieurs emplois et un employeur, plusieurs employés.<br> 
De fait, une imbrication de l’employeur dans Personne peut avoir de gros impacts sur les mises à jour (tous les employés à mettre à jour !).<br> 
Il est donc peu recommandé d’effectuer une fusion complète.<br> 
Pour cela, seule l’association est imbriquée sous forme d’une liste de documents,<br> 
intégrant les attributs (qualité et date), ainsi qu’une référence vers l’employeur.<br> 
Ainsi : “[{emploie+ref}]”

* **Même taux de mises à jour :**<br>
Dans le cas des emplois d’une personne, là également nous pourrions effectuer une fusion de l’association “emploie”.<br> 
En effet, le taux de mises à jour des emplois est équivalent à celui de la Personne, de fait, sans incidence sur les problèmes de cohérence de données.

