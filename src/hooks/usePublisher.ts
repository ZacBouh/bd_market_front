import {  useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const publishers = atomWithStorage<any[]>('publishers', [])

export function usePublishers(){
    const [publishersList, setPublishersList] = useAtom(publishers)
    return { publishersList, setPublishersList}
}   