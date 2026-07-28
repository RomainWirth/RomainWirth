# 6. Les décorateurs

## Sommaire

- [Que sont les décorateurs ?](#que-sont-les-decorateurs-)
- [Activer les décorateurs](#activer-les-decorateurs)
- [Les décorateurs de classe](#les-decorateurs-de-classe)
- [Les décorateurs factory](#les-decorateurs-factory)
- [Les décorateurs d'attributs](#les-decorateurs-dattributs)
- [Les autres décorateurs](#les-autres-decorateurs)
- [Application pratique](#application-pratique)
- [Résumé](#resume)

## Que sont les décorateurs ?

Les décorateurs ne sont pas une fonctionnalité indispensable de TypeScript, mais ils méritent d'être connus, ne serait-ce que parce qu'ils sont massivement utilisés par des frameworks comme Angular ou NestJS.

Un décorateur est une fonction qui s'applique à une classe (ou à l'un de ses membres : méthode, accesseur, attribut, paramètre) et qui s'exécute au moment où la classe est définie, pas au moment où elle est instanciée. Il se place avec le symbole `@` suivi du nom de la fonction, juste avant l'élément concerné :

```typescript
function decoClass(constructor: Function) {}

@decoClass
class Character {
  // ...
}
```

Il n'est pas indispensable de savoir écrire ses propres décorateurs au quotidien, mais il est utile de comprendre leur mécanisme pour lire du code qui en utilise (c'est très fréquent dans l'écosystème Angular).

> À noter : ce chapitre couvre l'API historique des décorateurs ("legacy" ou "experimental decorators" dans la documentation TypeScript), celle utilisée depuis longtemps par Angular ou NestJS. Depuis TypeScript 5.0, une nouvelle version standardisée des décorateurs existe (basée sur une proposition officielle de JavaScript), avec une syntaxe assez proche mais pas identique. Si tu croises une signature de décorateur différente de celle vue ici dans une documentation récente, il s'agit probablement de cette nouvelle API.

## Activer les décorateurs

Pour utiliser les décorateurs (legacy) présentés dans ce chapitre, il faut les activer explicitement dans `tsconfig.json`, et avoir une cible de compilation au minimum en `ES6` :

```json
{
  "compilerOptions": {
    "target": "es2016",
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

## Les décorateurs de classe

Un décorateur de classe reçoit obligatoirement en paramètre le `constructor` de la classe, typé `Function` :

```typescript
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

Le décorateur ne s'exécute qu'une seule fois, au moment où la classe est définie (donc avant même la première instanciation) :

```
Décorateur de la classe
Constructeur de la classe
Constructeur de la classe
```

Ici, `p1` et `p2` sont bien deux instances distinctes, donc `"Constructeur de la classe"` s'affiche deux fois, une par appel à `new`. Le décorateur, lui, ne s'affiche qu'une fois : il ne s'exécute pas à chaque instanciation, mais une seule fois pour la classe elle-même.

## Les décorateurs factory

Un décorateur factory permet de transmettre des informations au décorateur via des paramètres. Pour cela, la fonction décorateur doit retourner une autre fonction (une closure), qui elle recevra le `constructor` :

```typescript
function decoClassFactory(className: string) {
  return (constructor: Function) => {
    console.log("Décorateur de la classe " + className);
  };
}

@decoClassFactory("Character")
class Character {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    console.log("Constructeur de la classe");
    this._name = name;
    this._age = age;
  }
}

@decoClassFactory("Human")
class Human extends Character {}

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

Les deux décorateurs de classe (`Character` et `Human`) s'exécutent dès la lecture du fichier, avant même la première ligne de code qui suit (ici, avant la création de `p1`). C'est ensuite seulement que les trois instanciations (`p1`, `p2`, `p3`) déclenchent chacune une exécution du constructeur.

## Les décorateurs d'attributs

Un décorateur d'attribut reçoit deux paramètres : `target` (le prototype de la classe, ou son constructeur pour un membre statique) et `propertyKey` (le nom de l'attribut décoré) :

```typescript
function decoProperty(target: any, propertyKey: string) {
  console.log("target : ", target);
  console.log("property key : ", propertyKey);
}

@decoClassFactory("Character")
class Character {
  @decoProperty
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    console.log("Constructeur de la classe");
    this._name = name;
    this._age = age;
  }
}
```

La note d'origine déclarait ce décorateur avec un type de retour explicite (`: string`), alors que la fonction ne retourne rien : TypeScript refuse de compiler une fonction dont le type de retour annoncé ne correspond pas à ce qu'elle retourne réellement (ici, `undefined`). Un décorateur d'attribut ne retourne rien, il n'a donc pas besoin d'annotation de retour.

Il est souvent plus utile de récupérer le type de l'attribut plutôt que son seul nom. On transforme alors le décorateur en factory :

```typescript
function decoProperty(propertyType: string) {
  return (target: any, propertyKey: string) => {
    console.log("property key : " + propertyKey + " : " + propertyType);
  };
}

@decoClassFactory("Character")
class Character {
  @decoProperty("string")
  private _name: string;
  @decoProperty("number")
  private _age: number;

  constructor(name: string, age: number) {
    console.log("Constructeur de la classe");
    this._name = name;
    this._age = age;
  }
}
```

```
property key : _name : string
property key : _age : number
Décorateur de la classe Character
```

Les décorateurs d'attributs s'exécutent avant le décorateur de classe : TypeScript évalue d'abord les décorateurs des membres d'une classe, puis celui de la classe elle-même. On peut aussi cumuler plusieurs décorateurs sur un même attribut, en les empilant les uns au-dessus des autres.

## Les autres décorateurs

Le même principe s'applique à d'autres éléments d'une classe. Leur troisième paramètre est typé `PropertyDescriptor` (le type natif utilisé par `Object.defineProperty`, pas `PropertyDescription` qui n'existe pas en TypeScript) :

**Décorateur d'accesseur** (`get`/`set`) :

```typescript
function decoAccessor(target: any, propertyKey: string, descriptor: PropertyDescriptor) {}
```

**Décorateur de méthode** :

```typescript
function decoMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor) {}
```

**Décorateur de paramètre de fonction** : il reçoit la cible, le nom de la méthode, et l'index du paramètre décoré au sein de la liste de paramètres :

```typescript
function decoFunctionParam(target: any, propertyKey: string | symbol, parameterIndex: number) {}

class Character {
  private _name: string;
  private _age: number;

  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }

  updateCharacter(@decoFunctionParam newAge: number) {
    this._age = newAge;
  }
}
```

## Application pratique

Les décorateurs ne font l'objet d'aucun projet dédié dans les notions couvertes par ce cours (P1 à P4) : ils restent une fonctionnalité annexe, surtout utile à reconnaître dans du code utilisant Angular ou NestJS, plutôt qu'à écrire soi-même au quotidien.

## Résumé

- Un décorateur est une fonction qui s'applique à une classe ou à l'un de ses membres, avec la syntaxe `@nomDuDecorateur`.
- Il s'exécute une seule fois, au moment de la définition de la classe, pas à chaque instanciation.
- Il faut activer `experimentalDecorators` dans `tsconfig.json` (et une target `ES6` minimum) pour pouvoir les utiliser.
- Un décorateur factory est une fonction qui retourne le vrai décorateur : cela permet de lui transmettre des paramètres personnalisés.
- Un décorateur de classe reçoit le `constructor` ; un décorateur d'attribut ou de méthode reçoit `target` et `propertyKey` (et un `descriptor` de type `PropertyDescriptor` pour les accesseurs et méthodes) ; un décorateur de paramètre reçoit en plus l'index du paramètre.
- Les décorateurs de membres (attributs, méthodes) s'exécutent avant le décorateur de la classe elle-même.
- Ce chapitre couvre l'API "legacy" des décorateurs ; une nouvelle API standardisée existe depuis TypeScript 5.0, avec une syntaxe proche mais distincte.
