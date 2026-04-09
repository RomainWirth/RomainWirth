# LES POINTEURS — Sommaire

> Travailler avec des adresses mémoire plutôt que des valeurs en Go.

---

## [B — Comprendre & utiliser les pointeurs](B_COMPRENDRE_&_UTILISER_LES_POINTEURS.md)

- Un **pointeur** stocke l'**adresse mémoire** d'une valeur, pas la valeur elle-même.
- `&variable` récupère l'adresse mémoire d'une variable.
- Type pointeur : `*int`, `*string`, etc.
- **Avantage 1** : évite la copie inutile de valeurs lors du passage en paramètre de fonction.
- **Avantage 2** : permet de modifier directement la valeur originale depuis une fonction.
- La valeur nulle d'un pointeur est **`nil`** (absence d'adresse).

---

## [C — Comment travailler avec des pointeurs](C_COMMENT_TRAVAILLER_AVEC_DES_POINTEURS.md)

- `userAge := &age` — crée un pointeur `*int` ; afficher `userAge` donne l'adresse, pas la valeur.
- **Déréférencement** : `*userAge` accède à la valeur stockée à l'adresse.
- Passer un pointeur à une fonction : paramètre de type `*int`, accès à la valeur avec `*age`.
- **Mutation** : `*age = *age - 18` modifie la valeur originale en mémoire directement.
- `fmt.Scan(&choice)` utilise un pointeur pour écrire la valeur saisie directement dans `choice`.
- Surtout utile pour les **grandes structures** ou la **mutation intentionnelle** — pour les types simples, l'avantage est négligeable.
