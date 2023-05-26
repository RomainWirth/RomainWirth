# Algorithmique - le fonctionnement des algorithmes

## Qu’est ce qu’un Algorithme ?

Un algorithme est une série d’instructions qui sont suivies étapes par étapes afin de réaliser quelque chose d’utile ou résoudre un problème.

ex: recette de cuisine, instructions pour monter un meuble Ikéa… 

En informatique, c’est un ensemble de méthodes utilisées par un ordinateur pour résoudre un problème de manière automatique et rapidement. 

ex d’algorithme utilisé quotidiennement :
le tri algorithmique des sites web (google, pages facebook, etc.)
algorithmes de géolocalisation (GPS) qui détermine le chemin le plus court d’un point A à un point B.

Un programme informatique est un ensemble d’instructions exécutables par un ordinateur qui lui permet de répondre à un problème que nous nous posons. Un programme est essentiellement créé à l’aide d’algorithmes. 
Il prend un ensemble de données en entrée, exécute des instructions et retourne des données de sortie. Une instruction est assimilée à une action, alors qu’un algorithme est composé de plusieurs instructions (donc de plusieurs actions). 

Il existe trois grandes séries d’instructions : 

- Les opérations de base : addition, soustraction, multiplication, division.
- L’exécution conditionnelle : si (condition), alors (fais ça), sinon (fais ça).
- L’itération : répéter une instruction, un nombre déterminé de fois.

## Comment se construit un programme ?

Un programme comporte un début et une fin. L’idée est de faire évoluer l’état de départ vers l’état de fin. 

- Identifier les éléments de départ, et l’état final dans lequel on souhaite les faire évoluer.
- Découper un problème en sous-problèmes.
- Décrire un algorithme en pseudo-code.

Le pseudo-code (ou LDA = Langage de Description d’Algorithme) est une manière informelle de décrire la programmation. Cela ne nécessite aucune syntaxe de langage et programmation stricte, ni aucune considération technologique.
Il s’agit du brouillon d’un programme qui opère selon une syntaxe :
```
Nom 
Début

Instruction 1
Instruction 2
etc.

Fin
```

## Communiquer avec un ordinateur

Afin de communiquer avec un ordinateur, il faut utiliser un langage. On parle de langage de programmation. 
En programmation structurée, on découpe un problème en micro tâches indépendantes les unes des autres, et modulaires.

### Les noms : les variables

Une variable est une manière de faire référence à un objet. Il s’agit d’un nom dans le langage courant.
Une variable a une valeur et un mot qui permet d’accéder à cette valeur :
Variable : Nom = Valeur

En pseudo-code, on peut déclarer la ou les variables dans une section dédiée :
```
Nom
Variables

variable 1
variable 2

Début
    Instructions
Fin
```

### Les verbes : les fonctions

La fonction est un bloc qui regroupe plusieurs actions. On peut utiliser ce bloc autant de fois qu’on le souhaite en invoquant son nom. 
La fonction va prendre des informations d’entrée, les traiter et en renvoyer d’autres en sortie. Il s’agit d’un mini algorithme. 

Elle est décomposée de cette manière : 

- NOM
- Paramètres d’entrée
- Instructions : étapes permettant de faire évoluer les paramètres d’entrée
- Paramètres de sortie

en pseudo code :
Nom(paramètres)
Début

Instructions

Fin

**N.B. : Dans le domaine du développement, il existe des notions d’efficacité et de propreté du code. cf. CLEAN CODE, Robert Cecil Martin (aka Uncle Bob, Ingénieur).** 

- **Une fonction doit avoir une seule responsabilité**
- **Elle ne doit pas être plus longue que 20 lignes de code (voir même 10, ou encore mieux, 5)**

## Les types de données les plus fréquents

Un ordinateur ne comprends pas de lui même la différence entre un nombre, une lettre ou un mot/phrase. Il faudra l’aider pour cela. 
Le type d’une variable permet de spécifier plusieurs paramètres nécessaire à l’ordinateur :

- la taille
- la disposition de la mémoire de la variable
- la plage de valeurs pouvant être stockées dans cette mémoire
- l’ensemble des opérations pouvant être appliquées à la variable

Un type de données est une classification qui indique à l’ordinateur comment on souhaite utiliser les données. 

Les trois types les plus fréquemment utilisés sont les nombres, les chaînes de caractères et les booléens.

### Les nombres :

Il en existe plusieurs sortes : 

- les nombres entiers (integer en anglais) : 1, 2, 5 etc.
- les nombres décimaux (float en anglais) : 1.5, 5.42, 10.952 etc.

### Les chaînes de caractères :

Une chaîne de caractères est composée d’un ensemble de caractères pouvant contenir des espaces et des chiffres. 

ex: “Algorithme”, “J’ai 2 frères”.

### Les booléens :

Un booléen est un type de données qui indique deux états : vrai ou faux (true or false).
Cela permet d’utiliser des conditions. Lorsqu’un souhaite vérifier la condition, c’est une information de type booléen qui est donné en réponse. 

On va ajouter cette information lors de la déclaration d’une variable. 

en pseudo code, cela sera représenté comme suit :
```
Nom
Variables
nombreEntier ← 0 : ENTIER
nombreFlottant ← : 0.0 : FLOAT
chaîneDeCaractères : CHAINE DE CARACTERES
booléen ← Faux : BOOL
```

## Les Structures conditionnelles

Les structures conditionnelles sont utilisées lorsqu’on doit prendre des décisions. 
Sur la base de ces décisions, on agit en conséquence. 

De cette manière, on saura si on doit lancer un bloc de code ou non. 

### Le mot clé Si :

en anglais “if”. C’est la structure de test la plus simple. Il est utilisé pour décider si une instruction particulière ou un bloc d’instructions sera exécuté ou non. 
Si une condition est vraie, alors un bloc d’instruction sera exécuté, sinon, non. 

en pseudo-code : 
```
Algorithme Si_structure 
Début
    Si le joueur est sur la case arrivée :
        afficher ‘Vous avez gagné !’
    Fin si
Fin
```

Pour tester une condition, on va utiliser des opérateurs de comparaison afin de comparer des paramètres du programme.
Pour effectuer ces tests, on utilise des symboles (communs à la plupart des langages de programmation) :

| Symbole | Signification |
| --- | --- |
| == | Est égal à |
| > | Est (strictement) supérieur à |
| < | Est (strictement) inférieur à |
| > =  | Est supérieur ou égal à |
| < =  | Est inférieur ou égal à  |
| ! =  | Est différent de |

en pseudo-code :

```
Algorithme Si_structure
Début
    Si joueur_coordonnées == arrivée_coordonnées :
        afficher ‘Vous avez gagné !’
    Fin Si
Fin
```

### Si… (Sinon si…) Sinon…

Cette structure conditionnelle indique que si la première condition n’est pas vérifiée, alors on va regarder si la seconde condition est vérifiée. 
Pour cela, on emploie les mots clé si… (sinon si…) sinon… . en anglais : if… else…, if… else if… else…

en pseudo-code :
```
Algorithme Si_structure
Début
    Si joueur_coordonnées == arrivée_coordonnées :
        afficher ‘Vous avez gagné !’
    Sinon
        afficher ‘Vous avez perdu !’
    Fin Si
Fin
```

### Combiner des conditions

Pour des conditions plus complexes, on peut effectuer plusieurs tests au sein d’un seul et même Si. 
On utilisera pour ça les mots-clés ET et OU.

- ET renvoie Vrai lorsque la condition de gauche et droite sont toutes les deux vraies. Si au moins l’une des deux est fausse, alors le résultat obtenu est faux.
- OU renvoie vrai lorsque la condition de gauche, droite ou les deux sont vraies. La seule fois ou OU renvoie faux, c’est quand les deux conditions sont fausses.

en pseudo-code :

```
Algorithme Si_structure_opérateur_ET
Début
Si joueur_coordonnées == arrivée_coordonnées ET déplacements < = 10 :
    afficher ‘Vous avez gagné !’
Sinon
    afficher ‘Vous avez perdu !’
Fin Si
Fin
```


```
Algorithme Si_structure_opérateur_OU
Début
Si joueur_coordonnées != arrivée_coordonnées OU déplacements > 10 :
    afficher ‘Vous avez perdu !’
Sinon
    afficher ‘Vous avez gagné !’
Fin Si

Fin
```

## Ajouter une boucle

En programmation, on est souvent appelé à répéter plusieurs fois une même instruction. Plusieurs problèmes se posent : 

- On risque de se retrouver à écrire plusieurs fois la (ou les) même ligne de code. (= très mauvaise pratique en développement).
- On ne sait pas combien de fois on va devoir répéter cette ligne de code.

On va donc faire appel aux boucles afin de palier à ce problème. 
Une boucle est un ensemble d’instructions exécuté plusieurs fois. Elle a un début, une fin et un cycle complet appelé itération. 

Il existe deux grand types de boucles : la boucle TANT QUE (while) et la boucle POUR (for).

### La boucle TANT QUE :

Elle est utilisée pour exécuter le corps de la boucle jusqu’à ce qu’une condition spécifique soit fausse. Dans ce cas, on ne sait pas combien de fois la boucle s’exécutera.

Elle se compose d’une condition de boucle et d’un bloc de code en tant que corps de boucle, qui contient les instructions à exécuter itérativement. 

La condition de la boucle est évaluée et si elle est vraie, le code dans le corps de la boucle sera exécuté. Ce processus se répète jusqu’à ce que la condition de la boucle devienne fausse.

en pseudo-code :
```
Algorithme boucle_tant_que
Variable

joueur_position_x ← 0 : ENTIER
joueur_position_y ← 0 : ENTIER 
arrivée_position_x ← 5 : ENTIER
arrivée_position_y ← 5 : ENTIER

Début

Tant Que joueur_position_x ! = arrivée_position_x ET joueur_position_y ! = arrivée_position_y :

déplacement(joueur_position_x, joueur_position_y)

Fin Tant Que

Fin
```

Attention, ce type de boucle peut être joué jusqu’à la nuit des temps, car l’ordinateur ne sait pas quand il doit s’arrêter. Il s’agit d’une boucle infinie. Tant que la condition de la boucle est vraie, le programme sera bloqué dans la boucle et ne s’arrêtera jamais. 

N.B. : penser à intégrer une condition d’arrêt pour éviter que la boucle ne tourne pas à l’infini.

### La boucle POUR :

Elle est utilisée quand on sait combien de fois la boucle sera exécutée. On cherche à exécuter un nombre d’étapes défini par des instructions. 

A l’intérieur de la boucle pour, on va utiliser une variable de boucle pour contrôler l’exécution de la boucle, où la valeur initiale de la variable décide du point de départ. 

- on commence par initialiser la variable de boucle à une certaine valeur.
- On vérifie ensuite si la condition de boucle est vraie ou non.
- Si la condition de la boucle est vraie, le code à l’intérieur du corps de la boucle s’exécutera.
- Enfin, on met à jour la variable de boucle et on passe à l’itération suivante. Cette étape sera répétée jusqu’à ce que la condition de boucle devienne fausse.

La boucle Pour nécessite 3 instructions pour itérer : 

- initialisation de la variable de boucle.
- Condition d’itération.
- Mise à jour de la variable de boucle.

en pseudo-code :
```
Algorithme boucle_tant_que
Variable

joueur_position_x ← 0 : ENTIER
joueur_position_y ← 0 : ENTIER 
max_déplacement ← 10 : ENTIER

Début
    Pour i ← 0 ; i < max_déplacement; i = i + 1 (ou Pour i allant de 0 jusqu’à max_déplacement)
    déplacement(joueur_position_x, joueur_position_y)
Fin Pour

Fin
```

## Les différents types de containers

Les différents types définis et utilisés dans un programme s’appellent des structures de données.
Une structure permet de stocker plusieurs données de même type ou de type différents dans un seul conteneur (la structure). Une structure est composée de plusieurs champs, chaque champ correspondant à une donnée.

Il existe de multiples structures de données.
Les plus connues :

- tableaux, listes chaînées et dictionnaires
- piles et files
- arbres binaires et graphs

Dans ces structures de données, on peut créer, lire, modifier ou même supprimer des éléments. On parle alors de type d’opération qu’on peut effectuer sur notre structure. 

Le type d’opération qu’on souhaite effectuer va déterminer notre choix de structure (selon si on souhaite faire des recherches, créer ou supprimer des éléments).

### Les tableaux (arrays)

Il s’agit d’une structure qui permet de mémoriser plusieurs données de type semblable ou différent.

Un tableau contient des indices et des valeurs :

| Indice | Valeur |
| --- | --- |
| 0 | Valeur 1 |
| 1 | Valeur 2 |
| 2 | valeur 3 |

Chaque élément est associé à sa position dans la liste à l’aide d’un indice commençant à 0 (comme une liste numérotée). 

La position est appelée indice ou index. ( /!\ le premier élément d’un tableau est à l’index 0).

La syntaxe en pseudo-code pour déclarer un tableau est la suivante :

- Il faut d’abord nommer le tableau et ensuite mettre entre crochets la taille du tableau.
- Il faut ensuite donner le type du tableau précédé par deux points
- On peut aussi donner le type de valeur contenue dans chaque case.

en pseudo-code :
```
Algorithme Tableau

Variable

objets[5] : TABLEAU CHAÎNE DE CARACTERES

Début
    Instructions
Fin
```

Un tableau est très facile à lire. on peut également facilement modifier ses données grâce à son index (chaque donnée ayant son numéro, il suffit de le reconnaître et le tour est joué). 
Cependant, un tableau a une taille fixe. On ne peut pas ajouter ou supprimer les données d’un tableau. Il faut en faire une copie qui intègre les ajouts ou les suppressions. Ce n’est pas pratique si on doit modifier fréquemment la taille du tableau. 

### La liste chaînée (single-linked list)

Il s’agit d’un ensemble de valeurs enregistrées dans des endroits différents de la mémoire. 
A la différence d’un tableau qui contient un nombre fixe d’éléments, la liste chaînée est très souple : on peut ajouter ou supprimer des éléments à volonté. 

On a ici une structure de données linéaire qui comprend une série de noeuds connectés. Chaque noeud stocke les données et l’adresse du noeud suivant. Le dernier élément de la liste aura une adresse vide. 

Début de la liste chaînée

Adresse / Données ⇒ Adresse / Données ⇒ Adresse / Donées ⇒ Adresse vide (= fin de liste)

Dans un tableau, les informations sont stockées de manière contigüe dans la mémoire de l’ordinateur. Cela permet d’accéder plus facilement aux données. Cependant, un tableau est moins flexible par rapport à une liste chaînée.
La liste chaînée rend l’ajout et la suppression de valeurs plus facile, mais l’accès à un élément est plus long.

Afin d’associer deux éléments ensemble, on va privilégier la table de hachage. Elle permet d’associer deux éléments de type quelconque : association d’une clé et d’une valeur.

### Les tables de hachage

Une table de hachage est une structure de données qui permet d’associer une valeur à une clé et non plus un indice. Cette clé peut être un mot ou un chiffre. 

ex : un tableau qui stocke la correspondance entre le type du véhicule et le nombre de roues.

| Type du véhicule (clé) | Nombre de roues (valeur) |
| --- | --- |
| voiture | 4 |
| moto | 2 |

Les tables de hachage ne comportent pas d’ordre. contrairement aux tableaux, on ne retrouve pas un élément via sa position, mais uniquement grâce à sa clé. C’est une structure très commune et très pratique.

Opérations courantes : 

Pour retrouver une valeur, il faut indiquer sa clé (et non pas son index comme dans un tableau).

Selon l’exemple ci-dessus, on va retrouver le nombre de roues d’une voiture en écrivant :
roues[”voiture”]

Les tables de hachage sont très flexibles, on peut ajouter ou supprimer des données rapidement.

### Les structures de données particulières

Une pile :

C’est une structure de données qui donne accès en priorité aux dernières données ajoutées. La dernière information ajoutée sera donc la première à en sortir.

Le traitement de la donnée se fait en LIFO (Last In First Out = Dernier Ajouté, Premier Parti).

Les piles sont très utilisées sur les plateformes de streaming musical comme Spotify ou Deezer : lorsqu’on demande à la plateforme de lire une chanson à la suite, elle va ajouter cette dernière tout en haut de la liste “en attente de lecture”.

Les piles de type LIFO s’utilisent lorsqu’on doit traiter en priorité les dernières données arrivées. 
Dans la vie de tous les jours, on utilise ce système lorsqu’on range le frigo : on va sortir du frigo ce qui va être consommé en priorité. 

lorsqu’on veut accéder aux premières données ajoutées, on va privilégier les files.

Une file (ou queue en anglais) :

C’est une structure de données dans laquelle on accède aux éléments suivant la règle FIFO (First In First Out = Premier Arrivé, Premier Sorti).

C’est le même principe que les files d’attentes. Plus on arrive tôt, plus on part tôt.

Les files de type FIFO s’utilisent lorsqu’on doit traiter un flux de données par ordre d’arrivée : Une to-do list par exemple, ou encore une liste de bugs en attente de traitement. 

## Les Arbres

### Les Arbres binaires

A la manière des listes chaînées qui contient une adresse avec des données à chaque noeuds, un arbre binaire stockera deux adresses à chaque noeuds. 

En représentation graphique, cela ressemblera à un arbre qui a chaque noeud contiendra deux branches : il s’agit d’un arbre binaire.

Il y a une cellule mère (racine), et toutes les autres cellules sont des cellules filles. 
⇒ toutes les cellules descendent de la racine.

Les arbres binaires sont largement utilisés en informatique, car il s’agit d’une structure de données simples et des plus efficaces à utiliser dans les systèmes logiciels. 
Jeux vidéos, routeurs internet, bases de données, calculatrices…

Fonctionnement :
Chaque cellule mère a 0, 1 ou 2 cellules enfants qui sont elles-mêmes liées à d’autres cellules. 
Les cellules sont appelées des noeuds (ou des sommets). 
Un noeud qui n’a pas d’enfant sera appelé une feuille.

Un arbre binaire sert de structure analogue à une liste chaînée, sauf que chaque cellule possède jusqu’à deux suivantes. 
On parle de fils gauche et fils droit les deux fils d’un noeud. 

Parcours d’un arbre binaire :
Pour trouver une information, il faut parcourir tous ses noeuds, grâce à une fonction récursive.

La récursivité est un processus qui prend son sens lorsque la résolution d’un problème ramène à celle d’un problème plus petit. On parle de récursivité quand une fonction s’appelle elle-même en boucle, jusqu’à atteindre une condition d’arrêt.

### Les graphes

Un graphe est un ensemble de cellules reliées les unes aux autre par une relation (et non pas par lien d’ascendance comme dans un arbre). 
Il s’agit visuellement d’un ensemble de noeuds (ou sommets) reliés par des arrêtes.

Cela s’apparente à un réseau routier, un réseau informatique entre autres.

Les graphes sont souvent utilisés par des algorithmes dans le but de trouver le chemin le plus court entre un point A et un point B, tel un GPS. 

graphiquement, un sommet est relié à un autre par un arc. 

## TRIER DES INFORMATIONS

Le tri des informations fait parti des problèmes les plus répandus. Il ne suffit pas de trier les infos, mais il faut aussi trouver la manière la plus efficace de le faire. 

Les algorithmes de tri sont l’essence même de l’algorithmique. On cherche souvent à réorganiser des données pour les manipuler autrement.

Un des algorithmes de tri les plus connus : le tri à bulles.

### Le tri à bulles

Cet algorithme progresse dans une liste d’éléments. Il compare les données deux à deux et les échange si la première valeur est plus élevée que la seconde. Il fait cela pour toutes les paires d’éléments d’une liste, et recommence au début jusqu’à ce que toutes les paires soient dans le bon ordre. 

On parle de “tri à bulles” parce que la plus grande donnée remonte peu à peu à la fin de la liste, comme des bulles de savon.

ex : trier sa bibliothèque et classer les livres par nom d’Auteur. 

On va écrire une fonction qui prendra en paramètre un tableau (qui représente la bibliothèque) et qui va parcourir toutes les entrées du tableau (les livres) un à un : on va utiliser une boucle.
Notre bibliothèque est composée de 10 livres. Nous utiliserons une boucle POUR (for). On va faire 10 tours de boucle, mais dans ce cas, de la dernière case à la première.

Quand nous sommes dans la boucle, on va intervertir les livres SI le second est plus grand que le premier. On va donc utiliser une structure conditionnelle.

pseudo-code : premier jet
```
Algorithme Tri_a_bulle(tableau)

taille ← Taille du tableau

Pour i allant de taille -1 jusqu’à 1 : 
    Si  tableau [i+1] < tableau[i] : 
        échanger(tableau[i+1], tableau[i])
    Fin Si
Fin Pour

Fin
```
On remarque qu’une fois le premier livre trié, on a plus besoin de le parcourir dans la liste. On va donc effectuer un tour de boucle de moins. On va procéder ainsi jusqu’à atteindre 1.

pseudo-code : final
```
Algorithme Tri_a_bulle(tableau)

Début

tailleTableau ← Taille(tableau)

Pour i allant de taille -1 jusqu’à 1 : (Pour i ← tailleTableau - 1 à 1 :)
    Pour j allant de 0 jusqu’à i - 1 : (Pour j ← 0 à i - 1 :)
        Si  tableau[j+1] < tableau[j] : 
            échanger(tableau[j+1], tableau[j])
        Fin Si
    Fin Pour
Fin Pour
Fin
```
### Autres algorithmes de tri

Le tri à bulles n’est pas le plus efficace, puisqu’il compare les valeurs deux par deux. 

Par exemple, si on a une bibliothèque plus grande, on va choisir de la diviser en plusieurs unités plus petites pour les trier séparément, et ensuite les fusionner. On peut aussi mettre les livres les plus grands et les plus petits au début en même temps. 

Les algorithmes de tri les plus utilisés :

| Type de tri | Description |
| --- | --- |
| Tri par insertion | Le tri par insertion considère chaque élément du tableau et l’insère à la bonne place parmi les éléments déjà triés. |
| Tri par sélection | Le tri par sélection est un algorithme de tri qui sélectionne à chaque itération le plus petit élément d’une liste non triée et place cet élément au début de la liste non triée. |
| Tri par tas | Le tri par tas débute par la construction d’un tas sur le tableau d’entrée.
Comme l’élément maximum du tableau est stocké à la racine, on peut le placer dans sa position finale correcte en l’échangeant avec le dernier élément du tableau. |
| Tri par fusion | Le tri par fusion fonctionne sur le principe de diviser pour mieux régner. Le tri par fusion décompose à plusieurs reprises une liste en plusieurs sous-listes jusqu’à ce que chaque sous-liste se compose d’un seul élément, et fusionne ces sous-listes de manière çà obtenir une liste triée. |

[https://fr.wikipedia.org/wiki/Algorithme_de_tri#Comparaison_des_algorithmes](https://fr.wikipedia.org/wiki/Algorithme_de_tri#Comparaison_des_algorithmes)

## Calculer la complexité algorithmique

Afin de déterminer si un algorithme est plus efficace ou plus performant qu’un autre pour un problème donné, on va avoir besoin de calculer la complexité algorithmique. 

Les objectifs des calculs de complexité sont de :

- pouvoir prévoir le temps d’exécution d’un algorithme
- pouvoir comparer deux algorithmes en réalisant le même traitement

La complexité algorithmique est un concept qui permet donc de comparer les algorithmes pour trouver le plus efficace. 

La complexité d’un algorithme peut être évalué en temps et en espace. On va étudier le temps de calcul, l’espace mémoire requis par un algorithme pour résoudre un problème algorithmique :

- complexité en temps : évaluation du temps d’exécution de l’algorithme
- complexité en espace : évaluation de l’espace mémoire occupé par l’exécution de l’algorithme.

Il existe une règle de l’espace-temps informatique disant que pour gagner du temps de calcul, on doit utiliser davantage d’espace mémoire.

On s’intéresse essentiellement à la complexité en temps. Le paramètre de la complexité est la donnée du traitement qui va faire (le plus) varier le temps d’exécution de l’algorithme.

Pour un même algorithme, différents choix de paramètre de complexité peuvent être possible. Plusieurs complexités peuvent être calculées selon les besoins. L’idée est d’évaluer le temps de calcul indépendamment de toute implémentation et de tout contexte d’exécution.

Il existe une notation standard qui s’appelle **Big O** qui permet de mesurer la performance d’un algorithme. Il s’agit d’une méthode de calcul.

### La complexité exponentielle

Un algorithme de complexité exponentielle n’est utilisable que pour résoudre des problèmes de petite taille. Il n’est pas utilisable en pratique.

Calcul = O(i^n) 

Quand le paramètre double, le temps d’exécution est élevé à la puissance 2.

### La complexité linéaire

Un algorithme de complexité linéaire est appelé ainsi car la complexité augmente proportionnellement au nombre de chiffres.

Calcul = O(n)

Augmentation linéaire du temps d’exécution quand le paramètre croit (si le paramètre double, le temps double). On aura ce type de complexité sur des algorithmes qui parcourent séquentiellement des structures linéaires.

### La complexité en temps constant

il s’agit d’un algorithme qui prendra toujours le même temps pour résoudre le problème.

Calcul = O(1)

Pas d’augmentation du temps d’exécution quand le paramètre croit.

*Il existe d’autres types de complexité : complexité logarithmique : O(log(n)), complexité quasi-linéaire : O(nlog(n)), complexité quadratique : O(n^2), complexité polynomiale : O(n^i), complexité factorielle : O(n!).*

### la complexité temporelle

Lorsqu’on compare différents types d’algorithmes, on remarque qu’on prend surtout en compte le facteur temps. C’est ce qu’on appelle la complexité temporelle. 

Cela permet de savoir à l’avance si un algorithme ne se terminera jamais.

### La complexité spatiale

Ce point concerne le stockage des données. Quand on réalise un algorithme en informatique, les informations sont stockées sur la mémoire de l’ordinateur. Comme la mémoire n’est pas infinie, si on ne fait pas attention, un algorithme peut vite occuper tout l’espace libre d’un ordinateur et le faire planter.

On parle alors de complexité spatiale (en espace). Les notations big O sont les mêmes que pour la complexité temporelle. 

Ex : prenons un algorithme où l’utilisateur doit entrer “n” éléments et les enregistrer dans un tableau. 
Dans ce cas, la complexité spatiale se notera avec la notation big O : O(n).
⇒ le tableau contiendra n éléments. 
Si l’algorithme construit deux tableaux de n éléments, la complexité spatiale sera de O(2n), car l’algorithme crée 2 tableaux de n cases.

## Appréhender la notion de récursivité

### Qu’est ce que la récursivité ?

C’est un concept qui fait référence à lui-même dans son fonctionnement. 
Un algorithme récursif est un algorithme qui résout un problème en calculant des solutions d’instances plus petites du même problème.

En programmation, une fonction est récursive quand elle s’appelle elle-même.
*Lorsque deux fonctions s’appellent l’une l’autre, on parle de récursivité croisée.* 

Le but est de décomposer le problème en un problème plus simple ⇒ on réduit la taille du problème donné.

Pour la récursion sur des entiers, lorsque la taille du problème est définie par un entier, on réduit la valeur de cet entier à chaque appel récursif.

Sur les tableaux, soit on considère la taille du tableau dont on réduit la taille à chaque appel récursif, soit on utilise un ou des indices qui varient à chaque appel pour tendre vers la condition d’arrêt (dépendant des valeurs des indices).