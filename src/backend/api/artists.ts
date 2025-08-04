import { api } from "./api";
import { artistsSkillsAtom, store } from "@/store";

type NewArtist = {
    "firstName": string | null,
    "lastName": string | null,
    "pseudo": string | null,
    "birthDate"?: string | null,
    "deathDate"?: string | null,
    "skills"?: string[]
}

type CreatedArtist = NewArtist & {
    id: number
}

const createArtist = async (payload : NewArtist) => {
    const response = await api.post<CreatedArtist>('/artists', payload)
    return response.data
}

const getArtistsSkills = async () => {
    const response = await api.get<{skills: string[]}>('/skills')
    store.set(artistsSkillsAtom, response.data.skills)
    return response.data
}

export {createArtist, getArtistsSkills}

export type { CreatedArtist }