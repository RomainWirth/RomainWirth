# TYPESCRIPT

## Typescript, c'est quoi ?

Tout d'abord, un point sur JavaScript : un langage qui ne se préoccupe que très peu du type des variables.<br>
C'est un ce qu'on appelle **un langage faiblement typé**.<br>
Ce qui en fait un langage très souple mais peu robuste.<br>
Par exemple, on peut additionner des nombres avec des chaînes de caractères. Cela n'a que très peu de sens, mais c'est possible en JS.

TypeScript est quand à lui **un langage fortement typé**. C'est à dire qu'on devra déclarer le type de la variable au moment de sa déclaration.<br>
Cela permet de faire des vérification des types qu'on manipule. C'est une couche de sécurité qui permet de prévenir les erreurs éventuelles.<br>

Grâce à cette rigueur, les problèmes liés aux types ne sont plus possibles puisque TS indique en avance que le code risque de ne pas fonctionner comme prévu.<br>

TypeScript est tout simplement du javaScirpt dans un cadre plus sécurisé.<br>
il s'agit en fin de compte de JavaScript avec des fonctionnalités en plus.<br>
C'est un **superset** de JavaScript.


## Ecrire du TypeScript pour le web 

JavaScript est lu naturellement par le navigateur.<br>
Ce navigateur n'est pas capable de gérer du TypeScript.<br>

Il faudra donc transformer nos fichiers TS en JS. On utilise un outil qui fait cette transformation via une opération de **compilation**.

Le but de TypeScript est de pouvoir écrire du code plus solide en indiquant clairement les intentions à l'aide de types.

## Inconvénients 

1. **Une nouvelle technologie à apprendre**<br>
Même s'il s'agit de JavaScript, il s'agit d'une nouvelle technologie à apprendre.<br>

2. **Une complexité supplémentaire à appréhender**<br>
Il faut compiler les fichiers TS en JS pour qu'ils soient lus par le navigateur.<br>
Il y a un intermédiaire entre le code écrit et le code exécuté.<br>
Cela signifie aussi que les tests dans la console du navigateur ne pourra plus se faire comme avec du JS.<br>
Certains outils comme _ESLint_ vont avoir besoin d'adaptateurs pour comprendre TS.<br>

3. **Le code peut être plus difficile à lire**
Une syntaxe différente du JS. 

4. **La rigueur demandée peut être frustrante**
Il faut expliciter les types de **toutes** les variables. A la moindre incohérence, TS le fera remarquer.<br>
Cela peut-être perturbant et frustrant au début.<br>

Documentation TypeScript : https://www.typescriptlang.org/docs/

## Installer TypeScript

Tout d'abord, vérifier que nodejs soit installé sur la machine.<br>

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

Une fois Node.js installé, créer un nouveau dossier où on le souhaite dans l'ordinateur, y entrer et y lancer un terminal.<br>

```bash
npm init -y
```
Cette commande génère un projet TypeScript à la racine du dossier.<br>
Un fichier package.json sera généré, on pourra par la suite installer TypeScript :<br>

```bash
npm install --save-dev typescript
```

Nous allons ensuite créer un fichier _'mon-fichier.ts'_ dans lequel on écrira un peu de code en TS.<br>
