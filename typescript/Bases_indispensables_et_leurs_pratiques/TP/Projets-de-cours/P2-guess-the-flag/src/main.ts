type Country = {
  name: string;
  flag: string;
}

type ResponseData = {
    translations: {
        fr: string;
        [props: string]: string;
    };
    flags: {
        svg: string;
        png: string;
    };
}

const flagElement = document.querySelector("#flagToGuess") as HTMLDivElement;
const buttonsElement = document.querySelector("#buttons") as HTMLDivElement;
const resultElement = document.querySelector("#result") as HTMLDivElement;

let countriesList: Country[] = [];
let randomCountry: Country;

async function initApplication(): Promise<void> {
    try {
        const response = await fetch("https://countries.dev/countries");
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data: ResponseData[] = await response.json();
        startApplication(data);
    } catch (error) {
        resultElement.innerHTML = `<p class="alert alert-danger">Impossible de charger les pays. Réessaie plus tard.</p>`;
        console.error("Erreur lors de la récupération des pays:", error);
    }
}

function startApplication(data: ResponseData[]) {
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

function getWrongAnswers(correctAnswer: string): string[] {
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < 3) {
        const candidate = getRandomCountry(countriesList).name;
        if (candidate !== correctAnswer && !wrongAnswers.includes(candidate)) {
            wrongAnswers.push(candidate);
        }
    }
    return wrongAnswers;
}

function getRandomCountry(countryList: Country[]): Country {
    let random = Math.floor(Math.random() * countryList.length);
    return countryList[random];
}

function shuffleStringArray(array: string[]): string[] {
    let randomArray = [...array];
    // algorithme de `Fisher-Yates`
    for (let i = randomArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
    }
    return randomArray;
}

function generateButtons(answers: string[]): string {
    return answers
        .map((answer) => `<button class="btn btn-primary m-2" onClick="checkAnswer('${answer}')">${answer}</button>`)
        .join('');
}

function checkAnswer(answer: string): void {
    const message = answer === randomCountry.name
        ? `<p class="alert alert-success">Bonne réponse !</p>`
        : `<p class="alert alert-danger">Mauvaise réponse ! La bonne réponse était : ${randomCountry.name}</p>`;

    resultElement.innerHTML = `${message}<button class="btn btn-secondary mt-2" onClick="startGame()">Nouvelle partie</button>`;
}

initApplication();