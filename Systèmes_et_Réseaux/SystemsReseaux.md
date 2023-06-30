# SYSTEMES ET RESEAUX

Cours de William Burillon :<br>
https://cours-systemes-reseaux.williamburillon.com/#/c/readme 

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

1. La sécurité
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
```bashhttps://cours-systemes-reseaux.williamburillon.com/#/c/readmeet (216.58.214.174): icmp_seq=3 ttl=117 time=12.0 ms
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
https://www.noodo-wifi.com/faq/adresse-mac/ <br>
L'adresse MAC (Media Access Control) est l'adresse physique d'un périphérique réseau.<br>
Une adresse MAC est sensée être unique au monde. C'est une sorte de plaque d'immatriculation d'un appareil électronique.<br>
Elle peut être modifiée dans certains cas mais c'est assez rare car elle est activée dès la fabrication en usine.<br>
L'adresse MAC se présente sous la forme suivante : XX.XX.XX.XX.XX.XX<br>
Les 12 caractères sont des aplhanumériques de 0 à 9 et de A à F.<br>
Les 6 premiers chiffres permettent d'identifier le fabricant de l'appareil.<br>

**Qu'est-ce qu'une adresse IP ?**<br>
https://fr.wikipedia.org/wiki/Adresse_IP <br>
L'adresse IP (Internet Protocol) est un numéro d'identification unique attribué de façon permanente (ou provisoire) à chaque périphérique faisant partie d'un réseau informatique utilisant l'Internet Protocol.<br>
L'adresse IP est à l'origine du système d'acheminement (le routage) des paquets de données sur internet.<br>
Il existe deux grandes versions d'adresses IP :
* IPV4 (IP Version 4) : codée en 32 bits.<br> 
C'est la plus utilisée, généralement représentée en notation décimale avec 4 nombres compris entre 0 et 255, séparés par des points.<br>
_ex: 181.174.87.53_
* IPV6 (IP Version 6) : codée en 128 bits.

```
Explication de l'adresse IP :
L'IPV4 est codée en 32 bits. 
C'est à dire que les 4 séries de nombres représentent un total de 32 bits.
Donc : 181.174.87.53 représente une série de : <[8 bits] . [8 bits] . [8 bits] . [8 bits]>

```
**Tableau de conversion d'un décimal en binaire.**<br>
Le tableau ci-dessous 
(|1bit|1bit|1bit|1bit|1bit|1bit|1bit|1bit|): 
|  | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
|-|-|-|-|-|-|-|-|-|
| numéro 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| numéro 2 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| numéro 3 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| ... |  |  |  |  |  |  |  |  |
| numéro 9 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| numéro 10 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | 0 |
| ... |  |  |  |  |  |  |  |  |
| numéro 20 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| numéro 21 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 1 |

**Interprêtation du tableau :** <br>
Le numéro 10, ici, se décompose en 8 + 2, on l'écrira donc en binaire : 0 0 0 0 1 0 1 0.<br>
N.B. : 1 octet = 8 bits. les données en binaires sont stockées par groupes de 8 bits.<br>
Le nombre 10 est représenté en langage binaire par : 00001010 => il prendra 4 bits d'espace mémoire.<br>
la somme : 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 (valeur décimale maximale sur 8 bits)<br>

Une adresse IPV4 est codée en 32 bits : 4 groupes de 8 bits (4 x 8 = 32) (ou un total de 4 octets)<br>
un espace de 8 bits peut contenir jusqu'à 256 valeurs différentes :<br>
[0 à 255].[0 à 255].[0 à 255].[0 à 255]<br>

L'adress IPV4 192.168.1.0 indique l'adresse du réseau.<br>
On va pouvoir avoir jusqu'à 253 entités sur ce réseau :<br>
192.168.1.[1 à 254]<br>
la dernire adresse : 192.168.1.255 indique l'adresse de broadcast : elle permet de communiquer avec toutes les entités du réseau. (on envoie un message à cette adresse pour le communiquer à toutes les entités)<br>

#### Comment tester la bonne configuration et la communication entre deux machines ?

https://web.maths.unsw.edu.au/~lafaye/CCM/outils-reseau/ping.htm 

On utilise l'outil **"PING"** (Packet INternet Groper).<br>
Cet outil simple permet de vérifier, par l'envoi de paquets, si une machine distante répond et qu'elle est accessible par le réseau.<br>
L'outil **ping** permet de diagnostiquer la connectivité réseau grâce à une commande type :<br>
ping nom.de.la.machine<br>

N.B. : nom.de.la.machine représente l'adresse IP de la machine, son nom ou encore un nom de domaine.

Cet outil s'appuie sur le protocole ICMP (Internet Control Message Protocol) qui permet de diagnostiquer les conditions de transmissions.<br>
Il permet de signaler les erreurs. Il est utilisé par les appareils de réseau comme les routeurs  pour générer des messages d'erreurs à l'adresse IP source lordque des problèmes de réseau empêchent la livraison de paquets IP.<br>
L’Internet Control Message Protocol crée et envoie des messages à l’adresse IP source indiquant qu’une passerelle vers l’internet qu’un routeur, un service ou un hôte ne peut pas être atteint pour la livraison de paquets.<br> 
Tout dispositif de réseau IP a la capacité d’envoyer, de recevoir ou de traiter des messages ICMP.
(Pour plus d'informaiton : suivez ce <a href="https://actualiteinformatique.fr/definition/definition-icmp-internet-control-message-protocol">lien</a>)

**la commande :**
```bash
ping 172.217.20.174
```
_renvoie :_
```bash
PING 172.217.20.174 (172.217.20.174) 56(84) bytes of data.
64 bytes from 172.217.20.174: icmp_seq=1 ttl=117 time=11.9 ms
64 bytes from 172.217.20.174: icmp_seq=2 ttl=117 time=11.9 ms
64 bytes from 172.217.20.174: icmp_seq=3 ttl=117 time=12.1 ms
64 bytes from 172.217.20.174: icmp_seq=4 ttl=117 time=12.1 ms 
...
--- 172.217.20.174 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 12.011/12.037/12.086/0.029 ms
```
elle renvoie un 'ping' vers l'adresse ip spécifiée, le message de retour indique le temps que ce message a mis.<br>
**l'adresse IP** correspondante au nom de la machine distante.<br>
**icmp_seq** indique le numéro séquence ICMP.<br>
**ttl** (= The Time To Live) indique la durée de vie du paquet : permet de connaître le nombre de routeurs traversés par le paquet lors de l'échange entre les deux machines.<br>
chaque paquet IP possède un champ TTL positionné à une valeur relativement grande.<br>
**time** est le temps nécessaire pour que le paquet puisse atteindre l'hôte distant (IP de l'hôte) et faire le chemin retour pour revenir à notre machine. (exprimé en millisecondes).
**nombre de paquets envoyés et reçus**, et donc le nombre de paquets perdus.

**la commande :**
```bash
ping 192.0.2.255 
```
_renvoie : (après interruption)_
```bash
PING 192.0.2.255 (192.0.2.255) 56(84) bytes of data.
^C
--- 192.0.2.255 ping statistics ---
4 packets transmitted, 0 received, 100% packet loss, time 3052ms
```
On a dû interrompre le protocole dans ce cas.<br>
Cette commande ne renvoie pas de retour. puisque 255 indique l'adresse de broadcast, uniquement utilisée pour envoyer des données.<br>

#### Lorsqu'on a un serveur et plusieurs machines ?

Notre serveur de stockage comporte un seul port RJ45.<br>
Si on a plusieurs PC (ou entités) qui doivent être connectées, on va devoir ajouter d'autres entités intermédiaires.<br>

* **La solution _"carte réseau"_** :<br>
https://www.inmac-wstore.com/guides-achat-composants-definition-role-carte-reseau/cp37684.htm <br>
La carte réseau d'un ordinateur permet de se connecter à internet et au réseau local.<br>
Elle est installée sur la carte-mère et se connecte au réseau via un adaptateur USB-Ethernet ou un cable RJ45.<br>
Ajouter une carte réseau supplémentaire limite le nombre de machines qu'on peut connecter au nombre de ports RJ45 de la carte.<br>
Cela comporte un problème d'espace physique. 

* **La solution _"switch"_** :<br>
https://fr.wikipedia.org/wiki/Commutateur_r%C3%A9seau <br>
un switch (ou commutateur réseau) permet de relier plusieurs segments dans un réseau informatique et permet de créer des circuits virtuels.<br>
En réseau local (LAN), il s'agit d'un boitier disposant de plusieurs ports RJ45 (entre 4 et plusieurs centaines), comme un hub.<br>

#### Connecter 2 réseaux

L'adresse IP d'un réseau d'apparente à ceci : 192.168.0.0<br>
les deux dernières séries de nombres :<br>
* le premier [0] indique le numéro de réseau.
* le deuxième [0] indique l'adresse du réseau sur le réseau.

La première entité sur ce réseau aura pour adresse IP 192.168.0.1,<br>
La deuxième aura pour adresse IP 192.168.0.2, etc.<br>

Dans chaque cas, il faut indiquer le SebnetMask (le masque) :<br>
indiquant le nombre maximum de machines disponibles : 255.255.255.0

Une adresse IP écrite comme ceci : 192.168.0.1/24 (adresse IP écrite en 24bits)<br>
équivaut à une adresse IP écrite comme ça :<br>
192.168.0.1<br>
255.255.255.0<br>

Ceci dépendra de la classe du Subnet Mask.<br>


Il est nécessaire d'indiquer le SubnetMask afin d'identifier la partie de l'adresse IP qui correspond à l'adresse du réseau.<br>
c'est à dire que l'adresse IP se décompose en 2 parties :<br>
[192.168.0][.1] = première partie indique l'adresse réseau, et la deuxième l'adresse de l'entité sur le réseau.

explications plus détaillées SubnetMask <a href="https://avinetworks.com/glossary/subnet-mask/">ici</a>

Afin de connecter la machine à un routeur, on va devoir lui indiquer la Default Gateway.<br>
La default gateway est l'adresse IP qui indique au routeur l'adresse du réseau.<br>
Cette adresse sera écrite comme ceci : 192.168.0.254<br>
C'est l'avant dernière adresse disponible (dernière se termine par 255 = adresse broadcast).<br>

Nous avons donc deux réseaux : `192.168.0.0` et `192.168.100.0`.<br>
Afin de les connecter, on va faire appel à un routeur.<br>
Ce routeur, cablé aux deux switchs, devra renseigner les adresses IP des deux réseaux de cette manière : (attention, bien faire attention au numéro de port du câble RJ45)<br>
* Ethernet 0/0/0 : IPV4 = 192.168.0.254 ; Subnet Mask = 255.255.255.0
* Ethernet 0/0/1 : IPV4 = 192.168.100.254 ; Subnet Mask = 255.255.255.0

Ainsi, les messages envoyés depuis le réseau 192.168.0 seront identifiés comme tel,<br>
et les messages envoyés depuis l'autre réseau 192.168.100 aussi.<br>

## Les modèles OSI et TCP/IP

Il existe deux grandes familles de règles dans le monde des réseaux informatique :<br>
* règles liées à l'aspect matériel = les normes.
* règles liées à l'aspect logiciel = les protocoles.

Concernant les règles d'harmonisation des normes :<br> 
* on a vu les choix des connecteurs :câbles RJ45 (cuivre),<br> 
* et les contraintes d'attribuer les adresses IP aux machines sur un réseau.

`ATTENTION LISTE NON EXHAUSTIVE`

### Le modèle OSI 

<a href="https://www.cloudflare.com/fr-fr/learning/ddos/glossary/open-systems-interconnection-model-osi/">Source</a>

Le modèle OSI (Open Systems Interconnection) est un modèle créé par l'ornganisation internationale de normalisation.<br>
Ce modèle permet de normaliser la communication entre systèmes informatiques à l'aide de protocoles standards.<br>

Ce modèles est un langage universel pour la mise en réseau d'ordinateurs.<br>

**Les différentes couches du modèles OSI** : il y en a 7<br>

7. **Couche applicative** :<br>
C'est la seule couche qui interagit directement avec les données utilisateur.<br>
Les applis logiciel telles que les navigateurs web et les clients e-mail se servent de cette couche pour initier les communications.<br>
N.B. : les applis logicielles ne font pas partie de la couche applicative.<br>
Cette couche est responsable des protocoles et de la manipulation des données sur lesquels le logiciel s'appuie pour présenter des données significatives à l'utilisateur.<br>
Les protocoles de cette couche incluent : HTTP et SMTP (Simple Mail Transfer Protocol = pour le courrier électronique).<br>
6. **Couche de présentation** :<br>
Elle est responsable de la présentation des données afin qu'elles puissent être utilisées par la couche applicative.<br>
C'est à dire qu'elle rend les données présentables pour les applications. Elle est responsable de la traduction, du chiffrement et de la compression des données.<br>
5. **Couche de session** :<br>
Cette couche est reponsable de l'ouverture et de la fermeture de la communication entre deux appareils.<br>
L'intervalle entre l'ouverture et la fermeture de la communication est appelée session.<br>
Cette couche garantit que la session reste ouverte suffisamment longtemps pour transférer toutes les données échangées, puis ferme rapidement la session afin d'éviter le gaspillage de ressources.<br>
Elle synchronise également le transfert de données avec les points de contrôle.<br>
4. **Couche de transport** :<br>
La couche 4 est responsable de la communication de bout en bout entre les deux appareils.<br>
Cela inclut la récupération de données de la couche session et leur décomposition en morceaux appelés segments avant de les envoyer vers la couche réseau.<br>
Elle est également responsable du contrôle des flux et des erreurs. (détermination de la vitesse optimale de transmission pour éviter qu'un émetteur en submerge un autre s'ils n'ont pas les mêmes vitesses de connexion).<br>
Enfin, elle s'assure que les données reçues sont complètes et demande la retransmission si ce n'est pas le cas.<br>
3. **Couche réseau** :<br>
Elle est chargée de faciliter le transfert de données entre deux réseaux différents.<br>
Elle divise les segments de la couche transport en unités plus petites : les paquets, sur le périphérique de l'expéditeur et réassemble ces paquets sur le périphérique récepteur.<br>
Enfin, elle trouve le meilleur chemin physique pour que les données atteignent leur destination : c'est le routage.<br>
2. **Couche de liaison de données** :<br>
Cette couche est similaire à la couche réseau, à la différence qu'elle facilite le transfert de donées entre deux périphériques d'un même réseau.<br>
elle prend les paquets de la couche réseau et les divise en fragments plus petits appelés images.<br>
Elle est également responsable du contrôle des flux et des erreurs dans les communications intra-réseau.<br>
1. **Couche physique** :<br>
Elle inclut les équipements physiques impliqués dans le transfert de données (câbles, commutateurs).<br>
C'est dans cette couche que les données sont converties en binaire.<br>
Elle doit aussi cenvenir d'une convention de signal pour distinguer le binaire des deux périphériques.<br>

**Importance du modèle OSI** : <br>
Ce modèle permet de dépanner les problèmes réseaux en isolant la source du problème.<br>
C'est à dire qu'on peut identifier sur quelle couche se situe le problème, et donc de résoudre le problème plus rapidement.<br>

### Le modèle TCP/IP

<a href="https://www.fortinet.com/fr/resources/cyberglossary/tcp-ip">Source</a>

**le protocole TCP** est une norme de communication qui permet aux programmes et aux entités d'échanger des messages sur un réseau.<br>
Il permet d'envoyer des paquets sur internet et d'assurer la transmission effective des données et des messages via les réseaux.<br>

**le protocole IP** est la méthode utilisée pour envoyer des données d'un appareil à un autre via Internet.<br>
Il s'appuie sur les adresses IP des entités et leur permet d'échanger des données entre elles.<br>

**La différence entre TCP et IP ?** :<br>
Ce sont des protocoles distinct qui permettent ensemble de garantir la transmission des données à leur destination au sein d'un réseau.<br>
* Le protocole IP obtient et définit l'adresse (IP) de l'entité.<br>
* Le protocole TCP veille au transport des données et permet d'assurer qu'elles sont transmises à l'entité de destination défini par le protocole IP.<br>

**Le protocole TCP/IP** est composé de 4 couches :<br>
1. **Couche de liaison de données (hôte-réseau):**<br>
elle définit la manière dont les données doivent être envoyées, gère l’acte physique d’envoi et de réception des données,<br> 
et assure la transmission des données entre les applications ou les périphériques sur un réseau.<br>
Elle détermine également la manière dont les données doivent être signalées par le matériel et d’autres dispositifs de transmission sur un réseau.<br>
Elle équivaut à la combinaison des couches physique et de liaison des données du modèle OSI.<br>
2. **Couche Internet :**<br>
elle permet l’envoi de paquets à partir d’un réseau et contrôle leur mouvement à travers un réseau afin de s’assurer qu’ils atteignent leur destination.<br> 
Elle offre les fonctions et les procédures de transfert des séquences de données entre les applications et les périphériques sur les réseaux.<br>
Elle correspond à la couche réseau du modèle OSI.<br>
3. **Couche transport :**<br>
elle permet d’établir une connexion de données de qualité et fiable entre l’application ou le périphérique d’origine et sa destination prévue.<br>
la couche transport détermine la quantité de données à envoyer, leur destination et leur débit.<br>
Elle correspond à la couche transport du modèle OSI.<br>
4. **Couche application :**<br>
elle fait référence aux programmes qui ont besoin de TCP/IP pour les aider à communiquer entre eux.<br>
Elle combine les couches session, présentation et application du modèle OSI.<br>

## Le DNS

**DNS** pour Domain Name System permet de faire la correspondance entre noms et adresses IP.<br>
Il existe deux types de noms pour identifier une machine :<br>
* Le nom de domaine : il sert à identifier un service comme un site web ou un stockage de fichier.<br>
* Le nom d'hôte (hostname) : est utilisé pour identifier la machine.<br>

Ainsi, le serveur DNS permet de stocker l'association entre le nom et l'adresse IP de la machine.<br>
