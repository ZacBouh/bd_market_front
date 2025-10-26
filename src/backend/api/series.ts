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

type RemoveSeriesOptions = {
    hardDelete?: boolean
}

const removeSeries = async (seriesId: CreatedSeries['id'], options?: RemoveSeriesOptions) => {
    const response = await api.delete<DeleteResponse>('/series', {
        data: {
            id: seriesId,
            hardDelete: options?.hardDelete ?? false,
        },
    })
    return response.data
}

const updateSeries = async (payload: FormData) => {
    const response = await api.post<ApiResponse>('/series/update', payload)
    return response.data
}

export {createSeries, getSeries, removeSeries, updateSeries}
