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

type DeleteResponse<T = void> = {
    message: string
    success: boolean
    data?: T
}