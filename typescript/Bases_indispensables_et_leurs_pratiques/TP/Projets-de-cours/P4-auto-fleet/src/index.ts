enum VehiculeType {
    BUS = "bus",
    CAR = "car"
}

abstract class Vehicule {
    constructor(
        private readonly _registration: string,
        private readonly _type: VehiculeType,
    ) {};

    get registration() { return this._registration; }
    get type() { return this._type; }
}

class Bus extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.BUS)
    }
}

class Car extends Vehicule {
    constructor (
        registration: string,
    ) {
        super(registration, VehiculeType.CAR)
    }
}

class VehiculeList<T> {
    private _fleet: Array<T> = [];

    get fleet() { return this._fleet; }

    addVehicule(vehicule: T) {
        this._fleet.push(vehicule);
    }

    removeLastEntry() {
        if (this._fleet.length > 0) {
            this._fleet.pop();
        }
    }

    rentVehicule(vehicule: T) {
        this._fleet.splice(this._fleet.indexOf(vehicule), 1);
    }
}

class VehiculeFleet {
    private readonly _cars: VehiculeList<Car> = new VehiculeList<Car>();
    private readonly _buses: VehiculeList<Bus> = new VehiculeList<Bus>();

    get cars() { return this._cars; }
    get buses() { return this._buses; }

    addVehicule<T extends Vehicule>(vehicule: T) {
        if (vehicule.type === VehiculeType.BUS) {
            this._buses.addVehicule(vehicule as Bus);
        } else if (vehicule.type === VehiculeType.CAR) {
            this._cars.addVehicule(vehicule as Car);
        }
    }

    rentVehicule(vehiculeType: VehiculeType) {
        if (vehiculeType === VehiculeType.BUS) {
            this._buses.removeLastEntry();
        } else if (vehiculeType === VehiculeType.CAR) {
            this._cars.removeLastEntry();
        }
    }

    displayFleet() {
        console.log("Cars in fleet:");
        for (let car of this._cars.fleet) {
            console.log(`- ${car.registration}`);
        }

        console.log("Buses in fleet:");
        for (let bus of this._buses.fleet) {
            console.log(`- ${bus.registration}`);
        }
    }

    getVehicules(): Vehicule[] {
        return [...this._cars.fleet, ...this._buses.fleet];
    }

    rentSingleVehicule(registration: string) {
        const vehiculeToRent = this.getVehiculeRegistration(registration);
        if (!vehiculeToRent) {
            throw new Error("Erreur d'immatriculation");
        } 

        if (vehiculeToRent.type === VehiculeType.BUS) {
            this._buses.rentVehicule(vehiculeToRent as Bus);
        } else if (vehiculeToRent.type === VehiculeType.CAR) {
            this._cars.rentVehicule(vehiculeToRent as Car);
        }
    }

    private getVehiculeRegistration(registration: string): Vehicule | null {
        return this.getVehicules().find(v => v.registration === registration) ?? null;
    }
}

const busOne = new Bus("XX-1111-XX");
const busTwo = new Bus("YY-2222-YY");
const busThree = new Bus("ZZ-3333-ZZ");
const carOne = new Car("AA-1111-AA");
const carTwo = new Car("BB-2222-BB");
const carThree = new Car("CC-3333-CC");

const vehiculeFleet = new VehiculeFleet();
vehiculeFleet.displayFleet();
vehiculeFleet.addVehicule(busOne);
vehiculeFleet.addVehicule(busTwo);
vehiculeFleet.addVehicule(busThree);
vehiculeFleet.addVehicule(carOne);
vehiculeFleet.addVehicule(carTwo);
vehiculeFleet.addVehicule(carThree);
vehiculeFleet.displayFleet();

const selectListElement = document.querySelector("#vehicule-list")! as HTMLSelectElement;
function createVehiculeList(): string {
    return vehiculeFleet.getVehicules()
        .map(vehicule => `<option value="${vehicule.registration}">${vehicule.registration} (${vehicule.type})</option>`)
        .join('');
}
selectListElement.innerHTML = createVehiculeList();

const rentButtonElement = document.querySelector("#rent-button")! as HTMLButtonElement;
rentButtonElement.addEventListener("click", () => {
    const selectedRegistration = selectListElement.value;
    vehiculeFleet.rentSingleVehicule(selectedRegistration);
    selectListElement.innerHTML = createVehiculeList();
});