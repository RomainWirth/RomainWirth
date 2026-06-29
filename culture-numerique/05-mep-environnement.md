# Mettre en place de son environnement de travail

## Table des matières

1. [Introduction](#introduction)
2. [Le terminal](#le-terminal)
3. [L'IDE](#lide--léditeur-de-code)
4. [Les navigateurs](#les-navigateurs)
5. [Git et GitHub](#git-et-github)
6. [Les gestionnaires de paquets](#les-gestionnaires-de-paquets)
7. [Les variables d'environnement](#les-variables-denvironnement)
8. [Les outils de design](#les-outils-de-design)
9. [Les outils complémentaires](#les-outils-complémentaires)

---

## Introduction

Mettre en place son environnement de travail fait partie des bases du métier de développeur.
Selon l'OS utilisé (Windows, Mac ou Linux), les outils et leur configuration diffèrent, mais les besoins restent les mêmes :

- Un **terminal** pour interagir avec le système
- Un **éditeur de code** (IDE) pour écrire et organiser le code
- Un ou plusieurs **navigateurs** avec DevTools pour tester et déboguer
- **Git** pour versionner son code et collaborer
- Un **gestionnaire de paquets** pour installer les dépendances
- Des **outils complémentaires** selon les projets (Docker, Postman, Figma…)

---

## [Le terminal](./culture_numerique/ligne_de_commande.md)

Le terminal est l'interface en ligne de commande qui permet d'interagir directement avec le système d'exploitation. Sa maîtrise est indispensable pour tout développeur.

### Linux / macOS

Linux et macOS sont basés sur Unix et disposent d'un terminal natif puissant (`bash`, `zsh`).
Il est recommandé d'utiliser **Zsh** avec [Oh My Zsh](https://ohmyz.sh/) pour bénéficier d'une autocomplétion avancée, de thèmes et de plugins.

```bash
# Installer Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### Windows

Sous Windows, plusieurs options existent :

| Outil | Description |
|---|---|
| **WSL2** (Windows Subsystem for Linux) | Recommandé : fournit un vrai environnement Linux intégré à Windows |
| **Git Bash** | Terminal Unix léger fourni avec Git for Windows |
| **PowerShell** | Terminal natif Windows, puissant mais syntaxe différente |
| **Cygwin** | Émulateur Unix pour Windows |

> **Recommandation** : préférer WSL2 + Ubuntu pour avoir un environnement Linux complet sur Windows.

### Commandes essentielles

```bash
pwd                    # Affiche le répertoire courant
ls -la                 # Liste les fichiers (avec fichiers cachés)
cd <dossier>           # Change de répertoire
mkdir <nom>            # Crée un dossier
touch <nom>            # Crée un fichier
rm -rf <nom>           # Supprime un fichier/dossier (attention : irréversible)
cat <fichier>          # Affiche le contenu d'un fichier
grep "motif" <fichier> # Recherche dans un fichier
```

---

## [L'IDE / L'éditeur de code](./culture_numerique/IDE.md)

L'éditeur de code est l'outil central du développeur. Il en existe plusieurs :

| Éditeur | Gratuit | Points forts |
|---|---|---|
| **Visual Studio Code** | Oui | Extensions, terminal intégré, très populaire |
| **WebStorm / IntelliJ** | Non (essai gratuit) | IDE complet, excellent pour JS/Java |
| **Sublime Text** | Oui (gratuit limité) | Légèreté, rapidité |
| **Neovim / Vim** | Oui | Entièrement dans le terminal, très puissant une fois maîtrisé |

### Visual Studio Code — incontournable

VSCode est l'IDE le plus utilisé. Il est gratuit, open-source et hautement personnalisable.

**Extensions recommandées :**

- `Prettier` — formatage automatique du code
- `ESLint` — détection des erreurs JS/TS
- `GitLens` — visualisation avancée de l'historique Git
- `Live Share` — collaboration en temps réel
- `Path Intellisense` — autocomplétion des chemins de fichiers
- `Thunder Client` — client REST intégré (alternative à Postman)
- `Docker` — gestion des conteneurs depuis VSCode
- `vscode-icons` — icônes pour mieux repérer les types de fichiers

**Raccourcis utiles :**

| Raccourci | Action |
|---|---|
| `Ctrl + P` | Ouvrir un fichier rapidement |
| `Ctrl + Shift + P` | Palette de commandes |
| `Ctrl + \`` ` \`` ` | Ouvrir le terminal intégré |
| `Alt + Shift + F` | Formater le fichier |
| `Ctrl + D` | Sélectionner l'occurrence suivante |
| `Ctrl + /` | Commenter / décommenter une ligne |

---

## [Les navigateurs](./culture_numerique/raccourcis_clavier_Navigateur.md)

Les navigateurs modernes embarquent des **DevTools** (outils de développement) indispensables pour déboguer et inspecter les applications web.

### Navigateurs recommandés

- **Google Chrome** — DevTools complets, excellent pour le débogage JS
- **Mozilla Firefox** — DevTools puissants, meilleur inspecteur CSS/Grid/Flexbox
- **Edge** — basé sur Chromium, bonne intégration Windows

> Il est conseillé d'avoir **au minimum Chrome et Firefox** installés pour tester la compatibilité cross-browser.

### DevTools — raccourcis clés

| Raccourci | Action |
|---|---|
| `F12` ou `Ctrl + Shift + I` | Ouvrir les DevTools |
| `Ctrl + Shift + C` | Inspecter un élément |
| `Ctrl + Shift + J` | Ouvrir la console |
| `Ctrl + Shift + M` | Mode responsive / simulation mobile |

### Onglets essentiels des DevTools

- **Elements / Inspector** : inspecter et modifier le HTML/CSS en direct
- **Console** : exécuter du JS, visualiser les logs et erreurs
- **Network** : analyser les requêtes HTTP (API, assets, temps de chargement…)
- **Sources** : déboguer le JS avec des breakpoints
- **Application** : inspecter localStorage, sessionStorage, cookies

---

## [Git et GitHub](./Git-GitHub/cours_git.md)

### Qu'est-ce que Git ?

**Git** est un système de contrôle de version distribué. Il permet de :

- Garder un historique complet de toutes les modifications du code
- Travailler en parallèle sur des branches indépendantes
- Revenir à une version précédente en cas de problème
- Collaborer à plusieurs sans écraser le travail des autres

**GitHub** est une plateforme en ligne qui héberge les dépôts Git et facilite la collaboration (Pull Requests, Issues, Actions CI/CD…).

### Installation et configuration initiale

```bash
# Vérifier si Git est installé
git --version

# Configuration de base (à faire une seule fois)
git config --global user.name "Votre Nom"
git config --global user.email "votre@email.com"
git config --global core.editor "code --wait"  # VSCode comme éditeur par défaut
```

### Workflow de base

```bash
git init                        # Initialiser un dépôt local
git clone <url>                 # Cloner un dépôt existant

git status                      # Voir l'état des fichiers modifiés
git add .                       # Ajouter tous les fichiers modifiés au staging
git commit -m "message clair"   # Créer un commit

git pull                        # Récupérer les dernières modifications distantes
git push                        # Envoyer ses commits vers GitHub

git branch <nom-branche>        # Créer une branche
git checkout <nom-branche>      # Changer de branche
git checkout -b <nom-branche>   # Créer et basculer sur une nouvelle branche
git merge <nom-branche>         # Fusionner une branche dans la branche courante
```

### Bonnes pratiques

- Écrire des **messages de commit clairs** : `"Add user authentication"`, `"Fix login redirect bug"`
- Committer **souvent et par petites unités** logiques
- Travailler sur des **branches dédiées** (une branche = une feature ou un fix)
- Ne jamais pousser directement sur `main` en équipe → utiliser les **Pull Requests**
- Toujours ajouter un fichier **`.gitignore`** pour exclure les fichiers sensibles

---

## Les gestionnaires de paquets

Un gestionnaire de paquets permet d'installer, mettre à jour et gérer les dépendances d'un projet.

### Selon le langage / l'écosystème

| Écosystème | Gestionnaire | Commande d'installation |
|---|---|---|
| **JavaScript / Node.js** | `npm` (inclus avec Node) | `npm install <paquet>` |
| **JavaScript / Node.js** | `yarn` | `yarn add <paquet>` |
| **JavaScript / Node.js** | `pnpm` (plus rapide, moins d'espace disque) | `pnpm add <paquet>` |
| **Python** | `pip` | `pip install <paquet>` |
| **PHP** | `Composer` | `composer require <paquet>` |
| **Java** | `Maven` / `Gradle` | via `pom.xml` / `build.gradle` |
| **Go** | `Go modules` | `go get <paquet>` |

### Installer Node.js avec NVM (recommandé)

**NVM** (Node Version Manager) permet de gérer plusieurs versions de Node.js sur la même machine :

```bash
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Installer la dernière version LTS de Node
nvm install --lts
nvm use --lts

# Vérifier les installations
node -v
npm -v
```

---

## Les variables d'environnement

Les variables d'environnement permettent de stocker des informations sensibles ou spécifiques à l'environnement (clés API, URLs de base de données…) **sans les exposer dans le code source**.

### Fichier `.env`

```bash
# .env — NE JAMAIS committer ce fichier
DATABASE_URL=postgres://user:password@localhost:5432/mydb
API_KEY=ma_cle_secrete
NODE_ENV=development
PORT=3000
```

### `.gitignore` — fichiers à exclure systématiquement

```gitignore
# Dépendances
node_modules/

# Variables d'environnement
.env
.env.local
.env.production

# Builds
dist/
build/

# Système
.DS_Store
Thumbs.db
```

---

## Les outils de design

Pour concevoir les maquettes et prototypes d'interfaces avant de coder :

| Outil | Usage |
|---|---|
| **Figma** | Référence pour la conception UI/UX, collaboration en temps réel, gratuit |
| **Adobe XD** | Alternative à Figma, intégré à la suite Adobe |
| **Sketch** | macOS uniquement, très utilisé en agence |
| **draw.io / diagrams.net** | Schémas, diagrammes, MCD/MLD, gratuit |

> [Figma](./UI-UX_Figma/Figma.md) est aujourd'hui le standard de l'industrie pour la conception d'interfaces web et mobile.

---

## Les outils complémentaires

### Tests d'API

- **Postman** — client GUI pour tester les routes d'une API REST ou GraphQL
- **Insomnia** — alternative légère à Postman
- **Thunder Client** — extension VSCode, idéal pour des tests rapides sans quitter l'éditeur

### Conteneurs et virtualisation

- **Docker** — conteneuriser les applications pour garantir un environnement reproductible sur toutes les machines
- **Docker Compose** — orchestrer plusieurs conteneurs (application + base de données, etc.)

```bash
# Vérifier l'installation Docker
docker --version
docker compose version
```

### Bases de données — outils visuels

| Outil | Compatible avec |
|---|---|
| **DBeaver** | MySQL, PostgreSQL, SQLite, MongoDB… |
| **TablePlus** | MySQL, PostgreSQL, SQLite, Redis… |
| **MongoDB Compass** | MongoDB uniquement |
| **phpMyAdmin** | MySQL (via navigateur) |

### Productivité

| Outil | Usage |
|---|---|
| **Notion / Obsidian** | Prise de notes, documentation personnelle |
| **Trello / Jira / Linear** | Gestion de projet et suivi de tickets |
| **Slack / Discord** | Communication d'équipe |
