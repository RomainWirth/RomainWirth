# Jour 01 - Git en local

⏱ **Durée estimée : une demi-journée à une journée**

## Objectifs

- Installer et configurer Git
- Créer un dépôt et faire des commits
- Lire l'historique et les différences
- Ignorer des fichiers avec `.gitignore`

> 🚀 Aujourd'hui, tu couvres tout le cycle Git en local.

---

## 1.1 - Git en bref

**Git** enregistre l'historique d'un projet. Trois zones : le **répertoire de travail** (tes fichiers), la **zone de préparation** (*staging*), l'**historique** (les commits). Cycle de base : **modifier → `add` → `commit`**.

---

## 1.2 - Installer et configurer

```bash
git --version                       # vérifier l'installation
```

Sinon : https://git-scm.com (Windows/Mac), ou `sudo apt install git` (Linux).

Configuration unique (utilise le **même email que ton futur compte GitHub**) :

```bash
git config --global user.name "Ton Prénom"
git config --global user.email "ton@email.fr"
```

---

## 1.3 - Créer un dépôt et commiter

```bash
mkdir mon-premier-depot && cd mon-premier-depot
git init                    # transforme le dossier en dépôt Git

# ... créer/modifier des fichiers ...

git status                  # ta boussole : à faire très souvent
git add .                   # ajoute tout au staging
git commit -m "Premier commit"
git log --oneline           # historique compact
```

> 💡 **Un commit = une unité de travail logique**, avec un message clair à l'impératif : `Ajoute la page contact`, pas `modif`.

---

## 1.4 - Voir les différences

```bash
git diff                    # changements non encore "add"
git diff --staged           # changements prêts à être commités
```

Lignes ajoutées en vert (`+`), supprimées en rouge (`-`). Réflexe : `git diff` **avant** de commiter.

---

## 1.5 - Ignorer des fichiers : `.gitignore`

Certains fichiers ne doivent pas être suivis (temporaires, dépendances, **secrets**). Crée un `.gitignore` à la racine :

```gitignore
node_modules/
.DS_Store
.env          # secrets : ne JAMAIS versionner
dist/
```

> ⚠️ Un secret (mot de passe, clé d'API) poussé sur GitHub reste dans l'historique même après suppression. Le `.gitignore` est ta première protection. Le `.gitignore`, lui, doit être commité.

---

## 1.6 - Annuler sans danger

```bash
git restore fichier            # annule les modifs non commitées d'un fichier
git restore --staged fichier   # retire du staging (garde les modifs)
```

> ⚠️ Évite `git reset --hard` tant que tu débutes : c'est destructeur. Préfère `git restore` (réversible).

---

## Tâches du jour

### Tâche 1.1 - Config & dépôt
Configure Git (nom + email). Crée `mon-premier-depot/` (ou réutilise `ma-vitrine/`) avec un `README.md` et un autre fichier, puis `git init`.

### Tâche 1.2 - Commits
Fais un premier commit (`add` + `commit`). Modifie un fichier, refais un commit. Vérifie que `git log --oneline` montre **deux** commits avec des messages clairs.

### Tâche 1.3 - diff & gitignore
Utilise `git diff` avant un commit. Crée un `.gitignore` (avec `.env` et `.DS_Store`), crée un faux `.env`, et vérifie via `git status` qu'il est bien ignoré. Commite le `.gitignore`.

### Tâche 1.4 - Annuler
Modifie un fichier puis annule avec `git restore`. Vérifie qu'il est revenu à son état précédent.

### ⚡ Pour aller plus loin
Crée des alias : `git config --global alias.st status` et `alias.lg "log --oneline"`.

---

## Livrable

- [ ] Git est configuré (nom + email)
- [ ] Mon dépôt a plusieurs commits avec des messages clairs
- [ ] J'utilise `git status` et `git diff` comme réflexes
- [ ] Un `.gitignore` fonctionnel est en place
- [ ] Je sais annuler avec `git restore`

➡️ **Demain (Jour 02)** : les branches et la publication sur GitHub.
