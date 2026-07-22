type CurrencyType = {
    name: CurrencyName;
    code: CurrencyCode;
    symbol: CurrencySymbol;
    rate: CurrencyRate;
}

enum CurrencyCode {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY"
}

enum CurrencySymbol {
    USD = "$",
    EUR = "€",
    GBP = "£",
    JPY = "¥"
}

enum CurrencyName {
    USD = "US Dollar",
    EUR = "Euro",
    GBP = "British Pound",
    JPY = "Japanese Yen"
}

enum CurrencyRate {
    USD = 1,
    EUR = 0.88,
    GBP = 0.75,
    JPY = 163.11
}

const dollar: CurrencyType = {
    name: CurrencyName.USD,
    code: CurrencyCode.USD,
    symbol: CurrencySymbol.USD,
    rate: CurrencyRate.USD
};
const euro: CurrencyType = {
    name: CurrencyName.EUR,
    code: CurrencyCode.EUR,
    symbol: CurrencySymbol.EUR,
    rate: CurrencyRate.EUR
};
const pound: CurrencyType = {
    name: CurrencyName.GBP,
    code: CurrencyCode.GBP,
    symbol: CurrencySymbol.GBP,
    rate: CurrencyRate.GBP
};
const yen: CurrencyType = {
    name: CurrencyName.JPY,
    code: CurrencyCode.JPY,
    symbol: CurrencySymbol.JPY,
    rate: CurrencyRate.JPY
};

const currencies: CurrencyType[] = [dollar, euro, pound, yen];

const generateCurrencyOptions = (currencies: CurrencyType[]): string => {
    return currencies.map(currency => `<option value="${currency.code}">${currency.name} (${currency.symbol})</option>`).join('');
}

const sourceCurrencySelect = document.querySelector<HTMLSelectElement>('#sourceCurrency')!;
sourceCurrencySelect.innerHTML = generateCurrencyOptions(currencies);

const targetCurrencySelect = document.querySelector<HTMLSelectElement>('#targetCurrency')!;
targetCurrencySelect.innerHTML = generateCurrencyOptions(currencies);

const getCurrencyCode = (currencyInputValue: string): CurrencyCode => {
    switch (currencyInputValue) {
        case "USD":
            return CurrencyCode.USD;
        case "EUR":
            return CurrencyCode.EUR;
        case "GBP":
            return CurrencyCode.GBP;
        case "JPY":
            return CurrencyCode.JPY;
        default:
            throw new Error(`Unsupported currency code: ${currencyInputValue}`);
    }
};

function calculateResult(amount: number, sourceCurrencyValue: string, targetCurrencyValue: string): number {
    const sourceCurrencyCode = getCurrencyCode(sourceCurrencyValue);
    const targetCurrencyCode = getCurrencyCode(targetCurrencyValue);

    const sourceCurrency = currencies.find(currency => currency.code === sourceCurrencyCode);
    const targetCurrency = currencies.find(currency => currency.code === targetCurrencyCode);

    if (!sourceCurrency || !targetCurrency) {
        throw new Error(`Source or target currency not found`);
    }

    return (amount * targetCurrency.rate) / sourceCurrency.rate;
}

const displayResultOnClick = (amount: number): void => {
    const result = calculateResult(amount, sourceCurrencySelectValue, targetCurrencySelectValue);
    resultHTMLElement.innerHTML = `Résultat : ${result.toFixed(2)} ${targetCurrencySelectValue}`;
}

let sourceCurrencySelectValue: string = sourceCurrencySelect.value;
sourceCurrencySelect.addEventListener('change', () => {
    sourceCurrencySelectValue = sourceCurrencySelect.value;
});
let targetCurrencySelectValue: string = targetCurrencySelect.value;
targetCurrencySelect.addEventListener('change', () => {
    targetCurrencySelectValue = targetCurrencySelect.value;
});

let amount: number = 0;
const amountInput = document.querySelector('#amount')! as HTMLInputElement;
amountInput.addEventListener('keyup', () => {
    amount = parseFloat(amountInput.value);
});

const resultHTMLElement = document.querySelector('#result')! as HTMLDivElement;
const convertButton = document.querySelector('button[type="submit"]')! as HTMLButtonElement;
convertButton.addEventListener('click', (event) => {
    event.preventDefault();
    displayResultOnClick(amount);
});
