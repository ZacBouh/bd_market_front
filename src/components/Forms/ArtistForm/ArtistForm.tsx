import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import { createArtist } from '@/backend/api/artist';
import { getArtistsSkills } from '@/backend/api/artist';
import ArtistSkillsSelect from '../Fields/Select/ArtistSkillsSelect/ArtistSkillsSelect';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';
import FormLayout, { FormLayoutSurface } from '../FormLayout/FormLayout';

export type ArtistFormProps = {
  prePopulatedName?: string,
  onSuccess?: (createdArtist?: CreatedArtist) => void
  surface?: FormLayoutSurface
}

const ArtistForm = (props : ArtistFormProps) => {
    const {prePopulatedName, onSuccess, surface = 'card'} = props
    const initialState : ArtistForm = {
      firstName: '',
      lastName: '',
      pseudo: '',
      dateOfBirth: '',
      dateOfDeath: '',
      skills: [],
      coverImageFile: undefined
    }

    const [authorForm, setAuthorForm] = useState<ArtistForm>(initialState)

    useEffect(() => {
      if(prePopulatedName){
        const names = prePopulatedName.trim().split(' ')
        const sliceIndex = names.length >= 3 ? 2 : 1
        const firstName = names.slice(0, sliceIndex).join(' ')
        const lastName = names.slice(sliceIndex).join(' ')
        setAuthorForm(form => ({
          ...form,
          firstName,
          lastName
        }))
      }
      return getArtistsSkills()
    },[prePopulatedName])
      const handleSubmit = async (event :  React.FormEvent<HTMLFormElement>) => {
      event.stopPropagation()
      event.preventDefault()
      console.log("Form submitted", authorForm)
      const createdAuthor = await createArtist(objectToFormData(authorForm))
      console.log(createdAuthor)
      onSuccess && onSuccess(createdAuthor)
    }

    return <FormLayout onSubmit={handleSubmit}
        surface={surface}
          >
        <TextField
          label="First Name"
          value={authorForm.firstName}
          onChange={(event) => setAuthorForm((author) => ({...author, firstName: event.target.value}))}
          required
        />
        <TextField
          label="Last Name"
          value={authorForm.lastName}
          onChange={(event) => setAuthorForm((author) => ({...author, lastName: event.target.value}))}
          required
        />
        <TextField
          label="Pseudo"
          value={authorForm.pseudo}
          onChange={(event) => setAuthorForm((author) => ({...author, pseudo: event.target.value  }))}
        />
        <DatePicker
          label="Date of birth"
          value={authorForm.dateOfBirth ? dayjs(authorForm.dateOfBirth) : null}
          onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfBirth: dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : ''})) }
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="Date of death"
          value={authorForm.dateOfDeath ? dayjs(authorForm.dateOfDeath) : null}
          onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfDeath: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <ArtistSkillsSelect
          multiple
          value={authorForm.skills}
          onChange={(skills) => setAuthorForm(author => ({...author, skills })) }
        />
        <FileInput
          label={"Choose a picture"}
          accept='image/*'
          direction="column"
          spacing={1}
          onFileChange={(event) => setAuthorForm(authorForm => ({...authorForm, coverImageFile: event.target.files?.[0]})) }
        />
        <FormSubmitAndResetButtons
          state={authorForm}
          handleReset={() => setAuthorForm(() => ({ ...initialState }))}
          submitLabel="Save artist"
        />
    </FormLayout>
}

export default ArtistForm
