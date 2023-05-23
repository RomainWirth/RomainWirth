# JAVASCRIPT
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

## II. LES VARIABLES
### A. Définition

Une vrariables est un contenant utilisé pour enregistrer une donnée spécifique utile au programme pour fonctionner. 
Une donnée placée dans une variable s'appelle une valeur. 
Pour connaître ce à quoi correspond la variable, il faut lui donner un nom.
Le nom doit indiquer ce qui se trouve à l'intérieur de la variable.

### B. Règles générales pour nommer une variable

* Utiliser des noms descriptifs dans l'ensemble du code : être précis et descriptif rend la vie plus facile pour lire et maintenir le code dans le temps.
* Mettre les points sur les i : en d'autres termes, éviter les abréviations ou les raccourcis de mots même lorsque c'est possible.
* Suivre une convention de nommage constante : convention la plus courrante = camelCase.

### C. Création d'une variable - la déclaration

Pour utiliser une variable dans le code, il faut la déclarer.
En JavaScript une variable se déclare ainsi : 

```javascript
let numberOfCats = 2;
let numberOfCats = 4;
```

N.B. : auparavant, une variable se déclarait avec le mot clé "var", il a été remplacé par "let" (rapport à la portée des variables et pour mieux lire le code, voir partie sur la portée des variables).

### D. Modification de la valeur d'une variable

La manière la plus simple de modifier la valeur d'une variable est simplement de la réaffecter : 
```javascript
let numberOfCats = 2;
numberOfCats = 4;
```
Notez qu'on n'utilise pas de mot clé avant la variable puisqu'elle a déjà été déclarée.

Pour modifier une variable, on va surtout employer les opérateurs arithmétiques.

#### 1. Opérateurs arithmétiques - travail sur les nombres

Ces opérateurs vont permettre d'effectuer des opérations mathématiques de base : addition, soustraction, multiplication et division.

#### a. Addition et soustraction

Pour ajouter deux variables, on utilise le signe + .
Pour soustraire, on utilise le signe - .

Pour ajouter ou soustraire un nombre à une variable, on peut utiliser les opérateurs += et -= .

Pour ajouter ou soustraire 1 à la variable, on peut utiliser ++ ou -- .

#### b. Multiplication et division

Pour multiplier deux variables, on va utiliser le signe * .
Pour diviser on utilise le signe / .

De la même manière que pour l'addition et la soustraction, on peut utiliser les opérateurs *= et /= pour multiplier ou diviser un nombre.

#### c. Mutabilité des variables

