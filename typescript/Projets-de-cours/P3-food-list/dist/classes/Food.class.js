"use strict";
var HealthScoreClass;
(function (HealthScoreClass) {
    HealthScoreClass["GOOD"] = "A";
    HealthScoreClass["AVERAGE"] = "B";
    HealthScoreClass["POOR"] = "C";
})(HealthScoreClass || (HealthScoreClass = {}));
class Food {
    constructor(_name, calories, protein, carbohydrates, fat, _healthScore, _image) {
        this._name = _name;
        this.calories = calories;
        this.protein = protein;
        this.carbohydrates = carbohydrates;
        this.fat = fat;
        this._healthScore = _healthScore;
        this._image = _image;
        Food.foodList.push(this);
    }
    get name() { return this._name; }
    get healthScore() { return this._healthScore; }
    get image() { return this._image; }
    set name(newName) {
        this._name = newName;
    }
    set healthScore(newHealthScore) {
        this._healthScore = newHealthScore;
    }
    set image(newImage) {
        this._image = newImage;
    }
    displayNutritionalInfo() {
        console.log(`Nutritional Information for ${this._name}:`);
        console.log(`Calories: ${this.calories}`);
        console.log(`Protein: ${this.protein}g`);
        console.log(`Carbohydrates: ${this.carbohydrates}g`);
        console.log(`Fat: ${this.fat}g`);
        console.log(`Health Score: ${this._healthScore}`);
    }
}
Food.foodList = [];
//# sourceMappingURL=Food.class.js.map