# STRUCTS & CUSTOM TYPES — Sommaire

> Structurer et typer la donnée en Go avec les structs, méthodes, constructeurs et types personnalisés.

---

## [B — Les Structs](B_LES_STRUCTS.md)

- Un `struct` regroupe des données connexes en un type personnalisé : `type user struct { ... }`.
- **Instanciation** avec la notation clé/valeur (`appUser := user{ firstName: "John", ... }`) ou positionnelle.
- Valeur nulle d'un struct : `user{}` — chaque champ prend la valeur nulle de son type.
- **Accès aux champs** via la notation pointée : `appUser.firstName`.
- Passage à une fonction par valeur (`u user`) ou par pointeur (`u *user`) — pointeur recommandé pour les grandes structures.
- **Déréférencement automatique** pour les structs : `u.firstName` fonctionne même si `u` est un `*user`.

---

## [C — Ajouter des méthodes et des fonctions aux Structs](C_AJOUTER_DES_METHODES_ET_DES_FONCTIONS_AUX_STRUCTS.md)

- **Méthode** = fonction avec receiver : `func (u user) maMethode() { ... }`.
- Receiver par **valeur** → copie ; receiver par **pointeur** (`*user`) → mutation de l'original.
- **Fonction constructeur** (convention `New()`) : centralise création et validation, retourne `(*User, error)`.
- **Export** : majuscule initiale = accessible hors du package ; minuscule = privé.
- **Struct dans son propre package** : `package user`, import `"example.com/module/user"`, appel `User.New(...)`.
- **Struct embedding** : `type Admin struct { User }` hérite des méthodes de `User` ; champ anonyme = méthodes promues directement.
- **Types custom** : `type str string` pour créer un alias et y attacher des méthodes.
- **Struct tags** : `` `json:"title"` `` formate les clés lors de la sérialisation JSON.

---

## [D — Exercice : Application de sauvegarde de notes en JSON](D_EXERCICE.md)

- Projet complet mobilisant structs, méthodes, constructeur, validation, packages et export.
- Lecture d'entrée complète (avec espaces) via `bufio.NewReader` + `ReadString('\n')`.
- `strings.TrimSuffix` pour nettoyer le retour chariot, `strings.ReplaceAll` + `strings.ToLower` pour le nom de fichier.
- `json.Marshal()` sérialise un struct en JSON ; struct tags (`json:"..."`) contrôlent les noms de clés.
- `os.WriteFile()` persiste le résultat dans un fichier `.json`.
- Gestion des erreurs systématique après chaque opération susceptible d'échouer.
