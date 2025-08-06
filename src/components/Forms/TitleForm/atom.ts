import { atom } from "jotai";
import type { NewTitle } from "@/backend/api/titles";

type NewTitleFormState = NewTitle & {
  coverImageFile: File | undefined
}

const newTitleFormInitialState : NewTitleFormState = {
      name: '',
      artistsContributions: [],
      publisher: null,
      description: '',
      releaseDate: '',
      language: '', 
      coverImageFile: undefined
  }



const newTitleForm = atom<NewTitleFormState>(newTitleFormInitialState)

export { newTitleForm, newTitleFormInitialState }