# JAVA : Les flows de contrôle et conditions

## INTRODUCTION

Imaginons qu'on écrive un programme qui permette à des étudiants de s'inscrire dans des cours :
* _SI_ un étudiant a complété les prérequis, _ALORS_ il peut s'inscrire dans un cours.
* _SINON_, il devra faire le prérequis.

Les étudiants ne peuvent pas prendre Physics II sans avoir fini Physics I.

Nous représenterons ce genre de décisions dans notre programme grâce aux conditions ou les flux de contrôle.<br>
Jusqu'ici, notre code s'exécutait ligne par ligne de haut en bas, mais les conditions nous permettent de sélectionner les portions de code qui s'exécuteront ou non.<br>

Les **_conditions_** vérifient un `booléen` et exécutent un bloc de code qui dépend de cette condition.<br>
Les accolades `{}` définissent le scope du bloc conditionnel.<br>

exemple :
```
if (true) {
  System.out.println("Hello World!");
}
```
Si la condition est `true` (vrai), alors le bloc sera exécuté : `hello World!` sera imprimé dans la console.<br>

```
if (false) {
  System.out.println("Hello World!");
}
```
Dans le second cas, le bloc ne s'exécute que si la condition est `false` (fausse).

On parle ici de déclaration "if-then" : if (condition = true), alors fait quelque chose. 

## If-Then

Le _if-then_ est le flux de contrôle le plus simple à écrire. Il vérifie si une expression est vraie et exécute du code sur cette base.<br>
```
if (flip == 1) {
  System.out.println("Heads!");
}
```

* le mot clé `if` marque le début de la condition, suivi par les parenthèses `()`.
* les parenthèses contiennent un type de donnée `boolean`.

On peut également remplacer la condition entre parenthèses par des variables qui font référence à un booléen ou une comparaison qui évalue un booléen<br>

La condition booléenne est suivie par l'ouverture et la fermeture d'accolades qui englobent un bloc de code.<br>
Ce bloc ne sera exécuté que si et uniquement si le booléen est `true`.
```
boolean isValidPassword = true;
if (isValidPassword) {
  System.out.println("Password accepted!");
} 
// Prints "Password accepted!"

int numberOfItemsInCart = 9;
if (numberOfItemsInCart > 12) { 
  System.out.println("Express checkout not available");
} 
// Nothing is printed.
```

N.B. : si une condition est brève, on peut ne pas utiliser les accolades :
```
if (true) System.out.println("Brevity is the soul of wit");
```

## If-Then-Else

Ce genre de déclaration permet dans un premier temps de vérifier si une condition est vraie et d'exécuter un bloc de code,<br>
et dans le cas contraire d'exécuter un autre bloc de code.<br>
```
if (hasPrerequisite) {
  // Enroll in course
} else {
  // Enroll in prerequisite
}
```
Nous avons maintenant deux blocs de code séparés qui s'exécutent ou non selon la vérification de la condition :
* si la condition est vraie : exécute ce bloc de code.
* sinon, exécute un autre bloc de code.

## If-Then-Else-If

Cette structure permet de contrôler plusieurs conditions.<br>
On vérifie d'abord la première, si elle est vraie, on exécute le bloc de code associé.<br>
Si elle est fausse, on vérifie la seconde condition, si cette condition est vraie on exécute le bloc de code associé.<br>
etc.

Il s'agit de conditions multiples qui sont évaluées de haut en bas :
```
String course = "Theatre";
if (course.equals("Biology")) {
  // Enroll in Biology course
} else if (course.equals("Algebra")) {
  // Enroll in Algebra course
} else if (course.equals("Theatre")) {
  // Enroll in Theatre course
} else {
  System.out.println("Course not found!");
}
```
ou encore :
```
int testScore = 72;
if (testScore >= 90) {
  System.out.println("A");
} else if (testScore >= 80) {
  System.out.println("B");
} else if (testScore >= 70) {
  System.out.println("C");
} else if (testScore >= 60) {
  System.out.println("D");
} else {
  System.out.println("F");
}
// prints: C
```
Dans le second exemple, nous avons deux conditions qui s'avèrent être 'true' : `testScore >= 70` et `testScore >= 60`.<br>
Seul le premier bloc de code sera exécuté.

## Nested Conditional Statements

On peut créer des structures conditionnelles plus complexes en incluant des conditions dans des conditions (le nesting).<br>
```
if (outer condition) {
  if (nested condition) {
    Instruction to execute if both conditions are true
  }
}
```

Quand on implémente une condition dans une autre, on évalue d'abord la première condition.<br>
Si cette première condition est `true`, on évalue alors la condition à l'intérieur.<br>

exemple :
```
int temp = 45;
boolean raining = true;
 
if (temp < 60) {
  System.out.println("Wear a jacket!");
  if (raining == true) {
    System.out.println("Bring your umbrella.");
  } else {
    System.out.println("Leave your umbrella home.");
  }
}
```
Dans ce bout de code, le compileur va vérifier la première condition : `temp < 60`.<br>
Comme la valeur de `temp` est `45`, cette condition est `true`.<br>
Alors, le programme va imprimer `Wear a jacket!`.

Ensuite, on va évaluer la condition `raining == true`.<br>
Cette condition est aussi `true`, alors on va aussi imprimer `Bring your umbrella` à l'écran.<br>

à noter que si la première condition était `false`, la condition à l'intérieur n'aurait pas été évaluée.

## le Switch

Il existe une alternative aux conditions _if-then-else_ : le _switch_.
Cette condition vérifie une valeur donnée avec un certain nombre de conditions et exécute le bloc de code partout ou il y a une correspondance.<br>

exemple :
```
String course = "History";
 
switch (course) {
  case "Algebra": 
    // Enroll in Algebra
    break; 
  case "Biology": 
    // Enroll in Biology
    break;
  case "History": 
    // Enroll in History
    break;
  case "Theatre":
    // Enroll in Theatre
    break;
  default:
    System.out.println("Course not found");
}
```
Dans cet exemple, les étudiants sont inscrits dans la classe 'History' en vérifiant la valeur contenue entre parenthèses :<br>
`course` sera comparé à chaque label des `case`.<br>
Si la valeur après le label `case` correspond à la valeur entre parenthèses, le bloc de code correspondant sera exécuté.

`course` fait référence au terme `"History"`, qui correspond au `case "history"`.

Quand aucune valeur ne correspond, c'est le bloc `default` qui est exécuté.<br>
C'est l'équivalent du `else`.

Les blocs `switch` sont différents des autres blocs de code car ils ne sont pas encadrés par des accolades.<br>
De plus, on utilise le mot-clé `break` pour sortir du switch.<br>
Sans le `break`, tout le code sera exécuté, y compris celui sous les autres labels `case`.
```
String course = "Biology";
 
switch (course) {
  case "Algebra": 
    // Enroll in Algebra
  case "Biology": 
    // Enroll in Biology
  case "History": 
    // Enroll in History
  case "Theatre":
    // Enroll in Theatre
  default:
    System.out.println("Course not found");
}
 
// enrolls student in Biology... AND History and Theatre!
```

## RESUME

Les conditions apportent des chemins au programme.<br>
On utilise des conditions pour prendre des décisions dans le programme pour que différentes entrées produisent des résultats différents.<br>
Les conditions ont une structure générale :
```
if (condition) {
    // consequent path
} else {
    // alternative path
}
```
Les différentes déclarations de conditions ont différents comportements :
* if-then :
  * Le bloc de code est exécuté si la condition est _true_
* if-then-else :
  * Un bloc de code est exécuté si la consition est _true_
  * Un autre bloc de code est exécuté si la condition est _false_
* if-then-else chaîné :
  * idem au _if-then-else_ mais avec un nombre arbitraire de conditions
* switch :
  * un bloc switch est exécuté si la valeur de la condition correspond à la valeur d'un `case`


