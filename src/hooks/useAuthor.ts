import {  useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const authors = atomWithStorage<any[]>('authors', [])

export function useAuthors(){
    const [authorsList, setAuthorsList] = useAtom(authors)
    return {authorsList, setAuthorsList}
}   