# Module 16 - `async` / `await`

## Principe

`async`/`await` est un **sucre syntaxique** : il ne rajoute pas de fonctionnalité nouvelle, mais permet d'écrire des promesses avec une syntaxe qui ressemble à du code synchrone classique.

## Le mot-clé `async`

Placé devant une fonction, il la transforme en fonction asynchrone. La fonction retourne **toujours une promesse**, quelle que soit la valeur renvoyée en interne.

```javascript
async function bonjour() {
    return 'Bonjour';
}

bonjour().then(alert); // "Bonjour"
```

## Le mot-clé `await`

Utilisable uniquement dans une fonction `async`. Il met en pause l'exécution de la fonction jusqu'à ce que la promesse soit résolue ou rejetée :

```javascript
const test = async () => {
    const promise = new Promise((resolve) => {
        setTimeout(() => resolve('Ok !'), 2000)
    });

    let result = await promise; // attend 2 secondes
    alert(result);              // "Ok !"
}

test();
```

`await` est une alternative plus lisible à `.then()`.

## Réécrire un enchaînement de promesses

Sans `async`/`await` :

```javascript
loadScript('boucle.js')
    .then(r1 => { alert(r1); return loadScript('script2.js'); })
    .then(r2 => { alert(r2); return loadScript('script3.js'); })
    .catch(err => alert(err.message));
```

Avec `async`/`await` :

```javascript
const test = async () => {
    const test1 = await loadScript('boucle.js');
    alert(test1);
    const test2 = await loadScript('script2.js');
    alert(test2);
    const test3 = await loadScript('script3.js');
    alert(test3);
}
test();
```

La logique se lit de haut en bas, comme du code synchrone.

## Gestion des erreurs

Si une promesse est rejetée, `await` lance une erreur capturable avec `try...catch` (voir module 14) :

```javascript
const test = async () => {
    try {
        const test1 = await loadScript('boucle.js');
        alert(test1);
        const test2 = await loadScript('script2.js');
        alert(test2);
        const test3 = await loadScript('script3.js');
        alert(test3);
    } catch (err) {
        alert(err);
    }
}
test();
```

## `async`/`await` avec `Promise.all()`

```javascript
const chargerTout = async () => {
    try {
        const resultats = await Promise.all([
            loadScript('script1.js'),
            loadScript('script2.js'),
            loadScript('script3.js')
        ]);
        console.log('Tous chargés :', resultats);
    } catch (err) {
        console.log('Échec :', err);
    }
}
```

## Séquentiel vs parallèle - un piège critique

Awaiter plusieurs promesses **l'une après l'autre** les exécute en **série** : chaque opération attend la fin de la précédente.

```javascript
// ⚠️ Séquentiel - lent
const user    = await fetchUser(1);    // attend 300ms
const profile = await fetchProfile(1); // attend encore 200ms
// Durée totale : 500ms
```

Si les opérations sont **indépendantes**, les lancer en parallèle avec `Promise.all()` est bien plus rapide :

```javascript
// ✅ Parallèle - rapide
const [user, profile] = await Promise.all([
    fetchUser(1),
    fetchProfile(1)
]);
// Durée totale : max(300ms, 200ms) = 300ms
```

> ℹ️ Règle pratique : si deux `await` ne dépendent pas l'un de l'autre, les lancer en parallèle avec `Promise.all()`.

## `await` dans les boucles

`await` fonctionne dans une boucle `for...of`, mais **pas dans `forEach`** : les callbacks de `forEach` ne sont pas `async`, donc les `await` s'y exécutent sans attendre.

```javascript
const ids = [1, 2, 3];

// ⚠️ Ne fonctionne pas : forEach n'attend pas les await
ids.forEach(async (id) => {
    const data = await fetch(`/api/${id}`); // les requêtes partent en parallèle sans ordre garanti
});

// ✅ Utiliser for...of pour un traitement séquentiel
for (const id of ids) {
    const data = await fetch(`/api/${id}`);
    console.log(await data.json());
}

// ✅ Ou Promise.all pour un traitement parallèle avec résultat ordonné
const resultats = await Promise.all(ids.map(id => fetch(`/api/${id}`)));
```

## Top-level `await` (ES2022)

Dans les **modules ES** (`type="module"`), on peut utiliser `await` directement au niveau racine du fichier, sans l'envelopper dans une fonction `async` :

```javascript
// Dans un fichier .mjs ou <script type="module">
const config = await fetch('/config.json').then(r => r.json());
console.log(config); // disponible immédiatement dans le module
```

Dans un fichier JS classique (sans module), `await` hors fonction reste interdit - il faut toujours une fonction `async` englobante.

---

## Résumé

| Notion | À retenir |
|---|---|
| `async function` | Retourne toujours une promesse, autorise `await` dans son corps |
| `await promesse` | Met en pause jusqu'à la résolution, retourne la valeur résolue |
| `await` en cas de rejet | Lève une erreur - capturer avec `try...catch` |
| `async`/`await` vs `.then()` | Équivalents fonctionnellement - `async`/`await` est plus lisible |
| Séquentiel | `await` un par un : chaque opération attend la fin de la précédente |
| Parallèle | `await Promise.all([...])` : toutes les opérations partent simultanément |
| `forEach` + `await` | Ne fonctionne pas : utiliser `for...of` ou `Promise.all + map` |
| Top-level `await` | Possible dans les modules ES - pas dans les scripts classiques |

## Prochaine étape

**Module 17 - L'API Fetch** : faire des requêtes HTTP depuis le navigateur, exploiter `response.json()`, gérer les erreurs HTTP, enchaîner GET et PUT.
