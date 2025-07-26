import {  useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const titles = atomWithStorage<any[]>('authors', [])

export function useTitles(){
    const [titlesList, setTitlesList] = useAtom(titles)
    return {titlesList, setTitlesList}
}   