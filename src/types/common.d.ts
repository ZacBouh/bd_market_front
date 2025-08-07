type AutoCompleteFieldState<T> = {
    inputValue : string,
    prevInputValue: string,
    value: T | null,
    modalOpen: boolean
}

type AcceptedCurrency = 'euro'

type Price = {
    amount: string,
    currency: AcceptedCurrency
}