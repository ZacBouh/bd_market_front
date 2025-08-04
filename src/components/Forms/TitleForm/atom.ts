import { CreatedArtist } from "@/backend/api/artists";
import { CreatedPublisher } from "@/backend/api/publishers";
import { atom } from "jotai";

type NewTitleFormState = {
    title: string,
    artists : CreatedArtist['id'][],
    publisher: CreatedPublisher['id'] | null, 
    description: string
} 

const newTitleFormInitialState = {
      title: '',
      artists: [],
      publisher: null,
      description: ''
  }



const newTitleForm = atom<NewTitleFormState>(newTitleFormInitialState)

export { newTitleForm, newTitleFormInitialState }