# Feuille de route - Projet 3 Gamebook Heroic Fantasy
**De zéro à un jeu jouable en ligne**
Go (Fiber) + Next.js | PostgreSQL | Clerk | Cloudflare R2 | Fal.ai

---

## Vue d'ensemble

```
PHASE 0          PHASE 1          PHASE 2          PHASE 3
Préparation  →   Backend Go   →   Microservice →   Frontend
(infra + bible)  (core)           (génération)     (Next.js)

    │                │                │                │
  ~3 jours        ~2 semaines      ~1 semaine       ~2 semaines

PHASE 4          PHASE 5          PHASE 6
Authoring    →   Contenu V1   →   Portfolio
tool             (scènes+images)  (démo)

    │                │                │
  ~1 semaine      ~2 semaines      ~3 jours

                              Total estimé : ~8-9 semaines
```

---

## Phase 0 - Préparation et infrastructure

> **Objectif** : tous les comptes créés, tous les services configurés, la bible du jeu rédigée.
> Ne pas commencer à coder avant que cette phase soit complète.
> **Durée estimée** : 3 jours

---

### Étape 0.1 - Création des comptes et services

**Comptes à créer (tous gratuits)**

- [ ] **Supabase** - https://supabase.com
  - Créer un projet `dnd-gamebook`
  - Région : West EU (Frankfurt) - la plus proche
  - Noter : `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

- [ ] **Clerk** - https://clerk.com
  - Créer une application `Gamebook`
  - Activer : Email + Password (méthode de connexion)
  - Noter : `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
  - Configurer les URLs de redirection (localhost pour dev, Vercel pour prod)

- [ ] **Cloudflare** - https://cloudflare.com
  - Créer un compte (gratuit)
  - Activer R2 (onglet R2 dans le dashboard)
  - Créer un bucket `gamebook-images`
  - Activer l'accès public sur le bucket
  - Créer une API Token R2 avec droits lecture/écriture
  - Noter : `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`

- [ ] **Fal.ai** - https://fal.ai
  - Créer un compte
  - Générer une clé API
  - Tester une génération depuis le playground (vérifier que ça fonctionne)
  - Noter : `FAL_KEY`

- [ ] **Fly.io** - https://fly.io
  - Créer un compte
  - Installer la CLI : `curl -L https://fly.io/install.sh | sh`
  - Se connecter : `flyctl auth login`
  - Vérifier : `flyctl version`

- [ ] **Vercel** - https://vercel.com
  - Créer un compte (connexion via GitHub recommandée)
  - Installer la CLI : `npm i -g vercel`

---

### Étape 0.2 - Setup des repositories GitHub

- [ ] Créer le repository `gamebook-backend` (Go)
  ```
  .
  ├── cmd/
  │   ├── server/       ← Backend principal
  │   └── generator/    ← Microservice génération
  ├── internal/
  ├── go.mod
  ├── go.sum
  ├── Dockerfile.server
  ├── Dockerfile.generator
  └── fly.server.toml
  └── fly.generator.toml
  ```

- [ ] Créer le repository `gamebook-frontend` (Next.js)
  ```
  .
  ├── app/
  ├── components/
  ├── public/
  ├── package.json
  └── .env.local
  ```

- [ ] Configurer les `.gitignore` corrects (ne jamais commiter les `.env`)
- [ ] Créer les fichiers `.env.example` avec les clés vides documentées
- [ ] Premier commit sur chaque repo : "Initial project structure"

---

### Étape 0.3 - Base de données

- [ ] Se connecter à Supabase → SQL Editor
- [ ] Exécuter le schéma SQL complet (depuis les specs)
- [ ] Vérifier que toutes les tables sont créées
- [ ] Créer les indexes
- [ ] Insérer les données de base :
  ```sql
  -- Disciplines de base
  INSERT INTO disciplines (id, nom, archétypes, description) VALUES ...

  -- Bestiaire V1
  INSERT INTO ennemis (nom, endurance, habilete, des_degats, experience) VALUES
    ('Garde corrompu', 16, 8, '1d6+1', 20),
    ('Loup des brumes', 12, 10, '1d6+2', 25),
    ...
  ```
- [ ] Tester la connexion depuis Go : `psql $DATABASE_URL`

---

### Étape 0.4 - Bible du jeu

Avant d'écrire une ligne de code, rédiger les documents narratifs de base.

- [ ] **Fiche de l'univers Valdran** (1-2 pages)
  - Les 5 factions et leurs relations
  - Les 4 lieux de la campagne V1
  - Le ton et l'ambiance (3 adjectifs qui définissent le jeu)
  - Ce que le joueur ressent à chaque acte

- [ ] **Outline de la campagne V1 - "Les Cendres de Brumeval"**
  - Liste des 20-30 scènes avec titre et résumé en 1 phrase
  - Le graphe narratif à la main (papier ou draw.io)
  - Identifier les scènes de combat, d'épreuve, de repos
  - Identifier les 2-3 embranchements majeurs

- [ ] **Fiches des 3 archétypes**
  - Description narrative de chaque archétype (qui est ce héros ?)
  - Disciplines disponibles par archétype
  - Style de jeu recommandé

- [ ] **Prompt maître visuel**
  - Finaliser le prompt de style BD (voir specs)
  - Tester sur Leonardo.ai (gratuit) pour valider le style
  - Ajuster jusqu'à satisfaction avant de générer les vraies images

> 💡 Le travail narratif en Phase 0 fait gagner un temps considérable en Phase 5.
> Écrire les scènes sans outline préalable mène à des incohérences difficiles à corriger.

---

## Phase 1 - Backend Go (monolithe modulaire)

> **Objectif** : une API Go complète et testée, sans frontend.
> Tout tester via Postman ou `curl` pendant cette phase.
> **Durée estimée** : 2 semaines

---

### Étape 1.1 - Setup Go + Fiber

- [ ] Initialiser le module Go :
  ```bash
  go mod init github.com/ton-username/gamebook-backend
  ```
- [ ] Installer les dépendances principales :
  ```bash
  go get github.com/gofiber/fiber/v2
  go get github.com/jackc/pgx/v5
  go get github.com/joho/godotenv
  go get github.com/gofiber/fiber/v2/middleware/cors
  go get github.com/gofiber/fiber/v2/middleware/logger
  go get github.com/gofiber/fiber/v2/middleware/recover
  ```
- [ ] Créer `cmd/server/main.go` avec un Hello World Fiber
- [ ] Vérifier que le serveur démarre sur le port 8080
- [ ] Configurer CORS pour `localhost:3000` (dev) et le domaine Vercel (prod)

### Étape 1.2 - Connexion PostgreSQL

- [ ] Créer `internal/repository/db.go`
  - Pool de connexions avec `pgxpool`
  - Fonction `NewDB(databaseURL string) (*pgxpool.Pool, error)`
  - Vérification de la connexion au démarrage (`db.Ping()`)
- [ ] Tester : connexion réussie au démarrage → log "Database connected"
- [ ] Vérifier que la connexion se ferme proprement à l'arrêt du serveur

### Étape 1.3 - Middleware authentification Clerk

- [ ] Installer : `go get github.com/clerk/clerk-sdk-go/v2`
- [ ] Créer `internal/auth/middleware.go`
  - Extraire le Bearer token du header `Authorization`
  - Valider le JWT avec la clé publique Clerk
  - Stocker le `userId` dans le contexte Fiber
  - Retourner 401 si token absent ou invalide
- [ ] Créer `internal/auth/claims.go`
  - Fonction `GetUserID(c *fiber.Ctx) string`
- [ ] Tester :
  - Requête sans token → 401
  - Requête avec token valide → 200 avec userId dans le contexte
  - Requête avec token expiré → 401

### Étape 1.4 - Webhook Clerk

- [ ] Route `POST /api/auth/webhook` (non protégée par le middleware)
- [ ] Vérifier la signature du webhook (header `svix-signature`)
- [ ] Event `user.created` → créer l'entrée dans la table `users`
- [ ] Configurer le webhook dans le dashboard Clerk (URL ngrok pour le dev)
- [ ] Tester : créer un compte → vérifier l'entrée en BDD

### Étape 1.5 - Module character

- [ ] `internal/character/repository.go`
  - `CreateCharacter(ctx, character) error`
  - `GetCharacterByID(ctx, id, userID) (*Character, error)`
  - `GetCharactersByUserID(ctx, userID) ([]*Character, error)`
  - `UpdateCharacter(ctx, character) error`
  - `DeleteCharacter(ctx, id, userID) error`
- [ ] `internal/character/service.go`
  - `CreateCharacter(userID string, req CreateCharacterRequest) (*Character, error)`
  - Valider l'archétype (guerrier, mage, rodeur uniquement)
  - Valider les disciplines (3 choisies, compatibles avec l'archétype)
  - Calculer l'endurance max selon l'archétype
  - `GetCharacter(userID, characterID string) (*Character, error)`
- [ ] `internal/character/handler.go`
  - `POST /api/characters`
  - `GET /api/characters`
  - `GET /api/characters/:id`
  - `DELETE /api/characters/:id`
- [ ] Tests unitaires sur le service :
  - Archétype invalide → erreur
  - Disciplines incompatibles → erreur
  - Création valide → personnage avec stats correctes

### Étape 1.6 - Module combat (cœur du jeu)

- [ ] `internal/combat/dice.go`
  - `DiceRoller` avec tous les dés (D4 à D20)
  - `RollMultiple(count, faces int) []int`
  - `ParseDiceExpression(expr string) int` - parse "2d6+3"
- [ ] `internal/combat/resolver.go`
  - `ResolveRound(attaquant, defenseur *Combattant, option OptionCombat) RoundResult`
  - `ResolveFlee(personnage *Combattant) FleeResult`
  - `ApplyDisciplineBonus(personnage *Combattant, phase CombatPhase) int`
- [ ] `internal/combat/service.go`
  - `StartCombat(gameID, ennemiID string) (*CombatState, error)`
  - `PlayRound(gameID string, option OptionCombat) (*RoundResult, error)`
  - `Flee(gameID string) (*FleeResult, error)`
- [ ] `internal/combat/handler.go`
  - `POST /api/games/:id/combat/start`
  - `POST /api/games/:id/combat/round`
  - `POST /api/games/:id/combat/flee`
- [ ] Tests unitaires exhaustifs :
  - Attaque > défense → touché, dégâts calculés
  - Attaque ≤ défense → esquive
  - Fuite réussie → dégâts 1d6
  - Fuite échouée → round de combat normal
  - Bonus discipline Maîtrise des armes → +2 attaque
  - Réduction dégâts Bouclier de volonté → -2 dégâts
  - Ennemi à 0 PV → statut mort
  - Joueur à 0 PV → statut game over

### Étape 1.7 - Module narrative

- [ ] `internal/narrative/repository.go`
  - `GetSceneByID(ctx, id) (*Scene, error)`
  - `GetSceneWithChoices(ctx, id) (*SceneWithChoices, error)`
  - `GetCampaignByID(ctx, id) (*Campaign, error)`
  - `GetPublishedCampaigns(ctx) ([]*Campaign, error)`
- [ ] `internal/narrative/graph.go`
  - `IsChoiceAvailable(choice Choice, character Character) bool`
  - Vérifier les conditions : discipline requise, item requis, stat requise
- [ ] `internal/narrative/service.go`
  - `GetScene(sceneID string, character Character) (*SceneResponse, error)`
  - Filtrer les choix selon les conditions du personnage
  - `GetAvailableCampaigns() ([]*Campaign, error)`
- [ ] `internal/narrative/handler.go`
  - `GET /api/campaigns` (public)
  - `GET /api/campaigns/:id` (public)
  - `GET /api/scenes/:id` (protégé)

### Étape 1.8 - Module game (orchestrateur)

- [ ] `internal/game/repository.go`
  - `CreateGame(ctx, game) error`
  - `GetGameByID(ctx, id, userID) (*Game, error)`
  - `UpdateGameScene(ctx, gameID, sceneID string) error`
  - `UpdateGameStatus(ctx, gameID, status string) error`
  - `GetActiveGameByCharacter(ctx, characterID string) (*Game, error)`
- [ ] `internal/game/service.go`
  - `StartGame(userID, characterID, campaignID string) (*Game, error)`
  - `MakeChoice(userID, gameID string, choiceID string) (*SceneResponse, error)`
    - Vérifier que le choix est valide pour ce personnage
    - Mettre à jour la scène courante
    - Enregistrer dans `game_logs`
    - Si la scène cible est un combat → déclencher le module combat
    - Si la scène est de type "fin" → mettre à jour le statut de la partie
  - `Rest(userID, gameID string) (*RestResult, error)`
    - Vérifier qu'un repas est disponible
    - Calculer les PV récupérés (1d6+2)
    - Décrémenter les repas
  - `AbandonGame(userID, gameID string) error`
- [ ] `internal/game/handler.go`
  - `POST /api/games`
  - `GET /api/games/:id`
  - `POST /api/games/:id/choice`
  - `POST /api/games/:id/rest`
  - `DELETE /api/games/:id`

### Étape 1.9 - Module inventory

- [ ] `internal/inventory/service.go`
  - `GetInventory(characterID string) (*Inventory, error)`
  - `UseItem(characterID, itemID string) (*UseResult, error)`
  - `EquipItem(characterID, itemID string) error`
  - `AddItem(characterID string, item Item) error`
- [ ] `internal/inventory/handler.go`
  - `GET /api/games/:id/inventory`
  - `POST /api/games/:id/inventory/use`
  - `POST /api/games/:id/inventory/equip`

### Étape 1.10 - Tests d'intégration

- [ ] Tester le flux complet via Postman / `curl` :
  1. Créer un compte (Clerk)
  2. Créer un personnage Guerrier
  3. Démarrer une partie
  4. Naviguer entre 3 scènes
  5. Déclencher et gagner un combat
  6. Récupérer l'inventaire
- [ ] Vérifier les logs en base (`game_logs`)
- [ ] Vérifier que les PV sont correctement mis à jour

---

## Phase 2 - Microservice génération d'images

> **Objectif** : un service capable de générer une image BD depuis une description
> et de la stocker sur Cloudflare R2.
> **Durée estimée** : 1 semaine

---

### Étape 2.1 - Setup du microservice

- [ ] Créer `cmd/generator/main.go` dans le même repository Go
- [ ] Installer : `go get github.com/fal-ai/fal-go`
- [ ] Installer le SDK AWS S3 pour R2 :
  ```bash
  go get github.com/aws/aws-sdk-go-v2/service/s3
  go get github.com/aws/aws-sdk-go-v2/config
  ```
- [ ] Démarrer sur le port 8081 (différent du backend principal)

### Étape 2.2 - Client Fal.ai

- [ ] `internal/generator/falai.go`
  - `FalAIClient` avec clé API depuis les variables d'environnement
  - `Generate(prompt string) ([]byte, error)`
  - Modèle : `fal-ai/flux/dev` (meilleure qualité du plan gratuit)
  - Paramètres : format 16:9, 1 image, output JPEG
  - Gestion des erreurs et retry (1 retry sur timeout)
- [ ] Tester en standalone : envoyer un prompt → recevoir une image

### Étape 2.3 - Upload Cloudflare R2

- [ ] `internal/storage/r2.go`
  - `R2Storage` avec endpoint Cloudflare R2 (compatible S3)
  - `UploadImage(campaignID, sceneID string, data []byte) (string, error)`
  - Retourner l'URL publique CDN
  - Gestion des erreurs d'upload
- [ ] Tester : uploader une image → vérifier qu'elle est accessible depuis l'URL publique

### Étape 2.4 - Construction des prompts

- [ ] `internal/generator/prompt.go`
  - Constante `PromptMaitre` (le style BD figé)
  - Constante `FicheHeros` par archétype
  - `BuildPrompt(scene SceneDescription) string`
  - Combiner : Prompt Maître + Fiche Lieu + Description Scène
- [ ] Tester 5 prompts différents pour valider la cohérence visuelle
- [ ] Ajuster le prompt maître si nécessaire avant de continuer

### Étape 2.5 - Route de génération

- [ ] `internal/generator/handler.go`
  - `POST /generate` - protégée par clé API interne (`X-Internal-Key`)
  - Corps de la requête :
    ```json
    {
      "campaign_id": "uuid",
      "scene_id": "uuid",
      "description": "...",
      "lieu": "...",
      "personnages": "...",
      "ambiance": "..."
    }
    ```
  - Réponse : `{ "image_url": "https://..." }`
  - Rate limiting : 1 requête / 15 secondes

### Étape 2.6 - Mise à jour de la scène en BDD

- [ ] Après génération réussie : appeler le backend principal pour mettre à jour `image_url` de la scène
- [ ] Route dédiée dans le backend principal :
  `PATCH /internal/scenes/:id/image` (protégée par clé interne)
- [ ] Tester le flux complet :
  1. Appel POST /generate avec description
  2. Image générée et uploadée sur R2
  3. URL mise à jour dans la BDD
  4. Scène récupérable avec l'URL publique

---

## Phase 3 - Frontend Next.js

> **Objectif** : une interface jouable connectée au backend.
> **Durée estimée** : 2 semaines

---

### Étape 3.1 - Setup Next.js

- [ ] Initialiser le projet :
  ```bash
  npx create-next-app@latest gamebook-frontend \
    --typescript --tailwind --app --src-dir
  ```
- [ ] Installer les dépendances :
  ```bash
  npm install @clerk/nextjs framer-motion zustand
  npm install @tanstack/react-query axios
  ```
- [ ] Configurer Clerk dans `app/layout.tsx`
- [ ] Configurer le thème Tailwind (couleurs customs de la palette - voir specs)
- [ ] Charger les polices Google Fonts : Cinzel (titres) + Lora (texte)
- [ ] Vérifier : la page d'accueil s'affiche avec le bon thème

### Étape 3.2 - Authentification

- [ ] Pages Clerk :
  - `app/sign-in/[[...sign-in]]/page.tsx`
  - `app/sign-up/[[...sign-up]]/page.tsx`
- [ ] Middleware de protection des routes (`middleware.ts`)
  - Routes publiques : `/`, `/sign-in`, `/sign-up`, `/api/auth/webhook`
  - Routes protégées : tout le reste
- [ ] Configurer les redirections après connexion/inscription → `/dashboard`
- [ ] Tester : accès à `/dashboard` sans connexion → redirection `/sign-in`

### Étape 3.3 - Client API

- [ ] Créer `lib/api.ts`
  - Instance Axios avec `baseURL` depuis les variables d'environnement
  - Intercepteur : injecter automatiquement le JWT Clerk dans chaque requête
  - Intercepteur d'erreur : redirection vers `/sign-in` si 401
- [ ] Créer les hooks React Query pour chaque endpoint :
  - `useCharacters()`, `useCharacter(id)`
  - `useGame(id)`, `useScene(id)`
  - `useCombatRound()`
  - `useInventory(characterId)`

### Étape 3.4 - Page landing

- [ ] Design immersif avec ambiance Heroic Fantasy
- [ ] Titre animé (Framer Motion)
- [ ] Description du jeu en 3 lignes
- [ ] Boutons : "Commencer l'aventure" → inscription / "Se connecter"
- [ ] Image de fond ou illustration d'ambiance (pré-générée)

### Étape 3.5 - Dashboard joueur

- [ ] Liste des héros du joueur (cartes cliquables)
- [ ] Bouton "Créer un nouveau héros"
- [ ] Pour chaque héros : nom, archétype, niveau, statut de la partie en cours
- [ ] Bouton "Continuer l'aventure" si partie en cours
- [ ] État vide : message d'accueil + bouton de création

### Étape 3.6 - Création de héros (wizard 4 étapes)

- [ ] **Étape 1 - Choisir l'archétype**
  - 3 cartes avec illustration, nom, stats, description du style de jeu
  - Animation au survol (Framer Motion)
  - Sélection visuelle claire

- [ ] **Étape 2 - Choisir les disciplines**
  - Liste filtrée selon l'archétype choisi
  - Sélectionner exactement 3 disciplines
  - Afficher description et effet de chaque discipline
  - Compteur "X/3 disciplines choisies"

- [ ] **Étape 3 - Nommer le héros**
  - Champ de saisie avec validation (2-30 caractères)
  - Aperçu de la fiche complète en temps réel

- [ ] **Étape 4 - Résumé et confirmation**
  - Fiche complète : nom, archétype, stats, disciplines, équipement de départ
  - Bouton "Commencer l'aventure"
  - Appel API `POST /api/characters`
  - Redirection vers le choix de campagne

### Étape 3.7 - Écran de jeu principal

- [ ] Layout en deux colonnes (image + texte/choix à gauche, stats à droite)
- [ ] **Image de scène** : chargement progressif avec skeleton loader
- [ ] **Texte narratif** : apparition progressive mot par mot (typewriter effect - Framer Motion)
- [ ] **Boutons de choix** : apparaître après la fin du typewriter effect
  - Style parchemin avec bordure dorée
  - Hover effect avec lueur
  - Désactivés pendant le chargement
- [ ] **Panneau de stats** (colonne droite)
  - Barre d'endurance animée (couleur change si < 30%)
  - Habileté, Or, Repas
  - Liste des disciplines avec niveau
- [ ] **Indicateur de chargement** entre les scènes (sablier ou rune qui tourne)

### Étape 3.8 - Écran de combat

- [ ] Overlay plein écran au-dessus de la scène (fond semi-transparent)
- [ ] **En-tête** : nom de l'ennemi + ambiance combat
- [ ] **Barres de vie** : joueur (gauche) et ennemi (droite)
  - Animation de diminution des PV (transition fluide)
  - Couleur rouge si < 30%
- [ ] **Zone de log** : log scrollable des rounds
  - Affichage animé des jets de dés (chiffres qui défilent avant de s'arrêter)
  - Résultat coloré : vert = touché, rouge = raté, or = critique
- [ ] **Boutons d'action** :
  - Attaquer (par défaut)
  - Attaque puissante (si discipline niveau 2+)
  - Défense totale
  - Utiliser une potion (si disponible)
  - Fuir
- [ ] **Animation des dés** :
  - Au clic "Attaquer" → dé qui tourne 500ms avant d'afficher le résultat
  - Résultat affiché → pause 300ms → log mis à jour → round ennemi

### Étape 3.9 - Inventaire

- [ ] Modale ou page dédiée
- [ ] Grille 8 slots avec icônes d'items
- [ ] Slot d'arme et slot d'armure équipés séparément
- [ ] Tooltip au survol : stats de l'item
- [ ] Bouton "Utiliser" sur les potions
- [ ] Bouton "Équiper" sur les armes et armures

---

## Phase 4 - Outil d'authoring

> **Objectif** : une interface admin pour créer et gérer tout le contenu du jeu.
> **Durée estimée** : 1 semaine

---

### Étape 4.1 - Protection admin

- [ ] Marquer le compte admin dans Clerk (metadata `role: admin`)
- [ ] Créer `lib/requireAdmin.ts` - vérification du rôle côté serveur
- [ ] Protéger toutes les routes `/admin/*`
- [ ] Redirection vers `/` si tentative d'accès sans rôle admin

### Étape 4.2 - Gestion des campagnes

- [ ] Liste des campagnes avec statut (brouillon / publiée / archivée)
- [ ] Créer une campagne : titre + description + scène de départ
- [ ] Modifier / archiver une campagne
- [ ] Compteurs : nombre de scènes, scènes illustrées, scènes publiées

### Étape 4.3 - Éditeur de scènes

- [ ] Liste des scènes d'une campagne avec statut visuel
- [ ] **Formulaire de création/édition** :
  - Titre de la scène
  - Type (narrative / combat / épreuve / repos / fin)
  - Éditeur rich text pour le texte narratif
  - Sélection de l'ennemi (si type = combat)
  - Champs de description visuelle :
    - Description générale de la scène
    - Lieu
    - Personnages présents
    - Ambiance
    - Éléments visuels importants
- [ ] **Bouton "Générer l'illustration"**
  - Appel au microservice via le backend
  - État de chargement : spinner + message "Génération en cours... (10-30s)"
  - Aperçu de l'image générée
  - Boutons : "Valider" / "Régénérer" (max 3 tentatives)
  - Compteur de tentatives restantes
- [ ] **Gestion des choix** :
  - Ajouter / supprimer des choix
  - Texte du choix
  - Scène cible (dropdown des scènes existantes)
  - Condition optionnelle (type + valeur)

### Étape 4.4 - Visualiseur du graphe narratif

- [ ] Affichage en graphe des scènes et connexions
- [ ] Code couleur par type de scène
- [ ] Code couleur par statut (brouillon / illustrée / publiée)
- [ ] Clic sur un nœud → ouvrir l'éditeur de cette scène
- [ ] Identifier visuellement les impasses (scènes sans choix sortants)
- [ ] Identifier les scènes sans illustration

> 💡 Utiliser une librairie de graphe légère comme `react-flow` (gratuit, MIT license)
> pour le visualiseur. Pas besoin de coder le layout de graphe from scratch.

### Étape 4.5 - Gestion du bestiaire

- [ ] Liste des ennemis avec leurs stats
- [ ] Créer / modifier / supprimer un ennemi
- [ ] Aperçu des stats de combat (DPS estimé, survie estimée)

---

## Phase 5 - Contenu V1

> **Objectif** : écrire et illustrer la campagne complète "Les Cendres de Brumeval".
> C'est la phase la plus créative - alterner écriture et génération.
> **Durée estimée** : 2 semaines

---

### Étape 5.1 - Écriture des scènes

Ordre recommandé pour l'écriture :

- [ ] **Acte 1 - Brumeval** (6-8 scènes)
  - Scène d'introduction (arrivée en ville, ambiance tendue)
  - Scène de tutorial combat (ennemi faible, guidé)
  - 2-3 scènes d'enquête avec embranchements
  - Première révélation sur l'Ombre Rampante

- [ ] **Acte 2 - La Forêt des Murmures** (6-8 scènes)
  - Traversée de la forêt (épreuves de survie pour le Rôdeur)
  - Rencontre avec un allié potentiel
  - Combat de mi-parcours
  - Découverte des Ruines d'Ashenfall

- [ ] **Acte 3 - Les Ruines d'Ashenfall** (6-8 scènes)
  - Exploration des ruines
  - Révélation sur le passé de Valdran
  - Combat avec le Chevalier de l'Ombre (boss intermédiaire)
  - Chemin vers le Col de Pierre Noire

- [ ] **Acte 4 - Le Col de Pierre Noire** (4-6 scènes)
  - Approche du boss final
  - Choix crucial selon les disciplines acquises
  - Combat final contre Le Façonneur Corrompu
  - Scène de dénouement (victoire ou défaite honorable)

> ⚠️ **Règles d'écriture à respecter** :
> - 300-500 mots par scène (ni trop court ni trop long)
> - Toujours à la deuxième personne ("Vous...")
> - Chaque scène se termine sur une tension ou un choix
> - Mentionner les disciplines quand elles s'appliquent
> - Garder la cohérence des lieux et personnages (relire depuis le début régulièrement)

### Étape 5.2 - Génération des illustrations

Pour chaque scène, via l'authoring tool :

- [ ] Remplir les champs de description visuelle
- [ ] Générer l'illustration
- [ ] Valider ou régénérer (max 3 tentatives)
- [ ] Vérifier la cohérence avec les scènes précédentes

> **Ordre recommandé** : illustrer acte par acte, pas scène par scène isolément.
> Générer toutes les scènes d'un même lieu à la suite pour maximiser la cohérence visuelle.

### Étape 5.3 - Playtest complet

- [ ] Jouer la campagne complète en Guerrier
- [ ] Jouer la campagne complète en Mage
- [ ] Jouer la campagne complète en Rôdeur
- [ ] Vérifier tous les embranchements (au moins 1 chemin alternatif testé)
- [ ] Vérifier l'équilibrage du combat :
  - Le joueur peut gagner sans être optimal
  - La mort est possible si le joueur fait de mauvais choix
  - Le boss final est difficile mais faisable
- [ ] Liste des bugs et incohérences à corriger
- [ ] Corrections et re-test

---

## Phase 6 - Portfolio et déploiement

> **Objectif** : déployer le projet, le rendre partageable, le documenter.
> **Durée estimée** : 3 jours

---

### Étape 6.1 - Déploiement backend (Fly.io)

- [ ] Créer `Dockerfile.server` optimisé (multi-stage build)
- [ ] Créer `fly.server.toml`
- [ ] Déployer : `flyctl launch --config fly.server.toml`
- [ ] Configurer les variables d'environnement : `flyctl secrets set DATABASE_URL=...`
- [ ] Tester l'API en production via Postman
- [ ] Créer `Dockerfile.generator` pour le microservice
- [ ] Créer `fly.generator.toml`
- [ ] Déployer le microservice sur une instance Fly.io séparée

### Étape 6.2 - Déploiement frontend (Vercel)

- [ ] Connecter le repository GitHub à Vercel
- [ ] Configurer les variables d'environnement dans Vercel
- [ ] Premier déploiement automatique
- [ ] Vérifier que l'auth Clerk fonctionne en production
- [ ] Configurer les URLs de redirection Clerk pour le domaine Vercel
- [ ] Tester le flux complet en production

### Étape 6.3 - Configuration finale Cloudflare R2

- [ ] Configurer un domaine custom pour les images (ou utiliser l'URL R2 par défaut)
- [ ] Vérifier que toutes les images de la campagne sont accessibles
- [ ] Tester le chargement des images depuis le frontend en production

### Étape 6.4 - README GitHub

- [ ] Description du projet (2-3 lignes percutantes)
- [ ] **Screenshots** : landing page, création de héros, scène de jeu, combat
- [ ] **GIF animé** : une session de jeu de 30 secondes (outil : Licecap, gratuit)
- [ ] Stack technique avec justifications (tableau)
- [ ] Schéma d'architecture (image)
- [ ] Instructions de lancement en local (5 étapes max)
- [ ] Lien vers la démo en production
- [ ] Section "Architecture" : monolithe modulaire + 2 microservices expliqués
- [ ] Section "Évolutions futures"

### Étape 6.5 - Démo vidéo portfolio

Enregistrer une session de jeu de 3-5 minutes montrant :

- [ ] La page de landing (ambiance)
- [ ] La création d'un héros Rôdeur
- [ ] 3-4 scènes de jeu avec le typewriter effect
- [ ] Un combat complet avec animation des dés
- [ ] La victoire ou une mort dramatique
- [ ] L'authoring tool (30 secondes - montrer que le contenu est gérable)

Outils recommandés : OBS Studio (gratuit) pour l'enregistrement, DaVinci Resolve (gratuit) pour le montage.

### Étape 6.6 - Mise à jour du profil Malt

- [ ] Ajouter le projet avec lien GitHub + lien démo
- [ ] Mettre en avant les technos : Go, Next.js, PostgreSQL, Clerk, Cloudflare R2
- [ ] Mentionner l'architecture : microservices, IA générative, gamebook

---

## Récapitulatif des livrables

| Phase | Livrable principal | Critère de validation |
|-------|-------------------|-----------------------|
| 0 | Comptes créés + BDD initialisée + Bible du jeu | Connexion BDD OK, outline campagne rédigé |
| 1 | API Go complète + tests | Flux complet testable via Postman |
| 2 | Microservice génération opérationnel | Description → image sur R2 en < 30s |
| 3 | Frontend jouable | Partie jouable sans authoring |
| 4 | Authoring tool fonctionnel | Créer une scène + générer son image |
| 5 | Campagne V1 complète | 3 playtests complets (un par archétype) |
| 6 | Déployé + README + vidéo | Lien partageable fonctionnel |

---

## Dépendances entre les phases

```
Phase 0 ──────────────────────────────────────────────────┐
   (comptes + BDD + bible)                                 │
         │                                                 │
         ├──────────────────┐                              │
         ▼                  ▼                              │
Phase 1              Phase 2                               │
   (Backend Go)      (Microservice)                        │
         │                  │                              │
         └──────┬───────────┘                              │
                ▼                                          │
            Phase 3 ◄─────────────────────────────────────┘
            (Frontend)
                │
                ▼
            Phase 4
            (Authoring)
                │
                ▼
            Phase 5
            (Contenu)
                │
                ▼
            Phase 6
            (Portfolio)
```

> 💡 **Phases 1 et 2 sont parallélisables** si tu bloques sur l'une d'elles.
> **Phase 3 dépend des deux** : le jeu a besoin de l'API (Phase 1) et les images
> ont besoin du microservice (Phase 2) pour être générées.
> **Phase 4 peut commencer** dès que Phase 1 est fonctionnelle
> (les routes de contenu admin n'ont pas besoin du microservice pour le CRUD).

---

## Risques et points de vigilance

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Cohérence visuelle insuffisante | Moyenne | Élevé | Valider le prompt maître sur 10 images avant de commencer |
| API Fal.ai indisponible | Faible | Moyen | Fallback : image placeholder pendant la génération |
| Clerk breaking changes | Faible | Élevé | Fixer la version du SDK dans package.json |
| Dérive narrative (scènes incohérentes) | Élevée | Moyen | Relire depuis le début toutes les 5 scènes écrites |
| Sous-estimation de la Phase 5 | Élevée | Moyen | Prévoir 2 semaines fermes, pas négociables |
| Performance de l'animation des dés | Faible | Faible | Tester sur mobile dès la Phase 3 |
| Dépassement du free tier Supabase | Faible | Faible | Surveiller la taille de la BDD (surtout les game_logs) |

---

## Ordre de démarrage recommandé - Jour 1

1. Créer les 6 comptes (Supabase, Clerk, Cloudflare, Fal.ai, Fly.io, Vercel)
2. Tester l'API Fal.ai depuis le playground - vérifier que ça génère
3. Exécuter le schéma SQL sur Supabase - vérifier les tables
4. Créer les deux repositories GitHub
5. Écrire la première scène du jeu à la main (pose les bases narratives)

> **Pourquoi commencer par les comptes et pas le code ?**
> La création de comptes prend 2-3 heures mais elle débloque tout le reste.
> Découvrir en Phase 3 que l'API Fal.ai ne correspond pas à ce qu'on attendait
> ou que Clerk ne supporte pas le cas d'usage serait catastrophique.
> Tester les services tiers le plus tôt possible élimine les surprises.

---

*Feuille de route - Projet 3 Gamebook Heroic Fantasy*
*À réviser après chaque phase selon l'avancement réel*
*Version 1.0*
