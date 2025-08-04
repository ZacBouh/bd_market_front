import { createStore } from "jotai";
import { userAtom } from "./auth";
import { artistsSkillsAtom } from "./artists";
import { publishersAtom } from "./publishers";
import { artistsAtom } from "./artists";

const store = createStore()

export { store, userAtom, artistsSkillsAtom, publishersAtom, artistsAtom }