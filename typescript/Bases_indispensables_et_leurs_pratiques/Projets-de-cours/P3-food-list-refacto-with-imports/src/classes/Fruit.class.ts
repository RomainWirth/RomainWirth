import { Food, HealthScoreClass } from './Food.class.js';

export class Fruit extends Food {
    public static fruitList: Fruit[] = [];

    constructor(
        name: string, 
        calories: number, 
        protein: number, 
        carbohydrates: number, 
        fat: number, 
        image: string,
    ) {
        super(name, calories, protein, carbohydrates, fat, HealthScoreClass.GOOD, image);
        Fruit.fruitList.push(this);
    }

    public displayFood(): void {
        console.log(`Fruit: ${this._name}`);
        this.displayNutritionalInfo();
    }
}