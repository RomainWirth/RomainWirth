# JAVASCRIPT INTRODUCTION
## I. NOTIONS DE BASE 
### Où utilise-t-on le JavaScript ?

Le JavaScript s'utilise dans le document html dans la balise :
```HTML
<script></script>
```
Elle est placé dans le head ou à la fin du body.
Cette balise peut faire référence à un document index.js (ou script.js) pour décentraliser le code et gagner en lisibilité. 
Dans ce cas, la balise script du html sera comme suit :
```HTML
<script src="index.js"></script>
```

### Rappel algo

L'objectif d'un programme est de réaliser un ensemble d'instructions exécutables par un ordinateur pour répondre à un problème qu'on se pose.

Pour fonctionner, le programme a besoin de variables pour enregistrer et manipuler des données. 

### A. LES VARIABLES
#### 1. Définition

Une vrariables est un contenant utilisé pour enregistrer une donnée spécifique utile au programme pour fonctionner. 
Une donnée placée dans une variable s'appelle une valeur. 
Pour connaître ce à quoi correspond la variable, il faut lui donner un nom.
Le nom doit indiquer ce qui se trouve à l'intérieur de la variable.

#### 2. Règles générales pour nommer une variable

* Utiliser des noms descriptifs dans l'ensemble du code : être précis et descriptif rend la vie plus facile pour lire et maintenir le code dans le temps.
* Mettre les points sur les i : en d'autres termes, éviter les abréviations ou les raccourcis de mots même lorsque c'est possible.
* Suivre une convention de nommage constante : convention la plus courrante = camelCase.

#### 3. Création d'une variable - la déclaration

Pour utiliser une variable dans le code, il faut la déclarer.
En JavaScript une variable se déclare ainsi : 

```javascript
let numberOfCats = 2;
let numberOfCats = 4;
```

N.B. : auparavant, une variable se déclarait avec le mot clé "var", il a été remplacé par "let" (rapport à la portée des variables et pour mieux lire le code, voir partie sur la portée des variables).

#### 4. Modification de la valeur d'une variable

La manière la plus simple de modifier la valeur d'une variable est simplement de la réaffecter : 
```javascript
let numberOfCats = 2;
numberOfCats = 4;
```
Notez qu'on n'utilise pas de mot clé avant la variable puisqu'elle a déjà été déclarée.

Pour modifier une variable, on va surtout employer les opérateurs arithmétiques.

#### a. Opérateurs arithmétiques - travail sur les nombres

Ces opérateurs vont permettre d'effectuer des opérations mathématiques de base : addition, soustraction, multiplication et division.

#### Addition et soustraction

Pour ajouter deux variables, on utilise le signe + .
Pour soustraire, on utilise le signe - .

Pour ajouter ou soustraire un nombre à une variable, on peut utiliser les opérateurs += et -= .

Pour ajouter ou soustraire 1 à la variable, on peut utiliser ++ ou -- .

#### Multiplication et division

Pour multiplier deux variables, on va utiliser le signe * .
Pour diviser on utilise le signe / .

De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.

#### Mutabilité des variables

Une variable est de base mutable : elle peut changer dans le temps.
Elle est déclarée avec le mot clé "let", suivi de son nom et on lui affecte une valeur.

par la suite, on va pouvoir changer sa valeur autant de fois qu'on le souhaite. 

exemple avec un compteur :

```javascript
let compteur = 0;
compteur++;
compteur = 10;
```

### B. LES CONSTANTES

Une constante est une donnée qui ne sera jamais modifiée durant l'exécution du programme. 

Il s'agit d'une variable qui n'est <strong>pas mutable.</strong>
On lui donnera une valeur de départ et on ne pourra plus changer sa valeur par la suite. Une erreur sera retournée par javascript si on a une erreur logique dans notre code en changeant la valeur d'une constante.
```javascript
const nombreDePostParPage = 20;
nombreDePostParPage = 30; // retournera une erreur dans la console car on ne peut pas changer sa valeur
```


## II. ENREGISTRER DES DONNEES AVEC DES TYPES DE DONNEES

