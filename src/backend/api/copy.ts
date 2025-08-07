import { api } from "./api";

const createCopy = (newCopy : FormData) => {
    const controller = new AbortController()
    api.post('/copy', newCopy)
    .then(response => {
        console.log("CreateCopy response", response.data)
    })

    return () => controller.abort()
}

export {createCopy}