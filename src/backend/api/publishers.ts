import { api } from "./api";
import { publishersAtom, store } from "@/store";



const createPublisher = async (newPublisher : FormData) => {
    const response = await api.post<CreatedPublisher>('/publishers', newPublisher)
    return response.data
}

const getPublishers = () => {
    const controller = new AbortController()
    api.get<CreatedPublisher[]>('/publishers', {signal: controller.signal})
    .then(response => store.set(publishersAtom, response.data))
    return () => controller.abort()
}

export { createPublisher, getPublishers }

