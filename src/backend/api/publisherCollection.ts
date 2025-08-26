import { create } from "domain";
import { api } from "./api";

const createPublisherCollection = (newCollection : FormData) => {
    const controller = new AbortController()
    api.post<ApiResponse>('/collections', newCollection, {signal: controller.signal})
    .then(response => console.log('Create Publisher Collection response ', response.data))
}

export {createPublisherCollection}