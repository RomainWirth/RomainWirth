# Jour 02 - Historique & bonnes pratiques

⏱ **Durée estimée : une demi-journée à une journée**

## Objectifs

- Lire les différences avec `git diff`
- Ignorer des fichiers avec `.gitignore`
- Annuler et revenir en arrière sans danger
- Écrire de bons messages de commit

---

## 2.1 - Voir ce qui a changé : `git diff`

`git diff` montre les modifications **pas encore ajoutées** au staging :

```bash
git diff                  # changements non encore "add"
git diff --staged         # changements déjà "add", prêts à être commités
```

Les lignes ajoutées apparaissent en vert (`+`), les supprimées en rouge (`-`).

> 💡 Prends l'habitude de faire `git diff` **avant** un commit : tu vérifies exactement ce que tu t'apprêtes à enregistrer.

---

## 2.2 - Ignorer des fichiers : `.gitignore`

Certains fichiers ne doivent **pas** être suivis : fichiers temporaires, dépendances, mots de passe, fichiers système. On les liste dans un fichier `.gitignore` à la racine du dépôt :

```gitignore
# Dépendances
node_modules/

# Fichiers système
.DS_Store
Thumbs.db

# Fichiers d'environnement (secrets !)
.env

# Dossiers de build
dist/
```

> ⚠️ **Ne versionne jamais de secrets** (mots de passe, clés d'API) : une fois poussés sur GitHub, ils restent dans l'historique même après suppression. Le `.gitignore` est ta première protection.

Le `.gitignore`, lui, **doit** être commité (il fait partie du projet).

---

## 2.3 - Annuler et revenir en arrière

Git offre plusieurs filets de sécurité selon la situation :

```bash
# Annuler les modifications non commitées d'un fichier (revenir au dernier commit)
git restore nom-du-fichier

# Retirer un fichier du staging (sans perdre les modifications)
git restore --staged nom-du-fichier

# Voir un ancien état sans rien casser
git log --oneline         # repère l'identifiant du commit
git show <identifiant>    # affiche ce commit
```

> ⚠️ **Prudence avec les commandes destructrices.** `git reset --hard` supprime définitivement des modifications. Tant que tu débutes, préfère `git restore` (réversible) et évite `reset --hard` sauf si tu sais ce que tu fais.

---

## 2.4 - Écrire de bons messages de commit

Un bon message explique **ce que fait** le commit, à l'impératif présent, de façon concise :

| ❌ À éviter | ✅ Préférer |
|---|---|
| `modif` | `Ajoute la section contact` |
| `fix` | `Corrige l'alignement du menu sur mobile` |
| `truc qui marche enfin` | `Corrige le lien cassé vers la page projets` |

Convention courante : une ligne de résumé courte (~50 caractères), à l'impératif. Un historique lisible est un historique utile.

> 💡 Beaucoup d'équipes utilisent des préfixes : `feat:` (nouvelle fonctionnalité), `fix:` (correction), `docs:` (documentation). Exemple : `feat: ajoute le formulaire de contact`.

---

## Tâches du jour

### Tâche 2.1 - Utiliser `git diff`
Modifie un fichier existant. Avant de commiter, lance `git diff` et observe les lignes `+`/`-`. Puis `git add`, `git diff --staged`, et commit.

### Tâche 2.2 - Créer un `.gitignore`
Crée un fichier `.gitignore` à la racine, ajoute-y au moins `.DS_Store` et `.env`. Crée un faux fichier `.env` et vérifie avec `git status` qu'il n'apparaît **pas** dans les fichiers à suivre. Commite le `.gitignore`.

### Tâche 2.3 - Annuler une modification
Modifie un fichier, puis annule ta modification avec `git restore` sans commiter. Vérifie que le fichier est revenu à son état précédent.

### Tâche 2.4 - Historique propre
Fais deux ou trois commits supplémentaires sur ton projet, en soignant les messages (impératif, clairs). Relis ton historique avec `git log --oneline` : il doit se lire comme un résumé du travail accompli.

### ⚡ Pour aller plus loin
Explore `git log --stat` (montre les fichiers modifiés par commit) et `git log -p` (montre le détail des changements de chaque commit).

---

## Livrable

- [ ] J'utilise `git diff` pour vérifier mes changements avant de commiter
- [ ] Un `.gitignore` est en place et fonctionne
- [ ] Je sais annuler une modification avec `git restore`
- [ ] Mes messages de commit sont clairs et à l'impératif
- [ ] Mon historique est lisible

➡️ **Demain (Jour 03)** : travailler sur des branches et résoudre un conflit.
