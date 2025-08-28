import { api } from "./api";

const createPublisherCollection = (newCollection : FormData) => {
    const controller = new AbortController()
    api.post<ApiResponse>('/collections', newCollection, {signal: controller.signal})
    .then(response => console.log('Create Publisher Collection response ', response.data))
}

const getPublisherCollections = (callback?: (data: CreatedPublisherCollection[]) => unknown) => {
    const controller = new AbortController()
    api.get<CreatedPublisherCollection[]>('/collections', {signal: controller.signal})
    .then(response =>{
        console.info('Retrieved PublisherCollections ', response.data)
        callback && callback(response.data)
    })
    return () => controller.abort()
}

export {createPublisherCollection, getPublisherCollections}