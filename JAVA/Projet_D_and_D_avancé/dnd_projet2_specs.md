# Projet 2 - D&D Graphique
**Spécifications techniques et fonctionnelles complètes**
Java 17 + JavaFX | Pixel Art Isométrique | Roguelike D&D 5e

---

## Sommaire

1. [Vue d'ensemble](#1-vue-densemble)
2. [Règles D&D 5e implémentées](#2-règles-dd-5e-implémentées)
3. [Architecture technique](#3-architecture-technique)
4. [Moteur de jeu](#4-moteur-de-jeu)
5. [Génération procédurale de donjons](#5-génération-procédurale-de-donjons)
6. [Interface graphique JavaFX](#6-interface-graphique-javafx)
7. [Système de sauvegarde](#7-système-de-sauvegarde)
8. [Assets visuels et sonores](#8-assets-visuels-et-sonores)
9. [Roadmap de développement](#9-roadmap-de-développement)
10. [Évolutions futures](#10-évolutions-futures)

---

## 1. Vue d'ensemble

### Concept

Un jeu de rôle solo en Java/JavaFX fidèle aux règles D&D 5e, avec une esthétique pixel art isométrique old school inspirée de Diablo 1 et Baldur's Gate. Le joueur crée un personnage, explore des niveaux de donjons générés procéduralement, affronte des ennemis en combat au tour par tour, et progresse jusqu'au boss final.

### Références visuelles et gameplay

| Référence | Ce qu'on en retient |
|-----------|---------------------|
| Diablo 1 (1996) | Ambiance sombre, isométrique, palette de couleurs restreinte |
| Baldur's Gate 1 (1998) | Règles AD&D, log de combat textuel, interface en pierre |
| Ultima Online (1997) | Sprites isométriques 64x64, cohérence visuelle |
| Heroes of Might & Magic 2 | Combat au tour par tour, lisibilité |
| Dungeon Hack (1993) | Génération procédurale, roguelike solo pur |

### Objectifs pédagogiques

- Approfondir Java 17 (generics, streams, records, pattern matching)
- Maîtriser JavaFX (Canvas, AnimationTimer, FXML, CSS)
- Implémenter le pattern MVC sur un projet complexe
- Pratiquer JDBC avec SQLite
- Concevoir une architecture évolutive (solo → multijoueur)
- Travailler avec des algorithmes de génération procédurale (BSP)

---

## 2. Règles D&D 5e implémentées

### 2.1 - Les 6 attributs fondamentaux

| Attribut | Abréviation | Rôle dans le jeu |
|----------|-------------|------------------|
| Force | FOR | Attaques au corps à corps, jets de Force |
| Dextérité | DEX | Attaques à distance, Initiative, Classe d'Armure (CA) |
| Constitution | CON | Points de vie, concentration des sorts |
| Intelligence | INT | Sorts de Mage, jets d'Investigation |
| Sagesse | SAG | Sorts de Clerc/Rôdeur, Perception passive |
| Charisme | CHA | Sorts de Paladin, jets de Persuasion |

Chaque attribut va de 1 à 20 (standard humain = 10-11).
**Modificateur** = `Math.floor((attribut - 10) / 2)` - de -5 à +5.

**Génération des attributs à la création :**
- Méthode Standard Array : 15, 14, 13, 12, 10, 8 à distribuer librement
- Méthode Lancer de dés : 4d6, on retire le plus bas, on fait la somme - répété 6 fois

### 2.2 - Les 12 classes

| Classe | Dé de vie | Attribut principal | Armure de départ | Spécialité |
|--------|-----------|-------------------|------------------|------------|
| Barbare | d12 | FOR | Armure légère / moyenne | Rage, Résistance aux dégâts |
| Barde | d8 | CHA | Armure légère | Inspiration bardique, sorts |
| Clerc | d8 | SAG | Armure légère / moyenne / bouclier | Sorts divins, guérison |
| Druide | d8 | SAG | Armure légère / moyenne (non métallique) | Sorts de nature, Forme sauvage |
| Guerrier | d10 | FOR ou DEX | Toutes armures | Second souffle, Style de combat |
| Moine | d8 | DEX + SAG | Aucune | Arts martiaux, Points de ki |
| Paladin | d10 | FOR + CHA | Toutes armures | Imposition des mains, Serment |
| Rôdeur | d10 | DEX + SAG | Armure légère / moyenne | Ennemi juré, Terrain de prédilection |
| Roublard | d8 | DEX | Armure légère | Attaque sournoise, Ruse |
| Ensorceleur | d6 | CHA | Aucune | Points de sorcellerie, Métamagie |
| Occultiste | d8 | CHA | Armure légère | Pacte, Invocations occultes |
| Magicien | d6 | INT | Aucune | Sorts puissants, Archetype arcanique |

> ⚡ **Java 17+ - Design Pattern recommandé**
> Utiliser le pattern **Strategy** pour les capacités spéciales de chaque classe.
> Chaque classe implémente une interface `ClasseCapacite` avec les méthodes `appliquerCapacitePassive()` et `utiliserCapaciteActive()`.
> Évite une classe `Personnage` avec 50 `if/else` sur le type de classe.

### 2.3 - Les races officielles

| Race | Bonus d'attribut | Traits principaux |
|------|-----------------|-------------------|
| Humain | +1 à tous les attributs | Polyvalent, un talent bonus |
| Elfe (Haut-Elfe) | +2 DEX, +1 INT | Vision dans le noir, Résistance au charme, sort mineur gratuit |
| Elfe (Elfe des bois) | +2 DEX, +1 SAG | Vision dans le noir, Camouflage naturel, vitesse +5 |
| Nain (Nain des collines) | +2 CON, +1 SAG | Vision dans le noir, Résistance au poison, PV bonus |
| Nain (Nain des montagnes) | +2 CON, +2 FOR | Vision dans le noir, Formation aux armures |
| Halfelin (Pied-Léger) | +2 DEX, +1 CHA | Chanceux, Bravoure, Discrétion naturelle |
| Halfelin (Robuste) | +2 DEX, +1 CON | Chanceux, Bravoure, Résistance |
| Gnome (Gnome des forêts) | +2 INT, +1 DEX | Vision dans le noir, Illusionnisme naturel, Communication animale |
| Gnome (Gnome des roches) | +2 INT, +1 CON | Vision dans le noir, Astuce artificielle |
| Demi-Elfe | +2 CHA, +1 à deux autres | Vision dans le noir, Ascendance féerique, Polyvalence |
| Semi-Orc | +2 FOR, +1 CON | Vision dans le noir, Implacable, Attaques sauvages |
| Tieffelin | +2 CHA, +1 INT | Vision dans le noir, Résistance au feu, sorts innés |

### 2.4 - Points de vie

- **PV maximum au niveau 1** = dé de vie max + modificateur CON
  - Exemple : Guerrier (d10) avec CON 14 (mod +2) → 10 + 2 = **12 PV**
- **Montée de niveau** : lancer le dé de vie OU prendre la valeur fixe (dé/2 + 1) + mod CON
- **PV temporaires** : ne s'accumulent pas, remplacent si plus élevés

### 2.5 - Classe d'Armure (CA)

- **Sans armure** : 10 + mod DEX
- **Armure légère** : valeur armure + mod DEX (max +2 pour certaines)
- **Armure intermédiaire** : valeur armure + mod DEX
- **Armure lourde** : valeur armure fixe, pas de bonus DEX
- **Bouclier** : +2 CA

### 2.6 - Le système de combat D&D 5e

#### Initiative
Au début de chaque combat : `1d20 + mod DEX` pour chaque participant.
Les combattants agissent dans l'ordre décroissant d'initiative.

#### Structure d'un tour
Chaque combattant dispose par tour de :
- **1 Action** : Attaquer, Lancer un sort, Se désengager, Se précipiter, Aider, Se cacher...
- **1 Action bonus** *(certaines classes/capacités)*
- **1 Réaction** *(hors tour, ex : Attaque d'opportunité)*
- **Déplacement** : vitesse en cases (généralement 6 cases = 9m)

#### Jet d'attaque
```
Résultat = 1d20 + bonus de maîtrise + modificateur d'attribut
```
Si résultat ≥ CA de la cible → Touché → Jet de dégâts
Si résultat = 20 (naturel) → **Coup critique** : doubler les dés de dégâts

#### Avantage / Désavantage
Mécanique centrale de D&D 5e :
- **Avantage** : lancer 2d20, garder le plus élevé
- **Désavantage** : lancer 2d20, garder le plus bas
- Ils s'annulent mutuellement (1 avantage + 1 désavantage = jet normal)

#### Bonus de maîtrise
Évolue avec le niveau du personnage :

| Niveaux | Bonus de maîtrise |
|---------|------------------|
| 1–4     | +2               |
| 5–8     | +3               |
| 9–12    | +4               |
| 13–16   | +5               |
| 17–20   | +6               |

#### Jets de sauvegarde
`1d20 + modificateur d'attribut (+ bonus de maîtrise si maîtrisé)`
Chaque classe maîtrise 2 types de jets de sauvegarde.

### 2.7 - La magie

#### Emplacements de sorts
Les lanceurs de sorts ont un nombre limité d'emplacements par niveau de sort (1 à 9).
Un sort de niveau X consomme un emplacement de niveau X ou supérieur.
Les emplacements sont récupérés après un **repos long**.

#### Sorts connus vs préparés
- **Sorts connus** (Mage, Barde, Ensorceleur) : liste fixe, ne change pas sans montée de niveau
- **Sorts préparés** (Clerc, Paladin, Druide) : choix quotidien depuis toute la liste de classe

#### Concentration
Certains sorts nécessitent la concentration. Si le personnage subit des dégâts :
`Jet de sauvegarde de CON, DD = max(10, dégâts/2)`
Échec → sort annulé.

### 2.8 - Progression et niveaux

Le jeu couvre les **niveaux 1 à 10** (les 10 premiers niveaux de D&D 5e).
Les niveaux 11-20 sont laissés en évolution future.

| Niveau | Points d'expérience requis | Bonus de maîtrise |
|--------|---------------------------|------------------|
| 1      | 0                         | +2               |
| 2      | 300                       | +2               |
| 3      | 900                       | +2               |
| 4      | 2 700                     | +2               |
| 5      | 6 500                     | +3               |
| 6      | 14 000                    | +3               |
| 7      | 23 000                    | +3               |
| 8      | 34 000                    | +3               |
| 9      | 48 000                    | +4               |
| 10     | 64 000                    | +4               |

**XP gagnée** : tuer un ennemi rapporte des XP selon son Indice de Dangerosité (ID).

---

## 3. Architecture technique

### 3.1 - Stack

| Composant | Technologie | Justification |
|-----------|-------------|---------------|
| Langage | Java 17 | LTS, records, pattern matching, sealed classes |
| UI | JavaFX 17 | Canvas 2D, AnimationTimer, FXML, CSS |
| Base de données | SQLite (via JDBC) | Fichier local, migration PostgreSQL facile |
| Build | Maven | Standard, gestion des dépendances |
| Tests | JUnit 5 + Mockito | Moteur de règles testable unitairement |
| Assets | Tiled Map Editor | Création des maps isométriques |

### 3.2 - Structure des packages

```
fr.campus.dnd/
├── Main.java                        ← Point d'entrée JavaFX
├── core/
│   ├── engine/
│   │   ├── GameEngine.java          ← Orchestrateur principal
│   │   ├── TurnManager.java         ← Gestion des tours
│   │   ├── CombatResolver.java      ← Résolution des combats
│   │   └── DiceRoller.java          ← Moteur de dés (d4 à d20)
│   ├── rules/
│   │   ├── AbilityScores.java       ← Les 6 attributs + modificateurs
│   │   ├── ProficiencyBonus.java    ← Bonus de maîtrise par niveau
│   │   ├── SpellSlots.java          ← Gestion des emplacements de sorts
│   │   └── ExperienceTable.java     ← Table d'XP et montée de niveau
│   └── events/
│       ├── GameEvent.java           ← Événement de jeu (interface)
│       └── EventBus.java            ← Communication entre modules
├── entities/
│   ├── characters/
│   │   ├── Personnage.java          ← Classe abstraite de base
│   │   ├── classes/
│   │   │   ├── ClassePersonnage.java ← Interface Strategy
│   │   │   ├── Guerrier.java
│   │   │   ├── Mage.java
│   │   │   ├── Clerc.java
│   │   │   └── ... (12 classes)
│   │   └── races/
│   │       ├── Race.java            ← Interface
│   │       ├── Humain.java
│   │       ├── Elfe.java
│   │       └── ... (races officielles)
│   ├── enemies/
│   │   ├── Ennemi.java              ← Classe abstraite
│   │   ├── EnnemiFactory.java       ← Création selon niveau du donjon
│   │   └── bestiaire/
│   │       ├── Gobelin.java
│   │       ├── Zombie.java
│   │       ├── Squelette.java
│   │       └── ...
│   └── items/
│       ├── Item.java                ← Interface
│       ├── Arme.java
│       ├── Armure.java
│       ├── Potion.java
│       └── ItemFactory.java
├── dungeon/
│   ├── Donjon.java                  ← Contient les niveaux
│   ├── NiveauDonjon.java            ← Une grille de salles
│   ├── Salle.java                   ← Une salle individuelle
│   ├── Case.java                    ← Une tuile de la grille
│   └── generator/
│       ├── DonjonGenerator.java     ← Interface de génération
│       └── BSPGenerator.java        ← Algorithme Binary Space Partitioning
├── ui/
│   ├── controllers/
│   │   ├── MenuController.java
│   │   ├── CreationPersonnageController.java
│   │   ├── JeuController.java       ← Contrôleur principal du jeu
│   │   └── CombatController.java
│   ├── renderer/
│   │   ├── IsometricRenderer.java   ← Moteur de rendu isométrique
│   │   ├── SpriteManager.java       ← Chargement et cache des sprites
│   │   ├── DiceAnimator.java        ← Animation des dés
│   │   └── CombatAnimator.java      ← Animations de combat
│   └── components/
│       ├── StatPanel.java           ← Panneau de statistiques
│       ├── InventoryPanel.java      ← Interface d'inventaire
│       ├── CombatLog.java           ← Log de combat textuel
│       └── MiniMap.java             ← Mini-carte du donjon
├── repository/
│   ├── DatabaseManager.java         ← Connexion SQLite, migrations
│   ├── PersonnageRepository.java    ← CRUD personnages
│   └── PartieRepository.java        ← CRUD parties sauvegardées
└── exceptions/
    ├── CombatException.java
    ├── InvalidSpellException.java
    └── DonjonGenerationException.java
```

### 3.3 - Pattern MVC appliqué

```
MODEL                    CONTROLLER              VIEW
─────────────────────    ──────────────────────  ─────────────────────
GameEngine           ←── JeuController       ──→ Canvas isométrique
Personnage           ←── CombatController    ──→ Fenêtre de combat
NiveauDonjon         ←── MenuController      ──→ Écrans FXML
ItemRepository            │                      StatPanel
                          │ (EventBus)            CombatLog
                          ↓                       MiniMap
                      GameEvent
```

> 🏗️ **Pourquoi un EventBus ?**
> Dans un jeu, beaucoup de composants doivent réagir au même événement.
> Exemple : un ennemi meurt → le CombatLog doit l'afficher, les stats doivent être mises à jour,
> l'XP doit être calculée, le sprite doit disparaître.
> Sans EventBus, le CombatResolver aurait des dépendances sur tous ces composants.
> Avec EventBus, il publie `new EnnemiMortEvent(ennemi)` et chaque composant s'abonne
> indépendamment. C'est le pattern **Observer** appliqué à un jeu.

---

## 4. Moteur de jeu

### 4.1 - DiceRoller

```java
public class DiceRoller {
    private final Random random = new Random();

    public int roll(int faces)              { return random.nextInt(faces) + 1; }
    public int roll(int nombre, int faces)  {
        return IntStream.range(0, nombre).map(i -> roll(faces)).sum();
    }
    public int rollWithAdvantage(int faces) { return Math.max(roll(faces), roll(faces)); }
    public int rollWithDisadvantage(int faces){ return Math.min(roll(faces), roll(faces)); }

    // Raccourcis sémantiques
    public int d4()  { return roll(4);  }
    public int d6()  { return roll(6);  }
    public int d8()  { return roll(8);  }
    public int d10() { return roll(10); }
    public int d12() { return roll(12); }
    public int d20() { return roll(20); }
}
```

### 4.2 - CombatResolver

Séquence complète d'un round de combat :

```
1. Calculer l'initiative de tous les participants (1d20 + mod DEX)
2. Trier par initiative décroissante
3. Pour chaque combattant dans l'ordre :
   a. Vérifier s'il est en vie
   b. Si joueur → afficher les options (Attaquer / Sort / Objet / Fuir)
   c. Si ennemi → décision IA (attaque simple en V1, comportements en V2)
   d. Résoudre l'action choisie
   e. Appliquer les effets (dégâts, états, sorts)
   f. Vérifier fin de combat (tous ennemis morts OU joueur mort OU fuite)
4. Distribuer XP si victoire
5. Retourner le résultat au GameEngine
```

### 4.3 - Bestiaire de base (niveaux 1-5)

| Monstre | ID | PV | CA | Attaque | Dégâts | XP |
|---------|----|----|-----|---------|--------|-----|
| Kobold | 1/8 | 5 | 12 | +4 | 1d4+2 | 25 |
| Gobelin | 1/4 | 7 | 15 | +4 | 1d6+2 | 50 |
| Zombie | 1/4 | 22 | 8 | +3 | 1d6+1 | 50 |
| Squelette | 1/4 | 13 | 13 | +4 | 1d6+2 | 50 |
| Orque | 1/2 | 15 | 13 | +5 | 1d12+3 | 100 |
| Loup-garou | 3 | 58 | 12 | +5 | 2d6+3 | 700 |
| Troll | 5 | 84 | 15 | +7 | 2d6+4 | 1800 |
| Dragon (jeune) | 7 | 178 | 18 | +10 | 2d10+6 | 2900 |

> ⚠️ **Droits d'auteur sur le bestiaire D&D**
> Les statistiques des monstres D&D 5e sont publiées sous la licence OGL (Open Game License)
> de Wizards of the Coast - elles sont librement utilisables dans un projet non commercial.
> Si le projet devient commercial, il faudra vérifier la licence CC BY 4.0 du SRD 5.1 publié en 2023.

---

## 5. Génération procédurale de donjons

### 5.1 - Algorithme BSP (Binary Space Partitioning)

C'est l'algorithme utilisé par les vrais roguelikes (NetHack, Diablo...). Il produit des donjons avec des salles bien séparées et des couloirs naturels.

**Principe :**
1. Partir d'un rectangle représentant tout l'espace du donjon
2. Couper ce rectangle en deux (horizontal ou vertical) de manière aléatoire
3. Répéter récursivement sur chaque sous-rectangle jusqu'à atteindre une taille minimale
4. Dans chaque feuille de l'arbre : placer une salle (plus petite que le sous-rectangle)
5. Relier les salles frères par des couloirs
6. Remonter l'arbre en reliant les couloirs

**Résultat** : un donjon avec 8 à 15 salles bien réparties, reliées par des couloirs, sans salles qui se superposent.

### 5.2 - Structure d'un niveau

```
NiveauDonjon
├── grille : Case[largeur][hauteur]   ← Grille de tuiles
├── salles : List<Salle>              ← Toutes les salles
├── couloirs : List<Couloir>          ← Tous les couloirs
├── entree : Point                    ← Position de départ du joueur
├── sortie : Point                    ← Escalier vers le niveau suivant
├── ennemis : List<Ennemi>            ← Ennemis placés aléatoirement
└── items : List<Item>                ← Objets et coffres
```

### 5.3 - Difficulté croissante par niveau

| Niveau donjon | Ennemis | ID moyen | Pièges | Boss |
|---------------|---------|----------|--------|------|
| 1 | Kobolds, Gobelins | 1/8 – 1/4 | Non | Non |
| 2 | Gobelins, Zombies | 1/4 – 1/2 | Rares | Non |
| 3 | Orques, Squelettes | 1/2 – 1 | Oui | Non |
| 4 | Orques, Goules | 1 – 2 | Oui | Mini-boss |
| 5 | Loups-garous | 2 – 3 | Oui | Boss niveau |
| 6–10 | Monstres avancés | 3+ | Nombreux | Boss niveau |

### 5.4 - Types de salles

- **Salle ordinaire** : ennemis + items aléatoires
- **Salle du trésor** : coffre verrouillé, contenu de valeur, gardien
- **Salle de repos** : récupérer des PV (repos court), pas d'ennemi
- **Salle du boss** : boss unique, récompense importante, accès à l'escalier
- **Salle secrète** : cachée, accessible via un passage secret, loot rare

---

## 6. Interface graphique JavaFX

### 6.1 - Écrans principaux

**Écran 1 - Menu principal**
- Titre du jeu avec animation pixel art
- Options : Nouvelle partie / Continuer / Paramètres / Quitter
- Musique MIDI de fond

**Écran 2 - Création de personnage**
- Sélection de la race (avec description et bonus)
- Sélection de la classe (avec description, dé de vie, capacités)
- Génération des attributs (Standard Array ou 4d6)
- Distribution des attributs aux 6 scores
- Saisie du nom
- Aperçu du sprite du personnage
- Résumé avant confirmation

**Écran 3 - Jeu principal**

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐  ┌─────────────┐ │
│  │                                      │  │   STATS     │ │
│  │        VUE ISOMÉTRIQUE               │  │  PV: 12/12  │ │
│  │         DU DONJON                    │  │  CA: 16     │ │
│  │                                      │  │  FOR: 15    │ │
│  │    [Sprites 64x64 upscalés x3]       │  │  DEX: 12    │ │
│  │                                      │  │  CON: 14    │ │
│  └──────────────────────────────────────┘  │  INT: 8     │ │
│  ┌──────────────────────────────────────┐  │  SAG: 10    │ │
│  │  LOG DE COMBAT                       │  │  CHA: 13    │ │
│  │  > Vous attaquez le Gobelin          │  ├─────────────┤ │
│  │  > 1d20 + 5 = 17 vs CA 15 → Touché  │  │  MINI-MAP   │ │
│  │  > 1d8 + 3 = 7 dégâts infligés      │  │  [carte]    │ │
│  └──────────────────────────────────────┘  └─────────────┘ │
│  [Attaquer] [Sort] [Objet] [Inventaire] [Passer]            │
└─────────────────────────────────────────────────────────────┘
```

**Écran 4 - Combat (overlay)**
- Zoom sur le combat, les deux combattants face à face
- Animation des dés qui roulent (JavaFX AnimationTimer)
- Barres de vie animées
- Log des actions en temps réel
- Options de combat (Attaquer / Sort / Objet / Fuir)

**Écran 5 - Inventaire**
- Grille de slots d'inventaire (style Diablo)
- Équipement du personnage (silhouette avec slots)
- Stats comparatives (équipé vs dans le sac)
- Drag & Drop entre les slots

### 6.2 - Moteur de rendu isométrique

**Conversion coordonnées grille → écran :**

```java
public class IsometricRenderer {
    private static final int TILE_WIDTH  = 192; // 64 * 3 (upscale x3)
    private static final int TILE_HEIGHT = 96;  // 32 * 3

    public Point2D gridToScreen(int gridX, int gridY) {
        double screenX = (gridX - gridY) * (TILE_WIDTH / 2.0);
        double screenY = (gridX + gridY) * (TILE_HEIGHT / 2.0);
        return new Point2D(screenX, screenY);
    }

    public Point2D screenToGrid(double screenX, double screenY) {
        double gridX = (screenX / (TILE_WIDTH / 2.0) + screenY / (TILE_HEIGHT / 2.0)) / 2.0;
        double gridY = (screenY / (TILE_HEIGHT / 2.0) - screenX / (TILE_WIDTH / 2.0)) / 2.0;
        return new Point2D(Math.round(gridX), Math.round(gridY));
    }
}
```

**Z-ordering (profondeur) :**
Les sprites doivent être dessinés dans l'ordre de profondeur pour que les objets "devant" s'affichent correctement.
```java
// Trier les entités par (gridX + gridY) croissant avant de dessiner
entites.sort(Comparator.comparingInt(e -> e.getGridX() + e.getGridY()));
```

### 6.3 - Animation des dés

L'animation est un élément central de l'expérience rétro.

Séquence d'animation pour un jet de d20 :
1. Le dé apparaît au centre de l'écran (scale 0 → 1, 200ms)
2. Il tourne rapidement en affichant des faces aléatoires (500ms)
3. Il ralentit progressivement (300ms)
4. Il s'arrête sur le résultat final (200ms pause)
5. Le résultat s'affiche dans le log de combat
6. Le dé disparaît (scale 1 → 0, 200ms)

```java
public class DiceAnimator {
    public void animate(Canvas canvas, int faces, int result, Runnable onComplete) {
        // AnimationTimer JavaFX pour 60fps
        // Interpolation easeOut pour le ralentissement
        // Callback onComplete pour déclencher la résolution du combat
    }
}
```

### 6.4 - Style visuel

**Palette de couleurs (inspiration Diablo 1) :**

| Élément | Couleur HEX |
|---------|-------------|
| Fond donjon | `#1A1A2E` |
| Pierre mur | `#3D2B1F` |
| Pierre sol | `#2C2416` |
| Or / trésor | `#FFD700` |
| Sang / dégâts | `#8B0000` |
| Magie / sorts | `#6A0DAD` |
| Texte principal | `#E8DCC8` |
| Texte critique | `#FF4500` |
| Interface pierre | `#4A3728` |

**Police de caractères :**
- Texte de jeu : police bitmap pixel art (ex: `Press Start 2P` - libre de droits, Google Fonts)
- Log de combat : police monospace pixelisée

**CSS JavaFX :**
```css
.root {
    -fx-font-family: "Press Start 2P";
    -fx-base: #1A1A2E;
    -fx-background: #1A1A2E;
}

.button {
    -fx-background-color: #4A3728;
    -fx-text-fill: #E8DCC8;
    -fx-border-color: #8B6914;
    -fx-border-width: 2px;
}

.button:hover {
    -fx-background-color: #6B5040;
}
```

---

## 7. Système de sauvegarde

### 7.1 - SQLite via JDBC

**Dépendance Maven :**
```xml
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.45.0.0</version>
</dependency>
```

**Schéma de la base :**

```sql
-- Personnages sauvegardés
CREATE TABLE personnage (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    nom          TEXT NOT NULL,
    race         TEXT NOT NULL,
    classe       TEXT NOT NULL,
    niveau       INTEGER DEFAULT 1,
    experience   INTEGER DEFAULT 0,
    pv_max       INTEGER NOT NULL,
    pv_actuels   INTEGER NOT NULL,
    for_score    INTEGER NOT NULL,
    dex_score    INTEGER NOT NULL,
    con_score    INTEGER NOT NULL,
    int_score    INTEGER NOT NULL,
    sag_score    INTEGER NOT NULL,
    cha_score    INTEGER NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Parties en cours
CREATE TABLE partie (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    personnage_id    INTEGER REFERENCES personnage(id),
    niveau_donjon    INTEGER DEFAULT 1,
    seed_donjon      INTEGER NOT NULL,    ← Graine pour régénérer le donjon
    position_x       INTEGER NOT NULL,
    position_y       INTEGER NOT NULL,
    statut           TEXT DEFAULT 'EN_COURS',
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventaire
CREATE TABLE inventaire (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    personnage_id INTEGER REFERENCES personnage(id),
    item_type     TEXT NOT NULL,
    item_nom      TEXT NOT NULL,
    item_data     TEXT NOT NULL,    ← JSON des propriétés de l'item
    slot          INTEGER,          ← null = sac, 0-5 = équipé
    quantite      INTEGER DEFAULT 1
);
```

> 🏗️ **Pourquoi stocker une seed pour le donjon ?**
> Plutôt que de sauvegarder toute la grille (potentiellement énorme),
> on sauvegarde juste la graine aléatoire utilisée pour la générer.
> En chargeant la partie, on régénère exactement le même donjon
> avec `new Random(seed)`. C'est la technique utilisée par Minecraft.

### 7.2 - Pattern DAO

```java
public interface PersonnageRepository {
    void save(Personnage p);
    Optional<Personnage> findById(int id);
    List<Personnage> findAll();
    void update(Personnage p);
    void delete(int id);
}

public class PersonnageRepositorySQLite implements PersonnageRepository {
    // Implémentation JDBC SQLite
}

// Évolution future vers PostgreSQL :
public class PersonnageRepositoryPostgres implements PersonnageRepository {
    // Même interface, driver différent - le reste du code ne change pas
}
```

---

## 8. Assets visuels et sonores

### 8.1 - Sprites recommandés (libres de droits)

| Source | Contenu | Licence |
|--------|---------|---------|
| OpenGameArt.org | Tilesets isométriques donjon | CC0 / CC-BY |
| itch.io (catégorie free) | Sprites personnages, monstres | Variable - vérifier |
| Kenney.nl | UI, icônes d'items, effets | CC0 (domaine public) |
| 0x72 sur itch.io | Dungeon tileset 16x16 | CC0 |

**Recherche recommandée sur OpenGameArt :**
- "isometric dungeon tileset"
- "RPG character sprites isometric"
- "pixel art monster sprites"

### 8.2 - Génération IA pour personnaliser

Une fois le moteur fonctionnel, générer des sprites cohérents avec **Leonardo.ai** (plan gratuit) :

```
Prompt type pour sprites personnage :
"isometric RPG character sprite, [classe], pixel art, 64x64,
dark fantasy, transparent background, Diablo 1 style,
consistent lighting from top-right, limited color palette"

Prompt type pour tuiles donjon :
"isometric dungeon floor tile, stone, pixel art, 64x32,
dark fantasy, seamless, Ultima Online style, muted colors"
```

> ⚠️ Toujours upscaler les sprites x3 en JavaFX avec `imageView.setSmooth(false)` pour
> conserver le rendu pixel art net (pas de lissage bilinéaire).

### 8.3 - Audio

**Musique :**
- Format : MIDI ou OGG (JavaFX supporte les deux)
- Style : chiptune sombre, tempos lents pour l'exploration, rapides pour le combat
- Source gratuite : incompetech.com (Kevin MacLeod - CC-BY) ou opengameart.org

**Effets sonores :**
- Coup d'épée, sort lancé, porte qui grince, pièces d'or, montée de niveau
- Source : freesound.org (CC0) ou kenney.nl (Game Audio pack)

---

## 9. Roadmap de développement

### Phase 1 - Moteur de règles (sans UI) *(~1 semaine)*

- [ ] DiceRoller avec tous les dés
- [ ] Système d'attributs et modificateurs
- [ ] Création de personnage (toutes classes et races)
- [ ] Moteur de combat complet (initiative, attaque, dégâts, CA, sorts)
- [ ] Système d'XP et montée de niveau
- [ ] Tests JUnit exhaustifs sur toute la logique de règles

> 💡 Commencer sans UI permet de valider les règles rapidement et de les tester unitairement.
> C'est exactement la philosophie du Projet 1 - le moteur d'abord, l'affichage ensuite.

### Phase 2 - Génération de donjon *(~1 semaine)*

- [ ] Algorithme BSP
- [ ] Structure NiveauDonjon / Salle / Case
- [ ] Placement des ennemis et items selon la difficulté
- [ ] Placement de l'entrée, de la sortie, des salles spéciales
- [ ] Tests de génération (vérifier connexité, proportions)

### Phase 3 - Rendu isométrique *(~1 semaine)*

- [ ] IsometricRenderer (conversion coordonnées)
- [ ] Chargement et affichage des sprites (SpriteManager)
- [ ] Z-ordering correct
- [ ] Déplacement du personnage (clic sur une case)
- [ ] Scrolling de la caméra centré sur le joueur
- [ ] Affichage de la mini-map

### Phase 4 - Interface complète *(~1 semaine)*

- [ ] Écran de création de personnage
- [ ] Panneau de stats
- [ ] Inventaire avec drag & drop
- [ ] Log de combat
- [ ] Animation des dés
- [ ] Animations de combat (sprites)
- [ ] CSS pixel art complet

### Phase 5 - Sauvegarde et polish *(~1 semaine)*

- [ ] Base SQLite + repositories DAO
- [ ] Sauvegarde/chargement de partie
- [ ] Menu principal avec musique
- [ ] Paramètres (volume, résolution)
- [ ] Plusieurs niveaux de donjon avec difficulté croissante
- [ ] Boss par niveau

---

## 10. Évolutions futures

### Vers le multijoueur

L'architecture est conçue pour évoluer. Le `TurnManager` gère déjà une `List<Personnage>`.
Pour passer en multijoueur local (même machine) :
- Ajouter plusieurs personnages à la liste
- L'UI affiche les stats de chaque joueur
- À chaque tour, mettre en surbrillance le joueur actif

Pour le multijoueur en ligne (Projet 3 territory) :
- Extraire le `GameEngine` dans un backend Java/Spring Boot
- Remplacer les actions locales par des appels WebSocket
- L'interface JavaFX devient un client réseau

### Vers PostgreSQL

Remplacer `PersonnageRepositorySQLite` par `PersonnageRepositoryPostgres`.
Le reste du code ne change pas - c'est la puissance du pattern DAO.

### Contenu additionnel

- Niveaux 11-20 de D&D 5e
- Nouvelles classes et races (Artificier, Aasimar...)
- Campagne narrative avec PNJ et dialogues
- Objets magiques légendaires
- Modes de difficulté (Permadeath roguelike)

---

*Document de spécifications - Projet 2 D&D Graphique*
*Java 17 + JavaFX | Pixel Art Isométrique | Roguelike D&D 5e*
*À réviser selon les retours du développement*
