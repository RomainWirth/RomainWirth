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

Sélectionner : 
* le gestionnaire de projet (Maven ou Gradle)
* le langage Java (Kotlin ou Groovy)
* la version de SpringBoot

On peut initialiser :
* Les métadonnées du projet
* le packaging et la version de Java
* et les dépendances grâce au bouton "Add dependencies"

### Créer et importer à partir de Spring Initializr

Renseigner les Metadata du projet :
* Groupe : `com.nom_du_projet` // ici ecommerce
* Artifact : `microservice` // à modifier selon le projet
* Name : `microservice` // à modifier selon le projet
* Packaging : `jar`
* Java Version : `11` (ou ultérieur)

Sélectionner ensuite le starter Web.<br>
Cliquer sur "Generate Project" et télécharger l'application générée.<br>
Penser à créer un dossier racine au projet et procéder à l'extraction de l'application téléchargée qui devrait s'appeler "microservice.zip" (selon le nom renseigné dans les metadata).<br>
Dans IntelliJ, cliquer sur "File", puis "Open" et sélectionner le dossier de l'application extrait précédemment.<br>

dans l'arborescence, on retrouve :

#### pom.xml

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>2.7.15</version>
  <relativePath/> <!-- lookup parent from repository -->
</parent>

<properties>
  <java.version>11</java.version>
</properties>

<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies> 
```

On peut retrouver la liste des dépendances importées dans "External Libraries".<br>
Dans cette liste on retrouve principalement :
* **Jackson** : permet de parser JSON et faire le lien entre les classes Java et le contenu JSON.
* **Tomcat** : intégré, il permet de lancer l'application en exécutant tout simplement le JAR sans avoir à le déployer dans un serveur d'application.
* **Hibernate** : facilite la gestion des données.
* **Logging** : remonte ce qui se passe dans l'application grâce à logback et autres.

#### MicroserviceApplication.java

Classe générée automatiquement par Spring Boot, elle est le point de démarrage de l'application :
```java 
package com.ecommerce.microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication

public class MicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicrommerceApplication.class, args);
	}

}
```
Cette classe lance la classe SpringApplication, responsable du démarrage de l'application Spring.<br>
Elle va créer le fameux _ApplicationContext_ dans lequel iront toutes les configurations générées automatiquement ou qu'on aura ajoutées.<br>

l'annotation **@SpringBootApplication** est l'information la plus importante : elle encapsule 3 annulations :
1. **@Configuration** : donne à la classe actuelle la possibilité de définir des configurations qui iront remplacer les traditionnels fichiers XML.<br> 
Ces configurations se font via des Beans.
2. **@EnableAutoConfiguration** : cette annotation permet, au démarrage de Spring, de générer automatiquement les configs nécessaires en fonction des dépendances situées dans le classpath.<br>
3. **@ComponentScan** : indique qu'il faut scanner les classes de ce package afin de trouver des Beans de configuration.<br>

Pour personnaliser finement le comportement de Spring Boot, on peut remplacer cette annotation : @SpringBootApplication par les 3 annotations vu ci-dessus :
```java 
...
...

@Configuration
@EnableAutoConfiguration
@ComponentScan

public class MicroserviceApplication {
...
...
}
```

#### application.properties

Ce fichier va permettre de modifier très simplement un nombre impressionnant de configurations liées à Spring Boot et à ses dépendances.<br>
par exemple : changer le port d'écoute de Tomcat, l'emplacement des fichiers de log, les paramètres d'envoi d'emails, etc.<br>
voir la <a href="https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html">liste complète</a>

#### MicroserviceApplicationTests.java

Ce fichier permet d'écrire les tests.

### Exécuter l'application

malgré le fait qu'on ait encore rien ajouté à l'application, on peut déjà l'exécuter.<br>

```
N.B. :
Dans IntelliJ, si le panneau "Maven" à droite n'apparaît pas, il faudra l'activer : en bas à gauche sur le double lozange.
```

Cliquer sur le panneau de droite "Maven", puis ouvrir l'arborescence.<br>
Double-cliquer ensuite sur "Install" sous "LifeCycle". 

L'application sera compilée, et on retrouve le JAR sous le nouveau dossier "Target" créé pour l'occasion par Maven.

On peut ensuite exécurer l'application depuis n'importe quel terminal avec la commande :
```bash
java -jar Chemin/vers/microservice/target/microservice-0.0.1-SNAPSHOT.jar
```
**Ou par le bouton "RUN" d'IntelliJ dans le fichier `MicroserviceApplication.java` à la ligne de la classe.**

On aura alors un retour du type : 
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::               (v2.7.15)

2023-08-29 12:05:25.530  INFO 19440 --- [           main] c.e.micrommerce.MicrommerceApplication   : Starting MicrommerceApplication using Java 18.0.2 on user-HP-ProDesk-600-G3-SFF with PID 19440 (/home/user/Cours/Java_Springboot/projet_test/micrommerce/target/classes started by user in /home/user/Cours/Java_Springboot/projet_test/micrommerce)
2023-08-29 12:05:25.532  INFO 19440 --- [           main] c.e.micrommerce.MicrommerceApplication   : No active profile set, falling back to 1 default profile: "default"
2023-08-29 12:05:26.071  INFO 19440 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2023-08-29 12:05:26.077  INFO 19440 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2023-08-29 12:05:26.077  INFO 19440 --- [           main] org.apache.catalina.core.StandardEngine  : Starting Servlet engine: [Apache Tomcat/9.0.79]
2023-08-29 12:05:26.131  INFO 19440 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2023-08-29 12:05:26.131  INFO 19440 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 567 ms
2023-08-29 12:05:26.363  INFO 19440 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2023-08-29 12:05:26.370  INFO 19440 --- [           main] c.e.micrommerce.MicrommerceApplication   : Started MicrommerceApplication in 1.08 seconds (JVM running for 1.52)

```

On peut remarque cette phrase : "Tomcat started on port(s): 8080 (http)".<br>
Cela indique que l'application tourne et qu'elle est en écoute grâce à Tomcat sur le port 8080.<br>
Dans le navigateur, on peut aller à l'adresse : <a href="http://localhost:8080/">http://localhost:8080/ </a> <br>
Cela affiche une erreur actuellement car on a fourni aucun éléments à afficher.

On peut essayer de personnaliser la personnalisation de l'autoconfiguration de Spring Boot avec **application.properties**.<br>
par exemple, on peut ajouter dans ce fichier : `server.port=9090` puis rerun l'application à partir du fichier **MicroserviceApplication.java**<br>
et aller à l'adresse <a href="http://localhost:9090/">http://localhost:9090/ </a> dans le navigateur pour obtenir le même affichage.<br>
On a simplement modifié le port d'écoute.<br>

### Créer une API REST

Le microservice qu'on souhaite développer va devoir être RESTful et donc communiquer de cette manière.<br>

#### Définition des besoins 

On va avoir besoin d'un **microservice** qui sera capable de gérer les produits.<br>
Il devra pouvoir exposer une API REST qui propose toutes les opérations CRUD (Create, Read, Update, Delete).<br>

On va donc devoir :
* créer une classe Produit qui représente les caractéristiques d'un produit (nom, prix, etc.).
* créer un contrôleur qui s'occupera de répondre aux requeêtes CRUD et de faire des opérations nécessaires.

On voudra donc pouvoir appeler le microservice sur les URL suivantes :
* Requête **GET** à **/produits** : affiche la liste de tous les produits.
* Requête **GET** à **/produits/{id}** : affiche un produit par son Id.
* Requête **PUT** à **/produits/{id}** : met à jour un produit par son Id.
* Requête **POST** à **/produits** : ajoute un produit.
* Requête **DELETE** à **/produits/{id}** : supprime un produit par son Id.

#### Créer le contrôleur REST

On va créer un contrôleur et le placer dans un package "controller", lui même situé dans un package "web".<br>
Procéder ainsi :<br> 
* clic droit sur le package principal : **com.ecommerce.microservice**
* puis : New > Java Class
* écrire dans la boîte de dialoque : **web.controller.ProductController**

Quand on clique sur OK, IntelliJ crée un _package web_, puis crée à l'intérieur de celui-ci un package controller.<br>
La classe ProductController est alors créée à l'interieur de ce dernier package.

Dans la fichier (la classe) ProductController, on va saisir le code suivant :
```java 
package com.ecommerce.microcommerce.web.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

}
```
l'annotation `@RestController` est la combinaison de deux annotations : `@Controller` et `@ResponseBody`.
* **@Controller** permet de désigner une classe comme controller, lui donnant la capacité de traiter les requêtes GET, POST, etc.
* **@ResponseBody** est ajouté aux méthodes qui devront directement répondre sans passer par une vue.

=> **@RestController** indique que la classe va pouvoir traiter les requêtes qu'on va définir et il indique que chaque méthode va renvoyer une réponse JSON à l'utilisateur.

```
N.B. : 
par convention, les conventions de nommage des API REST est ainsi :
* tout en camelCase et au pluriel !
* en anglais !
```

##### Méthode pour GET /products

Cette méthode retourne une "String".<br>
Etant donné qu'on a pas encore de produits, on va simplement retourner une phrase pour tester :

```java
package com.ecommerce.micrommerce.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {

   @GetMapping("/products")
   public String productsList() {
       return "Product example";
   }

}
```

Dans les anciennes versions de Spring, on aurait utilisé : `@RequestMapping(value="/products", method=RequestMethod.GET)`.<br>
Cette méthode prends deux paramètres :
* **value** qui sert à définir l'URL sur laquelle on peut atteindre la méthode.
* **method** qui définit le verbe HTTP pour interroger l'URL.

Les nouvelles annotations sont les suivantes : **@GetMapping**, **@PostMapping**, **@PutMapping**, **DeleteMapping**.<br>
Ces méthodes permettent de ne spécifier que l'URL pour en utilisant le verbe HTTP lié (présent juste avant le mapping).<br>

Dans le code ci-dessus, on utilise l'annotation `@GetMapping` qui permet de faire le lien entre l'URL "/products", invoquée via GET et la méthode productsList.<br>
Cette annotation prend <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/GetMapping.html">plusieurs paramètres</a> dont voici les principaux :
* **value** = URL à laquelle cette méthode doit répondre.
* **produces** = dans certains cas d'utilisation avancées, on aura besoin de préciser si la méthode est capable de répondre en XML ou en JSON.<br>
Si la requête contient du XML et qu'on a deux méthodes identiques dont une capable de produire du XML, c'est cette dernière qui sera appelée.<br>
C'est la même chose pour **consumes** qui précise les formats acceptés. Dans la plupart des cas, on a pas besoin de renseigner ces paramètres.

##### Méthode pour GET /products/{id}

Cette méthode est à ajouter à la suite de la précédent et s'écrit comme ça :
```java
    @GetMapping("/products/{id}")
    public String displayProduct(@PathVariable int id) {
        return "You asked for a proudct with the id : " + id;
    }
```
On remarque l'ajout de l'`id` à l'URL. Cette notation permet d'indiquer que cette méthode doit répondre uniquement aux requêtes avec une URI de type `/products/25` par exemple.<br>
`@Pathvariable int id` indique que l'id retournée doit être un integer. Ainsi on ne pourra pas passer de chaîne de caractères. Sinon on aura une erreur.<br>

##### Renvoyer une réponse JSON

Pour commencer, on va créer une classe qui représente un produit. Cette classe s'appelle "Model" (ou "Bean" plus anciennement, ou POJO pour Plain Old Java Object).<br>
**Un Model est une classe classique** qui doit être "sériablisable" et avoir au minimum :
* un constructeur public sans arguments.
* des getters et setters pour toutes les propriétés de la classe.

On va donc créer une nouvelle classe "Product" qu'on va place dans un package "model" sous le package "microservice".
On va ensuite créer les propriétés de base de la classe :
```java
package com.ecommerce.micrommerce.model;

public class Product {
  private int id;
  private String nom;
  private int prix;
}
```

En va générer ensuite le constructeur, les getters et les setters.<br>
`Alt` + `insert` (ou clic droit puis Générer) pour afficher la fenêtre de génération de code :
* Constructor : dans lequel on précise "sans arguments".
* Getters et Setters pour toutes les propriétés.
* methode toString().
* On ajoutera enfin un constructeur pour obtenir des instances de produits préremplies avec des informations de tests.

Le code obtenu devra ressembler à cela :
```java
package com.ecommerce.micrommerce.model;

public class Product {
    private int id;
    private String name;
    private int price;

    public Product() {
    }

    public Product(int id, String name, int price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                '}';
    }
}
```
A chaque fois que quelqu'un appelera l'URL "/products/{od}", on renverra un produit au format JSON qui correspond à la classe Product.<br>

Dans la classe ProductController, on va modifier la méthode displayProduct, le code complet de la classe sera le suivant :
```java
package com.ecommerce.micrommerce.web.controller;

import com.ecommerce.micrommerce.model.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProductController {
  @GetMapping("/products")
  public String productsList() {
    return "Product example";
  }

  @GetMapping("/products/{id}")
  public Product displayProduct(@PathVariable int id) {
    Product product = new Product(id, new String("Aspirateur"), 100);
    return product;
  }
}
```

```
N.B. :
La syntaxe exacte à la place de celle ci-dessus est celle ci :
return product = new Product(id, new String("Aspirateur"), 100);
```

On indique ici que la méthode va retourner un "Product" au lieu d'une String.<br>
La réponse dans le navigateur sera formatée au format JSON.<br> 
Cela est possible car on a indiqué au début de la classe qu'elle est un contrôleur REST grâce à l'annotation @RestController.<br>
Spring sait alors que les réponses aux requêtes qu'il passe devront être très probablement au format JSON.

L'autoconfigurateur va alors chercher si on a une dépendance capable de transformer un objet Java en JSON dans notre classpath et inversement.<br>
Il y a Jackson qui a été importé avec le starter qu'on a utilisé. Le Bean Product qu'on renvoit est donc transformé en JSON, puis servi en réponse.

Voici donc le premier microservice REST sans avoir à manipuler JSON ni a parser les requêtes HTTP.

### Communiquer avec la Base De Données 
#### Création du DAO

**DAO = Data Access Object**<br>
Il s'agit d'une "responsabilité". Elle permet d'accéder au système d'information pour lire ou modifier des données.<br>
Les classes DAO (qui contiennent le suffixe ...Dao) sont des classes qui contiennent le code qui permet d'échanger des informations avec la base de données.<br>

Pour cela, on va procéder comme suit :
* création d'un package appelé "dao".
* dans ce package, on ajoute une interface qu'on appelle "ProductDao". On va y déclarer les opérations qu'on veut implémenter :
  * _findAll_ = renvoie la liste complète de tous les produits
  * _findById_ = renvoie un produit par son id
  * _save_ = ajoute un produit

```java
package com.ecommerce.micrommerce.web.dao;

import com.ecommerce.micrommerce.web.model.Product;

import java.util.List;

public interface ProductDao {
  List<Product> findAll();
  Product findById(int id);
  Product save(Product product);
}
```

A partir de cette interface, on va ajouter une classe pour créer l'implémentation : "ProductDaoImplement".<br>
Etant donné qu'on ne dispose pas de base de données avec laquelle communiquer, on va simuler son comportement en créant des produits "en dur" :
```java
package com.ecommerce.micrommerce.web.dao;

import com.ecommerce.micrommerce.web.model.Product;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductDaoImplement implements ProductDao{
   public static List<Product> products = new ArrayList<>();

   static {
       products.add(new Product(1, "Ordinateur portable", 350));
       products.add(new Product(2, "Aspirateur Robot", 500));
       products.add(new Product(3, "Table de Ping Pong", 750));
   }

   @Override
   public List<Product> findAll() {

       return products;
   }

   @Override
   public Product findById(int id) {
       for (Product product : products){
           if (product.getId() == id){
               return product;
           }
       }
       return null;
   }

   @Override
   public Product save(Product product) {
       products.add(product);
       return product;
   }
}
```
L'annotation `@Repository` est implémentée afin d'indiquer à Spring qu'il s'agit d'une classe qui gère des données.<br>
Cela permettra d'utiliser certaines fonctionnalités comme les translations des erreurs.

Un tableau faisant office de BDD est implémenté.<br>
Les méthodes définies dans l'interface sont ensuite redéfinies pour renvoyer les données du tableau :
* _findAll_ = renvoie la liste complète de tous les produits.
* _findById_ = vérifie s'il y a un produit avec l'id donnée dans la liste et renvoie le produit correspondant.
* _save_ = ajoute un produit reçu à la liste.

#### Intéraction avec les données

Il faut modifier le contrôleur pour qu'il utilise la **couche DAO** pour manipuler les produits :<br>
On crée d'abord une variable de type ProductDao, définie en **private final** (il s'agit d'une constante accessible uniquement ici).<br>
On injecte l'instance de ProductDao dans le constructeur afin d'avoir accès aux méthodes définies.<br>

La liste "productsList" contient maintenant une liste de produits définis en dur, et on peut accéder à un produit râce à la méthode displayProduct.

```java
package com.ecommerce.micrommerce.web.controller;

import com.ecommerce.micrommerce.dao.ProductDao;
import com.ecommerce.micrommerce.model.Product;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {
    private final ProductDao productDao;

    public ProductController(ProductDao productDao) {
        this.productDao = productDao;
    }

    @GetMapping("/products")
    public List<Product> productsList() {
        return productDao.findAll();
    }

    @GetMapping("/products/{id}")
    public Product displayProduct(@PathVariable int id) {
        return productDao.findById(id);
    }
}
```