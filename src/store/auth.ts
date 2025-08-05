import { LoggedInUser } from "@/backend/api/auth";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<LoggedInUser | null>('user', null)

export const oAuthAtom = atom<any>(null)