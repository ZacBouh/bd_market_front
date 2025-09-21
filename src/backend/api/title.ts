import { api } from "./api";
import { store, titlesAtom } from "@/store";

export const createTitle = async (payload : FormData) => {
    const response = await api.post<CreatedTitle>('/titles', payload)   
    return response.data
}

export const getTitles = () => {
    const controller = new AbortController()
    api.get<CreatedTitle[]>('/titles')
    .then(response => {
        store.set(titlesAtom, response.data)
        console.log("retrieved Titles", response.data)
    })
    return () => controller.abort()
}

export const findTitles = (titleIds: number[], callback?: (arg: CreatedTitle[]) => unknown) => {
    const controller = new AbortController()
    api.post<CreatedTitle[]>('/title', {titleIds}, {signal: controller.signal})
    .then(response =>{
        callback && callback(response.data)
         console.log("Retrieved titles ", response.data)
    })
    return () => controller.abort()
}