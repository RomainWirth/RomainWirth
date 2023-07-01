# HTML5 & CSS3

## La différence entre HTML et CSS
### Le rôle du HTML 

**HTML** : accronyme pour HyperText Markup Language.<br>
Ce langage apparaît dès 1991 lors du lancement du Web. Son rôle est de gérer et d'organiser le contenu.<br>

C'est dans ce langage qu'on va écrire ce qui doit être affiché : texte, liens, images...<br>
C'est lui qui constitue la structure d'une page web.

### Le rôle du CSS

**CSS** : accronyme pour Cascading Style Sheet (aussi appelé feuille de styles).<br>
Son rôle est de gérer l'apparence de la page web (agencement, positionnement, décoration, couleurs, taille du teste).<br>
Ce langage est apparût en 1996 pour compléter le HTML et est toujours au fondement même du style du Web aujourd'hui.<br>

Le CSS a besoin d'une base en HTML pour fonctionner.<br>
C'est lui qui permet d'ajouter du style.

HTML ET CSS se complètent et ont un rôle bien défini : HTML = le fond, CSS = la forme.

### Le rôle du navigateur

Le Navigateur est le logiciel (l'outil) qui lit le code HTML et CSS pour afficher le résultat à l'écran.<br>
Son rôle est essentiel. Il doit comprendre le code HTML et CSS afin de le représenter graphiquement.<br>

Selon le navigateur, l'affichage peut différer légèrement et le code peut avoir différents comportements.<br>

Tous les navigateurs embarquent des outils de développement, notamment l'outil d'inspection qui permet d'accéder au HTML et CSS d'une page.

## La page HTML 

Pour créer une page web en html, on va créer un fichier avec l'extension **.html**.<br>
Ce fichier s'ouvre dans le navigateur simplement en double-cliquant dessus.

### Les Balises HTML

Le langage HTML utilise des **balises**.<br>
Une balise s'écrit avec des chevrons : < et >.<br>
Le contenu est encadré d'une balise ouvrante et d'une balise fermante :<br>

```html
<p>CONTENU</p>
```

Il existe deux types de balises :<br>
* Les **balises paires** (une balise ouvrante et une balise fermante)
* Les **balises orphelines** (une seule balise)

**_Les balises paires_**<br>
Elles s'ouvrent, contiennent du teste et se ferment plus loin.<br>
Par exemple : balise ouvrante `<title>` et balise fermante `</title>`.<br>
Cela délimite ce qui sera traduit en par un titre (h2).<br>

**_Les balises orphelines_**<br>
Ces balises servent le plus souvent à insérer un élément à un endroit précis.<br>
On a pas besoin de délimiter le début et la fin. On indique juste à l'ordinateur d'insérer quelque chose.<br>
Par exemple :`<img src="image.png">`<br>
On indique l'insertion d'une image dans ce cas.<br>

```
N.B. : auparavant on utilisait un / pour indiquer la fermeture d'une balise orpheline. 
Aujourd'hui il n'est plus nécéssaire de le faire et le w3c génère un avertissement.
```

### Les attributs

Les attributs sont les options des balises.<br>
Ils viennent compléter pour donner des informations complémentaires<br> 
et permettent de modifier certaines caractéristiques ou propriétés des balises.<br>

Un attribut est situé dans la balise ouvrante d'une balise paire, ou directement dans une balise orpheline.<br>
Exemple : `<img alt="texte alternatif" title="titre de l'image" src="img.jpg">`<br>

### Structure de base du HTML

Voici la structure de base d'une page HTML :
```html
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <title>Le titre de ma page</title>
    </head>
    <body>
        <!-- Contenu -->
    </body>
</html>
```

On peut ici remarque l'indentation : 
* les balises parent sont le plus à gauche,<br>
* les balises filles sont décallées,<br>
* et ainsi de suite.

**A quoi servent ces balises ?**<br>
* `<!DOCTYPE html>` : balise orpheline indispensable, elle indique qu'il s'agit d'une page HTML.<br>
* `<html></html>` : englobe tout le contenu de la page web. à l'intérieur se situent toutes les autres balises : `<head></head>` et `<body></body>`<br> 
l'attribut `lang="fr"` indique la langue utilisée dans le corps du document.<br>
* `<head></head>` et `<body></body>` : Ces deux balisent définissent respectiement la tête (informations envoyées au navigateur)<br> et le corps (contenu de la page qui sera affiché sur le navigateur).<br>
* la paire de balises `<head></head>`contient deux balises qui donnent des indications au navigateur : l'encodage et le titre de la page.<br>
* la balise orpheline `<meta charset="utf-8">` indique l'encodage utilisé dans le fichier html.<br>
* La paire de balises `<title></title>` indique au navigateur le titre de la page web.<br>
Toute page doit avoir un titre qui décrit son contenu (il s'affiche sur l'onglet du navigateur),<br>
et apparaît dans les résultats de recherche, comme sur Google.<br>

#### Commenter son code HTML

Le commentaire sert à commenter ce qu'on écrit (notes, indications) pour nous même ou pour les personnes qui font lire le code.<br>
Un commentaire s'écrit comme ceci :
```html 
<!-- ceci est un comentaire -->
```
 N.B. : afin d'écrire plus rapidement un commentaire, il existe des raccourcis clavier (sur VSCode: CTRL + /).<br>

## Organiser son texte : les différentes balises

### Les paragraphes

les balises `<p> </p>` permettent de délimiter les paragraphes.

### Le retour à la ligne

la balise orpheline `<br>` (pour break) permet de d'indiquer un retour à la ligne.

### Les titres 

les balises `<h1> </h1>`, `<h2> </h2>`, ... `<h6> </h6>` permettent de délimiter les titres par ordre d'importance.<br>

Une page html n'aura qu'un seul titre de niveau `<h1> </h1>`.<br>
les autres niveaux de titre vont varier, mais plus on va descendre en niveau, plus on multipliera les balises.<br>

### Les listes

`<li> </li>` et `<ul> </ul>` ou `<ol> </ol>` :

1. **Baliser les éléments d'une liste avec** `<li> </li>`
2. **Insérer la liste dans des balises** `<ul> </ul>` ou `<ol> </ol>`<br>
ul pour _unordered list_ (liste à puces) et ol pour _ordered list_ (liste numérotée).<br>

```html 
<h1>Les fruits rouges</h1>
<ul>
   <li>Fraises</li>
   <li>Framboises</li>
   <li>Groseilles</li>
</ul>

<h1>Ma journée</h1>
<ol>
   <li>Je me lève.</li>
   <li>Je mange et je bois de l'eau.</li>
   <li>Je retourne me coucher.</li>
</ol>
```

### Mettre en valeur son texte

`<strong></strong>` : permet de faire ressortir certains mots en particulier.<br>
`<mark></mark>` : permet de surligner le texte.<br>
`<em></em>` : permet de mettre le texte en italique.<br>

ATTENTION : ces balises ne signifient pas juste de mettre en gras, en italique ou autre.<br> 
Cela indique juste au navigateur que ce texte est important et donc de le mettre en avant.<br>
On privilégiera la CSS pour styliser le texte.<br>

### Les liens hypertextes

La balise paire `<a></a>` et l'attribut `href`.
* `<a></a>`: pour 'anchor' indique qu'on va être redirigé vers un autre endroit en cliquand sur le contenu.<br>
* `href='' `: annonce l'endroit vers lequel on va être redirigé (lien hypertexte).<br>

Cette balise peut soit rediriger vers une autre page web (du même site ou non),<br>
soit rediriger vers un autre élément de la même page en indiquant la référence à l'attribut `id` d'une autre balise de la page.<br>
Dans le second cas, on parle d'**ancre**.<br>

Dans le cas de l'ancre, la balise cible doit avoir un attribut `id="ancre"`.<br>
le terme entre guillemets **doit être unique**.<br>
N.B. : si l'ancre fait référence à une balise dans une autre page html du site,<br>
on doit spécifier le nom de la page suivi de l'id de la balise comme ceci :<br>
`<a href="page.html#texte">texte</a>`<br>

## Insérer des images

### Utilisation de la balise orpheline `<img>`

Cette balise doit contenir deux attributs :<br>
1. `src` : indique la source de l'image.<br>
2. `alt` : indique une description alternative à l'image (au cas ou elle ne s'affiche pas, et pour les moteurs de recherche).<br>

**src** : doit contenir le chemin _absolu_ si l'image vient d'internet (URL de l'image), ou _relatif_ si l'image est dans le dossier source de la page.<br>
ex : l'image se situe dans le dossier `images`, le chemin relatif sera donc : `src="images/logo.png"`.<br>

N.B. : on évitera les accents, majuscules ou espaces dans les noms de fichiers et de dossier.

**alt** : apporte une description de l'image. Cette description _alternative_ s'inscrit à la place de l'image au cas ou elle ne peut pas être affichée au chargement de la page.<br>
elle auto-décrit grâce au navigateur pour les personnes de handicap (trouble de la vue par exemple).<br>
Cela contribue à améliorer l'accessibilité d'un site et aide les robots des moteurs de recherche pour trouver des images.<br>

### Bien choisir son format d'image

* **Une photo** : utiliser le format JPEG.
* **Une image avec peu de couleurs** (moins de 256) : PNG 8 bits, ou n'importe quel GIF.
* **Une image avec beaucoup de couleurs** : PNG 24 bits.
* **Une image animée** : GIT animé.
* **Un logo vectoriel** : format SVG.

Par convention, les espace dans le titre d'une image seront remplacés par le _underscore_.<br>

l'attribut `title` permettra d'avoir une infobulle sur l'image (attention à ne pas confondre avec la balise title).<br>
Contrairement à l'attribut `alt` , l'attribut title est facultatif.<br>

### Créer une miniature cliquable

Si une image est très grosse, on affichera une miniature cliquable.<br>
Cela permet à la page web de mettre moins de temps à s'afficher.<br>
Un seul clic dessus et l'image en taille originale s'arrichera.<br>

Le code pour afficher cela s'apparentera à ceci :
```hmtl
<p>Vous souhaitez voir l'image dans sa taille d'origine ? Cliquez dessus !<br>
    <a href="images/montagne.jpg">
        <img src="images/montagne_mini.jpg" alt="Chemin de randonnée au milieu des montagnes" title="Cliquez pour agrandir" >
    </a>
</p>
```

## Insérer le CSS dans la page HTML

### Lier le fichier CSS au fichier HTML

ça se passe au niveau de la balise `<head></head>` :

```html 
<head>
    <meta charset="utf-8">
    <title>Ma page</title>
    <link href="style.css" rel="stylesheet">
</head>
```

la balise `<link href="style.css" rel="stylesheet">` va contenir le lien vers le fichier référence contenant le style appliqué à la page HTML.<br>

### Appliquer une propriété CSS à une balise HTML

Dans le fichier CSS, on va faire référence aux balises du fichier HTML.

```CSS
h1 {
    color: blue;
}
```
On va retrouver ici 3 éléments : <br>
* **Le sélecteur** : le nom de la balise html dont on veut modifier l'apparence.<br>
* **{ }** : encadrent le code qui définit le style.<br>
* **La ou les propriétés CSS** : les effets de style sont listés via des propriétés.<brr>
Par exemple, la couleur d'un texte sera indiquée par la propriété `color`.
* **Les valeurs** : sont reliées aux propriétés. Une propriété peut avoir plusieurs valeurs selon sa fonction.<br>
`color` devra avoir pour valeur le nom de la couleur (blanc, ou #FFF en hexadécimal).<br>

N.B. le commentaire en CSS s'écrit de cette manière :
```CSS
p {
/* Cette ligne est un commentaire
La ligne suivante aussi */
}

```

### Appliquer une propriété CSS à plusieurs balises à la fois 

```CSS
h1, div, p {
    color: blue;
}
```

On va séparer les balises par des virgules.

Afin d'éviter d'écrire le code de cette manière, on va employer les class ou les id.<br>
Ces attributs sont écrit dans les balises html afin de les cibler.<br>
```html
<div class="maClasse" id="monId">
```

Une **classe** peut être attribuée à plusieurs balises différentes sur lesquelles on veut appliquer le même style.<br>
Une **id**, quand à elle, sera unique à une balise.<br>

En pratique, on va privilégier la class pour appliquer un style.<br>
Ceci permettra de différencier des balises html identiques : on peut avoir plusieurs `<div>`, plusieurs `<p>` etc.<br> 

#### L'attribut class sera appelé par son nom dans le fichier CSS grâce au point 

```CSS
.ma-classe {
    color: #fff;
} 
```

Concernant l'attribut `id`, on l'appelera avec le `#` :
```CSS
#mon-id {
    color: #fff;
} 
```
#### Appliquer plusieurs propriétés CSS d'un seul coup à un élément

sur la CSS :
```CSS
.ma-classe {
    color: blue;
}

.grand-texte {
    font-size: 30px;
}
```

et sur le HTML :
```HTML
<body>
    <h1>Titre principal</h1>
    <p>Ceci est le contenu de mon premier paragraphe</p>
    <p class="ma-classe grand-texte">Ceci est le contenu de mon deuxième paragraphe</p>
    <h2 class="grand-texte">Voilà mon sous-titre h2</h2>
</body>
```

On peut voir ici que la balise `<p>` contient deux classes. les deux styles lui seront appliqués.<br>

### Les balises universelles

Les balises universelles n'ont pas de signification particulières, ce sont des balises "qui ne servent à rien",<br>
mais permettent de cibler certains éléments dans un texte ou dans un contenu de page.<br>
1. `<span> </span>` : c'est une balise "inline", on la place au milieu d'un paragraphe de texte pour sélectionner certains mots uniquement.<br>
`<em>` et `<strong>` sont de la même famille.
2. `<div> </div>` : c'est une balise de type "block", elle entoure un bloc de texte.<br>
`<p>` et `<h1>` sont de la même famille.<br>
Cette balise est fréquemment utilisée dans la construction d'un site internet.

## Changer l'apparence du texte 

### Changer la taille

la propriété CSS `font-size` va permettre de modifier la taille d'un texte.<br>
On distinguera :
* **la taille absolue** : très précis, mais à utiliser uniquement sur une taille d'écran dont on connaît les dimensions.<br>
La taille absolue sera exprimée en pixels, noté `px`
* **la taille relative** : plus souple, s'adapte selon les tailles d'écrans.<br>
La taille relative sera notée en `em`<br>
Une taille de texte normale s'écrit `1em`<br>
Une taille un peu plus grande s'écrit `1.3em`<br>
Une taille un peu plus petite s'écrit `0.8em`<br>

N.B. 2em doublera la taille du texte.

### Choisir sa police de caractères 

la propriété `font-family` sera employée :
```CSS
balise {
    font-family: 'Times New Roman', Times, serif;
}
```	

Voici une liste des police sans sérit qui fonctionnent nativement sur la plupart des navigateurs :<br>
* Arial Black
* Futura
* Helvetica
* Impact
* Trebuchet MS
* Verdana

N.B. Sérif désigne l'empattement situé à l'extrémité des caractères.<br>
Choisir une police de caractères sans sérif est plus judicieux en terme d'accessibilité. C'est plus facile à lire.<br>

Il est possible d'importer sa police de caractères depuis des librairies en ligne type Google Font.<br>
On ira sur le site choisir sa font,<br> 
copier les balises `<link>` dans le `<head></head>` du fichier HTML, 
<br>et utiliser la propriété `font-family` dans le fichier CSS.

exemple :<br> 
HTML
```HTML
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
```
CSS
```CSS
body {
    font-family: 'Roboto', sans-serif;
}
```

### Mettre le texte en italique 

On utilisera la propriété `font-style` et on indiquera `italic`. (normal pour du texte normal).

### Mettre du texte en gras

On utilisera la propriété `font-weight` suivi de :<br>
`bold` pour texte en gras<br> 
`normal` pour le texte par défaut<br> 
`thin` pour du texte plus fin.<br>

### Souligner du texte

On utilisera la propriété `text-decoration` suivi de :<br>
`underline` pour du texte souligné<br>
`line-through` pour un texte barré<br>
`none` pour du texte normal (on l'appliquera surtout sur les liens)

### Aligner du texte

On utilisera la propriété `text-align` suivi de :<br>
`left` pour du texte à gauche<br>
`center` pour de texte centré<br>
`right` pour du texte à droite<br>
`justify` pour du texte "justifié"

## Ajouter un couleur et un fond

### La couleur du texte

La propriété `color` sera utilisée.<br>
On utilisera différentes manières pour indiquer une couleur en CSS :
* **hexadécimal** : 6 chiffres/caractères précédés d'un #. ex : `color: #FFFFF2;`
* **notation RGB** : Red Green Blue : `color: rgb(250, 25, 118, 0.5);`

Il existe des outils en ligne permettant de trouver une couleur ou de la convertir dans une autre syntaxe.<br>
coolors ou HTML Color Picket sont deux de ces outils.<br>

### Appliquer une couleur d'arrière plan

La propriété `background-color` sera utilisée.<br>
De la même manière que `color`.

### Les images de fond

La propriété `background-image` sera utilisée.<br>
On va renseigner l'adresse indiquant où se trouve l'image de fond.<br>
Elle peut être écrite en valeur absolu (http://...) ou en relatif (fond.png).<br>

**Pour changer le comportement d'une image de fond** il existe plusieurs propriétés CSS :<br>
* `background-attachement` : associée à la valeur `fixed`, permet de rendre l'image de fond fixe quand on déroule la page web.<br>
* `background-size` : associée à la valeur `cover`, permet de redimensionner l'image afin qu'elle s'adapte à la taille de l'élément qui la contient<br> 
(elle garde les proportions, en rognant la largeur ou la hauteur en fonction de la taille de l'élément).<br>
* `background-position` : associée aux valeurs `top`, `bottom`, `left`, `center` ou `right`,<br> 
permet d'indiquer où doit se trouver l'image de fond.<br>

La propriété `background` permet de combiner les autres propriétés en une seule.<br>
C'est une sorte de super-propriété.

### Créer des dégradés

La valeur `linear-gradient` sera utilisée et appliquée à la propriété `background`.

```CSS
div {
    background: linear-gradient(90deg, #8360c3, #2ebf91);
}
```
On pourra utiliser les outils <a href="https://uigradients.com/#EmeraldWater">UI Gradient</a> ou <a href="https://cssgradient.io/">CSS Gradient</a> pour construire ses propres dégradés.<br>

### Jouer de transparence 

La propriété `opacity` permettra d'indiquer le niveau d'opacité désiré.<br>
la valeur ira de 0 (transparent) à 1 (totalement opaque).<br>

## Créer des bordures et des ombres

### Les bordures

On aura un large choix : `border-width`, `border-color`, `border-style`, etc.<br>
On privilégiera une seule propriété : `border` qui regroupe l'ensemble des propriétés de bordure.<br>
On peut utiliser jusqu'à trois valeurs pour modifier l'apparence de la bordure :<br>
1. **la largeur** définie en pixels (ex: 2px)
2. **la couleur** définie par une valeur hexa, rgb ou un nom.
3. **le type de bordure** qui peut être<br> 
`solid` (trait simple),<br> 
`double` (double trait),<br> 
`dotted` (trait en pointillés),<br> 
`dashed` (trait en tirets),<br> 
etc.<br>

On pourra mettre des bordures différentes selon le côté (haut, bas, gauche ou droite) :<br>
1. `border-top`
2. `border-bottom`
3. `border-left`
4. `border-right`

Il existe aussi des équivalents pour paramétrer chaque détail de la bordure si on le souhaite :<br>
* `border-top-width` pour modifier l'épaisseur de la bordure du haut
* `border-top-color` pour modifier la couleur du haut
* etc.<br>
Ce sont des super-propriétés comme `border` mais ne s'appliquent qu'à un seul côté.<br>

### Arrondir les angles

On utilisera `border-radius`, avec un nombre exprimé en pixels.<br>
On peut appliquer l'arrondi à différents coins :<br>
```CSS
.element {
    border-radius: 10px 30px 0px 90px;
}
```
les valeurs indiquent dans l'ordre :<br>
1. arrondit au coin supérieur gauche
2. arrondit au coin supérieur droit
3. arrondit au coin inférieur droit
4. arrondit au coin inférieur gauche

N.B. si on souhaite appliquer le même arrondi partout, on utilisera une seule valeur.<br>

Il est même possible de créer des courbes elliptiques avec  border-radius.<br>
Pour cela, il faut indiquer deux valeurs séparées par une barre oblique (slash) :  /.<br> 
Mais le rendu est assez dur à anticiper.<br>
Il vaut mieux utiliser des outils de visualisation comme <a href="https://9elements.github.io/fancy-border-radius/">Fancy Border Radius</a> du rendu final.

### Ajouter une ombre portée 

On utilisera `box-shadow` qui s'appliquera à tout le bloc.<br>
box-shadow prend quatre valeurs (dans l'ordre) :<br>
1. Le décalage horizontal de l'ombre
2. Le décalage vertical de l'ombre
3. L'adoucissement du dégradé
4. La couleur de l'ombre

```
L'adoucissement peut être :
faible (si on lui donne une valeur inférieure à celle du décalage),
normal (si on lui donne une valeur égale à celle du décalage)
ou élevé (si on lui donne une valeur supérieure à celle du décalage).
```

exemple : 
```CSS
.element {
    box-shadow: 6px 6px 0px rgba(0, 0, 0);
}
```

Afin de se simplifier la vie, on peut utiliser des outils en ligne :<br>
* <a href="https://shadows.brumm.af/">Shadows Brumm</a>
* <a href="https://getcssscan.com/css-box-shadow-examples">CSS Scan</a>


### Ajouter une ombre à un texte 

On utilisera `text-shadow` qui s'utilise de la même manière que `box-shadow`.

## Créer des apparences dynamiques

Pour cela, on utilisera des pseudo-classes qui viennent s'ajouter aux sélecteurs CSS.<br>

### Styliser un élément au survol de la souris

On utilisera `:hover`.<br>
On va d'abord déclarer le sélecteur sur lequel le style va s'appliquer.<br>
pour ajouter la pseudo-classe.<br>

ex : 
```CSS
a:hover {
    /* Insérer ici les propriétés CSS à appliquer */
}
```
Le `a` fait référence à la balise 'anchor' HTML.<br>
le `:hover` indique qu'au survol, un événement va se produire.<br>

N.B. on pourrait appliquer le :hover sur n'importe quel élément HTML, ou même sur une classe.

L'événement sera un changement de style par exemple, une couleur différente, un texte qui devient 'gras'.<br>

### Stylier un élément au moment du clic

On utilisera `:active`.<br>
Cela fonctionnera de la même manière que `:hover`, mais uniquement lorsque l'élément aura été cliqué.<br>

### Stylier un élément sélectionné par un visiteur

On utilisera `:focus`.<br>
Cela fonctionne notamment quand on utilise la touche tab du clavier, qui sélectionne l'élément suivant d'une page web.<br>
On peut donc appliquer la pseudo-classe :focus pour modifier l'apparence d'un élément après le déclenchement d'une telle action.<br>
Cela fonctionnera de la même manière que `:hover`, mais uniquement lorsque l'élément aura été cliqué.<br>

### Stylier un lien hypertexte déjà consulté par un visiteur

On utilisera `:visited`.<br>
Cela indiquera au visiteur qu'il a déjà cliqué sur le lien.<br>
Par défaut, le navifateur colore un lien en violet.<br>
Grâce à :visited, on peut changer, même si on ne change pas grand chose à part sa couleur.<br>


Attention, les navigateurs ne connaissent pas toutes les propriétés CSS qui existent.<br>
Cela est particulièrement vrai si le navigateur est vieux (ex.: internet explorer).<br>
On pourra utiliser l'outil en ligne : <a href="https://caniuse.com/">Can I Use</a> qui propose des tables de compatibilité HTML et CSS sur différents navigateurs.<br>

### Aller plus loin avec les sélecteurs avancés

#### Le sélecteur universel :
`*` : il permet de sélectionner toutes les balises sans exception.

#### Le sélecteur d'une balise contenue dans une autre 
```CSS
h3 span {
    /* Insérez ici votre style */
}
```
On ne séparera pas les sélecteurs par une virgule.<br>
Ici, on indique qu'on sélectionne la `<span></span>` contenue dans `<h3></h3>`.<br>

#### Le sélecteur d'une balise qui en suit une autre une autre 
```CSS
h3 + p {
    /* Insérez ici votre style */
}
```
On sépare les deux sélecteurs d'un `+`.<br>
On indique ici qu'on sélectionne la balise `p` qui suit la balise `h3`, mais qui sont au même niveau hiérarchique.<br>

#### Le sélecteur d'une balise qui possède un attribut 
```CSS
a[title] {
    /* Insérez ici votre style */
}
```
On indique ici qu'on sélectionne tous les liens hypertextes `<a>` qui possèdent un attribut `title`.<br>

On peut aller plus loin en indiquant la valeur de l'attribut :<br>
`a[attribut:"valeur"]` : on sélectionne une balise qui possède un attribut et une valeur exacte.
```CSS
a[title="monTitre"] {
    /* Insérez ici votre style */
}
```

Ou encore un attribut qui content dans sa valeur un terme précis :
`a[attribut*:"valeur"]` : on sélectionne une balise qui possède un attribut et une valeur exacte.<br>
CSS
```CSS
a[title*="ici"] {
    /* Insérez ici votre style */
}
```
HTML
```HTML
<a href="http://site.com" title="Quelque part par ici">
```

La liste complète est disponible sur le site du <a href="https://www.w3.org/Style/css3-selectors-updates/WD-css3-selectors-20010126.fr.html#selectors">W3C</a>

 