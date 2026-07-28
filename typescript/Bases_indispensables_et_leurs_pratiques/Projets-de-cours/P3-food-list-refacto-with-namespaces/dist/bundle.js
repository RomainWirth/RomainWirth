"use strict";
var App;
(function (App) {
    let HealthScoreClass;
    (function (HealthScoreClass) {
        HealthScoreClass["GOOD"] = "A";
        HealthScoreClass["AVERAGE"] = "B";
        HealthScoreClass["POOR"] = "C";
    })(HealthScoreClass = App.HealthScoreClass || (App.HealthScoreClass = {}));
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
    App.Food = Food;
})(App || (App = {}));
/// <reference path="./Food.class.ts" />
var App;
(function (App) {
    class Meat extends App.Food {
        constructor(name, calories, protein, carbohydrates, fat, image) {
            super(name, calories, protein, carbohydrates, fat, App.HealthScoreClass.AVERAGE, image);
            Meat.meatList.push(this);
        }
        displayFood() {
            console.log(`Meat: ${this._name}`);
            this.displayNutritionalInfo();
        }
    }
    Meat.meatList = [];
    App.Meat = Meat;
})(App || (App = {}));
/// <reference path="./Food.class.ts" />
var App;
(function (App) {
    class Fruit extends App.Food {
        constructor(name, calories, protein, carbohydrates, fat, image) {
            super(name, calories, protein, carbohydrates, fat, App.HealthScoreClass.GOOD, image);
            Fruit.fruitList.push(this);
        }
        displayFood() {
            console.log(`Fruit: ${this._name}`);
            this.displayNutritionalInfo();
        }
    }
    Fruit.fruitList = [];
    App.Fruit = Fruit;
})(App || (App = {}));
/// <reference path="./classes/Food.class.ts" />
/// <reference path="./classes/Meat.class.ts" />
/// <reference path="./classes/Fruit.class.ts" />
var App;
(function (App) {
    new App.Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
    new App.Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
    new App.Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
    new App.Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");
    const healthScoreSelect = document.querySelector("#health-score-select");
    const foodTableBody = document.querySelector("#food-table-body");
    const IMAGES_PATH = "./images/";
    const IMAGES_WIDTH = 100;
    healthScoreSelect.addEventListener("change", updateFoodList);
    updateFoodList();
    function updateFoodList() {
        foodTableBody.innerHTML = "";
        const selectedFoodList = getWantedFood(healthScoreSelect.value);
        for (const food of selectedFoodList) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${food.name}</td>
                <td>${food.calories}</td>
                <td>${food.protein}</td>
                <td>${food.carbohydrates}</td>
                <td>${food.fat}</td>
                <td><img src="${IMAGES_PATH}${food.image}" alt="${food.name}" width="${IMAGES_WIDTH}"></td>
            `;
            foodTableBody.appendChild(row);
        }
    }
    function getWantedFood(healthScore) {
        switch (healthScore) {
            case "all":
                return App.Food.foodList;
            case "bad":
                return App.Food.foodList.filter(food => food.healthScore === App.HealthScoreClass.POOR);
            case "average":
                return App.Food.foodList.filter(food => food.healthScore === App.HealthScoreClass.AVERAGE);
            case "good":
                return App.Food.foodList.filter(food => food.healthScore === App.HealthScoreClass.GOOD);
            default:
                return [];
        }
    }
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map