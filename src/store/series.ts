import { atomWithStorage } from "jotai/utils";

const seriesAtom = atomWithStorage<CreatedSeries[]>('series', [])

export {seriesAtom}