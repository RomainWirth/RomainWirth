# NODEJS

Node.js est une plateforme logicielle qui permet d'exécuter du JavaScript côté serveur.<br>
Il se démarque par l'utilisation d'un système de boucle d'événements qui permet l'exécution de manière asynchrone.<br>

Node est le runtime qui permet d'écrire toutes nos tâches côté serveur en JavaScript,<br>
telles que la logique métier, la persistance des données et la sécurité.<br>
Node ajoute également des fonctionnalités que le JS du navigateur ne possède pas,<br> 
comme l'accès au système de fichiers local.

Node est très fréquemment utilité pour écrire des API.<br> 
Node représente une alternative à des langages serveur comme PHP, Python ou encore Java.

## AVANTAGES

Quelques définitions :
* **RTA** : Real Time Applications = ce sont des applications en temps réel,<br> 
c'est-à-dire qui n'ont pas besoin d'être mises à jour fréquemment.
* **SPA** : Single Page Applications = ce sont des applications dans lesquelles il n'y a qu'une seule page html, 
le contenu de cette page change en fonction des actions de l'utilisateur.<br>
En général, on utilisera des frameworks comme Angular, Vue ou React pour créer ce genre d'applications web.<br>
* **Multithread et Single thread** :<br> 
Multithread = il s'agit de la capacité à effectuer plusieurs tâches en même temps = système multitâches.
Single thread = qui ne s'occupe que d'une seule tâche à la fois. = système unitâche.
* **Blocking et Non-blocking** : bloquant et non-bloquant.<br>
Un système est considéré comme bloquant s'il est obligé d'attendre la fin d'une tâche avant de commencer celle d'après.<br>
Un système non bloquant a la capacité à lancer une tâche sans forcément attendre qu'elle finisse pour passer à la suivante.<br>
Le système non bloquant pourra récupérer le résultat de la tâche quand elle sera finie.

Node est adapté aux RTA et SPA :
* Node est un système Single thread non bloquant :<br>
Si un client fait une requête d'un fichier au serveur alors il lance cette requête sans attendre le résultat.<br>
Il n'attend pas car il n'est pas bloquant. Si un autre client vient faire une autre requête,<br> 
il est tout de suite capable de traiter cette requête en même temps.
Cela rend les choses rapide pour les applications qui font beaucoup de requêtes de fichiers<br> 
car node est capable de gérer énormément de requêtes en parallèle sans les faire attendre les unes les autres.
* Node est flexible :<br>
Node.js est une plateforme très légère et ne possède pas de fonctionnalités déjà intégrées.<br>
C'est au choix : on greffe les modules qu'on souhaite utiliser.<br>
Pour cela, on va utiliser NPM (Node Package Manager).
* Node, c'est du javaScript :<br>
Pas besoin d'apprendre un nouveau langage. Cela est très pratique pour devenir un développeur Full Stack.

## NODE DOCUMENTATION :

<a href="https://grafikart.fr/tutoriels/javascript-server-nodejs-2080#autoplay">grafikart - JavaScript côté serveur</a>
<a href="https://nodejs.dev/fr/api/v20/documentation/">documentation officielle</a>
<a href="https://devdocs.io/node~18_lts/">documentation formatée</a>