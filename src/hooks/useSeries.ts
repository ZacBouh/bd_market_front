import { useAtom } from "jotai";
import { seriesAtom } from "@/store";

export function useSeries(){
    const [series, setSeries] = useAtom(seriesAtom)
    return [series, setSeries] as const
}