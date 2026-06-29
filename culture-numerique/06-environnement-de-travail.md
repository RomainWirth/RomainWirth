# ENVIRONNEMENT DE TRAVAIL

## Objectif

Mettre en place son environnement de travail consiste a preparer tous les outils necessaires pour coder, tester, versionner, organiser et deployer ses projets dans de bonnes conditions.

Un bon environnement de travail ne se limite pas a installer un editeur. Il faut aussi disposer de reperes clairs et d'outils fiables pour travailler au quotidien.

## Les grands besoins d'un developpeur

Quel que soit le systeme utilise, on retrouve presque toujours les memes besoins :

- un terminal ;
- un editeur de code ou un IDE ;
- un ou plusieurs navigateurs ;
- Git et une plateforme de collaboration ;
- un gestionnaire de paquets ;
- des outils de test, de design ou de conteneurisation selon les projets.

Ce fichier sert de guide de synthese. Pour les notions deja traitees dans d'autres cours du dossier, il renvoie vers les fichiers dedies.

## 1. Le systeme d'exploitation

L'environnement de travail depend en partie du systeme utilise.

### Linux

Linux est tres apprecie en developpement pour :

- sa proximite avec les environnements serveurs ;
- la richesse de ses outils en ligne de commande ;
- sa flexibilite ;
- sa compatibilite avec beaucoup d'outils web, backend et DevOps.

### macOS

macOS est aussi tres present dans le monde du developpement, notamment pour :

- son environnement Unix ;
- sa stabilite ;
- sa bonne compatibilite avec les outils web et mobiles ;
- son integration materielle / logicielle.

### Windows

Windows reste tres utilise, en particulier dans les environnements bureautiques, entreprise et .NET.

Pour le developpement web, backend ou open source, il est souvent recommande d'utiliser :

- WSL2 ;
- ou un shell compatible Unix.

### Idee importante

Le meilleur systeme n'est pas forcement le meme pour tout le monde. L'important est de connaitre les outils adaptes a son contexte et de pouvoir travailler de maniere stable et reproductible.

## 2. Le terminal

Le terminal fait partie des outils fondamentaux du developpeur.

Il permet de :

- naviguer dans les dossiers ;
- lancer des programmes ;
- utiliser Git ;
- installer des dependances ;
- executer des scripts.

Pour approfondir :

- [05-ligne-de-commande.md](./05-ligne-de-commande.md)

### Recommandations par systeme

- Linux : terminal natif + `bash` ou `zsh`
- macOS : terminal natif + `zsh`
- Windows : WSL2 recommande, sinon PowerShell ou Git Bash

## 3. L'editeur de code ou l'IDE

L'editeur de code est l'outil central du developpeur.

Il permet d'ecrire, lire, organiser et deboguer du code.

Pour approfondir :

- [04-ide-et-editeurs-de-code.md](./04-ide-et-editeurs-de-code.md)

### Choix courant et pragmatique

Pour beaucoup de debutants et de profils polyvalents, Visual Studio Code est un excellent point de depart car il est :

- gratuit ;
- multiplateforme ;
- extensible ;
- compatible avec de nombreux langages.

### Extensions utiles dans VS Code

- `Prettier` pour le formatage
- `ESLint` pour la qualite JS / TS
- `GitLens` pour Git
- `Docker` pour la conteneurisation
- `Path Intellisense` pour les chemins de fichiers
- `Thunder Client` pour tester rapidement des APIs

## 4. Les navigateurs et les DevTools

Le navigateur est indispensable pour tout travail web.

Il ne sert pas seulement a afficher un site, mais aussi a :

- inspecter le HTML et le CSS ;
- tester le JavaScript ;
- analyser le reseau ;
- simuler le responsive ;
- verifier le stockage local et les cookies.

### Navigateurs a avoir en priorite

- Chrome ou Edge pour un environnement Chromium moderne
- Firefox pour ses excellents outils d'inspection CSS

### DevTools : onglets a connaitre

- `Elements` ou `Inspector`
- `Console`
- `Network`
- `Sources`
- `Application` ou `Storage`

## 5. Git et l'hebergement du code

Un environnement de travail developpeur n'est pas complet sans un outil de versioning.

Git permet de :

- garder un historique ;
- revenir en arriere ;
- travailler en branches ;
- collaborer proprement.

Une plateforme comme GitHub ou GitLab permet ensuite :

- d'heberger les depots ;
- de partager le code ;
- de gerer des revues, issues ou pipelines.

### Verification rapide

```bash
git --version
```

### Configuration initiale minimale

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
git config --global core.editor "code --wait"
```

Pour approfondir :

- [../Git-GitHub/cours_git.md](../Git-GitHub/cours_git.md)

## 6. Les gestionnaires de paquets

Un gestionnaire de paquets permet d'installer et de mettre a jour des dependances.

### Exemples selon l'ecosysteme

| Ecosysteme | Outils courants |
| --- | --- |
| JavaScript / Node.js | `npm`, `yarn`, `pnpm` |
| PHP | `composer` |
| Python | `pip` |
| Java | Maven, Gradle |
| Go | Go Modules |

### Pourquoi c'est important

Sans gestionnaire de paquets, il devient difficile de :

- installer une bibliotheque ;
- garder un projet a jour ;
- reproduire le meme environnement sur une autre machine.

### Exemple avec Node.js

`nvm` est souvent recommande pour installer et gerer plusieurs versions de Node.js.

```bash
node -v
npm -v
```

## 7. Les variables d'environnement

Les variables d'environnement servent a separer la configuration du code.

Elles sont particulierement utiles pour stocker :

- des cles API ;
- des mots de passe de base de donnees ;
- des ports ;
- des URLs de services ;
- le mode d'execution (`development`, `production`).

### Exemple

```bash
DATABASE_URL=postgres://user:password@localhost:5432/mydb
API_KEY=ma_cle_secrete
NODE_ENV=development
PORT=3000
```

### Bonnes pratiques

- ne jamais committer un vrai fichier `.env` sensible ;
- documenter les variables attendues ;
- ajouter les bons fichiers dans `.gitignore`.

### Exemple de `.gitignore`

```gitignore
node_modules/
.env
.env.local
.env.production
dist/
build/
.DS_Store
Thumbs.db
```

## 8. Les outils de design et de schema

Selon les projets, il faut parfois produire ou lire :

- des maquettes ;
- des wireframes ;
- des MCD / MLD ;
- des schemas techniques.

### Outils frequents

| Outil | Usage |
| --- | --- |
| Figma | UI / UX, maquettes, prototypes |
| Adobe XD | alternative a Figma |
| Sketch | design d'interface sur macOS |
| draw.io / diagrams.net | schemas et diagrammes |

Pour approfondir :

- [../UI-UX_Figma/Figma.md](../UI-UX_Figma/Figma.md)

## 9. Les outils complementaires

Au-dela du socle de base, certains outils deviennent vite importants selon les projets.

### Tests d'API

- Postman
- Insomnia
- Thunder Client

### Conteneurisation

- Docker
- Docker Compose

Verification rapide :

```bash
docker --version
docker compose version
```

### Outils de base de donnees

| Outil | Usage |
| --- | --- |
| DBeaver | client multi-bases |
| TablePlus | client base de donnees moderne |
| MongoDB Compass | interface MongoDB |
| phpMyAdmin | administration MySQL via navigateur |

### Productivite et organisation

| Outil | Usage |
| --- | --- |
| Notion / Obsidian | notes et documentation personnelle |
| Trello / Jira / Linear | suivi de projet |
| Slack / Discord | communication d'equipe |

## 10. Construire un environnement coherent

Un bon environnement de travail n'est pas une accumulation d'outils.

Il doit surtout etre :

- stable ;
- comprehensible ;
- adapte a ses projets ;
- simple a reconstruire sur une autre machine.

### Version minimale recommandee pour debuter

- un terminal fonctionnel ;
- VS Code ;
- Git ;
- Chrome ou Firefox ;
- un gestionnaire de paquets adapte a l'ecosysteme travaille ;
- quelques extensions et outils complementaires seulement si necessaire.

## A retenir

- L'environnement de travail du developpeur repose sur un socle d'outils complementaires.
- Le terminal, l'editeur, le navigateur, Git et les gestionnaires de paquets sont les bases.
- Les variables d'environnement et les outils complementaires deviennent vite indispensables sur de vrais projets.
- Le bon objectif n'est pas d'avoir tous les outils possibles, mais un environnement simple, coherent et fiable.
