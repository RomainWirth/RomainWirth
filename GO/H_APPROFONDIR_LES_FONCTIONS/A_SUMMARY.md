# H. APPROFONDIR LES `FONCTIONS`

## [B — Les fonctions en tant que valeurs et les types de fonctions](B_LES_FONCTIONS_EN_TANT_QUE_VALEURS_ET_LES_TYPES_DE_FONCTIONS.md)

- En Go, les fonctions sont des **valeurs de première classe** : elles peuvent être passées en paramètre ou retournées par d'autres fonctions.
- Passer une fonction en paramètre : `func name(param type, fn func(typeParam) typeReturn) typeReturn`
- Créer un **alias de type** pour simplifier les signatures complexes : `type myFn func(int) int`
- Une fonction peut **retourner une autre fonction** — utile pour sélectionner dynamiquement une stratégie.
- Passer une fonction sans l'exécuter : `transformNumbers(&numbers, double)` — sans les parenthèses `()`.

## [C — Introduction aux fonctions anonymes](C_INTRODUCTION_AUX_FONCTIONS_ANONYMES.md)

- Une **fonction anonyme** est une fonction sans nom, définie directement là où elle est attendue.
- Elle doit correspondre au type de fonction attendu par la fonction qui la reçoit.
- Préférer une fonction anonyme quand la logique n'a pas besoin d'être réutilisée.
- **Closure** : une fonction anonyme peut capturer les variables de son scope externe (fermeture).
- **Fabrique de fonctions** : `createTransformer(factor)` retourne une fonction anonyme qui mémorise `factor` grâce à la closure.

## [D — Les fonctions récursives et variadiques](D_LES_FONCTIONS_RECURSIVES_ET_VARIADIQUES.md)

- **Récursivité** : une fonction qui s'appelle elle-même. Nécessite un cas de base pour s'arrêter.
- Chaque appel attend la résolution de l'appel imbriqué avant de retourner son résultat.
- **Variadique** : `func name(values ...type)` — accepte 0 à N arguments du même type.
- À l'intérieur de la fonction, le paramètre variadique est traité comme une **slice**.
- Restriction : une seule paramètre variadique par fonction, placé **en dernier**.
- Passer une slice à une fonction variadique : `sumup(mySlice...)` — le spread operator déplie la slice.
