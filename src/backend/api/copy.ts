import { copyAtom, store } from "@/store";
import { convertPriceFromApi } from "@/utils/price";
import { api } from "./api";

type CopyWithRawPrices = Omit<CreatedCopy, 'price' | 'boughtForPrice'> & {
    price?: string | number | null,
    boughtForPrice?: string | number | null,
};

type CopyDetailResponse = CopyWithRawPrices & {
    uploadedImages?: UploadedImage[],
};

const normalizeCopy = (copy: CopyWithRawPrices): CreatedCopy => ({
    ...copy,
    price: convertPriceFromApi(copy.price),
    boughtForPrice: convertPriceFromApi(copy.boughtForPrice),
});

const normalizeCopyDetail = (copy: CopyDetailResponse): DetailedCopy => ({
    ...normalizeCopy(copy),
    uploadedImages: copy.uploadedImages,
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

type RemoveCopyOptions = {
    hardDelete?: boolean
}

export type GetCopiesForSaleParams = {
    limit?: number
    offset?: number
    copyCondition?: CopyCondition
    minPrice?: number
    maxPrice?: number
    currency?: string
    titlePublisher?: string
    titleName?: string
    titleIsbn?: string
    order?: 'ASC' | 'DESC'
}

const removeCopy = async (
    copyId : CreatedCopy['id'],
    options?: RemoveCopyOptions,
    callback?: (arg?: DeleteResponse) => unknown
) => {
    const response = await api.delete<DeleteResponse>('/copy', {
        data: {
            id: copyId,
            hardDelete: options?.hardDelete ?? false,
        },
    })
    callback?.(response.data)
    return response.data
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

const getCopiesForSale = (params?: GetCopiesForSaleParams, callback?: (copies?: CreatedCopy[]) => unknown) => {
    const controller = new AbortController()
    api.get<CopyWithRawPrices[]>('/copy/for-sale', {
        params,
        signal: controller.signal,
    })
        .then((result) => {
            if (callback) {
                callback(result.data.map(normalizeCopy))
            }
        })
    return () => controller.abort()
}

const getCopyById = async (
    copyId: number,
    options?: { signal?: AbortSignal },
) => {
    const response = await api.get<CopyDetailResponse>(`/copy/${copyId}`, {
        signal: options?.signal,
    })
    return normalizeCopyDetail(response.data)
}

export {createCopy, getCopies, removeCopy, updateCopy, searchCopy, getCopiesForSale, getCopyById}
