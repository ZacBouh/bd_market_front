import { atom } from "jotai";

const initialState = {
    name: '',
    creationDate: '',
    country: ''
  }

const newPublisherForm = atom(initialState)

export { newPublisherForm, initialState  }