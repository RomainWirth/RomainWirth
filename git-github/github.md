# GITHUB

## Qu'est-ce que GitHub ?

GitHub est une plateforme en ligne qui heberge des depots Git.

Autrement dit :

- Git est l'outil de versionnage ;
- GitHub est un service qui permet de stocker, partager et collaborer autour de depots Git.

## A quoi sert GitHub ?

GitHub sert notamment a :

- sauvegarder son code a distance ;
- travailler a plusieurs sur un meme projet ;
- partager un projet publiquement ou prive ;
- relire du code via des pull requests ;
- gerer des issues, discussions et automatisations.

GitHub est donc a la fois un espace d'hebergement et un outil de collaboration.

## Pourquoi utiliser GitHub ?

### Sauvegarde distante

Si ton projet n'existe que sur ton ordinateur, tu restes vulnerable a la perte de machine, a la corruption ou a une mauvaise manipulation.

Avec GitHub, le depot existe aussi en ligne.

### Collaboration

Plusieurs personnes peuvent travailler sur le meme projet, chacun sur ses branches, puis proposer leurs modifications proprement.

### Visibilite

GitHub est aussi une vitrine technique :

- portfolio de developpeur ;
- partage de projets ;
- contribution open source ;
- travail en equipe.

## Les elements importants de GitHub

### Le repository

Sur GitHub, un repository est l'espace qui contient un projet, son code, ses branches, son historique et ses outils de collaboration.

### Le README

Le fichier `README.md` est souvent la page d'accueil d'un projet.

Il sert a presenter :

- le but du projet ;
- son installation ;
- son usage ;
- sa structure ;
- d'eventuelles consignes de contribution.

### Les issues

Les issues permettent de suivre :

- des bugs ;
- des idees d'amelioration ;
- des taches a faire ;
- des discussions techniques.

### Les pull requests

Une pull request permet de proposer l'integration de modifications d'une branche vers une autre.

Elle sert souvent a :

- relire le code ;
- discuter les changements ;
- valider avant fusion.

## Git local et GitHub distant

Un projet peut exister localement sur ton ordinateur et a distance sur GitHub.

Les commandes principales pour synchroniser les deux sont :

### Cloner un depot existant

```bash
git clone <url-du-depot>
```

### Envoyer ses commits vers GitHub

```bash
git push
```

### Recuperer les modifications distantes

```bash
git pull
```

## Exemple de workflow simple

1. Creer un depot sur GitHub.
2. Le cloner en local.
3. Modifier le projet.
4. Faire un commit avec Git.
5. Envoyer les changements avec `git push`.

Exemple :

```bash
git clone <url-du-depot>
cd mon-projet
git add .
git commit -m "Add homepage content"
git push
```

## Travailler a plusieurs avec GitHub

Dans un projet collaboratif, on utilise souvent ce schema :

1. chacun cree une branche ;
2. chacun travaille sur sa partie ;
3. chacun pousse sa branche ;
4. une pull request est ouverte ;
5. le code est relu puis fusionne.

Cela permet d'eviter que tout le monde modifie directement la meme branche principale sans controle.

## Bonnes pratiques sur GitHub

- garder un README clair ;
- nommer les depots proprement ;
- utiliser des pull requests pour les changements importants ;
- documenter les bugs et taches avec des issues ;
- eviter de pousser des secrets ou fichiers sensibles ;
- ajouter un `.gitignore` adapte au projet.

## Ce qu'il ne faut pas mettre sur GitHub

Il faut eviter de publier :

- des mots de passe ;
- des cles API ;
- des fichiers `.env` sensibles ;
- des donnees confidentielles ;
- des fichiers inutiles comme certains builds ou dependances volumineuses.

## GitHub et insertion professionnelle

GitHub est souvent consulte dans un contexte de formation, de recrutement ou de collaboration.

Un bon profil GitHub peut montrer :

- des projets reels ;
- une progression technique ;
- une capacite a documenter ;
- une pratique propre du versionnage.

## A retenir

- GitHub est une plateforme d'hebergement et de collaboration autour de Git.
- Il permet de sauvegarder, partager et suivre un projet a distance.
- Les pull requests, issues et README sont des elements centraux de son usage.
- GitHub ne remplace pas Git : il le complete.