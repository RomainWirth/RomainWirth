# 5. Les génériques

## Sommaire

- [Pourquoi des types génériques ?](#pourquoi-des-types-generiques-)
- [Les fonctions génériques](#les-fonctions-generiques)
- [Contraindre un type générique avec `extends`](#contraindre-un-type-generique-avec-extends)
- [Plusieurs paramètres génériques](#plusieurs-parametres-generiques)
- [Les classes génériques](#les-classes-generiques)
- [Créer ses propres types génériques](#creer-ses-propres-types-generiques)
- [Les utility types fournis par TypeScript](#les-utility-types-fournis-par-typescript)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Pourquoi des types génériques ?

Un type générique permet d'écrire un composant (fonction, classe, type) qui fonctionne avec plusieurs types différents, sans dupliquer le code pour chacun d'eux. C'est le principe même du type `Array` que tu utilises déjà :

```typescript
const grades: number[] = [15, 19, 17];
const names: string[] = ["Mario", "Luigi", "Peach"];

// Notation strictement équivalente, avec la syntaxe générique explicite :
const gradesBis: Array<number> = [15, 19, 17];
const namesBis: Array<string> = ["Mario", "Luigi", "Peach"];
```

`Array` n'est pas réécrit pour chaque type de contenu possible : c'est un seul type générique, paramétré par le type qu'il contient (`Array<number>`, `Array<string>`, `Array<Character>`...). C'est exactement ce mécanisme qu'on va pouvoir écrire soi-même.

## Les fonctions génériques

En typant précisément le paramètre d'une fonction (`number`, `string`...), on limite son usage à un seul type. Grâce aux génériques, on peut écrire une fonction qui accepte n'importe quel type, tout en gardant une vérification de type précise (contrairement à `any`, qui perd toute information de type) :

```typescript
function identity<Type>(param: Type): Type {
  return param;
}

const value1 = identity("Bonjour"); // TypeScript déduit : string
const value2 = identity(15);        // TypeScript déduit : number
const value3 = identity(true);      // TypeScript déduit : boolean
```

`Type` (ou plus couramment `T`, par convention) est un **paramètre de type** : une sorte de variable, mais qui représente un type plutôt qu'une valeur. Ici, la fonction garantit que le type retourné est exactement le même que celui reçu en entrée, quel qu'il soit. Avec `any`, cette garantie disparaîtrait : la valeur retournée serait `any`, donc plus du tout vérifiée.

On peut aussi appliquer un générique à un tableau, en laissant TypeScript déduire le type du contenu :

```typescript
function firstElement<Type>(items: Array<Type>): Type {
  return items[0];
}

const firstGrade = firstElement([10, 15, 20]); // TypeScript déduit : number
```

Il est également possible de préciser explicitement le type générique lors de l'appel, avec des chevrons `<>` :

```typescript
const firstGradeExplicit = firstElement<number>([10, 15, 20]);
```

## Contraindre un type générique avec `extends`

Un paramètre de type générique sans contrainte accepte littéralement n'importe quoi, y compris des types qui ne conviennent pas à ce que fait réellement la fonction :

```typescript
function createWarrior<T>(player: T) {
  return {
    ...player, // Erreur TS2698 : "Spread types may only be created from object types"
    class: "warrior",
  };
}
```

Ce code ne compile pas : rien ne garantit que `T` est un objet, `player` pourrait tout aussi bien être un `number` ou une `string`. TypeScript refuse donc la décomposition (`...player`) tant que `T` n'est pas garanti d'être un objet.

Le mot-clé `extends` permet de poser une contrainte sur le type générique, en indiquant la forme minimale qu'il doit respecter :

```typescript
type Human = {
  name: string;
  age: number;
};
type Orc = {
  name: string;
  tribe: string;
};

function createWarrior<T extends { name: string }>(player: T): T & { class: string } {
  return {
    ...player,
    class: "warrior",
  };
}

const characterOne: Human = { name: "Irhiel", age: 10 };
const characterTwo: Orc = { name: "Thorgrim", tribe: "the horde" };

const warriorOne = createWarrior(characterOne); // type : Human & { class: string }
const warriorTwo = createWarrior(characterTwo); // type : Orc & { class: string }

// createWarrior("Truc"); // Erreur : "Truc" n'a pas de propriété "name", la contrainte n'est pas respectée
```

À noter que le type de retour est ici `T & { class: string }`, et non simplement `T`. C'est important : la valeur réellement retournée a toutes les propriétés de `T` **en plus** de `class`, donc son type exact est bien une intersection des deux. Déclarer un retour `T` tout court (comme le faisait la note d'origine) ne compile pas : TypeScript ne peut pas garantir qu'un objet contenant une propriété `class` en plus de celles de `T` est encore strictement un `T`.

## Plusieurs paramètres génériques

Une fonction peut combiner plusieurs paramètres de types génériques différents, chacun avec sa propre contrainte :

```typescript
type Character = {
  name: string;
  age: number;
};
type Warrior = {
  class: "warrior";
  tribe: string;
};
type Bowman = {
  class: "bowman";
  arrowCount: number;
};

function createCharacter<T extends Character, U extends Warrior | Bowman>(base: T, role: U): T & U {
  return Object.assign(base, role);
}

const playerOne: Character = { name: "Mario", age: 30 };
const warrior: Warrior = { class: "warrior", tribe: "alliance" };
const playerTwo: Character = { name: "Luigi", age: 28 };
const bowman: Bowman = { class: "bowman", arrowCount: 50 };

const charOne = createCharacter(playerOne, warrior); // type : Character & Warrior
const charTwo = createCharacter(playerTwo, bowman);  // type : Character & Bowman
```

Le type de retour a été précisé en `T & U` plutôt qu'en `T` seul (choix fait dans la note d'origine) : `Object.assign` fusionne bel et bien les deux objets, `T & U` reflète donc plus fidèlement la vraie forme de la valeur retournée et permet d'accéder aux propriétés des deux types côté appelant.

## Les classes génériques

Une classe peut elle aussi être générique, ce qui est particulièrement utile pour des classes qui gèrent une collection d'éléments d'un type donné :

```typescript
class CharacterList<T extends object> {
  private list: Array<T> = [];

  addCharacter(character: T): void {
    this.list.push(character);
  }

  displayCharacters(): void {
    for (const el of this.list) {
      console.log(el);
    }
  }
}

interface Character {
  name: string;
}
interface Warrior extends Character {
  class: "warrior";
  type: "close combat";
}
interface Bowman extends Character {
  class: "bowman";
  type: "range";
}

const w1: Warrior = { name: "Gimli", class: "warrior", type: "close combat" };
const w2: Warrior = { name: "Aragorn", class: "warrior", type: "close combat" };
const w3: Bowman = { name: "Legolas", class: "bowman", type: "range" };

const warriorsList = new CharacterList<Warrior>();
warriorsList.addCharacter(w1);
warriorsList.addCharacter(w2);
warriorsList.displayCharacters();

const bowmansList = new CharacterList<Bowman>();
bowmansList.addCharacter(w3);
bowmansList.displayCharacters();
```

Plusieurs points ont été corrigés par rapport à la note d'origine :
* le nom de la classe générique était `Characters<T extends {}>` : la contrainte `{}` désigne en réalité "n'importe quelle valeur non `null`/`undefined`" (y compris des primitives comme un `number`), ce qui n'est pas ce qu'on veut ici. La contrainte `object` (utilisée ci-dessus) restreint bien `T` à un véritable objet.
* l'interface `Warior` (sans le deuxième "r") était mal orthographiée à sa déclaration, alors que tout le reste du code l'utilisait sous le nom `Warrior`. TypeScript aurait renvoyé une erreur "Cannot find name 'Warrior'".
* les objets `w1` et `w2` de type `Warrior` ne renseignaient pas la propriété `type: "close combat"`, pourtant obligatoire d'après l'interface.
* la variable `w2` était déclarée deux fois (une fois en `Warrior`, une fois en `Bowman`), et la variable `w3` utilisée plus bas dans l'exemple n'était en réalité jamais déclarée. Le second personnage a été renommé `w3`, comme utilisé dans le reste de l'exemple.

## Créer ses propres types génériques

Un `type` (ou une `interface`) peut lui aussi recevoir un paramètre générique, exactement comme une fonction :

```typescript
interface Shop<ItemType> {
  name: string;
  items: Array<ItemType>;
}

type Equipment = {
  price: number;
  attack?: number;
  defense?: number;
};
type Potion = {
  price: number;
  magic: number;
};

// Chaque alias est un "modèle" Shop<T> spécialisé pour un type de contenu différent
type Armory = Shop<Equipment>;
type Apothecary = Shop<Potion>;
```

La note d'origine nommait les trois variantes de cet exemple `ShopOfNumbers` (pour `Shop<number>`, `Shop<string>` et `Shop<boolean>`), ce qui posait un double problème : un nom qui ne correspondait pas au contenu réel de l'exemple (des équipements et des potions, pas des nombres), et surtout une redéclaration du même identifiant de type trois fois de suite (`Duplicate identifier 'ShopOfNumbers'`). Les noms ont été adaptés au contenu réel de l'exemple (`Armory`, `Apothecary`).

On peut aussi écrire une fonction générique qui construit directement ce genre d'objet :

```typescript
function createShop<ItemType>(name: string, items: Array<ItemType>): Shop<ItemType> {
  return { name, items };
}

const armory = createShop<Equipment>("My Armory", []);
```

La note d'origine contenait ici une erreur de syntaxe (`items: Array<ItemType>;)`, avec un point-virgule juste avant la parenthèse fermante de la liste de paramètres, ce qui ne compile pas) et une faute de frappe sur le nom de variable (`aromry` au lieu de `armory`), toutes les deux corrigées ci-dessus.

## Les utility types fournis par TypeScript

TypeScript fournit une série de types génériques prêts à l'emploi, appelés **utility types**, pour transformer un type existant sans le réécrire à la main.

**`Partial<T>`** rend toutes les propriétés d'un type optionnelles. Pratique pour construire un objet progressivement, par exemple avant de l'envoyer à une API :

```typescript
interface Character {
  name: string;
  class: string;
  strength: number;
  health: number;
}

function createCharacter(): Character {
  const character: Partial<Character> = {
    name: "Aragorn",
    class: "Warrior",
  };
  character.health = 18;
  character.strength = 15;

  return character as Character; // on affirme qu'à ce stade, toutes les propriétés sont bien renseignées
}
```

Attention, une variable typée `Partial<Character>` reste de type `Partial<Character>`, même une fois toutes les propriétés renseignées : c'est pour ça qu'il faut une assertion de type (`as Character`) pour repasser au type complet une fois certain que toutes les propriétés sont bien présentes.

**`Readonly<T>`** rend toutes les propriétés d'un type (ou tous les éléments d'un tableau) non modifiables :

```typescript
const mutableNames: string[] = ["Link", "Zelda"];
mutableNames[0] = "Ganon"; // OK, le tableau est modifiable

const fixedNames: Readonly<string[]> = ["Link", "Zelda"];
fixedNames[0] = "Ganon"; // Erreur : tableau en lecture seule

interface CharacterName {
  name: string;
  type: string;
}
const fixedCharacter: Readonly<CharacterName> = {
  name: "Link",
  type: "warrior",
};
fixedCharacter.name = "Zelda"; // Erreur : propriété en lecture seule
```

**`Record<KeyType, ValueType>`** définit un type d'objet dont les clés et les valeurs suivent des types précis, une alternative à la notation classique entre accolades :

```typescript
type CollectionOfNumbers = Record<string, number>;
const stats: CollectionOfNumbers = {
  age: 45,
  life: 100,
  magic: 10,
};

// Avec une union, on peut n'autoriser que des clés précises
type StatisticName = "life" | "attack" | "defense";
const statsByName: Record<StatisticName, number> = {
  life: 100,
  attack: 10,
  defense: 20,
};
```

Trois autres utility types, non abordés dans le cours mais très utilisés en pratique, complètent naturellement ceux vus ci-dessus :

**`Pick<T, Keys>`** construit un nouveau type en ne gardant que certaines propriétés d'un type existant :

```typescript
type CharacterSummary = Pick<Character, "name" | "class">;
// équivaut à : { name: string; class: string; }
```

**`Omit<T, Keys>`** fait l'inverse de `Pick` : il garde toutes les propriétés sauf celles indiquées :

```typescript
type CharacterWithoutHealth = Omit<Character, "health">;
// équivaut à : { name: string; class: string; strength: number; }
```

**`Required<T>`** est l'inverse de `Partial<T>` : il rend obligatoires toutes les propriétés d'un type, y compris celles qui étaient optionnelles :

```typescript
interface Pet {
  name: string;
  nickname?: string;
}
type FullPet = Required<Pet>;
// équivaut à : { name: string; nickname: string; }
```

Quatre derniers utility types complètent ce tour d'horizon, particulièrement utiles pour dériver un type à partir d'une union ou d'une fonction déjà existante, plutôt que de le réécrire à la main :

**`Exclude<UnionType, Membres>`** retire d'une union les types indiqués :

```typescript
type Status = "pending" | "active" | "banned" | "deleted";
type ActiveStatus = Exclude<Status, "banned" | "deleted">;
// équivaut à : "pending" | "active"
```

**`Extract<UnionType, Union>`** fait l'inverse : il ne garde d'une union que les types qui correspondent à ceux indiqués :

```typescript
type InactiveStatus = Extract<Status, "banned" | "deleted">;
// équivaut à : "banned" | "deleted"
```

**`NonNullable<T>`** retire `null` et `undefined` d'un type :

```typescript
type MaybeName = string | null | undefined;
type Name = NonNullable<MaybeName>;
// équivaut à : string
```

**`Parameters<T>`** et **`ReturnType<T>`** extraient respectivement les types des paramètres et le type de retour d'une fonction :

```typescript
function createCharacter(name: string, level: number) {
  return { name, level };
}

type CreateCharacterParams = Parameters<typeof createCharacter>;
// équivaut à : [name: string, level: number]

type Character = ReturnType<typeof createCharacter>;
// équivaut à : { name: string; level: number; }
```

## Application pratique

* **P4 (auto-fleet)** : ce projet met en pratique les génériques pour modéliser une flotte de véhicules de types différents (probablement via une classe générique de collection, comme `CharacterList<T>` ci-dessus), en réutilisant aussi les notions des chapitres précédents (typage, POO).

## Résumé

- Un type générique (fonction, classe ou type) fonctionne avec plusieurs types différents sans dupliquer le code, comme le fait déjà `Array<T>`.
- `<T>` (ou `<Type>`) déclare un paramètre de type ; TypeScript le déduit automatiquement à partir de l'argument passé, sans avoir besoin de le préciser explicitement à chaque appel.
- Sans contrainte, un type générique accepte littéralement n'importe quoi, ce qui empêche certaines opérations (comme la décomposition d'objet avec `...`).
- `T extends { propriete: type }` (ou `T extends object`) contraint un type générique à respecter une forme minimale.
- Le type de retour d'une fonction générique qui ajoute des propriétés à son paramètre doit refléter cet ajout (`T & { ... }`), pas rester `T` seul.
- Une classe générique (`class Liste<T> { ... }`) permet de créer des collections fortement typées et réutilisables pour n'importe quel type d'élément.
- `Partial<T>`, `Readonly<T>` et `Record<K, V>` sont des utility types fournis nativement par TypeScript pour transformer un type existant.
- `Pick<T, K>`, `Omit<T, K>` et `Required<T>` complètent ces utility types : sélectionner certaines propriétés, en exclure certaines, ou toutes les rendre obligatoires.
- `Exclude`/`Extract` filtrent les membres d'une union ; `NonNullable` retire `null`/`undefined` ; `Parameters`/`ReturnType` extraient respectivement les paramètres et le retour d'une fonction existante.
