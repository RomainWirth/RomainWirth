# Java et Springboot

## Historique

Java est un langage et un ensemble de classes prévues pour la programmation générale.<br>
Pour programmer plus rapidement dans certains domaines, il a fallu mettre en place des extensions.<br>
Cela a concerné les domaines professionnels qui avaient besoin :
* de créer des connexions avec des BDD.
* de faciliter les architectures MVP pour le web avec les Servlets (contrôleurs) et JSP (templates pour les vues).
* de divers aspects d'architecture et outils (inversion de dépendances, XML,, convention "Beans", connecteur mail, etc.)

Cela a donné lieu à J2EE (Java 2 Enterprise Edition), nommé ensuite Java Enterprise Edition puis Jakarta_EE.<br>
<a href="https://en.wikipedia.org/wiki/Jakarta_EE">source</a>

Les premières versions de J2EE/JEE étaient considérées à la fois très intéressantes et difficiles à appréhender pour la mise en œuvre.<br>
Des multiples efforts ont été menés et se sont inspirés de J2EE. C'est ainsi que Spring est né.<br>
<a href="https://fr.wikipedia.org/wiki/Spring_(framework)">Spring framework wiki</a>

Avant de voir ce qu'est Spring boot, voyons ce qu'est Spring.

## Qu'est-ce que Spring ?

Il s'agit d'un framework open source pour créer et définir l'infrastructure d'une application Java, dont il facilite le développement et les tests.<br>
Spring est un conteneur dit "léger" qui s'appuie sur 3 concepts clés :
1. Inversion de contrôler assurée de deux façons différentes : la recherche et dépendances et l'injection de dépendances ;
2. La programmation orientée aspect ;
3. Une couche d'abstraction ;

La couche d'abstraction permet d'intégrer d'autres frameworks et bibliothèques avec une plus grande facilité.<br>
Cela se fait par l'apport ou non de couches d'abstraction spécifiques à des frameworks particuliers. On peut ainsi intégrer un module d'envoi de mails plus facilement.<br>

L'inversion de contrôle :
* La recherche de dépendance consiste pour un objet à interroger le conteneur afin de trouver ses dépendances avec les autres objets. (cas de fonctionnement similaire aux EBJs)
* L'injection de dépendances peut être effectuées de 3 manières possibles :
  1. Via le constructeur
  2. via les modificateurs (setters)
  3. via une interface

Les deux premières sont les plus utilisées par Spring.

Grâce à sa couche d'abstraction, ce framework ne concurrence pas d'autres frameworks dans une couche spécifique d'un modèle architectural : modèle-vue-contrôleur.<br>
Il s'agit plutôt d'un framework multi-couches pouvant s'insérer au niveau de toutes les couches : modèle, vue et contrôleur.<br>

### Composition de Spring

Spring est composé d'un noyau basé sur :
* Une fabrique générique de composants informatiques, composants nommés "beans" (grains de café dans le contexte de Java).
* Un conteneur capable de stocker ces beans.

Le noyau de Spring permet de forcer le contrôle de ces composants de leur extérieur par la technique appelée : inversion de contrôle.<br>
Le principal avantage est de composer les beans de façon plus déclarative plutôt que de façon impérative dans le programme.<br>
Les beans peuvent être définis par le biais de fichiers de configuration en Java ou XML.

### En résumé

L'idée principale est d'avoir des composants (Beans) d'une application (en général web) qui peuvent être assemblés de façon dynamique pour réaliser cette application.<br>
Ces composants sont définis par l'interface qu'ils implémentent (contrat) et l'instance effective des composants découle de la configuration de l'application.<br>
Cela permet de facilement changer les composants de l'application (découplage) pour par exemple :<br>
* avoir une version avec stockage local, une version avec un stockage web dans une base MongoDB.<br>
* remplacer un composant qui sera disponible en production par un composant "mimant" son fonctionnement et permettre de tester le reste de l'application (principe des "mock/stub" ou "simulacre/bouchon").<br> 
cf. : <a href"https://www.test-recette.fr/tests-techniques/deployer-tests-unitaires/simulacres-bouchons/">simulacres et bouchons</a>

## Spring Boot

### Différence entre Spring et Spring boot

Spring boot simplifie l'utilisation de Spring.<br> 
Spring boot est construit sur le framework Spring conventionnel : il offre toutes les fonctionnalités de Spring et est encore plus facile à utiliser.<br>
Spring boot est un framework basé sur des microservices et crée une application prête pour la production en très peu de temps.<br>

Tout est configuré automatiquement. On a juste besoin d'utiliser une configuration appropriée pour utiliser une fonctionnalité particulière.<br>
Spring boot est très utile si on veut développer une API REST.<br>

<a href="https://stacklima.com/difference-entre-spring-et-spring-boot/">source</a>

Pour simplifier la configuration, Spring Boot propose deux fonctionnalités principales :
1. L'autoconfiguration.
2. Les starters.

### L'autoconfiguration 

Il s'agit de la fonctionnalité la plus importante de Spring Boot.<br>
Elle permet de configurer automatiquement une application à partir des JAR trouvé dans le classpath.<br>
Autrement dit : si on a importé des dépendances, Spring Boot ira consulter cette liste puis produira la configuration nécessaire pour que tout fonctionne correctement.<br>

```
N.B. : 
Un fichier JAR (Java archive) est un fichier ZIP utilisé pour distribuer un ensemble de classes Java. 
Ce format est utilisé pour stocker les définitions des classes, ainsi que des métadonnées, constituant l'ensemble d'un programme.
```

Il est possible de facilement personnaliser ces configurations en créant ses propres Beans ou ses propres fichiers de configuration.<br>
Spring boot utilisera alors en priorité ces paramètres créés.

### Les Starters

Les starters viennent compléter l'autoconfiguration et font gagner du temps, particulièrement lorsqu'on commence le développement d'un microservice.<br>
Un starter va apporter à l'ensemble d'un projet un ensemble de dépendances, communément utilisées pour un type de projet donné.<br>
Cela va permettre de créer un "squelette" prêt à l'emploi, et cela très rapidement.<br>

L'autre énorme avantage est la gestion des versions.<br>
Plus besoin de chercher quelles sont les versions compatibles puis de les ajouter une à une dans le `pom.xml`.<br>
Il suffit d'ajouter une simple dépendance au starter choisi. Cette dépendance va alors ajouter les éléments dont elle dépend avec les bonnes versions.<br>

En temps normal, pour créer un microservice, il faut les dépendances suivantes : Sping, Spring MVC, Jackson (pour JSON), Tomcat...<br>
Avec Spring Boot, on va tout simplement avoir une seule dépendance dans le `pom.xml`.<br>

### En résumé 

* Spring Boot est un framework qui permet de démarrer rapidement le développement d'applications ou services, en fournissant les dépendances nécessaires et en autoconfigurant celles-ci.
* Pour activer l'autoconfiguration, on utilise l'annotation `@EnableAutoConfiguration`. Si vous écrivez vos propres configurations, celles-ci priment sur celles de Spring Boot.
* Les starters permettent d'importer un ensemble de dépendances selon la nature de l'application à développer, afin de démarrer rapidement.

## Créer un microservice grâce à Spring Boot

### Spring Initializr

Spring Initializr permet de composer une application selon ses besoins.

Pour débuter : <a href="https://start.spring.io/">https://start.spring.io/ </a>

