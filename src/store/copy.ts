import { atomWithStorage } from "jotai/utils";

const copyAtom = atomWithStorage<CreatedCopy[]>('copies', [])

export {copyAtom}