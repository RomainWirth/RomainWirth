# NoSQL - principes et usages

## Objectifs du chapitre

Ce cours introduit les bases de donnees NoSQL, leurs grandes familles et les cas d'usage dans lesquels elles sont pertinentes.

## Prerequis

- connaitre les bases des SGBD relationnels ;
- comprendre ce qu'est une table SQL ;
- savoir qu'un compromis technique depend du contexte.

## Plan du chapitre

1. definition et origine du NoSQL
2. quatre grandes familles
3. scalabilite et compromis ACID/BASE
4. comparaison SQL vs NoSQL
5. denormalisation et bonnes pratiques

## Qu'est-ce que le NoSQL

NoSQL signifie souvent `Not Only SQL`.

L'idee n'est pas de remplacer totalement le SQL, mais de proposer d'autres manieres de stocker et de manipuler les donnees quand le modele relationnel n'est pas le plus adapte.

Les bases NoSQL sont souvent choisies quand :

- les volumes de donnees sont tres importants ;
- la structure des donnees change souvent ;
- on cherche une forte capacite de repartition sur plusieurs serveurs ;
- les performances en lecture ou en ecriture priment sur les relations complexes.

## Pourquoi le NoSQL est apparu

Les bases relationnelles sont excellentes pour :

- les donnees bien structurees ;
- les relations fortes entre entites ;
- les transactions fiables ;
- les requetes SQL riches.

Mais certains systemes modernes doivent aussi gerer :

- des masses de donnees tres grandes ;
- des structures heterogenes ;
- des besoins de distribution horizontale ;
- des ecritures tres frequentes.

Le NoSQL repond souvent a ces besoins.

## Les quatre grandes familles de bases NoSQL

## 1. Cle-valeur

Dans ce modele, chaque information est stockee sous la forme :

- une cle unique ;
- une valeur associee.

Exemples :

- Redis ;
- Amazon DynamoDB dans certains usages ;
- Memcached pour le cache.

### Points forts

- tres rapide ;
- simple a utiliser ;
- tres efficace pour le cache ou les sessions.

### Limites

- peu de relations ;
- requetes plus limitees ;
- structure parfois tres applicative.

## 2. Document

Les donnees sont stockees sous forme de documents, souvent en JSON ou BSON.

Exemples :

- MongoDB ;
- Couchbase ;
- Firestore.

### Points forts

- structure souple ;
- facile a faire evoluer ;
- tres pratique pour des objets applicatifs proches du JSON.

### Limites

- les jointures sont moins naturelles que dans le relationnel ;
- il faut bien penser la denormalisation ;
- certaines coherences sont deplacees vers l'application.

## 3. Colonne ou wide-column

Ces bases organisent les donnees de facon optimisee pour certains gros volumes et certaines lectures analytiques.

Exemples :

- Cassandra ;
- HBase.

### Points forts

- bonne repartition sur plusieurs serveurs ;
- adaptees aux tres gros volumes ;
- efficaces pour certains usages analytiques ou chronologiques.

### Limites

- modelisation moins intuitive ;
- moins souples pour des relations metier riches ;
- requetes souvent moins expressives que SQL.

## 4. Graphe

Les donnees sont modelisees sous forme de :

- noeuds ;
- relations ;
- proprietes.

Exemples :

- Neo4j ;
- Dgraph ;
- Amazon Neptune.

### Points forts

- tres bien adaptees aux reseaux de relations ;
- excellentes pour les parcours de liens ;
- pertinentes pour recommandation, fraude ou reseaux sociaux.

### Limites

- moins pertinentes pour des usages simples ;
- ecosysteme parfois plus specialise.

## NoSQL et scalabilite

On associe souvent le NoSQL a la scalabilite horizontale, c'est-a-dire la capacite a repartir les donnees et la charge sur plusieurs machines.

Cette approche peut permettre :

- de monter en charge plus facilement ;
- de mieux encaisser certains pics de trafic ;
- d'assurer une meilleure disponibilite globale.

## ACID, BASE et compromis

Les SGBD relationnels mettent souvent en avant ACID. Les systemes NoSQL s'appuient parfois davantage sur des compromis autour de la disponibilite et de la repartition.

On cite souvent le principe BASE :

- `Basically Available` ;
- `Soft State` ;
- `Eventually Consistent`.

L'idee generale est la suivante :

- le systeme privilegie souvent la disponibilite ;
- l'etat peut etre transitoirement non parfaitement synchronise ;
- la coherence peut devenir eventuale plutot qu'immediate.

Attention : cela ne veut pas dire que toutes les bases NoSQL fonctionnent pareil. Chaque technologie a ses propres garanties.

## SQL ou NoSQL ?

Il ne faut pas opposer systematiquement les deux mondes.

Le SQL reste excellent quand :

- les donnees sont tres structurees ;
- les relations sont importantes ;
- on a besoin de transactions fortes ;
- les contraintes metier doivent etre bien encadrees.

Le NoSQL devient souvent interessant quand :

- les structures sont tres variables ;
- l'application manipule des documents proches du JSON ;
- la repartition de la charge est centrale ;
- la performance sur certains acces simples est prioritaire.

En pratique, beaucoup de systemes melangent plusieurs outils.

Exemple classique :

- PostgreSQL pour les donnees metier centrales ;
- Redis pour le cache ;
- Elasticsearch ou Meilisearch pour la recherche textuelle ;
- MongoDB pour certains documents applicatifs.

## D'un schema SQL vers un modele document

Dans une base relationnelle, on normalise souvent les donnees et on les relie avec des jointures.

Dans une base document, on peut parfois denormaliser en integrant dans un meme document des informations souvent lues ensemble.

### Exemple simple

Modele relationnel :

- `users` ;
- `addresses` ;
- relation entre les deux.

Modele document possible :

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "address": {
    "street": "10 rue Victor Hugo",
    "city": "Lyon",
    "country": "FR"
  }
}
```

Ce choix est interessant si l'adresse est presque toujours lue avec l'utilisateur et rarement partagee entre plusieurs entites.

## Quand denormaliser

La denormalisation peut etre utile si :

- plusieurs informations sont presque toujours consultees ensemble ;
- les mises a jour sont peu frequentes ;
- on veut eviter des parcours trop couteux.

Elle devient plus delicate si :

- la meme information est repetee a beaucoup d'endroits ;
- elle change souvent ;
- la coherence entre copies devient difficile a tenir.

## MongoDB comme porte d'entree au NoSQL document

MongoDB est souvent utilise pour decouvrir le NoSQL document.

On y retrouve des notions comme :

- base de donnees ;
- collection ;
- document ;
- champ ;
- index.

Le format des documents est proche du JSON, ce qui le rend assez accessible pour les developpeurs web.

## Bonnes pratiques avec le NoSQL

- partir des cas d'usage reels et non de la mode ;
- choisir le modele en fonction des acces les plus frequents ;
- accepter que le schema soit souple, sans le laisser devenir chaotique ;
- documenter la structure attendue ;
- penser aux index et aux volumes des le depart.

## A retenir

- NoSQL signifie surtout qu'il existe d'autres modeles que le relationnel ;
- les grandes familles sont cle-valeur, document, colonne et graphe ;
- le NoSQL est utile pour certains besoins de flexibilite et de scalabilite ;
- il ne remplace pas toujours le SQL ;
- le bon choix depend des donnees, des acces et des contraintes du projet.

## Mini-exercices corriges

### Exercice 1

Question : cite deux cas ou une base cle-valeur est pertinente.

Correction : gestion de sessions utilisateurs et mise en cache de resultats frequents.

### Exercice 2

Question : pourquoi denormaliser un modele document peut-il aider les performances ?

Correction : parce qu'on peut lire en une fois des donnees souvent consultees ensemble, sans jointure relationnelle couteuse.

### Exercice 3

Question : le NoSQL remplace-t-il toujours le SQL ?

Correction : non. Le SQL reste souvent preferable pour les donnees fortement relationnelles et les transactions strictes.
