# Bases de donnees - introduction au SGBD

## Objectifs du chapitre

Dans ce cours, on cherche a comprendre :

- ce qu'est une base de donnees ;
- ce qu'est un SGBD ;
- la difference entre SI, BDD et SGBD ;
- pourquoi on modele les donnees avant de coder ;
- a quoi servent le MCD, le MLD et le MPD.

## Prerequis

- savoir ce qu'est une application informatique ;
- connaitre les notions de tableur ou de fichier de donnees ;
- aucune maitrise SQL n'est necessaire.

## Plan du chapitre

1. SI, BDD et SGBD
2. familles de bases de donnees
3. ACID et fiabilite
4. modelisation : MCD, MLD, MPD
5. normalisation et bonnes pratiques

## Systeme d'information, base de donnees et SGBD

Ces trois notions sont liees, mais elles ne designent pas la meme chose.

### Le systeme d'information

Le systeme d'information, ou SI, regroupe l'ensemble des moyens humains, organisationnels et techniques permettant de collecter, traiter, stocker et diffuser l'information dans une organisation.

Un SI comprend par exemple :

- des personnes ;
- des procedures ;
- des ordinateurs et des reseaux ;
- des logiciels metier ;
- des bases de donnees.

Le SI est donc plus large que l'informatique seule. Il sert a faire circuler l'information utile au fonctionnement d'une entreprise, d'une association, d'une administration ou d'une application.

### La base de donnees

Une base de donnees, ou BDD, est un ensemble organise de donnees stockees de facon a pouvoir etre retrouvees, modifiees et exploitees efficacement.

Une BDD permet notamment de :

- stocker des informations de maniere durable ;
- eviter la multiplication de fichiers disperses ;
- partager une meme source d'information entre plusieurs utilisateurs ou applications ;
- garantir une meilleure coherence des donnees.

Exemples de donnees stockees dans une BDD :

- des utilisateurs ;
- des produits ;
- des commandes ;
- des messages ;
- des reservations ;
- des historiques de paiement.

### Le SGBD

Un SGBD est un systeme de gestion de base de donnees. C'est le logiciel qui permet de creer, administrer, interroger et securiser une base de donnees.

Il prend en charge des fonctions essentielles :

- creation des bases et des tables ;
- lecture et ecriture des donnees ;
- gestion des acces utilisateurs ;
- securite ;
- sauvegarde et restauration ;
- gestion des performances ;
- gestion de la concurrence entre plusieurs utilisateurs.

Exemples de SGBD connus :

- MySQL ;
- PostgreSQL ;
- MariaDB ;
- SQLite ;
- Oracle Database ;
- SQL Server.

## Comment ces notions s'articulent

On peut resumer ainsi :

- le SI organise l'information globale ;
- la BDD contient les donnees ;
- le SGBD permet de manipuler et d'administrer cette BDD.

Exemple :

- une entreprise possede un SI ;
- ce SI contient une application de gestion commerciale ;
- cette application s'appuie sur une base de donnees ;
- la base est geree par un SGBD comme PostgreSQL ou MySQL.

## Pourquoi utiliser une base de donnees

Une base de donnees devient utile des qu'il faut manipuler des donnees nombreuses, reliees entre elles, partagees par plusieurs utilisateurs ou modifiees regulierement.

Ses avantages principaux sont :

- centraliser l'information ;
- eviter les doublons ;
- retrouver rapidement les donnees ;
- conserver un historique fiable ;
- mieux proteger les acces ;
- faire respecter des regles metier.

## Les grandes familles de bases de donnees

Il existe plusieurs manieres de stocker les donnees. Les deux grandes familles a connaitre sont :

- les bases relationnelles ;
- les bases non relationnelles, souvent appelees NoSQL.

### Les bases relationnelles

Dans une base relationnelle, les donnees sont organisees en tables composees de lignes et de colonnes.

Chaque table represente une entite, par exemple :

- `users` ;
- `products` ;
- `orders`.

Les relations entre tables sont gerees a l'aide de cles primaires et de cles etrangeres.

### Les bases NoSQL

Les bases NoSQL proposent d'autres modes de stockage :

- cle-valeur ;
- document ;
- colonne ;
- graphe.

Elles sont souvent choisies quand :

- les volumes de donnees sont tres importants ;
- la structure des donnees evolue souvent ;
- les besoins de distribution sur plusieurs serveurs sont forts.

## Integrite et fiabilite : le principe ACID

Les SGBD relationnels sont generalement associes aux proprietes ACID, qui assurent des transactions fiables.

### Atomicite

Une transaction est executee entierement ou pas du tout.

### Coherence

Une transaction ne doit pas laisser la base dans un etat invalide.

### Isolation

Des transactions simultanees ne doivent pas se perturber mutuellement.

### Durabilite

Une transaction validee reste enregistree, meme en cas de panne.

Exemple simple :

si un virement bancaire retire 100 euros d'un compte pour les ajouter a un autre, les deux operations doivent reussir ensemble. On ne veut jamais debiter un compte sans crediter l'autre.

## Pourquoi modeliser les donnees avant de creer la base

Avant d'ecrire du SQL, il faut reflechir a la structure des donnees.

Modeliser permet de :

- identifier les entites importantes ;
- lister leurs attributs ;
- comprendre les relations entre elles ;
- limiter les doublons ;
- anticiper les contraintes metier.

Sans modelisation, on risque de creer une base difficile a maintenir, lente ou incoherente.

## Le MCD : modele conceptuel de donnees

Le MCD est une representation fonctionnelle et metier des donnees. Il sert a decrire le probleme sans entrer tout de suite dans les details techniques du SGBD.

Le MCD repond surtout a ces questions :

- quelles sont les entites du systeme ;
- quelles informations doit-on memoriser sur elles ;
- quelles relations existent entre elles ;
- quelles sont les cardinalites de ces relations.

### Elements essentiels du MCD

#### Les entites

Une entite represente un objet ou une notion du domaine.

Exemples :

- Client ;
- Produit ;
- Commande.

#### Les attributs

Les attributs decrivent une entite.

Exemple pour `Client` :

- id_client ;
- nom ;
- email ;
- telephone.

#### Les associations

Une association exprime un lien entre plusieurs entites.

Exemple :

- un client passe une commande ;
- une commande contient des produits.

#### Les cardinalites

Les cardinalites indiquent combien de fois une entite peut etre liee a une autre.

Exemples :

- un client peut passer 0 a n commandes ;
- une commande est passee par 1 et un seul client.

## Le MLD : modele logique de donnees

Le MLD est la traduction du MCD dans un modele exploitable par un SGBD relationnel.

Ici, on commence a penser en termes de :

- tables ;
- colonnes ;
- cles primaires ;
- cles etrangeres.

Exemple :

- l'entite `Client` devient une table `clients` ;
- l'entite `Commande` devient une table `commandes` ;
- la relation entre elles devient une cle etrangere dans `commandes`.

### Regles classiques de passage du MCD au MLD

#### Une entite devient une table

Chaque entite du MCD devient generalement une table.

#### L'identifiant devient la cle primaire

La cle primaire identifie de maniere unique chaque ligne d'une table.

#### Une relation 1,N devient une cle etrangere

Si un client peut avoir plusieurs commandes, alors la table `commandes` contiendra une cle etrangere pointant vers `clients`.

#### Une relation N,N devient souvent une table d'association

Exemple : une commande contient plusieurs produits, et un produit peut apparaitre dans plusieurs commandes. On cree alors une table intermediaire, par exemple `commande_produit`.

## Le MPD : modele physique de donnees

Le MPD correspond a l'implementation concrete dans un SGBD donne.

On y precise par exemple :

- les types de donnees exacts ;
- les contraintes SQL ;
- les index ;
- les noms reels des tables et colonnes ;
- les choix specifiques au SGBD utilise.

Le passage du MCD au MPD se fait donc en deux temps :

1. MCD : vision metier ;
2. MLD : traduction relationnelle ;
3. MPD : implementation technique.

## La normalisation

La normalisation vise a organiser les donnees pour :

- limiter la redondance ;
- eviter les incoherences ;
- faciliter les mises a jour.

### Premiere forme normale

Chaque champ contient une valeur simple et non une liste.

Mauvais exemple :

- une colonne `telephones` qui contient `06..., 07...`.

Meilleur choix :

- une table `telephones` reliee a `clients`.

### Deuxieme forme normale

Chaque attribut non cle doit dependre de toute la cle primaire.

### Troisieme forme normale

Un attribut non cle ne doit pas dependre d'un autre attribut non cle.

Exemple :

- si une table stocke `code_postal` et `ville`, il faut verifier si la ville depend en realite du code postal et merite une structure plus propre selon le contexte.

## Bonnes pratiques de modelisation

- choisir des noms clairs et coherents ;
- eviter les colonnes fourre-tout ;
- definir un identifiant stable pour chaque table ;
- separer les donnees qui evoluent independamment ;
- penser aux cas d'usage avant de creer les relations ;
- rester simple au debut, puis enrichir si necessaire.

## Exemple de raisonnement complet

Prenons une application de location de logements.

On identifie notamment :

- un utilisateur ;
- un logement ;
- une reservation.

On peut alors raisonner ainsi :

- un utilisateur peut creer plusieurs logements ;
- un logement peut recevoir plusieurs reservations ;
- une reservation concerne un seul logement et un seul utilisateur.

Cela conduira souvent a des tables du type :

- `users` ;
- `rooms` ;
- `bookings`.

## A retenir

- le SI designe l'organisation globale de l'information ;
- la BDD contient les donnees ;
- le SGBD est le logiciel qui pilote la base ;
- les SGBD relationnels reposent sur des transactions fiables, souvent resumees par ACID ;
- le MCD, le MLD et le MPD servent a concevoir une base avant son implementation ;
- une bonne modelisation permet d'eviter beaucoup d'erreurs plus tard.

## Pour aller plus loin

- Oracle : definition d'un SGBD
- Merise : MCD, MLD, MPD
- SQL.sh et OpenClassrooms pour la pratique SQL

## Mini-exercices corriges

### Exercice 1

Question : explique la difference entre SI, BDD et SGBD en une phrase chacun.

Correction :

- SI : ensemble humain et technique qui fait circuler l'information ;
- BDD : stockage organise des donnees ;
- SGBD : logiciel qui cree, lit, modifie et administre la BDD.

### Exercice 2

Question : pourquoi modeliser avant de coder une base ?

Correction : pour identifier clairement les entites, les relations et les contraintes, afin d'eviter les doublons et les incoherences plus tard.

### Exercice 3

Question : donne un exemple de relation N,N et sa traduction relationnelle.

Correction : `commande` et `produit` sont en N,N ; on cree une table d'association comme `commande_produit` contenant les cles etrangeres.
