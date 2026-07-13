# Jour 05 - Collaboration & pull requests

⏱ **Durée estimée : une journée**

## Objectifs

- Comprendre le fork et la pull request
- Contribuer à un projet collectif
- Relire et commenter des modifications
- Découvrir un workflow de collaboration

> 🤝 Le jour le plus « pro » : proposer ses modifications proprement, comme dans une vraie équipe.

---

## 5.1 - La pull request, c'est quoi ?

Une **pull request** (PR) est une **proposition d'intégration** de modifications d'une branche (ou d'un fork) vers une autre. Elle permet de :
- faire **relire** son code avant qu'il soit intégré ;
- **discuter** les changements ;
- **valider** avant la fusion.

C'est le cœur de la collaboration sur GitHub.

---

## 5.2 - Le fork

Un **fork** est ta **copie personnelle** d'un dépôt qui appartient à quelqu'un d'autre. Tu ne peux pas pousser directement sur le dépôt d'autrui, alors :

1. tu **forkes** son dépôt (bouton **Fork** en haut à droite) → tu obtiens ta copie ;
2. tu **clones ton fork** sur ta machine ;
3. tu travailles sur une **branche** ;
4. tu **pousses** sur ton fork ;
5. tu ouvres une **pull request** vers le dépôt d'origine.

```
Dépôt original  ──fork──▶  Ton fork  ──clone──▶  Ta machine
       ▲                                              │
       └──────────── pull request ◀──────push─────────┘
```

---

## 5.3 - Mode A : contribuer au dépôt collectif (recommandé)

Ton formateur (ou toi, voir la notice) met à disposition un **dépôt collectif** : *Le Mur des Apprenants*. Chaque apprenant y ajoute un petit fichier de présentation via une pull request. Tu verras ta contribution apparaître dans le projet commun.

> ℹ️ Le modèle de ce dépôt et sa notice de mise en place se trouvent dans [`../depot-collectif-modele/`](../depot-collectif-modele/README.md).

**Marche à suivre :**

1. **Forke** le dépôt collectif (bouton Fork).
2. **Clone ton fork** :
   ```bash
   git clone https://github.com/ton-pseudo/mur-des-apprenants.git
   cd mur-des-apprenants
   ```
3. **Crée une branche** à ton nom :
   ```bash
   git checkout -b ajout-prenom
   ```
4. **Ajoute ton fichier** dans le dossier `apprenants/`, par exemple `apprenants/sacha.md` (suis le format donné par le fichier exemple).
5. **Commite et pousse sur ton fork** :
   ```bash
   git add apprenants/sacha.md
   git commit -m "Ajoute la fiche de Sacha"
   git push -u origin ajout-prenom
   ```
6. **Ouvre la pull request** : sur ton fork, GitHub propose un bouton **Compare & pull request**. Clique, rédige un titre et une description clairs, puis **Create pull request**.
7. Le formateur (ou un camarade) **relit** ta PR, éventuellement commente, puis **merge**. Ta fiche apparaît dans le dépôt collectif ! 🎉

---

## 5.4 - Mode B : en binôme ou trinôme (si vous êtes plusieurs)

Si vous travaillez à plusieurs en même temps, faites de la vraie relecture croisée sur vos dépôts personnels (ceux du jour 4) :

1. **Échangez les liens** de vos dépôts.
2. Chacun **clone le dépôt de l'autre** et crée une branche.
3. Proposez une **amélioration** (corriger une faute dans le README, ajouter une section...).
4. **Poussez la branche** et ouvrez une **pull request** sur le dépôt du camarade.
5. Le propriétaire **relit**, laisse un **commentaire** dans la PR, demande éventuellement une modification, puis **merge**.

> 💡 Pour autoriser un camarade à pousser une branche sur ton dépôt, ajoute-le comme **collaborateur** (Settings → Collaborators). Sinon, il passe par un fork (comme au mode A).

---

## 5.5 - Relire une pull request

Côté personne qui relit :
- Onglet **Files changed** : tu vois les modifications proposées (vert/rouge).
- Tu peux **commenter une ligne précise** en cliquant sur le `+`.
- **Review changes** → *Approve* (valider), *Comment* (remarque) ou *Request changes* (demander des corrections).
- Une fois satisfait : **Merge pull request**.

> 💡 Une bonne relecture est bienveillante et constructive : on commente le code, pas la personne.

---

## 5.6 - Les issues

Les **issues** servent à suivre les tâches, bugs et idées d'un projet. Sur le dépôt collectif ou le tien :
- ouvre une issue pour signaler quelque chose à améliorer ;
- référence-la dans un commit ou une PR avec `#numéro` (ex : `Corrige le lien cassé, ferme #3`).

---

## Tâches du jour

### Tâche 5.1 - Ma première pull request (Mode A)
Contribue au dépôt collectif *Le Mur des Apprenants* en suivant les 7 étapes du 5.3. Ta PR doit être ouverte (et idéalement mergée).

### Tâche 5.2 - Relire une PR
Relis la pull request d'un·e camarade (ou une PR d'exemple), regarde l'onglet **Files changed** et laisse un commentaire bienveillant.

### Tâche 5.3 - (Mode B, si possible) Collaboration croisée
Avec un·e camarade, proposez chacun une amélioration sur le dépôt de l'autre via une pull request, puis relisez et fusionnez.

### Tâche 5.4 - Une issue
Ouvre une issue sur ton dépôt personnel pour noter une amélioration future, avec un titre clair et une description.

---

## Bilan - Ce que tu sais faire maintenant

En 5 jours, tu es passé·e de zéro à un usage réel de Git & GitHub. Tu maîtrises :

- **Git local** : dépôt, commits, historique, `.gitignore`, revenir en arrière
- **Les branches** : créer, fusionner, résoudre un conflit
- **GitHub** : dépôt distant, `push`/`pull`, README
- **La collaboration** : fork, pull request, relecture, issues

C'est le socle attendu dans toute équipe de développement. Continue à versionner **tous** tes projets : c'est en pratiquant au quotidien que Git devient un réflexe.

## Livrable final

- [ ] J'ai forké un dépôt et ouvert une pull request
- [ ] Ma contribution au dépôt collectif est proposée (ou mergée)
- [ ] J'ai relu et commenté une pull request
- [ ] J'ai ouvert une issue
- [ ] Je comprends le cycle fork → branche → PR → review → merge

🎉 **Félicitations, tu sais collaborer avec Git & GitHub !**
