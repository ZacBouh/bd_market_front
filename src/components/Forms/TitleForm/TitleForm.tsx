import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import { newTitleForm } from './atom';
import { useAtom } from 'jotai';
import { useAuthors } from '@/hooks/useAuthor';
import { useTitles } from '@/hooks/useTitle';
import PublisherAutocomplete from '../Fields/Autocomplete/PublisherAutocomplete/PublisherAutocomplete';
import ArtistAutocomplete from '../Fields/Autocomplete/ArtistAutocomplete/ArtistAutocomplete';
import { title } from 'process';

import MultiArtistAutocomplete from '../Fields/Autocomplete/MultiArtistAutocomplete/MultiArtistAutocomplete';

const TitleForm = () => {
    const [titleForm, setTitleForm] = useAtom(newTitleForm)
    return  <Box component='form'  onSubmit={(event) => {
          event.preventDefault()
          console.log("Form submitted", titleForm) 
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
              label="Description"
              value={titleForm.description}
              onChange={(event) => setTitleForm((title) => ({...title, author: {...title.author, firstName: event.target.value}}))}
              fullWidth
            />
          </FormControl>
          <MultiArtistAutocomplete/>
          <ArtistAutocomplete required />
          <PublisherAutocomplete
            onChange={(_, publisher) => setTitleForm(title => ({...title, publisher: publisher?.id ?? null})) }
            required
          />
          <Box sx={{display: 'grid', gridTemplateColumns:'1fr 1fr', gap: 1}} >
          <Button onClick={() => setTitleForm(initialState)} >Reset</Button>
          <Button type='submit' >Ajouter</Button>
          </Box>
        </Box>
}

export default TitleForm