import { api } from "./api";

import type { NewArtistContribution, CreatedArtist } from "./artists";
import type { CreatedPublisher } from "./publishers";

export type NewTitle = {
    name: string,
    releaseDate: string | null,
    language: string | null,
    artistsContributions : NewArtistContribution[],
    publisher: CreatedPublisher['id'] | null, 
    description: string
}

export type CreatedTitle = NewTitle & {
    id: number,
    createdAt: string, 
    updatedAt: string 
}

export const createTitle = async (payload : FormData) => {
    const response = await api.post<CreatedTitle>('/titles', payload)   
    return response.data
}

export const getTitles = () => {
    const controller = new AbortController()
    api.get<CreatedTitle>('/titles')
    .then(response => console.log("retrieved Titles", response.data))
    return () => controller.abort()
}