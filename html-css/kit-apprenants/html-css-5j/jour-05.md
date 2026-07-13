# Jour 05 - Responsive, accessibilité & mise en ligne

⏱ **Durée estimée : une journée**

## Objectifs

- Rendre le site adaptable à toutes les tailles d'écran
- Appliquer les bonnes pratiques d'accessibilité
- Vérifier et nettoyer le code
- Mettre le site en ligne gratuitement

> 🏁 Dernier jour : *Ma Vitrine* devient un vrai site, consultable partout et publié.

---

## 5.1 - Qu'est-ce que le responsive ?

Un site **responsive** s'adapte à la taille de l'écran : lisible aussi bien sur un grand moniteur que sur un téléphone. On y arrive avec des unités souples et des **media queries**.

> 💡 Le `<meta name="viewport">` du jour 1 est indispensable au responsive : il indique au mobile d'afficher la page à sa vraie taille. Vérifie qu'il est bien présent dans ton `<head>`.

---

## 5.2 - Les media queries

Une media query applique des styles **seulement** en dessous (ou au-dessus) d'une certaine largeur d'écran :

```css
/* Styles pour les écrans de 600px de large ou moins (mobile) */
@media (max-width: 600px) {
  header {
    flex-direction: column;   /* le menu passe sous le titre */
    gap: 0.5rem;
  }

  h1 {
    font-size: 1.8rem;         /* titre plus petit sur mobile */
  }
}
```

> 💡 **Approche « mobile-first »** (recommandée) : on écrit d'abord les styles pour mobile, puis on ajoute des media queries `min-width` pour les grands écrans. Pour débuter, l'approche `max-width` ci-dessus est plus intuitive.

Tester le responsive : ouvre les **outils de développement** (`F12`), clique sur l'icône mobile/tablette pour simuler différents écrans, ou réduis simplement la largeur de la fenêtre.

---

## 5.3 - Les unités souples

Préfère les unités relatives aux pixels fixes pour un rendu adaptable :

| Unité | Signification | Usage |
|---|---|---|
| `rem` | Relatif à la taille de police racine | Tailles de police, espacements |
| `%` | Pourcentage du conteneur parent | Largeurs |
| `vw` / `vh` | % de la largeur / hauteur de l'écran | Sections pleine hauteur |
| `px` | Pixel fixe | Bordures fines, petits détails |

```css
.hero {
  padding: 4rem 1rem;
  min-height: 60vh;    /* au moins 60% de la hauteur de l'écran */
}
```

---

## 5.4 - L'accessibilité de base

Un site accessible est utilisable par tous, y compris avec un lecteur d'écran. Les réflexes essentiels :

- **Toujours un `alt` descriptif** sur les images (jour 2).
- **Labels reliés aux champs** de formulaire (jour 2).
- **Hiérarchie des titres** logique : un seul `<h1>`, puis `<h2>`, `<h3>`... sans sauter de niveau.
- **Contraste suffisant** entre le texte et le fond (teste sur https://webaim.org/resources/contrastchecker/).
- **Navigation au clavier** : vérifie que la touche `Tab` parcourt bien les liens et champs, et ajoute un style de focus visible :

```css
a:focus,
button:focus,
input:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}
```

---

## 5.5 - Vérifier et nettoyer

Avant de publier :

- [ ] La page s'affiche correctement sur mobile et sur grand écran.
- [ ] Aucune image cassée (chemins `src` corrects).
- [ ] Aucun lien mort.
- [ ] Le code est indenté et lisible.
- [ ] Les couleurs ont un bon contraste.

> 💡 **Valide ton HTML** sur https://validator.w3.org : colle ton code ou ton URL, il signale les erreurs de structure.

---

## 5.6 - Mettre le site en ligne avec GitHub Pages

GitHub Pages héberge gratuitement un site statique (HTML/CSS).

1. Crée un compte sur https://github.com si ce n'est pas fait.
2. Crée un **nouveau dépôt** (repository) public, par exemple `ma-vitrine`.
3. Envoie-y tes fichiers (`index.html`, `css/`, `images/`) - via l'interface web (« Add file » → « Upload files ») ou avec Git si tu connais.
4. Dans le dépôt : **Settings → Pages**.
5. Sous « Source », choisis la branche `main` et le dossier `/root`, puis **Save**.
6. Après une minute, ton site est en ligne à l'adresse `https://ton-pseudo.github.io/ma-vitrine/`.

> 💡 Alternatives tout aussi simples : **Netlify** (https://www.netlify.com) permet de glisser-déposer ton dossier pour un déploiement instantané.

---

## Tâches du jour

### Tâche 5.1 - Vérifier le viewport

Confirme que la balise `<meta name="viewport">` est dans ton `<head>`.

### Tâche 5.2 - Adapter au mobile

Ajoute au moins une media query `@media (max-width: 600px)` qui réorganise l'en-tête en colonne et réduit la taille du `<h1>`. Teste avec les outils de développement.

### Tâche 5.3 - Galerie responsive

Vérifie que ta galerie de projets passe bien de plusieurs colonnes (grand écran) à une seule colonne (mobile). Ajuste avec `flex-wrap` ou une media query si besoin.

### Tâche 5.4 - Accessibilité

Ajoute un style de focus visible (5.4), vérifie tous les `alt`, la hiérarchie des titres, et teste la navigation au clavier avec `Tab`.

### Tâche 5.5 - Validation et nettoyage

Passe la checklist du 5.5 et valide ton HTML sur le validateur W3C.

### Tâche 5.6 - Mise en ligne

Publie ton site avec GitHub Pages (ou Netlify) et vérifie qu'il s'affiche à l'adresse publique.

---

## Bilan - Ce que tu sais faire maintenant

En 5 jours, tu es passé·e de zéro à un site web complet et en ligne. Tu maîtrises :

- **HTML** : structure, sémantique, liens, images, formulaires
- **CSS** : sélecteurs, couleurs, box model, décoration
- **La mise en page** : Flexbox, centrage, espacements
- **Le responsive** : media queries, unités souples
- **L'accessibilité** de base et la **mise en ligne**

C'est le socle idéal avant d'aborder JavaScript (voir le kit `javascript/kit-apprenants/`) pour rendre tes pages interactives, ou un framework CSS comme Tailwind.

## Livrable final

- [ ] Le site s'adapte au mobile (media queries)
- [ ] La galerie passe en une colonne sur petit écran
- [ ] Les bonnes pratiques d'accessibilité sont respectées
- [ ] Le HTML est validé, le code est propre
- [ ] Le site est **en ligne** à une adresse publique

🎉 **Félicitations, ton site est publié !**
