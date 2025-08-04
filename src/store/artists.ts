import { atomWithStorage } from "jotai/utils";

const artistsSkillsAtom = atomWithStorage<string[]>('artistsSkilss', [])

export {artistsSkillsAtom}