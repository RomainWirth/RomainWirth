"use strict";
fetch("https://countries.dev/countries", {
    method: "GET"
}).then((response) => {
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
}).then((countries) => {
    startApplication(countries);
}).catch((error) => {
    console.error("Erreur lors de la récupération des pays:", error);
});
let countriesList = [];
let randomCountry;
function startApplication(data) {
    for (let _country of data) {
        const country = {
            name: _country.translations.fr,
            flag: _country.flags.svg
        };
        countriesList.push(country);
    }
    startGame();
}
function startGame() {
    randomCountry = getRandomCountry(countriesList);
    document.querySelector("#flagToGuess").innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;
    const correctAnswer = randomCountry.name;
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        const randomWrongCountry = getRandomCountry(countriesList);
        if (randomWrongCountry.name !== correctAnswer && !wrongAnswers.includes(randomWrongCountry.name)) {
            wrongAnswers.push(randomWrongCountry.name);
        }
    }
    let allAnswers = [correctAnswer, ...wrongAnswers];
    allAnswers = mixArray(allAnswers);
    document.querySelector('#buttons').innerHTML = generateButtons(allAnswers);
}
function mixArray(array) {
    let randomArray = array;
    // algorithme de `Fisher-Yates`
    for (let i = randomArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    return randomArray;
}
function generateButtons(array) {
    let buttonsHTML = "";
    for (let element of array) {
        buttonsHTML += `<button class="btn btn-primary m-2" onClick="checkAnswer('${element}')">${element}</button>`;
    }
    return buttonsHTML;
}
function checkAnswer(answer) {
    const resultElement = document.querySelector("#result");
    if (answer === randomCountry.name) {
        resultElement.innerHTML = `<p class="alert alert-success">Bonne réponse !</p>`;
    }
    else {
        resultElement.innerHTML = `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;
    }
    resultElement.innerHTML += `<button class="btn btn-secondary mt-2" onClick="startGame()">Nouvelle partie</button>`;
}
function getRandomCountry(countryList) {
    let random = Math.floor(Math.random() * countryList.length);
    return countryList[random];
}
// async function getCountries() {
//   const response = await fetch("https://countries.dev/countries", {
//     method: "GET"
//   });
//   if (!response.ok) {
//     throw new Error(`Erreur HTTP: ${response.status}`);
//   }
//   const countries = await response.json();
//   return countries;
// }
// getCountries().then((countries) => {
//   console.log(countries);
// }).catch((error) => {
//   console.error("Erreur lors de la récupération des pays:", error);
// });
//# sourceMappingURL=main.js.map