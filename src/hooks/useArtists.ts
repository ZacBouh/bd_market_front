import {  useAtom } from "jotai";
import { artistsAtom } from "@/store";

export function useArtists(){
    const [artists, setArtists] = useAtom(artistsAtom)
    // const addAuthor = (newAuthor : any) => {
    //     if (newAuthor.firstName || newAuthor.pseudo){
    //         const id = crypto.randomUUID()
    //         const newAuthorWithId = {...newAuthor, id}
    //         setArtists((artists) => [...artists, newAuthorWithId ])
    //         return newAuthorWithId
    //     }
    //     return ''
    // }
    return {artists, setArtists}
}   