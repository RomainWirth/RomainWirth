# Projet Donjons & Dragons - Java & POO
**Cahier de formation - Version apprenant**
9 itérations progressives | Java 17+ | Campus Numérique in the Alps

> **Contexte & prérequis**
> Ce projet s'adresse à des apprenants ayant déjà suivi les modules fondamentaux : HTML/CSS, JavaScript, algorithmique, Git/GitHub et Linux. Vous avez donc déjà les réflexes du développeur (terminal, versioning, débogage). Ce cahier introduit Java et la **Programmation Orientée Objet** à travers un projet fil rouge : un jeu Donjons & Dragons en console, enrichi itération par itération.
> Pas de pré-requis Java — tout est introduit progressivement.

---

## Sommaire

1. [Règles du jeu - Référence complète](#0-règles-du-jeu--référence-complète)
2. [Itération 1 - Get Started (Java & IDE)](#itération-1--get-started--java--ide)
3. [Itération 2 - Personnages et plateau simplifié](#itération-2--personnages-et-plateau-simplifié)
4. [Itération 3 - Héritage et classes abstraites](#itération-3--héritage-et-classes-abstraites)
5. [Itération 4 - Plateau complet : ennemis et bonus](#itération-4--plateau-complet--ennemis-et-bonus)
6. [Itération 5 - Gestion des combats](#itération-5--gestion-des-combats)
7. [Itération 6 - Sauvegarde en base de données](#itération-6--sauvegarde-en-base-de-données)
8. [Itération 7 - Remplissage aléatoire du plateau](#itération-7--remplissage-aléatoire-du-plateau)
9. [Itération 8 - Règles avancées (Version 2)](#itération-8--règles-avancées--version-2)
10. [Itération 9 - Interface graphique JavaFX ⭐ Bonus](#itération-9--interface-graphique-javafx--bonus)
11. [Annexe A - Cheat Sheet POO Java](#annexe-a--cheat-sheet-poo-java)
12. [Annexe B - Conventions & bonnes pratiques](#annexe-b--conventions--bonnes-pratiques)

> **Comment utiliser ce document**
> - Chaque itération contient : objectifs, specs, tâches, blocs architecture, placeholders UML.
> - **Java 17+** : sections optionnelles pour apprenants intermédiaires.
> - **Tests JUnit** : sections optionnelles à partir de l'itération 3.
> - Les solutions sont disponibles séparément dans la version formateur.
> - La section **Règles du jeu** (section 0) est votre référence permanente — consultez-la à chaque itération.

---

## 0. Règles du jeu - Référence complète

Cette section est la référence officielle du jeu. Consultez-la à chaque itération.

### Le plateau

- 64 cases numérotées de 1 à 64.
- Chaque case peut être : **vide**, contenir **un ennemi**, ou contenir **une caisse surprise**.
- Une seule case contient un seul élément à la fois.
- Case 1 = départ. Case 64 = arrivée.

### Les personnages

| Personnage | Points de vie | Force d'attaque | Équip. offensif | Équip. défensif |
|------------|---------------|-----------------|-----------------|-----------------|
| Guerrier   | 5 à 10        | 5 à 10          | Arme            | Bouclier        |
| Magicien   | 3 à 6         | 8 à 15          | Sort            | Philtre         |

### Les ennemis

| Ennemi         | PV | Attaque | Cible                                           |
|----------------|----|---------|-------------------------------------------------|
| Gobelin        | 6  | 1       | Tous                                            |
| Sorcier        | 9  | 2       | Tous                                            |
| Dragon         | 15 | 4       | Tous                                            |
| Orc            | 10 | 6       | **Guerriers uniquement** - ignore les Magiciens |
| Mauvais esprit | 15 | 5       | **Magiciens uniquement** - ignore les Guerriers |

> ⚠️ **Cas limites explicites**
> - Un Orc rencontrant un Magicien n'engage pas le combat : la case est traitée comme vide.
> - Un Mauvais esprit rencontrant un Guerrier fait de même.
> - Les PV d'un ennemi sont **persistants** entre les tours : si le joueur repasse, l'ennemi conserve ses blessures.

### Les équipements - Caisses surprises

**Armes (Guerrier uniquement)**

| Arme   | Bonus attaque                           |
|--------|-----------------------------------------|
| Massue | +3                                      |
| Épée   | +5                                      |
| Arc    | +6 vs Dragon / +4 vs autres ennemis     |

**Sorts (Magicien uniquement)**

| Sort          | Bonus attaque                                  |
|---------------|------------------------------------------------|
| Éclair        | +2                                             |
| Boule de feu  | +7                                             |
| Invisibilité  | +8 vs Mauvais esprit / +5 vs autres ennemis    |

**Potions (tous personnages)**

| Potion            | Effet                                              |
|-------------------|----------------------------------------------------|
| Potion standard   | +2 PV (immédiat)                                   |
| Grande potion     | +5 PV (immédiat)                                   |
| Coup de tonnerre  | ×2 attaque pour le **prochain combat uniquement**  |

### Règles de ramassage d'équipement

- L'équipement est ajouté uniquement si le personnage est **compatible** (Guerrier → Arme, Magicien → Sort).
- Les potions sont toujours ramassées automatiquement (effet immédiat).
- **Version de base (IT.2 à IT.7)** : un seul équipement offensif à la fois. Le nouveau remplace l'ancien s'il est plus avantageux.
- **Version avancée (IT.8+)** : inventaire de 2 slots. Si plein, le joueur choisit de remplacer ou d'ignorer.

> ⚠️ Si l'inventaire est plein (version avancée) : afficher les 2 équipements actuels et le nouveau. Proposer : remplacer slot 1 / remplacer slot 2 / ignorer.

### Règles de combat - Version de base

1. Le personnage frappe l'ennemi : `dégâts = forceBase + bonusÉquipement`
2. Si PV ennemi ≤ 0 → l'ennemi meurt, **disparaît du plateau**, la case devient vide.
3. Sinon → l'ennemi contre-attaque → `PV joueur -= attaqueEnnemi` → l'ennemi s'enfuit.
4. Si PV joueur ≤ 0 → partie perdue.

### Règles de combat - Version avancée (IT.8)

1. Les ennemis ne fuient plus : ils combattent jusqu'à la mort.
2. Combat **tour par tour**. Le joueur attaque toujours en premier.
3. Après chaque frappe du joueur : si ennemi vivant → l'ennemi contre-attaque.
4. À chaque tour le joueur choisit : **Attaquer** (avec quel équipement ?) ou **Fuir** (recul de 2 cases).

### Déroulement d'un tour

1. Lancer le dé (1–6). Avancer d'autant de cases.
2. Case vide → tour suivant.
3. Case avec caisse surprise → appliquer les règles de ramassage.
4. Case avec ennemi → appliquer les règles de combat.
5. Vérifier fin de partie (victoire si case 64 atteinte, défaite si PV ≤ 0).

---

## Itération 1 - Get Started : Java & IDE

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Se familiariser avec l'environnement Java (JDK, compilation, exécution)
- Installer et utiliser IntelliJ IDEA
- Comprendre les bases du langage (types, variables, boucles, conditions)
- Produire un premier programme fonctionnel

---

### 1.1 - Pourquoi Java ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - Java est **statiquement typé et compilé** : les erreurs de type sont détectées à la compilation, pas à l'exécution.
> - La **JVM** rend le code portable : compilé une fois, exécutable partout.
> - C'est l'un des langages les plus utilisés en entreprise pour les backends (Spring Boot, microservices).
> - La POO y est native et stricte : idéal pour apprendre les concepts objet de manière rigoureuse.

### 1.2 - Installation

**JDK 17 LTS**
- Télécharger depuis https://www.oracle.com/java/technologies/downloads/#java17
- Vérifier : ouvrir un terminal et taper `javac -version`

**IDE IntelliJ IDEA**
- Télécharger la version Community (gratuite) : https://www.jetbrains.com/idea/download/
- Guide Hello World : https://www.jetbrains.com/idea/guide/tutorials/hello-world/

### 1.3 - Ressources d'apprentissage

- W3Schools Java : https://www.w3schools.com/java/java_getstarted.asp
- Codecademy : *Introduction to Java*, *Conditionals & Control Flow*, *Object-Oriented Java*
- OpenClassrooms : https://openclassrooms.com/en/courses/6173501-apprenez-a-programmer-en-java

### 1.4 - Premier programme : le déménagement

Votre entreprise déménage. Il y a **34 cartons** à transporter. Le camion peut en porter **9 à la fois**. Afficher pour chaque voyage : `"Voyage X : Y cartons chargés."`

> 💡 **À noter**
> - Ce programme ne contient qu'une seule classe avec un `main()`.
> - Ne pas utiliser le mot clé `static` en dehors du `main`.
> - Utiliser une boucle pour calculer les voyages, pas de calcul manuel.

### 1.5 - Deuxième programme : table de multiplication

Afficher la table de multiplication d'un nombre saisi par l'utilisateur, de 1 à 10.

```
Entrez un nombre : 7
7 x 1 = 7
7 x 2 = 14
...
7 x 10 = 70
```

> 💡 **À noter**
> - Utiliser `Scanner` pour lire la saisie utilisateur : `Scanner sc = new Scanner(System.in);`
> - C'est votre première interaction avec l'utilisateur en Java — vous réutiliserez `Scanner` dans tout le projet.
> - Testez avec plusieurs valeurs pour vérifier que votre boucle est correcte.

### 1.6 - Livrable

- [ ] Code du programme déménagement sur GitHub (repository dédié au projet D&D)
- [ ] Code de la table de multiplication sur GitHub
- [ ] Glossaire personnel : noter les syntaxes découvertes (types, boucles, conditions, Scanner)

---


---

## Itération 2 - Personnages et plateau simplifié

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Créer ses premières classes Java avec attributs et méthodes
- Implémenter constructeurs, getters/setters, `toString()`
- Organiser le code en packages
- Simuler un plateau de jeu minimal en console

---

### 2.1 - Architecture à créer

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - On crée dès maintenant 5 classes distinctes pour poser les bases d'une architecture propre.
> - **Menu** gère uniquement les interactions console (affichage + saisie). Il ne contient pas de logique métier.
> - **Game** contient l'état du jeu (plateau, position du joueur). C'est elle qui orchestre.
> - Cette séparation des responsabilités - chaque classe fait une seule chose - est le premier principe du **Clean Code**.

### 📐 Diagramme UML à compléter

Créer un diagramme de classes avec : `Personnage`, `EquipementOffensif`, `EquipementDefensif`, `Menu`, `Game`.
Indiquer les attributs et méthodes principales, ainsi que les relations (association, composition).

> 💡 Indice : `Personnage` possède (composition) un `EquipementOffensif` et un `EquipementDefensif`. `Game` contient une référence à `Personnage`.

### 2.2 - Classes à implémenter

| Classe               | Attributs                                              | Méthodes clés                                            |
|----------------------|--------------------------------------------------------|----------------------------------------------------------|
| `Personnage`         | `nom`, `niveauVie`, `forceAttaque`, `equipOffensif`, `equipDefensif` | constructeur(s), getters/setters, `toString()`  |
| `EquipementOffensif` | `nom`, `type` ("Arme"/"Sort"), `niveauAttaque`         | constructeur, getters, `toString()`                      |
| `EquipementDefensif` | `nom`, `type` ("Bouclier"/"Philtre"), `niveauDefense`  | constructeur, getters, `toString()`                      |
| `Menu`               | *(aucun attribut)*                                     | `afficherAccueil()`, `demanderNom()`, `afficherInfos(Personnage)` |
| `Game`               | `plateau` (`ArrayList<Case>`), `positionJoueur` (int)  | `initialiser()`, `jouerUnTour()`, `isPartieTerminee()`   |

### 2.3 - Caractéristiques des personnages

| Personnage | PV initiaux | Force initiale | Équip. offensif            | Équip. défensif              |
|------------|-------------|----------------|----------------------------|------------------------------|
| Guerrier   | 10          | 10             | Arme (`niveauAttaque = 0`) | Bouclier (`niveauDefense = 0`) |
| Magicien   | 6           | 15             | Sort (`niveauAttaque = 0`) | Philtre (`niveauDefense = 0`)  |

### 2.4 - Menu de démarrage

1. Afficher : "Nouveau personnage" ou "Quitter"
2. Création : choisir le type (Guerrier / Magicien) → saisir le nom via `Scanner`
3. Afficher les infos du personnage créé
4. Option modifier les infos
5. Option démarrer la partie

### 2.5 - Plateau simplifié

- Position de départ : case 1.
- À chaque tour : lancer un dé virtuel (`Random`, 1–6) → avancer.
- Afficher en console : `"Case X / 64"` à chaque tour.
- Pas d'ennemis ni de caisses dans cette version.
- En fin de plateau : proposer rejouer ou quitter.

> 💡 **À noter**
> - La méthode `main` doit rester courte (~15 lignes). Toute la logique est dans `Game` et `Menu`.
> - Ne pas utiliser `static` en dehors du `main`.
> - Tous les attributs sont `private`. Accès uniquement via getters/setters.
> - Chaque classe dans son propre fichier `.java` portant exactement son nom.
> - Nommer en anglais : `Warrior`, `Mage`, `OffensiveEquipment`…

### 2.6 - ⚡ Java 17+ (optionnel)

```java
// Utiliser un enum pour le type de personnage plutôt qu'un String :
public enum PersonnageType { GUERRIER, MAGICIEN }

// Avantages : pas de faute de frappe possible, autocomplétion IDE, switch exhaustif.
// Idem pour les types d'équipement :
public enum EquipType { ARME, SORT, BOUCLIER, PHILTRE }
```

### 2.7 - Livrable

- [ ] Code sur GitHub avec les 5 classes organisées en packages
- [ ] Diagramme UML (image ou draw.io) dans le repository
- [ ] Glossaire mis à jour

---


---

## Itération 3 - Héritage et classes abstraites

⏱ **Durée estimée : 1 jour**

### Objectifs pédagogiques

- Comprendre et implémenter l'héritage Java
- Distinguer classe abstraite et interface
- Utiliser `super()`, `@Override`, `instanceof`
- Créer et gérer une exception personnalisée

---

### 3.1 - Pourquoi l'héritage ici ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - `Guerrier` et `Magicien` partagent `nom`, `PV`, `force` → factoriser dans `Personnage` évite la duplication.
> - `Massue`, `Épée`, `Arc` partagent la notion de *bonus d'attaque* → `EquipementOffensif` abstrait.
> - La classe abstraite `Personnage` **ne peut pas être instanciée** directement : on ne peut pas créer un "Personnage générique".
> - **Différence clé** : classe abstraite = partager du CODE. Interface = définir un CONTRAT (on y reviendra en IT.4 avec `Case`).

### 📐 Diagramme UML à compléter

Compléter ce diagramme d'héritage :
- `Personnage` (abstraite) étendue par `Guerrier` et `Magicien`
- `EquipementOffensif` (abstraite) étendue par `Arme` et `Sort`
- Indiquer les attributs dans chaque classe et les méthodes héritées vs redéfinies.

> 💡 Indice : `Guerrier` et `Magicien` héritent de tous les attributs de `Personnage` via `extends`. Les méthodes `abstract` dans la classe mère doivent obligatoirement être implémentées dans les classes filles.

### 3.2 - Hiérarchie à implémenter

| Classe abstraite       | Classes concrètes filles | Méthode à redéfinir                          |
|------------------------|--------------------------|----------------------------------------------|
| `Personnage`           | `Guerrier`, `Magicien`   | `toString()` - format différent par type     |
| `EquipementOffensif`   | `Arme`, `Sort`           | `calculerBonus(Ennemi e)` (IT.8)             |
| `EquipementDefensif`   | `Bouclier`, `Philtre`    | `toString()`                                 |

### 3.3 - Mots-clés Java à maîtriser

| Mot-clé      | Rôle                                   | Exemple dans D&D                         |
|--------------|----------------------------------------|------------------------------------------|
| `extends`    | Hériter d'une classe (une seule)       | `class Guerrier extends Personnage`      |
| `abstract`   | Classe/méthode non instanciable        | `abstract class Personnage`              |
| `@Override`  | Redéfinir une méthode héritée          | `@Override public String toString()`     |
| `super()`    | Appeler le constructeur parent         | `super(nom, niveauVie, force)`           |
| `instanceof` | Tester le type à l'exécution           | `if (perso instanceof Guerrier)`         |

### 3.4 - Exception personnalisée

Créer `PersonnageHorsPlateauException`, levée si `positionJoueur > 64`.

- Étend `RuntimeException` (exception non vérifiée).
- Message : `"Position " + position + " dépasse la case finale (64)."`
- La lancer dans `jouerUnTour()` si la position calculée dépasse 64.
- La capturer (`catch`) dans la méthode appelante et afficher un message adapté.

### 3.5 - ⚡ Java 17+ (optionnel)

```java
// Utiliser des records pour les équipements (immuables par nature) :
public record Arme(String nom, int niveauAttaque) {}

// Un record génère automatiquement : constructeur, getters (nom(), niveauAttaque()),
// equals(), hashCode(), toString().
// Parfait pour Arme, Sort, Potion qui ne changent jamais une fois créés.
// Note : les records ne peuvent pas extends une classe, mais peuvent implements une interface.
```

### 3.6 - 🧪 Tests JUnit (optionnel)

```java
// PersonnageTest.java avec JUnit 5 :
@Test void testToStringGuerrier() { ... }
@Test void testToStringMagicien() { ... }
@Test void testEquipementAjouteBonus() { ... }
@Test void testExceptionHorsPlateau() {
    assertThrows(PersonnageHorsPlateauException.class, () -> game.jouerUnTourAvecPosition(99));
}

// Dépendance Maven : org.junit.jupiter:junit-jupiter:5.10.0
```

### 3.7 - Livrable

- [ ] Hiérarchie complète : `Guerrier`, `Magicien`, `Arme`, `Sort`, `Bouclier`, `Philtre`
- [ ] Exception `PersonnageHorsPlateauException` gérée
- [ ] Diagramme UML mis à jour
- [ ] (Optionnel) Tests JUnit

---


---

## Itération 4 - Plateau complet : ennemis et bonus

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Modéliser le plateau avec une **interface** `Case`
- Créer toutes les classes d'ennemis et d'équipements
- Implémenter les interactions personnage/case avec `instanceof`
- Construire le plateau de 64 cases

---

### 4.1 - L'interface Case : pourquoi pas une classe abstraite ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - Une `Case` peut être une `Arme`, un `Ennemi`, une `Potion`, ou une `CaseVide`. Ces objets n'ont **rien à partager en termes de code commun**.
> - Une interface est un **contrat** : "tout objet pouvant occuper une case doit implémenter `interaction(Personnage p)`".
> - Avec une interface, `ArrayList<Case>` peut contenir des `Arme`, `Ennemi`, `Potion`, `CaseVide`... C'est le **polymorphisme**.
> - **Règle** : interface quand on définit un comportement commun sans code commun. Classe abstraite quand on factorise du code.

### 📐 Diagramme UML à compléter

Créer le diagramme complet :
- Interface `Case` implémentée par `Ennemi` (abstrait), `EquipementOffensif` (abstrait), `Potion`, `CaseVide`
- `Gobelin`, `Sorcier`, `Dragon`, `Orc`, `MauvaisEsprit` étendent `Ennemi`
- `Massue`, `Épée`, `Arc` étendent `Arme` ; `Eclair`, `BouleDeFeu`, `Invisibilite` étendent `Sort`

> 💡 Indice : le plateau est un `ArrayList<Case>`. Quand le joueur arrive sur une case, on appelle `case.interaction(joueur)`. Chaque classe implémente `interaction()` différemment.

### 4.2 - Interface Case

```java
public interface Case {
    void interaction(Personnage personnage);
}
```

> 💡 **Pourquoi pas de `toString()` dans l'interface ?**
> Tout objet Java hérite déjà de `Object.toString()`. Le déclarer dans une interface serait redondant. Chaque classe concrète redéfinira `toString()` avec `@Override` selon son propre format.

### 4.3 - Classes à créer

| Classe                              | Hérite de / Implémente             | Caractéristiques                           |
|-------------------------------------|------------------------------------|--------------------------------------------|
| `Gobelin`                           | `Ennemi` → `Case`                  | PV: 6, ATK: 1, cible: tous                |
| `Sorcier`                           | `Ennemi` → `Case`                  | PV: 9, ATK: 2, cible: tous                |
| `Dragon`                            | `Ennemi` → `Case`                  | PV: 15, ATK: 4, cible: tous               |
| `Orc`                               | `Ennemi` → `Case`                  | PV: 10, ATK: 6, cible: Guerrier seulement |
| `MauvaisEsprit`                     | `Ennemi` → `Case`                  | PV: 15, ATK: 5, cible: Magicien seulement |
| `Massue` / `Epee` / `Arc`          | `Arme` → `EquipementOffensif` → `Case` | niveauAttaque respectifs              |
| `Eclair` / `BouleDeFeu` / `Invisibilite` | `Sort` → `EquipementOffensif` → `Case` | niveauAttaque respectifs         |
| `PotionStandard` / `GrandePotion` / `CoupDeTonnerre` | `Potion` → `Case` | effet respectif                  |
| `CaseVide`                          | `Case`                             | `interaction()` ne fait rien               |

> ⚠️ **Cas limites à implémenter explicitement**
> - `Orc.interaction(p)` : vérifier avec `instanceof` si `p` est un `Guerrier`. Sinon, ne rien faire.
> - `MauvaisEsprit.interaction(p)` : vérifier si `p` est un `Magicien`. Sinon, ne rien faire.
> - `Arme.interaction(p)` : ne s'applique qu'aux `Guerrier`. Si `Magicien` → ignorer.
> - `Sort.interaction(p)` : ne s'applique qu'aux `Magicien`. Si `Guerrier` → ignorer.

### 4.4 - Placement du plateau (64 cases)

> ⚠️ **Note** : l'`Arc`, l'`Invisibilité` et le `CoupDeTonnerre` sont définis dans les règles du jeu mais ne seront ajoutés au plateau qu'en **itération 8** (Règles avancées). De même, l'`Orc` et le `MauvaisEsprit` arrivent en IT.8. Pour l'instant, le plateau ne contient que les ennemis et équipements listés ci-dessous.

**Ennemis**
- Gobelins (10) - cases : 3, 6, 9, 12, 15, 18, 21, 24, 27, 30
- Sorciers (10) - cases : 10, 20, 25, 32, 35, 36, 37, 40, 44, 47
- Dragons (4)   - cases : 45, 52, 56, 62

**Caisses surprises**
- Massues (5)          - cases : 2, 5, 11, 22, 38
- Épées (4)            - cases : 19, 26, 42, 53
- Éclairs (5)          - cases : 1, 4, 8, 17, 23
- Boules de feu (2)    - cases : 48, 49
- Potions standard (6) - cases : 7, 13, 31, 33, 39, 43
- Grandes potions (2)  - cases : 28, 41
- Cases restantes      - `CaseVide`

### 4.5 - ⚡ Java 17+ (optionnel)

```java
// Pattern matching instanceof (Java 16+) - plus concis, pas de cast explicite :

// Ancienne façon :
if (p instanceof Guerrier) {
    Guerrier g = (Guerrier) p;
    g.ajouterArme(this);
}

// Java 16+ :
if (p instanceof Guerrier g) {
    g.ajouterArme(this);
}
```

### 4.6 - 🧪 Tests JUnit (optionnel)

```java
@Test void guerrierRamasseArme()   { /* arme ajoutée au guerrier */ }
@Test void magicienIgnoreArme()    { /* arme non ajoutée au magicien */ }
@Test void orcIgnoreMagicien()     { /* interaction orc + magicien = rien */ }
@Test void caseVideNeFaitRien()    { /* aucun effet */ }
```

### 4.7 - Livrable

- [ ] Toutes les classes créées avec héritage correct
- [ ] Plateau de 64 cases initialisé dans `Game`
- [ ] Interactions testées en console

---


---

## Itération 5 - Gestion des combats

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Implémenter la logique complète de combat
- Gérer les combats au tour par tour avec choix du joueur
- Appliquer le principe de **responsabilité unique** (SRP)
- Gérer les états de fin de partie avec une exception dédiée

---

### 5.1 - Où mettre la logique de combat ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - **Option A** : dans `Personnage` (`personnage.attaquer(ennemi)`) - simple mais `Personnage` devient trop gros.
> - **Option B** : dans `Ennemi` (`ennemi.interaction(personnage)` gère tout) - cohérent avec le pattern `Case`.
> - **Option C** : dans une classe `CombatEngine` dédiée - meilleure séparation des responsabilités (Single Responsibility Principle).
> - **Recommandation** : Option B pour la version de base, Option C pour la version avancée.
> - En production (Spring Boot), vous verrez souvent des classes `Service` qui jouent ce rôle.

### 5.2 - Combat simple (version de base)

Dans `Ennemi.interaction(Personnage p)` :

1. Calculer les dégâts infligés : `degats = p.getForceAttaque() + p.getEquipOffensif().getNiveauAttaque()`
2. `ennemi.subirDegats(degats)`
3. Si ennemi mort → afficher victoire, retirer l'ennemi du plateau (case devient `CaseVide`).
4. Sinon → `p.subirDegats(ennemi.getAttaque())` → l'ennemi s'enfuit.
5. Si `p.getNiveauVie() <= 0` → lancer `GameOverException`.

### 5.3 - Exception `GameOverException`

Créer `GameOverException` dans le package `exceptions/` :

```java
public class GameOverException extends RuntimeException {
    public GameOverException(String nomPersonnage) {
        super(nomPersonnage + " est mort. Partie terminée.");
    }
}
```

- La lancer dans `Ennemi.interaction()` si les PV du joueur tombent à 0 ou moins.
- La capturer dans la boucle de jeu (`Game.jouerUnTour()`) pour afficher le message de défaite et arrêter la partie.

> 💡 **Pourquoi une exception et pas un simple `if` avec un flag ?**
> Un flag `boolean partieTerminee` oblige à vérifier cet état après chaque appel de méthode. Une exception **remonte automatiquement** la pile d'appels et interrompt l'exécution — c'est plus propre et c'est le pattern idiomatique Java pour les erreurs bloquantes.

### 5.4 - Combat au tour par tour

1. Afficher l'état du combat (PV joueur, PV ennemi).
2. Proposer : `[1] Attaquer   [2] Fuir`
3. **Si Attaquer** : appliquer les dégâts. Si ennemi vivant → contre-attaque. Nouveau tour.
4. **Si Fuir** : reculer de 1 à 6 cases (aléatoire). Fin du combat.
5. Fin : ennemi mort (victoire) ou joueur mort (`GameOverException`).

> 💡 **À noter**
> - Gérer les cas limites de fuite : si `positionJoueur - recul < 1`, fixer à 1.
> - Afficher clairement à chaque tour : PV joueur, PV ennemi, options disponibles.
> - La mise à jour des PV en BDD sera ajoutée à l'itération suivante.

### 5.5 - ⚡ Java 14+ : switch expression (optionnel)

```java
int choix = scanner.nextInt();
String action = switch (choix) {
    case 1 -> "attaque";
    case 2 -> "fuite";
    default -> throw new IllegalArgumentException("Choix invalide : " + choix);
};
```

### 5.6 - 🧪 Tests JUnit (optionnel)

```java
@Test void guerrierTueGobelin()    { /* PV gobelin 6, force guerrier 10 → mort en 1 coup */ }
@Test void goblinBlesseGuerrier()  { /* PV joueur diminués après contre-attaque */ }
@Test void fuiteDiminuePosition()  { /* position recule entre 1 et 6 cases */ }
@Test void gameOverSiPVzero()      { assertThrows(GameOverException.class, () -> { /* ... */ }); }
```

### 5.7 - Livrable

- [ ] Combat simple fonctionnel
- [ ] `GameOverException` créée et gérée dans la boucle de jeu
- [ ] Combat au tour par tour avec choix Attaquer / Fuir
- [ ] Fin de partie gérée (victoire case 64, défaite `GameOverException`)

---


---

## Itération 6 - Sauvegarde en base de données

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Connecter une application Java à MySQL via **JDBC**
- Créer et manipuler des tables (CRUD)
- Comprendre la séparation couche données / logique métier
- (Optionnel) Sérialiser des objets Java en JSON avec **GSON**

---

### 6.1 - Pourquoi séparer la couche données ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - `Game` ne doit pas contenir de code SQL. Mélanger logique métier et accès BDD rend le code impossible à maintenir.
> - On crée un package `repository` qui centralise tout l'accès BDD : c'est le pattern **DAO** (Data Access Object).
> - **Bénéfice** : si on change de base (MySQL → PostgreSQL), on ne touche qu'au DAO, pas à `Game`.
> - C'est exactement le principe **Repository** que vous retrouverez dans Spring Boot.
> - Maintenant que les combats sont fonctionnels, on peut sauvegarder les PV après chaque affrontement.

### 6.2 - Installation MySQL et JDBC

- Installer MySQL : https://dev.mysql.com/downloads/mysql/
- Créer la base : `CREATE DATABASE DonjonsEtDragons;`
- Télécharger le driver JDBC MySQL (`mysql-connector-j`) et l'ajouter au projet dans IntelliJ (dossier `lib/`).

### 6.3 - Structure de la table `hero`

| Colonne          | Type SQL                        | Description                          |
|------------------|---------------------------------|--------------------------------------|
| `id`             | `INT PRIMARY KEY AUTO_INCREMENT`| Identifiant unique                   |
| `type`           | `VARCHAR(20)`                   | `GUERRIER` ou `MAGICIEN`             |
| `nom`            | `VARCHAR(100)`                  | Nom du personnage                    |
| `niveau_vie`     | `INT`                           | PV actuels                           |
| `force_attaque`  | `INT`                           | Force d'attaque                      |
| `equip_offensif` | `VARCHAR(255)`                  | Nom de l'équipement offensif         |
| `equip_json`     | `TEXT`                          | (Optionnel) Objet sérialisé en JSON  |

### 6.4 - Classe `HeroRepository` (DAO)

Créer dans `fr.campus.dungeon.repository` :

1. `getConnection()` - retourner une `Connection` JDBC
2. `getHeroes()` - retourner `List<Personnage>` depuis la BDD
3. `createHero(Personnage p)` - `INSERT INTO hero...`
4. `editHero(Personnage p)` - `UPDATE hero SET...`
5. `changeLifePoints(int id, int nouveauxPV)` - `UPDATE hero SET niveau_vie...`
6. (Optionnel) `deleteHero(int id)`

> 💡 **À noter**
> - Toujours fermer `Connection`, `Statement` et `ResultSet` dans un bloc `finally` ou avec **try-with-resources**.
> - Utiliser `PreparedStatement` plutôt que `Statement` pour éviter les injections SQL.
> - Appeler `changeLifePoints()` après chaque combat pour persister l'état du héros.

### 6.5 - ⚡ Java 7+ : try-with-resources (souvent oublié)

```java
// try-with-resources ferme automatiquement conn et ps
try (var conn = getConnection();
     var ps   = conn.prepareStatement(sql)) {
    ps.setString(1, personnage.getNom());
    ps.executeUpdate();
}
// Évite les fuites de connexion, code plus propre.
```

### 6.6 - Optionnel : GSON

```java
Gson gson = new Gson();
String json = gson.toJson(equipOffensif);               // Objet → JSON String
EquipementOffensif e = gson.fromJson(json, Arme.class); // JSON String → Objet
```

Dépendance : `com.google.code.gson:gson:2.10.1` (jar à ajouter dans `lib/`)

### 6.7 - Livrable

- [ ] Base `DonjonsEtDragons` créée avec la table `hero`
- [ ] `HeroRepository` avec `getHeroes()`, `createHero()`, `changeLifePoints()`
- [ ] Intégration dans le Menu : afficher les héros sauvegardés au démarrage
- [ ] PV mis à jour en BDD après chaque combat

---


---

## Itération 7 - Remplissage aléatoire du plateau

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Maîtriser les collections Java (`ArrayList`, `Collections`)
- Implémenter un placement aléatoire reproductible
- Finaliser toutes les interactions entre personnages et cases
- Pratiquer la modélisation UML complète

---

### 7.1 - Placement aléatoire

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - Un plateau fixe est prévisible et ennuyeux après 2 parties. Le rendre aléatoire améliore la **rejouabilité**.
> - La technique : créer une liste de toutes les cases à placer, mélanger avec `Collections.shuffle()`, puis répartir dans le plateau.
> - Contrainte : le nombre total d'ennemis et d'équipements doit rester identique à IT.4.
> - Optionnel : passer une **seed** à `Random` pour rendre le plateau reproductible (utile pour les tests).

### 7.2 - Algorithme de placement

1. Créer une liste `objetsAPlacer` avec tous les ennemis et équipements (24 ennemis + 24 caisses).
2. Mélanger : `Collections.shuffle(objetsAPlacer, new Random())`
3. Initialiser le plateau de 64 cases avec des `CaseVide`.
4. Distribuer les objets dans les cases du plateau.

### 7.3 - Table de vérification des interactions finales

| Personnage | Rencontre        | Comportement attendu                           |
|------------|------------------|------------------------------------------------|
| Guerrier   | Arme             | Remplacer si meilleure. Ignorer sinon.         |
| Guerrier   | Sort             | Ignorer (incompatible).                        |
| Guerrier   | Orc              | Combat engagé.                                 |
| Guerrier   | Mauvais esprit   | Case ignorée (l'esprit ignore le guerrier).    |
| Magicien   | Sort             | Remplacer si meilleur. Ignorer sinon.          |
| Magicien   | Arme             | Ignorer (incompatible).                        |
| Magicien   | Mauvais esprit   | Combat engagé.                                 |
| Magicien   | Orc              | Case ignorée (l'Orc ignore le magicien).       |
| Tous       | Potion           | Appliquer l'effet immédiatement.               |
| Tous       | CaseVide         | Rien. Tour suivant.                            |

### 7.4 - 🧪 Tests JUnit (optionnel)

```java
@Test void plateauContient24Ennemis() { /* compter les Ennemi dans le plateau */ }
@Test void plateauContient24Caisses() { /* compter les équipements et potions */ }
@Test void plateauA64Cases()          { assertEquals(64, game.getPlateau().size()); }
// Conseil : passer une seed fixe à Random pour des tests déterministes.
```

### 7.5 - Livrable

- [ ] Plateau aléatoire fonctionnel avec les bonnes proportions
- [ ] Toutes les interactions implémentées
- [ ] Diagramme UML final complet
- [ ] Partie jouable de bout en bout

---


---

## Itération 8 - Règles avancées (Version 2)

⏱ **Durée estimée : 2 jours**

### Objectifs pédagogiques

- Implémenter la gestion d'inventaire (2 slots)
- Ajouter les nouveaux ennemis et équipements
- Gérer les bonus conditionnels selon le type d'ennemi
- Rendre les combats plus stratégiques

---

### 8.1 - Gestion de l'inventaire

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - Un inventaire à 2 slots change complètement la stratégie : le joueur doit choisir quoi conserver.
> - Techniquement : remplacer l'attribut `equipOffensif` unique par `List<EquipementOffensif>` de taille max 2.
> - Lors d'un combat : afficher les équipements disponibles et laisser le joueur choisir lequel utiliser.
> - Lors d'un ramassage avec inventaire plein : proposer remplacer slot 1 / slot 2 / ignorer.

### 8.2 - Modifications de Personnage

- Remplacer `equipOffensif` par `List<EquipementOffensif> inventaire` (max 2 éléments).
- Ajouter `ajouterEquipement(EquipementOffensif e, Scanner sc)` - gère l'inventaire plein.
- Ajouter `choisirEquipement(Scanner sc)` - affiche l'inventaire et retourne l'équipement choisi.
- Modifier `toString()` pour afficher les 2 slots.

### 8.3 - Bonus conditionnels

```java
// Dans Arc.java
public int calculerBonus(Ennemi cible) {
    return (cible instanceof Dragon) ? 6 : 4;
}

// Dans Invisibilite.java
public int calculerBonus(Ennemi cible) {
    return (cible instanceof MauvaisEsprit) ? 8 : 5;
}
```

### 8.4 - Potion Coup de tonnerre

- Effet : multiplier par 2 la force d'attaque pour le **prochain combat uniquement**.
- Ajouter un flag `boolean coupDeTonnerreActif` dans `Personnage`.
- Dans le calcul des dégâts : `if (coupDeTonnerreActif) { degats *= 2; coupDeTonnerreActif = false; }`

### 8.5 - Nouveaux combats

- Les ennemis ne fuient plus : ils combattent jusqu'à la mort.
- Si le joueur fuit : recul de **2 cases** (fixe en version avancée).
- Le joueur choisit son équipement à chaque attaque.

### 8.6 - ⚡ Java 8+ : interface fonctionnelle (optionnel)

```java
@FunctionalInterface
public interface BonusCalculator {
    int calculer(Ennemi cible);
}

// Utilisation avec lambda :
BonusCalculator arc = cible -> (cible instanceof Dragon) ? 6 : 4;
```

### 8.7 - 🧪 Tests JUnit (optionnel)

```java
@Test void ajouterEquipementSlotLibre()  { /* slot ajouté sans prompt */ }
@Test void remplacerEquipementSlotPlein(){ /* prompt affiché, slot remplacé */ }
@Test void arcBonus6ContreDragon()       { assertEquals(6, arc.calculerBonus(new Dragon())); }
@Test void arcBonus4ContreGobelin()      { assertEquals(4, arc.calculerBonus(new Gobelin())); }
@Test void coupDeTonnerreDoubleAttaque() { /* dégâts doublés puis flag remis à false */ }
```

### 8.8 - Livrable

- [ ] Inventaire à 2 slots fonctionnel avec choix en combat
- [ ] `Orc`, `MauvaisEsprit` ajoutés
- [ ] `Arc`, `Invisibilite`, `CoupDeTonnerre` ajoutés
- [ ] Bonus conditionnels selon l'ennemi implémentés

---


---

## Itération 9 - Interface graphique JavaFX ⭐ Bonus

⏱ **Durée estimée : 2–3 jours**

> ⭐ **Itération bonus** - S'adresse aux apprenants ayant terminé les 8 premières itérations.
> Cette itération **ne modifie pas la logique métier** : on greffe une interface graphique sur le code existant.

### Objectifs pédagogiques

- Découvrir JavaFX et le pattern **MVC**
- Afficher le plateau et les personnages graphiquement
- Connecter l'interface aux classes métier existantes
- Gérer les événements utilisateur (clics, boutons)

---

### 9.1 - Pourquoi JavaFX ? Pourquoi le pattern MVC ?

> 🏗️ **Pourquoi ce choix d'architecture ?**
> - JavaFX est la bibliothèque UI standard pour les applications de bureau Java modernes (remplace Swing).
> - **MVC = Model / View / Controller** : séparer les données (Model), l'affichage (View), et la logique d'interaction (Controller).
> - Le **Model**, c'est tout ce qu'on a déjà construit : `Game`, `Personnage`, `Ennemi`...
> - La **View**, c'est ce qu'on va créer : les écrans JavaFX (fichiers `.fxml`).
> - Le **Controller** fait le lien : il reçoit les actions utilisateur et appelle le Model.
> - **Bénéfice** : changer l'interface (console → GUI) sans toucher au code métier.

### 📐 Diagramme UML à compléter

Créer le diagramme MVC :
- `DndApp` charge `PlateauController` qui détient une référence à `Game` (Model)
- `PlateauController` écoute les événements JavaFX et appelle `game.jouerUnTour()`
- (Optionnel) `Game` notifie les changements via le pattern Observer

> 💡 Indice : le Controller ne doit pas contenir de logique métier. Il traduit les événements UI en appels sur le Model.

### 9.2 - Installation JavaFX

- Télécharger JavaFX 17 SDK : https://gluonhq.com/products/javafx/
- Dans IntelliJ : `File → Project Structure → Libraries` → ajouter le dossier `lib/` de JavaFX.
- Dans Run Configuration → VM Options :

```
--module-path /chemin/vers/javafx-sdk-17/lib
--add-modules javafx.controls,javafx.fxml
```

### 9.3 - Structure MVC à créer

| Couche       | Package                          | Classes à créer                                |
|--------------|----------------------------------|------------------------------------------------|
| Model        | `fr.campus.dungeon.game`         | Existant : `Game`, `Personnage`, `Ennemi`...   |
| View (FXML)  | `fr.campus.dungeon.view`         | `plateau.fxml`, `combat.fxml`, `menu.fxml`     |
| Controller   | `fr.campus.dungeon.controller`   | `PlateauController`, `CombatController`, `MenuController` |
| Main         | `fr.campus.dungeon`              | `DndApp.java` (extends `Application`)          |

### 9.4 - Écrans à implémenter

**Écran 1 - Menu principal**
- Champ de saisie pour le nom du personnage
- Boutons : Guerrier / Magicien
- Bouton : Démarrer la partie
- Liste des héros sauvegardés (depuis la BDD)

**Écran 2 - Plateau de jeu**
- Grille 8×8 représentant les 64 cases (`GridPane` JavaFX)
- Chaque case colorée selon son contenu : gris = vide, rouge = ennemi, or = caisse, bleu = joueur
- Panneau de stats à droite : PV joueur, force, équipements
- Bouton "Lancer le dé" → déplacer le joueur et afficher les événements

**Écran 3 - Combat**
- S'ouvre automatiquement quand le joueur rencontre un ennemi
- Stats joueur vs stats ennemi
- Boutons : Attaquer (avec choix d'équipement) / Fuir
- Log des actions en temps réel (`TextArea`)

### 9.5 - Structure de DndApp.java

```java
public class DndApp extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/view/menu.fxml"));
        Scene scene = new Scene(loader.load(), 800, 600);
        primaryStage.setTitle("Donjons & Dragons");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) { launch(args); }
}
```

### 9.6 - ⚡ JavaFX Bindings (optionnel)

```java
// Synchroniser automatiquement les PV affichés sans code supplémentaire :
pvLabel.textProperty().bind(
    Bindings.concat("PV : ", joueur.niveauVieProperty())
);
// Nécessite de transformer niveauVie en IntegerProperty dans Personnage.
```

### 9.7 - Suggestions d'améliorations

- Animer le déplacement du joueur (`Timeline` JavaFX)
- Icônes pour les ennemis et équipements (`ImageView`)
- Sons lors des combats (`Media`, `MediaPlayer`)
- Écran de fin stylisé (victoire / défaite) avec score
- Thème sombre (CSS JavaFX)

### 9.8 - Livrable

- [ ] Application JavaFX avec les 3 écrans minimum
- [ ] Code métier non modifié
- [ ] Diagramme MVC documenté

---


---

## Annexe A - Cheat Sheet POO Java

### Concepts fondamentaux

| Concept       | Définition                                     | Exemple D&D                                  |
|---------------|------------------------------------------------|----------------------------------------------|
| Classe        | Modèle décrivant un objet (attributs + méthodes) | `class Guerrier { ... }`                   |
| Instance      | Objet concret créé avec `new`                  | `new Guerrier("Thor")`                       |
| Attribut      | Variable de classe (`public`, souvent `final`) | `public static final int MAX_PV = 10`        |
| Propriété     | Variable d'instance (`private` + getter/setter)| `private int niveauVie`                      |
| Constructeur  | Méthode d'initialisation portant le nom de la classe | `public Guerrier(String nom) { super(nom,...) }` |
| Méthode       | Comportement d'un objet                        | `public void attaquer(Ennemi e) { ... }`     |
| Package       | Arborescence d'organisation des classes        | `fr.campus.dungeon.characters`               |

### Visibilité

| Modificateur | Accessible depuis                         | Usage typique              |
|--------------|-------------------------------------------|----------------------------|
| `public`     | Partout                                   | API publique de la classe  |
| `private`    | La classe uniquement                      | Toutes les propriétés      |
| `protected`  | Même package + sous-classes (`extends`)   | Attributs partagés         |

### Héritage & Polymorphisme

| Mot-clé           | Usage                                        | Exemple                                    |
|-------------------|----------------------------------------------|--------------------------------------------|
| `extends`         | Hériter d'une seule classe                   | `class Gobelin extends Ennemi`             |
| `implements`      | Implémenter une ou plusieurs interfaces      | `class Gobelin implements Case`            |
| `abstract class`  | Classe non instanciable, code partagé        | `abstract class Ennemi { ... }`            |
| `interface`       | Contrat sans implémentation                  | `interface Case { void interaction(...); }`|
| `@Override`       | Redéfinir une méthode héritée                | `@Override public String toString()`       |
| `super()`         | Appeler constructeur / méthode parent        | `super("Gobelin", 6, 1)`                   |
| `instanceof`      | Tester le type à l'exécution                 | `if (p instanceof Guerrier g) { ... }`     |

### Collections utiles

| Collection               | Usage                                | Exemple                                            |
|--------------------------|--------------------------------------|----------------------------------------------------|
| `ArrayList<T>`           | Liste ordonnée, taille variable      | `ArrayList<Case> plateau = new ArrayList<>()`      |
| `List.of()`              | Liste immuable (Java 9+)             | `List.of(new Gobelin(), new Sorcier())`             |
| `Collections.shuffle()`  | Mélange aléatoire d'une liste        | `Collections.shuffle(liste, new Random())`          |
| `Collections.nCopies()`  | Créer N copies d'un même objet       | `Collections.nCopies(64, new CaseVide())`           |

### Conventions de nommage

| Élément            | Convention               | Exemple                       |
|--------------------|--------------------------|-------------------------------|
| Classe / Interface | PascalCase               | `EquipementOffensif`          |
| Méthode / Variable | camelCase                | `niveauVie`, `calculerBonus()`|
| Constante          | SCREAMING_SNAKE_CASE     | `MAX_INVENTAIRE = 2`          |
| Package            | tout.en.minuscules       | `fr.campus.dungeon.characters`|
| Langue             | Anglais recommandé       | `warrior`, `hitPoints`        |

---

## Annexe B - Conventions & bonnes pratiques

### Principes SOLID appliqués au projet

| Principe                  | Définition                                      | Application D&D                                                            |
|---------------------------|-------------------------------------------------|----------------------------------------------------------------------------|
| **S** - Single Responsibility | Une classe = une responsabilité             | `Menu` gère l'UI. `Game` gère le jeu. `HeroRepository` gère la BDD.       |
| **O** - Open/Closed       | Ouvert à l'extension, fermé à la modification  | Ajouter un ennemi = créer une classe. Ne pas modifier `Ennemi`.            |
| **L** - Liskov Substitution | Une sous-classe remplace sa classe mère      | Partout où `Ennemi` est attendu, `Gobelin`, `Dragon`, `Orc` fonctionnent.  |
| **I** - Interface Segregation | Interfaces petites et ciblées              | `Case` n'a qu'une méthode : `interaction()`.                               |
| **D** - Dependency Inversion | Dépendre des abstractions                   | `Game` manipule des `Case`, pas directement des `Gobelin`.                 |

### Checklist qualité - avant chaque commit

- [ ] Tous les attributs sont `private`
- [ ] Chaque classe a ses getters/setters, constructeur(s) et `toString()`
- [ ] Aucune logique métier dans `Menu`
- [ ] Aucun code SQL dans `Game` ou `Personnage`
- [ ] Aucun `static` en dehors du `main` et des constantes
- [ ] Les méthodes font moins de 20 lignes
- [ ] Les classes font moins de 200 lignes
- [ ] Le code compile sans warning

### Structure de packages recommandée

```
fr.campus.dungeon/
├── Main.java
├── characters/
│   ├── Personnage.java          (abstraite)
│   ├── Guerrier.java
│   └── Magicien.java
├── equipment/
│   ├── EquipementOffensif.java  (abstraite)
│   ├── EquipementDefensif.java  (abstraite)
│   ├── Arme.java  /  Sort.java
│   ├── Massue.java  /  Epee.java  /  Arc.java        ← Arc ajouté en IT.8
│   ├── Eclair.java  /  BouleDeFeu.java  /  Invisibilite.java  ← Invisibilite en IT.8
│   └── Potion.java  /  PotionStandard.java  /  GrandePotion.java  /  CoupDeTonnerre.java  ← CoupDeTonnerre en IT.8
├── enemies/
│   ├── Ennemi.java              (abstraite)
│   ├── Gobelin.java  /  Sorcier.java  /  Dragon.java
│   ├── Orc.java  /  MauvaisEsprit.java               ← ajoutés en IT.8
│   └── CaseVide.java
├── game/
│   ├── Case.java                (interface)
│   └── Game.java
├── repository/
│   └── HeroRepository.java
├── ui/
│   └── Menu.java
└── exceptions/
    ├── PersonnageHorsPlateauException.java            ← introduite en IT.3
    └── GameOverException.java                         ← introduite en IT.5
```

### Ressources complémentaires

- OpenClassrooms Java : https://openclassrooms.com/en/courses/6173501-apprenez-a-programmer-en-java
- Baeldung (tutoriels avancés) : https://www.baeldung.com
- JUnit 5 Guide : https://junit.org/junit5/docs/current/user-guide/
- JavaFX : https://openjfx.io/openjfx-docs/
- JDBC : https://www.baeldung.com/java-jdbc
- Refactoring Guru (Design Patterns) : https://refactoring.guru/design-patterns/java

---

*Fin du document - Version apprenant v3*
*Campus Numérique in the Alps - Java & POO - 2025/2026*
