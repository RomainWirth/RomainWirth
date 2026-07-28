# Les Décorateurs 

Les décorateurs ne sont pas une fonctionnalité cruciale de TypeScript, mais ils méritent qu'on s'y attarde un peu

## Que sont les décorateurs ?

Les décorateurs sont des fonctions qui s'utilisent avec des classes.

Ces fonctions peuvent être en lien avec la classe elle-même, d'autres fonctions de classe (méthodes), des accesseurs, des attributs et des paramètres. 

Elles permettent de décrire les éléments d'une classe et s'exécute lors de l'intégration de la classe au lancement du programme.

Un décorateur s'utilise avec le symbole `@` suivi de son nom, et doit précéder l'élément concerné.
```TypeScript
function decoClass(constructor: Function) {}

@decoClass
class Character {...}
``` 

Les décorateurs constituent des fonctionnalités expérimentales de TypeScript. Leur utilisation est susceptible de changer. Ils ne sont que très peu utiles pour écrire du code logique mais sont utilisés par certaines librairies comme `Angular` dans des cas très spécifiques.

Il n'est pas nécessaire de les maîtriser, mais simplement de connaître leur existance. 

### Activation

Afin de pouvoir utiliser les décorateurs, il faudra les activer dans un projet au niveau du fichier `tsconfig.json` :
* décommenter la ligne `experimentalDecorators` pour activer
* avoir au minimum la target sur `ES6` (ici `es2016`)
```JSON
{
    "compilerOptions": {
        ...
        // "jsx": "preserve",                                /* Specify what JSX code is generated. */
        "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
        // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
        ...
        /* Language and Environment */
        "target": "es2016",                                  /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
        ...
        "forceConsistentCasingInFileNames": true,            /* Ensure that casing is correct in imports. */
        ...
        "skipLibCheck": true                                 /* Skip type checking all .d.ts files. */
    }
}
```

### Les décorateurs de classe

La fonction décorateur doit obligatoirement prendre en paramètre `constructor` de type `Function`
On pourra ajouter un décorateur directement sur une classe :
```TypeScript
function decoClass(constructor: Function) {
    console.log("Décorateur de la classe");
}

@decoClass
class Character {
    private _name: string;
    private _age: number;

    constructor(name: string, age: number) {
        console.log("Constructeur de la classe");
        this._name = name;
        this._age = age;
    }
}


const p1 = new Character("Link", 17);
const p2 = new Character("Zelda", 18);
```
Le constructeur n'est exécuté qu'une seule fois, lors de l'intégration de la classe dans le programme, avant que le constructeur de classe n'intervienne :
```
Décorateur de la classe
Constructeur de la classe
Constructeur de la classe
Constructeur de la classe
```

## Les décorateur `factory`

Il est possible de transmettre des informations au décorateur via des paramètres. 
C'est là que les décorateur factories interviennent.

Pour que le décorateur puisse utiliser les informations transférées, il faudra que la fonction retourne une autre fonction : il s'agit d'une `closure`.

```TypeScript
function decoClass(className: string) {
    return (constructor: Function) => {
        console.log("Décorateur de la classe " + className);
    }
}

@decoClass("Character")
class Character {
    private _name: string;
    private _age: number;

    constructor(name: string, age: number) {
        console.log("Constructeur de la classe")
        this._name = name;
        this._age = age;
    }
}

@decoClass("Human")
class Human extends Character {

}

const p1 = new Character("Link", 17);
const p2 = new Character("Zelda", 18);
const p3 = new Human("Ganon", 30);
```

```
Décorateur de la classe Character
Décorateur de la classe Human
Constructeur de la classe
Constructeur de la classe
Constructeur de la classe
```

## Les décorateurs d'attributs

De la même manière que pour les autres décorateurs, on va créer une fonction que l'on va utiliser directement sur un attribut.
Cette fonction va avoir besoin de paramètres : `target` et `property key`.
* `target` contient la fonction constructor
* `propertyKey` contient le nom de l'attribut lié
```TypeScript
function decoClass(className: string) {
    return (constructor: Function) => {
        console.log("Décorateur de la classe " + className);
    }
}

function decoProperty(target: any, propertyKey: string): string {
    console.log("target : ");
    console.log(target);
    console.log("property key : ");
    console.log(propertyKey);
}

@decoClass("Character")
class Character {
    @decoProperty
    private _name: string;
    private _age: number;

    constructor(name: string, age: number) {
        console.log("Constructeur de la classe")
        this._name = name;
        this._age = age;
    }
}

@decoClass("Human")
class Human extends Character {

}

const p1 = new Character("Link", 17);
const p2 = new Character("Zelda", 18);
const p3 = new Human("Ganon", 30);
```
Il serait intéressant de récupérer non pas le nom de l'attribut, mais plutôt son type. De cette manière on va modifier le décorateur en factory :
```TypeScript
function decoProperty(propertyType: string) {
    return (target: any, propertyKey: string) => {
        console.log("property key : " + propertyKey + " : " + propertyType);
    }
}

@decoClass("Character")
class Character {
    @decoProperty("string")
    private _name: string;
    @decoProperty("number")
    private _age: number;

    constructor(name: string, age: number) {
        console.log("Constructeur de la classe")
        this._name = name;
        this._age = age;
    }
}
```

```
PropertyKey : _name : string
PropertyKey : _age : number
Décorateur de la classe Character
Décorateur de la classe Human
Constructeur de la classe
Constructeur de la classe
Constructeur de la classe
```
Il sera également possible d'utiliser ce décorateur sur d'autres classes : 
```TypeScript
@decoClass("Human")
class Human extends Character {
    @decoProperty("string")
    private _race = "Human";
}
```
```
PropertyKey : _name : string
PropertyKey : _age : number
Décorateur de la classe Character
PropertyKey : _race : string
Décorateur de la classe Human
Constructeur de la classe
Constructeur de la classe
Constructeur de la classe
```
Il sera aussi possible de mettre plusieurs décorateurs sur un même attribut.

## Les autres décorateurs

### Les décorateurs d'accesseurs

```TypeScript
function decoAccessor(target: any, propertyKey: string, descriptor: PropertyDescription) {}
```

### Les décorateurs de fonctions

```TypeScript
function decoMethod(target: any, propertyKey: string, descriptor: PropertyDescription) {}
```

### Les décorateurs de paramètres de fonction

```TypeScript
function decoFunctionParam(target: any, propertyKey: string | symbol, parameterIndex: number) {}

class Character {
    ...
    updateCharacter(@decoFunctionParam number: number) {
        this._age = number;
    }
}
``` 