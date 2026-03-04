# INTRODUCTION

## QU'EST-CE-QUE STRAPI ?

Strapi est un `CMS headless auto-hébergé et open source`, qui fournit des `fonctionnalités backend courantes` prêtes à l'emploi, tout en étant `totalement extensible`.

### Est-ce que Strapi est gratuit ?

* Strapi est développé en tant que projet `open source`.
* Il est `gratuit` à utiliser en tant qu'`application auto-hébergée` (édition communautaire).
* L'édition communautaire a `quelques limitations` mais est bien adaptée aux `développeurs solo` ou aux `petites entreprises`.
    * exemple : limitation du nombre de rôles administrateur dans le panel administration 

### Que signifie Headless ? 

* Strapi est un `CMS Headless`, cela signifie qu'il s'agit d'une application backend qui est `indépendante` et `compatible` avec les technologies frontend que vous utilisez.  
Le backend et le frontend communiquent ensemble mais sont totalement découplés.

```
CMS Headless = Un CMS headless (système de gestion de contenu sans tête) est un CMS où le backend (gestion du contenu) est découplé du frontend (affichage).

Contrairement à un CMS traditionnel (comme WordPress) qui gère à la fois le contenu et son affichage, un CMS headless :
- Stocke et gère uniquement le contenu
- Expose le contenu via une API (REST ou GraphQL)
- Laisse le choix du frontend (React, Vue, mobile, etc.)

Le terme "headless" signifie littéralement "sans tête", la "tête" représentant la couche d'affichage (frontend).
```

### Fonctionnalités prêtes à l'emploi 

* Strapi contient une `interface d'administration` : 
    * il s'agit d'une application React simple qui supporte des rôles utilisateur.
    * C'est l'interface graphique qui permet de `gérer le contenu et la configuration` de l'application, accessible uniquement aux administrateurs.
* Création facile de `modèles de données` (types de contenu) : 
    * Permet de créer des modèles de données de zéro (appelés content types ou types de contenu). Cela signifie qu'il n'y a pas de modèle prédéfini de donnés (comme dans WordPress).
    * Les `types de contenu` sont les structures de données que vous définissez dans Strapi pour organiser votre contenu (ex: Article, Produit, Utilisateur, etc.)
* Génération automatique des `fonctions CRUD` et de l'`API REST/GraphQL` : 
    * la génération automatique se base sur les modèles de données

```
CRUD signifie :

Create (Créer)
Read (Lire)
Update (Mettre à jour)
Delete (Supprimer)
Strapi génère automatiquement ces fonctions ainsi que les endpoints API correspondants pour chaque type de contenu que vous créez.
```
* `Système d'autorisation` configurable pour chaque type de contenu :
    * Cela signifie que vous pouvez définir qui a accès à quoi dans votre application, pour chaque type de contenu (ex: les utilisateurs non connectés peuvent lire les articles, mais seuls les administrateurs peuvent en créer).
    * Permet de définir quels content types sont public ou non, mais aussi pour quel type d'opérations.
* Système d'`authentification des utilisateurs` : 
    * Cela signifie que Strapi intègre un système permettant de `gérer l'identité des utilisateurs` (inscription, connexion, déconnexion) directement dans l'application.
* Serveur de `médias` :
    * Cela désigne un serveur qui permet de `stocker et gérer les fichiers médias` (images, vidéos, documents, etc.) de votre application. Dans Strapi, il est possible de configurer un serveur de médias externe (ex: Cloudinary, AWS S3, etc.)
* Serveur d'`emails` :
    * Cela désigne un serveur qui permet d'`envoyer des emails` depuis votre application. Dans Strapi, il est possible de configurer un serveur d'emails externe (ex: SendGrid, Mailgun, etc.)
* `Internationalisation` (souvent abrégée i18n) :
    * Cela désigne la capacité de Strapi à gérer du contenu en `plusieurs langues`. Cela permet de créer et gérer des versions traduites de votre contenu pour différentes régions du monde (ex: français, anglais, espagnol, etc.)
* Options de `déploiement faciles` (supporte également Docker) :
    * Cela signifie que Strapi peut être `déployé facilement` sur différentes plateformes (ex: Heroku, AWS, DigitalOcean, etc.) et supporte également `Docker` pour la conteneurisation de l'application.
    * Stapi est basé sur NodeJS et peut donc être déployé sur n'importe quel `environnement d'exécution NodeJS`.
    * L'équipe Strapi a également lancé son propre solution gérée `Strapi Cloud` pour le déploiement

### Extensibilité 

* `API de plugins` pour l'extension de la logique applicative (avec une marketplace officielle de plugins). Cela signifie que Strapi propose :
    * Une `API de plugins` permettant de créer ou d'installer des plugins pour étendre les fonctionnalités de l'application
    * Une `marketplace officielle` où vous pouvez trouver des plugins développés par la communauté ou l'équipe Strapi (ex: SEO, sitemap, etc.)
* `Extension du cœur de l'application`, c'est-à-dire la modification manuelle du code source, basée sur le framework KoaJS : 
    * Strapi permet une `personnalisation avancée` en modifiant directement le code source de l'application, grâce au framework `KoaJS` qui est un framework NodeJS léger et flexible utilisé comme base par Strapi.
* `Interface d'administration` : il s'agit d'une application React, qui peut être facilement `personnalisée`, et même `déployée séparément` de l'application serveur, si nécessaire.

## INSTALLATION DE STRAPI

### Versions node supportées 

* Strapi supporte actuellement les `versions NodeJS 20, 22 et 24`
* pour vérifier la version de node, il faut entrer cette commande dans le terminal : `node -v`
* Si Node n'est pas installé ou que ce n'est pas la bonne version, il est recommandé d'utiliser `Node Version Manager`, qui permet d'installer n'importe quelle version de Node.  
N.B. : nvm permet d'avoir plus d'une version de node sur son ordinateur 
    * pour installer nvm, utiliser cette commande dans le terminal : `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
    * vérifier que nvm est bien installé : `nvm --version`
* La commande nvm pour installer node : 
    * dernière version de node (latest) : `nvm install --lts` ou `nvm install node`
    * version spécifique : `nvm install <version>` (ex: nvm install 20)  
* pour changer de version de node, il suffit d'utiliser la commande : `nvm use <version>`
* pour désinstaller une version de node : `nvm uninstall <version>`

### Systèmes d'Exploitation supportés 

* MacOS
* Unix/Linux
* Windows (via Windows Subsystem for Linux)

### Créer un nouveau projet Strapi

Suivre le [Quick Start](https://docs.strapi.io/cms/quick-start)

* Dans un terminal, d'abord vérifier sa version de node.  
* Puis entrer la commande : `npx create-strapi@latest <name-of-my-strapi-project>`  
* l'output sera potentiellement le suivant :
```
Need to install the following packages:
create-strapi@5.38.0
Ok to proceed? (y)
```
il faudra appuyer sur `y` puis enter.  
* Une fenêtre de navigation va s'ouvrir et va demander `login/sign up` pour activer son compte utilisateur
* il faudra ensuite configurer l'environnement via le terminal : 
```
✔ Authentication successful!
? Do you want to use the default database (sqlite) ? (Y/n)
? Start with an example structure & data? (y/N)
? Start with Typescript? (Y/n)
? Install dependencies with npm? (Y/n)
? Initialize a git repository? (Y/n)
? Participate in anonymous A/B testing (to improve Strapi)? (y/N)
```
* Une fois l'installation faite, lancer l'application avec `npm run dev`. 
* Le dashboard utilisateur va s'ouvrir, il faudra alors créer le premier utilisateur de l'application en entrant les informations ci-dessous pour créer le premier utilisateur de l'application : 
    * prénom
    * nom
    * email
    * mot de passe
    * confirmation de mot de passe

### Strapi QuickStart

Pour accélérer la création d'un projet strapi, il est possible d'utiliser cette commande :  
* avec yarn : `yarn create strapi-app <project-name> --quick-start`
* avec npx : `npx create-strapi-app@latest <project-name> --quick-start`

Ces deux commandes démarrent un projet strapi : 
* avec bootstrap
* en installant toutes les dépendances 
* build l'UI administrateur
* démarre un serveur de développement : `localhost:1337`
    * route `/admin` pour l'interface administration
    * route `/api` pour l'api 
    * route `/graphql` pour l'api GraphQL

## STRAPI ET TYPESCRIPT

### Scripts d'installation quickstart 

* avec yarn : `yarn create strapi-app <project-name> --quick-start --typescript`
* avec npx : `npx create-strapi-app@latest <project-name> --quick-start --typescript`

N.B. : `typescript` peut être réduit par `ts`

### Ajouter TypeScript à un projet existant

Se rendre sur la [documentation](https://docs.strapi.io/cms/typescript/adding-support-to-existing-project#__docusaurus_skipToContent_fallback)

Il faut ajouter deux fichiers : 
* un fichier `tsconfig.json` à la racine du projet et y copier/coller le code correspondant depuis la doc
* un fichier `tsconfig.json` sous `./src/admin/` et y copier/coller le code correspondant depuis la doc

* Il est aussi conseillé de supprimer les fichiers `eslint` du projet.  
* Optionnel (sauf si utilisation d'une BDD SQLite) :  
il faut ajouter un `'..'` à la propriété `filename` du fichier de configuration `database.ts`.  
TypeScript va créer un sous dossier `dist`.  
On se retrouvera donc un niveau en dessous pour accéder au même fichier de la base de données. C'est pourquoi les `'..'` sont nécessaires. 
* Enfin, il faut `rebuild` l'application pour que les changements prennent effets.
    * avec `yarn build` puis `yarn develop` 
    * ou `npm run build` puis `npm run develop`

## VUE D'ENSEMBLE DU PANNEAU D'ADMINISTRATION

### Les Différents utilisateurs : les admins vs les utilisateurs

Il existe 3 grands `rôles admin` de base, que l'on peut retrouver à cet url : `http://localhost:1337/admin/settings/roles`.  
Il est également possible de créer des rôles sur mesure.

#### Le Super Admin

Il s'agit de l'app designer = tous les privilèges

**Ce qu'il fait :** 
* Il définit le modèle de données et la logique métier.
* Il configure les paramètres de l'application.
* C'est un rôle technique car il est responsable de l'entièreté de l'implémentation de la logique de l'application.

**Où ? :**
* Il passe la majeur partie de son temps dans le constructeur de content types.
* Ainsi quand dans les paramètres de l'application.

#### L'éditeur = quelques privilèges

**Ce qu'il fait :**
* il crée/édite du contenu.
* supervise tous les auteurs.

**Où ? :**
* Il passe la majeur partie de son temps dans le `content manager`.

#### L'Autheur = uniquement autoriseé à créer et éditer du contenu

**Ce qu'il fait :**
* il crée/édite du contenu.
* il n'a pas accès au contenu des autres autheurs.

**Où ? :**
* Il passe la majeur partie de son temps dans le `content manager`

#### L'utilisateur de l'application != admin

Il s'agit de l'utilisateur final de l'application. 

**Ce qu'il fait :**
* il se connecte/crée un compte sur l'application

**Où ? :**
* Sur le front-end de l'application

On peut retrouver la structure de données de cet utilisateur sous `content-type builder` > `User`.  
à l'url : `http://localhost:1337/admin/plugins/content-type-builder/content-types/plugin::users-permissions.user`

### L'onglet `Content Manager`

Il s'agit de l'endroit ou on va éditer du contenu, selon les content-types pré-configurés. 

### L'onglet `Content-type builder`

C'est l'endroit ou l'`app designer` (le super admin) va créer les content-types et les structures de données.

### L'onglet `media library`

On y retrouvera toute la banque d'images ou autres fichiers uploadés. 

### L'onglet `marketplace`

Cela renvoit sur la marketplace du site de strapi.  
On y retrouve les plugins qu'on peut ajouter à l'application. 

### L'onglet settings

Ce sont les paramètres de l'application.  
On y retrouve notamment la version de strapi et la version de node utilisée.
