import { atom } from "jotai";

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