import {  useAtom } from "jotai";
import { publishersAtom } from "@/store";

export function usePublishers(){
    const [publishers, setPublishers] = useAtom(publishersAtom)
    return  {publishers, setPublishers}
}   
