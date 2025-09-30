import { atomWithStorage } from "jotai/utils";

const shoppingCartAtom = atomWithStorage<{copies: CreatedCopy[]}>('shoppingCart', {copies : []})

export {shoppingCartAtom}