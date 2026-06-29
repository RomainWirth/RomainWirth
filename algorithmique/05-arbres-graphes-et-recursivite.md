# 05 - Arbres, graphes et recursivite

## Les arbres binaires

Un arbre binaire est une structure composee de noeuds.

Chaque noeud peut avoir :

- zero enfant ;
- un enfant ;
- deux enfants.

Le premier noeud est appele la racine.

Un noeud sans enfant est appele une feuille.

## Pourquoi utiliser un arbre ?

Les arbres sont utiles pour representer des hierarchies ou organiser des recherches.

Exemples :

- systemes de fichiers ;
- arbres de decision ;
- certains index de bases de donnees.

## Les graphes

Un graphe est un ensemble de sommets relies par des aretes.

Contrairement a l'arbre, un graphe ne represente pas forcement une hierarchie.

On l'utilise souvent pour modeliser des relations ou des reseaux :

- reseau routier ;
- reseau social ;
- reseau informatique ;
- parcours GPS.

## Parcourir un arbre ou un graphe

Pour trouver une information dans ces structures, il faut les parcourir selon une strategie.

Selon le besoin, on peut par exemple :

- explorer en profondeur ;
- explorer en largeur ;
- chercher un plus court chemin.

## La recursivite

La recursivite consiste a definir une solution a partir d'une version plus petite du meme probleme.

En programmation, une fonction recursive s'appelle elle-meme.

## Conditions d'une bonne recursion

Une fonction recursive doit contenir :

- un cas de base : la condition d'arret ;
- un cas general : l'appel sur une version plus simple du probleme.

Exemple conceptuel :

```text
Fonction compteARebours(n)
Debut
    Si n = 0 Alors
        retourner
    Sinon
        afficher n
        compteARebours(n - 1)
    Fin Si
Fin
```

## Quand utiliser la recursivite ?

Elle est souvent adaptee pour :

- les arbres ;
- les graphes ;
- les problemes divisables en sous-problemes similaires ;
- certains algorithmes de tri ou de parcours.

## Point de vigilance

Une recursion sans condition d'arret provoque une execution infinie ou un depassement de pile.

Il faut donc toujours verifier que le probleme se rapproche reellement du cas de base a chaque appel.