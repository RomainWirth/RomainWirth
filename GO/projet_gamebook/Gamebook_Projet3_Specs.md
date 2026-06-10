# Projet 3 - Gamebook Heroic Fantasy
**Spécifications techniques et fonctionnelles complètes**
Go (Fiber) + Next.js | PostgreSQL | Clerk | Cloudflare R2 | Fal.ai

---

## Sommaire

1. [Vision du projet](#1-vision-du-projet)
2. [Univers et narration](#2-univers-et-narration)
3. [Système de jeu](#3-système-de-jeu)
4. [Architecture technique](#4-architecture-technique)
5. [Backend Go - Monolithe modulaire](#5-backend-go--monolithe-modulaire)
6. [Microservice - Génération d'images](#6-microservice--génération-dimages)
7. [Microservice - Authentification (Clerk)](#7-microservice--authentification-clerk)
8. [Frontend Next.js](#8-frontend-nextjs)
9. [Base de données PostgreSQL](#9-base-de-données-postgresql)
10. [Stockage des images (Cloudflare R2)](#10-stockage-des-images-cloudflare-r2)
11. [Cohérence visuelle](#11-cohérence-visuelle)
12. [Outil d'authoring](#12-outil-dauthoring)
13. [Déploiement et infrastructure](#13-déploiement-et-infrastructure)
14. [Sécurité](#14-sécurité)
15. [Roadmap de développement](#15-roadmap-de-développement)
16. [Évolutions futures](#16-évolutions-futures)

---

## 1. Vision du projet

### Concept

Un gamebook Heroic Fantasy jouable en ligne, inspiré des livres-jeux *Loup Solitaire* et *Défis Fantastiques*. Le joueur crée un héros, explore une campagne narrative avec des embranchements, combat des ennemis via un système de dés inspiré D&D, et progresse en acquérant des disciplines et de l'équipement. Chaque scène est illustrée par une image BD générée une seule fois et servie statiquement à tous les joueurs.

### Positionnement

| Aspect | Choix |
|--------|-------|
| Genre | Gamebook narratif avec combats au dé |
| Ton | Heroic Fantasy sombre, années 80 |
| Style visuel | BD européenne, palette limitée, inspiré Thorgal / Conan |
| Mode | Solo, jouable en ligne, partageable via lien |
| Accès | Comptes utilisateurs (Clerk) - gratuit |
| Monétisation | Aucune pour le MVP - portfolio uniquement |

### Ce que ce projet démontre sur le portfolio

- Conception d'une architecture Go modulaire production-ready
- Intégration de services tiers (Clerk, Fal.ai, Cloudflare R2)
- Design système avec deux microservices isolés
- Frontend Next.js moderne avec App Router
- Pensée produit : authoring tool, gestion de contenu, scalabilité

---

## 2. Univers et narration

### 2.1 - Bible de l'univers

**Nom du monde** : *Valdran* - un continent en déclin, autrefois prospère, aujourd'hui rongé par une force corrompue venue du nord appelée **l'Ombre Rampante**.

**Ton général** : sombre mais pas désespéré. Les héros sont des survivants, pas des élus divins. La magie existe mais elle a un coût. Les monstres sont terrifiants mais compréhensibles.

**Les grandes factions**

| Faction | Description | Relation au joueur |
|---------|-------------|-------------------|
| Les Sentinelles de Valdran | Ordre de guerriers gardant les frontières nord | Alliés naturels |
| Le Cercle des Cendres | Mages exilés pratiquant une magie interdite | Ambigus |
| Les Clans du Fer | Tribus guerrières du sud, mercenaires | Neutres |
| L'Ombre Rampante | Force corrompue sans visage, ennemis principaux | Antagonistes |
| Les Façonneurs | Artisans-alchimistes, marchands d'artefacts | Fournisseurs |

**Lieux principaux de la campagne V1**

- **Brumeval** : ville fortifiée de départ, en tension, rumeurs de corruption
- **La Forêt des Murmures** : forêt ancienne, esprits endormis, premier donjon
- **Les Ruines d'Ashenfall** : ancienne capitale détruite, cœur de la campagne V1
- **Le Col de Pierre Noire** : passage montagneux, boss final de la campagne V1

### 2.2 - Structure narrative

**La campagne V1 : "Les Cendres de Brumeval"**

20 à 30 scènes organisées en graphe narratif. Chaque scène a :
- Un texte narratif (300-600 mots)
- Une illustration BD unique
- 1 à 4 choix possibles menant à d'autres scènes
- Optionnellement : un combat, une épreuve de discipline, ou un événement

```
SCÈNE 1 (Intro)
    │
    ├── Choix A ──→ SCÈNE 3
    │                  │
    └── Choix B ──→ SCÈNE 2 ──→ SCÈNE 4 ──→ ...
                                   │
                              [COMBAT]
                               │     │
                             Victoire  Défaite
                               │         │
                           SCÈNE 5    SCÈNE MORT
```

**Types de scènes**

| Type | Description | Fréquence |
|------|-------------|-----------|
| Narrative | Texte + choix, pas d'action mécanique | 40% |
| Combat | Résolution par dés, issue influence la suite | 30% |
| Épreuve | Jet de discipline, succès/échec change le chemin | 20% |
| Repos | Récupérer des PV, pas de choix | 5% |
| Fin | Victoire ou mort, fin de campagne | 5% |

### 2.3 - Règles d'écriture pour la cohérence narrative

- Le texte est toujours à la **deuxième personne** ("Vous entrez dans la salle...")
- La description du héros est **neutre en genre** par défaut (le joueur choisit son prénom)
- Les disciplines du héros sont **mentionnées naturellement** dans le texte quand elles s'appliquent
- Chaque scène se termine sur une **tension** ou un **choix clair**
- Les morts sont **définitives** - pas de retour en arrière (sauf checkpoint explicite)

---

## 3. Système de jeu

### 3.1 - Création du héros

Le joueur choisit :

1. **Son prénom** - saisie libre
2. **Son archétype** - parmi 3

| Archétype | Endurance (PV) | Habileté | Discipline de départ | Style de jeu |
|-----------|---------------|----------|---------------------|--------------|
| Guerrier  | 28            | 12       | Maîtrise des armes  | Combat direct, résistant |
| Mage      | 18            | 16       | Magie arcanique     | Fragile mais puissant |
| Rôdeur    | 22            | 14       | Survie en nature    | Équilibré, furtif |

3. **Ses disciplines de départ** - choisir 3 parmi la liste selon l'archétype

### 3.2 - Les disciplines

Les disciplines sont des capacités passives ou actives qui débloquent des options dans les scènes et améliorent les jets de combat.

**Liste complète des disciplines (12 au total)**

| Discipline | Archétypes | Effet mécanique | Effet narratif |
|-----------|-----------|-----------------|----------------|
| Maîtrise des armes | Guerrier | +2 au jet d'attaque | Débloque options de combat avancées |
| Bouclier de volonté | Guerrier | Réduction 2 dégâts/round | Résister aux sorts de peur |
| Endurance surhumaine | Guerrier | +6 PV max | Survivre aux épreuves physiques |
| Magie arcanique | Mage | Accès sorts offensifs | Débloque passages magiques |
| Lecture des esprits | Mage | Jet de SAG +3 | Percevoir les intentions cachées |
| Vision du chaos | Mage | Voir l'invisible | Détecter pièges et illusions |
| Survie en nature | Rôdeur | Trouver nourriture/abri | Traverser zones sauvages sans pénalité |
| Traque | Rôdeur | Initiative +3 | Surprise les ennemis, évite les embuscades |
| Camouflage | Rôdeur | Éviter certains combats | Passer inaperçu dans les zones gardées |
| Guérison | Tous | Récupérer 1d6 PV/scène | Soigner les blessures des alliés |
| Sixième sens | Tous | Avertissement en cas de danger | Éviter certaines mauvaises surprises |
| Connaissance des langues | Tous | Déchiffrer textes anciens | Accéder aux informations cachées |

**Progression des disciplines**

Chaque discipline a 3 niveaux :
- **Niveau 1** : effet de base (départ)
- **Niveau 2** : effet amélioré (débloqué après 3 scènes avec utilisation de la discipline)
- **Niveau 3** : effet maximal (débloqué après 7 scènes ou en trouvant un artefact)

```go
type Discipline struct {
    ID          string
    Nom         string
    Niveau      int       // 1, 2 ou 3
    SceneCount  int       // Nombre de fois utilisée
    Archétypes  []string  // Archétypes qui y ont accès
}
```

### 3.3 - Statistiques du héros

```
Endurance (PV)    : points de vie, 0 = mort
Habileté          : modificateur de base pour tous les jets
Or                : monnaie pour acheter équipements
Repas             : nécessaires pour les repos longs (mécanique survie)
Disciplines       : 3 choisies au départ + acquises en jeu
Inventaire        : 8 slots maximum
Équipement        : arme, armure, objet spécial
```

### 3.4 - Système de combat au dé

Le combat se déroule en rounds jusqu'à la mort d'un combattant ou la fuite du joueur.

**Séquence d'un round**

```
1. Jet d'initiative : 1d6 + mod Habileté vs 1d6 + mod Habileté ennemi
   → Le plus haut attaque en premier

2. Jet d'attaque attaquant : 2d6 + mod Habileté
   vs
   Défense défenseur : 2d6 + mod Habileté

3. Si attaque > défense → Dégâts = dé de dégâts de l'arme + mod
   Si attaque ≤ défense → Esquive, pas de dégâts

4. L'autre combattant fait de même (si encore en vie)

5. Fin du round → vérifier si un combattant est à 0 PV
```

**Les dés de dégâts par arme**

| Arme | Dés de dégâts | Modificateur archétype |
|------|--------------|----------------------|
| Dague | 1d4 | +1 Rôdeur |
| Épée courte | 1d6 | - |
| Épée longue | 1d8 | +1 Guerrier |
| Hache de guerre | 1d10 | +2 Guerrier |
| Bâton magique | 1d6 | +2 Mage (sorts) |
| Arc court | 1d6 | +1 Rôdeur |
| Arc long | 1d8 | +1 Rôdeur |

**Options de combat**

À chaque round, le joueur peut choisir :
- **Attaquer** - résolution standard
- **Attaque puissante** - +2 dégâts, -2 défense ce round
- **Défense totale** - +4 défense, pas d'attaque ce round
- **Fuir** - jet de Habileté DD 10, succès = sortie du combat avec 1d6 dégâts

**Disciplines en combat**

- *Maîtrise des armes* niveau 1 → +2 jet d'attaque
- *Bouclier de volonté* niveau 1 → -2 dégâts reçus par round
- *Traque* niveau 1 → +3 à l'initiative
- *Magie arcanique* niveau 1 → accès à l'option "Lancer un sort" (1d8+3 dégâts, 1 usage/combat)

### 3.5 - Bestiaire V1

| Ennemi | Endurance | Habileté | Dégâts | XP | Notes |
|--------|-----------|----------|--------|-----|-------|
| Garde corrompu | 16 | 8 | 1d6+1 | 20 | Scènes urbaines |
| Loup des brumes | 12 | 10 | 1d6+2 | 25 | Forêt |
| Spectre affamé | 20 | 12 | 1d8 | 40 | Immunisé armes non magiques |
| Troll de caverne | 30 | 9 | 1d10+2 | 60 | Régénère 2 PV/round |
| Chevalier de l'Ombre | 36 | 14 | 1d8+3 | 100 | Boss intermédiaire |
| Le Façonneur Corrompu | 50 | 16 | 2d6+4 | 200 | Boss final V1 |

### 3.6 - Inventaire et équipement

- **8 slots** d'inventaire maximum
- **Arme équipée** : 1 slot dédié
- **Armure équipée** : 1 slot dédié (bonus défense passif)
- **Potions** : se consomment pendant ou après le combat
- **Artefacts** : objets spéciaux débloquant des disciplines ou options narratives
- **Or** : monnaie, dépensée chez les marchands dans certaines scènes
- **Repas** : consommé lors des repos longs (+1d6+2 PV récupérés)

---

## 4. Architecture technique

### 4.1 - Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                      UTILISATEUR                            │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼──────────────────────────────────┐
│              FRONTEND - Next.js 14 (Vercel)                 │
│         App Router | Tailwind CSS | Clerk SDK               │
└────────┬──────────────────────────────────┬─────────────────┘
         │ API calls (JWT Clerk)            │ Images statiques
         │                                  │
┌────────▼────────────┐          ┌──────────▼──────────────────┐
│  BACKEND PRINCIPAL  │          │    CLOUDFLARE R2             │
│  Go + Fiber         │          │    (Stockage images BD)      │
│  Monolithe modulaire│          │    CDN global, gratuit <10GB │
│  Fly.io             │          └─────────────────────────────┘
└────────┬────────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
┌───▼────────────┐         ┌──────────▼──────────────────┐
│  PostgreSQL     │         │  MICROSERVICE GÉNÉRATION    │
│  (Supabase)     │         │  Go + Fal.ai SDK            │
│  Données jeu    │         │  Fly.io (instance séparée)  │
│  Utilisateurs   │         │  Appelé uniquement depuis   │
│  Progression    │         │  l'outil d'authoring        │
└────────────────┘         └─────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│              CLERK (Microservice Auth)                      │
│    Gestion comptes, JWT, sessions - SaaS externe            │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 - Les deux microservices

**Microservice 1 - Authentification (Clerk)**
Clerk est un SaaS qui joue le rôle de microservice d'authentification. Il gère :
- Inscription / connexion / déconnexion
- Génération et validation des JWT
- Gestion des sessions
- Interface admin pour voir les utilisateurs

Le backend Go valide chaque requête en vérifiant le JWT Clerk - c'est tout ce qu'il fait côté auth.

**Microservice 2 - Génération d'images (Go + Fal.ai)**
Instance Go séparée, uniquement accessible depuis l'outil d'authoring (pas depuis le frontend public). Il reçoit une description de scène, appelle l'API Fal.ai, récupère l'image, et la stocke sur Cloudflare R2.

> 🏗️ **Pourquoi isoler la génération d'images ?**
> La génération est lente (3-10 secondes), coûteuse en ressources, et ne doit jamais
> être appelée pendant une partie. En l'isolant dans un microservice séparé :
> - Le backend principal n'est jamais bloqué par une génération
> - On peut scaler ce service indépendamment
> - On peut le couper complètement sans affecter le jeu
> - L'accès est restreint à l'authoring tool (pas d'abus possible)

---

## 5. Backend Go - Monolithe modulaire

### 5.1 - Structure des packages

```
cmd/
└── server/
    └── main.go                  ← Point d'entrée

internal/
├── auth/
│   ├── middleware.go            ← Validation JWT Clerk
│   └── claims.go                ← Extraction userId depuis le token
│
├── game/
│   ├── handler.go               ← Routes HTTP du jeu
│   ├── service.go               ← Logique métier du jeu
│   └── dto.go                   ← Data Transfer Objects
│
├── narrative/
│   ├── handler.go               ← Routes des scènes
│   ├── service.go               ← Récupérer/naviguer les scènes
│   ├── graph.go                 ← Graphe narratif (nœuds + arêtes)
│   └── dto.go
│
├── character/
│   ├── handler.go               ← Création/récupération du héros
│   ├── service.go               ← Logique personnage
│   ├── disciplines.go           ← Gestion des disciplines
│   └── dto.go
│
├── combat/
│   ├── handler.go               ← Routes de combat
│   ├── service.go               ← Orchestration d'un combat
│   ├── resolver.go              ← Résolution attaque/défense/dégâts
│   └── dice.go                  ← Moteur de dés
│
├── inventory/
│   ├── handler.go
│   ├── service.go               ← Gestion inventaire + équipement
│   └── dto.go
│
├── progression/
│   ├── handler.go
│   ├── service.go               ← Sauvegarde progression, XP, disciplines
│   └── dto.go
│
├── repository/
│   ├── db.go                    ← Connexion PostgreSQL (pgx)
│   ├── character_repo.go
│   ├── scene_repo.go
│   ├── progression_repo.go
│   └── inventory_repo.go
│
└── config/
    └── config.go                ← Variables d'environnement
```

### 5.2 - Routes API

**Authentification** (validé par middleware Clerk sur toutes les routes protégées)

```
POST   /api/auth/webhook          ← Webhook Clerk (création compte)
```

**Personnage**
```
POST   /api/characters            ← Créer un nouveau héros
GET    /api/characters            ← Lister les héros du joueur
GET    /api/characters/:id        ← Détail d'un héros
DELETE /api/characters/:id        ← Supprimer un héros
```

**Jeu / Progression**
```
POST   /api/games                 ← Démarrer une nouvelle partie
GET    /api/games/:id             ← État actuel d'une partie
POST   /api/games/:id/choice      ← Faire un choix (avancer dans le graphe)
POST   /api/games/:id/rest        ← Faire un repos (consomme un repas)
DELETE /api/games/:id             ← Abandonner une partie
```

**Combat**
```
POST   /api/games/:id/combat/start    ← Démarrer un combat
POST   /api/games/:id/combat/round    ← Jouer un round
POST   /api/games/:id/combat/flee     ← Tenter de fuir
```

**Inventaire**
```
GET    /api/games/:id/inventory       ← État de l'inventaire
POST   /api/games/:id/inventory/use   ← Utiliser un objet
POST   /api/games/:id/inventory/equip ← Équiper un objet
```

**Contenu narratif (public, pas d'auth)**
```
GET    /api/campaigns             ← Liste des campagnes disponibles
GET    /api/campaigns/:id         ← Détail d'une campagne
GET    /api/scenes/:id            ← Détail d'une scène (texte + image URL)
```

### 5.3 - Moteur de dés

```go
package combat

import (
    "math/rand"
    "time"
)

type DiceRoller struct {
    rng *rand.Rand
}

func NewDiceRoller() *DiceRoller {
    return &DiceRoller{rng: rand.New(rand.NewSource(time.Now().UnixNano()))}
}

func (d *DiceRoller) Roll(faces int) int {
    return d.rng.Intn(faces) + 1
}

func (d *DiceRoller) RollMultiple(count, faces int) []int {
    results := make([]int, count)
    for i := range results {
        results[i] = d.Roll(faces)
    }
    return results
}

func (d *DiceRoller) Sum(count, faces int) int {
    total := 0
    for i := 0; i < count; i++ {
        total += d.Roll(faces)
    }
    return total
}

// Raccourcis sémantiques
func (d *DiceRoller) D4() int  { return d.Roll(4) }
func (d *DiceRoller) D6() int  { return d.Roll(6) }
func (d *DiceRoller) D8() int  { return d.Roll(8) }
func (d *DiceRoller) D10() int { return d.Roll(10) }
func (d *DiceRoller) D20() int { return d.Roll(20) }
```

### 5.4 - Résolution d'un round de combat

```go
type CombatRound struct {
    AttaquantRoll  int
    DefenseurRoll  int
    Touche         bool
    Degats         int
    AttaquantPVRestants int
    DefenseurPVRestants int
    Description    string  // Texte narratif du round
}

func (r *CombatResolver) ResolveRound(
    attaquant *Combattant,
    defenseur *Combattant,
    option OptionCombat,
) CombatRound {
    dice := NewDiceRoller()

    // Jet d'attaque (2d6 + Habileté + bonus disciplines)
    attaqueRoll := dice.Sum(2, 6) + attaquant.Habilete + attaquant.BonusAttaque(option)

    // Jet de défense (2d6 + Habileté + bonus armure)
    defenseRoll := dice.Sum(2, 6) + defenseur.Habilete + defenseur.BonusDefense(option)

    if attaqueRoll > defenseRoll {
        degats := attaquant.RollDegats(dice) - defenseur.ReductionDegats()
        if degats < 0 { degats = 0 }
        defenseur.Endurance -= degats
        return CombatRound{
            Touche: true,
            Degats: degats,
            DefenseurPVRestants: defenseur.Endurance,
            Description: genererDescriptionCoup(attaquant, defenseur, degats),
        }
    }

    return CombatRound{
        Touche: false,
        Degats: 0,
        Description: genererDescriptionEsquive(attaquant, defenseur),
    }
}
```

---

## 6. Microservice - Génération d'images

### 6.1 - Rôle et périmètre

Ce microservice est **uniquement appelé depuis l'outil d'authoring** - jamais depuis le frontend public ni pendant une partie. Son rôle est simple :

1. Recevoir une description de scène
2. Construire le prompt complet (style maître + description)
3. Appeler l'API Fal.ai
4. Récupérer l'image générée
5. L'uploader sur Cloudflare R2
6. Retourner l'URL publique

### 6.2 - Structure

```
cmd/
└── generator/
    └── main.go

internal/
├── generator/
│   ├── handler.go       ← Route POST /generate
│   ├── service.go       ← Orchestration génération
│   ├── falai.go         ← Client API Fal.ai
│   └── prompt.go        ← Construction des prompts
└── storage/
    └── r2.go            ← Upload vers Cloudflare R2
```

### 6.3 - Construction du prompt

```go
// prompt.go

const PromptMaitre = `
Style : bande dessinée européenne années 80, trait encré noir épais,
couleurs à la gouache, palette limitée (ocre, bordeaux, bleu nuit, or),
éclairage dramatique venant de la gauche, ombres profondes,
inspiré Moebius et Druillet, heroic fantasy sombre,
pas de photorealisme, pas d'anime, pas de style manga.
Format : 16:9, scène d'action ou de tension dramatique.
`

func BuildPrompt(scene SceneDescription) string {
    return fmt.Sprintf(`
%s
Scène : %s
Lieu : %s
Personnages présents : %s
Ambiance : %s
Éléments importants : %s
    `,
        PromptMaitre,
        scene.Description,
        scene.Lieu,
        scene.Personnages,
        scene.Ambiance,
        scene.ElementsVisuels,
    )
}
```

### 6.4 - Appel Fal.ai

```go
// falai.go

type FalAIClient struct {
    APIKey  string
    BaseURL string
}

type GenerationRequest struct {
    Prompt         string  `json:"prompt"`
    ImageSize      string  `json:"image_size"`       // "landscape_16_9"
    NumImages      int     `json:"num_images"`        // 1
    OutputFormat   string  `json:"output_format"`     // "jpeg"
    GuidanceScale  float64 `json:"guidance_scale"`    // 7.5
    NumSteps       int     `json:"num_inference_steps"` // 28
}

func (c *FalAIClient) Generate(prompt string) ([]byte, error) {
    req := GenerationRequest{
        Prompt:        prompt,
        ImageSize:     "landscape_16_9",
        NumImages:     1,
        OutputFormat:  "jpeg",
        GuidanceScale: 7.5,
        NumSteps:      28,
    }
    // Appel HTTP à l'API Fal.ai (modèle FLUX)
    // Retourne les bytes de l'image JPEG
}
```

### 6.5 - Sécurité du microservice

- Accessible uniquement via une clé API secrète (`X-Internal-Key` header)
- Non exposé publiquement - communication interne uniquement
- Rate limiting : 1 requête toutes les 15 secondes (éviter les abus accidentels)

---

## 7. Microservice - Authentification (Clerk)

### 7.1 - Intégration côté Next.js

```typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html><body>{children}</body></html>
    </ClerkProvider>
  )
}

// Protection d'une route
import { auth } from '@clerk/nextjs/server'

export default async function GamePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  // ...
}
```

### 7.2 - Validation côté Go

```go
// internal/auth/middleware.go

func ClerkAuthMiddleware(secretKey string) fiber.Handler {
    return func(c *fiber.Ctx) error {
        token := extractBearerToken(c)
        if token == "" {
            return c.Status(401).JSON(fiber.Map{"error": "unauthorized"})
        }

        claims, err := validateClerkJWT(token, secretKey)
        if err != nil {
            return c.Status(401).JSON(fiber.Map{"error": "invalid token"})
        }

        // Stocker le userId dans le contexte Fiber
        c.Locals("userId", claims.Subject)
        return c.Next()
    }
}
```

### 7.3 - Webhook Clerk → création de compte

Quand un utilisateur s'inscrit via Clerk, un webhook notifie le backend Go pour créer l'entrée en base :

```go
// POST /api/auth/webhook
func (h *AuthHandler) HandleClerkWebhook(c *fiber.Ctx) error {
    event := parseClerkEvent(c.Body())
    if event.Type == "user.created" {
        h.userService.CreateUser(event.Data.ID, event.Data.Email)
    }
    return c.SendStatus(200)
}
```

---

## 8. Frontend Next.js

### 8.1 - Structure des pages

```
app/
├── layout.tsx                   ← ClerkProvider, layout global
├── page.tsx                     ← Landing page
├── sign-in/[[...sign-in]]/
│   └── page.tsx                 ← Page connexion Clerk
├── sign-up/[[...sign-up]]/
│   └── page.tsx                 ← Page inscription Clerk
├── dashboard/
│   └── page.tsx                 ← Tableau de bord joueur
├── characters/
│   ├── new/page.tsx             ← Création de héros
│   └── [id]/page.tsx            ← Fiche du héros
├── game/
│   ├── [id]/page.tsx            ← Écran de jeu principal
│   └── [id]/combat/page.tsx     ← Écran de combat
└── admin/                       ← Outil d'authoring (protégé)
    ├── page.tsx
    ├── scenes/
    │   ├── page.tsx             ← Liste des scènes
    │   ├── new/page.tsx         ← Créer une scène
    │   └── [id]/page.tsx        ← Éditer une scène
    └── campaigns/
        └── page.tsx             ← Gestion des campagnes
```

### 8.2 - Écran de jeu principal

C'est l'écran central du jeu. Il doit être **immersif** et **lisible**.

```
┌─────────────────────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║                                                       ║  │
│  ║           ILLUSTRATION BD DE LA SCÈNE                ║  │
│  ║              (format 16:9, pleine largeur)            ║  │
│  ║                                                       ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                             │
│  ┌─────────────────────────────────┐  ┌─────────────────┐  │
│  │                                 │  │ ♥ Endurance     │  │
│  │  TEXTE NARRATIF DE LA SCÈNE     │  │ ████████░░ 22  │  │
│  │                                 │  │                 │  │
│  │  "Vous pénétrez dans la grande  │  │ ⚔ Habileté : 14│  │
│  │   salle aux colonnes brisées... │  │ 🎒 Inventaire  │  │
│  │   L'air sent la cendre et le    │  │ 🍖 Repas : 2   │  │
│  │   soufre."                      │  │ 💰 Or : 35     │  │
│  │                                 │  │                 │  │
│  └─────────────────────────────────┘  │ DISCIPLINES     │  │
│                                       │ > Survie Niv.2 │  │
│  ┌─────────────────────────────────┐  │ > Traque Niv.1 │  │
│  │         VOS CHOIX               │  │ > Guérison N.1 │  │
│  │                                 │  └─────────────────┘  │
│  │  [ Avancer vers l'autel ]       │                       │
│  │  [ Examiner les colonnes ]      │                       │
│  │  [ Rebrousser chemin ]          │                       │
│  └─────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 - Écran de combat

```
┌─────────────────────────────────────────────────────────────┐
│  ⚔  COMBAT - Chevalier de l'Ombre                          │
│                                                             │
│  VOUS                          ENNEMI                       │
│  ♥ ████████░░ 22/28            ♥ ████░░░░░░ 20/36          │
│  Habileté : 14                 Habileté : 14                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Round 3                                            │   │
│  │  🎲 Vous attaquez : 2d6 + 14 = 8 + 6 + 14 = 28    │   │
│  │  🎲 Défense ennemi : 2d6 + 14 = 3 + 4 + 14 = 21   │   │
│  │  ✅ Touché ! Dégâts : 1d8 + 2 = 7                  │   │
│  │  Le Chevalier titube mais reste debout...          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ ⚔ Attaquer ] [ 🛡 Défense totale ] [ 💨 Fuir ]         │
└─────────────────────────────────────────────────────────────┘
```

### 8.4 - Création de héros

Processus en 4 étapes (wizard) :

1. **Choisir l'archétype** - carte cliquable pour chaque archétype avec stats et description
2. **Choisir les disciplines** - 3 parmi la liste filtrée par archétype
3. **Nommer le héros** - saisie du prénom
4. **Résumé** - fiche complète avant confirmation

### 8.5 - Stack frontend

```json
{
  "next": "14",
  "react": "18",
  "@clerk/nextjs": "latest",
  "tailwindcss": "3",
  "framer-motion": "latest",
  "zustand": "latest",
  "react-query": "latest",
  "typescript": "5"
}
```

**Choix techniques :**
- **Zustand** pour l'état global du jeu (état de la partie en cours)
- **React Query** pour le fetching et le cache des données API
- **Framer Motion** pour les animations (transition de scènes, apparition des dés)
- **Tailwind CSS** pour le style - thème sombre personnalisé

### 8.6 - Thème visuel

```css
/* Palette principale - inspirée BD Heroic Fantasy */
:root {
  --bg-primary:     #0D0A07;  /* Noir chaud */
  --bg-secondary:   #1A1208;  /* Brun très sombre */
  --bg-card:        #241A0E;  /* Brun sombre */
  --border:         #4A3010;  /* Or sombre */
  --text-primary:   #E8D5A3;  /* Parchemin */
  --text-secondary: #9A8060;  /* Parchemin foncé */
  --accent-gold:    #C9A84C;  /* Or */
  --accent-red:     #8B1A1A;  /* Rouge sang */
  --accent-blue:    #1A2A4A;  /* Bleu nuit */
  --hp-full:        #2D7A2D;  /* Vert PV */
  --hp-low:         #8B1A1A;  /* Rouge PV bas */
}
```

**Police** : *Cinzel* pour les titres (majuscules romaines, feel épique), *Lora* pour le texte narratif (serif lisible), Google Fonts - libres de droits.

---

## 9. Base de données PostgreSQL

### 9.1 - Schéma complet

```sql
-- Utilisateurs (synchronisé depuis Clerk via webhook)
CREATE TABLE users (
    id          VARCHAR(255) PRIMARY KEY,  -- Clerk user ID
    email       VARCHAR(255) UNIQUE NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Campagnes narratives
CREATE TABLE campaigns (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre       VARCHAR(255) NOT NULL,
    description TEXT,
    statut      VARCHAR(20) DEFAULT 'draft',  -- draft, published, archived
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Scènes (nœuds du graphe narratif)
CREATE TABLE scenes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id     UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    titre           VARCHAR(255) NOT NULL,
    texte           TEXT NOT NULL,
    type_scene      VARCHAR(20) NOT NULL,     -- narrative, combat, epreuve, repos, fin
    image_url       VARCHAR(500),             -- URL Cloudflare R2
    image_prompt    TEXT,                     -- Prompt utilisé pour générer l'image
    ennemi_id       UUID REFERENCES ennemis(id),  -- Si type = combat
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Choix (arêtes du graphe narratif)
CREATE TABLE choices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scene_id        UUID REFERENCES scenes(id) ON DELETE CASCADE,
    texte           VARCHAR(500) NOT NULL,
    scene_cible_id  UUID REFERENCES scenes(id),
    condition_type  VARCHAR(50),   -- null, discipline, stat, item
    condition_value JSONB,         -- {"discipline": "traque", "niveau": 1}
    ordre           INTEGER DEFAULT 0
);

-- Personnages joueurs
CREATE TABLE characters (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
    prenom          VARCHAR(100) NOT NULL,
    archetype       VARCHAR(20) NOT NULL,   -- guerrier, mage, rodeur
    endurance_max   INTEGER NOT NULL,
    endurance       INTEGER NOT NULL,
    habilete        INTEGER NOT NULL,
    or_pieces       INTEGER DEFAULT 10,
    repas           INTEGER DEFAULT 2,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Disciplines du personnage
CREATE TABLE character_disciplines (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID REFERENCES characters(id) ON DELETE CASCADE,
    discipline_id   VARCHAR(50) NOT NULL,   -- Clé de la discipline
    niveau          INTEGER DEFAULT 1,
    uses_count      INTEGER DEFAULT 0       -- Nombre d'utilisations pour progression
);

-- Parties en cours
CREATE TABLE games (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         VARCHAR(255) REFERENCES users(id),
    character_id    UUID REFERENCES characters(id),
    campaign_id     UUID REFERENCES campaigns(id),
    scene_courante  UUID REFERENCES scenes(id),
    statut          VARCHAR(20) DEFAULT 'active',  -- active, victoire, mort, abandonnee
    experience      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Inventaire
CREATE TABLE inventory (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID REFERENCES characters(id) ON DELETE CASCADE,
    item_type       VARCHAR(50) NOT NULL,   -- arme, armure, potion, artefact
    item_key        VARCHAR(100) NOT NULL,  -- Clé de l'item
    item_data       JSONB,                  -- Propriétés spécifiques
    equipe          BOOLEAN DEFAULT FALSE,
    slot            INTEGER,                -- Position dans l'inventaire
    quantite        INTEGER DEFAULT 1
);

-- Ennemis (bestiaire)
CREATE TABLE ennemis (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom             VARCHAR(100) NOT NULL,
    endurance       INTEGER NOT NULL,
    habilete        INTEGER NOT NULL,
    des_degats      VARCHAR(20) NOT NULL,   -- "1d8+2"
    experience      INTEGER NOT NULL,
    notes           TEXT
);

-- Journal de partie (log des actions importantes)
CREATE TABLE game_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id         UUID REFERENCES games(id) ON DELETE CASCADE,
    type_log        VARCHAR(50),    -- scene_change, combat_result, item_found
    data            JSONB,
    created_at      TIMESTAMP DEFAULT NOW()
);
```

### 9.2 - Indexes

```sql
CREATE INDEX idx_games_user_id      ON games(user_id);
CREATE INDEX idx_games_character_id ON games(character_id);
CREATE INDEX idx_scenes_campaign_id ON scenes(campaign_id);
CREATE INDEX idx_choices_scene_id   ON choices(scene_id);
CREATE INDEX idx_inventory_char_id  ON inventory(character_id);
CREATE INDEX idx_char_disciplines   ON character_disciplines(character_id);
CREATE INDEX idx_game_logs_game_id  ON game_logs(game_id);
```

---

## 10. Stockage des images (Cloudflare R2)

### 10.1 - Organisation des buckets

```
gamebook-images/
├── scenes/
│   ├── {campaign_id}/
│   │   ├── {scene_id}.jpg        ← Image principale de la scène
│   │   └── {scene_id}_thumb.jpg  ← Miniature (aperçu dans l'authoring)
├── ui/
│   ├── archetypes/               ← Illustrations des 3 archétypes
│   ├── disciplines/              ← Icônes des disciplines
│   └── backgrounds/              ← Fonds d'écran
└── temp/                         ← Images en attente de validation (authoring)
```

### 10.2 - Accès public via CDN

Cloudflare R2 expose les fichiers via une URL publique :
```
https://images.{ton-domaine}.com/scenes/{campaign_id}/{scene_id}.jpg
```

Cette URL est stockée dans la colonne `image_url` de la table `scenes`.

### 10.3 - Upload depuis le microservice

```go
// storage/r2.go

func (s *R2Storage) UploadSceneImage(
    campaignID, sceneID string,
    imageData []byte,
) (string, error) {
    key := fmt.Sprintf("scenes/%s/%s.jpg", campaignID, sceneID)

    _, err := s.client.PutObject(context.Background(), &s3.PutObjectInput{
        Bucket:      aws.String(s.bucketName),
        Key:         aws.String(key),
        Body:        bytes.NewReader(imageData),
        ContentType: aws.String("image/jpeg"),
    })
    if err != nil {
        return "", fmt.Errorf("upload R2: %w", err)
    }

    return fmt.Sprintf("%s/%s", s.publicBaseURL, key), nil
}
```

> 💡 Cloudflare R2 est compatible S3 - on utilise le SDK AWS S3 en Go,
> en changeant simplement l'endpoint vers R2. Zéro frais de transfert sortant.

---

## 11. Cohérence visuelle

### 11.1 - Le prompt maître (figé pour toute la campagne)

```
PROMPT MAÎTRE V1 - "Les Cendres de Brumeval"

Style artistique :
- Bande dessinée européenne des années 80
- Trait encré noir épais et expressif
- Couleurs à la gouache, textures légèrement granuleuses
- Palette restreinte : ocre brûlé, bordeaux sombre, bleu nuit, or terne, gris pierre
- Pas de blanc pur ni de noir pur - tout est teinté
- Éclairage dramatique venant de la gauche, ombres profondes
- Inspiré Moebius, Druillet, Simon Bisley, couvertures Conan des années 80

Format et composition :
- Format paysage 16:9
- Composition dynamique, point de fuite marqué
- Personnages expressifs, postures héroïques ou dramatiques
- Décors détaillés mais lisibles

Ce qu'il ne faut PAS :
- Pas de photorealisme
- Pas de style anime ou manga
- Pas de couleurs saturées ou néon
- Pas de personnages mignons ou kawaii
- Pas de 3D render
```

### 11.2 - Fiches personnages récurrentes

```
HÉROS (description neutre, adaptée à tous archétypes) :
Silhouette en armure de voyage usée, cape bordeaux déchirée aux bords,
équipement fonctionnel et abîmé par les combats, visage partiellement caché
par capuche ou casque simple, posture déterminée.
[Si Guerrier : épée longue dans le dos, armure de plates légère]
[Si Mage : bâton noué de runes, robe de voyage grise, sac à parchemins]
[Si Rôdeur : arc dans le dos, deux dagues à la ceinture, vêtements de cuir sombre]

VALDRAN (l'univers) :
Architecture médiévale en décrépitude, pierres noircies par la suie et le temps,
végétation envahissante, atmosphère brumeuse, lumières de torches orangées,
ciel toujours partiellement nuageux ou au crépuscule.
```

### 11.3 - Workflow de génération dans l'authoring tool

```
1. Auteur écrit la scène (texte + description visuelle)
2. Auteur clique "Générer l'illustration"
3. L'outil construit : Prompt Maître + Fiche Lieu + Description Scène
4. Appel au microservice de génération
5. Image affichée en aperçu dans l'authoring tool
6. Auteur valide ou régénère (jusqu'à 3 tentatives par scène)
7. Image validée → stockée sur R2 → URL enregistrée en BDD
8. Statut de la scène passe à "illustrée"
```

---

## 12. Outil d'authoring

### 12.1 - Rôle

L'authoring tool est une **interface admin** dans Next.js, accessible uniquement avec un compte marqué comme `admin` dans Clerk. Il permet de créer et gérer tout le contenu du jeu sans toucher au code.

### 12.2 - Fonctionnalités

**Gestion des campagnes**
- Créer / modifier / archiver une campagne
- Définir la scène de départ
- Voir les statistiques (nombre de scènes, scènes illustrées, scènes publiées)

**Éditeur de scènes**
- Champ titre et texte narratif (éditeur rich text)
- Sélection du type de scène
- Ajout des choix (texte + scène cible + condition optionnelle)
- Sélection d'un ennemi si type = combat
- Champ description visuelle pour la génération
- Bouton "Générer l'illustration" → aperçu → valider
- Statut de la scène : brouillon / illustrée / publiée

**Visualiseur du graphe narratif**
- Vue graphe des scènes et leurs connexions
- Identifier les scènes sans illustration
- Identifier les impasses (scènes sans choix sortants)
- Navigation rapide vers une scène en cliquant sur le nœud

**Gestion du bestiaire**
- Créer / modifier les ennemis
- Prévisualiser les stats de combat

### 12.3 - Sécurité de l'authoring tool

```typescript
// Middleware de protection admin
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await clerkClient.users.getUser(userId)
  if (user.publicMetadata?.role !== 'admin') {
    redirect('/')
  }
}
```

---

## 13. Déploiement et infrastructure

### 13.1 - Services et coûts (phase portfolio)

| Service | Usage | Coût mensuel |
|---------|-------|-------------|
| **Vercel** | Frontend Next.js | 0€ (free tier) |
| **Fly.io** | Backend Go principal | 0€ (free tier 256MB) |
| **Fly.io** | Microservice génération | 0€ (free tier 256MB) |
| **Supabase** | PostgreSQL | 0€ (free tier 500MB) |
| **Cloudflare R2** | Stockage images | 0€ (free tier 10GB) |
| **Clerk** | Authentification | 0€ (free tier 10k users) |
| **Fal.ai** | Génération images (authoring) | ~1-3€ (30 scènes × 0,03-0,10€) |
| **Total récurrent** | | **0€/mois** |
| **Coût unique (images)** | | **~1-3€ (une fois)** |

> La génération d'images est un coût unique de création de contenu,
> pas un coût récurrent. Une fois les 30 scènes illustrées,
> le jeu tourne à 0€/mois indéfiniment.

### 13.2 - Variables d'environnement

**Backend Go**
```env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET_NAME=gamebook-images
R2_PUBLIC_URL=https://images.ton-domaine.com
GENERATOR_SERVICE_URL=https://generator.fly.dev
GENERATOR_API_KEY=...          ← Clé secrète interne
PORT=8080
```

**Microservice génération**
```env
FAL_API_KEY=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET_NAME=gamebook-images
R2_PUBLIC_URL=https://images.ton-domaine.com
INTERNAL_API_KEY=...           ← Même clé que GENERATOR_API_KEY
PORT=8081
```

**Frontend Next.js**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_API_URL=https://api.ton-domaine.com
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

### 13.3 - Fly.io - Déploiement Go

```toml
# fly.toml - Backend principal
app = "dnd-gamebook-api"
primary_region = "cdg"  # Paris

[build]
  dockerfile = "Dockerfile"

[http_service]
  internal_port = 8080
  force_https = true

[[vm]]
  memory = "256mb"
  cpu_kind = "shared"
  cpus = 1
```

```dockerfile
# Dockerfile Go
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

---

## 14. Sécurité

### 14.1 - Points de vigilance

| Risque | Mitigation |
|--------|------------|
| Accès non autorisé aux routes API | Middleware Clerk sur toutes les routes protégées |
| Manipulation de la progression | Toute la logique de jeu côté serveur, jamais côté client |
| Abus du microservice génération | Clé API interne + rate limiting + accès authoring uniquement |
| Injection SQL | Utiliser `pgx` avec requêtes paramétrées, jamais de string formatting |
| Exposition des clés API | Variables d'environnement, jamais dans le code |
| CORS | Whitelist uniquement le domaine Vercel |

### 14.2 - CORS configuration Go

```go
app.Use(cors.New(cors.Config{
    AllowOrigins: "https://ton-domaine.vercel.app",
    AllowHeaders: "Origin, Content-Type, Authorization",
    AllowMethods: "GET, POST, PUT, DELETE",
}))
```

---

## 15. Roadmap de développement

### Phase 0 - Préparation (~3 jours)
- [ ] Setup repositories GitHub (monorepo ou 3 repos séparés)
- [ ] Compte Supabase + création de la BDD + exécution du schéma SQL
- [ ] Compte Clerk + configuration application
- [ ] Compte Cloudflare R2 + création du bucket
- [ ] Compte Fal.ai + test de l'API
- [ ] Compte Fly.io + test de déploiement d'un Hello World Go
- [ ] Compte Vercel + test de déploiement d'un Hello World Next.js
- [ ] Écriture de la Bible du jeu (univers, personnages, lieux)

### Phase 1 - Backend Go core (~2 semaines)
- [ ] Structure des packages Go
- [ ] Connexion PostgreSQL avec `pgx`
- [ ] Middleware d'authentification Clerk
- [ ] Module `character` : CRUD personnages + disciplines
- [ ] Module `combat` : DiceRoller + CombatResolver + tests unitaires
- [ ] Module `narrative` : chargement des scènes + graphe
- [ ] Module `game` : création partie + navigation + sauvegarde
- [ ] Module `inventory` : gestion inventaire + équipement
- [ ] Tests d'intégration sur les routes principales

### Phase 2 - Microservice génération (~1 semaine)
- [ ] Structure Go du microservice
- [ ] Client Fal.ai + test de génération
- [ ] Construction du prompt maître + fiches personnages
- [ ] Upload Cloudflare R2
- [ ] Route POST /generate sécurisée
- [ ] Test end-to-end : description → image → URL R2

### Phase 3 - Frontend Next.js (~2 semaines)
- [ ] Setup Next.js 14 + Tailwind + Clerk
- [ ] Thème visuel (couleurs, polices, composants de base)
- [ ] Page landing
- [ ] Flux d'inscription/connexion Clerk
- [ ] Dashboard joueur
- [ ] Wizard création de héros (4 étapes)
- [ ] Écran de jeu principal (image + texte + choix)
- [ ] Écran de combat (dés animés + log)
- [ ] Gestion de l'inventaire

### Phase 4 - Authoring tool (~1 semaine)
- [ ] Protection admin (Clerk metadata)
- [ ] CRUD campagnes
- [ ] Éditeur de scènes avec rich text
- [ ] Intégration bouton "Générer l'illustration"
- [ ] Visualiseur du graphe narratif
- [ ] Gestion du bestiaire

### Phase 5 - Contenu V1 (~2 semaines)
- [ ] Écriture des 20-30 scènes de la campagne "Les Cendres de Brumeval"
- [ ] Génération des illustrations (via authoring tool)
- [ ] Validation de la cohérence visuelle
- [ ] Playtest complet de la campagne
- [ ] Corrections de bugs et équilibrage du combat

### Phase 6 - Polish et portfolio (~3 jours)
- [ ] README complet avec screenshots et GIF
- [ ] Déploiement stable en production
- [ ] Test sur mobile (responsive)
- [ ] Lien partageable avec mot de passe (Clerk restriction)
- [ ] Démo vidéo pour le portfolio

---

## 16. Évolutions futures

### V2 - Enrichissement gameplay
- Arbre de compétences visuel (canvas SVG interactif)
- Système de réputation auprès des factions
- Marchands dans certaines scènes
- Effets de statut (poison, paralysie, bénédiction)
- Sorts à emplacements (pour le Mage)

### V2 - Contenu
- Campagne 2 : "Le Cercle des Cendres" (suite directe)
- Mode aventures courtes (5-10 scènes, introductif)
- Scènes aléatoires selon le lieu (événements de voyage)

### V3 - Communauté
- Outil d'authoring public (créer ses propres campagnes)
- Système de notation des campagnes
- Profils publics de joueurs
- Classements (finisseurs, combats gagnés)

### V3 - Monétisation possible
- Campagnes premium (achat unique)
- Abonnement pour accès illimité
- Marketplace de campagnes créateurs

---

*Spécifications complètes - Projet 3 Gamebook Heroic Fantasy*
*Go + Next.js | Monolithe modulaire + 2 microservices*
*Version 1.0 - À réviser selon les retours du développement*
