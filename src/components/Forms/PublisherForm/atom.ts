import { atom } from "jotai";

const initialState : NewPublisher = {
    name: '',
    birthDate: null,
    deathDate: null,
    description: '',
    coverImageFile: undefined   
  }

const newPublisherForm = atom(initialState)

export { newPublisherForm, initialState  }