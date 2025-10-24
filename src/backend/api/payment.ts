import { api } from "./api"
import { shoppingCartAtom } from "@/store/shoppingCart"
import { store } from "@/store"

type PayParams = {
    requestId: string
}

const pay = async ({requestId}: PayParams) => {
    const shoppingCart = store.get(shoppingCartAtom)
    const copyIds = shoppingCart.copies.map(copy => copy.id)

    if (shoppingCart.copies.length <= 0) {
        throw new Error("Shopping cart contains no Copy")
    }

    const response = await api.post<{url: string}>('/payment', {copies: copyIds, requestId})
    window.location.assign(response.data.url)
}

export {pay}
