# Jour 01 - Premiers pas avec Git

⏱ **Durée estimée : une demi-journée**

## Objectifs

- Comprendre à quoi sert Git
- Installer et configurer Git
- Créer ton premier dépôt local
- Faire tes premiers commits

> 🚀 Aujourd'hui, tu transformes un dossier ordinaire en projet suivi par Git.

---

## 1.1 - À quoi sert Git ?

**Git** est un logiciel de **versionnage** : il enregistre l'historique des modifications d'un projet. Il permet de savoir quels fichiers ont changé, quand, par qui et pourquoi - et de revenir en arrière en cas de problème.

Trois zones à connaître dès le départ :

| Zone | Rôle |
|---|---|
| Répertoire de travail | Les fichiers que tu modifies |
| Zone de préparation (*staging*) | Les fichiers prêts pour le prochain commit |
| Historique | Les commits déjà enregistrés |

Le cycle de base : **modifier → ajouter au staging (`add`) → enregistrer (`commit`)**.

---

## 1.2 - Installer Git

Vérifie s'il est déjà installé :

```bash
git --version
```

Si une version s'affiche, c'est bon. Sinon :
- **Windows** : télécharge « Git for Windows » sur https://git-scm.com (installe aussi *Git Bash*, un terminal adapté).
- **Mac** : `git` s'installe avec les outils Xcode ; sinon via https://git-scm.com.
- **Linux** : `sudo apt install git` (Debian/Ubuntu) ou l'équivalent de ta distribution.

---

## 1.3 - Configurer Git (une seule fois)

Git associe ton nom et ton email à chaque commit. Configure-les :

```bash
git config --global user.name "Ton Prénom"
git config --global user.email "ton@email.fr"
```

> 💡 Utilise **le même email que ton futur compte GitHub** (jour 4) : tes commits seront ainsi reliés à ton profil.

Vérifie :

```bash
git config --list
```

---

## 1.4 - Créer le projet et le dépôt

Crée un dossier pour ton projet fil rouge, puis initialise Git dedans :

```bash
mkdir mon-premier-depot
cd mon-premier-depot
git init
```

`git init` crée un dossier caché `.git/` : c'est là que Git stocke tout l'historique. Ton dossier est maintenant un **dépôt Git**.

> 💡 Si tu as fait le kit HTML/CSS, tu peux à la place te placer dans ton dossier `ma-vitrine/` et y faire `git init`. Sinon, crée quelques fichiers de notes (voir tâche 1.1).

---

## 1.5 - Le cycle add / commit

Vérifie l'état du dépôt **en permanence** avec :

```bash
git status
```

Ajoute un fichier à la zone de préparation :

```bash
git add nom-du-fichier
git add .                 # ajoute TOUS les fichiers modifiés
```

Enregistre un commit avec un message clair :

```bash
git commit -m "Ajout de la page d'accueil"
```

Vois l'historique :

```bash
git log
git log --oneline         # version compacte, une ligne par commit
```

> 💡 **Un commit = une unité de travail logique.** Ne mets pas 15 changements sans rapport dans un seul commit : fais des commits petits et cohérents, avec un message qui décrit ce qui a changé.

---

## Tâches du jour

> Vérifie chaque étape avec `git status` et `git log`.

### Tâche 1.1 - Créer le projet
Crée le dossier `mon-premier-depot/` (ou réutilise `ma-vitrine/`). S'il est vide, ajoute au moins deux fichiers : un `README.md` (« # Mon premier dépôt ») et un autre fichier de ton choix.

### Tâche 1.2 - Initialiser Git
Fais `git init` dans le dossier, puis `git status` : Git doit lister tes fichiers comme « non suivis » (*untracked*).

### Tâche 1.3 - Premier commit
Ajoute tous les fichiers au staging (`git add .`), vérifie avec `git status`, puis fais un premier commit avec un message clair.

### Tâche 1.4 - Deuxième commit
Modifie un fichier (ajoute une ligne), puis refais le cycle `add` → `commit` avec un message décrivant la modification. Vérifie que `git log --oneline` affiche bien **deux** commits.

### ⚡ Pour aller plus loin
Fais `git config --global alias.st status` : tu pourras désormais taper `git st` au lieu de `git status`. Crée aussi un alias `lg` pour `log --oneline`.

---

## Livrable

- [ ] Git est installé et configuré (nom + email)
- [ ] Mon dossier est un dépôt Git (`git init` fait)
- [ ] J'ai fait au moins deux commits avec des messages clairs
- [ ] `git log --oneline` montre mon historique
- [ ] J'utilise `git status` comme réflexe

➡️ **Demain (Jour 02)** : explorer l'historique, ignorer des fichiers et revenir en arrière.
