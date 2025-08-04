import { Box, Button,  MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';
import { useAuthors } from '@/hooks/useAuthor';
import { createArtist } from '@/backend/api/artists';
import { useAtom } from 'jotai';
import { artistsSkillsAtom } from '@/store';
import { getArtistsSkills } from '@/backend/api/artists';

const AuthorForm = () => {
    useEffect(() => {
      getArtistsSkills()
    },[])
    const {addAuthor} = useAuthors()
    const [skills] =  useAtom(artistsSkillsAtom)
    const initialState = {
      firstName: '',
      lastName: '',
      pseudo: '',
      dateOfBirth: '',
      dateOfDeath: '',
      skills: []
    } 

    const [authorForm, setAuthorForm] = useState<{
      firstName: string,
      lastName: string,
      pseudo: string,
      dateOfBirth: string | null,
      dateOfDeath: string | null,
      skills: string[]
    }>(initialState)

    const handleSubmit = async (event :  React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      addAuthor(authorForm)
      console.log("Form submitted", authorForm) 
      const createdAuthor = await createArtist(authorForm)
      console.log(createdAuthor)
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
        <Select
          multiple
          displayEmpty
          value={authorForm.skills}
          onChange={(event) => setAuthorForm(author => ({...author, skills: Array.isArray(event?.target.value) ? event?.target.value : [event?.target.value] })) }
          renderValue={(selected) => {
            console.log("selected : ", selected)
            if(selected.length === 0){
              return <Typography sx={{color: 'text.secondary'}} >Select Skills</Typography>
            } 
            return (selected as unknown as Array<string>).join(', ')
          }}
        >
          <MenuItem disabled value="">Skills</MenuItem>
          {skills.map(skill => <MenuItem
            key={skill}
            value={skill}
          >
            {skill}
          </MenuItem>)}
        </Select>
        <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setAuthorForm(initialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
        </Box>
    </Box>
}

export default AuthorForm