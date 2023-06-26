# TYPESCRIPT

## Typescript, c'est quoi ?

Tout d'abord, un point sur JavaScript : un langage qui ne se préoccupe que très peu du type des variables.<br>
C'est un ce qu'on appelle **un langage faiblement typé**.<br>
Ce qui en fait un langage très souple mais peu robuste.<br>
Par exemple, on peut additionner des nombres avec des chaînes de caractères.<br> 
Cela n'a que très peu de sens, mais c'est possible en JS.

TypeScript est quand à lui **un langage fortement typé**. C'est à dire qu'on devra déclarer le type de la variable au moment de sa déclaration.<br>
Cela permet de faire des vérification des types qu'on manipule. C'est une couche de sécurité qui permet de prévenir les erreurs éventuelles.<br>

Grâce à cette rigueur, les problèmes liés aux types ne sont plus possibles puisque TS indique en avance que le code risque de ne pas fonctionner comme prévu.<br>

TypeScript est tout simplement du javaScirpt dans un cadre plus sécurisé.<br>
il s'agit en fin de compte de JavaScript avec des fonctionnalités en plus.<br>
C'est un **superset** de JavaScript.


### Ecrire du TypeScript pour le web 

JavaScript est lu naturellement par le navigateur.<br>
Ce navigateur n'est pas capable de gérer du TypeScript.<br>

Il faudra donc transformer nos fichiers TS en JS. On utilise un outil qui fait cette transformation via une opération de **compilation**.

Le but de TypeScript est de pouvoir écrire du code plus solide en indiquant clairement les intentions à l'aide de types.

### Inconvénients 

1. **Une nouvelle technologie à apprendre**<br>
Même s'il s'agit de JavaScript, il s'agit d'une nouvelle technologie à apprendre.<br>

2. **Une complexité supplémentaire à appréhender**<br>
Il faut compiler les fichiers TS en JS pour qu'ils soient lus par le navigateur.<br>
Il y a un intermédiaire entre le code écrit et le code exécuté.<br>
Cela signifie aussi que les tests dans la console du navigateur ne pourra plus se faire comme avec du JS.<br>
Certains outils comme _ESLint_  js soit installé sur la machine.<br>

```bash
npm --version
```

sur Linux 

```bash
sudo apt update

sudo apt install nodejs

nodejs -v

sudo apt install npm
```

ATTENTION : Si la version de node n'est pas la LTS et qu'on arrive pas à l'installer sur Linux,<br> 
suivre les instructions sur ce repo git :<br>
https://github.com/nvm-sh/nvm#installing-and-updating<br>
On utilisera le gestionnaire de version de node : nvm afin d'installer, upgrade et utiliser une version de node souhaitée.<br>

Une fois Node.js installé, créer un nouveau dossier où on le souhaite dans l'ordinateur, y entrer et y lancer un terminal.<br>

```bash
npm init -y
```
Cette commande génère un projet TypeScript à la racine du dossier.<br>
Un fichier package.json sera généré, on pourra par la suite installer TypeScript :<br>

```bash
npm install --save-dev typescript
```

## Utiliser typescript

Nous allons ensuite créer un fichier _'mon-fichier.ts'_ dans lequel on écrira un peu de code en TS.<br>

Dans ce fichier on écrira du code en TS, puis on lancera la commande :

```bash
npx tsc mon-fichier.ts
```

Cette commande permet de compiler le code TS dans un fichier JS afin qu'il puisse être lu par le navigateur.<br>

N.B. : afin de compiler dans la dernière version de JS, on utilisera '--target es6' dans la commande :
```bash
npx tsc mon-fichier.ts --target es6
``` 

### Ajouter des types à JavaScript :

Pour déclarer une variable en TS, on utilisera la syntaxe suivante :<br>
mot clé + maVariable: type = valeur<br>

```javascript
let maVariable: number = 10;
```
Pour indiquer un type, la syntaxe principale est le caractère **' : '**, suivi du type souhaité.<br>

TypeScript propose trois types basiques _(primitifs)_ :
* **number** (pour les nombres)
* **string** (pour les chaînes de caractères)
* **boolean** (pour les valeur _true_ et _false_)

ATTENTION à la casse : number et Number sont deux types diférents.<br> 
Il faut utiliser les minuscules pour déclarer les variables.<br>

### TypeScript et les erreurs

L'avantage de TypeScript est qu'il nous donne des informations et nous fait remonter les erreurs.

Lorsqu'une erreur est remontée, TS nous indique <br> 
* le nom du fichier qui concerne l'erreur
* le numéro de la ligne impactée
* la colonne

ex : 
```bash
index.ts:4:25 - error TS2345:  Argument of type 'string' is not assignable to parameter of type 'number'.
```
4:32 = ligne et colonne concernée par l'erreur.<br>
error TS2345 = code de l'erreur qui permet de l'identifier.<br>
'Argument...' = description de l'erreur : TS nous indique exactement de quoi il retourne afin de pouvoir corriger l'erreur.<br>

ATTENTION, selon la complexité du code, les erreurs peuvent être plus ou moins 'cryptiques' à comprendre.<br>

l'outil : https://ts-error-translator.vercel.app/ permet de nous aider.<br>


### Typer des objets

ex : 
```TypeScript
function damage(charactereToDamage: {life: number}, amount: number): number {
    charactereToDamage.life -= amount;
    return charactereToDamage.life;
}

const result = damage({life: 100}, 12);
console.log(result);
```

Dans cet exemple : <br>
Nous avons une fonction 'damage' qui prend deux paramètres.<br>
1. charactereToDamage : une variable de type objet = la valeur est entre accolades. Cet objet contient la propriété 'life' qui est du type number.
2. amout : une variable de type number

Dans la fonction, on accède au paramètre life de l'objet charactereToDamage, auquel on soustrait un montant.<br>
On retourne le résultat : on a soustrait la valeur de amount à la valeur de charactereToDamage.life.<br>

Au moment d'appeler la fonction, on passe en paramètre les valeurs, en précisant le paramètre affecté pour l'objet.<br>

## Créer ses propres types de variables

### Définir ses types à partir d'autres types existants

TypeScript propose des types de base pour gérer les **nombres**, les **chaînes de caractères** et les **booléens**.<br>
Ce sont les types primitifs **number**, **string** et **boolean**.<br>

Afin d'avoir plus de clarté dans le code, il est possible de créer ses propres types de variables qui seront plus parlant.<br>
Par exemple, le type 'Age' sera plus parlant que numner pi Username sera pllus parlant que string.<br>

Pour créer un type, on va utiliser le mot-clé : _type_, suivi du nom qu'on va lui donner, puis on place un ' = ' suivi du type TypeScript qu'il doit avoir.<br>

```TypeScript
type Age = number;
type Firstname = string;
type Lastname = Firstname;
```
Par convention, le nom des nouveaux types sera écrit avec une majuscule en première lettre.

En réalité, ce ne sont pas de nouveaux types, mais des **alias** : des renommages de types existants.<br>
Si deux types sont l'alias d'un même autre type, alors ces deux alias seront identiques aux yeux de TypeScript.<br>

```TypeScript
// On définit deux alias Money et Age, pour qu’ils soient identiques à 'number'
type Money = number;
type Age = number;
// On définit une fonction qui s'attend à recevoir un Age (et donc un nombre)
function checkAge(ageToCheck: Age) {/*...*/}
// On appelle la fonction en lui donnant de l'argent (et donc aussi un nombre !)
const lotOfMoney: Money = 500000;
checkAge(lotOfMoney); // Money étant un nombre comme Age, TS ne voit pas d'erreur
```

#### Quel intérêt des alias ?

1. Les alias permettent de rendre le code plus clair en servant de documentation.<br>
2. Un alias peut aussi faire référence à plusieurs types :<br>
```TypeScript
type CodeSecret = string | number;
```
Ici, l'alias peut accepter deux types : string ou number.

Petite astuce : **une valeur JS peut servir de type TS valide**.<br>
c'est à dire que si on écrit 'type ten = 10', une variable de type 10 ne pourra valoir que la valeur 10.
```TypeScript
type Ten = 10;
const five: Ten = 5; // renvoie une erreur TS : Type '5' is not assignable to type '10'
const ten: Ten = 10; // OK !
```

3. Un alias permet de créer des objet complexes.

### Créer un objet complexe

ex : 
```TypeScript
type Hero = {
    life: number;
};
function damage(characterToDamage: Hero; amout: number): number
```

au lieu de passer en paramètres le contenu de l'objet : _characterToDamage: {life:number}_<br>
on va déclarer un type objet : _Hero_, qui sera passé en paramètres de la fonction.

Il est possible d'ajouter autant de propriétés que l'on veut à un objet, et chaque propriété peut avoir n'importe quel type.<br>
```TypeScript
type Pet = {
    name: string;
    life: number;
    attack: number;
    defense: number;
};
type Hero = {
    name: string;
    life: number;
    attack: number;
    defense: number;
    pet?: Pet;
};
```

à noter le '?' sur la dernière propriété de Hero. Ceci indique que "pet" est optionnel.<br>
Un objet Helo sera valide, qu'il ait un animal de compagnie ou non.<br>

Pour éviter de rendre le code répétitif, on va refactoriser ainsi :
```TypeScript
type Character = {
    name: string;
    life: number;
    attack: number;
    defense: number;
};
type Pet = Character;
type Hero = Character & {
    pet?: Pet;
};
```
Pet est un alias de Character. Le symbole & indique que le type Hero est une intersection entre le type Character et { pet?: Pet}.<br>

Une intersection indique à TS que l'on souhaite fusionner les types entre eux.<br>
Cela signifie qu'on indique à TS que Hero est un Character avec une propriété optionnelle pet, qui a pour type Pet.

#### Type ou Interface ?

le mot clé interface (très similaire à type), à la différence de type qui définit des objets et leurs propriété avec un alias,<br>
a pour but de définir une structure stricte pour un objet.<br>
Il semble donc plus correct d'utiliser interface pour définir des objets.

```TypeScript
interface Character {
    name: string;
    life: number;
    attack: number;
    defense: number;
};
type Pet = Character;
interface Hero extends Character {
    pet?: Pet;
};
```
Les syntaxes sont assez similaires et les résultats de ces deux codes sont équivalents.

N.B. : type ou interface, ces deux mots clés ne sont utilisés que dans la syntaxe TS et n'apparaîtront pas dans le code JS généré après compilation.<br>

### Manipuler des listes fortement typées 

En TypeScript, il est possible de dire à notre code qu'un tableau (Array) contiendra des données avec un type spécifique.<br>
Pour cela, on va ajouter des crochets [] à droite du type souhaité :<br>

```TypeScript
type MyArrayOfNumbers = number[]; // définition d'un tableau de nombres

const arrayOk: MyArrayOfNumbers = [1, 2, 3]; // ce tableau est OK

const arrayNotOk: MyArrayOfNumbers = [1, 'two', false]; // renvoie une erreur TS
```

Quand on manipule un tableau typé, il faut s'assurer qu'il ne contiendra que des variables du type qu'on a défini.<br>

Il existe une syntaxe alternative préférable à utiliser lorsqu'on ne connaît pas le contenu du tableau :<br>
```TypeScript
type MyArrayOfNumbers = Array<number>;
``` 

## Rendre ses types génériques 

### Donner des paramètres aux types

Les génériques sont un concept très puissant de TypeScript.<br>
Cela va permettre de rendre un type générique tel un modèle et de réutiliser ce modèle pour définir d'autres types :<br>

On va assigner au type une sorte de paramètre noté entre "< >".
Ainsi, lorsqu'on appelle ce type générique pour définir un autre type, on pourra lui passer en paramètre un type qu'on souhaite.<br>
ex 1 :
```TypeScript
type Shop<T> = { // le paramètre T est une convention. On peut utiliser ce qu'on veut : ItemType, ou unknown par exemple. Ce type est utilisable partout dans le générique
    name: string;
    items: Array<T>; // on passe le paramètre T qui est pour l'instant inconnu, mais sera défini plus tard lors de l'appel de type Shop. Il est important que le terme utilisé soit le même que celui du paramètre situé après 'Shop'.
};
type ShopOfNumbers = Shop<number>;
type ShopOfNumbers = Shop<string>;
type ShopOfNumbers = Shop<boolean>;

```
ex 2 :
```TypeScript
interface Character {
    name: string;
    life: number;
    attack: number;
    defense: number;
};
type Pet = Character;
interface Hero extends Character {
    pet?: Pet;
};
type Shop<ItemType> = { 
    name: string;
    owner: Character;
    items: Array<ItemType>; // on passe le paramètre T qui est pour l'instant inconnu, mais sera défini plus tard lors de l'appel de type Shop. Il est important que le terme utilisé soit le même que celui du paramètre situé après 'Shop'.
};
type Equipment = {
    price: number;
    attack?: number;
    defense?: numnber;
};
type Potion = {
    price: number;
    magic: number;
    attack?: number;
    defense?: numnber;
}
// Armurerie est un shop qui vend des équipements
type Armory = Shop<Equipment>;
// l'animalerie est un shop qui vend des animaux
type PetShop = Shop<Pet>;
// l'Apothicaire est un shop qui vend des potions
type Apothecary = Shop<Potion>;
```
Dans l'exemple 2, il faut bien comprendre que les trois types Armory, PetShop et Apothecary sont des alias pour les types respectifs :<br>
```TypeScript
Shop<Equipment>;
Shop<Pet>;
Shop<Potion>;
```
On préférera donc utiliser le mot clé 'interface' et refactoriser le code comme suit :
```TypeScript
interface Character {
    name: string;
    life: number;
    attack: number;
    defense: number;
};
type Pet = Character;
interface Hero extends Character {
    pet?: Pet;
};
interface Shop<ItemType> { 
    name: string;
    owner: Character;
    items: Array<ItemType>; // on passe le paramètre T qui est pour l'instant inconnu, mais sera défini plus tard lors de l'appel de type Shop. Il est important que le terme utilisé soit le même que celui du paramètre situé après 'Shop'.
};
// On va utiliser une fonction générique 
function createShop<ItemType>(name: string, owner: Character, items: Array<ItemType>;): Shop<ItemType> {
    return {name, owner, items};
}
// Appel de la fonction générique
const aromry = createShop<Equipment>('My Armory', {name: 'Bob', life: 100, attack: 1, defense: 2}, []);
```

#### Les fonctions génériques

Il n'est pas nécessaire de préciser le "paramètre type" si celui-ci est utilisé pour définir le type d'un des paramètres de la fonction.<br>
TypeScript peut le deviner lui-même.<br>

```TypeScript
// Une fonction qui retourne simplement ce qu'elle reçoit en paramètre
function returnParameter<T>(x: T): T {
    return x;
}
// Ceci fonctionne, c'est ce que nous avons vu jusque-là
const a = returnParameter<number>(1);
// Mais puisque le type "T" est utilisé pour typer le paramètre "x",
// il n'est pas nécessaire de le préciser en appelant la fonction.
// Avec la ligne ci-dessous, TypeScript devine tout seul que "T" est "number" !
const a2 = returnParameter(1);
```

Les génériques permettent aux types d'être plus facilement réutilisables.<br>
Mais cela rend le code plus complexe.<br>

### Utiliser les génériques proposés par TypeScript
