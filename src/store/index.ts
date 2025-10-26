import { createStore } from "jotai";
import { userAtom } from "./auth";
import { artistsSkillsAtom } from "./artists";
import { publishersAtom } from "./publishers";
import { artistsAtom } from "./artists";
import { titlesAtom } from "./titles";
import { copyAtom } from "./copy";
import { seriesAtom } from "./series";
import { collectionsAtom } from "./publisherCollections";
import { ordersAtom } from "./orders";

const store = createStore()

export { store, 
    userAtom, 
    artistsSkillsAtom, 
    publishersAtom, 
    artistsAtom,
    titlesAtom,
    copyAtom,
    seriesAtom,
    collectionsAtom,
    ordersAtom
}