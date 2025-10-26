import { api } from "./api";
import { publishersAtom, store } from "@/store";



const createPublisher = async (newPublisher : FormData) => {
    const response = await api.post<CreatedPublisher>('/publishers', newPublisher)
    return response.data
}

const getPublishers = () => {
    const controller = new AbortController()
    api.get<CreatedPublisher[]>('/publishers', {signal: controller.signal})
    .then(response =>{
        console.log("Retrieved Publishers : ", response.data)
        store.set(publishersAtom, response.data)
    })
    return () => controller.abort()
}

type RemovePublisherOptions = {
    hardDelete?: boolean
}

const removePublisher = async (publisherId: CreatedPublisher['id'], options?: RemovePublisherOptions) => {
    const response = await api.delete<DeleteResponse>('/publishers', {
        data: {
            id: publisherId,
            hardDelete: options?.hardDelete ?? false,
        },
    })
    return response.data
}

const updatePublisher = async (payload: FormData) => {
    const response = await api.post<ApiResponse>('/publishers/update', payload)
    return response.data
}

export { createPublisher, getPublishers, removePublisher, updatePublisher }

