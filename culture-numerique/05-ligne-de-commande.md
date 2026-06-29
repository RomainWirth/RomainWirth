# LIGNE DE COMMANDE

## Qu'est-ce que la ligne de commande ?

La ligne de commande est une interface textuelle qui permet de communiquer avec le systeme d'exploitation en tapant des instructions.

Au lieu de cliquer dans des fenetres, on ecrit des commandes pour :

- se deplacer dans les dossiers ;
- creer, lire, modifier ou supprimer des fichiers ;
- lancer des programmes ;
- automatiser des taches ;
- utiliser des outils de developpement.

Le logiciel qui permet d'utiliser cette interface s'appelle un terminal.

## Pourquoi la ligne de commande est importante ?

Dans les metiers du numerique, elle est tres utile car elle permet de travailler plus vite et plus precisement sur certaines taches.

Elle sert souvent a :

- naviguer dans un projet ;
- lancer un serveur ;
- installer des dependances ;
- utiliser Git ;
- executer des scripts ;
- acceder a des outils qui n'existent pas en interface graphique.

Il ne s'agit pas de tout faire en terminal, mais de savoir l'utiliser quand c'est l'outil le plus efficace.

## Terminal, shell et systeme : ne pas confondre

### Le terminal

Le terminal est la fenetre ou l'application dans laquelle on tape les commandes.

### Le shell

Le shell est le programme qui interprete les commandes.

Exemples de shells :

- `bash`
- `zsh`
- `fish`
- `PowerShell`

### Le systeme d'exploitation

Le systeme d'exploitation est l'environnement global : Linux, Windows ou macOS.

Le terminal et le shell fonctionnent a l'interieur de cet environnement.

## Les grands usages de base

Quand on debute, les besoins les plus courants sont :

- savoir ou l'on se trouve ;
- afficher le contenu d'un dossier ;
- changer de dossier ;
- creer un dossier ou un fichier ;
- supprimer un element ;
- lire un fichier ;
- lancer une commande de projet.

## Les commandes essentielles

Les exemples ci-dessous suivent la logique Unix/Linux, que l'on retrouve aussi sur macOS et dans beaucoup d'environnements de developpement.

### Se reperer

| Commande | Role |
| --- | --- |
| `pwd` | Affiche le dossier courant |
| `ls` | Liste le contenu du dossier |
| `ls -la` | Liste le contenu avec plus de details |

### Se deplacer

| Commande | Role |
| --- | --- |
| `cd nom-dossier` | Entre dans un dossier |
| `cd ..` | Remonte au dossier parent |
| `cd ~` | Revient au dossier personnel |

### Manipuler des fichiers et dossiers

| Commande | Role |
| --- | --- |
| `mkdir nom-dossier` | Cree un dossier |
| `touch fichier.txt` | Cree un fichier vide |
| `cp source destination` | Copie un fichier |
| `mv source destination` | Deplace ou renomme un fichier |
| `rm fichier.txt` | Supprime un fichier |
| `rm -r nom-dossier` | Supprime un dossier et son contenu |

### Lire et chercher

| Commande | Role |
| --- | --- |
| `cat fichier.txt` | Affiche le contenu d'un fichier |
| `less fichier.txt` | Lit un fichier page par page |
| `grep "mot" fichier.txt` | Recherche un mot dans un fichier |

## Exemples concrets

### Entrer dans un projet

```bash
cd mon-projet
```

### Voir les fichiers

```bash
ls -la
```

### Creer un dossier puis un fichier

```bash
mkdir notes
touch notes/todo.md
```

### Lancer une commande de projet

```bash
npm install
```

ou :

```bash
git status
```

## Pourquoi les developpeurs utilisent souvent le terminal

Le terminal est tres pratique quand on travaille sur du code car beaucoup d'outils sont concus pour etre utilises en ligne de commande.

Exemples :

- `git` pour le versioning ;
- `npm`, `pnpm`, `yarn`, `composer`, `pip` pour les dependances ;
- `docker` pour les conteneurs ;
- `node`, `php`, `go`, `python` pour executer du code ou des scripts.

## Differences selon les systemes

### Linux et macOS

Ils utilisent tres souvent une logique Unix, avec des commandes comme :

- `ls`
- `cd`
- `pwd`
- `grep`

### Windows

Sous Windows, plusieurs environnements existent :

- PowerShell ;
- Invite de commandes (`cmd`) ;
- Git Bash ;
- WSL.

Pour un usage developpeur, WSL ou un shell de type Unix est souvent plus confortable, surtout en environnement web.

## Les erreurs classiques quand on debute

- ne pas savoir dans quel dossier on se trouve ;
- lancer une commande au mauvais endroit ;
- confondre supprimer un fichier et supprimer un dossier ;
- recopier une commande sans la comprendre ;
- utiliser `rm -r` ou `rm -rf` sans prudence.

## Bonnes pratiques

- toujours verifier son dossier courant avec `pwd` ;
- lister les fichiers avec `ls` avant d'agir ;
- comprendre une commande avant de l'executer ;
- avancer progressivement ;
- utiliser le terminal pour gagner en precision, pas pour faire compliqué.

## A retenir

- La ligne de commande permet de dialoguer directement avec le systeme.
- Elle est tres utile pour naviguer, manipuler des fichiers et utiliser les outils de developpement.
- Le terminal affiche les commandes, le shell les interprete.
- Quelques commandes de base suffisent deja a etre beaucoup plus autonome.
