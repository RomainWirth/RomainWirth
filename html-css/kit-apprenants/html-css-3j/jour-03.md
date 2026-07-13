# Jour 03 - Mise en page & responsive

⏱ **Durée estimée : une journée**

## Objectifs

- Organiser la page avec Flexbox
- Centrer et limiter la largeur du contenu
- Adapter le site au mobile (media queries)
- Appliquer les bonnes pratiques d'accessibilité

> 🏁 Dernier jour : *Ma Vitrine* devient une vraie page pro, lisible sur tous les écrans.

---

## 3.1 - Centrer le contenu

Sur grand écran, un contenu pleine largeur est illisible. On limite la largeur et on centre :

```css
main {
  max-width: 960px;
  margin: 0 auto;   /* 0 haut/bas, auto gauche/droite = centré */
  padding: 1rem;
}
```

> 💡 `margin: 0 auto` est **la** technique pour centrer horizontalement un bloc de largeur limitée.

---

## 3.2 - Flexbox : aligner des éléments

Flexbox aligne facilement des éléments. On l'active avec `display: flex` sur le **conteneur** ; ses enfants directs s'alignent.

### En-tête (titre à gauche, menu à droite)

```css
header {
  display: flex;
  justify-content: space-between;  /* écarte aux extrémités */
  align-items: center;             /* centre verticalement */
  padding: 1rem 2rem;
}

nav {
  display: flex;
  gap: 1.5rem;                     /* espace entre les liens */
}
```

Propriétés clés (sur le conteneur) :

| Propriété | Effet |
|---|---|
| `display: flex` | Active Flexbox |
| `gap` | Espace entre les éléments |
| `justify-content` | Axe principal (`center`, `space-between`...) |
| `align-items` | Axe secondaire (`center`...) |
| `flex-direction` | `row` (défaut) ou `column` |
| `flex-wrap` | `wrap` = passe à la ligne si ça déborde |

---

## 3.3 - Galerie de cartes en Flexbox

Entoure tes 3 cartes d'un conteneur `class="galerie"` :

```css
.galerie {
  display: flex;
  flex-wrap: wrap;      /* passage à la ligne automatique */
  gap: 1rem;
}

.carte {
  flex: 1 1 250px;      /* base 250px, s'étirent pour remplir la ligne */
}
```

> ⚡ **Alternative CSS Grid** : `display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;`

---

## 3.4 - Le responsive avec les media queries

Une media query applique des styles seulement sous une certaine largeur d'écran :

```css
@media (max-width: 600px) {
  header {
    flex-direction: column;   /* menu sous le titre */
    gap: 0.5rem;
  }
  h1 {
    font-size: 1.8rem;
  }
}
```

> 💡 Le `<meta name="viewport">` du jour 1 est indispensable au responsive. Teste en réduisant la fenêtre ou via les outils de développement (`F12` → icône mobile).

### Unités souples

Préfère les unités relatives aux pixels fixes :

| Unité | Usage |
|---|---|
| `rem` | Polices, espacements |
| `%` | Largeurs |
| `vw` / `vh` | % de la largeur / hauteur d'écran |
| `px` | Bordures fines, petits détails |

---

## 3.5 - Accessibilité de base

- **`alt` descriptif** sur toutes les images (jour 1).
- **Labels reliés aux champs** de formulaire (jour 1).
- **Hiérarchie des titres** logique (un seul `<h1>`, pas de saut de niveau).
- **Contraste** suffisant texte/fond (test : https://webaim.org/resources/contrastchecker/).
- **Focus clavier visible** :

```css
a:focus,
button:focus,
input:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}
```

Vérifie que la touche `Tab` parcourt bien liens et champs.

---

## Tâches du jour

### Tâche 3.1 - Centrer le contenu
Limite `<main>` à `max-width` et centre-le avec `margin: 0 auto`.

### Tâche 3.2 - En-tête en Flexbox
Passe le `<header>` en Flexbox : titre à gauche, navigation à droite.

### Tâche 3.3 - Galerie
Entoure tes cartes d'un `class="galerie"` et affiche-les côte à côte avec passage à la ligne (`flex-wrap`).

### Tâche 3.4 - Responsive
Ajoute une media query `@media (max-width: 600px)` : en-tête en colonne, `<h1>` réduit, galerie en une colonne. Teste sur mobile.

### Tâche 3.5 - Accessibilité
Ajoute le focus visible, vérifie les `alt`, la hiérarchie des titres et la navigation au clavier.

### ⚡ Pour aller plus loin - Mettre le site en ligne (optionnel)

La mise en ligne n'est pas nécessaire pour maîtriser HTML/CSS, mais c'est gratifiant de partager son site.

**Option la plus simple - Netlify Drop** : va sur https://app.netlify.com/drop et **glisse-dépose ton dossier** `ma-vitrine/`. Le site est en ligne en quelques secondes.

**Alternative - GitHub Pages** : procédure détaillée dans la [version 5 jours (jour 05)](../html-css-5j/jour-05.md#56--mettre-le-site-en-ligne-avec-github-pages).

Avant de publier, valide ton HTML sur https://validator.w3.org.

---

## Bilan - Ce que tu sais faire maintenant

En 3 jours, tu as construit un site web complet. Tu maîtrises :

- **HTML** : structure, sémantique, liens, images, formulaires
- **CSS** : sélecteurs, couleurs, variables, box model, décoration
- **La mise en page** : Flexbox, centrage, responsive
- **L'accessibilité** de base

Prochaine étape : le [kit JavaScript](../../../javascript/kit-apprenants/README.md) pour rendre tes pages interactives, ou la [version 5 jours](../html-css-5j/README.md) pour approfondir.

## Livrable final

- [ ] Le contenu est centré et de largeur limitée
- [ ] L'en-tête et la galerie utilisent Flexbox
- [ ] Le site s'adapte au mobile (media query)
- [ ] Les bonnes pratiques d'accessibilité sont respectées
- [ ] (Bonus) Le site est en ligne

🎉 **Félicitations, ton site est terminé !**
