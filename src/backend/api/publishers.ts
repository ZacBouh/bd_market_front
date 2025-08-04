import { api } from "./api";
import { publishersAtom, store } from "@/store";

type NewPublisher = {
    name: string,
    birthDate: string | null,
    deathDate: string | null, 
    description: string | null,    
}

type CreatedPublisher = NewPublisher & {
    id: number,
    createdAt: string,
    updatedAt: string
}

const createPublisher = async (newPublisher : NewPublisher) => {
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
export type { NewPublisher, CreatedPublisher }

