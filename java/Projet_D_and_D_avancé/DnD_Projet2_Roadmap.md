# Feuille de route - Projet 2 D&D Graphique
**De zéro à un jeu jouable**
Java 17 + JavaFX | Pixel Art Isométrique | Roguelike D&D 5e

---

## Vue d'ensemble

```
PHASE 0          PHASE 1          PHASE 2          PHASE 3
Préparation  →   Moteur règles →  Donjon       →   Interface
(documents)      (pur Java)       (génération)     (JavaFX)

    │                │                │                │
  ~1 sem           ~1 sem           ~1 sem           ~1 sem

PHASE 4          PHASE 5          PHASE 6
Sauvegarde   →   Polish       →   Portfolio
(SQLite)         (assets/son)     (démo)

    │                │                │
  ~1 sem           ~1 sem           ~3 jours

                              Total estimé : ~6-7 semaines
```

---

## Phase 0 - Préparation et documentation

> **Objectif** : avoir tous les documents nécessaires avant d'écrire une ligne de code.
> Ne pas sauter cette phase - elle évite de réécrire du code en cours de route.

---

### Étape 0.1 - Documents de conception

- [ ] **Diagramme de classes UML complet**
  - Toutes les classes et interfaces du package `core/`
  - Hiérarchies d'héritage (Personnage, Ennemi, Item, Case)
  - Relations entre modules (dépendances, associations, compositions)
  - Outil recommandé : draw.io (gratuit, exportable en PNG/SVG)

- [ ] **Schéma ERD de la base SQLite**
  - Tables : `personnage`, `partie`, `inventaire`
  - Clés primaires, clés étrangères, types de colonnes
  - Outil recommandé : draw.io ou DBeaver (génération automatique)

- [ ] **Wireframes des 5 écrans JavaFX**
  - Écran 1 : Menu principal
  - Écran 2 : Création de personnage
  - Écran 3 : Jeu principal (vue isométrique + HUD)
  - Écran 4 : Combat (overlay)
  - Écran 5 : Inventaire
  - Outil recommandé : draw.io, Figma (gratuit) ou même papier/crayon

- [ ] **Checklist des règles D&D 5e - V1 vs V2**
  - Définir exactement ce qui est dans le scope V1 (jouable)
  - Définir ce qui est reporté en V2 (évolutions)
  - Voir détail en section "Checklist D&D 5e" ci-dessous

---

### Étape 0.2 - Setup du projet

- [ ] Créer le repository GitHub `dnd-java-graphique`
- [ ] Initialiser le projet Maven dans IntelliJ
  ```
  Group ID    : fr.campus
  Artifact ID : dnd-graphique
  Version     : 1.0-SNAPSHOT
  ```
- [ ] Configurer `pom.xml` avec les dépendances :
  - JavaFX 17 (`javafx-controls`, `javafx-fxml`, `javafx-media`)
  - SQLite JDBC (`org.xerial:sqlite-jdbc:3.45.0.0`)
  - JUnit 5 (`junit-jupiter:5.10.0`)
  - Mockito (`mockito-core:5.8.0`)
- [ ] Créer la structure de packages vide (tous les dossiers)
- [ ] Configurer le `.gitignore` (target/, *.db, *.iml)
- [ ] Premier commit : "Initial project structure"

---

### Checklist D&D 5e - V1 vs V2

#### ✅ V1 - Implémenté dès le départ

**Personnage**
- [ ] Les 6 attributs (FOR, DEX, CON, INT, SAG, CHA) + modificateurs
- [ ] Génération par Standard Array (15,14,13,12,10,8)
- [ ] Les 12 classes avec dé de vie et attribut principal
- [ ] Toutes les races avec bonus d'attributs
- [ ] Points de vie (calcul niveau 1 + montée de niveau)
- [ ] Classe d'Armure (sans armure, légère, intermédiaire, lourde, bouclier)
- [ ] Bonus de maîtrise par niveau
- [ ] Jets de sauvegarde maîtrisés par classe
- [ ] Progression niveaux 1 à 10 + table XP

**Combat**
- [ ] Initiative (1d20 + mod DEX)
- [ ] Jet d'attaque (1d20 + bonus maîtrise + mod attribut vs CA)
- [ ] Coup critique (20 naturel = dés de dégâts doublés)
- [ ] Avantage et Désavantage (2d20, garder max/min)
- [ ] Action, Déplacement par tour
- [ ] Sorts de niveau 1 à 5 (emplacements limités)
- [ ] Repos court (récupérer quelques PV) et repos long (tout récupérer)

**Dés**
- [ ] d4, d6, d8, d10, d12, d20, d100
- [ ] Lancer multiple (ex : 2d6, 4d6)
- [ ] Avantage / Désavantage

#### 🔄 V2 - Reporté après la V1 jouable

**Combat avancé**
- [ ] Action bonus (certaines classes)
- [ ] Réaction et Attaque d'opportunité
- [ ] Concentration sur les sorts
- [ ] Conditions (Empoisonné, Étourdi, Paralysé, etc.)
- [ ] Résistances et immunités aux dégâts
- [ ] Multiattaque (niveau 5+)

**Personnage avancé**
- [ ] Génération 4d6 drop lowest
- [ ] Capacités de sous-classe (Archétype au niveau 3)
- [ ] Dons (niveau 4, 8...)
- [ ] Langues et compétences détaillées
- [ ] Historiques (Background)

**Magie avancée**
- [ ] Sorts de niveau 6 à 9
- [ ] Métamagie (Ensorceleur)
- [ ] Sorts rituels
- [ ] Sorts de concentration avec jets de sauvegarde

---

## Phase 1 - Moteur de règles (pur Java, sans UI)

> **Objectif** : un moteur de règles D&D 5e complet, testé, sans aucune interface graphique.
> **Principe** : valider les règles avec des tests JUnit avant de toucher à JavaFX.
> **Durée estimée** : 1 semaine

---

### Étape 1.1 - DiceRoller

- [ ] Classe `DiceRoller` avec `d4()`, `d6()`, `d8()`, `d10()`, `d12()`, `d20()`
- [ ] Méthode `roll(int nombre, int faces)` pour les lancers multiples
- [ ] `rollWithAdvantage(int faces)` et `rollWithDisadvantage(int faces)`
- [ ] Tests JUnit :
  - Résultat toujours dans [1, faces]
  - Avantage ≥ jet simple en moyenne (test statistique sur 10 000 lancers)
  - Désavantage ≤ jet simple en moyenne

### Étape 1.2 - Attributs et modificateurs

- [ ] Classe `AbilityScores` avec les 6 attributs
- [ ] Méthode `getModifier(int score)` → `(score - 10) / 2`
- [ ] Méthode `generateStandardArray()` → `[15, 14, 13, 12, 10, 8]`
- [ ] Tests JUnit :
  - Score 10 → modifier 0
  - Score 8 → modifier -1
  - Score 15 → modifier +2
  - Score 20 → modifier +5

### Étape 1.3 - Races

- [ ] Interface `Race` avec `getBonusAttributs()` et `getTraitsRaciaux()`
- [ ] Implémenter les 9+ races officielles
- [ ] Tests JUnit :
  - Haut-Elfe → +2 DEX, +1 INT
  - Nain des collines → +2 CON, +1 SAG
  - Bonus correctement appliqués aux AttributsPersonnage

### Étape 1.4 - Classes de personnage

- [ ] Interface `ClassePersonnage` (Strategy pattern)
  - `getDéDeVie()`, `getAttributPrincipal()`, `getJetsDeSauvegardeMaitrises()`
  - `appliquerCapacitesDeDepart(Personnage p)`
- [ ] Implémenter les 12 classes
- [ ] Tests JUnit :
  - Guerrier → d10, jets de sauvegarde FOR + CON
  - Mage → d6, jets de sauvegarde INT + SAG
  - Calcul PV max niveau 1 correct pour chaque classe

### Étape 1.5 - Personnage complet

- [ ] Classe abstraite `Personnage` avec tous les attributs
- [ ] Classes concrètes `JoueurPersonnage` et `PersonnageNonJoueur`
- [ ] Méthode `calculerPVMax()` → dé de vie max + mod CON
- [ ] Méthode `calculerCA(Armure armure)` selon le type d'armure
- [ ] Méthode `getBonusMaitrise()` selon le niveau
- [ ] Méthode `monterDeNiveau()` → incrementer niveau, recalculer stats
- [ ] Tests JUnit :
  - Guerrier niveau 1 CON 14 → PV max = 12
  - Mage niveau 5 → bonus maîtrise = +3
  - Montée niveau 4 → bonus maîtrise reste +2

### Étape 1.6 - Système de sorts

- [ ] Classe `Sort` avec niveau, école, composantes, durée, portée
- [ ] Classe `EmplacementsSorts` - slots par niveau selon la classe
- [ ] Méthode `lancerSort(Sort s, int niveauEmplacement)` - consomme un slot
- [ ] Méthode `reposCourt()` et `reposLong()` - récupération des slots
- [ ] Tests JUnit :
  - Mage niveau 3 → 4 emplacements niveau 1, 2 emplacements niveau 2
  - Lancer un sort consomme bien le slot
  - Repos long récupère tous les slots

### Étape 1.7 - CombatResolver

- [ ] Méthode `calculerInitiative(Personnage p)` → 1d20 + mod DEX
- [ ] Méthode `jetDAttaque(Personnage attaquant, Personnage cible)` → résultat vs CA
- [ ] Méthode `calculerDegats(Arme arme, Personnage attaquant)` → dés + mod
- [ ] Méthode `coupCritique(Arme arme, Personnage attaquant)` → dés doublés
- [ ] Méthode `resoudreRound(List<Personnage> combattants)` → un round complet
- [ ] Tests JUnit :
  - Attaque avec résultat 20 → toujours touché
  - Attaque avec résultat 1 → toujours raté
  - Coup critique → dégâts doublés
  - Initiative trie correctement les combattants

### Étape 1.8 - Items et inventaire

- [ ] Interface `Item` avec `getNom()`, `getDescription()`, `getPoids()`
- [ ] Classes `Arme`, `Armure`, `Potion`, `ItemMagique`
- [ ] Classe `Inventaire` avec slots limités
- [ ] Méthode `equiper(Item item)` - applique les bonus au personnage
- [ ] Méthode `utiliserPotion(Potion p)` - restaure des PV
- [ ] Tests JUnit :
  - Équiper une épée longue → bonus attaque appliqué
  - Boire potion de soin → PV restaurés dans la limite du max

---

## Phase 2 - Génération procédurale de donjons

> **Objectif** : un générateur de donjon fonctionnel, visualisable en console avant JavaFX.
> **Durée estimée** : 1 semaine

---

### Étape 2.1 - Structure de données du donjon

- [ ] Enum `TypeCase` : `MUR`, `SOL`, `PORTE`, `ESCALIER_HAUT`, `ESCALIER_BAS`, `VIDE`
- [ ] Classe `Case` avec type, contenu (ennemi ou item), coordonnées
- [ ] Classe `Salle` avec rectangle (x, y, largeur, hauteur) et type de salle
- [ ] Classe `NiveauDonjon` avec grille `Case[][]`, liste des salles, entrée, sortie
- [ ] Classe `Donjon` avec liste des niveaux et niveau courant

### Étape 2.2 - Algorithme BSP

- [ ] Classe `BSPGenerator` implémentant `DonjonGenerator`
- [ ] `diviser(Rectangle espace, int profondeur)` - division récursive
- [ ] `creerSalle(Rectangle espace)` - salle dans un sous-espace
- [ ] `connecterSalles(Salle a, Salle b)` - couloir en L entre deux salles
- [ ] `generer(int largeur, int hauteur, long seed)` - méthode principale
- [ ] Affichage console du donjon généré (debug) :
  ```
  ####################
  #....#.....#.......#
  #....+.....+.......#
  #....#.....#...@...#
  ####################
  ```
  `#` = mur, `.` = sol, `+` = porte, `@` = joueur, `>` = sortie

### Étape 2.3 - Placement du contenu

- [ ] `EnnemiFactory.creerEnnemis(int niveauDonjon)` - ennemis selon la difficulté
- [ ] `ItemFactory.creerItems(int niveauDonjon)` - items selon la difficulté
- [ ] Méthode `peupler(NiveauDonjon niveau)` - placer ennemis et items dans les salles
- [ ] Salle du boss au dernier niveau (boss unique + escalier vers niveau suivant)
- [ ] Tests JUnit :
  - Le donjon généré avec une seed fixe est toujours identique
  - Toutes les salles sont accessibles (test de connexité BFS)
  - Entrée et sortie existent et sont dans des salles différentes

### Étape 2.4 - Difficulté par niveau

- [ ] Table de difficulté (ennemis par niveau de donjon)
- [ ] Méthode `ajusterDifficulte(int niveauDonjon)` dans `EnnemiFactory`
- [ ] Tests JUnit :
  - Niveau 1 → pas de Dragon
  - Niveau 5 → boss présent
  - Nombre d'ennemis croissant avec le niveau

---

## Phase 3 - Interface graphique JavaFX

> **Objectif** : connecter le moteur de jeu à une interface isométrique pixel art.
> **Durée estimée** : 1 semaine
> **Prérequis** : wireframes validés (Phase 0)

---

### Étape 3.1 - Setup JavaFX

- [ ] Créer `DndApp.java` étendant `Application`
- [ ] Configurer les VM options dans IntelliJ (`--module-path`, `--add-modules`)
- [ ] Créer la structure des fichiers FXML dans `resources/view/`
- [ ] Créer le fichier CSS principal `resources/css/dnd.css`
- [ ] Charger la police `Press Start 2P` depuis Google Fonts
- [ ] Vérifier qu'une fenêtre vide s'ouvre correctement

### Étape 3.2 - SpriteManager

- [ ] Classe `SpriteManager` (Singleton) pour charger et cacher les sprites
- [ ] Méthode `loadSprite(String path)` → `Image` JavaFX
- [ ] Méthode `getSprite(String nom)` → depuis le cache
- [ ] Upscale x3 avec `setSmooth(false)` pour effet pixel art net
- [ ] Chargement des tilesets de base (tuiles donjon, personnage, ennemis)

### Étape 3.3 - IsometricRenderer

- [ ] Classe `IsometricRenderer` avec Canvas JavaFX
- [ ] Méthodes `gridToScreen()` et `screenToGrid()` (formules isométriques)
- [ ] Méthode `drawTile(GraphicsContext gc, int gridX, int gridY, Image sprite)`
- [ ] Méthode `drawLevel(NiveauDonjon niveau)` - rendre tout le niveau
- [ ] Z-ordering correct (tri par gridX + gridY)
- [ ] Déplacement de la caméra (centrer sur le joueur)
- [ ] Highlight de la case survolée par la souris

### Étape 3.4 - Écran de création de personnage

- [ ] `CreationController.java` + `creation.fxml`
- [ ] Sélection de la race (ListView avec description)
- [ ] Sélection de la classe (ListView avec description, dé de vie, capacités)
- [ ] Distribution des attributs Standard Array (drag & drop ou boutons)
- [ ] Aperçu du sprite du personnage selon race/classe
- [ ] Saisie du nom
- [ ] Résumé complet avant validation
- [ ] Bouton "Commencer l'aventure" → créer le Personnage et lancer le jeu

### Étape 3.5 - Écran de jeu principal

- [ ] `JeuController.java` + `jeu.fxml`
- [ ] Canvas isométrique (zone centrale)
- [ ] `StatPanel` à droite (PV, CA, attributs, niveau, XP)
- [ ] `MiniMap` en bas à droite
- [ ] `CombatLog` en bas (TextArea scrollable)
- [ ] Boutons d'action en bas : Attendre / Inventaire / Capacités / Sauvegarder
- [ ] Déplacement au clic sur une case (pathfinding simple A*)
- [ ] Interaction automatique avec les ennemis (déclenche le combat)
- [ ] Interaction avec les items (ramasser automatiquement ou confirmer)

### Étape 3.6 - Écran de combat

- [ ] `CombatController.java` + `combat.fxml` (overlay sur le jeu)
- [ ] Affichage des deux combattants face à face avec leurs sprites
- [ ] Barres de vie animées (transition JavaFX)
- [ ] Zone de log de combat en temps réel
- [ ] Boutons : Attaquer / Lancer un sort / Utiliser un objet / Fuir
- [ ] Sélection de l'arme ou du sort à utiliser
- [ ] `DiceAnimator` : animation des dés avant résolution
- [ ] Animation de coup (sprite qui "tremble")
- [ ] Affichage du résultat : touché / raté / critique

### Étape 3.7 - Écran d'inventaire

- [ ] `InventaireController.java` + `inventaire.fxml`
- [ ] Grille de slots d'inventaire (style Diablo)
- [ ] Silhouette du personnage avec slots d'équipement
- [ ] Glisser-déposer entre sac et équipement
- [ ] Tooltip au survol : stats de l'item
- [ ] Comparaison équipé vs sélectionné
- [ ] Bouton "Utiliser" pour les potions

### Étape 3.8 - Menu principal

- [ ] `MenuController.java` + `menu.fxml`
- [ ] Titre animé en pixel art
- [ ] Boutons : Nouvelle partie / Continuer / Quitter
- [ ] Musique MIDI en fond
- [ ] Animation de fond (flammes, particules pixelisées)

---

## Phase 4 - Sauvegarde SQLite

> **Objectif** : persister les parties et personnages entre les sessions.
> **Durée estimée** : 3-4 jours

---

### Étape 4.1 - DatabaseManager

- [ ] Classe `DatabaseManager` (Singleton)
- [ ] Connexion SQLite : `jdbc:sqlite:dnd_saves.db`
- [ ] Méthode `initialize()` - créer les tables si elles n'existent pas
- [ ] Migration schema (versionning de la BDD)
- [ ] Fermeture propre de la connexion à la sortie du jeu

### Étape 4.2 - Repositories DAO

- [ ] `PersonnageRepository` : `save()`, `findById()`, `findAll()`, `update()`, `delete()`
- [ ] `PartieRepository` : `save()`, `findByPersonnageId()`, `update()`
- [ ] `InventaireRepository` : `saveItems()`, `findByPersonnageId()`, `updateSlot()`
- [ ] Tests JUnit :
  - Sauvegarder un personnage → le relire → attributs identiques
  - Sauvegarder une partie avec seed → régénérer le donjon → identique

### Étape 4.3 - Intégration dans le jeu

- [ ] Sauvegarde automatique à chaque descente de niveau
- [ ] Sauvegarde manuelle (bouton dans le HUD)
- [ ] Chargement depuis le menu "Continuer"
- [ ] Confirmation avant d'écraser une sauvegarde existante

---

## Phase 5 - Assets, sons et polish

> **Objectif** : habiller le jeu avec les vrais assets visuels et sonores.
> **Durée estimée** : 1 semaine

---

### Étape 5.1 - Assets visuels

- [ ] Télécharger un tileset isométrique donjon sur OpenGameArt (CC0)
- [ ] Télécharger sprites personnages (un par classe ou par archétype)
- [ ] Télécharger sprites ennemis (Gobelin, Orque, Dragon minimum)
- [ ] Télécharger icônes d'items (armes, armures, potions)
- [ ] Vérifier la cohérence visuelle (même style, même perspective)
- [ ] Optionnel : générer des sprites custom avec Leonardo.ai

### Étape 5.2 - Audio

- [ ] Musique menu principal (MIDI ou OGG)
- [ ] Musique exploration donjon (ambiance sombre)
- [ ] Musique combat (rythme plus rapide)
- [ ] Effets sonores : coup d'épée, sort lancé, porte, PV perdus, montée de niveau
- [ ] Contrôle du volume dans les paramètres

### Étape 5.3 - Polish UI

- [ ] CSS complet avec palette Diablo (voir specs)
- [ ] Transitions entre les écrans (fondu enchaîné)
- [ ] Tooltips sur tous les éléments interactifs
- [ ] Messages d'erreur et confirmations stylisés
- [ ] Écran de Game Over (pixel art, musique triste)
- [ ] Écran de victoire (boss vaincu, musique épique)
- [ ] Écran de montée de niveau (animation, choix des stats)

### Étape 5.4 - Paramètres

- [ ] Volume musique (slider)
- [ ] Volume effets sonores (slider)
- [ ] Taille de la fenêtre / plein écran
- [ ] Vitesse des animations (normale / rapide / instantané)
- [ ] Sauvegarde des préférences (fichier `.properties`)

---

## Phase 6 - Portfolio et démo

> **Objectif** : préparer le projet pour le portfolio et le rendre partageable.
> **Durée estimée** : 3 jours

---

### Étape 6.1 - README GitHub

- [ ] Description du projet (concept, screenshots, GIF de gameplay)
- [ ] Stack technique et justifications
- [ ] Instructions d'installation et de lancement
- [ ] Captures d'écran de chaque écran principal
- [ ] GIF animé du combat avec les dés
- [ ] Section "Architecture" avec le diagramme UML
- [ ] Section "Évolutions futures"

### Étape 6.2 - Packaging

- [ ] Créer un JAR exécutable (`mvn package`)
- [ ] Tester le JAR sur une machine sans IntelliJ
- [ ] Optionnel : créer un installeur natif avec `jpackage` (Windows .exe, macOS .dmg)
- [ ] Déposer le JAR dans les releases GitHub

### Étape 6.3 - Démo vidéo

- [ ] Enregistrer une session de jeu (3-5 minutes)
  - Création d'un personnage Mage Elfe
  - Exploration d'un niveau de donjon
  - Un combat avec animation des dés
  - Ramassage d'un item
  - Montée de niveau
- [ ] Uploader sur YouTube (non listé) ou GitHub
- [ ] Lien dans le README et sur Malt

---

## Récapitulatif des livrables

| Phase | Livrable principal | Validation |
|-------|-------------------|------------|
| 0 | Diagramme UML + ERD + Wireframes + Setup Maven | Tous les documents relus |
| 1 | Moteur de règles D&D 5e + tests JUnit | 100% des tests passent |
| 2 | Générateur BSP + bestiaire + factory | Donjon connexe, seed reproductible |
| 3 | Interface JavaFX complète + rendu isométrique | Partie jouable sans sauvegarde |
| 4 | Sauvegarde SQLite + repositories DAO | Charger/reprendre une partie |
| 5 | Assets pixel art + audio + polish CSS | Expérience visuelle cohérente |
| 6 | README + JAR + démo vidéo | Partageable sur portfolio |

---

## Dépendances entre les phases

```
Phase 0 ──────────────────────────────────────────┐
   (documents + setup)                            │
         │                                        │
         ▼                                        │
Phase 1 ──────────────────┐                       │
   (moteur règles)        │                       │
         │                │                       │
         ▼                ▼                       │
Phase 2               Phase 3 ◄───────────────────┘
   (donjon)            (JavaFX)
         │                │
         └────────┬───────┘
                  ▼
              Phase 4
             (SQLite)
                  │
                  ▼
              Phase 5
              (polish)
                  │
                  ▼
              Phase 6
             (portfolio)
```

> 💡 **Phases 1 et 2 sont parallélisables** : si tu bloques sur le moteur de règles,
> tu peux avancer sur le générateur de donjon en parallèle.
> **Phase 3 dépend des deux** : le rendu isométrique a besoin du donjon (Phase 2)
> et le combat a besoin du moteur (Phase 1).

---

## Risques et points de vigilance

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Rendu isométrique plus complexe que prévu | Élevée | Élevé | Commencer par un rendu 2D simple, passer en iso ensuite |
| Règles D&D 5e trop longues à implémenter | Élevée | Moyen | Respecter la checklist V1/V2, ne pas dériver |
| Assets visuels incohérents | Moyenne | Moyen | Choisir un seul pack dès le départ, ne pas mixer |
| Génération BSP produisant des donjons injouables | Moyenne | Élevé | Tests de connexité systématiques |
| Temps sous-estimé sur le polish | Élevée | Faible | Le polish est en dernière phase, sacrifiable si besoin |

---

## Ordre de démarrage recommandé - Jour 1

1. Relire les specs complètes (document Projet 2)
2. Créer le repository GitHub
3. Initialiser le projet Maven + dépendances
4. Créer la structure de packages vide
5. Écrire le `DiceRoller` et ses tests JUnit
6. Vérifier que tous les tests passent → premier commit

> **Pourquoi commencer par DiceRoller ?**
> C'est la brique la plus petite, la plus testable, et elle débloque immédiatement
> le combat et la création de personnage. Un succès rapide dès le Jour 1 donne
> de l'élan pour la suite.

---

*Feuille de route - Projet 2 D&D Graphique*
*À réviser après chaque phase selon l'avancement réel*
