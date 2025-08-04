import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import { newTitleForm } from './atom';
import { useAtom } from 'jotai';
import { useAuthors } from '@/hooks/useAuthor';
import { useTitles } from '@/hooks/useTitle';
import PublisherAutocomplete from '../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete';

const TitleForm = () => {
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
    const {authorsList, addAuthor} = useAuthors()  
    const { titlesList, setTitlesList } = useTitles()
    
    return  <Box component='form'  onSubmit={(event) => {
          event.preventDefault()
          const authorId = addAuthor(titleForm.author).id
          setTitlesList(titlesList => [...titlesList, {...titleForm, author: authorId}])
          console.log("Form submitted", titleForm) 
          console.log("Titles", titlesList)
          console.log("Authors",authorsList) 
        }}
          sx={{width:'100%'}}
        >
          <TextField 
            label="Title"
            value={titleForm.title}
            onChange={(event) => setTitleForm((title) => ({...title, title: event.target.value}))}
            required
            fullWidth
          />
          <FormControl component='fieldset'  fullWidth>
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
          <PublisherAutocomplete
            onChange={(_, publisher) => setTitleForm(title => ({...title, publisher: publisher?.id.toString() ?? ''})) }
            required
          />
          <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setTitleForm(initialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
          </Box>
        </Box>
}

export default TitleForm