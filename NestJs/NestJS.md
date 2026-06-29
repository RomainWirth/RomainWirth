# NESTJS

source : https://www.youtube.com/watch?v=F_oOtaxb0L8 

## Qu'est ce que NestJS ?

1. NestJs est un framework node.js, utilisé au niveau du backend (côté serveur).<br>
2. Il est construit sur Express.js qui est un autre framework node.js.<br>
3. NestJs ajoute de nouvelles idées comme l'utilisation de typescript (non obligatoire mais fait pour ça).<br>
4. Nest est utilisé pour contruire des applications MVC (Model-Vue-Contrôleur) ou REST, ou encore des APIs GraphQL.<br>
5. NestJs oblige à écrire du 'clean code' et une structure de projet claire en donnant des séries de blocs de construction.<br>
6. Nest permet de contruire facilement des applications complexes.<br>

## Comment fonctionne NestJS ?

Tout d'abord, s'assurer d'avoir la dernière version de nodejs (LTS).<br>
Ensuite installer le cli nest avec npm:  <br>
```bash
npm i -g @nestjs/cli
```
Puis pour débuter un nouveau projet : <br>
```bash
nest new project-name
```
Pour lancer votre application dans dev mode : <br>
```bash
npm run start
```

### Les principaux concepts de NestJS sont les suivants :

le dossier src contient les fichiers sur lesquels on va travailler.<br>
le dossier 'test' permet d'écrire ses propre tests.<br>

au sein de Src :<br>
* **app.controller.spec.ts** :<br> 
est utilisé pour les tests unitaires.
* **main.ts** :<br> 
point d'entrée de l'application nest. Lorsqu'on sort l'application, le code est compilé en JavaScript pour être lu par le navigateur.<br>
NestFactory est un outil donné par nestjs pour créer une nouvelle application.<br>
await app.listen(port) indique le port sur lequel on va "écouter" l'application pour la visualiser sur le navigateur.<br>
* **app.module.ts** :<br>
les points importants d'une nestjs app : les providers et controllers.<br>
Les _controllers_ contrôlent les requêtes entrantes et sont responsable de retourner une réponse.<br>
Les _providers_ permettent d'ajouter des fonctionnalités.<br>
