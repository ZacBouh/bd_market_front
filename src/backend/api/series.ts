import { api } from "./api";

const createSeries = (payload : FormData) => {
    const controller = new AbortController()
    api.post('/series', payload, {signal: controller.signal})
    .then(response => console.log('Create series response' , response.data))
}

export {createSeries}