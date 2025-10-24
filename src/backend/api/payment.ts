import { api } from "./api"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { store } from "@/store"

type PayParams = {
    requestId: string
}

class UnavailableCopiesError extends Error {
    copyIds: number[]

    constructor(copyIds: number[]) {
        super(`Some items in your cart are no longer available for sale (IDs: ${copyIds.join(', ')})`)
        this.copyIds = copyIds
        this.name = 'UnavailableCopiesError'
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

const getPaymentURL = async ({requestId}: PayParams) => {
    const shoppingCart = store.get(shoppingCartAtom)
    const copyIds = shoppingCart.copies.map(copy => copy.id)

    if (shoppingCart.copies.length <= 0) {
        throw new Error("Shopping cart contains no Copy")
    }

    const unavailableCopyIds = shoppingCart.copies
        .filter(copy => copy.forSale === false)
        .map(copy => copy.id)

    if (unavailableCopyIds.length > 0) {
        throw new UnavailableCopiesError(unavailableCopyIds)
    }

    const response = await api.post<{url: string}>('/payment', {copies: copyIds, requestId})
    return response.data.url
}

const pay = async ({requestId}: PayParams) => {
    const url = await getPaymentURL({requestId})
    window.location.assign(url)
}

export {pay, getPaymentURL, UnavailableCopiesError}
