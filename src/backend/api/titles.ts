import { api } from "./api";

import type { ArtistContribution, CreatedArtist } from "./artists";
import type { CreatedPublisher } from "./publishers";

export type NewTitle = {
    name: string,
    releaseDate: string | null,
    language: string | null,
    artistsContributions : ArtistContribution[],
    publisher: CreatedPublisher['id'] | null, 
    description: string
}

export type CreatedTitle = NewTitle & {
    id: number,
    createdAt: string, 
    updatedAt: string 
}

export const createTitle = async (payload : NewTitle) => {
    const response = await api.post<CreatedTitle>('/titles', payload)   
    return response.data
}