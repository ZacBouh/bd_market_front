import { LoggedInUser } from "@/backend/api/auth";
import { atomWithStorage } from "jotai/utils";

export const userAtom = atomWithStorage<LoggedInUser | null>('user', null)

