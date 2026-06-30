# LE CLEAN CODE

Le clean code, ce n'est pas uniquement une question d'esthetique. C'est une methode de travail qui permet d'ecrire un code compréhensible, testable et evolutif. Ce chapitre pose les bases: pourquoi la qualite de code compte, comment nommer correctement, limiter la duplication, gerer les erreurs et refactoriser sans casser l'existant.

## Pourquoi est-ce important ?

Qu'est-ce qu'un code illisible ?
C'est un code difficile a comprendre, fragile, et couteux a faire evoluer. Dans certains cas, il devient plus simple de le reecrire entierement que de le corriger.

A l'inverse, un code propre permet:
- de reduire les bugs,
- d'accelerer la maintenance,
- de faciliter l'onboarding d'un nouveau developpeur,
- d'eviter l'explosion de la dette technique.

Le clean code demande souvent un peu plus d'effort au depart, mais ce temps est rentabilise tres vite pendant toute la vie du projet.

Une phrase souvent citee en developpement:
"Imagine que la personne qui lira ton code est tres exigeante. Ecris pour qu'elle comprenne sans effort."

Tres souvent, cette personne, c'est toi dans quelques semaines.

## Les conventions de nommage

Les conventions de nommage definissent la facon de nommer variables, fonctions, classes, fichiers, constantes, etc.

Le but est simple: produire un code coherent dans toute l'equipe.
Sans coherence, la lecture devient lente et source d'erreurs.

Regle pratique:
- choisis une convention adaptee au langage,
- applique-la partout,
- evite de melanger plusieurs styles dans le meme fichier.

### le `camelCase`

Le `camelCase` relie les mots sans separateur, en commencant par une minuscule.

Exemples:
- ma variable -> maVariable
- ma fonction -> maFonction
- mon super objet -> monSuperObjet

Tres utilise en JavaScript et dans de nombreux contextes en Go.

### Le `PascalCase`

Le `PascalCase` est similaire au camelCase, mais chaque mot commence par une majuscule.

Exemples:
- ma variable -> MaVariable
- ma fonction -> MaFonction
- mon super objet -> MonSuperObjet

Tres courant pour les classes (JavaScript/TypeScript, C#, Java) et pour certaines fonctions exportees en Go.

### Le `snake_case`

Le `snake_case` separe les mots avec un underscore, en minuscules.

Exemples:
- ma variable -> ma_variable
- ma fonction -> ma_fonction
- mon super objet -> mon_super_objet

Frequent en Python, Ruby, SQL.
Pour les constantes globales, on utilise souvent une variante en majuscules: MA_CONSTANTE.

### le `kebab-case`

Le `kebab-case` separe les mots avec des tirets.

Exemples:
- ma variable -> ma-variable
- ma fonction -> ma-fonction
- mon super objet -> mon-super-objet

Tres utile pour:
- les URLs (meilleure lisibilite et SEO),
- les noms de fichiers web,
- les slugs.

## La règle du Boys Scout

La regle du Boys Scout dit:
"Laisse le code dans un meilleur etat que celui dans lequel tu l'as trouve."

C'est une logique d'amelioration continue, tres utile sur les projets existants.

Concretement, quand tu touches un fichier pour une tache:
- corrige un nom ambigu,
- supprime une duplication evidente,
- clarifie une condition complexe,
- corrige un bug mineur adjacent.

Tu n'as pas besoin de tout refondre en une fois: de petites ameliorations regulieres produisent un gros gain de qualite.

Exemple avant/apres (gestion de taches):
- Version avant: [clean-code/exercices/01-introduction/01-boys-scout-todo-avant.js](exercices/01-introduction/01-boys-scout-todo-avant.js)
- Version apres: [clean-code/exercices/01-introduction/01-boys-scout-todo-apres.js](exercices/01-introduction/01-boys-scout-todo-apres.js)

Points a observer dans le refactoring:
- noms plus explicites,
- validation d'entree claire,
- responsabilites mieux separees,
- erreurs plus coherentes.

Attention: si tu renommes une fonction ou une variable, mets a jour tous les appels correspondants.

## Améliorer la lisibilité du code d'un programme

La lisibilite est un accelerateur de developpement.
Un code lisible permet de comprendre rapidement l'intention, de debugger plus vite et d'ajouter des fonctionnalites sans effet de bord inattendu.

Checklist pratique de lisibilite:
- noms explicites (eviter les abreviations opaques),
- fonctions courtes avec une responsabilite claire,
- structure logique stable (validation, traitement, retour),
- peu de bruit visuel (pas de code mort, pas de variables inutilisees),
- commentaires utiles: expliquer le "pourquoi", pas le "quoi" evident.

Exemple avant/apres (gestion d'utilisateurs):
- Version peu lisible: [clean-code/exercices/01-introduction/02-lisibilite-avant.js](exercices/01-introduction/02-lisibilite-avant.js)
- Version lisible: [clean-code/exercices/01-introduction/02-lisibilite-apres.js](exercices/01-introduction/02-lisibilite-apres.js)

Ce qui change dans la version lisible:
- vocabulaire metier clair,
- constantes de configuration nommees,
- logique decoupee en methodes simples,
- meilleure separation entre modele (User) et service (UserManager).

## Le principe DRY

DRY signifie "Don't Repeat Yourself": eviter la repetition de logique metier.

Pourquoi c'est important:
- moins de risque d'incoherence,
- une seule source de verite,
- maintenance plus rapide.

Quand tu detectes des blocs similaires, pose-toi la question:
"Peut-on extraire une fonction, une classe, une constante ou une configuration commune ?"

Exemples DRY (TVA, modeles utilisateurs, factorisation d'envoi email):
- [clean-code/exercices/01-introduction/03-dry.js](exercices/01-introduction/03-dry.js)

Attention:
DRY ne veut pas dire "tout generaliser" trop tot. Il faut d'abord identifier une duplication reelle et stable.

## Bien gérer les erreurs pour un code robuste

Un code robuste n'ignore pas les erreurs: il les anticipe et les traite explicitement.

Bonnes pratiques essentielles:
- valider les donnees d'entree,
- lever des erreurs explicites,
- differencier les erreurs fonctionnelles et systeme,
- retourner des messages utiles sans exposer d'informations sensibles,
- journaliser ce qui est necessaire au diagnostic.

L'usage de classes d'erreurs personnalisees (`ApplicationError`, `ValidationError`, `DatabaseError`) permet d'adapter la reponse selon le contexte.

Exemple complet executable:
- [clean-code/exercices/01-introduction/04-gestion-erreurs.js](exercices/01-introduction/04-gestion-erreurs.js)

Pour tester un exemple dans le terminal:

```bash
cd clean-code/exercices/01-introduction
node 04-gestion-erreurs.js
```

## Résumé

Le clean code est un investissement qui simplifie la vie du projet sur la duree.

A retenir:
- nommer clairement pour reduire la charge cognitive,
- appliquer la regle du Boys Scout a chaque intervention,
- privilegier la lisibilite avant l'astuce,
- factoriser intelligemment avec DRY,
- gerer les erreurs de maniere explicite et previsible.

Si tu appliques ces principes de facon progressive, ton code deviendra plus fiable, plus maintenable et plus agreable a faire evoluer.
