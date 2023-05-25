Ce mémo traduit de l'anglais s'appuie sur l'article <a href="https://codeburst.io/explaining-value-vs-reference-in-javascript-647a975e12a0">Explaining Value vs. Reference in Javascript</a>

# Explication de la Valeur vs. Reference en JavaScript

Un simple regard sur la mémoire de l'ordinateur explique ce qu'il se passe

RAPPEL : JavaScript a 5 type de données passées par valeur :<br>
* Booléen
* null
* undefined
* String
* Number

JavaScript a 3 types de données qui sont passées par _référence_ : 
* Array
* Function
* Object
Ce sont techniquement des objets, nous y ferons références par le terme _Objets_

## Primitives

Si un type primitif est assigné à une variable, on peut penser que la variable contient la valeur promitive.

```javascript
let x = 10;
let y = 'abc';
let z = null;
```

x contient _10_, y contient _'abc'_.<br>
Pour ancrer cette idée, nous allons maintenir une image de ce à quoi ces variables et de leur contenu respectif ressemblent dans la mémoire de l'ordinateur.

| Variables | Values ||||
|-|-|-|-|-|
|x|10||||
|y|'abc'||||
|x|null||||

Quand on assigne ces variables à d'autres variables en utilisant =, on copie la valeur dans la nouvelle variables :<br> Elles sont copiées par valeur.

## Objets

Les variables auxquelles une valeur non primitive est affectée reçoivent une référence à cette valeur. <br>
Cette référence pointe vers l'emplacement de l'objet en mémoire. Les variables ne contiennent pas réellement la valeur.

C'est à dire que les objets sont créés à un endroit dans la mémoire de l'ordinateur.<br> 
Quand on écrit array = [], on crée un tableau dans la mémoire de l'ordinateur. 

La variable array reçoit l'adresse et l'endroit de ce tableau. 

Imaginons que _address_ est un nouveau type de donées qui est passé par valeur, comme _number_ ou _string_. <br>
Une _address_ pointe vers l'endroit, dans la mémoire, d'une valeur qui est passée par référence.<br> 
De la même manière qu'une chaîne de caractères est notée entreguillemets (simples ou doubles),<br> 
une _address_ sera notée par les "arrow brackets" : <>.

Quand on assigne et qu'on utilise une variable type référence, ce que l'on écrit et voit est :

```javascript
let array = [];
array.push(1);
```

Dans la mémoire, la représentation de ces deux lignes dans la mémoire est comme suit :<br>

Première ligne :
| Variables | Values | Addresses | Objects |
|-|-|-|-|
| array | <#001> | #001 | [] |

Deuxième ligne :
| Variables | Values | Addresses | Objects |
|-|-|-|-|
| array | <#001> | #001 | [1] |

A noter que la valeur, l'adresse contenues par la variable _array_ est statique.<br>
C'est le tableau qui change dans la mémoire. Quand on utilise _array_ pour réaliser une action, comme ajouter une valeur (push), <br>
le moteur Javascript se rend à l'endroit ou se situe _array_ dans la mémoir et travaille avec l'information stockée ici.
