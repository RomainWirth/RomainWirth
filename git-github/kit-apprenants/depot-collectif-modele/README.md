# Le Mur des Apprenants 🧱

Bienvenue sur **Le Mur des Apprenants** ! Ce dépôt sert à s'entraîner à la **collaboration Git & GitHub**. Chaque apprenant y ajoute une petite fiche de présentation via une **pull request**.

C'est un exercice à faible enjeu pour pratiquer le cycle complet : `fork → branche → commit → push → pull request → review → merge`.

---

## 📋 Ce dossier est un MODÈLE

Les fichiers de ce dossier (`depot-collectif-modele/`) sont un **point de départ à recopier** dans un vrai dépôt GitHub. Ils ne fonctionnent pas « tels quels » dans le kit : ils servent à **créer** le dépôt collectif.

- Côté **apprenant** : voir [le jour 05 du kit](../git-github-5j/jour-05.md) et le fichier [CONTRIBUTING.md](./CONTRIBUTING.md).
- Côté **formateur** : voir la section « Mise en place » ci-dessous.

---

## Comment contribuer (côté apprenant)

1. **Forke** ce dépôt (bouton **Fork** en haut à droite).
2. **Clone ton fork** sur ta machine :
   ```bash
   git clone https://github.com/TON-PSEUDO/mur-des-apprenants.git
   cd mur-des-apprenants
   ```
3. **Crée une branche** à ton nom :
   ```bash
   git checkout -b ajout-prenom
   ```
4. **Copie le fichier exemple** et remplis-le avec tes infos :
   ```bash
   cp apprenants/_exemple.md apprenants/ton-prenom.md
   ```
   Édite `apprenants/ton-prenom.md` (voir le format dans [CONTRIBUTING.md](./CONTRIBUTING.md)).
5. **Commite et pousse** :
   ```bash
   git add apprenants/ton-prenom.md
   git commit -m "Ajoute la fiche de <Prénom>"
   git push -u origin ajout-prenom
   ```
6. **Ouvre une pull request** vers ce dépôt (bouton **Compare & pull request**).
7. Attends la **relecture** et la fusion. Ta fiche rejoint le mur ! 🎉

> ⚠️ Ne modifie que **ton** fichier dans `apprenants/`. Ne touche pas aux fichiers des autres : c'est la règle pour éviter les conflits.

---

## 🧑‍🏫 Mise en place (côté formateur)

Pour créer le dépôt collectif à partir de ce modèle :

1. Crée un **nouveau dépôt public** sur GitHub, par exemple `mur-des-apprenants`.
2. Copies-y les fichiers de ce dossier modèle : ce `README.md`, `CONTRIBUTING.md`, et le dossier `apprenants/` avec `_exemple.md`.
3. Pousse le tout sur la branche `main`.
4. Partage le lien du dépôt aux apprenants et demande-leur de suivre la section « Comment contribuer ».
5. **Relis et merge** les pull requests au fur et à mesure (onglet *Pull requests* → *Files changed* → *Merge*).

**Conseils :**
- Active la protection de la branche `main` (Settings → Branches) pour forcer le passage par PR si tu veux.
- Encourage les apprenants à se **relire entre eux** avant que tu merges (relecture croisée).
- Pour provoquer un **conflit pédagogique**, demande à deux apprenants de modifier volontairement la même ligne d'un fichier commun (ex : une liste dans ce README).

---

## Les apprenants

<!-- Les fiches ajoutées apparaîtront dans le dossier apprenants/ -->

La liste des participant·es se construit dans le dossier [`apprenants/`](./apprenants/) au fil des pull requests.
