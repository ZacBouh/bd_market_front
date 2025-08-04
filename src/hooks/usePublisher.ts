import {  useAtom } from "jotai";
import { publishersAtom } from "@/store";

export function usePublishers(){
    const [publishersList, setPublishersList] = useAtom(publishersAtom)
    return  {publishersList, setPublishersList}
}   
