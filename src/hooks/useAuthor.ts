import {  useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const authors = atomWithStorage<any[]>('authors', [])

export function useAuthors(){
    const [authorsList, setAuthorsList] = useAtom(authors)
    const addAuthor = (newAuthor : any) => {
        if (newAuthor.firstName || newAuthor.pseudo){
            const id = crypto.randomUUID()
            const newAuthorWithId = {...newAuthor, id}
            setAuthorsList((authorsList) => [...authorsList, newAuthorWithId ])
            return newAuthorWithId
        }
        return ''
    }
    return {authorsList, setAuthorsList, addAuthor}
}   