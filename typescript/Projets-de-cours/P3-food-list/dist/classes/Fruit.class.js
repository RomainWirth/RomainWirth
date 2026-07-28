"use strict";
class Fruit extends Food {
    constructor(name, calories, protein, carbohydrates, fat, image) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.GOOD, image);
        Fruit.fruitList.push(this);
    }
    displayFood() {
        console.log(`Fruit: ${this._name}`);
        this.displayNutritionalInfo();
    }
}
Fruit.fruitList = [];
//# sourceMappingURL=Fruit.class.js.map