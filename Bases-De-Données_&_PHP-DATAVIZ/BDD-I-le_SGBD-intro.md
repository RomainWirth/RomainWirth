# Bases De Données - Le SGBD

## INTRODUCTION

### Qu'est ce qu'un SGBD ?

SGBD = Système de Gestion de Base de Données.<br>
C'est un logiciel qui permet à un ordinateur de stocker, récupérer, ajouter, supprimer et modifier des données.<br>
Le SGBD gère tous les aspects primaires d'une BDD, y compris la gestion de la manipulation des données,<br> 
comme l'authentification des utilisateurs, ainsi que l'insertion ou l'extraction des données.<br> 
Un SGBD définit la structure dans laquelle les données sont stockées : **le schéma de données**.

Au quotidien, beaucoup d'outils nécessitent un SGDB :<br> 
les distributeurs de billets de banque, les systèmes de réservation de vols, d'inventaires au détail ou encore les catalogues de bibliothèques.

#### Qu'est ce que le SGDB gère ?

Il gère trois choses importantes : 
* les données
* le moteur de BDD qui permet d'accéder aux données, de les verrouiller et de les modifier
* le schéma de BDD qui définit la structure logique de la base de données.

Ces trois éléments contribuent à assurer la concomitance (simultanéité), la sécurité, l'intégrité des données et l'uniformité des procédures administratives.<br>

Tâches typiques d'administration de BDD prises en charges par le SGBD :
* gestion des changements
* surveillance/réglage des performances
* sauvegarde et restauration

#### pour aller plus loin : 

Le SGBD est utile pour fournir une vue centralisée des données d'une manière contrôlée, pour plusieurs utilisateurs et à partir de plusieurs endroits.<br>
Il peut aussi limiter les données que l'utilisateur final voit, la manière dont il peut les visualiser, tout en fournissant plusieurs vues d'un même schéma de BDD.<br>
La SGBD traite toutes les demandes, permettant aux utilisateurs finaux et aux logiciels de ne pas avoir à se soucier d'où se situent physiquement les données, ni leur type de support de stockage.

source : https://www.oracle.com/fr/database/systeme-gestion-base-de-donnees-sgbd-definition.html


### Le Système d'Information

Le SI est un ensemble de ressources et de dispositifs permettant de collecter, stocker, traiter et diffuser les informations nécessaires au fonctionnement d'une organisation, en général grâce à un réseau d'ordinateurs.<br>

_NB. : à ne pas confondre avec un système informatique, qui est un sous-ensemble du système d'information._ <br>

C'est un système composé de deux éléments : 

* un système social : composé de la structure organisationnelle et des personnes liées au SI.
* un système technique : composé des technologies* et des processus d'affaires concernés par le SI.

*(hardware [= matériel informatique],<br> 
software [= ensemble de moyens d'utilisation, programmes, procédures et documentation d'un système informatique],<br> 
et équipements de télécommunication).<br>

Le SI a un rôle central dans le fonctionnement de l'entreprise: <br>
Il permet d'améliorer l'**efficacité du fonctionnement interne** de l'entreprise.<br>
Grâce au système d'information, ls informations circulent simplement au sein de l'entreprise.<br>
Le SI peut permettre de : 

* améliorer la communication entre les différentes équipes de l'entreprise.
* supprimer les tâches répétitives.
* optimiser la coordination des tâches au sein de l'entreprise.

Il est aussi un élément important dans la **communication externe** de l'entreprise.<br>
Notamment avec les partenaires externes, tels que les banques, les fournisseurs, les administrations, qui ont un tôle important dans la vie de l'entreprise.<br>
Quand le SI est performant, il améliore la communication entre les différents acteurs.

Le SI permet de **faciliter la prise de décision**.<br> 
Il donne au décideur toutes les données nécessaires pour prendre une décision.

### La Base de Données (BDD) 

la Base de Données (DataBase en anglais) regroupe un ensemble d'informations,<br> organisé pour être accessible, géré et mis à jour facilement par ses utilisateurs.<br>
Les données sont organisées en lignes, colonnes et tableaux, indexées pour faciliter les recherches.<br>
Les entreprises utilisent les BDD pour stocker, gérer et récupérer des informations.

Une BDD est exploitée pour rechercher des données qui ont été collectées.<br>
Les BDD se retrouvent sur des serveurs et peuvent être déplacées à tout moment.<br>
On les utilise dans tous les secteurs : hopitaux, gouvernement, compagnies aériennes, assirances, streaming, etc.<br>

L'administrateur de la BDD doit réguler les accès des utilisateurs pour contrôler leurs actions et leurs usages.<br>
Les transactions de la BDD doivent répondre aux exigences de la conformité ACID :
* principe d'**Atomicité** : la transaction est exécutée dans de bonnes condictions.
* la propriété de **Cohérence** : Seules les données répondant aux règles prédéfinies peuvent être inscrites dans la BDD.
* l'**Isolement** : plusieurs transactions peuvent être traitées simultanément de manière indépendante.
* la **Durabilité** : les défaillances doivent être invisibles pour l'utilisateur final.

Il existe plusieurs types de bases de données. les premières BDD réseau et hiérarchiques sont apparues dans les années 60.<br>
Les BDD orientées objets remontent aux années 80.<br>
Les BDD SQL, NoSQL et les BDD cloud sont plus récentes et sont aujourd'hui les plus utilisées.<br>

### En résumé 

Le SGBD (Système de Gestion de Base de Données) est un logiciel qui permet à un ordinateur de stocker, récupérer, ajouter, supprimer et modifier des données.<br>
Le SI (Système d'Information) est un réseau (en général informatique) qui permet de collecter, stocker, traiter et diffuser les informations nécessaires au fonctionnement d'une organisation.<br>
La BDD (Base De Données) désigne un ensemble d'informations stockées de manière ordonnée et sans redondance que l'on met à la disposition des utilisateurs d'un réseau.

**VULGAIREMENT :**

**Le SI est le réseau permettant de traiter l'information, le SGBD est l'outil de traitement et la BDD est la donnée collectée et stockée**

## Schématiser avec les MCD et MLD

### LE MCD : Modèle Conceptuel de Données

source : https://web.maths.unsw.edu.au/~lafaye/CCM/merise/mcd.htm 
source : https://grafikart.fr/tutoriels/sql-mcd-mld-1989 

#### Qu'est-ce que le MCD ?

le **schéma conceptuel de données** (ou modèle conceptuel de données) est un <u>outil de la méthode Merise</u>, développée dans les années 1970 dans le contexte d'informatisation des systèmes des entreprises.<br>
Il s'agit d'une étape analytique dans le processus de dévelopement d'un projet informatique de type construction de base de données.

Le schéma conceptuel modélise la problématique à traiter lors de la réalisation d'un SI (système d'information),<br> 
et sert de base de travail pour le MLD (Modèle Logique de Données)<br>

**Concrètement, le MCD est une représentation graphique claire des données du système d'information à concenvoir, ou figurent les relations entre les données.**<br>

Le MCD n'utilise pas le langage informatique et est facilement compréhensible.<br>
Il constitue un outil préalable à un projet informatique.<br> 
Il a pour but d'écrire de manière formelle les données qui seront utilisées par le système d'information.<br>

#### Comment le représenter ?

Pour réaliser un MCD, on va utiliser un logiciel dédié (type logiciel de dessin) :<br> 
par exemple draw.io (= https://app.diagrams.net/ ) ou https://whimsical.com/ <br>

On va d'abord définir les règles de gestion du besoin à informatiser (par exemple, un client avec un numéro et une adresse email afin d'émettre un devis pour ce client).<br>
On va ensuite recenser toutes les données à informatiser dans un dictionnaire de données.<br>
On va par la suite comprendre les relations et dépendances entre les données.<br>
Enfin, on va pouvoir construire le MCD.

Les informations sont représentées logiquement en utilisant un ensemble de règles et de diagrammes codifiés : 

* les **entités** :<br> 
<u>c'est la représentation d'un élément matériel ou immatériel ayant un rôle dans le système que l'on souhaite décrire.</u><br>
On appelle classe d'entité un ensemble composé d'entités de même type (dont la définition est la même).<br>
Le classement des entités au sein d'une classe s'appelle _classification_. Une entité est une _instanciation_ de la classe.<br>
Chaque entité est composée de **propriétés** (données élémentaires permettant de la décrire, elles contiennent les données qui composent les entités).<br>
Les entités et classes d'entité sont représentées par un rectangle séparé en deux champs: champ du haut contient le libellé et champ du bas contient la liste des propriétés<br> 

* les **relations et classes de relations** :<br>
Elles représentent et expliquent précisément les liens sémantiques qui peuvent exister entre plusieurs entités.<br>
Une classe de relations contient toutes les relations de même type (qui relient toutes les entités appartenant à des mêmes classes d'entité).<br>
Les classes de relations sont représentées par des hexagones (parfois ellipses ou rectangles avec des coins arrondis).<br> 
Leur intitulé décrit le type de relation qui relie les classes d'entité (généralement un verbe).<br>
Dénominations des classes de relation selon le nombre d'intervenants :<br>
    - Une classe de relation **récursive** relie la même classe d'entité
    - Une classe de relation **binaire** relie deux classes d'entités
    - Une classe de relation **ternaire** relie trois classes d'entités
    - Une classe de relation **n-aire** relie n classes d'entités<br>

```
Les bonnes pratiques dans le schéma entités associations

- Normalisation des entités : toutes les entités qui sont remplaçables par une association doivent être remplacées.
- Normalisation des noms : le nom d'une entité, d'une association ou d'un attribut doit être unique.
    => pour les entités, utiliser un nom commun usuel (ex: clients).
    => pour les associations, utiliser un verbe à l'infinitif (ex: effectuer, concerner) à la forme passive (être commandé) et accompagné d'un adverbe (avoir lieu dans, pendant, à).
    => pour les attributs, utiliser un nom commun singulier (ex: nom, numéro, libellé, description), accompagné du nom de l'entité ou de l'association dans laquelle il se trouve.
- Normalisation des identifiants : chaque entité doit posséder un identifiant.
    => éviter les identifiants composés de plusieurs attributs (un identifiant formé par les attributs nom et prénom), car c'est mauvais pour les performances et l'unicité supposée par une telle démarche finit tôt ou tard par être démentie. 
    => préférer un id court pour rendre la recherche la plus rapide possible (éviter une chaîne de caractères type n° de plaque d'immatriculation, n° de sécurité sociale ou code postal).
    => éviter les id susceptibles de changer au court du temps (n° plaque immatriculation ou n° sécu sociale provisoire).
- Normalisation des attributs : remplacer les attributs en plusieurs exemplaires par une association supplémentaire de cardinalités maximales n et ne pas ajouter d'attribut calculable à partir d'autres attributs.
    => On va créer une entité avec une liaison supplémentaire : ex, un utilisateur possède un numéro de téléphone fixe et portable, et il possède une adresse postale principale et secondaire. Dans chaque cas, on crée un entité numéro de téléphone avec deux attributs (fixe et portable) et une entité adresse. Chaque entité est reliée à l'entité utilisateur par une liaison.
    => Certains attributs peuvent être remplacés par des calculs et il ne sera pas nécessaire de multiplier les champs.
- Normalisation des attributs des associations : les attributs d'une association doivent dépendre directement des identifiants de toutes les entités en association. Cela signifie que les attributs de la liaison doivent dépendre aux autres entités auquelles elles sont associées. 
- Normalisation des associations : il faut éliminer les associations fantômes. Si on se retrouve sur une association de type 1,1 (voir les cardinalités), on va fusionner les choses.
- Normalisation des cardinalités : une cardinalité minimale est toujours 0 ou 1 (et pas 2, 3 ou n) et une cardinalité maximale est toujours 1 ou n (et pas 2, 3, ...). 
    => Cela veut dire que si une cardinalité maximale vaut 2, 3 ou plus, on va quand même considérer qu'elle est indéterminée et vaut n, car si on connaitn au moment de sa conception, il se peut que sa valeur évolue au cours du temps. Donc on la considère comme inconnue dès le départ.
    => Cela signifie aussi qu'on ne modélise pas les cardialités minimales qui valent plus de 1 car ce genre de valeur peut aussi évoluer. 
    (=> Dans un SGBDR, on pourrait assurer les cardinalités valant 2, 3 ou plus via l'utilisation de déclencheurs.)
```

* les **cardinalités** :<br>
Elles permettent de caractériser le lien qui existe entre une entité et la relation à laquelle elle est reliée.<br>
La cardinalité d'une relation est composée d'un couple comportant une borne maximale et une borne minimale,<br> 
<u>_**la cardinalité représente le nombre de fois qu'une liaison peut être faite dans un sens ou dans l'autre<br>
Une relation pouvant aller dans deux sens la liaison aura deux branches.**_</u><br>
<u>exemple de notation de cardinalité :</u><br> 
un user peut ne pas créer de contenu (0) ou en créer plusieurs (n), la cardinalité sera donc notée : 0,n<br> 
et un contenu peut être créé par 1 seul utilisateur et au maximum 1, la cardinalité sera donc notée : 1,1.<br>
Intervalle dans lequel la cardinalité d'une entité peut prendre sa valeur :<br>
    - la borne minimale (généralement 0 ou 1) décrit le nombre minimum de fois qu'une entité peut participer à une relation.
    - la borne maximale (généralement 1 ou n) décrit le nombre maximum de fois qu'une entité peut participer à une relation.<br>
    <br>
    Une cardinalité 1.N signifie que chaque entité appartenant à une classe d'entité participe au moins une fois à la relation<br> 
    et une cadrinalité 0.N signifie que chaque entité appartenant à une classe d'entité ne participe pas forcément à la relation.

* Les **identifiants** :<br>
Un identifiant est un ensemble de propriétés permettant de désigner une et une seule entité.<br> 
_L'identifiant est une propriété particulière d'une objet telle qu'il n'existe pas deux occurences de cet objet pour lesquelles cette propriété pourrait prendre la même valeur._

* **Agrégation** (ou identification relative) :<br>
L'agrégation permet de spécifier qu'une entité est nécessaire pour identifier une autre.
    - la classe d'entité permettant d'identifier est appelée _classe d'entité agrégeante_
    - la classe d'entité identifiée est appelée _classe d'entité agrégée_

```
Les formes normales :

- Première forme normale : à un instant donné dans une entité, pour un individu, 
un attribut ne peut prendre qu'une valeur et non pas un ensemble ou une liste de valeurs.
    => Si un attribut prend plusieurs valeurs, alors ces valeurs doivent faire l'objet d'une entité supplémentaire,
    en association avec la première.

- Deuxième forme normale : L'identifiant peut être composé de plusieurs attributs mais les autres attributs de l'entité doivent dépendre de l'identifiant en entier 
(et non pas une partie de cet identifiant).
    => Cette deuxième forme normale est rendue obsolète par la règle de normalisation des attributs des associations.

- Troisième forme normale de Boyce-Codd : tous les attributs d'une entité doivent dépendre directement de son identifiant et d'aucun autre attribut. 
Si ce n'est pas le cas, il faut placer l'attribut pathologique dans une entité séparée, mais en association avec la première.
```

_**Le MPD : Modèle Physique de Données**_<br>
_C'est un outil de conception de BDD qui permet de définir la mise en oeuvre de structures physiques et de requêtes portant sur les données.<br>
Selon le type de BDD qu'on souhaite concevoir, on sera amené à utiliser des types de diagrammes différents dans le MPD._

### Le MLD : Modèle Logique de Données

**Définition de MLD (Merise) :<br>
Un MLD est une représentation de la base de données à informatiser consécutive au travail d'analyse MCD et MPD.<br> 
_MLD prend parfois un R et devient MLDR (ou MLD-R), R signifiant Relationnel._**

Il s'agit de la représentation textuelle du MCD. C'est une étape de la méthodologie Merise.<br>
Elle permet d'implémenter la BDD en transcrivant le MCD en instructions SQL adaptées au SGBDR (Système de Gestion de Base de Données Relationnelles) prévu.<br>
Concrètement, le MLD permet de connaîre le nombre de tables ainsi que leurs contraintes (liaisons entre tables) à mettre en oeuvre dans une BDD relationelle. 

#### Comment réaliser le MLD ?

On représente les données issues de la modélisation Merise ainsi : 

* Chaque ligne représente une **table**
* On écrit toujours le nom de la table en premier
* Les **champs** sont listés entre parenthèses et séparés par des virgules
* Les **clés primaires** sont soulignées et placées au début de la liste des champs
* Les **clés étrangères** sont préfixées par une dièse

### Passer du MCD au MLD 

#### Règle numéro 1 :

**a. Une entité du MCD devient une table :**

Dans un SGBD de type relationnel, une table est une structure tabulaire dont chaque ligne correspond aux données d'un objet enregistré,<br>
et chaque colonne correspond à une propriété de cet objet.<br>
Une table contiendra donc un ensemble d'enregistrements.<br>
Une ligne correspond à un enregistrement.<br>
Une colonne correspond à un champ.<br>

**b. Son identifiant devient la clé primaire de la relation**

La clé primaire permet d'identifier de façon unique un enregistrement dans la table.<br>
Les valeurs de la clé primaire sont donc uniques.<br>
Les valeurs de la clé primaire sont obligatoirement non nulles.<br>
Dans la plupart des SGBDR, définir une clé primaire donne lieu automatiquement à la création d'un index.<br>
L'index est un fichier interne au SGBD. L'utilisateur standard n'a pas besoind d'y accéder.<br> 
L'index a pour but d'accélérer les traitements de recherche, de tri, de filtre notamment sur les tables avec de nombreux enregistrements.<br>
L'index nécessite de l'espace mémoire et du temps d'insertion, de suppression d'enregistrement plus importants car il faut mettre à jour à la fois la table et l'index.

#### Règle numéro 2 :

Une association de type 1:N (c-à-d qui a des cardinalités maximales positionnées à "1" d'un côté de l'association et à "n" de l'autre côté)<br> 
se traduit par la création d'une clé étrangère dans la relation correspondante à l'entité côté "1".<br>
Une clé étrangère référence la clé primaire de la relation correpondante à l'autre entité.

#### Règle numéro 3 :

Une association de type N:N (c-à-d qui a les cardinalités maximales positionnées à "N" des 2 côtés de l'association)<br>
se traduit par la création d'une table intermédiaire dont la clé primaire est composée des clés étrangères référençant les relations correspondant aux entités liées par l'association.<br>
Les éventuelles propriétés de l'association deviennent des attributs de la relation.<br>

#### Règle numéro 4 :

Une association de type 1:1 se traduit par une association binaire de type 1:n sauf que la clé étrangère se voit imposer une contrainte d'unicité en plus d'une éventuelle contrainte de non vacuité<br> 
(cette contrainte impose à la colonne correspondante de ne prendre que des valeurs distinctes).<br>

Si les associations fantômes ont été éliminées, il devrait y avoir au moins un côté de cardinalité 0,1.<br>
C'est alors dans la table du côté opposé que doit aller la clé étrangère.<br>
Si les deux côtés sont de cardinalité 0,1 alors la clé étrangère peut être placée indifféremment dans l'une des deux tables.
