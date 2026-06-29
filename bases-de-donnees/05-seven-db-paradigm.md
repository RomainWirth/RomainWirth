# Paradigmes des bases de donnees

## Objectifs du chapitre

Ce cours presente plusieurs grands paradigmes de bases de donnees. Le but n'est pas de tout memoriser par coeur, mais de comprendre qu'il existe plusieurs manieres de stocker et d'interroger les donnees selon les besoins.

## Prerequis

- connaitre les bases des SGBD relationnels ;
- avoir une vue generale du SQL et du NoSQL ;
- comprendre qu'un paradigme est un modele de conception.

## Plan du chapitre

1. definition d'un paradigme
2. etude des 7 familles
3. cas d'usage typiques
4. methode de choix

## Qu'appelle-t-on un paradigme de base de donnees ?

Un paradigme de base de donnees designe une facon generale de modeliser, stocker et interroger l'information.

Chaque paradigme met l'accent sur certains points :

- simplicite ;
- relations ;
- performance ;
- souplesse de schema ;
- recherche textuelle ;
- distribution sur plusieurs machines.

## 1. Key-value database

### Principe

On stocke des paires `cle -> valeur`.

Exemple :

- cle : `session:1452`
- valeur : un objet representant la session utilisateur

### Exemples de technologies

- Redis ;
- Memcached ;
- DynamoDB dans certains cas.

### Points forts

- tres rapide ;
- tres simple ;
- ideal pour cache, sessions ou compteurs.

### Limites

- tres peu de relations ;
- requetes limitees ;
- structure souvent dictee par l'application.

### Cas d'usage typiques

- cache applicatif ;
- paniers temporaires ;
- jetons d'authentification ;
- gestion de sessions.

## 2. Wide-column database

### Principe

Les donnees sont organisees de facon optimisee pour certains tres grands volumes et certaines lectures massives. Ce paradigme est souvent associe a des systemes distribues.

### Exemples de technologies

- Cassandra ;
- HBase.

### Points forts

- tres bonne repartition de charge ;
- adaptees aux gros volumes ;
- efficaces pour certains historiques et series temporelles.

### Limites

- modelisation moins intuitive ;
- requetes souvent moins riches que dans SQL ;
- moins adaptees aux relations complexes.

### Cas d'usage typiques

- logs ;
- historique d'evenements ;
- donnees massives distribuees.

## 3. Document database

### Principe

Les donnees sont stockees sous forme de documents, souvent proches du JSON.

### Exemples de technologies

- MongoDB ;
- Couchbase ;
- Firestore.

### Points forts

- schema souple ;
- tres pratique pour les applications web ;
- proche des structures manipulees en JavaScript et dans beaucoup d'API.

### Limites

- denormalisation a maitriser ;
- coherence parfois plus geree par l'application ;
- relations riches moins naturelles que dans le relationnel.

### Cas d'usage typiques

- contenus applicatifs ;
- catalogues ;
- profils utilisateurs enrichis ;
- CMS ;
- donnees semi-structurees.

## 4. Relational database

### Principe

Les donnees sont stockees en tables reliees entre elles par des cles.

### Exemples de technologies

- MySQL ;
- PostgreSQL ;
- MariaDB ;
- SQLite ;
- SQL Server.

### Points forts

- modele tres solide ;
- langage SQL puissant ;
- bonnes garanties transactionnelles ;
- tres adapte aux donnees structurees et coherentes.

### Limites

- schema plus rigide ;
- certaines mises a l'echelle sont plus complexes ;
- moins naturel pour des donnees tres heterogenes.

### Cas d'usage typiques

- applications metier ;
- e-commerce ;
- comptabilite ;
- gestion de commandes ;
- SI d'entreprise.

## 5. Graph database

### Principe

Les donnees sont modelisees sous forme de noeuds et de relations.

### Exemples de technologies

- Neo4j ;
- Dgraph ;
- Neptune.

### Points forts

- excellentes pour naviguer dans des reseaux de relations ;
- tres efficaces pour certains parcours complexes ;
- requetes souvent expressives pour les liens.

### Limites

- pas toujours necessaires pour des besoins simples ;
- outillage plus specialise.

### Cas d'usage typiques

- reseaux sociaux ;
- moteurs de recommandation ;
- detection de fraude ;
- graphes de connaissance.

## 6. Search database

### Principe

Ces bases sont specialisees dans l'indexation et la recherche textuelle.

### Exemples de technologies

- Elasticsearch ;
- Solr ;
- Meilisearch ;
- Algolia comme service de recherche.

### Points forts

- recherche plein texte rapide ;
- pertinence de recherche ;
- autocompletion et filtres puissants.

### Limites

- ce n'est pas toujours la base metier principale ;
- synchronisation a prevoir avec la source de verite.

### Cas d'usage typiques

- moteurs de recherche internes ;
- recherche de produits ;
- recherche documentaire ;
- autocompletion.

## 7. Multi-model database

### Principe

Une base multi-modele combine plusieurs paradigmes dans un meme systeme ou derriere une meme interface.

### Exemples de technologies

- certaines plateformes cloud ;
- certaines bases modernes qui melangent document, graphe ou relationnel.

### Points forts

- flexibilite ;
- unification de plusieurs besoins ;
- possibilite de reduire la multiplication des outils dans certains contextes.

### Limites

- plus complexe a comprendre ;
- tous les modes ne sont pas forcement aussi matures ;
- il faut verifier les vrais compromis techniques.

## Autres paradigmes a connaitre

On peut aussi rencontrer :

- les bases de series temporelles ;
- les data warehouses ;
- les bases orientees objets ;
- les bases vectorielles pour certains usages IA.

## Comment choisir le bon paradigme

Le bon choix depend surtout de :

- la nature des donnees ;
- le type de requetes ;
- les besoins de coherence ;
- l'echelle du systeme ;
- les competences de l'equipe.

Questions utiles a se poser :

- ai-je beaucoup de relations complexes ;
- ai-je besoin de transactions fortes ;
- mes donnees sont-elles tres variables ;
- dois-je faire de la recherche plein texte ;
- la charge doit-elle etre distribuee sur beaucoup de serveurs ;
- ai-je surtout besoin d'une base principale ou d'un outil specialise.

## A retenir

- il n'existe pas un seul bon modele de base de donnees ;
- chaque paradigme repond a certains besoins ;
- le relationnel reste central dans beaucoup de projets ;
- le NoSQL apporte des alternatives utiles ;
- de nombreuses architectures modernes combinent plusieurs paradigmes.

## Mini-exercices corriges

### Exercice 1

Question : quel paradigme est le plus adapte a un moteur de recherche plein texte ?

Correction : une search database, par exemple Elasticsearch ou Meilisearch.

### Exercice 2

Question : quel paradigme choisir pour un reseau social avec parcours de relations complexes ?

Correction : une graph database, car elle optimise les parcours de liens entre entites.

### Exercice 3

Question : pourquoi beaucoup d'architectures combinent plusieurs paradigmes ?

Correction : parce qu'un seul modele ne couvre pas toujours tous les besoins de performance, relation, recherche et scalabilite.
