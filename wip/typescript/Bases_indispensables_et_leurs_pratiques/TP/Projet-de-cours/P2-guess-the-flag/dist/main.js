"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const flagElement = document.querySelector("#flagToGuess");
const buttonsElement = document.querySelector("#buttons");
const resultElement = document.querySelector("#result");
let countriesList = [];
let randomCountry;
function initApplication() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://countries.dev/countries");
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = yield response.json();
            startApplication(data);
        }
        catch (error) {
            resultElement.innerHTML = `<p class="alert alert-danger">Impossible de charger les pays. Réessaie plus tard.</p>`;
            console.error("Erreur lors de la récupération des pays:", error);
        }
    });
}
function startApplication(data) {
    countriesList = data.map((_country) => ({
        name: _country.translations.fr,
        flag: _country.flags.svg
    }));
    startGame();
}
function startGame() {
    randomCountry = getRandomCountry(countriesList);
    flagElement.innerHTML = `<img src="${randomCountry.flag}" alt="Drapeau du pays à deviner" width="200" class="border border-dark">`;
    const wrongAnswers = getWrongAnswers(randomCountry.name);
    const allAnswers = shuffleStringArray([randomCountry.name, ...wrongAnswers]);
    buttonsElement.innerHTML = generateButtons(allAnswers);
}
function getWrongAnswers(correctAnswer) {
    const wrongAnswers = [];
    while (wrongAnswers.length < 3) {
        const candidate = getRandomCountry(countriesList).name;
        if (candidate !== correctAnswer && !wrongAnswers.includes(candidate)) {
            wrongAnswers.push(candidate);
        }
    }
    return wrongAnswers;
}
function getRandomCountry(countryList) {
    let random = Math.floor(Math.random() * countryList.length);
    return countryList[random];
}
function shuffleStringArray(array) {
    let randomArray = [...array];
    // algorithme de `Fisher-Yates`
    for (let i = randomArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    return randomArray;
}
function generateButtons(answers) {
    return answers
        .map((answer) => `<button class="btn btn-primary m-2" onClick="checkAnswer('${answer}')">${answer}</button>`)
        .join('');
}
function checkAnswer(answer) {
    const message = answer === randomCountry.name
        ? `<p class="alert alert-success">Bonne réponse !</p>`
        : `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;
    resultElement.innerHTML = `${message}<button class="btn btn-secondary mt-2" onClick="startGame()">Nouvelle partie</button>`;
}
initApplication();
//# sourceMappingURL=main.js.map