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

<a href="https://www.ionos.fr/digitalguide/serveur/know-how/nginx-vs-apache/">nginx vs apache</a>
<a href="https://fr.linux-console.net/?p=5736#gsc.tab=0">apache vs nginx : considérations pratiques</a>

## Mise en production d'applications avec conteneurisation

