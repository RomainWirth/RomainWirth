// déclaration de variables :
let firstName: string = "Mario";
let age: number = 30;
let sex: boolean = true; // true = homme, false = femme
let occupation: string = "Plumber";
const sport: Array<string> | string[] = ["Tenis", "Karting"];
const address: {
  street: string; 
  city: string; 
  zip: number
} = {
  street: "123 rue des champs",
  city: "Paris",
  zip: 75000
};

const displayCharacter = (
  _firstName: string, 
  _age: number, 
  _sex: boolean, 
  _occupation: string, 
  _sports: Array<string> | string[], 
  _address: {
    street: string; 
    city: string; 
    zip: number
  },
): void => {
  console.log(`
    It's me ${_firstName},
    I am ${_age} years old ${(_sex ? "man" : "woman")}.
    My job is ${_occupation}.
    I like ${_sports[0]} and ${_sports[1]}.
    I live at :
    ${_address.street},
    ${_address.zip}
    ${_address.city}
  `);
}

displayCharacter(firstName, age, sex, occupation, sport, address);

const birthday = (_age: number = 17): number => {
  return _age + 1;
}

const myCallback = (result: number): void => {
  console.log(`Result is : ${result}.`);
}
const myOtherCallback = (result: number): void => {
  console.log(`Result multiplied by 2 is : ${result * 2}.`);
}

const displayAddNumbers = (_n1: number, _n2: number, callback: (_n: number) => void): void => {
  const result = _n1 + _n2;
  callback(result);
}

displayAddNumbers(10, 15, myCallback);