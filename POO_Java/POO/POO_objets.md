# PROGRAMMATION ORIENTEE OBJET - Créer des objets

## Le Constructeur

Pour créer des objets à partir d'une classe, il faut définir un constructeur.

Un constructeur est une fonction intégrée comme élément d'une classe.

```
CLASSE Personnage {
    nom : CHAINE DE CARACTERES
    age : ENTIER
    sexe : BOOLEEN
    
    FONCTION constructeur() {
    }
}
```

Le constructeur permet de générer des objets de la classe.<br>
Les accolades de la syntaxe permettent de définir le début et la fin d'un bloc de code.<br>

Les données sont les attributs de la classe (ou propriétés).<br>
Les fonctions sont les traitements.

## Instanciation

L'instanciation est la création et l'initialisation d'un objet.<br>
L'objet instancié dispose de la structure de la classe correspondante.<br>
On parle d'instanciation de la classe Personnage.<br>

Le mot clé "new" permet de créer un objet d'une classe (= instancier une classe pour en faire un objet).<br>

Exemple : à partir de la classe personnage, on va créer un algorithme permettant d'instancier de nouveaux personnages :
```
ALGORITHME main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
DEBUT
    perso1 <- new Personnage()
    perso2 <- new Personnage()
    perso3 <- new Personnage()
FIN
```
Chaque personnage créé aura la structure de la classe Personnage : avec un nom, un âge et un sexe.
Chaque objet personnage créé sera du type Personnage (provenant de la classe Personnage).<br>
le type Personnage est un type complexe.<br>

Actuellement, comme on a rempli aucun attribut de classe au moment de la création des objets, les objets sont vides.<br>
On pourra ensuite remplir ces objets grâce au concept d'hydratation.<br>

Pour obtenir des objets remplis, on va compléter le constructeur de classe :
```
CLASSE Personnage {
    nom : CHAINE DE CARACTERES
    age : ENTIER
    sexe : BOOLEEN
    
    FONCTION constructeur(nom, age, sexe) {
        this.nom <- nom
        this.age <- age
        this.sexe <- sexe
    }
}
```
Le mot clé `this` permet d'accéder aux informations directement présentes dans l'objet.<br>
On peut traduire ce mot clé par "mon" : mon nom, mon age, mon sexe.

L'algorithme d'instanciation qui en découle sera donc le suivant :
```
ALGORITHME main
VARIABLES
    perso1 : Personnage
    perso2 : Personnage
    perso3 : Personnage
DEBUT
    perso1 <- new Personnage("Romain", 34, VRAI)
    perso2 <- new Personnage("Flora", 38, FAUX)
    perso3 <- new Personnage("Katia", 40, FAUX)
FIN
```
Les paramètres de la fonction "constructeur" devront être renseignés au moment de son appel dans l'algorithme d'instanciation.<br>
l'objet créé à partir de la classe aura donc les attributs de la classe.