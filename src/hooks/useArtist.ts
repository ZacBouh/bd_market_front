import { useAtom } from "jotai";
import { artistsAtom } from "@/store";

export function useArtists(){
    const [artistsList, setArtistsList] = useAtom(artistsAtom)
    return {artistsList, setArtistsList}
}