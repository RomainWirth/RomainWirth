# Module 09 - Les classes

## Qu'est-ce qu'une classe ?

Une **classe** est un modèle pour un objet dans le code. Elle permet de construire plusieurs objets de même type (appelés **instances**) plus facilement, rapidement et en toute fiabilité.

```javascript
class Name {
    constructor(propriete1, propriete2, propriete3) {
        this.propriete1 = propriete1;
        this.propriete2 = propriete2;
        this.propriete3 = propriete3;
    }
}
```

Le `constructor` est la fonction appelée quand on crée une nouvelle instance avec `new`. `this` fait référence à l'instance en cours de création.

On crée des instances avec `new` :

```javascript
let myName = new Name("Toto", "Pimpin", 9);
// { propriete1: "Toto", propriete2: "Pimpin", propriete3: 9 }
```

## Ajouter des méthodes

```javascript
class User {
    constructor(prenom, nom) {
        this.prenom = prenom;
        this.nom = nom;
    }

    getFullName() {
        return `${this.prenom} ${this.nom}`;
    }

    greet() {
        console.log(`Bonjour, je suis ${this.getFullName()}`);
    }
}

const alice = new User('Alice', 'Martin');
alice.getFullName(); // 'Alice Martin'
alice.greet();       // 'Bonjour, je suis Alice Martin'
```

## Champs de classe (ES2022)

On peut déclarer des propriétés directement dans le corps de la classe, sans les placer dans le `constructor` :

```javascript
class Compteur {
    valeur = 0;        // propriété initialisée directement
    pas = 1;

    incrementer() {
        this.valeur += this.pas;
    }
}

const c = new Compteur();
c.incrementer();
console.log(c.valeur); // 1
```

## Propriétés privées avec `#`

Les propriétés préfixées par `#` sont **privées** : inaccessibles depuis l'extérieur de la classe.

```javascript
class CompteBancaire {
    #solde = 0;

    deposer(montant) {
        if (montant > 0) this.#solde += montant;
    }

    getSolde() {
        return this.#solde;
    }
}

const compte = new CompteBancaire();
compte.deposer(100);
console.log(compte.getSolde()); // 100
console.log(compte.#solde);     // SyntaxError - inaccessible
```

Les champs privés garantissent l'**encapsulation** : les détails internes de la classe ne peuvent pas être modifiés accidentellement de l'extérieur.

## Getters et setters

Les mots-clés `get` et `set` permettent de définir des propriétés calculées ou contrôlées qui se comportent comme des propriétés simples à l'usage :

```javascript
class Temperature {
    #celsius;

    constructor(celsius) {
        this.#celsius = celsius;
    }

    get fahrenheit() {
        return this.#celsius * 9/5 + 32;
    }

    set celsius(valeur) {
        if (valeur < -273.15) throw new Error('En dessous du zéro absolu');
        this.#celsius = valeur;
    }

    get celsius() {
        return this.#celsius;
    }
}

const t = new Temperature(100);
console.log(t.fahrenheit); // 212 - appelé comme une propriété, pas une méthode
t.celsius = 0;
console.log(t.fahrenheit); // 32
```

## Héritage avec `extends` et `super`

Une classe peut hériter des propriétés et méthodes d'une autre avec `extends`. `super(...)` appelle le constructeur de la classe parente.

```javascript
class Animal {
    constructor(nom) {
        this.nom = nom;
    }
    seDeplacer() {
        return `${this.nom} se déplace`;
    }
    toString() {
        return `Animal: ${this.nom}`;
    }
}

class Chien extends Animal {
    constructor(nom, race) {
        super(nom); // appelle le constructor d'Animal - obligatoire avant d'utiliser this
        this.race = race;
    }
    aboyer() {
        return `${this.nom} aboie !`;
    }
    // Surcharge de méthode : redéfinir une méthode héritée
    toString() {
        return `${super.toString()}, race: ${this.race}`; // super.methode() pour appeler la version parente
    }
}

const rex = new Chien('Rex', 'Labrador');
rex.seDeplacer(); // 'Rex se déplace' - méthode héritée
rex.aboyer();     // 'Rex aboie !' - méthode propre
rex.toString();   // 'Animal: Rex, race: Labrador' - méthode surchargée
```

> ℹ️ `super()` doit être appelé **avant** toute référence à `this` dans le constructor d'une classe enfant.

## Propriétés et méthodes statiques

Une méthode ou propriété `static` appartient à la **classe** elle-même, pas à ses instances :

```javascript
class Utils {
    static PI = 3.14159;

    static double(n) {
        return n * 2;
    }

    static carre(n) {
        return n ** 2;
    }
}

Utils.double(5); // 10 - pas besoin d'instancier Utils avec "new"
Utils.PI;        // 3.14159
```

Cas d'usage typiques : fonctions utilitaires, méthodes de fabrique (*factory methods*) pour créer des instances avec une logique particulière.

## Vérifier le type avec `instanceof`

`instanceof` vérifie si un objet est une instance d'une classe (ou d'une de ses classes parentes) :

```javascript
const rex = new Chien('Rex', 'Labrador');

rex instanceof Chien;   // true
rex instanceof Animal;  // true (Chien hérite d'Animal)
rex instanceof Date;    // false
```

## Classes vs objets littéraux - quand utiliser quoi ?

| Situation | Recommandation |
|---|---|
| Une seule instance, pas de réplication | Objet littéral `{}` |
| Plusieurs instances du même type | Classe |
| Héritage et spécialisation nécessaires | Classe |
| Simple regroupement de données (config, résultat d'API) | Objet littéral |

## Note sur `this`

`this` utilisé dans une méthode fait référence à l'objet qui appelle la méthode. Pour aller plus loin, voir le **module 12** consacré à `this`.

---

## Résumé

| Notion | À retenir |
|---|---|
| `class` | Modèle pour créer des objets du même type |
| `constructor` | Appelé automatiquement lors d'un `new` |
| `new` | Crée une instance de la classe |
| `this` | Référence à l'instance courante |
| Champs de classe | `valeur = 0;` dans le corps de la classe |
| Champs privés `#` | Inaccessibles de l'extérieur - encapsulation |
| `get`/`set` | Propriétés calculées ou contrôlées, utilisées sans `()` |
| `extends` | Héritage d'une autre classe |
| `super()` | Appel du constructor parent - obligatoire avant `this` |
| `super.methode()` | Appel de la version parente d'une méthode surchargée |
| `static` | Appartient à la classe, pas aux instances |
| `instanceof` | Vérifie si un objet est une instance d'une classe |

## Prochaine étape

**Module 10 - Les fonctions** : déclaration, expressions de fonction, fonctions fléchées, paramètres par défaut, différences de hoisting et de `this`.
