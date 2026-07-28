"use strict";
var CurrencyCode;
(function (CurrencyCode) {
    CurrencyCode["USD"] = "USD";
    CurrencyCode["EUR"] = "EUR";
    CurrencyCode["GBP"] = "GBP";
    CurrencyCode["JPY"] = "JPY";
})(CurrencyCode || (CurrencyCode = {}));
var CurrencySymbol;
(function (CurrencySymbol) {
    CurrencySymbol["USD"] = "$";
    CurrencySymbol["EUR"] = "\u20AC";
    CurrencySymbol["GBP"] = "\u00A3";
    CurrencySymbol["JPY"] = "\u00A5";
})(CurrencySymbol || (CurrencySymbol = {}));
var CurrencyName;
(function (CurrencyName) {
    CurrencyName["USD"] = "US Dollar";
    CurrencyName["EUR"] = "Euro";
    CurrencyName["GBP"] = "British Pound";
    CurrencyName["JPY"] = "Japanese Yen";
})(CurrencyName || (CurrencyName = {}));
var CurrencyRate;
(function (CurrencyRate) {
    CurrencyRate[CurrencyRate["USD"] = 1] = "USD";
    CurrencyRate[CurrencyRate["EUR"] = 0.88] = "EUR";
    CurrencyRate[CurrencyRate["GBP"] = 0.75] = "GBP";
    CurrencyRate[CurrencyRate["JPY"] = 163.11] = "JPY";
})(CurrencyRate || (CurrencyRate = {}));
const dollar = {
    name: CurrencyName.USD,
    code: CurrencyCode.USD,
    symbol: CurrencySymbol.USD,
    rate: CurrencyRate.USD
};
const euro = {
    name: CurrencyName.EUR,
    code: CurrencyCode.EUR,
    symbol: CurrencySymbol.EUR,
    rate: CurrencyRate.EUR
};
const pound = {
    name: CurrencyName.GBP,
    code: CurrencyCode.GBP,
    symbol: CurrencySymbol.GBP,
    rate: CurrencyRate.GBP
};
const yen = {
    name: CurrencyName.JPY,
    code: CurrencyCode.JPY,
    symbol: CurrencySymbol.JPY,
    rate: CurrencyRate.JPY
};
const currencies = [dollar, euro, pound, yen];
const generateCurrencyOptions = (currencies) => {
    return currencies.map(currency => `<option value="${currency.code}">${currency.name} (${currency.symbol})</option>`).join('');
};
const sourceCurrencySelect = document.querySelector('#sourceCurrency');
sourceCurrencySelect.innerHTML = generateCurrencyOptions(currencies);
const targetCurrencySelect = document.querySelector('#targetCurrency');
targetCurrencySelect.innerHTML = generateCurrencyOptions(currencies);
const getCurrencyCode = (currencyInputValue) => {
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
function calculateResult(amount, sourceCurrencyValue, targetCurrencyValue) {
    const sourceCurrencyCode = getCurrencyCode(sourceCurrencyValue);
    const targetCurrencyCode = getCurrencyCode(targetCurrencyValue);
    const sourceCurrency = currencies.find(currency => currency.code === sourceCurrencyCode);
    const targetCurrency = currencies.find(currency => currency.code === targetCurrencyCode);
    if (!sourceCurrency || !targetCurrency) {
        throw new Error(`Source or target currency not found`);
    }
    return (amount * targetCurrency.rate) / sourceCurrency.rate;
}
const displayResultOnClick = (amount) => {
    const result = calculateResult(amount, sourceCurrencySelectValue, targetCurrencySelectValue);
    resultHTMLElement.innerHTML = `Résultat : ${result.toFixed(2)} ${targetCurrencySelectValue}`;
};
let sourceCurrencySelectValue = sourceCurrencySelect.value;
sourceCurrencySelect.addEventListener('change', () => {
    sourceCurrencySelectValue = sourceCurrencySelect.value;
});
let targetCurrencySelectValue = targetCurrencySelect.value;
targetCurrencySelect.addEventListener('change', () => {
    targetCurrencySelectValue = targetCurrencySelect.value;
});
let amount = 0;
const amountInput = document.querySelector('#amount');
amountInput.addEventListener('keyup', () => {
    amount = parseFloat(amountInput.value);
});
const resultHTMLElement = document.querySelector('#result');
const convertButton = document.querySelector('button[type="submit"]');
convertButton.addEventListener('click', (event) => {
    event.preventDefault();
    displayResultOnClick(amount);
});
//# sourceMappingURL=main.js.map