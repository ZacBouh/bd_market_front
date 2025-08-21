import { copyAtom } from "@/store";
import { useAtom } from "jotai";

export function useCopy(){
    const [copies, setCopies] = useAtom(copyAtom)
    return {copies, setCopies}
}