# PHP

## INTRODUCTION

### Le fonctionnement d'un site web :

Lorsqu'on visite un site web, on tape l'adresse dans le navigateur web.<br>
Mais comment fait la page web pour arriver jusqu'à nous ?<br>

Internet est un réseau composé d'ordinateurs qui sont classés en deux catégories :
* Les **clients** : ordinateurs des internautes. Chaque client représente un visiteur d'un site web.<br>
HTML, CSS et Javascript sont des langages clients. 
* Les **serveurs** : ordinateurs puissants qui stockent et délivrent des sites web aux clients.<br>
Ces ordinateurs sont indispensables au bon fonctionnement du web.<br>
Il existe plusieurs langages serveur, dont PHP.

la consultation d'un site statique se passe en deux temps : 
1. Le client demande au serveur à voir une page web.
2. Le serveur lui répond en lui envoyant la page réclamée.

![](./img/transf-site-statique.png)
La communication est basique.

La consultation d'un site dynamique utilise une étape intermédiaire : la page est **générée** :
1. Le client demande au serveur à voir une page web.
2. Le serveur prépare la page spécialement pour le client (il la génère).
3. Le serveur lui envoie la page qu'il vient de 

![](./img/transf-site-dynamique.png)
la page web est générée à chaque fois qu'un client la réclame.<br>
C'est précisément ce qui rend les sites dynamiques "vivants" : le contenu d'une même page peut changer d'un instant à l'autre.

C'est là que le PHP entre en jeu.

### QU'EST-CE QUE PHP ?

PHP est un accronyme pour PHP Hypertext Processor qui s'exécute uniquement côté serveur.<br>
C'est un langage de scripts généraliste et Open Source, spécialement conçu pour le développement d'applications web.<br>
Il peut être intégré facilement au HTML.<br>
Son rôle est de générer des pages web, cependant, seul un serveur peut lire du PHP, et l'ordinateur du client n'est pas un serveur.<br> 

Le PHP est principalement conçu pour servir de langage de script côté serveur.<br>
Il est capable de réaliser tout ce qu'il script CGI quelconque peut faire, voici quelques exemples :
* collecter des données de formulaire
* générer du contenu dynamique
* gérer des cokkies

Afin de pouvoir lire du PHP, l'ordinateur doit donc se comporter comme un serveur.<br>
Pour cela, on doit installer les mêmes programmes que ceux que l'on trouve sur les serveurs qui délivrent les sites web aux internautes.<br>

Ces programmes viendront compléter les autres programmes qui vont nous permettre d'éditer du texte et de visualiser les pages web.<br>

#### L'IDE (Editeur de Texte)

On pourra utiliser celui avec lequel on a le plus d'affinité : Notepad++, VSCode, PHPStorm...

#### Le Navigateur

Le navigateur est communément appelé le client.<br>
Il va nous permettre de visualiser la page web.<br>
On peut utiliser :
* Mozilla Firefox
* Google Chrome
* Microsoft Edge
* Safari
* Opera
* etc.

#### Apache 

C'est ce qu'on appelle un serveur web.<br>
Il s'agit du plus important de tous les programmes, car il est chargé de délivrer les pages web aux visiteurs.<br>
Apache ne gère cependant que les sites web statiques (il ne traite que des pages HTML).<br>
On doit donc le compléter avec d'autres programmes.

C'est ce logiciel qui gère les protocoles HTTP pour rendre lisible le langage SERVEUR vers le CLIENT.


#### PHP

C'est un _plug-in_ pour Apache qui le rend capable de traiter des pages web dynamiques en PHP.<br>
En combinant Apache et PHP, notre ordinateur sera capable de lire des pages web en PHP.<br>

#### MySQL

SGBD qui permet de gérer une BDD de manière organisée.

#### INSTALLATION DES PROGRAMMES

**LINUX**

Sous linux, on peut installer les programmes séparément.<br>
Il existe des packages tout prêts comme XAMPP (pour X (cross), Apache, MySQL, Perl, PHP)<br>
anciennement connu sous le nom de LAMPP.

_N.B. : à noter que XAMPP fonctionne également sous Windows_

le DL du package XAMPP est disponible ici : https://www.apachefriends.org/fr/index.html

Après avec téléchargé XAMPP, ouvrir un terminal.<br>
et naviguer pour se retrouver dans le dossier Downloads.<br>

Voici les commandes à utiliser pour instaler XAMPP  : 

```bash
sudo su
```

```bash
chmod 755 xampp-linux-*-installer.run
```

```bash
./xampp-linux-*-installer.run
```

Bien changer l'étoile dans la commande par le numéro de version du fichier téléchargé.

Pour démarrer XAMPP :
```bash
/opt/lampp/lampp start
```
Pour arrêter XAMPP :
```bash
/opt/lampp/lampp stop
```

Pour démarrer le xampp control panel :
```bash
sudo /opt/lampp/manager-linux-x64.run
```