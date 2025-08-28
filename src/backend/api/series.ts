import { seriesAtom, store } from "@/store";
import { api } from "./api";

const createSeries = (payload : FormData) => {
    const controller = new AbortController()
    return api.post<CreatedSeries>('/series', payload, {signal: controller.signal})
    .then(response => {
        console.log('Create series response' , response.data)
        return response.data
    })
}

const getSeries = () => {
    const controller = new AbortController()
    api.get<CreatedSeries[]>('/series', {signal: controller.signal})
    .then(response => {
         console.log('Get Series response', response.data)
         store.set(seriesAtom, response.data)
    })
    return () => controller.abort()
}

export {createSeries, getSeries}