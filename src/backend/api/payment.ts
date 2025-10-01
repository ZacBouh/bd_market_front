import { api } from "./api";
import { shoppingCartAtom } from "@/store/shoppingCart";
import { store } from "@/store";

const pay = (callback?: () => unknown) => {
    const shoppingCart = store.get(shoppingCartAtom)
    const controller = new AbortController()
    const copyIds = shoppingCart.copies.map(copy => copy.id)
    if(shoppingCart.copies.length <= 0) {
        throw new Error("Shopping cart contains no Copy")
    }
    api.post<{url: string}>('/payment', {copies : copyIds}, {signal: controller.signal})
    .then(response => window.location.assign(response.data.url) )
    return () => controller.abort()
}

export {pay}