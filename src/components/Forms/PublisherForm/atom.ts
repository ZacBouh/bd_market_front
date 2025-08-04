import { atom } from "jotai";
import type { NewPublisher } from "@/backend/api/publishers";

const initialState : NewPublisher = {
    name: '',
    birthDate: null,
    deathDate: null,
    description: ''  
  }

const newPublisherForm = atom(initialState)

export { newPublisherForm, initialState  }