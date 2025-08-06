import { atomWithStorage } from "jotai/utils";

const titlesAtom = atomWithStorage<CreatedTitle[]>('authors', [])

export {titlesAtom}