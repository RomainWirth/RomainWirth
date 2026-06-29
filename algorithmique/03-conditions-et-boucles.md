# 03 - Conditions et boucles

## Les structures conditionnelles

Une structure conditionnelle permet de prendre une decision.

Le principe est simple :

- si une condition est vraie, on execute un bloc ;
- sinon, on execute un autre bloc ou rien du tout.

## La condition `Si`

Exemple simple :

```text
Algorithme TestArrivee
Debut
    Si joueurCoordonnees = arriveeCoordonnees Alors
        afficher "Vous avez gagne !"
    Fin Si
Fin
```

## Operateurs de comparaison

| Operateur | Signification |
| --- | --- |
| `=` | egal a |
| `!=` | different de |
| `>` | strictement superieur a |
| `<` | strictement inferieur a |
| `>=` | superieur ou egal a |
| `<=` | inferieur ou egal a |

## `Si ... Sinon`

```text
Algorithme TestVictoire
Debut
    Si joueurCoordonnees = arriveeCoordonnees Alors
        afficher "Vous avez gagne !"
    Sinon
        afficher "Vous avez perdu !"
    Fin Si
Fin
```

## Combiner des conditions

On peut combiner plusieurs tests avec :

- `ET` : les deux conditions doivent etre vraies ;
- `OU` : au moins une des deux doit etre vraie.

Exemple :

```text
Si joueurCoordonnees = arriveeCoordonnees ET deplacements <= 10 Alors
    afficher "Vous avez gagne !"
Sinon
    afficher "Vous avez perdu !"
Fin Si
```

## Les boucles

Une boucle permet de repeter une ou plusieurs instructions.

On les utilise lorsqu'une action doit etre repetee :

- un certain nombre de fois ;
- ou tant qu'une condition reste vraie.

## La boucle `Tant Que`

Elle s'utilise quand on ne sait pas exactement combien d'iterations seront necessaires.

```text
Algorithme BoucleTantQue
Variables
    joueurPositionX <- 0 : ENTIER
    joueurPositionY <- 0 : ENTIER
    arriveePositionX <- 5 : ENTIER
    arriveePositionY <- 5 : ENTIER
Debut
    Tant Que joueurPositionX != arriveePositionX OU joueurPositionY != arriveePositionY
        deplacement(joueurPositionX, joueurPositionY)
    Fin Tant Que
Fin
```

### Point d'attention

Une boucle `Tant Que` peut devenir infinie si la condition ne devient jamais fausse.

Il faut donc toujours prevoir une condition d'arret reelle.

## La boucle `Pour`

Elle s'utilise quand le nombre d'iterations est connu ou borné.

```text
Algorithme BouclePour
Variables
    maxDeplacement <- 10 : ENTIER
Debut
    Pour i allant de 0 jusqu'a maxDeplacement
        afficher i
    Fin Pour
Fin
```

## Quand choisir quelle boucle ?

- `Pour` : quand le nombre de repetitions est connu.
- `Tant Que` : quand on depend d'un etat ou d'une condition d'arret.

## Bonnes pratiques

- donner un role clair a la boucle ;
- verifier la condition d'arret ;
- eviter les boucles inutilement complexes ;
- limiter les traitements inutiles a l'interieur de la boucle.