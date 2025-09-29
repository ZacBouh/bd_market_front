import { copyAtom, store } from "@/store";
import { api } from "./api";

const createCopy = (newCopy : FormData, callback?: (copy: CreatedCopy) => unknown) => {
    const controller = new AbortController()
    api.post<CreatedCopy>('/copy', newCopy)
    .then(response => {
        console.log("CreateCopy response", response.data)
        getCopies()
        callback && callback(response.data)
    })

    return () => controller.abort()
}

const getCopies = (callback?: (copies:CreatedCopy[]) => any) => {
    const controller = new AbortController()
    api.get<CreatedCopy[]>('/copy')
    .then(response => {
        console.log("Retrieved User copies : ", response.data)
        store.set(copyAtom, response.data)
        callback && callback(response.data)
    })
    return () => controller.abort()
}

const removeCopy = (copyId : CreatedCopy['id'] , callback?: (arg?: DeleteResponse) => any) => {
    const controller = new AbortController()
    api.delete<DeleteResponse>('/copy', {data: {id: copyId}})
    .then(response =>{
        callback && callback(response.data)
    })
    return () => controller.abort()
}

const updateCopy = (updatedCopy: FormData) => {
    const controller = new AbortController()
    api.post<ApiResponse>('/copy/update', updatedCopy)
    .then(response => {
        console.log("Update copy response" , response.data)
        getCopies()
    })
    return () => controller.abort()
}

export {createCopy, getCopies, removeCopy, updateCopy}