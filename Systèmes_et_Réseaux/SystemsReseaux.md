# SYSTEMES ET RESEAUX

## MODELES OSI

### Qu'est-ce qu'un réseau, qu'est-ce qu'internet ? Notions sur Internet et le Web.

De manière générale, un réseau est un ensemble d'entités inter-connectées.<br>

Le web doit être vu comme une toile d'araignée : on y voit touds les liens qui relient les pages entre elles. (via les liens hypertextes)<br>
C'est de cette manière que les sites webs sont reliés entre eux.<br>

Le web a été inventé au CERN en 1989 par Tim Berners-Lee.<br>

Internet, quant à lui, a été créé par l'armée américaine sous le terme ARPA.<br>

Internet est un réseau qui permet aux ordinateurs entre eux de communiquer entre eux.<br>
Il existe plusieurs services sur ce réseau :
* **Le Web** : accessible grâce à un navigateur web (Chrome, Firefox, Edge, Safari...).
* **Les emails** : permet d'échanger des messages = courrier électronique.
* **Les newsgroups** : ancêtre des forums.
* **Le FTP** : Moyen d'échanger des fichiers entre ordinateurs
* **Etc.**

Tous ces services convergent vers le web. Le web sert de porte d'entrée pour la plupart des services aujourd'hui.<br>

### Qu'est ce qu'une LAN ?

Une LAN est un réseau local. LAN = Local Area Network.<br>
Il s'agit d'un réseau informatique physique et/ou virtuel. Il permet d'interconnecter par wi-fi ou cables Ethernet des terminaux entre eux.<br>
Le LAN peut aussi se connecter à l'extérieur grâce à un accès Internet.<br>

Un réseau local ne signifie par forcément qu'il soit de petite taille : il peut regrouper des milliers d'utilisateurs et de périphérique (PC, Tel IP, Serveurs, imprimantes réseau...).<br>
Quelle que soit sa taille, une LAN relie des équipements situés dans une zone unique et limitée,<br> 
à la différence d'un réseau étendu type WAN (Wide Area Network) ou MAN (Metropolotan Area Network) qui utilisent généralement la fibre optique et couvrent une zone géographique plus importante.<br>

### Comment fonctionne une LAN ?

Le LAN constitue le premier réseau d'une entreprise. Il permet aux appareils de communiquer entre eux.<br>
Il permet aux salariés d'accéder à des services internes à l'entreprise.<br>
Pour cela, il faut relier tous les terminaux informatiques ou IP entre eux.<br>

Pour cela, on peut utiliser deux technologies :
* **L'Ethernet** : LAN Ethernet. Les entités sont reliées par le biais d'un câble éthernet branché sur le port adapté du terminal ou par une prise réseau.<br>
* **Le Réseau WI-FI** : LAN WI-FI. Les entités sont reliées sans fil.
Ces deux LAN peuvent cohabiter ou ne former qu'un seul et même réseau local.

Les autres équipements du réseau sont les **routeurs** et les **switchs**.<br>
Ils acheminent les informations ou paquets IP échangés sur les réseaux locaux : de la source au destinataire.<br>

#### Les avantages du LAN ?

1. La récurité
2. La simplicité : un seul LAN mais un accès internet commun.

#### Les différentes typo du réseau LAN ?

deux grandes catégories : 
* **client/serveur** : les terminaux (ou clients) se connectent à un serveur local qui assure la gestion des fichiers et du trafic, ou encore l'accès aux applis.
* **peer-to-peer(P2P)** : pas de serveur central. On a besoin de deux ordinateurs, d'un modem-routeur et d'une imprimante pour créer un LAN peer-to-peer.<br> 
Dans cette architecture chaque poste partage la responsabilité du fonctionnement du LAN. Ils échangent directement les ressources entre eux.

#### Qu'est ce que la commande PING ?

https://geekflare.com/fr/what-is-ping-and-command-examples/ 

La commande ping est une commande réseau.<br>
Elle permet de :
* Tester la connectivité réseau (local ou internet)
* Dépanner la carte d'interface réseau
* Teste les problèmes de résolution de noms DNS

lorsqu'on tape la commande :
```bash
ping google.com
```
le terminal retourne ceci : 
```bash
PING google.com (216.58.214.174) 56(84) bytes of data.
64 bytes from par10s42-in-f14.1e100.net (216.58.214.174): icmp_seq=1 ttl=117 time=12.1 ms
64 bytes from mad01s26-in-f14.1e100.net (216.58.214.174): icmp_seq=2 ttl=117 time=12.2 ms
64 bytes from par10s42-in-f14.1e100.net (216.58.214.174): icmp_seq=3 ttl=117 time=12.0 ms
64 bytes from mad01s26-in-f14.1e100.net (216.58.214.174): icmp_seq=4 ttl=117 time=12.0 ms
64 bytes from mad01s26-in-f14.1e100.net (216.58.214.174): icmp_seq=5 ttl=117 time=12.0 ms
```
Les informations indiquées sont les suivantes :<br>
* En premier vient le nom de domaine auquel on essaie de se connecter, et son adresse IP.<br>
* En second il envoie des paquets d'octers de données (en général 64) à la destination souhaitée.<br>
Notre terminal mesure la durée de réponse avec le terminal distant, ici, environ 12 millisecondes.

### Pour créer un réseau LAN :

#### Les machines / types de machines qui interviennent sur le réseau :

Il faut au moins deux terminaux (ordinateurs, entités).<br>
Un PC et un serveur peuvent constituer un réseau.<br>

#### Les supports de communication :

https://fr.wikibooks.org/wiki/Les_r%C3%A9seaux_informatiques/Les_supports_de_transmission

types de supports de connexion :
* **Câbles de Cuivre** :<br> 
**_Les câbles réseaux_** sont les plus simples. Des fils électriques entourés d'un isolant.<br>
ils permettent de transmettre n'importe quel signal électrique, codé sois avec une tension, sois avec un courant.<br>
De nos jours, la majorité des signaux sont codés avec une tension électrique :<br> 
on place une tension à un côté du câble, et la tension est rapidement transmise à l'autre bout.<br>
Ce type de transmission est très rapide, bien plus qu'avec un courant.<br>
Inconvénient : sensible aux perturbations électromagnétiques très fréquentes dans l'environnement.<br> 
Si la tension du fil est modifiée, les données transmises peuvent l'être aussi.<br> 
Il devient alors impossible de savoir quelle était la donnée transmise à la base.
**_Les câbles coaxiaux_** sont composés d'un fil conducteur, entouré d'un isolant, lui-même entouré d'une couche de conducteurs (le blindage), le tout enroulé d'une protection isolante.<br>
Ces câbles réseaux sont assez performants (débit de 56 Kb à plusieurs Gb).<br>
ils sont utilisés pour les réseaux locaux et pour les liaisons à plus grande distance.<br>
Pour éviter l'impact des perturbations, on peut utiliser deux fils = ligne bifilaire (deux fils torsadés, enroulés l'un autour de l'autre).<br>
* **Câbles Fibre optique** :<br>
Ce câbles transmettent des signaux par l'intermédiaire d'impulsions lumineuses.<br>
Ces impulsions sont émises à un bout de la fibre optique, se propagent dans la fibre optique jusqu'à l'autre bout et sont captées par un récepteur lumineux.<br>
La fibre optique est composée d'un coeur de matériau transparent, entouré d'une gaine de matériau lui aussi transparent, le tout entouré par une couche de plastique de protection.<br>
Le coeur a un indice de réfraction inférieur à celui de la gaine. Cela signifie que la lumière rebondit sur les parois de la gaine et se propage dans le coeur par rebonds.
* **Sans-fil** :<br>
Ce type de supports utilise les ondes électromagnétiques.<br>
La transmission des bits s'effectue via des techniques de modulation. L'émission et la réception des ondes se fait par des antennes intégrées dans toute carte sans fil.<br>
Les ondes s'atténuent avec la distance qu'elles parcourent : au delà d'une certaine distance, le signal transmis est trop faible pour être capté.<br>
la portée est donc limitée, là ou les cables sont capables d'avoir une portée bien plus longue.<br> 
Les murs et autres objets ont tendance à atténuer les ondes électromagnétiques qui les traversent, ce qui réduit l'amplitude du signal et diminue encore la portée.<br>
En conséquence, ces techniques d'émissions sont moins faibles que les transports par câble.<br>
Les longueurs d'ondes utilisées sont souvent :<br> 
_des ondes radios_ (ondes dont la fréquence est comprise entre 9 Khz et 300 Ghz),<br> 
_des micro-ondes_ (non utilisées dans les réseaux sans-fils),<br> 
_ou des ondes infrarouges_ (rarement utilisées sur des réseaux informatiques car elles ne traversent pas les murs).<br>

#### Comment identifier les machines au sein d'un réseau ?

**Qu'est-ce qu'une interface réseau ?**<br>
Il s'agit du point de connexion entre deux réseaux. C'est la partie qui assure la connexion entre un terminal utilisateur et un réseau (public ou privé).<br>

**Qu'est-ce qu'une adresse MAC ?**<br>
L'adresse MAC (Media Access Control) est l'adresse physique d'un périphérique réseau.<br>
Une adresse MAC est sensée être unique au monde. C'est une sorte de plaque d'immatriculation d'un appareil électronique.<br>
Elle peut être modifiée dans certains cas mais c'est assez rare car elle est activée dès la fabrication en usine.<br>
L'adresse MAC se présente sous la forme suivante : XX.XX.XX.XX.XX.XX<br>
Les 12 caractères sont des aplhanumériques de 0 à 9 et de A à F.<br>
Les 6 premiers chiffres permettent d'identifier le fabricant de l'appareil.<br>

**Qu'est-ce qu'une adresse IP ?**<br>
L'adresse IP (Internet Protocol) est un numéro d'identification unique attribué de façon permanente (ou provisoire) à chaque périphérique faisant partie d'un réseau informatique utilisant l'Internet Protocol.<br>
L'adresse IP est à l'origine du système d'acheminement (le routage) des paquets de données sur internet.<br>
Il existe deux grandes versions d'adresses IP :
* IPV4 (IP Version 4) : codée en 32 bits.<br> 
C'est la plus utilisée, généralement représentée en notation décimale avec 4 nombres compris entre 0 et 255, séparés par des points.<br>
_ex: 181.174.87.53_
* IPV6 (IP Version 6) : codée en 128 bits.