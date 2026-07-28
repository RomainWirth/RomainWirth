# TYPESCRIPT - SOMMAIRE

Cours sur TypeScript, du typage de base à l'organisation d'un projet multi-fichiers. Chaque module reprend les notes de cours d'origine, corrige les erreurs de code trouvées, et complète certaines notions du socle standard de TypeScript qui n'étaient pas couvertes.

## Parcours conseillé

1. [01-introduction.md](./01-introduction.md)
2. [02-les-types.md](./02-les-types.md)
3. [03-preparer-la-structure-dun-projet.md](./03-preparer-la-structure-dun-projet.md)
4. [04-la-programmation-orientee-objet.md](./04-la-programmation-orientee-objet.md)
5. [05-les-generiques.md](./05-les-generiques.md)
6. [06-les-decorateurs.md](./06-les-decorateurs.md)
7. [07-imports-de-fichiers.md](./07-imports-de-fichiers.md)
8. [08-complements.md](./08-complements.md)
9. [09-projet-convertisseur-de-devises.md](./09-projet-convertisseur-de-devises.md)
10. [10-projet-deviner-le-drapeau.md](./10-projet-deviner-le-drapeau.md)
11. [11-projet-liste-daliments.md](./11-projet-liste-daliments.md)
12. [12-projet-parc-automobile.md](./12-projet-parc-automobile.md)

## Contenu du dossier

### [01-introduction.md](./01-introduction.md)

TypeScript comme **sur-ensemble de JavaScript**, installation (globale ou locale, npm), compilation avec `tsc` (`--target`, `--watch`), premier exemple complet manipulant le DOM (assertions `as HTMLInputElement`), lecture des messages d'erreur, outils utiles (Playground, documentation officielle, extension Total TypeScript).

### [02-les-types.md](./02-les-types.md)

Types primitifs et `any`, typage d'objets et de fonctions, **alias de types (`type`) et interfaces**, union et intersection de types, surcharge de fonctions, tableaux et tuples, `enum`, `unknown`/`never`, `!`/`as`/`?`/`??`, et compléments sur `readonly`, `keyof` et `satisfies`.

### [03-preparer-la-structure-dun-projet.md](./03-preparer-la-structure-dun-projet.md)

Passage d'un fichier `.ts` isolé à un vrai projet avec `tsconfig.json` : options essentielles (`target`, `lib`, `include`/`exclude`, `sourceMap`), **`strict`/`esModuleInterop`/`skipLibCheck`**, débogage dans le navigateur, organisation `src`/`dist`, et utilisation d'une librairie JavaScript (types fournis, `@types`, fichiers `.d.ts` personnalisés).

### [04-la-programmation-orientee-objet.md](./04-la-programmation-orientee-objet.md)

Classes, visibilité (`public`/`private`/`protected`), paramètres de constructeur raccourcis, getters/setters, `static`, `readonly`, héritage (`extends`, `super`, **`override`**), classes et méthodes `abstract`, interfaces sur les classes, et complément sur les vrais champs privés `#` (ES2022).

### [05-les-generiques.md](./05-les-generiques.md)

Fonctions, classes et types réutilisables avec `<T>`, contrainte de type générique avec `extends`, plusieurs paramètres génériques, et principaux **utility types** (`Partial`, `Readonly`, `Record`, ainsi que `Pick`, `Omit` et `Required` en complément).

### [06-les-decorateurs.md](./06-les-decorateurs.md)

Décorateurs de classe, d'attribut, de méthode et de paramètre (API "legacy"), activation via `experimentalDecorators`, décorateurs *factory*, et usage principal dans des frameworks comme Angular ou NestJS.

### [07-imports-de-fichiers.md](./07-imports-de-fichiers.md)

Comparaison des trois façons de faire fonctionner un projet sur plusieurs fichiers : balises `<script>` multiples, **namespaces TypeScript**, et **modules ES** (`import`/`export`, l'approche recommandée), avec complément sur les exports par défaut.

### [08-complements.md](./08-complements.md)

Notions mentionnées sans être développées dans les notes d'origine : **type narrowing** (`typeof`, `instanceof`, `in`, discriminated unions), introduction aux types conditionnels et à `infer`, et ressources externes pour continuer à progresser.

## Projets pratiques

En complément du cours théorique, 4 mini-projets guidés (énoncé + correction étape par étape) mettent en application les notions vues, dans un ordre cohérent avec la progression du cours :

- [09-projet-convertisseur-de-devises.md](./09-projet-convertisseur-de-devises.md) et [10-projet-deviner-le-drapeau.md](./10-projet-deviner-le-drapeau.md) : mettent en pratique les modules 1 à 3 (introduction, types, structure d'un projet).
- [11-projet-liste-daliments.md](./11-projet-liste-daliments.md) : met en pratique le module 4 (POO). Ce même projet est ensuite modularisé de deux façons différentes (imports ES modules / namespaces) pour illustrer le module 7.
- [12-projet-parc-automobile.md](./12-projet-parc-automobile.md) : met en pratique le module 5 (génériques), en réutilisant les acquis du module 4.

Le code final de chaque étape (et de ses variantes de refactorisation) est disponible dans le dossier [Projets-de-cours/](../Projets-de-cours/).

## Logique du dossier

Ce cours peut servir :

- de parcours complet pour apprendre TypeScript en partant de bases JavaScript déjà acquises ;
- de référence rapide sur un concept précis (génériques, décorateurs, imports...) ;
- de support théorique aux **projets pratiques** ci-dessus, à consulter pour approfondir une notion en cours d'implémentation.

## Remarque

Les modules 01 à 04 forment le socle indispensable (typage, structure de projet, POO) et sont à lire dans l'ordre. Les modules 05 à 08 (génériques, décorateurs, imports, compléments) peuvent être consultés de façon plus ponctuelle une fois ce socle acquis. Chaque module se termine par une section "Application pratique" et un résumé en points clés. Les modules 09 à 12 sont des projets pratiques complets, à traiter au fur et à mesure de la progression dans le cours plutôt qu'à la fin : 09 et 10 sont accessibles dès le module 03, 11 dès le module 04, et 12 dès le module 05.
