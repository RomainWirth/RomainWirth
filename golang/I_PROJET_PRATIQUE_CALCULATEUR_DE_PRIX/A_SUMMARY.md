# PROJET PRATIQUE - CALCULATEUR DE PRIX TTC

## Objectif du module

Ce module est un **projet fil rouge** : on construit de bout en bout un petit programme Go qui calcule des prix TTC à partir de prix HT lus dans un fichier, et qui enregistre les résultats dans des fichiers JSON.

L'objectif n'est pas la complexité du programme lui-même - il reste volontairement simple - mais la **démarche itérative** : on part d'une version naïve, et on la fait évoluer étape par étape pour introduire des concepts Go fondamentaux dans un contexte concret.

Chaque évolution du code est une occasion d'appliquer un principe de conception :

- structurer son code en packages,
- séparer les responsabilités,
- utiliser les structs, les méthodes et les constructeurs,
- tirer profit des interfaces pour rendre le code flexible,
- gérer les erreurs de manière explicite et robuste.

---

## Progression du projet

### [B - Version basique](B_Version_basique.md)

Point de départ : on crée la structure minimale du projet et une première version fonctionnelle.

- [Set up du projet](B_Version_basique.md#set-up)
- [Version basique : fonctions libres, sans struct](B_Version_basique.md#version-basique)
- [Amélioration : introduction d'un struct `TaxIncludedPriceJob`](B_Version_basique.md#amélioration--ajout-dun-struct)
- [Résumé](B_Version_basique.md#résumé)

---

### [C - Intégrer de la data depuis un fichier](C_Intégrer_de_la_data_depuis_un_fichier.md)

On remplace les prix codés en dur par une lecture dynamique depuis un fichier texte `prices.txt`. Première séparation données / logique.

- [Ajouter un fichier de data et une méthode `LoadData()`](C_Intégrer_de_la_data_depuis_un_fichier.md#ajouter-un-fichier-de-data-et-une-méthode-pour-récupérer-les-données)
- [Travailler avec le fichier de données](C_Intégrer_de_la_data_depuis_un_fichier.md#travailler-avec-le-fichier-de-données)

---

### [D - Externaliser dans des packages](D_Externaliser_dans_des_packages.md)

On applique le **Single Responsibility Principle** en extrayant la logique de conversion et l'accès au fichier dans leurs propres packages.

- [Externaliser la logique de conversion → package `conversion`](D_Externaliser_dans_des_packages.md#externaliser-la-logique-de-partage-dans-un-package)
  - [Pourquoi externaliser dans un package dédié ?](D_Externaliser_dans_des_packages.md#pourquoi-externaliser-dans-un-package-dédié-)
- [Externaliser l'accès au fichier → package `filemanager`](D_Externaliser_dans_des_packages.md#externaliser-les-accès-au-fichier-dans-un-package)
  - [Pourquoi séparer l'accès au fichier du domaine métier ?](D_Externaliser_dans_des_packages.md#pourquoi-séparer-laccès-au-fichier-du-domaine-métier-)
- [Résumé des concepts : SRP, SoC, packages atomiques, testabilité](D_Externaliser_dans_des_packages.md#résumé-des-concepts-abordés)

---

### [E - Stocker des données JSON](E_Stocker_des_data_JSON.md)

On persiste les résultats dans des fichiers JSON grâce au package `encoding/json`. Introduction de `interface{}` / `any` pour écrire une fonction générique.

- [Pourquoi persister les résultats en JSON ?](E_Stocker_des_data_JSON.md#pourquoi-persister-les-résultats-en-json-)
- [La fonction `WriteJSON()` et le paramètre `interface{}`](E_Stocker_des_data_JSON.md#la-fonction-writejson--signature-et-paramètre-interface)
  - [`interface{}` ou `any` ?](E_Stocker_des_data_JSON.md#interface-ou-any-)
- [Implémentation avec `json.NewEncoder`](E_Stocker_des_data_JSON.md#implémentation-complète-de-writejson)
- [Nommage dynamique des fichiers de sortie](E_Stocker_des_data_JSON.md#nommage-dynamique-des-fichiers-de-sortie)

---

### [F - Ajouter et travailler avec des structs](F_Ajouter_et_travailler_avec_des_structs.md)

Étape majeure d'architecture : on transforme les fonctions libres en méthodes d'un struct, on introduit l'injection de dépendance, les struct tags, et les interfaces.

#### Struct `FileManager`
- [Pourquoi introduire un struct pour la gestion des fichiers ?](F_Ajouter_et_travailler_avec_des_structs.md#pourquoi-introduire-un-struct-pour-la-gestion-des-fichiers-)
- [Constructeur `New()` en Go](F_Ajouter_et_travailler_avec_des_structs.md#étape-3---ajouter-un-constructeur-new)
- [Injection de dépendance via `IOManager`](F_Ajouter_et_travailler_avec_des_structs.md#étape-4---intégrer-filemanager-dans-le-package-prices)

#### Struct tags
- [Qu'est-ce qu'un struct tag ?](F_Ajouter_et_travailler_avec_des_structs.md#quest-ce-quun-struct-tag-)
- [Anatomie de `json:"..."`](F_Ajouter_et_travailler_avec_des_structs.md#anatomie-de-json)
- [Application dans `TaxIncludedPriceJob`](F_Ajouter_et_travailler_avec_des_structs.md#application-dans-taxincludedpricejob)

#### Structs échangeables et interfaces
- [Objectif : rendre le gestionnaire d'I/O remplaçable](F_Ajouter_et_travailler_avec_des_structs.md#objectif--rendre-le-gestionnaire-dio-remplaçable)
- [Package `cmdmanager` : lire depuis le clavier, écrire dans la console](F_Ajouter_et_travailler_avec_des_structs.md#le-struct-cmdmanager)
- [Interfaces en renfort](F_Ajouter_et_travailler_avec_des_structs.md#interfaces-en-renfort)
  - [Qu'est-ce qu'une interface en Go ? Polymorphisme.](F_Ajouter_et_travailler_avec_des_structs.md#quest-ce-quune-interface-en-go-)
  - [Package `iomanager` : déplacer l'interface](F_Ajouter_et_travailler_avec_des_structs.md#étape-2---déplacer-linterface-dans-son-propre-package-iomanager)
  - [Bilan : Dependency Inversion](F_Ajouter_et_travailler_avec_des_structs.md#bilan--ce-que-les-interfaces-apportent-ici)

---

### [G - Gestion des erreurs](G_GESTION_DES_ERREURS.md)

On rend la chaîne d'appels robuste en propageant les erreurs de chaque couche jusqu'à `main()`.

- [Le problème : les erreurs silencieuses](G_GESTION_DES_ERREURS.md#le-problème--les-erreurs-silencieuses)
- [La convention Go pour la gestion d'erreurs](G_GESTION_DES_ERREURS.md#la-convention-go-pour-la-gestion-derreurs)
- [`LoadData()` propage ses erreurs](G_GESTION_DES_ERREURS.md#étape-1---loaddata-propage-ses-erreurs)
- [`Process()` : early return et forwarding direct](G_GESTION_DES_ERREURS.md#étape-2---process-propage-les-erreurs-de-bout-en-bout)
- [`main()` : point terminal de la chaîne d'erreurs](G_GESTION_DES_ERREURS.md#étape-3---main-gère-lerreur-en-bout-de-chaîne)
- [Bilan : chaîne de propagation](G_GESTION_DES_ERREURS.md#bilan--la-chaîne-de-propagation)

---

## Évolution de l'architecture au fil du projet

```
B - Version basique
    main.go
    prices/prices.go

C - Lecture depuis un fichier
    + data/prices.txt
    + LoadData() avec bufio.Scanner

D - Packages atomiques
    + conversion/conversion.go   (StringsToFloats)
    + filemanager/filemanager.go (ReadLines)

E - Persistance JSON
    + filemanager.WriteJSON()
    + results_json/*.json

F - Structs, tags, interfaces
    + filemanager.FileManager{} (struct avec méthodes)
    + cmdmanager.CMDManager{}   (I/O clavier/console)
    + iomanager.IOManager       (interface)
    struct tags json:"..."

G - Gestion des erreurs
    LoadData() error
    Process() error
    propagation jusqu'à main()
```

## Concepts clés abordés dans ce module

| Concept | Fichier |
|---|---|
| Structs, méthodes, constructeurs | [B](B_Version_basique.md), [F](F_Ajouter_et_travailler_avec_des_structs.md) |
| Packages atomiques, SRP, SoC | [D](D_Externaliser_dans_des_packages.md) |
| Lecture de fichiers (`os`, `bufio`) | [C](C_Intégrer_de_la_data_depuis_un_fichier.md), [D](D_Externaliser_dans_des_packages.md) |
| Sérialisation JSON (`encoding/json`) | [E](E_Stocker_des_data_JSON.md) |
| `interface{}` / `any` | [E](E_Stocker_des_data_JSON.md) |
| Struct tags | [F](F_Ajouter_et_travailler_avec_des_structs.md) |
| Injection de dépendance | [F](F_Ajouter_et_travailler_avec_des_structs.md) |
| Interfaces et polymorphisme | [F](F_Ajouter_et_travailler_avec_des_structs.md) |
| Dependency Inversion | [F](F_Ajouter_et_travailler_avec_des_structs.md) |
| Gestion d'erreurs, early return, forwarding | [G](G_GESTION_DES_ERREURS.md) |

---

## Pistes d'amélioration

Le programme est fonctionnel mais volontairement minimal. Voici des idées d'évolution concrètes, classées par thème, pour continuer à pratiquer les concepts Go.

### 1. Tests unitaires

Écrire des tests pour les fonctions pures est la suite logique naturelle : elles ont été conçues pour ça.

- Ajouter un fichier `conversion_test.go` dans le package `conversion` et tester `StringsToFloats()` avec des cas nominaux, des entrées invalides et des slices vides.
- Créer un mock `MockIOManager` qui implémente `iomanager.IOManager` en mémoire, et l'injecter dans `TaxIncludedPriceJob` pour tester `Process()` sans toucher au système de fichiers.
- Concepts à pratiquer : `testing`, tableaux de cas (`table-driven tests`), mocks via interfaces.

### 2. Gestion des erreurs améliorée

Actuellement, les erreurs sont des messages génériques (`errors.New("...")`). On peut les enrichir :

- Utiliser `fmt.Errorf("contexte : %w", err)` pour **wrapper** les erreurs avec un contexte, et `errors.Is()` / `errors.As()` pour les inspecter côté appelant.
- Définir des types d'erreurs personnalisés (ex. `type ParseError struct { Line int; Value string }`) pour distinguer les différents échecs.
- Écrire les erreurs dans un fichier de log plutôt que dans `stdout`, via le package `log` ou `log/slog` (Go 1.21+).

### 3. Source de données configurable

Le chemin `"./data/prices.txt"` est codé en dur dans `main()`. On peut le rendre configurable :

- Lire le chemin depuis les **arguments de la ligne de commande** avec `os.Args` ou le package `flag`.
- Lire la configuration depuis un fichier **JSON ou YAML** (ex. `config.json` avec les chemins et les taux de taxe), avec `encoding/json` déjà connu.
- Ajouter un `DBManager` qui implémente `iomanager.IOManager` et lit les prix depuis une base SQLite via le package `database/sql`.

### 4. Concurrence

Chaque job est actuellement traité séquentiellement dans la boucle `for`. Pour des volumes importants, on peut les paralléliser :

- Lancer chaque `priceJob.Process()` dans une **goroutine** (`go priceJob.Process()`).
- Utiliser un `sync.WaitGroup` pour attendre la fin de toutes les goroutines avant que `main()` se termine.
- Utiliser un **channel** pour collecter les erreurs remontées par chaque goroutine et les traiter dans `main()`.
- Concepts à pratiquer : goroutines, `sync.WaitGroup`, channels, `select`.

### 5. API HTTP

Exposer le calculateur comme un service web est une évolution naturelle vers une application plus réaliste :

- Ajouter un handler HTTP avec le package `net/http` qui reçoit une liste de prix HT en JSON dans le corps de la requête (`POST /calculate`).
- Créer un `HTTPResponseManager` qui implémente `iomanager.IOManager` et écrit la réponse JSON dans un `http.ResponseWriter`.
- Concepts à pratiquer : `net/http`, `json.Decoder`, handlers, routing.

### 6. Validation des données d'entrée

Le programme plante ou produit des résultats incorrects si `prices.txt` contient des lignes vides ou des valeurs négatives. On peut renforcer la robustesse :

- Filtrer les lignes vides dans `filemanager.ReadLines()` avant de les retourner.
- Ajouter une validation dans `conversion.StringsToFloats()` pour rejeter les valeurs négatives ou nulles avec une erreur explicite.
- Ajouter une validation du taux de taxe dans `NewTaxIncludedPriceJob()` (rejet si `taxRate < 0` ou `taxRate > 1`).
