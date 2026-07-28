
// JavaScript ES5
// var firstName = "Mario";
// var age = 30;
// var sex = true; // true = homme, false = femme
// var occupation = "Plumber";
// var sport = ["Tenis", "Karting"];
// var address = {
//   street: "123 rue des champs",
//   city: "Paris",
//   zip: "75000"
// };

// function displayCharacter(_firstName, _age, _sex, _occupation, _sports, _address) {
//   console.log("It's me " + _firstName);
//   console.log("I am " + _age + " years old.");
//   console.log("I am a " + (_sex ? "man" : "woman"));
//   console.log("My job is " + _occupation); 
//   for (var sport of _sports) {
//     console.log("I like " + sport);
//   }
//   console.log("I live at : ");
//   console.log(_address.street);
//   console.log(_address.zip);
//   console.log(_address.city);
// }

// JavaScript ES6
let firstName = "Mario";
let age = 30;
let sex = true; // true = homme, false = femme
let occupation = "Plumber";
const sport = ["Tenis", "Karting"];
const address = {
  street: "123 rue des champs",
  city: "Paris",
  zip: "75000"
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
}

displayCharacter(firstName, age, sex, occupation, sport, address);