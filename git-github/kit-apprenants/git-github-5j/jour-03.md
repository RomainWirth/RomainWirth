# Jour 03 - Les branches & les conflits

⏱ **Durée estimée : une journée**

## Objectifs

- Comprendre l'intérêt des branches
- Créer, changer et fusionner des branches
- Provoquer et résoudre un conflit de fusion

> 🌿 Les branches sont le super-pouvoir de Git : tester sans rien casser.

---

## 3.1 - Pourquoi des branches ?

Une **branche** est une ligne de développement parallèle. Elle permet de travailler sur une nouvelle fonctionnalité ou une correction **sans toucher** à la version stable (la branche principale, souvent `main`).

Une fois le travail terminé et testé, on **fusionne** (`merge`) la branche dans `main`.

```
main     ●───●───●───────────●   ← version stable
                  \          /
fonctionnalite     ●───●───●      ← on travaille ici, à l'abri
```

---

## 3.2 - Créer et changer de branche

```bash
git branch                    # liste les branches (l'actuelle a une *)
git branch nouvelle-fonction  # crée une branche
git checkout nouvelle-fonction # bascule dessus

# Raccourci : créer ET basculer en une commande
git checkout -b nouvelle-fonction
```

> 💡 `git status` t'indique toujours sur quelle branche tu es. Vérifie **avant** de commiter, pour ne pas travailler sur la mauvaise branche.

Sur la nouvelle branche, tu modifies et commites normalement. Ces commits n'existent **que** sur cette branche, pas sur `main`.

---

## 3.3 - Fusionner une branche

Pour intégrer le travail d'une branche dans `main` :

```bash
git checkout main             # on se place sur la branche cible
git merge nouvelle-fonction   # on y fusionne la branche
```

Si les modifications ne se chevauchent pas, Git fusionne tout seul. Une fois fusionnée, la branche peut être supprimée :

```bash
git branch -d nouvelle-fonction
```

---

## 3.4 - Les conflits de fusion

Un **conflit** survient quand deux branches ont modifié **la même ligne** d'un même fichier. Git ne sait pas laquelle garder, et te demande de trancher.

Git marque la zone en conflit ainsi dans le fichier :

```
<<<<<<< HEAD
Texte de la branche actuelle (main)
=======
Texte de l'autre branche
>>>>>>> nouvelle-fonction
```

Pour résoudre :
1. Ouvre le fichier, choisis quelle version garder (ou combine les deux).
2. **Supprime les marqueurs** `<<<<<<<`, `=======`, `>>>>>>>`.
3. Enregistre le fichier.
4. Ajoute et commite la résolution :

```bash
git add fichier-en-conflit
git commit -m "Résout le conflit sur le titre"
```

> 💡 **Pas de panique face à un conflit** : c'est normal et fréquent. `git status` te dit précisément quels fichiers sont en conflit. VS Code affiche même des boutons « Accept Current / Incoming / Both » pour t'aider.

---

## Tâches du jour

### Tâche 3.1 - Créer une branche
Depuis `main`, crée et bascule sur une branche `amelioration` (`git checkout -b amelioration`). Vérifie avec `git status` et `git branch`.

### Tâche 3.2 - Travailler sur la branche
Sur `amelioration`, modifie un fichier et fais un ou deux commits. Reviens sur `main` (`git checkout main`) et constate que tes modifications **ont disparu** de l'affichage (elles sont sur l'autre branche).

### Tâche 3.3 - Fusionner
Depuis `main`, fusionne `amelioration` (`git merge amelioration`). Vérifie avec `git log --oneline` que les commits sont maintenant sur `main`. Supprime la branche.

### Tâche 3.4 - Provoquer et résoudre un conflit
1. Sur `main`, modifie la **première ligne** d'un fichier et commite.
2. Crée une branche `test-conflit` à partir d'un commit précédent (ou modifie la même ligne différemment) et commite.
3. Fusionne : Git signale un conflit.
4. Ouvre le fichier, résous le conflit (supprime les marqueurs), puis `add` + `commit`.

> Si tu n'arrives pas à créer le conflit, demande de l'aide : l'important est d'en avoir vu un et de savoir le résoudre.

### ⚡ Pour aller plus loin
Découvre `git switch` (alternative moderne à `checkout` pour changer de branche) et `git merge --abort` (annuler une fusion en cours de conflit).

---

## Livrable

- [ ] Je crée et change de branche (`checkout -b`)
- [ ] Je comprends que les commits sont propres à leur branche
- [ ] Je fusionne une branche dans `main` avec `merge`
- [ ] J'ai provoqué et résolu au moins un conflit
- [ ] `git status` est mon réflexe pour savoir où j'en suis

➡️ **Demain (Jour 04)** : publier ton dépôt en ligne sur GitHub.
