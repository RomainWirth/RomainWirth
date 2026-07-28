import { Fruit } from './classes/Fruit.class.js';
import { Meat } from './classes/Meat.class.js';
import { Food, HealthScoreClass } from './classes/Food.class.js';

new Fruit("Apple", 52, 0.3, 14, 0.2, "apple.jpg");
new Fruit("Pear", 57, 0.4, 15, 0.1, "pear.jpg");
new Meat("Ham", 145, 21, 1.5, 5, "ham.jpg");
new Meat("Chicken", 239, 27, 0, 14, "chicken.jpg");

const healthScoreSelect = document.querySelector("#health-score-select")! as HTMLSelectElement;
const foodTableBody = document.querySelector("#food-table-body")! as HTMLTableSectionElement;

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

function getWantedFood(healthScore: string): Food[] {
    switch (healthScore) {
        case "all":
            return Food.foodList;
        case "bad":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.POOR);
        case "average":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.AVERAGE);
        case "good":
            return Food.foodList.filter(food => food.healthScore === HealthScoreClass.GOOD);
        default:
            return [];
    }
}

