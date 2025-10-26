import { TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { createArtist, getArtistsSkills } from '@/backend/api/artist';
import ArtistSkillsSelect from '../Fields/Select/ArtistSkillsSelect/ArtistSkillsSelect';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';
import FormSubmitAndResetButtons from '../Buttons/FormSubmitAndResetButtons';
import FormLayout, { FormLayoutSurface } from '../FormLayout/FormLayout';

export type ArtistFormProps = {
  prePopulatedName?: string,
  onSuccess?: (createdArtist?: CreatedArtist) => void
  surface?: FormLayoutSurface
  initialValues?: Partial<ArtistForm>
  onSubmit?: (formData: FormData, state: ArtistForm) => Promise<unknown> | unknown
  submitLabel?: string
}

const parsePrePopulatedName = (name?: string) => {
  if (!name) {
    return { firstName: '', lastName: '' } as const
  }

  const trimmed = name.trim()
  if (!trimmed) {
    return { firstName: '', lastName: '' } as const
  }

  const parts = trimmed.split(' ')
  const sliceIndex = parts.length >= 3 ? 2 : 1
  return {
    firstName: parts.slice(0, sliceIndex).join(' '),
    lastName: parts.slice(sliceIndex).join(' '),
  } as const
}

const ArtistForm = (props : ArtistFormProps) => {
    const {prePopulatedName, onSuccess, surface = 'card', initialValues, onSubmit, submitLabel} = props

    const createInitialState = useCallback((): ArtistForm => {
      const prePopulatedNames = !initialValues?.firstName && !initialValues?.lastName
        ? parsePrePopulatedName(prePopulatedName)
        : { firstName: '', lastName: '' }

      return {
        firstName: initialValues?.firstName ?? prePopulatedNames.firstName,
        lastName: initialValues?.lastName ?? prePopulatedNames.lastName,
        pseudo: initialValues?.pseudo ?? '',
        dateOfBirth: initialValues?.dateOfBirth ?? '',
        dateOfDeath: initialValues?.dateOfDeath ?? '',
        skills: initialValues?.skills ?? [],
        coverImageFile: undefined,
      }
    }, [initialValues, prePopulatedName])

    const [authorForm, setAuthorForm] = useState<ArtistForm>(() => createInitialState())

    useEffect(() => {
      setAuthorForm(createInitialState())
    }, [createInitialState])

    useEffect(() => getArtistsSkills(), [])

    const handleSubmit = useCallback(async (event :  React.FormEvent<HTMLFormElement>) => {
      event.stopPropagation()
      event.preventDefault()
      console.log("Form submitted", authorForm)
      const formData = objectToFormData(authorForm)
      if (authorForm.dateOfBirth !== undefined) {
        formData.set('birthDate', authorForm.dateOfBirth ?? '')
      }
      if (authorForm.dateOfDeath !== undefined) {
        formData.set('deathDate', authorForm.dateOfDeath ?? '')
      }
      if (onSubmit) {
        await onSubmit(formData, authorForm)
      } else {
        const createdAuthor = await createArtist(formData)
        console.log(createdAuthor)
        onSuccess && onSuccess(createdAuthor)
        setAuthorForm(createInitialState())
      }
    }, [authorForm, createInitialState, onSubmit, onSuccess])

    const handleBirthDateChange = useCallback((newDate: dayjs.Dayjs | null) => {
      setAuthorForm((author) => ({
        ...author,
        dateOfBirth: newDate && dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : '',
      }))
    }, [])

    const handleDeathDateChange = useCallback((newDate: dayjs.Dayjs | null) => {
      setAuthorForm((author) => ({
        ...author,
        dateOfDeath: newDate && dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : '',
      }))
    }, [])

    const resetForm = useCallback(() => {
      setAuthorForm(createInitialState())
    }, [createInitialState])

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
          onChange={handleBirthDateChange}
          slotProps={{ textField: { fullWidth: true } }}
        />
        <DatePicker
          label="Date of death"
          value={authorForm.dateOfDeath ? dayjs(authorForm.dateOfDeath) : null}
          onChange={handleDeathDateChange}
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
          handleReset={resetForm}
          submitLabel={submitLabel ?? "Save artist"}
        />
    </FormLayout>
}

export default ArtistForm
