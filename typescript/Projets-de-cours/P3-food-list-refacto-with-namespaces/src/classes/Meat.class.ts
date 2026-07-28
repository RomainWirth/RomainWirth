/// <reference path="./Food.class.ts" />

namespace App {
    export class Meat extends Food {
        public static meatList: Meat[] = [];

        constructor(
            name: string, 
            calories: number, 
            protein: number, 
            carbohydrates: number, 
            fat: number, 
            image: string,
        ) {
            super(name, calories, protein, carbohydrates, fat, HealthScoreClass.AVERAGE, image);
            Meat.meatList.push(this);
        }

        public displayFood(): void {
            console.log(`Meat: ${this._name}`);
            this.displayNutritionalInfo();
        }
    }
}