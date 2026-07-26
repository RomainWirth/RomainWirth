let firstName = "Mario";
let age = 32;
let sex = true;
const sports = ["tennis", "karting"];
const address = {
  street: "10 rue des lilas",
  city: "Paris",
  zipCode: 75000,
};

const character = [firstName, age, sex];

function displayCharacter(character: any[]): void {
  for (let value of character) {
    console.log(value);
  }
}