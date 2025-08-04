import { atom } from "jotai";
import type { CreatedPublisher } from "@/backend/api/publishers";

const publishersAtom = atom<CreatedPublisher[]>([])

export {publishersAtom}