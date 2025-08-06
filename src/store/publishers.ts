import { atom } from "jotai";

const publishersAtom = atom<CreatedPublisher[]>([])

export {publishersAtom}