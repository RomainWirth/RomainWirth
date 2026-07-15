# Clean Code — Sommaire

Cours sur les bonnes pratiques d'écriture du code : nommage, structure, principes de conception, tests et outils. Les exemples sont en JavaScript, mais les principes s'appliquent à tous les langages orientés objet.

## Parcours conseillé

1. [01-introduction.md](./01-introduction.md)
2. [02-principe-solid.md](./02-principe-solid.md)
3. [03-design-pattern.md](./03-design-pattern.md)
4. [04-exercice-pratique.md](./04-exercice-pratique.md)
5. [05-les-tests-unitaires.md](./05-les-tests-unitaires.md)
6. [06-outils-et-ia.md](./06-outils-et-ia.md)
7. [07-principes-de-clean-code-supplementaires.md](./07-principes-de-clean-code-supplementaires.md)

## Contenu du dossier

### [01-introduction.md](./01-introduction.md)

Pourquoi la qualité du code compte, conventions de nommage (camelCase, PascalCase, snake_case, kebab-case), principe DRY, gestion des erreurs, refactoring et règle du Boy Scout.

### [02-principe-solid.md](./02-principe-solid.md)

Les cinq principes SOLID (SRP, OCP, LSP, ISP, DIP) : définitions, mauvais exemples puis versions refactorisées en JavaScript, relations entre les principes et tableau de synthèse.

### [03-design-pattern.md](./03-design-pattern.md)

Les patterns de conception les plus courants, organisés en trois familles : comportementaux (Observer, Strategy, Command, State, Chain of Responsibility), création (Singleton, Factory Method, Builder, Dependency Injection) et structurels (Adapter, Decorator, Composite, Facade, Proxy).

### [04-exercice-pratique.md](./04-exercice-pratique.md)

Exercice de refactoring guidé pas à pas : amélioration du nommage, découpage en fonctions à responsabilité unique, élimination de la duplication, gestion des erreurs et documentation JSDoc. Correction commentée et résumé.

### [05-les-tests-unitaires.md](./05-les-tests-unitaires.md)

Pourquoi tester, les trois types de cas (nominal, limite, erreur), présentation comparative de Jest, Vitest et Mocha + Chai, mini-framework maison expliqué, et suite de tests unitaires complète sur l'exercice précédent.

### [06-outils-et-ia.md](./06-outils-et-ia.md)

Principe KISS avec exemples, configuration d'ESLint (initialisation, règles utiles, directive disable, settings VS Code), GitHub Copilot (fonctionnalités, commandes de chat, code review) et ZZZCode AI (tableau des outils disponibles).

### [07-principes-de-clean-code-supplementaires.md](./07-principes-de-clean-code-supplementaires.md)

Loi de Demeter (anti-pattern train wreck, règle des amis immédiats) et principe YAGNI (You Ain't Gonna Need It), avec exemples traduits en anglais et résumé.

## Contenu du dossier `exercices/`

Exercices pratiques associés aux chapitres :

- `exercice.js` — code à refactoriser (chapitre 04)
- `correction.js` — correction de référence
- `solution.js` — variante en français
- `solution-ia.js` — variante orientée switch/case

## Conseil de progression

- lire un chapitre ;
- appliquer les exemples dans son propre éditeur ;
- refaire les exercices sans regarder la correction ;
- passer au chapitre suivant.
