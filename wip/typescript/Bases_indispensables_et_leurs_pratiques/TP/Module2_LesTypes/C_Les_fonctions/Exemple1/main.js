// déclaration de variables :
let firstName = "Mario";
let age = 30;
let sex = true; // true = homme, false = femme
let occupation = "Plumber";
const sport = ["Tenis", "Karting"];
const address = {
    street: "123 rue des champs",
    city: "Paris",
    zip: 75000
};
const displayCharacter = (_firstName, _age, _sex, _occupation, _sports, _address) => {
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
};
displayCharacter(firstName, age, sex, occupation, sport, address);
const birthday = (_age = 17) => {
    return _age + 1;
};
let newAge;
newAge = birthday(age);
console.log("new age : " + newAge);
newAge = birthday();
console.log("new age : " + newAge);
