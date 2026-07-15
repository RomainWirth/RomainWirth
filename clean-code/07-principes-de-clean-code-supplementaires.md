# Quelques principes de Clean Code supplémentaires

## La loi de Demeter

La [loi de Demeter](https://fr.wikipedia.org/wiki/Loi_de_D%C3%A9m%C3%A9ter) est un principe de **connaissance minimale** : un objet ne doit pas connaître la structure interne des objets avec lesquels il interagit. On résume souvent ce principe par la formule : **« ne parle qu'à tes amis immédiats »**.

Conformément à cette loi, une méthode ne doit appeler que les méthodes de :
1. **L'objet lui-même** (`this`)
2. **Les objets passés en paramètre** de la méthode
3. **Les objets créés** à l'intérieur de la méthode
4. **Les attributs directs** de l'objet

### L'anti-pattern « train wreck »

La violation la plus fréquente s'appelle le **train wreck** (déraillement de train) : une suite de points chaînés qui traversent plusieurs objets.

```js
// ⛔ anti-pattern train wreck : on voyage à travers plusieurs objets
client.getOrder().getDelivery().getAddress().getCity();
```

Le problème : si `Order` change la façon dont elle expose `Delivery`, tout le code qui utilisait cette chaîne **casse**, même s'il n'avait rien à faire avec `Order`. C'est du **couplage invisible**.

**Exemple qui ne respecte pas la loi de Demeter** — `Dog` connaît l'intérieur de `Collar` :
```js
class Tag {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Collar {
  constructor(tag) {
    this.tag = tag;
  }
  getTag() {
    return this.tag;
  }
}

class Dog {
  constructor(collar) {
    this.collar = collar;
  }
  displayTagName() {
    // Dog reaches inside Collar to get Tag — violates the Law of Demeter
    return this.collar.getTag().getName();
  }
}

const myTag    = new Tag("Rex");
const myCollar = new Collar(myTag);
const myDog    = new Dog(myCollar);

console.log(myDog.displayTagName()); // "Rex"
```

**Exemple qui respecte la loi de Demeter** — `Dog` ne parle qu'à `Collar`, son « ami direct » :
```js
class Tag {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Collar {
  constructor(tag) {
    this.tag = tag;
  }
  getTagName() {
    // Collar exposes the information Dog needs, not its internal structure
    return this.tag.getName();
  }
}

class Dog {
  constructor(collar) {
    this.collar = collar;
  }
  displayTagName() {
    // Dog only talks to its direct friend: Collar
    return this.collar.getTagName();
  }
}

const myTag    = new Tag("Rex");
const myCollar = new Collar(myTag);
const myDog    = new Dog(myCollar);

console.log(myDog.displayTagName()); // "Rex"
```

La différence : `Collar` possède maintenant une méthode `getTagName()` qui expose **l'information utile**, pas l'objet interne. `Dog` n'a plus besoin de savoir qu'un `Collar` contient un `Tag` — c'est l'affaire de `Collar`. Si demain `Collar` change sa structure interne, seul `Collar` est à modifier.

> Ce principe est étroitement lié à **« Tell, Don't Ask »** : *dis à un objet ce qu'il doit faire, ne lui demande pas ses données pour agir à sa place*. En règle générale, si on se retrouve à chaîner `get().get().get()`, c'est un signal que la responsabilité est au mauvais endroit.

## Le principe de YAGNI

[YAGNI](https://fr.wikipedia.org/wiki/YAGNI) est un acronyme de *You Ain't Gonna Need It* (« Vous n'en aurez pas besoin »), issu de la méthodologie **Extreme Programming (XP)**, formalisé par Ron Jeffries.

Le principe stipule : **n'implémenter une fonctionnalité que lorsqu'elle est réellement nécessaire**, pas parce qu'on anticipe qu'elle le sera un jour.

Le code inutilisé a un coût réel :
- Il **augmente la surface de maintenance** : il faut le tester, le refactoriser, le comprendre quand on le lit.
- Il **introduit des bugs potentiels** dans du code qui ne sert pas encore.
- Il **alourdit la codebase** et ralentit la compréhension pour les autres développeurs.
- Il crée une **dette technique** : le coût de ce qui est anticipé mais rarement utilisé dépasse presque toujours le coût d'implémenter le besoin quand il se présente.

YAGNI travaille main dans la main avec KISS et SRP : une classe qui implémente des fonctionnalités futures viole les trois principes à la fois.

> **Nuance importante** : YAGNI s'applique aux **fonctionnalités**. Il ne dit pas de négliger les **décisions d'architecture** (interfaces, abstractions) qui facilitent l'évolution future. YAGNI s'oppose aux lignes de code inutiles, pas à la conception réfléchie.

**Exemple qui ne respecte pas YAGNI** — `Button` possède des méthodes de désactivation et de style non utilisées :
```js
class Button {
  constructor(label, onClick) {
    this.label    = label;
    this.onClick  = onClick;
    this.disabled = false; // potential future feature
    this.style    = {};    // another potential future feature
  }

  handleClick() {
    if (!this.disabled) {
      this.onClick();
    }
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  applyStyle(newStyle) {
    this.style = { ...this.style, ...newStyle };
    // Style application not yet implemented
  }

  render() {
    const button = document.createElement('button');
    button.textContent = this.label;
    button.addEventListener('click', this.handleClick.bind(this));
    return button;
  }
}

function showMessage() {
  alert("Button clicked!");
}

const myButton = new Button("Click me", showMessage);
document.body.appendChild(myButton.render());
```

**Exemple qui respecte YAGNI** — `SimpleButton` ne contient que ce qui est réellement utilisé :
```js
class SimpleButton {
  constructor(label, onClick) {
    this.label   = label;
    this.onClick = onClick;
  }

  handleClick() {
    this.onClick();
  }

  render() {
    const button = document.createElement('button');
    button.textContent = this.label;
    button.addEventListener('click', this.handleClick.bind(this));
    return button;
  }
}

function showMessage() {
  alert("Button clicked!");
}

const myButton = new SimpleButton("Click me", showMessage);
document.body.appendChild(myButton.render());
```

Si demain le bouton a besoin d'être désactivable, on ajoutera `disabled` et `disable()` à ce moment-là, avec la connaissance exacte du besoin réel.

## Résumé

| Principe | Acronyme / Origine | Idée principale |
| --- | --- | --- |
| **Loi de Demeter** | LoD — Ian Holland (1987) | Ne parle qu'à tes amis immédiats. Évite les chaînes `get().get()`. |
| **YAGNI** | *You Ain't Gonna Need It* — XP / Ron Jeffries | N'implémente que ce qui est nécessaire maintenant. |

**Ce qu'on retient :**
- La **Loi de Demeter** réduit le couplage entre objets : si `A` ne connaît pas la structure interne de `C`, un changement dans `C` n'impacte pas `A`.
- **YAGNI** et **KISS** sont complémentaires : KISS dit de simplifier ce qu'on écrit, YAGNI dit de ne pas écrire ce dont on n'a pas besoin.
- Ces deux principes, comme DRY et la Règle du Boy Scout (couverts dans l'introduction), ont tous le même objectif : **chaque ligne de code doit avoir une raison d'être claire et actuelle**.