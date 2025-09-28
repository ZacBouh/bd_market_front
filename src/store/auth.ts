import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<LoggedInUser | null>('user', null, undefined, {getOnInit: true})

export const oAuthAtom = atom<any>(null)