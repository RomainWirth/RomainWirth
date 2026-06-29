# 04 - Structures de donnees

## Pourquoi utiliser des structures de donnees ?

Une structure de donnees permet d'organiser plusieurs informations dans un meme conteneur.

Le choix de la structure influence :

- la facilite de lecture ;
- la vitesse de recherche ;
- la facilite d'ajout ou de suppression ;
- la consommation memoire.

## Les tableaux

Un tableau est une structure indexee.

Chaque element est accessible par sa position, appelee index.

Exemple :

| Index | Valeur |
| --- | --- |
| 0 | Valeur 1 |
| 1 | Valeur 2 |
| 2 | Valeur 3 |

### Avantages

- lecture simple ;
- acces rapide a un element connu par son index.

### Limites

- taille souvent fixe dans le modele theorique de base ;
- insertions et suppressions parfois couteuses.

## Les listes chainees

Une liste chainee est une suite de noeuds relies entre eux.

Chaque noeud contient :

- une donnee ;
- une reference vers le noeud suivant.

### Avantages

- ajouts et suppressions plus souples qu'avec un tableau fixe.

### Limites

- acces plus lent a un element precis ;
- il faut parcourir la liste pour atteindre une position donnee.

## Les tables de hachage

Une table de hachage associe une cle a une valeur.

Exemple :

| Cle | Valeur |
| --- | --- |
| voiture | 4 |
| moto | 2 |

On peut alors recuperer une valeur a partir de sa cle.

Exemple :

```text
roues["voiture"]
```

### Avantages

- acces rapide par cle ;
- structure tres pratique pour faire des associations.

### Limites

- pas d'ordre naturel garanti dans le modele general ;
- besoin de cles bien choisies.

## Les piles

Une pile fonctionne selon le principe `LIFO` : `Last In, First Out`.

Le dernier element ajoute est le premier retire.

Exemples d'usage :

- historique d'actions ;
- annulation / retour arriere ;
- pile d'appels de fonctions.

## Les files

Une file fonctionne selon le principe `FIFO` : `First In, First Out`.

Le premier element ajoute est le premier retire.

Exemples d'usage :

- file d'attente ;
- traitement de taches dans l'ordre d'arrivee ;
- gestion de requetes ou d'evenements.

## Bien choisir une structure

Le bon choix depend de la question a resoudre :

- lire vite ?
- inserer souvent ?
- rechercher par cle ?
- conserver un ordre ?

Il n'existe pas de structure parfaite pour tous les cas.