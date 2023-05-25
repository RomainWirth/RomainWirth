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

| Variables | Values |
|-|-|
|x|10|
|y|'abc'|
|z|null|

Quand on assigne ces variables à d'autres variables en utilisant =, on copie la valeur dans la nouvelle variables :<br> Elles sont copiées par valeur.

```javascript
let x = 10;
let y = 'abc';

let a = x;
let b = y;

console.log(x, y, a, b); // -> 10, 'abc', 10, 'abc'
```

Autant _a_ que _x_ contiennent _10_. Autant _b_ que _y_ contiennent _'abc'_.<br>
Elles sont séparées, car les valeurs elles-mêmes ont été copiées.

| Variables | Values |
|-|-|
|x|10|Value

Si on change l'une, l'autre reste inchangée. Les variables n'ont aucun lien entre elles.

```javascript
let x = 10;
let y = 'abc';

let a = x;
let b = y;

a = 5;
b = 'def'

console.log(x, y, a, b); // -> 10, 'abc', 5, 'def'
```

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
le moteur Javascript se rend à l'endroit ou se situe _array_ dans la mémoir et travaille avec l'information stockéeValue est en réalité copiée comme si c'était une primitive.<br>
**Les objets sont copiés par référence** au lieu de leur valeur.

```javascript
let reference = [1];
let referenceCopy = reference;
```

Ce code ressemble à ceci dans la mémoire :

| Variables | Values | Addresses | Objects |
|-|-|-|-|
| reference | <#001> | #001 | [1] |
| referenceCopy | <#001> |  |  |

Chaque variable contient maintenant une référence au _même tableau_.<br>
Cela veut dire que si on modifie _reference_, _referenceCopy_ sera modifié en conséquence.

```javascript
reference.push(2);
console.log(reference, referenceCopy); // -> [1, 2], [1, 2]
```

| Variables | Values | Addresses | Objects |
|-|-|-|-|
| reference | <#001> | #001 | [1, 2] |
| referenceCopy | <#001> |  |  |

## Réassigner une référence

Réassigner une référence remplace l'ancienne référence.

```javascript
let object = {first: 'reference'};
```

S'écrit dans la mémoire :

| Variables | Values | Addresses | Objects |
|-|-|-|-|
| objet | <#678> | #234 | {first: 'reference'} |

Quand on a une deuxième ligne :

```javascript
let object = {first: 'reference'};
object = {second: 'reference2'};
```

L'adresse stockée dans _object_ change. Le premier objet est toujours présent dans la mémoire, tout comme le second objet :

| Variables | Values | Addresses | Objects |
|-|-|-|-|
| objet | <#678> | #234 | {first: 'reference'} |
| | | #678 | {second: 'reference2'} |

Quand il n'y a pas de références à un objet restant, comme on peut voir pour l'adresse _#234_ ci-dessus, le moteur JavaScript peut effectuer une 'garbage collection' (recuperation pour la poubelle).<br>
Cela signifie que le programmeur a perdu toutes les références à l'objet et ne peut plus l'utiliser, donc le moteur peut le supprimer de la mémoire de manière sûre.<br>
Dans ce cas, l'objet _{first: 'reference'}_ n'est plus accessible et est disponible pour le moteur pour 'garbage collection'.

## Les opérateurs == et ===

Quand les opérateurs d'égalité **==** et **===** sont utilisés sur des variables types références, elles vérifient la référence.<br>
Si les variables contiennent une référence au même élémennt, le résultat de la comparaison sera _true_.

```javascript
let arrayReference = ['Hi !'];
let arrayReference2 = arrayReference;

console.log(arrayReference === arrayReference2); // -> true
```

Si ce sont des objets distincts, même si ils contiennent des propriétés identiques, le résultat de la comparaison sera _fasle_.

```javascript
let arrayReference = ['Hi !'];
let arrayReference2 = ['Hi !'];

console.log(arrayReference === arrayReference2); // -> false
```

Si on a deux objets distincts et qu'on veut voir si leurs propriétés sont les mêmes,<br> le moyen le plus simple est de les transformer en _string_ et de comparer les strings.<br>array1String === array2Stringtres au travers de fonctions

Quand on passe des valeurs primitives dans une fonction, la fonction copie les valeurs dans ses paramètres.<br>
C'est effectivement la même chose que d'utiliser **=** .

```javascript
let hundred = 100;
let two = 2;

function multiply(x, y) {
    // PAUSE
    return x * y;
}

let twoHundred = multiply(hundred, two);

console.log(twoHundred); // -> 200
```

Dans l'exemple ci-dessus, on assigne la valeur _100_ à la variable _hundred_.<br>
Quand on passe dans la fonction _multiply_, la variable _x_ récupère la valeur _100_.<br>
La valeur est copiée comme si on utilisait un _"="_ .<br>
Pour rappel, la valeur de _hundred_ n'est pas affectée.<br>
Voici une image de la mémoire au niveau de la ligne commentaire _// PAUSE_ dans _multiply_ .

 Variables | Values | Addresses | Objects |
|-|-|-|-|
| hundred | 100 | #333 | function(x, y)... |
| two | 2 | | |
| multiply | <#333> | | |
| x | 100 | | |
| y | 2 | | |

## Pure Functions

On fait référence à des fonctions qui n'ont aucun effet en dehors de leur portée à des _"pure functions"_.<br>
Aussi longtemps qu'une fonction prends uniquement des valeurs primitives en paramèttres et n'utilise aucune variables en dehors de sa portée,<br> 
elle est automatiquement pure, car elle ne peut avoir d'effet que dans sa portée.<br>
Toutes les variables crées à l'intérieur sont récupérées pour la poubelle (garbage collected) dès que la fonction effectue un _return_.

Une fonction qui prend un objet, quad à elle, peut muter l'état de sa portée.<br>
Si une fonction prends un tableau en référence et modifie le tableau vers lequel il se réfère, par exemple grâce à un _push_,<br>
les variables dans la portée qui font références à ce tableau vont voir ce changement.<br>
Après le _return_ de la fonction, les changements qui sont effectués persistent dans la portée externe.<br>
Cela peut avoir des effets indésirables et peut être difficile à traquer.

Beaucoup de fonctions natives de tableaux, _Array.map_ et _Array.filter_ inclues, peuvent alors s'écrire comme des _"pure functions"_.
Elles prennent un tableau en référence, et de manière interne copient le tableau et travaillent avec la copie au lieu de l'original.<br>
Cela fait que l'original n'est pas touché, la portée externe n'est pas affectée, et on a retourné une référence à un tout nouveau tableau.

Voici un exemple d'un _pure function_ vs _impure function_ :

```javascript
function changeAgeImpure(person) {
    person.age = 25;
    return person;
}

let alex = {
    name: 'Alex',
    age: 30
}

let changedAlex = changeAlexImpure(alex);

console.log(alex); // -> {name: 'Alex', age: 25}
console.log(changedAlex); // -> {name: 'Alex', age: 25}
```

Cette fonction impure prends un objet et change la propriété _age_ de cet objet pour devenir 25.<br>
Parce qu'il agit sur la référence qui lui a été donnée, cela change l'ojet _alx_.<br>
A noter que lorsque cela retourne l'objet _person_, cela retourne exactement le même objet qui lui a été passé.<br>
_alex_ et _alexChanged_ contiennent la même référence.<br>
C'est redondant de retourner la variable _person_ et de stocker la référence dans une nouvelle variable.

Regardons une fonction pure :

```javascript
function changeAgePure(person) {
    let newPersonObject = JSON.parse(JSON.stringify(person));
    newPersonObject.age = 25;
    return newPersonObject;
}

let alex = {
    name: 'Alex',
    age: 30
}

let changedAlex = changeAlexImpure(alex);

console.log(alex); // -> {name: 'Alex', age: 30}
console.log(changedAlex); // -> {name: 'Alex', age: 25}
```

Dans cette fonction, on utilise _JSON.stringify_ pour transformer l'objet qu'on passe dans une _string_, et ensuite on le _parse_ dans un objet avec _JSON.parse_.<br>
En faisant cette transformation et en stockant le résultat dans une nouvelle variable, on a créé un nouvel objet.<br>
Il y a d'autres moyens de faire la même chose comme faire une boucle sur l'objet original et assigner chacune de ses propriétés à un nouvel objet, mais cette manière est plus simple.<br>
Le nouvel objet a les memes propriétés que l'original mais est séparé de manière distincte dans la mémoire.

Quand on change la propriété _age_ de ce nouvel objet, l'original n'est pas modifié.<br>
Cette fonction est maintenant _"pure"_. Elle ne peut pas affecter un objet en dehors de sa portée, même l'objet qui lui a été passé.<br>
Le nouvel objet doit être retourné et stocké dans une nouvelle variable, sinon elle devient _"garbage collected"_ une fois la fonction complétée, car l'objet n'est plus en portée.