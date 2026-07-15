# ARRAYS, SLICES ET MAPS - Sommaire

> Stocker et gérer des collections de données en Go.

---

## [B - Introduction aux Arrays](B_INTRODUCTION_AUX_ARRAYS.md)

- Un `array` est une collection de valeurs du **même type**, de taille **fixe** définie à la déclaration.
- Syntaxe : `prices := [4]float64{10.5, 20.0, 30.75, 40.0}` ou `var prices [4]float64`.
- Accès et modification par index : `prices[0]`, `prices[2] = 99.9`.
- Valeur nulle de chaque élément = valeur nulle du type (`0`, `""`, etc.).

---

## [C - Sélectionner des éléments avec des Slices](C_SELECTIONNER_DES_ELEMENTS_D_UN_TABLEAU_AVEC_DES_SLICES.md)

- Une `slice` est une **référence (fenêtre)** sur un tableau - pas une copie indépendante.
- Syntaxe : `slice := array[indexA:indexB]` - `indexA` inclus, `indexB` exclu.
- Raccourcis : `[:n]`, `[n:]`, `[:]` (totalité).
- **Modification partagée** : éditer une slice modifie le tableau d'origine.
- Slices de slices possibles dans la limite de la capacité.

---

## [D - Approfondir avec les Slices](D_APPROFONDIR_AVEC_LES_SLICES.md)

- `len(slice)` = nombre d'éléments actifs ; `cap(slice)` = capacité disponible vers la droite.
- **Slice dynamique** : `[]float64{}` - pas de taille fixe, gérée automatiquement.
- `append(slice, val...)` ajoute des éléments et retourne une nouvelle slice.
- Suppression d'un élément : réassigner une sous-slice (`prices = prices[1:]`).
- `make([]type, length, capacity)` pré-alloue la mémoire pour de meilleures performances.
- **Spread operator** `...` : `append(slice1, slice2...)` fusionne deux slices.
- Alias de type : `type floatMap map[string]float64` - code plus lisible, méthodes attachables.

---

## [E - Introduction aux Maps](E_INTRODUCTION_AUX_MAPS.md)

- Une `map` stocke des paires **clé/valeur** : `map[typeClé]typeValeur{clé: val, ...}`.
- Accès : `mapName[clé]` ; ajout/modification : `mapName[clé] = val` ; suppression : `delete(mapName, clé)`.
- Toujours **dynamique** : on peut ajouter des paires à tout moment.
- `make(map[type]type, capacité)` pré-alloue pour de meilleures performances.
- **Map vs Struct** : map = clés dynamiques inconnues à l'avance ; struct = champs fixes et typés.

---

## [F - La boucle `for` avec les Arrays, Slices et Maps](F_LA_BOUCLE_FOR_AVEC_LES_ARRAYS_SLICES_ET_MAPS.md)

- `for index, value := range slice { ... }` itère sur chaque élément d'un array/slice.
- `for key, value := range mapName { ... }` itère sur chaque paire clé/valeur d'une map.
- `_` pour ignorer l'index ou la valeur : `for _, value := range slice`.
- `for range slice { ... }` pour itérer sans utiliser ni index ni valeur.
- **L'ordre d'itération d'une map n'est pas garanti** en Go.
