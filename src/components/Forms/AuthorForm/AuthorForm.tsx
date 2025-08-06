import { Box, Button,  MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import { createArtist } from '@/backend/api/artists';
import { useAtom } from 'jotai';
import { artistsSkillsAtom } from '@/store';
import { getArtistsSkills } from '@/backend/api/artists';
import ArtistSkillsSelect from '../Fields/Select/ArtistSkillsSelect/ArtistSkillsSelect';
import FileInput from '../Fields/FileUpload/FileInput';
import objectToFormData from '@/utils/formData';

export type AuthorFormProps = {
  prePopulatedName?: string,
  onSuccess?: (createdArtist?: CreatedArtist) => void
}

const AuthorForm = (props : AuthorFormProps) => {
    const {prePopulatedName, onSuccess} = props
    const [skills] =  useAtom(artistsSkillsAtom)
    const initialState : AuthorFormState = {
      firstName: '',
      lastName: '',
      pseudo: '',
      dateOfBirth: '',
      dateOfDeath: '',
      skills: [],
      coverImageFile: undefined
    } 
    
    const [authorForm, setAuthorForm] = useState<AuthorFormState>(initialState)
    
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

    return <Box component='form' onSubmit={handleSubmit} 
          sx={{width: '100%'}}
          >
        <TextField 
          label="First Name"
          value={authorForm.firstName}
          onChange={(event) => setAuthorForm((author) => ({...author, firstName: event.target.value}))}
          required
          fullWidth
        />
        <TextField 
          label="Last Name"
          value={authorForm.lastName}
          onChange={(event) => setAuthorForm((author) => ({...author, lastName: event.target.value}))}
          fullWidth
          required
        />
        <TextField 
          label="Pseudo"
          value={authorForm.pseudo}
          onChange={(event) => setAuthorForm((author) => ({...author, pseudo: event.target.value  }))}
          fullWidth
        />
        <DatePicker 
          label="Date of birth"
          value={authorForm.dateOfBirth ? dayjs(authorForm.dateOfBirth) : null}
          onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfBirth: dayjs(newDate).isValid() ? dayjs(newDate).startOf('day').format('YYYY-MM-DD') : ''})) }
        />
        <DatePicker 
          label="Date of death"
          value={authorForm.dateOfDeath ? dayjs(authorForm.dateOfDeath) : null}
          onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfDeath: dayjs(newDate).startOf('day').format('YYYY-MM-DD')}))}
        />
        <ArtistSkillsSelect
          multiple
          displayEmpty
          value={authorForm.skills}
          onChange={(event) => setAuthorForm(author => ({...author, skills: Array.isArray(event?.target.value) ? event?.target.value : [event?.target.value] })) }
        >
          <MenuItem disabled value="">Skills</MenuItem>
          {skills.map(skill => <MenuItem
            key={skill}
            value={skill}
          >
            {skill}
          </MenuItem>)}
        </ArtistSkillsSelect>
        <FileInput 
          label={"Choose a picture"}  
          accept='image/*'
          onFileChange={(event) => setAuthorForm(authorForm => ({...authorForm, coverImageFile: event.target.files?.[0]})) }
        />
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setAuthorForm(initialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AuthorForm