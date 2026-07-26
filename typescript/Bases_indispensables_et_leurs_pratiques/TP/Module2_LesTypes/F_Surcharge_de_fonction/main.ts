let firstName = "Mario";
let age = 30;
let sex = true; // true = homme, false = femme
let occupation = "Plumber";
let sport = ["Tenis", "Karting"];
let address = {
    street: "123 rue des champs",
    city: "Paris",
    zip: 75000
};

function add(e1: number, e2: number): number;
function add(e1: string, e2: string): string;
function add(e1: number | string, e2: number | string): number | string {
  if (typeof e1 === 'number' && typeof e2 === 'number') {
    return e1 + e2;
  }

  return e1.toString() + " " + e2.toString();
}

let sum = add(5, 10); // sum = 15
console.log(Math.floor(sum)); // Affiche 15

let concatenation = add("Mario", "Bros."); // concatenation = "Mario Bros."
console.log(concatenation.toUpperCase()); // Affiche "MARIO BROS."

let test = add(5, "Bros."); // test ne fonctionnera pas car les types ne sont pas compatibles, mais TypeScript permet de le faire grâce à la surcharge de fonction. 