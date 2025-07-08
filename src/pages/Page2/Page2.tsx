import { Box, FormLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import { useState } from 'react';
import {DatePicker} from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs';

function Page2() {

  const skills = ['writer', 'penciler', 'inker', 'letterer', 'editor', 'creator']

  const [authorForm, setAuthorForm] = useState<{
    firstName: string,
    lastName: string,
    pseudo: string,
    dateOfBirth: string,
    dateOfDeath: string,
    skills: string  | string[]
  }>({
    firstName: '',
    lastName: '',
    pseudo: '',
    dateOfBirth: '',
    dateOfDeath: '',
    skills: []
  })
  console.log(authorForm)
  return (
    <>
      <meta name="title" content="Page 2" />
      <FullSizeCentered>
        <Typography variant="h3">Add an author</Typography>
        <Box component='form' onSubmit={() => console.log('added author')} >
            <TextField 
              label="First Name"
              value={authorForm.firstName}
              onChange={(event) => setAuthorForm((author) => ({...author, firstName: event.target.value}))}
              fullWidth
            />
            <TextField 
              label="Last Name"
              value={authorForm.lastName}
              onChange={(event) => setAuthorForm((author) => ({...author, lastName: event.target.value}))}
              fullWidth
            />
            <TextField 
              label="Pseudo"
              value={authorForm.pseudo}
              onChange={(event) => setAuthorForm((author) => ({...author, pseudo: event.target.value  }))}
              fullWidth
            />
            <DatePicker 
              label="Date of birth"
              value={authorForm.dateOfBirth ? dayjs(authorForm.dateOfBirth) : undefined}
              onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfBirth: dayjs(newDate).startOf('day').format('YYYY-MM-DD')})) }
            />
            <DatePicker 
              label="Date of death"
              value={authorForm.dateOfDeath ? dayjs(authorForm.dateOfDeath) : undefined}
              onChange={(newDate) => setAuthorForm((author) => ({...author, dateOfDeath: dayjs(newDate).startOf('day').format('YYYY-MM-DD')  }))}
            />
            <Select
              multiple
              displayEmpty
              value={authorForm.skills}
              onChange={(event) => setAuthorForm(author => ({...author, skills: event?.target.value})) }
              renderValue={(selected) => {
                console.log("selected : ", selected)
                if(selected.length === 0){
                  console.log("we are in this case")
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
        </Box>
      </FullSizeCentered>
    </>
  );
}

export default Page2;
