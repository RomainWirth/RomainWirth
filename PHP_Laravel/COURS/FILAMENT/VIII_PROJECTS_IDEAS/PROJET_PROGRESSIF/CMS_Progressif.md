# CMS Progressif — Blog → CMS → Multi-rôles

## Vue d'ensemble

Ce projet progressif construit un CMS complet en **3 phases de difficulté croissante**.
L'application est la **même tout au long du projet** — on enrichit le code existant à chaque phase sans jamais repartir de zéro.

---

## Architecture des modèles (vue finale Phase 3)

| Modèle | Champs principaux | Relations |
|---|---|---|
| `Category` | name, slug, color | hasMany Articles |
| `Article` | title, slug, excerpt, body (JSON), cover_image, is_published, published_at, category_id | belongsTo Category, belongsToMany Tags |
| `Tag` | name, color | belongsToMany Articles |
| `Media` | name, path, mime_type, alt_text, size | — |
| `Page` | title, slug, content (JSON), seo_title, seo_description, status | — |
| `Menu` | name, location | hasMany MenuItems |
| `MenuItem` | menu_id, label, url, order, parent_id (auto-référentiel) | belongsTo Menu |
| `Post` | title, slug, content (JSON), status, author_id, reviewer_id, published_at | belongsTo User (×2), belongsToMany Tags |
| `Revision` | post_id, user_id, content (JSON snapshot), created_at | belongsTo Post, belongsTo User |

### Rôles Spatie (Phase 3)
- `super-admin` — accès complet au panel `/admin`
- `editor` — crée et édite ses propres posts via `/cms`
- `reviewer` — approuve ou rejette les posts soumis via `/cms`

---

## Phase 1 — Blog simple `1/3`

> **Concepts** : Resources, RichEditor, FileUpload, slug auto-généré, StatsOverviewWidget

### Modèles créés
- `Category` : name, slug, color
- `Article` : title, slug, excerpt, body, cover_image, is_published, published_at, category_id

### Étapes

**Étape 1 — Setup** (`01_Setup.md`)
Installation de Laravel, SQLite, Filament. Création des deux modèles avec migrations et relations Eloquent.

**Étape 2 — Resource Category** (`02_Resource_category.md`)
`ColorPicker` pour la couleur. Génération automatique du slug depuis le name avec `->reactive()` et `->afterStateUpdated()`. `ColorColumn` dans la table. Badge coloré.

**Étape 3 — Resource Article** (`03_Resource_article.md`)
`RichEditor` pour le body. `FileUpload` pour la couverture. Slug auto-généré. `Toggle` + `DateTimePicker` pour la publication différée. `ImageColumn` dans la table. `TernaryFilter` publié/brouillon. `SelectFilter` par catégorie.

**Étape 4 — Widget dashboard** (`04_Widget_dashboard.md`)
`StatsOverviewWidget` : total articles, publiés ce mois, brouillons.

---

## Phase 2 — Pages et blocs `2/3`

> **Concepts** : Block Builder, Repeater réordonnables, RelationManager, Action modal, Infolist + ViewEntry

### Modèles ajoutés
- `Media` : médiathèque centralisée
- `Page` : pages statiques avec contenu en blocs
- `Menu` + `MenuItem` : menus de navigation

### Étapes

**Étape 5 — Resource Media** (`05_Resource_media.md`)
Médiathèque : `FileUpload` avec détection automatique du `mime_type` et du `size`. Table avec `ImageColumn` pour les images, filtre par type. Action "Copier le chemin".

**Étape 6 — Block Builder sur Page** (`06_Block_builder.md`)
Remplacement du champ texte simple par un `Builder` avec 4 blocs : `hero` (titre + sous-titre + fond), `paragraph` (RichEditor), `image` (Select depuis Media + légende), `cta` (texte + URL + couleur bouton). Cast `'content' => 'array'` sur le modèle.

**Étape 7 — Resource Menu** (`07_Resource_menu.md`)
`MenuResource` avec `Repeater` réordonnables (`->reorderable('order')`) pour les `MenuItem`. Champ `parent_id` auto-référentiel. `RelationManager` `MenuItemsRelationManager`.

**Étape 8 — Action Prévisualiser** (`08_Action_preview.md`)
`Action::make('preview')` ouvrant un modal `Infolist` avec un `ViewEntry` rendu Blade. Montre le contenu Block Builder tel qu'il apparaîtra sur le site.

---

## Phase 3 — Multi-rôles et workflow `3/3`

> **Concepts** : Multi-panels, Spatie Permissions, workflow d'Actions, versioning via Observer, Notifications DB, Policy

### Modèles ajoutés
- `Post` : articles avec workflow de publication
- `Revision` : snapshots du contenu à chaque modification

### Étapes

**Étape 9 — Multi-panels** (`09_Multi_panels.md`)
Installation de Spatie Laravel Permission. Panel `/admin` (super-admin) et panel `/cms` (editors + reviewers). `canAccessPanel()` routing par rôle. Seed des rôles et utilisateurs de test.

**Étape 10 — Workflow d'actions** (`10_Workflow_actions.md`)
Sur `PostResource` : `submit_for_review` (editor → passe en `review`), `approve` (reviewer), `reject` (reviewer, modal avec commentaire), `publish` (admin), `archive`. `->visible()` par statut et rôle.

**Étape 11 — Versioning** (`11_Versioning.md`)
`PostObserver` : à chaque `updated`, crée une `Revision` avec le snapshot JSON du contenu. Page custom `PostHistory` avec `InteractsWithTable` affichant l'historique et une `Action::make('restore')`.

**Étape 12 — Notifications et Policies** (`12_Notifications_et_policies.md`)
Notifications DB : l'editor est notifié à l'approbation/rejet, le reviewer à chaque soumission. `PostPolicy` : un editor ne peut modifier que ses propres posts. `databaseNotifications()` dans `CmsPanelProvider`.

---

## Références de cours

| Concept | Fichier de cours |
|---|---|
| Resources / Tables | `II_LES_RESOURCES/` |
| Formulaires | `I_FORMS/01_LES_FORMULAIRES.md` |
| Block Builder | `I_FORMS/02_BLOC_BUILDER.md` |
| Actions | `III_ACTIONS/01_LES_ACTIONS.md` |
| Infolist | `IV_INFOLIST/01_LES_INFOLISTS.md` |
| Notifications | `IV_NOTIFICATIONS/01_LES_NOTIFICATIONS.md` |
| Widgets | `VI_WIDGETS/01_LES_WIDGETS.md` |
| Panels | `VII_PANELS/01_LES_PANELS.md` |
| Pages custom | `VII_PANELS/03_PAGES_CUSTOM.md` |
