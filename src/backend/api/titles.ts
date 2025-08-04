import { api } from "./api";

import type { CreatedArtist } from "./artists";

type NewTitle = {
    name: string,
    releaseDate: string | null,
    description: string | null,
    language: string | null,
    artists: CreatedArtist['id'][]
}

type CreatedTitle = NewTitle & {
    id: number,
    createdAt: string, 
    updatedAt: string 
}

const createTitle = async (payload : NewTitle) => {
    const response = await api.post<CreatedTitle>('/titles', payload)   
    return response.data
}