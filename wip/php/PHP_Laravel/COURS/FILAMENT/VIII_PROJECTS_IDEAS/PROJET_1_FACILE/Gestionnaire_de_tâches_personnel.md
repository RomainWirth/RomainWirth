# Gestionnaire de tâches personnel — niveau débutant (1/3)

Un outil simple pour créer, organiser et suivre ses tâches par catégorie.

## Prérequis

* Bases Laravel (Eloquent, migrations, relations simples)
* Avoir lu le cours d'introduction Filament : `INTRODUCTION.md`

---

## Ce que tu vas construire

| Écran                               | Filament utilisé                        |
| ----------------------------------- | --------------------------------------- |
| Liste des tâches avec filtres       | Tables, Filters                         |
| Formulaire créer/éditer une tâche   | Forms (TextInput, Select, Toggle, Date) |
| Gestion des catégories              | Resource simple                         |
| Dashboard avec stats                | StatsOverviewWidget                     |

---

## Les modèles du projet

Deux modèles simples avec une seule relation entre eux.

```
Category  1──n  Task
```

### `Category` — une catégorie de regroupement

Une catégorie sert à étiqueter et regrouper les tâches par thème. Elle possède :

- un **nom** (ex : Travail, Personnel, Courses — obligatoire)
- une **couleur** (valeur hexadécimale ou nom de couleur, pour l'affichage en badge)
- une **relation** vers ses tâches (`hasMany Task`)

### `Task` — une tâche à réaliser

La tâche est l'élément central du projet. Elle possède :

- un **titre** (obligatoire)
- une **description** (texte long, optionnelle)
- une **référence à sa catégorie** (`belongsTo Category`, optionnelle)
- un **statut** : valeur parmi `pending` (en attente), `in_progress` (en cours), `done` (terminée)
- une **priorité** : valeur parmi `low` (basse), `medium` (moyenne), `high` (haute)
- une **date d'échéance** (optionnelle)
- un booléen `is_completed` — `true` si la tâche est terminée, `false` sinon

> Le statut et la priorité sont des **chaînes à valeurs fixes** (pas de table dédiée). On les stocke directement comme `string` et on définit les options dans le formulaire Filament.

---

## Étapes guidées

### Étape 1 — Setup
> 📄 Correction détaillée : `Correction/01_Setup.md`

Créer le projet Laravel, configurer la base de données SQLite, installer Filament v3 et générer le panel admin. Créer ensuite les deux modèles avec leurs migrations en respectant les champs décrits ci-dessus, la relation Eloquent (`hasMany` / `belongsTo`) et les propriétés `$fillable` et `$casts` nécessaires (le booléen `is_completed` doit être casté). Lancer les migrations et créer un premier utilisateur admin via la commande artisan Filament dédiée.

---

### Étape 2 — Resource `Category`
> 📄 Correction détaillée : `Correction/02_Resource_category.md`
>
> 📚 Cours : `I_FORMS/01_INTRODUCTION.md` — `II_TABLES/01_LES_TABLES.md`

Générer la Resource avec la commande artisan. Configurer le **formulaire** avec deux champs : un champ texte pour le nom et un champ texte pour la couleur. Configurer la **table** avec les deux colonnes, la recherche sur le nom et un tri alphabétique par défaut. Cette Resource est volontairement simple : l'objectif est de se familiariser avec la structure d'une Resource Filament avant d'aborder la Resource principale.

---

### Étape 3 — Resource `Task`
> 📄 Correction détaillée : `Correction/03_Resource_task.md`
>
> 📚 Cours : `I_FORMS/01_INTRODUCTION.md` — `II_TABLES/01_LES_TABLES.md`

Générer la Resource avec `--generate`. Configurer le **formulaire** : champ texte pour le titre, zone de texte longue pour la description, liste déroulante liée à la relation `Category`, liste déroulante avec options fixes pour le statut (`pending`, `in_progress`, `done`), liste déroulante avec options fixes pour la priorité (`low`, `medium`, `high`), sélecteur de date pour l'échéance, interrupteur pour `is_completed`. Configurer la **table** : afficher le titre, la catégorie en badge coloré, le statut en badge avec couleurs distinctes (warning/primary/success), la priorité, la date d'échéance. Ajouter des filtres par statut et par catégorie. Activer le tri par date d'échéance et par priorité.

---

### Étape 4 — Widget Dashboard
> 📄 Correction détaillée : `Correction/04_Widget_dashboard.md`
>
> 📚 Cours : `VI_WIDGETS/01_LES_WIDGETS.md`

Générer un `StatsOverviewWidget`. Le configurer avec trois cartes : le nombre total de tâches, le nombre de tâches en cours (statut `in_progress`), le nombre de tâches complétées (statut `done` ou `is_completed` à `true`). Contrôler l'ordre d'affichage sur le dashboard via la propriété `$sort`.
