import { collectionsAtom } from "@/store";
import { useAtom } from "jotai";

const useCollections = () => {
    const [collections, setCollections] = useAtom(collectionsAtom)
    return [collections, setCollections] as const
}

export {useCollections}