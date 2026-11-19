# Itération 1 : Prise en main

*Kit Java « La Malédiction de l'île du Crâne » (titre de travail)*

## Modalités

* Travail **individuel**, en autonomie.
* Durée indicative : **2 jours**.
  * Jour 1 : installer les outils, créer le projet, calculer avec `/` et `%`.
  * Jour 2 : répéter avec une boucle et une condition, tester les cas limites.
* Tu produis un petit projet Maven, versionné avec Git, qui contient un seul fichier : `Main.java`.

## Ce que le programme sait faire à la fin

Le capitaine doit embarquer **47 tonneaux de rhum** sur la chaloupe. Elle ne peut en porter que **8 par voyage**. Ton programme calcule le plan de chargement et l'affiche :

```
Voyages complets : 5
Tonneaux restants : 7

Voyage 1 : 8 tonneaux
Voyage 2 : 8 tonneaux
Voyage 3 : 8 tonneaux
Voyage 4 : 8 tonneaux
Voyage 5 : 8 tonneaux
Voyage 6 : 7 tonneaux
Total embarqué : 47 tonneaux, voyages effectués : 6
```

Ce n'est pas encore un jeu, mais c'est ton premier programme complet : il calcule, répète et décide. Le projet que tu crées ici sera celui du jeu complet, jusqu'à l'itération 10.

## Compétences visées

* Installer et utiliser le JDK 21 et IntelliJ IDEA.
* Créer un projet Maven, compiler et exécuter un programme, avec l'IDE et **à la main**.
* Déclarer des variables de type `int`.
* Calculer avec la division entière et le modulo.
* Écrire une boucle et une condition.
* Versionner son code avec Git : un commit par étape, une étiquette par itération.

## Boîte à outils

Avant de commencer, repère ces chapitres du cours. Tu n'as pas besoin de tout lire : consulte les sections quand l'étape en parle.

| Chapitre | Sections utiles |
| --- | --- |
| [1. Mon premier programme](01-premier-programme.md) | Mon premier projet ; Compilation et exécution ; Le faire à la main |
| [2. Les variables](02-variables.md) | Déclaration, initialisation, utilisation ; Les nombres entiers ; Bien nommer ses variables |
| [3. Les opérateurs](03-operateurs.md) | Multiplication et division ; Le modulo ; Le piège de la division entière ; Concaténer du texte avec des nombres ; Les opérateurs unaires |
| [4. Les structures de contrôle](04-structures-de-controle.md) | `if ... else` ; La boucle `while` ; Attention aux boucles infinies |

Documentation officielle :

* [Dev.java : Your First Steps in Java](https://dev.java/learn/first-steps/).
* [Dev.java : créer une application avec IntelliJ IDEA](https://dev.java/learn/first-steps/using-ides/intellij-idea/).
* [Documentation de la commande `javac` (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html) et [de la commande `java` (JDK 21)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html).
* [Dev.java : les instructions de contrôle de flux](https://dev.java/learn/language/constructs/basics/controlling-flow/).

## Jour 1 : le projet et le calcul

### Étape 1 : Préparer les outils

Installe **IntelliJ IDEA** (la version Community suffit) et **Git**. Le **JDK 21** peut être téléchargé par IntelliJ au moment de créer le projet.

Dans un terminal, vérifie que Git est installé :

```bash
git --version
```

### Étape 2 : Compiler un premier programme à la main

Dans un dossier `sandbox` en dehors de tout projet, écris `Main.java` avec le salut de pirate du chapitre 1, compile avec `javac Main.java`, puis lance avec `java Main`. Si tu as déjà fait ce chapitre, passe à l'étape suivante.

Le but : voir que `javac` fabrique un fichier `Main.class`, et que `java` exécute ce fichier. Tu referas la même chose avec ton vrai projet à l'étape 9.

### Étape 3 : Créer le projet Maven

Dans IntelliJ, crée un nouveau projet :

* **Name** : `pirates-adventure` ;
* **Build system** : **Maven** ;
* **JDK** : **21** ;
* **Add sample code** : coché ;
* dans les options avancées, **GroupId** : `com.pirates.adventure`.

`com.pirates.adventure` sera le **package racine** de tout le kit. Ne modifie pas la ligne `package ...;` qu'IntelliJ place éventuellement en haut de `Main.java` : tu apprendras à organiser les packages à l'itération 3.

Remplace le contenu de la méthode `main` pour qu'elle n'affiche qu'une ligne :

```java
System.out.println("Ahoy, matey !");
```

Lance le programme avec la flèche verte.

### Étape 4 : Initialiser Git

À la **racine du projet** (le dossier qui contient `pom.xml`), dans un terminal :

```bash
git init
```

Vérifie qu'un fichier `.gitignore` existe. Sinon, crée-le avec ce contenu : les fichiers générés ne doivent pas être versionnés.

```
target/
.idea/
out/
```

Puis fais ton premier commit :

```bash
git add .
git commit -m "Projet Maven et premier salut"
```

> **Un commit par étape.** Un commit est une photo de ton projet à un instant donné, avec un message qui dit ce que tu viens de faire. Si une étape suivante casse tout, tu peux revenir à la photo précédente. Pour approfondir, lis [Pro Git](https://git-scm.com/book/fr/v2), en particulier le chapitre « Les bases de Git ».

### Étape 5 : Calculer avec `/` et `%`

Dans `main`, déclare le nombre de tonneaux et la capacité de la chaloupe dans deux variables `int` bien nommées (nomme-les en anglais) :

* 47 tonneaux au total ;
* 8 tonneaux par voyage.

Calcule ensuite, avec deux opérations différentes :

* le nombre de **voyages complets** ;
* le nombre de **tonneaux restants** pour un dernier voyage.

Affiche les deux résultats comme dans l'exemple (« Voyages complets : 5 », « Tonneaux restants : 7 »). Vérifie ce que tu obtiens, et fais un commit : `git commit -am "Voyages complets et reste"`.

> Pas de valeurs écrites en dur dans les calculs : le `47` et le `8` apparaissent **une seule fois**, à l'initialisation des variables. Ainsi, tu pourras tester d'autres valeurs en changeant une seule ligne.

**Solution de l'étape 5 :**

```java
int totalBarrels = 47;
int barrelsPerTrip = 8;

int fullTrips = totalBarrels / barrelsPerTrip;   // 5 : division entière
int leftover = totalBarrels % barrelsPerTrip;    // 7 : le reste
System.out.println("Voyages complets : " + fullTrips);
System.out.println("Tonneaux restants : " + leftover);
```

Que se passe-t-il si tu écris `47 / 8.0` ? Essaie, et relis la section sur le piège de la division entière du chapitre 3.

## Jour 2 : répéter et décider

### Étape 6 : pause de réflexion sur le choix de la boucle

Il faut maintenant afficher une ligne par voyage : « Voyage n : x tonneaux », y compris le dernier voyage, qui n'est pas plein.

**Avant de coder, réponds sur papier :**

1. Combien de fois la boucle doit-elle tourner pour 47 tonneaux ? Et pour 48 ?
2. Quelle boucle choisis-tu (`for` ou `while`) ?
3. À chaque tour, comment sais-tu combien de tonneaux sont embarqués ?

Prends cinq minutes, puis lis la solution.

**Solution de la pause de réflexion :**

1. 6 voyages pour 47 tonneaux (5 pleins et 1 incomplet) ; 6 voyages aussi pour 48 (tous pleins). Le nombre de tours n'est donc pas `totalBarrels / barrelsPerTrip` : il faut ajouter un tour quand il reste des tonneaux.
2. Les deux sont possibles. Avec un `for`, il faut calculer le nombre de tours à l'avance (voyages complets, plus un si le reste n'est pas nul). Avec un `while`, on écrit simplement « **tant qu'il reste des tonneaux à embarquer** » : on n'a pas besoin de calculer le nombre de tours. C'est la solution proposée ici.
3. À chaque tour, on embarque 8 tonneaux s'il en reste au moins 8, sinon on embarque tout ce qui reste. C'est une **condition**.

### Étape 7 : Écrire la boucle

Après l'affichage de l'étape 5, ajoute une ligne vide (`System.out.println();`) puis une boucle `while` qui s'arrête quand il ne reste plus de tonneaux. Tu as besoin de :

* une variable pour le nombre de tonneaux **restant à embarquer** (initialisée au total) ;
* une variable pour le **numéro du voyage** (qui commence à 1) ;
* dans la boucle, une variable `load` : le nombre de tonneaux de **ce** voyage, calculé avec un `if ... else` ;
* l'affichage de la ligne « Voyage n : x tonneaux » ;
* la mise à jour des deux variables à la fin du tour.

Termine par une ligne de total, comme dans l'exemple, en réutilisant le numéro du voyage. Fais un commit : `git commit -am "Boucle de chargement"`.

**Solution de l'étape 7 :**

```java
System.out.println();

int remainingBarrels = totalBarrels;
int tripNumber = 1;
while (remainingBarrels > 0) {
    int load;
    if (remainingBarrels >= barrelsPerTrip) {
        load = barrelsPerTrip;
    } else {
        load = remainingBarrels;
    }
    System.out.println("Voyage " + tripNumber + " : " + load + " tonneaux");
    remainingBarrels = remainingBarrels - load;
    tripNumber++;
}
System.out.println("Total embarqué : " + totalBarrels + " tonneaux, voyages effectués : " + (tripNumber - 1));
```

* `tripNumber` est incrémenté **après** l'affichage, il vaut donc 7 à la sortie de la boucle : on affiche `tripNumber - 1`.
* Si tu oublies la ligne `remainingBarrels = remainingBarrels - load;`, la condition de la boucle reste vraie : c'est une **boucle infinie**. Dans IntelliJ, le bouton d'arrêt rouge de la console interrompt le programme.

### Étape 8 : Tester les cas limites

Un programme qui marche pour 47 ne marche pas forcément pour toutes les valeurs. Change la valeur de `totalBarrels`, relance, et compare avec ce que tu attends **avant** de lire le résultat :

| `totalBarrels` | Résultat attendu |
| --- | --- |
| 48 | 6 voyages, tous de 8 tonneaux, pas de dernier voyage incomplet |
| 8 | 1 voyage de 8 tonneaux |
| 7 | 1 voyage de 7 tonneaux, 0 voyage complet |
| 0 | Aucun voyage |

Remets 47, puis fais un commit : `git commit -am "Cas limites vérifiés"` (s'il n'y a rien à valider, c'est que tu as remis la valeur de départ : passe à l'étape suivante).

### Étape 9 : Compiler et lancer à la main

Dans un terminal, à la racine du projet, compile avec `javac` et lance avec `java`, comme au chapitre 1, mais en tenant compte du package :

```bash
javac -d out src/main/java/com/pirates/adventure/Main.java
java -cp out com.pirates.adventure.Main
```

* `-d out` demande à `javac` de ranger le `.class` dans le dossier `out`, en recréant les dossiers du package ;
* `-cp out` (*classpath*) dit à `java` où chercher les classes ;
* `com.pirates.adventure.Main` est le **nom complet** de la classe : package, puis nom.

Si la première ligne de ton fichier n'est pas `package com.pirates.adventure;`, adapte le chemin et le nom complet à ce que tu as réellement. Le dossier `out` est dans le `.gitignore` : il ne sera pas versionné.

### Étape 10 : Marquer la fin de l'itération

Crée le glossaire (voir **Livrables**), fais un dernier commit, puis pose une **étiquette** (*tag*) sur ce commit :

```bash
git tag iteration-1
```

Une étiquette donne un nom stable à une version : tu pourras toujours retrouver le code tel qu'il était à la fin de cette itération.

## Conseils et contraintes

* La méthode `main` reste courte (environ 15 lignes). Ici elle va dépasser un peu : ce n'est pas grave à cette itération, tu apprendras à la découper en méthodes à l'itération 2.
* Pas de nombre « magique » dans les calculs : utilise des variables.
* Les noms de variables sont **en anglais**, en `camelCase`, et disent ce qu'elles contiennent.
* Relance le programme après **chaque** modification, pas seulement à la fin.
* Lis les messages d'erreur en entier : ils indiquent le fichier, la ligne et la nature du problème.
* Les messages affichés au joueur restent en français.

## Pour aller plus loin

* **Plusieurs chaloupes :** une deuxième chaloupe porte 5 tonneaux par voyage. Affiche le plan de chargement pour les deux.
* **Un autre calcul du nombre de voyages :** trouve une formule qui calcule le nombre total de voyages (6 pour 47) **sans** `if`, avec seulement `/`, `+` et `-`.
* **Saisie au clavier :** lis le nombre de tonneaux avec `Scanner` (chapitre 2) au lieu de l'écrire dans le code.
* **Le plus court :** réécris le calcul de `load` avec `Math.min` (chapitre 3) et compare avec ton `if ... else`.

## Livrables

À la fin de l'itération :

* le projet `pirates-adventure`, avec son historique **Git** (un commit par étape) et l'étiquette `iteration-1` ;
* un fichier `GLOSSARY.md` à la racine du projet, que tu complèteras à chaque itération, avec la liste des syntaxes rencontrées ;
* il n'y a pas encore de classes : le **diagramme de classes** sera produit à partir de l'itération 3.

Modèle de glossaire (ajoute une ligne pour chaque syntaxe nouvelle) :

| Syntaxe | Ce qu'elle fait | Exemple dans mon code | Chapitre |
| --- | --- | --- | --- |
| `int x = 5;` | déclare et initialise une variable entière | `int totalBarrels = 47;` | 2 |
| `a / b` | division (entière si `a` et `b` sont des `int`) | | 3 |
| `a % b` | reste de la division | | 3 |
| `while (condition) { ... }` | répète tant que la condition est vraie | | 4 |
| `if ... else` | exécute l'un ou l'autre bloc | | 4 |
| `x++` | ajoute 1 à `x` | | 3 |

## Auto-évaluation

Tu as terminé l'itération 1 si tu peux répondre oui à toutes ces questions :

* Ton programme affiche le bon plan pour 47, 48, 8, 7 et 0 tonneaux ?
* Peux-tu expliquer, sans regarder, pourquoi `47 / 8` vaut 5 et `47 % 8` vaut 7 ?
* Sais-tu dire ce que fait `javac` et ce que fait `java` ?
* Ton dépôt Git contient plusieurs commits et l'étiquette `iteration-1` ?
