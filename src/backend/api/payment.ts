import { api } from "./api"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { store } from "@/store"
import { isAxiosError } from "axios"

type PayParams = {
    requestId: string
}

type UnavailableCopiesResponse = {
    error?: string
    unavailableCopyIds?: number[]
}

class UnavailableCopiesError extends Error {
    copyIds: number[]

    constructor(message: string, copyIds: number[]) {
        super(message)
        this.copyIds = copyIds
        this.name = "UnavailableCopiesError"
        Object.setPrototypeOf(this, new.target.prototype)
    }
}

const pay = async ({requestId}: PayParams) => {
    const shoppingCart = store.get(shoppingCartAtom)
    const copyIds = shoppingCart.copies.map(copy => copy.id)

    if (shoppingCart.copies.length <= 0) {
        throw new Error("Shopping cart contains no Copy")
    }

    try {
        const response = await api.post<{url: string}>("/payment", {copies: copyIds, requestId})
        window.location.assign(response.data.url)
    } catch (error) {
        if (isAxiosError(error)) {
            const {response} = error
            if (response?.status === 409) {
                const data = response.data as UnavailableCopiesResponse | undefined
                const unavailableCopyIds = Array.isArray(data?.unavailableCopyIds) ? data?.unavailableCopyIds : []
                const message = data?.error ?? "Some items are no longer available for sale."
                throw new UnavailableCopiesError(message, unavailableCopyIds)
            }
        }

        throw error
    }
}

export {pay, UnavailableCopiesError}
