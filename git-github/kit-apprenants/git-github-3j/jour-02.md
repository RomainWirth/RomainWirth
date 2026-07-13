# Jour 02 - Branches & GitHub

⏱ **Durée estimée : une journée**

## Objectifs

- Créer, fusionner des branches et résoudre un conflit
- Créer un compte et un dépôt GitHub
- Envoyer et récupérer du code (`push` / `pull`)
- Rédiger un README

---

## 2.1 - Les branches

Une **branche** est une ligne de développement parallèle : on y travaille sans toucher à la version stable (`main`), puis on **fusionne**.

```bash
git checkout -b nouvelle-fonction   # crée ET bascule sur la branche
# ... modifie et commite ...
git checkout main                   # revient sur main
git merge nouvelle-fonction         # fusionne le travail
git branch -d nouvelle-fonction     # supprime la branche fusionnée
```

> 💡 `git status` t'indique toujours ta branche courante. Vérifie avant de commiter.

---

## 2.2 - Résoudre un conflit

Un **conflit** survient quand deux branches modifient la **même ligne**. Git marque la zone :

```
<<<<<<< HEAD
version de la branche actuelle
=======
version de l'autre branche
>>>>>>> nouvelle-fonction
```

Pour résoudre : ouvre le fichier, garde la bonne version, **supprime les marqueurs**, puis :

```bash
git add fichier-en-conflit
git commit -m "Résout le conflit"
```

> 💡 Un conflit, c'est normal et fréquent. `git status` liste les fichiers concernés. VS Code propose des boutons d'aide (Accept Current / Incoming / Both).

---

## 2.3 - Git ≠ GitHub

**Git** = le logiciel sur ta machine. **GitHub** = la plateforme en ligne qui héberge les dépôts. GitHub sert à sauvegarder, partager et collaborer.

---

## 2.4 - Créer un compte et un dépôt

1. Compte sur https://github.com (même email que ta config Git).
2. **New repository** → nomme-le (ex : `mon-premier-depot`), **public**, **sans** README (ton projet local en a déjà un) → **Create**.

**Authentification** : au premier `push`, le « mot de passe » demandé est un **jeton d'accès personnel** (Settings → Developer settings → Personal access tokens → cocher `repo`). Plus simple : connecte-toi via **VS Code** ou **GitHub CLI** (`gh auth login`).

> 🔒 Un jeton est un secret : ne le partage pas, ne le versionne pas.

---

## 2.5 - Relier, envoyer, récupérer

```bash
git remote add origin https://github.com/ton-pseudo/mon-premier-depot.git
git branch -M main
git push -u origin main       # premier envoi

# ensuite, au quotidien :
git push                      # envoyer ses commits
git pull                      # récupérer les changements distants
git clone <url>               # copier un dépôt existant
```

Recharge ta page GitHub : ton code et ton historique y sont. 🎉

---

## 2.6 - Le README

Le `README.md` est la page d'accueil du dépôt. Structure typique :

```markdown
# Nom du projet

Courte description.

## Fonctionnalités
- Point 1

## Auteur
Ton nom.
```

Le Markdown (`#`, `-`, `**gras**`) est rendu joliment par GitHub.

---

## Tâches du jour

### Tâche 2.1 - Branche & merge
Crée une branche `amelioration`, fais-y un commit, reviens sur `main` et fusionne-la.

### Tâche 2.2 - Conflit
Provoque un conflit (modifie la même ligne sur deux branches) et résous-le.

### Tâche 2.3 - Publier sur GitHub
Crée ton compte et un dépôt distant. Relie `origin`, puis `push` ta branche `main`. Vérifie que tout apparaît sur GitHub.

### Tâche 2.4 - README + push
Enrichis ton `README.md`, commite et pousse. Vérifie qu'il s'affiche sur la page d'accueil du dépôt.

### Tâche 2.5 - pull
Édite un fichier directement sur GitHub (crayon → commit), puis `git pull` en local pour récupérer le changement.

### ⚡ Pour aller plus loin
Ouvre une **issue** sur ton dépôt pour noter une amélioration future.

---

## Livrable

- [ ] Je crée, fusionne des branches et résous un conflit
- [ ] J'ai un dépôt GitHub relié à mon dépôt local
- [ ] Je sais faire `push` et `pull`
- [ ] Mon dépôt a un README clair
- [ ] Mon projet et son historique sont en ligne

➡️ **Demain (Jour 03)** : collaborer avec les pull requests.
