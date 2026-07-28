"use strict";
class Meat extends Food {
    constructor(name, calories, protein, carbohydrates, fat, image) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.AVERAGE, image);
        Meat.meatList.push(this);
    }
    displayFood() {
        console.log(`Meat: ${this._name}`);
        this.displayNutritionalInfo();
    }
}
Meat.meatList = [];
//# sourceMappingURL=Meat.class.js.map