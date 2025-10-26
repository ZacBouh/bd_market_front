import { copyAtom, store } from "@/store";
import { convertPriceFromApi } from "@/utils/price";
import { api } from "./api";

type CopyWithRawPrices = Omit<CreatedCopy, 'price' | 'boughtForPrice'> & {
    price?: string | number | null,
    boughtForPrice?: string | number | null,
};

const normalizeCopy = (copy: CopyWithRawPrices): CreatedCopy => ({
    ...copy,
    price: convertPriceFromApi(copy.price),
    boughtForPrice: convertPriceFromApi(copy.boughtForPrice),
});

const createCopy = (newCopy : FormData, callback?: (copy: CreatedCopy) => unknown) => {
    const controller = new AbortController()
    api.post<CopyWithRawPrices>('/copy', newCopy)
    .then(response => {
        console.log("CreateCopy response", response.data)
        const createdCopy = normalizeCopy(response.data)
        getCopies()
        if (callback) {
            callback(createdCopy)
        }
    })
    return () => controller.abort()
}

const getCopies = (callback?: (copies:CreatedCopy[]) => unknown) => {
    const controller = new AbortController()
    api.get<CopyWithRawPrices[]>('/copy')
    .then(response => {
        console.log("Retrieved User copies : ", response.data)
        const copies = response.data.map(normalizeCopy)
        store.set(copyAtom, copies)
        if (callback) {
            callback(copies)
        }
    })
    return () => controller.abort()
}

const removeCopy = (copyId : CreatedCopy['id'] , callback?: (arg?: DeleteResponse) => unknown) => {
    const controller = new AbortController()
    api.delete<DeleteResponse>('/copy', {data: {id: copyId}})
    .then(response =>{
        if (callback) {
            callback(response.data)
        }
    })
    return () => controller.abort()
}

const updateCopy = (updatedCopy: FormData, callback?: (copy: ApiResponse) => unknown ) => {
    const controller = new AbortController()
    api.post<ApiResponse>('/copy/update', updatedCopy, {signal: controller.signal})
    .then(response => {
        console.log("Update copy response" , response.data)
        if (callback) {
            callback(response.data)
        }
        getCopies()
    })
    return () => controller.abort()
}

export type SearchCopyParams = {
    query: string
    forSale?: boolean
    limit?: number
    offset?: number
}

const searchCopy = ( params: SearchCopyParams, callback?: (copies?: CreatedCopy[]) => unknown ) => {
    const controller = new AbortController()
    api.get<CopyWithRawPrices[]>('/copy/search', {
        params,
        signal: controller.signal
    })
    .then(result => {
        if (callback) {
            callback(result.data.map(normalizeCopy))
        }
    })
    return () => controller.abort()
}

export {createCopy, getCopies, removeCopy, updateCopy, searchCopy}