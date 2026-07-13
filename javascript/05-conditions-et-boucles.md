# Module 05 - Conditions et boucles

## La condition `if / else if / else`

```javascript
const note = 14;

if (note >= 16) {
  console.log('Très bien');
} else if (note >= 10) {
  console.log('Admis');
} else {
  console.log('Recalé');
}
```

### Le pattern "guard clause" (retour anticipé)

Pluttôt que d'imbriquer des conditions, on peut sortir tôt de la fonction avec `return` pour éliminer les cas invalides en premier. Le code principal se retrouve sans imbrication :

```javascript
// Sans guard clause - imbrication profonde
function traiterCommande(commande) {
    if (commande) {
        if (commande.items.length > 0) {
            if (commande.paiementValide) {
                // logique principale...
            }
        }
    }
}

// Avec guard clauses - plus lisible
function traiterCommande(commande) {
    if (!commande) return;
    if (commande.items.length === 0) return;
    if (!commande.paiementValide) return;

    // logique principale sans imbrication
}
```

C'est un réflexe de clean code important : les conditions de garde en tête de fonction, le "happy path" à plat.

## Le `switch`

Utile quand on compare une même variable à plusieurs valeurs possibles :

```javascript
const jour = 'lundi';

switch (jour) {
  case 'samedi':
  case 'dimanche':
    console.log('Week-end');
    break;
  default:
    console.log('Jour de semaine');
}
```

Le mot-clé `break` est indispensable pour éviter que l'exécution ne "tombe" dans le `case` suivant (*fall-through*).

Le `switch` utilise une comparaison **stricte** (`===`) : `switch('5')` ne correspondra pas à `case 5`.

Dans une fonction, on peut remplacer `break` par `return` pour retourner directement une valeur :

```javascript
function getTypeJour(jour) {
    switch (jour) {
        case 'samedi':
        case 'dimanche':
            return 'Week-end';
        default:
            return 'Jour de semaine';
    }
}

## La boucle `for`

```javascript
for (let i = 0; i < 5; i++) {
  console.log(i); // affiche 0, 1, 2, 3, 4
}
```

Trois parties séparées par des `;` : l'initialisation, la condition de poursuite, l'incrémentation.

## La boucle `while` et `do...while`

```javascript
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while exécute le bloc au moins une fois
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);
```

> ⚠️ **Boucle infinie** : si la condition d'une boucle `while` ne devient jamais fausse, le script plante le navigateur. Toujours s'assurer que la variable de contrôle est bien modifiée dans le corps de la boucle.

## `for...of` - parcourir les valeurs d'un itérable

```javascript
const fruits = ['pomme', 'poire', 'abricot'];
for (const fruit of fruits) {
  console.log(fruit);
}
```

Pour avoir à la fois l'**index** et la **valeur**, utiliser `.entries()` :

```javascript
for (const [index, fruit] of fruits.entries()) {
  console.log(index, fruit); // 0 'pomme', 1 'poire', 2 'abricot'
}
```

`for...of` fonctionne sur tout itérable : tableaux, strings, `Map`, `Set`...

## `for...in` - parcourir les clés d'un objet

```javascript
const personne = { nom: 'Jean', age: 25 };
for (const cle in personne) {
  console.log(cle, personne[cle]);
}
```

> ⚠️ `for...in` parcourt les **clés** (utile pour un objet). `for...of` parcourt les **valeurs** (utile pour un tableau ou une string). Confondre les deux est une erreur fréquente chez les débutants.
>
> ⚠️ **Ne pas utiliser `for...in` sur un tableau** : il parcourt aussi les propriétés héritées du prototype et ne garantit pas l'ordre. Préférer `for...of`, `.forEach()` ou un `for` classique sur les tableaux.

## `break` et `continue`

```javascript
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // passe à l'itération suivante
  if (i === 6) break;    // sort complètement de la boucle
  console.log(i);
}
// Affiche : 0, 1, 2, 4, 5
```

---

## Résumé

| Structure | Usage typique |
|---|---|
| `if / else if / else` | Conditions multiples, cas général |
| Guard clause (`if ... return`) | Éliminer les cas invalides en tête de fonction |
| `switch` | Comparer une variable à plusieurs valeurs fixes (comparison `===`) |
| `for` | Boucle avec index connu à l'avance |
| `while` | Boucle tant qu'une condition est vraie (nombre d'itérations inconnu) |
| `do...while` | Comme `while`, mais le bloc s'exécute au moins une fois |
| `for...of` | Parcourir les **valeurs** d'un tableau, string ou itérable |
| `for...of .entries()` | Parcourir valeurs + index simultanément |
| `for...in` | Parcourir les **clés** d'un objet (pas sur un tableau) |
| `break` | Sortir d'une boucle ou d'un `switch` |
| `continue` | Passer à l'itération suivante |

## Prochaine étape

**Module 06 - Les chaînes de caractères** : méthodes de manipulation de strings (`trim`, `split`, `includes`, `replace`...) et interpolation.
