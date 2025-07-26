import { atom } from "jotai";

const newTitleForm = atom({
    title: '',
    author: {
      firstName: '',
      lastName: '',
      pseudo: ''
    },
    publisher: '',
  })

export { newTitleForm }