# MISE EN PRODUCTION D'UNE APPLICATION

## QU'EST CE QUE LE SSH ?

Le Secure Shell Protocol (SSH) est un protocole de réseau cryptographique permettant d'exploiter des services réseau en toute sécurité sur un réseau non sécurisé.<br>
Les applications les plus notables sont la connexion a distance (login) et l'exécution en ligne de commande.<br>

Les applications SSH sont basées sur une architecture client-serveur, connectant une instance de client SSH avec un serveur SSH.<br>
SSH opère en tant que suite de protocole en couches comprenant trois composants hiérarchiques :
* la couche de transport : assure l'authentification, la confidentialité et l'intégrité du serveur.
* le protocole d'authentification de l'utilisateur : valide l'utilisateur auprès du serveur.
* le protocole de connection : multiplexe le tunnel chiffré (envoie simultanément en plusieurs flux d'informations (ou signaux) sur une même liaison de communication sous forme d'un signal unique et complexe) en plusieurs canaux de communication logiques.

SSH a été designé sur des systèmes d'environnement Unix, en remplacement de **Telnet** (<a href="https://en.wikipedia.org/wiki/Telnet">Teletype Network</a>)<br>
et pour les protocoles shell Unix distants non sécurisés tels que le Berkeley **Remote Shell** (<a href="https://en.wikipedia.org/wiki/Remote_Shell">rsh</a>)<br>
et les protocoles <a href="https://en.wikipedia.org/wiki/Berkeley_r-commands">rlogin et rexec</a> associés qui utilisent des tokens d'authentification non sécurisés en texte clair (plaintext).

Le protole SSH existe en 2 versions majeures : version 1.0 et version 2.0.<br>


## Les différents mode d'utilisation du SSH 

L'authentification peut se faire sans l'utilisation de mot de passe ou de phrase secrète en utilisant la <a href="https://fr.wikipedia.org/wiki/Cryptographie_asym%C3%A9trique">cryptographie asymétrique</a>.<br>
La cryptographie asymétrique (ou cryptographie à clé publique) permet d'assurer la confidentialité d'une communication ou d'authentifier les participants,<br> 
sans que cela repose sur une donnée secrète partagée entre ceux-ci, au contraire d'une cryptographie symétrique qui nécessite ce secret partagé au préalable.<br>

La clé publique est distribuée sur les systèmes auxquels on souhaite se connecter.<br> 
La clé privée, qu'on protège par un mot de passe, reste uniquement sur le poste à partir duquel on se connecte.<br>
L'utilisation d'un "agent ssh" permet de stocker le mot de passe de la clé privée pendant la durée de la session utilisateur.<br>

Cette configuration profite aussi à SCP et SFTP qui se connectent au même serveur SSH.

**Pincipe de fonctionnement des clés SSH :**<br>
![](./ssh_handshake.svg)

<a href="https://doc.ubuntu-fr.org/ssh">tuto ubuntu</a>

## Liste des commandes terminal

1. Navigation et Gestion de Fichiers :
    * ls = listing : liste le contenu du répertoire courant par ordre alphabétique.
    * cd = change directory : permet de naviguer d'un répertoire à un autre.
    * pwd = print working directory : permet d'afficher le chemin d'accès vers le répertoire ou se situe l'utilisateur qui a entré la commande.
2. Manipulation de fichiers et de répertoires :
    * cp = copie : permet de copier un fichier ou un groupe de fichiers ou de répertoires.
    * mkdir = make directory : permet de créer un nouveau répertoire (dossier).
    * touch = permet de créer un nouveau fichier. Il doit être suivi du nom du fichier et de son extension.
    * mv = move : permet de déplacer un fichier ou un dossier d'une source vers une autre destination.
3. Affichage et lecture de contenu de fichier :
    * cat = concatenate : permet de créer, fusionnet ou imprimer des fichiers dans l'écran de résultat standard ou vers un autre fichier.
    * less = permet de visualiser un fichier texte page par page (sans le modifier).
    * find = permet de chercher des fichiers dans un ou plusieurs répertoires selon des critères définis par l'utilisateur
    * grep = global regular expression print : permet de recherche une chaîne de caractères dans un fichier spécifié.
4. Transfert et Synchronisation de fichiers :
    * scp = secure copy : permet de copier en toute sécurité des fichiers depuis notre ordinateur local vers des serveurs distants, et inversement, à l'aide du protocole SSH.
    * rsync = permet de synchroniser des fichiers localement et à distance. On peut ainsi transférer des fichiers et des répertoires.
5. Editeur de Texte :
    * vim = c'est un éditeur de texte en ligne de commande
    * nano = autre éditeur de texte en ligne de commande
6. vérifier les ports :
    * lsof = commande basique native de Linux pour connaître les ports ouverts dans le system.<br>
    cette commande montre plusieurs informations : nom de l'application (ex: sshd), le douille du programme (adresse IP associée au port) et l'identifiant du processus (PID).<br>
    `sudo lsof -i -P -n` ou `sudo lsof -i -P -n | grep LISTEN`

## Mise en production d'applications sans conteneurisation

### PHP-FPM et NGINX

**PHP-FPM** :<br>
il s'agit de l'accronyme pour FastCGI Process Manager (= gestionnaire de processus FastCGI).<br>
C'est une interface SAPI permettant la communication entre un serveur web et PHP, basée sur le protocole FastCGI.<br>

```
FastCGI est une technique permettant la communication entre un serveur web et un logiciel indépendant, 
c'est une évolution de Common Gateway Interface (CGI) = Interface passerelle commune.

SAPI (Server Application Programming Interface = interface de programmation des applications serveurs)
est le terme générique utilisé en informatique pour désigner les modules d'interface d'applications serveur web comme Apache,
Internet Information Services ou iPlanet.
```

FPM est une alternative à l'implémentation PHP FastCGI avec des fonctionnalités supplémentaires utiles pour les sites fortement chargés.<br>
Fonctionnalités inclues :
* Gestion avancée des processus avec stop/start doux (graceful) ;
* Pools qui donnent la possibilité de démarrer des travailleurs avec différents uid/gid/chroot/environnement,<br> 
écoutant sur différents ports et utilisant différents php.ini (remplace le safe_mode) ;
* Configurable journalisation stdout et stderr ;
* Redémarrage d'urgence en cas de destruction accidentelle du cache opcode ;
* Support de l'upload acccéléré ;
* "slowlog" - journalisation des scripts (pas juste leurs noms, mais leur backtrace PHP également, utilisant ptrace ou équivalent pour lire le processus distant)<br> 
qui s'éxecutent de manière anormalement lente ;
* fastcgi_finish_request() - fonction spéciale pour terminer la requête et vider toutes les données tout en continuant d'exécuter une tâche consommatrice<br>
(conversion vidéo par exemple) ;
* Naissance de processus fils dynamic/ondemand/static ;
* Informations d'état de base et étendues (similaire à mod_status d'Apache) avec différents formats supportés comme json, xml et openmetrics ;
* Fichier de configuration basé sur php.ini ;

**NGINX** :<br>
Nginx est un logiciel de serveur distribué en 2004.<br>
L'objectif du programmeur derrière nginx (Sysoev) était de créer un serveur de haute performance qui peut gérer plusieurs clients web en même temps.<br>

il s'agit d'un système asynchrone qui utilise les changements d'état pour gérer plusieurs connexions en même temps.<br>
Le traitement de chaque requête est découpé en de nombreuses mini-tâches et permet ainsi de réaliser un multiplexage efficace entre connexions.<br>
Afin de tirer parti des ordinateurs multiprocesseurs, plusieurs processus peuvent être démarrés.<br>
Ce choix d'architecture entraîne des performances très élevées, ainsi qu'une charge et une consommation de mémoire très inférieures à celles des serveurs HTTP classiques comme Apache.<br>

Un serveur Nginx permet d'utiliser PHP-FPM pour traiter les scripts PHP.<br>
La combinaison NGINX/PHP-FPM permet de servir ses applications PHP en production.<br>

![](./php-fpm_nginx.png)

<a href="https://www.data-transitionnumerique.com/nginx-tutoriel-complet/">nginx tutoriel complet</a>

Nging n'offre aucune possibilité de traiter du contenu Web dynamique en natif ou d'intégrer les interprètes correspondants par module.<br>
nginx nécessite donc un serveur d'application séparé pour traiter du contenu web dynamique.<br> 
Le contenu statique est délivré par nginx quand demandé, mais si le client demande du contenu dynamique, l'équilibreur de charge va devoir transmettre la demande à un serveur d'application dédié.<br>
Ce serveur interprète le langage de programmation, assemble le contenu demandé dans une page web et le renvoie à l'équilibreur de charge qui le livre à son tour au client.<br>
Cela permet de gérer efficacement les volumes de trafic élevés.<br>

Cela signifie que sans serveur d'application dédié, il ne sera pas possible de traiter le contenu dynamique.<br>
Ce genre de traitement peut être lourd pour des sites webs de petite envergure.<br>

Concernant le développement, il est nécessaire d'installer chaque composant individuellement : problèmes de cohérence et de reproductivité.<br>

<a href="https://www.ionos.fr/digitalguide/serveur/know-how/nginx-vs-apache/">nginx vs apache</a>
<a href="https://fr.linux-console.net/?p=5736#gsc.tab=0">apache vs nginx : considérations pratiques</a>

## Mise en production d'applications avec conteneurisation

### Introduction de Docker et conteneurisation moderne

**Historique**

De manière générale, presque toutes les entreprises utilisent l'environnement cloud (privé ou public) avec des instances exécutant des Virtual Machines<br>
avec des capacité d'évolutivité et d'équilibrage de charge représentant leur couche de calcul.<br>
Avec l'évolution des défis, ce genre d'environnements sont devenus inefficaces :
* _Manque de cohérence des environnements :_ déploiement d'applications et de packages dans des environnements virtuels.
* _Dépendance du système d'exploitation :_ les applications déployées sont exécutées uniquement sur des systèmes d'exploitation compatibles.
* _Niveau d'isolement :_ incapacité à fournir un sandbox instantané au dessus du niveau du système d'exploitation.
* _Granularité de la consommation de calcul :_ impossibilité de déployer plusieurs applications répliquées, alors que l'équilibrage de la charge sur la couche applicative ne se produit qu'au sein d'une seule machine et non au niveau de la couche du système d'exploitation.
* _Correctifs des images dans les environnements de production :_ Les déploiements canari et bleu-vert ne sont pas flexibles au niveau du cluster et son difficiles à gérer dans plusieurs régions.

Pour répondre à ces problèmes, on a eu recours à la conteneurisation.<br>

**La conteneurisation**

Il s'agit d'une forme de virtualisation du système d'exploitation dans laquelle on exécute des applications dans des espaces utilisateurs isolés appelés conteneurs,<br>
qui utilisent le même système d'exploitation partagé.<br>
Un conteneur d'applications est un environnement informatique entièrement regroupé en package et portable :
* il dispose de tout ce dont une application a besoin pour s'exécuter (y compris ses fichiers binaires, bibliothèrques, dépendances et fichiers de configuration, le tout encapsulé et isolé dans un conteneur).
* la conteneurisation d'une application permet d'isoler le conteneur du système d'exploitation hôte, avec un accès limité aux ressources sous-jacentes, comme une VM légère.
* on peut exécuter l'application conteneurisée sur différents types d'infrastructure, tels qu'un serveur "bare metal", dans le cloud ou sur des VM, sans avoir à la remanier pour chaque environnement.

La conteneurisation permet de réduire les charges au démarrage et de supprimer la nécessité de configurer des systèmes d'exploitation invités distincts pour chaque application.<br>
=> Ils partagent tous un seul noyau de système d'exploitation.<br>

**Utilité**

Cela a permis aux développeurs de logiciels de créer et déployer des applications de façon plus rapide et sécurisée.<br>

Docker a permis de rendre la conteneurisation pratique, efficace et populaire.<br>
Les conteneurs offrent plusieurs avantages : voir cet <a href="https://www.veritas.com/fr/fr/information-center/containerization">article</a>
* _portabilité_ 
* _vitesse_ 
* _évolutivité_
* _agilité_
* _efficacité_
* _isolation_ 
* _sécurité_
* _facilité de gestion_
* _continuité_
* _facilité d'utilisation pour les développeurs_ 

Docker et la conteneurisation ont été la réponse à une série de défis persistants dans le monde de l'informatique.<br>
Ce procédé (combinaison de reproductibilité, protabilité et efficacité) à offert une solution aux problèmes que les méthodes traditionnelles résolvaient avec difficulté.<br>

**Concepts clés**

1. _Image_ :<br>
Une image est l'élément de base d'un conteneur. Il s'agit d'un ensemble de fichiers systèmes et de paramètres d'exécutions.<br>
Les fichiers peuvent être les suivants : code source, bibliothèques, dépendances, l'environnement d'exécution (ex JVM), les pilotes, outils, scripts + autres fichiers nécessaires à l'exécution de l'application.<br>
Une image n'a pas d'état et est exécutée par la runtime docker. On peut la voir comme une description d'un conteneur.<br>
On peut créer une image soit en modifiant un conteneur déjà en marche (sorte de snapshot d'un conteneur), soit en créant un Dockerfile basé sur une image qui existe déjà.
2. _Conteneur_ :<br>
Un conteneur est une instance en exécution d'une image. Il s'agit d'une encapsulation légère d'une application et de son environnement d'exécution.<br>
Le conteneur fonctionne de manière isolée sur le système hôte.

**Attention**, différence entre une image docker et un conteneur (ne sont pas la même chose) :<br>
* L'image docker contient tous les éléments nécessaires à l'exécution d'un logiciel : le code, un environnement d'exécution (ex JVM), les pilotes, les outils, scripts, bibliothèques, etc.<br>
Une image n'est pas modifiable. Si on souhaite la modifier, il faut en créer une nouvelle.<br>
On stockera les images dans le "registry" afin de pouvoir les télécharger.<br>
* Le conteneur est une sorte de mode d'emploi pour l'utilisation de l'image. Les conteneurs ne sont pas persistants et sont lacés à partir d'images.<br>

3. _Dockerfile_ :<br>
Il s'agit d'un fichier texte (ou fichier script) qui décrit une image.<br> 
Il est constitué d'instructions qui servent à décrire une image Docker et il contient les instructions pour construire une image Docker.<br>
Le dockerfile permet d'automatiser la "build" (création) d'images.
4. _Entrypoint_ :<br>
Le point d'entrée d'un conteneur. Il s'agit d'une commande qui se lance au démarrage du conteneur.<br>
La plupart des images officielles Docker sont configurées avec un entrypoint /bin/bin ou /bin/bash.
5. _Registry_ :<br>
Le registre est une zone de stockage pour les images Docker (public ou privé).<br>
Docker Hub est un service cloud public pour partager et stocker des images Docker.<br>
C'est l'équivalent d'un GitHub pour les images Docker.
6. _Volume_ :<br>
Le Volume est utilisé pour faire persister les données et partager des fichiers entre le conteneur et l'hôte.<br>
Les volumes sont essentiels pour éviter la pete de données lorsque les conteneurs sont arrêtés ou supprimés.<br>
C'est aussi une solution pratique pour l'échange de données entre l'hôte et le conteneur.<br>
Le volume est hébergé par l'ordinateur hôte, en dehors du véritable conteneur.<br>
Il faut voir le volume comme un dossier qui est partagé entre le conteneutr et l'ordinateur hôte.<br> 
Plusieurs conteneurs peuvent aussi se partager un même volume.

```
Statefull vs Stateless app :

Un processus ou une application stateless est indépendant. Il ne stocke pas de données et ne fait référence à aucune transaction passée.
Chaque transaction est effectuée à partir de rien, comme si c'était la première fois. Les applications stateless fournissent un service 
ou une fonction et utilisent un réseau de diffusion de contenu, le web ou des serveurs d'impression pour traiter ces requêtes à court terme.

Les applications et processus stateful, quant à eux, peuvent être réutilisés indéfiniment. 
Les plateformes bancaires en ligne et les messageries en sont deux exemples. 
Les transactions précédentes sont prises en compte et peuvent affecter la transaction actuelle. 
C'est pour cela que les applications stateful utilisent les mêmes serveurs chaque fois qu'elles traitent une requête d'un utilisateur.  
```
<a href="https://www.redhat.com/fr/topics/cloud-native-apps/stateful-vs-stateless">statefull et stateless : quelle différence ?</a>


7. _Réseau Docker_ :<br>
Docker possède sa propre gestion du réseau, permettant aux conteneurs de communiquer entre eux et avec des ressources extérieures.<br>
Il offre plusieurs modes de réseau comme "bridge", "host" et "overlay".
8. _Docker Compose_ :<br>
C'est un outil pour définir et gérer des applications multi-conteneurs. par exemple un conteneur pour l'application et un conteneur pour la bdd.<br>
Grâce à docker compose, on peut définir une application à l'aide de plusieurs conteneurs dans un seul fichier, puis démarrer ces conteneurs simultanément avec une seule commande.<br>

<a href="https://hub.docker.com/search?q=">lien vers le Docker Hub</a>

### Lancer une application multiconteneur

Voici quelques points clés concernant Docker Compose :
* Fichier docker-compose.yml : Le cœur de Docker Compose est le fichier YAML qui décrit la structure et les paramètres des services, des réseaux et des volumes.
* Services : Dans Docker Compose, chaque conteneur est décrit comme un "service".<br> 
Chaque service est une configuration pour un conteneur particulier et son image.
* Commande up : Avec la commande docker-compose up, vous pouvez démarrer tous les services définis dans le fichier docker-compose.yml.
* Intégration avec Docker : Docker Compose travaille avec Docker, ce qui signifie que toutes les commandes et fonctionnalités de Docker sont également accessibles.

Pour nous exercer, nous allons donc déployer une application wordpress. Cette application est composée :
- 1 service Wordpress qui utilise l’image latest
- 1 service MariaDB qui utilise l’image mariadb:10.6.4-focal
- Attention à bien paramétrer les variables d’environnement des deux services
- La base de données ne doit pas être accessible depuis l’extérieur. Autrement dit, il faudra regarder du côté des réseaux Docker.
- La base de données doit pouvoir persister les données

Pour ce faire, il faut créer un dossier qui contiendra notre application, et y créer un fichier `docker-compose.yml`.<br>

<a href="https://openclassrooms.com/fr/courses/2035766-optimisez-votre-deploiement-en-creant-des-conteneurs-avec-docker/6211677-creez-un-fichier-docker-compose-pour-orchestrer-vos-conteneurs">voir ce tuto</a>

Exemple d'un fichier Docker-compose.yml, la structure est sensiblement la même dans chaque fichier :
```
version: '3'

services:
  mariadb:
    image: mariadb:10.6.4-focal
    ports: 
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    restart: always
    environment:
      MARIADB_ROOT_PASSWORD: password
      MARIADB_DATABASE: wordpress
      MARIADB_USER: wordpress
      MARIADB_PASSWORD: wordpress

  wordpress:
    depends_on:
      - mariadb
    image: wordpress:latest
    ports:
     - "80:80"
    restart: always
    environment:
      WORDPRESS_DB_HOST: mariadb:3306
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress

volumes:
  db_data: {}
```

## Cas pratique : Application fullstack

Dans le cas d'une application FullStack (Application Front-end couplée avec une application Back-end (API) et d'une base de données), on emploiera plusieurs conteneurs.<br>
On aura un dossier contenant le frontend, un dossier contenant le backend, et un dossier englobant le tout.<br>

### Structure 

Le fichier `docker-compose.yml` se situe à la racine de l'app (dossier contenant l'application Front-end, l'application Back-end (API) et la base de données).<br>

On aura plusieurs fichiers `Dockerfile` qui contiennent chacun une série d'éléments décrivant l'image Docker et d'instructions servant à construire l'image Docker.<br>
Ces fichiers seront utilisés pour automatiser le build des images Docker.

Commandes utiles : 
```bash
# pour lister les conteneurs sur la machine
docker ps -a
# ou
docker container ls -a

# supprimer un conteneur
docker container rm <id>

# pour lister les images docker
docker images

# pour supprimer une image docker 
docker rmi <id>
docker rm <id>

# pour build une image docker
docker build -t <nom_de_l_image> .

# pour lancer un conteneur docker
docker run --name <nom_du_conteneur> <nom_de_l_image>

# Pour lancer un container en mode débug (avec accès à la console)
docker run -it --rm --name=<nom> -p <port>:<port>

# Pour construire et lancer une application complète
docker-compose up -d

# Pour arrêter toutes les applications
docker-compose down

# pour build une image docker
docker-compose build <service>

# pour afficher les logs d'un service
docker-logs -f <service>

# pour accéder à l'application conteneurisée (sh est utilisé à la place de bash car on utilise une image alpine)
docker exec -it <nom_du_conteneur> sh

# quitter l'espace 
exit
```

### I. Conteneurisation de la base de données

On va commencer par conteneuriser la base de données : ici une base de données Postgresql.<br>
On va donc créer le fichier `docker-compose.yml` pour paramétrer le conteneur.<br> 

Le fichier docker-compose.yml est utilisé pour définir et gérer les services Docker à l'aide de Docker Compose.<br> 
Il décrit les services à exécuter, les paramètres de configuration, les dépendances et les volumes nécessaires.

**N.B. : Ce fichier va évoluer au fur et à mesure qu'on avancesera dans la conteneurisation entière de l'app.**

#### Le fichier `docker-compose.yml` :
```yml
version: '3.9'

services:
    db:
        image: postgres:latest
        ports:
            - "5432:5432"
        restart: always
        # set shared memory limit when using docker-compose
        shm_size: 128mb
        environment:
            POSTGRES_DB: db_crafted_by
            POSTGRES_USER: <user>
            POSTGRES_PASSWORD: <password>
        volumes:
            - pg-data:/var/lib/postgresql/data

volumes:
    pg-data: {}
```
Le service DB permet de paramétrer le conteneur pour la base de données.<br>
On utilise une image officielle postgres. <a href="https://hub.docker.com/_/postgres">https://hub.docker.com/_/postgres</a><br>
volumes indique la manière dont on fera persister les données de la base de données.

1. **version: '3.9':** Cette ligne spécifie la version de la syntaxe Docker Compose utilisée dans ce fichier. Dans ce cas, il s'agit de la version 3.9.
2. **services:** Cette section définit les services à exécuter dans l'environnement Docker.
3. **db:** C'est le nom du service PostgreSQL.
	  - **image: postgres:latest:** Spécifie l'image Docker à utiliser pour ce service. Dans ce cas, il utilise l'image PostgreSQL la plus récente disponible sur Docker Hub.
   	- **ports:** Définit les ports à exposer sur l'hôte Docker et à mapper sur le conteneur. Dans ce cas, le port 5432 du conteneur PostgreSQL est exposé sur le port 5432 de l'hôte Docker.
    - **restart: always:** Indique à Docker de redémarrer toujours ce conteneur en cas d'arrêt inattendu.
    - **shm_size: 128mb:** Définit la taille de la mémoire partagée (SHM) pour ce conteneur. Dans ce cas, il est défini sur 128 Mo.
    - **environment:** Définit les variables d'environnement nécessaires pour le conteneur PostgreSQL. Cela inclut le nom de la base de données, le nom d'utilisateur et le mot de passe.
  	- **volumes:** Montre un volume nommé pg-data dans le conteneur PostgreSQL, qui est utilisé pour stocker les données de la base de données.
4. **volumes:** Cette section définit les volumes Docker utilisés par les services.
	  - **pg-data: {}:** Définit un volume nommé pg-data qui sera utilisé pour stocker les données de la base de données PostgreSQL. Les accolades vides signifient que Docker va créer automatiquement ce volume s'il n'existe pas déjà.

En résumé, ce fichier docker-compose.yml définit un service PostgreSQL avec une configuration de base,<br> 
y compris le nom de la base de données, le nom d'utilisateur, le mot de passe, les ports exposés et les volumes de données associés.<br> 
Il permet de déployer rapidement et facilement un conteneur PostgreSQL avec les configurations spécifiées.

Pour tester, on utilisera la commande `docker compose up`.

### II. Conteneurisation du backend

Au tour du backend : dans notre cas, il s'agit d'une API Laravel 10.<br>
Pour fonctionner correctement dans un environnement de production, l'application nécessite deux services essentiels qui seront configurés pour fonctionner ensemble : **nginx** et **php-fpm**.<br>
Pour intégrer ces services dans un seul conteneur et les gérer, on utilisera également un troisième service : **supervisor**

```
N.B. :
Nginx est un serveur web de haute performance, reconnu pour sa stabilité, sa richesse fonctionnelle,
sa configuration simple et sa faible consommation de ressources.
Il est couramment utilisé pour servir des pages web statiques ainsi que comme reverse proxy pour des applications web.

PHP-FPM (FastCGI Process Manager) est une alternative efficace pour gérer les processus PHP,
permettant au serveur web de traiter les requêtes PHP de manière efficiente.
L’interaction entre Nginx et PHP-FPM se fait via le protocole FastCGI,
où Nginx redirige les requêtes nécessitant une interprétation PHP vers PHP-FPM.
Après l’exécution du script PHP, PHP-FPM renvoie le résultat à Nginx, qui le transmet au client.
Cette séparation des tâches optimise la gestion des ressources et les performances des applications web.

Supervisor est un système de contrôle et de supervision de processus pour Unix,
veillant à ce que les processus spécifiés fonctionnent sans interruption.
Il est particulièrement utile pour garantir que PHP-FPM reste actif, redémarrant le processus automatiquement en cas d’échec.
```

On commencera par créer le fichier `Dockerfile` à la racine du dossier du backend.<br>
Pour compléter, il faudra créer les fichiers `nginx.conf`, `default.conf`, `zz-docker.conf` et `supervisord.conf` qui contiendront les configurations nécessaire au bon fonctionnement.<br>
Ces fichiers doivent être situés au même niveau que le `Dockerfile` pour être copiés dans les bons répertoires grâce aux commandes indiquées dans ce dernier.

#### Le Dockerfile aura cette structure : 
```bash
# Use Alpine Linux as the base image
FROM php:8.2-fpm-alpine

# Install necessary packages nginx & supervisor
RUN apk update && apk add \
    nginx \
    supervisor \
    htop \
    libpq-dev

RUN docker-php-ext-install pdo pdo_pgsql

# Installing composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create directory where nginx logs will be stored
# Create directory where php-fpm logs will be stored
RUN mkdir -p /var/log/nginx \
    && mkdir -p /var/log/php-fpm

# Copy the Laravel application files to the container
COPY --chown=www-data:www-data . /var/www/html

# Set the working directory inside the container
WORKDIR /var/www/html

# RUN composer install --no-interaction
RUN composer install --no-interaction

# Set up nginx
COPY default.conf /etc/nginx/http.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf 

# Set up php-fpm
COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf

# Set up Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Export ports : default port for HTTP traffic
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

```
1. **FROM php:8.2-fpm-alpine:** Cette ligne définit l'image de base à utiliser, dans ce cas, Alpine Linux avec PHP-FPM version 8.2.
2. **RUN apk update && apk add nginx supervisor htop libpq-dev:** Ces commandes mettent à jour les index des packages Alpine (apk update) et installent les packages nécessaires (nginx, supervisor, htop, libpq-dev).
3. **RUN docker-php-ext-install pdo pdo_pgsql:** Cette commande installe les extensions PHP nécessaires pour la connexion à PostgreSQL en utilisant PDO.
4. **COPY --from=composer:latest /usr/bin/composer /usr/bin/composer:** Cette commande copie l'exécutable Composer depuis l'image Composer officielle vers l'emplacement approprié dans l'image en cours de construction.
5. **RUN mkdir -p /var/log/nginx && mkdir -p /var/log/php-fpm:** Ces commandes créent les répertoires où les logs de Nginx et PHP-FPM seront stockés.
6. **COPY --chown=www-data:www-data . /var/www/html:** Cette commande copie les fichiers de l'application Laravel depuis le répertoire local vers le répertoire /var/www/html du conteneur, tout en définissant les propriétaires et les groupes appropriés.
7. **WORKDIR /var/www/html:** Cette instruction définit le répertoire de travail à l'intérieur du conteneur où toutes les commandes suivantes seront exécutées.
8. **RUN composer install --no-interaction:** Cette commande exécute l'installation des dépendances de l'application Laravel en utilisant Composer.
9. **COPY default.conf /etc/nginx/http.d/default.conf:** Cette commande copie le fichier de configuration Nginx spécifique à l'application depuis le répertoire local vers le répertoire /etc/nginx/http.d/ du conteneur.
10. **COPY nginx.conf /etc/nginx/nginx.conf:** Cette commande copie le fichier de configuration principal de Nginx depuis le répertoire local vers le répertoire /etc/nginx/ du conteneur.
11. **COPY zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf:** Cette commande copie un fichier de configuration spécifique pour PHP-FPM depuis le répertoire local vers le répertoire /usr/local/etc/php-fpm.d/ du conteneur.
12. **COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf:** Cette commande copie le fichier de configuration Supervisor depuis le répertoire local vers le répertoire /etc/supervisor/conf.d/ du conteneur.
13. **EXPOSE 80:** Cette instruction expose le port 80, le port par défaut pour le trafic HTTP, du conteneur Docker.
14. **CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]:** Cette instruction définit la commande par défaut à exécuter lorsque le conteneur démarre. Elle lance Supervisor en utilisant le fichier de configuration spécifié (supervisord.conf), ce qui permet à Supervisor de démarrer les services Nginx et PHP-FPM dans le conteneur.

#### Le fichier `nginx.conf` :<br> 
C'est le fichier de configuration principal de Nginx.<br> 
Il contrôle le comportement global du serveur Nginx et définit la configuration par défaut pour les serveurs virtuels,<br> 
les connexions, les journaux, les protocoles SSL/TLS, la compression gzip, etc. 
```
# /etc/nginx/nginx.conf

# Dans ce cas précis, on modifie l'utilisateur pour qu'il corresponde 
user root;

# Set number of worker processes automatically based on number of CPU cores.
worker_processes auto;

# Enables the use of JIT for regular expressions to speed-up their processing.
pcre_jit on;

# Configures default error logger.
error_log /var/log/nginx/error.log warn;

# Includes files with directives to load dynamic modules.
include /etc/nginx/modules/*.conf;

# Include files with config snippets into the root context.
include /etc/nginx/conf.d/*.conf;

events {
	# The maximum number of simultaneous connections that can be opened by
	# a worker process.
	worker_connections 1024;
}

http {
	# Includes mapping of file name extensions to MIME types of responses
	# and defines the default type.
	include /etc/nginx/mime.types;
	default_type application/octet-stream;

	# Name servers used to resolve names of upstream servers into addresses.
	# It's also needed when using tcpsocket and udpsocket in Lua modules.
	#resolver 1.1.1.1 1.0.0.1 2606:4700:4700::1111 2606:4700:4700::1001;

	# Don't tell nginx version to the clients. Default is 'on'.
	server_tokens off;

	# Specifies the maximum accepted body size of a client request, as
	# indicated by the request header Content-Length. If the stated content
	# length is greater than this size, then the client receives the HTTP
	# error code 413. Set to 0 to disable. Default is '1m'.
	client_max_body_size 1m;

	# Sendfile copies data between one FD and other from within the kernel,
	# which is more efficient than read() + write(). Default is off.
	sendfile on;

	# Causes nginx to attempt to send its HTTP response head in one packet,
	# instead of using partial frames. Default is 'off'.
	tcp_nopush on;


	# Enables the specified protocols. Default is TLSv1 TLSv1.1 TLSv1.2.
	# TIP: If you're not obligated to support ancient clients, remove TLSv1.1.
	ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

	# Path of the file with Diffie-Hellman parameters for EDH ciphers.
	# TIP: Generate with: `openssl dhparam -out /etc/ssl/nginx/dh2048.pem 2048`
	#ssl_dhparam /etc/ssl/nginx/dh2048.pem;

	# Specifies that our cipher suits should be preferred over client ciphers.
	# Default is 'off'.
	ssl_prefer_server_ciphers on;

	# Enables a shared SSL cache with size that can hold around 8000 sessions.
	# Default is 'none'.
	ssl_session_cache shared:SSL:2m;

	# Specifies a time during which a client may reuse the session parameters.
	# Default is '5m'.
	ssl_session_timeout 1h;

	# Disable TLS session tickets (they are insecure). Default is 'on'.
	ssl_session_tickets off;


	# Enable gzipping of responses.
	#gzip on;

	# Set the Vary HTTP header as defined in the RFC 2616. Default is 'off'.
	gzip_vary on;


	# Helper variable for proxying websockets.
	map $http_upgrade $connection_upgrade {
		default upgrade;
		'' close;
	}


	# Specifies the main log format.
	log_format main '$remote_addr - $remote_user [$time_local] "$request" '
			'$status $body_bytes_sent "$http_referer" '
			'"$http_user_agent" "$http_x_forwarded_for"';

	# Sets the path, format, and configuration for a buffered log write.
	access_log /var/log/nginx/access.log main;


	# Includes virtual hosts configs.
	include /etc/nginx/http.d/*.conf;
}

```
explications :
1. **user root;:** Définit l'utilisateur sous lequel les processus Nginx seront exécutés.
2. **worker_processes auto;:** Définit le nombre de processus Nginx qui seront créés pour gérer les connexions des clients. Le paramètre auto permet à Nginx de choisir automatiquement le nombre de processus en fonction du nombre de cœurs CPU disponibles.
3. **pcre_jit on;:** Active la compilation juste-à-temps (JIT) pour les expressions régulières PCRE, ce qui accélère leur traitement.
4. **error_log /var/log/nginx/error.log warn;:** Définit le fichier de journalisation des erreurs pour Nginx.
5. **include /etc/nginx/modules/*.conf;:** Inclut les fichiers de configuration des modules dynamiques de Nginx.
6. **include /etc/nginx/conf.d/*.conf;:** Inclut les fichiers de configuration supplémentaires du serveur Nginx. Cette ligne est utilisée pour inclure des fichiers de configuration spécifiques à chaque site web ou application.
7. **events { ... }:** Définit les paramètres globaux pour les événements Nginx, tels que le nombre maximal de connexions simultanées.
8. **http { ... }:** Définit les paramètres globaux pour le protocole HTTP, y compris les types MIME, les paramètres de sécurité, la journalisation, etc.
   - **include /etc/nginx/mime.types;:*** Inclut les types MIME prédéfinis par Nginx.
   - **default_type application/octet-stream;:** Définit le type MIME par défaut pour les réponses du serveur.
   - **server_tokens off;:** Masque la version de Nginx des en-têtes de réponse envoyés aux clients.
   - **client_max_body_size 1m;:** Définit la taille maximale autorisée du corps d'une requête client.
   - **sendfile on;:** Active l'utilisation de la fonctionnalité de transfert de fichiers optimisée du système d'exploitation.
   - **tcp_nopush on;:** Active l'envoi des en-têtes de réponse HTTP en une seule fois.
   - **ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;:** Active les protocoles SSL/TLS pris en charge.
   - **log_format main ...:** Définit le format des journaux d'accès principaux.
   - **access_log /var/log/nginx/access.log main;:** Définit le fichier de journalisation des accès pour Nginx.

_Notez que certains paramètres liés à la sécurité SSL/TLS sont commentés par défaut. Ils peuvent être décommentés et configurés selon les besoins spécifiques de votre environnement._

9. **map $http_upgrade $connection_upgrade { ... }:** Définit une variable d'aide pour la mise à niveau de la connexion lors de l'utilisation de websockets.
10. **include /etc/nginx/http.d/*.conf;:** Inclut les fichiers de configuration des hôtes virtuels HTTP. Cette ligne est utilisée pour inclure les configurations spécifiques de chaque site web ou application.

#### le fichier `default.conf` :<br>
C'est une configuration Nginx spécifique pour le serveur virtuel par défaut.<br> 
Il définit comment Nginx doit gérer les requêtes HTTP reçues sur le port 80. 
```bash
server {
    listen       80 default_server;

    #access_log  /var/log/nginx/host.access.log  main;

    root   /var/www/html/public;
        
    index  index.php index.htm index.html;
  
    location / {
        try_files $uri $uri/ /index.php?$query_string;
        # Il faudra utiliser app.php si vous utilisez symfony
    }
    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}"/var/www/html/public/api/items"
    
    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    location ~ \.php$ {
        fastcgi_pass   unix:/var/run/php-fpm.sock;
        fastcgi_index  index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```
1. **server { ... }:** Définit un bloc de configuration pour un serveur virtuel Nginx.
2. **listen 80 default_server;:** Spécifie que ce serveur virtuel écoute sur le port 80 par défaut pour toutes les requêtes entrantes.
3. **root /var/www/html/public;:** Définit le répertoire racine où se trouvent les fichiers de l'application web. Dans ce cas, il est configuré pour un répertoire public à l'intérieur du répertoire /var/www/html.
4. **index index.php index.htm index.html;:** Définit les fichiers d'index pris en charge par le serveur. Si un nom de fichier n'est pas spécifié dans l'URL, le serveur cherchera ces fichiers dans l'ordre indiqué.
5. **location / { ... }:** Définit la configuration pour le traitement des requêtes pour les URI racines de l'application. Cette directive try_files tente de servir le fichier demandé, puis redirige vers index.php en passant les paramètres de la requête si le fichier n'existe pas. C'est une configuration typique pour les applications basées sur des frameworks PHP comme Laravel.
6. **location ~ \.php$ { ... }:** Définit la configuration pour le traitement des fichiers PHP. Cette directive fastcgi_pass spécifie que les requêtes PHP doivent être transmises à _PHP-FPM via un socket Unix_. Les autres directives fastcgi_index, fastcgi_param, et include sont utilisées pour configurer les paramètres FastCGI pour le serveur PHP.

En résumé, ce fichier default.conf définit un serveur virtuel Nginx de base pour servir une application web PHP.<br> 
Il utilise PHP-FPM pour exécuter les scripts PHP et redirige toutes les requêtes vers index.php pour le traitement par l'application.<br> 
Cette configuration est adaptée aux applications web basées sur des frameworks PHP comme Laravel.

#### Le fichier `zz-docker.conf` :<br>
C'est une configuration spécifique pour PHP-FPM dans un environnement Docker.<br> 
Il définit les paramètres globaux et spécifiques au pool de processus PHP-FPM. 
```bash
[global]
pid = /var/run/php-fpm.pid
error_log = /var/log/php-fpm/error.log
daemonize = no

[www]
listen = /var/run/php-fpm.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660
user = www-data
group = www-data
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
chdir = /
```
1. **[global]:** Cette section contient des paramètres globaux pour PHP-FPM.
	  - **pid = /var/run/php-fpm.pid:** Spécifie le chemin du fichier PID pour le processus PHP-FPM.
    - **error_log = /var/log/php-fpm/error.log:** Spécifie le chemin du fichier journal des erreurs de PHP-FPM.
    - **daemonize = no:** Indique à PHP-FPM de ne pas s'exécuter en arrière-plan.

2. **[www]:** Cette section contient des paramètres spécifiques pour le pool de processus PHP-FPM nommé "www".
    - **listen = /var/run/php-fpm.sock:** Spécifie le chemin du socket Unix sur lequel PHP-FPM écoute les connexions.
    - **listen.owner = www-data et listen.group = www-data:** Définit le propriétaire et le groupe du socket Unix pour correspondre à l'utilisateur et au groupe Nginx.
    - **listen.mode = 0660:** Définit les permissions du socket Unix.
    - **user = www-data et group = www-data:** Définit l'utilisateur et le groupe sous lesquels les processus PHP-FPM seront exécutés.
    - **pm = dynamic:** Définit le mode de gestion des processus PHP-FPM en tant que dynamique.
    - **pm.max_children = 5:** Définit le nombre maximal de processus enfants.
    - **pm.start_servers = 2:** Définit le nombre de processus enfants à démarrer au lancement de PHP-FPM.
    - **pm.min_spare_servers = 1:** Définit le nombre minimal de processus enfants inactifs à conserver.
    - **pm.max_spare_servers = 3:** Définit le nombre maximal de processus enfants inactifs à conserver.
    - **chdir = /:** Définit le répertoire de travail pour les processus PHP-FPM. Dans ce cas, il est défini à la racine du système de fichiers.

Ce fichier est nommé zz-docker.conf avec le préfixe zz pour s'assurer qu'il est chargé après les fichiers de configuration par défaut de PHP-FPM.<br> 
Il est conçu pour être utilisé dans un environnement Docker où les permissions et les chemins des fichiers sont configurés différemment de l'environnement de production habituel.<br> 
Les paramètres spécifiques tels que listen.owner, listen.group et listen.mode sont configurés pour permettre à Nginx d'accéder au socket Unix PHP-FPM dans le conteneur Docker.

#### Et enfin le fichier `supervisord.conf` :<br>
Le fichier supervisord.conf est une configuration pour Supervisor, un système de gestion de processus utilisé pour contrôler et superviser les processus dans un environnement Docker.
```bash
# configurs Supervisor daemon
[supervisord]
nodaemon=true

# defines configuration for nginx process
[program:nginx]
# specify command to start nginx
command=/usr/sbin/nginx -g "daemon off;"
# Instruction to start and restart nginx if crash
autostart=true
autorestart=true
# Specify the log files for Nginx error and access logs
stderr_logfile=/var/log/nginx/error.log
stdout_logfile=/var/log/nginx/access.log

# Configuration for PHP-FPM process
[program:php-fpm]
# Specify command to start PHP-FPM process
command=/usr/local/sbin/php-fpm -F
# Inctruction to automatically start and restart PHP-FPM if crash
autostart=true
autorestart=true
# Specify the log files for PHP-FPM error and access logs
stderr_logfile=/var/log/php-fpm/error.log
stdout_logfile=/var/log/php-fpm/access.log
```
1. **[supervisord]:** Cette section définit la configuration globale pour le démon Supervisor.
    - **nodaemon=true:** Indique à Supervisor de ne pas s'exécuter en mode démon.
    - **user=root:** Définit l'utilisateur sous lequel le démon Supervisor sera exécuté.

2. **[program:nginx]:** Cette section définit la configuration pour le processus Nginx.
    - **command=/usr/sbin/nginx -g "daemon off;":** Spécifie la commande pour démarrer Nginx. L'option -g "daemon off;" indique à Nginx de ne pas s'exécuter en arrière-plan.
    - **autostart=true:** Indique à Supervisor de démarrer automatiquement le processus Nginx au démarrage.
    - **autorestart=true:** Indique à Supervisor de redémarrer automatiquement le processus Nginx en cas de crash.
    - **stderr_logfile=/var/log/nginx/error.log:** Spécifie le chemin du fichier journal des erreurs de Nginx.
    - **stdout_logfile=/var/log/nginx/access.log:** Spécifie le chemin du fichier journal d'accès de Nginx.

3. **[program:php-fpm]:** Cette section définit la configuration pour le processus PHP-FPM.
    - **command=/usr/local/sbin/php-fpm -F:** Spécifie la commande pour démarrer le processus PHP-FPM. L'option -F indique à PHP-FPM de rester en avant-plan et d'écouter les demandes.
    - **autostart=true:** Indique à Supervisor de démarrer automatiquement le processus PHP-FPM au démarrage.
    - **autorestart=true:** Indique à Supervisor de redémarrer automatiquement le processus PHP-FPM en cas de crash.
    - **stderr_logfile=/var/log/php-fpm/error.log:** Spécifie le chemin du fichier journal des erreurs de PHP-FPM.
    - **stdout_logfile=/var/log/php-fpm/access.log:** Spécifie le chemin du fichier journal d'accès de PHP-FPM.

Ce fichier supervisord.conf définit la configuration pour Supervisor afin de gérer les processus Nginx et PHP-FPM dans un environnement Docker.<br> 
Il assure que ces processus sont démarrés automatiquement, surveillés et redémarrés en cas de problème, tout en journalisant les erreurs et les accès pour chaque processus.

#### Une fois ces fichiers écrits, on pourra builder notre image docker grâce à la commande :
```bash
docker build --no-cache  -t <nom_de_l_api>:latest .
```
_**N.B. :** ATTENTION, il est nécessaire de se trouver à la racine ou se situe le Dockerfile pour exécuter cette commande._<br>

Explications de la commande :
- **docker build:** C'est la commande principale pour construire des images Docker.
- **--no-cache:** Cette option indique à Docker de ne pas utiliser le cache lors de la construction de l'image. En d'autres termes, cela force Docker à reconstruire toutes les couches de l'image à partir de zéro, sans utiliser de cache. Cela peut être utile pour s'assurer que l'image est construite à partir des dernières versions de toutes les dépendances.
- **-t crafted_by_api:latest:** L'option -t ou --tag permet de tagger l'image résultante avec un nom et une étiquette. Dans ce cas, l'image sera taggée avec le nom crafted_by_api et l'étiquette latest. Cela signifie que l'image sera référencée sous le nom crafted_by_api avec la version latest.
- **. :** C'est le chemin vers le répertoire contenant le Dockerfile à utiliser pour construire l'image. Dans ce cas, le Dockerfile se trouve dans le répertoire actuel (représenté par .).

Cette commande construit une image Docker en utilisant un Dockerfile trouvé dans le répertoire actuel, en ignorant le cache pour s'assurer que l'image est construite à partir de zéro, et en taggant l'image résultante avec le nom crafted_by_api et l'étiquette latest.

Après avoir build notre image, on mettra à jour le fichier `docker-compose.yml` :
```yml
version: '3.9'

services:
    # nom du service de la base de données
    db:
        container_name: db_crafted_by
        # image docker de postgres
        image: postgres:latest
        # ports exposés
        ports:
            - "5432:5432"
        restart: always
        # set shared memory limit when using docker-compose
        shm_size: 128mb
        environment:
            POSTGRES_DB: db_crafted_by
            POSTGRES_USER: romainw
            POSTGRES_PASSWORD: R0main89labs!
        # volumes de persistance des données
        volumes:
            - pg-data:/var/lib/postgresql/data

    # nom du service backend
    laravel-api:
        container_name: api_crafted_by
        image: crafted_by_api:latest
        # ports exposés
        ports:
            - "8080:80"
        depends_on:
            - db
        environment:
            DB_HOST: db

volumes:
    pg-data: {}

```
_**N.B. :** La première partie du fichier n'a pas été modifiée par rapport à la conteneurisation de la BDD, on va simplement regarder en détail la partie du service backend._

- **laravel-api:** C'est le nom du service backend Laravel API.
- **container_name: api_crafted_by:** Définit le nom du conteneur Docker pour le service backend Laravel API.
- **image: crafted_by_api:latest:** Spécifie l'image Docker à utiliser pour ce service. Il est supposé qu'une image nommée crafted_by_api avec l'étiquette latest est disponible.
- **ports:** Définit les ports à exposer sur l'hôte Docker et à mapper sur le conteneur. Dans ce cas, le port 80 du conteneur Laravel API est exposé sur le port 8080 de l'hôte Docker.
- **depends_on:** Définit les dépendances de ce service. Dans ce cas, le service Laravel API dépend du service de la base de données PostgreSQL pour démarrer correctement.
- **environment:** Définit les variables d'environnement nécessaires pour le service Laravel API. Dans ce cas, il spécifie l'hôte de la base de données comme DB_HOST.

#### Il ne reste maintenant plus qu'à lancer la commande pour lancer les conteneurs : 
```bash
docker compose up
```

### III. Conteneurisation du frontend

Concernant le front : dans notre cas, il s'agit d'une Application VueJS 3.<br>
Pour fonctionner correctement dans un environnement de production, l'application nécessite le service **nginx**.<br>
La mise en production d’une application Vue.js implique un processus de build qui optimise le code source.<br> 
Ce processus réduit la taille du code en éliminant les éléments superflus (minification) et le compile en fichiers statiques (HTML, CSS, JS), optimisés pour un chargement rapide et une efficacité accrue.<br> 
**Nginx**, un serveur web de haute performance, est ensuite utilisé pour servir ces fichiers statiques aux visiteurs de votre site.<br> 
Il est spécialement configuré pour traiter et distribuer ces fichiers de manière efficace, assurant une expérience utilisateur fluide tout en optimisant la consommation de ressources serveur.

#### Dockerfile frontend

Ce Dockerfile a été créé selon la doc VueJS qu'on peut trouver sur ce <a href="https://v2.fr.vuejs.org/v2/cookbook/dockerize-vuejs-app.html">lien</a>

```bash
# Utilisez une image de Node.js comme base
FROM node:lts-alpine AS build-stage

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# installe les dépendances du projet
RUN npm install

# Copiez le reste des fichiers de l'application dans le conteneur
COPY . .

# Compilez l'application Vue.js
RUN npm run build

# Créez une nouvelle image légère pour servir l'application
FROM nginx:alpine

# Copier le fichier de configuration NGINX
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiez les fichiers de l'application compilée depuis le premier conteneur dans le répertoire approprié de l'image NGINX
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exposez le port 80 pour que l'application soit accessible depuis l'extérieur du conteneur
EXPOSE 80

# Commande pour démarrer NGINX et servir l'application
CMD ["nginx", "-g", "daemon off;"]

```
1. **FROM node:lts-alpine AS build-stage :** Utilise l'image de Node.js basée sur Alpine Linux comme base pour la construction. Cette image est étiquetée lts-alpine, ce qui signifie qu'elle utilise la version LTS (Long-Term Support) de Node.js et est basée sur Alpine Linux.

2. **WORKDIR /app :** Définit le répertoire de travail dans le conteneur comme /app. Toutes les instructions suivantes seront exécutées dans ce répertoire.

3. **COPY package*.json ./ :** Copie les fichiers package.json et package-lock.json depuis le répertoire local (où se trouve le Dockerfile) dans le répertoire de travail /app du conteneur.

4. **RUN npm install :** Installe les dépendances du projet en exécutant la commande npm install. Cela utilise les fichiers package.json et package-lock.json copiés précédemment pour installer les packages Node.js nécessaires au projet.

5. **COPY . . :** Copie tous les autres fichiers de l'application (le code source de l'application Vue.js) depuis le répertoire local dans le répertoire de travail /app du conteneur.

6. **RUN npm run build :** Compile l'application Vue.js en exécutant la commande npm run build. Cette commande est généralement utilisée pour créer une version de production de l'application.

7. **FROM nginx:alpine :** Utilise une autre image, cette fois-ci NGINX basée sur Alpine Linux, comme base pour la nouvelle étape de construction. Cela signifie que nous créons une image finale basée sur NGINX pour servir l'application Vue.js.

8. **COPY default.conf /etc/nginx/conf.d/default.conf :** Copie le fichier de configuration NGINX depuis le répertoire local (où se trouve le Dockerfile) dans le répertoire /etc/nginx/conf.d/ de l'image NGINX. Ce fichier contient la configuration par défaut de NGINX pour servir l'application Vue.js.

9. **COPY --from=build-stage /app/dist /usr/share/nginx/html :** Copie les fichiers de l'application compilée (générés à partir de l'étape de construction précédente) depuis le répertoire /app/dist du premier conteneur (étiqueté build-stage) dans le répertoire /usr/share/nginx/html de l'image NGINX. C'est là que NGINX servira les fichiers de l'application.

10. **EXPOSE 80 :** Expose le port 80 sur le conteneur. Cela permettra à NGINX de recevoir des connexions HTTP sur le port 80.

11. **CMD ["nginx", "-g", "daemon off;"] :** Définit la commande à exécuter lorsque le conteneur démarre. Dans ce cas, il démarre NGINX avec l'option -g "daemon off;", qui empêche NGINX de s'exécuter en arrière-plan. Cela permet au conteneur Docker de rester actif tant que NGINX est en cours d'exécution.

#### Ajout du fichier de configuration de nginx: `default.conf`

```bash
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```
Ce fichier `default.conf` est une configuration NGINX qui définit le comportement du serveur NGINX lorsqu'il reçoit des requêtes HTTP sur le port 80.<br>

1. **server { ... } :** C'est le bloc de configuration principal pour un serveur NGINX. Il contient toutes les directives de configuration pour ce serveur.

2. **listen 80; :** Cette directive spécifie le port sur lequel le serveur NGINX écoute les connexions entrantes. Dans ce cas, le serveur écoute sur le port 80, qui est le port par défaut pour les connexions HTTP.

3. **server_name localhost; :** Cette directive spécifie le nom du serveur. Dans ce cas, le serveur répondra aux requêtes HTTP adressées à localhost. Cela signifie que ce bloc de configuration sera appliqué lorsque le serveur reçoit des requêtes avec localhost dans l'en-tête Host.

4. **location / { ... } :** C'est une directive de bloc qui spécifie comment NGINX doit gérer les requêtes pour la racine du serveur (c'est-à-dire les requêtes pour /).

5. **root /usr/share/nginx/html; :** Cette directive spécifie le répertoire racine où NGINX cherchera les fichiers à servir. Dans ce cas, le répertoire racine est /usr/share/nginx/html, ce qui est généralement l'emplacement par défaut pour les fichiers statiques servis par NGINX.

6. **index index.html; :** Cette directive spécifie les noms de fichiers à rechercher lorsqu'une demande est faite pour un répertoire. Dans ce cas, NGINX cherche un fichier index.html dans le répertoire racine spécifié.

7. **try_files $uri $uri/ /index.html; :** Cette directive définit l'ordre dans lequel NGINX doit essayer de répondre aux requêtes. Il vérifie d'abord si le fichier demandé existe ($uri), puis s'il existe un répertoire correspondant ($uri/), et enfin il redirige toutes les autres requêtes vers index.html si elles n'ont pas été satisfaites auparavant. Cela est souvent utilisé dans les applications client-serveur où le routage est géré côté client, comme dans une application Vue.js ou React.js.

En résumé, ce fichier de configuration NGINX définit un serveur qui écoute sur le port 80,<br> 
répond aux requêtes adressées à localhost, sert les fichiers statiques à partir du répertoire /usr/share/nginx/html,<br> 
et redirige toutes les autres requêtes vers index.html. C'est une configuration courante pour servir des applications Vue.js ou similaires.

#### On ajoutera aussi un fichier `.dockerignore` :
```bash
node_modules
```

`.dockerignore` est utilisé pour spécifier les fichiers et répertoires à exclure lors de la construction de l'image Docker.<br> 
Dans ce cas, le fichier .dockerignore contient uniquement une entrée node_modules.<br> 
Voici pourquoi cela est fait :

1. **Réduction de la taille de l'image :** Le répertoire node_modules contient généralement de nombreuses dépendances Node.js installées via npm ou yarn. Ces dépendances peuvent être assez volumineuses et ne sont pas nécessaires pour la construction de l'image Docker car les dépendances seront installées à nouveau lors de l'exécution du conteneur. En excluant le répertoire node_modules, nous réduisons la taille de l'image Docker.

3. **Éviter les conflits de dépendances :** Les dépendances Node.js peuvent varier en fonction de la plateforme de développement et du système d'exploitation. En excluant le répertoire node_modules, nous nous assurons que les dépendances sont installées proprement dans l'environnement Docker, évitant ainsi les éventuels conflits de dépendances entre l'hôte et le conteneur.

4. **Amélioration de la vitesse de construction :** En excluant le répertoire node_modules, Docker n'aura pas besoin de le copier dans l'image pendant le processus de construction, ce qui peut accélérer la vitesse de construction de l'image Docker.

En résumé, en ajoutant node_modules au fichier `.dockerignore`, nous améliorons l'efficacité de la construction de l'image Docker en réduisant sa taille, en évitant les conflits de dépendances et en accélérant le processus de construction.

#### Build de l'image Docker :
```bash
docker build -t crafted_by_frontend:latest .
```

#### Modification du fichier `docker-compose.yml`

Ce fichier `docker-compose.yml` permet de déployer rapidement et facilement un ensemble d'applications comprenant : 
- une base de données PostgreSQL
- un service backend Laravel API 
- un service frontend Vue.js. 

Il définit les paramètres de configuration, les dépendances et les volumes nécessaires pour chaque service.

```bash
version: '3.9'

services:
    # nom du service de la base de données
    db:
        container_name: db_crafted_by
        # image docker de postgres
        image: postgres:latest
        # ports exposés
        ports:
            - "5432:5432"
        restart: always
        # set shared memory limit when using docker-compose
        shm_size: 128mb
        environment:
            POSTGRES_DB: db_crafted_by
            POSTGRES_USER: romainw
            POSTGRES_PASSWORD: R0main89labs!
        # volumes de persistance des données
        volumes:
            - pg-data:/var/lib/postgresql/data

    # nom du service backend
    laravel-api:
        container_name: api_crafted_by
        image: crafted_by_api:latest
        # ports exposés
        ports:
            - "8080:80"
        depends_on:
            - db
        environment:
            DB_HOST: db

    # nom du service frontend
    vuejs-app:
        container_name: frontend_crafted_by
        image: crafted_by_frontend:latest
        # ports exposés
        ports:
            - "5173:80"
        depends_on:
            - laravel-api

volumes:
    pg-data: {}

```
- **vuejs-app :** Nom du service frontend pour une application Vue.js.
- **container_name: frontend_crafted_by :** Définit le nom du conteneur Docker pour le service frontend de l'application Vue.js.
- **image: crafted_by_frontend:latest :** Spécifie l'image Docker à utiliser pour ce service. Il est supposé qu'une image nommée crafted_by_frontend avec l'étiquette latest est disponible.
- **ports: - "5173:80" :** Définit le mappage de port pour exposer le port 80 du conteneur frontend Vue.js sur le port 5173 de l'hôte Docker.
- **depends_on: - laravel-api :** Définit la dépendance de ce service à l'égard du service backend Laravel API. Docker démarrera d'abord le service backend Laravel API avant de démarrer ce service.

#### commande de lancement de docker compose :
```bash
docker compose up
```

### IV. Publication d'une image docker sur le docker-hub

Pour push une image sur le dockerhub, vous pouvez suivre ce <a href="https://www.it-connect.fr/comment-publier-une-image-dockerfile-sur-le-referentiel-docker-hub/">tuto</a>

Pour publier une image, on va commencer par se rendre sur <a href="https://hub.docker.com/">dockerhub</a><br>
l'idée ici est de créer un repository, puis ensuite se rendre dans notre terminal pour push l'image souhaitée.<br>

On va se connecter sur notre hôte Docker et exécuter les commandes suivantes :
```bash
docker login
<entrez votre identifiant docker>
<entrez votre mot de passe docker>
```

D'abord lister les images :
```bash
docker images
```

puis assigner un label à notre image grâce à la commande docker tag :
```bash
docker tag <nom_de_l_image> <username/repository:tag>
```

enfin, charger l'image sur le repository docker hub username/repository avec la commande :
```bash
docker push <username/repository:tag>
```

On peut enfin vérifer les images docker :
```bash
docker images
```

Dans notre cas pour le frontend :
```bash 
docker images

docker tag crafted_by_frontend <username>/crafted_by_frontend:latest

docker push <username>/crafted_by_frontend:latest
```
pour le backend :
```bash 
docker images

docker tag crafted_by_api <username>/crafted_by_api:latest

docker push <username>/crafted_by_api:latest
```

On pourra enfin lancer les instanciations des conteneurs depuis l'imafe envoyée précédemment sur Docker Hub :
```bash
docker run -d -p port:port <username>/crafted_by_api
docker run -d -p port:port <username>/crafted_by_frontend
```

## PARAMETRAGEDE L'ENVIRONNEMENT DE PRODUCTION

Nous utiliserons VPS de modèle DEV1-L, hébergé sur Scaleway (<a href="https://www.scaleway.com/en/">https://www.scaleway.com/en/</a>).<br>
Le système d’exploitation du VPS est Ubuntu 22.04 LTS Jammy Jellyfish.<br>

Scaleway est un hébergeur internet français actif dans les secteurs de la fourniture de serveurs dédiés physiques et virtuels. 

<a href="https://fr.wikipedia.org/wiki/Scaleway">wiki Scaleway</a>

### PARAMETRAGE DU SERVEUR DE PRODUCTION

serveur de connexion : 
```
<username>@<ip_du_serveur>
user : <username>
password : <password>
```
Une fois connecté, on va paramétrer le protocole ssh afin de sécuriser et simplifier la connection au serveur.

#### protocole ssh de connexion :

On va créer une paire de clés ssh (si ce n'est pas déjà fait) afin de se connecter directement avec le protocole ssh au serveur distant.<br>
Pour générer une clé SSH sur votre serveur Linux, on va exécuter la commande : 
```bash
ssh-keygen
```
Chemin pour trouver la clé publique ssh : `~/home/.ssh/id_rsa.pub`.<br>

Après cette étape, sur un terminal local, on entrera cette commande :
```bash 
ssh-copy-id -i ~/.ssh/id_rsa.pub <username>@<ip_du_serveur>
```
Elle permet de copier notre clé ssh au serveur distant pour se connecter sans mot de passe.

On pourra ensuite se reconnecter  à distance avec la commande :
```bash
ssh <username>n@<ip_du_serveur>
```

On va ensuite installer et configurer Docker sur le serveur en suivant les instructions d'installation de Docker :<br> 
<a href="https://docs.docker.com/engine/install/ubuntu/">https://docs.docker.com/engine/install/ubuntu/</a>

Pour vérifier, on pourra récupérer une image nginx et lancer la commande suivante :
```bash
sudo docker run --name my_nginx_container -d -p 8080:80 nginx
```

Cette commande va permettre de lancer le container nginx, et on ira vérifier s'il fonctionne en se rendant dans notre navigteur à l'adresse IP du serveur : `<adresse_ip>:8080`

#### Paramétrage du DNS

Premièrerement, il faut définir et acheter le nom de domaine qu'on va utiliser.<br>

Ensuite, nous allons utiliser Cloudflare (<a href="https://www.cloudflare.com/fr-fr/">https://www.cloudflare.com/fr-fr/</a>) pour paramétrer les records DNS associés au nom de domaine.<br>

Les serveurs DNS de Cloudflare sont utilisés pour rediriger le nom de domaine enregistré vers l'adresse IP du serveur.

**Avantages de l'utilisation des services Cloudflare :**<br>
- **Performance :** Le réseau mondial de Cloudflare améliore les performances des sites web en mettant en cache le contenu plus près des utilisateurs finaux.
- **Sécurité :** Cloudflare fournit une protection contre les attaques DDoS et des fonctionnalités de sécurité pour protéger les sites web contre les attaques.
- **Fiabilité :** L'architecture réseau Anycast améliore la fiabilité et la redondance pour la disponibilité des sites web.
- **Analytique :** Cloudflare offre des informations sur le trafic du site web, les performances et les événements de sécurité.

**Services Cloudflare :**<br>
- **Firewall d'Application Web (WAF = Web Application Firewall) :** Protège les sites web contre les vulnérabilités des applications web.
- **Réseau de Diffusion de Contenu (CDN = Content Delivery Network) :** Améliore les performances en mettant en cache et en distribuant le contenu à l'échelle mondiale.
- **Chiffrement SSL/TLS (SSL/TLS Encryption):** Sécurise les communications avec le chiffrement SSL/TLS.
- **Équilibrage de Charge (Load Balancing) :** Répartit le trafic entre les serveurs pour la scalabilité et la disponibilité.
- **Gestion DNS (DNS Management) :** Fournit des fonctionnalités avancées de gestion DNS pour l'optimisation des performances et de la sécurité.

<a href="https://fr.wikipedia.org/wiki/Cloudflare">wiki Cloudflare</a><br> 
<a href="https://www.cloudflare.com/fr-fr/learning/what-is-cloudflare/">Qu'est ce que Cloudflare</a>

Une fois sur le site Cloudflare, nous allons créer un compte et se rendre sur l'option : ajouter un site. <a href="https://developers.cloudflare.com/fundamentals/setup/manage-domains/add-site/">Documentation</a>

Avant de paramétrer les enrgistrements DNS, il sera nécessaire de mettre à jour les serveurs DNS du nom de domaine dans Scaleway afin que les configurations qui vont être effectuées sur Cloudflare soient effectives.

Pour paramétrer les enregistrements DNS sur votre serveur Linux hébergé en ligne, vous devez généralement accéder à votre tableau de bord de gestion de domaine chez votre fournisseur de services DNS (comme GoDaddy, Cloudflare, Namecheap, etc.).<br> 
Voici comment procéder pour configurer un enregistrement DNS racine (root record) et un enregistrement DNS wildcard :

1. Accédez au tableau de bord de votre fournisseur de services DNS :
    - Connectez-vous à votre compte sur le site Web du fournisseur de services DNS.
    - Trouvez la section de gestion des DNS ou des enregistrements DNS pour votre domaine.

2. Ajoutez un enregistrement DNS racine (root record) :
    - Recherchez l'option pour ajouter un nouvel enregistrement DNS.
    - Sélectionnez le type d'enregistrement comme "A" (pour IPv4) ou "AAAA" (pour IPv6) selon vos besoins.
    - Dans le champ "Host" ou "Name", laissez-le vide ou utilisez "@" pour indiquer le domaine racine.
    - Dans le champ "Value" ou "Points to", entrez l'adresse IP de votre VPS.

3. Ajoutez un enregistrement DNS wildcard :
    - Pour créer un enregistrement DNS wildcard, utilisez "*" dans le champ "Host" ou "Name". Cela signifie que n'importe quel sous-domaine pointera vers la même adresse IP.
    - Configurez également cet enregistrement comme un enregistrement "A" ou "AAAA", selon vos besoins.
    - Entrez l'adresse IP de votre VPS dans le champ "Value" ou "Points to".

4. Validez et sauvegardez les modifications :
    - Après avoir ajouté ces enregistrements DNS, assurez-vous de sauvegarder vos modifications ou de les publier, selon l'interface de votre fournisseur DNS.
    - Les modifications peuvent prendre un certain temps pour se propager à travers les serveurs DNS, donc soyez patient. Cela peut prendre quelques minutes à quelques heures.

Une fois ces étapes terminées, votre domaine devrait être configuré pour pointer vers l'adresse IP de votre VPS, et le record wildcard permettra à tous les sous-domaines de résoudre également vers cette adresse IP.

Si HTTP : port par défaut = 80<br>
Si  HTTPS : port par défault = 443

Pour contrôler que tout fonctionne bien, on va utiliser notre terminal avec la commande : 
```bash
$ dig <nom_de_domaine.com>
```
Qui doit nous retourner une réponse comme suit :
```bash
; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> <url_/_nom_de_domaine>
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14318
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 65494
;; QUESTION SECTION:
;<url_/_nom_de_domaine>.			IN	A

;; ANSWER SECTION:
<url_/_nom_de_domaine>.		300	IN	A	<adresse_ip_du_serveur>

;; Query time: 12 msec
;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)
;; WHEN: Thu Apr 25 08:58:15 UTC 2024
;; MSG SIZE  rcvd: 57

```

Puis on va relancer le conteneur nginx du serveur :
```bash
sudo docker run -d -p 80:80 nginx
```
Ici, on indique que le port d'écoute du conteneur nginx à l'adresse IP du serveur est le suivant : `http://<adress_ip_du_serveur>:80`<br>
Si on se rend à cette adresse, on pourra retrouver notre page d'accueil du serveur nginx.<br>
Traduit avec l'url, on aura simplement à se rendre à l'adresse paramétrée du DNS. `http://url_du_site`

#### Mise en place de Traefik

Le monde du déploiement d’applications web modernes est complexe et en constante évolution.<br> 
L’architecture des applications s’est déplacée des monolithes vers des microservices, et avec cette évolution, la nécessité d’outils de gestion plus sophistiqués s’est accrue.<br> 
C’est ici qu’interviennent les concepts de Reverse Proxy et d’outils comme Traefik.

Un reverse proxy est un serveur qui se trouve entre les clients et les serveurs web.<br> 
<a href="https://fr.wikipedia.org/wiki/Proxy_inverse">Wikipedia Proxy Inverse</a><br>
Il reçoit toutes les requêtes client et décide à quel serveur back-end les transmettre.<br> 
Les avantages sont :
- **Équilibrage de charge :** Distribue les requêtes entrantes entre plusieurs serveurs.
- **Cache :** Stocke du contenu souvent demandé pour réduire la charge sur les serveurs.
- **Sécurité :** Masque la structure et les détails du réseau interne.
- **Compression :** Réduit la taille des réponses pour accélérer les temps de chargement.
- **SSL/TLS Termination :** Décharge les serveurs back-end du coût de la gestion du trafic crypté.

**Qu'est ce que Traefik ?**

Traefik est un reverse proxy moderne conçu pour les architectures basées sur des conteneurs comme Docker, Kubernetes, etc.<br> 
Il est spécialement conçu pour s’adapter à des environnements dynamiques.<br>
<a href="https://doc.traefik.io/traefik/">https://doc.traefik.io/traefik/</a>

**Comment est-ce que Traefik fonctionne concrètement ?**

Traefik est composer des différents composants suivant : 
- **Entrypoint :** 
Les "Entrypoints" sont les points d'entrée du réseau vers Traefik. Ils définissent sur quelles adresses et ports le reverse proxy doit écouter pour les connexions entrantes.<br> 
Importance : 
  - Permet d'établir les ports sur lesquels Traefik écoute. 
  - Vous pouvez définir plusieurs entrypoints, par exemple, un pour HTTP et un autre pour HTTPS. 

- **Router :** Les "Routers" prennent les décisions de routage. Ils reçoivent les requêtes des entrypoints et les acheminent vers les services internes en fonction des règles de routage configurées.<br> 
Importance : 
  - C’est dans ce composant qu’on définit les règles de routage (si l’entrypoint reçoit une requête avec le host “www.test.com”), alors c’est toi qui prend la requête et qui va l’acheminer vers le service associé. 
  - Permettent l'application de middleware pour des fonctionnalités comme la redirection, le taux de requêtes, etc. 

- **Service :** Les "Services" sont les points de terminaison auxquels les routeurs de Traefik acheminent le trafic. Un service peut être un conteneur Docker, un pod Kubernetes, une machine virtuelle, etc.<br>
Importance : 
  - Fournissent des algorithmes d'équilibrage de charge pour distribuer efficacement le trafic. 
  - Sont découverts dynamiquement dans des environnements comme Docker et Kubernetes. 

- **Middleware :** Les "Middlewares" sont des composants qui peuvent manipuler les requêtes et/ou les réponses pour ajouter des fonctionnalités comme la redirection, la limitation du taux, l'authentification, etc.<br>
Importance : 
  - Ajoutent une couche de fonctionnalités supplémentaires entre le routeur et le service. 
  - Sont extrêmement flexibles et peuvent être chaînés pour des fonctionnalités complexes.


De ce fait, il est un bon outil dans notre cas car la configuration et l’ajout de nouveaux services / conteneurs ne nécessitent pas le redémarrage de celui-ci.

Pour cela, on va devoir paramétrer Traefik pour qu’il puisse :
1. Générer les certificats TLS (pour le HTTPS) à la volé en utilisant l’ACME provider Let’s Encrypt avec le DNS challenge de Cloudflare
2. Ecouter sur le port 80 et 443 de votre VPS
3. Mettre à disposition le Dashboard Traefik, qui sera accessible via l’url https://traefik.. Pour pouvoir accéder à ce dashboard, il faudra configurer un middleware de type basicauth afin de pouvoir s’authentifier

##### GUIDE ETAPE PAR ETAPE :

Pour configurer Traefik pour générer des certificats TLS à la volée en utilisant Let's Encrypt avec le DNS challenge de Cloudflare dans un environnement Docker à l'aide d'un fichier `docker-compose.yml`.<br>
<a href="https://hub.docker.com/_/traefik">Official Docker Image</a>

Créer ensuite un fichier `docker-compose.yml` :<br> 
On s'inspire de ce <a href="https://www.alexandre-hublau.com/fr/posts/it/creer-environnement-docker-traefik/">tuto</a><br>
(N.B. : bien penser à modifier `<nom_de_domaine>` et `<votre@email.com>`)
```yaml
services:
    traefik:
        image: traefik:latest
        restart: always
        ports:
            - "80:80"
            - "443:443"
            - "8080:8080"
        command:
            - --api.insecure=true
            - --api.dashboard=true
            - --api.debug=true
            - --log.level=DEBUG

            - --providers.docker
            - --providers.docker.exposedbydefault=false
            - --providers.docker.network=traefik-public

            - --entrypoints.http.address=:80
            - --entrypoints.https.address=:443

            - --certificatesresolvers.le.acme.tlschallenge=true
            - --certificatesresolvers.le.acme.email=<votre@email.com>
            - --certificatesresolvers.le.acme.storage=/letsencrypt/acme.json
        labels:
            - "traefik.enable=true"

            - "traefik.docker.network=traefik-public"

            - "traefik.http.middlewares.http_to_https.redirectscheme.scheme=https"
            # - "traefik.http.middlewares.http_to_https.redirectscheme.permanent=true"

            - "traefik.http.middlewares.auth.basicauth.users=user:$$2y$$05$$TglxTe1egPQ5cmPRTzbOtOUWyUHzmAoU9Pt4TeuNEC.68BZRjugHm"

            - "traefik.http.routers.dashboard.rule=Host(`dashboard.<nom_de_domaine>`)"
            - "traefik.http.routers.dashboard.entrypoints=http"
            - "traefik.http.routers.dashboard.middlewares=http_to_https@docker"

            - "traefik.http.routers.dashboard-secured.rule=Host(`dashboard.<nom_de_domaine>`)"
            - "traefik.http.routers.dashboard-secured.service=api@internal"
            - "traefik.http.routers.dashboard-secured.entrypoints=http,https"
            - "traefik.http.routers.dashboard-secured.tls.certresolver=tls"
            - "traefik.http.routers.dashboard-secured.middlewares=auth@docker"

        volumes:
            - ./letsencrypt:/letsencrypt
            - /var/run/docker.sock:/var/run/docker.sock
        networks:
            - traefik-public
        environment: 
            - CLOUDFLARE_EMAIL=<votre@email.com>
            - CLOUDFLARE_API_KEY=11e61f9ff478dc9d03f5394e1e16a87e971e7


volumes:
    traefik-public-certificates:

networks:
    traefik-public:
        external: true
```
**Pour BasicAuth, générer un nom d'utilisateur et mot de passe :**<br>
On utilisera pour cela dans le terminal local la commande :
```bash
echo $(htpasswd -nB user) | sed -e s/\\$/\\$\\$/g
```
le résultat de cette commande sera ceci : 
```bash
New password: 
Re-type new password: 
user:$$2y$$05$$TglxTe1egPQ5cmPRTzbOtOUWyUHzmAoU9Pt4TeuNEC.68BZRjugHm
```
On nous demande un nouveau mot de passe ainsi que la confirmation du premier mot de passe.<br>
Le retour est un hashage correspondant à l'utilisateur "user".

**Configuration des informations d'authentification Cloudflare :**
Vous devez fournir les informations d'authentification Cloudflare à Traefik pour qu'il puisse effectuer le DNS challenge.<br> 
Pour ce faire, définissez les variables d'environnement suivantes (ou utilisez les valeurs dans votre fichier de configuration) :
```bash
export CLOUDFLARE_EMAIL="votre@email.com"
export CLOUDFLARE_API_KEY="votre_clé_api_cloudflare"
```
Pour trouver votre clé API Cloudflare, suivez ces étapes :
- **Connectez-vous à votre compte Cloudflare :** <br>
Rendez-vous sur le site web de Cloudflare et connectez-vous à votre compte en utilisant vos identifiants.
- **Accédez à la page des paramètres de votre compte :**<br> 
Une fois connecté, cliquez sur votre nom d'utilisateur dans le coin supérieur droit de la page pour accéder au menu déroulant. Ensuite, sélectionnez "Mon profil".
- **Accédez à la section "API Tokens" :**<br> 
Dans votre profil, recherchez et cliquez sur l'onglet "API Tokens" ou "Clés API".
- **Générez une nouvelle clé API :**<br> 
Si vous n'avez pas encore créé de clé API, vous devrez en générer une nouvelle.<br> 
Pour cela, cliquez sur le bouton "Créer Token" ou "Create API Key".
- **Configurez les autorisations de la clé API :**<br> 
Cloudflare vous demandera de configurer les autorisations de la clé API.<br> 
Assurez-vous de donner les autorisations appropriées en fonction de ce que vous prévoyez de faire avec cette clé.<br> 
Pour l'utilisation du DNS challenge dans Traefik, vous aurez besoin d'autorisations pour modifier les enregistrements DNS.
- **Copiez votre clé API :**<br> 
Une fois que vous avez configuré les autorisations, Cloudflare vous fournira une clé API générée.<br> 
Copiez cette clé et conservez-la en lieu sûr. Cette clé sera utilisée dans la configuration de Traefik pour permettre le DNS challenge avec Cloudflare.

Une fois ces étapes réalisées, on va pouvoir entrer la commande :
```bash
docker compose up -d
```
Cela va lancer le conteneur Docker avec toutes les dépendances.<br>

5. **Vérification et gestion des certificats :**
Traefik doit maintenant être en mesure de contacter l'API Cloudflare pour créer et renouveler automatiquement les certificats TLS via le DNS challenge.<br> 
Vous pouvez vérifier l'état des certificats dans l'interface d'administration Traefik ou en consultant les journaux. 

On pourra donc se rendre à l'adresse : `http://dashboard.<nom_de_domaine>` pour accéder au dashboard.<br>
N.B. : La configuration de Traefik qu'on a effectuée ci dessus été faite telle qu'une requête vers http redirige vers https.<br>
Ou se rendre sur les logs en entrant la commande suivante :
```bash
sudo docker logs -f <nom_du_conteneur>
```
#### Configuration de nginx :

Une fois Traefik correctement configuré et que le dashboard est accessible, vous devrez écrire une un fichier `docker-compose.yml` avec une configuration spécifique pour lancer un conteneur Nginx et qu’il soit accessible en HTTPS à l’adresse `https://nginx.<nom_de_domaine>`

