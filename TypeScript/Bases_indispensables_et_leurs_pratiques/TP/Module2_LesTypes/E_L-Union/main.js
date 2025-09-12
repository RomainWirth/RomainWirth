var firstName = "Mario";
var age = 32;
var sex = true;
var sports = ["tennis", "karting"];
var address = {
    street: "10 rue des lilas",
    city: "Paris",
    zipCode: 75000
};
var information;
information = firstName;
console.log(information);
information = age;
console.log(information);
information = sex;
console.log(information);
var test = function (param) {
    if (typeof param === "string") {
        console.log("C'est une chaîne de caractères");
    }
    else if (typeof param === "number") {
        console.log("C'est un nombre");
    }
    else if (typeof param === "boolean") {
        console.log("C'est un booléen");
    }
};
test(firstName);
test(age);
test(sex);
