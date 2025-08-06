import { atom } from "jotai";
import type { NewTitle } from "@/backend/api/titles";

type NewTitleFormState = NewTitle 

const newTitleFormInitialState : NewTitleFormState = {
      name: '',
      artistsContributions: [],
      publisher: null,
      description: '',
      releaseDate: '',
      language: ''
  }



const newTitleForm = atom<NewTitleFormState>(newTitleFormInitialState)

export { newTitleForm, newTitleFormInitialState }