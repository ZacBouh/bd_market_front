import { Box, Button, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { FullSizeCentered } from '@/components/styled';
import { newTitleForm } from './atom';
import { useAtom } from 'jotai';
import { useAuthors } from '@/hooks/useAuthor';

function Page1() {
  const initialState = {
    title: '',
    author: {
      firstName: '',
      lastName: '',
      pseudo: ''
    },
    publisher: '',
  }
  const [titleForm, setTitleForm] = useAtom(newTitleForm)
  const {authorsList, setAuthorsList} = useAuthors()  
  
  console.log(authorsList)

  return (
    <>
      <meta name="title" content="Page 1" />
      
      <FullSizeCentered>
        <Typography variant="h3">Add a title</Typography>
        <Box component={'form'} sx={{display: 'grid', gap: 3}} onSubmit={(event) => {
          event.preventDefault()
          setAuthorsList(authorsList => [...authorsList, titleForm.author])
          console.log("Form submitted", titleForm) 
        }}>
          <TextField 
            label="Title"
            value={titleForm.title}
            onChange={(event) => setTitleForm((title) => ({...title, title: event.target.value}))}
            required
            fullWidth
          />
          <FormControl component='fieldset' sx={{display: 'grid', gap: 1}} fullWidth>
            <FormLabel component="legend" sx={{mb: 1}} >Author</FormLabel>
            <TextField 
              label="First Name"
              value={titleForm.author.firstName}
              onChange={(event) => setTitleForm((title) => ({...title, author: {...title.author, firstName: event.target.value}}))}
              fullWidth
            />
            <TextField 
              label="Last Name"
              value={titleForm.author.lastName}
              onChange={(event) => setTitleForm((title) => ({...title, author: {...title.author, lastName: event.target.value}}))}
              fullWidth
            />
            <TextField 
              label="Pseudo"
              value={titleForm.author.pseudo}
              onChange={(event) => setTitleForm((title) => ({...title, author: {...title.author, pseudo: event.target.value}}))}
              fullWidth
            />
          </FormControl>
          <TextField 
            label="Publisher"
            value={titleForm.publisher}
            onChange={(event) => setTitleForm((title) => ({...title, publisher: event.target.value}))}
            required
            fullWidth
          />
          <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setTitleForm(initialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
          </Box>
        </Box>
      </FullSizeCentered>
    </>
  );
}

export default Page1;
