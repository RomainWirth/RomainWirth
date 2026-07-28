# 8. Compléments

Ce chapitre rassemble des notions mentionnées dans les notes de cours d'origine sans être vraiment développées (seulement quelques liens vers la documentation officielle), ainsi que des ressources complémentaires pour continuer à progresser après ce cours.

## Sommaire

- [Le type narrowing](#le-type-narrowing)
- [Écrire son propre type guard (`is`)](#ecrire-son-propre-type-guard-is)
- [Les types conditionnels et `infer`](#les-types-conditionnels-et-infer)
- [Ressources pour aller plus loin](#ressources-pour-aller-plus-loin)

## Le type narrowing

Le "narrowing" (littéralement "rétrécissement") désigne la capacité de TypeScript à affiner automatiquement le type d'une variable à l'intérieur d'un bloc de code, en fonction des vérifications JavaScript classiques qu'on écrit déjà naturellement (`typeof`, `instanceof`, `in`, une simple condition...).

### Avec `typeof`

Sur une union de types simples, un test `typeof` suffit à ce que TypeScript comprenne, dans chaque branche du `if`, avec quel type précis il travaille :

```typescript
function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // ici, TypeScript sait que id est une string
  }
  return id.toFixed(0); // ici, TypeScript sait que id est un number
}
```

### Avec `instanceof`

Sur une union de classes, `instanceof` fonctionne de la même manière :

```typescript
class Dog {
  bark() {
    console.log("Wouf");
  }
}
class Cat {
  meow() {
    console.log("Miaou");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript sait qu'il s'agit d'un Dog
  } else {
    animal.meow(); // TypeScript sait qu'il s'agit d'un Cat
  }
}
```

### Avec l'opérateur `in`

Pour distinguer deux types d'objets qui n'ont pas de propriété commune permettant de les identifier facilement, l'opérateur `in` vérifie la présence d'une propriété :

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // TypeScript sait qu'il s'agit d'un Fish
  } else {
    animal.fly(); // TypeScript sait qu'il s'agit d'un Bird
  }
}
```

### Avec une propriété discriminante (discriminated unions)

Une pratique très courante consiste à ajouter à chaque type d'une union une propriété commune (souvent appelée `type` ou `kind`), avec une valeur littérale différente pour chacun. TypeScript est alors capable d'affiner le type rien qu'en testant cette propriété :

```typescript
type Square = { kind: "square"; size: number };
type Circle = { kind: "circle"; radius: number };
type Shape = Square | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size; // ici, shape est forcément un Square
    case "circle":
      return Math.PI * shape.radius ** 2; // ici, shape est forcément un Circle
  }
}
```

Ce dernier pattern (une propriété discriminante + un `switch`) est probablement la forme de narrowing la plus utilisée en pratique dans du code TypeScript réel.

### Écrire son propre type guard (`is`)

Les vérifications précédentes (`typeof`, `instanceof`, `in`, propriété discriminante) fonctionnent directement dans le bloc où elles sont écrites. Il est aussi possible d'extraire une vérification dans sa propre fonction réutilisable, grâce au mot-clé `is` dans le type de retour :

```typescript
function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}

function moveAnimal(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // TypeScript sait qu'il s'agit d'un Fish, grâce au type guard isFish
  } else {
    animal.fly();
  }
}
```

`animal is Fish` indique à TypeScript que, si la fonction retourne `true`, alors le paramètre testé est bien de type `Fish` à cet endroit précis de l'appelant. C'est un **type guard personnalisé** (*user-defined type guard*), très utile dès qu'une même vérification est réutilisée à plusieurs endroits du code.

## Les types conditionnels et `infer`

Les types conditionnels permettent d'écrire une logique de type "si... alors... sinon..." directement au niveau des types, avec une syntaxe proche du ternaire JavaScript :

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>; // false
```

Le mot-clé `infer` permet, à l'intérieur d'un type conditionnel, de "capturer" un type intermédiaire pour le réutiliser. C'est ce que TypeScript utilise en interne pour ses propres utility types. Par exemple, `ReturnType<T>` (fourni nativement par TypeScript) extrait le type de retour d'une fonction :

```typescript
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function createUser() {
  return { name: "Ada", age: 30 };
}

type User = MyReturnType<typeof createUser>;
// équivaut à : { name: string; age: number; }
```

Ces deux notions (types conditionnels et `infer`) sont plutôt avancées : elles ne sont pas indispensables pour écrire du code TypeScript au quotidien, mais elles expliquent comment sont construits en interne certains utility types déjà vus (comme `ReturnType`, ou ceux du chapitre sur les génériques). Elles deviennent utiles surtout en écrivant des librairies ou des types génériques très réutilisables.

## Ressources pour aller plus loin

* [Le bac à sable TypeScript (Playground)](https://www.typescriptlang.org/play) : écrire et tester du code TypeScript directement dans le navigateur, sans rien installer.
* [La documentation officielle de TypeScript](https://www.typescriptlang.org/fr/docs/handbook/typescript-from-scratch.html) : la ressource de référence pour répondre à toutes les questions plus poussées.
* [ts-error-translator](https://ts-error-translator.vercel.app/) : traduit les messages d'erreur de TypeScript en anglais plus lisible, avec quelques explications.
* [L'extension VS Code Total TypeScript](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator) : donne des conseils de syntaxe directement dans l'éditeur et intègre le traducteur d'erreurs ci-dessus.
* [La formation TypeScript de Grafikart](https://grafikart.fr/formations/typescript) : une ressource complète en français, pour voir les mêmes notions présentées différemment.
