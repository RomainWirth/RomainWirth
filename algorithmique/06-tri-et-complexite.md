# 06 - Tri et complexite

## Trier des informations

Le tri est un probleme central en algorithmique.

Trier consiste a reorganiser des donnees selon un ordre donne :

- alphabetique ;
- numerique ;
- chronologique ;
- ou base sur un critere metier.

## Le tri a bulles

Le tri a bulles compare des paires de valeurs voisines et les echange si elles ne sont pas dans le bon ordre.

La plus grande valeur remonte progressivement vers la fin du tableau.

Exemple de principe :

```text
Algorithme TriABulles(tableau)
Debut
    tailleTableau <- Taille(tableau)

    Pour i allant de tailleTableau - 1 jusqu'a 1
        Pour j allant de 0 jusqu'a i - 1
            Si tableau[j + 1] < tableau[j] Alors
                echanger(tableau[j + 1], tableau[j])
            Fin Si
        Fin Pour
    Fin Pour
Fin
```

## Limite du tri a bulles

Le tri a bulles est simple a comprendre, mais il n'est pas le plus performant pour de grandes quantites de donnees.

## Autres algorithmes de tri

### Tri par insertion

Chaque element est insere a la bonne position parmi les elements deja tries.

### Tri par selection

On selectionne a chaque tour le plus petit element restant pour le placer au bon endroit.

### Tri par fusion

On divise le tableau en sous-parties, on trie chaque sous-partie, puis on les fusionne.

### Tri par tas

On s'appuie sur une structure de type tas pour retrouver rapidement le plus grand ou le plus petit element.

## Pourquoi parler de complexite ?

Deux algorithmes peuvent produire le meme resultat avec des couts tres differents.

La complexite sert a mesurer ce cout, principalement en :

- temps ;
- espace memoire.

## La notation Big O

La notation `O(...)` permet d'estimer la croissance du cout d'un algorithme quand la taille des donnees augmente.

Quelques ordres de grandeur frequents :

- `O(1)` : temps constant ;
- `O(log n)` : logarithmique ;
- `O(n)` : lineaire ;
- `O(n log n)` : quasi-lineaire ;
- `O(n^2)` : quadratique ;
- `O(2^n)` : exponentielle.

## Complexite temporelle

La complexite temporelle mesure l'evolution du nombre d'operations necessaires.

Exemples :

- lire une case connue d'un tableau : souvent `O(1)` ;
- parcourir tout un tableau : `O(n)` ;
- double boucle imbriquee sur un tableau : souvent `O(n^2)`.

## Complexite spatiale

La complexite spatiale mesure la memoire supplementaire necessaire.

Exemple :

- stocker `n` elements dans un tableau implique une memoire en `O(n)`.

## Pourquoi c'est important

La complexite permet de :

- comparer plusieurs solutions ;
- anticiper les limites d'un algorithme ;
- choisir l'approche la plus adaptee au volume de donnees.

En algorithmique, une solution correcte n'est pas toujours suffisante : on cherche aussi une solution raisonnablement efficace.