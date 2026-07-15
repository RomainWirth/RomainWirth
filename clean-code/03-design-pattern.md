# Les Design Patterns

[wiki](https://en.wikipedia.org/wiki/Software_design_pattern)

Un **design pattern** (ou patron de conception) est une solution standard et réutilisable à un problème récurrent de conception de logiciel. Ce n'est pas un morceau de code à copier tel quel, mais une **description de la façon d'organiser des classes et des objets** pour résoudre un problème donné dans un contexte donné.

Le nom du patron sert de vocabulaire commun entre concepteurs et développeurs. On peut dire « ici j'ai utilisé un Observer » ou « ici c'est une Facade », et chaque développeur qui connaît les patterns comprend immédiatement la structure en jeu.

Les design patterns ont été popularisés par le livre *Design Patterns : Elements of Reusable Object-Oriented Software* (1994), dit le « Gang of Four » (GoF).

Il existe 3 grandes familles de patterns :
* **Patterns comportementaux** : se concentrent sur l'interaction entre les objets, la communication entre eux et la répartition des responsabilités.
* **Patterns de création** : fournissent des mécanismes de création d'objets qui augmentent la flexibilité et la réutilisation du code.
* **Patterns structurels** : expliquent comment les objets et les classes s'assemblent pour former des structures plus grandes tout en gardant une architecture flexible et efficace.

Les exemples de ce chapitre sont en JavaScript.

## Les Design Patterns Comportementaux

Les design patterns comportementaux se concentrent sur l'interaction entre les objets, la communication entre eux et la répartition des responsabilités.

### Observer

Le pattern Observer définit une dépendance de type **un-à-plusieurs** entre objets : lorsqu'un objet (le **sujet**) change d'état, tous ses **observateurs** sont automatiquement notifiés et mis à jour.

**Quand l'utiliser ?** Lorsqu'un changement dans un objet nécessite de modifier plusieurs autres objets, et que vous ne savez pas à l'avance combien d'objets doivent changer. Exemples : systèmes d'événements, flux de données en temps réel, architecture MVC (le modèle notifie les vues), WebSockets.

Le sujet maintient une liste d'observateurs. Chaque observateur implémente une méthode `update()` appelée lors de la notification.

```js
// Subject (observable) : maintains a list of observers and notifies them on every change
class Subject {
  constructor() { this.observers = []; }

  subscribe(observer) {
    if (!this.observers.includes(observer)) this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }

  notify(data) {
    // Calls update() on every registered observer
    this.observers.forEach(observer => observer.update(data));
  }
}

// Observer interface : any object that wants notifications must implement update()
class Observer {
  update(data) { throw new Error("Not implemented"); }
}

// Concrete subject : a weather station that notifies observers on new measurements
class WeatherStation extends Subject {
  setMeasurements(temperature, humidity, pressure) {
    this.temperature = temperature;
    this.humidity    = humidity;
    this.pressure    = pressure;
    this.notify({ temperature, humidity, pressure }); // triggers all registered observers
  }
}

// Observer 1 : displays the current conditions
class CurrentDisplay extends Observer {
  update({ temperature, humidity }) {
    console.log(`Current  — Temp: ${temperature}°C | Humidity: ${humidity}%`);
  }
}

// Observer 2 : tracks temperature statistics over multiple measurements
class StatisticsDisplay extends Observer {
  constructor() { super(); this.temps = []; }

  update({ temperature }) {
    this.temps.push(temperature);
    const min = Math.min(...this.temps);
    const max = Math.max(...this.temps);
    const avg = (this.temps.reduce((a, b) => a + b, 0) / this.temps.length).toFixed(1);
    console.log(`Stats    — Min: ${min}°C | Max: ${max}°C | Avg: ${avg}°C`);
  }
}

// Observer 3 : forecasts weather based on the pressure trend
class ForecastDisplay extends Observer {
  constructor() { super(); this.lastPressure = null; }

  update({ pressure }) {
    if (this.lastPressure === null)          console.log("Forecast — Waiting for data…");
    else if (pressure > this.lastPressure)   console.log("Forecast — Improving weather ahead!");
    else if (pressure < this.lastPressure)   console.log("Forecast — Weather deteriorating!");
    else                                     console.log("Forecast — Stable conditions.");
    this.lastPressure = pressure;
  }
}

// Setup
const station  = new WeatherStation();
const forecast = new ForecastDisplay();
station.subscribe(new CurrentDisplay());
station.subscribe(new StatisticsDisplay());
station.subscribe(forecast);

station.setMeasurements(20, 65, 1013.1);  // all three observers are notified
station.setMeasurements(22, 70, 1012.5);  // pressure dropped → "Weather deteriorating!"

station.unsubscribe(forecast);            // forecast stops receiving updates
station.setMeasurements(19, 90, 1009.2); // only CurrentDisplay and StatisticsDisplay are notified
```

### Strategy

Le pattern Strategy définit une famille d'algorithmes, encapsule chacun d'eux et les rend **interchangeables**. Il permet de choisir l'algorithme à utiliser à l'exécution, indépendamment du code client qui l'utilise.

**Quand l'utiliser ?** Lorsqu'une classe doit supporter plusieurs variantes d'un même comportement, et que vous voulez pouvoir les changer sans modifier la classe. Exemples : systèmes de paiement, algorithmes de tri, règles de validation, calculs de prix. C'est aussi le mécanisme clé pour mettre en œuvre OCP (voir le chapitre SOLID).

```js
// Strategy interface : defines the contract all payment strategies must respect
class PaymentStrategy {
  pay(amount) { throw new Error("Not implemented"); }
}

// Concrete strategies — each encapsulates a different payment algorithm
class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber) { super(); this.cardNumber = cardNumber; }
  pay(amount) {
    console.log(`Paying ${amount}€ by card ...${this.cardNumber.slice(-4)}`);
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) { super(); this.email = email; }
  pay(amount) { console.log(`Paying ${amount}€ via PayPal (${this.email})`); }
}

class BankTransferPayment extends PaymentStrategy {
  constructor(iban) { super(); this.iban = iban; }
  pay(amount) { console.log(`Wire transfer of ${amount}€ to IBAN ${this.iban}`); }
}

// Context : the cart holds items and delegates payment to whatever strategy is currently set
class Cart {
  constructor() { this.items = []; this.paymentStrategy = null; }

  addItem(item)             { this.items.push(item); }
  calculateTotal()          { return this.items.reduce((sum, item) => sum + item.price, 0); }
  setPaymentStrategy(strat) { this.paymentStrategy = strat; } // swap strategy at runtime

  pay() {
    if (!this.paymentStrategy) throw new Error("No payment method defined");
    this.paymentStrategy.pay(this.calculateTotal()); // delegate to the active strategy
  }
}

const cart = new Cart();
cart.addItem({ name: "Phone",        price: 699   });
cart.addItem({ name: "Case",         price: 29.99 });
cart.addItem({ name: "Screen guard", price: 9.99  });

// The cart's behaviour changes at runtime simply by swapping the strategy
cart.setPaymentStrategy(new CreditCardPayment("4111111111111111"));
cart.pay();  // Paying 738.98€ by card ...1111

cart.setPaymentStrategy(new PayPalPayment("john.doe@example.com"));
cart.pay();  // Paying 738.98€ via PayPal
```

### Command

Le pattern Command **encapsule une requête sous forme d'objet**, permettant de paramétrer des clients avec des requêtes différentes, de les mettre en file d'attente, de les journaliser, et surtout de les **annuler**.

**Quand l'utiliser ?** Lorsque vous avez besoin d'opérations annulables (undo/redo), de files d'attente de tâches, d'historique d'actions, ou de boutons/raccourcis configurables. Exemples : éditeurs de texte, interfaces avec undo/redo, systèmes de workflow.

Le pattern s'articule autour de 3 rôles :
- **Command** : interface avec `execute()` et `undo()`.
- **Receiver** : l'objet qui sait réellement comment effectuer les opérations.
- **Invoker** : déclenche les commandes sans connaître leurs détails ; tient l'historique.

```js
// Command interface : every command must implement execute() and undo()
class Command {
  execute() { throw new Error("Not implemented"); }
  undo()    { throw new Error("Not implemented"); }
}

// Receiver : knows how to perform the actual low-level operations
class Television {
  constructor() { this.isOn = false; this.volume = 0; this.channel = 1; }

  turnOn()  { this.isOn = true;  console.log("TV on"); }
  turnOff() { this.isOn = false; console.log("TV off"); }

  increaseVolume() {
    if (this.isOn) { this.volume++; console.log(`Volume → ${this.volume}`); }
  }
  decreaseVolume() {
    if (this.isOn && this.volume > 0) { this.volume--; console.log(`Volume → ${this.volume}`); }
  }
  setChannel(ch) {
    if (this.isOn) { this.channel = ch; console.log(`Channel → ${this.channel}`); }
  }
}

// Concrete commands — each wraps one receiver operation and knows how to reverse it
class TurnOnCommand extends Command {
  constructor(tv) { super(); this.tv = tv; }
  execute() { this.tv.turnOn(); }
  undo()    { this.tv.turnOff(); }
}

class IncreaseVolumeCommand extends Command {
  constructor(tv) { super(); this.tv = tv; }
  execute() { this.tv.increaseVolume(); }
  undo()    { this.tv.decreaseVolume(); } // undo = reverse operation
}

class SetChannelCommand extends Command {
  constructor(tv, channel) {
    super();
    this.tv          = tv;
    this.newChannel  = channel;
    this.prevChannel = tv.channel; // memorise current channel to allow undo
  }
  execute() { this.prevChannel = this.tv.channel; this.tv.setChannel(this.newChannel); }
  undo()    { this.tv.setChannel(this.prevChannel); }
}

// Invoker : triggers commands and keeps a history stack for undo
class RemoteControl {
  constructor() { this.buttons = {}; this.history = []; }

  setButton(name, cmd) { this.buttons[name] = cmd; }

  press(name) {
    const cmd = this.buttons[name];
    if (cmd) { cmd.execute(); this.history.push(cmd); } // record for undo
  }

  undoLast() {
    const cmd = this.history.pop();
    if (cmd) cmd.undo();
  }
}

const tv     = new Television();
const remote = new RemoteControl();

remote.setButton("POWER", new TurnOnCommand(tv));
remote.setButton("VOL+",  new IncreaseVolumeCommand(tv));
remote.setButton("CH5",   new SetChannelCommand(tv, 5));

remote.press("POWER");  // execute → TV on
remote.press("VOL+");   // execute → volume 1
remote.press("VOL+");   // execute → volume 2
remote.press("CH5");    // execute → channel 5

remote.undoLast();      // undo SetChannel  → channel back to 1
remote.undoLast();      // undo IncreaseVol → volume back to 1
```

### State

Le pattern State permet à un objet de **modifier son comportement lorsque son état interne change**. De l'extérieur, l'objet semble changer de classe : les mêmes appels produisent des effets différents selon l'état courant.

**Quand l'utiliser ?** Lorsque le comportement d'un objet dépend de son état et que les `if/else` ou `switch` sur l'état prolifèrent dans les méthodes. Exemples : distributeurs automatiques, gestion d'ennemis dans les jeux vidéo (patrouille → alerte → combat), connexions réseau (fermée → ouverte → en attente), formulaires multi-étapes.

Le pattern s'articule autour de 2 rôles :
- **Context** : l'objet dont le comportement varie. Il délègue toutes les actions à son état courant.
- **State** : interface que chaque état concret implémente. Chaque état sait quoi faire pour chaque action, et peut déclencher une transition vers un autre état via le contexte.

```js
// State interface : every concrete state implements the same four actions
class VendingMachineState {
  constructor(machine) { this.machine = machine; } // reference to context for state transitions
  insertCoin() { throw new Error("Not implemented"); }
  ejectCoin()  { throw new Error("Not implemented"); }
  turnHandle() { throw new Error("Not implemented"); }
  dispense()   { throw new Error("Not implemented"); }
}

// State 1 : machine is empty — no useful interactions possible
class EmptyState extends VendingMachineState {
  insertCoin() { console.log("Machine is empty, cannot accept coins."); }
  ejectCoin()  { console.log("No coin inserted."); }
  turnHandle() { console.log("Machine is empty, nothing to dispense."); }
  dispense()   { console.log("No candy available."); }
}

// State 2 : waiting for a coin
class NoCoinState extends VendingMachineState {
  insertCoin() {
    console.log("Coin inserted.");
    this.machine.setState(this.machine.hasCoinState); // transition → HasCoin
  }
  ejectCoin()  { console.log("No coin to return."); }
  turnHandle() { console.log("Insert a coin first."); }
  dispense()   { console.log("Pay first."); }
}

// State 3 : a coin has been inserted, waiting for the handle
class HasCoinState extends VendingMachineState {
  insertCoin() { console.log("Coin already inserted."); }
  ejectCoin() {
    console.log("Coin returned.");
    this.machine.setState(this.machine.noCoinState); // transition → NoCoin
  }
  turnHandle() {
    console.log("Handle turned…");
    this.machine.setState(this.machine.dispensingState); // transition → Dispensing
  }
  dispense() { console.log("Turn the handle first."); }
}

// State 4 : dispensing in progress
class DispensingState extends VendingMachineState {
  insertCoin() { console.log("Please wait, dispensing in progress."); }
  ejectCoin()  { console.log("Too late, handle already turned."); }
  turnHandle() { console.log("Turning again won't give another candy."); }
  dispense() {
    this.machine.releaseBall(); // drops one candy and decrements count
    // Transition to the appropriate next state based on remaining stock
    this.machine.setState(
      this.machine.count > 0 ? this.machine.noCoinState : this.machine.emptyState
    );
  }
}

// Context : delegates every user action to the current state object
class CandyMachine {
  constructor(count) {
    this.count = count;
    // All state objects are created once and stored as properties
    this.emptyState      = new EmptyState(this);
    this.noCoinState     = new NoCoinState(this);
    this.hasCoinState    = new HasCoinState(this);
    this.dispensingState = new DispensingState(this);
    // Initial state depends on stock
    this.state = count > 0 ? this.noCoinState : this.emptyState;
  }

  // Public API — each call is forwarded to the current state
  insertCoin()  { this.state.insertCoin(); }
  ejectCoin()   { this.state.ejectCoin(); }
  turnHandle()  { this.state.turnHandle(); this.state.dispense(); }
  setState(s)   { this.state = s; }

  releaseBall() {
    if (this.count > 0) { console.log("A candy drops out…"); this.count--; }
  }
  getRemainingCount() { return this.count; }
}

const machine = new CandyMachine(3);

console.log(`Candies: ${machine.getRemainingCount()}`); // 3
machine.insertCoin();  // NoCoin     → HasCoin
machine.turnHandle();  // HasCoin    → Dispensing → NoCoin, candy dispensed

machine.insertCoin();
machine.ejectCoin();   // HasCoin    → NoCoin, coin returned
machine.turnHandle();  // NoCoin     : "Insert a coin first."

machine.insertCoin();
machine.turnHandle();  // candy dispensed
console.log(`Candies: ${machine.getRemainingCount()}`); // 1
```

Ce pattern est notamment utilisé dans les jeux vidéo pour modéliser l'IA des ennemis (patrouille → alerte → combat → mort) ou les états d'une connexion réseau.

### Chain of Responsibility

Le pattern Chain of Responsibility permet de **passer une requête le long d'une chaîne de handlers** jusqu'à ce que l'un d'eux la traite. Chaque handler décide soit de prendre en charge la requête, soit de la transmettre au handler suivant.

**Quand l'utiliser ?** Lorsque plusieurs objets peuvent traiter une requête et que le handler n'est pas connu à l'avance, ou lorsque vous voulez découpler l'émetteur d'une requête de ses récepteurs. Exemples : systèmes de support multi-niveaux, middleware HTTP (Express, Koa…), pipelines de validation, gestion des événements DOM.

```js
// Base handler : holds a reference to the next handler and provides a default pass-through
class Handler {
  constructor() { this.next = null; }

  setNext(handler) {
    this.next = handler;
    return handler; // enables fluent chaining: a.setNext(b).setNext(c)
  }

  handleRequest(request) {
    // If this handler cannot deal with it, forward to the next
    if (this.next) return this.next.handleRequest(request);
    return `No handler could resolve: "${request.description}"`;
  }
}

// Concrete handlers — each resolves requests within its own competence level
class LevelOneSupport extends Handler {
  handleRequest(request) {
    if (request.type === "information" || request.difficulty <= 3) {
      return `L1 Support resolved: "${request.description}"`;
    }
    console.log(`L1: escalating "${request.description}"…`);
    return super.handleRequest(request); // pass up the chain
  }
}

class LevelTwoSupport extends Handler {
  handleRequest(request) {
    if (request.type === "technical" && request.difficulty <= 7) {
      return `L2 Support resolved: "${request.description}"`;
    }
    console.log(`L2: escalating "${request.description}"…`);
    return super.handleRequest(request);
  }
}

class LevelThreeSupport extends Handler {
  handleRequest(request) {
    if (request.difficulty <= 9) {
      return `L3 Support resolved: "${request.description}"`;
    }
    console.log(`L3: escalating "${request.description}"…`);
    return super.handleRequest(request);
  }
}

class TechnicalDirector extends Handler {
  handleRequest(request) {
    return `Technical Director stepped in for: "${request.description}"`;
  }
}

// Build the chain with fluent setNext() — L1 → L2 → L3 → Director
const l1 = new LevelOneSupport();
l1.setNext(new LevelTwoSupport())
  .setNext(new LevelThreeSupport())
  .setNext(new TechnicalDirector());

const requests = [
  { type: "information", description: "How to reset my password",   difficulty: 2  },
  { type: "technical",   description: "App crashes on startup",      difficulty: 5  },
  { type: "technical",   description: "Security flaw in our API",    difficulty: 8  },
  { type: "emergency",   description: "Production servers are down", difficulty: 10 },
];

// Every request enters at L1 — each handler decides to resolve or escalate
requests.forEach(req => {
  console.log(`\nRequest (difficulty ${req.difficulty}): ${req.description}`);
  console.log(l1.handleRequest(req));
});
```

## Les Design Patterns de Création

Les design patterns de création fournissent des mécanismes de création d'objets qui augmentent la flexibilité et la réutilisation du code. L'objectif commun est de **masquer la logique de création** derrière une interface stable, pour que le code client ne dépende pas des classes concrètes.

### Singleton

Le pattern Singleton **garantit qu'une classe n'a qu'une seule instance** dans toute l'application, et fournit un point d'accès global à cette instance.

**Quand l'utiliser ?** Lorsqu'une ressource unique doit être partagée : connexion à une base de données, gestionnaire de configuration, pool de connexions, logger. À utiliser avec parcimonie : un Singleton introduit un état global, ce qui peut rendre le code difficile à tester et à paralléliser.

En JavaScript, le pattern s'implémente classiquement via une propriété statique qui mémorise l'instance créée.

```js
class DatabaseConnection {
  // Private static field : holds the single instance (null until first call)
  static #instance = null;

  // Private constructor : prevents direct instantiation with `new DatabaseConnection()`
  constructor(host, port) {
    this.host       = host;
    this.port       = port;
    this.connected  = false;
    console.log(`Connection object created for ${host}:${port}`);
  }

  // Static factory : the only way to get an instance
  static getInstance(host = "localhost", port = 5432) {
    if (!DatabaseConnection.#instance) {
      // First call : create and store the instance
      DatabaseConnection.#instance = new DatabaseConnection(host, port);
    }
    // Subsequent calls : return the existing instance
    return DatabaseConnection.#instance;
  }

  connect() {
    if (!this.connected) {
      this.connected = true;
      console.log(`Connected to ${this.host}:${this.port}`);
    } else {
      console.log("Already connected.");
    }
  }

  query(sql) {
    if (!this.connected) throw new Error("Not connected");
    console.log(`Query: ${sql}`);
  }
}

const db1 = DatabaseConnection.getInstance("db.example.com", 5432);
const db2 = DatabaseConnection.getInstance(); // returns the same object

console.log(db1 === db2); // true — both variables point to the same instance

db1.connect();
db2.connect(); // "Already connected." — because db2 IS db1
db1.query("SELECT * FROM users");
```

> **Attention** : en JavaScript, les modules ES (`import/export`) se comportent déjà comme des singletons (un module n'est exécuté qu'une seule fois, peu importe le nombre d'imports). Dans la plupart des cas modernes, **exporter une instance depuis un module** est une alternative plus simple et plus testable que d'implémenter le pattern Singleton manuellement.

---

### Factory Method

Le pattern Factory Method **centralise et délègue la création d'objets** à une méthode dédiée ou à une classe factory. Le code client ne fait jamais `new ProduitConcret()` directement : il passe par la factory, qui décide quelle classe instancier.

**Quand l'utiliser ?** Lorsque le code ne connaît pas à l'avance la classe exacte à instancier, ou lorsque vous voulez centraliser la création d'objets liés. Exemples : systèmes de véhicules, parsers de formats de fichiers, création de connexions à différentes bases de données. Ce pattern est notamment utilisé dans de nombreux frameworks (Laravel, Spring, NestJS…) pour créer des services ou des connexions à partir de la configuration.

```js
// Product interface : all vehicles share the same contract
class Vehicle {
  constructor(model) { this.model = model; }
  getDescription() { return `Vehicle: ${this.model}`; }
}

// Concrete products
class Car extends Vehicle {
  constructor(model, doors) { super(model); this.doors = doors; }
  getDescription() { return `Car: ${this.model} — ${this.doors} doors`; }
}

class Motorcycle extends Vehicle {
  constructor(model, displacement) { super(model); this.displacement = displacement; }
  getDescription() { return `Motorcycle: ${this.model} — ${this.displacement}cc`; }
}

// Factory : centralises creation — callers never use `new Car()` or `new Motorcycle()` directly
class VehicleFactory {
  create(type, options) {
    switch (type) {
      case "car":        return new Car(options.model, options.doors);
      case "motorcycle": return new Motorcycle(options.model, options.displacement);
      default:           throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
}

const factory = new VehicleFactory();
const car  = factory.create("car",        { model: "Tesla Model 3", doors: 4 });
const moto = factory.create("motorcycle", { model: "Yamaha MT-07",  displacement: 700 });

console.log(car.getDescription());  // Car: Tesla Model 3 — 4 doors
console.log(moto.getDescription()); // Motorcycle: Yamaha MT-07 — 700cc
```

### Builder

Le pattern Builder **sépare la construction d'un objet complexe de sa représentation**, permettant au même processus de construction de créer différentes représentations.

**Quand l'utiliser ?** Lorsqu'un objet a de nombreux paramètres optionnels ou que sa construction se fait en plusieurs étapes. Le Builder évite les constructeurs à dix arguments et rend le code de création lisible grâce au chaînage de méthodes. Exemples : configuration d'objets complexes (commandes, requêtes HTTP, documents).

```js
class Pizza {
  constructor() { this.size = ''; this.crust = ''; this.cheese = ''; this.toppings = []; }
  describe() {
    return `${this.size} pizza, ${this.crust} crust, ${this.cheese} cheese` +
           (this.toppings.length ? `, toppings: ${this.toppings.join(', ')}` : '');
  }
}

// Builder : assembles a Pizza step by step; each method returns `this` for fluent chaining
class PizzaBuilder {
  constructor()          { this.pizza = new Pizza(); }
  withSize(size)         { this.pizza.size = size;            return this; }
  withCrust(type)        { this.pizza.crust = type;           return this; }
  withCheese(type)       { this.pizza.cheese = type;          return this; }
  addTopping(topping)    { this.pizza.toppings.push(topping); return this; }
  build()                { return this.pizza; }   // returns the finished object
}

const myPizza = new PizzaBuilder()
  .withSize('medium')
  .withCrust('thin')
  .withCheese('mozzarella')
  .addTopping('mushrooms')
  .addTopping('olives')
  .build();

console.log(myPizza.describe());
// medium pizza, thin crust, mozzarella cheese, toppings: mushrooms, olives
```

### Dependency Injection

La Dependency Injection (injection de dépendance) n'est pas un pattern GoF à proprement parler, mais une technique qui met en œuvre le principe DIP (Dependency Inversion Principle) : **une classe reçoit les objets dont elle a besoin de l'extérieur**, plutôt que de les créer elle-même avec `new`.

**Quand l'utiliser ?** Lorsque vous voulez découpler une classe des implémentations concrètes qu'elle utilise, faciliter les tests unitaires (en injectant des mocks) et rendre le code configurable. Ce mécanisme est au cœur de la plupart des frameworks modernes (NestJS, Spring, Laravel, Angular…).

```js
// Low-level modules : concrete notification transports
class EmailService {
  send(to, subject, body) {
    console.log(`Email → ${to}: [${subject}] ${body}`);
  }
}

class SMSService {
  send(phoneNumber, subject, body) {
    console.log(`SMS → ${phoneNumber}: ${body}`);
  }
}

// High-level module : receives its dependency from the outside (constructor injection)
class NotificationService {
  constructor(sender) {
    this.sender = sender; // injected — not created here with `new`
  }

  notifyUser(user, message) {
    // Works with any object that exposes send(), regardless of its concrete type
    this.sender.send(user.contact, "Notification", message);
  }
}

// Inject the concrete transport at the call site — no modification of NotificationService needed
const alice = { contact: "alice@example.com" };
new NotificationService(new EmailService()).notifyUser(alice, "Your order has shipped.");

const bob = { contact: "+33123456789" };
new NotificationService(new SMSService()).notifyUser(bob, "Your order arrives in 30 min.");

// In tests, inject a mock instead of a real service
class MockSender {
  constructor() { this.sent = []; }
  send(to, subject, body) { this.sent.push({ to, subject, body }); }
}
const mock = new MockSender();
new NotificationService(mock).notifyUser(alice, "Test");
console.log(mock.sent); // inspect what was "sent" without any real transport
```

## Les Design Patterns Structurels

Les design patterns structurels expliquent comment assembler des objets et des classes en structures plus grandes, tout en gardant ces structures flexibles et efficaces.

### Adapter

Le pattern Adapter convertit l'interface d'une classe en une autre interface **attendue par les clients**. Il permet à des classes incompatibles de fonctionner ensemble, en jouant le rôle de traducteur.

**Quand l'utiliser ?** Lorsque vous devez utiliser une classe existante (legacy, bibliothèque tierce…) dont l'interface ne correspond pas à ce qu'attend votre code. Exemples : intégration d'un système de paiement legacy, wrapping d'une librairie externe, migration progressive d'une ancienne API.

```js
// Existing legacy system with its own method signature
class LegacyPaymentSystem {
  processPaymentLegacy(amount, accountNumber, currency) {
    console.log(`Legacy payment: ${amount} ${currency} from account ${accountNumber}`);
    return `TXN-${Date.now()}`;
  }
}

// New interface expected by the rest of the application
class PaymentSystem {
  processPayment(payment) { throw new Error("Not implemented"); }
}

// Adapter : wraps the legacy system and exposes the new interface
class PaymentAdapter extends PaymentSystem {
  constructor(legacySystem) { super(); this.legacy = legacySystem; }

  processPayment(payment) {
    // Translates the new-style payment object into legacy API arguments
    return this.legacy.processPaymentLegacy(
      payment.amount,
      payment.accountNumber,
      payment.currency
    );
  }
}

// Client : only knows about PaymentSystem — completely unaware of the legacy implementation
class OrderService {
  constructor(paymentSystem) { this.paymentSystem = paymentSystem; }

  placeOrder(product, amount, accountNumber) {
    const txId = this.paymentSystem.processPayment({ amount, accountNumber, currency: "EUR" });
    console.log(`Order for "${product}" confirmed — tx: ${txId}`);
  }
}

const adapter = new PaymentAdapter(new LegacyPaymentSystem());
new OrderService(adapter).placeOrder("Smartphone", 699.99, "FR7630002111110020050014382");
```

### Decorator

Le pattern Decorator **ajoute dynamiquement des responsabilités à un objet** sans modifier sa classe, en l'enveloppant dans un objet décorateur qui partage la même interface.

**Quand l'utiliser ?** Lorsque vous voulez étendre les fonctionnalités d'un objet à l'exécution sans utiliser l'héritage, ou lorsque les combinaisons possibles d'extensions sont trop nombreuses pour être couvertes par des sous-classes. Exemples : ajouts à une commande (café, pizza), flux I/O, middlewares.

```js
// Component : base interface
class Coffee {
  cost()        { return 2.0; }
  description() { return "Coffee"; }
}

// Base decorator : wraps any Coffee and delegates by default
class CoffeeDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost()        { return this.coffee.cost(); }
  description() { return this.coffee.description(); }
}

// Concrete decorators — each wraps the previous object, adding its cost and description
class MilkDecorator extends CoffeeDecorator {
  cost()        { return this.coffee.cost() + 0.5; }
  description() { return `${this.coffee.description()}, Milk`; }
}

class ChocolateDecorator extends CoffeeDecorator {
  cost()        { return this.coffee.cost() + 0.7; }
  description() { return `${this.coffee.description()}, Chocolate`; }
}

class CaramelDecorator extends CoffeeDecorator {
  cost()        { return this.coffee.cost() + 0.6; }
  description() { return `${this.coffee.description()}, Caramel`; }
}

// Decorators are stacked at runtime — each layer wraps the previous one
let myCoffee = new Coffee();                 // 2.0€  — "Coffee"
myCoffee = new MilkDecorator(myCoffee);      // 2.5€  — "Coffee, Milk"
myCoffee = new ChocolateDecorator(myCoffee); // 3.2€  — "Coffee, Milk, Chocolate"
myCoffee = new CaramelDecorator(myCoffee);   // 3.8€  — "Coffee, Milk, Chocolate, Caramel"

console.log(`${myCoffee.description()} — ${myCoffee.cost()}€`);
```

### Composite

Le pattern Composite compose des objets en **structures arborescentes** pour représenter des hiérarchies partie-tout. Il permet aux clients de traiter de manière uniforme les objets individuels et les compositions.

**Quand l'utiliser ?** Lorsque votre structure de données est naturellement arborescente et que vous voulez traiter les feuilles et les nœuds de manière uniforme. Exemples : systèmes de fichiers, menus imbriqués, arbres DOM, organigrammes.

```js
// Component : shared interface for both leaves (files) and composites (folders)
class FileSystemNode {
  constructor(name) { this.name = name; }
  display(indent = "") { throw new Error("Not implemented"); }
  getSize()            { throw new Error("Not implemented"); }
}

// Leaf : a single file — no children, returns its own size
class File extends FileSystemNode {
  constructor(name, size) { super(name); this.size = size; } // size in KB
  display(indent = "") { console.log(`${indent}📄 ${this.name} (${this.size} KB)`); }
  getSize()            { return this.size; }
}

// Composite : a folder that can contain files or other folders (recursive structure)
class Folder extends FileSystemNode {
  constructor(name) { super(name); this.children = []; }

  add(node)    { this.children.push(node); }
  remove(node) { this.children.splice(this.children.indexOf(node), 1); }

  display(indent = "") {
    console.log(`${indent}📁 ${this.name} (${this.getSize()} KB)`);
    this.children.forEach(child => child.display(indent + "  ")); // recursive call
  }

  getSize() {
    return this.children.reduce((sum, child) => sum + child.getSize(), 0); // recursive sum
  }
}

// Client code treats File and Folder identically through display() and getSize()
const root   = new Folder("root");
const docs   = new Folder("Documents");
const images = new Folder("Images");

docs.add(new File("report.pdf",         1500));
docs.add(new File("presentation.pptx",  2200));
images.add(new File("photo1.jpg",        500));
images.add(new File("photo2.jpg",        600));

root.add(docs);
root.add(images);
root.add(new File("notes.txt", 100));

root.display();
// 📁 root (4900 KB)
//   📁 Documents (3700 KB)
//     📄 report.pdf (1500 KB)
//     📄 presentation.pptx (2200 KB)
//   📁 Images (1100 KB)
//     📄 photo1.jpg (500 KB)
//     📄 photo2.jpg (600 KB)
//   📄 notes.txt (100 KB)
```

### Facade

Le pattern Facade fournit une **interface simplifiée et unifiée** à un ensemble de classes ou sous-systèmes complexes.

**Quand l'utiliser ?** Lorsque vous devez simplifier l'accès à un sous-système complexe, ou lorsque vous voulez structurer votre code en couches (la facade est la couche d'entrée d'une couche de service). Exemples : SDKs, services applicatifs qui orchestrent plusieurs composants (stock + paiement + expédition + notification), clients d'API.

```js
// Sub-systems : each handles one specific technical concern independently
class StockChecker {
  isAvailable(productId, quantity) {
    console.log(`Checking stock: ${quantity}× ${productId}`);
    return true; // simplified
  }
}

class PaymentProcessor {
  charge(amount) {
    console.log(`Charging ${amount}€`);
    return true; // simplified
  }
}

class ShippingManager {
  createShipment(order) {
    console.log(`Shipment created for order ${order.id}`);
    return `SHIP-${Date.now()}`;
  }
}

class NotificationService {
  sendConfirmation(email, text) {
    console.log(`Confirmation sent to ${email}: ${text}`);
  }
}

// Facade : one simple method that orchestrates all sub-systems
// The client never has to interact with StockChecker, PaymentProcessor, etc. directly
class OrderSystem {
  constructor() {
    this.stock        = new StockChecker();
    this.payment      = new PaymentProcessor();
    this.shipping     = new ShippingManager();
    this.notification = new NotificationService();
  }

  placeOrder(productId, quantity, email, amount) {
    if (!this.stock.isAvailable(productId, quantity)) {
      console.log("Product not available."); return false;
    }
    if (!this.payment.charge(amount)) {
      console.log("Payment failed."); return false;
    }
    const order      = { id: `ORD-${Date.now()}`, productId, quantity, email };
    const shipmentId = this.shipping.createShipment(order);
    this.notification.sendConfirmation(email,
      `Order ${order.id} confirmed — shipment: ${shipmentId}`);
    return true;
  }
}

// Client calls a single method and is shielded from all sub-system complexity
new OrderSystem().placeOrder("PROD-123", 2, "client@example.com", 79.98);
```

### Proxy

Le pattern Proxy **fournit un substitut ou un intermédiaire** pour contrôler l'accès à un objet. Le client croit s'adresser directement à l'objet réel, mais passe en réalité par le proxy, qui peut ajouter du comportement avant et/ou après l'appel.

**Quand l'utiliser ?** Trois usages classiques :
- **Proxy de mise en cache** (*caching proxy*) : mémorise les résultats coûteux pour ne pas recalculer ou ré-interroger inutilement.
- **Proxy de contrôle d'accès** (*protection proxy*) : vérifie les droits avant de déléguer à l'objet réel.
- **Proxy de chargement différé** (*virtual/lazy proxy*) : retarde la création d'un objet coûteux jusqu'au premier accès réel.

Exemples concrets : `Proxy` natif JavaScript (Vue 3 reactivity), lazy loading d'entités ORM (TypeORM, Sequelize), rate limiting dans une API, logs automatiques d'appels.

**Proxy vs Decorator** : la structure est identique (un objet en enveloppe un autre avec la même interface), mais l'**intention diffère**. Le Decorator *enrichit* le comportement ; le Proxy *contrôle l'accès* à l'objet qu'il représente. En pratique, un Proxy peut remplacer l'objet réel entièrement (lazy creation), ce qu'un Decorator ne fait jamais.

```js
// Subject interface : both the real object and the proxy expose the same API
class UserService {
  getUser(id) { throw new Error("Not implemented"); }
}

// Real subject : hits the database on every call
class RealUserService extends UserService {
  getUser(id) {
    console.log(`[DB] Fetching user ${id}…`);
    return { id, name: `User ${id}`, role: id === 1 ? "admin" : "guest" };
  }
}

// Proxy 1 : caching — avoids redundant DB calls for the same id
class CachedUserService extends UserService {
  constructor(realService) {
    super();
    this.real  = realService;
    this.cache = new Map();
  }

  getUser(id) {
    if (this.cache.has(id)) {
      console.log(`[Cache] Returning cached user ${id}`);
      return this.cache.get(id);       // serve from cache
    }
    const user = this.real.getUser(id); // delegate to real service
    this.cache.set(id, user);           // store result for next call
    return user;
  }
}

// Proxy 2 : access control — only admins can query other users
class ProtectedUserService extends UserService {
  constructor(realService, currentUser) {
    super();
    this.real        = realService;
    this.currentUser = currentUser;
  }

  getUser(id) {
    if (this.currentUser.role !== "admin" && this.currentUser.id !== id) {
      throw new Error("Access denied: insufficient permissions");
    }
    return this.real.getUser(id); // access granted — forward the call
  }
}

// Setup
const real    = new RealUserService();
const cached  = new CachedUserService(real);

cached.getUser(1); // [DB] Fetching user 1…       (cache miss)
cached.getUser(1); // [Cache] Returning cached user 1  (cache hit)
cached.getUser(2); // [DB] Fetching user 2…       (cache miss)

const admin = cached.getUser(1);           // { id: 1, role: 'admin' }
const adminProxy = new ProtectedUserService(cached, admin);
console.log(adminProxy.getUser(2).name);   // OK — admin can query anyone

const guest = cached.getUser(2);           // { id: 2, role: 'guest' }
const guestProxy = new ProtectedUserService(cached, guest);
try {
  guestProxy.getUser(1);                   // throws: "Access denied"
} catch (e) {
  console.log(e.message);
}
```

> **Note** : JavaScript fournit un objet `Proxy` natif qui permet d'intercepter les opérations fondamentales d'un objet (lecture de propriété, écriture, appel de fonction…) sans créer de sous-classe. C'est le mécanisme utilisé par Vue 3 pour la réactivité.

## Résumé

| Famille | Pattern | Problème résolu | Mécanisme clé |
| --- | --- | --- | --- |
| **Comportemental** | Observer | Notifier plusieurs objets d'un changement | Sujet + liste d'observateurs avec `update()` |
| **Comportemental** | Strategy | Interchanger des algorithmes à l'exécution | Algorithme encapsulé dans une classe |
| **Comportemental** | Command | Annuler / rejouer des actions | Objet-requête avec `execute()` + `undo()` |
| **Comportemental** | State | Adapter le comportement à l'état interne | Délégation à l'objet-état courant |
| **Comportemental** | Chain of Responsibility | Router une requête vers le bon handler | Chaîne de handlers avec pass-through |
| **Création** | Singleton | Garantir une seule instance dans toute l'application | Propriété statique `#instance` + méthode `getInstance()` |
| **Création** | Factory Method | Centraliser et déléguer la création d'objets | Méthode de fabrication dans une classe dédiée |
| **Création** | Builder | Construire des objets complexes étape par étape | Chaînage de méthodes sur un builder |
| **Création** | Dependency Injection | Découpler une classe de ses dépendances | Injection par constructeur |
| **Structurel** | Adapter | Faire fonctionner des interfaces incompatibles | Classe adaptatrice qui traduit les appels |
| **Structurel** | Decorator | Ajouter des responsabilités dynamiquement | Enveloppement avec la même interface |
| **Structurel** | Composite | Traiter uniformément objets simples et compositions | Structure arborescente avec interface commune |
| **Structurel** | Facade | Simplifier l'accès à un sous-système complexe | Interface unique masquant la complexité interne |
| **Structurel** | Proxy | Contrôler l'accès à un objet (cache, droits, lazy load) | Intermédiaire avec la même interface que l'objet réel |

**À retenir :**
- Un pattern n'est pas une règle absolue : adaptez-le à votre contexte. N'introduisez pas un pattern « juste parce que ça fait propre » si la complexité n'est pas justifiée (principe YAGNI).
- Les patterns se combinent : une Facade peut utiliser des Factory Methods ; un Observer peut contenir des Strategies.
- Connaître les noms des patterns améliore la communication en équipe : « j'ai utilisé un Decorator ici » est plus clair que d'expliquer la structure en détail.
- Les patterns comportementaux résolvent des problèmes de **flux de contrôle** ; les patterns de création résolvent des problèmes de **création d'instances** ; les patterns structurels résolvent des problèmes d'**assemblage de classes**.
