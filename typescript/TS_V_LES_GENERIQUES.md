# Les types génériques

## Les bases des génériques

Les `Types Génériques` permettent de définir des composants pouvant travailler avec plusieurs types afin de les rendre réutilisables.
Cette notion va donc permettre de combiner des types et rendre les fonctions et composants plus polyvalents, en acceptant et en utilisant des informations de plusieurs types possibles. 

L'objectif des `generics` est de favoriser la réutilisation de nos fonctionnalités.

Les fonctions peuvent accepter en argument des informations de plusieurs types et en retourner.

Le type `Array` est un type `generic` pouvant fonctionner avec plusieurs autres types.
Voici deux syntaxes pour écrire des tableaux : 
```TypeScript
const grades: number[] = [15, 19, 17];
const names: string[] = ["Mario", "Luigi", "Peach"];
const grades: Array<number> = [15, 19, 17];
const names: Array<string> = ["Mario", "Luigi", "Peach"];

type Character = {
    name: string,
    sex: boolean,
    age: number,
}

const people: Character[] = ["Mario", 31, true]
const people: Array<Character> = [
    {name: "Mario", sex: true, age: 31},
    {name: "Luigi", sex: true, age: 28},
    {name: "Peach", sex: false, age: 30},
]
```
La syntaxe `Array<type>` est liée aux types génériques : le type Array s'utilise en combinaison d'autres types spécifiques. 
On constate aussi qu'il n'existe pas un type spécifique pour chaque type de tableau que l'on peut faire. 

## Les fonctions

De manière générale, en typant spéficiquement le paramètre d'une fonction (number, string, boolean...), on bride l'utilisation de la fonction pour des cas spécifiques prédéfinis à l'avance.
Grâce au concept des génériques, il est possible d'écrire des fonctions polyvalentes pouvant récupérer des informations de plusieurs types simples. Bien qu'on ait pas indiqué le type à l'avance, TypeScript sera capable d'identifier le type de chaque paramètre :
```TypeScript
function myFunction<Type>(param: Type): void {
    console.log(typeof param);
}

myFunction("Bonjour"); // string
myFunction(15); // number
myFunction(true); // boolean
```
Cette syntaxe est particulièrement intéressante lorsqu'on va ajouter le type retourné : `function myFunction<Type>(param: Type): Type { ... }`.
Cela signifie que, quel que soit le type en entrée, le type retourné sera exactement le même. 
```TypeScript
function myFunction<T>(param: T): T {
    return param;
}

// myVariable est identifiée par TypeScript de type string
const myVariable = myFunction("Bonjour");
// myVariable2 est identifiée par TypeScript de type number
const myVariable2 = myFunction(15);
// myVariable3 est identifiée par TypeScript de type boolean
const myVariable3 = myFunction(true);
```
En comparaison, si on avait utilisé le type `any`, les variable retournées seraient de type `any`, donc non identifiées.

### Spécificité avec les `Array`

le paramètre de la fonction sera forcément un tableau, mais le type tu tableau est générique. TypeScript va capturer ce type pour identifier le type retourné. 
```TypeScript
function myFunction<Type>(param: Array<Type>): Type { 
    return param[0];
}
```

> Note : on peut noter `Type` ou `T`, mais par convention, on utilisera plutôt `T`.

Lors de l'appel de la fonction, on pourra spécifier le type de data envoyé grâce aux chevrons : 
```TypeScript
const myConst = myFunction<number>([10,15,20]);
```
myConst sera donc un number.

### Exemple

```TypeScript
type Human = {
    name: string,
    age: number,
}
type Orc = {
    name: string,
    tribe: string,
}

const characterOne: Human = { name: "Irhiel", age: 10 };
const characterTwo: Orc = { name: "Thorgrim", tribe: "the horde"};

function createWarrior<T>(player: T): T {
    return {
        ...player,
        class: "warrior"
    }
}

const warriorOne = createWarrior(characterOne);
const warriorTwo = createWarrior(characterTwo);
```
* warriorOne sera de type combiné : `Human & {class: string}`
* warriorTwo sera de type combiné : `Orc & {class: string}`

## Contraintes de fonctions

La syntaxe vue précédemment peut provoquer des incohérences : 
```TypeScript
function createWarrior<T>(player: T): T {
    return {
        ...player,
        class: "warrior"
    }
}

const newWarrior = createWarrior("Truc");
```
Cela engendrerait un type combiné : `"Truc" & {class: string}`.
Il faudra ajouter un garde fou lors du typage générique de la fonction, et grâce au mot clé `extends`, on va spécifier quelle propriété le paramètre de la fonction doit recevoir :
```TypeScript
function createWarrior<T extends { name: string }>(player: T): T {
    return {
        ...player,
        class: "warrior"
    }
}
```
Cela indique que si le paramètre ne contient pas une propriété `name` de type `string`, alors l'exécution de fonction va planter.
Avec cette syntaxe, on pourra forcer le type en entrée de paramètre. 

## Les multiples paramètres de fonction

Grâce aux types génériques, on pourra combiner des paramètres de n'importe quel type, et typescript sera capable d'identifier ce qui a été combiné. 
```TypeScript
function createCharacter<T extends Character, U extends Warrior | Bowman>(obj1: T, obj2: U): T {
    return Object.assign(obj1, obj2);
}

type Character = {
    name: string;
    age: number;
}
type Warrior = {
    class: "warrior";
    tribe: string;
}
type Bowman = {
    class: "bowman",
    arrowCount: number,
}

const playerOne: Character = {
    name: "Mario",
    age: 30,
}
const warrior: Warrior = {
    class: "warrior",
    tribe: "alliance",
}
const playerTwo: Character = {
    name: "Luigi",
    age: 28,
}
const bowman: Bowman = {
    class: "bowman",
    arrowCount: 50,
}


const charOne = createCharacter(playerOne, warrior);
const charTwo = createCharacter(playerTwo, bowman);
```
Nous avons défini ici des types, mais cela fonctionnerait également avec des interfaces.

## Les classes

Une classe peut utiliser le type `generic` et devenir plus polyvalente.

Cela fonctionne particulièrement avec des classes permettant de créer des listes de quelque chose. 

```TypeScript
class Characters<T extends {}> {
    private list: Array<T> = [];

    addCharacter(character: T) {
        this.list.push(character);
    }
    displayCharacters(){
        for (let el of this.list) {
            console.log(el);
        }
    }
}

interface Character { name: string };
interface Warior extends Character { class: "warrior", type: "close combat" };
interface Bowman extends Character { class: "bowman", type: "range" };

const w1: Warrior = { name: "Gimli", class: "warrior" };
const w2: Warrior = { name: "Aragorn", class: "warrior" };
const w2: Bowman = { name: "Legolas", class: "bowman" };

const warriorsList = new Characters<Warrior>();
warriorsList.addCharacter(w1);
warriorsList.addCharacter(w2);
warriorsList.displayCharacters();

const bowmansList = new Characters<Bowman>();
bowmansList.addCharacter(w3);
bowmansList.displayCharacters();
```

## Les `Partials`

Les types partiels sont une forme de type générique. 
Les partials permettent de créer des objets d'un certain type, mais de manière incomplète. 
C'est le cas lorsque toutes les informations ne pourront pas être renseignées directement et qu'elles seront complétées au fut et à mesure. 
TypeScript met à disposition cette fonctionnalité pour nous permettre de créer des objets d'un type donné sans pour autant renseigner toutes les informations directement.
On pourra l'utiliser notamment lorsqu'on récupère des informations depuis une API : on crée un type complet, et si on a besoin que d'une partie des informations, on pourra utiliser un partial. 
La syntaxe emploie le terme `Partial` qui sera ajoutée devant le type noté entre chevrons : `const myConst: Partial<Type> = { ... }`.
Attention, l'objet créé en partial ne pourra prendre qu'au maximum les propriétés du type original. 
```TypeScript
interface Character { 
    name: string,
    class: string,
    strength: number,
    health: number,
};

let myCharacter: Partial<Character> = { name: "Aragorn", class: "Warrior" }; 
myCharacter.strength = 15;
```
Le problème ici est que myCharacter sera toujours identifié comme un `Partial<Character>`. 
Il faudra faire une manipulation pour rendre la variable du type souhaité, via une fonction par exemple : 
```TypeScript
function createCharacter(): Character {
    let character: Partial<Character> = { 
        name: "Aragorn", 
        class: "Warrior" 
    }; 
    character.health = 18;
    character.strength = 15;

    return character as Character;
}

const myCharacter = createCharacter();
```

## Le type `ReadOnly`

Le type `Readonly` fait également partie des types génériques. 
Il va s'utiliser en combinaison d'autres types et sera intéressant associé aux tableaux ou aux objets afin de fixer les valeurs des caisses d'un tableau ou bien de fixer les propriétés d'un objet.
On pourra ainsi créer des constantes de tableaux et des constantes d'objets à proprement parlé. 
Un type Readonly se déclare ainsi : `const myConst: Readonly<type> = ...;`

Tableau : 
```TypeScript
const names: string[] = ["Link", "Zelda"];
names[0] = "Ganon";
names.push("Daruk")
```

Tableau avec des valeurs fixes : le tableau n'est plus modifiable
```TypeScript
const names: Readonly<string[]> = ["Link", "Zelda"];
```

Objet avec des valeurs fixes : l'objet ne sera plus modifiable
```TypeScript
type Character = {
    name: string;
    type: string;
}

let characterOne: Readonly<Character> = {
    name: "Link",
    type: "warrior",
}
```