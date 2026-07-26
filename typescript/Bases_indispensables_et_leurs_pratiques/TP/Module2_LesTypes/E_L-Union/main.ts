let firstName = "Mario";
let age = 32;
let sex = true;
const sports = ["tennis", "karting"];
const address = {
  street: "10 rue des lilas",
  city: "Paris",
  zipCode: 75000,
};

let information: string | number | boolean;

information = firstName;
console.log(information);

information = age;
console.log(information);

information = sex;
console.log(information);

const test = (param: string | number | boolean): void => {
  if (typeof param === "string") {
    console.log("C'est une chaîne de caractères");
  } else if (typeof param === "number") {
    console.log("C'est un nombre");
  } else if (typeof param === "boolean") {
    console.log("C'est un booléen");
  }
};

test(firstName);
test(age);
test(sex);