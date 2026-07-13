# Jour 03 - Collaboration & pull requests

⏱ **Durée estimée : une journée**

## Objectifs

- Comprendre le fork et la pull request
- Contribuer à un projet collectif
- Relire et commenter une contribution

> 🤝 Le jour le plus « pro » : proposer ses modifications comme dans une vraie équipe.

---

## 3.1 - Fork & pull request

- Une **pull request** (PR) est une **proposition d'intégration** de modifications, pour les faire relire avant fusion.
- Un **fork** est ta **copie personnelle** d'un dépôt appartenant à quelqu'un d'autre (tu ne peux pas y pousser directement).

Le cycle de contribution :

```
Dépôt original  ──fork──▶  Ton fork  ──clone──▶  Ta machine
       ▲                                              │
       └──────────── pull request ◀──────push─────────┘
```

---

## 3.2 - Mode A : le dépôt collectif (recommandé)

Un dépôt collectif, *Le Mur des Apprenants*, permet à chacun d'ajouter une fiche de présentation via une PR. Modèle et notice : [`../depot-collectif-modele/`](../depot-collectif-modele/README.md).

**Étapes :**

```bash
# 1. Forke le dépôt sur GitHub (bouton Fork)

# 2. Clone ton fork
git clone https://github.com/ton-pseudo/mur-des-apprenants.git
cd mur-des-apprenants

# 3. Crée une branche
git checkout -b ajout-prenom

# 4. Copie et remplis ta fiche
cp apprenants/_exemple.md apprenants/ton-prenom.md
# ... édite ton fichier ...

# 5. Commite et pousse sur ton fork
git add apprenants/ton-prenom.md
git commit -m "Ajoute la fiche de <Prénom>"
git push -u origin ajout-prenom
```

**6.** Sur ton fork, GitHub propose **Compare & pull request** → rédige un titre clair → **Create pull request**.
**7.** Le formateur (ou un camarade) relit et **merge**. Ta fiche rejoint le mur ! 🎉

> ⚠️ Ne modifie que **ton** fichier dans `apprenants/`, pour éviter les conflits.

---

## 3.3 - Mode B : en binôme (si vous êtes plusieurs)

Sur vos dépôts personnels (créés au jour 2) :
1. Clone le dépôt d'un·e camarade, crée une branche.
2. Propose une amélioration (README, section...).
3. Pousse la branche et ouvre une PR sur son dépôt.
4. L'autre relit, commente, puis merge.

> 💡 Pour qu'un camarade pousse sur ton dépôt : ajoute-le en **collaborateur** (Settings → Collaborators), ou il passe par un fork (mode A).

---

## 3.4 - Relire une pull request

- Onglet **Files changed** : les modifications proposées (vert/rouge).
- Commente une ligne précise via le `+`.
- **Review changes** → *Approve*, *Comment* ou *Request changes*.
- Puis **Merge pull request**.

> 💡 Une bonne relecture est bienveillante : on commente le code, pas la personne.

---

## Tâches du jour

### Tâche 3.1 - Ma première pull request
Contribue au dépôt collectif en suivant les étapes du 3.2. Ta PR doit être ouverte (idéalement mergée).

### Tâche 3.2 - Relire
Relis la PR d'un·e camarade (ou une PR d'exemple), regarde **Files changed** et laisse un commentaire bienveillant.

### Tâche 3.3 - (Mode B, si possible)
Propose une amélioration sur le dépôt d'un·e camarade via une PR, puis relisez et fusionnez mutuellement.

---

## Bilan - Ce que tu sais faire maintenant

En 3 jours, tu maîtrises l'essentiel de Git & GitHub :

- **Git local** : commits, historique, `.gitignore`, `restore`
- **Branches** : créer, fusionner, résoudre un conflit
- **GitHub** : dépôt distant, `push`/`pull`, README
- **Collaboration** : fork, pull request, review

Continue à versionner **tous** tes projets : c'est en pratiquant que Git devient un réflexe. Pour approfondir, vois la [version 5 jours](../git-github-5j/README.md).

## Livrable final

- [ ] J'ai forké un dépôt et ouvert une pull request
- [ ] Ma contribution au dépôt collectif est proposée (ou mergée)
- [ ] J'ai relu et commenté une pull request
- [ ] Je comprends le cycle fork → branche → PR → review → merge

🎉 **Félicitations, tu sais collaborer avec Git & GitHub !**
