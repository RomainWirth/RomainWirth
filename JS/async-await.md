# ASYNC AWAIT

La déclaration `async function` et le mot clef `await` sont des "sucres syntaxiques".<br>
Cela signifie qu'ils n'ajoutent pas de nouvelles fonctionnalités en soi au langage,<br> 
mais qu'ils permettent de créer et d'utiliser des promesses avec du code intuitif<br>
et qui ressemble davantage à la syntaxe classique du JS à laquelle on est habitués.

Ces mots clefs sont apparus avec la version 2017 du JS et sont très utilisés par les API modernes.<br>

## LE MOT CLEF `async`

Le mot clef `async` se place devant la déclaration d'une fonction, d'une expression de fonction<br>
ou encore d'une fonction fléchée, pour la transformer en fonction asynchrone.<br>

L'utilisation du mot clé `async` devant une fonction induit que la fonction va toujours retourner une promesse.<br>
Dans le cas où la fonction retourne explicitement une valeur qui n'est pas une promesse,<br>
alors cette valeur sera automatiquement enveloppée dans une promesse.

Les fonctions définies avec `async` vont donc toujours retourner une promesse<br> 
qui sera résolue avec la valeur renvoyée par la fonction asynchrone,<br> 
ou qui sera rompue s'il y a une exception non interceptée émise depuis la fonction asynchrone.<br>
```javascript
async function bonjour(){
  return 'Bonjour';
}

/*
const bonjour = async () => {
    return 'Bonjour';
}
//*/

//La valeur retournée par bonjour() est enveloppée dans une promesse
bonjour().then(alert); // Bonjour
```

## LE MOT CLEF `await`

Le mot clef `await` est uniquement valide au sein de fonctions asynchrones définies avec `async`.<br>

Ce mot clef permet d'interrompre l'exécution d'une fonction asynchrone tant qu'une promesse n'est pas résolue ou rejetée.<br>
La fonction asynchrone reprend ensuite puis renvoie la valeur de résolution.

```javascript
const test = async () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve('Ok !'), 2000)
    });

    let result = await promise; //Attend que la promesse soit résolue ou rejetée
    alert(result);
}

test();
```

Le mot clef `await` permet de mettre en pause l'exécution du code tant qu'une promesse n'est pas consommée,<br>
puis retourne ensuite le résultat de la promesse.<br>
Cela ne consomme aucune ressource supplémentaire puisque le moteur peut effectuer d'autres tâches en attendant :<br>
exécuter d'autres scripts, gérer des événements, etc.

`await` est une syntaxe alternative à `.then()`, plus facile à lire, à comprendre et à écrire.

## UTILISER `async` ET `await` POUR REECRIRE NOS PROMESSES

exemple sans async / await:
```javascript
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        document.head.append(script);
        script.onload = () => resolve('Fichier ' + src + ' bien chargé');
        script.onerror = () => reject(new Error('Echec de chargement de ' + src));
    });
}

loadScript('boucle.js')
    .then((result) => {
        alert(result);
        return loadScript('script2.js');
    })
    .then((result2) => {
        alert(result2);
        return loadScript('script3.js');
    })
    .catch((error) => alert(error.message));
```
Avec async / await, ce même code s'écrit de cette manière :
```javascript
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        document.head.append(script);
        script.onload = () => resolve('Fichier ' + src + ' bien chargé');
        script.onerror = () => reject(new Error('Echec de chargement de ' + src));
    });
}

const test = async () => {
    const test1 = await loadScript('boucle.js');
    alert(test1);
    const test2 = await loadScript('blblbl.js');
    alert(test2);
    const test3 = await loadScript('cdcdcd.js');
    alert(test3);
}
test();
```
Le script fonctionne et ajoute les fichiers les uns à la suite des autres.<br>
Le problème ici est qu'on a aucune prise en charge des erreurs.<br>
On va immédiatement remédier à cela.

## GESTION DES ERREURS AVEC `async` / `await`

Si une promesse est résolue (opération effectuée avec succès), alors `await promise` retourne le résultat.<br>
Dans le cas d'un rejet, une erreur va être lancée de la même manière que si on utilisait `throw`.<br>

Pour capturer une erreur lancée avec `await`, on peut tout simplement utiliser une structure `try ... catch` classique.
```javascript
const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        document.head.append(script);
        script.onload = () => resolve('Fichier ' + src + ' bien chargé');
        script.onerror = () => reject(new Error('Echec de chargement de ' + src));
    });
}

const test = async () => {
    try{
        const test1 = await loadScript('boucle.js');
        alert(test1);
        const test2 = await loadScript('blblbl.js');
        alert(test2);
        const test3 = await loadScript('cdcdcd.js');
        alert(test3);
    }catch(err){
        alert(err);
        let script = document.head.lastChild;
        script.remove(); //Supprime le script ajouté qui n'a pas pu être lu 
    }
}
test();
```

## `async` / `await` et `all()`

La méthode `all()` permet d'utiliser la syntaxe `async` / `await`.<br>
Cela va permettre d'obtenir la liste des résultats liés à l'ensemble de promesses avec un code plus lisible.<br>

## EN CONCLUSION : LA SYNTAXE `async` / `await`

Les mots clefs `async` et `await` sont un sucre syntaxique ajouté au JS pour permettre d'écrire du code asynchrone.<br>
Ils n'ajoutent aucune fonctionnalité en soi, mais fournissent une syntaxe plus intuitive et plus claire<br>
pour définir des fonctions asynchrones et utiliser des promesses.

Utiliser `async` devant une fonction force la fonction à retourner une promesse et permet d'utiliser `await` dans celle-ci.<br>

En utilisant le mot clef `await` devant une promesse, on oblige le JS à attendre que la promesse soit consommée.<br>
Si la promesse est résolue, le résultat est retourné. Si elle est rompue, une erreur (exception) est générée.<br>

Utiliser `async` / `await` permet ainsi d'écrire du code asynchrone qui ressemble dans sa structure à du code synchrone<br>
auquel on est habitués et permet notamment de se passer de `.then()` et de `.catch()` (qu'on pourra tout de même utiliser au besoin).