import { Box, FormLabel, TextField, Typography } from '@mui/material';

import { FullSizeCentered } from '@/components/styled';
import { useState } from 'react';

function Page2() {

  const [authorForm, setAuthorForm] = useState({
    firstName: '',
    lastName: '',
    pseudo: '',
    dateOfBirth: '',
    dateOfDeath: '',
    skills: ''
  })
  return (
    <>
      <meta name="title" content="Page 2" />
      <FullSizeCentered>
        <Typography variant="h3">Add an author</Typography>
        <Box component='form' onSubmit={() => console.log('added author')} >
        <FormLabel component="legend" sx={{mb: 1}} >Author</FormLabel>
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
            <TextField 
              label="Date of birth"
              value={authorForm.pseudo}
              onChange={(event) => setAuthorForm((author) => ({...author, pseudo: event.target.value  }))}
              fullWidth
            />
            <TextField 
              label="Date of death"
              value={authorForm.pseudo}
              onChange={(event) => setAuthorForm((author) => ({...author, pseudo: event.target.value  }))}
              fullWidth
            />

        </Box>
      </FullSizeCentered>
    </>
  );
}

export default Page2;
