export enum HealthScoreClass {
    GOOD = "A",
    AVERAGE = "B",
    POOR = "C"
}

export abstract class Food {
    public static foodList: Food[] = [];

    constructor(
        protected _name: string, 
        public readonly calories: number, 
        public readonly protein: number, 
        public readonly carbohydrates: number, 
        public readonly fat: number, 
        protected _healthScore: HealthScoreClass, 
        protected _image: string,
    ) {
        Food.foodList.push(this);
    }

    get name(): string { return this._name; }
    get healthScore(): HealthScoreClass { return this._healthScore; }
    get image(): string { return this._image; }
    set name(newName: string) {
        this._name = newName;
    }
    set healthScore(newHealthScore: HealthScoreClass) {
        this._healthScore = newHealthScore;
    }
    set image(newImage: string) {
        this._image = newImage;
    }

    abstract displayFood(): void;

    protected displayNutritionalInfo(): void {
        console.log(`Nutritional Information for ${this._name}:`);
        console.log(`Calories: ${this.calories}`);
        console.log(`Protein: ${this.protein}g`);
        console.log(`Carbohydrates: ${this.carbohydrates}g`);
        console.log(`Fat: ${this.fat}g`);
        console.log(`Health Score: ${this._healthScore}`);
    }
}
