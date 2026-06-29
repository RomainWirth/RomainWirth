# GIT

## Qu'est-ce que Git ?

Git est un logiciel de versionnage.

Il permet de conserver l'historique des modifications d'un projet dans le temps. Grace a lui, on peut savoir :

- quels fichiers ont change ;
- quand ils ont change ;
- qui a effectue les modifications ;
- et dans quel but, si les messages de commit sont bien rediges.

Git est un outil central dans le developpement moderne, aussi bien pour travailler seul que pour collaborer a plusieurs.

## Pourquoi utiliser Git ?

Git permet de :

- sauvegarder l'evolution d'un projet ;
- revenir a une version precedente en cas de probleme ;
- tester des modifications sans casser la version stable ;
- collaborer sur un meme projet ;
- comprendre l'historique du code.

Autrement dit, Git n'est pas seulement un outil de sauvegarde. C'est un outil de suivi, d'organisation et de collaboration.

## Les concepts de base

### Le depot

Le depot, ou `repository`, est l'espace dans lequel Git suit les fichiers d'un projet.

### Le commit

Un commit est un enregistrement de l'etat du projet a un instant donne.

Chaque commit doit representer une unite de travail logique.

### La branche

Une branche permet de travailler sur une version parallele du projet.

Elle sert a developper une fonctionnalite ou corriger un bug sans impacter directement la branche principale.

### Le merge

Le merge permet de fusionner les modifications d'une branche dans une autre.

## Le cycle de travail avec Git

Le fonctionnement de Git repose souvent sur trois grandes zones :

- le repertoire de travail : les fichiers que l'on modifie ;
- la zone de preparation (`staging area`) : les fichiers que l'on prepare pour le prochain commit ;
- l'historique Git : les commits deja enregistres.

Le cycle classique est donc :

1. modifier des fichiers ;
2. ajouter les fichiers a la zone de preparation ;
3. creer un commit.

## Les commandes essentielles

### Initialiser un depot

```bash
git init
```

### Verifier l'etat du projet

```bash
git status
```

### Ajouter un fichier a la zone de preparation

```bash
git add nom-du-fichier
```

### Ajouter tous les fichiers modifies

```bash
git add .
```

### Creer un commit

```bash
git commit -m "message clair"
```

### Voir l'historique

```bash
git log
```

### Voir les differences

```bash
git diff
```

## Travailler avec des branches

### Voir les branches

```bash
git branch
```

### Creer une branche

```bash
git branch nom-branche
```

### Changer de branche

```bash
git checkout nom-branche
```

### Creer et changer de branche en une commande

```bash
git checkout -b nom-branche
```

### Fusionner une branche

```bash
git merge nom-branche
```

## Exemples d'usage courant

### Commencer un projet local

```bash
git init
git status
```

### Enregistrer une premiere version

```bash
git add .
git commit -m "Initial commit"
```

### Travailler sur une fonctionnalite

```bash
git checkout -b feature/navbar
```

Puis, une fois les changements termines :

```bash
git add .
git commit -m "Add responsive navbar"
```

## Bonnes pratiques

- faire des commits reguliers ;
- ecrire des messages de commit explicites ;
- travailler par petites unites logiques ;
- utiliser des branches pour les fonctionnalites ou correctifs ;
- verifier `git status` avant de commit.

## Ce que Git ne remplace pas

Git ne remplace pas :

- une bonne organisation du projet ;
- des messages de commit comprehensibles ;
- des revues de code ;
- des sauvegardes distantes si le depot n'est que local.

## A retenir

- Git est un outil de versionnage.
- Il permet de suivre l'historique d'un projet.
- Il repose sur des concepts simples : depot, commit, branche, merge.
- Bien utilise, il rend le travail plus sur, plus clair et plus collaboratif.

