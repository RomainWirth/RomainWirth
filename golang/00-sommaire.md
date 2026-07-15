# GO — Sommaire

Notes prises pendant l'apprentissage de [Go](https://go.dev/). Le cours couvre les fondamentaux du langage, les structures de données, la concurrence, la construction d'une API REST et des projets pratiques.

Prérequis : avoir installé Go sur sa machine — voir [Download and install](https://go.dev/doc/install).

## Parcours conseillé

1. [01-introduction/](./01-introduction/)
2. [02-go-essentials/](./02-go-essentials/)
3. [03-les-packages/](./03-les-packages/)
4. [04-les-pointeurs/](./04-les-pointeurs/)
5. [05-structs-et-custom-types/](./05-structs-et-custom-types/)
6. [06-interfaces-et-code-generique/](./06-interfaces-et-code-generique/)
7. [07-arrays-slices-et-maps/](./07-arrays-slices-et-maps/)
8. [08-approfondir-les-fonctions/](./08-approfondir-les-fonctions/)
9. [09-projet-calculateur-de-prix/](./09-projet-calculateur-de-prix/)
10. [10-concurrency/](./10-concurrency/)
11. [11-projet-rest-api/](./11-projet-rest-api/)
12. [12-frameworks/](./12-frameworks/)
13. [13-projet-gamebook/](./13-projet-gamebook/)

## Contenu du dossier

### [01-introduction/](./01-introduction/)

Introduction générale au langage Go : origines, philosophie, outillage de base.

- [01-introduction-go.md](./01-introduction/01-introduction-go.md)

### [02-go-essentials/](./02-go-essentials/)

Les composants fondamentaux d'un programme Go : types et valeurs, fonctions, structures de contrôle (`if`, `switch`), boucles `for`, persistance dans un fichier, gestion des erreurs et `panic`.

- [00-sommaire.md](./02-go-essentials/00-sommaire.md)
- [01-go-program-key-components.md](./02-go-essentials/01-go-program-key-components.md)
- [02-values-and-types.md](./02-go-essentials/02-values-and-types.md)
- [03-comprendre-les-fonctions.md](./02-go-essentials/03-comprendre-les-fonctions.md)
- [04-structures-de-controle.md](./02-go-essentials/04-structures-de-controle.md)
- [05-les-boucles-for.md](./02-go-essentials/05-les-boucles-for.md)
- [06-switch-case.md](./02-go-essentials/06-switch-case.md)
- [07-persistance-et-lecture-de-la-data.md](./02-go-essentials/07-persistance-et-lecture-de-la-data.md)
- [08-error-handling.md](./02-go-essentials/08-error-handling.md)
- [09-utilisation-de-panic.md](./02-go-essentials/09-utilisation-de-panic.md)

### [03-les-packages/](./03-les-packages/)

Séparer le code en fichiers et packages, exporter/importer des identifiers, utiliser des packages tiers.

- [00-sommaire.md](./03-les-packages/00-sommaire.md)
- [01-separer-le-code-en-plusieurs-packages.md](./03-les-packages/01-separer-le-code-en-plusieurs-packages.md)
- [02-pourquoi-plusieurs-packages.md](./03-les-packages/02-pourquoi-plusieurs-packages.md)
- [03-exporter-importer-et-third-party.md](./03-les-packages/03-exporter-importer-et-third-party.md)

### [04-les-pointeurs/](./04-les-pointeurs/)

Comprendre les pointeurs en Go : ce qu'ils sont, pourquoi ils existent, et comment travailler avec des adresses plutôt que des valeurs.

- [00-sommaire.md](./04-les-pointeurs/00-sommaire.md)
- [01-comprendre-et-utiliser-les-pointeurs.md](./04-les-pointeurs/01-comprendre-et-utiliser-les-pointeurs.md)
- [02-comment-travailler-avec-des-pointeurs.md](./04-les-pointeurs/02-comment-travailler-avec-des-pointeurs.md)

### [05-structs-et-custom-types/](./05-structs-et-custom-types/)

Les `struct` en Go : définition, création, ajout de méthodes et fonctions, exercice pratique.

- [00-sommaire.md](./05-structs-et-custom-types/00-sommaire.md)
- [01-les-structs.md](./05-structs-et-custom-types/01-les-structs.md)
- [02-methodes-et-fonctions-aux-structs.md](./05-structs-et-custom-types/02-methodes-et-fonctions-aux-structs.md)
- [03-exercice.md](./05-structs-et-custom-types/03-exercice.md)

### [06-interfaces-et-code-generique/](./06-interfaces-et-code-generique/)

Les interfaces en Go : définition, création et utilisation pour écrire du code générique et découplé.

- [00-sommaire.md](./06-interfaces-et-code-generique/00-sommaire.md)
- [01-creer-une-interface.md](./06-interfaces-et-code-generique/01-creer-une-interface.md)
- [02-utiliser-une-interface.md](./06-interfaces-et-code-generique/02-utiliser-une-interface.md)

### [07-arrays-slices-et-maps/](./07-arrays-slices-et-maps/)

Gérer des données relationnelles : tableaux (`arrays`), slices (sélection et approfondissement), maps, et utilisation de la boucle `for` avec ces structures.

- [00-sommaire.md](./07-arrays-slices-et-maps/00-sommaire.md)
- [01-introduction-aux-arrays.md](./07-arrays-slices-et-maps/01-introduction-aux-arrays.md)
- [02-slices.md](./07-arrays-slices-et-maps/02-slices.md)
- [03-approfondir-les-slices.md](./07-arrays-slices-et-maps/03-approfondir-les-slices.md)
- [04-introduction-aux-maps.md](./07-arrays-slices-et-maps/04-introduction-aux-maps.md)
- [05-boucle-for-avec-arrays-slices-maps.md](./07-arrays-slices-et-maps/05-boucle-for-avec-arrays-slices-maps.md)

### [08-approfondir-les-fonctions/](./08-approfondir-les-fonctions/)

Fonctions en tant que valeurs, types de fonctions, fonctions anonymes, fonctions récursives et variadiques.

- [00-sommaire.md](./08-approfondir-les-fonctions/00-sommaire.md)
- [01-fonctions-en-tant-que-valeurs.md](./08-approfondir-les-fonctions/01-fonctions-en-tant-que-valeurs.md)
- [02-fonctions-anonymes.md](./08-approfondir-les-fonctions/02-fonctions-anonymes.md)
- [03-fonctions-recursives-et-variadiques.md](./08-approfondir-les-fonctions/03-fonctions-recursives-et-variadiques.md)

### [09-projet-calculateur-de-prix/](./09-projet-calculateur-de-prix/)

Projet pratique : construire un calculateur de prix TTC depuis zéro, en intégrant progressivement les concepts vus (fichiers, packages, structs, JSON, gestion des erreurs).

- [00-sommaire.md](./09-projet-calculateur-de-prix/00-sommaire.md)
- [01-version-basique.md](./09-projet-calculateur-de-prix/01-version-basique.md)
- [02-integrer-data-depuis-fichier.md](./09-projet-calculateur-de-prix/02-integrer-data-depuis-fichier.md)
- [03-externaliser-dans-des-packages.md](./09-projet-calculateur-de-prix/03-externaliser-dans-des-packages.md)
- [04-stocker-data-json.md](./09-projet-calculateur-de-prix/04-stocker-data-json.md)
- [05-ajouter-et-travailler-avec-structs.md](./09-projet-calculateur-de-prix/05-ajouter-et-travailler-avec-structs.md)
- [06-gestion-des-erreurs.md](./09-projet-calculateur-de-prix/06-gestion-des-erreurs.md)

### [10-concurrency/](./10-concurrency/)

La concurrence en Go : goroutines, channels et différer l'exécution avec `defer`.

- [00-sommaire.md](./10-concurrency/00-sommaire.md)
- [01-les-goroutines.md](./10-concurrency/01-les-goroutines.md)
- [02-les-channels.md](./10-concurrency/02-les-channels.md)
- [03-defer.md](./10-concurrency/03-defer.md)

### [11-projet-rest-api/](./11-projet-rest-api/)

Projet complet : construire une API REST en Go — setup, routes, base de données SQL, CRUD, gestion des utilisateurs, authentification JWT, middleware et autorisation.

- [00-sommaire.md](./11-projet-rest-api/00-sommaire.md)
- [01-setup-du-projet.md](./11-projet-rest-api/01-setup-du-projet.md)
- [02-premiere-route.md](./11-projet-rest-api/02-premiere-route.md)
- [03-setup-bdd-sql.md](./11-projet-rest-api/03-setup-bdd-sql.md)
- [04-interactions-bdd.md](./11-projet-rest-api/04-interactions-bdd.md)
- [05-crud-events.md](./11-projet-rest-api/05-crud-events.md)
- [06-users-et-signup.md](./11-projet-rest-api/06-users-et-signup.md)
- [07-jwt-et-login.md](./11-projet-rest-api/07-jwt-et-login.md)
- [08-middleware-et-autorisation.md](./11-projet-rest-api/08-middleware-et-autorisation.md)
- [09-registration-evenements.md](./11-projet-rest-api/09-registration-evenements.md)

### [12-frameworks/](./12-frameworks/)

Panorama des frameworks Go pour le développement web et la construction d'APIs.

- [01-frameworks.md](./12-frameworks/01-frameworks.md)

### [13-projet-gamebook/](./13-projet-gamebook/)

Projet gamebook : roadmap et spécifications du projet pratique.

- [01-roadmap.md](./13-projet-gamebook/01-roadmap.md)
- [02-specs.md](./13-projet-gamebook/02-specs.md)

## Contenu du dossier `14-kits-apprenants/`

Kits de révision et fiches récapitulatives pour les apprenants.

- [go-apprenant-1-1j.md](./14-kits-apprenants/go-apprenant-1-1j.md)
- [go-apprenant-2-1j.md](./14-kits-apprenants/go-apprenant-2-1j.md)
- [go-apprenant-debutant-1j-final.md](./14-kits-apprenants/go-apprenant-debutant-1j-final.md)

## Conseil de progression

- suivre l'ordre numéroté des modules ;
- lire le `00-sommaire.md` de chaque module pour avoir une vue d'ensemble avant d'entrer dans les détails ;
- faire le projet calculateur (09) après avoir lu les modules 02 à 08 ;
- faire le projet REST API (11) après avoir lu le module 10 (concurrence).

