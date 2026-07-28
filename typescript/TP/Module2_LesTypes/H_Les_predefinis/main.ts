type Coordinates = {x: number, y: number}[];
type Address = {
    street: string;
    city: string;
    country: string;
    gps?: { lat: number; lng: number }
};

const coordinates: Coordinates = [
    { x: 10, y: 20 },
    { x: 30, y: 40 }
];

const address: Address = {
    street: "123 Main St",
    city: "Anytown",
    country: "USA",
    gps: { lat: coordinates[0].x, lng: coordinates[0].y }
};

console.log("Coordinates:", coordinates);
console.log("Address:", address);