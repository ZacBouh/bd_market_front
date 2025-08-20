import { api } from "./api";

const createCopy = (newCopy : FormData) => {
    const controller = new AbortController()
    api.post('/copy', newCopy)
    .then(response => {
        console.log("CreateCopy response", response.data)
    })

    return () => controller.abort()
}

const getCopies = (callback: (copies:CreatedCopy[]) => any) => {
    const controller = new AbortController()
    api.get<CreatedCopy[]>('/copy')
    .then(response => {
        console.log("Retrieved User copies : ", response.data)
        callback(response.data)
    })
    return () => controller.abort()
}

export {createCopy, getCopies}