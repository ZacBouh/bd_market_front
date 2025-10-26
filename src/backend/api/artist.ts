import { api } from "./api";
import { artistsAtom, artistsSkillsAtom, store } from "@/store";

const createArtist = async (payload : FormData) => {
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

type RemoveArtistOptions = {
    hardDelete?: boolean
}

const removeArtist = async (artistId: CreatedArtist['id'], options?: RemoveArtistOptions) => {
    const response = await api.delete<DeleteResponse>('/artists', {
        data: {
            id: artistId,
            hardDelete: options?.hardDelete ?? false,
        },
    })
    return response.data
}

const updateArtist = async (payload: FormData) => {
    const response = await api.post<ApiResponse>('/artists/update', payload)
    return response.data
}

export {createArtist, getArtistsSkills, getArtists, removeArtist, updateArtist}

