# 02 - Variables, fonctions et types

## Les variables

Une variable est un nom qui permet de stocker une valeur en memoire.

Elle permet de manipuler une information sans avoir a reecrire cette information partout dans l'algorithme.

Exemple :

```text
age <- 24
nom <- "Romain"
```

Une variable a generalement :

- un nom ;
- une valeur ;
- un type.

## Declarer des variables en pseudo-code

```text
Algorithme Exemple
Variables
    nom : CHAINE
    age : ENTIER
Debut
    nom <- "Romain"
    age <- 24
Fin
```

## Les fonctions

Une fonction est un bloc d'instructions reutilisable.

Elle sert a :

- regrouper plusieurs actions ;
- eviter les repetitions ;
- rendre le code plus lisible ;
- decouper un probleme en petits sous-problemes.

Une fonction peut recevoir des parametres en entree et retourner un resultat en sortie.

Exemple :

```text
Fonction addition(a, b)
Debut
    retourner a + b
Fin
```

## Bonnes pratiques sur les fonctions

Une fonction doit idealement :

- avoir une responsabilite claire ;
- avoir un nom explicite ;
- rester courte ;
- eviter de faire plusieurs choses sans lien direct.

## Les types de donnees les plus frequents

Le type indique a l'ordinateur comment une valeur doit etre interpretee et manipulee.

### Les nombres

- entier : `1`, `2`, `42`
- reel / flottant : `1.5`, `3.14`, `10.952`

### Les chaines de caracteres

Une chaine contient du texte.

Exemples :

- `"Algorithme"`
- `"J'ai 2 freres"`

### Les booleens

Un booleen prend deux valeurs possibles :

- vrai ;
- faux.

Ils sont tres utilises dans les conditions.

## Exemple complet de declaration

```text
Algorithme TypesDeBase
Variables
    nombreEntier <- 0 : ENTIER
    nombreFlottant <- 0.0 : REEL
    texte <- "" : CHAINE
    estValide <- Faux : BOOLEEN
Debut
Fin
```

## Pourquoi les types sont importants

Les types permettent :

- de savoir quel genre de valeur on manipule ;
- d'eviter certaines erreurs ;
- de choisir les operations possibles sur une variable.