import { CreatedArtist } from "@/backend/api/artists";
import { atomWithStorage } from "jotai/utils";

const artistsSkillsAtom = atomWithStorage<string[]>('artistsSkills', [])
const artistsAtom = atomWithStorage<CreatedArtist[]>('artists',[])  

export {artistsSkillsAtom, artistsAtom}