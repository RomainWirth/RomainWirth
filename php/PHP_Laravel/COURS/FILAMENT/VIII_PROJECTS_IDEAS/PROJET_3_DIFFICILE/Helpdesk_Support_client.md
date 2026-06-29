# Helpdesk / Support client — niveau difficile (3/3)

Une plateforme de gestion de tickets de support avec deux interfaces distinctes : un panel admin pour les agents, et un panel client pour soumettre et suivre ses tickets.

## Prérequis

* Maîtrise de Laravel : Eloquent, relations many-to-many, Policies, Events/Listeners
* Avoir terminé un projet Filament niveau 2/3 (les concepts de base sont acquis)
* Avoir lu l'ensemble des cours Filament : Forms, Tables, Actions, Notifications, Widgets, Panels, Infolist
* Notions de base sur Spatie Laravel Permission (rôles et permissions)

---

## Ce que tu vas construire

| Écran                                      | Filament utilisé                              |
| ------------------------------------------ | --------------------------------------------- |
| Panel admin — liste des tickets            | Tables, Filters avancés, BulkActions          |
| Panel admin — détail d'un ticket           | Infolist + RelationManagers imbriqués         |
| Panel admin — rédaction de réponse         | Block Builder                                 |
| Panel admin — actions sur ticket           | Actions custom (assigner, escalader, fermer)  |
| Panel admin — gestion departments & tags   | Resources simples + ManyToMany                |
| Panel admin — dashboard agent              | StatsOverviewWidget + ChartWidget             |
| Panel client (`/app`) — soumettre ticket   | Page custom avec formulaire                   |
| Panel client (`/app`) — suivi des tickets  | Page custom avec table filtrée                |
| Notifications temps réel                   | Notifications DB + Broadcast                  |
| Contrôle d'accès                           | Spatie Permission + Policies + multi-panels   |

---

## Les modèles du projet

Les modèles sont plus nombreux et leurs relations plus complexes que dans les projets précédents.

```
User  1──n  Ticket  1──n  Message  1──n  Attachment
               │
               n──n  Tag
               │
               n──1  Department
               │
               n──1  User (agent assigné)
```

### `Department` — le service responsable

Un département regroupe les tickets par domaine. Il possède :

- un **nom** (ex : Facturation, Technique, Commercial — obligatoire)
- une **description** (optionnelle)
- une **relation** vers ses tickets (`hasMany Ticket`)

### `Tag` — une étiquette multiple

Un tag permet de catégoriser librement un ticket. Relation many-to-many avec `Ticket`. Il possède :

- un **nom** (ex : urgent, bug, feature-request)
- une **couleur** (pour l'affichage en badge)

### `Ticket` — le cœur du système

Un ticket représente une demande d'un client. Il possède :

- un **sujet** (obligatoire)
- une **description initiale** (texte long, obligatoire)
- une **référence au client** (`belongsTo User` — le créateur)
- une **référence à l'agent assigné** (`belongsTo User`, nullable — peut être non assigné)
- une **référence au département** (`belongsTo Department`)
- un **statut** : `open`, `in_progress`, `resolved`, `closed`
- une **priorité** : `low`, `medium`, `high`, `critical`
- une **deadline SLA** : datetime calculée à la création selon la priorité
- une **relation** vers ses messages (`hasMany Message`)
- une **relation** vers ses tags (`belongsToMany Tag`)

> Le statut suit une **machine d'états** : on ne peut pas passer de `open` directement à `closed` sans passer par `resolved`. Cette logique est gérée via les actions Filament et une validation dans le modèle.

### `Message` — une réponse dans un ticket

Un message est une réponse ou mise à jour dans le fil d'un ticket. Il possède :

- une **référence au ticket** (`belongsTo Ticket`, obligatoire)
- une **référence à l'auteur** (`belongsTo User`, obligatoire)
- un **contenu** stocké en JSON : tableau de blocs composés avec le Block Builder
- un booléen **`is_internal`** : `true` si la note est interne (visible uniquement par les agents)
- une **relation** vers ses pièces jointes (`hasMany Attachment`)

### `Attachment` — une pièce jointe

Un fichier attaché à un message. Il possède :

- une **référence au message** (`belongsTo Message`, obligatoire)
- un **chemin** vers le fichier stocké
- un **nom original** du fichier
- un **type MIME**

---

## Étapes guidées

### Étape 1 — Setup + Spatie Permission + Multi-panels
> 📄 Correction détaillée : `Correction/01_Setup.md`

Créer le projet Laravel, configurer SQLite, installer Filament v3. Installer **Spatie Laravel Permission** et créer les rôles : `super-admin`, `agent`, `client`. Générer les deux panels : `admin` (path `/admin`) et `app` (path `/app`), chacun avec son propre `PanelProvider`. Configurer `canAccessPanel()` sur `User` pour router chaque rôle vers le bon panel. Créer un premier super-admin via Tinker.

---

### Étape 2 — Resource `Ticket` (panel admin)
> 📄 Correction détaillée : `Correction/02_Resource_ticket.md`
>
> 📚 Cours : `I_FORMS/01_INTRODUCTION.md` — `II_TABLES/01_LES_TABLES.md` — `V_INFOLIST/01_INFOLIST.md`

Générer la Resource `Ticket` avec `--generate --view`. Configurer le **formulaire** : champ texte pour le sujet, textarea pour la description, Select pour le département (relation), Select pour l'agent assigné (relation filtrée sur le rôle `agent`), Select pour le statut et la priorité (options fixes), DateTimePicker pour la deadline SLA. Configurer la **table** avec badges colorés pour le statut et la priorité, filtres par statut/département/agent/priorité, indicateur visuel si le SLA est dépassé. Configurer l'**Infolist** pour la page de détail.

---

### Étape 3 — Resources `Department` & `Tag`
> 📄 Correction détaillée : `Correction/03_Resource_department_tag.md`
>
> 📚 Cours : `I_FORMS/01_INTRODUCTION.md` — `II_TABLES/01_LES_TABLES.md`

Générer deux Resources simples. Pour `Department` : formulaire (nom, description) et table avec compteur de tickets. Pour `Tag` : formulaire (nom, couleur via `ColorPicker`) et table. Ces Resources n'ont pas de complexité particulière — l'objectif est d'avoir des données de référence disponibles pour les autres étapes. Configurer les tags comme relation many-to-many sur `TicketResource` via un `Select` avec `->multiple()`.

---

### Étape 4 — RelationManagers imbriqués
> 📄 Correction détaillée : `Correction/04_RelationManagers.md`
>
> 📚 Cours : `VII_PANELS/04_REACTIVITE_AVANCEE.md` (section RelationManagers)

Créer un `MessagesRelationManager` dans `TicketResource` : afficher le fil de messages dans la page d'édition d'un ticket, avec indication auteur/date et masquage des notes internes pour les non-agents. Créer un `AttachmentsRelationManager` dans `MessageResource` pour lister les fichiers joints à un message. Déclarer les deux RelationManagers dans `getRelations()` de leurs Resources respectives.

---

### Étape 5 — Block Builder pour les réponses
> 📄 Correction détaillée : `Correction/05_Block_builder.md`
>
> 📚 Cours : `I_FORMS/02_BLOC_BUILDER.md`

Dans le formulaire de création de `Message`, remplacer le champ texte simple par un **Block Builder**. Définir trois types de blocs : `paragraph` (RichEditor libre), `code_block` (TextArea avec sélection du langage), `quote` (TextInput pour la source + TextArea pour le contenu). Ajouter le cast `'content' => 'array'` sur le modèle `Message`. Écrire la vue de rendu Blade pour afficher les blocs dans l'Infolist du ticket.

---

### Étape 6 — Actions avancées
> 📄 Correction détaillée : `Correction/06_Actions_avancees.md`
>
> 📚 Cours : `III_ACTIONS/01_LES_ACTIONS.md`

Créer l'action **"Assigner"** : ouvre une modale avec un Select filtré sur les utilisateurs ayant le rôle `agent`, met à jour `agent_id` et passe le statut à `in_progress`. Créer l'action **"Escalader"** : passe la priorité à `critical` et envoie une notification DB aux super-admins. Créer l'action **"Résoudre"** avec confirmation, visible uniquement si le statut est `in_progress`. Créer une **BulkAction "Fermer en masse"** avec confirmation et formulaire optionnel pour un commentaire de clôture.

---

### Étape 7 — Widgets du Dashboard agent
> 📄 Correction détaillée : `Correction/07_Widgets_dashboard.md`
>
> 📚 Cours : `VI_WIDGETS/01_LES_WIDGETS.md`

Générer trois widgets. Un **`StatsOverviewWidget`** : tickets ouverts, tickets assignés à l'agent connecté (`auth()->id()`), tickets avec SLA dépassé. Un **`ChartWidget`** de type ligne : nombre de tickets créés et résolus par jour sur les 30 derniers jours. Un **`TableWidget`** : les 5 tickets les plus anciens non résolus. Contrôler l'ordre d'affichage et la largeur de chaque widget avec `$sort` et `$columnSpan`.

---

### Étape 8 — Panel client (`/app`)
> 📄 Correction détaillée : `Correction/08_Panel_client.md`
>
> 📚 Cours : `VII_PANELS/01_NAVIGATION_&_PANEL.md` — `VII_PANELS/03_PAGES_CUSTOM.md` — `IV_NOTIFICATIONS/01_LES_NOTIFICATIONS.md`

Configurer le panel `/app` avec son propre `AppPanelProvider` : couleur distincte, navigation réduite, pas de widgets de dashboard. Créer une **page custom "Nouveau ticket"** avec un formulaire (sujet, description, département, priorité) qui crée le `Ticket` en assignant l'utilisateur connecté comme client. Créer une **page custom "Mes tickets"** avec une table filtrée sur `user_id = auth()->id()`, colonnes statut/priorité/sujet/date, bouton "Voir" vers l'Infolist. Activer les **notifications en base de données** dans le panel client : quand un agent répond à un ticket, envoyer une notification DB au client avec lien vers son ticket.
