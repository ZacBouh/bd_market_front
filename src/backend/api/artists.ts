import { api } from "./api";
import { artistsAtom, artistsSkillsAtom, store } from "@/store";

export type NewArtist = {
    "firstName": string | null,
    "lastName": string | null,
    "pseudo": string | null,
    "birthDate"?: string | null,
    "deathDate"?: string | null,
    "skills"?: string[]
}

export type CreatedArtist = NewArtist & {
    id: number
}

export type ArtistContribution = {
    artist: CreatedArtist['id']
    skills: string[]
}

const createArtist = async (payload : NewArtist) => {
    const response = await api.post<CreatedArtist>('/artists', payload)
    return response.data
}

const getArtistsSkills = () => {
    const controller = new AbortController()
    api.get<{skills: string[]}>('/skills', {signal: controller.signal})
    .then(response => store.set(artistsSkillsAtom, response.data.skills))
    return () => controller.abort()
}
 
const getArtists = () => {
    const controller = new AbortController()
    api.get<CreatedArtist[]>('/artists', {signal: controller.signal})
    .then(response => {
        store.set(artistsAtom, response.data)
        console.log('retrieved artists : ', response.data)
    })
    return () => controller.abort()
}


export {createArtist, getArtistsSkills, getArtists}
