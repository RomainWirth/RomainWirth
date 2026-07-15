# INTERFACE & CODE GÉNÉRIQUE - Sommaire

> Écrire du code flexible et réutilisable avec les interfaces et les génériques en Go.

---

## [B - Qu'est-ce qu'une interface et comment la créer ?](B_QU_EST_CE_QU_UNE_INTERFACE_ET_COMMENT_LA_CREER.md)

- Une **interface** est un contrat définissant les méthodes qu'un type doit posséder.
- Syntaxe : `type nomInterface interface { Methode(params) typeRetour }` - pas de corps, seulement les signatures.
- Résout le problème des fonctions devant accepter des **types différents** partageant un comportement commun.
- Convention : interface à une seule méthode → ajouter `er` au nom (`Save` → `Saver`, `Display` → `Displayer`).
- Une interface est un **type** et peut être utilisée partout où un type est attendu.

---

## [C - Utiliser une interface](C_UTILISER_UNE_INTERFACE.md)

- Paramètre de type interface : `func saveData(data saver) error` - accepte tout type qui implémente `saver`.
- **Implémentation implicite** : aucune déclaration `implements` - Go vérifie automatiquement les signatures de méthodes.
- **Interfaces nestées** : `type outputtable interface { saver; Display() }` - combine plusieurs contrats.
- `interface{}` / `any` : accepte n'importe quel type - flexibilité maximale, à utiliser avec précaution.
- **Type switch** : `switch value.(type) { case int: ... }` - inspecte le type dynamique.
- **Type assertion** : `typedVal, ok := value.(int)` - extrait la valeur typée, `ok` indique le succès.
- **Génériques** (`Go 1.18+`) : `func add[T int | float64 | string](a, b T) T` - fonctions typées et flexibles sans `interface{}`.
- Type inféré automatiquement à l'appel - idéal pour les bibliothèques réutilisables.
