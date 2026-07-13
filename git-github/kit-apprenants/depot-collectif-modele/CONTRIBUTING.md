# Guide de contribution

Merci de participer au **Mur des Apprenants** ! Ce guide explique comment ajouter ta fiche proprement.

## Règles

1. **Un fichier par personne**, dans le dossier `apprenants/`, nommé `prenom.md` (en minuscules, sans accent ni espace). Exemple : `apprenants/sacha.md`.
2. **Ne modifie que ton fichier.** Ne touche pas à ceux des autres.
3. Passe **toujours par une branche** et une **pull request** (jamais de push direct sur `main`).
4. Rédige un **message de commit clair** : `Ajoute la fiche de <Prénom>`.

## Format de ta fiche

Copie le fichier `apprenants/_exemple.md` et remplis-le. Structure attendue :

```markdown
# Prénom

- **Formation** : (ex : développeur web)
- **Langages en cours d'apprentissage** : HTML, CSS, JavaScript...
- **Un projet dont je suis fier·e** : (une phrase)
- **Une chose sur moi** : (un fait, un hobby...)
```

Reste **sobre et respectueux** : cette page est publique.

## Étapes rapides

```bash
git clone https://github.com/TON-PSEUDO/mur-des-apprenants.git
cd mur-des-apprenants
git checkout -b ajout-prenom
cp apprenants/_exemple.md apprenants/ton-prenom.md
# ... édite ton fichier ...
git add apprenants/ton-prenom.md
git commit -m "Ajoute la fiche de <Prénom>"
git push -u origin ajout-prenom
# puis ouvre la pull request sur GitHub
```

## En cas de conflit

Si Git signale un conflit lors de la mise à jour, pas de panique : ouvre le fichier concerné, garde la bonne version, supprime les marqueurs `<<<<<<<`, `=======`, `>>>>>>>`, puis `git add` + `git commit`. Voir le [jour 03 du kit](../git-github-5j/jour-03.md).
