# LES PACKAGES — Sommaire

> Organisation du code en packages, réutilisabilité et gestion des dépendances en Go.

---

## [B — Séparer le code en plusieurs packages](B_SEPARER_LE_CODE_EN_PLUSIEURS_PACKAGES.md)

- Un programme Go peut s'étaler sur **plusieurs fichiers** appartenant tous au même `package main`.
- Déplacer des fonctions dans un fichier séparé (ex. `communication.go`) ne requiert **aucun import** supplémentaire au sein du même package.
- La déclaration `package main` doit figurer en **tête de chaque fichier** du même package.
- Cette séparation améliore la **lisibilité** et la **maintenabilité** sans changer le comportement.

---

## [C — Pourquoi utiliser plus d'un package ?](C_POURQUOI_UTILISER_PLUS_D_UN_PACKAGE.md)

- Séparer en **packages distincts** (ex. `fileoperations`) favorise la réutilisabilité entre projets.
- Les fonctions d'un package utilitaire doivent être **génériques** : recevoir leurs dépendances en paramètres plutôt que d'utiliser des constantes globales.
- **Convention de visibilité** : `MaFonction` (majuscule initiale) = exportée ; `maFonction` (minuscule) = privée au package.
- Le nom de package est déclaré avec `package <nom>` — tout en minuscules, sans underscores.

---

## [D — Exporter, importer des identifiers & packages tiers](D_EXPORTER_IMPORTER_DES_IDENTIFIERS_ET_UTILISER_DES_THIRD_PARTY_PACKAGES.md)

- **Exporter** un identifiant : commencer son nom par une **majuscule** (`GetBalance`, `WriteToFile`).
- **Importer** un package custom : ajouter son chemin dans le bloc `import` — `"example.com/projet/file-operations"`.
- L'alias d'appel correspond au nom déclaré via `package <nom>` dans le fichier source.
- Les **packages tiers** se trouvent et s'installent via [pkg.go.dev](https://pkg.go.dev/).
- `go get github.com/auteur/repo` installe un package et met à jour `go.mod` / `go.sum`.
- `go mod tidy` nettoie les dépendances inutilisées et ajoute celles manquantes.
- `go.sum` contient les **hashes cryptographiques** des dépendances pour garantir leur intégrité.
