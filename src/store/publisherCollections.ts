import { atomWithStorage } from "jotai/utils";

const collectionsAtom = atomWithStorage<CreatedPublisherCollection[]>('publisherCollections', [])

export {collectionsAtom}