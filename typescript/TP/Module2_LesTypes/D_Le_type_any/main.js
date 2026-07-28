var firstName = "Mario";
var age = 32;
var sex = true;
var sports = ["tennis", "karting"];
var address = {
    street: "10 rue des lilas",
    city: "Paris",
    zipCode: 75000
};
var character = [firstName, age, sex];
function displayCharacter(character) {
    for (var _i = 0, character_1 = character; _i < character_1.length; _i++) {
        var value = character_1[_i];
        console.log(value);
    }
}
