# Exercice pratique : refactoriser un projet

## Consigne: 

Refactoriser ce code pour le rendre plus lisible, maintenable et conforme 
aux principes du Clean Code:
1. Améliorer le nommage
2. Diviser en fonctions avec responsabilité unique
3. Éliminer la duplication
4. Gérer correctement les erreurs
5. Ajouter des commentaires utiles (si nécessaire)
6. Aller plus loin si besoin

```js
/**
 * Calcule le prix final pour un service de livraison basé sur la distance et le type 
 * de service.
 * @param {number} d - La distance de livraison en kilomètres
 * @param {string} t - Le type de service ('standard' ou 'premium')
 * @returns {number} Le prix final incluant la taxe
 * 
 * Pour le service standard:
 * - Tarif de 10/km pour les distances <= 100km
 * - Tarif de 8/km pour les distances entre 100km et 500km
 * - Tarif de 6/km pour les distances > 500km
 * - Taux de taxe fixe de 20%
 * 
 * Pour le service premium:
 * - Tarif de 15/km pour les distances <= 100km
 * - Tarif de 12/km pour les distances entre 100km et 500km
 * - Tarif de 10/km pour les distances > 500km
 * - Taux de taxe de 15% pour les distances <= 1000km
 * - Taux de taxe de 10% pour les distances > 1000km
 */
function p(d, t) {
    let r = 0;
    let tx = 0;

    if (t === "standard") {
        if (d <= 100) {
            r = d * 10;
        } else if (d > 100 && d <= 500) {
            r = d * 8;
        } else if (d > 500) {
            r = d * 6;
        }
        tx = 0.2;
    } else if (t === "premium") {
        if (d <= 100) {
            r = d * 15;
        } else if (d > 100 && d <= 500) {
            r = d * 12;
        } else if (d > 500) {
            r = d * 10;
        }
        if (d > 1000) {
            tx = 0.1;
        } else {
            tx = 0.15;
        }
    }

    let f = r * (1 + tx);

    console.log("Prix: " + f);
    return f;
}

// Exemple d'utilisation
p(150, "standard"); // Calcul pour 150 km en standard
p(700, "premium");  // Calcul pour 700 km en premium
```

## Correction 

Cette correction est une approche parmi tant d'autres : il n'existe pas de solution unique. L'objectif est d'atteindre un code **lisible, maintenable et testable**, quelle que soit la route empruntée.

### Première étape : améliorer le nommage

Un bon nom de variable ou de fonction doit répondre à la question : « qu'est-ce que c'est ? » ou « qu'est-ce que ça fait ? », **sans avoir besoin de relire la documentation ou les commentaires**.

Dans le code original, tous les noms sont des abréviations opaques :
- `p` : le nom de la fonction principale
- `d` et `t` : les paramètres
- `r`, `tx`, `f` : les variables intermédiaires

Conventions appliquées :
- **Nommer en anglais** : convention majoritaire dans les projets professionnels
- **camelCase** pour les fonctions et variables (`calculateTotal`, `serviceType`)
- **Noms complets, sans abréviation** : `distanceInKm` plutôt que `d`, `finalPrice` plutôt que `f`
- **Inclure l'unité dans le nom** quand c'est pertinent (`distanceInKm` évite toute ambigüité sur l'unité)

| Avant | Après | Pourquoi |
| --- | --- | --- |
| `p` | `calculateTotalTripCost` | Décrit ce que fait la fonction |
| `d` | `distanceInKm` | L'unité est incluse dans le nom |
| `t` | `serviceType` | Le type de donnée est explicite |
| `r` | `result` (puis `tripCostWithoutTaxes`) | Décrit le contenu de la variable |
| `tx` | `tax` (puis `taxRate`) | Plus descriptif |
| `f` | `finalPrice` | Clair sur le fait que c'est le résultat final |

```js
function calculateTotalTripCost(distanceInKm, serviceType) {
    let result = 0;
    let tax = 0;

    if (serviceType === "standard") {
        if (distanceInKm <= 100) {
            result = distanceInKm * 10;
        } else if (distanceInKm > 100 && distanceInKm <= 500) {
            result = distanceInKm * 8;
        } else if (distanceInKm > 500) {
            result = distanceInKm * 6;
        }
        tax = 0.2;
    } else if (serviceType === "premium") {
        if (distanceInKm <= 100) {
            result = distanceInKm * 15;
        } else if (distanceInKm > 100 && distanceInKm <= 500) {
            result = distanceInKm * 12;
        } else if (distanceInKm > 500) {
            result = distanceInKm * 10;
        }
        if (distanceInKm > 1000) {
            tax = 0.1;
        } else {
            tax = 0.15;
        }
    }

    let finalPrice = result * (1 + tax);

    console.log("Prix: " + finalPrice);
    return finalPrice;
}
```

### Deuxième étape : Diviser en fonctions avec responsabilité unique et éliminer les duplications

Après l'étape 1, la fonction `calculateTotalTripCost` fait toujours **tout** : calculer le tarif kilométrique, appliquer la taxe, gérer les deux types de service. Si demain on modifie le calcul des taxes, on doit ouvrir et relire toute la fonction, au risque de casser autre chose.

**Principe de Responsabilité Unique (SRP)** : chaque fonction doit avoir une seule raison de changer.

**La duplication à éliminer** : dans le code original, la structure `if (d <= 100) ... else if (d <= 500) ... else ...` est écrite deux fois (une pour `standard`, une pour `premium`). On factorise ce bloc dans une fonction dédiée.

On extrait donc 3 fonctions, chacune avec une responsabilité claire :
- `getRatePerKm` : détermine **uniquement** le tarif kilométrique selon la distance et le type de service
- `calculateTripCostWithoutTaxes` : calcule **uniquement** le prix de base hors taxes (distance × tarif)
- `calculateTaxRate` : retourne **uniquement** le taux de taxe applicable

```js
function getRatePerKm(distanceInKm, serviceType) {
    const standardRates = {
        shortTrip: 10,
        mediumTrip: 8,
        longTrip: 6
    }

    const premiumRates = {
        shortTrip: 15,
        mediumTrip: 12,
        longTrip: 10
    }

    const rates = serviceType === "standard" ? standardRates : premiumRates;

    if (distanceInKm <= 100) {
        return rates.shortTrip;
    } else if (distanceInKm > 100 && distanceInKm <= 500) {
        return rates.mediumTrip;
    } else if (distanceInKm > 500) {
        return rates.longTrip;
    }
}

function calculateTripCostWithoutTaxes(distanceInKm, serviceType) {
    const ratePerKm = getRatePerKm(distanceInKm, serviceType);
    return distanceInKm * ratePerKm;
}

function calculateTaxRate(distanceInKm, serviceType) {
    if (serviceType === "standard") {
        return 0.2;
    } else {
        return distanceInKm > 1000 ? 0.1 : 0.15; 
    }
}
```

Une fois ces trois fonctions créées, la fonction principale peut être simplifiée : elle n'a plus à connaître les détails du calcul. Elle **orchestre** simplement les étapes, comme une recette de cuisine :
1. calculer le prix hors taxes
2. obtenir le taux de taxe
3. retourner le prix final

La fonction devient ainsi lisible presque comme du français courant.

Refactorisation de la fonction `calculateTotalTripCost` : 
```js
function calculateTotalTripCost(distanceInKm, serviceType) {
    const tripCostWithoutTaxes = calculateTripCostWithoutTaxes(distanceInKm, serviceType);
    
    const taxRate = calculateTaxRate(distanceInKm, serviceType);

    const finalPrice = tripCostWithoutTaxes * (1 + taxRate);

    console.log("Prix: " + finalPrice);
    return finalPrice;
}
```

### Troisième étape : Gérer correctement les erreurs

Le code de l'étape 2 suppose que les entrées sont toujours valides. Si l'appelant passe `"express"` comme type de service, ou une distance négative, la fonction retourne silencieusement `0` sans aucun avertissement. Ce type de bug est difficile à diagnostiquer.

**Principe du « fail fast »** : il vaut mieux détecter et signaler l'erreur le plus tôt possible, plutôt que de laisser un calcul erroné se propager dans l'application.

On crée une fonction `validateInputs` dont la seule responsabilité est de vérifier les entrées et de lever une erreur descriptive si elles sont invalides. Cette vérification est placée en tête de la fonction principale.
```js
function validateInputs(distanceInKm, serviceType) {
    if (typeof distanceInKm !== 'number' || distanceInKm < 0) {
        throw new Error("Distance must be a non-negative number");
    }
    
    if (serviceType !== 'standard' && serviceType !== 'premium') {
        throw new Error("Service type must be 'standard' or 'premium'");
    }
}
```

Il suffit ensuite d'appeler `validateInputs` en première ligne de `calculateTotalTripCost`. Si les paramètres sont invalides, l'erreur est levée immédiatement et la suite de la fonction n'est jamais exécutée.

Il est aussi recommandé d'entourer les appels d'une fonction qui peut lever des erreurs avec un bloc `try/catch`, afin d'afficher un message clair à l'utilisateur plutôt qu'une exception brute. 
```js
function calculateTotalTripCost(distanceInKm, serviceType) {
    validateInputs(distanceInKm, serviceType);

    const tripCostWithoutTaxes = calculateTripCostWithoutTaxes(distanceInKm, serviceType);
    
    const taxRate = calculateTaxRate(distanceInKm, serviceType);

    const finalPrice = tripCostWithoutTaxes * (1 + taxRate);

    console.log("Prix: " + finalPrice);
    return finalPrice;
}
```

### Quatrième étape : Ajouter des commentaires

En clean code, **des noms bien choisis dispensent la plupart du temps d'écrire des commentaires**. Un commentaire qui répète ce que le code dit déjà n'apporte rien et devient une charge à maintenir.

Il existe cependant un cas où les commentaires sont utiles et recommandés : la **documentation des fonctions publiques**, via le format **JSDoc**. Ce format standard est reconnu par les éditeurs de code (VS Code l'affiche en info-bulle) et par les outils de génération de documentation.

Un bloc JSDoc documente :
- `@param` : chaque paramètre avec son type et sa description
- `@returns` : la valeur de retour et son type
- `@throws` : les erreurs pouvant être levées

Pour cet exercice, on documente **chaque fonction** afin de prendre l'habitude du format :
```js
/**
 * Calculate the total trip cost including taxes based on distance and service type.
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The final price including tax
 * @returns {Error} If the parameters are invalid: the distance is negative or the service type is invalid
 */
function calculateTotalTripCost(distanceInKm, serviceType) {
    ...
}

/**
 * Calculate the trip cost without taxes based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The trip cost without taxes
 */
function calculateTripCostWithoutTaxes(distanceInKm, serviceType) {
    ...
}

/**
 * Calculate the final price including tax
 * @param {number} priceWithoutTaxes - The price without taxes
 * @param {number} taxRate - The applicable tax rate
 * @returns {number} The final price including tax
 */
function calculatePriceWithTaxes(priceWithoutTaxes, taxRate) {
    ...
}

/**
 * Calculate the rate per kilometer based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The rate per kilometer based on distance and service type
 */
function getRatePerKm(distanceInKm, serviceType) {
    ...
}

/**
 * Calculate the applicable tax rate based on distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @returns {number} The applicable tax rate
 */
function calculateTaxRate(distanceInKm, serviceType) {
    ...
}

/**
 * Validate the inputs for distance and service type
 * @param {number} distanceInKm - The delivery distance in kilometers
 * @param {string} serviceType - The type of service ('standard' or 'premium')
 * @throws {Error} If the distance is negative or if the service type is invalid
 */
function validateInputs(distanceInKm, serviceType) {
    ...
}
```

## Résumé

| Étape | Principe | Ce qui a changé |
| --- | --- | --- |
| **1. Nommage** | Un bon nom rend le code auto-documenté | `p(d, t)` → `calculateTotalTripCost(distanceInKm, serviceType)` |
| **2. SRP** | Une fonction = une seule responsabilité | Extraction de `getRatePerKm`, `calculateTripCostWithoutTaxes`, `calculateTaxRate` |
| **3. DRY** | Ne pas répéter la même logique | Le bloc `if/else` sur les tranches de distance n'est écrit qu'une seule fois |
| **4. Erreurs** | Fail fast : détecter l'erreur dès l'entrée | Ajout de `validateInputs` avec des messages d'erreur clairs |
| **5. Commentaires** | Documenter les contrats, pas le code évident | JSDoc sur chaque fonction publique (`@param`, `@returns`, `@throws`) |

**Ce qu'on retient :**

- Le refactoring ne change pas le comportement du programme : les calculs produisent exactement les mêmes résultats qu'avant.
- On progresse **par étapes incrémentales** : chaque étape améliore un aspect précis sans tout refaire d'un coup.
- Un bon refactoring se lit comme une liste d'instructions en langage naturel : `valider → calculer le prix hors taxes → obtenir le taux → retourner le prix final`.
- Ces étapes s'appliquent à n'importe quel code, quel que soit le langage.