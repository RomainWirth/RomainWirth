# LET cs CONST

## LET 

L'instruction Let permet de déclarer une variable dont la portée est celle du bloc courant, éventuellement en initialisant sa valeur.

ex :
```JavaScript
let x = 1;

if (x === 1) {
  let x = 2;

  console.log(x);
  // Expected output: 2
}

console.log(x);
// Expected output: 1
```

### Syntaxe

```JavaScript
let var1 [= valeur1] [, var2 [= valeur2]] [, …, varN [= valeurN]];
```
var1, var2 etc. sont les noms des variables.<br>
valeur1, valeur2 etc. sont les valeurs initiales de chaque variable déclarée.

### Description

`let` permet de déclarer des variables dont la portée est limitée à celle du bloc dans lequel elles sont déclarées.<br>
le mot clé  `var` permet de définir une variable globale ou locale à une fonction (sans distinction des blocs utilisés dans la fonction).<br>

Avec `let`, la variable est initialisée à l'endroit où le parseur évalue son contenu.
Tout comme `const`, `let` ne crée pas de propriété sur l'objet window quand les variables sont déclarées au niveau global.

**L'origine du terme let :**<br>
Let est une déclaration mathématique qui a été adoptée par les premiers langages de programmation comme Scheme ou Basic.<br>
Les variables sont considérées comme des entités de bas niveau qui ne conviennent pas aux niveaux d'abstraction élevés,<br>
d'où le désir de nombreux concepteurs de langages d'introduire des concepts similaires mais plus puissants comme dans Clojure, F#, Scala,<br>
où let pourrait signifier une valeur ou une variable qui peut être assignée, mais pas modifiée,<br> 
ce qui permet au compilateur de détecter plus d'erreurs de programmation et de mieux optimiser le code.<br>
var a fait parti de l'environnement JS depuis le début. Il était nécessaire d'avoir un autre mot clé.<br>
Let a été emprunté à des dizaines d'autres langages qui l'utilisaient déjà comme mot-clé traditionnel, aussi proche que possible de var.<br>
En JavaScript, let crée à la place une variable locale de portée de bloc : let fait la même chose que var mais avec une portée différente.

### Les portées de bloc avec `let`

Le mot clé `let` permet de définir des variables au sein d'un bloc et des blocs qu'il contient.<br>
`var` permet quant à lui de définir une variable dont la portée est celle de la fonction englobante.<br>

```JavaScript
if (x > y) {
  let gamma = 12.7 + y;
  i = gamma * x;
}

function varTest() {
  var x = 1;
  if (true) {
    var x = 2; // c'est la même variable !
    console.log(x); // 2
  }
  console.log(x); // 2
}

function letTest() {
  let x = 1;
  if (true) {
    let x = 2; // c'est une variable différente
    console.log(x); // 2
  }
  console.log(x); // 1
}
```

`let` peut parfois permettre de rendre le code plus lisible lorsqu'on utilise des fonctions internes.<br>
Les variables déclarées avec `let` appartiennent à la portée du bloc dans lequel elles sont définies et indirectement aux portées des blocs de bloc.<br>
D'une certaine façon, `let` fonctionne comme `var`, à la seule différence dans cette analogie est que let fonctionne avec les portées de bloc et var avec les portées des fonctions.<br>

ex :
```JavaScript
function varTest() {
  var x = 31;
  if (true) {
    var x = 71; // c'est la même variable !
    console.log(x); // 71
  }
  console.log(x); // 71
}

function letTest() {
  let x = 31;
  if (true) {
    let x = 71; // c'est une variable différente
    console.log(x); // 71
  }
  console.log(x); // 31
}
```

au niveau le plus haut (portée globale), `let` crée une variable globale alors que `var` ajoute une propriété à l'objet global :
```JavaScript
var x = "global";
let y = "global2";
console.log(this.x); // "global"
console.log(this.y); // undefined
console.log(y); // "global2"
```

## CONST

La **déclaration** `const` permet de créer une constante nommée accessible uniquement en lecture.<br>
Cela ne signifie pas que la valeur contenue est immuable, uniquement que l'identifiant ne peut pas être réaffecté.<br>
Autrement dit, la valeur d'une constante ne peut pas être modifiée par des réaffectations ultérieures.<br>
Une constante ne peut pas être déclarée à nouveau :
```JavaScript
const number = 42;

try {
  number = 99;
} catch (err) {
  console.log(err);
  // Expected output: TypeError: invalid assignment to const `number'
  // (Note: the exact output may be browser-dependent)
}

console.log(number);
// Expected output: 42
```

### Syntaxe

```JavaScript
const nom1 = valeur1 [, nom2 = valeur2 [, … [, nomN = valeurN]]];
```

nomN = le nom de la constante. Ce nom peut être n'importe quel identifiant valide.<br>
valeurN = La valeur à associer à la constante. Cette valeur peut être n'importe quelle expression valide (éventuellement une expression de fonction).<br>

### Description

Cette déclaration permet de créer une constante qui peut être globale ou locale pour la fonction dans laquelle elle a été déclarée.<br> 
Les constantes font partie de la portée du bloc (comme les variables définies avec let).<br> 
À la différence des variables définies avec var, les constantes déclarées au niveau global ne sont pas des propriétés de l'objet global<br> 
(window dans le cas du navigateur).<br> 
Il est nécessaire d'initialiser une constante lors de sa déclaration.<br> 
Au sein d'une même portée, il est impossible d'avoir une constante qui partage le même nom qu'une variable ou qu'une fonction.

Attention, la déclaration const crée une référence en lecture seule vers une valeur.<br> 
Cela ne signifie pas que la valeur référencée ne peut pas être modifiée !<br> 
Ainsi, si le contenu de la constante est un objet, l'objet lui-même pourra toujours être modifié.

