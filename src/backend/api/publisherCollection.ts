import { api } from "./api";
import { collectionsAtom, store } from "@/store";

const createPublisherCollection = async (newCollection : FormData) => {
    const controller = new AbortController()
    const response = await api.post<ApiResponse>('/collections', newCollection, {signal: controller.signal})
    console.log('Create Publisher Collection response ', response.data)
    return response.data
}

const getPublisherCollections = (callback?: (data: CreatedPublisherCollection[]) => unknown) => {
    const controller = new AbortController()
    api.get<CreatedPublisherCollection[]>('/collections', {signal: controller.signal})
    .then(response =>{
        console.info('Retrieved PublisherCollections ', response.data)
        store.set(collectionsAtom, response.data)
        callback && callback(response.data)
    })
    return () => controller.abort()
}

type RemoveCollectionOptions = {
    hardDelete?: boolean
}

const removePublisherCollection = async (collectionId: CreatedPublisherCollection['id'], options?: RemoveCollectionOptions) => {
    const response = await api.delete<DeleteResponse>('/collections', {
        data: {
            id: collectionId,
            hardDelete: options?.hardDelete ?? false,
        },
    })
    return response.data
}

const updatePublisherCollection = async (payload: FormData) => {
    const response = await api.post<ApiResponse>('/collections/update', payload)
    return response.data
}

export {createPublisherCollection, getPublisherCollections, removePublisherCollection, updatePublisherCollection}
