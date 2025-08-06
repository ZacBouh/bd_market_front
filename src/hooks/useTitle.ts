import {  useAtom } from "jotai";
import { titlesAtom } from "@/store";

export function useTitles(){
    const [titles, setTitles] = useAtom(titlesAtom)
    return {titles, setTitles}
}   