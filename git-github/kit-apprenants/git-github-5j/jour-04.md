# Jour 04 - GitHub

⏱ **Durée estimée : une journée**

## Objectifs

- Créer un compte et un dépôt GitHub
- Relier ton dépôt local au dépôt distant
- Envoyer (`push`) et récupérer (`pull`) des commits
- Rédiger un bon README

> ☁️ Aujourd'hui, ton projet quitte ton ordinateur et rejoint le cloud.

---

## 4.1 - Git ≠ GitHub

- **Git** : le logiciel de versionnage, sur ta machine.
- **GitHub** : une plateforme en ligne qui **héberge** des dépôts Git.

GitHub sert à sauvegarder ton code à distance, le partager, et collaborer.

---

## 4.2 - Créer un compte et un dépôt

1. Crée un compte sur https://github.com (utilise **le même email** que ta config Git du jour 1).
2. Clique sur **New repository** (bouton vert, ou `+` en haut à droite).
3. Donne-lui un nom (ex : `mon-premier-depot`).
4. Laisse-le **public**, **ne coche pas** « Add a README » (ton projet local en a déjà un).
5. Clique **Create repository**.

GitHub affiche alors une page avec des commandes : ce sont celles qu'on va utiliser.

---

## 4.3 - L'authentification

Pour envoyer du code, GitHub doit vérifier que c'est bien toi. La méthode simple aujourd'hui :

- Lors du premier `push`, si on te demande un mot de passe dans le terminal, **ce n'est pas** ton mot de passe GitHub mais un **jeton d'accès personnel** (*Personal Access Token*).
- Crée-le dans GitHub : **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token**. Coche la case `repo`. Copie le jeton (il ne s'affiche qu'une fois).
- Colle-le quand le terminal demande le mot de passe.

> 💡 Plus simple encore : installe **GitHub CLI** (`gh auth login`) ou connecte-toi via VS Code (icône « Source Control »), qui gèrent l'authentification pour toi.

> 🔒 **Un jeton est un secret** : ne le partage jamais, ne le mets jamais dans un fichier versionné.

---

## 4.4 - Relier local et distant : `remote`

Le dépôt distant s'appelle par convention `origin`. Relie ton dépôt local (commandes fournies par GitHub à la création) :

```bash
git remote add origin https://github.com/ton-pseudo/mon-premier-depot.git
git remote -v            # vérifie le lien
```

---

## 4.5 - Envoyer : `push`

Envoie tes commits vers GitHub :

```bash
git branch -M main        # nomme la branche principale "main" (au besoin)
git push -u origin main   # premier envoi (le -u mémorise le lien)
```

Les fois suivantes, un simple `git push` suffit. Recharge ta page GitHub : tes fichiers et ton historique y sont ! 🎉

---

## 4.6 - Récupérer : `pull` et `clone`

```bash
# Récupérer les changements du dépôt distant vers ton local
git pull

# Copier un dépôt distant existant sur ta machine
git clone https://github.com/quelqu-un/un-projet.git
```

`pull` sera essentiel quand plusieurs personnes travaillent sur le même dépôt (jour 5). `clone` sert à récupérer un projet existant.

---

## 4.7 - Le README

Le `README.md` est la **page d'accueil** de ton dépôt sur GitHub. Il présente le projet. Structure typique :

```markdown
# Nom du projet

Courte description : à quoi sert ce projet.

## Fonctionnalités

- Point 1
- Point 2

## Installation

Comment récupérer et lancer le projet.

## Auteur

Ton nom.
```

> 💡 Le Markdown (`#` pour les titres, `-` pour les listes, `**gras**`) est rendu joliment par GitHub. Un bon README, c'est la première impression de ton projet.

---

## Tâches du jour

### Tâche 4.1 - Compte et dépôt
Crée ton compte GitHub et un dépôt distant `mon-premier-depot` (vide, sans README).

### Tâche 4.2 - Relier et pousser
Relie ton dépôt local à `origin`, puis pousse ta branche `main`. Vérifie sur GitHub que tes fichiers et ton historique apparaissent.

### Tâche 4.3 - Modifier et repousser
En local, modifie un fichier, commite, puis `git push`. Vérifie que le changement apparaît sur GitHub.

### Tâche 4.4 - Soigner le README
Enrichis ton `README.md` (description, fonctionnalités, auteur), commite et pousse. Vérifie qu'il s'affiche joliment sur la page d'accueil du dépôt.

### Tâche 4.5 - Tester le pull
Sur GitHub, édite un fichier directement dans l'interface (crayon → commit). Puis, en local, fais `git pull` pour récupérer ce changement.

### ⚡ Pour aller plus loin
Explore les **issues** de ton dépôt (onglet Issues) : crée-en une pour noter une amélioration à faire. Ajoute une description à ton dépôt et des *topics* (mots-clés) dans les paramètres.

---

## Livrable

- [ ] J'ai un compte GitHub et un dépôt distant
- [ ] Mon dépôt local est relié à `origin`
- [ ] J'ai poussé mon projet et son historique sur GitHub
- [ ] Je sais faire `push` et `pull`
- [ ] Mon dépôt a un README clair et bien présenté

➡️ **Demain (Jour 05)** : collaborer avec les pull requests et contribuer à un projet collectif.
