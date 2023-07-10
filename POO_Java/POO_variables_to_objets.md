# PROGRAMMATION ORIENTEE OBJET - Des Variables aux Objets

## Les variables

### RAPPEL 

Une variable est un outil contenant une donnée, par exemple un mot ou un chiffre, et qui va être utilisée par un programme.<br>

**L'importance des variables :**<br>
Un programme est constamment en train de manipuler des variables.<br> 
Certaines variables sont données au programme, d'autres sont créées par lui.<br>

la variable est une sorte de boîte dans laquelle est rangée une information.<br>
Cette donnée s'appelle une valeur.<br>

### Nommer une variable

Pour connaître ce que contient la variable, il faudra lui attribuer un nom.<br>

Règles générales pour nommer une variables :<br>
1. **Le nom de la variable doit être descriptif**<br>
Il s'agit d'une règle fondammentale. Le nom doit être à la fois descriptif et concis.<br> 
On doit pouvoir comprendre de quoi il s'agit sans avoir à lire une phrase complète.
2. **Le nom de la variable doit être complet**<br>
Il faut éviter d'abréger ou de raccourcir les mots, même si une version plus courte semble évidente.<br>
3. **Le nom doit suivre une convention d'appellation commune**<br>
L'une des conventions d'appelletion les plus populaires est le **Camel Case** :<br>
Une phrase composée de plusieurs mots sans espaces ni ponctuation.<br> 
Le premier mot est écrit en minuscule et tous les autres mots commencent par une majuscule.<br>

### Déclarer une variable 

En POO, les langages de programmation demandent la déclaration de types pour les variables.<br>
C'est à dire qu'une variable déclarée avec un type nombre ne pourra pas contenir de type string, par exemple.<br>

Pour rappel, il existe 3 types primaires :<br>
1. Les chaînes de caractères : **STRING**
2. Les nombres entiers : **INTEGER**
3. Les booléen : **BOOLEAN**

L'une des problématiques qu'on peut avoir est le nombre de variables pour stocker les informations.<br>
On risque de se retrouve rapidement avec un grand nombre de variables pour véhiculer les données, ce qui peut devenir ingérable.<br>
Quand on se retrouve avec la même structure d'information, on va utiliser les objets pour remédier à cela.

## Les objets

Concrètement, pour simplifier l'utilisation des informations, on va les regrouper sous une _**"super variable"**_.<br>

Cette super variable s'appelle un **objet**.<br>

Pour créer un objet, on va devoir définit sa structure.<br> 
la structure s'appelle une _**"Classe"**_.

On peut assimiler la classe comme un moule à gâteau qui permet d'indiquer les différentes informations que contiendront les futurs objets.<br>

```
La classe va définir la structure globale des objets.
```

Par exemple :<br>
Pour avoir plusieurs personnages qui ont chacuns un nom, une taille, un age etc., on pourra créer une classe personnage :
```
CLASSE Personnage
    nom : CHAINE DE CARACTERES
    taille : ENTIER
    age : ENTIER
    vitesse : ENTIER
    sexe : BOOLEEN
FIN CLASSE
```
Par convention, une classe commence toujours pas une majuscule.<br>
Les informations d'une classe sont appelées des attributs.<br>

Les objets vont découler des classes.<br>
On va pouvoir multiplier les objets qui ont tous la même structure définie par la classe.

