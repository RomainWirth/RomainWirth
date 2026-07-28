let tab: (number | string)[];
tab = ["Mario", 5];
tab[0] = "Luigi";
tab[1] = 10;

let tabTuple: [string, number] = ["Mario", 10]; // la tableau contient deux éléments : index 0 de type string et index 1 de type number. 
tabTuple[0] = 10; // retourne une erreur : la variable à l'index 0 est de type string.
tabTuple[2] = 12; // retourne une erreur : le tableau a une taille de 2, l'index max est 1.

let tabTriple: [string, number, boolean] = ["Mario", 10, true];
console.log(tabTriple);

const player: (string | number)[] = ["John", 30];
const playerTuple: [number, string] = ["John", 30]; // retourne une erreur : la variable à l'index 0 est de type number et à l'index 1 est de type string.
const playerTupleCorrect: [string, number] = ["John", 30];

const names = ["Mario", "Luigi", "Peach"];
const ages = [30, 25, 28];
const characters: [string, number][] = [
    ["Mario", 30],
    ["Luigi", 25],
    ["Peach", 28]
];

const coordinates: {x: number, y: number}[] = [
    { x: 10, y: 20 },
    { x: 30, y: 40 },
    { x: 50, y: 60 }
];