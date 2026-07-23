enum CurrencyCode {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY"
}

type CurrencyType = {
  name: string;
  code: CurrencyCode;
  symbol: string;
  rate: number;
};

const dollar: CurrencyType = { name: "US Dollar", code: CurrencyCode.USD, symbol: "$", rate: 1 };
const euro: CurrencyType = { name: "Euro", code: CurrencyCode.EUR, symbol: "€", rate: 0.88 };
const pound: CurrencyType = { name: "British Pound", code: CurrencyCode.GBP, symbol: "£", rate: 0.75 };
const yen: CurrencyType = { name: "Japanese Yen", code: CurrencyCode.JPY, symbol: "¥", rate: 163.11 };

const currencies: CurrencyType[] = [dollar, euro, pound, yen];

const sourceCurrencySelect = document.querySelector<HTMLSelectElement>('#sourceCurrency')!;
const targetCurrencySelect = document.querySelector<HTMLSelectElement>('#targetCurrency')!;
const amountInput = document.querySelector('#amount')! as HTMLInputElement;
const resultHTMLElement = document.querySelector('#result')! as HTMLDivElement;
const convertButton = document.querySelector('button[type="submit"]')! as HTMLButtonElement;

const generateCurrencyOptions = (currencies: CurrencyType[]): string => {
    return currencies.map(currency => `<option value="${currency.code}">${currency.name} (${currency.symbol})</option>`).join('');
}

sourceCurrencySelect.innerHTML = generateCurrencyOptions(currencies);
targetCurrencySelect.innerHTML = generateCurrencyOptions(currencies);

const getCurrency = (code: CurrencyCode, currencieList: CurrencyType[]): CurrencyType => {
    const currency = currencieList.find(c => c.code === code);
    if (!currency) {
        throw new Error(`Currency with code ${code} not found`);
    }
    return currency;
};

const calculateResult = (amount: number, sourceCurrencyValue: string, targetCurrencyValue: string): number => {
    const sourceCurrency = getCurrency(sourceCurrencyValue as CurrencyCode, currencies);
    const targetCurrency = getCurrency(targetCurrencyValue as CurrencyCode, currencies);

    if (!sourceCurrency || !targetCurrency) {
        throw new Error(`Source or target currency not found`);
    }

    return (amount * targetCurrency.rate) / sourceCurrency.rate;
}

const displayResultOnClick = (): void => {
    const amount = parseFloat(amountInput.value);
    const sourceCurrencyValue = sourceCurrencySelect.value as CurrencyCode;
    const targetCurrencyValue = targetCurrencySelect.value as CurrencyCode;

    const result = calculateResult(amount, sourceCurrencyValue, targetCurrencyValue);
    resultHTMLElement.innerHTML = `Résultat : ${result.toFixed(2)} ${targetCurrencyValue}`;
}

convertButton.addEventListener('click', (event) => {
    event.preventDefault();
    displayResultOnClick();
});