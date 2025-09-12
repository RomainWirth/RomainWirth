// déclaration de variables :
var firstName = "Mario";
var age = 30;
var sex = true; // true = homme, false = femme
var occupation = "Plumber";
var sport = ["Tenis", "Karting"];
var address = {
    street: "123 rue des champs",
    city: "Paris",
    zip: 75000
};
var displayCharacter = function (_firstName, _age, _sex, _occupation, _sports, _address) {
    console.log("\n    It's me ".concat(_firstName, ",\n    I am ").concat(_age, " years old ").concat((_sex ? "man" : "woman"), ".\n    My job is ").concat(_occupation, ".\n    I like ").concat(_sports[0], " and ").concat(_sports[1], ".\n    I live at :\n    ").concat(_address.street, ",\n    ").concat(_address.zip, "\n    ").concat(_address.city, "\n  "));
};
displayCharacter(firstName, age, sex, occupation, sport, address);
