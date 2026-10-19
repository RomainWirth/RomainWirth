# Le procédural

## Les méthodes en Java

Voir cours [III_methods](java_III_methods.md)

## Le passage des arguments (types primitifs)

### Principe

Java passe **toujours** les arguments **par valeur** : à l'appel d'une méthode, le paramètre reçoit une **copie** de la valeur de l'argument.

### Vocabulaire

- **Argument** : ce qu'on passe lors de l'appel (`x` dans `increment(x)`).
- **Paramètre** : la variable déclarée dans la signature de la méthode (`n` dans `int increment(int n)`).

Un paramètre est une **variable locale** à la méthode : elle est créée à l'appel, initialisée avec une copie de l'argument (comme si on écrivait `int n = x;`), puis supprimée à la fin de la méthode. Son nom est libre et peut différer de celui de l'argument.

### Exemple

Une variable de type primitif (`int`, `double`, `boolean`...) est une **boîte** qui contient **la valeur**. Appeler une méthode revient à photocopier cette valeur dans la boîte du paramètre.

```java
void increment(int n) {
    n++;
}

int x = 5;
increment(x);
System.out.println(x);   // 5
```

```
À l'appel :                    Après n++ :

  x ┌───┐      n ┌───┐          x ┌───┐      n ┌───┐
    │ 5 │ ───▶   │ 5 │            │ 5 │        │ 6 │
    └───┘        └───┘            └───┘        └───┘
```

Les deux boîtes sont **indépendantes** : modifier `n` ne touche pas `x`. Le `6` disparaît avec `n` à la fin de la méthode.

### Récupérer le résultat

Une méthode ne peut jamais réaffecter la variable de l'appelant. Elle **retourne** une valeur, et c'est l'appelant qui décide où la ranger :

```java
int increment(int n) {
    return n + 1;
}

int y = increment(x);    // y vaut 6, x vaut toujours 5
x = increment(x);        // x vaut maintenant 6
```

> Le cas des objets est différent (la variable contient une référence, pas la valeur) : voir le chapitre sur la création de classes.

## Le mode Debug

### Principe

Le mode debug permet d'**observer l'exécution** d'un programme : arrêter l'exécution à un endroit précis, inspecter les valeurs des variables, puis avancer instruction par instruction. C'est l'outil principal pour comprendre un comportement inattendu ou localiser un bug, plutôt que d'ajouter des `System.out.println`.

### Points d'arrêt (*breakpoints*)

Un point d'arrêt se place en cliquant dans la marge, à gauche du numéro de la ligne (un point rouge apparaît). Il faut ensuite lancer le programme en mode **debug** (icône en forme d'insecte, au lieu du bouton *Run*).

L'exécution se **met en pause juste avant** la ligne marquée : cette ligne n'est pas encore exécutée. On peut alors lire l'état du programme et avancer à son rythme.

### Les commandes du debugger dans IntelliJ

| Commande | Raccourci par défaut* | Rôle |
|---|---|---|
| `Resume Program` | `F9` | Reprend l'exécution jusqu'au **prochain point d'arrêt** (ou jusqu'à la fin du programme). |
| `Step Over` | `F8` | Exécute la ligne courante **sans entrer** dans les méthodes qu'elle appelle, puis passe à la ligne suivante. |
| `Step Into` | `F7` | Si la ligne appelle une méthode, **entre dans cette méthode** pour l'exécuter pas à pas. |
| `Step Out` | `Shift + F8` | Termine la méthode en cours et **revient à l'appelant**. |
| `Rerun` | `Ctrl + F5` | **Relance** le programme en mode debug depuis le début. |
| `Stop` | `Ctrl + F2` | **Arrête** le programme et la session de debug. |
| `View Breakpoints` | `Ctrl + Maj + F8` | Ouvre la liste de **tous les points d'arrêt** du projet, pour les consulter, les activer ou les supprimer. |
| `Mute Breakpoints` | | **Désactive tous les points d'arrêt** temporairement, sans les supprimer : le programme s'exécute normalement. Un nouveau clic les réactive. |

\* Les raccourcis dépendent du système et de la configuration (*keymap*) de l'IDE : à vérifier dans les réglages.

Différence entre `Step Over` et `Step Into` : sur la ligne `int y = increment(x);`, `Step Over` exécute toute la méthode `increment` d'un coup et passe à la ligne suivante, alors que `Step Into` entre dans `increment` et s'arrête à sa première ligne.

### Observer l'état du programme

Pendant une pause, deux zones de la fenêtre de debug sont particulièrement utiles :

- **Variables** : les valeurs des variables visibles à cet endroit. Un objet peut être déplié pour voir ses attributs.
- **Frames** (pile d'appels) : la liste des méthodes en cours d'exécution, de la plus récente à `main`. Cliquer sur une ligne affiche les variables de cette méthode.

### Pour aller plus loin

- **Évaluer une expression** (`Alt + F8`) : calculer à la volée une expression avec les variables courantes (`x + 1`, `building.getType()`).
- **Point d'arrêt conditionnel** : clic droit sur le point d'arrêt, puis saisie d'une condition (`x > 10`). L'exécution ne s'arrête que si elle est vraie. Pratique dans une boucle.
- **Run to Cursor** (`Alt + F9`) : exécuter jusqu'à la ligne où se trouve le curseur, sans poser de point d'arrêt.

### Exemple : observer le passage par valeur

Avec le code `increment` ci-dessus :

1. Poser un point d'arrêt sur `int y = increment(x);`, lancer en debug.
2. `Step Into` (`F7`) : on entre dans `increment`. Le panneau **Variables** montre `n = 5`, et **Frames** liste `increment` au-dessus de `main`.
3. Après `n++`, `n` vaut `6`. En cliquant sur la ligne `main` dans **Frames**, on voit que `x` vaut toujours `5` : ce sont bien deux variables indépendantes.

Pour un objet, on verrait deux variables différentes (`building1` et `param`) qui affichent le **même identifiant** (du type `Building@715`, le nombre varie) : elles pointent vers le même objet.