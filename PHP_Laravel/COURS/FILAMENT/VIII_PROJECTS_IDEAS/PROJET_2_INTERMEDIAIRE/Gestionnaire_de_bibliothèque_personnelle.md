# Gestionnaire de bibliothèque personnelle - niveau intermédiaire (2/3)

Une interface d'administration pour gérer une collection de livres, avec auteurs, emprunts et statistiques.

## Prérequis

* Bases Laravel solides (Eloquent, migrations, relations, Policies)
* Avoir lu les cours Forms, Tables, Actions du cours Filament

---

## Ce que tu vas construire

| Écran                              | Filament utilisé               |
| ---------------------------------- | ------------------------------ |
| Liste des livres avec filtres      | Tables, Filters, Actions       |
| Formulaire ajouter/éditer un livre | Forms, FileUpload, Select      |
| Page de détail d'un livre          | Infolist                       |
| Gestion des auteurs (relation)     | RelationManager                |
| Dashboard avec stats               | Widgets (StatsOverview, Chart) |
| Accès restreint (admin vs user)    | Policies, Auth                 |
| Notifications lors d'un emprunt    | Notifications (toast + DB)     |
| Page custom "Catalogue public"     | Pages custom                   |

---

## Les modèles du projet

Avant de commencer, il faut comprendre ce que représente chaque modèle et comment ils s'articulent entre eux.

```
Author  1──n  Book  1──n  Loan
```

### `Author` — l'auteur d'un livre

Un auteur est une personne qui a écrit un ou plusieurs livres. Il possède :

- un **nom** (obligatoire)
- une **nationalité** (optionnelle)
- une **date de naissance** (optionnelle)
- une **relation** vers ses livres (`hasMany Book`)

### `Book` — un livre de la bibliothèque

Un livre est l'élément central du projet. Il possède :

- un **titre** (obligatoire)
- une **référence à son auteur** (`belongsTo Author`, obligatoire)
- un **ISBN** (identifiant unique international, optionnel)
- une **date de parution** (optionnelle)
- une **image de couverture** (chemin vers le fichier uploadé, optionnel)
- un **statut de disponibilité** : booléen `is_available` — `true` si le livre est en rayon, `false` s'il est actuellement emprunté
- une **relation** vers ses emprunts (`hasMany Loan`)

### `Loan` — un emprunt

Un emprunt trace qu'un livre a été sorti de la bibliothèque par quelqu'un. Il possède :

- une **référence au livre emprunté** (`belongsTo Book`, obligatoire)
- le **nom de l'emprunteur** (texte libre, obligatoire)
- la **date d'emprunt** (obligatoire)
- la **date de retour** (nulle tant que le livre n'est pas rendu)

> Un `Loan` avec `returned_at` à `null` = emprunt en cours. Un `Loan` avec `returned_at` renseigné = livre rendu.

---

## Étapes guidées

### Étape 1 — Setup
> 📄 Correction détaillée : `Correction/01_Setup.md`

Créer le projet Laravel, configurer la base de données SQLite, installer Filament v3 et générer le panel admin. Créer ensuite les trois modèles avec leurs migrations en respectant les champs décrits ci-dessus, leurs relations Eloquent (`hasMany`, `belongsTo`) et les propriétés `$fillable` et `$casts` nécessaires. Lancer les migrations et créer un premier utilisateur admin.

---

### Étape 2 — Resource `Book`
> 📄 Correction détaillée : `Correction/02_Resource_book.md`
>
> 📚 Cours : `I_FORMS/01_INTRODUCTION.md` — `II_TABLES/01_LES_TABLES.md`

Générer la Resource avec la commande artisan dédiée (`--generate --view`). Configurer le **formulaire** avec les bons composants Filament pour chaque champ du modèle : champ texte pour le titre, liste déroulante liée à la relation auteur, upload d'image pour la couverture, sélecteur de date, interrupteur pour la disponibilité. Configurer ensuite la **table** : choisir les colonnes à afficher, activer le tri et la recherche sur les colonnes pertinentes, ajouter un filtre de disponibilité. Vérifier que `getPages()` déclare bien la page de visualisation (`ViewBook`).

---

### Étape 3 — Resource `Author` & RelationManager
> 📄 Correction détaillée : `Correction/03_Resource_author.md`
>
> 📚 Cours : `VII_PANELS/04_REACTIVITE_AVANCEE.md` (section RelationManagers)

Générer la Resource `Author`. Configurer son formulaire (nom, nationalité, date de naissance) et sa table (avec une colonne calculant le nombre de livres via `counts()`). Générer ensuite un **RelationManager** qui s'affichera en bas de la page d'édition d'un auteur pour lister ses livres. Le déclarer dans `getRelations()` de `AuthorResource`.

---

### Étape 4 — Actions
> 📄 Correction détaillée : `Correction/04_Actions.md`
>
> 📚 Cours : `III_ACTIONS/01_LES_ACTIONS.md`

Créer une action personnalisée **"Emprunter"** sur chaque ligne de la table des livres. Elle doit être visible uniquement si le livre est disponible, ouvrir une modale avec un formulaire (nom de l'emprunteur, date), puis créer un `Loan` et passer `is_available` à `false`. Créer l'action inverse **"Retourner"**, visible uniquement si le livre est indisponible, avec une confirmation simple. Personnaliser le message de confirmation du `DeleteAction`.

---

### Étape 5 — Infolist
> 📄 Correction détaillée : `Correction/05_Infolist.md`
>
> 📚 Cours : `V_INFOLIST/01_INFOLIST.md`

Ajouter la méthode `infolist()` dans `BookResource`. Utiliser des `Entry` en lecture seule pour afficher tous les champs du livre : texte pour le titre et l'auteur, image pour la couverture, date formatée pour la parution, badge coloré pour la disponibilité (vert/rouge), valeur calculée pour le nombre d'emprunts. Organiser en sections avec une mise en page en deux colonnes. Ajouter un bouton "Modifier" dans le header de la page `ViewBook`.

---

### Étape 6 — Notifications
> 📄 Correction détaillée : `Correction/06_Notifications.md`
>
> 📚 Cours : `IV_NOTIFICATIONS/01_LES_NOTIFICATIONS.md`

Personnaliser le **toast** de création de livre via `getCreatedNotification()` dans `CreateBook`. Le toast d'emprunt est déjà géré dans l'action de l'étape 4. Activer les **notifications en base de données** : créer la table via artisan, activer `databaseNotifications()` dans le Panel Provider. Lors du retour d'un livre, envoyer une notification persistante aux admins avec un lien vers le livre, visible via la cloche du header.

---

### Étape 7 — Widgets du Dashboard
> 📄 Correction détaillée : `Correction/07_Widgets_du_dashboard.md`
>
> 📚 Cours : `VI_WIDGETS/01_LES_WIDGETS.md`

Générer deux widgets. Un **`StatsOverviewWidget`** avec trois cartes : nombre total de livres, nombre d'auteurs, nombre d'emprunts en cours (avec `whereNull('returned_at')`). Un **`ChartWidget`** de type barre affichant le nombre d'emprunts pour chacun des 12 derniers mois. Contrôler l'ordre d'affichage sur le dashboard via la propriété `$sort`.

---

### Étape 8 — Auth & Policies
> 📄 Correction détaillée : `Correction/08_Auth_&_Policies.md`
>
> 📚 Cours : `VII_PANELS/02_AUTH_&_POLICIES.md`

Ajouter un champ `is_admin` au modèle `User` via une nouvelle migration. Implémenter `canAccessPanel()` sur `User` pour contrôler qui peut accéder au panel. Créer une `BookPolicy` avec les 5 méthodes standards (`viewAny`, `view`, `create`, `update`, `delete`) : tout le monde peut voir, seul l'admin peut créer/modifier/supprimer. Laravel détecte automatiquement la Policy par convention de nommage — aucun enregistrement manuel nécessaire. Tester avec deux comptes (admin et non-admin).

---

### Étape 9 — Page custom "Catalogue"
> 📄 Correction détaillée : `Correction/09_Page_custom.md`
>
> 📚 Cours : `VII_PANELS/03_PAGES_CUSTOM.md` (section "Page avec une table")

Générer une page custom avec la commande artisan dédiée. Implémenter le trait `InteractsWithTable` pour embarquer une table Filament dans la page. Configurer la table avec une query filtrée sur les livres disponibles uniquement, des colonnes en lecture seule (titre, auteur, date de parution, couverture), sans aucune action d'édition ni de suppression. Configurer les propriétés de navigation (icône, label, ordre). Adapter `canAccessPanel()` pour que les utilisateurs non-admin puissent également accéder au panel et voir cette page.
